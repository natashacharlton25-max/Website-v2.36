/**
 * fetch-alt.ts — Build-time alt text fetcher
 *
 * Fetches alt text data (word, descriptive, AAC card) from the Asset Library API.
 * Called by Image.astro in frontmatter when assetId is provided.
 *
 * Flow:
 *   1. GET /v1/assets/{assetId}?format=json → { altSymbolId, altDescriptive }
 *   2. GET /v1/alt-symbols/{altSymbolId}    → { word, aac_url, icon_id }
 *   3. Build AAC card HTML from aac_url or icon_id
 *
 * Cached per build — repeated assetId lookups are free.
 */

import { pictogramCard, iconCard, textOnlyCard } from '../aac/aac-cards';

const ASSET_API_URL =
  import.meta.env.ASSET_API_URL || 'http://localhost:8787';
const ASSET_API_TOKEN = import.meta.env.ASSET_API_TOKEN || '';

// ── Types ──

export interface AltData {
  word: string;
  descriptive: string | null;
  aacHtml: string;
}

// ── Build-wide cache ──

const cache = new Map<string, AltData | null>();

// ── Helpers ──

function headers(): Record<string, string> {
  const h: Record<string, string> = {};
  if (ASSET_API_TOKEN) h['Authorization'] = `Bearer ${ASSET_API_TOKEN}`;
  return h;
}

// ── Public API ──

/**
 * Fetch alt text data for an asset.
 * Returns null if the asset has no alt_symbol_id (no word/AAC data).
 */
export async function fetchAltData(
  assetId: string,
): Promise<AltData | null> {
  if (cache.has(assetId)) return cache.get(assetId)!;

  try {
    // 1. Fetch asset metadata
    const assetRes = await fetch(
      `${ASSET_API_URL}/v1/assets/${assetId}?format=json`,
      { headers: headers() },
    );
    if (!assetRes.ok) {
      cache.set(assetId, null);
      return null;
    }

    const asset = (await assetRes.json()) as {
      altSymbolId?: string | null;
      altDescriptive?: string | null;
    };

    const descriptive = asset.altDescriptive || null;

    // No alt symbol → no word or AAC data
    if (!asset.altSymbolId) {
      // If there's at least a descriptive, return that with no word/AAC
      if (descriptive) {
        const result: AltData = { word: '', descriptive, aacHtml: '' };
        cache.set(assetId, result);
        return result;
      }
      cache.set(assetId, null);
      return null;
    }

    // 2. Fetch alt symbol
    const symbolRes = await fetch(
      `${ASSET_API_URL}/v1/alt-symbols/${asset.altSymbolId}`,
      { headers: headers() },
    );
    if (!symbolRes.ok) {
      cache.set(assetId, null);
      return null;
    }

    const symbol = (await symbolRes.json()) as {
      word: string;
      aac_url?: string | null;
      icon_id?: string | null;
    };

    // 3. Build AAC card HTML
    let aacHtml: string;

    if (symbol.aac_url && symbol.aac_url !== 'null') {
      aacHtml = pictogramCard(symbol.word, symbol.aac_url);
    } else if (symbol.icon_id) {
      // Fetch Phosphor SVG for icon card
      try {
        const svgRes = await fetch(
          `${ASSET_API_URL}/v1/assets/${symbol.icon_id}`,
          { headers: headers() },
        );
        if (svgRes.ok) {
          const svgData = (await svgRes.json()) as { content?: string };
          if (svgData.content) {
            aacHtml = iconCard(symbol.word, svgData.content);
          } else {
            aacHtml = textOnlyCard(symbol.word);
          }
        } else {
          aacHtml = textOnlyCard(symbol.word);
        }
      } catch {
        aacHtml = textOnlyCard(symbol.word);
      }
    } else {
      aacHtml = textOnlyCard(symbol.word);
    }

    const result: AltData = {
      word: symbol.word,
      descriptive,
      aacHtml,
    };

    cache.set(assetId, result);
    return result;
  } catch {
    cache.set(assetId, null);
    return null;
  }
}
