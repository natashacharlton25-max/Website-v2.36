/**
 * load-alt-text.ts — Build-time alt text loader
 *
 * Reads the three JSON snapshots produced by snapshot-alt-text.js.
 * Resolves AAC phrases into pictogram card HTML using the pure resolver.
 * Returns a Map<string, AltData> keyed by asset name.
 *
 * No HTTP calls — all data comes from local JSON files.
 * Cached per build — safe to call from multiple pages.
 *
 * Usage (Astro frontmatter):
 *   import { loadAllAltText } from '../data/load-alt-text';
 *   const altText = loadAllAltText();
 *   const heroAlt = altText.get('articles-hero');
 */

import altTextData from './alt-text.json';
import symbolData from './alt-symbols.json';
import overrideData from './context-overrides.json';
import { resolveAACPhrase, lemmatise } from '../lib/aac/aacResolver';
import type { AltSymbol, ContextOverride, AACResolved, CoreTier } from '../lib/aac/aacResolver';
import { pictogramCard, textOnlyCard } from '../lib/aac/aac-cards';
import { detectBlissIndicators } from '../lib/aac/blissGrammar';

// ── Types ──

/** Card data for AacCard molecule rendering (no HTML) */
export interface AacCardData {
  word: string;
  /** BCI reference number (W3C AAC Symbol Registry) */
  bciIndex: number | null;
  symbolSrc: string | null;
  /** @deprecated Use bciIndex instead */
  symbolId: number | null;
  coreTier: CoreTier;
  /** True for Bliss grammar indicator cards (tense, plural, etc.) */
  isIndicator?: boolean;
}

export interface AltData {
  word: string | null;
  descriptive: string | null;
  aacHtml: string;
  /** Resolved card data — use with AacCard molecule instead of aacHtml */
  cards: AacCardData[];
}

interface AltTextRow {
  name: string;
  descriptive: string | null;
  aacPhrase: string | null;
  word: string | null;
  aacUrl: string | null;
  symbolId: number | null;
}

// ── Prepare resolver inputs (once per build) ──

const symbols: AltSymbol[] = (symbolData as any[]).map((r) => ({
  word: r.word,
  aac_url: r.aac_url,
  icon_id: r.icon_id,
  verified: Boolean(r.verified),
  core_tier: (r.core_tier as CoreTier) ?? null,
  bci_index: r.bci_index ?? null,
  bci_pos: r.bci_pos ?? null,
}));

const overrides: ContextOverride[] = overrideData as ContextOverride[];

// ── BCI lookup map (word → bci_index + pos) for indicator detection ──

type BciLookup = { bci_index: number; pos: string };
const bciByWord = new Map<string, BciLookup>();
for (const sym of symbols) {
  if (sym.bci_index && sym.bci_pos) {
    bciByWord.set(sym.word.toLowerCase(), {
      bci_index: sym.bci_index,
      pos: sym.bci_pos,
    });
  }
}

// ── Convert resolved cards to data objects ──
// Includes Bliss grammar indicator cards when POS data is available.
// Indicators are emitted as separate AacCard entries after each content card.

function toCardData(resolved: AACResolved[]): AacCardData[] {
  const cards: AacCardData[] = [];
  const words = resolved.map((c) => c.word);

  for (let i = 0; i < resolved.length; i++) {
    const card = resolved[i];
    const baseForm = lemmatise(card.word);
    const bci = bciByWord.get(baseForm) ?? bciByWord.get(card.word.toLowerCase());

    // Content card
    cards.push({
      word: card.word,
      bciIndex: bci?.bci_index ?? null,
      symbolSrc: card.type === 'aac' ? card.src : null,
      symbolId: bci?.bci_index ?? null,
      coreTier: card.coreTier,
      isIndicator: false,
    });

    // Bliss grammar indicators (emitted as additional cards after the content card)
    if (bci?.pos) {
      const indicators = detectBlissIndicators(
        card.word,
        baseForm,
        bci.pos,
        { prevWord: words[i - 1], nextWord: words[i + 1] },
      );
      for (const ind of indicators) {
        cards.push({
          word: ind.type,
          bciIndex: ind.bci,
          symbolSrc: ind.url,
          symbolId: ind.bci,
          coreTier: null,
          isIndicator: true,
        });
      }
    }
  }

  return cards;
}

// ── Render resolved cards to HTML (legacy — use cards[] for AacCard molecule) ──

function renderCards(resolved: AACResolved[]): string {
  return resolved
    .map((card) => {
      if (card.type === 'aac') return pictogramCard(card.word, card.src, card.coreTier);
      return textOnlyCard(card.word, card.coreTier);
    })
    .join('\n');
}

// ── Cached loader ──

let cache: Map<string, AltData> | null = null;

export function loadAllAltText(): Map<string, AltData> {
  if (cache) return cache;

  cache = new Map();

  for (const asset of altTextData as AltTextRow[]) {
    let aacHtml: string;
    let cards: AacCardData[];

    if (asset.aacPhrase) {
      // Multi-word AAC phrase → resolve through pipeline → multi-card sequence
      const resolved = resolveAACPhrase(asset.aacPhrase, symbols, overrides);
      if (resolved.length > 0) {
        aacHtml = renderCards(resolved);
        cards = toCardData(resolved);
      } else {
        const fallbackWord = asset.word || asset.name;
        aacHtml = textOnlyCard(fallbackWord);
        cards = [{ word: fallbackWord, bciIndex: null, symbolSrc: null, symbolId: null, coreTier: null }];
      }
    } else if (asset.aacUrl && asset.word) {
      // Single symbol with pictogram → single card
      aacHtml = pictogramCard(asset.word, asset.aacUrl);
      cards = [{ word: asset.word, bciIndex: asset.symbolId ?? null, symbolSrc: asset.aacUrl, symbolId: asset.symbolId ?? null, coreTier: null }];
    } else {
      // No AAC data → text-only fallback
      const fallbackWord = asset.word || asset.name;
      aacHtml = textOnlyCard(fallbackWord);
      cards = [{ word: fallbackWord, bciIndex: null, symbolSrc: null, symbolId: null, coreTier: null }];
    }

    cache.set(asset.name, {
      word: asset.word,
      descriptive: asset.descriptive,
      aacHtml,
      cards,
    });
  }

  return cache;
}
