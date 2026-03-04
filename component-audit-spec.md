# Component Audit Spec

**Run this against every component. Update `src/components/audit-log.md` when done.**

Version: March 2026 | Covers render refactor + accessibility + assistive render + alt text

---

## How to Use

1. Open the component folder
2. Work through each section in order — each item is PASS / FAIL / N/A
3. Fix failures before marking the component done
4. Copy the verdict block into `audit-log.md`

Sections 1–6 apply to **every** component.
Section 7 (Alt Text) applies only to **Image** components.
Section 8 (Assistive Render) applies to every component with **interactive elements**.
Section 9 (JS Bindings) applies to every component with **a `<script>` tag**.
Section 10 (Atom Usage) applies to every component that renders **text, links, or buttons**.

---

## Section 1: File Structure

| Check | Pass | Fail indicator |
|-------|------|---------------|
| Folder exists (not loose .astro file) | ✓ | File is a standalone `.astro` in a parent dir |
| `ComponentName.css` exists | ✓ | Missing — styles are in scoped `<style>` or not extracted |
| `ComponentName.responsive.css` exists | ✓ | Missing — even empty file required |
| `ComponentName.schema.json` exists | ✓ | Missing |
| `index.ts` barrel exists | ✓ | Missing |
| No `ComponentName.a11y.css` exists | ✓ | File present — must be extracted then moved to `_reference/` |
| No `ComponentName.a11y.recovery.css` in active folder | ✓ | File present — move to `_reference/` after extracting |
| No `.style.css` naming (use `.css`) | ✓ | File named `Component.style.css` |
| No scoped `<style>` block in `.astro` file | ✓ | `<style>` tag present in .astro |
| `index.ts` has no `a11y.css` imports | ✓ | Line `import './Component.a11y.css'` present |

**If any fail:** Follow the 6-step extraction process in CLAUDE.md before continuing.

---

## Section 2: CSS Rules — Banned Patterns

Grep the component's CSS files for each pattern. All must return zero results.

| Pattern | Grep for | Rule |
|---------|----------|------|
| `@layer` wrappers | `@layer` | Remove wrapper, keep rules |
| `!important` | `!important` | Remove — fix specificity at source |
| `#a11y-content-wrapper` | `a11y-content-wrapper` | Dead — delete the rule block |
| `.a11y-reduce-motion` | `a11y-reduce-motion` | Dead — render pipeline handles this |
| `.a11y-text-only` | `a11y-text-only` | Dead — textonly render omits component |
| `.a11y-highlight-links` | `a11y-highlight-links` | Dead — extract to highlight-links.css |
| `.a11y-high-contrast` | `a11y-high-contrast` | Dead — extract to high-contrast.css |
| `.a11y-theme-*` | `a11y-theme-` | Dead — token-driven theme system |
| `.a11y-cvd-*` | `a11y-cvd-` | Dead — CSS filter system |
| `.plain` | `\.plain` | Dead |
| `@media (prefers-reduced-motion)` | `prefers-reduced-motion` | Dead — render pipeline handles |
| `:global()` in CSS | `:global\(` | Not valid outside scoped styles |
| Dark theme class selectors | `\.dark-theme` | Extract to theme-luminance-dark.css |
| Highlight-links class selectors | `highlight-links` | Extract to highlight-links.css |
| Old numbered palette tokens | `--color-Primary\|--color-Neutral\|--color-AccentOne` | Dead — use `--brand-c-*` tokens |
| Fallback values on brand tokens | `var(--brand-c-[^)]+,\s*#` | Remove fallback — theme guarantees token exists |

---

## Section 3: Animation Gating

**Invariant:** If no animation prop is passed, no motion can occur. No exceptions.

| Check | Pass | Fail indicator |
|-------|------|---------------|
| No ambient `transition:` on base selectors | ✓ | `.component { transition: ... }` in base |
| No ambient `animation:` on base selectors | ✓ | `.component { animation: ... }` in base |
| No ambient `transform:` on hover (without modifier class) | ✓ | `.component:hover { transform: ... }` ungated |
| All transitions are inside `--modifier` classes | ✓ | Transition not wrapped in `.component--modifier { }` |
| Modifier classes map to animation schema props | ✓ | Class exists but no matching schema prop |
| Colour/state changes on hover/focus are OK without modifier | ✓ | (these are not motion, they're fine in base) |

**Naming convention:** `.component--hover-lift`, `.component--animate-slide`, `.component--animate-focus`

**If you find ambient transitions:** Move to a modifier class. Update schema to expose the prop. Document in audit-log.md.

---

## Section 4: Schema

Open `ComponentName.schema.json`.

| Check | Pass | Fail indicator |
|-------|------|---------------|
| Has `"component"` field | ✓ | Missing |
| Has `"category"` field | ✓ | Missing |
| Has `"renders"` block | ✓ | Missing |
| `renders` has `full`, `reduced`, `assistive`, `textonly` keys | ✓ | Missing keys or old 3-key format |
| `textonly: null` for decorative/effect components | ✓ | Decorative component has `textonly: "ComponentName.astro"` |
| Has `"content"` group | ✓ | Props are flat (not grouped) |
| Has `"visual"` group | ✓ | Props are flat |
| Has `"animation"` group (empty `{}` is fine) | ✓ | Animation props mixed into visual/content |
| Content props = text, href, aria labels, data, disabled | ✓ | Visual or animation props in content |
| Visual props = variant, size, shape, colour, icon name | ✓ | Animation props in visual |
| Animation props = hover, transition, scroll, effect, morph, draw, lottie | ✓ | Animation mixed into visual |
| Each animation prop maps to a CSS modifier class | ✓ | Prop exists but no matching CSS class |
| Prop passthrough documented (if component wraps atoms) | ✓ | Button → Icon: morphTo, draw etc. not documented |

**Decorative / effect components** (textonly: null): RevealCanvas, PagePatternLayer, ParallaxDecor, PatternOverlay, PhysicsOverlay, ScrollColorBackground, DrawSVGIcon, ScrollDrawIcon, LiquidRevealZone, IconScrollStage, ScrollMorphZone, ImageOverlay, CustomScrollbar, Icon.

---

## Section 5: Astro Purity

Open `ComponentName.astro`.

| Check | Pass | Fail indicator |
|-------|------|---------------|
| All data arrives via `Astro.props` | ✓ | Props read from env, config, or globals directly |
| No direct JSON imports (`import data from './data.json'`) | ✓ | `.json` import in frontmatter |
| No `data-render` attribute check | ✓ | `Astro.request`, `document.body.dataset.render` read |
| No `classList.contains('a11y-')` | ✓ | Checking legacy a11y class presence |
| No brand token reading in JS | ✓ | `getComputedStyle` for brand tokens in frontmatter |
| No accessibility state reading in JS | ✓ | Reading a11y panel state in frontmatter |
| Animation classes added conditionally from props | ✓ | Animation class always applied regardless of prop |
| `aria-hidden="true"` on decorative elements | ✓ | Icon without aria-hidden inside non-aria-hidden wrapper |
| No `:global()` selectors | ✓ | `:global(.anything)` in any style block |
| No scoped `<style>` block | ✓ | `<style>` tag present |

**Template pattern (correct):**
```astro
const classes = [
  'component',
  animation?.hover ? `component--hover-${animation.hover}` : '',
].filter(Boolean).join(' ');
```

---

## Section 6: Accessibility Baseline

Every component — interactive or not.

| Check | Pass | Fail indicator |
|-------|------|---------------|
| Decorative icons have `aria-hidden="true"` | ✓ | Icon rendered without aria-hidden |
| `data-semantic-role` attribute on image/icon elements | ✓ | Missing — should be `decorative`, `ui-control`, or `content-symbol` |
| All interactive elements are keyboard reachable | ✓ | Div/span with click handler but no tabindex/role |
| No hover-only content without `:focus-within` equivalent | ✓ | Tooltip only shows on `:hover`, not `:focus-within` |
| `tabindex="0"` on non-interactive elements that need focus (e.g. image figure) | ✓ | Figure with tooltip mode but no tabindex |
| Focus indicators visible (min 2px outline, sufficient contrast) | ✓ | `outline: none` without replacement |
| Tab order matches visual reading order | ✓ | Focus jumps backwards or skips visible elements |
| No `tabindex` values > 0 | ✓ | `tabindex="2"` or similar — breaks natural flow |

---

## Section 7: Alt Text (Image components only)

Skip for non-Image components.

| Check | Pass | Fail indicator |
|-------|------|---------------|
| Accepts `altDescriptive` prop | ✓ | Prop missing, only `alt` |
| Accepts `altAacPhrase` prop | ✓ | Missing |
| Accepts `altSymbolId` prop | ✓ | Missing |
| Accepts `altDisplayMode` prop (`hover`/`overlay`/`underneath`/`replace`/`off`) | ✓ | Missing |
| `tabindex="0"` on `<figure>` element | ✓ | Missing — blocks switch/keyboard access to tooltip |
| `:focus-within` on all hover-mode CSS selectors | ✓ | Only `:hover` — keyboard users can't trigger tooltip |
| `data-semantic-role` on figure | ✓ | Missing |
| `resolvedAlt` uses descriptive-first fallback chain | ✓ | Word-only fallback, no descriptive |
| AAC cards render from `alt_symbols` via aacResolver | ✓ | Hard-coded URL or missing |
| Alt text data sourced from Asset Library API | ✓ | Hard-coded in component or page |

---

## Section 8: Assistive-Input Render (Easy Click)

For every component with interactive elements (buttons, links, inputs, cards, toggles).

| Check | Pass | Fail indicator |
|-------|------|---------------|
| Interactive elements ≥ 44×44px at default render | ✓ | Smaller — measure with DevTools |
| Interactive elements scale to ≥ 64×64px when `[data-render="assistive"]` | ✓ | No assistive-render size rule in CSS |
| Minimum 16px gap between adjacent interactive elements | ✓ | Elements touching or <16px apart |
| No hover-only behaviour (content hidden unless `:hover`) | ✓ | Tooltip/dropdown with no `:focus-within` |
| All dropdowns/tooltips have click/tap alternative | ✓ | Only triggered by hover |
| Grid layout collapses to single column under `[data-render="assistive"]` | ✓ | Grid persists in assistive mode |
| Auto-advancing elements (carousels, timers) pause in assistive render | ✓ | Auto-advance not gated by render mode |
| If component is a navbar component: excluded from assistive render | ✓ | Nav renders in Easy Click (replaced by dedicated nav page) |
| Drag interactions have click/keyboard alternative | ✓ | Drag-only interaction |
| Fixed pixel sizing uses `px` not `rem` and doesn't scale | ✓ | Fixed-size interactive element that ignores text size |

**CSS pattern for assistive scaling:**
```css
[data-render="assistive"] .component__button {
  min-width: 64px;
  min-height: 64px;
}
```

---

## Section 9: JS Animation Bindings

For components with a `<script>` tag. Skip if no script.

| Check | Pass | Fail indicator |
|-------|------|---------------|
| JS checks for data attribute before binding events | ✓ | `addEventListener` called unconditionally |
| Data attribute is only added when animation prop is present | ✓ | Attribute always present on element |
| No animation library (GSAP, Lottie, matter) initialised unconditionally | ✓ | Init runs without checking for data attr or prop |
| `astro:page-load` listener used (not DOMContentLoaded alone) | ✓ | `DOMContentLoaded` only — breaks on SPA navigation |
| Double-init guard present (e.g. `element.__instance` check) | ✓ | Re-init possible on page revisit |
| Lottie JSON loaded server-side via `animationData` (not client-side fetch) | ✓ | `fetch()` for Lottie JSON in client script |

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

## Section 10: Atom Usage

For components that render text, links, buttons, headings, or icons.

| Check | Pass | Fail indicator |
|-------|------|---------------|
| `<a href>` uses `<Link>` atom | ✓ | Raw `<a>` tag (unless inside Link.astro itself) |
| `<button>` uses `<Button>` atom | ✓ | Raw `<button>` tag (unless inside Button.astro or FormField.astro) |
| `<p>`, `<span>`, `<small>` uses `<Text>` atom | ✓ | Raw text element that should be atom |
| `<h1>`–`<h6>` uses `<Heading>` atom | ✓ | Raw heading (unless inside Heading.astro) |
| Icons use `<Icon>` atom from barrel import | ✓ | Inline SVG or `public/Icons/` reference |
| Atom imports use barrel (`from '../atoms/Button'`) not direct file | ✓ | `from '../atoms/Button/Button.astro'` |

**Exceptions — raw HTML is correct inside:**
- The atom's own .astro file (Button.astro can use `<button>`)
- FormField.astro (manages its own input elements)
- Structural wrappers (`<div>`, `<section>`, layout containers)
- Icon containers where the SVG IS the content

---

## Verdict Template

Copy this block into `src/components/audit-log.md` when done:

```
| ComponentName | yes | done | [brief notes] |
```

**Notes should record:**
- Any rules found that needed extraction and where they went
- Any a11y.css → _reference/ moves
- Any pending items (parked blast-radius changes)
- Any structural issues found (e.g. .style.css naming, needs rename)
- Decisions made (e.g. textonly: null — confirmed decorative)

---

## Quick Fail Reference

If you find any of these, stop and fix before continuing:

| What you found | Action |
|----------------|--------|
| `<style>` block in .astro | Extract to ComponentName.css, remove block |
| `@layer` wrapper in CSS | Remove wrapper, keep rules inside |
| `!important` in CSS | Fix specificity at source |
| `.a11y-*` selector in CSS | Delete rule block (dead code) |
| `#a11y-content-wrapper` in CSS | Delete rule block (dead code) |
| `.dark-theme` selector | Extract to theme-luminance-dark.css |
| `highlight-links` selector | Extract to highlight-links.css |
| a11y.css file present | Run 6-step extraction, then move to _reference/ |
| Ambient `transition:` in base CSS | Gate behind modifier class |
| `fetch()` for Lottie JSON in client script | Move to server-side `animationData` prop |
| Hover tooltip without `:focus-within` | Add `:focus-within` selector |
| No `tabindex="0"` on focusable figure | Add it |
| `public/Icons/` reference | Replace with Icon atom from API |
| Old colour token (`--color-Primary-400`) | Replace with `--brand-c-*` token |

---

## Structural Issues Log

Track here as you find them across components:

| Issue | Components affected |
|-------|-------------------|
| `.style.css` naming (should be `.css`) | ContactInfo, ConnectorTimeline, LiquidReveal, ContactForm, Footer, IconScrollStage, ScrollMorphZone, GalleryItem |
| Loose .astro files (no component folder) | molecules/cards/ (~22 files), multiple organisms |
| Duplicate a11y file | HeroSection (HeroSection.a11y.css + hero-section.a11y.css) |
| Multi-file CSS split (unusual) | GlassNav (base, expandable, hamburger, mobile) |
| No component folder yet | AnnouncementTicker, CookieBanner, CartIcon, Breadcrumbs, SideTabs, QuoteSection, TextSection, CalloutSection, TimelineStepper, InsightContent, InsightHeader, ProductInfo, ContactPopup, DownloadSummary |

---

## Pending Build Tasks

Outstanding items from `image-alt-text-cdn-plan.md`. These are backlog tasks, not per-component audit checks.

### Content Integration (Phase 4)

- [ ] **Wire remaining 30 consumers** — pages call `loadAllAltText()`, cascade through sections/cards to Image atom. Pattern established in `about.astro`; all other pages outstanding.
- [ ] **Spread `aacInline` to page content** — body copy and workbook text goes through the AAC resolver, not just images/icons.
- [ ] **Legal pages: three content levels** — legal text needs simplified + AAC variants (Green/Yellow/Orange cognitive level versions).
- [ ] **`loadAllAltText()` scaling** — add `modifiedSince` param or partition by brand if asset count reaches thousands. Currently loads all images in one query.

### Cognitive Levels (Phase 4b)

- [ ] **Wire cognitive level to workbook response libraries** — Green/Yellow/Orange setting should control which response option libraries load (emotions-basic vs emotions-detailed vs emotions-nuanced). Future: workbook system not built yet.
- [ ] **Wire cognitive level to CSS input sizing variables** — Green level should apply `.cognitive-1` sizing rules (larger tap targets, bigger font on radio/card inputs). Currently spec'd but not wired to the a11y panel setting.

### Scrollytelling (Phase 3c)

- [ ] **Scrollytelling step data: add `alt` field** — every scrollytelling step JSON must include an `alt` field (AAC-friendly description of the icon/animation at that step). Required for AAC resolver to process step content.

### Icon Atom (Phase 4c — parked)

- [ ] **Icon.astro: add `.icon-label` + `.icon-wrapper`** — required for `ui-control` AAC mode (show text label, hide SVG). Parked: 41-consumer blast radius. Blocked on Tooltip atom build first.

### Tooltip Atom (new component — unblocks Icon + replaces CSS tooltip patterns)

**Build order: Tooltip first (new files, zero blast radius), Icon.astro second (41 consumers, separate session with impact report).**

**File structure:**
```
src/components/atoms/ui/Tooltip/
  Tooltip.astro
  Tooltip.css
  Tooltip.responsive.css
  Tooltip.schema.json
  index.ts
```

---

#### Render modes decision

| Render | Behaviour | Rationale |
|--------|-----------|-----------|
| `full` | Tooltip.astro (popup on hover/focus/touch) | Normal |
| `reduced` | Tooltip.astro (same — no motion, animation prop not passed) | Motion already gated |
| `assistive` | Tooltip.astro (variant-dependent — see below) | No hover in Easy Click |
| `textonly` | Tooltip.astro (inline parenthetical — see below) | Content, not decoration |

**textonly: "Tooltip.astro" (not null).** Tooltip content can be vocabulary definitions, AAC explanations, or help text — that is content, not visual chrome. In textonly render, the template renders the tooltip text inline as a `<small>` or parenthetical immediately after the trigger slot. The popup mechanism is suppressed; the text is always visible. For `variant="aac"`: strip all HTML from the `text` prop and render plain text only — textonly render must not load pictogram images or any visual-only content.

**assistive render (Easy Click):**

`variant="default"` — Persistent visible label rendered below the trigger. No popup, no trigger needed, no dismiss. Content is just there. Works for switch and eye gaze because there is nothing to activate. Trigger element minimum 64×64px applies to the Tooltip wrapper's trigger slot — document this requirement for every consumer.

`variant="aac"` — Popup with visible close button (`×`). Always-visible would eat the viewport in Easy Click single-column layout — the dialog content is potentially large (pictogram cards, vocabulary definitions). The close button is `tabindex="0"` and meets 64×64px minimum. Escape still works for keyboard; the visible button covers switch users who may not have Escape readily available.

---

#### Schema props

```json
{
  "component": "Tooltip",
  "category": "atoms/ui",
  "renders": {
    "full":       "Tooltip.astro",
    "reduced":    "Tooltip.astro",
    "assistive":  "Tooltip.astro",
    "textonly":   "Tooltip.astro"
  },
  "content": {
    "text": { "type": "string", "required": true, "description": "Tooltip text (plain) or HTML (aac variant only)" },
    "id":   { "type": "string", "description": "aria-describedby/aria-labelledby id — auto-generated if omitted" }
  },
  "visual": {
    "position": { "type": "string", "enum": ["top","bottom","left","right"], "default": "top" },
    "variant":  { "type": "string", "enum": ["default","aac"], "default": "default" }
  },
  "animation": {
    "fade": { "type": "boolean", "default": false }
  }
}
```

---

#### ARIA pattern: two variants, two roles

**`variant="default"` — `role="tooltip"`**
- Plain text content only. No interactive elements inside the tooltip.
- `aria-describedby` links trigger to tooltip id.
- ARIA spec allows role="tooltip" for non-interactive supplementary descriptions.

**`variant="aac"` — popover pattern, `role="dialog"`**
- Used when tooltip content includes AAC pictogram cards, vocabulary definitions with links, or any interactive element.
- `aria-labelledby` on the dialog pointing to a visually-hidden title.
- Focus trap when open: Tab cycles within the dialog only, Escape closes.
- **On open: focus moves into the dialog** (to the close button or first focusable element).
- **On close: focus returns to the trigger element** that opened it.
- This is more JS than the tooltip pattern — both moves must be implemented or the component will fail Section 14.7 (AT confirmation: focus management for modals/panels).
- Trigger gets `aria-haspopup="dialog"` and `aria-expanded`.
- Popover must have a visible close button (close button is always present in this variant, not just in assistive render).
- role="tooltip" is not valid for interactive content — do not use it here.

Do not use `variant="aac"` for non-interactive content. Do not add links or buttons inside `variant="default"`.

---

#### Accessibility requirements

- Trigger: `:hover` + `:focus-within` (keyboard) + touch (see below)
- Dismiss: `Escape` key + outside click/tap
- `variant="default"`: `aria-describedby` + `role="tooltip"` on popup
- `variant="aac"`: `aria-haspopup="dialog"` + `aria-expanded` on trigger + `role="dialog"` + focus trap + visible close button
- No fade in reduced render (animation prop not passed)
- Assistive render: popup replaced by always-visible inline label + visible close button
- textonly render: popup replaced by inline `<small>` after trigger slot content

**Mobile touch (always-on, not a prop — responsive behaviour):**
First tap shows tooltip/dialog. Second tap activates the trigger's default action. Long-press alternative for dialogs. Dismiss on outside tap. This is handled in Tooltip.responsive.css + a small inline `<script>` tag using the `astro:page-load` pattern with double-init guard.

---

#### 4 patterns to replace

| Current pattern | Location | Decision | Notes |
|----------------|----------|----------|-------|
| `[data-tooltip]::after` | `utilities.css` ~line 230 | Replace with `<Tooltip>` | Migration sweep required — see below |
| Image alt tooltip mode | `Image.css` tooltip selectors | **Keep CSS-only — explicit permanent exception** | This is a body-level render-mode toggle (`data-alt-display-mode`), not a tooltip interaction. `:focus-within` fix already applied. Migrating would give Image a dependency on Tooltip and force the wrong pattern onto a display-mode system. Future audits should not flag this as a missed Tooltip migration. |
| ReaderNav info tooltip | `ReaderNav.css` ~line 99 | Replace with `<Tooltip>` | `variant="default"`, `position="bottom"` |
| Share button tooltips | `ShareSection.astro` ~line 153 | Replace with `<Tooltip>` | `variant="default"` |

**`[data-tooltip]` migration sub-task:**
The `[data-tooltip]::after` pattern in utilities.css is global — other components may use `data-tooltip` attributes directly in HTML without going through any atom. Before removing the CSS pattern:
1. Grep for `data-tooltip` across all `.astro` and `.html` files — list every consumer
2. Replace each with `<Tooltip text="...">trigger</Tooltip>` wrapper
3. Only remove the utilities.css rule once all consumers are migrated
4. Add to the consumer list here once grepped: _consumers not yet catalogued_

The Tooltip atom may include temporary backwards-compat support for `data-tooltip` attributes during the migration window. **Remove after Phase 7 sweep is complete** — do not leave it permanently or the CSS-only pattern will persist indefinitely alongside the atom.

---

#### Build sessions

**Session 1 — Tooltip atom (this session or next):**
New files only. Zero existing components change. Safe to build in isolation.
- Create Tooltip/ folder + all 5 files
- Wire ReaderNav and ShareSection (2 consumers, low risk)
- Do NOT touch utilities.css `[data-tooltip]` until migration sweep is done

**Session 2 — Icon.astro `.icon-label` + `.icon-wrapper` (separate session):**
41-consumer blast radius. Before starting: run grep across codebase for all Icon consumers, produce impact report, get confirmation. Then change Icon.astro, update all consumers, verify no broken layouts. This is a dedicated session with a full checklist.
