/**
 * Colour helpers — convert CSS colours (oklch, lab, etc) to hex for
 * SVG compatibility, and read theme tokens from elements.
 */

/** Convert any CSS color (oklch, lab, etc.) to hex for SVG compatibility */
export function toHex(cssColor: string): string {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = cssColor;
  return ctx.fillStyle;
}

/** Read the current --_color from an element, converted to hex */
export function getElementColor(el: HTMLElement): string {
  const cs = getComputedStyle(el);
  const raw = cs.getPropertyValue('--_color').trim() || cs.color || '#c4907c';
  return toHex(raw);
}

/** Read the ghost color token */
export function getGhostColor(el?: HTMLElement): string {
  const target = el || document.documentElement;
  return toHex(
    getComputedStyle(target).getPropertyValue('--svg-ghost-color').trim()
    || getComputedStyle(document.documentElement).getPropertyValue('--neutral-tint').trim()
    || '#ccc'
  );
}
