# Project Conventions

## Atomic Component System

This project uses an atomic design system. **NEVER use bare HTML elements** where an atomic component exists. Always import and use the component instead.

### Mandatory Component Usage

| NEVER use | ALWAYS use | Location |
|-----------|-----------|----------|
| `<p>`, `<small>`, `<blockquote>` | `<Text>` | `atoms/ui/Text/Text.astro` |
| `<h1>` – `<h6>` | `<Heading>` | `atoms/ui/Heading/Heading.astro` |
| `<a>` | `<Link>` | `atoms/ui/Link/Link.astro` |
| `<ul>`, `<ol>` | `<List>` | `atoms/ui/List/List.astro` |
| `<img>`, `.img-*` classes | `<Image>` | `atoms/images/Image/Image.astro` |
| `<svg>` (inline icons) | `<Icon>` | `atoms/icons/Icon.astro` |
| Bare `<svg>` (animated) | `<LottieIcon>` | `atoms/icons/LottieIcon.astro` |
| Text over image DIYs | `<ImageOverlay>` | `atoms/images/Image Overlay/ImageOverlay.astro` |
| `.btn`, bare `<button>` | `<Button>` | `atoms/ui/Button/Button.astro` |
| `.badge`, bare spans | `<Badge>` | `atoms/ui/Badge/Badge.astro` |
| `.card`, `.card-transparent` | `<Card>` | `atoms/ui/Card/Card.astro` |
| `.why-grid`, `.for-you-grid`, `.related-grid`, `.spec-masonry`, `MasonryGrid`, `ProductGallery`, `IsotopeImageGallery` | `<Grid>` | `atoms/grid/Grid.astro` |

⚠️ **Exception**: Isotope.js filter grids (`#insights-grid`, `#products-grid`) on insights.astro and assets.astro stay as-is. They use `isotope-layout` with float positioning — cannot use CSS Grid.

### Component Prop Patterns

**Text** — `<Text as="p" size="large" color="primary" weight="bold" flush>`
- `as`: p | small | blockquote | span | div
- `size`: small | body | large
- `color`: text | text-light | primary | primary-dark | secondary | inherit
- `weight`: normal | medium | semibold | bold | extrabold
- `flush`: removes margin

**Heading** — `<Heading level={2} color="primary" weight="bold" flush>`
- `level`: 1–6 (renders corresponding h tag)
- Same color/weight/flush as Text
- `uppercase`: adds text-transform

**Link** — `<Link href="/page" variant="glass" color="primary" external>`
- `variant`: default | underline | glass | ghost
- Same color/weight as Text
- `external`: adds target="_blank" + rel
- `flush`: removes margin

**List** — `<List items={['One', 'Two']} variant="dot" dotSize="lg">`
- `variant`: default | none | inline | dot
- `icon`: Phosphor icon name (replaces bullets)
- `iconColor`: primary | primary-dark | secondary | text | inherit
- `dotSize`: sm | md | lg
- `spacing`: tight | normal | loose

**Image** — `<Image src="/img.jpg" alt="Description" fit="cover" radius="lg">`
- `fit`: cover | contain | fill | none
- `radius`: none | sm | md | lg | full
- `shadow`: none | sm | md | lg
- `hover`: boolean (scale + shadow lift)
- `responsive`: boolean (fills container)
- `decorative`: boolean (sets aria-hidden, empty alt)
- `sepia`: light | default | heavy
- `blur`: sm | md | lg | xl
- `gradientMask`: fade-bottom | fade-top | fade-edges | vignette
- `clipPath`: circle | ellipse | diamond | hexagon | blob | slant-left | slant-right
- `tilt`: sm | md | lg

**Icon** — `<Icon name="sparkle-fill" size={24} glow="md">`
- `size`: pixels (default 24)
- `color`: CSS value or variable
- `shadow`: sm | md | lg
- `glow`: sm | md | lg | secondary | white
- `gradient`: primary | secondary | warm | cool
- `spin`: boolean (loading states)
- `pulse`: boolean (attention)
- `bounce`: boolean (indicator)
- `stroke`: boolean (line-art mode)

**ImageOverlay** — `<ImageOverlay overlay="gradient-bottom" position="center">`
- `overlay`: gradient-bottom | gradient-top | scrim | glass | color-blend | none
- `position`: top-left | top-center | top-right | center | bottom-left | bottom-center | bottom-right
- `blendMode`: multiply | overlay | screen | soft-light | color-burn | color-dodge
- `blendColor`: primary | secondary | dark | CSS value
- `scrimOpacity`: 0–1 (default 0.45)
- `fullBleed`: boolean
- `aspectRatio`: CSS value (e.g., '16/9')
- `minHeight`: CSS value (e.g., '50vh')
- Named `image` slot for `<Image>`, default slot for content

**Button** — `<Button variant="filled" size="md">`
- `variant`: filled | outline | ghost | glass
- `size`: sm | md | lg

**Badge** — `<Badge variant="filled" size="sm">`
- `variant`: filled | outline | subtle
- `size`: sm | md | lg

**Card** — `<Card variant="default" hover shadow="lg" padding="xl">`
Atomic container shell. Visual chrome only — children handle internal layout.
Molecule cards render `<Card>` as their outer wrapper instead of raw `.card` class.

Props:
- `as`: div | article | section | aside | li
- `variant`: default | transparent | outline | glass
- `hover`: true (lift) | 'border' (border-color) | 'glow' (box-shadow ring)
- `shadow`: none | sm | md | lg | xl (box-shadow)
- `dropShadow`: none | sm | md | lg | xl (filter drop-shadow, clips to shape)
- `radius`: none | sm | md | lg | xl | full
- `padding`: none | xs | sm | md | lg | xl | 2xl
- `border`: none | thin | medium | thick
- `layout`: 'masonry' (break-inside:avoid, inline-block, width:100%)
- `flush`: removes margin-bottom
- `href`: renders as `<a>` with .card--link styles
- `separator`: visible border between card sections

Inner structure (optional classes on children):
- `.card__header`, `.card__body`, `.card__footer` — section wrappers
- `.card__image` — image container (aspect-ratio helpers: `--video`, `--3-2`, `--4-5`, `--3-4`, `--square`)
- `.card__overlay` — absolute gradient scrim over image
- `.card__content` — flex column text wrapper with padding
- `.card__icon-wrapper` — centered icon container

Typography primitives (classes for card content):
- `.card__heading` `.card__title` `.card__label` `.card__text` `.card__value` `.card__quote` `.card__author`
- Modifiers: `--centered`, `--small`, `--emphasis`, `--large`

Element primitives:
- `.card__icon` `.card__arrow` `.card__badge` `.card__button` `.card__quote-icon`

Masonry: `<Card layout="masonry">` inside `<Grid flow="masonry">`. Also `.card--wide` for column-span:all.

Files:
- `atoms/ui/Card/Card.astro` — component shell
- `atoms/ui/Card/Card.style.css` — `@layer components` — variants, scales, inner structure, primitives
- `atoms/ui/Card/Card.responsive.css` — `@layer components` — breakpoint tightening
- `atoms/ui/Card/Card.a11y.css` — `@layer a11y.reduce-motion` + `@layer a11y.text-only` + `@layer a11y.themes` (dark, high-contrast, cream, monochrome, CVD×3, plain)

### Molecule Cards

All in `molecules/cards/`. Each renders `<Card>` as outer wrapper (except MasonryCard which uses its own shadow/border system). Scoped styles handle internal layout only — container chrome comes from Card atom props.

| # | Component | Card atom usage | Layout pattern |
|---|-----------|----------------|----------------|
| 1 | CompactToolCard | `<Card hover="border" padding="md">` | Horizontal flex: thumbnail left, text right, animated arrow |
| 2 | WhyCard | `<Card variant="default" padding="xl">` | Vertical: badge + title + text, `--flat` gradient variant |
| 3 | AuthorCard | `<Card variant="default" padding="xl">` | Offset overlapping circular avatar + bio text |
| 4 | StepCard | `<Card variant="default" padding="xl">` | Centered: numbered circle + title + description |
| 5 | MasonryCard | `<Card layout="masonry" border="medium" dropShadow="lg">` | 12 variants (breadcrumb, icon, title, stat, quote, spec, image, mixed, tag, summary, text) |
| 6 | ProjectSpecCard | `<Card variant="outline" padding="lg">` | Vertical stack: icon top, label, value |
| 7 | SpecCard | `<Card variant="outline" padding="md">` | Horizontal: icon left, label + value right |
| 8 | ProductCard | `<Card hover="lift" shadow="md">` | Vertical: image + badge + name + price + Add to Cart button |
| 9 | InsightCard | `<Card hover="lift" shadow="md">` | Vertical: image + badge + read time + title + excerpt + CTA |
| 10 | ProjectCard | `<Card variant="transparent">` | Full-width alternating image/text (not a typical card shape) |
| 11 | OfferingCard | `<Card hover="border" shadow="sm">` | Grid: 250px image + 1fr multi-section details + CTA |
| 12 | TestimonialCard | `<Card variant="default" padding="xl">` | Horizontal: `.card__image` avatar left, `.card__title` name + `.card__badge` role + `.card__quote` text right |
| 13 | ResourceCard | `<Card hover="lift" shadow="md">` | Vertical: `.card__image` thumbnail top, `.card__title` name + `.card__badge` category + `.card__button` download link |

Consolidation status:
- **Simple wrappers** (2, 3, 4, 6, 7, 12): Container chrome → Card props. Scoped CSS = internal layout only.
- **Complex internal layout** (1, 8, 9, 11, 13): Wrap with Card for consistent hover/shadow/a11y. Keep heavy internal CSS.
- **Full-width outlier** (10): Wraps with Card variant="transparent". Very different from standard card shape.
- **Own system** (5): MasonryCard uses Card layout="masonry" for break-inside/inline-block but has 12 internal variant layouts + external masonry-card.css.

Not Card molecules (different domain):
- FontCard, ToggleCard → a11y panel controls (`molecules/a11y/`)
- Philosophy Flip Cards → 3D animation organism (`organisms/`)
- GalleryItem → gallery atom (`atoms/gallery/`)

**Grid** — `<Grid columns={3} gap="var(--space-xl)">`
Unified layout shell consolidating 7 former grid components. Pure layout — no card styling.

Props:
- `as`: div | section | ul | ol | main
- `columns`: 1–6 (fixed repeat)
- `minWidth`: CSS value e.g. "280px" (auto-fit mode, mutually exclusive with columns)
- `gap`: CSS value (default `var(--space-xl)`)
- `align`: stretch | start | center | end
- `container`: 4xl | 6xl | 7xl | full | none (max-width wrapper)
- `flow`: row | dense | column | masonry
- `gallery`: showcase | product (GSAP Flip animated modes)
- `separator`: boolean (border between items in text-only mode)

Modes:
- **Standard**: `columns={3}` → `repeat(3, 1fr)`
- **Auto-fit**: `minWidth="280px"` → `repeat(auto-fit, minmax(280px, 1fr))`
- **Dense**: `flow="dense"` → `grid-auto-flow: dense` (masonry-like packing, used with spanning)
- **Masonry**: `flow="masonry"` → CSS `column-count` (true variable-height masonry, NOT CSS Grid)
- **Column**: `flow="column"` → `grid-auto-flow: column`
- **Showcase gallery**: `gallery="showcase"` → 1 expanded + N thumbnails, GSAP Flip carousel rotation
- **Product gallery**: `gallery="product"` → 6-col grid, click to expand/collapse, GSAP Flip

Spanning (for dense/fixed modes):
- Utility classes: `grid-span-2` through `grid-span-6`, `grid-span-full`, `grid-row-span-2`, `grid-row-span-3`
- Inline custom properties: `style="--span: 2; --row-span: 2;"`
- Server-side: `grid-layout.ts` → `calculateGridLayout()` outputs spanClass/rowSpanClass
- Client-side: `spec-grid-layout.ts` → measures DOM, applies span classes dynamically

Responsive collapse:
- 1400px+: showcase gallery gets wider thumbnails (140px)
- 1024px: showcase thumbnails narrow (100px); product gallery → 4 columns
- 768px: fixed grids cap at 2 columns; spans clamp to max 2; masonry → 2 columns
- 480px: everything → 1 column; all spans → 1; masonry → 1 column; galleries stack vertically
- 300px: tighter gaps

Text-only (`a11y-text-only`): `display: flex; flex-direction: column` (matches reference text-only.css wildcard). Showcase gallery hidden entirely. Product gallery becomes vertical stack.
Reduce-motion: kills all transitions, sets `--gallery-animate: 0` for GSAP scripts.

Consolidation map (old → new):
- `ForYouGrid` → `<Grid columns={2}>`
- `RelatedGrid` → `<Grid columns={n}>` (1–4)
- `ProjectSpecGrid` → `<Grid columns={4}>`
- `SpecGrid` → `<Grid columns={5} flow="dense">`
- `MasonryGrid` → `<Grid columns={4} flow="masonry">`
- `IsotopeImageGallery` → `<Grid columns={2} gallery="showcase">`
- `ProductGallery` → `<Grid columns={3} gallery="product">`

⚠️ **NOT replaced by Grid**: Isotope.js filter grids on insights.astro and assets.astro. Those use `isotope-layout` with float-based positioning — they cannot use CSS Grid. They stay as separate components with their own `IsotopeFilterSwitcher`.

Files:
- `Grid.astro` — component shell, sets CSS custom properties
- `Grid.style.css` — `@layer components` — base layout, flow modes, gallery layouts, spanning
- `Grid.responsive.css` — `@layer components` — breakpoint collapse rules
- `Grid.a11y.css` — `@layer a11y.reduce-motion` + `@layer a11y.text-only`
- `grid-layout.ts` — server-side span calculation (estimateCardDimensions, calculateGridLayout)
- `spec-grid-layout.ts` — client-side DOM measurement + span application
- `showcase-gallery.ts` — GSAP Flip carousel rotation for `gallery="showcase"`
- `product-gallery.ts` — GSAP Flip expand/collapse for `gallery="product"`

**GalleryItem** (card-level styling for gallery items)
Items inside `<Grid gallery="showcase|product">`. Grid handles layout, GalleryItem handles the items.

Classes:
- `.gallery-item` — showcase gallery items (border, hover, is-expanded state)
- `.thumbnail` — product gallery items (border, shadow, height, is-active/is-inactive states)
- `.gallery-badge` — badge overlay on expanded showcase items
- `.product-badge` — badge on product thumbnails (with `.badge-worksheet`, `.badge-guide`, `.badge-toolkit` variants)

Files:
- `GalleryItem.style.css` — `@layer components` — item chrome, borders, heights, badges, inactive dimming
- `GalleryItem.responsive.css` — `@layer components` — item height adjustments per breakpoint
- `GalleryItem.a11y.css` — `@layer a11y.reduce-motion` + `@layer a11y.text-only`

⚠️ Theme overrides (dark, high-contrast, cream, CVD) for gallery items belong in the Card component's a11y file — gallery items ARE cards and inherit card theme behaviour.

### Switcher Components

**BaseSwitcher** — `<BaseSwitcher tabs={tabs} defaultActive="all" id="my-switcher">`
Pure visual atom. Tab buttons with sliding `::before` indicator. Emits `switcher:change` custom event. Zero knowledge of what it controls.

Props:
- `tabs`: Array of `{ id: string, label: string, icon?: string }`
- `defaultActive`: string (id of default active tab)
- `id`: string (unique identifier)
- `dataAttributes`: Record<string, string> (passed to nav element)

Indicator: positioned via `--selector-width` / `--selector-left` custom properties set by JS. Animated with cubic-bezier bounce.

**BasicFilterSwitcher** — `<BasicFilterSwitcher tabs={tabs} targetSelector=".card" filterAttribute="data-type">`
Composes BaseSwitcher. Simple show/hide filtering via `display: none`. Relies on Grid's `flow="dense"` to collapse gaps. Currently unused in production — exists as a11y-safe fallback for Isotope.js filtering.

**ContentSwitcher** — `<ContentSwitcher tabs={tabs} panelSelector=".tab-panel" panelAttribute="data-panel">`
Composes BaseSwitcher. Toggles `.active` class on tab panels. No Grid involvement — pure tab panel pattern. Used on asset detail pages (assets/[slug].astro).

**IsotopeFilterSwitcher** — Composes BaseSwitcher + Isotope.js
Uses `isotope-layout` library (NOT GSAP Flip). Float-based positioning. Used on insights.astro and assets.astro for animated card filtering. Cannot use `<Grid>` atom — Isotope owns the layout. Reduce-motion aware via MutationObserver on `#a11y-content-wrapper`.

Switcher ↔ Grid relationship: Switchers control **what's visible**, Grid controls **how it's laid out**. They're independent atoms composed at the page level. The two Isotope.js filter grids are NOT Grid atom consumers.

## CSS Architecture

### Layer Order
All styles use `@layer`. Order: `reset → tokens → theme → components → utilities → a11y`

A11y sub-layers: `a11y.reduce-motion`, `a11y.text-only`, `a11y.highlight-links`

### Rules
- **NEVER** write unlayered CSS — it beats everything in `@layer`
- **NEVER** use `!important` except in a11y text-only overrides (to beat inline styles)
- Every component has up to 3 CSS files: `*.style.css`, `*.responsive.css`, `*.a11y.css`
- All component CSS uses `@layer components`
- Scoped `<style>` blocks in `.astro` files must wrap contents in `@layer components`
- Utility classes use `@layer utilities`
- Tokens go in `:root {}` (unlayered is fine for custom properties)

### Typography
- `.text` is the base class for all text elements — provides font-family inheritance
- Badge and Button use `.text` as their base class
- List items use `.text` as their base class

### Theme-Aware Media
Images automatically consume theme tokens:
- `--media-brightness`, `--media-saturation`, `--media-contrast`
- These are set per theme (monochrome, dark mode, high contrast)
- No per-theme image rules needed — Image component handles it

### Accessibility
- Every component handles 3 a11y modes: highlight-links, reduce-motion, text-only
- Text-only collapses ALL images and image containers
- Text-only keeps list bullets/numbers (structural)
- Reduce-motion kills all transitions, animations, hover transforms
- Icon animations respect both `.a11y-reduce-motion` class AND `prefers-reduced-motion` media query

## File Structure

```
src/components/
  atoms/
    ui/          — Text, Heading, Link, List, Badge, Button, Card, BaseSwitcher
    grid/        — Grid (layout shell)
    gallery/     — GalleryItem (gallery item styling)
    images/      — Image, Image Overlay
    icons/       — Icon, LottieIcon
    canvas/      — RevealCanvas
  molecules/
    cards/       — CompactToolCard, WhyCard, AuthorCard, StepCard, MasonryCard,
                   ProjectSpecCard, SpecCard, ProductCard, InsightCard,
                   ProjectCard, OfferingCard, TestimonialCard, ResourceCard
    a11y/        — FontCard, ToggleCard (a11y panel controls)
    switchers/   — BasicFilterSwitcher, ContentSwitcher
  organisms/     — Footer, IsotopeFilterSwitcher, Philosophy Flip Cards

src/styles/
  base/          — reset.css, utilities.css
  tokens/        — Design tokens (typography, spacing, colors, images)
  themes/        — Brand themes, a11y themes
  components/    — Legacy component styles (migrating to atomic)
  responsive/    — Breakpoint files
  global.css     — Import orchestration

src/lib/
  utils/
    grid-layout.ts       — Server-side grid span calculation
  ui/
    spec-grid-layout.ts  — Client-side DOM measurement + span application
    showcase-gallery.ts  — GSAP Flip carousel for gallery="showcase"
    product-gallery.ts   — GSAP Flip expand/collapse for gallery="product"
```

## Import Order in global.css

Atoms load in dependency order:
1. Text → Heading → Link → List (text primitives, `atoms/ui/`)
2. Badge → Button (interactive primitives, `atoms/ui/`)
3. Card (`atoms/ui/Card/`)
4. Grid → GalleryItem (`atoms/grid/`, `atoms/gallery/`)
5. BaseSwitcher (`atoms/ui/`)
6. Image → ImageOverlay (`atoms/images/`)
7. Footer (organism)
8. RevealCanvas (`atoms/canvas/`)

Each atom loads: style → responsive → a11y

Grid JS loads separately (not in global.css):
- `showcase-gallery.ts` — imported by showcase gallery pages
- `product-gallery.ts` — imported by product gallery pages
- `spec-grid-layout.ts` — imported by spec grid pages
- Grid server-side utils (`grid-layout.ts`) called at build time, no client import
