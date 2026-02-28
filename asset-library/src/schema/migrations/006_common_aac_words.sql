-- 006_common_aac_words.sql
-- Seed 20 common English function words into alt_symbols with ARASAAC pictogram URLs.
-- These words cause SymboTalk 500 errors but have valid ARASAAC pictograms.
-- No icon_id — these are function words with no Phosphor equivalent.

INSERT OR IGNORE INTO alt_symbols (id, word, icon_id, aac_id, aac_url)
VALUES
  ('sym_cw_the',   'the',   NULL, 38272, 'https://static.arasaac.org/pictograms/38272/38272_300.png'),
  ('sym_cw_you',   'you',   NULL,  6625, 'https://static.arasaac.org/pictograms/6625/6625_300.png'),
  ('sym_cw_we',    'we',    NULL,  7185, 'https://static.arasaac.org/pictograms/7185/7185_300.png'),
  ('sym_cw_use',   'use',   NULL, 15485, 'https://static.arasaac.org/pictograms/15485/15485_300.png'),
  ('sym_cw_for',   'for',   NULL,  8649, 'https://static.arasaac.org/pictograms/8649/8649_300.png'),
  ('sym_cw_from',  'from',  NULL,  7077, 'https://static.arasaac.org/pictograms/7077/7077_300.png'),
  ('sym_cw_who',   'who',   NULL,  9853, 'https://static.arasaac.org/pictograms/9853/9853_300.png'),
  ('sym_cw_what',  'what',  NULL, 22620, 'https://static.arasaac.org/pictograms/22620/22620_300.png'),
  ('sym_cw_where', 'where', NULL,  7764, 'https://static.arasaac.org/pictograms/7764/7764_300.png'),
  ('sym_cw_but',   'but',   NULL, 11377, 'https://static.arasaac.org/pictograms/11377/11377_300.png'),
  ('sym_cw_no',    'no',    NULL,  5526, 'https://static.arasaac.org/pictograms/5526/5526_300.png'),
  ('sym_cw_not',   'not',   NULL, 11595, 'https://static.arasaac.org/pictograms/11595/11595_300.png'),
  ('sym_cw_do',    'do',    NULL, 32751, 'https://static.arasaac.org/pictograms/32751/32751_300.png'),
  ('sym_cw_it',    'it',    NULL,  7075, 'https://static.arasaac.org/pictograms/7075/7075_300.png'),
  ('sym_cw_us',    'us',    NULL,  7185, 'https://static.arasaac.org/pictograms/7185/7185_300.png'),
  ('sym_cw_yes',   'yes',   NULL,  5584, 'https://static.arasaac.org/pictograms/5584/5584_300.png'),
  ('sym_cw_how',   'how',   NULL, 22619, 'https://static.arasaac.org/pictograms/22619/22619_300.png'),
  ('sym_cw_your',  'your',  NULL, 12281, 'https://static.arasaac.org/pictograms/12281/12281_300.png'),
  ('sym_cw_can',   'can',   NULL,  7180, 'https://static.arasaac.org/pictograms/7180/7180_300.png'),
  ('sym_cw_my',    'my',    NULL, 12264, 'https://static.arasaac.org/pictograms/12264/12264_300.png');
