/**
 * Seed alt_symbols for missing Orange core words.
 * Searches ARASAAC for pictograms via SymboTalk API.
 *
 * Usage: npx tsx scripts/_seed-core-orange.ts
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

// ── Orange words from AssistiveWare Ordered Core Words ──

const ORANGE: string[] = [
  // Verbs
  'remember', 'talk', 'wait', 'wash', 'close', 'stay', 'buy', 'catch',
  'cut', 'guess', 'run', 'stand', 'walk', 'ask', 'decide', 'drive',
  'fly', 'grow', 'live', 'ride', 'throw', 'care', 'wear', 'taste',
  'let', 'feel', 'meet', 'could', 'will', 'would', 'should',
  // Describing
  'high', 'old', 'other', 'right', 'favourite', 'hard', 'ugly', 'mean',
  'same', 'great', 'fast', 'slow',
  // Quantity
  'none', 'really', 'much', 'many', 'most', 'least',
  // Prepositions
  'by', 'back', 'above', 'outside', 'middle', 'through', 'inside',
  'top', 'together', 'around', 'between', 'behind', 'beside', 'front',
  'far', 'near',
  // Which
  'somebody', 'something', 'somewhere', 'everybody', 'everything',
  'everywhere', 'anybody', 'anything', 'anywhere', 'nobody', 'nothing',
  // Questions
  'which',
  // Pronouns
  'them', 'her', 'our', 'his', 'mine', 'us', 'him', 'their',
  'yours', 'ours', 'its',
  // Conjunctions
  'so', 'then', 'else', 'as', 'since', 'until', 'while', 'either',
  // Sequence
  'just', 'late', 'later', 'soon', 'never', 'always', 'early',
];

async function main() {
  let created = 0;
  let skipped = 0;
  let withPictogram = 0;
  const noMatch: string[] = [];

  console.log(`Seeding ${ORANGE.length} Orange core words...\n`);

  for (const word of ORANGE) {
    // Check not already in DB
    const check = JSON.parse(d1Query(`SELECT id FROM alt_symbols WHERE word = '${esc(word)}'`));
    if (check[0]?.results?.length > 0) {
      console.log(`  ${word.padEnd(14)} already exists, skipping`);
      skipped++;
      continue;
    }

    const aacUrl = await searchArasaac(word);
    await setTimeout(200);

    const urlVal = aacUrl ? `'${esc(aacUrl)}'` : 'NULL';
    d1Query(
      `INSERT INTO alt_symbols (word, aac_url, icon_id, verified, core_tier) VALUES ('${esc(word)}', ${urlVal}, NULL, 0, 'orange')`
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

  console.log(`\n═══ Orange tier complete ═══`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped (existing): ${skipped}`);
  console.log(`  With ARASAAC pictogram: ${withPictogram}`);
  console.log(`  No match: ${noMatch.length}`);
  if (noMatch.length > 0) {
    console.log(`  Missing: ${noMatch.join(', ')}`);
  }

  // Final count
  const result = JSON.parse(d1Query(
    "SELECT core_tier, COUNT(*) as cnt FROM alt_symbols GROUP BY core_tier ORDER BY core_tier"
  ));
  console.log(`\nFinal distribution:`);
  for (const r of result[0].results) {
    console.log(`  ${r.core_tier || '(null/fringe)'}: ${r.cnt}`);
  }
}

main();
