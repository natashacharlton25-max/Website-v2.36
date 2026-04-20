#!/usr/bin/env node
/**
 * validate-themes.js — Theme catalogue validator
 *
 * Reads every generated CSS theme file, parses tokens, computes contrast
 * ratios, runs every theme against every accessibility profile, and writes
 * the results into:
 *
 *   - src/styles/tokens/theme-names.json — adds `contrast` + `safeFor` fields
 *     per variant (existing fields preserved)
 *   - src/styles/tokens/theme-validation.json — per-brand catalogue summary
 *     (positive certifications + suggested gaps)
 *
 * Auto-runs after generate-theme-tokens.js. Can also be invoked directly:
 *   node scripts/validate-themes.js
 *
 * Profiles live in src/lib/accessibility-profiles.js — single source of
 * truth used by validator + site UI (filter chips, badges, certificate page).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { ACCESSIBILITY_PROFILES } from '../src/lib/accessibility-profiles.js';

const require = createRequire(import.meta.url);
const chroma = require('chroma-js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const themesDir = path.join(rootDir, 'src/styles/themes');
const namesPath = path.join(rootDir, 'src/styles/tokens/theme-names.json');
const validationPath = path.join(rootDir, 'src/styles/tokens/theme-validation.json');

// ── Helpers ─────────────────────────────────────────────────────────

function contrastRatio(a, b) {
  const la = chroma(a).luminance();
  const lb = chroma(b).luminance();
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function wcagLevel(ratio, isLargeText = false) {
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'FAIL';
  }
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'FAIL';
}

function getToken(css, name) {
  const m = css.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]+)'));
  return m ? m[1] : null;
}

// Read every token in a theme CSS file as { tokenName: hex }
function getAllTokens(css) {
  const tokens = {};
  const re = /--([\w-]+):\s*(#[0-9a-fA-F]+)/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    tokens[m[1]] = m[2];
  }
  return tokens;
}

// Audit: within each scale, no two adjacent steps should be identical.
// Also: across scales, no two emphasis tokens or contrast tokens should match.
// Sacred exception: brand light default's primary/secondary scales.
const SCALE_FAMILIES = ['primary', 'secondary', 'neutral', 'text'];
const SCALE_STEPS = ['tint', 'mid', 'base', 'emphasis', 'contrast'];
const CROSS_TOKENS = ['emphasis', 'contrast'];

function auditTokenCollisions(tokens, isSacred, themeMeta) {
  const issues = [];

  // Calm themes intentionally collapse emphasis + contrast onto the same scale
  // position — that's by design, not a collision.
  const isCalm = themeMeta?.calm || themeMeta?.calmHC || themeMeta?.chroma === 'calm';

  // 1. Adjacent-step collisions within each scale.
  // Skip emphasis-vs-contrast: engine intentionally sets contrast = emphasis
  // for everything except brand light (which uses primaryAccent override).
  for (const family of SCALE_FAMILIES) {
    if (isSacred && (family === 'primary' || family === 'secondary')) continue;
    for (let i = 0; i < SCALE_STEPS.length - 1; i++) {
      const a = `${family}-${SCALE_STEPS[i]}`;
      const b = `${family}-${SCALE_STEPS[i + 1]}`;
      // Skip emphasis→contrast — by-design engine behaviour
      if (SCALE_STEPS[i] === 'emphasis' && SCALE_STEPS[i + 1] === 'contrast') continue;
      if (tokens[a] && tokens[b] && tokens[a].toLowerCase() === tokens[b].toLowerCase()) {
        issues.push({ kind: 'adjacent-step', family, a, b, hex: tokens[a] });
      }
    }
  }

  // 2. Cross-scale token collisions (e.g. all emphasis tokens identical).
  // Skip text family — text often shares hex with neutral by design.
  // Skip mono themes entirely — primary === secondary is the whole point.
  // Also skip library mono themes (mono-red, mono-blue etc — tinted greys by design).
  const isMono = themeMeta?.mono || themeMeta?.windowsMono || themeMeta?.category === 'mono';
  if (!isMono) {
    const crossFamilies = SCALE_FAMILIES.filter(f => f !== 'text');
    for (const step of CROSS_TOKENS) {
      const map = {};
      for (const family of crossFamilies) {
        const t = `${family}-${step}`;
        const hex = tokens[t]?.toLowerCase();
        if (hex) {
          if (!map[hex]) map[hex] = [];
          map[hex].push(t);
        }
      }
      for (const [hex, families] of Object.entries(map)) {
        if (families.length > 1) {
          issues.push({ kind: 'cross-scale', step, families, hex });
        }
      }
    }
  }

  return issues;
}

// Calm primary nudge: for calm themes whose primary disappears into the bg
// (< 3:1 contrast — the UI minimum), bump chroma + slightly darker lightness
// in OKLCH-space until it hits 3:1. Hue preserved. Keeps the chalky calm
// character but ensures buttons/accents are actually visible.
//
// Only nudges primary-base and secondary-base — leaves text and tint/mid
// alone. Returns updated CSS or original if no nudge needed.
function nudgeCalmContrast(css, isCalm) {
  if (!isCalm) return css;
  const bg = getToken(css, 'page-bg');
  if (!bg) return css;
  let updated = css;
  let didNudge = false;

  for (const familyToken of ['primary-base', 'secondary-base']) {
    const original = getToken(updated, familyToken);
    if (!original) continue;
    const ratio = contrastRatio(original, bg);
    if (ratio >= 3) continue;  // already visible enough

    // Bump chroma + lower lightness incrementally until ≥ 3:1, capped
    const [l, c, h] = chroma(original).oklch();
    let bestHex = original;
    let bestRatio = ratio;
    // Try gradually more chromatic + darker — calm character preserved
    for (let step = 1; step <= 8; step++) {
      const newC = Math.min((c || 0) + step * 0.02, 0.18);
      const newL = Math.max((l || 0.7) - step * 0.04, 0.35);
      try {
        const candidate = chroma.oklch(newL, newC, h || 0).hex();
        const r = contrastRatio(candidate, bg);
        if (r >= 3) {
          bestHex = candidate;
          bestRatio = r;
          break;
        }
        if (r > bestRatio) {
          bestHex = candidate;
          bestRatio = r;
        }
      } catch { /* gamut clip — keep trying */ }
    }
    if (bestHex.toLowerCase() !== original.toLowerCase()) {
      // Replace ALL occurrences of the original hex in CSS (so all derived
      // scale steps that were the same hex shift together)
      const re = new RegExp(original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      updated = updated.replace(re, bestHex);
      didNudge = true;
    }
  }

  return didNudge ? updated : css;
}

// Role-swap: same 4 colours, different roles. Strategy:
//   1. New bg = old primary (the most "branded" surface choice)
//   2. New text = whichever remaining colour has highest contrast vs new bg
//   3. New primary + secondary = the other two
//
// Same colours used across the swatches, but visual hierarchy genuinely
// flips AND text stays readable.
// Walk every #hex in CSS and apply an OKLCH transform.
// Transform receives [l, c, h] and returns [newL, newC, newH].
function transformAllHexes(css, transform) {
  return css.replace(/#[0-9a-fA-F]{6}\b/g, (hex) => {
    try {
      const [l, c, h] = chroma(hex).oklch();
      const [newL, newC, newH] = transform(l || 0, c || 0, h || 0);
      const safeL = Math.max(0.05, Math.min(0.97, newL));
      const safeC = Math.max(0, newC);
      return chroma.oklch(safeL, safeC, newH).hex();
    } catch (e) { return hex; }
  });
}

// Family-aware disambiguation for stragglers that role-swap can't resolve.
// Detects what family the variant belongs to (calm/hc/mono/dark/light) and
// applies a transformation that respects the family's design intent.
//
// - calm:  bg darkens slightly, primary/secondary keep chalky feel (no chroma bump)
// - hc:    one side lightens hard (already extreme, can go harder); chroma bump OK
// - mono:  bg shifts (lighter or darker depending on dark mode), keeps mono identity
// - dark:  lighten everything a touch — escapes near-black collision zone
// - light: darken everything a touch + tiny chroma bump
function familyAwareDisambiguate(css, variantName) {
  const isCalm = variantName.includes('-calm');
  const isHC = variantName.includes('-hc');
  const isMono = variantName.includes('-mono-') || variantName.startsWith('mono-');
  const isDark = variantName.includes('-dark');

  // CALM: chalky-preserving — bg darkens 0.04, scales unchanged, no chroma change
  if (isCalm) {
    return transformAllHexes(css, (l, c, h) => {
      // Only nudge near-bg lightnesses (>0.85 in light, <0.20 in dark)
      if (!isDark && l > 0.85) return [l - 0.04, c, h];
      if (isDark && l < 0.20) return [l + 0.04, c, h];
      return [l, c, h];
    });
  }
  // HC: push hard — lightness ±0.10, chroma +0.04
  if (isHC) {
    const dL = isDark ? +0.10 : -0.10;
    return transformAllHexes(css, (l, c, h) => [l + dL, c + (c > 0.02 ? 0.04 : 0), h]);
  }
  // MONO: bg shift — chalky/lighter in light, dustier/darker in dark.
  // ±0.10 to match HC strength (±0.05 was too subtle to read as distinct).
  if (isMono) {
    const dL = isDark ? -0.10 : +0.10;
    return transformAllHexes(css, (l, c, h) => [l + dL, c, h]);
  }
  // STANDARD DARK: lighten 0.06 — escapes near-black collision
  if (isDark) {
    return transformAllHexes(css, (l, c, h) => [l + 0.06, c + (c > 0.02 ? 0.02 : 0), h]);
  }
  // STANDARD LIGHT: darken 0.06 + tiny chroma bump
  return transformAllHexes(css, (l, c, h) => [l - 0.06, c + (c > 0.02 ? 0.02 : 0), h]);
}

// Build a swap map for a given newBg choice. Returns null if the rotation can't
// produce a valid config (e.g. text contrast fails, or primary blends into bg).
function buildSwapForNewBg(bg, primary, secondary, text, newBg) {
  const remaining = [bg, primary, secondary, text].filter(c => c && c.toLowerCase() !== newBg.toLowerCase());
  if (remaining.length < 1) return null;

  // Text = highest contrast vs newBg
  const sortedByContrast = remaining
    .map(c => ({ hex: c, ratio: contrastRatio(c, newBg) }))
    .sort((a, b) => b.ratio - a.ratio);
  const newText = sortedByContrast[0].hex;
  if (sortedByContrast[0].ratio < 4.5) return null; // text unreadable — reject

  const others = remaining.filter(c => c.toLowerCase() !== newText.toLowerCase());
  // Primary must be visible against bg (≥3:1 UI contrast). Otherwise the
  // primary swatch reads as "blank" — e.g. near-white primary on cream bg.
  const visiblePrimaries = others.filter(c => contrastRatio(c, newBg) >= 3);
  if (visiblePrimaries.length === 0) return null; // no visible primary — reject

  let newPrimary = visiblePrimaries[0];
  let newSecondary = others.find(c => c.toLowerCase() !== newPrimary.toLowerCase()) || newPrimary;
  // Of the visible primaries, prefer the one with more chroma (feels "branded")
  if (visiblePrimaries.length === 2) {
    const c0 = chroma(visiblePrimaries[0]).oklch()[1] || 0;
    const c1 = chroma(visiblePrimaries[1]).oklch()[1] || 0;
    if (c1 > c0) { newPrimary = visiblePrimaries[1]; }
    newSecondary = others.find(c => c.toLowerCase() !== newPrimary.toLowerCase()) || newPrimary;
  }
  return { newBg, newPrimary, newSecondary, newText };
}

// Apply a swap config to CSS by remapping every occurrence of the old role hexes.
function applySwapConfig(css, oldHexes, config) {
  const swap = {
    [oldHexes.bg.toLowerCase()]: config.newBg,
    [oldHexes.primary.toLowerCase()]: config.newPrimary,
    [oldHexes.secondary.toLowerCase()]: config.newSecondary,
    [oldHexes.text.toLowerCase()]: config.newText,
  };
  const allHexes = Object.keys(swap);
  if (allHexes.length === 0) return css;
  const re = new RegExp('(' + allHexes.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
  return css.replace(re, (match) => swap[match.toLowerCase()] || match);
}

// Sum of perceptual distance between two configs across the 4 role slots.
// Used to pick the rotation that's MOST visually different from canonical.
function configDistance(configA, hexesB) {
  const pairs = [
    [configA.newBg, hexesB.bg],
    [configA.newPrimary, hexesB.primary],
    [configA.newSecondary, hexesB.secondary],
    [configA.newText, hexesB.text],
  ];
  let total = 0;
  for (const [a, b] of pairs) {
    if (!a || !b) continue;
    try { total += chroma.deltaE(a, b); } catch (e) { /* skip */ }
  }
  return total;
}

// Role-swap: try ALL 3 rotation directions (newBg = primary | secondary | text),
// pick whichever produces the largest perceptual distance from `canonicalCss`
// (the variant we're trying to differentiate from). Falls back to old behaviour
// if canonicalCss isn't provided.
//
// Family preservation: dark themes keep dark bg (newBg lightness < 0.50);
// light themes keep light bg (newBg lightness > 0.50). Otherwise a swap can
// flip dark→light visually, breaking the "After Dark" identity.
function applyRoleSwap(css, canonicalCss = null, variantName = '') {
  const bg = getToken(css, 'page-bg');
  const primary = getToken(css, 'primary-base');
  const secondary = getToken(css, 'secondary-base');
  const text = getToken(css, 'text-emphasis');
  if (!bg || !primary || !secondary || !text) return css;

  const isDark = variantName.includes('-dark');
  const oldBgL = chroma(bg).oklch()[0] || 0;
  // Family-preserving filter: keep bg in same lightness half (dark stays dark)
  function preservesFamily(candidateHex) {
    const candL = chroma(candidateHex).oklch()[0] || 0;
    if (isDark) return candL < 0.50;
    // Light: only keep light if original was light
    if (oldBgL > 0.50) return candL > 0.50;
    return true;
  }

  const oldHexes = { bg, primary, secondary, text };
  const candidates = [primary, secondary, text]
    .filter(c => c && c.toLowerCase() !== bg.toLowerCase())
    .filter(preservesFamily); // family-preserving

  // Build all valid swap configs
  const configs = [];
  for (const candidate of candidates) {
    const config = buildSwapForNewBg(bg, primary, secondary, text, candidate);
    if (config) configs.push(config);
  }
  if (configs.length === 0) return css;

  // Rank by perceptual distance from canonical (or just pick first if no canonical)
  let best = configs[0];
  if (canonicalCss) {
    const cBg = getToken(canonicalCss, 'page-bg');
    const cPrim = getToken(canonicalCss, 'primary-base');
    const cSec = getToken(canonicalCss, 'secondary-base');
    const cText = getToken(canonicalCss, 'text-emphasis');
    if (cBg && cPrim && cSec && cText) {
      const canonicalHexes = { bg: cBg, primary: cPrim, secondary: cSec, text: cText };
      best = configs
        .map(cfg => ({ cfg, dist: configDistance(cfg, canonicalHexes) }))
        .sort((a, b) => b.dist - a.dist)[0].cfg;
    }
  }
  return applySwapConfig(css, oldHexes, best);
}

// Cross-variant duplication: two variants byte-identical on all 4 card tokens
function findVariantDuplicates(parsedThemes) {
  const fingerprints = {};
  for (const [name, theme] of Object.entries(parsedThemes)) {
    const fp = [theme.bg, theme.textEmphasis, theme.primary, theme.secondary]
      .map(s => (s || '').toLowerCase()).join('|');
    if (!fingerprints[fp]) fingerprints[fp] = [];
    fingerprints[fp].push(name);
  }
  return Object.entries(fingerprints)
    .filter(([, names]) => names.length > 1)
    .map(([fp, names]) => ({ fp, names }));
}

function findThemeFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'Preview') continue;
      files.push(...findThemeFiles(full));
    } else if (entry.name.endsWith('.css') && !entry.name.includes('brand-overrides')) {
      files.push(full);
    }
  }
  return files;
}

function variantNameFromPath(filePath) {
  const fileName = path.basename(filePath, '.css');
  return fileName === 'BrandDefault' ? 'default' : fileName;
}

// Get the base theme name from a variant (strip suffixes)
function baseThemeFromVariant(variantName) {
  return variantName
    .replace(/-hc$/, '')
    .replace(/-(protan|deutan|tritan)$/, '')
    .replace(/-(dark|light)$/, '')
    .replace(/-(windows-mono|mono)-(primary|secondary)$/, '')
    .replace(/-calm$/, '');
}

// Load all source theme definitions — keyed by base theme name
function loadSourceDefinitions() {
  const dirs = [
    path.join(rootDir, 'src/themes/definitions/library'),
    path.join(rootDir, 'src/themes/definitions/mono'),
    path.join(rootDir, 'src/themes/definitions/brand'),
  ];
  const defs = {};
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.json')) continue;
      try {
        const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        defs[json.name] = json;
      } catch { /* skip bad JSON */ }
    }
  }
  return defs;
}

// Pull descriptive metadata fields off a source theme definition
const DESCRIPTIVE_FIELDS = [
  'description', 'inspiration', 'mood', 'season', 'timeOfDay', 'era',
  'sensory', 'emotion', 'energy', 'palette', 'complexity', 'animationStyle',
  'scene', 'wardrobe',
];

function pickDescriptive(def) {
  if (!def) return {};
  const out = {};
  for (const f of DESCRIPTIVE_FIELDS) {
    if (def[f] != null) out[f] = def[f];
  }
  return out;
}

// ── Parse a CSS theme file into the shape ACCESSIBILITY_PROFILES.test() expects ──

function parseTheme(filePath, existingMeta) {
  const css = fs.readFileSync(filePath, 'utf8');
  const bg = getToken(css, 'page-bg');
  const primary = getToken(css, 'primary-base');
  const secondary = getToken(css, 'secondary-base');
  const textEmphasis = getToken(css, 'text-emphasis');
  const textBase = getToken(css, 'text-base');

  if (!bg || !primary || !secondary || !textEmphasis || !textBase) {
    return null; // file missing key tokens, skip
  }

  const [, primaryC, primaryHue] = chroma(primary).oklch();
  const [, secondaryC, secondaryHue] = chroma(secondary).oklch();
  const bgL = chroma(bg).oklch()[0];

  const contrastEmphasis = contrastRatio(textEmphasis, bg);
  const contrastBase = contrastRatio(textBase, bg);

  // Authored metadata from theme-names.json (chroma, luminance, hc, calmHC, mono flags)
  const authored = existingMeta || {};

  return {
    bg, primary, secondary, textEmphasis, textBase,
    bgL,
    primaryHue: primaryHue || 0,
    primaryC: primaryC || 0,
    secondaryHue: secondaryHue || 0,
    secondaryC: secondaryC || 0,
    contrastEmphasis,
    contrastBase,
    chroma: authored.chroma || 'brand',
    luminance: authored.luminance || 'light',
    hc: !!authored.hc,
    calmHC: !!authored.calmHC,
    isMonoPalette: !!authored.mono || !!authored.windowsMono,
  };
}

// ── Run every profile against a theme ──

function evaluateTheme(theme) {
  const safeFor = [];
  for (const [key, profile] of Object.entries(ACCESSIBILITY_PROFILES)) {
    try {
      if (profile.test(theme)) safeFor.push(key);
    } catch {
      // Test threw — treat as unsafe
    }
  }
  return safeFor;
}

// ── Main ────────────────────────────────────────────────────────────

function main() {
  console.log('\n🔍 Validating theme catalogue...\n');

  if (!fs.existsSync(namesPath)) {
    console.error(`❌ Missing ${namesPath} — run generate-theme-tokens.js first`);
    process.exit(1);
  }

  const names = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
  const themeFiles = findThemeFiles(themesDir);
  const sourceDefs = loadSourceDefinitions();

  let analysed = 0;
  let skipped = 0;

  // Per-brand summary collector — keyed by brand folder name (e.g. 'mind-the-box', 'library', 'mono')
  const brandSummary = {};

  function ensureBrand(brandKey) {
    if (!brandSummary[brandKey]) {
      brandSummary[brandKey] = {
        totalVariants: 0,
        certifications: Object.fromEntries(
          Object.keys(ACCESSIBILITY_PROFILES).map(k => [k, 0])
        ),
      };
    }
    return brandSummary[brandKey];
  }

  function brandFromPath(filePath) {
    const rel = path.relative(themesDir, filePath).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts[0] === 'brand') return parts[1] || 'unknown-brand';
    return parts[0]; // 'library' | 'mono'
  }

  // Collectors for the audit reports
  const collisionIssues = [];     // intra-/cross-scale collisions per file
  const parsedThemesByBrand = {}; // for cross-variant duplicate detection

  for (const filePath of themeFiles) {
    const variantName = variantNameFromPath(filePath);
    const existingMeta = names[variantName];
    const theme = parseTheme(filePath, existingMeta);

    if (!theme) { skipped++; continue; }

    // Calm contrast nudge: bumps primary/secondary chroma if they fall below
    // the 3:1 UI minimum vs page-bg. Calm character preserved (just enough to be
    // visible). Skip brand light default — primary is sacred there.
    const isSacred = variantName === 'default';
    const isCalmLike = !isSacred && (existingMeta?.calm || existingMeta?.calmHC || existingMeta?.chroma === 'calm');
    if (isCalmLike) {
      const cssBefore = fs.readFileSync(filePath, 'utf8');
      const cssAfter = nudgeCalmContrast(cssBefore, true);
      if (cssAfter !== cssBefore) {
        fs.writeFileSync(filePath, cssAfter);
        // Re-parse so downstream uses the nudged values
        const refreshed = parseTheme(filePath, existingMeta);
        if (refreshed) Object.assign(theme, refreshed);
      }
    }

    // Token collision audit (intra-scale + cross-scale)
    const css = fs.readFileSync(filePath, 'utf8');
    const allTokens = getAllTokens(css);
    const issues = auditTokenCollisions(allTokens, isSacred, existingMeta);
    if (issues.length) collisionIssues.push({ variantName, filePath, issues });

    // Track for cross-variant dup detection (per brand)
    const brandKey = brandFromPath(filePath);
    if (!parsedThemesByBrand[brandKey]) parsedThemesByBrand[brandKey] = {};
    parsedThemesByBrand[brandKey][variantName] = theme;

    const safeFor = evaluateTheme(theme);
    const emphasisLevel = wcagLevel(theme.contrastEmphasis);
    const baseLevel = wcagLevel(theme.contrastBase);

    // Enrich names entry
    if (existingMeta) {
      names[variantName].contrast = {
        emphasis: Math.round(theme.contrastEmphasis * 100) / 100,
        base: Math.round(theme.contrastBase * 100) / 100,
        emphasisLevel,
        baseLevel,
      };
      names[variantName].safeFor = safeFor;
      // Pipe through descriptive metadata from the source theme JSON
      const baseName = baseThemeFromVariant(variantName);
      const sourceDef = sourceDefs[baseName] || sourceDefs[variantName];
      Object.assign(names[variantName], pickDescriptive(sourceDef));
      // Hex tokens for the page card
      names[variantName].hex = {
        bg: theme.bg,
        primary: theme.primary,
        secondary: theme.secondary,
        textEmphasis: theme.textEmphasis,
        textBase: theme.textBase,
      };
    }

    // Per-brand counts
    const brand = ensureBrand(brandFromPath(filePath));
    brand.totalVariants++;
    for (const profile of safeFor) brand.certifications[profile]++;

    analysed++;
  }

  // ── Cross-variant duplicate detection (per brand) ───────────────
  const variantDuplicates = {};
  for (const [brandKey, themes] of Object.entries(parsedThemesByBrand)) {
    const dupes = findVariantDuplicates(themes);
    if (dupes.length) variantDuplicates[brandKey] = dupes;
  }

  // ── Role-swap fix for duplicates (iterative) ────────────────────
  // When two variants are byte-identical, the second one becomes a "swapped"
  // version: roles cycle so primary→bg, bg→text, text→secondary, secondary→primary.
  // Same colours, different visual hierarchy. Keeps the variant slot meaningful.
  // Iterates: a swap may produce NEW duplicates against unrelated themes, so we
  // keep passing until no more changes (max 5 passes).
  // Stragglers after 5 passes get desaturated (forced to grey) so they're at
  // least visually distinct from the twin they keep colliding with.
  const swapHistory = {}; // dupName → count of swaps applied
  let roleSwapsApplied = 0;
  const roleSwapped = []; // [{variant, swappedFrom}] for the report
  for (let pass = 0; pass < 5; pass++) {
    let passSwaps = 0;
    for (const [brandKey, dupGroups] of Object.entries(variantDuplicates)) {
      for (const group of dupGroups) {
        // Canonical = the name with FEWEST suffix segments (closest to the base
        // theme). The other names are auto-generated variants that ended up
        // identical, so they're the ones we role-swap to give them new identity.
        const sorted = [...group.names].sort((a, b) =>
          a.split('-').length - b.split('-').length || a.length - b.length
        );
        const [canonical, ...others] = sorted;
        // Read canonical CSS once per group — role-swap uses it to pick the
        // rotation that's most perceptually different.
        const canonicalFile = themeFiles.find(f => variantNameFromPath(f) === canonical);
        const canonicalCss = canonicalFile ? fs.readFileSync(canonicalFile, 'utf8') : null;
        for (const dupName of others) {
          const dupFile = themeFiles.find(f => variantNameFromPath(f) === dupName);
          if (!dupFile) continue;
          const css = fs.readFileSync(dupFile, 'utf8');
          swapHistory[dupName] = (swapHistory[dupName] || 0) + 1;
          // Stragglers: after 2+ swap attempts, hand off to the family-aware
          // disambiguator (calm preserves chalky, HC pushes harder, mono shifts
          // bg lightness, dark/light nudge with optional chroma bump).
          const newCss = swapHistory[dupName] >= 2
            ? familyAwareDisambiguate(css, dupName)
            : applyRoleSwap(css, canonicalCss, dupName);
          if (newCss !== css) {
            fs.writeFileSync(dupFile, newCss);
            roleSwapsApplied++;
            passSwaps++;
            roleSwapped.push({
              variant: dupName,
              swappedFrom: canonical,
              pass: pass + 1,
              disambiguated: swapHistory[dupName] >= 2,
            });
            const refreshedTheme = parseTheme(dupFile, names[dupName]);
            if (refreshedTheme) {
              parsedThemesByBrand[brandKey][dupName] = refreshedTheme;
              if (names[dupName]) {
                names[dupName].hex = {
                  bg: refreshedTheme.bg,
                  primary: refreshedTheme.primary,
                  secondary: refreshedTheme.secondary,
                  textEmphasis: refreshedTheme.textEmphasis,
                  textBase: refreshedTheme.textBase,
                };
                names[dupName].roleSwapped = true;
                names[dupName].swappedFrom = canonical;
              }
            }
          }
        }
      }
    }
    if (passSwaps === 0) break; // converged
    // Re-detect duplicates for next pass — swaps may have produced new collisions
    for (const [brandKey, themes] of Object.entries(parsedThemesByBrand)) {
      const dupes = findVariantDuplicates(themes);
      variantDuplicates[brandKey] = dupes;
    }
  }
  if (roleSwapsApplied > 0) {
    console.log(`\n🔄 Applied role-swap fix to ${roleSwapsApplied} duplicate variants`);
    for (const { variant, swappedFrom, pass, disambiguated } of roleSwapped) {
      const tag = disambiguated ? '🎨 family-shift' : '🔁 role-swap';
      console.log(`   [pass ${pass}] ${tag}  ${variant} ← ${swappedFrom}`);
    }
    // Re-run generate-core-tokens so the card preview tokens reflect the swap.
    console.log('\n🔁 Regenerating coretokens + theme-cards CSS for swapped variants...');
    try {
      const { execSync } = require('child_process');
      const coreTokensScript = path.join(rootDir, 'src/scripts/generate-core-tokens.js');
      execSync(`node "${coreTokensScript}"`, { stdio: 'inherit', cwd: rootDir });
    } catch (e) {
      console.error(`❌ Could not refresh card tokens: ${e.message}`);
    }
  }

  // require() defined at top — line below silences a lint warning since
  // require is hoisted via createRequire above

  // ── Audit summary in console + attach to validation.json ────────
  const totalCollisions = collisionIssues.reduce((n, i) => n + i.issues.length, 0);
  const totalDupGroups = Object.values(variantDuplicates).reduce((n, g) => n + g.length, 0);
  console.log(`\n🔎 Audit:`);
  console.log(`   token collisions: ${totalCollisions} across ${collisionIssues.length} variants`);
  console.log(`   duplicate variants: ${totalDupGroups} groups`);
  if (totalCollisions > 0) {
    console.log('\n   First 10 collisions:');
    for (const entry of collisionIssues.slice(0, 10)) {
      for (const issue of entry.issues.slice(0, 2)) {
        if (issue.kind === 'adjacent-step') {
          console.log(`     ${entry.variantName}: ${issue.a} === ${issue.b} (${issue.hex})`);
        } else {
          console.log(`     ${entry.variantName}: cross-scale ${issue.step} dup → ${issue.families.join(', ')} all = ${issue.hex}`);
        }
      }
    }
  }
  if (totalDupGroups > 0) {
    console.log('\n   Variant duplicate groups:');
    for (const [brand, groups] of Object.entries(variantDuplicates)) {
      for (const g of groups.slice(0, 5)) {
        console.log(`     [${brand}] ${g.names.join(' === ')}`);
      }
      if (groups.length > 5) console.log(`     [${brand}] ... +${groups.length - 5} more`);
    }
  }

  // ── Generate suggestions per brand ──────────────────────────────
  // (positive framing: missing coverage = suggestion, not fail)
  for (const [brandKey, data] of Object.entries(brandSummary)) {
    const suggestions = [];
    const certs = data.certifications;
    if (certs.migraine === 0) suggestions.push('Add a calm or low-chroma variant for migraine-sensitive users.');
    if (certs.adhd === 0) suggestions.push('Add a mono or calm variant to reduce visual decision load for ADHD users.');
    if (certs.dyslexia === 0) suggestions.push('Consider a soft warm-bg variant for dyslexic readers.');
    if (certs.protan === 0) suggestions.push('No protan-safe variants — verify primary/secondary hue separation.');
    if (certs.deutan === 0) suggestions.push('No deutan-safe variants — verify primary/secondary hue separation.');
    if (certs.tritan === 0) suggestions.push('No tritan-safe variants — verify primary/secondary aren\'t in the blue/yellow confusion zone.');
    if (certs.wcagAA === 0) suggestions.push('No variants pass WCAG AA — check contrast targeting.');
    data.suggestions = suggestions;
  }

  // ── Write outputs ───────────────────────────────────────────────
  fs.writeFileSync(namesPath, JSON.stringify(names, null, 2));
  // Embed audit data alongside per-brand summary so the certificate page can show it
  const validationOutput = {
    brands: brandSummary,
    audit: {
      totalCollisions,
      totalDuplicateGroups: totalDupGroups,
      collisionIssues,
      variantDuplicates,
    },
  };
  fs.writeFileSync(validationPath, JSON.stringify(validationOutput, null, 2));

  // ── Console summary ─────────────────────────────────────────────
  console.log(`✅ Analysed ${analysed} theme variants (${skipped} skipped)\n`);
  console.log('Per-brand certifications:');
  for (const [brandKey, data] of Object.entries(brandSummary)) {
    console.log(`\n  ${brandKey} (${data.totalVariants} variants):`);
    for (const [profile, count] of Object.entries(data.certifications)) {
      if (count > 0) console.log(`    ${profile.padEnd(15)} ${count}`);
    }
    if (data.suggestions.length) {
      console.log('    Suggestions:');
      data.suggestions.forEach(s => console.log(`      • ${s}`));
    }
  }

  console.log(`\n📝 Wrote ${path.relative(rootDir, namesPath)}`);
  console.log(`📝 Wrote ${path.relative(rootDir, validationPath)}\n`);
}

main();
