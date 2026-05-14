/**
 * Shared Enums — single source of truth
 *
 * Every component schema, validator, and Astro prop type
 * references these arrays. Add a value here = available everywhere.
 *
 * Organised by canonical schema groups: COLOUR → VISUAL → ANIMATION → CONTENT
 *
 * CSS class mapping:
 *   colour  → .badge--red, .icon--red (CSS) + var(--rainbow-1) (token)
 *   gradient → .badge--gradient-red (CSS) + var(--gradient-red) (token)
 *   animation → .anim--spin (CSS) + @keyframes anim-spin (micro-animations.css)
 */


/* ================================================================
   COLOUR — everything about colour selection and intensity
   ================================================================ */

// ── Brand Colour (3 values) — changes per theme ────────
export const BRAND_COLOURS = [
  'primary', 'secondary', 'neutral'
] as const;
export type BrandColour = typeof BRAND_COLOURS[number];

// ── Text Colour — body text scale (snapshot of neutral, never overridden by brand).
// Heading + Text atoms only. Not for backgrounds/borders on other atoms.
// Uses --text-tint/mid/base/emphasis tokens from the theme engine.
export const TEXT_COLOURS = [
  'primary', 'secondary', 'neutral', 'text'
] as const;
export type TextColour = typeof TEXT_COLOURS[number];

// ── Rainbow Colour (7 values) — positional names that match the underlying
// CSS tokens (--rainbow-1 through --rainbow-7). Names are palette-agnostic
// because what "rainbow-1" actually looks like depends on the active palette
// (default ROYGBIV, protan/tritan CVD-safe, mono greyscale, or brand custom).
export const RAINBOW_COLOURS = [
  'rainbow-1', 'rainbow-2', 'rainbow-3', 'rainbow-4',
  'rainbow-5', 'rainbow-6', 'rainbow-7'
] as const;
export type RainbowColour = typeof RAINBOW_COLOURS[number];

// ── All Colours (10 values) — brand + rainbow combined ──
export const COLOURS = [
  ...BRAND_COLOURS, ...RAINBOW_COLOURS
] as const;
export type Colour = typeof COLOURS[number];

// ── Colour Tier (4 values) — maps to semantic tokens ────
export const COLOUR_TIERS = [
  'tint', 'mid', 'base', 'emphasis'
] as const;
export type ColourTier = typeof COLOUR_TIERS[number];


/* ================================================================
   VISUAL — appearance, shape, variant, shadow, typography
   ================================================================ */

// ── Variant (4 values) ─────────────────────────────────
export const VARIANTS = [
  'fill', 'outline', 'glass', 'liquid-glass'
] as const;
export type Variant = typeof VARIANTS[number];

// ── Heading Variant (4 values) ─────────────────────────
export const HEADING_VARIANTS = [
  'default', 'underline', 'highlight', 'minimal'
] as const;
export type HeadingVariant = typeof HEADING_VARIANTS[number];

// ── Shape (5 values) ───────────────────────────────────
export const SHAPES = [
  'sharp', 'subtle', 'soft', 'rounded', 'pill'
] as const;
export type Shape = typeof SHAPES[number];

// ── Size (3 values) ────────────────────────────────────
export const SIZES = [
  'sm', 'md', 'lg', 'xl'
] as const;
export type Size = typeof SIZES[number];

// ── Heading Size (11 values) — includes text sizes for gradient body text ──
export const HEADING_SIZES = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'xs', 'sm', 'base', 'lg', 'xl'
] as const;
export type HeadingSize = typeof HEADING_SIZES[number];

// ── Text Size (5 values) ──────────────────────────────
export const TEXT_SIZES = [
  'xs', 'sm', 'base', 'lg', 'xl'
] as const;
export type TextSize = typeof TEXT_SIZES[number];

// ── Alignment (3 values) ──────────────────────────────
export const ALIGNMENTS = [
  'left', 'center', 'right'
] as const;
export type Alignment = typeof ALIGNMENTS[number];

// ── Tracking (3 values) ──────────────────────────────
export const TRACKINGS = [
  'normal', 'wide', 'wider'
] as const;
export type Tracking = typeof TRACKINGS[number];

// ── Spacing (3 values) ───────────────────────────────
export const SPACINGS = [
  'tight', 'normal', 'loose'
] as const;
export type Spacing = typeof SPACINGS[number];

// ── Highlight Height (4 values) ──────────────────────
export const HIGHLIGHT_HEIGHTS = [
  'sm', 'md', 'lg', 'full'
] as const;
export type HighlightHeight = typeof HIGHLIGHT_HEIGHTS[number];

// ── Highlight Opacity (4 values) ─────────────────────
export const HIGHLIGHT_OPACITIES = [
  'faint', 'soft', 'bold', 'solid'
] as const;
export type HighlightOpacity = typeof HIGHLIGHT_OPACITIES[number];

// ── Divider Position (4 values) ──────────────────────
export const DIVIDER_POSITIONS = [
  'left', 'right', 'both', 'none'
] as const;
export type DividerPosition = typeof DIVIDER_POSITIONS[number];

// ── Divider Ends (2 values) ──────────────────────────
export const DIVIDER_ENDS = [
  'rounded', 'square'
] as const;
export type DividerEnds = typeof DIVIDER_ENDS[number];

// ── Media Position (2 values) ────────────────────────
export const MEDIA_POSITIONS = [
  'left', 'right'
] as const;
export type MediaPosition = typeof MEDIA_POSITIONS[number];

// ── Media Size (4 values) ────────────────────────────
export const MEDIA_SIZES = [
  'sm', 'md', 'lg', 'auto'
] as const;
export type MediaSize = typeof MEDIA_SIZES[number];

// ── Shadow (8 values) — box-shadow on element ──────────
export const SHADOWS = [
  'none', 'out', 'drop', 'in', 'elevated', 'glow', 'glow-intense', 'glow-inner'
] as const;
export type Shadow = typeof SHADOWS[number];

// ── Text Shadow (9 values) — matches Shadow enum + halo for contrast on faded text ─
export const TEXT_SHADOWS = [
  'none', 'out', 'drop', 'in', 'elevated', 'glow', 'glow-intense', 'glow-inner', 'halo'
] as const;
export type TextShadow = typeof TEXT_SHADOWS[number];

// ── Underline Style (4 values) ─────────────────────────
export const UNDERLINE_STYLES = [
  'solid', 'gradient', 'dashed', 'dotted'
] as const;
export type UnderlineStyle = typeof UNDERLINE_STYLES[number];

// ── Underline Gap (3 values) ──────────────────────────
export const UNDERLINE_GAPS = [
  'close', 'default', 'loose'
] as const;
export type UnderlineGap = typeof UNDERLINE_GAPS[number];

// ── Underline Thickness (3 values) ───────────────────
export const UNDERLINE_THICKNESSES = [
  'sm', 'md', 'lg'
] as const;
export type UnderlineThickness = typeof UNDERLINE_THICKNESSES[number];

// ── Border Weight (2 values) ───────────────────────────
export const BORDER_WEIGHTS = [
  'thin', 'thick'
] as const;
export type BorderWeight = typeof BORDER_WEIGHTS[number];

// ── Font Family (5 values) ─────────────────────────────
export const FONT_FAMILIES = [
  'heading', 'body', 'body-alt', 'handwriting', 'mono'
] as const;
export type FontFamily = typeof FONT_FAMILIES[number];

// ── Font Weight (5 values) ─────────────────────────────
export const FONT_WEIGHTS = [
  'normal', 'medium', 'semibold', 'bold', 'extrabold'
] as const;
export type FontWeight = typeof FONT_WEIGHTS[number];

// ── Icon Weight (5 values) ─────────────────────────────
export const ICON_WEIGHTS = [
  'light', 'regular', 'bold', 'fill', 'duotone'
] as const;
export type IconWeight = typeof ICON_WEIGHTS[number];


/* ================================================================
   GRADIENT — colour, direction, type, focus, spread
   ================================================================ */

// ── Gradient Blend (4 values) — mixed two-colour gradients ──
export const GRADIENT_BLENDS = [
  'hero', 'sunset', 'brand-emerge', 'brand-fade',
  'preset-tint', 'preset-mid', 'preset-base', 'preset-emphasis'
] as const;
export type GradientBlend = typeof GRADIENT_BLENDS[number];

// ── Gradient Direction (8 values) — intent-based, not raw angles
export const GRADIENT_DIRECTIONS = [
  'vertical', 'vertical-reverse',
  'horizontal', 'horizontal-reverse',
  'diagonal', 'diagonal-reverse',
  'diagonal-alt', 'diagonal-alt-reverse'
] as const;
export type GradientDirection = typeof GRADIENT_DIRECTIONS[number];

// ── Gradient Type (2 values) — radial only for large elements (Card, Section)
export const GRADIENT_TYPES = [
  'linear', 'radial'
] as const;
export type GradientType = typeof GRADIENT_TYPES[number];

// ── Gradient Focus (9 values) — radial origin, large elements only
// Not available on atoms (Badge, Button, Icon) — radial needs surface area.
export const GRADIENT_FOCUSES = [
  'center', 'top', 'bottom', 'left', 'right',
  'top-left', 'top-right', 'bottom-left', 'bottom-right'
] as const;
export type GradientFocus = typeof GRADIENT_FOCUSES[number];

// Gradient spread removed — superseded by colorTier presets (tint/mid/base/emphasis).
// Border gradient removed — gradient is now boolean + tier tokens

/*
 * Gradient Rules (canonical — ALL components):
 *   - `gradientAnimated: boolean` — every gradient component gets this prop
 *   - Fill: gradient animates background only, text is solid (--color-White/--color-Black)
 *   - Outline: gradient animates border (anim-border-flow), label gets background-clip:text
 *   - Glass: gradient animates background, label gets background-clip:text
 *   - Icon inside gradient component: always solid colour, never gradient
 *   - Gradient text colour: tint/mid → --color-Black, base/emphasis → --color-White
 *   - gradientAnimated is INDEPENDENT of animation prop (icon/component motion)
 */


/* ================================================================
   ANIMATION — motion, triggers
   ================================================================ */

// ── Animation (30 values) ──────────────────────────────
export const ANIMATIONS = [
  // Movement
  'spin', 'bounce', 'shake', 'float', 'drift',
  'slide-up', 'slide-down', 'slide-left', 'slide-right', 'flip',
  // Scale
  'pulse', 'ping', 'pop', 'squish', 'heartbeat', 'rubber-band',
  // Opacity
  'fade', 'blink', 'flash', 'glint', 'shimmer', 'twinkle',
  // Rotation
  'wiggle', 'swing', 'rock', 'nod',
  // Compound
  'attention', 'celebrate', 'enter', 'exit'
] as const;
export type Animation = typeof ANIMATIONS[number];

// ── Animation Trigger (5 values) — non-interactive ─────
export const ANIMATION_TRIGGERS = [
  'viewport', 'autoplay', 'loop', 'interval', 'none'
] as const;
export type AnimationTrigger = typeof ANIMATION_TRIGGERS[number];

// ── Interactive Animation Trigger (8 values) ───────────
export const ANIMATION_TRIGGERS_INTERACTIVE = [
  'hover', 'viewport', 'autoplay', 'loop', 'interval', 'click', 'focus', 'none'
] as const;
export type AnimationTriggerInteractive = typeof ANIMATION_TRIGGERS_INTERACTIVE[number];

// ── Animation Repeat (4 values) ──────────────────────
export const ANIMATION_REPEATS = [
  'once', 'loop', 'three', 'threeloop'
] as const;
export type AnimationRepeat = typeof ANIMATION_REPEATS[number];

// ── Animation Interval (4 values) ────────────────────
// Token names (not seconds) — actual durations live in
// src/lib/animation/config/interval.ts as INTERVAL_TOKENS.
// Used by animationRepeat=threeloop and animationTrigger=interval.
export const ANIMATION_INTERVALS = [
  'short', 'base', 'long', 'longer'
] as const;
export type AnimationInterval = typeof ANIMATION_INTERVALS[number];

// ── Draw Worm Size (5 values) ────────────────────────
// Laser worm segment length as a token. Resolved to a path-percentage at
// runtime by the draw handler (src/lib/animation/svg-animation/draw.ts).
// Used by Icon and Shape when drawLaser is on.
export const DRAW_WORM_SIZES = [
  'xs', 'sm', 'md', 'lg', 'xl'
] as const;
export type DrawWormSize = typeof DRAW_WORM_SIZES[number];


/* ================================================================
   CONTENT — semantic role, accessibility
   ================================================================ */

// ── Semantic Role (4 values) ───────────────────────────
export const SEMANTIC_ROLES = [
  'status', 'tag', 'label', 'none'
] as const;
export type SemanticRole = typeof SEMANTIC_ROLES[number];

// ── Icon Semantic Role (3 values) ──────────────────────
// Used by Icon and LottieIcon — drives ARIA, tabindex, label requirement.
export const ICON_SEMANTIC_ROLES = [
  'decorative', 'ui-control', 'content-symbol'
] as const;
export type IconSemanticRole = typeof ICON_SEMANTIC_ROLES[number];

// ── Shape Semantic Role (4 values) ─────────────────────
// Extends Icon's set with 'background' — the Shape is wallpaper for a child
// atom (the child owns aria/label; Shape stays aria-hidden with no label).
// Used only by Shape because Icon is always a leaf, never a container.
export const SHAPE_SEMANTIC_ROLES = [
  'decorative', 'background', 'ui-control', 'content-symbol'
] as const;
export type ShapeSemanticRole = typeof SHAPE_SEMANTIC_ROLES[number];


/* ================================================================
   SHAPE / ICON SIZES — extended scale up to 8xl
   ================================================================ */

// ── Shape Size (15 values) ─────────────────────────────
// Goes up to 8xl for large hero/scrolly stages
export const SHAPE_SIZES = [
  'xs', 'sm', 'md', 'lg', 'xl',
  '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl'
] as const;
export type ShapeSize = typeof SHAPE_SIZES[number];

// ── Border Weight (Shape) (3 values) ───────────────────
export const SHAPE_BORDER_WEIGHTS = [
  'sm', 'md', 'lg'
] as const;
export type ShapeBorderWeight = typeof SHAPE_BORDER_WEIGHTS[number];


/* ================================================================
   DRAW ANIMATION — variants, modes, stagger, colours
   ================================================================ */

// ── Draw Variant (3 values) ────────────────────────────
export const DRAW_VARIANTS = [
  'draw', 'drawcenter', 'pulse'
] as const;
export type DrawVariant = typeof DRAW_VARIANTS[number];

// ── Draw Mode (5 values) ───────────────────────────────
export const DRAW_MODES = [
  'static', 'yoyo', 'reverse-yoyo', 'reveal'
] as const;
export type DrawMode = typeof DRAW_MODES[number];

// ── Draw Colour (15 values) — brand roles + rainbow tokens + named gradients
// NO TIERS — draw uses solid stroke, tier opacity would break the line
// `normalizeDrawColour()` strips any tier suffix at runtime as a safety net
// Rainbow values use positional names (rainbow-1..7) matching CSS tokens
export const DRAW_COLOURS = [
  'primary', 'secondary', 'neutral',
  'rainbow-1', 'rainbow-2', 'rainbow-3', 'rainbow-4', 'rainbow-5', 'rainbow-6', 'rainbow-7',
  'hero', 'sunset', 'brand-emerge', 'brand-fade', 'rainbow'
] as const;
export type DrawColour = typeof DRAW_COLOURS[number];

/**
 * Strip tier suffixes (-tint, -mid, -emphasis) from a colour string.
 *
 * Used by Icon and Shape draw props (drawColor) so that if an author
 * accidentally passes a tier'd colour like `red-tint`, it gets normalised
 * to just `red`. Tiers are opacity-based and would render the draw stroke
 * partially transparent — the goo morph and stroke draw both need full
 * opacity to read properly.
 */
export function normalizeDrawColour(value: string | undefined): string | undefined {
  if (!value) return value;
  return value.replace(/-(tint|mid|emphasis)$/, '');
}


/* ================================================================
   STAGGER — used by draw, morph, fill animations
   ================================================================ */

// ── Stagger amount (4 values) ──────────────────────────
export const STAGGERS = [
  'none', 'tight', 'normal', 'loose'
] as const;
export type Stagger = typeof STAGGERS[number];

// ── Stagger origin (5 values) ──────────────────────────
export const STAGGER_FROMS = [
  'start', 'center', 'end', 'edges', 'random'
] as const;
export type StaggerFrom = typeof STAGGER_FROMS[number];


/* ================================================================
   MORPH ANIMATION — triggers
   ================================================================ */

// ── Morph Trigger (3 values) ───────────────────────────
export const MORPH_TRIGGERS = [
  'hover', 'viewport', 'scroll'
] as const;
export type MorphTrigger = typeof MORPH_TRIGGERS[number];


/* ================================================================
   FILL ANIMATION — modes, triggers, timing
   ================================================================ */

// ── Fill Mode (6 values) ───────────────────────────────
export const FILL_MODES = [
  'once', 'yoyo', 'static', 'fade', 'ghost', 'ghoststatic', 'twinkle', 'reduced'
] as const;
export type FillMode = typeof FILL_MODES[number];

// ── Fill Trigger (4 values) ────────────────────────────
export const FILL_TRIGGERS = [
  'hover', 'viewport', 'scrub', 'rainbow'
] as const;
export type FillTrigger = typeof FILL_TRIGGERS[number];

// ── Fill Timing (2 values) — relative to draw animation
export const FILL_TIMINGS = [
  'overlap', 'after'
] as const;
export type FillTiming = typeof FILL_TIMINGS[number];

// ── Fill Duration (4 values) — token, resolved to seconds at runtime
// Used by Icon and Shape fillAnimation. Handler in svg-animation/fill.ts
// maps token → seconds. Default 'normal' = 1s baseline; gentle motion mode
// scales separately. Matches the slow|default|fast pattern but uses
// fast|normal|slow|slower for fill since 'default' would clash with
// fillMode=once|yoyo|fade|... vocabulary.
export const FILL_DURATIONS = [
  'fast', 'normal', 'slow', 'slower'
] as const;
export type FillDuration = typeof FILL_DURATIONS[number];


/* ================================================================
   ANIMATED GRADIENT — direction, mode
   ================================================================ */

// ── Gradient Animate Direction (3 values) ──────────────
export const GRADIENT_ANIMATE_DIRECTIONS = [
  'cw', 'ccw', 'sway'
] as const;
export type GradientAnimateDirection = typeof GRADIENT_ANIMATE_DIRECTIONS[number];


/* ================================================================
   BEHAVIOUR — input behaviour and HTML form attributes (WCAG)
   Used by FormField (and future form atoms).
   ================================================================ */

// ── HTML input types (13 values) — what kind of field ────
// Includes 'card-select' (FormField's pictogram-card alternative to radio/checkbox).
export const INPUT_TYPES = [
  'text', 'email', 'textarea', 'checkbox', 'radio', 'toggle', 'search',
  'select', 'number', 'tel', 'url', 'password', 'card-select'
] as const;
export type InputType = typeof INPUT_TYPES[number];

// ── inputmode (8 values) — mobile keyboard hint per WCAG 1.3.5 ──
export const INPUT_MODES = [
  'none', 'text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url'
] as const;
export type InputMode = typeof INPUT_MODES[number];

// ── Check indicator display (3 values) — card-select check style ──
export const CHECK_DISPLAYS = [
  'checkbox', 'radio', 'toggle'
] as const;
export type CheckDisplay = typeof CHECK_DISPLAYS[number];

// ── autocomplete tokens (54 values) — per HTML5 spec, WCAG 1.3.5 ──
// Reference: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
// Browser autofill identifies field purpose for users with cognitive disabilities.
export const AUTOCOMPLETE_TOKENS = [
  'off', 'on',
  // Names
  'name', 'honorific-prefix', 'given-name', 'additional-name', 'family-name',
  'honorific-suffix', 'nickname',
  // Login + auth
  'email', 'username', 'new-password', 'current-password', 'one-time-code',
  // Organisation
  'organization-title', 'organization',
  // Address
  'street-address',
  'address-line1', 'address-line2', 'address-line3',
  'address-level4', 'address-level3', 'address-level2', 'address-level1',
  'country', 'country-name', 'postal-code',
  // Payment
  'cc-name', 'cc-given-name', 'cc-additional-name', 'cc-family-name',
  'cc-number', 'cc-exp', 'cc-exp-month', 'cc-exp-year', 'cc-csc', 'cc-type',
  'transaction-currency', 'transaction-amount',
  // Misc personal
  'language',
  'bday', 'bday-day', 'bday-month', 'bday-year', 'sex',
  // Phone
  'tel', 'tel-country-code', 'tel-national', 'tel-area-code', 'tel-local', 'tel-extension',
  // Other contact
  'impp', 'url', 'photo'
] as const;
export type AutocompleteToken = typeof AUTOCOMPLETE_TOKENS[number];


/* ================================================================
   IDENTITY — patterns for technical identifiers (WCAG 4.1.1)
   ================================================================ */

// ── HTML id / name pattern — kebab-case, leading letter ──
// Matches CSS-safe and HTML-id-safe naming. Used by FormField.id / .name.
export const ID_PATTERN = '^[a-z][a-z0-9-]*$';

