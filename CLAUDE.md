# Project Rules

## Scope Management
- This is a large multi-brand Astro project with 100+ style files
- For CSS fixes: ONLY read the specific file(s) relevant to the fix
- Do NOT scan or glob the full styles directory
- Ask which file to edit rather than searching broadly
- Keep context minimal — one fix per conversation if needed

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `render-refactor-phases-plan.md` | 11-phase refactor plan — phase order, Claude Code prompts, decision log |
| `src/components/audit-log.md` | Per-component audit status — update after every component is completed |
| `component-audit-checklist-v2.md` | **Current** — full per-component audit checklist (16 sections). Run against every component. |
| `component-audit-spec.md` | Older audit spec — superseded by v2 checklist for per-component audits |
| `component-audit-checklist.md` | Older checklist — superseded by v2 |
| `image-alt-text-cdn-plan.md` | Alt text architecture, display modes, AAC resolver pipeline, CDN plan |
| `AAC-Shim-Print-Traceability-Spec.md` | AAC form inputs, assistive tech layer, print traceability architecture |

After completing any component: update `src/components/audit-log.md` with status and notes.

### Audit Workflow
1. Audit each atom individually against `component-audit-checklist-v2.md`
2. Fix issues specific to that atom only
3. Log cross-atom dependencies as **deferred** in `src/components/audit-log.md` (e.g. "raw `<span>` should use Text atom")
4. After ALL atoms pass individually, run a **final atom render pass** to resolve all deferred cross-atom dependencies
5. Print stylesheet is a global layer built after all atoms pass — not per-component

### Known v2 checklist corrections (apply when auditing):
- **Section 9.2** — checklist expects `altAacPhrase` as Image prop. WRONG. `alt_aac_phrase` is a D1 field consumed by the resolver at build time. Image receives `altAacHtml` (pre-rendered). Not a component prop.
- **Section 9.3** — checklist expects `altSymbolId` as Image prop. WRONG. `alt_symbol_id` is a D1 FK used at the data layer. Never reaches the component.
- **Section 9.4** — checklist lists display modes as `hover | overlay | underneath | replace | off`. STALE. Actual CSS modes are `hidden | caption | overlay | tooltip | subtitle | replace` (6 modes, not 5). See Alt Text Architecture below for the correct mapping.

---

## CRITICAL: Extraction Process for Component Refactoring

### NEVER do these during refactoring:
- NEVER delete a11y.css, a11y.recovery.css, or any CSS file
- NEVER remove CSS rules from a file without extracting them first
- NEVER strip dark theme rules, highlight-links rules, or reduce-motion rules without confirmation
- NEVER modify .astro or .css files without showing the plan FIRST
- NEVER assume "banned in new architecture" means "delete" — it means "extract and relocate"
- NEVER make multiple file changes without user confirmation between each step

### The process — EVERY TIME, NO EXCEPTIONS:

#### Step 1: READ the existing files
- Read the component's current CSS files (base, a11y, recovery)
- List every rule and what it does
- Show the user what you found

#### Step 2: CATEGORISE each rule (show the user, wait for confirmation)
Present a table:
| Rule | Current location | Category | Extraction target |
For categories:
- `dark-theme` → extract to `src/styles/zones/theme-luminance-dark.css`
- `highlight-links` → extract to `src/styles/global/highlight-links.css`
- `reduce-motion` → animation is gated by prop-driven classes in `Component.css` (no separate file needed)
- `text-only` → informs the `renders.textonly` template (not CSS)
- `high-contrast` → extract to `src/styles/zones/high-contrast.css`
- `base-style` → stays in `Component.css` (remove @layer wrapper only)
- `already-covered` → the render architecture handles this, no extraction needed

#### Step 3: WAIT for user confirmation
- Do NOT proceed until the user confirms the categorisation
- Do NOT proceed until the user confirms the extraction targets exist
- If a target file doesn't exist yet, ASK whether to create it

#### Step 4: EXTRACT rules to their targets
- Copy each rule to its confirmed target file
- Adapt the selector format for the target (e.g. remove @layer wrapper, adjust nesting)
- Show the user what was written to each target file

#### Step 5: MOVE originals to _reference/
- Move the original a11y.css and recovery.css to `_reference/ComponentName/`
- NEVER delete — always move to _reference/

#### Step 6: CLEAN the component
- Only NOW remove @layer wrappers, .a11y-* selectors from the base CSS
- Only NOW restructure into the new file pattern
- Show the final file list for confirmation

### If you are unsure about ANY rule:
- ASK. Do not guess the extraction target.
- Do not assume a rule is "already covered" without explaining why.
- If a rule looks important but you don't know where it goes — STOP and ask.

---

## Atom Imports — USE THESE EXACTLY

Every molecule and organism MUST import atoms via barrel. NEVER import from `astro:assets`, never import `.astro` files directly. The Image atom handles `ImageMetadata` internally.

```astro
import { Image } from '../../atoms/Image';        // NOT 'astro:assets'
import { Card } from '../../atoms/Card';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Link } from '../../atoms/Link';
import { FormField } from '../../atoms/FormField';
import { Tooltip } from '../../atoms/Tooltip';
import { List } from '../../atoms/List';
import { LottieIcon } from '../../atoms/LottieIcon';
```

- Adjust `../../` depth based on file location (molecules = `../../../atoms/`, organisms = `../../../../atoms/`)
- Barrel handles CSS side-effect imports — direct `.astro` import skips CSS
- Image atom accepts `string` (URL) OR `ImageMetadata` (import) — no need to bypass it
- NEVER use raw `<h1>`–`<h6>`, `<p>`, `<span>`, `<a>`, `<img>`, `<ul>`, `<button>` — use the atom

---

## Render Architecture Contract

### No hardcoded values in component CSS:
Every colour, spacing, radius, shadow, font size, transition, and breakpoint must use a design token (`var(--token-name)`). If a token doesn't exist for the value needed, flag it — don't invent a magic number. The only exceptions are `0`, `none`, `100%`, `auto`, `1px` for borders, unitless values like `flex: 1`, and `em`-based relative values (e.g. `0.15em` for divider thickness, `0.25em` for dash rhythm) where the value intentionally scales with the parent's font size. No `var(--token, #hex)` fallbacks either — if the token is missing, you want it to break visibly so the token gets fixed.

### CSS Rules — NEVER create these in NEW component CSS:
- No `@layer` wrappers
- No `a11y.css` files — the render pipeline replaces per-component a11y files
- No `#a11y-content-wrapper` references
- No `!important` declarations
- No `@media (prefers-reduced-motion)` in component CSS
- No `.a11y-*` class selectors (`.a11y-reduce-motion`, `.a11y-text-only`, etc.)
- No `:global()` selectors in `.astro` files
- No scoped `<style>` blocks in `.astro` files

### IMPORTANT: Existing a11y.css files in components are LEGACY
- They contain real design decisions from weeks of work
- They are SOURCE MATERIAL for extraction, not trash to delete
- Follow the extraction process above — never skip it

### CSS Files — New component structure (after extraction):
- `Component.css` — all styles including animation, loads in ALL renders
- `Component.responsive.css` — breakpoint styles (if needed)
- NO `Component.animation.css` — animation rules live in base CSS, gated by prop-driven classes
- NO `Component.a11y.css` — the extraction process distributes these rules elsewhere
- NO `data-render` or `data-motion` selectors in component CSS — all in gate files

### Gate Files (single authority per concern):
- `src/styles/gates/motion-gate.css` — kills ALL animation (anim--, gradient--, icon--, underline--, divider--)
- `src/styles/gates/textonly-gate.css` — per-atom visual stripping (hide decorative, simplify layout)
- `src/styles/gates/reduced-gate.css` — motion suppression for reduced render
- `src/styles/gates/assistive-gate.css` — large targets, single column, simplified layout
- `src/styles/zones/theme-chroma-calm.css` — visibility only (no animation rules, motion gate handles that)
- Component CSS must NOT contain `[data-render]`, `[data-motion]`, or `[data-theme-chroma]` selectors

### Animation Architecture:
- Animation = JSON prop → class on element → CSS rule in `Component.css`
- No prop = no class in HTML = animation rules never match = zero motion
- There is NO separate animation CSS file. All animation keyframes and triggers live in the base CSS.
- The gating is structural (class presence), not file-based (file loading).
- Components are PURE — they don't detect render mode, brand, or motion preference

### Icon System:
- Icons are served from the Asset Library API (D1/R2 on Cloudflare)
- **13,456 Phosphor assets**: 5 weights (light, regular, bold, fill, duotone) × standard + flat variants
- **Slug convention**: `heart-fill` (standard multi-path), `heart-fill-flat` (single-path for draw/morph)
- **Flat fallback**: API returns standard version if `-flat` slug doesn't exist (hash-identical icons)
- Icon.astro fetches via `ASSET_API_URL` — no `fs.readFileSync`, no local file access
- Icon weight resolved from brand config (`ICON_WEIGHT` env var), not hardcoded
- **5 weights only**: light, regular, bold, fill, duotone — `thin` and `brand` removed
- **Colour**: uses global `.color--{name}` mixin — no per-atom colour classes
- **Draw animation**: GSAP DrawSVGPlugin — 4 variants, ghost/fill modes, gradient lines, scroll scrub
- **Morph animation**: GSAP MorphSVGPlugin — prefers flat SVGs, hover toggle
- **All Phosphor icons tagged** with rich semantic tags + 18 categories from `@phosphor-icons/core`
- LottieIcon.astro fetches JSON server-side and inlines via `animationData`
- Never reference `public/Icons/` — all icons come from the API

### Schema Structure:
- Every component schema uses canonical prop groups: `content`, `colour`, `gradient`, `visual`, `animation` (plus `rainbow`, `typography`, `media` where applicable)
- The `"category"` field must be `"atom"` for all atoms — not subcategory paths like `"atoms/ui"` or `"atoms/icons"`
- Plus a `renders` block: `{ full, reduced, assistive, textonly }` pointing to the .astro file or an atom name
- Empty `animation: {}` is correct for components with no motion
- `textonly: null` = decorative component, skip entirely in text-only render
- `assistive` render uses the same .astro but receives filtered props (no animation, stacked layout)

### Pipeline Routing — schemas that declare props for OTHER atoms:
- A `renders` value can be an atom name (e.g. `"Icon"`, `"Text"`) instead of a `.astro` file
- The pipeline reads the render mode and routes the right props to the right atom
- Schema props marked as pipeline-only (e.g. `fallbackIcon`) never reach the component's `.astro` file
- Example: LottieIcon schema declares `slug` (animation), `fallbackIcon` (static Icon), `label` (text):
  - `full` → LottieIcon.astro receives slug, label, visual/animation props
  - `reduced/assistive` → pipeline passes `fallbackIcon` to Icon atom
  - `textonly` → pipeline passes `label` to Text atom
- No separate template files per render mode — the pipeline routes to existing atoms
- Props can be optional — decorative instances may only declare the animation, no fallback or label
- The JSON content author decides per instance what dimensions to provide

---

## Assistive-Input Render (Easy Click)

The platform has **four** render modes:

| Render | User-facing name | What it does |
|--------|-----------------|--------------|
| `full` | Default | All CSS, animations, hover effects |
| `reduced` | Calm Mode | Animation props stripped — no animation classes emitted |
| `assistive` | Easy Click | Large targets, no hover-only interactions, single-column layout |
| `textonly` | Reading Mode | Minimal CSS, content only |

**OS-level AT handles input translation — no custom JS shim exists or is needed.**
iOS Switch Control, Windows Eye Control, Android Switch Access, eye gaze trackers and head trackers all translate their input into standard `focus` / `click` / `keydown` events at the OS level before the browser sees them. Any properly focusable, keyboard-operable element works automatically.

**The platform's job is to ensure every component:**
- Has correct `tabindex` and semantic HTML so OS AT can find it
- Has `:focus-within` equivalents for all hover-triggered interactions
- Has `aria-hidden="true"` on decorative elements
- Has `data-semantic-role` attribute for content-symbol images
- Has sufficient touch target size (44×44px default, 64×64px in `assistive` render)

**CSS rules for assistive render:**
- No hover-only content without a `:focus-within` or click alternative
- All touch targets scale via CSS when `data-render="assistive"` on body
- Grid layouts collapse to single column
- Focus indicators enlarged (min 3px, high contrast)
- Scoped to `[data-render="assistive"] .component { ... }` in `Component.css`

**Component checklist for assistive render:** see `component-audit-checklist-v2.md` sections 7, 8, 10.

---

## Alt Text Architecture

### Image atom props (what the component accepts):
- `altWord` — short word-level alt text
- `altDescriptive` — long descriptive alt text (richest text for screen readers)
- `altAacHtml` — pre-rendered AAC card HTML (built by aacResolver at build time)
- `semanticRole` — `decorative` | `ui-control` | `content-symbol`

### Asset API / D1 fields (data layer — NOT component props):
- `alt_descriptive` — full descriptive sentence, stored on `assets` table
- `alt_aac_phrase` — curated 3-4 word phrase, stored on `assets` table, consumed by aacResolver at build time
- `alt_symbol_id` — FK to `alt_symbols` table, used for resolver lookup
- `alt_text_log` table — every change to any alt field is audited (migration 013)

**Data flow:** D1 → `snapshot-alt-text.js` → JSON → `loadAllAltText()` → aacResolver → Image atom props. The atom never sees raw API data.

### Alt text display — two-axis system (CSS, not component props):
Both axes set as `data-*` attributes on `<html>`, controlled by the Your View panel.

**What to show** (`data-alt-text-mode`):
| Value | Shows |
|-------|-------|
| `none` | Nothing (screen reader alt only) |
| `word` | `.image-alt-word` span |
| `descriptive` | `.image-alt-descriptive` span |
| `aac` | `.image-alt-aac` span (AAC pictogram cards) |

**How to show it** (`data-alt-display-mode`):
| Value | Behaviour |
|-------|-----------|
| `hidden` | `display: none` (default) |
| `caption` | Block below image |
| `overlay` | Positioned over image bottom (solid background) |
| `tooltip` | Visible on hover + focus-within |
| `subtitle` | Image shrinks via flex, text below |
| `replace` | Image visually-hidden, text shown (img stays in a11y tree) |

### Component requirements:
- `tabindex="0"` on the `<figure>` element — makes it focusable for switch/keyboard
- `:focus-within` on all tooltip-mode CSS rules — keyboard and OS AT trigger the same display
- `data-semantic-role` attribute on the figure
- All alt text spans have `aria-hidden="true"` — screen readers always use `img alt`, never the visual spans
- AAC pictogram cards built by `aacResolver` via `aac-cards.ts`, rendered from `alt_symbols` table
- Cognitive level filtering via `data-cognitive-level` on `<html>` + `data-core-tier` on AAC cards

---

## Audit Rules — ALWAYS follow these:
- When reviewing output against agreed rules: NEVER silently change or add to rules
- Flag deviations explicitly before making them
- If something looks wrong, ASK — don't fix
- Always be honest about whether a file was fully read or skimmed
- Never claim to have checked something thoroughly if you haven't
- Admitting you skimmed is better than pretending you read it

---

## Quick Reference: What goes where

| What you find in component CSS | Where it goes |
|-------------------------------|---------------|
| `.dark-theme .component { ... }` | `src/styles/zones/theme-luminance-dark.css` |
| `[data-highlight-links] .component { ... }` | `src/styles/global/highlight-links.css` |
| `.a11y-reduce-motion .component { animation: none }` | Nowhere — render pipeline handles this |
| `.a11y-text-only .component { display: none }` | Nowhere — textonly render omits the component |
| `@media (prefers-reduced-motion) { ... }` | Nowhere — render pipeline handles this |
| `@layer a11y.dark { ... }` | Unwrap, extract dark rule to zone file |
| `@layer a11y.highlight { ... }` | Unwrap, extract rule to highlight-links file |
| `@layer a11y.reduce-motion { ... }` | Animation gated by prop-driven classes — check if already covered, else ask |
| `@layer a11y.text-only { ... }` | Check if textonly render omits it, else ask |
| `@layer component { .badge { ... } }` | Remove @layer wrapper, keep rule in Component.css |
| Dark theme CSS custom properties | `src/styles/zones/theme-luminance-dark.css` |
| Scoped `<style>` in .astro | Extract to Component.css, remove from .astro |

---

## Revert Policy
- If you make a mistake or the user says STOP, revert ALL changes immediately
- Use `git checkout -- <file>` to restore modified files
- If not using git, use VS Code undo (Ctrl+Z) on each modified file
- Do not continue work until revert is confirmed
