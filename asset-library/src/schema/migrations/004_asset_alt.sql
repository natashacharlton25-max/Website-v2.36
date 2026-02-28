-- 004: Alt text system — symbols table + asset columns
-- Adds alt_symbols table for AAC symbol mapping, and alt text columns to assets.

-- Alt symbols table
CREATE TABLE IF NOT EXISTS alt_symbols (
  id          TEXT PRIMARY KEY,
  word        TEXT NOT NULL,
  icon_id     TEXT,
  aac_id      INTEGER,
  aac_url     TEXT,
  created_at  TEXT DEFAULT (datetime('now')),
  updated_at  TEXT DEFAULT (datetime('now'))
);

-- New columns on assets
ALTER TABLE assets ADD COLUMN alt_symbol_id TEXT;
ALTER TABLE assets ADD COLUMN alt_descriptive TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_alt_symbols_word ON alt_symbols(word);
CREATE INDEX IF NOT EXISTS idx_assets_alt_symbol_id ON assets(alt_symbol_id);
