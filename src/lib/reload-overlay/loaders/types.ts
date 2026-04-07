/**
 * Loader contract — what every reload overlay loader must provide.
 *
 * A loader is anything that can render itself into the overlay container
 * during a page reload. It's the "thing the user looks at" while the page
 * is reloading. By keeping this interface tiny, brands can provide:
 *
 *   - A spinner (goo spiral, dots, ring, etc.)
 *   - A logo + tagline
 *   - A static image / advert
 *   - Just a message with no animation
 *   - A short Lottie animation
 *
 * The mechanism in reload-overlay.ts (overlay element, fade-in, scroll save,
 * reload trigger) doesn't care which loader is used — it just calls render()
 * with the chosen message and lets the loader paint whatever it wants.
 */

export interface ReloadLoader {
  /**
   * Build and return the loader's DOM. Receives the picked message string
   * (already chosen by the message picker — the loader just decides whether
   * to show it and how).
   *
   * Most loaders will append the message inside their own structure so
   * styling can be coordinated with the visual. Loaders that don't want
   * to show a message at all can ignore the parameter.
   */
  render(message: string): HTMLElement;

  /**
   * Optional teardown — called if the overlay is removed before reload
   * completes (rare, but covers edge cases like the user navigating away
   * via browser back button mid-reload).
   */
  cleanup?(): void;
}
