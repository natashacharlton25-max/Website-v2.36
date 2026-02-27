/**
 * Content hashing — SHA-256 via Web Crypto.
 * Returns hex string prefixed with "sha256:" for clarity in APIs.
 */

export async function hashContent(data: ArrayBuffer | string): Promise<string> {
  const buffer = typeof data === 'string'
    ? new TextEncoder().encode(data)
    : data;

  const digest = await crypto.subtle.digest('SHA-256', buffer);
  const hex = Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return `sha256:${hex}`;
}
