# v2 Audit TODO — 2026-03-10

Status snapshot of every atom against `component-audit-checklist-v2.md`.

---

## Atoms — PASS (9/22)

These passed all 16 v2 checklist sections. Only deferred items remain.

| Atom | Date | Key deferred items |
|------|------|--------------------|
| Badge | 2026-03-09 | Contrast calc needs pipeline. Badge-in-Card alt text (Card audit). Icon inheritance (cross-atom). |
| Button | 2026-03-05 | Consumer context override cleanup. LottieIcon animation passthrough verify. Print (global). |
| Card | 2026-03-10 | Print (global). Molecule card rules in `_reference/Card/` — extract per molecule audit. |
| FormField | 2026-03-10 | Save-draft for AAC. Input tolerance testing. Consumer migration from legacy `.form-group`. Print (global). |
| Grid | 2026-03-06 | Showcase gallery content in textonly. XL text reflow. Print (global). |
| Link | 2026-03-10 | Pass 2: internal tokens, colour group, color enum fixed, --text-color bug fixed, transitions tokenised. Glass consumer migration (Footer, GlassNav → Button). Animation visual testing. Print (global). |
| List | 2026-03-05 | Icon inheritance (cross-atom). Slot consumer migration. Print (global). |
| Toast | 2026-03-06 | Asset API migration for toast icons. LottieIcon client-side migration. Print (global). |
| Tooltip | 2026-03-07 | utilities.css tooltip block removal after consumer migration. Print (global). |

---

## Atoms — PARTIAL (5/22)

Audit started, fixes applied, but outstanding items remain.

### Icon — PARTIAL (2026-03-10)
- [x] Animation CSS merged into base (no separate file)
- [x] Responsive.css created
- [x] Assistive render key added to schema
- [x] Schema `category` fixed (`atoms/icons` → `atom`)
- [x] `semanticRole` added to schema content group
- [x] Colour group added (3 pipeline tokens: iconColor, iconShadow, iconGlow)
- [x] Animation `_description` updated (removed stale "a11y" wording)
- [x] Shadow/glow CSS routing fixed (all pointed to `-md`, now correct per size)
- [x] Internal `--_icon-color` token added
- [x] `class:list` migration on `<span>`
- [ ] AAC semantic role rules → move from Image.css to `src/styles/global/aac-mode.css`
- [ ] Inline px style → future `--icon-size` CSS custom property pattern

### LottieIcon — PARTIAL (2026-03-04)
- [x] Schema: 3 optional content dimensions (slug, fallbackIcon, label)
- [x] Renders: full→LottieIcon, reduced/assistive→Icon, textonly→Text
- [ ] Consumer migration from `src="/Icons/..."` paths to slug props (GlassNav, ReaderNav, ShareSection, Button)
- [ ] lottie_mappings shared fallback verification
- [ ] lottie-web JS bundle gating per render mode
- [ ] Colour group in schema (pipeline tokens)

### Image — PARTIAL (2026-03-10)
- [x] Schema corrected, focus-visible added, --font-size-sm fixed
- [x] Assistive render + XL text reflow CSS added
- [x] Schema restructured: renders top, notes, _description, class prop, textonly flags
- [x] Colour group added (3 pipeline tokens: imgBorder, imgCaption, imgOverlay)
- [x] Internal tokens added (--_image-border, --_image-caption, --_image-overlay)
- [x] All bridge chains replaced with internal tokens
- [x] Focus-visible 2px → var(--border-width-2)
- [x] Class arrays cleaned (.filter(Boolean) removed)
- [ ] Alt text word + descriptive spans → Text atom
- [ ] AAC pictogram card → Card+Image+Text markup in aac-cards.ts
- [ ] AAC text-only fallback → Text atom markup
- [ ] Pictogram img in AAC cards → Image atom markup

### Heading — PARTIAL (2026-03-10)
- [x] Schema restructured, divider em-based, underline percentage-based
- [x] LottieIcon support in media slot
- [x] Colour group in schema (8 pipeline tokens)
- [x] Internal token consolidation (15 `--_heading-*` tokens, all bridge chains routed)
- [x] `color` prop enum fixed → `[accent, text, muted, inherit]` matching CSS classes
- [x] `class:list` migration in Heading.astro
- [x] Dark mode heading override in theme-luminance-dark.css (text headings → primary-600)
- [ ] Context overrides — delete during consumer audits (.card .heading, nav .heading, mega menu)
- [ ] SectionTitle.astro deprecation → migrate consumers to `<Heading>`
- [ ] Raw heading migration across molecules/organisms
- [ ] Token consistency check with Text
- [ ] fit-content alignment visual test

### Text — PARTIAL (2026-03-06)
- [x] Schema corrected, context overrides deleted, textTone prop added
- [x] Toast glass/neon delegated to textTone
- [ ] Verify Card and nav consumers pass correct size/leading props
- [ ] Token coverage: --font-body-alt and --font-handwriting must be defined for every brand
- [ ] 32+ raw `<small>` and 4 raw `<blockquote>` → migrate to `<Text as="small/blockquote">`
- [ ] Colour group in schema (pipeline tokens)

---

## Atoms — PENDING (8/22)

Not yet audited.

### atoms/a11y/
| Atom | Notes |
|------|-------|
| Announcer | No a11y.css (good). aria-live component. Part of a11y panel. |
| PresetButton | Has a11y.css + recovery. Part of a11y panel. |
| Stepper | Has a11y.css + recovery. Part of a11y panel. |

### atoms/canvas/
| Atom | Notes |
|------|-------|
| RevealCanvas | Has a11y.css + recovery. Decorative (textonly: null). Used by HeroSection. |

### atoms/effects/
| Atom | Notes |
|------|-------|
| DrawSVGIcon | Has a11y.css. Decorative. |
| ScrollDrawIcon | Has a11y.css + recovery. Decorative. |
| PagePatternLayer | Has a11y.css + recovery. Decorative (textonly: null). |
| ParallaxDecor | Has a11y.css + recovery. Decorative (textonly: null). |
| PatternOverlay | Has a11y.css + recovery + pattern-motion.css. Decorative (textonly: null). |
| PhysicsOverlay | Has a11y.css + recovery. Decorative (textonly: null). Matter.js — JS bindings critical. |
| ScrollColorBackground | Has a11y.css + recovery. Decorative (textonly: null). GSAP ScrollTrigger — JS bindings critical. |

### atoms/gallery/
| Atom | Notes |
|------|-------|
| GalleryItem | Has a11y.css + recovery. Uses .style.css naming. No .astro file? Possibly incomplete/abandoned. |

---

## Molecules — Moved Out of Atom Audit Scope

These were originally listed in the audit log but are molecule-level:

| Component | Location | Notes |
|-----------|----------|-------|
| DPadMenu | molecules/Menu/ | Has a11y.css. No schema/barrel. |
| RadialMenu | molecules/Menu/ | Has a11y.css. No schema/barrel. |
| ShareMenu | molecules/Menu/ | Standalone .astro only. |

---

## Cross-Atom Deferred Items (resolve after all atoms pass)

These were logged as DEFERRED during individual audits:

### Schema colour groups needed (10 atoms)
- [ ] Text
- [ ] Heading
- [ ] Link (may already have — check)
- [ ] List
- [ ] Image
- [ ] Icon
- [ ] LottieIcon
- [ ] ScrollDrawIcon
- [ ] Toast (may already have — check)
- [ ] Grid

### Consumer migrations
- [ ] 32+ raw `<small>` → `<Text as="small">`
- [ ] 4 raw `<blockquote>` → `<Text as="blockquote">`
- [ ] 41 icon-label consumers → `<Tooltip purpose="label">`
- [ ] `<Link variant="glass">` consumers → `<Button variant="glass" shape="pill" href="...">`
- [ ] LottieIcon consumers: src paths → slug props
- [ ] SectionTitle.astro consumers → `<Heading>`
- [ ] Legacy `.form-group`/`.form-label` consumers → FormField atom
- [ ] utilities.css tooltip block (lines 230-492) removal after Tooltip atom migration
- [ ] Tooltip consumers: ReaderNav (.info-tooltip), ShareSection (inline tooltip CSS), data-tooltip elements

### Theme engine cleanup
- [ ] Remove dead rainbow code from `src/utils/theme-engine.js`: `computeRainbow()`, `RAINBOW_PALETTES`, `getRainbowPalette()`, `auditRainbowContrast()`, rainbow from `buildCSS()` and `generateThemeData()`
- [ ] Remove rainbow audit reporting from `scripts/generate-theme-tokens.js`

### Global layers (build after all atoms pass)
- [ ] Print stylesheet
- [ ] `src/styles/global/aac-mode.css` — AAC semantic role rules from Image.css
- [ ] Glass/glow token pass — replace inline `color-mix()` with `shadows.css` tokens
- [ ] Dark luminance token check — verify all atoms render in light + dark themes
- [ ] Glow token consistency — ReaderNav line 875 rgba() bug
- [ ] Token coverage grep — every `var(--token)` in component CSS resolves

### Final cross-atom verification
- [ ] Focus order across multi-atom pages
- [ ] Icon inheritance: aria-hidden, data-semantic-role propagated in all consumers
- [ ] Button + Icon animation passthrough
- [ ] Card + Image: focus indicator visible, alt text not clipped
- [ ] Grid + Card: assistive collapse, focus order intact
- [ ] FormField + Button: assistive sizing on form submit
- [ ] Text + Heading: consistent token scale
- [ ] Link + highlight-links: global setting applies in all containers
- [ ] Toast + Icon: decorative state correct
- [ ] All decorative atoms: confirm none in textonly render
- [ ] `[data-render="assistive"]` rules exist in all interactive atoms

---

## Priority Order (suggested)

1. **Finish PARTIAL atoms** — Icon, LottieIcon, Image, Heading, Text (5 remaining)
2. **Pending decorative atoms** — effects/ batch (7 atoms, all decorative, similar pattern)
3. **Pending a11y panel atoms** — Announcer, PresetButton, Stepper (3 atoms, special case)
4. **RevealCanvas + GalleryItem** — canvas/ and gallery/ (2 atoms)
5. **Schema colour groups** — add to all 10 atoms that need them
6. **Consumer migrations** — raw elements, icon-labels, glass links, SectionTitle
7. **Global layers** — print, aac-mode, glass/glow token pass
8. **Final cross-atom audit** — run full checklist
