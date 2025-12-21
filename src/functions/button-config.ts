/**
 * Button Configuration
 *
 * Global button defaults for the site.
 * Change these to update all buttons at once.
 */

/** Visual style of buttons */
export type ButtonStyle = 'solid' | 'outline' | 'ghost' | 'glow' | 'glass' | 'soft';

/** Button size */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Corner shape */
export type ButtonRadius = 'sharp' | 'default' | 'soft' | 'pill';

/** Color variant */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent1'
  | 'accent2'
  | 'accent3'
  | 'accent4'
  | 'accent5';

/* ========================================
   GLOBAL BUTTON DEFAULTS
   Change these to update all buttons
   ======================================== */

/** Button visual style */
export const BUTTON_STYLE: ButtonStyle = 'solid';

/** Button size */
export const BUTTON_SIZE: ButtonSize = 'md';

/** Corner shape */
export const BUTTON_RADIUS: ButtonRadius = 'soft';

/** Default color */
export const BUTTON_VARIANT: ButtonVariant = 'primary';
