# Atom Audit Log — v2 Checklist

Tracks each atom through the v2 checklist (`component-audit-checklist-v2.md`).
After all atoms pass individually, run the **final cross-atom audit** using the interdependency notes below.

---

## atoms/icons/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Icon | PARTIAL | 2026-03-04 | Fixes 1-4 applied. Animation CSS merged into base (no separate animation file — gated by JSON prop classes). Responsive.css created. Assistive render key added. ACCEPTED: env var reads (build-time config), aria-hidden on all icons (parent provides a11y name). DEFERRED: AAC semantic role rules to global file, inline px style future improvement. |
| LottieIcon | PARTIAL | 2026-03-04 | All fixes applied. Schema: three optional content dimensions — slug/src (animation), fallbackIcon (static Phosphor for reduced/assistive, pipeline routes to Icon atom, LottieIcon never sees this), label (aria-label on component, pipeline routes to Text atom in textonly). Props adapt: label present = role="img" + aria-label, label absent = aria-hidden="true". Renders: full → LottieIcon.astro, reduced/assistive → Icon atom via pipeline, textonly → Text atom via pipeline. No separate template files. ACCEPTED: env var reads (build-time config). DEFERRED: Consumer migration from src paths to slugs, lottie_mappings shared fallback verification. |

**Icon v2 audit findings (2026-03-04):**
- FIXED: Section 1.3: `Icon.responsive.css` created (empty, comment-only — no breakpoint overrides needed)
- FIXED: Section 3.3/3.5: `"assistive": "Icon.astro"` render key added to schema
- ACCEPTED: Section 5.1 — `import.meta.env.*` for API URL/token/weight is build-time config, not runtime state. Acceptable exception for API-backed atom.
- ACCEPTED: Section 6.1 — `aria-hidden="true"` hardcoded on ALL icons including content-symbol. Correct: parent element provides accessible name in normal mode; AAC mode replaces icon with pictogram cards. Icon SVG never needs to be announced.
- FIXED: Animation CSS — `Icon.animation.css` deleted, contents merged into `Icon.css`. No separate animation file. Gated by JSON prop → class → CSS rule.
- NOTED: No assistive render sizing needed — Icon is not interactive, parent atom (Button/Link) owns touch target sizing.
- NOTED: AAC `.icon` hide rules live in Image.css lines 368-376 — should move to global AAC stylesheet in cross-atom pass.

**Cross-atom notes:**
- Icon is consumed by Button, Badge, Toast, Card, Link, List, GlassNav, most molecules/organisms
- Icon `.icon-label` + wrapper span parked (41 consumers — do with Tooltip atom)
- LottieIcon consumed by Button (confetti), GlassNav (hamburger), ShareSection
- DEFERRED: AAC semantic role rules for `.icon` (currently in Image.css) → move to global AAC stylesheet
- DEFERRED to cross-atom pass: (5) AAC semantic role .icon rules move from Image.css to src/styles/global/aac-mode.css, (6) inline px style could use --icon-size CSS custom property pattern — future improvement, parent owns sizing for now
- Icon.animation.css pattern was WRONG — deleted and merged into Icon.css. No component should have a separate animation CSS file. Animation is gated by JSON prop → class → CSS rule in the base file.
- NOTED: Icon size is owned by the parent component. Inline px is the unconstrained default.

**LottieIcon v2 audit findings (2026-03-04):**
- FIXED: Section 1.3: `LottieIcon.responsive.css` created (empty, comment-only)
- FIXED: Section 3.2: `"category": "atom"` (was `"atoms/icons"`)
- FIXED: Section 3.5: renders updated — reduced/assistive → `"Icon"`, textonly → `"Text"`. Pipeline routes props to other atoms per render mode. No separate template files.
- FIXED: Section 6: Conditional aria — label present = `role="img"` + `aria-label={label}`, label absent = `aria-hidden="true"`. Same pattern as `<img alt="...">` vs `<img alt="">`.
- FIXED: Section 6.2: `data-semantic-role="decorative"` retained (AAC mode still treats animated icons differently)
- FIXED: `fallbackIcon` (optional) and `label` (optional) added to schema content props. Pipeline-only props — `fallbackIcon` never reaches LottieIcon.astro.
- FIXED: `LottieIcon.reduced.astro` deleted — render pipeline handles reduced/assistive using Icon atom with fallbackIcon prop
- ACCEPTED: Section 5.1 — `import.meta.env.*` for API URL/token is build-time config. Same exception as Icon.
- CORRECTED: fallbackIcon and label are optional, not required. Decorative instances (card flourishes etc) pass neither. Meaningful instances (nav icons) pass both. The JSON author decides per instance.
- CORRECTED: fallbackIcon removed from LottieIcon.astro Props interface. It's a schema prop for the pipeline, not a component prop. Pipeline routes it to Icon atom.
- CORRECTED: label on LottieIcon.astro is optional. Present = role="img" + aria-label. Absent = aria-hidden="true". Same pattern as img alt="" vs img alt="description".
- DEFERRED: LottieIcon consumers (GlassNav, ReaderNav, ShareSection, Button) all use legacy src="/Icons/..." paths. Must migrate to slug props before lottie_mappings can provide Phosphor fallbacks for reduced/assistive renders.
- DEFERRED: lottie_mappings has shared fallbacks (a_38uz8cvrxpo7 x4, a_y99i2lyj67xi x5) — verify semantic correctness during consumer audits.
- DEFERRED: lottie-web JS bundle gating — render pipeline should exclude `<script>` from non-full renders.
- Consumer migration: GlassNav, ReaderNav, ShareSection currently have hardcoded static Icon fallbacks alongside LottieIcons. Once consumers pass fallbackIcon and label through JSON, the hardcoded fallbacks become redundant.
- TEXTONLY: Pipeline routes label to Text atom in textonly mode. Parent context (Link, Button) provides the wrapper. LottieIcon itself renders null in textonly (decorative instances) or Text renders the label (meaningful instances).

---

## atoms/ui/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Badge | pending | | Previously audited v1. Needs v2 re-audit. |
| Button | pending | | Has a11y.css + confetti.css. Wraps Icon + LottieIcon. |
| Card | pending | | Has a11y.css. Used by ~22 molecule cards. |
| Heading | pending | | Previously audited v1. Needs v2 re-audit. |
| Link | pending | | Has a11y.css. Used across entire site. |
| List | pending | | Has a11y.css. |
| Text | pending | | Previously audited v1. Needs v2 re-audit. |
| Toast | pending | | Has a11y.css. Uses Icon. |
| Menu/DPadMenu | pending | | Has a11y.css. Uses .style.css naming. No schema/barrel. |
| Menu/RadialMenu | pending | | Has a11y.css. Uses .style.css naming. No schema/barrel. |
| Menu/ShareMenu | pending | | Standalone .astro only. No folder structure. |

**Cross-atom notes:**
- Button wraps Icon + LottieIcon — animation prop passthrough needs checking after those atoms pass
- Card is the base for ~22 molecule-level cards — Card focus/assistive sizing propagates to all of them
- Link + highlight-links global setting — needs cross-check with `src/styles/global/highlight-links.css`
- Text + Heading — font token consistency check (both should use same scale)
- Toast uses Icon — verify Icon atom inheritance (section 16) after Icon passes

---

## atoms/images/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Image | PARTIAL | 2026-03-04 | Fixes 1–10 applied. Schema: component, category, assistive render key added. CSS: focus-visible added, broken --font-size-sm → --text-small, comment rewritten. Assistive render + XL text reflow CSS added. 4 items deferred to cross-atom pass. |

**v2 audit findings (2026-03-04):**
- FIXED: Section 2 — `#a11y-content-wrapper` comment rewritten
- FIXED: Section 3 — schema corrected (`component`, `category`, 4 render keys)
- FIXED: Section 6 — `.image:focus-visible` rule added
- FIXED: Section 7/8/10 — `[data-render="assistive"]` + `[data-text-xl]` CSS added (first component with these patterns)
- FIXED: Section 7 — `--font-size-sm` replaced with `--text-small` (global token)
- NOTED: Section 9 — checklist sections 9.2, 9.3, 9.4 are stale (checklist needs updating, not component). See CLAUDE.md known corrections.
- FIXED: Hardcoded fallbacks stripped — `var(--color-surface-inverse, #000)` → `var(--color-surface-inverse)`, `var(--radius-md, 8px)` → `var(--radius-md)`
- NOTED: Section 15 — print deferred to global print layer (uses reduced/textonly render + minimal print CSS)

**Cross-atom notes:**
- Image consumed by BlogCard, TeamCard, TestimonialCard, InfoCard — none pass alt text props yet
- Alt text pipeline: API returns data, aacResolver exists, but nothing wires API→Image props
- ImageOverlay (molecule) wraps Image — section 16 inheritance check needed after Image passes
- DEFERRED to atom render pass: (11) alt text word + descriptive spans → Text atom, (12) AAC pictogram card → Card+Image+Text atom markup in aac-cards.ts, (13) AAC text-only fallback → Text atom markup, (14) pictogram img in AAC cards → Image atom markup

---

## atoms/a11y/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Announcer | pending | | No a11y.css (good). aria-live component. |
| PresetButton | pending | | Has a11y.css + recovery. |
| Stepper | pending | | Has a11y.css + recovery. |

**Cross-atom notes:**
- These are part of the a11y panel itself — special case for section 5 (purity) since they legitimately read a11y state
- PresetButton + Stepper used only inside AccessibilityPanel organism

---

## atoms/canvas/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| RevealCanvas | pending | | Has a11y.css + recovery. Decorative (textonly: null). |

**Cross-atom notes:**
- Used by HeroSection — check canvas doesn't block focus order of hero content

---

## atoms/effects/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| DrawSVGIcon | pending | | Has a11y.css. Decorative. |
| ScrollDrawIcon | pending | | Has a11y.css + recovery. Decorative. |
| PagePatternLayer | pending | | Has a11y.css + recovery. Decorative (textonly: null). |
| ParallaxDecor | pending | | Has a11y.css + recovery. Decorative (textonly: null). |
| PatternOverlay | pending | | Has a11y.css + recovery + pattern-motion.css. Decorative (textonly: null). |
| PhysicsOverlay | pending | | Has a11y.css + recovery. Decorative (textonly: null). |
| ScrollColorBackground | pending | | Has a11y.css + recovery. Decorative (textonly: null). |

**Cross-atom notes:**
- All decorative — should all be textonly: null, aria-hidden, no tabindex
- PatternOverlay has extra `pattern-motion.css` — should this be `PatternOverlay.animation.css`?
- PhysicsOverlay uses Matter.js — section 12 (JS bindings) critical
- ScrollColorBackground uses GSAP ScrollTrigger — section 12 critical
- These all need `aria-hidden="true"` confirmation — decorative elements exposed to AT is a section 6 fail

---

## atoms/form/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| FormField | pending | | Has a11y.css + recovery. Complex token system. |

**Cross-atom notes:**
- FormField is the ONLY atom allowed raw `<input>`, `<select>`, `<textarea>` (exception in section 13)
- Used by ContactForm, search, checkout — all forms depend on this
- Has its own `outline: none` with box-shadow replacement (line 158, 523) — verify focus is visible
- Colour/contrast/style variant matrix is large — assistive render needs checking across all variants

---

## atoms/gallery/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| GalleryItem | pending | | Has a11y.css + recovery. Uses .style.css naming. No .astro file? No schema/barrel. |

**Cross-atom notes:**
- Missing .astro file in folder — may be incomplete/abandoned component
- Used by MasonryGrid, GallerySection — check if those import from here or have inline markup

---

## atoms/grid/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Grid | pending | | Has a11y.css + recovery. |

**Cross-atom notes:**
- Grid is structural — used by many organisms for layout
- Assistive render single-column collapse (section 10.6) is critical here — Grid probably needs the `[data-render="assistive"]` 1fr rule
- XL text reflow (section 8c.3) also depends on Grid responding to text size

---

## Final Cross-Atom Audit (after all atoms pass individually)

Run these checks once every atom has passed its individual v2 audit:

- [ ] Focus order: tab through a page using multiple atoms — order matches visual reading order
- [ ] Icon inheritance: every component using Icon gets aria-hidden, data-semantic-role propagated
- [ ] Button + Icon: animation prop passthrough works (Icon animation gated when Button has no animation prop)
- [ ] Card + Image: Image focus indicator visible inside Card (not clipped by overflow:hidden)
- [ ] Card + Image: alt text overlay/tooltip not clipped by Card container
- [ ] Grid + Card: assistive render collapses grid, cards stack, focus order intact
- [ ] FormField + Button: form submit button inherits correct sizing in assistive render
- [ ] Text + Heading: consistent token scale across both atoms
- [ ] Link + highlight-links: global setting applies correctly to Link atoms inside all containers
- [ ] Toast + Icon: Icon decorative state correct inside Toast (aria-hidden)
- [ ] All decorative atoms: confirm none appear in textonly render
- [ ] Print: all atoms have appropriate print rules or inherit from global print stylesheet
- [ ] `--font-size-sm` token: resolve globally or replace in all atoms that reference it
- [ ] `[data-render="assistive"]` rules: confirm pattern exists in all interactive atoms
