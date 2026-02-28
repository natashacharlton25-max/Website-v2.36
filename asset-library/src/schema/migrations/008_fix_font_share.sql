-- 008_fix_font_share.sql
-- Seed "font" (missing from alt_symbols) and fix "share" (aac_url was string "null")

INSERT OR IGNORE INTO alt_symbols (id, word, icon_id, aac_id, aac_url)
VALUES
  ('sym_cw_font', 'font', NULL, 30834, 'https://static.arasaac.org/pictograms/30834/30834_300.png');

UPDATE alt_symbols
SET aac_id = 38900,
    aac_url = 'https://static.arasaac.org/pictograms/38900/38900_300.png',
    updated_at = datetime('now')
WHERE word = 'share';
