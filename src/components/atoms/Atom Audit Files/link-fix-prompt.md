# Link Atom — Fix Prompt

Run these fixes against `src/components/atoms/ui/Link/`.
Read each file fully before making changes.

---

## Fix 1: Schema restructure — Link.schema.json

Replace the entire file:

```json
{
  "component": "Link",
  "category": "atom",
  "renders": {
    "full": "Link.astro",
    "reduced": "Link.astro",
    "assistive": "Link.astro",
    "textonly": "Link.astro"
  },
  "notes": "Inline text link. Renders through Text atom for typography. For links that need visual weight (glass, pill, padding), use Button with href instead.",

  "props": {
    "content": {
      "_description": "Where the link goes and how it identifies itself",
      "href":      { "type": "string",  "required": true, "description": "Link destination." },
      "target":    { "type": "string",  "required": false, "default": null, "description": "Link target." },
      "download":  { "type": "string",  "required": false, "default": null, "description": "Download attribute." },
      "rel":       { "type": "string",  "required": false, "default": null, "description": "Relationship attribute." },
      "external":  { "type": "boolean", "required": false, "default": false, "description": "External link — adds target=_blank and rel=noopener noreferrer." },
      "id":        { "type": "string",  "required": false, "default": null, "description": "Element ID." },
      "role":      { "type": "string",  "required": false, "default": null, "description": "ARIA role override." },
      "ariaLabel": { "type": "string",  "required": false, "default": null, "description": "Accessible label." }
    },

    "visual": {
      "_description": "How the link looks",
      "variant":   { "type": "string",  "required": false, "default": "default", "enum": ["default", "underline", "highlight", "border", "ghost"], "description": "Visual indicator style. default=colour only, underline=static underline, highlight=subtle background, border=thin border, ghost=subtle colour." },
      "color":     { "type": "string",  "required": false, "default": null, "enum": ["primary", "primary-dark", "secondary", "text", "text-light", "inherit"], "description": "Text colour override." },
      "weight":    { "type": "string",  "required": false, "default": null, "enum": ["normal", "medium", "semibold", "bold", "extrabold"], "description": "Font weight override." },
      "uppercase": { "type": "boolean", "required": false, "default": false, "description": "Uppercase text transform." },
      "flush":     { "type": "boolean", "required": false, "default": false, "description": "Remove margin." },
      "class":     { "type": "string",  "required": false, "default": "", "description": "Additional CSS classes." }
    },

    "animation": {
      "_description": "Motion behaviour — stripped in reduced/assistive/textonly renders",
      "underlineGrow":  { "type": "boolean", "required": false, "default": false, "description": "Underline scales from left on hover. Requires variant=underline for static fallback." },
      "highlightGrow":  { "type": "boolean", "required": false, "default": false, "description": "Background highlight grows from bottom bar to full coverage on hover. Requires variant=highlight for static fallback." },
      "shadowFill":     { "type": "boolean", "required": false, "default": false, "description": "Box-shadow inset fills from left on hover. Works with any variant." },
      "textSlide":      { "type": "boolean", "required": false, "default": false, "description": "Text colour sweeps from left via background-clip, with coordinated underline grow." }
    }
  },

  "slots": {
    "default": "Link text content"
  }
}
```

Key changes:
- category → "atom", 4 render keys
- Props split into content/visual/animation
- Glass variant REMOVED — consumers migrate to `<Button variant="glass" shape="pill" href="...">`
- New visual variants: highlight, border
- Animation props gated: underlineGrow, highlightGrow, shadowFill, textSlide
- Stale "reducedMotion" key removed

---

## Fix 2: Remove @layer wrappers — Link.css + Link.responsive.css

Remove `@layer components {` wrapper and closing `}` from both files.

---

## Fix 3: Remove glass variant — Link.css

Delete the entire glass variant section:
```css
/* VARIANT: Glass — DELETE ENTIRELY */
.link--glass { ... }
.link--glass:hover { ... }
```

Log consumer migration note: consumers using `<Link variant="glass">` migrate to `<Button variant="glass" shape="pill" href="...">`.

---

## Fix 4: Astro file — Text atom, remove 'text' class, add flush

**4a.** Add Text import:
```astro
import { Text } from '../Text';
```

**4b.** Remove `'text'` from class list (line 68). Also remove the `text--flush` reference (line 74).

Change lines 67-76:
```javascript
const classes = [
  'link',
  `link--${variant}`,
  color ? `link--color-${color}` : '',
  weight ? `link--weight-${weight}` : '',
  uppercase ? 'link--uppercase' : '',
  flush ? 'link--flush' : '',
  className,
].filter(Boolean);
```

**4c.** Wrap slot in Text atom. Change lines 79-91:
```astro
<a
  href={href}
  class:list={classes}
  target={target}
  download={download}
  rel={rel}
  id={id}
  role={role}
  aria-label={ariaLabel}
  {...dataAttrs}
>
  <Text as="span" flush><slot /></Text>
</a>
```

**4d.** Update doc comment at top — remove references to `.text` class, glass variant, and `Link.a11y.css`.

---

## Fix 5: Add .link--flush and new visual variants — Link.css

**5a.** Add flush rule:
```css
.link--flush { margin: 0; }
```

**5b.** Add highlight variant:
```css
/* ========== VARIANT: Highlight ========== */

.link--highlight {
  color: var(--brand-c-primary);
  position: relative;
}

.link--highlight::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 3px;
  width: 100%;
  height: 8px;
  z-index: -1;
  background-color: var(--brand-c-primary-light);
  opacity: var(--opacity-low);
}
```

**5c.** Add border variant:
```css
/* ========== VARIANT: Border ========== */

.link--border {
  color: var(--brand-c-primary);
  border-bottom: var(--border-width) solid var(--brand-c-primary);
  padding-bottom: 1px;
}

.link--border:hover {
  color: var(--brand-c-primary-dark);
  border-color: var(--brand-c-primary-dark);
}
```

---

## Fix 6: Separate underline variant from underline animation — Link.css

The current `.link--underline` has a growing `::after` pseudo-element. Split it:

**Static underline (visual variant — always visible):**
```css
.link--underline {
  position: relative;
  color: var(--brand-c-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 2px;
  text-decoration-color: currentColor;
}

.link--underline:hover {
  color: var(--brand-c-primary-dark);
}
```

**Animated underline (gated by animation class):**
```css
/* Animation: underlineGrow — underline scales from left on hover */
.link--animate-underline-grow {
  text-decoration: none; /* override static underline — animation replaces it */
}

.link--animate-underline-grow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: var(--radius-full);
  transform-origin: 0% 50%;
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.76, 0, 0.24, 1);
}

.link--animate-underline-grow:hover::after {
  transform: scaleX(1);
}
```

Using scaleX instead of width — more performant, smoother animation.

**In Button.astro**, add animation classes conditionally. After the variant classes, add:
```javascript
// In the classes array (these will be added to Link.astro, not Button):
underlineGrow && 'link--animate-underline-grow',
highlightGrow && 'link--animate-highlight-grow',
shadowFill && 'link--animate-shadow-fill',
textSlide && 'link--animate-text-slide',
```

Wait — these go in Link.astro's class builder. Add animation props to the destructuring and class list.

---

## Fix 7: Add remaining animation CSS (placeholder — follow-up for full implementation)

Add these as commented placeholders in Link.css for now. Full implementation in follow-up:

```css
/* ================================================================
   ANIMATION EFFECTS — gated by animation props
   Only rendered when JSON passes the animation prop.
   Pipeline strips animation group in reduced/assistive/textonly.
   ================================================================ */

/* Animation: highlightGrow — background grows from bar to full on hover */
.link--animate-highlight-grow::before {
  transition: all 0.3s ease-in-out;
}
.link--animate-highlight-grow:hover::before {
  bottom: 0;
  height: 100%;
}

/* Animation: shadowFill — box-shadow inset fills from left */
.link--animate-shadow-fill {
  transition: color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  padding: 0 0.25rem;
  margin: 0 -0.25rem;
}
.link--animate-shadow-fill:hover {
  color: var(--color-White);
  box-shadow: inset 200px 0 0 0 var(--brand-c-primary);
}

/* Animation: textSlide — text colour sweeps from left + underline grows */
.link--animate-text-slide {
  background-image: linear-gradient(
    to right,
    var(--brand-c-primary),
    var(--brand-c-primary) 50%,
    var(--brand-c-text) 50%
  );
  background-size: 200% 100%;
  background-position: -100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease-in-out;
}
.link--animate-text-slide::before {
  content: '';
  background: var(--brand-c-primary);
  display: block;
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 0;
  height: 3px;
  transition: all 0.3s ease-in-out;
}
.link--animate-text-slide:hover {
  background-position: 0;
}
.link--animate-text-slide:hover::before {
  width: 100%;
}
```

---

## Fix 8: a11y.css extraction — Link.a11y.css

Follow 6-step extraction process:

| Rule block | Category | Target |
|-----------|----------|--------|
| `.a11y-highlight-links .link--default/underline/ghost` (underline rules) | highlight-links | Append to `src/styles/global/highlight-links.css` as `[data-highlight-links] .link--default, [data-highlight-links] .link--underline, [data-highlight-links] .link--ghost { ... }` |
| `.a11y-highlight-links` hover rules | dead-code | Skip — no hover changes in highlight-links (per Button decision) |
| `.a11y-highlight-links .link--underline::after { display: none }` | highlight-links | Include — kills animated underline, static underline replaces it |
| `.a11y-highlight-links .link--glass` | dead-code | Glass removed from Link |
| `.a11y-reduce-motion .link { transition: none }` | already-covered | Base .link transition is colour-only (accepted). But in reduced render, even colour transitions should be instant. Add: `[data-render="reduced"] .link { transition: none; }` |
| `.a11y-reduce-motion .link--underline::after` | already-covered | Animation prop stripped → no animation class → no ::after pseudo. Pipeline handles. |
| `.a11y-reduce-motion .link--glass` | dead-code | Glass removed |
| `.a11y-text-only .link` (base simplification) | text-only | Extract as `[data-render="textonly"]` rules in Link.css |
| `.a11y-text-only .link--glass` | dead-code | Glass removed |
| `.a11y-text-only .link--underline::after` | already-covered | Animation stripped, static underline stays via variant |
| `.a11y-text-only .link--uppercase` | text-only | Extract as textonly rule |
| `.a11y-text-only .link--weight-*` | text-only | Extract as textonly rule |
| `.a11y-text-only .link--color-*` | text-only | Extract as textonly rule |

### Render-mode rules to ADD to Link.css:

```css
/* ================================================================
   RENDER MODE OVERRIDES
   ================================================================ */

/* Reduced — all transitions instant */
[data-render="reduced"] .link { transition: none; }

/* Textonly — all links become plain underlined text */
[data-render="textonly"] .link {
  color: var(--brand-c-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-align: left;
  text-transform: none;
  letter-spacing: normal;
  font-weight: normal;
}

[data-render="textonly"] .link--uppercase {
  text-transform: none;
  letter-spacing: normal;
}

[data-render="textonly"] .link--weight-normal,
[data-render="textonly"] .link--weight-medium,
[data-render="textonly"] .link--weight-semibold,
[data-render="textonly"] .link--weight-bold,
[data-render="textonly"] .link--weight-extrabold {
  font-weight: normal;
}

[data-render="textonly"] .link--color-primary,
[data-render="textonly"] .link--color-primary-dark,
[data-render="textonly"] .link--color-secondary,
[data-render="textonly"] .link--color-text,
[data-render="textonly"] .link--color-text-light {
  color: var(--brand-c-primary);
}
```

### After extraction:
- Move Link.a11y.css to `_reference/Link/Link.a11y.css`
- Move Link.a11y.recovery.css to `_reference/Link/Link.a11y.recovery.css`

---

## Fix 9: Link.responsive.css — remove glass rules

Delete all `.link--glass` responsive rules. Glass variant no longer exists on Link.

Keep the remaining rules:
- `.link--underline::after` height adjustment at small breakpoints
- `.link` word-break at micro viewports

---

## Fix 10: index.ts cleanup

```ts
import './Link.css';
import './Link.responsive.css';

export { default as Link } from './Link.astro';
export { default as schema } from './Link.schema.json';
```

Remove `import './Link.a11y.css'`.

---

## Fix 11: Link.astro — add animation props

Add animation props to the Props interface:
```typescript
underlineGrow?: boolean;
highlightGrow?: boolean;
shadowFill?: boolean;
textSlide?: boolean;
```

Add to destructuring:
```typescript
underlineGrow = false,
highlightGrow = false,
shadowFill = false,
textSlide = false,
```

Add to classes array:
```javascript
underlineGrow && 'link--animate-underline-grow',
highlightGrow && 'link--animate-highlight-grow',
shadowFill && 'link--animate-shadow-fill',
textSlide && 'link--animate-text-slide',
```

---

## Post-fix verification

1. `grep -r "atoms/ui" Link.schema.json` returns 0 matches
2. `grep -r "@layer" Link.css Link.responsive.css` returns 0 matches
3. `grep -r "glass" Link.css Link.responsive.css` returns 0 matches
4. `grep -r "'text'" Link.astro` returns 0 matches
5. `grep -r "Link.a11y.css" index.ts` returns 0 matches
6. `grep -r "text--flush" Link.astro` returns 0 matches
7. Schema has 4 render keys and animation group with 4 props
8. Link.a11y.css in `_reference/Link/`
9. highlight-links.css has Link rules appended
10. Link.css has `[data-render]` rules

---

## Cross-atom notes (for audit-log.md)

```
- MIGRATION: All consumers of <Link variant="glass"> must migrate to <Button variant="glass" shape="pill" href="...">. Known consumers: Footer, possibly GlassNav. Check during consumer audits.
- DEFERRED: Link animation effects (underlineGrow, highlightGrow, shadowFill, textSlide) CSS is implemented but needs visual testing across all themes and render modes.
- DEFERRED: highlight-links.css needs Link rules for new variants (highlight, border) added during cross-atom pass.
- ARCHITECTURE: Link is inline text only. Anything that needs visual weight (padding, background, border-radius) is a Button with href.
```
