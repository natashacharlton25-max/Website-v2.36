-- 016: Reset bad BCI links + add classification columns to bci_concepts
--
-- The backfill-bci-index.js script used substring matching that produced
-- ~6000 wrong links (cat→caterpillar, siren→siren_of_the_woods,
-- network→social_network/facebook, radioactive→nuclear_fallout, etc).
--
-- This migration:
--   1. Wipes all bci_index/bci_pos from alt_symbols (start clean)
--   2. Adds classification columns to bci_concepts (the source of truth)
--   3. Classification lives on the BCI concept, not on the symbol match
--
-- After this migration, run backfill-bci-clean.js to re-link with
-- exact-match-only rules.

-- ═══════════════════════════════════════════════════
-- STEP 1: Nuke all bad BCI links from alt_symbols
-- ═══════════════════════════════════════════════════

UPDATE alt_symbols SET bci_index = NULL, bci_pos = NULL, verified = 0;

-- ═══════════════════════════════════════════════════
-- STEP 2: Add classification columns to bci_concepts
-- ═══════════════════════════════════════════════════

-- Semantic domain: what category this concept belongs to
-- e.g. animals, food, transport, emotions, body, actions, places, time, social
ALTER TABLE bci_concepts ADD COLUMN semantic_domain TEXT;

-- Concreteness: how visually depictable is this concept?
-- concrete = apple, chair, cat (easy to draw)
-- semi     = help, run, happy (depictable with effort)
-- abstract = the, not, because, equality (nearly impossible to draw)
ALTER TABLE bci_concepts ADD COLUMN concreteness TEXT;

-- Is this a homonym? If so, disambiguation key.
-- e.g. bank(12626) and bank(river sense) share the word but differ.
-- null = no homonym. Otherwise = short disambiguator like "financial" or "river"
ALTER TABLE bci_concepts ADD COLUMN homonym_key TEXT;

-- Deprecated flag — extracted from (OLD) suffix in english glosses
-- 0 = current, 1 = deprecated (has newer replacement)
ALTER TABLE bci_concepts ADD COLUMN deprecated INTEGER DEFAULT 0;

-- If deprecated, the BCI index of the replacement concept (if known)
ALTER TABLE bci_concepts ADD COLUMN replaced_by INTEGER;

-- Primary gloss — the first comma-separated English word, cleaned.
-- Pre-computed so we don't re-parse "eat-(to)" → "eat" everywhere.
ALTER TABLE bci_concepts ADD COLUMN primary_gloss TEXT;

-- Gloss count — how many synonyms in the english field
-- 1 = unambiguous (apple), 5 = very broad (container,bowl,holder,pouch,basket)
ALTER TABLE bci_concepts ADD COLUMN gloss_count INTEGER;

-- AAC usability: should this concept appear in AAC symbol cards?
-- yes    = core AAC concept (apple, help, sad, cat)
-- check  = might be useful depending on context (terminal, video)
-- no     = not AAC material (siren_of_the_woods, modifier_(first_person))
-- ui     = Phosphor icon / UI term, never AAC
ALTER TABLE bci_concepts ADD COLUMN aac_usable TEXT DEFAULT 'check';

-- Which symbol sets have a GOOD match for this concept?
-- Comma-separated: bliss,arasaac,mulberry,sclera,noun_project,tawasol
-- Populated by the set-bias scoring pass, not by blind keyword search.
ALTER TABLE bci_concepts ADD COLUMN good_sets TEXT;

-- Which symbol sets have a KNOWN BAD match (from bias rules)?
-- Comma-separated with reason: mulberry:skull,sclera:support_stockings
ALTER TABLE bci_concepts ADD COLUMN bad_sets TEXT;

-- ═══════════════════════════════════════════════════
-- STEP 3: Indexes for new columns
-- ═══════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_bci_domain ON bci_concepts(semantic_domain);
CREATE INDEX IF NOT EXISTS idx_bci_concrete ON bci_concepts(concreteness);
CREATE INDEX IF NOT EXISTS idx_bci_aac ON bci_concepts(aac_usable);
CREATE INDEX IF NOT EXISTS idx_bci_primary ON bci_concepts(primary_gloss);
CREATE INDEX IF NOT EXISTS idx_bci_deprecated ON bci_concepts(deprecated);
