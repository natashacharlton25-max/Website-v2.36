#!/usr/bin/env node
/**
 * Generates SVG gradient defs and CSS gradient rules from the single
 * source of truth: src/lib/gradient-catalogue.ts
 *
 * Outputs:
 *   src/components/atoms/SvgGradientDefs.astro
 *   src/styles/global/gradient-generated.css
 *
 * Run after editing the catalogue:
 *   npm run build:gradients
 *
 * The .css and .astro outputs are checked into git so dev/preview/build
 * all use the same files. No runtime cost.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Dynamic import the TS catalogue. We use tsx-style runtime via tsBlank or eval the .ts source
// since this script is a plain .mjs. Easiest path: parse the relevant data by importing
// a parallel .mjs mirror, OR use a regex / eval. We'll use a small inline shim that
// re-defines the catalogue in JS form so we don't need a TS runtime in the build script.

// To keep this simple and avoid TS-runtime dependencies, we duplicate the recipe shape
// inline here and read the SAME data structure. The catalogue logic stays in the .ts
// file as the source of truth for app-side imports; this script mirrors it.

// ────────────────────────────────────────────────────────────────────
// CATALOGUE (mirror of gradient-catalogue.ts) — kept in sync manually
// ────────────────────────────────────────────────────────────────────

const brandColours = ['primary', 'secondary', 'neutral'];
const rainbowColours = ['rainbow-1', 'rainbow-2', 'rainbow-3', 'rainbow-4', 'rainbow-5', 'rainbow-6', 'rainbow-7'];
const allTierColours = [...brandColours, ...rainbowColours];

function tierToken(colour, tier) {
  if (colour.startsWith('rainbow-')) {
    return tier === 'base' ? `--${colour}` : `--${colour}-${tier}`;
  }
  return `--${colour}-${tier}`;
}

const tier3Stop = (c) => [
  { offset: 0,   token: tierToken(c, 'emphasis') },
  { offset: 100, token: tierToken(c, 'tint') },
];

const tierPresets = {
  tint: (c) => [
    { offset: 0,   token: tierToken(c, 'mid') },
    { offset: 60,  token: tierToken(c, 'tint') },
    { offset: 100, token: '--color-White' },
  ],
  mid: (c) => [
    { offset: 0,   token: tierToken(c, 'tint') },
    { offset: 50,  token: tierToken(c, 'mid') },
    { offset: 100, token: tierToken(c, 'base') },
  ],
  base: (c) => [
    { offset: 0,   token: tierToken(c, 'tint') },
    { offset: 30,  token: tierToken(c, 'mid') },
    { offset: 60,  token: tierToken(c, 'base') },
    { offset: 100, token: tierToken(c, 'emphasis') },
  ],
  emphasis: (c) => [
    { offset: 0,   token: tierToken(c, 'emphasis') },
    { offset: 100, token: '--color-Black' },
  ],
};

const twoColourBlends = [
  { id: 'hero',         angle: 135, stops: [{ offset: 0,   token: '--primary-base' },     { offset: 100, token: '--secondary-base' }] },
  { id: 'sunset',       angle: 45,  stops: [{ offset: 5,   token: '--primary-emphasis' }, { offset: 95,  token: '--secondary-emphasis' }] },
  { id: 'brand-emerge', angle: 135, stops: [{ offset: 5,   token: '--primary-tint' },     { offset: 95,  token: '--secondary-emphasis' }] },
  { id: 'brand-fade',   angle: 135, stops: [{ offset: 5,   token: '--primary-emphasis' }, { offset: 95,  token: '--secondary-tint' }] },
];

const fullRainbow = {
  id: 'rainbow',
  angle: 90,
  stops: [
    { offset: 0,   token: '--rainbow-1' },
    { offset: 15,  token: '--rainbow-3' },
    { offset: 50,  token: '--rainbow-4' },
    { offset: 75,  token: '--rainbow-5' },
    { offset: 100, token: '--rainbow-7' },
  ],
};

function buildCatalogue() {
  const out = [];

  // Tier 3-stop linear (default) for every colour
  for (const colour of allTierColours) {
    out.push({ id: colour, type: 'linear', angle: 135, stops: tier3Stop(colour) });
  }
  // Radial version — stops are untouched here; svgFromEntry compresses the centre for SVG only
  for (const colour of allTierColours) {
    out.push({ id: `${colour}-radial`, type: 'radial', angle: 0, stops: tier3Stop(colour) });
  }
  // Tier presets (4 × every colour) — linear AND radial
  for (const [presetName, fn] of Object.entries(tierPresets)) {
    for (const colour of allTierColours) {
      out.push({ id: `${colour}-preset-${presetName}`,        type: 'linear', angle: 135, stops: fn(colour) });
      out.push({ id: `${colour}-preset-${presetName}-radial`, type: 'radial', angle: 0,   stops: fn(colour) });
    }
  }
  // Two-colour blends — linear AND radial
  for (const blend of twoColourBlends) {
    out.push({ id: blend.id,             type: 'linear', angle: blend.angle, stops: blend.stops });
    out.push({ id: `${blend.id}-radial`, type: 'radial', angle: 0,           stops: blend.stops });
  }
  // Full rainbow — linear AND radial
  out.push({ id: fullRainbow.id,             type: 'linear', angle: fullRainbow.angle, stops: fullRainbow.stops });
  out.push({ id: `${fullRainbow.id}-radial`, type: 'radial', angle: 0,                 stops: fullRainbow.stops });

  // Solo emerge/fade per colour — linear and radial variants.
  // LINEAR emerge/fade both go bg-context → colour (same direction, different hold point):
  //   emerge linear: bg-context holds 0-50% then fades to colour by 100% (strong)
  //   fade linear:   bg-context holds 0-30% then fades to colour by 100% (subtle)
  // RADIAL emerge and fade are INVERSES of each other (centre vs edge):
  //   emerge radial: bg-context centre, colour edge
  //   fade radial:   colour centre, bg-context edge
  for (const colour of allTierColours) {
    const baseToken = tierToken(colour, 'base').replace(/^--/, '');
    const emergeLinear = [
      { offset: 0,   token: 'bg-context' },
      { offset: 50,  token: 'bg-context' },
      { offset: 100, token: baseToken },
    ];
    const fadeLinear = [
      { offset: 0,   token: 'bg-context' },
      { offset: 30,  token: 'bg-context' },
      { offset: 100, token: baseToken },
    ];
    const emergeRadial = [
      { offset: 0,   token: 'bg-context' },
      { offset: 20,  token: 'bg-context' },
      { offset: 100, token: baseToken },
    ];
    const fadeRadial = [
      { offset: 0,   token: baseToken },
      { offset: 15,  token: baseToken },
      { offset: 80,  token: 'bg-context' },
      { offset: 100, token: 'bg-context' },
    ];
    out.push({ id: `emerge-${colour}`,        type: 'linear', angle: 135, stops: emergeLinear });
    out.push({ id: `emerge-${colour}-radial`, type: 'radial', angle: 0,   stops: emergeRadial });
    out.push({ id: `fade-${colour}`,          type: 'linear', angle: 135, stops: fadeLinear });
    out.push({ id: `fade-${colour}-radial`,   type: 'radial', angle: 0,   stops: fadeRadial });
  }

  return out;
}

// Shrink the centre of a radial gradient by compressing the first-half stops into the first 25%.
// Makes the centre "dot" smaller and gives the outer colours more room.
function compressCentre(stops) {
  return stops.map((s, i) => {
    if (i === 0) return s;
    // Remap original offset from [0..100] → [0..25..100] with compression below the old midpoint
    const o = s.offset;
    const newOffset = o <= 50 ? (o / 50) * 25 : 25 + ((o - 50) / 50) * 75;
    return { ...s, offset: newOffset };
  });
}

// For each base gradient, generate emerge / fade combo variants.
// Layout matches the solo modifier proportions in Shape.css/Badge.css so visual sizes align:
//   emerge: bg-context 0% → bg-context 50% → [REVERSED gradient stops in 75..100%]
//   fade:   bg-context 0% → bg-context 30% → [REVERSED gradient stops in 60..100%]
// IMPORTANT: stops are reversed so the LAST colour of the original gradient (usually the lightest)
// sits next to bg-context. This avoids dark colours creating a visible band where the fade ends.
function buildComboVariants(catalogue) {
  const combos = [];
  for (const entry of catalogue) {
    if (entry.type !== 'linear') continue; // skip radials for now
    for (const variant of ['emerge', 'fade']) {
      const holdEnd = variant === 'emerge' ? 50 : 30;
      const gradientStart = variant === 'emerge' ? 75 : 60;
      const range = 100 - gradientStart;
      // Reverse the original stops so the last colour (typically lightest) sits at the
      // bg-context boundary, then compress into [gradientStart..100].
      const reversedStops = [...entry.stops].reverse().map((s) => ({
        offset: 100 - s.offset,
        token: s.token,
      }));
      const compressedStops = reversedStops.map((s) => ({
        offset: gradientStart + (s.offset / 100) * range,
        token: s.token,
      }));
      const stops = [
        { offset: 0, token: 'bg-context' },
        { offset: holdEnd, token: 'bg-context' },
        ...compressedStops,
      ];
      combos.push({
        id: `${entry.id}-${variant}`,
        type: 'linear',
        angle: entry.angle,
        stops,
      });
    }
  }
  return combos;
}

// ────────────────────────────────────────────────────────────────────
// SVG OUTPUT
// ────────────────────────────────────────────────────────────────────

function svgFromEntry(entry) {
  // Linear: x1/y1/x2/y2 derived from angle. Using simplified diagonal mapping.
  // For 135° (default) we want top-left to bottom-right: (0,0) → (1,1).
  // For 45° we want bottom-left to top-right: (0,1) → (1,0).
  // For 90° (horizontal) (0,0.5) → (1,0.5).
  // For 0° (vertical) (0.5,0) → (0.5,1).
  const angle = entry.angle ?? 135;
  let coords;
  if (entry.type === 'radial') {
    // SVG radial gradients use cx/cy/r — handled separately below
    coords = '';
  } else {
    // Convert CSS angle to SVG x1/y1/x2/y2 in objectBoundingBox space (0-1).
    // CSS gradient angle: 0° = "to top", 90° = "to right", 135° = "to bottom-right".
    // The gradient line passes through the centre of the box and the start/end
    // points are where the perpendicular from the corner meets the line —
    // for axis-aligned angles that's centre±0.5, for diagonal it's the corner.
    const rad = ((angle - 90) * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    // Half-diagonal projection: 0.5 for axis-aligned, ~0.707 for 45°/135°
    const t = 0.5 * (Math.abs(cosA) + Math.abs(sinA));
    const dx = cosA * t;
    const dy = sinA * t;
    const x1 = (0.5 - dx).toFixed(3);
    const y1 = (0.5 - dy).toFixed(3);
    const x2 = (0.5 + dx).toFixed(3);
    const y2 = (0.5 + dy).toFixed(3);
    coords = `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"`;
  }

  // Token may be:
  //   '--primary-base'       → `var(--primary-base)`
  //   'primary-base'         → `var(--primary-base)`
  //   'bg-context'           → `var(--_bg-context, var(--page-bg))` — surrounding surface colour
  //   'alpha0:primary-base'  → `oklch(from var(--primary-base) l c h / 0)` — same colour, 0 alpha
  const tokenVar = (t) => {
    if (t === 'bg-context') return 'var(--_bg-context, var(--page-bg))';
    if (t.startsWith('alpha0:')) {
      const inner = t.slice(7);
      const ref = inner.startsWith('--') ? `var(${inner})` : `var(--${inner})`;
      return `oklch(from ${ref} l c h / 0)`;
    }
    if (t.startsWith('--')) return `var(${t})`;
    return `var(--${t})`;
  };

  // Radial gradients get interpolated intermediate stops to smooth sRGB banding (SVG has no oklab).
  // Linear gradients don't need this — they're already smooth enough with the base stops.
  // Radial also gets centre compression so the first colour doesn't dominate (SVG squares show
  // the full gradient extent; CSS circles already clip naturally so they don't need compression).
  const isRadial = entry.type === 'radial';
  const INTERSTOPS = isRadial ? 4 : 0;
  const stopsForSvg = isRadial ? compressCentre(entry.stops) : entry.stops;
  const expandedStops = [];
  for (let i = 0; i < stopsForSvg.length; i++) {
    const s = stopsForSvg[i];
    expandedStops.push({ offset: s.offset, colour: tokenVar(s.token) });
    if (INTERSTOPS > 0 && i < stopsForSvg.length - 1) {
      const next = stopsForSvg[i + 1];
      const a = tokenVar(s.token);
      const b = tokenVar(next.token);
      for (let k = 1; k <= INTERSTOPS; k++) {
        const t = k / (INTERSTOPS + 1);
        const offset = s.offset + (next.offset - s.offset) * t;
        const pct = Math.round(t * 100);
        expandedStops.push({
          offset,
          colour: `color-mix(in oklab, ${a}, ${b} ${pct}%)`,
        });
      }
    }
  }

  const stopsXml = expandedStops
    .map((s) => `        <stop offset="${s.offset.toFixed(2)}%" stop-color="${s.colour}" />`)
    .join('\n');

  if (entry.type === 'radial') {
    return `      <radialGradient id="grad-${entry.id}" cx="0.5" cy="0.5" r="0.5">\n${stopsXml}\n      </radialGradient>`;
  }
  return `      <linearGradient id="grad-${entry.id}" ${coords}>\n${stopsXml}\n      </linearGradient>`;
}

function buildSvgFile(catalogue) {
  const defs = catalogue.map(svgFromEntry).join('\n');

  return `---
/**
 * SvgGradientDefs — GENERATED from src/lib/gradient-catalogue.ts
 *
 * DO NOT EDIT BY HAND. Run \`npm run build:gradients\` to regenerate.
 *
 * Hidden SVG block with all gradient <linearGradient> defs.
 * Include once in the layout. Any SVG on the page can reference via fill="url(#grad-{id})".
 * Stops use CSS custom properties so they adapt to all themes/modes automatically.
 */
---

<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
  <defs>
${defs}
  </defs>
</svg>
`;
}

// ────────────────────────────────────────────────────────────────────
// CSS OUTPUT
// ────────────────────────────────────────────────────────────────────

function cssFromEntry(entry) {
  const tokenVar = (t) => {
    if (t === 'bg-context') return 'var(--_bg-context, var(--page-bg))';
    if (t.startsWith('--')) return `var(${t})`;
    return `var(--${t})`;
  };
  const stopsCss = entry.stops
    .map((s) => `    ${tokenVar(s.token)} ${s.offset}%`)
    .join(',\n');

  // Special-case rainbow-radial → conic gradient (colour wheel effect).
  // Stops are remapped into 0–80% so the last 20% smoothly returns to red, closing the loop.
  if (entry.id === 'rainbow-radial') {
    const conicStops = entry.stops
      .map((s) => `    var(${s.token.startsWith('--') ? s.token : `--${s.token}`}) ${(s.offset * 0.8).toFixed(1)}%`)
      .join(',\n');
    return `.gradient--blend-${entry.id} {
  --_grad-computed: conic-gradient(
    from 0deg at var(--_grad-focus, center) in oklab,
${conicStops},
    var(--rainbow-1) 100%
  );
}`;
  }

  if (entry.type === 'radial') {
    return `.gradient--blend-${entry.id} {
  --_grad-computed: radial-gradient(
    circle at var(--_grad-focus, center) in oklab,
${stopsCss}
  );
}`;
  }


  return `.gradient--blend-${entry.id} {
  --_grad-computed: linear-gradient(
    var(--_grad-angle, ${entry.angle}deg) in oklab,
${stopsCss}
  );
}`;
}

function buildCssFile(catalogue) {
  const rules = catalogue.map(cssFromEntry).join('\n\n');

  return `/**
 * gradient-generated.css — GENERATED from src/lib/gradient-catalogue.ts
 *
 * DO NOT EDIT BY HAND. Run \`npm run build:gradients\` to regenerate.
 *
 * One CSS rule per gradient in the catalogue. Each rule sets --_grad-computed
 * which the global .gradient mixin reads. SVG defs use the same stops via
 * SvgGradientDefs.astro so SVG and CSS render identically.
 */

${rules}
`;
}

// ────────────────────────────────────────────────────────────────────
// RUN
// ────────────────────────────────────────────────────────────────────

const catalogue = buildCatalogue();

const svgPath = path.join(ROOT, 'src/components/atoms/SvgGradientDefs.astro');
const cssPath = path.join(ROOT, 'src/styles/global/gradient-generated.css');

// JSON catalogue for runtime use by atoms (Shape, Icon, Badge, Heading) when they need
// to generate inline SVG gradient defs with dynamic directions.
const jsonPath = path.join(ROOT, 'src/lib/gradient-catalogue.json');
fs.writeFileSync(svgPath, buildSvgFile(catalogue), 'utf8');
fs.writeFileSync(cssPath, buildCssFile(catalogue), 'utf8');
fs.writeFileSync(jsonPath, JSON.stringify(
  catalogue.map((e) => ({ id: e.id, type: e.type, angle: e.angle, stops: e.stops })),
  null,
  2
), 'utf8');

console.log(`✓ Generated ${catalogue.length} gradients`);
console.log(`  → ${path.relative(ROOT, svgPath)}`);
console.log(`  → ${path.relative(ROOT, cssPath)}`);
console.log(`  → ${path.relative(ROOT, jsonPath)}`);
