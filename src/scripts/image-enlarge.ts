/**
 * Image Enlarge Mode
 *
 * When data-image-enlarge is set on <html>, content images become clickable.
 * Click opens a modal with enlarged image + alt text subtitle + AAC cards.
 * Focus trapped in modal. Escape/click-outside/close button closes.
 *
 * Works across all render modes, themes, and accessibility gates.
 */

let modal: HTMLElement | null = null;
let previousFocus: HTMLElement | null = null;
let zoomIconSvg: string | null = null;

// Fetch magnifying glass icon from Asset Library API
async function fetchZoomIcon(): Promise<string> {
  if (zoomIconSvg) return zoomIconSvg;
  try {
    const apiUrl = import.meta.env.PUBLIC_ASSET_API_URL || 'https://asset-library.natashacharlton25.workers.dev';
    const res = await fetch(`${apiUrl}/v1/assets/magnifying-glass-regular`);
    if (res.ok) {
      const data = await res.json();
      if (data.asset?.content) {
        zoomIconSvg = data.asset.content;
        return zoomIconSvg;
      }
    }
  } catch {}
  // Fallback inline SVG if API fails
  zoomIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M229.66,218.34l-50.07-50.07a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.31ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>';
  return zoomIconSvg;
}

function createModal(): HTMLElement {
  if (modal) return modal;

  const el = document.createElement('div');
  el.className = 'image-enlarge-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Enlarged image');
  el.innerHTML = `
    <button class="image-enlarge-modal__close" aria-label="Close enlarged image">&times;</button>
    <div class="image-enlarge-modal__content">
      <img class="image-enlarge-modal__image" src="" alt="" />
      <p class="image-enlarge-modal__subtitle"></p>
      <div class="image-enlarge-modal__aac"></div>
    </div>
  `;

  document.body.appendChild(el);
  modal = el;

  // Close handlers
  const closeBtn = el.querySelector('.image-enlarge-modal__close') as HTMLElement;
  closeBtn.addEventListener('click', closeModal);

  el.addEventListener('click', (e: MouseEvent) => {
    if (e.target === el) closeModal();
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal?.dataset.open === 'true') {
      closeModal();
    }
  });

  return el;
}

function openModal(figure: HTMLElement): void {
  const m = createModal();
  const img = figure.querySelector('img') as HTMLImageElement;
  if (!img) return;

  // Mark as viewed — neutral borders on re-open
  const wasViewed = figure.classList.contains('alt-viewed');
  figure.classList.add('alt-viewed');
  figure.classList.add('highlight-visited');
  if (wasViewed) {
    m.classList.add('modal-viewed');
  } else {
    m.classList.remove('modal-viewed');
  }

  // Store focus for return
  previousFocus = document.activeElement as HTMLElement;

  // Set image + copy computed filter from original
  const modalImg = m.querySelector('.image-enlarge-modal__image') as HTMLImageElement;
  modalImg.src = img.src;
  modalImg.alt = img.alt;

  // Check alt text mode
  const altTextMode = document.documentElement.dataset.altTextMode ||
                       document.documentElement.getAttribute('data-alt-text-mode') || 'none';
  const isAac = altTextMode === 'aac' || document.documentElement.hasAttribute('data-content-aac');

  const subtitle = m.querySelector('.image-enlarge-modal__subtitle') as HTMLElement;
  const aacTarget = m.querySelector('.image-enlarge-modal__aac') as HTMLElement;

  if (isAac) {
    // AAC mode: show cards, hide text subtitle
    subtitle.textContent = '';
    const aacSource = figure.querySelector('.image-alt-aac');
    aacTarget.innerHTML = aacSource ? aacSource.innerHTML : '';
  } else {
    // Text mode: show subtitle, hide cards
    const altDesc = figure.querySelector('.image-alt-descriptive');
    const altWord = figure.querySelector('.image-alt-word');
    if (altTextMode === 'word') {
      subtitle.textContent = altWord?.textContent || '';
    } else {
      subtitle.textContent = altDesc?.textContent || altWord?.textContent || img.alt || '';
    }
    aacTarget.innerHTML = '';
  }

  // Open
  m.dataset.open = 'true';
  document.body.style.overflow = 'hidden';

  // Focus close button
  const closeBtn = m.querySelector('.image-enlarge-modal__close') as HTMLElement;
  closeBtn.focus();

  // Focus trap
  m.addEventListener('keydown', trapFocus);
}

function closeModal(): void {
  if (!modal) return;

  modal.dataset.open = 'false';
  document.body.style.overflow = '';
  modal.removeEventListener('keydown', trapFocus);

  // Return focus
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }
}

function trapFocus(e: KeyboardEvent): void {
  if (e.key !== 'Tab' || !modal) return;

  const focusable = modal.querySelectorAll(
    'button, [href], [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

async function attachHandlers(): Promise<void> {
  // Only activate when data-image-enlarge is set
  const isActive = document.documentElement.hasAttribute('data-image-enlarge');
  if (!isActive) return;

  const iconSvg = await fetchZoomIcon();

  const figures = document.querySelectorAll('figure[data-role="content"]') as NodeListOf<HTMLElement>;
  figures.forEach((figure) => {
    // Skip if already bound
    if (figure.dataset.enlargeBound) return;
    figure.dataset.enlargeBound = 'true';

    // Inject zoom icon badge
    const badge = document.createElement('span');
    badge.className = 'image-enlarge-badge';
    badge.setAttribute('aria-hidden', 'true');
    badge.innerHTML = iconSvg;
    figure.appendChild(badge);

    figure.addEventListener('click', () => openModal(figure));
    figure.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(figure);
      }
    });

    figure.setAttribute('aria-haspopup', 'dialog');
  });
}

// Watch for attribute changes on <html> to enable/disable
function observeEnlargeMode(): void {
  const observer = new MutationObserver(() => {
    // Close modal on any display mode change
    closeModal();

    const isActive = document.documentElement.hasAttribute('data-image-enlarge');
    if (isActive) {
      attachHandlers();
    } else {
      // Remove cursor/aria/badges when disabled
      const figures = document.querySelectorAll('figure[data-enlarge-bound]') as NodeListOf<HTMLElement>;
      figures.forEach((figure) => {
        figure.removeAttribute('aria-haspopup');
        delete figure.dataset.enlargeBound;
        const badge = figure.querySelector('.image-enlarge-badge');
        if (badge) badge.remove();
      });
      closeModal();
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-image-enlarge', 'data-alt-display-mode']
  });
}

// Init
document.addEventListener('astro:page-load', () => {
  attachHandlers();
  observeEnlargeMode();
});

// Fallback for non-Astro pages
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  attachHandlers();
  observeEnlargeMode();
}
