/**
 * Asset Library Worker — Entry point and router.
 *
 * Pre-launch: ALL routes require Bearer token (global auth gate).
 * Health check (/v1/health) is the only open endpoint.
 * To open reads for go-live, remove the global auth gate block.
 *
 * Routes:
 *   GET    /v1/health              — health check (open)
 *   GET    /v1/assets              — list/search assets (auth)
 *   GET    /v1/assets/:slug        — get asset content (auth)
 *   GET    /v1/assets/:slug/meta   — get asset metadata (auth)
 *   GET    /v1/assets/:slug/versions — version history (auth)
 *   GET    /v1/assets/:slug/usage  — usage history (auth)
 *   POST   /v1/assets              — create asset (auth)
 *   PUT    /v1/assets/:slug        — update asset / new version (auth)
 *   PATCH  /v1/assets/:slug        — update metadata only (auth)
 *   DELETE /v1/assets/:slug        — archive asset (auth)
 *   POST   /v1/assets/:slug/rollback — rollback to version (auth)
 *   POST   /v1/assets/bulk         — bulk import (auth)
 *   POST   /v1/assets/verify       — integrity check (auth)
 *   GET    /v1/tags                — list tags (auth)
 *   POST   /v1/tags                — create tag (auth)
 *   GET    /v1/brands/:brand/assets — brand assets (auth)
 *   POST   /v1/brands/:brand/assets — assign brand asset (auth)
 *   GET    /v1/licenses            — list licenses (auth)
 *   POST   /v1/usage               — log usage event (auth)
 *   POST   /v1/usage/batch         — log usage batch (auth)
 *   GET    /v1/usage/orphans       — unused assets (auth)
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
import { handleLicenseList } from './routes/licenses';
import { handleUsageLog, handleUsageBatch, handleUsageGet, handleOrphans } from './routes/usage';
import { handleVerify } from './routes/verify';
import { handleBulkImport } from './routes/bulk';

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

    // ─── Global auth gate (pre-launch lockdown) ─────
    // ALL routes require Bearer token. Remove this block to open reads when going live.
    const authErr = requireAuth(request, env);
    if (authErr) return authErr;

    try {
      // ─── Route matching ─────────────────────────────
      // Order matters: more specific routes first

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
