globalThis.process ??= {}; globalThis.process.env ??= {};
import { t as textOnlyCard, i as iconCard, p as pictogramCard } from './aac-cards_BeRYVIwd.mjs';

const ASSET_API_URL = process.env.ASSET_API_URL || "http://localhost:8787";
const OPENSYMBOLS_BASE = "https://www.opensymbols.org/api/v2";
const OPENSYMBOLS_SECRET = "878fe7ae12dfc0ce1bbe28ea";
const cache = /* @__PURE__ */ new Map();
let openSymbolsToken = null;
async function getOpenSymbolsToken() {
  if (openSymbolsToken) return openSymbolsToken;
  try {
    const res = await fetch(
      `${OPENSYMBOLS_BASE}/token?secret=${encodeURIComponent(OPENSYMBOLS_SECRET)}`,
      { method: "POST" }
    );
    if (res.ok) {
      const data = await res.json();
      openSymbolsToken = data.access_token || null;
      return openSymbolsToken;
    }
  } catch {
  }
  return null;
}
async function refreshToken() {
  openSymbolsToken = null;
  return getOpenSymbolsToken();
}
let lastOpenSymbolsCall = 0;
async function rateLimitOpenSymbols() {
  const now = Date.now();
  const elapsed = now - lastOpenSymbolsCall;
  if (elapsed < 100) {
    await new Promise((r) => setTimeout(r, 100 - elapsed));
  }
  lastOpenSymbolsCall = Date.now();
}
async function lookupOpenSymbols(word, retried = false) {
  const token = await getOpenSymbolsToken();
  if (!token) return null;
  await rateLimitOpenSymbols();
  try {
    const res = await fetch(
      `${OPENSYMBOLS_BASE}/symbols?q=${encodeURIComponent(word)}&locale=en&access_token=${encodeURIComponent(token)}`
    );
    if (res.status === 401 && !retried) {
      await refreshToken();
      return lookupOpenSymbols(word, true);
    }
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const arasaac = data.find(
          (s) => s.repo_key === "arasaac" && s.image_url
        );
        if (arasaac?.image_url) {
          return arasaac.image_url.replace(/ /g, "%20");
        }
      }
    }
  } catch {
  }
  return null;
}
async function lookupWord(word, apiBase) {
  const key = word.toLowerCase();
  if (cache.has(key)) return cache.get(key);
  try {
    const res = await fetch(
      `${apiBase}/v1/alt-symbols?word_exact=${encodeURIComponent(key)}`
    );
    if (res.ok) {
      const data = await res.json();
      const rows = data.symbols || [];
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0];
        if (row.aac_url && row.aac_url !== "null") {
          const result2 = { type: "aac", src: row.aac_url };
          cache.set(key, result2);
          return result2;
        }
        if (row.icon_id) {
          try {
            const svgRes = await fetch(`${apiBase}/v1/assets/${row.icon_id}`);
            if (svgRes.ok) {
              const asset = await svgRes.json();
              if (asset.content) {
                const result2 = { type: "icon", svg: asset.content };
                cache.set(key, result2);
                return result2;
              }
            }
          } catch {
          }
        }
      }
    }
  } catch {
  }
  const imageUrl = await lookupOpenSymbols(key);
  if (imageUrl) {
    const result2 = { type: "aac", src: imageUrl };
    cache.set(key, result2);
    return result2;
  }
  const result = { type: "text" };
  cache.set(key, result);
  return result;
}
async function aacInline(sentence, apiBase = ASSET_API_URL) {
  const words = sentence.split(/\s+/).filter((w) => w.length > 0);
  const cards = [];
  for (const word of words) {
    const clean = word.replace(/[.,!?;:]+$/, "");
    const lookup = await lookupWord(clean, apiBase);
    switch (lookup.type) {
      case "aac":
        cards.push(pictogramCard(word, lookup.src));
        break;
      case "icon":
        cards.push(iconCard(word, lookup.svg));
        break;
      case "text":
        cards.push(textOnlyCard(word));
        break;
    }
  }
  return cards.join("\n");
}

export { aacInline as a };
