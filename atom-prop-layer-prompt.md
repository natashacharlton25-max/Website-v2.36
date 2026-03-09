# Atom CSS Prop Layer — Full Mapping

## Instructions for Claude Code

For each atom, replace hardcoded token references with component-scoped CSS custom properties. No fallbacks. The JSON pipeline will provide values via inline style on the element.

**Pattern:**
```css
/* Before */
.card { background: var(--brand-c-bg); }

/* After */
.card { background: var(--card-bg); }
```

**Read each atom's CSS file fully before making changes. Do not skim.**

**Do NOT change:** spacing tokens (`--space-*`), typography tokens (`--font-*`, `--text-*` sizes, `--leading-*`, `--letter-spacing-*`), radius tokens (`--radius-*`), transition tokens (`--transition-*`), z-index tokens (`--z-*`), border-width tokens (`--border-width-*`). These are layout/structure, not colour.

**DO change:** any `var(--brand-c-*)`, `var(--color-*)`, `var(--neutral-*)`, `var(--primary-*)`, `var(--secondary-*)`, `var(--rainbow-*)`, `var(--glass-*)`, `var(--shadow-*)`, `var(--glow-*)`, `var(--gradient-*)` reference.

---

## Badge

Current references: `--brand-c-text`, `--brand-c-text-dark`, `--color-White`, `--glass-*` (6 tokens), `--zone-bg-*` (14 tokens), `--zone-pattern-*` (7 tokens)

```css
/* Colour props */
--badge-bg          /* background — currently zone-bg-* variants */
--badge-text         /* text colour */
--badge-border       /* border colour — currently zone-pattern-* */
--badge-icon         /* icon fill colour */

/* Glass props (Badge uses glass variants) */
--badge-glass-bg     /* glass background */
--badge-glass-blur   /* glass blur */
--badge-glass-border /* glass border */
```

**Also:** all `--zone-bg-*` references must be remapped to `--rainbow-n-wash` or `--rainbow-n-light`. All `--zone-pattern-*` to `--rainbow-n-dark`. This is the consumer migration for Badge.

---

## Button

Current references: `--brand-c-bg`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-neutral-light`, `--brand-c-text`, `--color-Black`, `--color-White`, `--btn-filled-text`, `--confetti-*` (4 tokens), `--glass-*` (3 tokens), `--shadow-*` (8 tokens), `--gradient-*`

```css
/* Colour props */
--btn-bg             /* button background */
--btn-text           /* button text — replaces --btn-filled-text AND --color-White refs */
--btn-border         /* border colour */
--btn-hover-bg       /* hover state background */
--btn-hover-text     /* hover state text */
--btn-hover-border   /* hover state border */
--btn-focus-ring     /* focus outline colour */

/* Effect props */
--btn-shadow         /* box shadow */
--btn-shadow-hover   /* hover shadow */
--btn-glass-bg       /* glass variant background */
--btn-glass-border   /* glass variant border */
```

**Note:** Button has many variants (filled, outline, ghost, glass, gradient, neu). Each variant currently hardcodes which brand token to use. The prop layer means JSON picks the colour, atom just applies it.

---

## Card

Current references: `--brand-c-bg`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light`, `--brand-c-neutral-light`, `--color-Black`, `--color-White`, `--shadow-*` (6 tokens), `--card-hover-border`, `--card-lg-*` (7 tokens)

```css
/* Colour props */
--card-bg            /* card background */
--card-text          /* body text */
--card-heading       /* heading colour */
--card-border        /* border colour */
--card-hover-border  /* hover state border (already exists!) */
--card-accent        /* accent colour for decorative elements */

/* Effect props */
--card-shadow        /* box shadow */
--card-shadow-hover  /* hover shadow */

/* Large glass card variant */
--card-lg-bg         /* large card glass bg */
--card-lg-border     /* large card border */
--card-lg-text       /* large card text */
--card-lg-shadow     /* large card shadow */
```

---

## FormField

Current references: `--brand-c-bg`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light`, `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light`, `--brand-c-text`, `--brand-c-text-light`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-neutral-light`, `--color-Error`, `--color-White`, `--glass-*` (2 tokens), `--shadow-*` (3 tokens)

```css
/* Colour props */
--field-bg           /* input background */
--field-text         /* input text */
--field-label        /* label colour */
--field-border       /* border colour */
--field-focus        /* focus border/ring colour */
--field-error        /* error state colour */
--field-placeholder  /* placeholder text colour */

/* Effect props */
--field-shadow       /* box shadow (neu variant) */
```

---

## Heading

Current references: `--brand-c-text`, `--brand-c-text-light`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light`, `--brand-c-secondary`, `--brand-c-secondary-light`, `--brand-c-bg-light`, `--brand-c-neutral`, `--brand-c-neutral-light`, `--color-White`, `--gradient-hero`

```css
/* Colour props */
--heading-color      /* already exists in text tokens — default heading */
--heading-accent     /* already exists in text tokens — brand accent */
--heading-underline  /* decorative underline colour */
--heading-bg         /* background (for highlighted/badge headings) */
```

---

## Text

Current references: `--brand-c-text`, `--brand-c-text-light`, `--brand-c-primary`, `--brand-c-secondary`, `--brand-c-neutral`

```css
/* Colour props */
--text-color         /* text colour — maps to --text-body by default */
--text-accent        /* accent/highlight colour */
--text-link          /* inline link colour */
```

---

## Link

Current references: `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-secondary`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light`, `--brand-c-bg`

```css
/* Colour props */
--link-color         /* already in text tokens */
--link-hover         /* already in text tokens */
--link-visited       /* visited state */
--link-underline     /* underline colour (can differ from text) */
--link-bg-hover      /* background on hover (for highlight variant) */
```

---

## List

Current references: `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-secondary`, `--brand-c-text`

```css
/* Colour props */
--list-text          /* list item text colour */
--list-marker        /* bullet/number colour */
--list-marker-accent /* secondary marker colour */
```

---

## Image

Current references: `--brand-c-primary`, `--brand-c-text-dark`, `--color-Black`, `--color-White`, `--color-surface-inverse`, `--media-brightness`, `--media-contrast`, `--media-saturation`

```css
/* Colour props */
--img-border         /* border colour */
--img-caption        /* caption text colour */
--img-overlay        /* overlay background colour */
```

**Note:** `--media-brightness/contrast/saturation` stay as global tokens — they're behavioural (set by luminance/chroma/intensity layers), not per-instance.

---

## Icon

Current references: `--svg-drop-shadow`, `--svg-drop-shadow-lg`, `--svg-drop-shadow-md`, `--svg-glow-*` (5 tokens)

```css
/* Colour props */
--icon-color         /* fill/stroke colour */
--icon-glow          /* glow effect */
--icon-shadow        /* drop shadow */
```

---

## ScrollDrawIcon

Current references: `--brand-c-primary`

```css
/* Colour props */
--draw-stroke        /* stroke colour */
--draw-fill          /* fill colour on complete */
```

---

## Toast

Current references: `--brand-c-bg`, `--brand-c-bg-dark`, `--brand-c-neutral-dark`, `--brand-c-neutral-light`, `--brand-c-primary`, `--brand-c-text`, `--brand-c-text-dark`, `--color-White`, `--glass-*` (5 tokens), `--glow-*` (3 tokens), `--shadow-*` (2 tokens)

```css
/* Colour props */
--toast-bg           /* background */
--toast-text         /* text colour */
--toast-accent       /* accent/icon colour */
--toast-border       /* border colour */
--toast-shadow       /* shadow */
--toast-glow         /* glow effect */
```

---

## Tooltip

Current references: `--brand-c-bg`, `--brand-c-bg-dark`, `--brand-c-neutral-dark`, `--brand-c-neutral-light`, `--brand-c-primary`, `--brand-c-text`, `--brand-c-text-dark`, `--glass-bg-light`, `--glass-border`, `--glow-neon`, `--shadow-lg`

```css
/* Colour props */
--tooltip-bg         /* background */
--tooltip-text       /* text colour */
--tooltip-border     /* border colour */
--tooltip-shadow     /* shadow */
```

---

## Grid

Current references: `--brand-c-neutral-light`

```css
/* Colour props */
--grid-divider       /* divider/gap colour */
```

---

## Summary

| Atom | Colour props | Old token refs to remove |
|---|---|---|
| Badge | 7 | 27 (zone-bg + zone-pattern + brand + glass) |
| Button | 11 | 25+ (brand + confetti + glass + shadow) |
| Card | 12 | 18 (brand + color + shadow + card-lg) |
| FormField | 8 | 17 (brand + color + glass + shadow) |
| Heading | 4 | 12 (brand + color + gradient) |
| Text | 3 | 5 (brand) |
| Link | 5 | 7 (brand) |
| List | 3 | 4 (brand) |
| Image | 3 | 8 (brand + color + media) |
| Icon | 3 | 6 (svg-*) |
| ScrollDrawIcon | 2 | 1 (brand) |
| Toast | 6 | 15 (brand + glass + glow + shadow) |
| Tooltip | 4 | 11 (brand + glass + glow + shadow) |
| Grid | 1 | 1 (brand) |
| **Total** | **72 props** | **~157 old refs** |

## Execution Order

Do the simplest atoms first to establish the pattern:

1. Grid (1 prop)
2. ScrollDrawIcon (2 props)
3. List (3 props)
4. Text (3 props)
5. Image (3 props)
6. Icon (3 props)
7. Heading (4 props)
8. Link (5 props)
9. Tooltip (4 props)
10. Toast (6 props)
11. FormField (8 props)
12. Card (12 props)
13. Button (11 props)
14. Badge (7 props + zone→rainbow migration)

Badge last — it has the most complex migration (zone tokens → rainbow).

## Do NOT

- Add fallback values — no `var(--card-bg, var(--brand-c-bg))`
- Change spacing, typography, radius, transition, z-index, or border-width tokens
- Change structural CSS (display, position, flex, grid)
- Rename existing non-colour props that already work
- Touch the a11y, responsive, or recovery CSS files in this pass — colour props only on the main CSS file
