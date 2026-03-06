# Toast Atom — Full Rebuild Prompt

Toast is currently split between a dead Astro template and an imperative JS utility. This prompt rebuilds it as a proper atom with correct architecture.

Split into three sessions:
- Session 1: Schema + Toast.astro rebuild + Toast.css (fixes + render modes)
- Session 2: toast.ts rewrite (render mode detection, keyboard dismiss, slug-based icons)
- Session 3: Post-fix audit + consumer migration (checkout-form, cookie-banner, contact-popup)

---

## Architecture

Toast is dynamic — it appears at runtime in response to user actions. Astro components are server-rendered, so Toast.astro can't be the runtime renderer. The correct pattern:

1. **Toast.astro** — canonical template. Defines the correct HTML structure, attributes, and atom composition. Used as reference and for any static/SSR toast needs.
2. **toast.ts** — imperative creator. Builds DOM matching Toast.astro's output exactly. Same class names, same attributes, same structure. This is what consumers call.
3. **Toast.css** — shared styles. Both Astro and JS output use the same classes.
4. **Render mode** — toast.ts reads `document.body.dataset.render` instead of legacy class checks.
5. **Icons** — slug-based resolution via asset API, not filesystem paths. LottieIcon atom can't run in client JS (it's server-side Astro), so toast.ts uses lottie-web directly but with the same slug → URL resolution pattern.

---

## Fix 1: Schema — Toast.schema.json

Replace entirely:

```json
{
  "component": "Toast",
  "category": "atom",
  "renders": {
    "full": "Toast.astro",
    "reduced": "Toast.astro",
    "assistive": "Toast.astro",
    "textonly": "Toast.astro"
  },
  "notes": "Dynamic notification. Toast.astro is canonical template; toast.ts creates matching DOM imperatively at runtime. All render modes use full-width bar layout for maximum visibility. Icons use slug-based resolution via asset API.",

  "props": {
    "content": {
      "_description": "What the toast says",
      "message":  { "type": "string",  "required": true, "description": "Notification text." },
      "icon":     { "type": "string",  "required": false, "default": "notification", "description": "Icon slug — preset name (alert, info, notification, thumbup, activity) or asset path. Stripped in textonly." },
      "duration": { "type": "number",  "required": false, "default": 5000, "description": "Auto-dismiss milliseconds. 0 = manual dismiss only." }
    },

    "visual": {
      "_description": "How the toast looks",
      "theme":     { "type": "string", "required": false, "default": "professional", "enum": ["arcade", "professional", "brutalist", "glass", "neon"], "description": "Visual theme. Stripped to professional in reduced/assistive/textonly." },
      "class":     { "type": "string", "required": false, "default": "", "description": "Additional CSS classes." }
    },

    "animation": {
      "_description": "Motion behaviour — stripped in reduced/assistive/textonly renders",
      "animation": { "type": "string", "required": false, "default": "slide", "enum": ["slide", "bounce", "fade", "flip", "zoom"], "description": "Entrance animation. Stripped in reduced render — toast appears instantly." }
    }
  }
}
```

Key changes: category → "atom", 4 render keys, content/visual/animation groups. Duration moved to content (it's about how long the message shows). Theme stays visual. Animation entrance is animation group — stripped in reduced.

---

## Fix 2: Toast.astro — rebuild as canonical template

Replace the entire file. This is the reference template — toast.ts must create matching DOM.

```astro
---
/**
 * Toast — Notification atom
 *
 * Dynamic notification — appears at runtime via toast.ts.
 * This template is the canonical HTML structure.
 * toast.ts creates matching DOM imperatively.
 *
 * Render modes:
 *   Full:      themed pill, animated entrance, lottie icon, glow
 *   Reduced:   professional theme, no animation, static icon, no glow
 *   Assistive: full-width bar, large text, large icon, thick focus
 *   Textonly:  full-width bar, no icons, plain background, text only
 *
 * Styles: Toast.css | Toast.responsive.css
 */
import { Icon } from '../../icons/Icon';
import { Text } from '../Text';

interface Props {
  message: string;
  icon?: string;
  duration?: number;
  theme?: 'arcade' | 'professional' | 'brutalist' | 'glass' | 'neon';
  animation?: 'slide' | 'bounce' | 'fade' | 'flip' | 'zoom';
  class?: string;
}

const {
  message,
  icon = 'notification',
  duration = 5000,
  theme = 'professional',
  animation = 'slide',
  class: className,
} = Astro.props;

const classes = [
  'toast',
  `toast--${theme}`,
  animation && `toast--animate-${animation}`,
  className,
].filter(Boolean);

// Map preset icon slugs to Phosphor icon names
const iconMap: Record<string, string> = {
  activity: 'circle-notch-fill',
  notification: 'bell-ringing-fill',
  alert: 'warning-fill',
  info: 'info-fill',
  thumbup: 'thumbs-up-fill',
};

const phosphorName = iconMap[icon] || 'info-fill';
---

<div
  class:list={classes}
  role="alert"
  aria-live="polite"
  aria-atomic="true"
  data-semantic-role="status"
  data-duration={duration}
  tabindex="0"
>
  {/* Lottie icon — decorative, hidden in reduced/assistive/textonly via CSS */}
  <div class="toast__lottie" aria-hidden="true" data-lottie-slug={icon}></div>

  {/* Static icon fallback — shown in reduced, hidden in textonly */}
  <Icon name={phosphorName} class="toast__icon" aria-hidden="true" />

  {/* Message */}
  <Text as="span" class="toast__message" flush>{message}</Text>

  {/* Glow effect — decorative, hidden in all non-full renders */}
  <div class="toast__glow" aria-hidden="true"></div>
</div>
```

Key changes:
- Uses Icon atom (barrel import) for static fallback
- Uses Text atom for message
- `data-semantic-role="status"` for AT
- `tabindex="0"` for keyboard focus
- `aria-atomic="true"` so screen readers read the full message
- Lottie container uses `data-lottie-slug` — toast.ts reads this to load animation
- No `<lottie-player>` web component — toast.ts handles lottie-web directly
- BEM naming: `toast__lottie`, `toast__icon`, `toast__message`, `toast__glow`

---

## Fix 3: Toast.css — rebuild

Remove `@layer components` wrapper.

### 3a: Tokenise repeating values

Add at top of `.toast` base:
```css
.toast {
  /* Internal tokens */
  --_toast-icon-size: 32px;
  --_toast-max-width: 320px;
  --_toast-z: 9999;
  --_toast-radius: var(--radius-lg);
}
```

Replace all `32px` icon references with `var(--_toast-icon-size)`.
Replace `320px` max-width with `var(--_toast-max-width)`.
Replace `9999` z-index with `var(--_toast-z)`.
Replace `0.2s` transitions with `var(--transition-fast)`.

### 3b: BEM class rename

Rename classes to BEM pattern matching the Astro template:
- `toast-message` → `toast__message`
- `toast-lottie-icon` → `toast__lottie`
- `toast-static-icon` → `toast__icon`
- `toast-glow` → `toast__glow`
- `toast-img-icon` → `toast__img` (if keeping image support)
- `toast-${theme}` → `toast--${theme}` (double dash for modifier)
- `toast-${animation}-animation` → `toast--animate-${animation}`

### 3c: #toast-container

Keep `#toast-container` rules in Toast.css — the container is created by toast.ts and styled here. Add comment:
```css
/* Toast container — created dynamically by toast.ts
   ID selector acceptable: only one container per page */
#toast-container { ... }
```

### 3d: Remove !important

The `!important` on Lottie SVG fill/stroke (line 96) — replace with toast.ts directly setting fill/stroke attributes on SVG paths after lottie-web renders (already done in the current toast.ts). Remove the CSS rule.

### 3e: Render mode rules

Add at end of Toast.css:

```css
/* ================================================================
   RENDER MODE OVERRIDES
   All non-full modes use full-width bar layout for visibility.
   ================================================================ */

/* ── Reduced — instant appear, no animation, static icon, no glow ── */

[data-render="reduced"] .toast {
  --_toast-max-width: 100%;
  --_toast-radius: 0;
  animation: none;
  transition: none;
}

[data-render="reduced"] .toast__lottie {
  display: none;
}

[data-render="reduced"] .toast__icon {
  display: block;
}

[data-render="reduced"] .toast__glow {
  display: none;
}

/* Force professional theme in reduced */
[data-render="reduced"] .toast {
  background: var(--brand-c-bg);
  color: var(--brand-c-text);
  border: 1px solid var(--brand-c-neutral-light);
  box-shadow: var(--shadow-md);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* ── Assistive — full-width bar, large text, large icon ── */

[data-render="assistive"] .toast {
  --_toast-max-width: 100%;
  --_toast-icon-size: 48px;
  --_toast-radius: 0;
  animation: none;
  transition: none;
  padding: var(--space-lg);
  font-size: var(--text-body);
  min-height: 64px;
}

[data-render="assistive"] .toast__lottie {
  display: none;
}

[data-render="assistive"] .toast__icon {
  display: block;
}

[data-render="assistive"] .toast__glow {
  display: none;
}

[data-render="assistive"] .toast:focus-visible {
  outline: 3px solid var(--brand-c-primary);
  outline-offset: 2px;
}

/* Force professional theme */
[data-render="assistive"] .toast {
  background: var(--brand-c-bg);
  color: var(--brand-c-text);
  border: 1px solid var(--brand-c-neutral-light);
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* ── Textonly — full-width bar, no icons, plain text only ── */

[data-render="textonly"] .toast {
  --_toast-max-width: 100%;
  --_toast-radius: 0;
  animation: none;
  transition: none;
  padding: var(--space-md);
}

[data-render="textonly"] .toast__lottie,
[data-render="textonly"] .toast__icon,
[data-render="textonly"] .toast__img {
  display: none;
}

[data-render="textonly"] .toast__glow {
  display: none;
}

[data-render="textonly"] .toast {
  background: var(--brand-c-bg);
  color: var(--brand-c-text);
  border: 1px solid var(--brand-c-text);
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
```

---

## Fix 4: Toast.responsive.css

Remove `@layer components` wrapper.
Remove any `!important` declarations.
Keep mobile full-width bar rules — they complement the render mode rules.

---

## Fix 5: toast.ts — rewrite

### 5a: Replace a11y detection

Delete `isA11yMode()` and `isReducedMotion()` functions. Replace with:

```typescript
function getRenderMode(): string {
  return document.body.dataset.render || 'full';
}

function isNonFullRender(): boolean {
  return getRenderMode() !== 'full';
}
```

### 5b: Replace all `isA11yMode()` / `isReducedMotion()` / `compact` checks

Replace:
```typescript
const a11y = isA11yMode();
const compact = window.innerWidth <= 500;
const stripped = a11y || compact;
```

With:
```typescript
const renderMode = getRenderMode();
const isReduced = renderMode === 'reduced';
const isAssistive = renderMode === 'assistive';
const isTextonly = renderMode === 'textonly';
const stripped = renderMode !== 'full';
```

### 5c: BEM class names

Update all DOM creation to use BEM classes matching Toast.astro:
- `toast-${theme}` → `toast--${theme}`
- `toast-${animation}-animation` → `toast--animate-${animation}`
- `toast-lottie-icon` → `toast__lottie`
- `toast-static-icon` → `toast__icon`
- `toast-message` → `toast__message`
- `toast-glow` → `toast__glow`
- `toast-img-icon` → `toast__img`

### 5d: Icon slug resolution

Replace hardcoded filesystem paths with slug-based API URLs:

```typescript
const LOTTIE_BASE = '/api/assets/lottie/toast';
const PHOSPHOR_BASE = '/api/assets/icon/phosphor';

const lottiePresets: Record<ToastPresetIcon, string> = {
  activity: `${LOTTIE_BASE}/activity`,
  notification: `${LOTTIE_BASE}/notification`,
  alert: `${LOTTIE_BASE}/alert`,
  info: `${LOTTIE_BASE}/info`,
  thumbup: `${LOTTIE_BASE}/thumbup`,
};

const phosphorPresets: Record<ToastPresetIcon, string> = {
  activity: `${PHOSPHOR_BASE}/circle-notch-fill`,
  notification: `${PHOSPHOR_BASE}/bell-ringing-fill`,
  alert: `${PHOSPHOR_BASE}/warning-fill`,
  info: `${PHOSPHOR_BASE}/info-fill`,
  thumbup: `${PHOSPHOR_BASE}/thumbs-up-fill`,
};
```

**NOTE:** Check what the actual asset API URLs are in the codebase. The pattern above assumes an API route exists. If not, use the slug → public path pattern that LottieIcon uses. The key change is: no hardcoded `/Icons/Animated Icons/Toast Icons/` filesystem paths.

### 5e: Keyboard dismiss

Add after click handler:

```typescript
// Keyboard dismiss — Escape or Enter
toast.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' || e.key === 'Enter') {
    e.preventDefault();
    dismissToast();
  }
});

// Auto-focus toast for keyboard users
toast.focus();
```

### 5f: Force theme in non-full renders

```typescript
const effectiveTheme = stripped ? 'professional' : theme;
const effectiveAnimation = isReduced || isAssistive || isTextonly ? null : animation;
```

Only add animation class if effectiveAnimation is not null.

### 5g: Skip icons in textonly

```typescript
if (isTextonly) {
  // No icons at all — text only
} else if (stripped) {
  // Static icon only — no lottie, no glow
  const staticIcon = document.createElement('div');
  staticIcon.className = 'toast__icon';
  staticIcon.setAttribute('aria-hidden', 'true');
  // ... create icon
  toast.appendChild(staticIcon);
} else {
  // Full: lottie + static fallback + glow
  // ... existing lottie creation with BEM classes
}
```

### 5h: Add aria attributes

```typescript
toast.setAttribute('role', 'alert');
toast.setAttribute('aria-live', 'polite');
toast.setAttribute('aria-atomic', 'true');
toast.setAttribute('data-semantic-role', 'status');
toast.setAttribute('tabindex', '0');
```

### 5i: Dismiss animation per render mode

```typescript
const dismissToast = () => {
  clearTimeout(autoRemoveTimeout);
  if (lottieTimeout) clearTimeout(lottieTimeout);

  const renderMode = getRenderMode();

  if (renderMode !== 'full') {
    // Non-full: slow fade
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 1.2s ease';
    setTimeout(() => cleanup(), 1200);
  } else {
    // Full: slide out
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => cleanup(), 300);
  }
};

const cleanup = () => {
  if (lottieAnimation) lottieAnimation.destroy();
  toast.remove();
  if (container && container.children.length === 0) {
    container.remove();
  }
};
```

### 5j: Fix contact-popup signature

In `contact-popup.js`, change:
```javascript
window.showToast(message, type)
```
To:
```javascript
window.showToast({ message, theme: type || 'professional' })
```

---

## Fix 6: a11y extraction + cleanup

- Move Toast.a11y.css → `_reference/Toast/Toast.a11y.css`
- Move Toast.a11y.recovery.css → `_reference/Toast/Toast.a11y.recovery.css`
- Render mode rules now in Toast.css (Fix 3e)
- No rules needed in highlight-links.css or high-contrast.css — Toast is non-navigational

---

## Fix 7: index.ts cleanup

```ts
import './Toast.css';
import './Toast.responsive.css';

export { default as Toast } from './Toast.astro';
export { default as schema } from './Toast.schema.json';
export { showToast } from '../../lib/ui/toast';
export type { ToastOptions, ToastTheme, ToastAnimation } from '../../lib/ui/toast';
```

Remove a11y import. Add re-export of showToast and types from toast.ts for convenient consumer imports.

---

## Post-fix verification

1. `grep -r "atoms/ui" Toast.schema.json` returns 0 matches
2. `grep -r "@layer" Toast.css Toast.responsive.css` returns 0 matches
3. `grep -r "Toast.a11y.css" index.ts` returns 0 matches
4. `grep -r "a11y-content-wrapper\|a11y-reduce-motion\|a11y-text-only" toast.ts` returns 0 matches
5. `grep -r "isA11yMode\|isReducedMotion" toast.ts` returns 0 matches
6. `grep -r "!important" Toast.css` returns 0 matches
7. `grep -r "/Icons/Animated Icons/" toast.ts` returns 0 matches (slug-based)
8. Toast.css has `[data-render="reduced"]`, `[data-render="assistive"]`, `[data-render="textonly"]` rules
9. Schema has 4 render keys, animation group with entrance animation
10. toast.ts has keyboard dismiss handler
11. toast.ts uses `document.body.dataset.render` for render mode detection
12. Toast.astro uses Icon atom (barrel), Text atom, aria-atomic, tabindex

---

## Cross-atom notes (for audit-log.md)

```
- ARCHITECTURE: Toast is a dynamic notification — DOM created at runtime by toast.ts. Toast.astro is canonical template defining correct HTML structure. Both share Toast.css.
- ARCHITECTURE: All non-full render modes use full-width bar layout. No floating pill toast in reduced/assistive/textonly — bar is unmissable, easy to scan, easy to dismiss.
- ARCHITECTURE: toast.ts reads document.body.dataset.render for render mode detection. Legacy #a11y-content-wrapper class checks removed.
- ARCHITECTURE: Keyboard dismiss via Escape/Enter. Toast receives focus on creation. tabindex="0" enables keyboard interaction.
- ARCHITECTURE: Icon presets use slug-based resolution (not filesystem paths). Lottie loaded via lottie-web (not <lottie-player> web component). In reduced/assistive: static Phosphor icon. In textonly: no icons.
- ARCHITECTURE: Internal tokens --_toast-icon-size, --_toast-max-width, --_toast-z. Render modes override these (e.g. --_toast-max-width: 100% for full-width bar).
- MIGRATION: contact-popup.js uses wrong showToast signature — needs updating to { message, theme } format.
- MIGRATION: Toast.astro dead template removed — replaced with canonical atom template.
- DEFERRED: LottieIcon atom can't run in client JS (server-side Astro). Toast uses lottie-web directly. If LottieIcon gets a client-side API in future, Toast should migrate.
- DEFERRED: Asset API routes for toast icons — verify /api/assets/lottie/toast/ and /api/assets/icon/phosphor/ exist. If not, use slug → public path mapping.
```
