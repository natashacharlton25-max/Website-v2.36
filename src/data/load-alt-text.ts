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
import { resolveAACPhrase } from '../lib/aac/aacResolver';
import type { AltSymbol, ContextOverride, AACResolved, CoreTier } from '../lib/aac/aacResolver';
import { pictogramCard, textOnlyCard } from '../lib/aac/aac-cards';

// ── Types ──

export interface AltData {
  word: string | null;
  descriptive: string | null;
  aacHtml: string;
}

interface AltTextRow {
  name: string;
  descriptive: string | null;
  aacPhrase: string | null;
  word: string | null;
  aacUrl: string | null;
}

// ── Prepare resolver inputs (once per build) ──

const symbols: AltSymbol[] = (symbolData as any[]).map((r) => ({
  word: r.word,
  aac_url: r.aac_url,
  icon_id: r.icon_id,
  verified: Boolean(r.verified),
  core_tier: (r.core_tier as CoreTier) ?? null,
}));

const overrides: ContextOverride[] = overrideData as ContextOverride[];

// ── Render resolved cards to HTML ──

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

    if (asset.aacPhrase) {
      // Multi-word AAC phrase → resolve through pipeline → multi-card HTML
      const resolved = resolveAACPhrase(asset.aacPhrase, symbols, overrides);
      aacHtml = resolved.length > 0
        ? renderCards(resolved)
        : textOnlyCard(asset.word || asset.name);
    } else if (asset.aacUrl && asset.word) {
      // Single symbol with ARASAAC pictogram → single card
      aacHtml = pictogramCard(asset.word, asset.aacUrl);
    } else {
      // No AAC data → text-only fallback
      aacHtml = textOnlyCard(asset.word || asset.name);
    }

    cache.set(asset.name, {
      word: asset.word,
      descriptive: asset.descriptive,
      aacHtml,
    });
  }

  return cache;
}
