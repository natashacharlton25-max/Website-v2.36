# Accessibility & Customisation Features Reference

Complete inventory of every feature, its levels, interactions, and control files.
Use this when building the Your View page UI.

---

## 1. FOCUS SYSTEM

Every focus feature is independent. All stack. All keyboard-only (mouse clicks don't trigger).

| Feature | Attribute | Levels | What each level does | Gate interaction |
|---|---|---|---|---|
| **Focus Ring** | `data-focus-active` (JS-set) | Always on when keyboard detected | Square border + fill via `::after` pseudo. `!important` for WCAG. | Immune to all gates |
| **Enhanced Focus** | `data-enhanced-focus` | on/off | Thicker ring (0.3rem vs 0.2rem), double ring style | Stacks with rainbow |
| **Focus Dim** | `data-focus-dim` | on/off | Dims siblings to 15% opacity. Focused element at full. | Instant out always. In speed follows hover gate. |
| **Focus Scroll** | `data-focus-scroll` | on/off | GSAP smooth scroll to centre (power3.out, 0.35s) | Independent |
| **Focus Pulse** | `data-focus-pulse` | on/off | Brief scale 1 -> 1.03 -> 1 on focus arrival | Independent |
| **Focus Label** | `data-focus-label` | on/off | Shows element type tooltip near focus ring | TODO: wire to Tooltip atom + AAC |
| **Rainbow Focus** | `data-focus-rainbow` | on/off | Spinning conic-gradient border with mask cutout | Ring modes vary by hover gate (see below) |
| **Colour Journey** | `data-focus-color-journey` | on/off | GSAP tweens page-bg to section's `data-scroll-bg` colour on each tab | Reads `data-scroll-bg` from parent sections |
| **Rainbow Highlight** | `data-rainbow-highlight` | on/off | Cycles highlight-link border through complement rainbow colours on each tab | Only active when `data-focus-rainbow` also on |

### Rainbow Focus modes (controlled by hover gate)

| Hover gate | Ring behaviour | Glow | Speed |
|---|---|---|---|
| `full` | Spinning gradient | Spread glow halo | 3s rotation |
| `gentle` | Slow spinning gradient + fade-in animation (2.5s) | No glow | 8s rotation |
| `instant` | Static rainbow, random colour each tab (sequential cycling through 7) | No glow | No animation |
| `none` | Static rainbow | No glow | No animation |

### Rainbow colour system

| Element | Token used | Why different |
|---|---|---|
| Focus ring border | `--rainbow-N` (base) | Needs to be vivid and visible |
| Page background wash | `--rainbow-N-wash` (lightest tint) | Subtle, doesn't overpower content |
| Highlight complement | `--rainbow-{N+3}` (3 positions opposite) | Visually distinct from ring |
| Focus-color token | Set to `--rainbow-N` on each tab | Drives ring colour |
| Highlight-link-color | Set to complement on each tab | Drives all highlight borders |

### All rainbow/colour features

| Feature | Attribute | What it does | Needs focus? |
|---|---|---|---|
| **Rainbow Focus** | `data-focus-rainbow` | Spinning gradient border on focused element | Yes (keyboard) |
| **Colour Cycle** | `data-focus-colour-cycle` | Solid focus ring/fill changes colour on each tab (no gradient) | Yes (keyboard) |
| **Colour Journey** | `data-focus-color-journey` | GSAP tweens page bg to section's scroll-bg on each tab | Yes (keyboard) |
| **Rainbow Highlight** | `data-rainbow-highlight` | CSS animation cycles all highlight borders through 7 colours | No |
| **Rainbow Links** | `data-rainbow-highlight` + `data-focus-rainbow` | Highlight borders change complement colour on each tab | Yes (keyboard) |
| **Rainbow Scroll** | `data-rainbow-scroll` | GSAP changes highlight border colour based on scroll position | No |
| **Custom Caret** | `data-custom-caret` | Custom cursor in form fields, syncs colour with `--focus-color` | No (activates on input focus) |
| **Arrow Tab** | `data-arrow-tab` | Arrow indicator next to active form field, follows field position | No (activates on input focus) |
| **Rainbow Scroll** | `data-rainbow-scroll` | GSAP changes highlight border colour based on scroll position | No |

### Bookmark system

| Feature | How it works |
|---|---|
| **Save My Place** | Click-to-place: crosshair cursor → click anywhere → saves exact X/Y + scroll position to localStorage. Falls back to scroll position after 5 seconds if no click. |
| **Find My Place** | Scrolls to saved position via GSAP smooth scroll. Arrow appears at saved X/Y coordinates. Works across pages — navigates to saved URL first. |
| **Arrow marker** | `position: absolute` inside scroll container. Scrolls with content. Pulses 3x to draw attention. Click to dismiss, auto-removes 30s. |
| **Mobile** | Bookmark/map-pin buttons in mobile menu icons. Touch coordinates used same as click. |
| **Cross-session** | localStorage persists across browser sessions. User returns next day, clicks Find My Place. |

All rainbow tokens auto-flip for dark mode and CVD variants via CSS files:
- `rainbow-default.css` (always loaded)
- `rainbow-protan.css` (gated `[data-cvd="protan"]`)
- `rainbow-tritan.css` (gated `[data-cvd="tritan"]`)

---

## 2. HOVER GATE

Controls all decorative hover feedback speed. Does NOT control hover content (tooltips).

| Attribute | Values | File |
|---|---|---|
| `data-hover` (on `<body>`) | `full`, `instant`, `gentle`, `none` | `src/styles/gates/hover-gate.css` |

| Value | Duration tokens | Behaviour |
|---|---|---|
| `full` | 120ms fast, 250ms base, 500ms slow | Standard hover with transitions |
| `instant` | 0s all | Hover state changes instantly, no transition |
| `gentle` | 400ms fast, 800ms base, 2s slow | Slow, soft hover transitions |
| `none` | 0s all, `--hover-state: 0` | No hover decoration at all |

### Focus interaction
When an element has `data-focus-active`, its hover is killed regardless of gate:
- Fill stays, shifts to `--color-Success` on hover
- No transform, no filter, no text-shadow, no backdrop-filter
- Pseudo-elements (`::before`, `::after`) on focused buttons are hidden

---

## 3. HIGHLIGHT LINKS

Makes all interactive elements visually identifiable with coloured borders.

| Attribute | Values | File |
|---|---|---|
| `data-highlight-links` (on `<html>`) | present = on, absent = off | `src/styles/global/highlight-links.css` |

| Element type | Highlight treatment |
|---|---|
| Links (`a`) | Underline + outline |
| Buttons (`.btn`) | Ghost pill (transparent bg, border) |
| Images (`figure[data-role="content"]`) | Outline (only when alt text display active) |
| Form fields | Outline |
| `[tabindex="0"]` | Outline |
| Badges | Excluded (not interactive) |

### Colour
- `--highlight-link-color` — Error-derived, CVD-safe, contrast-validated per theme
- Monochrome themes: ash grey / cadet grey
- HC themes: actual status colours
- Rainbow mode: cycles complement colour on each tab
- Hover shifts to `--color-Warning`

### Focus override
When `:focus-visible`, highlight outline hidden, focus ring takes over completely.

---

## 4. OPACITY GATE (Visual Effects)

Controls shadows, glass, glow, liquid effects.

| Attribute | Values | File |
|---|---|---|
| `data-visual` (on `<body>`) | `full`, `solid`, `flat` | `src/styles/gates/opacity-gate.css` |

| Value | What's on | What's off |
|---|---|---|
| `full` | Everything | Nothing |
| `solid` | Shadows + glow | Glass, blur, liquid, backdrop-filter |
| `flat` | Nothing | All shadows, glass, glow, liquid, backdrop-filter |

### Disabled state
All disabled elements get:
- `opacity: var(--opacity-disabled, 0.5)`
- `cursor: not-allowed`
- `pointer-events: none`
- No hover effects

---

## 5. RENDER MODES

Controls which HTML template is visible.

| Attribute | Values | File |
|---|---|---|
| `data-render` (on `<body>`) | `full`, `reduced`, `textonly` | `src/styles/global/render-modes.css` |

| Value | User-facing name | What it does |
|---|---|---|
| `full` | Default | All CSS, animations, hover effects |
| `reduced` | Calm Mode | Animation props stripped (no animation classes emitted) |
| `textonly` | Reading Mode | Content only, structural rules from `textonly/structure.css` |

### Textonly visual styles

| Attribute | Values | File |
|---|---|---|
| `data-textonly-style` (on `<html>`) | `plain`, `easy-read`, `workbook`, `study`, `aac` | `src/styles/textonly/styles.css` |

| Style | Treatment |
|---|---|
| `plain` | Minimal — border-bottom separator, left-aligned |
| `easy-read` | Large text, extra spacing, thick separators |
| `workbook` | Bordered boxes around sections, worksheet feel |
| `study` | Left border accent, highlighter background |
| `aac` | AAC pictograms instead of text headings |

---

## 6. LAYOUT MODES

Controls page width and column layout.

| Attribute | Values | File |
|---|---|---|
| `data-layout` (on `<html>`) | `single`, `reading`, `presentation` | `src/styles/global/layout-modes.css` |

| Value | Grid columns | Page max-width | Font multiplier |
|---|---|---|---|
| (default) | theme default | theme default | 1 |
| `single` | 1 | unchanged | 1 |
| `reading` | 1 | 700px | 1 |
| `presentation` | 1 | 900px | 1.5 (`--layout-multiplier`) |

---

## 7. TYPOGRAPHY & ZOOM

All scaling flows through one formula: `html font-size = --base-font-pct * --text-multiplier * --layout-multiplier`

| Token | What sets it | Range |
|---|---|---|
| `--base-font-pct` | CSS breakpoints in `responsive.css` | 56.25% (200px) to 112.5% (2560px) |
| `--text-multiplier` | Your View panel font size slider | 0.5 to 3.0 |
| `--layout-multiplier` | Layout mode (presentation = 1.5) | 1 or 1.5 |

### Breakpoints (responsive.css)

| Screen width | `--base-font-pct` | Effective base |
|---|---|---|
| > 2560px | 125% | 20px |
| > 1920px | 112.5% | 18px |
| Desktop (default) | 100% | 16px |
| < 768px | 87.5% | 14px |
| < 480px | 75% | 12px |
| < 250px | 62.5% | 10px |
| < 200px | 56.25% | 9px |

### Additional typography settings

| Setting | Token/class | What it does |
|---|---|---|
| Font family | `.a11y-font-{name}` class | Swaps body font (OpenDyslexic, Atkinson, Comic Sans, Verdana, Arial, Tahoma) |
| Letter spacing | `--a11y-letter-spacing` (inline) | 0-100, multiplied by 0.05em |
| Word spacing | `--a11y-word-spacing` (inline) | 0-100, multiplied by 0.05em |
| Line height | `--a11y-line-height` + `.a11y-line-height-active` | 100-300% |

---

## 8. ALT TEXT SYSTEM

Two independent axes: WHAT to show and HOW to show it.

### What to show

| Attribute | Values | File |
|---|---|---|
| `data-alt-text-mode` (on `<html>`) | `none`, `word`, `descriptive`, `aac` | `src/styles/global/aac-mode.css` |

### How to show it

| Attribute | Values | File |
|---|---|---|
| `data-alt-display-mode` (on `<html>`) | `hidden`, `caption`, `overlay`, `tooltip`, `enlarge`, `replace` | Image atom CSS |

### AAC-specific

| Attribute | Values | What it does |
|---|---|---|
| `data-content-aac` | present/absent | Shows pictogram cards on headings/text (not just images) |
| `data-cognitive-level` | `green`, `yellow`, `orange`, `full` | Filters AAC vocabulary depth |
| `data-aac-filter` | `none`, `grayscale`, `sepia` | CSS filter on pictogram images |
| `data-symbol-set` | `openaac`, `widgit`, `pcs`, `bliss`, `makaton`, `custom` | Which symbol library |

---

## 9. THEME SYSTEM

| Attribute | On | Values | File |
|---|---|---|---|
| `data-theme` | `<body>` | Theme name string | ThemeSwitcher.js |
| `data-mode` | `<body>` | `light`, `dark` | ThemeSwitcher.js |
| `data-cvd` | `<body>` | `protan`, `deutan`, `tritan` | ThemeSwitcher.js |
| `data-theme-chroma` | `<body>` | `grey` or absent | ThemeSwitcher.js |
| `data-high-contrast` | `<body>` | present/absent | ThemeSwitcher.js |
| `data-btn-theme` | `<body>` | Design theme name | ThemeSwitcher.js |

### Theme-generated tokens (from theme engine)

| Token | Source | CVD-safe? |
|---|---|---|
| `--focus-color` | Info status colour | Yes |
| `--focus-bg` | Page background | Yes |
| `--highlight-link-color` | Error status colour | Yes |
| `--primary-{100-950}` | Theme definition | CVD variants have explicit pairs |
| `--secondary-{100-950}` | Theme definition | CVD variants have explicit pairs |
| `--rainbow-{1-7}-{wash,light,base,dark,deep}` | Rainbow palette files | Separate palettes per CVD |

---

## 10. PRESETS

One-click profiles that set multiple settings at once.

| Preset | What it sets |
|---|---|
| **Dyslexia** | OpenDyslexic font, 110% size, letter-spacing 3, word-spacing 4, line-height 150% |
| **Low Vision** | 150% size, high-contrast theme, enhanced focus |
| **Color Blind** | Deuteranopia theme |
| **Motor** | Enhanced focus, 120% size, reduce motion |
| **Cognitive** | Reduce motion, 110% size, 160% line-height, word alt text, green cognitive level |
| **Easy Read** | Textonly, 120% size, letter-spacing 2, word-spacing 3, 160% line-height, calm theme, descriptive alt text |

### User presets
3 save slots in localStorage. Appear in nav mega menu for quick switching.

---

## 11. GATE INTERACTIONS MATRIX

How features compose — every combination is valid.

| Gate A | Gate B | Interaction |
|---|---|---|
| Focus ring | Highlight links | Focus overrides highlight on `:focus-visible` (hides outline, shows ring) |
| Focus ring | Hover gate | Focus-active kills hover on that element only |
| Focus dim | Hover gate | Dim out = always instant. Dim in speed = hover gate timing |
| Rainbow focus | Hover gate | Ring spin/glow/static varies by mode (see Section 1) |
| Rainbow focus | Highlight links | Complement colour cycling on highlight borders |
| Opacity gate (flat) | Focus ring | Focus ring immune — uses own tokens not shadow tokens |
| Textonly | Focus dim | Dim applies to textonly content blocks |
| Textonly | Hover gate | Tooltip hover-none shows content inline |
| Textonly | Alt text | AAC always shown (informational), decorative hidden |
| Layout (presentation) | Typography | Multiplies: base * text * 1.5 layout |
| Dark mode | Rainbow | Tokens auto-flip via CSS files |
| CVD | Rainbow | Separate palette files gate automatically |
| HC | Focus | Uses actual status colours, not themed |
| Monochrome | Focus | Ash grey / cadet grey (not coloured) |

---

## 12. KEY FILES

| File | What it controls |
|---|---|
| `src/components/YourView/a11y-panel.ts` | All 30 settings, storage, apply logic |
| `src/lib/focus/focus-system.ts` | Keyboard detection, rainbow cycling, colour journey, label |
| `src/styles/gates/focus-gate.css` | All focus visual rules |
| `src/styles/gates/hover-gate.css` | Hover duration tokens |
| `src/styles/gates/opacity-gate.css` | Visual effects gate |
| `src/styles/global/highlight-links.css` | Highlight links rules |
| `src/styles/global/render-modes.css` | Render template visibility |
| `src/styles/global/layout-modes.css` | Layout grid/width |
| `src/styles/global/transitions.css` | Global hover transitions |
| `src/styles/global/aac-mode.css` | AAC symbol visibility |
| `src/styles/textonly/structure.css` | Textonly structural rules |
| `src/styles/textonly/styles.css` | Textonly visual treatments |
| `src/styles/tokens/responsive.css` | Breakpoint token overrides |
| `src/utils/theme-engine.js` | Focus/highlight token generation |

---

## 13. LEGACY CLASSES (to migrate)

These `.a11y-*` classes on `#a11y-content-wrapper` duplicate data attributes. Migrate as encountered:

| Legacy class | Replacement |
|---|---|
| `.a11y-text-only` | `data-render="textonly"` |
| `.a11y-highlight-links` | `data-highlight-links` |
| `.a11y-reduce-motion` | `data-render="reduced"` |
| `.a11y-enhanced-focus` | `data-enhanced-focus` |
| `.a11y-dyslexia-font` | Font family setting |
| `.a11y-theme-{name}` | `data-theme` |
| `.a11y-scrollbar-enhanced` | Scrollbar setting |

---

*Last updated: 2026-03-22*
*Total features: 40+ data attributes, 30 settings, 8 CSS gate files, 6 presets*
