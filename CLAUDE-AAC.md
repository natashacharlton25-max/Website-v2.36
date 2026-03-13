# AAC Symbol System Architecture

## Overview

The platform supports multiple AAC (Augmentative and Alternative Communication) symbol sets via BCI reference numbers — the universal concept key defined by the W3C AAC Symbol Registry. Users choose their preferred symbol pictures in the Your View panel.

## Symbol Sets

| Set | Resolution | License | Status |
|---|---|---|---|
| **OpenAAC** (default) | `aac_url` from `alt_symbols` table (ARASAAC hosted) | CC BY-SA 4.0 | Live |
| **Bliss** | `https://www.blissymbolics.net/refnumber/{bci_index}` → 156px transparent PNG | CC BY-SA 3.0 | Live |
| **Custom** | User provides JSON file `{ "bci_index": "image_url" }` via Your View panel | User's own license | Live |
| **Widgit/PCS/Makaton** | Commercial — user provides own mapping via custom URL | User's commercial license | Via custom |

### Bliss URL Pattern

```
https://www.blissymbolics.net/refnumber/{bci_index}
  → 302 redirect →
https://www.blissymbolics.net/blissymbols/bliss_h156_transp_png/{bci}!{glosses}.png
```

Example: BCI 12383 → `12383!cat~feline_(animal)~felid.png`

Zero infrastructure needed — BCI hosts permanently.

## Database Schema

### `alt_symbols` table
| Column | Type | Description |
|---|---|---|
| `id` | TEXT PK | `sym_` prefixed ID |
| `word` | TEXT | English concept word |
| `icon_id` | TEXT | FK to Phosphor icon asset |
| `aac_id` | INTEGER | ARASAAC internal pictogram ID |
| `aac_url` | TEXT | Full ARASAAC pictogram URL |
| `bci_index` | INTEGER | **BCI reference number** (W3C AAC Symbol Registry) |
| `verified` | INTEGER | 1 = exact match, 0 = fuzzy/AI matched |
| `core_tier` | TEXT | Cognitive vocabulary level (green/yellow/orange/fringe) |

### `bci_concepts` table (migration 015)
| Column | Type | Description |
|---|---|---|
| `bci_index` | INTEGER PK | BCI reference number |
| `english` | TEXT | English gloss(es), comma-separated |
| `pos` | TEXT | Part of speech (WHITE=noun, YELLOW=adj, etc.) |
| `derivation` | TEXT | Concept derivation/explanation |
| + 17 language columns | TEXT | swedish, norwegian, finnish, hungarian, german, dutch, afrikaans, russian, icelandic, lithuanian, latvian, polish, french, spanish, portuguese, italian, danish |

**6419 concepts** loaded from official BCI-AV 2025-02-15 CSV.

### Coverage
- 601 / 1798 `alt_symbols` have `bci_index` (566 exact, 35 fuzzy)
- Unmatched are Phosphor icon slugs (not vocabulary concepts)
- All curated AAC vocabulary has BCI indices

## Data Pipeline

```
D1 (alt_symbols + bci_concepts)
  ↓
snapshot-alt-text.js  →  src/data/alt-symbols.json (includes bci_index)
                      →  src/data/alt-text.json (includes symbolId)
  ↓
aacResolver.ts  →  tokenise phrase → match words → resolve symbols → tier gate
  ↓
AacCardData[]  →  { word, symbolSrc, symbolId (BCI), coreTier }
  ↓
Image.astro  →  altAacCards prop  →  AacCard molecule components
                                     (each has data-bci attribute for custom symbol swap)
```

## Your View Panel Integration

### Settings (a11y-panel.ts → A11ySettings)
- `symbolSet`: `'openaac' | 'widgit' | 'pcs' | 'bliss' | 'makaton' | 'custom'`
- `customSymbolsUrl`: URL to user's BCI→image JSON mapping file

### Runtime Behaviour
1. `data-symbol-set` attribute set on `<html>` and `#a11y-content-wrapper`
2. When `symbolSet === 'custom'` and URL provided → fetch JSON, cache by URL
3. Find all `.aac-card[data-bci]` elements on page
4. Swap `.aac-card__pictogram` src to user's image URL for matching BCI indices
5. Non-matched cards keep default (OpenAAC) images

### Custom Symbol File Format
```json
{
  "12383": "https://example.com/my-symbols/cat.png",
  "14676": "https://example.com/my-symbols/happy.png",
  "12380": "https://example.com/my-symbols/dog.png"
}
```
Keys = BCI reference numbers (as strings). Values = image URLs hosted anywhere.

## Multilingual Support

The `bci_concepts` table provides gloss text in 18 languages. The AacCard word label can display in the user's language preference by joining against `bci_concepts` at build time:

```sql
SELECT c.french FROM bci_concepts c WHERE c.bci_index = 12383
-- → "chat, félin, félidé"
```

No separate translation system needed — BCI provides the translations.

## WAI-Adapt Integration

Each AacCard renders with a `data-bci` attribute containing the BCI reference number. This enables:

1. **Personalisation agents** (WAI-Adapt `symbol` attribute spec) can read `data-bci` and substitute symbols from the user's configured set
2. **Cross-platform consistency** — same BCI index resolves to the same concept regardless of which symbol pictures are displayed
3. **Future W3C standard compliance** — when browsers implement WAI-Adapt natively, cards already carry the right metadata

## Licensing & Attribution

Both bundled symbol sets are CC BY-SA (free commercial use, attribution required):

> Bliss symbols © Blissymbolics Communication International (BCI), licensed under CC BY-SA 3.0.
> OpenAAC Mulberry Symbols licensed under CC BY-SA 4.0.

The `licenses` table in D1 includes `cc-by-sa-3` for BCI.

## Migrations

| # | File | What it does |
|---|---|---|
| 004 | `004_asset_alt.sql` | Creates `alt_symbols` table, adds `alt_symbol_id` + `alt_descriptive` to `assets` |
| 006 | `006_common_aac_words.sql` | Seeds 20 common function words |
| 012 | `012_context_overrides.sql` | Context override rules for symbol disambiguation |
| 013 | `013_alt_text_log.sql` | Audit trail for alt text changes |
| **014** | `014_bci_index.sql` | **Adds `bci_index` column + index to `alt_symbols`** |
| **015** | `015_bci_concepts.sql` | **Creates `bci_concepts` table (6419 concepts, 18 languages)** |

## Scripts

| Script | Purpose |
|---|---|
| `snapshot-alt-text.js` | Pre-build D1 → JSON snapshot (now includes bci_index) |
| `backfill-bci-index.js` | Match alt_symbols words to BCI registry (exact + fuzzy) |
| `import-bci-concepts.js` | Load BCI CSV into bci_concepts table |
| `bci-registry.json` | W3C AAC Symbol Registry data (6064 entries) |
| `seed-alt-symbols.ts` | Seed alt_symbols from Phosphor icon base names |

## Source Files

| File | Description |
|---|---|
| BCI-AV 2025-02-15 CSV | Imported to D1 `bci_concepts` table, CSV removed from repo. Source: [blissymbolics.org/symbol-files-2025](https://blissymbolics.org/index.php/symbol-files-2025) |
| `src/styles/global/aac-mode.css` | Global AAC semantic role + cognitive level CSS |
| `src/lib/aac/aacResolver.ts` | Word→symbol resolution pipeline + `lemmatise()` export |
| `src/lib/aac/blissGrammar.ts` | Bliss grammar indicator detection (`detectBlissIndicators()`) |
| `src/lib/aac/aac-cards.ts` | Legacy HTML string renderer (deprecated — use AacCard molecule) |
| `src/components/molecules/aac/AacCard/` | AacCard molecule (Image + Text atoms, indicator support) |
| `src/components/YourView/a11y-panel.ts` | Your View panel (symbolSet + customSymbolsUrl settings) |
| `src/components/atoms/Image/Image.astro` | Image atom (altAacCards prop) |
