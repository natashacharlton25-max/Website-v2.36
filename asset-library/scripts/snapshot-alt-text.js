/**
 * snapshot-alt-text.js — Pre-build D1 snapshot
 *
 * Queries D1 directly (not the API) and writes three JSON files
 * into src/data/ for Astro build consumption:
 *
 *   1. src/data/alt-text.json       — image assets with alt text
 *   2. src/data/alt-symbols.json    — full alt_symbols vocabulary
 *   3. src/data/context-overrides.json — context override rules
 *
 * Safeguard: exits non-zero if any query fails or returns zero rows
 * unexpectedly. Stale JSON must never survive into an Astro build.
 *
 * Usage: node asset-library/scripts/snapshot-alt-text.js
 * Run BEFORE `astro build` in the build pipeline.
 */

const { execSync } = require('node:child_process');
const { writeFileSync, mkdirSync } = require('node:fs');
const { resolve } = require('node:path');

const ROOT = resolve(__dirname, '../..');
const OUT_DIR = resolve(ROOT, 'src/data');
const WORKER_DIR = resolve(ROOT, 'asset-library');

function d1Query(sql) {
  // Collapse multi-line SQL to single line — wrangler --command chokes on newlines
  const flat = sql.replace(/\s+/g, ' ').trim();
  const escaped = flat.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR });
  const parsed = JSON.parse(raw);
  if (!parsed[0] || !parsed[0].success) {
    throw new Error(`D1 query failed: ${flat}`);
  }
  return parsed[0].results;
}

// ── 1. Image assets with alt text ──

const altTextRows = d1Query(`
  SELECT a.name, a.alt_descriptive AS descriptive,
         a.alt_aac_phrase AS aacPhrase,
         s.word, s.aac_url AS aacUrl
  FROM assets a
  LEFT JOIN alt_symbols s ON a.alt_symbol_id = s.id
  WHERE a.type = 'image'
`);

console.log(`Alt text rows: ${altTextRows.length}`);

// Images may legitimately be zero during early development — warn but allow
if (altTextRows.length === 0) {
  console.warn('WARNING: No image assets found in D1. alt-text.json will be empty.');
}

// ── 2. Full alt_symbols vocabulary ──

const symbolRows = d1Query(
  'SELECT word, aac_url, icon_id, verified, core_tier FROM alt_symbols'
);

console.log(`Symbol rows: ${symbolRows.length}`);

if (symbolRows.length === 0) {
  console.error('FATAL: alt_symbols table is empty. Cannot build without vocabulary.');
  process.exit(1);
}

// ── 3. Context overrides ──

const overrideRows = d1Query(
  'SELECT context_token, block_symbol, prefer_symbol FROM alt_symbol_context_overrides'
);

console.log(`Override rows: ${overrideRows.length}`);

// Overrides may legitimately be zero — no guard needed

// ── Write JSON files ──

mkdirSync(OUT_DIR, { recursive: true });

writeFileSync(
  resolve(OUT_DIR, 'alt-text.json'),
  JSON.stringify(altTextRows, null, 2) + '\n'
);

writeFileSync(
  resolve(OUT_DIR, 'alt-symbols.json'),
  JSON.stringify(symbolRows, null, 2) + '\n'
);

writeFileSync(
  resolve(OUT_DIR, 'context-overrides.json'),
  JSON.stringify(overrideRows, null, 2) + '\n'
);

console.log(`\nSnapshot written to ${OUT_DIR}/`);
console.log('  alt-text.json');
console.log('  alt-symbols.json');
console.log('  context-overrides.json');
