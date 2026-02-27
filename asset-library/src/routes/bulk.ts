/**
 * Bulk import route — batch asset creation for seed scripts and migrations.
 *
 * Accepts an array of assets with inline content or file URLs.
 * Processes in batches to respect D1 limits.
 */

import type { Env } from '../types';
import { TEXT_TYPES, MIME_TYPES } from '../types';
import { makeId } from '../lib/id';
import { hashContent } from '../lib/hash';
import { extractMetadata } from '../lib/metadata';
import { requireAuth } from '../lib/auth';
import { json, jsonError } from '../lib/response';

const WEIGHT_SUFFIXES = ['-fill', '-duotone', '-regular', '-bold', '-thin', '-light'];

function computeBaseName(slug: string): string {
  for (const suffix of WEIGHT_SUFFIXES) {
    if (slug.endsWith(suffix)) return slug.slice(0, -suffix.length);
  }
  return slug;
}

interface BulkAsset {
  name: string;
  slug: string;
  type: string;
  source?: string;
  license?: string;
  license_url?: string;
  tags?: string[];
  content?: string;         // raw text content (SVG, Lottie JSON)
  content_base64?: string;  // base64-encoded binary
  created_by?: string;
}

// ─── POST /v1/assets/bulk ─────────────────────────────

export async function handleBulkImport(request: Request, env: Env): Promise<Response> {
  const authErr = requireAuth(request, env);
  if (authErr) return authErr;

  const body = await request.json() as { assets: BulkAsset[] };

  if (!body.assets || !Array.isArray(body.assets)) {
    return jsonError(400, 'Required: assets (array)');
  }

  if (body.assets.length > 200) {
    return jsonError(400, 'Maximum 200 assets per bulk request');
  }

  const now = new Date().toISOString();
  const results: Array<{ slug: string; status: string; id?: string; hash?: string; error?: string }> = [];

  // Collect all unique tag names across all assets
  const allTagNames = new Set<string>();
  for (const asset of body.assets) {
    if (asset.tags) {
      for (const t of asset.tags) allTagNames.add(t.trim().toLowerCase());
    }
  }

  // Ensure all tags exist (batch)
  const tagStmts: D1PreparedStatement[] = [];
  for (const tagName of allTagNames) {
    tagStmts.push(
      env.DB.prepare('INSERT OR IGNORE INTO tags (id, name, type) VALUES (?, ?, ?)')
        .bind(makeId.tag(), tagName, 'general')
    );
  }
  if (tagStmts.length > 0) {
    for (let i = 0; i < tagStmts.length; i += 50) {
      await env.DB.batch(tagStmts.slice(i, i + 50));
    }
  }

  // Load tag ID map
  const tagMap = new Map<string, string>();
  const { results: tagRows } = await env.DB.prepare('SELECT id, name FROM tags').all<{ id: string; name: string }>();
  for (const row of tagRows) {
    tagMap.set(row.name, row.id);
  }

  // Process assets in batches
  const BATCH_SIZE = 25; // Conservative — each asset needs 2-3 statements

  for (let batchStart = 0; batchStart < body.assets.length; batchStart += BATCH_SIZE) {
    const batch = body.assets.slice(batchStart, batchStart + BATCH_SIZE);
    const stmts: D1PreparedStatement[] = [];
    const tagLinkStmts: D1PreparedStatement[] = [];
    const batchResults: typeof results = [];

    for (const asset of batch) {
      // Validate required fields
      if (!asset.name || !asset.slug || !asset.type) {
        batchResults.push({ slug: asset.slug || '?', status: 'error', error: 'Missing required fields: name, slug, type' });
        continue;
      }

      if (!asset.content && !asset.content_base64) {
        batchResults.push({ slug: asset.slug, status: 'error', error: 'Must provide content or content_base64' });
        continue;
      }

      // Check slug uniqueness
      const existing = await env.DB.prepare('SELECT id FROM assets WHERE slug = ?')
        .bind(asset.slug).first();
      if (existing) {
        batchResults.push({ slug: asset.slug, status: 'skipped', error: 'Slug already exists' });
        continue;
      }

      const isText = TEXT_TYPES.has(asset.type);
      const assetId = makeId.asset();
      const versionId = makeId.version();

      let contentStr: string | null = null;
      let contentBuf: ArrayBuffer | null = null;
      let hash: string;
      let fileSize: number;
      let r2Key: string | null = null;
      let metadata: string;
      const mimeType = MIME_TYPES[asset.type] || 'application/octet-stream';

      if (isText && asset.content) {
        contentStr = asset.content;
        hash = await hashContent(contentStr);
        fileSize = new TextEncoder().encode(contentStr).length;
        metadata = extractMetadata(asset.type, contentStr);
      } else if (asset.content_base64) {
        const binary = atob(asset.content_base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        contentBuf = bytes.buffer;
        hash = await hashContent(contentBuf);
        fileSize = contentBuf.byteLength;
        metadata = extractMetadata(asset.type, contentBuf);
        r2Key = `assets/${assetId}/${versionId}.${asset.type}`;
      } else {
        batchResults.push({ slug: asset.slug, status: 'error', error: 'Text type requires content field' });
        continue;
      }

      // Check hash uniqueness
      const hashExists = await env.DB.prepare('SELECT id FROM versions WHERE hash = ?')
        .bind(hash).first();
      if (hashExists) {
        batchResults.push({ slug: asset.slug, status: 'skipped', hash, error: 'Identical content already exists' });
        continue;
      }

      // Upload binary to R2
      if (!isText && contentBuf && r2Key) {
        await env.STORAGE.put(r2Key, contentBuf, {
          httpMetadata: { contentType: mimeType },
          customMetadata: { assetId, versionId },
        });
      }

      const baseName = computeBaseName(asset.slug);

      // Queue D1 statements
      stmts.push(
        env.DB.prepare(
          `INSERT INTO assets (id, name, slug, type, storage, current_version, source, license, license_url, base_name, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(assetId, asset.name, asset.slug, asset.type, isText ? 'd1' : 'r2', versionId,
          asset.source ?? 'import', asset.license ?? 'unknown', asset.license_url ?? null, baseName, now, now)
      );

      stmts.push(
        env.DB.prepare(
          `INSERT INTO versions (id, asset_id, version_number, hash, content, r2_key, file_size, mime_type, metadata, created_at, created_by)
           VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(versionId, assetId, hash, contentStr, r2Key, fileSize, mimeType, metadata, now, asset.created_by ?? 'import')
      );

      // Tag links
      if (asset.tags) {
        for (const tagName of asset.tags) {
          const clean = tagName.trim().toLowerCase();
          const tagId = tagMap.get(clean);
          if (tagId) {
            tagLinkStmts.push(
              env.DB.prepare('INSERT OR IGNORE INTO asset_tags (asset_id, tag_id) VALUES (?, ?)')
                .bind(assetId, tagId)
            );
          }
        }
      }

      batchResults.push({ slug: asset.slug, status: 'created', id: assetId, hash });
    }

    // Execute D1 batch
    if (stmts.length > 0) {
      await env.DB.batch(stmts);
    }

    // Tag links (separate batch)
    if (tagLinkStmts.length > 0) {
      for (let i = 0; i < tagLinkStmts.length; i += 50) {
        await env.DB.batch(tagLinkStmts.slice(i, i + 50));
      }
    }

    results.push(...batchResults);
  }

  const created = results.filter(r => r.status === 'created').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors = results.filter(r => r.status === 'error').length;

  return json({
    total: body.assets.length,
    created,
    skipped,
    errors,
    results,
  }, 201);
}
