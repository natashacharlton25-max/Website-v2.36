/**
 * Message-Only Loader — text caption with no spinner
 *
 * For brands that prefer a quiet, calm reload experience without any
 * spinning visuals. The message is the entire focal point. Useful when:
 *
 *   - A brand has trauma-recovery / calm content goals
 *   - Spinners feel too "techy" for the brand voice
 *   - The message itself is the value (a quote, a tagline, an advert)
 *
 * No animation = no motion-mode concerns at all. Always respectful of
 * reduced-motion users by design.
 */

import type { ReloadLoader } from './types';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]!));
}

export const messageOnlyLoader: ReloadLoader = {
  render(message: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'reload-overlay__loader-wrap reload-overlay__loader-wrap--message-only';
    wrap.innerHTML = `
      <div class="reload-overlay__caption reload-overlay__caption--large" role="status" aria-live="polite">
        ${escapeHtml(message)}
      </div>
    `;
    return wrap;
  },
};
