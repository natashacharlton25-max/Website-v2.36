globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, s as spreadAttributes, b as renderTemplate, r as renderComponent, F as Fragment, u as unescapeHTML } from '../chunks/astro/server_DSZs3x4S.mjs';
import { a as $$BaseLayout } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { p as pictogramCard, i as iconCard, t as textOnlyCard } from '../chunks/aac-cards_BeRYVIwd.mjs';
export { renderers } from '../renderers.mjs';

const ASSET_API_URL = process.env.ASSET_API_URL || "http://localhost:8787";
const ASSET_API_TOKEN = "5VHJeXzqBorLO3NcRHRqLxU8y9gzOvjSsWE6IarufLQ";
const cache = /* @__PURE__ */ new Map();
function headers() {
  const h = {};
  h["Authorization"] = `Bearer ${ASSET_API_TOKEN}`;
  return h;
}
async function fetchAltData(assetId) {
  if (cache.has(assetId)) return cache.get(assetId);
  try {
    const assetRes = await fetch(
      `${ASSET_API_URL}/v1/assets/${assetId}?format=json`,
      { headers: headers() }
    );
    if (!assetRes.ok) {
      cache.set(assetId, null);
      return null;
    }
    const asset = await assetRes.json();
    const descriptive = asset.altDescriptive || null;
    if (!asset.altSymbolId) {
      if (descriptive) {
        const result2 = { word: "", descriptive, aacHtml: "" };
        cache.set(assetId, result2);
        return result2;
      }
      cache.set(assetId, null);
      return null;
    }
    const symbolRes = await fetch(
      `${ASSET_API_URL}/v1/alt-symbols/${asset.altSymbolId}`,
      { headers: headers() }
    );
    if (!symbolRes.ok) {
      cache.set(assetId, null);
      return null;
    }
    const symbol = await symbolRes.json();
    let aacHtml;
    if (symbol.aac_url && symbol.aac_url !== "null") {
      aacHtml = pictogramCard(symbol.word, symbol.aac_url);
    } else if (symbol.icon_id) {
      try {
        const svgRes = await fetch(
          `${ASSET_API_URL}/v1/assets/${symbol.icon_id}`,
          { headers: headers() }
        );
        if (svgRes.ok) {
          const svgData = await svgRes.json();
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
    const result = {
      word: symbol.word,
      descriptive,
      aacHtml
    };
    cache.set(assetId, result);
    return result;
  } catch {
    cache.set(assetId, null);
    return null;
  }
}

const $$Astro = createAstro("https://yourdomain.com");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Image;
  const {
    src,
    alt,
    role: roleProp,
    assetId,
    width,
    height,
    fit,
    radius,
    shadow,
    hover = false,
    responsive = false,
    decorative = false,
    loading = "lazy",
    sepia,
    blur,
    gradientMask,
    clipPath,
    tilt,
    class: className,
    ...rest
  } = Astro2.props;
  const isDecorative = roleProp === "decorative" || decorative;
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-"))
  );
  const altData = !isDecorative && assetId ? await fetchAltData(assetId) : null;
  const resolvedAlt = isDecorative ? "" : altData?.word || alt || "";
  const imgClasses = [
    "image__img",
    fit ? `image--fit-${fit}` : "",
    radius ? `image--radius-${radius}` : "",
    shadow ? `image--shadow-${shadow}` : "",
    hover ? "image--hover" : "",
    responsive ? "image--responsive" : "",
    sepia ? `image--sepia-${sepia}` : "",
    blur ? `image--blur-${blur}` : "",
    gradientMask ? `image--mask-${gradientMask}` : "",
    clipPath ? `image--clip-${clipPath}` : "",
    tilt ? `image--tilt-${tilt}` : "",
    className
  ].filter(Boolean);
  return renderTemplate`${isDecorative ? renderTemplate`${maybeRenderHead()}<img${addAttribute(src, "src")} alt=""${addAttribute(width, "width")}${addAttribute(height, "height")}${addAttribute(loading, "loading")}${addAttribute(imgClasses, "class:list")} aria-hidden="true" role="presentation"${spreadAttributes(dataAttrs)}>` : renderTemplate`<figure class="image" data-role="content"><img${addAttribute(src, "src")}${addAttribute(resolvedAlt, "alt")}${addAttribute(width, "width")}${addAttribute(height, "height")}${addAttribute(loading, "loading")}${addAttribute(imgClasses, "class:list")}${spreadAttributes(dataAttrs)}>${altData?.word && renderTemplate`<span class="image-alt-word" hidden>${altData.word}</span>`}${altData?.descriptive && renderTemplate`<span class="image-alt-descriptive" hidden>${altData.descriptive}</span>`}${altData?.aacHtml && renderTemplate`<span class="image-alt-aac" hidden>${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(altData.aacHtml)}` })}</span>`}</figure>`}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/images/Image/Image.astro", void 0);

const $$TestImageAlt = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Image Alt Text Test" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="max-width: 800px; margin: 80px auto; padding: 2rem;"> <h1>Image Alt Text Test</h1> <h2>1. Content image with assetId</h2> <p>Should render <code>&lt;figure&gt;</code> with hidden alt spans (word, descriptive, aac).</p> ${renderComponent($$result2, "Image", $$Image, { "src": "/images/placeholder.jpg", "assetId": "test-sunset" })} <h2>2. Content image without assetId</h2> <p>Should render <code>&lt;figure&gt;</code> with just the img, no hidden spans.</p> ${renderComponent($$result2, "Image", $$Image, { "src": "/images/placeholder.jpg", "alt": "Manual alt text" })} <h2>3. Decorative image (role prop)</h2> <p>Should render bare <code>&lt;img&gt;</code> with alt="" and aria-hidden.</p> ${renderComponent($$result2, "Image", $$Image, { "src": "/images/placeholder.jpg", "role": "decorative" })} <h2>4. Decorative image (deprecated boolean)</h2> <p>Should render same as #3 — bare <code>&lt;img&gt;</code> via deprecated alias.</p> ${renderComponent($$result2, "Image", $$Image, { "src": "/images/placeholder.jpg", "decorative": true })} </div> ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/test-image-alt.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/test-image-alt.astro";
const $$url = "/test-image-alt";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestImageAlt,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
