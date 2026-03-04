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
| `component-audit-spec.md` | Full per-component audit checklist — run against every component |
| `component-audit-checklist.md` | Accessibility + render questions — part of component-audit-spec.md |
| `AAC-Shim-Print-Traceability-Spec.md` | AAC form inputs, assistive tech layer, print traceability architecture |

After completing any component: update `src/components/audit-log.md` with status and notes.

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
- `reduce-motion` → informs `Component.animation.css` (render pipeline gates it)
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

## Render Architecture Contract

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
- `Component.css` — base styles, loads in ALL renders
- `Component.animation.css` — motion-gated styles, loads in full-motion render ONLY
- `Component.responsive.css` — breakpoint styles (if needed)
- NO `Component.a11y.css` — the extraction process distributes these rules elsewhere

### Animation Architecture:
- Animation = JSON prop → class on element → CSS rule
- No prop = no animation class = no motion
- Three renders filter what loads: full (all CSS), reduced (no animation CSS), textonly (minimal CSS)
- Components are PURE — they don't detect render mode, brand, or motion preference
- The render pipeline controls what CSS files load, not the component

### Icon System:
- Icons are served from the Asset Library API (D1/R2 on Cloudflare)
- Icon.astro fetches via `ASSET_API_URL` — no `fs.readFileSync`, no local file access
- Icon weight is resolved from brand config (`ICON_WEIGHT` env var), not hardcoded
- LottieIcon.astro fetches JSON server-side and inlines via `animationData`
- Never reference `public/Icons/` — all icons come from the API

### Schema Structure:
- Every component schema uses three prop groups: `content`, `visual`, `animation`
- Plus a `renders` block: `{ full, reduced, assistive, textonly }` pointing to the .astro file
- Empty `animation: {}` is correct for components with no motion
- `textonly: null` = decorative component, skip entirely in text-only render
- `assistive` render uses the same .astro but receives filtered props (no animation, stacked layout)

---

## Assistive-Input Render (Easy Click)

The platform has **four** render modes:

| Render | User-facing name | What it does |
|--------|-----------------|--------------|
| `full` | Default | All CSS, animations, hover effects |
| `reduced` | Calm Mode | No animation CSS loaded |
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

**Component checklist for assistive render:** see `component-audit-spec.md` section 8.

---

## Alt Text Architecture

Every Image component rendering user content must satisfy:

- Props: `altDescriptive`, `altAacPhrase`, `altSymbolId` (from Asset Library API)
- Five display modes: `hover` | `overlay` | `underneath` | `replace` | `off`
- `tabindex="0"` on the `<figure>` element — makes it focusable for switch/keyboard
- `:focus-within` on all hover-mode CSS rules — keyboard and OS AT trigger the same tooltip
- `data-semantic-role` attribute on the figure
- AAC pictogram cards render from `alt_symbols` table via the aacResolver

**Asset API fields:**
- `alt_descriptive` — full descriptive sentence for screen readers
- `alt_aac_phrase` — space-separated simple words for AAC pictogram cards
- `alt_symbol_id` — foreign key to `alt_symbols` table (backfilled for all 1,798 symbols)
- `alt_text_log` table — every change to any alt field is audited (migration 013)

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
| `@layer a11y.reduce-motion { ... }` | Check if animation.css covers it, else ask |
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
