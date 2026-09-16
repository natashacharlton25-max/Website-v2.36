#!/usr/bin/env node

/**
 * generate-themes.js ÔÇö Multi-brand, multi-engine theme dispatcher.
 *
 * Reads every JSON in src/themes/brands/, runs each brand through every
 * engine listed in its `engines` block, writes CSS files to
 * src/styles/themes/brands/{brand}/{engine}/.
 *
 * Replaces the old per-engine scripts (generate-vivid.js,
 * generate-cloudcalm.js) ÔÇö single source of truth per brand, dispatcher
 * picks the right engine.
 *
 * Mono-grey is brand-agnostic (no HSV input, three pre-baked variants)
 * and ships from generate-mono-grey.js ÔÇö not handled here.
 *
 * Run: node scripts/generate-themes.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { validateInput } from '../src/theme-engine/validator/input.js';
import { generateVivid }     from '../src/theme-engine/generators/vivid.js';
import { generateCloudcalm } from '../src/theme-engine/generators/cloudcalm.js';
import { buildThemeCSS } from '../src/theme-engine/writer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Engine name ÔåÆ generator function. Add new engines here.
const ENGINES = {
  vivid:     generateVivid,
  cloudcalm: generateCloudcalm,
};

const brandsDir = path.join(rootDir, 'src/themes/brands');
const outputRoot = path.join(rootDir, 'src/styles/themes/brands');
const namesPath  = path.join(rootDir, 'src/styles/tokens/theme-names.json');

// ÔöÇÔöÇ Helpers ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function variantName(engineName, { luminance, hc, cvd }) {
  let name = engineName;
  if (luminance === 'dark') name += '-dark';
  if (hc) name += '-hc';
  if (cvd) name += `-${cvd}`;
  return name;
}

function variantTitle(baseTitle, { luminance, hc, cvd }) {
  const suffix = [];
  if (luminance === 'dark') suffix.push('Dark');
  if (hc) suffix.push('HC');
  if (cvd) suffix.push(cvd.charAt(0).toUpperCase() + cvd.slice(1));
  if (!suffix.length) return baseTitle;
  const suffixStr = ' ÔÇö ' + suffix.join(' ');
  if (typeof baseTitle === 'string') return baseTitle + suffixStr;
  return {
    fun: (baseTitle.fun || '') + suffixStr,
    pro: (baseTitle.pro || '') + suffixStr,
  };
}

// ÔöÇÔöÇ Per-engine pipeline ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

function runEngine(brandDef, engineName, engineMeta) {
  const generator = ENGINES[engineName];
  if (!generator) {
    throw new Error(`Unknown engine "${engineName}" requested by brand "${brandDef.brand}"`);
  }

  // Adapt brand JSON shape ÔåÆ validator input shape (validator expects `name`
  // + flat `primary`/`secondary` HSV).
  const validatorInput = {
    name:      brandDef.brand,
    engine:    engineName,
    primary:   brandDef.primary,
    secondary: brandDef.secondary,
  };

  const { hexSet, warnings, cvdRisks, meta: inputMeta } = validateInput(validatorInput);
  if (warnings.length) warnings.forEach(w => console.log(`     ÔÜá´©Å  ${w}`));

  const outputDir = path.join(outputRoot, brandDef.brand, engineName);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const variantNames = {};
  let totalGenerated = 0;
  let totalCvdUnsafe = 0;

  for (const luminance of ['light', 'dark']) {
    for (const hc of [false, true]) {
      for (const cvd of [null, 'protan', 'deutan', 'tritan']) {
        const variant = {
          luminance, hc, cvd, cvdRisks,
          greyTintHues: inputMeta?.greyTintHues ?? null,
        };
        const name = variantName(engineName, variant);

        try {
          const tokens = generator(hexSet, variant);
          const css = buildThemeCSS(tokens);
          fs.writeFileSync(path.join(outputDir, `${name}.css`), css);
          totalGenerated++;

          const cvdNote = cvd ? (tokens.meta.cvdSafe ? ' Ô£ô' : ' ÔÜá') : '';
          if (cvd && !tokens.meta.cvdSafe) totalCvdUnsafe++;
          console.log(`     Ô£à ${name}.css${cvdNote}`);

          variantNames[name] = {
            title:    variantTitle(engineMeta.title || engineName, variant),
            sample:   engineMeta.sample || '',
            category: brandDef.category || 'accessibility',
            engine:   engineName,
            brand:    brandDef.brand,
            luminance,
            hc,
            cvd: cvd || null,
            cvdRisk: cvd && cvdRisks[cvd]
              ? { score: cvdRisks[cvd].score, severity: cvdRisks[cvd].severity, slots: cvdRisks[cvd].slots }
              : { score: 0, severity: 'safe', slots: [] },
          };
        } catch (err) {
          console.error(`     ÔØî ${name}: ${err.message}`);
        }
      }
    }
  }

  return { variantNames, totalGenerated, totalCvdUnsafe };
}

// ÔöÇÔöÇ Main ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

if (!fs.existsSync(brandsDir)) {
  console.error(`ÔØî Missing brands directory: ${brandsDir}`);
  process.exit(1);
}

const brandFiles = fs.readdirSync(brandsDir).filter(f => f.endsWith('.json'));
if (!brandFiles.length) {
  console.error(`ÔØî No brand JSON files found in ${brandsDir}`);
  process.exit(1);
}

console.log(`\n­ƒÄ¿ Theme dispatcher`);
console.log(`   ${brandFiles.length} brand(s) found in ${path.relative(rootDir, brandsDir)}\n`);

const allVariantNames = {};
let grandTotal = 0;
let grandCvdUnsafe = 0;

for (const file of brandFiles) {
  const brandDef = JSON.parse(fs.readFileSync(path.join(brandsDir, file), 'utf8'));
  console.log(`­ƒôª Brand: ${brandDef.brand}`);
  console.log(`   Primary:   hsv(${brandDef.primary.h}, ${(brandDef.primary.s * 100).toFixed(1)}%, ${(brandDef.primary.v * 100).toFixed(1)}%)`);
  console.log(`   Secondary: hsv(${brandDef.secondary.h}, ${(brandDef.secondary.s * 100).toFixed(1)}%, ${(brandDef.secondary.v * 100).toFixed(1)}%)`);
  console.log(`   Engines:   ${Object.keys(brandDef.engines).join(', ')}`);

  for (const [engineName, engineMeta] of Object.entries(brandDef.engines)) {
    console.log(`\n   ÔÜÖ´©Å  ${engineName}`);
    const { variantNames, totalGenerated, totalCvdUnsafe } =
      runEngine(brandDef, engineName, engineMeta);
    Object.assign(allVariantNames, variantNames);
    grandTotal += totalGenerated;
    grandCvdUnsafe += totalCvdUnsafe;
  }
  console.log('');
}

// ÔöÇÔöÇ Merge into theme-names.json ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

const tokensDir = path.dirname(namesPath);
if (!fs.existsSync(tokensDir)) fs.mkdirSync(tokensDir, { recursive: true });

const existing = fs.existsSync(namesPath)
  ? JSON.parse(fs.readFileSync(namesPath, 'utf8'))
  : {};
fs.writeFileSync(namesPath, JSON.stringify({ ...existing, ...allVariantNames }, null, 2));
console.log(`­ƒôø Merged ${Object.keys(allVariantNames).length} entries into ${path.relative(rootDir, namesPath)}`);
console.log(`Ô£à Generated ${grandTotal} CSS files`);
if (grandCvdUnsafe > 0) console.log(`ÔÜá´©Å  ${grandCvdUnsafe} CVD variants flagged unsafe`);

// ÔöÇÔöÇ Rebuild coretokens + theme-cards ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

console.log('\nÔöÇÔöÇ Rebuilding coretokens.css + theme-cards.css ÔöÇÔöÇ');
const coreTokensScript = path.join(rootDir, 'src/scripts/generate-core-tokens.js');
if (fs.existsSync(coreTokensScript)) {
  try {
    execSync(`node "${coreTokensScript}"`, { stdio: 'inherit', cwd: rootDir });
  } catch (e) {
    console.error('ÔØî generate-core-tokens.js failed:', e.message);
  }
}

// ÔöÇÔöÇ Validator ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ

console.log('\nÔöÇÔöÇ Running validate-themes.js (post-build audit) ÔöÇÔöÇ');
const validateScript = path.join(rootDir, 'scripts/validate-themes.js');
if (fs.existsSync(validateScript)) {
  try {
    execSync(`node "${validateScript}"`, { stdio: 'inherit', cwd: rootDir });
  } catch (e) {
    console.error('ÔØî validate-themes.js failed:', e.message);
  }
}
