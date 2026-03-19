# Atom Visual Test Matrix

Test every atom against this matrix. Each cell = visual check (pass/fail/NA).

---

## Axis 1: Themes

| Code | Theme |
|------|-------|
| L | Light (default) |
| D | Dark |
| HC-L | High Contrast Light |
| HC-D | High Contrast Dark |
| Candy | Fun theme (pastel) |
| Candy-D | Fun theme dark |
| Mono-L | Monochrome Light |
| Mono-D | Monochrome Dark |
| Neon | High Viz / Neon |

## Axis 2: Render Modes

| Code | Mode | What it does |
|------|------|-------------|
| FULL | Full | All CSS, animations, hover effects |
| RED | Reduced | Animation props stripped — no animation classes |
| TXT | Text Only | Minimal CSS, content only |

## Axis 3: Hover Gates

| Code | Mode | What it does |
|------|------|-------------|
| H-FULL | Full hover | All transitions + transforms |
| H-INST | Instant | Colour only, no transforms |
| H-NONE | None | Zero visual change on hover |

## Axis 4: Toggles

| Code | Toggle | What it does |
|------|--------|-------------|
| HL | Highlight Links | Outline ring on interactive elements, effects stripped |
| XL | Text XL | Root font-size scaled up |
| LS | Large Scrollbar | Wider scrollbar track |

## Axis 5: AAC / Alt Text (where applicable)

| Code | Setting |
|------|---------|
| AAC-OFF | Content AAC off |
| AAC-ON | Content AAC on |
| ALT-W | Alt text: word |
| ALT-D | Alt text: descriptive |
| ALT-AAC | Alt text: AAC cards |
| DISP-CAP | Display: caption |
| DISP-OVR | Display: overlay |
| DISP-TIP | Display: tooltip |

---

## Per-Atom Test Sheet

Copy this table for each atom. Mark: P (pass), F (fail + note), NA (not applicable).

### [ATOM NAME]

#### Core Visual (test in each theme)

| Check | L | D | HC-L | HC-D | Candy | Candy-D | Mono-L | Mono-D | Neon |
|-------|---|---|------|------|-------|---------|--------|--------|------|
| Renders correctly | | | | | | | | | |
| Text readable | | | | | | | | | |
| Colours use tokens (no hardcoded) | | | | | | | | | |
| Borders visible | | | | | | | | | |
| Background distinct from page | | | | | | | | | |
| Shadows appropriate (inner glow dark) | | | | | | | | | |
| Icons visible + correct colour | | | | | | | | | |

#### Variants (test in L + D + HC-D minimum)

| Variant | L | D | HC-D | Notes |
|---------|---|---|------|-------|
| (list per atom) | | | | |

#### Render Modes

| Check | FULL | RED | TXT |
|-------|------|-----|-----|
| Renders correctly | | | |
| Animation stripped (RED) | | | |
| Content only, no decoration (TXT) | | | |
| Layout intact | | | |

#### Hover Gates

| Check | H-FULL | H-INST | H-NONE |
|-------|--------|--------|--------|
| Hover feedback correct | | | |
| No transitions (H-NONE) | | | |
| Colour only (H-INST) | | | |
| Disabled: no hover in any mode | | | |

#### Toggles

| Check | HL on | HL off | XL on | XL off |
|-------|-------|--------|-------|--------|
| Highlight ring visible | | | | |
| Effects stripped (HL) | | | | |
| Text scales correctly (XL) | | | | |
| Layout doesn't break (XL) | | | | |

#### AAC (if atom has text content)

| Check | AAC-OFF | AAC-ON |
|-------|---------|--------|
| Normal text visible | | |
| AAC cards render | | |
| Cards readable in D/HC | | |
| Bliss symbol swap | | |
| Text fallback cards | | |

#### Keyboard Navigation

| Check | Result | Notes |
|-------|--------|-------|
| Tab reaches element | | |
| Tab order logical | | |
| Focus indicator visible (min 3px) | | |
| Focus indicator visible in D/HC | | |
| Enter/Space activates (if interactive) | | |
| Escape closes (if modal/dropdown/tooltip) | | |
| Arrow keys navigate (if group/menu) | | |
| No keyboard trap | | |
| Skip link works (if landmark) | | |

#### Screen Reader

| Check | NVDA | VoiceOver | Notes |
|-------|------|-----------|-------|
| Role announced correctly | | | |
| Label/name read | | | |
| State announced (disabled/expanded/selected) | | | |
| Live region updates (if dynamic) | | | |
| Decorative elements hidden (aria-hidden) | | | |
| Alt text read for images | | | |
| AAC cards hidden from SR (aria-hidden) | | | |
| Heading level correct (if heading) | | | |
| Link destination clear | | | |

#### Assistive Input (Easy Click render)

| Check | Result | Notes |
|-------|--------|-------|
| Touch target >= 44px (default) | | |
| Touch target >= 64px (assistive render) | | |
| No hover-only content | | |
| :focus-within on all hover interactions | | |
| Single column layout | | |
| Focus indicators enlarged (min 3px HC) | | |

#### Responsive

| Check | Mobile (<640) | Tablet (640-1024) | Desktop (>1024) |
|-------|---------------|-------------------|-----------------|
| Layout intact | | | |
| Touch targets >=44px | | | |
| Text readable | | | |
| No overflow/clip | | | |

#### Responsive + XL Text

| Check | Mobile + XL | Tablet + XL | Desktop + XL |
|-------|-------------|-------------|--------------|
| Text doesn't overflow container | | | |
| Buttons/badges don't clip | | | |
| Nav stays fixed (not scaled) | | | |
| Spacing proportional | | | |
| No horizontal scroll | | | |

---

## Quick Smoke Test (minimum per atom)

If short on time, test these 6 combos minimum:

1. **L + FULL + H-FULL** — default everything
2. **D + FULL + H-FULL** — dark mode basics
3. **HC-D + FULL + H-FULL** — high contrast dark
4. **L + TXT** — text only render
5. **L + HL** — highlight links
6. **D + H-NONE** — dark + no hover
7. **Keyboard** — tab to element, focus visible, enter/space activates
8. **Screen reader** — role + label announced, decorative hidden
9. **Easy Click** — touch targets enlarged, no hover-only content

---

## Completed Atoms

| Atom | Date | Tester | Quick Smoke | Full Matrix | Notes |
|------|------|--------|-------------|-------------|-------|
| Heading | 2026-03-19 | NC | P | P | All variants, dark/HC, AAC tested |
| Badge | 2026-03-19 | NC | P | P | Fill/outline/glass, dark 300/700/900 |
| Button | 2026-03-19 | NC | P | Partial | 13 variants + 10 effects, dark/HC/HL done, responsive pending |
