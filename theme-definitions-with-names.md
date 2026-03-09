# Theme Definitions — Names + JSON

## Naming Architecture

Every theme has two name registers. The brand config picks which one to display.

```json
// In brand config
{ "nameStyle": "fun" }   // Mind the Box — playful, therapeutic
{ "nameStyle": "pro" }   // Frequency — professional, clean
```

### JSON definition format (updated):

```json
{
  "name": "ocean",
  "title": { "fun": "Finding Nemo", "pro": "Pacific" },
  "sample": { "fun": "Just keep swimming", "pro": "Coastal calm" },
  "primary": "#1a6b8a",
  "secondary": "#87ceeb",
  "luminance": "light",
  "chroma": "brand",
  "neutral": "warm"
}
```

### CVD variant naming:

CVD variants inherit the base theme's name with a suffix. NOT clinical names.

```json
// Matrix expansion adds suffix automatically:
{
  "cvdSuffix": {
    "protanopia": {
      "fun": " — No Red Zone",
      "pro": " — Warm Safe"
    },
    "deuteranopia": {
      "fun": " — Green Free",
      "pro": " — Cool Safe"
    },
    "tritanopia": {
      "fun": " — Beyond Blue",
      "pro": " — Sunset Safe"
    }
  }
}
```

So "Finding Nemo — No Red Zone" or "Pacific — Warm Safe".

### Dark variant naming:

```json
{
  "darkSuffix": {
    "fun": " After Dark",
    "pro": " Dark"
  }
}
```

So "Finding Nemo After Dark" or "Pacific Dark".

### Combined (dark + CVD):

"Finding Nemo After Dark — No Red Zone" or "Pacific Dark — Warm Safe"

---

## Accessibility Themes (5 bases)

### default.json

```json
{
  "name": "default",
  "title": { "fun": "Home Base", "pro": "Sage" },
  "sample": { "fun": "Where the heart is", "pro": "Natural sage green" },
  "primary": "#8fa68a",
  "secondary": "#c4907c",
  "luminance": "light",
  "chroma": "brand",
  "neutral": "warm"
}
```

### calm.json (was cream)

```json
{
  "name": "calm",
  "title": { "fun": "Easy Does It", "pro": "Calm" },
  "sample": { "fun": "Breathe in, breathe out", "pro": "Low contrast, low noise" },
  "primary": "#a89279",
  "secondary": "#9bb5c4",
  "luminance": "light",
  "chroma": "pastel",
  "neutral": "warm"
}
```

### high-contrast.json

```json
{
  "name": "high-contrast",
  "title": { "fun": "Loud & Clear", "pro": "High Contrast" },
  "sample": { "fun": "No squinting required", "pro": "Maximum visibility" },
  "primary": "#8fa68a",
  "secondary": "#c4907c",
  "luminance": "dark",
  "chroma": "neon",
  "neutral": "pure",
  "highContrast": true
}
```

### monochrome-warm.json

```json
{
  "name": "monochrome-warm",
  "title": { "fun": "Fifty Shades", "pro": "Warm Mono" },
  "sample": { "fun": "Of not-quite-grey", "pro": "Warm greyscale" },
  "primary": "#8a8078",
  "secondary": "#7a7068",
  "luminance": "light",
  "chroma": "grey",
  "neutral": "warm"
}
```

### monochrome-pure.json

```json
{
  "name": "monochrome-pure",
  "title": { "fun": "Noir", "pro": "Pure Mono" },
  "sample": { "fun": "Classic black and white", "pro": "True achromatic" },
  "primary": "#777777",
  "secondary": "#666666",
  "luminance": "light",
  "chroma": "grey",
  "neutral": "pure"
}
```

---

## Fun Themes (15 bases)

### retro-90s.json

```json
{
  "name": "retro-90s",
  "title": { "fun": "Saved by the Bell", "pro": "Retro" },
  "sample": { "fun": "Radical!", "pro": "90s nostalgia" },
  "primary": "#cc6699",
  "secondary": "#669999",
  "chroma": "brand"
}
```

### neon.json

```json
{
  "name": "neon",
  "title": { "fun": "Cyberpunk", "pro": "Neon" },
  "sample": { "fun": "Welcome to Night City", "pro": "Electric dark mode" },
  "primary": "#ff00ff",
  "secondary": "#00ffcc",
  "luminance": "dark",
  "chroma": "neon"
}
```

### ocean.json

```json
{
  "name": "ocean",
  "title": { "fun": "Finding Nemo", "pro": "Pacific" },
  "sample": { "fun": "Just keep swimming", "pro": "Coastal calm" },
  "primary": "#1a6b8a",
  "secondary": "#87ceeb",
  "chroma": "brand"
}
```

### sunset.json

```json
{
  "name": "sunset",
  "title": { "fun": "Golden Hour", "pro": "Sunset" },
  "sample": { "fun": "Chase the sun", "pro": "Warm golden tones" },
  "primary": "#e8553a",
  "secondary": "#f4a259",
  "chroma": "brand"
}
```

### forest.json

```json
{
  "name": "forest",
  "title": { "fun": "Into the Woods", "pro": "Forest" },
  "sample": { "fun": "Touch grass", "pro": "Deep woodland" },
  "primary": "#2d5a27",
  "secondary": "#8b6914",
  "chroma": "brand"
}
```

### midnight.json

```json
{
  "name": "midnight",
  "title": { "fun": "Stargazer", "pro": "Midnight" },
  "sample": { "fun": "Look up", "pro": "Deep navy elegance" },
  "primary": "#1a1a3e",
  "secondary": "#7b68ee",
  "luminance": "dark",
  "chroma": "brand"
}
```

### candy.json

```json
{
  "name": "candy",
  "title": { "fun": "Sugar Rush", "pro": "Candy" },
  "sample": { "fun": "Life is sweet", "pro": "Playful pastels" },
  "primary": "#ff69b4",
  "secondary": "#ffd700",
  "chroma": "pastel"
}
```

### lavender.json

```json
{
  "name": "lavender",
  "title": { "fun": "Purple Rain", "pro": "Lavender" },
  "sample": { "fun": "Let's go crazy", "pro": "Soft dreamy purple" },
  "primary": "#9370db",
  "secondary": "#dda0dd",
  "chroma": "pastel"
}
```

### deep-purple.json

```json
{
  "name": "deep-purple",
  "title": { "fun": "Hendrix", "pro": "Amethyst" },
  "sample": { "fun": "Purple haze all in my brain", "pro": "Bold creative violet" },
  "primary": "#6d28d9",
  "secondary": "#f97316",
  "chroma": "brand"
}
```

### warm-coral.json

```json
{
  "name": "warm-coral",
  "title": { "fun": "Coral Reef", "pro": "Warm Coral" },
  "sample": { "fun": "Under the sea", "pro": "Energetic warmth" },
  "primary": "#f97066",
  "secondary": "#3b82f6",
  "chroma": "brand"
}
```

### cool-slate.json

```json
{
  "name": "cool-slate",
  "title": { "fun": "Concrete Jungle", "pro": "Cool Slate" },
  "sample": { "fun": "City vibes", "pro": "Professional edge" },
  "primary": "#64748b",
  "secondary": "#f43f5e",
  "chroma": "brand"
}
```

### terracotta.json

```json
{
  "name": "terracotta",
  "title": { "fun": "Desert Vibes", "pro": "Terracotta" },
  "sample": { "fun": "Sandy toes", "pro": "Earthy natural warmth" },
  "primary": "#c2410c",
  "secondary": "#059669",
  "chroma": "brand"
}
```

### pastel-bright.json

```json
{
  "name": "pastel-bright",
  "title": { "fun": "Cotton Candy", "pro": "Pastel" },
  "sample": { "fun": "Fluffy clouds", "pro": "Light and airy" },
  "primary": "#a7c7e7",
  "secondary": "#f8b4c8",
  "chroma": "pastel"
}
```

### colour-mono.json

```json
{
  "name": "colour-mono",
  "title": { "fun": "Seeing Red", "pro": "Monochrome Red" },
  "sample": { "fun": "One colour to rule them all", "pro": "Single hue, full scale" },
  "primary": "#e63946",
  "secondary": "#e63946",
  "chroma": "brand"
}
```

### rainbow.json

```json
{
  "name": "rainbow",
  "title": { "fun": "Taste the Rainbow", "pro": "Spectrum" },
  "sample": { "fun": "All the colours!", "pro": "Full spectrum vivid" },
  "primary": "#ff0000",
  "secondary": "#8b00ff",
  "chroma": "neon"
}
```

---

## CVD Suffix Naming Table

These suffixes append to the base theme name when matrix expansion generates CVD variants.

### Protanopia (can't see red)

| Register | Suffix | Example (Ocean base) |
|---|---|---|
| fun | — No Red Zone | Finding Nemo — No Red Zone |
| pro | — Warm Safe | Pacific — Warm Safe |

### Deuteranopia (can't see green)

| Register | Suffix | Example (Ocean base) |
|---|---|---|
| fun | — Green Free | Finding Nemo — Green Free |
| pro | — Cool Safe | Pacific — Cool Safe |

### Tritanopia (can't see blue)

| Register | Suffix | Example (Ocean base) |
|---|---|---|
| fun | — Beyond Blue | Finding Nemo — Beyond Blue |
| pro | — Sunset Safe | Pacific — Sunset Safe |

### Dark variant

| Register | Suffix | Example (Ocean base) |
|---|---|---|
| fun | After Dark | Finding Nemo After Dark |
| pro | Dark | Pacific Dark |

### Combined (Dark + CVD)

| Register | Example |
|---|---|
| fun | Finding Nemo After Dark — No Red Zone |
| pro | Pacific Dark — Warm Safe |

---

## AI-Generated Names (for user custom themes)

When a user creates a custom theme through the colour picker, the engine can call Claude to generate names:

```js
// Input: two hex colours + luminance
{ primary: '#1a6b8a', secondary: '#87ceeb', luminance: 'light' }

// AI returns:
{
  "fun": "Aquaman's Closet",
  "pro": "Deep Current"
}
```

The user sees both suggestions. They can edit, keep, or type their own. Saved with the theme definition in localStorage.

---

## ThemePreviewTokens.js Changes

Replace hardcoded `themeMetadata` object with import from generated data:

```js
// Old — hardcoded
const themeMetadata = {
  'default': { title: 'Default', sample: 'Natural sage' },
  // ...8 entries
};

// New — read from generated JSON + brand config
import themeNames from '../themes/theme-names.json';

const nameStyle = document.body.dataset.nameStyle || 'pro';

function getTitle(themeName) {
  const entry = themeNames[themeName];
  return entry?.title?.[nameStyle] || themeName;
}

function getSample(themeName) {
  const entry = themeNames[themeName];
  return entry?.sample?.[nameStyle] || '';
}
```

### Build script generates `theme-names.json`:

```js
// In generate-theme-tokens.js — after generating all theme files
const nameMap = {};
for (const variant of allVariants) {
  nameMap[variant.name] = {
    title: variant.title,
    sample: variant.sample,
    category: variant.category, // 'accessibility' or 'fun'
  };
}
fs.writeFileSync(
  path.join(tokensDir, 'theme-names.json'),
  JSON.stringify(nameMap, null, 2)
);
```

This means adding a theme = adding a JSON file with names. The preview system picks it up automatically.
