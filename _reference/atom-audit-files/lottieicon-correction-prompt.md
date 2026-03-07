# LottieIcon — Correction Fix (3 fixes)

The previous follow-up introduced fallbackIcon and label as required props. This was wrong — both should be optional. This correction fixes the schema, component, and aria logic.

Do NOT make any changes beyond what is listed here. If something looks wrong or ambiguous, stop and ask.

**Important rules:**
- Never silently change or add to what's specified below
- After all fixes, report exactly what changed, file by file, line by line

---

## The principle

Every LottieIcon instance is described by JSON content. The JSON author decides what each instance needs:

**Meaningful icon (nav search button):**
```json
{
  "lottieIcon": "lottie-search",
  "fallbackIcon": "MagnifyingGlass",
  "label": "Search"
}
```

**Decorative icon (card flourish):**
```json
{
  "lottieIcon": "lottie-sparkle"
}
```

Same component, same props available. The content author decides per instance. The component adapts to what it receives:
- `label` present → `role="img"` + `aria-label={label}` (meaningful)
- `label` absent → `aria-hidden="true"` (decorative)

`fallbackIcon` is a schema prop only — LottieIcon never renders it. The pipeline reads it from JSON and routes it to the Icon atom in reduced/assistive modes. The LottieIcon.astro component doesn't need it in its Props interface.

---

## Fix 1: Schema — make fallbackIcon and label optional

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
  "notes": "API-backed animated icon using Lottie. Fetches JSON at build time and inlines as animationData. JSON content can declare up to three dimensions: the Lottie animation (full render), a Phosphor fallback icon name (reduced/assistive — pipeline routes to Icon atom), and a text label (textonly — pipeline routes to Text or Link atom, and used as aria-label on LottieIcon). All optional — decorative instances may only have the animation. The render pipeline handles mode switching, LottieIcon only renders the animation.",

  "props": {
    "content": {
      "_description": "What this icon is and what it represents",
      "slug": { "type": "string", "required": false, "default": null, "description": "Asset Library slug for the Lottie JSON." },
      "src": { "type": "string", "required": false, "default": null, "description": "Legacy filesystem path fallback. Migrate to slug." },
      "fallbackIcon": { "type": "string", "required": false, "default": null, "description": "Phosphor icon name for reduced/assistive render. Pipeline routes this to Icon atom — LottieIcon.astro never sees this prop." },
      "label": { "type": "string", "required": false, "default": null, "description": "Human-readable label. Used as aria-label on LottieIcon in full render. Pipeline routes to Text or Link atom in textonly mode. Absent = decorative (aria-hidden)." }
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

Key points:
- `fallbackIcon` is optional — decorative instances don't need it
- `label` is optional — decorative instances don't need it
- `fallbackIcon` description explicitly says "LottieIcon.astro never sees this prop"
- `renders.reduced` and `renders.assistive` = `"Icon"` (pipeline routes fallbackIcon to Icon atom)
- `renders.textonly` = `"label"` (pipeline routes label to Text or Link atom)

---

## Fix 2: Update LottieIcon.astro — remove fallbackIcon from Props, make label optional with conditional aria

File: `LottieIcon.astro`

**Step 1:** Update the Props interface. Remove `fallbackIcon` (component never uses it). Keep `label` as optional:

```typescript
interface Props {
  slug?: string;
  src?: string;
  label?: string;
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
  class?: string;
  id?: string;
}
```

**Step 2:** Update the destructured props:

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

**Step 3:** On the container div, make aria attributes conditional based on whether label is provided:

```html
<div
  class={`lottie-icon ${className}`}
  data-lottie-icon
  data-lottie-loop={loop}
  data-lottie-autoplay={autoplay}
  data-semantic-role="decorative"
  {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' })}
  style={`width: ${size}px; height: ${size}px;`}
  id={id}
  {...(src && !animationData ? { 'data-lottie-src': src } : {})}
>
```

This means:
- Label provided → `role="img"` + `aria-label="Search"` (meaningful, screen reader announces it)
- No label → `aria-hidden="true"` (decorative, screen reader skips it)

This is not gated rendering — it's the same pattern as `<img alt="...">` vs `<img alt="">`. The component responds to what props it receives. The JSON author decides per instance.

---

## Fix 3: Confirm LottieIcon.reduced.astro is still deleted

The previous fix prompt deleted this file. Confirm it is still gone. If Claude Code recreated it for any reason, delete it again. The render pipeline handles reduced/assistive by routing to the Icon atom — no LottieIcon-specific reduced template exists.

---

## Audit Log Update

File: `src/components/atoms/Atom Audit Files/audit-log.md`

Update the existing LottieIcon entry:

```
| LottieIcon | PARTIAL | [today's date] | All fixes applied. Schema: three optional content dimensions — slug/src (animation), fallbackIcon (static Phosphor for reduced/assistive, pipeline routes to Icon atom, LottieIcon never sees this), label (aria-label on component, pipeline routes to Text/Link in textonly). Props adapt: label present = role="img" + aria-label, label absent = aria-hidden="true". Renders: full → LottieIcon.astro, reduced/assistive → Icon atom via pipeline, textonly → label via pipeline. No separate template files. ACCEPTED: env var reads (build-time config). DEFERRED: Consumer migration from src paths to slugs, lottie_mappings shared fallback verification. |
```

Update cross-atom notes:

```
- CORRECTED: fallbackIcon and label are optional, not required. Decorative instances (card flourishes etc) pass neither. Meaningful instances (nav icons) pass both. The JSON author decides per instance.
- CORRECTED: fallbackIcon removed from LottieIcon.astro Props interface. It's a schema prop for the pipeline, not a component prop. Pipeline routes it to Icon atom.
- CORRECTED: label on LottieIcon.astro is optional. Present = role="img" + aria-label. Absent = aria-hidden="true". Same pattern as img alt="" vs img alt="description".
- Consumer migration: GlassNav, ReaderNav, ShareSection currently have hardcoded static Icon fallbacks alongside LottieIcons. Once consumers pass fallbackIcon and label through JSON, the hardcoded fallbacks become redundant.
- TEXTONLY: Pipeline routes label to Text or Link atom in textonly mode. Parent context determines which. LottieIcon itself always renders null in textonly.
```

---

## Post-fix checklist

1. Confirm schema has `fallbackIcon` and `label` both with `"required": false`
2. Confirm schema `fallbackIcon` description says "LottieIcon.astro never sees this prop"
3. Confirm `LottieIcon.astro` Props interface does NOT have `fallbackIcon`
4. Confirm `LottieIcon.astro` Props interface has `label?: string` (optional)
5. Confirm container div uses spread: `label` present → `role="img"` + `aria-label`, absent → `aria-hidden="true"`
6. Confirm container div still has `data-semantic-role="decorative"`
7. Confirm `LottieIcon.reduced.astro` does NOT exist
8. Confirm audit-log.md updated

---

## Files to modify

- `src/components/atoms/icons/LottieIcon/LottieIcon.schema.json` (fix 1 — full rewrite)
- `src/components/atoms/icons/LottieIcon/LottieIcon.astro` (fix 2 — props + conditional aria)
- `src/components/atoms/Atom Audit Files/audit-log.md` (update entry)

Confirm deletion:
- `src/components/atoms/icons/LottieIcon/LottieIcon.reduced.astro` (should not exist)

No other files should be modified.
