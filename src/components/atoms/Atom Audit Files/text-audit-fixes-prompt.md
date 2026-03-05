# Text Atom — v2 Audit Fixes

Do NOT make any changes beyond what is listed here. If something looks wrong or ambiguous, stop and ask.

**Important rules:**
- Never silently change or add to what's specified below
- No hardcoded colour/spacing values — use tokens
- No `var(--token, fallback)` pattern — no fallbacks in component CSS
- After all fixes, report exactly what changed, file by file, line by line

---

## Fix 1: Schema — category, assistive key, textonly fix

File: `src/components/atoms/ui/Text/Text.schema.json`

**Step 1:** Change `"category": "atoms/ui"` to `"category": "atom"`

**Step 2:** Replace the `"renders"` block with all 4 keys pointing to `Text.astro`:

```json
"renders": { "full": "Text.astro", "reduced": "Text.astro", "assistive": "Text.astro", "textonly": "Text.astro" },
```

Text is content — it renders in all four modes. Same template, pipeline strips visual props in textonly. No separate template files needed. `Text.textonly.astro` does not exist (was a ghost reference).

---

## Fix 2: Astro — remove stale comment reference

File: `src/components/atoms/ui/Text/Text.astro`

Line 10 currently reads:

```
 * Styles: Text.css | Text.responsive.css | Text.a11y.css
```

Change to:

```
 * Styles: Text.css | Text.responsive.css
```

`Text.a11y.css` does not exist — stale reference from before extraction. Remove only this reference. Do not change anything else in the comment block.

---

## Fix 3: CSS — strip font-family fallbacks

File: `src/components/atoms/ui/Text/Text.css`

Line 80, change:

```css
.text--family-body-alt    { font-family: var(--font-body-alt, var(--font-body)); }
```

To:

```css
.text--family-body-alt    { font-family: var(--font-body-alt); }
```

Line 81, change:

```css
.text--family-handwriting { font-family: var(--font-handwriting, var(--font-body)); }
```

To:

```css
.text--family-handwriting { font-family: var(--font-handwriting); }
```

`--font-body-alt` and `--font-handwriting` are not defined anywhere in `src/styles/`. The fallbacks are hiding broken token references. Strip them so missing tokens fail visibly.

---

## Fix 4: CSS — delete context overrides

File: `src/components/atoms/ui/Text/Text.css`

Delete the entire "CONTEXT OVERRIDES" section (lines 152–168):

```css
/* ================================================================
   CONTEXT OVERRIDES
   When .text sits inside specific containers, it adjusts
   automatically. Values taken directly from global.css.
   ================================================================ */

/* Cards — compact text */
.card .text {
  font-size: var(--text-small);           /* 14px */
  line-height: var(--leading-normal);     /* 1.5 */
}

/* Navigation — smaller text */
nav .text {
  font-size: var(--text-small);           /* 14px */
  line-height: var(--leading-snug);       /* 1.375 */
}
```

Text should not detect its parent context. These are redundant — consumers pass `size="sm"` (cards) or `size="sm" leading="snug"` (nav) as props to their Text children. The JSON content describes how text looks, same as everything else.

---

## Fix 5: Token + CSS — tokenize blockquote border width

**Step 1:** File: `src/styles/tokens/spacing.css`

After `--border-width-md: 3px;` (line 79), add:

```css
  --border-width-lg: 6px;
```

**Step 2:** File: `src/components/atoms/ui/Text/Text.css`

In `blockquote.text`, line 140, change:

```css
  border-left: 6px solid var(--brand-c-primary);
```

To:

```css
  border-left: var(--border-width-lg) solid var(--brand-c-primary);
```

6px is a design decision, not a universal hairline. Tokenize it.

---

## Deferred — do NOT fix now

### Deferred 1: Missing font tokens

`--font-body-alt` and `--font-handwriting` are not defined in `src/styles/`. Fix 3 stripped the fallbacks to make this visible. Every brand must define these tokens. Until then, `family="body-alt"` or `family="handwriting"` renders with browser default font.

### Deferred 2: Consumer prop verification

Context overrides deleted in Fix 4. During Card and nav audits, verify:
- Card JSON passes `size="sm"` to its Text children
- Nav component JSON passes `size="sm" leading="snug"` to its Text children

### Deferred 3: Text + Heading token consistency

Cross-atom note: Text and Heading should use the same font scale tokens. Check during Heading audit.

### Deferred 4: Token coverage check

After all atom audits, grep every `var(--token-name)` in component CSS and verify each resolves to a definition in `src/styles/`. Automate as a build-time check. The font-family fallback strip in Fix 3 is the first case this would have caught.

---

## Audit Log Update

File: `src/components/atoms/Atom Audit Files/audit-log.md`

Update the Text row in the atoms/ui table:

```
| Text | PARTIAL | 2026-03-04 | All fixes applied. Schema: category corrected, 4 render keys (all → Text.astro, pipeline strips visual props in textonly). CSS: font family fallbacks stripped (expose missing --font-body-alt/--font-handwriting tokens), context overrides deleted (consumers pass size/leading props), blockquote border tokenized (--border-width-lg). No animation, no JS, no a11y concerns. DEFERRED: Verify Card and nav consumers pass correct size/leading props to Text children. Token coverage check: --font-body-alt and --font-handwriting must be defined for every brand. |
```

Add to cross-atom notes under atoms/ui:

```
- Text context overrides (.card .text, nav .text) DELETED from Text.css. Card and nav consumers must pass size="sm" (and leading="snug" for nav) as props to their Text children. Verify during Card and nav audits.
- Text font tokens: --font-body-alt and --font-handwriting are NOT defined in any brand token file. Every brand must define these or text using family="body-alt" or family="handwriting" will render with browser default. Flag during token coverage check.
```

---

## Post-fix checklist

1. Confirm schema `"category": "atom"`
2. Confirm schema has 4 render keys, all pointing to `"Text.astro"`
3. Confirm schema does NOT reference `Text.textonly.astro`
4. Confirm `Text.astro` comment no longer references `Text.a11y.css`
5. Confirm `.text--family-body-alt` has no fallback value
6. Confirm `.text--family-handwriting` has no fallback value
7. Confirm `.card .text` rule is GONE from Text.css
8. Confirm `nav .text` rule is GONE from Text.css
9. Confirm `--border-width-lg: 6px` exists in spacing.css
10. Confirm `blockquote.text` uses `var(--border-width-lg)` not `6px`
11. Confirm audit-log.md updated

---

## Files to modify

- `src/components/atoms/ui/Text/Text.schema.json` (fix 1)
- `src/components/atoms/ui/Text/Text.astro` (fix 2)
- `src/components/atoms/ui/Text/Text.css` (fixes 3, 4, 5)
- `src/styles/tokens/spacing.css` (fix 5)
- `src/components/atoms/Atom Audit Files/audit-log.md` (update entry)

No other files should be modified.
