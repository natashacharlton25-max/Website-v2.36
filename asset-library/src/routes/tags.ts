/**
 * Tag routes — list and create tags.
 */

import type { Env, TagRow } from '../types';
import { makeId } from '../lib/id';
import { requireAuth } from '../lib/auth';
import { json, jsonError } from '../lib/response';

// ─── GET /v1/tags ─────────────────────────────────────

export async function handleTagList(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const typeFilter = url.searchParams.get('type');

  let sql = 'SELECT t.*, COUNT(at.asset_id) as asset_count FROM tags t LEFT JOIN asset_tags at ON t.id = at.tag_id';
  const params: any[] = [];

  if (typeFilter) {
    sql += ' WHERE t.type = ?';
    params.push(typeFilter);
  }

  sql += ' GROUP BY t.id ORDER BY t.type, t.name';

  const { results } = await env.DB.prepare(sql).bind(...params)
    .all<TagRow & { asset_count: number }>();

  return json({
    tags: results.map(t => ({
      id: t.id,
      name: t.name,
      type: t.type,
      assetCount: t.asset_count,
    })),
  });
}

// ─── POST /v1/tags ────────────────────────────────────

export async function handleTagCreate(request: Request, env: Env): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const body = await request.json() as { name: string; type?: string };
  if (!body.name) return jsonError(400, 'Required: name');

  const name = body.name.trim().toLowerCase();
  const type = body.type || 'general';
  const id = makeId.tag();

  // Check if exists
  const existing = await env.DB.prepare('SELECT id FROM tags WHERE name = ?')
    .bind(name).first<{ id: string }>();
  if (existing) {
    return json({ id: existing.id, name, type, message: 'Tag already exists' }, 200);
  }

  await env.DB.prepare('INSERT INTO tags (id, name, type) VALUES (?, ?, ?)')
    .bind(id, name, type).run();

  return json({ id, name, type, message: 'Tag created' }, 201);
}
