/**
 * Gradient catalogue — single source of truth for all gradients.
 *
 * RECIPES define the shape of a gradient (stops + interpolation).
 * COLOUR LISTS are the inputs each recipe is applied to.
 *
 * The build script (scripts/build-gradients.mjs) reads this file and
 * generates two outputs:
 *   - src/components/atoms/SvgGradientDefs.astro  (for SVG-rendered shapes)
 *   - src/styles/global/gradient-generated.css     (for CSS-rendered shapes)
 *
 * Both outputs use the same stops, so SVG and CSS render identically.
 *
 * To add a new gradient:
 *   - Same shape as an existing recipe? add a colour to one of the lists.
 *   - New shape? add a recipe.
 *
 * Then run: npm run build:gradients
 */

// ────────────────────────────────────────────────────────────────────
// RECIPES — define the stop pattern for each gradient style
// ────────────────────────────────────────────────────────────────────

export type Stop = { offset: number; token: string; opacity?: number };
export type Recipe = {
  id: string;
  type: 'linear' | 'radial';
  /** Build the stops list for a single colour. `c` = colour key like 'primary' or 'rainbow-1'. */
  stops: (c: string) => Stop[];
};

/**
 * Recipe 1 — Tier 3-stop (default linear gradient).
 * emphasis 0% → base 50% → tint 100%
 * Used for: primary, secondary, neutral, rainbow-1..7
 */
export const tier3Stop: Recipe = {
  id: 'tier-3-stop',
  type: 'linear',
  stops: (c) => [
    { offset: 0,   token: tierToken(c, 'emphasis') },
    { offset: 50,  token: tierToken(c, 'base') },
    { offset: 100, token: tierToken(c, 'tint') },
  ],
};

/**
 * Recipe 2 — Tier 4-stop (preset variants — tint, mid, base, emphasis presets).
 * Each preset is a different stop arrangement.
 */
export const tierPresets: Record<string, Recipe> = {
  tint: {
    id: 'preset-tint',
    type: 'linear',
    stops: (c) => [
      { offset: 0,   token: tierToken(c, 'mid') },
      { offset: 60,  token: tierToken(c, 'tint') },
      { offset: 100, token: '--color-White' },
    ],
  },
  mid: {
    id: 'preset-mid',
    type: 'linear',
    stops: (c) => [
      { offset: 0,   token: tierToken(c, 'emphasis') },
      { offset: 35,  token: tierToken(c, 'base') },
      { offset: 65,  token: tierToken(c, 'mid') },
      { offset: 100, token: tierToken(c, 'tint') },
    ],
  },
  base: {
    id: 'preset-base',
    type: 'linear',
    stops: (c) => [
      { offset: 0,   token: tierToken(c, 'tint') },
      { offset: 30,  token: tierToken(c, 'mid') },
      { offset: 60,  token: tierToken(c, 'base') },
      { offset: 100, token: tierToken(c, 'emphasis') },
    ],
  },
  emphasis: {
    id: 'preset-emphasis',
    type: 'linear',
    stops: (c) => [
      { offset: 0,   token: tierToken(c, 'base') },
      { offset: 60,  token: tierToken(c, 'emphasis') },
      { offset: 100, token: '--color-Black' },
    ],
  },
};

/**
 * Recipe 3 — Two-colour blends (mixed gradients between two brand colours).
 * Each blend has a hand-tuned stop arrangement and angle.
 */
export type TwoColourBlend = {
  id: string;
  angle: number;
  stops: { offset: number; token: string }[];
};
export const twoColourBlends: TwoColourBlend[] = [
  {
    id: 'hero',
    angle: 135,
    stops: [
      { offset: 0,   token: '--primary-base' },
      { offset: 100, token: '--secondary-base' },
    ],
  },
  {
    id: 'sunset',
    angle: 45,
    stops: [
      { offset: 5,  token: '--primary-emphasis' },
      { offset: 95, token: '--secondary-emphasis' },
    ],
  },
  {
    id: 'brand-emerge',
    angle: 135,
    stops: [
      { offset: 5,  token: '--primary-tint' },
      { offset: 95, token: '--secondary-emphasis' },
    ],
  },
  {
    id: 'brand-fade',
    angle: 135,
    stops: [
      { offset: 5,  token: '--primary-emphasis' },
      { offset: 95, token: '--secondary-tint' },
    ],
  },
];

/**
 * Recipe 4 — Full rainbow stripe (one-off, all 7 rainbow tokens).
 */
export const fullRainbow = {
  id: 'rainbow',
  angle: 90,
  stops: [
    { offset: 0,   token: '--rainbow-1' },
    { offset: 25,  token: '--rainbow-3' },
    { offset: 50,  token: '--rainbow-4' },
    { offset: 75,  token: '--rainbow-5' },
    { offset: 100, token: '--rainbow-7' },
  ],
};

/**
 * Recipe 5 — Transparency modifiers (emerge, fade).
 * Use currentColor + alpha so they work on any colour without per-colour defs.
 * These are CSS masks, not background gradients — applied via a separate mechanism.
 */
export const transparencyModifiers = [
  {
    id: 'emerge',
    /** Strong fade: half transparent, half solid. */
    stops: [
      { offset: 0,   opacity: 0 },
      { offset: 30,  opacity: 0 },
      { offset: 100, opacity: 1 },
    ],
  },
  {
    id: 'fade',
    /** Soft fade: solid most of the way, transparent at the trailing 25%. */
    stops: [
      { offset: 0,   opacity: 0 },
      { offset: 25,  opacity: 0 },
      { offset: 100, opacity: 1 },
    ],
  },
];

// ────────────────────────────────────────────────────────────────────
// COLOUR LISTS — what colours each recipe is applied to
// ────────────────────────────────────────────────────────────────────

/** Brand colours — primary/secondary/neutral. Tokens follow pattern `--{name}-{tier}`. */
export const brandColours = ['primary', 'secondary', 'neutral'] as const;

/** Rainbow positional names — 7 colours. Tokens follow pattern `--rainbow-{N}-{tier}`. */
export const rainbowColours = [
  'rainbow-1', 'rainbow-2', 'rainbow-3', 'rainbow-4',
  'rainbow-5', 'rainbow-6', 'rainbow-7',
] as const;

/** Every colour the tier recipes are applied to. */
export const allTierColours = [...brandColours, ...rainbowColours] as const;

// ────────────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────────────

/**
 * Resolve a tier token name for a colour.
 *   tierToken('primary',   'tint')  → '--primary-tint'
 *   tierToken('primary',   'base')  → '--primary-base'
 *   tierToken('rainbow-1', 'base')  → '--rainbow-1'         (NOTE: base is unsuffixed for rainbows)
 *   tierToken('rainbow-1', 'tint')  → '--rainbow-1-tint'
 */
export function tierToken(colour: string, tier: 'tint' | 'mid' | 'base' | 'emphasis'): string {
  if (colour.startsWith('rainbow-')) {
    return tier === 'base' ? `--${colour}` : `--${colour}-${tier}`;
  }
  return `--${colour}-${tier}`;
}

// ────────────────────────────────────────────────────────────────────
// CATALOGUE — the full list of gradients to generate
// ────────────────────────────────────────────────────────────────────

export type CatalogueEntry = {
  /** Unique gradient id. SVG def becomes `grad-{id}`, CSS rule becomes `.gradient--blend-{id}` (or similar). */
  id: string;
  type: 'linear' | 'radial';
  /** Default angle in degrees. Direction modifiers can override at runtime via --_grad-angle. */
  angle: number;
  stops: Stop[];
};

/** Build the full catalogue by applying every recipe to its colour list. */
export function buildCatalogue(): CatalogueEntry[] {
  const out: CatalogueEntry[] = [];

  // Tier 3-stop default for every brand + rainbow colour
  for (const colour of allTierColours) {
    out.push({
      id: colour,
      type: 'linear',
      angle: 135,
      stops: tier3Stop.stops(colour),
    });
  }

  // Radial version of tier 3-stop for every colour
  for (const colour of allTierColours) {
    out.push({
      id: `${colour}-radial`,
      type: 'radial',
      angle: 0,
      stops: tier3Stop.stops(colour),
    });
  }

  // Tier presets (4 presets × every colour)
  for (const [presetName, recipe] of Object.entries(tierPresets)) {
    for (const colour of allTierColours) {
      out.push({
        id: `${colour}-preset-${presetName}`,
        type: 'linear',
        angle: 135,
        stops: recipe.stops(colour),
      });
    }
  }

  // Two-colour blends (hero, sunset, brand-emerge, brand-fade)
  for (const blend of twoColourBlends) {
    out.push({
      id: blend.id,
      type: 'linear',
      angle: blend.angle,
      stops: blend.stops,
    });
  }

  // Full rainbow stripe
  out.push({
    id: fullRainbow.id,
    type: 'linear',
    angle: fullRainbow.angle,
    stops: fullRainbow.stops,
  });

  return out;
}
