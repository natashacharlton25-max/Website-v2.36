/**
 * Download API Endpoint
 * Validates download tokens and serves files
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { D1Database } from '../../lib/db';
import { validateDownloadToken, recordDownload } from '../../lib/db';

// Helper to get slug from entry.id (handles index.md suffix and path separators)
const getSlugFromId = (id: string) => {
  const normalized = id.replace(/[\\/]index\.md$/, '');
  return normalized.split(/[\\/]/).pop() || id;
};

// Runtime type for Cloudflare
interface Runtime {
  env: {
    DB: D1Database;
  };
}

export const GET: APIRoute = async ({ url, redirect, locals }) => {
  try {
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing download token'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get D1 database from Cloudflare runtime
    const runtime = locals.runtime as Runtime;
    const db = runtime?.env?.DB;

    if (!db) {
      console.error('D1 database not available');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Database not configured'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate token
    const tokenData = await validateDownloadToken(db, token);

    if (!tokenData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid or expired download token'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { userId, assetId } = tokenData;

    // Get asset from content collection
    // assetId is the slug (folder name), not the data.id field
    const assets = await getCollection('assets');
    const asset = assets.find(a => getSlugFromId(a.id) === assetId || a.data.id === assetId);

    if (!asset || !asset.data.downloadUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Asset not found or no download available'
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Record the download
    await recordDownload(db, userId, assetId, asset.data.name);

    // Redirect to the actual file
    const downloadUrl = asset.data.downloadUrl;
    return redirect(downloadUrl, 302);

  } catch (error) {
    console.error('Download error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An error occurred. Please try again.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
