/**
 * mono-grey.js — Pre-computed monochrome scales (pure / warm / cool).
 *
 * Three variants, no brand input. Each variant ships always — every brand
 * gets all three in their catalogue alongside whatever bold/calm/faithful
 * variants come from their hex.
 *
 *   pure  : chroma 0, hue 0          — true achromatic
 *   warm  : chroma 0.015, hue 50     — warm whisper (yellow-orange)
 *   cool  : chroma 0.015, hue 230    — cool whisper (blue)
 *
 * Each variant builds 4 modes: light, dark, hc-light, hc-dark.
 * AA targets for light/dark; AAA for hc.
 *
 * Slot character:
 *   primary base anchors at a different L than secondary base, so the two
 *   scales read as distinct slots even with no hue separation.
 *     light mode:  primary base ~ L 0.48 (pos 600)
 *                  secondary base ~ L 0.24 (pos 800)
 *     dark mode:   primary base ~ L 0.75 (pos 400)
 *                  secondary base ~ L 0.92 (pos 200)
 *
 * No CVD pass needed — pure has no hue, warm/cool whispers stay
 * distinguishable under all CVD types because they're isolated single-hue
 * tints not slot-pairs.
 */

import chroma from 'chroma-js';
import { safeOklch } from '../shared/colour-maths.js';

/* ================================================================
   CONSTANTS
   ================================================================ */

export const SCALE_POSITIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Variant whisper hues + chroma. Pure stays at 0/0.
const VARIANTS = {
  pure: { hue: 0,   chroma: 0      },
  warm: { hue: 50,  chroma: 0.015  },
  cool: { hue: 230, chroma: 0.015  },
};

// Page-bg L per mode. Slight surface offsets per role
// (raised lighter, sunken darker, overlay lightest).
//
// Deepest dark bg sits at L 0.18, lightest light bg at L 0.97 — never
// pure black or pure white. BW guard applies even at HC: high contrast
// is achieved by pushing scales further from bg, not by collapsing bg
// to absolute extremes. L 0.10/1.00 reads as a wall, not a surface.
const PAGE_BG_LADDER = {
  light: {
    nonHC: { 'page-bg': 0.95, 'page-bg-raised': 0.98, 'page-bg-sunken': 0.91, 'page-bg-overlay': 0.99 },
    // HC light bg sits slightly DARKER than non-HC, not brighter — gives
    // the warm/cool tint chroma room to register visually. Pure HC
    // becomes near-white grey, warm HC reads as cream, cool HC reads as
    // slate. Pushed brighter and the tint vanishes into white.
    hc:    { 'page-bg': 0.93, 'page-bg-raised': 0.97, 'page-bg-sunken': 0.89, 'page-bg-overlay': 0.98 },
  },
  dark: {
    nonHC: { 'page-bg': 0.22, 'page-bg-raised': 0.28, 'page-bg-sunken': 0.16, 'page-bg-overlay': 0.32 },
    hc:    { 'page-bg': 0.18, 'page-bg-raised': 0.24, 'page-bg-sunken': 0.13, 'page-bg-overlay': 0.28 },
  },
};

// Status hues — kept as fixed roles. Mono themes shouldn't be vivid in
// status either, so use low-chroma variants of the standard semantic hues.
const STATUS_HUES = {
  Success: 144,  // green
  Warning:  45,  // amber
  Error:    25,  // red
  Info:    260,  // blue
};

/* ================================================================
   SCALE BUILDERS
   ================================================================ */

/**
 * Page-bg surfaces at variant whisper chroma.
 */
function buildPageBg(variant, luminance, hc) {
  const { hue, chroma: c } = VARIANTS[variant];
  const ladder = PAGE_BG_LADDER[luminance][hc ? 'hc' : 'nonHC'];
  // Bg surfaces use lower chroma than scales — at high L the human eye
  // picks up warm chroma as pink/peach. Drop bg chroma so it reads
  // neutral while scales carry the warm/cool character.
  //
  // HC INVERTS this: HC bg gets MORE tint, not less. Without a tint
  // bump, HC just becomes "darker dark / lighter light" with no warm-
  // vs-cool identity. The tint bump gives mono-warm-hc visible cream
  // and mono-cool-hc visible slate, even at extreme L. Pure stays at
  // chroma 0 in both modes.
  const bgChroma = c === 0 ? 0 : (hc ? c * 0.65 : c * 0.25);
  const out = {};
  for (const [name, L] of Object.entries(ladder)) {
    out[name] = bgChroma === 0
      ? chroma.oklch(L, 0, 0).hex()
      : safeOklch(L, bgChroma, hue);
  }
  return out;
}

/**
 * Status colours.
 *
 * Mono themes are designed for achromatopsia — users with no hue
 * perception. So status meaning CANNOT rely on hue. Each status gets
 * a distinctive L value, widely separated, so they're distinguishable
 * by lightness alone.
 *
 * L mapping (light mode):
 *   Error    L 0.40   darkest = strongest signal, attention-grabbing
 *   Warning  L 0.50
 *   Success  L 0.62
 *   Info     L 0.72   lightest = quietest, ambient
 *
 * Dark mode inverts:
 *   Error    L 0.85
 *   Warning  L 0.75
 *   Success  L 0.62
 *   Info     L 0.50
 *
 * Whisper chroma (C 0.020) at the semantic hue is preserved — green for
 * success, red for error, etc. — so sighted users still get the colour
 * convention as a redundant signal. But for achromatopsic users, L
 * does the discrimination work.
 *
 * Components consuming these tokens MUST also encode status with icon
 * shape and text — colour is a sighted-affordance, never the only one.
 */
function buildStatus(luminance) {
  const isDark = luminance === 'dark';

  // Wide L spread for status — achromatopsic distinguishability.
  // ~15-18 L between each step so Error vs Warning are clearly distinct
  // by lightness alone.
  const STATUS_LS = isDark
    ? { Error: 0.88, Warning: 0.70, Success: 0.55, Info: 0.42 }
    : { Error: 0.32, Warning: 0.50, Success: 0.65, Info: 0.78 };

  const whisperC = 0.020;
  const make = (key, hue) => safeOklch(STATUS_LS[key], whisperC, hue);

  return {
    'color-Black':  isDark ? '#fafafa' : '#1a1a1a',
    'color-White':  isDark ? '#1a1a1a' : '#fafafa',
    'shadow-Black': '#000000',
    'shadow-White': '#ffffff',
    'color-Success': make('Success', STATUS_HUES.Success),
    'color-Warning': make('Warning', STATUS_HUES.Warning),
    'color-Error':   make('Error',   STATUS_HUES.Error),
    'color-Info':    make('Info',    STATUS_HUES.Info),
  };
}

/**
 * Focus + highlight-link tokens.
 *
 * Always saturated, regardless of variant. Focus is a safety signal —
 * keyboard / switch / eye-gaze users rely on it to see "where am I."
 * A flat grey focus ring on a flat grey theme is invisible. Pure mode
 * gets the same yellow focus + blue link as warm/cool — being mono in
 * scales doesn't mean stripping safety signals.
 */
function buildFocusHighlight(luminance, pageBg) {
  const isDark = luminance === 'dark';
  const focusL = isDark ? 0.80 : 0.40;
  const linkL  = isDark ? 0.75 : 0.45;
  return {
    'focus-color':          safeOklch(focusL, 0.15, 90),   // amber-yellow attention hue
    'focus-bg':             pageBg['page-bg'],
    'highlight-link-color': safeOklch(linkL, 0.13, 230),   // blue interactive hue
  };
}

/* ================================================================
   ORCHESTRATOR
   ================================================================ */

// Per-slot L stops + contrast. Each slot picks 5 distinct L values for
// tint / mid / base / emphasis / contrast. Contrast pushes past emphasis
// to give achromatopsic users the deepest L extreme — without it the
// scale collapses to 4 stops labelled as 5.
//
// Constraints:
//   - Neutral tint must read against bg (ΔL ≥ 0.05 from page-bg L).
//     Page bg sits at L ~0.95 (light) / 0.22 (dark) so neutral tint
//     lands at L 0.88 (light) / 0.32 (dark) — perceptible to a user
//     reading on the lightness channel only.
//   - No stop hits pure black or pure white. Contrast at L 0.10 (light)
//     / 0.92 (dark) is the deepest extreme used.
//
// Light mode (light bg, scales descend through L space):
//   neutral   tint 0.88  mid 0.76  base 0.60  emphasis 0.45  contrast 0.38
//   primary   tint 0.80  mid 0.66  base 0.50  emphasis 0.34  contrast 0.24
//   secondary tint 0.72  mid 0.56  base 0.42  emphasis 0.26  contrast 0.18
//   text      tint 0.50  mid 0.38  base 0.26  emphasis 0.16  contrast 0.10
//
// Dark mode mirrors:
//   neutral   tint 0.32  mid 0.42  base 0.52  emphasis 0.62  contrast 0.68
//   primary   tint 0.40  mid 0.50  base 0.60  emphasis 0.72  contrast 0.78
//   secondary tint 0.48  mid 0.58  base 0.68  emphasis 0.78  contrast 0.84
//   text      tint 0.58  mid 0.68  base 0.78  emphasis 0.85  contrast 0.92
const SLOT_BANDS = {
  light: {
    neutral:   { tint: 0.88, mid: 0.76, base: 0.60, emphasis: 0.45, contrast: 0.38 },
    primary:   { tint: 0.80, mid: 0.66, base: 0.50, emphasis: 0.34, contrast: 0.24 },
    secondary: { tint: 0.72, mid: 0.56, base: 0.42, emphasis: 0.26, contrast: 0.18 },
    text:      { tint: 0.50, mid: 0.38, base: 0.26, emphasis: 0.16, contrast: 0.10 },
  },
  dark: {
    neutral:   { tint: 0.32, mid: 0.42, base: 0.52, emphasis: 0.62, contrast: 0.68 },
    primary:   { tint: 0.40, mid: 0.50, base: 0.60, emphasis: 0.72, contrast: 0.78 },
    secondary: { tint: 0.48, mid: 0.58, base: 0.68, emphasis: 0.78, contrast: 0.84 },
    text:      { tint: 0.58, mid: 0.68, base: 0.78, emphasis: 0.85, contrast: 0.92 },
  },
};

/**
 * Pick a hex at L using the variant's whisper hue + chroma.
 * Used by the slot-band sampler so we don't have to round-trip through
 * the full LIGHTNESS_LADDER positions.
 */
function sampleAtL(variant, L, hc) {
  const { hue, chroma: c } = VARIANTS[variant];
  const useC = c === 0 ? 0 : (hc ? c * 1.3 : c);
  return useC === 0
    ? chroma.oklch(L, 0, 0).hex()
    : safeOklch(L, useC, hue);
}

/**
 * Build a complete mono-grey theme for one (variant × luminance × hc) combo.
 *
 *   variant    : 'pure' | 'warm' | 'cool'
 *   luminance  : 'light' | 'dark'
 *   hc         : false | true
 *
 * Returns the standard theme output shape used by writer.js:
 *   { meta, scales: { primary, secondary, neutral, text }, pageBg, status, focusHighlight }
 *
 * Slot character:
 *   Each slot (primary, secondary, neutral, text) occupies its own L band
 *   so bases don't collide. Within a band, tint/mid/base/emphasis step
 *   evenly across L — four distinguishable stops per slot.
 */
export function generateMonoGrey(variant = 'pure', { luminance = 'light', hc = false } = {}) {
  if (!VARIANTS[variant]) {
    throw new Error(`mono-grey: unknown variant "${variant}"`);
  }
  const bands = SLOT_BANDS[luminance];

  const buildSlot = (slotName) => {
    const band = bands[slotName];
    return {
      tint:     sampleAtL(variant, band.tint,     hc),
      mid:      sampleAtL(variant, band.mid,      hc),
      base:     sampleAtL(variant, band.base,     hc),
      emphasis: sampleAtL(variant, band.emphasis, hc),
      contrast: sampleAtL(variant, band.contrast, hc),
    };
  };

  const primaryScale   = buildSlot('primary');
  const secondaryScale = buildSlot('secondary');
  const neutralScale   = buildSlot('neutral');
  const textScale      = buildSlot('text');

  const pageBg = buildPageBg(variant, luminance, hc);
  const status = buildStatus(luminance);
  const focusHighlight = buildFocusHighlight(luminance, pageBg);

  return {
    meta: {
      theme: `mono-grey-${variant}`,
      luminance,
      hc,
      cvd: null,
      cvdSafe: true,
      cvdNotes: [],
      chromaZone: 'grey',
      intensityZone: variant === 'pure' ? 'pure' : 'whisper',
      variant,
    },
    scales: {
      primary:   primaryScale,
      secondary: secondaryScale,
      neutral:   neutralScale,
      text:      textScale,
    },
    pageBg,
    status,
    focusHighlight,
  };
}

/**
 * Convenience: generate all three mono variants for a given mode at once.
 * Returns { pure, warm, cool } — each a full theme output.
 */
export function generateAllMonoGrey({ luminance = 'light', hc = false } = {}) {
  return {
    pure: generateMonoGrey('pure', { luminance, hc }),
    warm: generateMonoGrey('warm', { luminance, hc }),
    cool: generateMonoGrey('cool', { luminance, hc }),
  };
}
