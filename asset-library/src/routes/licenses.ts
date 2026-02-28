/**
 * License routes — list and get license definitions.
 */

import type { Env, LicenseRow } from '../types';
import { json, jsonError } from '../lib/response';

function formatLicense(l: LicenseRow) {
  return {
    key: l.key,
    name: l.name,
    url: l.url,
    permits: JSON.parse(l.permits),
    requires: JSON.parse(l.requires),
    notes: l.notes,
    attribution: l.attribution || null,
    summary: l.summary || null,
    aac_summary: l.aac_summary || null,
  };
}

// ─── GET /v1/licenses ─────────────────────────────────

export async function handleLicenseList(_request: Request, env: Env): Promise<Response> {
  const { results } = await env.DB.prepare('SELECT * FROM licenses ORDER BY key')
    .all<LicenseRow>();

  return json(results.map(formatLicense));
}

// ─── GET /v1/licenses/:key ────────────────────────────

export async function handleLicenseGet(_request: Request, env: Env, key: string): Promise<Response> {
  const row = await env.DB.prepare('SELECT * FROM licenses WHERE key = ?')
    .bind(key)
    .first<LicenseRow>();

  if (!row) return jsonError(404, `License not found: ${key}`);

  return json(formatLicense(row));
}
