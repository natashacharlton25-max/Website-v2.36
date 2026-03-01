-- 012: Alt symbol context overrides — blocks wrong-domain AAC matches
-- Run: wrangler d1 execute asset-library --file=./src/schema/migrations/012_context_overrides.sql --remote

CREATE TABLE alt_symbol_context_overrides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  context_token TEXT NOT NULL,
  block_symbol TEXT,
  prefer_symbol TEXT
);

CREATE INDEX idx_overrides_context_token ON alt_symbol_context_overrides(context_token);

-- Seed: "taxi" symbol is a car/cab — block when context is aviation
INSERT INTO alt_symbol_context_overrides (context_token, block_symbol) VALUES ('aeroplane', 'taxi');
INSERT INTO alt_symbol_context_overrides (context_token, block_symbol) VALUES ('aircraft', 'taxi');
INSERT INTO alt_symbol_context_overrides (context_token, block_symbol) VALUES ('runway', 'taxi');
INSERT INTO alt_symbol_context_overrides (context_token, block_symbol) VALUES ('flight', 'taxi');
INSERT INTO alt_symbol_context_overrides (context_token, block_symbol) VALUES ('pilot', 'taxi');
