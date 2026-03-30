# Canonical Atom Pattern — Definitive Reference

**Date:** 30 March 2026
**Reference implementation:** Section atom

Every atom in the system follows this pattern. No exceptions.

---

## The Rule

**Astro maps props to classes. CSS defines what classes look like. Zero inline styles. Zero token computation in Astro.**

---

## Astro Template

```astro
---
interface Props {
  // Enums only. No raw CSS strings. No [key: string]: any.
  color?: 'primary' | 'secondary' | 'neutral' | 'red' | 'orange' | 'yellow' | 'teal' | 'blue' | 'purple' | 'pink';
  variant?: 'fill' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  // ... more enums
  class?: string;
}

const {
  color,
  variant = 'fill',
  size = 'md',
  class: className,
} = Astro.props;
---

<div
  class:list={[
    'component',
    color && `component--${color}`,
    `component--${variant}`,
    size !== 'md' && `component--${size}`,
    className,
  ]}
>
  <slot />
</div>
```

### What Astro does:
- Destructure props (with defaults)
- Map props to CSS class names via `class:list`
- Render slot

### What Astro does NOT do:
- Compute token values
- Build inline styles
- Map enums to CSS values
- Access `...rest` or `[key: string]: any`
- Render content (that's the children's job via slot)

---

## CSS

```css
/* 1. Internal tokens with bridge fallbacks */
.component {
  --_comp-bg: var(--comp-bg, var(--primary-200));
  --_comp-border: var(--comp-border, var(--primary-600));
  --_comp-text: var(--comp-text, var(--neutral-800));
}

/* 2. Base uses internal tokens */
.component {
  background: var(--_comp-bg);
  border-color: var(--_comp-border);
  color: var(--_comp-text);
}

/* 3. Colour enum — 10 variants remap internal tokens */
.component--primary   { --_comp-bg: var(--primary-200);   --_comp-border: var(--primary-600); }
.component--secondary { --_comp-bg: var(--secondary-200); --_comp-border: var(--secondary-600); }
.component--neutral   { --_comp-bg: var(--neutral-200);   --_comp-border: var(--neutral-600); }
.component--red       { --_comp-bg: var(--rainbow-1-wash); --_comp-border: var(--rainbow-1); }
/* ... orange, yellow, teal, blue, purple, pink */

/* 4. Visual variants — enums, not raw values */
.component--sm { padding: var(--space-sm); }
.component--lg { padding: var(--space-lg); }
```

### Token chain:
```
JSON pipeline → --comp-bg (inline style) → --_comp-bg (internal) → background
                                              ↑
                              Colour class sets default if no pipeline value
```

### What CSS does NOT contain:
- `@layer` wrappers
- `!important`
- `@media (prefers-reduced-motion)`
- `.a11y-*` selectors
- `var(--token, #hex)` hardcoded fallbacks
- Scoped `<style>` blocks

---

## Schema

```json
{
  "component": "Component",
  "category": "atom",
  "renders": { "full": "Component.astro", "reduced": "Component.astro", "assistive": "Component.astro", "textonly": null },

  "props": {
    "content": { "_description": "What" },
    "visual": {
      "color": { "enum": ["primary","secondary","neutral","red","orange","yellow","teal","blue","purple","pink"] },
      "variant": { "enum": [...] },
      "size": { "enum": [...] }
    },
    "animation": {},
    "colour": {
      "compBg": { "cssProperty": "--comp-bg" },
      "compBorder": { "cssProperty": "--comp-border" }
    }
  }
}
```

---

## Zone Overrides

```css
/* Dark — remap tokens for dark backgrounds */
[data-mode="dark"] .component--primary { --_comp-bg: var(--primary-800); }

/* HC — strip decorative, force visibility */
[data-high-contrast] .component { border: 2px solid currentColor; }

/* Textonly — schema says null, pipeline omits. Or structure.css hides. */
```

---

## JSON (what content authors write)

```json
{
  "component": "Section",
  "color": "teal",
  "bg": "tint",
  "container": "lg",
  "separator": true,
  "separatorWeight": "medium",
  "gap": "xl",
  "children": [
    { "component": "Heading", "level": 2, "text": "Resources", "color": "teal" },
    { "component": "Grid", "children": [...] }
  ]
}
```

**Zero CSS in JSON. Every value is an enum or a string. Pipeline resolves tokens.**

---

## Barrel (index.ts)

```ts
import './Component.css';
import './Component.responsive.css';

export { default as Component } from './Component.astro';
export { default as schema } from './Component.schema.json';
```

---

## Files per atom

```
Component/
  Component.astro          — props → classes → slot
  Component.css            — internal tokens + colour enum + variants
  Component.responsive.css — breakpoint scaling (font size, spacing)
  Component.schema.json    — prop definitions + renders + colour group
  index.ts                 — barrel with CSS side-effect imports
```

---

## Checklist (quick)

- [ ] Zero inline styles in .astro
- [ ] Zero `[key: string]: any` rest spread
- [ ] Zero raw CSS values in JSON
- [ ] All visual props are enums
- [ ] Internal tokens with bridge fallbacks
- [ ] 10-colour enum classes
- [ ] Dark zone overrides (where needed)
- [ ] HC zone overrides (where needed)
- [ ] Schema with content/visual/animation/colour groups
- [ ] Barrel with CSS imports
- [ ] Responsive CSS file exists
