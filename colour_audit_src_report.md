# CSS Colour Audit Report — SOURCE ONLY

**Project:** `C:\Users\Business\Website v2.36\src`
**Source files scanned:** 264
**Files excluded (docs/reports/md):** 0
**Files with findings:** 172

## Executive Summary

| Category | Count | Status |
|----------|-------|--------|
| Old scale tokens (code) | 0 | ✅ |
| Old scale tokens (comments) | 0 | ✅ |
| Old accent refs (code) | 0 | ✅ |
| Old accent refs (comments) | 0 | ✅ |
| Old a11y tokens (code) | 0 | ✅ |
| Old a11y tokens (comments) | 0 | ✅ |
| Old gradient tokens | 0 | ✅ |
| Generator refs (excluded) | 0 | ⚪ INFO |
| Hardcoded colours | 96 | 🟠 REVIEW |
| Inline colour styles | 10 | 🟠 REVIEW |
| Defined, never used | 75 | 🟡 TIDY |
| Used, never defined | 138 | 🟡 CHECK |
| Unique tokens defined | 163 | ⚪ INFO |
| Token var() references | 6890 | ⚪ INFO |

---

# Part 1: Migration Issues

✅ **No migration issues in source code.**

## M1. Old Scale Tokens

✅ None in code.

## M2. Old Accent References

✅ None in code.

## M3. Old A11Y Tokens

✅ None in code.

## M4. Old Gradient Tokens

✅ None.

---

# Part 2: Hardcoded Colours

**96 hardcoded values** across 17 files, 54 unique.

| Type | Count |
|------|-------|
| hex | 54 |
| rgb | 19 |
| named | 12 |
| color_mix | 9 |
| oklch | 2 |

## Most Frequent

| Colour | Times | Files | Action |
|--------|-------|-------|--------|
| `white` | 8 | 4 | Create token |
| `#5d4f3a` | 4 | 1 | Consider token |
| `#4a4a4a` | 4 | 1 | Consider token |
| `color-mix(in oklch, currentcolor 15%, transparent)` | 4 | 1 | Consider token |
| `black` | 3 | 2 | Consider token |
| `#8fa68a` | 3 | 3 | -> `var(--brand-c-primary)` |
| `#ffffff` | 3 | 3 | -> `var(--brand-c-bg-light)` |
| `oklch(0.45 0.08 var(--topic-hue)` | 2 | 2 | Review |
| `#f9f8f6` | 2 | 2 | Review |
| `#474747` | 2 | 2 | -> `var(--brand-c-text)` |
| `#6b7280` | 2 | 2 | Review |
| `#7a9175` | 2 | 2 | Review |
| `#c4907c` | 2 | 2 | -> `var(--brand-c-secondary)` |
| `#e8e6e3` | 2 | 2 | Review |
| `#f0ebe6` | 2 | 2 | Review |
| `rgba(0,0,0,0.06)` | 2 | 2 | Review |
| `rgba(255,255,255,0.85)` | 2 | 2 | Review |
| `rgba(143,166,138,0.1)` | 2 | 2 | Review |
| `rgba(196,144,124,0.1)` | 2 | 2 | Review |
| `#ff99c8` | 2 | 1 | Review |
| `#ae88bf` | 2 | 1 | Review |
| `#80e1cc` | 2 | 1 | Review |
| `#e9bc88` | 2 | 1 | Review |
| `#ddd` | 2 | 1 | Review |
| `#fef2f2` | 2 | 1 | Review |
| `#f0fdfa` | 2 | 1 | Review |
| `rgba(var(--brand-c-primary-rgb, 99, 102, 241)` | 2 | 1 | Review |
| `color-mix(in oklch, white 80%, transparent)` | 1 | 1 | Review |
| `color-mix(in oklch, black 10%, transparent)` | 1 | 1 | Review |
| `color-mix(in oklch, black 5%, transparent)` | 1 | 1 | Review |
| `#8b6b5a` | 1 | 1 | Review |
| `#7a5c4d` | 1 | 1 | Review |
| `rgba(0,0,0,0.1)` | 1 | 1 | Review |
| `rgba(196,144,124,0.15)` | 1 | 1 | Review |
| `rgba(196,144,124,0.08)` | 1 | 1 | Review |
| `rgba(196,144,124,0.3)` | 1 | 1 | Review |
| `rgba(255, 255, 255, 0.5)` | 1 | 1 | Review |
| `rgb(248, 245, 242)` | 1 | 1 | Review |
| `#666` | 1 | 1 | Review |
| `#f5f5f5` | 1 | 1 | Review |
| `red` | 1 | 1 | Review |
| `#aaaaaa` | 1 | 1 | Review |
| `#555555` | 1 | 1 | Review |
| `#cccccc` | 1 | 1 | Review |
| `#7a6b54` | 1 | 1 | Review |
| `#fecaca` | 1 | 1 | Review |
| `#99f6e4` | 1 | 1 | Review |
| `#fffbeb` | 1 | 1 | Review |
| `#fde68a` | 1 | 1 | Review |
| `rgba(250, 248, 244, 0.9)` | 1 | 1 | Review |

## Worst Offender Files

| File | Count | Types |
|------|-------|-------|
| `lib\emailit.ts` | 23 | hex, named, rgb |
| `pages\api\contact.ts` | 15 | hex, named, rgb |
| `lib\animation\particle-burst.ts` | 10 | hex, rgb |
| `styles\a11y\pages\asset-detail.css` | 10 | hex |
| `styles\components\presentation\ReaderNav.css` | 10 | color_mix, rgb |
| `styles\base\utilities.css` | 8 | hex |
| `components\Sections\ShareSection.astro` | 6 | color_mix, named |
| `styles\a11y\base\print.css` | 5 | hex, named |
| `components\Badge\Badge.astro` | 1 | oklch |
| `components\ContactForm\Contact-Popup.astro` | 1 | named |
| `lib\animation\scroll-color-background.ts` | 1 | rgb |
| `scripts\ThemeSwitcher.js` | 1 | hex |
| `styles\a11y\base\screen-reader.css` | 1 | named |
| `styles\a11y\components\masonry-grid.css` | 1 | hex |
| `styles\a11y\components\search-overlay.css` | 1 | hex |
| `styles\components\philosophy-flip-cards.css` | 1 | rgb |
| `styles\components\search-results.css` | 1 | oklch |

## Top 15 — Detailed Locations

### `white` (8)

- `components\Sections\ShareSection.astro` L143: `background: color-mix(in oklch, white 80%, transparent);`
- `lib\emailit.ts` L135: `background: ${BRAND_COLORS.white};`
- `lib\emailit.ts` L151: `color: ${BRAND_COLORS.white};`
- `lib\emailit.ts` L193: `color: ${BRAND_COLORS.white} !important;`
- `lib\emailit.ts` L214: `background: ${BRAND_COLORS.white};`
- `pages\api\contact.ts` L52: `background: ${BRAND_COLORS.white};`
- `pages\api\contact.ts` L65: `color: ${BRAND_COLORS.white};`
- `styles\a11y\base\print.css` L48: `background: white !important;`

### `#5d4f3a` (4)

- `styles\a11y\pages\asset-detail.css` L51: `color: #5d4f3a !important;`
- `styles\a11y\pages\asset-detail.css` L174: `color: #5d4f3a !important;`
- `styles\a11y\pages\asset-detail.css` L190: `color: #5d4f3a !important;`
- `styles\a11y\pages\asset-detail.css` L431: `color: #5d4f3a !important;`

### `#4a4a4a` (4)

- `styles\a11y\pages\asset-detail.css` L76: `color: #4a4a4a !important;`
- `styles\a11y\pages\asset-detail.css` L215: `color: #4a4a4a !important;`
- `styles\a11y\pages\asset-detail.css` L235: `color: #4a4a4a !important;`
- `styles\a11y\pages\asset-detail.css` L453: `color: #4a4a4a !important;`

### `color-mix(in oklch, currentcolor 15%, transparent)` (4)

- `styles\components\presentation\ReaderNav.css` L289: `background: color-mix(in oklch, currentColor 15%, transparent);`
- `styles\components\presentation\ReaderNav.css` L547: `background-color: color-mix(in oklch, currentColor 15%, transparent);`
- `styles\components\presentation\ReaderNav.css` L703: `border-top: 1px solid color-mix(in oklch, currentColor 15%, transparent);`
- `styles\components\presentation\ReaderNav.css` L704: `border-bottom: 1px solid color-mix(in oklch, currentColor 15%, transparent);`

### `black` (3)

- `components\ContactForm\Contact-Popup.astro` L359: `background: linear-gradient(135deg, var(--color-Success) 0%, color-mix(in oklch, var(--color-Success`
- `components\Sections\ShareSection.astro` L146: `box-shadow: 0 6px 20px color-mix(in oklch, black 10%, transparent);`
- `components\Sections\ShareSection.astro` L150: `box-shadow: 0 2px 8px color-mix(in oklch, black 5%, transparent);`

### `#8fa68a` (3)

- `lib\emailit.ts` L80: `primary: '#8fa68a',      // Sage green`
- `pages\api\contact.ts` L13: `primary: '#8fa68a',`
- `scripts\ThemeSwitcher.js` L201: `'#8FA68A';`

### `#ffffff` (3)

- `lib\emailit.ts` L83: `white: '#ffffff',`
- `lib\animation\particle-burst.ts` L22: `const COLOR_WHITE = getComputedStyle(document.documentElement).getPropertyValue('--color-White').tri`
- `pages\api\contact.ts` L16: `white: '#ffffff',`

### `oklch(0.45 0.08 var(--topic-hue)` (2)

- `components\Badge\Badge.astro` L296: `background-color: oklch(0.45 0.08 var(--topic-hue));`
- `styles\components\search-results.css` L34: `color: oklch(0.45 0.08 var(--topic-hue));`

### `#f9f8f6` (2)

- `lib\emailit.ts` L77: `background: '#f9f8f6',`
- `pages\api\contact.ts` L10: `background: '#f9f8f6',`

### `#474747` (2)

- `lib\emailit.ts` L78: `text: '#474747',`
- `pages\api\contact.ts` L11: `text: '#474747',`

### `#6b7280` (2)

- `lib\emailit.ts` L79: `textLight: '#6b7280',`
- `pages\api\contact.ts` L12: `textLight: '#6b7280',`

### `#7a9175` (2)

- `lib\emailit.ts` L81: `primaryDark: '#7a9175',`
- `pages\api\contact.ts` L14: `primaryDark: '#7a9175',`

### `#c4907c` (2)

- `lib\emailit.ts` L82: `accent: '#c4907c',       // Terracotta`
- `pages\api\contact.ts` L15: `accent: '#c4907c',`

### `#e8e6e3` (2)

- `lib\emailit.ts` L84: `border: '#e8e6e3',`
- `pages\api\contact.ts` L17: `border: '#e8e6e3',`

### `#f0ebe6` (2)

- `lib\emailit.ts` L85: `highlight: '#f0ebe6'`
- `pages\api\contact.ts` L18: `highlight: '#f0ebe6'`

---

# Part 3: Token Health

## Inline Colour Styles (10)

- `components\Canvas\RevealCanvas.astro` L206: `var(--color-Black)`
- `lib\emailit.ts` L398: `font-size: 13px; color: ${BRAND_COLORS.textLight};`
- `lib\emailit.ts` L399: `word-break: break-all; font-size: 13px; color: ${BRAND_COLORS.textLight}; background: ${BRAND_COLORS`
- `lib\emailit.ts` L445: `color: ${BRAND_COLORS.textLight};`
- `lib\emailit.ts` L487: `color: ${BRAND_COLORS.textLight};`
- `lib\emailit.ts` L534: `color: ${BRAND_COLORS.textLight};`
- `pages\api\contact.ts` L317: `font-size: 13px; color: ${BRAND_COLORS.textLight}; margin-bottom: 8px;`
- `pages\api\contact.ts` L321: `color: ${BRAND_COLORS.primary};`
- `pages\api\contact.ts` L321: `color: ${BRAND_COLORS.primary};`
- `pages\api\contact.ts` L322: `color: ${BRAND_COLORS.textLight};`

## Defined But Never Used (75)

| Token | Value | File | Line |
|-------|-------|------|------|
| `--a11y-hc-border` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-high-contrast.css` | 26 |
| `--border-width-4` | `4px` | `styles\tokens\spacing.css` | 48 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-cream.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-dark.css` | 34 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-deuteranopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-high-contrast.css` | 32 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-monochrome.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-protanopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-tritanopia.css` | 27 |
| `--btn-ghost-text` | `var(--brand-c-primary)` | `styles\themes\brand\BrandDefault.css` | 48 |
| `--btn-icon-color` | `${iconColor` | `components\Button\Button.astro` | 81 |
| `--btn-icon-hover` | `${iconHoverColor` | `components\Button\Button.astro` | 82 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-cream.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-dark.css` | 33 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-deuteranopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-high-contrast.css` | 31 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-monochrome.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-protanopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `styles\themes\a11y\a11y-tritanopia.css` | 26 |
| `--btn-outline-text` | `var(--brand-c-primary)` | `styles\themes\brand\BrandDefault.css` | 47 |
| `--btn-text-hover` | `${textHoverColor` | `components\Button\Button.astro` | 80 |
| `--confetti-count` | `60` | `styles\design\confetti.css` | 28 |
| `--confetti-duration-max` | `3000ms` | `styles\design\confetti.css` | 26 |
| `--confetti-duration-min` | `1500ms` | `styles\design\confetti.css` | 25 |
| `--confetti-size-max` | `40px` | `styles\design\confetti.css` | 30 |
| `--confetti-size-min` | `4px` | `styles\design\confetti.css` | 29 |
| `--confetti-spread` | `150px` | `styles\design\confetti.css` | 27 |
| `--dropdown-hover-bg` | `var(--brand-c-primary-light)` | `styles\buttons\dropdown-tokens.css` | 9 |
| `--dropdown-hover-text` | `var(--brand-c-primary-dark)` | `styles\buttons\dropdown-tokens.css` | 10 |
| `--font-secondary` | `'Quicksand', -apple-system, BlinkMacSystemFont, 'S` | `styles\tokens\typography.css` | 14 |
| `--glass-card-bg` | `color-mix(in oklch, var(--brand-c-bg) 15%, transpa` | `styles\tokens\shadows.css` | 96 |
| `--glass-card-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 25%, tr` | `styles\tokens\shadows.css` | 107 |
| `--glass-card-border` | `color-mix(in oklch, var(--brand-c-bg) 18%, transpa` | `styles\tokens\shadows.css` | 99 |
| `--glass-card-border` | `color-mix(in oklch, var(--brand-c-bg) 10%, transpa` | `styles\tokens\shadows.css` | 108 |
| `--glass-card-shadow` | `0 8px 24px 0 color-mix(in oklch, var(--brand-c-pri` | `styles\tokens\shadows.css` | 98 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--brand-c-bg) 5%, transpar` | `styles\tokens\shadows.css` | 91 |
| `--glass-overlay-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 10%, tr` | `styles\tokens\shadows.css` | 106 |
| `--glass-overlay-shadow` | `0 4px 16px 0 color-mix(in oklch, var(--brand-c-pri` | `styles\tokens\shadows.css` | 93 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--brand-c-bg) 10%, transpa` | `styles\tokens\shadows.css` | 86 |
| `--glass-surface-bg` | `color-mix(in oklch, var(--brand-c-bg-dark) 20%, tr` | `styles\tokens\shadows.css` | 105 |
| `--glass-surface-blur` | `12px` | `styles\tokens\shadows.css` | 87 |
| `--glass-surface-shadow` | `0 8px 32px 0 color-mix(in oklch, var(--brand-c-pri` | `styles\tokens\shadows.css` | 88 |
| `--glint-gradient-strong` | `linear-gradient(90deg, transparent, rgba(255, 255,` | `styles\tokens\shadows.css` | 74 |
| `--glint-gradient-subtle` | `linear-gradient(90deg, transparent, rgba(255, 255,` | `styles\tokens\shadows.css` | 75 |
| `--gradient-btn-ghost` | `linear-gradient(135deg, transparent 0%, color-mix(` | `styles\tokens\gradients.css` | 49 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `styles\themes\a11y\a11y-cream.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `styles\themes\a11y\a11y-dark.css` | 31 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `styles\themes\a11y\a11y-deuteranopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `styles\themes\a11y\a11y-high-contrast.css` | 29 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `styles\themes\a11y\a11y-monochrome.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `styles\themes\a11y\a11y-protanopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `styles\themes\a11y\a11y-tritanopia.css` | 24 |
| `--hero-overlay-color` | `var(--brand-c-bg)` | `styles\themes\brand\BrandDefault.css` | 45 |
| `--link` | `hover {` | `styles\components\announcement-ticker.css` | 88 |
| `--link` | `hover {` | `styles\components\announcement-ticker.css` | 121 |
| `--pause-hover` | `hover {` | `styles\components\announcement-ticker.css` | 117 |
| `--primary` | `hover {` | `components\Presentation\Sections\TitleSection.astro` | 254 |
| `--primary` | `hover .title-section__btn-icon {` | `components\Presentation\Sections\TitleSection.astro` | 276 |
| `--secondary` | `hover {` | `components\Presentation\Sections\TitleSection.astro` | 150 |
| `--secondary` | `hover {` | `components\Presentation\Sections\TitleSection.astro` | 265 |
| `--shadow-base` | `none` | `styles\themes\a11y\a11y-dark.css` | 45 |
| `--shadow-base` | `var(--shadow)` | `styles\tokens\shadows.css` | 11 |
| `--shadow-dropdown` | `4px 4px 6px color-mix(in oklch, var(--brand-c-bg-d` | `styles\tokens\shadows.css` | 58 |
| `--shadow-dropdown-lg` | `0 8px 16px color-mix(in oklch, var(--brand-c-bg-da` | `styles\tokens\shadows.css` | 61 |
| `--shadow-dropdown-sm` | `0 2px 4px color-mix(in oklch, var(--brand-c-bg-dar` | `styles\tokens\shadows.css` | 59 |
| `--shadow-dropdown-soft` | `4px 4px 6px color-mix(in oklch, var(--brand-c-bg-d` | `styles\tokens\shadows.css` | 62 |
| `--shadow-glow-primary` | `0 0 14px color-mix(in oklch, var(--brand-c-primary` | `styles\themes\a11y\a11y-dark.css` | 52 |
| `--shadow-glow-primary` | `0 0 12px color-mix(in oklch, var(--brand-c-primary` | `styles\tokens\shadows.css` | 69 |
| `--shadow-glow-secondary` | `0 0 14px color-mix(in oklch, var(--brand-c-seconda` | `styles\themes\a11y\a11y-dark.css` | 53 |
| `--shadow-glow-secondary` | `0 0 12px color-mix(in oklch, var(--brand-c-seconda` | `styles\tokens\shadows.css` | 70 |
| `--shadow-inner-2xl` | `inset 0 0 40px 16px` | `styles\tokens\shadows.css` | 31 |
| `--shadow-inner-md` | `inset 0 0 10px 4px` | `styles\tokens\shadows.css` | 22 |
| `--shadow-inner-xl` | `inset 0 0 30px 12px` | `styles\tokens\shadows.css` | 28 |
| `--shadow-xs` | `none` | `styles\themes\a11y\a11y-dark.css` | 42 |
| `--shadow-xs` | `0 1px 2px 0 color-mix(in oklch, var(--brand-c-bg-d` | `styles\tokens\shadows.css` | 8 |

## Used But Never Defined (138)

| Token | Uses | Examples |
|-------|------|----------|
| `--space-md` | 479 | components\A11y Panel\FontCard.astro L43; components\A11y Panel\FontCard.astro L86; components\A11y Panel\NavigationSection.astro L45 |
| `--space-sm` | 449 | components\A11y Panel\FontCard.astro L86; components\A11y Panel\NavigationSection.astro L65; components\A11y Panel\PresetButton.astro L102 |
| `--space-xs` | 387 | components\A11y Panel\PresetButton.astro L103; components\A11y Panel\PresetButton.astro L129; components\A11y Panel\PresetButton.astro L155 |
| `--space-lg` | 339 | components\A11y Panel\FontCard.astro L43; components\A11y Panel\PresetButton.astro L44; components\A11y Panel\PresetButton.astro L46 |
| `--space-xl` | 240 | components\Cards\OfferingCard.astro L135; components\Cards\OfferingCard.astro L143; components\Cards\ProjectCard.astro L155 |
| `--space-2xl` | 147 | components\Cards\ProjectCard.astro L206; components\Cards\StepCard.astro L34; components\ContactForm\Contact-Popup.astro L342 |
| `--font-body` | 100 | components\Button\ButtonDropdown.astro L127; components\Cards\OfferingCard.astro L132; components\Cards\OfferingCard.astro L163 |
| `--font-bold` | 96 | components\Button\ButtonDropdown.astro L189; components\Cards\CompactToolCard.astro L85; components\Cards\InsightCard.astro L140 |
| `--font-semibold` | 92 | components\Badge\Badge.astro L158; components\Button\ButtonDropdown.astro L184; components\Cards\CompactToolCard.astro L77 |
| `--font-heading` | 90 | components\Cards\InsightCard.astro L143; components\Cards\OfferingCard.astro L124; components\Cards\OfferingCard.astro L147 |
| `--transition-fast` | 88 | components\A11y Panel\FontCard.astro L48; components\A11y Panel\PresetButton.astro L51; components\A11y Panel\PresetButton.astro L75 |
| `--radius-lg` | 85 | components\A11y Panel\FontCard.astro L46; components\A11y Panel\PresetButton.astro L49; components\A11y Panel\Stepper.astro L87 |
| `--space-3xl` | 79 | components\Cards\OfferingCard.astro L104; components\Cards\ProjectCard.astro L78; components\Cards\ProjectCard.astro L171 |
| `--leading-relaxed` | 60 | components\Cards\InsightCard.astro L150; components\Cards\OfferingCard.astro L136; components\Cards\ProductCard.astro L197 |
| `--transition-base` | 56 | components\Button\ButtonDropdown.astro L102; components\Cards\CompactToolCard.astro L37; components\Cards\CompactToolCard.astro L108 |
| `--space-4xl` | 48 | components\Cards\OfferingCard.astro L106; components\Cards\OfferingCard.astro L185; components\ContactForm\Contact-Popup.astro L356 |
| `--radius-full` | 42 | components\A11y Panel\Slider.astro L101; components\A11y Panel\Slider.astro L113; components\A11y Panel\Slider.astro L128 |
| `--radius-md` | 38 | components\A11y Panel\Stepper.astro L124; components\Button\ButtonDropdown.astro L89; components\ContactForm\Contact-Popup.astro L309 |
| `--font-medium` | 33 | components\Button\ButtonDropdown.astro L129; components\Cards\ProjectSpecCard.astro L67; components\Cards\SpecCard.astro L71 |
| `--radius-sm` | 26 | components\A11y Panel\ToggleCard.astro L136; components\Badge\Badge.astro L174; components\Badge\Badge.astro L178 |
| `--leading-tight` | 19 | components\Presentation\AuthorCard.astro L102; components\Presentation\Sections\FullWidthSection.astro L86; components\Presentation\Sections\HeroSection.astro L112 |
| `--nav-height` | 18 | pages\search.astro L195; pages\search.astro L196; pages\search.astro L486 |
| `--space-2xs` | 15 | components\A11y Panel\PresetButton.astro L130; components\A11y Panel\PresetButton.astro L167; components\A11y Panel\PresetsSidebar.astro L133 |
| `--radius-xl` | 12 | components\ContactForm\Contact-Popup.astro L154; components\Grids\RelatedGrid.astro L454; components\Grids\RelatedGrid.astro L471 |
| `--font-size-lg` | 11 | components\A11y Panel\FontCard.astro L71; components\A11y Panel\NavigationSection.astro L53; components\A11y Panel\PresetButton.astro L87 |
| `--font-weight-bold` | 9 | components\A11y Panel\FontCard.astro L72; components\A11y Panel\NavigationSection.astro L54; components\A11y Panel\PresetButton.astro L85 |
| `--leading-normal` | 9 | components\Cards\OfferingCard.astro L168; components\Cards\SpecCard.astro L72; components\Presentation\Sections\StatsSection.astro L89 |
| `--img-height-lg` | 9 | components\Cards\ProjectCard.astro L96; styles\global.css L378; styles\global.css L387 |
| `--container-default` | 9 | styles\a11y\visual\text-only.css L470; styles\a11y\visual\text-only.css L512; styles\a11y\visual\text-only.css L658 |
| `--font-size-sm` | 8 | components\A11y Panel\PresetButton.astro L117; components\A11y Panel\Slider.astro L93; components\A11y Panel\Slider.astro L149 |
| `--img-width-lg` | 8 | styles\global.css L369; styles\global.css L387; styles\global.css L395 |
| `--img-width-xl` | 8 | styles\global.css L370; styles\global.css L388; styles\global.css L396 |
| `--img-height-xl` | 8 | styles\global.css L379; styles\global.css L388; styles\global.css L394 |
| `--page-margin` | 8 | styles\a11y\visual\text-only.css L514; styles\a11y\visual\text-only.css L515; styles\a11y\visual\text-only.css L660 |
| `--font-size-base` | 7 | components\A11y Panel\FontCard.astro L90; components\A11y Panel\NavigationSection.astro L71; components\A11y Panel\PresetButton.astro L93 |
| `--leading-snug` | 6 | components\Presentation\Sections\EndSection.astro L340; styles\global.css L148; styles\global.css L157 |
| `--img-width-sm` | 6 | styles\global.css L367; styles\global.css L385; styles\global.css L393 |
| `--img-width-md` | 6 | styles\global.css L368; styles\global.css L386; styles\global.css L394 |
| `--img-width-2xl` | 6 | styles\global.css L371; styles\global.css L389; styles\global.css L401 |
| `--img-width-3xl` | 6 | styles\global.css L372; styles\global.css L390; styles\global.css L402 |
| `--img-height-sm` | 6 | styles\global.css L376; styles\global.css L385; styles\global.css L399 |
| `--img-height-md` | 6 | styles\global.css L377; styles\global.css L386; styles\global.css L400 |
| `--img-height-2xl` | 6 | styles\global.css L380; styles\global.css L389; styles\global.css L395 |
| `--img-height-3xl` | 6 | styles\global.css L381; styles\global.css L390; styles\global.css L396 |
| `--glass-blur` | 5 | components\Button\ButtonDropdown.astro L87; components\Button\ButtonDropdown.astro L88; styles\base\utilities.css L215 |
| `--letter-spacing-wide` | 5 | components\Button\ButtonDropdown.astro L141; components\Presentation\Sections\CompareSection.astro L71; styles\global.css L91 |
| `--space-5xl` | 5 | components\Cards\ProjectCard.astro L70; styles\components\hero-section.css L298; styles\components\hero-section.css L329 |
| `--text-2xs` | 5 | components\ContactForm\Contact-Popup.astro L539; components\ContactForm\Contact-Popup.astro L670; components\ContactForm\Contact-Popup.astro L709 |
| `--font-extrabold` | 5 | components\Footer\Footer.astro L195; components\Presentation\Sections\HeroSection.astro L110; components\Presentation\Sections\TitleSection.astro L212 |
| `--font-normal` | 5 | components\Presentation\Sections\FullWidthSection.astro L93; components\Presentation\Sections\ImageTextSection.astro L92; components\Presentation\Sections\TextSection.astro L68 |
| `--font-size-xs` | 4 | components\A11y Panel\PresetButton.astro L121; components\A11y Panel\PresetButton.astro L144; components\A11y Panel\ToggleCard.astro L163 |
| `--container-sm` | 4 | components\Button\ButtonDropdown.astro L106; components\Button\ButtonDropdown.astro L210; components\ContactForm\Contact-Popup.astro L352 |
| `--z-modal` | 4 | components\Button\ButtonDropdown.astro L207; components\ContactForm\Contact-Popup.astro L139; styles\components\cookie-banner.css L15 |
| `--body-top-padding` | 4 | components\Presentation\Sections\TitleSection.astro L94; styles\global.css L72; styles\components\hero-section.css L74 |
| `--img-width-xs` | 4 | styles\global.css L366; styles\global.css L384; styles\tokens\images.css L87 |
| `--img-height-xs` | 4 | styles\global.css L375; styles\global.css L384; styles\tokens\images.css L96 |
| `--media-brightness` | 4 | styles\a11y\base\media-filters.css L25; styles\a11y\base\theme-overrides.css L232; styles\a11y\base\theme-overrides.css L465 |
| `--media-saturation` | 4 | styles\a11y\base\media-filters.css L26; styles\a11y\base\theme-overrides.css L233; styles\a11y\base\theme-overrides.css L466 |
| `--media-contrast` | 4 | styles\a11y\base\media-filters.css L27; styles\a11y\base\theme-overrides.css L234; styles\a11y\base\theme-overrides.css L467 |
| `--tracking-wide` | 4 | styles\components\masonry-card.css L36; styles\components\masonry-card.css L46; styles\components\masonry-card.css L59 |
| `--opacity-high` | 4 | styles\components\masonry-card.css L69; styles\components\masonry-card.css L119; styles\components\masonry-card.css L131 |
| `--space-3xs` | 3 | components\A11y Panel\PresetButton.astro L81; components\A11y Panel\PresetButton.astro L168; components\A11y Panel\ToggleCard.astro L109 |
| `--font-weight-medium` | 3 | components\A11y Panel\Slider.astro L88; components\A11y Panel\Slider.astro L95; components\A11y Panel\Toggle.astro L59 |
| `--topic-hue` | 3 | components\Badge\Badge.astro L295; components\Badge\Badge.astro L296; styles\components\search-results.css L34 |
| `--container-md` | 3 | components\Button\ButtonDropdown.astro L201; components\Button\ButtonDropdown.astro L214; styles\base\utilities.css L28 |
| `--text-md` | 3 | components\Cards\ProductCard.astro L216; components\Cards\ProjectCard.astro L136; components\Cards\SpecCard.astro L62 |
| `--radius-xs` | 3 | components\ContactForm\Contact-Popup.astro L636; styles\components\image-text-section.css L183; styles\components\who-slider.css L414 |
| `--space-7xl` | 3 | styles\global.css L311; styles\a11y\visual\text-only.css L493; styles\a11y\visual\text-only.css L494 |
| `--img-radius` | 3 | styles\global.css L331; styles\global.css L361; styles\tokens\images.css L82 |
| `--container-7xl` | 3 | styles\base\utilities.css L36; styles\components\nav\GlassNav-expandable.css L18; styles\tokens\spacing.css L36 |
| `--container-full` | 3 | styles\base\utilities.css L37; styles\components\cookie-banner.css L37; styles\components\cookie-banner.css L68 |
| `--z-sticky` | 3 | styles\components\announcement-ticker.css L16; styles\components\nav\GlassNav-base.css L12; styles\components\presentation\ReaderNav.css L14 |
| `--container-xs` | 2 | components\Button\ButtonDropdown.astro L92; styles\base\utilities.css L26 |
| `--letter-spacing-normal` | 2 | components\Button\ButtonDropdown.astro L147; styles\components\hero-morph.css L214 |
| `--transition-slow` | 2 | components\ContactForm\Contact-Popup.astro L163; styles\base\utilities.css L225 |
| `--container-2xl` | 2 | pages\search.astro L241; styles\base\utilities.css L31 |
| `--container-6xl` | 2 | pages\showcase\section-titles.astro L373; styles\base\utilities.css L35 |
| `--img-radius-sm` | 2 | styles\global.css L360; styles\tokens\images.css L81 |
| `--img-radius-lg` | 2 | styles\global.css L362; styles\tokens\images.css L83 |
| `--img-radius-full` | 2 | styles\global.css L363; styles\tokens\images.css L84 |
| `--img-filter-grayscale` | 2 | styles\global.css L411; styles\tokens\images.css L132 |
| `--img-filter-sepia` | 2 | styles\global.css L412; styles\tokens\images.css L133 |
| `--img-filter-brightness` | 2 | styles\global.css L413; styles\tokens\images.css L134 |
| `--img-filter-contrast` | 2 | styles\global.css L414; styles\tokens\images.css L135 |
| `--img-filter-saturate` | 2 | styles\global.css L415; styles\tokens\images.css L136 |
| `--img-filter-blur` | 2 | styles\global.css L416; styles\tokens\images.css L137 |
| `--svg-size-sm` | 2 | styles\global.css L435; styles\global.css L435 |
| `--svg-size-md` | 2 | styles\global.css L436; styles\global.css L436 |
| `--svg-size-lg` | 2 | styles\global.css L437; styles\global.css L437 |
| `--svg-size-xl` | 2 | styles\global.css L438; styles\global.css L438 |
| `--font-light` | 2 | styles\base\utilities.css L133; styles\components\nav\GlassNav-mobile.css L245 |
| `--z-base` | 2 | styles\components\footer-mask.css L26; styles\components\footer-mask.css L32 |
| `--tracking-normal` | 2 | styles\components\masonry-card.css L78; styles\components\masonry-card.css L179 |
| `--nav-top-offset` | 2 | styles\components\nav\GlassNav-base.css L9; styles\components\nav\GlassNav-mobile.css L37 |
| `--brand-c-primary-rgb` | 2 | styles\components\presentation\ReaderNav.css L873; styles\components\presentation\ReaderNav.css L874 |
| `--btn-gradient-glow` | 2 | styles\design\GlowTokens.css L13; styles\design\GlowTokens.css L24 |
| `--page-margin-compact` | 2 | styles\responsive\phone.css L14; styles\responsive\xs.css L13 |
| `--page-margin-comfortable` | 2 | styles\responsive\tablet.css L14; styles\tokens\spacing.css L43 |
| `--font-size-2xl` | 1 | components\A11y Panel\Stepper.astro L108 |
| `--font-weight-semibold` | 1 | components\A11y Panel\Stepper.astro L109 |
| `--font-size-xl` | 1 | components\A11y Panel\Stepper.astro L177 |
| `--z-dropdown` | 1 | components\Button\ButtonDropdown.astro L91 |
| `--color-secondary-500` | 1 | components\Cards\ProductCard.astro L123 |
| `--space-2` | 1 | components\Nav\Tabs\SideTabs.astro L144 |
| `--border-radius-2xl` | 1 | components\Search\SearchOverlay.astro L122 |
| `--selector-left` | 1 | components\Switcher\BaseSwitcher.astro L206 |
| `--selector-width` | 1 | components\Switcher\BaseSwitcher.astro L211 |
| `--font-extra-bold` | 1 | styles\global.css L129 |
| `--color-Danger` | 1 | styles\global.css L303 |
| `--img-filter` | 1 | styles\global.css L333 |
| `--img-transition` | 1 | styles\global.css L334 |
| `--svg-filter` | 1 | styles\global.css L430 |
| `--svg-transition` | 1 | styles\global.css L431 |
| `--font-mono` | 1 | styles\a11y\typography\dyslexia.css L64 |
| `--a11y-line-height` | 1 | styles\a11y\visual\index.css L32 |
| `--container-lg` | 1 | styles\base\utilities.css L29 |
| `--container-xl` | 1 | styles\base\utilities.css L30 |
| `--container-3xl` | 1 | styles\base\utilities.css L32 |
| `--container-4xl` | 1 | styles\base\utilities.css L33 |
| `--container-5xl` | 1 | styles\base\utilities.css L34 |
| `--glass-bg-hover` | 1 | styles\buttons\basic-button.css L193 |
| `--glass-shadow-hover` | 1 | styles\buttons\basic-button.css L194 |
| `--glint-speed` | 1 | styles\buttons\styled-button.css L25 |
| `--border-width-md` | 1 | styles\components\masonry-card.css L14 |
| `--tracking-wider` | 1 | styles\components\masonry-card.css L67 |
| `--leading-none` | 1 | styles\components\masonry-card.css L99 |
| `--opacity-medium` | 1 | styles\components\masonry-card.css L142 |
| `--opacity-medium-high` | 1 | styles\components\masonry-card.css L147 |
| `--aspect-square` | 1 | styles\components\masonry-card.css L193 |
| `--aspect-video` | 1 | styles\components\masonry-card.css L269 |
| `--aspect-3-2` | 1 | styles\components\masonry-card.css L280 |
| `--aspect-4-5` | 1 | styles\components\masonry-card.css L285 |
| `--aspect-3-4` | 1 | styles\components\masonry-card.css L290 |
| `--font-regular` | 1 | styles\components\nav\GlassNav-mobile.css L291 |
| `--section-count` | 1 | styles\components\presentation\Reader.css L21 |
| `--btn-color-500` | 1 | styles\design\GlowTokens.css L7 |
| `--spec-grid-col` | 1 | styles\pages\asset-detail.css L636 |
| `--page-margin-spacious` | 1 | styles\responsive\max.css L13 |

## Duplicate Values (45 groups)

| Value | Tokens |
|-------|--------|
| `#000000` | `--brand-c-bg`, `--brand-c-bg-dark`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#00ff00` | `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#00ffff` | `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#06b6d4` | `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#0f172a` | `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#121212` | `--brand-c-bg`, `--brand-c-bg-dark`, `--brand-c-bg-light`, `--brand-c-neutral-light`, `--color-Black` |
| `#1c1b29` | `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#1e293b` | `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#1e40af` | `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#272596` | `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#333333` | `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#4a3f2f` | `--brand-c-bg-dark`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#555555` | `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#6b8e7a` | `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#6d28d9` | `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#777777` | `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light`, `--brand-c-text-light` |
| `#8b7355` | `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#c5e1a5` | `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#cc3399` | `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-primary-light` |
| `#ccd3da` | `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light` |
| `#ddd9d3` | `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#e6e4e2` | `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#f59e0b` | `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#f5f7fb` | `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#f6f5fa` | `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#f97316` | `--brand-c-secondary`, `--brand-c-secondary-dark`, `--brand-c-secondary-light` |
| `#fdf4ff` | `--brand-c-bg`, `--brand-c-bg-light`, `--brand-c-neutral-light` |
| `#ffffff` | `--brand-c-bg-light`, `--brand-c-neutral`, `--brand-c-neutral-dark`, `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light`, `--color-White` |
| `${textcolor` | `--btn-text-color`, `--section-title-color` |
| `0 1px 2px 0 color-mix(in oklch, var(--brand-c-bg-dark) 5%, transparent)` | `--shadow-sm`, `--shadow-xs` |
| `0.75rem` | `--border-radius-md`, `--text-xs` |
| `1.5rem` | `--border-radius-xl`, `--text-2xl` |
| `1rem` | `--border-radius-lg`, `--text-base` |
| `2.5rem` | `--text-4xl`, `--text-5xl`, `--text-6xl` |
| `2rem` | `--text-3xl`, `--text-4xl`, `--text-5xl` |
| `3rem` | `--text-4xl`, `--text-5xl`, `--text-6xl` |
| `4.5rem` | `--text-5xl`, `--text-6xl` |
| `4px` | `--border-width-4`, `--confetti-size-min` |
| `6rem` | `--text-6xl`, `--text-7xl` |
| `color-mix(in oklch, var(--brand-c-bg) 10%, transparent)` | `--glass-card-border`, `--glass-surface-bg` |
| `currentcolor` | `--svg-fill`, `--svg-stroke` |
| `hover {` | `--link`, `--pause-hover`, `--primary`, `--secondary` |
| `linear-gradient(135deg, var(--brand-c-primary) 0%, var(--brand-c-primary-dark) 100%)` | `--gradient-btn-primary-hover`, `--gradient-primary-soft` |
| `linear-gradient(135deg, var(--brand-c-secondary) 0%, var(--brand-c-secondary-dark) 100%)` | `--gradient-btn-secondary-hover`, `--gradient-secondary-soft` |
| `none` | `--img-shadow`, `--shadow`, `--shadow-2xl`, `--shadow-base`, `--shadow-btn`, `--shadow-lg`, `--shadow-md`, `--shadow-sm`, `--shadow-xl`, `--shadow-xs` |

## Token Usage Frequency (Top 30)

| Token | Uses | Files |
|-------|------|-------|
| `--brand-c-text` | 353 | 77 |
| `--brand-c-primary` | 339 | 81 |
| `--brand-c-primary-dark` | 245 | 67 |
| `--brand-c-bg` | 238 | 80 |
| `--color-White` | 217 | 53 |
| `--text-sm` | 204 | 67 |
| `--text-xs` | 202 | 56 |
| `--brand-c-text-light` | 129 | 51 |
| `--text-base` | 120 | 52 |
| `--brand-c-secondary` | 115 | 27 |
| `--brand-c-neutral-light` | 108 | 49 |
| `--text-lg` | 95 | 45 |
| `--color-Black` | 93 | 34 |
| `--brand-c-text-dark` | 76 | 37 |
| `--brand-c-primary-light` | 75 | 29 |
| `--text-xl` | 71 | 43 |
| `--brand-c-bg-light` | 56 | 17 |
| `--text-2xl` | 53 | 34 |
| `--brand-c-neutral-dark` | 47 | 25 |
| `--text-3xl` | 46 | 28 |
| `--brand-c-neutral` | 42 | 26 |
| `--border-radius-md` | 41 | 17 |
| `--shadow-md` | 41 | 19 |
| `--brand-c-bg-dark` | 37 | 5 |
| `--text-4xl` | 31 | 27 |
| `--border-width` | 28 | 13 |
| `--shadow-xl` | 25 | 12 |
| `--brand-c-secondary-dark` | 25 | 12 |
| `--color-Success` | 22 | 6 |
| `--shadow-sm` | 21 | 9 |
