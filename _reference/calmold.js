/**
 * calm.js — Calm theme constants + pure logic.
 *
 * Browser-safe: no fs, no node-only imports. Both the generator script
 * (future scripts/generate-calm-themes.js) and the preview page
 * (src/pages/test/calm-preview.astro) import from here.
 *
 * Contents are LITERAL COPIES from the engine. Source line refs below.
 */

import chroma from 'chroma-js';
import { safeOklch } from './colour-maths.js';

/* ================================================================
   COPIED FROM src/utils/theme-engine.js (line 22)
   SCALE_POSITIONS — schema for all theme scales.
   ================================================================ */
export const SCALE_POSITIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/* ================================================================
   COPIED FROM src/utils/theme-engine.js buildCSS (lines 920-921)
   Calm branch of SEMANTIC_MAP only.
   ================================================================ */
// Engine direction: position → semantic name
export const CALM_SEMANTIC_MAP = { 200: 'tint', 300: 'mid', 400: 'base', 500: 'emphasis' };
// Preview direction: semantic name → position
export const CALM_SEMANTIC_POS = { tint: 200, mid: 300, base: 400, emphasis: 500 };

/* ================================================================
   COPIED FROM src/utils/theme-engine.js (lines 515-526)
   CALM_LIGHTNESS_MAP — lightness ladder for calm scale positions.
   ================================================================ */
/**
 * Calm scale — chalky pastel, ADHD/migraine-friendly.
 * Matches the original brand-calm pipeline: input hex provides HUE only,
 * L + C are standardised to chalky-pastel (L=0.68, C=0.051) at the base anchor.
 * Other positions interpolate around that anchor.
 * Not aiming for AAA — calm is gentle AA only.
 */
// Calm light reads positions 200/300/400/500 for tint/mid/base/emphasis.
// Dark flips — read 800/700/600/500 after flip = 200/300/400/500 pre-flip.
// Ladder populates ALL positions; light reads upper, dark reads lower after flip.
export const CALM_LIGHTNESS_MAP = {
  100: 0.90,  // lightest decorative
  200: 0.82,  // tint — whisper for non-HC calm (HC overrides this separately)
  300: 0.68,  // mid — decorative UI, Lc 45+ to pass role
  400: 0.52,  // base (~4.76:1, green — AAA at bumped Large size)
  500: 0.42,  // emphasis (~7.3:1, green — ΔE 10+ vs base)
  600: 0.46,
  700: 0.38,
  800: 0.30,
  900: 0.22,
  950: 0.16,
};

/* ================================================================
   COPIED FROM src/utils/theme-engine.js (lines 528-543)
   generateCalmScale — produces the 10-position calm scale from one hex.
   ================================================================ */
export function generateCalmScale(baseHex) {
  const [, , h] = chroma(baseHex).oklch();
  const scale = {};
  const hue = h || 0;
  // Chalky pastel, all positions compressed toward the middle range so contrast
  // lands in the "soft" tier (3-4.5:1). Typography gate then bumps text size
  // to qualify WCAG Large (3:1 AA floor) — calm passes via size, not contrast.
  for (const pos of SCALE_POSITIONS) {
    const targetL = CALM_LIGHTNESS_MAP[pos];
    const chromaVal = targetL >= 0.75 ? 0.025     // tint — whisper (bumped for ΔE green)
                    : targetL >= 0.50 ? 0.025     // mid/base — dusty
                    : 0.020;                      // emphasis — near-grey
    scale[pos] = safeOklch(targetL, chromaVal, hue);
  }
  return scale;
}