/**
 * Scroll Hue-Rotate
 * src/lib/animation/scroll-hue-rotate.ts
 *
 * Rotates .parallax-decor hue through the colour wheel as the page scrolls.
 * Side-effect import — auto-inits on DOMContentLoaded / astro:page-load.
 *
 * Respects reduce-motion (a11y panel + OS preference).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ---- A11y ---- */

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('a11y-reduce-motion');
}

/* ---- State ---- */

let hueTriggers: ScrollTrigger[] = [];
let hueObserver: MutationObserver | null = null;

/* ---- Core ---- */

function destroyScrollHue(): void {
  hueTriggers.forEach(st => st.kill());
  hueTriggers = [];
  document.querySelectorAll<HTMLElement>('.parallax-decor').forEach(decor => {
    gsap.set(decor, { filter: 'none' });
  });
}

function initScrollHue(): void {
  destroyScrollHue();

  if (prefersReducedMotion()) return;

  const osViewport =
    document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]') || undefined;

  document.querySelectorAll<HTMLElement>('.parallax-decor').forEach((decor) => {
    const tween = gsap.to(decor, {
      filter: 'hue-rotate(360deg)',
      ease: 'none',
      scrollTrigger: {
        trigger: decor,
        scroller: osViewport,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
    if (tween.scrollTrigger) hueTriggers.push(tween.scrollTrigger);
  });
}

/* ---- A11y watcher ---- */

function watchA11y(): void {
  hueObserver?.disconnect();

  hueObserver = new MutationObserver(() => {
    if (prefersReducedMotion()) {
      destroyScrollHue();
    } else if (hueTriggers.length === 0) {
      initScrollHue();
    }
  });

  hueObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) destroyScrollHue();
    else initScrollHue();
  });
}

/* ---- Auto-init ---- */

function setup(): void {
  setTimeout(() => {
    initScrollHue();
    watchA11y();
  }, 450);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
document.addEventListener('astro:page-load', setup);
