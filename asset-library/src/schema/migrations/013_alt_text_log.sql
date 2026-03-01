-- 013: Alt text audit log — tracks every change to alt text fields
-- Run: wrangler d1 execute asset-library --file=./src/schema/migrations/013_alt_text_log.sql --remote

CREATE TABLE IF NOT EXISTS alt_text_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id TEXT NOT NULL,
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT NOT NULL,
  changed_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_alt_text_log_asset ON alt_text_log(asset_id);
CREATE INDEX idx_alt_text_log_field ON alt_text_log(field);

-- field values: 'alt_descriptive' | 'alt_aac_phrase' | 'alt_word' | 'alt_symbol_id' | 'semantic_role'
