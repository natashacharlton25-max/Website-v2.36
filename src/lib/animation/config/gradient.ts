/**
 * Gradient animation config — single source for the slow/default/fast
 * speed mapping used by Badge, Heading, Icon, Shape (any atom with
 * gradientAnimated). Schemas declare the names; this map owns the
 * seconds. GSAP reads numbers, not CSS vars, so this stays in TS.
 */

export const GRADIENT_ANIMATION_SPEED = {
  slow: 20,
  default: 12,
  fast: 6,
} as const;

export type GradientAnimationSpeed = keyof typeof GRADIENT_ANIMATION_SPEED;

// NOTE: legacy --_grad-anim-delay was a per-instance random CSS var to
// desync gradient animations on the same page. Removed — both micro.ts and
// gradient.ts now apply phase desync at the GSAP level via tl.progress(),
// so the CSS variable was never actually consumed. Don't reintroduce.
