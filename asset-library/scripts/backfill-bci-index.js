/**
 * backfill-bci-index.js — Match alt_symbols words to BCI reference numbers
 *
 * Reads the W3C AAC Symbol Registry (bci-registry.json) and matches each
 * alt_symbol word against BCI concept text. Three matching strategies:
 *
 *   1. Exact match:  symbol "cat" → BCI "cat" → verified = 1
 *   2. Verb match:   symbol "eat" → BCI "eat-(to)" → verified = 1
 *   3. Fuzzy match:  symbol "happy" → BCI "happy,glad,content" → verified = 0
 *
 * Writes UPDATE statements to D1 via wrangler CLI.
 *
 * Usage: node asset-library/scripts/backfill-bci-index.js
 */

const { execSync } = require('node:child_process');
const { resolve } = require('node:path');

const WORKER_DIR = resolve(__dirname, '..');
const bciData = require('./bci-registry.json');

// ── Build lookup index ──

/** @type {Map<string, { bci: number, exact: boolean }>} */
const bciLookup = new Map();

for (const entry of bciData) {
  const terms = entry.english.toLowerCase().split(',').map(t => t.trim());

  for (const term of terms) {
    // Clean: remove _(parenthetical) suffixes like "eat-(to)", "yes-(exclamatory)"
    const clean = term
      .replace(/_/g, ' ')           // underscores → spaces
      .replace(/-?\(.*?\)/g, '')    // strip -(to), -(exclamatory), etc
      .replace(/\s+/g, ' ')        // collapse spaces
      .trim();

    if (!clean) continue;

    // Only store if not already mapped (first match wins — registry is ordered)
    if (!bciLookup.has(clean)) {
      bciLookup.set(clean, { bci: entry.bciav, exact: true });
    }
  }
}

console.log(`BCI lookup built: ${bciLookup.size} terms from ${bciData.length} entries`);

// ── Fetch current alt_symbols ──

function d1Query(sql) {
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

function d1Execute(sql) {
  const flat = sql.replace(/\s+/g, ' ').trim();
  const escaped = flat.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR });
}

const symbols = d1Query('SELECT id, word FROM alt_symbols WHERE bci_index IS NULL');
console.log(`Symbols to backfill: ${symbols.length}`);

// ── Match and update ──

let exact = 0;
let fuzzy = 0;
let missed = 0;
const misses = [];
const updates = [];

for (const sym of symbols) {
  const word = sym.word.toLowerCase().trim();

  // Strategy 1: exact match
  const exactMatch = bciLookup.get(word);
  if (exactMatch) {
    updates.push({ id: sym.id, bci: exactMatch.bci, verified: 1 });
    exact++;
    continue;
  }

  // Strategy 2: try singular/plural forms
  let found = false;
  const variants = [
    word.endsWith('s') ? word.slice(0, -1) : null,          // cats → cat
    word.endsWith('es') ? word.slice(0, -2) : null,          // watches → watch
    word.endsWith('ing') ? word.slice(0, -3) : null,         // running → run
    word.endsWith('ing') ? word.slice(0, -3) + 'e' : null,   // making → make
    word.endsWith('ed') ? word.slice(0, -2) : null,           // played → play
    word.endsWith('ed') ? word.slice(0, -1) : null,           // liked → like
    word + 's',                                                // dog → dogs
  ].filter(Boolean);

  for (const variant of variants) {
    const match = bciLookup.get(variant);
    if (match) {
      updates.push({ id: sym.id, bci: match.bci, verified: 0 });
      fuzzy++;
      found = true;
      break;
    }
  }

  if (!found) {
    // Strategy 3: check if word appears as substring in any BCI term
    // Only for words >= 3 chars to avoid false positives
    if (word.length >= 3) {
      for (const [term, data] of bciLookup) {
        if (term === word || term.startsWith(word + ' ') || term.endsWith(' ' + word)) {
          updates.push({ id: sym.id, bci: data.bci, verified: 0 });
          fuzzy++;
          found = true;
          break;
        }
      }
    }
  }

  if (!found) {
    missed++;
    misses.push(word);
  }
}

console.log(`\nMatching results:`);
console.log(`  Exact:  ${exact}`);
console.log(`  Fuzzy:  ${fuzzy}`);
console.log(`  Missed: ${missed}`);

if (misses.length > 0 && misses.length <= 50) {
  console.log(`\nMissed words: ${misses.join(', ')}`);
} else if (misses.length > 50) {
  console.log(`\nFirst 50 missed: ${misses.slice(0, 50).join(', ')}`);
}

// ── Write updates in batches ──

const BATCH_SIZE = 50;
console.log(`\nWriting ${updates.length} updates in batches of ${BATCH_SIZE}...`);

for (let i = 0; i < updates.length; i += BATCH_SIZE) {
  const batch = updates.slice(i, i + BATCH_SIZE);

  // Build a single UPDATE using CASE expression for efficiency
  const cases = batch.map(u => `WHEN '${u.id}' THEN ${u.bci}`).join(' ');
  const verifiedCases = batch.map(u => `WHEN '${u.id}' THEN ${u.verified}`).join(' ');
  const ids = batch.map(u => `'${u.id}'`).join(',');

  const sql = `UPDATE alt_symbols SET bci_index = CASE id ${cases} END, verified = CASE id ${verifiedCases} END WHERE id IN (${ids})`;

  try {
    d1Execute(sql);
    process.stdout.write(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(updates.length / BATCH_SIZE)} ✓\n`);
  } catch (err) {
    console.error(`  Batch ${Math.floor(i / BATCH_SIZE) + 1} FAILED:`, err.message);
  }
}

// ── Summary ──

const after = d1Query('SELECT COUNT(*) as total, COUNT(bci_index) as has_bci FROM alt_symbols');
console.log(`\nFinal state: ${after[0].has_bci}/${after[0].total} symbols have BCI index`);
