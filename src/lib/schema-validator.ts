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

// Declarative rule — evaluated against the JSON item. Multiple shapes
// have grown across atoms; the validator recognises:
//
//   condition + action          → emit `action` if condition true
//   condition + requires        → emit if condition true AND requires false
//   condition + excludes        → emit if condition true AND excludes true
//   condition + forbid/forbids  → emit if forbidden props appear in scope
//   _runtime: true              → info (runtime handles; docs only)
//   _action (underscore prefix) → info (docs about runtime behaviour)
//   note only (no condition)    → info (pure docs)
//
// Severity:
//   - explicit `severity` always wins
//   - actions describing runtime behaviour (auto-strips, auto-injects,
//     "runtime", "falls back") → info, even if `action` is set
//   - otherwise: 'error' default
interface SchemaRule {
  rule: string;
  condition?: string;
  action?: string;
  note?: string;
  requires?: string;
  excludes?: string;
  forbid?: string[];
  forbids?: string[];
  scope?: 'root' | 'media' | string;
  when?: string;
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
// Project rule: every schema prop is either an enum OR a free string
// whose validation lives in the atom's runtime (.astro frontmatter).
// This list names the legitimately free strings — atoms own their
// runtime validation; the schema integrity check just stops warning.
//
// Two categories live here together:
//   1. Legacy content props (label, placeholder, description, error) —
//      kept for back-compat with pre-rename schemas.
//   2. Data/wiring props (id, name, value, radioValue, pattern, text,
//      subtitle, ariaLabel, href, role, download) — atom-side runtime
//      validation, not a fixed enum.
const FREE_STRING_PROPS = new Set([
  'label', 'subtitle', 'ariaLabel', 'placeholder', 'description', 'error',
  'value', 'id', 'name', 'radioValue', 'pattern', 'text',
  'href', 'role', 'download',
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

// Behaviour-description action text — keywords that mean "runtime does
// this automatically", not "author violated something". Auto-detected
// from `action` text so legacy rules don't need editing.
const BEHAVIOUR_KEYWORDS = /\b(auto[- ](?:injects?|strips?|downgrades?|fix(?:es)?)|atom\s+(?:strips?|handles?|injects?|fix(?:es)?|guarantees?)|runtime\s+(?:guarantee|auto|handles?|injects?|strips?)|computed\s+at\s+runtime|falls?\s+back|stripped\s+at\s+runtime|runtime[- ]auto[- ]strip|overridden\b)/i;

function isBehaviourRule(rule: SchemaRule): boolean {
  const anyRule = rule as any;
  if (anyRule._runtime === true) return true;
  if (typeof anyRule._action === 'string') return true;
  if (rule.action && BEHAVIOUR_KEYWORDS.test(rule.action)) return true;
  return false;
}

function safeEval(condition: string, safeItem: Record<string, any>, schema: ComponentSchema, ruleName: string): boolean | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const fn = new Function('item', `with(item) { return Boolean(${condition}); }`);
    return !!fn(safeItem);
  } catch (e) {
    const key = `${schema.component}:${ruleName}:${condition}`;
    if (!ruleEvalWarned.has(key)) {
      ruleEvalWarned.add(key);
      console.warn(`[Schema] ${schema.component}: rule "${ruleName}" failed to evaluate "${condition}" — ${(e as Error).message}`);
    }
    return null;
  }
}

/**
 * Build the eval-context proxy for a rule's expressions.
 * - `localScope` is the object whose props become local vars under `with`.
 *   For `scope: "media"` rules this is `item.media`; otherwise it's `item`.
 * - `root` is always the original item — exposed as `root.*` so rules
 *   scoped to media can still reference the parent button/heading/etc.
 * - Globals (Array, Object, Boolean, undefined…) fall through via `has`.
 * - Missing props on localScope resolve to undefined (not ReferenceError).
 */
function makeRuleProxy(localScope: Record<string, any>, root: Record<string, any>): any {
  return new Proxy(localScope, {
    has(_target, prop) {
      if (prop === 'root') return true;
      if (typeof prop === 'string' && prop in globalThis) return false;
      return true;
    },
    get(target, prop) {
      if (prop === 'root') return root;
      return (target as Record<string | symbol, any>)[prop as any];
    },
  });
}

function evaluateRules(
  item: Record<string, any>,
  schema: ComponentSchema,
  errors: ValidationError[]
): void {
  if (!schema._rules || schema._rules.length === 0) return;

  for (const rule of schema._rules) {
    // Severity: explicit wins; otherwise behaviour rules = info, else error.
    const effectiveSeverity = rule.severity ?? (isBehaviourRule(rule) ? 'info' : 'error');
    if (effectiveSeverity === 'info') continue;

    // Rule without any condition or constraint is docs-only — skip.
    if (!rule.condition && !rule.when) continue;

    // Resolve local eval scope per rule's `scope` field.
    //   undefined / "root" → evaluate against item itself
    //   "media"           → evaluate against item.media (with `root` pointing to item)
    // Future scopes can extend this branch.
    let localScope: Record<string, any>;
    if (rule.scope === 'media') {
      const media = (item as any).media;
      // Rule is N/A when media isn't set — skip silently rather than misfire.
      if (!media || typeof media !== 'object') continue;
      localScope = media;
    } else {
      localScope = item;
    }
    const safeItem = makeRuleProxy(localScope, item);

    // Primary condition (or `when` precondition) must be true to fire.
    const conditionExpr = rule.condition ?? rule.when;
    if (!conditionExpr) continue;
    const conditionMet = safeEval(conditionExpr, safeItem, schema, rule.rule);
    if (conditionMet === null || !conditionMet) continue;

    // Now check the rule's specific shape for a violation:
    let violation: string | null = null;

    if (rule.requires) {
      // `requires` is itself a JS expression that must be true.
      const reqMet = safeEval(rule.requires, safeItem, schema, rule.rule);
      if (reqMet === false) {
        violation = `${rule.rule}: requires ${rule.requires} (not met)${rule.note ? ` — ${rule.note}` : ''}`;
      }
    } else if (rule.excludes) {
      // `excludes` is a JS expression that must be false.
      const excMet = safeEval(rule.excludes, safeItem, schema, rule.rule);
      if (excMet === true) {
        violation = `${rule.rule}: excludes ${rule.excludes} (present)${rule.note ? ` — ${rule.note}` : ''}`;
      }
    } else if (Array.isArray(rule.forbid) || Array.isArray(rule.forbids)) {
      // `forbid`/`forbids` is a list of prop names that must not appear
      // in the local scope (already resolved per rule.scope above).
      const forbidden = (rule.forbid ?? rule.forbids)!;
      const present = forbidden.filter((k) => k in localScope && (localScope as any)[k] !== undefined);
      if (present.length > 0) {
        violation = `${rule.rule}: forbidden ${rule.scope ?? 'root'} prop${present.length === 1 ? '' : 's'} ${present.join(', ')}${rule.note ? ` — ${rule.note}` : ''}`;
      }
    } else if (rule.action) {
      // Plain action rule — condition true = violation, action describes fix.
      violation = rule.action;
    }

    if (violation) {
      errors.push({
        prop: rule.rule,
        value: undefined,
        message: violation,
        severity: effectiveSeverity === 'warn' ? 'warn' : 'error',
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

  // Check required props. A prop that declares a `default` is satisfied by
  // that default at runtime (the renderer/atom applies it), so an omitted
  // required+default prop is NOT an error — this matches runtime behaviour and
  // resolves the required-vs-default contradiction the media-node pattern uses
  // (e.g. Image/Icon declare semanticRole as required:true + default).
  for (const [prop, def] of flat.entries()) {
    if (def.required && !(prop in item) && (def as any).default === undefined) {
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

    // Nested component-node slot — validate the child's `component` against
    // the slot's accept-list. (B) Move 1: generalised off the old
    // `key === 'media'` hardcode — ANY slot whose def declares
    // `properties.component.enum` is a component node (media, and Card's
    // title/meta/body/button). Behaviour is identical to the previous
    // media-only check; it is just no longer tied to the prop name. Safe
    // globally: existing media nodes already carry valid components, and no
    // other atom has a non-media component-node slot yet.
    const nodeDef = def as any;
    const isComponentNode =
      !!nodeDef.properties?.component?.enum &&
      typeof value === 'object' && value !== null && !Array.isArray(value);
    if (isComponentNode) {
      const childComponent = (value as any).component;
      if (childComponent && !nodeDef.properties.component.enum.includes(childComponent)) {
        errors.push({
          prop: `${key}.component`,
          value: childComponent,
          message: `component "${childComponent}" not in enum [${nodeDef.properties.component.enum.join(', ')}]`,
          severity: 'error',
        });
      }
    }

    // Nested component-node DEEP validation — opt-in via `_lockProps` (D2).
    // (B) Move 2: once `component` names the child atom, recurse the slot's
    // value against the child atom's FULL schema (looked up by `component`) —
    // the SAME recursion the `_ref` path uses, auto-targeted by `component`
    // instead of a `_ref` key. The child's schema is the one source of truth
    // for its own props; the parent never re-declares them. `component` is
    // skipped by the child as a structural prop; every other node prop
    // (semanticRole, …) is a forwarded prop the child owns and validates.
    // Errors accumulate into the same array (no throw) and carry the dotted
    // path (e.g. `title.level`). Opt-in keeps the blast radius to flagged
    // slots — existing media nodes stay untouched until their own audit.
    if (nodeDef._lockProps && isComponentNode) {
      const childComponent = (value as any).component;
      if (!childComponent) {
        errors.push({
          prop: `${key}.component`,
          value: undefined,
          message: `required prop "component" is missing`,
          severity: 'error',
        });
      } else if (typeof globalThis !== 'undefined' && (globalThis as any).__schemaMap) {
        const childSchema = (globalThis as any).__schemaMap.get(childComponent);
        if (childSchema) {
          const childResult = validateComponent(value, childSchema);
          for (const err of childResult.errors) {
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

    // Array-valued prop with a declared item shape (`def.items.properties`):
    // validate each element against the item shape — required item-props,
    // unknown item-props, and enums — and recurse component-nodes inside an
    // item (Move 1 always; Move 2 deep when the item-node carries `_lockProps`).
    // This is the array-nested counterpart of the per-prop loop above; it is
    // what reaches FormField `options[*].media` and Button `dropdownItems[*]`
    // (validatePage deliberately does NOT recurse arrays as standalone atoms —
    // the parent validates its own array slot here, against its declared shape).
    if (Array.isArray(value) && (def as any).items?.properties) {
      const itemProps = (def as any).items.properties as Record<string, any>;
      value.forEach((el: any, idx: number) => {
        if (!el || typeof el !== 'object' || Array.isArray(el)) return;
        // required item-props (default-aware, same as the top-level check)
        for (const [ik, idef] of Object.entries(itemProps)) {
          if ((idef as any).required && !(ik in el) && (idef as any).default === undefined) {
            errors.push({ prop: `${key}[${idx}].${ik}`, value: undefined, message: `required prop "${ik}" is missing`, severity: 'error' });
          }
        }
        for (const [ik, iv] of Object.entries(el)) {
          if (ik.startsWith('_')) continue;
          const idef = itemProps[ik] as any;
          if (!idef) {
            errors.push({ prop: `${key}[${idx}].${ik}`, value: iv, message: `unknown prop "${ik}" — not in schema`, severity: 'error' });
            continue;
          }
          if (idef.enum && iv !== undefined && iv !== null && !idef.enum.includes(iv)) {
            errors.push({ prop: `${key}[${idx}].${ik}`, value: iv, message: `"${iv}" not in enum [${idef.enum.join(', ')}]`, severity: 'error' });
            continue;
          }
          // component-node inside the item (e.g. options[*].media): Move 1 + Move 2
          if (idef.properties?.component?.enum && iv && typeof iv === 'object' && !Array.isArray(iv)) {
            const childComp = (iv as any).component;
            if (childComp && !idef.properties.component.enum.includes(childComp)) {
              errors.push({ prop: `${key}[${idx}].${ik}.component`, value: childComp, message: `component "${childComp}" not in enum [${idef.properties.component.enum.join(', ')}]`, severity: 'error' });
            }
            if (idef._lockProps && childComp && (globalThis as any).__schemaMap) {
              const childSchema = (globalThis as any).__schemaMap.get(childComp);
              if (childSchema) {
                const childResult = validateComponent(iv, childSchema);
                for (const cErr of childResult.errors) {
                  errors.push({ prop: `${key}[${idx}].${ik}.${cErr.prop}`, value: cErr.value, message: cErr.message, severity: cErr.severity });
                }
              }
            }
          }
        }
      });
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

  // Recurse only into `children` — that's the canonical place for nested
  // component instances. Other nested objects (media, dropdownItems,
  // options[*].media, etc.) are parent-handled slots, not standalone
  // atom instances; the parent's schema declares their shape and the
  // parent's runtime supplies whatever defaults the inner atom needs.
  // Recursing into them produces false "required prop missing" errors.
  if (Array.isArray(node.children)) {
    errors.push(...validatePage(node.children, schemaMap, `${path}.children`));
  }

  return errors;
}
