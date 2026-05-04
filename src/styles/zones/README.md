# Zones

Mode-aware CSS layers that activate via `data-*` attributes on `<html>`.

Themes set token values. Components consume tokens. Zones rewrite how
components express themselves when a particular mode/need is active.
Themes don't know about zones; zones don't know about themes; both read
the same `<html>` attributes and respond independently.

## How activation works

Two signal paths feed `<html>` data attributes:

```
Theme CSS meta tokens          ThemeSwitcher reads them, sets attrs
─────────────────────          ─────────────────────────────────────
--theme-luminance: dark        data-mode="dark"
--theme-chroma: calm           data-theme-chroma="calm"
--theme-chroma: grey           data-theme-chroma="grey" + data-theme-no-chroma
--theme-contrast: hc           data-high-contrast

User panel toggles             Panel sets attrs directly
─────────────────────          ─────────────────────────────────────
"No Colour"                    data-no-chroma
"Highlight Links"              data-highlight-links
... etc
```

Some zones are theme-driven (dark mode follows whatever theme says).
Some are user-driven (highlight-links is panel only).
The no-chroma gate is **both** — see below.

## Files in this folder

| File | Activates on | Owned by | Job |
|------|--------------|----------|-----|
| `theme-luminance-dark.css` | `[data-mode="dark"]` | Theme | Dark-mode CSS rewrites: shadow tokens flip, glass swaps, button hover, card borders |
| `theme-chroma-calm.css` | `[data-theme-chroma="calm"]` | Theme | Calm-theme overrides: glass badges, no gradients/shadows/animations, text size boost |
| `high-contrast.css` | `[data-high-contrast]` | Theme | HC overrides: thicker borders, solid focus rings, opaque glass, larger form controls |
| `no-chroma.css` | `[data-no-chroma]` OR `[data-theme-no-chroma]` | Both | Strips hue-dependent affordances: greyscale filter, dotted focus, link underlines, status text-pairing, surface borders |

## The no-chroma gate (special case)

This gate has **two activation paths** because it serves two scenarios:

1. **User toggles "No Colour"** in the Your View panel
   → panel sets `data-no-chroma`

2. **User picks a mono theme** (mono-pure / mono-warm / mono-cool)
   → ThemeSwitcher reads `--theme-chroma: grey` from the loaded theme CSS
   → ThemeSwitcher sets `data-theme-no-chroma`

Both attributes match the same CSS via `:is([data-no-chroma],[data-theme-no-chroma])`.
Same rules fire from either trigger.

### Why two attributes?

If we used one attribute and let ThemeSwitcher remove it when leaving a
mono theme, we'd silently turn off the user's panel toggle. Two
attributes keep the two states independent — switching themes never
cancels the user's choice, and toggling the panel never depends on
which theme is loaded.

### What the gate does

CSS-level rules (in `no-chroma.css`):

- Page-wide `filter: grayscale(1)` — desaturates everything: text, images, SVGs, gradients
- Lottie SVGs forced to `currentColor`
- Focus ring: dashed outline + dotted inner ring (pattern, not colour)
- Links: mandatory underline + bold weight + dotted on hover + dashed on visited
- Disabled: strikethrough + not-allowed cursor (replaces the usual opacity dim)
- Status fills: text-colour pairing by lightness (light text on dark fills, dark on light)
- Surface borders: cards/panels/sections get visible borders so groupings read structurally
- Hover: dashed border-style change instead of bg lightness shift
- Active/pressed: position translate + inset shadow instead of bg darken
- Selection: chunky left border + bold weight instead of bg-tint
- Skeleton: lightness-only shimmer
- Status icon enforcement: components missing icons get a magenta dev warning

### Sibling gates the panel auto-enables alongside no-chroma

The no-chroma gate doesn't own typography or opacity — those are separate
gates. The Your View panel auto-enables them when no-chroma is toggled:

- **xl text gate** — bumps body/headings one size tier (compensates for
  reduced contrast headroom when chroma can't separate slots)
- **opacity-off gate** — forces opacity to 1 (ghost/subtle states would
  collapse readability without the chroma channel to differentiate)
- **(optional) reduced-motion gate** — common comorbidity for users
  with severe CVD/achromatopsia (nystagmus), suggested but not auto-on

Each is independent — user can override individually. The defaults
exist because no-chroma alone, without these siblings, doesn't deliver
the full accessibility picture.

## Adding a new zone

1. Create `src/styles/zones/your-zone.css`
2. Scope every selector to the activating attribute: `[data-your-zone] .component { ... }`
3. Import in `src/styles/global.css` alongside the other zones
4. Decide: theme-driven (ThemeSwitcher reads a meta token), user-driven
   (panel toggle), or both (use two attributes like no-chroma does)
5. If panel-driven: add the setting to `A11ySettings` in
   `src/components/YourView/a11y-panel.ts`, the `defaultSettings`
   object, and the `toggleAttribute(...)` block
6. Add a row to the table above

## Anti-patterns

- **Don't put `[data-theme-chroma="grey"]` selectors in component CSS.**
  Use `[data-no-chroma], [data-theme-no-chroma]` if the rule is about
  no-chroma behaviour, or add it to `no-chroma.css` directly.
- **Don't couple zones to specific themes.** A zone should work with
  any theme that emits the right meta token (or any user toggle that
  sets the right attribute). Coupling means rewriting the zone every
  time a theme is added.
- **Don't strip safety signals in any zone.** Focus rings + link
  underlines are accessibility-critical regardless of theme/zone.
  Replace the signal with a non-colour alternative, never remove it.
