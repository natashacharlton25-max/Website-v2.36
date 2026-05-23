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

// Declarative rule — evaluated against the JSON item. When `condition`
// is true, `action` is emitted as a validation message at the given
// severity. Conditions are JS expressions evaluated with the item's
// props in scope (see evaluateRules below). 'info' rules are docs only
// and never emit messages.
interface SchemaRule {
  rule: string;
  condition: string;
  action: string;
  severity?: 'error' | 'warn' | 'info';
}

export interface ComponentSchema {
  component: string;
  category: string;
  renders: Record<string, string | null>;
  props: SchemaProps;
  _rules?: SchemaRule[];
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

// Content prop prefixes — these carry displayable content (free strings allowed)
// Matches:
//   content* — contentBadge, contentHeading, contentHeadingSubtitle, etc.
//             (visible text rendered into the page)
//   label*  — labelIcon, labelShape, labelButton, etc.
//             (a11y labels: aria-label / textonly swap)
// Both are atom-suffixed so the prop name reveals which atom owns it
// and avoids collisions when atoms compose other atoms.
const isContentProp = (prop: string) =>
  prop.startsWith('content') || /^label[A-Z]/.test(prop);

// Props that accept free strings without an enum.
// Two categories live here together:
//   1. Legacy content props (label, placeholder, description, error) —
//      kept for back-compat with pre-rename schemas.
//   2. Data/wiring props (id, name, value, radioValue, pattern, text,
//      subtitle, ariaLabel) — constrained by HTML semantics or by their
//      own `pattern` field, not by an enum.
const FREE_STRING_PROPS = new Set([
  'label', 'subtitle', 'ariaLabel', 'placeholder', 'description', 'error',
  'value', 'id', 'name', 'radioValue', 'pattern', 'text',
]);

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
 * Validate the schema itself — catch missing enums, bad types.
 * Runs once per schema on first use.
 */
const validatedSchemas = new Set<string>();
function validateSchemaIntegrity(schema: ComponentSchema): void {
  if (validatedSchemas.has(schema.component)) return;
  validatedSchemas.add(schema.component);

  const flat = flattenSchema(schema);
  for (const [prop, def] of flat.entries()) {
    const types = Array.isArray(def.type) ? def.type : [def.type];
    const isString = types.includes('string');
    const isBoolean = types.includes('boolean');
    const isObject = types.includes('object');
    const isArray = types.includes('array');
    const isContent = isContentProp(prop);
    const isFreeString = FREE_STRING_PROPS.has(prop);
    const hasFormat = !!(def as any)._format;

    // String props MUST have enum — unless content*, label<Atom>, free string, or has _format
    if (isString && !isBoolean && !isObject && !isArray && !def.enum && !isContent && !isFreeString && !hasFormat) {
      console.warn(`[Schema] ${schema.component}.${prop}: string prop without enum — add enum, or use content* prefix (visible text) or label<Atom> (a11y label)`);
    }

    // Media props MUST declare component enum
    if (prop === 'media' && isObject) {
      const mediaDef = def as any;
      if (!mediaDef.properties?.component?.enum) {
        console.warn(`[Schema] ${schema.component}.media: missing component enum — declare accepted media types`);
      }
      if (!mediaDef.properties?.semanticRole) {
        console.warn(`[Schema] ${schema.component}.media: missing semanticRole — media must declare intent`);
      }
    }
  }
}

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
 * Evaluate schema._rules against the item. Each rule's `condition` is a
 * JS expression evaluated with the item's props in scope (via `with`).
 * When condition is true (and severity is not 'info'), the rule's
 * `action` is pushed as a validation message at the declared severity.
 *
 * Conditions come from schema JSON in-repo (not user input), so
 * arbitrary-code evaluation is safe in this context. Bad conditions
 * (syntax errors, runtime errors) are caught and logged once per rule.
 */
const ruleEvalWarned = new Set<string>();
function evaluateRules(
  item: Record<string, any>,
  schema: ComponentSchema,
  errors: ValidationError[]
): void {
  if (!schema._rules || schema._rules.length === 0) return;
  // Proxy lets the condition reference any prop name as a local var via
  // `with(item)`. The `has` trap returns false for globals (Array, Object,
  // Boolean, undefined, etc.) so they fall through to outer scope normally,
  // and true for everything else so missing props resolve to `undefined`
  // (via the get trap) instead of throwing ReferenceError.
  const safeItem = new Proxy(item, {
    has(_target, prop) {
      if (typeof prop === 'string' && prop in globalThis) return false;
      return true;
    },
    get(target, prop) {
      return (target as Record<string | symbol, any>)[prop as any];
    },
  });
  for (const rule of schema._rules) {
    if (rule.severity === 'info') continue;
    let conditionMet = false;
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
      const fn = new Function('item', `with(item) { return Boolean(${rule.condition}); }`);
      conditionMet = !!fn(safeItem);
    } catch (e) {
      const key = `${schema.component}:${rule.rule}`;
      if (!ruleEvalWarned.has(key)) {
        ruleEvalWarned.add(key);
        console.warn(`[Schema] ${schema.component}: rule "${rule.rule}" failed to evaluate — ${(e as Error).message}`);
      }
      continue;
    }
    if (conditionMet) {
      // Default severity is 'error' — rule violations are hard errors
      // because the point of declarative rules is to prevent bad input.
      // Opt-in to 'warn' explicitly when a rule is advisory (e.g.
      // "this prop is a no-op for this type, not actually broken").
      errors.push({
        prop: rule.rule,
        value: undefined,
        message: rule.action,
        severity: rule.severity === 'warn' ? 'warn' : 'error',
      });
    }
  }
}

/**
 * Validate a single component JSON object against its schema.
 * Returns validation result with errors and a sanitized copy (invalid props stripped).
 */
export function validateComponent(
  item: Record<string, any>,
  schema: ComponentSchema
): ValidationResult {
  // Validate schema integrity on first use
  validateSchemaIntegrity(schema);

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
      const isContent = isContentProp(key);
      errors.push({
        prop: key,
        value,
        message: isContent
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

    // Enum check. When the schema declares a union type like
    // ["number", "string"] (size props that accept either a token or
    // explicit pixel number), the enum applies only to the STRING side
    // — numbers are always free-form. Skip the enum check for numeric
    // values when the type union includes "number".
    if (def.enum && value !== undefined && value !== null) {
      const numericInUnion = Array.isArray(def.type) && def.type.includes('number') && typeof value === 'number';
      if (!numericInUnion && !def.enum.includes(value)) {
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

    // _ref objects — validate props against referenced atom schema.
    // (textStyle props on List/Link enumerate Text props inline now,
    //  so this path is reserved for FULL atom-instance refs only.)
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && (def as any)._ref) {
      const refName = (def as any)._ref;
      if (typeof globalThis !== 'undefined' && (globalThis as any).__schemaMap) {
        const refSchema = (globalThis as any).__schemaMap.get(refName);
        if (refSchema) {
          const refResult = validateComponent(value, refSchema);
          for (const err of refResult.errors) {
            errors.push({
              prop: `${key}.${err.prop}`,
              value: err.value,
              message: err.message,
              severity: err.severity,
            });
          }
        }
      }
    }

    // Passed all checks — include in sanitized output
    sanitized[key] = value;
  }

  // Schema-level declarative rules (render rules + cross-prop validators)
  evaluateRules(item, schema, errors);

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
