Found 56 component directories
# Component Architecture Audit Report

Generated: 2026-02-26T13:43:51.813Z
Components scanned: 56

## Summary

| Metric | Count |
|---|---|
| Total components | 56 |
| Have a11y.css file | 37 |
| Have scoped styles in .astro | 16 |
| Have #a11y-content-wrapper refs | 25 |
| Have !important declarations | 18 |
| Have ambient transitions in base CSS | 23 |
| Have schema.json | 22 |
| Schema has flat props (needs splitting) | 22 |
| Schema has content/visual/animation split | 0 |
| Have JS animation (script tags) | 30 |
| Use raw HTML instead of atoms | 36 |
| Missing index.ts | 34 |
| Missing schema.json | 34 |
| Missing separated CSS | 16 |
| Missing responsive CSS | 24 |

## @layer Usage Across All Files

| Layer | Files |
|---|---|
| `@layer a11y.reduce-motion` | 43: PresetButton/PresetButton.a11y.css, PresetButton/PresetButton.a11y.recovery.css, Stepper/Stepper.a11y.css, Stepper/Stepper.a11y.recovery.css, DrawIcon/DrawSVGIcon.a11y.css, DrawIcon/ScrollDrawIcon.a11y.css, DrawIcon/ScrollDrawIcon.a11y.recovery.css, ParallaxDecor/ParallaxDecor.a11y.css, ParallaxDecor/ParallaxDecor.a11y.recovery.css, PatternOverlay/PatternOverlay.a11y.css, PatternOverlay/PatternOverlay.a11y.recovery.css, ScrollColorBackground/ScrollColorBackground.a11y.css, form/FormField.a11y.css, form/FormField.a11y.recovery.css, grid/Grid.a11y.css, grid/Grid.a11y.recovery.css, Image/Image.a11y.css, Image/Image.a11y.recovery.css, Button/Button.a11y.css, Button/Button.a11y.recovery.css, Card/Card.a11y.css, Card/Card.a11y.recovery.css, Heading/Heading.a11y.css, Heading/Heading.a11y.recovery.css, Link/Link.a11y.css, Link/Link.a11y.recovery.css, DPadMenu/DPadMenu.a11y.css, DPadMenu/DPadMenu.a11y.recovery.css, RadialMenu/RadialMenu.a11y.css, RadialMenu/RadialMenu.a11y.recovery.css, Text/Text.a11y.css, Text/Text.a11y.recovery.css, Toast/Toast.a11y.css, ConnectorTimeline/ConnectorTimeline.a11y.css, LiquidReveal/LiquidRevealZone.a11y.css, ImageOverlay/ImageOverlay.a11y.css, ImageOverlay/ImageOverlay.a11y.recovery.css, Footer/Footer.a11y.css, IconScrollStage/IconScrollStage.a11y.css, ScrollMorph/ScrollMorphZone.a11y.css, contact/ContactForm.a11y.css, sections/HeroSection.a11y.css, HeroSection/HeroSection.a11y.css |
| `@layer a11y.focus` | 4: PresetButton/PresetButton.a11y.css, PresetButton/PresetButton.a11y.recovery.css, Stepper/Stepper.a11y.css, Stepper/Stepper.a11y.recovery.css |
| `@layer a11y` | 49: PresetButton/PresetButton.a11y.css, PresetButton/PresetButton.a11y.recovery.css, Stepper/Stepper.a11y.css, Stepper/Stepper.a11y.recovery.css, DrawIcon/DrawSVGIcon.a11y.css, DrawIcon/ScrollDrawIcon.a11y.css, DrawIcon/ScrollDrawIcon.a11y.recovery.css, PagePatternLayer/PagePatternLayer.a11y.css, PagePatternLayer/PagePatternLayer.a11y.recovery.css, ParallaxDecor/ParallaxDecor.a11y.css, ParallaxDecor/ParallaxDecor.a11y.recovery.css, PatternOverlay/PatternOverlay.a11y.css, PatternOverlay/PatternOverlay.a11y.recovery.css, ScrollColorBackground/ScrollColorBackground.a11y.css, form/FormField.a11y.css, form/FormField.a11y.recovery.css, grid/Grid.a11y.css, grid/Grid.a11y.recovery.css, Image/Image.a11y.css, Image/Image.a11y.recovery.css, Button/Button.a11y.css, Button/Button.a11y.recovery.css, Card/Card.a11y.css, Card/Card.a11y.recovery.css, Heading/Heading.a11y.css, Heading/Heading.a11y.recovery.css, Link/Link.a11y.css, Link/Link.a11y.recovery.css, List/List.a11y.css, List/List.a11y.recovery.css, DPadMenu/DPadMenu.a11y.css, DPadMenu/DPadMenu.a11y.recovery.css, RadialMenu/RadialMenu.a11y.css, RadialMenu/RadialMenu.a11y.recovery.css, Text/Text.a11y.css, Text/Text.a11y.recovery.css, Toast/Toast.a11y.css, Toast/Toast.a11y.recovery.css, contact/ContactInfo.a11y.css, ConnectorTimeline/ConnectorTimeline.a11y.css, LiquidReveal/LiquidRevealZone.a11y.css, ImageOverlay/ImageOverlay.a11y.css, ImageOverlay/ImageOverlay.a11y.recovery.css, Footer/Footer.a11y.css, IconScrollStage/IconScrollStage.a11y.css, ScrollMorph/ScrollMorphZone.a11y.css, contact/ContactForm.a11y.css, sections/HeroSection.a11y.css, HeroSection/HeroSection.a11y.css |
| `@layer components` | 63: RevealCanvas/RevealCanvas.css, DrawIcon/DrawSVGIcon.css, DrawIcon/ScrollDrawIcon.css, DrawIcon/ScrollDrawIcon.responsive.css, PagePatternLayer/PagePatternLayer.css, ParallaxDecor/ParallaxDecor.css, ParallaxDecor/ParallaxDecor.responsive.css, PatternOverlay/pattern-motion.css, PatternOverlay/PatternOverlay.css, PatternOverlay/PatternOverlay.responsive.css, PhysicsOverlay/PhysicsOverlay.a11y.recovery.css, PhysicsOverlay/PhysicsOverlay.css, PhysicsOverlay/PhysicsOverlay.responsive.css, ScrollColorBackground/ScrollColorBackground.a11y.recovery.css, ScrollColorBackground/ScrollColorBackground.css, form/FormField.css, form/FormField.responsive.css, grid/Grid.css, grid/Grid.responsive.css, Image/Image.css, Image/Image.responsive.css, Badge/Badge.css, Badge/Badge.responsive.css, Button/Button.css, Button/Button.responsive.css, Card/Card.css, Card/Card.responsive.css, Heading/Heading.css, Heading/Heading.responsive.css, Link/Link.css, Link/Link.responsive.css, List/List.css, List/List.responsive.css, DPadMenu/DPadMenu.responsive.css, DPadMenu/DPadMenu.style.css, RadialMenu/RadialMenu.responsive.css, RadialMenu/RadialMenu.style.css, Text/Text.css, Text/Text.responsive.css, Toast/Toast.css, Toast/Toast.responsive.css, contact/ContactInfo.responsive.css, contact/ContactInfo.style.css, ConnectorTimeline/ConnectorTimeline.responsive.css, ConnectorTimeline/ConnectorTimeline.style.css, LiquidReveal/LiquidRevealZone.responsive.css, LiquidReveal/LiquidRevealZone.style.css, ImageOverlay/ImageOverlay.css, ImageOverlay/ImageOverlay.responsive.css, Footer/Footer.responsive.css, Footer/Footer.style.css, IconScrollStage/IconScrollStage.responsive.css, IconScrollStage/IconScrollStage.style.css, ScrollMorph/ScrollMorphZone.responsive.css, ScrollMorph/ScrollMorphZone.style.css, a11y/a11y-panel.css, contact/ContactForm.responsive.css, contact/ContactForm.style.css, sections/HeroSection.responsive.css, sections/HeroSection.style.css, sections/who-slider.css, HeroSection/HeroSection.responsive.css, HeroSection/HeroSection.style.css |
| `@layer a11y.high-contrast` | 11: DrawIcon/ScrollDrawIcon.a11y.css, DrawIcon/ScrollDrawIcon.a11y.recovery.css, PagePatternLayer/PagePatternLayer.a11y.css, PagePatternLayer/PagePatternLayer.a11y.recovery.css, form/FormField.a11y.css, form/FormField.a11y.recovery.css, Button/Button.a11y.css, Button/Button.a11y.recovery.css, ConnectorTimeline/ConnectorTimeline.a11y.css, LiquidReveal/LiquidRevealZone.a11y.css, ScrollMorph/ScrollMorphZone.a11y.css |
| `@layer a11y.text-only` | 35: DrawIcon/ScrollDrawIcon.a11y.recovery.css, form/FormField.a11y.css, form/FormField.a11y.recovery.css, grid/Grid.a11y.css, grid/Grid.a11y.recovery.css, Image/Image.a11y.css, Image/Image.a11y.recovery.css, Button/Button.a11y.css, Button/Button.a11y.recovery.css, Card/Card.a11y.css, Card/Card.a11y.recovery.css, Heading/Heading.a11y.css, Heading/Heading.a11y.recovery.css, Link/Link.a11y.css, Link/Link.a11y.recovery.css, List/List.a11y.css, List/List.a11y.recovery.css, DPadMenu/DPadMenu.a11y.css, DPadMenu/DPadMenu.a11y.recovery.css, RadialMenu/RadialMenu.a11y.css, RadialMenu/RadialMenu.a11y.recovery.css, Text/Text.a11y.css, Text/Text.a11y.recovery.css, Toast/Toast.a11y.css, contact/ContactInfo.a11y.css, ConnectorTimeline/ConnectorTimeline.a11y.css, LiquidReveal/LiquidRevealZone.a11y.css, ImageOverlay/ImageOverlay.a11y.css, ImageOverlay/ImageOverlay.a11y.recovery.css, Footer/Footer.a11y.css, IconScrollStage/IconScrollStage.a11y.css, ScrollMorph/ScrollMorphZone.a11y.css, contact/ContactForm.a11y.css, sections/HeroSection.a11y.css, HeroSection/HeroSection.a11y.css |
| `@layer a11y.highlight-links` | 11: form/FormField.a11y.css, form/FormField.a11y.recovery.css, Button/Button.a11y.css, Button/Button.a11y.recovery.css, Heading/Heading.a11y.css, Heading/Heading.a11y.recovery.css, Link/Link.a11y.css, Link/Link.a11y.recovery.css, contact/ContactInfo.a11y.css, Footer/Footer.a11y.css, contact/ContactForm.a11y.css |
| `@layer a11y.themes` | 2: Card/Card.a11y.css, Card/Card.a11y.recovery.css |

## Dead Code Hotspots

| Component | Wrapper Refs | !important | Dead Layers |
|---|---|---|---|
| PhysicsOverlay | 7 | 0 | components |
| ScrollColorBackground | 9 | 6 | a11y.reduce-motion, a11y, components |
| Badge | 2 | 0 | components |
| Button | 3 | 0 | a11y.reduce-motion, a11y.text-only, a11y.high-contrast, a11y.highlight-links, a11y, components |
| Card | 341 | 696 | a11y.reduce-motion, a11y.text-only, a11y.themes, a11y, components |
| Heading | 1 | 0 | a11y.reduce-motion, a11y.text-only, a11y.highlight-links, a11y, components |
| DPadMenu | 22 | 0 | a11y.reduce-motion, a11y.text-only, a11y, components |
| RadialMenu | 30 | 0 | a11y.reduce-motion, a11y.text-only, a11y, components |
| Text | 1 | 0 | a11y.reduce-motion, a11y.text-only, a11y, components |
| a11y | 4 | 0 |  |
| cards | 231 | 120 |  |
| contact | 7 | 0 | a11y.text-only, a11y.highlight-links, a11y, components |
| ConnectorTimeline | 7 | 0 | a11y.reduce-motion, a11y.text-only, a11y.high-contrast, a11y, components |
| global | 9 | 0 |  |
| CustomScrollbar | 9 | 0 |  |
| nav | 42 | 27 |  |
| shop | 30 | 15 |  |
| switcher | 63 | 52 |  |
| Footer | 2 | 0 | a11y.reduce-motion, a11y.text-only, a11y.highlight-links, a11y, components |
| IconScrollStage | 5 | 0 | a11y.reduce-motion, a11y.text-only, a11y, components |
| ScrollMorph | 1 | 0 | a11y.reduce-motion, a11y.text-only, a11y.high-contrast, a11y, components |
| a11y | 3 | 131 | components |
| grids | 283 | 103 |  |
| nav | 16 | 42 |  |
| sections | 37 | 25 | a11y.reduce-motion, a11y.text-only, a11y, components |
| PresetButton | 0 | 8 | a11y.reduce-motion, a11y.focus, a11y |
| DrawIcon | 0 | 2 | a11y.reduce-motion, a11y, components, a11y.high-contrast, a11y.text-only |
| ParallaxDecor | 0 | 3 | a11y.reduce-motion, a11y, components |
| PatternOverlay | 0 | 2 | components, a11y.reduce-motion, a11y |
| grid | 0 | 17 | a11y.reduce-motion, a11y.text-only, a11y, components |
| Toast | 0 | 8 | a11y.reduce-motion, a11y.text-only, a11y, components |
| ImageOverlay | 0 | 42 | a11y.reduce-motion, a11y.text-only, a11y, components |
| contact | 0 | 5 | a11y.reduce-motion, a11y.text-only, a11y.highlight-links, a11y, components |

## Ambient Motion in Base CSS (Phase 6 Targets)

### PresetButton/PresetButton.a11y.css

- Line 22: `.a11y-reduce-motion` → `transition: none;`

### PresetButton/PresetButton.a11y.recovery.css

- Line 22: `.a11y-reduce-motion` → `transition: none;`

### Stepper/Stepper.a11y.css

- Line 21: `.a11y-reduce-motion` → `transition: none;`

### Stepper/Stepper.a11y.recovery.css

- Line 21: `.a11y-reduce-motion` → `transition: none;`

### DrawIcon/DrawSVGIcon.a11y.css

- Line 16: `.a11y-reduce-motion` → `transition: none;`

### PatternOverlay/pattern-motion.css

- Line 33: `[data-motion="twinkle"]` → `animation: pm-twinkle var(--pm-drift-speed, 3s) ease-in-out infinite;`
- Line 38: `[data-motion="breathe"]` → `animation: pm-breathe var(--pm-drift-speed, 5s) ease-in-out infinite;`
- Line 43: `[data-motion="float"]` → `animation: pm-float var(--pm-drift-speed, 6s) ease-in-out infinite;`
- Line 48: `[data-motion="drift"]` → `animation: pm-drift var(--pm-drift-speed, 20s) linear infinite;`
- Line 53: `[data-motion="pulse"]` → `animation: pm-pulse var(--pm-drift-speed, 4s) ease-in-out infinite;`
- Line 58: `[data-motion="orbit"]` → `animation: pm-orbit var(--pm-drift-speed, 40s) linear infinite;`
- Line 63: `[data-motion="sway"]` → `animation: pm-sway var(--pm-drift-speed, 8s) ease-in-out infinite;`
- Line 69: `[data-motion="none"]` → `animation: none;`
- Line 131: `.a11y-reduce-motion [data-motion]` → `animation: none !important;`

### PatternOverlay/PatternOverlay.a11y.css

- Line 31: `.a11y-reduce-motion` → `transition: none;`

### PatternOverlay/PatternOverlay.a11y.recovery.css

- Line 31: `.a11y-reduce-motion` → `transition: none;`

### ScrollColorBackground/ScrollColorBackground.a11y.css

- Line 16: `.a11y-reduce-motion` → `transition: none;`

### ScrollColorBackground/ScrollColorBackground.a11y.recovery.css

- Line 31: `:global(#a11y-content-wrapper.a11y-reduce-motion) .scroll-bg-layer` → `transition: none !important;`
- Line 38: `@media (prefers-reduced-motion: reduce)` → `transition: none !important;`

### form/FormField.a11y.css

- Line 26: `.a11y-reduce-motion` → `transition: none;`
- Line 30: `.a11y-reduce-motion` → `transition: none;`
- Line 34: `.a11y-reduce-motion` → `transition: none;`
- Line 38: `.a11y-reduce-motion` → `transition: none;`
- Line 42: `.a11y-reduce-motion` → `transition: none;`

### form/FormField.a11y.recovery.css

- Line 26: `.a11y-reduce-motion` → `transition: none;`
- Line 30: `.a11y-reduce-motion` → `transition: none;`
- Line 34: `.a11y-reduce-motion` → `transition: none;`
- Line 38: `.a11y-reduce-motion` → `transition: none;`
- Line 42: `.a11y-reduce-motion` → `transition: none;`

### form/FormField.css

- Line 148: `.form-field__input` → `transition: border-color 0.2s ease, box-shadow 0.2s ease;`
- Line 289: `.form-field__checkmark` → `transition: background-color 0.2s ease, border-color 0.2s ease;`
- Line 359: `.form-field__radio-indicator` → `transition: background-color 0.2s ease, border-color 0.2s ease;`
- Line 424: `.form-field__toggle-track` → `transition: background-color 0.2s ease;`
- Line 437: `.form-field__toggle-thumb` → `transition: transform 0.2s ease;`
- Line 517: `.form-select` → `transition: border-color var(--transition-fast), box-shadow var(--transition-fast);`

### grid/Grid.a11y.css

- Line 22: `.a11y-reduce-motion` → `transition: none;`
- Line 27: `.a11y-reduce-motion` → `transition: none;`
- Line 40: `.a11y-reduce-motion` → `transition: none;`

### grid/Grid.a11y.recovery.css

- Line 24: `.a11y-reduce-motion` → `transition: none;`
- Line 29: `.a11y-reduce-motion` → `transition: none !important;`
- Line 42: `.a11y-reduce-motion` → `transition: none !important;`
- Line 54: `@media (prefers-reduced-motion: reduce)` → `transition: none;`
- Line 58: `@media (prefers-reduced-motion: reduce)` → `transition: none;`

### Image/Image.a11y.css

- Line 18: `.a11y-reduce-motion` → `transition: none;`

### Image/Image.a11y.recovery.css

- Line 15: `.a11y-reduce-motion` → `transition: none;`

### Image/Image.css

- Line 30: `.image` → `transition: var(--img-transition);`

### Button/Button.a11y.css

- Line 28: `.a11y-reduce-motion` → `transition: none;`
- Line 96: `.a11y-reduce-motion` → `transition: none;`
- Line 100: `.a11y-reduce-motion` → `transition: none;`
- Line 122: `.a11y-text-only` → `transition: none;`
- Line 29: `.a11y-reduce-motion` → `animation: none;`
- Line 123: `.a11y-text-only` → `animation: none;`

### Button/Button.a11y.recovery.css

- Line 28: `.a11y-reduce-motion` → `transition: none;`
- Line 96: `.a11y-reduce-motion` → `transition: none;`
- Line 100: `.a11y-reduce-motion` → `transition: none;`
- Line 122: `.a11y-text-only` → `transition: none;`
- Line 29: `.a11y-reduce-motion` → `animation: none;`
- Line 123: `.a11y-text-only` → `animation: none;`

### Button/Button.css

- Line 48: `.btn` → `transition: all var(--transition-fast);`
- Line 123: `.btn__chevron` → `transition: transform var(--transition-base);`
- Line 747: `.dropdown-menu` → `transition: max-height 0.35s ease, opacity 0.25s ease, visibility 0s 0.35s;`
- Line 755: `.dropdown-menu.show` → `transition: max-height 0.35s ease, opacity 0.25s ease, visibility 0s;`
- Line 770: `.dropdown-item` → `transition: background 0.2s ease;`
- Line 53: `.btn:hover` → `transform: translateY(-1px);`
- Line 64: `.btn:active` → `transform: translateY(0);`
- Line 77: `.btn[aria-disabled="true"]:hover` → `transform: none;`
- Line 128: `.dropdown-wrapper:hover .btn__chevron` → `transform: rotate(-90deg);`

### Card/Card.a11y.css

- Line 23: `.a11y-reduce-motion` → `transition: none;`
- Line 37: `.a11y-reduce-motion` → `transition: none;`
- Line 42: `.a11y-reduce-motion` → `transition: none;`
- Line 51: `.a11y-reduce-motion` → `transition: none;`
- Line 59: `.a11y-reduce-motion` → `transition: none;`
- Line 67: `.a11y-reduce-motion` → `transition: none;`
- Line 72: `.a11y-reduce-motion` → `transition: none;`
- Line 77: `.a11y-reduce-motion` → `transition: none;`
- Line 87: `.a11y-reduce-motion` → `transition: none;`
- Line 93: `.a11y-reduce-motion` → `transition: none;`
- Line 107: `.a11y-reduce-motion` → `transition: none;`
- Line 112: `.a11y-reduce-motion` → `transition: none;`
- Line 118: `.a11y-reduce-motion` → `transition: none;`
- Line 131: `.a11y-reduce-motion` → `transition: none;`
- Line 136: `.a11y-reduce-motion` → `transition: none;`
- Line 154: `.a11y-reduce-motion` → `transition: none;`
- Line 158: `.a11y-reduce-motion` → `transition: none;`
- Line 163: `.a11y-reduce-motion` → `transition: none;`
- Line 167: `.a11y-reduce-motion` → `transition: none;`
- Line 325: `.a11y-text-only` → `transition: none !important;`
- Line 367: `.a11y-text-only` → `transition: none !important;`
- Line 382: `.a11y-text-only` → `transition: none !important;`
- Line 483: `.a11y-text-only` → `transition: none !important;`
- Line 495: `.a11y-text-only` → `transition: none !important;`
- Line 685: `.a11y-text-only` → `transition: none !important;`

### Card/Card.a11y.recovery.css

- Line 30: `.a11y-reduce-motion` → `transition: none !important;`
- Line 44: `.a11y-reduce-motion` → `transition: none !important;`
- Line 49: `.a11y-reduce-motion` → `transition: none !important;`
- Line 58: `.a11y-reduce-motion` → `transition: none !important;`
- Line 66: `.a11y-reduce-motion` → `transition: none !important;`
- Line 74: `.a11y-reduce-motion` → `transition: none !important;`
- Line 79: `.a11y-reduce-motion` → `transition: none !important;`
- Line 84: `.a11y-reduce-motion` → `transition: none !important;`
- Line 94: `.a11y-reduce-motion` → `transition: none !important;`
- Line 100: `.a11y-reduce-motion` → `transition: none !important;`
- Line 114: `.a11y-reduce-motion` → `transition: none !important;`
- Line 119: `.a11y-reduce-motion` → `transition: none !important;`
- Line 125: `.a11y-reduce-motion` → `transition: none !important;`
- Line 138: `.a11y-reduce-motion` → `transition: none !important;`
- Line 143: `.a11y-reduce-motion` → `transition: none !important;`
- Line 161: `.a11y-reduce-motion` → `transition: none !important;`
- Line 165: `.a11y-reduce-motion` → `transition: none !important;`
- Line 170: `.a11y-reduce-motion` → `transition: none !important;`
- Line 174: `.a11y-reduce-motion` → `transition: none !important;`
- Line 189: `@media (prefers-reduced-motion: reduce)` → `transition: none;`
- Line 346: `.a11y-text-only` → `transition: none !important;`
- Line 388: `.a11y-text-only` → `transition: none !important;`
- Line 403: `.a11y-text-only` → `transition: none !important;`
- Line 504: `.a11y-text-only` → `transition: none !important;`
- Line 516: `.a11y-text-only` → `transition: none !important;`
- Line 706: `.a11y-text-only` → `transition: none !important;`

### Card/Card.css

- Line 34: `.card` → `transition: transform var(--transition-base),`

### Heading/Heading.a11y.css

- Line 114: `.a11y-reduce-motion` → `transition: none;`
- Line 115: `.a11y-reduce-motion` → `animation: none;`

### Heading/Heading.a11y.recovery.css

- Line 113: `.a11y-reduce-motion` → `transition: none;`
- Line 114: `.a11y-reduce-motion` → `animation: none;`

### Link/Link.a11y.css

- Line 65: `.a11y-reduce-motion` → `transition: none;`
- Line 70: `.a11y-reduce-motion` → `transition: none;`
- Line 75: `.a11y-reduce-motion` → `transition: none;`

### Link/Link.a11y.recovery.css

- Line 61: `.a11y-reduce-motion` → `transition: none;`
- Line 66: `.a11y-reduce-motion` → `transition: none;`
- Line 71: `.a11y-reduce-motion` → `transition: none;`

### Link/Link.css

- Line 23: `.link` → `transition: color 0.35s ease;`

### DPadMenu/DPadMenu.a11y.css

- Line 10: `#a11y-content-wrapper.a11y-reduce-motion .dpad-menu` → `transition: none;`
- Line 14: `#a11y-content-wrapper.a11y-reduce-motion .dpad-menu__btn` → `transition: none;`
- Line 18: `#a11y-content-wrapper.a11y-reduce-motion .dpad-menu:has(.dpad-menu__btn:active)` → `transition: none;`

### DPadMenu/DPadMenu.a11y.recovery.css

- Line 10: `#a11y-content-wrapper.a11y-reduce-motion .dpad-menu` → `transition: none;`
- Line 14: `#a11y-content-wrapper.a11y-reduce-motion .dpad-menu__btn` → `transition: none;`
- Line 18: `#a11y-content-wrapper.a11y-reduce-motion .dpad-menu:has(.dpad-menu__btn:active)` → `transition: none;`

### DPadMenu/DPadMenu.style.css

- Line 13: `.dpad-menu` → `transition: width var(--transition-base), height var(--transition-base);`
- Line 47: `.dpad-menu__btn` → `transition: all var(--transition-fast);`
- Line 90: `.dpad-menu:has(.dpad-menu__btn:active)` → `transition: box-shadow var(--transition-fast);`

### RadialMenu/RadialMenu.a11y.css

- Line 10: `#a11y-content-wrapper.a11y-reduce-motion .radial-menu__trigger` → `transition: none;`
- Line 14: `#a11y-content-wrapper.a11y-reduce-motion .radial-menu__line` → `transition: none;`
- Line 18: `#a11y-content-wrapper.a11y-reduce-motion .radial-menu__item` → `transition: none;`
- Line 22: `#a11y-content-wrapper.a11y-reduce-motion .radial-menu__toggle:checked ~ .radial-menu__item` → `transition: none;`
- Line 59: `#a11y-content-wrapper.a11y-text-only .radial-menu__trigger:hover` → `transform: none;`

### RadialMenu/RadialMenu.a11y.recovery.css

- Line 10: `#a11y-content-wrapper.a11y-reduce-motion .radial-menu__trigger` → `transition: none;`
- Line 14: `#a11y-content-wrapper.a11y-reduce-motion .radial-menu__line` → `transition: none;`
- Line 18: `#a11y-content-wrapper.a11y-reduce-motion .radial-menu__item` → `transition: none;`
- Line 22: `#a11y-content-wrapper.a11y-reduce-motion .radial-menu__toggle:checked ~ .radial-menu__item` → `transition: none;`
- Line 59: `#a11y-content-wrapper.a11y-text-only .radial-menu__trigger:hover` → `transform: none;`

### RadialMenu/RadialMenu.style.css

- Line 31: `.radial-menu__trigger` → `transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);`
- Line 40: `.radial-menu__toggle:checked + .radial-menu__trigger` → `transition: transform 200ms linear;`
- Line 55: `.radial-menu__line` → `transition: transform 200ms;`
- Line 89: `.radial-menu__item` → `transition: transform 200ms ease;`
- Line 35: `.radial-menu__trigger:hover` → `transform: scale(1.1);`

### Toast/Toast.a11y.css

- Line 21: `.a11y-reduce-motion` → `animation: toast-a11y-fade-in 1.2s ease both;`
- Line 48: `.a11y-text-only` → `animation: toast-a11y-fade-in 1.2s ease both;`

### Toast/Toast.a11y.recovery.css

- Line 77: `) .toast` → `animation: toast-a11y-fade-in 1.2s ease both !important;`
- Line 83: `@media (prefers-reduced-motion: reduce)` → `animation: toast-a11y-fade-in 1.2s ease both !important;`

### Toast/Toast.css

- Line 46: `.toast` → `transition: transform 0.2s ease, box-shadow 0.2s ease;`
- Line 345: `.toast-slide-animation` → `animation: toast-slide 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;`
- Line 349: `.toast-fade-animation` → `animation: toast-fade 0.6s ease-out both;`
- Line 353: `.toast-bounce-animation` → `animation: toast-bounce 0.8s cubic-bezier(0.25, 1, 0.5, 1) both;`
- Line 357: `.toast-zoom-animation` → `animation: toast-zoom 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;`
- Line 361: `.toast-flip-animation` → `animation: toast-flip 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;`
- Line 56: `.toast:hover` → `transform: translateY(-2px);`

### Toast/Toast.responsive.css

- Line 35: `@media (max-width: 500px)` → `animation: toast-a11y-fade-in 1.2s ease both !important;`

### ImageOverlay/ImageOverlay.a11y.css

- Line 21: `.a11y-reduce-motion` → `transition: none;`

### ImageOverlay/ImageOverlay.a11y.recovery.css

- Line 18: `.a11y-reduce-motion` → `transition: none;`

### switcher/switcher.a11y.css

- Line 171: `#a11y-content-wrapper.a11y-cvd-tritanopia .switcher-btn.active` → `transition: none !important;`
- Line 211: `.switcher-btn` → `transition: none;`

### a11y/a11y-panel.css

- Line 46: `.a11y-panel` → `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);`
- Line 368: `.a11y-panel__close` → `transition: color var(--transition-fast);`
- Line 426: `.a11y-panel__backdrop` → `transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);`

### contact/ContactForm.a11y.css

- Line 24: `.a11y-reduce-motion` → `transition: none;`

### grids/masonry-grid.a11y.css

- Line 474: `.masonry-card` → `transition: none !important;`
- Line 481: `.masonry-card:hover` → `transform: none;`

### nav/glass-nav.a11y.css

- Line 45: `.nav-container` → `transition: max-height 1s ease-out, padding 1s ease-out !important;`
- Line 51: `.nav-container` → `transition: opacity 0.8s ease-out 0.3s !important;`
- Line 83: `.nav-container .expandable-menu` → `transition: max-height 1s ease-out, padding 1s ease-out !important;`
- Line 88: `.nav-container .expandable-menu-wrapper` → `transition: opacity 0.8s ease-out 0.3s !important;`

### nav/GlassNav-mobile.css

- Line 49: `.nav-container` → `transition: height 0.65s cubic-bezier(0.4, 0.0, 0.2, 1) 0.25s,`
- Line 115: `.mobile-menu-icons` → `transition: opacity 0.3s ease, transform 0.3s ease;`
- Line 130: `.mobile-menu-icon-btn` → `transition: background var(--transition-fast),`
- Line 177: `.mobile-menu-list li` → `transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1),`
- Line 201: `.mobile-menu-list > li > a` → `transition: color var(--transition-fast), font-weight var(--transition-fast);`
- Line 214: `.mobile-menu-list a` → `transition: color var(--transition-fast), font-weight var(--transition-fast);`
- Line 246: `.submenu-toggle` → `transition: color var(--transition-fast);`
- Line 272: `.submenu` → `transition: max-height var(--transition-base);`
- Line 284: `.submenu li` → `transition: none;`
- Line 309: `.nav-container.menu-opened` → `transition: height 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) 0s,`
- Line 329: `.nav-container.menu-opened .mobile-menu-list li` → `transition: transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1),`
- Line 138: `.mobile-menu-icon-btn:hover` → `transform: scale(1.05);`
- Line 144: `.mobile-menu-icon-btn:active` → `transform: scale(0.95);`

### nav/ReaderNav.css

- Line 1386: `.nav-info-btn` → `transition: transform 0.3s ease, opacity 0.3s ease;`
- Line 1420: `.nav-info-btn` → `transition: background-color var(--transition-fast);`

### sections/HeroSection.a11y.css

- Line 21: `.a11y-reduce-motion` → `transition: none;`
- Line 35: `@media (prefers-reduced-motion: reduce)` → `transition: none;`
- Line 25: `.a11y-reduce-motion` → `animation: none;`
- Line 39: `@media (prefers-reduced-motion: reduce)` → `animation: none;`

### sections/philosophy-flip-cards.css

- Line 139: `.philosophy-flip__card:hover .philosophy-flip__card-inner` → `transform: rotateY(180deg);`

### sections/pillars-section.css

- Line 183: `.pillars-section__card:hover` → `transform: none;`

### sections/who-slider.css

- Line 18: `.who-slider__track` → `transition: transform 0.8s ease-in-out;`
- Line 45: `.who-slider__title-card` → `transition: none;`
- Line 208: `.who-slider__dot` → `transition: all var(--transition-base);`
- Line 48: `.card.who-slider__title-card:hover` → `transform: none;`
- Line 109: `.card.who-slider__card:hover` → `transform: none;`
- Line 216: `.who-slider__dot:hover` → `transform: scale(1.2);`

### HeroSection/HeroSection.a11y.css

- Line 21: `.a11y-reduce-motion` → `transition: none;`
- Line 35: `@media (prefers-reduced-motion: reduce)` → `transition: none;`
- Line 25: `.a11y-reduce-motion` → `animation: none;`
- Line 39: `@media (prefers-reduced-motion: reduce)` → `animation: none;`

## Component Dependency Tree (Atom Imports)

| Component | Imports Atoms | Missing Atoms (raw HTML) |
|---|---|---|
| Insights/InsightAuthorSection.astro | none | clean |
| Typography/SectionTitle.astro | Icon | <span → Text (×2), <p → Text (×1), <h2 → Heading (×1) |
| Announcer/Announcer.astro | none | clean |
| PresetButton/PresetButton.astro | Icon | <button → Button (×1), <h4 → Heading (×1) |
| Stepper/Stepper.astro | none | <button → Button (×2), <span → Text (×1) |
| RevealCanvas/RevealCanvas.astro | none | clean |
| DrawIcon/DrawSVGIcon.astro | none | <span → Text (×1) |
| DrawIcon/ScrollDrawIcon.astro | Icon | clean |
| PagePatternLayer/PagePatternLayer.astro | none | clean |
| ParallaxDecor/ParallaxDecor.astro | Icon | clean |
| PatternOverlay/PatternOverlay.astro | Icon | clean |
| PhysicsOverlay/PhysicsOverlay.astro | none | clean |
| ScrollColorBackground/ScrollColorBackground.astro | none | clean |
| form/FormField.astro | none | clean |
| grid/Grid.astro | none | clean |
| icons/Icon.astro | none | clean |
| icons/LottieIcon.astro | none | clean |
| Image/Image.astro | none | clean |
| Badge/Badge.astro | Icon | <span → Text (×2) |
| Button/Button.astro | Icon, LottieIcon | <a → Link (×1), <span → Text (×3) |
| Card/Card.astro | none | clean |
| Heading/Heading.astro | Icon | <span → Text (×2), <p → Text (×1) |
| Link/Link.astro | none | clean |
| List/List.astro | Icon | <span → Text (×3) |
| DPadMenu/DPadMenu.astro | Icon | <a → Link (×1), <button → Button (×1), <span → Text (×3) |
| RadialMenu/RadialMenu.astro | Icon | <span → Text (×3) |
| ShareMenu/ShareMenu.astro | Button, Icon | <a → Link (×4), <button → Button (×1) |
| Text/Text.astro | none | clean |
| Toast/Toast.astro | Icon | <span → Text (×1) |
| a11y/FontCard.astro | none | <button → Button (×1), <small → Text (×1) |
| a11y/ToggleCard.astro | Icon | <button → Button (×1), <small → Text (×1), <span → Text (×2) |
| cards/AssetCard.astro | Button, Text, Heading, Badge | <button → Button (×3) |
| cards/AuthorCard.astro | none | <small → Text (×2), <p → Text (×1), <h3 → Heading (×1) |
| cards/BlogCard.astro | Text, Heading, Icon, Badge | <a → Link (×1) |
| cards/ChoiceCard.astro | none | <span → Text (×1), <h3 → Heading (×1) |
| cards/CompactToolCard.astro | none | <a → Link (×1), <span → Text (×1), <p → Text (×1), <h3 → Heading (×1) |
| cards/FlipCard.astro | none | <a → Link (×1), <p → Text (×2), <h3 → Heading (×2) |
| cards/GlowCard.astro | Icon | <p → Text (×1), <h3 → Heading (×1) |
| cards/ImageRevealCard.astro | none | <a → Link (×1), <button → Button (×1), <span → Text (×3), <p → Text (×1), <h3 → Heading (×1) |
| cards/InfoCard.astro | Button, Text, Heading, Badge | <button → Button (×10) |
| cards/InsightCard.astro | Button, Badge | <a → Link (×1), <button → Button (×1), <small → Text (×2), <span → Text (×1), <p → Text (×1), <h2 → Heading (×1) |
| cards/MasonryCard.astro | Icon | <a → Link (×1), <small → Text (×3), <span → Text (×1), <p> → Text (×1), <p → Text (×7), <h1 → Heading (×1), <h3 → Heading (×5) |
| cards/OfferingCard.astro | Button | <button → Button (×1), <p → Text (×1), <h3 → Heading (×1), <h4 → Heading (×3) |
| cards/ProductCard.astro | Button, Badge | <a → Link (×1), <button → Button (×1), <small → Text (×2), <span → Text (×2), <p → Text (×2), <h3 → Heading (×1) |
| cards/ProjectCard.astro | Button | <button → Button (×1), <small → Text (×1), <p → Text (×1), <h2 → Heading (×1) |
| cards/ProjectSpecCard.astro | Icon | <small → Text (×1), <span → Text (×1) |
| cards/RainbowBorderCard.astro | none | clean |
| cards/SlideCard.astro | Icon | <a → Link (×1), <p → Text (×1), <h3 → Heading (×1) |
| cards/SpecCard.astro | Icon | <small → Text (×1), <span → Text (×1) |
| cards/StepCard.astro | none | <p → Text (×1), <h3 → Heading (×1) |
| cards/TeamCard.astro | Text, Heading, Icon | <a → Link (×6) |
| cards/TestimonialCard.astro | Text, Icon | <span → Text (×3) |
| cards/WhyCard.astro | none | <span → Text (×1), <p → Text (×1), <h3 → Heading (×1) |
| checkout/DownloadSummary.astro | Button | <a → Link (×1), <button → Button (×2), <span → Text (×2), <p> → Text (×2) |
| contact/ContactInfo.astro | Link, Text, Heading, Icon | clean |
| contact/ContactPopup.astro | Icon | <button → Button (×10), <span → Text (×3), <p> → Text (×1), <p → Text (×1), <h2 → Heading (×1), <h3 → Heading (×2) |
| ConnectorTimeline/ConnectorTimeline.astro | Icon | <span → Text (×3) |
| LiquidReveal/LiquidRevealZone.astro | none | clean |
| global/AnnouncementTicker.astro | Icon | <a → Link (×1), <span → Text (×1), <p → Text (×2) |
| global/CookieBanner.astro | Button | <a → Link (×1), <button → Button (×5), <span → Text (×1), <p → Text (×4), <h3 → Heading (×2), <h4 → Heading (×3) |
| global/CustomScrollbar.astro | none | clean |
| CustomScrollbar/CustomScrollbar.astro | none | clean |
| insights/InsightContent.astro | none | clean |
| insights/InsightHeader.astro | Badge | <small → Text (×2), <span → Text (×2), <p → Text (×1), <h1 → Heading (×1) |
| ImageOverlay/ImageOverlay.astro | none | clean |
| nav/Breadcrumbs.astro | none | <a → Link (×1), <span → Text (×2) |
| nav/SideTabs.astro | none | <button → Button (×4) |
| product/ProductInfo.astro | Button, Icon | <button → Button (×2), <small → Text (×1), <span → Text (×1), <p → Text (×2), <h1 → Heading (×1) |
| sections/CalloutSection.astro | none | <h3 → Heading (×1) |
| sections/QuoteSection.astro | none | <small → Text (×1), <span → Text (×1) |
| sections/TextSection.astro | none | <p → Text (×1), <h2 → Heading (×1) |
| shop/CartIcon.astro | none | <span → Text (×1) |
| switcher/BaseSwitcher.astro | none | <button → Button (×1), <small → Text (×1), <span → Text (×1) |
| switcher/BasicFilterSwitcher.astro | none | clean |
| switcher/ContentSwitcher.astro | none | clean |
| switcher/IsotopeFilterSwitcher.astro | none | clean |
| timeline/TimelineStepper.astro | none | <span → Text (×1), <p → Text (×1), <h3 → Heading (×1) |
| Footer/Footer.astro | Link, Text, Heading | <span → Text (×8) |
| IconScrollStage/IconScrollStage.astro | Icon | clean |
| ScrollMorph/ScrollMorphZone.astro | none | <p → Text (×1), <h3 → Heading (×1) |
| a11y/A11yNavigationSection.astro | none | <h3 → Heading (×1) |
| a11y/AccessibilityPanel.astro | Icon | <button → Button (×3), <span → Text (×2), <h2 → Heading (×1) |
| a11y/PresetsSidebar.astro | none | clean |
| a11y/ThemeSidebar.astro | none | clean |
| a11y/TypographyAdjustmentsSection.astro | none | <h3 → Heading (×1) |
| a11y/TypographySection.astro | none | <h3 → Heading (×1) |
| a11y/VisualSection.astro | none | <h3 → Heading (×1) |
| contact/ContactForm.astro | Button, Text, Heading, Icon | <button → Button (×3) |
| grids/ForYouGrid.astro | none | <a → Link (×1), <h3 → Heading (×1) |
| grids/MasonryGrid.astro | none | clean |
| grids/ProjectSpecGrid.astro | none | clean |
| grids/RelatedGrid.astro | Button | <a → Link (×1), <button → Button (×2), <small → Text (×1), <span → Text (×1), <p → Text (×1), <h2 → Heading (×1), <h3 → Heading (×1) |
| grids/SpecGrid.astro | none | clean |
| nav/GlassNav.astro | Icon, LottieIcon | <a → Link (×7), <button → Button (×5), <p> → Text (×1), <h3 → Heading (×1) |
| nav/LegalNav.astro | Button | <button → Button (×1) |
| nav/ReaderNav.astro | Icon, LottieIcon | <button → Button (×9), <small → Text (×2), <span → Text (×8), <h5 → Heading (×1) |
| presentation/PresentationEndSection.astro | none | clean |
| presentation/Reader.astro | none | clean |
| product/IsotopeImageGallery.astro | Badge | <small → Text (×1) |
| product/ProductGallery.astro | none | <button → Button (×1) |
| search/SearchResults.astro | Icon, Badge | <a → Link (×2), <span → Text (×3), <p → Text (×4), <h2 → Heading (×1), <h3 → Heading (×3) |
| sections/CompareSection.astro | none | <small → Text (×2), <h3 → Heading (×2) |
| sections/CTASection.astro | Button | <button → Button (×1), <span → Text (×1), <p> → Text (×1), <p → Text (×1), <h2 → Heading (×1) |
| sections/EndSection.astro | none | <a → Link (×3), <small → Text (×3), <span → Text (×2), <p → Text (×1), <h4 → Heading (×2) |
| sections/FullWidthSection.astro | none | <p → Text (×1), <h2 → Heading (×1) |
| sections/GallerySection.astro | none | <small → Text (×1) |
| sections/HeroMorphAnimation.astro | Button | <button → Button (×1), <p → Text (×1), <h1 → Heading (×1) |
| sections/HeroSection.astro | Button | <button → Button (×5), <span → Text (×3), <p → Text (×15), <h1 → Heading (×5) |
| sections/ImageTextSection.astro | Button | <button → Button (×1), <p → Text (×1), <h2 → Heading (×1) |
| sections/PhilosophyFlipCardsSection.astro | none | <p> → Text (×1), <p → Text (×1), <h2 → Heading (×1), <h3 → Heading (×2) |
| sections/PillarsSection.astro | none | <p → Text (×2), <h6 → Heading (×1) |
| sections/PresentationImageTextSection.astro | none | <p → Text (×1), <h2 → Heading (×1) |
| sections/ServiceDetails.astro | none | <h3 → Heading (×1) |
| sections/ShareSection.astro | Icon, LottieIcon | <button → Button (×1), <p → Text (×1), <h2 → Heading (×1) |
| sections/StatsSection.astro | none | <small → Text (×1), <span → Text (×2) |
| sections/StorySection.astro | none | <p> → Text (×1) |
| sections/ValuesSection.astro | none | <p → Text (×1), <h3 → Heading (×1) |
| sections/WhoSliderSection.astro | Button, Icon | <button → Button (×7), <p → Text (×2), <h2 → Heading (×1), <h3 → Heading (×1) |
| HeroSection/HeroSection.astro | Button | <button → Button (×5), <span → Text (×3), <p → Text (×15), <h1 → Heading (×5) |
| shop/MiniCart.astro | none | <a → Link (×3), <button → Button (×1), <span → Text (×6), <p> → Text (×1), <h4 → Heading (×1) |

## JS Animation Map

| Component | Scripts | Lib Imports | Events | Data Attrs | Passthroughs |
|---|---|---|---|---|---|
| RevealCanvas/RevealCanvas.astro | 1 | - | mousemove | - | - |
| DrawIcon/DrawSVGIcon.astro | 1 | gsap | mouseenter, mouseleave | data-animate | hover |
| PagePatternLayer/PagePatternLayer.astro | 1 | lib/animation/, animation/ | scroll | - | - |
| ParallaxDecor/ParallaxDecor.astro | 0 | - | - | - | speed |
| PatternOverlay/PatternOverlay.astro | 1 | lib/animation/, animation/ | - | data-scroll-bg, data-pattern-magnetic, data-scroll-reveal | magnetic |
| PhysicsOverlay/PhysicsOverlay.astro | 1 | lib/animation/, animation/ | - | - | - |
| ScrollColorBackground/ScrollColorBackground.astro | 1 | lib/animation/, animation/ | scroll | data-scroll-bg | - |
| icons/Icon.astro | 0 | - | - | - | hover |
| icons/LottieIcon.astro | 1 | lottie | - | data-lottie-icon | lottieLoop, loop |
| Button/Button.astro | 4 | lottie, particle-burst, lib/animation/, animation/ | mouseenter, mousemove, mouseleave | data-particle-burst, data-confetti, data-mag-bound, data-spot-bound, data-lottie-icon, data-btn-lottie-bound, data-confetti-bound | loop |
| ShareMenu/ShareMenu.astro | 1 | - | mouseenter, mouseleave | - | hover |
| Toast/Toast.astro | 0 | - | - | - | speed |
| a11y/FontCard.astro | 0 | - | - | - | hover |
| a11y/ToggleCard.astro | 0 | - | - | - | hover |
| cards/AssetCard.astro | 1 | - | mouseenter, mouseleave | - | - |
| cards/BlogCard.astro | 0 | - | - | - | hover |
| cards/ChoiceCard.astro | 1 | - | - | - | hover |
| cards/CompactToolCard.astro | 0 | - | - | - | hover |
| cards/FlipCard.astro | 0 | - | - | - | hover |
| cards/GlowCard.astro | 1 | gsap | mouseenter, mouseleave, scroll | - | - |
| cards/ImageRevealCard.astro | 1 | - | - | - | hover |
| cards/InfoCard.astro | 1 | - | - | - | hover |
| cards/InsightCard.astro | 0 | - | - | - | hover |
| cards/MasonryCard.astro | 0 | - | - | data-scroll-reveal | - |
| cards/ProductCard.astro | 1 | - | - | - | hover |
| cards/ProjectCard.astro | 0 | - | - | data-scroll-bg | hover |
| cards/ProjectSpecCard.astro | 0 | - | - | - | hover |
| cards/RainbowBorderCard.astro | 1 | - | mouseenter, mouseleave | - | speed, hover |
| cards/SlideCard.astro | 0 | - | - | - | hover |
| cards/SpecCard.astro | 0 | - | - | - | hover |
| cards/StepCard.astro | 0 | - | - | - | hover |
| cards/TeamCard.astro | 0 | - | - | - | hover |
| cards/TestimonialCard.astro | 0 | - | - | - | hover |
| checkout/DownloadSummary.astro | 1 | - | - | - | hover |
| contact/ContactPopup.astro | 1 | - | - | - | hover |
| LiquidReveal/LiquidRevealZone.astro | 1 | matter, lib/animation/, animation/ | - | - | - |
| global/AnnouncementTicker.astro | 1 | - | - | - | speed |
| global/CookieBanner.astro | 1 | - | - | - | - |
| global/CustomScrollbar.astro | 1 | - | scroll | - | hover |
| CustomScrollbar/CustomScrollbar.astro | 1 | - | scroll | - | hover |
| nav/Breadcrumbs.astro | 0 | - | - | - | hover |
| nav/SideTabs.astro | 1 | lottie | mouseenter, mouseleave | - | speed, hover |
| shop/CartIcon.astro | 1 | - | - | - | - |
| switcher/BaseSwitcher.astro | 1 | - | - | - | - |
| switcher/BasicFilterSwitcher.astro | 1 | - | - | - | - |
| switcher/ContentSwitcher.astro | 1 | - | - | - | - |
| switcher/IsotopeFilterSwitcher.astro | 1 | - | - | - | - |
| Footer/Footer.astro | 1 | - | mouseenter, mouseleave | - | - |
| IconScrollStage/IconScrollStage.astro | 1 | lib/animation/, animation/ | scroll | - | - |
| ScrollMorph/ScrollMorphZone.astro | 1 | gsap, lib/animation/, animation/ | scroll | - | effect |
| a11y/AccessibilityPanel.astro | 1 | - | scroll | - | - |
| contact/ContactForm.astro | 1 | - | scroll | - | - |
| grids/ForYouGrid.astro | 0 | - | - | - | hover |
| grids/MasonryGrid.astro | 1 | lib/animation/, animation/ | scroll | data-scroll-reveal | - |
| grids/RelatedGrid.astro | 0 | - | - | - | hover |
| nav/GlassNav.astro | 1 | lottie | mouseenter, mouseleave, scroll | data-lottie-icon | lottieIcon |
| nav/ReaderNav.astro | 1 | gsap, lottie | scroll | - | - |
| presentation/Reader.astro | 1 | gsap | scroll | - | - |
| product/IsotopeImageGallery.astro | 1 | - | - | - | - |
| search/SearchResults.astro | 1 | - | - | - | hover |
| sections/EndSection.astro | 0 | - | - | - | hover |
| sections/HeroMorphAnimation.astro | 1 | lib/animation/, animation/ | - | - | - |
| sections/ShareSection.astro | 1 | lottie | mouseenter, mouseleave | data-lottie-icon | lottieIcon, hover |
| sections/WhoSliderSection.astro | 1 | - | - | - | - |
| shop/MiniCart.astro | 1 | lottie | - | - | hover |

## Schema Status

| Component | Has Schema | Flat Props | Content/Visual/Animation Split | Prop Count | Category |
|---|---|---|---|---|---|
| Insights | NO | - | - | - | - |
| Typography | NO | - | - | - | - |
| Announcer | yes | YES (needs split) | no | - | atoms/a11y |
| PresetButton | yes | YES (needs split) | no | 4 | atoms/a11y |
| Stepper | yes | YES (needs split) | no | 9 | atoms/a11y |
| RevealCanvas | yes | YES (needs split) | no | 10 | atoms/canvas |
| DrawIcon | yes | YES (needs split) | no | 5 | atoms/effects |
| DrawIcon | yes | YES (needs split) | no | 10 | atoms/effects |
| PagePatternLayer | yes | YES (needs split) | no | 4 | atoms/effects |
| ParallaxDecor | yes | YES (needs split) | no | 7 | atoms/effects |
| PatternOverlay | yes | YES (needs split) | no | 18 | atoms/effects |
| PhysicsOverlay | yes | YES (needs split) | no | 20 | atoms/effects |
| ScrollColorBackground | yes | YES (needs split) | no | 1 | atoms/effects |
| form | yes | YES (needs split) | no | 22 | atoms/form |
| grid | yes | YES (needs split) | no | 10 | atoms/grid |
| icons | NO | - | - | - | - |
| Image | yes | YES (needs split) | no | 17 | atoms/images |
| Badge | yes | YES (needs split) | no | 8 | atoms/ui |
| Button | yes | YES (needs split) | no | 28 | atoms/ui |
| Card | yes | YES (needs split) | no | 13 | atoms/ui |
| Heading | yes | YES (needs split) | no | 27 | atoms/ui |
| Link | yes | YES (needs split) | no | 14 | atoms/ui |
| List | yes | YES (needs split) | no | 10 | atoms/ui |
| DPadMenu | NO | - | - | - | - |
| RadialMenu | NO | - | - | - | - |
| ShareMenu | NO | - | - | - | - |
| Text | yes | YES (needs split) | no | 11 | atoms/ui |
| Toast | yes | YES (needs split) | no | 6 | atoms/ui |
| a11y | NO | - | - | - | - |
| cards | NO | - | - | - | - |
| checkout | NO | - | - | - | - |
| contact | NO | - | - | - | - |
| ConnectorTimeline | NO | - | - | - | - |
| LiquidReveal | NO | - | - | - | - |
| global | NO | - | - | - | - |
| CustomScrollbar | NO | - | - | - | - |
| insights | NO | - | - | - | - |
| ImageOverlay | yes | YES (needs split) | no | 9 | molecules/media |
| nav | NO | - | - | - | - |
| product | NO | - | - | - | - |
| sections | NO | - | - | - | - |
| shop | NO | - | - | - | - |
| switcher | NO | - | - | - | - |
| timeline | NO | - | - | - | - |
| Footer | NO | - | - | - | - |
| IconScrollStage | NO | - | - | - | - |
| ScrollMorph | NO | - | - | - | - |
| a11y | NO | - | - | - | - |
| contact | NO | - | - | - | - |
| grids | NO | - | - | - | - |
| nav | NO | - | - | - | - |
| presentation | NO | - | - | - | - |
| product | NO | - | - | - | - |
| search | NO | - | - | - | - |
| sections | NO | - | - | - | - |
| HeroSection | NO | - | - | - | - |
| shop | NO | - | - | - | - |

## Zone Token Definitions

### form/FormField.css
- Sets --theme-luminance: line 88
- Theme custom props: 1 refs

### Badge/Badge.css
- Zone custom props: 21 refs

### ScrollMorph/ScrollMorphZone.a11y.css
- Zone custom props: 4 refs

### ScrollMorph/ScrollMorphZone.style.css
- Zone custom props: 5 refs

## Global Styles

### base\utilities.css (755 lines)
- !important: 19

### global.css (296 lines)
- !important: 11
- Layers: a11y.reduce-motion, a11y

### themes\a11y\a11y-cream.css (110 lines)
- Sets --theme-luminance: 1 places

### themes\a11y\a11y-dark.css (137 lines)
- #a11y-content-wrapper refs: 5
- !important: 7
- Sets --theme-luminance: 1 places

### themes\a11y\a11y-deuteranopia.css (110 lines)
- Sets --theme-luminance: 1 places

### themes\a11y\a11y-high-contrast.css (125 lines)
- Sets --theme-luminance: 1 places

### themes\a11y\a11y-monochrome.css (110 lines)
- Sets --theme-luminance: 1 places

### themes\a11y\a11y-protanopia.css (110 lines)
- Sets --theme-luminance: 1 places

### themes\a11y\a11y-tritanopia.css (110 lines)
- Sets --theme-luminance: 1 places

### themes\brand\BrandDefault.css (110 lines)
- Sets --theme-luminance: 1 places

## Components With Scoped Styles (Need Atomic Audit)

- Typography: SectionTitle.astro
- icons: LottieIcon.astro
- ShareMenu: ShareMenu.astro
- a11y: FontCard.astro, ToggleCard.astro
- cards: AssetCard.astro, AuthorCard.astro, BlogCard.astro, ChoiceCard.astro, CompactToolCard.astro, FlipCard.astro, GlowCard.astro, ImageRevealCard.astro, InfoCard.astro, InsightCard.astro, OfferingCard.astro, ProductCard.astro, ProjectCard.astro, ProjectSpecCard.astro, RainbowBorderCard.astro, SlideCard.astro, SpecCard.astro, StepCard.astro, TeamCard.astro, TestimonialCard.astro, WhyCard.astro
- contact: ContactPopup.astro
- insights: InsightContent.astro, InsightHeader.astro
- nav: Breadcrumbs.astro, SideTabs.astro
- product: ProductInfo.astro
- sections: CalloutSection.astro, QuoteSection.astro, TextSection.astro
- timeline: TimelineStepper.astro
- a11y: A11yNavigationSection.astro, PresetsSidebar.astro, ThemeSidebar.astro, TypographyAdjustmentsSection.astro, TypographySection.astro, VisualSection.astro
- grids: ForYouGrid.astro, MasonryGrid.astro, ProjectSpecGrid.astro, RelatedGrid.astro, SpecGrid.astro
- nav: LegalNav.astro
- presentation: PresentationEndSection.astro
- sections: CompareSection.astro, EndSection.astro, FullWidthSection.astro, GallerySection.astro, PresentationImageTextSection.astro, ServiceDetails.astro, StatsSection.astro, StorySection.astro

## Per-Component Detail

### Insights

Files: InsightAuthorSection.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts

### Typography

Files: SectionTitle.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms

### Announcer

Files: Announcer.astro, Announcer.schema.json, index.ts

- MISSING: separated CSS
- MISSING: responsive CSS
- SCHEMA: flat props (needs content/visual/animation split)

### PresetButton

Files: index.ts, PresetButton.a11y.css, PresetButton.a11y.recovery.css, PresetButton.astro, PresetButton.css, PresetButton.responsive.css, PresetButton.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS

### Stepper

Files: index.ts, Stepper.a11y.css, Stepper.a11y.recovery.css, Stepper.astro, Stepper.css, Stepper.responsive.css, Stepper.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS

### RevealCanvas

Files: index.ts, RevealCanvas.a11y.css, RevealCanvas.a11y.recovery.css, RevealCanvas.astro, RevealCanvas.css, RevealCanvas.responsive.css, RevealCanvas.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- JS: has script animation

### DrawIcon

Files: DrawSVGIcon.a11y.css, DrawSVGIcon.astro, DrawSVGIcon.css, DrawSVGIcon.responsive.css, DrawSVGIcon.schema.json, index.ts, ScrollDrawIcon.a11y.css, ScrollDrawIcon.a11y.recovery.css, ScrollDrawIcon.astro, ScrollDrawIcon.css, ScrollDrawIcon.responsive.css, ScrollDrawIcon.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- JS: has script animation

### PagePatternLayer

Files: index.ts, PagePatternLayer.a11y.css, PagePatternLayer.a11y.recovery.css, PagePatternLayer.astro, PagePatternLayer.css, PagePatternLayer.responsive.css, PagePatternLayer.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- JS: has script animation

### ParallaxDecor

Files: index.ts, ParallaxDecor.a11y.css, ParallaxDecor.a11y.recovery.css, ParallaxDecor.astro, ParallaxDecor.css, ParallaxDecor.responsive.css, ParallaxDecor.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)

### PatternOverlay

Files: index.ts, pattern-motion.css, PatternOverlay.a11y.css, PatternOverlay.a11y.recovery.css, PatternOverlay.astro, PatternOverlay.css, PatternOverlay.responsive.css, PatternOverlay.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- MOTION: ambient transitions in base CSS
- JS: has script animation

### PhysicsOverlay

Files: index.ts, PhysicsOverlay.a11y.css, PhysicsOverlay.a11y.recovery.css, PhysicsOverlay.astro, PhysicsOverlay.css, PhysicsOverlay.responsive.css, PhysicsOverlay.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS

### ScrollColorBackground

Files: index.ts, ScrollColorBackground.a11y.css, ScrollColorBackground.a11y.recovery.css, ScrollColorBackground.astro, ScrollColorBackground.css, ScrollColorBackground.responsive.css, ScrollColorBackground.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- MOTION: ambient transitions in base CSS
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS

### form

Files: FormField.a11y.css, FormField.a11y.recovery.css, FormField.astro, FormField.css, FormField.responsive.css, FormField.schema.json, index.ts

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- MOTION: ambient transitions in base CSS

### grid

Files: Grid.a11y.css, Grid.a11y.recovery.css, Grid.astro, Grid.css, Grid.responsive.css, Grid.schema.json, index.ts

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- MOTION: ambient transitions in base CSS

### icons

Files: Icon.astro, LottieIcon.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- JS: has script animation

### Image

Files: Image.a11y.css, Image.a11y.recovery.css, Image.astro, Image.css, Image.responsive.css, Image.schema.json, index.ts

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- MOTION: ambient transitions in base CSS

### Badge

Files: Badge.a11y.css, Badge.a11y.recovery.css, Badge.astro, Badge.css, Badge.responsive.css, Badge.schema.json, index.ts

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- ATOMS: uses raw HTML instead of atoms
- DEAD: #a11y-content-wrapper in CSS

### Button

Files: Button.a11y.css, Button.a11y.recovery.css, Button.astro, Button.css, Button.responsive.css, Button.schema.json, confetti.css, index.ts

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- JS: has script animation
- DEAD: #a11y-content-wrapper in JS

### Card

Files: Card.a11y.css, Card.a11y.recovery.css, Card.astro, Card.css, Card.responsive.css, Card.schema.json, index.ts

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- MOTION: ambient transitions in base CSS
- DEAD: #a11y-content-wrapper in CSS

### Heading

Files: Heading.a11y.css, Heading.a11y.recovery.css, Heading.astro, Heading.css, Heading.responsive.css, Heading.schema.json, index.ts

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- DEAD: #a11y-content-wrapper in CSS

### Link

Files: index.ts, Link.a11y.css, Link.a11y.recovery.css, Link.astro, Link.css, Link.responsive.css, Link.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- MOTION: ambient transitions in base CSS

### List

Files: index.ts, List.a11y.css, List.a11y.recovery.css, List.astro, List.css, List.responsive.css, List.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- ATOMS: uses raw HTML instead of atoms

### DPadMenu

Files: DPadMenu.a11y.css, DPadMenu.a11y.recovery.css, DPadMenu.astro, DPadMenu.responsive.css, DPadMenu.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- DEAD: #a11y-content-wrapper in CSS

### RadialMenu

Files: RadialMenu.a11y.css, RadialMenu.a11y.recovery.css, RadialMenu.astro, RadialMenu.responsive.css, RadialMenu.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- DEAD: #a11y-content-wrapper in CSS

### ShareMenu

Files: ShareMenu.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation

### Text

Files: index.ts, Text.a11y.css, Text.a11y.recovery.css, Text.astro, Text.css, Text.responsive.css, Text.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- DEAD: #a11y-content-wrapper in CSS

### Toast

Files: index.ts, Toast.a11y.css, Toast.a11y.recovery.css, Toast.astro, Toast.css, Toast.responsive.css, Toast.schema.json

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS

### a11y

Files: FontCard.astro, ToggleCard.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- DEAD: #a11y-content-wrapper in JS

### cards

Files: asset-detail.a11y.css, AssetCard.astro, AuthorCard.astro, BlogCard.astro, card-demo.css, ChoiceCard.astro, compact-tool-card.a11y.css, CompactToolCard.astro, FlipCard.astro, GlowCard.astro, GlowTokens.css, ImageRevealCard.astro, InfoCard.astro, InsightCard.astro, masonry-card.css, masonry-index.ts, masonry-types.ts, MasonryCard.astro, offering-card.a11y.css, OfferingCard.astro, product-card.a11y.css, ProductCard.astro, ProjectCard.astro, ProjectSpecCard.astro, RainbowBorderCard.astro, SlideCard.astro, spec-card.a11y.css, SpecCard.astro, step-card.a11y.css, StepCard.astro, TeamCard.astro, TestimonialCard.astro, why-card.a11y.css, WhyCard.astro

- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS
- DEAD: #a11y-content-wrapper in JS

### checkout

Files: DownloadSummary.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation

### contact

Files: contact-popup.js, ContactInfo.a11y.css, ContactInfo.astro, ContactInfo.responsive.css, ContactInfo.style.css, ContactPopup.astro

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation
- DEAD: #a11y-content-wrapper in JS

### ConnectorTimeline

Files: ConnectorTimeline.a11y.css, ConnectorTimeline.astro, ConnectorTimeline.responsive.css, ConnectorTimeline.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- ATOMS: uses raw HTML instead of atoms
- DEAD: #a11y-content-wrapper in CSS

### LiquidReveal

Files: LiquidRevealZone.a11y.css, LiquidRevealZone.astro, LiquidRevealZone.responsive.css, LiquidRevealZone.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- JS: has script animation

### global

Files: announcement-ticker.css, AnnouncementTicker.astro, cookie-banner.css, CookieBanner.astro, CustomScrollbar\CustomScrollbar.astro

- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation
- DEAD: #a11y-content-wrapper in JS

### CustomScrollbar

Files: CustomScrollbar.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- JS: has script animation
- DEAD: #a11y-content-wrapper in JS

### insights

Files: InsightContent.astro, InsightHeader.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms

### ImageOverlay

Files: ImageOverlay.a11y.css, ImageOverlay.a11y.recovery.css, ImageOverlay.astro, ImageOverlay.css, ImageOverlay.responsive.css, ImageOverlay.schema.json, index.ts

- HAS: a11y.css (needs processing)
- SCHEMA: flat props (needs content/visual/animation split)
- MOTION: ambient transitions in base CSS

### nav

Files: Breadcrumbs.astro, side-tabs.a11y.css, SideTabs.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS
- DEAD: #a11y-content-wrapper in JS

### product

Files: ProductInfo.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms

### sections

Files: CalloutSection.astro, QuoteSection.astro, TextSection.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms

### shop

Files: cart-icon.css, CartIcon.astro

- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS

### switcher

Files: BaseSwitcher.astro, BasicFilterSwitcher.astro, ContentSwitcher.astro, IsotopeFilterSwitcher.astro, switcher.a11y.css

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS
- DEAD: #a11y-content-wrapper in JS

### timeline

Files: TimelineStepper.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms

### Footer

Files: Footer.a11y.css, Footer.astro, Footer.responsive.css, Footer.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS

### IconScrollStage

Files: IconScrollStage.a11y.css, IconScrollStage.astro, IconScrollStage.responsive.css, IconScrollStage.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS

### ScrollMorph

Files: ScrollMorphZone.a11y.css, ScrollMorphZone.astro, ScrollMorphZone.responsive.css, ScrollMorphZone.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS

### a11y

Files: a11y-panel.css, a11y-panel.ts, A11yNavigationSection.astro, AccessibilityPanel.astro, PresetsSidebar.astro, ThemeSidebar.astro, TypographyAdjustmentsSection.astro, TypographySection.astro, VisualSection.astro

- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS

### contact

Files: ContactForm.a11y.css, ContactForm.astro, ContactForm.responsive.css, ContactForm.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- JS: has script animation

### grids

Files: ForYouGrid.astro, masonry-grid.a11y.css, MasonryGrid.astro, ProjectSpecGrid.astro, RelatedGrid.astro, SpecGrid.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS
- DEAD: #a11y-content-wrapper in JS

### nav

Files: glass-nav.a11y.css, GlassNav-base.css, GlassNav-expandable.css, GlassNav-hamburger.css, GlassNav-mobile.css, GlassNav-responsive.css, GlassNav.astro, GlassNav.css, LegalNav.astro, ReaderNav.astro, ReaderNav.css

- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS

### presentation

Files: PresentationEndSection.astro, Reader.astro, Reader.css, sections.css

- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- HAS: scoped styles in .astro (needs separating)
- JS: has script animation

### product

Files: isotope-gallery.css, IsotopeImageGallery.astro, product-gallery.css, ProductGallery.astro

- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation

### search

Files: search-results.css, SearchResults.astro

- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation

### sections

Files: CompareSection.astro, cta-section.css, CTASection.astro, editorial-layout.css, EndSection.astro, FullWidthSection.astro, GallerySection.astro, hero-morph.css, hero-section.a11y.css, HeroMorphAnimation.astro, HeroSection\HeroSection.a11y.css, HeroSection\HeroSection.astro, HeroSection\HeroSection.responsive.css, HeroSection\HeroSection.style.css, image-text-section.css, ImageTextSection.astro, philosophy-flip-cards.css, PhilosophyFlipCardsSection.astro, pillars-section.css, PillarsSection.astro, PresentationImageTextSection.astro, ServiceDetails.astro, ShareSection.astro, StatsSection.astro, StorySection.astro, values-section.css, ValuesSection.astro, who-slider.css, WhoSliderSection.astro

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- HAS: scoped styles in .astro (needs separating)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS
- JS: has script animation
- DEAD: #a11y-content-wrapper in CSS
- DEAD: #a11y-content-wrapper in JS

### HeroSection

Files: HeroSection.a11y.css, HeroSection.astro, HeroSection.responsive.css, HeroSection.style.css

- MISSING: schema
- MISSING: index.ts
- HAS: a11y.css (needs processing)
- ATOMS: uses raw HTML instead of atoms
- MOTION: ambient transitions in base CSS

### shop

Files: MiniCart.astro

- MISSING: separated CSS
- MISSING: responsive CSS
- MISSING: schema
- MISSING: index.ts
- ATOMS: uses raw HTML instead of atoms
- JS: has script animation

