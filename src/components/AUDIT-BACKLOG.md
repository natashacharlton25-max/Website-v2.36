# Component Audit Backlog

Items flagged during the atoms audit that need a separate pass.

## Deferred: GalleryItem component

- `atoms/gallery/` has 3 CSS files but no `.astro` component
- Build the component first, then audit
- See `atoms/gallery/PENDING.md`

## Deferred: Dead theme class selectors

- `FormField.css` has `:is(.a11y-theme-dark, .a11y-theme-high-contrast)` selectors
- Themes swap CSS files, not classes — these selectors never fire
- Fix: move to each dark theme file as token overrides (`--shadow-neu-pressed: none`, etc.)
- Grep for: `TODO: theme-audit`

## Deferred: Showcase organisms

- 9 demo pages have inline showcase wrapper styles (`.po-showcase`, `.parallax-demo`, etc.)
- These belong in dedicated showcase organisms, not in atoms or inline `<style>` blocks
- Pages: badges, buttons, cards, effects, forms, icon-draw-morph, menus, pattern-overlay, scroll-morph

## Deferred: global.css component imports

- `global.css` still imports component CSS directly via `@import`
- These should load through each component's `index.ts` barrel instead
- Needs a separate pass once all atoms + molecules are audited

## Deferred: Base class cross-reference

- After all `atoms/ui/` audits are done, cross-reference which components extend base classes
- Base classes to check: `.text` (Text), `.heading` (Heading), `.button` (Button), `.card` (Card), etc.
- Any component rendering in a potentially unknown parent context should extend the appropriate base class
- Already done: Badge (`.text`), FormField (`.text`)
- Check all remaining atoms/ui/ and molecules in one pass

## Deferred: Grid / Card a11y dedup

- `Grid.a11y.css` text-only layer (~lines 108–125) strips card chrome (`[data-card]`)
- `Card.a11y.css` text-only layer does the same thing
- Not a bug — Grid owns layout context so belt-and-braces is fine
- Worth deduping in a future pass once molecule a11y extraction is done

## Deferred: Bare `<a>` highlight-links coverage

- Link.a11y.css is the central definition for link a11y — but only catches `.link` class
- Components with bare `<a>` tags need their own `a11y.highlight-links` blocks:
  - **GlassNav** — nav links are bare `<a>`, need highlight-links rules in GlassNav.a11y.css
  - **Breadcrumbs** — bare `<a>`, same treatment
  - **AnnouncementTicker** — `.announcement-ticker__item--link` needs highlight-links rules
- Do NOT add a global `a:not(.btn):not(.link):not(.card)` fallback — maintenance trap
- Handle per-component when those components are audited

## Deferred: Icon atom — pending D1 build

- `atoms/icons/Icon/` is deferred — do NOT audit
- Icon storage moving to D1 (canonical) + build-time query (static pages)
- Icon atom will be a ground-up rewrite once D1 schema is finalised
- D1 needs: schema confirmed (`svg_data` inline vs `svg_path` file ref), Astro/Vite plugin for build-time queries
- Icon atom then becomes simple lookup: `getIcon(name, weight)` → inline SVG string
