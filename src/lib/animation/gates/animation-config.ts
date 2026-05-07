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
import { getMotionMode, getHoverMode, getRenderMode } from './mode-readers';
import type { MotionMode, HoverMode, RenderMode } from './mode-readers';

export interface AnimationConfig {
  motion: MotionMode;
  hover: HoverMode;
  render: RenderMode;
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
  /** Base duration multiplier: 1 for full, 2 for gentle */
  durationScale: number;
  /** Hover duration multiplier: 0 for instant, 1 for full, 2 for gentle */
  hoverDurationScale: number;
  /** Computed duration: baseDuration * durationScale */
  duration: (baseDuration?: number) => number;
  /** Computed hover duration: baseDuration * hoverDurationScale */
  hoverDuration: (baseDuration?: number) => number;
}

export function getAnimationConfig(): AnimationConfig {
  const motion = getMotionMode();
  const hover = getHoverMode();
  const render = getRenderMode();
  const isReduced = render === 'reduced';
  // Reduced mode forces gentle speed
  const isGentle = isReduced || motion === 'gentle' || hover === 'gentle';
  const durationScale = isReduced ? 2 : motion === 'gentle' ? 2 : 1;
  const hoverDurationScale = hover === 'instant' ? 0 : (isReduced || hover === 'gentle') ? 2 : 1;

  return {
    motion,
    hover,
    render,
    canAnimate: motion !== 'none' && render !== 'textonly',
    canHover: hover !== 'none' && !isReduced,
    isInstant: hover === 'instant',
    isGentle,
    isReduced,
    durationScale,
    hoverDurationScale,
    duration: (base = 2) => base * durationScale,
    hoverDuration: (base = 0.3) => base * hoverDurationScale,
  };
}
