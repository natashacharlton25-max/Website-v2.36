-- =========================================================
-- WALKING WITH A SMILE - D1 DATABASE SCHEMA (SQLite)
-- Run with: npx wrangler d1 execute wwas-database --file=./d1/schema.sql
-- =========================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'newsletter', 'subscribed', 'vip')),
  email_verified INTEGER DEFAULT 0,
  newsletter_subscribed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Verification tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);

-- Pending downloads table
CREATE TABLE IF NOT EXISTS pending_downloads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  asset_slug TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pending_downloads_user ON pending_downloads(user_id);

-- Downloads table (for tracking/rate limiting)
CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL,
  asset_name TEXT,
  downloaded_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_downloads_user_date ON downloads(user_id, downloaded_at);

-- Download tokens table
CREATE TABLE IF NOT EXISTS download_tokens (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_download_tokens_token ON download_tokens(token);
