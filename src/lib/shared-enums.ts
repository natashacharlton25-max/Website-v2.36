/**
 * Shared Enums — single source of truth
 *
 * Every component schema, validator, and Astro prop type
 * references these arrays. Add a value here = available everywhere.
 *
 * These match 1:1 with CSS classes and token definitions:
 *   colour  → .badge--red, .icon--red (CSS) + var(--rainbow-1) (token)
 *   gradient → .badge--gradient-red (CSS) + var(--gradient-red) (token)
 *   animation → .anim--spin (CSS) + @keyframes anim-spin (micro-animations.css)
 */

// ── Colour (11 values) ──────────────────────────────────
export const COLOURS = [
  'default', 'primary', 'secondary', 'neutral',
  'red', 'orange', 'yellow', 'teal', 'blue', 'purple', 'pink'
] as const;
export type Colour = typeof COLOURS[number];

// ── Gradient (12 values) ────────────────────────────────
export const GRADIENTS = [
  'primary', 'secondary', 'neutral', 'hero', 'sunset',
  'red', 'orange', 'yellow', 'teal', 'blue', 'purple', 'pink'
] as const;
export type Gradient = typeof GRADIENTS[number];

// ── Animation (30 values) ───────────────────────────────
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

// ── Animation Trigger (5 values) ────────────────────────
export const ANIMATION_TRIGGERS = [
  'viewport', 'autoplay', 'loop', 'interval', 'none'
] as const;
export type AnimationTrigger = typeof ANIMATION_TRIGGERS[number];

// ── Interactive Animation Trigger (8 values — includes hover/click/focus) ──
export const ANIMATION_TRIGGERS_INTERACTIVE = [
  'hover', 'viewport', 'autoplay', 'loop', 'interval', 'click', 'focus', 'none'
] as const;
export type AnimationTriggerInteractive = typeof ANIMATION_TRIGGERS_INTERACTIVE[number];

// ── Icon Weight (7 values) ──────────────────────────────
export const ICON_WEIGHTS = [
  'brand', 'fill', 'duotone', 'regular', 'bold', 'thin', 'light'
] as const;
export type IconWeight = typeof ICON_WEIGHTS[number];

// ── Font Family (5 values) ──────────────────────────────
export const FONT_FAMILIES = [
  'heading', 'body', 'body-alt', 'handwriting', 'mono'
] as const;
export type FontFamily = typeof FONT_FAMILIES[number];

// ── Font Weight (5 values) ──────────────────────────────
export const FONT_WEIGHTS = [
  'normal', 'medium', 'semibold', 'bold', 'extrabold'
] as const;
export type FontWeight = typeof FONT_WEIGHTS[number];

// ── Variant (4 values) ──────────────────────────────────
export const VARIANTS = [
  'fill', 'outline', 'glass', 'liquid-glass'
] as const;
export type Variant = typeof VARIANTS[number];

// ── Shape (5 values) ────────────────────────────────────
export const SHAPES = [
  'sharp', 'subtle', 'soft', 'rounded', 'pill'
] as const;
export type Shape = typeof SHAPES[number];

// ── Shadow (7 values) ───────────────────────────────────
export const SHADOWS = [
  'none', 'out', 'drop', 'in', 'elevated', 'glow', 'glow-intense'
] as const;
export type Shadow = typeof SHADOWS[number];

// ── Size (3 values) ─────────────────────────────────────
export const SIZES = [
  'sm', 'md', 'lg'
] as const;
export type Size = typeof SIZES[number];

// ── Border Weight (2 values) ────────────────────────────
export const BORDER_WEIGHTS = [
  'thin', 'thick'
] as const;
export type BorderWeight = typeof BORDER_WEIGHTS[number];

// ── Border Gradient (12 values — same as gradient) ──────
export const BORDER_GRADIENTS = [
  'primary', 'secondary', 'neutral', 'hero', 'sunset',
  'red', 'orange', 'yellow', 'teal', 'blue', 'purple', 'pink'
] as const;
export type BorderGradient = typeof BORDER_GRADIENTS[number];

// ── Semantic Role (4 values) ────────────────────────────
export const SEMANTIC_ROLES = [
  'status', 'tag', 'label', 'none'
] as const;
export type SemanticRole = typeof SEMANTIC_ROLES[number];
