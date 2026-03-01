/**
 * aacResolver.ts — Pure AAC symbol resolver
 *
 * Resolves a descriptive phrase into a sequence of AAC cards.
 * Deterministic, no NLP. Receives all data as arguments.
 *
 * Purity constraints — this module must NOT:
 *   - Read DOM
 *   - Check render mode
 *   - Import brand tokens
 *   - Make HTTP/DB calls
 */

// ─── Types ──────────────────────────────────

export type CoreTier = 'green' | 'yellow' | 'orange' | null;

export type AACResolved =
  | { type: 'aac'; word: string; src: string; coreTier: CoreTier }
  | { type: 'text'; word: string; coreTier: CoreTier };

export type AltSymbol = {
  word: string;
  aac_url: string | null;
  icon_id: string | null;
  verified: boolean;
  core_tier: CoreTier;
};

export type ContextOverride = {
  context_token: string;
  block_symbol: string | null;
  prefer_symbol: string | null;
};

// ─── Stop words ─────────────────────────────
// Minimal stop words — most prepositions, conjunctions, and verbs
// are AAC core vocabulary and must NOT be stripped.
// See: AssistiveWare Ordered Core Words (Green/Yellow/Orange tiers)

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'was', 'were',
]);

// ─── Lemma lookup via OpenAAC words-en.json (CC BY 4.0) ──────
// Only the "base" field is used — maps inflected forms to uninflected base.
// Base form must exist in alt_symbols to resolve — ungoverned expansion is impossible.
//
// Builds a reverse index at module load: inflected form → base form.
// ~8,800 mappings from 3,878 dictionary entries.

import wordsEn from '../../data/words-en.json';

// Supplement for Green-tier words missing from OpenAAC dictionary.
// "move" and "stop" have no entry in words-en.json as of v0.1.
const LEMMA_SUPPLEMENT: Record<string, string> = {
  moving: 'move', moved: 'move',
  stopping: 'stop', stopped: 'stop',
};

const LEMMA_MAP: Map<string, string> = (() => {
  const map = new Map<string, string>();
  for (const [key, val] of Object.entries(wordsEn)) {
    if (key.startsWith('_') || typeof val !== 'object' || !val) continue;
    const entry = val as { inflections?: Record<string, unknown> };
    if (!entry.inflections) continue;
    const base = entry.inflections.base;
    if (typeof base !== 'string') continue;
    const baseLower = base.toLowerCase();
    // Map the key itself to base (e.g. "going" entry → base "go")
    const keyLower = key.toLowerCase();
    if (keyLower !== baseLower) map.set(keyLower, baseLower);
    // Map every single-word inflection value to base
    for (const [field, form] of Object.entries(entry.inflections)) {
      if (field === 'regulars' || typeof form !== 'string') continue;
      const lower = form.toLowerCase();
      if (lower.includes(' ') || lower === baseLower) continue;
      map.set(lower, baseLower);
    }
  }
  // Patch gaps — supplement never overwrites OpenAAC data
  for (const [inflected, base] of Object.entries(LEMMA_SUPPLEMENT)) {
    if (!map.has(inflected)) map.set(inflected, base);
  }
  return map;
})();

// ─── Tier ranking ───────────────────────────
// green=0 (earliest), yellow=1, orange=2, null/fringe=3
// Lower rank = more essential vocabulary

const TIER_RANK: Record<string, number> = { green: 0, yellow: 1, orange: 2 };
const FRINGE_RANK = 3;

function tierRank(tier: CoreTier): number {
  return tier ? (TIER_RANK[tier] ?? FRINGE_RANK) : FRINGE_RANK;
}

/** Returns true if the symbol's tier is within the allowed maxTier. */
function withinTier(symbolTier: CoreTier, maxTier: CoreTier): boolean {
  if (maxTier === null) return true; // null = show all tiers
  return tierRank(symbolTier) <= tierRank(maxTier);
}

// ─── Internal helpers ───────────────────────

/** Strip punctuation and lowercase a single token. */
function normaliseToken(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9'-]/g, '');
}

/** Tokenise a phrase into normalised words, filtering out empties and stop words. */
function tokenise(phrase: string): string[] {
  return phrase
    .split(/\s+/)
    .map(normaliseToken)
    .filter(t => t.length > 0 && !STOP_WORDS.has(t));
}

/**
 * Build a lookup map from symbol word → symbol.
 * If multiple symbols share a word, verified ones take priority.
 */
function buildSymbolMap(symbols: AltSymbol[]): Map<string, AltSymbol> {
  const map = new Map<string, AltSymbol>();
  for (const sym of symbols) {
    const key = sym.word.toLowerCase();
    const existing = map.get(key);
    // Prefer verified over unverified
    if (!existing || (sym.verified && !existing.verified)) {
      map.set(key, sym);
    }
  }
  return map;
}

/**
 * Build a set of blocked symbols and a map of preferred replacements
 * given the context tokens present in the phrase.
 *
 * When a row has both block_symbol and prefer_symbol, blocking "taxi"
 * with prefer "move" means: if "taxi" is matched and blocked, try
 * resolving "move" as a replacement instead of falling to text.
 *
 * The replacement map is keyed by blocked_symbol → prefer_symbol
 * so the resolution loop can look up replacements when a match is blocked.
 */
function resolveOverrides(
  phraseTokens: string[],
  overrides: ContextOverride[],
): { blocked: Set<string>; replacement: Map<string, string> } {
  const blocked = new Set<string>();
  const replacement = new Map<string, string>();

  const tokenSet = new Set(phraseTokens);

  for (const override of overrides) {
    if (tokenSet.has(override.context_token.toLowerCase())) {
      if (override.block_symbol) {
        const blockedWord = override.block_symbol.toLowerCase();
        blocked.add(blockedWord);
        // If same row also specifies a preferred replacement, map it
        if (override.prefer_symbol) {
          replacement.set(blockedWord, override.prefer_symbol.toLowerCase());
        }
      }
    }
  }

  return { blocked, replacement };
}

/** Resolve a matched symbol (or null) into an AACResolved card. */
function resolveMatch(match: AltSymbol | undefined, word: string): AACResolved {
  const coreTier = match?.core_tier ?? null;
  if (match?.aac_url) return { type: 'aac', word, src: match.aac_url, coreTier };
  return { type: 'text', word, coreTier };
}

// ─── Public API ─────────────────────────────

/**
 * Resolve a single word to an AAC card.
 *
 * Hierarchy:
 * 1. Exact match against symbol.word
 * 2. Lemma fallback via OpenAAC words-en.json
 * 3. Context guard — block/prefer based on overrides
 * 4. Tier gate — skip if symbol is above maxTier
 * 5. Resolution: aac_url → 'aac', else → 'text'
 *
 * @param maxTier — highest tier to include. null = all tiers.
 */
export function resolveAACWord(
  word: string,
  phraseContext: string,
  symbols: AltSymbol[],
  overrides: ContextOverride[],
  maxTier: CoreTier = null,
): AACResolved {
  const symbolMap = buildSymbolMap(symbols);
  const phraseTokens = tokenise(phraseContext);
  const { blocked, replacement } = resolveOverrides(phraseTokens, overrides);

  const normalised = normaliseToken(word);

  // 1. Exact match
  let match = symbolMap.get(normalised);

  // 2. Controlled lemma fallback
  if (!match) {
    const lemma = LEMMA_MAP.get(normalised);
    if (lemma) {
      match = symbolMap.get(lemma);
    }
  }

  // 3. Context guard — block wrong-domain matches, try preferred replacement
  if (match && blocked.has(match.word.toLowerCase())) {
    const preferred = replacement.get(match.word.toLowerCase());
    match = preferred ? symbolMap.get(preferred) : undefined;
  }

  // 4. Tier gate — skip symbols above the requested vocabulary depth
  if (match && !withinTier(match.core_tier, maxTier)) {
    match = undefined;
  }

  return resolveMatch(match, word);
}

/**
 * Resolve a descriptive phrase into a concise sequence of AAC cards.
 *
 * Only returns words that match an ARASAAC pictogram.
 * Unmatched words are dropped — AAC mode shows key concepts, not prose.
 * A typical phrase yields 3-4 cards.
 *
 * 1. Tokenise phrase into lowercase words, strip punctuation
 * 2. Filter stop words
 * 3. For each token, attempt symbol match (aac_url only)
 * 4. Tier gate — skip symbols above maxTier
 * 5. Only include tokens that resolved to aac pictogram
 *
 * @param maxTier — highest tier to include. null = all tiers.
 */
export function resolveAACPhrase(
  phrase: string,
  symbols: AltSymbol[],
  overrides: ContextOverride[],
  maxTier: CoreTier = null,
): AACResolved[] {
  const tokens = tokenise(phrase);
  const symbolMap = buildSymbolMap(symbols);
  const { blocked, replacement } = resolveOverrides(tokens, overrides);

  const results: AACResolved[] = [];

  for (const token of tokens) {
    // 1. Exact match
    let match = symbolMap.get(token);

    // 2. Controlled lemma fallback
    if (!match) {
      const lemma = LEMMA_MAP.get(token);
      if (lemma) {
        match = symbolMap.get(lemma);
      }
    }

    // 3. Context guard — block wrong-domain, try preferred replacement
    if (match && blocked.has(match.word.toLowerCase())) {
      const preferred = replacement.get(match.word.toLowerCase());
      match = preferred ? symbolMap.get(preferred) : undefined;
    }

    // 4. Tier gate — skip symbols above the requested vocabulary depth
    if (match && !withinTier(match.core_tier, maxTier)) {
      match = undefined;
    }

    // 5. Only include matched symbols — drop unresolved words
    if (match) {
      const resolved = resolveMatch(match, token);
      if (resolved.type !== 'text') {
        results.push(resolved);
      }
    }
  }

  return results;
}
