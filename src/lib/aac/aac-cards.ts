/**
 * aac-cards.ts — Shared AAC card renderers (DEPRECATED)
 *
 * @deprecated Use AacCard molecule component instead of raw HTML strings.
 * This file generates HTML strings injected via set:html — the anti-pattern
 * being replaced by proper AacCard component rendering.
 *
 * Still consumed by:
 *   - aac-inline.ts (attributions page sentence -> cards)
 *   - load-alt-text.ts (legacy aacHtml output — migrate consumers to cards[])
 *
 * Two card types: pictogram (ARASAAC PNG) and text-only.
 * Each card carries data-core-tier for CSS vocabulary-level filtering.
 */

import type { CoreTier } from './aacResolver';

export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function tierAttr(tier: CoreTier): string {
  return tier ? ` data-core-tier="${tier}"` : ' data-core-tier="fringe"';
}

export function pictogramCard(word: string, src: string, coreTier: CoreTier = null): string {
  const clean = word.replace(/[.,!?;:]+$/, '');
  return `<span class="aac-card"${tierAttr(coreTier)}><img class="aac-card__pictogram" src="${escHtml(src)}" alt="${escHtml(clean)}" width="32" height="32" loading="lazy" /><span class="aac-card__word">${escHtml(word)}</span></span>`;
}

export function textOnlyCard(word: string, coreTier: CoreTier = null): string {
  return `<span class="aac-card aac-card--text-only"${tierAttr(coreTier)}><span class="aac-card__word">${escHtml(word)}</span></span>`;
}
