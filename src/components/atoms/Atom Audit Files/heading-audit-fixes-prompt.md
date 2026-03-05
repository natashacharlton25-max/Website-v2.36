# Heading Atom — Audit Fix List (8 fixes + deferred)

Run these fixes against the Heading component at `src/components/atoms/ui/Heading/`. Do NOT make any changes beyond what is listed here. If something looks wrong or ambiguous, stop and ask.

**Important rules:**
- Never silently change or add to what's specified below
- No hardcoded colour/spacing values — use tokens
- No `var(--token, fallback)` pattern — no fallbacks in component CSS
- After all fixes, report exactly what changed, file by file, line by line

---

## Fix 1: Schema — category, assistive key, textonly fix

File: `Heading.schema.json`

**Step 1:** Change `"category": "atoms/ui"` to `"category": "atom"`

**Step 2:** Add `"assistive"` render key. Heading renders in all modes — same template. Pipeline strips visual props in textonly, `isDecorated` becomes false, plain heading renders.

**Step 3:** Change `"textonly"` from `"Heading.textonly.astro"` to `"Heading.astro"`.

Final renders block:

```json
"renders": { "full": "Heading.astro", "reduced": "Heading.astro", "assistive": "Heading.astro", "textonly": "Heading.astro" }
```

---

## Fix 2: Delete Heading.textonly.astro if it exists

Check if `Heading.textonly.astro` exists in the Heading folder. If it does, delete it. All render modes now point to `Heading.astro`. If the file doesn't exist, confirm in your report.

---

## Fix 3: Subtitle — render through Text atom

File: `Heading.astro`

**Step 1:** Add Text import alongside the existing Icon import (line 23):

```typescript
import { Icon } from '../../icons/Icon';
import { Text } from '../../ui/Text';
```

Check the actual relative path from `src/components/atoms/ui/Heading/` to `src/components/atoms/ui/Text/` and use the correct one. The import pattern should match how Icon is imported.

**Step 2:** Replace the raw `<p>` subtitle on line 164:

Change:
```html
{subtitle && <p class="heading-wrap__subtitle">{subtitle}</p>}
```

To:
```html
{subtitle && <Text as="p" size="sm" color="text-light" flush class="heading-wrap__subtitle">{subtitle}</Text>}
```

**Step 3:** In `Heading.css`, the `.heading-wrap__subtitle` rule currently sets:

```css
.heading-wrap__subtitle {
  font-family: var(--font-body);
  color: var(--brand-c-text-light);
  margin: 0;
}
```

The Text atom now handles `font-family`, `color`, and `margin` via its own props. Remove those three declarations. If no layout-specific styles remain, remove the rule entirely.

---

## Fix 4: Divider — replace hardcoded pixels with relative sizing

The divider is a vertical line next to text. Its height should match the heading's line box (font-size × line-height) and its thickness should scale with font size. Currently uses hardcoded `width: 4px` and a six-value height scale (20/32/48/64/80px). All replaced with relative units.

### 4a: Divider thickness — em-based

File: `Heading.css`

Change the divider base rule:

```css
.heading-wrap__divider {
  width: 4px;
  flex-shrink: 0;
  align-self: stretch;
}
```

To:

```css
.heading-wrap__divider {
  width: 0.15em;
  flex-shrink: 0;
  align-self: stretch;
}
```

The `em` unit inherits from the heading's font size. An h1 (48px) gets a ~7px divider. An h6 (14px) gets a ~2px divider. Scales automatically.

### 4b: Remove dividerLength classes entirely

File: `Heading.css`

Delete ALL divider length rules:

```css
/* DELETE all of these: */
.heading-wrap--divider-length-auto .heading-wrap__divider { align-self: stretch; }
.heading-wrap--divider-length-xs .heading-wrap__divider { align-self: center; height: 20px; }
.heading-wrap--divider-length-sm .heading-wrap__divider { align-self: center; height: 32px; }
.heading-wrap--divider-length-md .heading-wrap__divider { align-self: center; height: 48px; }
.heading-wrap--divider-length-lg .heading-wrap__divider { align-self: center; height: 64px; }
.heading-wrap--divider-length-xl .heading-wrap__divider { align-self: center; height: 80px; }
```

The divider height is now always `align-self: stretch` which matches the heading's line box automatically. No length prop needed.

### 4c: Update dashed/dotted divider gradient stops to em

File: `Heading.css`

Change dashed divider:

```css
.heading-wrap--divider-style-dashed .heading-wrap__divider {
  background: repeating-linear-gradient(
    to bottom, var(--brand-c-primary) 0, var(--brand-c-primary) 6px,
    transparent 6px, transparent 10px
  );
}
```

To:

```css
.heading-wrap--divider-style-dashed .heading-wrap__divider {
  background: repeating-linear-gradient(
    to bottom, var(--brand-c-primary) 0, var(--brand-c-primary) 0.25em,
    transparent 0.25em, transparent 0.4em
  );
}
```

Change dotted divider:

```css
.heading-wrap--divider-style-dotted .heading-wrap__divider {
  background: repeating-linear-gradient(
    to bottom, var(--brand-c-primary) 0, var(--brand-c-primary) 4px,
    transparent 4px, transparent 8px
  );
  border-radius: 0;
}
```

To:

```css
.heading-wrap--divider-style-dotted .heading-wrap__divider {
  background: repeating-linear-gradient(
    to bottom, var(--brand-c-primary) 0, var(--brand-c-primary) 0.15em,
    transparent 0.15em, transparent 0.35em
  );
  border-radius: 0;
}
```

---

## Fix 5: Underline — replace hardcoded pixels with relative sizing

### 5a: Make heading-wrap__content fit-content

File: `Heading.css`

Change:

```css
.heading-wrap__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
```

To:

```css
.heading-wrap__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: fit-content;
}
```

### 5b: Underline width as percentage, height as token

File: `Heading.css`

Change:

```css
.heading-wrap--variant-underline .heading-wrap__underline {
  height: 3px;
  width: 60px;
  margin-top: var(--space-sm);
  border-radius: var(--radius-full);
  background: var(--brand-c-primary);
}
```

To:

```css
.heading-wrap--variant-underline .heading-wrap__underline {
  height: var(--border-width-md);
  width: 90%;
  margin-top: var(--space-sm);
  border-radius: var(--radius-full);
  background: var(--brand-c-primary);
}
```

### 5c: Update gradient/dashed underline widths

Change:

```css
.heading-wrap--underline-gradient .heading-wrap__underline { background: var(--gradient-hero); width: 80px; }
```

To:

```css
.heading-wrap--underline-gradient .heading-wrap__underline { background: var(--gradient-hero); width: 100%; }
```

Change:

```css
.heading-wrap--underline-dashed .heading-wrap__underline {
  background: repeating-linear-gradient(
    to right, var(--brand-c-primary) 0, var(--brand-c-primary) 8px,
    transparent 8px, transparent 12px
  );
  width: 80px;
}
```

To:

```css
.heading-wrap--underline-dashed .heading-wrap__underline {
  background: repeating-linear-gradient(
    to right, var(--brand-c-primary) 0, var(--brand-c-primary) 0.35em,
    transparent 0.35em, transparent 0.55em
  );
  width: 100%;
}
```

---

## Fix 6: Highlight opacity — use token

File: `Heading.css`

First, check if `--opacity-low` already exists in the opacity token file (wherever `--opacity-medium` is defined in `src/styles/`). If not, create it:

```css
--opacity-low: 0.3;
```

Then change:

```css
.heading-wrap__highlight {
  ...
  opacity: 0.3;
```

To:

```css
.heading-wrap__highlight {
  ...
  opacity: var(--opacity-low);
```

---

## Fix 7: Schema — remove dividerLength prop, add lottieIcon

File: `Heading.schema.json`

### 7a: Remove `dividerLength` prop from visual group

Delete:

```json
"dividerLength":  { "type": "string",  "required": false, "default": "auto", "enum": ["auto","xs","sm","md","lg","xl"], "description": "Divider height." },
```

### 7b: Add `lottieIcon` to animation group

The animation group is currently empty `{}`. Replace with:

```json
"animation": {
  "_description": "Motion behaviour — stripped in reduced/assistive/textonly renders",
  "lottieIcon": { "type": "string", "required": false, "default": null, "description": "Lottie animation slug for media slot. When present, renders LottieIcon instead of static Icon. Stripped in reduced/assistive (falls back to content.icon) and textonly (no media). Only rendered when full animation props are available." }
}
```

The key insight: `icon` in the content group is the static Phosphor icon. `lottieIcon` in the animation group is the animated version. Pipeline strips animation props in reduced/assistive/textonly, so `lottieIcon` disappears and `icon` (already in content) becomes the fallback automatically. No separate `fallbackIcon` prop needed on Heading — the static icon IS the content prop.

---

## Fix 8: Heading.astro — add LottieIcon support to media slot

File: `Heading.astro`

### 8a: Add LottieIcon import

Add alongside Icon and Text imports:

```typescript
import { Icon } from '../../icons/Icon';
import { LottieIcon } from '../../icons/LottieIcon';
import { Text } from '../../ui/Text';
```

Check the actual relative path to `src/components/atoms/icons/LottieIcon/` and use the correct one.

### 8b: Add lottieIcon to Props interface

Add to the Media section (around line 54):

```typescript
// ── Media ────────────────────────────────────────────────
lottieIcon?: string;
image?: string;
icon?: string;
```

### 8c: Add lottieIcon to destructured props

Add to the destructuring (around line 88):

```typescript
lottieIcon,
image,
icon,
```

### 8d: Update isDecorated check

Change line 101:

```typescript
const isDecorated = !!(divider || image || icon || subtitle || variant !== 'default');
```

To:

```typescript
const isDecorated = !!(divider || image || icon || lottieIcon || subtitle || variant !== 'default');
```

### 8e: Update media slot rendering

The media slot currently appears twice in the template (for left and right position). In BOTH locations, update the media rendering logic.

Change (appears at ~line 147 and ~line 173):

```html
{image ? (
  <img src={image} alt="" class="heading-wrap__img" />
) : icon ? (
  <Icon name={icon} size={computedIconSize} class="heading-wrap__icon" />
) : null}
```

To:

```html
{image ? (
  <img src={image} alt="" class="heading-wrap__img" />
) : lottieIcon ? (
  <LottieIcon slug={lottieIcon} size={computedIconSize} class="heading-wrap__icon" />
) : icon ? (
  <Icon name={icon} size={computedIconSize} class="heading-wrap__icon" />
) : null}
```

Priority: image first (explicit visual), then lottieIcon (animated icon), then icon (static fallback). In reduced/assistive/textonly, `lottieIcon` prop won't be present (stripped by pipeline), so the static `icon` renders automatically.

### 8f: Update wrapperClasses — include lottieIcon in media checks

In the wrapperClasses array, everywhere that checks `(image || icon)`, add `lottieIcon`:

Change all instances of:
```typescript
(image || icon) ? 'heading-wrap--has-media' : '',
(image || icon) ? `heading-wrap--media-${mediaPosition}` : '',
(image || icon) ? `heading-wrap--media-size-${computedMediaSize}` : '',
```

To:
```typescript
(image || icon || lottieIcon) ? 'heading-wrap--has-media' : '',
(image || icon || lottieIcon) ? `heading-wrap--media-${mediaPosition}` : '',
(image || icon || lottieIcon) ? `heading-wrap--media-size-${computedMediaSize}` : '',
```

Also update the icon-specific class checks:
```typescript
icon ? `heading-wrap--icon-${iconColor}` : '',
icon ? `heading-wrap--icon-${iconStyle}` : '',
```

To:
```typescript
(icon || lottieIcon) ? `heading-wrap--icon-${iconColor}` : '',
(icon || lottieIcon) ? `heading-wrap--icon-${iconStyle}` : '',
```

### 8g: Update media position conditionals in template

Both media rendering blocks check `(image || icon) && mediaPosition === 'left'` and `(image || icon) && mediaPosition === 'right'`. Add `lottieIcon`:

Change:
```html
{(image || icon) && mediaPosition === 'left' && (
```

To:
```html
{(image || icon || lottieIcon) && mediaPosition === 'left' && (
```

Same for the right position block.

---

## Deferred — do NOT fix now

### Deferred 1: Context overrides — move to consuming components

`Heading.css` lines 139-165 contain context overrides (`.card .heading`, `nav .heading`, mega menu `.heading`). Consumers should pass props via JSON. Delete during consumer audits.

### Deferred 2: SectionTitle.astro — deprecated duplicate

SectionTitle.astro duplicates Heading's decorated mode with banned patterns. Migrate consumers to `<Heading>`, then delete.

### Deferred 3: Raw heading elements

Check how many raw `<h1>`–`<h6>` elements bypass the Heading atom. Migration task.

### Deferred 4: Heading + Text token consistency

Verify `--text-h1` through `--text-h6` and `--text-body`/`--text-small`/`--text-fine` all live in the same token file.

### Deferred 5: fit-content + alignment visual test

Verify `width: fit-content` on `.heading-wrap__content` doesn't break center-aligned or right-aligned heading wraps. Visual test needed.

---

## Audit Log Update

File: `src/components/atoms/Atom Audit Files/audit-log.md`

Add or update the Heading entry:

```
| Heading | PARTIAL | [today's date] | Fixes 1-8 applied. Schema: category → "atom", 4 render keys, dividerLength removed, lottieIcon added to animation group. Subtitle through Text atom. Divider em-based (0.15em thickness, auto height via stretch). Underline percentage-based (90%/100% of fit-content parent). Dashed/dotted stops em-based. Highlight opacity tokenized. LottieIcon support in media slot — falls back to static Icon when animation props stripped. ACCEPTED: Icon/LottieIcon imports (atom composition), icon size map (parent sizing). DEFERRED: Context overrides, SectionTitle deprecation, raw heading migration, token consistency, fit-content alignment test. |
```

Cross-atom notes:

```
- DEFERRED: Context overrides (.card .heading, nav .heading, mega menu) — delete during consumer audits.
- DEFERRED: SectionTitle.astro deprecated. Migrate consumers to <Heading>, then delete.
- DEFERRED: Visually test fit-content + alignment variants.
- ARCHITECTURE NOTE: Heading media slot priority: image → lottieIcon → icon. Pipeline strips lottieIcon in reduced/assistive/textonly, static icon auto-fallback via content prop. No separate fallbackIcon needed — content.icon IS the fallback.
- ARCHITECTURE NOTE: Divider/underline sizing is relative — em for thickness/rhythm, percentage for underline width, stretch for divider height. Pattern for all future decorative line elements.
```

---

## Post-fix checklist

1. Confirm schema `"category": "atom"`
2. Confirm schema has 4 render keys, all `"Heading.astro"`
3. Confirm schema does NOT have `dividerLength` prop
4. Confirm schema animation group has `lottieIcon` prop
5. Confirm `Heading.textonly.astro` does NOT exist
6. Confirm subtitle renders through `<Text>` atom
7. Confirm `.heading-wrap__subtitle` CSS has no font-family/color/margin
8. Confirm divider width is `0.15em` not `4px`
9. Confirm NO divider length height classes exist
10. Confirm dashed/dotted gradient stops use `em` not `px`
11. Confirm `heading-wrap__content` has `width: fit-content`
12. Confirm underline width is `90%` not `60px`
13. Confirm gradient underline width is `100%` not `80px`
14. Confirm dashed underline width is `100%` and gradient stops use `em`
15. Confirm underline height is `var(--border-width-md)` not `3px`
16. Confirm highlight opacity is `var(--opacity-low)` not `0.3`
17. Confirm `--opacity-low` exists in token file
18. Confirm `Heading.astro` imports LottieIcon
19. Confirm `lottieIcon` in Props interface, destructuring, isDecorated check
20. Confirm media slot renders LottieIcon when `lottieIcon` present, Icon when only `icon` present
21. Confirm ALL `(image || icon)` checks now include `lottieIcon`
22. Confirm audit-log.md updated

---

## Files to modify

- `src/components/atoms/ui/Heading/Heading.schema.json` (fixes 1, 7)
- `src/components/atoms/ui/Heading/Heading.astro` (fixes 3, 8)
- `src/components/atoms/ui/Heading/Heading.css` (fixes 3, 4, 5, 6)
- Token file where `--opacity-medium` is defined (fix 6 — add `--opacity-low`)
- `src/components/atoms/Atom Audit Files/audit-log.md` (update)

Confirm non-existence:
- `src/components/atoms/ui/Heading/Heading.textonly.astro` (should not exist)

No other files should be modified.
