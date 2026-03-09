# Scott O'Hara — Accessible Component Patterns

**Source:** https://github.com/scottaohara/accessible_components
**Author:** Scott O'Hara — accessibility specialist, user-tested vanilla HTML/CSS/JS patterns
**License:** MIT

---

## Component Index

| Component | Repo | Version | Relevance to us |
|---|---|---|---|
| Tooltips | `scottaohara/a11y_tooltips` | v1 | Direct — validates our Tooltip atom architecture |
| Styled Form Controls | `scottaohara/a11y_styled_form_controls` | - | Direct — FormField atom patterns |
| Accordions | `scottaohara/accessible_accordions` | v3 | Future — FAQ/disclosure patterns |
| Disclosure Widgets | `scottaohara/aria_disclosure_widget` | v2.0.1 | Future — collapsible panels |
| Modal Dialogs | `scottaohara/accessible_modal_window` | v3 (archived) | Reference — focus trap patterns |
| Tab Widgets | `scottaohara/a11y_tab_widget` | v2 | Future — tabbed content |
| Switch Toggles | `scottaohara/aria-switch-button` | v2.0.1 | FormField toggle variant |
| Breadcrumbs | `scottaohara/a11y_breadcrumbs` | v1.1 | Navigation patterns |
| ARIA Buttons | `scottaohara/a11y_button` | v2 | Button atom validation |
| ARIA Links | `scottaohara/aria-links` | v2 | Link atom validation |
| Landmarks Demo | `scottaohara/landmarks_demo` | - | Page structure reference |

---

## Tooltip Pattern (Deep Dive)

### Key Rules

1. **Activation:** Mouse hover OR keyboard focus reveals the tooltip
2. **Single association:** One tooltip per element — either name or description, never both
3. **No title attributes:** Custom tooltips cannot coexist with native `title`
4. **Escape key:** Users must be able to dismiss tooltips via Escape
5. **Brief content only:** If content needs imagery, lists, or complex markup, a tooltip is the wrong pattern
6. **Touch devices:** Quirky behaviour expected; tap-to-dismiss implemented

### Two Tooltip Purposes

| Purpose | ARIA | Trigger gets | Tooltip gets |
|---|---|---|---|
| **Description** (default) | `aria-describedby` on trigger pointing to tooltip `id` | `aria-describedby="tooltip-id"` | `role="tooltip"` |
| **Accessible name** (label mode) | `aria-labelledby` on trigger | Set via `data-tooltip="label"` | Different association |

### HTML Structure

```html
<!-- Wrapper + trigger pattern -->
<div data-tooltip data-tooltip-content="Deleting an asset is permanent">
  <button data-tooltip-trigger>Delete</button>
</div>

<!-- With fallback for no-JS -->
<div data-tooltip>
  <button data-tooltip-trigger aria-describedby="foo">Delete</button>
  <p data-tooltip-tip id="foo">Deleting an asset is permanent.</p>
</div>
```

### aria-hidden on Tooltip Content

Scott marks tooltip content `aria-hidden="true"` by default. Reason:

> The `aria-hidden='true'` will ensure that the tooltip cannot be navigated to by a screen reader's virtual cursor, resulting in a duplicate announcement of the content that was already announced when focusing the element.

The tooltip text is announced via the trigger's `aria-describedby` association. If the tooltip element is also navigable, screen readers announce it twice — once from the association and once from the virtual cursor encountering the element.

### Trigger Requirements

Must be natively focusable: `<button>`, `<a href="">`, or form controls. The script removes any existing `title` attribute to prevent conflicts.

### Comparison with Our Tooltip Atom

| Scott's pattern | Our Tooltip atom | Match? |
|---|---|---|
| Wrapper + trigger + content | `<span>` wrapper + slot trigger + content element | Yes |
| `role="tooltip"` on content | `role="tooltip"` on `.tooltip__content` | Yes |
| `aria-hidden="true"` on content | Only on `label` purpose tooltips | Partial — Scott does it for both |
| Consumer adds `aria-describedby` | Consumer responsibility, `id` exposed | Yes |
| Escape key dismissal | Not implemented (CSS-only) | Gap |
| No title attributes | Not enforced | Gap |
| Two purposes (name vs description) | Two purposes (`label` vs `info`) | Yes |

**Gaps to address:**
- **Escape key:** Our tooltip is CSS-only (hover + focus-within). Scott's JS implementation allows Escape dismissal. For CSS-only, we rely on moving focus away. This is a known limitation.
- **aria-hidden on description tooltips:** Scott applies `aria-hidden="true"` to ALL tooltips to prevent double-announcement. Our atom only does it for `label` purpose. Worth reconsidering — if the description is announced via `aria-describedby`, the visible tooltip element in the DOM is redundant for screen readers.

---

## Styled Form Controls (Deep Dive)

### Checkbox and Radio Patterns

- Styled via CSS over the native `<input>` — not custom div/span replacements
- Screen reader announcements documented per browser/SR combination
- Radio button variants: pill style, star rating
- Group semantics: `<fieldset>` + `<legend>` required

### Switch / Toggle Patterns

| Pattern | HTML base | ARIA | Notes |
|---|---|---|---|
| Switch Checkbox | `<input type="checkbox">` | Enhanced with switch role | Visual toggle, checkbox semantics |
| ARIA Toggle Button | `<button>` | `aria-pressed="true/false"` | Pressed state, not checked state |
| Switch Radio Group | `<input type="radio">` group | Switch semantics on group | Mutual exclusion + toggle visual |

### Progress Bar and Meter

> Unfortunately, neither of these elements are consistently accessible to screen readers.

This matches our experience — native `<progress>` and `<meter>` have poor SR support. Prefer ARIA `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

### File Upload

Styled file upload relies on the **native** `<input type="file">` — not a custom button that triggers a hidden input. The native control provides correct announcements. Custom implementations frequently break SR announcements.

### Search Component

Uses `role="search"` landmark with `<input type="search">`. Discoverable and announced as a search region.

---

## Key Principles (Across All Components)

1. **Start with native HTML** — enhance with ARIA only when native semantics are insufficient
2. **User-tested** — patterns verified with actual screen reader users, not just spec compliance
3. **Vanilla implementation** — no framework dependencies, patterns transferable to any stack
4. **State management matters** — `aria-pressed`, `aria-expanded`, `aria-checked` must stay in sync with visual state
5. **Avoid title attributes** — poorly supported, inconsistent across browsers and assistive tech
6. **Fieldset/legend for groups** — radio buttons, checkbox groups, and related controls need explicit grouping

---

## Relevance to Our Audit Checklist

| Scott's principle | Our checklist section |
|---|---|
| Native HTML first | Section 14.1-14.2 (semantic HTML, ARIA only when needed) |
| aria-hidden on decorative | Section 5.8, 6.1, 14.6 |
| Focus management | Section 6.3-6.7 |
| aria-describedby/labelledby | Section 14.3 |
| Escape key for dismissal | Not currently in checklist — consider adding |
| No title attributes | Not currently in checklist — consider adding |
| Switch vs checkbox semantics | FormField toggle variant validation |
