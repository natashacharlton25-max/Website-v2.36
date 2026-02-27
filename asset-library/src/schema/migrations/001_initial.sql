-- Asset Library — Initial Migration
-- Run: wrangler d1 execute asset-library --file=./src/schema/migrations/001_initial.sql

-- ─── Assets ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assets (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  type            TEXT NOT NULL,
  storage         TEXT NOT NULL,
  current_version TEXT NOT NULL,
  source          TEXT NOT NULL DEFAULT 'manual',
  license         TEXT NOT NULL DEFAULT 'unknown',
  license_url     TEXT,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  archived        INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_assets_slug ON assets(slug);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_source ON assets(source);
CREATE INDEX IF NOT EXISTS idx_assets_license ON assets(license);
CREATE INDEX IF NOT EXISTS idx_assets_archived ON assets(archived);

-- ─── Versions ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS versions (
  id              TEXT PRIMARY KEY,
  asset_id        TEXT NOT NULL,
  version_number  INTEGER NOT NULL,
  hash            TEXT NOT NULL,
  content         TEXT,
  r2_key          TEXT,
  file_size       INTEGER NOT NULL,
  mime_type       TEXT NOT NULL,
  metadata        TEXT,
  created_at      TEXT NOT NULL,
  created_by      TEXT NOT NULL DEFAULT 'system',

  FOREIGN KEY (asset_id) REFERENCES assets(id),
  UNIQUE(asset_id, version_number),
  UNIQUE(hash)
);

CREATE INDEX IF NOT EXISTS idx_versions_asset ON versions(asset_id);
CREATE INDEX IF NOT EXISTS idx_versions_hash ON versions(hash);

-- ─── Tags ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tags (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,
  type  TEXT NOT NULL DEFAULT 'general'
);

CREATE INDEX IF NOT EXISTS idx_tags_type ON tags(type);

-- ─── Asset ↔ Tag join ───────────────────────────────────
CREATE TABLE IF NOT EXISTS asset_tags (
  asset_id TEXT NOT NULL,
  tag_id   TEXT NOT NULL,
  PRIMARY KEY (asset_id, tag_id),
  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE INDEX IF NOT EXISTS idx_asset_tags_tag ON asset_tags(tag_id);

-- ─── Lottie ↔ Static fallback ───────────────────────────
CREATE TABLE IF NOT EXISTS lottie_mappings (
  lottie_asset_id  TEXT NOT NULL,
  static_asset_id  TEXT NOT NULL,
  PRIMARY KEY (lottie_asset_id),
  FOREIGN KEY (lottie_asset_id) REFERENCES assets(id),
  FOREIGN KEY (static_asset_id) REFERENCES assets(id)
);

-- ─── Brand asset slots ──────────────────────────────────
CREATE TABLE IF NOT EXISTS brand_assets (
  brand       TEXT NOT NULL,
  asset_id    TEXT NOT NULL,
  role        TEXT NOT NULL,
  PRIMARY KEY (brand, role),
  FOREIGN KEY (asset_id) REFERENCES assets(id)
);

-- ─── Licenses ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS licenses (
  key         TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  url         TEXT,
  permits     TEXT NOT NULL,
  requires    TEXT NOT NULL DEFAULT '[]',
  notes       TEXT
);

-- ─── Usage log ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage_log (
  id          TEXT PRIMARY KEY,
  asset_id    TEXT NOT NULL,
  version_id  TEXT NOT NULL,
  consumer    TEXT NOT NULL,
  context     TEXT,
  brand       TEXT,
  action      TEXT NOT NULL DEFAULT 'render',
  created_at  TEXT NOT NULL,

  FOREIGN KEY (asset_id) REFERENCES assets(id),
  FOREIGN KEY (version_id) REFERENCES versions(id)
);

CREATE INDEX IF NOT EXISTS idx_usage_asset ON usage_log(asset_id);
CREATE INDEX IF NOT EXISTS idx_usage_consumer ON usage_log(consumer);
CREATE INDEX IF NOT EXISTS idx_usage_brand ON usage_log(brand);
CREATE INDEX IF NOT EXISTS idx_usage_created ON usage_log(created_at);

-- ─── Seed: Licenses ─────────────────────────────────────
INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes) VALUES
  ('mit', 'MIT License', 'https://opensource.org/licenses/MIT',
   '["commercial","modification","distribution"]', '["attribution"]',
   'Phosphor icons. Free for any use with attribution.'),
  ('recraft', 'Recraft AI License', 'https://www.recraft.ai/terms',
   '["commercial","modification"]', '["attribution","check-terms"]',
   'AI-generated assets. Check current terms before redistribution.'),
  ('proprietary', 'Proprietary', NULL,
   '["all"]', '[]',
   'Own original work. Full rights retained.'),
  ('cc0', 'CC0 Public Domain', 'https://creativecommons.org/publicdomain/zero/1.0/',
   '["commercial","modification","distribution"]', '[]',
   'No rights reserved. Use for anything.'),
  ('custom', 'Custom License', NULL,
   '["varies"]', '["see-license-url"]',
   'Check license_url on individual asset for terms.');
