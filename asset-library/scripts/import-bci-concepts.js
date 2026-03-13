/**
 * import-bci-concepts.js — Load BCI master CSV into D1 bci_concepts table
 *
 * Parses the official BCI-AV 2025-02-15 CSV (18 languages, 6428 concepts)
 * and inserts via wrangler --file in batches (avoids CLI length limits).
 *
 * Usage: node asset-library/scripts/import-bci-concepts.js
 */

const { execSync } = require('node:child_process');
const { readFileSync, writeFileSync, unlinkSync } = require('node:fs');
const { resolve } = require('node:path');

const WORKER_DIR = resolve(__dirname, '..');
const CSV_PATH = resolve(__dirname, '../../BlissSymbols2026 - 8483-29642.csv');
const TMP_SQL = resolve(__dirname, '_tmp_bci_batch.sql');

// ── Parse CSV ──

function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

const raw = readFileSync(CSV_PATH, 'utf-8');
const lines = raw.split('\n').filter(l => l.trim());
const dataLines = lines.slice(1);

console.log(`CSV: ${dataLines.length} data rows`);

function esc(val) {
  if (!val) return 'NULL';
  return "'" + val.replace(/'/g, "''") + "'";
}

function d1File(sqlPath) {
  const cmd = `npx wrangler d1 execute asset-library --remote --file="${sqlPath}" --json`;
  execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR });
}

function d1Query(sql) {
  const flat = sql.replace(/\s+/g, ' ').trim();
  const escaped = flat.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const rawOut = execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR });
  const parsed = JSON.parse(rawOut);
  return parsed[0].results;
}

// ── Build and insert rows ──

const BATCH_SIZE = 100;
let inserted = 0;
let skipped = 0;
let batch = [];

function flushBatch() {
  if (batch.length === 0) return;

  const values = batch.join(',\n');
  const sql = `INSERT OR IGNORE INTO bci_concepts (bci_index, english, pos, derivation, swedish, norwegian, finnish, hungarian, german, dutch, afrikaans, russian, icelandic, lithuanian, latvian, polish, french, spanish, portuguese, italian, danish) VALUES\n${values};\n`;

  writeFileSync(TMP_SQL, sql, 'utf-8');

  try {
    d1File(TMP_SQL);
    inserted += batch.length;
    process.stdout.write(`  ${inserted} rows...\r`);
  } catch (err) {
    console.error(`\nBatch failed at row ~${inserted}:`, err.message.slice(0, 200));
    skipped += batch.length;
  }
  batch = [];
}

for (const line of dataLines) {
  const f = parseCSVLine(line);
  const bci = parseInt(f[0], 10);
  if (isNaN(bci)) {
    skipped++;
    continue;
  }

  // Skip the long derivation text to keep rows manageable — store just a truncated version
  const derivation = f[3] ? f[3].slice(0, 200) : '';

  const row = `(${bci},${esc(f[2])},${esc(f[4])},${esc(derivation)},${esc(f[5])},${esc(f[7])},${esc(f[9])},${esc(f[10])},${esc(f[11])},${esc(f[12])},${esc(f[13])},${esc(f[14])},${esc(f[15])},${esc(f[16])},${esc(f[17])},${esc(f[18])},${esc(f[19])},${esc(f[20])},${esc(f[21])},${esc(f[22])},${esc(f[23])})`;

  batch.push(row);

  if (batch.length >= BATCH_SIZE) {
    flushBatch();
  }
}

flushBatch();

// Clean up
try { unlinkSync(TMP_SQL); } catch {}

console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`);

// Verify
const count = d1Query('SELECT COUNT(*) as total FROM bci_concepts');
console.log(`bci_concepts table: ${count[0].total} rows`);

const sample = d1Query("SELECT bci_index, english, french, spanish, german FROM bci_concepts WHERE english LIKE '%cat%' LIMIT 5");
console.log('Sample (cat):', JSON.stringify(sample, null, 2));
