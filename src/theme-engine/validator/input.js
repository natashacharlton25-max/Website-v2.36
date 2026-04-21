/**
 * input.js — Pre-theme input validator.
 *
 * Accepts HSV per slot (from the picker), converts to hex for downstream,
 * and carries the user-picked hue forward as a guaranteed-present sibling.
 * Fills missing slots with sensible defaults derived from primary.
 *
 * Transport downstream is hex, but every hex slot is paired with its
 * guaranteed hue so no one has to re-extract hue from a possibly-achromatic
 * hex. Generators can read `.hex` for rendering and `.hue` for maths.
 *
 * Rules (locked):
 *   - primary is required
 *   - inputs must be HSV { h, s, v } (picker-native) — hex strings not accepted
 *   - missing secondary → derive via harmony (fallback: mono-shift + warning)
 *   - missing accents → null (generator decides)
 *   - missing tertiary → infer warm/cool from primary hue (boundary 150°/320°)
 *   - missing text → inherit tertiary's resolved value (silent)
 *   - missing pageBg → null (generator picks type-specific default)
 *   - shiftability metadata is NOT set here (generator's job when calling CVD)
 *   - harmony changes hue only; s/v copied from primary
 *
 * Output:
 *   { hexSet, accentStrategy, warnings }
 *   - hexSet[slot] = { hex, hue }  for colour slots
 *   - hexSet[slot] = 'warm' | 'cool' | ... for enum modes
 *   - hexSet.pageBg = enum-string | null
 *   - accentStrategy = enum-string | null (UI-decoration preference)
 *   - warnings = string[]
 */

import chroma from 'chroma-js';

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
// Text accepts every NEUTRAL mode plus 'black-white' — when 'black-white',
// text scale points to the var(--color-Black) anchor (auto-flips per theme).
const TEXT_ENUMS    = ['warm', 'cool', 'grey', 'grey-tint', 'black-white'];
const HARMONY_ENUMS = ['mono', 'mono-shift', 'complementary', 'analogous'];

// Contrast/accent token is UI-DECORATION ONLY — hover, interaction,
// decorative accents. NEVER used for text. Target is WCAG 3:1 UI + ΔE + APCA Lc.
const ACCENT_STRATEGY_ENUMS = ['emphasis', 'swap', 'tint', 'neutral', 'brand'];

/* ================================================================
   Primitives
   ================================================================ */

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
 * Convert an HSV slot to { hex, hue }.
 * Guarantees hue is a finite number (from picker slider, not extracted hex).
 */
function hsvToHexAndHue(slotName, hsv) {
  if (!isHsv(hsv)) {
    throw new Error(
      `validateInput: slot "${slotName}" must be HSV { h, s, v } with numeric values. ` +
      `Got: ${JSON.stringify(hsv)}`
    );
  }
  if (!Number.isFinite(hsv.h)) {
    throw new Error(`validateInput: slot "${slotName}" has non-finite hue: ${hsv.h}`);
  }
  const hue = normaliseHue(hsv.h);
  const hex = chroma.hsv(hue, hsv.s, hsv.v).hex();
  return { hex, hue };
}

/**
 * Infer warm/cool neutral mode from primary's hue.
 */
function inferNeutralMode(primaryHue) {
  if (!Number.isFinite(primaryHue)) {
    throw new Error(`inferNeutralMode: primary hue is not finite (${primaryHue})`);
  }
  const n = normaliseHue(primaryHue);
  if (n >= WARM_LOWER_WRAP || n < WARM_UPPER) return 'warm';
  return 'cool';
}

/**
 * Derive secondary HSV from primary HSV + harmony.
 * Hue rotates per harmony; s and v copied from primary.
 */
function deriveSecondary(primaryHsv, harmony) {
  const { h, s, v } = primaryHsv;
  let newHue;
  switch (harmony) {
    case 'mono':          newHue = h; break;
    case 'mono-shift':    newHue = normaliseHue(h + MONO_SHIFT_DEGREES); break;
    case 'analogous':     newHue = normaliseHue(h + ANALOGOUS_DEGREES); break;
    case 'complementary': newHue = normaliseHue(h + 180); break;
    default:
      throw new Error(`deriveSecondary: unknown harmony "${harmony}"`);
  }
  return { h: newHue, s, v };
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
  const hexSet = {};

  // ── 1. Primary ───────────────────────────────────────────────────
  if (input.primary === undefined) {
    throw new Error('validateInput: "primary" is required.');
  }
  hexSet.primary = hsvToHexAndHue('primary', input.primary);

  // ── 2. Harmony validation (if provided) ──────────────────────────
  let harmony = input.harmony;
  if (harmony !== undefined) {
    assertEnum('harmony', harmony, HARMONY_ENUMS);
  }

  // ── 3. Secondary ─────────────────────────────────────────────────
  if (input.secondary !== undefined) {
    hexSet.secondary = hsvToHexAndHue('secondary', input.secondary);
  } else {
    if (!harmony) {
      harmony = 'mono-shift';
      warnings.push(
        'secondary missing and no harmony specified — derived via "mono-shift" fallback (+15°)'
      );
    }
    const derivedHsv = deriveSecondary(input.primary, harmony);
    hexSet.secondary = hsvToHexAndHue('secondary', derivedHsv);
  }

  // ── 4. Accents ───────────────────────────────────────────────────
  hexSet.primaryAccent = input.primaryAccent !== undefined
    ? hsvToHexAndHue('primaryAccent', input.primaryAccent)
    : null;

  hexSet.secondaryAccent = input.secondaryAccent !== undefined
    ? hsvToHexAndHue('secondaryAccent', input.secondaryAccent)
    : null;

  // ── 5. Tertiary ──────────────────────────────────────────────────
  if (input.tertiary !== undefined) {
    if (typeof input.tertiary === 'string') {
      assertEnum('tertiary', input.tertiary, NEUTRAL_ENUMS);
      hexSet.tertiary = input.tertiary;
    } else {
      hexSet.tertiary = hsvToHexAndHue('tertiary', input.tertiary);
    }
  } else {
    hexSet.tertiary = inferNeutralMode(hexSet.primary.hue);
  }

  // ── 6. Tertiary accent ───────────────────────────────────────────
  hexSet.tertiaryAccent = input.tertiaryAccent !== undefined
    ? hsvToHexAndHue('tertiaryAccent', input.tertiaryAccent)
    : null;

  // ── 7. Text ──────────────────────────────────────────────────────
  if (input.text !== undefined) {
    if (typeof input.text === 'string') {
      assertEnum('text', input.text, TEXT_ENUMS);
      hexSet.text = input.text;
    } else {
      hexSet.text = hsvToHexAndHue('text', input.text);
    }
  } else {
    // Default: inherit tertiary's resolved value. Silent — most themes
    // don't specify text explicitly.
    hexSet.text = hexSet.tertiary;
  }

  // ── 8. Page background ───────────────────────────────────────────
  if (input.pageBg !== undefined) {
    assertEnum('pageBg', input.pageBg, PAGEBG_ENUMS);
    hexSet.pageBg = input.pageBg;
  } else {
    hexSet.pageBg = null;
  }

  // ── 9. Accent strategy (UI decoration preference) ────────────────
  let accentStrategy = null;
  if (input.accentStrategy !== undefined) {
    assertEnum('accentStrategy', input.accentStrategy, ACCENT_STRATEGY_ENUMS);
    accentStrategy = input.accentStrategy;
  }

  return { hexSet, accentStrategy, warnings };
}
