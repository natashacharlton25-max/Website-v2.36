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

## Decision 19: Scale Flip — No Semantic Token Layer (18 March 2026)

**Dark mode flips the scale positions.** `var(--primary-600)` is always a strong mid-tone — dark in light mode, bright in dark mode. The engine swaps pairs: 100↔950, 200↔900, 300↔800, 400↔700, 500↔600.

- **No `--brand-c-*` semantic tokens** — deleted from engine output and all CSS files
- **No `--text-body` / `--text-secondary`** — deleted, replaced by direct scale references
- Neutral scale gap filled: `--neutral-300` added (L=0.82) so 300↔800 flip works for all scales
- JSON references positions directly: `var(--primary-600)` resolves correctly in every mode
- Same pattern as rainbow dark flip

### Deleted:
- `computeSemanticTokens()` function in theme engine
- `BRAND CONVENIENCE TOKENS` block in generated CSS
- `TEXT TOKENS` block in generated CSS
- All `--brand-c-*` references across ~150 CSS/Astro files
- All `--text-body` / `--text-secondary` / `--text-emphasis` / `--text-inverse` references

---

## Decision 20: No CSS Fallbacks — Schema Owns Defaults (18 March 2026)

**Colour defaults live in the schema `colour` section, not in CSS fallbacks.**

Old pattern (deleted): `--_heading-accent: var(--heading-accent, var(--brand-c-primary));`
New pattern: `--_heading-accent: var(--heading-accent);`

Schema declares: `"headingAccent": { "default": "primary-600", "cssProperty": "--heading-accent" }`

The pipeline reads the schema default and sets the inline style. If the pipeline doesn't provide a value, it breaks visibly — no silent fallbacks hiding missing data.

---

## Decision 21: Each Atom Owns Its Own Colours (18 March 2026)

**No cross-atom colour declarations.** Heading doesn't declare icon colour, badge colour, or image background. Each atom's schema defines its own colour tokens.

- Badge owns `--badge-bg`, `--badge-text`, `--badge-border`
- Icon owns its colour (via `currentColor` inheritance)
- Heading owns only: `--heading-color`, `--heading-accent`, `--heading-underline`, `--heading-highlight`, `--heading-media-bg`, `--heading-underline-gradient`

Badge variant removed from Heading. Badge atom accepts `level` prop to render as heading element via Heading atom internally.

---

## Decision 22: Page Template IS the Pipeline (18 March 2026)

**No separate pipeline system.** The Astro page template reads JSON, filters props per render mode, and renders atoms. That IS the pipeline.

All render modes baked in at build time. CSS toggles which shows:

```css
.render-full { display: contents; }
.render-reduced { display: none; }
.render-textonly { display: none; }

[data-render="textonly"] .render-full { display: none; }
[data-render="textonly"] .render-textonly { display: contents; }
```

| Mode | Props passed | What changes |
|---|---|---|
| Full | content + visual + animation + colour | Everything |
| Reduced | content + visual + colour (no animation) | LottieIcon → static Icon fallback |
| Textonly | content only (level, text, subtitle) | Plain heading, no decoration |

---

## Decision 23: LottieIcon Trigger System (18 March 2026)

**Single `trigger` prop replaces `autoplay`/`loop` booleans.**

| Trigger | Behaviour |
|---|---|
| `none` | Static — shows first frame |
| `autoplay` | Plays once on load |
| `loop` | Plays continuously |
| `hover` | Forward on hover/focus, reverse on leave |
| `interval` | Plays once every N ms (default 20s) |

- Hover trigger respects `data-hover` gate — mouse blocked when `none`, focus always works
- LottieIcon owns all animation config — Heading passes object through, doesn't know about triggers
- `lottieIcon` prop accepts string (slug) or object (`{ slug, trigger, interval }`)

---

## Decision 24: Symbol Set Runtime Switching (18 March 2026)

**Cards carry `data-bci` attribute. Runtime swaps pictogram src per symbol set.**

- Build time: ARASAAC images baked in + `data-bci` on each card
- Runtime: panel button → `swapSymbolSet(baseUrl, extension)` → replaces all `<img>` src
- `restoreOriginalSymbols()` puts back build-time ARASAAC images
- Bliss: 6,411 SVGs in R2 at `symbols/bliss/{bci_index}.svg`
- Custom: user-provided JSON mapping (`{ "bci_index": "image_url" }`)

---

## Decision 25: Section Atom (18 March 2026)

**Layout atom for content grouping.** Uses existing container system (`container-7xl` etc.). Handles spacing via `gap` prop, separators, labels.

No hardcoded layout in page templates — Section atom controls all spacing and width.

---

## Decision 26: Warm Dark Background (18 March 2026)

**Dark mode uses `#1f1c1c` (warm dark) instead of `#121212` (M2 flat black).** HC dark keeps pure `#000000`.

Page background hierarchy: sunken (`#141111`) → base (`#1f1c1c`) → raised (`#302b2b`) → overlay (`#3a3434`).

---

## Decision 27: Content AAC — Dual System (18 March 2026)

**Two independent AAC toggles:**

| System | Trigger | Purpose |
|---|---|---|
| Image AAC | `data-alt-text-mode="aac"` | Pictogram cards describing images |
| Content AAC | `data-content-aac` | Pictogram cards replacing text/heading content |

Content AAC is a render mode replacement — when active, text hides, cards show. Built at build time via `aacInline()`, cached by Cloudflare.

---

## Decision 28: AAC Card Light Background Across All Themes (18 March 2026)

**AAC cards always have a light background regardless of theme.** Pictograms (ARASAAC PNGs) have baked-in white backgrounds — dark card faces create jarring contrast.

- Light mode: `--neutral-200` (light grey)
- Dark mode: `--neutral-900` (post-flip = light grey)
- Text-only cards: slightly differentiated (`--neutral-800` dark mode)
- Scale flip ensures both evaluate to the same visual lightness

Card borders use CVD-aware status tokens (`--color-Success`, `--color-Warning`) — every theme defines protan/tritan-safe variants. No separate CVD logic on cards.

---

## Decision 29: BCI Index as Universal Symbol Key (18 March 2026)

**Every AAC card carries `data-bci` (Blissymbolics Communication International index).** This is the universal key for symbol set switching.

- `aac-inline.ts` carries `bci_index` from our API even when falling through to OpenSymbols for the image
- `swapSymbolSet()` finds cards by `data-bci`, swaps `<img>` src to `{baseUrl}{bci}.svg`
- Custom symbol sets: user provides JSON mapping `{ "bci_index": "image_url" }` at any URL
- Bliss SVGs: 6,411 in R2 at `symbols/bliss/{bci_index}.svg`, served locally in dev via `public/symbols/bliss/`

---

## Decision 30: AAC Pictogram Filter — User Choice (18 March 2026)

**Pictogram colour filtering is a panel toggle, not automatic.** Two options: grayscale and sepia.

- `data-aac-filter` on `<html>` drives CSS
- Grayscale uses existing `--img-filter-grayscale` token
- Sepia uses existing `--img-sepia` token
- Monochrome themes also apply `--img-filter-grayscale` via `[data-theme-chroma="grey"]`
- Temporary measure — when pictograms are SVGs (via Canva Convert API), recolor with theme tokens instead

---

## Decision 31: Content AAC Scoped Text Hiding (18 March 2026)

**When Content AAC is active, only hide text in elements that HAVE AAC cards.** Previous implementation hid all `.heading-wrap__text-inner` globally — broke headings without `aac: true`.

Fix: CSS `:has()` selector scopes hiding to elements containing `.heading__aac`:
```css
[data-content-aac] .heading-wrap__content:has(.heading__aac) .heading-wrap__text-inner { display: none; }
[data-content-aac] .heading:has(.heading__aac) .heading__text-inner { display: none; }
```

---

## Decision 32: AAC Card Consistent Typography (18 March 2026)

**AAC card word labels use `--font-body` at `--text-sm` with `font-weight: 500`.** Cards never inherit heading font sizes or families. The panel font swapper still works because it overrides `--font-body` at the wrapper level.

---

## Decision 33: Heading Media Container Tokens (18 March 2026)

**The `.heading-wrap__media` container accepts border, shadow, and radius via CSS custom properties — no bridge tokens.** JSON sets values directly:

- `--heading-media-border` — e.g. `2px solid var(--primary-400)`
- `--heading-media-shadow` — e.g. `var(--shadow-elevated)` (self-adapts to light/dark)
- `--heading-media-radius` — e.g. `var(--radius-lg)` or `50%`

Works for both images and icons since both sit in the same container.

---

## Decision 34: R2 Serving Route (18 March 2026)

**Worker has `/r2/:path` route for generic R2 object serving.** Serves any R2 object by exact key with auto-detected MIME type. Used by Bliss symbol switching (`symbols/bliss/{bci_index}.svg`). Separate from `/images/:path` which prepends `images/` to the key.

---

## Decision 35: Badge Dark Mode — Pre-Flipped Scale Tokens (18 March 2026)

**Dark themes have scales already flipped in the theme file.** `--primary-100` = dark, `--primary-950` = light. The dark zone CSS uses the tokens as-is — no double flip.

Dark mode badge tokens:
- **Fill bg**: `--primary-300` (dark subtle wash)
- **Text**: `--primary-900` (light, readable)
- **Border**: `--primary-700` (bright accent, pops against fill)
- **Glass border**: `--neutral-200` (subtle, theme-neutral, works all modes)

---

## Decision 36: Badge Border Inherits from Background (18 March 2026)

**`--_badge-border` falls back to `--_badge-bg` unless explicitly overridden.** If JSON sets `--badge-bg: var(--color-Success)`, the border automatically matches. Only set `--badge-border` when a different border colour is needed.

```css
--_badge-border: var(--badge-border, var(--_badge-bg));
```

This eliminates duplicate colour declarations in JSON and keeps badge borders consistent with their fill.

---

## Decision 37: Badge and Button Visual Convergence (18 March 2026)

**Badge and Button share identical visual CSS** (fill/outline/glass, sizes, shapes, icons). Future refactor: Badge becomes a semantic wrapper that renders a Button with preset defaults (no hover/focus interaction, uppercase, semantic role). Badge owns the **semantic role**, Button owns the **visual rendering**.

---

## Decision 38: JSON Colour Defaults — Let CSS Handle Mode Switching (18 March 2026)

**JSON `colour` block should NOT set `--badge-bg` or `--badge-text` defaults** — only border. Background and text are handled by CSS per mode (light base CSS, dark zone CSS). Inline styles from JSON override zone CSS and prevent dark mode fallbacks from activating.

Pattern: JSON sets structural tokens (border), CSS handles mode-adaptive tokens (bg, text).

---

## Decision 39: Text Scaling via HTML Root Font-Size (18 March 2026)

**Text scaling sets `font-size` on `<html>` so all `rem` tokens scale.** Previous approach used CSS `zoom` on `#a11y-content-wrapper` which broke OverlayScrollbars positioning and sticky nav.

Architecture:
- `<html>` `font-size: ${value}%` — scales all `rem`-based tokens site-wide
- Nav: `font-size: 16px` on `.nav-container` — pinned, immune to scaling
- Panel: outside `#a11y-content-wrapper` — immune by DOM position
- Works on every page, every theme, every render mode

This is permanent infrastructure, not a workaround. The stepper in TypographyAdjustmentsSection (50%–200%) drives it via `applySettings()`.

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
