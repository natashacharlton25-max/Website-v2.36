# Asset Library — Schema & Architecture

## Overview

Single source of truth for all visual assets across all brands and pipelines.

- Text-based assets (SVG, Lottie JSON) → stored directly in D1
- Binary assets (PNG, JPG, ICO, WEBP) → stored in R2, D1 holds metadata + R2 key
- Every asset gets a content hash (SHA-256) for integrity and deduplication
- Every mutation creates a new version — nothing is overwritten
- All access through a single Worker API with edge caching

---

## Free Tier Budget

| Service | Limit | Headroom |
|---------|-------|----------|
| D1 | 500MB per database, 10 databases | SVGs ~1-5KB = ~100K icons in 500MB |
| D1 | 5M reads/day, 100K writes/day | Build reads ~200 assets once per deploy |
| R2 | 10GB storage total | PNGs, logos, favicons |
| R2 | 1M Class A (write) ops/month | Upload bursts only |
| R2 | 10M Class B (read) ops/month | Cached at edge, rarely hits R2 |
| R2 | Zero egress | No bandwidth charges ever |

---

## Unique ID Strategy

Every asset gets a short, URL-safe, collision-resistant ID.

**Format:** `a_` prefix + 12-char nanoid (alphabet: `0-9a-z`)

```
a_k7x3m9p2w1nq
```

- **Why nanoid over UUID:** shorter URLs, no dashes, still collision-safe at 12 chars (~10^18 combinations)
- **Why prefix:** distinguishes asset IDs from version IDs (`v_`), tag IDs (`t_`), etc. in logs and debugging
- **Generated server-side** — never from the client

Version IDs use same pattern: `v_` + 12-char nanoid.

---

## Content Hashing

Every version of an asset stores a SHA-256 hash of the raw content bytes.

**Purpose:**
1. **Deduplication** — before writing, check if hash exists. If yes, point to existing content, skip storage
2. **Integrity** — consumers can verify what they received matches what was stored
3. **Cache busting** — hash in URL or ETag means perfect cache invalidation
4. **Audit trail** — proves content hasn't been tampered with between pipeline stages

**What gets hashed:**
- SVG/Lottie: the raw text content as UTF-8 bytes
- PNG/JPG/ICO: the raw binary bytes
- Hash is of the *original* content, before any transforms the API might apply at serve time

**Hash is per-version**, not per-asset. Two versions of the same icon have different hashes.

---

## D1 Schema

### `assets` — One row per asset (current state)

```sql
CREATE TABLE assets (
  id              TEXT PRIMARY KEY,       -- a_k7x3m9p2w1nq
  name            TEXT NOT NULL,          -- human name: "Heart Fill"
  slug            TEXT NOT NULL UNIQUE,   -- URL-safe lookup key: "heart-fill"
  type            TEXT NOT NULL,          -- svg | lottie | png | jpg | webp | ico
  storage         TEXT NOT NULL,          -- d1 | r2
  current_version TEXT NOT NULL,          -- v_abc123... (FK to versions.id)
  source          TEXT NOT NULL DEFAULT 'manual',  -- phosphor | recraft | manual | import
  license         TEXT NOT NULL DEFAULT 'unknown', -- mit | recraft | proprietary | cc0 | custom
  license_url     TEXT,                   -- URL to full license text (NULL if well-known)
  created_at      TEXT NOT NULL,          -- ISO 8601
  updated_at      TEXT NOT NULL,          -- ISO 8601
  archived        INTEGER NOT NULL DEFAULT 0  -- soft delete. 0=active, 1=archived
);

CREATE INDEX idx_assets_slug ON assets(slug);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_source ON assets(source);
CREATE INDEX idx_assets_license ON assets(license);
CREATE INDEX idx_assets_archived ON assets(archived);
```

**Why `slug` separate from `name`:**
- `name` = "Heart Fill" (display, searchable)
- `slug` = "heart-fill" (URL path, code references, never changes after creation)
- Icon.astro calls `fetch('/v1/assets/heart-fill')` — the slug IS the API lookup key

**Why soft delete:**
- Assets may be referenced in published content, generated workbooks, email templates
- Archiving hides from listings but keeps the data for existing references
- Periodic cleanup job can hard-delete assets archived for >90 days with zero references

---

### `versions` — Immutable history of every change

```sql
CREATE TABLE versions (
  id              TEXT PRIMARY KEY,       -- v_r8t2n4j6p0xw
  asset_id        TEXT NOT NULL,          -- FK to assets.id
  version_number  INTEGER NOT NULL,       -- 1, 2, 3... auto-increment per asset
  hash            TEXT NOT NULL,          -- SHA-256 of raw content
  content         TEXT,                   -- raw SVG/Lottie markup (NULL for binary)
  r2_key          TEXT,                   -- R2 object key (NULL for text in D1)
  file_size       INTEGER NOT NULL,       -- bytes
  mime_type       TEXT NOT NULL,          -- image/svg+xml, application/json, image/png
  metadata        TEXT,                   -- JSON: {width, height, viewBox, etc.}
  created_at      TEXT NOT NULL,          -- ISO 8601
  created_by      TEXT NOT NULL DEFAULT 'system',  -- pipeline | manual | import

  FOREIGN KEY (asset_id) REFERENCES assets(id),
  UNIQUE(asset_id, version_number),
  UNIQUE(hash)                            -- no duplicate content across ALL versions
);

CREATE INDEX idx_versions_asset ON versions(asset_id);
CREATE INDEX idx_versions_hash ON versions(hash);
```

**Key design decisions:**

- `content` column holds SVG/Lottie text directly — no R2 round-trip for text assets
- `r2_key` holds the R2 object path for binary assets — e.g. `assets/a_k7x3m9p2w1nq/v_r8t2n4j6p0xw.png`
- `UNIQUE(hash)` prevents storing identical content twice. If you re-upload the same SVG, it returns the existing version instead of creating a duplicate
- `metadata` is a JSON string for type-specific info:

```json
// SVG metadata
{"viewBox": "0 0 24 24", "width": 24, "height": 24, "hasGradients": false}

// PNG metadata
{"width": 512, "height": 512, "dpi": 72, "hasAlpha": true}

// Lottie metadata
{"width": 24, "height": 24, "frameRate": 30, "duration": 1.5, "totalFrames": 45}

// Favicon metadata
{"sizes": "32x32", "purpose": "favicon"}
```

---

### `tags` — Flexible categorisation

```sql
CREATE TABLE tags (
  id    TEXT PRIMARY KEY,                 -- t_m3k8w2p5
  name  TEXT NOT NULL UNIQUE,             -- lowercase: "therapy", "navigation", "brand"
  type  TEXT NOT NULL DEFAULT 'general'   -- domain | category | style | general
);

CREATE INDEX idx_tags_type ON tags(type);
```

**Tag types:**

| Type | Examples | Purpose |
|------|----------|---------|
| `domain` | therapy, commerce, education, wellness | Which brand domains use this asset |
| `category` | icon, logo, illustration, favicon, pattern | What kind of asset |
| `style` | outline, fill, duotone, animated | Visual treatment |
| `component` | toast, badge, a11y-panel, spec-card, ticker | Which components use this icon |
| `general` | hero, card, navigation, social, email | Usage context |

---

### `asset_tags` — Many-to-many join

```sql
CREATE TABLE asset_tags (
  asset_id TEXT NOT NULL,
  tag_id   TEXT NOT NULL,
  PRIMARY KEY (asset_id, tag_id),
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE INDEX idx_asset_tags_tag ON asset_tags(tag_id);
```

---

### `lottie_mappings` — Links animated icons to static fallbacks

```sql
CREATE TABLE lottie_mappings (
  lottie_asset_id  TEXT NOT NULL,          -- the Lottie animation
  static_asset_id  TEXT NOT NULL,          -- the Phosphor SVG fallback
  PRIMARY KEY (lottie_asset_id),
  FOREIGN KEY (lottie_asset_id) REFERENCES assets(id),
  FOREIGN KEY (static_asset_id) REFERENCES assets(id)
);
```

**Why a separate table:** keeps the relationship explicit and queryable. "Show me all Lottie icons that don't have a static fallback" becomes a simple LEFT JOIN.

---

### `brand_assets` — Brand-specific asset overrides

```sql
CREATE TABLE brand_assets (
  brand       TEXT NOT NULL,               -- mindthebox | beyoulovewins | frequency
  asset_id    TEXT NOT NULL,               -- FK to assets.id
  role        TEXT NOT NULL,               -- logo-primary | logo-mono | favicon | og-image
  PRIMARY KEY (brand, role),
  FOREIGN KEY (asset_id) REFERENCES assets(id)
);
```

**Purpose:** A brand's primary logo, favicon, OG image etc. are specific named slots. This table maps brand + role → asset. Content pipeline queries "give me the primary logo for Mind the Box" without hardcoding asset IDs.

---

### `licenses` — Known license definitions

```sql
CREATE TABLE licenses (
  key         TEXT PRIMARY KEY,           -- mit | recraft | proprietary | cc0 | custom
  name        TEXT NOT NULL,              -- "MIT License", "Recraft AI License"
  url         TEXT,                       -- https://opensource.org/licenses/MIT
  permits     TEXT NOT NULL,              -- JSON: ["commercial", "modification", "distribution"]
  requires    TEXT NOT NULL DEFAULT '[]', -- JSON: ["attribution"] or ["attribution", "share-alike"]
  notes       TEXT                        -- human-readable summary or caveats
);
```

Seed data:

| Key | Name | Permits | Requires |
|-----|------|---------|----------|
| `mit` | MIT License | commercial, modification, distribution | attribution |
| `recraft` | Recraft AI License | commercial, modification | attribution, check-terms |
| `proprietary` | Proprietary (own work) | all | none |
| `cc0` | CC0 Public Domain | all | none |
| `custom` | Custom License | varies | see license_url on asset |

**Why a table not just a string:** queryable. "Show me all assets I can use commercially without attribution" = `WHERE permits LIKE '%commercial%' AND requires NOT LIKE '%attribution%'`. Also prevents typos — `license` on `assets` is a FK to `licenses.key`.

---

### `usage_log` — Where and when each asset is referenced

```sql
CREATE TABLE usage_log (
  id          TEXT PRIMARY KEY,           -- u_w3k8m2p5n7xr
  asset_id    TEXT NOT NULL,              -- FK to assets.id
  version_id  TEXT NOT NULL,              -- FK to versions.id (which version was used)
  consumer    TEXT NOT NULL,              -- website-build | content-pipeline | email | admin
  context     TEXT,                       -- page/template/workbook identifier
  brand       TEXT,                       -- which brand context (NULL if cross-brand)
  action      TEXT NOT NULL DEFAULT 'render', -- render | download | embed | reference
  created_at  TEXT NOT NULL,              -- ISO 8601

  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (version_id) REFERENCES versions(id)
);

CREATE INDEX idx_usage_asset ON usage_log(asset_id);
CREATE INDEX idx_usage_consumer ON usage_log(consumer);
CREATE INDEX idx_usage_brand ON usage_log(brand);
CREATE INDEX idx_usage_created ON usage_log(created_at);
```

**What gets logged:**

| Consumer | When | Context example |
|----------|------|-----------------|
| `website-build` | Astro build fetches an icon | `page:/about`, `component:Badge` |
| `content-pipeline` | Worker picks an icon for a workbook | `workbook:anxiety-toolkit-v2` |
| `email` | Email template embeds a logo | `template:welcome-series-01` |
| `admin` | Someone downloads from the admin UI | `admin:manual-download` |

**What this enables:**
- "Where is `heart-fill` used?" → query by `asset_id`, get every consumer + context
- "What version was live on the website last Tuesday?" → filter by `consumer` + `created_at`
- "Can I archive this icon?" → check if `usage_log` has recent entries
- "Which assets have never been used?" → LEFT JOIN where `usage_log` is NULL
- Audit trail for compliance — every usage is timestamped with version hash

**Write frequency concern (free tier):** build-time logging writes ~200 rows per deploy. Content pipeline maybe 50/run. Well within 100K writes/day. For high-volume consumers, batch inserts.

**Cleanup:** usage_log rows older than 12 months can be aggregated into a summary table and deleted to keep D1 lean.

---

## R2 Structure

Binary assets stored with predictable key pattern:

```
assets/{asset_id}/{version_id}.{ext}
```

Example:
```
assets/a_k7x3m9p2w1nq/v_r8t2n4j6p0xw.png
assets/a_p4m7w2x9k3nq/v_t5j8n1r3w6xp.ico
```

No folders for categories — that's what tags are for. Flat structure, ID-addressed.

---

## Worker API Contract

**Base URL:** `https://assets.{yourdomain}.com/v1`

**Auth:** Bearer token in `Authorization` header. Single token for now (rotatable). Expand to per-consumer tokens later if needed.

---

### Read Endpoints

#### `GET /v1/assets/:slug`

Primary lookup. Returns current version content.

```
GET /v1/assets/heart-fill
Accept: image/svg+xml
```

Response: raw SVG content with headers:
```
Content-Type: image/svg+xml
ETag: "sha256:a1b2c3..."
X-Asset-Id: a_k7x3m9p2w1nq
X-Version: 3
Cache-Control: public, max-age=86400, stale-while-revalidate=604800
```

**For binary assets:** streams from R2 with same headers.

**Query params:**
- `?v=2` — specific version number
- `?format=json` — returns metadata instead of content
- `?format=base64` — returns base64-encoded content (useful for email templates)

#### `GET /v1/assets/:slug/meta`

Returns full metadata without content body.

```json
{
  "id": "a_k7x3m9p2w1nq",
  "name": "Heart Fill",
  "slug": "heart-fill",
  "type": "svg",
  "source": "phosphor",
  "license": {
    "key": "mit",
    "name": "MIT License",
    "permits": ["commercial", "modification", "distribution"],
    "requires": ["attribution"]
  },
  "currentVersion": {
    "id": "v_r8t2n4j6p0xw",
    "number": 3,
    "hash": "sha256:a1b2c3...",
    "fileSize": 1247,
    "mimeType": "image/svg+xml",
    "metadata": {"viewBox": "0 0 24 24", "width": 24, "height": 24},
    "createdAt": "2026-02-26T14:00:00Z"
  },
  "tags": ["icon", "therapy", "fill", "wellness"],
  "usageCount": 147,
  "lastUsed": "2026-02-26T14:00:00Z",
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-02-26T14:00:00Z"
}
```

#### `GET /v1/assets`

List/search with filtering.

```
GET /v1/assets?tag=therapy&type=svg&limit=50&offset=0
GET /v1/assets?tag=logo&tag=mindthebox
GET /v1/assets?q=heart              (searches name and slug)
GET /v1/assets?source=phosphor
GET /v1/assets?updated_after=2026-02-01T00:00:00Z
```

Returns array of metadata objects (no content bodies in list).

#### `GET /v1/assets/:slug/versions`

Version history for an asset.

```json
{
  "assetId": "a_k7x3m9p2w1nq",
  "versions": [
    {"id": "v_r8t2n4j6p0xw", "number": 3, "hash": "sha256:...", "fileSize": 1247, "createdAt": "...", "createdBy": "manual"},
    {"id": "v_j5n8w2t3p1xr", "number": 2, "hash": "sha256:...", "fileSize": 1190, "createdAt": "...", "createdBy": "pipeline"},
    {"id": "v_m4k7x9p2w3nq", "number": 1, "hash": "sha256:...", "fileSize": 1102, "createdAt": "...", "createdBy": "import"}
  ]
}
```

#### `GET /v1/brands/:brand/assets`

All assets assigned to a brand, grouped by role.

```json
{
  "brand": "mindthebox",
  "assets": {
    "logo-primary": {"id": "a_...", "slug": "mtb-logo", "type": "svg"},
    "logo-mono": {"id": "a_...", "slug": "mtb-logo-mono", "type": "svg"},
    "favicon": {"id": "a_...", "slug": "mtb-favicon", "type": "ico"},
    "og-image": {"id": "a_...", "slug": "mtb-og", "type": "png"}
  }
}
```

#### `GET /v1/tags`

List all tags, optionally filtered by type.

```
GET /v1/tags?type=domain
```

---

### Write Endpoints

#### `POST /v1/assets`

Create a new asset. Multipart form data.

```
POST /v1/assets
Content-Type: multipart/form-data

file: [binary or text file]
name: Heart Fill
slug: heart-fill
type: svg
source: phosphor
license: mit
tags: icon,therapy,fill
```

**Server-side processing:**
1. Generate asset ID (`a_` + nanoid)
2. Generate version ID (`v_` + nanoid)
3. Hash the file content (SHA-256)
4. Check `UNIQUE(hash)` — if exists, return existing asset (with `409 Conflict` if slug differs, `200 OK` if same asset)
5. If text asset (SVG/Lottie): store content in `versions.content`
6. If binary asset: upload to R2 at `assets/{asset_id}/{version_id}.{ext}`, store key in `versions.r2_key`
7. Extract metadata (viewBox, dimensions, etc.)
8. Insert into `assets`, `versions`, `asset_tags`
9. Return full metadata response with `201 Created`

#### `PUT /v1/assets/:slug`

Update an asset — creates a new version.

```
PUT /v1/assets/heart-fill
Content-Type: multipart/form-data

file: [new file content]
```

**Server-side processing:**
1. Look up asset by slug
2. Hash new content
3. Check hash uniqueness — if identical to current version, return `304 Not Modified`
4. Generate new version ID
5. Increment `version_number` (SELECT MAX + 1)
6. Store content (D1 or R2)
7. Update `assets.current_version` and `assets.updated_at`
8. Return new version metadata with `200 OK`

#### `PATCH /v1/assets/:slug`

Update metadata only (name, tags, etc.) — no new version created.

```json
{
  "name": "Heart Filled",
  "tags": ["icon", "therapy", "fill", "wellness"]
}
```

#### `POST /v1/assets/:slug/rollback`

Rollback to a previous version.

```json
{
  "version": 2
}
```

Sets `assets.current_version` to the specified version's ID. Does NOT delete newer versions — they remain in history.

#### `DELETE /v1/assets/:slug`

Soft-delete (archive). Sets `archived = 1`.

#### `POST /v1/assets/bulk`

Bulk import. Array of assets in a single request. Used by the Phosphor seed script.

```json
{
  "assets": [
    {"file_url": "...", "name": "Heart Fill", "slug": "heart-fill", "type": "svg", "source": "phosphor", "tags": ["icon", "fill"]},
    {"file_url": "...", "name": "Heart Outline", "slug": "heart-outline", "type": "svg", "source": "phosphor", "tags": ["icon", "outline"]}
  ]
}
```

For bulk: accepts either inline `content` (base64 or raw text) or `file_url` (Worker fetches it).

#### `POST /v1/brands/:brand/assets`

Assign an asset to a brand role.

```json
{
  "asset_id": "a_k7x3m9p2w1nq",
  "role": "logo-primary"
}
```

#### `POST /v1/assets/verify`

Integrity check. Client sends a hash, server confirms it matches.

```json
{
  "slug": "heart-fill",
  "hash": "sha256:a1b2c3..."
}
```

Returns `{"valid": true, "version": 3}` or `{"valid": false, "expected": "sha256:x7y8z9...", "version": 3}`.

#### `POST /v1/usage`

Log an asset usage event. Called by consumers after they fetch an asset.

```json
{
  "slug": "heart-fill",
  "consumer": "website-build",
  "context": "component:Badge",
  "brand": "mindthebox",
  "action": "render"
}
```

Server resolves slug → asset_id and current version_id automatically. Returns `201 Created`.

**Batch variant:** `POST /v1/usage/batch` — array of events. For build-time logging (one call after build, not per-icon).

```json
{
  "events": [
    {"slug": "heart-fill", "consumer": "website-build", "context": "page:/about"},
    {"slug": "arrow-right", "consumer": "website-build", "context": "component:Button"},
    {"slug": "mtb-logo", "consumer": "website-build", "context": "layout:header"}
  ],
  "brand": "mindthebox"
}
```

#### `GET /v1/assets/:slug/usage`

Where and when this asset has been used.

```
GET /v1/assets/heart-fill/usage?limit=50
GET /v1/assets/heart-fill/usage?consumer=website-build
GET /v1/assets/heart-fill/usage?after=2026-01-01T00:00:00Z
```

```json
{
  "assetId": "a_k7x3m9p2w1nq",
  "slug": "heart-fill",
  "totalUsages": 147,
  "usages": [
    {"consumer": "website-build", "context": "component:Badge", "brand": "mindthebox", "version": 3, "action": "render", "at": "2026-02-26T14:00:00Z"},
    {"consumer": "content-pipeline", "context": "workbook:anxiety-toolkit-v2", "brand": "beyoulovewins", "version": 3, "action": "embed", "at": "2026-02-25T09:30:00Z"}
  ]
}
```

#### `GET /v1/usage/orphans`

Assets with zero usage — candidates for archiving.

```json
{
  "unusedAssets": [
    {"id": "a_...", "slug": "clock-countdown", "source": "phosphor", "createdAt": "...", "lastUsed": null},
    {"id": "a_...", "slug": "old-brand-mark", "source": "manual", "createdAt": "...", "lastUsed": "2025-08-15T00:00:00Z"}
  ]
}
```

#### `GET /v1/licenses`

List all known licenses with their permissions.

```json
[
  {"key": "mit", "name": "MIT License", "permits": ["commercial", "modification", "distribution"], "requires": ["attribution"]},
  {"key": "proprietary", "name": "Proprietary", "permits": ["all"], "requires": []},
  {"key": "recraft", "name": "Recraft AI License", "permits": ["commercial", "modification"], "requires": ["attribution", "check-terms"]}
]
```

#### `GET /v1/assets?license=mit`

Filter assets by license — already supported in the list endpoint. Useful for "show me everything I can use in commercial email templates without attribution concerns".

---

## Caching Strategy

### Edge Caching (Cloudflare Cache API)

The Worker uses the Cache API to cache responses at the edge. Critical for staying within D1 free tier read limits.

```
                  ┌─────────────┐
  Client ──────── │  CF Edge    │ ── cache hit ──→ return cached
                  │  (Worker)   │
                  └──────┬──────┘
                         │ cache miss
                    ┌────┴────┐
                    │   D1    │  (text assets)
                    │   R2    │  (binary assets)
                    └─────────┘
```

**Cache rules:**
- `GET /v1/assets/:slug` — cache 24h, stale-while-revalidate 7 days
- `GET /v1/assets/:slug?v=N` — cache 1 year (immutable — version content never changes)
- `GET /v1/assets` (list) — cache 5 minutes
- All writes (`POST`, `PUT`, `DELETE`) — purge related cache keys

**ETag:** every response includes `ETag: "sha256:{hash}"`. Clients send `If-None-Match` for `304 Not Modified` without transferring content.

### Build-Time Caching (Astro Integration)

Icon.astro fetches from the API at build time. To avoid hammering the API during builds:

1. Build script runs `GET /v1/assets?type=svg&type=lottie` once → gets all icon metadata
2. For each icon used in pages, fetch content by slug (hits edge cache)
3. Astro's built-in caching means unchanged assets don't re-fetch on incremental builds

---

## Migration Plan — Phosphor Seed

One-time script to import existing `public/Icons/phosphor/` into the library.

### Step 1: Scan

```js
// Walk public/Icons/phosphor/ tree
// Actual folder structure from Icon.astro line 88:
//
// CONTENT categories (→ category tags):
//   nature, wellness, objects, interface, communication,
//   people, creative, shapes
//
// COMPONENT-SPECIFIC folders (→ component tags):
//   a11y, a11y-panel, contact-popup, announcement-ticker,
//   toast, spec-cards, badges, trust
//
// OTHER:
//   _unused/social  → tag: deprecated
//
// NOT all Phosphor icons are present — only what's currently used.
// More can be added later via bulk import or single upload.
```

### Step 2: Transform

For each SVG file:
- `slug` = filename without extension: `heart-fill`
- `name` = titlecase: `Heart Fill`
- `type` = `svg`
- `source` = `phosphor`
- `license` = `mit` (all Phosphor icons are MIT)
- `hash` = SHA-256 of raw content
- `content` = raw SVG text

**Tag mapping from folder names:**

```js
const FOLDER_TO_TAGS = {
  // Content categories → type: category
  nature:        [{ name: 'nature',        type: 'category' }],
  wellness:      [{ name: 'wellness',      type: 'category' }],
  objects:       [{ name: 'objects',       type: 'category' }],
  interface:     [{ name: 'interface',     type: 'category' }],
  communication: [{ name: 'communication', type: 'category' }],
  people:        [{ name: 'people',        type: 'category' }],
  creative:      [{ name: 'creative',      type: 'category' }],
  shapes:        [{ name: 'shapes',        type: 'category' }],

  // Component-specific → type: component
  'a11y':                [{ name: 'a11y',               type: 'component' }],
  'a11y-panel':          [{ name: 'a11y-panel',         type: 'component' }],
  'contact-popup':       [{ name: 'contact-popup',      type: 'component' }],
  'announcement-ticker': [{ name: 'announcement-ticker',type: 'component' }],
  'toast':               [{ name: 'toast',              type: 'component' }],
  'spec-cards':          [{ name: 'spec-card',          type: 'component' }],
  'badges':              [{ name: 'badge',              type: 'component' }],
  'trust':               [{ name: 'trust',              type: 'component' }],

  // Deprecated
  '_unused/social':      [{ name: 'social', type: 'general' }, { name: 'deprecated', type: 'general' }],
};

// Every SVG also gets these base tags:
// { name: 'icon', type: 'category' }
// { name: 'svg',  type: 'style' }
// Plus 'fill' or 'outline' based on filename suffix
```

### Step 3: Bulk Upload

```js
// Batch into groups of 50 (D1 batch limit)
// For each batch:
//   1. Insert assets
//   2. Insert versions with content
//   3. Create tags if new
//   4. Insert asset_tags
// All in a single D1 batch transaction
```

### Step 4: Verify

```js
// For each imported asset:
//   GET /v1/assets/{slug}
//   Hash response content
//   Compare to original file hash
//   Report any mismatches
```

### Step 5: Update Icon.astro

Replace:
```js
const svgPath = `public/Icons/phosphor/${category}/${name}.svg`;
const svgContent = fs.readFileSync(svgPath, 'utf-8');
```

With:
```js
const response = await fetch(`${ASSET_API_URL}/v1/assets/${name}`);
const svgContent = await response.text();
```

The rest of Icon.astro (stroke conversion, gradient injection, draw-mode) stays the same — it still operates on raw SVG markup, just sourced from the API instead of the filesystem.

---

## Worker File Structure

```
workers/
  asset-library/
    src/
      index.ts              ← Worker entry, router
      routes/
        assets.ts           ← CRUD for assets
        versions.ts         ← Version history, rollback
        brands.ts           ← Brand asset assignments  
        tags.ts             ← Tag management
        licenses.ts         ← License definitions + queries
        usage.ts            ← Usage logging + orphan detection
        verify.ts           ← Integrity checks
        bulk.ts             ← Bulk import
      lib/
        hash.ts             ← SHA-256 hashing
        id.ts               ← Nanoid generation with prefixes
        storage.ts          ← D1/R2 abstraction
        cache.ts            ← Edge cache helpers
        metadata.ts         ← Extract viewBox, dimensions, etc.
        auth.ts             ← Bearer token validation
      schema/
        migrations/
          001_initial.sql   ← All CREATE TABLE statements
    wrangler.toml           ← D1 + R2 bindings
    scripts/
      seed-phosphor.ts      ← One-time import script
```

### wrangler.toml

```toml
name = "asset-library"
main = "src/index.ts"
compatibility_date = "2026-02-26"

[[d1_databases]]
binding = "DB"
database_name = "asset-library"
database_id = "<your-database-id>"

[[r2_buckets]]
binding = "STORAGE"
bucket_name = "asset-library"

[vars]
API_TOKEN = "" # Set via wrangler secret

# Local dev
[env.dev]
[env.dev.d1_databases]
binding = "DB"
database_name = "asset-library-dev"
database_id = "<your-dev-database-id>"
```

---

## What This Unlocks

| Consumer | How it uses the API |
|----------|-------------------|
| Icon.astro (website build) | `GET /v1/assets/{slug}` → inline SVG at build time |
| Content pipeline Worker | `GET /v1/assets?tag=therapy&type=svg` → pick icons for workbooks |
| Email templates | `GET /v1/assets/{slug}?format=base64` → inline in HTML email |
| Admin UI | Full CRUD through all endpoints |
| Brand config | `GET /v1/brands/mindthebox/assets` → all brand assets in one call |
| Audit/compliance | `GET /v1/assets/{slug}/versions` + `/verify` → full provenance trail |
| Usage tracking | `GET /v1/assets/{slug}/usage` → where is this icon used, when, by whom |
| License compliance | `GET /v1/assets?license=mit` → filter by what you can legally use where |
| Cleanup | `GET /v1/usage/orphans` → find unused assets safe to archive |
| Future tools | Any HTTP client can consume assets with one auth token |
