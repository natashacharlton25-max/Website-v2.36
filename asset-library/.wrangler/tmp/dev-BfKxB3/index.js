var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-wPFM5F/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/lib/response.ts
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      ...headers
    }
  });
}
__name(json, "json");
function jsonError(status, message) {
  return json({ error: message }, status);
}
__name(jsonError, "jsonError");
function content(body, mimeType, hash, versionNumber, assetId, cacheSecs = 86400) {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "ETag": `"${hash}"`,
      "X-Asset-Id": assetId,
      "X-Version": String(versionNumber),
      "Cache-Control": `public, max-age=${cacheSecs}, stale-while-revalidate=604800`,
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(content, "content");
function notModified() {
  return new Response(null, { status: 304 });
}
__name(notModified, "notModified");
function notFound(what = "Not found") {
  return jsonError(404, what);
}
__name(notFound, "notFound");
function cors() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}
__name(cors, "cors");

// src/lib/auth.ts
function requireAuth(request, env) {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    return jsonError2(401, "Missing Authorization header");
  }
  const token = auth.slice(7);
  if (token !== env.API_TOKEN) {
    return jsonError2(403, "Invalid token");
  }
  return null;
}
__name(requireAuth, "requireAuth");
function jsonError2(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
__name(jsonError2, "jsonError");

// src/types.ts
var MIME_TYPES = {
  svg: "image/svg+xml",
  lottie: "application/json",
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  ico: "image/x-icon"
};
var TEXT_TYPES = /* @__PURE__ */ new Set(["svg", "lottie"]);

// src/lib/id.ts
var ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
var ID_LENGTH = 12;
function generate(length) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < length; i++) {
    id += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return id;
}
__name(generate, "generate");
var makeId = {
  asset: () => `a_${generate(ID_LENGTH)}`,
  version: () => `v_${generate(ID_LENGTH)}`,
  tag: () => `t_${generate(8)}`,
  usage: () => `u_${generate(ID_LENGTH)}`
};

// src/lib/hash.ts
async function hashContent(data) {
  const buffer = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  const hex = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `sha256:${hex}`;
}
__name(hashContent, "hashContent");

// src/lib/metadata.ts
function extractSvgMetadata(svg) {
  const meta = {};
  const vbMatch = svg.match(/viewBox=["']([^"']+)["']/);
  if (vbMatch) {
    meta.viewBox = vbMatch[1];
    const parts = vbMatch[1].split(/\s+/).map(Number);
    if (parts.length === 4) {
      meta.width = parts[2];
      meta.height = parts[3];
    }
  }
  const wMatch = svg.match(/<svg[^>]+width=["'](\d+)/);
  const hMatch = svg.match(/<svg[^>]+height=["'](\d+)/);
  if (wMatch)
    meta.width = parseInt(wMatch[1], 10);
  if (hMatch)
    meta.height = parseInt(hMatch[1], 10);
  meta.hasGradients = /<(linearGradient|radialGradient)/.test(svg);
  return meta;
}
__name(extractSvgMetadata, "extractSvgMetadata");
function extractLottieMetadata(json2) {
  try {
    const data = JSON.parse(json2);
    return {
      width: data.w ?? null,
      height: data.h ?? null,
      frameRate: data.fr ?? null,
      totalFrames: data.op != null && data.ip != null ? data.op - data.ip : null,
      duration: data.fr && data.op != null && data.ip != null ? (data.op - data.ip) / data.fr : null
    };
  } catch {
    return {};
  }
}
__name(extractLottieMetadata, "extractLottieMetadata");
function extractPngDimensions(buffer) {
  const view = new DataView(buffer);
  if (buffer.byteLength >= 24) {
    return {
      width: view.getUint32(16),
      height: view.getUint32(20)
    };
  }
  return {};
}
__name(extractPngDimensions, "extractPngDimensions");
function extractMetadata(type, content2) {
  let meta = {};
  if (type === "svg" && typeof content2 === "string") {
    meta = extractSvgMetadata(content2);
  } else if (type === "lottie" && typeof content2 === "string") {
    meta = extractLottieMetadata(content2);
  } else if (type === "png" && content2 instanceof ArrayBuffer) {
    meta = extractPngDimensions(content2);
  }
  return JSON.stringify(meta);
}
__name(extractMetadata, "extractMetadata");

// src/routes/assets.ts
var WEIGHT_SUFFIXES = ["-fill", "-duotone", "-regular", "-bold", "-thin", "-light"];
function computeBaseName(slug) {
  for (const suffix of WEIGHT_SUFFIXES) {
    if (slug.endsWith(suffix))
      return slug.slice(0, -suffix.length);
  }
  return slug;
}
__name(computeBaseName, "computeBaseName");
async function getAssetBySlug(db, slug) {
  return db.prepare("SELECT * FROM assets WHERE slug = ? AND archived = 0").bind(slug).first();
}
__name(getAssetBySlug, "getAssetBySlug");
async function getCurrentVersion(db, versionId) {
  return db.prepare("SELECT * FROM versions WHERE id = ?").bind(versionId).first();
}
__name(getCurrentVersion, "getCurrentVersion");
async function getAssetTags(db, assetId) {
  const { results } = await db.prepare(
    "SELECT t.name FROM tags t JOIN asset_tags at ON t.id = at.tag_id WHERE at.asset_id = ?"
  ).bind(assetId).all();
  return results.map((r) => r.name);
}
__name(getAssetTags, "getAssetTags");
async function getLicenseInfo(db, licenseKey) {
  return db.prepare("SELECT * FROM licenses WHERE key = ?").bind(licenseKey).first();
}
__name(getLicenseInfo, "getLicenseInfo");
function buildMetaResponse(asset, version, tags, license, usageCount) {
  return {
    id: asset.id,
    name: asset.name,
    slug: asset.slug,
    baseName: asset.base_name,
    type: asset.type,
    source: asset.source,
    license: license ? {
      key: license.key,
      name: license.name,
      permits: JSON.parse(license.permits),
      requires: JSON.parse(license.requires)
    } : { key: asset.license },
    currentVersion: {
      id: version.id,
      number: version.version_number,
      hash: version.hash,
      fileSize: version.file_size,
      mimeType: version.mime_type,
      metadata: version.metadata ? JSON.parse(version.metadata) : null,
      createdAt: version.created_at
    },
    tags,
    ...usageCount !== void 0 ? { usageCount } : {},
    createdAt: asset.created_at,
    updatedAt: asset.updated_at
  };
}
__name(buildMetaResponse, "buildMetaResponse");
async function handleAssetGet(request, env, slug) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format");
  const vParam = url.searchParams.get("v");
  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset)
    return notFound(`Asset not found: ${slug}`);
  let version;
  if (vParam) {
    version = await env.DB.prepare(
      "SELECT * FROM versions WHERE asset_id = ? AND version_number = ?"
    ).bind(asset.id, parseInt(vParam, 10)).first();
    if (!version)
      return notFound(`Version ${vParam} not found for ${slug}`);
  } else {
    version = await getCurrentVersion(env.DB, asset.current_version);
    if (!version)
      return notFound("Current version missing");
  }
  const ifNoneMatch = request.headers.get("If-None-Match");
  if (ifNoneMatch === `"${version.hash}"`) {
    return notModified();
  }
  if (format === "json") {
    const tags = await getAssetTags(env.DB, asset.id);
    const license = await getLicenseInfo(env.DB, asset.license);
    return json(buildMetaResponse(asset, version, tags, license));
  }
  const cacheSecs = vParam ? 31536e3 : 86400;
  if (version.content !== null) {
    if (format === "base64") {
      const b64 = btoa(version.content);
      return json({ slug, version: version.version_number, mimeType: version.mime_type, base64: b64 });
    }
    return content(version.content, version.mime_type, version.hash, version.version_number, asset.id, cacheSecs);
  }
  if (version.r2_key) {
    const object = await env.STORAGE.get(version.r2_key);
    if (!object)
      return jsonError(500, "Binary content missing from storage");
    if (format === "base64") {
      const buf = await object.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = btoa(binary);
      return json({ slug, version: version.version_number, mimeType: version.mime_type, base64: b64 });
    }
    return content(object.body, version.mime_type, version.hash, version.version_number, asset.id, cacheSecs);
  }
  return jsonError(500, "Asset has no content or R2 key");
}
__name(handleAssetGet, "handleAssetGet");
async function handleAssetMeta(request, env, slug) {
  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset)
    return notFound(`Asset not found: ${slug}`);
  const version = await getCurrentVersion(env.DB, asset.current_version);
  if (!version)
    return notFound("Current version missing");
  const tags = await getAssetTags(env.DB, asset.id);
  const license = await getLicenseInfo(env.DB, asset.license);
  const countRow = await env.DB.prepare(
    "SELECT COUNT(*) as cnt FROM usage_log WHERE asset_id = ?"
  ).bind(asset.id).first();
  return json(buildMetaResponse(asset, version, tags, license, countRow?.cnt ?? 0));
}
__name(handleAssetMeta, "handleAssetMeta");
async function handleAssetList(request, env) {
  const url = new URL(request.url);
  const tagFilter = url.searchParams.getAll("tag");
  const typeFilter = url.searchParams.get("type");
  const sourceFilter = url.searchParams.get("source");
  const licenseFilter = url.searchParams.get("license");
  const baseNameFilter = url.searchParams.get("base_name");
  const query = url.searchParams.get("q");
  const updatedAfter = url.searchParams.get("updated_after");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
  let sql = "SELECT DISTINCT a.* FROM assets a";
  const params = [];
  const joins = [];
  const wheres = ["a.archived = 0"];
  if (tagFilter.length > 0) {
    for (let i = 0; i < tagFilter.length; i++) {
      const alias = `at${i}`;
      const tagAlias = `t${i}`;
      joins.push(`JOIN asset_tags ${alias} ON a.id = ${alias}.asset_id JOIN tags ${tagAlias} ON ${alias}.tag_id = ${tagAlias}.id`);
      wheres.push(`${tagAlias}.name = ?`);
      params.push(tagFilter[i]);
    }
  }
  if (typeFilter) {
    wheres.push("a.type = ?");
    params.push(typeFilter);
  }
  if (sourceFilter) {
    wheres.push("a.source = ?");
    params.push(sourceFilter);
  }
  if (licenseFilter) {
    wheres.push("a.license = ?");
    params.push(licenseFilter);
  }
  if (baseNameFilter) {
    wheres.push("a.base_name = ?");
    params.push(baseNameFilter);
  }
  if (query) {
    wheres.push("(a.name LIKE ? OR a.slug LIKE ? OR a.base_name LIKE ?)");
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  }
  if (updatedAfter) {
    wheres.push("a.updated_at > ?");
    params.push(updatedAfter);
  }
  sql += " " + joins.join(" ");
  sql += " WHERE " + wheres.join(" AND ");
  sql += " ORDER BY a.updated_at DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const { results } = await env.DB.prepare(sql).bind(...params).all();
  const items = results.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    baseName: a.base_name,
    type: a.type,
    source: a.source,
    license: a.license,
    createdAt: a.created_at,
    updatedAt: a.updated_at
  }));
  return json({ assets: items, count: items.length, limit, offset });
}
__name(handleAssetList, "handleAssetList");
async function handleAssetCreate(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const formData = await request.formData();
  const file = formData.get("file");
  const name = formData.get("name");
  const slug = formData.get("slug");
  const type = formData.get("type");
  const source = formData.get("source") || "manual";
  const license = formData.get("license") || "unknown";
  const licenseUrl = formData.get("license_url");
  const tagsStr = formData.get("tags") || "";
  const createdBy = formData.get("created_by") || "manual";
  if (!file || !name || !slug || !type) {
    return jsonError(400, "Required fields: file, name, slug, type");
  }
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) && slug.length > 1) {
    return jsonError(400, "Slug must be lowercase alphanumeric with hyphens, no leading/trailing hyphens");
  }
  const existing = await getAssetBySlug(env.DB, slug);
  if (existing) {
    return jsonError(409, `Slug already exists: ${slug}`);
  }
  const isText = TEXT_TYPES.has(type);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const assetId = makeId.asset();
  const versionId = makeId.version();
  let contentStr = null;
  let contentBuf = null;
  let hash;
  let fileSize;
  let r2Key = null;
  let metadata;
  if (isText) {
    contentStr = await file.text();
    hash = await hashContent(contentStr);
    fileSize = new TextEncoder().encode(contentStr).length;
    metadata = extractMetadata(type, contentStr);
  } else {
    contentBuf = await file.arrayBuffer();
    hash = await hashContent(contentBuf);
    fileSize = contentBuf.byteLength;
    metadata = extractMetadata(type, contentBuf);
    r2Key = `assets/${assetId}/${versionId}.${type}`;
  }
  const hashExists = await env.DB.prepare("SELECT asset_id FROM versions WHERE hash = ?").bind(hash).first();
  if (hashExists) {
    const existingAsset = await env.DB.prepare("SELECT slug FROM assets WHERE id = ?").bind(hashExists.asset_id).first();
    return json({
      duplicate: true,
      existingSlug: existingAsset?.slug,
      hash,
      message: "Identical content already exists"
    }, 200);
  }
  const mimeType = MIME_TYPES[type] || "application/octet-stream";
  if (!isText && contentBuf && r2Key) {
    await env.STORAGE.put(r2Key, contentBuf, {
      httpMetadata: { contentType: mimeType },
      customMetadata: { assetId, versionId }
    });
  }
  const baseName = computeBaseName(slug);
  const stmts = [
    env.DB.prepare(
      `INSERT INTO assets (id, name, slug, type, storage, current_version, source, license, license_url, base_name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(assetId, name, slug, type, isText ? "d1" : "r2", versionId, source, license, licenseUrl, baseName, now, now),
    env.DB.prepare(
      `INSERT INTO versions (id, asset_id, version_number, hash, content, r2_key, file_size, mime_type, metadata, created_at, created_by)
       VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(versionId, assetId, hash, contentStr, r2Key, fileSize, mimeType, metadata, now, createdBy)
  ];
  const tagNames = tagsStr.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  for (const tagName of tagNames) {
    const tagId = makeId.tag();
    stmts.push(
      env.DB.prepare("INSERT OR IGNORE INTO tags (id, name, type) VALUES (?, ?, ?)").bind(tagId, tagName, "general")
    );
  }
  await env.DB.batch(stmts);
  if (tagNames.length > 0) {
    const tagStmts = [];
    for (const tagName of tagNames) {
      const tag = await env.DB.prepare("SELECT id FROM tags WHERE name = ?").bind(tagName).first();
      if (tag) {
        tagStmts.push(
          env.DB.prepare("INSERT OR IGNORE INTO asset_tags (asset_id, tag_id) VALUES (?, ?)").bind(assetId, tag.id)
        );
      }
    }
    if (tagStmts.length > 0) {
      await env.DB.batch(tagStmts);
    }
  }
  return json({
    id: assetId,
    slug,
    version: { id: versionId, number: 1, hash },
    message: "Asset created"
  }, 201);
}
__name(handleAssetCreate, "handleAssetCreate");
async function handleAssetUpdate(request, env, slug) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset)
    return notFound(`Asset not found: ${slug}`);
  const formData = await request.formData();
  const file = formData.get("file");
  const createdBy = formData.get("created_by") || "manual";
  if (!file) {
    return jsonError(400, "Required field: file");
  }
  const isText = TEXT_TYPES.has(asset.type);
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const versionId = makeId.version();
  let contentStr = null;
  let contentBuf = null;
  let hash;
  let fileSize;
  let r2Key = null;
  let metadata;
  if (isText) {
    contentStr = await file.text();
    hash = await hashContent(contentStr);
    fileSize = new TextEncoder().encode(contentStr).length;
    metadata = extractMetadata(asset.type, contentStr);
  } else {
    contentBuf = await file.arrayBuffer();
    hash = await hashContent(contentBuf);
    fileSize = contentBuf.byteLength;
    metadata = extractMetadata(asset.type, contentBuf);
    r2Key = `assets/${asset.id}/${versionId}.${asset.type}`;
  }
  const currentVersion = await getCurrentVersion(env.DB, asset.current_version);
  if (currentVersion && currentVersion.hash === hash) {
    return notModified();
  }
  const hashExists = await env.DB.prepare("SELECT id FROM versions WHERE hash = ?").bind(hash).first();
  if (hashExists) {
    return jsonError(409, "Identical content already exists in another asset version");
  }
  const maxVer = await env.DB.prepare(
    "SELECT MAX(version_number) as max_v FROM versions WHERE asset_id = ?"
  ).bind(asset.id).first();
  const nextVersion = (maxVer?.max_v ?? 0) + 1;
  const mimeType = MIME_TYPES[asset.type] || "application/octet-stream";
  if (!isText && contentBuf && r2Key) {
    await env.STORAGE.put(r2Key, contentBuf, {
      httpMetadata: { contentType: mimeType },
      customMetadata: { assetId: asset.id, versionId }
    });
  }
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO versions (id, asset_id, version_number, hash, content, r2_key, file_size, mime_type, metadata, created_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(versionId, asset.id, nextVersion, hash, contentStr, r2Key, fileSize, mimeType, metadata, now, createdBy),
    env.DB.prepare(
      "UPDATE assets SET current_version = ?, updated_at = ? WHERE id = ?"
    ).bind(versionId, now, asset.id)
  ]);
  return json({
    id: asset.id,
    slug,
    version: { id: versionId, number: nextVersion, hash },
    message: "New version created"
  });
}
__name(handleAssetUpdate, "handleAssetUpdate");
async function handleAssetPatch(request, env, slug) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset)
    return notFound(`Asset not found: ${slug}`);
  const body = await request.json();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const stmts = [];
  if (body.name) {
    stmts.push(env.DB.prepare("UPDATE assets SET name = ?, updated_at = ? WHERE id = ?").bind(body.name, now, asset.id));
  }
  if (body.license) {
    stmts.push(env.DB.prepare("UPDATE assets SET license = ?, updated_at = ? WHERE id = ?").bind(body.license, now, asset.id));
  }
  if (body.license_url !== void 0) {
    stmts.push(env.DB.prepare("UPDATE assets SET license_url = ?, updated_at = ? WHERE id = ?").bind(body.license_url, now, asset.id));
  }
  if (Array.isArray(body.tags)) {
    stmts.push(env.DB.prepare("DELETE FROM asset_tags WHERE asset_id = ?").bind(asset.id));
    if (stmts.length > 0)
      await env.DB.batch(stmts);
    stmts.length = 0;
    for (const tagName of body.tags) {
      const clean = tagName.trim().toLowerCase();
      if (!clean)
        continue;
      const tagId = makeId.tag();
      await env.DB.prepare("INSERT OR IGNORE INTO tags (id, name, type) VALUES (?, ?, ?)").bind(tagId, clean, "general").run();
      const tag = await env.DB.prepare("SELECT id FROM tags WHERE name = ?").bind(clean).first();
      if (tag) {
        stmts.push(env.DB.prepare("INSERT OR IGNORE INTO asset_tags (asset_id, tag_id) VALUES (?, ?)").bind(asset.id, tag.id));
      }
    }
  }
  if (stmts.length > 0) {
    await env.DB.batch(stmts);
  }
  return json({ slug, message: "Metadata updated" });
}
__name(handleAssetPatch, "handleAssetPatch");
async function handleAssetDelete(request, env, slug) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const asset = await getAssetBySlug(env.DB, slug);
  if (!asset)
    return notFound(`Asset not found: ${slug}`);
  await env.DB.prepare("UPDATE assets SET archived = 1, updated_at = ? WHERE id = ?").bind((/* @__PURE__ */ new Date()).toISOString(), asset.id).run();
  return json({ slug, message: "Asset archived" });
}
__name(handleAssetDelete, "handleAssetDelete");

// src/routes/versions.ts
async function handleVersionList(_request, env, slug) {
  const asset = await env.DB.prepare("SELECT id FROM assets WHERE slug = ? AND archived = 0").bind(slug).first();
  if (!asset)
    return notFound(`Asset not found: ${slug}`);
  const { results } = await env.DB.prepare(
    "SELECT id, version_number, hash, file_size, mime_type, metadata, created_at, created_by FROM versions WHERE asset_id = ? ORDER BY version_number DESC"
  ).bind(asset.id).all();
  return json({
    assetId: asset.id,
    slug,
    versions: results.map((v) => ({
      id: v.id,
      number: v.version_number,
      hash: v.hash,
      fileSize: v.file_size,
      mimeType: v.mime_type,
      metadata: v.metadata ? JSON.parse(v.metadata) : null,
      createdAt: v.created_at,
      createdBy: v.created_by
    }))
  });
}
__name(handleVersionList, "handleVersionList");
async function handleRollback(request, env, slug) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const asset = await env.DB.prepare("SELECT * FROM assets WHERE slug = ? AND archived = 0").bind(slug).first();
  if (!asset)
    return notFound(`Asset not found: ${slug}`);
  const body = await request.json();
  if (!body.version || typeof body.version !== "number") {
    return jsonError(400, "Required: version (number)");
  }
  const targetVersion = await env.DB.prepare(
    "SELECT id, version_number, hash FROM versions WHERE asset_id = ? AND version_number = ?"
  ).bind(asset.id, body.version).first();
  if (!targetVersion) {
    return notFound(`Version ${body.version} not found for ${slug}`);
  }
  if (targetVersion.id === asset.current_version) {
    return json({ slug, message: "Already on this version", version: body.version });
  }
  await env.DB.prepare("UPDATE assets SET current_version = ?, updated_at = ? WHERE id = ?").bind(targetVersion.id, (/* @__PURE__ */ new Date()).toISOString(), asset.id).run();
  return json({
    slug,
    message: `Rolled back to version ${body.version}`,
    version: { id: targetVersion.id, number: targetVersion.version_number, hash: targetVersion.hash }
  });
}
__name(handleRollback, "handleRollback");

// src/routes/tags.ts
async function handleTagList(request, env) {
  const url = new URL(request.url);
  const typeFilter = url.searchParams.get("type");
  let sql = "SELECT t.*, COUNT(at.asset_id) as asset_count FROM tags t LEFT JOIN asset_tags at ON t.id = at.tag_id";
  const params = [];
  if (typeFilter) {
    sql += " WHERE t.type = ?";
    params.push(typeFilter);
  }
  sql += " GROUP BY t.id ORDER BY t.type, t.name";
  const { results } = await env.DB.prepare(sql).bind(...params).all();
  return json({
    tags: results.map((t) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      assetCount: t.asset_count
    }))
  });
}
__name(handleTagList, "handleTagList");
async function handleTagCreate(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const body = await request.json();
  if (!body.name)
    return jsonError(400, "Required: name");
  const name = body.name.trim().toLowerCase();
  const type = body.type || "general";
  const id = makeId.tag();
  const existing = await env.DB.prepare("SELECT id FROM tags WHERE name = ?").bind(name).first();
  if (existing) {
    return json({ id: existing.id, name, type, message: "Tag already exists" }, 200);
  }
  await env.DB.prepare("INSERT INTO tags (id, name, type) VALUES (?, ?, ?)").bind(id, name, type).run();
  return json({ id, name, type, message: "Tag created" }, 201);
}
__name(handleTagCreate, "handleTagCreate");

// src/routes/brands.ts
async function handleBrandAssets(_request, env, brand) {
  const { results } = await env.DB.prepare(
    `SELECT ba.role, a.id, a.slug, a.name, a.type
     FROM brand_assets ba
     JOIN assets a ON ba.asset_id = a.id
     WHERE ba.brand = ? AND a.archived = 0
     ORDER BY ba.role`
  ).bind(brand).all();
  if (results.length === 0)
    return notFound(`No assets found for brand: ${brand}`);
  const assets = {};
  for (const r of results) {
    assets[r.role] = { id: r.id, slug: r.slug, name: r.name, type: r.type };
  }
  return json({ brand, assets });
}
__name(handleBrandAssets, "handleBrandAssets");
async function handleBrandAssetAssign(request, env, brand) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const body = await request.json();
  if (!body.asset_id || !body.role) {
    return jsonError(400, "Required: asset_id, role");
  }
  const asset = await env.DB.prepare("SELECT id FROM assets WHERE id = ? AND archived = 0").bind(body.asset_id).first();
  if (!asset)
    return notFound("Asset not found");
  await env.DB.prepare(
    `INSERT INTO brand_assets (brand, asset_id, role) VALUES (?, ?, ?)
     ON CONFLICT(brand, role) DO UPDATE SET asset_id = excluded.asset_id`
  ).bind(brand, body.asset_id, body.role).run();
  return json({ brand, role: body.role, assetId: body.asset_id, message: "Brand asset assigned" }, 201);
}
__name(handleBrandAssetAssign, "handleBrandAssetAssign");

// src/routes/licenses.ts
async function handleLicenseList(_request, env) {
  const { results } = await env.DB.prepare("SELECT * FROM licenses ORDER BY key").all();
  return json(results.map((l) => ({
    key: l.key,
    name: l.name,
    url: l.url,
    permits: JSON.parse(l.permits),
    requires: JSON.parse(l.requires),
    notes: l.notes
  })));
}
__name(handleLicenseList, "handleLicenseList");

// src/routes/usage.ts
async function handleUsageLog(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const body = await request.json();
  if (!body.slug || !body.consumer) {
    return jsonError(400, "Required: slug, consumer");
  }
  const asset = await env.DB.prepare(
    "SELECT id, current_version FROM assets WHERE slug = ? AND archived = 0"
  ).bind(body.slug).first();
  if (!asset)
    return notFound(`Asset not found: ${body.slug}`);
  const id = makeId.usage();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await env.DB.prepare(
    `INSERT INTO usage_log (id, asset_id, version_id, consumer, context, brand, action, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, asset.id, asset.current_version, body.consumer, body.context ?? null, body.brand ?? null, body.action ?? "render", now).run();
  return json({ id, message: "Usage logged" }, 201);
}
__name(handleUsageLog, "handleUsageLog");
async function handleUsageBatch(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const body = await request.json();
  if (!body.events || !Array.isArray(body.events)) {
    return jsonError(400, "Required: events (array)");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const stmts = [];
  let logged = 0;
  let skipped = 0;
  for (const event of body.events) {
    if (!event.slug || !event.consumer) {
      skipped++;
      continue;
    }
    const asset = await env.DB.prepare(
      "SELECT id, current_version FROM assets WHERE slug = ? AND archived = 0"
    ).bind(event.slug).first();
    if (!asset) {
      skipped++;
      continue;
    }
    stmts.push(
      env.DB.prepare(
        `INSERT INTO usage_log (id, asset_id, version_id, consumer, context, brand, action, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(makeId.usage(), asset.id, asset.current_version, event.consumer, event.context ?? null, body.brand ?? null, event.action ?? "render", now)
    );
    logged++;
  }
  for (let i = 0; i < stmts.length; i += 50) {
    await env.DB.batch(stmts.slice(i, i + 50));
  }
  return json({ logged, skipped, message: "Batch usage logged" }, 201);
}
__name(handleUsageBatch, "handleUsageBatch");
async function handleUsageGet(request, env, slug) {
  const url = new URL(request.url);
  const consumer = url.searchParams.get("consumer");
  const after = url.searchParams.get("after");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10), 200);
  const asset = await env.DB.prepare("SELECT id FROM assets WHERE slug = ? AND archived = 0").bind(slug).first();
  if (!asset)
    return notFound(`Asset not found: ${slug}`);
  let sql = `SELECT u.consumer, u.context, u.brand, u.action, u.created_at,
             v.version_number FROM usage_log u
             JOIN versions v ON u.version_id = v.id
             WHERE u.asset_id = ?`;
  const params = [asset.id];
  if (consumer) {
    sql += " AND u.consumer = ?";
    params.push(consumer);
  }
  if (after) {
    sql += " AND u.created_at > ?";
    params.push(after);
  }
  sql += " ORDER BY u.created_at DESC LIMIT ?";
  params.push(limit);
  const { results } = await env.DB.prepare(sql).bind(...params).all();
  const countRow = await env.DB.prepare("SELECT COUNT(*) as cnt FROM usage_log WHERE asset_id = ?").bind(asset.id).first();
  return json({
    assetId: asset.id,
    slug,
    totalUsages: countRow?.cnt ?? 0,
    usages: results.map((r) => ({
      consumer: r.consumer,
      context: r.context,
      brand: r.brand,
      version: r.version_number,
      action: r.action,
      at: r.created_at
    }))
  });
}
__name(handleUsageGet, "handleUsageGet");
async function handleOrphans(_request, env) {
  const { results } = await env.DB.prepare(
    `SELECT a.id, a.slug, a.name, a.source, a.type, a.created_at,
     (SELECT MAX(u.created_at) FROM usage_log u WHERE u.asset_id = a.id) as last_used
     FROM assets a
     LEFT JOIN usage_log ul ON a.id = ul.asset_id
     WHERE a.archived = 0
     GROUP BY a.id
     HAVING COUNT(ul.id) = 0
     ORDER BY a.created_at ASC
     LIMIT 100`
  ).all();
  return json({
    unusedAssets: results.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      source: r.source,
      type: r.type,
      createdAt: r.created_at,
      lastUsed: r.last_used
    }))
  });
}
__name(handleOrphans, "handleOrphans");

// src/routes/verify.ts
async function handleVerify(request, env) {
  const body = await request.json();
  if (!body.slug || !body.hash) {
    return jsonError(400, "Required: slug, hash");
  }
  const asset = await env.DB.prepare(
    "SELECT id, current_version FROM assets WHERE slug = ? AND archived = 0"
  ).bind(body.slug).first();
  if (!asset)
    return notFound(`Asset not found: ${body.slug}`);
  const version = await env.DB.prepare(
    "SELECT hash, version_number FROM versions WHERE id = ?"
  ).bind(asset.current_version).first();
  if (!version)
    return jsonError(500, "Current version missing");
  const valid = version.hash === body.hash;
  return json({
    valid,
    version: version.version_number,
    ...valid ? {} : { expected: version.hash }
  });
}
__name(handleVerify, "handleVerify");

// src/routes/bulk.ts
var WEIGHT_SUFFIXES2 = ["-fill", "-duotone", "-regular", "-bold", "-thin", "-light"];
function computeBaseName2(slug) {
  for (const suffix of WEIGHT_SUFFIXES2) {
    if (slug.endsWith(suffix))
      return slug.slice(0, -suffix.length);
  }
  return slug;
}
__name(computeBaseName2, "computeBaseName");
async function handleBulkImport(request, env) {
  const authErr = requireAuth(request, env);
  if (authErr)
    return authErr;
  const body = await request.json();
  if (!body.assets || !Array.isArray(body.assets)) {
    return jsonError(400, "Required: assets (array)");
  }
  if (body.assets.length > 200) {
    return jsonError(400, "Maximum 200 assets per bulk request");
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const results = [];
  const allTagNames = /* @__PURE__ */ new Set();
  for (const asset of body.assets) {
    if (asset.tags) {
      for (const t of asset.tags)
        allTagNames.add(t.trim().toLowerCase());
    }
  }
  const tagStmts = [];
  for (const tagName of allTagNames) {
    tagStmts.push(
      env.DB.prepare("INSERT OR IGNORE INTO tags (id, name, type) VALUES (?, ?, ?)").bind(makeId.tag(), tagName, "general")
    );
  }
  if (tagStmts.length > 0) {
    for (let i = 0; i < tagStmts.length; i += 50) {
      await env.DB.batch(tagStmts.slice(i, i + 50));
    }
  }
  const tagMap = /* @__PURE__ */ new Map();
  const { results: tagRows } = await env.DB.prepare("SELECT id, name FROM tags").all();
  for (const row of tagRows) {
    tagMap.set(row.name, row.id);
  }
  const BATCH_SIZE = 25;
  for (let batchStart = 0; batchStart < body.assets.length; batchStart += BATCH_SIZE) {
    const batch = body.assets.slice(batchStart, batchStart + BATCH_SIZE);
    const stmts = [];
    const tagLinkStmts = [];
    const batchResults = [];
    for (const asset of batch) {
      if (!asset.name || !asset.slug || !asset.type) {
        batchResults.push({ slug: asset.slug || "?", status: "error", error: "Missing required fields: name, slug, type" });
        continue;
      }
      if (!asset.content && !asset.content_base64) {
        batchResults.push({ slug: asset.slug, status: "error", error: "Must provide content or content_base64" });
        continue;
      }
      const existing = await env.DB.prepare("SELECT id FROM assets WHERE slug = ?").bind(asset.slug).first();
      if (existing) {
        batchResults.push({ slug: asset.slug, status: "skipped", error: "Slug already exists" });
        continue;
      }
      const isText = TEXT_TYPES.has(asset.type);
      const assetId = makeId.asset();
      const versionId = makeId.version();
      let contentStr = null;
      let contentBuf = null;
      let hash;
      let fileSize;
      let r2Key = null;
      let metadata;
      const mimeType = MIME_TYPES[asset.type] || "application/octet-stream";
      if (isText && asset.content) {
        contentStr = asset.content;
        hash = await hashContent(contentStr);
        fileSize = new TextEncoder().encode(contentStr).length;
        metadata = extractMetadata(asset.type, contentStr);
      } else if (asset.content_base64) {
        const binary = atob(asset.content_base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++)
          bytes[i] = binary.charCodeAt(i);
        contentBuf = bytes.buffer;
        hash = await hashContent(contentBuf);
        fileSize = contentBuf.byteLength;
        metadata = extractMetadata(asset.type, contentBuf);
        r2Key = `assets/${assetId}/${versionId}.${asset.type}`;
      } else {
        batchResults.push({ slug: asset.slug, status: "error", error: "Text type requires content field" });
        continue;
      }
      const hashExists = await env.DB.prepare("SELECT id FROM versions WHERE hash = ?").bind(hash).first();
      if (hashExists) {
        batchResults.push({ slug: asset.slug, status: "skipped", hash, error: "Identical content already exists" });
        continue;
      }
      if (!isText && contentBuf && r2Key) {
        await env.STORAGE.put(r2Key, contentBuf, {
          httpMetadata: { contentType: mimeType },
          customMetadata: { assetId, versionId }
        });
      }
      const baseName = computeBaseName2(asset.slug);
      stmts.push(
        env.DB.prepare(
          `INSERT INTO assets (id, name, slug, type, storage, current_version, source, license, license_url, base_name, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          assetId,
          asset.name,
          asset.slug,
          asset.type,
          isText ? "d1" : "r2",
          versionId,
          asset.source ?? "import",
          asset.license ?? "unknown",
          asset.license_url ?? null,
          baseName,
          now,
          now
        )
      );
      stmts.push(
        env.DB.prepare(
          `INSERT INTO versions (id, asset_id, version_number, hash, content, r2_key, file_size, mime_type, metadata, created_at, created_by)
           VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(versionId, assetId, hash, contentStr, r2Key, fileSize, mimeType, metadata, now, asset.created_by ?? "import")
      );
      if (asset.tags) {
        for (const tagName of asset.tags) {
          const clean = tagName.trim().toLowerCase();
          const tagId = tagMap.get(clean);
          if (tagId) {
            tagLinkStmts.push(
              env.DB.prepare("INSERT OR IGNORE INTO asset_tags (asset_id, tag_id) VALUES (?, ?)").bind(assetId, tagId)
            );
          }
        }
      }
      batchResults.push({ slug: asset.slug, status: "created", id: assetId, hash });
    }
    if (stmts.length > 0) {
      await env.DB.batch(stmts);
    }
    if (tagLinkStmts.length > 0) {
      for (let i = 0; i < tagLinkStmts.length; i += 50) {
        await env.DB.batch(tagLinkStmts.slice(i, i + 50));
      }
    }
    results.push(...batchResults);
  }
  const created = results.filter((r) => r.status === "created").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors = results.filter((r) => r.status === "error").length;
  return json({
    total: body.assets.length,
    created,
    skipped,
    errors,
    results
  }, 201);
}
__name(handleBulkImport, "handleBulkImport");

// src/index.ts
var src_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return cors();
    }
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    if (path === "/v1/health") {
      return new Response(JSON.stringify({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    const authErr = requireAuth(request, env);
    if (authErr)
      return authErr;
    try {
      if (method === "POST" && path === "/v1/assets/bulk") {
        return handleBulkImport(request, env);
      }
      if (method === "POST" && path === "/v1/assets/verify") {
        return handleVerify(request, env);
      }
      if (method === "POST" && path === "/v1/usage/batch") {
        return handleUsageBatch(request, env);
      }
      if (method === "GET" && path === "/v1/usage/orphans") {
        return handleOrphans(request, env);
      }
      if (method === "POST" && path === "/v1/usage") {
        return handleUsageLog(request, env);
      }
      const versionsMatch = path.match(/^\/v1\/assets\/([^/]+)\/versions$/);
      if (versionsMatch) {
        if (method === "GET")
          return handleVersionList(request, env, versionsMatch[1]);
        return jsonError(405, "Method not allowed");
      }
      const usageMatch = path.match(/^\/v1\/assets\/([^/]+)\/usage$/);
      if (usageMatch) {
        if (method === "GET")
          return handleUsageGet(request, env, usageMatch[1]);
        return jsonError(405, "Method not allowed");
      }
      const rollbackMatch = path.match(/^\/v1\/assets\/([^/]+)\/rollback$/);
      if (rollbackMatch) {
        if (method === "POST")
          return handleRollback(request, env, rollbackMatch[1]);
        return jsonError(405, "Method not allowed");
      }
      const metaMatch = path.match(/^\/v1\/assets\/([^/]+)\/meta$/);
      if (metaMatch) {
        if (method === "GET")
          return handleAssetMeta(request, env, metaMatch[1]);
        return jsonError(405, "Method not allowed");
      }
      const assetMatch = path.match(/^\/v1\/assets\/([^/]+)$/);
      if (assetMatch) {
        const slug = assetMatch[1];
        if (method === "GET")
          return handleAssetGet(request, env, slug);
        if (method === "PUT")
          return handleAssetUpdate(request, env, slug);
        if (method === "PATCH")
          return handleAssetPatch(request, env, slug);
        if (method === "DELETE")
          return handleAssetDelete(request, env, slug);
        return jsonError(405, "Method not allowed");
      }
      if (path === "/v1/assets") {
        if (method === "GET")
          return handleAssetList(request, env);
        if (method === "POST")
          return handleAssetCreate(request, env);
        return jsonError(405, "Method not allowed");
      }
      if (path === "/v1/tags") {
        if (method === "GET")
          return handleTagList(request, env);
        if (method === "POST")
          return handleTagCreate(request, env);
        return jsonError(405, "Method not allowed");
      }
      const brandMatch = path.match(/^\/v1\/brands\/([^/]+)\/assets$/);
      if (brandMatch) {
        if (method === "GET")
          return handleBrandAssets(request, env, brandMatch[1]);
        if (method === "POST")
          return handleBrandAssetAssign(request, env, brandMatch[1]);
        return jsonError(405, "Method not allowed");
      }
      if (path === "/v1/licenses") {
        if (method === "GET")
          return handleLicenseList(request, env);
        return jsonError(405, "Method not allowed");
      }
      return jsonError(404, `No route: ${method} ${path}`);
    } catch (err) {
      console.error("Unhandled error:", err);
      const message = err instanceof Error ? err.message : "Internal server error";
      return jsonError(500, message);
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError3 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError3;

// .wrangler/tmp/bundle-wPFM5F/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-wPFM5F/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
