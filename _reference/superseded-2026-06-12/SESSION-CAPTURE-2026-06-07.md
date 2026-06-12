# Layout engine — capture note (session 2026-06-07)

Hand this to Claude Code to pin into `LAYOUT-ENGINE-SPEC.md`. Each item says
where it goes. These are decisions reasoned this session that are NOT yet in the
committed spec — capture them before they drift (the assistive-ghost lesson).

Resolved earlier and already committed: E1 (measure own width), E2 (row shape +
distribution enum), E3 (auto-fit, table as cap). The items below are the NEW
reasoning from this session.

---

## 1. Two relationships only — "beside/stacked" vs "on top of"  → §1 or new §2.9

Every layout, at every level, is built from exactly two spatial relationships:
- **In-flow (rows):** items beside each other (multi-item row) OR stacked
  (rows in sequence). Beside and stacked are the SAME mechanism — rows of items.
- **Layered (overlay):** one item is the background, others float over it.
  This is the media-mode mechanism (`background`/`fill`), NOT a row.

Rows arrange *beside*; modes/layers arrange *on top*. Two axes, never confused.
A cell may contain a layered stack while itself sitting in a row.

## 2. A cell can contain its own rows (nesting)  → §2.2 (extend item shape)

An item in a row is EITHER an atom OR a sub-container of rows. This is what makes
"image left, [meta over body] middle, button right" expressible: the middle cell
holds two stacked rows. Item shape extends to allow `rows: [...]` as an
alternative to `component`. Same nesting principle as Page→Section→Card, one
level deeper.

## 3. Overlay-position enum — THE GAP this session found  → §4.3 (with media modes)

Media MODES exist (`inline|fill|background|overlap-edge`) but nothing says WHERE
a layered item sits on the thing behind it (e.g. a badge on an image, top-left).
Add an `overlayPosition` enum for items in a layering mode:
`top-left | top | top-right | left | center | right | bottom-left | bottom | bottom-right`
(nine-point grid). Author picks a named position, never pixel coords. Validatable.

## 4. Cell sizing behaviour — `content` vs `fill`  → §2.8 or new §2.9

How widths balance in a side-by-side row WITHOUT measuring:
- `content` = hug content width (CSS `auto`). Images, buttons.
- `fill` = take remaining space (CSS `1fr`). The flexible cell (text/middle).
A row like image|middle|button is `auto 1fr auto`: image & button hug, middle
fills. Responsive for free — the `fill` cell absorbs/yields space as the
container changes. This is the width-balance mechanism; it's an enum.

## 5. Vertical distribution within a cell  → §2.2 distribution note (extend to 2 axes)

Distribution applies on BOTH axes. Horizontal (already specced):
`grid|start|center|end|between` across a row. Vertical: same enum DOWN a cell,
for when a cell is taller than its content (equal-height rows make cells match
the tallest). E.g. button `center` vertically against a tall image; middle
content `start` (top). Height-balance = equal-height row (auto) + vertical
distribution.

## 6. Weight is DEMOTED — optional override, not required  → §2.3 + §2.8

Reverse the "every item carries a weight" framing. Default behaviour:
- single-item rows: full width, item sizes itself (image fills width, height by
  aspect ratio). No weight.
- multi-item rows: equal share by default (`grid`), OR content/fill behaviour
  (item 4) for hug-vs-fill rows.
Weight is the OPTIONAL OVERRIDE for one case only: a deliberate UNEQUAL
side-by-side split (big image, narrow text). Unspecified weight is NOT an error —
it's the default (equal / behaviour-driven). Do NOT infer weight from content
(rejected: unpredictable, unvalidatable, makes the engine judge — breaks the
enum-only contract). Author sets weight only to emphasise; never inferred.

## 7. Balance is DECLARED, not computed  → §2.8 principle line

The author/designer never measures or computes balance. They declare BEHAVIOUR
(content vs fill, equal-height, vertical placement) and the browser's grid does
the measuring continuously, at every screen size. "Measuring" happens in the
browser, automatically — never by hand, never in the JSON.

## 8. THE BIG ONE — two layers: engine vs presets  → new top-level §10 (or §4.4)

The session's key realisation. There are two layers, and they were getting mixed:

- **The ENGINE** (general machinery): rows, cells, content/fill, overlay,
  vertical distribution, weight, capacity table. LOTS of capability. Used by the
  DESIGNER. This is everything specced so far.
- **PRESETS / designed cards** (specific): "horizontal card", "product card",
  "profile card" — each a FIXED arrangement (which cells, hug/fill, vertical
  placement, nested rows, overlay) defined ONCE on the engine by the designer.
  This is the chrome-vs-designed-card distinction from the start of the Card work.
- **The AUTHOR / AI** picks a preset + fills content slots. ~2 choices: card type
  + content. No sizing, no placement, no weight — the preset already decided.

**Card is an atom, built like Button.** `cardType` is the variant enum
(`horizontal | product | profile | feature | …`) exactly as Button has `variant`
(`fill | glass | glow | …`). Each cardType's layout lives in `Card.css` keyed by
its class, same as `.btn--fill` vs `.btn--glass`. Content slots are props
(`image`, `meta`, `body`, `button`), schema-validated like `contentButton`. Same
files, same enum pattern, same validation, same author experience as every other
audited atom. The "engine" reasoning is HOW the preset CSS works (rows + cells +
container queries); `cardType` is WHAT the author sees.

Consequence for AI generation: an AI filling a preset's content slots CANNOT make
a bad layout — it makes no layout choices, only content choices. Worst case is
awkward text, never broken design. Strongest safety position.

## 9. Honest guarantee boundary  → §2.6 or new guarantees section

State plainly (don't overclaim — overclaiming is itself drift):
- **Hard guarantees (structural):** no overflow (no absolute sizes exist); no
  invalid composition (cell-content enums); no sub-floor accessibility (rem
  floors, 44px targets, prose line-length). These are IMPOSSIBLE to violate.
- **Soft (not guaranteed):** good taste / ideal composition. Relative sizing
  eliminates SIZE-clash (proportional, on one scale) but NOT content-driven
  imbalance (very short text under a tall image, ragged heights from uneven
  content). Presets + equal-height rows + content guidance handle the residual —
  NOT the engine. The engine guarantees safe + proportional, never "tasteful".

## 10. Open sub-decision (not yet made)

Default for unspecified weight in a side-by-side row: `medium` (fixed middle) vs
"even share of remaining space after content-sized cells take theirs". Item 6
leans to behaviour-driven (content/fill) as the default with weight as override;
confirm the exact default rule when building the first preset.

---

## Suggested next step
Don't add more engine surface. Define the FIRST PRESET (`card-horizontal`) for
real — which cells, hug/fill, vertical placement, nested middle rows, accepted
atoms per slot — then the author's tiny input against it. That makes "specific
rows" and "not a lot of choice" concrete, and it's the bridge from engine-spec
to buildable Card atom. (A worked sketch exists in the session: image left
[content], meta-over-body middle [fill], button right [center], equal-height.)
