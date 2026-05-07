/**
 * SVG Animation Initialiser — entry point for the shared Icon/Shape animation system
 *
 * Both Icon and Shape atoms emit a shared `data-icon-*` attribute namespace
 * (intentional — this is the SVG animation contract, not Icon-specific).
 * Each handler picks up its attribute and wires the right animation:
 *   draw, draw-morph, morph, fill, gradient, micro.
 *
 * Per-atom branching inside each handler is via classList.contains('shape')
 * vs classList.contains('icon') when the two need to behave differently
 * (e.g. fill.ts treating Shape's solid fill differently from Icon's path fills).
 *
 * Each system lives in its own file so a syntax error in one doesn't break
 * the others.
 *
 * Public API:
 *   initIconAnimations() — call once on page load to wire up every element
 *   onThemeChange()      — internal, fires from animation-config theme listener
 *
 * Loaded once globally by BaseLayout.astro.
 */

import { prefersReducedMotion, getRenderMode, getMotionMode, isExplainerGated, onThemeChange as registerThemeCallback } from '../animation-config';
import { initDrawIcon } from './draw';
import { initMorphIcon } from './morph';
import { initFillIcon, rainbowScrollElements } from './fill';
import { initAnimatedGradient, gateAnimatedGradients } from './gradient';
import { initMicroAnimations } from './micro';

export function initIconAnimations() {
  // OS / system reduced motion preference — hard bail
  if (prefersReducedMotion()) return;
  // Motion mode "none" — user has explicitly killed animation
  if (getMotionMode() === 'none') {
    gateAnimatedGradients();
    return;
  }
  // Textonly/assistive — no GSAP animations (render controller handles DOM)
  const render = getRenderMode();
  if (render === 'assistive' || render === 'textonly') {
    gateAnimatedGradients();
    return;
  }
  // Reduced mode: animations init but registerTrigger routes them
  // through the viewport stagger queue (one at a time per section)

  gateAnimatedGradients();
  initMicroAnimations(); // CSS keyframes → GSAP, through registerTrigger
  document.querySelectorAll<HTMLElement>('[data-icon-draw]').forEach(el => {
    if (!isExplainerGated(el)) initDrawIcon(el);
  });
  document.querySelectorAll<HTMLElement>('[data-icon-morph]').forEach(el => {
    if (!isExplainerGated(el)) initMorphIcon(el);
  });
  document.querySelectorAll<HTMLElement>('[data-icon-fill]').forEach(el => {
    if (!isExplainerGated(el)) initFillIcon(el);
  });
  document.querySelectorAll<HTMLElement>('[data-icon-grad-anim]').forEach(initAnimatedGradient);
}

// Re-export so other modules can opt into the same animation system
export { initDrawIcon, initMorphIcon, initFillIcon, initAnimatedGradient };

/**
 * Clear inline colours on theme change so CSS tokens take over again.
 *
 * Each animation system writes inline fill/stroke values during runtime
 * (because GSAP can't tween CSS custom properties cleanly). When the user
 * switches themes, those inline values become stale — this handler clears
 * them so the new theme's CSS tokens cascade through.
 *
 * Skips:
 *   - draw overlays (initDrawIcon set fill:none intentionally)
 *   - gradient URLs (refreshed separately at the bottom)
 *   - fill clones (re-coloured per element below)
 */
function onThemeChange() {
  // Draw overlays: clear inline stroke
  document.querySelectorAll('.icon-draw-overlay, .icon-draw-worm, .icon-draw-trail, .icon-draw-chase').forEach(el => {
    (el as HTMLElement).style.removeProperty('stroke');
  });

  // Fill clones: re-read color from parent's CSS token
  // Skip ghoststatic clones — they use --svg-ghost-color, not --_color
  document.querySelectorAll('.icon-fill-morph').forEach(clone => {
    const parent = (clone as HTMLElement).closest('.shape, .icon') as HTMLElement;
    if (!parent) return;
    if (parent.dataset.iconFillMode === 'ghoststatic') {
      const ghost = getComputedStyle(parent).getPropertyValue('--svg-ghost-color').trim()
        || getComputedStyle(document.documentElement).getPropertyValue('--neutral-tint').trim()
        || '#ccc';
      const ctx2 = document.createElement('canvas').getContext('2d')!;
      ctx2.fillStyle = ghost;
      (clone as HTMLElement).style.fill = ctx2.fillStyle;
      return;
    }
    const ctx = document.createElement('canvas').getContext('2d')!;
    const raw = getComputedStyle(parent).getPropertyValue('--_color').trim() || getComputedStyle(parent).color;
    ctx.fillStyle = raw;
    (clone as HTMLElement).style.fill = ctx.fillStyle;
  });

  // Shape SVG elements: clear inline fill/stroke so CSS vars update
  // Skip draw-mode origPaths (initDrawIcon set fill:none intentionally)
  // Skip gradient URLs (local gradient stops refreshed separately below)
  document.querySelectorAll('.shape:not(.shape--draw):not([data-icon-fill]) svg g, .shape:not(.shape--draw):not([data-icon-fill]) svg path:not(.icon-fill-morph):not(.icon-draw-overlay), .shape:not(.shape--draw):not([data-icon-fill]) svg circle, .shape:not(.shape--draw):not([data-icon-fill]) svg polygon, .shape:not(.shape--draw):not([data-icon-fill]) svg rect, .shape:not(.shape--draw):not([data-icon-fill]) svg polyline, .shape:not(.shape--draw):not([data-icon-fill]) svg ellipse').forEach(el => {
    const s = (el as HTMLElement).style;
    if (s.fill && !s.fill.includes('url(')) s.removeProperty('fill');
    if (s.stroke && !s.stroke.includes('url(')) s.removeProperty('stroke');
  });

  // Icon SVG: clear inline fill on non-draw, non-overlay paths
  document.querySelectorAll('.icon:not(.icon--draw):not([data-icon-fill]) svg path:not(.icon-fill-morph):not(.icon-draw-overlay)').forEach(el => {
    const s = (el as HTMLElement).style;
    if (s.fill && !s.fill.includes('url(')) s.removeProperty('fill');
    if (s.stroke && !s.stroke.includes('url(')) s.removeProperty('stroke');
  });

  // Fill outline origPaths: re-read stroke color
  document.querySelectorAll('[data-icon-fill-outline] svg path:not(.icon-fill-morph)').forEach(p => {
    const parent = (p as HTMLElement).closest('.shape, .icon') as HTMLElement;
    if (parent) {
      (p as HTMLElement).style.stroke = getComputedStyle(parent).color || 'currentColor';
    }
  });

  // Rainbow scroll: rebuild timelines with fresh colors
  rainbowScrollElements.forEach(r => r.rebuild());

  // Animated gradients: re-copy stops from shared defs
  document.querySelectorAll('linearGradient[data-shared-grad]').forEach(localGrad => {
    const sharedId = localGrad.getAttribute('data-shared-grad');
    if (!sharedId) return;
    const sharedGrad = document.getElementById(sharedId);
    if (!sharedGrad) return;
    localGrad.querySelectorAll('stop').forEach(s => s.remove());
    sharedGrad.querySelectorAll('stop').forEach(s => {
      localGrad.appendChild(s.cloneNode(true));
    });
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', initIconAnimations);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIconAnimations);
  } else {
    initIconAnimations();
  }

  // Theme change via central animation-config (listens to themeChanged + MutationObserver)
  registerThemeCallback(onThemeChange);
}
