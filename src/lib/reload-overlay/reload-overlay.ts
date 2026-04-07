/**
 * Reload Overlay
 *
 * Watches the four "fundamental view" data attributes on <html>:
 *   - data-motion (full | gentle | none)       — animation speed
 *   - data-hover  (full | gentle | instant | none) — hover behaviour
 *   - data-render (full | reduced | assistive | textonly) — render mode
 *   - data-mode   (light | dark)               — luminance
 *
 * When any of these change, the page is reloaded with a fullscreen overlay
 * covering the transition. This avoids the "default-then-target" jerk that
 * happens when CSS swaps live but JS animation state lags behind.
 *
 * The overlay is a gooey gradient spiral loader (Uiverse / fanishah) using
 * the same SVG goo filter technique as our morph system — visual continuity
 * with the rest of the design system.
 *
 * Excluded from the watch:
 *   - data-highlight-links, data-focus-rainbow, data-enhanced-focus etc.
 *     (cosmetic-only, can update live without reload)
 *
 * Reload safety:
 *   - Saves scroll position before reload, restores after
 *   - Suppresses re-trigger during the reload window itself
 */

const RELOAD_TRIGGERS = ['data-motion', 'data-hover', 'data-render', 'data-mode'] as const;
const SCROLL_KEY = 'reload-overlay-scroll';
const RELOADING_KEY = 'reload-overlay-active';

let reloading = false;

/**
 * Build the overlay element with the Uiverse goo spiral loader.
 * Returns the overlay so callers can append it manually if they want.
 */
function buildOverlay(): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'reload-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  // Inline the SVG so it works without any additional asset loading
  overlay.innerHTML = `
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
  `;
  return overlay;
}

/**
 * Show the overlay, save scroll, then reload after a brief fade-in.
 * Idempotent — repeated calls during the reload window are no-ops.
 */
export function reloadWithOverlay() {
  if (reloading) return;
  reloading = true;

  // Save scroll position so we can restore after the reload
  try {
    const scroller = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement | null;
    const y = scroller ? scroller.scrollTop : window.scrollY;
    sessionStorage.setItem(SCROLL_KEY, String(y));
    sessionStorage.setItem(RELOADING_KEY, '1');
  } catch { /* sessionStorage may be blocked */ }

  // Build + insert overlay (or reuse existing if a previous attempt mounted one)
  let overlay = document.querySelector('.reload-overlay') as HTMLElement | null;
  if (!overlay) {
    overlay = buildOverlay();
    document.body.appendChild(overlay);
  }

  // Force reflow then add visible class so CSS transition runs
  void overlay.offsetWidth;
  overlay.classList.add('reload-overlay--visible');

  // Wait for fade-in to complete before reloading. Long enough for the
  // overlay to fully cover the page (no flash of pre-reload state).
  setTimeout(() => {
    window.location.reload();
  }, 350);
}

/**
 * Restore scroll position after a reload, if one was saved.
 * Called once on init.
 */
function restoreScroll() {
  try {
    if (sessionStorage.getItem(RELOADING_KEY) !== '1') return;
    const y = parseInt(sessionStorage.getItem(SCROLL_KEY) || '0', 10);
    sessionStorage.removeItem(RELOADING_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    if (y > 0) {
      // Wait one frame for OverlayScrollbars to mount, then restore
      requestAnimationFrame(() => {
        const scroller = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement | null;
        if (scroller) {
          scroller.scrollTop = y;
        } else {
          window.scrollTo(0, y);
        }
      });
    }
  } catch { /* ignore */ }
}

function initReloadOverlay() {
  if (typeof document === 'undefined') return;

  restoreScroll();

  // NOTE: MutationObserver auto-reload on data-motion/hover/render/mode is
  // DISABLED — caused a reload loop because other JS in the project (focus
  // system, theme switcher, animation cleanup) sometimes touches these
  // attributes during normal operation, retriggering the reload.
  //
  // Instead, the Your View Panel / accessibility page / theme switcher
  // should call `reloadWithOverlay()` directly when the user explicitly
  // changes a setting that needs a reload. That way the reload only fires
  // on actual user intent, not on incidental attribute writes.
  //
  // Window event listener as a fallback for code that fires custom events:
  window.addEventListener('viewSettingChanged', () => reloadWithOverlay());
}

// Expose globally so any panel/page can call it without an import
if (typeof window !== 'undefined') {
  (window as any).reloadWithOverlay = reloadWithOverlay;
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReloadOverlay);
  } else {
    initReloadOverlay();
  }
  document.addEventListener('astro:page-load', initReloadOverlay);
}
