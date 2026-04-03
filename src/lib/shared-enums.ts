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

// ── Rainbow Colour (7 values) — universal accents, adapted per mode
export const RAINBOW_COLOURS = [
  'red', 'orange', 'yellow', 'teal', 'blue', 'purple', 'pink'
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

// ── Shape (5 values) ───────────────────────────────────
export const SHAPES = [
  'sharp', 'subtle', 'soft', 'rounded', 'pill'
] as const;
export type Shape = typeof SHAPES[number];

// ── Size (3 values) ────────────────────────────────────
export const SIZES = [
  'sm', 'md', 'lg'
] as const;
export type Size = typeof SIZES[number];

// ── Shadow (7 values) ──────────────────────────────────
export const SHADOWS = [
  'none', 'out', 'drop', 'in', 'elevated', 'glow', 'glow-intense'
] as const;
export type Shadow = typeof SHADOWS[number];

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

// ── Icon Weight (7 values) ─────────────────────────────
export const ICON_WEIGHTS = [
  'brand', 'fill', 'duotone', 'regular', 'bold', 'thin', 'light'
] as const;
export type IconWeight = typeof ICON_WEIGHTS[number];


/* ================================================================
   GRADIENT — colour, direction, type, focus, spread
   ================================================================ */

/** Colour gradients — match colour enum, one per colour */
export const GRADIENTS_COLOUR = [
  'primary', 'secondary', 'neutral',
  'red', 'orange', 'yellow', 'teal', 'blue', 'purple', 'pink'
] as const;

/** Mixed gradients — multi-colour blends */
export const GRADIENTS_MIXED = [
  'hero', 'sunset', 'brand-emerge', 'brand-fade'
] as const;

/** Background gradients — section/page fills */
export const GRADIENTS_BACKGROUND = [
  'background-light', 'background-warm', 'background-cool'
] as const;

/** All gradients — colour + mixed + background */
export const GRADIENTS = [
  ...GRADIENTS_COLOUR, ...GRADIENTS_MIXED, ...GRADIENTS_BACKGROUND
] as const;
export type Gradient = typeof GRADIENTS[number];
export type GradientColour = typeof GRADIENTS_COLOUR[number];
export type GradientMixed = typeof GRADIENTS_MIXED[number];

// ── Gradient Direction (8 values) — intent-based, not raw angles
export const GRADIENT_DIRECTIONS = [
  'vertical', 'vertical-reverse',
  'horizontal', 'horizontal-reverse',
  'diagonal', 'diagonal-reverse',
  'diagonal-alt', 'diagonal-alt-reverse'
] as const;
export type GradientDirection = typeof GRADIENT_DIRECTIONS[number];

// ── Gradient Type (2 values) ───────────────────────────
export const GRADIENT_TYPES = [
  'linear', 'radial'
] as const;
export type GradientType = typeof GRADIENT_TYPES[number];

// ── Gradient Focus (9 values) — radial origin ──────────
export const GRADIENT_FOCUSES = [
  'center', 'top', 'bottom', 'left', 'right',
  'top-left', 'top-right', 'bottom-left', 'bottom-right'
] as const;
export type GradientFocus = typeof GRADIENT_FOCUSES[number];

// ── Gradient Spread (3 values) — stop intensity ────────
export const GRADIENT_SPREADS = [
  'soft', 'balanced', 'tight'
] as const;
export type GradientSpread = typeof GRADIENT_SPREADS[number];

// ── Border Gradient (12 values — colour + mixed) ───────
export const BORDER_GRADIENTS = [
  'primary', 'secondary', 'neutral', 'hero', 'sunset',
  'red', 'orange', 'yellow', 'teal', 'blue', 'purple', 'pink'
] as const;
export type BorderGradient = typeof BORDER_GRADIENTS[number];

/*
 * Gradient Rules (canonical — ALL components):
 *   - `animatedGradient: boolean` — every gradient component gets this prop
 *   - Fill: gradient animates background only, text is solid (--color-White/--color-Black)
 *   - Outline: gradient animates border (anim-border-flow), label gets background-clip:text
 *   - Glass: gradient animates background, label gets background-clip:text
 *   - Icon inside gradient component: always solid colour, never gradient
 *   - Gradient text colour: tint/mid → --color-Black, base/emphasis → --color-White
 *   - animatedGradient is INDEPENDENT of animation prop (icon/component motion)
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


/* ================================================================
   CONTENT — semantic role, accessibility
   ================================================================ */

// ── Semantic Role (4 values) ───────────────────────────
export const SEMANTIC_ROLES = [
  'status', 'tag', 'label', 'none'
] as const;
export type SemanticRole = typeof SEMANTIC_ROLES[number];
