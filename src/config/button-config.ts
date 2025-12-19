/**
 * Button Configuration
 *
 * Configure global button settings here. These apply to all UnifiedButton
 * components site-wide, but can be overridden per-button with props.
 *
 * Available styles:
 * - 'base': Solid colors, standard shadows (BaseButton)
 * - 'outline': Border only, fills on hover (OutlineButton)
 * - 'gradiglow': Gradient borders with animated glow (GradiGlow)
 * - 'colourflow': Glassmorphic with animated color flow (ColourFlowButton)
 * - 'slide': Sliding color animation with icon (SlideColourButton)
 * - 'neumorphic': Soft shadows, raised/pressed effects (NeumorphicButton)
 * - 'empower': Tray-style with multiple variants (EmpowerButton)
 */

export type ButtonStyle =
  | 'base'
  | 'outline'
  | 'gradiglow'
  | 'colourflow'
  | 'slide'
  | 'neumorphic'
  | 'empower';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonRadius = 'sharp' | 'default' | 'soft' | 'pill';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent1'
  | 'accent2'
  | 'accent3'
  | 'accent4'
  | 'accent5';

// ============================================
// GLOBAL BUTTON SETTINGS
// Change these to update ALL buttons site-wide
// ============================================

/** Which button component style to use */
export const BUTTON_STYLE: ButtonStyle = 'colourflow';

/** Default button size: 'sm' | 'md' | 'lg' */
export const BUTTON_SIZE: ButtonSize = 'md';

/** Default corner radius: 'sharp' | 'default' | 'soft' | 'pill' */
export const BUTTON_RADIUS: ButtonRadius = 'default';

/** Default button variant (color) */
export const BUTTON_VARIANT: ButtonVariant = 'primary';

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getButtonStyle(): ButtonStyle {
  return BUTTON_STYLE;
}

export function getButtonSize(): ButtonSize {
  return BUTTON_SIZE;
}

export function getButtonRadius(): ButtonRadius {
  return BUTTON_RADIUS;
}

export function getButtonVariant(): ButtonVariant {
  return BUTTON_VARIANT;
}
