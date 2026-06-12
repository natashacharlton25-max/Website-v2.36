# TASK: Add Focus Ring + Highlight Link Tokens

Read ALL of this before touching any code.

---

## WHAT YOU ARE BUILDING

Four new tokens output per theme file by the theme engine:
- `--focus-ring-inner` — inner focus ring colour (text body colour)
- `--focus-ring-outer` — outer focus ring colour (complementary hue, contrast-validated)
- `--focus-ring-bg` — gap colour between rings (page background)
- `--highlight-link-color` — border/underline colour for highlight links

No mode-specific CSS overrides needed. Each theme file (light, dark, HC, CVD) outputs its own correct values. The CSS just reads tokens. Same pattern as every other token in the system.

Plus three global CSS files replacing all per-component focus, highlight, and transition rules.

---

## FILES TO MODIFY

1. `src/utils/theme-engine.js` — add function + wire into buildCSS + audit
2. `src/styles/global/focus-visible.css` (or `focus-gate.css` — whichever exists) — REWRITE
3. `src/styles/global/highlight-links.css` — REWRITE
4. `src/styles/global/transitions.css` — NEW file
5. Component CSS files — DELETE specific rules only (listed in Step 6)

## DO NOT MODIFY

- No .astro files
- No schema files
- `scripts/generate-theme-tokens.js` — no changes, reads from engine
- `src/styles/tokens/shadows.css` — focus uses its own private tokens

---

## STEP 1: Add Focus/Highlight Computation to theme-engine.js

### 1a. Add new function

Insert BEFORE `buildCSS()` (before the `/* 11. CSS OUTPUT */` comment):

```js
/* ================================================================
   10b. FOCUS RING + HIGHLIGHT LINK TOKENS
   ================================================================ */

/**
 * Compute focus ring and highlight link colours per theme.
 * Inner ring = neutral text colour (high contrast against page-bg).
 * Outer ring = complementary hue, adjusted until 3:1 against both page-bg and card-bg.
 * Highlight = neutral mid-tone, already contrast-safe from scale generation.
 * HC themes = black/white, no computation.
 */
function computeFocusHighlightTokens(scales, pageBg, isDark, isHC = false) {
  const { neutral } = scales;
  const pageBgHex = pageBg['page-bg'];
  const cardBgHex = pageBg['page-bg-raised'];

  if (isHC) {
    return {
      'focus-ring-inner':     isDark ? '#ffffff' : '#000000',
      'focus-ring-outer':     isDark ? '#000000' : '#ffffff',
      'focus-ring-bg':        pageBgHex,
      'highlight-link-color': isDark ? '#ffffff' : '#000000',
    };
  }

  const innerHex = neutral[isDark ? 200 : 800];
  const innerH = chroma(innerHex).get('oklch.h') || 0;
  const complementaryHue = (innerH + 180) % 360;
  let outerL = isDark ? 0.75 : 0.50;
  let outerHex = safeOklch(outerL, 0.15, complementaryHue);

  let attempts = 0;
  while (attempts < 20 && (
    contrastRatio(outerHex, pageBgHex) < 3 ||
    contrastRatio(outerHex, cardBgHex) < 3
  )) {
    outerL += isDark ? 0.03 : -0.03;
    outerHex = safeOklch(outerL, 0.15, complementaryHue);
    attempts++;
  }

  const highlightHex = neutral[isDark ? 400 : 600];

  return {
    'focus-ring-inner':     innerHex,
    'focus-ring-outer':     outerHex,
    'focus-ring-bg':        pageBgHex,
    'highlight-link-color': highlightHex,
  };
}
```

### 1b. Wire into generateThemeData()

AFTER the HC status overrides block (`status['color-White'] = '#ffffff';`), ADD:

```js
  // 5b. Compute focus + highlight tokens
  const focusHighlight = computeFocusHighlightTokens(scales, pageBg, isDark, definition.highContrast);
```

### 1c. Update buildCSS() signature

```js
// CHANGE FROM:
function buildCSS(definition, scales, pageBg, status) {

// TO:
function buildCSS(definition, scales, pageBg, status, focusHighlight) {
```

### 1d. Add tokens to CSS output

In `buildCSS()`, AFTER the `--media-contrast` line, BEFORE the `if (definition.highContrast)` block, ADD:

```js
  // Focus + highlight tokens
  ln();
  ln(`  /* -- FOCUS + HIGHLIGHT TOKENS -------------------- */`);
  ln(`  --focus-ring-inner: ${focusHighlight['focus-ring-inner']};`);
  ln(`  --focus-ring-outer: ${focusHighlight['focus-ring-outer']};`);
  ln(`  --focus-ring-bg: ${focusHighlight['focus-ring-bg']};`);
  ln(`  --highlight-link-color: ${focusHighlight['highlight-link-color']};`);
```

### 1e. Update buildCSS() call

```js
// CHANGE FROM:
const css = buildCSS(definition, scales, pageBg, status);

// TO:
const css = buildCSS(definition, scales, pageBg, status, focusHighlight);
```

### 1f. Add to audit

Update `auditTheme()` signature:

```js
// CHANGE FROM:
export function auditTheme(semantic) {

// TO:
export function auditTheme(semantic, focusHighlight = null, pageBg = null) {
```

Add to the `decorativePairs` array:

```js
  if (focusHighlight && pageBg) {
    decorativePairs.push(
      ['focus-inner on page-bg', focusHighlight['focus-ring-inner'], pageBg['page-bg']],
      ['focus-outer on page-bg', focusHighlight['focus-ring-outer'], pageBg['page-bg']],
      ['focus-inner on card-bg', focusHighlight['focus-ring-inner'], pageBg['page-bg-raised']],
      ['focus-outer on card-bg', focusHighlight['focus-ring-outer'], pageBg['page-bg-raised']],
      ['highlight on page-bg',   focusHighlight['highlight-link-color'], pageBg['page-bg']],
      ['highlight on card-bg',   focusHighlight['highlight-link-color'], pageBg['page-bg-raised']],
    );
  }
```

Update the `auditTheme()` call in `generateThemeData()`:

```js
// CHANGE FROM:
const themeAudit = auditTheme({...});

// TO:
const themeAudit = auditTheme({...}, focusHighlight, pageBg);
```

---

## STEP 2: Create Global Focus Ring CSS

REWRITE the existing focus file. Delete ALL content. Replace with:

```css
/**
 * Global focus ring — double box-shadow
 *
 * Four stacked box-shadows create a double ring:
 *   1. Background gap
 *   2. Inner ring (--focus-ring-inner from theme)
 *   3. Background gap
 *   4. Outer ring (--focus-ring-outer from theme)
 *
 * Squared (border-radius: 0) — visually distinct from element shape.
 * No mode overrides — each theme provides correct values.
 * IMMUNE to visual-gate — uses --_focus-ring-* private tokens, not --shadow-*.
 */

:where(a, button, input, textarea, select, details, [contenteditable], [tabindex], [role="button"]) {
  --_focus-ring-distance: 0.2rem;

  &:focus-visible {
    box-shadow:
      0 0 0 var(--_focus-ring-distance) var(--focus-ring-bg),
      0 0 0 calc(var(--_focus-ring-distance) * 2) var(--focus-ring-inner),
      0 0 0 calc(var(--_focus-ring-distance) * 3) var(--focus-ring-bg),
      0 0 0 calc(var(--_focus-ring-distance) * 4) var(--focus-ring-outer);
    border-radius: 0;
    outline: none;
  }

  @media (forced-colors: active) {
    &:focus-visible {
      box-shadow: none;
      outline: calc(var(--_focus-ring-distance) * 2) solid LinkText;
      outline-offset: var(--_focus-ring-distance);
      border-radius: revert;
    }
  }
}
```

That is the ENTIRE file. Nothing else.

---

## STEP 3: Rewrite Global Highlight Links CSS

REWRITE `src/styles/global/highlight-links.css`. Delete ALL content. Replace with:

```css
/**
 * Global highlight links — visible indicator on all clickable
 *
 * Inline text links: underline (not border)
 * Block elements: border
 * Colour from --highlight-link-color (theme token, contrast-validated)
 * No mode overrides — theme provides correct values.
 * IMMUNE to visual-gate — uses border and text-decoration, not box-shadow.
 */

/* ── Inline text links — underline ── */
[data-highlight-links] :where(a:not(.btn):not(.card):not([role="button"])) {
  text-decoration: underline;
  text-decoration-color: var(--highlight-link-color);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
}

/* ── Block interactive elements — border ── */
[data-highlight-links] :where(button, summary, [role="button"], [tabindex="0"]) {
  border: 2px solid var(--highlight-link-color);
}

/* ── Link cards and button-styled links — border, not underline ── */
[data-highlight-links] :where(a.card, a.btn, a[role="button"]) {
  text-decoration: none;
  border: 2px solid var(--highlight-link-color);
}

/* ── Elements with existing borders — thicken and recolour ── */
[data-highlight-links] :where(.btn--outline, .badge--outline, .card) {
  border-width: 2px;
  border-color: var(--highlight-link-color);
}
```

That is the ENTIRE file. Nothing else.

---

## STEP 4: Create Global Transitions CSS

Create NEW file: `src/styles/global/transitions.css`

```css
/**
 * Global transitions — hover speed on all interactive elements
 *
 * Reads --hover-duration-fast from hover-gate.css.
 * Hover gate sets to 0s for instant/none — transitions become instant.
 * Components should NOT have their own transition declarations.
 * Exception: unique animated properties (FlipCard perspective, RainbowBorder rotate).
 */

:where(a, button, [role="button"], [tabindex="0"],
       .card, .badge, .btn, .link, .tooltip,
       .form-field__input, .form-field__card-face) {
  transition:
    background-color var(--hover-duration-fast),
    color var(--hover-duration-fast),
    border-color var(--hover-duration-fast),
    box-shadow var(--hover-duration-fast),
    transform var(--hover-duration-fast),
    opacity var(--hover-duration-fast);
}

:where(a, button, .btn, .link)::before,
:where(a, button, .btn, .link)::after {
  transition:
    transform var(--hover-duration-fast),
    opacity var(--hover-duration-fast),
    background-color var(--hover-duration-fast);
}
```

That is the ENTIRE file. Nothing else.

---

## STEP 5: Import All Three Files

In main CSS import file, add:

```css
@import './global/focus-visible.css';
@import './global/highlight-links.css';
@import './global/transitions.css';
```

Load AFTER component CSS and zone files.

---

## STEP 6: Delete Per-Component Rules

**Focus-visible — DELETE from these files (global handles it):**
- Button.css — `.btn:focus-visible`
- Button.css — `[data-render="assistive"] .btn` focus-visible
- Card.css — `.card--hover-lift:focus-visible`
- Card.css — `.card--hover-border:focus-visible`
- Card.css — `.card--hover-glow:focus-visible`
- Card.css — `[data-render="assistive"] .card--link` focus-visible
- Image.css — `.image:focus-visible`
- Image.css — `[data-render="assistive"] .image:focus-visible`
- Tooltip.css — `.tooltip__trigger:focus-visible`
- Link.css — `.link:focus-visible` (link gets same squared box as everything else now)

**Focus-visible — KEEP (structural):**
- Button.css — `.dropdown-item:focus-visible` (inset outline, structural)
- FormField.css — sibling rules (`.checkbox:focus-visible + .checkmark` etc). Test if global catches the focusable element directly. If yes, delete. If no, keep.

**Transition rules — DELETE from every component CSS file:**
Search for `transition:` in all component CSS. Delete all EXCEPT:
- FlipCard.css — perspective/transform unique to flip
- RainbowBorderCard.css — rotate unique to spin
- Any component with a property NOT in the global list

**Highlight-links — DELETE from every component:**
Search for `[data-highlight-links]` in component CSS. Delete all.

---

## STEP 7: Regenerate All Themes

```bash
node scripts/generate-theme-tokens.js
```

Check:
- Every theme file has the 4 new tokens
- Zero new contrast failures
- Show me FULL output before committing

---

## STEP 8: Verify

1. Tab through any test page — double squared ring on every focusable element
2. Inner ring matches text, outer is complementary
3. Switch themes — rings adapt automatically
4. Highlight links ON:
   - Inline `<a>` text links: underline
   - `<button>`: border
   - `<a class="card">`: border, NOT underline
   - `<a class="btn">`: border, NOT underline
5. Tab WITH highlight on — focus box outside highlight border/underline
6. Hover elements — transitions follow hover-gate speed
7. Hover=none — all transitions instant
8. Visual=flat — focus rings STILL visible
9. Forced colours mode (Windows) — outline fallback
10. FormField controls — check if global catches them or sibling rules needed

---

## CRITICAL: Visual Gate Exclusion

The visual-gate kills `--shadow-*` tokens. Focus rings use `--_focus-ring-*` private tokens — immune by design. Highlight links use `border` and `text-decoration` — also immune.

**NEVER write:**
```css
[data-visual="flat"] * { box-shadow: none; }
```

This kills focus rings. Visual gate ONLY overrides named `--shadow-*` tokens. Focus and highlight survive every visual mode.

---

## RULES

- No fallback values on tokens
- No outline for focus (except forced-colors). Use box-shadow.
- No box-shadow for highlight. Use border (blocks) or underline (inline links).
- No per-component focus, highlight, or transition rules
- No dark/light/HC CSS overrides. Theme provides correct values.
- No blanket `box-shadow: none` rules anywhere
- No commit without showing theme generation output
