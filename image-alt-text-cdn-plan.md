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

- 4,533 existing assets (icons + lotties) use `a_` + random string IDs via `makeId.asset()`
- 1,554 alt_symbols seeded — each maps a `word` to up to two visual representations:
  - `aac_url`: ARASAAC pictogram PNG (1,553 have one, auto-matched by keyword — many are semantically wrong)
  - `icon_id`: FK to Phosphor icon in `assets` table (1,512 linked, 42 are AAC-only with no Phosphor equivalent)
  - 1 orphan row ("sunset") from deleted test seed — no AAC URL or icon_id
  - **Needs `verified` boolean** — all current entries are auto-seeded, not human-reviewed. Resolver should prefer verified entries when ambiguity exists.
  - **Architectural note:** These 1,554 entries are valid as resolver vocabulary — the resolver looks up words from alt text strings against this table. They should NOT be used for direct icon-name→pictogram matching. See Phase 3c: icons feed their alt text through the resolver, not their SVG name.
- `versions` table has `r2_key` column; `assets` table does not
- `storage` column on assets indicates where content lives
- R2 bucket bound (`STORAGE` binding) but empty — all current assets stored as text in `versions.content`
- No image assets exist yet

### Target ID Format

```
{brand}_{category}_{name}_{hash}
```

Examples:
```
mtb_icon_arrow-right_a3f8c2      ← icon (SVG in D1)
mtb_hero_therapy-room_7d1e4b     ← image (binary in R2)
bylw_blog_sunset-ocean_9b2f11    ← image (binary in R2)
freq_anim_loading-dots_c4e2a1    ← lottie (JSON in D1)
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
  id              TEXT PRIMARY KEY,     -- currently a_ + random, migrating to {brand}_{category}_{name}_{hash}
  name            TEXT NOT NULL,
  base_name       TEXT NOT NULL,
  type            TEXT NOT NULL,        -- 'icon' | 'image' | 'lottie'
  storage         TEXT,                 -- existing: indicates D1 text vs R2 binary
  current_version TEXT,                 -- existing: FK to versions table
  license_key     TEXT,
  alt_symbol_id   TEXT,
  alt_descriptive TEXT,                 -- from image generation prompt
  source          TEXT,
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now')),

  -- Phase 3a: columns to ADD
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

| Layer | Source | Stored in |
|-------|--------|-----------|
| Word | Auto-matched from base_name or manually set | `alt_symbols.word` via `assets.alt_symbol_id` |
| Descriptive | Image generation prompt or manual entry | `assets.alt_descriptive` |
| AAC | Looked up at seed time from Open Symbols | `alt_symbols.aac_url` |

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
      aacUrl: asset.aacUrl,
      // Phase 3c: evolves to resolveAACPhrase(asset.descriptive)
      aacHtml: asset.aacUrl 
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

## 7. Upload Pipeline (Future)

```
Generate image (AI or manual)
    ↓
Upload script:
  1. SHA-256 hash → first 6 chars
  2. Build ID: {brand}_{category}_{name}_{hash}
  3. Upload to R2: images/{name}_{hash}/v1.jpg
  4. Search Open Symbols for word + AAC pictogram
  5. Insert D1 assets row:
     - url = CDN URL
     - alt_descriptive = generation prompt
     - alt_symbol_id = linked or new symbol
     - file_hash, version, dimensions
```

Single command uploads image and creates all alt text automatically.

---

## 8. Migration Path

### Audit Snapshot (28 Feb 2026)

**D1 `assets` table has:** id, slug, name, base_name, type, storage, current_version, license_key, alt_symbol_id, alt_descriptive, source, created_at, updated_at
**D1 `assets` table missing:** version, file_hash, url, width, height, category, brand, semantic_role
**D1 `versions` table has:** r2_key, content (text storage for SVG/Lottie)
**D1 `alt_symbols` table:** 1,554 rows. Each maps a `word` to ARASAAC pictogram (`aac_url`) and/or Phosphor icon (`icon_id`). Coverage: 1,553 have AAC URLs, 1,512 have icon_ids, 42 AAC-only, 1 orphan ("sunset"). Entries are valid as resolver vocabulary — the issue was using them for direct icon-name→pictogram matching (Phase 3c corrects this).
**Current IDs:** `a_` + random string via `makeId.asset()`
**R2 bucket:** Bound as `STORAGE`, empty — no binary assets uploaded yet
**API routes that exist:** Full CRUD on /v1/assets, /v1/alt-symbols, /v1/tags, /v1/brands, /v1/licenses, /v1/usage, /v1/health
**API gaps:** No `/images/:key` route, no `include=alt` JOIN, `has_alt` parsed but not wired to WHERE clause

### Phase 1 — Now (done)
- [x] Alt symbols table — 1,554 words with ARASAAC pictogram URLs (1,553) and/or Phosphor icon links (1,512). Used as vocabulary lookup by the AAC resolver — alt text strings are resolved against this table at build time. Not used for direct icon-name→pictogram matching.
- [x] 1 orphan alt_symbol ("sunset") to clean up
- [x] 4,533 assets seeded (icons + lotties, all stored as text in D1)
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

### Phase 2.5 — Accessibility + Subtitle (immediate)
- [ ] Add `aria-hidden="true"` to all three alt spans in Image.astro
- [ ] Replace `display: none` with visually-hidden on img in replace mode CSS
- [ ] Add subtitle display mode CSS (flex column, image shrinks, text below)
- [ ] Add sixth AltTextCard ("Subtitle") to /accessibility page
- [ ] Update a11y-panel.ts altDisplayMode to include 'subtitle' value
- [ ] Update overlay CSS background from translucent to solid rectangle

### Phase 3a — Universal Asset Identity (retrofit all 4,533 existing assets)

Schema migration:
- [ ] Add `file_hash`, `version`, `category`, `brand`, `semantic_role` columns to `assets` table
- [ ] Add `verified` boolean to `alt_symbols` table (default false)
- [ ] Note: `r2_key` already exists on `versions` table — decide if that's sufficient or also needed on `assets`

Backfill script (highest-risk step — migrate atomically, not partially):
- [ ] Generate SHA-256 hash (first 6 chars) for all existing SVG/Lottie content in `versions.content`
- [ ] Add temporary `new_id` column — populate with `{brand}_{category}_{name}_{hash}` format
- [ ] Update all FK references atomically: `alt_symbols.icon_id`, usage tables, scrollytelling data, JSON content refs
- [ ] Swap: rename `new_id` → `id`, drop legacy `a_` format
- [ ] Populate `version` and `file_hash` columns for existing rows
- [ ] Do NOT partial-migrate — all references update in one transaction or none

API fixes (already half-wired):
- [ ] Wire `has_alt` WHERE clause in `assets.ts` (parsed at line 180, never added to query)
- [ ] Add `include=alt` JOIN — assets LEFT JOIN alt_symbols to return word/aac_url
- [ ] Update list response shape to include alt fields alongside id, name, slug, etc.

### Phase 3b — Image Pipeline (R2 + CDN)
- [ ] `/images/:key` Worker route — serve from R2 with `Cache-Control: immutable`
- [ ] Image upload script: SHA-256 → ID → R2 upload → D1 insert (one command)
- [ ] First test image: upload manually, verify full round-trip (R2 → Worker → CDN → Image atom)
- [ ] Tooltip mode: add `:focus-within` on `.image` + touch toggle for keyboard/mobile users

### Phase 3c — AAC Mode (language-first, not icon-swap)

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

Backfill: categorise existing 4,533 assets. Most Phosphor icons → `ui-control`. Icons used in scrollytelling/narrative content → `content-symbol`.

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
  | { type: 'icon'; word: string; svg: string }   // Phosphor icon (content-symbol only)
  | { type: 'text'; word: string }                // text-only fallback

export async function resolveAACPhrase(phrase: string): Promise<AACResolved[]>
```

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
- [ ] Add `semantic_role` column to `assets` table (`decorative` | `ui-control` | `content-symbol`)
- [ ] Categorise existing 4,533 assets (bulk: most icons → `ui-control`, scrollytelling/narrative icons → `content-symbol`)
- [ ] Write AAC-mode CSS for three tiers (hide decorative, text-label ui-control, resolver-output content-symbol)
- [ ] Existing 1,554 alt_symbol entries remain as vocabulary — they're valid resolver lookup targets, just no longer used for direct icon-name→pictogram matching

Alt text quality:
- [ ] Review existing alt text on content-symbol assets — ensure phrasing is meaningful, not decorative ("airplane moving on runway" not "airplane icon")
- [ ] Add AAC-friendly verb bias to AI content generation prompts (move, go, stop, fly, help, feel, etc.)
- [ ] Ensure scrollytelling step data includes alt text field per step

Resolver:
- [ ] Create `src/lib/aac/aacResolver.ts` with `resolveAACPhrase` + `resolveAACWord`
- [ ] Define `AACResolved` type
- [ ] Implement 5-tier resolution hierarchy
- [ ] Create `alt_symbol_context_overrides` table in D1
- [ ] Support multi-card output for phrase decomposition
- [ ] Update `.image-alt-aac` span to render multiple cards from resolved array
- [ ] Add `aac_hint` field to AI content generation prompts/schemas
- [ ] Wire resolver into page templates (imported like `loadAllAltText()`)
- [ ] Add `verified` boolean to `alt_symbols` table (default false — all current entries are auto-seeded)
- [ ] Resolver prefers verified entries when ambiguity exists
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

### Phase 4 — Content Integration
- [ ] `snapshot-alt-text.js` pre-build script (D1 → src/data/alt-text.json)
- [ ] `loadAllAltText()` build utility reads from JSON snapshot (src/data/load-alt-text.ts)
- [ ] Wire content collections to use image IDs in frontmatter (currently `cardImage: ./card.png`)
- [ ] Spread aacInline to page content
- [ ] Legal pages three content levels
- [ ] `loadAllAltText()` scaling: partition by brand or add `modifiedSince` param if asset count reaches thousands

---

## Summary

| Concern | Where it lives | When it runs |
|---------|---------------|-------------|
| Image file | R2 bucket | Uploaded once |
| Image URL | D1 assets.url | Set at upload |
| Alt word | D1 alt_symbols.word | Seeded at upload |
| Alt descriptive | D1 assets.alt_descriptive | Set at upload (from prompt) |
| AAC pictogram | D1 alt_symbols.aac_url | Looked up at upload via Open Symbols |
| CDN cache | Cloudflare edge | Automatic, immutable |
| Build data load | src/data/alt-text.json snapshot | Pre-build D1 query → JSON |
| A11y toggle | CSS data attributes | Client-side, zero cost |
| Icon AAC mode | semantic_role on assets | CSS tiers: hide / text-label / resolve |
| AAC resolver | src/lib/aac/aacResolver.ts | Build time — single pipeline for all alt text |
| Image atom | Pure props | Receives data, no fetching |
