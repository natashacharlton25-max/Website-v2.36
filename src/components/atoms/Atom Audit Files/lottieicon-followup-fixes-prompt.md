# LottieIcon — Follow-up Fix (schema + cleanup)

The initial audit fixes are applied. This follow-up corrects the approach — LottieIcon doesn't need separate template files for reduced/assistive/textonly. The JSON content describes each instance fully, the render pipeline handles mode switching.

Do NOT make any changes beyond what is listed here. If something looks wrong or ambiguous, stop and ask.

**Important rules:**
- Never silently change or add to what's specified below
- After all fixes, report exactly what changed, file by file, line by line

---

## The principle

When someone picks a Lottie from the library, the JSON for that instance declares everything:

```json
{
  "lottieIcon": "lottie-search",
  "fallbackIcon": "MagnifyingGlass",
  "label": "Search"
}
```

- `lottieIcon` — which animation (full render)
- `fallbackIcon` — which static Phosphor icon (reduced/assistive render — this is just an Icon atom, already exists)
- `label` — what it means in words (text-only render — just text, no component needed)

The render pipeline reads the mode and renders the appropriate existing atom. No separate LottieIcon.reduced.astro or LottieIcon.textonly.astro files needed.

---

## Fix 1: Schema — add fallbackIcon and label, update renders and notes

File: `LottieIcon.schema.json`

Replace the entire file with:

```json
{
  "component": "LottieIcon",
  "category": "atom",
  "renders": {
    "full": "LottieIcon.astro",
    "reduced": "Icon",
    "assistive": "Icon",
    "textonly": "label"
  },
  "notes": "API-backed animated icon using Lottie. Fetches JSON at build time and inlines as animationData. Each instance declares three things: the Lottie animation (full render), a Phosphor fallback icon name (reduced/assistive — renders standard Icon atom), and a text label (textonly — renders as visible text). All three are required. The render pipeline handles mode switching using existing atoms, no separate template files needed.",

  "props": {
    "content": {
      "_description": "What this icon is and what it represents",
      "slug": { "type": "string", "required": false, "default": null, "description": "Asset Library slug for the Lottie JSON." },
      "src": { "type": "string", "required": false, "default": null, "description": "Legacy filesystem path fallback. Migrate to slug." },
      "fallbackIcon": { "type": "string", "required": true, "description": "Phosphor icon name for reduced/assistive render (e.g. 'MagnifyingGlass'). Populated from lottie_mappings at content generation time." },
      "label": { "type": "string", "required": true, "description": "Human-readable label. Rendered as visible text in textonly mode. Used as aria-label in full/reduced/assistive modes." }
    },

    "visual": {
      "_description": "How the icon looks",
      "size": { "type": "number", "required": false, "default": 24, "description": "Width and height in px." },
      "class": { "type": "string", "required": false, "default": "", "description": "Additional CSS classes." },
      "id": { "type": "string", "required": false, "default": null, "description": "HTML id attribute." }
    },

    "animation": {
      "_description": "Motion behaviour — stripped in reduced render",
      "loop": { "type": "boolean", "required": false, "default": false, "description": "Loop the animation continuously." },
      "autoplay": { "type": "boolean", "required": false, "default": false, "description": "Start playing on load." }
    }
  }
}
```

Key changes from current schema:
- `renders.reduced` → `"Icon"` (standard Icon atom, not a separate file)
- `renders.assistive` → `"Icon"` (same)
- `renders.textonly` → `"label"` (renders the label prop as visible text)
- Added `fallbackIcon` (required) to content props
- Added `label` (required) to content props
- Updated notes to explain the three-part content model

---

## Fix 2: Update LottieIcon.astro — add aria-label from label prop

File: `LottieIcon.astro`

LottieIcon is no longer purely decorative — it carries its own label. Update:

**Step 1:** Add `label` to the Props interface:

```typescript
interface Props {
  slug?: string;
  src?: string;
  fallbackIcon?: string;
  label: string;
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  class?: string;
  id?: string;
}
```

**Step 2:** Add `label` to the destructured props:

```typescript
const {
  slug,
  src,
  label,
  size = 24,
  loop = false,
  autoplay = false,
  class: className = '',
  id,
} = Astro.props;
```

**Step 3:** On the container div, change `aria-hidden="true"` to `aria-label={label}` and add `role="img"`:

```html
<div
  class={`lottie-icon ${className}`}
  data-lottie-icon
  data-lottie-loop={loop}
  data-lottie-autoplay={autoplay}
  data-semantic-role="decorative"
  role="img"
  aria-label={label}
  style={`width: ${size}px; height: ${size}px;`}
  id={id}
  {...(src && !animationData ? { 'data-lottie-src': src } : {})}
>
```

Note: `data-semantic-role="decorative"` stays — AAC mode still treats animated icons differently. But `aria-hidden` is removed because the component now self-describes via aria-label.

---

## Fix 3: Delete LottieIcon.reduced.astro

File: `LottieIcon.reduced.astro`

DELETE this file. The render pipeline handles reduced/assistive by rendering a standard Icon atom with the `fallbackIcon` prop. No LottieIcon-specific reduced template needed.

---

## Audit Log Update

File: `src/components/atoms/Atom Audit Files/audit-log.md`

Update the existing LottieIcon entry:

```
| LottieIcon | PARTIAL | [today's date] | All fixes applied. Schema: three required content dimensions — slug/src (animation), fallbackIcon (static Phosphor for reduced/assistive), label (text for textonly + aria-label). Renders: full → LottieIcon.astro, reduced/assistive → Icon atom via fallbackIcon, textonly → label as visible text. No separate reduced/textonly template files. LottieIcon.reduced.astro placeholder deleted. ACCEPTED: env var reads (build-time config). DEFERRED: Consumer migration from src paths to slugs, lottie_mappings shared fallback verification. |
```

Update cross-atom notes:

```
- CORRECTED: LottieIcon is not purely decorative. Each instance carries a label (aria-label in full/reduced, visible text in textonly). Removed aria-hidden, added role="img" + aria-label.
- CORRECTED: LottieIcon.reduced.astro deleted. Reduced/assistive render handled by render pipeline using Icon atom with fallbackIcon prop from JSON.
- Consumer migration: GlassNav, ReaderNav, ShareSection currently have hardcoded static Icon fallbacks alongside LottieIcons. Once consumers pass fallbackIcon and label through JSON props, the hardcoded fallbacks become redundant.
- TEXTONLY GAP resolved at atom level: label prop renders as visible text in textonly mode. Consumers no longer need to handle textonly fallback separately.
```

---

## Post-fix checklist

1. Confirm schema has `fallbackIcon` (required) and `label` (required) in content props
2. Confirm schema `renders.reduced` = `"Icon"`, `renders.assistive` = `"Icon"`, `renders.textonly` = `"label"`
3. Confirm `LottieIcon.astro` has `label` in Props interface and destructured props
4. Confirm `LottieIcon.astro` container div has `role="img"` and `aria-label={label}`, NOT `aria-hidden="true"`
5. Confirm `LottieIcon.astro` container div still has `data-semantic-role="decorative"`
6. Confirm `LottieIcon.reduced.astro` is DELETED
7. Confirm audit-log.md updated

---

## Files to modify

- `src/components/atoms/icons/LottieIcon/LottieIcon.schema.json` (fix 1 — full rewrite)
- `src/components/atoms/icons/LottieIcon/LottieIcon.astro` (fix 2 — add label, change aria)
- `src/components/atoms/icons/LottieIcon/LottieIcon.reduced.astro` (fix 3 — DELETE)
- `src/components/atoms/Atom Audit Files/audit-log.md` (update entry)

No other files should be modified.
