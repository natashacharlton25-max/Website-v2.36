/**
 * License routes — list known license definitions.
 */

import type { Env, LicenseRow } from '../types';
import { json } from '../lib/response';

// ─── GET /v1/licenses ─────────────────────────────────

export async function handleLicenseList(_request: Request, env: Env): Promise<Response> {
  const { results } = await env.DB.prepare('SELECT * FROM licenses ORDER BY key')
    .all<LicenseRow>();

  return json(results.map(l => ({
    key: l.key,
    name: l.name,
    url: l.url,
    permits: JSON.parse(l.permits),
    requires: JSON.parse(l.requires),
    notes: l.notes,
  })));
}
