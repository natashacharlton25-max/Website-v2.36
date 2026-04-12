/**
 * Micro-animations — GSAP versions of CSS keyframe presets
 *
 * Replaces CSS @keyframes with GSAP tweens so all animation goes
 * through registerTrigger → reduced mode queue works automatically.
 *
 * Each animation returns a gsap.core.Timeline.
 */

import { gsap } from 'gsap';
import { registerTrigger } from '../animation-config';

// ─── Animation builders ─────────────────────────────────
// Each returns a function that creates and returns a timeline.

type AnimBuilder = (el: HTMLElement) => gsap.core.Timeline;

const ANIMATIONS: Record<string, AnimBuilder> = {
  // Movement
  spin: (el) => gsap.timeline().to(el, { rotation: 360, duration: 2, ease: 'none', repeat: 0 }),
  bounce: (el) => gsap.timeline()
    .to(el, { y: -6, duration: 0.15, ease: 'power2.out' })
    .to(el, { y: 0, duration: 0.15, ease: 'bounce.out' })
    .to(el, { y: -3, duration: 0.1, ease: 'power2.out' })
    .to(el, { y: 0, duration: 0.15, ease: 'bounce.out' }),
  shake: (el) => gsap.timeline()
    .to(el, { x: -2, rotation: -3, duration: 0.06 })
    .to(el, { x: 2, rotation: 3, duration: 0.06 })
    .to(el, { x: -2, rotation: -2, duration: 0.06 })
    .to(el, { x: 2, rotation: 2, duration: 0.06 })
    .to(el, { x: -1, rotation: -1, duration: 0.06 })
    .to(el, { x: 0, rotation: 0, duration: 0.1, ease: 'power2.out' }),
  float: (el) => gsap.timeline()
    .to(el, { y: -7, scale: 1.02, duration: 1.5, ease: 'sine.inOut' })
    .to(el, { y: 0, scale: 1, duration: 1.5, ease: 'sine.inOut' }),
  drift: (el) => gsap.timeline()
    .to(el, { x: 3, y: -4, duration: 1, ease: 'sine.inOut' })
    .to(el, { x: -2, y: -6, duration: 1, ease: 'sine.inOut' })
    .to(el, { x: 1, y: -3, duration: 1, ease: 'sine.inOut' })
    .to(el, { x: 0, y: 0, duration: 1, ease: 'sine.inOut' }),
  'slide-up': (el) => gsap.timeline().fromTo(el, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }),
  'slide-down': (el) => gsap.timeline().fromTo(el, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }),
  'slide-left': (el) => gsap.timeline().fromTo(el, { x: 12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }),
  'slide-right': (el) => gsap.timeline().fromTo(el, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }),
  flip: (el) => gsap.timeline()
    .to(el, { rotationY: 180, duration: 0.4, ease: 'power2.in' })
    .to(el, { rotationY: 360, duration: 0.4, ease: 'power2.out' }),

  // Scale
  pulse: (el) => gsap.timeline()
    .to(el, { scale: 1.12, duration: 0.15, ease: 'power2.out' })
    .to(el, { scale: 0.97, duration: 0.1 })
    .to(el, { scale: 1.05, duration: 0.1 })
    .to(el, { scale: 1, duration: 0.15, ease: 'power2.out' }),
  ping: (el) => gsap.timeline()
    .to(el, { scale: 1.25, opacity: 0.7, duration: 0.2, ease: 'power2.out' })
    .to(el, { scale: 0.95, opacity: 1, duration: 0.15 })
    .to(el, { scale: 1, duration: 0.15, ease: 'power2.out' }),
  pop: (el) => gsap.timeline()
    .fromTo(el, { scale: 0.8, opacity: 0 }, { scale: 1.08, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' })
    .to(el, { scale: 1, duration: 0.2, ease: 'power2.out' }),
  squish: (el) => gsap.timeline()
    .to(el, { scaleX: 1.1, scaleY: 0.9, duration: 0.15 })
    .to(el, { scaleX: 0.93, scaleY: 1.07, duration: 0.1 })
    .to(el, { scaleX: 1.03, scaleY: 0.97, duration: 0.1 })
    .to(el, { scaleX: 1, scaleY: 1, duration: 0.15, ease: 'power2.out' }),
  heartbeat: (el) => gsap.timeline()
    .to(el, { scale: 1.14, duration: 0.1, ease: 'power2.out' })
    .to(el, { scale: 1, duration: 0.1 })
    .to(el, { scale: 1.1, duration: 0.1, ease: 'power2.out' })
    .to(el, { scale: 1, duration: 0.3 }),
  'rubber-band': (el) => gsap.timeline()
    .to(el, { scaleX: 1.15, scaleY: 0.85, duration: 0.12 })
    .to(el, { scaleX: 0.85, scaleY: 1.15, duration: 0.08 })
    .to(el, { scaleX: 1.08, scaleY: 0.92, duration: 0.08 })
    .to(el, { scaleX: 1, scaleY: 1, duration: 0.15, ease: 'power2.out' }),

  // Opacity
  fade: (el) => gsap.timeline().fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }),
  blink: (el) => gsap.timeline()
    .to(el, { opacity: 0, duration: 0.3 })
    .to(el, { opacity: 1, duration: 0.3 })
    .to(el, { opacity: 0, duration: 0.3 })
    .to(el, { opacity: 1, duration: 0.3 }),
  flash: (el) => gsap.timeline()
    .to(el, { opacity: 0, duration: 0.15 })
    .to(el, { opacity: 1, duration: 0.15 })
    .to(el, { opacity: 0, duration: 0.15 })
    .to(el, { opacity: 1, duration: 0.15 }),
  glint: (el) => gsap.timeline()
    .to(el, { filter: 'brightness(1.5) drop-shadow(0 0 4px currentColor)', duration: 0.3, ease: 'power2.out' })
    .to(el, { filter: 'brightness(1.2) drop-shadow(0 0 8px currentColor)', duration: 0.3 })
    .to(el, { filter: 'brightness(1) drop-shadow(0 0 0 transparent)', duration: 0.4, ease: 'power2.in' }),
  shimmer: (el) => gsap.timeline()
    .to(el, { filter: 'brightness(1.3)', duration: 0.5 })
    .to(el, { filter: 'brightness(1)', duration: 0.5 })
    .to(el, { filter: 'brightness(1.2)', duration: 0.5 })
    .to(el, { filter: 'brightness(1)', duration: 0.5 }),
  twinkle: (el) => gsap.timeline()
    .to(el, { opacity: 0.4, scale: 0.8, duration: 0.6, ease: 'sine.inOut' })
    .to(el, { opacity: 1, scale: 1, duration: 0.6, ease: 'sine.inOut' }),

  // Rotation
  wiggle: (el) => gsap.timeline()
    .to(el, { rotation: -10, duration: 0.08 })
    .to(el, { rotation: 8, duration: 0.08 })
    .to(el, { rotation: -6, duration: 0.08 })
    .to(el, { rotation: 4, duration: 0.08 })
    .to(el, { rotation: -2, duration: 0.08 })
    .to(el, { rotation: 0, duration: 0.1, ease: 'power2.out' }),
  swing: (el) => {
    gsap.set(el, { transformOrigin: 'top center' });
    return gsap.timeline()
      .to(el, { rotation: 10, duration: 0.2 })
      .to(el, { rotation: -8, duration: 0.2 })
      .to(el, { rotation: 4, duration: 0.2 })
      .to(el, { rotation: -2, duration: 0.2 })
      .to(el, { rotation: 0, duration: 0.2, ease: 'power2.out' });
  },
  rock: (el) => gsap.timeline()
    .to(el, { rotation: 12, duration: 0.5, ease: 'sine.inOut' })
    .to(el, { rotation: -12, duration: 1, ease: 'sine.inOut' })
    .to(el, { rotation: 0, duration: 0.5, ease: 'sine.inOut' }),
  nod: (el) => gsap.timeline()
    .to(el, { y: -4, duration: 0.2, ease: 'power2.out' })
    .to(el, { y: 2, duration: 0.15 })
    .to(el, { y: 0, duration: 0.15, ease: 'power2.out' }),

  // Compound
  attention: (el) => gsap.timeline()
    .to(el, { scale: 1.06, x: -2, duration: 0.1 })
    .to(el, { x: 2, duration: 0.1 })
    .to(el, { scale: 1.03, x: -1, duration: 0.1 })
    .to(el, { scale: 1, x: 0, duration: 0.15, ease: 'power2.out' }),
  celebrate: (el) => gsap.timeline()
    .to(el, { scale: 1.18, rotation: -8, duration: 0.15, ease: 'back.out(1.7)' })
    .to(el, { rotation: 8, duration: 0.15 })
    .to(el, { scale: 1.1, rotation: -4, duration: 0.12 })
    .to(el, { scale: 1, rotation: 0, duration: 0.2, ease: 'power2.out' }),
  enter: (el) => gsap.timeline().fromTo(el, { y: 12, scale: 0.9, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' }),
  exit: (el) => gsap.timeline().to(el, { y: -12, scale: 0.9, opacity: 0, duration: 0.5, ease: 'expo.out' }),
};

// ─── Init ───────────────────────────────────────────────

/**
 * Convert CSS micro-animations to GSAP and register through
 * the global trigger system. Call once on page load.
 */
export function initMicroAnimations() {
  document.querySelectorAll<HTMLElement>('[class*="anim--"]').forEach(el => {
    // Find which animation this element has
    const animClass = [...el.classList].find(cls => cls.startsWith('anim--') && cls !== 'anim--playing');
    if (!animClass) return;

    const animName = animClass.replace('anim--', '');
    const builder = ANIMATIONS[animName];
    if (!builder) return;

    // Read trigger from data attribute
    const trigger = el.dataset.animTrigger || 'hover';

    // Strip CSS animation classes — GSAP owns this now
    el.classList.remove(animClass);
    el.classList.remove('anim--playing');

    // Register through global trigger system
    registerTrigger({
      el,
      trigger,
      onEnter: () => builder(el),
      onStatic: () => {}, // at rest = no animation
    });
  });
}
