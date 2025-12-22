# Theme Preview System

## Overview

The theme preview system automatically generates color previews for all theme cards in the accessibility panel. Theme cards display their own colors regardless of which theme is currently active.

## How It Works

1. **Build-time extraction**: A Node.js script scans all theme CSS files and extracts core color tokens
2. **Static CSS generation**: Core tokens are compiled into a single `coretokens.css` file
3. **Dynamic rendering**: JavaScript automatically discovers and renders theme cards
4. **Isolated styling**: Each card uses its own core tokens, unaffected by the active theme

## Core Tokens

Each theme must define 4 core tokens with the `-c-` prefix:

- `--{prefix}-c-bg`: Background color
- `--{prefix}-c-text`: Text color
- `--{prefix}-c-primary`: Primary/logo color
- `--{prefix}-c-accent`: Accent/secondary color

**Examples:**
```css
/* Brand theme (default) */
--brand-c-bg: #f9f8f6;
--brand-c-text: #474747;
--brand-c-primary: #8fa68a;
--brand-c-accent: #c4907c;

/* Accessibility theme */
--a11y-dark-c-bg: #040913;
--a11y-dark-c-text: #ccd3da;
--a11y-dark-c-primary: #962587;
--a11y-dark-c-accent: #272596;
```

## Updating Core Tokens

### When to Run

Run the generator whenever you:
- Update any theme CSS file colors
- Modify core tokens (`-c-bg`, `-c-text`, `-c-primary`, `-c-accent`)
- Add a new theme
- Change theme file structure

### How to Run

```bash
node scripts/generate-core-tokens.js
```

**Expected output:**
```
🎨 Generating core tokens CSS...
  ✓ Extracted tokens for: cream
  ✓ Extracted tokens for: dark
  ✓ Extracted tokens for: deuteranopia
  ✓ Extracted tokens for: high-contrast
  ✓ Extracted tokens for: monochrome
  ✓ Extracted tokens for: protanopia
  ✓ Extracted tokens for: tritanopia
  ✓ Extracted tokens for: default

✅ Generated src/styles/themes/Preview/coretokens.css
📦 8 themes processed
```

### What It Does

1. Scans `src/styles/themes/` directory recursively
2. Excludes the `Preview/` folder (to avoid circular processing)
3. Extracts core tokens from each theme CSS file
4. Generates/updates `src/styles/themes/Preview/coretokens.css`
5. All core tokens become available globally in `:root`

## File Structure

```
src/styles/themes/
├── Preview/
│   ├── coretokens.css          # Auto-generated (DO NOT EDIT)
│   └── ThemePreviewTokens.js   # Dynamic card renderer
├── a11y/
│   ├── a11y-dark.css
│   ├── a11y-cream.css
│   ├── a11y-high-contrast.css
│   └── ...
└── brand/
    └── BrandDefault.css
```

## Adding a New Theme

1. Create your theme CSS file in `src/styles/themes/a11y/` or `src/styles/themes/brand/`
2. Define the 4 required core tokens with `-c-` prefix
3. Run `node scripts/generate-core-tokens.js`
4. The new theme will automatically appear in the accessibility panel

**No code changes needed!** The system auto-discovers new themes via Vite glob imports.

## Theme Card Metadata

To customize the display name and description for your theme, edit the metadata in `ThemePreviewTokens.js`:

```javascript
const themeMetadata = {
  'default': { title: 'Default', sample: 'Natural sage' },
  'dark': { title: 'Dark', sample: 'Low strain' },
  'your-theme': { title: 'Your Theme', sample: 'Short description' }
};
```

## Technical Details

### Dynamic Card Rendering

Theme cards are created at runtime by `ThemePreviewTokens.js`:
- Uses Vite `import.meta.glob()` to discover theme files
- Filters out the Preview folder to avoid circular imports
- Automatically renders cards with logo, title, sample text, and color swatches
- Event delegation handles click events on dynamically created elements

### Global Styles Requirement

Theme card styles MUST be in the global `<style is:global>` block in `AccessibilityPanel.astro` because:
- Cards are created dynamically by JavaScript after page load
- Astro's scoped CSS only applies to server-rendered elements
- Dynamic elements need globally available CSS selectors

### Build Integration

For automated builds, add to `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/generate-core-tokens.js",
    "build": "astro build"
  }
}
```

This ensures core tokens are always up-to-date before production builds.

## Troubleshooting

### Theme cards showing no colors

1. Check if coretokens.css was generated: `ls src/styles/themes/Preview/coretokens.css`
2. Verify core tokens are imported in `BaseLayout.astro`
3. Run the generator: `node scripts/generate-core-tokens.js`
4. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### New theme not appearing

1. Verify theme file is in `src/styles/themes/a11y/` or `src/styles/themes/brand/`
2. Check theme file has the 4 required `-c-` tokens
3. Run `node scripts/generate-core-tokens.js`
4. Check browser console for "Rendered X theme cards" message

### Theme cards not clickable

- Event handlers use event delegation on `.a11y-theme-list` container
- Check browser console for JavaScript errors
- Verify `ThemePreviewTokens.js` is imported in `BaseLayout.astro`

## Related Files

- `scripts/generate-core-tokens.js` - Build script that extracts tokens
- `src/styles/themes/Preview/coretokens.css` - Generated core tokens (auto-generated)
- `src/styles/themes/Preview/ThemePreviewTokens.js` - Dynamic card renderer
- `src/components/a11y/AccessibilityPanel.astro` - Theme card container and global styles
- `src/layouts/BaseLayout.astro` - Imports coretokens.css and ThemePreviewTokens.js
- `src/scripts/ThemeSwitcher.js` - Handles theme switching logic
