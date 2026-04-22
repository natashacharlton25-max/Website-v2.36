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
  findLightnessForContrast,
  contrastRatio,
  ensureContrastAgainst,
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
// Non-HC: AA normal (4.5:1) at base, AAA body (5.5) at emphasis.
// HC:     AAA normal (7:1) at base, AAA emphasis (9.5) at emphasis.
export const VIVID_TARGETS = {
  nonHC: { base: 4.5, emphasis: 5.5 },
  hc:    { base: 7.0, emphasis: 9.5 },
};

// Chroma cap at 'base' position — bumped for HC (slightly bolder feel).
export const VIVID_CHROMA = {
  nonHC: 0.20,
  hc:    0.22,
};

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

// Bg surfaces — identical to cloudcalm's (vivid shares calm's comfort surfaces).
// Ported verbatim from cloudcalm.js generateCloudcalmPageBg fixed hexes.
const WARM_BG_LIGHT = {
  'page-bg':         '#f2edeb',
  'page-bg-raised':  '#f8f4f3',
  'page-bg-sunken':  '#eae3e1',
  'page-bg-overlay': '#f8f4f3',
};
const WARM_BG_LIGHT_HC = {
  'page-bg':         '#faf6f4',
  'page-bg-raised':  '#fffcfa',
  'page-bg-sunken':  '#f0e9e6',
  'page-bg-overlay': '#fffcfa',
};
const WARM_BG_DARK = {
  'page-bg':         '#2c2828',
  'page-bg-raised':  '#3a3535',
  'page-bg-sunken':  '#221f1f',
  'page-bg-overlay': '#433d3d',
};
// Dark HC pushes bg deeper — near-black to give scales maximum L headroom.
const WARM_BG_DARK_HC = {
  'page-bg':         '#1a1616',
  'page-bg-raised':  '#262121',
  'page-bg-sunken':  '#120f0f',
  'page-bg-overlay': '#2e2828',
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
// L spread wider than calm's: 0.80 tint → 0.38 emphasis on light, mirrored
// on dark. This lets vivid neutrals span from bg-whisper to deep contrast
// the same way primary/secondary do.
// Chroma bumped so neutrals read as clearly "brand-tinted" — vivid's whole
// character is bold colour, so neutrals shouldn't read as whisper-grey.
// C 0.035-0.050 lands between calm (0.020) and full brand (0.20).
export const VIVID_NEUTRAL_OVERRIDES = {
  light: {
    nonHC: { 200: { L: 0.84, C: 0.035 }, 400: { L: 0.64, C: 0.045 }, 600: { L: 0.48, C: 0.050 }, 800: { L: 0.35, C: 0.050 } },
    hc:    { 200: { L: 0.80, C: 0.035 }, 400: { L: 0.58, C: 0.045 }, 600: { L: 0.42, C: 0.050 }, 800: { L: 0.28, C: 0.050 } },
  },
  dark: {
    nonHC: { 200: { L: 0.35, C: 0.050 }, 400: { L: 0.55, C: 0.050 }, 600: { L: 0.72, C: 0.045 }, 800: { L: 0.90, C: 0.035 } },
    hc:    { 200: { L: 0.42, C: 0.050 }, 400: { L: 0.58, C: 0.050 }, 600: { L: 0.75, C: 0.045 }, 800: { L: 0.92, C: 0.035 } },
  },
};

// Text chroma bumped to 0.070-0.085 range — text should read as visibly
// brand-coloured in vivid, not a quiet tinted grey. Still under the
// primary/secondary chroma cap (0.20-0.22) so text stays softer than brand.
export const VIVID_TEXT_OVERRIDES = {
  light: {
    nonHC: { 200: { L: 0.78, C: 0.060 }, 400: { L: 0.58, C: 0.075 }, 600: { L: 0.42, C: 0.085 }, 800: { L: 0.28, C: 0.085 } },
    hc:    { 200: { L: 0.72, C: 0.060 }, 400: { L: 0.52, C: 0.075 }, 600: { L: 0.35, C: 0.085 }, 800: { L: 0.20, C: 0.085 } },
  },
  dark: {
    nonHC: { 200: { L: 0.28, C: 0.085 }, 400: { L: 0.52, C: 0.085 }, 600: { L: 0.72, C: 0.075 }, 800: { L: 0.92, C: 0.060 } },
    hc:    { 200: { L: 0.35, C: 0.085 }, 400: { L: 0.55, C: 0.085 }, 600: { L: 0.75, C: 0.075 }, 800: { L: 0.95, C: 0.060 } },
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
export function generateVividScale(baseInput, { pageBgHex, hc = false } = {}) {
  const hue = typeof baseInput === 'string'
    ? (chroma(baseInput).get('oklch.h') || 0)
    : (baseInput?.H || 0);

  const chromaCap = hc ? VIVID_CHROMA.hc : VIVID_CHROMA.nonHC;
  const targets = hc ? VIVID_TARGETS.hc : VIVID_TARGETS.nonHC;

  const scale = {};

  // L clamps prevent scales from washing into near-black (light bg, dark
  // emphasis) or near-white (dark bg, light emphasis). Keeps visible colour
  // identity at all positions even when contrast target is easily exceeded.
  //
  // Uses OKLCH L (perceptual, hue-independent) not sRGB luminance — the
  // latter reads saturated warm colours (e.g. bright pink) as "dark" even
  // when L is mid, causing scales to spread into dark-bg-branch territory
  // and crash at the low end.
  const bgL = chroma(pageBgHex).oklch()[0] || 0.5;
  const bgIsLightForClamp = bgL > 0.5;
  const L_MIN = bgIsLightForClamp ? 0.30 : 0.45;  // how dark can foreground go
  const L_MAX = bgIsLightForClamp ? 0.55 : 0.72;  // how light

  function clampL(l) { return Math.max(L_MIN, Math.min(L_MAX, l)); }

  // Find L that hits contrast target against page-bg, clamped to safe range
  const l600 = clampL(findLightnessForContrast(pageBgHex, hue, chromaCap, targets.base));
  const l800 = clampL(findLightnessForContrast(pageBgHex, hue, chromaCap, targets.emphasis));

  // Chroma values — gamut-clamped per hue+lightness
  const c600 = Math.min(chromaCap, maxChromaForHue(hue, l600) * 0.90);
  const c800 = Math.min(chromaCap, maxChromaForHue(hue, l800) * 0.90);

  scale[600] = safeOklch(l600, c600, hue);
  scale[800] = safeOklch(l800, c800, hue);
  scale[700] = safeOklch((l600 + l800) / 2, (c600 + c800) / 2, hue);

  // Spread remaining positions — mirrored depending on bg luminance
  const bgIsLight = chroma(pageBgHex).luminance() > 0.5;
  if (bgIsLight) {
    scale[200] = safeOklch(0.90, chromaCap * 0.35, hue);
    scale[300] = safeOklch(0.80, chromaCap * 0.45, hue);
    scale[400] = safeOklch(0.65, chromaCap * 0.60, hue);
    scale[500] = safeOklch(0.55, chromaCap * 0.80, hue);
    scale[900] = safeOklch(0.15, chromaCap * 0.40, hue);
    scale[950] = safeOklch(0.10, chromaCap * 0.20, hue);
    scale[100] = safeOklch(0.96, chromaCap * 0.05, hue);
  } else {
    scale[200] = safeOklch(0.30, chromaCap * 0.45, hue);
    scale[300] = safeOklch(0.35, chromaCap * 0.30, hue);
    scale[400] = safeOklch(0.42, chromaCap * 0.50, hue);
    scale[500] = safeOklch(0.50, chromaCap * 0.70, hue);
    scale[900] = safeOklch(0.92, chromaCap * 0.30, hue);
    scale[950] = safeOklch(0.96, chromaCap * 0.10, hue);
    scale[100] = safeOklch(0.08, chromaCap * 0.05, hue);
  }

  return scale;
}

/* ================================================================
   NEUTRAL SCALE — same logic as cloudcalm (shared comfort)
   ================================================================ */

export function generateVividNeutral(mode, { primaryHex, neutralHex, luminance = 'light', hc = false, greyTintHue = null } = {}) {
  const scale = {};

  function resolveHue() {
    if (mode === 'warm')      return NEUTRAL_WARM_HUE;
    if (mode === 'cool')      return NEUTRAL_COOL_HUE;
    if (mode === 'grey-tint') return greyTintHue ?? (chroma(primaryHex).get('oklch.h') || 0);
    return chroma(neutralHex || primaryHex).get('oklch.h') || 0;
  }
  function resolveTintChroma() {
    if (mode === 'warm')      return 0.020;
    if (mode === 'cool')      return 0.040;
    if (mode === 'grey-tint') return 0.020;
    return 0.025;
  }

  if (mode === 'grey') {
    for (const { pos, lightness } of NEUTRAL_STEPS) {
      scale[pos] = chroma.oklch(lightness, 0, 0).hex();
    }
  } else {
    const hue = resolveHue();
    const tintChroma = resolveTintChroma();
    for (const { pos, lightness } of NEUTRAL_STEPS) {
      scale[pos] = safeOklch(lightness, tintChroma, hue);
    }
  }

  // Apply overrides at semantic positions
  const variant = luminance === 'dark' ? 'dark' : 'light';
  const level = hc ? 'hc' : 'nonHC';
  const overrides = VIVID_NEUTRAL_OVERRIDES[variant][level];

  const overrideHue = mode === 'grey' ? 0 : resolveHue();
  for (const [pos, { L, C }] of Object.entries(overrides)) {
    const chr = mode === 'grey' ? 0 : C;
    scale[pos] = chroma.oklch(L, chr, overrideHue).hex();
  }

  return scale;
}

/* ================================================================
   TEXT SCALE — same logic as cloudcalm
   ================================================================ */

export function generateVividText(mode, { primaryHex, textHex, luminance = 'light', hc = false, greyTintHue = null } = {}) {
  if (mode === 'black-white') {
    const anchor = 'var(--color-Black)';
    return { tint: anchor, mid: anchor, base: anchor, emphasis: anchor };
  }

  // Fixed text anchors — distinct from neutral's anchors so warm+warm or
  // cool+cool never collide. grey-tint's hue supplied by validator
  // (secondary in split mode, primary in mono, primary+30° edge).
  let hue;
  if (mode === 'grey') hue = TEXT_GREY_HUE;
  else if (mode === 'warm') hue = TEXT_WARM_HUE;
  else if (mode === 'cool') hue = TEXT_COOL_HUE;
  else if (mode === 'grey-tint') hue = greyTintHue ?? (chroma(primaryHex).get('oklch.h') || 0);
  else hue = chroma(textHex).get('oklch.h') || 0;

  const variant = luminance === 'dark' ? 'dark' : 'light';
  const level = hc ? 'hc' : 'nonHC';
  const overrides = VIVID_TEXT_OVERRIDES[variant][level];
  const isGrey = mode === 'grey';

  return {
    tint:     chroma.oklch(overrides[200].L, isGrey ? 0 : overrides[200].C, hue).hex(),
    mid:      chroma.oklch(overrides[400].L, isGrey ? 0 : overrides[400].C, hue).hex(),
    base:     chroma.oklch(overrides[600].L, isGrey ? 0 : overrides[600].C, hue).hex(),
    emphasis: chroma.oklch(overrides[800].L, isGrey ? 0 : overrides[800].C, hue).hex(),
  };
}

/* ================================================================
   PAGE BACKGROUND — same modes as cloudcalm
   ================================================================ */

export function generateVividPageBg({
  luminance = 'light',
  hc = false,
  bgMode = 'warm',
  primaryHex,
  tertiaryMode,
} = {}) {
  const isDark = luminance === 'dark';
  const resolvedMode = bgMode === 'neutral' ? tertiaryMode : bgMode;

  if (resolvedMode === 'warm' || (resolvedMode === 'grey-tint' && !primaryHex)) {
    if (hc) return isDark ? { ...WARM_BG_DARK_HC } : { ...WARM_BG_LIGHT_HC };
    return isDark ? { ...WARM_BG_DARK } : { ...WARM_BG_LIGHT };
  }

  if (resolvedMode === 'cool') {
    const C = 0.010;
    return isDark
      ? {
          'page-bg':         safeOklch(0.28, C, COOL_HUE),
          'page-bg-raised':  safeOklch(0.34, C, COOL_HUE),
          'page-bg-sunken':  safeOklch(0.24, C, COOL_HUE),
          'page-bg-overlay': safeOklch(0.38, C, COOL_HUE),
        }
      : {
          'page-bg':         safeOklch(0.95, C, COOL_HUE),
          'page-bg-raised':  safeOklch(0.97, C, COOL_HUE),
          'page-bg-sunken':  safeOklch(0.92, C, COOL_HUE),
          'page-bg-overlay': safeOklch(0.97, C, COOL_HUE),
        };
  }

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

  // Tint / Deep / HC — hue-tinted surface. Vivid pushes these ~2× cloudcalm
  // so branded bg modes actually read as branded, not whisper.
  const hue = chroma(primaryHex || '#888888').get('oklch.h') || 0;
  const useDeep = resolvedMode === 'deep' || hc;

  if (isDark) {
    const cPageBg = useDeep ? 0.035 : 0.018;
    const cOther  = useDeep ? 0.030 : 0.015;
    // HC goes deeper than non-HC to give scales maximum L headroom — body
    // text on dark-HC wants 7:1+ which needs bg ≤ L 0.20 or so.
    const lPage   = hc ? 0.18 : 0.32;
    const lRaised = hc ? 0.24 : 0.38;
    const lSunken = hc ? 0.12 : 0.26;
    const lOver   = hc ? 0.28 : 0.42;
    return {
      'page-bg':         safeOklch(lPage,   cPageBg, hue),
      'page-bg-raised':  safeOklch(lRaised, cPageBg, hue),
      'page-bg-sunken':  safeOklch(lSunken, cOther,  hue),
      'page-bg-overlay': safeOklch(lOver,   cPageBg, hue),
    };
  }
  const cPageBg = useDeep ? 0.025 : 0.012;  // was 0.012 / 0.006
  const cOther  = useDeep ? 0.018 : 0.008;  // was 0.008 / 0.004
  return {
    'page-bg':         safeOklch(0.92, cPageBg, hue),
    'page-bg-raised':  safeOklch(0.96, cOther,  hue),
    'page-bg-sunken':  safeOklch(0.88, cPageBg, hue),
    'page-bg-overlay': safeOklch(0.94, cOther,  hue),
  };
}

/* ================================================================
   STATUS + FOCUS/HIGHLIGHT — same as cloudcalm
   ================================================================ */

// Vivid status palettes — saturated equivalents of calm's. Same hue
// mapping per CVD type (standard / protan|deutan / tritan) just bolder.
const VIVID_STATUS_PALETTES = {
  standard: {
    light: { Success: '#1e7d3f', Warning: '#c26100', Error: '#c11f2f', Info: '#1e5a8a' },
    dark:  { Success: '#6cc088', Warning: '#ffb870', Error: '#ff8a8a', Info: '#7fb3e2' },
  },
  protan: {
    light: { Success: '#008f60', Warning: '#c26100', Error: '#9a0070', Info: '#1e5a8a' },
    dark:  { Success: '#5fcfa0', Warning: '#ffb870', Error: '#d070a0', Info: '#7fb3e2' },
  },
  deutan: {
    light: { Success: '#008f60', Warning: '#c26100', Error: '#9a0070', Info: '#1e5a8a' },
    dark:  { Success: '#5fcfa0', Warning: '#ffb870', Error: '#d070a0', Info: '#7fb3e2' },
  },
  tritan: {
    light: { Success: '#1e7d3f', Warning: '#c23424', Error: '#b03478', Info: '#6a3ca8' },
    dark:  { Success: '#6cc088', Warning: '#ff8a7a', Error: '#ff85c0', Info: '#b098e0' },
  },
};

export function generateVividStatus({ luminance = 'light', cvd = null } = {}) {
  const isDark = luminance === 'dark';
  const palette = VIVID_STATUS_PALETTES[cvd] || VIVID_STATUS_PALETTES.standard;
  const p = palette[isDark ? 'dark' : 'light'];
  return {
    'color-Black':  isDark ? '#fafafa' : '#1a1a1a',
    'color-White':  isDark ? '#1a1a1a' : '#fafafa',
    'shadow-Black': '#000000',
    'shadow-White': '#ffffff',
    'color-Success': p.Success,
    'color-Warning': p.Warning,
    'color-Error':   p.Error,
    'color-Info':    p.Info,
  };
}

export function generateVividFocusHighlight({ primaryHex, secondaryHex, pageBg, hc = false, luminance = 'light' } = {}) {
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

  // CVD pre-shift: when the validator flagged brand slots as risky for this
  // CVD type × bg combo, shift the brand hue to a CVD-safe anchor BEFORE
  // generating the scales. This prevents the whole scale from washing to
  // near-grey under the CVD simulation — something the post-scale collision
  // check can't catch because the scale is uniformly invisible, not colliding.
  //
  // Safe target hues per CVD (picked so the shifted hue sits outside the
  // unsafe zone and remains a plausible brand colour):
  //   protan/deutan unsafe: [0-40, 100-165, 330-360] → shift to 270° (violet)
  //   tritan unsafe:        [60-110, 200-260]        → shift to 330° (magenta)
  let cvdSafe = true;
  let cvdNotes = [];
  // Pre-shift threshold: only rewrite brand hue when score ≥ 0.3. Below that
  // the post-scale collision check handles it without losing brand identity.
  const PRE_SHIFT_THRESHOLD = 0.3;
  if (cvdType && cvdRisks && cvdRisks[cvdType] && cvdRisks[cvdType].slots && cvdRisks[cvdType].slots.length && cvdRisks[cvdType].score >= PRE_SHIFT_THRESHOLD) {
    const risk = cvdRisks[cvdType];
    // Aware pre-shift: candidates are CVD-safe hues ordered by preference.
    // Walk the list until one sits ≥60° from the other slot's current hue.
    const CANDIDATES = {
      protan: [270, 240, 200, 60,  90],
      deutan: [250, 210, 60,  90,  180],
      tritan: [330, 20,  300, 350, 40],
    };
    function hueGap(a, b) {
      const d = Math.abs(((a - b) % 360 + 360) % 360);
      return Math.min(d, 360 - d);
    }
    function pickSafeHue(candidates, referenceHue) {
      if (referenceHue === null || !Number.isFinite(referenceHue)) return candidates[0];
      for (const h of candidates) {
        if (hueGap(h, referenceHue) >= 60) return h;
      }
      return candidates[0];
    }

    for (const slot of risk.slots) {
      const current = slot === 'primary' ? primary : (slot === 'secondary' ? secondary : null);
      if (!current) continue;
      const otherHex = slot === 'primary' ? secondaryHex : primaryHex;
      const otherHue = otherHex ? (chroma(otherHex).get('oklch.h') || 0) : null;
      const candidates = CANDIDATES[cvdType] ?? [270];
      const safeHue = pickSafeHue(candidates, otherHue);
      const [L, C] = chroma(current.hex).oklch();
      const shiftedHex = chroma.oklch(L, C || 0, safeHue).hex();
      if (slot === 'primary')   primaryHex   = shiftedHex;
      if (slot === 'secondary') secondaryHex = shiftedHex;
      cvdNotes.push(`pre-shifted ${slot} hue → ${safeHue}° for ${cvdType} (${risk.severity} risk, score ${risk.score.toFixed(2)})`);
    }
  }

  // 1. Page background
  const bgTokens = generateVividPageBg({
    luminance, hc, bgMode: pageBg,
    primaryHex,
    tertiaryMode: typeof tertiaryModeOrHex === 'string' ? tertiaryModeOrHex : null,
  });
  const pageBgHex = bgTokens['page-bg'];

  // 2. Primary + secondary scales (vivid's contrast-targeted logic)
  const primaryScale   = generateVividScale(primaryHex,   { pageBgHex, hc });
  const secondaryScale = generateVividScale(secondaryHex, { pageBgHex, hc });

  // 3. Neutral
  const neutralScale = generateVividNeutral(
    tertiaryIsHex ? 'brand' : tertiaryModeOrHex,
    {
      primaryHex, neutralHex: tertiaryIsHex ? tertiaryHex : null, luminance, hc,
      greyTintHue: greyTintHues?.neutral ?? null,
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
    primaryHex,
    secondaryHex,
    pageBg: bgTokens,
    hc,
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
