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

/**
 * Desync window for gradient animations. Each atom instance picks a random
 * negative delay in [0, GRADIENT_DESYNC_WINDOW_SECONDS) so multiple animated
 * gradients on the same page don't lockstep. Shared across atoms so they
 * all desync from the same scale.
 */
export const GRADIENT_DESYNC_WINDOW_SECONDS = 8;

/** Returns a randomised CSS-var declaration: `--_grad-anim-delay:-N.NNs`. */
export function randomGradientDelayVar(): string {
  const offset = Math.random() * GRADIENT_DESYNC_WINDOW_SECONDS;
  return `--_grad-anim-delay:-${offset.toFixed(2)}s`;
}
