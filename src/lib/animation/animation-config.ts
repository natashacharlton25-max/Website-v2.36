/**
 * Animation Config — barrel re-export.
 *
 * Animation logic was split into focused files (Mar 2026) for
 * maintainability. This barrel keeps every existing import working;
 * new code should import from the specific module instead.
 *
 * Modules:
 *   gates/mode-readers       — motion/hover/render/prefersReducedMotion
 *   gates/animation-config   — getAnimationConfig() factory + interface
 *   gates/static-fallback    — applyStaticFallback for motion=none
 *   gates/explainer          — anim-explainer mode helpers
 *   gates/theme-change       — onThemeChange registry + listeners
 *   triggers/register-trigger — registerTrigger + section stagger queue
 *   helpers/color            — toHex / getElementColor / getGhostColor
 *   helpers/scroll           — getScrollContainer (OverlayScrollbars)
 *   config/gradient          — GRADIENT_ANIMATION_SPEED map
 *
 * Gating contract: every animation entry point still calls into
 * getAnimationConfig() before running GSAP. That's the gate. Splitting
 * moved where constants live, not where the check happens.
 */

// Mode readers + types
export {
  getMotionMode,
  getHoverMode,
  getRenderMode,
  prefersReducedMotion,
} from './gates/mode-readers';
export type { MotionMode, HoverMode, RenderMode } from './gates/mode-readers';

// The gate factory + config interface
export { getAnimationConfig } from './gates/animation-config';
export type { AnimationConfig } from './gates/animation-config';

// Static fallback for motion=none
export { applyStaticFallback } from './gates/static-fallback';
export type { StaticFallback } from './gates/static-fallback';

// Explainer gate
export {
  isExplainerInline,
  isExplainerGated,
  getExplainerTriggerRemap,
} from './gates/explainer';

// Theme change pub/sub
export { onThemeChange } from './gates/theme-change';

// Trigger registration
export { registerTrigger } from './triggers/register-trigger';
export type { TriggerOptions } from './triggers/register-trigger';

// Helpers
export { toHex, getElementColor, getGhostColor } from './helpers/color';
export { getScrollContainer } from './helpers/scroll';

// Animation-type configs
export { GRADIENT_ANIMATION_SPEED } from './config/gradient';
export type { GradientAnimationSpeed } from './config/gradient';
export { INTERVAL_TOKENS, getIntervalSeconds } from './config/interval';
export type { IntervalToken } from './config/interval';
