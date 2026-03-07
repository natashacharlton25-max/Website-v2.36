# Grid Atom — Fix Prompt

Run these fixes against `src/components/atoms/grid/`.
Read each file fully before making changes.

Single session should handle all fixes — Grid is a pure layout shell.

**SCOPE: Grid layout rules ONLY.** Delete all child-reaching rules (card chrome, image hiding, badge/button overrides). Children handle their own render modes via their own atoms.

---

## Decisions (confirmed)

| # | Decision | Outcome |
|---|----------|---------|
| D1 | Hardcoded px in gallery | Accept with comments — layout-specific container dimensions |
| D2 | Component-scoped fallbacks | Accept — var(--grid-gap, var(--space-xl)) etc are inline-style safety nets, not brand token fallbacks |
| D3 | a11y.css content | Extract Grid-only rules. Move files to `_reference/Grid/` |
| D4 | Child-reaching rules | Delete — Card, Image, Badge, Button atoms handle their own textonly rendering now |
| D5 | Showcase gallery in textonly | Keep display: none — purely visual carousel interaction |
| D6 | Separator 0.75rem | Change to var(--space-sm) |
| D7 | Assistive render | Single column collapse, gallery animation killed |

---

## Fix 1: Schema restructure — Grid.schema.json

Replace the entire file:

```json
{
  "component": "Grid",
  "category": "atom",
  "renders": {
    "full": "Grid.astro",
    "reduced": "Grid.astro",
    "assistive": "Grid.astro",
    "textonly": "Grid.astro"
  },
  "notes": "Pure layout shell. Handles column count, gap, alignment. Children handle their own content and render mode behaviour. Grid never reaches into children — Card, Image, Badge, Button atoms handle their own textonly/assistive/reduced rendering.",

  "props": {
    "content": {
      "_description": "Structural identity",
      "id":        { "type": "string",  "required": false, "default": null, "description": "Element ID." },
      "separator": { "type": "boolean", "required": false, "default": true, "description": "Show border between stacked items in textonly/assistive." }
    },

    "visual": {
      "_description": "How the grid looks",
      "columns":   { "type": "number",  "required": false, "default": 3, "enum": [1, 2, 3, 4, 5, 6], "description": "Fixed column count." },
      "gap":       { "type": "string",  "required": false, "default": "var(--space-xl)", "description": "Gap size token or value." },
      "align":     { "type": "string",  "required": false, "default": "stretch", "enum": ["stretch", "start", "center", "end"], "description": "Vertical alignment." },
      "minWidth":  { "type": "string",  "required": false, "default": null, "description": "Min column width for auto-fit. Overrides columns with auto-fit." },
      "container": { "type": "string",  "required": false, "default": "none", "enum": ["4xl", "6xl", "7xl", "full", "none"], "description": "Wrapper width constraint." },
      "flow":      { "type": "string",  "required": false, "default": "row", "enum": ["row", "dense", "column", "masonry"], "description": "Grid auto-flow mode." },
      "class":     { "type": "string",  "required": false, "default": "", "description": "Additional CSS classes." }
    },

    "animation": {
      "_description": "Motion behaviour — stripped in reduced/assistive/textonly renders",
      "gallery": { "type": "string", "required": false, "default": null, "enum": ["showcase", "product"], "description": "Interactive gallery mode. Requires GSAP + Flip. Stripped in reduced render (--gallery-animate: 0)." }
    }
  },

  "slots": {
    "default": "Grid children — Card atoms, text blocks, media. Children handle their own render mode behaviour."
  }
}
```

Key changes: category → "atom", 4 render keys, content/visual/animation groups. `gallery` moved to animation group — it's GSAP-dependent interactive behaviour.

---

## Fix 2: Remove @layer wrappers — Grid.css + Grid.responsive.css

Remove `@layer components {` wrapper and closing `}` from both files.

---

## Fix 3: Hardcoded gallery values — Grid.css + Grid.responsive.css

Add comments to gallery-specific layout dimensions. These are NOT spacing tokens — they're container-specific layout proportions.

Grid.css — showcase section:
```css
/* Gallery showcase layout — container-specific dimensions, not spacing tokens */
.base-grid--gallery-showcase {
  grid-template-columns: minmax(auto, 480px) 120px; /* 480px expanded image, 120px thumbnail column */
  grid-template-rows: repeat(3, 1fr);
  grid-auto-flow: dense;
  height: 650px;    /* Fixed viewport height for carousel layout */
  min-height: 650px;
}
```

Grid.responsive.css — add comments to 140px, 100px, 400px, 300px gallery values similarly.

---

## Fix 4: Separator token fix — a11y extraction

The separator rule currently uses hardcoded `0.75rem`. When extracting to render mode rules, use `var(--space-sm)` instead.

---

## Fix 5: a11y.css extraction — Grid.a11y.css

**Extract ONLY Grid layout rules. DELETE all child-reaching rules.**

### Grid-only rules to extract:

**Reduce-motion** (lines 22-48) — Grid-level only:
```css
[data-render="reduced"] .base-grid { transition: none; }
[data-render="reduced"] .base-grid > * { transition: none; }
[data-render="reduced"] .base-grid > *:hover { transform: none; }
[data-render="reduced"] [data-gallery] { --gallery-animate: 0; }
[data-render="reduced"] [data-gallery] > * { transition: none; }
[data-render="reduced"] .base-grid--gallery-product > .is-inactive {
  opacity: 1;
  filter: none;
}
```

**Text-only** (Grid layout only — lines 64-110, excluding all child rules from 113 onwards):
```css
/* ── Textonly — single column vertical stack ── */

[data-render="textonly"] .base-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

[data-render="textonly"] .base-grid--masonry {
  display: flex;
  flex-direction: column;
  column-count: unset;
  column-gap: unset;
  padding: 0;
}

[data-render="textonly"] .base-grid--masonry > * {
  margin-bottom: var(--space-sm);
  break-inside: unset;
}

/* Showcase gallery: purely visual carousel — hide entirely */
[data-render="textonly"] .base-grid--gallery-showcase {
  display: none;
}

/* Product gallery: vertical stack */
[data-render="textonly"] .base-grid--gallery-product {
  display: flex;
  flex-direction: column;
}

[data-render="textonly"] .base-grid--gallery-product > .is-active,
[data-render="textonly"] .base-grid--gallery-product > .is-inactive {
  opacity: 1;
  filter: none;
  height: auto;
}

/* Kill column/row spanning — single column */
[data-render="textonly"] .base-grid > [class*="grid-span"],
[data-render="textonly"] .base-grid > [class*="grid-row-span"],
[data-render="textonly"] .base-grid > [style*="--span"],
[data-render="textonly"] .base-grid > [style*="--row-span"] {
  flex: none;
  width: 100%;
}

/* Separator between stacked items */
[data-render="textonly"] .base-grid--separator > * + * {
  border-top: 1px solid currentColor;
  padding-top: var(--space-sm);
}
```

**Assistive** (new — not in a11y.css):
```css
/* ── Assistive — single column, children keep visual chrome ── */

[data-render="assistive"] .base-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

[data-render="assistive"] .base-grid--masonry {
  display: flex;
  flex-direction: column;
  column-count: unset;
  column-gap: unset;
  padding: 0;
}

[data-render="assistive"] .base-grid--masonry > * {
  margin-bottom: var(--space-md);
  break-inside: unset;
}

/* Kill gallery animation */
[data-render="assistive"] [data-gallery] {
  --gallery-animate: 0;
}

/* Showcase: hide carousel, same as textonly */
[data-render="assistive"] .base-grid--gallery-showcase {
  display: none;
}

/* Product: vertical stack */
[data-render="assistive"] .base-grid--gallery-product {
  display: flex;
  flex-direction: column;
}

[data-render="assistive"] .base-grid--gallery-product > .is-active,
[data-render="assistive"] .base-grid--gallery-product > .is-inactive {
  opacity: 1;
  filter: none;
  height: auto;
}

/* Kill spanning */
[data-render="assistive"] .base-grid > [class*="grid-span"],
[data-render="assistive"] .base-grid > [class*="grid-row-span"],
[data-render="assistive"] .base-grid > [style*="--span"],
[data-render="assistive"] .base-grid > [style*="--row-span"] {
  flex: none;
  width: 100%;
}

/* Separator */
[data-render="assistive"] .base-grid--separator > * + * {
  border-top: 1px solid var(--brand-c-neutral-light);
  padding-top: var(--space-sm);
}
```

### Rules to DELETE (child-reaching — atoms handle themselves now):

- All `[data-card]`, `.card`, `a.card` rules (Card atom owns its textonly)
- All `[data-media]` rules (Image atom owns its visibility via semanticRole)
- All `[class*="__image"]`, `[class*="__icon-placeholder"]` rules (Image/Icon atoms own themselves)
- All `[class*="__content"]`, `[class*="__title"]`, `[class*="__description"]` rules (Text/Heading atoms)
- All `[class*="__badge"]` rules (Badge atom)
- All `.btn`, `[class*="__button"]` rules (Button atom)
- All `[data-gallery] img`, `.gallery-badge` rules (Gallery molecule responsibility)
- The `& .base-grid * { text-align: left }` rule (children own their own text alignment)

### After extraction:
- Move Grid.a11y.css to `_reference/Grid/Grid.a11y.css`
- Move Grid.a11y.recovery.css to `_reference/Grid/Grid.a11y.recovery.css`

---

## Fix 6: index.ts cleanup

```ts
import './Grid.css';
import './Grid.responsive.css';

export { default as Grid } from './Grid.astro';
export { default as schema } from './Grid.schema.json';
```

Remove `import './Grid.a11y.css'`.

---

## Fix 7: Doc comments — Grid.css + Grid.astro

**Grid.css:**
- Remove `@layer components` reference from doc comment
- Remove `style.css` from filename in comment (line 2) — it's Grid.css
- Add note: "Grid never reaches into children — all child render mode behaviour handled by their own atoms."

**Grid.astro:**
- Remove `Grid.a11y.css` from styles comment
- Add note about render modes: "Textonly/assistive collapse to single column. Children handle their own textonly/assistive rendering."

---

## Post-fix verification

1. `grep -r "atoms/grid" Grid.schema.json` returns 0 matches (category is "atom")
2. `grep -r "@layer" Grid.css Grid.responsive.css` returns 0 matches
3. `grep -r "Grid.a11y.css" index.ts` returns 0 matches
4. `grep -r "data-card\|\.card\b" Grid.css` returns 0 matches (no child card rules)
5. `grep -r "data-media\|__image\|__icon-placeholder" Grid.css` returns 0 matches (no child image rules)
6. `grep -r "__badge\|__button\|__content\|__title\|__description\|\.btn" Grid.css` returns 0 matches (no child content rules)
7. `grep -r "0\.75rem" Grid.css` returns 0 matches (tokenised to --space-sm)
8. Grid.css has `[data-render="reduced"]`, `[data-render="assistive"]`, `[data-render="textonly"]` rules
9. Schema has 4 render keys, `gallery` in animation group
10. Grid.a11y.css in `_reference/Grid/`

---

## Cross-atom notes (for audit-log.md)

```
- ARCHITECTURE: Grid NEVER reaches into children. Card, Image, Badge, Button, Text, Heading atoms all handle their own render mode behaviour. Grid only controls layout — column collapse, gap, spanning.
- ARCHITECTURE: gallery prop moved to animation group — GSAP-dependent interactive behaviour. Pipeline strips in reduced render (--gallery-animate: 0 kills GSAP). Showcase hidden entirely in textonly/assistive.
- ARCHITECTURE: Component-scoped CSS custom property fallbacks (--grid-gap, --grid-cols etc.) are ACCEPTED — these are inline-style safety nets, not brand token fallbacks. Same pattern as FormField.
- ARCHITECTURE: Textonly and assistive both collapse to single-column flex. Textonly strips all chrome (children handle themselves). Assistive keeps visual chrome but forces single column for easy scanning.
- DELETED: All child-reaching rules from Grid textonly — card chrome, image hiding, badge/button overrides. These violated atom boundaries. Each atom now handles its own render mode.
- DEFERRED: Showcase gallery content accessibility — if showcase items contain meaningful content not available elsewhere on page, textonly display:none loses that content. Verify during gallery molecule audit.
```
