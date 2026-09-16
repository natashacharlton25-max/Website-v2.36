# Badge Contract Divergence Audit

## 1. Executive Summary

A forensic architectural audit of the local repository (`C:\Users\Business\Website v2.36`) was conducted comparing the **current finished Badge atom** (`Badge.astro`, `Badge.css`, `Badge.responsive.css`, `Badge.schema.json`, `index.ts`) against the tooling, schemas, shared enums, and validators surrounding it.

The finished Badge atom represents a modern, mature component implementation adhering to the Stelladore design system principles (no hardcoded colours, full reliance on global mixins, zero local design tokens, rem-based length scaling, robust OKLCH contrast mechanics, and rich visual treatments including glass, liquid-glass, meta, and animated gradient cycles). However, **the surrounding tooling, enums, and validators have diverged significantly from Badge's actual architecture**.

### Key Findings

1. **Shared Enum Desynchronisation (`shared-enums.json` vs `shared-enums.ts`)**:
   `shared-enums.json` is severely stale and still defines old ROYGBIV colour names (`red`, `orange`, `yellow`, `teal`, `blue`, `purple`, `pink`) instead of canonical positional tokens (`rainbow-1` through `rainbow-7`). Furthermore, `shared-enums.json` omits size `'xl'`, omits `GRADIENT_ANIMATE_DIRECTIONS`, and omits extended fill/stagger enums.
2. **TypeScript / Schema Vocabulary Mismatch**:
   - `Badge.schema.json` and `Badge.css` fully implement the `meta` variant (for metadata lines and eyebrow tags). However, `shared-enums.ts` defines `VARIANTS = ['fill', 'outline', 'glass', 'liquid-glass']` without `'meta'`. Because `Badge.astro` imports `Variant` from `shared-enums.ts`, passing `variant="meta"` produces a TypeScript type mismatch.
   - `Badge.schema.json` declares 19 values for `gradientBlend` (8 named blends + 3 brand colours + 7 rainbow presets + `rainbow`), whereas `shared-enums.ts` defines only 8 blends.
   - `Badge.schema.json` and `Badge.astro` support `gradientAnimateSpeed` (`slow`, `default`, `fast`), but this enum is absent from both `shared-enums.ts` and `shared-enums.json`.
3. **Shape Vocabulary Divergence**:
   `shared-enums.ts` defines `SHAPES` with 5 values including `'pill'`. The Badge atom deliberately rejects `'pill'` (Badge has no pill CSS rule; badges are styled using radius-full or soft). `Badge.astro` resolves this via an inline type `BadgeShape`, documenting that Badge's shape contract is narrower than the shared enum.
4. **Concrete CSS Bug in `Badge.css` (`.badge--liquid-glass`)**:
   In `Badge.css` lines 175–176, `backdrop-filter: var(--liquid-blur);` is declared. In `src/styles/tokens/glass.css`, `--liquid-blur` is defined as `10px` (a raw length, unlike `--glass-blur: blur(8px)`). This emits `backdrop-filter: 10px;`, which is an invalid CSS filter declaration and fails in browser rendering engines. (In contrast, `Button.css` correctly wraps it as `backdrop-filter: blur(var(--liquid-blur));`).
5. **Concrete Explainer Suppression Bug in `src/lib/render.ts`**:
   `render.ts` lines 66–70 document:
   `// Current rules: Badge → media:Icon → noExplainer: true`
   `// Animation explainers (the AAC card stack) are too heavy for badge-scale icons.`
   However, line 77 defines `NO_EXPLAINER_PARENTS = new Set<string>(['Button'])` — completely omitting `Badge`. Consequently, the pipeline default is never applied to Badge instances.
6. **Accessibility & Semantic Role Contradiction on Nested Media**:
   `Badge.schema.json` declares `media.semanticRole` with enum `['decorative', 'ui-control', 'content-symbol']`. However, `Badge.astro` lines 187–188 unconditionally render nested icons with `aria-hidden="true"`. Furthermore, `render-controller.ts` line 167 unconditionally flags `.badge__icon` with `data-textonly-hidden` in textonly mode, stripping the icon even if it was designated as a `content-symbol`.
7. **Unimplemented Pipeline Rule**:
   `Badge.schema.json` declares `pipelineRules.altTextRule` (`append-to-adjacent-image`). No validator (`schema-validator.ts`, `validate-atoms.cjs`, `validate-data.ts`) or build script implements or validates `pipelineRules`.
8. **Render Mode Contract Omission**:
   `Badge.schema.json` declares only three render modes: `{ full, reduced, textonly }`. It omits `assistive`, despite `src/styles/gates/assistive-gate.css` containing active CSS rules for `[data-render="assistive"] .badge`.
9. **Validator Blind Spots in `validate-atoms.cjs`**:
   `validate-atoms.cjs` reports `Badge ✅ 0 issues`, but only because:
   - Rule 30 only checks `props.visual.color`, missing Badge's split `brandColor` and `rainbowColor`.
   - Rule 35 only checks `visual`, `animation`, and `behaviour`, skipping `typography` and `gradient`.
   - Rule 28 strictly forbids `assistive` in schema renders, penalising schemas that attempt to document assistive render support.

---

## 2. Current Badge Architecture

The Badge atom is a compact inline label component designed for status indicators, categories, metadata, and tags. It composes child atoms (`Text`, `Heading`, `Icon`, `LottieIcon`) and integrates with the Stelladore token architecture.

### Component Manifest
- **Component Name**: `Badge`
- **Category**: `atom`
- **Files**:
  - `src/components/atoms/Badge/Badge.astro` (JSX rendering, gradient resolution, heading vs text routing)
  - `src/components/atoms/Badge/Badge.css` (Base styling, variants, shapes, sizes, shadows)
  - `src/components/atoms/Badge/Badge.responsive.css` (Breakpoint notes; responsive rules live in global `responsive.css`)
  - `src/components/atoms/Badge/Badge.schema.json` (Contract schema, prop groups, pipeline rules)
  - `src/components/atoms/Badge/index.ts` (Barrel file exporting Badge component, schema, and CSS imports)

### Accepted Props & Classification

| Prop Name | Classification | Type / Allowed Values | Default Value | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `contentBadge` | CONTENT | `string` | *Required* | Visible text label. Keyed with atom suffix to prevent collision during composition. |
| `brandColor` | ENUM | `'primary' \| 'secondary' \| 'neutral'` | `'primary'` | Resolves via global `.color--{brandColor}` mixin. |
| `rainbowColor` | ENUM | `'rainbow-1' .. 'rainbow-7'` | `undefined` | Positional rainbow token. Overrides `brandColor` when present. |
| `colorTier` | ENUM | `'tint' \| 'mid' \| 'base' \| 'emphasis'` | `undefined` (implicit baseline `'base'`) | Shifts `--_color` intensity. Emits `.color--tier-{tier}` unless `'base'`. |
| `variant` | ENUM | `'fill' \| 'outline' \| 'glass' \| 'liquid-glass' \| 'meta'` | `'fill'` | Visual treatment. `meta` removes background/border for eyebrow lines. |
| `shape` | ENUM | `'sharp' \| 'subtle' \| 'soft' \| 'rounded'` | `'soft'` | Border radius scale. `'pill'` is rejected; `'rounded'` achieves pill shape with padding. |
| `size` | ENUM | `'sm' \| 'md' \| 'lg' \| 'xl'` | `undefined` (implicit baseline `'md'`) | Font size and padding scale. `'md'` emits no class (default CSS applies). |
| `shadow` | ENUM | `'none' \| 'out' \| 'drop' \| 'in' \| 'elevated' \| 'glow' \| 'glow-intense' \| 'glow-inner'` | `undefined` (implicit baseline `'none'`) | Box-shadow treatments. Glow tokens resolve currentColor. |
| `borderWeight` | ENUM | `'thin' \| 'thick'` | `undefined` | Modifies border width from default `--border-width-2`. |
| `gradient` | BOOLEAN | `boolean` | `false` | Enables linear gradient background or text. Radial is forbidden on atoms. |
| `gradientBlend` | ENUM | 19 blends (presets, brand, rainbow) | `undefined` | Mixed blend preset or specific colour gradient name. |
| `gradientDirection` | ENUM | 8 intent directions | `'diagonal'` | Linear gradient angle mapping. |
| `gradientEmerge` | BOOLEAN | `boolean` | `false` | First 50% fades from transparent to solid. |
| `gradientFade` | BOOLEAN | `boolean` | `false` | Last 20% fades to transparent. |
| `gradientFlip` | BOOLEAN | `boolean` | `false` | Reverses gradient direction on label text. |
| `gradientAnimated` | BOOLEAN | `boolean` | `false` | Adds CSS flow animation via background-size. |
| `gradientAnimateDirection`| ENUM | `'cw' \| 'ccw' \| 'sway'` | `undefined` (implicit baseline `'cw'`) | Direction of animated gradient flow. |
| `gradientAnimateSpeed` | ENUM | `'slow' \| 'default' \| 'fast'` | `undefined` (implicit baseline `'default'`) | Speed of animated gradient flow (20s, 12s, 6s). |
| `gradientCycle` | BOOLEAN | `boolean` | `false` | Dynamically injects `--_cycle-a/b/c` stops for element color-cycling. |
| `fontFamily` | ENUM | `'heading' \| 'body' \| 'body-alt' \| 'handwriting' \| 'mono'`| `undefined` (default body) | Forwarded to child Text or Heading atom. |
| `fontWeight` | ENUM | `'normal' \| 'medium' \| 'semibold' \| 'bold' \| 'extrabold'` | `undefined` (implicit baseline `'bold'`) | Forwarded to child Text/Heading unless `'bold'`. |
| `uppercase` | BOOLEAN | `boolean` | `true` | When `false`, adds `.badge--lowercase` (`text-transform: none`). |
| `semanticRole` | ENUM | `'status' \| 'tag' \| 'label' \| 'none'` | `'status'` | Sets `role="note"` unless `'none'`. Emits `data-semantic-role`. |
| `level` | NUMBER / ENUM | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `undefined` | When set, routes label rendering through `<Heading level={level}>`. |
| `media` | STRUCTURED OBJECT / NESTED COMPONENT | `{ component: "Icon" \| "LottieIcon", semanticRole: ..., ...childProps }` | `undefined` | Opts into `_lockProps: true` deep validation against child atom schema. |

### Architectural Behaviour & Composition Flow

1. **Colour Hierarchy**:
   - `color` resolves as `rainbowColor || brandColor` (default `'primary'`).
   - Root span emits `.color--{color}`.
   - If `colorTier` is present and not `'base'`, emits `.color--tier-{colorTier}`.
2. **Label Rendering Dispatch**:
   - If `level` is set: Renders `<Heading>` with `level={level}`.
   - Else if `(gradient || gradientBlend) && (variant !== 'fill' || gradientFlip)`: Renders `<Heading level={6} family={fontFamily || 'body'}>` to leverage Heading's `.gradient__text` `background-clip: text` pipeline.
   - Otherwise: Renders `<Text contentText={label} as="span">`.
3. **Child Icon Handling**:
   - Renders `<Icon>` or `<LottieIcon>` before the label.
   - Hardcodes `aria-hidden="true"` and `class="badge__icon"`.
4. **Gradient Animation Cycle**:
   - When `gradientCycle: true`, calls `getGradientStopColours(gradientName)` and writes CSS custom properties (`--_cycle-a`, `--_cycle-b`, `--_cycle-c`) into an inline `style` attribute.

---

## 3. Badge Property Matrix

| Property | Badge.astro | Badge.schema.json | shared-enums.ts | shared-enums.json | Runtime Validator | Atom Validator | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `contentBadge` | `string` (required) | `string` (required) | N/A (Content) | N/A (Content) | Supported (`isContentProp`) | N/A | **MATCH** (Free text) |
| `brandColor` | `BrandColour` ('primary') | enum: 3 values ('primary')| `BRAND_COLOURS` (3) | `colour.brand` (3) | Supported | Supported (R26) | **MATCH** |
| `rainbowColor` | `RainbowColour` | enum: `rainbow-1..7` | `RAINBOW_COLOURS` (7) | `colour.rainbow` (`red..pink`) | Supported | Skipped (R30 checks `visual.color`) | **DIVERGENCE** (`shared-enums.json` stale) |
| `colorTier` | `ColourTier` | enum: 4 values | `COLOUR_TIERS` (4) | `colour.colourTier` (4)| Supported | Supported (R26) | **MATCH** |
| `variant` | `Variant` ('fill') | enum: 5 values ('fill') | `VARIANTS` (4 values) | `visual.variant` (4) | Supported | Supported (R35) | **DIVERGENCE** (`meta` missing from shared-enums) |
| `shape` | `BadgeShape` ('soft') | enum: 4 values ('soft') | `SHAPES` (5 values) | `visual.shape` (5) | Supported | Supported (R35) | **DIVERGENCE** (`pill` rejected by Badge) |
| `size` | `Size` | enum: 4 values | `SIZES` (4 values) | `visual.size` (3 values)| Supported | Supported (R35, R43) | **DIVERGENCE** (`xl` missing in `shared-enums.json`) |
| `shadow` | `Shadow` | enum: 8 values | `SHADOWS` (8 values) | `visual.shadow` (8) | Supported | Supported (R35) | **MATCH** |
| `borderWeight` | `BorderWeight` | enum: 2 values | `BORDER_WEIGHTS` (2) | `visual.borderWeight` (2)| Supported | Supported (R35) | **MATCH** |
| `gradient` | `boolean` (false) | `boolean` (false) | N/A (Primitive) | N/A (Primitive) | Supported | N/A | **MATCH** |
| `gradientBlend`| `GradientBlend` | enum: 19 values | `GRADIENT_BLENDS` (8)| `gradient.blend` (8) | Supported | Skipped (R35 skips `gradient`) | **DIVERGENCE** (Schema has 19, TS/JSON have 8) |
| `gradientDirection`| `GradientDirection` ('diagonal')| enum: 8 values ('diagonal')| `GRADIENT_DIRECTIONS` (8)| `gradient.direction` (8)| Supported | Skipped (R35 skips `gradient`) | **MATCH** |
| `gradientEmerge`| `boolean` (false) | `boolean` (false) | N/A (Primitive) | N/A (Primitive) | Supported | N/A | **MATCH** |
| `gradientFade` | `boolean` (false) | `boolean` (false) | N/A (Primitive) | N/A (Primitive) | Supported | N/A | **MATCH** |
| `gradientFlip` | `boolean` (false) | `boolean` (false) | N/A (Primitive) | N/A (Primitive) | Supported | N/A | **MATCH** |
| `gradientAnimated`| `boolean` (false) | `boolean` (false) | N/A (Primitive) | N/A (Primitive) | Supported | N/A | **MATCH** |
| `gradientAnimateDirection`| `'cw' \| 'ccw' \| 'sway'` | enum: 3 values | `GRADIENT_ANIMATE_DIRECTIONS` (3) | Missing | Supported | Supported (R35) | **DIVERGENCE** (Missing in `shared-enums.json`) |
| `gradientAnimateSpeed`| `'slow' \| 'default' \| 'fast'`| enum: 3 values | Missing | Missing | Supported | Supported (R35) | **DIVERGENCE** (Missing in shared-enums TS & JSON) |
| `gradientCycle`| `boolean` (false) | `boolean` (false) | N/A (Primitive) | N/A (Primitive) | Supported | N/A | **MATCH** |
| `fontFamily` | `FontFamily` | enum: 5 values | `FONT_FAMILIES` (5) | `visual.fontFamily` (5) | Supported | Skipped (R35 skips `typography`)| **MATCH** |
| `fontWeight` | `FontWeight` | enum: 5 values | `FONT_WEIGHTS` (5) | `visual.fontWeight` (5) | Supported | Skipped (R35 skips `typography`)| **MATCH** |
| `uppercase` | `boolean` (true) | `boolean` (true) | N/A (Primitive) | N/A (Primitive) | Supported | N/A | **MATCH** |
| `semanticRole` | `SemanticRole` ('status') | enum: 4 values ('status') | `SEMANTIC_ROLES` (4) | `content.semanticRole` (4)| Supported | Supported (R35) | **MATCH** |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | number enum: [1..6] | Missing (has h1..h6) | Missing | Supported | Supported (R35) | **MATCH** (Local numeric enum) |
| `media` | `Record<string, any>` | object (`_lockProps: true`)| N/A (Component Node) | N/A (Component Node) | Supported (Move 1 & Move 2) | N/A | **MATCH** (Deep validation active) |
| `renders` | N/A | full, reduced, textonly | N/A | N/A | Ignored | Enforced (R28 forbids `assistive`)| **DIVERGENCE** (`assistive` omitted from schema) |
| `pipelineRules`| N/A | `altTextRule` | N/A | N/A | Ignored | Ignored | **DIVERGENCE** (Unimplemented in tooling) |

---

## 4. Schema Divergences

Comparing `Badge.astro` directly with `Badge.schema.json`:

1. **`variant: "meta"`**:
   - **Schema Status**: `Badge.schema.json` declares `"enum": ["fill", "outline", "glass", "liquid-glass", "meta"]`.
   - **CSS Status**: `Badge.css` implements `.badge--meta` (lines 67–74).
   - **Astro Status**: `Badge.astro` imports `Variant` from `src/lib/shared-enums.ts`. In `shared-enums.ts`, `VARIANTS` does *not* contain `'meta'`.
   - **Divergence**: Type definition is too restrictive; TypeScript compilation produces an error if `variant="meta"` is typed strictly against `Variant`.
2. **`gradientBlend` Expanded Values**:
   - **Schema Status**: `Badge.schema.json` defines 19 values: 8 blend presets (`hero`, `sunset`, `brand-emerge`, `brand-fade`, `preset-tint`, `preset-mid`, `preset-base`, `preset-emphasis`) + 11 colour blends (`primary`, `secondary`, `neutral`, `red`, `orange`, `yellow`, `teal`, `blue`, `purple`, `pink`, `rainbow`).
   - **Astro Status**: `Badge.astro` imports `GradientBlend` from `shared-enums.ts` (which only contains 8 values).
   - **Divergence**: `Badge.schema.json` allows values that TypeScript types reject.
3. **`gradientAnimateSpeed`**:
   - **Schema Status**: Declares `"enum": ["slow", "default", "fast"]`.
   - **Astro Status**: Defines local union `'slow' | 'default' | 'fast'`.
   - **Shared Enums**: Missing from both `shared-enums.ts` and `shared-enums.json`.
4. **`media.semanticRole` vs `Badge.astro` Markup**:
   - **Schema Status**: Declares `semanticRole` as required enum `["decorative", "ui-control", "content-symbol"]` with default `"decorative"`.
   - **Astro Status**: `Badge.astro` unconditionally passes `aria-hidden="true"` to `<Icon>` and `<LottieIcon>`.
   - **Divergence**: The schema promises support for accessible content symbols (`content-symbol`) or interactive icons (`ui-control`), but `Badge.astro` strips them from the accessibility tree entirely.
5. **Missing `assistive` Render Mode Key**:
   - **Schema Status**: `"renders": { "full": "Badge.astro", "reduced": "Badge.astro", "textonly": "Badge.astro" }`.
   - **CSS Status**: `src/styles/gates/assistive-gate.css` lines 70–79 contains live, production CSS for `[data-render="assistive"] .badge`.
   - **Divergence**: Schema claims only 3 render modes, omitting `assistive` which the design system implements.
6. **Orphaned `pipelineRules`**:
   - **Schema Status**: Declares `pipelineRules.altTextRule` (`append-to-adjacent-image`).
   - **Tooling Status**: Neither `schema-validator.ts`, `validate-atoms.cjs`, `validate-data.ts`, nor `render-controller.ts` evaluates `pipelineRules`.

---

## 5. Shared Enum Divergences

Comparing `src/lib/shared-enums.ts` and `src/lib/shared-enums.json` against `Badge.schema.json` and `Badge.astro`:

1. **Severe TS vs JSON Desynchronisation**:
   - **Rainbow Colours**:
     - `shared-enums.ts`: `RAINBOW_COLOURS = ['rainbow-1', 'rainbow-2', 'rainbow-3', 'rainbow-4', 'rainbow-5', 'rainbow-6', 'rainbow-7']`
     - `Badge.schema.json`: matches `rainbow-1`..`rainbow-7`.
     - `shared-enums.json`: `"rainbow": ["red", "orange", "yellow", "teal", "blue", "purple", "pink"]`. (Outdated ROYGBIV names).
   - **Size Scale**:
     - `shared-enums.ts`: `SIZES = ['sm', 'md', 'lg', 'xl']`.
     - `Badge.schema.json`: `["sm", "md", "lg", "xl"]`.
     - `shared-enums.json`: `"size": ["sm", "md", "lg"]` (Omits `'xl'`).
   - **Gradient Animation Direction**:
     - `shared-enums.ts`: `GRADIENT_ANIMATE_DIRECTIONS = ['cw', 'ccw', 'sway']`.
     - `Badge.schema.json`: `["cw", "ccw", "sway"]`.
     - `shared-enums.json`: Missing key.
2. **Missing `meta` in `Variant`**:
   Neither `shared-enums.ts` nor `shared-enums.json` contains `meta`, despite `Badge.schema.json` and `Badge.css` implementing it.
3. **Generic vs Component-Specific Shape**:
   `shared-enums.ts` contains `SHAPES = ['sharp', 'subtle', 'soft', 'rounded', 'pill']`. Badge does not support `pill`. `Badge.astro` was forced to declare an ad-hoc local type `BadgeShape`. The shared enums system lacks a mechanism to represent component-specific subsets without ad-hoc TypeScript overrides.
4. **Missing `gradientAnimateSpeed`**:
   Present in `Badge.astro` and `Badge.schema.json` (`slow`, `default`, `fast`), but absent from both shared enum files.

---

## 6. Runtime Validator Divergences

Evaluation of `src/lib/schema-validator.ts` against Badge:

1. **`SchemaProps` Interface Typing (SUPPORTED PARTIALLY)**:
   - In `schema-validator.ts` lines 29–34, `interface SchemaProps` defines only `content`, `visual`, `animation`, and `colour`.
   - `Badge.schema.json` uses additional canonical groups: `rainbow`, `gradient`, `typography`, and `media`.
   - At runtime, `flattenSchema` flattens all groups via `Object.entries(schema.props)`. However, the TypeScript definition is incomplete.
2. **Nested Slot `_lockProps` Deep Validation (SUPPORTED CORRECTLY)**:
   - `Badge.schema.json` sets `media._lockProps: true`.
   - `schema-validator.ts` lines 483–506 correctly recurses into the child atom's schema (`Icon` or `LottieIcon`) via `globalThis.__schemaMap`.
   - Move 1 (accept-list validation on `component`) and Move 2 (child prop recursion) operate as intended.
3. **Default-Aware Required Props Check (SUPPORTED CORRECTLY)**:
   - `schema-validator.ts` lines 350–358 checks:
     `if (def.required && !(prop in item) && def.default === undefined)`
   - In `media`, `semanticRole` is declared as `required: true` with `"default": "decorative"`. The validator correctly treats this as satisfied by default, avoiding false validation errors.
4. **Pipeline Rules (`pipelineRules`) (IGNORED)**:
   - `schema-validator.ts` evaluates `schema._rules` via `evaluateRules()` (lines 249–322).
   - It has no logic to parse, validate, or execute `schema.pipelineRules`. `altTextRule` is completely ignored.
5. **Schema Integrity Warnings (TOO PERMISSIVE)**:
   - `validateSchemaIntegrity` checks that string props declare an enum unless they match `isContentProp` or `FREE_STRING_PROPS`.
   - However, any failure emits a `console.warn` and does not set `valid = false`. Schemas with un-restricted strings pass validation.
6. **Render Modes and Renders Block (IGNORED)**:
   - `schema-validator.ts` does not validate `schema.renders`. It does not verify whether targets exist or whether `assistive` is present or omitted.

---

## 7. Atom Validator Divergences

Audit of `scripts/validate-atoms.cjs` rules against Badge:

| Rule # | Rule Name | Classification | Analysis vs Finished Badge Implementation |
| :--- | :--- | :--- | :--- |
| **Rule 1** | Nested `var()` fallback | **CURRENT** | Correctly forbids `var(--a, var(--b))`. Badge has no nested fallbacks. |
| **Rule 2** | Hardcoded `px >= 10` | **CURRENT** | Badge uses `0` and token references (`var(--radius-*)`, `var(--space-*)`). Passes. |
| **Rule 2b**| Hardcoded border px (1–6px) | **CURRENT** | Badge uses `var(--border-width-2)`, `var(--border-width)`, `var(--border-width-md)`. Passes. |
| **Rule 3** | Hardcoded hex colour | **CURRENT** | Badge contains no hex colours. Passes. |
| **Rule 4** | Hardcoded rgb/hsl | **TOO PERMISSIVE** | Checks `rgba?\|hsla?` outside `color-mix`. Does NOT check `oklch` literals or named colours, failing to enforce New Canonical Rule 1. |
| **Rule 5** | Hardcoded opacity | **CURRENT** | Badge has no raw opacity literals. Passes. |
| **Rule 6** | Hardcoded duration | **CURRENT** | Badge has no raw durations in CSS. Passes. |
| **Rule 7** | Hardcoded easing | **CURRENT** | Badge has no raw easing curves. Passes. |
| **Rule 8** | Inline styles in Astro | **CURRENT** | Badge uses `style={badgeAnimStyle}` for gradient cycling, which is explicitly allowlisted in `styleExceptions.Badge`. |
| **Rule 9** | CSS computation maps | **CURRENT** | Badge has no CSS computation maps in `.astro`. Passes. |
| **Rule 10**| Rest spread `[key: string]` | **CURRENT** | Badge Props interface is strictly typed. Passes. |
| **Rule 11**| Assistive in component CSS | **WRONG LAYER** | Forbids `[data-render="assistive"]` in component CSS, routing to `assistive-gate.css`. Badge complies. |
| **Rule 12**| Zone/gate rules in component CSS| **CURRENT** | Badge contains no dark/HC/textonly rules in `Badge.css`. Passes. |
| **Rule 13**| Token type / cssProperty | **CURRENT** | Badge schema has no `"type": "token"`. Passes. |
| **Rule 14**| Assistive pointing to `.astro`| **FALSE POSITIVE**| Flags schemas where `"assistive"` points to an `.astro` file. Contradicts 4-mode contract. |
| **Rule 16**| `@layer` wrapper | **CURRENT** | Badge CSS does not use `@layer`. Passes. |
| **Rule 17**| `!important` | **CURRENT** | Badge CSS has no `!important`. Passes. |
| **Rule 18**| `@media (prefers-reduced-motion)`| **CURRENT** | Motion gating handled by Stelladore gates, not atom CSS. Passes. |
| **Rule 19**| `.a11y-*` class selector | **CURRENT** | Badge CSS has no `.a11y-*` selectors. Passes. |
| **Rule 20**| `#a11y-content-wrapper` | **CURRENT** | No references in Badge. Passes. |
| **Rule 21**| `transition:` in component CSS | **CURRENT** | Badge has no transition declarations. Passes. |
| **Rule 22**| `:focus-visible` in CSS | **CURRENT** | Badge is non-interactive (`cursor: default`), has no focus rules. Passes. |
| **Rule 23**| `:global()` in `.astro` | **CURRENT** | Badge has no `:global()` selectors. Passes. |
| **Rule 24**| Scoped `<style>` in `.astro` | **CURRENT** | All styles reside in `Badge.css`. Passes. |
| **Rule 25**| Missing required prop groups | **TOO RESTRICTIVE**| Strictly requires `content, visual, animation, colour`. Badge has these + `rainbow, gradient, typography, media`. |
| **Rule 26**| Colour group props | **CURRENT** | Checks props inside `colour`. Badge puts `brandColor` in `colour` and `rainbowColor` in `rainbow`. Passes. |
| **Rule 27**| Token-name default | **CURRENT** | Badge has no defaults named like tokens. Passes. |
| **Rule 28**| Unexpected render keys | **OUTDATED** | Only allows `['full', 'reduced', 'textonly']`. Explicitly rejects `assistive`. |
| **Rule 29**| `:hover` in component CSS | **CURRENT** | Badge has no `:hover` rules. Passes. |
| **Rule 30**| Canonical color enum check | **OBSOLETE / MISMATCH**| Checks `props.visual.color` against 11 colours. Modern atoms use `colour.brandColor` and `rainbow.rainbowColor`. Skips Badge entirely! |
| **Rule 31**| `@keyframes` in component CSS | **CURRENT** | Badge has no `@keyframes`. Passes. |
| **Rule 32**| Animation without tokens | **CURRENT** | Badge animation uses global speed tokens. Passes. |
| **Rule 33**| Animation in wrong group | **CURRENT** | Badge animation props reside in `animation`. Passes. |
| **Rule 34**| Ungated animation import | **CURRENT** | Badge imports no JS animation libraries. Passes. |
| **Rule 35**| String props without enum | **TOO PERMISSIVE** | Only checks `visual`, `animation`, `behaviour`. Completely ignores `typography` and `gradient`! |
| **Rule 36**| `class`/`style` in schema | **CURRENT** | Schema contains no class/style escape hatches. Passes. |
| **Rule 37**| Hardcoded enum union in Astro| **CURRENT** | Checks for inline `'spin' \| 'bounce'`. Badge imports shared enums. Passes. |
| **Rule 38**| Radial gradient on atoms | **CURRENT** | Forbids `gradientType`/`gradientFocus` on atoms. Badge complies. Passes. |
| **Rule 39**| `slots`/`class`/`style` at root| **CURRENT** | Not present in Badge schema. Passes. |
| **Rule 40**| Per-atom colour classes | **CURRENT** | Forbids `.badge--primary`. Badge uses `.color--{name}` mixin. Passes. |
| **Rule 42**| Duplicate CSS imports | **CURRENT** | Badge CSS imported only via `index.ts` barrel, not `global.css`. Passes. |
| **Rule 43**| Schema vs Astro default drift | **CURRENT** | Compares `Badge.schema.json` defaults with `Badge.astro` destructure. Passes. |
| **Rule 44**| Hardcoded inline `<svg>` | **CURRENT** | Badge has no inline `<svg>`. Passes. |
| **Rule 45**| Phantom token references | **CURRENT** | Verifies all `var(--token)` exist in `src/styles/`. Passes. |

---

## 8. CSS / Stelladore Audit

A comprehensive review of `Badge.css` and `Badge.responsive.css` against the New Canonical Design Rules:

### 1. Colours & Tokens
- **Zero Hardcoded Colours**: Badge contains no hex, rgb, hsl, or raw colour literals. All colours derive from:
  - `--_color` (set by global `.color--{name}` mixin)
  - `--_on-color` (computed via OKLCH auto-contrast)
  - `--_tier-emphasis` (for `.badge--meta` and text)
  - `--page-bg`, `--text-emphasis`, `--liquid-tint`, `--liquid-border`
- **Transparent Keyword**: Used only for transparent background/border resets (`border: var(--border-width-2) solid transparent;`, `background-color: transparent;`).
- **Color-Mix Integration**: Uses OKLCH color-mixing with tokens:
  `color-mix(in oklch, var(--_color) 30%, var(--page-bg))` (glass border)
  `color-mix(in oklch, var(--_color) 8%, var(--liquid-tint))` (liquid-glass background)
  `color-mix(in oklch, var(--_color) 20%, var(--liquid-border))` (liquid-glass border)

### 2. Design Tokens & Dimensions
- **Spacing**: Strictly consumes `--space-xs`, `--space-2xs`, `--space-sm`, `--space-md`, `--space-lg`.
- **Border Radius**: Uses `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`, and `0`.
- **Borders**: Uses `--border-width`, `--border-width-2`, `--border-width-md`.
- **Shadows**: Uses `--shadow-sm`, `--shadow-lg`, `--shadow-neu-hover`, `--shadow-elevated`.
- **Glows**: Uses global currentColor glow tokens (`--glow-currentcolor`, `--glow-currentcolor-intense`, `--glow-currentcolor-inner`) which are gated by `opacity-gate.css`.

### 3. Lengths and Rem Scaling
- All font sizes (`--text-fine`, `--text-veryfine`, `--text-h5`, `--text-h4`) resolve to `rem` in `typography.css`.
- Icon dimensions use relative `1em` to scale proportionally with badge typography.
- Line height is unitless (`1`).
- Aspect ratio is unitless (`1`).

### 4. Theme & Accessibility Integration
- **Dark Mode**: `theme-luminance-dark.css` explicitly confirms Badge requires zero component-level dark overrides because `--_color` and `--_on-color` dynamically flip via the theme engine.
- **High Contrast**: `high-contrast.css` confirms Badge requires zero HC overrides because semantic tokens provide 7:1 / 9:1 AAA contrast ratios.
- **Assistive Mode**: Handled cleanly in `src/styles/gates/assistive-gate.css` (`[data-render="assistive"] .badge`).
- **Responsive Sizing**: Breakpoint collapse at 200px (strip icons, force fill) is implemented in `src/styles/tokens/responsive.css`.

### 5. Identified Bug: Invalid CSS in Liquid Glass
- In `Badge.css` line 175–176:
  ```css
  backdrop-filter: var(--liquid-blur);
  -webkit-backdrop-filter: var(--liquid-blur);
  ```
- In `src/styles/tokens/glass.css` line 58:
  ```css
  --liquid-blur: 10px;
  ```
- **Failure**: In CSS, `backdrop-filter` requires a filter function (`blur(10px)`). Setting `backdrop-filter: 10px;` is invalid and discarded by browsers.
- **Contrast with Button**: `Button.css` line 694 correctly implements `backdrop-filter: blur(var(--liquid-blur));`.

---

## 9. Renderer Divergences

Inspection of `src/lib/render.ts`, `src/components/Renderer.astro`, and `src/lib/render-controller.ts`:

1. **Failure to Suppress Animation Explainers on Badge Icons (`render.ts`)**:
   - `render.ts` lines 66–70 states:
     ```typescript
     // Current rules:
     //   Badge → media:Icon  →  noExplainer: true
     //     Animation explainers (the AAC card stack) are too heavy for badge-
     //     scale icons. Off by default; author opts in by setting
     //     noExplainer: false on a specific Icon if needed.
     ```
   - However, `render.ts` line 77 implements:
     ```typescript
     const NO_EXPLAINER_PARENTS = new Set<string>(['Button']);
     ```
   - **Impact**: `Badge` was never added to `NO_EXPLAINER_PARENTS`. Animated icons inside Badges erroneously render AAC explainer cards and tooltips, distorting the badge layout.
2. **Brute-Force Textonly Icon Stripping (`render-controller.ts`)**:
   - In `render-controller.ts` lines 165–169:
     ```typescript
     root.querySelectorAll<HTMLElement>('.badge').forEach(el => {
       // Icons inside badges are always decorative
       el.querySelectorAll('.badge__icon, .lottie-icon').forEach(icon => {
         icon.setAttribute('data-textonly-hidden', '');
       });
     ```
   - The runtime controller assumes all badge icons are decorative and unconditionally hides them in reading mode.
3. **Badge Component Hardcodes `aria-hidden` (`Badge.astro`)**:
   - `Badge.astro` lines 187–188:
     ```astro
     {media?.component === 'Icon' && <Icon {...(media as any)} class="badge__icon" aria-hidden="true" />}
     {media?.component === 'LottieIcon' && <LottieIcon {...(media as any)} class="badge__icon" aria-hidden="true" />}
     ```
   - The component hardcodes `aria-hidden="true"`. Even if the author passes `semanticRole: "content-symbol"` with an accessible label (`labelIcon: "Warning"`), Badge silences it.

---

## 10. Architectural Leaks

1. **Schema Knowledge Hardcoded in Validators**:
   `validate-atoms.cjs` hardcodes lists of allowed render keys (`['full', 'reduced', 'textonly']`) and groups (`['content', 'visual', 'animation', 'colour']`) instead of reading them from the design system configuration or schema meta-schemas.
2. **Renderer Comment vs Code Leak**:
   `render.ts` contains architectural documentation for Badge explainer suppression in comments, but the logic was never hooked up to the actual Set.
3. **Duplicated Enum Vocabularies**:
   Enum lists are duplicated across `shared-enums.ts`, `shared-enums.json`, `Badge.schema.json`, and local Astro type aliases (`BadgeShape`). When one changes (e.g. `Variant` adding `meta`, or `Size` adding `xl`), other files drift silently.
4. **Accessibility Split Across Layers**:
   Accessibility for badge icons is divided inconsistently across three layers:
   - Schema defines `semanticRole` enum on `media`.
   - Atom Astro template forces `aria-hidden="true"`.
   - Client JS (`render-controller.ts`) forces `data-textonly-hidden`.
5. **Orphaned Pipeline Contract in Schema**:
   `pipelineRules.altTextRule` is embedded in `Badge.schema.json`, but the pipeline build tooling does not recognise or execute schema-level pipeline rules.

---

## 11. Concrete Bugs

The following issues represent verifiable bugs with concrete evidence in code:

1. **BUG 1: Invalid CSS Property in `Badge.css`**:
   - **Location**: `src/components/atoms/Badge/Badge.css:175-176`
   - **Code**: `backdrop-filter: var(--liquid-blur);`
   - **Evidence**: In `src/styles/tokens/glass.css:58`, `--liquid-blur` is defined as `10px`. CSS requires `backdrop-filter: blur(10px)`. Setting `backdrop-filter: 10px;` is invalid CSS syntax and rejected by browsers.
2. **BUG 2: Missing Badge Explainer Suppression in `render.ts`**:
   - **Location**: `src/lib/render.ts:77`
   - **Code**: `const NO_EXPLAINER_PARENTS = new Set<string>(['Button']);`
   - **Evidence**: Lines 66–70 explicitly state that Badge must suppress icon explainers by default (`noExplainer: true`), but `Badge` is omitted from `NO_EXPLAINER_PARENTS`.
3. **BUG 3: Stale ROYGBIV Enums in `shared-enums.json`**:
   - **Location**: `src/lib/shared-enums.json:6`
   - **Code**: `"rainbow": ["red", "orange", "yellow", "teal", "blue", "purple", "pink"]`
   - **Evidence**: The entire design system migrated to positional tokens (`rainbow-1`..`rainbow-7`). `Badge.schema.json` and `shared-enums.ts` use `rainbow-1`..`7`. Any tool reading `shared-enums.json` encounters broken enum validation.
4. **BUG 4: Missing `meta` Variant in `shared-enums.ts`**:
   - **Location**: `src/lib/shared-enums.ts:62`
   - **Code**: `export const VARIANTS = ['fill', 'outline', 'glass', 'liquid-glass'] as const;`
   - **Evidence**: `Badge.schema.json` and `Badge.css` declare and implement `meta`. Because `Badge.astro` imports `Variant` from `shared-enums.ts`, passing `variant="meta"` violates TypeScript types.
5. **BUG 5: Icon Accessibility Silencing in `Badge.astro`**:
   - **Location**: `src/components/atoms/Badge/Badge.astro:187-188`
   - **Code**: `<Icon {...(media as any)} class="badge__icon" aria-hidden="true" />`
   - **Evidence**: Forces `aria-hidden="true"` even when `media.semanticRole` is `"content-symbol"`, preventing assistive technology from announcing meaningful badge icons.

---

## 12. Obsolete / Historical Rules

1. **Rule 30 in `scripts/validate-atoms.cjs`**:
   - Checks that `props.visual.color` contains canonical 11 colours from `shared-enums.json`.
   - **Why Obsolete**: Modern atoms no longer use a unified `color` prop in `visual`. They use `brandColor` under `colour` and `rainbowColor` under `rainbow`. Rule 30 is a relic of pre-split colour architecture and never fires on modern atoms.
2. **Rule 28 in `scripts/validate-atoms.cjs`**:
   - Allows only `['full', 'reduced', 'textonly']` in `schema.renders`.
   - **Why Obsolete**: Forbids documenting the `assistive` render mode, which the CSS gate architecture (`assistive-gate.css`) actively supports.
3. **Rule 35 Group Scope in `scripts/validate-atoms.cjs`**:
   - Enforces string enums only in `visual`, `animation`, and `behaviour`.
   - **Why Obsolete**: Created before `typography` and `gradient` were split into distinct canonical groups.
4. **ROYGBIV Colour Array in `shared-enums.json`**:
   - Remains in JSON while TypeScript and CSS moved to positional palette-agnostic tokens.

---

## 13. Missing Capabilities

1. **Component-Scoped Enums in Shared System**:
   The shared enums system cannot currently express component-specific constraints (e.g. Badge supporting `soft`, `rounded`, `subtle`, `sharp`, but rejecting `pill`) without resorting to local type overrides.
2. **Validation of Token Function Signatures**:
   `validate-atoms.cjs` Rule 45 verifies that tokens exist, but cannot detect when a token holding a raw dimension (`10px`) is used in a property requiring a functional wrapper (`blur(...)`).
3. **Automated Synchronization Between TypeScript and JSON Enums**:
   There is no build-time generator or check ensuring that `shared-enums.json` matches `shared-enums.ts`.
4. **Pipeline Rules Execution Engine**:
   Schemas can declare `pipelineRules`, but the build pipeline has no engine to evaluate them.

---

## 14. Recommended Target Architecture

*The following describes the target architecture at a conceptual level (no code modifications).*

```
                     ┌──────────────────────────────┐
                     │     Stelladore Tokens &      │
                     │       Theme Engine           │
                     └──────────────┬───────────────┘
                                    │
                                    ▼
                     ┌──────────────────────────────┐
                     │ Canonical Shared Vocabulary  │
                     │  (Single Source of Truth)    │
                     └──────┬────────────────┬──────┘
                            │                │
             (Generate JSON)│                │(Export TS Types)
                            ▼                ▼
                 ┌──────────────────┐  ┌──────────────────┐
                 │ shared-enums.json│  │ shared-enums.ts  │
                 └─────────┬────────┘  └────────┬─────────┘
                           │                    │
              ┌────────────┴───────┐            │
              ▼                    ▼            ▼
     ┌────────────────┐   ┌────────────────┐  ┌────────────────┐
     │ Atom Schemas   │   │ Runtime & Data │  │  Atom Astro    │
     │  (Badge.json)  │   │   Validators   │  │  Components    │
     └────────────────┘   └────────────────┘  └────────────────┘
```

### Core Principles

1. **Single Source of Truth for Controlled Vocabularies**:
   - Establish a single canonical source for enums (either TypeScript or JSON) with an automated build step that generates the other. Eliminate manual duplicate editing.
   - Support component-level narrowings in shared enums (e.g. `BADGE_SHAPES = SHAPES.filter(s => s !== 'pill')`).
2. **Unified Render Mode Contract**:
   - Formally recognize `assistive` alongside `full`, `reduced`, and `textonly` in `renders` blocks across all atom schemas.
   - Update Rule 28 in `validate-atoms.cjs` to permit `assistive` as a canonical render mode.
3. **Consistent Nested Component Contracts**:
   - When a container atom exposes a `media` slot with `semanticRole`, the atom template must respect the declared role:
     - If `media.semanticRole === 'decorative'`: apply `aria-hidden="true"`.
     - If `media.semanticRole === 'content-symbol'`: forward `aria-label` or allow child atom to handle accessible naming without forced suppression.
4. **Pipeline Rules Decoupling or Implementation**:
   - Either build a lightweight pre-processor in `render-pipeline.ts` that consumes `pipelineRules` across schemas, or formally retire `pipelineRules` from schemas to prevent unfulfilled contract promises.
5. **Syntax-Aware CSS Linting**:
   - Extend atom CSS validation to verify that tokens defining raw values (e.g. lengths) are wrapped in required CSS functions when consumed in shorthand or filter properties.

---

## 15. Priority Repair Queue

### P0 — Blocks Correct Architecture (Critical Fixes)
- **P0.1**: Fix `Badge.css` `.badge--liquid-glass`: change `backdrop-filter: var(--liquid-blur);` to `backdrop-filter: blur(var(--liquid-blur));` (and matching `-webkit-` prefix).
- **P0.2**: Fix `src/lib/render.ts`: add `'Badge'` to `NO_EXPLAINER_PARENTS = new Set<string>(['Button', 'Badge'])` to eliminate layout-distorting AAC card wrappers on badge icons.
- **P0.3**: Synchronise `src/lib/shared-enums.json` with `src/lib/shared-enums.ts`: update `colour.rainbow` to `rainbow-1..7`, add `'xl'` to `visual.size`, and add `GRADIENT_ANIMATE_DIRECTIONS`.

### P1 — Important Divergence (Contract Alignment)
- **P1.1**: Update `src/lib/shared-enums.ts` `VARIANTS`: add `'meta'` to `VARIANTS` array so `Badge.astro`'s `Variant` type matches `Badge.schema.json` and `Badge.css`.
- **P1.2**: Align `Badge.astro` icon accessibility: conditionally apply `aria-hidden="true"` only when `media?.semanticRole !== 'content-symbol'`.
- **P1.3**: Add `gradientAnimateSpeed` (`['slow', 'default', 'fast']`) to `shared-enums.ts` and `shared-enums.json`.
- **P1.4**: Update `Badge.schema.json` `renders` block: document `assistive: "Badge.astro"` (or document gate handling) and update `validate-atoms.cjs` Rule 28 to accept `assistive`.

### P2 — Clean-up & Tooling Consolidation
- **P2.1**: Update `validate-atoms.cjs` Rule 35 to inspect `typography` and `gradient` schema groups for un-restricted strings.
- **P2.2**: Update or retire Rule 30 in `validate-atoms.cjs`: remove legacy `props.visual.color` check; replace with validation of `colour.brandColor` and `rainbow.rainbowColor`.
- **P2.3**: Update `interface SchemaProps` in `src/lib/schema-validator.ts` to include `rainbow`, `gradient`, `typography`, and `media`.
- **P2.4**: Resolve `gradientBlend` vocabulary divergence: sync `Badge.schema.json`'s 19 blends with `shared-enums.ts` or formalise single-colour blends in the shared enum.

### P3 — Documentation & Minor Improvements
- **P3.1**: Decide fate of `pipelineRules.altTextRule`: either implement in pipeline pre-processor or remove from `Badge.schema.json`.
- **P3.2**: Update `render-controller.ts` textonly transform to check `data-semantic-role` on badge icons before applying `data-textonly-hidden`.

---

## Audit Integrity

### Files Inspected
- `src/components/atoms/Badge/Badge.astro`
- `src/components/atoms/Badge/Badge.css`
- `src/components/atoms/Badge/Badge.responsive.css`
- `src/components/atoms/Badge/Badge.schema.json`
- `src/components/atoms/Badge/index.ts`
- `src/styles/global.css`
- `src/styles/global/colour.css`
- `src/styles/global/gradient.css`
- `src/styles/tokens/typography.css`
- `src/styles/tokens/glass.css`
- `src/styles/tokens/responsive.css`
- `src/styles/zones/theme-luminance-dark.css`
- `src/styles/zones/high-contrast.css`
- `src/styles/gates/assistive-gate.css`
- `src/lib/shared-enums.ts`
- `src/lib/shared-enums.json`
- `src/lib/schema-validator.ts`
- `src/lib/render.ts`
- `src/lib/render-controller.ts`
- `src/components/Renderer.astro`
- `scripts/validate-atoms.cjs`
- `scripts/validate-data.ts`
- `src/data/test/badge.json`
- `_reference/superseded-2026-06-12/BUILD-STATUS.md`

### Files Not Found
- `C:\Users\Business\Website v2.36\BUILD-STATUS.md` (Referenced in prompt; located in repository at `_reference/superseded-2026-06-12/BUILD-STATUS.md`).

### Files That Could Not Be Conclusively Evaluated
- None. All referenced component source, style, and tooling files were located and inspected.

### Assumptions Made
- The live code in `src/components/atoms/Badge/*` is treated as the primary source of truth over all documentation and previous audit logs.
- The omission of `assistive` in `Badge.schema.json` was treated as an omission in the schema (given the existence of live CSS in `assistive-gate.css`), rather than the CSS being accidental.

### Areas Requiring Manual Confirmation
1. **`pipelineRules.altTextRule`**: Confirm whether the architectural vision still requires build-time appending of `Badge.contentBadge` to adjacent `Image.altWord`, or if this feature has been superseded by image caption/alt-span handling.
2. **Badge Icon Accessibility**: Confirm whether Badge icons are intended to ever be announced as content symbols, or if badges are strictly intended to be simple text labels with purely decorative visual icons.
