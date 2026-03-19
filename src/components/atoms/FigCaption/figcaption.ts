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
    padding: var(--space-md, 12px) var(--space-lg, 24px);
    background: var(--page-bg-raised, #f5f5f5);
    color: var(--neutral-800, #333);
    border-top: 4px solid var(--primary-600, #666);
    font-weight: 500;
    opacity: 0; visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
  `;
  document.body.appendChild(bar);
  sharedBar = bar;
  return bar;
}

function isBarMode(): boolean {
  const hover = document.body.dataset.hover;
  if (hover === 'none') return false;
  const render = document.body.dataset.render;
  const isMobile = window.innerWidth <= 640;
  return render === 'textonly' || isMobile;
}

function isTooltipMode(): boolean {
  return document.documentElement.dataset.altDisplayMode === 'tooltip';
}

function showBar(html: string): void {
  const bar = getSharedBar();
  if (barHideTimeout) { clearTimeout(barHideTimeout); barHideTimeout = null; }
  bar.innerHTML = html;
  bar.style.opacity = '1';
  bar.style.visibility = 'visible';
}

function hideBar(): void {
  if (barHideTimeout) clearTimeout(barHideTimeout);
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
  }

  if (altMode === 'aac') {
    const aac = figure.querySelector('.image-alt-aac');
    if (aac) return aac.innerHTML;
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
    figure.dataset.figcaptionInit = 'true';

    // Create figcaption element
    const caption = document.createElement('figcaption');
    caption.className = 'figcaption';
    caption.setAttribute('aria-hidden', 'true');
    figure.appendChild(caption);

    function updateCaption(): void {
      const content = getAltContent(figure);
      const isAac = document.documentElement.hasAttribute('data-content-aac') ||
                     document.documentElement.dataset.altTextMode === 'aac';

      if (isAac) {
        caption.innerHTML = `<span class="figcaption__aac content-aac">${content}</span>`;
      } else {
        caption.innerHTML = `<span class="figcaption__text">${content}</span>`;
      }
    }

    function onEnter(): void {
      updateCaption();
      if (isBarMode()) {
        const content = getAltContent(figure);
        if (content) showBar(content);
      }
    }

    function onLeave(): void {
      if (isBarMode()) hideBar();
    }

    figure.addEventListener('mouseenter', onEnter);
    figure.addEventListener('mouseleave', onLeave);
    figure.addEventListener('focusin', onEnter);
    figure.addEventListener('focusout', onLeave);

    // Touch support
    figure.addEventListener('click', (e: Event) => {
      if (isBarMode()) {
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

// Init
document.addEventListener('astro:page-load', initFigCaptions);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initFigCaptions();
}
