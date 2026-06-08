# VALIDATOR-NESTED-SLOTS-SPEC

Status: DRAFT — scoped 2026-06-08. The "(B)" validator pass referenced from the
Card build. Self-contained. **The Card uses NESTED atom slots, so this pass is the
PREREQUISITE for the Card's styling lock** — nested slots can't reject styling
until it lands.
Companion to BUILD-STATUS.md (validator state) and LAYOUT-ENGINE-SPEC.md (§11/§12).

> Purpose: let a nested atom slot lock its props — reject styling the slot
> doesn't expose, gently default a bad value on a prop it does — by routing the
> nested check into the severity model that ALREADY exists. No new surfacing
> mechanism; the `error`/`warn` plumbing is reused.

---

## 1. The problem (proven, not assumed)

A live probe through the real `validateComponent` (2026-06-08) showed:

| Case | Result |
|---|---|
| unknown **top-level** prop | **error** (rejected) |
| `media` sub-prop bad enum (`weight: bogus`) | **VALID** — not enforced |
| `media` bad `component` | **error** (the one nested check that exists) |
| `media` unknown sub-prop | **VALID** — not enforced |
| `_ref` child bad enum (`level: 99`) | **error** (recurses child's full schema) |
| `_ref` child **valid styling** (`size: xl`) | **VALID** — styling allowed |
| `_ref` child unknown prop | **error** |

Root cause (`schema-validator.ts`): `flattenSchema` (174-184) flattens exactly
ONE level (`props.{group}.{prop}`); a prop's own inline `properties` are never
inspected. The only nested checks are the `media.component` special-case
(444-458, **hardcoded `if (key === 'media')`**) and `_ref` recursion against the
child's **full** schema (460-479).

`_ref` is confirmed UNUSED across the codebase (Badge, Heading, List, Button,
FormField all nest children as `media`-style component nodes — `{ component, …child
props }`, child owns its props — none use `_ref`). So the only nested check that
actually fires in practice is the `media.component` special-case, and it fires
**only on a slot literally named `media`**. The `_ref` recursion engine (460-479)
is dormant but real — (B) reuses it (see §3).

Consequence for any atom with a component-node slot NOT named `media` (the Card's
`title`/`meta`/`body`/`button`): the slot's `component` enum is **not enforced**
(the special-case never fires for it), and the child's own props are **never deep
-checked** against the child's schema. Unknown-prop rejection works only at the
**top level**. So the nested Card can *render* (children resolve at runtime), but
its slots **cannot reject styling or even enforce which atom they accept** until
this pass lands. This pass is what makes the nested Card's lock real.

---

## 2. The goal

Extend the **existing** severity model inward — one level deeper than today:

- **Prop the slot does NOT expose** → `error` (loud). Matches today's top-level
  unknown-prop behaviour exactly — extending the existing policy inward, not a
  new one.
- **Invalid value on a prop the slot DOES expose** → `error` (loud), the SAME as a
  bad enum at the top level today. One rule everywhere — no dual standard. (D1
  RESOLVED 2026-06-08; see §4.)

Reuse the surfacing that already works (`Renderer.astro` throw→DEV-overlay for
`error`, `console.warn` for `warn`; `validate-data.ts` exit-1 for `error`, warns
ignored). **No new mechanism — only the routing.**

---

## 3. The change (code-grounded, bounded)

Two precise moves on the existing nested machinery — NOT abstract "recurse
deeper". A component-node slot is any prop whose `def.properties.component` is an
enum (the universal pattern: `media`, and now Card's `title`/`meta`/`body`/
`button`).

**Move 1 — generalise the `component` check beyond `media`.** The special-case at
444-458 is gated on `if (key === 'media')`. Drop the name gate: enforce
`value.component ∈ def.properties.component.enum` for **every** component-node
slot. (Today only a slot named `media` gets this; after, `title` rejects a
non-Heading, etc.)

**Move 2 — deepen to the child's own props, auto-targeted by `component`.** Once
`component` names the child atom, look up THAT atom's schema and validate
`value`'s remaining props against it — i.e. run the recursion `_ref` already does
(460-479), but targeted via the `component` value instead of an explicit `_ref`
key. This is *why* `_ref` is redundant: `component` makes the target derivable.
The child's schema (Heading's size/level enums, Text's size, Button's variant)
does the constraining; the parent never re-declares child props. Per child prop:
- prop **not in the child's schema** → `error` (`"unknown prop … not in <Child>
  schema"`, dotted path `title.level`).
- prop present, has `enum`, value not in enum → `error` — identical to the
  top-level enum check today (D1 = error: consistency + the loud lock).
- the parent-level guard props in `def.properties` (`component`, `semanticRole`,
  …) validate at the parent; everything else validates against the child.

`flattenSchema` stays one-level; both moves are local to the prop. Errors carry
the dotted path so DEV/CI messages stay precise — the surfacing already prefixes
`Component.prop`.

---

## 4. Decisions (RESOLVED 2026-06-08)

**D1 — invalid value on an exposed sub-prop → `error`. RESOLVED.** Consistent with
the top-level enum check (one rule everywhere) + the loud lock. Safe because D2
(opt-in) + Card is brand-new = zero existing data newly failed. Rationale retained:
- `warn`+default (rejected): slot content is resilient — a slightly-off value
  defaults and the card still renders; author warned. Gentler, but a dual standard.
- `error` (CHOSEN): consistent with top-level (bad enum = error everywhere). A bad
  value fails the build — exactly the lock the Card wants.
- Note: this ONLY concerns *exposed* props. Non-exposed props are `error` either
  way (§2).

**D2 — scope → opt-in per slot. RESOLVED (default); ROLLED OUT 2026-06-08.** Move 2
(deep child-prop check) fires only on slots flagged `_lockProps`. Now enforced on
Card (5 slots) + Badge/Button/Heading/List media (see §5 rollout log); other atoms'
media nodes stay untouched until their own audit opts them in. Move 1 (the
`component`-accepts check) is global-safe regardless. Rationale retained:
- **Opt-in** (CHOSEN): the nested check fires only on slots that mark
  themselves (e.g. a `_strict: true` / `_lockProps` flag on the prop def). The
  Card's slots opt in and lock; existing `media` nodes elsewhere are untouched
  until audited. **Contained blast radius.**
- **Global**: every inline-`properties` block is enforced at once. Bigger — it
  retroactively validates every `media` node in the codebase (Button/Heading/
  List/Shape), surfacing existing latent invalid sub-props. Needs a full
  data-audit before it can land without breaking the build.

---

## 5. Blast radius + rollout

### Rollout log — DONE 2026-06-08 (Card + all audited media atoms)
The lock is now enforced on **Card** (5 slots) plus the audited atoms that have a
component-node slot: **Badge.media, Button.media, Heading.media, List.media** —
each opts in via `_lockProps: true`. (Link / Text / Tooltip have no component-node
slot; FigCaption has no schema — rendered via Image. **FormField** has per-option
media at `options[*].media` — array-nested, which the flattened-prop lock can't
reach and `validatePage` doesn't recurse into `options[]`; locking per-option
media needs a separate mechanism — DEFERRED.)
- **Infra fix** (prerequisite — was a silent hole): `validate-data.ts` `loadSchemas`
  now loads **ALL** schemas into `globalThis.__schemaMap` so Move 2 can resolve a
  slot's child atom by `component` (Heading.media → Icon/Image/Shape). The
  **top-level gate stays audited-only** — `validatePage` is handed an audited-only
  map, so non-audited atoms (Grid/Section/…) are NOT incidentally enforced.
- **Result**: deterministic dry-run AND live `validate:data` both report **0 new
  errors** — every audited atom's media data was already clean against its child
  schema. Build stays green.
- **Side finding (logged, deferred):** loading non-audited schemas into the
  *top-level* gate would surface **69 latent bugs** — `Grid.variant` unknown (×67,
  the `cols`/`variant` drift) + `Section.gap "6xl"` not in enum (×2). Out of scope
  (Grid/Section aren't audited); deferred to their audit. See BUILD-STATUS §3.

### Original rollout recipe (for the next atom that opts in)
Turning on nested enforcement newly-validates data that has passed untouched.
Required steps, in order:
1. Implement behind the D2 scope decision (opt-in keeps it small).
2. Run `node scripts/validate-atoms.cjs` + `npm run validate:data` and triage
   everything newly surfaced. If D1 = `error`, the build fails until all surfaced
   data is fixed — so either fix-first or choose `warn` for the rollout window.
3. `log()` nothing silently dropped — every newly-enforced rejection is a real
   error/warn the author sees (the whole point).

---

## 6. Out of scope
- No change to `flattenSchema`'s one-level flatten (the recursion is local).
- No change to the top-level behaviour (already correct).
- **Prerequisite for the Card's lock.** The Card uses nested component-node slots,
  so enforcing which atom each accepts AND rejecting styling on them needs this
  pass. The Card can *render* nested without it (children resolve at runtime), but
  nothing about the slots is validated until this lands (non-`media` slots get no
  check at all today) — so honouring the project's "no silent ignore" standard on
  the Card means this pass ships before the Card's lock is claimed clean.

---

## 7. Done = 
Nested slot props route into the existing severity model: non-exposed → `error`,
invalid-exposed → `error` too (D1 = one rule, identical to the top level) —
surfaced by the existing Renderer/validate-data plumbing, no new mechanism, blast
radius contained by D2 (opt-in).
