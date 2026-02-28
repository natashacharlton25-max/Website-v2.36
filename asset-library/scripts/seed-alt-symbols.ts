/**
 * Seed Alt Symbols — Create alt_symbols from Phosphor base names
 *
 * 1. Query all unique base_name values from assets (~1,512)
 * 2. For each: create alt_symbol with word = base_name, icon_id = fill variant
 * 3. Link all assets to their alt_symbol via base_name match
 *
 * Usage:
 *   ASSET_API_URL=https://asset-library.natashacharlton25.workers.dev API_TOKEN=xxx npx tsx scripts/seed-alt-symbols.ts
 */

const API_URL = process.env.ASSET_API_URL || 'http://localhost:8787';
const TOKEN = process.env.API_TOKEN || '';

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

  console.log('Phase 1: Fetching all assets to find unique base names...\n');

  // Fetch all assets in pages to get base_name + id data
  const baseNameToFillId = new Map<string, string>(); // base_name → fill variant asset id
  const baseNameToAssetIds = new Map<string, string[]>(); // base_name → all asset ids
  let offset = 0;
  const limit = 200;

  while (true) {
    const res = await apiFetch(`/v1/assets?limit=${limit}&offset=${offset}`);
    if (!res.ok) {
      console.error(`Failed to fetch assets at offset ${offset}: ${res.status}`);
      break;
    }
    const data = await res.json() as { assets: any[]; count: number };
    if (data.assets.length === 0) break;

    for (const asset of data.assets) {
      const baseName = asset.baseName;
      if (!baseName) continue;

      // Track all asset IDs for this base_name
      if (!baseNameToAssetIds.has(baseName)) {
        baseNameToAssetIds.set(baseName, []);
      }
      baseNameToAssetIds.get(baseName)!.push(asset.id);

      // Track the fill variant ID
      if (asset.slug.endsWith('-fill')) {
        baseNameToFillId.set(baseName, asset.id);
      }
    }

    offset += data.assets.length;
    process.stdout.write(`  Fetched ${offset} assets...\r`);

    if (data.count < limit) break;
  }

  const uniqueBaseNames = [...baseNameToAssetIds.keys()].sort();
  console.log(`\n  Found ${uniqueBaseNames.length} unique base names across ${offset} assets.\n`);

  // Phase 2: Create alt_symbol for each base_name
  console.log('Phase 2: Creating alt_symbols...\n');

  let created = 0;
  let failed = 0;
  const wordToSymbolId = new Map<string, string>();

  for (let i = 0; i < uniqueBaseNames.length; i++) {
    const baseName = uniqueBaseNames[i];
    const fillId = baseNameToFillId.get(baseName) ?? null;

    const res = await apiFetch('/v1/alt-symbols', {
      method: 'POST',
      body: JSON.stringify({
        word: baseName,
        icon_id: fillId,
      }),
    });

    if (res.ok) {
      const data = await res.json() as { id: string };
      wordToSymbolId.set(baseName, data.id);
      created++;
    } else {
      const text = await res.text();
      console.warn(`  Failed ${baseName}: ${res.status} ${text.slice(0, 100)}`);
      failed++;
    }

    if ((i + 1) % 100 === 0) {
      process.stdout.write(`  ${i + 1}/${uniqueBaseNames.length} symbols created...\r`);
    }
  }

  console.log(`\n  Symbols created: ${created}, failed: ${failed}\n`);

  // Phase 3: Link assets to their alt_symbol
  console.log('Phase 3: Linking assets to alt_symbols...\n');

  let linked = 0;
  let linkFailed = 0;

  for (const [baseName, assetIds] of baseNameToAssetIds) {
    const symbolId = wordToSymbolId.get(baseName);
    if (!symbolId) continue;

    for (const assetId of assetIds) {
      // We need the slug to PATCH — fetch meta to get it
      // Actually, we have the asset list data. Let's re-fetch to get slugs.
      // More efficient: PATCH by looking up slug from our earlier fetch.
    }
  }

  // Re-fetch all assets to get slug → base_name mapping for PATCH
  console.log('  Re-fetching asset slugs for linking...\n');
  offset = 0;

  while (true) {
    const res = await apiFetch(`/v1/assets?limit=${limit}&offset=${offset}`);
    if (!res.ok) break;
    const data = await res.json() as { assets: any[]; count: number };
    if (data.assets.length === 0) break;

    for (const asset of data.assets) {
      const baseName = asset.baseName;
      if (!baseName) continue;

      const symbolId = wordToSymbolId.get(baseName);
      if (!symbolId) continue;

      // PATCH the asset to set alt_symbol_id
      const patchRes = await apiFetch(`/v1/assets/${asset.slug}`, {
        method: 'PATCH',
        body: JSON.stringify({ alt_symbol_id: symbolId }),
      });

      if (patchRes.ok) {
        linked++;
      } else {
        linkFailed++;
      }
    }

    offset += data.assets.length;
    process.stdout.write(`  Linked ${linked} assets...\r`);

    if (data.count < limit) break;
  }

  console.log(`\n\n  Summary:`);
  console.log(`  Alt symbols created: ${created}`);
  console.log(`  Assets linked: ${linked}`);
  console.log(`  Link failures: ${linkFailed}`);
  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
