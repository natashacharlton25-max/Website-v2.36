/**
 * Goo Spiral Loader — the default reload overlay loader
 *
 * Uiverse / fanishah (MIT). A spinning gradient arc rendered through an
 * SVG goo filter (feGaussianBlur + feColorMatrix threshold) — same
 * technique as our shape morph system, so it feels visually consistent
 * with the rest of the design language.
 *
 * Brand-aware: gradient stops read from --primary-base / --secondary-base
 * tokens via the CSS in reload-overlay.css.
 */

import type { ReloadLoader } from './types';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]!));
}

export const gooSpiralLoader: ReloadLoader = {
  render(message: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'reload-overlay__loader-wrap reload-overlay__loader-wrap--goo-spiral';
    wrap.innerHTML = `
      <svg class="reload-overlay__filter" aria-hidden="true">
        <defs>
          <filter id="reload-overlay-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo"></feColorMatrix>
            <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
          </filter>
        </defs>
      </svg>
      <div class="reload-overlay__loader">
        <svg class="reload-overlay__spiral" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <linearGradient id="reload-overlay-grad-base">
              <stop class="reload-overlay__stop1" offset="0"></stop>
              <stop class="reload-overlay__stop2" offset="1"></stop>
            </linearGradient>
            <linearGradient y2="160" x2="160" y1="40" x1="40" gradientUnits="userSpaceOnUse" id="reload-overlay-grad" xlink:href="#reload-overlay-grad-base"></linearGradient>
          </defs>
          <path class="reload-overlay__half" d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64"></path>
          <circle class="reload-overlay__strecken" cx="100" cy="100" r="64"></circle>
        </svg>
        <svg class="reload-overlay__shadow" width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
          <path class="reload-overlay__half" d="m 164,100 c 0,-35.346224 -28.65378,-64 -64,-64 -35.346224,0 -64,28.653776 -64,64 0,35.34622 28.653776,64 64,64 35.34622,0 64,-26.21502 64,-64 0,-37.784981 -26.92058,-64 -64,-64 -37.079421,0 -65.267479,26.922736 -64,64 1.267479,37.07726 26.703171,65.05317 64,64 37.29683,-1.05317 64,-64 64,-64"></path>
          <circle class="reload-overlay__strecken" cx="100" cy="100" r="64"></circle>
        </svg>
      </div>
      <div class="reload-overlay__caption" role="status" aria-live="polite">${escapeHtml(message)}</div>
    `;
    return wrap;
  },
};
