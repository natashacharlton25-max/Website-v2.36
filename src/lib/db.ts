/**
 * Cloudflare D1 Database Client
 * Database client for user management, downloads, and verification
 */

// Types for our database tables
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string | null;
  tier: 'free' | 'newsletter' | 'subscribed' | 'vip';
  email_verified: number; // SQLite uses 0/1 for boolean
  newsletter_subscribed: number;
  created_at: string;
  updated_at: string;
}

export interface VerificationToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  used: number;
  created_at: string;
}

export interface PendingDownload {
  id: string;
  user_id: string;
  asset_id: string;
  asset_name: string;
  asset_slug: string | null;
  created_at: string;
}

export interface Download {
  id: string;
  user_id: string;
  asset_id: string;
  asset_name: string | null;
  downloaded_at: string;
}

export interface DownloadToken {
  id: string;
  user_id: string;
  asset_id: string;
  token: string;
  expires_at: string;
  used: number;
  created_at: string;
}

// Download limits by tier
export const DOWNLOAD_LIMITS: Record<User['tier'], number> = {
  free: 1,
  newsletter: 10,
  subscribed: 20,
  vip: Infinity
};

// D1 Database type from Cloudflare
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: object;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// Generate a secure random token
export function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const randomValues = new Uint8Array(48);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 48; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  return token;
}

// Generate UUID
function generateId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

// Create or get existing user
export async function createOrGetUser(
  db: D1Database,
  email: string,
  firstName: string,
  lastName: string,
  newsletterSubscribed: boolean
): Promise<{ user: User; isNew: boolean }> {
  const normalizedEmail = email.toLowerCase();

  // Check if user already exists
  const existingUser = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(normalizedEmail)
    .first<User>();

  if (existingUser) {
    // Update newsletter preference if changed
    if ((existingUser.newsletter_subscribed === 1) !== newsletterSubscribed) {
      const newTier = newsletterSubscribed ? 'newsletter' : 'free';
      const updateTier = existingUser.tier === 'free' || existingUser.tier === 'newsletter' ? newTier : existingUser.tier;

      await db
        .prepare('UPDATE users SET newsletter_subscribed = ?, tier = ?, updated_at = datetime("now") WHERE id = ?')
        .bind(newsletterSubscribed ? 1 : 0, updateTier, existingUser.id)
        .run();

      existingUser.newsletter_subscribed = newsletterSubscribed ? 1 : 0;
      if (existingUser.tier === 'free' || existingUser.tier === 'newsletter') {
        existingUser.tier = newTier as User['tier'];
      }
    }
    return { user: existingUser, isNew: false };
  }

  // Create new user
  const id = generateId();
  const tier = newsletterSubscribed ? 'newsletter' : 'free';

  await db
    .prepare(`
      INSERT INTO users (id, email, first_name, last_name, tier, newsletter_subscribed, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `)
    .bind(id, normalizedEmail, firstName, lastName || null, tier, newsletterSubscribed ? 1 : 0)
    .run();

  const newUser = await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<User>();

  if (!newUser) {
    throw new Error('Failed to create user');
  }

  return { user: newUser, isNew: true };
}

// Create verification token
export async function createVerificationToken(db: D1Database, userId: string): Promise<string> {
  const token = generateToken();
  const id = generateId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

  // Invalidate any existing tokens for this user
  await db
    .prepare('UPDATE verification_tokens SET used = 1 WHERE user_id = ? AND used = 0')
    .bind(userId)
    .run();

  // Create new token
  await db
    .prepare('INSERT INTO verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)')
    .bind(id, userId, token, expiresAt)
    .run();

  return token;
}

// Verify token and mark user as verified
export async function verifyToken(
  db: D1Database,
  token: string
): Promise<{ user: User; pendingDownloads: PendingDownload[] } | null> {
  const now = new Date().toISOString();

  // Find valid token
  const tokenData = await db
    .prepare('SELECT * FROM verification_tokens WHERE token = ? AND used = 0 AND expires_at > ?')
    .bind(token, now)
    .first<VerificationToken>();

  if (!tokenData) {
    return null;
  }

  // Mark token as used
  await db
    .prepare('UPDATE verification_tokens SET used = 1 WHERE id = ?')
    .bind(tokenData.id)
    .run();

  // Mark user as verified
  await db
    .prepare('UPDATE users SET email_verified = 1, updated_at = datetime("now") WHERE id = ?')
    .bind(tokenData.user_id)
    .run();

  // Get user
  const user = await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(tokenData.user_id)
    .first<User>();

  if (!user) {
    return null;
  }

  // Get pending downloads
  const pendingResult = await db
    .prepare('SELECT * FROM pending_downloads WHERE user_id = ?')
    .bind(tokenData.user_id)
    .all<PendingDownload>();

  return {
    user: { ...user, email_verified: 1 },
    pendingDownloads: pendingResult.results || []
  };
}

// Add pending downloads for a user
export async function addPendingDownloads(
  db: D1Database,
  userId: string,
  downloads: Array<{ id: string; name: string; slug?: string }>
): Promise<void> {
  // Clear existing pending downloads for this user
  await db
    .prepare('DELETE FROM pending_downloads WHERE user_id = ?')
    .bind(userId)
    .run();

  // Add new pending downloads
  for (const d of downloads) {
    const id = generateId();
    await db
      .prepare('INSERT INTO pending_downloads (id, user_id, asset_id, asset_name, asset_slug) VALUES (?, ?, ?, ?, ?)')
      .bind(id, userId, d.id, d.name, d.slug || null)
      .run();
  }
}

// Get user's download count for current month
export async function getMonthlyDownloadCount(db: D1Database, userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const result = await db
    .prepare('SELECT COUNT(*) as count FROM downloads WHERE user_id = ? AND downloaded_at >= ?')
    .bind(userId, startOfMonth.toISOString())
    .first<{ count: number }>();

  return result?.count || 0;
}

// Check if user can download
export async function canUserDownload(
  db: D1Database,
  user: User
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const limit = DOWNLOAD_LIMITS[user.tier];

  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const count = await getMonthlyDownloadCount(db, user.id);
  const remaining = Math.max(0, limit - count);

  return {
    allowed: remaining > 0,
    remaining,
    limit
  };
}

// Record a download
export async function recordDownload(
  db: D1Database,
  userId: string,
  assetId: string,
  assetName: string
): Promise<void> {
  const id = generateId();
  await db
    .prepare('INSERT INTO downloads (id, user_id, asset_id, asset_name) VALUES (?, ?, ?, ?)')
    .bind(id, userId, assetId, assetName)
    .run();
}

// Create download token
export async function createDownloadToken(
  db: D1Database,
  userId: string,
  assetId: string
): Promise<string> {
  const token = generateToken();
  const id = generateId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  await db
    .prepare('INSERT INTO download_tokens (id, user_id, asset_id, token, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(id, userId, assetId, token, expiresAt)
    .run();

  return token;
}

// Validate and consume download token
export async function validateDownloadToken(
  db: D1Database,
  token: string
): Promise<{ userId: string; assetId: string } | null> {
  const now = new Date().toISOString();

  const tokenData = await db
    .prepare('SELECT * FROM download_tokens WHERE token = ? AND used = 0 AND expires_at > ?')
    .bind(token, now)
    .first<DownloadToken>();

  if (!tokenData) {
    return null;
  }

  // Mark token as used
  await db
    .prepare('UPDATE download_tokens SET used = 1 WHERE id = ?')
    .bind(tokenData.id)
    .run();

  return {
    userId: tokenData.user_id,
    assetId: tokenData.asset_id
  };
}

// Get user by email
export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  return await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email.toLowerCase())
    .first<User>();
}

// Get user by ID
export async function getUserById(db: D1Database, userId: string): Promise<User | null> {
  return await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(userId)
    .first<User>();
}

// Clear pending downloads after they've been sent
export async function clearPendingDownloads(db: D1Database, userId: string): Promise<void> {
  await db
    .prepare('DELETE FROM pending_downloads WHERE user_id = ?')
    .bind(userId)
    .run();
}
