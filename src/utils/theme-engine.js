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
function findLightnessForContrast(bgHex, hue, chromaVal, targetRatio, tolerance = 0.2) {
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
 * Generate a brand scale from two anchor hex values (600 = base, 800 = accent).
 * Positions 200-500 interpolate from wash toward 600.
 * Position 700 is a mix of 600 and 800.
 * Positions 900-950 darken from 800.
 * If only one hex provided, falls back to generateScale.
 */
export function generateBrandScale(baseHex) {
  const base = chroma(baseHex);
  const [bL, bC, bH] = base.oklch();
  const hue = bH || 0;

  const scale = {};

  // 600 = sacred, exact brand hex, never touched
  scale[600] = baseHex;

  // Detect brand intent from lightness
  const isPastel = bL > 0.75;
  const isDark = bL < 0.45;

  let l200, l400, l800;

  // 800 multiplier scales with lightness — lighter brands get gentler emphasis
  // L=0.30 → 0.65× (deep), L=0.60 → 0.78×, L=0.85 → 0.88× (gentle)
  const emphasisMult = 0.55 + (bL * 0.40);

  if (isPastel) {
    l200 = Math.min(0.95, bL + (1 - bL) * 0.60);
    l400 = bL + (l200 - bL) * 0.50;
    l800 = bL * emphasisMult;
  } else if (isDark) {
    // Dark brand — 200 needs visible range, at least 0.55 lightness
    l200 = Math.max(0.55, bL + (0.95 - bL) * 0.50);
    l400 = bL + (l200 - bL) * 0.50;
    l800 = bL * emphasisMult;
  } else {
    // 200 lightness scales with brand — darker brands get closer 200
    l200 = bL + (0.95 - bL) * 0.70;
    l400 = bL + (l200 - bL) * 0.50;
    l800 = bL * emphasisMult;
  }

  // Chroma scales with lightness — lighter = less chroma, darker = slightly less
  const c200 = bC * 0.45;
  const c400 = bC * 0.55;
  const c800 = bC * 0.70;

  // Four core positions
  scale[200] = safeOklch(l200, c200, hue);
  scale[400] = safeOklch(l400, c400, hue);
  scale[800] = safeOklch(l800, c800, hue);

  // In-between positions — interpolated for internal use (HC, dark, audits)
  // CSS output only writes the four semantic tokens
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
  const chromaVal = 0.15; // moderate chroma — not neon, readable

  // Find lightness values that hit target contrast ratios
  const l600 = findLightnessForContrast(pageBgHex, hue, chromaVal, 9.0);
  const l800 = findLightnessForContrast(pageBgHex, hue, chromaVal, 14.0);

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
 * Same hue, muted chroma, lightness inverted for dark backgrounds.
 * 600 = muted base (readable on dark bg), 800 = slightly lighter muted accent.
 * Not a flip — purpose-built for dark.
 */
export function generateDarkScale(baseHex) {
  const [, c, h] = chroma(baseHex).oklch();
  const hue = h || 0;
  // Mute chroma to ~60% of original — vivid colours are harsh on dark
  const mutedC = c * 0.60;

  const scale = {};
  // Dark bg positions: 200 = near-black, 900 = near-white
  scale[100] = safeOklch(0.18, mutedC * 0.10, hue);
  scale[200] = safeOklch(0.30, mutedC * 0.35, hue);
  scale[300] = safeOklch(0.35, mutedC * 0.35, hue);
  scale[400] = safeOklch(0.42, mutedC * 0.55, hue);
  scale[500] = safeOklch(0.50, mutedC * 0.75, hue);
  scale[600] = safeOklch(0.62, mutedC * 0.85, hue);  // muted base — readable on dark
  scale[700] = safeOklch(0.72, mutedC * 0.70, hue);
  scale[800] = safeOklch(0.80, mutedC * 0.55, hue);  // lighter, softer accent
  scale[900] = safeOklch(0.90, mutedC * 0.25, hue);
  scale[950] = safeOklch(0.95, mutedC * 0.10, hue);

  return scale;
}

/**
 * Generate an 11-step OKLCH scale from any base hex colour.
 * Chroma tapers toward white/black extremes, gamut-clamped per hue.
 */
export function generateScale(baseHex) {
  const color = chroma(baseHex);
  const [l, c, h] = color.oklch();
  const scale = {};

  const isWarm = (h >= 0 && h <= 60) || h >= 340;

  for (const pos of SCALE_POSITIONS) {
    const targetL = LIGHTNESS_MAP[pos];

    // Proportional chroma scaling — chroma decreases with lightness distance.
    // Prevents warm hues (pink/red) from browning at low lightness.
    let adjustedChroma;
    if (targetL > 0.85) {
      adjustedChroma = c * 0.55;          // light tint: enough chroma to read as colour
    } else if (l > 0.01) {
      adjustedChroma = c * (targetL / l);  // proportional to lightness ratio
      adjustedChroma = Math.max(adjustedChroma, 0.02); // floor: keep some colour
    } else {
      adjustedChroma = c;
    }

    // Extra compression for warm hues at low lightness — reds/pinks brown faster
    if (isWarm && targetL < 0.4) {
      adjustedChroma *= 0.6;
    }

    // Slight hue nudge for pink/red at very low L — prevents red/brown collapse
    let targetH = h || 0;
    if (targetL < 0.35 && targetH < 25 && targetH > 0) {
      targetH += 10;
    }

    scale[pos] = safeOklch(targetL, adjustedChroma, targetH);
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
 * Full-range grey scale — achromatic, chroma 0. Same 100–950 positions as generateScale.
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

function contrastRatio(hex1, hex2) {
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
   6. STATUS COLOURS
   ================================================================ */

// Default status hues (OKLCH degrees)
const STATUS_HUES = { Success: 145, Warning: 45, Error: 15, Info: 215 };

// Monochrome: four distinct lightness levels, no hue
const MONO_STATUS_LIGHTNESS = {
  Success: 0.65,
  Warning: 0.55,
  Info:    0.45,
  Error:   0.35,
};

// Status chroma scaled to theme character
const STATUS_CHROMA_MULT = {
  brand:  1.0,    // full status colours
  pastel: 0.45,   // soft muted — cream, lavender
  neon:   1.4,    // vivid — HC, neon
  grey:   0,      // achromatic — monochrome
};

function computeStatusColors(chromaPreset = 'brand', monoHue = null, statusHueOverrides = null) {
  const isMonochrome = chromaPreset === 'grey';

  // Colour-mono: same hue, differentiated by lightness + chroma intensity
  if (monoHue !== null && !isMonochrome) {
    return {
      'color-Success': safeOklch(0.65, 0.04, monoHue),  // pale tint
      'color-Warning': safeOklch(0.55, 0.08, monoHue),  // mid tone
      'color-Error':   safeOklch(0.35, 0.14, monoHue),  // dark, saturated — urgent
      'color-Info':    safeOklch(0.45, 0.08, monoHue),   // between warning and error
      'color-Black':   '#1a1a1a',
      'color-White':   '#fafafa',
    'shadow-Black':  '#000000',
    'shadow-White':  '#ffffff',
  };
  }

  // Monochrome: achromatic status at four distinct lightness levels
  if (isMonochrome) {
    return {
      'color-Success': chroma.oklch(MONO_STATUS_LIGHTNESS.Success, 0, 0).hex(),
      'color-Warning': chroma.oklch(MONO_STATUS_LIGHTNESS.Warning, 0, 0).hex(),
      'color-Error':   chroma.oklch(MONO_STATUS_LIGHTNESS.Error,   0, 0).hex(),
      'color-Info':    chroma.oklch(MONO_STATUS_LIGHTNESS.Info,    0, 0).hex(),
      'color-Black':   '#1a1a1a',
      'color-White':   '#fafafa',
    'shadow-Black':  '#000000',
    'shadow-White':  '#ffffff',
  };
  }

  // Use overrides from definition if provided, otherwise defaults
  const hues = statusHueOverrides
    ? { ...STATUS_HUES, ...statusHueOverrides }
    : STATUS_HUES;

  // Chroma respects theme character — calm is soft, neon is vivid
  const chromaMult = STATUS_CHROMA_MULT[chromaPreset] ?? 1.0;

  // Status colours have minimum chroma floors — Error must feel alarming even in pastel themes.
  const errChroma  = Math.max(0.18 * chromaMult, 0.12);  // min 0.12 — never brownish
  const warnChroma = Math.max(0.14 * chromaMult, 0.10);  // min 0.10 — stays readable
  const succChroma = Math.max(0.14 * chromaMult, 0.08);  // min 0.08
  const infoChroma = Math.max(0.10 * chromaMult, 0.06);  // min 0.06

  return {
    'color-Success': safeOklch(0.55, succChroma, hues.Success),
    'color-Warning': safeOklch(0.75, warnChroma, hues.Warning),
    'color-Error':   safeOklch(0.55, errChroma, hues.Error),
    'color-Info':    safeOklch(0.55, infoChroma, hues.Info),
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
    // Warm dark — slight warmth avoids flat/shiny black feel.
    // HC dark uses pure black separately (overridden below).
    return {
      'page-bg':         '#1f1c1c',   // warm dark canvas
      'page-bg-raised':  '#302b2b',   // card surface — visible lift
      'page-bg-sunken':  '#141111',   // inset/recessed — noticeably darker
      'page-bg-overlay': '#3a3434',   // modal surface — clear separation
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


/* ================================================================
   8. SEMANTIC TOKEN MAPPING
   ================================================================ */

/* DELETED — scale flip replaces semantic token mapping.
   Kept as reference comment. Original function computed brand-c-*, text-* tokens.
function _computeSemanticTokens_DELETED(scales, pageBg, isDark, chromaPreset = 'brand') {
  const { primary, secondary, neutral } = scales;

  // Helper: build both var() reference (for CSS) and resolved hex (for audit)
  function dual(varRef, hexVal) { return { css: varRef, hex: hexVal }; }

  // "light" = light-coloured, "dark" = dark-coloured (visual, not semantic)
  // Same scale references for all luminance modes — the scale values change, not the mapping.
  // Only the *base* tokens (text, primary, secondary) shift position per luminance.

  let tokens;

  if (isDark) {
    tokens = {
      'brand-c-text':            dual('var(--neutral-400)',       neutral[400]),
      'brand-c-primary':         dual('var(--primary-300)',       primary[300]),
      'brand-c-secondary':       dual('var(--secondary-300)',     secondary[300]),
      'brand-c-neutral':         dual('var(--neutral-600)',       neutral[600]),
      // Dark mode base: 300 for accent (200 washes out low-chroma inputs), 400 for emphasis
      'brand-c-primary-dark':    dual('var(--primary-400)',       primary[400]),
      'brand-c-secondary-dark':  dual('var(--secondary-400)',     secondary[400]),
    };
  } else if (chromaPreset === 'calm') {
    tokens = {
      'brand-c-text':            dual('var(--neutral-800)',       neutral[800]),
      'brand-c-primary':         dual('var(--primary-600)',       primary[600]),
      'brand-c-secondary':       dual('var(--secondary-600)',     secondary[600]),
      'brand-c-neutral':         dual('var(--neutral-700)',       neutral[700]),
      // Pastel: compressed range — 700 not 800 for dark variants
      'brand-c-primary-dark':    dual('var(--primary-700)',       primary[700]),
      'brand-c-secondary-dark':  dual('var(--secondary-700)',     secondary[700]),
    };
  } else {
    tokens = {
      'brand-c-text':            dual('var(--neutral-800)',       neutral[800]),
      'brand-c-primary':         dual('var(--primary-600)',       primary[600]),
      'brand-c-secondary':       dual('var(--secondary-600)',     secondary[600]),
      'brand-c-neutral':         dual('var(--neutral-700)',       neutral[700]),
      'brand-c-primary-dark':    dual('var(--primary-800)',       primary[800]),
      'brand-c-secondary-dark':  dual('var(--secondary-800)',     secondary[800]),
    };
  }

  // Shared across all luminance modes — "light" and "dark" mean visual colour
  const shared = {
    'brand-c-bg':              dual('var(--page-bg)',            pageBg['page-bg']),
    'brand-c-bg-light':        dual('var(--page-bg-raised)',     pageBg['page-bg-raised']),
    'brand-c-bg-dark':         dual('var(--neutral-950)',        neutral[950]),
    'brand-c-text-light':      dual('var(--neutral-400)',        neutral[400]),
    'brand-c-text-dark':       dual('var(--neutral-900)',        neutral[900]),
    'brand-c-primary-light':   dual('var(--primary-200)',        primary[200]),
    'brand-c-secondary-light': dual('var(--secondary-200)',      secondary[200]),
    'brand-c-neutral-light':   dual('var(--neutral-400)',        neutral[400]),
    'brand-c-neutral-dark':    dual('var(--neutral-900)',        neutral[900]),
  };

  // Pastel override: compressed neutral-dark range
  if (chromaPreset === 'calm' && !isDark) {
    shared['brand-c-neutral-dark'] = dual('var(--neutral-800)', neutral[800]);
  }

  // Dedicated text tokens — atoms use these, not neutral positions
  // WCAG: body ≥ 4.5:1, secondary ≥ 4.5:1, emphasis ≥ 7:1 against page-bg
  const textTokens = isDark ? {
    'text-body':      dual('var(--neutral-200)',  neutral[200]),   // off-white on dark bg
    'text-secondary': dual('var(--neutral-400)',  neutral[400]),   // dimmed but legible
    'text-emphasis':  dual('var(--neutral-100)',  neutral[100]),   // near-white headings
    'text-inverse':   dual('var(--neutral-900)',  neutral[900]),   // dark text for light surfaces
  } : {
    'text-body':      dual('var(--neutral-800)',  neutral[800]),   // readable on light bg
    'text-secondary': dual('var(--neutral-700)',  neutral[700]),   // muted but legible
    'text-emphasis':  dual('var(--neutral-900)',  neutral[900]),   // strong headings
    'text-inverse':   dual('var(--neutral-400)',  neutral[400]),   // light text for dark surfaces
  };

  const merged = { ...shared, ...tokens, ...textTokens };

  // Split into css and hex maps
  const css = {};
  const hex = {};
  for (const [k, v] of Object.entries(merged)) {
    css[k] = v.css;
    hex[k] = v.hex;
  }
  return { css, hex };
}
END DELETED FUNCTION */


/* ================================================================
   9. HIGH CONTRAST OVERRIDES
   ================================================================ */

/**
 * HC overrides applied after normal computation.
 * Takes luminance to support both HC-dark and HC-light variants.
 */
function generateHighContrastOverrides(isDark, scales) {
  // HC uses hardcoded hex for bg/text/neutral (pure black/white, not from scales).
  // Primary/secondary use scale position 300 (dark) or 500 (light) — NOT 200 which
  // is above the chroma taper threshold (L=0.85) and gets washed out to pastels.
  // Position 300 retains full chroma = vivid, unmissable accent colours.
  const { primary, secondary } = scales;
  const vals = isDark ? {
    'brand-c-bg':              '#000000',
    'brand-c-text':            '#ffffff',
    'brand-c-bg-light':        '#1a1a1a',
    'brand-c-bg-dark':         '#000000',
    'brand-c-text-light':      '#cccccc',
    'brand-c-text-dark':       '#ffffff',
    'brand-c-neutral-light':   '#333333',
    'brand-c-neutral':         '#aaaaaa',
    'brand-c-neutral-dark':    '#111111',
    'text-body':               '#ffffff',
    'text-secondary':          '#cccccc',
    'text-emphasis':           '#ffffff',
    'text-inverse':            '#000000',
  } : {
    'brand-c-bg':              '#ffffff',
    'brand-c-text':            '#000000',
    'brand-c-bg-light':        '#f5f5f5',
    'brand-c-bg-dark':         '#111111',
    'brand-c-text-light':      '#cccccc',
    'brand-c-text-dark':       '#000000',
    'brand-c-neutral-light':   '#e0e0e0',
    'brand-c-neutral':         '#555555',
    'brand-c-neutral-dark':    '#222222',
    'text-body':               '#000000',
    'text-secondary':          '#333333',
    'text-emphasis':           '#000000',
    'text-inverse':            '#ffffff',
  };

  // HC primary/secondary — var() refs for CSS, resolved hex for audit.
  // Dark HC: 300 (vivid, full chroma on black bg)
  // Light HC: 600 (deep, high contrast on white bg — 500 only hits ~4:1)
  // Position 200 is above chroma taper threshold (L≥0.85 → chroma×0.45).
  const priSec = isDark ? {
    'brand-c-primary':         { css: 'var(--primary-300)',     hex: primary[300] },
    'brand-c-secondary':       { css: 'var(--secondary-300)',   hex: secondary[300] },
    'brand-c-primary-light':   { css: 'var(--primary-200)',     hex: primary[200] },
    'brand-c-secondary-light': { css: 'var(--secondary-200)',   hex: secondary[200] },
    'brand-c-primary-dark':    { css: 'var(--primary-500)',     hex: primary[500] },
    'brand-c-secondary-dark':  { css: 'var(--secondary-500)',   hex: secondary[500] },
  } : {
    'brand-c-primary':         { css: 'var(--primary-600)',     hex: primary[600] },
    'brand-c-secondary':       { css: 'var(--secondary-600)',   hex: secondary[600] },
    'brand-c-primary-light':   { css: 'var(--primary-300)',     hex: primary[300] },
    'brand-c-secondary-light': { css: 'var(--secondary-300)',   hex: secondary[300] },
    'brand-c-primary-dark':    { css: 'var(--primary-800)',     hex: primary[800] },
    'brand-c-secondary-dark':  { css: 'var(--secondary-800)',   hex: secondary[800] },
  };

  const css = {};
  const hex = {};
  // Flat hex overrides (bg, text, neutral)
  for (const [k, v] of Object.entries(vals)) {
    css[k] = v;
    hex[k] = v;
  }
  // Dual overrides (primary/secondary — var() for CSS, hex for audit)
  for (const [k, v] of Object.entries(priSec)) {
    css[k] = v.css;
    hex[k] = v.hex;
  }
  return { css, hex };
}


/* ================================================================
   10. AUDIT FUNCTIONS
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
export function auditScale(scales, pageBg) {
  const pageBgHex = pageBg ? pageBg['page-bg'] : '#faf5ed';
  const pairs = [
    ['primary-500 on page-bg',     scales.primary[500], pageBgHex, 4.5],
    ['primary-300 on neutral-950', scales.primary[300], scales.neutral[950], 4.5],
    ['neutral-900 on page-bg',     scales.neutral[900], pageBgHex, 7],
    ['neutral-400 on neutral-950', scales.neutral[400], scales.neutral[950], 7],
  ];
  return pairs.map(([label, fg, bg, target]) => ({
    label,
    ratio: Math.round(contrastRatio(fg, bg) * 10) / 10,
    pass: contrastRatio(fg, bg) >= target,
    target,
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
 * Pick two rainbow hues most distant from primary and secondary.
 * Rainbow hues (ROYGBIV): ~25, 45, 85, 160, 220, 275, 340
 */
const RAINBOW_HUES = [25, 45, 85, 160, 220, 275, 340];

function hueDist(a, b) {
  const d = Math.abs(a - b);
  return Math.min(d, 360 - d);
}

function nearestRainbow(targetHue) {
  let best = 1;
  let bestDist = 999;
  for (let i = 0; i < RAINBOW_HUES.length; i++) {
    const d = hueDist(targetHue, RAINBOW_HUES[i]);
    if (d < bestDist) {
      bestDist = d;
      best = i + 1; // rainbow-1 to rainbow-7
    }
  }
  return best;
}

function pickDistantRainbowHues(priHue, secHue) {
  // Score each rainbow hue by minimum distance from primary AND secondary
  const scored = RAINBOW_HUES.map(h => ({
    hue: h,
    minDist: Math.min(hueDist(h, priHue), hueDist(h, secHue)),
  })).sort((a, b) => b.minDist - a.minDist);

  // Best two — most distant from both brand colours, and distinct from each other
  const focusHue = scored[0].hue;
  let highlightHue = scored[1].hue;
  // Ensure focus and highlight are at least 60° apart
  if (hueDist(focusHue, highlightHue) < 60 && scored.length > 2) {
    highlightHue = scored[2].hue;
  }
  return { focusHue, highlightHue };
}

function computeFocusHighlightTokens(scales, pageBg, isDark, isHC = false, status = {}, chromaPreset = 'brand') {
  const pageBgHex = pageBg['page-bg'];
  const cardBgHex = pageBg['page-bg-raised'];

  const isMono = chromaPreset === 'grey';

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

  // Text colour hex for distinction check
  const textHex = isHC
    ? (isDark ? '#ffffff' : '#000000')
    : (scales.neutral?.[700] || '#a4a4a4');

  // Compute hex at the gap-split hues — max chroma, contrast-checked
  // Neon: absolute max chroma at the lightness that gives 4.5:1 on light, or bright on dark
  // Light mode: find the brightest L that still passes contrast, then max chroma at that L
  // Dark mode: high L, max chroma
  const targetL = isDark ? 0.82 : 0.62;
  let focusHex = safeOklch(targetL, maxChromaForHue(focusTargetHue, targetL), focusTargetHue);
  let highlightHex = safeOklch(targetL, maxChromaForHue(highlightTargetHue, targetL), highlightTargetHue);

  // Contrast-check: 4.5:1 AA against bg (AAA may conflict with text distinction)
  // Chroma kept high so colour distinguishes from neutral text
  let fAttempts = 0;
  let fL = targetL;
  while (fAttempts < 20 && (
    contrastRatio(focusHex, pageBgHex) < 4.5 ||
    contrastRatio(focusHex, cardBgHex) < 4.5
  )) {
    fL += isDark ? 0.03 : -0.03;
    focusHex = safeOklch(fL, maxChromaForHue(focusTargetHue, fL), focusTargetHue);
    fAttempts++;
  }

  let hAttempts = 0;
  let hL = targetL;
  while (hAttempts < 20 && (
    contrastRatio(highlightHex, pageBgHex) < 4.5 ||
    contrastRatio(highlightHex, cardBgHex) < 4.5
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
   11. CSS OUTPUT
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
  // Pastel compresses semantic tokens into the light range (200→500)
  const SEMANTIC_MAP = chromaPreset === 'calm' && !isDark
    ? { 200: 'tint', 300: 'mid', 400: 'base', 500: 'emphasis' }
    : { 200: 'tint', 400: 'mid', 600: 'base', 800: 'emphasis' };
  // Contrast tokens — accent hex from brand config for hover/interaction.
  // Always output (falls back to emphasis) so brand contrast doesn't bleed into other themes.
  const contrastMap = {
    primary: definition.primaryAccent || null,
    secondary: definition.secondaryAccent || null,
  };

  for (const [family, scale] of Object.entries(scales)) {
    ln(`  /* -- ${family.toUpperCase()} SCALE ---- */`);
    for (const [pos, semName] of Object.entries(SEMANTIC_MAP)) {
      if (scale[pos]) ln(`  --${family}-${semName}: ${scale[pos]};`);
    }
    // Always output contrast — accent if provided, else same as emphasis
    const emphasisPos = (chromaPreset === 'calm' && !isDark) ? 500 : 800;
    const contrastVal = contrastMap[family] || scale[emphasisPos] || '';
    if (contrastVal) ln(`  --${family}-contrast: ${contrastVal};`);
    ln();
  }

  // Zone meta (behavioural axes — CSS layers read these)
  const intensity = definition.intensity || 'full';
  ln(`  /* -- THEME META ---------------------------------- */`);
  ln(`  --theme-luminance: ${luminance};`);
  ln(`  --theme-chroma: ${chromaPreset};`);
  ln(`  --theme-intensity: ${intensity};`);
  ln();

  // Page backgrounds (dedicated surface tokens — not part of neutral scale)
  ln(`  /* -- PAGE BACKGROUNDS ---------------------------- */`);
  for (const [k, v] of Object.entries(pageBg)) ln(`  --${k}: ${v};`);
  ln();

  // Status + black/white
  ln(`  /* -- STATUS + BLACK/WHITE ----------------------- */`);
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

  // Text + theme-specific
  ln(`  /* -- TEXT + THEME-SPECIFIC ---------------------- */`);
  if (definition.highContrast) {
    ln(`  --color-Text: var(--color-Black);`);
    ln(`  --color-Text-contrast: var(--color-White);`);
  } else if (isDark) {
    ln(`  --color-Text: var(--text-emphasis);`);
    ln(`  --color-Text-contrast: var(--page-bg);`);
  } else {
    ln(`  --color-Text: var(--text-emphasis);`);
    ln(`  --color-Text-contrast: var(--page-bg);`);
  }
  ln(`  --media-brightness: ${isDark ? '0.86' : '1'};`);
  ln(`  --media-saturation: ${chromaPreset === 'grey' ? '0' : (isDark ? '0.90' : '1')};`);
  ln(`  --media-contrast: ${chromaPreset === 'grey' ? '1.05' : (isDark ? '0.98' : '1')};`);

  // SVG ghost colour — from text scale (always default neutral, never brand-overridden)
  ln(`  --svg-ghost-color: var(--text-tint);`);

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
   12. MAIN EXPORTS
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

  const monoHue = isMonoPalette ? (chroma(primary).get('oklch.h') || 0) : null;

  // 1. Compute page backgrounds first — HC generators need pageBg for contrast
  let pageBg = computePageBackgrounds(isDark, chromaPreset);
  if (definition.highContrast) {
    pageBg = isDark
      ? { 'page-bg': '#000000', 'page-bg-raised': '#1a1a1a', 'page-bg-sunken': '#000000', 'page-bg-overlay': '#222222' }
      : { 'page-bg': '#ffffff', 'page-bg-raised': '#f5f5f5', 'page-bg-sunken': '#eeeeee', 'page-bg-overlay': '#fafafa' };
  }

  // 2. Generate scales — pick the right generator per mode:
  //    Brand light:  sacred 600/800 hex, rest interpolated
  //    Brand dark:   muted from brand hue, purpose-built for dark bg
  //    HC:           contrast-targeted from hue, AAA ratios
  //    Global light: single-hex lightness curve
  //    Global dark:  muted from hue
  let priScale, secScale;

  if (definition.highContrast) {
    // HC always calculates — brand hex is hue source only
    priScale = generateHCScale(primary, pageBg['page-bg']);
    secScale = isMonoPalette ? generateGreyFullScale() : generateHCScale(secondary, pageBg['page-bg']);
  } else if (definition.brand && !isDark) {
    // Brand light — 600 is sacred. 800 = always computed (darker shade, same hue).
    // Accent hex goes to --{family}-contrast (for hover), never overwrites 800.
    priScale = generateBrandScale(primary);
    secScale = isMonoPalette ? generateGreyFullScale() : generateBrandScale(secondary);
  } else if (isDark) {
    // Dark mode (brand or global) — muted, purpose-built for dark bg
    priScale = generateDarkScale(primary);
    secScale = isMonoPalette ? generateGreyFullScale() : generateDarkScale(secondary);
  } else {
    // Global light — single-hex lightness curve
    priScale = generateScale(primary);
    secScale = isMonoPalette ? generateGreyFullScale() : generateScale(secondary);
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
  if (isDark && !isMonoPalette) {
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

  // Neutral: computed from theme type (warm grey / pure / tinted for mono).
  const neutralHue = neutralType === 'pure' ? 0 : NEUTRAL_HUE;
  let neuScale = isMonoPalette
    ? generateTintedNeutralScale(monoHue, 0.02)
    : neutralType === 'pure' ? generatePureGreyScale() : generateNeutralScale(neutralHue);

  // Brand can override neutral with a custom hex (decorative use — borders, chrome, UI).
  const neutralHex = definition.neutralHex || null;

  // Text snapshot happens AFTER this point (after dark flip below) so it gets the right
  // light/dark values. But BEFORE any brand neutralHex override so text stays readable.
  const scales = { primary: priScale, secondary: secScale, neutral: neuScale };

  // 3. Neutral still needs the dark flip — primary/secondary have their own
  //    dark generators but neutral uses the same scale for both modes.
  if (isDark) {
    const FLIP_PAIRS = [[100, 950], [200, 900], [300, 800], [400, 700], [500, 600]];
    const neuFlip = scales.neutral;
    for (const [a, b] of FLIP_PAIRS) {
      if (neuFlip[a] !== undefined && neuFlip[b] !== undefined) {
        [neuFlip[a], neuFlip[b]] = [neuFlip[b], neuFlip[a]];
      }
    }
    // Bump tint and mid up — after flip they're too dark/close together
    // Primary dark: tint=L0.30, mid=L0.42. Match that spread for neutral.
    neuFlip[200] = neuFlip[400];  // tint → old 700 (L≈0.36)
    neuFlip[400] = neuFlip[500];  // mid → old 600 (L≈0.48)
  }

  // HC pageBg + scale overrides handled by generateHCScale above — no manual overrides needed

  // Text = snapshot of neutral AFTER dark flip (so dark themes get light text).
  // Taken BEFORE any brand neutralHex override so text stays readable.
  const textScale = { ...scales.neutral };
  scales.text = textScale;

  // Now apply brand neutral override if provided (decorative — borders, chrome, UI).
  if (neutralHex) {
    scales.neutral = definition.brand && !isDark ? generateBrandScale(neutralHex)
      : isDark ? generateDarkScale(neutralHex)
      : generateScale(neutralHex);
  }

  // 5. Compute status colours (definition can override hues via statusHues field)
  const status = computeStatusColors(chromaPreset, isMonoPalette ? monoHue : null, definition.statusHues || null);

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
  const focusHighlight = computeFocusHighlightTokens(scales, pageBg, isDark, definition.highContrast, status, chromaPreset);

  // 6. Build CSS (scales are the API — no semantic layer)
  const css = buildCSS(definition, scales, pageBg, status, focusHighlight);

  // 7. Run audits (uses flipped scale hex values directly)
  const themeAudit = auditTheme(scales, pageBg, focusHighlight);
  const scaleAudit = auditScale(scales, pageBg);

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
