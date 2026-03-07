# Icon Atom — Audit Fix List (4 fixes + 3 deferred)

Run these fixes against the Icon component at `src/components/atoms/icons/Icon/`. Do NOT make any changes beyond what is listed here. If something looks wrong or ambiguous, stop and ask.

**Important rules:**
- Never silently change or add to what's specified below
- After all fixes, report exactly what changed, file by file, line by line

---

## Fix 1: Merge Icon.animation.css into Icon.css and delete

The architecture does NOT use separate animation CSS files. Animation rules live in the base `Component.css`, gated behind classes that only appear when JSON passes animation props. No prop = no class in HTML = rule never matches = zero animation. Nothing to hide or override — it just never loads.

**Step 1:** Copy the entire contents of `Icon.animation.css` (keyframes + hover rules) into `Icon.css`, at the end of the file. Add a section comment:

```css
/* ==========================================================
   ANIMATION — gated by JSON props → CSS classes
   No prop = no class = these rules never match.
   ========================================================== */
```

Then paste the keyframes and hover rules below that comment.

**Step 2:** Delete `Icon.animation.css` from the folder.

**Step 3:** Remove the animation import from `index.ts`. Change from:

```ts
import './Icon.css';
import './Icon.animation.css';
import './Icon.responsive.css';

export { default as Icon } from './Icon.astro';
export { default as schema } from './Icon.schema.json';
```

To:

```ts
import './Icon.css';
import './Icon.responsive.css';

export { default as Icon } from './Icon.astro';
export { default as schema } from './Icon.schema.json';
```

---

## Fix 2: Create empty Icon.responsive.css

Create `src/components/atoms/icons/Icon/Icon.responsive.css` with a header comment only:

```css
/* Icon.responsive.css — Breakpoint styles.
 * Icons use fixed px sizing via the size prop.
 * No responsive overrides needed currently.
 */
```

---

## Fix 3: Add "assistive" render key to schema

In `Icon.schema.json`, the `"renders"` block currently has 3 keys:

```json
"renders": { "full": "Icon.astro", "reduced": "Icon.astro", "textonly": null }
```

Add `"assistive"` key:

```json
"renders": { "full": "Icon.astro", "reduced": "Icon.astro", "assistive": "Icon.astro", "textonly": null }
```

---

## Fix 4: Remove incorrect comment from Icon.animation.css header

This is handled by Fix 1 (the file is deleted). But when copying the contents into Icon.css, do NOT include the old file header comment that says "Only loaded in the full-motion render." That statement is wrong — all CSS loads in all renders, animation is gated by prop-driven classes, not by file loading.

---

## Deferred — Cross-Atom Pass (do NOT fix now)

### Deferred 5: AAC semantic role rules for .icon

`Image.css` lines 368-376 contain rules that target `.icon` class:
```css
[data-alt-text-mode="aac"] [data-semantic-role="ui-control"] .icon { display: none; }
[data-alt-text-mode="aac"] [data-semantic-role="content-symbol"] .icon { display: none; }
```

These should move to a global AAC stylesheet (e.g. `src/styles/global/aac-mode.css`) since they apply to icons anywhere on the page. Do this in the cross-atom pass.

### Deferred 6: Inline pixel style — future improvement

Icon line 239 sets `width` and `height` as hard inline styles in pixels. Could use CSS custom property pattern (`--icon-size`) to allow parent override without `!important`. Not blocking — parent atoms own sizing. Note for future.

### Deferred 7: Animation CSS barrel import pattern

Now resolved by Fix 1 — no separate animation file, no import to gate. But confirm this pattern (animation in base CSS, gated by classes) is documented in CLAUDE.md for all future components.

---

## Audit Log Update

Update the existing Icon entry in `src/components/atoms/Atom Audit Files/audit-log.md`. Do NOT create a duplicate row.

In the `atoms/icons/` table, change the Icon row to:

```
| Icon | PARTIAL | [today's date] | Fixes 1-4 applied. Animation CSS merged into base (no separate animation file — gated by JSON prop classes). Responsive.css created. Assistive render key added. ACCEPTED: env var reads (build-time config), aria-hidden on all icons (parent provides a11y name). DEFERRED: AAC semantic role rules to global file, inline px style future improvement. |
```

In the `atoms/icons/` **Cross-atom notes** section, add:
```
- DEFERRED to cross-atom pass: (5) AAC semantic role .icon rules move from Image.css to src/styles/global/aac-mode.css, (6) inline px style could use --icon-size CSS custom property pattern — future improvement, parent owns sizing for now
- Icon.animation.css pattern was WRONG — deleted and merged into Icon.css. No component should have a separate animation CSS file. Animation is gated by JSON prop → class → CSS rule in the base file.
```

---

## Post-fix checklist

1. Confirm `Icon.animation.css` no longer exists in the Icon folder
2. Confirm `Icon.css` contains the keyframes and hover rules at the end
3. Confirm `Icon.css` animation section does NOT have the old "only loaded in full-motion render" comment
4. Confirm `index.ts` imports only `Icon.css` and `Icon.responsive.css` (2 imports, not 3)
5. Confirm `Icon.responsive.css` exists
6. Confirm `Icon.schema.json` has 4 render keys
7. Confirm audit-log.md Icon entry updated with the animation file correction noted

---

## Files to modify

- `src/components/atoms/icons/Icon/Icon.css` (merge animation rules in — fix 1)
- `src/components/atoms/icons/Icon/Icon.animation.css` (DELETE — fix 1)
- `src/components/atoms/icons/Icon/index.ts` (remove animation import — fix 1)
- `src/components/atoms/icons/Icon/Icon.responsive.css` (create — fix 2)
- `src/components/atoms/icons/Icon/Icon.schema.json` (fix 3)
- `src/components/atoms/Atom Audit Files/audit-log.md` (update Icon entry)

No other files should be modified.
