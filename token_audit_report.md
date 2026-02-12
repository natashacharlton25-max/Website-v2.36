# Full CSS Token Audit Report

**Project:** `src`

**Tokens defined:** 287

**Tokens used:** 260


## Executive Summary

| Category | Count | Status |
|----------|-------|--------|
| Defined, never used | 67 | 🟡 TIDY |
| Naming mismatches (old → correct) | 10 | 🟠 FIX |
| Truly undefined (used, never defined) | 30 | 🟠 REVIEW |
| Multi-defined (conflicting values) | 59 | 🟡 CHECK |
| Total definitions | 524 | ⚪ INFO |
| Total var() references | 6941 | ⚪ INFO |

---

## 1. Defined But Never Used (67)


### A11Y (3)

| Token | Value | File(s) |
|-------|-------|---------|
| `--a11y-font-preview` | `$` | components\Button\ButtonDropdown.astro |
| `--a11y-hc-border` | `var(--brand-c-primary)` | styles\themes\a11y\a11y-high-contrast.css |
| `--a11y-hc-icon-filter` | `brightness(0) invert(1)` | styles\themes\a11y\a11y-high-contrast.css |

### Borders (1)

| Token | Value | File(s) |
|-------|-------|---------|
| `--border-width-4` | `4px` | styles\tokens\spacing.css |

### Buttons (5)

| Token | Value | File(s) |
|-------|-------|---------|
| `--btn-ghost-text` | `var(--brand-c-primary)` | styles\themes\a11y\a11y-deuteranopia.css, styles\themes\brand\BrandDefault.css, styles\themes\a11y\a11y-monochrome.css, styles\themes\a11y\a11y-cream.css, styles\themes\a11y\a11y-high-contrast.css, styles\themes\a11y\a11y-tritanopia.css, styles\themes\a11y\a11y-dark.css, styles\themes\a11y\a11y-protanopia.css |
| `--btn-icon-color` | `$` | components\Button\Button.astro |
| `--btn-icon-hover` | `$` | components\Button\Button.astro |
| `--btn-outline-text` | `var(--brand-c-primary)` | styles\themes\a11y\a11y-deuteranopia.css, styles\themes\brand\BrandDefault.css, styles\themes\a11y\a11y-monochrome.css, styles\themes\a11y\a11y-cream.css, styles\themes\a11y\a11y-high-contrast.css, styles\themes\a11y\a11y-tritanopia.css, styles\themes\a11y\a11y-dark.css, styles\themes\a11y\a11y-protanopia.css |
| `--btn-text-hover` | `$` | components\Button\Button.astro |

### Confetti (6)

| Token | Value | File(s) |
|-------|-------|---------|
| `--confetti-count` | `60` | styles\design\confetti.css |
| `--confetti-duration-max` | `3000ms` | styles\design\confetti.css |
| `--confetti-duration-min` | `1500ms` | styles\design\confetti.css |
| `--confetti-size-max` | `40px` | styles\design\confetti.css |
| `--confetti-size-min` | `4px` | styles\design\confetti.css |
| `--confetti-spread` | `150px` | styles\design\confetti.css |

### Glass (9)

| Token | Value | File(s) |
|-------|-------|---------|
| `--glass-card-bg` | `color-mix(in oklch, var(--brand-c-bg) 15%, transparent)` | styles\tokens\shadows.css |
| `--glass-card-blur` | `10px` | styles\tokens\shadows.css |
| `--glass-card-border` | `color-mix(in oklch, var(--brand-c-bg) 18%, transparent)` | styles\tokens\shadows.css |
| `--glass-card-shadow` | `0 8px 24px 0 color-mix(in oklch, var(--brand-c-primary-dark)` | styles\tokens\shadows.css |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--brand-c-bg) 5%, transparent)` | styles\tokens\shadows.css |
| `--glass-overlay-shadow` | `0 4px 16px 0 color-mix(in oklch, var(--brand-c-primary-dark)` | styles\tokens\shadows.css |
| `--glass-surface-bg` | `color-mix(in oklch, var(--brand-c-bg) 10%, transparent)` | styles\tokens\shadows.css |
| `--glass-surface-blur` | `12px` | styles\tokens\shadows.css |
| `--glass-surface-shadow` | `0 8px 32px 0 color-mix(in oklch, var(--brand-c-primary-dark)` | styles\tokens\shadows.css |

### Gradients (1)

| Token | Value | File(s) |
|-------|-------|---------|
| `--gradient-btn-ghost` | `linear-gradient(135deg, transparent 0%, color-mix(in oklch, ` | styles\tokens\gradients.css |

### Images (1)

| Token | Value | File(s) |
|-------|-------|---------|
| `--svg-size` | `1.5rem` | styles\tokens\images.css |

### Other (9)

| Token | Value | File(s) |
|-------|-------|---------|
| `--autoplay` | `paused !important` | styles\a11y\motion\reduced-motion.css |
| `--divider` | `:after` | components\Presentation\Sections\CompareSection.astro, styles\components\presentation\sections.css |
| `--dropdown-hover-bg` | `var(--brand-c-primary-light)` | styles\buttons\dropdown-tokens.css |
| `--dropdown-hover-text` | `var(--brand-c-primary-dark)` | styles\buttons\dropdown-tokens.css |
| `--featured` | `global(.btn)` | components\Grids\RelatedGrid.astro |
| `--hero-overlay-color` | `var(--brand-c-bg)` | styles\themes\a11y\a11y-deuteranopia.css, styles\themes\brand\BrandDefault.css, styles\themes\a11y\a11y-monochrome.css, styles\themes\a11y\a11y-cream.css, styles\themes\a11y\a11y-high-contrast.css, styles\themes\a11y\a11y-tritanopia.css, styles\themes\a11y\a11y-dark.css, styles\themes\a11y\a11y-protanopia.css |
| `--horizontal` | `global(.btn)` | components\Grids\RelatedGrid.astro |
| `--shape-tag` | `:before` | components\Badge\Badge.astro |
| `--typography` | `last-child` | components\A11y Panel\TypographySection.astro |

### Shadows (15)

| Token | Value | File(s) |
|-------|-------|---------|
| `--shadow-base` | `none` | styles\tokens\shadows.css, styles\themes\a11y\a11y-dark.css |
| `--shadow-dropdown` | `4px 4px 6px color-mix(in oklch, var(--brand-c-bg-dark) 20%, ` | styles\tokens\shadows.css |
| `--shadow-dropdown-lg` | `0 8px 16px color-mix(in oklch, var(--brand-c-bg-dark) 12%, t` | styles\tokens\shadows.css |
| `--shadow-dropdown-sm` | `0 2px 4px color-mix(in oklch, var(--brand-c-bg-dark) 8%, tra` | styles\tokens\shadows.css |
| `--shadow-dropdown-soft` | `4px 4px 6px color-mix(in oklch, var(--brand-c-bg-dark) 20%, ` | styles\tokens\shadows.css |
| `--shadow-glow-primary` | `0 0 14px color-mix(in oklch, var(--brand-c-primary) 50%, tra` | styles\tokens\shadows.css, styles\themes\a11y\a11y-dark.css |
| `--shadow-glow-secondary` | `0 0 14px color-mix(in oklch, var(--brand-c-secondary) 50%, t` | styles\tokens\shadows.css, styles\themes\a11y\a11y-dark.css |
| `--shadow-inner-2xl` | `inset 0 0 40px 16px` | styles\tokens\shadows.css |
| `--shadow-inner-md` | `inset 0 0 10px 4px` | styles\tokens\shadows.css |
| `--shadow-inner-xl` | `inset 0 0 30px 12px` | styles\tokens\shadows.css |
| `--shadow-neomorph` | `` | styles\tokens\shadows.css |
| `--shadow-neomorph-lg` | `` | styles\tokens\shadows.css |
| `--shadow-neomorph-sm` | `` | styles\tokens\shadows.css |
| `--shadow-neomorph-xl` | `` | styles\tokens\shadows.css |
| `--shadow-xs` | `none` | styles\tokens\shadows.css, styles\themes\a11y\a11y-dark.css |

### Spacing (4)

| Token | Value | File(s) |
|-------|-------|---------|
| `--page-margin-expansive` | `6rem` | styles\tokens\spacing.css |
| `--space-6xl` | `10rem` | styles\tokens\spacing.css |
| `--space-8xl` | `16rem` | styles\tokens\spacing.css |
| `--space-section` | `var(--space-3xl)` | styles\responsive\tablet.css, styles\responsive\max.css, styles\responsive\phone.css, styles\responsive\desktop.css, styles\responsive\xs.css |

### Transitions (3)

| Token | Value | File(s) |
|-------|-------|---------|
| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4)` | styles\tokens\shadows.css |
| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1)` | styles\tokens\shadows.css |
| `--transition-extralong` | `1.5s ease` | styles\tokens\spacing.css |

### Typography (6)

| Token | Value | File(s) |
|-------|-------|---------|
| `--font-secondary` | `'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', ` | styles\tokens\typography.css |
| `--font-size-3xl` | `30px !important` | styles\components\a11y-panel.css |
| `--font-special` | `'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', ` | styles\tokens\typography.css |
| `--leading-loose` | `2` | styles\tokens\typography.css |
| `--letter-spacing-tight` | `-0.05em` | styles\tokens\typography.css |
| `--letter-spacing-wider` | `0.1em` | styles\tokens\typography.css |

### Z-Index (4)

| Token | Value | File(s) |
|-------|-------|---------|
| `--z-fixed` | `1030` | styles\tokens\spacing.css |
| `--z-modal-backdrop` | `1040` | styles\tokens\spacing.css |
| `--z-popover` | `1060` | styles\tokens\spacing.css |
| `--z-tooltip` | `1070` | styles\tokens\spacing.css |

---

## 2. Naming Mismatches (10)

These tokens are used but appear to be old/wrong names for existing tokens.

| Used (wrong) | Should be | Uses | Example locations |
|-------------|-----------|------|-------------------|
| `--font-weight-bold` | `--font-bold` | 9 | components\A11y Panel\FontCard.astro L72; components\A11y Panel\NavigationSection.astro L54; components\A11y Panel\PresetButton.astro L85 |
| `--tracking-wide` | `--letter-spacing-wide` | 4 | styles\components\masonry-card.css L36; styles\components\masonry-card.css L46; styles\components\masonry-card.css L59 |
| `--font-weight-medium` | `--font-medium` | 3 | components\A11y Panel\Slider.astro L88; components\A11y Panel\Slider.astro L95; components\A11y Panel\Toggle.astro L59 |
| `--tracking-normal` | `--letter-spacing-normal` | 2 | styles\components\masonry-card.css L78; styles\components\masonry-card.css L179 |
| `--color-Danger` | `--color-Error` | 1 | styles\global.css L303 |
| `--color-secondary-500` | `--brand-c-secondary` | 1 | components\Cards\ProductCard.astro L123 |
| `--font-extra-bold` | `--font-extrabold` | 1 | styles\global.css L129 |
| `--font-regular` | `--font-normal` | 1 | styles\components\nav\GlassNav-mobile.css L291 |
| `--font-weight-semibold` | `--font-semibold` | 1 | components\A11y Panel\Stepper.astro L109 |
| `--tracking-wider` | `--letter-spacing-wider` | 1 | styles\components\masonry-card.css L67 |

---

## 3. Used But Never Defined (30)

These tokens are referenced via var() but have no definition anywhere.


### A11Y (1)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--a11y-line-height` | 1 | styles\a11y\visual\index.css L32 |

### Aspect Ratio (5)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--aspect-3-2` | 1 | styles\components\masonry-card.css L280 |
| `--aspect-3-4` | 1 | styles\components\masonry-card.css L290 |
| `--aspect-4-5` | 1 | styles\components\masonry-card.css L285 |
| `--aspect-square` | 1 | styles\components\masonry-card.css L193 |
| `--aspect-video` | 1 | styles\components\masonry-card.css L269 |

### Borders (3)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--radius-xs` | 3 | components\ContactForm\Contact-Popup.astro L636; styles\components\image-text-section.css L183; styles\components\who-slider.css L414 |
| `--border-radius-2xl` | 1 | components\Search\SearchOverlay.astro L122 |
| `--border-width-md` | 1 | styles\components\masonry-card.css L14 |

### Brand Colour (1)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--brand-c-primary-rgb` | 2 | styles\components\presentation\ReaderNav.css L873; styles\components\presentation\ReaderNav.css L874 |

### Buttons (2)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--btn-gradient-glow` | 2 | styles\design\GlowTokens.css L13; styles\design\GlowTokens.css L24 |
| `--btn-color-500` | 1 | styles\design\GlowTokens.css L7 |

### Glass (2)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--glass-bg-hover` | 1 | styles\buttons\basic-button.css L193 |
| `--glass-shadow-hover` | 1 | styles\buttons\basic-button.css L194 |

### Layout (5)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--body-top-padding` | 4 | components\Presentation\Sections\TitleSection.astro L94; styles\global.css L72; styles\components\hero-section.css L74 |
| `--section-count` | 1 | styles\components\presentation\Reader.css L21 |
| `--selector-left` | 1 | components\Switcher\BaseSwitcher.astro L206 |
| `--selector-width` | 1 | components\Switcher\BaseSwitcher.astro L211 |
| `--spec-grid-col` | 1 | styles\pages\asset-detail.css L636 |

### Navigation (2)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--nav-height` | 18 | pages\search.astro L195; pages\search.astro L196; pages\search.astro L486 |
| `--nav-top-offset` | 2 | styles\components\nav\GlassNav-base.css L9; styles\components\nav\GlassNav-mobile.css L37 |

### Opacity (3)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--opacity-high` | 4 | styles\components\masonry-card.css L69; styles\components\masonry-card.css L119; styles\components\masonry-card.css L131 |
| `--opacity-medium` | 1 | styles\components\masonry-card.css L142 |
| `--opacity-medium-high` | 1 | styles\components\masonry-card.css L147 |

### Spacing (1)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--space-2` | 1 | components\Nav\Tabs\SideTabs.astro L144 |

### Status Colour (2)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--color-` | 4 | components\Masonry\MasonryCards\MasonryCard.astro L91; components\Masonry\MasonryCards\MasonryCard.astro L91; components\Masonry\MasonryCards\types.ts L96 |
| `--color-Name-100` | 1 | components\Scroll\ScrollColorBackground.astro L10 |

### Typography (3)

| Token | Uses | Example locations |
|-------|------|-------------------|
| `--text-2xs` | 5 | components\ContactForm\Contact-Popup.astro L539; components\ContactForm\Contact-Popup.astro L670; components\ContactForm\Contact-Popup.astro L709 |
| `--text-md` | 3 | components\Cards\ProductCard.astro L216; components\Cards\ProjectCard.astro L136; components\Cards\SpecCard.astro L62 |
| `--leading-none` | 1 | styles\components\masonry-card.css L99 |

---

## 4. Multi-Defined with Different Values (59)

Tokens defined in multiple places with conflicting values (theme overrides are expected).


### Genuine Conflicts (12)

| Token | Values | Files |
|-------|--------|-------|
| `--badge-color` | `var(--brand-c-text-dark)`; `var(--color-Error)`; `var(--color-Success)`; `var(--color-Success)`; `var(--color-Info, var(--brand-c-primary)`; `oklch(0.45 0.08 var(--topic-hue))` | components\Badge\Badge.astro L268; components\Badge\Badge.astro L274; components\Badge\Badge.astro L279; components\Badge\Badge.astro L284; components\Badge\Badge.astro L289; components\Badge\Badge.astro L295 |
| `--glass-card-bg` | `color-mix(in oklch, var(--brand-c-bg) 15`; `color-mix(in oklch, var(--brand-c-bg-dar` | styles\tokens\shadows.css L96; styles\tokens\shadows.css L107 |
| `--glass-card-border` | `color-mix(in oklch, var(--brand-c-bg) 18`; `color-mix(in oklch, var(--brand-c-bg) 10` | styles\tokens\shadows.css L99; styles\tokens\shadows.css L108 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--brand-c-bg) 5%`; `color-mix(in oklch, var(--brand-c-bg-dar` | styles\tokens\shadows.css L91; styles\tokens\shadows.css L106 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--brand-c-bg) 10`; `color-mix(in oklch, var(--brand-c-bg-dar` | styles\tokens\shadows.css L86; styles\tokens\shadows.css L105 |
| `--page-margin` | `var(--page-margin-spacious)`; `var(--page-margin-compact)`; `var(--page-margin-comfortable)`; `var(--page-margin-compact)`; `var(--page-margin-comfortable)` | styles\responsive\max.css L13; styles\responsive\phone.css L14; styles\responsive\tablet.css L14; styles\responsive\xs.css L13; styles\tokens\spacing.css L43 |
| `--slider-color` | `var(--brand-c-text-dark)`; `var(--brand-c-text-light)`; `var(--brand-c-text-dark)` | styles\components\presentation\ReaderNav.css L407; styles\components\presentation\ReaderNav.css L459; styles\components\presentation\ReaderNav.css L463 |
| `--space-section` | `var(--space-3xl)`; `var(--space-4xl)`; `var(--space-xl)`; `var(--space-2xl)`; `var(--space-lg)` | styles\responsive\desktop.css L13; styles\responsive\max.css L14; styles\responsive\phone.css L15; styles\responsive\tablet.css L15; styles\responsive\xs.css L14 |
| `--text-3xl` | `1.875rem`; `2rem` | styles\tokens\typography.css L24; styles\tokens\typography.css L57 |
| `--text-4xl` | `2rem`; `2.25rem`; `2.25rem`; `2.5rem`; `3rem` | styles\responsive\phone.css L9; styles\responsive\tablet.css L9; styles\tokens\typography.css L25; styles\tokens\typography.css L58; styles\tokens\typography.css L67 |
| `--text-5xl` | `3.5rem`; `4.5rem`; `2.5rem`; `3rem`; `2rem`; `3rem`; `3.5rem`; `4rem` | styles\responsive\desktop.css L9; styles\responsive\max.css L9; styles\responsive\phone.css L10; styles\responsive\tablet.css L10; styles\responsive\xs.css L9; styles\tokens\typography.css L26; styles\tokens\typography.css L59; styles\tokens\typography.css L68 |
| `--text-6xl` | `4.5rem`; `6rem`; `3rem`; `3.75rem`; `2.5rem`; `3.75rem`; `4.5rem`; `5rem` | styles\responsive\desktop.css L10; styles\responsive\max.css L10; styles\responsive\phone.css L11; styles\responsive\tablet.css L11; styles\responsive\xs.css L10; styles\tokens\typography.css L27; styles\tokens\typography.css L60; styles\tokens\typography.css L69 |

### Theme Overrides (47) — Expected

_47 tokens have per-theme values. This is correct._


---

## 5. Token Inventory


### A11Y (4 tokens, 3 defined, 1 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--a11y-line-height` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--a11y-font-preview` | ✅ | — |  🗑️ |
| `--a11y-hc-border` | ✅ | — |  🗑️ |
| `--a11y-hc-icon-filter` | ✅ | — |  🗑️ |

### Aspect Ratio (5 tokens, 0 defined, 5 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--aspect-3-2` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--aspect-3-4` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--aspect-4-5` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--aspect-square` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--aspect-video` | ❌ | 1 |  ⚠️ UNDEFINED |

### Borders (17 tokens, 14 defined, 16 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--radius-lg` | ✅ | 85 |  |
| `--radius-full` | ✅ | 42 |  |
| `--border-radius-md` | ✅ | 41 |  |
| `--radius-md` | ✅ | 38 |  |
| `--border-width` | ✅ | 28 |  |
| `--radius-sm` | ✅ | 26 |  |
| `--border-radius-lg` | ✅ | 19 |  |
| `--border-radius-xl` | ✅ | 15 |  |
| `--border-width-2` | ✅ | 14 |  |
| `--border-radius-full` | ✅ | 12 |  |
| `--radius-xl` | ✅ | 12 |  |
| `--border-radius-sm` | ✅ | 10 |  |
| `--border-radius` | ✅ | 6 |  |
| `--radius-xs` | ❌ | 3 |  ⚠️ UNDEFINED |
| `--border-radius-2xl` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--border-width-md` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--border-width-4` | ✅ | — |  🗑️ |

### Brand Colour (16 tokens, 15 defined, 16 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--brand-c-text` | ✅ | 358 |  |
| `--brand-c-primary` | ✅ | 346 |  |
| `--brand-c-primary-dark` | ✅ | 250 |  |
| `--brand-c-bg` | ✅ | 248 |  |
| `--brand-c-text-light` | ✅ | 129 |  |
| `--brand-c-secondary` | ✅ | 115 |  |
| `--brand-c-neutral-light` | ✅ | 110 |  |
| `--brand-c-text-dark` | ✅ | 81 |  |
| `--brand-c-primary-light` | ✅ | 75 |  |
| `--brand-c-bg-light` | ✅ | 56 |  |
| `--brand-c-neutral-dark` | ✅ | 48 |  |
| `--brand-c-neutral` | ✅ | 42 |  |
| `--brand-c-bg-dark` | ✅ | 37 |  |
| `--brand-c-secondary-dark` | ✅ | 25 |  |
| `--brand-c-secondary-light` | ✅ | 11 |  |
| `--brand-c-primary-rgb` | ❌ | 2 |  ⚠️ UNDEFINED |

### Buttons (9 tokens, 7 defined, 4 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--btn-filled-text` | ✅ | 8 |  |
| `--btn-gradient-glow` | ❌ | 2 |  ⚠️ UNDEFINED |
| `--btn-color-500` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--btn-text-color` | ✅ | 1 |  |
| `--btn-ghost-text` | ✅ | — |  🗑️ |
| `--btn-icon-color` | ✅ | — |  🗑️ |
| `--btn-icon-hover` | ✅ | — |  🗑️ |
| `--btn-outline-text` | ✅ | — |  🗑️ |
| `--btn-text-hover` | ✅ | — |  🗑️ |

### Confetti (10 tokens, 10 defined, 4 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--confetti-light` | ✅ | 1 |  |
| `--confetti-mid` | ✅ | 1 |  |
| `--confetti-primary` | ✅ | 1 |  |
| `--confetti-secondary` | ✅ | 1 |  |
| `--confetti-count` | ✅ | — |  🗑️ |
| `--confetti-duration-max` | ✅ | — |  🗑️ |
| `--confetti-duration-min` | ✅ | — |  🗑️ |
| `--confetti-size-max` | ✅ | — |  🗑️ |
| `--confetti-size-min` | ✅ | — |  🗑️ |
| `--confetti-spread` | ✅ | — |  🗑️ |

### Glass (16 tokens, 14 defined, 7 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--glass-blur` | ✅ | 5 |  |
| `--glass-bg` | ✅ | 4 |  |
| `--glass-shadow` | ✅ | 4 |  |
| `--glass-border` | ✅ | 2 |  |
| `--glass-bg-hover` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--glass-overlay-blur` | ✅ | 1 |  |
| `--glass-shadow-hover` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--glass-card-bg` | ✅ | — |  🗑️ |
| `--glass-card-blur` | ✅ | — |  🗑️ |
| `--glass-card-border` | ✅ | — |  🗑️ |
| `--glass-card-shadow` | ✅ | — |  🗑️ |
| `--glass-overlay-bg` | ✅ | — |  🗑️ |
| `--glass-overlay-shadow` | ✅ | — |  🗑️ |
| `--glass-surface-bg` | ✅ | — |  🗑️ |
| `--glass-surface-blur` | ✅ | — |  🗑️ |
| `--glass-surface-shadow` | ✅ | — |  🗑️ |

### Gradients (22 tokens, 22 defined, 21 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--gradient-hero` | ✅ | 8 |  |
| `--gradient-primary` | ✅ | 4 |  |
| `--gradient-secondary` | ✅ | 4 |  |
| `--gradient-primary-light` | ✅ | 2 |  |
| `--gradient-primary-soft` | ✅ | 2 |  |
| `--gradient-secondary-soft` | ✅ | 2 |  |
| `--gradient-background-cool` | ✅ | 1 |  |
| `--gradient-background-light` | ✅ | 1 |  |
| `--gradient-background-warm` | ✅ | 1 |  |
| `--gradient-brand-emerge` | ✅ | 1 |  |
| `--gradient-brand-fade` | ✅ | 1 |  |
| `--gradient-btn-primary` | ✅ | 1 |  |
| `--gradient-btn-primary-hover` | ✅ | 1 |  |
| `--gradient-btn-secondary` | ✅ | 1 |  |
| `--gradient-btn-secondary-hover` | ✅ | 1 |  |
| `--gradient-card-elevated` | ✅ | 1 |  |
| `--gradient-card-light` | ✅ | 1 |  |
| `--gradient-dark` | ✅ | 1 |  |
| `--gradient-light` | ✅ | 1 |  |
| `--gradient-neutral` | ✅ | 1 |  |
| `--gradient-sunset` | ✅ | 1 |  |
| `--gradient-btn-ghost` | ✅ | — |  🗑️ |

### Images (50 tokens, 50 defined, 49 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--img-height-lg` | ✅ | 9 |  |
| `--img-height-xl` | ✅ | 8 |  |
| `--img-width-lg` | ✅ | 8 |  |
| `--img-width-xl` | ✅ | 8 |  |
| `--img-height-2xl` | ✅ | 6 |  |
| `--img-height-3xl` | ✅ | 6 |  |
| `--img-height-md` | ✅ | 6 |  |
| `--img-height-sm` | ✅ | 6 |  |
| `--img-width-2xl` | ✅ | 6 |  |
| `--img-width-3xl` | ✅ | 6 |  |
| `--img-width-md` | ✅ | 6 |  |
| `--img-width-sm` | ✅ | 6 |  |
| `--img-height-xs` | ✅ | 4 |  |
| `--img-width-xs` | ✅ | 4 |  |
| `--img-radius` | ✅ | 3 |  |
| `--img-shadow-lg` | ✅ | 3 |  |
| `--img-filter-blur` | ✅ | 2 |  |
| `--img-filter-brightness` | ✅ | 2 |  |
| `--img-filter-contrast` | ✅ | 2 |  |
| `--img-filter-grayscale` | ✅ | 2 |  |
| `--img-filter-saturate` | ✅ | 2 |  |
| `--img-filter-sepia` | ✅ | 2 |  |
| `--img-radius-full` | ✅ | 2 |  |
| `--img-radius-lg` | ✅ | 2 |  |
| `--img-radius-sm` | ✅ | 2 |  |
| `--img-shadow-md` | ✅ | 2 |  |
| `--img-shadow-sm` | ✅ | 2 |  |
| `--svg-size-lg` | ✅ | 2 |  |
| `--svg-size-md` | ✅ | 2 |  |
| `--svg-size-sm` | ✅ | 2 |  |
| `--svg-size-xl` | ✅ | 2 |  |
| `--img-border-color` | ✅ | 1 |  |
| `--img-border-style` | ✅ | 1 |  |
| `--img-border-width` | ✅ | 1 |  |
| `--img-filter` | ✅ | 1 |  |
| `--img-hover-filter` | ✅ | 1 |  |
| `--img-hover-scale` | ✅ | 1 |  |
| `--img-hover-shadow` | ✅ | 1 |  |
| `--img-shadow` | ✅ | 1 |  |
| `--img-transition` | ✅ | 1 |  |
| `--svg-drop-shadow` | ✅ | 1 |  |
| `--svg-drop-shadow-md` | ✅ | 1 |  |
| `--svg-fill` | ✅ | 1 |  |
| `--svg-filter` | ✅ | 1 |  |
| `--svg-hover-filter` | ✅ | 1 |  |
| `--svg-hover-scale` | ✅ | 1 |  |
| `--svg-stroke` | ✅ | 1 |  |
| `--svg-stroke-width` | ✅ | 1 |  |
| `--svg-transition` | ✅ | 1 |  |
| `--svg-size` | ✅ | — |  🗑️ |

### Layout (6 tokens, 1 defined, 6 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--body-top-padding` | ❌ | 4 |  ⚠️ UNDEFINED |
| `--section-count` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--section-title-color` | ✅ | 1 |  |
| `--selector-left` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--selector-width` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--spec-grid-col` | ❌ | 1 |  ⚠️ UNDEFINED |

### Navigation (2 tokens, 0 defined, 2 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--nav-height` | ❌ | 18 |  ⚠️ UNDEFINED |
| `--nav-top-offset` | ❌ | 2 |  ⚠️ UNDEFINED |

### Opacity (3 tokens, 0 defined, 3 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--opacity-high` | ❌ | 4 |  ⚠️ UNDEFINED |
| `--opacity-medium` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--opacity-medium-high` | ❌ | 1 |  ⚠️ UNDEFINED |

### Other (36 tokens, 33 defined, 27 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--shadow` | ✅ | 13 |  |
| `--badge-color` | ✅ | 9 |  |
| `--overlay-opacity` | ✅ | 8 |  |
| `--media-brightness` | ✅ | 4 |  |
| `--media-contrast` | ✅ | 4 |  |
| `--media-saturation` | ✅ | 4 |  |
| `--slider-color` | ✅ | 4 |  |
| `--tracking-wide` | ❌ | 4 |  → `--letter-spacing-wide` |
| `--topic-hue` | ✅ | 3 |  |
| `--tracking-normal` | ❌ | 2 |  → `--letter-spacing-normal` |
| `--card-hover-border` | ✅ | 1 |  |
| `--dropdown-border-color` | ✅ | 1 |  |
| `--dropdown-neutral-border` | ✅ | 1 |  |
| `--dropdown-neutral-hover-bg` | ✅ | 1 |  |
| `--dropdown-neutral-hover-text` | ✅ | 1 |  |
| `--dropdown-primary-border` | ✅ | 1 |  |
| `--dropdown-primary-hover-bg` | ✅ | 1 |  |
| `--dropdown-primary-hover-text` | ✅ | 1 |  |
| `--dropdown-secondary-border` | ✅ | 1 |  |
| `--dropdown-secondary-hover-bg` | ✅ | 1 |  |
| `--dropdown-secondary-hover-text` | ✅ | 1 |  |
| `--dropdown-selected-bg` | ✅ | 1 |  |
| `--dropdown-selected-text` | ✅ | 1 |  |
| `--focus-ring-color` | ✅ | 1 |  |
| `--focus-ring-width` | ✅ | 1 |  |
| `--page-bg` | ✅ | 1 |  |
| `--tracking-wider` | ❌ | 1 |  → `--letter-spacing-wider` |
| `--autoplay` | ✅ | — |  🗑️ |
| `--divider` | ✅ | — |  🗑️ |
| `--dropdown-hover-bg` | ✅ | — |  🗑️ |
| `--dropdown-hover-text` | ✅ | — |  🗑️ |
| `--featured` | ✅ | — |  🗑️ |
| `--hero-overlay-color` | ✅ | — |  🗑️ |
| `--horizontal` | ✅ | — |  🗑️ |
| `--shape-tag` | ✅ | — |  🗑️ |
| `--typography` | ✅ | — |  🗑️ |

### Shadows (25 tokens, 25 defined, 10 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--shadow-md` | ✅ | 41 |  |
| `--shadow-xl` | ✅ | 25 |  |
| `--shadow-sm` | ✅ | 21 |  |
| `--shadow-lg` | ✅ | 20 |  |
| `--shadow-2xl` | ✅ | 9 |  |
| `--shadow-inner-lg` | ✅ | 3 |  |
| `--shadow-btn` | ✅ | 2 |  |
| `--shadow-btn-hover` | ✅ | 1 |  |
| `--shadow-dropdown-md` | ✅ | 1 |  |
| `--shadow-inner-sm` | ✅ | 1 |  |
| `--shadow-base` | ✅ | — |  🗑️ |
| `--shadow-dropdown` | ✅ | — |  🗑️ |
| `--shadow-dropdown-lg` | ✅ | — |  🗑️ |
| `--shadow-dropdown-sm` | ✅ | — |  🗑️ |
| `--shadow-dropdown-soft` | ✅ | — |  🗑️ |
| `--shadow-glow-primary` | ✅ | — |  🗑️ |
| `--shadow-glow-secondary` | ✅ | — |  🗑️ |
| `--shadow-inner-2xl` | ✅ | — |  🗑️ |
| `--shadow-inner-md` | ✅ | — |  🗑️ |
| `--shadow-inner-xl` | ✅ | — |  🗑️ |
| `--shadow-neomorph` | ✅ | — |  🗑️ |
| `--shadow-neomorph-lg` | ✅ | — |  🗑️ |
| `--shadow-neomorph-sm` | ✅ | — |  🗑️ |
| `--shadow-neomorph-xl` | ✅ | — |  🗑️ |
| `--shadow-xs` | ✅ | — |  🗑️ |

### Spacing (34 tokens, 33 defined, 30 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--space-md` | ✅ | 479 |  |
| `--space-sm` | ✅ | 449 |  |
| `--space-xs` | ✅ | 387 |  |
| `--space-lg` | ✅ | 339 |  |
| `--space-xl` | ✅ | 240 |  |
| `--space-2xl` | ✅ | 147 |  |
| `--space-3xl` | ✅ | 79 |  |
| `--space-4xl` | ✅ | 48 |  |
| `--space-2xs` | ✅ | 15 |  |
| `--container-default` | ✅ | 9 |  |
| `--page-margin` | ✅ | 8 |  |
| `--space-5xl` | ✅ | 5 |  |
| `--container-sm` | ✅ | 4 |  |
| `--container-7xl` | ✅ | 3 |  |
| `--container-full` | ✅ | 3 |  |
| `--container-md` | ✅ | 3 |  |
| `--space-3xs` | ✅ | 3 |  |
| `--space-7xl` | ✅ | 3 |  |
| `--container-2xl` | ✅ | 2 |  |
| `--container-6xl` | ✅ | 2 |  |
| `--container-xs` | ✅ | 2 |  |
| `--page-margin-comfortable` | ✅ | 2 |  |
| `--page-margin-compact` | ✅ | 2 |  |
| `--container-3xl` | ✅ | 1 |  |
| `--container-4xl` | ✅ | 1 |  |
| `--container-5xl` | ✅ | 1 |  |
| `--container-lg` | ✅ | 1 |  |
| `--container-xl` | ✅ | 1 |  |
| `--page-margin-spacious` | ✅ | 1 |  |
| `--space-2` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--page-margin-expansive` | ✅ | — |  🗑️ |
| `--space-6xl` | ✅ | — |  🗑️ |
| `--space-8xl` | ✅ | — |  🗑️ |
| `--space-section` | ✅ | — |  🗑️ |

### Status Colour (10 tokens, 6 defined, 10 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--color-White` | ✅ | 216 |  |
| `--color-Black` | ✅ | 93 |  |
| `--color-Success` | ✅ | 25 |  |
| `--color-Error` | ✅ | 20 |  |
| `--color-Warning` | ✅ | 9 |  |
| `--color-Info` | ✅ | 5 |  |
| `--color-` | ❌ | 4 |  ⚠️ UNDEFINED |
| `--color-Danger` | ❌ | 1 |  → `--color-Error` |
| `--color-Name-100` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--color-secondary-500` | ❌ | 1 |  → `--brand-c-secondary` |

### Transitions (8 tokens, 8 defined, 5 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--transition-fast` | ✅ | 88 |  |
| `--transition-base` | ✅ | 56 |  |
| `--transition-slow` | ✅ | 2 |  |
| `--glint-gradient` | ✅ | 1 |  |
| `--glint-speed` | ✅ | 1 |  |
| `--glint-gradient-strong` | ✅ | — |  🗑️ |
| `--glint-gradient-subtle` | ✅ | — |  🗑️ |
| `--transition-extralong` | ✅ | — |  🗑️ |

### Typography (46 tokens, 38 defined, 40 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--text-sm` | ✅ | 204 |  |
| `--text-xs` | ✅ | 202 |  |
| `--text-base` | ✅ | 120 |  |
| `--font-body` | ✅ | 100 |  |
| `--font-bold` | ✅ | 96 |  |
| `--text-lg` | ✅ | 95 |  |
| `--font-semibold` | ✅ | 92 |  |
| `--font-heading` | ✅ | 90 |  |
| `--text-xl` | ✅ | 71 |  |
| `--leading-relaxed` | ✅ | 60 |  |
| `--text-2xl` | ✅ | 53 |  |
| `--text-3xl` | ✅ | 46 |  |
| `--font-medium` | ✅ | 33 |  |
| `--text-4xl` | ✅ | 31 |  |
| `--leading-tight` | ✅ | 19 |  |
| `--text-5xl` | ✅ | 16 |  |
| `--font-size-lg` | ✅ | 11 |  |
| `--font-weight-bold` | ❌ | 9 |  → `--font-bold` |
| `--leading-normal` | ✅ | 9 |  |
| `--font-size-sm` | ✅ | 8 |  |
| `--font-size-base` | ✅ | 7 |  |
| `--text-6xl` | ✅ | 7 |  |
| `--leading-snug` | ✅ | 6 |  |
| `--font-extrabold` | ✅ | 5 |  |
| `--font-normal` | ✅ | 5 |  |
| `--letter-spacing-wide` | ✅ | 5 |  |
| `--text-2xs` | ❌ | 5 |  ⚠️ UNDEFINED |
| `--font-size-xs` | ✅ | 4 |  |
| `--text-7xl` | ✅ | 4 |  |
| `--font-weight-medium` | ❌ | 3 |  → `--font-medium` |
| `--text-md` | ❌ | 3 |  ⚠️ UNDEFINED |
| `--font-light` | ✅ | 2 |  |
| `--letter-spacing-normal` | ✅ | 2 |  |
| `--font-extra-bold` | ❌ | 1 |  → `--font-extrabold` |
| `--font-mono` | ✅ | 1 |  |
| `--font-regular` | ❌ | 1 |  → `--font-normal` |
| `--font-size-2xl` | ✅ | 1 |  |
| `--font-size-xl` | ✅ | 1 |  |
| `--font-weight-semibold` | ❌ | 1 |  → `--font-semibold` |
| `--leading-none` | ❌ | 1 |  ⚠️ UNDEFINED |
| `--font-secondary` | ✅ | — |  🗑️ |
| `--font-size-3xl` | ✅ | — |  🗑️ |
| `--font-special` | ✅ | — |  🗑️ |
| `--leading-loose` | ✅ | — |  🗑️ |
| `--letter-spacing-tight` | ✅ | — |  🗑️ |
| `--letter-spacing-wider` | ✅ | — |  🗑️ |

### Z-Index (8 tokens, 8 defined, 4 used)

| Token | Defined | Used | References |
|-------|---------|------|------------|
| `--z-modal` | ✅ | 4 |  |
| `--z-sticky` | ✅ | 3 |  |
| `--z-base` | ✅ | 2 |  |
| `--z-dropdown` | ✅ | 1 |  |
| `--z-fixed` | ✅ | — |  🗑️ |
| `--z-modal-backdrop` | ✅ | — |  🗑️ |
| `--z-popover` | ✅ | — |  🗑️ |
| `--z-tooltip` | ✅ | — |  🗑️ |

---

## 6. Most Used Tokens (Top 50)

| Token | References | Defined |
|-------|------------|---------|
| `--space-md` | 479 | ✅ |
| `--space-sm` | 449 | ✅ |
| `--space-xs` | 387 | ✅ |
| `--brand-c-text` | 358 | ✅ |
| `--brand-c-primary` | 346 | ✅ |
| `--space-lg` | 339 | ✅ |
| `--brand-c-primary-dark` | 250 | ✅ |
| `--brand-c-bg` | 248 | ✅ |
| `--space-xl` | 240 | ✅ |
| `--color-White` | 216 | ✅ |
| `--text-sm` | 204 | ✅ |
| `--text-xs` | 202 | ✅ |
| `--space-2xl` | 147 | ✅ |
| `--brand-c-text-light` | 129 | ✅ |
| `--text-base` | 120 | ✅ |
| `--brand-c-secondary` | 115 | ✅ |
| `--brand-c-neutral-light` | 110 | ✅ |
| `--font-body` | 100 | ✅ |
| `--font-bold` | 96 | ✅ |
| `--text-lg` | 95 | ✅ |
| `--color-Black` | 93 | ✅ |
| `--font-semibold` | 92 | ✅ |
| `--font-heading` | 90 | ✅ |
| `--transition-fast` | 88 | ✅ |
| `--radius-lg` | 85 | ✅ |
| `--brand-c-text-dark` | 81 | ✅ |
| `--space-3xl` | 79 | ✅ |
| `--brand-c-primary-light` | 75 | ✅ |
| `--text-xl` | 71 | ✅ |
| `--leading-relaxed` | 60 | ✅ |
| `--brand-c-bg-light` | 56 | ✅ |
| `--transition-base` | 56 | ✅ |
| `--text-2xl` | 53 | ✅ |
| `--space-4xl` | 48 | ✅ |
| `--brand-c-neutral-dark` | 48 | ✅ |
| `--text-3xl` | 46 | ✅ |
| `--radius-full` | 42 | ✅ |
| `--brand-c-neutral` | 42 | ✅ |
| `--border-radius-md` | 41 | ✅ |
| `--shadow-md` | 41 | ✅ |
| `--radius-md` | 38 | ✅ |
| `--brand-c-bg-dark` | 37 | ✅ |
| `--font-medium` | 33 | ✅ |
| `--text-4xl` | 31 | ✅ |
| `--border-width` | 28 | ✅ |
| `--radius-sm` | 26 | ✅ |
| `--color-Success` | 25 | ✅ |
| `--shadow-xl` | 25 | ✅ |
| `--brand-c-secondary-dark` | 25 | ✅ |
| `--shadow-sm` | 21 | ✅ |