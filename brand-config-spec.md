# Brand Config System

## Overview

Brand colours are defined in `brandconfig.json` and injected into theme CSS at build time. Components read numbered scale positions as before — no component changes needed. Text contrast is calculated automatically in CSS.

## How it works

```
brandconfig.json → generate-theme-tokens.js → BrandDefault.css
     (hex)             (maps role→position)      (overrides scale)
```

1. Brand config defines hex colours per role (fill, hover, tint, border)
2. Engine generates the full numbered scale as normal from the theme definition
3. After scale generation, the brand config hex values override specific positions
4. Components read `var(--primary-600)` and get the exact brand colour

## Brand Config Shape

```json
{
  "brand": "mind-the-box",
  "primary": {
    "fill": "#a8e6cf",
    "hover": "#4b0082"
  },
  "secondary": {
    "fill": "#F13E93",
    "hover": "#d42a7c"
  },
  "dark": {
    "primary": {
      "fill": "#a8e6cf",
      "hover": "#d4f3e7"
    },
    "secondary": {
      "fill": "#F13E93",
      "hover": "#f9a0c8"
    }
  },
  "highContrast": {
    "primary": {
      "fill": "#00ff88",
      "hover": "#ffffff"
    },
    "secondary": {
      "fill": "#ff3399",
      "hover": "#ffffff"
    }
  }
}
```

### Rules
- Only `fill` and `hover` are required per family
- `tint` and `border` are optional — if omitted, engine-calculated scale values are used
- `dark` and `highContrast` sections are optional — if omitted, those modes use the engine scale unchanged
- The brand can mix any colours — pastel fill with neon hover, completely different hues, etc.

## Role → Position Mapping

| Role | Scale Position | Components that read it |
|------|---------------|------------------------|
| fill | 600 | Button, Link, Card, Tooltip, Image, FigCaption, List, FormField |
| hover | 800 | Button, Link |
| tint | 200 | Button (ghost/outline hover), Link (highlight bar), Badge |
| border | 400 | Badge, Card |

## Text Contrast — Pure CSS

Button text colour is calculated automatically using oklch relative colour syntax:

```css
color: oklch(from var(--_btn-brand) round(1.21 - l) 0 0);
```

- If the fill lightness > 0.72 → black text (#000000)
- If the fill lightness <= 0.72 → white text (#ffffff)
- Applied on both static state (from fill) and hover state (from hover bg)
- No engine calculation needed — CSS does it at render time
- Matches APCA contrast model

### Example
- Pastel green fill (#a8e6cf, L=0.84) → dark text
- Neon indigo hover (#4b0082, L=0.22) → white text
- Both calculated from the same CSS formula

## Mode Behaviour

### Light mode (brand default)
- Uses the top-level `primary`/`secondary` from brand config
- Brand's exact hex colours at functional positions
- Text contrast auto-calculated in CSS

### Dark mode
- Uses `dark` section if present in brand config
- If absent, uses the engine-calculated flipped scale (existing behaviour)
- Same CSS text formula works — adapts to whatever fill colour is used
- Hover typically goes lighter (opposite direction from light mode)

### High Contrast
- Uses `highContrast` section if present
- Typically neon/vivid versions of the brand colours
- Text contrast formula handles white-on-neon or black-on-neon automatically

### CVD variants (protan/tritan)
- Use the engine-calculated CVD-safe hue shifts from the theme definition
- Brand config can optionally add CVD sections (not yet implemented)

## What the system does NOT do
- Content JSON never defines colours — only variant, style, effect
- No colour tokens in component schemas
- No inline style overrides for colours in content JSON
- The brand config is the single source for all brand colour decisions

## Files

| File | Purpose |
|------|---------|
| `src/styles/themes/brand/mind-the-box/brandconfig.json` | Brand colour definitions |
| `scripts/generate-theme-tokens.js` | Reads brand config, applies overrides during generation |
| `src/themes/definitions/accessibility/default.json` | Theme definition (primary/secondary input for scale generation) |
| `src/styles/themes/brand/mind-the-box/BrandDefault.css` | Generated theme CSS with brand overrides |
| `src/components/atoms/Button/Button.css` | First atom using oklch text contrast formula |

## Next Steps

- Apply oklch text contrast formula to other atoms (Link, Badge, Card, etc.)
- Apply oklch-derived borders and shadows (from fill colour) to reduce brand config further
- Test with more brand colour combinations
- Consider if dark/HC sections can be auto-derived from light fill + hover hues
- Remove `--btn-filled-text` engine calculation (replaced by CSS formula)
- Remove colour block from Button schema (already done)
- Audit all atoms for inline style colour overrides in test JSON
