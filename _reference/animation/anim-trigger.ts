/**
 * Global animation trigger observer
 *
 * Handles viewport and interval triggers for CSS micro-animations.
 * Adds/removes .anim--playing class which CSS uses to fire the animation.
 *
 * Trigger modes (set via data-anim-trigger attribute on Icon):
 *   hover    — CSS-only, no JS needed (default for interactive elements)
 *   autoplay — CSS-only, plays continuously from load
 *   loop     — CSS-only, plays continuously (alias for autoplay)
 *   viewport — JS: plays continuously while visible, static when scrolled out
 *   interval — JS: plays once on timed interval while visible
 *   click    — JS: plays on click
 *   focus    — JS: plays on focus
 *   none     — dormant, for programmatic control
 *
 * Gating: checks data-render before observing. If reduced/textonly, no observers.
 */

import { getAnimationConfig } from './animation-config';

function initAnimTriggers() {
  const config = getAnimationConfig();
  if (!config.canAnimate) return;

  // Reduced mode: kill all CSS animations — GSAP handles icon/shape motion
  // via registerTrigger queue. CSS animations are decorative (badges, gradients).
  if (config.isReduced) {
    document.querySelectorAll<HTMLElement>('[class*="anim--"]').forEach(el => {
      [...el.classList].forEach(cls => {
        if (cls.startsWith('anim--')) el.classList.remove(cls);
      });
    });
    return;
  }

  // ─── Full mode: original CSS trigger behaviour ───

  // Viewport: plays while visible
  const viewportEls = document.querySelectorAll<HTMLElement>('[data-anim-trigger="viewport"]');
  if (viewportEls.length > 0) {
    requestAnimationFrame(() => {
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim--playing');
          } else {
            entry.target.classList.remove('anim--playing');
          }
        }
      }, { root: null, rootMargin: '0px', threshold: 0.1 });
      viewportEls.forEach(el => observer.observe(el));
    });
  }

  // Interval: plays on timed interval while visible
  const intervalEls = document.querySelectorAll<HTMLElement>('[data-anim-trigger="interval"]');
  if (intervalEls.length > 0) {
    const intervalObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          if (!el.dataset._intervalId) {
            const ms = parseInt(el.dataset.animInterval || '3000', 10);
            const id = setInterval(() => {
              el.classList.remove('anim--playing');
              void el.offsetWidth;
              el.classList.add('anim--playing');
            }, ms);
            el.dataset._intervalId = String(id);
            el.classList.add('anim--playing');
          }
        } else {
          if (el.dataset._intervalId) {
            clearInterval(parseInt(el.dataset._intervalId));
            delete el.dataset._intervalId;
            el.classList.remove('anim--playing');
          }
        }
      }
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    intervalEls.forEach(el => intervalObserver.observe(el));
  }

  // Click
  document.querySelectorAll<HTMLElement>('[data-anim-trigger="click"]').forEach(el => {
    el.addEventListener('click', () => {
      el.classList.remove('anim--playing');
      void el.offsetWidth;
      el.classList.add('anim--playing');
    });
  });

  // Focus
  document.querySelectorAll<HTMLElement>('[data-anim-trigger="focus"]').forEach(el => {
    el.addEventListener('focusin', () => el.classList.add('anim--playing'));
    el.addEventListener('focusout', () => el.classList.remove('anim--playing'));
  });
}

// Init on load + Astro page transitions
document.addEventListener('DOMContentLoaded', initAnimTriggers);
document.addEventListener('astro:page-load', initAnimTriggers);
