/**
 * Alt-symbols routes — CRUD for AAC symbol mappings.
 */

import type { Env, AltSymbolRow } from '../types';
import { makeId } from '../lib/id';
import { requireAuth } from '../lib/auth';
import { json, jsonError, notFound } from '../lib/response';

// ─── GET /v1/alt-symbols ─────────────────────────────

export async function handleAltSymbolList(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const wordFilter = url.searchParams.get('word');
  const wordExact = url.searchParams.get('word_exact');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);
  const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

  let sql = 'SELECT * FROM alt_symbols';
  const params: any[] = [];

  if (wordExact) {
    sql += ' WHERE word = ?';
    params.push(wordExact);
  } else if (wordFilter) {
    sql += ' WHERE word LIKE ?';
    params.push(`%${wordFilter}%`);
  }

  sql += ' ORDER BY word ASC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const { results } = await env.DB.prepare(sql).bind(...params).all<AltSymbolRow>();

  return json({ symbols: results, count: results.length, limit, offset });
}

// ─── GET /v1/alt-symbols/:id ─────────────────────────

export async function handleAltSymbolGet(request: Request, env: Env, id: string): Promise<Response> {
  const row = await env.DB.prepare('SELECT * FROM alt_symbols WHERE id = ?')
    .bind(id).first<AltSymbolRow>();

  if (!row) return notFound(`Alt symbol not found: ${id}`);

  return json(row);
}

// ─── POST /v1/alt-symbols ────────────────────────────

export async function handleAltSymbolCreate(request: Request, env: Env): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const body = await request.json() as Record<string, any>;
  const { word, icon_id, aac_id, aac_url } = body;

  if (!word) {
    return jsonError(400, 'Required field: word');
  }

  const id = makeId.symbol();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO alt_symbols (id, word, icon_id, aac_id, aac_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, word, icon_id ?? null, aac_id ?? null, aac_url ?? null, now, now).run();

  return json({ id, word, message: 'Alt symbol created' }, 201);
}

// ─── PUT /v1/alt-symbols/:id ─────────────────────────

export async function handleAltSymbolUpdate(request: Request, env: Env, id: string): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const existing = await env.DB.prepare('SELECT id FROM alt_symbols WHERE id = ?')
    .bind(id).first();
  if (!existing) return notFound(`Alt symbol not found: ${id}`);

  const body = await request.json() as Record<string, any>;
  const now = new Date().toISOString();
  const stmts: D1PreparedStatement[] = [];

  if (body.word !== undefined) {
    stmts.push(env.DB.prepare('UPDATE alt_symbols SET word = ?, updated_at = ? WHERE id = ?')
      .bind(body.word, now, id));
  }
  if (body.icon_id !== undefined) {
    stmts.push(env.DB.prepare('UPDATE alt_symbols SET icon_id = ?, updated_at = ? WHERE id = ?')
      .bind(body.icon_id, now, id));
  }
  if (body.aac_id !== undefined) {
    stmts.push(env.DB.prepare('UPDATE alt_symbols SET aac_id = ?, updated_at = ? WHERE id = ?')
      .bind(body.aac_id, now, id));
  }
  if (body.aac_url !== undefined) {
    stmts.push(env.DB.prepare('UPDATE alt_symbols SET aac_url = ?, updated_at = ? WHERE id = ?')
      .bind(body.aac_url, now, id));
  }

  if (stmts.length > 0) {
    await env.DB.batch(stmts);
  }

  return json({ id, message: 'Alt symbol updated' });
}

// ─── DELETE /v1/alt-symbols/:id ──────────────────────

export async function handleAltSymbolDelete(request: Request, env: Env, id: string): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const existing = await env.DB.prepare('SELECT id FROM alt_symbols WHERE id = ?')
    .bind(id).first();
  if (!existing) return notFound(`Alt symbol not found: ${id}`);

  await env.DB.prepare('DELETE FROM alt_symbols WHERE id = ?').bind(id).run();

  return json({ id, message: 'Alt symbol deleted' });
}
