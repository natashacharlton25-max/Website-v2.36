# List Atom — Fix Prompt

Run these fixes against `src/components/atoms/ui/List/`.
Read each file fully before making changes.

---

## Fix 1: Schema restructure — List.schema.json

Replace the entire file:

```json
{
  "component": "List",
  "category": "atom",
  "renders": {
    "full": "List.astro",
    "reduced": "List.astro",
    "assistive": "List.astro",
    "textonly": "List.astro"
  },
  "notes": "Every list on the site goes through this component. Items render through Text atom. Icon variant uses Icon atom for decorative markers. No animation.",

  "props": {
    "content": {
      "_description": "What the list contains",
      "as":             { "type": "string",  "required": false, "default": "ul", "enum": ["ul", "ol"], "description": "HTML element — unordered or ordered." },
      "items":          { "type": "array",   "required": false, "default": null, "description": "Simple string items. For complex content, use slot instead." },
      "icon":           { "type": "string",  "required": false, "default": null, "textonly": false, "description": "Phosphor icon slug for list markers. Decorative — stripped in textonly, native bullets replace." },
      "iconCollection": { "type": "string",  "required": false, "default": "interface", "description": "Icon collection override." }
    },

    "visual": {
      "_description": "How the list looks",
      "variant":   { "type": "string",  "required": false, "default": "default", "enum": ["default", "none", "inline", "dot"], "description": "List style variant." },
      "dotSize":   { "type": "string",  "required": false, "default": "md", "enum": ["sm", "md", "lg"], "description": "Dot variant marker size." },
      "iconColor": { "type": "string",  "required": false, "default": "primary", "enum": ["primary", "primary-dark", "secondary", "text", "inherit"], "description": "Icon/dot colour." },
      "spacing":   { "type": "string",  "required": false, "default": "normal", "enum": ["tight", "normal", "loose"], "description": "Item spacing." },
      "flush":     { "type": "boolean", "required": false, "default": false, "description": "Remove outer margin." },
      "class":     { "type": "string",  "required": false, "default": "", "description": "Additional CSS classes." }
    },

    "animation": {}
  },

  "slots": {
    "default": "Complex list items — use <li class=\"list__item\"><Text as=\"span\" flush>content</Text></li> for each"
  }
}
```

---

## Fix 2: Remove @layer wrappers — List.css + List.responsive.css

Remove `@layer components {` wrapper and closing `}` from both files.

---

## Fix 3: Astro — Text atom, Icon barrel, remove text class, delete a11y-dot

**3a.** Update imports. Change line 28:
```astro
import Icon from '../../icons/Icon/Icon.astro';
```
To:
```astro
import { Icon } from '../../icons/Icon';
import { Text } from '../Text';
```

Remove the TODO comment on line 27.

**3b.** Remove `'text'` class from list items. Change line 84:
```astro
<li class="text list__item">
```
To:
```astro
<li class="list__item">
```

**3c.** Wrap item content in Text atom. Change line 95:
```astro
<span class="list__content">{item}</span>
```
To:
```astro
<Text as="span" class="list__content" flush>{item}</Text>
```

**3d.** Delete the a11y-dot element entirely. Remove lines 91-94:
```astro
{/* A11y dot — hidden by default, shown in text-only mode to replace icons */}
{hasIcon && (
  <span class="list__a11y-dot" aria-hidden="true"></span>
)}
```

Dead code — textonly render uses native disc bullets, assistive render uses CSS `::before` dots. The HTML element is never displayed in any mode.

**3e.** Update doc comment at top — remove references to `.text` class, `List.a11y.css`, and a11y-dot.

---

## Fix 4: Dot sizes to em — List.css

Convert hardcoded px dot sizes to em. Change:

```css
.list--dot-sm .list__dot {
  width: 6px;
  height: 6px;
}

.list--dot-md .list__dot {
  width: 8px;
  height: 8px;
}

.list--dot-lg .list__dot {
  width: 12px;
  height: 12px;
}
```

To:

```css
/* Dot sizes — em-based, scales with parent text size */
.list--dot-sm .list__dot {
  width: 0.375em;
  height: 0.375em;
}

.list--dot-md .list__dot {
  width: 0.5em;
  height: 0.5em;
}

.list--dot-lg .list__dot {
  width: 0.75em;
  height: 0.75em;
}
```

---

## Fix 5: Delete a11y-dot CSS — List.css

Delete the entire `.list__a11y-dot` rule block:

```css
/* DELETE THIS ENTIRE BLOCK */
.list__a11y-dot {
  display: none;
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--brand-c-primary);
}
```

---

## Fix 6: Dot sizes in responsive — em-based — List.responsive.css

Convert remaining hardcoded dot px in responsive breakpoints:

At 280px breakpoint, change:
```css
.list--dot-lg .list__dot {
  width: 8px;
  height: 8px;
}
```
To:
```css
.list--dot-lg .list__dot {
  width: 0.5em;
  height: 0.5em;
}
```

At 200px breakpoint, change:
```css
.list--dot-lg .list__dot,
.list--dot-md .list__dot {
  width: 6px;
  height: 6px;
}
```
To:
```css
.list--dot-lg .list__dot,
.list--dot-md .list__dot {
  width: 0.375em;
  height: 0.375em;
}
```

At 150px breakpoint, change:
```css
.list--dot .list__dot {
  width: 4px;
  height: 4px;
}
```
To:
```css
.list--dot .list__dot {
  width: 0.25em;
  height: 0.25em;
}
```

---

## Fix 7: a11y.css extraction — List.a11y.css

| Rule block | Category | Target |
|-----------|----------|--------|
| `.a11y-text-only ul.list--default` (disc bullets) | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only ol.list--default` (decimal) | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list--default .list__item::marker` | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list--has-icon` (revert to bullets) | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list--has-icon .list__item` (display: list-item) | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list--has-icon .list__item::marker` | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list--has-icon .list__icon` (hide) | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list--has-icon .list__a11y-dot` (hide) | dead-code | a11y-dot deleted — skip |
| `.a11y-text-only .list--dot .list__dot` (normalise) | text-only | `[data-render="textonly"]` in List.css — but use em: `0.5em` |
| `.a11y-text-only .list--none` (add bullets) | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list--inline` (collapse vertical) | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list--inline .list__item` | text-only | `[data-render="textonly"]` in List.css |
| `.a11y-text-only .list__item` (text-align left) | text-only | `[data-render="textonly"]` in List.css |

### Render-mode rules to ADD to List.css:

```css
/* ================================================================
   RENDER MODE OVERRIDES
   ================================================================ */

/* ── Assistive — vertical stacked, large dot markers, easy scanning ── */

[data-render="assistive"] .list {
  list-style: none;
  padding-left: 0;
}

[data-render="assistive"] .list__item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
}

[data-render="assistive"] .list__item::before {
  content: '';
  width: 0.75em;
  height: 0.75em;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--brand-c-primary);
}

/* Inline collapses to vertical */
[data-render="assistive"] .list--inline {
  display: block;
}

/* Icons hidden — large CSS dot replaces them */
[data-render="assistive"] .list__icon {
  display: none;
}

/* Variant dots hidden — CSS ::before dot replaces for consistency */
[data-render="assistive"] .list__dot {
  display: none;
}

/* ── Textonly — native bullets, plain text, vertical structure ── */

[data-render="textonly"] ul.list--default {
  list-style-type: disc;
  padding-left: var(--space-lg);
}

[data-render="textonly"] ol.list--default {
  list-style-type: decimal;
  padding-left: var(--space-lg);
}

[data-render="textonly"] .list--default .list__item::marker {
  color: var(--brand-c-primary);
}

/* Icon lists revert to native bullets */
[data-render="textonly"] .list--has-icon {
  list-style-type: disc;
  padding-left: var(--space-lg);
}

[data-render="textonly"] .list--has-icon .list__item {
  display: list-item;
}

[data-render="textonly"] .list--has-icon .list__item::marker {
  color: var(--brand-c-primary);
}

[data-render="textonly"] .list--has-icon .list__icon {
  display: none;
}

/* Dot variant normalised */
[data-render="textonly"] .list--dot .list__dot {
  width: 0.5em;
  height: 0.5em;
}

/* None variant gets bullets for structure */
[data-render="textonly"] .list--none {
  list-style-type: disc;
  padding-left: var(--space-lg);
}

/* Inline collapses to vertical with bullets */
[data-render="textonly"] .list--inline {
  display: block;
  list-style-type: disc;
  padding-left: var(--space-lg);
}

[data-render="textonly"] .list--inline .list__item {
  padding: var(--space-xs) 0;
}

/* Global text normalisation */
[data-render="textonly"] .list__item {
  text-align: left;
}
```

### After extraction:
- Move List.a11y.css to `_reference/List/List.a11y.css`
- Move List.a11y.recovery.css to `_reference/List/List.a11y.recovery.css`

---

## Fix 8: CSS cleanup — List.css

**8a.** Remove stale doc comment reference to `.text` class (line 5: "Each .list__item uses .text as base for font-family inheritance" → "Item text renders through Text atom").

**8b.** Remove stale doc comment about a11y-dot (line 10-11).

---

## Fix 9: index.ts cleanup

```ts
import './List.css';
import './List.responsive.css';

export { default as List } from './List.astro';
export { default as schema } from './List.schema.json';
```

Remove `import './List.a11y.css'`.

---

## Fix 10: Icon aria-hidden check

Verify whether Icon atom internally sets `aria-hidden="true"` on all icons. If it does (which it should from the Icon audit), no change needed on line 86. If not, add `aria-hidden="true"` to the `<Icon>` call:

```astro
<Icon name={`${iconCollection}/${icon}`} size={iconSize} class="list__icon" aria-hidden="true" />
```

---

## Post-fix verification

1. `grep -r "atoms/ui" List.schema.json` returns 0 matches
2. `grep -r "@layer" List.css List.responsive.css` returns 0 matches
3. `grep -r "'text'" List.astro` returns 0 matches
4. `grep -r "a11y-dot\|a11y_dot" List.astro List.css` returns 0 matches
5. `grep -r "List.a11y.css" index.ts` returns 0 matches
6. `grep -rP "\d+px" List.css` — only matches should be in comments, not in dot width/height rules
7. Schema has 4 render keys and `"category": "atom"`
8. List.css has `[data-render="assistive"]` and `[data-render="textonly"]` rules
9. List.a11y.css and recovery in `_reference/List/`
10. Icon import uses barrel path

---

## Cross-atom notes (for audit-log.md)

```
- ARCHITECTURE: Dot sizes em-based (0.375em/0.5em/0.75em) — same relative sizing pattern as Heading dividers. Scales with parent text size.
- ARCHITECTURE: Assistive render uses CSS ::before dots on all list variants for consistency. 0.75em scales with text. Icons and variant dots hidden.
- DELETED: .list__a11y-dot element and CSS — dead code. Textonly uses native disc bullets, assistive uses CSS ::before dots.
- MIGRATION: Slot usage instructions updated — consumers should use <li class="list__item"><Text as="span" flush>content</Text></li> instead of <li class="text list__item">.
- DEFERRED: Icon inside List — verify Icon atom's aria-hidden propagates correctly (cross-atom Section 16).
- DEFERRED: Print layer — lists need page-break-inside: avoid on list items.
```
