# Stelladore v3.1 — CSS System Contract & Migration Ledger

This document is the authoritative forensic ledger for all CSS stylesheets transferred into **Stelladore v3.1**.

For every file transferred, this ledger records:
1. **Defined Classes** (and cascade layer)
2. **Class Consumers**
3. **Consumed Tokens**
4. **Token Definitions & Origins**
5. **Gate & Zone Overrides**
6. **JavaScript & Runtime Interactions**
7. **Schema & Content Vocabulary**
8. **Cascading Overrides & Duplications**
9. **Identified Bugs & Leaks** (Syntax errors, phantom tokens, accessibility leaks, specificity traps)
10. **Migration Status & Health**

---

## Index of Audited Stylesheets

| Category | File Path | Cascade Layer | Classes Defined | Tokens Consumed | Health / Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Base** | [`src/styles/base/reset.css`](file:///C:/Users/Business/Stelladore%20v3.1/src/styles/base/reset.css) | `@layer reset` | 0 | 0 | Clean (1 A11y Leak Flagged) |

---

## Detailed System Audits

### 1. `src/styles/base/reset.css`

- **File Path**: `src/styles/base/reset.css`
- **Category**: Base / Reset
- **Cascade Layer**: `@layer reset` (Lowest priority in CSS cascade — automatically yields to unlayered token and component styles)

#### A. Classes Defined
- **Zero classes defined.**
- Elements targeted: `*`, `*::before`, `*::after`, `html`, `html:focus-within`, `body`, `ul[role="list"]`, `ol[role="list"]`, `a`, `img`, `picture`, `video`, `canvas`, `svg`, `input`, `button`, `textarea`, `select`, `fieldset`, `table`, `address`.
- References `.btn` on line 52 (`a:visited:not(.btn)`) to exempt button links from visited-link color inheritance.

#### B. Where Classes are Consumed
- N/A (defines no classes; element resets apply unconditionally across the entire DOM tree).

#### C. Tokens Consumed
- **Zero tokens consumed.**
- Pure CSS keywords and literals: `border-box`, `0`, `smooth`, `100%`, `100vh`, `optimizeSpeed`, `1.5`, `inherit`, `auto`, `none`, `pointer`, `vertical`, `collapse`, `normal`.

#### D. Where Tokens are Defined
- N/A (no tokens consumed).

#### E. Gate & Zone Overrides
- `body { line-height: 1.5; }`: Overridden by `global.css:151` with `var(--leading-normal)` and multiplied by `--a11y-line-height` when adjusted in the YourView accessibility panel.
- `a { color: inherit; }`: Overridden by `highlight-links.css` when user link-highlighting mode is active.
- `button { background: none; border: none; cursor: pointer; }`: Overridden by `Button.css` with tokenized padding, borders, shadows, and hover effects.

#### F. JavaScript / Runtime References
- **No JavaScript runtime queries reset selectors.**
- `ul[role="list"]` / `ol[role="list"]` adheres to the Andy Bell reset pattern to preserve Safari VoiceOver semantic list announcements when `list-style: none` is applied.

#### G. Schema / Content Boundary
- **Internal Document Foundation.**
- Cannot be requested by content JSON or schemas; loaded unconditionally as the first stylesheet in `global.css`.

#### H. Cascade Overrides & Duplications
- `global.css:147` overrides `body` font, weight, color, background, and line height.
- Component stylesheets (`FormField.css`, `Button.css`, `Image.css`, `List.css`) override specific form and media element defaults.
- No duplicate reset stylesheets exist in active code.

#### I. Identified Bugs & Leaks
- **Accessibility Leak (Reduced Motion)**: Lines 23 & 28 declare `scroll-behavior: smooth;` unconditionally on `html`. Line 75 references an old archived file `/* prefers-reduced-motion → a11y/motion/reduced-motion.css */`. However, active gate `src/styles/gates/reduced-gate.css` does not suppress `scroll-behavior: smooth` on `html`. Users with vestibular disorders or OS-level `prefers-reduced-motion: reduce` will still experience smooth scrolling.
  - *Recommended Fix in Phase 2*: Add `@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }` or gate in `reduced-gate.css`.
- **Standards Gap**: Line 24 uses `-webkit-text-size-adjust: 100%` without the standard unprefixed `text-size-adjust: 100%`.

#### J. Migration Status
- Transferred to `Stelladore v3.1/src/styles/base/reset.css` with compact system contract docblock header.
