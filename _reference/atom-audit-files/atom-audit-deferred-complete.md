# Atom Audit — Deferred Items + Token Prop Layer

## NEW: Colour Token Prop Layer (all atoms)

Every atom that references colour tokens needs a CSS custom property that JSON can override. No fallbacks — direct prop consumption.

**Pattern:**
```css
/* Before */
.card { background: var(--brand-c-bg); }

/* After */
.card { background: var(--card-bg); }
```

JSON pipeline provides `--card-bg` via inline style. No fallback to `--brand-c-*`.

### Per-atom colour token mapping:

**Badge**
- `--badge-bg` (currently uses zone-bg-* tokens — REMAP to rainbow)
- `--badge-text` (currently `--brand-c-text`, `--brand-c-text-dark`)
- `--badge-border` (currently zone-pattern-* — REMAP to rainbow)
- `--badge-icon-color`
- Also: remap all `--zone-bg-*` → `--rainbow-n-wash/light`, all `--zone-pattern-*` → `--rainbow-n-dark`

**Button**
- `--btn-bg` (currently `--brand-c-primary`, `--brand-c-secondary`, `--brand-c-neutral-light`)
- `--btn-text` (currently `--brand-c-bg`, `--color-White`, `--color-Black`)
- `--btn-border` (currently `--brand-c-primary-dark`, `--brand-c-neutral-dark`)
- `--btn-hover-bg`
- `--btn-hover-text`
- Also: remap `--confetti-*` → `--rainbow-n` (already done in confetti tokens file)
- Also: `--shadow-dropdown-md`, `--shadow-neu-*` — check these exist in shadows.css

**Card**
- `--card-bg` (currently `--brand-c-bg`, `--color-White`)
- `--card-text` (currently `--brand-c-text`, `--brand-c-text-dark`, `--brand-c-text-light`)
- `--card-border` (currently `--brand-c-neutral-light`, `--brand-c-primary`)
- `--card-heading-color` (currently `--brand-c-text-dark`)
- `--card-hover-border` (currently `--card-hover-border` — already a prop!)

**FormField**
- `--field-bg` (currently `--brand-c-bg`)
- `--field-text` (currently `--brand-c-text`)
- `--field-border` (currently `--brand-c-neutral-light`, `--brand-c-neutral`)
- `--field-focus-border` (currently `--brand-c-primary`)
- `--field-label-color` (currently `--brand-c-text`)
- `--field-error-color` (currently `--color-Error`)

**Heading**
- `--heading-color` (currently `--brand-c-text`, `--brand-c-primary`, `--brand-c-primary-dark`, `--brand-c-secondary`)
- `--heading-accent` (currently `--brand-c-primary-light`, `--brand-c-secondary-light`)

**Text**
- `--text-color` (currently `--brand-c-text`, `--brand-c-text-light`)
- `--text-accent` (currently `--brand-c-primary`, `--brand-c-secondary`)

**Link**
- `--link-color` (currently `--brand-c-primary`, `--brand-c-secondary`)
- `--link-hover` (currently `--brand-c-primary-dark`)
- `--link-visited` (currently `--brand-c-text-light`)

**List**
- `--list-marker-color` (currently `--brand-c-primary`, `--brand-c-secondary`)
- `--list-text-color` (currently `--brand-c-text`)

**Image**
- `--img-border-color` (currently `--brand-c-primary`)
- `--img-caption-color` (currently `--brand-c-text-dark`)
- `--img-overlay-bg` (currently `--color-Black`)

**Icon**
- `--icon-color` (currently inherits or uses glow/shadow tokens)

**ScrollDrawIcon**
- `--draw-color` (currently `--brand-c-primary`)

**Toast**
- `--toast-bg` (currently `--brand-c-bg`, glass tokens)
- `--toast-text` (currently `--brand-c-text`, `--brand-c-text-dark`)
- `--toast-accent` (currently `--brand-c-primary`)
- `--toast-border` (currently glass tokens)

**Tooltip**
- `--tooltip-bg` (currently `--brand-c-bg`, `--brand-c-bg-dark`, glass tokens)
- `--tooltip-text` (currently `--brand-c-text`, `--brand-c-text-dark`)
- `--tooltip-border` (currently glass tokens)

**Grid**
- `--grid-divider-color` (currently `--brand-c-neutral-light`)

---

## Existing Deferred Items (from first audit pass)

### Icons

**Icon (PARTIAL)**
- AAC semantic role rules for .icon — move from Image.css to global AAC stylesheet (src/styles/global/aac-mode.css)
- Inline px style could use --icon-size CSS custom property pattern — future improvement, parent owns sizing for now

**LottieIcon (PARTIAL)**
- Consumer migration (GlassNav, ReaderNav, ShareSection, Button) from legacy src="/Icons/..." paths to slug props — needed before lottie_mappings can provide Phosphor fallbacks
- lottie_mappings shared fallbacks (a_38uz8cvrxpo7 ×4, a_y99i2lyj67xi ×5) — verify semantic correctness during consumer audits
- lottie-web JS bundle gating — render pipeline should exclude `<script>` from non-full renders

### Typography

**Text**
- 32+ raw `<small>` and 4 raw `<blockquote>` across molecules/organisms bypass Text atom — migrate to `<Text as="small">` / `<Text as="blockquote">`, then remove duplicate element rules from global.css

**Heading**
- Consumer context overrides (.card .heading, nav .heading, mega menu) — delete during consumer audits, consumers pass size/weight props
- SectionTitle.astro deprecated — migrate consumers to `<Heading>`, then delete
- Visually test fit-content + alignment variants (center, right) after heading fixes

### UI Atoms

**Badge**
- Badge-in-Card alt text integration — when Badge overlays Image in Card, assistive/textonly renders should flow badge in normal document order. Card audit will verify.
- Icon inside Badge — verify Icon atom's aria-hidden and data-semantic-role propagate correctly (cross-atom Section 16)

**Link**
- Animation effects CSS implemented but needs visual testing across all themes and render modes
- highlight-links.css needs Link rules for new variants (highlight, border)

**List**
- Icon inside List — verify Icon atom's aria-hidden propagates correctly (cross-atom Section 16)
- Print layer — lists need page-break-inside: avoid on list items

**Image (PARTIAL)**
- Alt text word + descriptive spans → Text atom
- AAC pictogram card → Card+Image+Text atom markup in aac-cards.ts
- AAC text-only fallback → Text atom markup
- Pictogram img in AAC cards → Image atom markup
- Print — deferred to global print layer

**FormField**
- Save-draft behaviour for AAC users composing long textarea responses
- Input tolerance testing — verify no paste blocking, no keystroke validation

**Card**
- Typography primitives (.card__heading, .card__title, .card__text, .card__value, .card__quote, .card__author) — consumers should migrate to Heading/Text atoms. Delete when all 22 molecule consumers updated.
- .card__button and .card__badge — consumers should use Button/Badge atoms
- Molecule card rules (FlipCard, SlideCard, BlogCard, TeamCard, GlowCard, InfoCard, ChoiceCard, ImageRevealCard, AssetCard, RainbowBorderCard) — all in _reference/Card/Card.a11y.css. Extract during each molecule's audit.
- Badge text on images — molecule cards rendering Badge + Image should ensure Badge label appended to Image altWord
- Card textonly should ensure child Image atoms use data-alt-display-mode="replace" for meaningful images

**Toast**
- Asset API migration for toast icons — migrate from public/ filesystem paths to API slugs when client-side asset routes exist
- LottieIcon atom can't run in client JS (server-side Astro) — if LottieIcon gets a client-side API, Toast should migrate

### Decorative / Layout

**Showcase**
- Gallery content accessibility — if showcase items contain meaningful content not available elsewhere on page, textonly display:none loses that content. Verify during gallery molecule audit.

**Grid**
- XL text reflow — Grid should respond to text size increases. May need future [data-text-xl] rules.

### Consumer Migration (old tokens → rainbow)

- Badge.css — 14 zone-bg + 6 zone-pattern refs → rainbow tints
- Button.css — 4 confetti refs → rainbow base (done in confetti tokens remap)
- DrawSVGIcon.astro — 8 zone-pattern refs → rainbow dark tints
- ScrollMorphZone.style.css — zone-bg + zone-pattern refs → rainbow tints
- scroll-color-driver.ts — runtime zone-bg resolution → rainbow wash
- pattern-morph.ts — runtime zone-pattern resolution → rainbow dark
- about.astro — 3 zone-bg refs → rainbow wash

### Gradient Fixes

- `--gradient-secondary` — same colour both ends (flat, not gradient)
- `--gradient-neutral` — same colour both ends
- `--gradient-background-warm` — same colour both ends

---

## Summary

| Category | Count |
|---|---|
| Colour token prop layer (NEW) | 14 atoms, ~50 props |
| Consumer migration (old → rainbow) | 7 files |
| Cross-atom composition | 11 items |
| Consumer migration (legacy patterns) | 5 items |
| Visual/manual testing | 5 items |
| Global layers not yet built | 3 items (print, AAC, highlight-links) |
| Gradient fixes | 3 items |
| **Total** | ~84 items |
