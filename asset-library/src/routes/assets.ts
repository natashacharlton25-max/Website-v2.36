/**
 * Asset routes — CRUD for assets + content serving.
 */

import type { Env, AssetRow, VersionRow } from '../types';
import { TEXT_TYPES, MIME_TYPES } from '../types';
import { makeId } from '../lib/id';
import { hashContent } from '../lib/hash';
import { requireAuth } from '../lib/auth';
import { extractMetadata } from '../lib/metadata';
import { json, jsonError, content, notFound, notModified } from '../lib/response';

// ─── Weight suffixes for base_name computation ────────

const WEIGHT_SUFFIXES = ['-fill', '-duotone', '-regular', '-bold', '-thin', '-light'];

function computeBaseName(slug: string): string {
  for (const suffix of WEIGHT_SUFFIXES) {
    if (slug.endsWith(suffix)) return slug.slice(0, -suffix.length);
  }
  return slug;
}

// ─── Helpers ──────────────────────────────────────────

async function getAssetBySlug(db: D1Database, slug: string): Promise<AssetRow | null> {
  return db.prepare('SELECT * FROM assets WHERE slug = ? AND archived = 0')
    .bind(slug).first<AssetRow>();
}

async function getCurrentVersion(db: D1Database, versionId: string): Promise<VersionRow | null> {
  return db.prepare('SELECT * FROM versions WHERE id = ?')
    .bind(versionId).first<VersionRow>();
}

async function getAssetTags(db: D1Database, assetId: string): Promise<string[]> {
  const { results } = await db.prepare(
    'SELECT t.name FROM tags t JOIN asset_tags at ON t.id = at.tag_id WHERE at.asset_id = ?'
  ).bind(assetId).all<{ name: string }>();
  return results.map(r => r.name);
}

async function getLicenseInfo(db: D1Database, licenseKey: string) {
  return db.prepare('SELECT * FROM licenses WHERE key = ?')
    .bind(licenseKey).first();
}

function buildMetaResponse(asset: AssetRow, version: VersionRow, tags: string[], license: any, usageCount?: number, fallbackIconSlug?: string | null) {
  return {
    id: asset.id,
    name: asset.name,
    slug: asset.slug,
    baseName: asset.base_name,
    type: asset.type,
    source: asset.source,
    license: license ? {
      key: license.key,
      name: license.name,
      permits: JSON.parse(license.permits),
      requires: JSON.parse(license.requires),
    } : { key: asset.license },
    currentVersion: {
      id: version.id,
      number: version.version_number,
      hash: version.hash,
      fileSize: version.file_size,
      mimeType: version.mime_type,
      metadata: version.metadata ? JSON.parse(version.metadata) : null,
      createdAt: version.created_at,
    },
    tags,
    ...(usageCount !== undefined ? { usageCount } : {}),
    ...(fallbackIconSlug ? { fallbackIcon: fallbackIconSlug } : {}),
    altSymbolId: asset.alt_symbol_id ?? null,
    altDescriptive: asset.alt_descriptive ?? null,
    altAacPhrase: asset.alt_aac_phrase ?? null,
    createdAt: asset.created_at,
    updatedAt: asset.updated_at,
  };
}

// ─── GET /v1/assets/:slug ─────────────────────────────

export async function handleAssetGet(request: Request, env: Env, slug: string): Promise<Response> {
  const url = new URL(request.url);
  const format = url.searchParams.get('format');
  const vParam = url.searchParams.get('v');

  let asset = await getAssetBySlug(env.DB, slug);

  // Flat fallback: if heart-fill-flat not found, try heart-fill
  // (some flat SVGs are byte-identical to standard and were deduped during seed)
  if (!asset && slug.endsWith('-flat')) {
    asset = await getAssetBySlug(env.DB, slug.slice(0, -5));
  }

  if (!asset) return notFound(`Asset not found: ${slug}`);

  // Resolve version
  let version: VersionRow | null;
  if (vParam) {
    version = await env.DB.prepare(
      'SELECT * FROM versions WHERE asset_id = ? AND version_number = ?'
    ).bind(asset.id, parseInt(vParam, 10)).first<VersionRow>();
    if (!version) return notFound(`Version ${vParam} not found for ${slug}`);
  } else {
    version = await getCurrentVersion(env.DB, asset.current_version);
    if (!version) return notFound('Current version missing');
  }

  // ETag — return 304 if client has it cached
  const ifNoneMatch = request.headers.get('If-None-Match');
  if (ifNoneMatch === `"${version.hash}"`) {
    return notModified();
  }

  // Format: json → return metadata
  if (format === 'json') {
    const tags = await getAssetTags(env.DB, asset.id);
    const license = await getLicenseInfo(env.DB, asset.license);
    return json(buildMetaResponse(asset, version, tags, license));
  }

  // Immutable version URLs cache for 1 year
  const cacheSecs = vParam ? 31536000 : 86400;

  // Text content (SVG, Lottie) — served from D1
  if (version.content !== null) {
    // Format: base64
    if (format === 'base64') {
      const b64 = btoa(version.content);
      return json({ slug, version: version.version_number, mimeType: version.mime_type, base64: b64 });
    }
    return content(version.content, version.mime_type, version.hash, version.version_number, asset.id, cacheSecs);
  }

  // Binary content — served from R2
  if (version.r2_key) {
    const object = await env.STORAGE.get(version.r2_key);
    if (!object) return jsonError(500, 'Binary content missing from storage');

    if (format === 'base64') {
      const buf = await object.arrayBuffer();
      // Workers don't have Buffer, use manual base64
      const bytes = new Uint8Array(buf);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = btoa(binary);
      return json({ slug, version: version.version_number, mimeType: version.mime_type, base64: b64 });
    }

    return content(object.body, version.mime_type, version.hash, version.version_number, asset.id, cacheSecs);
  }

  return jsonError(500, 'Asset has no content or R2 key');
}

// ─── GET /v1/assets/:slug/meta ────────────────────────

export async function handleAssetMeta(request: Request, env: Env, slug: string): Promise<Response> {
  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset) return notFound(`Asset not found: ${slug}`);

  const version = await getCurrentVersion(env.DB, asset.current_version);
  if (!version) return notFound('Current version missing');

  const tags = await getAssetTags(env.DB, asset.id);
  const license = await getLicenseInfo(env.DB, asset.license);

  // Usage count
  const countRow = await env.DB.prepare(
    'SELECT COUNT(*) as cnt FROM usage_log WHERE asset_id = ?'
  ).bind(asset.id).first<{ cnt: number }>();

  // Lottie → static fallback icon slug
  let fallbackIconSlug: string | null = null;
  if (asset.type === 'lottie') {
    const mapping = await env.DB.prepare(
      'SELECT a.slug FROM lottie_mappings lm JOIN assets a ON lm.static_asset_id = a.id WHERE lm.lottie_asset_id = ?'
    ).bind(asset.id).first<{ slug: string }>();
    fallbackIconSlug = mapping?.slug ?? null;
  }

  return json(buildMetaResponse(asset, version, tags, license, countRow?.cnt ?? 0, fallbackIconSlug));
}

// ─── GET /v1/assets ───────────────────────────────────

export async function handleAssetList(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const tagFilter = url.searchParams.getAll('tag');
  const typeFilter = url.searchParams.get('type');
  const sourceFilter = url.searchParams.get('source');
  const licenseFilter = url.searchParams.get('license');
  const baseNameFilter = url.searchParams.get('base_name');
  const hasAlt = url.searchParams.get('has_alt');
  const includeAlt = url.searchParams.get('include') === 'alt';
  const query = url.searchParams.get('q');
  const updatedAfter = url.searchParams.get('updated_after');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);
  const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

  let sql = includeAlt
    ? 'SELECT DISTINCT a.*, s.word AS alt_word, s.aac_url AS alt_aac_url FROM assets a'
    : 'SELECT DISTINCT a.* FROM assets a';
  const params: any[] = [];
  const joins: string[] = [];
  const wheres: string[] = ['a.archived = 0'];

  if (includeAlt) {
    joins.push('LEFT JOIN alt_symbols s ON a.alt_symbol_id = s.id');
  }

  // Tag filtering (join per tag for AND logic)
  if (tagFilter.length > 0) {
    for (let i = 0; i < tagFilter.length; i++) {
      const alias = `at${i}`;
      const tagAlias = `t${i}`;
      joins.push(`JOIN asset_tags ${alias} ON a.id = ${alias}.asset_id JOIN tags ${tagAlias} ON ${alias}.tag_id = ${tagAlias}.id`);
      wheres.push(`${tagAlias}.name = ?`);
      params.push(tagFilter[i]);
    }
  }

  if (typeFilter) { wheres.push('a.type = ?'); params.push(typeFilter); }
  if (sourceFilter) { wheres.push('a.source = ?'); params.push(sourceFilter); }
  if (licenseFilter) { wheres.push('a.license = ?'); params.push(licenseFilter); }
  if (baseNameFilter) { wheres.push('a.base_name = ?'); params.push(baseNameFilter); }
  if (hasAlt === 'true') { wheres.push('(a.alt_symbol_id IS NOT NULL OR a.alt_descriptive IS NOT NULL)'); }
  if (hasAlt === 'false') { wheres.push('a.alt_symbol_id IS NULL AND a.alt_descriptive IS NULL'); }
  if (query) { wheres.push('(a.name LIKE ? OR a.slug LIKE ? OR a.base_name LIKE ?)'); params.push(`%${query}%`, `%${query}%`, `%${query}%`); }
  if (updatedAfter) { wheres.push('a.updated_at > ?'); params.push(updatedAfter); }

  sql += ' ' + joins.join(' ');
  sql += ' WHERE ' + wheres.join(' AND ');
  sql += ' ORDER BY a.updated_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const { results } = await env.DB.prepare(sql).bind(...params).all<AssetRow>();

  // Minimal response — no content bodies in list
  const items = results.map((a: any) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    baseName: a.base_name,
    type: a.type,
    source: a.source,
    license: a.license,
    createdAt: a.created_at,
    updatedAt: a.updated_at,
    ...(includeAlt ? {
      altWord: a.alt_word ?? null,
      altDescriptive: a.alt_descriptive ?? null,
      altAacUrl: a.alt_aac_url ?? null,
    } : {}),
  }));

  return json({ assets: items, count: items.length, limit, offset });
}

// ─── POST /v1/assets ──────────────────────────────────

export async function handleAssetCreate(request: Request, env: Env): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const name = formData.get('name') as string | null;
  const slug = formData.get('slug') as string | null;
  const type = formData.get('type') as string | null;
  const source = (formData.get('source') as string) || 'manual';
  const license = (formData.get('license') as string) || 'unknown';
  const licenseUrl = formData.get('license_url') as string | null;
  const tagsStr = (formData.get('tags') as string) || '';
  const createdBy = (formData.get('created_by') as string) || 'manual';

  if (!file || !name || !slug || !type) {
    return jsonError(400, 'Required fields: file, name, slug, type');
  }

  // Validate slug format
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) && slug.length > 1) {
    return jsonError(400, 'Slug must be lowercase alphanumeric with hyphens, no leading/trailing hyphens');
  }

  // Check slug uniqueness
  const existing = await getAssetBySlug(env.DB, slug);
  if (existing) {
    return jsonError(409, `Slug already exists: ${slug}`);
  }

  const isText = TEXT_TYPES.has(type);
  const now = new Date().toISOString();
  const assetId = makeId.asset();
  const versionId = makeId.version();

  let contentStr: string | null = null;
  let contentBuf: ArrayBuffer | null = null;
  let hash: string;
  let fileSize: number;
  let r2Key: string | null = null;
  let metadata: string;

  if (isText) {
    contentStr = await file.text();
    hash = await hashContent(contentStr);
    fileSize = new TextEncoder().encode(contentStr).length;
    metadata = extractMetadata(type, contentStr);
  } else {
    contentBuf = await file.arrayBuffer();
    hash = await hashContent(contentBuf);
    fileSize = contentBuf.byteLength;
    metadata = extractMetadata(type, contentBuf);
    r2Key = `assets/${assetId}/${versionId}.${type}`;
  }

  // Check hash uniqueness (dedup)
  const hashExists = await env.DB.prepare('SELECT asset_id FROM versions WHERE hash = ?')
    .bind(hash).first<{ asset_id: string }>();
  if (hashExists) {
    // Identical content exists — return reference to existing asset
    const existingAsset = await env.DB.prepare('SELECT slug FROM assets WHERE id = ?')
      .bind(hashExists.asset_id).first<{ slug: string }>();
    return json({
      duplicate: true,
      existingSlug: existingAsset?.slug,
      hash,
      message: 'Identical content already exists',
    }, 200);
  }

  const mimeType = MIME_TYPES[type] || 'application/octet-stream';

  // Upload binary to R2
  if (!isText && contentBuf && r2Key) {
    await env.STORAGE.put(r2Key, contentBuf, {
      httpMetadata: { contentType: mimeType },
      customMetadata: { assetId, versionId },
    });
  }

  const baseName = computeBaseName(slug);

  // D1 inserts — batched
  const stmts = [
    env.DB.prepare(
      `INSERT INTO assets (id, name, slug, type, storage, current_version, source, license, license_url, base_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(assetId, name, slug, type, isText ? 'd1' : 'r2', versionId, source, license, licenseUrl, baseName, now, now),

    env.DB.prepare(
      `INSERT INTO versions (id, asset_id, version_number, hash, content, r2_key, file_size, mime_type, metadata, created_at, created_by)
       VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(versionId, assetId, hash, contentStr, r2Key, fileSize, mimeType, metadata, now, createdBy),
  ];

  // Tags
  const tagNames = tagsStr.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
  for (const tagName of tagNames) {
    const tagId = makeId.tag();
    stmts.push(
      env.DB.prepare('INSERT OR IGNORE INTO tags (id, name, type) VALUES (?, ?, ?)')
        .bind(tagId, tagName, 'general')
    );
    // Need the real tag ID (might already exist)
    // We'll handle tag linking after batch
  }

  await env.DB.batch(stmts);

  // Link tags (after batch so tags exist)
  if (tagNames.length > 0) {
    const tagStmts = [];
    for (const tagName of tagNames) {
      const tag = await env.DB.prepare('SELECT id FROM tags WHERE name = ?')
        .bind(tagName).first<{ id: string }>();
      if (tag) {
        tagStmts.push(
          env.DB.prepare('INSERT OR IGNORE INTO asset_tags (asset_id, tag_id) VALUES (?, ?)')
            .bind(assetId, tag.id)
        );
      }
    }
    if (tagStmts.length > 0) {
      await env.DB.batch(tagStmts);
    }
  }

  return json({
    id: assetId,
    slug,
    version: { id: versionId, number: 1, hash },
    message: 'Asset created',
  }, 201);
}

// ─── PUT /v1/assets/:slug ─────────────────────────────

export async function handleAssetUpdate(request: Request, env: Env, slug: string): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset) return notFound(`Asset not found: ${slug}`);

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const createdBy = (formData.get('created_by') as string) || 'manual';

  if (!file) {
    return jsonError(400, 'Required field: file');
  }

  const isText = TEXT_TYPES.has(asset.type);
  const now = new Date().toISOString();
  const versionId = makeId.version();

  let contentStr: string | null = null;
  let contentBuf: ArrayBuffer | null = null;
  let hash: string;
  let fileSize: number;
  let r2Key: string | null = null;
  let metadata: string;

  if (isText) {
    contentStr = await file.text();
    hash = await hashContent(contentStr);
    fileSize = new TextEncoder().encode(contentStr).length;
    metadata = extractMetadata(asset.type, contentStr);
  } else {
    contentBuf = await file.arrayBuffer();
    hash = await hashContent(contentBuf);
    fileSize = contentBuf.byteLength;
    metadata = extractMetadata(asset.type, contentBuf);
    r2Key = `assets/${asset.id}/${versionId}.${asset.type}`;
  }

  // Check if identical to current version
  const currentVersion = await getCurrentVersion(env.DB, asset.current_version);
  if (currentVersion && currentVersion.hash === hash) {
    return notModified();
  }

  // Check global hash uniqueness
  const hashExists = await env.DB.prepare('SELECT id FROM versions WHERE hash = ?')
    .bind(hash).first();
  if (hashExists) {
    return jsonError(409, 'Identical content already exists in another asset version');
  }

  // Get next version number
  const maxVer = await env.DB.prepare(
    'SELECT MAX(version_number) as max_v FROM versions WHERE asset_id = ?'
  ).bind(asset.id).first<{ max_v: number }>();
  const nextVersion = (maxVer?.max_v ?? 0) + 1;

  const mimeType = MIME_TYPES[asset.type] || 'application/octet-stream';

  // Upload binary to R2
  if (!isText && contentBuf && r2Key) {
    await env.STORAGE.put(r2Key, contentBuf, {
      httpMetadata: { contentType: mimeType },
      customMetadata: { assetId: asset.id, versionId },
    });
  }

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO versions (id, asset_id, version_number, hash, content, r2_key, file_size, mime_type, metadata, created_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(versionId, asset.id, nextVersion, hash, contentStr, r2Key, fileSize, mimeType, metadata, now, createdBy),

    env.DB.prepare(
      'UPDATE assets SET current_version = ?, updated_at = ? WHERE id = ?'
    ).bind(versionId, now, asset.id),
  ]);

  return json({
    id: asset.id,
    slug,
    version: { id: versionId, number: nextVersion, hash },
    message: 'New version created',
  });
}

// ─── PATCH /v1/assets/:slug ───────────────────────────

export async function handleAssetPatch(request: Request, env: Env, slug: string): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset) return notFound(`Asset not found: ${slug}`);

  const body = await request.json() as Record<string, any>;
  const now = new Date().toISOString();
  const stmts: D1PreparedStatement[] = [];
  const altLogStmts: D1PreparedStatement[] = [];

  // Update name
  if (body.name) {
    stmts.push(env.DB.prepare('UPDATE assets SET name = ?, updated_at = ? WHERE id = ?')
      .bind(body.name, now, asset.id));
  }

  // Update license
  if (body.license) {
    stmts.push(env.DB.prepare('UPDATE assets SET license = ?, updated_at = ? WHERE id = ?')
      .bind(body.license, now, asset.id));
  }

  if (body.license_url !== undefined) {
    stmts.push(env.DB.prepare('UPDATE assets SET license_url = ?, updated_at = ? WHERE id = ?')
      .bind(body.license_url, now, asset.id));
  }

  // Update alt text fields (with audit logging)
  if (body.alt_symbol_id !== undefined) {
    stmts.push(env.DB.prepare('UPDATE assets SET alt_symbol_id = ?, updated_at = ? WHERE id = ?')
      .bind(body.alt_symbol_id, now, asset.id));
    if ((body.alt_symbol_id ?? null) !== (asset.alt_symbol_id ?? null)) {
      altLogStmts.push(env.DB.prepare(
        'INSERT INTO alt_text_log (asset_id, field, old_value, new_value, changed_by) VALUES (?, ?, ?, ?, ?)'
      ).bind(asset.id, 'alt_symbol_id', asset.alt_symbol_id ?? null, body.alt_symbol_id ?? null, 'api'));
    }
  }

  if (body.alt_descriptive !== undefined) {
    stmts.push(env.DB.prepare('UPDATE assets SET alt_descriptive = ?, updated_at = ? WHERE id = ?')
      .bind(body.alt_descriptive, now, asset.id));
    if ((body.alt_descriptive ?? null) !== (asset.alt_descriptive ?? null)) {
      altLogStmts.push(env.DB.prepare(
        'INSERT INTO alt_text_log (asset_id, field, old_value, new_value, changed_by) VALUES (?, ?, ?, ?, ?)'
      ).bind(asset.id, 'alt_descriptive', asset.alt_descriptive ?? null, body.alt_descriptive ?? null, 'api'));
    }
  }

  if (body.alt_aac_phrase !== undefined) {
    stmts.push(env.DB.prepare('UPDATE assets SET alt_aac_phrase = ?, updated_at = ? WHERE id = ?')
      .bind(body.alt_aac_phrase, now, asset.id));
    if ((body.alt_aac_phrase ?? null) !== (asset.alt_aac_phrase ?? null)) {
      altLogStmts.push(env.DB.prepare(
        'INSERT INTO alt_text_log (asset_id, field, old_value, new_value, changed_by) VALUES (?, ?, ?, ?, ?)'
      ).bind(asset.id, 'alt_aac_phrase', asset.alt_aac_phrase ?? null, body.alt_aac_phrase ?? null, 'api'));
    }
  }

  // Replace tags
  if (Array.isArray(body.tags)) {
    // Remove existing tags
    stmts.push(env.DB.prepare('DELETE FROM asset_tags WHERE asset_id = ?').bind(asset.id));

    // We need to batch the deletes first, then add new tags
    if (stmts.length > 0) await env.DB.batch(stmts);
    stmts.length = 0;

    // Ensure tags exist and link
    for (const tagName of body.tags) {
      const clean = tagName.trim().toLowerCase();
      if (!clean) continue;
      const tagId = makeId.tag();
      await env.DB.prepare('INSERT OR IGNORE INTO tags (id, name, type) VALUES (?, ?, ?)')
        .bind(tagId, clean, 'general').run();
      const tag = await env.DB.prepare('SELECT id FROM tags WHERE name = ?')
        .bind(clean).first<{ id: string }>();
      if (tag) {
        stmts.push(env.DB.prepare('INSERT OR IGNORE INTO asset_tags (asset_id, tag_id) VALUES (?, ?)')
          .bind(asset.id, tag.id));
      }
    }
  }

  if (stmts.length > 0) {
    await env.DB.batch(stmts);
  }

  // Write audit log entries (after main batch succeeds)
  if (altLogStmts.length > 0) {
    await env.DB.batch(altLogStmts);
  }

  return json({ slug, message: 'Metadata updated' });
}

// ─── DELETE /v1/assets/:slug ──────────────────────────

export async function handleAssetDelete(request: Request, env: Env, slug: string): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset) return notFound(`Asset not found: ${slug}`);

  await env.DB.prepare('UPDATE assets SET archived = 1, updated_at = ? WHERE id = ?')
    .bind(new Date().toISOString(), asset.id).run();

  return json({ slug, message: 'Asset archived' });
}
