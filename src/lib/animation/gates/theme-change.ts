/**
 * Theme Change Listener — central pub/sub for theme/mode changes.
 *
 * Animations register a callback via onThemeChange(); the listener
 * fires it when:
 *   1. ThemeSwitcher emits the `themeChanged` event explicitly
 *   2. data-mode / data-theme-chroma / data-motion / data-hover /
 *      data-render attributes mutate on <html> (debounced 100ms to
 *      avoid premature firing during page load)
 *
 * Animations re-read getAnimationConfig() in their callback so they
 * pick up the new gate state without page reload.
 */

type ThemeChangeCallback = () => void;
const themeChangeCallbacks: Set<ThemeChangeCallback> = new Set();

/** Register a callback to run on theme change.
 *  Returns an unsubscribe function — call it before unmounting to
 *  prevent orphaned callbacks accumulating across page navigations. */
export function onThemeChange(cb: ThemeChangeCallback): () => void {
  themeChangeCallbacks.add(cb);
  return () => { themeChangeCallbacks.delete(cb); };
}

/** Fire all theme change callbacks */
function fireThemeChange(): void {
  themeChangeCallbacks.forEach(cb => cb());
}

// Listen for ThemeSwitcher event + debounced MutationObserver fallback
if (typeof document !== 'undefined') {
  window.addEventListener('themeChanged', fireThemeChange);
  // MutationObserver: debounce to avoid premature firing during page load
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const debouncedFire = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fireThemeChange, 100);
  };
  const observer = new MutationObserver(debouncedFire);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-mode', 'data-theme-chroma', 'data-motion', 'data-hover', 'data-render']
  });
}
