# Component Audit — Post-Atom Checklist

**What this document is:** The canonical checklist for auditing molecules, organisms, layouts, and any non-atom component. Claude Code runs the pre-audit checks and writes a summary. Natasha passes the summary + files to Claude (app) for verification. Together they agree on the fix list. Claude Code executes.

**Prerequisite:** All 12 atoms are pass 2 clean. This checklist assumes atoms are the trusted foundation — molecules build on them, never around them.

**Last updated:** 10 March 2026

---

## Workflow

```
1. Claude Code reads this checklist + component files
2. Claude Code writes a pre-audit summary (template below)
3. Natasha sends summary + files to Claude (app)
4. Claude (app) verifies findings, flags anything missed
5. Both agree on fix list
6. Claude Code executes fixes
7. Natasha uploads updated files for verification
```

**Audit order:** Bottom-up by dependency. Audit molecules that only use atoms first, then molecules that compose other molecules, then organisms. This prevents re-auditing when a dependency changes.

---

## Pre-Audit Summary Template

Claude Code fills this out per component:

```markdown
# Pre-Audit: [ComponentName]

## File Inventory
- [ ] ComponentName.astro
- [ ] ComponentName.css (or .style.css — flag for rename)
- [ ] ComponentName.responsive.css (if exists)
- [ ] ComponentName.schema.json (if exists — flag if missing)
- [ ] index.ts (if exists)
- [ ] Legacy files: ComponentName.a11y.css, ComponentName.a11y.recovery.css (flag for extraction)

## Section 1: Atom Usage
- Uses Text atom: yes/no (list where)
- Uses Heading atom: yes/no (list where)
- Uses Button atom: yes/no
- Uses Badge atom: yes/no
- Uses Link atom: yes/no
- Uses Icon atom: yes/no
- Uses Image atom: yes/no
- Uses Card atom: yes/no
- Uses List atom: yes/no
- Uses FormField atom: yes/no
- Uses Tooltip atom: yes/no
- Uses LottieIcon atom: yes/no
- Raw HTML that should be an atom: (list any <p>, <h1-6>, <img>, <a>, <button>, <span> with text that bypass atoms)

## Section 2: Banned Patterns
- [ ] No `@layer` wrappers
- [ ] No `!important`
- [ ] No `@media (prefers-reduced-motion)` in component CSS
- [ ] No `.a11y-*` class selectors
- [ ] No `#a11y-content-wrapper` references
- [ ] No scoped `<style>` blocks in .astro
- [ ] No `:global()` selectors
- [ ] No `var(--token, #hex)` hardcoded fallbacks
- [ ] No `--zone-bg-*` or `--zone-pattern-*` references
- [ ] No `--confetti-*` references (remapped to rainbow)
- [ ] No direct `--brand-c-*` without prop-layer wrapper
- [ ] No `.filter(Boolean).join(' ')` or `.filter(Boolean)` in class building
- [ ] No `.style.css` filename (rename to `.css`)
- [ ] No `.a11y.css` / `.a11y.recovery.css` (extract via 6-step process, move to `_reference/`)

## Section 3: Token Routing
- Internal `--_component-*` tokens for ALL visual properties: yes/no (list)
- Bridge `--component-*` tokens in base selector: yes/no
- Raw `var(--brand-c-*)` or `var(--page-bg-*)` outside token block: (count — should be 0)
- Render modes override internal tokens: yes/no
- Colour group in schema with `cssProperty` fields: yes/no
- Self-referential token bug: (check for `--_x: var(--_x)`)
- Priority chain correct (render mode > JSON > defaults): yes/no

## Section 4: CSS Quality
- class:list or manual string building: which
- Hardcoded values: (list with line numbers)
- Transitions tokenised: yes/no
- font-weight/font-family tokenised: yes/no

## Section 5: Script Quality (if component has `<script>`)
- `querySelectorAll` / `querySelector` use `<HTMLElement>` generic: yes/no/N/A
- Non-null assertions (`!`) on querySelector results inside closures: yes/no/N/A
- No implicit `any` on callback parameters: yes/no/N/A
- `dataset` / `style` access only on HTMLElement-typed variables: yes/no/N/A

## Section 6: Render Modes
- Schema `renders` block: present/missing
- `[data-render]` CSS blocks: list which exist
- Pipeline prop stripping documented: yes/no
- Animation gated by prop → class: yes/no
- Pipeline routing (renders values pointing to atom names): yes/no/N/A

## Section 7: Accessibility
- aria attributes present: (list)
- Decorative elements marked aria-hidden: yes/no
- Focus management: describe
- Semantic HTML elements: list

## Section 8: Schema Completeness
- Category: value
- Notes: present/missing, render behaviour documented
- Props grouped: content/visual/animation/colour
- Colour group: present/missing
- `textonly` flags on decorative props: yes/no
- Slots documented: yes/no

## Section 9: Atom-Specific Checks
- Image alt text: does this component pass altWord/altDescriptive/altAacHtml correctly?
- Badge in Card: if Badge overlays Image, is Badge.label in Image alt text flow?
- Icon aria-hidden: are decorative icons marked correctly?
- Text atom composition: all visible text rendered through Text/Heading atoms?
- Context overrides: does this component have rules in Heading.css or Text.css that need migrating to props?
- Tooltip consumer: does this component use `data-tooltip` or `title` attrs that should be `<Tooltip>`?

## Section 10: Index Barrel (index.ts)
- CSS side-effect imports first (base, then responsive): yes/no/missing
- Named exports: component + schema: yes/no
- No default exports: yes/no
- No re-exports of internal helpers: yes/no

## Section 11: Accessibility Baseline
- Decorative icons have `aria-hidden="true"`: yes/no
- `data-semantic-role` on image/icon elements: yes/no
- All interactive elements keyboard-reachable: yes/no
- No hover-only content without `:focus-within`: yes/no
- `tabindex="0"` on non-interactive elements needing focus: yes/no/N/A
- Focus indicators visible (min 2px): yes/no
- Tab order matches visual reading order: yes/no
- No `tabindex` values > 0: yes/no
- No colour-only information encoding: yes/no
- Text contrast meets WCAG AA: yes/no

## Section 12: AT Confirmation
- Semantic HTML elements used (not `<div onclick>`): yes/no
- ARIA roles only where semantic HTML isn't possible: yes/no
- `aria-label` / `aria-labelledby` on elements without visible text: yes/no/N/A
- `aria-expanded` / `aria-controls` on disclosure widgets: yes/no/N/A
- `aria-live` regions for dynamic content: yes/no/N/A
- `aria-hidden="true"` on decorative elements: yes/no
- Focus management for modals/panels: yes/no/N/A
- Heading hierarchy correct (no skipped levels): yes/no

## Section 13: Print Render
- Print rules present (or inherits from global print stylesheet): yes/no/N/A
- Decorative elements hidden in print: yes/no/N/A
- Interactive elements render as static in print: yes/no/N/A
- Links show URL after link text in print: yes/no/N/A
- Colour scheme prints legibly on white paper: yes/no
- Page breaks don't split content mid-component: yes/no/N/A

## Section 14: Hover Gate
- Component has `:hover` rules: yes/no
- Decorative hovers read `--hover-duration` / `--hover-duration-fast` tokens: yes/no
- `[data-hover="none"]` block resets all hover properties to default state: yes/no
- Functional hovers (tooltip reveal, dropdown open) left ungated: yes/no/N/A
- Hover independent from animation prop: yes/no
- No hardcoded transition durations on hover properties: yes/no
- Highlight link check (if component renders links):
  - Links respond to `[data-highlight="static"]` / `[data-highlight="animated"]`: yes/no/N/A

## Section 15: Atom Inheritance Verification
- Atom touch target sizing propagates (not overridden): yes/no
- Atom focus styles propagate (not overridden): yes/no
- Atom aria attributes not overridden: yes/no
- Atom `data-semantic-role` preserved: yes/no/N/A
- Atom assistive render scaling works within component: yes/no
- Atom alt text display modes work within component layout: yes/no/N/A

## Findings Summary
| # | Issue | Severity | Fix |
|---|---|---|---|
| 1 | | | |

## Deferred Items
| # | Item | Blocked by |
|---|---|---|
| 1 | | |
```

---

## Section-by-Section Checklist Detail

### 1. Atom Usage — Does It Compose Correctly?

Molecules MUST use atoms for content rendering. Every piece of visible content should flow through the audited atom system.

**Check for raw HTML that bypasses atoms:**

| Raw HTML | Should be | Why |
|---|---|---|
| `<p>`, `<span>` with text | `<Text as="p/span">` | Typography tokens, render mode handling |
| `<h1>`–`<h6>` | `<Heading level={n}>` | Typography tokens, decoration system |
| `<a href>` | `<Link href>` or `<Button href>` | Animation gating, render mode, colour tokens |
| `<button>` | `<Button>` | Effect gating, render mode, colour tokens |
| `<img>` | `<Image>` | Alt text system, render modes, theme filters |
| `<ul>`, `<ol>` | `<List>` | Marker system, render modes |
| `<input>`, `<select>`, `<textarea>` | `<FormField>` | Only atom allowed raw inputs |
| `<small>` | `<Text as="small">` | Typography tokens |
| `<blockquote>` | `<Text as="blockquote">` | Typography tokens, border accent |

**Exceptions — raw HTML is acceptable when:**
- The element is purely structural (a `<div>` wrapper for layout)
- The element is inside an atom's slot (atom handles the rendering)
- The element is a `<nav>`, `<header>`, `<footer>`, `<main>`, `<section>`, `<article>` (semantic landmarks)

### 2. Banned Patterns

Identical to atom audit, plus molecule-specific patterns. Any component with these needs them removed:

- `@layer` wrappers
- `!important` declarations
- `@media (prefers-reduced-motion)` in component CSS
- `.a11y-*` class selectors
- `#a11y-content-wrapper` references
- Scoped `<style>` blocks in `.astro` files
- `:global()` selectors
- `var(--token, #hex)` hardcoded hex fallbacks
- `--zone-bg-*` or `--zone-pattern-*` references
- `--confetti-*` references in component CSS
- Direct `--brand-c-*` references without prop-layer wrapper
- `.filter(Boolean).join(' ')` or `.filter(Boolean)` in class arrays (use `class:list` with `&&`)
- `.style.css` filename convention (rename to `.css`)

**Legacy a11y files:** If the component has `.a11y.css` or `.a11y.recovery.css`, follow the 6-step extraction process in CLAUDE.md. Never delete — extract rules to zone files, then move originals to `_reference/`.

### 3. Token Routing

**Every molecule MUST have internal tokens for all visual properties.** Not just colour — bg, border, shadow, text, sizing. This enables JSON override AND render mode gating.

**Token chain pattern:**
```css
.component {
  /* Bridge → internal (one per visual property) */
  --_comp-bg: var(--comp-bg, var(--page-bg-sunken));
  --_comp-shadow: var(--comp-shadow, var(--shadow-md));
  --_comp-text: var(--comp-text, var(--brand-c-text));
}
```

**Rules:**
1. Define internal `--_component-*` tokens in the base selector
2. Every consumption point uses internal tokens — never raw `var(--brand-c-*)` or `var(--page-bg-*)` directly
3. Raw bridge chains only in the base token block
4. Schema `colour` group declares ALL pipeline-overridable tokens with `cssProperty` field
5. Watch for the self-referential token bug: `--_comp-x: var(--_comp-x)` — WRONG. Must be `--_comp-x: var(--comp-x, var(--fallback))`
6. Render modes override internal tokens (higher specificity wins over JSON):
```css
[data-render="reduced"] .component { --_comp-shadow: none; }
[data-render="textonly"] .component { --_comp-bg: transparent; }
```
7. Priority: render mode > JSON/pipeline > CSS defaults

**Why this matters:** Without internal tokens, render modes can't suppress visual properties, JSON can't override colours, and dark mode can't adapt. The token chain is the foundation for everything.

### 4. CSS Quality

- **class:list:** Use Astro's `class:list={[...]}` with falsy-friendly `&&`, not `.filter(Boolean).join(' ')`
- **Transitions:** Must use tokens (`var(--transition-fast)`, `var(--transition-base)`, etc.), not hardcoded durations
- **Font properties:** `font-weight` and `font-family` must use tokens, not numeric values or raw names
- **Hardcoded values:** Flag anything that's not in the documented exceptions list

**Documented exceptions (acceptable hardcoded values):**
- `0`, `none`, `100%`, `auto`, `1px` borders, unitless values
- `em`-based relative sizing on decorative elements
- Drawing geometry (tick positioning, radio dots, control sizes)
- `opacity` values where no token exists
- SVG fills in data URIs (CSS vars don't work)
- Values below the token scale floor (200px/350px breakpoints)
- `min-height` on textarea, touch target minimums
- Micro-spacing on decorative elements (`margin-left: 2px`)
- `color-mix()` percentages
- `saturate()` values in glass effects
- Typographic fine-tuning (underline-offset, decoration-thickness)

### 5. Script Quality

If the component has a `<script>` block, check for TypeScript correctness:

- `querySelectorAll` / `querySelector` must use `<HTMLElement>` generic — bare `Element` type lacks `.dataset`, `.style`
- Non-null assertions (`!`) needed on `querySelector` results used inside closures (TS can't narrow across function boundaries)
- No implicit `any` on callback parameters (e.g. `.map((item) =>` needs type annotation)
- `dataset` and `style` access only on `HTMLElement`-typed variables, not bare `Element`

### 6. Render Modes

**Pipeline handles most of it:**
- Full → content + visual + animation
- Reduced → content + visual (animation stripped)
- Assistive → content + visual (filtered for large targets)
- Textonly → content only (visual stripped)

**Component CSS may need `[data-render]` blocks when:**
- The component's layout needs structural changes per render (e.g. Card strips chrome in textonly, Tooltip becomes static bar in assistive)
- Glass/neumorphic/glow effects need explicit fallback (e.g. FormField glass → outlined in reduced)

**Component CSS does NOT need `[data-render]` blocks when:**
- Animation is purely prop-gated (no prop = no class = no motion)
- Visual differences are handled by pipeline prop stripping
- The component renders in all modes via the same Astro template with no structural differences

**Pipeline routing in schema:**
- `renders` values can be atom names (e.g. `"Text"`, `"Icon"`) not just `.astro` files
- Decorative molecules may use `"textonly": null` (skip entirely in reading mode)
- Complex molecules may route sub-content to different atoms per render mode

### 7. Accessibility

- Decorative elements: `aria-hidden="true"`
- Interactive elements: proper `role`, `tabindex`, keyboard handling
- Images: `alt` text, `semanticRole` passed through
- Focus: visible focus indicators using tokens
- Card links: if the whole card is clickable, one `<a>` wraps or a stretched link pattern
- Form controls: `aria-describedby`, `aria-invalid`, `aria-label` where needed

### 8. Schema Completeness

Must match established atom schema patterns:

```json
{
  "component": "Name",
  "category": "molecule" | "organism" | "layout",
  "renders": { "full": "...", "reduced": "...", "assistive": "...", "textonly": "..." },
  "notes": "Description including render mode behaviour.",
  "props": {
    "content": { "_description": "...", ... },
    "visual": { "_description": "...", ... },
    "animation": { "_description": "...", ... },
    "colour": { "_description": "...", ... }
  }
}
```

**Textonly flags:** Decorative props (icons, images, animations) should have `"textonly": false` so the pipeline strips them.

### 9. Atom-Specific Cross-Checks

These are the deferred items from the atom audit that get resolved during molecule audits:

**Image alt text flow:**
- If the molecule renders Badge + Image, does Badge.label appear in the document flow for screen readers?
- Does the molecule pass `semanticRole` to Image correctly?
- In textonly, does meaningful Image content get `data-alt-display-mode="replace"`?

**Heading context overrides:**
- Does Heading.css still have `.card .heading` / `nav .heading` / `.expandable-item .heading` context overrides?
- If this molecule is a consumer, migrate to passing `size`/`weight` props instead of relying on CSS context overrides
- Track which consumers are migrated — when all are done, delete the override rules from Heading.css

**Card legacy primitives:**
- Card.css had `.card__heading`, `.card__badge`, `.card__button` primitives (deleted in pass 1)
- If this molecule was using those classes, it needs migrating to actual Heading/Badge/Button atoms
- Check `_reference/Card/Card.a11y.css` for molecule-specific rules that need extracting

**Raw `<img>` in Heading media slot:**
- Heading.astro still uses `<img>` not `<Image>` for the media slot
- If this molecule passes an image to Heading, the raw `<img>` limitation applies until the cross-atom fix

**Tooltip consumer migration:**
- Elements with `data-tooltip` or `title` attributes → `<Tooltip purpose="label">`
- Icon-only buttons with `aria-label` → wrap in `<Tooltip purpose="label">`
- Check if consumer duplicates tooltip positioning JS (should use Tooltip atom's script)

### 10. Index Barrel (index.ts)

Every component should have a clean barrel file:

- CSS side-effect imports first (base, then responsive)
- Named exports for component + schema
- No default exports
- No re-exports of internal helpers

### 11. Accessibility Baseline (Every Component)

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 11.1 | Decorative icons have `aria-hidden="true"` | | Icon rendered without it |
| 11.2 | `data-semantic-role` on image/icon elements | | Missing — should be `decorative`, `ui-control`, or `content-symbol` |
| 11.3 | All interactive elements keyboard-reachable | | Div/span with click but no tabindex/role |
| 11.4 | No hover-only content without `:focus-within` equivalent | | Tooltip only on `:hover` |
| 11.5 | `tabindex="0"` on non-interactive elements needing focus | | Figure with tooltip but no tabindex |
| 11.6 | Focus indicators visible (min 2px, sufficient contrast) | | `outline: none` without replacement |
| 11.7 | Tab order matches visual reading order | | Focus jumps or skips |
| 11.8 | No `tabindex` values > 0 | | `tabindex="2"` etc. |
| 11.9 | No colour-only information encoding | | Status shown by colour alone with no text/icon |
| 11.10 | Text contrast meets WCAG AA (4.5:1 normal, 3:1 large) | | Low contrast text on themed backgrounds |

### 12. Assistive Technology Confirmation

**No custom JS shim needed.** OS-level AT (iOS Switch Control, Windows Eye Control, Android Switch Access, eye gaze, head trackers) translates input into standard `focus` / `click` / `keydown` events before the browser sees them. The browser accessibility tree exposes semantic HTML and ARIA to the OS automatically.

**The platform's job is to ensure the HTML is correct so the browser can do its job:**

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 12.1 | Semantic HTML elements used (`<nav>`, `<main>`, `<button>`, `<a>`, not `<div onclick>`) | | Divs/spans with JS handlers acting as buttons/links |
| 12.2 | ARIA roles only where semantic HTML isn't possible | | `role="button"` on an element that could be `<button>` |
| 12.3 | `aria-label` or `aria-labelledby` on elements without visible text | | Icon button with no label |
| 12.4 | `aria-expanded` / `aria-controls` on disclosure widgets | | Accordion/dropdown without state communication |
| 12.5 | `aria-live` regions for dynamic content updates | | Content changes without announcing |
| 12.6 | `aria-hidden="true"` on all decorative elements | | Decorative image/icon exposed to AT |
| 12.7 | Focus management correct for modals/panels (trap, return) | | Focus escapes modal or doesn't return on close |
| 12.8 | Heading hierarchy correct (no skipped levels) | | h1 → h3 with no h2 |

**Why this works without a shim:** The browser's accessibility tree reads these attributes and exposes them via platform APIs (UI Automation on Windows, NSAccessibility on macOS, AT-SPI on Linux). Switch Control, eye gaze, and head trackers all consume these APIs. If the HTML is right, the AT works.

### 13. Print Render

For components that contain user content, therapeutic evidence, or completed exercises.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 13.1 | Component has `@media print` rules (or inherits from global print stylesheet) | | No print consideration |
| 13.2 | Decorative elements hidden in print (`display: none` in print media) | | Background patterns, particle effects print |
| 13.3 | Interactive elements render as static content in print | | Button prints as clickable-looking element with no URL |
| 13.4 | Links show URL after link text in print | | Link text with no visible destination |
| 13.5 | Colour scheme prints legibly on white paper | | Dark theme colours on white background = invisible |
| 13.6 | Page breaks don't split content mid-component | | Card split across two pages |
| 13.7 | Evidence/traceability IDs visible in print output | | Goal ID, seat ID, timestamp not shown |
| 13.8 | AAC pictogram cards print with symbol + word label | | Symbol only or word only |

### 14. Hover Gate

Every component with `:hover` rules must read the hover gate tokens so `data-hover="none"` suppresses decorative hover globally.

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 14.1 | Component has `:hover` rules | | — (audit only, not a pass/fail) |
| 14.2 | Decorative hover transitions use `var(--hover-duration)` / `var(--hover-duration-fast)` | | Hardcoded `0.3s ease` or `var(--transition-base)` on hover properties |
| 14.3 | `[data-hover="none"]` block resets ALL hover properties to default state | | Hover colour/shadow/transform still changes with `data-hover="none"` on body |
| 14.4 | `box-shadow` and `transform` included in transition shorthand | | Shadow/transform animates outside duration token control |
| 14.5 | Functional hovers (content reveal) left ungated | | Tooltip or dropdown suppressed by hover gate |
| 14.6 | Hover is independent from animation prop | | Hover suppressed when only animation is stripped |
| 14.7 | Links respond to `[data-highlight="static/animated"]` | | Link-containing component ignores highlight mode (N/A if no links) |

**Quick fail:** Any `:hover` rule with a hardcoded duration → replace with `var(--hover-duration)`. Any `:hover` that changes visual properties → add `[data-hover="none"]` reset block.

### 15. Atom Inheritance Verification

For components that use atoms (Button, Icon, Image, Link, Text, Heading, FormField, Card, Badge, Tooltip, List, LottieIcon).

| # | Check | Pass | Fail indicator |
|---|-------|------|---------------|
| 15.1 | Atom-level touch target sizing propagates into this component | | Component overrides atom's min-width/height |
| 15.2 | Atom-level focus styles propagate (not overridden) | | Component sets `outline: none` on atom's element |
| 15.3 | Atom-level aria attributes not overridden | | Component removes or replaces atom's aria-label |
| 15.4 | Atom-level `data-semantic-role` preserved | | Component strips it |
| 15.5 | Atom-level assistive render scaling works within this component | | Atom grows to 64px but component's container clips it |
| 15.6 | Atom-level alt text display modes work within component layout | | Alt text overlay clipped by component overflow:hidden |

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
| Hardcoded duration on `:hover` transition | Replace with `var(--hover-duration)` |
| `:hover` with no `[data-hover="none"]` reset | Add gate block resetting to default state |
| `var(--transition-base)` on hover transition | Replace with `var(--hover-duration)` |

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

## Component Inventory (verified from filesystem)

### Atoms (12 — all pass 2 clean)

Badge, Button, Card, FormField, Heading, Icon, Image, Link, List, LottieIcon, Text, Tooltip

### Molecule Cards (21 — was 22, AssetCard deleted)

| Component | Location | Legacy files? | Status |
|---|---|---|---|
| ~~AssetCard~~ | ~~`molecules/cards/`~~ | — | **DELETED** 2026-03-16 — not a molecule, compose in section organism |
| AuthorCard | `molecules/cards/AuthorCard/` | No | **PASS** 2026-03-16 |
| BlogCard | `molecules/cards/BlogCard/` | No | **PASS** 2026-03-16 |
| ChoiceCard | `molecules/cards/ChoiceCard/` | No | **PASS** 2026-03-16 |
| CompactToolCard | `molecules/cards/` | No | pending |
| FlipCard | `molecules/cards/` | No | pending |
| GlowCard | `molecules/cards/` | No | pending |
| ImageRevealCard | `molecules/cards/` | No | pending |
| InfoCard | `molecules/cards/` | No | pending |
| InsightCard | `molecules/cards/` | No | pending |
| MasonryCard | `molecules/cards/` | No | pending |
| OfferingCard | `molecules/cards/` | No | pending |
| ProductCard | `molecules/cards/` | No | pending |
| ProjectCard | `molecules/cards/` | No | pending |
| ProjectSpecCard | `molecules/cards/` | No | pending |
| RainbowBorderCard | `molecules/cards/RainbowBorderCard/` | No | **PASS** 2026-03-16 |
| SlideCard | `molecules/cards/` | No | pending |
| SpecCard | `molecules/cards/` | No | pending |
| StepCard | `molecules/cards/` | No | pending |
| TeamCard | `molecules/cards/` | No | pending |
| TestimonialCard | `molecules/cards/` | No | pending |
| WhyCard | `molecules/cards/` | No | pending |

### Molecule Sections (3)

| Component | Location |
|---|---|
| CalloutSection | `molecules/sections/` |
| QuoteSection | `molecules/sections/` |
| TextSection | `molecules/sections/` |

### Molecule Navigation (2)

| Component | Location |
|---|---|
| Breadcrumbs | `molecules/nav/` |
| SideTabs | `molecules/nav/` |

### Molecule Menus (3 — all have legacy a11y files)

| Component | Location | Legacy files |
|---|---|---|
| DPadMenu | `molecules/Menu/DPadMenu/` | `.a11y.css`, `.a11y.recovery.css`, `.style.css` |
| RadialMenu | `molecules/Menu/RadialMenu/` | `.a11y.css`, `.a11y.recovery.css`, `.style.css` |
| ShareMenu | `molecules/SocialMedia/ShareMenu/` | None — **PASS** 2026-03-10 |

### Molecule Effects (2 — all have legacy files)

| Component | Location | Legacy files |
|---|---|---|
| ConnectorTimeline | `molecules/effects/ConnectorTimeline/` | `.a11y.css`, `.style.css` |
| LiquidRevealZone | `molecules/effects/LiquidReveal/` | `.a11y.css`, `.style.css` |

### Molecule Switchers (4)

| Component | Location |
|---|---|
| BaseSwitcher | `molecules/switcher/` |
| BasicFilterSwitcher | `molecules/switcher/` |
| ContentSwitcher | `molecules/switcher/` |
| IsotopeFilterSwitcher | `molecules/switcher/` |

### Molecule Other (9)

| Component | Location | Legacy files |
|---|---|---|
| Toast | `molecules/Toast/` | — |
| GalleryItem | `molecules/gallery/` | `.a11y.css`, `.a11y.recovery.css`, `.style.css` — **NO .astro file (orphaned CSS)** |
| ImageOverlay | `molecules/media/ImageOverlay/` | `.a11y.css`, `.a11y.recovery.css` |
| TimelineStepper | `molecules/timeline/` | — |
| CartIcon | `molecules/shop/` | — |
| ContactInfo | `molecules/contact/` | — |
| ContactPopup | `molecules/contact/` | — |
| AnnouncementTicker | `molecules/global/` | — |
| CookieBanner | `molecules/global/` | — |
| DownloadSummary | `molecules/checkout/` | — |
| InsightContent | `molecules/insights/` | — |
| InsightHeader | `molecules/insights/` | — |
| ProductInfo | `molecules/product/` | — |

### Effects (7 — standalone visual layer, not molecules)

| Component | Location |
|---|---|
| DrawSVGIcon | `effects/DrawIcon/` |
| ScrollDrawIcon | `effects/DrawIcon/` |
| PagePatternLayer | `effects/PagePatternLayer/` |
| ParallaxDecor | `effects/ParallaxDecor/` |
| PatternOverlay | `effects/PatternOverlay/` |
| PhysicsOverlay | `effects/PhysicsOverlay/` |
| RevealCanvas | `effects/RevealCanvas/` |
| ScrollColorBackground | `effects/ScrollColorBackground/` |

### Organisms — Navigation (3)

| Component | Location |
|---|---|
| GlassNav | `organisms/nav/` |
| ReaderNav | `organisms/nav/` |
| LegalNav | `organisms/nav/` |

### Organisms — Grids (6)

| Component | Location |
|---|---|
| Grid | `organisms/Grid/` |
| ForYouGrid | `organisms/grids/` |
| MasonryGrid | `organisms/grids/` |
| ProjectSpecGrid | `organisms/grids/` |
| RelatedGrid | `organisms/grids/` |
| SpecGrid | `organisms/grids/` |

### Organisms — Sections (15)

| Component | Location |
|---|---|
| CTASection | `organisms/sections/` |
| CompareSection | `organisms/sections/` |
| EndSection | `organisms/sections/` |
| FullWidthSection | `organisms/sections/` |
| GallerySection | `organisms/sections/` |
| HeroMorphAnimation | `organisms/sections/` |
| ImageTextSection | `organisms/sections/` |
| PhilosophyFlipCardsSection | `organisms/sections/` |
| PillarsSection | `organisms/sections/` |
| PresentationImageTextSection | `organisms/sections/` |
| ServiceDetails | `organisms/sections/` |
| ShareSection | `organisms/sections/` |
| StatsSection | `organisms/sections/` |
| StorySection | `organisms/sections/` |
| ValuesSection | `organisms/sections/` |
| WhoSliderSection | `organisms/sections/` |

### Organisms — Other (8)

| Component | Location |
|---|---|
| Footer | `organisms/Footer/` |
| IconScrollStage | `organisms/IconScrollStage/` |
| ScrollMorphZone | `organisms/ScrollMorph/` |
| ContactForm | `organisms/contact/` |
| Reader | `organisms/presentation/` |
| PresentationEndSection | `organisms/presentation/` |
| IsotopeImageGallery | `organisms/product/` |
| ProductGallery | `organisms/product/` |
| SearchResults | `organisms/search/` |
| MiniCart | `organisms/shop/` |

### YourView Panel (11 components)

| Component | Location |
|---|---|
| AccessibilityPanel | `YourView/` |
| A11yNavigationSection | `YourView/` |
| AltTextCard | `YourView/` |
| FontCard | `YourView/` |
| ToggleCard | `YourView/` |
| ThemeSidebar | `YourView/` |
| TypographyAdjustmentsSection | `YourView/` |
| TypographySection | `YourView/` |
| VisualSection | `YourView/` |
| Announcer | `YourView/Announcer/` |
| PresetButton | `YourView/PresetButton/` |
| Stepper | `YourView/Stepper/` |

### Legacy / Misplaced (need relocating or deprecating)

| Component | Location | Action |
|---|---|---|
| SectionTitle | `Typography/` | **Deprecate** — migrate consumers to `<Heading>`, then delete |
| InsightAuthorSection | `Insights/` | Move to `organisms/sections/` or `molecules/insights/` |
| `Sections/index.ts` | `Sections/` | Barrel re-export — check if still needed, likely dead |
| `Presentation/Sections/index.ts` | `Presentation/` | Barrel re-export — check if still needed, likely dead |

### Empty Directories (delete)

| Directory | Contents |
|---|---|
| `molecules/a11y/` | Empty — old a11y molecule location, never populated |
| `organisms/a11y/` | Empty — old a11y organism location, never populated |

### Orphaned CSS (no .astro file)

| Files | Location | Action |
|---|---|---|
| `GalleryItem.style.css`, `.a11y.css`, `.a11y.recovery.css`, `.responsive.css` | `molecules/gallery/` | Extract any useful rules to `_reference/`, delete directory |
| ~~`asset-detail.a11y.css`~~ | ~~`molecules/cards/`~~ | **DELETED** 2026-03-16 — orphaned, targeted different component |

---

## Zone-Gated Concerns (not component props)

Components do NOT have props for these. They respond to global data attributes:

| Concern | Zone file | Trigger |
|---|---|---|
| High contrast | `src/styles/zones/high-contrast.css` | `[data-high-contrast]` |
| Dark mode | `src/styles/zones/theme-luminance-dark.css` | `[data-mode="dark"]` |
| Highlight links | `src/styles/global/highlight-links.css` | `[data-highlight-links]` |

If a molecule needs dark mode or HC overrides, they go in the zone files — not in the component CSS.

---

## Global Layers Still to Build

These are referenced by deferred items across multiple atoms:

| Layer | File | Status |
|---|---|---|
| AAC global rules | `src/styles/global/aac-mode.css` | Not built — Icon/Image AAC rules need moving here |
| Print | `src/styles/global/print.css` | Not built — thin layer on top of reduced/textonly render |
| JS bundle gating | Pipeline-level | Not built — exclude `<script>` from non-full renders (Tooltip, LottieIcon) |
| `[data-text-xl]` threshold | System-level | Not built — triggers XL text reflow rules in Grid, Image |
| Consumer `<small>`/`<blockquote>` migration | Across molecules | 32+ raw `<small>`, 4 raw `<blockquote>` → `<Text>` |
| Heading context override deletion | Heading.css | After all consuming molecules migrated to props |
| `SectionTitle.astro` deprecation | Consumers | Migrate to `<Heading>`, then delete |

---

## Pattern Quick Reference

### Pipeline Colour Override
```html
<!-- Pipeline generates inline style from schema colour group -->
<div class="component component--variant"
     style="--comp-bg: var(--rainbow-3-dark); --comp-text: var(--text-inverse);">
```

### Internal Token Chain
```css
.component {
  --_comp-bg: var(--comp-bg, var(--brand-c-primary));  /* bridge */
}
.component__child {
  background: var(--_comp-bg);  /* always internal, never raw bridge */
}
```

### Animation Gating
```css
/* Class only exists when JSON has animation prop */
.component--animate .component__child {
  transition: transform var(--transition-base);
}
/* No prop = no class = rule never matches = zero motion */
```

### Render Mode CSS (only when structural)
```css
/* Only needed for structural layout changes */
[data-render="assistive"] .component {
  /* Layout adaptations for large targets */
}
[data-render="textonly"] .component {
  /* Strip chrome, keep content structure */
}
```

### Legacy File Extraction (6-step process)
If the component has `.a11y.css` or `.a11y.recovery.css`:
1. READ the existing files — list every rule
2. CATEGORISE each rule (dark-theme, highlight-links, reduce-motion, etc.) — show table, wait for confirmation
3. WAIT for user confirmation before proceeding
4. EXTRACT rules to confirmed zone files
5. MOVE originals to `_reference/ComponentName/`
6. CLEAN the component — remove @layer wrappers, restructure
