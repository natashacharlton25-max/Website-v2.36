/**
 * Pattern Overlay — Magnetic proximity effect
 *
 * Adapted from RevealCanvas proximity detection.
 * Icons in the grid subtly translate toward the cursor
 * and snap back with elastic ease on mouse leave.
 *
 * Only runs when data-pattern-magnetic="true" is set.
 * Requires GSAP (already imported globally).
 *
 * A11y: skips init if reduce-motion is active (system or panel).
 */

import { gsap } from 'gsap';

const PROXIMITY_RADIUS = 150;
const FOLLOW_STRENGTH = 0.4;
const ELASTIC_EASE = 'elastic.out(1, 0.3)';
const SNAP_DURATION = 0.5;
const MOVE_DURATION = 0.3;

function prefersReducedMotion(): boolean {
  const wrapper = document.getElementById('a11y-content-wrapper');
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !!wrapper?.classList.contains('a11y-reduce-motion') ||
    !!wrapper?.classList.contains('a11y-text-only')
  );
}

function initMagnetic(overlay: HTMLElement): void {
  const cells = overlay.querySelectorAll<HTMLElement>('.pattern-overlay__cell');
  if (!cells.length) return;

  overlay.addEventListener('mousemove', (e: MouseEvent) => {
    const rect = overlay.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    cells.forEach((cell) => {
      const cr = cell.getBoundingClientRect();
      const cx = cr.left + cr.width / 2 - rect.left;
      const cy = cr.top + cr.height / 2 - rect.top;
      const dist = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);

      if (dist < PROXIMITY_RADIUS) {
        const strength = (1 - dist / PROXIMITY_RADIUS) * FOLLOW_STRENGTH;
        const dx = (mx - cx) * strength;
        const dy = (my - cy) * strength;
        gsap.to(cell, { x: dx, y: dy, duration: MOVE_DURATION, ease: 'power2.out', overwrite: 'auto' });
      }
    });
  });

  overlay.addEventListener('mouseleave', () => {
    cells.forEach((cell) => {
      gsap.to(cell, { x: 0, y: 0, duration: SNAP_DURATION, ease: ELASTIC_EASE, overwrite: 'auto' });
    });
  });
}

function init(): void {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('[data-pattern-magnetic="true"]').forEach(initMagnetic);
}

// Init on load + Astro page transitions
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
document.addEventListener('astro:page-load', init);

// Watch for a11y changes (kill magnetic if reduce-motion toggled on)
const wrapper = document.getElementById('a11y-content-wrapper');
if (wrapper) {
  new MutationObserver(() => {
    if (prefersReducedMotion()) {
      // Reset all cells to origin
      document.querySelectorAll<HTMLElement>('[data-pattern-magnetic="true"] .pattern-overlay__cell').forEach((cell) => {
        gsap.set(cell, { x: 0, y: 0 });
      });
    }
  }).observe(wrapper, { attributes: true, attributeFilter: ['class'] });
}
