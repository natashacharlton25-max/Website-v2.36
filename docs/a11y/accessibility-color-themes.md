# Accessibility Color Themes - Upgraded Token System

CSS theme definitions from `src/components/a11y/AccessibilityPanel.astro`

## Overview

- **Base themes**: dark, cream, high-contrast
- **CVD Modifiers**: protanopia, deuteranopia, tritanopia, monochrome (stackable!)
- **Semantic tokens**: Simplified naming for component use

---

## Semantic Token Layer

All themes expose these semantic tokens for consistent component styling:

```css
body[class*="a11y-"] {
  /* Surfaces */
  --bg: var(--brand-c-bg);
  --surface: var(--brand-c-bg);
  --surface2: var(--brand-c-bg-light);
  --surface3: var(--brand-c-bg-light);

  /* Text */
  --text: var(--brand-c-text-dark);
  --textMuted: var(--brand-c-text);

  /* Links */
  --link: var(--brand-c-secondary);
  --linkHover: var(--brand-c-secondary);
  --linkVisited: color-mix(in oklch, var(--link) 60%, var(--text) 40%);

  /* Focus */
  --focusRing: var(--color-Info-500);

  /* Status */
  --success: var(--color-Success);
  --warning: var(--color-Warning);
  --error: var(--color-Error);
  --danger: var(--color-Danger);

  /* Selection & Disabled */
  --selectionBg: color-mix(in oklch, var(--focusRing) 25%, transparent);
  --selectionText: var(--text);
  --disabledBg: color-mix(in oklch, var(--surface) 92%, var(--text) 8%);
  --disabledText: color-mix(in oklch, var(--text) 45%, transparent);
}
```

---

## Base Theme: Dark

```css
body.a11y-theme-dark {
  color-scheme: dark;

  /* Background (dark slate, stepped) */
  --brand-c-bg:  oklch(0.14 0.02 260);
  --brand-c-bg: oklch(0.17 0.02 260);
  --brand-c-bg-light: oklch(0.20 0.02 260);
  --brand-c-bg-light: oklch(0.23 0.02 260);
  --brand-c-bg-light: oklch(0.26 0.02 260);
  --brand-c-bg-light: oklch(0.30 0.02 260);

  --brand-c-bg-dark: oklch(0.13 0.02 260);
  --brand-c-bg-dark: oklch(0.11 0.015 260);
  --brand-c-bg-dark: oklch(0.095 0.012 260);
  --brand-c-bg-dark: oklch(0.08 0.010 260);
  --brand-c-bg-dark: oklch(0.065 0.010 260);

  /* Text (high readability on dark) */
  --brand-c-text-light: oklch(0.92 0.01 260);
  --brand-c-text-light: oklch(0.88 0.01 260);
  --brand-c-text-light: oklch(0.84 0.01 260);
  --brand-c-text: oklch(0.78 0.015 260);
  --brand-c-text: oklch(0.72 0.015 260);
  --brand-c-text: oklch(0.66 0.015 260);
  --brand-c-text-dark: oklch(0.60 0.015 260);
  --brand-c-text-dark: oklch(0.56 0.015 260);

  /* Primary (indigo/purple spectrum) */
  --brand-c-primary-light:  oklch(0.93 0.02 270);
  --brand-c-primary-light: oklch(0.86 0.04 270);
  --brand-c-primary-light: oklch(0.78 0.06 270);
  --brand-c-primary-light: oklch(0.70 0.09 270);
  --brand-c-primary: oklch(0.64 0.12 270);
  --brand-c-primary: oklch(0.58 0.14 270);
  --brand-c-primary-dark: oklch(0.52 0.13 270);
  --brand-c-primary-dark: oklch(0.46 0.11 270);
  --brand-c-primary-dark: oklch(0.40 0.09 270);
  --brand-c-primary-dark: oklch(0.34 0.07 270);

  /* Secondary (soft cyan) */
  --brand-c-secondary-light: oklch(0.88 0.06 200);
  --brand-c-secondary-light: oklch(0.80 0.08 200);
  --brand-c-secondary-light: oklch(0.72 0.10 200);
  --brand-c-secondary: oklch(0.66 0.11 200);
  --brand-c-secondary: oklch(0.60 0.12 200);
  --brand-c-secondary-dark: oklch(0.54 0.10 200);
  --brand-c-secondary-dark: oklch(0.48 0.08 200);
  --brand-c-secondary-dark: oklch(0.42 0.06 200);

  /* Accents (soft neon) */
  --brand-c-neutral: oklch(0.70 0.12 145);
  --brand-c-neutral: oklch(0.68 0.13 350);
  --brand-c-neutral: oklch(0.66 0.10 200);
  --brand-c-neutral: oklch(0.74 0.12 85);
  --brand-c-neutral: oklch(0.70 0.14 30);

  /* Status */
  --color-Success: oklch(0.68 0.12 145);
  --color-Warning: oklch(0.76 0.14 85);
  --color-Error:   oklch(0.62 0.18 25);
  --color-Danger:  var(--color-Error);
  --color-Info:    oklch(0.68 0.12 250);

  /* Semantic overrides */
  --text: var(--brand-c-text-light);
  --link: oklch(0.74 0.12 270);
  --linkHover: oklch(0.80 0.10 270);
  --focusRing: oklch(0.76 0.10 200);
}
```

---

## Base Theme: Cream

```css
body.a11y-theme-cream {
  color-scheme: light;

  /* Background (ivory/cream) */
  --brand-c-bg:  oklch(0.98 0.015 90);
  --brand-c-bg: oklch(0.965 0.020 88);
  --brand-c-bg-light: oklch(0.950 0.022 85);
  --brand-c-bg-light: oklch(0.935 0.025 82);
  --brand-c-bg-light: oklch(0.920 0.028 78);
  --brand-c-bg-light: oklch(0.905 0.030 75);

  --brand-c-bg-dark: oklch(0.40 0.04 45);
  --brand-c-bg-dark: oklch(0.34 0.04 42);
  --brand-c-bg-dark: oklch(0.28 0.03 40);
  --brand-c-bg-dark: oklch(0.22 0.03 35);
  --brand-c-bg-dark: oklch(0.18 0.02 30);

  /* Text (warm dark brown) */
  --brand-c-text-light: oklch(0.36 0.03 40);
  --brand-c-text-light: oklch(0.33 0.03 38);
  --brand-c-text-light: oklch(0.30 0.03 36);
  --brand-c-text: oklch(0.27 0.03 34);
  --brand-c-text: oklch(0.24 0.025 33);
  --brand-c-text: oklch(0.21 0.020 32);
  --brand-c-text-dark: oklch(0.18 0.018 30);
  --brand-c-text-dark: oklch(0.16 0.016 28);

  /* Primary (warm amber/brown) */
  --brand-c-primary-light:  oklch(0.96 0.02 70);
  --brand-c-primary-light: oklch(0.92 0.04 65);
  --brand-c-primary-light: oklch(0.86 0.06 60);
  --brand-c-primary-light: oklch(0.78 0.08 55);
  --brand-c-primary: oklch(0.70 0.10 50);
  --brand-c-primary: oklch(0.62 0.10 45);
  --brand-c-primary-dark: oklch(0.54 0.10 40);
  --brand-c-primary-dark: oklch(0.46 0.08 38);
  --brand-c-primary-dark: oklch(0.38 0.07 35);
  --brand-c-primary-dark: oklch(0.30 0.06 32);

  /* Secondary (terracotta) */
  --brand-c-secondary-light: oklch(0.92 0.04 35);
  --brand-c-secondary-light: oklch(0.86 0.06 32);
  --brand-c-secondary-light: oklch(0.79 0.08 30);
  --brand-c-secondary: oklch(0.71 0.10 28);
  --brand-c-secondary: oklch(0.63 0.10 25);
  --brand-c-secondary-dark: oklch(0.55 0.10 22);
  --brand-c-secondary-dark: oklch(0.47 0.08 20);
  --brand-c-secondary-dark: oklch(0.39 0.06 18);

  /* Accents (earthy) */
  --brand-c-neutral: oklch(0.62 0.10 145);  /* sage */
  --brand-c-neutral: oklch(0.60 0.10 25);   /* rust */
  --brand-c-neutral: oklch(0.55 0.08 280);/* dusty purple */
  --brand-c-neutral: oklch(0.60 0.10 200); /* teal */
  --brand-c-neutral: oklch(0.62 0.10 350); /* rose */

  /* Status */
  --color-Success: oklch(0.56 0.10 145);
  --color-Warning: oklch(0.72 0.12 70);
  --color-Error:   oklch(0.56 0.14 25);
  --color-Danger:  var(--color-Error);
  --color-Info:    oklch(0.56 0.08 250);

  /* Semantic overrides */
  --link: oklch(0.42 0.10 45);
  --linkHover: oklch(0.34 0.10 45);
  --focusRing: oklch(0.62 0.10 200);
}
```

---

## Base Theme: High Contrast

```css
body.a11y-theme-high-contrast {
  color-scheme: dark;

  --brand-c-bg: #000000;
  --brand-c-bg: #000000;
  --brand-c-bg-light: #000000;
  --brand-c-bg-light: #000000;
  --brand-c-bg-light: #000000;
  --brand-c-bg-light: #000000;

  --brand-c-text-light: #ffffff;
  --brand-c-text-light: #ffffff;
  --brand-c-text-light: #ffffff;
  --brand-c-text: #ffffff;
  --brand-c-text: #ffffff;
  --brand-c-text: #ffffff;
  --brand-c-text-dark: #ffffff;
  --brand-c-text-dark: #ffffff;

  --brand-c-primary: #ffffff;
  --brand-c-secondary: #ffff00;

  --brand-c-neutral: #00ffff;
  --brand-c-neutral: #ffff00;
  --brand-c-neutral: #00ff00;
  --brand-c-neutral: #ff6600;
  --brand-c-neutral: #ff00ff;

  --color-Success: #00ff00;
  --color-Warning: #ffff00;
  --color-Error:   #ff0000;
  --color-Danger:  #ff0000;
  --color-Info:    #00ffff;

  /* Semantic */
  --bg: #000000;
  --surface: #000000;
  --text: #ffffff;
  --textMuted: #ffffff;
  --link: #ffff00;
  --linkHover: #ffffff;
  --focusRing: #00ffff;
}
```

---

## CVD Modifiers (Stackable)

These can be combined with base themes: `a11y-theme-dark a11y-cvd-protanopia`

### Protanopia (Red-blind)

```css
body.a11y-cvd-protanopia,
body.a11y-theme-protanopia {
  --brand-c-neutral: oklch(0.70 0.12 195); /* teal */
  --brand-c-neutral: oklch(0.75 0.14 70);  /* yellow-orange */
  --brand-c-neutral: oklch(0.60 0.14 250); /* blue */
  --brand-c-neutral: oklch(0.75 0.12 90); /* yellow */
  --brand-c-neutral: oklch(0.62 0.10 300);/* purple */

  --color-Success: oklch(0.62 0.12 220);
  --color-Warning: oklch(0.78 0.14 85);
  --color-Error:   oklch(0.55 0.14 250);
  --color-Danger:  var(--color-Error);
  --color-Info:    oklch(0.66 0.10 280);

  --link: var(--brand-c-neutral);
  --focusRing: var(--brand-c-neutral);
}
```

### Deuteranopia (Green-blind)

```css
body.a11y-cvd-deuteranopia,
body.a11y-theme-deuteranopia {
  --brand-c-neutral: oklch(0.62 0.14 255); /* blue */
  --brand-c-neutral: oklch(0.72 0.16 55);  /* orange */
  --brand-c-neutral: oklch(0.60 0.14 300); /* purple */
  --brand-c-neutral: oklch(0.78 0.12 90); /* yellow */
  --brand-c-neutral: oklch(0.62 0.10 25); /* red-orange */

  --color-Success: oklch(0.62 0.14 255);
  --color-Warning: oklch(0.72 0.16 55);
  --color-Error:   oklch(0.62 0.10 25);
  --color-Danger:  var(--color-Error);
  --color-Info:    oklch(0.62 0.10 300);

  --link: var(--brand-c-neutral);
  --focusRing: var(--brand-c-neutral);
}
```

### Tritanopia (Blue-blind)

```css
body.a11y-cvd-tritanopia,
body.a11y-theme-tritanopia {
  --brand-c-neutral: oklch(0.66 0.14 145); /* green */
  --brand-c-neutral: oklch(0.74 0.14 80);  /* yellow */
  --brand-c-neutral: oklch(0.62 0.16 350); /* pink */
  --brand-c-neutral: oklch(0.60 0.18 25); /* red */
  --brand-c-neutral: oklch(0.62 0.10 280);/* purple */

  --color-Success: oklch(0.66 0.14 145);
  --color-Warning: oklch(0.74 0.14 80);
  --color-Error:   oklch(0.60 0.18 25);
  --color-Danger:  var(--color-Error);
  --color-Info:    oklch(0.62 0.16 350);

  --link: var(--brand-c-neutral);
  --focusRing: var(--brand-c-neutral);
}
```

### Monochrome

```css
body.a11y-cvd-monochrome,
body.a11y-theme-monochrome {
  --brand-c-neutral: oklch(0.70 0 0);
  --brand-c-neutral: oklch(0.60 0 0);
  --brand-c-neutral: oklch(0.50 0 0);
  --brand-c-neutral: oklch(0.65 0 0);
  --brand-c-neutral: oklch(0.55 0 0);

  --color-Success: oklch(0.62 0 0);
  --color-Warning: oklch(0.78 0 0);
  --color-Error:   oklch(0.48 0 0);
  --color-Danger:  var(--color-Error);
  --color-Info:    oklch(0.66 0 0);

  --link: oklch(0.80 0 0);
  --linkHover: oklch(0.92 0 0);
  --focusRing: oklch(0.92 0 0);
}
```

---

## Usage Examples

### Single theme:
```html
<body class="a11y-theme-dark">
```

### Stacked (base + CVD modifier):
```html
<body class="a11y-theme-dark a11y-cvd-protanopia">
<body class="a11y-theme-cream a11y-cvd-monochrome">
```

### Using semantic tokens in components:
```css
.my-card {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--textMuted);
}

.my-card:focus-visible {
  outline: 3px solid var(--focusRing);
}

.my-button:disabled {
  background: var(--disabledBg);
  color: var(--disabledText);
}
```

---

## OKLCH Reference

OKLCH format: `oklch(L C H)`
- **L (Lightness)**: 0 = black, 1 = white
- **C (Chroma)**: 0 = gray, higher = more saturated
- **H (Hue)**: 0-360 degrees
  - 0/360 = red
  - 30 = orange
  - 60 = yellow
  - 120 = green
  - 180 = cyan
  - 240 = blue
  - 300 = magenta
  - 350 = pink/rose
