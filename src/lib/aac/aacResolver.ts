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

export type AACResolved =
  | { type: 'aac'; word: string; src: string }
  | { type: 'text'; word: string };

export type AltSymbol = {
  word: string;
  aac_url: string | null;
  icon_id: string | null;
  verified: boolean;
};

export type ContextOverride = {
  context_token: string;
  block_symbol: string | null;
  prefer_symbol: string | null;
};

// ─── Stop words ─────────────────────────────

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were',
  'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'and', 'or', 'but', 'not',
]);

// ─── Controlled lemma map ───────────────────
// Only these verbs get lemmatised. Everything else must be exact match.

const LEMMA_MAP: Record<string, string> = {
  // -ing forms
  moving: 'move',
  flying: 'fly',
  running: 'run',
  walking: 'walk',
  sitting: 'sit',
  standing: 'stand',
  helping: 'help',
  feeling: 'feel',
  going: 'go',
  stopping: 'stop',
  // past tense forms
  moved: 'move',
  flew: 'fly',
  ran: 'run',
  walked: 'walk',
  sat: 'sit',
  stood: 'stand',
  helped: 'help',
  felt: 'feel',
  went: 'go',
  stopped: 'stop',
};

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
  if (match?.aac_url) return { type: 'aac', word, src: match.aac_url };
  return { type: 'text', word };
}

// ─── Public API ─────────────────────────────

/**
 * Resolve a single word to an AAC card.
 *
 * Hierarchy:
 * 1. Exact match against symbol.word
 * 2. Controlled lemma fallback (verb allowlist only)
 * 3. Context guard — block/prefer based on overrides
 * 4. Resolution: aac_url → 'aac', else → 'text'
 */
export function resolveAACWord(
  word: string,
  phraseContext: string,
  symbols: AltSymbol[],
  overrides: ContextOverride[],
): AACResolved {
  const symbolMap = buildSymbolMap(symbols);
  const phraseTokens = tokenise(phraseContext);
  const { blocked, replacement } = resolveOverrides(phraseTokens, overrides);

  const normalised = normaliseToken(word);

  // 1. Exact match
  let match = symbolMap.get(normalised);

  // 2. Controlled lemma fallback
  if (!match) {
    const lemma = LEMMA_MAP[normalised];
    if (lemma) {
      match = symbolMap.get(lemma);
    }
  }

  // 3. Context guard — block wrong-domain matches, try preferred replacement
  if (match && blocked.has(match.word.toLowerCase())) {
    const preferred = replacement.get(match.word.toLowerCase());
    match = preferred ? symbolMap.get(preferred) : undefined;
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
 * 4. Only include tokens that resolved to aac pictogram
 */
export function resolveAACPhrase(
  phrase: string,
  symbols: AltSymbol[],
  overrides: ContextOverride[],
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
      const lemma = LEMMA_MAP[token];
      if (lemma) {
        match = symbolMap.get(lemma);
      }
    }

    // 3. Context guard — block wrong-domain, try preferred replacement
    if (match && blocked.has(match.word.toLowerCase())) {
      const preferred = replacement.get(match.word.toLowerCase());
      match = preferred ? symbolMap.get(preferred) : undefined;
    }

    // 4. Only include matched symbols — drop unresolved words
    if (match) {
      const resolved = resolveMatch(match, token);
      if (resolved.type !== 'text') {
        results.push(resolved);
      }
    }
  }

  return results;
}
