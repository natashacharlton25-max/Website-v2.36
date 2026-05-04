/**
 * writer.js — Theme CSS writer.
 *
 * Takes a tokens object produced by any theme generator and formats it as
 * a complete :root { ... } CSS block ready to write to disk.
 *
 * Theme-agnostic. Every generator outputs the same token shape, so this
 * writer never branches on theme type.
 *
 * Input shape (generator output):
 *   {
 *     meta:   { theme, luminance, hc, bgMode, tertiaryMode, textMode, name?, title?, sample? }
 *     scales: {
 *       primary:   { tint, mid, base, emphasis, contrast }
 *       secondary: { tint, mid, base, emphasis, contrast }
 *       neutral:   { tint, mid, base, emphasis, contrast }
 *       text:      { tint, mid, base, emphasis }                // no contrast
 *     }
 *     pageBg:         { 'page-bg', 'page-bg-raised', 'page-bg-sunken', 'page-bg-overlay' }
 *     status:         { 'color-Black', 'color-White', 'shadow-Black', 'shadow-White' }
 *     focusHighlight: { 'focus-color', 'focus-bg', 'highlight-link-color' }
 *   }
 *
 * Pattern opacity + motion constants are NOT emitted per theme. They live
 * in their own shared CSS file (src/styles/tokens/pattern-defaults.css).
 *
 * Status colours (Success/Warning/Error/Info) are bridged to the rainbow
 * palette in src/styles/tokens/status-colors.css — not emitted here.
 */

import { contrastRatio } from './shared/colour-maths.js';

const SCALE_FAMILIES = ['primary', 'secondary', 'neutral', 'text'];

/**
 * Build the full CSS file text for a theme.
 */
export function buildThemeCSS(tokens) {
  const { meta, scales, pageBg, status, focusHighlight } = tokens;
  const { luminance = 'light', hc = false, theme = 'unknown' } = meta;
  const isDark = luminance === 'dark';

  const L = [];
  const ln = (s = '') => L.push(s);

  // ── Header comment ────────────────────────────────────────────────
  ln(`/**`);
  ln(` * Theme: ${meta.name || theme}`);
  if (meta.title) ln(` * Title: ${meta.title}`);
  if (meta.sample) ln(` * Tagline: ${meta.sample}`);
  ln(` * Generator: ${theme}`);
  ln(` * Luminance: ${luminance}${hc ? ' | HC' : ''}`);
  if (meta.bgMode)       ln(` * Page bg: ${meta.bgMode}`);
  if (meta.tertiaryMode) ln(` * Neutral: ${meta.tertiaryMode}`);
  if (meta.textMode)     ln(` * Text: ${meta.textMode}`);
  ln(` */`);
  ln();

  ln(`:root {`);

  // ── Scales ────────────────────────────────────────────────────────
  for (const family of SCALE_FAMILIES) {
    const scale = scales[family];
    if (!scale) continue;

    ln(`  /* -- ${family.toUpperCase()} SCALE ---- */`);
    if (scale.tint)     ln(`  --${family}-tint: ${scale.tint};`);
    if (scale.mid)      ln(`  --${family}-mid: ${scale.mid};`);
    if (scale.base)     ln(`  --${family}-base: ${scale.base};`);
    if (scale.emphasis) ln(`  --${family}-emphasis: ${scale.emphasis};`);
    // Every family gets a contrast token so shape is uniform across
    // primary/secondary/neutral/text — enables family-prefix rotation
    // in the validator's role-swap (see scripts/validate-themes.js).
    // Text's contrast defaults to var(--color-Black) — the B/W anchor
    // token that auto-flips per theme luminance (dark themes hold the
    // light anchor in --color-Black). Gives text-contrast a guaranteed
    // max-contrast value without hex-locking to either black or white.
    let contrastVal;
    if (family === 'text') {
      contrastVal = scale.contrast || 'var(--color-Black)';
    } else {
      contrastVal = scale.contrast;
    }
    if (contrastVal) ln(`  --${family}-contrast: ${contrastVal};`);
    ln();
  }

  // ── Theme meta ────────────────────────────────────────────────────
  // These tokens drive data-* attributes on <html> (set by ThemeSwitcher)
  // which gate the zone CSS files (theme-luminance-dark.css etc.).
  //
  //   --theme-luminance  → data-theme-luminance  → theme-luminance-dark.css
  //   --theme-chroma     → data-theme-chroma     → theme-chroma-calm.css / theme-chroma-mono.css
  //   --high-contrast    → data-high-contrast    → high-contrast.css
  //   --theme-intensity  → data-theme-intensity  → theme-intensity-soft.css (reserved)
  //   --theme-contrast   → typography gates use this to bump text sizes
  // If text is a var() anchor (e.g. var(--color-Black) for vivid), use
  // neutral-emphasis for the contrast calc — anchors auto-flip so their
  // effective contrast is always near-max but we can't chroma() them.
  const textEmphasisRaw = scales.text?.emphasis || scales.neutral?.emphasis;
  const textEmphasis = (typeof textEmphasisRaw === 'string' && textEmphasisRaw.startsWith('#'))
    ? textEmphasisRaw
    : scales.neutral?.emphasis;
  const pageBgHex    = pageBg['page-bg'];
  const ratio = textEmphasis && pageBgHex ? contrastRatio(textEmphasis, pageBgHex) : 21;
  const contrastTier = ratio >= 7   ? 'strong'
                     : ratio >= 4.5 ? 'standard'
                     : ratio >= 3   ? 'soft'
                     : 'minimal';

  ln(`  /* -- THEME META ---------------------------------- */`);
  ln(`  --theme-luminance: ${luminance};`);
  if (meta.chromaZone)    ln(`  --theme-chroma: ${meta.chromaZone};`);
  if (meta.intensityZone) ln(`  --theme-intensity: ${meta.intensityZone};`);
  if (hc)                 ln(`  --high-contrast: true;`);
  ln(`  --theme-contrast: ${contrastTier};`);
  ln();

  // ── Page backgrounds ──────────────────────────────────────────────
  ln(`  /* -- PAGE BACKGROUNDS ---------------------------- */`);
  for (const [k, v] of Object.entries(pageBg)) ln(`  --${k}: ${v};`);
  ln();

  // ── Black/White + shadow anchors ──────────────────────────────────
  ln(`  /* -- BLACK/WHITE + SHADOW ------------------------ */`);
  for (const [k, v] of Object.entries(status)) ln(`  --${k}: ${v};`);
  ln();

  // ── Theme-specific media + ghost ──────────────────────────────────
  ln(`  /* -- THEME-SPECIFIC ------------------------------ */`);
  ln(`  --media-brightness: ${isDark ? '0.86' : '1'};`);
  ln(`  --media-saturation: ${isDark ? '0.90' : '1'};`);
  ln(`  --media-contrast: ${isDark ? '0.98' : '1'};`);
  if (hc)          ln(`  --svg-ghost-color: var(--neutral-mid);`);
  else if (isDark) ln(`  --svg-ghost-color: var(--shadow-Black);`);
  else             ln(`  --svg-ghost-color: var(--neutral-mid);`);
  ln();

  // ── Focus + highlight ─────────────────────────────────────────────
  ln(`  /* -- FOCUS + HIGHLIGHT TOKENS -------------------- */`);
  ln(`  --focus-color: ${focusHighlight['focus-color']};`);
  ln(`  --focus-bg: ${focusHighlight['focus-bg']};`);
  ln(`  --highlight-link-color: ${focusHighlight['highlight-link-color']};`);

  // HC-specific icon filter
  if (hc) {
    ln();
    ln(`  --a11y-hc-icon-filter: brightness(0) invert(${isDark ? '1' : '0'});`);
  }

  ln(`}`);
  ln();

  return L.join('\n');
}
