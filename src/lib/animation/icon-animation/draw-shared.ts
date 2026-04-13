/**
 * Shared draw helpers
 *
 * Holds the DrawVariant / DrawMode types and the addVariant() helper, which
 * is used by:
 *   - draw.ts (initDrawIcon, playDraw)
 *   - draw-morph.ts (playDrawMorph)
 *   - fill.ts (fillOutline draw-in)
 *
 * Extracted to break the circular dependency that would otherwise exist if
 * these helpers lived inside draw.ts (draw → draw-morph → addVariant).
 */

import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

export type DrawVariant = 'draw' | 'drawcenter' | 'pulse';
// 'fade' kept internally (draw+fade out) but not exposed in JSON schema
export type DrawMode = 'static' | 'yoyo' | 'reverse-yoyo' | 'reveal' | 'fade';

/* Builds a single forward-pass of the draw variant into the given timeline */
export function addVariant(
  tl: gsap.core.Timeline,
  overlays: SVGPathElement[],
  variant: DrawVariant,
  color: string,
  _iconColor: string,
  d: number,
  sw: number,
  laser: boolean,
  staggerTime = 0.3,
  staggerFrom: 'start' | 'center' | 'end' | 'edges' | 'random' = 'start',
  _wormSize = 10
) {
  const pathStagger = overlays.length > 1 ? staggerTime : 0;

  if (laser) {
    // Laser: worm travels, trail draws behind — wormPct controls segment size
    overlays.forEach((path, idx) => {
      const offset = idx * pathStagger;

      // Trail: full line draws behind worm at lower opacity
      gsap.set(path, { strokeWidth: sw, opacity: 0 });
      tl.set(path, { opacity: 0.3 }, offset);
      tl.fromTo(path, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: d, ease: 'power2.inOut'
      }, offset);
      // Fade trail to full opacity after worm passes
      tl.to(path, { opacity: 1, duration: d * 0.4, ease: 'power2.out' }, offset + d * 0.6);

      // Worm: bright segment travels ahead — scales with path length
      const worm = path.cloneNode(true) as SVGPathElement;
      worm.classList.add('icon-draw-worm');
      gsap.set(worm, { fill: 'none', strokeWidth: sw, drawSVG: '0% 0%', opacity: 0 });
      path.parentNode!.appendChild(worm);

      const wormPct = _wormSize;
      const tailPct = 100 - wormPct;

      tl.set(worm, { opacity: 1 }, offset);
      tl.fromTo(worm, { drawSVG: '0% 0%' }, { drawSVG: `0% ${wormPct}%`, duration: d * 0.08, ease: 'power2.out' }, offset);
      tl.fromTo(worm, { drawSVG: `0% ${wormPct}%` }, { drawSVG: `${tailPct}% 100%`, duration: d * 0.84, ease: 'power2.inOut' }, offset + d * 0.08);
      tl.fromTo(worm, { drawSVG: `${tailPct}% 100%` }, { drawSVG: '100% 100%', duration: d * 0.08, ease: 'power2.in' }, offset + d * 0.92);
      tl.set(worm, { opacity: 0 }, offset + d);
    });
    return;
  }

  switch (variant) {
    case 'draw':
      gsap.set(overlays, { strokeWidth: sw });
      tl.fromTo(overlays, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: d, ease: 'power2.inOut',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      break;
    case 'drawcenter':
      gsap.set(overlays, { strokeWidth: sw });
      tl.fromTo(overlays, { drawSVG: '50% 50%' }, {
        drawSVG: '0% 100%', duration: d, ease: 'power2.inOut',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      break;
    case 'pulse':
      gsap.set(overlays, { strokeWidth: sw * 1.5, opacity: 0.8 });
      tl.fromTo(overlays, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: d * 0.5, ease: 'power2.out',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      tl.to(overlays, { strokeWidth: sw, opacity: 1, duration: d * 0.5,
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, d * 0.5);
      break;
  }
}
