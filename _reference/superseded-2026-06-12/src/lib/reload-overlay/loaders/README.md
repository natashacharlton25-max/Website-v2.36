# Reload Overlay Loaders

Loaders are the visible content of the reload overlay. The mechanism in
`reload-overlay.ts` handles the overlay container, fade-in, scroll save and
the actual reload — loaders just decide what the user looks at while it's
all happening.

## The contract

A loader is any object that satisfies this interface:

```ts
interface ReloadLoader {
  render(message: string): HTMLElement;
  cleanup?(): void;
}
```

That's it. `render()` returns a DOM element to inject into the overlay.
The picked message string is passed in — most loaders include it as a
caption, but a loader can ignore it entirely if it doesn't show text.

## Built-in loaders

| Name | When to use |
|---|---|
| `goo-spiral` | **Default.** Uiverse gooey gradient spinner. Visually consistent with the morph system. |
| `message-only` | Calm brands. Quote/tagline as the focal point. No spinner. |

## Adding a new loader (5 min recipe)

Most fun loaders on [Uiverse](https://uiverse.io) are HTML + CSS only.
Drop one in like this:

### Step 1 — Create the loader file

`src/lib/reload-overlay/loaders/heart-pulse.ts`:

```ts
import type { ReloadLoader } from './types';

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]!));
}

export const heartPulseLoader: ReloadLoader = {
  render(message: string): HTMLElement {
    const wrap = document.createElement('div');
    wrap.className = 'reload-overlay__loader-wrap reload-overlay__loader-wrap--heart-pulse';
    wrap.innerHTML = `
      <!-- Paste the HTML from Uiverse here, prefixed with the namespace class -->
      <div class="heart-pulse">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="reload-overlay__caption" role="status" aria-live="polite">
        ${escapeHtml(message)}
      </div>
    `;
    return wrap;
  },
};
```

### Step 2 — Add the CSS

Append to `src/lib/reload-overlay/reload-overlay.css`:

```css
/* Heart pulse loader (Uiverse / authorname) */
.reload-overlay__loader-wrap--heart-pulse .heart-pulse {
  /* Paste Uiverse CSS here, scoped under the wrap class so it doesn't leak */
  width: 80px;
  height: 80px;
  /* ...etc */
}
```

**Always scope styles under `.reload-overlay__loader-wrap--<name>`** so
multiple loaders can coexist without conflicts.

### Step 3 — Register it

Add to `src/lib/reload-overlay/loaders/index.ts`:

```ts
import { heartPulseLoader } from './heart-pulse';
export { heartPulseLoader } from './heart-pulse';

export const BUILTIN_LOADERS: Record<string, ReloadLoader> = {
  'goo-spiral': gooSpiralLoader,
  'message-only': messageOnlyLoader,
  'heart-pulse': heartPulseLoader,  // ← add here
};
```

### Step 4 — Pick it in brand config

`src/lib/config/brand.ts`:

```ts
reloadOverlay: {
  loader: 'heart-pulse',
  loaderText: 'default',
}
```

Done. Reload triggers will now show the heart pulse instead of the goo spiral.

## Brand-specific loader (full custom)

A brand can also provide a fully custom loader without registering it as a
built-in — useful for brand-only logo animations or adverts:

```ts
// In a brand bootstrap file:
import type { ReloadLoader } from '/src/lib/reload-overlay/loaders/types';

const brandLogoLoader: ReloadLoader = {
  render(message) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <img src="/brand/logo-animated.svg" alt="" class="brand-logo-spin">
      <div class="reload-overlay__caption">${message}</div>
    `;
    return wrap;
  },
};

(globalThis as any).__RELOAD_OVERLAY_CONFIG__ = {
  loader: brandLogoLoader,
  loaderText: 'custom',
  messages: {
    default: ['Welcome back', 'Just a moment for you'],
  },
};
```

## Loader ideas

Anything that fits in a `200px × 200px` viewport works well:

- **Spinners** — gooey, dots, ring, hourglass, bars
- **Logo animations** — drawing, scaling, rotating
- **Progress bars** — even though we don't have real progress, a fake
  determinate bar feels more reassuring than a spinner for some brands
- **Adverts** — small image + tagline + "Sponsored by..." caption
- **Mascots** — a brand mascot doing something cute (waving, sleeping, walking)
- **Quotes** — message-only loader with a rotating quote pool
- **Mini animations** — Lottie file, short MP4 video, animated GIF

## Don't

- Don't reference duration tokens (`var(--duration-*)`) in loader CSS —
  they'll be `0s` when motion=none is being applied and the loader won't
  animate during reload. Use raw seconds.
- Don't make loaders larger than ~300px in any dimension — they need to
  centre cleanly on every viewport.
- Don't fetch external assets in `render()` — the reload happens in 350ms,
  there's no time for a network request to complete.
- Don't bind event listeners that need cleanup — the overlay is destroyed
  by the page reload, so cleanup is handled for you. Use `cleanup()` only
  if you start a `requestAnimationFrame` loop or similar.
