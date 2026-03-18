# AAC Symbol Classification Tool — Project Spec

## Overview

Standalone Cloudflare Workers project (separate account from website) that:
1. Indexes all open AAC symbol sets against BCI concepts
2. Generates structured concept definitions using Workers AI
3. Classifies, describes, and safeguards 60,000+ AAC symbols
4. Outputs versioned JSON for website consumption
5. Connects to Google Sheets for human review and editing

## Architecture

```
Separate Cloudflare Free Account
├── D1 Database: bci_concepts, definitions, symbol_matches, safeguarding
├── Workers AI: Llama 3.2 for definition generation + image description
├── R2 Bucket: downloaded symbol images (PNGs + converted SVGs)
├── Workers:
│   ├── /api/generate-definitions    — batch generate concept defs
│   ├── /api/search-symbols          — OpenSymbols API cascade search
│   ├── /api/describe-image          — Llama vision on symbol images
│   ├── /api/classify                — match description to BCI
│   ├── /api/safeguard               — age-appropriateness check
│   ├── /api/export                  — versioned JSON for website
│   ├── /api/sample                  — pull stratified random samples
│   └── /api/sheets-sync             — push/pull Google Sheets
└── Output: concept-definitions.json + symbol-matches.json
        → consumed by website Astro build
```

## Setup Steps (for Claude Code)

### 1. New Cloudflare Account
- Create new free Cloudflare account (separate from website)
- Install wrangler CLI
- Create new project: `wrangler init aac-classification-tool`
- Create D1 database: `wrangler d1 create aac-symbols`
- Create R2 bucket: `wrangler r2:bucket create aac-images`

### 2. D1 Schema

```sql
-- Core BCI concepts (import from website D1 or W3C registry)
CREATE TABLE bci_concepts (
  bci_index INTEGER PRIMARY KEY,
  word TEXT NOT NULL,
  all_glosses TEXT NOT NULL,        -- comma separated
  bci_pos TEXT NOT NULL,            -- YELLOW, RED, GREEN, BLUE, WHITE
  core_tier TEXT,                   -- green, yellow, orange, null
  derivation TEXT,
  -- 18 language columns
  lang_en TEXT, lang_sv TEXT, lang_no TEXT, lang_fi TEXT,
  lang_hu TEXT, lang_de TEXT, lang_nl TEXT, lang_af TEXT,
  lang_ru TEXT, lang_lv TEXT, lang_po TEXT, lang_fr TEXT,
  lang_es TEXT, lang_pt TEXT, lang_it TEXT, lang_dk TEXT,
  lang_is TEXT, lang_lt TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Homophones (import from 600-entry CSV)
CREATE TABLE homophones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,
  homophone TEXT NOT NULL,
  language TEXT DEFAULT 'en',       -- en for English, cross for cross-language
  source TEXT                       -- csv, cross_lang_scan, manual
);

-- Generated concept definitions
CREATE TABLE concept_definitions (
  bci_index INTEGER PRIMARY KEY,
  word TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  
  -- Classification fields
  type TEXT,                        -- CONCEPT, NUMBER, LETTER, PUNCTUATION, INDICATOR
  classification TEXT,              -- NOUN, VERB, ADJ, etc
  subclass TEXT,                    -- animal, food, transport, etc
  animacy TEXT,                     -- PERSON, ANIMAL, OBJECT, PLACE, ABSTRACT
  concreteness TEXT,                -- CONCRETE, SEMI_ABSTRACT, ABSTRACT
  semantic_field TEXT,              -- nature, food, transport, etc
  
  -- Disambiguation
  polysemy_flag INTEGER DEFAULT 0,
  polysemy_sense TEXT DEFAULT '',
  homophone_flag INTEGER DEFAULT 0,
  homophone_group TEXT DEFAULT '[]', -- JSON array of BCI indexes
  
  -- Semantic context
  related_concepts TEXT DEFAULT '[]',
  opposite_concepts TEXT DEFAULT '[]',
  parent_concept INTEGER,
  
  -- CLIP / search / generation fields
  is_field TEXT,                    -- "is" is reserved word in SQL, use is_field
  is_not TEXT,
  visual TEXT,
  contains TEXT DEFAULT '[]',       -- JSON array
  
  -- Strategy
  clip_viable INTEGER DEFAULT 1,
  generation_strategy TEXT DEFAULT 'PICTOGRAM',
  
  -- Provenance
  generated_by TEXT,                -- model name
  generated_at TEXT,
  input_hash TEXT,                  -- hash of BCI data that produced this
  output_hash TEXT,                 -- hash of the definition itself
  reviewed INTEGER DEFAULT 0,      -- 0=unreviewed, 1=human approved
  reviewed_by TEXT,
  reviewed_at TEXT,
  
  FOREIGN KEY (bci_index) REFERENCES bci_concepts(bci_index)
);

-- Symbol matches per set
CREATE TABLE symbol_matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bci_index INTEGER NOT NULL,
  symbol_set TEXT NOT NULL,         -- arasaac, mulberry, sclera, noun_project, tawasol, bliss
  
  -- Match data
  search_term TEXT,                 -- what was searched
  search_cascade_step INTEGER,      -- which step of cascade found this (1=primary, 2=gloss, 3=is_field)
  match_score INTEGER,              -- 0-100
  
  -- Image data
  image_url TEXT,
  image_filename TEXT,
  image_hash TEXT,                  -- hash of downloaded image
  r2_path TEXT,                     -- path in R2 bucket
  svg_path TEXT,                    -- path to converted SVG in R2
  svg_hash TEXT,
  
  -- Description (from Llama vision)
  ai_description TEXT,
  description_hash TEXT,
  description_model TEXT,
  
  -- Classification verification
  clip_score REAL,                  -- CLIP similarity score
  classification_match INTEGER,     -- 1=matches concept definition, 0=doesn't
  
  -- Safeguarding
  safeguard_rating TEXT,            -- green, amber, red
  safeguard_flags TEXT DEFAULT '[]', -- JSON array: medical, anatomical, adult, etc
  safeguard_model TEXT,
  safeguard_checked_at TEXT,
  
  -- Licence
  licence TEXT,
  attribution TEXT,
  
  -- Provenance
  matched_at TEXT DEFAULT (datetime('now')),
  definition_version INTEGER,       -- which version of concept_definitions was used
  
  FOREIGN KEY (bci_index) REFERENCES bci_concepts(bci_index)
);

-- Set bias rules (imported from JSON)
CREATE TABLE set_bias_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol_set TEXT NOT NULL,
  rule_id TEXT NOT NULL,
  rule_type TEXT NOT NULL,          -- reject, downgrade, skip
  description TEXT,
  detection TEXT,
  severity TEXT,                    -- critical, high, medium, low
  blocklist TEXT DEFAULT '[]',       -- JSON array
  active INTEGER DEFAULT 1
);

-- Audit log
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,             -- generate, search, describe, classify, safeguard, export
  bci_index INTEGER,
  symbol_set TEXT,
  input_hash TEXT,
  output_hash TEXT,
  model TEXT,
  neurons_used REAL,
  duration_ms INTEGER,
  status TEXT,                      -- success, error, rate_limited
  error_message TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Export versions
CREATE TABLE exports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version TEXT NOT NULL,
  export_type TEXT NOT NULL,        -- definitions, symbols, full
  file_hash TEXT,
  concepts_included INTEGER,
  symbols_included INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  notes TEXT
);
```

### 3. Workers AI Definition Generator

```javascript
// /api/generate-definitions
// 
// Pulls N concepts from bci_concepts that don't have definitions yet,
// or pulls specific BCI indexes.
// Looks up homophones for each.
// Cross-references 18 language columns for cross-language collisions.
// Feeds to Llama 3.2 3B with structured prompt.
// Parses JSON response, writes to concept_definitions table.
// Hashes input + output for provenance.
//
// Rate: ~3,000/day on free tier (10,000 neurons, ~3 neurons per definition)
// Full 6,428: 3 days free or ~£0.20 paid
//
// POST /api/generate-definitions
// Body: { count: 500, strategy: "random_stratified" | "specific", bci_indexes: [] }
```

### 4. Stratified Random Sampler

```javascript
// /api/sample
//
// Pulls N concepts stratified across:
// - POS colours (YELLOW, RED, GREEN, BLUE, WHITE) — equal distribution
// - Concreteness (CONCRETE, SEMI_ABSTRACT, ABSTRACT)
// - Core tier (green, yellow, orange, untiered)
// - Single-gloss vs multi-gloss
// - Homophone vs non-homophone
// - Semantic domains — at least 2 from each
//
// GET /api/sample?n=500
// Returns: array of bci_indexes selected
```

### 5. OpenSymbols Search with Cascade

```javascript
// /api/search-symbols
//
// For a given BCI concept + definition:
// 1. Search primary word → score
// 2. If score < 80 → search each BCI gloss variant → best score
// 3. If still < 80 → search keywords from is_field → best score  
// 4. If still < 80 → search UK/US variants (pants→trousers, etc)
// 5. Apply set bias rules to filter results
// 6. Apply POS trust matrix
// 7. Return best match per set with scores
//
// Uses OpenSymbols API: https://www.opensymbols.org/api/v2/symbols?q=
//
// POST /api/search-symbols
// Body: { bci_index: 12383 }
// Returns: { matches: { arasaac: {...}, mulberry: {...}, ... }, cascade_log: [...] }
```

### 6. Image Description (Llama Vision)

```javascript
// /api/describe-image
//
// Takes image URL or R2 path, feeds to Llama 3.2 11B Vision
// Returns structured description of what the image actually shows
//
// Prompt: "Describe this AAC pictogram symbol in detail. 
//          List: what objects/people are shown, their positions, 
//          colours, any actions depicted, any text visible.
//          Output as JSON: { objects: [], actions: [], colours: [], text: [] }"
//
// POST /api/describe-image
// Body: { image_url: "..." or r2_path: "..." }
// Returns: { description: "...", objects: [], actions: [], colours: [] }
```

### 7. Safeguarding Check

```javascript
// /api/safeguard
//
// Takes image description + concept definition
// Rates age-appropriateness:
//   green = safe for all ages
//   amber = review needed (medical, sensitive but educational)
//   red = adult only (explicit medical, anatomical detail)
//
// Checks:
// - Does description mention body parts beyond face/hands/feet?
// - Does description mention medical procedures?
// - Does description mention violence, weapons, drugs?
// - Does description match the content_blocklist from set bias rules?
// - Is the concept itself age-appropriate vs the image depicting it?
//
// POST /api/safeguard
// Body: { bci_index: 12355, description: "...", concept_definition: {...} }
// Returns: { rating: "green|amber|red", flags: [], confidence: 0.95 }
```

### 8. Google Sheets Sync

```javascript
// /api/sheets-sync
//
// Two-way sync between D1 concept_definitions and a Google Sheet
//
// PUSH (D1 → Sheet):
// - Exports all definitions to Google Sheet for human review
// - Columns: bci_index, word, all_glosses, bci_pos, type, classification,
//            subclass, animacy, concreteness, is_field, is_not, visual,
//            contains, reviewed, notes
// - Colour-code rows: green=reviewed, white=pending, red=flagged
//
// PULL (Sheet → D1):
// - Reads edited definitions back from Sheet
// - Only updates rows where reviewed=1 (human approved)
// - Hashes changes for audit trail
//
// Uses Google Sheets API v4 with service account
//
// POST /api/sheets-sync?direction=push|pull
// Auth: service account JSON in environment variable
```

### 9. Export Endpoint

```javascript
// /api/export
//
// Generates versioned JSON files for website consumption
//
// GET /api/export/definitions?version=latest
// → concept-definitions.json (keyed by BCI index)
//
// GET /api/export/symbols?version=latest  
// → symbol-matches.json (best match per concept per set)
//
// GET /api/export/full?version=latest
// → combined file with definitions + symbol URLs + safeguarding
//
// Each export gets:
// - Version number (semver)
// - File hash
// - Count of concepts/symbols included
// - Logged to exports table
```

### 10. Environment Variables (wrangler.toml)

```toml
name = "aac-classification-tool"
main = "src/index.js"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"

[[d1_databases]]
binding = "DB"
database_name = "aac-symbols"
database_id = "your-d1-id"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "aac-images"

[vars]
GOOGLE_SHEETS_ID = "your-sheet-id"
WEBHOOK_SECRET = "shared-secret-for-website-triggers"
OPENSYMBOLS_API = "https://www.opensymbols.org/api/v2/symbols"
ARASAAC_API = "https://api.arasaac.org/v1"

# Google service account JSON stored as secret:
# wrangler secret put GOOGLE_SERVICE_ACCOUNT
```

### 11. Data Import Checklist

Before generating definitions, D1 needs populated with:

- [ ] bci_concepts table: 6,428 rows from W3C registry or existing website D1
- [ ] homophones table: 600 rows from CSV
- [ ] set_bias_rules table: imported from set-bias-rules.json
- [ ] Cross-language collision scan: run once to populate homophones table with cross-lang entries

### 12. Validation Workflow

1. Pull 500 stratified random sample via /api/sample?n=500
2. Generate definitions for those 500 via /api/generate-definitions
3. Push to Google Sheet via /api/sheets-sync?direction=push
4. Human reviews in Sheet, marks reviewed=1
5. Pull back via /api/sheets-sync?direction=pull
6. Run symbol search for those 500 via /api/search-symbols
7. Run image description for matches via /api/describe-image
8. Run safeguarding via /api/safeguard
9. Check results against expected — tune prompts
10. Repeat until accuracy target met
11. Scale to full 6,428

### 13. File Structure

```
aac-classification-tool/
├── wrangler.toml
├── package.json
├── src/
│   ├── index.js                    — router
│   ├── routes/
│   │   ├── generate-definitions.js
│   │   ├── search-symbols.js
│   │   ├── describe-image.js
│   │   ├── classify.js
│   │   ├── safeguard.js
│   │   ├── sample.js
│   │   ├── sheets-sync.js
│   │   └── export.js
│   ├── lib/
│   │   ├── prompts.js              — all AI prompt templates
│   │   ├── cascade.js              — search cascade logic
│   │   ├── bias-rules.js           — set bias filtering
│   │   ├── pos-trust.js            — POS trust matrix
│   │   ├── hashing.js              — content integrity hashing
│   │   ├── cross-lang.js           — cross-language collision scanner
│   │   └── sheets-api.js           — Google Sheets client
│   └── data/
│       ├── set-bias-rules.json     — imported from existing work
│       ├── concept-definitions.json — sample definitions for reference
│       └── homophones.csv          — 600 English homophones
├── migrations/
│   └── 001-initial-schema.sql      — D1 schema above
├── scripts/
│   ├── import-bci-concepts.js      — seed D1 from W3C registry
│   ├── import-homophones.js        — seed from CSV
│   ├── import-bias-rules.js        — seed from JSON
│   ├── run-cross-lang-scan.js      — find cross-language collisions
│   ├── download-arasaac.js         — bulk download to R2
│   ├── download-sclera.js
│   ├── download-mulberry.js
│   └── canva-vectorize.js          — batch PNG→SVG via Canva API
└── tests/
    ├── regression-85.json          — the 85 known validation samples
    ├── validation-500.json         — stratified random sample
    └── run-validation.js           — runs both suites, reports accuracy
```

### 14. Key Working Rules for Claude Code

- Never silently change or add to agreed schema — flag deviations and ask
- Hash every input and output for audit trail
- Log every AI call to audit_log with neuron count
- Respect Cloudflare free tier limits — batch accordingly
- Google Sheets is the human review interface, D1 is the source of truth
- Every export is versioned and immutable
- Set bias rules are DATA not code — read from D1, not hardcoded
- Test against regression-85 before any batch run
- Test against validation-500 before scaling to full 6,428
