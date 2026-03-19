# Render Mode × Visual Gate Matrix

How each render mode interacts with each visual gate.

**J** = JSON controls (different props loaded)
**C** = CSS gate (same HTML, different visual)
**N** = No effect / not applicable
**B** = Both (JSON strips some, CSS styles rest)

---

## Render Modes (vertical — WHAT loads)

| Code | Render | What it does |
|------|--------|-------------|
| FULL | Full Animation | All props, all effects, all animation |
| STATIC | Static Animation | Content + visual + colour, animation stripped |
| TXT-IMG | Text Only + Simple Images | Content + images, no effects/animation/colour tokens |
| TXT | Text Only - Content Only | Content only, no images, no decoration |
| STUDY | Study | Content + keyword highlights, definitions |
| WORK | Workbook | Content + structured boxes, writing lines |
| PRINT | Print / PDF | Content + print-safe layout, no animation/hover/scroll |
| MOB | Mobile | Content + visual + colour, animation stripped, small sizes |
| TAB | Tablet | Content + visual + colour, animation stripped, mid sizes |
| PC | PC / Desktop | Full (default) |
| XL-PROJ | XL Projector | Content + visual, large sizes, high contrast, no fine detail |

---

## Visual Gates (horizontal — HOW it looks)

### Hover Modes
| Code | Gate |
|------|------|
| H-FULL | Full interaction (all transitions + transforms) |
| H-INST | Instant (colour only, no transforms) |
| H-SOFT | Soft (slower transitions, reduced transforms) |
| H-NONE | None (zero visual feedback) |

### Themes / Zones
| Code | Gate |
|------|------|
| LIGHT | Light theme |
| DARK | Dark theme |
| HC | High Contrast |
| MONO | Monochrome |
| BRAND | Brand theme (per-tenant) |

### Accessibility
| Code | Gate |
|------|------|
| HL | Highlight Links |
| XL-TXT | XL Text size |
| FONT | Font Choice (dyslexia, serif, sans, handwriting) |
| CVD | Colour Vision (protan/tritan/mono) |
| SCROLL | Large Scrollbar |
| KBD | Keyboard navigation |
| SR | Screen reader |
| TOUCH | Assistive touch / switch input |
| AAC | AAC Cards (content symbols) |
| ALT | Alt text (image descriptions) |
| IMG-ENL | Image Enlarge (click to modal with alt text subtitle) |

### Navigation
| Code | Gate |
|------|------|
| NAV | Navigation behaviour |

### Responsivity
| Code | Gate |
|------|------|
| XS | XS screens (<480px) |
| SM | Small / Mobile (480-640px) |
| MD | Tablet (640-1024px) |
| LG | Full screen (1024-1440px) |
| XL | Large projectors (>1440px) |

---

## The Matrix

### Hover Modes

| Render ↓ \ Gate → | H-FULL | H-INST | H-SOFT | H-NONE |
|---|---|---|---|---|
| Full Animation | C | C | C | C |
| Static Animation | C | C | C | C |
| Text + Images | N | N | N | N |
| Text Content Only | N | N | N | N |
| Study | N | N | N | N |
| Workbook | N | N | N | N |
| Print / PDF | N | N | N | N |
| Mobile | C | C | C | C |
| Tablet | C | C | C | C |
| PC | C | C | C | C |
| XL Projector | C | C | C | C |

### Themes / Zones

| Render ↓ \ Gate → | LIGHT | DARK | HC | MONO | BRAND |
|---|---|---|---|---|---|
| Full Animation | C | C | C | C | C |
| Static Animation | C | C | C | C | C |
| Text + Images | C | C | C | C | C |
| Text Content Only | C | C | C | C | C |
| Study | C | C | C | C | C |
| Workbook | C | C | C | C | C |
| Print / PDF | C | C | C | N | C |
| Mobile | C | C | C | C | C |
| Tablet | C | C | C | C | C |
| PC | C | C | C | C | C |
| XL Projector | C | C | C | C | C |

### Accessibility

| Render ↓ \ Gate → | HL | XL-TXT | FONT | CVD | SCROLL | KBD | SR | TOUCH | AAC | ALT |
|---|---|---|---|---|---|---|---|---|---|---|
| Full Animation | C | C | C | C | C | C | C | C | J | J |
| Static Animation | C | C | C | C | C | C | C | C | J | J |
| Text + Images | N | C | C | C | C | C | C | N | J | J |
| Text Content Only | N | C | C | C | C | C | C | N | N | N |
| Study | N | C | C | C | C | C | C | N | N | N |
| Workbook | N | C | C | C | C | C | C | N | N | N |
| Print / PDF | N | N | C | N | N | N | N | N | B | B |
| Mobile | C | N | C | C | N | C | C | C | J | J |
| Tablet | C | C | C | C | C | C | C | C | J | J |
| PC | C | C | C | C | C | C | C | C | J | J |
| XL Projector | C | C | C | C | N | C | C | C | J | J |

### Navigation

| Render ↓ \ Gate → | NAV | XS | SM | MD | LG | XL |
|---|---|---|---|---|---|---|
| Full Animation | C | C | C | C | C | C |
| Static Animation | C | C | C | C | C | C |
| Text + Images | B | C | C | C | C | C |
| Text Content Only | B | C | C | C | C | C |
| Study | B | C | C | C | C | C |
| Workbook | B | C | C | C | C | C |
| Print / PDF | J | N | N | N | N | N |
| Mobile | C | C | C | N | N | N |
| Tablet | C | N | N | C | N | N |
| PC | C | N | N | N | C | N |
| XL Projector | C | N | N | N | N | C |

---

## What each render strips (JSON level)

| Render | content | visual | animation | colour | forceProps |
|---|---|---|---|---|---|
| Full Animation | ✓ | ✓ | ✓ | ✓ | — |
| Static Animation | ✓ | ✓ | ✗ | ✓ | — |
| Text + Images | ✓ | image only | ✗ | ✗ | — |
| Text Content Only | ✓ | ✗ | ✗ | ✗ | — |
| Study | ✓ | ✗ | ✗ | ✗ | study: true |
| Workbook | ✓ | ✗ | ✗ | ✗ | workbook: true |
| Print / PDF | ✓ | ✗ | ✗ | ✗ | print: true |
| Mobile | ✓ | ✓ | ✗ | ✓ | flush: true |
| Tablet | ✓ | ✓ | ✗ | ✓ | — |
| PC | ✓ | ✓ | ✓ | ✓ | — |
| XL Projector | ✓ | ✓ | ✗ | ✓ | size: "xl" |

---

## Questions to resolve

1. **Text + Images**: which image props kept? Just `image` src + `alt`, or also `mediaPosition`/`mediaSize`?
2. **Print / PDF**: does it get its own theme (high contrast B&W) or respect current theme?
3. **Workbook**: should it have interactive elements (checkboxes, text fields) in future?
4. **Study**: keyword highlighting — JSON marks keywords, CSS styles them? Or aacResolver-style build-time?
5. **XL Projector**: is this a render mode or just a CSS breakpoint? Does it need different JSON?
6. **Mobile vs XS**: are these the same render with different CSS, or different JSON loads?
7. **Navigation**: simplified in textonly renders? Burger only? Or full nav?
8. **Print + AAC**: include AAC cards in print? (B = both — JSON loads them, CSS decides layout)
9. **Font Choice**: just a CSS `font-family` swap, or does it affect JSON (e.g. spacing tokens)?
