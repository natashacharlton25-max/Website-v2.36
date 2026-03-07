# End-of-Day Document Fixes — 4 March 2026

Fix all MISSING and INCORRECT items identified in the verification audit. Do NOT change anything that is already PRESENT and CORRECT.

---

## CLAUDE.md — 3 fixes

### Fix 1: Add em-based values to hardcoded exceptions

In the "No hardcoded values in component CSS" section under Render Architecture Contract, the exceptions line currently reads:

> The only exceptions are `0`, `none`, `100%`, `auto`, `1px` for borders, and unitless values like `flex: 1`.

Change to:

> The only exceptions are `0`, `none`, `100%`, `auto`, `1px` for borders, unitless values like `flex: 1`, and `em`-based relative values (e.g. `0.15em` for divider thickness, `0.25em` for dash rhythm) where the value intentionally scales with the parent's font size.

### Fix 2: Complete pipeline routing example

In the "Pipeline Routing" section, the LottieIcon example currently mentions reduced → Icon with fallbackIcon but does NOT mention textonly → Text with label. Add the complete routing:

After the existing text about fallbackIcon, ensure all three routing targets are listed:
- `full` → LottieIcon.astro receives slug, src, label, visual/animation props
- `reduced/assistive` → pipeline passes `fallbackIcon` to Icon atom
- `textonly` → pipeline passes `label` to Text atom

### Fix 3: Add category value rule

In the "Schema Structure" section, add after the line about three prop groups:

> The `"category"` field must be `"atom"` for all atoms — not subcategory paths like `"atoms/ui"` or `"atoms/icons"`.

---

## architecture-decisions.md — 8 fixes

### Fix 1: Correct Section 2 — atoms DO have responsive CSS

Section 2 currently says: "Only container atoms (Card, Grid, List, Form) have responsive CSS. Fixed atoms never have media queries."

This is now wrong. Image, Text, Heading, Icon, and LottieIcon all have `.responsive.css` files with media queries for scaling their own visual properties (font sizes step down at breakpoints, decorative properties scale, word-break rules for small screens).

Rewrite Section 2 to say:

**Decision: Layout responsiveness lives on containers. Atoms own their own visual scaling.**

Containers (Card, Grid, List) control column counts, stacking, and spatial layout via media queries. Atoms have `Component.responsive.css` for scaling their own visual properties — heading font sizes step down at tablet/mobile, text gets word-break rules on small screens, image decorative properties shrink. But atoms never change layout — they never switch from row to column, never control grid columns. They scale themselves; containers position them.

### Fix 2: Add decision — Relative sizing for decorative elements

Add as a new decision (number it appropriately, after the existing decision log entries):

**Decision: Decorative line elements use relative units, not hardcoded pixel scales.**

Dividers, underlines, and decorative borders use:
- `em` for thickness and dash/dot rhythm — scales with the parent's font size automatically (e.g. a divider next to an h1 is thicker than next to an h6)
- Percentage for width — `90%` for "shorter than text", `100%` for "match text width"
- `align-self: stretch` for height — matches the parent's line box

No hardcoded pixel size scales. The Heading atom's divider and underline are the reference implementation. This pattern applies to all future decorative line elements.

### Fix 3: Add decision — Context overrides don't belong on atoms

Add to the decision log table:

| 4 Mar 2026 | Context overrides don't belong on atoms | Atoms should not adjust themselves based on parent context (e.g. `.card .text { font-size: ... }`). Consumers pass the correct props via JSON instead. Context override rules deleted from Text.css and flagged for deletion from Heading.css during consumer audits. |

### Fix 4: Add decision — Atoms can compose other atoms

Add to the decision log table:

| 4 Mar 2026 | Atoms can compose other atoms | Heading imports Icon, LottieIcon, and Text. This is correct atom-to-atom composition. Text sub-elements inside atoms render through the Text atom, not raw HTML (e.g. Heading subtitle uses `<Text as="p">` not `<p>`). |

### Fix 5: Add decision — Subtitle pattern

This is covered by Fix 4 above — the second sentence about Text sub-elements. No separate entry needed unless you want to split it out. The principle is: if an atom has a text sub-element, render it through the Text atom.

### Fix 6: Add decision — SectionTitle deprecated

Add to the decision log table:

| 4 Mar 2026 | SectionTitle.astro deprecated — use Heading | SectionTitle duplicates Heading's decorated mode (same divider, variant, media slot systems). SectionTitle has banned patterns (scoped `<style>`, `!important`, `var(--token, fallback)`, hardcoded `letter-spacing`). Consumers migrate to `<Heading>` with decoration props, then SectionTitle is deleted. |

### Fix 7: Add decision — Heading media slot priority

Add to the decision log table:

| 4 Mar 2026 | Heading media slot priority: image → lottieIcon → icon | Media slot renders first match in priority order. `lottieIcon` is in the animation group — stripped in reduced/assistive/textonly. Static `icon` in content group auto-becomes the fallback. No separate fallbackIcon prop needed on Heading. |

### Fix 8: Add decision — Token coverage grep

Add to the decision log table:

| 4 Mar 2026 | Post-audit token coverage grep required | After all atom audits complete, grep every `var(--token-name)` in component CSS and verify each resolves to a definition in `src/styles/`. Automate as build-time check. First cases caught: `--font-body-alt` and `--font-handwriting` missing (now fixed), `--color-surface-inverse` and `--radius-md` had hex fallbacks masking whether tokens exist (fallbacks stripped). |

---

## component-audit-checklist-v2.md — 4 fixes

### Fix 1: Add hardcoded value check to Section 2

Add after item 2.16:

```
| 2.17 | Hardcoded colour values | `#[0-9a-fA-F]` in component CSS (not in comments) |
| 2.18 | Hardcoded px spacing (non-exempt) | Check for px values that should be tokens. EXEMPT: `0`, `1px` borders, em-based values. Flag anything else. |
| 2.19 | Any var(--token, fallback) pattern | `var(--[^)]+,` — no fallback values on any design token, not just brand tokens |
```

Note: 2.19 replaces the scope of 2.16 (which only checked brand tokens). Keep 2.16 for backwards reference but add 2.19 as the comprehensive check. Add a note to 2.16:

> (Subset of 2.19 — kept for reference. 2.19 is the comprehensive check.)

### Fix 2: Add em-based exception note

After the Section 2 table, add a note:

**Acceptable values (not flagged by these checks):**
- `0`, `none`, `100%`, `auto` — universal CSS values
- `1px` — hairline borders
- Unitless values — `flex: 1`, `opacity: 0.3` (when tokenized), `z-index`
- `em`-based values — intentionally scale with parent font size (e.g. `0.15em` divider width, `0.25em` dash rhythm)
- Percentages — relative to parent (e.g. `90%` underline width, `35%` highlight height)

### Fix 3: Specify valid category values in Section 3

Change Section 3.2 from:

```
| 3.2 | Has `"category"` field | | Missing |
```

To:

```
| 3.2 | Has `"category": "atom"` for atoms | | Missing or wrong value (e.g. "atoms/ui", "atoms/icons") |
```

### Fix 4: Update Section 9.2, 9.3, 9.4

These were flagged as stale in the CLAUDE.md known corrections but the checklist text was never actually updated.

Change 9.2 from:
```
| 9.2 | Accepts `altAacPhrase` prop | | Missing |
```
To:
```
| 9.2 | `alt_aac_phrase` resolved at build time by aacResolver (NOT a component prop) | | Component accepts this directly instead of `altAacHtml` |
```

Change 9.3 from:
```
| 9.3 | Accepts `altSymbolId` prop | | Missing |
```
To:
```
| 9.3 | `alt_symbol_id` is a D1 FK used at data layer (NOT a component prop) | | Component accepts this directly |
```

Change 9.4 from:
```
| 9.4 | Accepts `altDisplayMode` prop (`hover` / `overlay` / `underneath` / `replace` / `off`) | | Missing |
```
To:
```
| 9.4 | Alt display handled by CSS via `data-alt-display-mode` attribute on `<html>` — 6 modes: `hidden`, `caption`, `overlay`, `tooltip`, `subtitle`, `replace` | | Component has hardcoded display mode |
```

---

## audit-log.md — 2 fixes

### Fix 1: Add token coverage grep to Final Cross-Atom Audit section

In the "Final Cross-Atom Audit" checklist at the bottom of the file, add:

```
- [ ] Token coverage grep: every `var(--token-name)` in component CSS resolves to a definition in `src/styles/`. Automate as build-time check.
```

### Fix 2: Add LottieIcon textonly label note

In the LottieIcon cross-atom notes, after the line about "Consumer migration: GlassNav, ReaderNav, ShareSection..." add:

```
- TEXTONLY LABELS: When consumers migrate to slug + fallbackIcon + label props, each LottieIcon instance that is meaningful (not decorative) MUST include a label string. Without it, textonly render shows nothing — buttons/links become empty. GlassNav hamburger, ReaderNav icons, and ShareSection icons all need visible text labels for textonly mode.
```

---

## Post-fix checklist

1. Confirm CLAUDE.md has em-based exception in hardcoded values rule
2. Confirm CLAUDE.md pipeline routing example includes all three targets (full/reduced/textonly)
3. Confirm CLAUDE.md specifies `"category": "atom"` as required value
4. Confirm architecture-decisions Section 2 no longer says atoms never have responsive CSS
5. Confirm architecture-decisions has decisions for: relative sizing, context overrides, atom composition, SectionTitle deprecation, media slot priority, token coverage grep
6. Confirm checklist Section 2 has items 2.17, 2.18, 2.19
7. Confirm checklist Section 2 has acceptable values note with em/percentage exceptions
8. Confirm checklist Section 3.2 specifies `"atom"` as valid value
9. Confirm checklist Sections 9.2, 9.3, 9.4 are updated with correct information
10. Confirm audit-log Final Cross-Atom section has token coverage grep
11. Confirm audit-log LottieIcon section has textonly label note
12. Confirm NO other content was changed

---

## Files to modify

- `CLAUDE.md` (3 fixes)
- `architecture-decisions.md` (7 fixes — Fix 5 covered by Fix 4)
- `component-audit-checklist-v2.md` (4 fixes)
- `audit-log.md` (2 fixes)

No other files should be modified.
