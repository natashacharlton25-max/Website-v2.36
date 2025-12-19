/**
 * Button Configuration
 * Global button settings for UnifiedButton components.
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

/** Which button component style to use */
export const BUTTON_STYLE: ButtonStyle = 'colourflow';

/** Default button size */
export const BUTTON_SIZE: ButtonSize = 'md';

/** Default corner radius */
export const BUTTON_RADIUS: ButtonRadius = 'default';

/** Default button variant (color) */
export const BUTTON_VARIANT: ButtonVariant = 'primary';
