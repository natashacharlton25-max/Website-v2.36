/**
 * Backfill core_tier on alt_symbols from AssistiveWare Ordered Core Words.
 *
 * Source: AssistiveWare Core Word Classroom (2016)
 * - Green: earliest/most essential
 * - Yellow: 1-2 word combiners
 * - Orange: complex/later
 * - Feelings (blue): tagged as 'green' (essential AAC vocabulary)
 *
 * Usage: npx tsx scripts/_backfill-core-tiers.ts
 */

import { execSync } from 'node:child_process';

function d1Query(sql: string): string {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  return execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() });
}

// ── AssistiveWare Ordered Core Words ──

const GREEN: string[] = [
  // Verbs
  'want', 'go', 'like', 'stop', 'help', 'get', 'look', 'put', 'make',
  'need', 'open', 'do', 'is', 'can', 'have', 'see', 'come', 'eat',
  'drink', 'turn', "don't",
  // Describing
  'not', 'done', 'finished', 'different', 'good',
  // Quantity
  'more', 'some', 'all',
  // Prepositions
  'on', 'in', 'up', 'here',
  // Which
  'this', 'that',
  // Questions
  'what', 'where', 'who', 'when',
  // Pronouns
  'i', 'it', 'you', 'he', 'she', 'me',
];

const GREEN_FEELINGS: string[] = [
  'happy', 'hungry', 'afraid', 'hurt', 'mad', 'sorry', 'tired',
  'excited', 'silly', 'bored', 'frustrated', 'sick', 'sad',
  'thirsty', 'lonely',
];

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

// ── Build word→tier map (green wins over yellow wins over orange) ──

const tierMap = new Map<string, string>();

// Orange first (lowest priority)
for (const w of ORANGE) tierMap.set(w.toLowerCase(), 'orange');
// Yellow overwrites orange
for (const w of YELLOW) tierMap.set(w.toLowerCase(), 'yellow');
// Green overwrites yellow
for (const w of GREEN) tierMap.set(w.toLowerCase(), 'green');
for (const w of GREEN_FEELINGS) tierMap.set(w.toLowerCase(), 'green');

const totalCoreWords = tierMap.size;
console.log(`Core words from PDFs: ${totalCoreWords}`);
console.log(`  Green: ${GREEN.length + GREEN_FEELINGS.length}`);
console.log(`  Yellow: ${YELLOW.length}`);
console.log(`  Orange: ${ORANGE.length}`);

// ── Load existing alt_symbols ──

const result = JSON.parse(d1Query('SELECT id, word FROM alt_symbols'));
const rows: { id: number; word: string }[] = result[0].results;

console.log(`\nalt_symbols rows: ${rows.length}`);

// ── Match and update ──

let matched = 0;
let updated = 0;
const missing: { word: string; tier: string }[] = [];

const symbolWords = new Set(rows.map(r => r.word.toLowerCase()));

for (const [word, tier] of tierMap) {
  if (symbolWords.has(word)) {
    matched++;
  } else {
    missing.push({ word, tier });
  }
}

console.log(`\nCore words found in alt_symbols: ${matched}/${totalCoreWords}`);
console.log(`Core words missing from alt_symbols: ${missing.length}`);

if (missing.length > 0) {
  console.log('\nMissing words by tier:');
  const byTier = { green: [] as string[], yellow: [] as string[], orange: [] as string[] };
  for (const m of missing) {
    (byTier[m.tier as keyof typeof byTier] || []).push(m.word);
  }
  if (byTier.green.length) console.log(`  Green (${byTier.green.length}): ${byTier.green.join(', ')}`);
  if (byTier.yellow.length) console.log(`  Yellow (${byTier.yellow.length}): ${byTier.yellow.join(', ')}`);
  if (byTier.orange.length) console.log(`  Orange (${byTier.orange.length}): ${byTier.orange.join(', ')}`);
}

// ── Apply core_tier updates (batched by tier) ──

console.log('\nUpdating core_tier...');

// Group matched words by tier
const byTierUpdate = { green: [] as string[], yellow: [] as string[], orange: [] as string[] };
for (const row of rows) {
  const tier = tierMap.get(row.word.toLowerCase());
  if (tier) {
    byTierUpdate[tier as keyof typeof byTierUpdate].push(row.word.replace(/'/g, "''"));
    updated++;
  }
}

// One UPDATE per tier
for (const [tier, words] of Object.entries(byTierUpdate)) {
  if (words.length === 0) continue;
  const inList = words.map(w => `'${w}'`).join(', ');
  d1Query(`UPDATE alt_symbols SET core_tier = '${tier}' WHERE word IN (${inList})`);
  console.log(`  ${tier}: ${words.length} rows`);
}

console.log(`Updated ${updated} alt_symbol rows with core_tier.`);

// ── Summary ──

const countResult = JSON.parse(d1Query(
  "SELECT core_tier, COUNT(*) as cnt FROM alt_symbols GROUP BY core_tier ORDER BY core_tier"
));
console.log('\nFinal distribution:');
for (const r of countResult[0].results) {
  console.log(`  ${r.core_tier || '(null/fringe)'}: ${r.cnt}`);
}
