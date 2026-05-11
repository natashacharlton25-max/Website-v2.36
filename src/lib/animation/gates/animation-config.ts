/**
 * Animation Config — the gate factory.
 *
 * Every animation entry point calls getAnimationConfig() at TRIGGER TIME
 * (not at init) so it picks up live theme/mode changes. The returned
 * object combines all three mode readers into a single permission
 * check + duration scale set.
 *
 * Hover modes:
 *   full    — normal speed hover transitions
 *   gentle  — 2x slower hover transitions
 *   instant — jump to end state, no transition
 *   none    — no hover response (focus/click still work)
 *
 * Motion modes:
 *   full    — normal speed animations
 *   gentle  — 2x slower animations
 *   none    — no animations at all
 */
import { getMotionMode, getHoverMode, getRenderMode, getSpeedMode } from './mode-readers';
import type { MotionMode, HoverMode, RenderMode, SpeedMode } from './mode-readers';

/** User-pref speed multipliers. fast=0.75 (just-a-bit-faster, won't make
 *  anything imperceptible), normal=1.0, gentle=1.5, slow=2.0. */
const SPEED_SCALE: Record<SpeedMode, number> = {
  fast: 0.75,
  normal: 1,
  gentle: 1.5,
  slow: 2,
};

export interface AnimationConfig {
  motion: MotionMode;
  hover: HoverMode;
  render: RenderMode;
  speed: SpeedMode;
  /** Whether any animation should play */
  canAnimate: boolean;
  /** Whether hover animations should fire on mouseenter */
  canHover: boolean;
  /** Whether hover should be instant (jump to end state) */
  isInstant: boolean;
  /** Whether animation/hover should be slowed down */
  isGentle: boolean;
  /** Reduced mode — viewport stagger queue, gentle speed, no hover triggers */
  isReduced: boolean;
  /** Base duration multiplier — combines render-mode baseline with the
   *  user's data-anim-speed override. full+normal=1, reduced+normal=2,
   *  full+slow=2, reduced+slow=4. Multiply any animation timing
   *  (setTimeout, GSAP duration, fade transition) by this for it to
   *  respect the speed gate. */
  durationScale: number;
  /** Hover duration multiplier: 0 for instant, 1 for full, 2 for gentle */
  hoverDurationScale: number;
  /** User-pref speed scale alone (not combined with render mode).
   *  Useful if you need to compose it differently. */
  speedScale: number;
  /** Computed duration: baseDuration * durationScale */
  duration: (baseDuration?: number) => number;
  /** Computed hover duration: baseDuration * hoverDurationScale */
  hoverDuration: (baseDuration?: number) => number;
}

export function getAnimationConfig(): AnimationConfig {
  const motion = getMotionMode();
  const hover = getHoverMode();
  const render = getRenderMode();
  const speed = getSpeedMode();
  const isReduced = render === 'reduced';
  // Reduced mode forces gentle speed
  const isGentle = isReduced || motion === 'gentle' || hover === 'gentle';
  // Render/motion baseline: 1 for full, 2 for gentle/reduced
  const baselineScale = isReduced ? 2 : motion === 'gentle' ? 2 : 1;
  const speedScale = SPEED_SCALE[speed];
  // User pref stacks multiplicatively. fast (0.75) can speed up gentle
  // mode (2 × 0.75 = 1.5) but can't go below the user's intent —
  // someone who picked "slow" wants slow even in full render mode.
  const durationScale = baselineScale * speedScale;
  const hoverBaseline = hover === 'instant' ? 0 : (isReduced || hover === 'gentle') ? 2 : 1;
  const hoverDurationScale = hoverBaseline === 0 ? 0 : hoverBaseline * speedScale;

  return {
    motion,
    hover,
    render,
    speed,
    canAnimate: motion !== 'none' && render !== 'textonly',
    canHover: hover !== 'none' && !isReduced,
    isInstant: hover === 'instant',
    isGentle,
    isReduced,
    durationScale,
    hoverDurationScale,
    speedScale,
    duration: (base = 2) => base * durationScale,
    hoverDuration: (base = 0.3) => base * hoverDurationScale,
  };
}
