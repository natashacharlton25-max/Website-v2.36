# Theme Engine: Principles and Why They Matter

**Read this before editing any theme code. These principles are the point of the engine. Code that violates them is wrong, even if it looks cleaner or passes tests.**

## Who this is for

Mind the Box CIC builds accessibility-first therapeutic content. The theme engine serves users with:
- Visual hypersensitivity (pure white causes retinal glare and pain)
- Visual hyposensitivity (pure black loses detail, causes eye strain)
- Migraine sensitivity (high chroma and high contrast trigger episodes)
- ADHD (visual noise increases cognitive load)
- Colour vision deficiencies (protan, deutan, tritan)
- Dyslexia (warm backgrounds reduce reading fatigue)
- Low vision (contrast ratios must be provable, not approximate)

The engine is not a general colour tool. It is a safety system that produces WCAG-passing, accessible, visually varied themes from any input — including inputs that would normally break or look bad.

## The core pattern: input is a hint, not ground truth

Most theme engines treat the designer's hex as ground truth. "You said red, here's red." If the red fails contrast, that's the designer's problem.

This engine treats input hex as a *starting hint*. The theme's own rules dictate lightness and chroma. The input provides hue only.

The calm scale generator shows this pattern clearly:

```js
const [, , h] = chroma(baseHex).oklch();  // extract hue only
const hue = h || 0;                        // fallback to red for achromatic
for (const pos of SCALE_POSITIONS) {
  const targetL = CALM_LIGHTNESS_MAP[pos];          // lightness from theme
  const chromaVal = targetL >= 0.75 ? 0.025 : 0.020; // chroma from theme
  scale[pos] = safeOklch(targetL, chromaVal, hue);
}
```

Lightness and chroma come from the theme's hardcoded map. Only hue comes from the input. The output is *always* calm-shaped, regardless of what went in.

**This pattern applies to every theme type.** Brand, dark, HC, calm, greyscale — each has its own lightness map and chroma rules. Input provides hue. Theme provides shape.

## Non-negotiable principles

### 1. No pure black, no pure white, no zero chroma

Pure `#ffffff` causes retinal glare for hypersensitive users. Pure `#000000` causes detail loss for hyposensitive users. Zero-chroma greyscale looks clinical.

Every theme generator must guarantee:
- Lightness never reaches 0 or 1
- Chroma has a minimum floor (even greyscale has 0.018)
- Backgrounds are warm cream, warm charcoal, or hue-tinted whisper — never pure anchors

This is why black/white/grey input to the calm generator produces a dusty-rose scale, not a grey scale. The generator is *protecting users from input that would hurt them*.

Do not "fix" this behaviour. It is the feature.

### 2. Contrast ratios are targeted, not observed

WCAG targets are promises to the user. "5.5:1 at position 700" is a guarantee, not a suggestion.

`findLightnessForContrast` binary-searches for the exact lightness that achieves a target contrast ratio against a given background. `generateBrandScale` uses it for positions 700/800/900/950 to guarantee AA/AAA text levels.

If a refactor makes contrast a side-effect of chroma choices rather than an explicit target, that refactor is wrong.

### 3. Hue identity is preserved through gamut clamping

When OKLCH colours convert to sRGB hex, out-of-gamut colours get clamped. Naive clamping shifts the hue — a vivid green at extreme lightness might come out as brown.

`safeOklch` detects hue drift greater than 8° and binary-searches for the maximum chroma that holds the hue. This is why a green input stays visibly green across the whole scale, even at very dark or very light positions.

If a refactor strips this in favour of "just clamp to sRGB," that refactor is wrong.

### 4. Accessibility modes are first-class generators

HC, calm, greyscale, CVD are not "filters applied on top of a normal theme." They are their own generators, with their own lightness maps, their own chroma rules, their own page backgrounds, their own neutral tweaks.

A calm theme is not "a brand theme with muted chroma." It is a theme tuned for migraine sensitivity, with specific lightness compression (`CALM_LIGHTNESS_MAP`), specific chroma floors, specific dark-mode L values (`CALM_DARK_L`), specific page backgrounds (hue-tinted for HC, warm cream for non-HC).

Claude Code's previous attempt to "unify calm with brand" destroyed this distinction. Do not do this again.

### 5. Combinations are part of the generator, not a dispatcher concern

HC × calm is not "run calm, then apply HC on top." HC × calm is its own branch: `calmHC` generates whisper-grey backgrounds with input hue tint, bumps chroma to 0.055, targets specific contrast ratios. These overrides live inside the calm generator's logic, not in a separate HC modifier.

Same for dark × calm, HC × greyscale, CVD × HC. Each combination has been tuned and tested. Do not assume combinations can be decomposed into "apply modifier A then modifier B."

### 6. Input hue behaviour for achromatic colours

`#ffffff`, `#000000`, `#808080` and other achromatic inputs return NaN hue from chroma-js. Currently the engine substitutes hue 0 (red) silently.

For the rebuild: detect achromatic input explicitly and either:
- Prompt the user to pick a hue (warm / cool / accent hue)
- Default to the brand hue from brandconfig.json
- Route to a monochrome theme

Do not silently substitute a default hue without telling the user.

## What makes this engine different from "a theme engine"

Most theme engines optimise for:
- Designer intent preserved exactly
- Simple, generalisable, few special cases
- Input colour = output colour

This engine optimises for:
- User safety non-negotiable
- Accessibility modes are first-class, not afterthoughts
- Every output guaranteed to pass specific WCAG targets
- Visual variety (no two themes look the same) while enforcing the same safety floors
- Designer intent *bent toward* accessibility when they conflict

If you find yourself thinking "this would be cleaner if we just unified X and Y" — stop. The split is usually protecting a user group. Ask before unifying.

## Rules of engagement for editing this engine

1. Do not unify code paths that have different comment headers. They're separate because the edge cases diverge.
2. Do not remove the `CALM_LIGHTNESS_MAP`, `CALM_DARK_L`, HC bump values, greyscale neutral tweaks, or any hardcoded number in a theme generator without explicit instruction. These are hand-tuned over months.
3. Do not delete `safeOklch`'s hue-drift binary search or replace it with a simpler clamp.
4. Do not change `findLightnessForContrast` to use approximate ratios.
5. Do not silently handle achromatic input. Prompt or route.
6. If you believe a principle in this document is preventing a necessary change, say so and wait for instruction. Do not improvise around it.

## What success looks like

A user passes any hex — vivid, muted, achromatic, extreme. The engine produces:
- A complete scale that passes WCAG targets
- Visibly distinct from other themes (variety)
- Safe from glare, strain, triggers (accessibility)
- Recognisably the theme type they picked (calm looks calm, brand looks brand)

That is the job. Everything else is implementation detail.
