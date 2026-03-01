/**
 * Seed alt_symbols for missing Yellow core words.
 * Searches ARASAAC for pictograms via SymboTalk API.
 *
 * Usage: npx tsx scripts/_seed-core-yellow.ts
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

// ── Yellow words from AssistiveWare Ordered Core Words ──

const YELLOW: string[] = [
  // Verbs
  'know', 'play', 'take', 'find', 'give', 'say', 'think', 'change',
  'work', 'tell', 'call', 'love', 'use', 'show', 'sit', 'start',
  'try', 'watch', 'carry', 'fall', 'leave', "let's", 'listen', 'move',
  'hear', 'keep', 'pick', 'hold', 'push', 'read', 'write',
  // Describing
  'fun', 'big', 'new', 'long', 'full', 'hot', 'nice', 'pretty',
  'clean', 'dry', 'ready', 'quick', 'bad', 'little',
  // Quantity
  'very', 'too', 'less', 'one', 'any', 'every',
  // Prepositions
  'over', 'out', 'for', 'to', 'there', 'off', 'down', 'with',
  'about', 'from', 'at', 'under', 'away', 'of',
  // Which
  'these', 'those', 'the', 'a', 'an',
  // Questions
  'why', 'how',
  // Pronouns
  'my', 'we', 'they', 'your',
  // Conjunctions
  'and', 'but', 'because', 'if', 'or',
  // Sequence
  'now', 'again', 'next', 'before', 'after', 'first', 'last',
];

async function main() {
  let created = 0;
  let skipped = 0;
  let withPictogram = 0;
  const noMatch: string[] = [];

  console.log(`Seeding ${YELLOW.length} Yellow core words...\n`);

  for (const word of YELLOW) {
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
      `INSERT INTO alt_symbols (word, aac_url, icon_id, verified, core_tier) VALUES ('${esc(word)}', ${urlVal}, NULL, 0, 'yellow')`
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

  console.log(`\n═══ Yellow tier complete ═══`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped (existing): ${skipped}`);
  console.log(`  With ARASAAC pictogram: ${withPictogram}`);
  console.log(`  No match: ${noMatch.length}`);
  if (noMatch.length > 0) {
    console.log(`  Missing: ${noMatch.join(', ')}`);
  }

  // Final count
  const result = JSON.parse(d1Query(
    "SELECT core_tier, COUNT(*) as cnt FROM alt_symbols WHERE core_tier = 'yellow'"
  ));
  console.log(`\n  Total yellow alt_symbols: ${result[0].results[0].cnt}`);
}

main();
