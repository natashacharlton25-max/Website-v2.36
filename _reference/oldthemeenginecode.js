/**
 * Theme Engine — standalone colour computation module
 *
 * Takes a JSON theme definition, outputs a complete CSS token set.
 * Used by: build script, Cloudflare Worker, client-side preview, palette builder.
 *
 * No CVD logic — the engine receives hex values and generates scales.
 * CVD safety lives in the picker UI (pre-tagged cards, "No Reds"/"No Blues" filters).
 * CVD variant definitions have explicit primary/secondary (hand-picked safe pairs).
 *
 * Dependency: chroma-js only. No Node-specific imports.
 * All output values are hex — never OKLCH notation in CSS.
 */

import chroma from 'chroma-js';


/* ================================================================
   1. CONSTANTS
   ================================================================ */

export const SCALE_POSITIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export const LIGHTNESS_MAP = {
  100: 0.95, 200: 0.88, 300: 0.78, 400: 0.68,
  500: 0.58, 600: 0.48, 700: 0.38, 800: 0.28, 900: 0.20, 950: 0.13,
};

/* ================================================================
   CVD HELPERS — design-time safe hue picker + simulation
   ================================================================
   - makeCvdSafe: shift an input hue into a CVD-safe zone (design-time).
     Use when "Make protan-safe" button is clicked to shift user's hex
     away from confusion zones before regenerating the palette.
   - simulateCvd: transform a hex to how a CVD user perceives it
     (verification-time). Uses Machado 2009 matrices.
*/

const CVD_UNSAFE_ZONES = {
  protan:  [[0, 40], [100, 165], [330, 360]],
  deutan:  [[0, 40], [100, 165], [330, 360]],
  tritan:  [[60, 110], [200, 260]],
};
const CVD_SAFE_TARGETS = {
  protan:  [45, 90, 170, 200, 270, 320],
  deutan:  [45, 90, 170, 200, 270, 320],
  tritan:  [15, 40, 140, 175, 280, 335],
};

function hueInZones(h, zones) {
  const n = ((h % 360) + 360) % 360;
  return zones.some(([lo, hi]) => n >= lo && n <= hi);
}

export function makeCvdSafe(hex, cvdType) {
  if (!cvdType || !CVD_UNSAFE_ZONES[cvdType]) return hex;
  const [l, c, h] = chroma(hex).oklch();
  if (!hueInZones(h || 0, CVD_UNSAFE_ZONES[cvdType])) return hex;
  const targets = CVD_SAFE_TARGETS[cvdType];
  const n = ((h || 0) % 360 + 360) % 360;
  const nearest = targets.reduce((best, t) => {
    const dB = Math.min(Math.abs(n - best), 360 - Math.abs(n - best));
    const dT = Math.min(Math.abs(n - t), 360 - Math.abs(n - t));
    return dT < dB ? t : best;
  });
  return chroma.oklch(l, c, nearest).hex();
}

// Machado 2009 matrices (LMS space) — industry-standard CVD simulation.
const CVD_MATRICES = {
  protan:  [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan:  [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan:  [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};

export function simulateCvd(hex, cvdType) {
  if (!cvdType || !CVD_MATRICES[cvdType]) return hex;
  const M = CVD_MATRICES[cvdType];
  const [r, g, b] = chroma(hex).rgb();
  // Normalise and apply matrix (in gamma-corrected sRGB space — Machado's published form)
  const norm = [r / 255, g / 255, b / 255];
  const out = [
    M[0][0] * norm[0] + M[0][1] * norm[1] + M[0][2] * norm[2],
    M[1][0] * norm[0] + M[1][1] * norm[1] + M[1][2] * norm[2],
    M[2][0] * norm[0] + M[2][1] * norm[1] + M[2][2] * norm[2],
  ];
  const clamp = (v) => Math.max(0, Math.min(1, v));
  return chroma.rgb(clamp(out[0]) * 255, clamp(out[1]) * 255, clamp(out[2]) * 255).hex();
}

// Rainbow is global static CSS (rainbow-default.css, rainbow-protan.css, rainbow-tritan.css).
// No per-theme rainbow generation. See architecture-decisions-theme-engine.md Decision 20.

const NEUTRAL_HUE = 40;

// Neutral scale: 400–950 only. Positions 100–300 were all near-white and
// indistinguishable — page backgrounds now use dedicated --page-bg-* tokens.
const NEUTRAL_STEPS = [
  { pos: 100, lightness: 0.97, saturation: 0.03 },  // near-white
  { pos: 200, lightness: 0.90, saturation: 0.04 },  // off-white
  { pos: 300, lightness: 0.82, saturation: 0.05 },  // light grey
  { pos: 400, lightness: 0.72, saturation: 0.06 },  // mid-light — borders, dividers
  { pos: 500, lightness: 0.60, saturation: 0.08 },  // mid — decorative, disabled
  { pos: 600, lightness: 0.48, saturation: 0.10 },  // mid-dark — icons
  { pos: 700, lightness: 0.36, saturation: 0.12 },  // secondary text (light mode)
  { pos: 800, lightness: 0.26, saturation: 0.12 },  // body text (light mode)
  { pos: 900, lightness: 0.18, saturation: 0.10 },  // emphasis text (light mode)
  { pos: 950, lightness: 0.12, saturation: 0.08 },  // black
];


/* ================================================================
   2. UTILITY FUNCTIONS
   ================================================================ */

/**
 * Binary search for maximum sRGB-safe chroma at a given OKLCH hue + lightness.
 */
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
   3. SCALE GENERATORS
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
function ensureContrastAgainst(sourceHex, baseHex, pageBgHex, targetRatio = 3) {
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

/**
 * Generate a brand scale from a sacred 600 hex.
 * 600 = brand's exact hex, never adjusted (brand identity).
 * 700, 800, 900, 950 — contrast-targeted against page bg, same hue (WCAG AA/AAA).
 * 100, 200, 300, 400, 500 — light decorative positions, hue preserved, audited ≥3:1 for UI.
 *
 * Targets (light bg):
 *   700 → 5.5:1 (AA body)
 *   800 → 7:1   (AAA emphasis)
 *   900 → 10:1  (strong emphasis)
 *   950 → 14:1  (deepest)
 *
 * Falls back to lightness-based if pageBg not supplied (legacy calls).
 */
export function generateBrandScale(baseHex, pageBgHex) {
  const base = chroma(baseHex);
  const [bL, bC, bH] = base.oklch();
  const hue = bH || 0;
  const chromaVal = bC;

  const scale = {};

  // 600 = sacred, exact brand hex, never touched
  scale[600] = baseHex;

  // ── Contrast-targeted positions (require pageBg) ─────────────
  if (pageBgHex) {
    // Dark positions — binary-searched lightness to hit target ratios
    const l700 = findLightnessForContrast(pageBgHex, hue, chromaVal, 5.5);
    const l800 = findLightnessForContrast(pageBgHex, hue, chromaVal, 7.0);
    const l900 = findLightnessForContrast(pageBgHex, hue, chromaVal, 10.0);
    const l950 = findLightnessForContrast(pageBgHex, hue, chromaVal, 14.0);

    // Chroma tapers at extremes — gamut-clamp-aware
    const c700 = Math.min(chromaVal * 0.90, maxChromaForHue(hue, l700) * 0.90);
    const c800 = Math.min(chromaVal * 0.80, maxChromaForHue(hue, l800) * 0.90);
    const c900 = Math.min(chromaVal * 0.55, maxChromaForHue(hue, l900) * 0.90);
    const c950 = Math.min(chromaVal * 0.35, maxChromaForHue(hue, l950) * 0.90);

    scale[700] = safeOklch(l700, c700, hue);
    scale[800] = safeOklch(l800, c800, hue);
    scale[900] = safeOklch(l900, c900, hue);
    scale[950] = safeOklch(l950, c950, hue);

    // Light positions — lightness spread above 600, hue preserved.
    // Not contrast-targeted (these are decorative, audited ≥3:1 separately).
    const isPastel = bL > 0.75;
    const l200 = isPastel
      ? Math.min(0.95, bL + (1 - bL) * 0.60)
      : bL + (0.95 - bL) * 0.70;
    const l400 = bL + (l200 - bL) * 0.50;
    const l500 = l400 + (bL - l400) * 0.50;
    const l300 = l200 + (l400 - l200) * 0.50;
    const l100 = l200 + (0.97 - l200) * 0.50;

    const c200 = bC * 0.45;
    const c400 = bC * 0.55;
    const c500 = (c400 + bC) * 0.50;
    const c300 = (c200 + c400) * 0.50;
    const c100 = c200 * 0.30;

    scale[100] = safeOklch(l100, c100, hue);
    scale[200] = safeOklch(l200, c200, hue);
    scale[300] = safeOklch(l300, c300, hue);
    scale[400] = safeOklch(l400, c400, hue);
    scale[500] = safeOklch(l500, c500, hue);
    return scale;
  }

  // ── Legacy fallback: lightness-based (no pageBg supplied) ────
  const isPastel = bL > 0.75;
  const isDark = bL < 0.45;
  const emphasisMult = 0.55 + (bL * 0.40);

  let l200, l400, l800;
  if (isPastel) {
    l200 = Math.min(0.95, bL + (1 - bL) * 0.60);
    l400 = bL + (l200 - bL) * 0.50;
    l800 = bL * emphasisMult;
  } else if (isDark) {
    l200 = Math.max(0.55, bL + (0.95 - bL) * 0.50);
    l400 = bL + (l200 - bL) * 0.50;
    l800 = bL * emphasisMult;
  } else {
    l200 = bL + (0.95 - bL) * 0.70;
    l400 = bL + (l200 - bL) * 0.50;
    l800 = bL * emphasisMult;
  }

  const c200 = bC * 0.45;
  const c400 = bC * 0.55;
  const c800 = bC * 0.70;

  scale[200] = safeOklch(l200, c200, hue);
  scale[400] = safeOklch(l400, c400, hue);
  scale[800] = safeOklch(l800, c800, hue);
  scale[100] = safeOklch(l200 + (0.97 - l200) * 0.50, c200 * 0.30, hue);
  scale[300] = safeOklch(l200 + (l400 - l200) * 0.50, (c200 + c400) * 0.50, hue);
  scale[500] = safeOklch(l400 + (bL - l400) * 0.50, (c400 + bC) * 0.50, hue);
  scale[700] = safeOklch(bL + (l800 - bL) * 0.35, (bC + c800) * 0.50, hue);
  scale[900] = safeOklch(l800 * 0.65, c800 * 0.55, hue);
  scale[950] = safeOklch(l800 * 0.40, c800 * 0.35, hue);

  return scale;
}

/**
 * Generate an HC scale — contrast-targeted lightness, not max chroma.
 * 600 = ~8:1 against pageBg (AAA for text)
 * 800 = ~5:1 against pageBg (AA for UI, visually distinct from 600)
 * Other positions spread evenly.
 */
export function generateHCScale(baseHex, pageBgHex = '#000000') {
  const [, , hue] = chroma(baseHex).oklch();
  const chromaVal = 0.20; // bumped from 0.15 — HC should out-saturate dark mode

  // Find lightness values that hit target contrast ratios.
  // Lowered from 9:1/14:1 → 7:1/10:1 so lightness sits where the gamut allows
  // richer chroma (cyans/greens are gamut-limited at very low L).
  // 7:1 is still AAA for body text. 10:1 is comfortably AAA for emphasis.
  const l600 = findLightnessForContrast(pageBgHex, hue, chromaVal, 7.0);
  const l800 = findLightnessForContrast(pageBgHex, hue, chromaVal, 10.0);

  const scale = {};
  const c600 = Math.min(chromaVal, maxChromaForHue(hue, l600) * 0.90);
  const c800 = Math.min(chromaVal, maxChromaForHue(hue, l800) * 0.90);

  scale[600] = safeOklch(l600, c600, hue);
  scale[800] = safeOklch(l800, c800, hue);
  scale[700] = safeOklch((l600 + l800) / 2, (c600 + c800) / 2, hue);

  // Spread remaining positions
  const bgIsLight = chroma(pageBgHex).luminance() > 0.5;
  if (bgIsLight) {
    // Light bg: 200 = lightest (near bg), 900 = darkest
    scale[200] = safeOklch(0.90, chromaVal * 0.15, hue);
    scale[300] = safeOklch(0.80, chromaVal * 0.30, hue);
    scale[400] = safeOklch(0.65, chromaVal * 0.60, hue);
    scale[500] = safeOklch(0.55, chromaVal * 0.80, hue);
    scale[900] = safeOklch(0.15, chromaVal * 0.40, hue);
    scale[950] = safeOklch(0.10, chromaVal * 0.20, hue);
  } else {
    // Dark bg: 200 = visible tint (above page bg), 900 = lightest
    scale[200] = safeOklch(0.30, chromaVal * 0.30, hue);
    scale[300] = safeOklch(0.35, chromaVal * 0.30, hue);
    scale[400] = safeOklch(0.42, chromaVal * 0.50, hue);
    scale[500] = safeOklch(0.50, chromaVal * 0.70, hue);
    scale[900] = safeOklch(0.92, chromaVal * 0.30, hue);
    scale[950] = safeOklch(0.96, chromaVal * 0.10, hue);
  }

  scale[100] = bgIsLight ? safeOklch(0.96, chromaVal * 0.05, hue) : safeOklch(0.08, chromaVal * 0.05, hue);

  return scale;
}

/**
 * Generate a dark-mode scale from a base hex.
 * Same hue, muted chroma, lightly-adjusted lightness to meet AA minimums
 * while keeping the brand feel. Small adjustments only — hue never shifts.
 *
 * On dark bg, lighter positions have more contrast:
 *   600 → min 4.5:1 (AA body) — prefers fixed L=0.62 if already passing
 *   800 → min 7:1   (AAA emphasis) — prefers fixed L=0.80 if already passing
 *
 * Strategy: start from the "visually balanced" fixed lightness (0.62/0.80),
 * nudge UP only if contrast is below target. Never nudge down (preserves brand).
 *
 * 100-500 = dark decorative spread (audited ≥3:1 separately).
 *
 * Falls back to fixed-lightness if pageBg not supplied (legacy calls).
 */
export function generateDarkScale(baseHex, pageBgHex) {
  const [, c, h] = chroma(baseHex).oklch();
  const hue = h || 0;
  // Soften chroma on dark — keeps hue identity but visibly mutes vs both light
  // brand and HC variants. Dark < HC < light brand on the saturation ladder.
  const mutedC = c * 0.55;

  const scale = {};

  // ── Contrast-aware (require pageBg) ─────────────
  // Keep the brand-feel fixed lightness — only lift it if below AA minimum.
  if (pageBgHex) {
    const preferred600 = 0.62;
    const preferred700 = 0.72;
    const preferred800 = 0.80;
    const preferred900 = 0.90;

    // If preferred lightness already passes the target, use it. Else bump up.
    const l600Needed = findLightnessForContrast(pageBgHex, hue, mutedC * 0.85, 4.5);
    const l700Needed = findLightnessForContrast(pageBgHex, hue, mutedC * 0.70, 5.5);
    const l800Needed = findLightnessForContrast(pageBgHex, hue, mutedC * 0.55, 7.0);
    const l900Needed = findLightnessForContrast(pageBgHex, hue, mutedC * 0.25, 10.0);

    const l600 = Math.max(preferred600, l600Needed);
    const l700 = Math.max(preferred700, l700Needed);
    const l800 = Math.max(preferred800, l800Needed);
    const l900 = Math.max(preferred900, l900Needed);

    const c600 = Math.min(mutedC * 0.85, maxChromaForHue(hue, l600) * 0.90);
    const c700 = Math.min(mutedC * 0.70, maxChromaForHue(hue, l700) * 0.90);
    const c800 = Math.min(mutedC * 0.55, maxChromaForHue(hue, l800) * 0.90);
    const c900 = Math.min(mutedC * 0.25, maxChromaForHue(hue, l900) * 0.90);

    scale[600] = safeOklch(l600, c600, hue);
    scale[700] = safeOklch(l700, c700, hue);
    scale[800] = safeOklch(l800, c800, hue);
    scale[900] = safeOklch(l900, c900, hue);
    scale[950] = safeOklch(0.95, mutedC * 0.10, hue);

    // Dark decorative positions — below 600, preserve hue
    scale[100] = safeOklch(0.18, mutedC * 0.10, hue);
    scale[200] = safeOklch(0.30, mutedC * 0.35, hue);
    scale[300] = safeOklch(0.35, mutedC * 0.35, hue);
    scale[400] = safeOklch(0.42, mutedC * 0.55, hue);
    scale[500] = safeOklch(0.50, mutedC * 0.75, hue);
    return scale;
  }

  // ── Legacy fallback: fixed lightness ──────────────
  scale[100] = safeOklch(0.18, mutedC * 0.10, hue);
  scale[200] = safeOklch(0.30, mutedC * 0.35, hue);
  scale[300] = safeOklch(0.35, mutedC * 0.35, hue);
  scale[400] = safeOklch(0.42, mutedC * 0.55, hue);
  scale[500] = safeOklch(0.50, mutedC * 0.75, hue);
  scale[600] = safeOklch(0.62, mutedC * 0.85, hue);
  scale[700] = safeOklch(0.72, mutedC * 0.70, hue);
  scale[800] = safeOklch(0.80, mutedC * 0.55, hue);
  scale[900] = safeOklch(0.90, mutedC * 0.25, hue);
  scale[950] = safeOklch(0.95, mutedC * 0.10, hue);

  return scale;
}

/**
 * Generate a contrast reference scale — 10-step OKLCH spread from any hex.
 * Shows every lightness position for the brand hue so you can see which
 * positions hit contrast targets against any background. Used by the
 * brand solver, validator, and contrast audits — not for theme CSS output.
 *
 * Chroma tapers toward white/black extremes, gamut-clamped per hue.
 * Warm hues get extra compression at low lightness to prevent browning.
 */
export function generateGreyscaleScale(baseHex) {
  const [, , h] = chroma(baseHex).oklch();
  const scale = {};
  // Fixed chroma 0.018 — greyscale themes are tinted GREY regardless of variant.
  // Lower than calm (0.025+) so greyscale reads as "grey with a hint" not "pastel".
  // HC variants get more contrast from a hue-tinted bg, not stronger primaries.
  const chromaVal = 0.018;
  const hue = h || 0;

  for (const pos of SCALE_POSITIONS) {
    const targetL = LIGHTNESS_MAP[pos];
    scale[pos] = safeOklch(targetL, chromaVal, hue);
  }
  return scale;
}

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

/**
 * Neutral scale — hand-tuned lightness/saturation with configurable hue.
 * Default 40° (warm yellow-orange).
 */
export function generateNeutralScale(hue = NEUTRAL_HUE) {
  const scale = {};
  for (const { pos, lightness, saturation } of NEUTRAL_STEPS) {
    scale[pos] = chroma.hsl(hue, saturation, lightness).hex();
  }
  return scale;
}

/**
 * Hue-tinted neutral scale — grey with a whisper of the brand hue.
 * Used by colour-mono themes so even neutrals carry the mono hue.
 */
export function generateTintedNeutralScale(hue, tintChroma = 0.02) {
  const scale = {};
  for (const { pos, lightness } of NEUTRAL_STEPS) {
    scale[pos] = safeOklch(lightness, tintChroma, hue);
  }
  return scale;
}

/**
 * Full-range grey scale — achromatic, chroma 0. Same 100–950 positions as generateGreyscaleScale.
 * Used as colour-mono secondary (structural chrome vs branded primary).
 */
export function generateGreyFullScale() {
  const scale = {};
  for (const pos of SCALE_POSITIONS) {
    scale[pos] = chroma.oklch(LIGHTNESS_MAP[pos], 0, 0).hex();
  }
  return scale;
}

/**
 * Pure grey scale — achromatic, chroma 0. Same 400–950 positions as warm neutral.
 */
export function generatePureGreyScale() {
  const scale = {};
  for (const { pos, lightness } of NEUTRAL_STEPS) {
    scale[pos] = chroma.oklch(lightness, 0, 0).hex();
  }
  return scale;
}


/* ================================================================
   4. CONTRAST HELPERS
   ================================================================ */

function relativeLuminance(hex) {
  const [r, g, b] = chroma(hex).rgb().map(v => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}


/* ================================================================
   5. BUILD-TIME CONTRAST UTILITY
   ================================================================ */

const DARK_CANDIDATES = [900, 800, 700];
const LIGHT_CANDIDATES = [400, 500];  // lightest available neutral positions

/**
 * Given a background hex and neutral scale, returns the best contrasting
 * neutral token reference. Author-passed text token always wins over this.
 */
export function getContrastToken(bgHex, neutralScale, minRatio = 4.5) {
  for (const pos of DARK_CANDIDATES) {
    if (contrastRatio(neutralScale[pos], bgHex) >= minRatio) {
      return { pos, token: `var(--neutral-${pos})` };
    }
  }
  for (const pos of LIGHT_CANDIDATES) {
    if (contrastRatio(neutralScale[pos], bgHex) >= minRatio) {
      return { pos, token: `var(--neutral-${pos})` };
    }
  }
  return null;
}


/* ================================================================
   6. BLACK / WHITE / SHADOW TOKENS
   ================================================================
   Status tokens (--color-Success/Warning/Error/Info) are bridged to
   the rainbow palette in src/styles/tokens/status-colors.css.
   This function only computes the non-status parts of the old block:
   black/white surface anchors and shadow endpoints.
*/

function computeStatusColors() {
  return {
    'color-Black':   '#1a1a1a',
    'color-White':   '#fafafa',
    'shadow-Black':  '#000000',
    'shadow-White':  '#ffffff',
  };
}


/* ================================================================
   7. PAGE BACKGROUND TOKENS
   ================================================================ */

/**
 * Dedicated page surface tokens — NOT part of the neutral scale.
 * Light mode: warm off-whites. Dark mode: cool-shifted darks.
 */
function computePageBackgrounds(isDark, chromaPreset = 'brand') {
  if (isDark) {
    // Warm dark — visibly NOT black, soft charcoal feel.
    // L=0.28 base canvas reads as charcoal, not pure dark. HC dark overrides
    // to true black separately when extreme contrast is the point.
    return {
      'page-bg':         '#2c2828',   // warm charcoal canvas (L=0.28)
      'page-bg-raised':  '#3a3535',   // card surface — visible lift (L=0.34)
      'page-bg-sunken':  '#221f1f',   // inset/recessed — noticeably darker (L=0.24)
      'page-bg-overlay': '#433d3d',   // modal surface — clear separation (L=0.38)
    };
  }
  if (chromaPreset === 'calm') {
    // Compressed lightness: page-bg L=0.95 (warmer than standard white).
    // neutral-700 text-light gives 4.6:1, neutral-800 body text gives 6.9:1 — both AA.
    // Reduces visual noise — gentle, low-glare, ADHD/migraine-friendly.
    return {
      'page-bg':         '#f2edeb',   // warm L=0.95 — softer than standard white
      'page-bg-raised':  '#f8f4f3',   // card — slightly lighter (L=0.97)
      'page-bg-sunken':  '#eae3e1',   // recessed — slightly darker (L=0.92)
      'page-bg-overlay': '#f8f4f3',   // modal — same as raised
    };
  }
  // Warm off-white — four visually distinct surfaces, no pure white
  return {
    'page-bg':         '#f0eeea',   // warm cream canvas
    'page-bg-raised':  '#f8f7f3',   // card — visibly lighter than canvas
    'page-bg-sunken':  '#e5e3df',   // recessed — noticeably darker
    'page-bg-overlay': '#f4f2ed',   // modal — between canvas and raised
  };
}


/* Section 8 (pre-render brand solver) moved to src/lib/brand-solver.js.
   The solver calls generateThemeData per variant — it's a pipeline tool,
   not colour maths. */



/* ================================================================
   9. AUDIT FUNCTIONS
   ================================================================ */

/**
 * WCAG audit on semantic token pairs.
 * Text pairs must pass 4.5:1. Decorative pairs must pass 3:1.
 */
export function auditTheme(scales, pageBg, focusHighlight = null) {
  const bg = pageBg['page-bg'];

  const textPairs = [
    ['text on bg',           scales.neutral[800],    bg],
    ['primary on bg',        scales.primary[600],    bg],
    ['secondary on bg',      scales.secondary[600],  bg],
  ];

  const decorativePairs = [
    ['neutral on bg',          scales.neutral[700],    bg],
    ['primary-dark on bg',     scales.primary[800],    bg],
    ['secondary-dark on bg',   scales.secondary[800],  bg],
  ];

  if (focusHighlight && !String(focusHighlight['focus-color']).startsWith('var(')) {
    decorativePairs.push(
      ['focus on page-bg',     focusHighlight['focus-color'], bg],
      ['focus on card-bg',     focusHighlight['focus-color'], pageBg['page-bg-raised']],
      ['highlight on page-bg',   focusHighlight['highlight-link-color'], bg],
      ['highlight on card-bg',   focusHighlight['highlight-link-color'], pageBg['page-bg-raised']],
    );
  }

  const results = [];
  let allPass = true;

  for (const [label, fg, bg] of textPairs) {
    const ratio = contrastRatio(fg, bg);
    const pass = ratio >= 4.5;
    results.push({ label, ratio: Math.round(ratio * 10) / 10, pass, level: 'text' });
    if (!pass) allPass = false;
  }

  for (const [label, fg, bg] of decorativePairs) {
    const ratio = contrastRatio(fg, bg);
    const pass = ratio >= 3;
    results.push({ label, ratio: Math.round(ratio * 10) / 10, pass, level: 'decorative' });
    if (!pass) allPass = false;
  }

  return { allPass, results };
}

/**
 * Scale self-check — guardrails on the raw scale.
 */
export function auditScale(scales, pageBg, definition = {}) {
  const pageBgHex = pageBg ? pageBg['page-bg'] : '#faf5ed';
  // Brand standard themes (light/dark, non-CVD, non-HC) — primary 600 + 800 are
  // informational only. Users switch to matching HC or CVD variant (one tap in
  // Your View) for guaranteed contrast. Brand identity trumps contrast here.
  // CVD variants + HC mode strictly enforced — contrast is their whole purpose.
  const isBrandStandard = definition.brand && !definition.highContrast && !definition.cvdVariant;

  const pairs = [
    // Primary base (600): informational for brand, UI-threshold (3:1) for rest
    ['primary base (600) on page-bg',      scales.primary[600],  pageBgHex,
      isBrandStandard ? 0 : 3, isBrandStandard ? 'info' : 'strict'],
    // Primary emphasis (800): informational for brand, AA (4.5:1) for rest
    ['primary emphasis (800) on page-bg',  scales.primary[800],  pageBgHex,
      isBrandStandard ? 0 : 4.5, isBrandStandard ? 'info' : 'strict'],
    // Neutral always strict — independent of brand
    ['neutral base (600) on page-bg',      scales.neutral[600],  pageBgHex, 3,   'strict'],
    ['neutral emphasis (800) on page-bg',  scales.neutral[800],  pageBgHex, 4.5, 'strict'],
  ];
  return pairs.map(([label, fg, bg, target, mode]) => ({
    label,
    ratio: Math.round(contrastRatio(fg, bg) * 10) / 10,
    pass: target === 0 ? true : contrastRatio(fg, bg) >= target,
    target,
    mode,
  }));
}


/* ================================================================
   10b. FOCUS RING + HIGHLIGHT LINK TOKENS
   ================================================================ */

/**
 * Compute focus and highlight link colours per theme.
 * Uses status colours (CVD-safe by design) — never primary/secondary.
 * Focus = single square ring using --color-Info (distinct from all theme palettes).
 * Highlight = same colour, thicker border for visibility.
 * HC themes = black/white.
 */
/**
 * Focus + highlight hue placement via gap-split between primary and secondary.
 */
function hueDist(a, b) {
  const d = Math.abs(a - b);
  return Math.min(d, 360 - d);
}

function computeFocusHighlightTokens(scales, pageBg, isDark, isHC = false) {
  const pageBgHex = pageBg['page-bg'];
  const cardBgHex = pageBg['page-bg-raised'];

  // Gap-split: place focus + highlight in the largest hue gap between primary and secondary
  // Guarantees maximum distance from both brand colours
  const pri = scales.primary || {};
  const sec = scales.secondary || {};
  const priHue = chroma(pri[600] || '#0088ff').get('oklch.h') || 220;
  const secHue = chroma(sec[600] || '#cc79a7').get('oklch.h') || 330;

  // Find the two gaps between primary and secondary on the colour wheel
  const gapCW = ((secHue - priHue) + 360) % 360;   // clockwise from pri to sec
  const gapCCW = 360 - gapCW;                        // counter-clockwise
  let gapStart, gapSize;
  if (gapCW >= gapCCW) {
    gapStart = priHue;
    gapSize = gapCW;
  } else {
    gapStart = secHue;
    gapSize = gapCCW;
  }
  // Place focus at 1/3 into gap, highlight at 2/3
  const focusTargetHue = (gapStart + gapSize / 3) % 360;
  const highlightTargetHue = (gapStart + (gapSize * 2) / 3) % 360;

  // Compute hex at the gap-split hues — max chroma, contrast-checked
  // Neon: absolute max chroma at the lightness that gives 4.5:1 on light, or bright on dark
  // Light mode: find the brightest L that still passes contrast, then max chroma at that L
  // Dark mode: high L, max chroma
  const targetL = isDark ? 0.82 : 0.62;
  let focusHex = safeOklch(targetL, maxChromaForHue(focusTargetHue, targetL), focusTargetHue);
  let highlightHex = safeOklch(targetL, maxChromaForHue(highlightTargetHue, targetL), highlightTargetHue);

  // Contrast-check: 4.5:1 AA standard, 7:1 AAA for HC variants.
  // Chroma kept high so colour distinguishes from neutral text
  const minRatio = isHC ? 7 : 4.5;
  let fAttempts = 0;
  let fL = targetL;
  while (fAttempts < 30 && (
    contrastRatio(focusHex, pageBgHex) < minRatio ||
    contrastRatio(focusHex, cardBgHex) < minRatio
  )) {
    fL += isDark ? 0.03 : -0.03;
    focusHex = safeOklch(fL, maxChromaForHue(focusTargetHue, fL), focusTargetHue);
    fAttempts++;
  }

  let hAttempts = 0;
  let hL = targetL;
  while (hAttempts < 30 && (
    contrastRatio(highlightHex, pageBgHex) < minRatio ||
    contrastRatio(highlightHex, cardBgHex) < minRatio
  )) {
    hL += isDark ? 0.03 : -0.03;
    highlightHex = safeOklch(hL, maxChromaForHue(highlightTargetHue, hL), highlightTargetHue);
    hAttempts++;
  }

  return {
    'focus-color':          focusHex,
    'focus-bg':             pageBgHex,
    'highlight-link-color': highlightHex,
  };
}


/* ================================================================
   9. CSS OUTPUT
   ================================================================ */

function buildCSS(definition, scales, pageBg, status, focusHighlight) {
  const {
    name,
    primary: sourcePrimary,
    secondary: sourceSecondary,
    luminance = 'light',
    chroma: chromaPreset = 'brand',
    neutral: neutralType = 'warm',
  } = definition;

  const isDark = luminance === 'dark';
  const L = [];
  const ln = (s = '') => L.push(s);

  // Resolve title/sample for header comment
  const title = definition.title;
  const sample = definition.sample;
  const titleStr = title
    ? (typeof title === 'string' ? title : `${title.fun || ''} / ${title.pro || ''}`)
    : name;
  const sampleStr = sample
    ? (typeof sample === 'string' ? sample : `${sample.fun || ''} / ${sample.pro || ''}`)
    : '';

  ln(`/**`);
  ln(` * Theme: ${name}`);
  ln(` * Title: ${titleStr}`);
  if (sampleStr) ln(` * Tagline: ${sampleStr}`);
  ln(` * Generated by theme-engine.js (OKLCH)`);
  ln(` * Primary: ${sourcePrimary} | Secondary: ${sourceSecondary}`);
  ln(` * Luminance: ${luminance} | Chroma: ${chromaPreset} | Neutral: ${neutralType}`);
  ln(` */`);
  ln();
  ln(`:root {`);

  // Semantic tokens (new API — migrate to these)
  //   Calm (light)  compresses into 200/300/400/500
  //   Greyscale     shifts down to 300/500/700/900 so tint sits clear of page-bg
  //   Standard      uses 200/400/600/800
  const isGreyscaleTheme = chromaPreset === 'grey' && !definition.brand && !definition.brandMono;
  const SEMANTIC_MAP = chromaPreset === 'calm'
    ? { 200: 'tint', 300: 'mid', 400: 'base', 500: 'emphasis' }
    : isGreyscaleTheme
    ? { 300: 'tint', 400: 'mid', 600: 'base', 800: 'emphasis' }
    : { 200: 'tint', 400: 'mid', 600: 'base', 800: 'emphasis' };
  // Contrast tokens — interaction/hover colour.
  // accentStrategy controls how contrast tokens are resolved:
  //   "emphasis"    — use emphasis position (default, safe, no author hex needed)
  //   "brand"       — author's accent hex, adapted per variant (nudged for contrast)
  //   "complement"  — auto-computed opposite hue of primary/secondary
  //   "contrast"    — auto-computed max-contrast colour against base
  //   "neutral"     — use neutral emphasis for hover (grey-toned, understated)
  const accentStrategy = definition.accentStrategy || 'emphasis';

  function computeAccent(strategy, baseHex) {
    if (!baseHex) return null;
    const [l, c, h] = chroma(baseHex).oklch();
    const hue = h || 0;
    const chr = c || 0.05;
    if (strategy === 'complement') {
      // Opposite hue, same chroma, lightness adjusted for contrast
      return safeOklch(l > 0.5 ? 0.35 : 0.70, chr, (hue + 180) % 360);
    }
    if (strategy === 'contrast') {
      // Max contrast: if base is light, go dark + slight chroma. Vice versa.
      return safeOklch(l > 0.5 ? 0.25 : 0.80, chr * 0.6, hue);
    }
    return null;
  }

  let priAccent = null;
  let secAccent = null;
  if (accentStrategy === 'brand') {
    priAccent = definition.primaryAccent || computeAccent('complement', sourcePrimary);
    secAccent = definition.secondaryAccent || computeAccent('complement', sourceSecondary);
  } else if (accentStrategy === 'complement' || accentStrategy === 'contrast') {
    priAccent = computeAccent(accentStrategy, sourcePrimary);
    secAccent = computeAccent(accentStrategy, sourceSecondary);
  }
  // "emphasis" and "neutral" don't set accents — handled in the loop below

  const contrastMap = {
    primary: priAccent,
    secondary: secAccent,
  };

  for (const [family, scale] of Object.entries(scales)) {
    ln(`  /* -- ${family.toUpperCase()} SCALE ---- */`);
    for (const [pos, semName] of Object.entries(SEMANTIC_MAP)) {
      if (scale[pos]) ln(`  --${family}-${semName}: ${scale[pos]};`);
    }
    // Contrast token resolution
    // Hover-change colour: needs 3:1 UI separation vs base AND page-bg
    const emphasisPos = (chromaPreset === 'calm' && !isDark) ? 500 : 800;
    const basePos = (chromaPreset === 'calm' && !isDark) ? 400 : 600;
    const baseHex = scale[basePos];
    const pageBgHex = pageBg['page-bg'];
    let contrastVal;
    if (accentStrategy === 'neutral') {
      // Neutral hover — use neutral emphasis for all families (grey-toned, understated)
      contrastVal = scales.neutral?.[emphasisPos] || scale[emphasisPos] || '';
    } else if (contrastMap[family] && baseHex) {
      // Author/computed accent — preserve hue, nudge lightness if below 3:1 UI
      contrastVal = ensureContrastAgainst(contrastMap[family], baseHex, pageBgHex, 3);
    } else {
      // Default (emphasis) — use same-family emphasis (already contrast-audited)
      contrastVal = scale[emphasisPos] || '';
    }
    if (contrastVal) ln(`  --${family}-contrast: ${contrastVal};`);
    ln();
  }

  // Zone meta (behavioural axes — CSS layers read these)
  const intensity = definition.intensity || 'full';
  // Contrast tier: compute text-emphasis vs page-bg ratio and classify.
  // Typography gates in typography.css read data-theme-contrast to bump text sizes.
  const emphasisPosition = (chromaPreset === 'calm' && !isDark) ? 500 : 800;
  const textEmphasisHex = scales.neutral[emphasisPosition] || scales.neutral[800];
  const pageBgHex = pageBg['page-bg'];
  const textBgRatio = textEmphasisHex && pageBgHex ? contrastRatio(textEmphasisHex, pageBgHex) : 21;
  const contrastTier = textBgRatio >= 7 ? 'strong'
    : textBgRatio >= 4.5 ? 'standard'
    : textBgRatio >= 3 ? 'soft'
    : 'minimal';
  ln(`  /* -- THEME META ---------------------------------- */`);
  ln(`  --theme-luminance: ${luminance};`);
  ln(`  --theme-chroma: ${chromaPreset};`);
  ln(`  --theme-intensity: ${intensity};`);
  ln(`  --theme-contrast: ${contrastTier};`);
  ln();

  // Page backgrounds (dedicated surface tokens — not part of neutral scale)
  ln(`  /* -- PAGE BACKGROUNDS ---------------------------- */`);
  for (const [k, v] of Object.entries(pageBg)) ln(`  --${k}: ${v};`);
  ln();

  // Black/white + shadow anchors (status colours live in tokens/status-colors.css)
  ln(`  /* -- BLACK/WHITE + SHADOW ----------------------- */`);
  for (const [k, v] of Object.entries(status)) ln(`  --${k}: ${v};`);
  ln();


  // Pattern opacity presets
  ln(`  /* -- PATTERN OPACITY PRESETS -------------------- */`);
  ln(`  --po-opacity-ghost: 0.08;`);
  ln(`  --po-opacity-subtle: 0.15;`);
  ln(`  --po-opacity-light: 0.25;`);
  ln(`  --po-opacity-medium: 0.40;`);
  ln(`  --po-opacity-bold: 0.60;`);
  ln(`  --po-opacity-vivid: 0.80;`);
  ln(`  --po-opacity-full: 1.0;`);
  ln();

  // Pattern motion defaults
  ln(`  /* -- PATTERN MOTION DEFAULTS -------------------- */`);
  ln(`  --pm-drift-speed: 6s;`);
  ln(`  --pm-drift-range: 10px;`);
  ln(`  --pm-breathe-scale: 1.04;`);
  ln(`  --pm-twinkle-min: 0.3;`);
  ln(`  --pm-rotate-range: 8deg;`);
  ln(`  --parallax-intensity: 1;`);
  ln();

  // Theme-specific media + ghost tokens
  ln(`  /* -- THEME-SPECIFIC ----------------------------- */`);
  ln(`  --media-brightness: ${isDark ? '0.86' : '1'};`);
  ln(`  --media-saturation: ${chromaPreset === 'grey' ? '0' : (isDark ? '0.90' : '1')};`);
  ln(`  --media-contrast: ${chromaPreset === 'grey' ? '1.05' : (isDark ? '0.98' : '1')};`);
  if (definition.highContrast) {
    ln(`  --svg-ghost-color: var(--neutral-mid);`);
  } else if (isDark) {
    ln(`  --svg-ghost-color: var(--shadow-Black);`);
  } else {
    ln(`  --svg-ghost-color: var(--neutral-mid);`);
  }

  // Focus + highlight tokens
  ln();
  ln(`  /* -- FOCUS + HIGHLIGHT TOKENS -------------------- */`);
  ln(`  --focus-color: ${focusHighlight['focus-color']};`);
  ln(`  --focus-bg: ${focusHighlight['focus-bg']};`);
  ln(`  --highlight-link-color: ${focusHighlight['highlight-link-color']};`);

  // HC-specific extras
  if (definition.highContrast) {
    ln(`  --a11y-hc-icon-filter: brightness(0) invert(${isDark ? '1' : '0'});`);
  }

  ln(`}`);

  return L.join('\n');
}


/* ================================================================
   10. MONO RAINBOW GENERATOR
   ================================================================ */

/**
 * Generate a mono rainbow — 7 colours × 4 tiers from one brand hex.
 *
 * Modes:
 *   'analogous'     — ±30° hue fan around brand hue (tonal siblings)
 *   'complementary' — ±30° hue fan around opposite hue (bold contrast)
 *   'split'         — 3 near primary + 4 near opposite (balanced tension)
 *   'reveal'        — grey → colour chroma ramp (colour emerging)
 *   'dissolve'      — colour → grey chroma ramp (colour fading)
 *
 * Options:
 *   luminance: 'light' | 'dark'
 *   hc: boolean         — wider chroma/lightness spread for HC
 *   cvdHue: number|null — override hue for CVD-safe output
 *
 * Returns: object of 28 CSS custom properties (--rainbow-1-tint through --rainbow-7-emphasis)
 */
export function generateMonoRainbow(brandHex, {
  mode = 'analogous',
  luminance = 'light',
  hc = false,
  cvdType = null, // 'protan' | 'deutan' | 'tritan' | null
} = {}) {
  const isDark = luminance === 'dark';
  const [, brandC, brandH] = chroma(brandHex).oklch();
  const hue = brandH || 0;
  const baseChr = brandC || 0.10;

  // CVD danger zones — any rainbow position that lands here gets nudged out.
  // Protan/deutan: reds (0-40°, 330-360°) and greens (100-165°) confusable.
  // Tritan: blues (200-260°) and yellows (60-110°) confusable.
  function isCvdUnsafe(h) {
    if (!cvdType) return false;
    const normH = ((h % 360) + 360) % 360;
    if (cvdType === 'protan' || cvdType === 'deutan') {
      return (normH >= 0 && normH <= 40) || (normH >= 100 && normH <= 165) || (normH >= 330 && normH <= 360);
    }
    if (cvdType === 'tritan') {
      return (normH >= 60 && normH <= 110) || (normH >= 200 && normH <= 260);
    }
    return false;
  }

  // Nudge an unsafe hue to the nearest safe zone edge + 15° padding.
  function cvdSafeHue(h) {
    if (!isCvdUnsafe(h)) return h;
    const normH = ((h % 360) + 360) % 360;
    if (cvdType === 'protan' || cvdType === 'deutan') {
      // Safe zones: 41-99° (yellow-green) and 166-329° (blue-violet-pink)
      const candidates = [45, 90, 170, 200, 270, 320];
      return candidates.reduce((best, c) => {
        const distBest = Math.min(Math.abs(normH - best), 360 - Math.abs(normH - best));
        const distC = Math.min(Math.abs(normH - c), 360 - Math.abs(normH - c));
        return distC < distBest ? c : best;
      });
    }
    if (cvdType === 'tritan') {
      // Safe zones: 0-59° (reds-oranges), 111-199° (greens-teals), 261-360° (violets-pinks)
      const candidates = [15, 40, 140, 175, 280, 335];
      return candidates.reduce((best, c) => {
        const distBest = Math.min(Math.abs(normH - best), 360 - Math.abs(normH - best));
        const distC = Math.min(Math.abs(normH - c), 360 - Math.abs(normH - c));
        return distC < distBest ? c : best;
      });
    }
    return h;
  }

  // Tier lightness targets (matching existing rainbow spec)
  const tierL = isDark
    ? (hc ? { tint: 0.25, mid: 0.38, base: 0.55, emphasis: 0.85 }
           : { tint: 0.30, mid: 0.42, base: 0.55, emphasis: 0.80 })
    : (hc ? { tint: 0.85, mid: 0.72, base: 0.55, emphasis: 0.45 }
           : { tint: 0.85, mid: 0.72, base: 0.60, emphasis: 0.50 });

  // Chroma multipliers per tier (emphasis is richest)
  const tierChrMult = hc
    ? { tint: 0.35, mid: 0.65, base: 1.00, emphasis: 0.80 }
    : { tint: 0.30, mid: 0.55, base: 1.00, emphasis: 0.65 };

  // Compute 7 hue + chroma pairs depending on mode
  function computePositions() {
    const spread = 30; // degrees each side
    const steps7 = [-3, -2, -1, 0, 1, 2, 3]; // -30° to +30°

    switch (mode) {
      case 'analogous':
        return steps7.map(s => ({
          h: (hue + s * (spread / 3) + 360) % 360,
          c: baseChr,
        }));

      case 'complementary': {
        const oppHue = (hue + 180) % 360;
        return steps7.map(s => ({
          h: (oppHue + s * (spread / 3) + 360) % 360,
          c: baseChr,
        }));
      }

      case 'split': {
        const oppHue = (hue + 180) % 360;
        // 3 near primary, 4 near opposite
        return [
          { h: (hue - 15 + 360) % 360, c: baseChr },
          { h: hue, c: baseChr },
          { h: (hue + 15) % 360, c: baseChr },
          { h: (oppHue - 20 + 360) % 360, c: baseChr },
          { h: (oppHue - 7 + 360) % 360, c: baseChr },
          { h: (oppHue + 7) % 360, c: baseChr },
          { h: (oppHue + 20) % 360, c: baseChr },
        ];
      }

      case 'reveal': {
        // Grey → colour: chroma ramps up across 7 positions
        const maxC = hc ? 0.10 : baseChr;
        return [0, 1, 2, 3, 4, 5, 6].map(i => ({
          h: hue,
          c: maxC * (i / 6), // 0.00 → maxC
        }));
      }

      case 'dissolve': {
        // Colour → grey: chroma ramps down across 7 positions
        const maxC = hc ? 0.10 : baseChr;
        return [0, 1, 2, 3, 4, 5, 6].map(i => ({
          h: hue,
          c: maxC * (1 - i / 6), // maxC → 0.00
        }));
      }

      default:
        return steps7.map(() => ({ h: hue, c: baseChr }));
    }
  }

  // Nudge any positions that landed in CVD danger zones, then de-duplicate:
  // if a position is too close to the PREVIOUS (already-spread) position,
  // push it 8° further. Iterative so each position compares to the one before
  // it (which may already have been nudged).
  const positions = computePositions().map(p => ({
    ...p,
    h: cvdSafeHue(p.h),
  }));
  // De-duplicate: each position must be ≥8° from ALL earlier positions.
  // Strategy: collect all CVD-safe candidate hues (the safe zone edges + the
  // positions that are already fine). Reassign colliders to the nearest unused
  // safe candidate.
  const usedHues = new Set();
  function isHueTaken(h) {
    for (const used of usedHues) {
      const diff = Math.min(Math.abs(h - used), 360 - Math.abs(h - used));
      if (diff < 8) return true;
    }
    return false;
  }

  // Build a pool of safe candidate hues spread across the full wheel
  const safeCandidates = [];
  for (let h = 0; h < 360; h += 5) {
    if (!isCvdUnsafe(h)) safeCandidates.push(h);
  }

  for (let i = 0; i < positions.length; i++) {
    if (!isHueTaken(positions[i].h)) {
      usedHues.add(positions[i].h);
      continue;
    }
    // Collision — find nearest unused safe hue
    let bestHue = positions[i].h;
    let bestDist = Infinity;
    for (const cand of safeCandidates) {
      if (isHueTaken(cand)) continue;
      const dist = Math.min(
        Math.abs(positions[i].h - cand),
        360 - Math.abs(positions[i].h - cand)
      );
      if (dist < bestDist) { bestDist = dist; bestHue = cand; }
    }
    positions[i] = { ...positions[i], h: bestHue };
    usedHues.add(bestHue);
  }
  const tokens = {};

  for (let i = 0; i < 7; i++) {
    const pos = positions[i];
    const n = i + 1; // 1-indexed for token names

    for (const [tierName, L] of Object.entries(tierL)) {
      const chr = Math.min(pos.c * tierChrMult[tierName], maxChromaForHue(pos.h, L) * 0.95);
      const hex = safeOklch(L, chr, pos.h);

      if (tierName === 'base') {
        tokens[`--rainbow-${n}`] = hex;
      } else {
        tokens[`--rainbow-${n}-${tierName}`] = hex;
      }
    }
  }

  return tokens;
}


/* ================================================================
   11. MAIN EXPORTS
   ================================================================ */

/**
 * Full result with intermediates — used by build script for auditing.
 */
export function generateThemeData(definition) {
  const {
    primary: rawPrimary,
    secondary: rawSecondary,
    luminance = 'light',
    chroma: chromaPreset = 'brand',
    neutral: neutralType = 'warm',
  } = definition;

  const isDark = luminance === 'dark';

  // If no secondary provided, default to same as primary (mono palette)
  let primary = rawPrimary;
  let secondary = rawSecondary || rawPrimary;
  const isMonoPalette = primary === secondary;

  // Brand mono: both scales use the same hue (no grey-out).
  // Default mono behaviour = primary coloured, secondary grey (accent + neutral).
  const useGreySecondary = isMonoPalette && !definition.brandMono;

  const monoHue = isMonoPalette ? (chroma(primary).get('oklch.h') || 0) : null;

  // 1. Compute page backgrounds first — HC generators need pageBg for contrast
  let pageBg = computePageBackgrounds(isDark, chromaPreset);
  if (definition.highContrast && isMonoPalette && definition.brandMono) {
    // Mono HC (vivid): brand hex + black/white → coloured surface.
    // Both scales are the brand hue, so the bg can carry it too — full mono identity.
    // Chroma muted 0.5× to keep text readable on top.
    const [, brandC, brandH] = chroma(primary).oklch();
    const c = (brandC || 0.1) * 0.5;
    pageBg = isDark
      ? {
          'page-bg':         chroma.oklch(0.22, c,        brandH || 0).hex(),
          'page-bg-raised':  chroma.oklch(0.30, c,        brandH || 0).hex(),
          'page-bg-sunken':  chroma.oklch(0.16, c * 0.8,  brandH || 0).hex(),
          'page-bg-overlay': chroma.oklch(0.34, c,        brandH || 0).hex(),
        }
      : {
          'page-bg':         chroma.oklch(0.92, c * 0.7,  brandH || 0).hex(),
          'page-bg-raised':  chroma.oklch(0.96, c * 0.5,  brandH || 0).hex(),
          'page-bg-sunken':  chroma.oklch(0.86, c * 0.7,  brandH || 0).hex(),
          'page-bg-overlay': chroma.oklch(0.98, c * 0.4,  brandH || 0).hex(),
        };
  } else if (definition.highContrast && isMonoPalette && !definition.brandMono && definition.chroma !== 'calm') {
    // Windows mono HC: brand-tinted mid-grey bg with brand accent on top.
    // Reads as "high-contrast greyscale UI" — brand pop against neutral surface.
    const brandH = chroma(primary).get('oklch.h') || 0;
    pageBg = isDark
      ? {
          'page-bg':         chroma.oklch(0.30, 0.012, brandH).hex(),
          'page-bg-raised':  chroma.oklch(0.40, 0.012, brandH).hex(),
          'page-bg-sunken':  chroma.oklch(0.22, 0.010, brandH).hex(),
          'page-bg-overlay': chroma.oklch(0.44, 0.012, brandH).hex(),
        }
      : {
          'page-bg':         chroma.oklch(0.78, 0.008, brandH).hex(),
          'page-bg-raised':  chroma.oklch(0.86, 0.006, brandH).hex(),
          'page-bg-sunken':  chroma.oklch(0.70, 0.010, brandH).hex(),
          'page-bg-overlay': chroma.oklch(0.90, 0.005, brandH).hex(),
        };
  } else if (definition.chroma === 'calm' && !definition.brand && !definition.brandMono && definition.highContrast) {
    // Calm HC: whisper-grey bg with input hue tint (surface shows colour identity).
    // Dark bg lifted to L=0.32 (not 0.22) and chroma bumped so hue is visible on dark.
    const calmHue = chroma(primary).get('oklch.h') || 0;
    pageBg = isDark
      ? {
          'page-bg':         chroma.oklch(0.32, 0.020, calmHue).hex(),
          'page-bg-raised':  chroma.oklch(0.38, 0.020, calmHue).hex(),
          'page-bg-sunken':  chroma.oklch(0.26, 0.018, calmHue).hex(),
          'page-bg-overlay': chroma.oklch(0.42, 0.020, calmHue).hex(),
        }
      : {
          'page-bg':         chroma.oklch(0.92, 0.012, calmHue).hex(),
          'page-bg-raised':  chroma.oklch(0.96, 0.008, calmHue).hex(),
          'page-bg-sunken':  chroma.oklch(0.88, 0.012, calmHue).hex(),
          'page-bg-overlay': chroma.oklch(0.94, 0.008, calmHue).hex(),
        };
  } else if (definition.chroma === 'calm' && !definition.brand && !definition.brandMono) {
    // Calm non-HC: static warm cream (light) / soft warm mid-dark (dark).
    // Dark bg lifted to L=0.36 so mid/base can sit darker without losing contrast —
    // narrower range = softer calm feel, less harsh charcoal.
    pageBg = isDark
      ? {
          'page-bg':         '#423b38',  // warm mid-dark L=0.36
          'page-bg-raised':  '#4e4643',  // raised L=0.40
          'page-bg-sunken':  '#362f2d',  // sunken L=0.30
          'page-bg-overlay': '#554c49',  // overlay L=0.44
        }
      : {

          'page-bg':         '#f2edeb',
          'page-bg-raised':  '#f8f4f3',
          'page-bg-sunken':  '#eae3e1',
          'page-bg-overlay': '#f8f4f3',
        };
  } else if (definition.chroma === 'grey' && !definition.brand && !definition.brandMono && !definition.highContrast && !isDark) {
    // Greyscale non-HC light: static warm cream (no hue tint). Same neutral
    // surface across all input hues — hue only shows in the tinted primary scales.
    pageBg = {
      'page-bg':         '#ececec',
      'page-bg-raised':  '#f4f4f4',
      'page-bg-sunken':  '#e0e0e0',
      'page-bg-overlay': '#efefef',
    };
  } else if (definition.highContrast && definition.chroma === 'grey' && !definition.brand && !definition.brandMono) {
    // Greyscale HC: bg carries the hue tint. Dark lifted to L=0.32 with C=0.020
    // so hue is visible on dark (matches calm HC dark bg). Primary/secondary stay
    // as tinted greys — bg does the colour-identity work.
    const greyHue = chroma(primary).get('oklch.h') || 0;
    pageBg = isDark
      ? {
          'page-bg':         chroma.oklch(0.32, 0.020, greyHue).hex(),
          'page-bg-raised':  chroma.oklch(0.38, 0.020, greyHue).hex(),
          'page-bg-sunken':  chroma.oklch(0.26, 0.018, greyHue).hex(),
          'page-bg-overlay': chroma.oklch(0.42, 0.020, greyHue).hex(),
        }
      : {
          'page-bg':         chroma.oklch(0.93, 0.010, greyHue).hex(),
          'page-bg-raised':  chroma.oklch(0.96, 0.008, greyHue).hex(),
          'page-bg-sunken':  chroma.oklch(0.88, 0.012, greyHue).hex(),
          'page-bg-overlay': chroma.oklch(0.95, 0.010, greyHue).hex(),
        };
  } else if (definition.highContrast) {
    // HC NEVER uses pure #000 or #fff — both cause halation/glare on screen.
    // Bumped to L=0.20 dark / L=0.93 light. Still AAA against contrast-targeted
    // scales, but visibly softened.
    pageBg = isDark
      ? { 'page-bg': '#252222', 'page-bg-raised': '#332e2e', 'page-bg-sunken': '#1c1919', 'page-bg-overlay': '#3c3636' }
      : { 'page-bg': '#ededed', 'page-bg-raised': '#f6f6f6', 'page-bg-sunken': '#e2e2e2', 'page-bg-overlay': '#f2f2f2' };
  } else if (definition.calmHC) {
    // Calm HC: keep calm scales but swap bg → brand-tinted whisper grey for higher
    // contrast without harsh near-pure surfaces. Cooler/greyer than warm-cream calm.
    const brandHue = chroma(primary).get('oklch.h') || 0;
    pageBg = isDark
      ? {
          'page-bg':         chroma.oklch(0.30, 0.008, brandHue).hex(),
          'page-bg-raised':  chroma.oklch(0.38, 0.008, brandHue).hex(),
          'page-bg-sunken':  chroma.oklch(0.22, 0.008, brandHue).hex(),
          'page-bg-overlay': chroma.oklch(0.42, 0.008, brandHue).hex(),
        }
      : {
          'page-bg':         chroma.oklch(0.88, 0.005, brandHue).hex(),
          'page-bg-raised':  chroma.oklch(0.94, 0.005, brandHue).hex(),
          'page-bg-sunken':  chroma.oklch(0.82, 0.005, brandHue).hex(),
          'page-bg-overlay': chroma.oklch(0.96, 0.005, brandHue).hex(),
        };
  }

  // 2. Generate scales — pick the right generator per mode:
  //    Brand light:  sacred 600/800 hex, rest interpolated
  //    Brand dark:   muted from brand hue, purpose-built for dark bg
  //    HC:           contrast-targeted from hue, AAA ratios
  //    Global light: single-hex lightness curve
  //    Global dark:  muted from hue
  let priScale, secScale;

  // Standalone greyscale themes (chroma: 'grey' + not brand-derived) use the
  // greyscale scale — simple lightness ladder preserving input hue at low chroma.
  const isGreyscale = definition.chroma === 'grey' && !definition.brand && !definition.brandMono;
  // Standalone calm themes — chalky pastel, ADHD/migraine-friendly. Same isolated
  // path as greyscale but with more visible colour identity (chroma 0.04 vs 0.02)
  // and compressed lightness map (everything in upper-mid for low glare).
  const isCalm = definition.chroma === 'calm' && !definition.brand && !definition.brandMono;

  if (isCalm) {
    priScale = generateCalmScale(primary);
    secScale = generateCalmScale(secondary);
    // Calm HC: deeper colour tint + stronger contrast. Base 4.5+, emphasis 7+.
    // Chroma bumped to 0.055 (deeper hue whisper), L dropped for contrast.
    // HC-only overrides — doesn't affect non-HC calm values.
    if (definition.highContrast && !isDark) {
      const hcBump = (s) => {
        const [, , h] = chroma(s[400]).oklch();
        const hue = h || 0;
        // Stepped chroma lets ΔE hit green without emph going too dark/bright.
        s[200] = chroma.oklch(0.78, 0.035, hue).hex();  // tint — ΔE 10+ vs HC bg
        s[300] = chroma.oklch(0.50, 0.055, hue).hex();  // mid — 4.6+:1 across all hues
        s[400] = chroma.oklch(0.39, 0.060, hue).hex();  // base — 7.6:1, ΔE 10+ vs mid
        s[500] = chroma.oklch(0.28, 0.080, hue).hex();  // emphasis — 11.66:1, ΔE 10+ vs base
      };
      hcBump(priScale);
      hcBump(secScale);
    }
  } else if (isGreyscale) {
    priScale = generateGreyscaleScale(primary);
    secScale = generateGreyscaleScale(secondary);
    // Differentiate primary and secondary on light greyscale — otherwise they
    // render identically since the generator uses fixed lightness positions.
    // WCAG AA forces both primary and secondary to sit dark enough (≥4.5:1) on
    // the light page bg, so we can't shift secondary lighter. Instead, secondary
    // takes a darker position at each semantic slot — reads as "primary is the
    // branded colour, secondary is supporting text" with a clear visual gap.
    if (!isDark) {
      // HC: primary lifts to AAA (7:1) on light bg. Body text comfort stays put
      // because body uses neutral, not primary.
      // Emphasis L=0.22 → ΔE > 10 below base, sits as clear strongest tier.
      const isHC = definition.highContrast;
      const priBase = isHC ? 0.40 : 0.48;   // HC 7.5:1 just over AAA floor
      const priEmph = isHC ? 0.28 : 0.28;   // HC 11.9:1, ΔE 10+ vs base, not blasted dark
      const midL = isHC ? 0.51 : 0.58;  // HC needs 4.5+ WCAG, non-HC needs 3+ AA
      const bumpPrimary = (s) => {
        const [, c, h] = chroma(s[600]).oklch();
        const hue = h || 0;
        s[400] = chroma.oklch(midL, c, hue).hex();
        s[600] = chroma.oklch(priBase, c, hue).hex();
        s[800] = chroma.oklch(priEmph, c, hue).hex();
      };
      // Non-HC secondary: darker than primary at all 4 positions (visual hierarchy).
      // HC secondary: same lightness as primary but halfway to grey (chroma halved),
      //               so it reads as "slightly more neutral version of primary" —
      //               sits between primary (tinted) and neutral (pure grey).
      // Secondary gets the same treatment as primary — differentiation is now
      // user-controlled via the preview slider (hue shift on input).
      // HC still gets halved chroma to read as "more neutral version of primary".
      const shiftDarker = (s) => {
        const [, c, h] = chroma(s[600]).oklch();
        const hue = h || 0;
        if (isHC) {
          const tintC = c * 0.7;
          s[300] = chroma.oklch(0.78, tintC, hue).hex();  // matches primary tint L
          s[400] = chroma.oklch(midL, tintC, hue).hex();
          s[600] = chroma.oklch(priBase, tintC, hue).hex();
          s[800] = chroma.oklch(priEmph, tintC, hue).hex();
        } else {
          // Non-HC: same values as primary (no forced darker shift).
          // User differentiates via slider when they want distinction.
          s[300] = chroma.oklch(0.78, c, hue).hex();
          s[400] = chroma.oklch(midL, c, hue).hex();
          s[600] = chroma.oklch(priBase, c, hue).hex();
          s[800] = chroma.oklch(priEmph, c, hue).hex();
        }
      };
      // Always lift primary mid — non-HC 3+ AA, HC 4.5+ AAA.
      const [, pc, ph] = chroma(priScale[600]).oklch();
      priScale[400] = chroma.oklch(midL, pc, ph || 0).hex();
      // HC: drop primary tint a touch darker so it reads against light bg L=0.93.
      if (isHC) {
        priScale[300] = chroma.oklch(0.74, pc, ph || 0).hex();
        bumpPrimary(priScale);
      }
      shiftDarker(secScale);
    }
  } else if (definition.highContrast) {
    // HC always calculates — brand hex is hue source only
    priScale = generateHCScale(primary, pageBg['page-bg']);
    secScale = useGreySecondary ? generateGreyFullScale() : generateHCScale(secondary, pageBg['page-bg']);
  } else if (definition.cvdVariant && !isDark) {
    // CVD light (non-HC) — use brand scale for normal saturation.
    // CVD-safe hues are already chosen for separation; use normal brand mapping
    // so CVD light sits at the same visual intensity as regular brand light,
    // and CVD-HC stays one tier above (uses generateHCScale via the HC branch).
    const pageBgHex = pageBg['page-bg'];
    priScale = generateBrandScale(primary, pageBgHex);
    secScale = useGreySecondary ? generateGreyFullScale() : generateBrandScale(secondary, pageBgHex);
  } else if (definition.cvdVariant && isDark) {
    // CVD dark (non-HC) — use dark scale (muted), same as regular brand dark.
    // Then CVD-dark-HC will visibly out-saturate this since it goes through HC.
    const pageBgHex = pageBg['page-bg'];
    priScale = generateDarkScale(primary, pageBgHex);
    secScale = useGreySecondary ? generateGreyFullScale() : generateDarkScale(secondary, pageBgHex);
  } else if (definition.brand && !isDark) {
    // Brand light — 600 is sacred (brand identity).
    // 700/800/900/950 = contrast-targeted against page bg (WCAG AA/AAA).
    // 100-500 = light decorative spread (audited ≥3:1 UI separately).
    const pageBgHex = pageBg['page-bg'];
    priScale = generateBrandScale(primary, pageBgHex);
    secScale = useGreySecondary ? generateGreyFullScale() : generateBrandScale(secondary, pageBgHex);
  } else if (isDark) {
    // Dark mode (brand or global) — muted hue, contrast-targeted for dark bg
    const pageBgHex = pageBg['page-bg'];
    priScale = generateDarkScale(primary, pageBgHex);
    secScale = useGreySecondary ? generateGreyFullScale() : generateDarkScale(secondary, pageBgHex);
  } else {
    // Global light — same contrast-targeting as brand light.
    // All light themes now use generateBrandScale (contrast-targeted).
    // generateBrandScale so ALL light themes get contrast-targeted emphasis.
    const pageBgHex = pageBg['page-bg'];
    priScale = generateBrandScale(primary, pageBgHex);
    secScale = useGreySecondary ? generateGreyFullScale() : generateBrandScale(secondary, pageBgHex);
  }

  // If 600 is near-black (L < 0.25) and 800 is indistinct, replace 800
  // with the other scale's 900 (brand-tinted near-black).
  // Only fires for near-black — normal dark/vivid colours keep their calculated 800.
  if (!isMonoPalette && !definition.highContrast) {
    for (const [scale, otherScale] of [[priScale, secScale], [secScale, priScale]]) {
      const l600 = chroma(scale[600]).get('oklch.l');
      if (l600 >= 0.25) continue; // not near-black — keep calculated 800
      const l800 = chroma(scale[800]).get('oklch.l');
      const diff = Math.abs(l600 - l800);
      if (diff < 0.12 && otherScale[900]) {
        scale[800] = otherScale[900];
      }
    }
  }

  // If primary and secondary have near-identical hue (<15°), shift secondary
  // lightness in dark mode so they don't converge to the same colour.
  if (isDark && !isMonoPalette && !isCalm) {
    const [, , priH] = chroma(primary).oklch();
    const [, , secH] = chroma(secondary).oklch();
    const hueDiff = Math.abs((priH || 0) - (secH || 0));
    const hueClose = hueDiff < 15 || hueDiff > 345; // wraparound
    if (hueClose) {
      // Shift secondary: bump all positions +0.10 lightness for separation
      for (const pos of Object.keys(secScale).map(Number)) {
        const [sl, sc, sh] = chroma(secScale[pos]).oklch();
        secScale[pos] = safeOklch(Math.min(sl + 0.10, 0.95), sc * 1.15, sh || 0);
      }
    }
  }

  // Auto hue-shift for close hues removed — preview slider now controls this
  // explicitly. User shifts secondary hex input before passing to engine.

  // Auto hue-shift for close hues removed — preview slider now controls this
  // explicitly. User shifts secondary hex input before passing to engine.

  // Neutral: computed from theme type.
  //   warm  — hue 40° (default, organic feel)
  //   cool  — hue 240° (professional, tech)
  //   pure  — achromatic, no hue tint
  //   brand — tinted toward primary hue (cohesive)
  //   Mono themes always tint toward brand hue regardless.
  const COOL_HUE = 240;
  const neutralHueMap = {
    warm: NEUTRAL_HUE,
    cool: COOL_HUE,
    pure: 0,
    brand: chroma(primary).get('oklch.h') || NEUTRAL_HUE,
  };
  const neutralHue = neutralHueMap[neutralType] ?? NEUTRAL_HUE;
  // Calm: always warm-tinted neutral (warm grey, not pure grey) — gentler feel.
  const isCalmNeutral = definition.chroma === 'calm' && !definition.brand && !definition.brandMono;
  let neuScale = isCalmNeutral
    ? generateTintedNeutralScale(NEUTRAL_HUE, 0.010)
    : isMonoPalette
    ? generateTintedNeutralScale(monoHue, 0.02)
    : neutralType === 'pure' ? generatePureGreyScale()
    : neutralType === 'brand' ? generateTintedNeutralScale(neutralHue, 0.015)
    : generateNeutralScale(neutralHue);

  // Brand can override neutral with a custom hex (decorative use — borders, chrome, UI).
  const neutralHex = definition.neutralHex || null;

  // Text snapshot happens AFTER this point (after dark flip below) so it gets the right
  // light/dark values. But BEFORE any brand neutralHex override so text stays readable.
  const scales = { primary: priScale, secondary: secScale, neutral: neuScale };

  // Calm: neutral landed dusty so text-emphasis vs bg ratio falls into the "soft"
  // (3-4.5:1) or "minimal" (<3:1) tier — typography gate auto-bumps body size.
  // Accepts WCAG Large (3:1) as pass via size, not contrast.
  if (isCalm) {
    if (!isDark) {
      const isHC = definition.highContrast;
      // Calm light SEMANTIC_MAP: 200=tint, 300=mid, 400=base, 500=emphasis.
      // HC bumps neutral darker (base 4.5+, emphasis 7+) to match primary HC push.
      scales.neutral[200] = chroma.oklch(isHC ? 0.76 : 0.80, 0.008, NEUTRAL_HUE).hex();
      scales.neutral[300] = chroma.oklch(isHC ? 0.50 : 0.64, 0.010, NEUTRAL_HUE).hex();
      scales.neutral[400] = chroma.oklch(isHC ? 0.39 : 0.52, 0.010, NEUTRAL_HUE).hex();
      scales.neutral[500] = chroma.oklch(isHC ? 0.28 : 0.42, 0.010, NEUTRAL_HUE).hex();
    } else {
      // Calm dark: HC bumps mid to 4.5+ WCAG, base to 7+.
      const isHC = definition.highContrast;
      scales.neutral[200] = chroma.oklch(isHC ? 0.52 : 0.48, 0.010, NEUTRAL_HUE).hex();
      scales.neutral[300] = chroma.oklch(isHC ? 0.69 : 0.64, 0.010, NEUTRAL_HUE).hex();
      scales.neutral[400] = chroma.oklch(isHC ? 0.82 : 0.75, 0.010, NEUTRAL_HUE).hex();
      scales.neutral[500] = chroma.oklch(isHC ? 0.96 : 0.88, 0.010, NEUTRAL_HUE).hex();
    }
  }

  // Greyscale light: tint L=0.74 → ΔE >10 vs bg; mid L=0.58 → 3:1 UI;
  // base L=0.50 (or L=0.40 for HC → AAA 7:1); emphasis L=0.36 (or L=0.26 for HC
  // → ΔE >10 vs base 0.40).
  if (isGreyscale && !isDark) {
    scales.neutral[300] = chroma.oklch(0.74, 0, 0).hex();
    // Mid: HC needs 4.5+ (L=0.52), non-HC needs 3+ (L=0.58)
    scales.neutral[400] = chroma.oklch(definition.highContrast ? 0.51 : 0.58, 0, 0).hex();
    if (definition.highContrast) {
      scales.neutral[600] = chroma.oklch(0.40, 0, 0).hex();  // 7.5:1 just over AAA
      scales.neutral[800] = chroma.oklch(0.28, 0, 0).hex();  // 11.9:1, ΔE 10+ vs base
    } else {
      scales.neutral[800] = chroma.oklch(0.36, 0, 0).hex();
    }
    scales.neutral[900] = chroma.oklch(0.26, 0, 0).hex();
  }

  // 3. Neutral still needs the dark flip — primary/secondary have their own
  //    dark generators but neutral uses the same scale for both modes.
  // Also flip secondary if it's the grey scale (windows-mono pattern) — it
  // doesn't have a dark-aware generator, just static lightness positions.
  if (isDark) {
    const FLIP_PAIRS = [[100, 950], [200, 900], [300, 800], [400, 700], [500, 600]];
    const flipScale = (s) => {
      for (const [a, b] of FLIP_PAIRS) {
        if (s[a] !== undefined && s[b] !== undefined) {
          [s[a], s[b]] = [s[b], s[a]];
        }
      }
    };
    // Calm has its own neutral flip (CALM_FLIP_PAIRS below) — skip standard flip.
    if (!isCalm) {
      flipScale(scales.neutral);
      // Bump neutral tint and mid up — after flip they're too dark/close together
      scales.neutral[200] = scales.neutral[400];
      scales.neutral[400] = scales.neutral[500];
    }
    // Greyscale dark: tint L=0.42 → ΔE >10 vs bg; mid → 3:1 UI; base L=0.78 → Lc -60;
    // emphasis L=0.92 → Lc -87. ΔE >10 between each tier.
    if (isGreyscale) {
      scales.neutral[300] = chroma.oklch(0.42, 0, 0).hex();
      // Mid: HC needs 4.5+ (L=0.70), non-HC needs 3+ (L=0.62)
      scales.neutral[400] = chroma.oklch(definition.highContrast ? 0.70 : 0.62, 0, 0).hex();
      // Base: HC needs 7+ (L=0.82), non-HC needs 4.5+ (L=0.78)
      scales.neutral[600] = chroma.oklch(definition.highContrast ? 0.82 : 0.78, 0, 0).hex();
      // Emphasis: HC ΔE 10+ vs base requires L=0.96. Non-HC L=0.92.
      scales.neutral[800] = chroma.oklch(definition.highContrast ? 0.96 : 0.92, 0, 0).hex();
    }
    // Windows mono: secondary === grey scale (no dark generator), needs same flip
    if (useGreySecondary) flipScale(scales.secondary);
    // Calm dark: set explicit L values per position (hue kept from input).
    // Dark needs brighter mid/base than a simple flip gives — Lc penalises
    // light-on-dark so values must sit higher.
    if (isCalm) {
      const isHC = definition.highContrast;
      // Non-HC dark bg L=0.36. Mid L=0.64 → Lc -32 (orange UI). Base L=0.75
      // → WCAG 4.95:1. Emphasis L=0.88 → ΔE 10+ vs base.
      // HC dark bg L=0.32 hue-tinted. Same lightness ladder + chroma 0.055
      // (deeper hue identity to match HC light treatment).
      const CALM_DARK_L = isHC
        ? { 200: 0.52, 300: 0.70, 400: 0.82, 500: 0.95 }  // mid 4.6+, base 7+, emphasis ΔE green
        : { 200: 0.46, 300: 0.64, 400: 0.75, 500: 0.88 };
      // HC: stepped chroma per slot gives ΔE green across the chain.
      const CALM_DARK_C_HC = { 200: 0.035, 300: 0.055, 400: 0.060, 500: 0.090 };
      const applyCalmDark = (s) => {
        for (const pos of [200, 300, 400, 500]) {
          const [, c, h] = chroma(s[pos]).oklch();
          const targetC = isHC ? CALM_DARK_C_HC[pos] : c;
          s[pos] = safeOklch(CALM_DARK_L[pos], targetC, h || 0);
        }
      };
      applyCalmDark(scales.primary);
      applyCalmDark(scales.secondary);
    }
    // Greyscale themes use generateGreyscaleScale which is luminance-agnostic,
    // so primary/secondary need the flip in dark mode too.
    if (isGreyscale) {
      flipScale(scales.primary);
      flipScale(scales.secondary);
      // After flip, bump base + emphasis lighter on dark bg so coloured headings
      // pass contrast. HC targets 4.5:1 (qualifies AAA Large text). Non-HC
      // targets 4.5:1 AA too — HC's extra visibility comes from neutral text
      // (which hits 7:1) + bg hue tint, not from shouty-bright primary.
      const isHC = definition.highContrast;
      // HC: primary lifts to AAA (7:1) on dark bg. Body text comfort stays put
      // because body uses neutral, not primary.
      // Non-HC: base L=0.78 → ~6.3 WCAG, emphasis L=0.92 → ΔE >10 vs base.
      // HC: base L=0.82 → 7.28 AAA, emphasis L=0.96 → ΔE >10 vs base (gap narrows
      // because base lifted, so emphasis lifts too).
      const priBase = isHC ? 0.82 : 0.78;
      const priEmph = isHC ? 0.96 : 0.92;
      const darkMidL = isHC ? 0.70 : 0.62;  // HC 4.5+ WCAG, non-HC 3+ AA
      const bumpPrimary = (s) => {
        const [, c, h] = chroma(s[600]).oklch();
        s[300] = chroma.oklch(isHC ? 0.44 : 0.42, c, h || 0).hex();  // tint → ΔE >10 vs bg (HC bg lifted to L=0.32)
        s[400] = chroma.oklch(darkMidL, c, h || 0).hex();
        s[600] = chroma.oklch(priBase, c, h || 0).hex();
        s[800] = chroma.oklch(priEmph, c, h || 0).hex();
      };
      // HC: secondary matches primary L. Slightly more chroma (0.7×) so it reads
      // visibly distinct from primary in side-by-side swatches. Non-HC keeps the
      // lighter visual hierarchy shift.
      const bumpSecondary = (s) => {
        const [, c, h] = chroma(s[600]).oklch();
        const hue = h || 0;
        if (isHC) {
          const tintC = c * 0.7;  // a touch more chroma so secondary reads distinct from primary
          s[300] = chroma.oklch(0.44, tintC, hue).hex();  // tint → ΔE 10+ vs HC bg L=0.32
          s[400] = chroma.oklch(darkMidL, tintC, hue).hex();  // HC mid → 4.5+
          s[600] = chroma.oklch(priBase, tintC, hue).hex();
          s[800] = chroma.oklch(priEmph, tintC, hue).hex();
        } else {
          s[300] = chroma.oklch(0.42, c, hue).hex();  // tint → ΔE >10 vs bg
          s[400] = chroma.oklch(0.62, c, hue).hex();  // mid → 3:1 UI on dark bg + APCA Lc 30+
          s[600] = chroma.oklch(0.78, c, hue).hex();
          s[800] = chroma.oklch(0.92, c, hue).hex();  // emphasis → ΔE >10 vs base
        }
      };
      bumpPrimary(scales.primary);
      bumpSecondary(scales.secondary);
    }
  }

  // HC pageBg + scale overrides handled by generateHCScale above — no manual overrides needed

  // Text = snapshot of neutral AFTER dark flip (so dark themes get light text).
  // Taken BEFORE any brand neutralHex override so text stays readable.
  const textScale = { ...scales.neutral };

  // HC: clear 4-step text scale — softened from pure #000/#fff to avoid halation.
  if (definition.highContrast && isMonoPalette && definition.brandMono) {
    // Mono HC (vivid): text uses brand hue at opposite lightness.
    // Cyan bg → cyan text (just darker/lighter). Stays mono. AAA contrast.
    const [, brandC, brandH] = chroma(primary).oklch();
    const c = (brandC || 0.1) * 0.5;
    if (isDark) {
      // Dark coloured bg → light coloured text
      textScale[200] = chroma.oklch(0.50, c * 0.7, brandH || 0).hex();
      textScale[400] = chroma.oklch(0.65, c * 0.7, brandH || 0).hex();
      textScale[600] = chroma.oklch(0.80, c * 0.6, brandH || 0).hex();
      textScale[800] = chroma.oklch(0.92, c * 0.5, brandH || 0).hex();
    } else {
      // Light coloured bg → dark coloured text
      textScale[200] = chroma.oklch(0.55, c * 0.7, brandH || 0).hex();
      textScale[400] = chroma.oklch(0.40, c * 0.7, brandH || 0).hex();
      textScale[600] = chroma.oklch(0.25, c * 0.8, brandH || 0).hex();
      textScale[800] = chroma.oklch(0.15, c * 0.9, brandH || 0).hex();
    }
  } else if (definition.highContrast && isMonoPalette && !definition.brandMono) {
    // Windows mono HC: brand-coloured text on grey-tinted bg. Visible brand
    // colour in text — gives the theme identity without losing AAA contrast.
    const brandH = chroma(primary).get('oklch.h') || 0;
    if (isDark) {
      textScale[200] = chroma.oklch(0.50, 0.05, brandH).hex();
      textScale[400] = chroma.oklch(0.68, 0.06, brandH).hex();
      textScale[600] = chroma.oklch(0.82, 0.07, brandH).hex();
      textScale[800] = chroma.oklch(0.92, 0.08, brandH).hex();
    } else {
      textScale[200] = chroma.oklch(0.60, 0.06, brandH).hex();
      textScale[400] = chroma.oklch(0.48, 0.08, brandH).hex();
      textScale[600] = chroma.oklch(0.38, 0.10, brandH).hex();
      textScale[800] = chroma.oklch(0.30, 0.10, brandH).hex();
    }
  } else if (definition.highContrast) {
    if (isDark) {
      // HC dark: body text just clears AAA (7:1) — no brighter. Emphasis slightly
      // lifted for hierarchy but not glare-bright.
      textScale[200] = '#555555';  // tint — dimmest, muted labels
      textScale[400] = '#999999';  // mid — secondary text
      textScale[600] = '#b8b8b8';  // base — body text (~9:1, comfortable AAA)
      textScale[800] = '#cccccc';  // emphasis — soft grey-white (~11:1)
    } else {
      // HC light: body text just clears AAA on light bg. Emphasis softened from
      // near-black to dark charcoal so it doesn't punch.
      textScale[200] = '#aaaaaa';  // tint — dimmest, muted labels
      textScale[400] = '#666666';  // mid — secondary text
      textScale[600] = '#444444';  // base — body text (~9:1, comfortable AAA)
      textScale[800] = '#333333';  // emphasis — soft dark charcoal (~11:1)
    }
  } else if (definition.calmHC || (definition.chroma === 'calm' && definition.highContrast && !definition.brand && !definition.brandMono)) {
    // Calm HC: soft whisper-grey text tinted toward input hue. NOT trying to hit
    // AAA — calm HC is for ADHD/migraine users who want calm BUT a bit more
    // legibility than regular calm. Body text ~5:1, emphasis ~6:1 — gentle.
    // Standalone calm HC reuses this same text scale (input hue = brand hue).
    const brandHue = chroma(primary).get('oklch.h') || 0;
    if (isDark) {
      textScale[200] = chroma.oklch(0.50, 0.008, brandHue).hex();
      textScale[400] = chroma.oklch(0.58, 0.008, brandHue).hex();
      textScale[600] = chroma.oklch(0.66, 0.006, brandHue).hex();
      textScale[800] = chroma.oklch(0.74, 0.005, brandHue).hex();
    } else {
      // Light calm uses positions 200/300/400/500
      textScale[200] = chroma.oklch(0.68, 0.005, brandHue).hex();
      textScale[300] = chroma.oklch(0.60, 0.005, brandHue).hex();
      textScale[400] = chroma.oklch(0.55, 0.006, brandHue).hex();
      textScale[500] = chroma.oklch(0.50, 0.008, brandHue).hex();
    }
  }

  scales.text = textScale;

  // Now apply brand neutral override if provided (decorative — borders, chrome, UI).
  if (neutralHex) {
    scales.neutral = isDark
      ? generateDarkScale(neutralHex, pageBg['page-bg'])
      : generateBrandScale(neutralHex, pageBg['page-bg']);
  }

  // 5. Black/white/shadow anchors (status colours themselves bridge to rainbow in tokens CSS)
  const status = computeStatusColors();

  // HC overrides for status black/white
  if (definition.highContrast) {
    status['color-Black'] = '#000000';
    status['color-White'] = '#ffffff';
  }

  // Dark mode: swap White/Black so gradient endpoints flip automatically
  if (isDark) {
    [status['color-White'], status['color-Black']] = [status['color-Black'], status['color-White']];
  }

  // 5b. Compute focus + highlight tokens
  const focusHighlight = computeFocusHighlightTokens(scales, pageBg, isDark, !!definition.highContrast);

  // 6. Build CSS (scales are the API — no semantic layer)
  const css = buildCSS(definition, scales, pageBg, status, focusHighlight);

  // 7. Run audits (uses flipped scale hex values directly)
  const themeAudit = auditTheme(scales, pageBg, focusHighlight);
  const scaleAudit = auditScale(scales, pageBg, definition);

  return {
    css,
    scales,
    pageBg,
    status,
    audit: {
      theme: themeAudit,
      scale: scaleAudit,
    },
  };
}

/**
 * Main entry point — JSON definition to complete CSS string.
 */
export function generateThemeCSS(definition) {
  return generateThemeData(definition).css;
}