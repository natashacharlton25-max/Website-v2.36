# Session Log — 2026-03-09: Card, Tooltip, Badge Updates

Record of decisions, fixes, and architecture clarifications from this session.
Apply same patterns to all future component work.

---

## Decisions Made

| # | Decision | Outcome |
|---|----------|---------|
| D1 | Liquid glass implementation | Two-layer pseudo-element: `::before` = tint + inner glow, `::after` = backdrop-blur + SVG distortion. Card body transparent with `isolation: isolate`. |
| D2 | SVG distortion filter | Conditionally rendered in Card.astro when `variant='liquid'`. Must also be in DOM for raw HTML card usage. |
| D3 | Liquid glass render gating | `[data-render="reduced/assistive"]` strips `filter: none` on `::after`. Blur stays, distortion removed. |
| D4 | Glass tint | `--card-glass-tint` custom property. `background: color-mix(in oklch, var(--glass-bg) 60%, var(--card-glass-tint))`. JSON author names tint token via `glassTint` schema prop. Default = transparent (standard glass). |
| D5 | Variant rename | `liquid-glass` → `liquid`, `neumorphic-pressed` → `pressed`. All variants now single-word differentiators. |
| D6 | Legacy typography/element primitives | Sections 11 + 12 deleted from Card.css. `.card__heading`, `.card__subheading`, `.card__description`, `.card__meta`, `.card__badge`, `.card__button` — all removed. Molecules own content composition. |
| D7 | `.card__icon-wrapper` | KEPT — structural layout (centering/spacing), not a legacy primitive. Restored to section 10. |
| D8 | Card.responsive.css legacy rules | Deleted `.card__heading` clamp and `.card__badge`/`.card__button` tiny-breakpoint rules. |
| D9 | Tooltip positioning | Converted from `position: absolute` to `position: fixed` (viewport-level). Never clipped by overflow:hidden. |
| D10 | Tooltip JS | `getBoundingClientRect()` on `mouseenter`/`focusin` → sets `--_tooltip-x`/`--_tooltip-y` CSS vars. `data-tooltip-position` attribute drives position. |
| D11 | Badge pipeline rules | `pipelineRules.altTextRule` added to schema. Badge.label appends to adjacent Image.altWord. Badge owns the rule; pipeline enforces. |
| D12 | Card is dumb container | Card provides visual chrome only (bg, border, radius, shadow, padding). Molecules handle content. Card doesn't detect render mode — it's pure. |
| D13 | Tooltips are global layer | Not scoped to Card or any container. Fixed positioning ensures viewport-level rendering. |
| D14 | Atoms own smart compositions | Card doesn't manage Image alt text display. Badge declares its own cross-atom relationship. Each atom handles its own render mode behaviour. |
| D15 | Overlay alt text display | Stays within image bounds (position:absolute inside figure). Only tooltip display mode escapes via fixed positioning. |

---

## Card Variant List (final)

`default`, `transparent`, `outline`, `glass`, `liquid`, `neumorphic`, `pressed`, `comic`, `tech`

---

## Liquid Glass — Implementation Details

### Card.css — `.card--liquid`

```css
.card--liquid {
  --card-lg-blur: 10px;
  --card-lg-tint: rgba(255, 255, 255, 0);
  --card-lg-inner-glow: rgba(255, 255, 255, 0.7);
  --card-lg-outer-glow: rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: visible;
  isolation: isolate;
  background: transparent;
  color: var(--card-lg-text, var(--brand-c-text));
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 42px -12px var(--card-lg-outer-glow);
}

.card--liquid::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background-color: var(--card-lg-tint);
  box-shadow: inset 0 0 44px -15px var(--card-lg-inner-glow);
  pointer-events: none;
}

.card--liquid::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  backdrop-filter: blur(var(--card-lg-blur));
  -webkit-backdrop-filter: blur(var(--card-lg-blur));
  filter: url(#glass-distortion);
  -webkit-filter: url(#glass-distortion);
  isolation: isolate;
  pointer-events: none;
}

.card--liquid > * {
  position: relative;
  z-index: 1;
}
```

### Card.astro — SVG filter (conditional)

```astro
{variant === 'liquid' && (
  <svg width="0" height="0" style="position: absolute;" aria-hidden="true">
    <defs>
      <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.02" numOctaves="2" seed="92" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
        <feDisplacementMap in="SourceGraphic" in2="blurred" scale="200" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
)}
```

### theme-luminance-dark.css — dark mode overrides

```css
[data-mode="dark"] .card--liquid {
  --card-lg-inner-glow: rgba(255, 255, 255, 0.5);
  --card-lg-outer-glow: rgba(255, 255, 255, 0.2);
}

[data-mode="dark"][data-theme="high-contrast"] .card--liquid,
[data-mode="dark"][data-theme="high-contrast-protan"] .card--liquid,
[data-mode="dark"][data-theme="high-contrast-tritan"] .card--liquid {
  --card-lg-inner-glow: rgba(255, 255, 255, 0.9);
  --card-lg-outer-glow: rgba(255, 255, 255, 0.5);
  --card-lg-tint: rgba(255, 255, 255, 0.03);
}
```

### Render mode gating

```css
[data-render="reduced"] .card--liquid::after,
[data-render="assistive"] .card--liquid::after {
  filter: none;
  -webkit-filter: none;
}
```

---

## Glass Tint — Implementation

### Card.css

```css
.card--glass {
  --card-glass-tint: transparent;
  background: color-mix(in oklch, var(--card-glass-bg, var(--glass-bg)) 60%, var(--card-glass-tint));
}
```

### Card.schema.json — colour prop

```json
"glassTint": {
  "type": "token",
  "required": false,
  "default": "transparent",
  "description": "Brand tint for glass variant. Mixed at 40% with glass bg (--card-glass-tint). No value = standard glass."
}
```

---

## Tooltip — Fixed Position Upgrade

### Problem
Tooltips clipped by `overflow: hidden` on Card or any parent container.

### Solution
- `position: fixed` on `.tooltip__content` (viewport-level)
- JS calculates trigger coordinates via `getBoundingClientRect()` on `mouseenter`/`focusin`
- Sets `--_tooltip-x` and `--_tooltip-y` CSS custom properties on the content element
- CSS transform offsets per position variant (top/bottom/left/right)
- `data-tooltip-position` attribute on wrapper drives JS position logic
- Init guard `wrapper.dataset.tooltipInit` prevents double-binding
- `astro:page-load` listener for Astro page transitions

### Files changed
- `Tooltip.astro` — added `data-tooltip-position`, added inline `<script>` with position logic
- `Tooltip.css` — rewrote all position transforms for fixed positioning, all animation transforms updated
- `Tooltip.responsive.css` — simplified to single mobile max-width rule

---

## Badge — Pipeline Rules Pattern

### Purpose
Atoms can declare rules about how they interact with sibling atoms. The pipeline enforces these rules universally.

### Badge.schema.json addition

```json
"pipelineRules": {
  "altTextRule": {
    "action": "append-to-adjacent-image",
    "field": "label",
    "description": "When Badge is a sibling of Image inside any container, Badge.label is appended to Image.altWord by the pipeline. Badge owns the rule; pipeline enforces it universally."
  }
}
```

### Pattern for other atoms
Any atom can declare `pipelineRules` in its schema. The atom owns the rule declaration. The pipeline reads all schemas and enforces rules during content assembly. This avoids atoms needing to know about each other at runtime.

---

## Lessons / Pitfalls

1. **SVG filter must be in DOM** — `filter: url(#id)` silently does nothing if the `<filter>` element isn't in the same document. When using raw HTML cards (not Card.astro), inject the SVG manually.
2. **overflow:visible on liquid glass** — base `.card` has `overflow: hidden`. Liquid glass needs `overflow: visible` or the `::after` distortion layer gets clipped.
3. **Structural vs legacy** — `.card__icon-wrapper` looks like a legacy primitive but is structural layout. Always check if a class provides centering/spacing before deleting.
4. **Test with raw HTML AND component** — index.astro test section used raw divs, not Card.astro. The SVG filter was only in Card.astro. Both paths need the filter.
5. **Single-word variant names** — user prefers single-word differentiators: `liquid` not `liquid-glass`, `pressed` not `neumorphic-pressed`.

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/atoms/Card/Card.css` | Liquid glass variant, glass tint, variant renames, legacy sections 11+12 deleted, icon-wrapper restored |
| `src/components/atoms/Card/Card.astro` | SVG filter conditional render, variant prop renames |
| `src/components/atoms/Card/Card.schema.json` | Variant enum updated, glassTint prop added |
| `src/components/atoms/Card/Card.responsive.css` | Legacy breakpoint rules deleted |
| `src/components/atoms/Tooltip/Tooltip.css` | Fixed positioning, all transforms rewritten |
| `src/components/atoms/Tooltip/Tooltip.astro` | data-tooltip-position, inline position script |
| `src/components/atoms/Tooltip/Tooltip.responsive.css` | Simplified to single mobile rule |
| `src/components/atoms/Badge/Badge.schema.json` | pipelineRules.altTextRule added |
| `src/styles/zones/theme-luminance-dark.css` | Liquid glass dark + HC dark overrides, variant renames |
| `_reference/atom-audit-files/audit-log.md` | Updated Card entries |

---

## Pending (not done this session)

- Delete test sections from index.astro (user hasn't confirmed done checking)
- Migrate remaining legacy selectors in theme-luminance-dark.css (badge/formfield still use `:is(.a11y-theme-dark, .a11y-theme-high-contrast)`)
- Data attribute batch rename (`.a11y-*` classes → `data-*` attributes)
