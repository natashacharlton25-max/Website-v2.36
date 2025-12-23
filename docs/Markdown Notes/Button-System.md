# Button System

The button system is split into two files for clean separation of concerns.

## Files

| File | Purpose |
|------|---------|
| `src/styles/buttons/basic-button.css` | All button styles (variants, sizes, shapes) |
| `src/styles/buttons/styled-button.css` | Fancy effects only (glint sweep, hover shadow) |

## Usage

```html
<!-- Basic button -->
<a href="/page" class="btn">Click Me</a>

<!-- With variant -->
<button class="btn btn-secondary">Secondary</button>

<!-- With size and shape -->
<button class="btn btn-accent1 btn-lg btn-pill">Large Pill</button>
```

## Variants

### Color Variants
| Class | Background | Text |
|-------|------------|------|
| `.btn` (default) | Primary-500 | White |
| `.btn-primary` | Primary-500 | White |
| `.btn-secondary` | Secondary-500 | White |
| `.btn-accent1` | AccentOne-500 | White |
| `.btn-accent2` | AccentTwo-500 | White |
| `.btn-accent3` | AccentThree-500 | White |
| `.btn-accent4` | AccentFour-500 | White |
| `.btn-accent5` | AccentFive-500 | White |

### Style Variants
| Class | Description |
|-------|-------------|
| `.btn-outline` | Transparent bg, colored border, fills on hover |
| `.btn-ghost` | No border, subtle hover background |
| `.btn-glassmorphic` | Frosted glass effect with backdrop blur |
| `.btn-neumorphic` | Soft UI with inset/outset shadows |
| `.btn-gradient` | Uses `--gradient-hero` background |

## Sizes

| Class | Padding | Min Height | Font Size |
|-------|---------|------------|-----------|
| `.btn-sm` | sm / md | 2rem | text-sm |
| (default) | md / lg | 2.75rem | text-base |
| `.btn-lg` | lg / 2xl | 3.5rem | text-lg |

## Shapes

| Class | Border Radius |
|-------|---------------|
| (default) | `--radius-md` |
| `.btn-pill` | `--radius-full` (fully rounded) |
| `.btn-rounded` | `--radius-xl` |
| `.btn-sharp` | 0 (square corners) |
| `.btn-circle` | 50% (icon-only, equal width/height) |
| `.btn-square` | Same as default (icon-only, equal width/height) |

## Icons

```html
<!-- Icon left (default) -->
<button class="btn btn-icon-left">
  <svg class="btn-icon">...</svg>
  Text
</button>

<!-- Icon right -->
<button class="btn btn-icon-right">
  <svg class="btn-icon">...</svg>
  Text
</button>

<!-- Icon only -->
<button class="btn btn-circle" aria-label="Add">
  <svg class="btn-icon">...</svg>
</button>
```

## Customizing Text Color

Each variant defines its own `color` property. To change text color, edit the variant in `basic-button.css`:

```css
.btn-primary {
  background-color: var(--color-Primary-500);
  color: var(--color-White);  /* Change this */
}
```

Special variants like `.btn-glassmorphic` use `var(--color-Text-700)` for darker text on lighter backgrounds.

## Astro Component

Use the `<Button>` component for type-safe props:

```astro
<Button variant="primary" size="lg" shape="pill">
  Click Me
</Button>

<Button variant="accent1" shape="circle" icon="/icons/plus.svg" />
```

### Props
- `variant`: primary | secondary | outline | accent1-5 | ghost | glassmorphic | neumorphic | gradient
- `size`: sm | md | lg
- `shape`: default | circle | square | dropdown | pill | sharp | rounded
- `href`: Makes it an anchor tag
- `icon`: Path to icon SVG
- `disabled`: Disables the button

## Accessibility

- Buttons respect `prefers-reduced-motion` (disables transitions and glint)
- Buttons respect `prefers-contrast: more` (adds visible border)
- Focus states use visible outline with offset
- Disabled state uses `aria-disabled` support
