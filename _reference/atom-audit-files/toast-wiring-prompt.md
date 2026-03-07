# Toast Atom Wiring — Claude Code Prompt

## Context

Toast is a notification atom. It composes other atoms: LottieIcon, Icon, Text. Currently it has a raw `<div data-lottie-slug>` instead of LottieIcon, a hardcoded `iconMap` duplicating what the Asset Library already provides, and CSS rules that reach into child atoms to show/hide them per render mode.

Toast is a **container for atoms**. Same principle as Card — it doesn't control child visibility. Each atom handles its own render mode behaviour. Toast only handles its own layout, chrome, and animation gating.

**Read these documents fully before starting:**
- `component-audit-checklist-v2.md` — the audit standard
- `architecture-decisions.md` — the architecture contract (especially sections 1, 3, 4, 11, 12)
- `CLAUDE.md` — project rules and extraction process

Read all referenced files fully before making any changes. Do not skim. If you are unsure about ANY rule, STOP and ask.

---

## Key principle: What Toast owns vs what atoms own

### Toast owns (Toast.css handles):
- **Layout:** pill shape (full render) vs full-width bar (reduced/assistive/textonly) via `[data-render]`
- **Chrome:** glow element, backdrop-filter, theme border/shadow/radius, background
- **Animation gating:** `toast--animate-*` classes from JSON animation prop. No prop = no class = no motion.
- **Container position:** fixed positioning, z-index, flex layout

### Atoms own themselves (Toast does NOT handle):
- **LottieIcon** — pipeline routes: full → lottie animation, reduced/assistive → Icon fallback, textonly → hidden (decorative). LottieIcon manages this via its own schema and pipeline routing. Toast doesn't swap or hide it.
- **Icon** — handles its own decorative/functional distinction. `aria-hidden="true"` when decorative.
- **Text** — handles its own colour via `textTone` prop or `color` prop. Toast container does not set text colour for glass/neon — Text handles it.
- **Image** — if ever added, handles its own semantic role and alt text display modes.

### The Asset Library returns paired data:
Each icon slug in the library returns BOTH:
- Lottie animation data (for LottieIcon atom)
- Static Phosphor SVG fallback name (for Icon atom, used in reduced/assistive via pipeline routing)

These are already paired in the JSON. Toast does NOT need its own `iconMap` to map slugs to Phosphor names. The library is the single source of truth.

---

## Files to modify

| File | Location |
|------|----------|
| `Toast.astro` | `src/components/atoms/ui/Toast/Toast.astro` |
| `Toast.css` | `src/components/atoms/ui/Toast/Toast.css` |
| `Toast.schema.json` | `src/components/atoms/ui/Toast/Toast.schema.json` |
| `toast.ts` | `src/lib/ui/toast.ts` |
| `index.ts` | `src/components/atoms/ui/Toast/index.ts` |

Read each file fully before editing.

---

## Step 1: Toast.astro — Wire LottieIcon atom, remove iconMap

### 1a: Replace the raw lottie div with LottieIcon atom

**Current (WRONG — raw div, not using atom):**
```astro
<div class="toast__lottie" aria-hidden="true" data-lottie-slug={icon}></div>
```

**Target:**
```astro
<LottieIcon slug={icon} class="toast__lottie" aria-hidden="true" />
```

Add `import { LottieIcon } from '../../icons/LottieIcon';` to the imports.

LottieIcon fetches the lottie JSON at build time from the Asset Library API and inlines it as `animationData`. No runtime fetch needed.

### 1b: Remove the hardcoded iconMap

**Delete this entire block:**
```astro
const iconMap: Record<string, string> = {
  activity: 'circle-notch-fill',
  notification: 'bell-ringing-fill',
  alert: 'warning-fill',
  info: 'info-fill',
  thumbup: 'thumbs-up-fill',
};

const phosphorName = iconMap[icon] || 'info-fill';
```

The Asset Library already pairs each slug with its Phosphor fallback. LottieIcon's schema declares `fallbackIcon` which the pipeline routes to the Icon atom in reduced/assistive builds. Toast doesn't map, route, or know about fallbacks.

### 1c: Keep the separate Icon element — BUT understand why

The `<Icon>` element stays in the template for now because Toast.astro renders the canonical template that includes all visual slots. The pipeline routing (LottieIcon → Icon in reduced/assistive) happens at the JSON/build layer. In the Astro template, both elements can exist — CSS hides the inactive one based on what the pipeline and atom handle.

**However** — check how LottieIcon.astro renders. If it already includes its own fallback Icon internally (based on pipeline routing), then the separate `<Icon>` in Toast.astro is redundant and should be removed. Read LottieIcon.astro to confirm before deciding.

### 1d: Keep the neon text colour logic as-is

**Do not change this — it works:**
```astro
const messageColor = theme === 'neon' ? 'inherit' as const : undefined;
```

```astro
<Text as="span" class="toast__message" color={messageColor} flush>{message}</Text>
```

Neon sets `color: var(--color-White)` on the container. Text inherits via `color="inherit"`. Glass at 75% opacity uses default theme text. This is the shipped, working logic.

---

## Step 2: Toast.css — Remove all rules that reach into child atoms

### 2a: Identify and remove atom-targeting rules in `[data-render]` blocks

Go through every `[data-render]` block (reduced, assistive, textonly) and **remove rules that target child atoms:**

**Remove these (Toast reaching into atoms it doesn't own):**
```css
/* REDUCED — remove these */
[data-render="reduced"] .toast__lottie { display: none; }
[data-render="reduced"] .toast__icon { display: block; }

/* ASSISTIVE — remove these */
[data-render="assistive"] .toast__lottie { display: none; }
[data-render="assistive"] .toast__icon { display: block; }

/* TEXTONLY — remove these */
[data-render="textonly"] .toast__lottie,
[data-render="textonly"] .toast__icon,
[data-render="textonly"] .toast__img { display: none; }
```

These atoms handle their own visibility. LottieIcon's pipeline routing determines what renders. Icon knows if it's decorative. Toast doesn't manage them.

### 2b: Keep Toast's own container rules in `[data-render]` blocks

**These stay — they are Toast's own layout/chrome concerns:**

```css
/* REDUCED — Toast container styling */
[data-render="reduced"] .toast {
  --_toast-max-width: 100%;
  --_toast-radius: 0;
  animation: none;
  transition: none;
  background: var(--brand-c-bg);
  color: var(--brand-c-text);
  border: 1px solid var(--brand-c-neutral-light);
  box-shadow: var(--shadow-md);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  text-shadow: none;
  text-transform: none;
  letter-spacing: normal;
  font-family: var(--font-body);
}

[data-render="reduced"] .toast:hover {
  transform: none;
  box-shadow: var(--shadow-md);
}

[data-render="reduced"] .toast__glow { display: none; }
```

Note: `.toast__glow` is Toast's own decorative element (not an atom), so Toast CSS can hide it.

Repeat the same pattern for assistive and textonly — keep container rules, remove atom-targeting rules.

### 2c: Remove the `.toast__icon` base rule block

**Delete this entire block — there is no Toast-owned icon element:**
```css
.toast__icon {
  width: var(--_toast-icon-size);
  height: var(--_toast-icon-size);
  flex-shrink: 0;
  color: var(--_toast-icon-color);
  display: none;
}

.toast__icon svg {
  width: 100%;
  height: 100%;
}
```

Icon and LottieIcon atoms handle their own sizing. Toast doesn't style atoms it doesn't own.

### 2d: Remove `.toast__lottie` base sizing rules

LottieIcon handles its own sizing via `size` prop with inline `style="width: ${size}px; height: ${size}px;"`. The CSS sizing in Toast.css is redundant:

**Delete:**
```css
.toast__lottie {
  width: var(--_toast-icon-size);
  height: var(--_toast-icon-size);
  flex-shrink: 0;
}

.toast__lottie svg {
  width: 100%;
  height: 100%;
}
```

LottieIcon atom owns its own dimensions. Toast doesn't size atoms it doesn't own.

### 2e: Keep neon `color: var(--color-White)` on container

**Do NOT remove this.** Neon needs white text on dark background. Text inherits via `color="inherit"`. This is container-level colour for the theme, not Toast reaching into the Text atom.

---

## Step 3: Toast.schema.json — Update notes and icon description

### Changes:

1. **`icon` prop description:** Change to:
   "Lottie animation slug from Asset Library API. Library returns paired data (lottie + Phosphor fallback). Pipeline routes: full → LottieIcon atom, reduced/assistive → Icon atom (via fallbackIcon), textonly → hidden (decorative). Toast does not manage routing."

2. **`notes` field:** Change to:
   "Dynamic notification atom. Composes LottieIcon, Icon, Text atoms — each atom handles its own render mode behaviour. Toast handles layout (pill vs full-width bar), chrome (glow, backdrop-filter, theme), and animation gating. toast.ts is the runtime orchestrator. Icon slugs resolved from Asset Library API at build time."

3. **Existing `renders` block stays unchanged** — all four modes point to `Toast.astro`.

---

## Step 4: toast.ts — Template clone refactor

### The problem with current approach:
toast.ts builds DOM imperatively — creating divs, spans, SVG elements from scratch. This duplicates atom markup and bypasses their render mode behaviour.

### Key principle: toast theme is set once per build
The site/brand JSON defines the toast theme for the entire build. Every toast on that site gets the same theme. This is NOT a per-toast runtime choice — it's a build-time decision, same as how Button variant is set in JSON, not swapped at runtime.

This means all five preset templates are built with the correct theme already applied. Text already has the right colour props (e.g. `color="inherit"` for neon). LottieIcon already has the right icon colour. Animation classes are already present or absent based on the render mode. Everything is correct from build. toast.ts never touches theme, animation, or atom classes.

### New approach — five preset templates:

The layout renders five hidden `<template>` elements (one per preset slug). Each is a complete Toast with all atoms server-rendered using the site's toast theme from the JSON config.

**Layout.astro (or wherever Toast container lives) adds:**
```astro
---
import { Toast } from '../atoms/ui/Toast';

// toastTheme and toastAnimation come from site/brand JSON config
const { toastTheme, toastAnimation } = Astro.props.siteConfig;
---

<div id="toast-container"></div>

<!-- Pre-rendered toast templates — atoms built at build time with correct theme -->
<template id="toast-tpl-notification">
  <Toast icon="notification" theme={toastTheme} animation={toastAnimation} message="" />
</template>
<template id="toast-tpl-alert">
  <Toast icon="alert" theme={toastTheme} animation={toastAnimation} message="" />
</template>
<template id="toast-tpl-info">
  <Toast icon="info" theme={toastTheme} animation={toastAnimation} message="" />
</template>
<template id="toast-tpl-thumbup">
  <Toast icon="thumbup" theme={toastTheme} animation={toastAnimation} message="" />
</template>
<template id="toast-tpl-activity">
  <Toast icon="activity" theme={toastTheme} animation={toastAnimation} message="" />
</template>
```

### toast.ts becomes a thin orchestrator:
1. `showToast({ message, icon, duration })` is called
2. Clone `#toast-tpl-${icon}` content (defaults to `notification` if slug not found)
3. Set `.toast__message` text content
4. Append to `#toast-container`
5. Trigger LottieIcon init on the cloned element (dispatch event or call init function — check how LottieIcon's `<script>` block initialises dynamically added elements)
6. Set timeout for duration, remove on dismiss

**toast.ts does NOT:**
- Accept or use `theme` or `animation` params — these are baked in at build
- Create any DOM elements from scratch (no `document.createElement`)
- Swap or add theme/animation classes
- Fetch lottie JSON at runtime
- Detect render mode
- Show/hide atoms based on render mode
- Build icon/image elements

### showToast API change:
The public `showToast()` function signature simplifies:

**Before:** `showToast({ message, icon, theme, animation, duration })`
**After:** `showToast({ message, icon?, duration? })`

`theme` and `animation` are removed from the runtime API — they're build-time config. If existing call sites pass theme/animation, they should be migrated to site JSON config. toast.ts can accept and silently ignore them during migration if needed, but they have no effect.

### Custom icon slugs (not presets):
If `showToast` is called with a slug that isn't one of the five presets, toast.ts falls back to cloning the `notification` template. The icon won't match the message context, but the toast still works. If custom slugs are needed in future, they'd be added to the JSON config so the build renders additional templates. Flag this as a known limitation rather than hacking around it.

---

## Step 5: Toast.responsive.css — Remove atom-targeting rules

**Current (reaching into atoms):**
```css
.toast__lottie,
.toast__img,
.toast__icon {
  display: none;
}
```

**Remove these.** Atoms handle their own responsive behaviour. Toast.responsive.css should only contain Toast's own container responsive rules (position, max-width, padding, border-radius, etc.).

Also flag: `box-shadow: 0 2px 8px color-mix(...)` should use a shadow token.

---

## Step 6: index.ts — Verify

Confirm:
- `import './Toast.css';` — present
- `import './Toast.responsive.css';` — present
- No `import './Toast.a11y.css';` — should not exist
- Exports: `Toast`, `schema`, `showToast`, types

---

## Validation checklist

| # | Check | Expected |
|---|-------|----------|
| 1 | Toast.astro imports LottieIcon atom | `import { LottieIcon }` present |
| 2 | No raw `<div data-lottie-slug>` in Toast.astro | LottieIcon atom used |
| 3 | No `iconMap` in Toast.astro | Deleted — library provides paired data |
| 4 | Neon text logic unchanged | `color="inherit"` on Text, container sets white |
| 5 | Glass text logic unchanged | No textTone, no override — default theme text |
| 6 | No atom-targeting rules in `[data-render]` blocks | No `.toast__lottie`, `.toast__icon`, `.toast__img` in render blocks |
| 7 | `.toast__glow` hidden in non-full renders | Stays — Toast's own decorative element |
| 8 | No `.toast__icon` base rule block | Deleted |
| 9 | Toast container rules in `[data-render]` blocks kept | Bar layout, plain bg, no backdrop-filter |
| 10 | `color: var(--color-White)` on `.toast--neon` kept | Not removed |
| 11 | No atom-targeting rules in Toast.responsive.css | Removed |
| 12 | Shadow token in Toast.responsive.css | Replace inline `color-mix` |
| 13 | Schema notes updated | Reflects atom composition, library routing |
| 14 | toast.ts uses template cloning | No `document.createElement` |
| 15 | toast.ts does not accept theme/animation params | Build-time config only |
| 16 | toast.ts does not fetch lottie at runtime | Inlined at build |
| 17 | toast.ts does not detect render mode | Template already correct |
| 18 | toast.ts does not swap theme/animation classes | Baked in from build |
| 19 | Five preset templates in layout with site toast theme | `toastTheme` from JSON config |
| 20 | Custom slug falls back to notification template | Documented limitation |
| 21 | No `!important` anywhere | Banned |
| 22 | No `.a11y-*` selectors | Banned |
| 23 | No `@layer` wrappers | Banned |
| 24 | No `@media (prefers-reduced-motion)` | Banned |
| 25 | No hardcoded colour values | All tokens |
| 26 | No `var(--token, fallback)` patterns | No fallbacks |
| 27 | Build passes clean | No errors |

---

## Architecture rules reminder — do not violate

- **Toast is a container for atoms.** Same principle as Card. It doesn't control child visibility. Each atom handles its own render mode behaviour.
- **Animation = JSON prop → class → CSS.** No prop = no class = no motion.
- **Components are pure.** They don't detect render mode, brand, or motion preference.
- **No a11y.css files.** Render mode visual styling lives in Component.css via `[data-render]` selectors — for the component's OWN layout/chrome, not for managing child atoms.
- **Atoms compose atoms.** Toast uses LottieIcon, Text. Not raw HTML.
- **Asset Library is single source of truth for icon pairs.** No hardcoded icon maps in components.
- **Every value uses a design token.** No hardcoded colours, spacing, radius, shadows. No fallback values.
- **No `!important`, no `@layer`, no `.a11y-*`, no `#a11y-content-wrapper`, no `@media (prefers-reduced-motion)`, no `:global()`, no scoped `<style>`.**

If you are unsure about any rule, STOP and ask. Do not guess.

---

## Follow-on task (not part of this prompt)

`toast-demo.astro` currently has trigger buttons that pass `theme` and `animation` per-toast at runtime to `showToast()`. After this refactor, those params are removed from the API. The demo page needs updating to reflect the build-time theme approach — it should demonstrate the five preset slugs with the site's configured theme, not per-toast runtime theming. Handle this as a separate task after the main wiring is confirmed working.
