# Canonical Atom Pattern

This is the ONE pattern. Every atom follows it. No exceptions unless documented here.

Reference atoms: **Section**, **Page**, **Grid**, **Badge**, **Text** (all validator-clean)

---

## The Rule

JSON sends enums. CSS classes read global tokens. Themes provide values. That's it.

```
JSON:          { "color": "teal", "variant": "fill", "shape": "pill" }
                    ↓
Astro:         Maps props to class names. No computation. No inline styles.
                    ↓
CSS class:     .badge--teal { --_badge-bg: var(--rainbow-4-wash); }
                    ↓
Theme file:    --rainbow-4-wash: #e0f5f3;
                    ↓
Dark zone:     [data-mode="dark"] .badge--teal { --_badge-bg: var(--rainbow-4-dark); }
                    ↓
Brand CSS:     Can override any --_ token per brand
```

---

## What goes WHERE

### JSON (content pipeline output)
- Enum strings ONLY: "primary", "fill", "pill", "lg", "out"
- Content strings: "Click Me", "Hello World"
- Booleans: true, false
- Numbers: 3 (for columns, levels)
- NEVER: var(--anything), #hex, rgb(), px values, CSS values

### Astro (.astro file)
- Maps props to class:list. That's it.
- No const maps for tokens
- No computed styles
- No inline style={} (except clamp for Text — documented exception)
- No [key: string]: any rest spread
- No token references

```astro
---
const { color, variant, shape, size, separator, separatorWeight } = Astro.props;
---
<div
  class:list={[
    'badge',
    color && `badge--${color}`,
    variant && `badge--${variant}`,
    shape && `badge--${shape}`,
    size && `badge--${size}`,
  ]}
>
  <slot />
</div>
```

### CSS (.css file)
- Internal tokens (--_) set defaults from global scale tokens
- NO fallbacks: `var(--primary-600)` not `var(--badge-bg, var(--primary-600))`
- NO bridge tokens: no `var(--badge-bg)` that pipeline sets
- Colour enum classes override internal tokens
- Variants read internal tokens
- Shadows use global shadow tokens
- Glass uses global glass tokens
- Borders use global border tokens

```css
/* Base — internal tokens default to global scale */
.badge {
  --_badge-bg: var(--primary-200);
  --_badge-border: var(--primary-600);
}

/* Variant reads internal tokens */
.badge--fill {
  background: var(--_badge-bg);
  color: oklch(from var(--_badge-bg) round(1.21 - l) 0 0);
}

/* Colour enum overrides internal tokens */
.badge--teal {
  --_badge-bg: var(--rainbow-4-wash);
  --_badge-border: var(--rainbow-4);
}

/* Shadow uses global token */
.badge--shadow-out { box-shadow: var(--shadow-sm); }

/* Glass uses global tokens */
.badge--glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: var(--border-width) solid var(--glass-border);
}
```

### Schema (.schema.json)
- Every prop has an enum or type constraint
- No "token" type — removed
- No cssProperty field — removed
- Defaults are enum values not token names
- Groups: content, visual, animation, colour (colour group is EMPTY — colour is a visual enum)
- renders: full, reduced, textonly (NO assistive)

```json
{
  "component": "Badge",
  "category": "atom",
  "renders": { "full": "Badge.astro", "reduced": "Badge.astro", "textonly": null },
  "props": {
    "content": {
      "label": { "type": "string", "required": true }
    },
    "visual": {
      "variant": { "type": "string", "default": "fill", "enum": ["fill", "outline", "glass"] },
      "color":   { "type": "string", "default": "primary", "enum": ["primary","secondary","neutral","red","orange","yellow","teal","blue","purple","pink"] },
      "shape":   { "type": "string", "default": "soft", "enum": ["sharp","subtle","soft","rounded","pill"] },
      "size":    { "type": "string", "default": "md", "enum": ["sm","md","lg"] },
      "shadow":  { "type": "string", "default": "none", "enum": ["none","out","in"] }
    },
    "animation": {},
    "colour": {}
  }
}
```

### Dark zone (theme-luminance-dark.css)
- ONLY where dark mode needs a DIFFERENT scale position
- Not for values that the scale flip handles
- Override internal tokens only

```css
[data-mode="dark"] .badge--primary.badge--fill {
  --_badge-bg: var(--primary-300);
  --_badge-border: var(--primary-700);
}
```

### HC zone (high-contrast.css)
- ONLY for stripping decorative effects
- Not for colour changes — HC theme provides correct values

```css
[data-high-contrast] .badge--glass {
  backdrop-filter: none;
  background: var(--_badge-bg);
}
```

### Brand override (brand-overrides.css)
- Manual per brand
- Overrides internal tokens for brand-specific presentation
- Loads after theme, wins via cascade

```css
/* Brand wants all badges to use secondary by default */
.badge {
  --_badge-bg: var(--secondary-200);
  --_badge-border: var(--secondary-600);
}
```

---

## What MUST NOT exist in component CSS (target state after moves)

These rules belong in global/gate/zone files, not component CSS. Move them first, verify, then confirm component CSS is clean:

### In component CSS:
- NO var(--component-name, var(--fallback)) — no bridge tokens with fallbacks
- NO var(--component-name) bridge tokens at all — only --_ internal tokens
- NO hardcoded px for visual values — use tokens (exceptions: 0, 1px borders)
- NO hardcoded hex colours
- NO hardcoded opacity — use --opacity-* tokens
- NO hardcoded durations — use --duration-* tokens  
- NO hardcoded easing — use --ease-* tokens
- NO per-component transition rules — moved to transitions.css
- NO per-component focus rules — moved to focus-gate.css
- NO per-component highlight-links rules — moved to highlight-links.css
- NO zone/gate rules — moved to their correct gate/zone file

---

## CRITICAL: Move, never delete

Zone/gate rules found in component CSS get MOVED to the correct file, never deleted:

| Found in component | Move to | Why |
|---|---|---|
| [data-mode="dark"] rules | theme-luminance-dark.css | All dark overrides in one place |
| [data-high-contrast] rules | high-contrast.css | All HC overrides in one place |
| [data-hover="none/instant/gentle"] rules | hover-gate.css OR stays if variant-specific | Hover gating in one place |
| [data-render="reduced"] rules | motion-gate.css | Motion gating in one place |
| [data-render="textonly"] rules | textonly/structure.css or textonly/styles.css | Textonly in one place |
| [data-render="assistive"] rules | assistive-gate.css | Assistive gating in one place |
| [data-highlight-links] rules | highlight-links.css | Highlight in one place |
| transition: rules | transitions.css | All transitions in one place |
| :focus-visible rules | focus-gate.css | All focus in one place |

Once all rules are in the correct files, duplicates and moot rules become visible. THEN we can clean up what's redundant. Not before.

---

## Global Tokens

### --color-Text / --color-Text-contrast
Generated per theme by `theme-engine.js`. Every atom that renders text on the page background uses `--color-Text` as its default colour.

```css
--color-Text: var(--neutral-700);           /* dark text on light bg */
--color-Text-contrast: var(--page-bg);      /* light text on dark bg — buttons use oklch instead */
```

Atoms with their own background (Badge fill, Button fill, Card) compute contrast internally via `oklch()` — they don't use `--color-Text`.

Heading and Text schemas have `"default"` as the first colour enum option. When `color="default"`, no colour class is emitted — the base CSS applies `--color-Text`.

### --nav-height
Set by GlassNav-base.css on `:root`. Page atom reads it for `padding-top` to clear the fixed navbar.

### Shared text-highlight (global/text-highlight.css)
Used by Text and Heading atoms. Four enums:
- **Height**: sm (30%), md (45%), lg (75%), full (100%)
- **Opacity**: faint, soft, bold
- **Shape**: sharp, rounded
- **Colour**: 10 variants (primary through pink)

Classes: `.text-highlight`, `.text-highlight--{colour}`, `.text-highlight--{height}`, `.text-highlight--{opacity}`, `.text-highlight--{shape}`

### Alt text display modes (gates/alt-text-gate.css)
Five display modes controlled by `data-alt-display-mode` on `<html>`/`<body>`:

| Mode | What it does |
|---|---|
| `hidden` | Nothing shown (default) — screen readers still read img alt |
| `subtitle` | FigCaption bottom bar (was "overlay") |
| `tooltip` | Hover/focus shows FigCaption popup |
| `inline` | Thumbnail + alt text side by side (stacks on mobile) |
| `enlarge` | Click to enlarge modal |

Deleted modes: `caption`, `overlay` (renamed to subtitle), `replace`, old `subtitle` (image shrink).

Alt text indicator (`?` badge) shows on subtitle, tooltip, enlarge — only on images with alt text spans (`:has()` gated). Black circle, white ring, consistent position bottom-right.

### Image maskShape (Asset Library API)
`maskShape` prop fetches SVG shapes from Cloudflare Asset Library (same API as icons). Slugs: `shape-001` to `shape-072`. Old hardcoded `/masks/*.svg` paths removed.

---

## Render Modes

Three render modes. All exist on every page. Same HTML. CSS gates switch between them. User toggles in Your View — instant swap, no reload, no Worker call.

| Mode | What renders | What doesn't |
|---|---|---|
| Full | Everything — animated, visual, coloured | Nothing hidden |
| Reduced | Static fallback — visual + colour but NO animation, NO motion, shows completed/frozen state | Animation, motion, scroll effects |
| Textonly | Information only — text content, no visuals, no animation, no static fallbacks | Animation, static fallbacks, decorative visuals, colours |

### The key distinction:

```
Full:     Lottie breathing animation plays
Reduced:  Static Phosphor icon shown (fallbackIcon from schema)
Textonly: Static Phosphor icon shown IF informational, hidden if decorative
```

```
Full:     Rainbow border spins
Reduced:  Rainbow border frozen as static gradient (still colourful)
Textonly: No border, no gradient, just content inside
```

```
Full:     Scroll reveal fades sections in
Reduced:  All sections visible immediately (no reveal, all present)
Textonly: Sections visible as plain text blocks
```

### Schema groups map to render layers:

| Schema group | Full | Reduced | Textonly |
|---|---|---|---|
| content | ✅ renders | ✅ renders | ✅ renders |
| visual | ✅ renders | ✅ renders (static) | ❌ hidden |
| animation | ✅ renders | ❌ shows static fallback | ❌ hidden |
| colour | ✅ renders | ✅ renders | ❌ hidden |

### Informational vs decorative in textonly:

Textonly hides everything except informational content:

| Content | Purpose | Textonly |
|---|---|---|
| Heading text | Informational | ✅ shows |
| Body text | Informational | ✅ shows |
| Link text | Informational | ✅ shows |
| Form field | Informational | ✅ shows |
| AAC pictograms | Informational | ✅ shows (always) |
| Image (decorative) | Decorative | ❌ hidden |
| Image (informational) | Informational | ✅ shows |
| Badge | Informational | ✅ shows (plain text) |
| Lottie animation (decorative) | Decorative | ❌ hidden |
| Lottie (informational) | Informational | ✅ shows static Phosphor icon (fallbackIcon) |
| Card background | Decorative | ❌ hidden |
| Glass/shadow/glow | Decorative | ❌ hidden |
| Rainbow border | Decorative | ❌ hidden |

### How it works:
- All HTML exists in the DOM at build time
- data-render attribute on body switches visibility
- CSS gates show/hide based on schema groups
- Components render everything they receive — CSS decides what's visible

---

## Gate Files — Complete List

Every gate file and what it contains:

```
src/styles/gates/
  hover-gate.css         ← hover speed tokens + variant-specific hover suppression
  motion-gate.css        ← CSS animation freeze + reduced static states per component
  visual-gate.css        ← full/solid/flat shadow/glass/glow control
  focus-gate.css         ← double box-shadow ring, forced-colors fallback
  assistive-gate.css     ← enlarged targets, thick borders, simplified layouts
  layout-modes.css       ← single/reading/presentation column modes
  workbook-gate.css      ← workbook print chrome: numbering, write spaces, page breaks

src/styles/global/
  transitions.css        ← global hover transitions on all interactive elements
  highlight-links.css    ← underline for inline links, border for blocks
  focus-visible.css      ← (merged into focus-gate.css)

src/styles/zones/
  theme-luminance-dark.css  ← dark mode token overrides per component
  high-contrast.css         ← HC decorative effect stripping per component

src/styles/textonly/
  structure.css          ← layout changes for textonly (show/hide, single column)
  styles.css             ← visual treatment for textonly content (borders, spacing)
```

### motion-gate.css — Reduced shows COMPLETED state

Reduced does NOT just pause animation. It shows the finished result. Every animated component needs a static state rule:

```css
/* Scroll reveal — all visible immediately */
[data-render="reduced"] [data-scroll-reveal] {
  opacity: 1;
  transform: none;
  visibility: visible;
}

/* Parallax — flat, all layers visible */
[data-render="reduced"] [data-parallax] {
  position: static;
  transform: none;
}

/* Accordion — all panels open */
[data-render="reduced"] .accordion__content {
  display: block;
  max-height: none;
}

/* Counter — shows final number, no roll-up */
/* Timeline — all steps visible */
/* Typewriter — full text shown */
/* Lottie — JS gate shows final frame */
```

**Component routing — NOT CSS override:**

Some components can't show a "static version" — showing both faces of a quiz card ruins the quiz. These use schema `renders` block to route to a different component entirely:

```json
{
  "component": "FlipCard",
  "renders": {
    "full": "FlipCard.astro",
    "reduced": "CardReveal.astro",
    "textonly": "CardReveal.astro"
  }
}
```

Same content, different component. CardReveal has click-to-reveal without 3D animation. The quiz still works. No CSS override needed because FlipCard never renders in reduced/textonly.

| Approach | When to use |
|---|---|
| CSS static state in motion-gate | Animation is decorative — showing completed state is fine |
| Component routing via renders | Animation is functional — static state breaks the feature |

### Print mode — see workbook-gate section

Reveal content (quiz answers, hidden card backs) that is informational goes to a separate answer section at end of printed document, or a separate document entirely. See workbook-gate.css + workbook-builder.js section for full details.

Screen always has everything — interaction gates reveal content. Print is a separate output filtered by `printOutput` enum in JSON.

Each component's static state goes here. Not in component CSS. All in one file so you can see the full reduced experience.

### JS animation gate (src/lib/animation/gate.ts)

JS animations (GSAP, Lottie, ScrollDraw) check the gate before running:

```js
export function getMotion(): 'full' | 'gentle' | 'still' | 'none' {
  const render = document.body.dataset.render;
  if (render === 'textonly') return 'none';
  if (render === 'reduced') return 'still';
  
  const motion = document.body.dataset.motion;
  return motion || 'full';
}
```

| Return | JS does |
|---|---|
| full | Play animation normally |
| gentle | Play at half speed |
| still | Show final frame / completed state |
| none | Show plain fallback or nothing |

### assistive-gate.css

Assistive is a preset that toggles multiple attributes. But some rules are unique to assistive and don't come from other gates:

```css
[data-assistive] {
  --min-target: 64px;
  --border-width: 2px;
  --focus-thickness: 0.3rem;
}

/* Component-specific assistive rules — moved from component CSS */
[data-assistive] .badge { font-size: var(--text-body); padding: var(--space-md); }
[data-assistive] .tooltip { /* inline instead of floating */ }
[data-assistive] .form-field { /* larger controls */ }
/* etc — every [data-render="assistive"] rule from components moves here */
```

### textonly files

Textonly is CSS-gated, not Worker-filtered. All HTML exists. CSS shows/hides:

```css
/* textonly/structure.css — layout changes */
[data-render="textonly"] .badge--glass { backdrop-filter: none; }
[data-render="textonly"] .image--decorative { display: none; }
[data-render="textonly"] { --grid-columns: 1; }

/* textonly/styles.css — visual treatment for visible content */
[data-render="textonly"] .card { border: var(--border-width) solid var(--neutral-300); }
[data-render="textonly"] .badge { background: transparent; border: var(--border-width) solid currentColor; }
```

### workbook-gate.css + workbook-builder.js

Print renders in the browser. No PDFs stored. No server processing. Same JSON, rendered as textonly content with workbook chrome on top.

**Screen and print are completely separate outputs from the same JSON:**

| Output | Built by | Contains | Stored |
|---|---|---|---|
| Screen | Astro build | Full interactive page, all render modes | Static HTML on Cloudflare |
| Print | Browser on demand | Textonly content + workbook chrome | Nothing — renders and prints |

**Print options (in Your View panel):**

```
Print:
  ○ Workbook only
  ○ Workbook + answers at end
  ○ Answers only
  ○ Facilitator pack (workbook + answers + facilitator pages)
  
  [Print]  [Download PDF]
```

User picks → JS sets `data-workbook` + option → CSS renders → browser print dialog. Zero server calls.

**JSON marks content with `printOutput`:**

```json
{
  "component": "Section",
  "children": [
    {
      "component": "Heading",
      "text": "What are your core values?"
    },
    {
      "component": "FlipCard",
      "ref": "Q1",
      "front": { "text": "Write down three things that matter most" },
      "back": {
        "text": "Common patterns include safety, connection, and purpose.",
        "printOutput": "answer"
      }
    },
    {
      "component": "Text",
      "text": "Allow 15 minutes. Watch for emotional responses.",
      "printOutput": "facilitator"
    }
  ]
}
```

**The `printOutput` enum:**

| Value | Screen | Workbook print | Answer print | Facilitator print |
|---|---|---|---|---|
| (none/default) | Visible | ✅ | ✅ | ✅ |
| `learner` | Visible | ✅ | ❌ | ✅ |
| `answer` | Behind reveal (click to show) | ❌ inline, collected at end | ✅ | ✅ |
| `facilitator` | Login gated | ❌ | ❌ | ✅ extra pages |

Screen always has everything — interaction gates it (click to reveal). Print output is filtered.

Each level is additive:
- Workbook = all + learner
- Answers = collected answer content with ref numbers
- Facilitator = workbook + answers + facilitator pages on top

**CSS workbook chrome:**

```css
/* workbook-gate.css */

[data-workbook] {
  counter-reset: workbook-question;
}

/* Auto-numbering */
[data-workbook] .form-field {
  counter-increment: workbook-question;
}

[data-workbook] .form-field::before {
  content: "Q" counter(workbook-question) ". ";
  font-weight: var(--font-bold);
}

/* Write spaces */
[data-workbook] .form-field__input,
[data-workbook] textarea {
  border: var(--border-width) solid var(--neutral-400);
  min-height: 4rem;
  background: transparent;
}

/* Print page handling */
@media print {
  [data-workbook] {
    padding: 2cm;
  }

  [data-workbook] .section-atom {
    page-break-inside: avoid;
  }

  [data-workbook] .section-atom + .section-atom {
    page-break-before: always;
  }
}
```

**JS content collection (src/lib/print/workbook-builder.js):**

```js
function buildPrintDocument(json, options) {
  const { includeAnswers, includeFacilitator } = options;
  
  // Workbook — always included
  const workbook = collectByOutput(json, ['all', 'learner']);
  
  // Answers — collected with ref IDs
  const answers = includeAnswers 
    ? collectByOutput(json, ['answer']) 
    : [];
  
  // Facilitator — extra pages
  const facilitator = includeFacilitator
    ? collectByOutput(json, ['facilitator'])
    : [];
  
  return { workbook, answers, facilitator };
}
```

**Answer section at end of printed document:**

```
  ─────────────────────────
  Answers & Reveal Content
  
  Q1: Common patterns include safety, 
      connection, and purpose.
  
  Q3: Look for places where you feel 
      drained or resentful.
```

Ref numbers tie answers back to questions. Learner can cross-reference.

**For CPD accreditation:** Same JSON source produces learner workbook AND facilitator marking guide. Provably identical content. Assessors see one source, two outputs.

---

## Container Hierarchy

Every page is a nesting of container atoms. Each level owns ONE concern:

```
Layout (BaseLayout.astro)
  ├── Nav organism (composed of atoms: Link, Icon, Button, Badge)
  ├── Page atom
  │     └── Section atom
  │           ├── Heading atom
  │           ├── Grid atom
  │           │     ├── Card atom
  │           │     │     ├── Heading atom
  │           │     │     ├── Text atom
  │           │     │     └── Button atom
  │           │     └── Card atom
  │           │           └── ...
  │           └── Text atom
  └── Footer organism (composed of atoms: Link, Icon, Text, Image)
```

### What each level owns:

| Container | Owns | Doesn't own |
|---|---|---|
| Layout | HTML head, body data attributes, scripts, gate loading | Content, spacing, navigation design |
| Nav (organism) | Navigation links, mega menu, Your View trigger, preset buttons, hamburger | Page content |
| Footer (organism) | Brand logo, copyright, footer links, social links | Page content |
| Page | Page background, page margin, gap between sections, nav clearance (--nav-height) | Nav, footer, what's inside sections |
| Section | Container max-width, section background, colour zone, separator, gap between children, data-scroll-bg for colour journey | Page margin, child internal layout |
| Grid | Columns, grid gap, grid layout (masonry, auto-fit, fixed) | Container width, background |
| Card | Internal padding, radius, shadow, border, card background | Grid position, outer spacing |
| Atoms (Heading, Text, Badge, Button, Link, List, Icon, Image) | Own content rendering | Spacing around themselves |

### Page atom

Technical shell is Layout. Content structure is Page:

```json
{
  "component": "Page",
  "margin": "comfortable",
  "gap": "2xl",
  "children": [
    { "component": "Section", ... },
    { "component": "Section", ... }
  ]
}
```

```css
.page {
  background: var(--page-bg);
  padding-left: var(--page-margin);
  padding-right: var(--page-margin);
}
```

Page margin enum:

| Value | Token | Size |
|---|---|---|
| compact | --page-margin-compact | 1rem (16px) |
| comfortable | --page-margin-comfortable | 2rem (32px) |
| spacious | --page-margin-spacious | 4rem (64px) |

### Section atom

Pure container. Colour zone. No content rendering:

```json
{
  "component": "Section",
  "color": "teal",
  "bg": "tint",
  "container": "lg",
  "gap": "lg",
  "separator": true,
  "separatorWeight": "medium",
  "children": [
    { "component": "Heading", "level": 2, "text": "Resources", "color": "teal" },
    { "component": "Grid", "columns": 3, "gap": "md", "children": [...] }
  ]
}
```

Section owns:
- Container max-width (via container enum → existing --container-* tokens)
- Background colour (via color enum → colour context classes)
- Separator (via separator + separatorWeight enums)
- Gap between children (via gap enum → spacing tokens)
- Colour zone (data-scroll-bg for GSAP colour journey)

Section does NOT own:
- Labels or headings (Heading atom as child)
- Page margin (Page atom handles)
- Space between sections (Page atom or global --space-section handles)

### Grid atom

Column layout inside Section:

```json
{
  "component": "Grid",
  "columns": 3,
  "gap": "md",
  "variant": "auto-fit",
  "children": [
    { "component": "Card", ... },
    { "component": "Card", ... },
    { "component": "Card", ... }
  ]
}
```

Grid owns:
- Number of columns
- Gap between items
- Layout variant (fixed, inline, auto-fit, auto-fill, masonry)
- Alignment (start, center, end, stretch)
- Gallery modes (showcase, product) — animation prop
- Column/row spanning utilities

Grid responds to:
- `--grid-columns: 1` from mobile breakpoint, textonly, or single column layout
- Container width determines how many columns actually fit

### Card atom

Container for grouped content:

```json
{
  "component": "Card",
  "variant": "elevated",
  "shape": "rounded",
  "color": "primary",
  "children": [
    { "component": "Image", "src": "...", "purpose": "decorative" },
    { "component": "Heading", "level": 3, "text": "My Tool" },
    { "component": "Text", "text": "Description here" },
    { "component": "Button", "label": "Learn more", "variant": "outline" }
  ]
}
```

Card owns:
- Internal padding
- Background, border, shadow, radius
- Hover effects (lift, glow, border)

### Nesting rule:

Containers nest. Content atoms don't contain other containers:

```
✅ Section → Grid → Card → Heading
✅ Section → Grid → Card → Badge
✅ Section → Heading (direct child, no grid needed)
✅ Section → Text (direct child)

❌ Badge → Card (atom containing container)
❌ Heading → Section (atom containing container)
❌ Text → Grid (atom containing container)
```

Exception: Card can contain other atoms because it IS a content container. But Card doesn't contain Section or Grid — it's a leaf container.

### JSON structure:

```json
{
  "component": "Page",
  "margin": "comfortable",
  "children": [
    {
      "component": "Section",
      "color": "teal",
      "container": "lg",
      "gap": "xl",
      "separator": true,
      "children": [
        { "component": "Heading", "level": 2, "text": "Our Services", "color": "teal" },
        {
          "component": "Grid",
          "columns": 3,
          "gap": "md",
          "children": [
            {
              "component": "Card",
              "variant": "elevated",
              "children": [
                { "component": "Heading", "level": 3, "text": "Counselling" },
                { "component": "Text", "text": "One-to-one support..." },
                { "component": "Button", "label": "Book now", "context": "primary" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

All enums. Every level owns one concern. Zero CSS in JSON. Worker validates nesting rules from schemas.

---

## Responsive

### One token controls scaling: `--base-font-pct`

Everything is `rem`. Text, spacing, padding, margins all scale proportionally from one root value. Breakpoints set the base. Your View text slider multiplies against it.

```css
html {
  font-size: calc(var(--base-font-pct) * var(--text-multiplier, 1) * var(--layout-multiplier, 1));
}
```

### Breakpoints set the base:

| Breakpoint | --base-font-pct | Effective size |
|---|---|---|
| Ultra (2560px+) | 125% | 20px |
| Large (1920px+) | 112.5% | 18px |
| Desktop (1024px+) | 100% | 16px |
| Tablet (768px) | 93.75% | 15px |
| Mobile (480px) | 87.5% | 14px |
| Small (300px) | 80% | ~13px |
| Micro (200px) | 75% | 12px |

### Your View text slider multiplies against the base:

```
User sets XL (150%) on desktop:  100% × 1.5 = 150%  → 24px
User sets XL (150%) on mobile:   87.5% × 1.5 = 131% → ~21px
User sets XL (150%) on micro:    75% × 1.5 = 112.5% → 18px
```

XL on mobile doesn't produce desktop-sized text. It produces proportionally larger mobile text. Responsive and accessibility scale TOGETHER.

### What rem scaling handles (NO per-component rules needed):
- Typography — all heading/body/fine sizes
- Spacing — padding, margins, gaps
- Button sizing — padding, min-height
- Badge sizing — padding, font-size
- Card padding
- List indent
- Icon sizes (when using em/rem)

### What STILL needs breakpoint rules (per-component .responsive.css):
- **Layout changes** — flex-direction: row → column
- **Grid collapse** — 3 columns → 1 column
- **Element visibility** — hide image at tiny sizes
- **Structural changes** — nav → hamburger, stacked cards
- **Display sizes** — `--text-display` hero headings step down

### Responsive file rules:

Every atom CAN have a `.responsive.css` file. But it ONLY contains layout/visibility rules, never typography/spacing:

```css
/* CORRECT — layout change */
@media (max-width: 480px) {
  .author-card { flex-direction: column; }
}

/* CORRECT — visibility change */
@media (max-width: 200px) {
  .blog-card__image { display: none; }
}

/* WRONG — rem scaling handles this */
@media (max-width: 480px) {
  .badge { font-size: var(--text-fine); }
}

/* WRONG — rem scaling handles this */
@media (max-width: 768px) {
  .heading--h1 { font-size: var(--text-h2); }
}
```

### Global responsive file (src/styles/gates/responsive.css):

Sets `--base-font-pct` per breakpoint. Also handles global layout triggers:

```css
@media (max-width: 480px) {
  :root { --grid-columns: 1; }
}

@media (max-width: 300px) {
  .heading, .text, .link, .badge {
    word-break: break-word;
    hyphens: auto;
  }
}
```

### Single column — three triggers:

```css
@media (max-width: 480px)        { :root { --grid-columns: 1; } }
[data-render="textonly"]         { --grid-columns: 1; }
[data-layout="single"]          { --grid-columns: 1; }
```

### Wide screen / presentation:

```css
@media (min-width: 1920px) { :root { --base-font-pct: 112.5%; } }
@media (min-width: 2560px) { :root { --base-font-pct: 125%; } }

[data-layout="presentation"] {
  --grid-columns: 1;
  --layout-multiplier: 1.5;
}
```

### Icon scaling:
- Icon atom default (no size prop) → CSS `1.25em` → scales with parent text
- Parent component passes size → should pass em value (e.g. `size="1.5em"`) → scales with parent
- Standalone fixed icon → pass px value (e.g. `size="24px"`) → doesn't scale
- The rule: if the icon is INSIDE a component (button, badge, heading, card), size is always em so it responds to rem scaling and text size changes
- Only nav icons, toolbar icons, logo marks use fixed px

| Context | Size value | Scales with | Example |
|---|---|---|---|
| Inside button | `1.25em` (default) | Button text size | Button icon grows when text grows |
| Inside badge | `1.1em` (badge sets) | Badge text size | Badge icon matches label |
| Inside heading | `1em` or omitted | Heading text size | Heading icon matches heading |
| Inside card | `1.5em` (card sets) | Card text size | Card icon proportional |
| Nav toolbar | `24px` | Nothing — fixed | Always same size |
| Logo mark | `32px` | Nothing — fixed | Brand identity, never changes |

LottieIcon follows the same rule:
- Inside a component → size in em → responsive
- Standalone decorative → size in px → fixed
- Current inline style `width: ${size}px` is WRONG when used inside components
- Should check if size includes a unit — if bare number, append px for standalone. If em value, use as-is.

### Typography tokens (correct values):

```css
--text-h1:         3rem;       /* 48px at 100% */
--text-h2:         2rem;       /* 32px */
--text-h3:         1.5rem;     /* 24px */
--text-h4:         1.25rem;    /* 20px */
--text-h5:         1.125rem;   /* 18px */
--text-body:       1rem;       /* 16px */
--text-small:      0.875rem;   /* 14px */
--text-fine:       0.75rem;    /* 12px */
--text-veryfine:   0.625rem;   /* 10px */

/* Display sizes — hero/splash, DO need breakpoint overrides */
--text-display:    5rem;       /* 80px */
--text-display-xl: 10rem;      /* 160px */
```

### Spacing tokens:
Spacing grows WITH text when user increases font size. This is correct — people who need bigger text need more breathing room too. Same proportions at every size.

### Border radius stays px:
Radius doesn't scale with text. A pill button stays pill at every size. `border-radius: 9999px` not `border-radius: var(--some-rem-value)`.

### Per-atom responsive summary:

| Atom | Needs .responsive.css | Why |
|---|---|---|
| Section | No | Rem handles padding. Container enum handles width. |
| Heading | Maybe | Only if media icons need max-width at small sizes |
| Text | No | Rem handles everything |
| Badge | Maybe | Only if icon+text needs stacking at tiny sizes |
| Button | Maybe | Only if variant-specific layout changes needed |
| Card | Maybe | Only if masonry margins need specific values |
| FormField | Yes | Card-select grid collapse, control layout changes |
| Icon | No | Em default scales with parent. Standalone px is intentional. |
| Image | Maybe | Only if radius flattens at tiny sizes (design choice) |
| Link | No | Rem handles everything |
| List | Maybe | Only if inline list needs stacking |
| LottieIcon | No | Em when inside components, px only standalone. No responsive needed. |
| TextEffect | No | Rem handles everything |
| Tooltip | Yes | Needs to hide floating, show inline at mobile |
| Toast | Yes | Needs to go full-width at mobile |

### In Astro:
- NO const maps (gapMap, sizeMap, colourMap)
- NO style={computedStyle}
- NO inline token computation
- NO [key: string]: any rest spread
- NO data-${string} arbitrary attributes

### In JSON:
- NO var(--anything)
- NO #hex values
- NO rgb/rgba/hsl values
- NO px/rem values
- NO CSS property values
- ONLY enum strings, content strings, booleans, numbers

### In schema:
- NO "type": "token"
- NO "cssProperty" field
- NO "assistive" in renders
- NO defaults that are token names ("default": "neutral-400")
- Defaults are enum values ("default": "primary")

---

## The 10 colour enums (every coloured atom uses all 10)

| Enum | Background token | Border/accent token |
|---|---|---|
| primary | var(--primary-200) | var(--primary-600) |
| secondary | var(--secondary-200) | var(--secondary-600) |
| neutral | var(--neutral-200) | var(--neutral-600) |
| red | var(--rainbow-1-wash) | var(--rainbow-1) |
| orange | var(--rainbow-2-wash) | var(--rainbow-2) |
| yellow | var(--rainbow-3-wash) | var(--rainbow-3) |
| teal | var(--rainbow-4-wash) | var(--rainbow-4) |
| blue | var(--rainbow-5-wash) | var(--rainbow-5) |
| purple | var(--rainbow-6-wash) | var(--rainbow-6) |
| pink | var(--rainbow-7-wash) | var(--rainbow-7) |

Not every atom uses background + border. Some only need accent colour. But the enum is always the same 10 values.

---

## Exceptions (documented, intentional)

| Atom | Exception | Why |
|---|---|---|
| Text | Inline style for --text-clamp | CSS can't set clamp from class alone |
| Icon | Standalone size prop → inline px | Fixed size for nav/toolbar only. Inside components: em default, no prop needed |
| LottieIcon | Standalone size prop → inline px | Same as Icon. Inside components should use em |
| Button | [data-hover="none"] rules in component | 22 variant-specific hover suppressions too specific for global |
| Link | [data-focus-active] rules in component | Strip effects on focus — unique to link animations |
| FormField | Sibling focus selectors | Hidden input → visible element pattern |
| Image | Textonly AAC rules in component | AAC display switching unique to Image |
| Icon | Hover-triggered animation | Spin/pulse/bounce only on hover — unique |

Everything else follows the canonical pattern. No exceptions.

---

## Per-atom delta from canonical

Based on the audit, what each atom needs to reach canonical:

### Section ✅ CLEAN (reference atom)
- Strip: nothing
- Add: nothing (maybe --space-section token if not global)

### Heading 🔧
- Strip: 6 fallbacks, 9 bridge tokens
- Keep: 6 internal tokens, 10 colour enums, 4 dark zone rules, 3 hardcoded px (media sizes → tokens)

### Text 🔧
- Strip: rest spread
- Keep: inline clamp style (documented exception), 10 colour enums
- Add: nothing

### Badge 🔧
- Strip: 3 fallbacks, 5 bridge tokens, 1 assistive rule, 2 hardcoded px
- Move: assistive rule → delete (preset handles)
- Keep: 2 internal tokens, 10 colour enums, 24 dark zone rules, 1 HC rule
- Fix: glass variants use global tokens not badge-specific

### Button 🔧🔧🔧 (biggest job)
- Strip: 47 fallbacks, 19+ bridge tokens, 35+ hardcoded px, rest spread
- Move: 0 (hover rules stay — too variant-specific for global)
- Keep: 8 internal tokens, 50 dark zone rules, 13 HC rules
- Add: 7 more colour enums (currently only 3)
- Fix: button-specific bridge tokens → internal tokens reading global scale

### Card 🔧🔧
- Strip: 27 fallbacks, 2 assistive rules, 13 hardcoded px
- Add: internal tokens (currently 0 — all bridge), 10 colour enums
- Keep: 6 dark zone rules, 3 HC rules

### FormField 🔧🔧🔧
- Strip: 12+ fallbacks, 1 bridge token, 21 assistive rules, 9 hardcoded px
- Move: assistive rules → delete (preset handles)
- Keep: 12+ internal tokens (correct pattern), 9 colour enums, 33 dark rules, 23 HC rules
- Add: primary colour enum (missing)
- Fix: missing primary from colour enums

### Icon 🔧
- Strip: 5 fallbacks, 2 hardcoded px
- Add: 10 colour enums
- Fix: hover animations need [data-hover] gating, [data-render="reduced"] gating

### Image 🔧
- Strip: fallbacks, 2 assistive rules, 8 hardcoded px
- Keep: 3 internal tokens, 10 colour enums, textonly AAC rules (exception), 3 dark rules, 2 HC rules

### Link 🔧🔧
- Strip: 8 fallbacks, 8 bridge tokens, 9 hardcoded px
- Keep: 7 internal tokens, 10 colour enums, 8 dark rules, focus-active rules (exception)
- Fix: transitions → check if global handles or unique

### List 🔧
- Strip: 3 fallbacks, 6 assistive rules, rest spread, 2 hardcoded px (media query)
- Move: assistive rules → delete
- Keep: 3 internal tokens, 10 colour enums

### LottieIcon 🔧
- Strip: rest spread, inline style
- Fix: inline px style is documented exception but check if class can work
- Keep: render mode rules (correct — show/hide animation vs static)

### TextEffect 🔧🔧
- Strip: rest spread, inline styles, animation keyframes (move to effect)
- Add: schema, 10 colour enums, internal tokens
- Fix: everything — least complete atom

### Tooltip 🔧
- Strip: 4 fallbacks, 3 assistive rules, 2 hardcoded px
- Move: assistive rules → delete
- Add: 10 colour enums
- Keep: 6 internal tokens, 2 dark rules, 3 HC rules
- Fix: inline transition in Astro → CSS

---

## Priority order for cleanup

1. Section ✅ already clean — verify and lock
2. Heading — small delta, reference for content atoms
3. Text — almost clean, strip rest spread
4. Badge — small delta, reference for coloured atoms
5. List — small delta
6. Icon — small delta + add colour enums
7. Image — medium delta
8. Link — medium delta
9. Tooltip — medium delta
10. LottieIcon — small but unique
11. TextEffect — needs everything
12. Card — medium-large delta
13. FormField — large delta
14. Button — largest delta

Lock each one before moving to the next. Do not skip ahead.
