# AAC Classification Tool — Migration & Integration Plan

## Current State (Website v2.36)

Everything lives in the website repo under `asset-library/scripts/` and `src/data/`. This is wrong — the classification system should be its own project that the website consumes as a dependency.

### What we have that needs to migrate:

| Asset | Current Location | Records | Migrate to |
|---|---|---|---|
| BCI registry | `asset-library/scripts/bci-registry.json` | 6,064 | D1 `bci_concepts` table |
| Concept definitions | `bci-concept-definitions.json` (root) | 95 | D1 `concept_definitions` table |
| Full cross-ref index | `asset-library/scripts/bci-full-index.json` | 6,064 | D1 (joined query across tables) |
| Set bias rules | `asset-library/scripts/bci-set-bias-rules.json` | 11 sets | D1 `set_bias_rules` table |
| Symbol matches | `asset-library/scripts/bci-symbol-matches.json` | 95 | D1 `symbol_matches` table |
| Homophones | `asset-library/homophones.csv` | 590+ | D1 `homophones` table |
| British eDom homonyms | `asset-library/scripts/british-edom-homonyms.json` | 100 | D1 `homonyms` table |
| Mulberry symbols | `asset-library/scripts/mulberry-symbols.csv` | 3,436 | D1 `external_symbols` table |
| Classification samples | `asset-library/scripts/bci-classification-samples.json` | 80 | `tests/regression-95.json` |
| CLIP results | `asset-library/scripts/clip-verification-results.json` | 92 | D1 `symbol_matches.clip_score` |
| Groq captions | `asset-library/scripts/groq-caption-results.json` | 94 | D1 `symbol_matches.ai_description` |
| Test results CSV | `asset-library/scripts/bci-test-results.csv` | 95 | Generated from D1 export |
| Core word lists | `src/data/core-word-lists.json` | 748 | D1 `core_words` table |
| Core suggestions | `src/data/core-word-suggestions.json` | 327 | D1 `core_words.examples` |
| AAC common words | `src/data/aac-common-words.json` | 785 | D1 `core_words.effort_score` |
| AAC base words | `src/data/aac-base-words.json` | 11,682 | D1 `vocabulary` table |
| AAC fringe words | `src/data/aac-fringe-words.json` | 1,400+ | D1 `vocabulary` + categories |
| AAC synonyms | `src/data/aac-synonyms.json` | 67 | D1 `synonyms` table |
| AAC test sentences | `src/data/aac-test-sentences.json` | 30 | `tests/sentences.json` |
| Cboard taxonomy | `src/data/cboard-taxonomy.json` | 87 cats | D1 `categories` table |
| Mulberry symbols (src) | `src/data/mulberry-symbols.json` | 3,436 | D1 `external_symbols` table |

### Scripts that migrate:

| Script | Current | Becomes |
|---|---|---|
| `fetch-opensymbols.js` | Local Node script | Worker route `/api/search-symbols` |
| `clip-verify.js` | Local Node + HF transformers | Worker route `/api/classify` (or keep local) |
| `groq-caption.js` | Local Node + Groq API | Worker route `/api/describe-image` |
| `import-bci-concepts.js` | Local Node → website D1 | Import script → new D1 |
| `snapshot-alt-text.js` | Build-time snapshot | `/api/export` endpoint |

### Scripts that stay in website:
| Script | Why |
|---|---|
| `bliss-generate-svgs.js` | Bliss SVG generation is website-specific |
| `bliss-upload-r2.js` | Uploads to website's R2 |
| `seed-phosphor.ts` | Phosphor icons are website-only |
| `seed-lottie.ts` | Lottie animations are website-only |
| `upload-image.ts` | Website R2 utility |

---

## New Project: `aac-classification-tool`

### Phase 1: Scaffold & Import (Day 1)

```bash
# New Cloudflare project
mkdir aac-classification-tool
cd aac-classification-tool
wrangler init --type javascript
wrangler d1 create aac-symbols
wrangler r2:bucket create aac-images
```

1. Create D1 schema (from `aac-classification-tool-spec.md`)
2. Write import scripts:
   - `import-bci-concepts.js` — load 6,064 from `bci-registry.json`
   - `import-definitions.js` — load 95 from `bci-concept-definitions.json`
   - `import-homophones.js` — load 590+ from `homophones.csv`
   - `import-homonyms.js` — load 100 from `british-edom-homonyms.json`
   - `import-bias-rules.js` — load 11 sets from `bci-set-bias-rules.json`
   - `import-mulberry.js` — load 3,436 from `mulberry-symbols.csv`
   - `import-cboard.js` — load 87 categories from `cboard-taxonomy.json`
   - `import-core-words.js` — load core lists, effort scores, suggestions
   - `import-symbol-matches.js` — load 95 verified matches + CLIP + Groq data
3. Run all imports against local D1
4. Verify counts match

### Phase 2: Worker Routes (Day 2-3)

Port the three pipeline scripts to Worker routes:

**`/api/search-symbols`** (from `fetch-opensymbols.js`):
- Input: `{ bci_index }` or `{ word }`
- Reads concept definition + bias rules from D1
- Searches OpenSymbols API with cascade
- Scores results against bias rules + POS trust matrix
- Returns best match per set
- Writes to `symbol_matches` table

**`/api/describe-image`** (from `groq-caption.js`):
- Input: `{ image_url }` or `{ bci_index, symbol_set }`
- Downloads image, converts to base64
- Calls Groq Llama 4 Scout (or Workers AI if Llama Vision available)
- Returns caption + structured objects/actions
- Writes to `symbol_matches.ai_description`

**`/api/classify`** (from `clip-verify.js`):
- Input: `{ bci_index, image_url }`
- Reads `is` + `isNot` from concept definition
- Runs CLIP zero-shot classification
- Returns PASS/WARN/FAIL verdict + scores
- Writes to `symbol_matches.clip_score`

**`/api/generate-definitions`** (NEW — from LLM roadmap):
- Input: `{ count, strategy }` or `{ bci_indexes }`
- Pulls concepts without definitions from D1
- Looks up homophones, homonyms, cross-language data
- Calls Workers AI Llama 3.2 with structured prompt
- Parses JSON, writes to `concept_definitions`
- Hashes input + output for provenance

**`/api/safeguard`** (NEW):
- Input: `{ bci_index, description }`
- Checks against content blocklist
- Rates age-appropriateness (green/amber/red)
- Writes to `symbol_matches.safeguard_rating`

**`/api/export`** (NEW):
- Output: versioned JSON files for website consumption
- `GET /api/export/definitions` → `concept-definitions.json`
- `GET /api/export/symbols` → `symbol-matches.json`
- `GET /api/export/full` → combined file
- Each export versioned + hashed + logged

**`/api/sheets-sync`** (NEW):
- Two-way sync with Google Sheets for human review
- Push: D1 → Sheet (definitions for review)
- Pull: Sheet → D1 (reviewed definitions back)

### Phase 3: Scale to 6,064 (Day 4-7)

1. Generate definitions for remaining 5,969 concepts via `/api/generate-definitions`
   - Rate: ~3,000/day on Workers AI free tier
   - Full run: 2 days
2. Run symbol search for all 6,064 via `/api/search-symbols`
   - Rate-limited by OpenSymbols API (be polite, 1 req/sec)
   - Full run: ~2 hours
3. Download verified images to R2 via `/api/describe-image`
   - Only images that score ≥80 on text + pass CLIP
   - Rate-limited by Groq free tier
   - Full run: ~3 days (1,000/day)
4. Run safeguarding on all downloaded images
5. Export versioned JSON

### Phase 4: Website Integration (Day 8)

1. Website build fetches from classification tool's `/api/export` endpoint
2. Replace `src/data/alt-symbols.json` with exported `symbol-matches.json`
3. Replace `bci-concept-definitions.json` with exported `concept-definitions.json`
4. `aacResolver.ts` updated to use new data structure
5. Remove migrated scripts/data from website repo (keep in `_reference/`)

---

## Integration Contract

### What the website imports from the classification tool:

```json
// GET https://aac-classification-tool.{account}.workers.dev/api/export/full

{
  "version": "1.0.0",
  "generated": "2026-03-16T...",
  "concepts": {
    "12383": {
      "word": "cat",
      "bci_pos": "YELLOW",
      "classification": "NOUN",
      "is": "domestic feline pet...",
      "isNot": "caterpillar dog...",
      "core_tier": null,
      "effort_score": null,
      "symbols": {
        "best": {
          "set": "arasaac",
          "image_url": "https://aac-images.{r2}/arasaac/cat.png",
          "score": 100,
          "ai_description": "A grey cartoon cat lying down",
          "safeguard": "green"
        },
        "bliss": "https://www.blissymbolics.net/refnumber/12383",
        "per_set": {
          "arasaac": { "image_url": "...", "score": 100 },
          "mulberry": { "image_url": "...", "score": 95 },
          "noun_project": { "image_url": "...", "score": 90 }
        }
      }
    }
  }
}
```

### What the website keeps:

- `aacResolver.ts` — tokenisation, lemmatisation, symbol resolution
- `AacCard` molecule — rendering
- `a11y-panel.ts` — Your View panel (symbol set selection)
- `aac-mode.css` — display modes
- Build-time snapshot logic (now fetches from classification tool instead of D1)

---

## BCI-Fluent LLM Integration (from roadmap)

The classification tool IS Stage 1 of the LLM roadmap:

| LLM Stage | Classification Tool Component |
|---|---|
| Stage 1: RAG | Vectorize index built from `concept_definitions` + `bci_concepts` + `set_bias_rules` |
| Stage 1: Query endpoint | `/api/bci-reason` — searches Vectorize, builds context, calls Workers AI |
| Stage 2: Training data | Every definition generated = training pair. Every search + caption = training pair. Every human review = training pair. |
| Stage 2: LoRA fine-tune | Export training data from `audit_log`, fine-tune on Cloudflare or HF |
| Stage 3: Reasoning engine | Full pipeline: LoRA model + Vectorize + definitions + bias rules + image generation + safeguarding |

### Vectorize Collections (add to Phase 2):

```javascript
// In wrangler.toml:
[[vectorize]]
binding = "VECTORIZE"
index_name = "bci-concepts"

// Build index from D1 data:
// - Embed: word + all_glosses + is_field + visual
// - Metadata: bci_index, bci_pos, core_tier, classification
// - 6,064 vectors
```

### `/api/bci-reason` endpoint:

```
POST /api/bci-reason
Body: { query: "What's the BCI for dishwasher?" }

1. Embed query → search Vectorize for top 10 relevant concepts
2. Pull full definitions + derivations for those 10
3. Pull relevant bias rules + composition rules
4. Build context for Workers AI
5. Call Llama 3.2 with system prompt + context + query
6. Return structured response: { answer, concepts_used, confidence, composition_proposal }
7. Log to audit_log for future training data
```

---

## Environment & Accounts

### New Cloudflare Account (separate from website):
- D1: `aac-symbols` database
- R2: `aac-images` bucket
- Workers AI: free tier (10K neurons/day)
- Vectorize: free tier (5M vectors)
- Workers: free tier (100K requests/day)

### API Keys needed in wrangler.toml secrets:
- `GROQ_API_KEY` — for image captioning (free)
- `OPENSYMBOLS_TOKEN` — for symbol search
- `GOOGLE_SERVICE_ACCOUNT` — for Sheets sync (JSON)
- `WEBHOOK_SECRET` — shared secret for website triggers

### Website .env additions:
- `AAC_CLASSIFICATION_URL` — URL of the classification tool worker
- `AAC_CLASSIFICATION_TOKEN` — auth token for export endpoint

---

## Data Flow Summary

```
                    ┌─────────────────────────────┐
                    │  aac-classification-tool     │
                    │  (own Cloudflare account)    │
                    │                              │
 OpenSymbols API ──→│  D1: concepts, definitions,  │
 Groq API ─────────→│      matches, safeguarding   │
 Workers AI ───────→│  R2: verified symbol images  │
 Google Sheets ←───→│  Vectorize: concept index    │
                    │                              │
                    │  /api/export/full ──────────→│──→ Website build
                    │  /api/bci-reason ───────────→│──→ Public API
                    └─────────────────────────────┘
                              │
                              ↓
                    ┌─────────────────────────────┐
                    │  Website v2.36               │
                    │  (existing Cloudflare acct)  │
                    │                              │
                    │  Build fetches /api/export   │
                    │  → src/data/ JSON files      │
                    │  → aacResolver.ts consumes   │
                    │  → AacCard renders           │
                    │                              │
                    │  R2: website images only     │
                    │  D1: assets, alt_symbols     │
                    │      (links to exported BCI) │
                    └─────────────────────────────┘
```

---

## Timeline

| Day | Task |
|---|---|
| 1 | Scaffold project, D1 schema, import scripts, seed all data |
| 2 | Port `fetch-opensymbols.js` → `/api/search-symbols` |
| 3 | Port `groq-caption.js` → `/api/describe-image`, add `/api/safeguard` |
| 4 | Build `/api/generate-definitions` with Workers AI |
| 5 | Generate definitions for all 6,064 (batch over 2 days) |
| 6 | Run symbol search for all 6,064 |
| 7 | Download + verify + caption all matched images |
| 8 | Build `/api/export`, wire into website build |
| 9 | Add Vectorize index + `/api/bci-reason` (Stage 1 RAG) |
| 10 | Google Sheets sync for human review workflow |

---

## What stays in the website repo after migration:

```
asset-library/scripts/
  ├── bliss-generate-svgs.js      (website-specific)
  ├── bliss-upload-r2.js          (website-specific)
  ├── snapshot-alt-text.js        (updated to fetch from classification tool)
  ├── import-bci-concepts.js      (kept as backup, D1 still has bci_concepts)
  ├── seed-phosphor.ts            (unrelated to BCI)
  ├── seed-lottie.ts              (unrelated to BCI)
  ├── upload-image.ts             (website R2 utility)
  ├── check-unresolved-words.ts   (diagnostic)
  └── _*.js / _*.ts               (retired scripts, reference only)

src/data/
  ├── alt-symbols.json            (rebuilt from classification tool export)
  ├── alt-text.json               (rebuilt from classification tool export)
  └── (all other JSON files moved to classification tool)

src/lib/aac/
  ├── aacResolver.ts              (stays — consumes exported data)
  ├── blissGrammar.ts             (stays)
  └── aac-cards.ts                (deprecated)
```

Everything else (bci-registry, concept definitions, bias rules, homophones, mulberry data, cboard taxonomy, eDom homonyms, core word lists, AAC metrics data) moves to the classification tool.
