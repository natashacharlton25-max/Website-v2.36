/**
 * blissGrammar.ts — Bliss grammar indicator detection
 *
 * Detects English grammar features and returns Bliss indicator BCI indices.
 * Indicators are rendered as SEPARATE AacCard instances in the sequence,
 * not overlays within a card. The pipeline inserts indicator cards after
 * the content card they modify.
 *
 * Example:
 *   OpenAAC: [the] [cats] [sat]               -> 3 AacCards
 *   Bliss:   [the] [cat] [plural] [sit] [past] -> 5 AacCards
 *
 * Purity constraints — this module must NOT:
 *   - Read DOM
 *   - Check render mode or symbol set
 *   - Import brand tokens
 *   - Make HTTP/DB calls
 */

// ── Bliss indicator BCI reference numbers (BCI-AV 2025) ──

export const BLISS_INDICATORS = {
  // Action/tense
  action: 8993,
  active: 8994,
  pastAction: 9004,
  futureAction: 8999,
  presentAction: 24807,
  passive: 9003,
  pastPassive: 9007,
  futurePassive: 9001,
  conditional: 8995,
  pastConditional: 9005,
  futureConditional: 9000,
  continuous: 28043,
  imperative: 24670,

  // Noun/description
  thing: 9009,
  thingPlural: 9010,
  plural: 9011,
  description: 8998,
  descriptionAfterFact: 8996,
  descriptionBeforeFact: 8997,
  definite: 24667,
  thingDefinite: 28045,
  pluralDefinite: 28044,
  adverb: 24665,

  // Modifiers
  possessive: 12663,
  comparative: 24879,
  superlative: 24944,
  negative: 15474,
  opposite: 15927,
  intensity: 14947,
  generalization: 14430,
  metaphor: 15460,
  much: 15671,
  diminutive: 28052,
} as const;

// ── Indicator metadata ──

const INDICATOR_NAMES: Record<number, string> = {
  [BLISS_INDICATORS.pastAction]: 'past',
  [BLISS_INDICATORS.futureAction]: 'future',
  [BLISS_INDICATORS.presentAction]: 'present',
  [BLISS_INDICATORS.continuous]: 'continuous',
  [BLISS_INDICATORS.passive]: 'passive',
  [BLISS_INDICATORS.pastPassive]: 'past passive',
  [BLISS_INDICATORS.futurePassive]: 'future passive',
  [BLISS_INDICATORS.conditional]: 'conditional',
  [BLISS_INDICATORS.pastConditional]: 'past conditional',
  [BLISS_INDICATORS.futureConditional]: 'future conditional',
  [BLISS_INDICATORS.imperative]: 'imperative',
  [BLISS_INDICATORS.action]: 'action',
  [BLISS_INDICATORS.active]: 'active',
  [BLISS_INDICATORS.plural]: 'plural',
  [BLISS_INDICATORS.thing]: 'thing',
  [BLISS_INDICATORS.thingPlural]: 'things',
  [BLISS_INDICATORS.description]: 'description',
  [BLISS_INDICATORS.descriptionAfterFact]: 'past description',
  [BLISS_INDICATORS.descriptionBeforeFact]: 'future description',
  [BLISS_INDICATORS.definite]: 'definite',
  [BLISS_INDICATORS.thingDefinite]: 'the thing',
  [BLISS_INDICATORS.pluralDefinite]: 'the things',
  [BLISS_INDICATORS.adverb]: 'adverb',
  [BLISS_INDICATORS.possessive]: 'possessive',
  [BLISS_INDICATORS.comparative]: 'comparative',
  [BLISS_INDICATORS.superlative]: 'superlative',
  [BLISS_INDICATORS.negative]: 'negative',
  [BLISS_INDICATORS.opposite]: 'opposite',
  [BLISS_INDICATORS.intensity]: 'intensity',
  [BLISS_INDICATORS.generalization]: 'generalization',
  [BLISS_INDICATORS.metaphor]: 'metaphor',
  [BLISS_INDICATORS.much]: 'much',
  [BLISS_INDICATORS.diminutive]: 'diminutive',
};

// ── Types ──

export interface BlissIndicator {
  /** BCI reference number of the indicator symbol */
  bci: number;
  /** Human-readable indicator type name (e.g. "plural", "past") */
  type: string;
  /** Bliss symbol URL — always from blissymbolics.net */
  url: string;
}

// ── Detection ──

/**
 * Detect English grammar features and return Bliss indicator entries.
 *
 * Returns an array of indicators — the pipeline inserts these as
 * additional AacCard instances (isIndicator: true) after the
 * content card for the word.
 *
 * @param word     - The English word as it appears in the content
 * @param baseForm - The lemmatised base form (from aacResolver's lemmatise())
 * @param pos      - Part of speech from BCI data (RED=verb, YELLOW=noun, GREEN=adj, etc.)
 * @param context  - Optional surrounding words for better detection
 * @returns Array of BlissIndicator objects (usually 0 or 1, occasionally 2)
 */
export function detectBlissIndicators(
  word: string,
  baseForm: string,
  pos: string,
  context?: { prevWord?: string; nextWord?: string }
): BlissIndicator[] {
  const w = word.toLowerCase().trim();
  const base = baseForm.toLowerCase().trim();
  const prev = context?.prevWord?.toLowerCase() || '';
  const indicators: BlissIndicator[] = [];

  // ── Negative context (applies to any POS) ──
  if (
    prev === 'not' ||
    prev === "don't" ||
    prev === "doesn't" ||
    prev === "didn't" ||
    prev === 'no' ||
    prev === 'never'
  ) {
    indicators.push(makeIndicator(BLISS_INDICATORS.negative));
  }

  // ── Verbs (RED POS) ──
  if (pos === 'RED') {
    // Future: preceded by "will" or "shall"
    if (prev === 'will' || prev === 'shall') {
      indicators.push(makeIndicator(BLISS_INDICATORS.futureAction));
      return indicators;
    }

    // Continuous/progressive: ends in 'ing'
    if (w.endsWith('ing') && w !== base) {
      indicators.push(makeIndicator(BLISS_INDICATORS.continuous));
      return indicators;
    }

    // Past tense: word differs from base, ends in 'ed', or irregular past
    if (w !== base && !w.endsWith('ing')) {
      indicators.push(makeIndicator(BLISS_INDICATORS.pastAction));
      return indicators;
    }

    // Base form verb with no tense marker — no indicator needed
    return indicators;
  }

  // ── Nouns (YELLOW POS) — plurals ──
  if (pos === 'YELLOW') {
    // Possessive check first
    if (w.endsWith("'s") || w.endsWith("s'")) {
      indicators.push(makeIndicator(BLISS_INDICATORS.possessive));
      return indicators;
    }

    // Plural: word differs from base and has plural-like ending
    if (
      w !== base &&
      (w.endsWith('s') && !w.endsWith('ss') ||
        w.endsWith('es') ||
        w.endsWith('ies'))
    ) {
      indicators.push(makeIndicator(BLISS_INDICATORS.plural));
    }

    return indicators;
  }

  // ── Adjectives (GREEN POS) ──
  if (pos === 'GREEN') {
    // Superlative: -est or "most" context
    if ((w.endsWith('est') && w !== base) || prev === 'most') {
      indicators.push(makeIndicator(BLISS_INDICATORS.superlative));
      return indicators;
    }

    // Comparative: -er or "more" context
    if ((w.endsWith('er') && w !== base) || prev === 'more') {
      indicators.push(makeIndicator(BLISS_INDICATORS.comparative));
      return indicators;
    }

    // Past participle as adjective: "broken", "excited"
    if (w.endsWith('ed') || w.endsWith('en')) {
      indicators.push(makeIndicator(BLISS_INDICATORS.descriptionAfterFact));
      return indicators;
    }

    // Present participle as adjective: "exciting", "running"
    if (w.endsWith('ing')) {
      indicators.push(makeIndicator(BLISS_INDICATORS.descriptionBeforeFact));
      return indicators;
    }

    // Base adjective — description indicator
    indicators.push(makeIndicator(BLISS_INDICATORS.description));
    return indicators;
  }

  // ── Adverbs (BLUE POS or -ly suffix) ──
  if (pos === 'BLUE' || w.endsWith('ly')) {
    indicators.push(makeIndicator(BLISS_INDICATORS.adverb));
    return indicators;
  }

  return indicators;
}

// ── Helpers ──

function makeIndicator(bci: number): BlissIndicator {
  return {
    bci,
    type: INDICATOR_NAMES[bci] || 'indicator',
    url: `https://www.blissymbolics.net/refnumber/${bci}`,
  };
}
