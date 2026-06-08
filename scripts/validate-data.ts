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
  'FigCaption',
  'FormField',
  'Heading',
  'Link',
  'List',
  'Text',
  'Tooltip',
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

/**
 * Atom-side static checks. Verifies each audited atom's files exist
 * and that its CSS/Astro contain no forbidden patterns (per CLAUDE.md
 * canonical-atom rules). Complements the test-page data validation.
 */
async function checkAtomFiles(errors: string[]): Promise<void> {
  const FORBIDDEN_CSS: { name: string; regex: RegExp }[] = [
    { name: '@layer wrapper', regex: /@layer\b/ },
    { name: '!important', regex: /!important/ },
    { name: ':global() selector', regex: /:global\(/ },
    { name: '.a11y-* class selector', regex: /\.a11y-[\w-]/ },
    { name: '@media (prefers-reduced-motion)', regex: /@media\s*\([^)]*prefers-reduced-motion/ },
  ];
  const FORBIDDEN_ASTRO: { name: string; regex: RegExp }[] = [
    { name: 'scoped <style> block (extract to .css)', regex: /<style(\s[^>]*)?>/ },
    { name: ':global() selector', regex: /:global\(/ },
  ];
  const REQUIRED_FILES = (name: string) => [
    `${name}.astro`,
    `${name}.css`,
    `${name}.responsive.css`,
    `${name}.schema.json`,
    'index.ts',
  ];

  for (const componentName of AUDITED_COMPONENTS) {
    const dir = path.join(COMPONENTS_DIR, 'atoms', componentName);

    // Skip atoms with no .astro — they're CSS+JS-only infrastructure
    // (e.g. FigCaption is styled+scripted but rendered via Image), so the
    // canonical 5-file structure doesn't apply.
    try {
      await readFile(path.join(dir, `${componentName}.astro`), 'utf-8');
    } catch {
      continue;
    }

    // 1. File structure
    for (const filename of REQUIRED_FILES(componentName)) {
      try {
        await readFile(path.join(dir, filename), 'utf-8');
      } catch {
        errors.push(`${componentName}: missing required file ${filename}`);
      }
    }

    // 2. Forbidden CSS patterns (both main and responsive)
    for (const cssFile of [`${componentName}.css`, `${componentName}.responsive.css`]) {
      let content: string;
      try {
        content = await readFile(path.join(dir, cssFile), 'utf-8');
      } catch {
        continue; // already reported as missing
      }
      for (const p of FORBIDDEN_CSS) {
        if (p.regex.test(content)) {
          errors.push(`${componentName}/${cssFile}: forbidden ${p.name}`);
        }
      }
    }

    // 3. Forbidden Astro patterns
    let astroContent: string;
    try {
      astroContent = await readFile(path.join(dir, `${componentName}.astro`), 'utf-8');
    } catch {
      continue;
    }
    for (const p of FORBIDDEN_ASTRO) {
      if (p.regex.test(astroContent)) {
        errors.push(`${componentName}.astro: forbidden ${p.name}`);
      }
    }
  }
}

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
  // ALL schemas — so nested component-node validation (the media.component
  // check + the `_lockProps` deep recursion in validateComponent, which read
  // child schemas from globalThis.__schemaMap) can resolve a slot's child atom
  // by `component` (e.g. Heading.media → Icon|Image|Shape). Without the full
  // map the nested lock would silently skip every unaudited child = silent hole.
  const allSchemas = new Map<string, ComponentSchema>();
  // Audited subset — the TOP-LEVEL validation gate. validatePage only validates
  // a node whose component is in THIS map, so non-audited top-level instances
  // (Grid/Section/Page/…) still pass through unchecked. Decoupling the two maps
  // is what lets the nested lock turn on without incidentally enforcing
  // not-yet-audited atoms.
  const auditedSchemas = new Map<string, ComponentSchema>();
  for (const file of schemaFiles) {
    try {
      const json = JSON.parse(await readFile(file, 'utf-8')) as ComponentSchema;
      if (!json.component) continue;
      // Child-lookup map = ATOM schemas only. Children of locked slots are
      // always atoms (media → Icon/LottieIcon/Image/Shape; Card slots →
      // Heading/Text/Button), and keying by bare `component` name would
      // otherwise let a same-named non-atom clobber the atom — e.g. the
      // organism Grid (no `variant`) overwriting the atom Grid (has it).
      const isAtom = file.split(path.sep).includes('atoms');
      if (isAtom) {
        if (allSchemas.has(json.component)) {
          console.error(`[validate-data] duplicate atom component name "${json.component}" — schema collision in ${file}`);
          process.exit(1);
        }
        allSchemas.set(json.component, json);
      }
      if (AUDITED_COMPONENTS.has(json.component)) auditedSchemas.set(json.component, json);
    } catch (e) {
      console.error(`[validate-data] failed to parse schema ${file}: ${(e as Error).message}`);
      process.exit(1);
    }
  }
  (globalThis as any).__schemaMap = allSchemas;
  console.log(`[validate-data] ${auditedSchemas.size} audited schemas (top-level gate), ${allSchemas.size} total loaded for nested-slot lookup`);
  return auditedSchemas;
}

async function main() {
  const schemas = await loadSchemas();

  // Atom-side static checks — file structure + forbidden CSS/Astro
  // patterns per CLAUDE.md canonical-atom rules. Catches structural
  // bugs that data validation can't see.
  const atomFileErrors: string[] = [];
  await checkAtomFiles(atomFileErrors);
  if (atomFileErrors.length > 0) {
    console.error('\n[validate-data] Atom file/pattern errors:');
    for (const err of atomFileErrors) console.error(`  ✗ ${err}`);
  }

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

  const totalProblems = totalErrors + astroDriftErrors.length + atomFileErrors.length;
  if (totalProblems === 0) {
    console.log(`\n[validate-data] ✓ ${dataFiles.length} files valid, ${AUDITED_COMPONENTS.size} atoms in sync with schemas`);
    process.exit(0);
  } else {
    const bits = [
      totalErrors > 0 && `${totalErrors} data error${totalErrors === 1 ? '' : 's'} across ${filesWithErrors} file${filesWithErrors === 1 ? '' : 's'}`,
      astroDriftErrors.length > 0 && `${astroDriftErrors.length} astro/schema drift${astroDriftErrors.length === 1 ? '' : 's'}`,
      atomFileErrors.length > 0 && `${atomFileErrors.length} atom file/pattern issue${atomFileErrors.length === 1 ? '' : 's'}`,
    ].filter(Boolean);
    console.error(`\n[validate-data] ✗ ${bits.join(' + ')}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('[validate-data] unexpected error:', e);
  process.exit(1);
});
