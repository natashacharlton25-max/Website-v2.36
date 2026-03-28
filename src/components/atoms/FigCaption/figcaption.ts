/**
 * FigCaption — runtime alt text tooltip for images
 *
 * Reads alt text from .image-alt-word / .image-alt-descriptive / .image-alt-aac
 * already in the DOM (built at build time by Image atom).
 * Creates a <figcaption> with tooltip behaviour.
 *
 * Gated by data-alt-display-mode="tooltip" on <html>.
 * Uses same shared bar as Tooltip atom for textonly/mobile.
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
  if (isOverlayMode()) return true; // overlay always uses bar
  const hover = document.body.dataset.hover;
  if (hover === 'none') return false;
  const render = document.body.dataset.render;
  const isMobile = window.innerWidth <= 640;
  return render === 'textonly' || isMobile;
}

function isTooltipMode(): boolean {
  const mode = document.documentElement.dataset.altDisplayMode;
  return mode === 'tooltip' || mode === 'overlay' || mode === 'inline';
}

function isOverlayMode(): boolean {
  return document.documentElement.dataset.altDisplayMode === 'overlay';
}

function isInlineMode(): boolean {
  return document.documentElement.dataset.altDisplayMode === 'inline';
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

    const isPermanentMode = () => isOverlayMode() && document.body.dataset.hover === 'none';

    function onEnter(): void {
      if (!isTooltipMode()) return;
      if (isPermanentMode()) return; // click only in permanent mode
      if (document.body.dataset.hover === 'none') return; // click only in hover-none
      if (!isInlineMode()) updateCaption();
      if (isBarMode() && !isInlineMode()) {
        const content = getAltContent(figure);
        if (content) showBar(content);
      }
    }

    function onLeave(): void {
      if (isPermanentMode()) return; // stays until X clicked
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
      } else if (document.body.dataset.hover === 'none') {
        // Hover-none: click toggles figcaption + marks viewed
        e.stopPropagation();
        updateCaption();
        if (caption) {
          const isShowing = caption.style.opacity === '1';
          caption.style.opacity = isShowing ? '0' : '1';
          caption.style.visibility = isShowing ? 'hidden' : 'visible';
          caption.style.pointerEvents = isShowing ? 'none' : 'auto';
          if (!isShowing) {
            figure.classList.add('alt-viewed');
            figure.classList.add('highlight-visited');
          }
        }
        if (isBarMode()) {
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

// Watch for display mode changes
const observer = new MutationObserver(() => {
  if (isTooltipMode()) {
    initFigCaptions();
  }
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-alt-display-mode', 'data-altdisplaymode']
});

// Scroll hides bar
window.addEventListener('scroll', () => {
  if (sharedBar && sharedBar.style.opacity === '1') {
    if (barHideTimeout) clearTimeout(barHideTimeout);
    sharedBar.style.opacity = '0';
    sharedBar.style.visibility = 'hidden';
  }
}, { passive: true });

// Init
document.addEventListener('astro:page-load', initFigCaptions);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initFigCaptions();
}
