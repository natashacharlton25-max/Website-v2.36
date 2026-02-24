/**
 * Icon Animation Initialiser
 * src/lib/animation/icon-animation.ts
 *
 * Picks up data-icon-draw and data-icon-morph attributes from Icon.astro
 * and wires up DrawSVG / MorphSVG animations.
 *
 * Icon.astro outputs data attributes at build time but includes no script —
 * this keeps it lightweight (not every page needs GSAP). Import this module
 * on pages that use draw/morph icons.
 *
 * A11y: skips init if reduce-motion is active.
 */

import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, ScrollTrigger);

type DrawVariant = 'draw' | 'drawcenter' | 'chachaslide' | 'flashgordon' | 'rainbowchase' | 'pulse';

function prefersReducedMotion(): boolean {
  const wrapper = document.querySelector('#a11y-content-wrapper');
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    wrapper?.classList.contains('a11y-reduce-motion') === true ||
    wrapper?.classList.contains('a11y-text-only') === true;
}

/* ================================================================
   DRAW ICONS
   Original filled icon stays visible at all times.
   Stroke overlay clones animate on hover, then hide on leave.
   ================================================================ */

function initDrawIcon(el: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;

  // Base paths (stroke outlines) — leave visible, clone for overlays
  const origPaths = Array.from(
    svg.querySelectorAll('path:not(.icon-draw-overlay), circle:not(.icon-draw-overlay), polygon:not(.icon-draw-overlay), polyline:not(.icon-draw-overlay)')
  ).filter(p => p.tagName.toLowerCase() !== 'rect') as SVGPathElement[];
  if (!origPaths.length) return;

  const variant = (el.dataset.iconDraw as DrawVariant) || 'draw';
  const onScroll = el.dataset.iconDrawScroll === 'true';
  const scrub = el.dataset.iconDrawScrub === 'true';
  // Overlay color: use explicit drawColor, or brand accent (contrasts with the white outline)
  const cs = getComputedStyle(document.documentElement);
  const color = el.dataset.iconDrawColor ||
    cs.getPropertyValue('--brand-c-secondary').trim() || '#c4907c';
  const sw = 10; // stroke width in 256-unit viewBox — thin enough for crisp rendering

  // Detect OverlayScrollbars viewport
  const osViewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]') || undefined;

  // Clone each path as a stroke overlay (hidden initially)
  const overlays: SVGPathElement[] = [];
  origPaths.forEach(p => {
    const clone = p.cloneNode(true) as SVGPathElement;
    clone.classList.add('icon-draw-overlay');
    gsap.set(clone, { fill: 'none', stroke: color, strokeWidth: sw, drawSVG: '0%', opacity: 0 });
    p.parentNode!.appendChild(clone);
    overlays.push(clone);
  });

  if (onScroll) {
    if (scrub) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller: osViewport || undefined,
          start: 'top 80%',
          end: 'top 30%',
          scrub: true,
        },
      });
      overlays.forEach((o, i) => {
        const from = variant === 'drawcenter' ? '50% 50%' : '0%';
        const to = variant === 'drawcenter' ? '0% 100%' : '100%';
        tl.set(o, { opacity: 1 }, 0);
        tl.fromTo(o, { drawSVG: from }, { drawSVG: to, duration: 1, ease: 'none' }, i * 0.1);
      });
    } else {
      ScrollTrigger.create({
        trigger: el,
        scroller: osViewport || undefined,
        start: 'top 80%',
        once: true,
        onEnter: () => playDraw(overlays, variant, color),
      });
    }
  } else {
    // Hover-triggered
    const trigger = el.closest('button, a') || el;
    trigger.addEventListener('mouseenter', () => playDraw(overlays, variant, color));
    trigger.addEventListener('mouseleave', () => resetDraw(overlays));
  }
}

function playDraw(overlays: SVGPathElement[], variant: DrawVariant, color: string) {
  const tl = gsap.timeline();
  const d = 0.5;
  const sw = 10;

  // Show overlays
  overlays.forEach(o => gsap.set(o, { opacity: 1 }));

  overlays.forEach((path) => {
    switch (variant) {
      case 'draw':
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: sw },
          { drawSVG: '100%', duration: d, ease: 'power2.inOut' }, 0);
        break;
      case 'drawcenter':
        tl.fromTo(path,
          { drawSVG: '50% 50%', stroke: color, strokeWidth: sw },
          { drawSVG: '0% 100%', duration: d, ease: 'power2.inOut' }, 0);
        break;
      case 'pulse':
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: sw * 1.5, opacity: 0.8 },
          { drawSVG: '100%', duration: d * 0.5, ease: 'power2.out' }, 0)
          .to(path, { strokeWidth: sw, opacity: 1, duration: d * 0.5 }, d * 0.5);
        break;
      case 'chachaslide':
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: sw },
          { drawSVG: '100%', duration: d * 0.5, ease: 'power1.in' }, 0)
          .fromTo(path,
            { drawSVG: '100% 100%' },
            { drawSVG: '0% 100%', duration: d * 0.5, ease: 'power1.in' }, d * 0.5);
        break;
      case 'flashgordon': {
        const q = d / 3;
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: sw },
          { drawSVG: '100%', duration: q, ease: 'none' }, 0)
          .fromTo(path,
            { drawSVG: '100% 100%' },
            { drawSVG: '0% 0%', duration: q, ease: 'none' }, q)
          .fromTo(path,
            { drawSVG: '0% 0%' },
            { drawSVG: '0% 100%', duration: q, ease: 'none' }, q * 2);
        break;
      }
      case 'rainbowchase': {
        const parent = path.parentNode;
        if (!parent) break;
        const cs = getComputedStyle(document.documentElement);
        const rainbow = [
          cs.getPropertyValue('--zone-pattern-primary').trim() || '#5e6f5a',
          cs.getPropertyValue('--zone-pattern-secondary').trim() || '#856356',
          cs.getPropertyValue('--zone-pattern-earth').trim() || '#756a4a',
          cs.getPropertyValue('--zone-pattern-dusk').trim() || '#6d677e',
        ];
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: sw },
          { drawSVG: '100%', duration: d * 2, ease: 'power1.in' }, 0);
        rainbow.forEach((c, i) => {
          const seg = path.cloneNode(true) as SVGPathElement;
          seg.classList.add('icon-draw-segment');
          gsap.set(seg, { stroke: c, strokeWidth: sw * 1.5, fill: 'none', drawSVG: '0% 15%', opacity: 1 });
          parent.insertBefore(seg, path.nextSibling);
          tl.fromTo(seg,
            { drawSVG: '0% 15%' },
            { drawSVG: '85% 100%', duration: d * 2, ease: 'linear' }, i * 0.06)
            .to(seg, { opacity: 0, duration: 0.2 }, d * 2);
        });
        break;
      }
    }
  });
}

function resetDraw(overlays: SVGPathElement[]) {
  // Remove rainbow segments
  overlays[0]?.closest('svg')?.querySelectorAll('.icon-draw-segment').forEach(s => s.remove());

  // Hide overlays back to 0%
  overlays.forEach(o => {
    gsap.to(o, { drawSVG: '0%', opacity: 0, duration: 0.3, ease: 'power2.inOut' });
  });
}

/* ================================================================
   MORPH ICONS
   ================================================================ */

function initMorphIcon(el: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;

  const paths = Array.from(svg.querySelectorAll('path')) as SVGPathElement[];
  if (!paths.length) return;

  const morphTargetHTML = el.dataset.iconMorphTarget;
  if (!morphTargetHTML) return;

  const morphColor = el.dataset.iconMorphColor;

  // Parse target SVG
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = morphTargetHTML;
  const targetPaths = Array.from(tempDiv.querySelectorAll('path')) as SVGPathElement[];
  if (!targetPaths.length) return;

  // Get colours
  const computedStyle = getComputedStyle(el);
  const originalFill = computedStyle.color || '#fff';
  const targetFill = morphColor || originalFill;

  // Store original path data
  paths.forEach(p => {
    (p as any)._originalD = p.getAttribute('d');
  });

  let morphed = false;
  let tl: gsap.core.Timeline | null = null;

  const morph = () => {
    if (tl) tl.kill();
    tl = gsap.timeline();

    paths.forEach((path, i) => {
      const target = targetPaths[i];
      if (!target) return;

      if (!morphed) {
        tl!.to(path, {
          morphSVG: { shape: target, type: 'rotational' },
          fill: targetFill,
          duration: 0.4,
          ease: 'power2.inOut',
        }, 0);
      } else {
        tl!.to(path, {
          morphSVG: { shape: (path as any)._originalD, type: 'rotational' },
          fill: originalFill,
          duration: 0.4,
          ease: 'power2.inOut',
        }, 0);
      }
    });

    morphed = !morphed;
  };

  const trigger = el.closest('button, a') || el;
  trigger.addEventListener('mouseenter', () => { if (!morphed) morph(); });
  trigger.addEventListener('mouseleave', () => { if (morphed) morph(); });
}

/* ================================================================
   INIT
   ================================================================ */

export function initIconAnimations() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll<HTMLElement>('[data-icon-draw]').forEach(initDrawIcon);
  document.querySelectorAll<HTMLElement>('[data-icon-morph]').forEach(initMorphIcon);
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', initIconAnimations);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIconAnimations);
  } else {
    initIconAnimations();
  }
}
