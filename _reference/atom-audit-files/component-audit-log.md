# Component Audit Log — Post-Atom (Molecules, Organisms, Layouts)

Tracks each non-atom component through the `component-audit-post-atom-checklist.md`.
Prerequisite: All 12 atoms pass 2 clean.

Audit order: bottom-up by dependency — Tier 1 (atoms only) → Tier 2 (Tier 1 deps) → Tier 3 (Tier 2 deps).

**Last updated:** 10 March 2026

---

## Dependency Tiers

### Tier 1 — Only imports atoms (audit first)

**Molecules:**
| Component | Imports | Notes |
|-----------|---------|-------|
| ShareMenu | Button, Icon | |
| DPadMenu | Icon | Has `.a11y.css`, `.style.css` |
| RadialMenu | Icon | Has `.a11y.css`, `.style.css` |
| BlogCard | Card, Badge, Heading, Text, Image (atom), Icon | |
| TeamCard | Card, Heading, Text, Image (atom), Icon | |
| TestimonialCard | Card, Text, Image (atom), Icon | |
| SlideCard | Icon | |
| GlowCard | Icon | **FLAG: imports `node:fs` + `node:path`** — legacy filesystem access |
| MasonryCard | Icon | |
| ProjectSpecCard | Icon | |
| SpecCard | Icon | |
| DownloadSummary | Button | |
| ContactInfo | Card, Icon, Heading, Text, Link | |
| ContactPopup | Icon | |
| InsightHeader | Badge | |
| CartIcon | Icon | |
| AnnouncementTicker | Icon | |
| CookieBanner | Button | |
| BaseSwitcher | (none) | Base for other switchers |
| ProductInfo | Button, Icon | |
| Toast | LottieIcon, Text | Atom-phase audit done (Pass 1) — needs post-atom pass |
| ConnectorTimeline | Icon | Has `.a11y.css`, `.style.css` |
| ImageOverlay | (check) | Has `.a11y.css` — `molecules/media/ImageOverlay/` |
| TimelineStepper | (none) | |
| ChoiceCard | (none) | No imports found |
| FlipCard | (none) | No imports found |
| StepCard | (none) | No imports found |
| WhyCard | (none) | No imports found |
| RainbowBorderCard | (none) | No imports found |
| ImageRevealCard | (none) | No imports found |
| AuthorCard | `astro:assets` Image | **FLAG: uses Astro Image, not Image atom** |
| CompactToolCard | `astro:assets` Image | **FLAG: uses Astro Image, not Image atom** |
| InsightCard | `astro:assets` Image, Badge, Button | **FLAG: uses Astro Image, not Image atom** |
| OfferingCard | `astro:assets` Image, Button | **FLAG: uses Astro Image, not Image atom** |
| ProductCard | `astro:assets` Image, Badge, Button | **FLAG: uses Astro Image, not Image atom** |
| ProjectCard | `astro:assets` Image, Button | **FLAG: uses Astro Image, not Image atom** |

**Effects:**
| Component | Imports | Notes |
|-----------|---------|-------|
| PatternOverlay | Icon | |
| ParallaxDecor | Icon | |
| ScrollDrawIcon | Icon | |
| RevealCanvas | (brand config only) | |
| DrawSVGIcon | (none) | |
| PhysicsOverlay | (none) | Matter.js |
| ScrollColorBackground | (none) | GSAP ScrollTrigger |

**YourView (internal Tier 1):**
| Component | Imports | Notes |
|-----------|---------|-------|
| ToggleCard | Icon | |
| FontCard | (none) | |
| AltTextCard | Icon | |
| PresetButton | Icon | Has `.a11y.css` |
| Stepper | (none) | Has `.a11y.css` |
| Announcer | (none) | aria-live component |
| ThemeSidebar | (none) | |

### Tier 2 — Imports Tier 1 molecules or effects

**Molecules:**
| Component | Non-atom imports | Notes |
|-----------|-----------------|-------|
| AssetCard | **ShareMenu** (molecule), Badge, Heading, Text, Button | |
| InfoCard | **ShareMenu** (molecule), Badge, Heading, Text, Image (atom), Button | |
| BasicFilterSwitcher | **BaseSwitcher** (molecule) | |
| ContentSwitcher | **BaseSwitcher** (molecule) | |
| IsotopeFilterSwitcher | **BaseSwitcher** (molecule) | |

**Effects:**
| Component | Non-atom imports | Notes |
|-----------|-----------------|-------|
| PagePatternLayer | **PatternOverlay** (effect) | |
| LiquidRevealZone | **PhysicsOverlay** + **RevealCanvas** (effects) | Has `.a11y.css`, `.style.css` |

**Organisms:**
| Component | Non-atom imports | Notes |
|-----------|-----------------|-------|
| GlassNav | **CartIcon** (molecule), Icon, LottieIcon | Tooltip consumer, LottieIcon legacy paths |
| MasonryGrid | **MasonryCard** (molecule) | |
| ProjectSpecGrid | **ProjectSpecCard** (molecule) | |
| SpecGrid | **SpecCard** (molecule) | |
| EndSection | **AuthorCard** (molecule) | |
| ScrollMorphZone | **PatternOverlay** + **ParallaxDecor** (effects), Card | Has `.a11y.css`, `.style.css` |
| IconScrollStage | Icon | Has `.a11y.css`, `.style.css` |
| Footer | **RevealCanvas** (effect), Heading, Link, Text | |
| ContactForm | FormField, Button, Icon, Heading, Text | Atoms only but organism-level |
| LegalNav | Button | Atoms only but organism-level |
| ReaderNav | Icon, LottieIcon | Atoms only — Tooltip consumer, LottieIcon legacy paths |
| CTASection | Button | Atoms only but organism-level |
| HeroMorphAnimation | Button | Atoms only but organism-level |
| HeroSection | Button, `astro:assets` Image | **FLAG: uses Astro Image, not Image atom** |
| ShareSection | LottieIcon, Icon | Tooltip consumer, LottieIcon legacy paths |
| SearchResults | Icon, Badge | Atoms only but organism-level |
| IsotopeImageGallery | Badge, `astro:assets` Image | **FLAG: uses Astro Image** |
| ProductGallery | `astro:assets` Image | **FLAG: uses Astro Image** |
| WhoSliderSection | Button, Icon, `astro:assets` Image | **FLAG: uses Astro Image** |
| PhilosophyFlipCardsSection | `astro:assets` Image | **FLAG: uses Astro Image** |
| Grid | (atoms only) | Atom-phase audit done (Pass 1) — needs post-atom pass |

**SectionTitle consumers (legacy — all need migration to `<Heading>`):**
| Component | Also imports |
|-----------|-------------|
| ForYouGrid | **SectionTitle**, `astro:assets` Image |
| RelatedGrid | **SectionTitle**, Button, `astro:assets` Image |
| ImageTextSection | **SectionTitle**, Button, `astro:assets` Image |
| PillarsSection | **SectionTitle**, `astro:assets` Image |
| StorySection | **SectionTitle** |
| ValuesSection | **SectionTitle** |

**YourView (internal Tier 2):**
| Component | Non-atom imports | Notes |
|-----------|-----------------|-------|
| A11yNavigationSection | **ToggleCard** (YourView) | |
| TypographyAdjustmentsSection | **Stepper** (YourView) | |
| TypographySection | **FontCard** (YourView) | |
| VisualSection | **ToggleCard** (YourView) | |

### Tier 3 — Imports Tier 2 molecules or organisms

| Component | Non-atom imports | Notes |
|-----------|-----------------|-------|
| PresentationEndSection | **AuthorCard** (molecule) + **RelatedGrid** (Tier 2 organism) | |
| Reader | **HeroSection** (Tier 2 organism) | |
| AccessibilityPanel | **Announcer** + **PresetButton** (YourView Tier 1) | Main panel wrapper |

---

## Audit Progress — Molecules

### molecules/cards/ (22)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| AssetCard | 2 | pending | | Imports ShareMenu (molecule) |
| AuthorCard | 1 | pending | | **Uses `astro:assets` Image — migrate to Image atom** |
| BlogCard | 1 | pending | | Uses Image atom correctly |
| ChoiceCard | 1 | pending | | No imports — pure HTML template |
| CompactToolCard | 1 | pending | | **Uses `astro:assets` Image — migrate to Image atom** |
| FlipCard | 1 | pending | | No imports — pure HTML template |
| GlowCard | 1 | pending | | **Imports `node:fs` + `node:path`** — legacy filesystem access, migrate to Asset API |
| ImageRevealCard | 1 | pending | | No imports — pure HTML template |
| InfoCard | 2 | pending | | Imports ShareMenu (molecule) |
| InsightCard | 1 | pending | | **Uses `astro:assets` Image — migrate to Image atom** |
| MasonryCard | 1 | pending | | |
| OfferingCard | 1 | pending | | **Uses `astro:assets` Image — migrate to Image atom** |
| ProductCard | 1 | pending | | **Uses `astro:assets` Image — migrate to Image atom** |
| ProjectCard | 1 | pending | | **Uses `astro:assets` Image — migrate to Image atom** |
| ProjectSpecCard | 1 | pending | | |
| RainbowBorderCard | 1 | pending | | No imports — pure HTML template |
| SlideCard | 1 | pending | | |
| SpecCard | 1 | pending | | |
| StepCard | 1 | pending | | No imports — pure HTML template |
| TeamCard | 1 | pending | | Uses Image atom correctly |
| TestimonialCard | 1 | pending | | Uses Image atom correctly |
| WhyCard | 1 | pending | | No imports — pure HTML template |

### molecules/Menu/ (3)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| DPadMenu | 1 | pending | | Has `.a11y.css`, `.a11y.recovery.css`, `.style.css` |
| RadialMenu | 1 | pending | | Has `.a11y.css`, `.a11y.recovery.css`, `.style.css` |
| ShareMenu | 1 | pending | | |

### molecules/sections/ (3)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| CalloutSection | 1 | pending | | |
| QuoteSection | 1 | pending | | |
| TextSection | 1 | pending | | |

### molecules/nav/ (2)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| Breadcrumbs | 1 | pending | | |
| SideTabs | 1 | pending | | |

### molecules/switcher/ (4)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| BaseSwitcher | 1 | pending | | Base for other switchers |
| BasicFilterSwitcher | 2 | pending | | → BaseSwitcher |
| ContentSwitcher | 2 | pending | | → BaseSwitcher |
| IsotopeFilterSwitcher | 2 | pending | | → BaseSwitcher |

### molecules/effects/ (2)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| ConnectorTimeline | 1 | pending | | Has `.a11y.css`, `.style.css` |
| LiquidRevealZone | 2 | pending | | → PhysicsOverlay + RevealCanvas. Has `.a11y.css`, `.style.css` |

### molecules/other/ (13)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| Toast | 1 | partial | 2026-03-06 | Atom-phase Pass 1 done — needs post-atom checklist pass |
| ImageOverlay | 1 | pending | | Has `.a11y.css`, `.a11y.recovery.css` |
| TimelineStepper | 1 | pending | | |
| CartIcon | 1 | pending | | |
| ContactInfo | 1 | pending | | |
| ContactPopup | 1 | pending | | |
| AnnouncementTicker | 1 | pending | | |
| CookieBanner | 1 | pending | | |
| DownloadSummary | 1 | pending | | |
| InsightContent | 1 | pending | | |
| InsightHeader | 1 | pending | | |
| ProductInfo | 1 | pending | | |
| CustomScrollbar | 1 | pending | | `molecules/global/CustomScrollbar/` |
| GalleryItem | — | orphaned | | **CSS only, no .astro file** — extract useful rules to `_reference/`, delete directory |

---

## Audit Progress — Effects (8)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| DrawSVGIcon | 1 | pending | | Decorative |
| ScrollDrawIcon | 1 | pending | | Decorative |
| PagePatternLayer | 2 | pending | | → PatternOverlay (effect) |
| ParallaxDecor | 1 | pending | | Decorative |
| PatternOverlay | 1 | pending | | Decorative |
| PhysicsOverlay | 1 | pending | | Matter.js — script quality critical |
| RevealCanvas | 1 | pending | | Decorative |
| ScrollColorBackground | 1 | pending | | GSAP ScrollTrigger — script quality critical |

---

## Audit Progress — Organisms

### organisms/nav/ (3)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| GlassNav | 2 | pending | | → CartIcon. Tooltip consumer, LottieIcon legacy paths. Has `glass-nav.a11y.css` |
| ReaderNav | 2 | pending | | Tooltip consumer, LottieIcon legacy paths, glass `rgba()` values |
| LegalNav | 2 | pending | | |

### organisms/Grid/ + organisms/grids/ (6)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| Grid | 2 | partial | 2026-03-06 | Atom-phase Pass 1 done — needs post-atom checklist pass |
| ForYouGrid | 2 | pending | | → SectionTitle (legacy), `astro:assets` Image |
| MasonryGrid | 2 | pending | | → MasonryCard (molecule). Has `masonry-grid.a11y.css` |
| ProjectSpecGrid | 2 | pending | | → ProjectSpecCard (molecule) |
| RelatedGrid | 2 | pending | | → SectionTitle (legacy), `astro:assets` Image |
| SpecGrid | 2 | pending | | → SpecCard (molecule) |

### organisms/sections/ (16)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| CTASection | 2 | pending | | |
| CompareSection | 2 | pending | | |
| EndSection | 2 | pending | | → AuthorCard (molecule) |
| FullWidthSection | 2 | pending | | |
| GallerySection | 2 | pending | | |
| HeroMorphAnimation | 2 | pending | | |
| HeroSection | 2 | pending | | `astro:assets` Image. Has `hero-section.a11y.css`, `HeroSection.a11y.css`, `HeroSection.style.css` |
| ImageTextSection | 2 | pending | | → SectionTitle (legacy), `astro:assets` Image |
| PhilosophyFlipCardsSection | 2 | pending | | `astro:assets` Image |
| PillarsSection | 2 | pending | | → SectionTitle (legacy), `astro:assets` Image |
| ServiceDetails | 2 | pending | | |
| ShareSection | 2 | pending | | Tooltip consumer, LottieIcon legacy paths |
| StatsSection | 2 | pending | | |
| StorySection | 2 | pending | | → SectionTitle (legacy) |
| ValuesSection | 2 | pending | | → SectionTitle (legacy) |
| WhoSliderSection | 2 | pending | | `astro:assets` Image |

### organisms/other/ (10)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| Footer | 2 | pending | | → RevealCanvas (effect). Has `Footer.a11y.css`, `Footer.style.css`. May use Link glass variant |
| IconScrollStage | 2 | pending | | Has `.a11y.css`, `.style.css` |
| ScrollMorphZone | 2 | pending | | → PatternOverlay + ParallaxDecor. Has `.a11y.css`, `.style.css` |
| ContactForm | 2 | pending | | Composes FormField. Has `ContactForm.a11y.css`, `ContactForm.style.css` |
| Reader | 3 | pending | | → HeroSection (Tier 2 organism) |
| PresentationEndSection | 3 | pending | | → AuthorCard + RelatedGrid (Tier 2) |
| IsotopeImageGallery | 2 | pending | | `astro:assets` Image |
| ProductGallery | 2 | pending | | `astro:assets` Image |
| SearchResults | 2 | pending | | |
| MiniCart | 2 | pending | | |

---

## Audit Progress — YourView Panel (11)

| Component | Tier | Status | Date | Notes |
|-----------|------|--------|------|-------|
| ToggleCard | 1 | pending | | |
| FontCard | 1 | pending | | |
| AltTextCard | 1 | pending | | |
| PresetButton | 1 | pending | | Has `.a11y.css` |
| Stepper | 1 | pending | | Has `.a11y.css` |
| Announcer | 1 | pending | | aria-live component |
| ThemeSidebar | 1 | pending | | |
| A11yNavigationSection | 2 | pending | | → ToggleCard |
| TypographyAdjustmentsSection | 2 | pending | | → Stepper |
| TypographySection | 2 | pending | | → FontCard |
| VisualSection | 2 | pending | | → ToggleCard |
| AccessibilityPanel | 3 | pending | | → Announcer, PresetButton |

---

## Legacy / Misplaced (relocate or deprecate)

| Component | Location | Status | Action |
|-----------|----------|--------|--------|
| SectionTitle | `Typography/` | pending | **Deprecate** — Heading atom supersedes this entirely. 6 organism consumers + `services.astro` page. Scoped `<style>`, `!important`, `.filter(Boolean).join(' ')`, raw `<h2>`/`<p>`/`<img>` — all banned patterns. Migrate consumers to `<Heading>`, then delete file + `Typography/` dir |
| InsightAuthorSection | `Insights/` | pending | Thin wrapper around AuthorCard. Move to `molecules/insights/` (where InsightContent + InsightHeader live) |
| `Sections/index.ts` | `Sections/` | dead | **Zero consumers** — barrel re-exports molecules/organisms sections. Delete file + `Sections/` dir |
| `Presentation/Sections/index.ts` | `Presentation/` | dead | **Zero consumers** — barrel re-exports for presentation. Delete file + `Presentation/` dir |

---

## Cleanup Tasks (no audit needed)

| Task | Status | Notes |
|------|--------|-------|
| Delete `molecules/a11y/` | pending | Empty directory |
| Delete `organisms/a11y/` | pending | Empty directory |
| Delete `molecules/gallery/` | pending | Orphaned CSS (no .astro file) — extract useful rules to `_reference/` first |

---

## Flagged Patterns (found during import scan)

### `astro:assets` Image instead of Image atom (8 components)
These use Astro's built-in `{ Image } from 'astro:assets'` instead of the Image atom. They miss alt text system, render modes, theme filters, and `semanticRole`.

| Component | Tier |
|-----------|------|
| AuthorCard | 1 |
| CompactToolCard | 1 |
| InsightCard | 1 |
| OfferingCard | 1 |
| ProductCard | 1 |
| ProjectCard | 1 |
| HeroSection | 2 |
| ForYouGrid | 2 |
| RelatedGrid | 2 |
| ImageTextSection | 2 |
| PillarsSection | 2 |
| WhoSliderSection | 2 |
| PhilosophyFlipCardsSection | 2 |
| IsotopeImageGallery | 2 |
| ProductGallery | 2 |

### `node:fs` / `node:path` filesystem access (1 component)
| Component | Issue |
|-----------|-------|
| GlowCard | Imports `fs` + `path` — legacy filesystem icon access, should use Asset API |

### SectionTitle consumers (6 organisms + 1 page — all need `<Heading>` migration)
ForYouGrid, RelatedGrid, ImageTextSection, PillarsSection, StorySection, ValuesSection, `services.astro`

### Organism legacy files (13 files across 7 organisms — all need extraction)
| Organism | Legacy files |
|---|---|
| ContactForm | `ContactForm.a11y.css`, `ContactForm.style.css` |
| Footer | `Footer.a11y.css`, `Footer.style.css` |
| MasonryGrid | `masonry-grid.a11y.css` |
| IconScrollStage | `IconScrollStage.a11y.css`, `IconScrollStage.style.css` |
| ScrollMorphZone | `ScrollMorphZone.a11y.css`, `ScrollMorphZone.style.css` |
| HeroSection | `hero-section.a11y.css`, `HeroSection.a11y.css` (2 files!), `HeroSection.style.css` |
| GlassNav | `glass-nav.a11y.css` |

---

## Deferred Cross-Component Items (from atom audits)

| # | Item | Resolves during | Status |
|---|------|-----------------|--------|
| 1 | 41 icon-label consumers → `<Tooltip purpose="label">` | Nav, section audits | pending |
| 2 | LottieIcon consumers migrate `src` → `slug` | GlassNav, ReaderNav, ShareSection, Button | pending |
| 3 | Heading context overrides deleted | Card, nav, section consumer audits | pending |
| 4 | `SectionTitle.astro` → `<Heading>` | 6 organism consumers | pending |
| 5 | 32+ raw `<small>` → `<Text as="small">` | Across molecules/organisms | pending |
| 6 | 4 raw `<blockquote>` → `<Text as="blockquote">` | Across molecules/organisms | pending |
| 7 | Link glass consumers → `<Button variant="glass" href>` | Footer, GlassNav | pending |
| 8 | `utilities.css` tooltip block removal | After all `data-tooltip` consumers migrated | pending |
| 9 | Image alt text wiring (API → Image atom props) | Card molecule audits | pending |
| 10 | AAC semantic role `.icon` rules → `src/styles/global/aac-mode.css` | Global layer build | pending |
| 11 | ReaderNav glass `rgba()` → `--glass-*` tokens | ReaderNav audit | pending |
| 12 | Card legacy primitives (`.card__heading` etc.) — molecules that used these need migration | Card molecule audits | pending |
| 13 | `astro:assets` Image → Image atom migration | 15 components flagged above | pending |
| 14 | GlowCard `node:fs` → Asset API | GlowCard audit | pending |
