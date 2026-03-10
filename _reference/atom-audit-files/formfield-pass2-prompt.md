# FormField — Pass 2 Audit Prompt

## Context

FormField has been through pass 1 (file rename, fallback stripping, Text atom composition, variant colour restoration, contrast prop removal, dark mode selector migration). This pass consolidates internal tokens so the JSON pipeline's inline style overrides reach every consumption point.

## How the pipeline works

Pipeline reads schema → resolves colour value (author's pick or schema default) → generates inline style:

```html
<div class="form-field form-field--secondary form-field--glass"
     style="--field-focus: var(--rainbow-3-dark); --field-bg: var(--glass-bg-light);">
```

CSS picks it up via the internal token chain:

```css
--_field-brand: var(--field-focus, var(--brand-c-secondary));
                     ↑ inline wins        ↑ class default
```

Variant classes (primary/secondary/neutral) are permanent — they set the colour default via the bridge fallback. Pipeline layers on top via inline style when the author overrides. Structural variants (glass/neumorphic/glow) always need the class.

## Files

- `src/components/atoms/FormField/FormField.css`
- `src/components/atoms/FormField/FormField.astro`
- `src/components/atoms/FormField/FormField.schema.json`
- `src/components/atoms/FormField/FormField.responsive.css`

## Rules

- Do NOT silently change or add to agreed architecture rules
- Do NOT remove variant classes, bridge fallbacks, or any props
- Do NOT add `!important`, `@layer`, `.a11y-*`, `#a11y-content-wrapper`, scoped `<style>`, `:global()`
- Do NOT invent new tokens — if one doesn't exist, flag it
- If something looks wrong, ask — don't fix
- Admit if you haven't fully read a file

---

## Task 1: Add missing internal tokens to base `.form-field`

The schema declares 10 colour keys. The CSS only has 4 internal tokens. Add the remaining 6 to the base `.form-field` block, after the existing `--_field-border` line:

```css
/* Add these after --_field-border */
--_field-bg: var(--field-bg, var(--page-bg-raised));
--_field-text: var(--field-text, var(--brand-c-text));
--_field-label: var(--field-label, var(--brand-c-text));
--_field-placeholder: var(--field-placeholder, var(--brand-c-text-light));
--_field-error: var(--field-error, var(--color-Error));
--_field-control-mark: var(--field-control-mark, var(--color-White));
```

Then replace every raw bridge chain with the internal token throughout the file. The value doesn't change — you're just routing through the internal token so the pipeline inline style reaches every consumption point.

### Replacements

| Find (raw bridge) | Replace (internal token) |
|---|---|
| `var(--field-bg, var(--page-bg-raised))` | `var(--_field-bg)` |
| `var(--field-text, var(--brand-c-text))` | `var(--_field-text)` |
| `var(--field-label, var(--brand-c-text))` | `var(--_field-label)` |
| `var(--field-placeholder, var(--brand-c-text-light))` | `var(--_field-placeholder)` |
| `var(--field-error, var(--color-Error))` | `var(--_field-error)` |
| `var(--field-control-mark, var(--color-White))` | `var(--_field-control-mark)` |

**Important:** The `color-mix()` functions that reference these should also route through internal tokens. Example:

```css
/* Before */
background: color-mix(in oklch, var(--field-bg, var(--page-bg-raised)) 90%, var(--field-border, var(--brand-c-neutral-light)));

/* After */
background: color-mix(in oklch, var(--_field-bg) 90%, var(--_field-border));
```

---

## Task 2: Add glass internal tokens

Add to base `.form-field` block (after the colour tokens):

```css
/* Glass tokens */
--_field-glass-bg: var(--field-glass-bg, var(--glass-bg));
--_field-glass-blur: var(--field-glass-blur, var(--glass-blur));
--_field-glass-border: var(--field-glass-border, var(--glass-border));
```

Then update `.form-field--glass`:

| Find | Replace |
|---|---|
| `var(--field-glass-bg, var(--glass-bg))` | `var(--_field-glass-bg)` |
| `var(--field-glass-blur, var(--glass-blur))` | `var(--_field-glass-blur)` |
| `var(--field-glass-border, var(--glass-border))` | `var(--_field-glass-border)` |

---

## Task 3: Add shadow internal token

Add to base `.form-field` block:

```css
--_field-shadow: var(--field-shadow, var(--shadow-neu-raised));
```

Replace all `var(--field-shadow, var(--shadow-neu-raised))` with `var(--_field-shadow)`.

---

## Task 4: Delete redundant `--_field-border` in reduced render

In the `[data-render="reduced"] .form-field` block (~line 529), delete this line:

```css
--_field-border: var(--field-border, var(--brand-c-neutral-light));
```

This is identical to the base value. Keep the control size overrides in that block.

---

## Task 5: `border-radius: 999px` → token

On `.form-field__toggle-track` (~line 369), replace:

```css
border-radius: 999px;
```

With:

```css
border-radius: var(--radius-full);
```

---

## Task 6: Textonly render — use internal tokens

In the `[data-render="textonly"]` section:

Line ~618:
```css
/* Before */
background: color-mix(in oklch, var(--field-text, var(--brand-c-text)) 6%, transparent);
/* After */
background: color-mix(in oklch, var(--_field-text) 6%, transparent);
```

Line ~620:
```css
/* Before */
border-bottom: 2px solid var(--field-border, var(--brand-c-neutral-light));
/* After */
border-bottom: 2px solid var(--_field-border);
```

---

## Task 7: Switch to `class:list` in FormField.astro

Replace lines ~97–114 (the manual class building):

```astro
const groupClasses = [
  'form-field',
  isCheckbox && 'form-field--checkbox',
  isRadio && 'form-field--radio',
  isToggle && 'form-field--toggle',
  error && 'form-field--error',
  disabled && 'form-field--disabled',
  variant !== 'primary' && `form-field--${variant}`,
  fieldStyle !== 'outlined' && `form-field--${fieldStyle}`,
  isCardSelect && 'form-field--card-select',
  isCardSelect && `form-field--card-cols-${cardColumns}`,
  isCardSelect && `form-field--card-size-${cardSize}`,
  className,
].filter(Boolean).join(' ');
---

<div class={groupClasses}>
```

With Astro's `class:list`:

```astro
---

<div class:list={[
  'form-field',
  isCheckbox && 'form-field--checkbox',
  isRadio && 'form-field--radio',
  isToggle && 'form-field--toggle',
  error && 'form-field--error',
  disabled && 'form-field--disabled',
  variant !== 'primary' && `form-field--${variant}`,
  fieldStyle !== 'outlined' && `form-field--${fieldStyle}`,
  isCardSelect && 'form-field--card-select',
  isCardSelect && `form-field--card-cols-${cardColumns}`,
  isCardSelect && `form-field--card-size-${cardSize}`,
  className,
]}>
```

Delete the `groupClasses` const.

---

## Task 8: Add `fieldStyle` render note to schema

In `FormField.schema.json`, update the `fieldStyle` description to:

```json
"description": "Visual style. In reduced/assistive/textonly renders, glass/neumorphic/glow revert to outlined appearance via CSS overrides."
```

---

## Documented exceptions — DO NOT CHANGE

- `opacity: 0.6` on placeholder — no token exists
- Select arrow SVG `#6b6b6b` — CSS vars don't work in data URIs
- `24px` native controls in textonly — consistent sizing across input types
- Hardcoded control geometry (`22px` base, tick positioning calc values) — drawing dimensions
- `margin-left: 2px` on required asterisk — micro-spacing
- `min-height` values on textarea — content sizing
- `min-height: 64px` in assistive render — touch target minimum
- Responsive tick positioning at 350px breakpoint — below token scale floor
- `padding: 4px 6px` at 200px responsive breakpoint — below token scale floor

---

## Verification

After all changes, grep to confirm no raw bridge chains remain outside the base token block:

```bash
grep -n "var(--field-bg, var(--page-bg-raised))" FormField.css
grep -n "var(--field-text, var(--brand-c-text))" FormField.css
grep -n "var(--field-label, var(--brand-c-text))" FormField.css
grep -n "var(--field-placeholder, var(--brand-c-text-light))" FormField.css
grep -n "var(--field-error, var(--color-Error))" FormField.css
grep -n "var(--field-control-mark, var(--color-White))" FormField.css
grep -n "var(--field-glass-bg, var(--glass-bg))" FormField.css
grep -n "var(--field-glass-blur, var(--glass-blur))" FormField.css
grep -n "var(--field-glass-border, var(--glass-border))" FormField.css
grep -n "var(--field-shadow, var(--shadow-neu-raised))" FormField.css
grep -n "border-radius: 999px" FormField.css
```

Each should return 0 results (or exactly 1 in the base token block for the bridge definition). The internal `--_field-*` versions should be used everywhere else.
