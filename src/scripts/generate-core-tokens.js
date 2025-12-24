/**
 * Build Script: Generate Core Tokens CSS
 *
 * Extracts all -c- prefixed tokens from theme CSS files
 * and generates a coretokens.css file with preview tokens
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themesDir = path.join(__dirname, '../src/Styles/themes');
const outputDir = path.join(__dirname, '../src/Styles/themes/Preview');
const outputPath = path.join(outputDir, 'coretokens.css');

/**
 * Extract core tokens from CSS text
 */
function extractCoreTokens(cssText) {
  const tokens = { bg: null, text: null, primary: null, accent: null };
  const lines = cssText.split('\n');

  for (const line of lines) {
    const bgMatch = line.match(/--[\w-]+-c-bg\s*:\s*([^;]+);/i);
    const textMatch = line.match(/--[\w-]+-c-text\s*:\s*([^;]+);/i);
    const primaryMatch = line.match(/--[\w-]+-c-primary\s*:\s*([^;]+);/i);
    const accentMatch = line.match(/--[\w-]+-c-accent\s*:\s*([^;]+);/i);

    if (bgMatch && !bgMatch[1].includes('var(')) tokens.bg = bgMatch[1].trim();
    if (textMatch && !textMatch[1].includes('var(')) tokens.text = textMatch[1].trim();
    if (primaryMatch && !primaryMatch[1].includes('var(')) tokens.primary = primaryMatch[1].trim();
    if (accentMatch && !accentMatch[1].includes('var(')) tokens.accent = accentMatch[1].trim();
  }

  return tokens;
}

/**
 * Recursively find all CSS files in themes directory
 * Excludes the Preview folder to avoid processing coretokens.css
 */
function findThemeFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip the Preview folder to avoid circular processing
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

  // Special handling for BrandDefault -> 'default'
  if (fileName === 'BrandDefault') {
    return 'default';
  }

  // Remove 'a11y-' prefix from a11y themes
  return fileName.replace(/^a11y-/, '');
}

/**
 * Generate core tokens CSS file
 */
function generateCoreTokensCSS() {
  console.log('🎨 Generating core tokens CSS...');

  const themeFiles = findThemeFiles(themesDir);
  const allTokens = [];

  // Extract tokens from each theme
  for (const filePath of themeFiles) {
    const themeName = getThemeName(filePath);
    const cssText = fs.readFileSync(filePath, 'utf-8');
    const tokens = extractCoreTokens(cssText);

    if (tokens.bg || tokens.text || tokens.primary || tokens.accent) {
      allTokens.push({ theme: themeName, tokens });
      console.log(`  ✓ Extracted tokens for: ${themeName}`);
    }
  }

  // Generate CSS content - use original token names with prefix
  let cssContent = `/**
 * Core Theme Tokens - Auto-generated
 * DO NOT EDIT MANUALLY
 *
 * Generated from theme CSS files at build time
 * Run: node scripts/generate-core-tokens.js
 */

:root {
  /* Core theme tokens - extracted from all theme files */
`;

  for (const { theme, tokens } of allTokens) {
    // Use original naming convention from theme files
    const prefix = theme === 'default' ? 'brand' : `a11y-${theme}`;

    cssContent += `\n  /* ${theme} theme */\n`;
    if (tokens.bg) cssContent += `  --${prefix}-c-bg: ${tokens.bg};\n`;
    if (tokens.text) cssContent += `  --${prefix}-c-text: ${tokens.text};\n`;
    if (tokens.primary) cssContent += `  --${prefix}-c-primary: ${tokens.primary};\n`;
    if (tokens.accent) cssContent += `  --${prefix}-c-accent: ${tokens.accent};\n`;
  }

  cssContent += `}\n`;

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to themes/core folder
  fs.writeFileSync(outputPath, cssContent);
  console.log(`\n✅ Generated ${outputPath}`);
  console.log(`📦 ${allTokens.length} themes processed\n`);
}

// Run the generator
generateCoreTokensCSS();
