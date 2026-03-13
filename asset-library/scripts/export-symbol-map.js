/**
 * export-symbol-map.js — Build master symbol mapping CSV
 *
 * Queries every BCI concept, looks up ALL available symbols from OpenSymbols
 * and ARASAAC APIs, and outputs a CSV mapping sheet.
 *
 * Output columns:
 *   bci_index | word | pos | bliss_url | arasaac_url | mulberry_url |
 *   sclera_url | noun_project_url | tawasol_url | current_aac_url
 *
 * Import into Google Sheets for visual QA — each URL shows as a clickable
 * image. The complete free AAC symbol reference indexed by BCI.
 *
 * Usage: node asset-library/scripts/export-symbol-map.js
 *
 * Requires: OPENSYMBOLS_SECRET env var for OpenSymbols API token.
 * If not set, falls back to ARASAAC-only lookup (no auth needed).
 *
 * Rate-limited: 100ms between OpenSymbols requests.
 * Output: asset-library/scripts/bci-symbol-map.csv
 *
 * No AI tokens — pure API calls.
 */

const { execSync } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');
const https = require('node:https');
const http = require('node:http');

const WORKER_DIR = resolve(__dirname, '..');
const OUTPUT_CSV = resolve(__dirname, 'bci-symbol-map.csv');

const OPENSYMBOLS_BASE = 'https://www.opensymbols.org/api/v2';
const OPENSYMBOLS_SECRET = process.env.OPENSYMBOLS_SECRET || '';
const ARASAAC_API = 'https://api.arasaac.org/v1';

// Known symbol set repo keys from OpenSymbols
const SYMBOL_SETS = [
  'arasaac',
  'mulberry',
  'sclera',
  'noun-project',
  'tawasol',
];

// ── D1 helper ──

function d1Query(sql) {
  const flat = sql.replace(/\s+/g, ' ').trim();
  const escaped = flat.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR });
  const parsed = JSON.parse(raw);
  if (!parsed[0] || !parsed[0].success) throw new Error(`D1 query failed`);
  return parsed[0].results;
}

// ── HTTP helpers ──

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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── OpenSymbols token ──

let osToken = null;

async function getOsToken() {
  if (osToken) return osToken;
  if (!OPENSYMBOLS_SECRET) return null;

  try {
    const res = await fetchJson(
      `${OPENSYMBOLS_BASE}/token?secret=${encodeURIComponent(OPENSYMBOLS_SECRET)}`
    );
    if (res && res.access_token) {
      osToken = res.access_token;
      return osToken;
    }
  } catch {}
  return null;
}

// ── OpenSymbols multi-set lookup ──

async function lookupOpenSymbols(word) {
  const token = await getOsToken();
  if (!token) return {};

  try {
    const url = `${OPENSYMBOLS_BASE}/symbols?q=${encodeURIComponent(word)}&locale=en&access_token=${encodeURIComponent(token)}`;
    const data = await fetchJson(url);

    if (!Array.isArray(data)) return {};

    const result = {};
    for (const item of data) {
      const repo = item.repo_key;
      if (repo && item.image_url && SYMBOL_SETS.includes(repo)) {
        // Keep first match per set (best relevance)
        if (!result[repo]) {
          result[repo] = item.image_url.replace(/ /g, '%20');
        }
      }
    }
    return result;
  } catch {
    return {};
  }
}

// ── ARASAAC direct lookup (fallback if no OpenSymbols token) ──

async function lookupArasaac(word) {
  try {
    const url = `${ARASAAC_API}/pictograms/en/search/${encodeURIComponent(word)}`;
    const data = await fetchJson(url);
    if (Array.isArray(data) && data.length > 0 && data[0]._id) {
      return `https://static.arasaac.org/pictograms/${data[0]._id}/${data[0]._id}_500.png`;
    }
  } catch {}
  return null;
}

// ── CSV helpers ──

function csvEsc(val) {
  if (!val) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function primaryGloss(english) {
  if (!english) return '';
  return english.split(',')[0].trim().replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
}

// ── Main ──

async function main() {
  // 1. Fetch all BCI concepts
  console.log('Fetching BCI concepts from D1...');
  const concepts = d1Query(
    'SELECT c.bci_index, c.english, c.pos, s.aac_url AS current_aac_url FROM bci_concepts c LEFT JOIN alt_symbols s ON c.bci_index = s.bci_index ORDER BY c.bci_index'
  );
  console.log(`  ${concepts.length} concepts`);

  // 2. Check OpenSymbols availability
  const hasOpenSymbols = !!(await getOsToken());
  console.log(`  OpenSymbols API: ${hasOpenSymbols ? 'available' : 'not available (ARASAAC-only mode)'}`);
  if (!hasOpenSymbols) {
    console.log('  Set OPENSYMBOLS_SECRET env var for multi-set lookup.');
  }

  // 3. Build CSV
  const headers = [
    'bci_index', 'word', 'english_glosses', 'pos',
    'bliss_url', 'arasaac_url', 'mulberry_url', 'sclera_url',
    'noun_project_url', 'tawasol_url', 'current_aac_url',
  ];

  const rows = [headers.join(',')];
  let processed = 0;

  for (const concept of concepts) {
    const word = primaryGloss(concept.english);
    if (!word) {
      processed++;
      continue;
    }

    const blissUrl = `https://www.blissymbolics.net/refnumber/${concept.bci_index}`;

    let setUrls = {};
    if (hasOpenSymbols) {
      setUrls = await lookupOpenSymbols(word);
      await sleep(100);
    } else {
      // ARASAAC-only fallback
      const arasaacUrl = await lookupArasaac(word);
      if (arasaacUrl) setUrls.arasaac = arasaacUrl;
      await sleep(100);
    }

    const row = [
      concept.bci_index,
      csvEsc(word),
      csvEsc(concept.english),
      csvEsc(concept.pos),
      csvEsc(blissUrl),
      csvEsc(setUrls.arasaac || ''),
      csvEsc(setUrls.mulberry || ''),
      csvEsc(setUrls.sclera || ''),
      csvEsc(setUrls['noun-project'] || ''),
      csvEsc(setUrls.tawasol || ''),
      csvEsc(concept.current_aac_url || ''),
    ];

    rows.push(row.join(','));
    processed++;

    if (processed % 100 === 0) {
      process.stdout.write(
        `  ${processed}/${concepts.length} processed...\r`
      );
    }
  }

  // 4. Write CSV
  writeFileSync(OUTPUT_CSV, rows.join('\n') + '\n', 'utf-8');

  // 5. Summary
  const dataRows = rows.length - 1;
  console.log(`\n\nDone: ${dataRows} concepts mapped`);
  console.log(`Output: ${OUTPUT_CSV}`);
  console.log(`\nImport to Google Sheets:`);
  console.log(`  1. Open Google Sheets → File → Import → Upload`);
  console.log(`  2. Select ${OUTPUT_CSV}`);
  console.log(`  3. Separator: Comma`);
  console.log(`  4. Use =IMAGE(cell) formula to preview symbol URLs`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
