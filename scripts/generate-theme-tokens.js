#!/usr/bin/env node

/**
 * generate-theme-tokens.js — OKLCH Theme Token Generator
 *
 * Thin wrapper around src/utils/theme-engine.js.
 * Reads JSON definitions from src/themes/definitions/,
 * expands each into light/dark + CVD variants (from variants block),
 * writes CSS theme files to src/styles/themes/.
 *
 * No CVD computation — CVD variants use explicit hex values from definitions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateThemeData } from '../src/utils/theme-engine.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chroma = require('chroma-js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// ── Config ──
const definitionsDir = path.join(rootDir, 'src/themes/definitions');
const outputDir = path.join(rootDir, 'src/styles/themes');
// Brand theme (tenant-specific) under brand/mind-the-box/
// Global a11y and fun themes at top level with subfolders per base theme
const brandDir = path.join(outputDir, 'brand', 'mind-the-box');
const a11yDir = path.join(outputDir, 'a11y');
const funDir = path.join(outputDir, 'fun');

// Ensure output dirs exist
[brandDir, a11yDir, funDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Read all definitions ──
function readDefinitions(folder) {
  const dir = path.join(definitionsDir, folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

const accessibilityDefs = readDefinitions('accessibility');
const funDefs = readDefinitions('fun');

// ── Variant naming suffixes ──
const CVD_SUFFIX = {
  protan: { fun: ' — No Red Zone',  pro: ' — Warm Safe' },
  tritan: { fun: ' — Beyond Blue',  pro: ' — Sunset Safe' },
};

const DARK_SUFFIX = { fun: ' After Dark', pro: ' Dark' };
const LIGHT_SUFFIX = { fun: ' Daylight', pro: ' Light' };

function suffixTitle(base, suffix) {
  if (!base || typeof base === 'string') return base;
  return {
    fun: (base.fun || '') + (suffix.fun || ''),
    pro: (base.pro || '') + (suffix.pro || ''),
  };
}

// ── Matrix expansion ──
// Each definition generates:
//   base + opposite luminance
//   + CVD variants from "variants" block (protan covers both protan+deutan)
//   + dark versions of each CVD variant
// Grey/monochrome themes skip CVD variants (already achromatic) → 2 variants only
function expandDefinition(def) {
  const expanded = [];
  const baseLuminance = def.luminance || 'light';
  const oppLuminance = baseLuminance === 'dark' ? 'light' : 'dark';
  const oppSuffix = baseLuminance === 'dark' ? LIGHT_SUFFIX : DARK_SUFFIX;

  // Base theme (as defined)
  expanded.push({ ...def, luminance: baseLuminance });

  // Opposite luminance variant
  expanded.push({
    ...def,
    name: `${def.name}-${oppLuminance}`,
    title: suffixTitle(def.title, oppSuffix),
    luminance: oppLuminance,
  });

  // CVD variants from "variants" block — hand-picked safe pairs
  // Protan variant covers both protanopia and deuteranopia (same safe colours)
  if (def.variants && def.chroma !== 'grey') {
    for (const [cvdKey, overrides] of Object.entries(def.variants)) {
      const suffix = CVD_SUFFIX[cvdKey];
      if (!suffix) continue; // skip unknown CVD keys

      // Build variant definition by merging overrides onto base
      const variantBase = {
        ...def,
        ...overrides,
        name: `${def.name}-${cvdKey}`,
        title: suffixTitle(def.title, suffix),
        luminance: baseLuminance,
      };
      // Remove variants block from child to prevent recursion
      delete variantBase.variants;
      expanded.push(variantBase);

      // Dark version of CVD variant
      const variantDark = {
        ...variantBase,
        name: `${def.name}-${oppLuminance}-${cvdKey}`,
        title: suffixTitle(suffixTitle(def.title, oppSuffix), suffix),
        luminance: oppLuminance,
      };
      expanded.push(variantDark);
    }
  }

  return expanded;
}

// Collect all variant names for theme-names.json
const allVariantNames = {};

// ── Generate ──
let totalGenerated = 0;
let totalFailed = 0;
let totalScaleWarnings = 0;

function getBaseThemeName(name) {
  return name.replace(/-(dark|light)(-(protan|tritan))?$/, '').replace(/-(protan|tritan)$/, '');
}

function processDefinition(def, outputFolder) {
  const result = generateThemeData(def);

  // Determine output path
  // Brand default → brand/mind-the-box/ (flat, it IS the brand folder)
  // Global themes → a11y/{base}/ or fun/{base}/ (subfolders per base theme)
  const fileName = `${def.name}.css`;
  const baseName = getBaseThemeName(def.name);
  let filePath;
  if (baseName === 'default') {
    // Brand theme — BrandDefault.css at mind-the-box root,
    // variant files in mind-the-box/a11y-brand/ subfolder
    if (def.name === 'default') {
      if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });
      filePath = path.join(brandDir, 'BrandDefault.css');
    } else {
      const brandA11yDir = path.join(brandDir, 'a11y-brand');
      if (!fs.existsSync(brandA11yDir)) fs.mkdirSync(brandA11yDir, { recursive: true });
      filePath = path.join(brandA11yDir, fileName);
    }
  } else {
    // Global theme — subfolder per base theme
    const subDir = path.join(outputFolder, baseName);
    if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
    filePath = path.join(subDir, fileName);
  }

  // Run audits
  const { theme: themeAudit, scale: scaleAudit } = result.audit;

  if (!themeAudit.allPass) {
    totalFailed++;
    const fails = themeAudit.results.filter(r => !r.pass);
    console.log(`  ❌ ${def.name}:`);
    fails.forEach(f => console.log(`     ${f.label}: ${f.ratio}:1 (need ${f.level === 'text' ? '4.5' : '3'})`));
  }

  const scaleFails = scaleAudit.filter(r => !r.pass);
  if (scaleFails.length > 0) {
    totalScaleWarnings++;
    console.log(`  ⚠️  ${def.name} scale check:`);
    scaleFails.forEach(f => console.log(`     ${f.label}: ${f.ratio}:1 (need ${f.target})`));
  }

  // Apply brand config overrides — BrandDefault.css ONLY (light brand theme)
  // All variants (dark, protan, tritan, HC) use engine-calculated scale
  let css = result.css;
  if (def.name === 'default') {
    const brandConfigPath = path.join(brandDir, 'brandconfig.json');
    if (fs.existsSync(brandConfigPath)) {
      const brand = JSON.parse(fs.readFileSync(brandConfigPath, 'utf8'));
      const ROLE_MAP = { fill: 600, hover: 800, tint: 200, border: 400 };

      for (const family of ['primary', 'secondary']) {
        if (!brand[family]) continue;
        for (const [role, hex] of Object.entries(brand[family])) {
          const pos = ROLE_MAP[role];
          if (!pos) continue;
          const token = `--${family}-${pos}:`;
          const regex = new RegExp(`(${token})\\s*#[0-9a-fA-F]{3,8}`);
          if (regex.test(css)) {
            css = css.replace(regex, `$1 ${hex}`);
            console.log(`  🎨 brand: ${family}-${pos} → ${hex} (${role})`);
          }
        }
      }
      // Generate brand-overrides.css — identity tokens that persist across themes
      const SHAPE_RADIUS = { sharp: '0', subtle: 'var(--radius-sm)', soft: 'var(--radius-md)', rounded: 'var(--radius-lg)', pill: 'var(--radius-full)' };

      function buildButtonTokens(prefix, config) {
        if (!config) return '';
        const radius = SHAPE_RADIUS[config.shape] || 'var(--radius-md)';
        const colorFamily = config.color || 'primary';
        const isFill = config.style === 'fill';
        const bw = config.borderWidth || '2px';
        // Structure — brand decides shape/style, colours follow active theme
        const tokens = [
          `  --${prefix}-radius: ${radius};`,
          `  --${prefix}-style: ${config.style || 'outline'};`,
          `  --${prefix}-bg: ${isFill ? `var(--${colorFamily}-600)` : 'transparent'};`,
          `  --${prefix}-text: ${isFill ? `oklch(from var(--${colorFamily}-600) round(1.21 - l) 0 0)` : `var(--${colorFamily}-600)`};`,
          `  --${prefix}-border: ${isFill ? 'none' : `${bw} solid var(--${colorFamily}-600)`};`,
          `  --${prefix}-hover-bg: var(--${colorFamily}-800);`,
          `  --${prefix}-hover-text: oklch(from var(--${colorFamily}-800) round(1.21 - l) 0 0);`,
        ];
        // Outline ring for highlight-links
        if (config.outlineColor) {
          const outlineCol = `var(--${config.outlineColor}-600)`;
          tokens.push(`  --${prefix}-outline: ${config.outlineWidth || '3px'} solid ${outlineCol};`);
          tokens.push(`  --${prefix}-outline-offset: ${config.outlineOffset || '3px'};`);
        }
        return tokens.join('\n');
      }

      const overrideLines = [];
      overrideLines.push('/**');
      overrideLines.push(` * Brand Overrides — ${brand.brand || 'default'}`);
      overrideLines.push(' * Generated from brandconfig.json. Loads after any theme.');
      overrideLines.push(' * Identity tokens that persist across theme switches.');
      overrideLines.push(' */');
      overrideLines.push('');
      overrideLines.push(':root {');

      // Text-only heading tokens
      if (brand.textOnlyHeading) {
        const th = brand.textOnlyHeading;
        const colorFamily = th.color || 'neutral';
        const SIZE_MAP = { h1: 'var(--text-h1)', h2: 'var(--text-h2)', h3: 'var(--text-h3)', h4: 'var(--text-h4)', h5: 'var(--text-h5)', h6: 'var(--text-h6)' };
        const FONT_MAP = { heading: 'var(--font-heading)', body: 'var(--font-body)', mono: 'var(--font-mono)' };
        const WEIGHT_MAP = { normal: 'var(--font-normal)', medium: 'var(--font-medium)', semibold: 'var(--font-semibold)', bold: 'var(--font-bold)', extrabold: 'var(--font-extrabold)' };
        overrideLines.push(`  --heading-textonly-color: var(--${colorFamily}-600);`);
        overrideLines.push(`  --heading-textonly-size: ${SIZE_MAP[th.size] || 'var(--text-h3)'};`);
        overrideLines.push(`  --heading-textonly-font: ${FONT_MAP[th.font] || 'var(--font-heading)'};`);
        overrideLines.push(`  --heading-textonly-weight: ${WEIGHT_MAP[th.weight] || 'var(--font-bold)'};`);
        console.log(`  🎨 brand: textonly heading → ${th.color}/${th.size}/${th.font || 'heading'}/${th.weight || 'bold'}`);
      }

      // Text-only button tokens
      const toTokens = buildButtonTokens('btn-textonly', brand.textOnlyButton);
      if (toTokens) {
        overrideLines.push(toTokens);
        console.log(`  🎨 brand: textonly button → ${brand.textOnlyButton.style}/${brand.textOnlyButton.shape}/${brand.textOnlyButton.color}`);
      }

      // Highlight-links button tokens
      const hlTokens = buildButtonTokens('btn-highlight', brand.highlightLinksButton);
      if (hlTokens) {
        overrideLines.push(hlTokens);
        console.log(`  🎨 brand: highlight button → ${brand.highlightLinksButton.style}/${brand.highlightLinksButton.shape}/${brand.highlightLinksButton.color}`);
      }

      overrideLines.push('}');

      const overridesPath = path.join(brandDir, 'brand-overrides.css');
      fs.writeFileSync(overridesPath, overrideLines.join('\n'));
      console.log(`  🎨 brand: wrote ${path.relative(rootDir, overridesPath)}`);
    }
  }

  // Write file regardless (for inspection if failing)
  fs.writeFileSync(filePath, css);
  totalGenerated++;

  if (themeAudit.allPass && scaleFails.length === 0) {
    console.log(`  ✅ ${path.relative(rootDir, filePath)}`);
  }

  // Collect variant name data
  allVariantNames[def.name] = {
    title: def.title || def.name,
    sample: def.sample || '',
    category: def._category || 'accessibility',
  };
}

console.log('\n🎨 Theme Token Generator (OKLCH Engine)\n');

// Accessibility themes
console.log('── Accessibility themes ──');
for (const def of accessibilityDefs) {
  const variants = expandDefinition(def);
  for (const variant of variants) {
    variant._category = 'accessibility';
    processDefinition(variant, a11yDir);
  }
}

// Fun themes
console.log('\n── Fun themes ──');
for (const def of funDefs) {
  const variants = expandDefinition(def);
  for (const variant of variants) {
    variant._category = 'fun';
    processDefinition(variant, funDir);
  }
}

// ── Generate theme-names.json ──
const tokensDir = path.join(rootDir, 'src/styles/tokens');
if (!fs.existsSync(tokensDir)) fs.mkdirSync(tokensDir, { recursive: true });
const namesPath = path.join(tokensDir, 'theme-names.json');
fs.writeFileSync(namesPath, JSON.stringify(allVariantNames, null, 2));
console.log(`\n📛 Generated ${path.relative(rootDir, namesPath)} (${Object.keys(allVariantNames).length} entries)`);

// Summary
console.log(`\n✅ Generated ${totalGenerated} theme files`);
if (totalScaleWarnings > 0) console.log(`⚠️  ${totalScaleWarnings} themes have scale check warnings`);
if (totalFailed > 0) console.error(`❌ ${totalFailed} themes failed WCAG text audit`);
else console.log('✅ 0 themes failed WCAG text audit');

// ── Auto-run generate-core-tokens (coretokens.css + theme-cards.css) ──
console.log('\n── Generating core tokens + theme cards CSS ──');
const coreTokensScript = path.join(rootDir, 'src/scripts/generate-core-tokens.js');
const { execSync } = require('child_process');
try {
  execSync(`node "${coreTokensScript}"`, { stdio: 'inherit', cwd: rootDir });
} catch (e) {
  console.error('❌ generate-core-tokens.js failed:', e.message);
}
