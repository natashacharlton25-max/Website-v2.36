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

// CVD unsafe hue zones — same as cvd.js. Duplicated here so validator doesn't
// import from shared (keeps the validator a pure leaf dependency).
const CVD_UNSAFE_ZONES = {
  protan: [[0, 40], [100, 165], [330, 360]],
  deutan: [[0, 40], [100, 165], [330, 360]],
  tritan: [[60, 110], [200, 260]],
};

// Extended danger-zone buffer for chroma zones where CVD wash is amplified.
// Calm themes sit at low chroma already — a hue in the unsafe zone wouldn't
// just shift slightly under CVD, it'd collapse completely to bg-grey. For
// these zones we widen each unsafe range by ±10° so hues near the boundary
// also get pre-shifted.
const CVD_UNSAFE_ZONES_STRICT = {
  protan: [[0, 50], [90, 175], [320, 360]],
  deutan: [[0, 50], [90, 175], [320, 360]],
  tritan: [[50, 120], [190, 270]],
};

// Bg modes that AMPLIFY a risky hue under CVD. A red primary against a
// low-chroma warm bg collapses to "grey on grey" for protan users; against
// a vivid cool bg the collision is much less severe. Only flag the risky
// combos — everything else handled by the post-scale CVD collision check.
const LOW_CHROMA_BG_MODES = new Set(['warm', 'cool', 'grey', 'grey-tint']);

// Chroma zones — themes declare their chroma character so we know how
// aggressive to be about CVD pre-shifts. Calm = low chroma, uses strict
// zones. Vivid = high chroma, uses standard zones. Others default standard.
const STRICT_CHROMA_ZONES = new Set(['calm']);

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

function hueInZones(h, zones) {
  const n = normaliseHue(h);
  return zones.some(([lo, hi]) => n >= lo && n <= hi);
}

/**
 * Detect brand-hue × bg-mode combinations that will wash out under CVD.
 *
 * The post-scale cvd.js only shifts hexes that COLLIDE with another hex. But
 * a brand hue in a CVD unsafe zone paired with a low-chroma bg can wash the
 * WHOLE scale to near-grey — the collision check doesn't catch it because
 * no two scale positions are in conflict; they're all equally invisible.
 *
 * Example: user picks red primary (hue 10°), bg mode 'warm' (low chroma
 * warm neutral). Under protan simulation, red → dark grey, warm bg → grey,
 * scales built from this hue produce a scale of greys indistinguishable
 * from the bg. Flag this combo so the generator pre-shifts the brand hue
 * to a CVD-safe alternative BEFORE building scales.
 *
 * Returns: { protan: ['primary', 'secondary'], deutan: [...], tritan: [...] }
 *          Empty arrays when nothing is at risk.
 */
/**
 * How deep into an unsafe hue zone is `h`? Returns 0 (outside zone) to 1
 * (dead centre of zone). Zones wrap (e.g. 330-360 + 0-40 for red); handle
 * by evaluating each range independently and taking the max depth found.
 */
function zoneDepth(h, zones) {
  const n = normaliseHue(h);
  let maxDepth = 0;
  for (const [lo, hi] of zones) {
    if (n < lo || n > hi) continue;
    const mid = (lo + hi) / 2;
    const halfWidth = (hi - lo) / 2;
    // Distance from centre, normalised to [0..1] where 0 = at edge, 1 = centre
    const depth = halfWidth === 0 ? 1 : (1 - Math.abs(n - mid) / halfWidth);
    if (depth > maxDepth) maxDepth = depth;
  }
  return maxDepth;
}

/**
 * Compute a 0..1 CVD risk score for a single brand hex under a single CVD.
 * Combines:
 *   - hue depth inside unsafe zone (0 = outside, 1 = dead centre)
 *   - chroma of the hex (low chroma amplifies wash — at C<0.08 risk ×1.5)
 *   - luminance distance from a reference bg L (far from bg = dampens risk)
 *
 * When chromaZone is strict (calm), strict zones widen the unsafe range so
 * boundary hues score non-zero where they'd pass the standard zones.
 */
function scoreBrandCvdRisk(entry, cvdType, chromaZone, bgL = 0.5) {
  const zones = STRICT_CHROMA_ZONES.has(chromaZone)
    ? CVD_UNSAFE_ZONES_STRICT[cvdType]
    : CVD_UNSAFE_ZONES[cvdType];
  // Use HSV picker hue (entry.hue) — that's the user's SEMANTIC hue
  // intent. HSV 282° is purple regardless of S/V; HSV 231° is blue
  // regardless of whether OKLCH readback drifts the rendered hex by
  // 30-50°. CVD unsafe zones are hue-family concepts, so test against
  // the intent, not the rendered OKLCH.
  const depth = zoneDepth(entry.hue, zones);
  if (depth === 0) return 0;
  const [L, C] = chroma(entry.hex).oklch();
  // Chroma multiplier: low chroma = closer to grey under CVD = higher risk.
  // C < 0.08 boosts risk; C > 0.20 dampens.
  const chromaMult = C < 0.08 ? 1.5 : C > 0.20 ? 0.75 : 1.0;
  // Luminance-distance multiplier: if the brand hex's L is near bg's L,
  // there's no L-contrast to fall back on when hue washes — worse risk.
  const lDist = Math.abs((L || 0.5) - bgL);
  const lMult = lDist < 0.15 ? 1.3 : lDist > 0.40 ? 0.80 : 1.0;
  const raw = depth * chromaMult * lMult;
  return Math.max(0, Math.min(1, raw));
}

function detectCvdRisks(hexSet, chromaZone = 'standard') {
  const risks = {
    protan: { score: 0, slots: [], reasons: [], severity: 'safe' },
    deutan: { score: 0, slots: [], reasons: [], severity: 'safe' },
    tritan: { score: 0, slots: [], reasons: [], severity: 'safe' },
  };
  const bgMode = typeof hexSet.pageBg === 'string' ? hexSet.pageBg : null;
  const bgRiskyForCvd = !bgMode || LOW_CHROMA_BG_MODES.has(bgMode);
  // For strict chroma zones, skip the bg-risky gate — low-chroma themes
  // are ALWAYS at risk regardless of bg mode.
  const bgGate = STRICT_CHROMA_ZONES.has(chromaZone) ? true : bgRiskyForCvd;
  if (!bgGate) return risks;

  // Rough bg L estimate — we don't have the final bg hex here yet (generator
  // picks it), but the bg MODE is a good proxy for its L character.
  // warm/grey/grey-tint light themes ~0.92, cool ~0.94, deep dark ~0.25.
  // We assume a light-ish surface (0.90) as the default estimate since most
  // CVD wash-out risk is "near-bg" not "far-from-bg" — being wrong here just
  // makes scores slightly generous, never missed-risky.
  const bgLEstimate = 0.90;

  for (const cvdType of Object.keys(CVD_UNSAFE_ZONES)) {
    let maxScore = 0;
    for (const slot of ['primary', 'secondary']) {
      const entry = hexSet[slot];
      if (!entry || typeof entry !== 'object' || !Number.isFinite(entry.hue)) continue;
      const s = scoreBrandCvdRisk(entry, cvdType, chromaZone, bgLEstimate);
      if (s > 0) {
        risks[cvdType].slots.push(slot);
        risks[cvdType].reasons.push(`${slot} hue ${entry.hue.toFixed(0)}° scored ${s.toFixed(2)} for ${cvdType}`);
        if (s > maxScore) maxScore = s;
      }
    }
    risks[cvdType].score = maxScore;
    risks[cvdType].severity =
      maxScore >= 0.6 ? 'high'
      : maxScore >= 0.3 ? 'medium'
      : maxScore > 0    ? 'low'
      : 'safe';
  }
  return risks;
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

  // ── 10. CVD risk detection ───────────────────────────────────────
  // Runs after brand slots are resolved. Flags each CVD type with the list
  // of brand slots whose hue × bg combo will wash out under that CVD.
  // Generators read this to pre-shift the brand hue when building a CVD
  // variant, rather than waiting for post-scale collision detection which
  // can't see "scale-uniformly-greyed" failures.
  //
  // chromaZone (optional on input) = 'calm' | 'vivid' | 'standard' — lets
  // low-chroma themes widen the danger zones and skip the bg-mode gate.
  // Grey-tint split rule: neutral=primary, text=secondary. Mono harmony
  // overrides this — mono explicitly means "same hue" for the mono aesthetic
  // so both neutral and text derive from primary.
  //
  // Edge guard: if primary and secondary hues are < 30° apart (but not mono),
  // bump text's derived hue to primary+30° so grey-tint neutral and text
  // stay perceptually distinct. This only matters for the grey-tint enum.
  const isMono = harmony === 'mono';
  const primaryHue = hexSet.primary.hue;
  const secondaryHue = hexSet.secondary ? hexSet.secondary.hue : primaryHue;
  function hueDistance(a, b) {
    const d = Math.abs(normaliseHue(a) - normaliseHue(b));
    return Math.min(d, 360 - d);
  }
  const hueGap = hueDistance(primaryHue, secondaryHue);
  const greyTintHues = isMono
    ? { neutral: primaryHue, text: primaryHue }
    : (hueGap < 30
        ? { neutral: primaryHue, text: normaliseHue(primaryHue + 30) }
        : { neutral: primaryHue, text: secondaryHue });

  const chromaZone = input.chromaZone || 'standard';
  const cvdRisks = detectCvdRisks(hexSet, chromaZone);
  for (const [cvdType, risk] of Object.entries(cvdRisks)) {
    if (risk.slots.length) {
      warnings.push(
        `${cvdType}: ${risk.severity} risk (score ${risk.score.toFixed(2)}) on ${risk.slots.join(', ')} — will pre-shift for CVD variants`
      );
    }
  }

  return {
    hexSet,
    accentStrategy,
    warnings,
    cvdRisks,
    // Metadata about how neutral/text derive their hues when the user
    // picks the 'grey-tint' enum. Generators read this so they don't have
    // to duplicate the mono / split-by-secondary logic.
    meta: {
      isMono,
      harmony: harmony || null,
      greyTintHues, // { neutral: deg, text: deg }
    },
  };
}
