/**
 * Color Preview Generator
 * Creates an HTML preview of generated colors for easy visualization
 */

import fs from 'fs';
import path from 'path';
import chroma from 'chroma-js';

/**
 * Generate HTML preview of a theme file
 */
function generatePreview(themePath) {
  const cssContent = fs.readFileSync(themePath, 'utf8');

  // Extract all color variables
  const colorRegex = /--color-([\w-]+):\s*(#[a-fA-F0-9]{6}|oklch\([^)]+\));/g;
  const colors = {};
  let match;

  while ((match = colorRegex.exec(cssContent)) !== null) {
    const varName = match[1];
    const colorValue = match[2];

    // Convert to hex if needed
    let hexColor = colorValue;
    if (colorValue.startsWith('oklch')) {
      try {
        hexColor = chroma(colorValue).hex();
      } catch (e) {
        hexColor = '#000000';
      }
    }

    // Group by color family
    const family = varName.split('-')[0];
    if (!colors[family]) {
      colors[family] = [];
    }
    colors[family].push({ name: varName, hex: hexColor });
  }

  // Generate HTML
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Theme Color Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      background: #f5f5f5;
    }
    h1 {
      margin-bottom: 2rem;
      font-size: 2rem;
      color: #333;
    }
    .color-family {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .family-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #555;
    }
    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
    }
    .color-swatch {
      text-align: center;
    }
    .color-box {
      width: 100%;
      height: 80px;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      border: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    .color-name {
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.25rem;
    }
    .color-hex {
      font-size: 0.7rem;
      color: #999;
      font-family: monospace;
    }
    .theory-section {
      background: #e3f2fd;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }
    .theory-title {
      font-weight: 600;
      color: #1976d2;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <h1>🎨 Theme Color Preview</h1>
  <div class="theory-section">
    <div class="theory-title">View your generated colors below</div>
    <p style="font-size: 0.9rem; color: #555;">
      Compare colors across families to see if they have similar tones/shades but different hues.
      Look for consistent saturation and lightness across the spectrum.
    </p>
  </div>
`;

  // Add each color family
  for (const [family, colorList] of Object.entries(colors)) {
    html += `
  <div class="color-family">
    <div class="family-name">${family}</div>
    <div class="color-grid">
`;

    for (const { name, hex } of colorList) {
      // Calculate if text should be dark or light
      const luminance = chroma(hex).luminance();
      const textColor = luminance > 0.5 ? '#000' : '#fff';

      // Extract token number
      const tokenMatch = name.match(/(\d+)$/);
      const token = tokenMatch ? tokenMatch[1] : '';

      html += `
      <div class="color-swatch">
        <div class="color-box" style="background: ${hex}; color: ${textColor};">
          ${token}
        </div>
        <div class="color-name">${name}</div>
        <div class="color-hex">${hex}</div>
      </div>
`;
    }

    html += `
    </div>
  </div>
`;
  }

  html += `
</body>
</html>
`;

  return html;
}

// Get theme file path from command line
const themePath = process.argv[2];

if (!themePath) {
  console.log(`
🎨 Color Preview Generator

Usage:
  node src/Scripts/ThemeTokenGen/preview-colors.js <path-to-theme.css>

Example:
  node src/Scripts/ThemeTokenGen/preview-colors.js src/Styles/themes/theory-preview.css
  `);
  process.exit(0);
}

if (!fs.existsSync(themePath)) {
  console.error(`❌ Theme file not found: ${themePath}`);
  process.exit(1);
}

// Generate preview
console.log('🎨 Generating color preview...');
const html = generatePreview(themePath);

// Save to file
const outputPath = themePath.replace('.css', '-preview.html');
fs.writeFileSync(outputPath, html);

console.log(`✅ Preview generated: ${outputPath}`);
console.log(`💡 Open this file in your browser to see the colors!`);
