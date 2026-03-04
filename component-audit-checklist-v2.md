# Component Audit Checklist v2 — "Your View" System

Per-component audit. Covers all four render modes, assistive technology confirmation, global a11y settings matrix, navigation special cases, XL text layout, and print traceability.

**Run against every component. Update `src/components/audit-log.md` when done.**

Sections 1–8 apply to **every** component.
Section 9 (Alt Text) applies only to **Image** components.
Section 10 (Assistive Render) applies to every component with **interactive elements**.
Section 11 (Navigation) applies to **nav-participating components only**.
Section 12 (JS Bindings) applies to every component with **a `<script>` tag**.
Section 13 (Atom Usage) applies to every component that renders **text, links, buttons, headings, or icons**.
Section 14 (Print) applies to every component that contains **user content or evidence**.

---

## Section 1: File Structure

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 1.1 | Component lives in its own folder | | Standalone `.astro` file in parent dir |
| 1.2 | `ComponentName.css` exists (extracted from `<style>`) | | Styles in scoped `<style>` or missing |
| 1.3 | `ComponentName.responsive.css` exists (empty is fine) | | Missing |
| 1.4 | `ComponentName.schema.json` exists | | Missing |
| 1.5 | `index.ts` barrel file exists | | Missing |
| 1.6 | No `ComponentName.a11y.css` in active folder | | Present — extract then move to `_reference/` |
| 1.7 | No `ComponentName.a11y.recovery.css` in active folder | | Present — move to `_reference/` after extracting |
| 1.8 | No `.style.css` naming (should be `.css`) | | `Component.style.css` present |
| 1.9 | No scoped `<style>` block in `.astro` file | | `<style>` tag present |
| 1.10 | `index.ts` has no `a11y.css` imports | | `import './Component.a11y.css'` line present |

**If any fail:** Follow the 6-step extraction process in CLAUDE.md before continuing.

---

## Section 2: Banned CSS Patterns

Grep the component's CSS files. All must return zero matches.

| # | Pattern | Grep for |
|---|---------|----------|
| 2.1 | `@layer` wrappers | `@layer` |
| 2.2 | `!important` | `!important` |
| 2.3 | `#a11y-content-wrapper` | `a11y-content-wrapper` |
| 2.4 | `.a11y-reduce-motion` | `a11y-reduce-motion` |
| 2.5 | `.a11y-text-only` | `a11y-text-only` |
| 2.6 | `.a11y-highlight-links` | `a11y-highlight-links` |
| 2.7 | `.a11y-high-contrast` | `a11y-high-contrast` |
| 2.8 | `.a11y-theme-*` | `a11y-theme-` |
| 2.9 | `.a11y-cvd-*` | `a11y-cvd-` |
| 2.10 | `.plain` | `\.plain` |
| 2.11 | `@media (prefers-reduced-motion)` | `prefers-reduced-motion` |
| 2.12 | `:global()` in CSS | `:global\(` |
| 2.13 | `.dark-theme` selector | `\.dark-theme` — extract to theme-luminance-dark.css |
| 2.14 | `highlight-links` selector | `highlight-links` — extract to highlight-links.css |
| 2.15 | Old numbered palette tokens | `--color-Primary` / `--color-Neutral` / `--color-AccentOne` |
| 2.16 | Fallback values on brand tokens | `var(--brand-c-[^)]+,\s*#` |

---

## Section 3: Schema

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 3.1 | Has `"component"` field | | Missing |
| 3.2 | Has `"category"` field | | Missing |
| 3.3 | Has `"renders"` block with all 4 keys: `full`, `reduced`, `assistive`, `textonly` | | Missing keys or old 3-key format |
| 3.4 | `textonly: null` for decorative/effect components | | Decorative component has a .astro target |
| 3.5 | `assistive` render points to same .astro (props are filtered, not a separate template) | | Separate assistive template file |
| 3.6 | Has `"content"` group (text, href, aria labels, data, disabled) | | Props flat or miscategorised |
| 3.7 | Has `"visual"` group (variant, size, shape, colour, icon name, layout) | | Props flat or miscategorised |
| 3.8 | Has `"animation"` group — empty `{}` is correct for no-motion components | | Animation props mixed into visual/content |
| 3.9 | Each animation prop maps to a CSS modifier class | | Prop exists with no matching class |
| 3.10 | Prop passthrough documented for components wrapping atoms | | E.g. Button → Icon animation props not listed |

**Decorative components (textonly: null):** RevealCanvas, PagePatternLayer, ParallaxDecor, PatternOverlay, PhysicsOverlay, ScrollColorBackground, DrawSVGIcon, ScrollDrawIcon, LiquidRevealZone, IconScrollStage, ScrollMorphZone, ImageOverlay, CustomScrollbar, Icon (when role=decorative).

---

## Section 4: Animation Gating

**Invariant:** If no animation prop is passed, no motion can occur. No exceptions.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 4.1 | No ambient `transition:` on base selectors | | `.component { transition: ... }` in base |
| 4.2 | No ambient `animation:` on base selectors | | `.component { animation: ... }` in base |
| 4.3 | No ambient `transform:` on hover without modifier | | `.component:hover { transform: ... }` ungated |
| 4.4 | All transitions inside `--modifier` classes | | Transition not in `.component--modifier { }` |
| 4.5 | Modifier classes map to animation schema props | | Orphan modifier class with no schema prop |
| 4.6 | Colour/state hover changes in base are OK (not motion) | | N/A — just confirm these exist if needed |
| 4.7 | CSS-only keyframe animations (not JS) also gated behind modifier | | `@keyframes` rule fires from base class |

**Naming:** `.component--hover-lift`, `.component--animate-slide`, `.component--animate-focus`

---

## Section 5: Astro Purity

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 5.1 | All data arrives via `Astro.props` | | Reads env, config, or globals directly |
| 5.2 | No direct JSON imports | | `import data from './data.json'` in frontmatter |
| 5.3 | No `data-render` attribute check | | Reads `document.body.dataset.render` |
| 5.4 | No `classList.contains('a11y-')` | | Legacy a11y class detection |
| 5.5 | No brand token reading in JS | | `getComputedStyle` for tokens in frontmatter |
| 5.6 | No accessibility state reading in JS | | Panel state read in frontmatter |
| 5.7 | Animation classes added conditionally from props | | Class always applied regardless of prop |
| 5.8 | `aria-hidden="true"` on decorative elements | | Decorative icon without aria-hidden |
| 5.9 | No `:global()` selectors | | Present in any block |
| 5.10 | No scoped `<style>` block | | `<style>` tag present |

---

## Section 6: Accessibility Baseline (Every Component)

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 6.1 | Decorative icons have `aria-hidden="true"` | | Icon rendered without it |
| 6.2 | `data-semantic-role` on image/icon elements | | Missing — should be `decorative`, `ui-control`, or `content-symbol` |
| 6.3 | All interactive elements keyboard-reachable | | Div/span with click but no tabindex/role |
| 6.4 | No hover-only content without `:focus-within` equivalent | | Tooltip only on `:hover` |
| 6.5 | `tabindex="0"` on non-interactive elements needing focus | | Figure with tooltip but no tabindex |
| 6.6 | Focus indicators visible (min 2px, sufficient contrast) | | `outline: none` without replacement |
| 6.7 | Tab order matches visual reading order | | Focus jumps or skips |
| 6.8 | No `tabindex` values > 0 | | `tabindex="2"` etc. |
| 6.9 | No colour-only information encoding | | Status shown by colour alone with no text/icon |
| 6.10 | Text contrast meets WCAG AA (4.5:1 normal, 3:1 large) | | Low contrast text on themed backgrounds |

---

## Section 7: Four-Render Matrix

Test this component in each render mode. Mark each cell PASS / FAIL / N/A.

| # | Check | full | reduced | assistive | textonly |
|---|-------|------|---------|-----------|---------|
| 7.1 | Component renders without error | | | | |
| 7.2 | Content is readable and complete | | | | |
| 7.3 | Interactive elements are functional | | | | |
| 7.4 | No motion occurs (reduced, assistive, textonly) | N/A | | | |
| 7.5 | Layout is appropriate for mode | | | single-col | linear flow |
| 7.6 | Focus indicators work | | | enlarged 3px | |
| 7.7 | Component excluded if schema says `null` | N/A | N/A | check | check |
| 7.8 | No console errors in any mode | | | | |

**What each render filters:**

| Render | content props | visual props | animation props | CSS loaded |
|--------|--------------|-------------|----------------|-----------|
| full | ✓ | ✓ | ✓ | base + animation + responsive |
| reduced | ✓ | ✓ | ✗ stripped | base + responsive (no animation.css) |
| assistive | ✓ | ✓ (stacked) | ✗ stripped | base + responsive + assistive overrides |
| textonly | ✓ | ✗ stripped | ✗ stripped | minimal base only |

---

## Section 8: Global Settings Cross-Matrix

Test the component with each "Your View" panel setting active. These are ADDITIVE to the render mode — a user can be in `assistive` render AND have high contrast AND have a CVD filter active simultaneously.

### 8a. Individual Settings

| # | Setting | User-facing name | Check |
|---|---------|-----------------|-------|
| 8a.1 | Highlight links | (toggle) | Links within this component gain visible outlines/underlines via `[data-highlight-links]` |
| 8a.2 | Bold colours / high contrast | Bold Colours | Component uses `--brand-c-*` tokens that respond to high-contrast theme |
| 8a.3 | Protanopia filter | (CVD toggle) | No colour-only info; component remains usable under filter |
| 8a.4 | Deuteranopia filter | (CVD toggle) | Same as above |
| 8a.5 | Tritanopia filter | (CVD toggle) | Same as above |
| 8a.6 | Text size slider at 100% | (default) | Baseline — component renders normally |
| 8a.7 | Text size slider at 150% | (slider) | Component scales, no overflow, no overlap |
| 8a.8 | Text size slider at 200% (XL threshold) | (slider) | Layout reflows — see Section 8c below |
| 8a.9 | Calm mode (no motion) | Calm Mode | Equivalent to `reduced` render — no transitions, no animation |
| 8a.10 | Reading mode | Reading Mode | Equivalent to `textonly` render |
| 8a.11 | Easy Click | Easy Click | Equivalent to `assistive` render |
| 8a.12 | Enhanced scrollbar | (toggle) | Component works with OverlayScrollbars; no double-scroll, no z-index conflict |

### 8b. Combination Stress Tests

These combinations are the most likely real-world scenarios. Test each:

| # | Combination | What to check |
|---|------------|---------------|
| 8b.1 | Easy Click + Bold Colours | Large targets still visible with high-contrast tokens; focus rings contrast sufficiently |
| 8b.2 | Easy Click + 200% text | Single-column layout + enlarged text; no overflow, targets still ≥ 64px |
| 8b.3 | Easy Click + CVD filter | Colour-only info already eliminated; confirm under filter |
| 8b.4 | Easy Click + Highlight links | Link indicators visible at 64px target size; no visual collision |
| 8b.5 | Calm Mode + Bold Colours | Static component with high-contrast tokens |
| 8b.6 | 200% text + Bold Colours | Reflow layout with high-contrast; text doesn't escape containers |
| 8b.7 | Reading Mode + 200% text | Linear text flow scaled up; no structural elements persist |
| 8b.8 | All settings max (Easy Click + Bold Colours + CVD + 200% + Highlight links + Enhanced scrollbar) | "Everything on" — component must not break |

### 8c. XL Text Threshold Behaviour (200% and above)

When text size hits the XL threshold, layout reflow triggers. This is separate from the assistive render — a user in `full` render with 200% text gets reflow without losing animations.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 8c.1 | Component uses `rem` units (scales with root font size) | | `px` on text sizes or spacing |
| 8c.2 | At 200%, text does not overflow its container | | Text clipped or overlapping |
| 8c.3 | At 200%, grid layouts reflow to fewer/single columns | | Grid stays multi-column with oversized text |
| 8c.4 | At 200%, images scale or hide appropriately | | Image overflows or pushes text offscreen |
| 8c.5 | At 200%, interactive elements remain reachable | | Button pushed off viewport |
| 8c.6 | Fixed-height containers expand with content | | Text overflows a fixed-height card |
| 8c.7 | Nav collapses at XL threshold (see Section 11) | | Full nav persists at 200% |

---

## Section 9: Alt Text (Image Components Only)

Skip for non-Image components.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 9.1 | Accepts `altDescriptive` prop | | Only generic `alt` prop |
| 9.2 | Accepts `altAacPhrase` prop | | Missing |
| 9.3 | Accepts `altSymbolId` prop | | Missing |
| 9.4 | Accepts `altDisplayMode` prop (`hover` / `overlay` / `underneath` / `replace` / `off`) | | Missing |
| 9.5 | `tabindex="0"` on `<figure>` element | | Missing — blocks keyboard/AT access |
| 9.6 | `:focus-within` on all hover-mode CSS rules | | Only `:hover` — keyboard can't trigger |
| 9.7 | `data-semantic-role` on figure | | Missing |
| 9.8 | `resolvedAlt` uses descriptive-first fallback chain | | Word-only fallback |
| 9.9 | AAC cards render from `alt_symbols` via aacResolver | | Hard-coded or missing |
| 9.10 | Alt text data sourced from Asset Library API | | Hard-coded in component |
| 9.11 | At 200% text, alt text area grows with content (not fixed height) | | Alt text clipped at XL sizes |
| 9.12 | In stacked layout (assistive/XL), image and alt text flow vertically | | Overlap |
| 9.13 | SVG content with alt text has readable fallback at 200% | | SVG alt text unreadable at scale |

---

## Section 10: Assistive-Input Render (Easy Click)

For every component with interactive elements.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 10.1 | Interactive elements ≥ 44×44px at default | | Smaller |
| 10.2 | Scale to ≥ 64×64px under `[data-render="assistive"]` | | No assistive size rule |
| 10.3 | Minimum 16px gap between adjacent interactive elements | | Touching or <16px |
| 10.4 | No hover-only behaviour | | Content hidden behind `:hover` with no `:focus-within` |
| 10.5 | All dropdowns/tooltips have click/tap alternative | | Hover-only trigger |
| 10.6 | Grid collapses to single column under `[data-render="assistive"]` | | Grid persists |
| 10.7 | Auto-advancing elements pause in assistive render | | Carousel/timer not gated |
| 10.8 | Drag interactions have click/keyboard alternative | | Drag-only |
| 10.9 | Focus indicators enlarged (min 3px, high contrast) | | Default 2px indicators |
| 10.10 | Content density reduced (fewer items per viewport) | | Same density as full render |
| 10.11 | Timeouts extended or paused | | Session/notification timeout fires at default speed |

**CSS pattern:**
```css
[data-render="assistive"] .component__button {
  min-width: 64px;
  min-height: 64px;
}
[data-render="assistive"] .component__grid {
  grid-template-columns: 1fr;
}
```

---

## Section 11: Navigation Special Cases

**Only for components that participate in navigation** (navbar, breadcrumbs, side tabs, footer nav, pagination).

### 11a. Assistive Render — Dedicated Nav Page

In assistive render (`Easy Click`), the full navigation is replaced by a dedicated navigation page. This is a separate, single-purpose page with large targets for every nav destination.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 11a.1 | Nav component does NOT render when `[data-render="assistive"]` is active | | Nav still renders in Easy Click |
| 11a.2 | Dedicated nav page exists with all destinations from this nav component | | Missing page or incomplete links |
| 11a.3 | Nav data source is the same JSON as the dedicated nav page | | Different data sources = links get out of sync |
| 11a.4 | Pinned "Menu" button visible in assistive render (routes to nav page) | | No way to access navigation |
| 11a.5 | Pinned Menu button meets 64×64px minimum | | Undersized |
| 11a.6 | Pinned Menu button has clear label and aria | | Unlabelled icon |

### 11b. XL Text Threshold — Nav Collapse

At 200% text size, navigation must collapse regardless of render mode.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 11b.1 | Nav collapses to hamburger/simplified layout at 200% text | | Full nav with oversized text overflows |
| 11b.2 | Collapsed nav is keyboard-navigable | | Can't open/close with keyboard |
| 11b.3 | Collapsed nav items meet minimum target sizes at current text size | | Items too small for the scaled text |
| 11b.4 | Breadcrumbs truncate or wrap gracefully at 200% | | Breadcrumb trail overflows viewport |
| 11b.5 | Side tabs stack vertically at 200% if they were horizontal | | Horizontal tabs overflow |

### 11c. Text-Only Render — Nav Preservation

In textonly render, navigation must still function — it's one of the few structural elements that persists.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 11c.1 | Nav links are present in textonly render | | Nav stripped entirely |
| 11c.2 | Nav renders as a simple list of links (no visual chrome) | | Styled nav elements persist |
| 11c.3 | Current page indicator uses text (e.g. "(current)") not just colour/style | | Only visual indicator |

---

## Section 12: JS Animation Bindings

For components with a `<script>` tag. Skip if no script.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 12.1 | JS checks for data attribute before binding events | | `addEventListener` called unconditionally |
| 12.2 | Data attribute only added when animation prop present | | Attribute always on element |
| 12.3 | No animation library init'd unconditionally | | GSAP/Lottie/matter runs without checking |
| 12.4 | Uses `astro:page-load` (not just `DOMContentLoaded`) | | Breaks on SPA navigation |
| 12.5 | Double-init guard present (`element.__instance` check) | | Re-init possible on revisit |
| 12.6 | Lottie JSON loaded server-side via `animationData` | | Client-side `fetch()` for Lottie |
| 12.7 | No event listeners left on elements in assistive render that trigger motion | | JS binds hover animation even when animation prop stripped |

**Correct pattern:**
```javascript
document.addEventListener('astro:page-load', () => {
  const el = document.querySelector('[data-my-animation]');
  if (!el || el.__myBound) return;
  el.__myBound = true;
  // bind animation
});
```

---

## Section 13: Atom Usage

For components that render text, links, buttons, headings, or icons.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 13.1 | `<a href>` uses `<Link>` atom | | Raw `<a>` tag (except inside Link.astro) |
| 13.2 | `<button>` uses `<Button>` atom | | Raw `<button>` (except inside Button.astro, FormField.astro) |
| 13.3 | `<p>`, `<span>`, `<small>` uses `<Text>` atom | | Raw text element |
| 13.4 | `<h1>`–`<h6>` uses `<Heading>` atom | | Raw heading (except inside Heading.astro) |
| 13.5 | Icons use `<Icon>` atom via Asset Library API | | Inline SVG or `public/Icons/` reference |
| 13.6 | Atom imports use barrel (`from '../atoms/Button'`) | | Direct file path import |

**Exceptions — raw HTML correct inside:** the atom's own .astro, FormField.astro, structural wrappers (`<div>`, `<section>`), icon containers where SVG IS the content.

---

## Section 14: Assistive Technology Confirmation

**No custom JS shim needed.** OS-level AT (iOS Switch Control, Windows Eye Control, Android Switch Access, eye gaze, head trackers) translates input into standard `focus` / `click` / `keydown` events before the browser sees them. The browser accessibility tree exposes semantic HTML and ARIA to the OS automatically.

**The platform's job is to ensure the HTML is correct so the browser can do its job:**

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 14.1 | Semantic HTML elements used (`<nav>`, `<main>`, `<button>`, `<a>`, not `<div onclick>`) | | Divs/spans with JS handlers acting as buttons/links |
| 14.2 | ARIA roles only where semantic HTML isn't possible | | `role="button"` on an element that could be `<button>` |
| 14.3 | `aria-label` or `aria-labelledby` on elements without visible text | | Icon button with no label |
| 14.4 | `aria-expanded` / `aria-controls` on disclosure widgets | | Accordion/dropdown without state communication |
| 14.5 | `aria-live` regions for dynamic content updates | | Content changes without announcing |
| 14.6 | `aria-hidden="true"` on all decorative elements | | Decorative image/icon exposed to AT |
| 14.7 | Focus management correct for modals/panels (trap, return) | | Focus escapes modal or doesn't return on close |
| 14.8 | Skip links present for page-level navigation | | No "skip to content" link |
| 14.9 | Language attribute set on `<html>` | | Missing `lang="en"` |
| 14.10 | Heading hierarchy correct (no skipped levels) | | h1 → h3 with no h2 |

**Why this works without a shim:** The browser's accessibility tree reads these attributes and exposes them via platform APIs (UI Automation on Windows, NSAccessibility on macOS, AT-SPI on Linux). Switch Control, eye gaze, and head trackers all consume these APIs. If the HTML is right, the AT works. The platform never needs to detect or adapt to specific AT devices.

---

## Section 15: Print Render

For components that contain user content, therapeutic evidence, or completed exercises.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 15.1 | Component has `@media print` rules (or inherits from global print stylesheet) | | No print consideration |
| 15.2 | Decorative elements hidden in print (`display: none` in print media) | | Background patterns, particle effects print |
| 15.3 | Interactive elements render as static content in print | | Button prints as clickable-looking element with no URL |
| 15.4 | Links show URL after link text in print | | Link text with no visible destination |
| 15.5 | Colour scheme prints legibly on white paper | | Dark theme colours on white background = invisible |
| 15.6 | Page breaks don't split content mid-component | | Card split across two pages |
| 15.7 | Evidence/traceability IDs visible in print output | | Goal ID, seat ID, timestamp not shown |
| 15.8 | AAC pictogram cards print with symbol + word label | | Symbol only or word only |

---

## Section 16: Atom Inheritance Verification

For components that use atoms (Button, Icon, Image, Link, Text, Heading, FormField).

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 16.1 | Atom-level touch target sizing propagates into this component | | Component overrides atom's min-width/height |
| 16.2 | Atom-level focus styles propagate (not overridden) | | Component sets `outline: none` on atom's element |
| 16.3 | Atom-level aria attributes not overridden | | Component removes or replaces atom's aria-label |
| 16.4 | Atom-level `data-semantic-role` preserved | | Component strips it |
| 16.5 | Atom-level assistive render scaling works within this component | | Atom grows to 64px but component's container clips it |
| 16.6 | Atom-level alt text display modes work within component layout | | Alt text overlay clipped by component overflow:hidden |

---

## Edge Cases to Flag

During audit, note any component that matches these — they need special attention:

- [ ] SVG morphs with alt text at 200% text size
- [ ] Scrollytelling in static fallback at 200% text
- [ ] Grid layouts that carry semantic meaning (comparison tables, before/after)
- [ ] Components with both hover AND animation interactions (double gating)
- [ ] Components with fixed pixel sizing anywhere
- [ ] Components where single-column stacking changes reading order
- [ ] Components with iframes or embedded third-party content
- [ ] Components that lazy-load content (IntersectionObserver) — does AT find it?
- [ ] Components with custom scrolling (parallax, scroll-jacking)
- [ ] Components that use `position: fixed` or `position: sticky` — behaviour at 200% text

---

## Setting Names Reference (Not Disability Labels)

| Internal term | User-facing name | What it does |
|---|---|---|
| `full` render | Default | All features active |
| `reduced` render / Calm mode | Calm Mode | No animations, no transitions |
| `assistive` render | Easy Click | Large targets, no hover, single-column, dedicated nav |
| `textonly` render | Reading Mode | Text only, no images, no visual chrome |
| High contrast | Bold Colours | Increased contrast via token overrides |
| Text size above threshold | (Part of text slider) | Triggers layout reflow + nav collapse |
| Highlight links | (Toggle) | Global link visibility enhancement |
| Colour vision filters | (Per-filter toggle) | Protanopia, deuteranopia, tritanopia |
| Enhanced scrollbar | (Toggle) | OverlayScrollbars replacement |

Panel name: **Your View** | Icon: **Eye**

---

## Quick Fail Reference

Stop and fix before continuing:

| What you found | Immediate action |
|----------------|-----------------|
| `<style>` block in .astro | Extract to ComponentName.css |
| `@layer` wrapper | Remove wrapper, keep rules |
| `!important` | Fix specificity at source |
| `.a11y-*` selector | Delete rule block (dead code) |
| `#a11y-content-wrapper` | Delete rule block (dead code) |
| `.dark-theme` selector | Extract to theme-luminance-dark.css |
| `highlight-links` selector | Extract to highlight-links.css |
| a11y.css file present | Run 6-step extraction, move to `_reference/` |
| Ambient `transition:` in base | Gate behind modifier class |
| `fetch()` for Lottie in client | Move to server-side `animationData` prop |
| Hover tooltip without `:focus-within` | Add `:focus-within` selector |
| Missing `tabindex="0"` on focusable figure | Add it |
| `public/Icons/` reference | Replace with Icon atom from API |
| Old colour token (`--color-Primary-400`) | Replace with `--brand-c-*` |
| `<div onclick>` acting as button | Replace with `<button>` or `<Button>` atom |
| Missing `aria-label` on icon button | Add label |
| `tabindex` > 0 | Change to 0 and fix DOM order |

---

## Verdict Template

Copy into `src/components/audit-log.md`:

```
| ComponentName | pass/fail | date | [notes] |
```

**Notes should record:** rules extracted and targets, `_reference/` moves, pending items, structural issues, decisions (e.g. `textonly: null` confirmed), edge cases flagged, settings combinations that need re-testing after fixes