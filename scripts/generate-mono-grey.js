#!/usr/bin/env node

/**
 * generate-mono-grey.js — Mono-grey theme CSS generator (new engine).
 *
 * No definition JSON, no brand input. Three pre-baked variants
 * (pure / warm / cool), each in 4 modes (light / dark / hc-light / hc-dark)
 * = 12 total CSS files. CVD-irrelevant: pure has no hue, warm/cool whispers
 * are isolated single-hue tints not slot-pairs.
 *
 * Run: node scripts/generate-mono-grey.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { generateMonoGrey } from '../src/theme-engine/generators/mono-grey.js';
import { buildThemeCSS } from '../src/theme-engine/writer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const outputDir = path.join(rootDir, 'src/styles/themes/a11y/mono-grey');
const namesPath = path.join(rootDir, 'src/styles/tokens/theme-names.json');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

console.log(`\n⚪ Mono-grey generator`);
console.log(`   Three variants: pure / warm / cool`);
console.log(`   Each × light/dark × hc/non-hc = 12 files\n`);

// Per-variant titles. Mono themes don't carry brand identity — names are
// engine-descriptive. Brands can rename in their own registry later.
const VARIANT_META = {
  pure: { title: { fun: 'Noir',     pro: 'Mono Pure' }, sample: 'True achromatic' },
  warm: { title: { fun: 'Parchment', pro: 'Mono Warm' }, sample: 'Whisper-warm grey' },
  cool: { title: { fun: 'Slate',    pro: 'Mono Cool' }, sample: 'Whisper-cool grey' },
};

function variantName(variant, { luminance, hc }) {
  let name = `mono-${variant}`;
  if (luminance === 'dark') name += '-dark';
  if (hc) name += '-hc';
  return name;
}

function variantTitle(baseTitle, { luminance, hc }) {
  const suffix = [];
  if (luminance === 'dark') suffix.push('Dark');
  if (hc) suffix.push('HC');
  if (!suffix.length) return baseTitle;
  const suffixStr = ' — ' + suffix.join(' ');
  if (typeof baseTitle === 'string') return baseTitle + suffixStr;
  return {
    fun: (baseTitle.fun || '') + suffixStr,
    pro: (baseTitle.pro || '') + suffixStr,
  };
}

const variantNames = {};
let totalGenerated = 0;

for (const variant of ['pure', 'warm', 'cool']) {
  for (const luminance of ['light', 'dark']) {
    for (const hc of [false, true]) {
      const opts = { luminance, hc };
      const name = variantName(variant, opts);

      try {
        const tokens = generateMonoGrey(variant, opts);
        const css = buildThemeCSS(tokens);
        const filePath = path.join(outputDir, `${name}.css`);
        fs.writeFileSync(filePath, css);
        totalGenerated++;
        console.log(`  ✅ ${name}.css`);

        const meta = VARIANT_META[variant];
        variantNames[name] = {
          title:    variantTitle(meta.title, opts),
          sample:   meta.sample,
          category: 'accessibility',
          engine:   'mono-grey',
          variant,
          luminance,
          hc,
          cvd: null,
          // No CVD pass for mono — pure has no hue, whispers are isolated.
          cvdRisk: { score: 0, severity: 'safe', slots: [] },
        };
      } catch (err) {
        console.error(`  ❌ ${name}: ${err.message}`);
      }
    }
  }
}

// ── Merge into theme-names.json ───────────────────────────────────
const tokensDir = path.dirname(namesPath);
if (!fs.existsSync(tokensDir)) fs.mkdirSync(tokensDir, { recursive: true });

const existing = fs.existsSync(namesPath)
  ? JSON.parse(fs.readFileSync(namesPath, 'utf8'))
  : {};
fs.writeFileSync(namesPath, JSON.stringify({ ...existing, ...variantNames }, null, 2));
console.log(`\n📛 Merged ${Object.keys(variantNames).length} mono-grey entries into ${path.relative(rootDir, namesPath)}`);

console.log(`\n✅ Generated ${totalGenerated} mono-grey CSS files`);

// ── Rebuild coretokens + theme-cards ──────────────────────────────
console.log('\n── Rebuilding coretokens.css + theme-cards.css ──');
const coreTokensScript = path.join(rootDir, 'src/scripts/generate-core-tokens.js');
if (fs.existsSync(coreTokensScript)) {
  try {
    execSync(`node "${coreTokensScript}"`, { stdio: 'inherit', cwd: rootDir });
  } catch (e) {
    console.error('❌ generate-core-tokens.js failed:', e.message);
  }
}

// ── Validator post-build ──────────────────────────────────────────
console.log('\n── Running validate-themes.js (post-build audit) ──');
const validateScript = path.join(rootDir, 'scripts/validate-themes.js');
if (fs.existsSync(validateScript)) {
  try {
    execSync(`node "${validateScript}"`, { stdio: 'inherit', cwd: rootDir });
  } catch (e) {
    console.error('❌ validate-themes.js failed:', e.message);
  }
}
