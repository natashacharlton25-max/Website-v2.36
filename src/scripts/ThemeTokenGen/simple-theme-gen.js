/**
 * Simple Theme Generator - Enhanced version
 * Reads brand colors and generates theme with base position control and color theory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import chroma from 'chroma-js';

// Universal status colors (same across all brands) - generate full palettes
const UNIVERSAL_STATUS_COLORS = {
  Success: '22c55e',    // Green
  Warning: 'f59e0b',    // Amber
  Error: 'ef4444',      // Red (renamed from Danger)
  Info: '3b82f6'        // Blue
};

// Rainbow colors are defined in Allcoloursrainbow.css using theme tokens
// They map to accent colors and change with each theme

// Accent name mapping (numbers to words)
const ACCENT_NAMES = ['', 'One', 'Two', 'Three', 'Four', 'Five'];

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
      // Adjacent colors: ±30 degrees
      newHue = index === 0 ? (hue - 30 + 360) % 360 : (hue + 30) % 360;
      break;

    case 'triadic':
      // Three evenly spaced: 120 degrees apart
      newHue = (hue + (120 * (index + 1))) % 360;
      break;

    case 'split-complementary':
      // Complement ± 30 degrees
      const complement = (hue + 180) % 360;
      newHue = index === 0 ? (complement - 30 + 360) % 360 : (complement + 30) % 360;
      break;

    case 'tetradic':
      // Four colors in rectangle: 0, 60, 180, 240
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

  // Define the full range of positions
  const positions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // Get base color properties in OKLCH for better perceptual uniformity
  const baseL = color.get('oklch.l');
  const baseC = color.get('oklch.c');
  const baseH = color.get('oklch.h') || 0;

  // Calculate lightness range - map positions to lightness values
  // Position 50 = lightest (L~0.95), Position 950 = darkest (L~0.15)
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

  // Calculate what the base lightness should be for its position
  const targetBaseLightness = lightnessMap[basePosition];
  const actualBaseLightness = baseL;

  // Adjust all lightness values based on the offset
  const lightnessOffset = actualBaseLightness - targetBaseLightness;

  positions.forEach(pos => {
    let targetL = lightnessMap[pos] + lightnessOffset;

    // Clamp lightness to valid range
    targetL = Math.max(0.1, Math.min(0.98, targetL));

    // Reduce chroma (saturation) for very light and very dark colors
    let adjustedC = baseC;
    if (pos <= 100) {
      adjustedC = baseC * 0.3; // Very desaturated for light tints
    } else if (pos <= 200) {
      adjustedC = baseC * 0.5;
    } else if (pos >= 900) {
      adjustedC = baseC * 0.7; // Slightly desaturated for dark shades
    }

    // Generate color in OKLCH and convert to hex
    try {
      // Handle NaN hue (achromatic colors)
      const hue = isNaN(baseH) ? 0 : baseH;
      const generatedColor = chroma.oklch(targetL, adjustedC, hue);

      // Verify the color is valid
      if (generatedColor && generatedColor.hex) {
        scale[pos] = generatedColor.hex();
      } else {
        throw new Error('Invalid color generated');
      }
    } catch (e) {
      console.warn(`⚠️  Failed to generate color for position ${pos}: ${e.message}, using fallback`);
      // Fallback: use simple lightness adjustment in HSL
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
 * Extract essential tokens from full palette (50-950)
 * Only keeps the tokens we actually use for each color type
 */
function extractEssentialTokens(fullPalette, colorType) {
  const essential = {};

  // Extract the color data from the palette object
  const palette = fullPalette[colorType] || fullPalette;

  if (colorType === 'Primary') {
    // Extended primary tokens for maximum flexibility
    essential[50] = palette[50];
    essential[100] = palette[100];
    essential[200] = palette[200];
    essential[300] = palette[300];
    essential[400] = palette[400];
    essential[500] = palette[500];
    essential[600] = palette[600];
    essential[700] = palette[700];
    essential[800] = palette[800];
    essential[900] = palette[900];
  } else if (colorType === 'Secondary') {
    // Extended secondary tokens
    essential[100] = palette[100];
    essential[200] = palette[200];
    essential[300] = palette[300];
    essential[400] = palette[400];
    essential[500] = palette[500];
    essential[600] = palette[600];
    essential[700] = palette[700];
    essential[800] = palette[800];
  } else if (colorType.startsWith('Accent')) {
    // Extended accent tokens - full range for design flexibility
    essential[100] = palette[100];
    essential[200] = palette[200];
    essential[300] = palette[300];
    essential[400] = palette[400];
    essential[500] = palette[500];
    essential[600] = palette[600];
    essential[700] = palette[700];
    essential[800] = palette[800];
  } else if (colorType === 'Background') {
    // Light mode backgrounds - need more subtle variations
    essential[50] = palette[50];
    essential[100] = palette[100];
    essential[200] = palette[200];
    essential[300] = palette[300];
    essential[400] = palette[400];
    essential[500] = palette[500];
  } else if (colorType === 'BackgroundDark') {
    // Dark mode backgrounds - extended dark range
    essential[600] = palette[600];
    essential[700] = palette[700];
    essential[800] = palette[800];
    essential[900] = palette[900];
    essential[950] = palette[950];
  } else if (colorType === 'Text') {
    // Extended text tokens for typography hierarchy
    essential[50] = palette[50];   // Added for light text
    essential[300] = palette[300];
    essential[400] = palette[400];
    essential[500] = palette[500];
    essential[600] = palette[600];
    essential[700] = palette[700];
    essential[800] = palette[800];
    essential[900] = palette[900];
    essential[950] = palette[950];
  } else if (colorType === 'Neutral') {
    // Extended neutral tokens for borders, dividers, etc.
    essential[50] = palette[50];   // Added for light borders
    essential[100] = palette[100];
    essential[200] = palette[200];
    essential[300] = palette[300];
    essential[400] = palette[400];
    essential[500] = palette[500];
    essential[600] = palette[600];
    essential[700] = palette[700];
    essential[800] = palette[800];  // Added
    essential[900] = palette[900];  // Added
  } else if (colorType === 'Success' || colorType === 'Warning' || colorType === 'Error' || colorType === 'Info') {
    // Status colors - need 100, 200, 500 for alerts/forms
    essential[100] = palette[100];
    essential[200] = palette[200];
    essential[500] = palette[500];
  }

  return essential;
}

/**
 * Parse CSS file to extract brand color values with metadata
 */
function parseBrandTemplate(templatePath) {
  try {
    const cssContent = fs.readFileSync(templatePath, 'utf8');
    console.log('🔍 Parsing brand template...');
    const colors = {};

    // Enhanced regex to match CSS custom properties with optional comments
    // Matches: --brand-name: #color; /* base: 500, from: primary, theory: complementary, index: 0 */
    const cssVarRegex = /--brand-([\w-]+):\s*(auto|#?[a-fA-F0-9]{3,6})\s*;(?:\s*\/\*([^*]*)\*\/)?/g;
    let match;

    while ((match = cssVarRegex.exec(cssContent)) !== null) {
      const colorName = match[1];
      const colorValue = match[2];
      const comment = match[3] || '';

      // Parse metadata from comment
      const metadata = {
        value: colorValue === 'auto' ? null : colorValue.replace('#', ''),
        base: 500, // default
        from: null,
        fromToken: null, // NEW: specific token like "primary-900"
        theory: null,
        index: 0
      };

      // Extract base position
      const baseMatch = comment.match(/base:\s*(\d+)/);
      if (baseMatch) {
        metadata.base = parseInt(baseMatch[1]);
      }

      // Extract reference color
      const fromMatch = comment.match(/from:\s*([\w-]+)/);
      if (fromMatch) {
        metadata.from = fromMatch[1];
      }

      // Extract specific token reference (NEW)
      const fromTokenMatch = comment.match(/from-token:\s*([\w-]+)/);
      if (fromTokenMatch) {
        metadata.fromToken = fromTokenMatch[1];
      }

      // Extract color theory
      const theoryMatch = comment.match(/theory:\s*([\w-]+)/);
      if (theoryMatch) {
        metadata.theory = theoryMatch[1];
      }

      // Extract index
      const indexMatch = comment.match(/index:\s*(\d+)/);
      if (indexMatch) {
        metadata.index = parseInt(indexMatch[1]);
      }

      colors[colorName] = metadata;
    }

    return colors;
  } catch (error) {
    console.error('❌ Error reading brand template:', error.message);
    return null;
  }
}

/**
 * Generate CSS content for theme file
 */
function generateThemeCSS(palettes) {
  let css = `:root {
  /* Essential OKLCH Color Palette - Generated with chroma-js and color theory */

`;

  // Primary Colors
  if (palettes.Primary) {
    css += `  /* Primary Colors - Used for branding and main actions */\n`;
    for (const [weight, color] of Object.entries(palettes.Primary)) {
      css += `  --color-Primary-${weight}: ${color};\n`;
    }
    css += '\n';
  }

  // Secondary Colors
  if (palettes.Secondary) {
    css += `  /* Secondary Colors - Used for secondary actions */\n`;
    for (const [weight, color] of Object.entries(palettes.Secondary)) {
      css += `  --color-Secondary-${weight}: ${color};\n`;
    }
    css += '\n';
  }

  // Background Colors
  if (palettes.Background) {
    css += `  /* Background Colors - Used for surfaces and backgrounds */\n`;
    for (const [weight, color] of Object.entries(palettes.Background)) {
      css += `  --color-Background-${weight}: ${color};\n`;
    }
    css += '\n';
  }

  // Dark Background Colors
  if (palettes.BackgroundDark) {
    css += `  /* Dark Background Colors - Used for dark mode surfaces */\n`;
    for (const [weight, color] of Object.entries(palettes.BackgroundDark)) {
      css += `  --color-BackgroundDark-${weight}: ${color};\n`;
    }
    css += '\n';
  }

  // Text Colors
  if (palettes.Text) {
    css += `  /* Text Colors - Used for typography */\n`;
    for (const [weight, color] of Object.entries(palettes.Text)) {
      css += `  --color-Text-${weight}: ${color};\n`;
    }
    css += '\n';
  }

  // Neutral Colors
  if (palettes.Neutral) {
    css += `  /* Neutral Colors - Used for borders and dividers */\n`;
    for (const [weight, color] of Object.entries(palettes.Neutral)) {
      css += `  --color-Neutral-${weight}: ${color};\n`;
    }
    css += '\n';
  }

  // Accent Colors
  for (let i = 1; i <= 5; i++) {
    const accentName = `Accent${ACCENT_NAMES[i]}`;
    if (palettes[accentName]) {
      css += `  /* ${accentName} Colors */\n`;
      for (const [weight, color] of Object.entries(palettes[accentName])) {
        css += `  --color-${accentName}-${weight}: ${color};\n`;
      }
      css += '\n';
    }
  }

  // Status Colors - Full palettes
  css += `  /* Status Colors - Universal across all themes */\n`;
  for (const statusName of ['Success', 'Warning', 'Error', 'Info']) {
    if (palettes[statusName]) {
      for (const [weight, color] of Object.entries(palettes[statusName])) {
        css += `  --color-${statusName}-${weight}: ${color};\n`;
      }
    }
  }

  css += '}\n';
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

    // Find the themes object
    const themesRegex = /(this\.themes\s*=\s*\{)([\s\S]*?)(\};)/;
    const match = content.match(themesRegex);

    if (!match) {
      console.warn('⚠️  Could not find themes object in ThemeSwitcher.js');
      return;
    }

    const [fullMatch, opening, themesContent, closing] = match;

    // Check if theme already exists
    if (themesContent.includes(`'${themeName}'`)) {
      console.log(`✅ Theme '${themeName}' already exists in ThemeSwitcher.js`);
      return;
    }

    // Add new theme
    const newThemeEntry = `      '${themeName}': '/src/styles/themes/${themeName}.css'`;

    // Add comma to existing content if needed
    const trimmedContent = themesContent.trim();
    const needsComma = trimmedContent && !trimmedContent.endsWith(',');
    const updatedContent = trimmedContent + (needsComma ? ',' : '') + '\n' + newThemeEntry;

    // Replace in full content
    const updatedThemes = opening + '\n' + updatedContent + '\n    ' + closing;
    const updatedFileContent = content.replace(themesRegex, updatedThemes);

    // Write back to file
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
  console.log('🎨 Simple Theme Generator');
  console.log(`📝 Generating theme: ${themeName}`);

  const templatePath = customTemplatePath || path.join(process.cwd(), 'src', 'scripts', 'ThemeTokenGen', 'brand-template.css');

  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template file not found: ${templatePath}`);
    console.log('💡 Please create the template file first or run from the correct directory.');
    return;
  }

  // Parse brand colors
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

  const palettes = {};
  const resolvedColors = {}; // Store resolved hex values

  /**
   * Resolve a color - either use the value or generate from color theory
   */
  function resolveColor(colorKey, metadata) {
    // If already resolved, return it
    if (resolvedColors[colorKey]) {
      return resolvedColors[colorKey];
    }

    // If has explicit value, use it
    if (metadata.value) {
      resolvedColors[colorKey] = metadata.value;
      return metadata.value;
    }

    // If auto and has "from" reference
    if (metadata.from) {
      // First resolve the source color
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

      // If has color theory, generate variant
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
        // No theory - just use the source color directly
        // (different base position will be applied during palette generation)
        console.log(`🎨 Using ${colorKey} from ${sourceKey} with different base position`);
        resolvedColors[colorKey] = sourceColor;
        return resolvedColors[colorKey];
      }
    }

    console.error(`❌ Color "${colorKey}" has no value and no color theory definition`);
    return null;
  }

  /**
   * Generate palette for a color type
   */
  function generatePalette(colorKey, colorType, metadata) {
    const hexValue = resolveColor(colorKey, metadata);
    if (!hexValue) return null;

    console.log(`🎨 Generating ${colorType} palette from #${hexValue} (base: ${metadata.base})...`);

    // Generate scale from base position
    const fullScale = generateScaleFromBase(`#${hexValue}`, metadata.base);

    // Extract only the tokens we need for this color type
    return extractEssentialTokens({ [colorType]: fullScale }, colorType);
  }

  // Generate palettes for brand colors
  const colorMapping = {
    'primary': 'Primary',
    'secondary': 'Secondary',
    'background': 'Background',
    'background-dark': 'BackgroundDark',
    'backgrounddark': 'BackgroundDark',
    'text': 'Text',
    'neutral': 'Neutral'
  };

  // Process main colors
  for (const [colorKey, colorType] of Object.entries(colorMapping)) {
    if (brandColors[colorKey]) {
      const palette = generatePalette(colorKey, colorType, brandColors[colorKey]);
      if (palette) {
        palettes[colorType] = palette;
      }
    }
  }

  // Process accent colors
  for (let i = 1; i <= 5; i++) {
    const accentKey = `accent${i}`;
    const accentName = `Accent${ACCENT_NAMES[i]}`;
    if (brandColors[accentKey]) {
      const palette = generatePalette(accentKey, accentName, brandColors[accentKey]);
      if (palette) {
        palettes[accentName] = palette;
      }
    }
  }

  // Generate status color palettes using new system
  for (const [statusName, hexValue] of Object.entries(UNIVERSAL_STATUS_COLORS)) {
    console.log(`🎨 Generating ${statusName} palette from #${hexValue} (base: 500)...`);
    const fullScale = generateScaleFromBase(`#${hexValue}`, 500);
    palettes[statusName] = extractEssentialTokens({ [statusName]: fullScale }, statusName);
  }

  // Generate CSS
  console.log('📝 Generating CSS...');
  const cssContent = generateThemeCSS(palettes);

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

  // Show statistics
  let totalTokens = 0;
  for (const [paletteName, tokens] of Object.entries(palettes)) {
    const count = Object.keys(tokens).length;
    totalTokens += count;
    console.log(`   ${paletteName}: ${count} tokens`);
  }
  console.log(`   Status Colors: 4 universal tokens`);
  console.log(`   Total: ${totalTokens + 4} tokens`);
}

// Run if called directly
const scriptPath = fileURLToPath(import.meta.url);
const isRunDirectly = process.argv[1] === scriptPath ||
                      pathToFileURL(process.argv[1]).href === import.meta.url;

if (isRunDirectly) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
🎨 Simple Theme Generator

Usage:
  node scripts/simple-theme-gen.js [theme-name] [--template path/to/template.css]

Options:
  --template  Custom template file path (defaults to brand-template.css)

Steps:
  1. Edit scripts/brand-template.css with your brand colors
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