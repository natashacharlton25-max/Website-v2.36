/**
 * Reload Overlay
 *
 * Fullscreen overlay that covers the page during reloads triggered by
 * fundamental view setting changes. Eliminates the "default-then-target"
 * jerk that happens when CSS swaps live but JS state lags behind.
 *
 * ARCHITECTURE
 * ────────────
 * The overlay is composed of two pluggable parts:
 *
 *   1. The MECHANISM (this file)
 *      - Owns the overlay container, fade-in timing, scroll save/restore,
 *        the actual reload trigger, and the message picker.
 *
 *   2. The LOADER (loaders/ folder)
 *      - Renders the visible content (spinner, image, message-only, etc.)
 *      - Implements the ReloadLoader interface — just `render(message)`.
 *      - Default is the goo-spiral loader. Brands can pick a different
 *        built-in by name or supply their own ReloadLoader object.
 *
 * BRAND CONFIG
 * ────────────
 * Brands customise the overlay by setting fields on BRAND_CONFIG.reloadOverlay
 * (in src/lib/config/brand.ts) OR by setting global hooks before this module
 * loads. The supported settings:
 *
 *   loader: 'goo-spiral' | 'message-only' | ReloadLoader
 *     - String: pick a built-in loader by name
 *     - Object: brand-supplied loader (must satisfy ReloadLoader interface)
 *     - Omitted: defaults to goo-spiral
 *
 *   loaderText: false | 'default' | 'custom'
 *     - false: no messages — loader receives empty string
 *     - 'default' (or omitted): use this lib's built-in message pools
 *     - 'custom': use brand's own message pools (BRAND_CONFIG.reloadOverlay.messages)
 *
 *   messages: { [reason]: string[] }
 *     - Per-reason message pools (only used when loaderText: 'custom')
 *     - Missing reasons fall back to the 'default' key
 *
 * CALLER CONTRACT
 * ───────────────
 * The reload overlay is OPT-IN — it never auto-fires (an earlier MutationObserver
 * approach caused a reload loop because other JS touches the watched attributes).
 * Callers explicitly trigger it from settings save handlers:
 *
 *   import { reloadWithOverlay } from '/src/lib/reload-overlay/reload-overlay';
 *   reloadWithOverlay('motion');  // user changed motion mode
 *
 * Or via window event (for inline scripts that can't import):
 *   window.dispatchEvent(new CustomEvent('viewSettingChanged', {
 *     detail: { reason: 'motion' }
 *   }));
 */

import { BUILTIN_LOADERS, DEFAULT_LOADER, type ReloadLoader } from './loaders';
import type { ReloadLoader as _ReloadLoader } from './loaders/types';

// Re-export so callers can import without diving into loaders/
export type { ReloadLoader } from './loaders/types';
export { gooSpiralLoader, messageOnlyLoader, BUILTIN_LOADERS } from './loaders';

const SCROLL_KEY = 'reload-overlay-scroll';
const RELOADING_KEY = 'reload-overlay-active';
const REASON_KEY = 'reload-overlay-reason';

let reloading = false;

// ──────────────────────────────────────────────────────
// Reasons + message system
// ──────────────────────────────────────────────────────

/**
 * Reasons the reload overlay can be triggered with. Each maps to a small
 * pool of friendly messages — one is picked at random per reload so it
 * feels alive instead of a robotic "Loading...".
 */
export type ReloadReason =
  | 'default'
  | 'motion'      // user changed motion mode (animation speed)
  | 'hover'       // user changed hover behaviour
  | 'render'      // user changed render mode (calm/easy click/reading)
  | 'mode'        // user changed light/dark
  | 'palette'     // user changed colour palette / CVD mode
  | 'vibe'        // user changed vibe / intensity
  | 'theme';      // user changed theme

export interface ReloadOverlayMessages {
  [key: string]: string[];
}

export type LoaderTextMode = false | 'default' | 'custom';

export interface ReloadOverlayConfig {
  /** Loader: built-in name OR full ReloadLoader object */
  loader?: keyof typeof BUILTIN_LOADERS | ReloadLoader;
  /** Message mode: false (no text), 'default' (built-ins), or 'custom' (brand pools) */
  loaderText?: LoaderTextMode;
  /** Brand's own message pools — only used when loaderText: 'custom' */
  messages?: ReloadOverlayMessages;
}

/**
 * Built-in default messages. Warm, plain English, AAC-friendly.
 * One is picked at random per reload.
 */
const DEFAULT_MESSAGES: ReloadOverlayMessages = {
  default: [
    'Updating your view',
    'Just a moment',
    'Refreshing things for you',
    'Almost there',
  ],
  motion: [
    'Slowing things down for you',
    'Adjusting the pace',
    'Making movement gentler',
    'Calming the motion',
  ],
  hover: [
    'Updating how things respond to you',
    'Adjusting hover behaviour',
    'Quieting hover effects',
  ],
  render: [
    'Switching how things look',
    'Adjusting your view',
    'Loading the right layout for you',
  ],
  mode: [
    'Changing the lights',
    'Adjusting brightness',
    'Switching mode',
  ],
  palette: [
    'Adjusting colours for you',
    'Loading your palette',
  ],
  vibe: [
    'Setting the vibe',
    'Adjusting the feel',
  ],
  theme: [
    'Loading your theme',
    'Dressing things up',
    'Switching style',
  ],
};

// ──────────────────────────────────────────────────────
// Brand config resolution
// ──────────────────────────────────────────────────────

/**
 * Read brand config — checks globalThis hook first (so brand modules can
 * inject without hard-importing this file), then falls back to undefined.
 *
 * The Your View Panel / brand bootstrap should set this BEFORE first reload:
 *
 *   import { BRAND_CONFIG } from '/src/lib/config/brand';
 *   (globalThis as any).__RELOAD_OVERLAY_CONFIG__ = BRAND_CONFIG.reloadOverlay;
 */
function getBrandConfig(): ReloadOverlayConfig {
  return (globalThis as any).__RELOAD_OVERLAY_CONFIG__ || {};
}

/**
 * Resolve which loader to use:
 *   1. Brand config object form: pass straight through
 *   2. Brand config string form: look up in BUILTIN_LOADERS
 *   3. Nothing set: DEFAULT_LOADER
 */
function resolveLoader(): ReloadLoader {
  const cfg = getBrandConfig();
  const loader = cfg.loader;
  if (!loader) return DEFAULT_LOADER;
  if (typeof loader === 'string') {
    return BUILTIN_LOADERS[loader] || DEFAULT_LOADER;
  }
  return loader;
}

/**
 * Pick a message based on the brand's loaderText mode:
 *   - false       → empty string (loader gets nothing to show)
 *   - 'default'   → built-in message pools
 *   - 'custom'    → brand's own message pools (with fallback to built-ins)
 *   - undefined   → 'default'
 */
function pickMessage(reason: ReloadReason): string {
  const cfg = getBrandConfig();
  const mode: LoaderTextMode = cfg.loaderText ?? 'default';

  if (mode === false) return '';

  // Build the pool ladder based on mode
  let pools: (string[] | undefined)[] = [];
  if (mode === 'custom') {
    pools = [
      cfg.messages?.[reason],
      cfg.messages?.default,
      DEFAULT_MESSAGES[reason],
      DEFAULT_MESSAGES.default,
    ];
  } else {
    // 'default' mode — built-ins only
    pools = [
      DEFAULT_MESSAGES[reason],
      DEFAULT_MESSAGES.default,
    ];
  }

  const pool = pools.find((p): p is string[] => Array.isArray(p) && p.length > 0)
    || ['Updating your view'];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ──────────────────────────────────────────────────────
// Main entry point
// ──────────────────────────────────────────────────────

/**
 * Show the overlay, save scroll, then reload after a brief fade-in.
 * Idempotent — repeated calls during the reload window are no-ops.
 *
 * Pass a reason to get a context-appropriate message:
 *   reloadWithOverlay('motion')   // "Slowing things down for you"
 *   reloadWithOverlay('mode')     // "Changing the lights"
 *   reloadWithOverlay()           // generic "Updating your view"
 */
export function reloadWithOverlay(reason: ReloadReason = 'default') {
  if (reloading) return;
  reloading = true;

  // Pick a message NOW so the user sees the contextual text immediately
  const message = pickMessage(reason);
  const loader = resolveLoader();

  // Save scroll position + reason so we can restore after reload
  try {
    const scroller = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement | null;
    const y = scroller ? scroller.scrollTop : window.scrollY;
    sessionStorage.setItem(SCROLL_KEY, String(y));
    sessionStorage.setItem(RELOADING_KEY, '1');
    sessionStorage.setItem(REASON_KEY, reason);
  } catch { /* sessionStorage may be blocked */ }

  // Build (or reuse) the overlay container
  let overlay = document.querySelector('.reload-overlay') as HTMLElement | null;
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'reload-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }
  // Always re-render the loader content (handles message + loader swap)
  overlay.innerHTML = '';
  overlay.appendChild(loader.render(message));

  // Force reflow then add visible class so CSS transition runs
  void overlay.offsetWidth;
  overlay.classList.add('reload-overlay--visible');

  // Wait for fade-in to complete before reloading
  setTimeout(() => {
    window.location.reload();
  }, 350);
}

// ──────────────────────────────────────────────────────
// Init + scroll restore
// ──────────────────────────────────────────────────────

function restoreScroll() {
  try {
    if (sessionStorage.getItem(RELOADING_KEY) !== '1') return;
    const y = parseInt(sessionStorage.getItem(SCROLL_KEY) || '0', 10);
    sessionStorage.removeItem(RELOADING_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    sessionStorage.removeItem(REASON_KEY);
    if (y > 0) {
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

  // Window event for code that can't import this module
  window.addEventListener('viewSettingChanged', (e: Event) => {
    const detail = (e as CustomEvent).detail;
    const reason = (detail?.reason as ReloadReason) || 'default';
    reloadWithOverlay(reason);
  });
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
