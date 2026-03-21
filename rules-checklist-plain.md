# Rules Checklist — Plain Language

No code needed. Just check these.

---

## GLOBAL RULES — Apply to everything

### Colours
- [ ] Every colour comes from the theme. No colour is typed directly anywhere.
- [ ] Dark mode works by loading a different theme file, not by overriding individual components.
- [ ] The same position number (like 600) always means the right colour for the current theme.

### Hover
- [ ] Hover speed is controlled from one place — not per component.
- [ ] Setting hover to "none" makes everything instant across the whole site.
- [ ] Every hover effect also works with keyboard focus.

### Animation
- [ ] Setting motion to "none" stops ALL animation — CSS and JavaScript.
- [ ] Informational animations (breathing exercises, process diagrams) show a static image when off.
- [ ] Decorative animations (patterns, sparkles, glow) just disappear when off.

### Focus rings
- [ ] Every clickable thing gets a visible outline when tabbed to.
- [ ] The outline comes from one global rule, not per component.
- [ ] Assistive mode makes the outline thicker.

### Highlight links
- [ ] Turning on "highlight links" puts a visible border on EVERY clickable thing.
- [ ] This works even when hover is set to "none".
- [ ] Cards with links get highlighted too.

### Single column
- [ ] Mobile automatically goes single column.
- [ ] Text-only mode automatically goes single column.
- [ ] Users can choose single column from Your View at any screen size.

### Glass effects
- [ ] There's a way to swap all glass (transparent blur) to solid backgrounds.
- [ ] One toggle changes everything — no individual components need changing.

### Text scaling
- [ ] Making the browser smaller makes ALL text proportionally smaller.
- [ ] The Your View text size slider adjusts the root size — everything scales.
- [ ] Icons inside text scale with the text they're next to.

---

## COMPONENTS — Per-component checks

### For every component:
- [ ] No colours written directly in the CSS. All from tokens.
- [ ] No pixel sizes on text. All from typography tokens.
- [ ] No per-component transition rules. Transitions come from the global file.
- [ ] No per-component highlight-links rules. Highlighting comes from the global file.
- [ ] No per-component focus ring rules. Focus comes from the global file.
- [ ] No `[data-render="assistive"]` rules. Assistive is a preset, not a render mode.
- [ ] No fallback values on bridge tokens. If the value is missing, it should break visibly.

### Atoms specifically:
- [ ] Atoms never know what's around them. A Badge inside a Card doesn't change because it's in a Card.
- [ ] Atoms never import molecules. Only other atoms.
- [ ] Every atom has a schema that lists every prop it accepts.
- [ ] Schema defaults use token names ("primary-600") not CSS values ("#990099").

### Molecules specifically:
- [ ] Molecules compose atoms. They don't rebuild what atoms do.
- [ ] Molecule layout is their own CSS. The atoms inside handle their own rendering.
- [ ] If a molecule can't work in a render mode, the schema routes to a different component (FlipCard → CardReveal in text-only).

---

## RENDER MODES — Three, not four

### Full
- [ ] Everything loads. Animations run. Glass works. All visual props present.

### Reduced
- [ ] Same layout as full. No animation. No motion. Hover effects are colour-only (instant).
- [ ] Animation props are NOT in the JSON — so animation classes never appear.
- [ ] JavaScript animations check the gate and show static fallback.

### Text-only
- [ ] Content only. No images (unless informational). No visual variants.
- [ ] Single column. Tight padding. Thin borders for structure.
- [ ] Badges simplified. Cards become bordered boxes. Links still work.
- [ ] Accordion fallback for long pages so content isn't overwhelming.

### ~~Assistive~~ (NOT a render mode)
- [ ] "Easy Click" is a preset that turns on: hover=none, highlight links, solid glass, large targets, thick focus rings.
- [ ] User can toggle any setting back off individually.
- [ ] No separate CSS rules for assistive. Global token overrides handle it.

---

## JSON & PIPELINE — What goes in the data

### Content JSON:
- [ ] Only contains words, structure, and purpose flags.
- [ ] No colour values. No shadow values. No radius values. No pixel values.
- [ ] Every image declares purpose: "informational" or "decorative".
- [ ] Every animation declares purpose: "informational" or "decorative".

### Schemas:
- [ ] Every prop belongs to one of four groups: content, visual, animation, colour.
- [ ] Content survives all modes. Visual stripped in text-only. Animation stripped in reduced. Colour stripped in text-only.
- [ ] Defaults are token names, not CSS values.
- [ ] Enums list every valid option. Nothing else is accepted.

### Brand config:
- [ ] Tiny. Only lists overrides where the brand differs from schema defaults.
- [ ] Typically 3-5 component overrides. Everything else uses schema defaults.
- [ ] Theme handles colours. Brand config handles shapes and variants.

### Worker/script:
- [ ] Reads content + brand config + schemas.
- [ ] Fills missing props from brand config, then schema defaults.
- [ ] Validates every value against schema enums.
- [ ] Validates every token against the theme token set.
- [ ] Rejects anything invalid. AI tries again.
- [ ] Never makes design decisions. Just assembly and validation.

---

## THEMES — What changes per theme

- [ ] Two hex codes in → complete theme out.
- [ ] Scale positions (100-950) are contextually correct in every theme (dark mode flips).
- [ ] Component CSS never changes per theme. Same CSS, different token values.
- [ ] Dark mode kills shadows, enables glow. No per-component dark rules needed.
- [ ] High contrast uses maximum contrast values. One zone file handles everything.
- [ ] CVD safety is in the theme picker ("No Reds" / "No Blues"), not in CSS logic.

---

## ACCESSIBILITY — What to verify

### Keyboard
- [ ] Tab reaches every interactive element.
- [ ] Enter/Space activates everything.
- [ ] Tab order matches visual order.
- [ ] Nothing traps the keyboard.

### Screen reader
- [ ] Run axe DevTools scan. Zero critical/serious issues.
- [ ] Headings have correct levels (no skipping h2 → h4).
- [ ] Decorative elements have aria-hidden="true".
- [ ] Form inputs have labels.
- [ ] Buttons have names.

### Contrast
- [ ] Text passes AA (4.5:1 for normal, 3:1 for large).
- [ ] Borders/outlines pass 3:1 against adjacent colours.
- [ ] Glass text has a contrast floor (opacity + blur).
- [ ] Button hover states maintain contrast.

### Touch targets
- [ ] Default: 44×44px minimum.
- [ ] Assistive preset: 64×64px minimum.
- [ ] Mobile: coarse pointer gets slightly larger targets.

---

## QUICK VISUAL CHECKS

Open a test page, use Your View panel:

| Toggle | What should happen |
|---|---|
| Switch to dark | Everything adapts. No broken colours. Text readable. |
| Switch to text-only | Just text and borders. No images. Single column. Everything readable. |
| Switch to reduced | Same layout, zero motion. Hover changes are instant. |
| Turn on highlight links | Every clickable element gets a visible border. |
| Set hover to none | No hover effects anywhere. Tooltips show as bottom bar. |
| Turn on high contrast | Maximum contrast. Thick borders. No glow or glass. |
| Increase text size | Everything scales proportionally. Nothing overflows. |
| Easy Click preset | Large targets, thick focus rings, solid backgrounds, no hover. |

If any of these break a component, that component needs fixing.

---

## RED FLAGS — Stop immediately if you see:

- A hardcoded hex colour in any CSS or JSON file
- A `var(--token, #fallback)` with a hex fallback
- An `!important` declaration
- A `@media (prefers-reduced-motion)` in component CSS
- A per-component `[data-render="assistive"]` rule
- A per-component transition declaration (should be global)
- A per-component focus/highlight rule (should be global)
- An animation script importing gsap directly (should use gate)
- An AI writing inline style values in JSON
- A component checking data-render directly in JS
