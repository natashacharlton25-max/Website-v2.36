# Badge Atom — Fix Prompt

Run these fixes against `src/components/atoms/ui/Badge/`.
Read each file fully before making changes.

---

## Fix 1: Schema — Badge.schema.json

Two changes:

**1a.** `"category": "atoms/ui"` → `"category": "atom"`

**1b.** Add missing `"assistive"` render key:
```json
"renders": { "full": "Badge.astro", "reduced": "Badge.astro", "assistive": "Badge.astro", "textonly": "Badge.astro" }
```

**1c.** Update notes — remove "Extends .text class from Text atom" reference. Replace with:
```json
"notes": "Simple inline label. Label renders through Text atom. Zone colour tokens for palette. Non-interactive — no animation, no hover."
```

---

## Fix 2: Astro — Badge.astro

**2a.** Add Text import after Icon import:
```astro
import { Text } from '../Text';
```

**2b.** Remove `'text'` from the class list (line 40). Change:
```javascript
'text',       /* base typography from Text atom — sets font, color, line-height */
'badge',
```
To:
```javascript
'badge',
```

**2c.** Replace raw span label with Text atom. Change line 53:
```astro
<span class="badge__label">{label}</span>
```
To:
```astro
<Text as="span" class="badge__label" flush>{label}</Text>
```

**2d.** Add `data-semantic-role="status"` to the badge element. Change line 38:
```astro
<span
  class:list={[
```
To:
```astro
<span
  data-semantic-role="status"
  class:list={[
```

---

## Fix 3: Render mode CSS — Badge.css

Add at the end of Badge.css:

```css
/* ================================================================
   RENDER MODE OVERRIDES
   ================================================================ */

/* Assistive — larger text, solid background, normal flow */
[data-render="assistive"] .badge {
  font-size: var(--text-body);
  padding: var(--space-md);
  background: var(--brand-c-text);
  color: var(--color-White);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: none;
  position: static;
}

/* Textonly — plain solid badge, normal flow */
[data-render="textonly"] .badge {
  background: var(--brand-c-text);
  color: var(--color-White);
  border: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  position: static;
}
```

Rationale:
- Solid background guarantees contrast regardless of what the badge overlays (images, glass effects, gradients)
- `position: static` resets any absolute positioning consumers may apply (e.g. Card overlaying badge on image) — badge flows in normal document order
- `backdrop-filter: none` kills glass effects that depend on background content
- Assistive gets larger text (`--text-body` instead of `--text-sm`) and more padding for readability

---

## Fix 4: CSS cleanup — Badge.css

**4a.** Remove `.badge__label` rule (lines 47-50) if it only has `font: inherit; color: inherit;` — Text atom now handles typography. If the rule has layout-specific properties (position, z-index), keep those only.

---

## Deferred items (for audit-log.md)

Add to Badge cross-atom notes:

```
- DEFERRED: When Badge is a child of Card with an Image, assistive/textonly renders should append badge label to image alt text word layer. Badge element hidden, information preserved in alt text pipeline. Implement during Card audit.
- DEFERRED: Icon inside Badge — verify Icon atom's aria-hidden and data-semantic-role propagate correctly (cross-atom Section 16).
```

---

## Post-fix verification

1. `grep -r "atoms/ui" Badge.schema.json` returns 0 matches
2. `grep -r "'text'" Badge.astro` returns 0 matches (no raw 'text' class)
3. `grep -r "badge__label" Badge.astro` returns match with `<Text` wrapper
4. Schema has 4 render keys
5. Badge.css has `[data-render="assistive"]` and `[data-render="textonly"]` rules
6. `data-semantic-role="status"` present on badge element

---

## Audit log entry

```
| Badge | PASS | 2026-03-05 | Fixes 1-4 applied. Schema: category → "atom", assistive render key added. Label through Text atom, 'text' class removed. data-semantic-role="status" added. Render mode CSS: assistive (larger text, solid bg, position reset), textonly (solid bg, position reset, no glass). No animation, no JS, no a11y.css. DEFERRED: Badge-in-Card alt text integration (Card audit), Icon inheritance (cross-atom). |
```
