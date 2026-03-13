-- 015: BCI concept master table — full W3C AAC Symbol Registry data
-- Stores the complete Blissymbolics vocabulary with multilingual glosses.
-- Source: BCI-AV 2025-02-15 official CSV (8483–29642).
--
-- This table is the universal concept key for cross-symbol-set resolution.
-- Any symbol set (Bliss, ARASAAC, Widgit, PCS, Makaton, custom) maps
-- to concepts via bci_index. The Bliss symbol itself resolves via URL:
--   https://www.blissymbolics.net/refnumber/{bci_index}
--
-- Multilingual glosses enable the AacCard word label to display in the
-- user's language preference — no separate translation system needed.

CREATE TABLE IF NOT EXISTS bci_concepts (
  bci_index     INTEGER PRIMARY KEY,
  english       TEXT NOT NULL,
  pos           TEXT,
  derivation    TEXT,
  swedish       TEXT,
  norwegian     TEXT,
  finnish       TEXT,
  hungarian     TEXT,
  german        TEXT,
  dutch         TEXT,
  afrikaans     TEXT,
  russian       TEXT,
  icelandic     TEXT,
  lithuanian    TEXT,
  latvian       TEXT,
  polish        TEXT,
  french        TEXT,
  spanish       TEXT,
  portuguese    TEXT,
  italian       TEXT,
  danish        TEXT
);

CREATE INDEX IF NOT EXISTS idx_bci_english ON bci_concepts(english);
CREATE INDEX IF NOT EXISTS idx_bci_pos ON bci_concepts(pos);
