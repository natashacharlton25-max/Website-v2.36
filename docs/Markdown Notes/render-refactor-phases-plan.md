# Render Architecture Refactor — Phases Plan

Generated from audit report: 2026-02-26
Components: 56 scanned, 84 CSS files requiring processing

## Governing Invariant

> If no animation class is emitted, no animation can occur.
> One key deletion → entire tree goes static.

Every phase exists to make this invariant true across the entire codebase.


## Current State (From Audit)

| Metric | Count | Notes |
|---|---|---|
| Total components | 56 | |
| Scoped styles in .astro (unsplit) | 52 files | Black boxes — can't audit until extracted |
| Separate a11y.css files | 37 | Dead pattern, all need processing (includes ~20 recovery duplicates) |
| Ambient transitions in base CSS | 23 | Violate the invariant |
| #a11y-content-wrapper refs | 25 | Dead code |
| !important declarations | 18 components + 3 global files | Dead code |
| @layer declarations | 8 layer names across 63+ files | Dead code |
| Schemas with flat props | 22 | Need content/visual/animation split |
| Missing schema entirely | 34 | Need creating |
| Missing index.ts | 34 | Need creating |
| Missing separated CSS | 16 | Need creating |
| Missing responsive CSS | 24 | Need creating |
| Use raw HTML instead of atoms | 36 | Need replacing |
| JS animation scripts | 30 | Need data-attr binding audit |
| Content/visual/animation split | 0 | None exist yet |


## Target State (Every Component)

```
ComponentName/
  ComponentName.astro       ← pure component, no render mode detection
  ComponentName.css         ← base styles, no ambient motion
  ComponentName.responsive.css  ← breakpoint overrides
  ComponentName.schema.json ← content/visual/animation groups + renders field
  index.ts                  ← exports component + schema, no a11y import
```

No a11y.css. No scoped styles. No @layer. No !important. No #a11y-content-wrapper.
Empty files are valid — `animation: {}` in schema means nothing to strip.

**Recovery files (*.a11y.recovery.css):**
These contain the ORIGINAL styling decisions for how each component renders across full, reduced motion, and text-only modes — three weeks of design work. They are reference material, NOT duplicates.
- Read during Phase 5 (schema creation) to extract render mode intent
- Read during Phase 6 (CSS motion gating) to understand which transitions were intended
- After extraction, move originals to `_reference/` — NEVER delete


## Phase Overview

```
Phase 0: CSS extraction (52 unsplit files)
Phase 1: Dead code sweep (all files)
Phase 2: Global CSS extraction (highlight-links + dark theme → 2 global files)
Phase 3: a11y.css deletion (32 files)
Phase 4: @layer removal + index.ts cleanup
Phase 5: Schema creation + split (56 components)
Phase 6: CSS motion gating (19+ components)
Phase 7: Atom replacement (36 components)
Phase 8: JS animation binding audit (30 components)
Phase 9: Astro purity pass (all components)
Phase 10: Wire up data-render + global CSS imports
Phase 11: Verification (run compatibility audit on all 56)
```


## Phase 0: CSS Extraction

**Goal:** Get all styles out of `<style>` tags and into separate .css files so the rest of the pipeline can see them.

**Scope:** 52 .astro files with scoped styles.

**Batches:**

| Batch | Files | Count |
|---|---|---|
| cards/ | AssetCard, AuthorCard, BlogCard, ChoiceCard, CompactToolCard, FlipCard, GlowCard, ImageRevealCard, InfoCard, InsightCard, OfferingCard, ProductCard, ProjectCard, ProjectSpecCard, RainbowBorderCard, SlideCard, SpecCard, StepCard, TeamCard, TestimonialCard, WhyCard | 21 |
| sections/ | CalloutSection, CompareSection, EndSection, FullWidthSection, GallerySection, PresentationImageTextSection, ServiceDetails, StatsSection, StorySection, QuoteSection, TextSection | 11 |
| a11y/ | A11yNavigationSection, AccessibilityPanel, FontCard, ToggleCard, PresetsSidebar, ThemeSidebar, TypographyAdjustmentsSection, TypographySection, VisualSection | 9 |
| grids/ | ForYouGrid, MasonryGrid, ProjectSpecGrid, RelatedGrid, SpecGrid | 5 |
| nav/ | Breadcrumbs, SideTabs, LegalNav | 3 |
| singles | LottieIcon, ShareMenu, ContactPopup, InsightContent, InsightHeader, ProductInfo, TimelineStepper, SectionTitle, PresentationEndSection | 9 |

**Per file:**
1. Cut everything inside `<style>...</style>` from the .astro file
2. Create `ComponentName.css` with the extracted rules
3. Remove `:global()` wrappers if present (CSS is no longer scoped)
4. Remove the `<style>` tag from the .astro file
5. Create empty `ComponentName.responsive.css` if none exists

**Verification:** Component renders identically before and after extraction. CSS import path updated.

**Does not change:** No refactoring of the CSS content itself. Just moving it. Dead code, ambient transitions, everything stays as-is until later phases.

**Known issue:** `Hero Section/` and `sections/HeroSection` appear to be duplicates. Resolve before processing — keep one, delete the other.

**Claude Code prompt:**
> For each .astro file in this batch, extract the contents of any `<style>` tags into a separate ComponentName.css file in the same directory. Remove `:global()` wrappers from the extracted CSS. Delete the `<style>` tag from the .astro file. Create an empty ComponentName.responsive.css if one doesn't exist. Do not modify the CSS content itself — just move it. Report what you extracted per file.


## Phase 1: Dead Code Sweep

**Goal:** Delete all dead patterns across all files. This is mechanical — no judgement calls.

**Scope:** All 56 component directories + global styles.

**Delete from CSS files:**
- All `#a11y-content-wrapper` selectors and their rule blocks (18 components + global files)
- All `!important` declarations (6 components + 13 global files — 328 in Card.a11y.css alone)
- All `.a11y-reduce-motion` class selectors and their rule blocks
- All `.a11y-text-only` class selectors and their rule blocks
- All `.a11y-highlight-links` class selectors and their rule blocks
- All `.a11y-high-contrast` class selectors and their rule blocks
- All `.a11y-theme-*` class selectors (`.a11y-theme-dark`, `.a11y-theme-cream`, `.a11y-theme-monochrome`)
- All `.a11y-cvd-*` class selectors (`.a11y-cvd-protanopia`, `.a11y-cvd-deuteranopia`, `.a11y-cvd-tritanopia`)
- All `.plain` class selectors

**Delete from .astro files:**
- All `#a11y-content-wrapper` references in JS
- All `classList.contains('a11y-` checks
- All `document.querySelector` targeting a11y elements

**Hotspots (highest dead code density):**
| Component | Wrapper Refs | !important | Priority |
|---|---|---|---|
| Card | 171 | 328 | Highest — entire a11y.css is dead |
| sections/ | 24 | 0 | High |
| cards/ | 23 | 0 | High |
| grids/ | 15 | 0 | High |
| RadialMenu | 15 | 0 | Medium |
| DPadMenu | 11 | 0 | Medium |
| ImageOverlay | 0 | 21 | Medium |

**Global styles dead code:**
| File | Wrapper Refs | !important | Action |
|---|---|---|---|
| a11y-panel.css | 3 | 131 | Heavy cleanup |
| cart-icon.css | 30 | 15 | Heavy cleanup |
| global.css | 0 | 11 | Remove @layer a11y blocks |
| who-slider.css | 0 | 11 | Remove !important |
| utilities.css | 0 | 19 | Review — some may be intentional utility overrides |
| cta-section.css | 0 | 4 | Remove !important |
| editorial-layout.css | 0 | 5 | Remove !important |
| philosophy-flip-cards.css | 4 | 2 | Remove wrapper refs + !important |
| pattern-motion.css | 0 | 2 | Remove !important |

**Note on utilities.css:** 19 `!important` in a utilities file may be intentional (utility classes often use !important by design, like Tailwind). Flag for human review before deleting.

**Verification:** Site still renders. No visual changes — we're only removing code that was already inactive.

**Claude Code prompt:**
> In this batch of files, delete all CSS rule blocks that contain `#a11y-content-wrapper` selectors, `.a11y-reduce-motion` selectors, `.a11y-text-only` selectors, `.a11y-highlight-links` selectors, `.a11y-high-contrast` selectors, `.a11y-theme-*` selectors, `.a11y-cvd-*` selectors, and `.plain` selectors. Remove all `!important` declarations. In .astro files, remove JS references to `#a11y-content-wrapper` and `classList.contains('a11y-')`. Do NOT delete `utilities.css` !important — flag those for review. Report count of deletions per file.


## Phase 2: Global CSS Extraction

**Goal:** Create two global CSS files from rules currently scattered across atom a11y.css files.

**Before this phase:** Phase 1 has removed all dead selectors. What remains in a11y.css files should only be highlight-links rules and dark theme rules that are still needed.

**Files to extract FROM (a11y.css files with highlight-links rules):**
- Button/Button.a11y.css
- FormField/FormField.a11y.css
- Heading/Heading.a11y.css
- Link/Link.a11y.css
- ContactInfo/ContactInfo.a11y.css
- Footer/Footer.a11y.css
- ContactForm/ContactForm.a11y.css

**Create: `highlight-links.css`**
- Static visual marks (outlines, underlines) apply in all renders
- Hover responses gated behind `[data-render="full"]`
- No transitions in this file ever
- Targets atoms only (Button, Link, FormField, Heading, Text)
- Loaded when `highlightLinks: true` in site config

**Create: `theme-luminance-dark.css`**
- Dark zone adjustments (~100 lines)
- Responds to `--theme-luminance: dark` zone token
- No class selectors — token-driven only
- Targets atoms (atoms handle themselves, molecules/organisms inherit)
- Loaded when zone has `--theme-luminance: dark`

**Extract FROM (a11y.css files with dark theme rules):**
- Card/Card.a11y.css (`.a11y-themes` layer — the only component with this)
- Badge/Badge.css (2 dark theme selectors with TODO noted)
- Any other components with dark theme rules found after Phase 0 extraction

**Verification:** Highlight-links visual behaviour preserved. Dark theme behaviour preserved. Rules now in two global files instead of scattered across 7+ component a11y files.

**Claude Code prompt:**
> From the listed a11y.css files, extract all rules related to highlight-links (link outlines, underlines, focus indicators for interactive elements) into a new global file `highlight-links.css`. Extract all dark theme rules into `theme-luminance-dark.css`. In highlight-links.css, gate hover responses behind `[data-render="full"]` selector. In theme-luminance-dark.css, replace `.a11y-theme-dark` class selectors with selectors that respond to `--theme-luminance: dark` token. Do not include any transitions in highlight-links.css.


## Phase 3: a11y.css Deletion

**Goal:** Delete all 32 component a11y.css files. They should be empty after Phases 1-2.

**Scope:** Every `*.a11y.css` file across all 56 component directories.

**Pre-check:** Verify each file is empty or contains only comments/whitespace after Phases 1-2 extraction. If any file still has rules, those rules were missed in Phase 1 or 2 — do not delete, flag for review.

**Files (32):**
PresetButton, Stepper, DrawSVGIcon, ScrollDrawIcon, PagePatternLayer, ParallaxDecor, PatternOverlay, ScrollColorBackground, FormField, Grid, Image, Button, Card, Heading, Link, List, DPadMenu, RadialMenu, Text, Toast, ContactInfo, ConnectorTimeline, LiquidRevealZone, ImageOverlay, Footer, IconScrollStage, ScrollMorphZone, ContactForm, HeroSection, plus any uncovered by Phase 0 extraction.

**Also delete from global styles:**
- `themes/a11y/a11y-cream.css`
- `themes/a11y/a11y-dark.css` (replaced by theme-luminance-dark.css)
- `themes/a11y/a11y-deuteranopia.css`
- `themes/a11y/a11y-high-contrast.css`
- `themes/a11y/a11y-monochrome.css`
- `themes/a11y/a11y-protanopia.css`
- `themes/a11y/a11y-tritanopia.css`

**Note:** These theme files set `--theme-luminance` but are part of the old class-toggle system. The new system uses zone tokens. If any `--theme-luminance` values from these files need preserving, move them to the token system first.

**Verification:** No a11y.css files remain. No imports referencing them.


## Phase 4: @layer Removal + Index Cleanup

**Goal:** Remove all `@layer` wrappers from CSS files. Remove a11y.css imports from index.ts files.

**@layer removal scope:** 8 layer names across 58+ files.

| Layer | Files | Action |
|---|---|---|
| `@layer components` | 58 files (all component .css and .responsive.css) | Remove wrapper, keep rules |
| `@layer a11y.reduce-motion` | 27 files | Should be empty after Phase 1, delete remnants |
| `@layer a11y` | 30 files | Should be empty after Phase 1, delete remnants |
| `@layer a11y.text-only` | 22 files | Should be empty after Phase 1, delete remnants |
| `@layer a11y.high-contrast` | 7 files | Should be empty after Phase 1, delete remnants |
| `@layer a11y.highlight-links` | 7 files | Should be empty after Phase 2, delete remnants |
| `@layer a11y.focus` | 2 files (PresetButton, Stepper) | Review — panel components, may have live rules |
| `@layer a11y.themes` | 1 file (Card) | Should be empty after Phase 2, delete remnants |

**Index.ts cleanup:** Remove `import './ComponentName.a11y.css'` from all index.ts files that have it.

**Global CSS:** Remove `@layer a11y.reduce-motion` and `@layer a11y` blocks from `global.css`. Remove `@layer components` from `pattern-motion.css`, `who-slider.css`, `a11y-panel.css`.

**Claude Code prompt:**
> In every .css file, remove `@layer` wrapper declarations — keep the CSS rules inside them, just remove the `@layer name { }` wrapping. In every index.ts file, remove any import lines referencing a11y.css files. Report which files were modified.


## Phase 5: Schema Creation + Split

**Goal:** Every component has a schema.json with content/visual/animation groups and a renders field.

**Components with existing flat schemas (22) — need splitting:**
Announcer, PresetButton, Stepper, RevealCanvas, DrawSVGIcon, ScrollDrawIcon, PagePatternLayer, ParallaxDecor, PatternOverlay, PhysicsOverlay, ScrollColorBackground, FormField, Grid, Image, Badge, Button, Card, Heading, Link, List, Text, Toast, ImageOverlay

**Components missing schemas entirely (34) — need creating:**
All cards/, sections/, grids/, nav/, a11y/, contact/, global/, shop/, checkout/, insights/, product/, search/, presentation/, switcher/, timeline/, DPadMenu, RadialMenu, ShareMenu, ConnectorTimeline, LiquidReveal, Footer, IconScrollStage, ScrollMorph, CustomScrollbar, Typography, Insights, icons/

**Schema template:**
```json
{
  "component": "ComponentName",
  "category": "atoms/ui | molecules/cards | organisms/sections | ...",
  "renders": {
    "full": "ComponentName.astro",
    "reduced": "ComponentName.astro",
    "textonly": null
  },
  "content": {},
  "visual": {},
  "animation": {}
}
```

**Classification rules:**
- `content` = what it IS and DOES — text, href, type, disabled, aria labels, data values
- `visual` = how it LOOKS statically — variant, size, shape, colour, icon name, layout
- `animation` = all MOTION — hover effects, transitions, scroll triggers, particle effects, morph targets, draw styles, confetti, lottie

**renders field rules:**
- `textonly: null` = don't render component, extract text content (decorative/effect components)
- `textonly: "ComponentName.astro"` = render simplified (UI atoms like Badge keep shape, hide icon)
- `textonly: "dl"` or `"list"` = render as different element (SpecCard → definition list)

**Components where textonly should be null (decorative/effect):**
RevealCanvas, PagePatternLayer, ParallaxDecor, PatternOverlay, PhysicsOverlay, ScrollColorBackground, DrawSVGIcon, ScrollDrawIcon, LiquidRevealZone, IconScrollStage, ScrollMorphZone, ImageOverlay, CustomScrollbar

**Button schema reference (already designed):**
```json
{
  "content": { "label": "", "href": "", "type": "button", "disabled": false, "dropdownItems": [] },
  "visual": { "variant": "primary", "shape": "rounded", "size": "md", "icon": "", "iconPosition": "left" },
  "animation": { "hover": "", "effect": "", "confetti": "", "dropdownAnimate": false, "iconDraw": "", "lottieIcon": "" }
}
```

**Prop passthrough tracking — schemas must document which animation props pass to child atoms:**
```
Button → Icon: morphTo, morphColor, draw, drawColor (from Button's animation block)
Button → LottieIcon: src, loop (from Button's animation block)
```

This ensures reduced mode strips at the top and nothing leaks through.

**This phase is the largest.** 56 schemas to create or split. Each one requires reading the component's .astro file to understand its props. This is where Claude Code workers could run in parallel — one per component batch.

**Claude Code prompt:**
> For each component in this batch, read the .astro file to identify all props. Classify each prop as content, visual, or animation using these rules: content = data/text/href/aria/disabled; visual = variant/size/shape/colour/icon name/layout; animation = hover/effect/transition/scroll/particle/morph/draw/confetti/lottie/speed. Create or update the .schema.json with the three groups plus a renders field. Set textonly to null for decorative/effect components. Report the prop classification per component.


## Phase 6: CSS Motion Gating

**Goal:** Move all transitions and animations in base CSS behind modifier classes. After this phase, no component has ambient motion.

**Scope:** 19 components flagged with ambient transitions, plus any uncovered by Phase 0.

**The pattern (from Button reference implementation):**
```css
/* BEFORE — ambient transition on base selector */
.btn {
  transition: all var(--transition-fast);
}
.btn:hover {
  transform: translateY(-1px);
}

/* AFTER — colour change in base, motion behind modifier */
.btn:hover {
  background-color: var(--_btn-brand-dark);
}
.btn--hover-lift {
  transition: all var(--transition-fast);
}
.btn--hover-lift:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
```

No animation prop → no `--hover-lift` class → no transition exists → static button.

**Components to refactor (from audit ambient motion section):**

| Component | Ambient Transitions | Notes |
|---|---|---|
| Button/Button.css | 5 transitions, 4 transforms | Reference impl exists |
| Card/Card.css | 1 transition on `.card` | |
| FormField/FormField.css | 6 transitions (input, checkbox, radio, toggle, select) | DECIDED: gate all behind modifier class |
| Image/Image.css | 1 transition via `--img-transition` custom prop | |
| Link/Link.css | 1 transition on `.link` | |
| Toast/Toast.css | 1 base transition, 5 animation classes | Animation classes already use modifier-style naming |
| DPadMenu/DPadMenu.style.css | 3 transitions | |
| RadialMenu/RadialMenu.style.css | 4 transitions, 1 transform | |
| Heading/Heading.a11y.css | 1 transition (should be dead after Phase 1) | |
| ImageOverlay | transitions (should be dead after Phase 1) | |
| contact/ContactForm | transitions | |
| sections/HeroSection | transitions | |

**FormField decision (RESOLVED):**
All FormField transitions gate behind `.form-field--animate-focus` modifier class. State changes remain in base CSS — border still changes colour on focus, toggle still moves position — but instantly, without transition. Users who set reduced motion find motion disorienting; a 200ms fade between border colours is motion. Removing transitions doesn't break feedback — the state change is still visible, just instant. This meets WCAG focus indicator requirements without the motion.

```css
/* Base — state changes, no motion */
.form-field__input:focus {
  border-color: var(--_field-focus-color);
  box-shadow: 0 0 0 2px var(--_field-focus-ring);
}

/* Gated — smooth transition, opt-in */
.form-field--animate-focus .form-field__input {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-field--animate-focus .form-field__checkmark {
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.form-field--animate-focus .form-field__toggle-track {
  transition: background-color 0.2s ease;
}

.form-field--animate-focus .form-field__toggle-thumb {
  transition: transform 0.2s ease;
}

.form-field--animate-focus .form-select {
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
```

Schema declares: `"animation": { "animateFocus": true }` → adds `.form-field--animate-focus` class.
No animation prop → no class → instant state changes → fully accessible.

**Naming convention:**
Modifier classes use `--` separator: `.component--modifier-name`
Animation classes follow: `.btn--hover-lift`, `.card--hover-raise`, `.toast--slide`, `.toast--bounce`

**Toast already partially correct:** `.toast-slide-animation`, `.toast-fade-animation` etc. are already opt-in classes. They just need renaming from `-` to `--` for convention consistency: `.toast--slide-animation`.

**Claude Code prompt:**
> For each component in this batch, move all transition and animation declarations from base selectors into modifier classes using the `--` naming convention. Base selectors keep static hover states only (colour changes, not transforms). Create modifier classes like `.component--hover-lift`, `.component--animate-slide`. The animation prop in the schema maps to the modifier class name. Report what was moved per component.


## Phase 7: Atom Replacement

**Goal:** Replace raw HTML with atom components across 36 components.

**Scope:** Every `<a>`, `<button>`, `<small>`, `<span>`, `<p>`, `<h1>`-`<h6>` that should be an atom.

**Heaviest offenders (from dependency tree):**
| Component | Raw HTML instances | Priority |
|---|---|---|
| sections/HeroSection | 28 (5 buttons, 3 spans, 15 p, 5 h1) | Highest |
| cards/InfoCard | 10 buttons + text/heading | High |
| cards/InsightCard | 6 mixed | High |
| cards/ImageRevealCard | 6 mixed | High |
| sections/WhoSliderSection | 10+ mixed | High |
| sections/EndSection | 8 mixed | High |
| shop/MiniCart | 11 mixed | High |
| DPadMenu | 5 mixed | Medium |
| sections/CTASection | 4 mixed | Medium |

**Atom mapping:**
| Raw HTML | Replace With | Exceptions |
|---|---|---|
| `<a>`, `<a href>` | `<Link>` | Not inside Link.astro |
| `<button>` | `<Button>` | Not inside Button.astro, FormField.astro |
| `<small>`, `<span>`, `<p>` | `<Text>` | Not inside Text.astro, Icon.astro, LottieIcon.astro, FormField.astro |
| `<h1>` through `<h6>` | `<Heading>` | Not inside Heading.astro |

**This phase requires human judgement.** Not every `<span>` should be a `<Text>` atom — some are structural wrappers, icon containers, or layout helpers. Claude Code should flag uncertain cases rather than blindly replacing.

**Claude Code prompt:**
> For each component, find raw HTML tags that should be atom components: `<a>` → Link, `<button>` → Button, `<small>/<span>/<p>` → Text, `<h1>`-`<h6>` → Heading. Replace obvious cases (text content in spans/paragraphs, clickable links, interactive buttons). Flag any `<span>` or `<div>` that appears to be a structural wrapper rather than text content — do NOT replace those. Add the atom import at the top of the .astro file. Report replacements and flags per component.


## Phase 8: JS Animation Binding Audit

**Goal:** Verify all JS animation binds to data attributes and fires only when those attributes are present.

**Scope:** 30 components with `<script>` tags.

**Components with animation libraries:**
| Component | Libraries | Events | Data Attrs |
|---|---|---|---|
| Button | lottie, particle-burst, lib/animation/ | mouseenter, mousemove, mouseleave | data-particle-burst, data-confetti, data-mag-bound, data-spot-bound, data-lottie-icon, data-btn-lottie-bound, data-confetti-bound |
| DrawSVGIcon | gsap | mouseenter, mouseleave | data-animate |
| PatternOverlay | lib/animation/ | — | data-scroll-bg, data-pattern-magnetic, data-scroll-reveal |
| ScrollColorBackground | lib/animation/ | scroll | data-scroll-bg |
| GlowCard | gsap | mouseenter, mouseleave, scroll | — |
| LiquidRevealZone | matter, lib/animation/ | — | — |
| ScrollMorphZone | gsap, lib/animation/ | scroll | — |
| GlassNav | lottie | mouseenter, mouseleave, scroll | data-lottie-icon |
| ReaderNav | gsap, lottie | scroll | — |
| Reader | gsap | scroll | — |
| MasonryGrid | lib/animation/ | scroll | data-scroll-reveal |
| SideTabs | lottie | mouseenter, mouseleave | — |
| PagePatternLayer | lib/animation/ | scroll | — |
| PhysicsOverlay | lib/animation/ | — | — |
| ShareSection | lottie | mouseenter, mouseleave | data-lottie-icon |
| HeroMorphAnimation | lib/animation/ | — | — |
| MiniCart | lottie | — | — |

**Red flags — components with events but no data attributes:**
- GlowCard: gsap + mouseenter/mouseleave/scroll but no data-attr binding
- LiquidRevealZone: matter + lib/animation/ but no data-attr binding
- ReaderNav: gsap + lottie + scroll but no data-attr binding
- Reader: gsap + scroll but no data-attr binding
- PagePatternLayer: lib/animation/ + scroll but no data-attr binding
- PhysicsOverlay: lib/animation/ but no data-attr binding

These may fire unconditionally. Each needs checking: does the JS look for a data attribute or prop before binding, or does it just run?

**The pattern (correct):**
```javascript
// JS checks for data attribute before binding
const el = document.querySelector('[data-confetti]');
if (el) { /* bind animation */ }
```

**The anti-pattern (violates invariant):**
```javascript
// JS binds unconditionally
document.querySelector('.card').addEventListener('mouseenter', animateGlow);
```

**Fix for unconditional binding:**
1. Add a data attribute to the component markup: `data-glow={animation.glow}`
2. JS checks for it: `if (!el.dataset.glow) return;`
3. Astro template only adds the attribute when animation prop is present
4. No animation prop → no data attribute → JS doesn't bind → static

**Claude Code prompt:**
> For each component with a `<script>` tag, check whether animation JS binds conditionally (checks for a data attribute or prop before adding event listeners) or unconditionally (always runs). For unconditional bindings, add a data attribute gate: the .astro template should only add the data attribute when the corresponding animation prop is present, and the JS should check for the attribute before binding. Report: conditional (safe), unconditional (needs fix), or unclear (needs human review).


## Phase 9: Astro Purity Pass

**Goal:** Every .astro component is pure — receives all data via props, does not detect render mode, does not import JSON, does not know brand.

**Checks per component:**
- [ ] Receives data via `Astro.props` only
- [ ] Does not import `.json` files directly
- [ ] Does not check `data-render` attribute
- [ ] Does not check `classList.contains('a11y-')`  (should be gone after Phase 1)
- [ ] Does not read brand tokens in JS
- [ ] Does not read accessibility state in JS
- [ ] Defaults to static when no animation props present
- [ ] Animation classes are added conditionally based on props

**Template pattern (correct):**
```astro
---
const { content, visual, animation } = Astro.props;
const classes = [
  'btn',
  `btn--${visual.variant}`,
  animation?.hover ? `btn--hover-${animation.hover}` : '',
].filter(Boolean).join(' ');
---
<button class={classes}>{content.label}</button>
```

Component doesn't know if it's in full, reduced, or text-only mode. It just renders what it's given. If `animation` is undefined or empty, no animation classes are added, no motion occurs.

**Claude Code prompt:**
> For each component, verify: (1) all data comes from Astro.props, (2) no direct JSON imports, (3) no render mode detection, (4) no brand/accessibility state checking in JS, (5) animation classes are conditionally added based on animation prop presence. Fix violations. Report status per component.


## Phase 10: Wire Up data-render + Global CSS Imports

**Goal:** Connect the render pipeline so `data-render` attribute controls which JSON props reach components.

**Layout-level changes:**
1. Layout template reads render mode from page config
2. Sets `data-render="full|reduced|textonly"` on `<body>`
3. Before passing JSON to components, filters based on render mode:
   - `full` → pass content + visual + animation
   - `reduced` → pass content + visual (strip animation)
   - `textonly` → pass content only (strip visual + animation)
4. Components that should not render in textonly (schema `textonly: null`) are skipped entirely

**Global CSS imports:**
1. `highlight-links.css` loaded when `highlightLinks: true` in site config
2. `theme-luminance-dark.css` loaded when zone has `--theme-luminance: dark`
3. Both files use `[data-render="full"]` gates for any hover responses

**This phase is the integration point.** Everything before this was preparation. This is where the three-group cascade actually starts working.


## Phase 11: Verification

**Goal:** Run the compatibility audit across all 56 components. Every one should pass.

```bash
node audit-compatibility.mjs ./src/components > final-report.md
```

**Expected result:** 0 FAIL, 0 WARN for all 56 components.

**If failures remain:** They indicate a phase was incomplete. The report tells you exactly which rule failed and where.

**Then run the inventory audit again:**
```bash
node audit-inventory.mjs ./src/components ./src/styles > post-refactor-report.md
```

Compare with the pre-refactor report. Every metric should be zero except "Have JS animation" (those are now properly gated, not eliminated).


## Execution Notes

**Parallelisation:** Phases 0, 1, 5, 6, 7 can all run as batched Claude Code workers — one per component group (cards/, sections/, atoms/, etc). They don't depend on each other within the same phase.

**Phase dependencies:**
```
Phase 0 (extract CSS) → must complete before Phase 1
Phase 1 (dead code) → must complete before Phase 2
Phase 2 (global extraction) → must complete before Phase 3
Phase 3 (delete a11y.css) → must complete before Phase 4
Phase 4 (@layer + index) → can run after Phase 3
Phase 5 (schemas) → can start after Phase 0 (needs to read .astro files)
Phase 6 (motion gating) → must run after Phase 1 (needs clean CSS)
Phase 7 (atom replacement) → can start after Phase 0
Phase 8 (JS binding) → can start after Phase 5 (needs schema to know which props are animation)
Phase 9 (purity) → must run after Phases 5-8
Phase 10 (wire up) → must run after Phase 9
Phase 11 (verification) → last
```

**Critical path:** 0 → 1 → 2 → 3 → 4 → (5+6+7+8 parallel) → 9 → 10 → 11

**Decision resolved — FormField:** All transitions gated behind `.form-field--animate-focus` modifier class. State changes (colour, position) remain in base as instant changes. Consistent with all other components, better for accessibility.

**Decision resolved — Hero Section:** Standalone `HeroSection.astro` deleted. Split `HeroSection/` folder (with .astro, .css, .responsive.css, .a11y.css) is the source of truth. Renamed from `Hero Section/` (with space) to `HeroSection/`.
