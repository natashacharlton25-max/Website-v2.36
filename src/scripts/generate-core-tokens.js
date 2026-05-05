/**
 * Build Script: Generate Core Tokens CSS + Theme Cards CSS
 *
 * Reads all theme CSS files, extracts brand-c-* tokens (resolving var() refs),
 * and generates:
 *   - coretokens.css — static hex values for each theme's bg/text/primary/secondary
 *   - theme-cards.css — per-theme card styles for the theme picker UI
 *
 * Run: node src/scripts/generate-core-tokens.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themesDir = path.join(__dirname, '../styles/themes');
const outputDir = path.join(__dirname, '../styles/themes/Preview');
const themeCardsPath = path.join(outputDir, 'theme-cards.css');

/**
 * Build a map of all --token: value declarations from CSS text
 */
function buildTokenMap(cssText) {
  const map = {};
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(cssText)) !== null) {
    map[m[1]] = m[2].trim();
  }
  return map;
}

/**
 * Return a literal value — tokens are hex literals in the current engine,
 * no var() indirection to follow.
 */
function resolveValue(value) {
  if (!value) return null;
  // Defensive: if a stray var() sneaks in, return null (never follow)
  if (value.startsWith('var(')) return null;
  return value;
}

/**
 * Extract the 4 core preview tokens from a CSS file
 * Two-pass: first build full token map, then resolve -c- tokens
 */
function extractCoreTokens(cssText) {
  const tokenMap = buildTokenMap(cssText);
  const tokens = { bg: null, text: null, primary: null, secondary: null };

  // Read from semantic tokens (current engine convention).
  // Fallback to positional tokens for any legacy theme files still using that shape.
  tokens.bg        = resolveValue(tokenMap['page-bg']);
  tokens.text      = resolveValue(tokenMap['text-emphasis'])
                  || resolveValue(tokenMap['neutral-emphasis'])
                  || resolveValue(tokenMap['neutral-800']);
  tokens.primary   = resolveValue(tokenMap['primary-base'])
                  || resolveValue(tokenMap['primary-600']);
  tokens.secondary = resolveValue(tokenMap['secondary-base'])
                  || resolveValue(tokenMap['secondary-600']);

  return tokens;
}

/**
 * Extract the FULL token set for dev theme cards — every scale step, bg
 * surface, status colour. Resolves var(--color-Black) indirections to the
 * theme's own declared anchor (handles dark-theme auto-flip where
 * --color-Black actually holds white).
 */
function extractFullTokens(cssText) {
  const tokenMap = buildTokenMap(cssText);
  const resolved = {};

  // Local resolver that follows var(--x) references within this theme's map,
  // so text-contrast: var(--color-Black) gets the correct luminance-flipped value.
  function resolve(value) {
    if (!value) return null;
    const varMatch = value.match(/var\(--([^,)]+)(?:,\s*[^)]+)?\)/);
    if (varMatch) {
      const refName = varMatch[1].trim();
      if (tokenMap[refName]) return resolve(tokenMap[refName]);
      if (refName === 'color-Black') return '#000000';
      if (refName === 'color-White') return '#ffffff';
      return null;
    }
    return value;
  }

  for (const [name, rawVal] of Object.entries(tokenMap)) {
    const r = resolve(rawVal);
    if (r) resolved[name] = r;
  }
  return resolved;
}

/**
 * Find all theme CSS files in themes/ — one level only.
 * Every CSS file directly in themes/ is a theme. The Preview/ subfolder
 * is auto-excluded because we only look at files, not subfolders.
 */
function findThemeFiles(dir) {
  const files = [];
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isFile() && item.endsWith('.css')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract theme name from file path
 */
function getThemeName(filePath) {
  const fileName = path.basename(filePath, '.css');
  if (fileName === 'BrandDefault') return 'default';
  return fileName;
}

/**
 * Generate theme-cards.css — per-theme card styles using the static hex values
 */
function generateThemeCardsCSS(allTokens) {
  let css = `/**
 * Theme Card Styles - Auto-generated
 * DO NOT EDIT MANUALLY
 *
 * Per-theme card styles for the theme picker UI.
 * Run: node src/scripts/generate-core-tokens.js
 */

/* ===================================
 * THEME CARDS - Base Styles
 * =================================== */
.a11y-theme-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 2px solid color-mix(in oklch, var(--color-Black, #121212) 10%, transparent);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
  min-height: 72px;
}

.a11y-theme-card:hover {
  box-shadow: 0 2px 8px color-mix(in oklch, var(--color-Black) 12%, transparent);
}

.a11y-theme-card:focus-visible {
  outline-offset: 2px;
}

/* Hover / focus / pressed border colour is emitted per theme so each card
   uses its OWN primary colour, not the currently-active theme's primary.
   See the per-theme block below. */

.a11y-theme-card__logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.a11y-theme-card__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.a11y-theme-card__title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.a11y-theme-card__sample {
  display: none;
}

/* Color Swatches */
.a11y-theme-card__swatches {
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-shrink: 0;
}

.a11y-swatch {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid color-mix(in oklch, var(--color-Black, #121212) 12%, transparent);
  box-shadow: inset 0 1px 2px color-mix(in oklch, var(--color-White) 30%, transparent);
}

/* Category headings */
.a11y-theme-list__heading {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 8px 0 4px;
  color: var(--text-emphasis, #333);
}

/* ===================================
 * Per-Theme Card Colors (auto-generated)
 * =================================== */
`;

  for (const { theme, tokens } of allTokens) {
    const bg = tokens.bg || '#f5f4f0';
    const text = tokens.text || '#333';
    const primary = tokens.primary || '#666';
    const secondary = tokens.secondary || '#999';

    css += `
.a11y-theme-card--${theme} {
  background: ${bg};
  color: ${text};
}
.a11y-theme-card--${theme} .a11y-theme-card__logo { fill: ${primary}; }
.a11y-theme-card--${theme} .a11y-swatch--primary { background: ${primary}; }
.a11y-theme-card--${theme} .a11y-swatch--secondary { background: ${secondary}; }
.a11y-theme-card--${theme}:hover { border-color: ${primary}; }
.a11y-theme-card--${theme}:focus-visible { outline: 2px solid ${primary}; }
.a11y-theme-card--${theme}[aria-pressed="true"] { border-color: ${primary}; }
`;
  }

  css += `
/* ===================================
 * Responsive Styles
 * =================================== */
@media (max-width: 768px) {
  .a11y-theme-card {
    padding: 14px 16px;
    gap: 12px;
    min-height: 60px;
  }

  .a11y-theme-card__logo {
    width: 32px;
    height: 32px;
  }

  .a11y-theme-card__title {
    font-size: 14px;
  }

  .a11y-theme-card__swatches {
    gap: 6px;
  }

  .a11y-swatch {
    width: 22px;
    height: 22px;
  }
}
`;

  return css;
}

/**
 * Generate theme-cards-dev.css — per-theme DEV card styles.
 *
 * Mirrors the `.a11y-theme-card--{theme}` pattern used by the accessibility
 * page, but emits richer selectors for the dev theme browser: full swatch
 * rows per family, status tiles, surface tiles. Every value is hex-baked so
 * each card paints itself correctly regardless of the page's current theme.
 */
function generateDevCardsCSS(allFullTokens) {
  const SCALE_FAMILIES = ['primary', 'secondary', 'neutral', 'text'];
  const SCALE_STEPS = ['tint', 'mid', 'base', 'emphasis', 'contrast'];
  const BG_TOKENS = ['page-bg', 'page-bg-raised', 'page-bg-sunken', 'page-bg-overlay'];
  const STATUS_TOKENS = ['color-Success', 'color-Warning', 'color-Error', 'color-Info'];

  let css = `/**
 * Dev Theme Card Styles — Auto-generated
 * DO NOT EDIT MANUALLY
 *
 * Per-theme swatches for /dev/themes browser. Each selector is scoped to
 * the card's .dt-card--{theme} class so cards paint themselves without
 * touching the rest of the page.
 *
 * Run: node src/scripts/generate-core-tokens.js
 */

`;

  for (const { theme, tokens } of allFullTokens) {
    const bg        = tokens['page-bg']        || '#ffffff';
    const textEmph  = tokens['text-emphasis']  || '#222';
    const textMid   = tokens['text-mid']       || '#666';
    const bgRaised  = tokens['page-bg-raised'] || bg;
    const primary   = tokens['primary-base']   || '#666';

    const focusColor = tokens['focus-color'] || primary;
    const focusBg    = tokens['focus-bg']    || bgRaised;
    const primaryEmph = tokens['primary-emphasis'] || primary;

    // Card frame
    css += `.dt-card--${theme} {
  background: ${bg};
  color: ${textEmph};
  border-color: ${bgRaised};
  --dt-card-muted: ${textMid};
  --dt-card-accent: ${primary};
  --dt-card-title: ${primaryEmph};
  --dt-card-focus: ${focusColor};
  --dt-card-focus-bg: ${focusBg};
}
`;
    const highlightColor = tokens['highlight-link-color'] || focusColor;
    const success = tokens['color-Success'] || '#1f9d1f';
    const error   = tokens['color-Error']   || '#d23030';

    // Button colours per theme:
    //   Expand → focus-color (this theme's focus identity)
    //   Apply  → highlight-link-color (this theme's link/action identity)
    // Two distinct semantic tokens so the buttons visually distinguish
    // without reaching for hardcoded blues/oranges.
    css += `.dt-card--${theme} .dt-expand {
  color: ${focusColor};
  border-color: ${focusColor};
}
.dt-card--${theme} .dt-expand:hover {
  background: ${focusBg};
}
.dt-card--${theme} .dt-apply {
  color: ${highlightColor};
  border-color: ${highlightColor};
}
.dt-card--${theme} .dt-apply:hover,
.dt-card--${theme} .dt-apply.dt-apply-active {
  background: ${focusBg};
  color: ${highlightColor};
}
/* Shields use the theme's own semantic status tokens — success/error —
   so each card tells you "safe/unsafe" in its own visual language. */
.dt-card--${theme} .dt-shield--safe svg  { fill: ${success}; }
.dt-card--${theme} .dt-shield--low svg,
.dt-card--${theme} .dt-shield--medium svg,
.dt-card--${theme} .dt-shield--high svg  { fill: ${error}; }
`;
    // Mini swatches (collapsed card preview) — primary/secondary/neutral/text bases.
    // Card bg already shows page-bg so we swap it for text-emphasis here.
    const miniTokens = ['primary-base', 'secondary-base', 'neutral-base', 'text-emphasis'];
    miniTokens.forEach((tok, i) => {
      const hex = tokens[tok] || '#ccc';
      css += `.dt-card--${theme} .dt-swatch-mini:nth-child(${i + 1}) { background: ${hex}; }\n`;
    });

    // Expand-panel inherits the card's bg + text, just carried through
    css += `.dt-card--${theme} .dt-expand-panel {
  background: ${bg};
  color: ${textEmph};
}
`;

    // Scale rows — 5 swatches per family × 4 families = 20 swatches
    for (const family of SCALE_FAMILIES) {
      for (const step of SCALE_STEPS) {
        const hex = tokens[`${family}-${step}`];
        if (!hex) continue;
        css += `.dt-card--${theme} .dt-swatch--${family}-${step} { background: ${hex}; }\n`;
      }
    }

    // Bg surface swatches (4)
    for (const t of BG_TOKENS) {
      const hex = tokens[t];
      if (!hex) continue;
      css += `.dt-card--${theme} .dt-swatch--${t} { background: ${hex}; }\n`;
    }

    // Status swatches (4)
    for (const t of STATUS_TOKENS) {
      const hex = tokens[t];
      if (!hex) continue;
      const short = t.replace('color-', '').toLowerCase();
      css += `.dt-card--${theme} .dt-swatch--status-${short} { background: ${hex}; }\n`;
    }

    // Focus + highlight + text mini-cards inside surface tiles
    const focusHex       = tokens['focus-color'];
    const highlightHex   = tokens['highlight-link-color'];
    const textBaseHex    = tokens['text-base'];
    const textEmphHex    = tokens['text-emphasis'];
    if (focusHex)     css += `.dt-card--${theme} .dt-mini-card--focus { background: ${focusHex}; }\n`;
    if (highlightHex) css += `.dt-card--${theme} .dt-mini-card--highlight { background: ${highlightHex}; }\n`;
    if (textBaseHex)  css += `.dt-card--${theme} .dt-mini-card--text-base { background: ${textBaseHex}; }\n`;
    if (textEmphHex)  css += `.dt-card--${theme} .dt-mini-card--text-emphasis { background: ${textEmphHex}; }\n`;

    css += '\n';
  }

  return css;
}

/**
 * Main entry
 */
function main() {
  console.log('Generating core tokens + theme cards CSS...\n');

  const themeFiles = findThemeFiles(themesDir);
  const allTokens = [];
  const allFullTokens = [];

  for (const filePath of themeFiles) {
    const themeName = getThemeName(filePath);
    const cssText = fs.readFileSync(filePath, 'utf-8');
    const tokens = extractCoreTokens(cssText);
    const fullTokens = extractFullTokens(cssText);

    if (tokens.bg || tokens.text || tokens.primary || tokens.secondary) {
      allTokens.push({ theme: themeName, tokens });
      allFullTokens.push({ theme: themeName, tokens: fullTokens });
      console.log(`  ${themeName}: bg=${tokens.bg || '?'} text=${tokens.text || '?'} pri=${tokens.primary || '?'} sec=${tokens.secondary || '?'}`);
    } else {
      console.log(`  ${themeName}: (no tokens found)`);
    }
  }

  // Sort by theme name for stable output
  allTokens.sort((a, b) => a.theme.localeCompare(b.theme));
  allFullTokens.sort((a, b) => a.theme.localeCompare(b.theme));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write theme-cards.css — per-theme card colour overrides (hex baked in)
  const cardsCSS = generateThemeCardsCSS(allTokens);
  fs.writeFileSync(themeCardsPath, cardsCSS);
  console.log(`\nWrote ${themeCardsPath}`);

  // Write theme-cards-dev.css — richer per-theme swatches for /dev/themes
  const devCardsPath = path.join(outputDir, 'theme-cards-dev.css');
  const devCSS = generateDevCardsCSS(allFullTokens);
  fs.writeFileSync(devCardsPath, devCSS);
  console.log(`Wrote ${devCardsPath}`);

  console.log(`\n${allTokens.length} themes processed\n`);
}

main();
