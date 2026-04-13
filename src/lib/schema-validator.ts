/**
 * Schema Validator
 *
 * Runtime validation of JSON content against atom schemas.
 * Used by the Cloudflare Worker to reject invalid content before rendering.
 *
 * The schema is the contract. If a prop isn't in the schema, it doesn't render.
 * If a value isn't in the enum, it's rejected. No freeform CSS, no escape hatches.
 *
 * Usage:
 *   import { validateComponent } from '../lib/schema-validator';
 *   import schema from '../components/atoms/Badge/Badge.schema.json';
 *
 *   const result = validateComponent(jsonItem, schema);
 *   if (!result.valid) {
 *     // result.errors contains what went wrong
 *     // result.sanitized contains the item with invalid props stripped
 *   }
 */

interface SchemaField {
  type?: string | string[];
  required?: boolean;
  enum?: (string | number | boolean)[];
  default?: any;
  textonly?: boolean;
}

interface SchemaProps {
  content?: Record<string, SchemaField>;
  visual?: Record<string, SchemaField>;
  animation?: Record<string, SchemaField>;
  colour?: Record<string, SchemaField>;
}

export interface ComponentSchema {
  component: string;
  category: string;
  renders: Record<string, string | null>;
  props: SchemaProps;
}

interface ValidationError {
  prop: string;
  value: any;
  message: string;
  severity: 'error' | 'warn';
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  sanitized: Record<string, any>;
}

// Content prop prefixes — these carry displayable content
const CONTENT_PREFIXES = ['contentHeading', 'contentText', 'contentBadge', 'contentLink', 'contentList'];

// CSS values that must never appear in JSON content
const CSS_PATTERNS = [
  /^var\(--/,
  /^#[0-9a-fA-F]{3,8}$/,
  /^rgba?\(/,
  /^hsla?\(/,
  /^\d+px$/,
  /^\d+rem$/,
  /^\d+em$/,
];

// Structural props that aren't in schemas
const STRUCTURAL_PROPS = new Set(['component', 'children', 'ref', 'printOutput']);

// Astro-only props that must never be in JSON content
const FORBIDDEN_PROPS = new Set(['class', 'style']);

/**
 * Flatten schema prop groups into a single map for lookup
 */
function flattenSchema(schema: ComponentSchema): Map<string, SchemaField & { group: string }> {
  const flat = new Map<string, SchemaField & { group: string }>();
  for (const [group, groupProps] of Object.entries(schema.props)) {
    if (typeof groupProps !== 'object' || groupProps === null) continue;
    for (const [prop, def] of Object.entries(groupProps)) {
      if (prop.startsWith('_')) continue;
      flat.set(prop, { ...def, group });
    }
  }
  return flat;
}

/**
 * Validate a single component JSON object against its schema.
 * Returns validation result with errors and a sanitized copy (invalid props stripped).
 */
export function validateComponent(
  item: Record<string, any>,
  schema: ComponentSchema
): ValidationResult {
  const errors: ValidationError[] = [];
  const sanitized: Record<string, any> = {};
  const flat = flattenSchema(schema);

  // Copy structural props through
  for (const key of STRUCTURAL_PROPS) {
    if (key in item) sanitized[key] = item[key];
  }

  // Check required props
  for (const [prop, def] of flat.entries()) {
    if (def.required && !(prop in item)) {
      errors.push({
        prop,
        value: undefined,
        message: `required prop "${prop}" is missing`,
        severity: 'error',
      });
    }
  }

  // Validate each prop
  for (const [key, value] of Object.entries(item)) {
    if (STRUCTURAL_PROPS.has(key)) continue;

    // Forbidden props
    if (FORBIDDEN_PROPS.has(key)) {
      errors.push({
        prop: key,
        value,
        message: `"${key}" is an Astro-only prop — not allowed in JSON content`,
        severity: 'error',
      });
      continue;
    }

    // Unknown prop
    const def = flat.get(key);
    if (!def) {
      // Content prop on wrong component — helpful error
      const isContentProp = CONTENT_PREFIXES.some(p => key === p);
      errors.push({
        prop: key,
        value,
        message: isContentProp
          ? `content prop "${key}" not in ${schema.component} schema — wrong component?`
          : `unknown prop "${key}" — not in schema`,
        severity: 'error',
      });
      continue;
    }

    // CSS value check (strings only)
    if (typeof value === 'string') {
      for (const pattern of CSS_PATTERNS) {
        if (pattern.test(value)) {
          errors.push({
            prop: key,
            value,
            message: `CSS value "${value}" not allowed — use enum`,
            severity: 'error',
          });
          break;
        }
      }
    }

    // Enum check
    if (def.enum && value !== undefined && value !== null) {
      if (!def.enum.includes(value)) {
        errors.push({
          prop: key,
          value,
          message: `"${value}" not in enum [${def.enum.join(', ')}]`,
          severity: 'error',
        });
        continue; // Don't include invalid enum values in sanitized output
      }
    }

    // Type check
    const expectedType = Array.isArray(def.type) ? def.type : [def.type];
    if (def.type && value !== undefined && value !== null) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      const typeOk = expectedType.some(t => {
        if (t === 'string') return actualType === 'string';
        if (t === 'number') return actualType === 'number';
        if (t === 'boolean') return actualType === 'boolean';
        if (t === 'array') return actualType === 'array';
        if (t === 'object') return actualType === 'object';
        if (t === 'token') return actualType === 'string'; // pipeline tokens are strings
        return true;
      });
      if (!typeOk) {
        errors.push({
          prop: key,
          value,
          message: `expected ${expectedType.join('|')}, got ${actualType}`,
          severity: 'error',
        });
        continue;
      }
    }

    // Nested media object — validate component enum
    if (key === 'media' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const mediaComponent = value.component;
      const mediaDef = def as any;
      if (mediaDef.properties?.component?.enum && mediaComponent) {
        if (!mediaDef.properties.component.enum.includes(mediaComponent)) {
          errors.push({
            prop: `${key}.component`,
            value: mediaComponent,
            message: `media component "${mediaComponent}" not in enum [${mediaDef.properties.component.enum.join(', ')}]`,
            severity: 'error',
          });
        }
      }
    }

    // Passed all checks — include in sanitized output
    sanitized[key] = value;
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate an entire page JSON tree recursively.
 * Returns all errors across all components.
 */
export function validatePage(
  node: any,
  schemaMap: Map<string, ComponentSchema>,
  path = '$'
): ValidationError[] {
  if (!node || typeof node !== 'object') return [];

  if (Array.isArray(node)) {
    return node.flatMap((child, i) =>
      validatePage(child, schemaMap, `${path}[${i}]`)
    );
  }

  const errors: ValidationError[] = [];

  if (node.component && schemaMap.has(node.component)) {
    const schema = schemaMap.get(node.component)!;
    const result = validateComponent(node, schema);
    for (const err of result.errors) {
      errors.push({
        ...err,
        message: `${path} ${node.component}.${err.prop}: ${err.message}`,
      });
    }
  }

  // Recurse into children and any nested objects
  for (const [key, val] of Object.entries(node)) {
    if (key === 'component') continue;
    if (typeof val === 'object' && val !== null) {
      errors.push(...validatePage(val, schemaMap, `${path}.${key}`));
    }
  }

  return errors;
}
