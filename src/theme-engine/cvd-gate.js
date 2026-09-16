/**
 * cvd-gate.js — Pre-engine CVD hue safety gate.
 *
 * Sits BETWEEN the validator and the generator. Its job is narrow:
 *
 *   input:  brand hue (number 0-360)
 *   output: a hue that's safe to display for a given CVD type
 *
 * If the input hue is already in that CVD's safe zones, it passes through
 * unchanged. If it's in an unsafe zone, the gate shifts it to the nearest
 * safe hue. The engine downstream never knows CVD happened — it just
 * receives a hue and builds scales from it.
 *
 * Safe zones (continuous ranges, Option B from the design discussion):
 *
 *   PROTAN / DEUTAN (red-green CVD — world seen in blues + yellows):
 *     [40, 110]  — yellows + yellow-greens
 *     [200, 280] — blues + blue-violets
 *
 *   TRITAN (blue-yellow CVD — world seen in reds + greens):
 *     [0, 40]    — reds + red-oranges
 *     [120, 180] — greens
 *     [310, 360] — magentas + pinks
 *
 * Input hue is interpreted as HSV picker hue — the user's semantic hue
 * intent (not the rendered hex's OKLCH hue, which drifts by 30-50° for
 * saturated blues/purples). That's the right signal for CVD safety:
 * "what hue did the designer MEAN" matters more than "what does the
 * rendered hex read as in OKLCH."
 */

export const CVD_SAFE_ZONES = {
  protan: [[40, 110], [200, 280]],
  deutan: [[40, 110], [200, 280]],
  tritan: [[0, 40], [120, 180], [310, 360]],
};

function normaliseHue(h) {
  return ((h % 360) + 360) % 360;
}

function hueDistance(a, b) {
  const d = Math.abs(normaliseHue(a) - normaliseHue(b));
  return Math.min(d, 360 - d);
}

function hueInZones(hue, zones) {
  const h = normaliseHue(hue);
  return zones.some(([lo, hi]) => h >= lo && h <= hi);
}

/**
 * Walk each safe zone in 1° steps, pick the hue nearest the input.
 * Returns the nearest safe hue.
 */
function nearestSafeHue(hue, zones) {
  let bestHue = null;
  let bestDist = Infinity;
  for (const [lo, hi] of zones) {
    for (let h = lo; h <= hi; h += 1) {
      const d = hueDistance(h, hue);
      if (d < bestDist) {
        bestDist = d;
        bestHue = h;
      }
    }
  }
  return bestHue;
}

/**
 * Check if a hue is safe for the given CVD type. Always true for null/
 * unknown CVD types (pass-through — no gate).
 */
export function isSafeHue(hue, cvdType) {
  const zones = CVD_SAFE_ZONES[cvdType];
  if (!zones) return true;
  return hueInZones(hue, zones);
}

/**
 * Shift a hue to the nearest safe hue for the given CVD type.
 *
 *   shiftHue(333, 'protan') → 280 (nearest protan-safe, 53° away)
 *   shiftHue(231, 'protan') → 231 (already safe, unchanged)
 *   shiftHue(231, 'tritan') → 180 (nearest tritan-safe, 51° away)
 *
 * Returns the same hue when no CVD type is given (identity).
 */
export function shiftHue(hue, cvdType) {
  if (!cvdType) return hue;
  const zones = CVD_SAFE_ZONES[cvdType];
  if (!zones) return hue;
  if (hueInZones(hue, zones)) return hue;
  return nearestSafeHue(hue, zones);
}

/**
 * Shift two brand hues (primary + secondary) as a pair, keeping them at
 * least minGap° apart after shifting. If the nearest-safe shift puts them
 * on top of each other, push the second further away within its safe zone.
 *
 * Returns { primary, secondary } as shifted hues.
 */
export function shiftPair(primaryHue, secondaryHue, cvdType, { minGap = 40 } = {}) {
  if (!cvdType) return { primary: primaryHue, secondary: secondaryHue };
  const zones = CVD_SAFE_ZONES[cvdType];
  if (!zones) return { primary: primaryHue, secondary: secondaryHue };

  const primary = shiftHue(primaryHue, cvdType);
  let secondary = shiftHue(secondaryHue, cvdType);

  // Already far enough apart — done.
  if (hueDistance(primary, secondary) >= minGap) {
    return { primary, secondary };
  }

  // Shifted secondary collides with primary. Walk safe zones for the
  // nearest alternative secondary that respects minGap.
  let bestHue = secondary;
  let bestDist = Infinity;
  for (const [lo, hi] of zones) {
    for (let h = lo; h <= hi; h += 1) {
      if (hueDistance(h, primary) < minGap) continue;
      const d = hueDistance(h, secondaryHue);
      if (d < bestDist) {
        bestDist = d;
        bestHue = h;
      }
    }
  }
  return { primary, secondary: bestHue };
}

/**
 * Gate entry point. Accepts the validator's brand-hue pair + a CVD type.
 * Returns safe hues ready to hand to the generator.
 *
 *   gate({ primary: 333, secondary: 231 }, 'protan')
 *     → { primary: 280, secondary: 231, shifted: ['primary'] }
 *
 * `shifted` lists which slots actually moved — useful for logging and
 * surfacing "this variant had its brand hues adjusted" to the user.
 */
export function gate({ primary, secondary }, cvdType) {
  if (!cvdType) {
    return { primary, secondary, shifted: [] };
  }
  const shifted = [];
  const result = shiftPair(primary, secondary, cvdType);
  if (result.primary   !== primary)   shifted.push('primary');
  if (result.secondary !== secondary) shifted.push('secondary');
  return { ...result, shifted };
}
