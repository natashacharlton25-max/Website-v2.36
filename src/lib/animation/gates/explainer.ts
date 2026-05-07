/**
 * Explainer Gate — when the animation explainer is in "inline" mode,
 * non-UI animated elements are replaced by static explainer cards.
 * In tooltip/subtitle mode hover triggers remap to click so hover is
 * free for showing the explainer.
 */

/**
 * Check if the animation explainer is in "inline" mode (replaces animation).
 * In inline mode, animated non-UI elements show static explainer cards instead.
 * Other modes (subtitle/overlay/tooltip) keep the animation playing.
 */
export function isExplainerInline(): boolean {
  return document.documentElement.dataset.animExplainer === 'inline';
}

/**
 * Check if a specific element should skip animation because the explainer
 * replaces it. True when: inline mode is on AND the element is non-UI
 * (has an adjacent .anim-explainer sibling).
 */
export function isExplainerGated(el: HTMLElement): boolean {
  if (!isExplainerInline()) return false;
  return !!el.nextElementSibling?.classList.contains('anim-explainer');
}

/**
 * When explainer is tooltip/overlay, hover triggers should be remapped
 * to click so hover is free for showing explainer cards.
 * Returns 'click' if remapping needed, null otherwise.
 */
export function getExplainerTriggerRemap(): 'click' | null {
  const mode = document.documentElement.dataset.animExplainer;
  if (mode === 'tooltip' || mode === 'subtitle') return 'click';
  // Enlarge: hover plays animation normally, click opens modal (handled by anim-explainer.ts)
  return null;
}
