-- 002: Add base_name column for multi-brand weight resolution
-- Run: wrangler d1 execute asset-library --local --file=./src/schema/migrations/002_base_name.sql
--
-- base_name strips the weight suffix from the slug:
--   heart-fill     → heart
--   heart-duotone  → heart
--   heart-regular  → heart
--   arrow-right-fill → arrow-right
--
-- Enables: GET /v1/assets?base_name=heart → returns all weight variants
-- Brand config picks the weight, Icon.astro resolves name + weight → slug

ALTER TABLE assets ADD COLUMN base_name TEXT;

CREATE INDEX idx_assets_base_name ON assets(base_name);

-- Backfill: strip known weight suffixes from slug
UPDATE assets SET base_name =
  CASE
    WHEN slug LIKE '%-fill'     THEN SUBSTR(slug, 1, LENGTH(slug) - 5)
    WHEN slug LIKE '%-duotone'  THEN SUBSTR(slug, 1, LENGTH(slug) - 8)
    WHEN slug LIKE '%-regular'  THEN SUBSTR(slug, 1, LENGTH(slug) - 8)
    WHEN slug LIKE '%-bold'     THEN SUBSTR(slug, 1, LENGTH(slug) - 5)
    WHEN slug LIKE '%-thin'     THEN SUBSTR(slug, 1, LENGTH(slug) - 5)
    WHEN slug LIKE '%-light'    THEN SUBSTR(slug, 1, LENGTH(slug) - 6)
    ELSE slug
  END
WHERE base_name IS NULL;
