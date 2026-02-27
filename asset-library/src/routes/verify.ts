/**
 * Verify route — integrity checking for consumers.
 */

import type { Env } from '../types';
import { json, jsonError, notFound } from '../lib/response';

// ─── POST /v1/assets/verify ──────────────────────────

export async function handleVerify(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { slug: string; hash: string };

  if (!body.slug || !body.hash) {
    return jsonError(400, 'Required: slug, hash');
  }

  const asset = await env.DB.prepare(
    'SELECT id, current_version FROM assets WHERE slug = ? AND archived = 0'
  ).bind(body.slug).first<{ id: string; current_version: string }>();

  if (!asset) return notFound(`Asset not found: ${body.slug}`);

  const version = await env.DB.prepare(
    'SELECT hash, version_number FROM versions WHERE id = ?'
  ).bind(asset.current_version).first<{ hash: string; version_number: number }>();

  if (!version) return jsonError(500, 'Current version missing');

  const valid = version.hash === body.hash;

  return json({
    valid,
    version: version.version_number,
    ...(valid ? {} : { expected: version.hash }),
  });
}
