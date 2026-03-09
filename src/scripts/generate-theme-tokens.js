#!/usr/bin/env node

/**
 * generate-theme-tokens.js — SINGLE SOURCE OF TRUTH
 *
 * Input:  2 brand hex colours (primary + secondary)
 * Output: 8 theme CSS files + ZonePalette.css, then chains generate-core-tokens.js
 *
 * M3 colour system via @material/material-color-utilities:
 *   - HCT colour space, tonal palettes (0–100)
 *   - Default: brand source kept, variants from M3 tones
 *   - Dark: tone 80 (M3 desaturation), bg tone 8
 *   - HC: neon yellow #FFFF00 + cyan #00FFFF on black (CVD-safe, AAA)
 *   - Cream: soft beige (hue 75, chroma 10)
 *   - Monochrome: zero chroma greyscale
 *   - CVD: clinically fixed pairs with M3 tonal variants
 *
 * ALL themes get real light/dark extended variants from tonal palettes.
 * WCAG AA minimum on all text-on-bg pairs (AAA for HC).
 *
 * Run:   node scripts/generate-theme-tokens.js
 * Deps:  npm install @material/material-color-utilities@0.3.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import {
  argbFromHex, hexFromArgb, Hct, TonalPalette,
  SchemeTonalSpot, SchemeMonochrome,
} from '@material/material-color-utilities';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ── BRAND INPUT — change these two per website ──────────────── */

const BRAND = {
  primary:   '#8fa68a',
  secondary: '#c4907c',
};

/* ── CVD SAFE PALETTES (clinically fixed, never change) ──────── */

const CVD_FIXED = {
  protanopia:   { primary: '#1e40af', secondary: '#f59e0b' },
  deuteranopia: { primary: '#6d28d9', secondary: '#f97316' },
  tritanopia:   { primary: '#cc3399', secondary: '#06b6d4' },
};

/* ── HELPERS ──────────────────────────────────────────────────── */

const hex  = argb => hexFromArgb(argb);
const hct  = h => Hct.fromInt(argbFromHex(h));
const pal  = h => TonalPalette.fromInt(argbFromHex(h));
const tone = (p, t) => hex(p.tone(t));

// WCAG 2.1 contrast ratio
function luminance(h) {
  const r = parseInt(h.slice(1,3),16)/255;
  const g = parseInt(h.slice(3,5),16)/255;
  const b = parseInt(h.slice(5,7),16)/255;
  const [R,G,B] = [r,g,b].map(c => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4));
  return 0.2126*R + 0.7152*G + 0.0722*B;
}
function contrastRatio(fg, bg) {
  const L1 = luminance(fg), L2 = luminance(bg);
  return (Math.max(L1,L2) + 0.05) / (Math.min(L1,L2) + 0.05);
}
function wcagGrade(ratio) {
  return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA-lg' : 'FAIL';
}


/* ── OKLCH MIXING — pre-compute zone palette as hex ──────────── */

function toLinear(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function fromLinear(c) { return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1/2.4) - 0.055; }

function hexToRgb(h) {
  return [parseInt(h.slice(1,3),16)/255, parseInt(h.slice(3,5),16)/255, parseInt(h.slice(5,7),16)/255];
}
function rgbToHex(r, g, b) {
  const f = v => Math.max(0, Math.min(255, Math.round(v * 255)));
  return '#' + [f(r), f(g), f(b)].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToOklab(r, g, b) {
  const lr = toLinear(r), lg = toLinear(g), lb = toLinear(b);
  const l_ = 0.4122214708*lr + 0.5363325363*lg + 0.0514459929*lb;
  const m_ = 0.2119034982*lr + 0.6806995451*lg + 0.1073969566*lb;
  const s_ = 0.0883024619*lr + 0.2817188376*lg + 0.6299787005*lb;
  const l = Math.cbrt(l_), m = Math.cbrt(m_), s = Math.cbrt(s_);
  return [
    0.2104542553*l + 0.7936177850*m - 0.0040720468*s,
    1.9779984951*l - 2.4285922050*m + 0.4505937099*s,
    0.0259040371*l + 0.7827717662*m - 0.8086757660*s,
  ];
}

function oklabToRgb(L, a, b) {
  const l_ = L + 0.3963377774*a + 0.2158037573*b;
  const m_ = L - 0.1055613458*a - 0.0638541728*b;
  const s_ = L - 0.0894841775*a - 1.2914855480*b;
  const l = l_*l_*l_, m = m_*m_*m_, s = s_*s_*s_;
  return [
    fromLinear(+4.0767416621*l - 3.3077115913*m + 0.2309699292*s),
    fromLinear(-1.2684380046*l + 2.6097574011*m - 0.3413193965*s),
    fromLinear(-0.0041960863*l - 0.7034186147*m + 1.7076147010*s),
  ];
}

function oklabToOklch(L, a, b) {
  const C = Math.sqrt(a*a + b*b);
  const H = Math.atan2(b, a) * 180 / Math.PI;
  return [L, C, H < 0 ? H + 360 : H];
}

function oklchToOklab(L, C, H) {
  const rad = H * Math.PI / 180;
  return [L, C * Math.cos(rad), C * Math.sin(rad)];
}

/** Replicate CSS color-mix(in oklch, hexA pct%, hexB) */
function mix(hexA, hexB, pct) {
  const [r1,g1,b1] = hexToRgb(hexA);
  const [r2,g2,b2] = hexToRgb(hexB);
  const [L1,C1,H1] = oklabToOklch(...rgbToOklab(r1,g1,b1));
  const [L2,C2,H2] = oklabToOklch(...rgbToOklab(r2,g2,b2));
  const t = pct / 100;

  let dH = H2 - H1;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;

  const L = L1 * t + L2 * (1-t);
  const C = C1 * t + C2 * (1-t);
  let H = H1 + dH * (1-t);
  if (H < 0) H += 360;
  if (H >= 360) H -= 360;

  if (C1 < 0.001 && C2 < 0.001) {
    const [La, a, b] = oklchToOklab(L, 0, 0);
    return rgbToHex(...oklabToRgb(La, a, b));
  }

  const [La, a, b] = oklchToOklab(L, C, H);
  return rgbToHex(...oklabToRgb(La, a, b));
}


/* ── ZONE PALETTE — rule-based, tonal palettes ───────────────── */

/**
 * Compute all zone palette tokens as hex using M3 tonal palettes
 * and color theory hue offsets.
 *
 * DESIGN RULES (from dark mode best practices + WCAG):
 *
 * ZONE BACKGROUNDS:
 *  • Chroma reduced to ~60% of brand (muted, not vivid — backgrounds stay quiet)
 *  • Dark mode: even more muted (~50%) to avoid eye strain
 *  • Light theme: tones 60/75/85/92 (deep→soft = subtle pastel range)
 *  • Dark theme: tones 10/15/20/28 (deep→soft = dark but retains hue identity)
 *  • NO pure black backgrounds — always retain slight hue tint
 *  • 4 depth levels per hue give visible scroll-transition differentiation
 *
 * ZONE PATTERNS (icons overlaid on zone bg):
 *  • Light theme: darker tones (40-50) for strong contrast on light bg
 *  • Dark theme: lighter + DESATURATED tones (70-80) for readability
 *  • Dark chroma reduced to ~70% (article: "dial down on saturation")
 *  • All pairs must pass WCAG 3:1 min (decorative elements)
 *
 * HUE VARIETY (color theory from brand primary):
 *  • primary   = brand primary hue
 *  • secondary = brand secondary hue (already contrasting)
 *  • earth     = midpoint of primary + secondary (warm blend)
 *  • forest    = analogous -30° from primary (cooler green)
 *  • dusk      = split-complement (opposite side of wheel)
 *  • mist      = triadic +120° (distant accent)
 *
 * PAGE TINTS (very subtle bg shifts):
 *  • Built from oklch mix — minimal chroma shift from page bg
 */
function computeZonePalette(tokens, zone) {
  const dark = zone.luminance === 'dark';
  const pri = tokens.primary;
  const sec = tokens.secondary;
  const txt = tokens.text;
  const bg  = tokens.bg;

  // Extract brand hues via HCT
  const priHct = hct(pri);
  const secHct = hct(sec);

  // ── Color theory hue map ──
  const hues = {
    primary:   priHct.hue,
    secondary: secHct.hue,
    earth:     (priHct.hue + secHct.hue) / 2,              // midpoint blend
    forest:    (priHct.hue - 30 + 360) % 360,              // analogous cool
    dusk:      ((priHct.hue + 180 - 30 + 360) % 360),      // split-complement
    mist:      (priHct.hue + 120) % 360,                    // triadic
  };

  // Also include a "neutral" based on text hue (often near-achromatic)
  const txtHct = hct(txt);
  hues.neutral = txtHct.hue;

  // ── Chroma rules ──
  // Minimum chroma floors — prevents all hues collapsing to grey on low-chroma brands
  const BG_CHROMA_FLOOR      = dark ? 8 : 12;     // backgrounds: subtle but hue-identifiable
  const PAT_CHROMA_FLOOR     = dark ? 15 : 20;    // patterns: visually distinct from bg
  // Rainbow tokens now global (Okabe-Ito) — see src/styles/tokens/rainbow.css

  const brandChroma = priHct.chroma;
  const bgChroma      = Math.max(brandChroma * (dark ? 0.50 : 0.65), BG_CHROMA_FLOOR);
  const patChroma     = Math.max(brandChroma * (dark ? 0.70 : 0.85), PAT_CHROMA_FLOOR);
  const neutralChroma = Math.max(brandChroma * 0.15, 3);  // neutral stays near-achromatic but not dead

  // ── Tone rules ──
  // 4 depth levels: deep / mid / base / soft
  const bgTones  = dark
    ? { deep: 10, mid: 15, base: 20, soft: 28 }    // dark: retain hue in darkness
    : { deep: 60, mid: 75, base: 85, soft: 92 };    // light: soft pastels

  const patTones = dark
    ? { vivid: 80, soft: 70 }   // dark: lighter for readability
    : { vivid: 40, soft: 50 };  // light: darker for contrast

  // ── Build tonal palettes ──
  function bgPal(hue)  { return TonalPalette.fromHueAndChroma(hue, bgChroma); }
  function patPal(hue) { return TonalPalette.fromHueAndChroma(hue, patChroma); }
  function neutBgPal()  { return TonalPalette.fromHueAndChroma(hues.neutral, neutralChroma); }
  function neutPatPal() { return TonalPalette.fromHueAndChroma(hues.neutral, neutralChroma * 2); }

  // ── Zone background tokens ──
  const zoneBg = {};
  for (const name of ['primary', 'secondary', 'earth', 'forest', 'dusk']) {
    const p = bgPal(hues[name]);
    zoneBg[`zone-bg-${name}-deep`] = hex(p.tone(bgTones.deep));
    zoneBg[`zone-bg-${name}-mid`]  = hex(p.tone(bgTones.mid));
    zoneBg[`zone-bg-${name}`]      = hex(p.tone(bgTones.base));
    zoneBg[`zone-bg-${name}-soft`] = hex(p.tone(bgTones.soft));
  }

  // Neutral — barely tinted, acts as "plain" zone
  const np = neutBgPal();
  zoneBg['zone-bg-neutral-deep'] = hex(np.tone(bgTones.deep));
  zoneBg['zone-bg-neutral-mid']  = hex(np.tone(bgTones.mid));
  zoneBg['zone-bg-neutral']      = hex(np.tone(bgTones.base));
  zoneBg['zone-bg-neutral-soft'] = hex(np.tone(bgTones.soft));

  // Mist — distant triadic accent
  const mp = bgPal(hues.mist);
  zoneBg['zone-bg-mist-deep'] = hex(mp.tone(bgTones.deep));
  zoneBg['zone-bg-mist']      = hex(mp.tone(bgTones.base));

  // Page-level tints (very subtle — oklch mix)
  zoneBg['zone-bg-page-tint'] = mix(pri, bg, 15);
  zoneBg['zone-bg-page-warm'] = mix(sec, bg, 15);
  zoneBg['zone-bg-page']      = bg;

  // ── Zone pattern (icon colour) tokens ──
  const zonePat = {};
  for (const name of ['primary', 'secondary', 'earth', 'forest', 'dusk']) {
    const p = patPal(hues[name]);
    zonePat[`zone-pattern-${name}-vivid`] = hex(p.tone(patTones.vivid));
    zonePat[`zone-pattern-${name}-soft`]  = hex(p.tone(patTones.soft));
    zonePat[`zone-pattern-${name}`]       = hex(p.tone(dark ? 75 : 45));
  }

  // Neutral pattern
  const nnp = neutPatPal();
  zonePat['zone-pattern-neutral-vivid'] = hex(nnp.tone(patTones.vivid));
  zonePat['zone-pattern-neutral']       = hex(nnp.tone(dark ? 75 : 45));

  // Mist pattern
  const mpp = patPal(hues.mist);
  zonePat['zone-pattern-mist'] = hex(mpp.tone(dark ? 75 : 45));

  // Contrast — page bg or text depending on luminance
  zonePat['zone-pattern-contrast'] = dark ? tokens.text : tokens['bg-dark'];

  // ── Numbered aliases (for demo pages / quick access) ──
  const numbered = {
    'zone-bg-1': zoneBg['zone-bg-primary-deep'],
    'zone-bg-2': zoneBg['zone-bg-earth'],
    'zone-bg-3': zoneBg['zone-bg-secondary-deep'],
    'zone-bg-4': zoneBg['zone-bg-forest'],
    'zone-bg-5': zoneBg['zone-bg-dusk'],
    'zone-bg-6': zoneBg['zone-bg-neutral-soft'],
    'zone-pattern-1': zonePat['zone-pattern-primary-vivid'],
    'zone-pattern-2': zonePat['zone-pattern-earth'],
    'zone-pattern-3': zonePat['zone-pattern-secondary-vivid'],
    'zone-pattern-4': zonePat['zone-pattern-forest'],
    'zone-pattern-5': zonePat['zone-pattern-dusk'],
    'zone-pattern-6': zonePat['zone-pattern-neutral'],
  };

  return { ...zoneBg, ...zonePat, ...numbered };
}


/**
 * Generate full 15-token set for a LIGHT theme.
 * All from M3 tonal palettes — every token is a distinct value.
 *
 * Token usage:
 *   primary-light  → container bg, hover fill (text goes ON this)
 *   primary-dark   → emphasis text, strong borders
 *   bg-light       → elevated surface (cards, modals)
 *   bg-dark        → footer, overlay, dark zones
 *   text-light     → captions, secondary text
 *   text-dark      → headlines, strong emphasis
 */
function lightTokens(pp, sp, np, overrides = {}) {
  const o = overrides;
  return {
    bg:               o.bg        || tone(np, 98),
    text:             o.text      || tone(np, 15),
    primary:          o.primary   || tone(pp, 40),
    secondary:        o.secondary || tone(sp, 40),
    'primary-light':  tone(pp, 85),
    'primary-dark':   tone(pp, 25),
    'secondary-light':tone(sp, 85),
    'secondary-dark': tone(sp, 25),
    'neutral-light':  tone(np, 92),
    'neutral':        tone(np, 50),
    'neutral-dark':   tone(np, 20),
    'bg-light':       tone(np, 100),
    'bg-dark':        tone(np, 20),
    'text-light':     tone(np, 40),
    'text-dark':      tone(np, 10),
  };
}

/**
 * Generate full 15-token set for a DARK theme.
 * M3 dark mode: primary→tone80 (desaturated), surface→tone6–10.
 */
function darkTokens(pp, sp, np, overrides = {}) {
  const o = overrides;
  return {
    bg:               o.bg        || tone(np, 8),
    text:             o.text      || tone(np, 87),
    primary:          o.primary   || tone(pp, 80),
    secondary:        o.secondary || tone(sp, 80),
    'primary-light':  tone(pp, 90),    // light container on dark bg
    'primary-dark':   tone(pp, 60),    // muted emphasis
    'secondary-light':tone(sp, 90),
    'secondary-dark': tone(sp, 60),
    'neutral-light':  tone(np, 25),    // elevated surface
    'neutral':        tone(np, 70),    // mid neutral
    'neutral-dark':   tone(np, 15),    // sunken surface
    'bg-light':       tone(np, 14),    // card surface
    'bg-dark':        tone(np, 4),     // deepest bg
    'text-light':     tone(np, 70),    // secondary text
    'text-dark':      tone(np, 95),    // max emphasis
  };
}


/* ── THEME BUILDERS ──────────────────────────────────────────── */

function makeDefault() {
  const pp = pal(BRAND.primary);
  const sp = pal(BRAND.secondary);
  const scheme = new SchemeTonalSpot(hct(BRAND.primary), false, 0);
  const np = TonalPalette.fromInt(scheme.surfaceVariant);

  return {
    name: 'default',
    meta: { title: 'Default', sample: 'Natural sage' },
    tokens: lightTokens(pp, sp, np, {
      primary: BRAND.primary,       // keep source brand colour
      secondary: BRAND.secondary,
    }),
    zone: { luminance: 'light', hue: '80%', mixDark: 'var(--brand-c-bg-dark)', mixLight: 'var(--brand-c-bg-light)' },
  };
}

function makeDark() {
  const pp = pal(BRAND.primary);
  const sp = pal(BRAND.secondary);
  const scheme = new SchemeTonalSpot(hct(BRAND.primary), true, 0);
  const np = TonalPalette.fromInt(scheme.surfaceVariant);

  return {
    name: 'dark',
    meta: { title: 'Dark', sample: 'Low strain' },
    tokens: darkTokens(pp, sp, np),
    zone: { luminance: 'dark', hue: '30%', mixDark: 'var(--brand-c-bg)', mixLight: 'var(--brand-c-text)' },
    shadows: true,
  };
}

function makeHighContrast() {
  // Neon from brand: keep hue, max chroma (120), tone 75 → AAA on black
  // Gamut clamps naturally: green→neon green, blue→neon blue, etc.
  const priHct = hct(BRAND.primary);
  const secHct = hct(BRAND.secondary);

  // Neon core: same hue, max chroma, tone 75 (bright + vivid + AAA)
  const neonPri = hex(Hct.from(priHct.hue, 120, 75).toInt());
  const neonSec = hex(Hct.from(secHct.hue, 120, 75).toInt());

  // Build tonal palettes from neon colours for proper variants
  const pp = TonalPalette.fromHueAndChroma(priHct.hue, 120);
  const sp = TonalPalette.fromHueAndChroma(secHct.hue, 120);
  const np = TonalPalette.fromHueAndChroma(0, 0); // pure neutral

  return {
    name: 'high-contrast',
    meta: { title: 'High Contrast', sample: 'Max visibility' },
    tokens: {
      bg:               '#000000',
      text:             '#ffffff',
      primary:          neonPri,
      secondary:        neonSec,
      'primary-light':  tone(pp, 85),   // softer neon (containers)
      'primary-dark':   tone(pp, 60),   // deeper neon (borders)
      'secondary-light':tone(sp, 85),
      'secondary-dark': tone(sp, 60),
      'neutral-light':  '#333333',      // elevated dark surface
      'neutral':        '#aaaaaa',      // mid grey
      'neutral-dark':   '#111111',      // sunken surface
      'bg-light':       '#1a1a1a',      // card surface
      'bg-dark':        '#000000',      // deepest
      'text-light':     '#cccccc',      // secondary text
      'text-dark':      '#ffffff',      // max emphasis
    },
    zone: { luminance: 'dark', hue: '15%', mixDark: 'var(--brand-c-bg)', mixLight: 'var(--brand-c-text)' },
    shadows: true,
    extras: { 'a11y-hc-icon-filter': 'brightness(0) invert(1)', btnFilledText: 'var(--color-Black)' },
  };
}

function makeMonochrome() {
  const np = TonalPalette.fromHueAndChroma(0, 0); // zero chroma

  return {
    name: 'monochrome',
    meta: { title: 'Monochrome', sample: 'Grayscale' },
    tokens: lightTokens(np, np, np, {
      bg: tone(np, 95),
      text: tone(np, 15),
      primary: tone(np, 35),     // darker than before for AA
      secondary: tone(np, 42),   // was 55, now passes AA on bg(95)
    }),
    zone: { luminance: 'light', hue: '60%', mixDark: 'var(--brand-c-bg-dark)', mixLight: 'var(--brand-c-bg-light)' },
    extras: { mediaSaturation: '0', mediaContrast: '1.05' },
  };
}

function makeCalm() {
  // Soft beige: hue 75 (sand), low chroma 10
  const bp = TonalPalette.fromHueAndChroma(75, 10);
  // Complement: muted sage
  const sp = TonalPalette.fromHueAndChroma(150, 10);

  return {
    name: 'calm',
    meta: { title: 'Calm Mode', sample: 'Warm paper' },
    tokens: lightTokens(bp, sp, bp, {
      bg: tone(bp, 93),          // soft beige
      text: tone(bp, 20),        // dark warm brown
      primary: tone(bp, 40),     // warm mid-brown
      secondary: tone(sp, 42),   // muted sage
    }),
    zone: { luminance: 'light', hue: '70%', mixDark: 'var(--brand-c-bg-dark)', mixLight: 'var(--brand-c-bg-light)' },
  };
}

function makeCVD(type) {
  const colours = CVD_FIXED[type];
  const pp = pal(colours.primary);
  const sp = pal(colours.secondary);
  const scheme = new SchemeTonalSpot(hct(colours.primary), false, 0);
  const np = TonalPalette.fromInt(scheme.surfaceVariant);

  const meta = {
    protanopia:   { title: 'Protanopia',   sample: 'Red-blind' },
    deuteranopia: { title: 'Deuteranopia', sample: 'Green-blind' },
    tritanopia:   { title: 'Tritanopia',   sample: 'Blue-blind' },
  };

  return {
    name: type,
    meta: meta[type],
    tokens: lightTokens(pp, sp, np),
    zone: { luminance: 'light', hue: '75%', mixDark: 'var(--brand-c-bg-dark)', mixLight: 'var(--brand-c-bg-light)' },
  };
}


/* ── CSS FILE GENERATION ─────────────────────────────────────── */

function generateThemeCSS(theme) {
  const { name, meta, tokens, zone, shadows, extras } = theme;
  const dark = zone.luminance === 'dark';
  const L = [];
  const ln = (s = '') => L.push(s);

  ln(`/**`);
  ln(` * Theme: ${meta.title}`);
  ln(` * Auto-generated by generate-theme-tokens.js (M3 colour system)`);
  ln(` * Core: bg=${tokens.bg} text=${tokens.text} primary=${tokens.primary} secondary=${tokens.secondary}`);
  ln(` * Luminance: ${zone.luminance} | Zone hue: ${zone.hue}`);
  ln(` */`);
  ln();
  ln(`:root {`);
  ln(`  /* ── CORE IDENTITY ────────────────────────── */`);
  ln(`  --brand-c-bg: ${tokens.bg};`);
  ln(`  --brand-c-text: ${tokens.text};`);
  ln(`  --brand-c-primary: ${tokens.primary};`);
  ln(`  --brand-c-secondary: ${tokens.secondary};`);
  ln();

  for (const [label, keys] of [
    ['PRIMARY',    ['primary-light', 'primary-dark']],
    ['SECONDARY',  ['secondary-light', 'secondary-dark']],
    ['NEUTRAL',    ['neutral-light', 'neutral', 'neutral-dark']],
    ['BACKGROUND', ['bg-light', 'bg-dark']],
    ['TEXT',       ['text-light', 'text-dark']],
  ]) {
    ln(`  /* ── ${label} ──────────────────────────────── */`);
    for (const k of keys) ln(`  --brand-c-${k}: ${tokens[k]};`);
    ln();
  }

  ln(`  /* ── ZONE META ────────────────────────────── */`);
  ln(`  --theme-luminance: ${zone.luminance};`);
  ln(`  --zone-mix-hue: ${zone.hue};`);
  ln();

  // ── ZONE PALETTE — pre-computed hex, no runtime color-mix ──
  const zonePalette = computeZonePalette(tokens, zone);
  const bgKeys = Object.keys(zonePalette).filter(k => k.startsWith('zone-bg-'));
  const patKeys = Object.keys(zonePalette).filter(k => k.startsWith('zone-pattern-'));

  ln(`  /* ── ZONE BACKGROUNDS (section/page — low chroma, 4 depths) ── */`);
  for (const k of bgKeys) ln(`  --${k}: ${zonePalette[k]};`);
  ln();
  ln(`  /* ── ZONE PATTERNS (icon/decoration overlays — mid chroma) ── */`);
  for (const k of patKeys) ln(`  --${k}: ${zonePalette[k]};`);
  ln();

  ln(`  /* ── PATTERN OPACITY PRESETS ──────────────── */`);
  ln(`  /* Use on sections: style="--po-opacity: var(--po-opacity-bold)" */`);
  ln(`  --po-opacity-ghost: 0.08;`);     // barely visible texture
  ln(`  --po-opacity-subtle: 0.15;`);    // soft watermark
  ln(`  --po-opacity-light: 0.25;`);     // default — visible but quiet
  ln(`  --po-opacity-medium: 0.40;`);    // clear pattern, bg still dominant
  ln(`  --po-opacity-bold: 0.60;`);      // strong pattern presence
  ln(`  --po-opacity-vivid: 0.80;`);     // near-full, icon colour reads true
  ln(`  --po-opacity-full: 1.0;`);       // debug / feature sections
  ln();

  ln(`  /* ── PATTERN MOTION DEFAULTS ─────────────── */`);
  ln(`  /* Consumed by data-motion CSS keyframes      */`);
  ln(`  --pm-drift-speed: 6s;`);         // ambient animation cycle duration
  ln(`  --pm-drift-range: 10px;`);       // float/drift translate amplitude
  ln(`  --pm-breathe-scale: 1.04;`);     // scale peak for breathe/pulse
  ln(`  --pm-twinkle-min: 0.3;`);        // twinkle opacity floor (ratio of --po-opacity)
  ln(`  --pm-rotate-range: 8deg;`);      // rotation amplitude for sway
  ln(`  --parallax-intensity: 1;`);      // global GSAP warp + stellar multiplier (a11y slider)
  ln();

  ln(`  /* ── THEME-SPECIFIC ───────────────────────── */`);
  if (extras?.['a11y-hc-icon-filter']) ln(`  --a11y-hc-icon-filter: ${extras['a11y-hc-icon-filter']};`);
  ln(`  --page-bg: var(--brand-c-bg);`);
  ln(`  --btn-filled-text: ${extras?.btnFilledText || (dark ? 'var(--brand-c-bg)' : 'var(--color-White)')};`);
  ln(`  --media-brightness: ${dark ? '0.86' : '1'};`);
  ln(`  --media-saturation: ${extras?.mediaSaturation || (dark ? '0.90' : '1')};`);
  ln(`  --media-contrast: ${extras?.mediaContrast || (dark ? '0.98' : '1')};`);

  // Shadows now live in src/styles/zones/theme-luminance-dark.css

  ln(`}`);

  return L.join('\n');
}


/* ── ZONE PALETTE CSS ────────────────────────────────────────── */
/* Zone tokens are now pre-computed as hex and embedded in each    */
/* theme's :root block. No separate ZonePalette.css needed.       */
/* The old color-mix(in oklch, ...) approach caused Chrome to      */
/* return oklch strings that GSAP cannot interpolate.              */


/* ── WCAG AUDIT ──────────────────────────────────────────────── */

function auditTheme(theme) {
  const t = theme.tokens;
  const pairs = [
    ['text on bg',            t.text,            t.bg],
    ['primary on bg',         t.primary,         t.bg],
    ['secondary on bg',       t.secondary,       t.bg],
    ['text-light on bg',      t['text-light'],   t.bg],
    ['text on bg-light',      t.text,            t['bg-light']],
    ['text on primary-light', t.text,            t['primary-light']],
    ['primary-dark on bg',    t['primary-dark'],  t.bg],
  ];

  let allPass = true;
  const results = [];
  for (const [label, fg, bg] of pairs) {
    const ratio = contrastRatio(fg, bg);
    const grade = wcagGrade(ratio);
    const icon = grade === 'FAIL' ? '❌' : grade === 'AA-lg' ? '⚠️' : '✅';
    results.push(`    ${label.padEnd(24)} ${fg} on ${bg} → ${ratio.toFixed(1)}:1 ${grade} ${icon}`);
    // text-on-bg must be AA (4.5:1), decorative pairs can be AA-lg (3:1)
    if (label.startsWith('text') && ratio < 4.5) allPass = false;
    if (!label.startsWith('text') && ratio < 3) allPass = false;
  }
  return { allPass, results };
}


/* ── MAIN ────────────────────────────────────────────────────── */

const rootDir    = path.join(__dirname, '..', '..');
const brandDir   = path.join(rootDir, 'src', 'styles', 'themes', 'brand');
const a11yDir    = path.join(rootDir, 'src', 'styles', 'themes', 'a11y');
const tokensDir  = path.join(rootDir, 'src', 'styles', 'tokens');

[brandDir, a11yDir, tokensDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

console.log('🎨 generate-theme-tokens.js (M3 colour system)');
console.log(`   Brand: primary=${BRAND.primary}  secondary=${BRAND.secondary}\n`);

const themes = [
  makeDefault(), makeCalm(), makeDark(), makeHighContrast(),
  makeMonochrome(), makeCVD('protanopia'), makeCVD('deuteranopia'), makeCVD('tritanopia'),
];

// Write theme CSS files
for (const theme of themes) {
  const css = generateThemeCSS(theme);
  const out = theme.name === 'default'
    ? path.join(brandDir, 'BrandDefault.css')
    : path.join(a11yDir, `a11y-${theme.name}.css`);
  fs.writeFileSync(out, css);
  const zoneCount = Object.keys(computeZonePalette(theme.tokens, theme.zone)).length;
  console.log(`  ✅ ${path.relative(rootDir, out)}  (${theme.zone.luminance} · hue ${theme.zone.hue} · ${zoneCount} zone hex)`);
}

// NOTE: ZonePalette.css no longer needed — zone tokens embedded as hex in each theme file
// You can safely delete src/styles/tokens/ZonePalette.css and remove its import

// Chain generate-core-tokens.js
const coreTokensScript = path.join(__dirname, 'generate-core-tokens.js');
if (fs.existsSync(coreTokensScript)) {
  console.log(`\n🔗 Running generate-core-tokens.js...`);
  execSync(`node "${coreTokensScript}"`, { cwd: rootDir, stdio: 'inherit' });
} else {
  console.warn(`\n⚠️  generate-core-tokens.js not found at ${coreTokensScript}`);
  console.warn(`   Run it manually: node scripts/generate-core-tokens.js`);
}

const pad = (s, n) => String(s).padEnd(n);
const sampleZone = computeZonePalette(themes[0].tokens, themes[0].zone);
const zoneTokenCount = Object.keys(sampleZone).length;
console.log(`\n🎨 Generated ${themes.length} themes (15 brand + ${zoneTokenCount} zone hex = ${15 + zoneTokenCount} tokens each)`);
console.log(`   Zone palette: pre-computed hex — zero runtime color-mix\n`);
console.log(`   Theme             bg         text       primary    secondary   lum    hue`);
console.log(`   ───────────────   ─────────  ─────────  ─────────  ──────────  ─────  ────`);
for (const t of themes) {
  console.log(`   ${pad(t.meta.title,17)} ${pad(t.tokens.bg,11)}${pad(t.tokens.text,11)}${pad(t.tokens.primary,11)}${pad(t.tokens.secondary,12)}${pad(t.zone.luminance,7)}${t.zone.hue}`);
}

// WCAG audit
console.log(`\n📋 WCAG Contrast Audit:`);
let allClear = true;
for (const theme of themes) {
  const { allPass, results } = auditTheme(theme);
  const icon = allPass ? '✅' : '⚠️';
  console.log(`\n  ${icon} ${theme.meta.title}:`);
  results.forEach(r => console.log(r));
  if (!allPass) allClear = false;
}
console.log(allClear ? '\n✅ All themes pass WCAG AA' : '\n⚠️  Some pairs below AA — review above');
console.log();
