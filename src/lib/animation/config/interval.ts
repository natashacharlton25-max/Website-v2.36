/**
 * Interval tokens — gap between attention-pulse animations.
 *
 * Used by atoms with repeating animation triggers (Icon threeloop,
 * LottieIcon threeloop, future Shape pulse) to give a consistent
 * "attention pause" duration across the system.
 *
 * Values are in seconds (GSAP/Lottie units). Multiply by 1000 for ms.
 *
 * Authors choose by intent (short/base/long/longer) rather than picking
 * raw seconds. The actual played duration is scaled at fire time by
 * getAnimationConfig().durationScale so motion=gentle = 2× longer
 * intervals automatically.
 */

export const INTERVAL_TOKENS = {
  short:   1.5,
  base:    3,
  long:    5,
  longer:  8,
} as const;

export type IntervalToken = keyof typeof INTERVAL_TOKENS;

/**
 * Resolve an interval token name to a duration in seconds, scaled by
 * the current motion mode. gentle → 2× the base value (longer pause).
 * Read at fire time, not at init, so theme/mode changes pick up live.
 */
export function getIntervalSeconds(token: IntervalToken = 'base', durationScale = 1): number {
  return INTERVAL_TOKENS[token] * durationScale;
}
