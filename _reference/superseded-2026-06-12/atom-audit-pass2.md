> ⚠️ **SUPERSEDED (2026-06-12)** — historical record only. Do NOT treat as current truth.
> Current rules live in `atom-spec-v0.3.md`. Last verified accurate: March 2026.

# Atom Audit — Pass 2 Reference

**What this document is:** The canonical checklist for pass 2 (post-theme-token restructure), per-atom status tracker, and consolidated deferred items from pass 1. Paste this into any Claude conversation or Claude Code session for full context.

**Last updated:** 10 March 2026

---

## What Pass 2 Is

After the theme engine rewrite (8–9 March 2026), every atom needs verifying against the new token architecture. Pass 1 handled file structure, banned patterns, fallback stripping, Text atom composition, and render mode rules. Pass 2 ensures:

1. Every colour reference flows through internal `--_component-*` tokens
2. The JSON pipeline can override any colour via inline style
3. Variant classes and bridge fallbacks coexist correctly
4. Render mode blocks consume internal tokens, not raw bridge chains
5. Glass/shadow/blur tokens use internal routing
6. Schema colour group matches the internal token set

---

## How the Pipeline Works

JSON content author writes colour overrides (or accepts schema defaults). Pipeline resolves value → generates inline style on the element:

```html
<div class="form-field form-field--secondary form-field--glass"
     style="--field-focus: var(--rainbow-3-dark); --field-bg: var(--glass-bg-light);">
```

CSS internal token picks it up:

```css
--_field-brand: var(--field-focus, var(--brand-c-secondary));
                     ↑ inline wins        ↑ class default (permanent)
```

**Key rules:**
- Variant classes are permanent — they set the colour default via bridge fallback
- Pipeline layers on top via inline style when author overrides
- Structural variants (glass/neumorphic/glow) always need the class (they change layout/effects, not just colour)
- Schema colour group declares defaults — pipeline always resolves a value
- Authors can choose existing tokens, create custom values, or accept defaults

---

## Pass 2 Checklist — Per Atom

Run this against every atom. If a check fails, fix it. If it passes, mark it.

### P2-1. Internal token consolidation

Every colour reference in the component CSS must flow through an internal `--_component-*` token defined in the base selector.

```css
/* Base block defines internal tokens with bridge fallbacks */
.component {
  --_comp-bg: var(--comp-bg, var(--brand-c-bg));
  --_comp-text: var(--comp-text, var(--brand-c-text));
}

/* Everything else consumes internal tokens — never the raw bridge */
.component__child {
  color: var(--_comp-text);       /* ✅ correct */
  color: var(--comp-text, var(--brand-c-text));  /* ❌ raw bridge — inline style won't reach */
}
```

**Check:** grep for `var(--comp-` (without the underscore prefix) outside the base token block. Every hit outside the base block is a raw bridge that needs routing through the internal token.

### P2-2. Schema colour group matches CSS tokens

Every key in the schema `colour` group must map 1:1 to a CSS custom property and an internal token.

| Schema key | CSS property | Internal token |
|---|---|---|
| `colour.bg` | `--comp-bg` | `--_comp-bg` |
| `colour.text` | `--comp-text` | `--_comp-text` |

**Check:** count schema colour keys vs internal `--_comp-*` tokens in base block. They should match (excluding structural tokens like control sizes).

### P2-3. Render mode blocks use internal tokens

`[data-render="reduced"]`, `[data-render="assistive"]`, `[data-render="textonly"]` blocks must reference `var(--_comp-*)` — never the raw bridge chain.

**Check:** grep for `var(--comp-` inside `[data-render=` blocks. Should be zero.

### P2-4. Glass/shadow/blur internal tokens

If the component has glass, neumorphic, glow, or shadow variants, those tokens also need internal routing:

```css
--_comp-glass-bg: var(--comp-glass-bg, var(--glass-bg));
--_comp-glass-blur: var(--comp-glass-blur, var(--glass-blur));
--_comp-shadow: var(--comp-shadow, var(--shadow-neu-raised));
```

**Check:** grep for `var(--glass-`, `var(--shadow-`, `var(--glow-` in non-base blocks. Should be consumed via internal tokens.

### P2-5. No redundant token re-declarations in render blocks

If a render mode block re-declares an internal token to the same value as the base, delete it.

### P2-6. Hardcoded values → tokens where tokens exist

- `border-radius: 999px` → `var(--radius-full)`
- `font-family: monospace` → `var(--font-mono)` (if token exists)
- Any other magic numbers that have token equivalents

**Check:** grep for `999px`, `monospace`, and common hardcoded patterns.

### P2-7. Astro uses `class:list`

Component should use Astro's `class:list={[...]}` pattern, not manual `.filter(Boolean).join(' ')`.

### P2-8. Schema fieldStyle/theme/variant render behaviour documented

If visual props are stripped or reverted in non-full renders, the schema description should document the behaviour per render mode. Example: `"Reduced render strips glass/neumorphic to outlined fallback. Textonly render forces underlined. Assistive render preserves all styles."` Be specific — don't lump all non-full renders together if they behave differently.

---

## Per-Atom Status

### Primary Atoms

| Atom | Pass 1 | Pass 2 | Notes |
|---|---|---|---|
| **Text** | ✅ | ✅ DONE | No atom-specific items remaining. 3 phantom tokens fixed (--text-color→--text-body, --text-accent→--brand-c-secondary, --text-link→--link-color), colour enum aligned, no internal bridge tokens (global text tokens consumed directly). Deferred: 32+ raw `<small>` and 4 raw `<blockquote>` across molecules → migrate to `<Text>` (consumer migration). |
| **Heading** | ✅ | ✅ DONE | No atom-specific items remaining. 16 internal tokens, colour enum aligned (accent/text/muted/inherit), colour group added, class:list, render notes documented. Deferred: context overrides deletion (consumer audits), SectionTitle deprecation (consumer migration), raw `<img>` → Image atom (cross-atom), fit-content visual test (browser), `[key: string]: any` confirmation. |
| **Button** | ✅ | ✅ DONE | No atom-specific items remaining. Deferred: consumer context override cleanup (consumer audits), LottieIcon animation passthrough verify (cross-atom), print (global). |
| **Badge** | ✅ | ✅ DONE | No atom-specific items remaining. Deferred: contrast calc needs pipeline, Badge-in-Card alt text (Card molecule audit), Icon inheritance (cross-atom). |
| **Link** | ✅ | ✅ DONE | No atom-specific items remaining. 7 internal tokens, colour enum aligned (primary/accent/text/muted/inherit), `--text-color` bug fixed to `--text-body`, transitions tokenised. Deferred: animation visual testing across themes, highlight-links.css needs rules for new variants. |
| **Icon** | ✅ | ✅ DONE | No atom-specific items remaining. 3 colour tokens, shadow/glow differentiated, internal `--_icon-color` token. Deferred: inline px → `--icon-size`, AAC rules → global file, aria-hidden conditionality (cross-atom). |
| **Image** | ✅ | ✅ DONE | No atom-specific items remaining. 3 colour tokens (border, caption, overlay), internal tokens, focus-visible tokenised. Self-referential token bug caught and fixed. Deferred: alt text spans → Text atom, AAC cards → Card+Image+Text, AAC/cognitive rules → global file. |
| **Card** | ✅ | ✅ DONE | No atom-specific items remaining. Deferred: print (global), molecule card rules in `_reference/Card/` (extract per molecule audit). |
| **List** | ✅ | ✅ DONE | No atom-specific items remaining. 3 internal tokens, colour enum aligned, render notes documented. Self-referential token bug caught and fixed (same as Image). Deferred: Icon inside List aria-hidden propagation (cross-atom), print page-break-inside (global). |
| **FormField** | ✅ | ✅ DONE | No atom-specific items remaining. Deferred: save-draft for AAC (functional testing), input tolerance testing, print (global). |

### Supporting Atoms

| Atom | Pass 1 | Pass 2 | Notes |
|---|---|---|---|
| **Toast** | ✅ | ⬜ | Glass tokens need internal routing. textTone via Text atom done. |
| **Tooltip** | ✅ | ✅ DONE | No atom-specific items remaining. Arrow consolidation via `--_tooltip-arrow` token (~20 lines deleted). 8 colour pipeline tokens. Glass blur tokenised, neon accent/glow internal routed. Deferred: script runs in all renders (JS bundle gating, global layer). |
| **Grid** | ✅ | ⬜ | XL text reflow deferred. |
| **ScrollDrawIcon** | ⬜ PARTIAL | ⬜ | Legacy patterns. Banned patterns throughout. |
| **LottieIcon** | ⬜ PARTIAL | ⬜ 1 FIX | class:list migration only. Deferred: consumer migration (GlassNav, ReaderNav, ShareSection, Button), lottie_mappings fallbacks, JS bundle gating, data-semantic-role conditionality (cross-atom). |

---

## Pass 1 Deferred Items (31 items, grouped)

### Cross-Atom Composition (11 items)

| # | Atom | Item | Blocked by |
|---|---|---|---|
| 1 | Icon | AAC semantic role rules → move to global `aac-mode.css` | Global AAC layer |
| 2 | Badge | Badge-in-Card alt text — verify assistive/textonly flow in normal document order | Card molecule audit |
| 3 | Badge | Icon inside Badge — verify Icon atom's `aria-hidden` and `data-semantic-role` propagate | Icon pass 2 |
| 4 | List | Icon inside List — verify Icon `aria-hidden` propagates | Icon pass 2 |
| 5 | Image | Alt text word + descriptive spans → Text atom | Text pass 2 |
| 6 | Image | AAC pictogram card → Card + Image + Text atom markup in `aac-cards.ts` | All three atoms pass 2 |
| 7 | Image | AAC text-only fallback → Text atom markup | Text pass 2 |
| 8 | Image | Pictogram img in AAC cards → Image atom markup | Image pass 2 |
| 9 | Card | Badge text on images — molecules rendering Badge + Image must append Badge.label to Image.altWord | Pipeline rules (Badge owns, pipeline enforces) |
| 10 | Card | Textonly should ensure child Image atoms use `data-alt-display-mode="replace"` for meaningful images | Image pass 2 |
| 11 | Toast | LottieIcon atom can't run client-side (server Astro) — migrate if client API exists | LottieIcon |

### Consumer Migration (5 items)

| # | Atom | Item |
|---|---|---|
| 12 | LottieIcon | Consumer migration (GlassNav, ReaderNav, ShareSection, Button) from legacy paths to slug props |
| 13 | LottieIcon | `lottie_mappings` shared fallbacks — verify semantic correctness during consumer audits |
| 14 | Heading | Consumer context overrides (`.card .heading`, `nav .heading`, mega menu) — delete during consumer audits |
| 15 | Heading | `SectionTitle.astro` deprecated — migrate consumers to `<Heading>`, then delete |
| 16 | Card | Typography primitives (`.card__heading` etc.) — consumers migrate to Heading/Text. Delete when all 22 molecules updated. |

### Visual / Manual Testing (7 items)

| # | Atom | Item |
|---|---|---|
| 17 | Heading | Visually test `fit-content` + alignment variants |
| 18 | Link | Animation effects CSS needs visual testing across all themes and render modes |
| 19 | Link | `highlight-links.css` needs rules for new variants (highlight, border) |
| 20 | FormField | Save-draft behaviour for AAC users composing long textarea responses |
| 21 | FormField | Input tolerance testing — verify no paste blocking, no keystroke validation |
| 22 | Showcase | Gallery content accessibility — verify textonly `display:none` doesn't lose meaningful content |
| 23 | Grid | XL text reflow — may need future `[data-text-xl]` rules |

### Global Layers Not Yet Built (4 items)

| # | Item |
|---|---|
| 24 | AAC global stylesheet (`src/styles/global/aac-mode.css`) |
| 25 | Print global layer (deferred to after render pipeline complete) |
| 26 | LottieIcon JS bundle gating — render pipeline should exclude `<script>` from non-full renders |
| 27 | Text — 32+ raw `<small>` and 4 raw `<blockquote>` across molecules → migrate to `<Text as="small/blockquote">` |

### Card Molecule Extraction (1 item, expands to many)

| # | Item |
|---|---|
| 28 | All molecule card rules in `_reference/Card/Card.a11y.css` — extract during each molecule's audit (FlipCard, SlideCard, BlogCard, TeamCard, GlowCard, InfoCard, ChoiceCard, ImageRevealCard, AssetCard, RainbowBorderCard) |

### 9 March Session Pending (3 items)

| # | Item |
|---|---|
| 29 | Delete test sections from `index.astro` |
| 30 | Migrate remaining legacy selectors in `theme-luminance-dark.css` (badge/formfield still use `:is(.a11y-theme-dark, .a11y-theme-high-contrast)`) |
| 31 | Data attribute batch rename (`.a11y-*` classes → `data-*` attributes) |

### 10 March Session — FormField Fixes Applied

| # | Item | Status |
|---|---|---|
| 32 | FormField variant colours restored (secondary/neutral had been flattened to primary) | ✅ Fixed |
| 33 | FormField `contrast` prop removed — HC is zone-only | ✅ Fixed |
| 34 | FormField dark mode selectors migrated to `[data-mode="dark"]` | ✅ Fixed |
| 35 | FormField `aria-labelledby` bug fixed (referenced nonexistent id) | ✅ Fixed |
| 36 | FormField transitions tokenised (6× `0.2s ease` → `var(--transition-fast)`) | ✅ Fixed |
| 37 | FormField dead Button import removed | ✅ Fixed |
| 38 | Prop layer mapping doc updated with bridge pattern rule | ✅ Fixed |

---

## Pattern: Zone-Gated vs Component-Prop (confirmed 10 March)

| Concern | Where it lives | How it triggers |
|---|---|---|
| Colour variant (primary/secondary/neutral) | Component CSS | JSON prop → class |
| Style variant (outlined/glass/neumorphic) | Component CSS | JSON prop → class |
| High contrast | `src/styles/zones/high-contrast.css` | A11y panel → `[data-high-contrast]` |
| Dark mode | `src/styles/zones/theme-luminance-dark.css` | Theme switcher → `[data-mode="dark"]` |
| Render mode | Component CSS (scoped `[data-render="..."]`) | Pipeline → `[data-render]` on body |

Components don't have props for high-contrast or dark mode. They respond to zone data attributes set by the global UI.

---

## Documented Exception Categories

These patterns are accepted across all atoms — don't flag them during audits:

| Pattern | Reason |
|---|---|
| `0`, `none`, `100%`, `auto`, `1px` borders | CSS primitives |
| `em`-based sizing on decorative elements | Intentional relative scaling |
| Hardcoded control geometry (tick positioning, radio dot sizing) | Drawing dimensions |
| `opacity: 0.6` on placeholder | No token exists |
| SVG `fill` in data URIs | CSS vars don't work in `url()` |
| Native control sizes in textonly (24px) | Consistent cross-type sizing |
| Pixel values below token scale floor (200px/350px breakpoints) | Below design system range |
| `min-height` on textarea | Content sizing |
| `min-height: 64px` in assistive | Touch target minimum |
| `margin-left: 2px` on decorative elements | Micro-spacing |
| `color-mix()` percentages | Functional values, not design tokens |
