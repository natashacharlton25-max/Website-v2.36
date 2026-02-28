-- 005: Add attribution, summary, aac_summary columns to licenses table
ALTER TABLE licenses ADD COLUMN attribution TEXT DEFAULT '';
ALTER TABLE licenses ADD COLUMN summary TEXT DEFAULT '';
ALTER TABLE licenses ADD COLUMN aac_summary TEXT DEFAULT '';
