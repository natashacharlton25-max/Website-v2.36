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
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('a11y-reduce-motion');
}

/* ================================================================
   DRAW ICONS
   ================================================================ */

function initDrawIcon(el: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;

  const paths = Array.from(svg.querySelectorAll('path, circle, polygon, polyline')) as SVGPathElement[];
  if (!paths.length) return;

  const variant = (el.dataset.iconDraw as DrawVariant) || 'draw';
  const onScroll = el.dataset.iconDrawScroll === 'true';
  const scrub = el.dataset.iconDrawScrub === 'true';
  const color = el.dataset.iconDrawColor ||
    getComputedStyle(el).getPropertyValue('--brand-c-primary').trim() || '#fff';

  // Detect OverlayScrollbars viewport
  const osViewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]') || undefined;

  // Set initial hidden state
  paths.forEach(p => gsap.set(p, { drawSVG: '0%' }));

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
      paths.forEach((p, i) => {
        const from = variant === 'drawcenter' ? '50% 50%' : '0%';
        const to = variant === 'drawcenter' ? '0% 100%' : '100%';
        tl.fromTo(p, { drawSVG: from }, { drawSVG: to, duration: 1, ease: 'none' }, i * 0.1);
      });
    } else {
      ScrollTrigger.create({
        trigger: el,
        scroller: osViewport || undefined,
        start: 'top 80%',
        once: true,
        onEnter: () => playDraw(paths, variant, color),
      });
    }
  } else {
    // Hover-triggered
    const trigger = el.closest('button, a') || el;
    trigger.addEventListener('mouseenter', () => playDraw(paths, variant, color));
    trigger.addEventListener('mouseleave', () => resetDraw(paths));
  }
}

function playDraw(paths: SVGPathElement[], variant: DrawVariant, color: string) {
  const tl = gsap.timeline();
  const d = 0.4;

  paths.forEach((path) => {
    switch (variant) {
      case 'draw':
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: 2 },
          { drawSVG: '100%', duration: d, ease: 'power2.inOut' }, 0);
        break;
      case 'drawcenter':
        tl.fromTo(path,
          { drawSVG: '50% 50%', stroke: color, strokeWidth: 2 },
          { drawSVG: '0% 100%', duration: d, ease: 'power2.inOut' }, 0);
        break;
      case 'pulse':
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: 3, opacity: 0.8 },
          { drawSVG: '100%', duration: d * 0.5, ease: 'power2.out' }, 0)
          .to(path, { strokeWidth: 1.5, opacity: 1, duration: d * 0.5 }, d * 0.5);
        break;
      case 'chachaslide':
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: 2 },
          { drawSVG: '100%', duration: d * 0.5, ease: 'power1.in' }, 0)
          .fromTo(path,
            { drawSVG: '100% 100%' },
            { drawSVG: '0% 100%', duration: d * 0.5, ease: 'power1.in' }, d * 0.5);
        break;
      case 'flashgordon': {
        const q = d / 3;
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: 2 },
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
          cs.getPropertyValue('--color-Primary-400').trim() || '#f00',
          cs.getPropertyValue('--color-AccentOne-400').trim() || '#f60',
          cs.getPropertyValue('--color-AccentTwo-400').trim() || '#ff0',
          cs.getPropertyValue('--color-AccentThree-400').trim() || '#0f0',
        ];
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: 1.5 },
          { drawSVG: '100%', duration: d * 2, ease: 'power1.in' }, 0);
        rainbow.forEach((c, i) => {
          const seg = path.cloneNode(true) as SVGPathElement;
          seg.classList.add('icon-draw-segment');
          gsap.set(seg, { stroke: c, strokeWidth: 3, fill: 'none', drawSVG: '0% 15%', opacity: 1 });
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

function resetDraw(paths: SVGPathElement[]) {
  // Remove rainbow segments
  paths[0]?.closest('svg')?.querySelectorAll('.icon-draw-segment').forEach(s => s.remove());

  paths.forEach(p => {
    gsap.to(p, { drawSVG: '0%', duration: 0.3, ease: 'power2.inOut' });
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
