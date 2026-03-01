/**
 * Build-time report: find words the AAC resolver can't handle.
 *
 * Queries D1 for all alt_aac_phrase values and alt_symbols,
 * tokenises each phrase, and reports words with no matching symbol.
 *
 * Output: unresolved-words.txt (one word per line, with source asset)
 *
 * Usage: npx tsx scripts/check-unresolved-words.ts
 * Intended to run as part of the pre-build snapshot step.
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolveAACWord } from '../../src/lib/aac/aacResolver';
import type { AltSymbol, ContextOverride } from '../../src/lib/aac/aacResolver';

function d1Query(sql: string): any {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() });
  return JSON.parse(raw);
}

// 1. Load all alt_symbols
const symResult = d1Query('SELECT word, aac_url, icon_id, verified FROM alt_symbols');
const symbols: AltSymbol[] = symResult[0].results.map((r: any) => ({
  word: r.word,
  aac_url: r.aac_url,
  icon_id: r.icon_id,
  verified: Boolean(r.verified),
}));

// 2. Load context overrides
const ovResult = d1Query('SELECT context_token, block_symbol, prefer_symbol FROM alt_symbol_context_overrides');
const overrides: ContextOverride[] = ovResult[0].results;

// 3. Load all alt_aac_phrase values
const altResult = d1Query("SELECT id, name, alt_aac_phrase FROM assets WHERE alt_aac_phrase IS NOT NULL AND alt_aac_phrase <> ''");
const assets: { id: string; name: string; alt_aac_phrase: string }[] = altResult[0].results;

console.log(`Symbols loaded: ${symbols.length}`);
console.log(`Overrides loaded: ${overrides.length}`);
console.log(`Assets with AAC phrase: ${assets.length}`);

// 4. Resolve every word in each phrase, collect unresolved
const unresolved = new Map<string, Set<string>>(); // word → set of source asset names

for (const asset of assets) {
  const words = asset.alt_aac_phrase.split(/\s+/).filter(w => w.length > 0);
  for (const word of words) {
    const resolved = resolveAACWord(word, asset.alt_aac_phrase, symbols, overrides);
    if (resolved.type === 'text') {
      const sources = unresolved.get(resolved.word) || new Set();
      sources.add(asset.name);
      unresolved.set(resolved.word, sources);
    }
  }
}

// 5. Sort by frequency (most common unresolved first)
const sorted = [...unresolved.entries()].sort((a, b) => b[1].size - a[1].size);

// 6. Write report
const lines: string[] = [
  `# Unresolved AAC Words — ${new Date().toISOString().slice(0, 10)}`,
  `# ${sorted.length} unique words across ${assets.length} AAC phrases`,
  `# Words below have no matching alt_symbol and are not stop words.`,
  `# To fix: add a lemma entry in aacResolver.ts or create an alt_symbol.`,
  '',
  '# word | occurrences | source assets',
];

for (const [word, sources] of sorted) {
  const sourceList = [...sources].slice(0, 3).join(', ');
  const suffix = sources.size > 3 ? ` +${sources.size - 3} more` : '';
  lines.push(`${word} | ${sources.size} | ${sourceList}${suffix}`);
}

const outPath = resolve(process.cwd(), 'unresolved-words.txt');
writeFileSync(outPath, lines.join('\n') + '\n');

console.log(`\nUnresolved words: ${sorted.length}`);
console.log(`Report written to: ${outPath}`);

if (sorted.length > 0) {
  console.log('\nTop 10:');
  for (const [word, sources] of sorted.slice(0, 10)) {
    console.log(`  ${word} (${sources.size})`);
  }
}
