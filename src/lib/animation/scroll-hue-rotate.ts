/**
 * Scroll Hue-Rotate
 * src/lib/animation/scroll-hue-rotate.ts
 *
 * Rotates .parallax-decor hue through the colour wheel as the page scrolls.
 * Side-effect import — auto-inits on DOMContentLoaded / astro:page-load.
 *
 * Uses animation-config for motion checks, scroll container, and theme change.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  getAnimationConfig, getScrollContainer, onThemeChange,
} from './animation-config';

gsap.registerPlugin(ScrollTrigger);

/* ---- State ---- */

let hueTriggers: ScrollTrigger[] = [];

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

  const config = getAnimationConfig();
  if (!config.canAnimate) return;

  const osViewport = getScrollContainer();

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

/* ---- React to motion/theme changes via central config ---- */

onThemeChange(() => {
  if (!getAnimationConfig().canAnimate) {
    destroyScrollHue();
  } else if (hueTriggers.length === 0) {
    initScrollHue();
  }
});

/* ---- Auto-init ---- */

function setup(): void {
  setTimeout(() => {
    initScrollHue();
  }, 450);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
document.addEventListener('astro:page-load', setup);
