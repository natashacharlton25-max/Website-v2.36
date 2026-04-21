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
 * Recursively find all CSS files in themes directory
 * Excludes the Preview folder to avoid processing our own output
 */
function findThemeFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item !== 'Preview') {
        files.push(...findThemeFiles(fullPath));
      }
    } else if (item.endsWith('.css')) {
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
 * Main entry
 */
function main() {
  console.log('Generating core tokens + theme cards CSS...\n');

  const themeFiles = findThemeFiles(themesDir);
  const allTokens = [];

  for (const filePath of themeFiles) {
    const themeName = getThemeName(filePath);
    const cssText = fs.readFileSync(filePath, 'utf-8');
    const tokens = extractCoreTokens(cssText);

    if (tokens.bg || tokens.text || tokens.primary || tokens.secondary) {
      allTokens.push({ theme: themeName, tokens });
      console.log(`  ${themeName}: bg=${tokens.bg || '?'} text=${tokens.text || '?'} pri=${tokens.primary || '?'} sec=${tokens.secondary || '?'}`);
    } else {
      console.log(`  ${themeName}: (no tokens found)`);
    }
  }

  // Sort by theme name for stable output
  allTokens.sort((a, b) => a.theme.localeCompare(b.theme));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write theme-cards.css — per-theme card colour overrides (hex baked in)
  const cardsCSS = generateThemeCardsCSS(allTokens);
  fs.writeFileSync(themeCardsPath, cardsCSS);
  console.log(`\nWrote ${themeCardsPath}`);

  console.log(`\n${allTokens.length} themes processed\n`);
}

main();
