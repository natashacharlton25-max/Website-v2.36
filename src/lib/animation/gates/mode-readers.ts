/**
 * Mode Readers — read the active gate state from <html> data attributes.
 *
 * These three readers are the gate primitives. Every animation entry
 * point flows through them (directly or via getAnimationConfig).
 *
 * data-motion (full|gentle|none)   — atom-level animation speed
 * data-hover  (full|gentle|instant|none) — hover transition speed
 * data-render (full|reduced|assistive|textonly) — render-mode pruning
 *
 * prefersReducedMotion() reads the OS-level media query — distinct
 * from the app's `data-render="reduced"` mode (which uses the viewport
 * stagger queue instead of disabling animation outright).
 */

export type MotionMode = 'full' | 'gentle' | 'none';
export type HoverMode = 'full' | 'gentle' | 'instant' | 'none';
export type RenderMode = 'full' | 'reduced' | 'assistive' | 'textonly';
export type SpeedMode = 'fast' | 'normal' | 'gentle' | 'slow';

export function getMotionMode(): MotionMode {
  const val = document.documentElement.getAttribute('data-motion') || '';
  if (val === 'none') return 'none';
  if (val === 'gentle') return 'gentle';
  return 'full';
}

export function getHoverMode(): HoverMode {
  const val = document.documentElement.getAttribute('data-hover') || '';
  if (val === 'none') return 'none';
  if (val === 'instant') return 'instant';
  if (val === 'gentle') return 'gentle';
  return 'full';
}

export function getRenderMode(): RenderMode {
  const val = document.documentElement.getAttribute('data-render') || '';
  if (val === 'reduced' || val === 'calm') return 'reduced';
  if (val === 'assistive' || val === 'easy-click') return 'assistive';
  if (val === 'textonly' || val === 'reading') return 'textonly';
  return 'full';
}

export function prefersReducedMotion(): boolean {
  // Only check OS-level preference — app's reduced mode is handled
  // by isReduced in getAnimationConfig() (viewport stagger queue)
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** User-controlled animation speed override read from <html data-anim-speed>.
 *  Stacks multiplicatively with the render-mode default in getAnimationConfig
 *  — so "slow" user pref + "reduced" render mode = 2.0 × 2.0 = 4.0× duration.
 *  Defaults to "normal" (1.0×) when the attribute is missing or unknown. */
export function getSpeedMode(): SpeedMode {
  const val = document.documentElement.getAttribute('data-anim-speed') || '';
  if (val === 'fast') return 'fast';
  if (val === 'gentle') return 'gentle';
  if (val === 'slow') return 'slow';
  return 'normal';
}
