# Accessibility Components (a11y)

A complete, portable accessibility solution for Astro projects. Uses your token system for theming and includes color blindness support.

## Quick Start

1. Copy this entire `a11y` folder to your project's `src/components/`
2. Import your token CSS (e.g., `brandDefault.css`) in your layout
3. Add the component to your layout

## Components

### AccessibilityPanel.astro (Sidebar)
Full-featured accessibility sidebar with floating trigger button.

```astro
---
import AccessibilityPanel from '@/components/a11y/AccessibilityPanel.astro';
---

<AccessibilityPanel position="bottom-right" mainContentId="main" />
```

**Props:**
- `position`: `'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'` (default: `'bottom-right'`)
- `buttonSize`: Size in pixels (default: `48`)
- `mainContentId`: ID for skip link (default: `'main-content'`)
- `navId`: Navigation ID for skip link (default: `'main-nav'`)
- `skipLinks`: Additional skip links array

### AccessibilitySettings.astro (Full Page)
Responsive full-page settings, better for mobile and can be bookmarked.

```astro
---
import AccessibilitySettings from '@/components/a11y/AccessibilitySettings.astro';
---

<AccessibilitySettings showBackButton={true} backUrl="/" />
```

**Props:**
- `showBackButton`: Show back navigation (default: `true`)
- `backUrl`: Where back button goes (default: `'/'`)

### AccessibilityButton.astro (Link Button)
Simple floating button that links to a settings page.

```astro
---
import AccessibilityButton from '@/components/a11y/AccessibilityButton.astro';
---

<AccessibilityButton href="/accessibility" position="bottom-right" />
```

### AccessibilityIcon.astro (Icons)
Token-aware icons that inherit color from parent.

```astro
---
import AccessibilityIcon from '@/components/a11y/AccessibilityIcon.astro';
---

<AccessibilityIcon icon="accessibility" size={32} />
<AccessibilityIcon icon="low-vision" />
<AccessibilityIcon icon="contrast" class="text-primary" />
```

**Available icons:** `accessibility`, `low-vision`, `blind`, `hearing`, `sign-language`, `wheelchair`, `braille`, `closed-caption`, `audio-description`, `website`, `text-size`, `contrast`, `motion`, `focus`

## Features

### Visual Settings
- Text-only mode (hides images)
- Highlight links (underline all)
- 8 color themes

### Typography
- Dyslexia-friendly font (OpenDyslexic)
- Font size (50%-200%)
- Letter spacing
- Word spacing
- Line height

### Navigation & Motion
- Reduce motion toggle
- Enhanced focus indicators
- Screen reader mode

### Color Themes (Token-aware)
| Theme | Best For |
|-------|----------|
| Default | Standard use |
| Dark | Low-light, eye strain |
| Cream | Reading, eye comfort |
| High Contrast | Low vision |
| Protanopia | Red-blindness |
| Deuteranopia | Green-blindness |
| Tritanopia | Blue-blindness |
| Monochrome | Maximum clarity |

## JavaScript API

Exposed globally as `window.a11y`:

```js
// Announce to screen readers
window.a11y.announce('Item added to cart');
window.a11y.announce('Error!', 'assertive');

// Check preferences
window.a11y.prefersReducedMotion(); // boolean
window.a11y.prefersHighContrast();  // boolean

// Get/apply settings
const settings = window.a11y.getSettings();
window.a11y.applySettings(settings);

// Focus trap for modals
const trap = new window.a11y.FocusTrap(modalElement);
trap.activate();
trap.deactivate();
```

## CSS Classes

Global utility classes added:

```css
.sr-only           /* Screen reader only */
.sr-only-focusable /* SR only, visible on focus */
```

Body classes (auto-applied):
- `.a11y-text-only`
- `.a11y-highlight-links`
- `.a11y-dyslexia-font`
- `.a11y-reduce-motion`
- `.a11y-enhanced-focus`
- `.a11y-screen-reader-mode`
- `.a11y-theme-{name}`

## Token Integration

Components use these CSS custom properties with fallbacks:

```css
--color-Primary-500       /* Main accent */
--color-Primary-300       /* Light accent */
--color-BackgroundDark-800 /* Panel background */
--color-BackgroundDark-900 /* Header background */
--color-Background-100    /* Text on dark */
--color-Neutral-400       /* Muted text */
--color-Success           /* Success states */
--color-Warning           /* Enhanced focus */
--color-Danger            /* Reset button hover */
```

If tokens aren't loaded, sensible defaults are used.

## Browser Support

- All modern browsers
- Falls back gracefully for older browsers
- `prefers-reduced-motion` respected
- `prefers-contrast: high` supported
- Print styles included for PDF export

## Persistence

Settings are saved to `localStorage` under key `a11y-settings` and persist across sessions.
