/**
 * aac-cards.ts — Shared AAC card renderers
 *
 * Used by aac-inline.ts (sentence → cards) and fetch-alt.ts (asset → card).
 * Three card types: pictogram (ARASAAC PNG), icon (Phosphor SVG), text-only.
 */

export function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function pictogramCard(word: string, src: string): string {
  const clean = word.replace(/[.,!?;:]+$/, '');
  return `<span class="aac-card"><img class="aac-card__pictogram" src="${escHtml(src)}" alt="${escHtml(clean)}" width="32" height="32" loading="lazy" /><span class="aac-card__word">${escHtml(word)}</span></span>`;
}

export function iconCard(word: string, svg: string): string {
  const styledSvg = svg.replace(
    '<svg',
    '<svg class="aac-card__icon" aria-hidden="true" width="32" height="32"',
  );
  return `<span class="aac-card aac-card--icon">${styledSvg}<span class="aac-card__word">${escHtml(word)}</span></span>`;
}

export function textOnlyCard(word: string): string {
  return `<span class="aac-card aac-card--text-only"><span class="aac-card__word">${escHtml(word)}</span></span>`;
}
