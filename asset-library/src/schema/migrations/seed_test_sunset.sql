-- Test seed: sunset image with alt text data
-- Run: wrangler d1 execute asset-library --local --file=./src/schema/migrations/seed_test_sunset.sql

-- 1. Alt symbol (no FK dependencies)
INSERT OR IGNORE INTO alt_symbols (id, word, icon_id, aac_id, aac_url, created_at, updated_at)
VALUES ('sym_test_sunset', 'sunset', NULL, NULL, NULL, datetime('now'), datetime('now'));

-- 2. Asset first (current_version will be updated after version row exists)
INSERT OR IGNORE INTO assets (id, name, slug, type, storage, current_version, source, license, base_name, alt_symbol_id, alt_descriptive, created_at, updated_at, archived)
VALUES ('a_test_sunset', 'test-sunset', 'test-sunset', 'image', 'text', 'v_placeholder', 'manual', 'cc0', 'test-sunset', 'sym_test_sunset', 'A golden sunset reflecting over calm ocean waters', datetime('now'), datetime('now'), 0);

-- 3. Version (now asset_id FK is satisfied)
INSERT OR IGNORE INTO versions (id, asset_id, version_number, hash, content, r2_key, file_size, mime_type, created_at, created_by)
VALUES ('v_test_sunset_1', 'a_test_sunset', 1, 'test-hash-sunset-001', 'placeholder', NULL, 11, 'image/jpeg', datetime('now'), 'system');

-- 4. Update asset to point to real version
UPDATE assets SET current_version = 'v_test_sunset_1' WHERE id = 'a_test_sunset';
