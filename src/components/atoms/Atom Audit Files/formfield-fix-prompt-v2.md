# FormField Atom — Fix Prompt (Updated)

Run these fixes against `src/components/atoms/form/FormField/`.
Read each file fully before making changes.

Split into three Claude Code sessions:
- Session 1: Fixes 1-5 (schema, @layer, Text atom, dark theme extraction, legacy utilities)
- Session 2: Fixes 6-10 (a11y extraction, render mode rules, index.ts, select arrow, responsive tokens)
- Session 3: Fix 11 (card-select type — new feature)

---

## Decisions (confirmed)

| # | Decision | Outcome |
|---|----------|---------|
| D1 | Folder structure | Move files into `atoms/form/FormField/` subfolder |
| D2 | Internal token px values | Acceptable — internal custom properties swapped by contrast variant |
| D3 | Responsive px overrides | Fix — override the token (`--_field-control-size: 18px`) not the property directly |
| D4 | Form control state transitions | Accept — colour/state feedback, same exemption as Button/Link. Kill in reduced render. |
| D5 | .text class on outer div | Remove — label/desc/error wrap through Text atom, native inputs inherit from page body |
| D6 | outline: none + forced-colours | Add `outline: 2px solid transparent` alongside box-shadow for Windows High Contrast Mode |
| D7 | Raw spans for text elements | Wrap label-text, description, error in Text atom. Raw `<input>` stays raw — FormField IS the atom. |
| D8 | Select chevron SVG | Accept as-is with comment — CSS custom properties don't work in data URIs |

---

## Fix 1: Move files into subfolder

Move all FormField files from `src/components/atoms/form/` into `src/components/atoms/form/FormField/`:
- FormField.astro
- FormField.css
- FormField.responsive.css
- FormField.schema.json
- FormField.a11y.css (will be moved to _reference/ after extraction)
- FormField.a11y.recovery.css (same)
- index.ts

Update any consumer imports that reference the old path.

---

## Fix 2: Schema restructure — FormField.schema.json

Replace the entire file:

```json
{
  "component": "FormField",
  "category": "atom",
  "renders": {
    "full": "FormField.astro",
    "reduced": "FormField.astro",
    "assistive": "FormField.astro",
    "textonly": "FormField.astro"
  },
  "notes": "The only atom allowed raw <input>, <select>, <textarea> elements. Label, description, and error render through Text atom. Native HTML controls for AT/AAC compatibility. Card-select type renders choices as pictogram cards at lower cognitive levels — aacResolver maps option words to OpenAAC symbols at build time.",

  "props": {
    "content": {
      "_description": "What the field asks and how it identifies itself",
      "id":          { "type": "string",  "required": true, "description": "Element ID — also generates aria-describedby IDs." },
      "name":        { "type": "string",  "required": false, "default": null, "description": "Form field name. Defaults to id if omitted." },
      "label":       { "type": "string",  "required": true, "description": "Visible label text." },
      "type":        { "type": "string",  "required": false, "default": "text", "enum": ["text", "email", "textarea", "checkbox", "radio", "toggle", "search", "select", "number", "tel", "url", "password", "card-select"], "description": "Input type. card-select renders options as tappable pictogram/text cards." },
      "placeholder": { "type": "string",  "required": false, "default": null, "description": "Placeholder text." },
      "required":    { "type": "boolean", "required": false, "default": false, "description": "Required field." },
      "disabled":    { "type": "boolean", "required": false, "default": false, "description": "Disabled state." },
      "error":       { "type": "string",  "required": false, "default": null, "description": "Error message — linked via aria-describedby." },
      "description": { "type": "string",  "required": false, "default": null, "description": "Help text — linked via aria-describedby." },
      "value":       { "type": "string",  "required": false, "default": null, "description": "Current value." },
      "checked":     { "type": "boolean", "required": false, "default": false, "description": "Checked state for checkbox/radio/toggle." },
      "rows":        { "type": "number",  "required": false, "default": 3, "description": "Textarea rows." },
      "min":         { "type": "number",  "required": false, "default": null, "description": "Number/range min." },
      "max":         { "type": "number",  "required": false, "default": null, "description": "Number/range max." },
      "step":        { "type": "number",  "required": false, "default": null, "description": "Number/range step." },
      "options":     { "type": "array",   "required": false, "default": [], "description": "Options for select or card-select. Select: [{value, label}]. Card-select: [{value, label, symbol?, simple?}] where symbol is aacResolver keyword." },
      "radioValue":  { "type": "string",  "required": false, "default": null, "description": "Value for radio inputs." },
      "hideLabel":   { "type": "boolean", "required": false, "default": false, "description": "Visually hide label (still accessible via sr-only)." },
      "maxSelections": { "type": "number", "required": false, "default": 1, "description": "Card-select: max number of selections. 1 = radio behaviour. >1 = checkbox behaviour." }
    },

    "visual": {
      "_description": "How the field looks",
      "variant":    { "type": "string",  "required": false, "default": "primary", "enum": ["primary", "secondary", "neutral"], "description": "Colour variant." },
      "contrast":   { "type": "string",  "required": false, "default": "normal", "enum": ["normal", "high"], "description": "Border contrast. High = darker borders, larger controls." },
      "fieldStyle": { "type": "string",  "required": false, "default": "outlined", "enum": ["outlined", "filled", "underlined", "glass", "neumorphic", "glow"], "description": "Visual style." },
      "cardSize":   { "type": "string",  "required": false, "default": "md", "enum": ["sm", "md", "lg"], "description": "Card-select: card size." },
      "cardColumns": { "type": "number", "required": false, "default": 3, "description": "Card-select: grid columns in full render. Assistive forces 1 column." },
      "class":      { "type": "string",  "required": false, "default": "", "description": "Additional CSS classes." }
    },

    "animation": {}
  }
}
```

---

## Fix 3: Remove @layer wrappers — FormField.css + FormField.responsive.css

Remove `@layer components {` wrapper and closing `}` from both files.

---

## Fix 4: Astro — Text atom wrapping, remove 'text' class

**4a.** Add imports at top of frontmatter:
```astro
import { Text } from '../../ui/Text';
import { Button } from '../../ui/Button';
import { Image } from '../../images/Image';
```

Button and Image imports are for the card-select feature (Fix 11).

**4b.** Remove `'text'` from groupClasses (line 93). Change:
```javascript
'text',       /* base typography from Text atom — sets font, color, line-height */
'form-field',
```
To:
```javascript
'form-field',
```

**4c.** Wrap label text in Text atom. Change line 172:
```astro
{label}
```
To:
```astro
<Text as="span" flush>{label}</Text>
```

**4d.** Wrap description in Text atom. Change line 178:
```astro
<span class="form-field__desc" id={`${id}-desc`}>{description}</span>
```
To:
```astro
<Text as="span" class="form-field__desc" id={`${id}-desc`} size="sm" flush>{description}</Text>
```

**4e.** Wrap error message in Text atom. Change line 237:
```astro
<span class="form-field__error" id={`${id}-error`} role="alert">{error}</span>
```
To:
```astro
<Text as="span" class="form-field__error" id={`${id}-error`} role="alert" size="sm" flush>{error}</Text>
```

**4f.** Wrap checkbox/radio/toggle label text. Change all three instances of:
```astro
<span class="form-field__label-text">{label}</span>
```
To:
```astro
<Text as="span" class="form-field__label-text" flush>{label}</Text>
```
3 instances — checkbox (line 124), radio (line 142), toggle (line 163).

**4g.** Add `outline: 2px solid transparent` to focus styles — forced-colours fix. This goes in CSS (Fix 9), not Astro.

**4h.** Update doc comment — remove reference to `.text` class and `FormField.a11y.css`.

---

## Fix 5: Dark theme selectors — extract from FormField.css

Lines 85-117 contain `.a11y-theme-dark` and `.a11y-theme-high-contrast` selectors.

Extract to `src/styles/zones/theme-luminance-dark.css`. Adapt selectors to match existing pattern in that file.

Delete lines 85-117 from FormField.css after extraction (including the TODO comment).

---

## Fix 6: Legacy form utilities — delete from FormField.css

Lines 495-539 contain `.form-group`, `.form-label`, `.form-input`, `.form-textarea`, `.form-select`, `.form-error` classes. Legacy global selectors. Delete entirely. Log consumer migration note.

---

## Fix 7: a11y.css extraction — FormField.a11y.css

### Render-mode rules to ADD to FormField.css:

```css
/* ================================================================
   RENDER MODE OVERRIDES
   ================================================================ */

/* ── Reduced — all transitions instant, strip effects, enlarge controls ── */

[data-render="reduced"] .form-field {
  --_field-border: var(--brand-c-text);
  --_field-control-size: 28px;
  --_field-toggle-w: 52px;
  --_field-toggle-h: 28px;
  --_field-thumb-size: 20px;
}

[data-render="reduced"] .form-field__input { transition: none; }
[data-render="reduced"] .form-field__checkmark { transition: none; }
[data-render="reduced"] .form-field__radio-indicator { transition: none; }
[data-render="reduced"] .form-field__toggle-track { transition: none; }
[data-render="reduced"] .form-field__toggle-thumb { transition: none; }

[data-render="reduced"] .form-field--glass .form-field__input {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: var(--brand-c-bg);
  border: 2px solid var(--_field-border);
  box-shadow: none;
}

[data-render="reduced"] .form-field--neumorphic .form-field__input {
  box-shadow: none;
  border: 2px solid var(--_field-border);
}

[data-render="reduced"] .form-field--glow .form-field__input:focus {
  box-shadow: none;
}

/* ── Assistive — enlarged controls, thick focus, generous spacing ── */

[data-render="assistive"] .form-field {
  --_field-control-size: 32px;
  --_field-toggle-w: 60px;
  --_field-toggle-h: 32px;
  --_field-thumb-size: 24px;
  gap: var(--space-sm);
}

[data-render="assistive"] .form-field__input {
  min-height: 64px;
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-body);
}

[data-render="assistive"] .form-field__input:focus {
  outline: 3px solid var(--_field-brand);
  outline-offset: 2px;
}

[data-render="assistive"] .form-field__checkmark,
[data-render="assistive"] .form-field__radio-indicator {
  min-width: 32px;
  min-height: 32px;
}

[data-render="assistive"] .form-field__checkbox-wrap,
[data-render="assistive"] .form-field__radio-wrap,
[data-render="assistive"] .form-field__toggle-wrap {
  gap: var(--space-md);
  padding: var(--space-sm) 0;
}

/* ── Textonly — native controls, no custom widgets ── */

[data-render="textonly"] .form-field__input {
  background: color-mix(in oklch, var(--brand-c-text-dark) 6%, transparent);
  border: none;
  border-bottom: 2px solid var(--brand-c-text);
  border-radius: 0;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

[data-render="textonly"] .form-field__input:focus {
  box-shadow: none;
  background: color-mix(in oklch, var(--_field-brand) 8%, transparent);
  border-bottom-color: var(--_field-brand-dark);
  outline: 2px solid var(--_field-brand-dark);
  outline-offset: 2px;
}

[data-render="textonly"] .form-field__checkmark { display: none; }
[data-render="textonly"] .form-field__checkbox {
  position: static;
  opacity: 1;
  width: 24px;
  height: 24px;
  accent-color: var(--_field-brand);
}

[data-render="textonly"] .form-field__radio-indicator { display: none; }
[data-render="textonly"] .form-field__radio {
  position: static;
  opacity: 1;
  width: 24px;
  height: 24px;
  accent-color: var(--_field-brand);
}

[data-render="textonly"] .form-field__toggle-track { display: none; }
[data-render="textonly"] .form-field__toggle {
  position: static;
  opacity: 1;
  width: 24px;
  height: 24px;
  accent-color: var(--_field-brand);
}
```

### Extract to high-contrast.css:
```css
[data-high-contrast] .form-field {
  --_field-border: var(--brand-c-text);
  --_field-control-size: 28px;
  --_field-toggle-w: 52px;
  --_field-toggle-h: 28px;
  --_field-thumb-size: 20px;
}

[data-high-contrast] .form-field__toggle-track {
  border: 2px solid var(--_field-border);
}

[data-high-contrast] .form-field--glass .form-field__input {
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  background: var(--brand-c-bg);
  border: 2px solid var(--_field-border);
  box-shadow: none;
}

[data-high-contrast] .form-field--neumorphic .form-field__input {
  box-shadow: none;
  border: 2px solid var(--_field-border);
}

[data-high-contrast] .form-field--glow .form-field__input:focus {
  box-shadow: none;
  outline: 2px solid var(--_field-brand);
  outline-offset: 2px;
}
```

### Extract to highlight-links.css:
```css
[data-highlight-links] .form-field a {
  text-decoration: underline;
  text-underline-offset: 2px;
}
```

### After extraction:
- Move FormField.a11y.css to `_reference/FormField/FormField.a11y.css`
- Move FormField.a11y.recovery.css to `_reference/FormField/FormField.a11y.recovery.css`

---

## Fix 8: index.ts cleanup

```ts
import './FormField.css';
import './FormField.responsive.css';

export { default as FormField } from './FormField.astro';
export { default as schema } from './FormField.schema.json';
```

Remove `import './FormField.a11y.css'`.

---

## Fix 9: CSS fixes — FormField.css

**9a.** Forced-colours fix. Add `outline: 2px solid transparent` to base input focus. Change line 157-161:
```css
.form-field__input:focus {
  outline: 2px solid transparent; /* visible in Windows High Contrast / forced-colours mode */
  border-color: var(--_field-brand);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--_field-brand) 15%, transparent);
}
```

**9b.** Select arrow comment. Add above line 178:
```css
/* Select arrow — hardcoded fill colour in data URI SVG.
   CSS custom properties don't work inside url() data URIs.
   #6b6b6b is mid-grey, works on light and dark backgrounds.
   Dark theme should override entire background-image if needed. */
```

**9c.** Update doc comment — remove `@layer components` reference, `.text` class reference, add AAC/card-select note.

**9d.** Remove `.form-field__label-text` typography rules if only `color: var(--brand-c-text)` — Text atom handles this now. Keep layout properties only.

---

## Fix 10: Responsive token fix — FormField.responsive.css

**10a.** Remove `@layer components` wrapper.

**10b.** At 350px breakpoint, change checkmark hardcoded px to token override:
```css
@media (max-width: 350px) {
  .form-field {
    --_field-control-size: 18px;
  }
  
  /* Below token scale floor — pixel-precise tick positioning at small control size */
  .form-field__checkmark::after {
    left: 5px;
    top: 2px;
    width: 4px;
    height: 8px;
  }
}
```

Delete the separate `.form-field__checkmark { width: 18px; height: 18px; }` rule — the token override handles it.

**10c.** At 200px breakpoint, same pattern:
```css
@media (max-width: 200px) {
  .form-field {
    --_field-control-size: 16px;
  }
  
  .form-field__input {
    padding: 4px 6px; /* Below token scale floor */
    border-width: 1px;
  }

  .form-field__input--textarea {
    min-height: 40px;
  }
}
```

Delete the separate `.form-field__checkmark { width: 16px; height: 16px; }` rule.

---

## Fix 11: Card-select type — NEW FEATURE

### 11a. Astro — add card-select detection and rendering

Add to frontmatter after existing type checks:
```typescript
const isCardSelect = type === 'card-select';
const isSingleSelect = (maxSelections ?? 1) === 1;
```

Add `maxSelections` to Props interface and destructuring:
```typescript
maxSelections?: number;
cardSize?: 'sm' | 'md' | 'lg';
cardColumns?: number;
```

Add to destructuring:
```typescript
maxSelections = 1,
cardSize = 'md',
cardColumns = 3,
```

Add `isCardSelect` to groupClasses:
```javascript
isCardSelect && 'form-field--card-select',
isCardSelect && `form-field--card-cols-${cardColumns}`,
isCardSelect && `form-field--card-size-${cardSize}`,
```

### 11b. Astro — card-select rendering block

Add after the select rendering block (before the standard input block), inside the Fragment:

```astro
{/* Card-select — pictogram/text cards for reflective inputs */}
{isCardSelect && (
  <div class="form-field__card-grid" role="group" aria-labelledby={`${id}-label`}>
    {options.map((opt, i) => {
      const cardId = `${id}-card-${i}`;
      const inputType = isSingleSelect ? 'radio' : 'checkbox';
      return (
        <label class="form-field__card" for={cardId}>
          <input
            type={inputType}
            id={cardId}
            name={fieldName}
            value={opt.value}
            checked={isSingleSelect ? value === opt.value : false}
            class="form-field__card-input"
            aria-describedby={describedBy}
          />
          <span class="form-field__card-face" aria-hidden="true">
            {opt.symbol && (
              <Image
                src={`/api/aac/symbol/${opt.symbol}`}
                alt=""
                class="form-field__card-symbol"
                semanticRole="decorative"
              />
            )}
            <Text as="span" class="form-field__card-label" flush>
              {opt.simple || opt.label}
            </Text>
          </span>
        </label>
      );
    })}
  </div>
)}
```

Notes:
- Hidden native radio/checkbox behind each card — accessible to AT, handles form submission
- `opt.symbol` is the aacResolver keyword — at build time, resolves to OpenAAC pictogram URL
- If `opt.symbol` is absent, card shows text only (works at higher cognitive levels)
- `opt.simple` is the simplified label for lower cognitive levels, falls back to `opt.label`
- The `<label>` wrapping means clicking anywhere on the card checks the hidden input
- Image src path `/api/aac/symbol/${opt.symbol}` goes through your asset API — same pipeline as alt text pictograms

### 11c. CSS — card-select styles

Add to FormField.css:

```css
/* ==========================================================
   CARD-SELECT — tappable pictogram/text cards
   For reflective inputs (emotions, ratings, choices).
   Hidden radio/checkbox provides native form behaviour.
   ========================================================== */

.form-field__card-grid {
  display: grid;
  gap: var(--space-md);
}

/* Column variants */
.form-field--card-cols-2 .form-field__card-grid { grid-template-columns: repeat(2, 1fr); }
.form-field--card-cols-3 .form-field__card-grid { grid-template-columns: repeat(3, 1fr); }
.form-field--card-cols-4 .form-field__card-grid { grid-template-columns: repeat(4, 1fr); }

.form-field__card {
  cursor: pointer;
  user-select: none;
}

/* Hidden native input */
.form-field__card-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* Visual card face */
.form-field__card-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border: var(--border-width-2) solid var(--_field-border);
  border-radius: var(--radius-lg);
  background: var(--brand-c-bg);
  text-align: center;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);
}

/* Hover */
.form-field__card-face:hover {
  border-color: var(--_field-brand);
  background: var(--_field-brand-light);
}

/* Selected state */
.form-field__card-input:checked + .form-field__card-face {
  border-color: var(--_field-brand);
  background: var(--_field-brand-light);
  box-shadow: 0 0 0 2px var(--_field-brand);
}

/* Focus visible on card */
.form-field__card-input:focus-visible + .form-field__card-face {
  outline: 2px solid var(--_field-brand);
  outline-offset: 2px;
}

/* Disabled */
.form-field__card-input:disabled + .form-field__card-face {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Symbol image */
.form-field__card-symbol {
  width: 3em;
  height: 3em;
  object-fit: contain;
}

/* Card sizes */
.form-field--card-size-sm .form-field__card-face { padding: var(--space-md); }
.form-field--card-size-sm .form-field__card-symbol { width: 2em; height: 2em; }

.form-field--card-size-lg .form-field__card-face { padding: var(--space-xl); }
.form-field--card-size-lg .form-field__card-symbol { width: 4em; height: 4em; }
```

### 11d. CSS — card-select render mode overrides

Add to the render mode section:

```css
/* ── Reduced — card-select instant transitions ── */
[data-render="reduced"] .form-field__card-face { transition: none; }

/* ── Assistive — single column, large cards ── */
[data-render="assistive"] .form-field__card-grid {
  grid-template-columns: 1fr;
}

[data-render="assistive"] .form-field__card-face {
  padding: var(--space-xl);
  min-height: 64px;
  flex-direction: row;
  gap: var(--space-lg);
}

[data-render="assistive"] .form-field__card-symbol {
  width: 3em;
  height: 3em;
}

[data-render="assistive"] .form-field__card-input:focus-visible + .form-field__card-face {
  outline-width: 3px;
}

/* ── Textonly — plain radio/checkbox list, no cards ── */
[data-render="textonly"] .form-field__card-face {
  flex-direction: row;
  padding: var(--space-sm);
  border: none;
  border-radius: 0;
  background: transparent;
  gap: var(--space-sm);
}

[data-render="textonly"] .form-field__card-symbol {
  display: none;
}

[data-render="textonly"] .form-field__card-input {
  position: static;
  opacity: 1;
  width: 24px;
  height: 24px;
  accent-color: var(--_field-brand);
}
```

### 11e. Responsive — card-select

Add to FormField.responsive.css:

```css
/* Card-select responsive */
@media (max-width: 480px) {
  .form-field--card-cols-4 .form-field__card-grid { grid-template-columns: repeat(2, 1fr); }
  .form-field--card-cols-3 .form-field__card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 280px) {
  .form-field__card-grid { grid-template-columns: 1fr; }
  .form-field__card-face { padding: var(--space-md); }
  .form-field__card-symbol { width: 2em; height: 2em; }
}
```

---

## Post-fix verification

1. `grep -r "atoms/form" FormField.schema.json` returns 0 matches (category is "atom")
2. `grep -r "@layer" FormField.css FormField.responsive.css` returns 0 matches
3. `grep -r "'text'" FormField.astro` returns 0 matches
4. `grep -r "a11y-theme-dark\|a11y-theme-high-contrast" FormField.css` returns 0 matches
5. `grep -r "form-group\|\.form-label\b\|\.form-input\b\|\.form-textarea\b\|\.form-select\b\|\.form-error\b" FormField.css` — 0 matches for legacy classes (only `.form-field__*` prefixed)
6. `grep -r "FormField.a11y.css" index.ts` returns 0 matches
7. Schema has "card-select" in type enum and maxSelections prop
8. FormField.css has `.form-field__card-grid` and card-select render mode rules
9. `[data-render]` rules present for reduced, assistive, textonly
10. FormField files are in `atoms/form/FormField/` subfolder
11. high-contrast.css and highlight-links.css have FormField rules appended
12. `outline: 2px solid transparent` on `.form-field__input:focus`

---

## Cross-atom notes (for audit-log.md)

```
- ARCHITECTURE: FormField is the ONLY atom allowed raw <input>, <select>, <textarea>.
- ARCHITECTURE: card-select type renders choices as pictogram cards. Hidden native radio/checkbox behind each card for AT compatibility and form submission. Symbol images resolved by aacResolver at build time — same resolver used for Image alt text pictograms.
- ARCHITECTURE: AAC devices send standard browser events. Platform displays content accessibly, device handles input composition. No custom AAC input handling needed.
- ARCHITECTURE: Textonly render shows native browser controls. Card-select in textonly becomes a plain radio/checkbox list with text labels, no pictograms.
- ARCHITECTURE: Assistive render forces single-column card grid, 64px minimum targets, 3px focus outlines.
- ARCHITECTURE: All form transitions are state feedback (focus, checked, toggle). Killed in reduced render. No animation props needed.
- ARCHITECTURE: aacResolver maps option symbol keywords to OpenAAC pictograms at build time. Library grows naturally as AI generates new content with new emotion/concept words. Current library has ~8 emotions, grows with use.
- EXTRACTED: Dark theme rules → theme-luminance-dark.css. High contrast → high-contrast.css. Highlight-links → highlight-links.css.
- DELETED: Legacy form utilities (.form-group, .form-label etc.) — pre-atom global.css selectors.
- FIXED: Responsive checkmark sizes now override --_field-control-size token instead of bypassing it.
- FIXED: outline: 2px solid transparent added to input focus for Windows High Contrast / forced-colours mode compatibility.
- DEFERRED: Save-draft behaviour for AAC users composing long textarea responses.
- DEFERRED: Input tolerance testing — verify no paste blocking, no keystroke validation.
- MIGRATION: Consumers using legacy .form-group/.form-label classes need migrating to FormField atom.
- MIGRATION: Files moved from atoms/form/ to atoms/form/FormField/ — update consumer imports.
```
