/**
 * Auth — Bearer token validation.
 * Pre-launch: global gate requires token on ALL routes.
 * Go-live: remove global gate in index.ts to open reads.
 */

import type { Env } from '../types';

export function requireAuth(request: Request, env: Env): Response | null {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return jsonError(401, 'Missing Authorization header');
  }

  const token = auth.slice(7);
  if (token !== env.API_TOKEN) {
    return jsonError(403, 'Invalid token');
  }

  return null; // Auth passed
}

/** Optional auth check — returns true if authenticated */
export function isAuthed(request: Request, env: Env): boolean {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return false;
  return auth.slice(7) === env.API_TOKEN;
}

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
