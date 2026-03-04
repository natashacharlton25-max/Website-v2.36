# Image Atom — Audit Fix List (10 items + 4 deferred)

Run these fixes against the Image component at `src/components/atoms/images/Image/`. Do NOT make any changes beyond what is listed here. If something looks wrong or ambiguous, stop and ask — do not silently fix, reinterpret, or add to these instructions.

**Important rules:**
- Never silently change or add to what's specified below
- If a fix requires information you don't have, say so and stop
- Be honest about whether you fully read or skimmed a file
- After all fixes, report exactly what changed, file by file, line by line

---

## Pre-work: Read before changing anything

Before making any changes, confirm these two things and report them:

1. **Global typography tokens** — check `src/styles/` for the correct global font size token for "small" text. The token `--font-size-sm` only exists inside `a11y-panel.css` (scoped, not global). The global system uses `--text-small` or `--text-fine` or similar. Find the correct token name and value. Report it before using it.

2. **Focus pattern** — the established codebase pattern is `outline: 2px solid var(--brand-c-primary); outline-offset: 2px`. Confirm this by checking one of: `utilities.css` (.skip-link:focus), `theme-cards.css` (.a11y-theme-card:focus-visible). Report the exact pattern.

---

## Tier 1 — Schema fixes (Image.schema.json)

### Fix 1: Rename "name" to "component"
Change the top-level `"name"` key to `"component"`. Value stays `"Image"`.

### Fix 2: Add "category" field
Add `"category": "atom"` as a top-level field, after `"component"`.

### Fix 3: Add "assistive" render key
The `"renders"` block currently has 3 keys: `full`, `reduced`, `textonly`. Add `"assistive": "Image.astro"` so it has all 4 keys. Same .astro file — props are filtered by the render pipeline, not by a separate template.

---

## Tier 2 — CSS fixes (Image.css)

### Fix 4: Rewrite comment referencing #a11y-content-wrapper
Around line 239 in Image.css there's a comment that says: `Both attributes live on #a11y-content-wrapper (+ mirrored to <html>).`

Rewrite this comment to remove the term `#a11y-content-wrapper`. The comment should describe the same concept without using that banned selector string. Something like: `Both attributes live on the document root element (<html>).` — adjust to be accurate.

### Fix 5: Add .image:focus-visible rule
The `<figure>` element has `tabindex="0"` but no focus indicator CSS. Add a `:focus-visible` rule using the established codebase pattern (confirmed in pre-work step 2).

Add this in Image.css after the figure wrapper section (after the `.image` base rule). Pattern:

```css
.image:focus-visible {
  outline: 2px solid var(--brand-c-primary);
  outline-offset: 2px;
}
```

Adjust if the pre-work step found a different established pattern.

### Fix 6: Replace broken token var(--font-size-sm)
Around line 249 in Image.css, the alt text span base styles use `font-size: var(--font-size-sm)`. This token only exists inside `a11y-panel.css` — it's not a global token. Outside the panel, it resolves to nothing.

Replace with the correct global typography token found in pre-work step 1.

### Fix 7: Add assistive render rules
This is the FIRST component to get `[data-render="assistive"]` CSS in the codebase. It establishes the pattern.

Add a new section in Image.css for assistive render rules:

```css
/* ==========================================================
   ASSISTIVE RENDER (Easy Click)
   ========================================================== */

[data-render="assistive"] .image {
  display: flex;
  flex-direction: column;
}

[data-render="assistive"] .image .image__img {
  width: 100%;
  height: auto;
}
```

This gives single-column vertical stacking for figure + alt text in assistive mode.

### Fix 8: Add XL text (200%) reflow rules
Alt text in overlay mode (`position: absolute`) can overflow the figure at 200% text size. Add rules that switch overlay to caption (block below) at XL text sizes.

Check how other components detect the XL threshold before writing this — there may be an existing `data-*` attribute or container query pattern.

If no existing pattern exists, add a comment noting this needs wiring to the XL threshold system, and add the CSS rules gated behind a `[data-text-xl]` attribute as a placeholder:

```css
/* ==========================================================
   XL TEXT REFLOW — alt text containers
   TODO: Wire to XL threshold system when established
   ========================================================== */

[data-text-xl] .image {
  display: flex;
  flex-direction: column;
}

[data-text-xl] [data-alt-display-mode="overlay"][data-alt-text-mode] .image-alt-word,
[data-text-xl] [data-alt-display-mode="overlay"][data-alt-text-mode] .image-alt-descriptive,
[data-text-xl] [data-alt-display-mode="overlay"][data-alt-text-mode] .image-alt-aac {
  position: static;
  background: transparent;
  color: var(--brand-c-text-dark);
}
```

### Fix 9: Assistive + XL vertical stacking
This may already be covered by fixes 7 and 8. If both already produce `flex-direction: column` on `.image`, consolidate into a single rule:

```css
[data-render="assistive"] .image,
[data-text-xl] .image {
  display: flex;
  flex-direction: column;
}
```

Do not duplicate rules — consolidate if 7 and 8 already cover this.

### Fix 10: Enlarged focus ring in assistive render
Under `[data-render="assistive"]`, focus indicators should be 3px minimum with high contrast:

```css
[data-render="assistive"] .image:focus-visible {
  outline-width: 3px;
}
```

Add this inside the assistive render section created in Fix 7.

---

## Deferred — Atom Render Pass (do NOT fix now)

The following 4 items are cross-atom dependencies. They will be resolved in a final atom render pass after ALL atoms have been individually audited. **Do not make these changes now.** Instead, add them to the Image entry notes in `src/components/atoms/Atom Audit Files/audit-log.md`.

### Deferred 11: Alt text word + descriptive spans → Text atom
Image.astro lines 147–152 use raw `<span>` elements for alt text. These should use the `<Text>` atom. Requires Text atom to be audited first and to support `aria-hidden` and additional class props.

### Deferred 12: AAC pictogram cards → Card + Image + Text atom markup
`src/lib/aac/aac-cards.ts` `pictogramCard()` outputs raw HTML. The template needs updating to match Card atom (wrapper), Image atom (pictogram img), and Text atom (word label) output patterns. Injection mechanism stays the same — just the HTML template changes.

### Deferred 13: AAC text-only fallback → Text atom markup
`src/lib/aac/aac-cards.ts` `textOnlyCard()` outputs raw HTML. When no pictogram exists, the word should use Text atom markup. Check whether the outer `aac-card--text-only` wrapper is still needed or if `[data-core-tier]` alone handles CSS targeting.

### Deferred 14: Pictogram img inside AAC cards → Image atom markup
The `<img>` in `pictogramCard()` uses `class="aac-card__pictogram"`. Should match Image atom class/attribute patterns. Note: pictogram images are meaningful content — keep `alt` populated, do NOT add `aria-hidden`.

---

## Audit Log Update

The Image atom already has an entry in `src/components/atoms/Atom Audit Files/audit-log.md`. **Update the existing entry** — do NOT create a duplicate row.

In the `atoms/images/` table, change the Image row from:

```
| Image | PARTIAL | 2026-03-04 | v2 audit run done (see below). Fixes 1-10 pending. 4 items deferred to cross-atom pass. |
```

To:

```
| Image | PARTIAL | [today's date] | Fixes 1–10 applied. Schema: component, category, assistive render key added. CSS: focus-visible added, broken --font-size-sm token replaced, #a11y-content-wrapper comment rewritten. Assistive render CSS added (first component with [data-render="assistive"]). XL text reflow placeholder added (needs XL threshold wiring). Section 15 (print): deferred to global print layer. |
```

Then in the `atoms/images/` **Cross-atom notes** section, add these deferred items:

```
- DEFERRED to atom render pass: (11) alt text word + descriptive spans → Text atom, (12) AAC pictogram card → Card+Image+Text atom markup in aac-cards.ts, (13) AAC text-only fallback → Text atom markup, (14) pictogram img in AAC cards → Image atom markup
```

Also update the **v2 audit findings** section to mark completed items and note what remains:
- Strike through or mark as FIXED: Section 2 comment, Section 3 schema, Section 6 focus, Section 7/8/10 assistive CSS, `--font-size-sm` token
- Keep as NOTED: Section 9 checklist corrections (checklist needs updating, not component), Section 15 print (global layer)

---

## Post-fix checklist

After all changes, run these verification checks:

1. `grep -n "a11y-content-wrapper" src/components/atoms/images/Image/Image.css` → should return 0 matches
2. `grep -n "font-size-sm" src/components/atoms/images/Image/Image.css` → should return 0 matches
3. Confirm Image.schema.json has `"component"`, `"category"`, and 4 render keys
4. Confirm Image.css has `.image:focus-visible` rule
5. Confirm Image.css has `[data-render="assistive"]` section
6. Confirm Image.css has `[data-text-xl]` section
7. Confirm audit-log.md Image entry updated to PARTIAL with deferred items in cross-atom notes

---

## Files to modify

- `src/components/atoms/images/Image/Image.schema.json` (fixes 1–3)
- `src/components/atoms/images/Image/Image.css` (fixes 4–10)
- `src/components/atoms/Atom Audit Files/audit-log.md` (update existing Image entry + cross-atom notes)

No other files should be modified. If a fix requires changes to other files, flag it and stop.
