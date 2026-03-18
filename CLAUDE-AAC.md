# AAC Symbol System Architecture

## Overview

The platform supports multiple AAC (Augmentative and Alternative Communication) symbol sets via BCI reference numbers — the universal concept key defined by the W3C AAC Symbol Registry. Users choose their preferred symbol pictures in the Your View panel.

**Status as of 2026-03-16**: Old naive backfill data NUKED. New pipeline built with 95 verified test concepts, 6,064 cross-referenced in full index, 10 symbol sets scored with bias rules, AI visual verification via CLIP + Groq. Ready to scale to full 6,064.

---

## Symbol Sets (10 scored via OpenSymbols)

| Set | Symbols | Coverage | License | Trust (nouns) | Trust (verbs) |
|---|---|---|---|---|---|
| **Bliss** | 6,490 | 100% | CC BY-SA 3.0 | absolute | absolute |
| **ARASAAC** | 12,909 | 87% | CC BY-NC-SA 4.0 | high | check (prefix verbs with "to") |
| **Noun Project** | 17,165 | 61% | mixed | trust | reject |
| **Sclera** | 11,443 | 71% | CC BY-NC 2.0 | check (scene bias) | reject |
| **Twemoji** | 2,770 | 5% | CC BY 4.0 | trust | reject |
| **Mulberry** | 3,116 | 65% | CC BY-SA 4.0 | check | reject (random nouns) |
| **Tawasol** | 950 | 37% | CC BY-SA 4.0 | trust | check |
| **IcoMoon** | 907 | 2% | mixed | check | reject |
| **IconArchive** | 600 | 1% | mixed | check | reject |
| **LanguageCraft** | 205 | 0.4% | CC BY-NC-SA | check | check |
| **CoughDrop** | 21 | 0.04% | CC BY 4.0 | check | check |
| **Custom** | user | - | user's own | - | - |

Per-set bias rules: `asset-library/scripts/bci-set-bias-rules.json`

### Known Set Biases

**ARASAAC**: Verbs named with "to" prefix ("to walk", "to want"). Substring matching returns wrong homonyms (eye→eye shadow, file→fillets). Language bleed (barn→kids from Swedish). Deterministic garbage fallback ("bald 1" for unknown terms). Content risk (devices→IUD).

**Mulberry**: Returns completely unrelated nouns for abstract verbs (help→skull, can→Mercury, not→sheep). Country flags leak via "country The..." pattern. Verb suffix pattern: "word , to".

**Sclera**: Shows complex multi-step scenes instead of single concepts (walk→"go-kart crash person", the→"put the dishes in the cupboard"). Wrong homonyms (can→wheelchair symbol).

**Noun Project**: Good for concrete nouns, useless for verbs and function words. Icon style, no action depictions.

**OpenSymbols API**: v1 only (`/api/v1/symbols/search?q=`). v2 is admin-only. Token in `.env` as `OPENSYMBOLS_TOKEN`. CDN: `d18vdu4p71yql0.cloudfront.net`. Bucket: S3 `opensymbols`, images at `/libraries/{repo_key}/{filename}`.

---

## BCI Full Index (`bci-full-index.json`)

6,064 BCI concepts cross-referenced against 5 data sources:

| Source | Matched | Coverage |
|---|---|---|
| Mulberry categories | 1,422 | 23% |
| OpenAAC words/POS/inflections | 2,362 | 39% |
| Both Mulberry + OpenAAC | 890 | 15% |
| Neither | 3,170 | 52% |
| Homonym flagged (British eDom) | 106 | |
| Homophone flagged | 633 | |
| Double danger (both) | 22 | |
| Effort scores (core words) | 1,096 | |

Each entry has: `bci_index`, `raw_gloss`, `primary_word`, `all_words`, optional `mulberry` (id, symbol, category, grammar, tags), `openaac` (types, antonyms, base), `homonym` (dominance, balanced, meanings), `homophones`, `effort_score`, `core_rank`.

---

## Concept Definitions (`bci-concept-definitions.json`)

95 test concepts with full classification schema:

```json
{
  "12383": {
    "word": "cat",
    "type": "CONCEPT",
    "bci_pos": "YELLOW",
    "bci_gloss": "cat,feline_(animal),felid",
    "classification": "NOUN",
    "subclass": "animal",
    "concreteness": "CONCRETE",
    "semantic_field": "nature",
    "is": "domestic feline pet small furry four-legged animal",
    "isNot": "dog puppy kitten tiger lion caterpillar catalog catamaran",
    "visual": "small four-legged furry animal whiskers pointed ears tail",
    "polysemy_flag": false,
    "homophone_flag": false,
    "clip_viable": true,
    "generation_strategy": "PICTOGRAM",
    "search_hints": ["cat", "kitten", "feline"],
    "mulberry_id": 371,
    "mulberry_category": "Animal Mammal"
  }
}
```

### Schema Fields
- `is` — CLIP text anchor + search seed (what this concept means)
- `isNot` — CLIP rejection filter + negative prompt (wrong meanings, homophones)
- `visual` — what a correct image shows
- `search_hints` — explicit OpenSymbols search terms (overrides word)
- `generation_strategy` — PICTOGRAM | SCENE | SYMBOL | COMPOSITE | ICON | SKIP
- `dominance_score` — British eDom homonym dominance (0=balanced/ambiguous, 1=dominant)
- `common_misspellings` — resolver catch list
- `us_word` / `uk_word` — regional variants
- `mulberry_*` — category data from Mulberry Symbols repo

### Stop Words
Function words like `the`, `a`, `an` have `generation_strategy: "SKIP"` — no pictogram search, text-only AAC card or Bliss indicator. The resolver strips these from search queries so "the same" searches "same".

---

## Data Sources (all in `src/data/`)

| File | Source | Records | Purpose |
|---|---|---|---|
| `alt-symbols.json` | D1 snapshot | ~1800 | Current alt_symbols (needs rebuild) |
| `alt-text.json` | D1 snapshot | ~800 | Current alt text data |
| `aac-common-words.json` | AAC Metrics (CoughDrop) | 785 words | Effort scores + core ranking |
| `aac-base-words.json` | AAC Metrics | 11,682 words | Extended vocabulary |
| `aac-fringe-words.json` | AAC Metrics | 1,400+ words | 57 semantic categories (Animals, Body, Foods, Feelings, etc.) |
| `aac-synonyms.json` | AAC Metrics | 67 groups | Synonym resolution (hi=hello, leaf=leaves) |
| `aac-test-sentences.json` | AAC Metrics | 30 sentences | Validation suite |
| `core-word-lists.json` | CoughDrop/OpenAAC | 748 unique | 4 research-backed core word lists |
| `core-word-suggestions.json` | CoughDrop | 327 words | Example sentences for context |
| `british-edom-homonyms.json` | Research norms | 100 words | Dominance scores, meanings, imageability |
| `mulberry-symbols.json` | Mulberry Symbols repo | 3,436 | Categories, tags, grammar |
| `cboard-taxonomy.json` | Cboard AAC app | 87 categories, 706 words | Real-world AAC board layout |

### Asset Library Scripts (`asset-library/scripts/`)

**Active:**
| Script | Purpose |
|---|---|
| `fetch-opensymbols.js` | Search OpenSymbols API, score results, select best match per concept |
| `clip-verify.js` | CLIP zero-shot image classification against is/isNot labels |
| `groq-caption.js` | Groq Llama 4 Scout vision captioning for visual verification |
| `import-bci-concepts.js` | Load BCI CSV into D1 `bci_concepts` table |
| `snapshot-alt-text.js` | Pre-build D1 → JSON snapshot |
| `bliss-generate-svgs.js` | Generate Bliss SVGs from blissary map |
| `bliss-upload-r2.js` | Upload Bliss SVGs to R2 |
| `seed-phosphor.ts` | Phosphor icon import (unrelated to BCI) |
| `seed-lottie.ts` | Lottie animation import (unrelated to BCI) |
| `upload-image.ts` | R2 upload utility |
| `check-unresolved-words.ts` | Diagnostic — find words resolver can't handle |

**Data files in scripts/:**
| File | Records | Purpose |
|---|---|---|
| `bci-registry.json` | 6,064 | W3C AAC Symbol Registry (source of truth) |
| `bci-full-index.json` | 6,064 | Master cross-reference index |
| `bci-classification-samples.json` | 80 | Training/validation samples across quality bands |
| `bci-set-bias-rules.json` | 11 sets | Per-set scoring rules, POS trust matrix |
| `bci-symbol-matches.json` | 95 | OpenSymbols best matches with per-set data |
| `bci-test-results.csv` | 95 | Full CSV with all columns for spreadsheet review |
| `clip-verification-results.json` | 92 | CLIP pass/warn/fail verdicts |
| `clip-verification-results.csv` | 92 | CSV with image URLs for manual review |
| `groq-caption-results.json` | 94 | Groq vision captions |
| `groq-caption-results.csv` | 94 | CSV with captions + verdicts |
| `british-edom-homonyms.json` | 100 | Research homonym norms |
| `mulberry-symbols.csv` | 3,436 | Mulberry categorised symbols |
| `mulberry-bliss-map.csv` | 20 | Mulberry↔Bliss proof-of-concept |
| `blissary-bci-map.json` | ~6K | Bliss SVG builder data |
| `bci-symbol-map.csv` | 6,490 | Old 6-set cross-reference (pre-cleanup) |

**Retired (underscore-prefixed, 19 files):** Old broken/tainted scripts from naive backfill era.

---

## Verification Pipeline

### Three layers:

1. **Text scoring** (`fetch-opensymbols.js`): Match result name against BCI glosses, check isNot blocklist, apply POS trust matrix. Score 0-100+.

2. **CLIP visual classification** (`clip-verify.js`): Zero-shot image classification using `@huggingface/transformers` (Xenova/clip-vit-base-patch32, runs locally). Generates labels from `is` + `isNot` fields, classifies image, flags if negative labels score higher than positive. Verdicts: PASS/WARN/FAIL.

3. **Groq vision captioning** (`groq-caption.js`): Free Llama 4 Scout via Groq API (`GROQ_API_KEY` in `.env`). Describes what the image actually shows in 5-10 words. Cross-checks caption against concept. Catches: baby→pigs, coin→corner, walk→"baby being held up", want→mitten.

### Current Results (95 test concepts):
- Text scoring: 90 strong (≥80), 3 partial, 1 poor, 1 skip
- CLIP: 50 PASS, 21 WARN, 21 FAIL
- Groq: 67 PASS, 15 UNCLEAR, 12 FAIL, 1 SKIP

### Key Discoveries:
- ARASAAC API returns different images for "walk" vs "to walk" — the "to" prefix gets the verb pictogram
- `varianted-skin.png` URLs are valid (serve default skin tone) — can also use `variant-{light|medium|dark}.png`
- Groq captions double as excellent alt text descriptions
- CLIP can't detect content safety on stylised pictograms — text-level blocklist is more reliable
- OpenSymbols v1 search returns good results — the old pipeline was using SymboTalk API instead (that's why everything was wrong)

---

## Homonym / Homophone Handling

### British eDom Dominance Scores
100 researched homonyms with frequency ratings. Key dangerous ones:

| Word | B score | Meaning 1 | Meaning 2 | Homophone |
|---|---|---|---|---|
| **peer** | 0.37 | equal/colleague | to look closely | pier |
| **knock** | 0.34 | to strike | impact sound | nock |
| **jam** | 0.39 | pack tight | fruit preserve | jamb |
| **tense** | 0.48 | tight/stressed | grammar tense | tents |
| **fan** | 0.21 | hand-held device | enthusiastic follower | - |

B < 0.40 = highly ambiguous — needs context disambiguation.

### US/UK Variants in BCI
23 concepts with regional variants tracked. BCI glosses often include both:
- `airplane,aeroplane,plane` (BCI 12357)
- `elevator,lift` (BCI 13924)
- `diaper,nappy` (BCI 13670)
- `cookie,biscuit` (BCI 13409)

### 238 BCI Homonyms
Same primary gloss, different BCI concept:
- `bar`: 12627 (pub) vs 22371 (cake)
- `boot`: 12876 (footwear) vs 24613 (car trunk)
- `bell`: 12662 (bell) vs 24802 (chime bar)

Resolution rules in `bci-set-bias-rules.json` → `homonym_resolution`.

---

## Core Word Priority

4 research-backed core word lists (from CoughDrop/OpenAAC):
- **Project Core** (36 words): like, want, get, make, good, more, not, go, look, turn, help, different, i, he, open, do, put, same, you, she, that, up, all, some, it, here, in, on, can, finished, where, what, why, who, when, stop
- **Combined Core** (646 words): Anderson & Bitner 2013
- **UNC Common Core** (463 words)
- **Basic Core** (81 words): survey results

All 36 Project Core essentials have BCI matches. 78% of full 748 core words match.

Effort scores (lower = more important): the=2.03, on=2.09, you=2.29, help=2.83.

---

## Content Safety

### Global content blocklist (in `bci-set-bias-rules.json`):
Phrases: `make love`, `intrauterine`, `contraceptive`, `suppository`, `enema`, `catheter`, `genital`, `erotic`, `intercourse`, `sex position`

### ARASAAC-specific blocklist:
Fallback images: `bald 1`, `simple` (deterministic garbage for unknown terms)

### `unsafe_result` flag:
OpenSymbols schema includes this field — they already mark inappropriate images.

---

## Database Schema

### `alt_symbols` table
| Column | Type | Description |
|---|---|---|
| `id` | TEXT PK | `sym_` prefixed ID |
| `word` | TEXT | English concept word |
| `icon_id` | TEXT | FK to Phosphor icon asset |
| `aac_id` | INTEGER | ARASAAC internal pictogram ID |
| `aac_url` | TEXT | Full ARASAAC pictogram URL |
| `bci_index` | INTEGER | BCI reference number (W3C) |
| `verified` | INTEGER | 1 = exact match, 0 = fuzzy/AI matched |
| `core_tier` | TEXT | Cognitive vocabulary level (green/yellow/orange/fringe) |

### `bci_concepts` table (migration 015)
| Column | Type | Description |
|---|---|---|
| `bci_index` | INTEGER PK | BCI reference number |
| `english` | TEXT | English gloss(es), comma-separated |
| `pos` | TEXT | Part of speech |
| + 17 language columns | TEXT | Multilingual glosses |

6,064 concepts loaded from official BCI-AV 2025-02-15 CSV.

---

## Data Pipeline

```
BCI Registry (6,064 concepts)
  ↓
bci-concept-definitions.json (95 classified — scaling to 6,064)
  ↓
fetch-opensymbols.js → search → score → select best match
  ↓
clip-verify.js → CLIP zero-shot visual verification
  ↓
groq-caption.js → Groq Llama 4 Scout caption verification + alt text
  ↓
Download verified images → upload-image.ts → R2 bucket
  ↓
D1 (alt_symbols rebuilt with verified BCI links)
  ↓
snapshot-alt-text.js → src/data/alt-symbols.json
  ↓
aacResolver.ts → tokenise phrase → lemmatise → match → resolve symbols → tier gate
  ↓
AacCard molecule → Image.astro altAacCards prop
```

---

## Next Steps

1. **Fix 12 FAIL images** — manually select better OpenSymbols results for put, walk, can, see, close, we, etc.
2. **Scale to 6,064** — run fetch + verify pipeline on all BCI concepts (not just 95 test set)
3. **Download verified → R2** — mirror good images to our R2 bucket, link in D1
4. **Rebuild D1 links** — nuke old garbage alt_symbols BCI data, replace with verified mappings
5. **Wire data sources into resolver** — effort scores, synonyms, homonym dominance, Mulberry categories
6. **Groq captions as alt text** — pipe verified captions into `alt_descriptive` field

---

## External Repos Investigated

| Repo | What it gave us |
|---|---|
| `mulberrysymbols/mulberry-symbols` | 3,436 categorised SVGs with tags + Bliss mapping proof-of-concept |
| `open-aac/opensymbols` | API source code — confirmed v1 only, v2 admin-only, S3 bucket structure |
| `RonanOD/OpenAAC` | Vector embeddings approach — validated our BCI-anchored approach is better |
| `open-aac/sweet-suite-aac` | Core word lists (4 lists), 327 example sentences, n-gram data |
| `open-aac/aac-metrics` | Effort scores, fringe categories, synonyms, test sentences |
| `willwade/AAC-Tools` | WordNet synonym matching, NLTK POS tagging, Grid converter |
| `cboard-org/cboard` | 87-category AAC board taxonomy from production app, 706 tiles |

---

## API Keys (all in `.env`)

| Key | Service | Free tier |
|---|---|---|
| `GROQ_API_KEY` | Groq (Llama 4 Scout vision) | Yes — free, fast |
| `GOOGLE_AI_API_KEY` | Google AI / Gemini | Yes |
| `OPENAI_API_KEY` | OpenAI | Tier 1 |
| `Huggingface_API_KEY` | HuggingFace | Free tier (no vision models available) |
| `OPENSYMBOLS_TOKEN` | OpenSymbols API | v1 search works, v2 admin-only |
| `OPENSYMBOLS_SECRET` | OpenSymbols | Admin access |

### Local AI
- `@huggingface/transformers@3.8.1` installed — CLIP runs locally (Xenova/clip-vit-base-patch32)
- Ollama installed on machine (Gemma3 1B/4B) — not needed, Groq is faster and free

---

## Source Files

| File | Description |
|---|---|
| `bci-concept-definitions.json` | 95 classified concepts (project root) |
| `src/lib/aac/aacResolver.ts` | Word→symbol resolution pipeline + lemmatise() |
| `src/lib/aac/blissGrammar.ts` | Bliss grammar indicator detection |
| `src/lib/aac/aac-cards.ts` | Legacy HTML renderer (deprecated) |
| `src/components/molecules/aac/AacCard/` | AacCard molecule |
| `src/components/YourView/a11y-panel.ts` | Your View panel |
| `src/components/atoms/Image/Image.astro` | Image atom (altAacCards prop) |
| `src/styles/global/aac-mode.css` | Global AAC semantic role + cognitive level CSS |
| `asset-library/scripts/bci-set-bias-rules.json` | Per-set scoring rules (11 sets) |
| `asset-library/scripts/bci-full-index.json` | 6,064 concepts cross-referenced |
| `asset-library/homophones.csv` | 590+ homophone groups |

## Licensing & Attribution

Both bundled symbol sets are CC BY-SA:

> Bliss symbols © Blissymbolics Communication International (BCI), licensed under CC BY-SA 3.0.
> OpenAAC Mulberry Symbols licensed under CC BY-SA 4.0.
> ARASAAC pictograms by Gobierno de Aragón, licensed under CC BY-NC-SA 4.0.

British eDom norms: Armstrong et al. (2012), academic research data.
