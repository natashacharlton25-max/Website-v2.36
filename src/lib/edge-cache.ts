/**
 * Edge cache helper using Cloudflare Workers Cache API (caches.default).
 * Free, built into Cloudflare Workers / Pages Functions, persists across requests per edge PoP.
 * Includes in-memory fallback for local Node/dev environments where caches.default is undefined.
 */

// In-memory fallback for local development or non-Worker environments
const memoryCache = new Map<string, { data: any; expiresAt: number }>();

function getWorkerCache(): any | null {
  if (typeof caches !== 'undefined' && caches !== null) {
    return (caches as any).default || null;
  }
  return null;
}

export async function getCache<T = any>(key: string): Promise<T | null> {
  const safeKey = encodeURIComponent(key);

  // 1. Try Cloudflare Workers Edge Cache
  const workerCache = getWorkerCache();
  if (workerCache) {
    try {
      const request = new Request(`https://cache.local/cache/${safeKey}`);
      const cached = await workerCache.match(request);
      if (cached) {
        return (await cached.json()) as T;
      }
    } catch (e) {
      console.warn('[Edge Cache] Match error:', e);
    }
  }

  // 2. Fallback to in-memory cache
  const item = memoryCache.get(key);
  if (item) {
    if (Date.now() < item.expiresAt) {
      return item.data as T;
    }
    memoryCache.delete(key);
  }

  return null;
}

export async function setCache(key: string, data: any, maxAgeSeconds: number = 86400): Promise<void> {
  if (data === undefined || data === null) return;
  const safeKey = encodeURIComponent(key);

  // 1. Try Cloudflare Workers Edge Cache
  const workerCache = getWorkerCache();
  if (workerCache) {
    try {
      const request = new Request(`https://cache.local/cache/${safeKey}`);
      const response = new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `s-maxage=${maxAgeSeconds}, stale-while-revalidate=604800`,
        },
      });
      await workerCache.put(request, response.clone());
    } catch (e) {
      console.warn('[Edge Cache] Put error:', e);
    }
  }

  // 2. Save in in-memory cache
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + maxAgeSeconds * 1000,
  });
}

export async function getOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  maxAgeSeconds: number = 86400
): Promise<T | null> {
  const cached = await getCache<T>(key);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  try {
    const fresh = await fetcher();
    if (fresh !== null && fresh !== undefined) {
      await setCache(key, fresh, maxAgeSeconds);
    }
    return fresh;
  } catch (err) {
    console.error(`[Edge Cache] Fetcher exception for key "${key}":`, err);
    return null;
  }
}
