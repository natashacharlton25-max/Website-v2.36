/**
 * Brand routes — brand-specific asset slots.
 */

import type { Env } from '../types';
import { requireAuth } from '../lib/auth';
import { json, jsonError, notFound } from '../lib/response';

// ─── GET /v1/brands/:brand/assets ─────────────────────

export async function handleBrandAssets(_request: Request, env: Env, brand: string): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT ba.role, a.id, a.slug, a.name, a.type
     FROM brand_assets ba
     JOIN assets a ON ba.asset_id = a.id
     WHERE ba.brand = ? AND a.archived = 0
     ORDER BY ba.role`
  ).bind(brand).all<{ role: string; id: string; slug: string; name: string; type: string }>();

  if (results.length === 0) return notFound(`No assets found for brand: ${brand}`);

  const assets: Record<string, { id: string; slug: string; name: string; type: string }> = {};
  for (const r of results) {
    assets[r.role] = { id: r.id, slug: r.slug, name: r.name, type: r.type };
  }

  return json({ brand, assets });
}

// ─── POST /v1/brands/:brand/assets ───────────────────

export async function handleBrandAssetAssign(request: Request, env: Env, brand: string): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const body = await request.json() as { asset_id: string; role: string };
  if (!body.asset_id || !body.role) {
    return jsonError(400, 'Required: asset_id, role');
  }

  // Verify asset exists
  const asset = await env.DB.prepare('SELECT id FROM assets WHERE id = ? AND archived = 0')
    .bind(body.asset_id).first();
  if (!asset) return notFound('Asset not found');

  // Upsert — ON CONFLICT replaces
  await env.DB.prepare(
    `INSERT INTO brand_assets (brand, asset_id, role) VALUES (?, ?, ?)
     ON CONFLICT(brand, role) DO UPDATE SET asset_id = excluded.asset_id`
  ).bind(brand, body.asset_id, body.role).run();

  return json({ brand, role: body.role, assetId: body.asset_id, message: 'Brand asset assigned' }, 201);
}
