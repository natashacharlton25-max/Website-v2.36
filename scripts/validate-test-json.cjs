const fs = require('fs');
const path = require('path');

/**
 * JSON + PAGE VALIDATOR — checks all JSON content against atom schemas
 * and flags .astro pages that hardcode component props instead of using JSON
 *
 * PART 1: JSON validation
 *   Scans src/data/ (all dirs) for component-pattern JSON.
 *   Every prop and value checked against the atom schema.
 *
 *   Checks:
 *     1. Every prop used in JSON exists in the schema
 *     2. Every string value matches its enum constraint
 *     3. Every number value matches its enum constraint
 *     4. Required props are present
 *     5. No class/style props (Astro-only, not JSON content)
 *     6. No CSS values (var(), #hex, rgb(), px/rem)
 *
 * PART 2: Page validation
 *   Scans src/pages/ for .astro files that import atoms directly
 *   and use hardcoded props instead of JSON data.
 *   Test pages (src/pages/test/) that import JSON are exempt.
 */

const dataDir = path.join(__dirname, '..', 'src', 'data');
const pagesDir = path.join(__dirname, '..', 'src', 'pages');
const atomsDir = path.join(__dirname, '..', 'src', 'components', 'atoms');

// ─── LOAD SCHEMAS ───

const schemas = {};
const atoms = fs.readdirSync(atomsDir).filter(d =>
  fs.statSync(path.join(atomsDir, d)).isDirectory()
);

for (const atom of atoms) {
  const schemaPath = path.join(atomsDir, atom, `${atom}.schema.json`);
  if (!fs.existsSync(schemaPath)) continue;
  try {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const flatProps = {};
    const required = [];

    for (const [group, groupProps] of Object.entries(schema.props || {})) {
      if (typeof groupProps !== 'object' || groupProps === null) continue;
      for (const [prop, def] of Object.entries(groupProps)) {
        if (prop.startsWith('_')) continue;
        flatProps[prop] = { ...def, _group: group };
        if (def.required) required.push(prop);
      }
    }

    schemas[atom] = { flatProps, required, renders: schema.renders || {} };
  } catch (e) {
    console.log(`  WARN  Could not parse schema for ${atom}: ${e.message}`);
  }
}

// Structural props — part of container/content system, not in schemas
const structuralProps = new Set(['component', 'children', 'text', 'ref', 'printOutput']);

// CSS value patterns that must never appear in JSON
const cssPatterns = [
  { re: /^var\(--/, msg: 'CSS var() token' },
  { re: /^#[0-9a-fA-F]{3,8}$/, msg: 'hex colour' },
  { re: /^rgba?\(/, msg: 'rgb() colour' },
  { re: /^hsla?\(/, msg: 'hsl() colour' },
  { re: /^\d+px$/, msg: 'px value' },
  { re: /^\d+rem$/, msg: 'rem value' },
];

// Data files that are lookup/reference, not page content
const skipFiles = /^(aac-|alt-|british-|core-word|mood-|mulberry-|cboard-|context-|schema-vocab|words-)/;

// Walk JSON tree, find all { "component": "..." } instances
function walkComponents(node, nodePath, results) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((child, i) => walkComponents(child, `${nodePath}[${i}]`, results));
    return;
  }
  if (node.component) {
    results.push({ component: node.component, props: node, path: nodePath });
  }
  // Recurse into all object values (children, nested structures)
  for (const [key, val] of Object.entries(node)) {
    if (key === 'component') continue;
    if (typeof val === 'object' && val !== null) {
      walkComponents(val, `${nodePath}.${key}`, results);
    }
  }
}

// Validate a single JSON object against schemas
function validateJson(data, label) {
  const instances = [];
  walkComponents(data, '$', instances);
  const issues = [];

  for (const { component, props, path: jsonPath } of instances) {
    const schema = schemas[component];
    if (!schema) continue;

    const propKeys = Object.keys(props).filter(k => !structuralProps.has(k));

    // Required props
    for (const req of schema.required) {
      if (!(req in props)) {
        issues.push({ path: jsonPath, msg: `${component}: missing required prop "${req}"` });
      }
    }

    for (const key of propKeys) {
      const def = schema.flatProps[key];

      // Unknown prop
      if (!def) {
        issues.push({ path: jsonPath, msg: `${component}: unknown prop "${key}" (not in schema)` });
        continue;
      }

      const value = props[key];

      // No class/style
      if (key === 'class' || key === 'style') {
        issues.push({ path: jsonPath, msg: `${component}: "${key}" is Astro-only, not JSON content` });
        continue;
      }

      // No CSS values
      if (typeof value === 'string') {
        for (const { re, msg } of cssPatterns) {
          if (re.test(value)) {
            issues.push({ path: jsonPath, msg: `${component}.${key}: ${msg} "${value}" — use enum` });
            break;
          }
        }
      }

      // Enum constraint
      if (def.enum && value !== undefined && value !== null) {
        if (!def.enum.includes(value)) {
          issues.push({ path: jsonPath, msg: `${component}.${key}: "${value}" not in enum [${def.enum.join(', ')}]` });
        }
      }

      // String minLength — content props that are present must have content.
      // Empty strings are a third state that means nothing; either provide
      // the prop with a real string or omit it entirely.
      if (def.type === 'string' && typeof value === 'string' && def.minLength !== undefined) {
        if (value.length < def.minLength) {
          issues.push({ path: jsonPath, msg: `${component}.${key}: empty/too-short string (minLength ${def.minLength})` });
        }
      }

      // Type check
      if (def.type === 'boolean' && typeof value !== 'boolean') {
        issues.push({ path: jsonPath, msg: `${component}.${key}: expected boolean, got ${typeof value}` });
      }
      if (def.type === 'number' && typeof value !== 'number') {
        issues.push({ path: jsonPath, msg: `${component}.${key}: expected number, got ${typeof value}` });
      }
    }
  }

  return { instances: instances.length, issues };
}

// ─── Recursively find all JSON files in a directory ───
function findJsonFiles(dir, prefix) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...findJsonFiles(full, rel));
    } else if (entry.name.endsWith('.json') && !skipFiles.test(entry.name)) {
      results.push({ path: full, label: rel });
    }
  }
  return results;
}

// ─── Recursively find all .astro page files ───
function findAstroPages(dir, prefix) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...findAstroPages(full, rel));
    } else if (entry.name.endsWith('.astro')) {
      results.push({ path: full, label: rel });
    }
  }
  return results;
}


// ════════════════════════════════════════════════════════════
//  PART 1: JSON VALIDATION
// ════════════════════════════════════════════════════════════

const jsonFiles = findJsonFiles(dataDir, '');
const jsonSummary = [];

console.log('=== JSON CONTENT VALIDATOR ===\n');

for (const { path: filePath, label } of jsonFiles) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.log(`${label} ❌ JSON parse error: ${e.message}\n`);
    jsonSummary.push({ label, count: 1 });
    continue;
  }

  const { instances, issues } = validateJson(data, label);

  // Skip files with no component instances (lookup data, not page content)
  if (instances === 0) continue;

  if (issues.length === 0) {
    console.log(`${label} ✅ CLEAN (${instances} components)`);
  } else {
    console.log(`${label} ${issues.length > 10 ? '❌' : '⚠️'} ${issues.length} issues (${instances} components)`);
    for (const i of issues) {
      console.log(`  FAIL  ${i.path}  ${i.msg}`);
    }
  }
  console.log('');
  jsonSummary.push({ label, count: issues.length });
}

console.log('─────────────────────');
console.log('JSON SUMMARY');
jsonSummary.sort((a, b) => a.count - b.count);
for (const s of jsonSummary) {
  const icon = s.count === 0 ? '✅' : s.count > 10 ? '❌' : '⚠️';
  console.log(`  ${s.label.padEnd(30)} ${icon} ${s.count} issues`);
}


// ════════════════════════════════════════════════════════════
//  PART 2: PAGE VALIDATION — .astro files should use JSON
// ════════════════════════════════════════════════════════════

console.log('\n\n=== PAGE VALIDATOR ===\n');
console.log('Pages should import JSON, not hardcode component props.\n');

const atomNames = atoms.map(a => a);
const atomImportRe = /import\s+.*from\s+['"].*\/atoms\//;
const jsonImportRe = /import\s+.*from\s+['"].*\/data\//;

const pageFiles = findAstroPages(pagesDir, '');
const pageSummary = [];

for (const { path: filePath, label } of pageFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  const hasJsonImport = jsonImportRe.test(content);
  const atomImports = [];

  lines.forEach((line, i) => {
    const ln = i + 1;

    // Direct atom import
    if (atomImportRe.test(line)) {
      const m = line.match(/\/atoms\/(\w+)/);
      const atomName = m ? m[1] : 'unknown';
      atomImports.push({ ln, atom: atomName, line: line.trim() });
    }
  });

  // Flag pages that import atoms directly without importing JSON
  if (atomImports.length > 0 && !hasJsonImport) {
    for (const ai of atomImports) {
      issues.push({ ln: ai.ln, msg: `imports ${ai.atom} atom directly — use JSON data instead` });
    }
  }

  // Test pages must use Renderer — manual prop mapping breaks when schemas change
  const normPath = filePath.replace(/\\/g, '/');
  const isTestPage = normPath.includes('/test/') && normPath.endsWith('-test.astro');
  const usesRenderer = /import\s+.*Renderer/.test(content);
  if (isTestPage && hasJsonImport && !usesRenderer) {
    issues.push({ ln: '--', msg: `test page imports JSON but doesn't use Renderer — manual prop mapping will drift from schema` });
  }

  // Pages that import atoms + JSON = correct pattern (JSON-driven renderer)
  // This is the target architecture — atoms render from JSON data.
  // No warning needed — this IS how the site is built.

  if (issues.length === 0) {
    // Only show clean if the page has some content
    if (hasJsonImport) {
      console.log(`${label} ✅ JSON-driven`);
    }
  } else {
    console.log(`${label} ${issues.length > 5 ? '❌' : '⚠️'} ${issues.length} issues`);
    for (const i of issues) {
      const tag = i.type || 'FAIL';
      console.log(`  ${tag.padEnd(4)}  :${i.ln}  ${i.msg}`);
    }
  }

  if (issues.length > 0 || hasJsonImport) {
    console.log('');
    pageSummary.push({ label, count: issues.length, jsonDriven: hasJsonImport });
  }
}

console.log('─────────────────────');
console.log('PAGE SUMMARY');
const jsonDriven = pageSummary.filter(s => s.jsonDriven).length;
const needsMigration = pageSummary.filter(s => !s.jsonDriven).length;
console.log(`  ${jsonDriven} pages JSON-driven ✅`);
console.log(`  ${needsMigration} pages need migration`);
pageSummary.sort((a, b) => a.count - b.count);
for (const s of pageSummary) {
  const icon = s.jsonDriven ? '✅' : s.count > 5 ? '❌' : '⚠️';
  console.log(`  ${s.label.padEnd(30)} ${icon} ${s.count === 0 ? 'JSON-driven' : s.count + ' issues'}`);
}
