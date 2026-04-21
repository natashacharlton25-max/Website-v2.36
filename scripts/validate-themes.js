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
import { DISTINCTNESS_DE } from '../src/theme-engine/shared/cvd.js';

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
// Walk token declarations in CSS and apply an OKLCH transform to their hex
// values. Only touches:
//   --primary-*, --secondary-*, --neutral-*, --text-*
//     (positions: tint / mid / base / emphasis / contrast)
//   --page-bg, --page-bg-raised, --page-bg-sunken, --page-bg-overlay
//     (bg surfaces — validator can nudge per-variant salt here)
//
// Never touches:
//   --color-Black / --color-White        — B/W anchors (flip per luminance
//                                           at generation time only)
//   --shadow-Black / --shadow-White      — pure #000/#fff for shadow maths
//   --color-Success/Warning/Error/Info   — status semantic, theme-independent
//   --focus-color / --focus-bg /
//   --highlight-link-color               — generator computes via gap-split
//   --media-* / --svg-ghost-color        — non-hex or var() references
//
// Transform receives [l, c, h] and returns [newL, newC, newH].
const TRANSFORM_ALLOWED_TOKENS = (() => {
  const names = new Set();
  for (const f of SCALE_FAMILIES) for (const p of SCALE_STEPS) names.add(`${f}-${p}`);
  for (const n of ['page-bg', 'page-bg-raised', 'page-bg-sunken', 'page-bg-overlay']) names.add(n);
  return names;
})();

function transformAllHexes(css, transform) {
  // Match a token declaration: `--token-name: #rrggbb;`
  return css.replace(/(--[\w-]+)(\s*:\s*)(#[0-9a-fA-F]{6})\b/g, (match, tokenName, sep, _hex) => {
    const name = tokenName.slice(2); // strip leading --
    if (!TRANSFORM_ALLOWED_TOKENS.has(name)) return match;
    try {
      const [l, c, h] = chroma(_hex).oklch();
      const [newL, newC, newH] = transform(l || 0, c || 0, h || 0);
      const safeL = Math.max(0.05, Math.min(0.97, newL));
      const safeC = Math.max(0, newC);
      return tokenName + sep + chroma.oklch(safeL, safeC, newH).hex();
    } catch (e) { return match; }
  });
}

// Family-aware disambiguation for stragglers that role-swap can't resolve.
// Detects what family the variant belongs to (calm/hc/mono/dark/light) and
// applies a transformation that respects the family's design intent.
//
// Each variant gets a small per-name SALT on top of the family transform so
// that multiple members of the same duplicate group don't all shift by the
// identical amount (which would leave them fingerprint-identical again).
// The salt encodes the variant name into a tiny hue + L nudge that's
// deterministic (same name → same salt) but distinct across variants.
//
// - calm:  bg darkens slightly, primary/secondary keep chalky feel (no chroma bump)
// - hc:    one side lightens hard (already extreme, can go harder); chroma bump OK
// - mono:  bg shifts (lighter or darker depending on dark mode), keeps mono identity
// - dark:  lighten everything a touch — escapes near-black collision zone
// - light: darken everything a touch + tiny chroma bump
function variantSalt(variantName) {
  // Simple hash → deterministic per-variant offsets.
  // Kept small so the aesthetic stays recognisable.
  let h = 0;
  for (let i = 0; i < variantName.length; i++) {
    h = ((h << 5) - h + variantName.charCodeAt(i)) | 0;
  }
  const hAbs = Math.abs(h);
  // dL in ±0.04 range, dH in ±18° range
  const dL = ((hAbs % 81) - 40) / 1000;       // −0.040..+0.040
  const dH = ((hAbs >> 7) % 37) - 18;          // −18..+18 degrees
  return { dL, dH };
}

function familyAwareDisambiguate(css, variantName) {
  const isCalm = variantName.includes('calm'); // matches 'calm' AND 'cloudcalm' AND 'softcalm'
  const isHC = variantName.includes('-hc');
  const isMono = variantName.includes('-mono-') || variantName.startsWith('mono-');
  const isDark = variantName.includes('-dark');

  const { dL: saltL, dH: saltH } = variantSalt(variantName);

  // CALM: chalky-preserving. Only the near-bg surface lightness shifts per
  // variant (so cards have distinguishable backgrounds). Scale tokens keep
  // their hue EXACTLY — applying saltH to low-chroma hexes at varied L causes
  // hue drift because gamut-clamping at extreme L loses hue precision, and
  // a uniform saltH produces different final hues when starting hues aren't
  // perfectly aligned. Leaving scales untouched preserves family coherence.
  if (isCalm) {
    return transformAllHexes(css, (l, c, h) => {
      if (!isDark && l > 0.85) return [l - 0.08 + saltL, c, h + saltH];
      if (isDark && l < 0.20) return [l + 0.08 + saltL, c, h + saltH];
      return [l, c, h]; // scales untouched — avoid per-position hue drift
    });
  }
  // HC: push harder — ±0.15 (was ±0.10), chroma +0.05 (was +0.04)
  if (isHC) {
    const dL = isDark ? +0.15 : -0.15;
    return transformAllHexes(css, (l, c, h) => [l + dL + saltL, c + (c > 0.02 ? 0.05 : 0), h + saltH]);
  }
  // MONO: ±0.15 bg shift (was ±0.10)
  if (isMono) {
    const dL = isDark ? -0.15 : +0.15;
    return transformAllHexes(css, (l, c, h) => [l + dL + saltL, c, h + saltH]);
  }
  // STANDARD DARK: lighten 0.10 (was 0.06) + salt + small chroma bump
  if (isDark) {
    return transformAllHexes(css, (l, c, h) => [l + 0.10 + saltL, c + (c > 0.02 ? 0.03 : 0), h + saltH]);
  }
  // STANDARD LIGHT: darken 0.10 (was 0.06) + salt + small chroma bump
  return transformAllHexes(css, (l, c, h) => [l - 0.10 + saltL, c + (c > 0.02 ? 0.03 : 0), h + saltH]);
}

// (buildSwapForNewBg removed — bg no longer rotates with scale families.
//  Family rotation happens at token-prefix level via applyFamilyRotations;
//  bg retint happens via retintBgSurfaces.)

// Apply a family-rotation swap by renaming token prefixes.
// Bg stays put — only primary/secondary/neutral/text families rotate.
// Every family has the same 5-slot shape (tint/mid/base/emphasis/contrast),
// so renaming ALL tokens of one family to another preserves scale coherence.
//
//   rotation: { from: 'primary', to: 'secondary' }  → all --primary-* become --secondary-*
//
// To swap two families (primary ↔ secondary), rename both pairs via a temp prefix
// so they don't overwrite each other.
function applyFamilyRotations(css, rotations) {
  if (!rotations || rotations.length === 0) return css;
  let out = css;
  // First pass: rename sources to temp prefixes
  const temps = rotations.map((r, i) => ({ ...r, temp: `__swap${i}__` }));
  for (const { from, temp } of temps) {
    const re = new RegExp(`--${from}-`, 'g');
    out = out.replace(re, `--${temp}-`);
  }
  // Second pass: temp prefixes become their targets
  for (const { to, temp } of temps) {
    const re = new RegExp(`--${temp}-`, 'g');
    out = out.replace(re, `--${to}-`);
  }
  return out;
}

// Retint the 4 bg surface tokens at a new hue, preserving each surface's
// L and C from its original value. Returns updated CSS.
// The four bg tokens are a derived "surface group" — they share a hue but
// have deliberately different lightness (page-bg vs raised vs sunken vs
// overlay) to create depth. Retinting = change hue only, keep the L depth
// pattern.
function retintBgSurfaces(css, newHue) {
  const surfaces = ['page-bg', 'page-bg-raised', 'page-bg-sunken', 'page-bg-overlay'];
  let out = css;
  for (const name of surfaces) {
    const re = new RegExp('(--' + name + ':\\s*)(#[0-9a-fA-F]+)');
    out = out.replace(re, (_match, prefix, hex) => {
      const [L, C] = chroma(hex).oklch();
      const newHex = chroma.oklch(L, C || 0, newHue).hex();
      return prefix + newHex;
    });
  }
  return out;
}

// Recompute --focus-color and --highlight-link-color against the CURRENT
// page-bg + page-bg-raised in the CSS. Run after any bg shift so the focus
// indicator keeps its high-contrast guarantee against the new surface.
//
// Rule: preserve existing hue (the generator's gap-split picked a hue that
// sits between primary and secondary — keep that), nudge L only until
// contrast against both page-bg and page-bg-raised clears the target
// (4.5:1 non-HC, 7:1 HC).
//
// Also updates --focus-bg to match the current page-bg (it's a mirror).
function recomputeFocusHighlight(css, isHC) {
  const pageBgHex = getToken(css, 'page-bg');
  const cardBgHex = getToken(css, 'page-bg-raised');
  if (!pageBgHex) return css;

  const minRatio = isHC ? 7 : 4.5;

  // Nudge a colour's L (preserving hue and chroma) until it clears minRatio
  // against both pageBg and cardBg. Direction: lift if bg is light, darken
  // if bg is dark.
  const bgIsLight = chroma(pageBgHex).luminance() > 0.5;
  function nudgeForContrast(hex) {
    const [L, C, H] = chroma(hex).oklch();
    const hue = Number.isFinite(H) ? H : 0;
    const chr = C || 0;
    let newL = L;
    for (let i = 0; i < 40; i++) {
      const candidate = chroma.oklch(
        Math.max(0.05, Math.min(0.95, newL)),
        chr,
        hue
      ).hex();
      const c1 = contrastRatio(candidate, pageBgHex);
      const c2 = contrastRatio(candidate, cardBgHex || pageBgHex);
      if (c1 >= minRatio && c2 >= minRatio) return candidate;
      newL += bgIsLight ? -0.02 : +0.02;
    }
    // Best-effort: hardest direction hit the clamp
    return chroma.oklch(
      Math.max(0.05, Math.min(0.95, newL)),
      chr,
      hue
    ).hex();
  }

  let out = css;

  // --focus-color: nudge existing hex
  out = out.replace(
    /(--focus-color:\s*)(#[0-9a-fA-F]+)/,
    (_m, prefix, hex) => prefix + nudgeForContrast(hex)
  );

  // --highlight-link-color: same treatment
  out = out.replace(
    /(--highlight-link-color:\s*)(#[0-9a-fA-F]+)/,
    (_m, prefix, hex) => prefix + nudgeForContrast(hex)
  );

  // --focus-bg mirrors page-bg exactly
  out = out.replace(
    /(--focus-bg:\s*)#[0-9a-fA-F]+/,
    `$1${pageBgHex}`
  );

  return out;
}

// Role-swap: rotate token FAMILIES (primary ↔ secondary ↔ neutral ↔ text)
// at the token-prefix level so ALL 5 positions per family swap atomically.
// Bg does NOT rotate with a family (different shape: 4 surfaces vs 5 scale
// positions). Bg can be RETINTED to a different family's hue as an optional
// extra move.
//
// Scoring: pick the rotation (+ optional bg retint) that maximises ΔE from
// the canonical sibling, keeping the variant visually distinct.
function applyRoleSwap(css, canonicalCss = null, _variantName = '') {
  const bg = getToken(css, 'page-bg');
  const pBase = getToken(css, 'primary-base');
  const sBase = getToken(css, 'secondary-base');
  const nBase = getToken(css, 'neutral-base');
  const tBase = getToken(css, 'text-emphasis');
  if (!bg || !pBase || !sBase) return css;

  // Each candidate rotation is a list of {from, to} family renames (swap is
  // a pair of renames). Identity (no rotation) is the zero-change baseline.
  const rotationOptions = [
    { name: 'identity', rotations: [] },
    { name: 'primary↔secondary', rotations: [{ from: 'primary', to: 'secondary' }, { from: 'secondary', to: 'primary' }] },
    { name: 'primary↔neutral',   rotations: [{ from: 'primary', to: 'neutral' },   { from: 'neutral',   to: 'primary' }] },
    { name: 'primary↔text',      rotations: [{ from: 'primary', to: 'text' },      { from: 'text',      to: 'primary' }] },
    { name: 'secondary↔neutral', rotations: [{ from: 'secondary', to: 'neutral' }, { from: 'neutral',   to: 'secondary' }] },
    { name: 'secondary↔text',    rotations: [{ from: 'secondary', to: 'text' },    { from: 'text',      to: 'secondary' }] },
    { name: 'neutral↔text',      rotations: [{ from: 'neutral',   to: 'text' },    { from: 'text',      to: 'neutral' }] },
  ];

  // Bg retint options: keep bg's current hue, or adopt one of the family base hues.
  const primaryHue = pBase ? (chroma(pBase).get('oklch.h') || 0) : null;
  const secondaryHue = sBase ? (chroma(sBase).get('oklch.h') || 0) : null;
  const neutralHue = nBase ? (chroma(nBase).get('oklch.h') || 0) : null;
  const textHue = tBase ? (chroma(tBase).get('oklch.h') || 0) : null;
  const bgHue = chroma(bg).get('oklch.h') || 0;
  const retintOptions = [
    { name: 'bg-keep',      newHue: null },           // no retint
    { name: 'bg-to-primary',   newHue: primaryHue },
    { name: 'bg-to-secondary', newHue: secondaryHue },
    { name: 'bg-to-neutral',   newHue: neutralHue },
    { name: 'bg-to-text',      newHue: textHue },
  ].filter(o => o.newHue === null || Number.isFinite(o.newHue));

  // Parse canonical for scoring
  let cBg = null, cPrim = null, cSec = null, cText = null;
  if (canonicalCss) {
    cBg = getToken(canonicalCss, 'page-bg');
    cPrim = getToken(canonicalCss, 'primary-base');
    cSec = getToken(canonicalCss, 'secondary-base');
    cText = getToken(canonicalCss, 'text-emphasis');
  }

  // Read the current base hexes for each family (for scoring)
  const currentHexes = { bg, 'primary-base': pBase, 'secondary-base': sBase, 'neutral-base': nBase, 'text-emphasis': tBase };

  // Score a candidate (rotation + retint) by its perceptual distance from canonical.
  function scoreCandidate(rotations, newBgHue) {
    if (!canonicalCss) return 0;
    // Apply rotations to the token-name → hex map
    const rotated = { ...currentHexes };
    const baseTokens = ['primary-base', 'secondary-base', 'neutral-base', 'text-emphasis'];
    const newMap = {};
    for (const t of baseTokens) {
      // Start with identity — overwritten below by the rotation pairs
      newMap[t] = rotated[t];
    }
    // Identity-map via swap: token 'primary-base' now holds what 'secondary-base' had, etc.
    for (const { from, to } of rotations) {
      // After "from → to", the 'to-*' tokens should hold what 'from-*' had
      const fromKey = from === 'text' ? 'text-emphasis' : `${from}-base`;
      const toKey = to === 'text' ? 'text-emphasis' : `${to}-base`;
      newMap[toKey] = currentHexes[fromKey];
    }
    // Apply bg retint to newMap.bg
    let newBg = bg;
    if (newBgHue !== null) {
      const [L, C] = chroma(bg).oklch();
      newBg = chroma.oklch(L, C || 0, newBgHue).hex();
    }
    newMap.bg = newBg;
    // Distance: ΔE sum from canonical
    let total = 0;
    const pairs = [
      [newMap.bg, cBg],
      [newMap['primary-base'], cPrim],
      [newMap['secondary-base'], cSec],
      [newMap['text-emphasis'], cText],
    ];
    for (const [a, b] of pairs) {
      if (!a || !b) continue;
      try { total += chroma.deltaE(a, b); } catch (e) { /* skip */ }
    }
    return total;
  }

  // Readability check for a candidate — must keep text readable vs bg.
  function isReadable(rotations, newBgHue) {
    // Apply rotations and bg retint, check contrast.
    const newMap = { bg };
    for (const { from, to } of rotations) {
      const fromKey = from === 'text' ? 'text-emphasis' : `${from}-base`;
      const toKey = to === 'text' ? 'text-emphasis' : `${to}-base`;
      newMap[toKey] = currentHexes[fromKey];
    }
    // Fill anything not rotated with current values
    for (const t of ['primary-base', 'secondary-base', 'neutral-base', 'text-emphasis']) {
      if (newMap[t] === undefined) newMap[t] = currentHexes[t];
    }
    if (newBgHue !== null) {
      const [L, C] = chroma(bg).oklch();
      newMap.bg = chroma.oklch(L, C || 0, newBgHue).hex();
    }
    if (newMap['text-emphasis'] && contrastRatio(newMap['text-emphasis'], newMap.bg) < 4.5) return false;
    if (newMap['primary-base']  && contrastRatio(newMap['primary-base'],  newMap.bg) < 3)   return false;
    return true;
  }

  // Enumerate all (rotation × retint) combinations, score, pick max.
  let best = { rotations: [], newBgHue: null, score: -1 };
  for (const rot of rotationOptions) {
    for (const rt of retintOptions) {
      if (!isReadable(rot.rotations, rt.newHue)) continue;
      const score = scoreCandidate(rot.rotations, rt.newHue);
      if (score > best.score) best = { rotations: rot.rotations, newBgHue: rt.newHue, score };
    }
  }

  if (best.score < 0) return css; // nothing viable (shouldn't happen — identity passes readability)

  let out = applyFamilyRotations(css, best.rotations);
  if (best.newBgHue !== null && Math.abs(best.newBgHue - bgHue) > 2) {
    out = retintBgSurfaces(out, best.newBgHue);
    // Focus/highlight were computed against the ORIGINAL bg; re-nudge them
    // against the new bg so contrast guarantees hold.
    const isHC = _variantName.includes('-hc');
    out = recomputeFocusHighlight(out, isHC);
  }
  return out;
}

// Cross-variant duplication: two variants PERCEPTUALLY identical on the 4
// canonical card tokens (page-bg, text-emphasis, primary-base, secondary-base).
//
// Strict definition: two themes are duplicates when ALL FOUR token pairs
// are within DISTINCTNESS_DE of each other. One clearly-different token is
// enough to keep them distinct.
//
// This replaces hex-string fingerprinting — two themes with `#d0c599` and
// `#d9c199` for the same token differ by 1 byte but ΔE ~2, i.e. visually
// identical. The byte check missed that; the perceptual check catches it.
//
// Uses the shared DISTINCTNESS_DE constant (from cvd.js), same threshold
// used throughout the engine for "perceptibly distinct" judgements.
//
// Complexity: O(n²) per brand — 4 deltaE calls per pair. For ~140 variants
// that's ~40k deltaE calls, ~200ms. Acceptable at current scale; worth
// revisiting if the catalogue grows past ~500 themes.

function pairIsPerceptuallyEqual(a, b) {
  const pairs = [
    [a.bg, b.bg],
    [a.textEmphasis, b.textEmphasis],
    [a.primary, b.primary],
    [a.secondary, b.secondary],
  ];
  for (const [x, y] of pairs) {
    if (!x || !y) return false;
    let de;
    try { de = chroma.deltaE(x, y); } catch (e) { return false; }
    if (de >= DISTINCTNESS_DE) return false; // any one pair distinct = not duplicates
  }
  return true;
}

function findVariantDuplicates(parsedThemes) {
  const entries = Object.entries(parsedThemes);
  // Union-find grouping: merge two themes into the same group when all 4
  // canonical tokens are within DISTINCTNESS_DE of each other.
  const parent = {};
  const find = (x) => {
    if (parent[x] === undefined) parent[x] = x;
    if (parent[x] === x) return x;
    return parent[x] = find(parent[x]);
  };
  const union = (a, b) => {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  for (const [n] of entries) parent[n] = n;

  // Partition key: dedup only groups variants within the same axis slice.
  // HC and non-HC are structurally different themes (different L/C tables)
  // and should never dedup against each other — if they LOOK similar, that's
  // a generator issue to tune, not something dedup should paper over by
  // shifting one "off" the other. Same logic for luminance (dark vs light).
  //
  // Key = base-theme-name + luminance + hc-flag.
  // CVD variants share the key with their parent (protan/deutan/tritan
  // CAN be rotated off their same-axis base).
  function partitionKey(variantName) {
    // Strip cvd suffix (-protan / -deutan / -tritan) — CVD variants live in
    // the same partition as their non-CVD sibling.
    const base = variantName.replace(/-(protan|deutan|tritan)$/, '');
    return base;
  }

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [a, themeA] = entries[i];
      const [b, themeB] = entries[j];
      // Skip cross-partition pairs — HC/non-HC never dedup against each other.
      if (partitionKey(a) !== partitionKey(b)) continue;
      if (pairIsPerceptuallyEqual(themeA, themeB)) union(a, b);
    }
  }

  // Collect groups with ≥2 members
  const groups = {};
  for (const [n] of entries) {
    const root = find(n);
    if (!groups[root]) groups[root] = [];
    groups[root].push(n);
  }
  return Object.entries(groups)
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
          // Apply BOTH mechanisms on top of each other:
          //  - role-swap: rotates the 4 tokens through new positions (same
          //    palette, different hierarchy)
          //  - family-shift: small per-variant L/C/hue nudge so the bg and
          //    scales differ from sibling variants of the same theme
          //
          // Role-swap is tried first. If it produces no change (narrow palette
          // with no valid rotation), family-shift alone handles it. If role-swap
          // succeeded, family-shift runs on top to make the bg also distinct
          // from the canonical sibling, so cards don't share identical bg.
          let newCss = applyRoleSwap(css, canonicalCss, dupName);
          const swapChanged = newCss !== css;
          newCss = familyAwareDisambiguate(newCss, dupName);
          // If neither changed anything, fall back to aggressive family-shift
          if (newCss === css && !swapChanged) {
            newCss = familyAwareDisambiguate(css, dupName);
          }
          // Bg may have shifted via family-aware transform — recompute
          // focus/highlight against the current bg to keep contrast.
          if (newCss !== css) {
            const isHC = dupName.includes('-hc');
            newCss = recomputeFocusHighlight(newCss, isHC);
          }
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
    // Re-detect duplicates for next pass — swaps may have produced new
    // collisions, OR swap attempts may have bailed (unreadable text etc).
    // Counter still advances so the next pass tries a different strategy.
    for (const [brandKey, themes] of Object.entries(parsedThemesByBrand)) {
      const dupes = findVariantDuplicates(themes);
      variantDuplicates[brandKey] = dupes;
    }
    // True convergence: no duplicates left at all
    const totalDupes = Object.values(variantDuplicates).reduce((sum, g) => sum + g.length, 0);
    if (totalDupes === 0) break;
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
