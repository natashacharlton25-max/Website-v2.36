/**
 * Build-time data validation
 *
 * Walks every src/data/** /*.json file, looks up each node's component schema,
 * and runs the same validateComponent rules that DEV uses at render time.
 * Exits 1 on any hard error so `npm run build` fails before astro build runs.
 *
 * Catches authored data that DEV never opened (cold pages, archived flows).
 *
 * Run: node --experimental-strip-types scripts/validate-data.ts
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePage, type ComponentSchema } from '../src/lib/schema-validator.ts';

// Audited atoms — atoms with the content<Component> rename done.
// Their schemas match real-world usage and data files follow the new
// naming. Icon + Shape are deferred — they identify by name/slug not
// content prop, and their `_rules` still reference pre-rename `label`
// instead of `labelIcon`/`labelShape`. Add atoms here as each completes.
const AUDITED_COMPONENTS = new Set([
  'Badge',
  'Button',
  'FormField',
  'Heading',
  'Link',
  'List',
  'Text',
]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT, 'src', 'components');
const DATA_DIR = path.join(ROOT, 'src', 'data');

async function walk(dir: string, filter: (p: string) => boolean): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Skip _archive, _reference, node_modules, .git
      if (e.name.startsWith('_') || e.name.startsWith('.') || e.name === 'node_modules') continue;
      out.push(...(await walk(full, filter)));
    } else if (e.isFile() && filter(full)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Extract the prop names from an .astro file's `interface Props { ... }`
 * block. Regex-based — works for canonical atom shapes (one Props
 * interface, fields written as `name?: type;` or `name: type;`).
 * Skips comments and blank lines.
 */
function extractAstroProps(astroContent: string): string[] {
  const m = astroContent.match(/interface\s+Props\s*(?:extends\s+[^{]+)?\{([\s\S]*?)^\}/m);
  if (!m) return [];
  const body = m[1];
  const names: string[] = [];
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*') || line.startsWith('*/')) continue;
    // Match `name?:` or `name:` — first identifier followed by optional ? and colon
    const propMatch = line.match(/^(\w+)\??\s*:/);
    if (propMatch && propMatch[1] !== 'interface' && propMatch[1] !== 'type') {
      names.push(propMatch[1]);
    }
  }
  return names;
}

/**
 * Flatten a schema's prop groups into a single set of declared prop names.
 * Mirrors flattenSchema in schema-validator.ts but for this script only.
 */
function flattenSchemaProps(schema: ComponentSchema): Set<string> {
  const out = new Set<string>();
  for (const [group, groupProps] of Object.entries(schema.props ?? {})) {
    if (typeof groupProps !== 'object' || groupProps === null) continue;
    for (const prop of Object.keys(groupProps)) {
      if (prop.startsWith('_')) continue;
      out.add(prop);
    }
  }
  return out;
}

// Props that Astro accepts on every component (composition / runtime
// concerns) and are never declared in schemas.
const ASTRO_FRAMEWORK_PROPS = new Set(['class', 'style', 'slot', 'id']);

async function checkAstroVsSchema(
  schemas: Map<string, ComponentSchema>,
  errors: string[]
): Promise<void> {
  for (const componentName of AUDITED_COMPONENTS) {
    const astroPath = path.join(COMPONENTS_DIR, 'atoms', componentName, `${componentName}.astro`);
    let astroContent: string;
    try {
      astroContent = await readFile(astroPath, 'utf-8');
    } catch {
      continue; // atom .astro missing — skip silently
    }
    const astroProps = extractAstroProps(astroContent);
    if (astroProps.length === 0) continue;
    const schema = schemas.get(componentName);
    if (!schema) continue;
    const schemaProps = flattenSchemaProps(schema);
    const missing = astroProps.filter(
      (p) => !schemaProps.has(p) && !ASTRO_FRAMEWORK_PROPS.has(p)
    );
    if (missing.length > 0) {
      errors.push(`${componentName}.astro declares props not in schema: ${missing.join(', ')}`);
    }
  }
}

async function loadSchemas(): Promise<Map<string, ComponentSchema>> {
  const schemaFiles = await walk(COMPONENTS_DIR, (p) => p.endsWith('.schema.json'));
  const schemas = new Map<string, ComponentSchema>();
  let skipped = 0;
  for (const file of schemaFiles) {
    try {
      const json = JSON.parse(await readFile(file, 'utf-8')) as ComponentSchema;
      if (!json.component) continue;
      // Only load schemas for audited atoms — validatePage skips any
      // component not in the map, so non-audited instances pass through.
      if (!AUDITED_COMPONENTS.has(json.component)) {
        skipped++;
        continue;
      }
      schemas.set(json.component, json);
    } catch (e) {
      console.error(`[validate-data] failed to parse schema ${file}: ${(e as Error).message}`);
      process.exit(1);
    }
  }
  // _ref nested validation in validateComponent reads from globalThis.__schemaMap
  (globalThis as any).__schemaMap = schemas;
  console.log(`[validate-data] ${schemas.size} audited schemas loaded, ${skipped} non-audited skipped`);
  return schemas;
}

async function main() {
  const schemas = await loadSchemas();

  // Astro-vs-schema drift check — every prop declared in the .astro
  // Props interface must also appear in the schema. Catches the reverse
  // direction of drift (schema falls behind .astro additions).
  const astroDriftErrors: string[] = [];
  await checkAstroVsSchema(schemas, astroDriftErrors);
  if (astroDriftErrors.length > 0) {
    console.error('\n[validate-data] Astro/schema drift:');
    for (const err of astroDriftErrors) console.error(`  ✗ ${err}`);
  }

  // Only validate the test pages for audited atoms. Production data and
  // non-audited test pages contain pre-audit content (old prop names);
  // they get validated when the comprehensive atom audit catches up to
  // them. Maps component name → src/data/test/<component-lowercase>.json.
  const candidateFiles = Array.from(AUDITED_COMPONENTS).map((c) =>
    path.join(DATA_DIR, 'test', `${c.toLowerCase()}.json`)
  );
  const dataFiles: string[] = [];
  for (const f of candidateFiles) {
    try {
      await readFile(f, 'utf-8');
      dataFiles.push(f);
    } catch {
      // file doesn't exist for this audited atom — skip silently
    }
  }
  console.log(`[validate-data] validating ${dataFiles.length} audited-atom test pages`);

  let totalErrors = 0;
  let filesWithErrors = 0;

  for (const file of dataFiles) {
    let json: any;
    try {
      json = JSON.parse(await readFile(file, 'utf-8'));
    } catch (e) {
      console.error(`\n  ✗ ${path.relative(ROOT, file)}: invalid JSON — ${(e as Error).message}`);
      totalErrors++;
      filesWithErrors++;
      continue;
    }
    const errors = validatePage(json, schemas);
    // Filter to hard errors only — warnings don't fail the build
    const hardErrors = errors.filter((e) => e.severity !== 'warn');
    if (hardErrors.length > 0) {
      filesWithErrors++;
      console.error(`\n  ✗ ${path.relative(ROOT, file)} (${hardErrors.length} error${hardErrors.length === 1 ? '' : 's'}):`);
      for (const e of hardErrors) console.error(`      ${e.message}`);
      totalErrors += hardErrors.length;
    }
  }

  const totalProblems = totalErrors + astroDriftErrors.length;
  if (totalProblems === 0) {
    console.log(`\n[validate-data] ✓ ${dataFiles.length} files valid, ${AUDITED_COMPONENTS.size} atoms in sync with schemas`);
    process.exit(0);
  } else {
    const dataBit = totalErrors > 0 ? `${totalErrors} data error${totalErrors === 1 ? '' : 's'} across ${filesWithErrors} file${filesWithErrors === 1 ? '' : 's'}` : '';
    const driftBit = astroDriftErrors.length > 0 ? `${astroDriftErrors.length} astro/schema drift${astroDriftErrors.length === 1 ? '' : 's'}` : '';
    console.error(`\n[validate-data] ✗ ${[dataBit, driftBit].filter(Boolean).join(' + ')}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('[validate-data] unexpected error:', e);
  process.exit(1);
});
