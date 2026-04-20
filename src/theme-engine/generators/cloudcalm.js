/**
 * cloudcalm.js — Calm theme generator (hue-only, calm-shaped, migraine-priority).
 *
 * Input is a HUE hint. All L and C values come from calm's own tables.
 * Safe for hypersensitive, migraine, ADHD, dyslexia users.
 *
 * Read docs/theme-engine-principles.md before editing. Hand-tuned constants
 * in this file are load-bearing — do not "simplify" without instruction.
 *
 * This is the STANDALONE calm generator. Brand-calm is a separate generator
 * (softcalm.js) and uses different rules.
 */

import chroma from 'chroma-js';
import {
  safeOklch,
  findLightnessForContrast,
  contrastRatio,
  ensureContrastAgainst,
} from '../shared/colour-maths.js';
import { cvd } from '../shared/cvd.js';

/* ================================================================
   CVD LOCK POLICY
   ================================================================
   Cloudcalm is STANDALONE (not brand) — primary is a hue hint, not a sacred
   brand hex, and calm overrides input L/C anyway. So when CVD runs for a
   CVD variant, nothing is locked: everything is shiftable.
*/
export const CVD_LOCKED_SLOTS = [];

/**
 * Convert an OKLCH triple to a hex string. Used at the boundary where
 * cloudcalm's internal functions need hex (they pass hex between each
 * other; hue is extracted again inside).
 */
function oklchToHex(oklch) {
  if (typeof oklch === 'string') return oklch;
  if (!oklch || typeof oklch !== 'object') return '#888888';
  return safeOklch(oklch.L, oklch.C || 0, oklch.H || 0);
}

/* ================================================================
   CONSTANTS — scale ladder
   ================================================================ */

export const SCALE_POSITIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Ported verbatim from theme-engine.js CALM_LIGHTNESS_MAP (line 515).
// Light mode reads positions 200/300/400/500 for tint/mid/base/emphasis.
export const CALM_LIGHTNESS_MAP = {
  100: 0.90,
  200: 0.82,
  300: 0.68,
  400: 0.52,
  500: 0.42,
  600: 0.46,
  700: 0.38,
  800: 0.30,
  900: 0.22,
  950: 0.16,
};

// Calm HC light scale — stepped chroma lets ΔE hit green without emph going
// too dark/bright. Ported verbatim from theme-engine.js (lines 1460-1472).
// Applied to primary + secondary scales at positions 200/300/400/500.
export const CALM_HC_LIGHT_SCALE = {
  200: { L: 0.78, C: 0.035 },  // tint — ΔE 10+ vs HC bg
  300: { L: 0.50, C: 0.055 },  // mid — 4.6+:1 across all hues
  400: { L: 0.39, C: 0.060 },  // base — 7.6:1, ΔE 10+ vs mid
  500: { L: 0.28, C: 0.080 },  // emphasis — 11.66:1, ΔE 10+ vs base
};

// Calm dark scale — explicit L per position (non-HC).
// Dark needs brighter mid/base than a simple flip gives.
// Ported from theme-engine.js (line 1721).
export const CALM_DARK_SCALE = {
  200: 0.46,  // tint
  300: 0.64,  // mid
  400: 0.75,  // base (WCAG 4.95:1)
  500: 0.88,  // emphasis (ΔE 10+ vs base)
};

// Calm HC dark scale — same hue, deeper chroma, higher lightness for Lc.
// Ported from theme-engine.js (lines 1719-1723).
export const CALM_HC_DARK_L = {
  200: 0.52,  // tint
  300: 0.70,  // mid (4.6+:1)
  400: 0.82,  // base (7+:1)
  500: 0.95,  // emphasis (ΔE 10+ vs base)
};

export const CALM_HC_DARK_C = {
  200: 0.035,
  300: 0.055,
  400: 0.060,
  500: 0.090,
};

// Ported from theme-engine.js NEUTRAL_STEPS (line 98).
const NEUTRAL_STEPS = [
  { pos: 100, lightness: 0.97, saturation: 0.03 },
  { pos: 200, lightness: 0.90, saturation: 0.04 },
  { pos: 300, lightness: 0.82, saturation: 0.05 },
  { pos: 400, lightness: 0.72, saturation: 0.06 },
  { pos: 500, lightness: 0.60, saturation: 0.08 },
  { pos: 600, lightness: 0.48, saturation: 0.10 },
  { pos: 700, lightness: 0.36, saturation: 0.12 },
  { pos: 800, lightness: 0.26, saturation: 0.12 },
  { pos: 900, lightness: 0.18, saturation: 0.10 },
  { pos: 950, lightness: 0.12, saturation: 0.08 },
];

// Hue anchors.
const WARM_HUE = 40;
const COOL_HUE = 266;  // derived from HSL (221, 17%, 69.3%)
const NEUTRAL_HUE = 40;  // for calm's hand-tuned neutral overrides (matches old engine)

// Calm neutral overrides — hand-tuned L per position, per variant.
// Ported verbatim from theme-engine.js (lines 1643-1658).
// Only applied to positions 200/300/400/500 (the semantic positions calm reads).
// Chroma stays at 0.008-0.010 — very low so neutral stays perceptually grey.
export const CALM_NEUTRAL_OVERRIDES = {
  // Light mode
  light: {
    nonHC: { 200: { L: 0.80, C: 0.008 }, 300: { L: 0.64, C: 0.010 }, 400: { L: 0.52, C: 0.010 }, 500: { L: 0.42, C: 0.010 } },
    hc:    { 200: { L: 0.76, C: 0.008 }, 300: { L: 0.50, C: 0.010 }, 400: { L: 0.39, C: 0.010 }, 500: { L: 0.28, C: 0.010 } },
  },
  // Dark mode — calm has its own "flip equivalent", these are explicit values not a swap
  dark: {
    nonHC: { 200: { L: 0.48, C: 0.010 }, 300: { L: 0.64, C: 0.010 }, 400: { L: 0.75, C: 0.010 }, 500: { L: 0.88, C: 0.010 } },
    hc:    { 200: { L: 0.52, C: 0.010 }, 300: { L: 0.69, C: 0.010 }, 400: { L: 0.82, C: 0.010 }, 500: { L: 0.96, C: 0.010 } },
  },
};

// Semantic position mapping — calm reads 200/300/400/500 for tint/mid/base/emphasis
// in BOTH light and dark (dark uses the explicit tables above, not a flip).
export const CALM_SEMANTIC_MAP = { 200: 'tint', 300: 'mid', 400: 'base', 500: 'emphasis' };

/* ================================================================
   PRIMARY / SECONDARY SCALE — hue-only, calm-shaped
   ================================================================ */

/**
 * Calm scale — chalky pastel, ADHD/migraine-friendly.
 * Input OKLCH provides HUE only. L + C from calm's own tables per variant.
 *
 * Accepts either an OKLCH triple { L, C, H } or a hex string (for legacy
 * callers). The .H / hue extraction path is all we actually use.
 */
export function generateCalmScale(baseInput, { luminance = 'light', hc = false } = {}) {
  const hue = typeof baseInput === 'string'
    ? (chroma(baseInput).get('oklch.h') || 0)
    : (baseInput && typeof baseInput === 'object' ? (baseInput.H || 0) : 0);
  const scale = {};

  // Start with the base calm ladder (light non-HC reference).
  for (const pos of SCALE_POSITIONS) {
    const targetL = CALM_LIGHTNESS_MAP[pos];
    const chromaVal = targetL >= 0.75 ? 0.025
                    : targetL >= 0.50 ? 0.025
                    : 0.020;
    scale[pos] = safeOklch(targetL, chromaVal, hue);
  }

  // Apply variant-specific overrides at the semantic positions 200/300/400/500.
  const isDark = luminance === 'dark';

  if (hc && !isDark) {
    // Calm HC light — deeper chroma + stepped L
    for (const [pos, { L, C }] of Object.entries(CALM_HC_LIGHT_SCALE)) {
      scale[pos] = safeOklch(L, C, hue);
    }
  } else if (!hc && isDark) {
    // Calm dark non-HC — explicit L per position (no flip)
    for (const [pos, L] of Object.entries(CALM_DARK_SCALE)) {
      const chromaVal = L >= 0.75 ? 0.025 : 0.020;
      scale[pos] = safeOklch(L, chromaVal, hue);
    }
  } else if (hc && isDark) {
    // Calm HC dark — explicit L + stepped chroma
    for (const pos of Object.keys(CALM_HC_DARK_L)) {
      scale[pos] = safeOklch(CALM_HC_DARK_L[pos], CALM_HC_DARK_C[pos], hue);
    }
  }

  return scale;
}

/* ================================================================
   NEUTRAL SCALE — four precomputed modes + brand hex
   ================================================================ */

/**
 * Build a neutral scale for cloudcalm.
 *
 * Precomputed modes ("warm" / "cool" / "grey" / "grey-tint") produce the
 * full NEUTRAL_STEPS ladder, then calm-specific overrides are applied to
 * the four semantic positions (200/300/400/500).
 *
 * Brand hex mode uses the brand's hue at a slightly higher chroma (0.015),
 * same override pattern applied.
 */
export function generateCloudcalmNeutral(mode, { primaryHex, neutralHex, luminance = 'light', hc = false } = {}) {
  const scale = {};

  // ── Build the base ladder ────────────────────────────────────────
  if (mode === 'grey') {
    for (const { pos, lightness } of NEUTRAL_STEPS) {
      scale[pos] = chroma.oklch(lightness, 0, 0).hex();
    }
  } else {
    let hue, tintChroma;
    if (mode === 'warm') {
      hue = WARM_HUE;      tintChroma = 0.010;
    } else if (mode === 'cool') {
      hue = COOL_HUE;      tintChroma = 0.028;
    } else if (mode === 'grey-tint') {
      hue = chroma(primaryHex).get('oklch.h') || 0;
      tintChroma = 0.010;
    } else {
      // brand hex
      hue = chroma(neutralHex || primaryHex).get('oklch.h') || 0;
      tintChroma = 0.015;
    }

    for (const { pos, lightness } of NEUTRAL_STEPS) {
      scale[pos] = safeOklch(lightness, tintChroma, hue);
    }
  }

  // ── Apply calm-specific overrides at positions 200/300/400/500 ───
  // The hue used for the overrides matches the ladder's hue (for tinted scales)
  // or NEUTRAL_HUE for grey + warm. This preserves the calm look while using
  // the hand-tuned L values for contrast + ΔE separation.
  const isDark = luminance === 'dark';
  const variant = isDark ? 'dark' : 'light';
  const level = hc ? 'hc' : 'nonHC';
  const overrides = CALM_NEUTRAL_OVERRIDES[variant][level];

  // For non-grey ladders, use the ladder's hue; for grey, keep chroma 0.
  let overrideHue;
  if (mode === 'grey') {
    overrideHue = 0;
  } else if (mode === 'warm') {
    overrideHue = NEUTRAL_HUE;  // matches old engine's use of NEUTRAL_HUE
  } else if (mode === 'cool') {
    overrideHue = COOL_HUE;
  } else if (mode === 'grey-tint') {
    overrideHue = chroma(primaryHex).get('oklch.h') || 0;
  } else {
    overrideHue = chroma(neutralHex || primaryHex).get('oklch.h') || 0;
  }

  for (const [pos, { L, C }] of Object.entries(overrides)) {
    const chr = mode === 'grey' ? 0 : C;
    scale[pos] = chroma.oklch(L, chr, overrideHue).hex();
  }

  return scale;
}

/* ================================================================
   TEXT SCALE — same modes as neutral, plus WCAG targeting for brand hex
   ================================================================ */

/**
 * Build a text scale for cloudcalm — 4 semantic positions.
 *
 * Text was NOT hand-tuned (unlike primary/secondary/neutral). For now, text
 * uses WCAG contrast search against the resolved page-bg to guarantee
 * readability at each position. Hand-tuning comes later.
 *
 * Targets per variant:
 *   Calm non-HC bumps body text to WCAG Large (1.2rem+): AA = 3:1, AAA = 4.5:1
 *   Calm HC uses normal body size: AA = 4.5:1, AAA = 7:1
 *
 * Mode determines the hue driving the text colour:
 *   "warm"       → warm neutral hue (40°)
 *   "cool"       → cool neutral hue (266°)
 *   "grey"       → chroma 0 (pure grey)
 *   "grey-tint"  → primary hue at whisper chroma
 *   brand hex    → text hex's hue at slightly higher chroma
 */
export function generateCloudcalmText(mode, { primaryHex, textHex, pageBgHex, luminance = 'light', hc = false } = {}) {
  // Resolve hue + chroma per mode.
  let hue, chromaVal;
  if (mode === 'grey') {
    hue = 0;           chromaVal = 0;
  } else if (mode === 'warm') {
    hue = WARM_HUE;    chromaVal = 0.010;
  } else if (mode === 'cool') {
    hue = COOL_HUE;    chromaVal = 0.028;
  } else if (mode === 'grey-tint') {
    hue = chroma(primaryHex).get('oklch.h') || 0;
    chromaVal = 0.010;
  } else {
    // brand hex supplied
    hue = chroma(textHex).get('oklch.h') || 0;
    chromaVal = 0.020;
  }

  // WCAG contrast targets per variant.
  const tTint     = 1.3;             // decorative, no floor
  const tMid      = hc ? 3.0 : 1.8;  // HC UI 3:1 / non-HC decorative
  const tBase     = hc ? 4.5 : 3.0;  // HC AA / non-HC AA Large
  const tEmphasis = hc ? 7.0 : 4.5;  // HC AAA / non-HC AAA Large

  const build = (target) => {
    const L = findLightnessForContrast(pageBgHex, hue, chromaVal, target);
    return chromaVal === 0
      ? chroma.oklch(L, 0, 0).hex()
      : safeOklch(L, chromaVal, hue);
  };

  return {
    tint:     build(tTint),
    mid:      build(tMid),
    base:     build(tBase),
    emphasis: build(tEmphasis),
  };
}

/* ================================================================
   PAGE BACKGROUND — five modes × light/dark × HC/non-HC
   ================================================================ */

/**
 * Resolve calm's page backgrounds.
 *
 * Warm + cool + grey modes use fixed hexes (warm cream / cool equivalent / pure grey).
 * Neutral mode follows whatever tertiary was set to.
 * Tint and deep are hue-tinted whispers — deep at the HC chroma level,
 * tint at roughly half.
 * HC variant always uses deep formula regardless of bgMode.
 */
export function generateCloudcalmPageBg({
  luminance = 'light',
  hc = false,
  bgMode = 'warm',
  primaryHex,
  tertiaryMode,
} = {}) {
  const isDark = luminance === 'dark';

  // "neutral" bg mode = follow tertiary's mode
  const resolvedMode = bgMode === 'neutral' ? tertiaryMode : bgMode;

  // ── Warm fixed hexes (ported from theme-engine.js lines 669-686) ───
  if (resolvedMode === 'warm' || (resolvedMode === 'grey-tint' && !primaryHex)) {
    return isDark
      ? {
          'page-bg':         '#2c2828',
          'page-bg-raised':  '#3a3535',
          'page-bg-sunken':  '#221f1f',
          'page-bg-overlay': '#433d3d',
        }
      : {
          'page-bg':         '#f2edeb',
          'page-bg-raised':  '#f8f4f3',
          'page-bg-sunken':  '#eae3e1',
          'page-bg-overlay': '#f8f4f3',
        };
  }

  // ── Cool equivalent — same L values, hue 266°, chroma 0.010 ────────
  if (resolvedMode === 'cool') {
    const COOL_BG_C = 0.010;
    return isDark
      ? {
          'page-bg':         safeOklch(0.28, COOL_BG_C, COOL_HUE),
          'page-bg-raised':  safeOklch(0.34, COOL_BG_C, COOL_HUE),
          'page-bg-sunken':  safeOklch(0.24, COOL_BG_C, COOL_HUE),
          'page-bg-overlay': safeOklch(0.38, COOL_BG_C, COOL_HUE),
        }
      : {
          'page-bg':         safeOklch(0.95, COOL_BG_C, COOL_HUE),
          'page-bg-raised':  safeOklch(0.97, COOL_BG_C, COOL_HUE),
          'page-bg-sunken':  safeOklch(0.92, COOL_BG_C, COOL_HUE),
          'page-bg-overlay': safeOklch(0.97, COOL_BG_C, COOL_HUE),
        };
  }

  // ── Pure grey ──────────────────────────────────────────────────────
  if (resolvedMode === 'grey') {
    return isDark
      ? {
          'page-bg':         chroma.oklch(0.28, 0, 0).hex(),
          'page-bg-raised':  chroma.oklch(0.34, 0, 0).hex(),
          'page-bg-sunken':  chroma.oklch(0.24, 0, 0).hex(),
          'page-bg-overlay': chroma.oklch(0.38, 0, 0).hex(),
        }
      : {
          'page-bg':         chroma.oklch(0.95, 0, 0).hex(),
          'page-bg-raised':  chroma.oklch(0.97, 0, 0).hex(),
          'page-bg-sunken':  chroma.oklch(0.92, 0, 0).hex(),
          'page-bg-overlay': chroma.oklch(0.97, 0, 0).hex(),
        };
  }

  // ── Tint / Deep / HC — hue-tinted whisper ──────────────────────────
  // Ported from theme-engine.js HC hue-tinted bg (lines 1356-1365).
  // HC always uses the deeper chroma values.
  const hue = chroma(primaryHex || '#888888').get('oklch.h') || 0;
  const useDeep = resolvedMode === 'deep' || hc;

  if (isDark) {
    const cPageBg = useDeep ? 0.020 : 0.010;
    const cOther  = useDeep ? 0.018 : 0.009;
    return {
      'page-bg':         safeOklch(0.32, cPageBg, hue),
      'page-bg-raised':  safeOklch(0.38, cPageBg, hue),
      'page-bg-sunken':  safeOklch(0.26, cOther,  hue),
      'page-bg-overlay': safeOklch(0.42, cPageBg, hue),
    };
  }
  const cPageBg = useDeep ? 0.012 : 0.006;
  const cOther  = useDeep ? 0.008 : 0.004;
  return {
    'page-bg':         safeOklch(0.92, cPageBg, hue),
    'page-bg-raised':  safeOklch(0.96, cOther,  hue),
    'page-bg-sunken':  safeOklch(0.88, cPageBg, hue),
    'page-bg-overlay': safeOklch(0.94, cOther,  hue),
  };
}

/* ================================================================
   STATUS + SHADOW + BLACK/WHITE ANCHORS
   ================================================================ */

export function generateCloudcalmStatus() {
  return {
    'color-Black':  '#1a1a1a',
    'color-White':  '#fafafa',
    'shadow-Black': '#000000',
    'shadow-White': '#ffffff',
  };
}

/* ================================================================
   FOCUS + HIGHLIGHT TOKENS
   ================================================================ */

/**
 * Gap-split focus/highlight — placed in the largest hue gap between
 * primary and secondary. Ported from theme-engine.js computeFocusHighlightTokens.
 *
 * Minimum contrast: 4.5:1 (AA) in standard, 7:1 (AAA) in HC.
 */
export function generateCloudcalmFocusHighlight({ primaryHex, secondaryHex, pageBg, hc = false, luminance = 'light' } = {}) {
  const isDark = luminance === 'dark';
  const pageBgHex = pageBg['page-bg'];
  const cardBgHex = pageBg['page-bg-raised'];

  const priHue = chroma(primaryHex).get('oklch.h') || 220;
  const secHue = chroma(secondaryHex).get('oklch.h') || 330;

  const gapCW = ((secHue - priHue) + 360) % 360;
  const gapCCW = 360 - gapCW;
  let gapStart, gapSize;
  if (gapCW >= gapCCW) { gapStart = priHue; gapSize = gapCW; }
  else                 { gapStart = secHue; gapSize = gapCCW; }

  const focusTargetHue     = (gapStart + gapSize / 3) % 360;
  const highlightTargetHue = (gapStart + (gapSize * 2) / 3) % 360;

  const targetL  = isDark ? 0.82 : 0.62;
  const minRatio = hc ? 7 : 4.5;

  function nudgeForContrast(targetHue) {
    let L = targetL;
    let hex = safeOklch(L, 0.10, targetHue);
    for (let i = 0; i < 30; i++) {
      if (contrastRatio(hex, pageBgHex) >= minRatio && contrastRatio(hex, cardBgHex) >= minRatio) return hex;
      L += isDark ? 0.03 : -0.03;
      hex = safeOklch(L, 0.10, targetHue);
    }
    return hex;
  }

  return {
    'focus-color':          nudgeForContrast(focusTargetHue),
    'focus-bg':             pageBgHex,
    'highlight-link-color': nudgeForContrast(highlightTargetHue),
  };
}

/* ================================================================
   CONTRAST TOKEN — hover colour, UI 3:1 vs base + page-bg
   ================================================================ */

/**
 * Resolve the contrast hex for a scale.
 * If brand accent hex provided → nudge for UI 3:1 against base + page-bg.
 * Else → copy emphasis position.
 */
export function resolveContrastToken({ accentHex, baseHex, emphasisHex, pageBgHex }) {
  if (accentHex && baseHex) {
    return ensureContrastAgainst(accentHex, baseHex, pageBgHex, 3);
  }
  return emphasisHex;
}

/* ================================================================
   ORCHESTRATOR — assemble the full cloudcalm theme
   ================================================================ */

/**
 * Generate a complete cloudcalm theme.
 *
 * Inputs (from validator):
 *   primary, secondary      — OKLCH triples { L, C, H }
 *   primaryAccent?, secondaryAccent?, tertiaryAccent? — OKLCH triples or null
 *   tertiary:  OKLCH | "warm" | "cool" | "grey" | "grey-tint"
 *   text:      OKLCH | "warm" | "cool" | "grey" | "grey-tint"
 *   pageBg:    "warm" | "cool" | "grey" | "grey-tint" | "tint" | "deep" | null
 *
 * Variant:
 *   luminance: 'light' | 'dark'
 *   hc:        boolean
 *   cvd:       'protan' | 'deutan' | 'tritan' | null
 *
 * Returns: tokens object + cvdSafe + cvdNotes.
 */
export function generateCloudcalm(input, variant = {}) {
  const {
    primary,
    secondary,
    primaryAccent = null,
    secondaryAccent = null,
    tertiary = 'warm',
    tertiaryAccent = null,
    text = 'warm',
    pageBg = 'warm',
  } = input;
  const { luminance = 'light', hc = false, cvd: cvdType = null } = variant;

  // ── CVD pre-pass (if variant requires it) ──────────────────────────
  // Build CVD input from the slots that are actual colour data (not enums).
  // Cloudcalm locks nothing — everything shiftable.
  let cvdSafe = true;
  let cvdNotes = [];
  let workingSlots = { primary, secondary, primaryAccent, secondaryAccent, tertiary, tertiaryAccent, text };

  if (cvdType) {
    const cvdInput = {};
    for (const [slot, val] of Object.entries(workingSlots)) {
      if (val && typeof val === 'object' && val.H !== undefined) {
        cvdInput[slot] = { oklch: val, locked: CVD_LOCKED_SLOTS.includes(slot) };
      }
    }
    const result = cvd(cvdInput, cvdType);
    cvdSafe = result.cvdSafe;
    cvdNotes = result.notes;
    // Write CVD-adjusted OKLCH back into workingSlots
    for (const [slot, oklch] of Object.entries(result.oklchSet)) {
      workingSlots[slot] = oklch;
    }
  }

  // Convert OKLCH slots to hex for internal use (inner functions read hue from hex).
  const primaryHex         = oklchToHex(workingSlots.primary);
  const secondaryHex       = oklchToHex(workingSlots.secondary);
  const primaryAccentHex   = workingSlots.primaryAccent   ? oklchToHex(workingSlots.primaryAccent)   : null;
  const secondaryAccentHex = workingSlots.secondaryAccent ? oklchToHex(workingSlots.secondaryAccent) : null;
  const tertiaryAccentHex  = workingSlots.tertiaryAccent  ? oklchToHex(workingSlots.tertiaryAccent)  : null;
  const tertiaryIsHex = workingSlots.tertiary && typeof workingSlots.tertiary === 'object';
  const tertiaryHex = tertiaryIsHex ? oklchToHex(workingSlots.tertiary) : null;
  const textIsHex = workingSlots.text && typeof workingSlots.text === 'object';
  const textHex = textIsHex ? oklchToHex(workingSlots.text) : null;
  const tertiaryModeOrHex = tertiaryIsHex ? tertiaryHex : workingSlots.tertiary;
  const textModeOrHex     = textIsHex     ? textHex     : workingSlots.text;

  // 1. Page background (text WCAG targeting needs it)
  const bgTokens = generateCloudcalmPageBg({
    luminance, hc, bgMode: pageBg,
    primaryHex,
    tertiaryMode: typeof tertiaryModeOrHex === 'string' ? tertiaryModeOrHex : null,
  });
  const pageBgHex = bgTokens['page-bg'];

  // 2. Primary + secondary scales (variant-aware)
  const primaryScale   = generateCalmScale(primaryHex,   { luminance, hc });
  const secondaryScale = generateCalmScale(secondaryHex, { luminance, hc });

  // 3. Neutral scale (variant-aware, with calm overrides)
  const neutralScale = generateCloudcalmNeutral(
    tertiaryIsHex ? 'brand' : tertiaryModeOrHex,
    { primaryHex, neutralHex: tertiaryIsHex ? tertiaryHex : null, luminance, hc }
  );

  // 4. Text scale (variant-aware)
  const textScale = generateCloudcalmText(
    textIsHex ? 'brand' : textModeOrHex,
    { primaryHex, textHex: textIsHex ? textHex : null, pageBgHex, luminance, hc }
  );

  // 5. Status + shadow anchors
  const status = generateCloudcalmStatus();

  // 6. Focus + highlight
  const focusHighlight = generateCloudcalmFocusHighlight({
    primaryHex,
    secondaryHex,
    pageBg: bgTokens,
    hc,
    luminance,
  });

  // 7. Contrast tokens — resolved per scale, at calm's base/emphasis positions (400/500)
  const primaryBase      = primaryScale[400];
  const secondaryBase    = secondaryScale[400];
  const neutralBase      = neutralScale[400];
  const primaryEmphasis  = primaryScale[500];
  const secondaryEmphasis = secondaryScale[500];
  const neutralEmphasis  = neutralScale[500];

  const contrast = {
    primary: resolveContrastToken({
      accentHex: primaryAccentHex, baseHex: primaryBase,
      emphasisHex: primaryEmphasis, pageBgHex,
    }),
    secondary: resolveContrastToken({
      accentHex: secondaryAccentHex, baseHex: secondaryBase,
      emphasisHex: secondaryEmphasis, pageBgHex,
    }),
    neutral: resolveContrastToken({
      accentHex: tertiaryIsHex ? tertiaryAccentHex : null,
      baseHex: neutralBase,
      emphasisHex: neutralEmphasis, pageBgHex,
    }),
  };

  // 8. Assemble output — 4 semantic positions per scale + contrast
  return {
    meta: {
      theme: 'cloudcalm',
      luminance,
      hc,
      cvd: cvdType,
      cvdSafe,
      cvdNotes,
      chromaZone: 'calm',        // stacks with HC — fires theme-chroma-calm.css + high-contrast.css
      intensityZone: 'soft',     // reserved — cloudcalm is always soft intensity
      bgMode: pageBg,
      tertiaryMode: tertiary,
      textMode: text,
    },
    scales: {
      primary: {
        tint:     primaryScale[200],
        mid:      primaryScale[300],
        base:     primaryScale[400],
        emphasis: primaryScale[500],
        contrast: contrast.primary,
      },
      secondary: {
        tint:     secondaryScale[200],
        mid:      secondaryScale[300],
        base:     secondaryScale[400],
        emphasis: secondaryScale[500],
        contrast: contrast.secondary,
      },
      neutral: {
        tint:     neutralScale[200],
        mid:      neutralScale[300],
        base:     neutralScale[400],
        emphasis: neutralScale[500],
        contrast: contrast.neutral,
      },
      text: textScale,
    },
    pageBg: bgTokens,
    status,
    focusHighlight,
  };
}
