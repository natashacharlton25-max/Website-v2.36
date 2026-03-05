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
- TEXTONLY LABELS: When consumers migrate to slug + fallbackIcon + label props, each LottieIcon instance that is meaningful (not decorative) MUST include a label string. Without it, textonly render shows nothing — buttons/links become empty. GlassNav hamburger, ReaderNav icons, and ShareSection icons all need visible text labels for textonly mode.
- TEXTONLY: Pipeline routes label to Text atom in textonly mode. Parent context (Link, Button) provides the wrapper. LottieIcon itself renders null in textonly (decorative instances) or Text renders the label (meaningful instances).

---

## atoms/ui/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Badge | PASS | 2026-03-05 | Fixes 1-5 applied + post-fix verification (16 sections). All sections pass. Schema: category → "atom", 4 render keys. Label through Text atom, 'text' class removed. data-semantic-role="status". Render mode CSS: assistive (larger text, solid bg, position reset), textonly (solid bg, position reset, no glass). Glass variants tokenised (--glass-bg/border/blur + new --glass-bg-light/dark, --glass-border-light/dark). badge__label inherit rule removed. No animation, no JS, no a11y.css. BONUS: --glass-shadow fallback stripped. DEFERRED: Badge-in-Card alt text integration (Card audit), Icon inheritance (cross-atom), print (global layer). |
| Button | PASS | 2026-03-05 | 13 fixes applied + post-fix verification (16 sections). All sections pass. Schema restructured (category, 4 renders, content/visual/animation groups). @layer removed. Base hover colour-only (no translateY). var fallbacks stripped. Dead code deleted (tray-3d, rainbow-wrap). a11y.css extracted (high-contrast → zones, highlight-links → global, render-mode rules → Button.css, rest → pipeline handles). 3 isA11yActive() functions deleted. Lottie focusin/focusout added. LottieIcon src→slug. Label through Text atom. confetti.css → tokens. font-weight tokenised (var(--font-medium)). DEFERRED: Consumer context override cleanup, LottieIcon animation passthrough verification, print (global layer), atom inheritance (cross-atom pass). |
| Card | pending | | Has a11y.css. Used by ~22 molecule cards. |
| Heading | PARTIAL | 2026-03-04 | Fixes 1-8 applied. Schema: category → "atom", 4 render keys, dividerLength removed, lottieIcon added to animation group. Subtitle through Text atom. Divider em-based (0.15em thickness, auto height via stretch). Underline percentage-based (90%/100% of fit-content parent). Dashed/dotted stops em-based. Highlight opacity tokenized (--opacity-low). LottieIcon support in media slot — falls back to static Icon when animation props stripped. ACCEPTED: Icon/LottieIcon imports (atom composition), icon size map (parent sizing). DEFERRED: Context overrides, SectionTitle deprecation, raw heading migration, token consistency, fit-content alignment test. |
| Link | pending | | Has a11y.css. Used across entire site. |
| List | pending | | Has a11y.css. |
| Text | PARTIAL | 2026-03-04 | All fixes applied. Schema: category corrected, 4 render keys (all → Text.astro, pipeline strips visual props in textonly). CSS: font family fallbacks stripped (expose missing --font-body-alt/--font-handwriting tokens), context overrides deleted (consumers pass size/leading props), blockquote border tokenized (--border-width-lg). No animation, no JS, no a11y concerns. DEFERRED: Verify Card and nav consumers pass correct size/leading props to Text children. Token coverage check: --font-body-alt and --font-handwriting must be defined for every brand. |
| Toast | pending | | Has a11y.css. Uses Icon. |
| Menu/DPadMenu | pending | | Has a11y.css. Uses .style.css naming. No schema/barrel. |
| Menu/RadialMenu | pending | | Has a11y.css. Uses .style.css naming. No schema/barrel. |
| Menu/ShareMenu | pending | | Standalone .astro only. No folder structure. |

**Button v2 audit findings (2026-03-05):**
- FIXED: Section 2 — @layer wrappers removed from Button.css and Button.responsive.css
- FIXED: Section 2.17-2.19 — var(--token, fallback) patterns moved to property definitions. Dead code (tray-3d hex, rainbow-wrap) deleted.
- FIXED: Section 3 — schema restructured: category → "atom", 4 render keys, props grouped into content/visual/animation
- FIXED: Section 5 — 3 isA11yActive() functions deleted. Pipeline gating makes runtime a11y checks redundant. Scripts' class selectors (.btn--confetti, .btn--magnetic, etc.) already gate correctly.
- FIXED: Section 6 — Lottie hover now has focusin/focusout equivalents for keyboard/AT access
- FIXED: Section 7/8/10 — [data-render] rules added: reduced (kill dropdown/chevron transitions), assistive (64px min targets, 3px focus), textonly (outline button style)
- FIXED: Base .btn hover — colour-only transition. All translateY removed from base. Transform/box-shadow transitions only on effect classes (jump, comic, tech, etc.).
- FIXED: Label renders through Text atom via `<Text as="span" class="btn__label" flush>`
- FIXED: LottieIcon src → slug on all 3 instances
- FIXED: confetti.css relocated from Button/ to src/styles/tokens/ (global tokens)
- FIXED: 'text' class removed from Button class list (Text atom handles typography)
- EXTRACTED: high-contrast rules → src/styles/zones/high-contrast.css (new file)
- EXTRACTED: highlight-links rules (outline + label underline only) → src/styles/global/highlight-links.css (new file)
- MOVED: Button.a11y.css + Button.a11y.recovery.css → _reference/Button/

**Cross-atom notes:**
- Button wraps Icon + LottieIcon — animation prop passthrough needs checking after those atoms pass
- DEFERRED: Consumer context overrides for Button — delete during consumer audits
- NEW FILE: src/styles/zones/high-contrast.css — other atoms add their rules during audits
- NEW FILE: src/styles/global/highlight-links.css — other atoms add their rules during audits
- Card is the base for ~22 molecule-level cards — Card focus/assistive sizing propagates to all of them
- Link + highlight-links global setting — needs cross-check with `src/styles/global/highlight-links.css`
- Text + Heading — font token consistency check (both should use same scale)
- Text context overrides (.card .text, nav .text) DELETED from Text.css. Card and nav consumers must pass size="sm" (and leading="snug" for nav) as props to their Text children. Verify during Card and nav audits.
- Text font tokens: --font-body-alt and --font-handwriting added to typography.css with default var(--font-body). Brands override in their brand file if needed.
- DEFERRED: 32+ raw `<small>` and 4 raw `<blockquote>` elements across molecules/organisms bypass Text atom. Migrate to `<Text as="small">` / `<Text as="blockquote">`, then remove duplicate element rules from global.css. Text.css element variants (small.text, blockquote.text, etc.) are the canonical source — global.css copies are legacy.
- Toast uses Icon — verify Icon atom inheritance (section 16) after Icon passes
- DEFERRED: Heading context overrides (.card .heading, nav .heading, mega menu) — delete during consumer audits. Consumers pass size/weight props.
- DEFERRED: SectionTitle.astro deprecated. Migrate consumers to `<Heading>`, then delete.
- DEFERRED: Visually test fit-content + alignment variants (center, right) after heading fixes.
- ARCHITECTURE NOTE: Heading media slot priority: image → lottieIcon → icon. Pipeline strips lottieIcon in reduced/assistive/textonly, static icon auto-fallback via content prop. No separate fallbackIcon needed — content.icon IS the fallback.
- ARCHITECTURE NOTE: Divider/underline sizing is relative — em for thickness/rhythm, percentage for underline width, stretch for divider height. Pattern for all future decorative line elements.

**Badge v2 audit findings (2026-03-05):**
- FIXED: Section 3.2: `"category": "atom"` (was `"atoms/ui"`)
- FIXED: Section 3.3/3.5: `"assistive": "Badge.astro"` render key added
- FIXED: Section 5/13: `'text'` CSS class removed from class list. Label wrapped in `<Text as="span" class="badge__label" flush>`. Text atom import added.
- FIXED: Section 6.2: `data-semantic-role="status"` added to badge element — badges are meaningful content (status/category labels), not decorative
- FIXED: Section 7/8: Render mode CSS added — assistive (larger text via --text-body, solid bg, position reset), textonly (solid bg, position reset, glass stripped)
- FIXED: CSS cleanup — `.badge__label { font: inherit; color: inherit; }` removed (Text atom handles typography)
- FIXED: Glass variants tokenised — `.badge--glass` now uses `var(--glass-bg)`, `var(--glass-blur)`, `var(--glass-border)`. New tokens `--glass-bg-light`, `--glass-border-light`, `--glass-bg-dark`, `--glass-border-dark` added to shadows.css for light/dark glass variants.
- BONUS: `--glass-shadow` had banned `var(--color-Black, #121212)` fallback — stripped to `var(--color-Black)`
- DEFERRED: Badge-in-Card alt text integration — when Badge overlays an Image in Card, assistive/textonly renders should flow badge in normal document order. `position: static` in render overrides handles this. Card audit will verify.
- DEFERRED: Icon inside Badge — verify Icon atom's aria-hidden and data-semantic-role propagate correctly (cross-atom Section 16)

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
- [ ] Token coverage grep: every `var(--token-name)` in component CSS resolves to a definition in `src/styles/`. Automate as build-time check.
