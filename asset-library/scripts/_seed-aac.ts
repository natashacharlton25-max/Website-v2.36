/**
 * Seed AAC References — Batch fetch SymboTalk API for ARASAAC symbols
 *
 * 1. Read all alt_symbols entries
 * 2. For each word, fetch SymboTalk API for ARASAAC match
 * 3. If found: update alt_symbol with aac_id and aac_url
 * 4. Rate limit: 100ms delay between requests
 *
 * Usage:
 *   ASSET_API_URL=http://localhost:8787 API_TOKEN=xxx npx tsx scripts/seed-aac.ts
 */

const API_URL = process.env.ASSET_API_URL || 'http://localhost:8787';
const TOKEN = process.env.API_TOKEN || '';
const SYMBOTALK_BASE = 'https://symbotalkapiv1.azurewebsites.net';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

async function main() {
  if (!TOKEN) {
    console.error('API_TOKEN is required.');
    process.exit(1);
  }

  // Health check
  const health = await fetch(`${API_URL}/v1/health`).catch(() => null);
  if (!health?.ok) {
    console.error(`Cannot reach API at ${API_URL}`);
    process.exit(1);
  }

  console.log('Phase 1: Fetching all alt_symbols...\n');

  // Fetch all alt_symbols in pages
  const symbols: { id: string; word: string }[] = [];
  let offset = 0;
  const limit = 200;

  while (true) {
    const res = await apiFetch(`/v1/alt-symbols?limit=${limit}&offset=${offset}`);
    if (!res.ok) {
      console.error(`Failed to fetch alt_symbols at offset ${offset}: ${res.status}`);
      break;
    }
    const data = await res.json() as { symbols: any[]; count: number };
    if (data.symbols.length === 0) break;

    for (const sym of data.symbols) {
      // Skip if already has AAC data
      if (!sym.aac_id) {
        symbols.push({ id: sym.id, word: sym.word });
      }
    }

    offset += data.symbols.length;
    if (data.count < limit) break;
  }

  console.log(`  Found ${symbols.length} symbols without AAC data.\n`);

  // Phase 2: Fetch SymboTalk API for each word
  console.log('Phase 2: Querying SymboTalk API...\n');

  let matched = 0;
  let unmatched = 0;
  let errors = 0;

  for (let i = 0; i < symbols.length; i++) {
    const { id, word } = symbols[i];

    try {
      const searchUrl = `${SYMBOTALK_BASE}/search/?name=${encodeURIComponent(word)}&lang=en&repo=arasaac&limit=1`;
      const res = await fetch(searchUrl);

      if (res.ok) {
        const results = await res.json() as any[];

        if (Array.isArray(results) && results.length > 0) {
          const first = results[0];
          const aacId = first.id || first._id || null;
          const aacUrl = first.image_url || first.url || null;

          if (aacId && aacUrl) {
            // Update the alt_symbol
            const updateRes = await apiFetch(`/v1/alt-symbols/${id}`, {
              method: 'PUT',
              body: JSON.stringify({ aac_id: aacId, aac_url: aacUrl }),
            });

            if (updateRes.ok) {
              matched++;
            } else {
              console.warn(`  Update failed for ${word} (${id}): ${updateRes.status}`);
              errors++;
            }
          } else {
            unmatched++;
          }
        } else {
          unmatched++;
        }
      } else {
        // API error — skip silently
        unmatched++;
      }
    } catch (err) {
      errors++;
    }

    // Rate limit: 100ms between requests
    await sleep(100);

    if ((i + 1) % 50 === 0) {
      console.log(`  ${i + 1}/${symbols.length} — matched: ${matched}, unmatched: ${unmatched}, errors: ${errors}`);
    }
  }

  console.log(`\n  Summary:`);
  console.log(`  Total symbols queried: ${symbols.length}`);
  console.log(`  Matched (AAC found): ${matched}`);
  console.log(`  Unmatched: ${unmatched}`);
  console.log(`  Errors: ${errors}`);
  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
