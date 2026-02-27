# Asset Library Worker

Single source of truth for all visual assets across brands and pipelines.

## Quick Start

### 1. Create D1 database and R2 bucket

```bash
wrangler d1 create asset-library
wrangler r2 bucket create asset-library
```

Copy the database ID into `wrangler.toml`.

### 2. Set API token

```bash
wrangler secret put API_TOKEN
# Enter a strong random token when prompted
```

### 3. Run migration

```bash
# Local dev
npm run migrate:local

# Remote
npm run migrate
```

### 4. Dev / Deploy

```bash
# Local development
npm run dev

# Deploy to Cloudflare
npm run deploy
```

### 5. Seed Phosphor icons

```bash
# Point to your icons directory
export ICONS_DIR="/path/to/Website v2.36/public/Icons/phosphor"
export ASSET_API_URL="http://localhost:8787"  # or your deployed URL
export API_TOKEN="your-token-here"

npm run seed
```

### 6. Custom domain (optional)

In Cloudflare dashboard: Workers & Pages → asset-library → Settings → Domains & Routes → Add custom domain → `assets.yourdomain.com`

## API Reference

See `asset-library-schema.md` for full endpoint documentation.

### Quick examples

```bash
# Get an icon (raw SVG)
curl https://assets.yourdomain.com/v1/assets/heart-fill

# Get metadata
curl https://assets.yourdomain.com/v1/assets/heart-fill/meta

# Search by tag
curl "https://assets.yourdomain.com/v1/assets?tag=therapy&type=svg"

# Upload new asset
curl -X POST https://assets.yourdomain.com/v1/assets \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@logo.svg" \
  -F "name=My Logo" \
  -F "slug=my-logo" \
  -F "type=svg" \
  -F "license=proprietary" \
  -F "tags=logo,brand"

# Check integrity
curl -X POST https://assets.yourdomain.com/v1/assets/verify \
  -H "Content-Type: application/json" \
  -d '{"slug":"heart-fill","hash":"sha256:abc..."}'

# Log usage
curl -X POST https://assets.yourdomain.com/v1/usage \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"slug":"heart-fill","consumer":"website-build","context":"component:Badge"}'

# Health check
curl https://assets.yourdomain.com/v1/health
```

## Architecture

```
Client → Cloudflare Edge (Worker)
              ├── D1  (metadata + text assets: SVG, Lottie JSON)
              └── R2  (binary assets: PNG, JPG, ICO, WEBP)
```

- **Text assets** stored directly in D1 `versions.content` column
- **Binary assets** stored in R2, path in D1 `versions.r2_key`
- **Edge caching** via Cache API — read-heavy workloads barely touch D1
- **Versioned** — every update creates an immutable version
- **Content-addressed** — SHA-256 hash deduplication
- **Licensed** — every asset tracks its license terms

## Project Structure

```
src/
  index.ts              ← Router
  types.ts              ← Type definitions
  routes/
    assets.ts           ← CRUD + content serving
    versions.ts         ← Version history + rollback
    tags.ts             ← Tag management
    brands.ts           ← Brand asset slots
    licenses.ts         ← License definitions
    usage.ts            ← Usage logging + orphans
    verify.ts           ← Integrity checking
    bulk.ts             ← Bulk import
  lib/
    id.ts               ← Nanoid generation
    hash.ts             ← SHA-256 hashing
    auth.ts             ← Bearer token auth
    metadata.ts         ← SVG/Lottie metadata extraction
    response.ts         ← Response helpers
  schema/
    migrations/
      001_initial.sql   ← Database schema
scripts/
  seed-phosphor.ts      ← Phosphor icon importer
```
