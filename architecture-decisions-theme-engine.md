# Architecture Decisions — Theme Engine + Behavioural CSS Layers

**Date:** 8–9 March 2026
**Sessions:** Colour token system rewrite, dark mode M2, accessibility research, CVD palettes, atom prop layer

---

## Decision 1: Two-Layer Token Architecture

**Raw scales are the creative palette. Atoms consume props with token fallbacks.**

The theme engine outputs colour scales for primary, secondary, and neutral. These are the vocabulary. Atoms have CSS custom properties (e.g. `--card-bg`) that the JSON pipeline will provide. Until the pipeline is built, token-to-token fallbacks bridge the gap.

- **Scales** = creative vocabulary (primary 100–950, secondary 100–950, neutral 100–950)
- **Contrast utility** = WCAG enforcement at build time (`getContrastToken()`)
- **Atom prop layer** = `var(--card-bg, var(--brand-c-bg))` — JSON overrides, theme fallback
- **Semantic `--brand-c-*` tokens** = backward compatibility bridge (deleted when pipeline is live)

---

## Decision 2: Three Behavioural CSS Axes (Stackable)

Visual behaviour is controlled by three independent axes. Each is a global CSS file gated on a `data-` attribute. They stack freely.

| Axis | Token | Data attribute | CSS file | Controls |
|---|---|---|---|---|
| Luminance | `--theme-luminance` | `data-theme-luminance` | `theme-luminance-dark.css` | Shadows→glow, glass swap, media brightness |
| Chroma | `--theme-chroma` | `data-theme-chroma` | `theme-chroma-mono.css` | Image desaturation, rainbow→primary scale, media saturation |
| Intensity | `--theme-intensity` | `data-theme-intensity` | `theme-intensity-soft.css` | Shadow softness, glow reduction, pattern opacity, motion dampening |

### No per-atom rules needed.

Atoms consume tokens. These CSS files override token values globally. Atoms respond automatically without knowing these files exist.

---

## Decision 3: Render Mode vs Visual Mode — Separate Concerns

| Type | Mechanism | Per-atom rules? | What changes |
|---|---|---|---|
| Render mode (full/reduced/assistive/textonly) | Pipeline strips props + `[data-render]` selectors in CSS | **Yes** — structural | Which atoms exist, layout, decorative hidden |
| Visual mode (luminance/chroma/intensity) | Token overrides in global CSS files | **No** — token swaps only | How existing atoms look |

### How render modes work:

1. **Pipeline decides** — schema says `"textonly": null` → component never renders
2. **Pipeline strips props** — schema says `"textonly": false` on icon → prop removed before component receives it
3. **Component is pure** — always renders what it's given, never checks render mode
4. **CSS fills the gap for now** — `[data-render="textonly"]` rules handle visual hiding until pipeline exists

---

## Decision 4: Theme Engine — Importable Module, No CVD Logic

**File:** `src/utils/theme-engine.js`

- Works in browser AND Node (no `fs`, `path`)
- Single dependency: `chroma-js`
- **No CVD logic** — receives hex values, generates scales. Safety in picker UI.
- Three consumers: build script, Cloudflare Worker, browser live preview

### Engine outputs per theme:

- Primary scale (100–950), Secondary scale (100–950), Neutral scale (100–950)
- Page backgrounds (4 tokens)
- Status colours (6 tokens)
- Text tokens (4) + heading/link tokens (4)
- Semantic brand tokens (backward compat bridge)
- Theme meta tokens (3)

### Engine does NOT output:

- Rainbow tokens (global CSS files)
- Shadow overrides (behavioural CSS)
- Media filters (behavioural CSS)

---

## Decision 5: Brand Config — Four Tiers via Folder Gating

| Tier | Folders | Themes available |
|---|---|---|
| Basic | `brand` | Brand default + dark = 2 |
| Standard | `brand` + `a11y` | Brand + ~20 a11y |
| Full | `brand` + `a11y` + `fun` | Everything |
| Custom | All + picker | Everything + Build My Own |

No files copied between tenants. Config gates folder access. Adding a tenant = brand config JSON + run build.

---

## Decision 6: Colour Scales (OKLCH) — 100 to 950

10 positions per family. Neutral perceptually spaced (wider gaps mid-range):

| Position | Neutral role |
|---|---|
| 100 | White / dark mode emphasis text |
| 200 | Card surface / dark mode body text |
| 400 | Borders / dark mode secondary text |
| 500–600 | Decorative, icons |
| 700 | Light mode secondary text |
| 800 | Light mode body text (7.2:1) |
| 900 | Light mode emphasis text |
| 950 | Black |

Dark mode primary/secondary at position 300 (not 200 — low-chroma washes out at 200).

---

## Decision 7: No Pure Black or White (Except HC)

`--color-White` = `#fafafa`. `--color-Black` = `#1a1a1a`. HC only: `#000000` / `#ffffff`.

---

## Decision 8: Rainbow = Four Global CVD-Separated Palettes

| Palette | User picks | File |
|---|---|---|
| Default | Full Colour | `rainbow-default.css` — ROYGBIV |
| Protan/Deutan | "No Reds" | `rainbow-protan.css` |
| Tritanopia | "No Blues" | `rainbow-tritan.css` |
| Monochrome | "Just One" | `theme-chroma-mono.css` — `var(--primary-*)` |

35 tokens per palette (7 × 5 tints: wash/light/base/dark/deep). Dark mode flips per file. Monochrome inherits user's chosen hue via primary scale.

---

## Decision 9: CVD Safety in Picker UI, Not Engine

Engine has zero CVD logic. CVD variants are explicit JSON definitions with hand-picked hex values from rainbow safe palettes. Protan/deutan share one variant.

---

## Decision 10: 112 Theme Files

5 a11y bases (22 files) + 15 fun bases (90 files) = 112. Two name registers (fun/pro) per theme. Generated `theme-names.json` drives card display.

---

## Decision 11: Dedicated Text Tokens

| Token | Light | Dark | HC dark |
|---|---|---|---|
| `--text-body` | neutral-800 | neutral-200 | `#ffffff` |
| `--text-secondary` | neutral-700 | neutral-400 | `#cccccc` |
| `--text-emphasis` | neutral-900 | neutral-100 | `#ffffff` |
| `--text-inverse` | neutral-400 | neutral-900 | `#000000` |
| `--heading-accent` | primary-600 | primary-300 | primary-300 (neon) |
| `--link-color` | primary-600 | primary-300 | primary-300 |

---

## Decision 12: Semantic Brand Tokens — Bridge Pattern

`--brand-c-*` tokens use `var()` refs to scales. "Light" = light-coloured. "Dark" = dark-coloured. Lifecycle: fallbacks now → pipeline overrides → delete bridge.

---

## Decision 13: Atom Prop Layer

Every colour ref in atom CSS wrapped as: `var(--{atom}-{prop}, var(--{fallback-token}))`. 14 atoms, ~111 colour props. Fallbacks deleted when JSON pipeline provides all values.

---

## Decision 14: M2 Dark Mode via Behavioural CSS

Theme declares `--theme-luminance: dark`. `theme-luminance-dark.css` handles shadows→none, glow system, glass swap, media filters. Page bg: `#121212` neutral (M2 spec).

---

## Decision 15: Calm Theme (was Cream) — Contrast Strategy

Compressed lightness range (bg 0.92, text 0.38). AA floor not AAA. Soft status. Fixed calming hues (blues, pinks, lilacs). Pairs with soft intensity layer.

---

## Decision 16: HC Overrides — Maximum Everything

Pure black/white. Primary/secondary brightened to max chroma. Position 300 dark mode (neon-visible). Position 600 light mode (deep on white). CVD shift before HC brighten.

---

## Decision 17: Your View — Three Entry Points

Guide Me (3 taps), Show Everything (filterable grid), Build My Own (drag and drop). "No Reds"/"No Blues" infer CVD without clinical language.

---

## Decision 18: Wellness Breaks + Carer Lock

Toast-based break prompt. Mini games from existing atoms. Carer PIN in localStorage. Four use cases: child safety, ADHD breaks, confidentiality, therapy pauses.

---

## Files Referenced

| File | Purpose |
|---|---|
| `src/utils/theme-engine.js` | Core engine |
| `scripts/generate-theme-tokens.js` | Build script |
| `src/themes/definitions/*.json` | Theme definitions (21 bases) |
| `src/styles/tokens/rainbow-*.css` | Three rainbow palette files (35 tokens each) |
| `src/styles/zones/theme-luminance-dark.css` | Dark mode behaviour |
| `src/styles/zones/theme-chroma-mono.css` | Monochrome behaviour + rainbow override |
| `src/styles/zones/theme-intensity-soft.css` | Soft intensity behaviour |
| `src/styles/tokens/theme-names.json` | Display names for theme cards |
