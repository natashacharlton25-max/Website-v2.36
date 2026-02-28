-- 005b: Populate license attribution, summary, aac_summary data
-- Columns added in 005_license_columns.sql

-- ── Update existing licenses ────────────────────────────────

UPDATE licenses SET
  attribution = 'Phosphor Icons (phosphoricons.com) by Phosphor Contributors, MIT License',
  summary = 'These icons are free to use, share, and change for any purpose, including commercial projects. You just need to include a note saying where they came from.',
  aac_summary = 'pictures free. use yes. share yes. say thank you.'
  WHERE key = 'mit';

UPDATE licenses SET
  attribution = 'AI-generated images created via Recraft API (recraft.ai)',
  summary = 'These images were created by artificial intelligence using the Recraft tool. They can be used in our projects, but if you want to use them elsewhere, please check the current terms at recraft.ai/terms as they may change.',
  aac_summary = 'computer made picture. use here yes. use somewhere else ask first.'
  WHERE key = 'recraft';

UPDATE licenses SET
  attribution = 'Original work. All rights reserved.',
  summary = 'This was created by us. We own it and decide how it can be used. Please ask before using it elsewhere.',
  aac_summary = 'we made this. ask us before you use it.'
  WHERE key = 'proprietary';

UPDATE licenses SET
  attribution = 'Public domain. No rights reserved.',
  summary = 'This is completely free. Anyone can use it for anything, no permission needed, no credit required.',
  aac_summary = 'free for everyone. do what you want.'
  WHERE key = 'cc0';

UPDATE licenses SET
  attribution = 'See individual asset for license terms.',
  summary = 'This has its own specific rules. Check the link provided with the item to understand how you can use it.',
  aac_summary = 'different rules. read the link.'
  WHERE key = 'custom';

-- ── New licenses ────────────────────────────────────────────

INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes, attribution, summary, aac_summary) VALUES
  ('cc-by-nc-sa', 'Creative Commons BY-NC-SA 3.0',
   'https://creativecommons.org/licenses/by-nc-sa/3.0/',
   '["modification","distribution"]',
   '["attribution","non-commercial","share-alike"]',
   'ARASAAC AAC pictographic symbols. Non-commercial use only. Must share derivatives under same license.',
   'Pictographic symbols property of the Government of Aragón, created by Sergio Palao for ARASAAC (arasaac.org), distributed under Creative Commons License BY-NC-SA',
   'These communication symbols help people who find it difficult to speak or read. They are free to use on websites and in non-commercial projects. You must say where they came from, you cannot sell them, and if you create something new using them, it must be shared under the same free terms.',
   'talking pictures free. help people talk. not for selling. say where from. share same way.');

INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes, attribution, summary, aac_summary) VALUES
  ('unsplash', 'Unsplash License',
   'https://unsplash.com/license',
   '["commercial","modification","distribution"]',
   '[]',
   'Free to use. Cannot sell unaltered copies. Cannot compile for competing service.',
   'Photos from Unsplash (unsplash.com). Free to use under the Unsplash License.',
   'These photos are free to use for any purpose including commercial projects. You do not need to credit the photographer, but it is appreciated. You cannot sell the photos on their own without changing them, and you cannot use them to create a competing photo service.',
   'photos free. use yes. sell photo alone no.');

INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes, attribution, summary, aac_summary) VALUES
  ('cc-by', 'Creative Commons BY 4.0',
   'https://creativecommons.org/licenses/by/4.0/',
   '["commercial","modification","distribution"]',
   '["attribution"]',
   'Free for any use with attribution.',
   'Licensed under Creative Commons Attribution 4.0 International.',
   'This is free to use for any purpose, including commercial projects. The only requirement is that you say where it came from and who created it.',
   'free. use yes. say who made it.');

INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes, attribution, summary, aac_summary) VALUES
  ('cc-by-sa', 'Creative Commons BY-SA 4.0',
   'https://creativecommons.org/licenses/by-sa/4.0/',
   '["commercial","modification","distribution"]',
   '["attribution","share-alike"]',
   'Free for any use with attribution. Derivatives must use same license.',
   'Licensed under Creative Commons Attribution-ShareAlike 4.0 International.',
   'This is free to use and change, even for commercial projects. You must say where it came from, and if you create something new using it, your creation must also be shared under these same free terms.',
   'free. use yes. change yes. say who made it. share same way.');

INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes, attribution, summary, aac_summary) VALUES
  ('cc-by-nc', 'Creative Commons BY-NC 4.0',
   'https://creativecommons.org/licenses/by-nc/4.0/',
   '["modification","distribution"]',
   '["attribution","non-commercial"]',
   'Non-commercial use with attribution.',
   'Licensed under Creative Commons Attribution-NonCommercial 4.0 International.',
   'This is free to use and change, but only for non-commercial purposes. You must say where it came from. You cannot use it in something you are selling.',
   'free but not for selling. say who made it.');

INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes, attribution, summary, aac_summary) VALUES
  ('ofl', 'SIL Open Font License 1.1',
   'https://scripts.sil.org/OFL',
   '["commercial","modification","distribution"]',
   '["attribution","bundle-only"]',
   'Google Fonts and other open fonts. Can use freely, cannot sell fonts alone.',
   'Fonts licensed under the SIL Open Font License 1.1.',
   'These fonts are free to use on any website or project, including commercial ones. You can change them if you need to. The only restriction is you cannot sell the font files on their own.',
   'writing styles free. use yes. sell the font alone no.');

INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes, attribution, summary, aac_summary) VALUES
  ('apache-2', 'Apache License 2.0',
   'https://www.apache.org/licenses/LICENSE-2.0',
   '["commercial","modification","distribution"]',
   '["attribution","state-changes"]',
   'Free for any use. Must include license and state changes.',
   'Licensed under the Apache License, Version 2.0.',
   'This is free to use for any purpose. If you change it, you need to note what you changed. You must include a copy of the license when sharing it.',
   'free. use yes. change yes. say what you changed.');

INSERT OR IGNORE INTO licenses (key, name, url, permits, requires, notes, attribution, summary, aac_summary) VALUES
  ('isc', 'ISC License',
   'https://opensource.org/licenses/ISC',
   '["commercial","modification","distribution"]',
   '["attribution"]',
   'Simplified BSD-style license. Free for any use.',
   'Licensed under the ISC License.',
   'This is free to use for any purpose. Just include a note saying where it came from.',
   'free. use yes. say where from.');
