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
/* 1. Internal tokens — defaults, no bridge */
.component {
  --_comp-bg: transparent;
  --_comp-border: var(--neutral-400);
  --_comp-text: var(--neutral-800);

  background: var(--_comp-bg);
  border-color: var(--_comp-border);
  color: var(--_comp-text);
}

/* 2. Colour enum — 10 variants remap internal tokens */
.component--primary   { --_comp-bg: var(--primary-200);   --_comp-border: var(--primary-600); }
.component--secondary { --_comp-bg: var(--secondary-200); --_comp-border: var(--secondary-600); }
.component--neutral   { --_comp-bg: var(--neutral-200);   --_comp-border: var(--neutral-600); }
.component--red       { --_comp-bg: var(--rainbow-1-wash); --_comp-border: var(--rainbow-1); }
/* ... orange, yellow, teal, blue, purple, pink */

/* 3. Visual variants — enums, not raw values */
.component--sm { padding: var(--space-sm); }
.component--lg { padding: var(--space-lg); }
```

### Token chain:
```
JSON enum → CSS class → internal token → CSS property
colour: "teal" → .component--teal → --_comp-bg: var(--rainbow-4-wash) → background
```

No bridge tokens. No pipeline inline styles. Colour enum class is the single source.

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
  "renders": { "full": "Component.astro", "reduced": "Component.astro", "textonly": null },

  "props": {
    "content": {},
    "visual": {
      "color": { "type": "string", "default": null, "enum": ["primary","secondary","neutral","red","orange","yellow","teal","blue","purple","pink"] },
      "variant": { "type": "string", "default": "fill", "enum": [...] },
      "size": { "type": "string", "default": "md", "enum": [...] }
    },
    "animation": {},
    "colour": {}
  }
}
```

No pipeline tokens in colour group. Colour enum handles everything via CSS classes. `colour: {}` is empty — kept for schema structure consistency.

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
