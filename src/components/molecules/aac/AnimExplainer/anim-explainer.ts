/**
 * AnimExplainer — runtime display controller for animation sequence cards
 *
 * Reads [data-anim-seq] containers (built at build time by AnimExplainer molecule).
 * Handles subtitle (bottom bar), tooltip (popup), and enlarge (modal) display.
 * Inline mode is CSS-only — no JS needed.
 *
 * Gated by data-anim-explainer on <html>.
 * Reuses shared tooltip bar from Tooltip atom.
 */

// ── Shared bar (reuse Tooltip's bar) ─────────────────────

let sharedBar: HTMLElement | null = null;
let barHideTimeout: ReturnType<typeof setTimeout> | null = null;

function getSharedBar(): HTMLElement {
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

// ── Mode checks ──────────────────────────────────────────

function getMode(): string {
  return document.documentElement.dataset.animExplainer || 'off';
}

function isActive(): boolean {
  const mode = getMode();
  return mode !== 'off';
}

function isSubtitleMode(): boolean {
  return getMode() === 'subtitle';
}

function isTooltipMode(): boolean {
  return getMode() === 'tooltip';
}

function isEnlargeMode(): boolean {
  return getMode() === 'enlarge';
}

function isBarMode(): boolean {
  if (isSubtitleMode()) return true;
  return window.innerWidth <= 640;
}

// ── Enlarge modal ────────────────────────────────────────

let modal: HTMLElement | null = null;
let modalPrevFocus: HTMLElement | null = null;

function getModal(): HTMLElement {
  if (modal) return modal;
  const el = document.createElement('div');
  el.className = 'image-enlarge-modal anim-explainer-modal';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Animation explainer');
  el.innerHTML = `
    <button class="image-enlarge-modal__close" aria-label="Close explainer">&times;</button>
    <div class="image-enlarge-modal__content anim-explainer-modal__content"></div>
  `;
  document.body.appendChild(el);
  modal = el;

  el.querySelector('.image-enlarge-modal__close')!.addEventListener('click', closeModal);
  el.addEventListener('click', (e: MouseEvent) => { if (e.target === el) closeModal(); });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && modal?.dataset.open === 'true') closeModal();
  });

  return el;
}

function openModal(html: string): void {
  const m = getModal();
  const content = m.querySelector('.anim-explainer-modal__content') as HTMLElement;
  content.innerHTML = html;
  modalPrevFocus = document.activeElement as HTMLElement;
  m.dataset.open = 'true';
  document.body.style.overflow = 'hidden';
  (m.querySelector('.image-enlarge-modal__close') as HTMLElement).focus();
}

function closeModal(): void {
  if (!modal) return;
  modal.dataset.open = 'false';
  document.body.style.overflow = '';
  if (modalPrevFocus) { modalPrevFocus.focus(); modalPrevFocus = null; }
}

// ── Content helper ───────────────────────────────────────

function getContent(el: HTMLElement): string {
  const explainer = el.classList.contains('anim-explainer') ? el : el.querySelector('.anim-explainer');
  if (explainer) return `<span class="anim-explainer" style="display:inline-flex;flex-direction:row;align-items:center;gap:var(--space-sm);flex-wrap:wrap">${explainer.innerHTML}</span>`;
  return el.getAttribute('aria-label') || '';
}

// ── Init ─────────────────────────────────────────────────

function initAnimExplainer(): void {
  const mode = getMode();
  if (mode === 'off' || mode === 'inline') return; // inline is CSS-only

  document.querySelectorAll<HTMLElement>('[data-anim-seq]').forEach((el) => {
    if (el.dataset.animExplainerInit) return;
    el.dataset.animExplainerInit = 'true';

    // Find the animated element
    const target = (el.previousElementSibling as HTMLElement)
      || el.parentElement?.querySelector('[data-has-explainer]') as HTMLElement
      || el;

    // Tooltip wrapper (if icon is wrapped in Tooltip atom)
    const tooltipWrapper = target.closest('.anim-explainer-tooltip') as HTMLElement | null;

    // Mark as viewed on first interaction — border goes neutral
    function markViewed(): void {
      if (tooltipWrapper) tooltipWrapper.classList.add('anim-viewed');
    }

    // Wire viewed state on the Tooltip wrapper's mouseleave
    if (tooltipWrapper) {
      tooltipWrapper.addEventListener('mouseleave', markViewed);
      tooltipWrapper.addEventListener('focusout', markViewed);
    }

    const isPermanent = () => isSubtitleMode() && document.documentElement.dataset.hover === 'none';

    // Position the explainer as a fixed tooltip below the target
    function positionTooltip(): void {
      const rect = target.getBoundingClientRect();
      el.style.setProperty('--_tooltip-x', `${rect.left + rect.width / 2}px`);
      el.style.setProperty('--_tooltip-y', `${rect.bottom}px`);
    }

    function onEnter(): void {
      if (!isActive()) return;
      if (isEnlargeMode()) return;
      if (isPermanent()) return;
      if (document.documentElement.dataset.hover === 'none') return;

      if (isTooltipMode()) {
        positionTooltip();
        el.classList.add('anim-explainer--tooltip-show');
      } else if (isBarMode()) {
        const content = getContent(el);
        if (content) showBar(content);
      }
    }

    function onLeave(): void {
      if (isEnlargeMode()) return;
      if (isPermanent()) return;
      if (document.documentElement.dataset.hover === 'none') return;

      el.classList.remove('anim-explainer--tooltip-show');
      if (isBarMode()) hideBar();

      // Mark as viewed — border goes neutral
      const tooltipWrapper = target.closest('.anim-explainer-tooltip');
      if (tooltipWrapper) tooltipWrapper.classList.add('anim-viewed');
    }

    function onClick(): void {
      if (!isActive()) return;
      if (isEnlargeMode()) {
        const content = getContent(el);
        if (content) openModal(content);
        return;
      }
      if (isTooltipMode() && document.documentElement.dataset.hover === 'none') {
        positionTooltip();
        el.classList.toggle('anim-explainer--tooltip-show');
        return;
      }
      if (isPermanent() || document.documentElement.dataset.hover === 'none') {
        if (isBarMode()) {
          const content = getContent(el);
          if (content) showBar(content, true);
        }
      }
    }

    target.addEventListener('mouseenter', onEnter);
    target.addEventListener('mouseleave', onLeave);
    target.addEventListener('focusin', onEnter);
    target.addEventListener('focusout', onLeave);
    target.addEventListener('click', onClick);
  });
}

// ── Watch for mode changes ───────────────────────────────

const observer = new MutationObserver(() => {
  if (isActive()) initAnimExplainer();
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-anim-explainer']
});

// Scroll hides bar + tooltip
window.addEventListener('scroll', () => {
  if (sharedBar && sharedBar.style.opacity === '1') {
    if (barHideTimeout) clearTimeout(barHideTimeout);
    sharedBar.style.opacity = '0';
    sharedBar.style.visibility = 'hidden';
  }
  // Hide any open tooltips
  document.querySelectorAll('.anim-explainer--tooltip-show').forEach(el => {
    el.classList.remove('anim-explainer--tooltip-show');
  });
}, { passive: true });

// Init
document.addEventListener('astro:page-load', initAnimExplainer);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initAnimExplainer();
}
