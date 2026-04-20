**
 * colour-maths.js — Pure colour maths helpers shared across every theme.
 *
 * COPIED (not rewritten) from src/utils/theme-engine.js:
 *   maxChromaForHue       — lines 119-131
 *   safeOklch             — lines 139-166
 *   findLightnessForContrast — lines 177-204
 *   ensureContrastAgainst — lines 217-243
 *   relativeLuminance     — lines 597-603
 *   contrastRatio         — lines 605-611
 *
 * No theme knowledge. If you spot any branching on theme type in here,
 * flag it — it's a bug, not intentional.
 */

import chroma from 'chroma-js';

/* ================================================================
   COPIED FROM src/utils/theme-engine.js LINES 119-131
   ================================================================ */

export function maxChromaForHue(hue, lightness) {
  let lo = 0, hi = 0.4;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    try {
      const c = chroma.oklch(lightness, mid, hue);
      const [r, g, b] = c.rgb();
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) lo = mid;
      else hi = mid;
    } catch (e) { hi = mid; }
  }
  return lo;
}

/* ================================================================
   COPIED FROM src/utils/theme-engine.js LINES 133-166
   ================================================================ */

/**
 * Gamut-clamped OKLCH to hex. Always returns a valid hex string.
 * Preserves hue: if sRGB conversion drifts the OKLCH hue by more than 8°,
 * reduces chroma until the hue holds. This prevents gamut-clamp hue drift
 * at extreme lightness (e.g., OKLCH 65° → hex with actual hue 29°).
 */
export function safeOklch(l, c, h) {
  const maxC = maxChromaForHue(h, l);
  let targetC = Math.min(c, maxC * 0.95);

  // Try at full chroma first
  try {
    const hex = chroma.oklch(l, targetC, h).hex();
    const actualH = chroma(hex).get('oklch.h') || 0;
    const hueDrift = Math.min(Math.abs(actualH - h), 360 - Math.abs(actualH - h));

    // If hue held (within 8°), return as-is
    if (hueDrift <= 8 || targetC < 0.005) return hex;

    // Hue drifted — binary search for max chroma that holds hue
    let lo = 0, hi = targetC;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      const testHex = chroma.oklch(l, mid, h).hex();
      const testH = chroma(testHex).get('oklch.h') || 0;
      const drift = Math.min(Math.abs(testH - h), 360 - Math.abs(testH - h));
      if (drift <= 8) lo = mid;
      else hi = mid;
    }
    return chroma.oklch(l, lo, h).hex();
  } catch (e) {
    return chroma.oklch(l, 0, 0).hex();
  }
}

/* ================================================================
   COPIED FROM src/utils/theme-engine.js LINES 173-204
   ================================================================ */

/**
 * Find the OKLCH lightness that achieves a target WCAG contrast ratio
 * against a background hex, at a given hue and chroma.
 */
export function findLightnessForContrast(bgHex, hue, chromaVal, targetRatio, tolerance = 0.2) {
  const bgLum = chroma(bgHex).luminance();
  const bgIsLight = bgLum > 0.5;

  // Search range: if bg is dark, we need lighter fg (higher L); if light, darker fg (lower L)
  let lo = bgIsLight ? 0.10 : 0.40;
  let hi = bgIsLight ? 0.60 : 0.95;

  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    const safeChr = Math.min(chromaVal, maxChromaForHue(hue, mid) * 0.90);
    const hex = safeOklch(mid, safeChr, hue);
    const fgLum = chroma(hex).luminance();
    const lighter = Math.max(bgLum, fgLum);
    const darker = Math.min(bgLum, fgLum);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    if (Math.abs(ratio - targetRatio) < tolerance) return mid;
    if (bgIsLight) {
      // Darker fg = higher contrast on light bg
      if (ratio < targetRatio) hi = mid; else lo = mid;
    } else {
      // Lighter fg = higher contrast on dark bg
      if (ratio < targetRatio) lo = mid; else hi = mid;
    }
  }
  return (lo + hi) / 2;
}

/* ================================================================
   COPIED FROM src/utils/theme-engine.js LINES 206-243
   ================================================================ */

/**
 * Lightly sacred contrast adjustment for hover-change colours.
 * The contrast token swaps in on hover — user needs to see the state change.
 * Must have UI separation (3:1) against:
 *   - base colour (before-hover state, so the change is visible)
 *   - page-bg (so the button is still visible in its new state)
 *
 * Returns source hex if already passing both. Otherwise nudges lightness
 * to the lighter/darker side that satisfies both constraints.
 * Hue + chroma preserved — colour identity stays intact.
 */
export function ensureContrastAgainst(sourceHex, baseHex, pageBgHex, targetRatio = 3) {
  const vsBase = contrastRatio(sourceHex, baseHex);
  const vsBg = pageBgHex ? contrastRatio(sourceHex, pageBgHex) : Infinity;
  if (vsBase >= targetRatio && vsBg >= targetRatio) return sourceHex; // already passes

  const [, c, h] = chroma(sourceHex).oklch();
  const hue = h || 0;
  const chromaVal = c || 0;

  // Need to find a lightness that satisfies BOTH constraints.
  // Solve for each separately, take the one that also satisfies the other.
  const lVsBase = findLightnessForContrast(baseHex, hue, chromaVal, targetRatio);
  const lVsBg = pageBgHex ? findLightnessForContrast(pageBgHex, hue, chromaVal, targetRatio) : lVsBase;

  // Try each — pick the one where both contrasts pass
  const candidates = [lVsBase, lVsBg];
  for (const candL of candidates) {
    const safeC = Math.min(chromaVal, maxChromaForHue(hue, candL) * 0.90);
    const hex = safeOklch(candL, safeC, hue);
    const okBase = contrastRatio(hex, baseHex) >= targetRatio;
    const okBg = !pageBgHex || contrastRatio(hex, pageBgHex) >= targetRatio;
    if (okBase && okBg) return hex;
  }
  // Neither single adjustment worked — return the one with higher base-contrast
  const safeC = Math.min(chromaVal, maxChromaForHue(hue, lVsBase) * 0.90);
  return safeOklch(lVsBase, safeC, hue);
}

/* ================================================================
   COPIED FROM src/utils/theme-engine.js LINES 597-603
   ================================================================ */

export function relativeLuminance(hex) {
  const [r, g, b] = chroma(hex).rgb().map(v => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/* ================================================================
   COPIED FROM src/utils/theme-engine.js LINES 605-611
   ================================================================ */

export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}