/**
 * Accessibility profile library — two-layer model
 *
 * LAYER 1: PREFERENCE_AXES
 *   Computed properties of every theme — the raw building blocks.
 *   Stimulation level, background luminance, background warmth, contrast tier,
 *   palette breadth. User-facing language is preference-based, not condition-based.
 *   Picker "Simple view" exposes these.
 *
 * LAYER 2: PREFERENCE_PATTERNS
 *   Composite "easier with..." patterns that bundle axis combinations under
 *   condition-recognisable names. Picker "Full view" adds these.
 *
 *   Both views filter the same underlying themes — different doors into the same room.
 *
 * FRAMING PRINCIPLES (read before editing):
 *
 *   1. Never claim a theme treats or fixes a condition. Themes are visual
 *      environments. They make some experiences easier or harder, not better
 *      or worse, not cured or worsened.
 *
 *   2. Use "easier with..." not "safe for..." — the former acknowledges
 *      variability, the latter implies a verified clinical claim.
 *
 *   3. Where a condition has wide within-population variability (autism,
 *      ADHD), split into multiple patterns rather than one. Each notes the
 *      variability in its caveat.
 *
 *   4. Conditions with very high variability (depression, bipolar, PTSD,
 *      Tourette's) are NOT named as patterns. Raw axes serve those users
 *      without forcing a framing onto a sensitive identity.
 *
 *   5. Every named pattern carries a caveat the UI surfaces in tooltips.
 *      The honesty does the work — users can self-assess against it.
 *
 *   6. CVD (protan/deutan/tritan) is named directly because it's a clinical
 *      colour-vision property, not an experience claim. Different framing rule.
 *
 * THEME SHAPE expected by tests:
 *   {
 *     bg, primary, secondary, textEmphasis, textBase,  // hex strings
 *     bgL,                                              // oklch lightness 0-1
 *     primaryHue, primaryC,                             // oklch hue 0-360, chroma 0-0.4
 *     secondaryHue, secondaryC,
 *     contrastEmphasis, contrastBase,                   // WCAG ratios
 *     chroma,         // 'brand' | 'calm' | 'grey' | 'pastel' | 'neon'
 *     luminance,      // 'light' | 'dark'
 *     hc, calmHC,     // booleans
 *     isMonoPalette,  // boolean
 *   }
 */

// ── Hue helpers ─────────────────────────────────────────────────────

function hueDistance(a, b) {
  const d = Math.abs((a || 0) - (b || 0)) % 360;
  return d > 180 ? 360 - d : d;
}

function isWarmHue(hue) {
  const h = ((hue || 0) % 360 + 360) % 360;
  return h <= 90 || h >= 330;
}

function isCoolHue(hue) {
  const h = ((hue || 0) % 360 + 360) % 360;
  return h >= 180 && h <= 280;
}

function maxChromaOf(theme) {
  return Math.max(theme.primaryC || 0, theme.secondaryC || 0);
}

// ── CVD safety (clinical, named directly) ──────────────────────────

function isProtanSafe(theme) {
  const pInRed = theme.primaryHue < 40 || theme.primaryHue > 340;
  const sInRed = theme.secondaryHue < 40 || theme.secondaryHue > 340;
  if (pInRed && sInRed) return false;
  return hueDistance(theme.primaryHue, theme.secondaryHue) >= 60;
}
function isDeutanSafe(theme) { return isProtanSafe(theme); }
function isTritanSafe(theme) {
  const pInBlue = theme.primaryHue >= 200 && theme.primaryHue <= 250;
  const sInBlue = theme.secondaryHue >= 200 && theme.secondaryHue <= 250;
  const pInYellow = theme.primaryHue >= 60 && theme.primaryHue <= 110;
  const sInYellow = theme.secondaryHue >= 60 && theme.secondaryHue <= 110;
  if ((pInBlue && sInYellow) || (pInYellow && sInBlue)) return false;
  return hueDistance(theme.primaryHue, theme.secondaryHue) >= 50;
}

// ────────────────────────────────────────────────────────────────────
// LAYER 1: PREFERENCE AXES (Simple view)
// ────────────────────────────────────────────────────────────────────

export const PREFERENCE_AXES = {
  // Stimulation level
  calm: {
    label: 'Calm',
    description: 'Low chroma, gentle palette, reduced visual energy.',
    test: (t) => t.chroma === 'calm' || t.calmHC || maxChromaOf(t) < 0.10,
  },
  bold: {
    label: 'Bold',
    description: 'Vivid colours, strong palette, high visual energy.',
    test: (t) => maxChromaOf(t) >= 0.15 && !t.calmHC,
  },

  // Background luminance
  light: {
    label: 'Light',
    description: 'Light background — bright, daytime feel.',
    test: (t) => t.luminance === 'light',
  },
  dark: {
    label: 'Dark',
    description: 'Dark background — easier on light-sensitive eyes, OLED-friendly.',
    test: (t) => t.luminance === 'dark',
  },

  // Background warmth
  warm: {
    label: 'Warm',
    description: 'Warm-toned background — cream, amber, peach.',
    test: (t) => isWarmHue(t.primaryHue) || t.chroma === 'calm',
  },
  cool: {
    label: 'Cool',
    description: 'Cool-toned background — blue, teal, grey-purple.',
    test: (t) => isCoolHue(t.primaryHue),
  },

  // Contrast tier
  softContrast: {
    label: 'Soft contrast',
    description: 'Gentle text-on-background contrast — easier on sensitive eyes.',
    test: (t) => t.contrastBase < 4.5,
  },
  highContrast: {
    label: 'High contrast',
    description: 'Strong text-on-background contrast — meets WCAG AAA.',
    test: (t) => t.contrastBase >= 7,
  },

  // Palette breadth
  monochrome: {
    label: 'Monochrome',
    description: 'Single hue or greyscale — minimal colour decisions.',
    test: (t) => t.isMonoPalette || t.chroma === 'grey',
  },
  fullColour: {
    label: 'Full colour',
    description: 'Complete brand palette — primary, secondary, full rainbow.',
    test: (t) => !t.isMonoPalette && t.chroma !== 'grey',
  },
};

// ────────────────────────────────────────────────────────────────────
// LAYER 2: PREFERENCE PATTERNS (Full view — "easier with...")
// ────────────────────────────────────────────────────────────────────
//
// Conditions explicitly NOT included as named patterns (too high
// within-population variability or too sensitive to clinically frame):
//
//   - Depression / bipolar (visual needs too state-dependent)
//   - PTSD / anxiety triggers (too individual and case-specific)
//   - Tourette's (highly individual)
//   - OCD (preferences vary; addressed via raw axes)
//
// Users with these conditions are best served by raw preference axes.

export const PREFERENCE_PATTERNS = {

  // ── CVD (clinical colour vision — direct naming OK) ──────────────
  cvd_protan: {
    label: 'CVD — Protan',
    description: 'No red-green confusion zones in the palette.',
    caveat: 'Hue separation tested against the protan confusion axis.',
    test: isProtanSafe,
  },
  cvd_deutan: {
    label: 'CVD — Deutan',
    description: 'No red-green confusion zones in the palette.',
    caveat: 'Deutans see reds slightly brighter than protans, but the same hue-separation rules apply.',
    test: isDeutanSafe,
  },
  cvd_tritan: {
    label: 'CVD — Tritan',
    description: 'No blue-yellow confusion zones in the palette.',
    caveat: 'Hue separation tested against the tritan confusion axis.',
    test: isTritanSafe,
  },

  // ── Migraine / photosensitivity ──────────────────────────────────
  easier_with_migraine: {
    label: 'Easier with migraine',
    description: 'Low chroma, soft contrast, no harsh surfaces — reduces common visual triggers.',
    caveat: 'Migraine triggers vary. Some people also need reduced motion (separate setting). Not all migraine sufferers find these themes helpful.',
    test: (t) => t.chroma === 'calm' || t.calmHC || (maxChromaOf(t) < 0.08 && t.contrastEmphasis < 8),
  },

  // ── Post-concussion / brain injury ───────────────────────────────
  easier_with_post_concussion: {
    label: 'Easier with post-concussion',
    description: 'Low-stimulation environment for recovery — soft, gentle, low-contrast.',
    caveat: 'Recovery needs change over time. What helps in early recovery may feel under-stimulating later.',
    test: (t) => t.chroma === 'calm' || t.calmHC || (maxChromaOf(t) < 0.08 && t.contrastEmphasis < 8),
  },

  // ── Chronic fatigue / long COVID / ME ────────────────────────────
  easier_with_chronic_fatigue: {
    label: 'Easier with chronic fatigue',
    description: 'Reduced visual processing load — preserves cognitive energy.',
    caveat: 'Energy varies day to day. Composable with other settings as your needs change.',
    test: (t) => t.chroma === 'calm' || t.calmHC || maxChromaOf(t) < 0.10,
  },

  // ── Photophobia / light sensitivity ──────────────────────────────
  easier_with_photophobia: {
    label: 'Easier with light sensitivity',
    description: 'Dark background or warm-tinted soft surface — reduces glare.',
    caveat: 'Some people with light sensitivity find dark themes worse (text glow). Try both.',
    test: (t) => t.luminance === 'dark' || (t.chroma === 'calm' && t.luminance === 'light'),
  },

  // ── Dyslexia ─────────────────────────────────────────────────────
  easier_with_dyslexia: {
    label: 'Easier with dyslexia',
    description: 'Soft warm background, no harsh white — reduces visual disturbance for many dyslexic readers.',
    caveat: 'Dyslexic preferences vary. Some readers prefer specific tints (cream, peach, mint) — explore.',
    test: (t) => t.bgL > 0.85 && t.bgL < 0.96 && isWarmHue(t.primaryHue),
  },

  // ── ADHD (split — variability acknowledged) ──────────────────────
  easier_with_adhd_calm: {
    label: 'Easier with ADHD — calm',
    description: 'Low visual noise — reduces decision overhead for focus-seeking ADHD profiles.',
    caveat: 'ADHD splits widely on visual preferences. If you find vivid colours engaging instead, try the bold pattern.',
    test: (t) => t.chroma === 'calm' || t.chroma === 'grey' || t.isMonoPalette || maxChromaOf(t) < 0.10,
  },
  easier_with_adhd_engaging: {
    label: 'Easier with ADHD — engaging',
    description: 'Vibrant palette — many ADHD profiles focus better with strong visual interest.',
    caveat: 'ADHD splits widely. If you find vivid themes overwhelming, try the calm pattern.',
    test: (t) => maxChromaOf(t) >= 0.15 && !t.calmHC && t.contrastBase >= 4.5,
  },

  // ── Autism (split — variability acknowledged) ────────────────────
  easier_with_autism_calm: {
    label: 'Easier with autism — calm',
    description: 'Reduced sensory input — gentle palette, low contrast, predictable surface.',
    caveat: 'Autism includes wide sensory variability. Some autistic users prefer bold high-contrast — try the bold pattern.',
    test: (t) => t.chroma === 'calm' || t.calmHC || (t.chroma === 'grey' && !t.hc),
  },
  easier_with_autism_bold: {
    label: 'Easier with autism — bold',
    description: 'High-contrast vivid palette — supports autistic users who find clear strong visuals easier than soft ambiguous ones.',
    caveat: 'Autism includes wide sensory variability. If bright colours feel overwhelming, try the calm pattern.',
    test: (t) => t.hc && maxChromaOf(t) >= 0.15,
  },

  // ── Low vision ───────────────────────────────────────────────────
  easier_with_low_vision: {
    label: 'Easier with low vision',
    description: 'High contrast, clear colour separation — supports residual vision.',
    caveat: 'Low vision is a wide category. Specific conditions (macular degeneration, glaucoma, cataracts) may need different sub-themes.',
    test: (t) => t.contrastBase >= 7,
  },

  // ── Cataracts (yellow-tint perception) ───────────────────────────
  easier_with_cataracts: {
    label: 'Easier with cataracts',
    description: 'Cool-tinted bg compensates for the yellow shift cataracts cause in vision.',
    caveat: 'Pre-surgery cataracts shift perception toward yellow. Post-surgery, perception returns to normal — preferences change.',
    test: (t) => isCoolHue(t.primaryHue) && t.contrastBase >= 4.5,
  },

  // ── Floaters / vitreous detachment ───────────────────────────────
  easier_with_floaters: {
    label: 'Easier with floaters',
    description: 'Dark background — light backgrounds make floaters more visible against bright surfaces.',
    caveat: 'Helps reduce floater visibility; doesn\'t change the underlying condition.',
    test: (t) => t.luminance === 'dark',
  },

  // ── Astigmatism (halation reduction) ─────────────────────────────
  easier_with_astigmatism: {
    label: 'Easier with astigmatism',
    description: 'Soft contrast reduces halation — sharp high-contrast edges can blur for some astigmatic eyes.',
    caveat: 'Astigmatism varies. Some prefer high contrast for sharpness; others find soft contrast easier to focus.',
    test: (t) => t.contrastBase >= 4.5 && t.contrastEmphasis < 10,
  },

  // ── Outdoor / sunlight use (situational) ─────────────────────────
  easier_outdoors: {
    label: 'Easier outdoors',
    description: 'High contrast holds up in bright sunlight — useful for outdoor screen use.',
    caveat: 'Situational, not a disability — listed because users may want this filter.',
    test: (t) => t.contrastBase >= 7,
  },

  // ── Night use (situational) ──────────────────────────────────────
  easier_at_night: {
    label: 'Easier at night',
    description: 'Dark background, warm tones — reduces blue light, less disruptive to sleep cycle.',
    caveat: 'Situational, not a disability — listed because users may want this filter.',
    test: (t) => t.luminance === 'dark' && (isWarmHue(t.primaryHue) || t.chroma === 'calm'),
  },

  // ── OLED battery (situational) ───────────────────────────────────
  easier_on_oled: {
    label: 'Easier on OLED battery',
    description: 'Dark themes preserve battery on OLED screens by leaving pixels off.',
    caveat: 'Situational. Brand mono / windows-mono variants with HC give the most pixel-off area.',
    test: (t) => t.luminance === 'dark' && t.bgL < 0.20,
  },
};

// ────────────────────────────────────────────────────────────────────
// LEGACY EXPORT (keeps validator working unchanged)
// ────────────────────────────────────────────────────────────────────

export const ACCESSIBILITY_PROFILES = {
  ...PREFERENCE_AXES,
  ...PREFERENCE_PATTERNS,

  // ── WCAG (kept for backward compat — overlap with axes/patterns is fine) ──
  wcagAA: {
    label: 'WCAG AA',
    description: 'Body text contrast ≥ 4.5:1 — passes WCAG AA for normal text.',
    test: (t) => t.contrastBase >= 4.5,
  },
  wcagAAA: {
    label: 'WCAG AAA',
    description: 'Body text contrast ≥ 7:1 — passes WCAG AAA for enhanced contrast.',
    test: (t) => t.contrastBase >= 7,
  },
  calmContrast: {
    label: 'Calm contrast',
    description: 'Intentionally soft contrast — for migraine, ADHD, sensory, post-concussion users. By design, not a fail.',
    test: (t) => t.contrastBase < 4.5 && (t.chroma === 'calm' || t.calmHC),
  },
};
