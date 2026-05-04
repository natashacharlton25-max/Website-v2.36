/**
 * vivid.js — High-chroma brand theme generator.
 *
 * Vivid is the opposite of cloudcalm on the chroma axis: full saturation,
 * contrast-targeted lightness, AAA-normal readability without text-size boost.
 *
 * Architecture:
 *   - Primary/secondary SCALES use contrast-targeted lightness (not L map).
 *     Chroma capped at 0.20 (non-HC) / 0.22 (HC). Hue-only input.
 *   - Neutral, text, bg, status, focus, shadow tokens: SAME as cloudcalm.
 *     Vivid shares the comfort surfaces — only the brand scales differ.
 *   - No text-size boost. Vivid relies on raw contrast (7:1/10:1 non-HC,
 *     10:1/14:1 HC) for readability.
 *
 * Read docs/theme-engine-principles.md before editing. Hand-tuned constants
 * here are load-bearing.
 */

import chroma from 'chroma-js';
import {
  safeOklch,
  contrastRatio,
  ensureContrastAgainst,
  findPeakChromaLightness,
  maxChromaForHue,
} from '../shared/colour-maths.js';
import { cvd } from '../shared/cvd.js';

/* ================================================================
   CVD LOCK POLICY
   ================================================================ */
export const CVD_LOCKED_SLOTS = [];

/* ================================================================
   CONSTANTS — scale positions, chroma caps, contrast targets
   ================================================================ */

export const SCALE_POSITIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Contrast targets per variant.
// Gapped targets so base and emphasis produce visually distinct L values —
// flat targets collapsed base=emphasis into the same hex.
// Vivid position offsets from the hue's natural peak L.
//
// Base sits at findPeakChromaLightness(hue) — the L where that hue's
// gamut-safe chroma peaks. Red peaks ~0.63, green ~0.87, yellow ~0.97.
// Each hue gets its own peak L; we don't force a fixed L (which silently
// mutes high-peak hues like yellow/green/cyan).
//
// Offsets carry readability semantics:
//   HC wider than non-HC → each position further from base → more
//   distinguishable between tiers. HC for vivid users means "max
//   readability with neon character", not "crowd toward peak for pop".
//
// Dark mode flips direction — tint is deep (close to dark bg), emphasis
// is light (far from dark bg). Base stays at peak L in both modes.
//
// Clamps keep positions within sRGB-safe range (tint ≤ 0.95, emphasis
// ≥ 0.30) regardless of where peak lands.
// Position order (light): tint (lightest) > mid > base (peak) > emphasis (deepest)
// Position order (dark):  tint (darkest) < mid < base (peak) < emphasis (lightest)
//
// Mid sits BETWEEN tint and base — NOT on the opposite side of base from
// tint. Previously mid was -0.10 from peak which put it below base; scale
// read tint→base→mid→emphasis. Corrected so mid is a step down from tint
// toward base.
export const VIVID_OFFSETS = {
  light: {
    // tint +0.15 → mid +0.07 → base 0 → emphasis -0.25. Mid halfway-ish
    // between tint and base, preserving the ordering.
    nonHC: { tint: +0.15, mid: +0.07, base: 0, emphasis: -0.25 },
    hc:    { tint: +0.20, mid: +0.10, base: 0, emphasis: -0.32 },
  },
  dark: {
    // Flipped: tint -0.25 → mid -0.12 → base 0 → emphasis +0.15.
    // Mid sits between tint (deep) and base (peak), below base.
    nonHC: { tint: -0.25, mid: -0.12, base: 0, emphasis: +0.15 },
    hc:    { tint: -0.32, mid: -0.16, base: 0, emphasis: +0.20 },
  },
};

const VIVID_L_FLOOR = 0.30;
const VIVID_L_CEIL  = 0.95;

// Hue anchors — shared with cloudcalm (same bg/neutral/text palettes).
// Shared with cloudcalm. Split per role so neutral vs text always distinct
// when the user picks the same enum for both. See cloudcalm.js for the
// rationale table. page-bg keeps its own warm/cool hues (40/266) because
// surface colours aren't affected by the neutral/text split rule.
const WARM_HUE = 40;              // page-bg warm (used in defaults file, not here)
const COOL_HUE = 266;             // page-bg cool
const NEUTRAL_WARM_HUE = 60;      // neutral when mode=warm
const NEUTRAL_COOL_HUE = 240;     // neutral when mode=cool
const NEUTRAL_GREY_HUE = 40;      // neutral when mode=grey
const TEXT_GREY_HUE    = 240;     // text when mode=grey (whisper-cool)
const TEXT_COOL_HUE    = 200;     // text when mode=cool
// Vivid-specific: text warm hue shifted +20° from neutral warm so after
// role-swap (text ↔ neutral/secondary) rows don't read as the same brown.
// Neutral stays peach/salmon; text reads rusty/coffee.
const TEXT_WARM_HUE = 20;

// Bg surface L/C ladder — anchored to user's red reference:
//   light     : L 0.62 C 0.11  (muted brand surface — bg is brand, dimmed)
//   light HC  : L 0.61 C 0.12  (slightly more chroma, same L)
//   dark      : L 0.34 C 0.14  (deeper brand)
//   dark HC   : L 0.42 C 0.17  (HC LIGHTER than non-HC for scale headroom)
//
// Vivid bg is NOT near-pure — it's a muted version of the brand hue, sitting
// at its own tier below primary. Tint/mid/base/emphasis of primary pop
// AGAINST this coloured bg because primary L is well above/below bg L and
// at much higher C. Surface depth (raised/sunken/overlay) offsets L by ±0.05.
export const VIVID_BG_LADDER = {
  light: {
    // Pushed toward near-white. At brand C 0.057 and L 0.93, neon primary
    // (L 0.63 C 0.26) only clears 3.3:1 — fails 4.5 body text. Bg at L 0.97+
    // with whisper-low chroma (~0.015) gives scales 7:1+ contrast headroom.
    // The surface still carries a hint of brand hue so it doesn't feel
    // clinical, but stays quiet enough for neon to pop.
    nonHC: {
      'page-bg':         { L: 0.97, C: 0.015 },
      'page-bg-raised':  { L: 0.99, C: 0.008 },
      'page-bg-sunken':  { L: 0.94, C: 0.022 },
      'page-bg-overlay': { L: 1.00, C: 0.005 },
    },
    hc: {
      // HC = essentially pure white with barely-visible brand whisper.
      'page-bg':         { L: 0.99, C: 0.008 },
      'page-bg-raised':  { L: 1.00, C: 0.004 },
      'page-bg-sunken':  { L: 0.97, C: 0.012 },
      'page-bg-overlay': { L: 1.00, C: 0.002 },
    },
  },
  dark: {
    // Shifted darker — bg-sunken previously hit the "dark but vivid"
    // sweet spot better than page-bg, so values here shifted deeper.
    nonHC: {
      'page-bg':         { L: 0.28, C: 0.16 },
      'page-bg-raised':  { L: 0.34, C: 0.14 },
      'page-bg-sunken':  { L: 0.22, C: 0.18 },
      'page-bg-overlay': { L: 0.38, C: 0.12 },
    },
    // HC reference (violet): #310038 = L 0.225 C 0.107. HC bg should be
    // DEEPER than non-HC (not lighter) — the darker bg gives neon scales
    // bigger L-contrast headroom. Chroma actually LOWER than non-HC
    // because HC's saturation headroom goes into the scales, not the bg.
    hc: {
      'page-bg':         { L: 0.22, C: 0.11 },
      'page-bg-raised':  { L: 0.28, C: 0.10 },
      'page-bg-sunken':  { L: 0.16, C: 0.13 },
      'page-bg-overlay': { L: 0.32, C: 0.09 },
    },
  },
};

// Neutral / text position overrides — same character as cloudcalm's neutrals.
// Vivid shares comfort surfaces; the brand scales (primary/secondary) carry
// vivid's distinct chroma/contrast identity.
const NEUTRAL_STEPS = [
  { pos: 100, lightness: 0.97 },
  { pos: 200, lightness: 0.90 },
  { pos: 300, lightness: 0.82 },
  { pos: 400, lightness: 0.72 },
  { pos: 500, lightness: 0.60 },
  { pos: 600, lightness: 0.48 },
  { pos: 700, lightness: 0.36 },
  { pos: 800, lightness: 0.26 },
  { pos: 900, lightness: 0.18 },
  { pos: 950, lightness: 0.12 },
];

// Neutral overrides — standard 200/400/600/800 position grid (vivid's
// whole character is a wider ladder; only calm uses 200/300/400/500).
// Higher chroma than cloudcalm so neutrals read as "tinted greys" carrying
// the theme's vivid character rather than pure grey.
//
// Vivid neutral = GENUINE grey. Very low chroma (0.008-0.020) so it reads
// as grey with a whisper of hue — NOT as a muted brand colour. Primary and
// secondary carry the neon; neutral stays quiet so scales don't compete.
//
// The hue applied comes from the mode (warm 60°, cool 240°, grey 0 C 0,
// grey-tint = primary hue, etc.) — neutral_generate handles that selection.
// The ladder just dictates L and how much C a whisper gets.
export const VIVID_NEUTRAL_OVERRIDES = {
  light: {
    nonHC: { 200: { L: 0.92, C: 0.010 }, 400: { L: 0.72, C: 0.014 }, 600: { L: 0.50, C: 0.018 }, 800: { L: 0.28, C: 0.014 } },
    hc:    { 200: { L: 0.95, C: 0.006 }, 400: { L: 0.70, C: 0.010 }, 600: { L: 0.42, C: 0.014 }, 800: { L: 0.18, C: 0.010 } },
  },
  dark: {
    nonHC: { 200: { L: 0.28, C: 0.014 }, 400: { L: 0.50, C: 0.018 }, 600: { L: 0.72, C: 0.014 }, 800: { L: 0.92, C: 0.010 } },
    hc:    { 200: { L: 0.18, C: 0.010 }, 400: { L: 0.42, C: 0.014 }, 600: { L: 0.70, C: 0.010 }, 800: { L: 0.95, C: 0.006 } },
  },
};

// Vivid text = brand-hued, running between neutral's 0.10 and primary's 0.26.
// C 0.14-0.18. Different hue from neutral (text hue anchors offset per mode)
// so neutral+text read as two colour families even at similar L.
export const VIVID_TEXT_OVERRIDES = {
  light: {
    nonHC: { 200: { L: 0.78, C: 0.12 }, 400: { L: 0.58, C: 0.15 }, 600: { L: 0.42, C: 0.17 }, 800: { L: 0.28, C: 0.17 } },
    hc:    { 200: { L: 0.72, C: 0.12 }, 400: { L: 0.52, C: 0.15 }, 600: { L: 0.35, C: 0.17 }, 800: { L: 0.20, C: 0.17 } },
  },
  dark: {
    nonHC: { 200: { L: 0.28, C: 0.17 }, 400: { L: 0.52, C: 0.17 }, 600: { L: 0.72, C: 0.15 }, 800: { L: 0.92, C: 0.12 } },
    hc:    { 200: { L: 0.35, C: 0.17 }, 400: { L: 0.55, C: 0.17 }, 600: { L: 0.75, C: 0.15 }, 800: { L: 0.95, C: 0.12 } },
  },
};

// Semantic position mapping — vivid reads standard positions (200/400/600/800)
// for tint/mid/base/emphasis. Wider ladder than calm's compressed 200/300/400/500,
// supports more visual hierarchy at higher chroma.
export const VIVID_SEMANTIC_MAP = { 200: 'tint', 400: 'mid', 600: 'base', 800: 'emphasis' };

/* ================================================================
   PRIMARY / SECONDARY SCALE — vivid's distinct logic
   ================================================================ */

/**
 * Vivid scale — contrast-targeted lightness + high chroma.
 * Hue from input. L computed via binary search to hit contrast target
 * against the page-bg. Chroma capped per variant.
 *
 * Positions:
 *   100, 200, 300, 400, 500 — decorative (spread by L around position 600)
 *   600 = base — targets AAA (7:1 non-HC, 10:1 HC) vs bg
 *   700 = midpoint of 600 and 800
 *   800 = emphasis — targets 10:1 non-HC, 14:1 HC
 *   900, 950 — deepest (for text emphasis / strong borders)
 */
/**
 * Vivid scale — peak-L anchored, hue-aware.
 *
 * Base sits at findPeakChromaLightness(hue) — each hue peaks at a
 * different L. Red at L~0.63, green at L~0.87, yellow at L~0.97.
 * Other positions offset from peak via VIVID_OFFSETS.
 *
 * Chroma at each position = gamut-safe max for that position's L, via
 * safeOklch (which clamps internally). No fixed C values — let each
 * position pull whatever the gamut allows at its L.
 *
 * Result: vivid red sits neon-saturated at L 0.63, vivid green neon-
 * saturated at L 0.87. Both are "peak vivid" at their own natural L,
 * not forced into a shared mid-L that mutes every hue except red.
 */
export function generateVividScale(baseInput, { luminance = 'light', hc = false } = {}) {
  const hue = typeof baseInput === 'string'
    ? (chroma(baseInput).get('oklch.h') || 0)
    : (baseInput?.H || 0);

  const peakL = findPeakChromaLightness(hue);
  const variant = luminance === 'dark' ? 'dark' : 'light';
  const level = hc ? 'hc' : 'nonHC';
  const offsets = VIVID_OFFSETS[variant][level];

  const positionMap = { tint: 200, mid: 400, base: 600, emphasis: 800 };
  const scale = {};
  for (const [posName, offset] of Object.entries(offsets)) {
    const targetL = Math.max(VIVID_L_FLOOR, Math.min(VIVID_L_CEIL, peakL + offset));
    // Pull max chroma gamut allows at this L, capped at 0.30 (prevents
    // blown-out near-white corners where maxChromaForHue can spike).
    const maxC = Math.min(0.30, maxChromaForHue(hue, targetL) * 0.95);
    scale[positionMap[posName]] = safeOklch(targetL, maxC, hue);
  }
  return scale;
}

/* ================================================================
   NEUTRAL SCALE — same logic as cloudcalm (shared comfort)
   ================================================================ */

/**
 * Vivid neutral = grey with a whisper of mode hue. L from the ladder,
 * chroma stays at whisper-level (0.004-0.012) so the scale reads as
 * grey-with-hint, NOT as muted brand colour. Primary + secondary carry
 * the neon — neutral stays the quiet non-brand slot.
 *
 * Modes apply hue ONLY at the whisper level:
 *   warm       → hue 60 (yellow-warm whisper)
 *   cool       → hue 240 (blue-cool whisper)
 *   grey       → chroma 0 (pure grey)
 *   grey-tint  → primary hue at whisper chroma
 */
/**
 * CVD-aware neutral whisper hue.
 *
 * When a primary hue WASHES to grey under a CVD simulation (pink under
 * protan/deutan, blue under tritan), pure-grey neutral would collide
 * with simulated-primary under CVD — both read as "same grey". To keep
 * neutral distinguishable, give it a whisper hue OUTSIDE primary's
 * wash-zone.
 *
 * Returns null when pure grey is fine (primary doesn't wash).
 */
function cvdSafeNeutralHue(primaryHue, cvdType) {
  if (!cvdType) return null;
  const h = ((primaryHue % 360) + 360) % 360;
  const inZone = (lo, hi) => h >= lo && h <= hi;

  if (cvdType === 'protan' || cvdType === 'deutan') {
    // Red zone (330-360, 0-40) OR green zone (100-165) → washes to grey
    if (inZone(330, 360) || inZone(0, 40)) return 240;  // cool whisper
    if (inZone(100, 165)) return 40;                    // warm whisper
  }
  if (cvdType === 'tritan') {
    // Blue zone (200-260) → washes to grey
    if (inZone(200, 260)) return 40;                    // warm whisper
  }
  return null;
}

export function generateVividNeutral(mode, { primaryHex, luminance = 'light', hc = false, greyTintHue = null, cvd = null } = {}) {
  const variant = luminance === 'dark' ? 'dark' : 'light';
  const level = hc ? 'hc' : 'nonHC';
  const overrides = VIVID_NEUTRAL_OVERRIDES[variant][level];
  const primaryHue = primaryHex ? (chroma(primaryHex).get('oklch.h') || 0) : 0;

  // CVD override: if primary would wash to grey under this CVD, force
  // neutral to a whisper hue that stays distinct from the washed primary.
  // Overrides explicit mode (a user who picked "pure grey neutral" with
  // a red brand under protan CANNOT have pure grey — it collides).
  const cvdWhisperHue = cvdSafeNeutralHue(primaryHue, cvd);

  // Resolve hue + whisper chroma per mode
  let hue = 0;
  let useChroma = true;
  if (cvdWhisperHue !== null)    { hue = cvdWhisperHue; useChroma = true; }
  else if (mode === 'warm')      hue = NEUTRAL_WARM_HUE;
  else if (mode === 'cool')      hue = NEUTRAL_COOL_HUE;
  else if (mode === 'grey')      useChroma = false;
  else if (mode === 'grey-tint') hue = greyTintHue ?? (chroma(primaryHex).get('oklch.h') || 0);
  else                           hue = NEUTRAL_WARM_HUE; // default warm whisper

  const scale = {};
  for (const [pos, { L, C }] of Object.entries(overrides)) {
    scale[pos] = useChroma
      ? safeOklch(L, C, hue)
      : chroma.oklch(L, 0, 0).hex();
  }
  return scale;
}

/* ================================================================
   TEXT SCALE — same logic as cloudcalm
   ================================================================ */

/**
 * Vivid text = very dark (light theme) or very light (dark theme) with
 * an OPTIONAL whisper of hue. Near-anchor luminance so text remains
 * unmistakably readable; whisper chroma lets text pick up a mode flavour
 * without reading as "coloured text."
 *
 * Modes work the same way as neutral — warm/cool whisper, grey pure,
 * grey-tint picks up primary hue.
 */
export function generateVividText(mode, { primaryHex, luminance = 'light', greyTintHue = null } = {}) {
  const isDark = luminance === 'dark';

  // Near-anchor L per position. Light = scale of very-dark, dark = scale of very-light.
  // Matches vivid-HC-dark bg character (L 0.22, C 0.11) — "deep brand-tinted near-black"
  // rather than pure black. Same on dark side: deep-tinted near-white.
  const lLadder = isDark
    ? { tint: 0.82, mid: 0.90, base: 0.95, emphasis: 0.98 }  // near-white
    : { tint: 0.30, mid: 0.22, base: 0.14, emphasis: 0.08 }; // near-black, matches HC bg depth

  // Tint chroma — generous enough to read as "brand-tinted dark/light"
  // (like vivid-HC-dark bg at C 0.11) rather than pure B/W. Still well
  // under brand scale chroma (0.23-0.26) so text stays the non-brand slot.
  const whisperC = 0.08;

  let hue = 0;
  let useChroma = true;
  if (mode === 'warm')           hue = TEXT_WARM_HUE;
  else if (mode === 'cool')      hue = TEXT_COOL_HUE;
  else if (mode === 'grey')      useChroma = false;
  else if (mode === 'grey-tint') hue = greyTintHue ?? (chroma(primaryHex).get('oklch.h') || 0);
  else                           useChroma = false;  // default pure B/W

  const make = (L) => useChroma
    ? safeOklch(L, whisperC, hue)
    : chroma.oklch(L, 0, 0).hex();

  return {
    tint:     make(lLadder.tint),
    mid:      make(lLadder.mid),
    base:     make(lLadder.base),
    emphasis: make(lLadder.emphasis),
  };
}

/* ================================================================
   PAGE BACKGROUND — vivid-native, table-driven
   ================================================================ */

/**
 * Vivid bg = table lookup for L/C per surface, hue picked from the
 * chosen mode. No chalky cream defaults — vivid's bg is near-pure
 * (white or black) with a whisper of brand hue so it stays out of
 * the way and lets neon scales pop.
 *
 *   warm       → NEUTRAL_WARM_HUE
 *   cool       → COOL_HUE
 *   grey       → chroma 0 (pure grey)
 *   grey-tint  → primary hue
 *   tint/deep  → primary hue (deeper chroma via deep ladder if needed)
 */
export function generateVividPageBg({
  luminance = 'light',
  hc = false,
  bgMode = 'warm',
  primaryHex,
  tertiaryMode,
} = {}) {
  const variant = luminance === 'dark' ? 'dark' : 'light';
  const level = hc ? 'hc' : 'nonHC';
  const ladder = VIVID_BG_LADDER[variant][level];

  // null/undefined bgMode falls back to 'warm' (validator emits null when
  // the theme def doesn't specify pageBg).
  const normalisedBgMode = bgMode ?? 'warm';
  const resolvedMode = normalisedBgMode === 'neutral' ? tertiaryMode : normalisedBgMode;
  const primaryHue = primaryHex ? (chroma(primaryHex).get('oklch.h') || 0) : 0;

  // Bg character per mode:
  //   tint / deep / (default) → brand hue at ladder C (full vivid tint)
  //   warm / cool / grey / grey-tint:
  //       HC     → PURE black/white (C 0)
  //       non-HC → off-black/off-white (tiny C so not flat)
  const isNeutralMode = (resolvedMode === 'warm' || resolvedMode === 'cool'
                      || resolvedMode === 'grey' || resolvedMode === 'grey-tint');

  const out = {};
  for (const [name, { L, C }] of Object.entries(ladder)) {
    if (isNeutralMode) {
      // Pure for HC; tiny chroma whisper for non-HC (off-B/W).
      const neutralC = hc ? 0 : 0.008;
      out[name] = chroma.oklch(L, neutralC, primaryHue).hex();
    } else {
      // tint / deep / default → full brand tint at ladder C.
      out[name] = safeOklch(L, C, primaryHue);
    }
  }
  return out;
}

/* ================================================================
   STATUS + FOCUS/HIGHLIGHT — same as cloudcalm
   ================================================================ */

// Vivid status palettes — saturated equivalents of calm's. Same hue
// mapping per CVD type (standard / protan|deutan / tritan) just bolder.
// Vivid status anchored to user's neon reference hues:
//   pink HSV(309), yellow HSV(49), green HSV(126). Chroma ~0.26.
// Standard: green success, orange warning, red error, blue info — all at
// vivid neon brightness. CVD variants substitute confusion-axis hues.
//
// Tritan specifically keeps success GREEN (144°) — tritan sees reds/greens
// fine; only the blue-yellow axis fails. So warning moves off yellow/orange
// to red, error stays magenta, info shifts from blue to purple.
// Status hues per role per CVD type. Each hue gets peak L via
// findPeakChromaLightness — vivid neon treatment across the board.
//
// Standard: green success, orange warning, red error, blue info.
// Protan/Deutan (red-green axis fails): teal success, orange warning,
//   magenta error, blue info.
// Tritan (blue-yellow axis fails): green success, red warning, magenta
//   error, violet info.
const VIVID_STATUS_HUES = {
  standard: { Success: 144, Warning:  45, Error:  25, Info: 260 },
  protan:   { Success: 190, Warning:  45, Error: 330, Info: 260 },
  deutan:   { Success: 190, Warning:  45, Error: 330, Info: 260 },
  tritan:   { Success: 144, Warning:  25, Error: 330, Info: 290 },
};

// Focus + highlight-link are interaction signals — fixed vivid hues.
// Focus = yellow (attention), highlight-link = cyan (interactive).
// Per CVD, shift to an anchor that stays distinct from brand scales +
// status under that CVD's confusion.
const VIVID_FOCUS_HUES = {
  standard: { focus:  80, highlight: 195 },
  protan:   { focus:  50, highlight: 210 },
  deutan:   { focus:  50, highlight: 210 },
  tritan:   { focus: 320, highlight: 300 },
};

/**
 * Build a vivid neon hex. For scales/base this lives at the hue's peak L.
 * For UI tokens (status/focus/highlight) on a light bg the peak-L variant
 * often washes into the bg — peak yellow/green/cyan sit at L 0.85-0.97
 * which is too close to the near-white bg. `luminance` shifts the L away
 * from bg to guarantee contrast headroom.
 *
 *   luminance='light' → shift down from peak toward L 0.50-0.65
 *   luminance='dark'  → shift up from peak toward L 0.75-0.90 (or stay at peak)
 *   luminance='peak'  → pure peak, no shift (default, for scales)
 */
function vividNeon(hue, { luminance = 'peak' } = {}) {
  const peakL = findPeakChromaLightness(hue);
  let targetL = peakL;
  if (luminance === 'light') {
    // Target L ≤ 0.60 so vs bg L≥0.95 we clear ≥4.5:1 body text contrast.
    targetL = Math.min(peakL, 0.55);
  } else if (luminance === 'dark') {
    // Target L ≥ 0.80 so vs dark bg L~0.28 we clear contrast.
    targetL = Math.max(peakL, 0.80);
  }
  const maxC = Math.min(0.30, maxChromaForHue(hue, targetL) * 0.95);
  return safeOklch(targetL, maxC, hue);
}

export function generateVividStatus({ luminance = 'light', cvd = null } = {}) {
  const isDark = luminance === 'dark';
  const hues = VIVID_STATUS_HUES[cvd] || VIVID_STATUS_HUES.standard;
  // Status tokens need contrast against bg — not at peak-L. Use the luminance
  // variant so on light themes they sit darker than peak, on dark themes
  // they sit lighter than peak.
  const neonMode = isDark ? 'dark' : 'light';
  return {
    'color-Black':  isDark ? '#fafafa' : '#1a1a1a',
    'color-White':  isDark ? '#1a1a1a' : '#fafafa',
    'shadow-Black': '#000000',
    'shadow-White': '#ffffff',
    'color-Success': vividNeon(hues.Success, { luminance: neonMode }),
    'color-Warning': vividNeon(hues.Warning, { luminance: neonMode }),
    'color-Error':   vividNeon(hues.Error,   { luminance: neonMode }),
    'color-Info':    vividNeon(hues.Info,    { luminance: neonMode }),
  };
}

export function generateVividFocusHighlight({ pageBg, cvd = null, luminance = 'light' } = {}) {
  // Fixed vivid-native anchor hues per CVD mode. Luminance-aware L shift
  // so focus/highlight read-contrast against bg — not at peak-L.
  const hues = VIVID_FOCUS_HUES[cvd] || VIVID_FOCUS_HUES.standard;
  const neonMode = luminance === 'dark' ? 'dark' : 'light';
  return {
    'focus-color':          vividNeon(hues.focus,     { luminance: neonMode }),
    'focus-bg':             pageBg['page-bg'],
    'highlight-link-color': vividNeon(hues.highlight, { luminance: neonMode }),
  };
}

/* ================================================================
   CONTRAST TOKEN
   ================================================================ */

export function resolveContrastToken({ accentHex, baseHex, emphasisHex, pageBgHex }) {
  if (accentHex && baseHex) {
    return ensureContrastAgainst(accentHex, baseHex, pageBgHex, 3);
  }
  return emphasisHex;
}

/* ================================================================
   ORCHESTRATOR
   ================================================================ */

export function generateVivid(input, variant = {}) {
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
  const { luminance = 'light', hc = false, cvd: cvdType = null, cvdRisks = null, greyTintHues = null } = variant;

  // Unpack { hex, hue } from validator output
  let primaryHex           = primary.hex;
  let secondaryHex         = secondary.hex;
  let primaryAccentHex     = primaryAccent   ? primaryAccent.hex   : null;
  let secondaryAccentHex   = secondaryAccent ? secondaryAccent.hex : null;
  let tertiaryAccentHex    = tertiaryAccent  ? tertiaryAccent.hex  : null;
  const tertiaryIsHex      = tertiary && typeof tertiary === 'object';
  let tertiaryHex          = tertiaryIsHex ? tertiary.hex : null;
  const textIsHex          = text && typeof text === 'object';
  let textHex              = textIsHex ? text.hex : null;
  const tertiaryModeOrHex  = tertiaryIsHex ? 'brand' : tertiary;
  const textModeOrHex      = textIsHex ? 'brand' : text;

  // CVD is handled UPSTREAM via the cvd-gate — by the time hues reach the
  // generator, they are already CVD-safe for whatever variant is being
  // built. Engine stays pure: it takes hues, it builds scales. No CVD
  // awareness inside.
  let cvdSafe = true;
  let cvdNotes = [];

  // 1. Page background
  const bgTokens = generateVividPageBg({
    luminance, hc, bgMode: pageBg,
    primaryHex,
    tertiaryMode: typeof tertiaryModeOrHex === 'string' ? tertiaryModeOrHex : null,
  });
  const pageBgHex = bgTokens['page-bg'];

  // 2. Primary + secondary scales (vivid's contrast-targeted logic)
  const primaryScale   = generateVividScale(primaryHex,   { luminance, hc });
  const secondaryScale = generateVividScale(secondaryHex, { luminance, hc });

  // 3. Neutral — CVD-aware. If primary washes to grey under the active
  // CVD, neutral gets a forced whisper hue so it stays distinguishable
  // from the simulated-grey primary.
  const neutralScale = generateVividNeutral(
    tertiaryIsHex ? 'brand' : tertiaryModeOrHex,
    {
      primaryHex, neutralHex: tertiaryIsHex ? tertiaryHex : null, luminance, hc,
      greyTintHue: greyTintHues?.neutral ?? null,
      cvd: cvdType,
    }
  );

  // 4. Text
  const textScale = generateVividText(
    textIsHex ? 'brand' : textModeOrHex,
    {
      primaryHex, textHex: textIsHex ? textHex : null, luminance, hc,
      greyTintHue: greyTintHues?.text ?? null,
    }
  );

  // 5. Status + shadow
  const status = generateVividStatus({ luminance, cvd: cvdType });

  // 6. Focus + highlight
  const focusHighlight = generateVividFocusHighlight({
    pageBg: bgTokens,
    cvd: cvdType,
    luminance,
  });

  // 7. Contrast tokens — vivid uses positions 600/800 across ALL families
  // (primary / secondary / neutral / text). Previously neutral read 400/500
  // which produced a contrast hex that didn't match its emphasis — the
  // "contrast differs from emphasis" preservation in the validator then
  // treated it as a deliberate override and pinned the wrong hex.
  const primaryBase       = primaryScale[600];
  const secondaryBase     = secondaryScale[600];
  const neutralBase       = neutralScale[600];
  const primaryEmphasis   = primaryScale[800];
  const secondaryEmphasis = secondaryScale[800];
  const neutralEmphasis   = neutralScale[800];

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

  // 8. Build output token set — vivid's semantic map uses 200/400/600/800
  const scales = {
    primary: {
      tint:     primaryScale[200],
      mid:      primaryScale[400],
      base:     primaryScale[600],
      emphasis: primaryScale[800],
      contrast: contrast.primary,
    },
    secondary: {
      tint:     secondaryScale[200],
      mid:      secondaryScale[400],
      base:     secondaryScale[600],
      emphasis: secondaryScale[800],
      contrast: contrast.secondary,
    },
    // Vivid's neutral + text use the SAME wider 200/400/600/800 semantic
    // positions as primary/secondary — vivid's whole character is a wider
    // ladder so all four families run on the same position grid.
    neutral: {
      tint:     neutralScale[200],
      mid:      neutralScale[400],
      base:     neutralScale[600],
      emphasis: neutralScale[800],
      contrast: contrast.neutral,
    },
    text: textScale,
  };

  // 9. CVD post-scale pass (cross-family only)
  if (cvdType) {
    const cvdInput = {
      'primary-base':  { hex: scales.primary.base,   locked: false },
      'secondary-base':{ hex: scales.secondary.base, locked: false },
      'neutral-base':  { hex: scales.neutral.base,   locked: false },
      'text-emphasis': { hex: textScale.emphasis,    locked: false },
      'page-bg':       { hex: bgTokens['page-bg'],   locked: false },
    };
    if (scales.primary.contrast   && scales.primary.contrast   !== scales.primary.emphasis)   cvdInput['primary-contrast']   = { hex: scales.primary.contrast,   locked: false };
    if (scales.secondary.contrast && scales.secondary.contrast !== scales.secondary.emphasis) cvdInput['secondary-contrast'] = { hex: scales.secondary.contrast, locked: false };
    if (scales.neutral.contrast   && scales.neutral.contrast   !== scales.neutral.emphasis)   cvdInput['neutral-contrast']   = { hex: scales.neutral.contrast,   locked: false };
    // Focus + highlight-link must survive CVD — keyboard users with CVD
    // rely on them to see "where am I" and "what's clickable".
    if (focusHighlight['focus-color'])          cvdInput['focus-color']          = { hex: focusHighlight['focus-color'],          locked: false };
    if (focusHighlight['highlight-link-color']) cvdInput['highlight-link-color'] = { hex: focusHighlight['highlight-link-color'], locked: false };
    // Status semantics — error must stay distinct from success under CVD.
    if (status['color-Success']) cvdInput['color-Success'] = { hex: status['color-Success'], locked: false };
    if (status['color-Warning']) cvdInput['color-Warning'] = { hex: status['color-Warning'], locked: false };
    if (status['color-Error'])   cvdInput['color-Error']   = { hex: status['color-Error'],   locked: false };
    if (status['color-Info'])    cvdInput['color-Info']    = { hex: status['color-Info'],    locked: false };

    const result = cvd(cvdInput, cvdType);
    cvdSafe = result.cvdSafe;
    cvdNotes = result.notes;

    // Propagate base shifts through the scale
    if (result.hexSet['primary-base'] && result.hexSet['primary-base'] !== scales.primary.base) {
      scales.primary.base = result.hexSet['primary-base'];
      const [, , newH] = chroma(scales.primary.base).oklch();
      const retint = (hex) => {
        const [L, C] = chroma(hex).oklch();
        return chroma.oklch(L, C || 0, newH).hex();
      };
      scales.primary.tint     = retint(scales.primary.tint);
      scales.primary.mid      = retint(scales.primary.mid);
      scales.primary.emphasis = retint(scales.primary.emphasis);
      if (!primaryAccentHex) scales.primary.contrast = scales.primary.emphasis;
    }
    if (result.hexSet['secondary-base'] && result.hexSet['secondary-base'] !== scales.secondary.base) {
      scales.secondary.base = result.hexSet['secondary-base'];
      const [, , newH] = chroma(scales.secondary.base).oklch();
      const retint = (hex) => {
        const [L, C] = chroma(hex).oklch();
        return chroma.oklch(L, C || 0, newH).hex();
      };
      scales.secondary.tint     = retint(scales.secondary.tint);
      scales.secondary.mid      = retint(scales.secondary.mid);
      scales.secondary.emphasis = retint(scales.secondary.emphasis);
      if (!secondaryAccentHex) scales.secondary.contrast = scales.secondary.emphasis;
    }
    if (result.hexSet['neutral-base'] && result.hexSet['neutral-base'] !== scales.neutral.base) {
      scales.neutral.base = result.hexSet['neutral-base'];
      const [, , newH] = chroma(scales.neutral.base).oklch();
      const retint = (hex) => {
        const [L, C] = chroma(hex).oklch();
        return chroma.oklch(L, C || 0, newH).hex();
      };
      scales.neutral.tint     = retint(scales.neutral.tint);
      scales.neutral.mid      = retint(scales.neutral.mid);
      scales.neutral.emphasis = retint(scales.neutral.emphasis);
      if (!tertiaryAccentHex) scales.neutral.contrast = scales.neutral.emphasis;
    }
    // Text: propagate emphasis hue across the full scale (tint/mid/base/emphasis/contrast)
    // so the ladder stays one family. contrast may be var(--color-Black) — leave as-is.
    if (result.hexSet['text-emphasis'] && result.hexSet['text-emphasis'] !== textScale.emphasis) {
      textScale.emphasis = result.hexSet['text-emphasis'];
      const [, , newH] = chroma(textScale.emphasis).oklch();
      const retint = (hex) => {
        if (!hex || hex.startsWith('var(')) return hex;
        const [L, C] = chroma(hex).oklch();
        return chroma.oklch(L, C || 0, newH).hex();
      };
      textScale.tint = retint(textScale.tint);
      textScale.mid  = retint(textScale.mid);
      textScale.base = retint(textScale.base);
    }
    // Page-bg: CVD may shift both hue AND lightness of page-bg (to preserve
    // distinctness from other families). Preserve the original depth offsets
    // between surfaces (raised - page, sunken - page, overlay - page) so the
    // card/overlay depth relationship survives the CVD shift.
    if (result.hexSet['page-bg'] && result.hexSet['page-bg'] !== bgTokens['page-bg']) {
      const oldPageL = chroma(bgTokens['page-bg']).oklch()[0];
      const offsets = {
        raised:  chroma(bgTokens['page-bg-raised']).oklch()[0]  - oldPageL,
        sunken:  chroma(bgTokens['page-bg-sunken']).oklch()[0]  - oldPageL,
        overlay: chroma(bgTokens['page-bg-overlay']).oklch()[0] - oldPageL,
      };
      bgTokens['page-bg'] = result.hexSet['page-bg'];
      const [newL, newC, newH] = chroma(bgTokens['page-bg']).oklch();
      const hue = Number.isFinite(newH) ? newH : 0;
      const chr = newC || 0;
      const makeSurface = (dL) => chroma.oklch(
        Math.max(0.02, Math.min(0.98, newL + dL)), chr, hue
      ).hex();
      if (bgTokens['page-bg-raised'])  bgTokens['page-bg-raised']  = makeSurface(offsets.raised);
      if (bgTokens['page-bg-sunken'])  bgTokens['page-bg-sunken']  = makeSurface(offsets.sunken);
      if (bgTokens['page-bg-overlay']) bgTokens['page-bg-overlay'] = makeSurface(offsets.overlay);
    }

    if (result.hexSet['primary-contrast'])   scales.primary.contrast   = result.hexSet['primary-contrast'];
    if (result.hexSet['secondary-contrast']) scales.secondary.contrast = result.hexSet['secondary-contrast'];
    if (result.hexSet['neutral-contrast'])   scales.neutral.contrast   = result.hexSet['neutral-contrast'];
    // Apply any focus/highlight shifts
    if (result.hexSet['focus-color'])          focusHighlight['focus-color']          = result.hexSet['focus-color'];
    if (result.hexSet['highlight-link-color']) focusHighlight['highlight-link-color'] = result.hexSet['highlight-link-color'];
    // Apply status shifts
    if (result.hexSet['color-Success']) status['color-Success'] = result.hexSet['color-Success'];
    if (result.hexSet['color-Warning']) status['color-Warning'] = result.hexSet['color-Warning'];
    if (result.hexSet['color-Error'])   status['color-Error']   = result.hexSet['color-Error'];
    if (result.hexSet['color-Info'])    status['color-Info']    = result.hexSet['color-Info'];
  }

  return {
    meta: {
      theme: 'vivid',
      luminance,
      hc,
      cvd: cvdType,
      cvdSafe,
      cvdNotes,
      chromaZone: 'vivid',       // own zone — no text-size boost like calm gets
      intensityZone: 'full',     // vivid is full intensity (calm is 'soft')
      bgMode: pageBg,
      tertiaryMode: tertiary,
      textMode: text,
    },
    scales,
    pageBg: bgTokens,
    status,
    focusHighlight,
  };
}
