# Text Atom — Audit Fix List (4 fixes + deferred)

Run these fixes against the Text component at `src/components/atoms/ui/Text/`. Do NOT make any changes beyond what is listed here. If something looks wrong or ambiguous, stop and ask.

**Important rules:**
- Never silently change or add to what's specified below
- No hardcoded colour/spacing values — use tokens
- No `var(--token, fallback)` pattern — no fallbacks in component CSS
- After all fixes, report exactly what changed, file by file, line by line

---

## Fix 1: Schema — category, assistive key, textonly fix

File: `Text.schema.json`

**Step 1:** Change `"category": "atoms/ui"` to `"category": "atom"`

**Step 2:** Add `"assistive"` render key. Text renders in all modes — same template.

**Step 3:** Change `"textonly"` from `"Text.textonly.astro"` to `"Text.astro"`. The textonly template file does not exist. Text is content — it always renders, visual props are stripped by the pipeline.

Final renders block:

```json
"renders": { "full": "Text.astro", "reduced": "Text.astro", "assistive": "Text.astro", "textonly": "Text.astro" }
```

---

## Fix 2: Astro — remove stale comment reference

File: `Text.astro`

Line 10 currently reads:

```
 * Styles: Text.css | Text.responsive.css | Text.a11y.css
```

Change to:

```
 * Styles: Text.css | Text.responsive.css
```

`Text.a11y.css` does not exist — this is a stale reference from before the extraction process. Remove only this reference. Do not change anything else in the comment block.

---

## Fix 3: CSS — strip font-family fallbacks

File: `Text.css`

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

Rationale: `--font-body-alt` and `--font-handwriting` are not defined anywhere in `src/styles/`. The fallbacks are hiding broken token references. Stripping them makes the missing tokens visible so they become a tracked issue. No fallbacks in component CSS — if a token doesn't exist, it should fail visibly.

---

## Fix 4: Delete Text.textonly.astro if it exists

Check if `Text.textonly.astro` exists in the Text folder. If it does, delete it. The schema previously referenced it but it was a ghost file. All render modes now point to `Text.astro`. If the file doesn't exist, this is a no-op — just confirm in your report.

---

## Deferred — do NOT fix now

### Deferred 1: Context overrides — move to consuming components

`Text.css` lines 149-159 contain context overrides:

```css
.card .text { font-size: var(--text-small); line-height: var(--leading-normal); }
nav .text { font-size: var(--text-small); line-height: var(--leading-snug); }
```

These are Text reaching into parent context. Card and nav components should own their own text sizing. Move these rules to Card.css and the nav component CSS during the cross-atom pass.

### Deferred 2: Missing font tokens

`--font-body-alt` and `--font-handwriting` are not defined in `src/styles/`. These tokens need creating in the appropriate token file. Every brand should define them. Until then, any component using `.text--family-body-alt` or `.text--family-handwriting` will render with the browser default font.

### Deferred 3: Blockquote border width token

`blockquote.text` uses `border-left: 6px solid var(--brand-c-primary)`. The `6px` is hardcoded — existing border tokens go up to `--border-width-md: 3px`. Either create `--border-width-lg: 6px` in the spacing/border token file, or accept as a low-usage element variant exception. Decide during the token coverage audit.

### Deferred 4: Text + Heading token consistency

Cross-atom note from audit log: Text and Heading should use the same font scale tokens. Check during the Heading audit.

### Deferred 5: Token coverage grep

After all atom audits, run a grep to find every `var(--token-name)` used in component CSS and verify each one resolves to a definition in `src/styles/`. Automate as a build-time check. The font-family fallback strip in Fix 3 is the first case this would have caught.

---

## Audit Log Update

File: `src/components/atoms/Atom Audit Files/audit-log.md`

Add or update the Text entry:

```
| Text | PARTIAL | [today's date] | Fixes 1-4 applied. Schema: category → "atom", 4 render keys (all point to Text.astro — text always renders). Stale Text.a11y.css comment removed from Astro. Font-family fallbacks stripped (--font-body-alt and --font-handwriting not defined in src/styles/ — now fails visibly). ACCEPTED: 1px border exceptions, blockquote 6px (deferred to token audit). DEFERRED: Context overrides (.card .text, nav .text) to consuming components, missing font tokens, blockquote border token, Text+Heading token consistency, full token coverage grep. |
```

Cross-atom notes:

```
- DEFERRED: .card .text and nav .text context overrides (Text.css lines 149-159) should move to Card.css and nav component CSS. Text atom should not reach into parent context.
- DEFERRED: --font-body-alt and --font-handwriting tokens missing from src/styles/. Fix 3 stripped fallbacks to make this visible. Tokens need creating per brand.
- DEFERRED: blockquote.text border-left: 6px — no --border-width-lg token exists. Create or accept as exception.
- DEFERRED: Text + Heading font scale token consistency check — do during Heading audit.
- POST-AUDIT: Token coverage grep — verify every var(--token) in component CSS resolves to a definition in src/styles/.
```

---

## Post-fix checklist

1. Confirm schema `"category": "atom"`
2. Confirm schema has 4 render keys, all pointing to `"Text.astro"`
3. Confirm `Text.astro` comment no longer references `Text.a11y.css`
4. Confirm `.text--family-body-alt` has NO fallback — just `var(--font-body-alt)`
5. Confirm `.text--family-handwriting` has NO fallback — just `var(--font-handwriting)`
6. Confirm `Text.textonly.astro` does NOT exist in the folder
7. Confirm audit-log.md Text entry added with deferred items

---

## Files to modify

- `src/components/atoms/ui/Text/Text.schema.json` (fix 1)
- `src/components/atoms/ui/Text/Text.astro` (fix 2)
- `src/components/atoms/ui/Text/Text.css` (fix 3)
- `src/components/atoms/Atom Audit Files/audit-log.md` (update)

Confirm non-existence:
- `src/components/atoms/ui/Text/Text.textonly.astro` (should not exist — fix 4)

No other files should be modified.
