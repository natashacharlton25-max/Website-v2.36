# End-of-Day Document Verification — March 4 2026

Check that ALL of the following decisions and rules are captured in CLAUDE.md, architecture-decisions.md, and component-audit-checklist-v2.md. Report any that are MISSING or INCORRECT. Do not add anything — just report what's there and what's not.

---

## CLAUDE.md — verify these rules exist

### Animation architecture
- [ ] NO separate `Component.animation.css` files — animation rules live in the base `Component.css`, gated by classes that only exist when JSON passes animation props
- [ ] No animation prop = no class in HTML = CSS rule never matches = zero animation
- [ ] Filtering happens at the JSON prop level, not the CSS loading level
- [ ] The only CSS files per component are: `Component.css` (all styles including animation) and `Component.responsive.css` (breakpoints)

### No hardcoded values rule
- [ ] Every colour, spacing, radius, shadow, font size, transition, and breakpoint must use a design token (`var(--token-name)`)
- [ ] If a token doesn't exist for the value needed, flag it — don't invent a magic number
- [ ] Exceptions: `0`, `none`, `100%`, `auto`, `1px` for borders, unitless values like `flex: 1`, and em-based relative values (e.g. `0.15em` for divider thickness)
- [ ] No `var(--token, fallback)` pattern — no fallbacks in component CSS. If a token doesn't exist, it should fail visibly.

### Pipeline routing
- [ ] A schema can declare props that the component itself never renders
- [ ] The render pipeline reads the mode and routes different props to different existing atoms
- [ ] Example: LottieIcon schema declares slug (→ LottieIcon atom), fallbackIcon (→ Icon atom), label (→ Text atom)
- [ ] LottieIcon.astro only receives slug, label, and visual/animation props — never sees fallbackIcon
- [ ] No separate template files per render mode (no LottieIcon.reduced.astro etc.)
- [ ] If a prop is absent, that mode renders nothing

### Schema structure
- [ ] `"category": "atom"` (not `"atoms/ui"` or `"atoms/icons"`)
- [ ] 4 render keys: full, reduced, assistive, textonly
- [ ] Three prop groups: content, visual, animation
- [ ] Animation props stripped in reduced/assistive/textonly renders

### Audit rules
- [ ] Never silently change or add to agreed rules — flag deviations explicitly
- [ ] Always be honest about whether a file was fully read or skimmed

---

## architecture-decisions.md — verify these decisions exist

### Existing decisions (should already be there from earlier sessions)
- [ ] 1. Ten atoms — everything resolves to these
- [ ] 2. Responsive CSS on containers only, never atoms (NOTE: atoms DO have responsive.css files — this decision may need clarifying)
- [ ] 3. Four render modes (full/reduced/assistive/textonly) — pipeline filters props
- [ ] 4. Animation: JSON prop → class → CSS
- [ ] 5-10. Alt text, AAC cards, semantic roles, FormField, GDPR, assistive tech
- [ ] 11. Two CSS files per component (base + responsive) — NOT three. No separate animation file.
- [ ] 12-18. Schema structure, print, audit workflow, brand system, compositions, content pipeline, "Your View" panel

### New decisions from today's session
- [ ] 19. Pipeline routing — schema declares props for other atoms, pipeline routes per mode (LottieIcon example with slug → LottieIcon, fallbackIcon → Icon, label → Text)
- [ ] No hardcoded values rule + no var(--token, fallback) pattern
- [ ] Animation file correction logged in decision log
- [ ] Hardcoded fallback correction logged in decision log

### Decisions from today that may NOT be captured yet
- [ ] Relative sizing for decorative elements — em for thickness/rhythm, percentage for widths, align-self: stretch for heights. Divider and underline on Heading are the reference implementation.
- [ ] Context overrides don't belong on atoms — consumers pass props via JSON. (.card .text, nav .text, .card .heading etc. are deferred for deletion)
- [ ] Atoms can compose other atoms — Heading imports Icon, LottieIcon, and Text. This is correct atom-to-atom composition.
- [ ] Subtitle pattern — when an atom has a text sub-element, render it through the Text atom, not as raw HTML.
- [ ] SectionTitle is deprecated — consumers migrate to Heading with decoration props.
- [ ] LottieIcon has two modes per instance based on JSON: decorative (no label, aria-hidden) or meaningful (has label, role="img" + aria-label). Same component, different JSON decides.
- [ ] Heading media slot priority: image → lottieIcon → icon. Pipeline strips lottieIcon in non-full renders, static icon auto-fallback.
- [ ] Token coverage grep — post-audit task. Every var(--token) in component CSS must resolve to a definition in src/styles/.
- [ ] Raw element migration — 32+ raw `<small>`, 4 raw `<blockquote>`, unknown number of raw `<h1>`-`<h6>`. Migrate to Text/Heading atoms during consumer audits, then delete duplicate global CSS rules.

---

## component-audit-checklist-v2.md — verify these are correct

### Render table
- [ ] CSS loaded column should NOT say "Component.animation.css only in full" — all CSS loads in all renders
- [ ] Should correctly reflect: base CSS always loads, animation is gated by JSON prop → class, not by file loading

### Token rules
- [ ] Checklist should include a check for hardcoded values in CSS
- [ ] Checklist should include a check for var(--token, fallback) pattern (banned)
- [ ] em-based relative values should be listed as acceptable exceptions

### Schema checks
- [ ] Should verify 4 render keys (full, reduced, assistive, textonly)
- [ ] Should verify `"category": "atom"`
- [ ] Should verify content/visual/animation prop groups

---

## Audit log — verify status of completed atoms

Check `src/components/atoms/Atom Audit Files/audit-log.md` and confirm:

- [ ] Image: PARTIAL — all fixes applied, deferred items listed
- [ ] Icon: PARTIAL — animation CSS merged into base, assistive render key added, deferred items listed  
- [ ] LottieIcon: PARTIAL — fallbackIcon/label optional props, pipeline routing, reduced.astro deleted, deferred items listed
- [ ] Text: PARTIAL — font fallbacks stripped, schema fixed, stale comment removed, deferred items listed
- [ ] Heading: PARTIAL — relative sizing, Text atom subtitle, LottieIcon support, opacity token, schema fixed, deferred items listed

### Cross-atom notes should include
- [ ] SectionTitle deprecated — migrate consumers to Heading
- [ ] Context overrides to be removed from Text.css and Heading.css during consumer audits
- [ ] Token coverage grep as post-audit task
- [ ] Raw element migration counts (32+ small, 4 blockquote)
- [ ] Missing font tokens (--font-body-alt, --font-handwriting) — status: FIXED or still missing?
- [ ] Textonly gap for LottieIcon consumers (GlassNav, ReaderNav, ShareSection) — visible text labels needed

---

## Instructions

1. Read each document in full
2. Check every item above
3. Report as a table: Item | Status (PRESENT / MISSING / INCORRECT) | Notes
4. Do NOT modify any files — report only
5. If a document doesn't exist at the expected path, report that

Expected file locations:
- CLAUDE.md: project root or `.claude/` directory
- architecture-decisions.md: check project root, docs folder, or outputs
- component-audit-checklist-v2.md: `src/components/atoms/Atom Audit Files/`
- audit-log.md: `src/components/atoms/Atom Audit Files/`
