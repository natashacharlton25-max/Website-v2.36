#!/usr/bin/env node
/**
 * Scan every atom for schema-default-vs-astro-default drift.
 *
 * For each atom's schema.json, walk every prop with a "default" value.
 * Then check the matching .astro file's destructure block — does the
 * destructure apply the same default?
 *
 * Surfaces the architectural drift class that bit Shape.size yesterday:
 * schema declared `size: 'base'` default but .astro destructured with
 * just `size,` (no default), so undefined slipped through to runtime.
 */

const fs = require('fs');
const path = require('path');

const atomsDir = path.join(__dirname, '..', 'src', 'components', 'atoms');
const atoms = fs.readdirSync(atomsDir).filter(d =>
  fs.statSync(path.join(atomsDir, d)).isDirectory()
);

const issues = [];

for (const atom of atoms) {
  const dir = path.join(atomsDir, atom);
  const schemaPath = path.join(dir, atom + '.schema.json');
  const astroPath = path.join(dir, atom + '.astro');
  if (!fs.existsSync(schemaPath) || !fs.existsSync(astroPath)) continue;

  let schema;
  try { schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8')); }
  catch { continue; }

  const astro = fs.readFileSync(astroPath, 'utf8');
  const destrMatch = astro.match(/const\s*\{([\s\S]*?)\}\s*=\s*Astro\.props/);
  if (!destrMatch) continue;
  const destr = destrMatch[1];

  const props = schema.props || {};
  for (const groupName of Object.keys(props)) {
    const group = props[groupName];
    if (!group || typeof group !== 'object') continue;
    for (const propName of Object.keys(group)) {
      const def = group[propName];
      if (!def || typeof def !== 'object' || !('default' in def)) continue;
      const dflt = def.default;
      if (dflt === null || dflt === undefined) continue;

      // Find prop in destructure with possible default.
      // Boundary: start-of-string, comma, or whitespace BEFORE the name.
      // After the name: optional `= value` (capturing), then comma/closing-brace/end.
      const propRegex = new RegExp(
        '(?:^|[,{\\s])' + propName + '\\s*(?:=([^,\\n]*?(?:\\([^)]*\\)|\\[[^\\]]*\\]|[^,\\n])*?))?(?=\\s*[,}\\n])'
      );
      const m = destr.match(propRegex);
      if (!m) continue; // not destructured (probably forwarded as ...rest)

      const astroDefault = (m[1] || '').trim();
      const schemaStr = JSON.stringify(dflt);

      if (!astroDefault) {
        issues.push({ atom, prop: propName, schema: schemaStr, astro: 'NO DEFAULT', kind: 'missing' });
      } else {
        // Strip surrounding quotes for string comparison
        const norm = astroDefault.replace(/^['"]|['"]$/g, '');
        if (norm !== String(dflt) && astroDefault !== String(dflt)) {
          issues.push({ atom, prop: propName, schema: schemaStr, astro: astroDefault, kind: 'mismatch' });
        }
      }
    }
  }
}

const missing = issues.filter(i => i.kind === 'missing');
const mismatch = issues.filter(i => i.kind === 'mismatch');

console.log('=== SCHEMA-DEFAULT vs ASTRO-DEFAULT DRIFT ===\n');

if (missing.length === 0 && mismatch.length === 0) {
  console.log('No drift found — every schema default is mirrored in the .astro destructure.');
  process.exit(0);
}

if (missing.length > 0) {
  console.log(`Missing in .astro (${missing.length}) — schema declares default, .astro destructures with no default:`);
  for (const i of missing) {
    console.log(`  ${i.atom}.${i.prop}: schema=${i.schema}`);
  }
  console.log('');
}

if (mismatch.length > 0) {
  console.log(`Value mismatch (${mismatch.length}):`);
  for (const i of mismatch) {
    console.log(`  ${i.atom}.${i.prop}: schema=${i.schema} astro=${i.astro}`);
  }
  console.log('');
}

process.exit(missing.length + mismatch.length > 0 ? 1 : 0);
