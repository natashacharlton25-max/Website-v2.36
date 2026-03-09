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
const coreTokensPath = path.join(outputDir, 'coretokens.css');
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
 * Resolve a value that might be a var() reference, following one level deep
 */
function resolveValue(value, tokenMap) {
  if (!value) return null;
  const varMatch = value.match(/^var\(--([\w-]+)\)$/);
  if (varMatch) {
    const resolved = tokenMap[varMatch[1]];
    // Don't follow deeper than one level; must resolve to a non-var value
    if (resolved && !resolved.startsWith('var(')) {
      return resolved;
    }
    return null; // Unresolvable
  }
  return value; // Already a literal (hex, rgb, etc.)
}

/**
 * Extract the 4 core preview tokens from a CSS file
 * Two-pass: first build full token map, then resolve -c- tokens
 */
function extractCoreTokens(cssText) {
  const tokenMap = buildTokenMap(cssText);
  const tokens = { bg: null, text: null, primary: null, secondary: null };

  // Find -c-bg, -c-text, -c-primary, -c-secondary declarations
  for (const [name, value] of Object.entries(tokenMap)) {
    if (name.endsWith('-c-bg') && !tokens.bg) {
      tokens.bg = resolveValue(value, tokenMap);
    } else if (name.endsWith('-c-text') && !tokens.text) {
      tokens.text = resolveValue(value, tokenMap);
    } else if (name.endsWith('-c-primary') && !name.endsWith('-c-primary-light') && !name.endsWith('-c-primary-dark') && !tokens.primary) {
      tokens.primary = resolveValue(value, tokenMap);
    } else if (name.endsWith('-c-secondary') && !name.endsWith('-c-secondary-light') && !name.endsWith('-c-secondary-dark') && !tokens.secondary) {
      tokens.secondary = resolveValue(value, tokenMap);
    }
  }

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
 * Generate coretokens.css — static hex tokens for all themes on :root
 */
function generateCoreTokensCSS(allTokens) {
  let css = `/**
 * Core Theme Tokens - Auto-generated
 * DO NOT EDIT MANUALLY
 *
 * Static hex values for theme card previews.
 * Run: node src/scripts/generate-core-tokens.js
 */

:root {\n`;

  for (const { theme, tokens } of allTokens) {
    const prefix = theme === 'default' ? 'brand' : `a11y-${theme}`;
    css += `\n  /* ${theme} */\n`;
    if (tokens.bg) css += `  --${prefix}-c-bg: ${tokens.bg};\n`;
    if (tokens.text) css += `  --${prefix}-c-text: ${tokens.text};\n`;
    if (tokens.primary) css += `  --${prefix}-c-primary: ${tokens.primary};\n`;
    if (tokens.secondary) css += `  --${prefix}-c-secondary: ${tokens.secondary};\n`;
  }

  css += `}\n`;
  return css;
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
  gap: 10px;
  padding: 7px 12px;
  border: 2px solid color-mix(in oklch, var(--color-Black, #121212) 10%, transparent);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.a11y-theme-card:hover {
  border-color: var(--brand-c-primary);
  box-shadow: 0 2px 8px color-mix(in oklch, var(--color-Black) 12%, transparent);
}

.a11y-theme-card:focus-visible {
  outline: 2px solid var(--brand-c-primary);
  outline-offset: 2px;
}

.a11y-theme-card[aria-pressed="true"] {
  border-color: var(--brand-c-primary);
}

.a11y-theme-card__logo {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.a11y-theme-card__text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

.a11y-theme-card__title {
  font-size: 14px;
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
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.a11y-swatch {
  width: 14px;
  height: 14px;
  border-radius: 4px;
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
  color: var(--brand-c-text, #333);
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
`;
  }

  css += `
/* ===================================
 * Responsive Styles
 * =================================== */
@media (max-width: 768px) {
  .a11y-theme-card {
    padding: 8px 10px;
    gap: 8px;
  }

  .a11y-theme-card__logo {
    width: 22px;
    height: 22px;
  }

  .a11y-theme-card__swatches {
    flex-direction: row;
    gap: 3px;
  }

  .a11y-swatch {
    width: 10px;
    height: 10px;
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

  // Write coretokens.css
  const coreCSS = generateCoreTokensCSS(allTokens);
  fs.writeFileSync(coreTokensPath, coreCSS);
  console.log(`\nWrote ${coreTokensPath}`);

  // Write theme-cards.css
  const cardsCSS = generateThemeCardsCSS(allTokens);
  fs.writeFileSync(themeCardsPath, cardsCSS);
  console.log(`Wrote ${themeCardsPath}`);

  console.log(`\n${allTokens.length} themes processed\n`);
}

main();
