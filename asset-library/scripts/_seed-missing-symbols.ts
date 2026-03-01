/**
 * Seed 23 missing alt_symbols for content-symbol base_names.
 * - Creates alt_symbol rows with UK English words
 * - Searches ARASAAC via SymboTalk for pictogram URLs
 * - Links icon_id to existing fill-weight asset
 * - Sets verified = 0
 *
 * Run: npx tsx scripts/_seed-missing-symbols.ts
 */
import { execSync } from 'node:child_process';

const SYMBOTALK_BASE = 'https://symbotalkapiv1.azurewebsites.net';

function d1Query(sql: string): any {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() });
  return JSON.parse(raw);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 23 new symbols (person-simple shares existing "person" — handled separately)
const newSymbols: { baseName: string; word: string }[] = [
  { baseName: 'baby-carriage', word: 'pram' },
  { baseName: 'cloud-lightning', word: 'thunderstorm' },
  { baseName: 'cloud-rain', word: 'rain' },
  { baseName: 'cloud-snow', word: 'snow' },
  { baseName: 'high-heel', word: 'high heel' },
  { baseName: 'ice-cream', word: 'ice cream' },
  { baseName: 'music-note', word: 'music note' },
  { baseName: 'music-notes', word: 'music' },
  { baseName: 'paint-brush', word: 'paintbrush' },
  { baseName: 'paw-print', word: 'paw print' },
  { baseName: 'puzzle-piece', word: 'puzzle piece' },
  { baseName: 'smiley-angry', word: 'angry' },
  { baseName: 'smiley-blank', word: 'blank' },
  { baseName: 'smiley-meh', word: 'meh' },
  { baseName: 'smiley-melting', word: 'melting' },
  { baseName: 'smiley-nervous', word: 'nervous' },
  { baseName: 'smiley-sad', word: 'sad' },
  { baseName: 'smiley-sticker', word: 'sticker' },
  { baseName: 'smiley-wink', word: 'wink' },
  { baseName: 'soccer-ball', word: 'football' },
  { baseName: 'tennis-ball', word: 'tennis ball' },
  { baseName: 'treasure-chest', word: 'treasure chest' },
  { baseName: 'vinyl-record', word: 'record' },
];

async function main() {
  const now = new Date().toISOString();
  let created = 0;
  let aacMatched = 0;
  let iconLinked = 0;

  for (const { baseName, word } of newSymbols) {
    const symId = `sym_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

    // 1. Search ARASAAC for pictogram
    let aacId: number | null = null;
    let aacUrl: string | null = null;

    try {
      const searchUrl = `${SYMBOTALK_BASE}/search/?name=${encodeURIComponent(word)}&lang=en&repo=arasaac&limit=1`;
      const res = await fetch(searchUrl);
      if (res.ok) {
        const results = await res.json() as any[];
        if (Array.isArray(results) && results.length > 0) {
          const first = results[0];
          aacId = first.id || first._id || null;
          aacUrl = first.image_url || first.url || null;
          if (aacId && aacUrl) aacMatched++;
        }
      }
    } catch {
      // Skip ARASAAC lookup failure
    }

    // 2. Find fill-weight icon asset for this base_name
    let iconId: string | null = null;
    try {
      const result = d1Query(`SELECT id FROM assets WHERE base_name = '${baseName}' AND slug LIKE '%-fill' LIMIT 1`);
      const rows = result[0]?.results;
      if (rows && rows.length > 0) {
        iconId = rows[0].id;
        iconLinked++;
      }
    } catch {
      // No icon found
    }

    // 3. Insert alt_symbol
    const aacIdVal = aacId !== null ? String(aacId) : 'NULL';
    const aacUrlVal = aacUrl ? `'${aacUrl.replace(/'/g, "''")}'` : 'NULL';
    const iconIdVal = iconId ? `'${iconId}'` : 'NULL';

    d1Query(
      `INSERT INTO alt_symbols (id, word, icon_id, aac_id, aac_url, verified, created_at, updated_at)` +
      ` VALUES ('${symId}', '${word.replace(/'/g, "''")}', ${iconIdVal}, ${aacIdVal}, ${aacUrlVal}, 0, '${now}', '${now}')`,
    );
    created++;

    // 4. Link all assets with this base_name to the new symbol
    d1Query(`UPDATE assets SET alt_symbol_id = '${symId}' WHERE base_name = '${baseName}'`);

    const aacStatus = aacUrl ? 'AAC found' : 'no AAC';
    const iconStatus = iconId ? 'icon linked' : 'no icon';
    console.log(`  ${baseName} → "${word}" (${aacStatus}, ${iconStatus}) [${symId}]`);

    await sleep(150); // Rate limit ARASAAC
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  Created:    ${created}`);
  console.log(`  AAC match:  ${aacMatched}`);
  console.log(`  Icon link:  ${iconLinked}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
