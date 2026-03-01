# Image + Alt Text + CDN Plan

## Architecture Overview

```
Content Author writes blog/page
    ↓
Frontmatter/JSON includes image ID
    ↓
npm run build
    ↓
Pre-build script snapshots D1 alt text → JSON
    ↓
Page templates pass alt data as props to Image atom
    ↓
Image atom renders figure + hidden alt spans
    ↓
Static HTML deployed to Cloudflare Pages
    ↓
Visitor loads page → static HTML (free, CDN)
    ↓
Browser requests image → R2 via Worker → CDN cached
    ↓
A11y panel toggles alt text visibility → pure CSS, zero API calls
```

---

## 1. Asset Identity System

Every asset — icon, lottie, or image — gets a unique hashed ID. The identity system is universal; storage differs by type (D1 text for SVG/Lottie, R2 binary for images).

### Current State (as of Phase 2)

- 4,567 assets (4,566 icons/lotties in D1 + 1 test image in R2) — all using hashed ID format
- 1,554 alt_symbols seeded — each maps a `word` to up to two visual representations:
  - `aac_url`: ARASAAC pictogram PNG (1,553 have one, auto-matched by keyword — many are semantically wrong)
  - `icon_id`: FK to Phosphor icon in `assets` table (1,512 linked, 42 are AAC-only with no Phosphor equivalent)
  - 1 orphan row ("sunset") from deleted test seed — no AAC URL or icon_id
  - **Needs `verified` boolean** — all current entries are auto-seeded, not human-reviewed. Resolver should prefer verified entries when ambiguity exists.
  - **Architectural note:** These 1,554 entries are valid as resolver vocabulary — the resolver looks up words from alt text strings against this table. They should NOT be used for direct icon-name→pictogram matching. See Phase 3c: icons feed their alt text through the resolver, not their SVG name.
- `versions` table has `r2_key` column; `assets` table does not
- `storage` column on assets indicates where content lives
- R2 bucket has 1 image (`mtb_hero_articles-hero_0aff4f`). All icon/lottie assets remain as text in `versions.content`.
- First image asset uploaded: `mtb_hero_articles-hero_0aff4f` (R2, served via Worker with immutable caching)

### ID Format

Asset primary key uses the hashed format directly:

```
{brand}_{category}_{name}_{hash}
```

Examples:
```
shared_icon_arrow-right_a3f8c2   ← icon (SVG in D1)
mtb_hero_therapy-room_7d1e4b     ← image (binary in R2, future)
bylw_blog_sunset-ocean_9b2f11    ← image (binary in R2, future)
shared_anim_loading-dots_c4e2a1  ← lottie (JSON in D1)
```

### Hash Generation

Hash is first 6 characters of the file content's SHA-256. This means:

- Same content = same hash (deduplication)
- Changed content = new hash (cache bust)
- Hash is part of the ID forever — if content changes, it gets a new ID
- Works identically for SVG text, Lottie JSON, or image binary

### Version Column

```sql
ALTER TABLE assets ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE assets ADD COLUMN file_hash TEXT;
```

When an image is replaced (same concept, new file):

- `version` increments
- `file_hash` updates
- R2 key includes version: `images/mtb_hero_therapy-room_a3f8c2/v2.jpg`
- Old version remains in R2 until manually cleaned

### D1 Assets Table — Target

```sql
CREATE TABLE assets (
  -- Existing columns
  id              TEXT PRIMARY KEY,     -- format: shared_{icon|anim}_{slug}_{hash}
  name            TEXT NOT NULL,
  base_name       TEXT NOT NULL,
  type            TEXT NOT NULL,        -- 'icon' | 'image' | 'lottie'
  storage         TEXT,                 -- existing: indicates D1 text vs R2 binary
  current_version TEXT,                 -- existing: FK to versions table
  license_key     TEXT,
  alt_symbol_id   TEXT,
  alt_descriptive TEXT,                 -- from image generation prompt
  alt_aac_phrase  TEXT,                 -- curated 3-4 word phrase for AAC resolver (e.g. "books shelf warm")
  source          TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),

  -- Phase 3a: columns added
  category        TEXT,                 -- hero, blog, product, icon, etc.
  brand           TEXT,                 -- mtb, bylw, freq — null = shared
  version         INTEGER DEFAULT 1,
  file_hash       TEXT,                 -- SHA-256 first 6 chars
  semantic_role   TEXT DEFAULT 'ui-control',    -- 'decorative' | 'ui-control' | 'content-symbol'
                                                -- Default ui-control not decorative: prevents accidentally hiding
                                                -- content-symbol icons before categorisation is complete
  url             TEXT,                 -- public CDN URL (images only)
  mime_type       TEXT,
  width           INTEGER,
  height          INTEGER,
  file_size       INTEGER
);
```

Note: `r2_key` already lives on the `versions` table, not `assets`. This is correct — versions track storage location, assets track identity.

---

## 2. Alt Text — Single Source in D1

All alt text lives in D1. No sidecar files, no R2 metadata, no frontmatter duplication.

### Three Layers per Image

| Layer | Source | Stored in | Used by |
|-------|--------|-----------|---------|
| Word | Auto-matched from base_name or manually set | `alt_symbols.word` via `assets.alt_symbol_id` | Icons (single concept → single pictogram swap) |
| Descriptive | Image generation prompt or manual entry | `assets.alt_descriptive` | Screen readers, caption/overlay/subtitle modes |
| AAC phrase | Curated 3-4 concrete words for resolver | `assets.alt_aac_phrase` | Images (multi-concept → multiple pictogram cards) |
| AAC pictogram | Looked up from Open Symbols / ARASAAC | `alt_symbols.aac_url` | Resolver output — real pictograms only, no Phosphor icon fallback |

### Seeding Flow

When a new image is uploaded:

```
1. Upload image to R2
2. Insert assets row with:
   - alt_descriptive = generation prompt (or manual)
   - base_name = semantic name ("therapy-room")
3. Look up base_name in alt_symbols
   - If exists → link via alt_symbol_id
   - If not → create new alt_symbol:
     a. word = base_name (or cleaned version)
     b. Search Open Symbols API for AAC pictogram
     c. Store aac_url
     d. Link to asset
```

### Build-Time Data Load

**JSON snapshot, not HTTP fetch.** Build must never depend on API availability.

```
Pre-build: scripts/snapshot-alt-text.js → D1 query → src/data/alt-text.json
Astro build: load-alt-text.ts reads local JSON → cached Map
```

```typescript
// scripts/snapshot-alt-text.js
// Runs before astro build — direct D1 query, outputs JSON

const results = await db.prepare(`
  SELECT a.name, a.alt_descriptive AS descriptive,
         a.alt_aac_phrase AS aacPhrase,
         s.word, s.aac_url AS aacUrl
  FROM assets a
  LEFT JOIN alt_symbols s ON a.alt_symbol_id = s.id
  WHERE a.type = 'image'
`).all();

await fs.writeFile('src/data/alt-text.json', JSON.stringify(results.results, null, 2));
```

```typescript
// src/data/load-alt-text.ts
// Reads pre-built JSON — no HTTP, no API dependency

import altData from './alt-text.json';

let cache: Map<string, AltData> | null = null;

export function loadAllAltText(): Map<string, AltData> {
  if (cache) return cache;
  
  cache = new Map();
  
  for (const asset of altData) {
    cache.set(asset.name, {
      word: asset.word,
      descriptive: asset.descriptive,
      aacPhrase: asset.aacPhrase,   // curated 3-4 words for resolver
      aacUrl: asset.aacUrl,
      // Icons (single word): pictogramCard from alt_symbols.word
      // Images (multi-word): resolveAACPhrase(asset.aacPhrase, symbols, overrides)
      aacHtml: asset.aacPhrase
        ? renderResolvedCards(resolveAACPhrase(asset.aacPhrase, symbols, overrides))
        : asset.aacUrl 
          ? pictogramCard(asset.word, asset.aacUrl)
          : textOnlyCard(asset.word)
    });
  }
  
  return cache;
}
```

Build pipeline: `snapshot-alt-text → astro build`. Deterministic, hashable, versionable.

**Safeguard:** If the snapshot script fails (D1 query error, empty result), it must exit non-zero and block `astro build`. No silent fallback to stale JSON.

### Page Usage

```astro
---
// Any page or section component
import { loadAllAltText } from '@data/load-alt-text';
import Image from '@atoms/images/Image';

const altText = await loadAllAltText(); // reads from JSON snapshot
const heroAlt = altText.get('therapy-room');
---

<Image 
  src="https://cdn.example.com/images/mtb_hero_therapy-room_a3f8c2/v1.jpg"
  altWord={heroAlt?.word}
  altDescriptive={heroAlt?.descriptive}
  altAacHtml={heroAlt?.aacHtml}
/>
```

### Content Collection Usage

For blog posts — image ID in frontmatter, alt text from D1:

```yaml
---
title: Finding Your Safe Space
hero_image: mtb_hero_therapy-room_a3f8c2
---
```

```astro
---
const altText = await loadAllAltText();
const { hero_image } = Astro.props.data;
const heroAlt = altText.get(hero_image);
const heroUrl = `${CDN_BASE}/${hero_image}/v1.jpg`;
---

<Image src={heroUrl} altWord={heroAlt?.word} ... />
```

Author never writes alt text manually. Just the image ID. Everything else is automatic.

---

## 3. Asset Library API — Updated Endpoint

### GET /v1/assets/:slug?format=json&include=alt

Single call returns everything:

```json
{
  "id": "a_mtb_hero_therapy-room_a3f8c2",
  "name": "therapy-room",
  "type": "image",
  "version": 1,
  "url": "https://cdn.example.com/images/therapy-room_a3f8c2/v1.jpg",
  "word": "therapy room",
  "descriptive": "A warm therapy room with soft lighting and indoor plants",
  "aacUrl": "https://static.arasaac.org/pictograms/6789/6789_300.png",
  "license": "proprietary",
  "width": 1920,
  "height": 1080
}
```

SQL behind it:

```sql
SELECT 
  a.id, a.name, a.type, a.version, a.url,
  a.alt_descriptive AS descriptive,
  a.width, a.height, a.license_key,
  s.word, s.aac_url AS aacUrl
FROM assets a
LEFT JOIN alt_symbols s ON a.alt_symbol_id = s.id
WHERE a.name = ?
```

### GET /v1/assets?type=image&include=alt (bulk)

Returns all image assets with alt text. Available for tooling/debugging. Note: `snapshot-alt-text.js` queries D1 directly, not this endpoint — build never depends on API availability.

```sql
SELECT 
  a.name, a.url, a.alt_descriptive AS descriptive,
  s.word, s.aac_url AS aacUrl
FROM assets a
LEFT JOIN alt_symbols s ON a.alt_symbol_id = s.id
WHERE a.type = 'image'
```

---

## 4. R2 Storage + CDN Caching

### R2 Bucket Structure

> **Note:** The full asset ID is `{brand}_{category}_{name}_{hash}` but R2 paths intentionally drop brand and category: `images/{name}_{hash}/v1.jpg`. This keeps R2 keys shorter and avoids redundant nesting — brand/category are already in D1. The full ID is the canonical key for lookups; the R2 key is just a storage path.

```
images/
  therapy-room_a3f8c2/
    v1.jpg          ← original
    v1_thumb.jpg    ← thumbnail (future)
    v1_webp.webp    ← format variant (future)
  sunset-ocean_7d1e4b/
    v1.jpg
    v2.jpg          ← replaced version
icons/
  (Phosphor SVGs — already served from API)
```

### Worker Image Route

```typescript
// In Asset Library Worker

app.get('/images/:key', async (c) => {
  const key = `images/${c.req.param('key')}`;
  const object = await c.env.R2_BUCKET.get(key);
  
  if (!object) return c.notFound();
  
  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': object.etag,
    }
  });
});
```

### How CDN Caching Works

```
First request for therapy-room.jpg:
  Browser → Cloudflare Edge (cache miss) → Worker → R2
  Response cached at edge with Cache-Control: immutable

Next 9,999 requests:
  Browser → Cloudflare Edge (cache hit) → served instantly
  Worker never called. R2 never called.

Image replaced (v2):
  New URL: /images/therapy-room_a3f8c2/v2.jpg
  Different URL = different cache entry = auto cache bust
  Old v1 URL still cached, still works (no broken links)
```

### Cost Breakdown (10,000 visitors/day, 5 images/page)

| Component | Requests | Cost |
|-----------|----------|------|
| D1 alt text query | 1 per build | ~free |
| HTML from Pages CDN | 10,000/day | Free (included) |
| R2 reads (with CDN) | ~5 per unique image per day | Pennies |
| R2 reads (without CDN) | 50,000/day | ~$0.18/day |
| Open Symbols API | 0 at runtime, only at seed | Free |
| A11y toggle | 0 (CSS only) | Free |

With CDN: effectively free. Each unique image hits R2 once, then cached globally.

---

## 5. Image Atom — Final Props

```json
{
  "component": "Image",
  "props": {
    "content": {
      "src":            { "type": "string", "required": true, "asset": true },
      "role":           { "type": "string", "enum": ["content", "decorative"], "default": "content" },
      "altWord":        { "type": "string", "text": true },
      "altDescriptive": { "type": "string", "text": true },
      "altAacHtml":     { "type": "string" }
    },
    "visual": {
      "fit":            { "type": "string", "enum": ["cover", "contain", "fill", "none"] },
      "radius":         { "type": "string", "enum": ["none", "sm", "md", "lg", "full"] },
      "shadow":         { "type": "string", "enum": ["none", "sm", "md", "lg"] },
      "hover":          { "type": "boolean", "default": false },
      "responsive":     { "type": "boolean", "default": false },
      "loading":        { "type": "string", "default": "lazy", "enum": ["lazy", "eager"] },
      "sepia":          { "type": "string", "enum": ["light", "default", "heavy"] },
      "blur":           { "type": "string", "enum": ["sm", "md", "lg", "xl"] },
      "gradientMask":   { "type": "string", "enum": ["fade-bottom", "fade-top", "fade-edges", "vignette"] },
      "clipPath":       { "type": "string", "enum": ["circle", "ellipse", "diamond", "hexagon", "blob", "slant-left", "slant-right"] },
      "tilt":           { "type": "string", "enum": ["sm", "md", "lg"] },
      "width":          { "type": "string" },
      "height":         { "type": "string" },
      "class":          { "type": "string" }
    },
    "animation": {}
  }
}
```

### Output HTML — Content Image

```html
<figure class="image" data-role="content">
  <img 
    src="https://cdn.example.com/images/therapy-room/v1.jpg" 
    alt="therapy room" 
    loading="lazy" 
    class="image__img image--fit-cover"
  />
  <span class="image-alt-word" aria-hidden="true">therapy room</span>
  <span class="image-alt-descriptive" aria-hidden="true">A warm therapy room with soft lighting</span>
  <span class="image-alt-aac" aria-hidden="true">
    <span class="aac-card">
      <img class="aac-card__pictogram" src="https://..." alt="therapy room" width="32" height="32" />
      <span class="aac-card__word">therapy room</span>
    </span>
  </span>
</figure>
```

Note: No `hidden` attribute on spans — CSS controls visibility via `[data-alt-text-mode]`. All spans have `aria-hidden="true"` so screen readers always use `img alt` as the canonical source.

### Output HTML — Decorative Image

```html
<img src="..." alt="" aria-hidden="true" role="presentation" class="image__img" />
```

---

## 6. Alt Text Display Modes (A11y Panel)

Two toggles on /accessibility page:

### What to show (existing)
| Mode | data-alt-text-mode | Shows |
|------|-------------------|-------|
| Off | none | Nothing (screen reader alt only) |
| Simple | word | .image-alt-word |
| Full | descriptive | .image-alt-descriptive |
| AAC | aac | .image-alt-aac |

### How to show it (new)
| Mode | data-alt-display-mode | Behaviour |
|------|----------------------|-----------|
| Hidden | hidden | display: none (default) |
| Caption | caption | Block below image |
| Overlay | overlay | Positioned over image (solid background) |
| Subtitle | subtitle | Image shrinks via flex, text below |
| Tooltip | tooltip | Visible on hover |
| Replace | replace | Image visually-hidden, text shown |

### Screen reader rule (universal, no exceptions)

All three alt spans have `aria-hidden="true"` hardcoded in Image.astro. The `img alt` attribute is always the screen reader source. The spans are always visual-only.

In replace mode, the img uses visually-hidden (not `display: none`) so it stays in the accessibility tree.

| Mode | img (visual) | img alt (reader) | span (visual) | span (reader) |
|------|-------------|-----------------|---------------|---------------|
| hidden | shown | read | display:none | skipped |
| caption | shown | read | shown | skipped (aria-hidden) |
| overlay | shown | read | shown | skipped (aria-hidden) |
| subtitle | shown (shrunk) | read | shown | skipped (aria-hidden) |
| tooltip | shown | read | on hover | skipped (aria-hidden) |
| replace | visually-hidden | read | shown | skipped (aria-hidden) |

### CSS Rules

Uses two-axis compound selectors: `[data-alt-display-mode][data-alt-text-mode]`. Both axes must match for a span to display. This avoids ambiguity — display mode controls *how*, text mode controls *what*.

Note: `.image` **is** the `<figure>` element (not a wrapper around it), so selectors target `.image` directly.

```css
/* ═══ Hidden — default, all alt spans hidden ═══ */
[data-alt-display-mode="hidden"] .image-alt-word,
[data-alt-display-mode="hidden"] .image-alt-descriptive,
[data-alt-display-mode="hidden"] .image-alt-aac { display: none; }

/* ═══ Caption — block below image ═══ */
[data-alt-display-mode="caption"] .image { flex-direction: column; }

[data-alt-display-mode="caption"][data-alt-text-mode="word"] .image-alt-word { display: block; }
[data-alt-display-mode="caption"][data-alt-text-mode="word"] .image-alt-descriptive,
[data-alt-display-mode="caption"][data-alt-text-mode="word"] .image-alt-aac { display: none; }

[data-alt-display-mode="caption"][data-alt-text-mode="descriptive"] .image-alt-descriptive { display: block; }
[data-alt-display-mode="caption"][data-alt-text-mode="descriptive"] .image-alt-word,
[data-alt-display-mode="caption"][data-alt-text-mode="descriptive"] .image-alt-aac { display: none; }

[data-alt-display-mode="caption"][data-alt-text-mode="aac"] .image-alt-aac { display: block; }
[data-alt-display-mode="caption"][data-alt-text-mode="aac"] .image-alt-word,
[data-alt-display-mode="caption"][data-alt-text-mode="aac"] .image-alt-descriptive { display: none; }

/* ═══ Overlay — positioned over image bottom ═══ */
[data-alt-display-mode="overlay"][data-alt-text-mode="word"] .image-alt-word,
[data-alt-display-mode="overlay"][data-alt-text-mode="descriptive"] .image-alt-descriptive,
[data-alt-display-mode="overlay"][data-alt-text-mode="aac"] .image-alt-aac {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface-inverse, #000);  /* solid, not translucent */
  color: white;
  padding: var(--space-sm);
}

/* ═══ Tooltip — same as overlay but only on hover ═══ */
/* NOTE: :hover alone excludes keyboard and touch users.
   Phase 3/4 enhancement: add :focus-within on .image 
   and/or a touch toggle for mobile. */
[data-alt-display-mode="tooltip"] .image-alt-word,
[data-alt-display-mode="tooltip"] .image-alt-descriptive,
[data-alt-display-mode="tooltip"] .image-alt-aac { display: none; }

[data-alt-display-mode="tooltip"] .image:hover [class^="image-alt-"] {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: var(--space-sm);
}

[data-alt-display-mode="tooltip"][data-alt-text-mode="word"] .image:hover .image-alt-word { display: block; }
[data-alt-display-mode="tooltip"][data-alt-text-mode="descriptive"] .image:hover .image-alt-descriptive { display: block; }
[data-alt-display-mode="tooltip"][data-alt-text-mode="aac"] .image:hover .image-alt-aac { display: block; }

/* ═══ Subtitle — image shrinks via flex, text below ═══ */
/* Requires height constraint from parent (card grid cell, explicit height, aspect-ratio) */
[data-alt-display-mode="subtitle"] .image {
  display: flex;
  flex-direction: column;
}

[data-alt-display-mode="subtitle"] .image .image__img {
  flex: 1 1 0;
  min-height: 4rem;       /* never collapse below usable size */
  min-height: 40%;        /* or percentage — whichever is larger */
  object-fit: cover;
}

[data-alt-display-mode="subtitle"][data-alt-text-mode="word"] .image-alt-word,
[data-alt-display-mode="subtitle"][data-alt-text-mode="descriptive"] .image-alt-descriptive,
[data-alt-display-mode="subtitle"][data-alt-text-mode="aac"] .image-alt-aac {
  display: block;
  flex: 0 0 auto;        /* text never shrinks */
}

/* ═══ Replace — visually-hide image, show text ═══ */
/* img uses visually-hidden (not display:none) so it stays in the 
   accessibility tree. Screen reader still reads img alt. */
[data-alt-display-mode="replace"] .image .image__img {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

[data-alt-display-mode="replace"][data-alt-text-mode="word"] .image-alt-word { display: block; }
[data-alt-display-mode="replace"][data-alt-text-mode="descriptive"] .image-alt-descriptive { display: block; }
[data-alt-display-mode="replace"][data-alt-text-mode="aac"] .image-alt-aac { display: block; }
```

---

## 7. Upload Pipeline (done)

```
npx tsx scripts/upload-image.ts \
  --file path/to/image.jpg \
  --name therapy-room \
  --brand mtb \
  --category hero \
  --alt "A warm therapy room with soft lighting and indoor plants" \
  --aac-phrase "warm room light plants"

Script does:
  1. SHA-256 hash → first 6 chars
  2. Build ID: {brand}_{category}_{name}_{hash}
  3. Check if asset exists + compare hash:
     - New asset → R2 upload + D1 insert + versions row
     - Changed file → R2 upload + version bump + versions row
     - Same file → metadata-only update (no R2, no version bump)
  4. Look up base_name in alt_symbols → link if match
  5. Store: url, alt_descriptive, alt_aac_phrase, file_hash, version, dimensions
```

---

## 8. Migration Path

### Audit Snapshot (1 Mar 2026 — post Phase 4)

**D1 `assets` table has:** id, slug, name, base_name, type, storage, current_version, license_key, alt_symbol_id, alt_descriptive, alt_aac_phrase, source, created_at, updated_at, file_hash, version, category, brand, semantic_role, new_id, url, mime_type, width, height, file_size
**D1 `assets` count:** 4,567 rows (4,566 icons/lotties + 1 test image). IDs: `shared_{icon|anim}_{slug}_{hash}` for existing, `{brand}_{category}_{name}_{hash}` for images.
**D1 `versions` table has:** r2_key, content (text storage for SVG/Lottie)
**D1 `alt_symbols` table:** 1,579 rows (1,554 original + 25 new) + `verified` column (all 0). 6 words updated US→UK. Entries are valid resolver vocabulary — not for direct icon-name→pictogram matching.
**Current IDs:** `shared_icon_{slug}_{hash}` / `shared_anim_{slug}_{hash}` — swap complete, all FKs updated
**R2 bucket:** 1 image uploaded (`images/articles-hero_0aff4f/v1.png`). Worker route live with immutable caching.
**API routes:** Full CRUD on /v1/assets, /v1/alt-symbols, /v1/tags, /v1/brands, /v1/licenses, /v1/usage, /v1/health
**API fixes done:** `has_alt` WHERE wired, `include=alt` JOIN returns altWord/altDescriptive/altAacUrl
**Resolver:** `src/lib/aac/aacResolver.ts` — pure function, two output types only (aac | text, no Phosphor icon fallback). 20 stop words, 20 lemma entries. Context guard with prefer_symbol fallback.
**AAC pipeline cleanup:** `iconCard()` removed from aac-cards.ts. `type: 'icon'` removed from aac-inline.ts and aacResolver.ts. Rule: ARASAAC pictogram or text. No Phosphor icons as AAC symbols.
**Context overrides:** `alt_symbol_context_overrides` table — 5 rows (aviation blocks taxi), indexed on context_token
**Semantic roles:** 463 content-symbol, 33 decorative, 4,071 ui-control
**Build pipeline:** snapshot-alt-text.js → 3 JSON files → loadAllAltText() → resolver → static HTML. Zero unresolved words.

### Phase 1 — Now (done)
- [x] Alt symbols table — 1,554 words with ARASAAC pictogram URLs (1,553) and/or Phosphor icon links (1,512). Used as vocabulary lookup by the AAC resolver — alt text strings are resolved against this table at build time. Not used for direct icon-name→pictogram matching.
- [x] 1 orphan alt_symbol ("sunset") to clean up
- [x] 4,566 assets seeded (icons + lotties, all stored as text in D1)
- [x] License library with 4 communication levels
- [x] aacInline utility with Open Symbols
- [x] AAC cards (pictogram/icon/text-only)
- [x] A11y panel alt text toggle
- [x] Image atom refactor — figure + alt spans
- [x] /accessibility settings page

### Phase 2 — Next (done)
- [x] Add altWord, altDescriptive, altAacHtml props to Image atom
- [x] Remove assetId / fetch-alt.ts from Image
- [x] Add alt display mode toggle to a11y panel
- [x] Write CSS for caption/overlay/tooltip/replace modes
- [x] Update Image schema with content/visual/animation groups

### Phase 2.5 — Accessibility + Subtitle (done)
- [x] Add `aria-hidden="true"` to all three alt spans in Image.astro
- [x] Replace `display: none` with visually-hidden on img in replace mode CSS
- [x] Add subtitle display mode CSS (flex column, image shrinks, text below)
- [x] Add sixth AltTextCard ("Subtitle") to /accessibility page
- [x] Update a11y-panel.ts altDisplayMode to include 'subtitle' value
- [x] Update overlay CSS background from translucent to solid

### Phase 3a — Universal Asset Identity (done)

Schema migration:
- [x] Add `file_hash`, `version`, `category`, `brand`, `semantic_role` columns to `assets` table
- [x] Add `verified` boolean to `alt_symbols` table (default false)
- [x] Note: `r2_key` stays on `versions` table only — not needed on `assets`

Backfill:
- [x] `file_hash` — derived from `versions.hash` (SUBSTR strip `sha256:` prefix, first 6 hex chars). 4,566/4,566, 0 nulls.
- [x] `category` — SVGs → `icon`, Lotties → `anim`
- [x] `brand` — all current assets shared (column NULL, ID string uses `shared`)
- [x] `new_id` populated — format `shared_icon_{slug}_{hash}` / `shared_anim_{slug}_{hash}`. 4,566 unique, 0 collisions.

API fixes:
- [x] `has_alt` WHERE clause wired in `assets.ts` (was parsed but unused)
- [x] `include=alt` JOIN — LEFT JOIN alt_symbols, returns `altWord`, `altDescriptive`, `altAacUrl`
- [x] Response shape updated to include alt fields conditionally

ID swap (done — atomic D1 transaction):
- [x] Updated `assets.id` = `new_id` (4,566 rows)
- [x] Updated `versions.asset_id` (4,566 rows)
- [x] Updated `asset_tags.asset_id` (13,887 rows)
- [x] Updated `lottie_mappings.lottie_asset_id` + `static_asset_id` (33 rows)
- [x] Updated `alt_symbols.icon_id` (1,512 rows WHERE NOT NULL)
- [x] `brand_assets` + `usage_log` — 0 rows, guarded
- [ ] Drop `new_id` column (redundant now — equals `id`)
- [x] Post-swap verification: zero orphans, zero row count changes across all FK tables
- [x] Note: D1 file imports enforce FK constraints — use `PRAGMA foreign_keys = OFF` at top of migration

### Phase 3b — Image Pipeline (R2 + CDN) (done)
- [x] `GET /images/:path+` Worker route — serves from R2 with `Cache-Control: immutable`, ETag
- [x] `upload-image.ts` CLI script — three paths: new asset (R2 + D1 + versions), changed file (version bump), same file (metadata-only update). Accepts `--alt` and `--aac-phrase` arguments.
- [x] Migration 011: added `url`, `mime_type`, `width`, `height`, `file_size` to assets
- [x] First test image: `mtb_hero_articles-hero_0aff4f` — 1600×550 PNG, full round-trip verified (R2 → Worker → CDN headers)
- [ ] Tooltip mode: add `:focus-within` on `.image` + touch toggle for keyboard/mobile users (deferred)
- [ ] `alt_text_log` table for safeguarding traceability — alt text changes on therapeutic content must be auditable

### Phase 3c — AAC Mode (language-first, not icon-swap) (done)

**Fundamental principle:** AAC mode is a communication layer, not a symbol-swap engine. The AAC pipeline resolves *meaning* (alt text), not *assets* (icon names).

**Correct pipeline:**
```
Icon/Image → alt text (human or AI generated, governed) → AAC resolver → AAC cards
```

**Wrong pipeline (what 1,554 icon→AAC mappings currently attempt):**
```
Icon name → keyword match → AAC pictogram
```

The `alt_symbols` table is a vocabulary lookup for the resolver — not an icon-to-pictogram mapping layer. The resolver's input is always an alt text string, regardless of whether it describes an icon, an image, or a scrollytelling step.

This means instead of mapping 1,554 icon names to pictograms, you're resolving perhaps ~200 unique narrative alt phrases across your actual content. That's manageable and semantically correct.

**Alt text quality rule:** Alt text must be meaningful, not decorative.

| Quality | Example |
|---------|---------|
| Bad | "Airplane icon" |
| Good | "Airplane taxiing on runway" |
| AAC-friendly | "Airplane moving slowly on runway" |

AI prompting should bias toward AAC-friendly verbs: move, go, stop, fly, help, feel, etc.

#### Three-tier icon categorisation

Every icon still gets a `semantic_role` — this controls what happens in AAC mode at the CSS level:

| Role | In AAC mode | Example |
|------|-------------|---------|
| `decorative` | Hidden | Divider flourish, background pattern |
| `ui-control` | Text label only | Settings gear, share arrow, analytics chart |
| `content-symbol` | Alt text → resolver → AAC cards | Scrollytelling icons, narrative illustrations |

The difference from before: `content-symbol` icons don't get a direct icon-name→pictogram lookup. Their alt text goes through the same resolver as everything else.

**Implementation:**

```sql
ALTER TABLE assets ADD COLUMN semantic_role TEXT DEFAULT 'ui-control';
-- Values: 'decorative' | 'ui-control' | 'content-symbol'
-- Default ui-control (not decorative) so uncategorised icons show text labels
-- rather than being hidden in AAC mode
```

Backfill: categorise existing 4,566 assets. Most Phosphor icons → `ui-control`. Icons used in scrollytelling/narrative content → `content-symbol`.

**In AAC mode CSS:**
```css
/* Decorative icons: hidden */
[data-alt-text-mode="aac"] [data-semantic-role="decorative"] { display: none; }

/* UI control icons: show text label, hide SVG */
[data-alt-text-mode="aac"] [data-semantic-role="ui-control"] .icon-svg { display: none; }
[data-alt-text-mode="aac"] [data-semantic-role="ui-control"] .icon-label { display: block; }

/* Content symbols: hide SVG, show AAC cards (resolved from alt text) */
[data-alt-text-mode="aac"] [data-semantic-role="content-symbol"] .icon-svg { display: none; }
[data-alt-text-mode="aac"] [data-semantic-role="content-symbol"] .image-alt-aac { display: block; }
```

#### Scrollytelling in AAC mode

Scrollytelling steps use icons as visual narrative anchors. In AAC mode:
- Suppress animation (already handled in reduced/textonly render modes)
- Hide the SVG icon
- Pass the step's alt text through the resolver
- Render AAC cards derived from the semantic description
- Keep the text narrative visible below

Example step data:
```json
{
  "icon": "airplane",
  "alt": "Airplane moving slowly on runway",
  "text": "The plane moves along the runway before takeoff."
}
```

In AAC mode this renders as:
```
[airplane pictogram] [move pictogram] [runway pictogram]
The plane moves along the runway before takeoff.
```

Story continuity preserved. No icon-name guessing.

#### AAC resolver (single pipeline for all content)

All semantic content feeds through the same resolver — image alt text, icon alt text, scrollytelling steps, page headings, body copy. The input is always an alt text string. The output is always structured AAC cards.

**Architecture: AI suggests, resolver governs.**

AI-generated content includes `aac_hint` tokens — semantic suggestions, never symbol IDs. AI must never choose `icon_id` or `aac_url` directly.

```json
{
  "text": "The airplane is taxiing slowly.",
  "aac_hint": ["airplane", "taxiing", "slow"]
}
```

The resolver validates hints against `alt_symbols`, applies phrase logic, blocks bad fallbacks, and produces resolved structure.

**Where it lives:**

```
src/lib/aac/aacResolver.ts
```

A pure function module, imported by page templates at build time. Results baked into static HTML. If the site moves to edge rendering, the same module works at runtime unchanged.

**Build-time flow:**

```
AI generates JSON with aac_hint tokens
    ↓
npm run build → Astro compiles pages
    ↓
Page template imports aacResolver
    ↓
resolveAACPhrase() runs per content item
    ↓
Resolver validates hints against alt_symbols in D1
    ↓
Returns structured AACResolved[] tokens
    ↓
Components embed resolved AAC spans
    ↓
Static HTML deployed — AAC already baked in
    ↓
User toggles altTextMode → CSS shows/hides pre-built AAC cards
```

**Return type:**

```typescript
type AACResolved =
  | { type: 'aac'; word: string; src: string }   // ARASAAC pictogram
  | { type: 'text'; word: string }                // text-only fallback (no Phosphor icon fallback — icons aren't AAC symbols)

export function resolveAACPhrase(phrase: string, symbols: AltSymbol[], overrides: ContextOverride[]): AACResolved[]
```

**Resolver inputs — two paths, same function:**
- **Icons** (content-symbol): `alt_symbols.word` → single word → single pictogram swap
- **Images**: `assets.alt_aac_phrase` → curated 3-4 words → multiple pictogram cards

The resolver never processes `alt_descriptive` — that's long-form prose for sighted users and screen readers, not AAC vocabulary.

**Purity constraints — the resolver must NOT:**
- Read DOM
- Check render mode
- Modify components
- Import brand tokens
- Trust AI-provided symbol IDs (only accepts hint tokens for lookup)

**Resolution hierarchy (deterministic, no NLP):**

1. **Exact phrase match** — query `word = "airplane taxiing"` in alt_symbols
2. **Exact individual tokens** — split into words, match each before any stemming
3. **Controlled lemma fallback** — stem only if the lemma is in an allowlisted verb set
4. **Context guard** — block incorrect fallbacks when co-occurring tokens indicate a different domain (aviation keywords block "taxi" car match)
5. **Multi-card decomposition** — for 2+ word concepts, render primary noun + verb as separate cards

**Context guardrails (stored in D1 as rows, not comma-separated):**

```sql
CREATE TABLE alt_symbol_context_overrides (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  context_token   TEXT NOT NULL,        -- e.g. "airplane", "aircraft", "runway"
  block_symbol    TEXT,                 -- e.g. "taxi" (suppress this match)
  prefer_symbol   TEXT                  -- e.g. "move" (use this instead)
);
```

Example rows:
```
context_token | block_symbol | prefer_symbol
airplane      | taxi         | NULL
aircraft      | taxi         | NULL
runway        | taxi         | move
pilot         | taxi         | NULL
```

When resolver sees "airplane" in the phrase → looks up overrides → blocks "taxi" match. Row-based scales better than parsing comma-separated lists and avoids string splitting in queries.

**Tasks:**

Icon categorisation:
- [x] `semantic_role` column on `assets` (added in Phase 3a, default `ui-control`)
- [x] Categorised 4,566 assets: 463 content-symbol (154 base_names × 3 weights + 1 test image), 33 decorative (lotties), 4,071 ui-control
- [x] 6 US→UK word swaps applied (aeroplane, biscuit, torch, postbox, bin, lorry)
- [x] 25 new alt_symbols created for compound base_names + gaps (UK English, 23/25 with ARASAAC pictograms)
- [ ] Write AAC-mode CSS for three tiers (hide decorative, text-label ui-control, resolver-output content-symbol)
- [x] Existing 1,579 alt_symbol entries positioned as vocabulary — valid resolver lookup targets

Alt text quality:
- [ ] Review existing alt text on content-symbol assets — ensure phrasing is meaningful, not decorative
- [ ] Add AAC-friendly verb bias to AI content generation prompts
- [ ] Ensure scrollytelling step data includes alt text field per step

Resolver:
- [x] Created `src/lib/aac/aacResolver.ts` with `resolveAACPhrase` + `resolveAACWord`
- [x] `AACResolved` type defined (aac | icon | text)
- [x] Resolution hierarchy: exact match → lemma fallback (20 entries, 10 verbs) → context guard with prefer_symbol → resolution
- [x] `alt_symbol_context_overrides` table created + 5 seed rows (aviation blocks taxi)
- [x] Context guard checks prefer_symbol before falling to text
- [x] `buildSymbolMap` deduplicates, verified entries take priority
- [x] Stop words (20) and lemma allowlist hardcoded — intentionally small, governed expansion only
- [ ] Support multi-card output for phrase decomposition
- [ ] Update `.image-alt-aac` span to render multiple cards from resolved array
- [ ] Add `aac_hint` field to AI content generation prompts/schemas
- [ ] Wire resolver into page templates
- [x] `verified` boolean on `alt_symbols` (added Phase 3a)
- [x] Resolver prefers verified entries when ambiguity exists
- [x] Removed `type: 'icon'` from resolver, aac-inline.ts, and aac-cards.ts — AAC = ARASAAC pictogram or text only
- [x] Removed `iconCard()` from aac-cards.ts
- [x] Added `alt_aac_phrase` column to assets — curated 3-4 word phrases for images (resolver input for multi-concept scenes)
- [x] `upload-image.ts` accepts `--aac-phrase` argument
- [x] `check-unresolved-words.ts` uses `alt_aac_phrase` (not `alt_descriptive`)
- [ ] Clean up orphan "sunset" alt_symbol row

Resolver performance:
- [ ] Snapshot `alt_symbols` + `alt_symbol_context_overrides` into JSON alongside alt-text snapshot
- [ ] Resolver loads both into memory once, indexed by token — zero DB calls inside resolver loop

**Verification criteria:**
- Decorative icons hidden in AAC mode
- UI control icons show text label only, no AAC pictogram
- Content-symbol icons: SVG hidden, alt text resolved through AAC pipeline, cards displayed
- Scrollytelling steps render as AAC card sequence + text narrative
- "airplane moving on runway" → `[airplane]` + `[move]` + `[runway]`, not `[taxi car]`
- "heart" in love context renders love pictogram, not anatomical
- AI-provided aac_hints validated — unrecognised tokens fall to text-only
- No client-side JS for resolution — all baked at build
- Resolver is portable to runtime if architecture changes
- Same resolver handles icons, images, and body copy — single pipeline

### Phase 4 — Content Integration (done)
- [x] `snapshot-alt-text.js` pre-build script (D1 → three JSON files: alt-text, alt-symbols, context-overrides)
- [x] Safeguard: exits non-zero if alt_symbols empty — blocks build
- [x] Also snapshot `alt_symbols` + `alt_symbol_context_overrides` into JSON for resolver
- [x] `loadAllAltText()` build utility reads from JSON snapshots, runs resolver, returns Map<string, AltData>
- [x] Post-build: `check-unresolved-words.ts` — runs resolver against all `alt_aac_phrase` values. Current output: 0 unresolved.
- [x] Page wiring pattern established (about.astro example) — loadAllAltText() once, .get(assetName) per image
- [ ] Wire remaining pages — per-page migration from astro:assets Image to custom Image atom
- [ ] Spread aacInline to page content
- [ ] Legal pages three content levels
- [ ] `loadAllAltText()` scaling: partition by brand or add `modifiedSince` param if asset count reaches thousands

### Safeguarding — Alt Text Audit Trail

All alt text describes content aimed at vulnerable users. Changes must be traceable for safeguarding compliance.

```sql
CREATE TABLE alt_text_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id TEXT NOT NULL,
  field TEXT NOT NULL,          -- 'alt_descriptive' | 'alt_aac_phrase' | 'alt_word' | 'alt_symbol_id'
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT,             -- 'upload-script' | 'admin' | user identifier
  changed_at TEXT DEFAULT (datetime('now'))
);
```

- [ ] Create `alt_text_log` table in D1
- [ ] Upload script logs alt text changes (insert row on every `alt_descriptive` write/update)
- [ ] API PATCH routes for assets log alt field changes
- [ ] Retention policy: logs kept indefinitely (safeguarding requirement)

---

## Summary

| Concern | Where it lives | When it runs |
|---------|---------------|-------------|
| Image file | R2 bucket | Uploaded once |
| Image URL | D1 assets.url | Set at upload |
| Alt word | D1 alt_symbols.word | Seeded at upload — icons: single concept |
| Alt descriptive | D1 assets.alt_descriptive | Set at upload — prose for screen readers |
| Alt AAC phrase | D1 assets.alt_aac_phrase | Curated 3-4 words — images: multi-concept resolver input |
| AAC pictogram | D1 alt_symbols.aac_url | ARASAAC only — no Phosphor icon fallback |
| CDN cache | Cloudflare edge | Automatic, immutable |
| Build data load | src/data/alt-text.json snapshot | Pre-build D1 query → JSON |
| A11y toggle | CSS data attributes | Client-side, zero cost |
| Icon AAC mode | semantic_role on assets | CSS tiers: hide / text-label / resolve |
| AAC resolver | src/lib/aac/aacResolver.ts | Build time — single pipeline for all alt text |
| Image atom | Pure props | Receives data, no fetching |
| Alt text audit | D1 alt_text_log | Every alt text change logged (safeguarding) |
