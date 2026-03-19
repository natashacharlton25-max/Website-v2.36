/**
 * Render Pipeline
 *
 * Reads render-rules.json to strip/keep/override props per render mode.
 * Content JSON items can declare renderOverrides to diverge from defaults.
 *
 * Usage:
 *   import { renderProps } from '../lib/render-pipeline';
 *   import rules from '../lib/render-rules.json';
 *   import schema from '../components/atoms/Heading/Heading.schema.json';
 *
 *   const fullProps = renderProps(item, schema, 'full', rules);
 *   const reducedProps = renderProps(item, schema, 'reduced', rules);
 *   const textonlyProps = renderProps(item, schema, 'textonly', rules);
 */

interface RenderRule {
  include: string[];
  strip: string[];
  forceProps?: Record<string, any>;
}

interface RenderRules {
  renders: Record<string, RenderRule>;
}

interface SchemaField {
  type?: string;
  [key: string]: any;
}

interface Schema {
  content?: Record<string, SchemaField>;
  visual?: Record<string, SchemaField>;
  animation?: Record<string, SchemaField>;
  colour?: Record<string, SchemaField>;
  [key: string]: Record<string, SchemaField> | undefined;
}

interface RenderOverrides {
  keep?: string[];
  override?: Record<string, any>;
}

interface ContentItem {
  renderOverrides?: Record<string, RenderOverrides>;
  [key: string]: any;
}

/**
 * Resolve props for a given render mode.
 *
 * 1. Read the rule for this mode from render-rules.json
 * 2. Include props from allowed groups, strip the rest
 * 3. Apply item-level renderOverrides (keep + override)
 * 4. Apply forceProps from the rule
 */
export function renderProps(
  item: ContentItem,
  schema: Schema,
  mode: string,
  rules: RenderRules
): Record<string, any> {
  const rule = rules.renders[mode];
  if (!rule) return item;

  const result: Record<string, any> = {};
  const stripGroups = new Set(rule.strip);
  const includeGroups = new Set(rule.include);

  // Collect all prop names per schema group
  const propsInStrippedGroups = new Set<string>();
  const propsInIncludedGroups = new Set<string>();

  for (const [groupName, fields] of Object.entries(schema)) {
    if (!fields || typeof fields !== 'object') continue;
    const propNames = Object.keys(fields);

    if (stripGroups.has(groupName)) {
      propNames.forEach(p => propsInStrippedGroups.add(p));
    }
    if (includeGroups.has(groupName)) {
      propNames.forEach(p => propsInIncludedGroups.add(p));
    }
  }

  // Copy props that are in included groups and not in stripped groups
  for (const [key, value] of Object.entries(item)) {
    if (key === 'renderOverrides') continue;

    if (propsInStrippedGroups.has(key) && !propsInIncludedGroups.has(key)) {
      // Stripped — skip unless item overrides
      continue;
    }
    result[key] = value;
  }

  // Apply per-item renderOverrides
  const overrides = item.renderOverrides?.[mode];
  if (overrides) {
    // Keep: restore props that were stripped
    if (overrides.keep) {
      for (const propName of overrides.keep) {
        if (item[propName] !== undefined) {
          result[propName] = item[propName];
        }
      }
    }

    // Override: replace/add props
    if (overrides.override) {
      for (const [key, value] of Object.entries(overrides.override)) {
        if (value === null) {
          delete result[key];
        } else {
          result[key] = value;
        }
      }
    }
  }

  // Apply forceProps from rule
  if (rule.forceProps) {
    Object.assign(result, rule.forceProps);
  }

  return result;
}

/**
 * Merge colour tokens into inline style string.
 * Reads schema colour section's cssProperty mappings.
 */
export function mergeColourStyle(
  item: ContentItem,
  colourDefaults: Record<string, string>,
  schema: Schema
): string {
  const colourSection = schema.colour || {};
  const parts: string[] = [];

  for (const [key, def] of Object.entries(colourSection)) {
    const cssProperty = (def as any).cssProperty;
    if (!cssProperty) continue;

    // Item style overrides > colour defaults
    const value = colourDefaults[key];
    if (value) {
      parts.push(`${cssProperty}: ${value}`);
    }
  }

  // Append any item-level style
  if (item.style) {
    parts.push(item.style);
  }

  return parts.join('; ');
}
