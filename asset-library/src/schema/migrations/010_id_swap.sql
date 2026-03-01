-- 010: ID Swap — Atomic migration from a_* IDs to shared_{category}_{slug}_{hash}
-- Run: wrangler d1 execute asset-library --file=./src/schema/migrations/010_id_swap.sql --remote
--
-- Pre-flight checks (run manually before this migration):
--   SELECT COUNT(*) FROM assets WHERE new_id IS NULL;           -- must be 0
--   SELECT COUNT(*) FROM assets a1 JOIN assets a2               -- must be 0
--     ON a1.new_id = a2.id WHERE a1.id != a2.id;
--
-- D1 file execution is implicitly transactional — all statements
-- succeed or the DB rolls back to pre-migration state.

-- Disable FK enforcement for the migration. D1 enables it by default
-- in file imports. Without this, updating FKs before the PK swap
-- would fail (intermediate state: FKs point to new_id values that
-- don't exist as assets.id yet).
PRAGMA foreign_keys = OFF;

-- ─── Step 1: Update all FK references ────────────────────
-- Order matters: update FKs BEFORE changing the PK they reference.

-- versions.asset_id (4,566 rows)
UPDATE versions SET asset_id = (
  SELECT new_id FROM assets WHERE assets.id = versions.asset_id
);

-- asset_tags.asset_id (13,887 rows)
UPDATE asset_tags SET asset_id = (
  SELECT new_id FROM assets WHERE assets.id = asset_tags.asset_id
);

-- lottie_mappings.lottie_asset_id (33 rows)
UPDATE lottie_mappings SET lottie_asset_id = (
  SELECT new_id FROM assets WHERE assets.id = lottie_mappings.lottie_asset_id
);

-- lottie_mappings.static_asset_id (33 rows)
UPDATE lottie_mappings SET static_asset_id = (
  SELECT new_id FROM assets WHERE assets.id = lottie_mappings.static_asset_id
);

-- alt_symbols.icon_id (1,512 non-null rows)
UPDATE alt_symbols SET icon_id = (
  SELECT new_id FROM assets WHERE assets.id = alt_symbols.icon_id
) WHERE icon_id IS NOT NULL;

-- brand_assets.asset_id (0 rows — empty table, but update for correctness)
UPDATE brand_assets SET asset_id = (
  SELECT new_id FROM assets WHERE assets.id = brand_assets.asset_id
) WHERE EXISTS (SELECT 1 FROM assets WHERE assets.id = brand_assets.asset_id);

-- usage_log.asset_id (0 rows — empty table, but update for correctness)
UPDATE usage_log SET asset_id = (
  SELECT new_id FROM assets WHERE assets.id = usage_log.asset_id
) WHERE EXISTS (SELECT 1 FROM assets WHERE assets.id = usage_log.asset_id);

-- ─── Step 2: Swap the primary key ────────────────────────
-- old: a_xxxxxxxxxxxx → new: shared_icon_acorn-fill_a3f8c2
-- No collision possible: old format starts with "a_", new starts with "shared_"
UPDATE assets SET id = new_id;

-- Re-enable FK enforcement
PRAGMA foreign_keys = ON;
