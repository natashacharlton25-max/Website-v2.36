# Hover Gate — Component Audit Checklist Addition

Add these checks to the existing post-atom / molecule / organism audit checklist.
Run on EVERY component as it goes through its full render audit.

## HOVER GATE CHECK

### 1. Identify all :hover rules
```bash
grep -n ":hover" [component].css
```
For each :hover rule, categorise:

| Category | Definition | Action |
|----------|-----------|--------|
| **DECORATIVE** | Changes appearance — colour, shadow, scale, border, glow, filter | Must be suppressible by data-hover="none" |
| **FUNCTIONAL** | Reveals content — tooltip, dropdown, submenu, popover | Never suppressed. Transition reads --hover-duration for instant/full. |
| **DISABLED** | :disabled:hover or [aria-disabled]:hover | Leave alone — no visual change by design |
| **RENDER MODE** | [data-render="reduced/assistive/textonly"] hover reset | Leave alone — already handled |

### 2. Decorative hover — must read tokens

For every DECORATIVE :hover rule:

- [ ] Does hover transition use `var(--hover-duration)` not hardcoded timing?
- [ ] When `data-hover="none"`: does hover produce ZERO visual change?
- [ ] When `data-hover="instant"`: colour change only (0s), NO movement/shadow/transform?
- [ ] When `data-hover="gentle"`: does hover transition at 0.4s?
- [ ] When `data-hover="full"`: does hover behave exactly as designed?
- [ ] Is hover independent from the `animation` prop? (hover is NOT animation)
- [ ] Does the component need a `hover` JSON prop to gate WHICH effect? 
      (Only if multiple hover variants exist. Simple colour change = always on.)

Implementation pattern:
```css
/* Component reads hover-duration for all transitions */
.component {
  transition: background-color var(--hover-duration),
              box-shadow var(--hover-duration);
}

/* data-hover="none" — resolve hover to same as default state */
[data-hover="none"] .component:hover {
  background-color: var(--_component-bg);
  border-color: var(--_component-border);
  box-shadow: var(--_component-shadow);
  transform: none;
  filter: none;
}
```

### 3. Functional hover — transition only

For every FUNCTIONAL :hover rule:

- [ ] Content still appears when data-hover="none"
- [ ] Transition duration reads `var(--hover-duration)` so it's instant when none/instant
- [ ] :focus-within pair exists (keyboard accessible)
- [ ] Content appearance is NOT suppressed — only the animation of appearance

Implementation pattern:
```css
/* Tooltip/dropdown — content always appears */
.component:hover .content,
.component:focus-within .content {
  opacity: 1;
  visibility: visible;
  /* transition reads global --hover-duration */
  transition: opacity var(--hover-duration), visibility var(--hover-duration);
}
/* When data-hover="none", --hover-duration is 0s = instant appear */
```

### 4. Hardcoded timing check

- [ ] Zero hardcoded transition durations (0.2s, 0.3s, 300ms, etc.)
- [ ] All durations use `var(--hover-duration)` or `var(--hover-duration-fast)`
- [ ] Easing functions (ease, cubic-bezier) are KEPT — only duration is tokenised
- [ ] No `var(--token, fallback)` patterns on hover tokens

### 5. Legacy pattern check

- [ ] No `.a11y-*` hover classes
- [ ] No `#a11y-content-wrapper` hover selectors
- [ ] No `:global()` hover in scoped styles
- [ ] No `!important` on hover or transition properties
- [ ] If a companion `.a11y.css` file exists with hover rules:
      extract valid rules into token gate system, delete file

### 6. Scoped style extraction

If the component has hover rules in `<style>` tags instead of external `.css`:

- [ ] Extract ALL :hover rules to external `[Component].css` file
- [ ] Move ALL transition declarations to external file
- [ ] Remove scoped `<style>` block (or confirm it contains zero hover/transition)
- [ ] Verify no `:global()` wrappers around hover rules

### 7. Zone file check

- [ ] Does `theme-luminance-dark.css` override this component's hover?
      If yes: does it follow the same gate? (usually automatic)
- [ ] Does `high-contrast.css` override this component's hover?
      If yes: same check
- [ ] Does `theme-chroma-mono.css` override this component's hover?
      If yes: same check

### 8. Interaction with other gates

- [ ] `hover` prop (if it exists) is independent from `animation` prop
- [ ] `[data-render="reduced"]` kills transition duration but does NOT 
      suppress hover state changes (hover is feedback, not animation)
- [ ] `[data-render="assistive"]` — hover behaviour appropriate for 
      assistive mode (may suppress decorative, keep functional)
- [ ] `[data-render="textonly"]` — hover suppressed (no visual elements to hover)


## HIGHLIGHT LINK CHECK
(Only for components that render links or act as links)

### 1. Identify link elements
- [ ] Does component render `<a>` tags or use Link atom?
- [ ] Does component itself act as a link (clickable card, nav item)?

### 2. Link highlight tokens
- [ ] Links read `--link-highlight-border` token
- [ ] Links read `--link-highlight-bg` token
- [ ] Highlight animation uses `--link-highlight-animation` token
- [ ] When `data-highlight="none"`: links have no highlight
- [ ] When `data-highlight="static"`: links have visible border/bg, no motion
- [ ] When `data-highlight="animated"`: links have pulsing highlight

Implementation pattern:
```css
/* Links read highlight tokens */
.component a,
.component [role="link"] {
  border: var(--link-highlight-border);
  background-color: var(--link-highlight-bg);
  animation: var(--link-highlight-animation);
}
```

### 3. Skip these
- [ ] Nav links in GlassNav — handled by nav component's own audit
- [ ] Footer links — handled by Footer audit
- [ ] Breadcrumb links — handled by Breadcrumbs audit

Each component handles its own links. No global link styling beyond 
what's in utilities.css `.prose a`.


## QUICK REFERENCE — Decision Tree

```
Found a :hover rule
  ├── Does it REVEAL content (tooltip, dropdown, menu)?
  │     YES → FUNCTIONAL
  │     │   → Content always appears
  │     │   → Transition reads --hover-duration
  │     │   → Must have :focus-within pair
  │     │
  │     NO → Does it change APPEARANCE (colour, shadow, scale)?
  │           YES → DECORATIVE  
  │           │   → Suppressed by data-hover="none"
  │           │   → Transition reads --hover-duration
  │           │   → Resolve to default values when suppressed
  │           │
  │           NO → Is it :disabled:hover or render mode reset?
  │                 YES → LEAVE ALONE
  │                 NO → ASK — flag for review
```
