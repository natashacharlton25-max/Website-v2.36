/**
 * Asset Library Worker — Entry point and router.
 *
 * Pre-launch: ALL routes require Bearer token (global auth gate).
 * Health check (/v1/health) is the only open endpoint.
 * To open reads for go-live, remove the global auth gate block.
 *
 * Auth model: GET = public (no token needed), writes = Bearer token required.
 * This lets Astro fetch assets at build time without env tokens.
 *
 * Routes:
 *   GET    /v1/health              — health check (open)
 *   GET    /v1/assets              — list/search assets (open)
 *   GET    /v1/assets/:slug        — get asset content (open)
 *   GET    /v1/assets/:slug/meta   — get asset metadata (open)
 *   GET    /v1/assets/:slug/versions — version history (open)
 *   GET    /v1/assets/:slug/usage  — usage history (open)
 *   POST   /v1/assets              — create asset (auth)
 *   PUT    /v1/assets/:slug        — update asset / new version (auth)
 *   PATCH  /v1/assets/:slug        — update metadata only (auth)
 *   DELETE /v1/assets/:slug        — archive asset (auth)
 *   POST   /v1/assets/:slug/rollback — rollback to version (auth)
 *   POST   /v1/assets/bulk         — bulk import (auth)
 *   POST   /v1/assets/verify       — integrity check (auth)
 *   GET    /v1/tags                — list tags (open)
 *   POST   /v1/tags                — create tag (auth)
 *   GET    /v1/brands/:brand/assets — brand assets (open)
 *   POST   /v1/brands/:brand/assets — assign brand asset (auth)
 *   GET    /v1/licenses            — list licenses (open)
 *   GET    /v1/licenses/:key      — get single license (open)
 *   POST   /v1/usage               — log usage event (auth)
 *   POST   /v1/usage/batch         — log usage batch (auth)
 *   GET    /v1/usage/orphans       — unused assets (open)
 *   GET    /v1/alt-symbols         — list alt symbols (open)
 *   GET    /v1/alt-symbols/:id     — get alt symbol (open)
 *   POST   /v1/alt-symbols         — create alt symbol (auth)
 *   PUT    /v1/alt-symbols/:id     — update alt symbol (auth)
 *   DELETE /v1/alt-symbols/:id     — delete alt symbol (auth)
 */

import type { Env } from './types';
import { cors } from './lib/response';
import { jsonError } from './lib/response';
import { requireAuth } from './lib/auth';
import { handleAssetGet, handleAssetList, handleAssetCreate, handleAssetUpdate, handleAssetPatch, handleAssetDelete } from './routes/assets';
import { handleAssetMeta } from './routes/assets';
import { handleVersionList, handleRollback } from './routes/versions';
import { handleTagList, handleTagCreate } from './routes/tags';
import { handleBrandAssets, handleBrandAssetAssign } from './routes/brands';
import { handleLicenseList, handleLicenseGet } from './routes/licenses';
import { handleUsageLog, handleUsageBatch, handleUsageGet, handleOrphans } from './routes/usage';
import { handleVerify } from './routes/verify';
import { handleBulkImport } from './routes/bulk';
import { handleAltSymbolList, handleAltSymbolGet, handleAltSymbolCreate, handleAltSymbolUpdate, handleAltSymbolDelete } from './routes/alt-symbols';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return cors();
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Health check — open (no auth) for uptime monitoring
    if (path === '/v1/health') {
      return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ─── Auth gate: writes only ─────────────────────
    // GET requests are public (Astro build fetches without tokens).
    // POST, PUT, PATCH, DELETE require Bearer token.
    if (method !== 'GET') {
      const authErr = requireAuth(request, env);
      if (authErr) return authErr;
    }

    try {
      // ─── Image serving (R2) ─────────────────────────
      const imageMatch = path.match(/^\/images\/(.+)$/);
      if (imageMatch && method === 'GET') {
        const r2Key = `images/${imageMatch[1]}`;
        const object = await env.STORAGE!.get(r2Key);

        if (!object) {
          return jsonError(404, 'Image not found');
        }

        return new Response(object.body, {
          headers: {
            'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'ETag': object.etag,
          },
        });
      }

      // ─── Generic R2 serving (/r2/:path) ─────────────
      // Serves any R2 object by its exact key. Used by symbol set
      // switching (Bliss SVGs at symbols/bliss/{bci_index}.svg).
      const r2Match = path.match(/^\/r2\/(.+)$/);
      if (r2Match && method === 'GET') {
        const r2Key = r2Match[1];
        const object = await env.STORAGE!.get(r2Key);

        if (!object) {
          return jsonError(404, 'R2 object not found');
        }

        const ext = r2Key.split('.').pop()?.toLowerCase();
        const mimeMap: Record<string, string> = {
          svg: 'image/svg+xml',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          webp: 'image/webp',
          json: 'application/json',
        };

        return new Response(object.body, {
          headers: {
            'Content-Type': object.httpMetadata?.contentType || mimeMap[ext || ''] || 'application/octet-stream',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'ETag': object.etag,
          },
        });
      }

      // ─── Route matching ─────────────────────────────
      // Order matters: more specific routes first

      // /v1/alt-symbols/:id
      const altSymbolMatch = path.match(/^\/v1\/alt-symbols\/([^/]+)$/);
      if (altSymbolMatch) {
        const id = altSymbolMatch[1];
        if (method === 'GET') return handleAltSymbolGet(request, env, id);
        if (method === 'PUT') return handleAltSymbolUpdate(request, env, id);
        if (method === 'DELETE') return handleAltSymbolDelete(request, env, id);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/alt-symbols (list or create)
      if (path === '/v1/alt-symbols') {
        if (method === 'GET') return handleAltSymbolList(request, env);
        if (method === 'POST') return handleAltSymbolCreate(request, env);
        return jsonError(405, 'Method not allowed');
      }

      // POST /v1/assets/bulk
      if (method === 'POST' && path === '/v1/assets/bulk') {
        return handleBulkImport(request, env);
      }

      // POST /v1/assets/verify
      if (method === 'POST' && path === '/v1/assets/verify') {
        return handleVerify(request, env);
      }

      // POST /v1/usage/batch
      if (method === 'POST' && path === '/v1/usage/batch') {
        return handleUsageBatch(request, env);
      }

      // GET /v1/usage/orphans
      if (method === 'GET' && path === '/v1/usage/orphans') {
        return handleOrphans(request, env);
      }

      // POST /v1/usage
      if (method === 'POST' && path === '/v1/usage') {
        return handleUsageLog(request, env);
      }

      // /v1/assets/:slug/versions
      const versionsMatch = path.match(/^\/v1\/assets\/([^/]+)\/versions$/);
      if (versionsMatch) {
        if (method === 'GET') return handleVersionList(request, env, versionsMatch[1]);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/assets/:slug/usage
      const usageMatch = path.match(/^\/v1\/assets\/([^/]+)\/usage$/);
      if (usageMatch) {
        if (method === 'GET') return handleUsageGet(request, env, usageMatch[1]);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/assets/:slug/rollback
      const rollbackMatch = path.match(/^\/v1\/assets\/([^/]+)\/rollback$/);
      if (rollbackMatch) {
        if (method === 'POST') return handleRollback(request, env, rollbackMatch[1]);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/assets/:slug/meta
      const metaMatch = path.match(/^\/v1\/assets\/([^/]+)\/meta$/);
      if (metaMatch) {
        if (method === 'GET') return handleAssetMeta(request, env, metaMatch[1]);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/assets/:slug  (must be after sub-routes)
      const assetMatch = path.match(/^\/v1\/assets\/([^/]+)$/);
      if (assetMatch) {
        const slug = assetMatch[1];
        if (method === 'GET') return handleAssetGet(request, env, slug);
        if (method === 'PUT') return handleAssetUpdate(request, env, slug);
        if (method === 'PATCH') return handleAssetPatch(request, env, slug);
        if (method === 'DELETE') return handleAssetDelete(request, env, slug);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/assets (list or create)
      if (path === '/v1/assets') {
        if (method === 'GET') return handleAssetList(request, env);
        if (method === 'POST') return handleAssetCreate(request, env);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/tags
      if (path === '/v1/tags') {
        if (method === 'GET') return handleTagList(request, env);
        if (method === 'POST') return handleTagCreate(request, env);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/brands/:brand/assets
      const brandMatch = path.match(/^\/v1\/brands\/([^/]+)\/assets$/);
      if (brandMatch) {
        if (method === 'GET') return handleBrandAssets(request, env, brandMatch[1]);
        if (method === 'POST') return handleBrandAssetAssign(request, env, brandMatch[1]);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/licenses/:key
      const licenseMatch = path.match(/^\/v1\/licenses\/([^/]+)$/);
      if (licenseMatch) {
        if (method === 'GET') return handleLicenseGet(request, env, licenseMatch[1]);
        return jsonError(405, 'Method not allowed');
      }

      // /v1/licenses
      if (path === '/v1/licenses') {
        if (method === 'GET') return handleLicenseList(request, env);
        return jsonError(405, 'Method not allowed');
      }

      return jsonError(404, `No route: ${method} ${path}`);
    } catch (err) {
      console.error('Unhandled error:', err);
      const message = err instanceof Error ? err.message : 'Internal server error';
      return jsonError(500, message);
    }
  },
};
