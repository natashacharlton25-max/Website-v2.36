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

  // ─── Viewport trigger ───
  // Plays continuously while element is in viewport, stops when out.
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

  // ─── Interval trigger ───
  // Plays animation once per interval, only while visible.
  const intervalEls = document.querySelectorAll<HTMLElement>('[data-anim-trigger="interval"]');
  if (intervalEls.length > 0) {
    const intervalObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          // Start interval when visible
          if (!el.dataset._intervalId) {
            const ms = parseInt(el.dataset.animInterval || '3000', 10);
            const id = setInterval(() => {
              el.classList.remove('anim--playing');
              void el.offsetWidth;
              el.classList.add('anim--playing');
            }, ms);
            el.dataset._intervalId = String(id);
            // Play once immediately
            el.classList.add('anim--playing');
          }
        } else {
          // Stop interval when not visible
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

  // ─── Click trigger ───
  const clickEls = document.querySelectorAll<HTMLElement>('[data-anim-trigger="click"]');
  clickEls.forEach(el => {
    el.addEventListener('click', () => {
      el.classList.remove('anim--playing');
      void el.offsetWidth;
      el.classList.add('anim--playing');
    });
  });

  // ─── Focus trigger ───
  const focusEls = document.querySelectorAll<HTMLElement>('[data-anim-trigger="focus"]');
  focusEls.forEach(el => {
    el.addEventListener('focusin', () => el.classList.add('anim--playing'));
    el.addEventListener('focusout', () => el.classList.remove('anim--playing'));
  });
}

// Init on load + Astro page transitions
document.addEventListener('DOMContentLoaded', initAnimTriggers);
document.addEventListener('astro:page-load', initAnimTriggers);
