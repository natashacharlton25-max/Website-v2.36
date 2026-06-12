# COMPLIANCE-INVENTORY

Last updated: 2026-06-01

> The complete list of dimensions an atom must comply with, grounded in the actual code (file paths cited). This is the foundation for the per-atom audit template — every axis here becomes a checklist line. Companion to `BUILD-STATUS.md` (status + drift); this doc is the *axes*, that doc is *where each atom stands*.

---

## 1. Gates — `src/styles/gates/` (9 files)

Each gate owns ONE behavioural concern and keys off a `data-*` attribute on `<html>`. Component CSS must NOT contain these selectors (they belong here).

| File | Concern | Attribute = values |
|------|---------|--------------------|
| `motion-gate.css` | Kill/slow ALL animation | `data-motion` = `gentle` (2× slower), `none` (frozen). `full` = default, no rules |
| `hover-gate.css` | Hover feedback level | `data-hover` = `full` (200ms), `instant` (0s), `gentle` (1.2s), `none` (no feedback) |
| `focus-gate.css` | Focus ring + enhanced focus | `data-focus-active` (JS-set), `data-enhanced-focus`, `data-focus-rainbow`, `data-focus-scroll/dim/pulse` |
| `reduced-gate.css` | Motion suppression for Calm render | `data-render="reduced"` |
| `assistive-gate.css` | Large targets, single-column | `data-render="assistive"` |
| `opacity-gate.css` | Visual effects (shadow/glass/glow) | `data-visual` = `solid` (glass→transparent), `flat` (no shadow/glass/glow). `full` = default |
| `alt-text-gate.css` | Image alt-text display (two-axis) | `data-alt-text-mode` = none/word/descriptive/aac × `data-alt-display-mode` (see §3 note) + `data-text-xl` |
| `anim-explainer-gate.css` | Animation-explainer overlay | `data-anim-explainer` = off/inline/tooltip/subtitle/enlarge × `data-anim-seq-mode` = full/visual/text |
| `speed-gate.css` | User animation-speed multiplier | `data-anim-speed` = fast (0.75×), gentle (1.5×), slow (2×) — stacks with motion-gate via `--anim-speed-mult` |

**Not a gate file (but a behavioural axis):** `data-highlight-links` — handled by `src/styles/global/highlight-links.css` (loaded after components) plus scattered rules in hover-gate/focus-gate. There is no `highlight-links-gate.css`.

**Flags:** No empty/placeholder gate files. No undefined attributes (`data-mode`, `data-render`, `data-highlight-links` originate outside gates — set by ThemeSwitcher/render-controller/Your-View — and are consumed correctly). Gate composition is intentional and commented (motion×hover, hover×focus, speed×motion×hover).

---

## 2. Zones — `src/styles/zones/` (4 CSS + README)

Theme/perception overrides, activated by `data-*` (user toggle) and/or theme meta tokens.

| File | Zone | Activated by | Overrides |
|------|------|--------------|-----------|
| `theme-luminance-dark.css` | Dark mode | `[data-mode="dark"]` | Shadow tokens flip, glass swap, hover/heading/link/card/FormField/button-glow |
| `theme-chroma-calm.css` | Calm chroma | `[data-theme-chroma="calm"]` | Shadows→none, breathing-room spacing, body type +1.25rem, solid underlines, glows removed (tokens only) |
| `high-contrast.css` | High contrast | `[data-high-contrast]` | 2px borders, 3px focus rings, larger form controls, always-bordered buttons, strikethrough disabled |
| `no-chroma.css` | No-hue (achromatopsia/mono) | `[data-no-chroma]` (user) OR `[data-theme-no-chroma]` (meta token) | Page `grayscale(1)`, dashed focus, underlined+bold links, lightness-paired status, border-style hover |

**Flags:** No referenced-but-missing zones; no orphans. **CVD (protan/tritan) and chroma variants are NOT zone files** — they live as rainbow token files in `src/styles/tokens/` (`rainbow-protan.css`, `rainbow-tritan.css`, etc.), gated by `[data-cvd]`/`[data-mode]`/`[data-theme-chroma]`. This matches the documented "engine knows no CVD" architecture. Activation is consistent: theme-driven zones via meta tokens (ThemeSwitcher), user-driven via Your-View attributes; `no-chroma` is correctly dual-path (`:is([data-no-chroma],[data-theme-no-chroma])`).

---

## 3. Render modes — 4 implemented + 1 deferred

`data-render` on `<html>` (set in `BaseLayout.astro:90` + Your-View panel). Dispatched by `src/lib/render-controller.ts`.

| Mode | User name | Activation | Transforms | Driven by |
|------|-----------|-----------|------------|-----------|
| `full` | Default | `data-render="full"` (or absent) | none | baseline |
| `reduced` | Calm | `data-render="reduced"` | **no-op JS stub**; animation gated via `reduced-gate.css` + animation systems | CSS/animation gate |
| `assistive` | Easy Click | `data-render="assistive"` | **empty JS function**; large targets/single-column via `assistive-gate.css` | CSS gate |
| `textonly` | Reading | `data-render="textonly"` | **14-step DOM transform** (prune decorative, simplify badges, Lottie→static, uniform buttons); styled by `src/styles/textonly/textonly.css` | JS + CSS |

**Deferred / not built:**
- **AAC (5th mode)** — planned (`memory/aac-render-mode.md`), NOT implemented. Not in the MODES registry or `RenderMode` type. `aac` appears only inside `textonly.textonlyStyles` in `render-rules.json`. Today AAC = build-time cards (`aac-inline.ts`, `aacResolver.ts`) + a `shared-bar.ts aac:true` layout flag; `aac-cards.ts` is DEPRECATED.
- **"reading" / "calm" / "easy-click" aliases** — `mode-readers.ts` normalises them, but `render-controller.ts` MODES keys only on canonical values, so a literal alias would miss the transform dispatch.

**Note on alt-display-mode vocabulary drift:** docs list 6 modes (`hidden|caption|overlay|tooltip|subtitle|replace`); code (`figcaption.ts`) references `inline`/`enlarge` and only acts on `tooltip`/`subtitle`/`inline`. See BUILD-STATUS Drift D13.

---

## 4. Tokens — `src/styles/tokens/` (consume these; never hardcode)

Token families an atom draws from. `tokens/index.css` is the import manifest; `responsive.css` is imported via `global.css:108` (NOT index.css — this is correct, not orphaned).

| Family | File | Prefix |
|--------|------|--------|
| Typography | `typography.css` | `--font-*`, `--text-*`, `--leading-*`, `--letter-spacing-*`, `--base-font-pct` |
| Spacing | `spacing.css` | `--space-*`, `--container-*`, `--content-flow-*`, `--page-margin-*` |
| Layout | `layout.css` | `--z-*`, `--opacity-*`, `--aspect-*`, `--target-min`/`--target-comfortable` |
| Borders | `borders.css` | `--border-width*`, `--border-radius-*`, `--radius-*` |
| Motion | `motion.css` | `--ease-*`, `--duration-*`, `--transition-*` |
| Shadows | `shadows.css` | `--shadow-*` (incl. neumorphic, `--shadow-Black/White` never-flip) |
| Effects | `effects.css` | `--glow-*`, `--glint-*`, `--glow-currentcolor-*` |
| Glass | `glass.css` | `--glass-*`, `--liquid-*` |
| Images | `images.css` | `--img-*` |
| SVG | `svg.css` | `--svg-*`, `--media-*` (em-based icon sizes) |
| Depth | `depth.css` | `--depth-*`, `--po-opacity` |
| Confetti | `confetti.css` | `--confetti-*` |
| Bars (shared Tooltip/FigCaption/AnimExplainer) | `bars.css` | `--bar-*` |
| Rainbow (7×4 tiers) | `rainbow-{default,dark,protan,dark-protan,tritan,dark-tritan,calm,mono,hc}.css` | `--rainbow-{1-7}-{tint,mid,base,emphasis}`, gated by `[data-cvd]`/`[data-mode]`/`[data-theme-chroma]`/`[data-high-contrast]` |
| Gradients | `gradients.css` + generated `global/gradient-generated.css` (build output) | `--_grad-*` |
| Responsive overrides | `responsive.css` (imported in `global.css:108`) | breakpoint `--base-font-pct` + component overrides |

**Colour consume-chain an atom is expected to use** (from the `.color--{name}` mixin in `src/styles/global/colour.css`): `--_color`, `--_on-color`, `--_tier-{tint,mid,base,emphasis}`; theme families `--primary-*`, `--secondary-*`, `--neutral-*`, `--rainbow-*`, `--page-bg*`, `--text-*`.

**Flags:** No missing imports; no duplicate families. (`responsive.css` flagged "orphaned" by the discovery agent was a **false positive** — it checked only `index.css`; it's imported in `global.css`.)

---

## 5. Validators — every rule, numbered (ground truth)

Three validators. See BUILD-STATUS §3 for the full gap list.

### `scripts/validate-atoms.cjs` — atom-internal, report-only, scope `src/components/atoms/*`
CSS: R1 nested var() fallback · R2 hardcoded px≥10 (+border 1–6px) · R3 hex · R4 rgb/hsl · R5 opacity · R6 duration · R7 easing · R11 `[data-render="assistive"]` in component CSS (MOVE) · R12 zone/gate selectors in component CSS (MOVE) · R16 `@layer` · R17 `!important` · R18 prefers-reduced-motion · R19 `.a11y-*` · R20 `#a11y-content-wrapper` · R21 transition without var() (WARN) · R22 `:focus-visible` (MOVE) · R29 ungated `:hover` (WARN) · R31 `@keyframes` (WARN) · R32 animation without tokens · R40 per-atom colour classes · R45 phantom token.
Astro: R8 inline style · R9 CSS computation maps · R10 rest spread · R23 `:global()` · R24 scoped `<style>` · R34 ungated animation-lib import (+legacy prefersReducedMotion WARN) · R37 hardcoded enum union · R44 inline `<svg>` (WARN).
Schema: R13 `type:token`/`cssProperty` (+missing schema.json) · R14 assistive→.astro · R25 missing prop groups (+JSON parse) · R26 colour group stray prop · R27 token-like default · R28 unexpected render keys · R30 visual.color enum mismatch · R33 anim prop in wrong group · R35 unenum'd string in visual/animation · R36 class/style in group · R38 gradientType/Focus on small atoms · R39 root-level slots/class/style · R43 schema↔astro default drift.
Pre-loop: R42 duplicate barrel import.
**Gaps: R15 removed (superseded by R40); R41 (zone/mode overrides in `global/*.css`) is in the legend but UNIMPLEMENTED. Never exits non-zero. Per-atom exception allowlists suppress real patterns. Many rules are line-regex heuristics.**

### `src/lib/schema-validator.ts` — runtime JSON↔schema (named checks, not numbered)
Required props · forbidden `class`/`style` · unknown props · CSS-value strings rejected · enum membership · type · nested `media.component` enum · `_ref` recursion · declarative `_rules` engine (requires/excludes/forbid). **Gaps: schema-integrity checks are console.warn only; recurses only into `.children`; honours `_format` escape hatch; no `category`/`renders` check.**

### `scripts/validate-data.ts` — build-time gate (exits 1)
AUDITED_COMPONENTS allowlist (**9**: Badge, Button, FigCaption, FormField, Heading, Link, List, Text, Tooltip) · 5-file existence · FORBIDDEN_CSS/ASTRO regex · `checkAstroVsSchema` (reverse drift, name-only) · validates `src/data/test/<name>.json`. **Gaps: only 9 atoms; only test data (header overstates "every src/data/**"); warns filtered; drift check one-directional.**

---

## 6. CLAUDE.md architectural rules — enforced vs not

77 component-facing rules extracted (full list in the discovery output). Grouped by area, with whether a validator actually enforces each:

- **Atom imports** (barrel only, no `astro:assets`, no direct `.astro`, no raw HTML) — partially enforceable; not currently checked by validators.
- **CSS rules for new component CSS** (no `@layer`/`!important`/prefers-reduced-motion/`.a11y-*`/`#a11y-content-wrapper`/`:global()`/scoped `<style>`/`a11y.css`/`animation.css`) — **enforced** by validate-atoms R16–24 + validate-data FORBIDDEN_CSS/ASTRO. ✅ No drift on clean atoms.
- **Render architecture** (tokens-only no hardcoded values, no `var(--x,#hex)` fallbacks, gate authority, animation = prop→class→CSS) — token rules enforced (R2–7, R45, R1); "intentionally scales" / purity / structural-gating are intent-level, unenforced.
- **Schema structure** (canonical groups, `category:"atom"`, `renders` block, no slots, content*/label* free-text, enum-or-runtime, no CSS in schema) — groups/slots/CSS-in-schema **enforced** (R25/26/39, R13, SV CSS-string); **`category:"atom"` and `renders` keys/targets are NOT enforced by any validator** (see flags).
- **Icon system, Alt-text architecture, Assistive render** — mostly architectural facts + attribute-presence rules (`tabindex`, `:focus-within`, `aria-hidden`, `data-semantic-role`, 44/64px targets) that **no validator checks** — these are the accessibility-audit-layer's job.

### Key flags from this area
- **CONFLICT — Rule 18 vs assistive instruction:** CLAUDE.md line 146 bans `[data-render]` in component CSS, but the Assistive section (lines 221–226) explicitly instructs `[data-render="assistive"] .component { ... }` *in* `Component.css`. Needs a human ruling on which wins (likely: assistive target-scaling is the one sanctioned exception, OR the assistive rules belong in `assistive-gate.css` per line 152).
- **`category:"atom"` and `renders` block** are documented contracts with **no validator enforcement** (validator gap, not doc error — the rule is real, just unchecked).
- **Doc inconsistency:** Phosphor asset count differs (CLAUDE.md 13,456 vs MEMORY 15,120).
- Several "hard rules" (no slots, content*/label* free-text, enum-or-runtime, no-CSS-in-schema) live in **MEMORY.md**, not CLAUDE.md — relevant to drift checks but not part of CLAUDE.md's own claims.

---

## How to keep this current
Re-run the six discovery passes (gates, zones, render modes, tokens, validators, CLAUDE.md rules) when the system architecture changes — new gate, new zone, new render mode, new validator rule. The per-atom audit template draws its axes from this list; adding a dimension here means adding a checklist line there.
