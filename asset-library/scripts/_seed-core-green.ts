/**
 * Seed alt_symbols for missing Green core words (including feelings).
 * Searches ARASAAC for pictograms via SymboTalk API.
 *
 * Usage: npx tsx scripts/_seed-core-green.ts
 */

import { execSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const SYMBOTALK = 'https://symbotalkapiv1.azurewebsites.net';

function d1Query(sql: string): string {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  return execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() });
}

const esc = (s: string) => s.replace(/'/g, "''");

async function searchArasaac(word: string): Promise<string | null> {
  const clean = word.replace(/'/g, '');
  try {
    const res = await fetch(
      `${SYMBOTALK}/search/?name=${encodeURIComponent(clean)}&lang=en&repo=arasaac&limit=1`
    );
    if (res.ok) {
      const text = await res.text();
      if (text === 'no result') return null;
      const data = JSON.parse(text);
      if (Array.isArray(data) && data.length > 0 && data[0].image_url) {
        return data[0].image_url;
      }
    }
  } catch {
    // API error
  }
  return null;
}

// ── Green words missing from alt_symbols ──

const GREEN_MISSING: string[] = [
  'go', 'like', 'help', 'get', 'look', 'put', 'make', 'need', 'open',
  'is', 'have', 'see', 'come', 'eat', 'drink', 'turn', "don't",
  'done', 'finished', 'different', 'good', 'more', 'some', 'all',
  'on', 'in', 'up', 'that', 'when',
  'i', 'he', 'she', 'me',
];

const GREEN_FEELINGS: string[] = [
  'happy', 'hungry', 'afraid', 'hurt', 'mad', 'sorry', 'tired',
  'excited', 'silly', 'bored', 'frustrated', 'sick', 'thirsty', 'lonely',
];

const ALL_GREEN = [...GREEN_MISSING, ...GREEN_FEELINGS];

async function main() {
  let created = 0;
  let withPictogram = 0;
  const noMatch: string[] = [];

  console.log(`Seeding ${ALL_GREEN.length} Green core words...\n`);

  for (const word of ALL_GREEN) {
    // Check not already in DB (safety)
    const check = JSON.parse(d1Query(`SELECT id FROM alt_symbols WHERE word = '${esc(word)}'`));
    if (check[0]?.results?.length > 0) {
      console.log(`  ${word.padEnd(14)} already exists, skipping`);
      continue;
    }

    const aacUrl = await searchArasaac(word);
    await setTimeout(200);

    const urlVal = aacUrl ? `'${esc(aacUrl)}'` : 'NULL';
    d1Query(
      `INSERT INTO alt_symbols (word, aac_url, icon_id, verified, core_tier) VALUES ('${esc(word)}', ${urlVal}, NULL, 0, 'green')`
    );

    if (aacUrl) {
      withPictogram++;
      console.log(`  ${word.padEnd(14)} AAC YES`);
    } else {
      noMatch.push(word);
      console.log(`  ${word.padEnd(14)} no pictogram`);
    }
    created++;
  }

  console.log(`\n═══ Green tier complete ═══`);
  console.log(`  Created: ${created}`);
  console.log(`  With ARASAAC pictogram: ${withPictogram}`);
  console.log(`  No match: ${noMatch.length}`);
  if (noMatch.length > 0) {
    console.log(`  Missing: ${noMatch.join(', ')}`);
  }

  // Final count
  const result = JSON.parse(d1Query(
    "SELECT core_tier, COUNT(*) as cnt FROM alt_symbols WHERE core_tier = 'green'"
  ));
  console.log(`\n  Total green alt_symbols: ${result[0].results[0].cnt}`);
}

main();
