/**
 * AnimExplainer — runtime display controller for animation sequence cards
 *
 * Reads [data-anim-seq] containers (built at build time by AnimExplainer molecule).
 * Handles subtitle (bottom bar), tooltip (popup), and enlarge (modal) display.
 * Inline mode is CSS-only — no JS needed.
 *
 * Gated by data-anim-explainer on <html>.
 * Uses the shared tooltip-bar from src/lib/bar/shared-bar.ts (same bar
 * used by Tooltip atom + FigCaption).
 */
import { showBar, hideBar, hideBarOnScroll } from '../../../../lib/bar/shared-bar';

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
  modal.classList.add('anim-modal-viewed');
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

    // Find the animated element — may be in Tooltip wrapper structure
    const tooltipWrapper = el.closest('.anim-explainer-tooltip') as HTMLElement | null;
    const target = tooltipWrapper
      ? tooltipWrapper.querySelector('[data-has-explainer]') as HTMLElement || el
      : (el.previousElementSibling as HTMLElement) || el;

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

    // Tooltip mode — Tooltip atom handles everything (hover, focus,
    // positioning, mobile bar, scroll dismiss). No JS needed here.

    // Subtitle — bottom bar on hover
    function onEnter(): void {
      if (!isActive()) return;
      if (isEnlargeMode() || isTooltipMode()) return;
      if (isPermanent()) return;
      if (document.documentElement.dataset.hover === 'none') return;

      if (isBarMode()) {
        const content = getContent(el);
        if (content) showBar(content);
      }
    }

    function onLeave(): void {
      if (isEnlargeMode() || isTooltipMode()) return;
      if (isPermanent()) return;
      if (document.documentElement.dataset.hover === 'none') return;
      if (isBarMode()) hideBar();
    }

    // Enlarge — click opens modal (hover:none = double click)
    // Subtitle hover:none — click shows bar
    function onClick(): void {
      if (!isActive()) return;
      if (isTooltipMode()) return; // click reserved for animation
      if (isEnlargeMode()) {
        if (document.documentElement.dataset.hover === 'none') return; // dblclick handles it
        const content = getContent(el);
        if (content) openModal(content);
        return;
      }
      if (isPermanent() || document.documentElement.dataset.hover === 'none') {
        if (isBarMode()) {
          const content = getContent(el);
          if (content) showBar(content, { permanent: true });
        }
      }
    }

    function onDblClick(): void {
      if (!isActive()) return;
      if (!isEnlargeMode()) return;
      if (document.documentElement.dataset.hover !== 'none') return;
      const content = getContent(el);
      if (content) openModal(content);
    }

    target.addEventListener('mouseenter', onEnter);
    target.addEventListener('mouseleave', onLeave);
    target.addEventListener('focusin', onEnter);
    target.addEventListener('focusout', onLeave);
    target.addEventListener('click', onClick);
    target.addEventListener('dblclick', onDblClick);
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
window.addEventListener('scroll', hideBarOnScroll, { passive: true });

// Init
document.addEventListener('astro:page-load', initAnimExplainer);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initAnimExplainer();
}
