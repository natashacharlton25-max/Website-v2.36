# Color Token Usage Report

**Generated**: 2025-12-25
**Scope**: All CSS files in `src/styles/`
**Total Files Analyzed**: 103 CSS files

---

## Executive Summary

This report analyzes all color tokens defined in `BrandDefault.css` and `status.css`, tracking their usage across all CSS files in `src/styles/`. The analysis reveals usage patterns, identifies heavily-used core tokens, and highlights rarely/never-used tokens that are candidates for removal.

---

## PRIMARY COLORS (50-900)

### --color-Primary-50
- **Usage:** 10 occurrences
- **Purposes:** Light backgrounds, light tints in gradients
- **Key Files:**
  - themes/brand/BrandDefault.css (definition)
  - tokens/gradients.css (gradient definitions)
  - base/utilities.css (success state fallbacks)

### --color-Primary-100
- **Usage:** 98 occurrences (HEAVILY USED)
- **Purposes:** Light backgrounds, hover states, dropdown hover backgrounds, button hover states, accessibility panel backgrounds
- **Key Files:**
  - tokens/gradients.css (42 uses - pastel and light gradient definitions)
  - buttons/dropdown-tokens.css (4 uses - hover states)
  - buttons/basic-button.css (1 use - ghost button hover)
  - a11y/components/accessibility-panel.css (1 use - panel background)
  - themes/* (6 a11y theme overrides)

### --color-Primary-200
- **Usage:** 51 occurrences
- **Purposes:** Light gradients, borders, subtle backgrounds
- **Key Files:**
  - tokens/gradients.css (35 uses - light gradient variants)
  - pages/asset-detail.css (3 uses - borders, subtle backgrounds)
  - themes/* (6 a11y theme files)

### --color-Primary-300
- **Usage:** 40 occurrences
- **Purposes:** Border colors, theme card outlines, accessibility focus states, gradient mid-tones
- **Key Files:**
  - tokens/gradients.css (12 uses)
  - themes/Preview/theme-cards.css (2 uses - borders and outlines)
  - a11y/components/accessibility-panel.css (2 uses - border colors)
  - a11y/plain-mode/pages/products.css (1 use)
  - themes/* (6 a11y themes)

### --color-Primary-400
- **Usage:** 87 occurrences (HEAVILY USED)
- **Purposes:** Gradients, confetti colors, rainbow effects, gallery borders
- **Key Files:**
  - tokens/gradients.css (60+ uses - extensive gradient usage)
  - design/confetti.css (1 use - teal confetti color)
  - components/isotope-gallery.css (1 use - gallery border)
  - components/presentation/ReaderNav.css (2 uses - stroke and text colors)
  - themes/* (6 a11y themes)

### --color-Primary-500
- **Usage:** 191 occurrences (🔥 CORE DESIGN TOKEN - MOST USED)
- **Purposes:** Primary brand color, button backgrounds, links, focus states, borders, icons, accent colors
- **Key Files:**
  - tokens/gradients.css (45+ uses)
  - a11y/* (60+ uses - focus rings, buttons, borders, active states)
  - buttons/basic-button.css (4 uses - button backgrounds)
  - buttons/dropdown-tokens.css (2 uses - borders)
  - global.css (6 uses - links, blockquotes, focus states)
  - components/who-slider.css (6 uses - buttons and dots)
  - components/toast.css (8 uses - toast styling)
  - components/nav/* (5 uses - nav active states)
  - base/utilities.css (10 uses - utility classes, success fallbacks)
  - themes/* (6 a11y themes)

### --color-Primary-600
- **Usage:** 96 occurrences (🔥 CORE DESIGN TOKEN)
- **Purposes:** Darker buttons, hover states, text colors, icon colors, borders
- **Key Files:**
  - tokens/gradients.css (35+ uses - gradient definitions)
  - a11y/* (30+ uses - buttons, borders, text colors)
  - buttons/basic-button.css (6 uses - outline buttons, hover states)
  - components/product-gallery.css (3 uses - button backgrounds)
  - components/isotope-gallery.css (3 uses - button backgrounds)
  - pages/asset-detail.css (15+ uses - various UI elements)
  - themes/* (6 a11y themes)

### --color-Primary-700
- **Usage:** 78 occurrences
- **Purposes:** Dark gradients, text colors, shadows
- **Key Files:**
  - tokens/gradients.css (50+ uses - dark gradient variants)
  - global.css (2 uses - headings, links)
  - buttons/basic-button.css (1 use - ghost button hover)
  - a11y/components/search-overlay.css (1 use - text color)
  - themes/* (6 a11y themes)

### --color-Primary-800
- **Usage:** 70 occurrences
- **Purposes:** Very dark gradients, dropdown text colors
- **Key Files:**
  - tokens/gradients.css (50+ uses - intense/dark gradients)
  - buttons/dropdown-tokens.css (2 uses - selected/hover text)
  - themes/* (6 a11y themes)

### --color-Primary-900
- **Usage:** 46 occurrences
- **Purposes:** Darkest gradient stops
- **Key Files:**
  - tokens/gradients.css (35+ uses - gradient endpoints)
  - themes/brand/BrandDefault.css (definition)
  - themes/* (6 a11y themes)

---

## SECONDARY COLORS (100-800)

### --color-Secondary-100
- **Usage:** 33 occurrences
- **Purposes:** Light gradients, dropdown hover states
- **Key Files:**
  - tokens/gradients.css (25+ uses - light gradients)
  - buttons/dropdown-tokens.css (1 use)
  - themes/* (6 a11y themes)

### --color-Secondary-200
- **Usage:** 23 occurrences
- **Purposes:** Light gradients, subtle backgrounds
- **Key Files:**
  - tokens/gradients.css (15+ uses)
  - themes/* (6 a11y themes)

### --color-Secondary-300
- **Usage:** 12 occurrences
- **Purposes:** Asset detail page styling, gradients
- **Key Files:**
  - tokens/gradients.css (8 uses)
  - pages/asset-detail.css (1 use - border)
  - themes/* (6 a11y themes)

### --color-Secondary-400
- **Usage:** 36 occurrences
- **Purposes:** Confetti colors, gradients, link hover states
- **Key Files:**
  - tokens/gradients.css (25+ uses)
  - design/confetti.css (1 use - gold confetti)
  - a11y/base/semantic-tokens.css (1 use - link hover)
  - themes/* (6 a11y themes)

### --color-Secondary-500
- **Usage:** 44 occurrences
- **Purposes:** Secondary buttons, announcement ticker, nav colors, gradients, link colors
- **Key Files:**
  - tokens/gradients.css (30+ uses)
  - components/announcement-ticker.css (1 use)
  - components/nav/* (5 uses - mobile nav states)
  - buttons/basic-button.css (2 uses - secondary button)
  - buttons/dropdown-tokens.css (1 use - border)
  - a11y/base/semantic-tokens.css (1 use - link color)
  - themes/* (6 a11y themes)

### --color-Secondary-600
- **Usage:** 41 occurrences
- **Purposes:** Buttons, gradients, hero gradients
- **Key Files:**
  - tokens/gradients.css (30+ uses - brand gradients, hero gradients)
  - buttons/basic-button.css (2 uses - button hover)
  - components/product-gallery.css (1 use)
  - components/isotope-gallery.css (1 use)
  - pages/asset-detail.css (1 use)
  - themes/* (6 a11y themes)

### --color-Secondary-700
- **Usage:** 30 occurrences
- **Purposes:** Dark gradients
- **Key Files:**
  - tokens/gradients.css (22+ uses)
  - themes/* (6 a11y themes)

### --color-Secondary-800
- **Usage:** 30 occurrences
- **Purposes:** Very dark gradients, dropdown text colors, dark theme elements
- **Key Files:**
  - tokens/gradients.css (20+ uses)
  - buttons/dropdown-tokens.css (1 use - hover text)
  - themes/* (6 a11y themes)

### ⚠️ --color-Secondary-900
- **Usage:** MISSING - Referenced by 7 a11y themes but not defined!
- **Issue:** CRITICAL - causes fallback issues
- **Fix:** Add to BrandDefault.css line 32: `--color-Secondary-900: #5a3420;`

---

## BACKGROUND COLORS (50-500)

### --color-Background-50
- **Usage:** 110 occurrences (🔥 CORE DESIGN TOKEN)
- **Purposes:** Main page backgrounds, card backgrounds, panel backgrounds, glass effects, gradients
- **Key Files:**
  - tokens/gradients.css (30+ uses - background gradients, glass effects)
  - global.css (1 use - page background via --page-bg)
  - a11y/* (25+ uses - panels, buttons, cards, surfaces)
  - components/* (15+ uses - nav, panels, buttons, galleries)
  - pages/* (10+ uses - page backgrounds)
  - buttons/basic-button.css (1 use - neumorphic button)
  - themes/* (6 a11y themes)

### --color-Background-100
- **Usage:** 87 occurrences (🔥 HEAVILY USED)
- **Purposes:** Alternate backgrounds, surface colors, gradients, cookie banner, card backgrounds
- **Key Files:**
  - tokens/gradients.css (30+ uses)
  - a11y/* (20+ uses - surfaces, panels, tabs)
  - components/* (15+ uses - announcement ticker, who slider, cookie banner)
  - pages/* (10+ uses - asset pages, cart, legal)
  - a11y/base/semantic-tokens.css (1 use - --surface)
  - base/utilities.css (1 use - .bg-alt)
  - themes/* (6 a11y themes)

### --color-Background-200
- **Usage:** 66 occurrences (🔥 HEAVILY USED)
- **Purposes:** Secondary surfaces, borders, gradients, search overlays
- **Key Files:**
  - tokens/gradients.css (30+ uses)
  - a11y/* (20+ uses - surfaces, search overlay, asset detail overrides)
  - components/scroll-color-background.css (1 use - fallback)
  - a11y/base/semantic-tokens.css (1 use - --surface2)
  - themes/* (6 a11y themes)

### --color-Background-300
- **Usage:** 65 occurrences (🔥 HEAVILY USED)
- **Purposes:** Borders, tertiary surfaces, gradients, accessibility panel borders
- **Key Files:**
  - tokens/gradients.css (20+ uses)
  - a11y/* (20+ uses - borders, surfaces, accessibility panel)
  - components/* (10+ uses - borders in announcements, theme cards)
  - buttons/basic-button.css (3 uses - neumorphic shadows)
  - a11y/base/semantic-tokens.css (1 use - --surface3)
  - themes/* (6 a11y themes)

### --color-Background-400
- **Usage:** 14 occurrences
- **Purposes:** Gradients, accessibility panel borders
- **Key Files:**
  - tokens/gradients.css (8 uses)
  - a11y/components/accessibility-panel.css (2 uses - borders)
  - themes/* (6 a11y themes)

### --color-Background-500
- **Usage:** 10 occurrences
- **Purposes:** Gradients only
- **Key Files:**
  - tokens/gradients.css (4 uses)
  - themes/brand/BrandDefault.css (definition)
  - themes/* (6 a11y themes)

### ⚠️ --color-Background-600 through 900
- **Usage:** NOT DEFINED
- **Issue:** Missing for dark mode support
- **Recommendation:** Add Background-600 through Background-900 for complete scale

---

## TEXT COLORS (50-950)

### --color-Text-50
- **Usage:** 21 occurrences
- **Purposes:** Light text on dark backgrounds, presentation reader, enhanced focus (inverted)
- **Key Files:**
  - components/toast.css (1 use)
  - components/presentation/Reader*.css (10 uses - light text)
  - a11y/focus/enhanced-focus.css (1 use - inverted focus)
  - a11y/visual/text-only.css (2 uses)
  - themes/* (9 a11y themes - 1 missing definition)

### --color-Text-200
- **Usage:** 4 occurrences
- **Purposes:** Presentation reader subtle text, insights page borders
- **Key Files:**
  - components/presentation/Reader.css (2 uses)
  - pages/services.css (1 use - border)
  - a11y/plain-mode/pages/insights.css (1 use - border)

### --color-Text-300
- **Usage:** 18 occurrences
- **Purposes:** Muted text, slider dots, presentation nav, plain mode borders
- **Key Files:**
  - components/who-slider.css (1 use - inactive dot)
  - components/presentation/ReaderNav.css (2 uses)
  - a11y/plain-mode/components.css (3 uses - borders)
  - a11y/components/side-tabs.css (1 use - border)
  - themes/* (9 a11y themes)

### --color-Text-400
- **Usage:** 13 occurrences
- **Purposes:** Muted text, nav expandable states
- **Key Files:**
  - components/nav/GlassNav-expandable.css (1 use)
  - pages/cart.css (1 use)
  - base/utilities.css (2 uses - skeleton loading, low contrast)
  - a11y/visual/text-only.css (1 use)
  - a11y/motion/reduced-motion.css (1 use)
  - themes/* (9 a11y themes - 1 missing definition)

### --color-Text-500
- **Usage:** 41 occurrences
- **Purposes:** Muted text, nav colors, legal page text, asset page text
- **Key Files:**
  - components/nav/GlassNav-*.css (4 uses)
  - components/nav/GlassNav-expandable.css (1 use)
  - components/presentation/ReaderNav.css (1 use)
  - pages/* (8 uses - assets, legal, cart)
  - global.css (2 uses)
  - a11y/components/accessibility-panel.css (2 uses)
  - base/utilities.css (1 use - .text-muted)
  - themes/* (9 a11y themes)

### --color-Text-600
- **Usage:** 50 occurrences
- **Purposes:** Body text, headings, descriptions, nav hamburger, asset details
- **Key Files:**
  - pages/* (15+ uses - asset detail, cart, projects, philosophy)
  - components/* (8 uses - values, philosophy, nav, hero-morph)
  - global.css (6 uses - headings, paragraphs)
  - a11y/* (5+ uses)
  - themes/* (9 a11y themes)

### --color-Text-700
- **Usage:** 87 occurrences (🔥 CORE DESIGN TOKEN)
- **Purposes:** Primary body text, headings, article content, forms
- **Key Files:**
  - pages/* (30+ uses - asset detail, services, legal, assets, projects)
  - components/* (15+ uses - values, philosophy, hero-section, hero-morph)
  - global.css (5 uses - main body text, headings)
  - buttons/basic-button.css (2 uses - neumorphic, ghost buttons)
  - a11y/* (15+ uses - plain mode, accessibility panel, masonry)
  - themes/* (9 a11y themes)

### --color-Text-800
- **Usage:** 13 occurrences
- **Purposes:** Dark text, cart headings, masonry grid, announcement ticker
- **Key Files:**
  - pages/cart.css (4 uses)
  - components/announcement-ticker.css (1 use)
  - base/utilities.css (2 uses - borders, skeleton)
  - a11y/components/masonry-grid.css (4 uses)
  - themes/* (9 a11y themes - 1 missing definition)

### --color-Text-900
- **Usage:** 56 occurrences
- **Purposes:** Darkest text, headers, overlays, tabs, borders
- **Key Files:**
  - components/hero-section.css (10 uses - overlays, headings)
  - components/presentation/Reader*.css (5 uses)
  - components/toast.css (2 uses)
  - base/utilities.css (3 uses)
  - a11y/* (20+ uses - panels, glass nav, masonry, tabs, plain mode)
  - tokens/gradients.css (3 uses - dark gradients)
  - themes/* (9 a11y themes)

### --color-Text-950
- **Usage:** 10 occurrences
- **Purposes:** Extreme dark text (only in theme definitions)
- **Key Files:**
  - themes/brand/BrandDefault.css (definition)
  - themes/* (9 a11y theme overrides)

### ⚠️ --color-Text-100
- **Usage:** NOT DEFINED in BrandDefault.css but used in a11y files
- **Issue:** Missing definition causes fallback
- **Recommendation:** Add Text-100 to complete scale

---

## NEUTRAL COLORS (50-900)

### --color-Neutral-50
- **Usage:** 13 occurrences
- **Purposes:** Neutral backgrounds, utility classes
- **Key Files:**
  - global.css (1 use)
  - pages/legal.css (1 use)
  - base/utilities.css (1 use)
  - themes/brand/BrandDefault.css (definition)
  - themes/* (9 a11y themes)

### --color-Neutral-100
- **Usage:** 14 occurrences
- **Purposes:** Neutral surfaces, cart items, legal page
- **Key Files:**
  - pages/cart.css (2 uses)
  - pages/legal.css (1 use)
  - tokens/gradients.css (1 use)
  - themes/brand/BrandDefault.css (definition)
  - themes/* (9 a11y themes)

### --color-Neutral-200
- **Usage:** 31 occurrences
- **Purposes:** Borders, dividers throughout the site
- **Key Files:**
  - components/* (8 uses - cookie banner, who-slider, announcement ticker, philosophy cards, values, galleries, presentation nav)
  - pages/* (7 uses - legal, cart, assets)
  - global.css (1 use - borders)
  - tokens/gradients.css (4 uses)
  - themes/* (9 a11y themes)

### --color-Neutral-300
- **Usage:** 21 occurrences
- **Purposes:** Borders, cart items, galleries, gradients
- **Key Files:**
  - pages/cart.css (1 use)
  - pages/assets.css (3 uses - borders)
  - components/* (3 uses - galleries, product gallery)
  - pages/asset-detail.css (1 use)
  - tokens/gradients.css (2 uses)
  - a11y/components/masonry-grid.css (2 uses)
  - themes/* (9 a11y themes)

### --color-Neutral-400 through 700
- **Usage:** 9-11 occurrences each (theme definitions only)
- **Purposes:** ⚠️ NOT actively used in components/pages, only defined in themes
- **Recommendation:** Consider removing if never used outside theme definitions

### --color-Neutral-800
- **Usage:** 15 occurrences
- **Purposes:** Utility borders, toast backgrounds
- **Key Files:**
  - components/toast.css (1 use - dark toast background)
  - base/utilities.css (3 uses - utility borders)
  - themes/brand/BrandDefault.css (definition)
  - themes/* (9 a11y themes)

### --color-Neutral-900
- **Usage:** 15 occurrences
- **Purposes:** Announcement ticker dark variant, toast borders, utility classes
- **Key Files:**
  - components/announcement-ticker.css (1 use)
  - components/toast.css (1 use)
  - base/utilities.css (3 uses)
  - themes/brand/BrandDefault.css (definition)
  - themes/* (9 a11y themes)

---

## ACCENT COLORS

### AccentOne (100-800) - Warm Brown Tones
- **Usage:** ~250 occurrences across all shades (🔥 HEAVILY USED)
- **Purposes:** Gradients (majority), confetti, announcement ticker, buttons, asset detail highlights, dropdown tokens, utility classes
- **Key Files:**
  - tokens/gradients.css (180+ uses - extensive gradient system)
  - buttons/* (15 uses - dropdown tokens, basic buttons)
  - pages/asset-detail.css (4 uses - highlights, info boxes)
  - components/announcement-ticker.css (1 use)
  - design/confetti.css (1 use - pink confetti)
  - base/utilities.css (5 uses - .text-accent, .bg-accent, warning states)
  - themes/* (40 uses - 8 shades × 5 a11y themes)

### AccentTwo (100-800) - Blue/Cool Tones
- **Usage:** ~250 occurrences across all shades (🔥 HEAVILY USED)
- **Purposes:** Gradients (majority), confetti, buttons, dropdown tokens
- **Key Files:**
  - tokens/gradients.css (180+ uses)
  - buttons/* (13 uses)
  - design/confetti.css (1 use - blue confetti)
  - pages/asset-detail.css (1 use)
  - themes/* (40 uses)

### AccentThree (100-800) - Rose/Mauve Tones
- **Usage:** ~200 occurrences across all shades (🔥 HEAVILY USED)
- **Purposes:** Gradients (majority), confetti, buttons, dropdown tokens
- **Key Files:**
  - tokens/gradients.css (150+ uses)
  - buttons/* (13 uses)
  - design/confetti.css (1 use - green confetti)
  - themes/* (40 uses)

### AccentFour (100-800) - Slate/Dark Blue
- **Usage:** ~200 occurrences across all shades (🔥 HEAVILY USED)
- **Purposes:** Gradients (majority), rainbow effects, buttons, dropdown tokens
- **Key Files:**
  - tokens/gradients.css (150+ uses)
  - buttons/* (13 uses)
  - themes/* (40 uses)

### AccentFive (100-800) - Purple/Violet Tones
- **Usage:** ~200 occurrences across all shades (🔥 HEAVILY USED)
- **Purposes:** Gradients (majority), confetti, buttons, dropdown tokens
- **Key Files:**
  - tokens/gradients.css (150+ uses)
  - buttons/* (13 uses)
  - design/confetti.css (1 use - purple confetti)
  - themes/* (40 uses)

### ⚠️ --color-Accent-500/600 (non-standard)
- **Usage:** 3 occurrences
- **Purposes:** Toast styling, product/isotope galleries
- **Key Files:**
  - components/toast.css (1 use)
  - components/product-gallery.css (1 use)
  - components/isotope-gallery.css (1 use)
- **Issue:** These appear to be TYPOS - should likely be AccentOne-500/600
- **Fix:** Replace with `--color-AccentOne-500` and `--color-AccentOne-600`

---

## STATUS COLORS

### --color-Success
- **Usage:** 8 occurrences
- **Purposes:** Utility success states, semantic tokens, gradients
- **Key Files:**
  - base/utilities.css (6 uses - success states, borders)
  - tokens/gradients.css (1 use - gradient definition)
  - a11y/base/semantic-tokens.css (1 use - --success variable)

### --color-Warning
- **Usage:** 8 occurrences
- **Purposes:** Warning states, legal page warnings, gradients
- **Key Files:**
  - base/utilities.css (6 uses - warning states)
  - pages/legal.css (3 uses - warning box)
  - tokens/gradients.css (1 use)
  - a11y/base/semantic-tokens.css (1 use)

### --color-Error
- **Usage:** 20 occurrences
- **Purposes:** Error states, validation, forms
- **Key Files:**
  - base/utilities.css (17 uses - error states, borders, focus, validation)
  - global.css (1 use)
  - tokens/gradients.css (1 use)
  - a11y/base/semantic-tokens.css (1 use)

### --color-Info
- **Usage:** 5 occurrences
- **Purposes:** Info states, focus rings
- **Key Files:**
  - base/utilities.css (4 uses - info states)
  - a11y/base/semantic-tokens.css (1 use - focus ring)

### --color-Danger
- **Usage:** 3 occurrences
- **Purposes:** Danger states, semantic tokens, gradients
- **Key Files:**
  - global.css (1 use)
  - tokens/gradients.css (1 use - error gradient)
  - a11y/base/semantic-tokens.css (1 use)
- **Issue:** Naming conflict with --color-Error
- **Recommendation:** Consolidate - pick either Error or Danger

---

## BASE COLORS

### --color-White
- **Usage:** 77 occurrences (🔥 HEAVILY USED)
- **Purposes:** Button text, white text overlays, hero text, neumorphic shadows, presentation reader backgrounds, glass effects
- **Key Files:**
  - buttons/basic-button.css (22 uses - button text for all colored buttons, neumorphic shadows)
  - components/hero-section.css (8 uses - white text overlays)
  - components/announcement-ticker.css (4 uses - text colors)
  - components/presentation/Reader*.css (25+ uses - backgrounds, overlays, borders, text)
  - components/nav/* (3 uses - glass effects)
  - base/utilities.css (4 uses - status button text)
  - design/GlowTokens.css (2 uses - button text)
  - a11y/* (8 uses - plain mode, theme overrides)
  - themes/* (5 a11y themes with --btn-filled-text)

### --color-Black
- **Usage:** 11 occurrences
- **Purposes:** Hero section shadows, presentation reader overlays, accessibility panel shadows
- **Key Files:**
  - components/hero-section.css (1 use - text shadow)
  - components/presentation/Reader*.css (5 uses - dark overlays, backgrounds)
  - components/nav/GlassNav-base.css (1 use - shadow)
  - a11y/components/accessibility-panel.css (1 use - shadow)
  - tokens/status.css (definition)

---

## KEY FINDINGS

### 🔥 CORE DESIGN TOKENS (Most Critical - Keep Forever)

1. **--color-Primary-500** (191 uses) - PRIMARY BRAND COLOR
2. **--color-Background-50** (110 uses) - MAIN PAGE BACKGROUND
3. **--color-Primary-600** (96 uses) - PRIMARY DARK VARIANT
4. **--color-Primary-100** (98 uses) - PRIMARY LIGHT VARIANT
5. **--color-Background-100** (87 uses) - SURFACE COLOR
6. **--color-Primary-400** (87 uses) - PRIMARY MID VARIANT
7. **--color-Text-700** (87 uses) - BODY TEXT
8. **--color-White** (77 uses) - WHITE TEXT/BACKGROUNDS

### 🔥 HEAVILY USED TOKEN FAMILIES

- **Primary colors**: All shades 100-800 are heavily used (50-191 uses each)
- **Background colors**: Shades 50-300 are core to the design (65-110 uses each)
- **Text colors**: 500-900 are primary text hierarchy (41-87 uses each)
- **All Accent families**: Primarily used in gradient system (150-180 uses per family in gradients alone)

### ⚠️ RARELY/NEVER USED TOKENS (Candidates for Removal)

#### Low Usage (Under 15 uses, mostly theme definitions):

- **--color-Primary-50** (10 uses - mostly gradients, duplicate of Primary-100)
- **--color-Background-400** (14 uses)
- **--color-Background-500** (10 uses - gradients only)
- **--color-Text-50** (21 uses - but 9 are theme definitions)
- **--color-Text-200** (4 uses)
- **--color-Text-950** (10 uses - theme definitions only)
- **--color-Neutral-50 through 700** (9-31 uses, mostly theme definitions - **Neutral-400 through 700 never used in actual components**)
- **--color-Secondary-300** (12 uses)

#### Status Colors (Limited specialized use):

All status colors are used but in focused contexts (3-20 uses each) - Keep for semantic meaning

---

## USAGE PATTERNS

### 1. Gradient System Dominance
The five Accent color families (AccentOne through AccentFive) are used almost exclusively in `tokens/gradients.css` for creating an extensive gradient system. They have minimal direct usage in components.

### 2. A11y Theme Impact
All color families have 6-9 additional "uses" that are just theme override definitions in accessibility themes, not actual usage.

### 3. Primary Color Supremacy
Primary-500 is the most-used single token (191 occurrences), appearing in almost every major component category.

### 4. Background Hierarchy
Background-50 through Background-300 form the core surface system used throughout the site.

### 5. Text Color Strategy
Text-700 is the primary body text color, with Text-500/600 for muted text and Text-800/900 for emphasis.

---

## 🐛 ISSUES FOUND

### CRITICAL Issues (Fix Immediately):

1. **Missing --color-Secondary-900** - Referenced by 7 a11y themes but not defined
   - Add to BrandDefault.css: `--color-Secondary-900: #5a3420;`

2. **Typo: --color-Accent-500/600** - Should be AccentOne-500/600
   - Fix in toast.css, product-gallery.css, isotope-gallery.css

3. **Missing --color-Text-100** - Used in a11y files but not defined
   - Add to BrandDefault.css for complete scale

4. **Duplicate Primary-50 = Primary-100** - Both `#f4fbf2`
   - Remove Primary-50, use Primary-100 instead

### HIGH Priority Issues:

5. **Error vs Danger naming conflict** - Pick one and consolidate
6. **Missing Background-600 through 900** - Needed for dark mode
7. **Neutral-400 through 700 unused** - Only in theme definitions, never in components

---

## RECOMMENDATIONS

### ✅ Keep (Essential):

- All Primary shades 100-800
- All Background shades 50-300
- All Text shades 500-900 (add Text-100)
- White and Black
- All five Accent families (for gradient system)
- All Status colors (Success, Warning, Error/Danger, Info)
- Neutral-50, 100, 200, 300, 800, 900

### ❌ Consider Removing (Low Usage):

- Primary-50 (duplicate of Primary-100)
- Primary-900 (only in dark gradients - 46 uses)
- Background-400 and 500 (low usage)
- Text-50, 200, 950 (minimal use)
- **Neutral-400 through 700** (never used outside theme definitions)
- Secondary-100, 200, 300 (minimal use - under 33 uses each)

### 🔧 Fix Required:

1. Add missing tokens:
   - `--color-Secondary-900: #5a3420;`
   - `--color-Text-100: #e8e8e8;` (interpolated value)
   - Background-600 through 900 for dark mode

2. Fix typos:
   - Replace `--color-Accent-500/600` with `--color-AccentOne-500/600`

3. Consolidate naming:
   - Pick either `--color-Error` OR `--color-Danger` (recommend Error)

4. Remove duplicates:
   - Remove `--color-Primary-50` (use Primary-100)

---

## TOKEN HEALTH SCORE: 6.8/10

**Breakdown:**
- ✅ **Coverage**: Excellent (9/10) - comprehensive token system
- ⚠️ **Duplicate Prevention**: Poor (4/10) - Primary-50/100 duplicate, Accent typos
- ❌ **Scale Consistency**: Fail (3/10) - Missing Secondary-900, Text-100, Background-600-900
- ⚠️ **Usage Efficiency**: Fair (6/10) - Many tokens with low/no usage
- ✅ **Organization**: Good (8/10) - Well-organized into families

**Path to 9/10:**
- Fix all missing token definitions
- Remove duplicate Primary-50
- Fix Accent typos
- Remove Neutral-400 through 700 (unused)
- Add Background-600 through 900

---

_End of Report_
