/**
 * cvd.js — Shared CVD (colour vision deficiency) hex shifter.
 *
 * Takes the actually-rendered theme hexes and shifts any that collide
 * under CVD simulation. Shifts hue only — L and C preserved, so the
 * new hex looks like the same "weight" of colour, just shifted to a
 * distinguishable hue.
 *
 * Theme-agnostic. Hexes in, hexes out. Runs POST-SCALE — after the theme
 * generator has built all its chromatic tokens. Callers pass only the
 * tokens that matter for CVD (brand-chromatic scale positions). Near-grey
 * neutrals / text / bg should not be passed — they can't collide under CVD.
 *
 * Contract:
 *   cvd(hexSet, cvdType) → { hexSet, cvdSafe, notes }
 *
 * Input:
 *   hexSet  = { [slotName]: { hex: '#...', locked?: boolean } }
 *   cvdType = 'protan' | 'deutan' | 'tritan'
 *
 * Output:
 *   hexSet[slot] = '#...'    (possibly shifted hex, L+C preserved)
 *   cvdSafe      = true if all pairs distinct under simulation
 *   notes        = string[] explaining what happened
 *
 * Rules:
 *   1. Distinctness = ΔE ≥ 10 between simulated versions of each pair
 *   2. Only shift when a REAL collision is detected (no preventive shifts
 *      based on zone membership). A hex in an "unsafe zone" is fine on
 *      its own — it only matters if it collides with another hex.
 *   3. Shift ladder (applied to the shiftable member of a colliding pair):
 *      a) score every safe-pool candidate hue, pick max min-ΔE,
 *         tiebreak by closeness to original hue (minimise visual change)
 *      b) small hue rotation (±5° to ±30°) if pool search fails
 *   4. Shifts preserve the original hex's L and C — only hue changes.
 *   5. Locked hexes never shift.
 *   6. Two locked hexes colliding → flag cvdSafe: false, continue.
 *   7. Two passes max; if any collision remains, cvdSafe: false.
 *
 * Role-swap is NOT this module's responsibility — handled downstream by
 * the post-build validator (scripts/validate-themes.js).
 */

import chroma from 'chroma-js';

/* ================================================================
   CVD data
   ================================================================ */

const CVD_UNSAFE_ZONES = {
  protan: [[0, 40], [100, 165], [330, 360]],
  deutan: [[0, 40], [100, 165], [330, 360]],
  tritan: [[60, 110], [200, 260]],
};

// Machado 2009 LMS-space simulation matrices.
const CVD_MATRICES = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};

export const DISTINCTNESS_DE = 10;
const MAX_PASSES = 2;

/* ================================================================
   Primitives
   ================================================================ */

function normaliseHue(h) {
  return ((h % 360) + 360) % 360;
}

function hueInZones(h, zones) {
  const n = normaliseHue(h);
  return zones.some(([lo, hi]) => n >= lo && n <= hi);
}

function hueDistance(a, b) {
  const d = Math.abs(normaliseHue(a) - normaliseHue(b));
  return Math.min(d, 360 - d);
}

/**
 * Simulate how a hex is perceived under the CVD matrix.
 */
export function simulateCvd(hex, cvdType) {
  if (!cvdType || !CVD_MATRICES[cvdType]) return hex;
  const M = CVD_MATRICES[cvdType];
  const [r, g, b] = chroma(hex).rgb();
  const norm = [r / 255, g / 255, b / 255];
  const out = [
    M[0][0] * norm[0] + M[0][1] * norm[1] + M[0][2] * norm[2],
    M[1][0] * norm[0] + M[1][1] * norm[1] + M[1][2] * norm[2],
    M[2][0] * norm[0] + M[2][1] * norm[1] + M[2][2] * norm[2],
  ];
  const clamp = (v) => Math.max(0, Math.min(1, v));
  return chroma.rgb(clamp(out[0]) * 255, clamp(out[1]) * 255, clamp(out[2]) * 255).hex();
}

function simulatedDeltaE(hexA, hexB, cvdType) {
  return chroma.deltaE(simulateCvd(hexA, cvdType), simulateCvd(hexB, cvdType));
}

/**
 * Pool of candidate hues in 5° increments, filtered to CVD-safe zones.
 */
function buildSafeHuePool(cvdType) {
  const zones = CVD_UNSAFE_ZONES[cvdType];
  const pool = [];
  for (let h = 0; h < 360; h += 5) {
    if (!hueInZones(h, zones)) pool.push(h);
  }
  return pool;
}

/**
 * Render an OKLCH triple (preserving L and C from source) at a new hue.
 * Uses chroma-js gamut clamping.
 */
function shiftToHue(sourceHex, newHue) {
  const [L, C] = chroma(sourceHex).oklch();
  return chroma.oklch(L, C || 0, normaliseHue(newHue)).hex();
}

/* ================================================================
   Shift ladder
   ================================================================ */

/**
 * Find a new hue for `shiftSlot` that's distinct from every other slot
 * under CVD simulation. Preserves source hex's L and C. Returns new hex
 * or null if nothing works.
 */
function shiftHex(shiftSlot, state, cvdType, pool) {
  const source = state[shiftSlot].hex;
  const currentHue = chroma(source).get('oklch.h') || 0;

  const usedHues = Object.entries(state)
    .filter(([k]) => k !== shiftSlot)
    .map(([, e]) => chroma(e.hex).get('oklch.h') || 0);

  // Minimum simulated ΔE from candidateHex to every other slot.
  function minDeltaToOthers(candidateHex) {
    let min = Infinity;
    for (const [slot, entry] of Object.entries(state)) {
      if (slot === shiftSlot) continue;
      const de = simulatedDeltaE(candidateHex, entry.hex, cvdType);
      if (de < min) min = de;
    }
    return min;
  }

  // Score candidates: must pass distinctness; tiebreak by closeness to original.
  function scoreHexCandidates(candidateHexes) {
    let best = null;
    let bestDe = -Infinity;
    let bestDist = Infinity;
    for (const { hex, hue } of candidateHexes) {
      const minDe = minDeltaToOthers(hex);
      if (minDe < DISTINCTNESS_DE) continue;
      const dist = hueDistance(hue, currentHue);
      if (minDe > bestDe || (minDe === bestDe && dist < bestDist)) {
        best = hex; bestDe = minDe; bestDist = dist;
      }
    }
    return best;
  }

  // a) Full pool search — every safe-zone hue at 5° increments, ≥8° from other slots
  const poolCandidates = pool
    .filter(h => !usedHues.some(u => hueDistance(h, u) < 8))
    .map(h => ({ hex: shiftToHue(source, h), hue: h }));
  const poolPick = scoreHexCandidates(poolCandidates);
  if (poolPick) return poolPick;

  // b) Small rotations
  const rotations = [];
  for (let offset = 5; offset <= 30; offset += 5) {
    for (const dir of [1, -1]) {
      const tryHue = normaliseHue(currentHue + offset * dir);
      if (hueInZones(tryHue, CVD_UNSAFE_ZONES[cvdType])) continue;
      rotations.push({ hex: shiftToHue(source, tryHue), hue: tryHue });
    }
  }
  const rotPick = scoreHexCandidates(rotations);
  if (rotPick) return rotPick;

  return null;
}

/* ================================================================
   Main entry
   ================================================================ */

export function cvd(hexSet, cvdType) {
  if (!CVD_MATRICES[cvdType]) {
    const out = {};
    for (const [slot, entry] of Object.entries(hexSet)) out[slot] = entry.hex;
    return { hexSet: out, cvdSafe: true, notes: [`unknown cvdType: ${cvdType}`] };
  }

  const pool = buildSafeHuePool(cvdType);

  const state = {};
  for (const [slot, entry] of Object.entries(hexSet)) {
    state[slot] = { hex: entry.hex, locked: !!entry.locked };
  }

  const notes = [];
  let cvdSafe = true;

  // Resolve collisions — only real ones (no preventive zone-shift).
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    let anyCollisionThisPass = false;
    const slots = Object.keys(state);

    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const slotA = slots[i];
        const slotB = slots[j];
        const a = state[slotA];
        const b = state[slotB];

        const de = simulatedDeltaE(a.hex, b.hex, cvdType);
        if (de >= DISTINCTNESS_DE) continue;

        anyCollisionThisPass = true;

        if (a.locked && b.locked) {
          cvdSafe = false;
          notes.push(`FAIL: ${slotA} and ${slotB} both locked, collide under ${cvdType} (ΔE ${de.toFixed(1)})`);
          continue;
        }

        const shiftSlot = a.locked ? slotB : slotA;
        const anchorSlot = shiftSlot === slotA ? slotB : slotA;
        const newHex = shiftHex(shiftSlot, state, cvdType, pool);

        if (newHex) {
          const oldHue = (chroma(state[shiftSlot].hex).get('oklch.h') || 0).toFixed(0);
          const newHue = (chroma(newHex).get('oklch.h') || 0).toFixed(0);
          notes.push(`${shiftSlot} shifted ${oldHue}° → ${newHue}° to separate from ${anchorSlot} (ΔE was ${de.toFixed(1)})`);
          state[shiftSlot].hex = newHex;
        } else {
          cvdSafe = false;
          notes.push(`FAIL: could not resolve ${slotA}↔${slotB} (ΔE ${de.toFixed(1)})`);
        }
      }
    }

    if (!anyCollisionThisPass) break;
  }

  const outHexSet = {};
  for (const [slot, entry] of Object.entries(state)) {
    outHexSet[slot] = entry.hex;
  }
  return { hexSet: outHexSet, cvdSafe, notes };
}
