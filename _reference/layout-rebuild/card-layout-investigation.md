# Card / Section / Page / Layout — Investigation (what exists)

Read-only investigation, 2026-06-02. Pure "what exists" — no fixes, no recommendations.
Companion to `LAYOUT-ENGINE-SPEC.md` (the rebuild brief that this investigation fed).
Drift for these atoms lives in `BUILD-STATUS.md` §6; the compliance axes in `COMPLIANCE-INVENTORY.md`.

---

## Part 1 — How Card works today

**Card is pure chrome with a single default slot — NOT structurally slotted.**
- Only slot: `<slot />` at `Card.astro:131`. No named slots anywhere (`slot name=` = zero hits). Content enters one way: children nested between `<Card>…</Card>`.
- Header comment (`Card.astro:23`) and schema slot text advertise structuring with `.card__header/body/footer`, but Card never emits those wrappers — consumers would hand-author them, and none do.
- `Tag` is `<a>` when `href` set, else the `as` prop; carries `data-card`, optional inline `--card-bg`, `...rest` data-attribute passthrough.

**`Card.css` (484 lines), three groups:**
- **(a) Surface / "card-ness":** `.card` base; variants `--default/--transparent/--outline/--glass/--liquid/--neumorphic/--pressed/--comic/--tech`; hover-surface treatments; shadow/radius/padding/border scales; `--masonry/--link/--flush/--separator/--wide`.
- **(b) Styling Card's *contents* (not the surface):** `.card__header/body/footer/image/overlay/content/icon-wrapper` + image aspect helpers (372–450). These style elements **Card never renders** — dead for Card-atom consumers. Only `MasonryCard.astro` uses `card__*` classes, and it **bypasses the Card atom** (raw `<Tag>`, own `masonry-card.css`).
- **(c) Gate/zone selectors (belong in gate/zone files):** `[data-hover="none"]` (240–268), `[data-hover="instant"]` (271–274), `[data-mode="dark"][data-hover="none"]` + `[data-high-contrast][data-hover="none"]` (258–259), `[data-render="reduced"|"assistive"]` (469–470, 478). All four families present. Many rules use `var(--token, fallback)` fallbacks.

**`slots` block** (`Card.schema.json:39-41`): description string only — inert, nothing reads it; exactly what Rule 39 forbids at schema root.

**`bg` prop:** declared `Card.astro:40`+58, used line 127 (`style={--card-bg: …}`), consumed by variant rules. **Not in the schema** (schema/code drift). Only `AuthorCard.astro:54` passes it, as a raw CSS custom-property string.

---

## Part 2 — The media-composition / enum-limiting pattern

**Mechanism:** a nested `media` object in the schema whose `properties.component` is a required **enum** — the single point limiting which atom can nest. Per-parent allowlists (hand-written, not shared-enums):
- Shape → `["Icon","LottieIcon","Image"]` (`Shape.schema.json:38-48`)
- Button → `["Icon","LottieIcon"]` (`Button.schema.json:88`)
- List → `["Icon","Shape"]` (`List.schema.json:25`)

Runtime enforcement is **de facto**: the `.astro` only has render branches for known names; an unlisted `component` renders nothing.

**Forward / strip:** all three destructure `component` off and spread the rest bag onto the child, then targeted edits:
- **Button** — deletes a 9-name `heavySvgProps` denylist (morph/draw/fill) unless icon-only (`Button.astro:164-170`); strips `brandColor/rainbowColor/colorTier` on fill-variant contrast clash.
- **Shape** — same icon-contrast colour strip; validates `semanticRole='background'` on itself, does NOT inject it.
- **List** — injects `semanticRole:'background'` + `mediaBgSize` when `mediaBg && child===Shape` (`List.astro:93-95`); conditionally forwards `mediaSize`→`size`.

**Constraint model:** no allowlist/pick for child props — "spread everything except `component`, then selectively delete/inject" (denylist-by-deletion + forced-overwrite). `media` typed `Record<string, any>` everywhere; the schema `component` enum + runtime deletes are the entire enforcement surface.

---

## Part 3 — Section / Page / Layout

**Section — exists as an atom.** Pure class-mapper `.astro` emitting one tag + `<slot />`. Accepts **arbitrary children** via the generic Renderer pipeline — does NOT use the `media.component` enum pattern. Width constrained **only** when the optional `container` prop is set → global `.container` utility + `--container-*` tokens (xs–7xl/full/prose). `bg` enum declares `tint/light/solid` but only `bg-none` has CSS.

**Page — exists as an atom.** Top-level `<main>` shell, generic `<slot />`, arbitrary children. **No max-width** — only horizontal `--page-margin`, `--page-bg`, nav-height offset. Max-width delegated downward to child Sections' `container`.

**Layout — no Layout *atom* exists.** Only `src/layouts/` Astro page templates (`BaseLayout`, etc.) and a `CardReveal` molecule. No Layout schema/registry.

Cross-cutting: Section and Page are the same shape — pure class-mapper, generic slot, three renders pointing at their own file, empty content/colour/animation groups, real props under `visual`. Width is layered: Page = outer margins, Section = optional max-width, children otherwise unconstrained.

---

## Part 4 — Rules that govern these atoms

**No-slots:** **Rule 39** (`validate-atoms.cjs:708-714`) — literal presence check banning `slots`/`class`/`style` at schema **root**. Rule 36 also bans `class`/`style` inside groups; runtime `FORBIDDEN_PROPS` rejects them in data. `slots` is only caught at root.

**Gate-authority (banned in component CSS):** Rule 11 `[data-render="assistive"]`; Rule 12 `[data-mode=]`/`[data-high-contrast]`/`[data-render="textonly"|"reduced"]`/`[data-highlight-links]`; Rule 16 `@layer`; Rule 17 `!important`; Rule 18 `prefers-reduced-motion`; Rule 19 `.a11y-*`; Rule 20 `#a11y-content-wrapper`. MOVE/WARN: Rule 22 `:focus-visible`, Rule 29 `:hover`, Rule 21 `transition:`, Rule 31 `@keyframes` — **Card/Section/Page are in none of the exception tables** (a Layout atom would inherit none either). `validate-data.ts` hard-errors a subset but only for `AUDITED_COMPONENTS` (excludes Card/Section/Page). `[data-theme-chroma]`/`[data-motion]` named in CLAUDE.md but unenforced.

**Schema structure:**
- Prop groups — **enforced** (Rule 25 + 26/30/33/35).
- `category:"atom"` — **doc-only, unenforced**.
- `renders` block — Rule 28 allows only `full|reduced|textonly` (assistive FAILs) + Rule 14. Render-value resolution not checked. (`render-rules.json:31-40` still has an `assistive` entry with `forceProps` — live drift.)
- No CSS in schema — **enforced** runtime (`CSS_PATTERNS`) + Rule 13.
- Content/label naming — allowlist enforced (`isContentProp`) but exact `content<Atom>`/`label<Atom>` shape doc-only.
- **Rule 38** special-cases `largeComponents = [Card, Section, Page, Image]` to allow `gradientType`/`gradientFocus` (forbidden elsewhere). A future Layout atom is NOT in that list.

**Renderer specials:** `Renderer.astro` fully generic — no component named. `render.ts` registry flat; only parent special-case is `NO_EXPLAINER_PARENTS = {Button}`. `render-controller.ts`: Step 6 "Cards" (strip prop classes + hide `.card__overlay/__arrow/__quote-icon` in textonly), Step 12 "Section reorder" (move content-symbol icons after headings in textonly); **Page has none**. MODES = full/reduced/textonly (assistive removed 2026-06-02).
