# Atom Audit Log — v2 Checklist

Tracks each atom through the v2 checklist (`component-audit-checklist-v2.md`).
After all atoms pass individually, run the **final cross-atom audit** using the interdependency notes below.

---

## atoms/icons/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Icon | PARTIAL | 2026-03-10 | **Pass 2 (2026-03-10):** Schema `category` fixed (`"atoms/icons"` → `"atom"`). `semanticRole` added to schema content group (existed in Astro, missing from schema). `colour` group added (3 pipeline tokens: iconColor, iconShadow, iconGlow). Animation `_description` updated (removed stale "a11y" language). Shadow/glow CSS routing fixed — all sizes pointed to `-md`, now correctly route sm/md/lg to matching tokens. Internal `--_icon-color` token added to base `.icon`. `class:list` migration on `<span>`. Schema notes updated. **Pass 1 (2026-03-04):** Animation CSS merged into base. Responsive.css created. Assistive render key added. ACCEPTED: env var reads (build-time config), aria-hidden on all icons. DEFERRED: AAC semantic role rules to global file, inline px style future improvement. |
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
- Icon `.icon-label` + wrapper span parked (41 consumers — migrate to Tooltip atom with purpose="label")
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
| Badge | PASS | 2026-03-09 | Re-audited against v2 checklist (16 sections). All pass. Changes since last audit: dead colour variants removed, glass variants merged, `color` prop removed from schema/astro. `size` prop added (sm/md/lg) with size-aware radius. `semanticRole` prop added (status/tag/label/none) — "none" suppresses data attribute. Schema `colour` group added (bg/text/border pipeline tokens). Text atom inheritance fixed in Text.css (`.badge .text { color/font-size/line-height: inherit }`). Outline variant text uses `--_badge-border` (matches border colour). Render overrides use internal `--_badge-*` tokens (no duplicate fallbacks). Textonly hides icon via CSS (`[data-render="textonly"] .badge__icon { display: none }`). `2px` hardcoded padding replaced with `var(--space-2xs)`. Notes updated. ACCEPTED: 2.19 pipeline bridge fallbacks (var(--badge-bg, var(--primary-200)) pattern — intentional, not broken tokens). DEFERRED: 6.10 contrast (needs pipeline to compute --badge-text per bg), Badge-in-Card alt text (Card audit), Icon inheritance (cross-atom), print (global layer). |
| Button | PASS | 2026-03-05 | 13 fixes applied + post-fix verification (16 sections). All sections pass. Schema restructured (category, 4 renders, content/visual/animation groups). @layer removed. Base hover colour-only (no translateY). var fallbacks stripped. Dead code deleted (tray-3d, rainbow-wrap). a11y.css extracted (high-contrast → zones, highlight-links → global, render-mode rules → Button.css, rest → pipeline handles). 3 isA11yActive() functions deleted. Lottie focusin/focusout added. LottieIcon src→slug. Label through Text atom. confetti.css → tokens. font-weight tokenised (var(--font-medium)). DEFERRED: Consumer context override cleanup, LottieIcon animation passthrough verification, print (global layer), atom inheritance (cross-atom pass). |
| Card | PASS | 2026-03-10 | **Update (2026-03-10):** Liquid glass variant updated to consume global `--liquid-*` tokens from `shadows.css` instead of hardcoded rgba values. Dark mode liquid glass overrides moved from card-scoped to global `:root`-level in `theme-luminance-dark.css`. **Session 2 (2026-03-09):** Liquid glass variant added (two-layer pseudo-element), glass tint prop, variant renames (liquid-glass→liquid, neumorphic-pressed→pressed), legacy typography sections deleted, tooltip fixed positioning, badge pipeline rules. **Original audit (2026-03-06):** Fixes 1-11 applied, all sections pass. Schema: category → "atom", 4 render keys, content/visual/animation groups. @layer removed. Glass tokenised. Transition split. a11y.css extracted. DEFERRED: print (global layer). |
| Heading | PARTIAL | 2026-03-10 | **Update (2026-03-10):** Pass 2 — internal token consolidation. 15 internal `--_heading-*` tokens added to base `.heading` block. All raw bridge chains replaced with internal tokens throughout CSS. Schema `colour` group added (8 pipeline tokens: headingColor, headingAccent, headingUnderline, headingBadgeBg, headingBadgeText, headingHighlight, headingIcon, headingMediaBg). Schema `color` prop enum fixed: was `[primary, primary-dark, secondary, text, text-light, neutral, inherit]` → now `[accent, text, muted, inherit]` matching actual CSS classes. Props interface updated in .astro. `class:list` migration: both `headingClasses` and `wrapperClasses` migrated from `.filter(Boolean).join(' ')` to Astro `class:list` on elements. Dark mode heading override added to `theme-luminance-dark.css`: text headings use `--primary-600` instead of body text colour in dark mode. **Original (2026-03-04):** Fixes 1-8 applied. Schema: category → "atom", 4 render keys, dividerLength removed, lottieIcon added to animation group. Subtitle through Text atom. Divider em-based. Underline percentage-based. LottieIcon support in media slot. ACCEPTED: Icon/LottieIcon imports (atom composition), icon size map (parent sizing). DEFERRED: Context overrides (delete during consumer audits), SectionTitle deprecation, raw heading migration, token consistency with Text, fit-content alignment visual test, colour group in schema — DONE this session. |
| Link | PASS | 2026-03-10 | **Pass 2 (2026-03-10):** 7 internal `--_link-*` tokens added to `.link` base (color, hover, focus, highlight, accent, text, fill-text). All raw bridge chains replaced. `--text-color` bug fixed (phantom token → `--text-body` via `--_link-text`). Schema `color` enum fixed: `[primary, primary-dark, secondary, text, text-light, inherit]` → `[primary, accent, text, muted, inherit]` matching CSS classes. `colour` group added (7 pipeline tokens). Transitions tokenised: `0.35s ease` / `0.3s ease-in-out` → `var(--transition-base)`. `.link--default` redundant CSS rules deleted (class kept for highlight-links.css targeting). Class array cleaned (falsy-friendly, no `.filter(Boolean)`). Schema notes updated with render behaviour. **Pass 1 (2026-03-05):** Fixes 1-11 applied. Glass removed, highlight/border added, 4 animation props, Text atom, a11y extracted. DEFERRED: Glass consumer migration, animation visual testing, print. |
| List | PASS | 2026-03-05 | Fixes 1-10 applied + post-fix verification (16 sections). All sections pass. Schema: category → "atom", 4 render keys, props grouped (content/visual/animation). @layer removed from CSS + responsive. Dot sizes em-based (0.375em/0.5em/0.75em). a11y-dot deleted (dead code). Text atom wraps item content, 'text' class removed. Icon barrel import. a11y.css extracted (textonly → List.css, a11y files → _reference/). Assistive render: vertical stacking, CSS ::before dots (0.75em), icons hidden. Textonly render: native bullets, inline collapses, icons hidden. No animation, no JS. DEFERRED: Icon inheritance (cross-atom), slot consumer migration, print (global layer). |
| Text | PARTIAL | 2026-03-06 | All fixes applied. Schema: category corrected, 4 render keys (all → Text.astro, pipeline strips visual props in textonly). CSS: font family fallbacks stripped (expose missing --font-body-alt/--font-handwriting tokens), context overrides deleted (consumers pass size/leading props), blockquote border tokenized (--border-width-lg). `textTone` prop added (visual group): `"light"` → `text--tone-light` → `var(--glass-text-on-dark)`, `"dark"` → `text--tone-dark` → `var(--glass-text-on-light)`. Content author declares contrast for glass surfaces — Text owns its own colour, glass container owns background. Toast migrated: glass/neon `color` removed from Toast.css, `textTone="light"` passed from Toast.astro + `text--tone-light` class in toast.ts. No animation, no JS, no a11y concerns. DEFERRED: Verify Card and nav consumers pass correct size/leading props to Text children. Token coverage check: --font-body-alt and --font-handwriting must be defined for every brand. |
| Toast | PASS | 2026-03-06 | Full rebuild — 7 fixes across schema, astro, CSS, JS, consumers. Glass+glow tokenised (--glass-bg-brand-tint, --glass-border-brand, --glass-blur-heavy, --glass-shadow, --glass-shadow-inset, --glow-neon, --glow-neon-hover, --glow-text). Toast.astro rebuilt as canonical template (Icon + Text atoms, aria-atomic, tabindex, data-semantic-role). Toast.css: @layer removed, BEM class rename (toast-* → toast__*/toast--*), internal tokens (--_toast-icon-size/max-width/z/radius/icon-color), !important removed, 3 render mode blocks. Glass/neon `color` removed — delegated to Text atom via `textTone="light"`. toast.ts: `text--tone-light` class added for glass/neon runtime toasts. Toast.responsive.css: @layer removed, !important removed, BEM classes. toast.ts: legacy isA11yMode()/isReducedMotion() deleted → document.body.dataset.render, BEM class names, keyboard dismiss (Escape/Enter), render-mode-aware icon display + dismiss animation, duration default 30000→5000. contact-popup.js: wrong showToast(msg,type) signature → {message,theme} object. a11y files → _reference/Toast/. global.css stale import removed. |
| Tooltip | PASS | 2026-03-07 | Built from spec (first atom not extracted from legacy). All 16 v2 checklist sections pass first time. Schema: category "atom", 4 render keys, content/visual/animation groups. Two purpose modes: label (aria-hidden, decorative) and info (consumer owns aria-describedby). Text atom for simple content, named slot for rich content (AAC cards). CSS-only visibility (hover + :focus-within on every rule). Animation gated by entrance prop (fade/scale/slide) — no prop = instant appear. 4 positions, 3 sizes, 4 themes (professional/glass/neon/brutalist). Render modes: reduced (transition:none), assistive (info=full-width bar, label=hidden), textonly (info=inlined, label=hidden). --z-tooltip token created (1010). Responsive: left/right→bottom under 768px, wider under 500px. FLAGGED: Internal px values (150/200/320 max-widths, 6px arrow, 20px blur, 4px text-shadow, 2px brutalist border) — accepted as component sizing, same pattern as Toast/Button/Card. utilities.css tooltip block (lines 230-492) left in place — both systems coexist until consumers migrated. |
| Menu/DPadMenu | pending | | Moved to molecules/Menu/. Has a11y.css. Uses .style.css naming. No schema/barrel. |
| Menu/RadialMenu | pending | | Moved to molecules/Menu/. Has a11y.css. Uses .style.css naming. No schema/barrel. |
| Menu/ShareMenu | pending | | Moved to molecules/Menu/. Standalone .astro only. No folder structure. |

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

**Link v2 audit findings (2026-03-05):**
- FIXED: Section 1.6/1.7: a11y.css + recovery moved to `_reference/Link/`
- FIXED: Section 1.10: `import './Link.a11y.css'` removed from index.ts
- FIXED: Section 2.1: @layer wrappers removed from Link.css + Link.responsive.css
- FIXED: Section 3: Schema restructured — category → "atom", 4 render keys, props split into content/visual/animation. Stale `"reducedMotion"` key removed.
- FIXED: Section 5/13: `'text'` class removed. Slot wrapped in `<Text as="span" flush>`. Text atom import added.
- FIXED: Section 4/7: Underline animation split — static `text-decoration: underline` as visual variant, `scaleX(0)→scaleX(1)` animation gated by `underlineGrow` prop. Three more animations added: highlightGrow, shadowFill, textSlide.
- REMOVED: Glass variant — Link is inline text only. Consumers using `<Link variant="glass">` migrate to `<Button variant="glass" shape="pill" href="...">`.
- ADDED: New visual variants — `highlight` (subtle background bar), `border` (thin bottom border). Static, no-motion indicators.
- EXTRACTED: highlight-links rules → `src/styles/global/highlight-links.css` (inline variants get underline, kill animated ::after)
- EXTRACTED: text-only rules → `[data-render="textonly"]` in Link.css (strip uppercase, weight, colour overrides)
- EXTRACTED: reduce-motion → `[data-render="reduced"] .link { transition: none; }`
- CLEANED: responsive.css — all glass rules removed, @layer removed, underline adjustments kept

- MIGRATION: All consumers of `<Link variant="glass">` must migrate to `<Button variant="glass" shape="pill" href="...">`. Known consumers: Footer, possibly GlassNav. Check during consumer audits.
- DEFERRED: Link animation effects CSS implemented but needs visual testing across all themes and render modes.
- DEFERRED: highlight-links.css needs Link rules for new variants (highlight, border) — added during this audit.
- ARCHITECTURE: Link is inline text only. Anything needing visual weight (padding, background, border-radius) is a Button with href. Clean separation.

**List v2 audit findings (2026-03-05):**
- FIXED: Section 1.6/1.7: a11y.css + recovery moved to `_reference/List/`
- FIXED: Section 1.10: `import './List.a11y.css'` removed from index.ts
- FIXED: Section 2.1: @layer wrappers removed from List.css + List.responsive.css
- FIXED: Section 2.18: Dot sizes converted from px to em (0.375em/0.5em/0.75em) — same relative sizing pattern as Heading dividers
- FIXED: Section 3: Schema restructured — category → "atom", 4 render keys, props split into content/visual/animation
- FIXED: Section 5/13: `'text'` class removed from `<li>`. Item content wrapped in `<Text as="span" class="list__content" flush>`. Text atom import added.
- FIXED: Section 5/13: Icon import changed to barrel (`from '../../icons/Icon'`). TODO comment removed.
- FIXED: Section 7: Assistive render — vertical stacking, CSS `::before` dots (0.75em), icons and variant dots hidden. Inline collapses to block.
- FIXED: Section 7: Textonly render — extracted from a11y.css. Native disc bullets, icon lists revert to `list-item`, icons hidden, inline collapses with bullets, none variant gets bullets.
- DELETED: `.list__a11y-dot` element and CSS — dead code. Never displayed in any render mode. Textonly uses native bullets, assistive uses CSS `::before` dots.
- FIXED: Responsive dot sizes converted to em. @layer removed.
- ARCHITECTURE: Dot sizes em-based — same relative sizing pattern as Heading dividers. Scales with parent text size.
- ARCHITECTURE: Assistive render uses CSS `::before` dots on all list variants for consistency. 0.75em scales with text. Icons and variant dots hidden.
- MIGRATION: Slot usage instructions updated — consumers should use `<li class="list__item"><Text as="span" flush>content</Text></li>` instead of `<li class="text list__item">`.
- DEFERRED: Icon inside List — verify Icon atom's aria-hidden propagates correctly (cross-atom Section 16).
- DEFERRED: Print layer — lists need `page-break-inside: avoid` on list items.

---

## atoms/images/

| Component | Status | Date | Notes |
|-----------|--------|------|-------|
| Image | PARTIAL | 2026-03-10 | **Pass 2 (2026-03-10):** Schema restructured — `renders` moved to top, `notes` added, `_description` on all groups, `class` added to visual, `textonly: false` flags on animation props, `colour` group added (3 pipeline tokens: imgBorder, imgCaption, imgOverlay). Internal tokens added to `.image` base: `--_image-border`, `--_image-caption`, `--_image-overlay`. All raw bridge chains replaced. Focus-visible `2px` → `var(--border-width-2)`. Class arrays cleaned (`.filter(Boolean)` removed, `class:list` handles falsy). `decorative` prop left out of schema (deprecated, pipeline uses `role="decorative"`). **Pass 1 (2026-03-04):** Fixes 1-10 applied. Schema: component, category, assistive render key. CSS: focus-visible, --font-size-sm fix. Assistive + XL text reflow. DEFERRED: Alt text spans → Text atom, AAC card markup, AAC/cognitive rules → global file. |

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
| FormField | PASS | 2026-03-10 | **Second-pass fixes (2026-03-10):** Variant colour flattening repaired (previous session broke secondary/neutral → all pointed to primary). Three-tier bridge tokens restored: `--_field-brand` / `--_field-brand-dark` / `--_field-brand-light` per variant. `contrast` prop removed (zone file handles HC). `aria-labelledby` bug fixed (label had no id). 6x transitions tokenised (`var(--transition-fast)`). 2x border widths tokenised (`var(--border-width-2)`). Dead `Button` import removed. `colour` group added to schema (10 tokens). Dark mode selectors migrated to `[data-mode="dark"]`. **Original audit (2026-03-06):** All 16 sections passed. Files moved to atoms/form/FormField/ subfolder. Schema: category → "atom", 4 render keys, card-select type. @layer removed. Legacy form utilities deleted. Dark/HC/highlight-links extracted to zone/global files. Label/desc/error through Text atom. Card-select with aacResolver symbols. Render mode CSS for reduced/assistive/textonly. DEFERRED: Save-draft for AAC users, input tolerance testing, print (global layer), consumer migration. |

**FormField v2 audit findings (2026-03-06):**
- FIXED: Section 1: Files moved to `atoms/form/FormField/` subfolder. Re-export barrel at `atoms/form/index.ts` preserves consumer import path.
- FIXED: Section 2.1: @layer wrappers removed from FormField.css + FormField.responsive.css
- FIXED: Section 2.6: `.a11y-theme-dark` / `.a11y-theme-high-contrast` selectors extracted to theme-luminance-dark.css
- FIXED: Section 3: Schema restructured — category → "atom", 4 render keys, content/visual/animation groups. card-select type added with maxSelections, cardSize, cardColumns props.
- FIXED: Section 4: index.ts — a11y.css import removed
- FIXED: Section 5/13: `'text'` CSS class removed. Label, description, error, and label-text (3 instances) wrapped in `<Text as="span" flush>`. Text atom import added.
- FIXED: Section 6: `outline: 2px solid transparent` added to `.form-field__input:focus` for Windows High Contrast / forced-colours mode compatibility (outline becomes visible when box-shadow is stripped).
- FIXED: Section 7: Render mode CSS added — reduced (all transitions killed, glass/neumorphic/glow stripped, controls enlarged), assistive (64px min input height, 32px controls, 3px focus outlines, single-column cards, generous spacing), textonly (native browser controls, custom widgets hidden, underlined inputs only)
- FIXED: Section 10: Responsive token overrides — checkmark sizes now override `--_field-control-size` token instead of bypassing it with direct width/height
- FIXED: Section 11: Card-select responsive — 4/3 columns → 2 at 480px, single column at 280px
- DELETED: Legacy form utilities (`.form-group`, `.form-label`, `.form-input`, `.form-textarea`, `.form-select`, `.form-error`) — pre-atom global.css selectors
- ADDED: Card-select type — pictogram/text cards with hidden native radio/checkbox for AT compatibility. Symbol images resolved by aacResolver. Em-based symbol sizes (2em/3em/4em). Single-select = radio, multi-select = checkbox.
- EXTRACTED: Dark theme rules → `src/styles/zones/theme-luminance-dark.css`
- EXTRACTED: High contrast rules → `src/styles/zones/high-contrast.css`
- EXTRACTED: Highlight-links rules → `src/styles/global/highlight-links.css`
- MOVED: FormField.a11y.css + FormField.a11y.recovery.css → `_reference/FormField/`
- ACCEPTED: Internal `--_field-*` px values (22px, 44px, etc.) — custom property token definitions swapped by contrast variant, not direct hardcoded values
- ACCEPTED: Select arrow SVG with hardcoded `#6b6b6b` — CSS custom properties don't work in data URIs. Comment documents the limitation.
- ACCEPTED: Form control state transitions (border-color, box-shadow, background-color) — same exemption as Button/Link colour transitions. Killed in reduced render.
- ARCHITECTURE: FormField is the ONLY atom allowed raw `<input>`, `<select>`, `<textarea>`.
- ARCHITECTURE: Card-select type renders choices as pictogram cards. Hidden native radio/checkbox behind each card for AT compatibility and form submission. Symbol images resolved by aacResolver at build time.
- ARCHITECTURE: AAC devices send standard browser events. No custom AAC input handling needed.
- ARCHITECTURE: Textonly render shows native browser controls. Card-select becomes plain radio/checkbox list with text labels, no pictograms.
- ARCHITECTURE: Assistive render forces single-column card grid, 64px minimum targets, 3px focus outlines.
- DEFERRED: Save-draft behaviour for AAC users composing long textarea responses.
- DEFERRED: Input tolerance testing — verify no paste blocking, no keystroke validation.
- MIGRATION: Consumers using legacy `.form-group`/`.form-label` classes need migrating to FormField atom.
- MIGRATION: Files moved from `atoms/form/` to `atoms/form/FormField/` — re-export barrel preserves existing import path.

**Card v2 audit findings (2026-03-06):**
- FIXED: Section 2: @layer removed from Card.css + Card.responsive.css
- FIXED: Section 2: Glass variant tokenised — `var(--glass-bg-brand)`, `var(--glass-border-brand)`, `var(--glass-blur)`. New tokens `--glass-bg-brand` and `--glass-border-brand` added to shadows.css (brand-tinted glass, distinct from standard white-based glass)
- FIXED: Section 2: `var(--card-hover-border, var(--brand-c-primary))` fallback removed — default set on `.card--hover-border` class
- FIXED: Section 3: Schema restructured — category → "atom", 4 render keys (full/reduced/assistive/textonly), props grouped into content/visual/animation. `hover` moved to animation group. Stale `reducedMotion` key removed.
- FIXED: Section 4: Base `.card` transition split — border-color only on base. Transform + box-shadow transitions moved to `.card--hover-lift` and `.card--hover-glow` effect classes.
- FIXED: Section 7: Render mode CSS added — reduced (transition + hover killed), assistive (64px link targets, 3px focus outlines), textonly (transparent bordered box, link cards get primary border, overlay/decorative icons/arrow hidden, content chrome stripped)
- FIXED: Section 9: index.ts cleaned — `Card.a11y.css` import removed
- FIXED: Section 11: Doc comments updated — @layer references removed, render modes documented, slot description updated to reference atoms
- ADDED: Hardcoded value comments for comic (3px border, 5px 7px shadow), tech (6px offset), hover-lift (4px translateY) — all intentional variant-specific design values
- EXTRACTED: highlight-links rule → `src/styles/global/highlight-links.css` (link cards get 2px primary border)
- MOVED: Card.a11y.css and Card.a11y.recovery.css → `_reference/Card/` (1173 lines each, ~80% molecule rules for FlipCard, SlideCard, BlogCard, TeamCard, GlowCard, InfoCard, ChoiceCard, ImageRevealCard, AssetCard, RainbowBorderCard)
- ARCHITECTURE: Card is a dumb container — does NOT hide child images in textonly. Image atom handles its own visibility via semanticRole. Decorative → hidden. Meaningful → alt text via replace mode.
- ARCHITECTURE: Textonly card keeps thin neutral border for structure. Link cards get primary border for click indication. No !important needed — pipeline strips visual props so variant classes don't exist in textonly HTML.
- ARCHITECTURE: hover prop is animation, not visual. Pipeline strips in reduced/assistive/textonly. No hover class = no motion on card.
- ARCHITECTURE: Base .card transition is border-color only. Transform + box-shadow transitions live on individual hover/variant effect classes.
- ARCHITECTURE: Badge + Image in textonly — no special wiring needed. Both atoms render in their own textonly modes (Badge as solid label, Image as alt text via replace mode for meaningful images). DOM order ensures sequential reading. Card textonly just strips chrome.
- DONE: Typography primitives (.card__heading, .card__title, .card__text, .card__value, .card__quote, .card__author) and element primitives (.card__badge, .card__button, .card__arrow, .card__icon, .card__quote-icon) deleted from Card.css sections 11+12. Responsive .card__heading clamp deleted. Molecules that break = audit to-do list.
- DEFERRED: Molecule card rules (FlipCard, SlideCard, BlogCard, TeamCard, GlowCard, InfoCard, ChoiceCard, ImageRevealCard, AssetCard, RainbowBorderCard) — all in _reference/Card/Card.a11y.css. Extract during each molecule's audit.
- DEFERRED: Badge text on images — molecule cards that render Badge + Image should ensure Badge label appended to Image altWord. Implement during molecule audit.
- DEFERRED: Card textonly should ensure child Image atoms use data-alt-display-mode="replace" for meaningful images. Molecule passes semanticRole and display mode props to Image.
- DONE: Glass variant tint — added --card-glass-tint custom property. JSON passes glassTint token (e.g. brand-c-primary), CSS mixes at 40% with standard glass bg via color-mix(). No tint = transparent = standard glass.

**Toast v2 audit findings (2026-03-06):**
- REBUILT: Toast.astro — dead template replaced with canonical atom template. Uses Icon atom (barrel import), Text atom for message. aria-atomic="true", tabindex="0", data-semantic-role="status". data-lottie-slug for JS targeting.
- REBUILT: Toast.css — @layer removed, BEM class rename throughout (toast-message → toast__message, toast-${theme} → toast--${theme}, etc.). Internal tokens: --_toast-icon-size (32px), --_toast-max-width (320px), --_toast-z (9999), --_toast-radius, --_toast-icon-color. Render modes override these tokens (e.g. --_toast-max-width: 100% for bar layout). !important removed (was on Lottie SVG fill/stroke — toast.ts handles this directly).
- REBUILT: toast.ts — legacy isA11yMode()/isReducedMotion() deleted. Now reads document.body.dataset.render. BEM class names match Toast.astro. Keyboard dismiss via Escape/Enter. toast.focus() on creation. Render-mode-aware: textonly=no icons, reduced/assistive=static Phosphor only, full=lottie+glow. Dismiss animation: non-full=slow fade 1.2s, full=slide-right 0.3s. Duration default changed 30000→5000.
- FIXED: Toast.responsive.css — @layer removed, !important removed, BEM class names.
- FIXED: contact-popup.js — wrong showToast(message, type) → showToast({ message, theme }) object signature.
- FIXED: index.ts — a11y import removed. Re-exports showToast and types from toast.ts.
- MOVED: Toast.a11y.css + Toast.a11y.recovery.css → _reference/Toast/
- REMOVED: Stale @import in global.css for Toast.a11y.css
- ARCHITECTURE: Toast is dynamic — DOM created at runtime by toast.ts. Toast.astro is canonical template defining correct HTML structure. Both share Toast.css. One source of truth for class names and attributes.
- ARCHITECTURE: All non-full render modes use full-width bar layout. Floating pill toast invisible to Easy Click/Reading Mode users — bar is unmissable, easy to scan, easy to dismiss.
- ARCHITECTURE: toast.ts reads document.body.dataset.render for render mode detection. No legacy #a11y-content-wrapper class checks.
- ARCHITECTURE: Keyboard dismiss via Escape/Enter. Toast receives focus on creation. tabindex="0" enables keyboard interaction for switch/eye gaze users.
- ARCHITECTURE: Icon presets keep public/ filesystem paths for now — toast.ts is client-side JS, can't use server-side ASSET_API_URL env var. Lottie loaded via lottie-web directly (not LottieIcon atom, which is server-side Astro).
- ARCHITECTURE: Internal tokens (--_toast-*) use underscore prefix convention — component-private, not for external override. Render modes override them to switch between pill and bar layouts.
- ACCEPTED: Hardcoded values in themes (4px/6px offset shadows, 3px border, 1.5px neon border, letter-spacing em values) — design-specific variant styling, not spacing tokens.
- ACCEPTED: Lottie SVG fill/stroke handling via JS (setAttribute on paths after lottie-web renders) rather than CSS !important — lottie-web sets inline styles that CSS can't beat without !important.
- ACCEPTED: #toast-container ID selector — only one container per page, created dynamically by JS. ID is the correct selector.
- DEFERRED: Asset API migration for toast icons — when client-side asset routes exist, migrate from public/ filesystem paths to API slugs.
- DEFERRED: LottieIcon atom can't run in client JS (server-side Astro). If LottieIcon gets a client-side API, Toast should migrate.
- MIGRATION: contact-popup.js updated to new showToast({ message, theme }) signature. checkout-form.ts and cookie-banner.ts already use correct object format.

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
| Grid | PASS | 2026-03-06 | Fixes 1-7 applied + post-fix verification (10 checks). All sections pass. Schema: category → "atom", 4 render keys, gallery moved to animation group (GSAP-dependent). @layer removed from Grid.css + Grid.responsive.css. a11y.css extracted — Grid-only layout rules to render mode blocks in Grid.css, all child-reaching rules DELETED (Card, Image, Badge, Button atoms handle themselves). Hardcoded gallery dimensions commented. Separator tokenised (0.75rem → --space-sm). Render mode CSS: reduced (transitions killed, --gallery-animate: 0), textonly (single column flex, showcase hidden, product vertical stack, spanning killed, separator with currentColor), assistive (single column flex with --space-md gap, gallery killed, spanning killed, separator with --brand-c-neutral-light). a11y files → _reference/Grid/. global.css stale import removed. |

**Grid v2 audit findings (2026-03-06):**
- FIXED: Section 2.1: @layer wrappers removed from Grid.css + Grid.responsive.css
- FIXED: Section 3: Schema restructured — category → "atom", 4 render keys, props grouped into content/visual/animation. gallery moved to animation group (GSAP-dependent interactive behaviour). slots documented.
- FIXED: Section 4: index.ts cleaned — Grid.a11y.css import removed
- FIXED: Section 7: Render mode CSS added — reduced (transitions + hover transforms killed, --gallery-animate: 0, inactive opacity reset), textonly (single column flex, showcase hidden, product vertical stack, spanning killed, separator), assistive (single column flex, gallery killed, spanning killed, separator)
- FIXED: Separator tokenised — hardcoded 0.75rem → var(--space-sm)
- ADDED: Hardcoded gallery dimension comments (480px, 120px, 650px in Grid.css; 140px, 100px, 400px, 300px in Grid.responsive.css)
- EXTRACTED: Grid-only reduce-motion rules → [data-render="reduced"] in Grid.css
- EXTRACTED: Grid-only textonly rules → [data-render="textonly"] in Grid.css
- ADDED: Assistive render rules (new — not in original a11y.css)
- DELETED: All child-reaching rules from Grid textonly — card chrome stripping, image hiding, badge/button overrides, text alignment overrides, gallery img/badge rules, content wrapper overrides. ~120 lines of molecule-level CSS that violated atom boundaries.
- MOVED: Grid.a11y.css + Grid.a11y.recovery.css → _reference/Grid/
- REMOVED: Stale @import in global.css for Grid.a11y.css
- ACCEPTED: Component-scoped CSS custom property fallbacks (--grid-gap, --grid-cols, --grid-min, --grid-align etc.) — inline-style safety nets, not brand token fallbacks. Same pattern as FormField.
- ACCEPTED: Hardcoded px values in gallery modes (480px, 120px, 650px, 400px, 300px etc.) — container-specific layout dimensions, not spacing tokens.
- ARCHITECTURE: Grid NEVER reaches into children. Card, Image, Badge, Button, Text, Heading atoms all handle their own render mode behaviour. Grid only controls layout — column collapse, gap, spanning.
- ARCHITECTURE: gallery prop moved to animation group — GSAP-dependent interactive behaviour. Pipeline strips in reduced render (--gallery-animate: 0 kills GSAP). Showcase hidden entirely in textonly/assistive.
- ARCHITECTURE: Textonly and assistive both collapse to single-column flex. Textonly strips all chrome (children handle themselves). Assistive keeps visual chrome but forces single column for easy scanning.
- DEFERRED: Showcase gallery content accessibility — if showcase items contain meaningful content not available elsewhere on page, textonly display:none loses that content. Verify during gallery molecule audit.
- DEFERRED: XL text reflow (section 8c.3) — Grid should respond to text size increases. May need future [data-text-xl] rules. Verify after all atoms pass.

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
- [ ] Tooltip + Icon: 41 icon-label consumers migrate to `<Tooltip purpose="label">` wrapping Icon
- [ ] Tooltip + FormField: info tooltips wire aria-describedby correctly (consumer pattern)
- [ ] Tooltip + Image: coexists with Image's own tooltip display mode (independent systems)
- [ ] Tooltip: utilities.css tooltip block (lines 230-492) removed after all data-tooltip consumers migrated to Tooltip atom
- [ ] Tooltip consumers to migrate: ReaderNav (.info-tooltip), ShareSection (inline tooltip CSS), any element with data-tooltip attribute
- [ ] All decorative atoms: confirm none appear in textonly render
- [ ] Print: all atoms have appropriate print rules or inherit from global print stylesheet
- [ ] `--font-size-sm` token: resolve globally or replace in all atoms that reference it
- [ ] `[data-render="assistive"]` rules: confirm pattern exists in all interactive atoms
- [ ] Token coverage grep: every `var(--token-name)` in component CSS resolves to a definition in `src/styles/`. Automate as build-time check.
- [ ] Glass/glow token pass: every inline `color-mix()` in atom CSS that matches a glass or glow pattern should use the token from `shadows.css` instead. Tokens: `--glass-bg`, `--glass-bg-light`, `--glass-bg-dark`, `--glass-bg-frosted`, `--glass-bg-brand`, `--glass-bg-brand-tint`, `--glass-bg-primary`, `--glass-border-*`, `--glass-blur-*`, `--glass-shadow-inset`, `--glow-ambient`, `--glow-neon`, `--glow-neon-hover`, `--glow-spread`, `--glow-text`. Known atoms with inline glass/glow: Toast (glass + neon themes), Card (liquid-glass), FormField (dark glass in theme-luminance-dark.css). Also check organisms: ReaderNav (5 glass bg variants, glow/spread shadows), GlassNav (base glass bg).
- [ ] Dark luminance token check: glass tokens overridden in `theme-luminance-dark.css` (`--glass-bg`, `--glass-bg-light`, `--glass-bg-frosted`, `--glass-bg-brand-tint`, `--glass-border`, `--glass-border-frosted`, `--glass-shadow-inset`). Verify all atoms using these tokens render correctly in both light (BrandDefault) and dark (a11y-dark, a11y-high-contrast) themes. Use toast-demo.astro for visual comparison.
- [ ] Glow token consistency: verify `--glow-neon` / `--glow-spread` used consistently across Toast neon theme and ReaderNav glow shadow variant. Fix ReaderNav line 875 `rgba()` bug (hardcoded fallback `99, 102, 241` — should use `color-mix` like all other glow rules).
