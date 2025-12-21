# CSS Standards & Naming Conventions

This document defines the house standard for CSS naming, structure, and organization.

---

## 1. Core Principles

### Pages are "imports only"
- Pages import components and pass content (titles, text, images, buttons)
- Almost no styling inside page files
- If a page needs styling, it lives inside the component or a shared stylesheet

### Typography is global
- Font sizes are set on actual HTML tags (h1, h2, h3, p) in `global.css`
- Components handle layout, spacing, backgrounds - NOT font sizes
- Special cases use variants (e.g., `.hero--home h1`)

### Tokens change with themes
- Use CSS variables that automatically update with a11y themes
- A11y overrides only needed for: overlays, gradients, borders, contrast hacks
- Avoid `!important` unless fighting specificity issues

---

## 2. Naming Conventions

### A) Components use BEM-lite

```css
/* Block (component) */
.hero { }
.card { }
.section { }

/* Element (part inside) - double underscore */
.hero__content { }
.hero__title { }
.card__image { }
.card__body { }

/* Modifier (variant) - double dash */
.hero--home { }
.hero--image { }
.card--featured { }
.card--compact { }
```

### B) State classes

Describe status - use alongside components:

```css
.is-active
.is-open
.is-loading
.is-disabled
.has-error
.has-image
```

Example usage:
```html
<div class="card is-active has-image">
```

### C) Layout utilities

Already exist in `utilities.css` - keep as-is:

```css
.container, .container-6xl, .container-7xl
.flex, .grid
.gap-md, .gap-lg
.p-md, .py-xl
.bg-alt
```

### D) JS hooks

Never styled - only for JavaScript targeting:

```css
.js-slider
.js-nav-toggle
.js-modal-trigger
```

---

## 3. Standard Class Vocabulary

### Page Structure

| Class | Purpose |
|-------|---------|
| `.page` | Page wrapper |
| `.page__hero` | Hero section of page |
| `.page__content` | Main content area |
| `.page__sidebar` | Sidebar if present |

### Section

| Class | Purpose |
|-------|---------|
| `.section` | Generic section wrapper |
| `.section__header` | Section header area |
| `.section__title` | Section heading (uses h2) |
| `.section__subtitle` | Section subheading |
| `.section__body` | Section content |
| `.section--alt` | Alternate background variant |
| `.section--narrow` | Constrained width variant |

### Hero

| Class | Purpose |
|-------|---------|
| `.hero` | Hero section wrapper |
| `.hero__content` | Text content area |
| `.hero__media` | Image/video area |
| `.hero__actions` | CTA buttons area |
| `.hero--home` | Homepage hero variant |
| `.hero--image` | Hero with background image |
| `.hero--split` | Two-column layout |

### Card

| Class | Purpose |
|-------|---------|
| `.card` | Card wrapper |
| `.card__image` | Card image container |
| `.card__body` | Card content area |
| `.card__title` | Card heading |
| `.card__description` | Card description text |
| `.card__meta` | Metadata (date, read time) |
| `.card__badge` | Category/status badge |
| `.card__actions` | Buttons/links area |
| `.card--featured` | Featured/highlighted variant |
| `.card--compact` | Smaller variant |
| `.card--horizontal` | Side-by-side layout |

### Content

| Class | Purpose |
|-------|---------|
| `.content` | Rich text content wrapper |
| `.content__lead` | Lead/intro paragraph |
| `.content__body` | Main body text |

### Form

| Class | Purpose |
|-------|---------|
| `.form` | Form wrapper |
| `.form__group` | Input group (label + input) |
| `.form__label` | Form label |
| `.form__input` | Text input |
| `.form__select` | Select dropdown |
| `.form__checkbox` | Checkbox wrapper |
| `.form__actions` | Submit buttons area |
| `.form__error` | Error message |

### Navigation

| Class | Purpose |
|-------|---------|
| `.nav` | Navigation wrapper |
| `.nav__list` | Nav items container |
| `.nav__item` | Single nav item |
| `.nav__link` | Nav link |
| `.nav--main` | Main navigation |
| `.nav--footer` | Footer navigation |

### Badge

| Class | Purpose |
|-------|---------|
| `.badge` | Generic badge |
| `.badge--primary` | Primary color variant |
| `.badge--category` | Category badge |
| `.badge--status` | Status indicator |

### Button

Use `UnifiedButton` component - classes handled internally.

---

## 4. Typography (Global)

Set in `global.css` on actual HTML tags:

```css
/* Headings */
h1 {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw + 1rem, 3.75rem);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--color-Text-700);
}

h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw + 0.5rem, 2.5rem);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  color: var(--color-Text-700);
}

h3 {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--color-Text-700);
}

h4 {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  color: var(--color-Text-600);
}

/* Body text */
p {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--color-Text-600);
}

/* Lead paragraph */
.lead, p.lead {
  font-size: var(--text-lg);
  color: var(--color-Text-500);
}

/* Small text */
small, .text-sm {
  font-size: var(--text-sm);
  color: var(--color-Text-500);
}
```

### DO NOT in components:

```css
/* BAD - don't do this */
.hero__title {
  font-size: clamp(2rem, 5vw, 3.75rem);
  color: var(--color-Primary-600);
}

/* GOOD - typography inherited, only add layout */
.hero__title {
  margin-bottom: var(--space-md);
  max-width: 800px;
}
```

### Special cases (rare):

```css
/* Only when truly needed - use variant */
.hero--home h1 {
  font-size: clamp(2.5rem, 6vw + 1rem, 4.5rem);
}
```

---

## 5. Colors (Tokens)

### Always use tokens:

```css
/* GOOD */
color: var(--color-Text-600);
background: var(--color-Background-100);
border-color: var(--color-Primary-500);

/* BAD - never hardcode */
color: #666666;
background: #f5f5f5;
```

### Token categories:

| Token | Purpose |
|-------|---------|
| `--color-Text-*` | Text colors (50-900 scale) |
| `--color-Background-*` | Background colors |
| `--color-Primary-*` | Primary brand color |
| `--color-Secondary-*` | Secondary brand color |
| `--color-AccentOne-*` | Accent colors |

### A11y themes change tokens automatically

When user selects "Dark Mode" or "High Contrast", tokens update:
- `--color-Text-600` becomes appropriate dark mode value
- `--color-Background-100` becomes dark surface
- Components using tokens update automatically

### When to write a11y overrides:

Only for:
- Overlays with gradients
- Complex backgrounds
- Border contrast issues
- Elements that don't use tokens

---

## 6. Spacing

Use spacing tokens consistently:

```css
--space-xs: 0.25rem   /* 4px */
--space-sm: 0.5rem    /* 8px */
--space-md: 1rem      /* 16px */
--space-lg: 1.5rem    /* 24px */
--space-xl: 2rem      /* 32px */
--space-2xl: 3rem     /* 48px */
--space-3xl: 4rem     /* 64px */
--space-4xl: 6rem     /* 96px */
```

Example:
```css
.card__body {
  padding: var(--space-lg);
  gap: var(--space-md);
}
```

---

## 7. File Structure

```
src/styles/
├── global.css              # Imports all, global resets, typography on tags
├── design-tokens.css       # CSS variables (spacing, typography, layout)
├── utilities.css           # Utility classes (flex, grid, spacing)
├── components.css          # Standard component classes (NEW)
│
├── a11y/                   # Accessibility styles
│   ├── base.css            # Core a11y utilities (.sr-only, focus)
│   ├── panel.css           # Accessibility panel UI
│   ├── themes/             # Theme color overrides
│   │   ├── dark.css
│   │   ├── cream.css
│   │   ├── high-contrast.css
│   │   ├── protanopia.css
│   │   ├── deuteranopia.css
│   │   ├── tritanopia.css
│   │   └── monochrome.css
│   └── plain-mode/         # Plain/text-only mode
│       ├── core.css
│       ├── navigation.css
│       └── pages/
│
├── themes/
│   └── brand/
│       └── BrandDefault.css  # Brand color tokens
│
└── (legacy - to clean up)
    ├── Gradient.css
    ├── ButtonThemes.css
    ├── GlowTokens.css
    └── ...
```

---

## 8. Component CSS Structure

Each component file should follow this order:

```css
/* 1. Layout (display, grid, flex) */
.card {
  display: flex;
  flex-direction: column;
}

/* 2. Box model (width, padding, margin) */
.card {
  padding: var(--space-lg);
  border-radius: var(--border-radius-lg);
}

/* 3. Visual (background, border, shadow) */
.card {
  background: var(--color-Background-50);
  box-shadow: var(--shadow-sm);
}

/* 4. Elements (parts inside) */
.card__image { }
.card__body { }
.card__title { }

/* 5. Modifiers (variants) */
.card--featured { }
.card--compact { }

/* 6. States */
.card:hover { }
.card.is-active { }

/* 7. Responsive (mobile-first) */
@media (min-width: 768px) {
  .card { }
}
```

---

## 9. What NOT to Do

### Don't create page-specific class names:

```css
/* BAD */
.product-card { }
.article-card { }
.service-card { }

/* GOOD - one card class with variants */
.card { }
.card--product { }
.card--article { }
```

### Don't override typography in components:

```css
/* BAD */
.hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-Primary-600);
}

/* GOOD - let h1 handle typography */
.hero__title {
  margin-bottom: var(--space-lg);
}
```

### Don't hardcode colors:

```css
/* BAD */
.badge { background: #4CAF50; color: white; }

/* GOOD */
.badge {
  background: var(--color-Primary-600);
  color: var(--color-Text-50);
}
```

### Don't use !important (except for a11y overrides):

```css
/* BAD */
.hero__title { font-size: 3rem !important; }

/* GOOD - fix specificity instead */
.hero .hero__title { font-size: 3rem; }
```

### Don't write duplicate a11y rules per page:

```css
/* BAD - in every page file */
body.a11y-theme-dark .product-card { }
body.a11y-theme-dark .article-card { }
body.a11y-theme-dark .service-card { }

/* GOOD - once in a11y/themes/dark.css */
body.a11y-theme-dark .card { }
```

---

## 10. Migration Checklist

When refactoring a component or page:

- [ ] Remove all `font-size` declarations (use global typography)
- [ ] Remove all hardcoded colors (use tokens)
- [ ] Rename classes to BEM-lite format
- [ ] Remove page-specific class names (use standard vocabulary)
- [ ] Remove a11y overrides (they'll inherit from tokens)
- [ ] Remove `!important` unless absolutely necessary
- [ ] Move reusable CSS to component file
- [ ] Page becomes imports + content only

---

## 11. Quick Reference

### Class naming:
- Block: `.card`
- Element: `.card__title`
- Modifier: `.card--featured`
- State: `.is-active`

### Typography: Set on tags, not classes

### Colors: Always use `var(--color-*)`

### Spacing: Always use `var(--space-*)`

### A11y: Tokens auto-update, minimal overrides

---

## Examples

### Before (problematic):

```html
<div class="product-card">
  <div class="product-image">
    <img src="..." />
    <span class="product-badge">New</span>
  </div>
  <h3 class="product-title">Product Name</h3>
  <p class="product-description">Description here</p>
</div>
```

```css
.product-card { ... }
.product-title {
  font-size: var(--text-xl);
  color: var(--color-Text-700);
}
body.a11y-theme-dark .product-card { ... }
body.a11y-theme-dark .product-title { ... }
```

### After (clean):

```html
<div class="card">
  <div class="card__image">
    <img src="..." />
    <span class="badge badge--category">New</span>
  </div>
  <h3 class="card__title">Product Name</h3>
  <p class="card__description">Description here</p>
</div>
```

```css
.card { ... }
.card__title {
  margin-bottom: var(--space-sm);
  /* Typography inherited from h3 global styles */
}
/* No a11y overrides needed - tokens handle it */
```
