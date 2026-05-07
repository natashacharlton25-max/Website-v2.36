/**
 * Gradient animation config — single source for the slow/default/fast
 * speed mapping used by Badge, Heading, Icon (and any other atom with
 * animatedGradient). Schemas declare the names; this map owns the
 * seconds. GSAP reads numbers, not CSS vars, so this stays in TS.
 */

export const GRADIENT_ANIMATION_SPEED = {
  slow: 20,
  default: 12,
  fast: 6,
} as const;

export type GradientAnimationSpeed = keyof typeof GRADIENT_ANIMATION_SPEED;
