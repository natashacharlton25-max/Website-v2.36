# Molecule Audit Session — 2026-03-16

## Context
Bottom-up audit of Tier 1 molecule cards (22 components, alphabetical order).
Using `component-audit-post-atom-checklist.md` (15 sections).
All 12 atoms are pass 2 clean. Hover gate system implemented day 1.

## Session Summary

### Day 1 (2026-03-16)
- **3 molecules PASS**: RainbowBorderCard, AuthorCard, BlogCard
- **2 molecules DELETED**: AssetCard (compose at page level), ChoiceCard (merged into FormField card-select)
- **1 atom enhanced**: FormField — `fieldStyle="bare"`, card-select with image/icon/description/toggle, check indicators
- **Hover gate system**: full infrastructure built (9 files), 4 atoms retrofitted
- **5 latent bugs fixed**: data-cvd, data-theme-chroma, data-render, data-high-contrast, data-highlight-links never set by ThemeSwitcher
- **Global fixes**: Badge dark mode text, Card dark/HC borders, typography scale, Button hover, FormField toggle iOS-style

### Day 2 (2026-03-17)
- **1 molecule PASS**: CompactToolCard
- **1 atom enhanced**: Image atom — now accepts `string | ImageMetadata` (Astro build-time optimisation)
- **Image size tokens rescaled**: 2xs(32px) → 5xl(500px), shape combos (circle/rounded/sharp)
- **CLAUDE.md updated**: atom import rules (barrel only, never astro:assets)
- **CardSelect decision**: NOT extracted as molecule. FormField card-select stays. Quiz logic → section organisms (QuizSection, AssessmentSection, MatchingSection, SurveySection)
- **Global fixes**: Card hover-border → secondary in dark/HC, Badge fill transparent in dark mode, Badge sm letter-spacing

## Audit Order (Tier 1 — Molecule Cards)

| # | Component | Status | Key findings | Deferred |
|---|-----------|--------|-------------|----------|
| 1 | AssetCard | **DELETED** | Not a molecule — just atoms composed together. Page-level composition with RainbowBorderCard wrapper. | |
| 2 | AuthorCard | **PASS** | Folder structure, scoped style extracted, raw HTML→atoms (Image, Heading, Text), photo size via `--img-width-*` tokens, collection fields (longBio, credentials, specialties), `ImageMetadata` support | Offset photo pattern → future Card atom `mediaPosition` prop |
| 3 | BlogCard | **PASS** | Folder structure, atoms used, token chain (7 tokens), hover gate, render modes, glass badge on image, fill tags, author icon+bold. Dark/HC rules in zone files. | Image atom figure needs border-radius:0 inside cards (global pattern) |
| 4 | ChoiceCard | **DELETED** | Merged into FormField card-select. Card-select now handles image/icon/description/checkbox/radio/toggle. Dark/HC zone rules, hover gate, textonly (unchanged — functional content). | |
| 5 | CompactToolCard | **PASS** | Folder structure, Card + Image + Heading + Text + Badge + Icon atoms. Internal tokens (7). Plus icon 360 spin (full), slow spin (gentle), scale (instant), static (none). Icon colour primary→secondary on hover (gated). Media slot: image (string\|ImageMetadata), icon, LottieIcon. Responsive: stack 480px, centre 300px, hide media 200px. Textonly: media + action hidden, badge outline. | |
| 6 | FlipCard | pending | | |
| 7 | GlowCard | pending | | |
| 8 | ImageRevealCard | pending | | |
| 9 | InfoCard | pending | | |
| 10 | InsightCard | pending | | |
| 11 | MasonryCard | pending | | |
| 12 | OfferingCard | pending | | |
| 13 | ProductCard | pending | | |
| 14 | ProjectCard | pending | | |
| 15 | ProjectSpecCard | pending | | |
| 16 | RainbowBorderCard | **PASS** | Full rebuild: folder structure, CSS extracted, rainbow tokens (CVD-safe), hover gate, render modes, single-spin animation, ::after overlay (no jump), colors array prop (2-7 stops), shadow on thick borders | |
| 17 | SlideCard | pending | | |
| 18 | SpecCard | pending | | |
| 19 | StepCard | pending | | |
| 20 | TeamCard | pending | | |
| 21 | TestimonialCard | pending | | |
| 22 | WhyCard | pending | | |

## Decisions Log

| # | Decision | Reason | Date |
|---|----------|--------|------|
| 1 | Hover gate implemented before molecule audit | Need gate infrastructure for section 14 checks | 2026-03-16 |
| 2 | Card reduced render: hover states now fire instantly (not suppressed) | Hover is feedback not animation | 2026-03-16 |
| 3 | Colour-flow 3s timing left unchanged | Continuous animation, not standard hover transition | 2026-03-16 |
| 4 | highlight-links.css activated (was dead code) | Needed for data-highlight gate | 2026-03-16 |
| 5 | AssetCard deleted — not a molecule | Just atoms composed together. RainbowBorderCard wraps at page level | 2026-03-16 |
| 6 | RainbowBorderCard uses rainbow tokens | Replaced brand-c-* with --rainbow-* tokens. CVD-safe, dark-mode-aware, kills !important | 2026-03-16 |
| 7 | asset-detail.a11y.css deleted | Orphaned CSS — targeted different component, no .astro file | 2026-03-16 |
| 8 | ThemeSwitcher: `data-cvd` attribute added | Was never set — rainbow-protan/tritan tokens were gated on `[data-cvd]` but nobody wrote the attribute. All CVD rainbow colours were broken site-wide. | 2026-03-16 |
| 9 | RainbowBorderCard: 1.2s fade → `var(--transition-extralong)` | No hardcoded timings — tokenised per hover gate checklist | 2026-03-16 |
| 10 | ThemeSwitcher: `data-theme-chroma` attribute added | Was never set — mono rainbow overrides gated on `[data-theme-chroma="grey"]` but nobody wrote the attribute. Mono themes had full-colour rainbows. | 2026-03-16 |
| 11 | Hover mode persists via a11y settings | Added `hoverMode` to A11ySettings interface + defaults + applySettings + localStorage. Survives navigation and sessions. | 2026-03-16 |
| 12 | Hover mode rules: none=zero change, instant=colour only (no movement/shadow), full=colour+lift+shadow (200ms), gentle=colour+lift+shadow (1s) | Codified as the standard for all components | 2026-03-16 |
| 13 | Primary button hover: `color-mix(70% brand, 30% black)`, dark/HC: `color-mix(70% brand, 30% white)` | Consistent 30% shift, direction flips per luminance | 2026-03-16 |
| 14 | Typography scale: `--text-h2` fixed from 2rem → 5rem | Was too small for card headings. h1 stays 15rem (hero). h3→2rem, h4→1.5rem, h5→1.25rem | 2026-03-16 |
| 15 | `.card .heading--h2` context override squashes to 18px | Deferred: delete from Heading.css when all card molecules pass size via props. AuthorCard overrides locally for now. | 2026-03-16 |
| 16 | `data-render` attribute was never set — panel only used legacy classes. Now wired up. | 2026-03-16 |
| 17 | Dark mode: all cards get 1px primary border. Badge fill/outline/glass text fixed to white. | 2026-03-16 |
| 18 | High contrast: all cards get 2px primary border. | 2026-03-16 |
| 19 | `data-high-contrast` attribute was never set — ThemeSwitcher now detects from theme name. | 2026-03-16 |
| 20 | Badge fill dark mode: was `color: var(--color-Black)` → now `var(--color-White)`. Global fix. | 2026-03-16 |
| 21 | BlogCard dark/HC: tag overrides + meta/author visibility moved to zone files. | 2026-03-16 |
| 22 | Cards inside RainbowBorderCard: skip dark/HC border (rainbow IS the border). | 2026-03-16 |
| 23 | Card atom: hover now accepts array `['lift', 'border']` for combining effects. | 2026-03-16 |
| 24 | Card atom: instant hover gate — no movement. None gate — border-color matches zone (dark=primary, HC=primary, light=neutral). | 2026-03-16 |
| 25 | ChoiceCard deleted — merged into FormField card-select | FormField card-select now handles image/icon/description/checkbox/radio/toggle. ChoiceCard was a duplicate. | 2026-03-16 |
| 26 | FormField: `fieldStyle="bare"` added | No wrapper chrome — for embedding inside other components | 2026-03-16 |
| 27 | FormField card-select: check indicators inline with label | Checkbox tick, radio dot, toggle slider — all CSS, no extra HTML | 2026-03-16 |
| 28 | FormField card-select dark/HC: primary border, primary-900 hover bg, secondary on checked | Consistent pattern across both zones | 2026-03-16 |
| 29 | FormField card-select textonly: unchanged (functional content, not decorative) | Images are choices, toggles are form controls — never stripped | 2026-03-16 |
| 30 | Card-select hover none: only check indicator changes, card face static | Hover gate applied per standard rules | 2026-03-16 |
| 31 | Molecules are NOT generic ContentCard — each card has its own nuances | AuthorCard offset photo, BlogCard image zoom, etc. — can't generalise | 2026-03-16 |
| 32 | Pages only import organisms + JSON — never atoms/molecules directly | Section organisms compose atoms. Pages pass data. | 2026-03-16 |
| 33 | All dark/HC rules go in zone files, never in component CSS | Component CSS is mode-agnostic. Zones handle visual adaptation. | 2026-03-16 |
| 34 | Internal token chain mandatory for all molecules | `--_component-*` tokens with `--component-*` bridge. Render modes override internal tokens. Priority: render > JSON > defaults. | 2026-03-16 |
| 35 | CardSelect NOT extracted as molecule | FormField card-select stays. Quiz/assessment logic → section organisms (QuizSection, AssessmentSection, MatchingSection, SurveySection). FormField stays dumb. | 2026-03-17 |
| 36 | Image atom accepts `string \| ImageMetadata` | Molecules pass imported assets or URLs. Atom routes to `AstroImage` (build-time) or `<img>` (runtime). Both paths get full a11y. | 2026-03-17 |
| 37 | Image size tokens rescaled | New thumbnail sizes: 2xs(32px), xs(48px), sm(64px), md(80px). Old xs(128px)→lg. Shape combos: .img-circle-*, .img-rounded-*, .img-sharp-*. | 2026-03-17 |
| 38 | CLAUDE.md: atom import rules added | Barrel imports only. Never `astro:assets`. Never direct `.astro` files. Image atom handles ImageMetadata. | 2026-03-17 |
| 39 | Card hover-border → secondary in dark/HC | Global zone fix. Static border = primary, hover = secondary. Visible change in dark/HC modes. | 2026-03-17 |
| 40 | Badge fill dark mode: transparent bg | Fill badges in dark mode get no background, just border + glow. Prevents dark-on-dark readability issues. | 2026-03-17 |
| 41 | Badge sm: letter-spacing 0.08em | Small badges with uppercase text need wider spacing for readability. | 2026-03-17 |
| 42 | Icon colour via CSS tokens, not inline `color` prop | Inline `color` has highest specificity — CSS hover can't override. Use `currentColor` inheritance from parent container. | 2026-03-17 |

## Deferred Items (added to v2-audit-todo)

| # | Item | Blocked by | Added |
|---|------|-----------|-------|
| 1 | Grid: responsive page-edge margins — container padding doesn't reduce on small screens | Grid organism audit | 2026-03-16 |
| 2 | RainbowBorderCard: IntersectionObserver spin-once on scroll into view | Enhancement | 2026-03-16 |
| 3 | RainbowBorderCard: touch timeout should match actual spin duration | Enhancement | 2026-03-16 |
| 4 | Heading.css `.card .heading` context overrides — delete when all card molecules pass size via props | All card molecules audited | 2026-03-16 |
| 5 | Card atom: `mediaPosition` prop (offset-left/top/right, inset-left/top) | Card atom enhancement | 2026-03-16 |
| 6 | Authors collection: consider JSON format instead of markdown | Content architecture | 2026-03-16 |
| 7 | AuthorCard: photo → Card atom media slot once `mediaPosition` exists | Card atom `mediaPosition` | 2026-03-16 |
| 8 | Author page: full dedicated page with all collection fields | New page build | 2026-03-16 |
| 9 | FormField card-select cognitive gating: hide indicators at green level, show at yellow+ | `data-cognitive-level` integration | 2026-03-16 |
| 10 | QuizSection organism: FormField card-select + reveal button + confetti + correct/wrong states + explanation text | Organism audit phase | 2026-03-17 |
| 11 | AssessmentSection organism: multi-question quiz + scoring + progress bar | Organism audit phase | 2026-03-17 |
| 12 | MatchingSection organism: drag-and-drop matching | Organism audit phase | 2026-03-17 |
| 13 | SurveySection organism: data collection with mixed FormField types | Organism audit phase | 2026-03-17 |
