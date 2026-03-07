# Tooltip Atom — Specification

## What this document is

Complete spec for building the Tooltip atom. Written against `architecture-decisions.md`, `component-audit-checklist-v2.md`, and `CLAUDE.md`. Read all three before building.

---

## 1. What Tooltip Is

Tooltip is a **fixed atom** — its internal structure is set, you toggle parts on or off. It wraps a trigger element and displays contextual content on hover/focus.

Tooltip is **passive information display**. No buttons, no expand/collapse, no toggling by the user (that's a future Answer Reveal molecule). Content appears when the trigger is hovered or focused, disappears when it isn't.

### Two purpose modes

| Purpose | Content is... | Screen reader | Example |
|---------|--------------|---------------|---------|
| `label` | Visual duplicate of existing aria-label | `aria-hidden="true"` — trigger already announced | Icon-only button hint, nav icon label |
| `info` | New information not available elsewhere | Announced via `aria-describedby` | Form field help, status explanation, AAC alt text cards |

The JSON content author sets `purpose` per instance. Same pattern as Image's `semanticRole` — the author knows whether this tooltip adds information or just duplicates what the screen reader already has.

---

## 2. Render Mode Behaviour

Tooltip is pure — it doesn't detect render mode. The pipeline filters props. CSS handles visual differences via `[data-render]`.

### Label purpose

| Render | Behaviour |
|--------|-----------|
| Full | Positioned popup on hover + `:focus-within`, animated entrance |
| Reduced | Positioned popup on hover + `:focus-within`, no animation (instant) |
| Assistive | **Not rendered** — trigger already has text label in assistive render |
| Textonly | **Not rendered** — trigger already has text in textonly |

Label tooltips are decorative visual aids. Pipeline sets `textonly: null` for label instances.

### Info purpose

| Render | Behaviour |
|--------|-----------|
| Full | Positioned popup on hover + `:focus-within`, animated entrance |
| Reduced | Positioned popup on hover + `:focus-within`, no animation (instant) |
| Assistive | Full-width bar (same CSS pattern as Toast non-full renders). Always visible — no hover in Easy Click. |
| Textonly | Content inlined into text flow. Rich content flattened. |

Info tooltips contain real content. They must be accessible in every render mode.

---

## 3. Schema — `Tooltip.schema.json`

```json
{
  "component": "Tooltip",
  "category": "atom",
  "renders": {
    "full": "Tooltip.astro",
    "reduced": "Tooltip.astro",
    "assistive": "Tooltip.astro",
    "textonly": "Tooltip.astro"
  },
  "notes": "Passive contextual display. Label purpose = visual aid, aria-hidden, not rendered in assistive/textonly. Info purpose = real content, announced, always-visible bar in assistive, inlined in textonly. Uses Text atom for simple content, slot for rich content. Existing tooltip CSS extracted from utilities.css.",

  "props": {
    "content": {
      "_description": "What the tooltip says",
      "text":    { "type": "string",  "required": false, "description": "Simple text content. Renders through Text atom. Mutually exclusive with rich slot content." },
      "purpose": { "type": "string",  "required": true,  "enum": ["label", "info"], "description": "Label = visual duplicate of trigger's aria-label (hidden from SR). Info = new information (announced via aria-describedby)." },
      "id":      { "type": "string",  "required": false, "description": "Unique ID for aria-describedby linking. Auto-generated if not provided." }
    },

    "visual": {
      "_description": "How the tooltip looks",
      "position": { "type": "string", "required": false, "default": "top",    "enum": ["top", "bottom", "left", "right"], "description": "Tooltip position relative to trigger." },
      "theme":    { "type": "string", "required": false, "default": "professional", "enum": ["professional", "glass", "neon", "brutalist"], "description": "Visual theme. Stripped to professional in reduced/assistive/textonly." },
      "size":     { "type": "string", "required": false, "default": "md",     "enum": ["sm", "md", "lg"], "description": "Tooltip max-width tier. sm = icon labels, md = help text, lg = rich content." },
      "textTone": { "type": "string", "required": false, "enum": ["light", "dark"], "description": "Text tone for glass/neon themes. Passed to Text atom." }
    },

    "animation": {
      "_description": "Motion behaviour — stripped in reduced/assistive/textonly",
      "entrance": { "type": "string", "required": false, "enum": ["fade", "scale", "slide"], "description": "Entrance animation. No value = instant appear. Stripped in reduced — tooltip appears instantly." }
    }
  }
}
```

### Pipeline routing per render mode

| Render | content props | visual props | animation props |
|--------|--------------|-------------|----------------|
| full | All | All | All |
| reduced | All | All | **Stripped** — no entrance class emitted |
| assistive | All | Stripped to professional | **Stripped** |
| textonly | All | **Stripped** | **Stripped** |

### Label vs info pipeline filtering

- `purpose: "label"` + assistive render → pipeline does not render Tooltip (trigger handles itself)
- `purpose: "label"` + textonly render → pipeline does not render Tooltip
- `purpose: "info"` + assistive render → Tooltip renders as bar
- `purpose: "info"` + textonly render → Tooltip content inlined

---

## 4. Template — `Tooltip.astro`

### Structure

```astro
---
import { Text } from '../Text';

interface Props {
  text?: string;
  purpose: 'label' | 'info';
  id?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  theme?: 'professional' | 'glass' | 'neon' | 'brutalist';
  size?: 'sm' | 'md' | 'lg';
  textTone?: 'light' | 'dark';
  entrance?: 'fade' | 'scale' | 'slide';
  class?: string;
}

const {
  text,
  purpose,
  id = `tooltip-${Math.random().toString(36).slice(2, 8)}`,
  position = 'top',
  theme = 'professional',
  size = 'md',
  textTone,
  entrance,
  class: className,
} = Astro.props;

const isLabel = purpose === 'label';

const wrapperClasses = [
  'tooltip',
  `tooltip--${purpose}`,
  `tooltip--${position}`,
  `tooltip--${theme}`,
  `tooltip--${size}`,
  entrance && `tooltip--animate-${entrance}`,
  className,
].filter(Boolean);
---

<span class:list={wrapperClasses}>
  {/* Trigger — whatever the parent passes in */}
  <span class="tooltip__trigger">
    <slot />
  </span>

  {/* Tooltip content — id exposed for consumer's aria-describedby */}
  <span
    class="tooltip__content"
    id={id}
    role="tooltip"
    {...(isLabel && { 'aria-hidden': 'true' })}
  >
    {text ? (
      <Text as="span" class="tooltip__text" textTone={textTone} flush>
        {text}
      </Text>
    ) : (
      <slot name="content" />
    )}
  </span>
</span>
```

### Key decisions in the template

- **`<span>` wrapper, not `<div>`** — Tooltip wraps inline elements (icons, buttons, badges). Block-level wrapper would break inline flow.
- **`aria-describedby` is the consumer's responsibility** — Tooltip can't reach into the slot to add attributes to the focusable element inside it. Tooltip renders the content element with `id={id}`. The consumer passes `aria-describedby={id}` on their own focusable element. Same principle as Card not reaching into Image. See consumer pattern below.
- **`aria-hidden="true"`** on content for label purpose — trigger already has its own aria-label, tooltip is visual-only.
- **`role="tooltip"`** on content — standard ARIA role for tooltip widgets.
- **`tooltip--${purpose}` in class list** — enables `[data-render] .tooltip--info` and `.tooltip--label` CSS selectors for render mode styling.
- **Text atom** for simple text — inherits textTone, typography tokens, render mode behaviour.
- **Named slot** for rich content — AAC cards, keyboard shortcuts, anything the JSON defines.
- **No entrance default** — `entrance` prop is undefined by default. No prop = no `tooltip--animate-*` class = instant appear. Matches the "no prop = no class = no motion" contract.
- **No JS in the atom** — pure CSS hover/focus trigger. Positioning is CSS-only. No event listeners, no runtime detection.

### Consumer pattern for info tooltips

```astro
<!-- Consumer adds aria-describedby on their focusable element -->
<Tooltip text="We'll send your download links to this email" purpose="info" id="email-tip">
  <FormField
    id="contactEmail"
    label="Your email"
    type="email"
    aria-describedby="email-tip"
  />
</Tooltip>

<!-- Icon button with label tooltip — no aria-describedby needed -->
<Tooltip text="Search" purpose="label" id="search-tip">
  <Button aria-label="Search">
    <Icon name="magnifying-glass" />
  </Button>
</Tooltip>

<!-- Rich content — AAC cards -->
<Tooltip purpose="info" id="wardrobe-tip">
  <Image slot="default" ... />
  <div slot="content">
    {aacCards}
  </div>
</Tooltip>
```

Tooltip provides `id` on the content. Consumer links it via `aria-describedby` on their focusable. Tooltip never reaches into slotted children.

---

## 5. Styles — `Tooltip.css`

### Source material

Extract the tooltip system from `src/styles/base/utilities.css` (lines 230–492). This has:
- 4 positions (top, bottom, left, right) via `::before`/`::after` pseudo-elements
- 7 themes
- Hover-triggered opacity/transform animation

**Do NOT copy the pseudo-element approach.** The utilities.css version uses `data-tooltip` attribute + `::before`/`::after`. The atom version uses real DOM (`.tooltip__content` span) because:
1. Rich content (AAC cards) can't go in pseudo-elements
2. Text atom can't render inside a pseudo-element
3. `aria-describedby` needs a real element with an ID

### CSS architecture

```
Tooltip.css
├── Base (.tooltip) — relative positioning wrapper
├── Trigger (.tooltip__trigger) — display: inline-flex
├── Content (.tooltip__content) — absolute positioned, hidden by default
├── Visibility — .tooltip:hover .tooltip__content, .tooltip:focus-within .tooltip__content
├── Positions — .tooltip--top/bottom/left/right (transform-origin, offset)
├── Sizes — .tooltip--sm/md/lg (max-width tiers)
├── Themes — .tooltip--professional/glass/neon/brutalist
├── Animation — .tooltip--animate-fade/scale/slide (gated by prop class)
├── Arrow — .tooltip__content::before (CSS triangle, position-aware)
├── [data-render="reduced"] — no animation, instant appear
├── [data-render="assistive"] — full-width bar layout (label type hidden, info type visible)
├── [data-render="textonly"] — label type hidden, info type inlined
```

### Internal tokens

```css
.tooltip {
  --_tooltip-bg: var(--tooltip-bg);
  --_tooltip-text: var(--tooltip-text);
  --_tooltip-border: var(--tooltip-border);
  --_tooltip-radius: var(--radius-md);
  --_tooltip-padding: var(--space-xs) var(--space-sm);
  --_tooltip-max-width: 200px;  /* Size tier base — intentional, overridden by --sm/--md/--lg classes */
  --_tooltip-offset: var(--space-xs);
  --_tooltip-z: var(--z-tooltip);  /* CHECK: does --z-tooltip token exist? If not, create in tokens/z-index.css. Do NOT hardcode 9998. */
}
```

Underscore prefix = component-private, not for external override. Render mode blocks override these for bar layout.

### Existing tokens to use

From the token files:
- `--tooltip-bg`, `--tooltip-text`, `--tooltip-border` — base colours
- `--tooltip-dark-bg`, `--tooltip-dark-text` — dark variant
- `--glass-bg-*`, `--glass-border-*`, `--glass-blur-*` — glass theme
- `--glow-neon`, `--glow-text` — neon theme
- `--radius-*`, `--space-*`, `--shadow-*` — sizing and effects
- `--transition-fast` — animation timing

### Visibility rules

```css
/* Hidden by default */
.tooltip__content {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}

/* Visible on hover OR focus-within — keyboard and AT trigger same display */
.tooltip:hover .tooltip__content,
.tooltip:focus-within .tooltip__content {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}
```

`:focus-within` is critical — keyboard, switch, eye gaze all trigger focus. Hover alone excludes them.

### Animation gating

```css
/* No entrance prop = no class = instant appear (opacity only) */

/* Fade entrance — gated by prop class */
.tooltip--animate-fade .tooltip__content {
  transition: opacity var(--transition-fast);
}

/* Scale entrance — gated by prop class */
.tooltip--animate-scale .tooltip__content {
  transform: scale(0.9);
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.tooltip--animate-scale:hover .tooltip__content,
.tooltip--animate-scale:focus-within .tooltip__content {
  transform: scale(1);
}

/* Slide entrance — direction based on position */
.tooltip--animate-slide.tooltip--top .tooltip__content {
  transform: translateY(var(--space-xs));
  transition: opacity var(--transition-fast), transform var(--transition-fast);
}

.tooltip--animate-slide.tooltip--top:hover .tooltip__content,
.tooltip--animate-slide.tooltip--top:focus-within .tooltip__content {
  transform: translateY(0);
}
/* ... repeat for bottom/left/right with appropriate axis */
```

No entrance prop → no `tooltip--animate-*` class → transitions never fire → opacity flips instantly. Same gating pattern as every other atom.

### Render mode blocks

```css
/* REDUCED — instant appear, no animation */
[data-render="reduced"] .tooltip__content {
  transition: none;
}

/* ASSISTIVE — info tooltips become full-width bar, labels hidden */
[data-render="assistive"] .tooltip--info .tooltip__content {
  /* Bar layout — same pattern as Toast non-full */
  position: static;
  --_tooltip-max-width: 100%;
  --_tooltip-radius: 0;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  background: var(--brand-c-bg);
  color: var(--brand-c-text);
  border: 1px solid var(--brand-c-neutral-light);
  box-shadow: none;
  backdrop-filter: none;
}

/* Label tooltips not rendered in assistive (pipeline handles, CSS backup) */
[data-render="assistive"] .tooltip--label .tooltip__content {
  display: none;
}

/* TEXTONLY — info content inlined, labels hidden */
[data-render="textonly"] .tooltip--info .tooltip__content {
  position: static;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
  max-width: none;
}

[data-render="textonly"] .tooltip--label .tooltip__content {
  display: none;
}

/* Arrow hidden in non-full renders */
[data-render="reduced"] .tooltip__content::before,
[data-render="assistive"] .tooltip__content::before,
[data-render="textonly"] .tooltip__content::before {
  display: none;
}
```

**Note:** These `[data-render]` selectors style Tooltip's own layout/chrome. They do NOT reach into child atoms. If rich content contains Image, Card, Text — those atoms handle their own render mode behaviour.

---

## 6. Responsive — `Tooltip.responsive.css`

```css
/* Under 768px — tooltip repositions to bottom to avoid viewport clipping */
@media (max-width: 768px) {
  .tooltip--left .tooltip__content,
  .tooltip--right .tooltip__content {
    /* Reposition to bottom — left/right clips on narrow viewports */
    /* Override positioning to bottom variant */
  }
}

/* Under 500px — all tooltips become bottom-positioned, full-width */
@media (max-width: 500px) {
  .tooltip__content {
    --_tooltip-max-width: calc(100vw - var(--space-lg) * 2);
    left: 50%;
    transform: translateX(-50%);
  }
}
```

Tooltip.responsive.css handles the atom's own visual scaling. It does NOT change layout — that's the container's job.

---

## 7. File Structure

```
atoms/Tooltip/
├── Tooltip.astro
├── Tooltip.css
├── Tooltip.responsive.css
├── Tooltip.schema.json
└── index.ts
```

No `Tooltip.a11y.css`. No `Tooltip.animation.css`. Render mode CSS lives in `Tooltip.css` via `[data-render]` selectors. Animation gated by prop classes in `Tooltip.css`.

### index.ts

```ts
import './Tooltip.css';
import './Tooltip.responsive.css';

export { default as Tooltip } from './Tooltip.astro';
export { default as schema } from './Tooltip.schema.json';
```

---

## 8. Extraction from utilities.css

The existing tooltip system in `src/styles/base/utilities.css` (lines 230–492) needs to be:

1. **Read fully** — identify every rule and what it does
2. **Categorised** — which rules map to Tooltip.css, which are dead code, which go elsewhere
3. **Extracted** — rules that map to the new atom's CSS get adapted (selector format, token usage)
4. **Original preserved** — move the utilities.css tooltip block to `_reference/Tooltip/utilities-tooltip-extract.css`
5. **References updated** — any component currently using `data-tooltip` attribute gets flagged for migration to the Tooltip atom

**Do NOT delete the utilities.css block until all consumers are migrated.** Both systems can coexist during migration. Flag consumers for migration in the audit log.

Known consumers to migrate:
- `ReaderNav` — bespoke `.info-tooltip` → Tooltip atom with purpose="info"
- `ShareSection` — inline tooltip CSS → Tooltip atom with purpose="label"
- Any element currently using `data-tooltip` attribute → Tooltip atom

---

## 9. Accessibility Checklist (from v2 checklist)

| Section | Check | How Tooltip handles it |
|---------|-------|----------------------|
| 5.7 | Animation classes conditional from props | `tooltip--animate-*` only added when `entrance` prop present. No default — undefined = instant appear. |
| 5.8 | `aria-hidden="true"` on decorative elements | Label purpose content has `aria-hidden="true"` |
| 6.1 | Decorative elements have `aria-hidden` | Arrow pseudo-element is decorative, CSS-only |
| 6.3 | Interactive elements keyboard-reachable | Trigger is whatever the parent passes — inherits its own focusability |
| 6.4 | No hover-only content without `:focus-within` | `:focus-within` on every hover rule |
| 6.5 | `tabindex="0"` on non-interactive needing focus | Not on Tooltip — trigger element owns its own focus |
| 10.4 | No hover-only behaviour in assistive | Info: always visible. Label: not rendered. |
| 14.3 | `aria-describedby` on elements without visible text | Consumer's responsibility — Tooltip provides content `id`, consumer links via `aria-describedby` on their focusable element |

---

## 10. Relationship to Image Alt Text

Image.css already has a `tooltip` alt text display mode (hover-reveal). This is a **different concept** — it's the Image atom's own CSS for showing alt text on hover using the two-axis system (`data-alt-display-mode="tooltip"`).

The Tooltip atom does NOT replace Image's tooltip display mode. They're independent:

- **Image tooltip mode** — Image atom's CSS shows its own alt text spans on hover/focus. No separate Tooltip component involved.
- **Tooltip atom wrapping Image** — Tooltip wraps Image and provides additional contextual content (AAC cards, extended descriptions) as a positioned popup.

Both can coexist. Image handles its own alt text. Tooltip adds supplementary content around it.

---

## 11. Future: Answer Reveal (separate molecule)

Answer Reveal is NOT part of Tooltip. It's a future molecule with:
- Button trigger (explicit user action, not hover)
- Expand/collapse interaction (`aria-expanded`, `aria-controls`)
- Rounded card or collapsible section
- Content stays visible until user dismisses

Tooltip is passive hover/focus display. Answer Reveal is active toggle interaction. Different components, different accessibility patterns.

---

## Architecture Rules Reminder

- **Tooltip is pure** — doesn't detect render mode, brand, or motion preference
- **Animation = JSON prop → class → CSS** — no entrance prop = instant appear
- **No a11y.css** — render mode CSS in Tooltip.css via `[data-render]`
- **Text atom for text content** — Tooltip doesn't render raw `<span>` text
- **Tooltip doesn't reach into child atoms** — if slot contains Image/Card/Text, those atoms handle themselves
- **All values use tokens** — no hardcoded colours, spacing, radius
- **No `!important`, `@layer`, `.a11y-*`, `#a11y-content-wrapper`, `@media (prefers-reduced-motion)`, `:global()`, scoped `<style>`**
- **`:focus-within` on every hover rule** — keyboard, switch, eye gaze all use focus
