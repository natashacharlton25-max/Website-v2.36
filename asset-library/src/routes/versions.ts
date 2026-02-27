/**
 * Version routes — history listing and rollback.
 */

import type { Env, VersionRow } from '../types';
import { requireAuth } from '../lib/auth';
import { json, jsonError, notFound } from '../lib/response';

// ─── GET /v1/assets/:slug/versions ────────────────────

export async function handleVersionList(_request: Request, env: Env, slug: string): Promise<Response> {
  const asset = await env.DB.prepare('SELECT id FROM assets WHERE slug = ? AND archived = 0')
    .bind(slug).first<{ id: string }>();
  if (!asset) return notFound(`Asset not found: ${slug}`);

  const { results } = await env.DB.prepare(
    'SELECT id, version_number, hash, file_size, mime_type, metadata, created_at, created_by FROM versions WHERE asset_id = ? ORDER BY version_number DESC'
  ).bind(asset.id).all<VersionRow>();

  return json({
    assetId: asset.id,
    slug,
    versions: results.map(v => ({
      id: v.id,
      number: v.version_number,
      hash: v.hash,
      fileSize: v.file_size,
      mimeType: v.mime_type,
      metadata: v.metadata ? JSON.parse(v.metadata) : null,
      createdAt: v.created_at,
      createdBy: v.created_by,
    })),
  });
}

// ─── POST /v1/assets/:slug/rollback ──────────────────

export async function handleRollback(request: Request, env: Env, slug: string): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const asset = await env.DB.prepare('SELECT * FROM assets WHERE slug = ? AND archived = 0')
    .bind(slug).first<{ id: string; current_version: string }>();
  if (!asset) return notFound(`Asset not found: ${slug}`);

  const body = await request.json() as { version: number };
  if (!body.version || typeof body.version !== 'number') {
    return jsonError(400, 'Required: version (number)');
  }

  const targetVersion = await env.DB.prepare(
    'SELECT id, version_number, hash FROM versions WHERE asset_id = ? AND version_number = ?'
  ).bind(asset.id, body.version).first<{ id: string; version_number: number; hash: string }>();

  if (!targetVersion) {
    return notFound(`Version ${body.version} not found for ${slug}`);
  }

  if (targetVersion.id === asset.current_version) {
    return json({ slug, message: 'Already on this version', version: body.version });
  }

  await env.DB.prepare('UPDATE assets SET current_version = ?, updated_at = ? WHERE id = ?')
    .bind(targetVersion.id, new Date().toISOString(), asset.id).run();

  return json({
    slug,
    message: `Rolled back to version ${body.version}`,
    version: { id: targetVersion.id, number: targetVersion.version_number, hash: targetVersion.hash },
  });
}
