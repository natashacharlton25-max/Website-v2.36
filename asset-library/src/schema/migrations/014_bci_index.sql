-- 014: BCI reference numbers — W3C AAC Symbol Registry integration
-- Adds bci_index column to alt_symbols for cross-symbol-set resolution.
-- BCI (Blissymbolics Communication International) index numbers are the
-- universal key defined by the W3C AAC Symbol Registry, enabling
-- WAI-Adapt personalization agents to map concepts across symbol sets.
--
-- Also adds verified and core_tier columns that were previously only
-- in snapshot JSON (added by seed scripts) but missing from the schema.

ALTER TABLE alt_symbols ADD COLUMN bci_index INTEGER;
ALTER TABLE alt_symbols ADD COLUMN verified INTEGER DEFAULT 0;
ALTER TABLE alt_symbols ADD COLUMN core_tier TEXT;

CREATE INDEX IF NOT EXISTS idx_alt_symbols_bci ON alt_symbols(bci_index);
