/**
 * Scroll helpers — get the OverlayScrollbars viewport when present,
 * so ScrollTrigger pins/scrubs work against the custom scroller
 * instead of the document.
 */

/** Get the OverlayScrollbars viewport if present */
export function getScrollContainer(): HTMLElement | undefined {
  return document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]') || undefined;
}
