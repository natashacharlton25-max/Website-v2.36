/**
 * Trace draw-in — GSAP DrawSVG companion for Burst's tracePathDrawIn
 * mode. Runs alongside whichever burst engine is active (fly / physics
 * / string) and animates the visible trace SVG drawing itself in on the
 * burst trigger after a configurable delay.
 *
 * The Burst atom renders the trace target as a visible <svg> inside the
 * wrapper when tracePathDrawIn is set, with paths converted from fill
 * to stroke. This module finds those rendered targets at init, primes
 * each path's stroke-dasharray to invisible, and on click of the burst
 * wrapper kicks off a DrawSVG timeline.
 *
 * One module per concern: this owns the draw, the engine modules own
 * the particles. They share the click event by both listening on
 * [data-particle-burst] but don't otherwise coordinate.
 */

import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { getAnimationConfig } from './animation-config';

gsap.registerPlugin(DrawSVGPlugin);

/** Prime a SVG path so DrawSVG can animate from 0% drawn → 100% drawn.
 *  Without this, the path renders fully visible while we wait for the
 *  delay to elapse, then snaps to invisible the moment the timeline
 *  starts — looks broken. */
function primePath(p: SVGPathElement): void {
  gsap.set(p, { drawSVG: '0%' });
}

function runDraw(wrapper: HTMLElement): void {
  if (!getAnimationConfig().canAnimate) return;
  const targetSpan = wrapper.querySelector<HTMLElement>('[data-burst-trace-draw-target]');
  if (!targetSpan) return;
  const paths = Array.from(targetSpan.querySelectorAll<SVGPathElement>('path'));
  if (paths.length === 0) return;

  const delay = parseInt(wrapper.getAttribute('data-trace-draw-delay') || '700', 10);
  const duration = parseInt(wrapper.getAttribute('data-trace-draw-duration') || '1200', 10);

  // Prime + animate. gsap.fromTo on drawSVG ensures the from-state lands
  // before the delay starts, so we don't see a flash of the fully-drawn
  // letters during the delay window.
  gsap.fromTo(
    paths,
    { drawSVG: '0%' },
    {
      drawSVG: '100%',
      duration: duration / 1000,
      delay: delay / 1000,
      ease: 'power2.inOut',
      stagger: {
        each: 0.06,
        from: 'start',
      },
    },
  );
}

export function initTraceDraw(): void {
  if (typeof window === 'undefined') return;

  document.querySelectorAll<HTMLElement>('[data-particle-burst][data-trace-draw]').forEach((wrapper) => {
    if (wrapper.hasAttribute('data-trace-draw-bound')) return;
    wrapper.setAttribute('data-trace-draw-bound', 'true');

    // Prime paths up-front so they start invisible from page load — no
    // flash-of-rendered-content before the first click.
    const targetSpan = wrapper.querySelector<HTMLElement>('[data-burst-trace-draw-target]');
    if (targetSpan) {
      targetSpan.querySelectorAll<SVGPathElement>('path').forEach(primePath);
    }

    // Click trigger only for now — hover / hover-hold rebinding can come
    // in the audit/tightening pass. Burst's own trigger prop controls
    // the particle spawn, this trace-draw runs on plain click of the
    // wrapper regardless.
    wrapper.addEventListener('click', () => runDraw(wrapper));
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTraceDraw);
  } else {
    initTraceDraw();
  }
  document.addEventListener('astro:page-load', initTraceDraw);
}
