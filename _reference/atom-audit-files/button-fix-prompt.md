# Button Atom — Fix Prompt

Run these fixes against `src/components/atoms/ui/Button/`. 
Read each file fully before making changes. Do NOT skip or skim.
Show the plan for each fix before applying it. Wait for confirmation on the a11y extraction categorisation.

---

## Fix 1: Schema restructure — Button.schema.json

Replace the entire file with:

```json
{
  "component": "Button",
  "category": "atom",
  "renders": {
    "full": "Button.astro",
    "reduced": "Button.astro",
    "assistive": "Button.astro",
    "textonly": "Button.astro"
  },
  "notes": "Renders as <button>, <a>, or dropdown wrapper depending on props. Label renders through Text atom. Icon/LottieIcon for media. All motion gated behind animation props.",

  "props": {
    "content": {
      "_description": "What the button communicates and does",
      "href":           { "type": "string",  "required": false, "default": null, "description": "Makes it an <a> tag." },
      "target":         { "type": "string",  "required": false, "default": null, "description": "Link target." },
      "download":       { "type": "string",  "required": false, "default": null, "description": "Download attribute." },
      "type":           { "type": "string",  "required": false, "default": "button", "enum": ["button", "submit", "reset"], "description": "Button type." },
      "disabled":       { "type": "boolean", "required": false, "default": false, "description": "Disabled state." },
      "id":             { "type": "string",  "required": false, "default": null, "description": "Element ID." },
      "ariaLabel":      { "type": "string",  "required": false, "default": null, "description": "Accessible label for icon-only buttons." },
      "icon":           { "type": "string",  "required": false, "default": null, "description": "Phosphor icon slug. Decorative — aria-hidden via Icon atom." },
      "iconPosition":   { "type": "string",  "required": false, "default": "left", "enum": ["left", "right"], "description": "Icon position." },
      "iconCollection": { "type": "string",  "required": false, "default": null, "description": "Icon collection override." },
      "dropdownItems":  { "type": "array",   "required": false, "default": [], "description": "Array of {label, href?, value?, fontFamily?} for dropdown mode." }
    },

    "visual": {
      "_description": "How the button looks",
      "variant":   { "type": "string",  "required": false, "default": "primary", "enum": ["primary", "secondary", "neutral", "outline", "ghost", "glass", "glow", "neumorphic"], "description": "Colour variant." },
      "shape":     { "type": "string",  "required": false, "default": "rounded", "enum": ["rounded", "pill", "circle", "square", "sharp", "dropdown"], "description": "Border radius shape." },
      "size":      { "type": "string",  "required": false, "default": "md", "enum": ["sm", "md", "lg"], "description": "Size variant." },
      "alignment": { "type": "string",  "required": false, "default": null, "enum": ["left", "center"], "description": "Button alignment in container." },
      "class":     { "type": "string",  "required": false, "default": "", "description": "Additional CSS classes." }
    },

    "animation": {
      "_description": "Motion behaviour — stripped in reduced/assistive/textonly renders",
      "effect":         { "type": "string",  "required": false, "default": null, "enum": ["glint", "colour-flow", "jump", "comic", "tech", "expand", "underline", "magnetic", "spotlight", "split"], "description": "Hover/interaction effect." },
      "speed":          { "type": "string",  "required": false, "default": null, "enum": ["slow", "normal", "fast"], "description": "Effect speed." },
      "iconMorphTo":    { "type": "string",  "required": false, "default": null, "description": "Icon morph target on hover." },
      "iconMorphColor": { "type": "string",  "required": false, "default": null, "description": "Icon morph colour." },
      "iconDraw":       { "type": "string",  "required": false, "default": null, "enum": ["draw", "drawcenter", "chachaslide", "flashgordon", "rainbowchase", "pulse"], "description": "Icon draw animation." },
      "iconDrawColor":  { "type": "string",  "required": false, "default": null, "description": "Icon draw colour." },
      "lottieIcon":     { "type": "string",  "required": false, "default": null, "description": "Lottie animation slug for icon slot. Stripped in non-full renders, falls back to content.icon." },
      "lottieLoop":     { "type": "boolean", "required": false, "default": false, "description": "Loop Lottie animation." },
      "confetti":       { "type": "string",  "required": false, "default": null, "enum": ["confetti", "hearts", "celebration", "mixed"], "description": "Particle burst type." },
      "confettiTrigger":{ "type": "string",  "required": false, "default": "click", "enum": ["click", "hover"], "description": "Particle trigger." },
      "confettiCount":  { "type": "number",  "required": false, "default": 30, "description": "Particle count." },
      "confettiSpread": { "type": "number",  "required": false, "default": 150, "description": "Particle spread." }
    }
  },

  "slots": {
    "default": "Button label text"
  }
}
```

Key changes: category → "atom", 4 render keys, props split into content/visual/animation. lottieIcon in animation group — pipeline strips in non-full renders, content.icon becomes fallback automatically (same pattern as Heading media slot).

---

## Fix 2: Remove @layer wrappers — Button.css

Remove the `@layer components {` wrapper on line 13 and its closing `}` on line 863. Keep all rules inside. Same for Button.responsive.css — remove `@layer components {` and closing `}`.

---

## Fix 3: Base .btn hover — colour only, no motion

**Line 48:** Change `transition: all var(--transition-fast);` to:
```css
transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
```
This transitions ONLY colour properties. No transform, no box-shadow transitions on base.

**Line 53:** Remove `transform: translateY(-1px);` from `.btn:hover`. Hover feedback is colour-only on base. Keep `background-color` and `box-shadow` changes (those are visual state, not motion).

Actually — also remove the box-shadow transition from base. Box-shadow changes can stay instant or be gated by effect props. Simpler:
```css
transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
```

**Line 64:** Remove `transform: translateY(0);` from `.btn:active`.

**Lines 77:** Remove `transform: none;` from disabled hover (nothing to reset now).

The effect classes (.btn--jump, .btn--comic, etc.) keep their own transitions and transforms — those are gated by the effect prop.

---

## Fix 4: Strip var(--token, fallback) patterns — Button.css

**Line 459:** `var(--_expand-r-start, 999px)` → `var(--_expand-r-start)`
Set the default on the `.btn--expand` rule itself:
```css
.btn--expand {
  --_expand-r-start: 999px;
  --_expand-r-end: 999px;
  /* ... rest of expand styles */
}
```
Then the shape overrides (.btn--rounded.btn--expand etc.) override these custom properties. The fallback moves from the var() call to the property definition.

**Line 588:** `var(--_spot-x, 50%) var(--_spot-y, 50%)` — same pattern. Set defaults on `.btn--spotlight`:
```css
.btn--spotlight {
  --_spot-x: 50%;
  --_spot-y: 50%;
}
```
Then remove fallbacks from the gradient: `var(--_spot-x) var(--_spot-y)`.

---

## Fix 5: Dead code removal — Button.css and Button.responsive.css

### Button.responsive.css:
Delete ALL `.btn--fx-tray-3d` rules (confirmed dead — class not in Button.css or Button.astro).
Delete ALL `.btn-rainbow-wrap` rules (confirmed dead — class not in Button.css or Button.astro).

### Button.css:
Confirm no `.btn--fx-tray-3d` or `.btn-rainbow-wrap` references exist. If they do, delete them too.

---

## Fix 6: Hardcoded values — Button.responsive.css

After removing tray-3d dead code, check remaining hardcoded values:

- `0.75rem`, `0.7rem`, `0.8rem` font sizes at 200px breakpoint — these are below token floor. Add comment: `/* Below token scale floor — no --text-* tokens at these sizes */` (already has this comment, verify it's accurate).
- `4px 6px`, `2px 4px`, `6px 8px` padding at extreme breakpoints — below token floor. Document with comment.
- `font-size: var(--text-veryfine)` at 150px — verify this token exists. If not, flag it.

---

## Fix 7: a11y.css extraction — Button.a11y.css

Follow the 6-step extraction process. Here's the categorisation:

| Rule block | Current location | Category | Target |
|-----------|-----------------|----------|--------|
| `.a11y-reduce-motion .btn` (base reset) | a11y.css lines 16-58 | `already-covered` | Render pipeline strips animation props. No effect class = no motion. But the colour simplification (transparent bg, outline style) is a DESIGN DECISION for reduced render — extract as `[data-render="reduced"]` rules in Button.css |
| `.a11y-reduce-motion .btn::before/after` | a11y.css lines 57-59 | `already-covered` | No effect prop = no pseudo-element effects. Pipeline handles. |
| `.a11y-reduce-motion .btn--icon-only` | a11y.css lines 62-67 | `already-covered` | Layout concern, not motion. Keep in base Button.css. |
| `.a11y-reduce-motion .btn--expand` | a11y.css lines 74-83 | `already-covered` | No expand effect prop = no expand class = no expand CSS. Pipeline handles. |
| `.a11y-reduce-motion .btn--underline` | a11y.css lines 86-89 | `already-covered` | Same — no underline effect prop = no underline class. |
| `.a11y-reduce-motion .dropdown-menu` | a11y.css lines 92-93 | `reduce-motion` | Dropdown is interactive, not effect-gated. Needs `[data-render="reduced"] .dropdown-menu { transition: none; }` in Button.css |
| `.a11y-reduce-motion .btn__chevron` | a11y.css line 95-96 | `reduce-motion` | Same — chevron rotation is interactive. `[data-render="reduced"] .btn__chevron { transition: none; }` |
| `.a11y-text-only .btn` (base reset) | a11y.css lines 105-145 | `text-only` | DESIGN DECISION — textonly buttons render as plain outline. Extract as `[data-render="textonly"] .btn { ... }` in Button.css |
| `.a11y-text-only .btn::before/after` | a11y.css lines 137-139 | `already-covered` | No effect = no pseudo-elements. |
| `.a11y-text-only .btn-rainbow-wrap` | a11y.css lines 142-146 | `dead-code` | Rainbow wrap confirmed dead. Don't extract. |
| `.a11y-text-only .btn--icon-only` | a11y.css lines 148-155 | `text-only` | Same icon-only layout fix. `[data-render="textonly"]` rule. |
| `.a11y-text-only .icon-draw-overlay/segment` | a11y.css lines 158-160 | `already-covered` | iconDraw is animation prop, stripped by pipeline. |
| `.a11y-text-only .btn--expand` | a11y.css lines 163-172 | `already-covered` | No expand prop = no expand class. |
| `.a11y-text-only .btn--underline` | a11y.css lines 175-178 | `already-covered` | No underline prop = no underline class. |
| `.a11y-high-contrast .btn` | a11y.css lines 187-189 | `high-contrast` | Extract to `src/styles/zones/high-contrast.css`: `[data-high-contrast] .btn { border: var(--border-width-2) solid currentColor; }` |
| `.a11y-high-contrast .btn--fx-tray-3d` | a11y.css lines 191-194 | `dead-code` | Tray-3d confirmed dead. |
| `.a11y-high-contrast .btn-rainbow-wrap` | a11y.css lines 196-202 | `dead-code` | Rainbow wrap confirmed dead. |
| `.a11y-high-contrast .btn--fx-glow:hover` | a11y.css lines 204-208 | `high-contrast` | Extract to high-contrast.css: `[data-high-contrast] .btn--glow:hover { box-shadow: none; outline: var(--border-width-2) solid currentColor; outline-offset: 2px; }` |
| `.a11y-highlight-links .btn` | a11y.css lines 216-219 | `highlight-links` | Extract to `src/styles/global/highlight-links.css`: `[data-highlight-links] .btn { outline: 2px solid var(--brand-c-primary); outline-offset: 2px; }` |
| `.a11y-highlight-links .btn .btn__label` | a11y.css lines 221-224 | `highlight-links` | Extract to highlight-links.css: `[data-highlight-links] .btn .btn__label { text-decoration: underline; text-underline-offset: 3px; }` |
| `.a11y-highlight-links .btn:hover` | a11y.css lines 226-228 | `highlight-links` | Extract to highlight-links.css: `[data-highlight-links] .btn:hover { outline-color: var(--brand-c-primary-dark); }` |

### Render-mode rules to ADD to Button.css:

```css
/* ================================================================
   RENDER MODE OVERRIDES
   ================================================================ */

/* Reduced — interactive transitions killed, colour-only state changes */
[data-render="reduced"] .dropdown-menu { transition: none; }
[data-render="reduced"] .btn__chevron { transition: none; }

/* Assistive — enlarged targets, simplified appearance */
[data-render="assistive"] .btn {
  min-width: 64px;
  min-height: 64px;
}
[data-render="assistive"] .btn:focus-visible {
  outline-width: 3px;
}

/* Textonly — plain outline button, zero decoration */
[data-render="textonly"] .btn {
  background: transparent;
  color: var(--_btn-brand-dark);
  border: 2px solid var(--_btn-brand);
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  filter: none;
  clip-path: none;
  max-width: none;
}
[data-render="textonly"] .btn:hover {
  background: transparent;
  color: var(--_btn-brand-dark);
  border-color: var(--_btn-brand-dark);
  box-shadow: none;
  filter: none;
}
[data-render="textonly"] .btn--icon-only {
  justify-content: center;
}
[data-render="textonly"] .btn--icon-only .btn__label {
  display: none;
}
```

### After extraction:
- Move Button.a11y.css to `_reference/Button/Button.a11y.css`
- Move Button.a11y.recovery.css to `_reference/Button/Button.a11y.recovery.css`

---

## Fix 8: Scripts — remove banned patterns from Button.astro

### Delete all 3 isA11yActive() functions:
- `isA11yActive()` (lines 298-303) — used by confetti script
- `isCursorA11yActive()` (lines 346-351) — used by magnetic/spotlight script
- `isLottieA11yActive()` (lines 401-406) — used by lottie script

### Remove all calls to these functions:
- Confetti script: remove `if (isA11yActive()) return;` from hover and click handlers (lines 323, 330)
- Cursor script: remove `if (isCursorA11yActive()) return;` from mousemove handlers (lines 361, 379)
- Lottie script: remove `if (isLottieA11yActive()) return;` from mouseenter/mouseleave handlers (lines 414, 418)

### Why this is safe:
- Confetti: `.btn--confetti` only exists when confetti prop is passed. Pipeline strips confetti in reduced/assistive/textonly. No element to find = no binding.
- Magnetic: `.btn--magnetic` only exists when effect="magnetic". Pipeline strips effect. No element = no binding.
- Spotlight: `.btn--spotlight` only exists when effect="spotlight". Same.
- Lottie: `.btn [data-lottie-icon]` only exists when lottieIcon prop is passed. Pipeline strips lottieIcon in non-full renders. No element = no binding.

### Dropdown script stays unchanged — it's interactive, not animated.

### Add focus equivalent for Lottie hover:
In the initButtonLottie() function, after the mouseenter/mouseleave listeners, add:
```javascript
trigger.addEventListener('focusin', () => {
  el.dispatchEvent(new CustomEvent('lottie:play'));
});
trigger.addEventListener('focusout', () => {
  el.dispatchEvent(new CustomEvent('lottie:playReverse'));
});
```

---

## Fix 9: LottieIcon src → slug migration — Button.astro

Change all LottieIcon instances from:
```astro
<LottieIcon src={lottieIcon!} size={iconSize} class="btn__icon" loop={lottieLoop} />
```
To:
```astro
<LottieIcon slug={lottieIcon!} size={iconSize} class="btn__icon" loop={lottieLoop} />
```

There are 3 instances (dropdown, link, button renders). Update all 3.

---

## Fix 10: Label through Text atom — Button.astro

Import Text atom:
```astro
import { Text } from '../../ui/Text';
```

Change all `<span class="btn__label"><slot /></span>` to:
```astro
<Text as="span" class="btn__label" flush><slot /></Text>
```

There are 3 instances (dropdown, link, button renders) plus 1 in dropdown items area. Update the 3 main label instances. Dropdown items stay as raw elements (they're inside the dropdown menu, not the button label).

Remove `.btn__label` typography rules from Button.css if any exist (font-family, font-size, line-height) — Text atom now handles these. Keep layout-only rules (position, z-index, color transitions).

---

## Fix 11: confetti.css relocation

Move `confetti.css` from `src/components/atoms/ui/Button/confetti.css` to `src/styles/tokens/confetti.css`.

Update any imports that reference it. Check:
- Button/index.ts (remove confetti.css import if present)
- Any global CSS import file that loads token files
- Add import to the global token loading chain where other token files are loaded

---

## Fix 12: index.ts cleanup

Update to:
```ts
import './Button.css';
import './Button.responsive.css';

export { default as Button } from './Button.astro';
export type { DropdownItem } from './Button.astro';
export { default as schema } from './Button.schema.json';
```

Changes: removed `import './Button.a11y.css'` (file moved to _reference/).

---

## Fix 13: Astro file — remove 'text' from class list

Line 129: `'text'` is in the classes array. Button inherits from Text atom via the `<Text>` wrapper now, not via a `text` CSS class. Remove `'text'` from the classes array.

---

## Post-fix verification

After all fixes, verify:
1. `grep -r "a11y-content-wrapper" Button.astro` returns 0 matches
2. `grep -r "a11y-reduce-motion\|a11y-text-only" Button.astro` returns 0 matches
3. `grep -r "prefers-reduced-motion" Button.astro` returns 0 matches
4. `grep -r "@layer" Button.css Button.responsive.css` returns 0 matches
5. `grep -r "var(--[^)]*," Button.css` returns 0 matches (no fallbacks)
6. `grep -r "tray-3d\|rainbow-wrap" Button.css Button.responsive.css` returns 0 matches
7. `grep -r "Button.a11y.css" index.ts` returns 0 matches
8. Button.a11y.css and Button.a11y.recovery.css are in `_reference/Button/`
9. confetti.css is in `src/styles/tokens/`
10. Schema has "category": "atom" and 4 render keys

---

## Decisions log (for audit-log.md)

| Decision | Outcome |
|----------|---------|
| A. Base hover motion | Colour-only hover on base. ALL translateY removed. Transform/box-shadow transitions only on effect classes. |
| B. btn__label | Renders through Text atom. Structural <span> replaced with <Text as="span">. |
| C. confetti.css | Moved to src/styles/tokens/confetti.css. Global concern, not component-level. |
| D. btn--fx-tray-3d | Dead code. Deleted from responsive.css. Source code retained by user for future re-add. |
| E. btn-rainbow-wrap | Dead code. Left in _reference/ with a11y.css. Source code retained by user. |
| F. LottieIcon src→slug | Fixed in this audit. Button now uses slug prop. |
| G. isA11yActive() functions | All 3 deleted. Pipeline gating makes runtime a11y checks redundant. |
