/**
 * aac-inline.ts — Build-time AAC card renderer
 *
 * Two-tier word lookup (build-time only, never hits users):
 *   1. Our alt_symbols API   — curated ARASAAC mappings (fast)
 *   2. Open Symbols API      — broader English word coverage (fallback)
 *
 * Two card types for rendering:
 *   - aac_url (from either source) → pictogram card  (<img>)
 *   - no aac_url                   → text-only card
 *
 * All lookups cached per build — repeated words only fetch once.
 * Open Symbols calls rate-limited with 100ms delay.
 *
 * Usage (Astro frontmatter):
 *   import { aacInline } from '../../lib/aac/aac-inline';
 *   const html = await aacInline('You can use this free', apiBaseUrl);
 */

import { pictogramCard, textOnlyCard } from './aac-cards';

const ASSET_API_URL =
  import.meta.env.ASSET_API_URL || 'http://localhost:8787';

const OPENSYMBOLS_BASE = 'https://www.opensymbols.org/api/v2';
const OPENSYMBOLS_SECRET = import.meta.env.OPENSYMBOLS_SECRET || '';

// ── Types ──

type CoreTier = 'green' | 'yellow' | 'orange' | null;

type AacLookup =
  | { type: 'aac'; src: string; coreTier: CoreTier; bciIndex: number | null }
  | { type: 'text'; coreTier: CoreTier; bciIndex: number | null };

// ── Build-wide cache (persists across all aacInline calls in one build) ──

const cache = new Map<string, AacLookup>();

// ── Open Symbols token management ──

let openSymbolsToken: string | null = null;

async function getOpenSymbolsToken(): Promise<string | null> {
  if (openSymbolsToken) return openSymbolsToken;
  if (!OPENSYMBOLS_SECRET) return null;

  try {
    const res = await fetch(
      `${OPENSYMBOLS_BASE}/token?secret=${encodeURIComponent(OPENSYMBOLS_SECRET)}`,
      { method: 'POST' },
    );
    if (res.ok) {
      const data = (await res.json()) as { access_token?: string };
      openSymbolsToken = data.access_token || null;
      return openSymbolsToken;
    }
  } catch {
    // Token fetch failed
  }
  return null;
}

async function refreshToken(): Promise<string | null> {
  openSymbolsToken = null;
  return getOpenSymbolsToken();
}

// ── Rate limiter for Open Symbols ──

let lastOpenSymbolsCall = 0;

async function rateLimitOpenSymbols(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastOpenSymbolsCall;
  if (elapsed < 100) {
    await new Promise((r) => setTimeout(r, 100 - elapsed));
  }
  lastOpenSymbolsCall = Date.now();
}

// ── Open Symbols lookup with 401 retry ──

async function lookupOpenSymbols(
  word: string,
  retried = false,
): Promise<string | null> {
  const token = await getOpenSymbolsToken();
  if (!token) return null;

  await rateLimitOpenSymbols();

  try {
    const res = await fetch(
      `${OPENSYMBOLS_BASE}/symbols?q=${encodeURIComponent(word)}&locale=en&access_token=${encodeURIComponent(token)}`,
    );

    if (res.status === 401 && !retried) {
      await refreshToken();
      return lookupOpenSymbols(word, true);
    }

    if (res.ok) {
      const data = (await res.json()) as {
        repo_key?: string;
        image_url?: string;
      }[];

      if (Array.isArray(data)) {
        const arasaac = data.find(
          (s) => s.repo_key === 'arasaac' && s.image_url,
        );
        if (arasaac?.image_url) {
          // Encode spaces in URLs (some ARASAAC filenames contain spaces)
          return arasaac.image_url.replace(/ /g, '%20');
        }
      }
    }
  } catch {
    // Open Symbols unreachable
  }

  return null;
}

// ── Per-word lookup ──

async function lookupWord(
  word: string,
  apiBase: string,
): Promise<AacLookup> {
  const key = word.toLowerCase();
  if (cache.has(key)) return cache.get(key)!;

  // ── Tier 1: Our alt_symbols API (curated, fast) ──
  // Even if no aac_url, capture bci_index and core_tier for fallback
  let apiBci: number | null = null;
  let apiTier: CoreTier = null;

  try {
    const res = await fetch(
      `${apiBase}/v1/alt-symbols?word_exact=${encodeURIComponent(key)}`,
    );

    if (res.ok) {
      const data = (await res.json()) as {
        symbols?: { aac_url?: string | null; core_tier?: string | null; bci_index?: number | null }[];
      };
      const rows = data.symbols || [];

      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0];
        apiTier = (row.core_tier as CoreTier) || null;
        apiBci = row.bci_index || null;

        if (row.aac_url && row.aac_url !== 'null') {
          const result: AacLookup = { type: 'aac', src: row.aac_url, coreTier: apiTier, bciIndex: apiBci };
          cache.set(key, result);
          return result;
        }
      }
    }
  } catch {
    // Our API unreachable — continue to Open Symbols fallback
  }

  // ── Tier 2: Open Symbols fallback (broader English coverage, ARASAAC only) ──
  // Carry forward bci_index from our API so symbol set switching works
  const imageUrl = await lookupOpenSymbols(key);
  if (imageUrl) {
    const result: AacLookup = { type: 'aac', src: imageUrl, coreTier: apiTier, bciIndex: apiBci };
    cache.set(key, result);
    return result;
  }

  // ── No pictogram found — text only ──
  const result: AacLookup = { type: 'text', coreTier: apiTier, bciIndex: apiBci };
  cache.set(key, result);
  return result;
}

// Card renderers imported from ./aac-cards

// ── Public API ──

/**
 * Convert a plain-text sentence into a row of AAC cards (HTML string).
 *
 * @param sentence  Plain text, e.g. "You can use this free"
 * @param apiBase   Optional override for the Asset Library API base URL
 * @returns         HTML string of `.aac-card` spans
 */
export async function aacInline(
  sentence: string,
  apiBase: string = ASSET_API_URL,
): Promise<string> {
  const words = sentence.split(/\s+/).filter((w) => w.length > 0);

  // Process sequentially to respect Open Symbols rate limit
  const cards: string[] = [];
  for (const word of words) {
    const clean = word.replace(/[.,!?;:]+$/, '');
    const lookup = await lookupWord(clean, apiBase);

    switch (lookup.type) {
      case 'aac':
        cards.push(pictogramCard(word, lookup.src, lookup.coreTier, lookup.bciIndex));
        break;
      case 'text':
        cards.push(textOnlyCard(word, lookup.coreTier, lookup.bciIndex));
        break;
    }
  }

  return cards.join('\n');
}
