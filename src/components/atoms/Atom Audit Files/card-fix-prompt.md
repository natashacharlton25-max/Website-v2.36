# Card Atom — Fix Prompt

Run these fixes against `src/components/atoms/ui/Card/`.
Read each file fully before making changes.

Split into two sessions:
- Session 1: Fixes 1-6 (schema, @layer, glass tokens, base transition, fallback, hardcoded values)
- Session 2: Fixes 7-11 (a11y extraction, render mode rules, index.ts, responsive, comments)

**SCOPE: Card container shell ONLY.** Do NOT touch molecule card classes (.blog-card, .flip-box, .slide-card, .team-card, .reveal-card, .glow-card, .choice-card, .info-card, .rainbow-border). Those are molecule audit tasks.

---

## Decisions (confirmed)

| # | Decision | Outcome |
|---|----------|---------|
| D1 | a11y.css (1173 lines) | Extract ~50 lines of Card-only rules. Move entire file to `_reference/Card/`. Molecule rules stay for molecule audit. |
| D2 | Theme overrides (lines 796-1173) | Dead code — file says so. Don't extract. Goes to `_reference/` with rest. |
| D3 | Typography primitives | Keep for now. Deferred to molecule consumer migration phase. |
| D4 | .card__button / .card__badge | Keep for now. Consumers migrate to Button/Badge atoms during molecule audit. |
| D5 | var(--card-hover-border, fallback) | Remove fallback. Set default on the class. |
| D6 | Hardcoded px in comic/tech | Accept with comments — variant-specific design values. blur(12px) → var(--glass-blur). |
| D7 | Card-as-link touch targets | Add min-height: 64px in assistive for .card--link. |
| D8 | Base transition | Split — border-color stays on base. Transform + box-shadow move to hover effect classes. |
| D9 | Hover prop grouping | hover is animation, not visual. Stripped in reduced render. |
| D10 | Glass tokenisation | Use glass tokens. Liquid-glass internal tokens (--card-lg-*) acceptable. |
| D11 | Textonly images | Do NOT force-hide .card__image. Image atom handles its own textonly rendering based on semanticRole. Decorative → hidden. Meaningful → alt text via replace mode. |

---

## Fix 1: Schema restructure — Card.schema.json

Replace the entire file:

```json
{
  "component": "Card",
  "category": "atom",
  "renders": {
    "full": "Card.astro",
    "reduced": "Card.astro",
    "assistive": "Card.astro",
    "textonly": "Card.astro"
  },
  "notes": "Pure container shell — visual chrome only (bg, border, radius, shadow). Children handle their own layout and content. Molecule cards use <Card> as outer wrapper. In textonly render, card becomes transparent bordered box — Image atoms inside handle their own visibility via semanticRole.",

  "props": {
    "content": {
      "_description": "What the card is and where it goes",
      "as":         { "type": "string",  "required": false, "default": "div", "enum": ["div", "article", "section", "aside", "li"], "description": "HTML element." },
      "href":       { "type": "string",  "required": false, "default": null, "description": "Makes card a link. Renders as <a>." },
      "separator":  { "type": "boolean", "required": false, "default": false, "description": "Visible border between header/body/footer." },
      "flush":      { "type": "boolean", "required": false, "default": false, "description": "Remove margin-bottom." }
    },

    "visual": {
      "_description": "How the card looks",
      "variant":    { "type": "string",  "required": false, "default": "default", "enum": ["default", "transparent", "outline", "glass", "liquid-glass", "neumorphic", "neumorphic-pressed", "comic", "tech"], "description": "Visual style." },
      "shadow":     { "type": "string",  "required": false, "default": null, "enum": ["none", "sm", "md", "lg", "xl"], "description": "Box shadow." },
      "dropShadow": { "type": "string",  "required": false, "default": null, "enum": ["none", "sm", "md", "lg", "xl"], "description": "Filter drop-shadow for non-rect shapes." },
      "radius":     { "type": "string",  "required": false, "default": null, "enum": ["none", "sm", "md", "lg", "xl", "full"], "description": "Border radius." },
      "padding":    { "type": "string",  "required": false, "default": null, "enum": ["none", "xs", "sm", "md", "lg", "xl", "2xl"], "description": "Internal padding." },
      "border":     { "type": "string",  "required": false, "default": null, "enum": ["none", "thin", "medium", "thick"], "description": "Border width." },
      "layout":     { "type": "string",  "required": false, "default": null, "enum": ["masonry"], "description": "Layout context." },
      "class":      { "type": "string",  "required": false, "default": "", "description": "Additional CSS classes." }
    },

    "animation": {
      "_description": "Motion behaviour — stripped in reduced/assistive/textonly renders",
      "hover": { "type": ["boolean", "string"], "required": false, "default": null, "enum": [true, "border", "glow"], "description": "Hover effect: true=lift, 'border'=border-color change, 'glow'=box-shadow glow. Stripped in reduced render — card has no hover motion." }
    }
  },

  "slots": {
    "default": "Card content — use Heading, Text, Badge, Button, Image atoms inside. Structure with .card__header / .card__body / .card__footer."
  }
}
```

Key changes: category → "atom", 4 render keys, props split into content/visual/animation. `hover` moved to animation group — pipeline strips in reduced/assistive/textonly. Slot description updated to reference atoms. Stale "reducedMotion" key removed.

---

## Fix 2: Remove @layer wrappers — Card.css + Card.responsive.css

Remove `@layer components {` wrapper and closing `}` from both files.

---

## Fix 3: Glass variant tokenisation — Card.css

**3a.** `.card--glass` (lines 60-66). Change:
```css
background: color-mix(in oklch, var(--brand-c-bg) 60%, transparent);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid color-mix(in oklch, var(--brand-c-primary-dark) 19%, transparent);
```
To:
```css
background: var(--glass-bg);
backdrop-filter: var(--glass-blur);
-webkit-backdrop-filter: var(--glass-blur);
border: 1px solid var(--glass-border);
```

Note: the glass-bg token uses --color-White not --brand-c-bg. If the Card glass needs the brand background, create a `--glass-bg-brand` token in shadows.css:
```css
--glass-bg-brand: color-mix(in oklch, var(--brand-c-bg) 60%, transparent);
```
Then use `var(--glass-bg-brand)` in Card. Check which looks correct before committing — the existing Card glass uses brand-c-bg for a reason (it tints with the brand).

**3b.** Liquid-glass internal tokens are acceptable — `--card-lg-*` is the same component-scoped pattern as FormField's `--_field-*`.

---

## Fix 4: Base transition split — Card.css

Line 34 currently:
```css
.card {
  transition: transform var(--transition-base),
              box-shadow var(--transition-base),
              border-color var(--transition-fast);
}
```

Change to colour-only on base:
```css
.card {
  transition: border-color var(--transition-fast);
}
```

Move transform + box-shadow transitions to the hover effect classes. Each effect class that uses them should declare its own transition:

`.card--hover-lift` add:
```css
.card--hover-lift {
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-fast);
}
```

`.card--hover-glow` add:
```css
.card--hover-glow {
  cursor: pointer;
  transition: box-shadow var(--transition-base), border-color var(--transition-fast);
}
```

`.card--hover-border` — only uses border-color, which is already on base. No extra transition needed.

`.card--neumorphic` (line 96-98) — already has its own transition declaration. Keep it.

`.card--neumorphic-pressed` (line 114-116) — same, keep.

`.card--comic` (line 132-133) — already has its own transition. Keep.

`.card--tech` (line 153) — already has its own transition. Keep.

---

## Fix 5: Remove fallback — Card.css

Line 203:
```css
border-color: var(--card-hover-border, var(--brand-c-primary));
```
Change to:
```css
border-color: var(--card-hover-border);
```

Add default on the class:
```css
.card--hover-border {
  --card-hover-border: var(--brand-c-primary);
  cursor: pointer;
}
```

---

## Fix 6: Hardcoded value comments — Card.css

Add comments to variant-specific hardcoded values:

Comic (line 130-131):
```css
/* Comic variant — intentional thick border and hard offset shadow for comic-book aesthetic */
border: 3px solid color-mix(in oklch, var(--brand-c-primary) 90%, var(--color-Black));
box-shadow: 5px 7px 0 color-mix(in oklch, var(--brand-c-primary) 80%, var(--color-Black));
```

Tech (line 166):
```css
/* Tech variant — intentional offset for border-frame swap effect */
transform: translate(-6px, -6px);
```

Hover-lift (line 189):
```css
/* Lift effect — intentional small translateY for subtle hover feedback */
transform: translateY(-4px);
```

---

## Fix 7: a11y.css extraction — Card.a11y.css

**ONLY extract Card atom rules. Ignore ALL molecule card rules (FlipCard, SlideCard, etc.).**

### Reduce-motion rules (Card-only, lines 22-37):

These become `[data-render="reduced"]` rules. But with the transition split (Fix 4), most are already handled:
- No hover prop in reduced → no `.card--hover-lift` class → no transform on hover
- Base `.card` transition is border-color only → already instant for non-colour properties

Only things needed:
```css
[data-render="reduced"] .card { transition: none; }
[data-render="reduced"] .card:hover { transform: none; box-shadow: none; }
```

Belt-and-braces — catches any variant that has its own transition (neumorphic, comic, tech).

### Text-only rules (Card-only, lines 190-309):

Extract as `[data-render="textonly"]` rules. **IMPORTANT: Do NOT include `.card__image { display: none }`.** Image atom handles its own textonly rendering via semanticRole.

```css
/* ── Textonly — transparent bordered box, content flows vertically ── */

[data-render="textonly"] .card,
[data-render="textonly"] [data-card] {
  background: transparent;
  border: 1px solid var(--brand-c-neutral-light);
  border-radius: 0;
  box-shadow: none;
  backdrop-filter: none;
  filter: none;
  padding: var(--space-md);
  text-align: left;
  transform: none;
  min-height: 0;
  overflow: visible;
}

/* Link cards get primary border — visually clickable */
[data-render="textonly"] .card--link {
  border-color: var(--brand-c-primary);
}

/* Kill hover effects */
[data-render="textonly"] .card:hover,
[data-render="textonly"] [data-card]:hover {
  transform: none;
  box-shadow: none;
  background: transparent;
}

/* Border variants stripped */
[data-render="textonly"] .card--border-thin,
[data-render="textonly"] .card--border-medium,
[data-render="textonly"] .card--border-thick {
  border: 1px solid var(--brand-c-neutral-light);
}

/* Masonry resets to block flow */
[data-render="textonly"] .card--masonry {
  display: block;
  margin-bottom: var(--space-sm);
}

/* Overlay hidden — decorative scrim */
[data-render="textonly"] .card__overlay {
  display: none;
}

/* Content wrapper strips visual chrome */
[data-render="textonly"] .card__content {
  padding: 0;
  background: none;
  border-radius: 0;
  box-shadow: none;
  backdrop-filter: none;
  text-align: left;
  align-items: flex-start;
  min-height: 0;
  height: auto;
}

/* Decorative icons hidden */
[data-render="textonly"] .card__icon:not([aria-label]),
[data-render="textonly"] .card__icon-wrapper:not(:has([aria-label])),
[data-render="textonly"] .card__quote-icon {
  display: none;
}

/* Arrow hidden — decorative */
[data-render="textonly"] .card__arrow {
  display: none;
}

/* Strip text shadows */
[data-render="textonly"] .card * {
  text-shadow: none;
}

/* Separator between stacked cards */
[data-render="textonly"] .card--separator + .card--separator {
  border-top: 1px solid currentColor;
  padding-top: var(--space-sm);
}
```

Note: NO `!important` anywhere. The textonly rules don't need to fight variant classes because in textonly render, visual props are stripped by the pipeline — variant classes don't exist in the HTML.

### Assistive rules:

```css
/* ── Assistive — simplified chrome, large link targets ── */

[data-render="assistive"] .card { transition: none; }
[data-render="assistive"] .card:hover { transform: none; }

[data-render="assistive"] .card--link {
  min-height: 64px;
}

[data-render="assistive"] .card--link:focus-visible {
  outline-width: 3px;
}
```

### After extraction:
- Move Card.a11y.css to `_reference/Card/Card.a11y.css`
- Move Card.a11y.recovery.css to `_reference/Card/Card.a11y.recovery.css`

---

## Fix 8: Highlight-links — append to global file

Add to `src/styles/global/highlight-links.css`:

```css
/* Card — link cards get visible primary border */
[data-highlight-links] .card--link {
  border: 2px solid var(--brand-c-primary);
}
```

---

## Fix 9: index.ts cleanup

```ts
import './Card.css';
import './Card.responsive.css';

export { default as Card } from './Card.astro';
export { default as schema } from './Card.schema.json';
```

Remove `import './Card.a11y.css'`.

---

## Fix 10: Card.responsive.css — remove @layer

Already covered in Fix 2. Also check for any `.card__image` specific responsive rules — if they only affect the image container sizing, keep them (Image atom handles its own responsive). If they affect card layout around images, keep.

---

## Fix 11: Stale comments — Card.css + Card.astro

**Card.css:**
- Remove `@layer components` reference from doc comment
- Update "Sections" list in doc comment to include render mode overrides

**Card.astro:**
- Remove `Card.a11y.css` from styles comment (line 39)
- Remove `@layer components` from doc comment (line 3)
- Update slot documentation to reference atoms instead of raw CSS classes

---

## Post-fix verification

1. `grep -r "atoms/ui" Card.schema.json` returns 0 matches
2. `grep -r "@layer" Card.css Card.responsive.css` returns 0 matches
3. `grep -r "Card.a11y.css" index.ts` returns 0 matches
4. `grep -r "card-hover-border," Card.css` returns 0 matches (no fallback comma)
5. `grep -r "blur(12px)" Card.css` returns 0 matches (tokenised)
6. `grep -r "display: none" Card.css` — should NOT match `.card__image` (Image atom handles itself)
7. Card.css has `[data-render="reduced"]`, `[data-render="assistive"]`, `[data-render="textonly"]` rules
8. Schema has 4 render keys, `hover` in animation group
9. highlight-links.css has Card rules
10. Card.a11y.css in `_reference/Card/`

---

## Cross-atom notes (for audit-log.md)

```
- ARCHITECTURE: Card is a dumb container. It does NOT hide child images in textonly — Image atom handles its own visibility via semanticRole. Decorative images → hidden. Meaningful images → alt text via replace mode.
- ARCHITECTURE: Textonly card keeps thin neutral border for structure. Link cards get primary border for click indication. No !important needed — pipeline strips visual props so variant classes don't exist in textonly HTML.
- ARCHITECTURE: hover prop is animation, not visual. Pipeline strips in reduced/assistive/textonly. No hover class = no motion on card.
- ARCHITECTURE: Base .card transition is border-color only. Transform + box-shadow transitions live on individual hover/variant effect classes.
- DEFERRED: Typography primitives (.card__heading, .card__title, .card__text, .card__value, .card__quote, .card__author) — consumers should migrate to Heading, Text atoms. Delete these classes when all 22 molecule consumers are updated.
- DEFERRED: .card__button and .card__badge — consumers should use Button and Badge atoms. Delete when molecule consumers updated.
- DEFERRED: Molecule card rules (FlipCard, SlideCard, BlogCard, TeamCard, GlowCard, InfoCard, ChoiceCard, ImageRevealCard, AssetCard, RainbowBorderCard) — all in _reference/Card/Card.a11y.css. Extract during each molecule's audit.
- DEFERRED: Badge text on images — molecule cards (BlogCard, InfoCard etc.) that render Badge + Image should append badge label to Image altWord in assistive/textonly. Implement during molecule audit.
- DEFERRED: Card textonly should ensure child Image atoms switch to data-alt-display-mode="replace" for meaningful images. Molecule passes semanticRole and display mode props to Image.
- MIGRATION: Glass variant tokenised — uses var(--glass-bg) or var(--glass-bg-brand) instead of hardcoded color-mix.
```
