# CSS Architecture Audit — Discovery Report

> **Date:** 2026-02-07
> **Status:** Awaiting approval before restructuring
> **Scope:** Full `src/` directory scan

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Component Inventory & Current Style Locations](#2-component-inventory--current-style-locations)
3. [A11y CSS Inventory](#3-a11y-css-inventory)
4. [Responsive/Breakpoint CSS Inventory](#4-responsivebreakpoint-css-inventory)
5. [Token/Custom Property Inventory](#5-tokencustom-property-inventory)
6. [Duplicate & Conflicting Styles](#6-duplicate--conflicting-styles)
7. [Page-Level CSS That Should Be Elsewhere](#7-page-level-css-that-should-be-elsewhere)
8. [Global Styles Inside Component Files](#8-global-styles-inside-component-files)
9. [Proposed Data Attributes](#9-proposed-data-attributes)
10. [Ambiguous Styles — Needs Your Decision](#10-ambiguous-styles--needs-your-decision)
11. [Orphaned / Dead Code](#11-orphaned--dead-code)

---

## 1. Executive Summary

### Current State

- **130+ CSS files** and **72 `.astro` files with inline `<style>` blocks**
- `global.css` serves as the master import AND contains ~750 lines of base styles, typography, cards, forms, images, SVG utilities, animations, responsive typography, and a11y rules
- The `responsive/` folder exists with 5 breakpoint files + index.css but **is not imported anywhere** (orphaned)
- A11y styles are scattered across 50+ files in `src/styles/a11y/`, plus duplicates in `global.css`, `reset.css`, and inline component styles
- Most components use inline `<style>` blocks rather than separate `.css` files
- Only 8 components import external `.css` files in frontmatter
- Significant duplication: `.sr-only`, `*:focus-visible`, `@media (prefers-reduced-motion)`, `box-sizing`, and media element resets appear in multiple locations

### Key Numbers

| Category | Count |
|----------|-------|
| Total `.astro` files | 119 |
| `.astro` files with inline `<style>` | 72 |
| `.astro` files importing external `.css` | 8 |
| Standalone `.css` files | 130+ |
| `@media` query blocks across codebase | ~197 |
| Custom property definitions | 300+ |
| Duplicate style rules found | 12 |
| Orphaned files | 6 (entire `responsive/` folder) |

---

## 2. Component Inventory & Current Style Locations

### Legend
- **Inline** = `<style>` block inside `.astro` file
- **External** = separate `.css` file imported via frontmatter
- **Global** = styles pulled in via `global.css` @import chain (not component-scoped)
- **Both** = has inline + external/global

### Components with External CSS (via frontmatter import)

| Component | `.astro` location | `.css` location | Notes |
|-----------|------------------|-----------------|-------|
| GlassNav | `components/Nav/NavBar/GlassNav.astro` | `styles/components/nav/GlassNav.css` (imports 5 sub-files) | Well-structured, modular |
| MasonryCard | `components/Masonry/MasonryCards/MasonryCard.astro` | `styles/components/masonry-card.css` | External import |
| Reader | `components/Presentation/Reader.astro` | `styles/components/presentation/Reader.css` | External import |
| ReaderNav | `components/Presentation/ReaderNav.astro` | `styles/components/presentation/ReaderNav.css` | External import |
| ConfettiButton | `components/Button/ConfettiButton.astro` | `styles/buttons/confetti-button.css` | External import |
| HeroMorphAnimation | `components/Sections/HeroMorphAnimation.astro` | `styles/components/hero-morph.css` | External import |

### Components with Styles in Global Chain (via `global.css` @import — NOT scoped)

These components have NO inline styles and NO frontmatter imports. Their styles come from `global.css` importing component CSS files:

| Component | Global CSS file |
|-----------|----------------|
| Toast | `styles/components/toast.css` |
| WhoSliderSection | `styles/components/who-slider.css` |
| PhilosophyFlipCardsSection | `styles/components/philosophy-flip-cards.css` |
| ValuesSection | `styles/components/values-section.css` |
| HeroSection | `styles/components/hero-section.css` |
| CartIcon | `styles/components/cart-icon.css` |
| CookieBanner | `styles/components/cookie-banner.css` |
| IsotopeImageGallery | `styles/components/isotope-gallery.css` |
| AnnouncementTicker | `styles/components/announcement-ticker.css` |
| ProductGallery | `styles/components/product-gallery.css` |
| ScrollColorBackground | `styles/components/scroll-color-background.css` |
| ImageTextSection | `styles/components/image-text-section.css` |
| PillarsSection | `styles/components/pillars-section.css` |
| CTASection | `styles/components/cta-section.css` |
| FooterWithMask | `styles/components/footer-mask.css` |
| SearchOverlay (results) | `styles/components/search-results.css` |
| AccessibilityPanel | `styles/components/a11y-panel.css` |

### Components with Inline `<style>` Only (72 total)

**A11y Panel sub-components (13):**
- Announcer, FontCard, NavigationSection, PresetButton, PresetsSidebar, Slider, Stepper, ThemeSidebar, Toggle, ToggleCard, TypographyAdjustmentsSection, TypographySection, VisualSection

**Cards (9):**
- CompactToolCard, InsightCard, OfferingCard, ProductCard, ProjectCard, ProjectSpecCard, SpecCard, StepCard, WhyCard

**Presentation Sections (11):**
- CalloutSection, CompareSection, EndSection, FullWidthSection, GallerySection, HeroSection, ImageTextSection, QuoteSection, StatsSection, TextSection, TitleSection

**Presentation (2):**
- AuthorCard, PresentationEndSection

**Other components with inline styles:**
- Badge, ButtonDropdown, RevealCanvas, DownloadSummary, TrustBadges, Contact-Popup, Footer, FooterWithMask, CustomScrollbar, ForYouGrid, RelatedGrid, Icon, LottieIcon, InsightAuthorSection (none), InsightContent, InsightHeader, TagList, LegalNav, MasonryGrid, SideTabs, Breadcrumbs, ProductInfo, SpecGrid, ProjectSpecGrid, SearchOverlay, ShareSection, StorySection, IntroTextSection, MiniCart, BaseSwitcher, IsotopeFilterSwitcher, SectionTitle

**Pages with inline `<style is:global>`:**
- `services/[slug].astro`, `checkout.astro`, `search.astro`

**Pages with scoped `<style>`:**
- `verify.astro`, `showcase/section-titles.astro`

### Components with NO Styles at all
- AccessibilityPanel (wrapper only — delegates to sub-components)
- Button.astro (uses external `basic-button.css` via global chain)
- Various section components that rely entirely on global utility classes

---

## 3. A11y CSS Inventory

### Dedicated A11y Folder (`src/styles/a11y/`) — 50+ files, well-organised

```
src/styles/a11y/
├── index.css                    # Master import
├── base/
│   ├── index.css               # Imports base modules
│   ├── utilities.css           # sr-only, skip-links, focus-visible, forced-colors, touch targets
│   ├── semantic-tokens.css     # Focus ring tokens, aria-disabled, high-contrast
│   ├── theme-overrides.css     # A11y theme token overrides
│   ├── media-filters.css       # System media query support
│   └── print.css               # Print stylesheet
├── typography/
│   ├── index.css
│   ├── accessible-fonts.css    # OpenDyslexic, Atkinson Hyperlegible etc.
│   ├── dyslexia.css           # Dyslexia-friendly overrides
│   ├── font-size.css          # Font size scaling
│   ├── letter-spacing.css     # Letter spacing adjustments
│   └── line-spacing.css       # Line height adjustments
├── visual/
│   ├── index.css
│   ├── highlight-links.css    # 631 lines — link highlighting mode
│   └── text-only.css          # Text-only mode
├── motion/
│   └── reduced-motion.css     # Class-based + @media reduced motion
├── focus/
│   └── enhanced-focus.css     # Enhanced keyboard focus indicators
├── components/
│   ├── index.css
│   ├── glass-nav.css          # Nav a11y overrides
│   ├── hero-section.css       # Hero a11y overrides
│   ├── masonry-grid.css       # Masonry a11y overrides
│   ├── offering-card.css      # Offering card a11y overrides
│   ├── search-overlay.css     # Search overlay a11y overrides
│   ├── side-tabs.css          # Side tabs a11y overrides
│   ├── step-card.css          # Step card a11y overrides
│   ├── switcher.css           # Switcher a11y overrides
│   └── why-card.css           # Why card a11y overrides
├── pages/
│   ├── index.css
│   ├── asset-detail.css       # Asset detail page a11y overrides
│   └── services.css           # Services page a11y overrides
├── plain-mode/                # 11+ files — complete distraction-free mode
│   ├── index.css
│   ├── core.css
│   ├── components.css
│   ├── theme-overrides.css
│   └── pages/ (home, about, projects, insights, contact, products, services, asset-detail, cart)
└── themes/ (loaded dynamically)
    ├── a11y-cream.css
    ├── a11y-dark.css
    ├── a11y-deuteranopia.css
    ├── a11y-high-contrast.css
    ├── a11y-monochrome.css
    ├── a11y-protanopia.css
    └── a11y-tritanopia.css
```

### A11y Patterns SCATTERED Outside the A11y Folder

| Pattern | Location | Lines | Should Move To |
|---------|----------|-------|---------------|
| `.sr-only` (duplicate) | `global.css` | 527-537 | Remove — already in `a11y/base/utilities.css` |
| `*:focus-visible` (duplicate) | `global.css` | 540-543 | Remove — already in `a11y/base/utilities.css` |
| `@media (prefers-reduced-motion)` for html | `global.css` | 56-60 | `a11y/motion/reduced-motion.css` |
| `@media (prefers-reduced-motion)` for cards | `global.css` | 269-278 | Keep as component override OR move to a11y |
| `@media (prefers-reduced-motion)` for img/svg | `global.css` | 504-523 | `a11y/motion/reduced-motion.css` |
| `.a11y-reduce-motion .card` | `global.css` | 260-267 | `a11y/motion/reduced-motion.css` |
| `.a11y-reduce-motion .img-*` / `.svg-*` | `global.css` | 485-502 | `a11y/motion/reduced-motion.css` |
| `@media (prefers-reduced-motion)` in reset | `base/reset.css` | 74-87 | `a11y/motion/reduced-motion.css` |
| Form focus styles (outline:none + box-shadow) | `global.css` | 323-329 | `a11y/focus/` or keep in global forms |
| `.btn:focus-visible` | `buttons/basic-button.css` | 34-37, 299-311 | `a11y/focus/enhanced-focus.css` |
| `@media (prefers-reduced-motion)` for buttons | `buttons/basic-button.css` | 352-367 | `a11y/motion/reduced-motion.css` |
| `@media (prefers-contrast: more)` for buttons | `buttons/basic-button.css` | 369-377 | `a11y/contrast.css` (new) |
| `@media (forced-colors)` | `a11y/base/utilities.css` | 118-127 | Already in a11y — good |
| `@media (prefers-reduced-motion)` in 15+ component CSS files | Various `styles/components/*.css` | Various | Extract shared patterns to `a11y/motion/` |
| `:focus-visible` in 15+ inline `.astro` `<style>` blocks | Various components | Various | Extract to `a11y/focus/` where shared |

### Focus Styles in Inline Component `<style>` Blocks

| Component | Focus pattern | Unique? |
|-----------|--------------|---------|
| Toggle.astro | `input:focus-visible + .a11y-toggle__slider` | Yes — component-specific |
| FontCard.astro | Button focus-visible | Generic — could be shared |
| PresetButton.astro | Button focus-visible | Generic — could be shared |
| ToggleCard.astro | Button focus-visible | Generic — could be shared |
| Slider.astro | Input range focus-visible | Component-specific |
| Stepper.astro | Button focus-visible | Generic — could be shared |
| RelatedGrid.astro | Link focus-visible | Generic — could be shared |
| CompactToolCard.astro | Card focus-visible | Generic — could be shared |
| ButtonDropdown.astro | Button focus-visible | Generic — could be shared |
| ProductGallery.astro | `.thumbnail:focus-visible` | Component-specific |
| Contact-Popup.astro | Input focus (outline:none) | ⚠️ Removes focus — needs review |
| SearchOverlay.astro | Input focus (outline:none) | ⚠️ Removes focus — needs review |
| search.astro | Input focus (outline:none) | ⚠️ Removes focus — needs review |

### Reduced Motion in Component CSS Files

| File | Lines | Pattern | Shared? |
|------|-------|---------|---------|
| `hero-morph.css` | 303 | Disable animations | Component-specific |
| `who-slider.css` | 62, 134, 356 | Disable slide/hover animations | Component-specific |
| `philosophy-flip-cards.css` | 377 | Disable flip animation | Component-specific |
| `pillars-section.css` | 41 | Disable transitions | Generic |
| `cookie-banner.css` | 148 | Disable slide animation | Component-specific |
| `cart-icon.css` | 233 | Disable badge animation | Component-specific |
| `announcement-ticker.css` | 126 | Disable scroll animation | Component-specific |
| `footer-mask.css` | 87 | Disable animations | Component-specific |
| `styled-button.css` | 70 | Disable hover effects | Generic |
| `GlowTokens.css` | 45 | Disable glow animation | Component-specific |
| `presentation/sections.css` | 404 | Disable transitions | Component-specific |
| `presentation/ReaderNav.css` | 1350 | Disable transitions | Component-specific |
| `presentation/Reader.css` | 138 | Disable transitions | Component-specific |

---

## 4. Responsive/Breakpoint CSS Inventory

### Dedicated Responsive Folder — ORPHANED (Not Imported)

```
src/styles/responsive/
├── index.css     # Imports the 5 breakpoint files — NOT imported anywhere
├── max.css       # min-width: 1440px — typography + spacing tokens
├── desktop.css   # max-width: 1024px — typography + spacing tokens
├── tablet.css    # max-width: 768px — typography + spacing tokens
├── phone.css     # max-width: 640px — typography + spacing tokens
└── xs.css        # max-width: 400px — typography + spacing tokens
```

These files only modify `:root` custom properties at each breakpoint (typography sizes and spacing tokens). They are NOT loaded — the same behaviour is partially duplicated in `tokens/typography.css` lines 55-71.

### Responsive Typography Conflict

The responsive `typography.css` file uses **min-width** (mobile-first):
- `@media (min-width: 768px)` — tablet sizes
- `@media (min-width: 1024px)` — desktop sizes

The orphaned `responsive/` files use **max-width** (desktop-first):
- `@media (max-width: 1024px)`, `(max-width: 768px)`, etc.

And `global.css` uses yet another set of max-width breakpoints for responsive typography (lines 600-753).

**This is a three-way conflict.** Only `tokens/typography.css` and `global.css` are actually loaded.

### Breakpoints Used Across the Codebase

| Breakpoint | Direction | Usage Count | Key Locations |
|-----------|-----------|-------------|---------------|
| 200px | max-width | 8 | global.css, GlassNav-responsive, editorial-layout, base/utilities |
| 250px | max-width | 2 | cta-section, who-slider |
| 280px | max-width | 6 | global.css, pillars-section, base/utilities, who-slider |
| 300px | max-width | 4 | global.css, editorial-layout, who-slider |
| 350px | max-width | 3 | hero-section, GlassNav-responsive, who-slider |
| 400px | max-width | 10 | global.css, hero-section, image-text-section, xs.css |
| 500px | max-width | 5 | hero-section, highlight-links, ReaderNav |
| 640px | max-width | 8 | phone.css, hero-morph, who-slider, sections.css |
| 767px | max-width | 6 | pillars-section, philosophy-flip-cards, cta-section, isotope-gallery |
| 768px | max-width/min-width | 25+ | Most common breakpoint — nav, grids, typography, a11y-panel |
| 900-999px | ranges | 4 | GlassNav-responsive only |
| 1024px | max-width/min-width | 10 | hero-morph, masonry, editorial-layout, isotope-gallery |
| 1100-1350px | ranges | 6 | GlassNav-responsive only |
| 1400px | min-width | 3 | GlassNav-responsive, isotope-gallery |
| 1440px | min-width | 1 | max.css |

### Responsive Styles INSIDE `global.css` (Lines 598-753)

`global.css` contains 4 responsive typography/layout media query blocks:
- `@media (max-width: 400px)` — h1-h3, p, blockquote, section padding
- `@media (max-width: 300px)` — center-align everything
- `@media (max-width: 280px)` — smaller headings, blockquote
- `@media (max-width: 200px)` — micro screen fallbacks

These are global responsive overrides that should move to `responsive/`.

### Responsive Styles in `base/utilities.css`

Lines 227-267 contain responsive utility classes:
- `@media (min-width: 768px)` — `.md\:grid-cols-2`, `.md\:hidden`, etc.
- `@media (min-width: 1024px)` — `.lg\:grid-cols-3`, `.lg\:hidden`, etc.
- `@media (min-width: 1280px)` — `.xl\:grid-cols-4`
- `@media (max-width: 280px)` — container padding
- `@media (max-width: 200px)` — container padding

---

## 5. Token/Custom Property Inventory

### Current Token Files

| File | Category | Definitions | Notes |
|------|----------|-------------|-------|
| `tokens/typography.css` | Font families, sizes, weights, line heights, letter spacing | 40+ | Also contains responsive breakpoints (min-width) |
| `tokens/spacing.css` | Spacing, containers, page margins, borders, radius, z-index, transitions | 60+ | Borders, z-index, and transitions should be separate files |
| `tokens/shadows.css` | Shadows, glassmorphism, glow effects | 40+ | Good |
| `tokens/images.css` | Image & SVG tokens + utility classes | 30+ | Contains utility CLASSES — not just tokens |
| `tokens/gradients.css` | Gradient definitions + utility classes | 100+ (933 lines) | Contains utility CLASSES — not just tokens |
| `tokens/status.css` | Black, white, status colours | 6 | Good |
| `tokens/index.css` | Imports all above | - | Good |

### Tokens NOT in the Token Folder

| Token Category | Current Location | Should Be |
|---------------|-----------------|-----------|
| All colour palette (Primary, Secondary, Accent 1-5, Background, Text, Neutral) | `themes/brand/BrandDefault.css` | Keep in themes — these ARE theme-specific |
| Confetti colours + animation settings | `design/confetti.css` | `tokens/motion.css` or keep in design |
| Glow effect tokens | `design/GlowTokens.css` | `tokens/shadows.css` or keep in design |
| Dropdown hover/border tokens | `buttons/dropdown-tokens.css` | `tokens/` or component-specific |
| A11y theme preview tokens | `themes/Preview/coretokens.css` | Keep — theme-specific |
| Button-specific tokens (`--btn-color-500`, etc.) | `design/GlowTokens.css` | Component token or `tokens/` |

### Target Token Structure (Proposed)

```
tokens/
├── colors.css       # NEW — Extract from status.css, add color utility notes
├── spacing.css      # Keep — spacing scale only
├── typography.css   # Keep — remove responsive breakpoints from here
├── borders.css      # NEW — Extract from spacing.css (border widths, radii)
├── shadows.css      # Keep as-is
├── motion.css       # NEW — Extract transitions from spacing.css, add confetti tokens
├── gradients.css    # Keep — but move utility CLASSES out to base/utilities.css
├── images.css       # Keep — but move utility CLASSES out to base/utilities.css
└── index.css        # Update imports
```

---

## 6. Duplicate & Conflicting Styles

### Confirmed Duplicates

| Rule | Location 1 | Location 2 | Resolution |
|------|-----------|-----------|------------|
| `.sr-only` | `global.css:527-537` | `a11y/base/utilities.css:19-30` | Remove from `global.css` |
| `*:focus-visible` | `global.css:540-543` | `a11y/base/utilities.css:87-95` | Remove from `global.css` |
| `box-sizing: border-box` (universal) | `base/reset.css:7-11` | `global.css:88-90` | Remove from `global.css` |
| `img,picture,video,canvas,svg` reset | `base/reset.css:55-63` | `global.css:93-97` | Remove from `global.css` |
| `scroll-behavior: smooth` on `html` | `base/reset.css:21` | `global.css:51` | Remove from `global.css` (reset handles it) |
| `@media (prefers-reduced-motion)` universal | `base/reset.css:74-87` | `a11y/base/utilities.css:102-111` | Remove from one — they conflict on specifics |
| `@keyframes fadeIn` | `global.css:63-66` | `global.css:547-550` | Literal duplicate within same file |
| `@media (prefers-reduced-motion)` scroll | `global.css:56-60` | `a11y/motion/reduced-motion.css:72` | Remove from `global.css` |
| `.form-error` | `global.css:336-340` | `base/utilities.css:554-563` | Different definitions — **CONFLICT** |

### Conflicting Token Values

| Token | Location 1 | Location 2 | Issue |
|-------|-----------|-----------|-------|
| `--text-3xl` at tablet | `tokens/typography.css:57` (2rem) | `responsive/tablet.css` (not loaded) | No conflict since responsive/ is orphaned |
| `--text-4xl` at tablet | `tokens/typography.css:58` (2.5rem) | `responsive/tablet.css` (not loaded) | Same — orphaned |
| Spacing tokens in a11y-panel | `tokens/spacing.css` (rem) | `a11y-panel.css:68-100` (px !important) | Intentional override — panel needs fixed units |

---

## 7. Page-Level CSS That Should Be Elsewhere

### Page CSS Files (in `styles/pages/`)

All 11 page CSS files are imported via `global.css`, meaning every page loads ALL page styles:

| File | Lines | Contains |
|------|-------|----------|
| `pages/home.css` | - | Home page layout |
| `pages/about.css` | - | About page layout |
| `pages/assets.css` | - | Assets listing layout |
| `pages/asset-detail.css` | 1100+ | Asset detail — large file with many responsive rules |
| `pages/insights.css` | - | Insights listing |
| `pages/projects.css` | - | Projects listing |
| `pages/services.css` | 644+ | Services page — contains responsive + reduced motion |
| `pages/service-detail.css` | - | Service detail |
| `pages/cart.css` | - | Cart page |
| `pages/checkout.css` | - | Checkout page |
| `pages/legal.css` | - | Legal pages |

**Problem:** All page CSS is loaded on EVERY page via `global.css`. Each page file should be imported only by its respective page `.astro` file.

### Pages with Inline `<style is:global>`

| Page | Issue |
|------|-------|
| `services/[slug].astro` | Has `<style is:global>` — leaks to all pages when loaded |
| `checkout.astro` | Has `<style is:global>` — leaks to all pages when loaded |
| `search.astro` | Has `<style is:global>` — leaks to all pages when loaded |

---

## 8. Global Styles Inside Component Files

### Component CSS Loaded via `global.css` (Not Scoped)

All 17 component CSS files imported in `global.css` (lines 9-28) load on every page, even pages that don't use those components. These should be component-scoped imports:

- `toast.css`, `who-slider.css`, `philosophy-flip-cards.css`, `values-section.css`
- `hero-section.css`, `hero-morph.css`, `cart-icon.css`, `cookie-banner.css`
- `isotope-gallery.css`, `announcement-ticker.css`, `product-gallery.css`
- `scroll-color-background.css`, `image-text-section.css`, `pillars-section.css`
- `cta-section.css`, `footer-mask.css`, `search-results.css`

### `global.css` Contains Non-Global Styles

The following in `global.css` are NOT truly global — they're component/pattern styles:

| Section | Lines | Should Be |
|---------|-------|-----------|
| Card styles (`.card`, `.card-header`, etc.) | 239-298 | `base/utilities.css` or component CSS |
| Form styles (`.form-group`, `.form-label`, etc.) | 299-340 | `base/utilities.css` or `base/forms.css` |
| Section padding (`.section`, `.section-sm`, `.section-lg`) | 342-354 | `base/utilities.css` |
| Image/SVG utility classes | 358-482 | `base/utilities.css` (tokens stay in `tokens/images.css`) |
| Responsive typography for h1-h6 | 598-753 | `responsive/typography.css` |
| Animation keyframes + classes | 545-582 | `base/animations.css` or `tokens/motion.css` |
| Scroll animation visibility | 588-596 | Component-specific or `base/animations.css` |
| A11y reduced motion for cards/images/svg | 260-278, 484-523 | `a11y/motion/reduced-motion.css` |
| `.sr-only` | 527-537 | Already in `a11y/base/utilities.css` — REMOVE |
| `*:focus-visible` | 540-543 | Already in `a11y/base/utilities.css` — REMOVE |

### `base/utilities.css` Contains Mixed Concerns

| Section | Lines | Category |
|---------|-------|----------|
| Container utilities | 8-37 | Layout — keep |
| Flexbox utilities | 39-67 | Layout — keep |
| Grid utilities | 69-76 | Layout — keep |
| Spacing utilities | 78-118 | Layout — keep |
| Text utilities | 120-149 | Typography — keep |
| Colour utilities | 151-162 | Visual — keep |
| Border utilities | 164-174 | Visual — keep |
| Display utilities | 176-181 | Layout — keep |
| Position utilities | 183-188 | Layout — keep |
| Shadow utilities | 203-209 | Visual — keep |
| Glass utility | 211-219 | Visual — keep |
| Transition utilities | 221-225 | Motion — keep or move |
| **Responsive grid/visibility utilities** | 227-267 | **→ responsive/** |
| **Tooltip system** | 269-535 | **→ separate `base/tooltips.css` or component** |
| **Form validation system** | 537-665 | **→ separate `base/forms.css`** |

---

## 9. Proposed Data Attributes

Based on patterns found in the codebase:

### Already in Use
- `data-btn-theme="flat"` — on `<body>` for button theme
- `data-scrollbar` — on scrollbar component
- `data-scroll-reveal` — scroll animation trigger
- `data-text-animate` — text animation trigger
- `data-tooltip` — tooltip content
- `data-expand="settings"` — nav expandable section
- `data-product-id`, `data-product-name`, `data-product-price`, `data-product-image` — cart

### Proposed New Attributes

| Attribute | Purpose | Targets |
|-----------|---------|---------|
| `data-interactive` | Focus-visible styles for all clickable/focusable elements | Buttons, links, cards with click handlers, form inputs |
| `data-layout="grid\|flex\|stack"` | Responsive layout behaviour | Grid containers, flex wrappers |
| `data-text="body\|heading\|caption"` | Responsive typography scaling | Headings, paragraphs, captions |
| `data-spacing="section\|card\|tight"` | Responsive spacing patterns | Sections, cards, compact areas |
| `data-visible="mobile\|desktop\|tablet"` | Responsive visibility | Elements that show/hide at breakpoints |

### Components That Would Use Each Attribute

**`data-interactive`:** All buttons (Button, ConfettiButton, ButtonDropdown), card links (ProductCard, ProjectCard, InsightCard, OfferingCard), nav links, form inputs, search input, thumbnail buttons, toggle switches, sliders, stepper buttons

**`data-layout="grid"`:** ForYouGrid, RelatedGrid, MasonryGrid, SpecGrid, ProjectSpecGrid, PillarsSection, CTASection trust signals, editorial-layout grids

**`data-layout="flex"`:** Nav container, button groups, card headers, WhoSlider cards

**`data-layout="stack"`:** Mobile column layouts, IntroTextSection, StorySection

**`data-text="heading"`:** SectionTitle, hero headings, card titles

**`data-text="body"`:** Paragraphs, card descriptions, section content

**`data-spacing="section"`:** All section components (HeroSection, CTASection, PillarsSection, etc.)

**`data-spacing="card"`:** All card components

**`data-visible="mobile"`:** Mobile menu, hamburger button
**`data-visible="desktop"`:** Desktop nav links, desktop-only elements

---

## 10. Ambiguous Styles — Needs Your Decision

These styles could reasonably be categorised as visual, a11y, or responsive. I need your input:

### 1. Card `:hover` transform + shadow (global.css:254-257)
```css
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```
- **Visual?** It's a decorative hover effect
- **A11y?** The reduced-motion override suggests it has a11y implications
- **Recommendation:** Keep in component CSS as visual, ensure reduced-motion override exists in a11y/

### 2. Form input focus styles (global.css:323-329)
```css
.form-input:focus { outline: none; border-color: ...; box-shadow: ... }
```
- **Visual?** It's styling the focus state
- **A11y?** Focus visibility is an a11y concern
- **Recommendation:** Move to `a11y/focus/` — focus patterns are a11y

### 3. `outline: none` on inputs (Contact-Popup, SearchOverlay, search.astro)
- **Visual?** Removing default outline for custom styling
- **A11y?** ⚠️ If no replacement focus indicator exists, this is an a11y violation
- **Recommendation:** Flag for review — ensure each has a visible focus replacement

### 4. Tooltip hover opacity/visibility transitions (utilities.css:282-321)
- **Visual?** Purely decorative tooltip appearance
- **Responsive?** No breakpoint involvement
- **A11y?** Tooltips have a11y implications (keyboard accessibility)
- **Recommendation:** Keep as visual utility. Consider adding `data-interactive` for keyboard support.

### 5. `.skip-link` styles (a11y/base/utilities.css:50-80)
- Currently in a11y/ — this is correct
- But the skip link HTML is in BaseLayout.astro — no action needed

### 6. Scrollbar hiding styles (global.css:109-136)
- **Visual?** Custom scrollbar appearance
- **A11y?** Can affect scroll accessibility
- **Recommendation:** Keep in global as visual/browser normalisation

### 7. `@media (pointer: coarse)` touch targets (a11y/base/utilities.css:134-152)
- **A11y?** Touch target sizing is WCAG compliance
- **Responsive?** It's a media query based on input type
- **Recommendation:** Keep in `a11y/` — it's accessibility, not responsive design

### 8. Print stylesheet (a11y/base/print.css)
- **A11y?** Currently in a11y folder
- **Should it be in a11y?** Print is more of a media/output concern
- **Recommendation:** Keep in a11y since it hides a11y-specific elements

---

## 11. Orphaned / Dead Code

| Item | Location | Status |
|------|----------|--------|
| `responsive/index.css` + 5 breakpoint files | `src/styles/responsive/` | NOT imported anywhere |
| `responsive/` breakpoint token overrides | All 5 files | Partially duplicated by `tokens/typography.css` responsive queries |
| `@keyframes fadeIn` duplicate | `global.css:63-66` AND `global.css:547-550` | Same keyframes defined twice |
| `service-detail.css` | `styles/pages/service-detail.css` | Not confirmed if imported (not in global.css import list) — may be orphaned |
| `editorial-layout.css` | `styles/components/editorial-layout.css` | Only imported by `projects/[slug].astro` — not in global chain |
| `GlowTokens.css` | `styles/design/GlowTokens.css` | Not in global.css imports — may be imported by a component |
| `confetti.css` utility classes | `styles/design/confetti.css` lines 35+ | Classes may or may not be used |

---

## Next Steps

**I will NOT make any changes until you approve this report.** Please review and let me know:

1. **Ambiguous items (Section 10):** Your decisions on each
2. **Token restructuring (Section 5):** OK to split `spacing.css` into spacing + borders + motion?
3. **Orphaned responsive/ folder:** Delete the 6 files, or repurpose them as the new responsive foundation?
4. **Page CSS loading strategy:** Move page CSS to per-page imports (better performance), or keep in global chain?
5. **A11y theme files (`themes/a11y/*.css`):** These are dynamically loaded by JS. Leave as-is?
6. **Plain mode system (11+ files):** This is a large a11y sub-system. Keep intact or refactor?
7. **Tooltip system in utilities.css:** Move to own file? It's ~250 lines.
8. **Form validation system in utilities.css:** Move to own file? It's ~130 lines.
9. **Any components you want me to NOT touch?**

Once approved, I'll proceed with the full restructure per the target architecture.
