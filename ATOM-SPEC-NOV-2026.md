# Atom Spec — Nov 2026

**The one current spec.** Built atom by atom from the running code plus Natasha's rulings. Each section is only written after that atom has been tested on the site. If a section and the code disagree, the code was changed after the check, so re-check it before trusting either.

Older documents (atom-spec v1.0, BUILD-STATUS, COMPLIANCE-INVENTORY, LAYOUT-ENGINE-SPEC, audit checklists) live in `_reference/` and are history, not truth.

## How this file is kept

- One section per atom, added after its audit: what it does, its options, what was tested and how, and known issues.
- Every ruling is written with its date, e.g. `Ruling 2026-10-12: …`.
- Every check says how it was done: **Tested** (seen working in a browser), **Read** (file read in full), or **Measured** (script over the code).
- Nothing is marked done unless it was tested.

---

## Platform rules (to confirm)

These come from `.claude/CLAUDE.md` and from what the code does. Each one becomes **Confirmed** only once Natasha says so.

| Rule | Status |
|---|---|
| Colour comes only from the global `.color--{name}` mixin (`src/styles/global/colour.css`); themes set colour tokens only | To confirm |
| Theme colour scheme is the tier scheme: `-tint`, `-mid`, `-base`, `-emphasis`, `-contrast`; rainbow is `rainbow-1` … `rainbow-7` | Confirmed 2026-10-12 |
| The numbered colour scale (`-100` … `-950`) and its four themes (default-protan, default-tritan, default-dark-protan, default-dark-tritan) are retired | Confirmed 2026-10-12 |
| Colour names (red, orange …) are retired because colour-blind palettes recolour the rainbow, so names become false | Confirmed 2026-10-12 |
| Free text only in `content*`, `label*` and alt props; everything else is an option list or a validated string | Confirmed 2026-10-12 |
| One master option list: `src/lib/shared-enums.ts`. `shared-enums.json` is an out-of-date copy | To confirm (fix list decision 4) |
| Three render modes only: full, reduced, textonly. Easy Click is a CSS gate, not a render | To confirm |
| Atoms are imported through their barrel (`index.ts`) so their CSS loads with them | To confirm |
| Component CSS uses design tokens only; no hard-coded values, no `!important`, no render/motion/theme selectors | To confirm |

---

## FigCaption

**Status:** In progress. Last checked 2026-10-12.

**What it is:** the caption that shows an image's alt text to sighted readers. It's a script plus a style file, not a schema atom. It has no `.astro` file and no schema.

**Files:**
- `src/components/atoms/FigCaption/index.ts` — barrel; loads the styles and the script
- `src/components/atoms/FigCaption/FigCaption.css` — caption and `?` badge styles
- `src/components/atoms/FigCaption/figcaption.ts` — creates the caption and handles hover, focus and click (Read in full 2026-10-12)
- Loaded once for every page from `src/layouts/BaseLayout.astro`, through the barrel

**What it reads** (both set on `<html>` by the Your View panel):

| Setting | Values |
|---|---|
| What to show (`data-alt-text-mode`) | none, word, descriptive, aac |
| How to show it (`data-alt-display-mode`) | hidden, subtitle, tooltip, inline, enlarge |

`Ruling 2026-10-12:` the display modes are these five. The source of truth is `src/styles/gates/alt-text-gate.css` and the Your View panel.

**Tested 2026-10-12** (test page `/test/figcaption-test`, descriptive alt text, desktop 1280px, BrandDefault theme):

| Mode | Result |
|---|---|
| tooltip | Pass — hidden at rest with a `?` badge; styled pop-up on hover and focus |
| subtitle | Pass — solid full-width bar along the bottom of the screen (shared bar); Natasha confirmed it looks right |
| hidden | Pass — no captions |

**Not yet tested:** the `?` badge changing colour once read; inline; enlarge; word and AAC text modes; mobile (bar mode under 640px); hover switched off; dark, calm and high-contrast themes.

**Fixed:**
- 2026-10-12 — the caption styles never loaded, so captions showed as plain text all the time. Fix: the barrel now loads both the styles and the script, and BaseLayout imports the barrel. Commit `0714c36`.

**Known issues:**
- The test page sets tooltip mode itself, but Your View immediately sets it back to its saved value. The page shows nothing unless Your View is set to tooltip or subtitle.
- FigCaption's display code largely duplicates the animation explainer's. See fix list decision 7, which is to extend the animation explainer with slots after launch.
