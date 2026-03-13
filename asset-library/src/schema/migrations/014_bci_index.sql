-- 014: BCI reference numbers — W3C AAC Symbol Registry integration
-- Adds bci_index column to alt_symbols for cross-symbol-set resolution.
-- BCI (Blissymbolics Communication International) index numbers are the
-- universal key defined by the W3C AAC Symbol Registry, enabling
-- WAI-Adapt personalization agents to map concepts across symbol sets.
--
-- Note: verified and core_tier columns already exist (added by seed scripts
-- before formal migration). Only bci_index is new.

ALTER TABLE alt_symbols ADD COLUMN bci_index INTEGER;

CREATE INDEX IF NOT EXISTS idx_alt_symbols_bci ON alt_symbols(bci_index);
