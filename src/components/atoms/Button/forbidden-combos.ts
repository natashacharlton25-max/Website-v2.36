/**
 * Variant × effect combinations that don't compose visually. Listed here
 * so the runtime check, schema._rules, and validator can all read from
 * one source of truth.
 *
 * Some variants own their hover state via complex chrome (e.g. glow's
 * gradient halo) and the effect would either be invisible or fight that
 * styling. The atom strips the offending effect and warns in DEV.
 */
export const FORBIDDEN_COMBOS: Record<string, readonly string[]> = {
  outline:        ['split'],
  glow:           ['colour-flow', 'split'],
  'rainbow-glow': ['colour-flow'],
};
