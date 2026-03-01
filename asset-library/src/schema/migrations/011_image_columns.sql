-- 011: Image columns for R2 pipeline
-- Run: wrangler d1 execute asset-library --file=./src/schema/migrations/011_image_columns.sql --remote
-- Already applied inline — this file is for the record.

ALTER TABLE assets ADD COLUMN url TEXT;
ALTER TABLE assets ADD COLUMN mime_type TEXT;
ALTER TABLE assets ADD COLUMN width INTEGER;
ALTER TABLE assets ADD COLUMN height INTEGER;
ALTER TABLE assets ADD COLUMN file_size INTEGER;
