/**
 * Draw morph — sequences two standard draw animations to morph icon A into icon B
 *
 * Used when an element has BOTH `data-icon-draw` and `data-icon-morph-target`.
 * initDrawIcon (in draw.ts) detects this and uses playDrawMorph as its play
 * function instead of the normal playDraw.
 *
 * Three-phase sequence:
 *   Phase 1: Erase icon A — reverse of addVariant (forward draw played backward)
 *   Phase 2: At zero point, swap overlays from icon A to icon B
 *   Phase 3: Draw icon B — standard forward addVariant
 *
 * All animation logic lives in addVariant (draw-shared.ts) — this function
 * just orchestrates the timing and DOM swap.
 */

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { getMotionMode } from '../animation-config';
import { addVariant, type DrawVariant, type DrawMode } from './draw-shared';

export function playDrawMorph(
  el: HTMLElement,
  overlays: SVGPathElement[],
  _origPaths: SVGPathElement[],
  color: string,
  _ghostOpacity: number,
  _isGhostMode: boolean,
  _ghostColor: string,
  variant: DrawVariant = 'draw',
  _mode: DrawMode = 'static',
  laser: boolean = false,
  swOverride: number = 0
): gsap.core.Timeline {
  const motion = getMotionMode();
  if (motion === 'none') return gsap.timeline();
  const d = motion === 'gentle' ? 4 : 2;
  const sw = swOverride || 10;

  // Re-read color fresh (theme may have changed since init)
  if (!color.startsWith('url(')) {
    const fresh = getComputedStyle(el).getPropertyValue('--_color').trim() || getComputedStyle(el).color;
    if (fresh) color = fresh;
  }

  const master = gsap.timeline();

  const svg = overlays[0]?.closest('svg');
  if (!svg) return master;

  // Clean up old temp clones
  svg.querySelectorAll('.icon-draw-chase, .icon-draw-worm, .icon-draw-trail, .icon-draw-static, .icon-draw-morph-b').forEach(n => n.remove());
  overlays.forEach(o => gsap.killTweensOf(o));

  // Parse morph target SVG
  const morphHTML = el.dataset.iconMorphTarget || '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = morphHTML;
  // Convert non-path elements in target
  const targetSvg = tempDiv.querySelector('svg');
  if (targetSvg) {
    targetSvg.querySelectorAll('circle, polygon, polyline, ellipse, line').forEach(e => {
      MorphSVGPlugin.convertToPath(e as any);
    });
    targetSvg.querySelectorAll('rect').forEach(e => {
      const w = e.getAttribute('width');
      const fill = e.getAttribute('fill');
      if (fill === 'none' && (w === '256' || w === '100%')) return;
      MorphSVGPlugin.convertToPath(e as any);
    });
  }
  const targetPathEls = Array.from(tempDiv.querySelectorAll('path')) as SVGPathElement[];

  // Store originals for toggle-back
  if (!(el as any)._morphOrigData) {
    (el as any)._morphOrigData = overlays.map(o => o.getAttribute('d'));
  }
  const isAtTarget = (el as any)._morphAtTarget === true;

  // Which paths to draw next
  const nextPaths = isAtTarget
    ? (el as any)._morphOrigData as string[]
    : targetPathEls.map(p => p.getAttribute('d') || '');

  // ── Phase 1: Erase icon A — reverse of addVariant ──
  // Set overlays to fully drawn state, then build a forward draw tl and play it reversed
  overlays.forEach(o => {
    gsap.set(o, { opacity: 1, stroke: color, strokeWidth: sw, drawSVG: '100%' });
  });
  const eraseTl = gsap.timeline({ paused: true });
  addVariant(eraseTl, overlays, variant, color, color, d, sw, laser, 0, 'start');
  // Reverse: plays the draw animation backwards (100% → 0%) — accelerates into disappearance
  master.add(eraseTl.tweenFromTo(eraseTl.duration(), 0, { duration: d * 0.5, ease: 'power3.in' }), 0);
  // Fade out at end of erase
  master.to(overlays, { opacity: 0, duration: 0.1, ease: 'power2.in' }, d * 0.5 - 0.1);

  // ── Phase 2: At zero point — create icon B overlays and draw them ──
  master.call(() => {
    // Hide icon A overlays
    overlays.forEach(o => gsap.set(o, { opacity: 0 }));

    // Create fresh overlays from icon B paths
    const parent = svg.querySelector('g') || svg;
    const newOverlays: SVGPathElement[] = [];
    nextPaths.forEach(pathD => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', pathD);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', String(sw));
      p.setAttribute('stroke-linejoin', 'round');
      p.setAttribute('stroke-linecap', 'round');
      p.classList.add('icon-draw-overlay', 'icon-draw-morph-b');
      parent.appendChild(p);
      gsap.set(p, { stroke: color, strokeWidth: sw, drawSVG: '0%', opacity: 1 });
      newOverlays.push(p);
    });

    // ── Phase 3: Draw icon B — standard forward addVariant with smooth ease ──
    const drawTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    addVariant(drawTl, newOverlays, variant, color, color, d * 0.6, sw, laser, 0, 'start');
    drawTl.timeScale(0.8);
    drawTl.play();

    // After draw completes: swap references so overlays array points to B
    drawTl.call(() => {
      // Remove old A overlays from DOM
      overlays.forEach(o => o.remove());
      overlays.length = 0;
      newOverlays.forEach(o => {
        o.classList.remove('icon-draw-morph-b');
        overlays.push(o);
      });
      (el as any)._morphAtTarget = !isAtTarget;
    });
  }, [], d * 0.5 + 0.05);

  return master;
}
