# Focus Ring Data Gate — Spec

**Status:** Proposed, not yet built
**Date drafted:** 2026-05-25
**Related files:**
- `src/styles/gates/focus-gate.css` (existing — mechanism + per-element overrides)
- `src/lib/focus/focus-system.ts` (existing — JS attribute manager)
- `src/styles/themes/**/*.css` (existing — declare per-theme `--focus-color`)

---

## Problem

The focus indicator system today has three independent toggles (`data-enhanced-focus`, `data-focus-rainbow`, plus an implicit default) that overlap in purpose. There's no clean way to:

1. **Let the theme engine pick a structural fallback** when its colour deconfliction pass can't give focus a hue ≥40° from neighbouring chromatic slots (happens in tight CVD variants — tritan especially).
2. **Let users pick a global focus ring preference** through the accessibility panel + modal page.
3. **Combine those two** so the engine sets a sensible default per theme, the user overrides if they prefer something else, and the override persists.

Colour alone can't always carry the indicator. Sometimes the *structure* of the ring has to.

---

## Solution

A unified `data-focus-ring` attribute on `<html>` with a small enum of values. Each value is tied to a **triggering condition** — not just a visual taste. New rules live in their own CSS file separate from `focus-gate.css`.

### Ring values + triggering conditions

| Value | Triggered when | Mechanism |
|---|---|---|
| `default` (or absent) | Deconfliction pass found hue room ≥40° from neighbours for focus + highlight | Existing 2-layer square ring with gap. Colour carries the signal. |
| `bold` | Hue survived but landed closer to a neighbour than ideal | Same shape as default, `--focus-thickness` bumped (~0.35rem). Single ring, just heavier. |
| `double` | Deconfliction couldn't hue-separate focus/highlight (tritan tight, full chromatic palette already eating wheel) | 4-layer ring stacking `--focus-color` AND `--highlight-link-color`. Structure carries what colour can't. |
| `rainbow` | User-only personal preference | Animated conic-gradient. Orthogonal to deconfliction — accessibility-incidental. |

There are exactly four because each value has a distinct reason for being emitted. No slot for "dashed" or other styles without a triggering condition.

### Trigger model

The structural-fallback trigger is **a meta token in the theme's output CSS file** — same mechanism as every other theme-engine signal in the system (`--theme-chroma`, `--theme-luminance`, `--high-contrast`, `--theme-contrast`, `--theme-intensity`). writer.py already has the THEME META block to put it in.

```
Theme engine runs deconfliction
        ↓ measures focus/highlight hue separation result
        ↓ if pass fails → writer.py emits a meta token into the theme's
          output CSS (one more sibling in the existing META block)
:root { … --focus-meta-token: <value>; … }   ← in theme.css output
        ↓ CSS cascade
focus-ring.css rules consume the meta token directly
        ↑ user override path (GLOBAL ONLY)
Accessibility panel (Your View) buttons
Modal page buttons
        ↑ override mechanism follows whatever your other Your View
          settings use (likely a data attribute on <html> that
          focus-ring.css also reads); pulled from existing pattern
          at build time, not guessed here
```

Key properties:
- **Pure CSS cascade for the engine trigger.** No JS reads theme JSON. No theme loader sets data attributes. The theme's own output CSS *is* the signal.
- **Per-theme automatically** — meta is per-theme, matches how `--theme-chroma` etc. work.
- **No CVD coupling.** The trigger is "deconfliction pass failed to hue-separate," full stop. It doesn't matter why the wheel ran out (CVD palette, brand theme with nine chromatic slots, anything else).
- **Theme also owns the focus colour** via `--focus-color` token. Colour is declared, ring style is engine-derived from the deconfliction result. Both live in the theme's output CSS.
- **User override path is layered on top** of the engine-emitted meta. Mechanism follows the project's existing Your View convention — to be confirmed at draft time.
- **Strictly global user preference** — no per-element override.

---

## File structure

| File | Role | Status |
|---|---|---|
| `src/styles/gates/focus-gate.css` | Unchanged. Holds the `data-focus-active` mechanism + per-element overrides + always-on rules. | Existing |
| `src/styles/gates/focus-ring.css` | **NEW.** Holds the four ring-style variant rules. Rules gate on the theme-emitted meta token from the cascade (engine path) and on the user-pref mechanism (Your View path, TBD per existing convention). | To create |

Separation rationale: the focus-active mechanism is always-on infrastructure. The ring-style variants are user/engine-pickable presentation. Different concerns, different files.

---

## What stays the same (in `focus-gate.css`)

- `data-focus-active` JS attribute set on focusin / removed on focusout
- `--focus-thickness` / `--focus-color` / `--focus-bg` / `--focus-move-duration` / `--focus-appear-duration` tokens on `:root`
- Per-element overrides (dropdown items get inset ring + fill, dropdown buttons square corners, form fields get padding + border colour swap, card-select targets the card not the wrapper)
- `@media (forced-colors: active)` fallback to system `LinkText` outline
- The orthogonal behavioural toggles: `data-focus-scroll`, `data-focus-dim`, `data-focus-pulse` — these layer on any ring style and stay independent

## What moves (to `focus-ring.css`)

- Current default ring rules from `focus-gate.css:144-167` → the unattributed / "default value" branch of the new file
- Current `data-enhanced-focus` rules at `focus-gate.css:312-318` → the "double" branch (selector swaps from `data-enhanced-focus` to consume the meta token + user-pref mechanism)
- Current `data-focus-rainbow` rules at `focus-gate.css:340-373` → the "rainbow" branch (same swap)
- **New `bold` rule** — single ring, bumps `--focus-thickness` (the only genuinely new CSS)

Exact selector form for each branch (consuming meta token vs reading a user data attribute, or whatever the agreed pattern is) settled when reading writer.py + existing Your View setting code at draft time.

---

## TODO — Build order

1. **Settle remaining open decisions** (see below)
2. **Read writer.py THEME META block** to pull the existing naming convention (sibling of `--theme-chroma` / `--theme-luminance` / `--high-contrast` / `--theme-contrast` / `--theme-intensity`). Name the new structural-fallback token to match the existing pattern — e.g. `--theme-focus`, `--focus-indicator`, or similar
3. **Create `src/styles/gates/focus-ring.css`** with the four variant rules. Rules consume the meta token directly from the cascade
4. **Wire the deconfliction engine** to detect when hue separation fails (or is marginal, for `bold`) and pass that finding to writer.py
5. **Update writer.py** to emit the new meta token into each theme's THEME META block based on the deconfliction result for that theme
6. **Confirm `--focus-color` is already in writer.py output** (likely yes — same theme META) and that `focus-ring.css` consumes it
7. **Audit + migrate consumers** of `data-enhanced-focus` and `data-focus-rainbow`; delete the old attributes after migration
8. **Add Your View panel + modal page buttons** — 4 buttons (default / bold / double / rainbow). Override mechanism follows existing Your View convention (pulled from existing pattern at draft time, not invented here)
9. **Wire user-override persistence** to localStorage (same scaffolding as other Your View settings)

## Open decisions

1. **Meta token name** — sibling of `--theme-chroma` / `--theme-luminance` / `--high-contrast` / `--theme-contrast` / `--theme-intensity`. Pull exact pattern from writer.py at draft time. Likely candidates: `--theme-focus`, `--focus-indicator`, `--focus-style`.
2. **User override mechanism** — follow whatever pattern Your View uses for other settings (likely a data attribute on `<html>` set by panel buttons). Confirm at draft time by reading one existing Your View setting end-to-end.
3. **Migration of legacy toggles** — hard cut at migration time, or alias `data-enhanced-focus` / `data-focus-rainbow` for one release?
4. **Default value handling** — implicit (no token / no attribute = default ring) or explicit (token / attribute set to `"default"` value required)? Implicit cleaner; matches the pattern of other meta tokens.

---

## Out of scope

- **Dashed ring** — explicitly excluded. Would only earn its place if the UI semantically distinguished focused-vs-selected, which it doesn't. Adding it now would be a feature without a use case.
- **Per-element ring override** — not supported. Ring style is strictly a global user/engine preference. Atoms cannot declare ring preference per instance.
- **Shape variation beyond ring presence** — current ring is always square (`border-radius: 0`) except rainbow (`--radius-lg`). No per-value border-radius variation in the four shipped values.
- **`focus-pulse` / `focus-dim` / `focus-scroll`** — these are behavioural enhancements, orthogonal to ring style. They stay as independent toggles in `focus-gate.css`.

---

## Design notes captured from the conversation

- The four ring values fall out of the deconfliction story, not from arbitrary visual choices. Default = deconfliction succeeded. Bold = hue marginally close to a neighbour. Double = no hue room left, structure replaces colour. Rainbow = user fun mode.
- "Double" is structurally a fallback for failed hue separation: two concentric rings in different colours (`--focus-color` + `--highlight-link-color`) stay legible when individual hues would blur into neighbouring chromatic slots.
- This means **zero new CSS infrastructure** is needed for the structural fallback — the rules exist in `focus-gate.css` as `data-enhanced-focus`. The work is renaming + relocating, plus wiring the engine trigger.
- Engine-emitted vs user-set both write to the same attribute. Last write wins. User override persists in localStorage and is restored on page load before the engine runs.
- CVD safety isn't only about focus colour; it's also about the ring being detectable even when the colour signal is weak. Bold and Double both serve that purpose at different intensities.
