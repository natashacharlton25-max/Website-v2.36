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
      adjustedChroma = c * 0.3;           // near-white: very low chroma
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
  if (chromaPreset === 'pastel') {
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
  // Warm off-white — colour personality in zones, not page
  return {
    'page-bg':         '#f5f4f0',   // warm cream-white
    'page-bg-raised':  '#ffffff',   // card — pure white lifts off
    'page-bg-sunken':  '#edecea',   // recessed — slightly darker
    'page-bg-overlay': '#ffffff',   // modal — clean white
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
  } else if (chromaPreset === 'pastel') {
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
  if (chromaPreset === 'pastel' && !isDark) {
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
  // Position 200 is above chroma taper threshold (L≥0.85 → chroma×0.3) = washed out.
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
export function auditTheme(semantic) {
  // Core audit: default text/accent on the theme's own background.
  // text-light and text-dark are cross-context tokens (for use on explicitly
  // dark/light surfaces within the page) — their contrast depends on the
  // surface they're paired with at the component level, not on page-bg.
  const textPairs = [
    ['text on bg',           semantic['brand-c-text'],       semantic['brand-c-bg']],
    ['primary on bg',        semantic['brand-c-primary'],    semantic['brand-c-bg']],
    ['secondary on bg',      semantic['brand-c-secondary'],  semantic['brand-c-bg']],
  ];

  const decorativePairs = [
    ['neutral on bg',          semantic['brand-c-neutral'],        semantic['brand-c-bg']],
    ['primary-dark on bg',     semantic['brand-c-primary-dark'],   semantic['brand-c-bg']],
    ['secondary-dark on bg',   semantic['brand-c-secondary-dark'], semantic['brand-c-bg']],
  ];

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
   11. CSS OUTPUT
   ================================================================ */

function buildCSS(definition, scales, pageBg, status) {
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

  // Raw scales (primary API — components use these directly)
  for (const [family, scale] of Object.entries(scales)) {
    const positions = Object.keys(scale).map(Number).sort((a, b) => a - b);
    const range = `${positions[0]}-${positions[positions.length - 1]}`;
    ln(`  /* -- ${family.toUpperCase()} SCALE (${range}) ---- */`);
    for (const pos of positions) ln(`  --${family}-${pos}: ${scale[pos]};`);
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

  // Theme-specific
  ln(`  /* -- THEME-SPECIFIC ----------------------------- */`);
  ln(`  --btn-filled-text: ${isDark ? pageBg['page-bg'] : scales.neutral[100]};`);
  ln(`  --media-brightness: ${isDark ? '0.86' : '1'};`);
  ln(`  --media-saturation: ${chromaPreset === 'grey' ? '0' : (isDark ? '0.90' : '1')};`);
  ln(`  --media-contrast: ${chromaPreset === 'grey' ? '1.05' : (isDark ? '0.98' : '1')};`);

  // HC-specific extras
  if (definition.highContrast) {
    ln(`  --a11y-hc-icon-filter: brightness(0) invert(${isDark ? '1' : '0'});`);
    ln(`  --btn-filled-text: ${isDark ? 'var(--color-Black)' : 'var(--color-White)'};`);
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
  const isMonoPalette = rawPrimary === rawSecondary;

  let primary = rawPrimary;
  let secondary = rawSecondary;

  // HC brighten: force primary/secondary to max chroma at luminance-appropriate lightness.
  if (definition.highContrast) {
    const priHue = chroma(primary).get('oklch.h') || 0;
    const hcPriL = isDark ? 0.80 : 0.55;
    const hcSecL = isDark ? 0.75 : 0.50;
    primary = safeOklch(hcPriL, 0.20, priHue);
    if (!isMonoPalette) {
      const secHue = chroma(secondary).get('oklch.h') || 0;
      secondary = safeOklch(hcSecL, 0.18, secHue);
    }
  }

  const monoHue = isMonoPalette ? (chroma(primary).get('oklch.h') || 0) : null;

  // 1. Generate raw scales
  const priScale = generateScale(primary);
  const secScale = isMonoPalette ? generateGreyFullScale() : generateScale(secondary);

  // Neutral: mono themes get hue-tinted, otherwise warm or pure grey
  const neutralHue = neutralType === 'pure' ? 0 : NEUTRAL_HUE;
  const neuScale = isMonoPalette
    ? generateTintedNeutralScale(monoHue, 0.02)
    : neutralType === 'pure' ? generatePureGreyScale() : generateNeutralScale(neutralHue);
  const scales = { primary: priScale, secondary: secScale, neutral: neuScale };

  // 2. Dark mode: flip scale positions so positions are contextually correct
  // var(--primary-100) = always subtle, var(--primary-900) = always intense
  // Skip 500↔600 for primary/secondary — 300 is the dark mode accent (Decision 6)
  if (isDark) {
    const FLIP_PAIRS = [[100, 950], [200, 900], [300, 800], [400, 700], [500, 600]];
    for (const scale of Object.values(scales)) {
      for (const [a, b] of FLIP_PAIRS) {
        if (scale[a] !== undefined && scale[b] !== undefined) {
          [scale[a], scale[b]] = [scale[b], scale[a]];
        }
      }
    }
  }

  // 3. Compute page backgrounds
  let pageBg = computePageBackgrounds(isDark, chromaPreset);

  // 4. Apply HC overrides if flagged
  if (definition.highContrast) {
    pageBg = isDark
      ? { 'page-bg': '#000000', 'page-bg-raised': '#1a1a1a', 'page-bg-sunken': '#000000', 'page-bg-overlay': '#222222' }
      : { 'page-bg': '#ffffff', 'page-bg-raised': '#f5f5f5', 'page-bg-sunken': '#eeeeee', 'page-bg-overlay': '#fafafa' };
  }

  // 5. Compute status colours (definition can override hues via statusHues field)
  const status = computeStatusColors(chromaPreset, isMonoPalette ? monoHue : null, definition.statusHues || null);

  // HC overrides for status black/white
  if (definition.highContrast) {
    status['color-Black'] = '#000000';
    status['color-White'] = '#ffffff';
  }

  // 6. Build CSS (scales are the API — no semantic layer)
  const css = buildCSS(definition, scales, pageBg, status);

  // 7. Run audits (uses flipped scale hex values directly)
  const themeAudit = auditTheme({
    'brand-c-text':           scales.neutral[800],
    'brand-c-primary':        scales.primary[600],
    'brand-c-secondary':      scales.secondary[600],
    'brand-c-bg':             pageBg['page-bg'],
    'brand-c-neutral':        scales.neutral[700],
    'brand-c-primary-dark':   scales.primary[800],
    'brand-c-secondary-dark': scales.secondary[800],
  });
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
