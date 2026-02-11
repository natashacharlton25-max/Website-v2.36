/**
 * Simple Theme Generator — 21-Token System
 * Reads 5 brand colours and generates 15 --brand-c-* tokens using OKLCH scales
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import chroma from 'chroma-js';

/**
 * Generate color theory variant from a base color
 */
function generateColorTheoryVariant(baseColor, theory, index = 0) {
  const color = chroma(baseColor);
  const hue = color.get('hsl.h');
  const saturation = color.get('hsl.s');
  const lightness = color.get('hsl.l');

  let newHue = hue;

  switch (theory) {
    case 'complementary':
      newHue = (hue + 180) % 360;
      break;

    case 'analogous':
      newHue = index === 0 ? (hue - 30 + 360) % 360 : (hue + 30) % 360;
      break;

    case 'triadic':
      newHue = (hue + (120 * (index + 1))) % 360;
      break;

    case 'split-complementary':
      const complement = (hue + 180) % 360;
      newHue = index === 0 ? (complement - 30 + 360) % 360 : (complement + 30) % 360;
      break;

    case 'tetradic':
      const tetradValues = [60, 180, 240];
      newHue = (hue + tetradValues[index % 3]) % 360;
      break;

    default:
      console.warn(`⚠️  Unknown color theory: ${theory}, using original color`);
      return baseColor;
  }

  return chroma.hsl(newHue, saturation, lightness).hex();
}

/**
 * Generate a full color scale (50-950) from a base color at a specific position
 */
function generateScaleFromBase(baseColorHex, basePosition = 500) {
  const color = chroma(baseColorHex);
  const scale = {};

  const positions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  const baseL = color.get('oklch.l');
  const baseC = color.get('oklch.c');
  const baseH = color.get('oklch.h') || 0;

  const lightnessMap = {
    50: 0.97,
    100: 0.93,
    200: 0.85,
    300: 0.75,
    400: 0.65,
    500: 0.55,
    600: 0.45,
    700: 0.35,
    800: 0.28,
    900: 0.22,
    950: 0.15
  };

  const targetBaseLightness = lightnessMap[basePosition];
  const actualBaseLightness = baseL;
  const lightnessOffset = actualBaseLightness - targetBaseLightness;

  positions.forEach(pos => {
    let targetL = lightnessMap[pos] + lightnessOffset;
    targetL = Math.max(0.1, Math.min(0.98, targetL));

    let adjustedC = baseC;
    if (pos <= 100) {
      adjustedC = baseC * 0.3;
    } else if (pos <= 200) {
      adjustedC = baseC * 0.5;
    } else if (pos >= 900) {
      adjustedC = baseC * 0.7;
    }

    try {
      const hue = isNaN(baseH) ? 0 : baseH;
      const generatedColor = chroma.oklch(targetL, adjustedC, hue);

      if (generatedColor && generatedColor.hex) {
        scale[pos] = generatedColor.hex();
      } else {
        throw new Error('Invalid color generated');
      }
    } catch (e) {
      console.warn(`⚠️  Failed to generate color for position ${pos}: ${e.message}, using fallback`);
      try {
        const hsl = color.hsl();
        const targetLightness = lightnessMap[pos];
        const fallbackColor = chroma.hsl(hsl[0] || 0, hsl[1], targetLightness);
        scale[pos] = fallbackColor.hex();
      } catch (e2) {
        scale[pos] = color.hex();
      }
    }
  });

  return scale;
}

/**
 * Pick 3 tokens (light, default, dark) from a generated scale
 */
function pickThreeTokens(scale, positions = [200, 500, 700]) {
  return {
    light: scale[positions[0]],
    default: scale[positions[1]],
    dark: scale[positions[2]]
  };
}

// Position maps per group type
const POSITION_MAP = {
  primary:   [300, 500, 700],
  secondary: [300, 500, 700],
  neutral:   [300, 500, 700],
  bg:        [50, 100, 800],
  text:      [400, 600, 800]
};

/**
 * Parse CSS file to extract brand color values with metadata
 */
function parseBrandTemplate(templatePath) {
  try {
    const cssContent = fs.readFileSync(templatePath, 'utf8');
    console.log('🔍 Parsing brand template...');
    const colors = {};

    const cssVarRegex = /--brand-([\w-]+):\s*(auto|#?[a-fA-F0-9]{3,6})\s*;(?:\s*\/\*([^*]*)\*\/)?/g;
    let match;

    while ((match = cssVarRegex.exec(cssContent)) !== null) {
      const colorName = match[1];
      const colorValue = match[2];
      const comment = match[3] || '';

      const metadata = {
        value: colorValue === 'auto' ? null : colorValue.replace('#', ''),
        base: 500,
        from: null,
        theory: null,
        index: 0
      };

      const baseMatch = comment.match(/base:\s*(\d+)/);
      if (baseMatch) metadata.base = parseInt(baseMatch[1]);

      const fromMatch = comment.match(/from:\s*([\w-]+)/);
      if (fromMatch) metadata.from = fromMatch[1];

      const theoryMatch = comment.match(/theory:\s*([\w-]+)/);
      if (theoryMatch) metadata.theory = theoryMatch[1];

      const indexMatch = comment.match(/index:\s*(\d+)/);
      if (indexMatch) metadata.index = parseInt(indexMatch[1]);

      colors[colorName] = metadata;
    }

    return colors;
  } catch (error) {
    console.error('❌ Error reading brand template:', error.message);
    return null;
  }
}

/**
 * Generate CSS content — exactly 15 --brand-c-* tokens
 */
function generateThemeCSS(tokens) {
  let css = `:root {\n`;
  css += `  /* Brand Colour Tokens — Generated by simple-theme-gen.js */\n\n`;

  const groups = ['primary', 'secondary', 'neutral', 'bg', 'text'];
  const labels = {
    primary: 'Primary',
    secondary: 'Secondary',
    neutral: 'Neutral',
    bg: 'Background',
    text: 'Text'
  };

  for (const group of groups) {
    css += `  /* ${labels[group]} */\n`;
    css += `  --brand-c-${group}-light: ${tokens[group].light};\n`;
    css += `  --brand-c-${group}: ${tokens[group].default};\n`;
    css += `  --brand-c-${group}-dark: ${tokens[group].dark};\n`;
    css += `\n`;
  }

  css += `}\n`;
  return css;
}

/**
 * Update ThemeSwitcher.js to include the new theme
 */
function updateThemeSwitcher(themeName) {
  try {
    const themeSwitcherPath = path.join(process.cwd(), 'src', 'scripts', 'ThemeSwitcher.js');

    if (!fs.existsSync(themeSwitcherPath)) {
      console.warn('⚠️  ThemeSwitcher.js not found, skipping update');
      return;
    }

    let content = fs.readFileSync(themeSwitcherPath, 'utf8');

    const themesRegex = /(this\.themes\s*=\s*\{)([\s\S]*?)(\};)/;
    const match = content.match(themesRegex);

    if (!match) {
      console.warn('⚠️  Could not find themes object in ThemeSwitcher.js');
      return;
    }

    const [fullMatch, opening, themesContent, closing] = match;

    if (themesContent.includes(`'${themeName}'`)) {
      console.log(`✅ Theme '${themeName}' already exists in ThemeSwitcher.js`);
      return;
    }

    const newThemeEntry = `      '${themeName}': '/src/Styles/themes/${themeName}.css'`;

    const trimmedContent = themesContent.trim();
    const needsComma = trimmedContent && !trimmedContent.endsWith(',');
    const updatedContent = trimmedContent + (needsComma ? ',' : '') + '\n' + newThemeEntry;

    const updatedThemes = opening + '\n' + updatedContent + '\n    ' + closing;
    const updatedFileContent = content.replace(themesRegex, updatedThemes);

    fs.writeFileSync(themeSwitcherPath, updatedFileContent);
    console.log(`✅ Added '${themeName}' to ThemeSwitcher.js`);

  } catch (error) {
    console.error('❌ Error updating ThemeSwitcher.js:', error.message);
    console.log('💡 You may need to manually add the theme to ThemeSwitcher.js');
  }
}

/**
 * Main function to generate theme
 */
async function generateTheme(themeName = 'brand-theme', customTemplatePath = null) {
  console.log('🎨 Simple Theme Generator (21-Token System)');
  console.log(`📝 Generating theme: ${themeName}`);

  const templatePath = customTemplatePath || path.join(process.cwd(), 'src', 'scripts', 'ThemeTokenGen', 'brand-template.css');

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template file not found: ${templatePath}`);
    console.log('💡 Please create the template file first or run from the correct directory.');
    return;
  }

  console.log('📖 Reading brand colors from template...');
  console.log(`🔍 Template path: ${templatePath}`);
  const brandColors = parseBrandTemplate(templatePath);

  if (!brandColors || Object.keys(brandColors).length === 0) {
    console.error('❌ No brand colors found in template file');
    console.log('💡 Please check that your brand-template.css has valid --brand-* variables');
    return;
  }

  // Show found colors
  console.log('✅ Found brand colors:');
  Object.entries(brandColors).forEach(([name, meta]) => {
    const colorInfo = meta.value ? `#${meta.value}` : 'auto';
    const baseInfo = meta.base !== 500 ? ` (base: ${meta.base})` : '';
    const theoryInfo = meta.theory ? ` [${meta.theory} from ${meta.from}]` : '';
    console.log(`   ${name}: ${colorInfo}${baseInfo}${theoryInfo}`);
  });

  const resolvedColors = {};

  /**
   * Resolve a color — either use the value or generate from color theory
   */
  function resolveColor(colorKey, metadata) {
    if (resolvedColors[colorKey]) return resolvedColors[colorKey];

    if (metadata.value) {
      resolvedColors[colorKey] = metadata.value;
      return metadata.value;
    }

    if (metadata.from) {
      const sourceKey = metadata.from;
      if (!brandColors[sourceKey]) {
        console.error(`❌ Source color "${sourceKey}" not found for "${colorKey}"`);
        return null;
      }

      const sourceColor = resolveColor(sourceKey, brandColors[sourceKey]);
      if (!sourceColor) {
        console.error(`❌ Failed to resolve source color "${sourceKey}"`);
        return null;
      }

      if (metadata.theory) {
        const generatedColor = generateColorTheoryVariant(
          `#${sourceColor}`,
          metadata.theory,
          metadata.index
        );
        console.log(`🎨 Generated ${colorKey} using ${metadata.theory} from ${sourceKey}: ${generatedColor}`);
        resolvedColors[colorKey] = generatedColor.replace('#', '');
        return resolvedColors[colorKey];
      } else {
        console.log(`🎨 Using ${colorKey} from ${sourceKey} with different base position`);
        resolvedColors[colorKey] = sourceColor;
        return resolvedColors[colorKey];
      }
    }

    console.error(`❌ Color "${colorKey}" has no value and no color theory definition`);
    return null;
  }

  // Map template keys to output group names
  const groupMapping = {
    'primary': 'primary',
    'secondary': 'secondary',
    'neutral': 'neutral',
    'bg': 'bg',
    'text': 'text'
  };

  const tokens = {};

  for (const [templateKey, groupName] of Object.entries(groupMapping)) {
    if (!brandColors[templateKey]) {
      console.warn(`⚠️  Missing "${templateKey}" in template, skipping`);
      continue;
    }

    const metadata = brandColors[templateKey];
    const hexValue = resolveColor(templateKey, metadata);
    if (!hexValue) continue;

    console.log(`🎨 Generating ${groupName} scale from #${hexValue} (base: ${metadata.base})...`);

    const fullScale = generateScaleFromBase(`#${hexValue}`, metadata.base);
    const positions = POSITION_MAP[groupName];
    tokens[groupName] = pickThreeTokens(fullScale, positions);

    console.log(`   ${groupName}-light: ${tokens[groupName].light}`);
    console.log(`   ${groupName}: ${tokens[groupName].default}`);
    console.log(`   ${groupName}-dark: ${tokens[groupName].dark}`);
  }

  // Generate CSS
  console.log('\n📝 Generating CSS...');
  const cssContent = generateThemeCSS(tokens);

  // Write to file
  const outputPath = path.join(process.cwd(), 'src', 'styles', 'themes', `${themeName}.css`);
  fs.writeFileSync(outputPath, cssContent);

  // Update ThemeSwitcher.js
  console.log('🔄 Updating ThemeSwitcher.js...');
  updateThemeSwitcher(themeName);

  console.log('');
  console.log('🎉 Theme generation complete!');
  console.log(`📁 Theme file: src/styles/themes/${themeName}.css`);
  console.log(`🌐 Theme is now available in the theme switcher`);
  console.log(`   15 brand tokens generated (5 groups × 3 variants)`);

  // Print the generated CSS for review
  console.log('\n📋 Generated CSS:\n');
  console.log(cssContent);
}

// Run if called directly
const scriptPath = fileURLToPath(import.meta.url);
const isRunDirectly = process.argv[1] === scriptPath ||
                      pathToFileURL(process.argv[1]).href === import.meta.url;

if (isRunDirectly) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
🎨 Simple Theme Generator (21-Token System)

Usage:
  node scripts/simple-theme-gen.js [theme-name] [--template path/to/template.css]

Options:
  --template  Custom template file path (defaults to brand-template.css)

Output:
  15 brand tokens: 5 groups (primary, secondary, neutral, bg, text) × 3 variants (light, default, dark)

Steps:
  1. Edit scripts/brand-template.css with your 5 brand colours
  2. Run this script to generate a complete theme
  3. Your theme will be created in src/styles/themes/

Example:
  node scripts/simple-theme-gen.js my-brand-2024
  node scripts/simple-theme-gen.js test-theme --template src/scripts/ThemeTokenGen/test-color-theory.css
    `);
    process.exit(0);
  }

  const themeName = process.argv[2] || 'brand-theme';
  const templateIndex = process.argv.indexOf('--template');
  const customTemplate = templateIndex !== -1 ? process.argv[templateIndex + 1] : null;

  generateTheme(themeName, customTemplate).catch(console.error);
}
