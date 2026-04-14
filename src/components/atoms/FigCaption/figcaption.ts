/**
 * FigCaption — runtime caption system for images AND animation explainers
 *
 * Two content types, one display system:
 *   1. Image alt text: reads .image-alt-word / .image-alt-descriptive / .image-alt-aac
 *      Gated by data-alt-display-mode on <html>
 *   2. Animation explainer: reads [data-anim-seq] containers (AacCard sequences)
 *      Gated by data-anim-explainer on <html>
 *
 * Both use the same shared bar, hover gates, viewed state, and display behaviour.
 * Content is built at build time by Image atom / AnimExplainer molecule.
 */

let sharedBar: HTMLElement | null = null;
let barHideTimeout: ReturnType<typeof setTimeout> | null = null;

function getSharedBar(): HTMLElement {
  // Reuse Tooltip's bar if it exists
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
    background: var(--page-bg-raised, #f5f5f5);
    color: var(--neutral-800, #333);
    border-top: 4px solid var(--bar-border-color, var(--primary-600, #666));
    font-weight: 500;
    opacity: 0; visibility: hidden;
    transition: opacity var(--hover-duration, 0.2s) ease, visibility var(--hover-duration, 0.2s) ease;
  `;
  document.body.appendChild(bar);
  sharedBar = bar;
  return bar;
}

function isBarMode(): boolean {
  if (isSubtitleMode()) return true;
  const isMobile = window.innerWidth <= 640;
  return isMobile;
}

// ── Image alt text mode checks ───────────────────────────

function isTooltipMode(): boolean {
  const mode = document.documentElement.dataset.altDisplayMode;
  return mode === 'tooltip' || mode === 'subtitle' || mode === 'inline';
}

function isSubtitleMode(): boolean {
  const mode = document.documentElement.dataset.altDisplayMode;
  return mode === 'subtitle';
}

function isInlineMode(): boolean {
  const mode = document.documentElement.dataset.altDisplayMode;
  return mode === 'inline';
}

// ── Animation explainer mode checks ──────────────────────

function isAnimActive(): boolean {
  const mode = document.documentElement.dataset.animExplainer;
  return !!mode && mode !== 'off';
}

function isAnimTooltipMode(): boolean {
  const mode = document.documentElement.dataset.animExplainer;
  return mode === 'tooltip' || mode === 'subtitle' || mode === 'overlay' || mode === 'inline';
}

function isAnimSubtitleMode(): boolean {
  return document.documentElement.dataset.animExplainer === 'subtitle';
}

function isAnimBarMode(): boolean {
  if (isAnimSubtitleMode()) return true;
  const isMobile = window.innerWidth <= 640;
  return isMobile;
}

function isAnimOverlayMode(): boolean {
  return document.documentElement.dataset.animExplainer === 'overlay';
}

// ── Overlay modal for animation explainer ─────────────────

let animOverlay: HTMLElement | null = null;
let animOverlayPrevFocus: HTMLElement | null = null;

function getAnimOverlay(): HTMLElement {
  if (animOverlay) return animOverlay;
  const el = document.createElement('div');
  el.className = 'image-enlarge-modal anim-explainer-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Animation explainer');
  el.innerHTML = `
    <button class="image-enlarge-modal__close" aria-label="Close explainer">&times;</button>
    <div class="image-enlarge-modal__content anim-explainer-overlay__content"></div>
  `;
  document.body.appendChild(el);
  animOverlay = el;

  el.querySelector('.image-enlarge-modal__close')!.addEventListener('click', closeAnimOverlay);
  el.addEventListener('click', (e: MouseEvent) => { if (e.target === el) closeAnimOverlay(); });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && animOverlay?.dataset.open === 'true') closeAnimOverlay();
  });

  return el;
}

function showAnimOverlay(html: string): void {
  const m = getAnimOverlay();
  const content = m.querySelector('.anim-explainer-overlay__content') as HTMLElement;
  content.innerHTML = html;
  animOverlayPrevFocus = document.activeElement as HTMLElement;
  m.dataset.open = 'true';
  document.body.style.overflow = 'hidden';
  (m.querySelector('.image-enlarge-modal__close') as HTMLElement).focus();
}

function closeAnimOverlay(): void {
  if (!animOverlay) return;
  animOverlay.dataset.open = 'false';
  document.body.style.overflow = '';
  if (animOverlayPrevFocus) { animOverlayPrevFocus.focus(); animOverlayPrevFocus = null; }
}

function showBar(html: string, permanent = false): void {
  const bar = getSharedBar();
  if (barHideTimeout) { clearTimeout(barHideTimeout); barHideTimeout = null; }

  if (permanent) {
    bar.innerHTML = `<span>${html}</span><button class="tooltip-bar__close" aria-label="Close" style="
      position: absolute; right: var(--space-lg, 16px); top: 50%; transform: translateY(-50%);
      background: var(--page-bg, #fff); border: 2px solid var(--bar-border-color, var(--primary-600, #666));
      cursor: pointer; font-size: 1em; font-weight: bold;
      color: var(--neutral-800, #333); padding: var(--space-xs, 4px) var(--space-sm, 8px);
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

  bar.style.visibility = 'visible';
  requestAnimationFrame(() => {
    bar.style.opacity = '1';
  });
}

function hideBar(immediate = false): void {
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

function getAltContent(figure: HTMLElement): string {
  const isAac = document.documentElement.hasAttribute('data-content-aac');
  const altMode = document.documentElement.dataset.altTextMode || 'none';

  if (isAac) {
    const aac = figure.querySelector('.image-alt-aac');
    if (aac) return aac.innerHTML;
    const word = figure.querySelector('.image-alt-word');
    if (word) return word.textContent || '';
  }

  if (altMode === 'aac') {
    const aac = figure.querySelector('.image-alt-aac');
    if (aac) return aac.innerHTML;
    // Fallback: no AAC cards, show word
    const word = figure.querySelector('.image-alt-word');
    if (word) return word.textContent || '';
  }

  if (altMode === 'descriptive') {
    const desc = figure.querySelector('.image-alt-descriptive');
    if (desc) return desc.textContent || '';
  }

  if (altMode === 'word') {
    const word = figure.querySelector('.image-alt-word');
    if (word) return word.textContent || '';
  }

  // Default: descriptive > word > img alt
  const desc = figure.querySelector('.image-alt-descriptive');
  if (desc?.textContent) return desc.textContent;
  const word = figure.querySelector('.image-alt-word');
  if (word?.textContent) return word.textContent;
  const img = figure.querySelector('img');
  return img?.alt || '';
}

function initFigCaptions(): void {
  if (!isTooltipMode()) return;

  const figures = document.querySelectorAll<HTMLElement>('figure[data-role="content"]');
  figures.forEach((figure) => {
    if (figure.dataset.figcaptionInit) return;

    // Only add figcaption if figure has alt text spans
    const hasAltText = figure.querySelector('.image-alt-word, .image-alt-descriptive, .image-alt-aac');
    if (!hasAltText) return;

    figure.dataset.figcaptionInit = 'true';

    // Create figcaption element (not for inline mode — alt text already visible)
    let caption: HTMLElement | null = null;
    if (!isInlineMode()) {
      caption = document.createElement('figcaption');
      caption.className = 'figcaption';
      caption.setAttribute('aria-hidden', 'true');
      figure.appendChild(caption);
    }

    function updateCaption(): void {
      if (!caption) return;
      const content = getAltContent(figure);
      const isAac = document.documentElement.hasAttribute('data-content-aac') ||
                     document.documentElement.dataset.altTextMode === 'aac' ||
                     document.documentElement.getAttribute('data-alt-text-mode') === 'aac';

      if (isAac) {
        caption.innerHTML = `<span class="figcaption__aac content-aac">${content}</span>`;
      } else {
        caption.innerHTML = `<span class="figcaption__text">${content}</span>`;
      }
    }

    const isPermanentMode = () => isSubtitleMode() && document.documentElement.dataset.hover === 'none';

    function onEnter(): void {
      if (!isTooltipMode()) return;
      if (isPermanentMode()) return; // click only in permanent mode
      if (document.documentElement.dataset.hover === 'none') return; // click only in hover-none
      if (!isInlineMode()) updateCaption();
      if (isBarMode() && !isInlineMode()) {
        const content = getAltContent(figure);
        if (content) showBar(content);
      }
    }

    function onLeave(): void {
      if (isPermanentMode()) return; // stays until X clicked
      if (document.documentElement.dataset.hover === 'none') return; // click handles viewed state
      figure.classList.add('alt-viewed'); // mark as seen on leave
      figure.classList.add('highlight-visited'); // highlight-links visited state
      if (isBarMode()) hideBar();
    }

    function onClick(): void {
      if (!isTooltipMode()) return;
      if (!isPermanentMode()) return; // only for permanent mode
      updateCaption();
      const content = getAltContent(figure);
      if (content) showBar(content, true);
      // Mark as viewed — user has seen the alt text
      figure.classList.add('alt-viewed');
    }

    // Populate content immediately
    updateCaption();

    figure.addEventListener('mouseenter', onEnter);
    figure.addEventListener('mouseleave', onLeave);
    figure.addEventListener('focusin', onEnter);
    figure.addEventListener('focusout', onLeave);

    // Click — touch support + permanent mode + hover-none viewed state
    figure.addEventListener('click', (e: Event) => {
      if (isPermanentMode()) {
        e.stopPropagation();
        onClick();
      } else if (document.documentElement.dataset.hover === 'none') {
        // Hover-none: click toggles figcaption
        e.stopPropagation();
        updateCaption();
        if (caption) {
          caption.classList.toggle('figcaption--show');
          if (caption.classList.contains('figcaption--show')) {
            figure.classList.add('alt-viewed');
            figure.classList.add('highlight-visited');
          }
        }
        if (isBarMode() && !isInlineMode()) {
          const content = getAltContent(figure);
          if (content) showBar(content, true);
          figure.classList.add('alt-viewed');
          figure.classList.add('highlight-visited');
        }
      } else if (isInlineMode()) {
        figure.classList.add('alt-viewed');
        figure.classList.add('highlight-visited');
      } else if (isBarMode()) {
        e.stopPropagation();
        onEnter();
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════
// ANIMATION EXPLAINER — same system, reads [data-anim-seq]
// ═══════════════════════════════════════════════════════════

function getAnimContent(el: HTMLElement): string {
  // Return the full explainer with its flex container intact
  const explainer = el.classList.contains('anim-explainer') ? el : el.querySelector('.anim-explainer');
  if (explainer) return `<span class="anim-explainer" style="display:inline-flex;flex-direction:row;align-items:center;gap:var(--space-sm);flex-wrap:wrap">${explainer.innerHTML}</span>`;
  return el.getAttribute('aria-label') || '';
}

function initAnimCaptions(): void {
  if (!isAnimTooltipMode()) return;

  document.querySelectorAll<HTMLElement>('[data-anim-seq]').forEach((el) => {
    if (el.dataset.animcaptionInit) return;

    el.dataset.animcaptionInit = 'true';

    // For tooltip/overlay: create a caption element
    let caption: HTMLElement | null = null;
    if (document.documentElement.dataset.animExplainer === 'tooltip' ||
        document.documentElement.dataset.animExplainer === 'overlay') {
      caption = document.createElement('div');
      caption.className = 'figcaption figcaption--anim';
      caption.setAttribute('aria-hidden', 'true');
      // Insert after the animated element (the previous sibling of the explainer)
      const animatedEl = el.previousElementSibling as HTMLElement;
      if (animatedEl) {
        animatedEl.parentNode?.insertBefore(caption, el);
      }
    }

    const isPermanent = () => isAnimSubtitleMode() && document.documentElement.dataset.hover === 'none';

    function onEnter(): void {
      if (!isAnimTooltipMode()) return;
      if (isPermanent()) return;
      if (document.documentElement.dataset.hover === 'none') return;
      const content = getAnimContent(el);
      if (isAnimOverlayMode()) {
        if (content) showAnimOverlay(content);
      } else if (isAnimBarMode()) {
        if (content) showBar(content);
      } else if (caption) {
        caption.innerHTML = content;
      }
    }

    function onLeave(): void {
      if (isPermanent()) return;
      if (document.documentElement.dataset.hover === 'none') return;
      if (isAnimBarMode()) hideBar();
      // Overlay stays open until Escape/close — no hide on leave
    }

    function onClick(): void {
      if (!isAnimTooltipMode()) return;
      const content = getAnimContent(el);
      if (isPermanent() || document.documentElement.dataset.hover === 'none') {
        if (isAnimOverlayMode()) {
          if (content) showAnimOverlay(content);
        } else if (isAnimBarMode()) {
          if (content) showBar(content, true);
        }
      }
    }

    // Find the animated element to attach hover/focus listeners
    // Try previous sibling first, then look for nearest icon/shape with data-has-explainer
    const target = (el.previousElementSibling as HTMLElement)
      || el.parentElement?.querySelector('[data-has-explainer]') as HTMLElement
      || el;
    target.addEventListener('mouseenter', onEnter);
    target.addEventListener('mouseleave', onLeave);
    target.addEventListener('focusin', onEnter);
    target.addEventListener('focusout', onLeave);
    target.addEventListener('click', onClick);
  });
}

// Watch for display mode changes
const observer = new MutationObserver(() => {
  if (isTooltipMode()) initFigCaptions();
  if (isAnimActive()) initAnimCaptions();
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-alt-display-mode', 'data-altdisplaymode', 'data-anim-explainer']
});
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['data-alt-display-mode']
});

// Scroll hides bar
window.addEventListener('scroll', () => {
  if (sharedBar && sharedBar.style.opacity === '1') {
    if (barHideTimeout) clearTimeout(barHideTimeout);
    sharedBar.style.opacity = '0';
    sharedBar.style.visibility = 'hidden';
  }
}, { passive: true });

// Init — both content types
function initAll() {
  initFigCaptions();
  initAnimCaptions();
}

document.addEventListener('astro:page-load', initAll);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initAll();
}
