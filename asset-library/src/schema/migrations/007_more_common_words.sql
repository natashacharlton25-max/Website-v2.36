-- 007_more_common_words.sql
-- Seed words that SymboTalk returns broken URLs for (spaces in filenames)
-- or wrong pictograms for (e.g. "talk" → "talc"), plus remaining text-only words.
-- All ARASAAC IDs verified via https://api.arasaac.org/v1/pictograms/en/search/{word}

-- Words with broken/wrong SymboTalk results
INSERT OR IGNORE INTO alt_symbols (id, word, icon_id, aac_id, aac_url)
VALUES
  ('sym_cw_alone',   'alone',    NULL,  7253, 'https://static.arasaac.org/pictograms/7253/7253_300.png'),
  ('sym_cw_read',    'read',     NULL,  7141, 'https://static.arasaac.org/pictograms/7141/7141_300.png'),
  ('sym_cw_say',     'say',      NULL,  9693, 'https://static.arasaac.org/pictograms/9693/9693_300.png'),
  ('sym_cw_sell',    'sell',     NULL,  6652, 'https://static.arasaac.org/pictograms/6652/6652_300.png'),
  ('sym_cw_want',    'want',     NULL,  5441, 'https://static.arasaac.org/pictograms/5441/5441_300.png'),
  ('sym_cw_free',    'free',     NULL, 11474, 'https://static.arasaac.org/pictograms/11474/11474_300.png'),
  ('sym_cw_made',    'made',     NULL, 24769, 'https://static.arasaac.org/pictograms/24769/24769_300.png'),
  ('sym_cw_people',  'people',   NULL, 34560, 'https://static.arasaac.org/pictograms/34560/34560_300.png'),
  ('sym_cw_photo',   'photo',    NULL,  7107, 'https://static.arasaac.org/pictograms/7107/7107_300.png'),
  ('sym_cw_photos',  'photos',   NULL,  7107, 'https://static.arasaac.org/pictograms/7107/7107_300.png'),
  ('sym_cw_talk',    'talk',     NULL,  6517, 'https://static.arasaac.org/pictograms/6517/6517_300.png'),
  ('sym_cw_selling', 'selling',  NULL,  6652, 'https://static.arasaac.org/pictograms/6652/6652_300.png'),
  ('sym_cw_talking', 'talking',  NULL,  6517, 'https://static.arasaac.org/pictograms/6517/6517_300.png');

-- Words that were text-only (SymboTalk 500 errors, not in previous seed)
INSERT OR IGNORE INTO alt_symbols (id, word, icon_id, aac_id, aac_url)
VALUES
  ('sym_cw_same',     'same',     NULL,  4667, 'https://static.arasaac.org/pictograms/4667/4667_300.png'),
  ('sym_cw_way',      'way',      NULL,  6968, 'https://static.arasaac.org/pictograms/6968/6968_300.png'),
  ('sym_cw_everyone', 'everyone', NULL, 36081, 'https://static.arasaac.org/pictograms/36081/36081_300.png'),
  ('sym_cw_rules',    'rules',    NULL, 34779, 'https://static.arasaac.org/pictograms/34779/34779_300.png'),
  ('sym_cw_this',     'this',     NULL,  7179, 'https://static.arasaac.org/pictograms/7179/7179_300.png'),
  ('sym_cw_before',   'before',   NULL, 32745, 'https://static.arasaac.org/pictograms/32745/32745_300.png'),
  ('sym_cw_here',     'here',     NULL,  5382, 'https://static.arasaac.org/pictograms/5382/5382_300.png');
