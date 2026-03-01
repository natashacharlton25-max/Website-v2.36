-- 009: Universal Asset Identity — Phase 3a columns
-- Run: wrangler d1 execute asset-library --file=./src/schema/migrations/009_universal_identity.sql

-- ─── Assets: identity + classification columns ───────────
ALTER TABLE assets ADD COLUMN file_hash TEXT;
ALTER TABLE assets ADD COLUMN version INTEGER DEFAULT 1;
ALTER TABLE assets ADD COLUMN category TEXT;
ALTER TABLE assets ADD COLUMN brand TEXT;
ALTER TABLE assets ADD COLUMN semantic_role TEXT DEFAULT 'ui-control';
ALTER TABLE assets ADD COLUMN new_id TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assets_new_id ON assets(new_id);
CREATE INDEX IF NOT EXISTS idx_assets_brand ON assets(brand);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_semantic_role ON assets(semantic_role);

-- ─── Alt Symbols: verification flag ──────────────────────
ALTER TABLE alt_symbols ADD COLUMN verified INTEGER DEFAULT 0;
