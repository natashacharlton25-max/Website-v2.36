/**
 * input.js — Pre-theme input validator.
 *
 * Takes brand input (HSV per slot + enum modes), converts HSV → OKLCH at
 * the boundary, fills missing slots with sensible defaults derived from
 * primary, returns a complete OKLCH/enum set ready for the theme generator.
 *
 * Transport:
 *   Picker native  = HSV   (hue survives S=0 / V=0)
 *   Engine native  = OKLCH (all downstream maths works in OKLCH)
 *   CSS output     = hex   (writer converts at the very end)
 *
 * Rules (locked):
 *   - primary is required; non-finite hue throws
 *   - missing secondary → derive via harmony (fallback: mono-shift + warning)
 *   - harmony changes hue only; L/C copied from primary
 *   - missing accents → null (generator decides)
 *   - missing tertiary → infer warm/cool from primary hue (boundary 150°/320°)
 *   - missing text → inherit tertiary's resolved mode (silent)
 *   - missing pageBg → null (generator picks type-specific default)
 *   - shiftability metadata is NOT set here (generator's job when calling CVD)
 *   - L/C for derived hexes copied from primary (harmony affects hue only)
 *
 * Output:
 *   { oklchSet, accentStrategy, warnings }
 *   - oklchSet: { slot: { L, C, H } | enumString }
 *   - accentStrategy: string | null  (UI-decoration preference)
 *   - warnings: string[]
 */

import { hsvToOklch } from '../shared/colour-maths.js';

/* ================================================================
   Constants
   ================================================================ */

const MONO_SHIFT_DEGREES = 15;
const ANALOGOUS_DEGREES = 30;

// Warm/cool inference boundaries.
// warm = hue in [320, 360] ∪ [0, 150)
// cool = hue in [150, 320)
const WARM_UPPER = 150;
const WARM_LOWER_WRAP = 320;

const NEUTRAL_ENUMS = ['warm', 'cool', 'grey', 'grey-tint'];
const PAGEBG_ENUMS  = ['warm', 'cool', 'grey', 'grey-tint', 'tint', 'deep'];
const HARMONY_ENUMS = ['mono', 'mono-shift', 'complementary', 'analogous'];

// Contrast/accent token is UI-DECORATION ONLY — hover, interaction,
// decorative accents. NEVER used for text. Target is WCAG 3:1 UI + ΔE + APCA Lc.
//
// Validator accepts all five forward-looking strategies. Generator support
// is partial today:
//   'emphasis' ✓ supported (copy primary-emphasis)
//   'brand'    ✓ supported (use accent hex if supplied)
//   'neutral'  ✓ supported (use neutral-emphasis)
//   'swap'     ◦ not yet implemented — generator will fall back to 'emphasis'
//   'tint'     ◦ not yet implemented — generator will fall back to 'emphasis'
const ACCENT_STRATEGY_ENUMS = ['emphasis', 'swap', 'tint', 'neutral', 'brand'];

/* ================================================================
   Primitives
   ================================================================ */

/**
 * Does this value look like an HSV slot? Shape-check only.
 */
function isHsv(v) {
  return (
    v !== null &&
    typeof v === 'object' &&
    typeof v.h === 'number' &&
    typeof v.s === 'number' &&
    typeof v.v === 'number'
  );
}

function normaliseHue(h) {
  return ((h % 360) + 360) % 360;
}

/**
 * Convert an HSV slot input to OKLCH triple.
 * Delegates the hue-preservation work to hsvToOklch.
 */
function slotToOklch(slotName, hsv) {
  if (!isHsv(hsv)) {
    throw new Error(
      `validateInput: slot "${slotName}" must be an HSV object ` +
      `{ h, s, v } with numeric h, s, v. Got: ${JSON.stringify(hsv)}`
    );
  }
  try {
    return hsvToOklch(hsv.h, hsv.s, hsv.v);
  } catch (err) {
    throw new Error(`validateInput: slot "${slotName}": ${err.message}`);
  }
}

/**
 * Infer a warm/cool neutral mode from primary's OKLCH hue.
 */
function inferNeutralMode(primaryOklch) {
  const h = primaryOklch.H;
  if (!Number.isFinite(h)) {
    throw new Error(`inferNeutralMode: primary hue is not finite (${h})`);
  }
  const n = normaliseHue(h);
  if (n >= WARM_LOWER_WRAP || n < WARM_UPPER) return 'warm';
  return 'cool';
}

/**
 * Derive secondary OKLCH from primary OKLCH + harmony.
 * Hue rotates per harmony; L and C copied from primary.
 */
function deriveSecondary(primaryOklch, harmony) {
  const { L, C, H } = primaryOklch;
  let newHue;
  switch (harmony) {
    case 'mono':          newHue = H; break;
    case 'mono-shift':    newHue = normaliseHue(H + MONO_SHIFT_DEGREES); break;
    case 'analogous':     newHue = normaliseHue(H + ANALOGOUS_DEGREES); break;
    case 'complementary': newHue = normaliseHue(H + 180); break;
    default:
      throw new Error(`deriveSecondary: unknown harmony "${harmony}"`);
  }
  return { L, C, H: newHue };
}

function assertEnum(slotName, value, allowed) {
  if (!allowed.includes(value)) {
    throw new Error(
      `Invalid value at slot "${slotName}": "${value}". ` +
      `Must be one of: ${allowed.join(', ')}.`
    );
  }
}

/* ================================================================
   Main
   ================================================================ */

export function validateInput(input = {}) {
  const warnings = [];
  const oklchSet = {};

  // ── 1. Primary ───────────────────────────────────────────────────
  if (input.primary === undefined) {
    throw new Error('validateInput: "primary" is required.');
  }
  oklchSet.primary = slotToOklch('primary', input.primary);

  // ── 2. Harmony validation (if provided) ──────────────────────────
  let harmony = input.harmony;
  if (harmony !== undefined) {
    assertEnum('harmony', harmony, HARMONY_ENUMS);
  }

  // ── 3. Secondary ─────────────────────────────────────────────────
  if (input.secondary !== undefined) {
    oklchSet.secondary = slotToOklch('secondary', input.secondary);
  } else {
    if (!harmony) {
      harmony = 'mono-shift';
      warnings.push(
        'secondary missing and no harmony specified — derived via "mono-shift" fallback (+15°)'
      );
    }
    oklchSet.secondary = deriveSecondary(oklchSet.primary, harmony);
  }

  // ── 4. Accents ───────────────────────────────────────────────────
  oklchSet.primaryAccent = input.primaryAccent !== undefined
    ? slotToOklch('primaryAccent', input.primaryAccent)
    : null;

  oklchSet.secondaryAccent = input.secondaryAccent !== undefined
    ? slotToOklch('secondaryAccent', input.secondaryAccent)
    : null;

  // ── 5. Tertiary ──────────────────────────────────────────────────
  if (input.tertiary !== undefined) {
    if (typeof input.tertiary === 'string') {
      assertEnum('tertiary', input.tertiary, NEUTRAL_ENUMS);
      oklchSet.tertiary = input.tertiary;
    } else {
      oklchSet.tertiary = slotToOklch('tertiary', input.tertiary);
    }
  } else {
    oklchSet.tertiary = inferNeutralMode(oklchSet.primary);
  }

  // ── 6. Tertiary accent ───────────────────────────────────────────
  oklchSet.tertiaryAccent = input.tertiaryAccent !== undefined
    ? slotToOklch('tertiaryAccent', input.tertiaryAccent)
    : null;

  // ── 7. Text ──────────────────────────────────────────────────────
  if (input.text !== undefined) {
    if (typeof input.text === 'string') {
      assertEnum('text', input.text, NEUTRAL_ENUMS);
      oklchSet.text = input.text;
    } else {
      oklchSet.text = slotToOklch('text', input.text);
    }
  } else {
    // Default: inherit tertiary's resolved mode/value. Silent — most themes
    // don't specify text explicitly.
    oklchSet.text = oklchSet.tertiary;
  }

  // ── 8. Page background ───────────────────────────────────────────
  if (input.pageBg !== undefined) {
    assertEnum('pageBg', input.pageBg, PAGEBG_ENUMS);
    oklchSet.pageBg = input.pageBg;
  } else {
    oklchSet.pageBg = null;
  }

  // ── 9. Accent strategy (UI decoration preference) ────────────────
  let accentStrategy = null;
  if (input.accentStrategy !== undefined) {
    assertEnum('accentStrategy', input.accentStrategy, ACCENT_STRATEGY_ENUMS);
    accentStrategy = input.accentStrategy;
  }

  return { oklchSet, accentStrategy, warnings };
}
