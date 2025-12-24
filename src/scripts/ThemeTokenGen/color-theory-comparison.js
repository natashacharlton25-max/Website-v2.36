const chroma = require('chroma-js');
const fs = require('fs');
const path = require('path');

/**
 * COLOR THEORY COMPARISON GENERATOR
 *
 * Generates a comprehensive visual HTML page showing ALL color theory options
 * from a single primary color for easy comparison.
 *
 * USAGE:
 * node src/Scripts/ThemeTokenGen/color-theory-comparison.js #8FA68A
 *
 * This will generate: src/Styles/themes/color-theory-comparison.html
 */

// Generate color variants using different color theories
function generateColorTheoryVariant(baseColor, theory, index = 0) {
  const base = chroma(baseColor);
  const [h, s, l] = base.hsl();

  const theories = {
    complementary: () => chroma.hsl((h + 180) % 360, s, l),
    analogous: () => {
      const offset = index === 0 ? -30 : 30;
      return chroma.hsl((h + offset + 360) % 360, s, l);
    },
    triadic: () => {
      const offset = index === 0 ? 120 : 240;
      return chroma.hsl((h + offset) % 360, s, l);
    },
    'split-complementary': () => {
      const offset = index === 0 ? 150 : 210;
      return chroma.hsl((h + offset) % 360, s, l);
    },
    tetradic: () => {
      const offset = index === 0 ? 90 : index === 1 ? 180 : 270;
      return chroma.hsl((h + offset) % 360, s, l);
    }
  };

  return theories[theory] ? theories[theory]().hex() : baseColor;
}

// Generate full 50-950 scale from a base color
function generateScaleFromBase(baseColorHex, basePosition = 500) {
  const color = chroma(baseColorHex);
  const [l, c, h] = color.oklch();

  const positions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const lightnessMap = {
    50: 0.98, 100: 0.95, 200: 0.88, 300: 0.78, 400: 0.68,
    500: 0.58, 600: 0.48, 700: 0.38, 800: 0.28, 900: 0.20, 950: 0.13
  };

  const baseLightness = lightnessMap[basePosition];
  const scale = {};

  positions.forEach(pos => {
    const targetLightness = lightnessMap[pos];
    let adjustedChroma = c;

    if (targetLightness > 0.85) {
      adjustedChroma = c * 0.3;
    } else if (targetLightness < 0.25) {
      adjustedChroma = c * 0.7;
    }

    try {
      const newColor = chroma.oklch(targetLightness, adjustedChroma, h);
      scale[pos] = newColor.hex();
    } catch (e) {
      scale[pos] = baseColorHex;
    }
  });

  return scale;
}

// Generate HTML for a color theory section
function generateTheorySection(theoryName, theoryDescription, primaryColor, variants) {
  let html = `
    <div class="theory-section">
      <h2>${theoryName}</h2>
      <p class="description">${theoryDescription}</p>
      <div class="color-groups">
  `;

  // Show primary color first
  const primaryScale = generateScaleFromBase(primaryColor, 500);
  html += generateColorGroup('Primary', primaryColor, primaryScale);

  // Show variants
  variants.forEach((variant, idx) => {
    const scale = generateScaleFromBase(variant.color, 500);
    html += generateColorGroup(variant.name, variant.color, scale);
  });

  html += `
      </div>
    </div>
  `;

  return html;
}

// Generate HTML for a single color group (color + its scale)
function generateColorGroup(name, baseColor, scale) {
  const positions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  return `
    <div class="color-group">
      <h3>${name}</h3>
      <div class="base-swatch" style="background-color: ${baseColor};">
        <span class="color-label">${baseColor}</span>
      </div>
      <div class="color-scale">
        ${positions.map(pos => `
          <div class="scale-item">
            <div class="swatch" style="background-color: ${scale[pos]};" title="${scale[pos]}">
              <span class="token-label">${pos}</span>
            </div>
            <span class="hex-value">${scale[pos]}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Generate complete HTML comparison page
function generateComparisonPage(primaryColor) {
  const allTheories = [
    {
      name: 'Complementary',
      description: 'Opposite color on the wheel - creates high contrast and vibrant combinations',
      variants: [
        { name: 'Complement', color: generateColorTheoryVariant(primaryColor, 'complementary') }
      ]
    },
    {
      name: 'Analogous',
      description: 'Adjacent colors on the wheel - harmonious, gentle transitions, monochromatic feel',
      variants: [
        { name: 'Analogous Left', color: generateColorTheoryVariant(primaryColor, 'analogous', 0) },
        { name: 'Analogous Right', color: generateColorTheoryVariant(primaryColor, 'analogous', 1) }
      ]
    },
    {
      name: 'Triadic',
      description: 'Three colors evenly spaced (120°) - balanced, similar tone, vibrant variety across spectrum',
      variants: [
        { name: 'Triadic 1', color: generateColorTheoryVariant(primaryColor, 'triadic', 0) },
        { name: 'Triadic 2', color: generateColorTheoryVariant(primaryColor, 'triadic', 1) }
      ]
    },
    {
      name: 'Split-Complementary',
      description: 'Base color + two colors adjacent to its complement - softer contrast than complementary',
      variants: [
        { name: 'Split-Comp 1', color: generateColorTheoryVariant(primaryColor, 'split-complementary', 0) },
        { name: 'Split-Comp 2', color: generateColorTheoryVariant(primaryColor, 'split-complementary', 1) }
      ]
    },
    {
      name: 'Tetradic',
      description: 'Four colors evenly balanced (rectangle on wheel) - maximum variety, similar saturation',
      variants: [
        { name: 'Tetradic 1', color: generateColorTheoryVariant(primaryColor, 'tetradic', 0) },
        { name: 'Tetradic 2', color: generateColorTheoryVariant(primaryColor, 'tetradic', 1) },
        { name: 'Tetradic 3', color: generateColorTheoryVariant(primaryColor, 'tetradic', 2) }
      ]
    }
  ];

  const primaryScale = generateScaleFromBase(primaryColor, 500);

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Color Theory Comparison - ${primaryColor}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: #f5f5f5;
      padding: 2rem;
      line-height: 1.6;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #222;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .primary-preview {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      border: 3px solid #ddd;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .intro {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border-left: 4px solid ${primaryColor};
    }

    .intro p {
      color: #555;
      margin-bottom: 0.5rem;
    }

    .theory-section {
      margin-bottom: 3rem;
      padding: 2rem;
      background: #fafafa;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }

    .theory-section h2 {
      font-size: 1.8rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .description {
      color: #666;
      font-size: 1rem;
      margin-bottom: 1.5rem;
      font-style: italic;
    }

    .color-groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .color-group {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .color-group h3 {
      font-size: 1.1rem;
      color: #444;
      margin-bottom: 0.8rem;
      text-align: center;
    }

    .base-swatch {
      width: 100%;
      height: 80px;
      border-radius: 6px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    }

    .color-label {
      background: rgba(255,255,255,0.9);
      padding: 0.3rem 0.8rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
      color: #333;
    }

    .color-scale {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
      gap: 0.5rem;
    }

    .scale-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
    }

    .swatch {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0.2rem;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s;
    }

    .swatch:hover {
      transform: scale(1.1);
      z-index: 10;
    }

    .token-label {
      font-size: 0.65rem;
      font-weight: 600;
      background: rgba(255,255,255,0.85);
      padding: 0.1rem 0.3rem;
      border-radius: 2px;
      color: #333;
    }

    .hex-value {
      font-size: 0.7rem;
      color: #666;
      font-family: 'Courier New', monospace;
      text-align: center;
      word-break: break-all;
    }

    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }

      .container {
        padding: 1rem;
      }

      h1 {
        font-size: 1.8rem;
      }

      .color-groups {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>
      <div class="primary-preview" style="background-color: ${primaryColor};"></div>
      Color Theory Comparison
    </h1>

    <div class="intro">
      <p><strong>Primary Color:</strong> ${primaryColor}</p>
      <p>Below are all color theory options generated from your primary color. Each section shows different color relationships.</p>
      <p><strong>Tip:</strong> Look for which combination feels right for your brand - similar tones across spectrum? High contrast? Harmonious blend?</p>
    </div>

    ${allTheories.map(theory => generateTheorySection(theory.name, theory.description, primaryColor, theory.variants)).join('\n')}

    <div class="intro" style="margin-top: 2rem;">
      <p><strong>Next Steps:</strong></p>
      <p>1. Choose the color theory that best matches your design vision</p>
      <p>2. Update your color-input.css with the theory you like</p>
      <p>3. Generate your final theme using: <code>node src/Scripts/ThemeTokenGen/simple-theme-gen.js my-theme --template src/Scripts/ThemeTokenGen/color-input.css</code></p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node color-theory-comparison.js <color>');
    console.log('Example: node color-theory-comparison.js #8FA68A');
    process.exit(1);
  }

  let primaryColor = args[0];

  // Add # if missing
  if (!primaryColor.startsWith('#')) {
    primaryColor = '#' + primaryColor;
  }

  console.log(`Generating color theory comparison for: ${primaryColor}`);

  const html = generateComparisonPage(primaryColor);
  const outputPath = path.join(__dirname, '../../Styles/themes/color-theory-comparison.html');

  fs.writeFileSync(outputPath, html, 'utf8');

  console.log(`\n✓ Comparison page generated: ${outputPath}`);
  console.log(`\nTo view: start src/Styles/themes/color-theory-comparison.html`);
}

main();
