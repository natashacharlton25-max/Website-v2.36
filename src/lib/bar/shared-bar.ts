/**
 * Shared tooltip-bar — single bottom-of-page status strip used by:
 *   - Tooltip atom (mobile/textonly tooltip fallback)
 *   - FigCaption (alt-text tooltip on figures)
 *   - AnimExplainer (subtitle mode for animation cards)
 *
 * One DOM node, one state machine, one timeout. Previously each
 * consumer duplicated this implementation; now they import from here.
 *
 * Inline styles are deliberate — keeps the bar self-contained and avoids
 * relying on a CSS file being loaded before the script runs. Token
 * fallbacks (#f5f5f5, #333, #666) handle the case where tokens haven't
 * resolved yet (page-load race).
 */

let sharedBar: HTMLElement | null = null;
let barHideTimeout: ReturnType<typeof setTimeout> | null = null;

/**
 * Get the bar element — reuses an existing `.tooltip-bar` in the DOM if
 * present, otherwise creates and appends a new one.
 */
export function getSharedBar(): HTMLElement {
  const existing = document.querySelector('.tooltip-bar') as HTMLElement;
  if (existing) { sharedBar = existing; return existing; }

  if (sharedBar) return sharedBar;
  const bar = document.createElement('div');
  bar.className = 'tooltip-bar';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  bar.style.cssText = `
    position: fixed; bottom: 0; left: 0; right: 0;
    z-index: var(--z-tooltip, 9000);
    text-align: center; white-space: normal;
    padding: var(--space-lg, 16px) var(--space-2xl, 32px);
    background: var(--bar-bg, #f5f5f5);
    color: var(--bar-text, #333);
    border-top: 4px solid var(--bar-border-color, #666);
    font-weight: 500;
    opacity: 0; visibility: hidden;
    transition: opacity var(--hover-duration, 0.2s) ease, visibility var(--hover-duration, 0.2s) ease;
  `;
  document.body.appendChild(bar);
  sharedBar = bar;
  return bar;
}

export interface ShowBarOptions {
  /** Show with a close button; bar stays until clicked/hideBar(true).
   *  Default: auto-hides via hideBar(). */
  permanent?: boolean;
  /** Render with flex/wrap/centred layout for AAC pictogram cards.
   *  Default: standard text-content layout. */
  aac?: boolean;
}

/**
 * Show the bar with HTML content.
 * - permanent=true: includes a close button, stays until hideBar(true).
 * - aac=true: switches to flex/wrap/centred layout for pictogram cards.
 * Both modes default off.
 */
export function showBar(html: string, options: ShowBarOptions = {}): void {
  const { permanent = false, aac = false } = options;
  const bar = getSharedBar();
  if (barHideTimeout) { clearTimeout(barHideTimeout); barHideTimeout = null; }

  if (permanent) {
    bar.innerHTML = `<span>${html}</span><button class="tooltip-bar__close" aria-label="Close" style="
      position: absolute; right: var(--space-lg, 16px); top: 50%; transform: translateY(-50%);
      background: var(--page-bg, #fff); border: 2px solid var(--bar-border-color, #666);
      cursor: pointer; font-size: 1em; font-weight: bold;
      color: var(--bar-text, #333); padding: var(--space-xs, 4px) var(--space-sm, 8px);
      border-radius: var(--radius-sm, 4px); line-height: 1;
    ">&times;</button>`;
    bar.style.position = 'fixed';
    const closeBtn = bar.querySelector('.tooltip-bar__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => hideBar(true));
    }
  } else {
    bar.innerHTML = html;
  }

  // AAC mode renders pictogram cards as a flex-wrapped row instead of
  // standard text. Reset display when not in AAC so the bar can switch
  // between modes between tooltips.
  if (aac) {
    bar.style.display = 'flex';
    bar.style.flexWrap = 'wrap';
    bar.style.justifyContent = 'center';
    bar.style.gap = '8px';
  } else {
    bar.style.display = '';
  }

  bar.style.visibility = 'visible';
  requestAnimationFrame(() => {
    bar.style.opacity = '1';
  });
}

/**
 * Hide the bar.
 * - immediate=false (default): fades out after a 2s delay.
 * - immediate=true: hides instantly.
 */
export function hideBar(immediate = false): void {
  if (barHideTimeout) clearTimeout(barHideTimeout);
  if (immediate) {
    const bar = getSharedBar();
    bar.style.opacity = '0';
    bar.style.visibility = 'hidden';
    return;
  }
  barHideTimeout = setTimeout(() => {
    const bar = getSharedBar();
    bar.style.opacity = '0';
    bar.style.visibility = 'hidden';
    barHideTimeout = null;
  }, 2000);
}

/**
 * Hide the bar instantly on scroll. Useful for FigCaption/AnimExplainer
 * which call this from their own scroll listeners. Returns early if the
 * bar isn't currently visible.
 */
export function hideBarOnScroll(): void {
  if (sharedBar && sharedBar.style.opacity === '1') {
    if (barHideTimeout) clearTimeout(barHideTimeout);
    sharedBar.style.opacity = '0';
    sharedBar.style.visibility = 'hidden';
  }
}
