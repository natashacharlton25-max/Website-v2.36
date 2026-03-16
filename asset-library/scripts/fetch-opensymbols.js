/**
 * fetch-opensymbols.js — Clean symbol fetch using OpenSymbols API
 *
 * For each concept in bci-concept-definitions.json:
 *   1. Search OpenSymbols API (all sets, not just ARASAAC)
 *   2. Score results against concept definition (is/isNot/visual)
 *   3. Apply per-set bias rules from bci-set-bias-rules.json
 *   4. Pick best match per set, write results to bci-symbol-matches.json
 *
 * Uses the REAL OpenSymbols API: https://www.opensymbols.org/api/v1/symbols/search
 * NOT SymboTalk (which returned garbage: baby→pigs, coin→corner, elevator→pupil)
 *
 * Usage: node asset-library/scripts/fetch-opensymbols.js [--dry-run]
 */

const fs = require('node:fs');
const { resolve } = require('node:path');
const https = require('node:https');

const SCRIPTS_DIR = resolve(__dirname);
const PROJECT_DIR = resolve(__dirname, '../..');
const OPENSYMBOLS_API = 'https://www.opensymbols.org/api/v1/symbols/search';
const RATE_LIMIT_MS = 200; // be polite

// Stop words — same as aacResolver.ts line 44
// These never get symbol searches, render as text-only cards
const STOP_WORDS = new Set(['a', 'an', 'the', 'was', 'were']);

// ── Load data ──

const concepts = JSON.parse(
  fs.readFileSync(resolve(PROJECT_DIR, 'bci-concept-definitions.json'), 'utf8')
).concepts;

const biasRules = JSON.parse(
  fs.readFileSync(resolve(SCRIPTS_DIR, 'bci-set-bias-rules.json'), 'utf8')
);

const posTrust = biasRules.global_rules.pos_trust_matrix;

// ── Helpers ──

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse failed for ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

/**
 * Map OpenSymbols set names to our bias rule keys
 */
function normalizeSetName(symbolSet) {
  const s = (symbolSet || '').toLowerCase();
  if (s.includes('arasaac')) return 'arasaac';
  if (s.includes('mulberry')) return 'mulberry';
  if (s.includes('sclera')) return 'sclera';
  if (s.includes('noun-project') || s.includes('noun_project')) return 'noun_project';
  if (s.includes('tawasol')) return 'tawasol';
  if (s.includes('twemoji')) return 'twemoji';
  if (s.includes('icomoon')) return 'icomoon';
  if (s.includes('icon_archive')) return 'icon_archive';
  return s;
}

/**
 * Score a single OpenSymbols result against concept definition + bias rules
 */
function scoreResult(result, concept) {
  const setName = normalizeSetName(result.repo_key || result.symbol_set);
  const resultName = (result.name || '').toLowerCase().trim();
  const conceptWord = concept.word.toLowerCase().replace(/_/g, ' ');
  const ukWord = (concept.uk_word || '').toLowerCase();
  const usWord = (concept.us_word || '').toLowerCase();
  const bciPos = concept.bci_pos; // RED, YELLOW, GREEN, BLUE, WHITE

  // Build all acceptable name matches (primary + UK + US + BCI glosses + search hints)
  const acceptableNames = new Set([conceptWord, conceptWord.replace(/-/g, ' ')]);
  if (ukWord) acceptableNames.add(ukWord);
  if (usWord) acceptableNames.add(usWord);
  if (concept.bci_gloss) {
    concept.bci_gloss.split(',').forEach(g => {
      const clean = g.trim().replace(/_/g, ' ').replace(/-?\(.*?\)/g, '').trim().toLowerCase();
      if (clean) acceptableNames.add(clean);
    });
  }
  if (concept.search_hints) {
    concept.search_hints.forEach(h => acceptableNames.add(h.toLowerCase()));
  }

  let score = 50; // baseline
  const flags = [];

  // ── Name match scoring (case-insensitive) ──

  // Exact name match to primary word
  if (resultName === conceptWord || resultName === conceptWord.replace(/-/g, ' ')) {
    score += 50;
    flags.push('exact_match');
  }
  // Exact match to UK/US variant
  else if (ukWord && resultName === ukWord) {
    score += 45;
    flags.push('uk_match');
  }
  else if (usWord && resultName === usWord) {
    score += 45;
    flags.push('us_match');
  }
  // Exact match to any BCI gloss or search hint
  else if (acceptableNames.has(resultName)) {
    score += 40;
    flags.push('gloss_or_hint_match');
  }
  // Name contains primary word as whole word
  else if (new RegExp(`\\b${escapeRegex(conceptWord)}\\b`).test(resultName)) {
    score += 20;
    flags.push('partial_match');
  }
  // Name contains any acceptable word as whole word
  else if ([...acceptableNames].some(n => n.length > 2 && new RegExp(`\\b${escapeRegex(n)}\\b`).test(resultName))) {
    score += 15;
    flags.push('hint_partial_match');
  }
  // Name shares no words with concept
  else {
    score -= 30;
    flags.push('no_word_match');
  }

  // ── POS trust matrix ──

  const trustLevel = posTrust[bciPos]?.[setName];
  if (trustLevel === 'trust') {
    score += 10;
  } else if (trustLevel === 'check') {
    score -= 5;
    flags.push('pos_check_needed');
  } else if (trustLevel === 'reject') {
    score -= 50;
    flags.push('pos_rejected');
  }

  // ── Bias rule blocklists ──

  // Global content blocklist — applies to ALL sets
  const globalContentBlock = ['make love', 'intrauterine', 'contraceptive', 'suppository', 'enema', 'catheter', 'genital', 'erotic', 'intercourse', 'sex position'];
  if (globalContentBlock.some(b => resultName.includes(b))) {
    score = -100;
    flags.push('inappropriate_content');
  }

  // ARASAAC deterministic garbage
  if (setName === 'arasaac') {
    const blocklist = ['bald 1', 'simple'];
    if (blocklist.some(b => resultName.includes(b))) {
      score = -100;
      flags.push('arasaac_blocklist');
    }
  }

  // Mulberry country leak
  if (setName === 'mulberry' && resultName.startsWith('country ')) {
    score = -100;
    flags.push('mulberry_country_leak');
  }

  // ── isNot check — does the result name appear in the isNot exclusion list? ──
  // Strategy: check if the FULL result name (as a phrase) matches within isNot.
  // This avoids false positives where a concept word like "balloon" appears
  // inside a compound isNot phrase like "hot air balloon".
  //
  // Rules:
  // 1. If the full result name appears in isNot → collision (e.g. "eye shadow" in isNot)
  // 2. If a result word appears in isNot BUT is also an acceptable name → no collision
  // 3. Single-word results only collide if the word is in isNot AND not in acceptableNames

  if (concept.isNot) {
    // isNot is comma-separated phrases (or space-separated legacy).
    // Each phrase is checked against the result name as a whole.
    const delimiter = concept.isNot.includes(',') ? ',' : /\s+/;
    const isNotPhrases = concept.isNot.toLowerCase()
      .split(delimiter)
      .map(p => p.trim())
      .filter(p => p.length > 2);

    // Check if result name contains any isNot phrase as a whole word/phrase
    const badPhrases = isNotPhrases.filter(phrase => {
      // Skip if phrase is also an acceptable name for this concept
      if (acceptableNames.has(phrase)) return false;
      if (phrase === conceptWord) return false;
      // Check if phrase appears as whole word(s) in result name
      const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`);
      return regex.test(resultName);
    });

    if (badPhrases.length > 0) {
      score -= 25 * badPhrases.length;
      flags.push('isNot_collision:' + badPhrases.join(','));
    }
  }

  // ── URL/name mismatch — image filename doesn't match result name ──

  if (result.image_url) {
    const urlPath = decodeURIComponent(result.image_url.split('/').pop() || '');
    const urlBase = urlPath.replace(/\.(png|svg|jpg|jpeg|gif).*$/i, '').replace(/[_-]/g, ' ').toLowerCase().trim();
    const nameWords = resultName.split(/\s+/).filter(w => w.length > 2);
    const urlWords = urlBase.split(/\s+/).filter(w => w.length > 2);
    const overlap = nameWords.some(nw => urlWords.some(uw => uw.includes(nw) || nw.includes(uw)));
    if (nameWords.length > 0 && urlWords.length > 0 && !overlap) {
      score -= 40;
      flags.push('url_name_mismatch:' + urlBase);
    }
  }

  // ── Compound/scene name penalty (4+ words = probably a scene not a concept) ──

  const wordCount = resultName.split(/\s+/).length;
  if (wordCount >= 4) {
    score -= 15;
    flags.push('scene_name');
  }

  return { score: Math.min(score, 100), flags, set: setName };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Main ──

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const conceptEntries = Object.entries(concepts);
  console.log(`Fetching symbols for ${conceptEntries.length} concepts from OpenSymbols API`);
  if (dryRun) console.log('(DRY RUN — no file written)\n');

  const allResults = {};

  for (let i = 0; i < conceptEntries.length; i++) {
    const [bciId, concept] = conceptEntries[i];
    const word = concept.word.replace(/_/g, ' ');

    // ── Skip stop words — same as aacResolver, text-only cards ──
    if (STOP_WORDS.has(word.toLowerCase())) {
      allResults[bciId] = {
        word,
        bci_pos: concept.bci_pos,
        uk_word: concept.uk_word || null,
        us_word: concept.us_word || null,
        searched: [],
        total_results: 0,
        skipped: 'stop_word',
        best: null,
        per_set: {}
      };
      console.log(`  [${i + 1}/${conceptEntries.length}] ${word} → SKIP (stop word, text-only card)`);
      continue;
    }

    // ── Build search term cascade ──
    // Try primary word first, then fallbacks if score is poor (<60)
    const searchTerms = [word];

    // Add UK/US variants
    if (concept.uk_word) searchTerms.push(concept.uk_word);
    if (concept.us_word) searchTerms.push(concept.us_word);

    // Add BCI gloss variants (split on comma, clean)
    if (concept.bci_gloss) {
      concept.bci_gloss.split(',').forEach(g => {
        const clean = g.trim().replace(/_/g, ' ').replace(/-?\(.*?\)/g, '').trim();
        if (clean && clean !== word && !searchTerms.includes(clean)) {
          searchTerms.push(clean);
        }
      });
    }

    // Add explicit search_hints (curated terms that return good OpenSymbols results)
    if (concept.search_hints && Array.isArray(concept.search_hints)) {
      concept.search_hints.forEach(h => {
        if (!searchTerms.includes(h)) searchTerms.push(h);
      });
    }

    // Add key nouns from 'is' field (first 3 words > 4 chars that aren't stopwords)
    if (concept.is) {
      const stopwords = ['with', 'from', 'that', 'this', 'what', 'which', 'where', 'when', 'than', 'then', 'into', 'onto', 'upon', 'after', 'before'];
      const isWords = concept.is.split(/\s+/)
        .filter(w => w.length > 4 && !stopwords.includes(w))
        .slice(0, 3);
      isWords.forEach(w => {
        if (!searchTerms.includes(w)) searchTerms.push(w);
      });
    }

    // Dedupe and limit
    const uniqueTerms = [...new Set(searchTerms)].slice(0, 8);

    // ── Search with cascade ──
    let bestOverall = null;
    let bestPerSet = {};
    let totalResults = 0;
    let searchedTerms = [];

    for (const term of uniqueTerms) {
      const url = `${OPENSYMBOLS_API}?q=${encodeURIComponent(term)}`;
      let results;
      try {
        results = await fetchJSON(url);
      } catch (err) {
        await sleep(RATE_LIMIT_MS);
        continue;
      }

      if (!Array.isArray(results)) {
        await sleep(RATE_LIMIT_MS);
        continue;
      }

      totalResults += results.length;
      searchedTerms.push(term);

      // Score each result
      const scored = results.map(r => {
        const { score, flags, set } = scoreResult(r, concept);
        return {
          name: r.name,
          set,
          image_url: r.image_url ? r.image_url.replace(/ /g, '%20') : r.image_url,
          license: r.license,
          score,
          flags: term !== word ? [...flags, 'matched_via:' + term] : flags
        };
      });

      // Update best per set
      scored.forEach(r => {
        if (!bestPerSet[r.set] || r.score > bestPerSet[r.set].score) {
          bestPerSet[r.set] = r;
        }
      });

      // Update overall best
      scored.forEach(r => {
        if (!bestOverall || r.score > bestOverall.score) {
          bestOverall = r;
        }
      });

      await sleep(RATE_LIMIT_MS);

      // If we got strong matches across multiple sets, stop searching
      // Need at least 3 sets populated OR a 100-score match before stopping
      const setsFound = Object.keys(bestPerSet).filter(s => bestPerSet[s].score > 0).length;
      if (bestOverall && bestOverall.score >= 100 && setsFound >= 2) break;
      if (bestOverall && bestOverall.score >= 80 && setsFound >= 3) break;
    }

    // Only keep best if score > 0
    const best = bestOverall && bestOverall.score > 0 ? bestOverall : null;

    allResults[bciId] = {
      word,
      bci_pos: concept.bci_pos,
      uk_word: concept.uk_word || null,
      us_word: concept.us_word || null,
      searched: searchedTerms,
      total_results: totalResults,
      best: best ? {
        name: best.name,
        set: best.set,
        image_url: best.image_url,
        license: best.license,
        score: best.score,
        flags: best.flags
      } : null,
      per_set: bestPerSet
    };

    // Log progress
    const status = best ? `✓ ${best.name} (${best.set}, score=${best.score})` : '✗ no good match';
    const cascade = searchedTerms.length > 1 ? ` [tried: ${searchedTerms.join(', ')}]` : '';
    console.log(`  [${i + 1}/${conceptEntries.length}] ${word} → ${status}${cascade}`);
  }

  // ── Write output ──

  if (!dryRun) {
    const outPath = resolve(SCRIPTS_DIR, 'bci-symbol-matches.json');
    fs.writeFileSync(outPath, JSON.stringify(allResults, null, 2));
    console.log(`\nWrote ${Object.keys(allResults).length} results to bci-symbol-matches.json`);
  }

  // ── Summary ──

  const entries = Object.values(allResults);
  const matched = entries.filter(e => e.best && e.best.score >= 80);
  const partial = entries.filter(e => e.best && e.best.score >= 40 && e.best.score < 80);
  const poor = entries.filter(e => e.best && e.best.score > 0 && e.best.score < 40);
  const none = entries.filter(e => !e.best || e.best.score <= 0);

  console.log(`\n=== SUMMARY ===`);
  console.log(`  Strong match (≥80): ${matched.length}`);
  console.log(`  Partial (40-79):    ${partial.length}`);
  console.log(`  Poor (<40):         ${poor.length}`);
  console.log(`  No match:           ${none.length}`);
  console.log(`  Total:              ${entries.length}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
