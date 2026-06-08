# LAYOUT-ENGINE-SPEC

Status: **SPEC COMPLETE & BUILD-READY** (2026-06-07) — all decisions resolved:
D1–D5, E1–E5, items 1–10, and the first preset (`card-horizontal`) locked.
Not yet implemented — the next move is building the Card atom (§11 / §12), a
fresh-session task (it's the Button pattern, done 11 times before).
Scope: One shared layout engine used at three levels — Page, Section, Card.
**Read §11 first** — the engine is the designer's machinery; an author builds
nothing but picks a preset and fills content. "Card is an atom built like Button."
Companion to BUILD-STATUS.md (status) and COMPLIANCE-INVENTORY.md (axes).

> Purpose: replace Card's legacy slot-based markup (and Section/Page's generic
> `<slot/>` class-mappers) with ONE constrained, composable layout engine.
> The author expresses intent (container size, rows, weighted items); the
> renderer computes columns, sizes, wrapping and reflow. Abuse is structurally
> impossible because every choice is from a constrained set and nothing is
> freeform-placed or freeform-sized.

---

## 1. The core principle

A container holds an ordered list of ROWS. Each row holds ONE OR MANY ITEMS. The
author NEVER picks columns or pixel sizes. The renderer computes columns, sizes,
wrapping and reflow, and caps capacity so a row can never overcrowd.

**Two spatial relationships only (item 1, 2026-06-07).** Every layout, at every
level, is built from exactly two relationships — never confused:
- **In-flow (rows):** items *beside* each other (a multi-item row) or *stacked*
  (rows in sequence). Beside and stacked are the SAME mechanism — rows of items.
- **Layered (overlay):** one item is the background, others float *on top* (the
  media-mode mechanism — `background` / `fill` + an overlay position, §4.3). This
  is NOT a row.
Rows arrange *beside*; modes/layers arrange *on top*. A cell may hold a layered
stack while itself sitting in a row.

**Weight is an optional override, not the core (item 6, 2026-06-07 — supersedes
the earlier "every item is weighted" framing).** The default needs no weight:
a single-item row fills its width; a multi-item row is equal-share (`grid`) or
content/fill (§2.8). Weight is set ONLY to force a deliberate *unequal* split
(big image, narrow text). Unspecified weight is the default, never an error, and
weight is NEVER inferred from content.

**"Grid" is not a separate concept.** A row with one item fills the row (a
single column); a row with several items becomes a grid whose columns the
engine computes. A single-item row is simply the degenerate one-column case of
a multi-item row. The author never flips between a "flow" mode and a "grid"
mode — they put one thing or several things in a row, and the row arranges
accordingly. This is identical at every level (see §4): a Page row may hold one
section or two side by side; a Section row may hold one heading or three cards
across; a Card row may hold one image or a badge + icon split. Same row unit,
same engine, every scale.

Three author concepts only:
1. Pick the container size.
2. Add rows (ordered, top to bottom).
3. Put one or many items in each row (weight only if you want a deliberate
   unequal split — see §2.3).

Everything else — columns, actual pixel sizes, wrapping, responsive reflow —
is derived by the renderer. The complexity lives in the engine, not the author's hands.

This is the JSON-as-page philosophy applied to layout: freedom to choose,
no freedom to break.

---

## 2. The shared engine (level-agnostic)

The same engine runs at every level. Only its CONFIGURATION differs per level
(see §4). The engine itself is:

### 2.1 Container size context (E1 resolved — measure own width)
The container establishes its size context by MEASURING ITS OWN RENDERED WIDTH
(a CSS container-query context — `container-type: inline-size` on each box), NOT
by a value passed down. A box therefore knows how wide it actually is wherever
it lands, so a card in a narrow column genuinely behaves as narrow with no
per-breakpoint rules. Every item weight inside resolves RELATIVE TO THIS MEASURED
WIDTH — never relative to the row or cell. One scale per container; a weight of 3
means the same thing anywhere inside that container.

This is the mechanism that makes **inherited size (D1) real**: a card is never
*told* its size — it *measures* the cell it landed in. The rejected alternative
(a passed-down `--container-scale` value) would require hand-written responsive
rules to reflow, defeating §2.5; it is not used.

### 2.2 Rows
An ordered array. Rows render top to bottom in array order. Each row holds ONE
OR MANY weighted items; the author does not specify columns on a row. A
one-item row renders full-width (one column); a multi-item row is gridded by
the capacity table (§2.4). There is no "flow row" vs "grid row" distinction in
the model or in the author's head — a grid is just a row with more than one
item, and the engine treats the single-item row as the one-column degenerate
case of the same logic. Per row, the author decides one thing or several.

**Row data shape (E2 resolved):** an item is EITHER an atom OR a **sub-container
of rows** (item 2, 2026-06-07) — nesting one level deeper, the same Page→Section→
Card principle. That nesting is what makes "image left, [meta over body] middle,
button right" expressible: the middle cell holds two stacked rows. Weight is
OPTIONAL on an item (item 6) — set it only for a deliberate unequal split; omit
it for the default (equal-share / content-fill, §2.8), and it travels with the
item when set.

**Canonical shape — a row is an OBJECT, not a bare array:**

```json
{ "items": [ <item>, <item> ], "distribution": "grid" }
```

- `items` — the ordered list of weighted items (required). Named `items`, not
  `row`: "a row contains items," not "a row contains a row."
- `distribution` — `grid | start | center | end | between` (optional, default
  `grid`). It is a SIBLING of `items` — **never a `key: value` inside the array.**

A container (Page / Section / Card) holds `rows`, an ordered array of these row
objects:

```json
"rows": [
  { "items": [ … ] },
  { "items": [ … ], "distribution": "between" }
]
```

An item is an object — either an atom or a sub-container of rows:

```json
// an atom
{ "component": "<Name>",
  "sizing": "content | fill"?,        // §2.8 — hug vs fill; optional
  "weight": "small | medium | large"?, // §2.3 — optional unequal-split override
  "vertical": "start | center | end"?, // §2.x — vertical placement in a tall cell
  … componentProps }

// OR a sub-container of rows (a cell holding its own stacked / side-by-side rows)
{ "rows": [ <row>, <row> ],
  "sizing": "content | fill"?,
  "vertical": "start | center | end"? }
```

(`?` = optional.) A cell with `rows` re-runs the whole engine inside itself — one
level deeper. Every optional property has a safe default, so the minimal item is
just `{ "component": "<Name>", …content }`.

How `distribution` behaves:
- `grid` (default) — weight drives equal columns via the capacity table (§2.4 /
  §2.8). Cards-in-a-section, tiles, galleries. Within `grid`, a single-item row is
  the one-column degenerate case (§2.7).
- `start | center | end | between` — CONTENT-SIZED (flex justification): items
  size to their own content, **`weight` is ignored**, and they pack/justify along
  the row. For control bars + footers — a card footer with a badge left and a
  price right = `between`.

So `grid` is the weight engine (the vast majority of rows); the content-sized
distributions are a deliberate per-row opt-in. The §2.7 "one code path" and §2.8
"grid is just a multi-item row" statements describe the `grid` distribution; the
content-sized distributions are the explicit, author-chosen exception — not a
flow-vs-grid mode you reason about for ordinary content.

**Distribution applies on BOTH axes (item 5, 2026-06-07).** Horizontal (above):
`grid | start | center | end | between` *across* a row. Vertical: a per-cell
`vertical` (`start | center | end`) *down* a cell, for when a cell is taller than
its content — which happens in an **equal-height row** (cells all match the
tallest, e.g. a tall image). Example: in `image | [meta/body] | button`, the
button sits `center` vertically against the tall image while the middle content
sits `start` (top). Height-balance = equal-height row + vertical placement; the
author declares the placement (an enum), the browser does the measuring.

**Possible validator rule (backlog):** warn (not error) when an item carries
`weight` inside a content-sized row (`start | center | end | between`) — weight
does nothing there, so flagging it keeps the "every value is meaningful and
checkable" contract honest.

### 2.3 Item weight — OPTIONAL override (item 6, 2026-06-07)
Weight is `small | medium | large` (1 / 2 / 3), **optional**, and exists for ONE
case: a deliberate *unequal* side-by-side split (a big image beside narrow text).
It is NOT required on every item — this supersedes the earlier "every item is
weighted" framing.

Defaults (no weight needed):
- **single-item row** → full width; the item sizes itself (image fills the width,
  height by aspect ratio).
- **multi-item row** → equal share (`grid`, capacity-capped, §2.4) OR content/fill
  per cell (§2.8) for hug-vs-fill rows.

When set, weight resolves relative to the container: rendered size = container ×
weight (a `large` item is bigger in an `xl` container than in a `small` one).
**Unspecified weight is the default, never an error. Weight is NEVER inferred from
content** — inference is unpredictable, unvalidatable, and makes the engine a
judge, breaking the enum-only contract. The author sets weight only to emphasise.

### 2.4 Computed columns (the capacity table)
The renderer computes how many columns a row gets from
(container size × the weight of items in that row), capped by a capacity table
so nothing overcrowds. The author never sees or sets this.

Capacity table (LOCKED — "balanced", derived 2026-06-02, grounded in real
`--container-*` tokens + repo min-widths, adversarially verified; see §7/D4):

| Container tier                  | small item | medium item | large item |
|---------------------------------|------------|-------------|------------|
| small  (~384px, `--container-sm`)  | 2 | 1 | 1 |
| medium (~672px, `--container-2xl`) | 4 | 2 | 1 |
| large  (~1024px, `--container-5xl`)| 6 | 3 | 2 |
| xl     (~1280px, `--container-7xl`)| 6 | 4 | 3 |

Pre-collapse desktop/tablet capacity; `textonly` / `assistive` / ≤480px force
one column regardless. Columns are DERIVED, not authored:
`N = clamp(1, floor((T + gap) / (itemMin + gap)), 6)` — gap ≈ one `--space-md`
(16px); cap of 6 = the existing Grid `columns` enum.

**The dials** (change → columns re-derive):
- Tier representative widths: 384 / 672 / 1024 / 1280 px (`--container-sm/-2xl/-5xl/-7xl`).
- Comfort min item widths per weight, in **REM not px** (so floors scale with
  the user's font-size / zoom — the a11y floor is non-negotiable): small **8rem**
  (~128px, = FormField card-select), medium **17.5rem** (~280px, = Grid
  `--grid-min`), large **25rem** (~400px, = RelatedGrid rich card). FormField
  already uses rem (8rem); Grid/RelatedGrid use px today — convert to rem in the
  build. (See §2.8 for why rem.)

**Min item widths are COMFORT TARGETS that drive the column count — NOT hard
pixel floors on atoms.** A hard `min-width` that overflows its cell is the
"10000px image" abuse §2.6 forbids. Items always fit their cell (§3); the table
only stops a row from packing in so many items that each drops below its comfort
target.

**Large-at-small clamp (render-time, not author-time):** container tier is
resolved at render time from the cascade (viewport → page-row → section-row →
card), so a `large`-weight item can land in a small-resolved container (e.g. a
card squeezed small on mobile). There is no author-time "disallow" — nothing to
block up front. The engine CLAMPS: the item lands at 1 column and fills the cell;
§3's hard boundary guarantees it fits (rendering at the cell width, a touch under
its comfort ideal in the rare squeezed case). That is the cascade constraining
contents exactly as intended.

Conservative table (one fewer column, roomier) is the fallback for image-heavy
content. The "dense" candidate was NOT adversarially verified (it had an
impossible cell) and is not carried forward.

Reading: a row of `large` items in a `small` container gets 1 column (the item
fills the width); the same row in an `xl` container gets up to 3 columns.

### 2.5 Responsive reflow (free)
Because weight and columns are relative to container size, shrinking the
container (e.g. xl → small on a narrow viewport via container queries)
recomputes columns automatically. A 3-column row of large items collapses to
1 column with no per-breakpoint rules. Reflow falls out of the model.

### 2.6 What the engine guarantees — the honest boundary (item 9, 2026-06-07)
State this plainly; overclaiming is itself drift.

**Hard guarantees (structural — impossible to violate):**
- **No overflow.** No absolute sizes exist; every item is cell-bounded (§3). A
  "10000px image" is inexpressible.
- **No invalid composition.** Cell-content enums per level (§4) reject any atom
  not allowed there.
- **No sub-floor accessibility.** Rem floors, 44px-equivalent targets, prose
  line-length (§2.8) — readable/tappable minimums can't be dropped below.
- **Coherence of size.** Everything in a container is on one relative scale, so
  sizes relate by design rather than clashing absolutes.

**Soft (NOT guaranteed):**
- **Good taste / ideal composition.** Relative sizing eliminates SIZE-clash
  (proportional, one scale) but NOT content-driven imbalance — very short text
  under a tall image, ragged heights from uneven content. Presets + equal-height
  rows + content guidance handle the residual — **NOT the engine.** The engine
  guarantees *safe + proportional*, never *tasteful*.

### 2.7 One code path — the single-item row is the degenerate grid
The engine has exactly ONE column-computation path: `columns = lookup(container
size, weight)` (§2.4), applied to every row regardless of item count. A one-item
row is **not** a special case or a separate branch — it computes to one column
through the same lookup, and "flow" falls out of the grid logic for free.

**Do NOT implement `if (items.length === 1) { …flow… } else { …grid… }`.** Two
paths reintroduce the flow-vs-grid split this whole model exists to remove, and
they drift apart over time. There is one path; a single item is simply the
one-column grid. If the rebuild ever needs a single-item branch, the model has
been misunderstood.

### 2.8 Sizing model — relative share between a rem floor and a capped ceiling (E1 cont. / E3 resolved)
One line: **items are a relative share of their measured container, arranged by
`auto-fit` between a rem-based minimum floor (never below readable/tappable) and a
capacity-table ceiling — no fixed pixels, scales with container, screen, and user
font size.**

The pieces:
- **Relative share = weight.** An item's size is its weight (1/2/3) resolving
  against the measured container width (§2.1 / §2.3) — `%`/`fr` behaviour, not
  pixels. Same weight = same relative size in any container.
- **Floor = rem minimum.** An item never shrinks below its comfort minimum, and
  never below the accessibility floor (readable text, 44px-equivalent targets).
  Floors are in REM so they scale with the user's font/zoom — for an
  accessibility-first platform this is the point, not an option (§2.4 dials).
- **Ceiling = capacity table + container bound.** The table caps how many columns
  (items can't multiply absurdly); the container bounds the width (a single item
  can't run away) (§2.4).
- **`auto-fit` arranges between them.** The engine uses
  `repeat(auto-fit, minmax(min(100%, <rem floor>), 1fr))` — fit as many items as
  fit at their floor (up to the cap) and let them grow to fill. As the container
  shrinks, auto-fit drops columns when items hit their floor; as it grows they
  expand. Automatic AND responsive from one declaration.

Two build-critical notes (invisible until built wrong):
- **Floors in REM, never px.** px ignores the user's font-size; rem honours it.
- **`auto-fit`, NOT `auto-fill`.** They look identical but differ on a half-empty
  row: `auto-fit` collapses empty tracks so a lone item fills its share;
  `auto-fill` keeps phantom empty columns so a lone item stays small. The model
  wants items to fill their share → `auto-fit`. The existing organism Grid +
  FormField card-select already use the `auto-fit` idiom (grounding, §2.4) —
  match it, don't reach for `auto-fill` out of habit.

This settles **E3 (how columns are computed):** auto-fit with the capacity table
as the *cap* (not a hard fixed count) — matching the existing codebase idiom —
rather than the engine emitting an exact column count per cell.

**Two width-balance mechanisms (item 4, 2026-06-07).** A side-by-side row
balances widths WITHOUT measuring, in one of two ways:
- `grid` (default, weight-driven) — equal columns via the capacity table +
  auto-fit (above). Optional `weight` (§2.3) skews it to a deliberate unequal split.
- per-cell **`sizing`** — each cell is `content` (hug its content width, CSS
  `auto` — images, buttons) or `fill` (take the remaining space, CSS `1fr` — the
  flexible text/middle cell). A row like `image | middle | button` is
  `auto 1fr auto`: image + button hug, middle fills. This is the hug-vs-fill
  mechanism the `grid`/weight model alone can't express; it's an enum
  (`content | fill`), and the `fill` cell absorbs/yields space as the container
  changes — responsive for free.

**Balance is DECLARED, not computed (item 7, 2026-06-07).** The author/designer
never measures or computes balance. They declare BEHAVIOUR — content vs fill,
equal-height, vertical placement, optional weight — and the browser's grid does
the measuring continuously, at every screen size. The measuring happens in the
browser, automatically; never by hand, never in the JSON.

### 2.9 The size cascade — each cell becomes the child's measured container (E4 resolved)
The same operation runs at EVERY level: **measure my own width (E1), then divide
it among my rows via the capacity table (§2.4).** Nobody passes a size down as a
number. Walked down once, concretely:

- **Page** measures the viewport, divides it among its rows of Sections.
- **Section** is allocated a cell by the Page's row. It MEASURES that cell's width
  (it is never *told* its size — E1), then divides its measured width among its
  own rows of Cards/atoms.
- **Card** is allocated a cell by the Section's row. It MEASURES that cell, then
  divides among its rows of atoms.
- **Atom** fills the cell its Card's row gave it.

"Page sizes Sections" and "Card sizes atoms" are the IDENTICAL operation at
different scales — that is what makes this one engine, not three.

**Build-critical — two parts (this is why E4 is the keystone and why it's easy to
build wrong):**
1. **The allocated cell becomes the child's measured container.** The space a
   parent's row hands to a child is exactly what the child measures and resolves
   its own weights against — no number is passed down.
2. **Each cell establishes a FRESH containment context** (`container-type:
   inline-size` on the cell, per E1). The child must measure THAT cell, not some
   ancestor higher up. If a level forgets to open a fresh context, the child
   queries the wrong ancestor's width and "a card in a narrow column knows it's
   narrow" silently fails. Every level down = a new "room" the child measures
   itself against.

This is simply E1 applied recursively: one rule — measure, then divide via the
table — re-run at each smaller scale, with a fresh container-query context per
cell. That recursion IS the cascade.

---

## 3. Items size themselves within their cell

The engine gives an item a CELL (a bounded area). The item renders itself
INSIDE that cell using its own existing atom enums (Badge knows how to be a
badge, Image knows fill/contain, Button knows its variants). The container
never manages an atom's internal styling — it only provides the cell and the
computed weight context.

The cell is a hard boundary: even if an atom asks to be large, it fits within
the cell the engine gave it. Constraint is structural (the cell bounds it),
not a number anyone types.

The §2.4 min item widths are COMFORT TARGETS used to compute column counts —
NOT hard pixel floors on atoms. An item never overflows its cell; at worst it
renders at the cell width, a touch under its comfort ideal.

### 3.1 The overflow backstop — making the hard boundary literal (E5 resolved 2026-06-07)
§5 already established there is no bad *input* to catch (enums make an oversized
request inexpressible). E5 is the STRUCTURAL backstop that makes this section's
"hard boundary" literally true even for content that is intrinsically large (a
huge image, a long unbroken word). Layered, three lines plus the gotcha:

1. **The cell is a grid/flex track with a computed max** (its column width). The
   item lives inside that track.
2. **`min-width: 0` (and `min-height: 0`) on every grid/flex item — THE gotcha.**
   Grid/flex items default to `min-width: auto`, which lets their *content* force
   the track wider than computed; that single default is the one thing that
   silently breaks the guarantee. `min-width: 0` makes the item respect its track.
3. **Media fits its cell:** `max-width: 100%` + `object-fit` (cover/contain) so
   images/video scale *down* into the cell, never out of it.
4. **Final backstop: `overflow: clip` on the cell** — anything that somehow still
   exceeds is physically clipped, never spills.

Layered guarantee: enums mean no oversized request exists (first line, §5);
`min-width: 0` + `max-width: 100%` make content fit the track (structural);
`overflow: clip` is the hard backstop. "You can't put a giant image in a card" is
true *by construction* — E5's CSS is what makes it literal, not a runtime check.

---

## 4. Per-level configuration

The engine is shared. Each level configures it:

### 4.1 Page
- Rows: rows of sections — a row may hold one section or several side by side
  (the engine grids a multi-section row like any other).
- Container size: the viewport (absolute, top of the cascade).
- Cell-content enum (D2 resolved): `[Section]` only. Page-level chrome (nav,
  footer) is NOT Page content — it's constant-across-pages chrome living in
  `BaseLayout`, one level up. "Constant chrome, variable content": Page holds the
  bands that change page to page; if something sits at the top of a page it's a
  Section. Nav/footer stay in the layout.
- Media modes: none.
- Notes: Page currently is a generic `<main>` + `<slot/>` class-mapper
  (see investigation note). Retrofit onto the shared engine: rows of sections.

### 4.2 Section
- Rows: rows of one-or-many items — e.g. Row 1 a heading (one item), Row 2 intro
  text (one item), Row 3 a grid of three cards (several items, engine computes
  columns), Row 4 a closing paragraph (one item). The author doesn't choose a
  "grid section" vs a "flow section" — they add rows and put one or several
  items in each. The multi-item rows are the grids.
- Container size: inherited — whatever the page's row allocated to it.
- Width intent (D5 resolved): the author picks a SEMANTIC width, not a token.
  Four named options, each mapped to a real `--container-*` token by the engine:
  `prose` (reading width, ~800px / `--container-prose`), `standard` (default
  content width, `--container-default` = `--container-7xl` ~1280px), `wide`
  (`--container-full` ~1440px — galleries/feature content), `full`
  (edge-to-edge / full-bleed, no max-width — hero bands + full-bleed media). The
  name carries the meaning AND the a11y guarantee — `prose` is capped at a
  readable line length because that's what `prose` *means*, not because the
  author happened to pick a narrow token. The token follows the name.
- Cell-content enum (D2 resolved — see §7): `[Card, Heading, Text, Image, List,
  Badge, Button, Link, Icon, LottieIcon, Shape]` — cards + content atoms. **NO
  sub-sections** — Card is the grouping container, Page is the banding container;
  a section never nests another section.
- Media modes: none (sections aren't image-backed in the card sense; a section
  background is a zone/theme concern, not a media mode).
- Notes: Section currently a generic class-mapper with optional `container`
  width + a half-built `bg` enum (tint/light/solid declared, only bg-none has
  CSS). Retrofit onto the engine; finish or drop the bg enum.

### 4.3 Card
- Rows: rows of one-or-many atoms — a row may hold one image across the top, or
  a badge + icon split (several items gridded). Same row model as Section/Page,
  smallest scale.
- Container size: INHERITED (D1 resolved — see §7). A Card is an item in its
  Section's row, so **"card size" IS the Card's weight there**. The author still
  thinks "large card"; that resolves as `large` weight, not an absolute size.
  The cell that weight allocates BECOMES the Card's own container-size context,
  which its child atoms' weights resolve against. No second sizing path. (Weight
  tiers are `small | medium | large`; the old `xl` was a container tier, not an
  item weight — an xl-feel card is `large` weight in a large/xl section.)
- Cell-content enum: the atom set — `[Image, Heading, Text, Badge, Icon,
  Button, Link, List, Shape, LottieIcon]`. NO Card-in-Card, no Section, no Page.
- Media modes (D3 resolved): media items additionally take a MODE:
  `inline | fill | background | overlap-edge` (still also carry a relative
  weight). The `background` mode is NOT a new invention — it reuses the
  established background-media pattern already shared by Heading/List/Badge/
  Shape: the parent carries `mediaBg` (boolean) + `mediaBgSize`
  (`compact | normal | spacious`), and the engine auto-injects
  `semanticRole='background'` onto the media child (wallpaper is aria-hidden;
  the child atom owns meaning/label; `labelShape` forbidden). Same prop names,
  same injection, same behaviour — not a second pattern that merely looks alike.
  (A Shape-wallpaper child takes `semanticRole='background'`; a plain decorative
  Image background is `semanticRole='decorative'` — both aria-hidden, same intent.)
- Overlay position (item 3, 2026-06-07 — THE gap this session found): media modes
  say HOW an item layers (`background` / `fill` / `overlap-edge`) but nothing said
  WHERE a layered item sits on the thing behind it (e.g. a "New" badge on an
  image, top-left). Add **`overlayPosition`** for items in a layering mode — a
  nine-point grid enum: `top-left | top | top-right | left | center | right |
  bottom-left | bottom | bottom-right`. The author picks a named position, never
  pixel coordinates — validatable, unbreakable.
- Notes: this replaces the legacy `<slot/>` + dead `.card__*` CSS + in-component
  gate selectors. None of that exists in the new model.

---

## 5. The validation contract — every author-facing choice is a finite enum

**Principle:** every author-facing layout choice is a finite enum; the engine
computes everything else; nothing is free-form, so everything is validatable and
**no invalid value is expressible**. There is no number field, no free string, no
pixel value — nowhere to type `500000`, `cols: 47`, or an unknown component name.
The validator checks each value against its enum and rejects anything outside it,
exactly as it does for every other atom prop. **Build the engine's schema +
validator straight from this list.**

| Setting | Where | Enum (author-settable) |
|---|---|---|
| Container size — Page | Page | viewport — NOT authored |
| Section width | Section | `prose \| standard \| wide \| full` (D5; maps to real `--container-*` tokens; replaces the legacy 13-value `container` enum) |
| Card size | Card | none of its own — expressed as the Card's WEIGHT in its section row (uses the weight enum, no separate size enum) |
| Card type (preset) | Card | `cardType` — `horizontal \| product \| profile \| feature \| …` (item 8; the author's MAIN Card choice — picks a designed arrangement; see §11) |
| Item weight (OPTIONAL) | any item | `small \| medium \| large` — set only for a deliberate unequal split; omit for the default (item 6) |
| Row distribution (horizontal) | every row | `grid` (default) \| `start \| center \| end \| between` (E2) |
| Cell sizing | any cell | `content \| fill` — hug vs fill, `auto`/`1fr` (item 4) |
| Vertical placement | any cell in an equal-height row | `start \| center \| end` (item 5) |
| Equal-height row | any row | boolean (item 5) |
| Cell-content | per level | enum of allowed component NAMES — Page `[Section]`; Section `[Card, Heading, Text, Image, List, Badge, Button, Link, Icon, LottieIcon, Shape]`; Card `[Image, Heading, Text, Badge, Icon, Button, Link, List, Shape, LottieIcon]` |
| Gap | row / container | `none \| xs \| sm \| md \| lg \| xl \| 2xl \| 3xl` (matches existing Section `gap`) |
| Media mode | Card media items | `inline \| fill \| background \| overlap-edge` |
| Overlay position | a layered media item | `top-left \| top \| top-right \| left \| center \| right \| bottom-left \| bottom \| bottom-right` (item 3) |
| Media bg size | Card media (bg) | `compact \| normal \| spacious` (D3 pattern) |
| Section colour | Section | `primary \| secondary \| neutral \| red \| orange \| yellow \| teal \| blue \| purple \| pink` (existing `color`) |
| Section bg | Section | `none \| tint \| light \| solid` (existing) |
| Section separator | Section | boolean + `separatorWeight` `thin \| medium \| thick` (existing) |
| Computed columns | — | NOT authored — derived by the engine from the §2.4 capacity table; nothing to validate |

**Consequence for E5 (overflow):** because there is no author-set size — only
weights and enums — overflow-prevention is NOT about *catching bad input*. There
is no bad input to catch: the author had no way to ask for a size that overflows.
The enum is the first line of defence; the cell boundary (E5 — exact mechanism
pending next session) is the structural backstop. Together they make "you can't
put a giant image in a card" true *by construction*, not by runtime checking.

---

## 6. Render rules

R1. Item rendered size = container size × item weight, resolved RELATIVE TO THE
    CONTAINER (not the row, not the cell).
R2. Row columns = lookup(container size, weight of row items) in the capacity
    table; overflow wraps; reflows automatically as container size changes.
    Applied IDENTICALLY to every row — a one-item row computes to one column
    through the same path. No single-item branch (see §2.7).
R3. An item self-renders within its cell using its own atom enums; the cell is
    a hard boundary.
R4. Cell-content is constrained per level by that level's enum; an atom not in
    the enum cannot be placed (schema rejects; renderer renders nothing).

---

## 7. Decisions — ALL RESOLVED 2026-06-02

(Kept as a resolved-log, not an open-items list. Nothing here is outstanding;
each entry records the call and the reasoning so the decision can't silently
drift back open.)

D1. **Card size — absolute or inherited?** RESOLVED 2026-06-02: **inherited.**
    A Card is an item in its Section row; "card size" IS the Card's weight there
    (`small | medium | large`), and the allocated cell becomes the Card's own
    container-size context. Author-picked S/M/L/XL was rejected — it adds a
    second sizing path outside the weight system (the core anti-abuse rule,
    §2.1 / §2.3) and creates a two-sources-of-truth collision (a `large`-weight
    card also set size `small`). The gallery case that motivated it is already
    covered by weight (same weight → identical cards, reflowing freely). The
    friendly vocabulary survives: "large card" = `large` weight, resolved
    through the one system rather than as an absolute.

D2. **Does Section hold sub-sections? / Does Page hold non-Sections?**
    Section part RESOLVED 2026-06-02: **no sub-sections** — Card is the grouping
    container, Page the banding container; a 4th nesting would overlap them (the
    D1 discipline — don't build the overlapping primitive pre-need). A nested
    full-width band = a sibling Section on the Page; a bounded group = a Card.
    Page part RESOLVED 2026-06-02: Page holds `[Section]` only — nav/footer are
    constant chrome in `BaseLayout`, not Page content ("constant chrome, variable
    content"). D2 fully resolved.

D3. **Background media — item mode or container property?** RESOLVED 2026-06-02:
    reuse the established pattern (Heading/List/Badge/Shape) — parent `mediaBg`
    (boolean) + `mediaBgSize`, engine injects `semanticRole='background'` on the
    media child. Same prop names + injection as the existing atoms, not a
    look-alike second pattern (see §4.3).

D4. **Capacity table numbers** — RESOLVED 2026-06-02: **"balanced"** table
    locked in §2.4, grounded in real `--container-*` widths + repo min-widths and
    adversarially verified (reflow monotonic; large-at-small handled by a
    render-time clamp + §3 cell boundary, with min widths treated as comfort
    targets, not hard floors). Dials (tier widths, comfort mins) recorded in §2.4
    for future tuning. "Dense" candidate rejected (unverified, impossible cell).

D5. **Section width intent** — RESOLVED 2026-06-02: author picks a SEMANTIC
    width — `prose | standard | wide | full` — each mapped to a real
    `--container-*` token by the engine (see §4.2). Semantic names carry meaning
    + the a11y guarantee (prose = readable line length); not raw token picks.

---

## 8. Build order

> Reframed 2026-06-07 (§11): this is NOT a separate "engine" project — it's the
> **Card atom, built like Button** (`cardType` variants), whose CSS uses the
> engine internally. Build the machinery, then the first real preset.

1. Build the SHARED ENGINE machinery — size context (container queries), rows +
   cells, content/fill, capacity table + auto-fit, vertical distribution,
   overlay, optional weight, responsive reflow. Level-agnostic; it's the CSS the
   presets are made of.
2. Build CARD as an atom (the Button pattern): `cardType` variant enum, each
   type's layout in `Card.css` keyed by its class, content slots as props (§11).
   Ship ONE preset first — **`card-horizontal`** — as the first variant; it
   replaces the legacy `<slot/>` + dead CSS. (incl. media modes + `mediaBg`, D3;
   inherited size = weight, D1.)
3. Retrofit SECTION onto the engine — rows of cards/atoms, with the semantic
   width options (`prose | standard | wide | full`, D5).
4. Retrofit PAGE onto the engine — rows of sections.

One engine, three consumers. The whole platform gets a single coherent layout
model from page down to atom.

---

## 9. What this resolves

- Card's legacy slot (Rule 39 violation) — gone; replaced by enum-composed rows.
- Card's dead `.card__header/body/footer` CSS — gone; not part of the model.
- Card's in-component gate selectors — gone; gates live in gate files.
- The "500000px image" abuse — inexpressible (weight × container, cell-bounded).
- The "15 XXXXXL buttons in a row" abuse — inexpressible (capacity table caps
  columns; no XXXXXL weight exists).
- The "do we need a Layout atom?" question — there's a Layout ENGINE (shared),
  not a Layout atom. Card/Section/Page consume it.
- Section/Page feeling unfinished — they're slotted; the engine makes them
  row-based like Card.
- The "is a section a grid or a flow?" question — dissolved for ordinary content:
  the default (`grid`) distribution makes every container rows, a grid just a
  multi-item row, a single-item row the one-column degenerate case. A row can
  still opt into a content-sized `distribution` (`start|center|end|between`) for
  control bars/footers — a deliberate per-row choice (E2 / §2.2), not a
  flow-vs-grid mode the author reasons about for normal content.
- The hug-vs-fill gap (`image | middle | button` = `auto 1fr auto`) — closed by
  per-cell `content | fill` sizing (item 4 / §2.8); the weight/grid model alone
  couldn't express it.
- The "where does a layered badge sit?" gap — closed by the `overlayPosition`
  nine-point enum (item 3 / §4.3).
- "Is this a big layout-engine *project* to build?" — no. It's the Card atom
  built like Button (`cardType` variants), the pattern proven 11 times (item 8 /
  §11). The engine is just how the preset CSS works internally.
- AI-authoring safety — an AI fills a preset's content slots only, makes no
  layout choices, so it cannot produce a broken design; worst case is awkward
  text (item 8 / §11).

---

## 10. Engine mechanics decisions (E-series) — status

The five build-time mechanics decisions (distinct from the D-series vocabulary
decisions in §7). Resolved ones are written into §2 / §5; the last two are next.

- **E1 — How a box knows its size:** RESOLVED — measures its own rendered width
  (container queries, `container-type: inline-size`), §2.1.
- **E2 — Row data shape:** RESOLVED — weight on the item; row is an extensible
  object with a `distribution` enum (`grid` default | `start|center|end|between`
  content-sized), §2.2.
- **E3 — How columns are computed:** RESOLVED — auto-fit with the capacity table
  as the cap (not an exact emitted count), §2.8.
- **E4 — How size cascades down the levels** (viewport → page-row → section-row →
  card → atoms): RESOLVED — each allocated cell becomes the child's measured
  container, with a FRESH containment context per cell, and the same engine
  re-runs at each scale (E1 applied recursively), §2.9.
- **E5 — The overflow-stopping mechanism:** RESOLVED 2026-06-07 — `min-width: 0`
  on grid/flex items (the gotcha), `max-width: 100%` + `object-fit` on media,
  `overflow: clip` cell backstop (§3.1). Layered with the §5 enum guarantee.

The validation contract (§5) is captured: every author-facing setting is a named
enum; the schema + validator build straight from that list.

**2026-06-07 additions** (items 1–9, integrated into §1–§6 + §11): two spatial
relationships (§1), cell nesting (§2.2), `overlayPosition` (§4.3), `content/fill`
cell sizing (§2.8), vertical distribution (§2.2), weight DEMOTED to optional
(§2.3), balance-declared-not-computed (§2.8), the engine↔preset split + "Card is
an atom" (§11), the honest guarantee boundary (§2.6).

**Item 10 (default unspecified-weight rule) — RESOLVED 2026-06-07** by locking the
first preset (§12): the default is behaviour-driven (content/fill, or equal
`grid`), never a fixed `medium`. Weight is consulted only for an explicit unequal
grid split.

**E5 (overflow backstop) — RESOLVED 2026-06-07** (§3.1).

**The engine spec is now complete and build-ready** — D1–D5, E1–E5, items 1–10,
and the first preset all resolved. **Next is the build, not more spec:** build the
Card atom (§11) starting with the `card-horizontal` variant (§12), the Button
pattern. A fresh-session task — the architecture is done.

---

## 11. Engine vs presets — the two-layer model (item 8, 2026-06-07) — THE BIG ONE

The session's key realisation. There are TWO layers, and earlier sections were
mixing them:

- **The ENGINE (general machinery):** rows, cells, content/fill, overlay +
  position, vertical distribution, optional weight, the capacity table. Lots of
  capability. Used by the **designer**. Everything in §1–§6 *is* this layer — it
  is how the layout works *internally*.
- **PRESETS / designed cards (specific):** "horizontal card", "product card",
  "profile card", "feature card" — each a FIXED arrangement (which cells,
  hug/fill, vertical placement, nested rows, overlay) defined ONCE on the engine
  by the designer. This is the chrome-vs-designed-card distinction from the start
  of the Card work.
- **The AUTHOR / AI:** picks a preset and fills content slots. ~2 choices —
  card type + content. No sizing, no placement, no weight: the preset already
  decided all of it.

### Card is an atom, built like Button.
This is the reframe that makes the rebuild familiar, not intimidating:
- `cardType` is the variant enum (`horizontal | product | profile | feature | …`)
  — exactly as Button has `variant` (`fill | glass | glow | …`).
- Each `cardType`'s layout lives in `Card.css` keyed by its class
  (`.card--horizontal`), same as `.btn--fill` vs `.btn--glass`.
- Content slots are props (`image`, `meta`, `body`, `button`), schema-validated
  like `contentButton`.
- **Same files, same enum pattern, same validation, same author experience** as
  every other audited atom. There is no mysterious new "layout engine project" to
  build — there is an **atom to build, using the pattern proven 11 times.** The
  "engine" reasoning (§1–§6) is HOW the preset CSS works (rows + cells +
  container queries); `cardType` is WHAT the author sees.

### Consequence for AI generation (the safety win)
An AI filling a preset's content slots CANNOT make a bad layout — it makes no
layout choices, only content choices. Worst case is awkward *text*, never broken
*design*. That is the strongest safety position the platform can hold.

### Suggested next step (don't add more engine surface)
Define the FIRST PRESET — `card-horizontal` — for real: which cells, hug/fill per
cell, vertical placement, nested middle rows (meta over body), accepted atom per
slot — then the author's tiny input against it. That makes "specific rows" and
"not a lot of choice" concrete, and it's the bridge from engine-spec to a
buildable Card atom. Worked sketch: image left (`content`), meta-over-body middle
(`fill`, nested rows), button right (`content`, `vertical: center`), equal-height
row. See `horizontal-card-preset.jsonc`.

---

## 12. First preset — `card-horizontal` (LOCKED 2026-06-07)

The bridge from engine-spec to a buildable Card atom — the first `cardType`
variant. Defined once (Layer 1), filled with content by the author (Layer 2).
Building this IS the start of the Card atom (§11).

**Layer 1 — the preset (designer defines once, frozen).** One **equal-height**
row, three cells, left → right; widths are `auto 1fr auto` via per-cell `sizing`
(§2.8), NO weight:

| Cell | `sizing` | `vertical` | accepts | notes |
|------|----------|-----------|---------|-------|
| image | `content` (hug) | — | `Image` | left; hugs its own width |
| middle | `fill` (1fr) | `start` (top) | sub-container of rows | two stacked rows: **meta** (Text, small-muted) over **body** (Text) |
| button | `content` (hug) | `center` | `Button` | right; centred against the tall image |

`equalHeight: true` → all cells match the tallest (the image). Each slot is
guarded by its `accepts` (Layer-1's per-slot atom enum) — the preset layer's
equivalent of the cell-content enum.

> **Build-time decision — DUE at the media/image cell, do not skip.** Card's
> `media.semanticRole` is `required: false` (matched from FormField), but the
> child `Image`/`Icon` schemas declare `semanticRole` `required: true`. Under the
> (B) Move 2 lock (`_lockProps`), the CHILD's requirement is authoritative — so an
> Image media node WITHOUT `semanticRole` errors on the child's required check the
> moment a card has an image. Resolve when wiring the media cell, not as a
> surprise: **(a)** align Card's `media.semanticRole` to `required: true` (matches
> `Heading.media`) so the author always declares intent — recommended, it's the
> honest WCAG signal; or **(b)** have `Card.astro` inject the default
> (`decorative`) into the media node before validation. Pick one HERE. See
> BUILD-STATUS §2 (Card) + VALIDATOR-NESTED-SLOTS-SPEC.md.

**Layer 2 — what the author / AI writes (every time).** Canonical form matches
§11 ("Card is an atom; `cardType` is the variant enum; slots are props"):

```json
{ "component": "Card",
  "cardType": "horizontal",
  "image":  { "src": "…", "altWord": "Stoneware mug" },
  "meta":   "In stock",
  "body":   "Hand-thrown stoneware mug, glazed slate blue.",
  "button": { "contentButton": "Add to cart", "href": "/cart/add/mug" } }
```

~Two choices: `cardType` + content. No sizing, no placement, no weight — Layer 1
decided all of it. (Worked `.jsonc`: `horizontal-card-preset.jsonc` — note it
uses `card: "card-horizontal"`; the canonical form is `component: Card` +
`cardType: "horizontal"` per §5/§11. Real Image slot uses `altWord`/
`altDescriptive`, not bare `alt`.)

### Item 10 resolved — as the spec predicted
Defining this preset answers the open default-weight sub-decision. `card-horizontal`
uses per-cell `content`/`fill` and **no weight** — confirming the default for an
unspecified weight in a side-by-side row is **behaviour-driven** (content/fill, or
equal `grid` where cells declare no `sizing`), **never a fixed `medium`**. Weight
is consulted ONLY when an author explicitly sets it for a deliberate unequal
*grid* split. The "fixed middle = medium" alternative is rejected — it would
re-introduce a sizing default the content/fill model already handles more
honestly. **D-series + E-series + item 10 all resolved: the spec is build-ready.**
