# AAC Dual System — Image AAC vs Content AAC

## Overview

The platform has **two independent AAC systems**. Both render pictogram symbol cards, but they serve different purposes and are toggled independently.

---

## System 1: Image AAC (Image Descriptions)

**What it does:** Shows pictogram cards that *describe what an image contains*.

| Property | Value |
|----------|-------|
| Toggle | `data-alt-text-mode="aac"` on `<html>` |
| Panel button | "Image AAC" (in Image Descriptions section) |
| Setting | `altTextMode: 'aac'` |
| Atom | Image (`altAacCards` prop) |
| Resolver | `resolveAACPhrase()` in `aacResolver.ts` |
| Data source | D1 `alt_aac_phrase` field, resolved at build time by `load-alt-text.ts` |
| CSS | `aac-mode.css` — hides images, shows `.image-alt-aac` |

**Data flow:**
```
D1 alt_aac_phrase → snapshot-alt-text.js → loadAllAltText()
  → resolveAACPhrase() → AacCardData[] → Image atom altAacCards prop
```

**Example:** An image of a bridge gets AAC cards for "bridge", "path", "crossing".

---

## System 2: Content AAC (Text/Heading Pictograms)

**What it does:** Shows pictogram cards for the *actual text content* on the page — headings, paragraphs, any content rendered through Text or Heading atoms.

| Property | Value |
|----------|-------|
| Toggle | `data-content-aac` on `<html>` |
| Panel button | "Content AAC" (in Content AAC section) |
| Setting | `contentAac: true` |
| Atoms | Text (`aac` prop), Heading (`aac` prop) |
| Resolver | `aacInline()` in `aac-inline.ts` |
| Data source | Slot content (the actual text), resolved at build time |
| CSS | `aac-mode.css` — shows `.content-aac` spans |

**Data flow:**
```
<Text aac>Finding your way back</Text>
  → Astro.slots.render('default') → strip HTML tags
  → aacInline(plainText) → per-word API lookup (cached per build)
  → HTML string of .aac-card spans → rendered as .content-aac span
```

**Example:** A heading "Boundaries & Self-Worth" gets AAC cards for "boundary", "self", "worth".

---

## Key Differences

| | Image AAC | Content AAC |
|---|---|---|
| **Purpose** | Describe images | Translate text to symbols |
| **Input** | `alt_aac_phrase` from D1 | Slot content (any text) |
| **Trigger** | `data-alt-text-mode="aac"` | `data-content-aac` |
| **Opt-in** | Image atom always has it (if data exists) | Requires `aac` prop on Text/Heading |
| **API** | `resolveAACPhrase()` (from snapshot) | `aacInline()` (hits API, cached per build) |
| **Replaces** | Hides the image, shows cards | Shows cards alongside text |
| **Independent** | Yes — can be on without Content AAC | Yes — can be on without Image AAC |

---

## Both Use the Same

- **AacCard molecule** for rendering pictogram cards
- **`aac-mode.css`** for CSS visibility rules
- **Cognitive level filtering** via `data-cognitive-level` + `data-core-tier`
- **Symbol set selection** via `data-symbol-set` (user picks their preferred pictures)
- **BCI reference numbers** as the universal concept key

---

## Panel Layout

```
Test Controls
├── Theme:              Light | Dark | High Viz Light | High Viz Dark | Mono Light | Mono Dark
├── Toggles:            Text Only | Highlight Links | Reduced Motion | Large Scrollbar | XL Text
├── Image Descriptions: Alt Text | Image AAC          ← System 1
└── Content AAC:        Content AAC                    ← System 2
```

---

## Usage in Components

### Text atom
```astro
<Text aac>This text gets pictogram cards at build time.</Text>
<Text>This text does NOT get AAC (no prop).</Text>
```

### Heading atom
```astro
<Heading level={2} aac>Our Philosophy</Heading>
<Heading level={3}>This heading has no AAC version.</Heading>
```

### JSON-driven (production pattern)
```json
{
  "title": "Boundaries & Self-Worth",
  "titleAac": true,
  "description": "A guided workbook for exploring personal boundaries.",
  "descriptionAac": true
}
```
```astro
<Heading level={2} aac={data.titleAac}>{data.title}</Heading>
<Text aac={data.descriptionAac}>{data.description}</Text>
```

---

## Build Performance

`aacInline()` caches all word lookups per build in a `Map`. Repeated words (across all pages) only fetch once. The two-tier lookup:
1. Our alt_symbols API (curated, fast)
2. OpenSymbols API fallback (broader coverage, rate-limited at 100ms/call)

Cloudflare then caches the built pages, so end users never see API calls.
