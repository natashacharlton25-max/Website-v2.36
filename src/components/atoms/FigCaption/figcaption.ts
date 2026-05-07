/**
 * FigCaption — runtime alt text tooltip for images
 *
 * Reads alt text from .image-alt-word / .image-alt-descriptive / .image-alt-aac
 * already in the DOM (built at build time by Image atom).
 * Creates a <figcaption> with tooltip behaviour.
 *
 * Gated by data-alt-display-mode="tooltip" on <html>.
 * Uses the shared tooltip-bar from src/lib/bar/shared-bar.ts (same bar
 * used by Tooltip atom + AnimExplainer).
 */
import { showBar, hideBar, hideBarOnScroll } from '../../../lib/bar/shared-bar';

function isBarMode(): boolean {
  if (isSubtitleMode()) return true; // subtitle always uses bar
  const isMobile = window.innerWidth <= 640;
  return isMobile; // only mobile uses bar, text-only uses popup
}

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
      if (isPermanentMode()) return;
      if (document.documentElement.dataset.hover === 'none') return;
      if (!isInlineMode()) updateCaption();
      if (isBarMode() && !isInlineMode()) {
        const content = getAltContent(figure);
        if (content) showBar(content);
      }
    }

    function onLeave(): void {
      if (isPermanentMode()) return;
      if (document.documentElement.dataset.hover === 'none') return;
      figure.classList.add('alt-viewed');
      figure.classList.add('highlight-visited');
      if (isBarMode()) hideBar();
    }

    function onClick(): void {
      if (!isTooltipMode()) return;
      if (!isPermanentMode()) return;
      updateCaption();
      const content = getAltContent(figure);
      if (content) showBar(content, { permanent: true });
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
          if (content) showBar(content, { permanent: true });
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
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['data-alt-display-mode']
});

// Scroll hides bar
window.addEventListener('scroll', hideBarOnScroll, { passive: true });

// Init
document.addEventListener('astro:page-load', initFigCaptions);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initFigCaptions();
}
