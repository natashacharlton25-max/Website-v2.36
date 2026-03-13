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
const OPENSYMBOLS_TOKEN = process.env.OPENSYMBOLS_TOKEN || '';
const ARASAAC_API = 'https://api.arasaac.org/v1';

// Known symbol set repo keys from OpenSymbols
// Priority order: ARASAAC (curated AAC) > Mulberry (AAC, adult-friendly) >
// Sclera (AAC, high contrast) > Noun Project (concrete nouns/verbs ONLY)
const SYMBOL_SETS = [
  'arasaac',
  'mulberry',
  'sclera',
  'noun-project',
  'tawasol',
];

// Noun Project only for concrete nouns (YELLOW) and verbs (RED).
// Skip for WHITE (punctuation/function) and BLUE (pronouns/people).
const NOUN_PROJECT_ALLOWED_POS = new Set(['YELLOW', 'RED']);

// ── D1 helper ──

function d1Query(sql) {
  const flat = sql.replace(/\s+/g, ' ').trim();
  const escaped = flat.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR, maxBuffer: 50 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  if (!parsed[0] || !parsed[0].success) throw new Error(`D1 query failed`);
  return parsed[0].results;
}

// Paginated query for large tables
function d1QueryPaginated(sql, pageSize = 2000) {
  const allResults = [];
  let offset = 0;
  while (true) {
    const pageSql = `${sql} LIMIT ${pageSize} OFFSET ${offset}`;
    const rows = d1Query(pageSql);
    allResults.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return allResults;
}

// ── HTTP helpers ──

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          // Attach status for callers that need to check 401/429
          if (typeof parsed === 'object' && parsed !== null) {
            parsed._status = res.statusCode;
          }
          resolve(res.statusCode === 200 ? parsed : parsed);
        } catch { resolve(null); }
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

async function refreshOsToken() {
  if (!OPENSYMBOLS_SECRET) return null;
  try {
    const res = await fetchJson(
      `${OPENSYMBOLS_BASE}/token?secret=${encodeURIComponent(OPENSYMBOLS_SECRET)}`
    );
    if (res && res.access_token) {
      osToken = res.access_token;
      console.log('  OpenSymbols token refreshed');
      return osToken;
    }
  } catch {}
  return null;
}

async function getOsToken() {
  if (osToken) return osToken;

  // Prefer direct access token from env
  if (OPENSYMBOLS_TOKEN) {
    osToken = OPENSYMBOLS_TOKEN;
    return osToken;
  }

  // Generate via secret
  return refreshOsToken();
}

// ── OpenSymbols single-query fetch (handles auth errors) ──

async function fetchOpenSymbols(query, retried = false) {
  const token = await getOsToken();
  if (!token) return [];

  try {
    const url = `${OPENSYMBOLS_BASE}/symbols?q=${encodeURIComponent(query)}&locale=en&access_token=${encodeURIComponent(token)}`;
    const data = await fetchJson(url);

    // Handle token expiry — refresh and retry once
    if (data && data.token_expired && !retried) {
      osToken = null;
      const newToken = await refreshOsToken();
      if (newToken) return fetchOpenSymbols(query, true);
      return [];
    }

    // Handle throttling — wait and retry once
    if (data && data.throttled && !retried) {
      console.log('  Throttled — waiting 5s...');
      await sleep(5000);
      return fetchOpenSymbols(query, true);
    }

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ── OpenSymbols multi-gloss lookup with scoring ──

async function lookupOpenSymbols(english, pos) {
  const queries = getSearchQueries(english, pos);
  if (queries.length === 0) return {};

  const glosses = english
    .split(',')
    .map((g) => g.trim().replace(/\s*\([^)]*\)\s*$/, '').replace(/_/g, ' ').trim().toLowerCase())
    .filter(Boolean);

  // Try queries in specificity order (most specific first).
  // Stop as soon as we get scored results from any query.
  let bestPerSet = {}; // repo → { url, score }

  for (const query of queries) {
    const items = await fetchOpenSymbols(query);
    await sleep(100);

    if (items.length === 0) continue;

    for (const item of items) {
      const repo = item.repo_key;
      if (!repo || !item.image_url || !SYMBOL_SETS.includes(repo)) continue;

      // POS gate: skip Noun Project for function words / pronouns
      if (repo === 'noun-project' && !NOUN_PROJECT_ALLOWED_POS.has(pos)) continue;

      const score = scoreMatch(item, glosses, pos);
      if (score < 0) continue; // definite mismatch

      if (!bestPerSet[repo] || score > bestPerSet[repo].score) {
        bestPerSet[repo] = {
          url: item.image_url.replace(/ /g, '%20'),
          score,
        };
      }
    }

    // If we got at least one scored hit, don't try less-specific queries
    if (Object.keys(bestPerSet).length > 0) break;
  }

  // Flatten to { repo: url }
  const result = {};
  for (const [repo, entry] of Object.entries(bestPerSet)) {
    result[repo] = entry.url;
  }
  return result;
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

/**
 * Build ranked search queries from all glosses, most specific first.
 * BCI convention: first gloss is most common, later glosses are more specific.
 * For disambiguation we want specificity, so reverse the order.
 *
 * "period,point,full_stop" → ["full stop", "point", "period"]
 * "I,me,myself" → ["myself", "me", "I"]
 */
function getSearchQueries(english, pos) {
  if (!english) return [];
  const glosses = english
    .split(',')
    .map((g) => g.trim().replace(/\s*\([^)]*\)\s*$/, '').trim())
    .filter(Boolean)
    .map((g) => g.replace(/_/g, ' ').toLowerCase());

  // Deduplicate
  const seen = new Set();
  const unique = [];
  for (const g of glosses) {
    if (!seen.has(g)) { seen.add(g); unique.push(g); }
  }

  // Most specific (last) first
  const queries = unique.slice().reverse();

  // For punctuation (WHITE), also try with "symbol" suffix on least-specific gloss
  if (pos === 'WHITE' && unique.length > 0) {
    queries.push(unique[0] + ' symbol');
  }

  return queries;
}

/**
 * Score how well an OpenSymbols result matches our intended concept.
 * Higher = better match. Returns -1 for definite mismatch.
 */
function scoreMatch(item, glosses, pos) {
  const name = (item.name || item.label || '').toLowerCase();
  const desc = (item.description || '').toLowerCase();

  // Exact name match to any gloss = best
  for (let i = 0; i < glosses.length; i++) {
    if (name === glosses[i]) return 100 - i; // earlier gloss = slightly higher
  }

  // Name contains a gloss
  for (let i = 0; i < glosses.length; i++) {
    if (name.includes(glosses[i])) return 50 - i;
  }

  // Description contains a gloss
  for (let i = 0; i < glosses.length; i++) {
    if (desc.includes(glosses[i])) return 25 - i;
  }

  // No match at all — low score but don't reject (OpenSymbols search relevance)
  return 1;
}

// ── Main ──

async function main() {
  // 1. Fetch all BCI concepts
  console.log('Fetching BCI concepts from D1...');
  const concepts = d1QueryPaginated(
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
      setUrls = await lookupOpenSymbols(concept.english, concept.pos);
      // sleep already happens inside lookupOpenSymbols per query
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
