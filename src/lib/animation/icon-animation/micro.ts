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
 * Convert CSS micro-animations and gradient animations to GSAP,
 * registered through the global trigger system. Call once on page load.
 */
export function initMicroAnimations() {
  // 1. Named animations (anim--bounce, anim--spin, etc.)
  document.querySelectorAll<HTMLElement>('[class*="anim--"]').forEach(el => {
    const animClass = [...el.classList].find(cls => cls.startsWith('anim--') && cls !== 'anim--playing');
    if (!animClass) return;

    const animName = animClass.replace('anim--', '');
    const builder = ANIMATIONS[animName];
    if (!builder) return;

    const trigger = el.dataset.animTrigger || 'hover';

    // Strip CSS animation — GSAP owns this now
    el.classList.remove(animClass);
    el.classList.remove('anim--playing');
    el.style.animationName = 'none';

    registerTrigger({
      el,
      trigger,
      onEnter: () => builder(el),
      onStatic: () => {},
    });
  });

  // 2. Gradient flow animations (gradient--animated on CSS-rendered elements)
  //    SVG gradient rotation is handled by gradient.ts — this covers CSS background-position
  document.querySelectorAll<HTMLElement>('.gradient--animated:not([data-icon-grad-anim])').forEach(el => {
    const dur = parseFloat(getComputedStyle(el).getPropertyValue('--_grad-anim-duration') || '') || 12;
    const phase = Math.random();

    // Kill CSS animation
    el.style.animationName = 'none';

    // Determine what to tween based on variant
    const isOutline = el.classList.contains('gradient--outline');
    const gradText = el.querySelector('.gradient__text') as HTMLElement;
    if (gradText) gradText.style.animationName = 'none';

    const playGradFlow = () => {
      const tl = gsap.timeline();
      if (isOutline) {
        // Border flow: animate background-position of the border-box gradient
        tl.fromTo(el,
          { backgroundPosition: '0 0, 0% 0%' },
          { backgroundPosition: '0 0, 100% 100%', duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }
        );
      } else {
        // Fill/glass: sway background-position
        tl.fromTo(el,
          { backgroundPosition: '0% 0%' },
          { backgroundPosition: '100% 100%', duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }
        );
      }
      if (gradText) {
        tl.fromTo(gradText,
          { backgroundPosition: '0% 0%' },
          { backgroundPosition: '100% 100%', duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 },
          0
        );
      }
      tl.progress(phase); // desync
      return tl;
    };

    registerTrigger({
      el,
      trigger: 'autoplay',
      onEnter: playGradFlow,
      onStatic: () => {},
    });
  });

  // 3. Text highlight cycle (text-highlight--cycle)
  document.querySelectorAll<HTMLElement>('.text-highlight--cycle').forEach(el => {
    const dur = parseFloat(getComputedStyle(el).getPropertyValue('--_grad-anim-duration') || '') || 8;
    const cs = getComputedStyle(el);
    const tint = cs.getPropertyValue('--_tier-tint').trim();
    const mid = cs.getPropertyValue('--_tier-mid').trim();
    const base = cs.getPropertyValue('--_color').trim();
    if (!tint || !mid || !base) return;

    el.style.animationName = 'none';

    const playCycle = () => {
      const segDur = dur / 3;
      return gsap.timeline()
        .to(el, { '--_highlight-bg': mid, duration: segDur, ease: 'sine.inOut' })
        .to(el, { '--_highlight-bg': base, duration: segDur, ease: 'sine.inOut' })
        .to(el, { '--_highlight-bg': tint, duration: segDur, ease: 'sine.inOut' });
    };

    registerTrigger({
      el,
      trigger: 'autoplay',
      onEnter: playCycle,
      onStatic: () => {},
    });
  });

  // 4. Underline/divider animated gradients
  document.querySelectorAll<HTMLElement>('.underline--animated, .divider--animated').forEach(el => {
    const isDivider = el.classList.contains('divider--animated');
    const dur = 6;

    el.style.animationName = 'none';

    const playFlow = () => {
      if (isDivider) {
        return gsap.timeline().fromTo(el,
          { backgroundPosition: '0% 0%' },
          { backgroundPosition: '0% 100%', duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }
        );
      }
      return gsap.timeline().fromTo(el,
        { backgroundPosition: '0% 0%' },
        { backgroundPosition: '100% 0%', duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 }
      );
    };

    registerTrigger({
      el,
      trigger: 'autoplay',
      onEnter: playFlow,
      onStatic: () => {},
    });
  });

  // 5. Colour cycle animations (gradient--cycle on CSS-rendered elements)
  document.querySelectorAll<HTMLElement>('.gradient--cycle:not([data-icon-grad-anim])').forEach(el => {
    const dur = parseFloat(getComputedStyle(el).getPropertyValue('--_grad-anim-duration') || '') || 20;
    const isSvg = el.classList.contains('shape--svg');

    // Kill CSS animation
    el.style.animationName = 'none';
    if (isSvg) {
      const svgG = el.querySelector('.shape__svg g') as HTMLElement;
      if (svgG) svgG.style.animationName = 'none';
    }

    // Read cycle tokens
    const cs = getComputedStyle(el);
    const a = cs.getPropertyValue('--_cycle-a').trim() || cs.getPropertyValue('--_tier-tint').trim();
    const b = cs.getPropertyValue('--_cycle-b').trim() || cs.getPropertyValue('--_color').trim();
    const c = cs.getPropertyValue('--_cycle-c').trim() || cs.getPropertyValue('--_tier-emphasis').trim();

    if (!a || !b || !c) return;

    const playCycle = () => {
      const tl = gsap.timeline();
      const segDur = dur / 3;

      if (isSvg) {
        // SVG: animate fill on the <g>
        const svgG = el.querySelector('.shape__svg g') as HTMLElement;
        if (svgG) {
          tl.to(svgG, { fill: b, duration: segDur, ease: 'sine.inOut' })
            .to(svgG, { fill: c, duration: segDur, ease: 'sine.inOut' })
            .to(svgG, { fill: a, duration: segDur, ease: 'sine.inOut' });
        }
      } else {
        // CSS: animate background-color
        tl.to(el, { backgroundColor: b, duration: segDur, ease: 'sine.inOut' })
          .to(el, { backgroundColor: c, duration: segDur, ease: 'sine.inOut' })
          .to(el, { backgroundColor: a, duration: segDur, ease: 'sine.inOut' });
      }
      return tl;
    };

    registerTrigger({
      el,
      trigger: 'autoplay',
      onEnter: playCycle,
      onStatic: () => {},
    });
  });
}
