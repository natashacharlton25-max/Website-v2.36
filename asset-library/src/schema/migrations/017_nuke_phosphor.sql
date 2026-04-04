-- Nuke all Phosphor icons for clean reseed
-- Run: cd asset-library && npx wrangler d1 execute asset-library --remote --file=./src/schema/migrations/017_nuke_phosphor.sql

-- Disable FK checks during cleanup
PRAGMA foreign_keys = OFF;

-- Delete join tables first
DELETE FROM asset_tags WHERE asset_id IN (SELECT id FROM assets WHERE source = 'phosphor');
DELETE FROM usage_log WHERE asset_id IN (SELECT id FROM assets WHERE source = 'phosphor');
DELETE FROM lottie_mappings WHERE lottie_asset_id IN (SELECT id FROM assets WHERE source = 'phosphor');
DELETE FROM lottie_mappings WHERE static_asset_id IN (SELECT id FROM assets WHERE source = 'phosphor');
DELETE FROM brand_assets WHERE asset_id IN (SELECT id FROM assets WHERE source = 'phosphor');

-- Delete versions
DELETE FROM versions WHERE asset_id IN (SELECT id FROM assets WHERE source = 'phosphor');

-- Delete orphaned versions (safety)
DELETE FROM versions WHERE asset_id NOT IN (SELECT id FROM assets);

-- Delete assets
DELETE FROM assets WHERE source = 'phosphor';

-- Re-enable FK checks
PRAGMA foreign_keys = ON;
