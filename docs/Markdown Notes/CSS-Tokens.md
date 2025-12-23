# CSS Design Tokens Reference

A comprehensive guide to the design token system used throughout the codebase.

---

## Token File Locations

### Core Token Files

| File | Purpose |
|------|---------|
| `src/styles/tokens/index.css` | Orchestrates all token imports |
| `src/styles/tokens/typography.css` | Font families, sizes, weights, line heights |
| `src/styles/tokens/spacing.css` | Spacing scale, containers, radius aliases |
| `src/styles/tokens/shadows.css` | Box shadows, glows, glassmorphism |
| `src/styles/tokens/gradients.css` | 159 gradient definitions |
| `src/styles/tokens/status.css` | Success, warning, error, info colors |

### Theme & Brand Files

| File | Purpose |
|------|---------|
| `src/styles/themes/brand/BrandDefault.css` | 87 brand color tokens |
| `src/styles/themes/a11y/a11y-*.css` | Accessibility theme variants |
| `src/styles/themes/Preview/coretokens.css` | Preview/development tokens |

### Component-Specific Tokens

| File | Purpose |
|------|---------|
| `src/styles/buttons/dropdown-tokens.css` | Dropdown hover/selected states |
| `src/styles/design/GlowTokens.css` | Glow effects, glint animations |
| `src/styles/design/confetti.css` | Particle effect tokens |
| `src/styles/a11y/base/semantic-tokens.css` | A11y semantic aliases |

---

## Naming Conventions

### General Pattern

```
--[category]-[type]-[modifier]
```

### Category Prefixes

| Prefix | Usage |
|--------|-------|
| `--color-` | Color values |
| `--space-` | Spacing/sizing |
| `--radius-` | Border radius |
| `--shadow-` | Box shadows |
| `--text-` | Font sizes |
| `--font-` | Font families/weights |
| `--gradient-` | Gradient definitions |
| `--transition-` | Timing functions |
| `--z-` | Z-index layers |

---

## Color Tokens

### Brand Color Families

Each family has intensities from 50 (lightest) to 900 (darkest):

```css
--color-Primary-50 through --color-Primary-900
--color-Secondary-50 through --color-Secondary-900
--color-Background-50 through --color-Background-900
--color-Text-50 through --color-Text-900
--color-Neutral-50 through --color-Neutral-900
--color-AccentOne-50 through --color-AccentOne-900
--color-AccentTwo-50 through --color-AccentTwo-900
--color-AccentThree-50 through --color-AccentThree-900
--color-AccentFour-50 through --color-AccentFour-900
--color-AccentFive-50 through --color-AccentFive-900
```

### Base Colors

```css
--color-Black
--color-White
```

### Status Colors

```css
--color-Success    /* #4caf50 - green */
--color-Warning    /* #ff9800 - orange */
--color-Error      /* #f44336 - red */
--color-Danger     /* alias for Error */
--color-Info       /* #2196f3 - blue */
```

### Transparent Colors

**DO NOT USE** `rgba()` for transparent colors. Use `color-mix()` instead:

```css
/* WRONG */
background: rgba(255, 255, 255, 0.12);

/* CORRECT */
background: color-mix(in oklch, var(--color-White) 12%, transparent);
```

---

## Spacing Tokens

### Scale

```css
--space-xs      /* 4px */
--space-sm      /* 8px */
--space-md      /* 16px */
--space-lg      /* 24px */
--space-xl      /* 32px */
--space-2xl     /* 48px */
--space-3xl     /* 64px */
--space-4xl     /* 96px */
--space-5xl     /* 128px */
```

### Container Widths

```css
--container-xs      /* 320px */
--container-sm      /* 540px */
--container-md      /* 720px */
--container-lg      /* 960px */
--container-xl      /* 1140px */
--container-2xl     /* 1320px */
--container-full    /* 1440px */
```

### Page Margins

```css
--page-margin-compact       /* tighter margins */
--page-margin-comfortable   /* default */
--page-margin-spacious      /* wider margins */
--page-margin-expansive     /* maximum breathing room */
```

---

## Border Radius Tokens

**USE `--radius-*`** not `--border-radius-*`:

```css
--radius-sm     /* 4px */
--radius-md     /* 8px */
--radius-lg     /* 12px */
--radius-xl     /* 16px */
--radius-2xl    /* 24px */
--radius-full   /* 9999px (pill shape) */
```

### Legacy (avoid in new code)

```css
--border-radius-sm
--border-radius-md
--border-radius-lg
--border-radius-xl
--border-radius-full
```

---

## Shadow Tokens

### Standard Shadows

```css
--shadow-xs     /* subtle */
--shadow-sm     /* small */
--shadow        /* default */
--shadow-md     /* medium */
--shadow-lg     /* large */
--shadow-xl     /* extra large */
--shadow-2xl    /* maximum */
```

### Specialized Shadows

```css
/* Dropdowns */
--shadow-dropdown
--shadow-dropdown-sm
--shadow-dropdown-md
--shadow-dropdown-lg
--shadow-dropdown-soft

/* Buttons */
--shadow-btn
--shadow-btn-hover

/* Glows */
--shadow-glow-primary
--shadow-glow-secondary
```

### Glassmorphism

```css
--glass-bg          /* background with transparency */
--glass-border      /* subtle border */
--glass-shadow      /* soft shadow */
--glass-blur        /* backdrop-filter blur amount */

--glass-surface-bg  /* for surface elements */
--glass-overlay-bg  /* for overlays */
--glass-card-bg     /* for card components */
```

---

## Typography Tokens

### Font Families

```css
--font-heading      /* display/heading font */
--font-body         /* body text font */
--font-special      /* decorative font */
--font-secondary    /* alternative body font */
--font-mono         /* monospace/code font */
```

### Font Sizes

```css
--text-xs       /* 0.75rem (12px) */
--text-sm       /* 0.875rem (14px) */
--text-base     /* 1rem (16px) */
--text-lg       /* 1.125rem (18px) */
--text-xl       /* 1.25rem (20px) */
--text-2xl      /* 1.5rem (24px) */
--text-3xl      /* 1.875rem (30px) */
--text-4xl      /* 2.25rem (36px) */
--text-5xl      /* 3rem (48px) */
--text-6xl      /* 5rem (80px) - responsive */
```

### Font Weights

```css
--font-light        /* 300 */
--font-normal       /* 400 */
--font-medium       /* 500 */
--font-semibold     /* 600 */
--font-bold         /* 700 */
--font-extrabold    /* 800 */
```

### Line Heights

```css
--leading-none      /* 1 */
--leading-tight     /* 1.25 */
--leading-snug      /* 1.375 */
--leading-normal    /* 1.5 */
--leading-relaxed   /* 1.625 */
--leading-loose     /* 2 */
```

### Letter Spacing

```css
--letter-spacing-tighter
--letter-spacing-tight
--letter-spacing-normal
--letter-spacing-wide
--letter-spacing-wider
--letter-spacing-widest
```

---

## Transition Tokens

```css
--transition-fast       /* 150ms ease-in-out */
--transition-base       /* 300ms ease-in-out */
--transition-slow       /* 500ms ease-in-out */
--transition-extralong  /* 1.5s ease */
```

### Usage

```css
/* Single property */
transition: background-color var(--transition-fast);

/* Multiple properties */
transition: background-color var(--transition-fast),
            transform var(--transition-fast);
```

---

## Z-Index Tokens

```css
--z-base            /* 0 */
--z-dropdown        /* 1000 */
--z-sticky          /* 1020 */
--z-fixed           /* 1030 */
--z-modal-backdrop  /* 1040 */
--z-modal           /* 1050 */
--z-popover         /* 1060 */
--z-tooltip         /* 1070 */
```

---

## Gradient Tokens

### Primary Gradients

```css
--gradient-primary
--gradient-primary-soft
--gradient-primary-light
--gradient-primary-intense
--gradient-primary-radial
```

### Secondary Gradients

```css
--gradient-secondary
--gradient-secondary-soft
--gradient-secondary-light
--gradient-secondary-intense
--gradient-secondary-radial
```

### Accent Gradients

Each accent (One through Five) has variants:

```css
--gradient-accentOne
--gradient-accentOne-soft
--gradient-accentOne-light
--gradient-accentOne-intense
--gradient-accentOne-glow
--gradient-accentOne-radial
```

### Special Gradients

```css
/* Hero/Feature */
--gradient-hero
--gradient-sunset

/* Multi-color */
--gradient-brand-emerge
--gradient-brand-fade
--gradient-spectrum

/* Background */
--gradient-background-light
--gradient-background-warm
--gradient-background-cool

/* Buttons */
--gradient-btn-primary
--gradient-btn-secondary
--gradient-btn-ghost

/* Cards */
--gradient-card-light
--gradient-card-elevated
--gradient-card-featured

/* Rainbow */
--gradient-rainbow-primary
--gradient-pastel-rainbow-all
--gradient-vivid-rainbow-all
--gradient-deep-rainbow-all

/* Status */
--gradient-success
--gradient-warning
--gradient-error

/* Overlays */
--gradient-overlay-dark
--gradient-overlay-light
--gradient-glass
```

---

## Border Tokens

```css
--border-width      /* 1px */
--border-width-2    /* 2px */
--border-width-4    /* 4px */
```

---

## Animation Tokens

### Glint Effect

```css
--glint-gradient
--glint-gradient-strong
--glint-gradient-subtle
--glint-speed           /* 0.5s */
```

### Rainbow Border

```css
--rainbow-border-animation  /* glowloop 8s linear infinite */
```

### Confetti

```css
--confetti-pink
--confetti-purple
--confetti-teal
--confetti-blue
--confetti-gold
--confetti-green

--confetti-duration-min
--confetti-duration-max
--confetti-spread
--confetti-count
--confetti-size-min
--confetti-size-max
```

---

## A11y Semantic Tokens

When an accessibility theme is active, these semantic aliases apply:

```css
/* Surfaces */
--bg
--surface
--surface2
--surface3

/* Text */
--text
--textMuted

/* Links */
--link
--linkHover
--linkVisited
--focusRing

/* Status */
--success
--warning
--error
--danger

/* States */
--selectionBg
--selectionText
--disabledBg
--disabledText
```

---

## Responsive Breakpoints

Tokens are adjusted at these breakpoints:

| Name | Width | File |
|------|-------|------|
| xs | 400px | `responsive/xs.css` |
| phone | 640px | `responsive/phone.css` |
| tablet | 768px | `responsive/tablet.css` |
| desktop | 1024px | `responsive/desktop.css` |
| max | 1440px+ | `responsive/max.css` |

---

## Quick Reference

### Most Common Tokens

```css
/* Colors */
var(--color-Primary-500)
var(--color-Background-50)
var(--color-Text-900)
var(--color-Neutral-300)

/* Spacing */
var(--space-md)
var(--space-lg)
var(--space-xl)

/* Radius */
var(--radius-lg)
var(--radius-full)

/* Shadows */
var(--shadow-lg)
var(--shadow-xl)

/* Typography */
var(--text-lg)
var(--font-semibold)

/* Transitions */
var(--transition-fast)
var(--transition-base)

/* Z-index */
var(--z-modal)
var(--z-dropdown)
```

### Transparent Color Pattern

```css
/* 12% white */
color-mix(in oklch, var(--color-White) 12%, transparent)

/* 85% black */
color-mix(in oklch, var(--color-Black) 85%, transparent)

/* 20% primary */
color-mix(in oklch, var(--color-Primary-500) 20%, transparent)
```

---

## Import Order (global.css)

1. Reset (`base/reset.css`)
2. Tokens (`tokens/index.css`)
3. Brand Theme (`themes/brand/BrandDefault.css`)
4. Components (`buttons/*.css`)
5. Design Effects (`design/*.css`)
6. Utilities (`base/utilities.css`)
7. Accessibility (`a11y/index.css`)
