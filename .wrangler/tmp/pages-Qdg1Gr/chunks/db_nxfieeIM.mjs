globalThis.process ??= {}; globalThis.process.env ??= {};
const DOWNLOAD_LIMITS = {
  free: 1,
  newsletter: 10,
  subscribed: 20,
  vip: Infinity
};
function generateToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  const randomValues = new Uint8Array(48);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 48; i++) {
    token += chars[randomValues[i] % chars.length];
  }
  return token;
}
function generateId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
async function createOrGetUser(db, email, firstName, lastName, newsletterSubscribed) {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await db.prepare("SELECT * FROM users WHERE email = ?").bind(normalizedEmail).first();
  if (existingUser) {
    if (existingUser.newsletter_subscribed === 1 !== newsletterSubscribed) {
      const newTier = newsletterSubscribed ? "newsletter" : "free";
      const updateTier = existingUser.tier === "free" || existingUser.tier === "newsletter" ? newTier : existingUser.tier;
      await db.prepare('UPDATE users SET newsletter_subscribed = ?, tier = ?, updated_at = datetime("now") WHERE id = ?').bind(newsletterSubscribed ? 1 : 0, updateTier, existingUser.id).run();
      existingUser.newsletter_subscribed = newsletterSubscribed ? 1 : 0;
      if (existingUser.tier === "free" || existingUser.tier === "newsletter") {
        existingUser.tier = newTier;
      }
    }
    return { user: existingUser, isNew: false };
  }
  const id = generateId();
  const tier = newsletterSubscribed ? "newsletter" : "free";
  await db.prepare(`
      INSERT INTO users (id, email, first_name, last_name, tier, newsletter_subscribed, email_verified)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `).bind(id, normalizedEmail, firstName, lastName || null, tier, newsletterSubscribed ? 1 : 0).run();
  const newUser = await db.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
  if (!newUser) {
    throw new Error("Failed to create user");
  }
  return { user: newUser, isNew: true };
}
async function createVerificationToken(db, userId) {
  const token = generateToken();
  const id = generateId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
  await db.prepare("UPDATE verification_tokens SET used = 1 WHERE user_id = ? AND used = 0").bind(userId).run();
  await db.prepare("INSERT INTO verification_tokens (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)").bind(id, userId, token, expiresAt).run();
  return token;
}
async function verifyToken(db, token) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const tokenData = await db.prepare("SELECT * FROM verification_tokens WHERE token = ? AND used = 0 AND expires_at > ?").bind(token, now).first();
  if (!tokenData) {
    return null;
  }
  await db.prepare("UPDATE verification_tokens SET used = 1 WHERE id = ?").bind(tokenData.id).run();
  await db.prepare('UPDATE users SET email_verified = 1, updated_at = datetime("now") WHERE id = ?').bind(tokenData.user_id).run();
  const user = await db.prepare("SELECT * FROM users WHERE id = ?").bind(tokenData.user_id).first();
  if (!user) {
    return null;
  }
  const pendingResult = await db.prepare("SELECT * FROM pending_downloads WHERE user_id = ?").bind(tokenData.user_id).all();
  return {
    user: { ...user, email_verified: 1 },
    pendingDownloads: pendingResult.results || []
  };
}
async function addPendingDownloads(db, userId, downloads) {
  await db.prepare("DELETE FROM pending_downloads WHERE user_id = ?").bind(userId).run();
  for (const d of downloads) {
    const id = generateId();
    await db.prepare("INSERT INTO pending_downloads (id, user_id, asset_id, asset_name, asset_slug) VALUES (?, ?, ?, ?, ?)").bind(id, userId, d.id, d.name, d.slug || null).run();
  }
}
async function getMonthlyDownloadCount(db, userId) {
  const startOfMonth = /* @__PURE__ */ new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const result = await db.prepare("SELECT COUNT(*) as count FROM downloads WHERE user_id = ? AND downloaded_at >= ?").bind(userId, startOfMonth.toISOString()).first();
  return result?.count || 0;
}
async function canUserDownload(db, user) {
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
async function recordDownload(db, userId, assetId, assetName) {
  const id = generateId();
  await db.prepare("INSERT INTO downloads (id, user_id, asset_id, asset_name) VALUES (?, ?, ?, ?)").bind(id, userId, assetId, assetName).run();
}
async function createDownloadToken(db, userId, assetId) {
  const token = generateToken();
  const id = generateId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString();
  await db.prepare("INSERT INTO download_tokens (id, user_id, asset_id, token, expires_at) VALUES (?, ?, ?, ?, ?)").bind(id, userId, assetId, token, expiresAt).run();
  return token;
}
async function validateDownloadToken(db, token) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const tokenData = await db.prepare("SELECT * FROM download_tokens WHERE token = ? AND used = 0 AND expires_at > ?").bind(token, now).first();
  if (!tokenData) {
    return null;
  }
  await db.prepare("UPDATE download_tokens SET used = 1 WHERE id = ?").bind(tokenData.id).run();
  return {
    userId: tokenData.user_id,
    assetId: tokenData.asset_id
  };
}
async function clearPendingDownloads(db, userId) {
  await db.prepare("DELETE FROM pending_downloads WHERE user_id = ?").bind(userId).run();
}

export { canUserDownload as a, createDownloadToken as b, createOrGetUser as c, addPendingDownloads as d, createVerificationToken as e, verifyToken as f, clearPendingDownloads as g, recordDownload as r, validateDownloadToken as v };
