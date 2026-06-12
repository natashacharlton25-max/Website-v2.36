# Claude Code Task: Implement Hover Gate System

## Overview

Add a global `data-hover` gate that controls ALL decorative hover effects
via CSS custom property tokens. Functional hover (tooltip show, dropdown open)
is never suppressed — only its animation is removed.

Two separate files to create/modify:
1. New global token file for the hover gate
2. Retrofit 4 atoms: Button, Card, Link, FormField

## Concepts

**Decorative hover** = changes appearance (colour, shadow, scale, border).
Purpose: visual feedback. Fully suppressible.

**Functional hover** = reveals content (tooltip, dropdown, submenu).
Purpose: shows information. NEVER suppressed. Animation only removed.

## Step 1: Create hover gate token file

Create `src/styles/gates/hover-gate.css`

This file should be imported in global.css AFTER zone files, BEFORE component CSS.

```css
/* ══════════════════════════════════════════════════════════════
   Hover Gate — Your View panel controls
   
   data-hover on <body>:
     "none"    — zero decorative hover. Functional hover instant.
     "instant" — decorative hover fires, zero transition duration.
     "gentle"  — decorative hover with slow transition.
     "full"    — decorative hover with authored timing (default).
   
   Components read --hover-* tokens. Gate sets token values.
   No !important. No overrides. Tokens resolve to "no change"
   when gate is "none".
   ══════════════════════════════════════════════════════════════ */

/* ── Default (full) — authored timings ── */
:root {
  --hover-duration: var(--transition-base);
  --hover-duration-fast: var(--transition-fast);
  --hover-scale: 1.03;
  --hover-brightness: 1.08;
  --hover-shadow-lift: var(--shadow-md);
  --hover-shadow-glow: var(--glow-neon);
  --hover-translate-y: -2px;
  --hover-state: 1;
  /* --hover-state: 1 = decorative hover active, 0 = suppressed.
     Components use this to flip between hover and default values. */
}

/* ── None — zero decorative change ── */
[data-hover="none"] {
  --hover-duration: 0s;
  --hover-duration-fast: 0s;
  --hover-scale: 1;
  --hover-brightness: 1;
  --hover-shadow-lift: none;
  --hover-shadow-glow: none;
  --hover-translate-y: 0;
  --hover-state: 0;
}

/* ── Instant — state changes, no transition ── */
[data-hover="instant"] {
  --hover-duration: 0s;
  --hover-duration-fast: 0s;
  /* Scale, brightness, shadow etc stay at default authored values.
     The change happens, just immediately. */
}

/* ── Gentle — slow smooth transition ── */
[data-hover="gentle"] {
  --hover-duration: 0.4s;
  --hover-duration-fast: 0.25s;
}

/* ── Full — default, no overrides needed ── */
/* [data-hover="full"] uses :root defaults */


/* ══════════════════════════════════════════════════════════════
   Functional hover — tooltip, dropdown
   
   Content ALWAYS appears. Only transition is affected.
   data-hover="none" = content appears instantly (no animation).
   data-hover="instant" = same.
   data-hover="gentle"/"full" = content appears with authored animation.
   ══════════════════════════════════════════════════════════════ */

[data-hover="none"] .tooltip__content,
[data-hover="none"] .dropdown-menu {
  transition-duration: 0s;
}

[data-hover="instant"] .tooltip__content,
[data-hover="instant"] .dropdown-menu {
  transition-duration: 0s;
}


/* ══════════════════════════════════════════════════════════════
   Highlight Links Gate — Your View panel controls
   
   data-highlight on <body>:
     "none"     — links look normal, no highlight.
     "static"   — visual highlight (border/bg), no animation.
     "animated" — highlight with pulse/glow animation.
   ══════════════════════════════════════════════════════════════ */

:root {
  --link-highlight-border: none;
  --link-highlight-bg: transparent;
  --link-highlight-animation: none;
}

[data-highlight="none"] {
  --link-highlight-border: none;
  --link-highlight-bg: transparent;
  --link-highlight-animation: none;
}

[data-highlight="static"] {
  --link-highlight-border: 2px solid var(--color-accent, var(--brand-c-primary));
  --link-highlight-bg: var(--color-accent-subtle, oklch(from var(--brand-c-primary) l c h / 0.08));
  --link-highlight-animation: none;
}

[data-highlight="animated"] {
  --link-highlight-border: 2px solid var(--color-accent, var(--brand-c-primary));
  --link-highlight-bg: var(--color-accent-subtle, oklch(from var(--brand-c-primary) l c h / 0.08));
  --link-highlight-animation: highlight-pulse 2s ease-in-out infinite;
}

@keyframes highlight-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
```

## Step 2: Import in global.css

Add the import AFTER zone files, BEFORE component imports.
Find the correct insertion point — after the last zone import.

```css
/* After zone imports */
@import './gates/hover-gate.css';
```

If a `gates/` directory doesn't exist, create it.
Check if there are other gate files that should live here too.

## Step 3: Retrofit Button atom

File: `src/components/atoms/Button/Button.css`

### 3a. Base hover — make decorative properties read tokens

Find `.btn:hover` (line ~48). The colour changes in this rule need to
resolve to "no change" when data-hover="none".

APPROACH: Don't modify the :hover rule itself. Instead, make the hover
property values conditional on --hover-state.

For each decorative property in .btn:hover, the value should come from
a local token that the hover gate can zero out:

```css
/* Base — set hover targets */
.btn {
  --_btn-hover-bg: var(--btn-hover-bg);
  --_btn-hover-color: var(--btn-hover-color);
  --_btn-hover-border: var(--btn-hover-border);
  --_btn-hover-shadow: var(--btn-hover-shadow);
  transition: background-color var(--hover-duration),
              color var(--hover-duration),
              border-color var(--hover-duration),
              box-shadow var(--hover-duration);
}
```

When data-hover="none", --hover-duration is 0s and the visual tokens
resolve to the same as default (via --hover-state: 0).

BUT — this is complex for Button because it has so many variants and effects.
The SIMPLER approach for Button:

```css
/* At the TOP of Button.css, after the base .btn block */

/* Hover gate — suppresses ALL decorative hover when data-hover="none" */
[data-hover="none"] .btn:hover,
[data-hover="none"] .btn--outline:hover,
[data-hover="none"] .btn--ghost:hover,
[data-hover="none"] .btn--glass:hover,
[data-hover="none"] .btn--glow:hover,
[data-hover="none"] .btn--neumorphic:hover {
  background-color: inherit;
  color: inherit;
  border-color: inherit;
  box-shadow: inherit;
  transform: none;
  filter: none;
}

/* Effect hovers — suppressed when none */
[data-hover="none"] .btn--glint:hover::before,
[data-hover="none"] .btn--colour-flow:hover,
[data-hover="none"] .btn--jump:hover,
[data-hover="none"] .btn--comic:hover,
[data-hover="none"] .btn--tech:hover,
[data-hover="none"] .btn--expand:hover,
[data-hover="none"] .btn--underline:hover,
[data-hover="none"] .btn--spotlight:hover,
[data-hover="none"] .btn--split:hover,
[data-hover="none"] .btn--confetti:hover::after {
  background-color: inherit;
  color: inherit;
  border-color: inherit;
  box-shadow: inherit;
  transform: none;
  filter: none;
  opacity: inherit;
}
```

WAIT — this uses inherit which might not resolve correctly. 
And it's a long selector list.

BETTER APPROACH — use the token method but scoped:

```css
/* 
   In .btn base, replace every hardcoded transition with:
   transition: <properties> var(--hover-duration);
   
   That handles instant/gentle/full.
   
   For "none" — we need the hover :hover rules to produce no visual change.
   The cleanest way without !important:
*/

/* Add to Button.css, near the render mode section at bottom */

/* ── Hover gate: none ── */
[data-hover="none"] .btn { pointer-events: auto; }

[data-hover="none"] .btn:not(:focus-visible):hover {
  background-color: var(--_btn-bg);
  color: var(--_btn-text);
  border-color: var(--_btn-border);
  box-shadow: var(--_btn-shadow);
  transform: none;
  filter: none;
}
```

ACTUALLY — the cleanest approach depends on how Button currently 
structures its internal tokens. 

**INSTRUCTION TO CLAUDE CODE:**
1. Read Button.css fully first
2. Identify the internal token pattern (--_btn-* naming)
3. For data-hover="none": make :hover resolve to same values as default state
4. For all transitions: replace hardcoded timings with var(--hover-duration)
5. Keep :focus-visible COMPLETELY UNTOUCHED
6. Keep disabled hover COMPLETELY UNTOUCHED
7. Keep dropdown/functional hover COMPLETELY UNTOUCHED
8. Add [data-render="reduced"] .btn { transition: none; } if missing
9. Test: with data-hover="none" on body, NO button should change appearance on hover
10. Test: with data-hover="instant", buttons should change appearance immediately
11. Test: with data-hover="full", buttons should behave exactly as they do now

### 3b. Tokenise hardcoded timings

Replace every hardcoded transition timing in Button.css with the 
appropriate hover-duration token:

| Current | Replace with |
|---------|-------------|
| 0.2s ease | var(--hover-duration-fast) |
| 0.25s ease | var(--hover-duration) |
| 0.3s ease | var(--hover-duration) |
| 0.35s cubic-bezier(...) | var(--hover-duration) cubic-bezier(...) |
| 0.45s cubic-bezier(...) | var(--hover-duration) cubic-bezier(...) |
| 0.6s ease | var(--hover-duration) |
| 3s ease | This is colour-flow gradient — KEEP as-is or use separate token |

Keep the easing function (ease, cubic-bezier) — only replace the duration.
The easing is part of the design, the duration is what the user controls.

Special case: `all 3s ease` on colour-flow (line 276) is a continuous 
animation, not a hover transition. This should probably be gated by the 
component animation system, not the hover gate. Flag it for review.

## Step 4: Retrofit Card atom

File: `src/components/atoms/Card/Card.css`

Card ALREADY has a hover prop. The only changes:

### 4a. Hover survives reduced render as instant

Currently Card's doc says "Hover is animation — stripped in reduced render."
Change: hover is NOT animation. In reduced render, hover effects still 
fire but with duration 0s.

Find the [data-render="reduced"] section. Change from:
```css
/* Currently strips hover entirely */
[data-render="reduced"] .card--hover-lift:hover,
[data-render="reduced"] .card--hover-border:hover,
[data-render="reduced"] .card--hover-glow:hover {
  transform: none;
  box-shadow: inherit;
  /* etc */
}
```

To: just kill the transition, let the state change happen instantly:
```css
[data-render="reduced"] .card {
  transition: none;
}
/* Remove the hover state overrides — let hover work, just instantly */
```

### 4b. Tokenise 2 hardcoded timings

Lines 169-170: `0.25s ease` on comic → `var(--hover-duration)`
Line 207: `0.25s ease` on tech → `var(--hover-duration)`

### 4c. Add hover="none" support

When data-hover="none" on body, Card hover effects produce no visual change
even if the hover prop is set:

```css
[data-hover="none"] .card--hover-lift:hover,
[data-hover="none"] .card--hover-border:hover,
[data-hover="none"] .card--hover-glow:hover {
  transform: none;
  box-shadow: var(--_card-shadow);
  border-color: var(--_card-border);
}
```

## Step 5: Retrofit Link atom

File: `src/components/atoms/Link/Link.css`

### 5a. Base hover reads hover-duration

Replace transition on line 34:
```css
/* Before */
transition: color var(--transition-base);
/* After */  
transition: color var(--hover-duration);
```

### 5b. data-hover="none" suppresses decorative hover

```css
[data-hover="none"] .link:hover,
[data-hover="none"] .link--underline:hover,
[data-hover="none"] .link--border:hover,
[data-hover="none"] .link--ghost:hover {
  color: inherit;
  border-color: inherit;
  background-color: inherit;
}

[data-hover="none"] .link--animate-underline-grow:hover::after,
[data-hover="none"] .link--animate-highlight-grow:hover::before,
[data-hover="none"] .link--animate-shadow-fill:hover,
[data-hover="none"] .link--animate-text-slide:hover {
  transform: none;
  opacity: inherit;
  box-shadow: inherit;
  letter-spacing: inherit;
}
```

### 5c. Tokenise 1 hardcoded timing

Line 180: `300ms cubic-bezier(0.76, 0, 0.24, 1)`
→ `var(--hover-duration) cubic-bezier(0.76, 0, 0.24, 1)`

### 5d. All other transitions → hover-duration

Anywhere Link uses `var(--transition-base)` for hover transitions,
change to `var(--hover-duration)`.

## Step 6: Retrofit FormField atom

File: `src/components/atoms/FormField/FormField.css`

### 6a. Card-face hover reads hover gate

```css
[data-hover="none"] .form-field__card-face:hover {
  background-color: var(--_card-bg);
  border-color: var(--_card-border);
  box-shadow: var(--_card-shadow);
}
```

### 6b. Form control transitions read hover-duration

The 6 transitions on checkbox/radio/toggle are arguably functional 
(they show state change). BUT the transition animation is decorative.
Replace `var(--transition-fast)` with `var(--hover-duration-fast)` 
on these so instant mode kills the animation but the state change 
(checked → unchecked visual) still happens.

## Step 7: Update zone files

### theme-luminance-dark.css
Line 165: `[data-mode="dark"] .btn:hover` — this inherits whatever 
Button now does. If Button's hover is suppressed by data-hover="none", 
the dark mode override also produces no change because it targets the 
same selector. NO CHANGES NEEDED — it follows automatically.

### high-contrast.css  
Line 14: Same — `[data-high-contrast] .btn--glow:hover` follows 
Button's gating. NO CHANGES NEEDED.

### theme-cards.css
Line 25: `.a11y-theme-card:hover` — LEGACY. Don't fix now. Gets 
replaced when that component is audited. Add a TODO comment:
```css
/* TODO: Replace .a11y-theme-card with token-gated hover system */
```

## Step 8: Update utilities.css

### Prose link hover
Line 665: `.prose a:hover` — add hover-duration:
```css
.prose a {
  transition: color var(--hover-duration);
}

[data-hover="none"] .prose a:hover {
  color: inherit;
}
```

### Old tooltip system
Lines 277-374: `[data-tooltip]:hover` — add deprecation comment:
```css
/* DEPRECATED: Use <Tooltip> atom instead. 
   Remove when all consumers migrated. */
```

### Prose table row hover
Line 700: `.prose tr:hover td` — add hover-duration:
```css
.prose tr {
  transition: background-color var(--hover-duration-fast);
}

[data-hover="none"] .prose tr:hover td {
  background-color: inherit;
}
```

## Rules
- Do NOT use !important anywhere
- Do NOT touch :focus or :focus-visible rules
- Do NOT touch :disabled hover rules  
- Do NOT touch dropdown-wrapper functional hover (menu open, chevron)
- Do NOT touch tooltip functional hover (content appears)
- Do NOT modify molecules, organisms, or .a11y.css files
- Keep all easing functions (ease, cubic-bezier) — only replace durations
- Test all three render modes still work after changes
- Verify data-hover="none" produces ZERO decorative visual change on hover
- Verify data-hover="full" is identical to current behaviour
- Flag anything unclear rather than guessing
