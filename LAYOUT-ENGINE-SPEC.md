# LAYOUT-ENGINE-SPEC

Status: DRAFT for rebuild — reasoned through 2026-06-02, not yet implemented.
Scope: One shared layout engine used at three levels — Page, Section, Card.
Companion to BUILD-STATUS.md (status) and COMPLIANCE-INVENTORY.md (axes).

> Purpose: replace Card's legacy slot-based markup (and Section/Page's generic
> `<slot/>` class-mappers) with ONE constrained, composable layout engine.
> The author expresses intent (container size, rows, weighted items); the
> renderer computes columns, sizes, wrapping and reflow. Abuse is structurally
> impossible because every choice is from a constrained set and nothing is
> freeform-placed or freeform-sized.

---

## 1. The core principle

A container holds an ordered list of ROWS. Each row holds ONE OR MANY
WEIGHTED ITEMS. The author NEVER picks columns. The renderer computes columns
from (container size × item weight), wraps and reflows responsively, and caps
capacity so a row can never overcrowd.

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
3. Put one or many weighted items in each row.

Everything else — columns, actual pixel sizes, wrapping, responsive reflow —
is derived by the renderer. The complexity lives in the engine, not the author's hands.

This is the JSON-as-page philosophy applied to layout: freedom to choose,
no freedom to break.

---

## 2. The shared engine (level-agnostic)

The same engine runs at every level. Only its CONFIGURATION differs per level
(see §4). The engine itself is:

### 2.1 Container size context
The container establishes an absolute size context (a `--container-scale` custom
property or a container-query context). Every item weight inside resolves
RELATIVE TO THIS CONTAINER — never relative to the row or cell. One scale per
container; a weight of 3 means the same thing anywhere inside that container.

### 2.2 Rows
An ordered array. Rows render top to bottom in array order. Each row holds ONE
OR MANY weighted items; the author does not specify columns on a row. A
one-item row renders full-width (one column); a multi-item row is gridded by
the capacity table (§2.4). There is no "flow row" vs "grid row" distinction in
the model or in the author's head — a grid is just a row with more than one
item, and the engine treats the single-item row as the one-column degenerate
case of the same logic. Per row, the author decides one thing or several.

### 2.3 Item weight
Every item carries a relative weight: `small | medium | large` (1 / 2 / 3).
Rendered size = container size × item weight, resolved at render time.
A `large` item in a `small` container is smaller in absolute terms than a
`large` item in an `xl` container — because weight is relative to container.

### 2.4 Computed columns (the capacity table)
The renderer computes how many columns a row gets from
(container size × the weight of items in that row), capped by a capacity table
so nothing overcrowds. The author never sees or sets this.

Capacity table (STARTER VALUES — tune during build):

| Container size | large items | medium items | small items |
|----------------|-------------|--------------|-------------|
| small          | 1 col       | 1 col        | 2 cols      |
| medium         | 1 col       | 2 cols       | 3 cols      |
| large          | 2 cols      | 3 cols       | 3–4 cols    |
| xl             | 3 cols      | 3–4 cols     | 4 cols      |

Reading: a row of `large` items in a `small` container gets 1 column (each large
item takes the full width). The same row in an `xl` container gets up to 3 columns.

### 2.5 Responsive reflow (free)
Because weight and columns are relative to container size, shrinking the
container (e.g. xl → small on a narrow viewport via container queries)
recomputes columns automatically. A 3-column row of large items collapses to
1 column with no per-breakpoint rules. Reflow falls out of the model.

### 2.6 What the engine guarantees
- Count: a row holds exactly as many items as its computed columns allow;
  overflow wraps to a new line, never overcrowds.
- Size: there is no absolute pixel size for items — only weight × container.
  A "10000px image" is inexpressible.
- Coherence: everything in a container is on one relative scale, so sizes
  relate by design rather than clashing absolutes.

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

---

## 4. Per-level configuration

The engine is shared. Each level configures it:

### 4.1 Page
- Rows: rows of sections — a row may hold one section or several side by side
  (the engine grids a multi-section row like any other).
- Container size: the viewport (absolute, top of the cascade).
- Cell-content enum: `[Section]` (a page holds sections; optionally a small
  set of page-level chrome atoms — decide at build).
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
  (Section may also expose an author width intent, e.g. via the existing
  `container` prop + `--container-*` tokens — reconcile during build.)
- Cell-content enum: `[Card, Heading, Text, Image, List, Badge, Button, ...]`
  (a section holds cards and content atoms; possibly sub-sections — decide).
- Media modes: none (sections aren't image-backed in the card sense; a section
  background is a zone/theme concern, not a media mode).
- Notes: Section currently a generic class-mapper with optional `container`
  width + a half-built `bg` enum (tint/light/solid declared, only bg-none has
  CSS). Retrofit onto the engine; finish or drop the bg enum.

### 4.3 Card
- Rows: rows of one-or-many atoms — a row may hold one image across the top, or
  a badge + icon split (several items gridded). Same row model as Section/Page,
  smallest scale.
- Container size: AUTHOR-PICKED — `small | medium | large | xl` — OR inherited
  from the section's allocation. DECISION NEEDED (see §6).
- Cell-content enum: the atom set — `[Image, Heading, Text, Badge, Icon,
  Button, Link, List, Shape, LottieIcon]`. NO Card-in-Card, no Section, no Page.
- Media modes: media items additionally take a MODE:
  `inline | fill | background | overlap-edge`
  (still also take a relative weight). Match the existing Shape `mediaBg`
  pattern for the background mode so the two are consistent.
- Notes: this replaces the legacy `<slot/>` + dead `.card__*` CSS + in-component
  gate selectors. None of that exists in the new model.

---

## 5. The complete vocabulary (all enums)

1. **Container size**
   - Page: viewport (not an enum)
   - Section: inherited (+ optional `container` width tokens)
   - Card: `small | medium | large | xl`
2. **Item weight** (every item, every level): `small | medium | large` (1/2/3)
3. **Cell-content enum** (per level — see §4): which atoms may sit in a cell
4. **Media mode** (Card media items only): `inline | fill | background | overlap-edge`
5. **Computed columns**: NOT an author enum — derived by the renderer from the
   §2.4 capacity table.

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

## 7. Decisions still open (resolve at build)

D1. **Card size — absolute or inherited?** Does the author pick S/M/L/XL
    (absolute), or does a card take "how much of my section's allocation do I
    want" (inherited, like Section does from Page)? Leaning: author-picked
    S/M/L/XL as a *max* that shrinks responsively, since cards are often placed
    in galleries where the author wants a consistent card size.

D2. **Does Section hold sub-sections?** And does Page hold anything besides
    Sections? Defines the cell-content enums precisely.

D3. **Background media — item mode or container property?** Is `background` a
    mode of a media item, or a property of the Card (card-has-a-background-media)?
    Match whatever the Shape atom already does with `mediaBg` for consistency.

D4. **Capacity table numbers** — §2.4 values are starters; tune against real
    layouts during build.

D5. **Section width intent** — reconcile the existing `container` prop +
    `--container-*` tokens with the new "inherited container size" model. One
    source of truth for how wide a section is.

---

## 8. Build order

1. Build the SHARED ENGINE first — size context, rows, weight resolution (R1),
   column computation + capacity table (R2), responsive reflow. Level-agnostic.
2. Configure CARD on the engine — cell-content atom enum, media modes, S/M/L/XL
   size. This is the legacy-slot rebuild; replaces `<slot/>` and dead CSS.
3. Retrofit SECTION onto the engine — rows of cards/atoms, reconcile width.
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
- The "is a section a grid or a flow?" question — dissolved. Every container is
  rows; a grid is simply a row with more than one item; a single-item row is the
  one-column degenerate case. There is no mode to choose at any level.
