# Foundational Contract Audit

## 1. Executive Summary

A comprehensive architectural recovery and contract audit was performed across the local repository (`C:\Users\Business\Website v2.36`) to establish the **authoritative canonical contract** for the rendering system before executing foundational repairs.

Using the finished `Badge` atom implementation and live repository code as the ground truth, this audit evaluates the entire pipeline:
```
Authored Content (JSON)
       │
       ▼
Schema Contract (*.schema.json)
       │
       ▼
Validation Gate (schema-validator.ts & validate-data.ts)
       │
       ▼
Component Resolution & Rendering (Renderer.astro & render.ts)
       │
       ▼
Atom Execution (*.astro)
       │
       ▼
Stelladore Design System (Tokens, Global Mixins, CSS Gates, Themes)
       │
       ▼
Runtime Controller & Transforms (render-controller.ts)
```

### Major Findings

1. **Vocabulary Split & Severe Staleness**:
   - `src/lib/shared-enums.json` is critically out of sync with `src/lib/shared-enums.ts`. It retains obsolete ROYGBIV strings (`red`..`pink`) instead of positional tokens (`rainbow-1`..`rainbow-7`), omits size `'xl'`, and lacks gradient animation direction and speed enums.
   - `shared-enums.ts` omits the `meta` variant (actively implemented in `Badge.css` and `Badge.schema.json`), creating a TypeScript compilation type mismatch in `Badge.astro`.
   - `shared-enums.ts` provides only 8 `GRADIENT_BLENDS`, whereas `Badge.schema.json` and `gradient-generated.css` support 19 blends (including brand and rainbow single-colour blends).
   - Component-specific narrowing (such as Badge rejecting `'pill'`) is unrepresented in the shared enums layer, forcing atoms into ad-hoc local TypeScript type overrides (`BadgeShape`).
2. **Dead Pipeline Code & Contract Violations**:
   - `src/lib/render-pipeline.ts` and `src/lib/render-rules.json` are completely un-imported, un-wired dead code.
   - `render-rules.json` contains invalid examples promoting arbitrary inline styles (`"style": "--btn-border: var(--primary-600)"`) and refers to non-existent CSS files (`render-reduced.css`, `render-textonly.css`, `render-assistive.css`).
   - `pipelineRules` in `Badge.schema.json` (`altTextRule`) is an orphaned declaration unrecognised by any active validator or build pipeline.
3. **Canonical Render Modes Recovered**:
   - Live code confirms exactly **three canonical render modes**: `full`, `reduced`, and `textonly`.
   - All 18 atom schemas declare `renders: { full, reduced, textonly }` (with `Icon` and `Shape` declaring `textonly: null`).
   - **Assistive ("Easy Click") is a CSS gate, NOT a render mode**. It is triggered via attribute `[data-render="assistive"]`, but handled exclusively in `src/styles/gates/assistive-gate.css`. It has no JS DOM transform (`MODES["assistive"]` in `render-controller.ts` is intentionally undefined) and no separate `.astro` template.
4. **Concrete Implementation Bugs**:
   - **Invalid CSS in `Badge.css:175`**: `backdrop-filter: var(--liquid-blur);` evaluates to `10px`, which is an invalid CSS filter function (unlike `Button.css` which correctly wraps it in `blur(...)`).
   - **Explainer Leak in `render.ts:77`**: `NO_EXPLAINER_PARENTS` omits `'Badge'`, failing to suppress heavy AAC animation cards on badge-scale icons.
   - **Accessibility Silencing in `Badge.astro:187`**: Unconditionally hardcodes `aria-hidden="true"` on nested `<Icon>` and `<LottieIcon>`, silencing icons authored with `semanticRole: "content-symbol"`.
   - **Dead Fallback in `render-controller.ts:374`**: Still attempts to query `#a11y-content-wrapper`, a banned ID.
5. **Validator Blind Spots**:
   - `scripts/validate-atoms.cjs` Rule 30 checks `props.visual.color` against legacy names, completely bypassing modern split colour groups (`brandColor`/`rainbowColor`).
   - `validate-atoms.cjs` Rule 35 checks string enums only in `visual`, `animation`, and `behaviour`, skipping `typography` and `gradient`.
   - `validate-atoms.cjs` Rule 28 strictly limits render keys to `['full', 'reduced', 'textonly']`, creating confusion with the `[data-render="assistive"]` CSS gate.
   - `src/lib/schema-validator.ts` only logs warnings for schema integrity issues (`string` without enum), permitting un-restricted schemas to pass.

---

## 2. Current Architecture Recovered from Code

The live repository operates on an end-to-end declarative pipeline where content JSON drives Astro component trees through strict token and theme interfaces:

```
[Content JSON]
  │
  ├─► Build Gate: `scripts/validate-data.ts`
  │     └─► Recursively runs `validateComponent()` / `validatePage()`
  │     └─► Enforces `_lockProps` deep child schema validation
  │     └─► Enforces `checkAstroVsSchema()` prop parity
  │
  └─► DEV / Runtime: `src/components/Renderer.astro`
        │
        ├─► `src/lib/render.ts`: `resolveNode()`
        │     ├─► `applyPipelineDefaults()` (injects parent-aware props)
        │     ├─► `extractProps()` (strips structural `component`, `children`)
        │     └─► `componentRegistry` lookup (maps name to Astro component)
        │
        ├─► Astro Atom Execution (`src/components/atoms/*/*.astro`)
        │     ├─► Destructures props with default fallbacks
        │     ├─► Binds global CSS classes: `.color--{color}`, `.color--tier-{tier}`
        │     ├─► Routes typography and labels to `<Text>` or `<Heading>`
        │     └─► Renders accessible semantic HTML (`<span>`, `<button>`, `role`, `data-*`)
        │
        ├─► Stelladore CSS Architecture (`src/styles/`)
        │     ├─► Design Tokens: `tokens/` (spacing, radius, typography in rem, borders)
        │     ├─► Theme Engine: `themes/` & `global/colour.css` (OKLCH auto-contrast `--_on-color`)
        │     ├─► Ambient Zones: `zones/` (dark luminance, calm chroma, high contrast AAA)
        │     ├─► Interaction Gates: `gates/` (hover, motion zeroing, speed, opacity, focus, assistive)
        │     └─► Responsive Sizing: `tokens/responsive.css` (200px / 480px / 768px breakpoints)
        │
        └─► Client Runtime Controller (`src/lib/render-controller.ts`)
              ├─► Executed on DOMContentLoaded / MutationObserver
              ├─► Applies `transformReduced`: disables runtime GSAP loops
              ├─► Applies `transformTextonly`: strips visual classes, collapses chrome, hides decorative nodes
              └─► Applies `transformAnimExplainerInline`: relocates AAC explainers
```

---

## 3. Canonical Vocabulary Map

| Controlled Vocabulary | Intended Source of Truth | Current Status in `shared-enums.ts` | Current Status in `shared-enums.json` | Current Status in Schemas | Divergence / Architectural Finding | Classification | Severity | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Colours** | `src/styles/global/colour.css` | `['primary', 'secondary', 'neutral']` | `['primary', 'secondary', 'neutral']` | Matches across all 18 schemas | Full agreement across layers. | CURRENT | P3 | Maintain single definition. |
| **Rainbow Colours** | `src/styles/tokens/rainbow-*.css` | `['rainbow-1' .. 'rainbow-7']` | `['red' .. 'pink']` (ROYGBIV) | `['rainbow-1' .. 'rainbow-7']` | `shared-enums.json` is severely stale; retains deprecated names. | DIVERGENCE / BUG | P0 | Overwrite `shared-enums.json` with `rainbow-1..7`. |
| **Colour Tiers** | `src/styles/global/colour.css` | `['tint', 'mid', 'base', 'emphasis']` | `['tint', 'mid', 'base', 'emphasis']` | Matches across all schemas | Full agreement. Implicit baseline `'base'`. | CURRENT | P3 | Maintain as global standard. |
| **Atom Variants** | Atom-specific & shared | `['fill', 'outline', 'glass', 'liquid-glass']` | `['fill', 'outline', 'glass', 'liquid-glass']` | Badge adds `'meta'` | `shared-enums.ts` lacks `'meta'`, breaking TS compilation for Badge. | DIVERGENCE | P1 | Add `'meta'` to `VARIANTS` or define atom-scoped variant sets. |
| **Shapes** | `src/styles/tokens/borders.css` | `['sharp', 'subtle', 'soft', 'rounded', 'pill']` | `['sharp', 'subtle', 'soft', 'rounded', 'pill']` | Badge forbids `'pill'`; Button/Shape use `'pill'` | Shared vocabulary lacks subsetting; Badge forced to declare ad-hoc `BadgeShape`. | DIVERGENCE / LEAK | P1 | Formalise atom-specific shape subsets in `shared-enums.ts`. |
| **Sizes (Atoms)** | `src/styles/tokens/typography.css` | `['sm', 'md', 'lg', 'xl']` | `['sm', 'md', 'lg']` | Badge/Button declare `sm..xl` | `shared-enums.json` is missing `'xl'`. | DIVERGENCE | P0 | Add `'xl'` to `shared-enums.json`. |
| **Gradient Blends** | `src/lib/gradient-catalogue.ts` | 8 presets (`hero`, `sunset`, etc.) | 8 presets | Badge declares 19 blends | Badge schema matches generated CSS; `shared-enums.ts` has only 8 presets. | DIVERGENCE | P1 | Export generated blend vocabulary from `gradient-catalogue.ts` into shared enums. |
| **Gradient Directions**| `src/styles/global/gradient.css` | 8 directions (`diagonal`, etc.) | 8 directions | Matches in Badge, Shape, Heading | Full agreement. Intent-based directions. | CURRENT | P3 | Maintain single definition. |
| **Gradient Animation Direction** | CSS Keyframe engine | `['cw', 'ccw', 'sway']` | Missing key | Matches in Badge, Shape | Omitted from `shared-enums.json`. | DIVERGENCE | P1 | Add `gradientAnimateDirection` to `shared-enums.json`. |
| **Gradient Animation Speed** | `src/lib/animation/config/gradient.ts` | Missing from file | Missing from file | `['slow', 'default', 'fast']` | Defined in `config/gradient.ts` as seconds (20, 12, 6), absent from shared enums. | DIVERGENCE / DUPLICATION | P1 | Export `GRADIENT_ANIMATION_SPEEDS` array from shared enums. |
| **Shadows** | `src/styles/tokens/shadows.css` | 8 box-shadow tokens | 8 box-shadow tokens | Matches in Badge, Card, Button | Full agreement. Glow tokens use currentColor. | CURRENT | P3 | Maintain single definition. |
| **Border Weights** | `src/styles/tokens/borders.css` | `['thin', 'thick']` | `['thin', 'thick']` | Matches in Badge, Button | Full agreement. | CURRENT | P3 | Maintain single definition. |
| **Font Families** | `src/styles/tokens/typography.css` | 5 families (`heading`, `body`, etc.) | 5 families | Matches across all schemas | Full agreement. Registered via Astro fonts API. | CURRENT | P3 | Maintain single definition. |
| **Font Weights** | `src/styles/tokens/typography.css` | 5 weights (`normal`..`extrabold`) | 5 weights | Matches across all schemas | Full agreement. | CURRENT | P3 | Maintain single definition. |
| **Semantic Roles** | WCAG 4.1.2 Specification | `['status', 'tag', 'label', 'none']` | `['status', 'tag', 'label', 'none']` | Matches in Badge | Full agreement. | CURRENT | P3 | Maintain single definition. |
| **Icon Semantic Roles** | WCAG 1.1.1 Specification | `['decorative', 'ui-control', 'content-symbol']` | `['decorative', 'ui-control', 'content-symbol']` | Matches in Icon, Media nodes | Full agreement in schema; violated in Badge.astro markup. | ACCESSIBILITY ISSUE | P1 | Honor `content-symbol` in atom markup. |
| **Render Modes** | Rendering Engine | Missing from file | Missing from file | All schemas declare `full, reduced, textonly` | Documented as 3 modes; `mode-readers.ts` types 4 (`assistive` included). | HUMAN DECISION | P1 | Reconcile: confirm `assistive` is a CSS gate, not a render mode. |

---

## 4. Schema Contract Map

### Canonical Schema Groups
1. **`content`**: Display text, accessibility labels, and technical wiring identifiers.
2. **`colour`**: Brand colour selection (`brandColor`).
3. **`rainbow`**: Positional rainbow selection (`rainbowColor`) and intensity tier (`colorTier`).
4. **`visual`**: Variant, shape, size, shadow, borderWeight, semanticRole.
5. **`gradient`**: Gradient enablement, blend, direction, emerge, fade, flip.
6. **`typography`**: Font family, font weight, casing (`uppercase`).
7. **`animation`**: Motion triggers, animation names, animated gradient options, cycles.
8. **`media`**: Nested component slot for child atoms (`Icon`, `LottieIcon`, `Image`, `Shape`).
9. **`identity` / `state` / `behaviour` / `a11y`**: Specialized form atom groups (e.g. `FormField`).

### Free Text vs Controlled Enum Boundary

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           FREE TEXT PERMITTED                              │
├───────────────────────────────────┬────────────────────────────────────────┤
│ Display Text (Visible Content)    │ `contentBadge`, `contentButton`,       │
│                                   │ `contentHeading`, `contentText`, etc.  │
├───────────────────────────────────┼────────────────────────────────────────┤
│ Accessibility Labels              │ `labelIcon`, `labelShape`, `ariaLabel` │
├───────────────────────────────────┼────────────────────────────────────────┤
│ Technical IDs & Routing           │ `id`, `name`, `href`, `download`       │
├───────────────────────────────────┼────────────────────────────────────────┤
│ Asset Slugs (Format-Validated)    │ `slug`, `particleSvg`, `pattern`       │
└───────────────────────────────────┴────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                        STRICTLY ENUM-RESTRICTED                            │
├───────────────────────────────────┬────────────────────────────────────────┤
│ Design & Visual Properties        │ variant, shape, size, shadow, border   │
├───────────────────────────────────┼────────────────────────────────────────┤
│ Colour & Tiering                  │ brandColor, rainbowColor, colorTier    │
├───────────────────────────────────┼────────────────────────────────────────┤
│ Typography Selection              │ fontFamily, fontWeight                 │
├───────────────────────────────────┼────────────────────────────────────────┤
│ Animation & Speed                 │ animation, trigger, speed, direction   │
├───────────────────────────────────┼────────────────────────────────────────┤
│ Semantic & Accessibility Roles    │ semanticRole, iconSemanticRole         │
└───────────────────────────────────┴────────────────────────────────────────┘
```

- **Rule**: Genuine content remains free text. Design, behavior, and styling must be 100% enum-restricted.
- **Rule**: Arbitrary CSS properties, `class`, and `style` are strictly forbidden in schemas and JSON content.
- **Rule**: Nested component slots (`media`) must declare `_lockProps: true` to enforce child schema validation.

---

## 5. Validator Rule Map

### Part A: `scripts/validate-atoms.cjs` (Code Hygiene & Static Heuristics)

| Rule | Description | Scope / Target | Architectural Intent | Current State | Classification | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R1** | Nested `var()` fallback | CSS files | Forbid token-chain fallbacks (`var(--a, var(--b))`) | Functional | CURRENT | Retain; enforces token authoritativeness. |
| **R2** | Hardcoded `px >= 10` | CSS files | Require tokenised dimensions / rem | Functional | CURRENT | Retain. |
| **R2b**| Hardcoded border px (1–6px)| CSS files | Require `var(--border-width-*)` | Functional | CURRENT | Retain. |
| **R3** | Hardcoded hex colour | CSS files | Forbid hex colours in live CSS | Functional | CURRENT | Retain. |
| **R4** | Hardcoded rgb/hsl | CSS files | Forbid rgb/hsl literals | Incomplete | VALIDATOR BLIND SPOT | Expand regex to forbid raw `oklch(...)` literals and named colours. |
| **R5** | Hardcoded opacity | CSS files | Require tokenised opacity | Functional | CURRENT | Retain. |
| **R6** | Hardcoded duration | CSS files | Require tokenised animation speed | Functional | CURRENT | Retain. |
| **R7** | Hardcoded easing | CSS files | Require tokenised easing curves | Functional | CURRENT | Retain. |
| **R8** | Inline style in Astro | `.astro` files | Forbid inline styles except allowlisted dynamic properties | Functional | CURRENT | Retain; Badge cycle properly allowlisted. |
| **R9** | CSS computation maps | `.astro` files | Forbid JS dictionaries computing CSS values | Functional | CURRENT | Retain. |
| **R10**| Rest spread `[key: string]`| `.astro` files | Require strict Props interface typing | Functional | CURRENT | Retain. |
| **R11**| Assistive in component CSS | CSS files | Route assistive rules to `assistive-gate.css` | Functional | CURRENT | Retain. |
| **R12**| Zone/gate rules in CSS | CSS files | Route dark/HC/reduced rules to global zones | Functional | CURRENT | Retain. |
| **R13**| Token type / cssProperty | Schema files | Forbid legacy `"type": "token"` in schema | Functional | CURRENT | Retain. |
| **R14**| Assistive render to `.astro`| Schema files | Forbid pointing assistive to an `.astro` file | Contradictory | CONTRADICTORY | Reconcile with 3-mode contract; assistive is a gate. |
| **R16**| `@layer` wrapper | CSS files | Control cascade via import order, not `@layer` | Functional | CURRENT | Retain. |
| **R17**| `!important` | CSS files | Forbid `!important` in component CSS | Functional | CURRENT | Retain. |
| **R18**| `@media prefers-reduced-motion`| CSS files | Delegate motion gating to Stelladore gates | Functional | CURRENT | Retain. |
| **R19**| `.a11y-*` class selector | CSS files | Forbid component-level a11y classes | Functional | CURRENT | Retain. |
| **R20**| `#a11y-content-wrapper` | CSS files | Forbid reference to dead wrapper ID | Functional | CURRENT | Retain. |
| **R21**| `transition:` in CSS | CSS files | Route transitions to `transitions.css` | Functional (Warn)| CURRENT | Retain. |
| **R22**| `:focus-visible` in CSS | CSS files | Route focus indicators to `focus-gate.css` | Functional (Move)| CURRENT | Retain. |
| **R23**| `:global()` in `.astro` | `.astro` files | Forbid global style leakage from Astro components | Functional | CURRENT | Retain. |
| **R24**| Scoped `<style>` in Astro | `.astro` files | Require external `.css` files | Functional | CURRENT | Retain. |
| **R25**| Missing required prop groups| Schema files | Require `content`, `visual`, `animation`, `colour` | Functional | CURRENT | Retain. |
| **R26**| Colour group unexpected props| Schema files | Restrict `colour` group to brandColor/rainbowColor | Functional | CURRENT | Retain. |
| **R27**| Token-name default | Schema files | Forbid defaults named like `neutral-400` | Functional | CURRENT | Retain. |
| **R28**| Unexpected render keys | Schema files | Enforce `['full', 'reduced', 'textonly']` | Functional | CURRENT | Retain; enforces 3 canonical modes. |
| **R29**| `:hover` in component CSS | CSS files | Route hover interactions to `hover-gate.css` | Functional (Warn)| CURRENT | Retain. |
| **R30**| Canonical colour enum | Schema files | Check `props.visual.color` against 11 colours | Obsolete | VALIDATOR BLIND SPOT | Modern atoms split colour; replace with checks on `colour.brandColor` and `rainbow.rainbowColor`. |
| **R31**| `@keyframes` in CSS | CSS files | Route animations to `micro-animations.css` | Functional (Warn)| CURRENT | Retain. |
| **R32**| Animation without tokens | CSS files | Require `--duration-*` / `--ease-*` | Functional | CURRENT | Retain. |
| **R33**| Animation in wrong group | Schema files | Require moving props in `animation{}` | Functional | CURRENT | Retain. |
| **R34**| Ungated animation import | `.astro` files | Require checking `getMotion()` before GSAP | Functional | CURRENT | Retain. |
| **R35**| String props without enum | Schema files | Check `visual`, `animation`, `behaviour` | Incomplete | VALIDATOR BLIND SPOT | Expand check to `typography`, `gradient`, `colour`, and `rainbow` groups. |
| **R36**| `class`/`style` in schema | Schema files | Forbid developer escape hatches in schema | Functional | CURRENT | Retain. |
| **R37**| Hardcoded enum union in Astro| `.astro` files | Require importing from `shared-enums.ts` | Functional | CURRENT | Retain. |
| **R38**| Radial gradient on atoms | Schema files | Forbid radial gradients on small atoms | Functional | CURRENT | Retain. |
| **R39**| `slots`/`class`/`style` at root| Schema files | Forbid framework props in schema root | Functional | CURRENT | Retain. |
| **R40**| Per-atom colour classes | CSS files | Forbid `.badge--primary`; require `.color--*` mixin| Functional | CURRENT | Retain. |
| **R42**| Duplicate CSS @import | `global.css` | Forbid importing CSS already loaded by barrel | Functional | CURRENT | Retain. |
| **R43**| Schema vs Astro default drift | Schema vs Astro | Bidirectional verification of default values | Functional | CURRENT | Retain. |
| **R44**| Hardcoded inline `<svg>` | `.astro` files | Require using `<Icon>` atom | Functional | CURRENT | Retain. |
| **R45**| Phantom token references | CSS files | Verify every `var(--name)` exists in `styles/` | Functional | CURRENT | Retain. |

### Part B: `src/lib/schema-validator.ts` (Runtime Data Validation Engine)

1. **`validateComponent(item, schema)`**:
   - Validates structural keys, rejects forbidden props (`class`, `style`).
   - Rejects raw CSS patterns (`var(--`, hex, rgb, px, rem).
   - Enforces default-aware required props (`required: true` satisfied if `default` declared).
   - Enforces Move 1 (`component` enum check on component nodes).
   - Enforces Move 2 (`_lockProps` deep recursion against child schema from `__schemaMap`).
   - Enforces array-item shapes (`def.items.properties`) with recursive component node validation.
   - Evaluates declarative `_rules` (`requires`, `excludes`, `forbid`, `action`).
2. **Validation Engine Blind Spots**:
   - `validateSchemaIntegrity` warns via `console.warn` but does not reject invalid schemas.
   - Ignores `pipelineRules` completely.
   - Ignores `schema.renders` completely.
   - `SchemaProps` interface types only 4 groups, omitting `rainbow`, `gradient`, `typography`, `media`.

---

## 6. Renderer Contract Map

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         LIVE RENDERING PIPELINE                            │
└────────────────────────────────────────────────────────────────────────────┘
1. Authored JSON Tree
       │
2. `src/components/Renderer.astro`
       │  ├─► In DEV: runs `validateComponent()` on each node.
       │  │   If hard error: throws to browser DEV overlay.
       │  │
       │  └─► Calls `resolveNode(node, componentRegistry)` (`render.ts`)
       │
3. `src/lib/render.ts`
       │  ├─► `applyPipelineDefaults(node)`
       │  │   Injects parent-aware defaults (e.g. `noExplainer: true` on child icons).
       │  │   [BUG: 'Badge' is missing from `NO_EXPLAINER_PARENTS`].
       │  │
       │  ├─► `extractProps(node)`
       │  │   Strips structural keys (`component`, `children`).
       │  │
       │  └─► Registry Lookup (`componentRegistry[node.component]`)
       │      Returns `{ Component, props, children }`.
       │
4. Astro Component Execution (`Badge.astro`, etc.)
       │  ├─► Spreads sanitized props.
       │  ├─► Evaluates gradient names, cycles, and labels.
       │  └─► Emits clean HTML markup with semantic classes.
       │
5. Client-Side DOM Initialization (`render-controller.ts`)
          ├─► Runs on DOMContentLoaded / MutationObserver on `#main-content`.
          ├─► Reads `document.documentElement.dataset.render`.
          │     ├─► `full`: no-op.
          │     ├─► `reduced`: calls `transformReduced` (GSAP stagger/motion strip).
          │     └─► `textonly`: calls `transformTextonly` (DOM class strip, chrome collapse).
          │
          └─► Reads `document.documentElement.dataset.animExplainer`.
                └─► If `'inline'`, breaks AAC cards out of parent containers.
```

### Dead Code Disconnected from Pipeline
- **`src/lib/render-pipeline.ts`**: Zero importers in repository. Contains deprecated `mergeColourStyle` referencing banned `cssProperty`.
- **`src/lib/render-rules.json`**: Zero importers. Contains invalid CSS examples and points to nonexistent CSS files.

---

## 7. Render-Mode Contract

### Canonical Render Modes Recovered

| Render Mode | Mode Type | Trigger Mechanism | Schema Target (`renders`) | Pipeline & Runtime Action | CSS Authority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`full`** | Render Mode | `data-render="full"` (default) | `ComponentName.astro` | All props passed through. All animations, shadows, gradients rendered. | `src/styles/global/render-modes.css` |
| **`reduced`** | Render Mode | `data-render="reduced"` | `ComponentName.astro` | `transformReduced` runs in `render-controller.ts`. Visuals remain; animations frozen or simplified. | `src/styles/gates/reduced-gate.css` |
| **`textonly`** | Render Mode | `data-render="textonly"` | `ComponentName.astro` (or `null` for Shape/Icon) | `transformTextonly` runs. Strips visual classes, collapses chrome, hides decorative nodes, promotes labels. | `src/styles/textonly/textonly.css` |
| **`assistive`** | **CSS Gate** | `data-render="assistive"` | **Omitted from schema** | `render-controller.ts` does NOT dispatch a JS transform. Layout expansion (64px targets) handled entirely in CSS. | `src/styles/gates/assistive-gate.css` |

### Architectural Resolution
- **Render Modes vs CSS Gates**:
  - A **Render Mode** defines the presence or absence of component structure and DOM content (`full`, `reduced`, `textonly`).
  - An **Accessibility Gate** modifies appearance, sizing, and interaction via global CSS attribute selectors without changing component markup (`data-render="assistive"`, `data-mode="dark"`, `data-contrast="high"`, `data-motion="none"`, `data-hover="instant"`).
- **Rule 28 Resolution**:
  - Rule 28 in `validate-atoms.cjs` correctly requires that atom schemas declare only `['full', 'reduced', 'textonly']` in `renders`.
  - Claims in older documentation that every schema must declare four render keys (including `assistive`) were incorrect. `assistive` belongs in `assistive-gate.css`.

---

## 8. CSS / Stelladore Boundary

### Strict Component CSS Rules
1. **Zero Hardcoded Colours**: No hex, rgb, hsl, or oklch literals in live CSS.
2. **Global Mixin Consumption**: Components must consume `.color--{name}` and `.color--tier-{tier}` from `src/styles/global/colour.css`.
3. **No Component-Local Design Tokens**: Atoms must consume global tokens (`--space-*`, `--radius-*`, `--border-width-*`, `--shadow-*`).
4. **Strict Rem Typography**: All length dimensions must use `rem` (defined in `src/styles/tokens/typography.css`).
5. **No CSS Injection via JSON**: JSON content cannot inject inline styles, class names, or CSS custom properties.

### Presentation vs Compensation in Text-Only CSS
- `src/styles/textonly/textonly.css` provides baseline styling for Reading Mode (`.to-badge`, `.to-button`, `.to-card`).
- However, because `render-controller.ts` performs a brute-force class strip on `.badge` and hides all child icons, `textonly.css` is forced to inject compensatory styling rather than relying on clean atom-level rendering.

---

## 9. Accessibility / A11y Boundary

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           A11Y ARCHITECTURE MAP                            │
├───────────────────────────────────┬────────────────────────────────────────┤
│ Layer Type                        │ Implementation Files & Attributes      │
├───────────────────────────────────┼────────────────────────────────────────┤
│ **Theme Switching**               │ `src/styles/themes/*.css`               │
│ (Changes custom property values)  │ Luminance (Dark), High Contrast AAA,   │
│                                   │ CVD Safe (Protan, Deutan, Tritan, Mono)│
├───────────────────────────────────┼────────────────────────────────────────┤
│ **Global Ambient Zones**          │ `src/styles/zones/*.css`               │
│ (Overrides for luminance & chroma)│ `theme-luminance-dark.css` (`[data-mode]`)│
│                                   │ `high-contrast.css` (`[data-contrast]`)│
│                                   │ `no-chroma.css` (`[data-no-chroma]`)   │
├───────────────────────────────────┼────────────────────────────────────────┤
│ **Interaction & Sensory Gates**   │ `src/styles/gates/*.css`               │
│ (User comfort and physical access)│ `motion-gate.css` (`[data-motion]`)    │
│                                   │ `speed-gate.css` (`[data-anim-speed]`) │
│                                   │ `opacity-gate.css` (`[data-visual]`)   │
│                                   │ `hover-gate.css` (`[data-hover]`)      │
│                                   │ `focus-gate.css` (`:focus-visible`)    │
│                                   │ `assistive-gate.css` (`[data-render=..]`)│
│                                   │ `alt-text-gate.css` (`[data-alt-mode]`)│
├───────────────────────────────────┼────────────────────────────────────────┤
│ **Typography & Accessible Fonts** │ `src/styles/tokens/typography.css`     │
│ (Readability & neurodiversity)    │ Atkinson Hyperlegible, OpenDyslexic    │
│                                   │ Registered via Astro Fonts API         │
├───────────────────────────────────┼────────────────────────────────────────┤
│ **Component Accessibility**       │ Atom JSX (`Badge.astro`, etc.)         │
│ (Semantic structure & ARIA)       │ `data-semantic-role`, `role="note"`,   │
│                                   │ Screen-reader-only labels, ARIA states │
└───────────────────────────────────┴────────────────────────────────────────┘
```

---

## 10. Known Divergences

1. **D1: `shared-enums.json` vs `shared-enums.ts` Colour Vocabulary**:
   - *File*: `src/lib/shared-enums.json:6`
   - *Behaviour*: Uses `red..pink`.
   - *Expected*: `rainbow-1..rainbow-7`.
   - *Classification*: DIVERGENCE / BUG
   - *Severity*: P0
2. **D2: `shared-enums.ts` vs Badge `variant: "meta"`**:
   - *File*: `src/lib/shared-enums.ts:62`
   - *Behaviour*: Omits `'meta'`.
   - *Expected*: Includes `'meta'`.
   - *Classification*: DIVERGENCE
   - *Severity*: P1
3. **D3: `shared-enums.ts` vs Badge `gradientBlend`**:
   - *File*: `src/lib/shared-enums.ts:212`
   - *Behaviour*: Defines 8 blends.
   - *Expected*: 19 blends matching generated CSS.
   - *Classification*: DIVERGENCE
   - *Severity*: P1
4. **D4: Missing `gradientAnimateSpeed` in Shared Enums**:
   - *File*: `src/lib/shared-enums.ts` & `.json`
   - *Behaviour*: Missing enum entirely.
   - *Expected*: Declares `['slow', 'default', 'fast']`.
   - *Classification*: DIVERGENCE
   - *Severity*: P1
5. **D5: Shape Subsetting Unrepresented in Shared Enums**:
   - *File*: `src/lib/shared-enums.ts:74`
   - *Behaviour*: Declares `SHAPES` with `'pill'`.
   - *Expected*: Badge explicitly forbids `'pill'`.
   - *Classification*: DIVERGENCE
   - *Severity*: P2

---

## 11. Known Leaks

1. **LEAK 1: Explainer Documentation Leak**:
   - *File*: `src/lib/render.ts:66-77`
   - *Behaviour*: Comment documents Badge explainer suppression, but code set omits `Badge`.
   - *Classification*: LEAK / BUG
   - *Severity*: P0
2. **LEAK 2: Hardcoded Schema Metadata in Validator**:
   - *File*: `scripts/validate-atoms.cjs:595,630`
   - *Behaviour*: Required groups and render keys are hardcoded in validator scripts rather than derived from meta-schemas.
   - *Classification*: LEAK
   - *Severity*: P2
3. **LEAK 3: Accessibility Logic Split Across Layers**:
   - *File*: `Badge.schema.json` vs `Badge.astro` vs `render-controller.ts`
   - *Behaviour*: Schema defines `semanticRole` on media; Astro hardcodes `aria-hidden="true"`; runtime controller hardcodes `data-textonly-hidden`.
   - *Classification*: LEAK / ACCESSIBILITY ISSUE
   - *Severity*: P1

---

## 12. Known Bugs

1. **BUG 1: Invalid CSS Property in `Badge.css`**:
   - *File*: `src/components/atoms/Badge/Badge.css:175-176`
   - *Symbol*: `.badge--liquid-glass`
   - *Current Behaviour*: `backdrop-filter: var(--liquid-blur);` outputs `backdrop-filter: 10px;`.
   - *Expected Behaviour*: `backdrop-filter: blur(var(--liquid-blur));`.
   - *Classification*: CSS ISSUE / BUG
   - *Severity*: P0
   - *Recommended Action*: Update `Badge.css` line 175–176 to wrap `var(--liquid-blur)` in `blur(...)`.
2. **BUG 2: Missing Badge Explainer Suppression in `render.ts`**:
   - *File*: `src/lib/render.ts:77`
   - *Symbol*: `NO_EXPLAINER_PARENTS`
   - *Current Behaviour*: `new Set<string>(['Button'])`.
   - *Expected Behaviour*: `new Set<string>(['Button', 'Badge'])`.
   - *Classification*: RENDERER ISSUE / BUG
   - *Severity*: P0
   - *Recommended Action*: Add `'Badge'` to `NO_EXPLAINER_PARENTS`.
3. **BUG 3: Icon Semantic Announcement Silenced in `Badge.astro`**:
   - *File*: `src/components/atoms/Badge/Badge.astro:187-188`
   - *Symbol*: Child `<Icon>` / `<LottieIcon>` JSX
   - *Current Behaviour*: Unconditionally sets `aria-hidden="true"`.
   - *Expected Behaviour*: Only set `aria-hidden="true"` if `media?.semanticRole !== 'content-symbol'`.
   - *Classification*: ACCESSIBILITY ISSUE / BUG
   - *Severity*: P1
   - *Recommended Action*: Make `aria-hidden` conditional on `media?.semanticRole`.
4. **BUG 4: Dead DOM Query in `render-controller.ts`**:
   - *File*: `src/lib/render-controller.ts:374,399`
   - *Symbol*: `initRenderController`
   - *Current Behaviour*: Falls back to query `document.getElementById('a11y-content-wrapper')`.
   - *Expected Behaviour*: Query `#main-content` only.
   - *Classification*: LEGACY / BUG
   - *Severity*: P2
   - *Recommended Action*: Remove fallback to banned ID `#a11y-content-wrapper`.

---

## 13. Legacy / Obsolete Code

1. **`src/lib/render-pipeline.ts`**: Un-imported, dead file containing obsolete `cssProperty` mapping logic.
2. **`src/lib/render-rules.json`**: Un-imported, dead file containing invalid CSS style examples and stale CSS filenames.
3. **`scripts/validate-atoms.cjs` Rule 30**: Checks obsolete `props.visual.color`.
4. **`Badge.schema.json` `pipelineRules`**: Unimplemented specification for appending badge labels to adjacent image alt words.
5. **`src/components/atoms/Card/Card.schema.json` `legacy` group**: Un-restricted string fields (`hover`, `bg`, `href`) surviving from legacy Card molecule.

---

## 14. Duplicate Sources of Truth

1. **`shared-enums.ts` vs `shared-enums.json`**: Two parallel files maintaining duplicate copies of shared enums without automated synchronization.
2. **Gradient Blends**: Defined in `src/lib/gradient-catalogue.ts` (recipes), `shared-enums.ts` (partial list), `Badge.schema.json` (full list), and `gradient-generated.css` (generated CSS).
3. **Gradient Animation Speeds**: Defined in `src/lib/animation/config/gradient.ts` (seconds map) and `Badge.schema.json` (enum list), but absent from shared enums.
4. **Size Vocabularies**: Multiple overlapping size arrays (`SIZES`, `SHAPE_SIZES`, `HEADING_SIZES`, `TEXT_SIZES`) with overlapping values.

---

## 15. Proposed Canonical Ownership of Responsibilities

```
┌──────────────────────────────────────┬─────────────────────────────────────┐
│ Architectural Responsibility         │ Canonical Authority                 │
├──────────────────────────────────────┼─────────────────────────────────────┤
│ **Controlled Vocabularies**          │ `src/lib/shared-enums.ts`           │
│                                      │ (Single source; auto-generate JSON) │
├──────────────────────────────────────┼─────────────────────────────────────┤
│ **Component Contracts**              │ `src/components/atoms/*/*.schema.json`│
│                                      │ (100% enum-restricted design props) │
├──────────────────────────────────────┼─────────────────────────────────────┤
│ **Data Validation Gate**             │ `src/lib/schema-validator.ts`       │
│                                      │ (Build-time & DEV gate)             │
├──────────────────────────────────────┼─────────────────────────────────────┤
│ **Code Hygiene & Token Rules**       │ `scripts/validate-atoms.cjs`        │
│                                      │ (Linter for atom source files)      │
├──────────────────────────────────────┼─────────────────────────────────────┤
│ **Component Resolution & Defaults**  │ `src/lib/render.ts`                 │
│                                      │ (Registry lookup & pipeline defaults│
├──────────────────────────────────────┼─────────────────────────────────────┤
│ **Render Mode DOM Transforms**       │ `src/lib/render-controller.ts`      │
│                                      │ (Full, Reduced, Textonly transforms)│
├──────────────────────────────────────┼─────────────────────────────────────┤
│ **Accessibility & Layout Gates**     │ `src/styles/gates/*.css`            │
│                                      │ (Assistive, hover, motion, opacity) │
└──────────────────────────────────────┴─────────────────────────────────────┘
```

---

## 16. Repair Order

The following dependency sequence must be executed to repair the foundational rendering system before rolling out changes to individual atoms:

### Phase 1: Canonical Vocabulary Consolidation
1. **Sync `shared-enums.json`**: Update `colour.rainbow` to `rainbow-1..7`, add `'xl'` to `visual.size`, and add `GRADIENT_ANIMATE_DIRECTIONS`.
2. **Expand `shared-enums.ts`**:
   - Add `'meta'` to `VARIANTS`.
   - Export `GRADIENT_ANIMATION_SPEEDS = ['slow', 'default', 'fast']`.
   - Reconcile `GRADIENT_BLENDS` with the 19 blends generated by `gradient-catalogue.ts`.
   - Provide typed shape subsets (e.g. `BADGE_SHAPES`).

### Phase 2: Foundational Tooling & Renderer Corrections
3. **Fix `src/lib/render.ts`**: Add `'Badge'` to `NO_EXPLAINER_PARENTS`.
4. **Clean up `render-controller.ts`**: Remove dead `#a11y-content-wrapper` query; ensure textonly transform respects `content-symbol` icons.
5. **Retire or Archive Dead Pipeline Files**: Move `render-pipeline.ts` and `render-rules.json` to `_reference/` to eliminate conflicting documentation.
6. **Update `schema-validator.ts`**:
   - Expand `interface SchemaProps` to include `rainbow`, `gradient`, `typography`, and `media`.
   - Add `oklch(...)` to rejected CSS string patterns.

### Phase 3: Atom Validator Modernisation
7. **Update `validate-atoms.cjs`**:
   - Modernise Rule 30: replace dead `props.visual.color` check with validation of `brandColor` and `rainbowColor`.
   - Expand Rule 35: check string enums across `typography`, `gradient`, `colour`, and `rainbow` groups.
   - Expand Rule 4: forbid raw `oklch(...)` literals in component CSS.
   - Confirm Rule 28 strictly enforces 3-mode renders (`full`, `reduced`, `textonly`).

### Phase 4: Atom-Level Bug Fixes (Badge First)
8. **Fix `Badge.css`**: Correct `.badge--liquid-glass` to use `backdrop-filter: blur(var(--liquid-blur));`.
9. **Fix `Badge.astro`**: Conditionally apply `aria-hidden` on nested icons based on `media?.semanticRole`.
10. **Clean `Badge.schema.json`**: Remove or formally wire `pipelineRules.altTextRule`.

---

## 17. Items That Must NOT Be Changed

1. **Content / Label Free-Text Naming Convention**:
   `content<Atom>` (visible text) and `label<Atom>` (a11y labels) are the established, battle-tested prefix patterns. Do NOT revert to generic `text` or `label`.
2. **Three Canonical Render Modes**:
   Do NOT add `assistive` to schema `renders` blocks. Keep `renders` strictly `{ full, reduced, textonly }` and maintain `assistive` as a pure CSS gate.
3. **Default-Aware Required Props Check**:
   The `def.required && def.default === undefined` logic in `schema-validator.ts` is essential for nested component node slots (`media`). Do NOT revert to naive required checks.
4. **`_lockProps` Nested Schema Recursion (Move 2)**:
   The recursion engine in `schema-validator.ts` that deep-validates child props against the child's own schema must be preserved.
5. **Global `.color--{name}` Mixin System**:
   Atoms must NOT reintroduce per-atom colour classes (`.badge--primary`, `.btn--red`). All colour must continue to flow through the Stelladore mixin.
6. **Rem Units for All Length Dimensions**:
   Non-length values remain unitless (opacity, line-height, z-index, aspect-ratio); all physical dimensions must use `rem` or established tokens.

---

## 18. Questions Requiring Human Architectural Decision

1. **`pipelineRules` Fate**:
   - *Context*: `Badge.schema.json` declares `pipelineRules.altTextRule` (`append-to-adjacent-image`). No tooling implements this.
   - *Question*: Should we implement a build-time pre-processor in `render.ts` to execute schema-declared pipeline rules, or formally delete `pipelineRules` from schemas?
2. **Scope of `Variant: "meta"`**:
   - *Context*: Badge implements `variant="meta"` for un-styled, sentence-case eyebrow text.
   - *Question*: Should `'meta'` be added to the global `VARIANTS` array in `shared-enums.ts` (making it available to all atoms), or should `shared-enums.ts` introduce atom-specific variant exports (`BADGE_VARIANTS`, `BUTTON_VARIANTS`)?
3. **Badge Icon Semantic Announcement**:
   - *Context*: `Badge.schema.json` permits `media.semanticRole: "content-symbol"`, but `Badge.astro` hardcodes `aria-hidden="true"`.
   - *Question*: Should badges support screen-reader announced icons (e.g. "Warning: Draft"), or should all badge icons be strictly defined as decorative visual enhancements?
4. **Single Source of Truth Mechanism for Shared Enums**:
   - *Context*: `shared-enums.ts` and `shared-enums.json` continually drift.
   - *Question*: Should `shared-enums.ts` be designated as the sole authoring source, with `shared-enums.json` automatically generated via an `npm run build:enums` script?
