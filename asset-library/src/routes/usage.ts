/**
 * Usage routes — log events, query history, find orphans.
 */

import type { Env } from '../types';
import { makeId } from '../lib/id';
import { requireAuth } from '../lib/auth';
import { json, jsonError, notFound } from '../lib/response';

// ─── POST /v1/usage ───────────────────────────────────

export async function handleUsageLog(request: Request, env: Env): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const body = await request.json() as {
    slug: string;
    consumer: string;
    context?: string;
    brand?: string;
    action?: string;
  };

  if (!body.slug || !body.consumer) {
    return jsonError(400, 'Required: slug, consumer');
  }

  // Resolve slug → asset + current version
  const asset = await env.DB.prepare(
    'SELECT id, current_version FROM assets WHERE slug = ? AND archived = 0'
  ).bind(body.slug).first<{ id: string; current_version: string }>();

  if (!asset) return notFound(`Asset not found: ${body.slug}`);

  const id = makeId.usage();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO usage_log (id, asset_id, version_id, consumer, context, brand, action, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, asset.id, asset.current_version, body.consumer, body.context ?? null, body.brand ?? null, body.action ?? 'render', now).run();

  return json({ id, message: 'Usage logged' }, 201);
}

// ─── POST /v1/usage/batch ─────────────────────────────

export async function handleUsageBatch(request: Request, env: Env): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const body = await request.json() as {
    events: Array<{ slug: string; consumer: string; context?: string; action?: string }>;
    brand?: string;
  };

  if (!body.events || !Array.isArray(body.events)) {
    return jsonError(400, 'Required: events (array)');
  }

  const now = new Date().toISOString();
  const stmts: D1PreparedStatement[] = [];
  let logged = 0;
  let skipped = 0;

  for (const event of body.events) {
    if (!event.slug || !event.consumer) { skipped++; continue; }

    const asset = await env.DB.prepare(
      'SELECT id, current_version FROM assets WHERE slug = ? AND archived = 0'
    ).bind(event.slug).first<{ id: string; current_version: string }>();

    if (!asset) { skipped++; continue; }

    stmts.push(
      env.DB.prepare(
        `INSERT INTO usage_log (id, asset_id, version_id, consumer, context, brand, action, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(makeId.usage(), asset.id, asset.current_version, event.consumer, event.context ?? null, body.brand ?? null, event.action ?? 'render', now)
    );
    logged++;
  }

  // Batch in groups of 50 (D1 batch limit)
  for (let i = 0; i < stmts.length; i += 50) {
    await env.DB.batch(stmts.slice(i, i + 50));
  }

  return json({ logged, skipped, message: 'Batch usage logged' }, 201);
}

// ─── GET /v1/assets/:slug/usage ──────────────────────

export async function handleUsageGet(request: Request, env: Env, slug: string): Promise<Response> {
  const url = new URL(request.url);
  const consumer = url.searchParams.get('consumer');
  const after = url.searchParams.get('after');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 200);

  const asset = await env.DB.prepare('SELECT id FROM assets WHERE slug = ? AND archived = 0')
    .bind(slug).first<{ id: string }>();
  if (!asset) return notFound(`Asset not found: ${slug}`);

  let sql = `SELECT u.consumer, u.context, u.brand, u.action, u.created_at,
             v.version_number FROM usage_log u
             JOIN versions v ON u.version_id = v.id
             WHERE u.asset_id = ?`;
  const params: any[] = [asset.id];

  if (consumer) { sql += ' AND u.consumer = ?'; params.push(consumer); }
  if (after) { sql += ' AND u.created_at > ?'; params.push(after); }

  sql += ' ORDER BY u.created_at DESC LIMIT ?';
  params.push(limit);

  const { results } = await env.DB.prepare(sql).bind(...params).all();

  // Total count
  const countRow = await env.DB.prepare('SELECT COUNT(*) as cnt FROM usage_log WHERE asset_id = ?')
    .bind(asset.id).first<{ cnt: number }>();

  return json({
    assetId: asset.id,
    slug,
    totalUsages: countRow?.cnt ?? 0,
    usages: results.map((r: any) => ({
      consumer: r.consumer,
      context: r.context,
      brand: r.brand,
      version: r.version_number,
      action: r.action,
      at: r.created_at,
    })),
  });
}

// ─── GET /v1/usage/orphans ───────────────────────────

export async function handleOrphans(_request: Request, env: Env): Promise<Response> {
  // Assets with zero usage log entries
  const { results } = await env.DB.prepare(
    `SELECT a.id, a.slug, a.name, a.source, a.type, a.created_at,
     (SELECT MAX(u.created_at) FROM usage_log u WHERE u.asset_id = a.id) as last_used
     FROM assets a
     LEFT JOIN usage_log ul ON a.id = ul.asset_id
     WHERE a.archived = 0
     GROUP BY a.id
     HAVING COUNT(ul.id) = 0
     ORDER BY a.created_at ASC
     LIMIT 100`
  ).all();

  return json({
    unusedAssets: results.map((r: any) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      source: r.source,
      type: r.type,
      createdAt: r.created_at,
      lastUsed: r.last_used,
    })),
  });
}
