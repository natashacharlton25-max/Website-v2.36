# BUILD-STATUS

Last updated: 2026-06-08

> Ground truth is the code: `validatorRun` output, the renderer/render-controller code, and the atom schemas. Where the audit log or CLAUDE.md disagrees with these, the code wins.

## 1. Audited & clean atoms

"Clean" here means the atom validator (`validate-atoms.cjs`) reports **0 issues** on the live code AND the data validator passes. Render modes are taken from the atom's actual schema `renders` block (ground truth), not from doc claims.

| Atom | Category | Render modes (schema) | Notes |
|------|----------|------------------------|-------|
| Page | atom | full, reduced, textonly | No assistive key (gate-handled). No audit-log row exists. |
| Section | atom | full, reduced, textonly | Validator clean, but **not yet v2-audited** — has unimplemented `bg` enum values; see §2. |
| Grid | atom | full, reduced, textonly | Schema dropped `assistive` since the logged "4 render keys" PASS; see Drift §6. |
| Heading | atom | full, reduced, textonly | Validator clean; audit-log marks PARTIAL with stale colour API; see §6. |
| Text | atom | full, reduced, textonly | Validator clean; colour API reworked after the logged PASS (log stale). |
| Badge | atom | full, reduced, textonly | Validator clean; log describes `--_badge-*` tokens/textonly icon rule no longer in code. |
| Button | atom | full, reduced, textonly | Validator clean; log claims in-component `[data-render]` rules that no longer exist. |
| Icon | atom | full, reduced, textonly: null | Validator clean; audit-log still PARTIAL; colour-group note stale. |
| Image | atom | full, reduced, textonly | Validator clean; audit-log still PARTIAL (alt-span/AAC cross-atom items open). |
| Link | atom | full, reduced, textonly | Validator clean. |
| List | atom | full, reduced, textonly | Validator clean; `assistive` rules live in `assistive-gate.css` though schema omits the key. |
| LottieIcon | atom | full, reduced, textonly | Validator clean; routes textonly→Icon (schema) vs label→Text (log) — unreconciled. |
| Shape | atom | full, reduced, textonly | Validator clean, but **not yet v2-audited** and absent from the audit log; see §2. |

Notes on reconciliation:
- **Section, Shape**: validator-clean but flagged `unaudited` by the readers and have no logged v2 pass — listed here because the validator passes, but treat them as not-formally-complete (see §2).
- **Card** — schema **rebuilt to the new layout-preset model (clean; 7/7 lock proof)** 2026-06-08; the atom validator's remaining **124 issues** are all in the LEGACY `Card.css`/`Card.astro` design-reference files (this was the 131-issue doc-vs-code reversal). See §2 + §6 D1.
- The data validator confirms: **9 audited-atom test pages valid, 9 atoms in sync** (8 audited schemas as the top-level gate, 18 atom schemas loaded for nested child-lookup — atoms only, collision-guarded — as of 2026-06-08).
- **(B) nested-slot lock rolled out (2026-06-08):** Badge / Button / Heading / List `media` slots carry `_lockProps` — media children (Icon / LottieIcon / Image / Shape) deep-validated against the child atom's own schema. **FormField `options[*].media` is locked too**, via array-nested validation (the validator now validates array-item shapes declared in `def.items.properties`, recursing component-nodes inside items — also covers `dropdownItems[*]`). Link / Text / Tooltip have no component-node slot; FigCaption has no schema (rendered via Image). All existing media data validates clean. See VALIDATOR-NESTED-SLOTS-SPEC.md.

## 2. Unaudited / in-progress atoms

Ordered by remaining effort (lightest first, Card last).

**Tooltip** — validator: warn (1 issue)
- Add `assistive` key to schema (CSS/notes already reference `assistive-gate.css`).
- Re-log the audit row: it is marked PASS 2026-03-10 but describes a superseded `--_tooltip-*`/glass-neon implementation; current file uses the shared `--bar-*` family with an empty `colour:{}` group.
- `Tooltip.responsive.css` is stripped placeholders only — restore breakpoints or drop the import.
- Clear deferred cross-atom items: remove `utilities.css` tooltip block, migrate 41 icon-label consumers + ReaderNav/ShareSection, gate script bundle in non-full renders.

**FigCaption** — validator: warn (1 issue); `hasSchema: false`
- Create `FigCaption.schema.json` (`category:"atom"`, renders block; document it as a behaviour module with no authored props).
- Document render-mode contract: `figcaption.ts` only reads `data-alt-display-mode` + `data-hover`, never `data-render` — confirm gate files cover assistive/textonly.
- Add audit-log entry (currently zero mentions).
- Reconcile alt-display-mode value drift: code references `inline`/`enlarge` modes NOT in the documented 6-mode set; `shared-bar.ts` carries banned `var(--bar-bg,#hex)` fallbacks.

**Section** — validator: clean but unaudited
- Add missing `assistive` render key (or document gate handling).
- Implement CSS for `bg` enum `tint`/`light`/`solid` — schema declares them but only `.section-atom--bg-none` exists (silent no-op).
- Decide whether render-mode CSS blocks / a `Section.responsive.css` are needed.
- Create a dedicated audit-log row and run both validators for the record.

**Caret** — validator: warn (6 issues); PLACEHOLDER
- Rename `.form-field__caret`/`.form-field__arrow-tab` → `.caret`/`.caret__arrow` (and matching JS literals in `custom-caret.ts`); decouple from `.form-field` scope.
- Remove `!important` on height; tokenise z-index (2, 9999) and px magic numbers (4px, `clamp(40px,8vw,70px)`).
- Resolve `@keyframes caret-blink` in component CSS; build a real `Caret.astro` or formally accept the JS-injected pattern.
- Add `assistive` key; register in the atom registry. 9 issues all deferred to a proper build session.

**FormField** — validator: warn (6 issues)
- **(B) card-select per-option media — LOCKED (2026-06-08).** `options[*].media` is now deep-validated: the validator validates array-item shapes (`def.items.properties`) and recurses component-nodes inside items (Move 1 + Move 2). `_selectOptionShape` was moved into `options.items` so the validator sees it; the option media node carries `_lockProps`. Also fixed the stale `option-media-content-symbol-needs-label` rule (it checked pre-rename `alt`; now checks `contentAlt` / `contentAltWord` / `contentAltDescriptive` or `labelIcon`). Proven 13/13.
- Confirm `assistive` deliberately dropped to `assistive-gate.css` zone (diverges from 4-key contract).
- Carries Caret's deferred load until Caret is rebuilt.
- Wire per-option `aacPhrase` (forward-declared, no runtime effect).
- Reconcile log note "colour group added (empty)" vs live schema (populates `brandColor`).
- Clear deferred: save-draft for AAC textareas, input-tolerance testing, legacy `.form-group`/`.form-label` consumer migration, print layer.

**Burst** — validator: warn (8 issues); unaudited
- Not in audit log; never run through v2 checklist.
- Add `assistive` key (or document decorative/null).
- Replace banned `_format` on `target`/`tracePath`/`traceSize` with FREE_STRING_PROPS + runtime validation.
- Reconcile schema/.astro drift (`traceOffsetX`/`traceOffsetY` in .astro, absent from schema).
- Move hardcoded inline style px out of markup or justify as runtime author-driven.
- Confirm JS-driven motion gating against motion-gate/reduced-gate/render-controller.

**TextEffect** — validator: warn (14 issues); `hasSchema: false`; unaudited
- Create `TextEffect.schema.json` (canonical groups, `category:"atom"`, renders block; textonly→Text).
- Move `[data-render="reduced"]` selector out of `TextEffect.css` into a gate file; implement or correct the (false) "hover-gated" comment.
- Tokenise hardcoded shadow/glow/`rgba` values now inline in the .astro.
- Convert raw-CSS string props (`solidColor`, `fillImage`, `fillGradient`, `gradientColors`, `textStroke`, `size`) to enums or FREE_STRING_PROPS + runtime validation.
- Reconcile data JSON drift (`textShadow`/`dropShadow` keys the .astro doesn't accept); rename `text`→`labelText`/`contentText`.
- Audit `Math.random` filterId for SSR/hydration stability.

**Card** — schema: NEW layout-preset model (clean); legacy CSS/astro: validator FAIL (124, was 131) — design-reference, INTENTIONAL
- **Schema rebuilt** to the layout-preset atom model (LAYOUT-ENGINE-SPEC.md §11/§12, 2026-06-08): `cardType` variant enum (`["horizontal"]`), nested component-node slots (`title`/`meta`/`body`/`button`/`media` — `{ component, …child props }`, child owns its props), card-level `semanticRole` for textonly keep/drop. No `slots` block (Rule 39 satisfied). No `_ref` (uses the codebase-wide component-node pattern). Passed a 7/7 lock proof against the real `validateComponent`.
- **(B) nested-slot validator pass LANDED** — see VALIDATOR-NESTED-SLOTS-SPEC.md. Move 1 (global): the nested `component` check is generalised off the `key === 'media'` hardcode to ANY component-node slot. Move 2 (opt-in via `_lockProps`): deep-validates a slot's child props against the CHILD's schema (looked up by `component`, reusing the `_ref` recursion engine). **D1 = error** (consistent with top level), **D2 = opt-in** (blast radius contained). `validate:data` stayed green (9/9) — no regression.
- Card's five slots carry `_lockProps: true` (opted into the lock). Proven: wrong atom, bad child enum, and unknown/styling props all rejected; appearance freedom within the child's enums passes; errors accumulate (no throw-on-first).
- **Remaining 124** = the LEGACY `Card.astro`/`Card.css`/`Card.responsive.css` (old molecule-card kept as design reference): Rule 45 phantom tokens (×49), Rule 1/2 hardcoded values (×65), Rule 29 hover (×16) — all CSS/astro, none from this pass. They clear when each `cardType` is built (`Card.css` keyed by `.card--{type}`) and legacy consumers migrate to the JSON card test page. **Elevated count is intentional until then.**
- **Card `media.semanticRole` — RESOLVED (2026-06-08):** set to `required: true` (matches Heading/Badge/List). The general fix that makes it correct: the validator's required-check is now **default-aware** — a `required` prop that declares a `default` is satisfied by that default (mirrors runtime), so the `required:true + default` media-node pattern no longer false-flags omitted-but-defaulted values.
- **Next (post-B build):** `Card.css .card--horizontal` (auto 1fr auto, equal-height, container-query context, E5 backstop) → `Card.astro` (cardType branch + legacy fallback + slot rendering) → JSON card test page → re-run validators. (The `semanticRole` fork is resolved — see above.)

## 3. Validators — what is and isn't checked

### `src/lib/schema-validator.ts` — runtime JSON-vs-schema engine
- **Purpose**: validate authored JSON against per-atom schemas; used by DEV (`Renderer.astro`) and the Cloudflare Worker. Returns `{valid, errors, sanitized}`.
- **Enforces**: required props (**default-aware** — a `required` prop that declares a `default` is satisfied by it, matching runtime; resolves the `required:true + default` media-node pattern); forbidden Astro-only props (`class`/`style`); unknown props; CSS-value strings (`var(--`, hex, rgb/hsl, px/rem/em) rejected; enum membership; runtime type; **any component-node slot's `component` enum** (Move 1 — generalised off the old `media`-only hardcode, 2026-06-08); **opt-in deep child-prop validation on `_lockProps` slots** (Move 2 — recurses the child's full schema looked up by `component`); **array-item validation** (array props with `def.items.properties` — per-element required/unknown/enum, plus component-nodes inside items recursed: `options[*].media`, `dropdownItems[*]`); legacy `_ref` recursion (present but unused — superseded by component-node + Move 2); a declarative `_rules` engine (requires/excludes/forbid).
- **Gaps (blind spots)**:
  - Schema-integrity issues (string-without-enum, missing media `component`/`semanticRole` enum) are **`console.warn` only** — they do NOT set `valid=false`.
  - Behaviour/`_runtime`/info-severity rules and docs-only rules (no `condition`/`when`) are **skipped entirely** by design.
  - `validatePage` recurses **only into `.children`** for standalone atom instances. Component-node slots are deep-validated when flagged `_lockProps` (Move 2); array-valued props with a declared item shape (`def.items.properties`) are validated per-element with component-nodes inside items recursed — covers `options[*].media` and `dropdownItems[*]`. Un-flagged nested `media` nodes still get only the `component` check (Move 1).
  - Components not in the supplied `schemaMap` pass through unchecked.
  - Numeric values in a `number|string` union skip the enum check (always free-form).
  - No check of `renders` keys/targets, no `category` check, no detection of bare colour-tier tokens (e.g. `neutral-400`).
  - `_rules` conditions are `eval`'d via `new Function` (trusted in-repo input, no sandbox beyond a `with`-proxy).

### `scripts/validate-data.ts` — build-time gate (`npm run validate:data`)
- **Purpose**: fail the build (exit 1) before `astro build` if authored content breaks schema; runs the same engine plus two static atom checks. Confirmed run (2026-06-08): **9 files valid, 9 atoms in sync; 8 audited schemas as the top-level gate, 39 total loaded for nested-slot child lookup.**
- **Enforces**: scope gate (top-level validation only for the 9 AUDITED_COMPONENTS); canonical 5-file existence; coarse FORBIDDEN_CSS/FORBIDDEN_ASTRO regex scan; `checkAstroVsSchema` (props in `.astro` missing from schema — reverse drift); data validation of `src/data/test/<name>.json`; **the (B) nested-slot lock on `_lockProps` media slots — Badge/Button/Heading/List media children are deep-validated against the child atom's own schema** (2026-06-08 rollout; dry-run + live run both 0 errors — existing media data was already clean).
- **Gaps (blind spots)**:
  - **Top-level gate is still the 9 audited atoms** — Icon, Shape, Grid, Section, Page, molecules/organisms pass `validatePage` unvalidated at the TOP level. (As of 2026-06-08 ALL 39 schemas ARE loaded into `__schemaMap`, but only for nested child-lookup; `validatePage` is handed the audited-only map, so non-audited top-level instances stay unchecked. This decoupling is what let the nested lock turn on without incidentally enforcing not-yet-audited atoms.)
  - **`loadSchemas` name-collision fixed (2026-06-08):** it previously keyed `__schemaMap` by bare `component`, so the organism Grid (no `variant`) could clobber the atom Grid (has it). Now loads **atom schemas only** (children of locked slots are atoms) and hard-exits on any atom-name collision. The earlier dry-run's "69 latent bugs" was mostly THIS collision: 67 were phantom `Grid.variant` errors from the wrong (organism) Grid schema — the atom Grid has `variant`, the data is valid. Only 2 were real (`Section.gap "6xl"`), now fixed in figcaption/tooltip test data (Section gap maxes at `3xl`).
  - File-header claims it "walks every `src/data/**`" — **the code only reads one conventional path per atom**. Production data, other test pages, `_archive`/`_reference` trees are NOT validated (overstated comment).
  - Only HARD errors fail the build; warn-severity errors are filtered out.
  - `checkAstroVsSchema` is **one-directional and name-only** (no types/enums/defaults; no schema-props-missing-from-.astro), relying on a regex Props-interface parse that returns `[]` if the shape doesn't match.
  - FORBIDDEN_CSS/ASTRO are presence-regex with no comment-stripping or per-atom exceptions — coarser than `validate-atoms.cjs`.
  - File checks skipped entirely for audited atoms lacking a `.astro` (e.g. FigCaption).

### `scripts/validate-atoms.cjs` — atom-internal canonical-pattern check (report-only)
- **Purpose**: scan every `src/components/atoms/*` dir line-by-line against ~40 numbered rules; print CLEAN/N-issues. Confirmed run: 13 clean, 4 warn (FigCaption 1, Tooltip 1, Caret 6, FormField 6), Burst 8, TextEffect 14, **Card 124** (all legacy CSS/astro; schema rebuilt + (B) lock landed — see §2).
- **Enforces**: nested `var()` fallbacks (R1), hardcoded px/hex/rgb/opacity/duration/easing (R2–7), gate/zone selectors in component CSS routed to gates (R11/12), `@layer`/`!important`/prefers-reduced-motion/`.a11y-*`/`#a11y-content-wrapper` (R16–20), focus/hover/keyframes/animation gating (R21/22/29/31/32), phantom tokens (R45), per-atom colour classes (R40), inline-style/CSS-maps/rest-spread (R8–10), `:global`/scoped-style/inline-svg (R23/24/44), ungated animation-lib imports + legacy `prefersReducedMotion` (R34), hardcoded enum unions (R37), schema rules (R13/14/25–28/30/33/35/36/38/39/43), duplicate barrel imports (R42).
- **Gaps (blind spots)**:
  - **Report-only — never exits non-zero**, so it cannot fail a build (only `validate-data.ts` does).
  - **Scope is `src/components/atoms/*` only** — molecules, organisms, and non-atom Page/Section/Grid dirs are not scanned by the per-atom loop.
  - **Rule 15 (CSS colour-enum-count) was deliberately removed; Rule 41 (zone/mode overrides in `global/*.css`) is in the legend but has NO implemented check** — the legend lists rules to 45 but 15 and 41 are not enforced.
  - Per-atom **exception allowlists deliberately suppress real patterns**: e.g. R1 (Shape), R21 (Button/Link/FormField), R22 (FormField/Link), R29 (Button/Link/Icon), R44 SVG (Icon/Image/Shape/Card/TextEffect) — those atoms aren't checked for the suppressed pattern.
  - Many rules are line-regex heuristics, not parsers: R2 misses rem/em magic numbers; R3/R4 skip any line containing `mask`/`gradient`/`color-mix` (a hardcoded hex on a gradient line is silently allowed); R34 only checks a gate token appears *somewhere* (not before the import); R37 only knows 8 fixed union patterns and is suppressed if the file imports anything from shared-enums.
  - R30 only inspects `props.visual.color`; colour enums under other names aren't validated against the canonical list.
  - Reads no `src/data` content (that's the other two validators' job).

## 4. Renderer & pipeline — handled vs deferred

**Live path**: `Renderer.astro` (DEV schema validation + generic JSON→component tree via `render.ts`) at build, then `render-controller.ts` (side-effect import in `BaseLayout.astro:175`) doing runtime DOM transforms per `data-render`. Registry = `render.ts` `componentRegistry` (**17 components**: Page, Section, Grid, Heading, Text, Badge, Button, Card, Icon, Image, Link, List, LottieIcon, Tooltip, FormField, Shape, Burst). Render modes (schema `renders`): full / reduced (Calm) / textonly (Reading). Easy Click (`data-render="assistive"`) is a CSS gate, not a render — `render-controller.ts` still carries an empty no-op `assistive` MODES entry (code cleanup pending; the work is done by `assistive-gate.css`).

**Handled today**
- Per-instance schema validation in DEV (warn→`console.warn`, hard error→`console.error` + throw to DEV overlay); schema map on `globalThis.__schemaMap` for `_ref`.
- Generic JSON→Astro tree rendering (`resolveNode` strips structural keys, spreads props, recurses children).
- One live cross-atom pipeline default: `NO_EXPLAINER_PARENTS = {'Button'}` injects `noExplainer:true` on a Button's media Icon/LottieIcon.
- `textonly` transform — the heavily-built mode (strips prop classes, collapses chrome, swaps LottieIcon→static, hides decorative, promotes ui-control labels, relocates anim-explainers).
- Animation-explainer inline mode + MutationObserver re-run.
- `mode-readers.ts getRenderMode()` normalises canonical values AND human aliases (calm→reduced, easy-click→assistive, reading→textonly).

**Deferred / referenced-but-not-built**
- **AAC render mode — NOT built.** `aac` appears only inside `textonly.textonlyStyles` in `render-rules.json`; it is **not** a key in the MODES registry nor in the `RenderMode` type. AAC today is build-time card infra (`aac-inline.ts`, `aacResolver.ts`) plus the `shared-bar.ts aac:true` layout flag. `aac-cards.ts` is marked DEPRECATED. AAC-as-5th-render-mode is planned (~2-3hr) but unbuilt.
- **`reduced` transform is an intentional no-op** — animation systems own reduced behaviour (GSAP stagger, `anim-trigger.ts`, gradient JS gating).
- **`assistive` transform is an empty function** — all layout/target-size changes delegated to CSS (`render-assistive.css`), which is referenced in `render-rules.json` but not verified in this pass.
- **`render-pipeline.ts` / `renderProps` / `mergeColourStyle` — built but NOT wired in.** No live importer anywhere in `src`. The build renders ALL props in every mode and `render-controller.ts` strips at runtime; the include/strip/`forceProps`/`renderOverrides` pipeline is never exercised.
- **Human-language aliases not dispatched**: `mode-readers.ts` normalises them, but `render-controller.ts` MODES keys only on canonical values; a literal `data-render="reading"`/`"calm"` would miss the main transform dispatch.
- **Legacy `#a11y-content-wrapper` fallback** still in `initRenderController` — a banned/dead id; current pages use `#main-content`.

## 5. Dependency order for remaining work

Respecting atoms → CSS → responsive → gates → render-mode. Contrast and keyboard/target-size items are deferred to the dedicated accessibility + Button audits, not done inline.

1. **Card — schema reconciliation DONE (2026-06-08).** New layout-preset model (no `slots`, no `_ref`, `cardType` enum) + (B) nested-slot validator lock landed (proof 7/7, `validate:data` 9/9). Remaining **124** are legacy `Card.css`/`Card.astro` design-reference files — cleared by building each `cardType` (`.card--{type}`) + migrating consumers to the JSON card test page. No longer the top correctness gap.
2. **Caret — proper atom build.** FormField rides Caret's CSS load; until Caret is decoupled/renamed, FormField cannot be re-logged clean. (Blocks FormField.)
3. **FormField — finalise once Caret lands.** Confirm assistive-as-zone, wire `aacPhrase`, reconcile colour-group log note.
4. **Section — implement `bg` enum CSS + add render-mode decision.** Validator-clean but functionally incomplete (silent no-op classes). (Atom-CSS layer.)
5. **Shape — run the formal v2 audit + both validators; log it.** Validator-clean but never audited or logged; confirm runtime-token allowlist and no-fallback exception sign-off. (Atom-internal.)
6. **TextEffect — create schema + move `[data-render]` to gate + tokenise inline shadows.** Schema-less and 14 issues. (Atom → CSS → gate.)
7. **Burst — schema/.astro reconciliation + `_format` removal + JS-motion-gate confirmation.** (Atom → gate.)
8. **FigCaption — create schema + define render-mode contract; pair-audit with Tooltip via `shared-bar.ts`.** (Atom + shared infra.)
9. **Tooltip — re-log the `--bar-*` rewrite, restore/remove responsive file, clear consumer migrations.** (Render-mode + consumer.)
10. **Reconcile the `assistive` render key across all schemas** (Grid, Heading, Text, Badge, Button, Icon, Image, Link, List, LottieIcon, Tooltip, FormField, Shape) — decide per-atom whether to add the key or document gate-handling. (Render-mode layer, after atoms are individually clean.)
11. **Wire (or formally retire) `render-pipeline.ts`** — decide whether the include/strip pipeline is the future or whether runtime stripping is canonical; remove the dead `#a11y-content-wrapper` fallback. (Pipeline layer, last.)
12. **Deferred to the accessibility + Button audits** (NOT inline): assistive 64×64 target sizing, 3px focus indicators, Badge 6.10 contrast, icon-contrast-on-fill, the global print stylesheet layer, and the final cross-atom render pass.

## 6. Drift — docs vs code (reconcile to the code)

Each item: what the DOC says vs what the CODE/validator actually does. Reconciliation direction is **fix the doc (or log a validator gap), never bulk-add validator rules**.

**D1 — Card "PASS" vs validator FAIL (131). RESOLVED 2026-06-08.** Audit-log called Card PASS (2026-03-10); the atom validator reported FAIL. CODE WON: Card was not clean. Schema has since been rebuilt to the layout-preset model (no `slots`, no `_ref`, `cardType` enum) and the (B) nested-slot lock landed; the remaining **124** are legacy CSS/astro design-reference files (see §2). The doc-vs-code reversal is closed.

**D2 — Four render modes claimed, three in nearly every schema.** CLAUDE.md mandates `{ full, reduced, assistive, textonly }`. CODE: Page, Section, Grid, Heading, Text, Badge, Button, Icon, Image, Link, List, LottieIcon, Tooltip, FormField, Shape all declare only `full/reduced/textonly` (Icon `textonly:null`). Only **Card** declares all four. → Either add `assistive` or document per-atom that assistive is gate-handled; the blanket "every schema has 4 keys" claim is overpromising.

**D3 — Audit log claims "4 render keys" for atoms whose schemas have 3.** Logged for Badge, Button, Grid, Icon, Image, Link, List. CODE: those schemas have 3. → Audit-log entries are stale; correct them.

**D4 — Audit log claims in-component `[data-render]` CSS for Button & Grid.** Log records `[data-render]` blocks added directly to `Button.css`/`Grid.css`. CODE: grep finds **zero** `[data-render]` selectors in either — and CLAUDE.md itself bans them in component CSS. The rules now live in gate files (or are missing). → Update the logs; verify the assistive sizing actually exists in a gate file.

**D5 — Icon/Heading/Image logged PARTIAL but validator-clean; Text/Badge "PASS" describe a superseded colour API.** Icon/Heading/Image are PARTIAL in the log yet `validate-atoms.cjs` reports them clean. Heading log describes a `color` enum `[accent,text,muted,inherit]` + a `colour` pipeline group that the current schema (using `brandColor [primary,secondary,neutral,text]`, no colour group) does NOT contain; Text log describes a single `color` prop superseded by split `brandColor`+`rainbowColor`. → Logs are stale; re-sync to the current colour API.

**D6 — Tooltip "PASS" describes a rewritten-away implementation.** Log: `--_tooltip-*` tokens, glass/neon/brutalist themes, monospace, 8-token colour group. CODE: rewritten around `--bar-*` with an empty `colour:{}` group (commits a5d4b6ab4, 51cfc4b10). → Re-log; the PASS is currently unverifiable.

**D7 — `category:"atom"` contract is not enforced by any validator.** CLAUDE.md requires `category:"atom"`. `validate-atoms.cjs` gaps explicitly note "no check of category"; `schema-validator.ts` gaps note "no check of category." → Logged validator gap (backlog), not a reason to add a rule now. The contract relies on manual audit.

**D8 — `renders` keys/targets are claimed as a contract but enforced by no validator.** CLAUDE.md defines the renders block in detail; both content validators explicitly note they do NOT check `renders` keys or targets (`validate-atoms.cjs` R28 only flags keys *other than* full/reduced/textonly, and would actually flag a correct `assistive` key as non-canonical — i.e. R28's allowed set is `full/reduced/textonly`, contradicting the 4-mode doc). → Doc vs validator conflict: R28's allowlist omits `assistive`. Record as a logged validator gap; do not bulk-edit R28 now.

**D9 — `textonly-gate.css` claimed, but textonly stripping is done in JS.** CLAUDE.md lists `src/styles/gates/textonly-gate.css` as the per-atom visual-stripping authority. CODE: the heavy textonly work is the `transformTextonly` DOM transform in `render-controller.ts`; the live CSS file confirmed in the import chain is `textonly.css` (not `textonly-gate.css`). → Reconcile the doc's gate-file name/role to what actually ships.

**D10 — AAC described as build infra in CLAUDE.md, but memory plans it as a 5th render mode; neither is "built as a mode."** CLAUDE.md (correctly) treats AAC as build-time cards + display modes. CODE agrees: no `aac` in MODES or `RenderMode`. The drift is that `aac-cards.ts` (named in CLAUDE.md as the renderer of AAC cards) is **marked DEPRECATED** in code. → Update the alt-text doc to point at the current AAC card path, not `aac-cards.ts`.

**D11 — `render-pipeline.ts` / pipeline-routing contract is documented as live but is not wired in.** CLAUDE.md "Pipeline Routing" describes `renders`-as-atom-name routing and pipeline-only props (`fallbackIcon`) being routed by mode. CODE: `render-pipeline.ts`/`renderProps`/`render-rules.json` include/strip/`forceProps`/`renderOverrides` have **no live importer**; the build renders all props and the runtime controller strips. The LottieIcon "reduced/assistive→Icon, textonly→label→Text" routing the doc cites is therefore not exercised by the live path (and LottieIcon's schema routes textonly→Icon, not label→Text). → The Pipeline Routing section overpromises; mark it as designed-not-wired and reconcile the LottieIcon example.

**D12 — `#a11y-content-wrapper` is banned by CLAUDE.md but still referenced in code.** CLAUDE.md: component CSS must contain no `#a11y-content-wrapper`. CODE: `render-controller.ts` (lines 370, 395) still falls back to `#a11y-content-wrapper`. (Note: this is controller JS, not component CSS, so it's outside the literal CSS rule — but it contradicts the "banned/dead" memory claim.) → Remove the dead fallback; current pages use `#main-content`.

**D13 — Alt-text 6-mode set vs code that references `inline`/`enlarge`.** CLAUDE.md `data-alt-display-mode` = `hidden|caption|overlay|tooltip|subtitle|replace`. CODE: `figcaption.ts`/CSS reference `inline` and `enlarge`, which are not in that set, and only act on `tooltip`/`subtitle`/`inline`. → Doc and code disagree on the mode vocabulary; reconcile (flag, do not silently fix). FigCaption also doesn't handle `caption`/`overlay`/`replace` — confirm another module owns them.

**D14 — "No `_format` escape hatch" hard rule vs schemas still carrying `_format`.** Memory hard rule: enum it or runtime-validate (FREE_STRING_PROPS). CODE: Icon (`name`, `morphTo`), LottieIcon (`slug`/`src`/`fallbackIcon`), Link (`href`/`download`/`contentLink`), Burst (`target`/`tracePath`/`traceSize`), TextEffect props still use `_format` — and `schema-validator.ts` short-circuits on `hasFormat` (i.e. the engine *honours* `_format`, the opposite of the doc's intent). → The validator engine still supports the escape hatch the doc bans; record as a logged gap + per-atom doc fixes, not a bulk rule change.

**D15 — `label*`/`content*` free-text rule vs Image/TextEffect prop names.** Memory hard rule: free text only in `label*`/`content*` keys, propagated through schema + .astro. CODE: Image schema uses `contentAlt*` keys but `Image.astro` still destructures the old `alt`/`altWord`/`altDescriptive`; TextEffect uses raw `text`. → Schema/.astro out of sync; reconcile names.

**D16 — Validator legend lists rules the loop doesn't run.** `validate-atoms.cjs` legend lists rules up to 45, but **Rule 15 was removed** and **Rule 41 has no implementation**. → Logged validator gap (backlog) — fix the legend/comment, do not implement R41 now just to match the legend.

**D17 — `validate-data.ts` header claims it "walks every `src/data/**`".** CODE reads only `src/data/test/<name>.json` per audited atom; production/archived data is unvalidated. → Overpromising file-header comment; fix the comment to match the code.

**No drift found** for the core CSS-hygiene contracts that the atom validator actually enforces on the clean atoms (no `@layer`, no `!important`, no `prefers-reduced-motion`, no `.a11y-*`, no `:global`, no scoped `<style>`): the 13 clean atoms pass these, and `validate-atoms.cjs` R16–24 implement exactly what CLAUDE.md claims. Likewise, the gate files `motion-gate.css`, `reduced-gate.css`, `assistive-gate.css`, and `textonly.css` are referenced in the live import/gate architecture as the docs describe.

## How to keep this current
Update this document at the end of every working session — re-run both validators (`node scripts/validate-atoms.cjs` and `npm run validate:data`), reconcile any new audit-log entries against that output, and revise §1–§6 so the code (not the docs) remains the source of truth.
