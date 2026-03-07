# LottieIcon Atom — Audit Fix List (6 fixes + deferred)

Run these fixes against the LottieIcon component at `src/components/atoms/icons/LottieIcon/`. Do NOT make any changes beyond what is listed here. If something looks wrong or ambiguous, stop and ask.

**Important rules:**
- Never silently change or add to what's specified below
- No hardcoded colour/spacing values — use tokens
- No `var(--token, fallback)` pattern — no fallbacks in component CSS
- After all fixes, report exactly what changed, file by file, line by line

---

## Fix 1: Schema — rename "name" to "component", add "category"

File: `LottieIcon.schema.json`

Change `"name": "LottieIcon"` to `"component": "LottieIcon"`

Add `"category": "atom"` after `"component"`.

---

## Fix 2: Schema — add "assistive" render key, keep "reduced" as-is

File: `LottieIcon.schema.json`

**DO NOT change the "reduced" value.** Keep it pointing to `"LottieIcon.reduced.astro"`. That file will be created in Fix 6.

Add `"assistive": "LottieIcon.reduced.astro"` between reduced and textonly.

Final renders block should be:
```json
"renders": {
  "full": "LottieIcon.astro",
  "reduced": "LottieIcon.reduced.astro",
  "assistive": "LottieIcon.reduced.astro",
  "textonly": null
}
```

Rationale: Pointing reduced/assistive at the full LottieIcon.astro would load lottie-web (~300KB) and inline animation JSON just to show a static first frame. That's not reduced — that's full render with one prop missing. Reduced and assistive renders use a lightweight placeholder. The full Phosphor fallback implementation will be wired in when each consumer component is audited.

---

## Fix 3: Astro — add aria-hidden and data-semantic-role

File: `LottieIcon.astro`

On the container div (line 65), add two attributes:
- `aria-hidden="true"` — LottieIcon is entirely decorative, parent provides accessible name
- `data-semantic-role="decorative"` — enables AAC mode rules

The div should look like:
```html
<div
  class={`lottie-icon ${className}`}
  data-lottie-icon
  data-lottie-loop={loop}
  data-lottie-autoplay={autoplay}
  data-semantic-role="decorative"
  aria-hidden="true"
  style={`width: ${size}px; height: ${size}px;`}
  id={id}
  {...(src && !animationData ? { 'data-lottie-src': src } : {})}
>
```

---

## Fix 4: Create responsive.css placeholder

Create new file: `LottieIcon.responsive.css`

```css
/* LottieIcon.responsive.css — Breakpoint styles.
 * LottieIcon uses fixed sizing from parent component.
 * No responsive overrides needed currently.
 */
```

---

## Fix 5: Update index.ts with responsive import

File: `index.ts`

Add responsive CSS import. Final file:

```ts
import './LottieIcon.css';
import './LottieIcon.responsive.css';

export { default as LottieIcon } from './LottieIcon.astro';
export { default as schema } from './LottieIcon.schema.json';
```

---

## Fix 6: Create minimal LottieIcon.reduced.astro placeholder

Create new file: `LottieIcon.reduced.astro`

This is a lightweight placeholder for reduced and assistive renders. It renders an empty span at the correct dimensions — no lottie-web, no animation JSON, no network requests. The full implementation (Phosphor icon lookup via lottie_mappings) will be built when each consumer component is audited and migrated from legacy src paths to API slugs.

```astro
---
/**
 * LottieIcon.reduced — Lightweight placeholder for reduced/assistive renders
 *
 * Renders an empty inline element at the requested size.
 * No lottie-web loaded, no animation JSON fetched.
 *
 * TODO: Replace with static Phosphor icon via lottie_mappings lookup
 * when consumers are migrated from legacy src paths to API slugs.
 * See: 003_lottie_mappings_data.sql for existing mapping table.
 */

interface Props {
  slug?: string;
  src?: string;
  size?: number;
  class?: string;
  id?: string;
}

const {
  size = 24,
  class: className = '',
  id,
} = Astro.props;
---

<span
  class={`lottie-icon lottie-icon--reduced ${className}`}
  aria-hidden="true"
  data-semantic-role="decorative"
  style={`width: ${size}px; height: ${size}px; display: inline-flex;`}
  id={id}
></span>
```

Note: This accepts the same props interface as the full component (slug, src, size, class, id) but ignores slug and src since it has no animation to load. Loop and autoplay are intentionally excluded — animation props are stripped in reduced render.

---

## Deferred — wired in during consumer audits (do NOT fix now)

### Deferred 1: Consumer migration from src paths to slugs
All 4 consumers (GlassNav, ReaderNav, ShareSection, Button passthrough) use legacy filesystem `src` paths. Must migrate to `slug` props before lottie_mappings table can provide static fallbacks. Will be done as each consumer is audited.

### Deferred 2: Full LottieIcon.reduced.astro implementation
Replace the empty placeholder with a component that:
- Takes the `slug` prop
- Queries lottie_mappings to find the static Phosphor icon asset ID
- Renders a static `<Icon>` component with the mapped Phosphor icon
Blocked by Deferred 1 — consumers must use slugs first.

### Deferred 3: lottie_mappings coverage verification
33 mappings exist in D1. Two concerns:
- `a_38uz8cvrxpo7` is the static fallback for 4 different Lottie icons
- `a_y99i2lyj67xi` is the static fallback for 5 different Lottie icons
Need to verify these shared fallbacks make semantic sense (e.g. all 5 are arrow variants mapping to one arrow icon = fine; 5 unrelated icons mapping to one generic icon = not fine). Will be checked when each consumer is audited.

### Deferred 4: JS bundle gating
lottie-web (~300KB) loads via inline `<script>` in the full render. The render pipeline should ensure this script tag is excluded from reduced/assistive/textonly builds. Cross-cutting concern, not atom-specific.

### Deferred 5: Button animation passthrough
Button accepts a `lottieIcon` string prop and passes it as `src`. Verify Button correctly passes animation props and that the reduced render path works through Button's own reduced template.

---

## Audit Log Update

Update the existing LottieIcon entry in `src/components/atoms/Atom Audit Files/audit-log.md`. Do NOT create a duplicate row.

In the `atoms/icons/` table, change the LottieIcon row to:

```
| LottieIcon | PARTIAL | [today's date] | Fixes 1-6 applied. Schema corrected (component/category keys, 4 render keys). aria-hidden + data-semantic-role added. Responsive.css created. LottieIcon.reduced.astro placeholder created for reduced/assistive renders (empty span, no lottie-web). ACCEPTED: env var reads (build-time config). DEFERRED: Full reduced implementation blocked by consumer migration from src paths to slugs — will be wired in per-consumer during their audits. |
```

In the `atoms/icons/` **Cross-atom notes** section, add:
```
- DEFERRED: LottieIcon consumers (GlassNav, ReaderNav, ShareSection, Button) all use legacy src="/Icons/..." paths. Must migrate to slug props before lottie_mappings can provide Phosphor fallbacks for reduced/assistive renders.
- DEFERRED: lottie_mappings has shared fallbacks (a_38uz8cvrxpo7 x4, a_y99i2lyj67xi x5) — verify semantic correctness during consumer audits.
- DEFERRED: lottie-web JS bundle gating — render pipeline should exclude <script> from non-full renders.
- LottieIcon.reduced.astro is a placeholder. TODO marker in file tracks the full implementation.
```

---

## Post-fix checklist

1. Confirm schema has `"component"` (not `"name"`), has `"category": "atom"`
2. Confirm schema renders block has 4 keys: full → LottieIcon.astro, reduced → LottieIcon.reduced.astro, assistive → LottieIcon.reduced.astro, textonly → null
3. Confirm `LottieIcon.astro` has `aria-hidden="true"` and `data-semantic-role="decorative"` on container div
4. Confirm `LottieIcon.reduced.astro` exists and does NOT import lottie-web
5. Confirm `LottieIcon.reduced.astro` accepts same props interface (slug, src, size, class, id) but NOT loop/autoplay
6. Confirm `LottieIcon.responsive.css` exists
7. Confirm `index.ts` imports both CSS files (2 imports)
8. Confirm audit-log.md LottieIcon entry updated with deferred items noted

---

## Files to modify

- `src/components/atoms/icons/LottieIcon/LottieIcon.schema.json` (fixes 1-2)
- `src/components/atoms/icons/LottieIcon/LottieIcon.astro` (fix 3)
- `src/components/atoms/icons/LottieIcon/LottieIcon.responsive.css` (create — fix 4)
- `src/components/atoms/icons/LottieIcon/index.ts` (fix 5)
- `src/components/atoms/icons/LottieIcon/LottieIcon.reduced.astro` (create — fix 6)
- `src/components/atoms/Atom Audit Files/audit-log.md` (update LottieIcon entry)

No other files should be modified.
