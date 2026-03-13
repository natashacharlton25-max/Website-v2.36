/**
 * backfill-bci-symbols.js — Expand alt_symbols to cover all BCI concepts
 *
 * For every bci_concepts row that doesn't already have an alt_symbols entry:
 *   1. Extract the primary English gloss (first comma-separated word)
 *   2. Look up ARASAAC pictogram URL via the public API (no auth needed)
 *   3. Insert into alt_symbols with bci_index, verified=1, core_tier=null
 *
 * Rate-limited to be polite to ARASAAC API (~100ms between requests).
 * Batches D1 inserts via temp SQL files to avoid CLI length limits.
 *
 * Usage: node asset-library/scripts/backfill-bci-symbols.js
 *
 * No AI tokens used — pure HTTP + D1.
 */

const { execSync } = require('node:child_process');
const { writeFileSync, unlinkSync } = require('node:fs');
const { resolve } = require('node:path');
const https = require('node:https');
const http = require('node:http');

const WORKER_DIR = resolve(__dirname, '..');
const TMP_SQL = resolve(__dirname, '_tmp_bci_symbols.sql');

// ARASAAC public API — no auth required
const ARASAAC_API = 'https://api.arasaac.org/v1';

// ── D1 helpers ──

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

function d1File(sqlPath) {
  const cmd = `npx wrangler d1 execute asset-library --remote --file="${sqlPath}" --json`;
  execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR });
}

function esc(val) {
  if (val == null) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

// ── HTTP fetch helper (follows redirects) ──

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve(null);
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ── Rate limiter ──

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── ARASAAC pictogram lookup ──

const arasaacCache = new Map();

async function lookupArasaac(word) {
  const key = word.toLowerCase().trim();
  if (arasaacCache.has(key)) return arasaacCache.get(key);

  try {
    const url = `${ARASAAC_API}/pictograms/en/search/${encodeURIComponent(key)}`;
    const data = await fetchJson(url);

    if (Array.isArray(data) && data.length > 0) {
      // Pick first result — ARASAAC returns best matches first
      const id = data[0]._id;
      if (id) {
        const picUrl = `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;
        arasaacCache.set(key, picUrl);
        return picUrl;
      }
    }
  } catch {
    // API unreachable — skip
  }

  arasaacCache.set(key, null);
  return null;
}

// ── Extract primary gloss from comma-separated English field ──

function primaryGloss(english) {
  if (!english) return null;
  // Take first gloss, strip parenthetical qualifiers
  const first = english.split(',')[0].trim();
  // Remove trailing parenthetical like "(animal)" or "(to)"
  const clean = first.replace(/\s*\([^)]*\)\s*$/, '').trim();
  // Skip multi-word glosses (compound concepts) — keep only single words
  // Actually, keep multi-word too — "ice cream", "fire truck" are valid AAC words
  return clean.toLowerCase() || null;
}

// ── Main ──

async function main() {
  // 1. Get all BCI concepts
  console.log('Fetching BCI concepts from D1...');
  const concepts = d1Query('SELECT bci_index, english FROM bci_concepts');
  console.log(`  ${concepts.length} BCI concepts`);

  // 2. Get existing alt_symbols bci_indices
  console.log('Fetching existing alt_symbols...');
  const existing = d1Query('SELECT bci_index FROM alt_symbols WHERE bci_index IS NOT NULL');
  const existingSet = new Set(existing.map((r) => r.bci_index));
  console.log(`  ${existingSet.size} already have alt_symbols entries`);

  // 3. Find missing concepts
  const missing = concepts.filter((c) => !existingSet.has(c.bci_index));
  console.log(`  ${missing.length} concepts need alt_symbols entries`);

  if (missing.length === 0) {
    console.log('Nothing to do — all BCI concepts already have alt_symbols entries.');
    return;
  }

  // 4. Look up ARASAAC URLs and build insert rows
  const BATCH_SIZE = 100;
  let inserted = 0;
  let withPictogram = 0;
  let textOnly = 0;
  let skipped = 0;
  let batch = [];

  async function flushBatch() {
    if (batch.length === 0) return;

    const values = batch.join(',\n');
    const sql = `INSERT OR IGNORE INTO alt_symbols (id, word, icon_id, aac_id, aac_url, bci_index, verified, core_tier) VALUES\n${values};\n`;

    writeFileSync(TMP_SQL, sql, 'utf-8');

    try {
      d1File(TMP_SQL);
      inserted += batch.length;
      process.stdout.write(`  ${inserted}/${missing.length} inserted (${withPictogram} with pictogram, ${textOnly} text-only)...\r`);
    } catch (err) {
      console.error(`\nBatch failed at row ~${inserted}:`, err.message.slice(0, 200));
      skipped += batch.length;
    }
    batch = [];
  }

  console.log('\nLooking up ARASAAC pictograms and inserting...');

  for (let i = 0; i < missing.length; i++) {
    const concept = missing[i];
    const word = primaryGloss(concept.english);

    if (!word) {
      skipped++;
      continue;
    }

    // Generate a unique ID
    const id = `sym_bci_${concept.bci_index}`;

    // Look up ARASAAC pictogram
    const aacUrl = await lookupArasaac(word);
    await sleep(100); // Rate limit — 10 requests/sec

    if (aacUrl) {
      withPictogram++;
    } else {
      textOnly++;
    }

    const row = `(${esc(id)},${esc(word)},NULL,NULL,${esc(aacUrl)},${concept.bci_index},1,NULL)`;
    batch.push(row);

    if (batch.length >= BATCH_SIZE) {
      await flushBatch();
    }
  }

  await flushBatch();

  // Clean up
  try { unlinkSync(TMP_SQL); } catch {}

  console.log(`\n\nDone:`);
  console.log(`  ${inserted} inserted`);
  console.log(`  ${withPictogram} with ARASAAC pictogram`);
  console.log(`  ${textOnly} text-only (no pictogram found)`);
  console.log(`  ${skipped} skipped (no usable English gloss)`);

  // Verify
  const count = d1Query('SELECT COUNT(*) as total FROM alt_symbols');
  const bciCount = d1Query('SELECT COUNT(*) as total FROM alt_symbols WHERE bci_index IS NOT NULL');
  console.log(`\nalt_symbols table: ${count[0].total} total rows, ${bciCount[0].total} with bci_index`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  try { unlinkSync(TMP_SQL); } catch {}
  process.exit(1);
});
