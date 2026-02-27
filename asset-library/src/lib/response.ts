/**
 * Response helpers — consistent JSON responses + content serving.
 */

export function json(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...headers,
    },
  });
}

export function jsonError(status: number, message: string): Response {
  return json({ error: message }, status);
}

export function content(
  body: string | ArrayBuffer | ReadableStream | null,
  mimeType: string,
  hash: string,
  versionNumber: number,
  assetId: string,
  cacheSecs = 86400,
): Response {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'ETag': `"${hash}"`,
      'X-Asset-Id': assetId,
      'X-Version': String(versionNumber),
      'Cache-Control': `public, max-age=${cacheSecs}, stale-while-revalidate=604800`,
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export function notModified(): Response {
  return new Response(null, { status: 304 });
}

export function notFound(what = 'Not found'): Response {
  return jsonError(404, what);
}

export function cors(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
