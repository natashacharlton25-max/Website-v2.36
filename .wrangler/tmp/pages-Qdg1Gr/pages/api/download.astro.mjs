globalThis.process ??= {}; globalThis.process.env ??= {};
import { g as getCollection } from '../../chunks/_astro_content_D40xraF-.mjs';
import { v as validateDownloadToken, r as recordDownload } from '../../chunks/db_nxfieeIM.mjs';
export { renderers } from '../../renderers.mjs';

const getSlugFromId = (id) => {
  const normalized = id.replace(/[\\/]index\.md$/, "");
  return normalized.split(/[\\/]/).pop() || id;
};
const GET = async ({ url, redirect, locals }) => {
  try {
    const token = url.searchParams.get("token");
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing download token"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const runtime = locals.runtime;
    const db = runtime?.env?.DB;
    if (!db) {
      console.error("D1 database not available");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database not configured"
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const tokenData = await validateDownloadToken(db, token);
    if (!tokenData) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid or expired download token"
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const { userId, assetId } = tokenData;
    const assets = await getCollection("assets");
    const asset = assets.find((a) => getSlugFromId(a.id) === assetId || a.data.id === assetId);
    if (!asset || !asset.data.downloadUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Asset not found or no download available"
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    await recordDownload(db, userId, assetId, asset.data.name);
    const downloadUrl = asset.data.downloadUrl;
    return redirect(downloadUrl, 302);
  } catch (error) {
    console.error("Download error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An error occurred. Please try again."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
