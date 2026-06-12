> ⚠️ **SUPERSEDED (2026-06-12)** — historical record only. Do NOT treat as current truth.
> Current rules live in `atom-spec-v0.3.md`. Last verified accurate: March 2026.

# Canonical Atom Pattern

This is the ONE pattern. Every atom follows it. No exceptions unless documented here.

Reference atoms: **Grid**, **Page**, **Heading** (all validator-clean). Section, Badge, Text need minor schema updates (colour group, default enum).

---

## The Rule

JSON sends enums. CSS classes read global tokens. Themes provide values. That's it.

### Schema enforcement — three layers, nothing gets through

| Layer | When | What it catches | File |
|---|---|---|---|
| **Build-time validator** | `node validate-atoms.cjs` | Schema structure, CSS violations, missing enums | `scripts/validate-atoms.cjs` |
| **Test JSON validator** | `node validate-test-json.cjs` | Props not in schema, enum violations, CSS values in JSON | `scripts/validate-test-json.cjs` |
| **Runtime validator** | Cloudflare Worker before render | Unknown props stripped, enum violations rejected, CSS values blocked | `src/lib/schema-validator.ts` |

The schema is the contract. The worker calls `validateComponent()` before rendering — any prop not in the schema is stripped, any value not in the enum is rejected. No freeform CSS can reach the renderer. Content that fails validation gets the component's default state, not a broken page.

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
      "color":   { "type": "string", "default": "default", "enum": ["default","primary","secondary","neutral","red","orange","yellow","teal","blue","purple","pink"] },
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
- NO @layer wrappers
- NO !important declarations
- NO @media (prefers-reduced-motion) — pipeline handles this via data attributes
- NO .a11y-* class selectors — legacy, replaced by data attributes
- NO #a11y-content-wrapper references — dead
- NO per-component transition rules — moved to transitions.css
- NO per-component :focus-visible rules — moved to focus-gate.css
- NO per-component :hover rules — moved to hover-gate.css (exceptions: Button, Link, Icon)
- NO per-component highlight-links rules — moved to highlight-links.css
- NO zone/gate rules — moved to their correct gate/zone file
- NO @keyframes in component CSS — moved to micro-animations.css for global gating
- NO `animation:` shorthand with hardcoded values — use var(--duration-*) / var(--ease-*) tokens
- `animation: none` IS allowed — it's the gating (explicitly disabling motion)

### In component Astro:
- NO :global() selectors — use external CSS file
- NO scoped `<style>` blocks — use external CSS file
- NO static imports of animation libraries (gsap, lottie-web, matter-js)
- Animation libraries must be dynamic-imported AFTER checking getMotion() gate
- NO prefersReducedMotion() — legacy, use getMotion() from gate.ts

---

## CRITICAL: Move, never delete

Zone/gate rules found in component CSS get MOVED to the correct file, never deleted:

| Found in component | Move to | Why |
|---|---|---|
| [data-mode="dark"] rules | theme-luminance-dark.css | All dark overrides in one place |
| [data-high-contrast] rules | high-contrast.css | All HC overrides in one place |
| [data-hover] rules | hover-gate.css OR stays if variant-specific | Hover gating in one place |
| [data-render="reduced"] rules | reduced-gate.css | Motion gating in one place |
| :hover rules | hover-gate.css OR stays if variant-specific | Hover gating in one place |
| :focus-visible rules | focus-gate.css OR stays if variant-specific | Focus gating in one place |
| @keyframes | micro-animations.css | Global animation gating in one place |
| animation: (hardcoded values) | Use var(--duration-*) / var(--ease-*) tokens | Token gating enables global kill |
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

### Micro-animations (global/micro-animations.css)
30+ reusable animation presets. Any atom can use via `.anim--{name}` class or `animation` enum prop.

**Categories:**
- **Movement**: spin, bounce, shake, float, drift, slide-up/down/left/right, flip
- **Scale**: pulse, ping, pop, squish, heartbeat, rubber-band
- **Opacity**: fade, blink, flash, glint, shimmer, twinkle
- **Rotation**: wiggle, swing, rock, nod
- **Compound**: attention, celebrate, enter, exit

All hover-triggered. Duration tokens from `motion.css`. Easing via `--ease-expo-out` for smooth organic feel.

Icon atom uses `animation` enum prop → emits `.anim--{name}` class. Legacy `spin`/`pulse`/`bounce` boolean props still work.

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
  hover-gate.css         ← hover transitions: full, gentle, instant, none. Owns --hover-duration-* only
  motion-gate.css        ← animation speed: full, gentle, none. Owns --duration-* tokens. THE kill switch
  reduced-gate.css       ← render mode static states per component (data-render="reduced")
  opacity-gate.css       ← visual effects: full, solid, flat. Owns shadow/glass/glow tokens
  focus-gate.css         ← double box-shadow ring, forced-colors fallback
  assistive-gate.css     ← enlarged targets, thick borders, simplified layouts
  alt-text-gate.css      ← alt text display mode switching (hidden, subtitle, tooltip, inline, enlarge)
  textonly-gate.css       ← textonly layout and visibility rules

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

### reduced-gate.css — Reduced shows COMPLETED state

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

### Animation Gating — Three Independent Layers

Animation is gated at three levels. All work independently. No animation atom needed.

```
JSON animation prop exists?
  ├─ NO  → no animation class in HTML → CSS never matches → zero motion (build-time gate)
  └─ YES → class in HTML
            ├─ JS gate: getMotion() → 'none'/'still' → don't import library (zero bytes)
            ├─ CSS gate: --duration-base: 0s → animation runs in zero time (frozen)
            └─ Hover gate: data-hover="none" → click replaces hover trigger
```

**Layer 1: JSON prop gating (build time)**
- If content author doesn't set an animation prop, no `.anim--*` class exists in HTML
- CSS animation rules never match — zero motion, zero cost
- This is the primary gate — structural, not runtime

**Layer 2: JS library gating (runtime — script loading)**
- Animation scripts MUST call `getMotion()` BEFORE importing libraries
- If gated, don't even `import('gsap')` — zero bytes downloaded
- NEVER static-import animation libraries at top of script
- The old `prefersReducedMotion()` function is LEGACY — use `getMotion()` from gate.ts

Correct pattern (dynamic import after gate check):
```js
const motion = getMotion();
if (motion === 'none' || motion === 'still') return;
const { gsap } = await import('gsap');
// now init animation
```

Wrong pattern (static import, always loads):
```js
import gsap from 'gsap';  // ← WRONG: loads library even when gated
```

**Layer 3: CSS token gating (runtime — animation values)**
- ALL animation durations must use `var(--duration-*)` tokens
- ALL animation easings must use `var(--ease-*)` tokens
- Setting tokens to `0s` / `none` in one gate file kills all motion globally
- `animation: none` IS allowed — it's the explicit disable
- @keyframes should be in micro-animations.css for centralised gating

### JS animation gate (src/lib/animation/gate.ts)

Single source of truth. Every animation script calls this BEFORE importing any library:

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
| none | Don't import library. Show plain fallback or nothing |

### Hover gating — 4 modes

`data-hover` attribute on body. Controlled by Your View panel.

| Mode | Behaviour |
|---|---|
| full | Normal hover effects |
| soft | Gentle/reduced hover |
| instant | Instant state change, no transition |
| none | Click replaces hover trigger entirely |

Hover rules belong in `hover-gate.css`, not component CSS. Exceptions: Button (22 variant-specific suppressions), Link (focus-active), Icon (hover-triggered animation).

### Visual effects gating — 3 modes (opacity-gate.css)

`data-visual` attribute on body. Controls shadows, glass, glow, liquid effects.

| Mode | What it does |
|---|---|
| full | Everything on (default) |
| solid | Kills glass/blur/liquid. Keeps shadows + glow |
| flat | Kills everything: shadows, glass, glow, liquid, glint |

Works by zeroing global tokens: `--glass-bg: transparent`, `--shadow-sm: none`, `--glow-ambient: none`, etc. Components that use these tokens get the effect for free — no per-component rules needed.

Textonly sets `data-visual="flat"` alongside `data-render="textonly"`. Assistive preset sets `data-visual="solid"`.

**Opacity tokens** (in `tokens/layout.css`):
- `--opacity-hidden` (0), `--opacity-low` (0.3), `--opacity-subtle` (0.45), `--opacity-disabled` (0.5)
- `--opacity-medium` (0.6), `--opacity-medium-high` (0.75), `--opacity-high` (0.85), `--opacity-full` (1)

All component opacity values MUST use these tokens — hardcoded opacity is caught by validator rule 5.

### assistive-gate.css

Assistive is a preset that toggles multiple data attributes. Most needs are covered by existing gates (hover=none, motion=still, text size up). The few component-specific overrides live here — cherry-picked, not a full render mode:

```css
[data-assistive] {
  --min-target: 64px;
  --border-width: 2px;
  --focus-thickness: 0.3rem;
}

/* Cherry-picked per-component rules — only what existing gates don't cover */
[data-assistive] .list { /* simplified like textonly */ }
[data-assistive] .badge { font-size: var(--text-body); padding: var(--space-md); }
[data-assistive] .form-field { --_field-control-size: 2rem; --_field-thumb-size: 1.5rem; }
/* Tooltip — bottom bar (hover=none already triggers this, may not need a rule) */
/* Card stays visual. Heading stays styled. Not everything changes. */
```

Move existing `[data-render="assistive"]` rules from component CSS into this file. Then check what's actually needed versus what existing gates already handle. Most will be redundant.

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
- NO "assistive" in renders — only full, reduced, textonly
- NO defaults that are token names ("default": "neutral-400")
- Defaults are enum values ("default": "primary")
- MUST have all 4 prop groups: content, visual, animation, colour
- colour group MUST be empty {} — colour is a visual enum, not a separate axis
- color enum MUST be the canonical 11: default, primary, secondary, neutral, red, orange, yellow, teal, blue, purple, pink
- Animation props MUST be in the animation{} group — if it moves, it goes there
- Pipeline strips animation{} for reduced/textonly — props in content/visual survive all renders
- Every string prop in visual{} and animation{} MUST have an enum — JSON sends enums, not freeform strings
- Exempt: slug-type props (lottieIcon, morphTo, maskShape — asset references are freeform by nature)
- class/style are Astro composition props — should NOT be in schema (JSON authors don't set them)
- Shared enums defined ONCE in `src/lib/shared-enums.ts` (.ts for Astro) and `src/lib/shared-enums.json` (for validators/schemas)
- Add a new enum value in shared-enums = available in every component automatically

---

## The 11 colour enums (every coloured atom uses all 11)

| Enum | Background token | Border/accent token |
|---|---|---|
| default | (no class emitted) | (no class emitted) — base CSS uses --color-Text |
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

`default` = no colour class emitted, base CSS applies `--color-Text` (the theme text token). 10 colour classes in CSS, 11 enum values in schema. Not every atom uses background + border. Some only need accent colour. But the enum is always the same 11 values.

---

## The 30 animation enums (global micro-animations)

Shared across every animatable atom. JSON `"animation": "bounce"` → Astro emits `.anim--bounce` → global CSS handles the rest. No animation atom needed — the class is global.

**Tokens** (`src/styles/tokens/motion.css`): easing + durations. THE GATE POINT — zero these to kill all motion.
**Keyframes + triggers** (`src/styles/global/micro-animations.css`): @keyframes + `.anim--{name}:hover` rules. Consumes tokens.

All 30 animations use `var(--duration-*)` and `var(--ease-*)` tokens. No hardcoded values.

| Category | Enums |
|----------|-------|
| Movement | spin, bounce, shake, float, drift, slide-up, slide-down, slide-left, slide-right, flip |
| Scale | pulse, ping, pop, squish, heartbeat, rubber-band |
| Opacity | fade, blink, flash, glint, shimmer, twinkle |
| Rotation | wiggle, swing, rock, nod |
| Compound | attention, celebrate, enter, exit |

**Gating — three layers, all independent:**

| Layer | How | When |
|-------|-----|------|
| JSON prop | Pipeline strips `animation{}` group → no `.anim--*` class in HTML | Build time (reduced/textonly) |
| CSS tokens | `--duration-long: 0s` in reduced-gate.css → animation runs in zero time | Runtime |
| Hover gate | `data-hover="none"` → `:hover` never triggers | Runtime |

**Schema pattern** — every animatable atom:
```json
"animation": {
  "animation": { "type": "string", "enum": ["spin","bounce","shake","float","drift","slide-up","slide-down","slide-left","slide-right","flip","pulse","ping","pop","squish","heartbeat","rubber-band","fade","blink","flash","glint","shimmer","twinkle","wiggle","swing","rock","nod","attention","celebrate","enter","exit"] }
}
```

Component-specific animation (Icon draw/morph, LottieIcon, GSAP scroll) lives alongside the shared enum in that atom's `animation{}` group. The 30 micro-animations are the global shared set.

---

## Icon weight enum (every atom with an icon prop)

Icons come from D1 (Asset Library API). JSON author passes the **base name only** (e.g. `"heart"`, not `"heart-fill"`). Weight is resolved from brand config (`ICON_WEIGHT` env var) or explicit `iconWeight` enum.

| iconWeight | Resolves to | When to use |
|---|---|---|
| brand | Brand default (ICON_WEIGHT env var, usually fill) | Default — don't set, brand decides |
| fill | heart-fill | Solid filled icons |
| duotone | heart-duotone | Two-tone icons |
| regular | heart-regular | Outline/regular weight |
| bold | heart-bold | Thicker strokes |
| thin | heart-thin | Thinner strokes |
| light | heart-light | Lightest weight |

**Schema pattern** — every atom with an `icon` prop:
```json
"content": {
  "icon": { "type": "string", "textonly": false }
},
"visual": {
  "iconWeight": { "type": "string", "default": "brand", "enum": ["brand","fill","duotone","regular","bold","thin","light"] }
}
```

`icon` is content (what icon), `iconWeight` is visual (how it looks). `"brand"` = no override, use the brand config default. JSON authors never need to know the full slug — just the base name and optionally a weight.

---

## Gradient system (canonical)

### How it works
Gradients are built from **tier tokens** (`--_tier-tint/mid`, `--_badge-color`, `--_tier-emphasis`) set by the colour enum classes. No separate gradient colour enum needed — the colour IS the gradient.

CSS mixin: `src/styles/global/gradient.css`. Components add `.gradient` + `.gradient--{variant}` classes.

### Three layers

**1. Composable gradients** (`gradient: true` + direction + spread)

| Prop | Values | What it does |
|------|--------|-------------|
| `gradient` | boolean | Enable gradient from tier tokens |
| `gradientDirection` | vertical, horizontal, diagonal (×4 with reverse) | Sets `--_grad-angle` |
| `gradientSpread` | soft, balanced, tight | Controls stop range |

| Spread | Stops |
|--------|-------|
| Soft | color-White → tint → mid |
| Balanced | color-White → tint → mid → base → emphasis → color-Black |
| Tight | base → emphasis → color-Black |

**2. Named blends** (`gradientBlend`)

| Blend | Stops | Direction |
|-------|-------|-----------|
| `hero` | primary-base → secondary-base | Respects direction |
| `sunset` | primary-base → primary-emphasis → secondary-emphasis | Respects direction |
| `brand-emerge` | primary-tint → primary-base → secondary-emphasis | Respects direction |
| `brand-fade` | primary-emphasis → secondary-base → secondary-tint | Respects direction |
| `emerge` | page-bg → colour (appears from background) | Respects direction |
| `fade` | colour → page-bg (dissolves into background) | Respects direction |

**3. Tier presets** (`gradientBlend: "preset-*"`)

| Preset | Stops | Direction |
|--------|-------|-----------|
| `preset-tint` | mid → tint → white | Fixed 135deg |
| `preset-mid` | emphasis → base → mid → tint | Fixed 135deg |
| `preset-base` | tint → mid → base → emphasis | Fixed 135deg |
| `preset-emphasis` | base → emphasis → black | Fixed 135deg |

### Variant behaviour (canonical — ALL components)

| Variant | Background | Border | Text | Icon |
|---------|-----------|--------|------|------|
| Fill | `--_grad-computed` | none (unless borderWeight set) | Solid (`--color-White`/`--color-Black`) | Solid (inherits text) |
| Outline | page-bg padding-box | Gradient border-box (tier-only, no white/black) | `background-clip: text` | Solid colour |
| Glass | Glass bg | Glass border | `background-clip: text` | Solid colour |

### Fill text colour

| Spread | Text | Why |
|--------|------|-----|
| Soft | `var(--color-Black)` | Light gradient bg |
| Balanced/tight | `var(--color-White)` | Dark gradient bg |

### `gradientAnimated` prop

- Boolean, independent of `animation` (icon/component motion)
- Fill: `anim-gradient-flow` on background, text stays solid
- Outline: `anim-border-flow` on border
- Glass: `anim-gradient-flow` on background
- Icon NEVER gets gradient animation
- Background sizing: `var(--_grad-size)` (25rem) for consistent rendering

### Mode overrides

| Mode | Behaviour |
|------|-----------|
| Dark | `--color-White`/`--color-Black` swap → gradient endpoints self-correct |
| HC | HC rainbow tokens cascade — no overrides needed |
| Mono | Mono rainbow tokens cascade |
| Calm | All gradients flatten to solid `--_badge-color` |
| CVD | CVD rainbow tokens cascade |

### Schema pattern
```json
"gradient": {
  "gradient": { "type": "boolean" },
  "gradientBlend": { "type": "string", "enum": ["hero","sunset","brand-emerge","brand-fade","emerge","fade","preset-tint","preset-mid","preset-base","preset-emphasis"] },
  "gradientDirection": { "type": "string", "enum": ["vertical","vertical-reverse","horizontal","horizontal-reverse","diagonal","diagonal-reverse","diagonal-alt","diagonal-alt-reverse"] },
  "gradientSpread": { "type": "string", "enum": ["soft","balanced","tight"] }
},
"animation": {
  "gradientAnimated": { "type": "boolean" }
}
```

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
| Icon | Draw/morph animation in component | DrawSVG + MorphSVG are Icon-specific GSAP transforms, not micro-animations |

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
