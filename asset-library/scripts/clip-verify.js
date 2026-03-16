/**
 * clip-verify.js — CLIP visual verification of symbol matches
 *
 * Strategy: For each concept, build descriptive labels from is/isNot fields
 * and run zero-shot image classification. Instead of matching the raw word,
 * we ask CLIP "what does this image show?" with descriptive candidates.
 *
 * Scoring:
 *   - Build 3 positive labels from `is` field (descriptive phrases)
 *   - Build 3 negative labels from `isNot` field (wrong meanings)
 *   - Add 2 generic labels ("abstract symbol", "text or icon")
 *   - PASS if any positive label is in top 2
 *   - WARN if positive label scores > 0.2 but not top
 *   - FAIL if negative label wins decisively
 *
 * Uses @huggingface/transformers (local, free, no API key)
 *
 * Usage: node asset-library/scripts/clip-verify.js [--limit=10]
 */

const fs = require('node:fs');
const { resolve } = require('node:path');

const SCRIPTS_DIR = resolve(__dirname);
const PROJECT_DIR = resolve(__dirname, '../..');

// ── Load data ──

const matches = JSON.parse(
  fs.readFileSync(resolve(SCRIPTS_DIR, 'bci-symbol-matches.json'), 'utf8')
);
const concepts = JSON.parse(
  fs.readFileSync(resolve(PROJECT_DIR, 'bci-concept-definitions.json'), 'utf8')
).concepts;

// ── Helpers ──

/** Build descriptive CLIP labels from concept definition */
function buildLabels(concept) {
  const word = concept.word.replace(/_/g, ' ');
  const isWords = (concept.is || '').split(/\s+/).filter(w => w.length > 3);
  const isNotPhrases = (concept.isNot || '').split(',').map(p => p.trim()).filter(p => p.length > 2);
  const visual = concept.visual || '';

  // Positive: descriptive phrases about what this IS
  const positive = [];
  // Use visual description if available (best for CLIP)
  if (visual) positive.push(visual.substring(0, 60));
  // Use first few `is` words as a phrase
  if (isWords.length >= 2) positive.push(isWords.slice(0, 4).join(' '));
  // Use the word itself
  positive.push(word);
  // Dedupe
  const uniquePositive = [...new Set(positive)].slice(0, 3);

  // Negative: wrong meanings from isNot
  const negative = isNotPhrases.slice(0, 4);

  return { positive: uniquePositive, negative };
}

// ── Main ──

async function main() {
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : 95;

  console.log('Loading CLIP model...');
  const { pipeline, env } = await import('@huggingface/transformers');
  env.cacheDir = resolve(PROJECT_DIR, '.hf-cache');

  const classifier = await pipeline(
    'zero-shot-image-classification',
    'Xenova/clip-vit-base-patch32',
    { device: 'cpu' }
  );
  console.log('CLIP loaded.\n');

  const entries = Object.entries(matches).filter(([id, m]) => {
    if (m.skipped) return false;
    if (!m.best || !m.best.image_url) return false;
    if (!concepts[id]) return false;
    return true;
  }).slice(0, limit);

  console.log(`Verifying ${entries.length} images...\n`);

  const results = [];

  for (let i = 0; i < entries.length; i++) {
    const [bciId, m] = entries[i];
    const c = concepts[bciId];
    const imageUrl = m.best.image_url;
    const { positive, negative } = buildLabels(c);

    const allLabels = [...positive, ...negative];
    if (allLabels.length < 2) {
      console.log(`  [${i + 1}/${entries.length}] ${c.word} — skipped (not enough labels)`);
      continue;
    }

    try {
      const output = await classifier(imageUrl, allLabels);

      // Find best positive and best negative scores
      const positiveScores = output.filter(o => positive.includes(o.label));
      const negativeScores = output.filter(o => negative.includes(o.label));
      const bestPositive = positiveScores[0] || { label: '?', score: 0 };
      const bestNegative = negativeScores[0] || { label: '?', score: 0 };
      const topResult = output[0];

      // Determine verdict
      let verdict = 'FAIL';
      if (positive.includes(topResult.label)) {
        verdict = 'PASS';
      } else if (bestPositive.score > 0.15) {
        verdict = 'WARN';
      } else if (negative.includes(topResult.label)) {
        verdict = 'FAIL';
      } else {
        // Top label is neither positive nor negative — ambiguous
        verdict = 'UNCLEAR';
      }

      const result = {
        bci_index: bciId,
        word: c.word,
        image_url: imageUrl,
        match_name: m.best.name,
        match_set: m.best.set,
        verdict,
        best_positive_label: bestPositive.label,
        best_positive_score: Math.round(bestPositive.score * 1000) / 1000,
        best_negative_label: bestNegative.label,
        best_negative_score: Math.round(bestNegative.score * 1000) / 1000,
        top_label: topResult.label,
        top_score: Math.round(topResult.score * 1000) / 1000,
        all_scores: output.map(o => ({
          label: o.label.substring(0, 50),
          score: Math.round(o.score * 1000) / 1000
        }))
      };

      results.push(result);

      const icon = { PASS: '✓', WARN: '~', FAIL: '✗', UNCLEAR: '?' }[verdict];
      console.log(`  [${i + 1}/${entries.length}] ${icon} ${c.word} — pos=${bestPositive.score.toFixed(3)} "${bestPositive.label.substring(0, 25)}" | neg=${bestNegative.score.toFixed(3)} "${bestNegative.label.substring(0, 25)}" | top="${topResult.label.substring(0, 25)}" (${topResult.score.toFixed(3)})`);

    } catch (err) {
      console.log(`  [${i + 1}/${entries.length}] ✗ ${c.word} — ERROR: ${err.message.substring(0, 60)}`);
    }
  }

  // Write results
  const outPath = resolve(SCRIPTS_DIR, 'clip-verification-results.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

  // Summary
  const pass = results.filter(r => r.verdict === 'PASS').length;
  const warn = results.filter(r => r.verdict === 'WARN').length;
  const fail = results.filter(r => r.verdict === 'FAIL').length;
  const unclear = results.filter(r => r.verdict === 'UNCLEAR').length;

  console.log(`\nWrote ${results.length} results to clip-verification-results.json`);
  console.log(`\n=== SUMMARY ===`);
  console.log(`  PASS:    ${pass}`);
  console.log(`  WARN:    ${warn}`);
  console.log(`  FAIL:    ${fail}`);
  console.log(`  UNCLEAR: ${unclear}`);

  if (fail > 0) {
    console.log(`\n=== FAILURES ===`);
    results.filter(r => r.verdict === 'FAIL').forEach(r => {
      console.log(`  ${r.bci_index} ${r.word}: image="${r.match_name}" → top="${r.top_label}" (${r.top_score}), wanted="${r.best_positive_label}" (${r.best_positive_score})`);
    });
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
