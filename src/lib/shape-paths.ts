/**
 * Built-in geometric shape paths.
 *
 * Source of truth for the SVG render path's hardcoded shapes. Used by
 * Shape.astro and any handler that needs to know what geometry a built-in
 * shape resolves to (e.g. morph.ts when morphing INTO a built-in).
 *
 * Conventions:
 *   - viewBox is 0 0 100 100 — Shape.astro pads this for stroke width at render time
 *   - All coordinates leave a 2-unit margin from the edge so 1–2px strokes don't clip
 *   - Pill is half-height (48 instead of 96) by design — it's a horizontal shape
 *   - Paths are kept as raw SVG fragments (no <svg> wrapper) so callers can
 *     wrap with their own viewBox/overflow attrs for stroke padding
 *
 * To add a built-in shape:
 *   1. Add it here with viewBox 0 0 100 100, edge margin 2
 *   2. Add the slug to the Shape.schema.json `shape` enum
 *   3. Add to cssCapableShapes in Shape.astro if it has a CSS-only equivalent
 */

export const SHAPE_PATHS: Record<string, string> = {
  circle:       '<circle cx="50" cy="50" r="48" />',
  square:       '<rect x="2" y="2" width="96" height="96" />',
  subtle:       '<rect x="2" y="2" width="96" height="96" rx="3" ry="3" />',
  soft:         '<rect x="2" y="2" width="96" height="96" rx="8" ry="8" />',
  rounded:      '<rect x="2" y="2" width="96" height="96" rx="12" ry="12" />',
  'rounded-lg': '<rect x="2" y="2" width="96" height="96" rx="18" ry="18" />',
  pill:         '<rect x="2" y="2" width="96" height="48" rx="24" ry="24" />',
  hexagon:      '<polygon points="50,2 97,27 97,73 50,98 3,73 3,27" />',
  diamond:      '<polygon points="50,2 98,50 50,98 2,50" />',
  triangle:     '<polygon points="50,2 98,98 2,98" />',
  star:         '<polygon points="50,2 61,35 97,35 68,57 79,91 50,70 21,91 32,57 3,35 39,35" />',
  blob:         '<path d="M70,8 C90,15 98,35 96,55 C94,75 80,92 60,96 C40,100 18,90 8,72 C-2,54 2,30 15,15 C28,0 50,1 70,8 Z" />',
};

export type ShapePathName = keyof typeof SHAPE_PATHS;
