# Molecule Audit Session — 2026-03-16

## Context
Bottom-up audit of Tier 1 molecule cards (22 components, alphabetical order).
Using `component-audit-post-atom-checklist.md` (15 sections).
All 12 atoms are pass 2 clean. Hover gate system implemented today.

## Audit Order (Tier 1 — Molecule Cards)

| # | Component | Status | Key findings | Deferred |
|---|-----------|--------|-------------|----------|
| 1 | AssetCard | **DELETED** | Not a molecule — just atoms composed together. Page-level composition with RainbowBorderCard wrapper. | |
| 2 | AuthorCard | **PASS** | Folder structure, scoped style extracted, raw HTML→atoms (Image, Heading, Text), photo size via `--img-width-*` tokens, collection fields (longBio, credentials, specialties), `ImageMetadata` support | Offset photo pattern → future Card atom `mediaPosition` prop |
| 3 | BlogCard | **PASS** | Folder structure, atoms used, token chain (7 tokens), hover gate, render modes, glass badge on image, fill tags, author icon+bold. Dark/HC rules in zone files. | Image atom figure needs border-radius:0 inside cards (global pattern) |
| 4 | ChoiceCard | **PASS** | Folder structure, Card atom wrapper, FormField atom for checkbox/radio/toggle, Image atom, inputType prop, description prop, active border state, tokens, hover gate, render modes | Inner curve mask as global token (deferred) |
| 5 | CompactToolCard | pending | | |
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
| 16 | `data-render` attribute was never set — panel only used legacy `.a11y-text-only` / `.a11y-reduce-motion` classes. All `[data-render]` CSS was dead. Now wired up. | 2026-03-16 |
| 17 | Dark mode: all cards get 1px border (10% white). Badge fill text forced dark. Badge glow toned down. | 2026-03-16 |
| 18 | High contrast: all cards get 2px solid border. | 2026-03-16 |

## Deferred Items (added to v2-audit-todo)

| # | Item | Blocked by | Added |
|---|------|-----------|-------|
| 1 | Grid: responsive page-edge margins — container padding doesn't reduce on small screens, cards get clipped | Grid organism audit | 2026-03-16 |
| 2 | RainbowBorderCard: IntersectionObserver spin-once on scroll into view — touch/mobile users see the animation without needing to tap. Desktop hover still works. | RainbowBorderCard enhancement | 2026-03-16 |
| 3 | RainbowBorderCard: touch timeout should match actual spin duration not fixed 2000ms | RainbowBorderCard enhancement | 2026-03-16 |
| 4 | Heading.css `.card .heading` context overrides — delete when all card molecules pass size via props | All card molecules audited | 2026-03-16 |
| 5 | Card atom: `mediaPosition` prop (offset-left/top/right, inset-left/top) for image/icon offset layouts | Card atom enhancement | 2026-03-16 |
| 6 | Authors collection: consider JSON format instead of markdown (no body content needed) | Content architecture | 2026-03-16 |
| 7 | AuthorCard: photo should use Card atom media slot once `mediaPosition` exists — currently separate div | Card atom `mediaPosition` | 2026-03-16 |
| 8 | Author page: full dedicated page with large photo, long bio, credentials, specialties, signature, social links. Uses same content collection. AuthorCard links to it via `href` prop. | New page build | 2026-03-16 |
