#!/usr/bin/env node

/**
 * generate-cloudcalm.js — Cloudcalm theme CSS generator (new engine).
 *
 * Reads cloudcalm definition from src/themes/definitions/accessibility/cloudcalm.json
 * (HSV values + metadata). Loops 16 variants (light/dark × hc × 4 cvd),
 * writes one CSS file per variant to src/styles/themes/a11y/cloudcalm/.
 *
 * Then merges cloudcalm entries into src/styles/tokens/theme-names.json
 * (preserves existing entries from other themes).
 *
 * Finally, auto-runs src/scripts/generate-core-tokens.js to rebuild
 * coretokens.css + theme-cards.css (picker data).
 *
 * Run: node scripts/generate-cloudcalm.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { validateInput } from '../src/theme-engine/validator/input.js';
import { generateCloudcalm } from '../src/theme-engine/generators/cloudcalm.js';
import { buildThemeCSS } from '../src/theme-engine/writer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// ── Paths ───────────────────────────────────────────────────────────
const defPath   = path.join(rootDir, 'src/themes/definitions/accessibility/cloudcalm.json');
const outputDir = path.join(rootDir, 'src/styles/themes/a11y/cloudcalm');
const namesPath = path.join(rootDir, 'src/styles/tokens/theme-names.json');

// ── Ensure output dir exists ────────────────────────────────────────
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ── Read definition ─────────────────────────────────────────────────
if (!fs.existsSync(defPath)) {
  console.error(`❌ Missing cloudcalm definition at ${defPath}`);
  process.exit(1);
}
const def = JSON.parse(fs.readFileSync(defPath, 'utf8'));
console.log(`\n🌥  Cloudcalm generator`);
console.log(`   Primary:   hsv(${def.primary.h}, ${(def.primary.s * 100).toFixed(1)}%, ${(def.primary.v * 100).toFixed(1)}%)`);
console.log(`   Secondary: hsv(${def.secondary.h}, ${(def.secondary.s * 100).toFixed(1)}%, ${(def.secondary.v * 100).toFixed(1)}%)\n`);

// ── Validate input once (shared across all variants) ────────────────
const { hexSet, warnings, cvdRisks, meta: inputMeta } = validateInput(def);
if (warnings.length) {
  warnings.forEach(w => console.log(`   ⚠️  ${w}`));
}

// ── Build filename per variant ──────────────────────────────────────
function variantName({ luminance, hc, cvd }) {
  let name = 'cloudcalm';
  if (luminance === 'dark') name += '-dark';
  if (hc) name += '-hc';
  if (cvd) name += `-${cvd}`;
  return name;
}

// ── Build title per variant (used in theme-names.json) ──────────────
function variantTitle(baseTitle, { luminance, hc, cvd }) {
  const suffix = [];
  if (luminance === 'dark') suffix.push('Dark');
  if (hc) suffix.push('HC');
  if (cvd) suffix.push(cvd.charAt(0).toUpperCase() + cvd.slice(1));
  if (!suffix.length) return baseTitle;
  const suffixStr = ' — ' + suffix.join(' ');
  if (typeof baseTitle === 'string') return baseTitle + suffixStr;
  return {
    fun: (baseTitle.fun || '') + suffixStr,
    pro: (baseTitle.pro || '') + suffixStr,
  };
}

// ── Loop all 16 variant combinations ────────────────────────────────
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
      const name = variantName(variant);

      try {
        const tokens = generateCloudcalm(hexSet, variant);
        const css = buildThemeCSS(tokens);
        const filePath = path.join(outputDir, `${name}.css`);
        fs.writeFileSync(filePath, css);
        totalGenerated++;

        const cvdNote = cvd ? (tokens.meta.cvdSafe ? ` ✓ cvd-safe` : ` ⚠ cvd-unsafe`) : '';
        if (cvd && !tokens.meta.cvdSafe) totalCvdUnsafe++;
        console.log(`  ✅ ${name}.css${cvdNote}`);

        variantNames[name] = {
          title:    variantTitle(def.title || def.name, variant),
          sample:   def.sample || '',
          category: def.category || 'accessibility',
          engine:   'cloudcalm',
          luminance,
          hc,
          cvd: cvd || null,
          cvdRisk: cvd && cvdRisks && cvdRisks[cvd]
            ? { score: cvdRisks[cvd].score, severity: cvdRisks[cvd].severity, slots: cvdRisks[cvd].slots }
            : { score: 0, severity: 'safe', slots: [] },
        };
      } catch (err) {
        console.error(`  ❌ ${name}: ${err.message}`);
      }
    }
  }
}

// ── Merge into theme-names.json (preserve other themes) ─────────────
const tokensDir = path.dirname(namesPath);
if (!fs.existsSync(tokensDir)) fs.mkdirSync(tokensDir, { recursive: true });

const existing = fs.existsSync(namesPath)
  ? JSON.parse(fs.readFileSync(namesPath, 'utf8'))
  : {};
fs.writeFileSync(namesPath, JSON.stringify({ ...existing, ...variantNames }, null, 2));
console.log(`\n📛 Merged ${Object.keys(variantNames).length} cloudcalm entries into ${path.relative(rootDir, namesPath)}`);

// ── Summary ─────────────────────────────────────────────────────────
console.log(`\n✅ Generated ${totalGenerated} cloudcalm CSS files`);
if (totalCvdUnsafe > 0) console.log(`⚠️  ${totalCvdUnsafe} CVD variants flagged unsafe (check console notes)`);

// ── Auto-run generate-core-tokens.js ────────────────────────────────
console.log('\n── Rebuilding coretokens.css + theme-cards.css ──');
const coreTokensScript = path.join(rootDir, 'src/scripts/generate-core-tokens.js');
if (fs.existsSync(coreTokensScript)) {
  try {
    execSync(`node "${coreTokensScript}"`, { stdio: 'inherit', cwd: rootDir });
  } catch (e) {
    console.error('❌ generate-core-tokens.js failed:', e.message);
  }
} else {
  console.log(`   (skipped — ${path.relative(rootDir, coreTokensScript)} not found)`);
}

// ── Auto-run validate-themes.js (post-build audit + role-swap) ──────
console.log('\n── Running validate-themes.js (post-build audit) ──');
const validateScript = path.join(rootDir, 'scripts/validate-themes.js');
if (fs.existsSync(validateScript)) {
  try {
    execSync(`node "${validateScript}"`, { stdio: 'inherit', cwd: rootDir });
  } catch (e) {
    console.error('❌ validate-themes.js failed:', e.message);
  }
} else {
  console.log(`   (skipped — ${path.relative(rootDir, validateScript)} not found)`);
}
