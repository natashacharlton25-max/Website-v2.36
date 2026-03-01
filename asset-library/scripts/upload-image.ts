/**
 * Upload an image to R2 and register it in D1.
 *
 * Usage:
 *   npx tsx scripts/upload-image.ts \
 *     --file path/to/image.jpg \
 *     --name therapy-room \
 *     --brand mtb \
 *     --category hero \
 *     --alt "A warm therapy room with soft lighting"
 */

import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import imageSize from 'image-size';

// ─── Parse CLI args ─────────────────────────
function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    parsed[args[i].replace(/^--/, '')] = args[i + 1];
  }
  const required = ['file', 'name', 'brand', 'category'];
  for (const key of required) {
    if (!parsed[key]) {
      console.error(`Missing required arg: --${key}`);
      process.exit(1);
    }
  }
  return parsed;
}

const args = parseArgs();
const filePath = args.file;
const name = args.name;
const brand = args.brand;
const category = args.category;
const altText = args.alt || null;

// ─── 1. Read file, compute SHA-256, take first 6 chars ──
const fileBuffer = readFileSync(filePath);
const fullHash = createHash('sha256').update(fileBuffer).digest('hex');
const hash = fullHash.slice(0, 6);
const ext = extname(filePath).slice(1).toLowerCase();
const mimeMap: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', gif: 'image/gif', avif: 'image/avif',
};
const mimeType = mimeMap[ext] || 'application/octet-stream';
const fileSize = fileBuffer.length;

// ─── 2. Build ID ────────────────────────────
const id = `${brand}_${category}_${name}_${hash}`;
console.log(`ID: ${id}`);

// ─── 3. Determine version ───────────────────
function d1Query(sql: string): string {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  return execSync(cmd, { encoding: 'utf-8', cwd: process.cwd() });
}

let version = 1;
let existingHash: string | null = null;
let metadataOnly = false;

try {
  const result = JSON.parse(d1Query(`SELECT version, file_hash FROM assets WHERE id = '${id}'`));
  const rows = result[0]?.results;
  if (rows && rows.length > 0) {
    existingHash = rows[0].file_hash;
    if (existingHash === hash) {
      // Same file content — metadata-only update (alt text, etc.)
      version = rows[0].version || 1;
      metadataOnly = true;
      console.log(`Same file hash (${hash}) — metadata-only update, staying at v${version}`);
    } else {
      version = (rows[0].version || 1) + 1;
      console.log(`File hash changed (${existingHash} → ${hash}) — incrementing to v${version}`);
    }
  }
} catch {
  /* new asset */
}

const escapeSql = (s: string) => s.replace(/'/g, "''");
const now = new Date().toISOString();
const slug = name;
const versionId = `${id}_v${version}`;
const r2Key = `images/${name}_${hash}/v${version}.${ext}`;
const workerUrl = 'https://asset-library.natashacharlton25.workers.dev';
const cdnUrl = `${workerUrl}/${r2Key}`;

// ─── 4. Get image dimensions ────────────────
const dimensions = imageSize(fileBuffer);
const width = dimensions.width || 0;
const height = dimensions.height || 0;

if (metadataOnly) {
  // ─── Metadata-only: just update alt text + timestamps ──
  const setClauses = [`updated_at = '${now}'`];
  if (altText) setClauses.push(`alt_descriptive = '${escapeSql(altText)}'`);
  d1Query(`UPDATE assets SET ${setClauses.join(', ')} WHERE id = '${id}'`);
  console.log('D1 assets row updated (metadata only)');
} else {
  // ─── 5. Upload to R2 ───────────────────────
  console.log(`R2 key: ${r2Key}`);
  execSync(
    `npx wrangler r2 object put "asset-library/${r2Key}" --file="${filePath}" --content-type="${mimeType}"`,
    { stdio: 'inherit', cwd: process.cwd() },
  );

  // ─── 6. Insert/update D1 assets row ─────────
  if (version === 1) {
    const altCol = altText ? ', alt_descriptive' : '';
    const altVal = altText ? `, '${escapeSql(altText)}'` : '';
    d1Query(
      `INSERT INTO assets (id, name, slug, base_name, type, storage, current_version, source, license, created_at, updated_at, archived, category, brand, version, file_hash, semantic_role, url, mime_type, width, height, file_size${altCol})` +
      ` VALUES ('${id}', '${escapeSql(name)}', '${escapeSql(slug)}', '${escapeSql(name)}', 'image', 'r2', '${versionId}', 'upload-script', 'proprietary', '${now}', '${now}', 0, '${category}', '${brand}', ${version}, '${hash}', 'content-symbol', '${cdnUrl}', '${mimeType}', ${width}, ${height}, ${fileSize}${altVal})`,
    );
    console.log('D1 assets row inserted');
  } else {
    const altClause = altText ? `, alt_descriptive = '${escapeSql(altText)}'` : '';
    d1Query(
      `UPDATE assets SET version = ${version}, file_hash = '${hash}', url = '${cdnUrl}', current_version = '${versionId}', mime_type = '${mimeType}', width = ${width}, height = ${height}, file_size = ${fileSize}, updated_at = '${now}'${altClause} WHERE id = '${id}'`,
    );
    console.log('D1 assets row updated');
  }

  // ─── 7. Insert versions row ─────────────────
  d1Query(
    `INSERT INTO versions (id, asset_id, version_number, hash, r2_key, file_size, mime_type, created_at, created_by)` +
    ` VALUES ('${versionId}', '${id}', ${version}, 'sha256:${fullHash}', '${r2Key}', ${fileSize}, '${mimeType}', '${now}', 'upload-script')`,
  );
  console.log(`Version row inserted: ${versionId}`);
}

// ─── 9. Check alt_symbols for match ─────────
const wordForm = name.replace(/-/g, ' ');
try {
  const altResult = JSON.parse(d1Query(`SELECT id, word FROM alt_symbols WHERE word = '${escapeSql(wordForm)}'`));
  const altRows = altResult[0]?.results;
  if (altRows && altRows.length > 0) {
    const symbolId = altRows[0].id;
    d1Query(`UPDATE assets SET alt_symbol_id = '${symbolId}' WHERE id = '${id}'`);
    console.log(`Linked alt_symbol: "${altRows[0].word}" (${symbolId})`);
  } else {
    console.log(`No alt_symbol match for "${wordForm}"`);
  }
} catch {
  console.log('Alt symbol lookup skipped');
}

// ─── 10. Summary ────────────────────────────
console.log('\n═══ Upload complete ═══');
console.log(`  ID:       ${id}`);
console.log(`  R2 key:   ${r2Key}`);
console.log(`  CDN URL:  ${cdnUrl}`);
console.log(`  Size:     ${width}×${height}, ${(fileSize / 1024).toFixed(1)} KB`);
console.log(`  Alt text: ${altText || '(none)'}`);
console.log(`  Version:  ${version}`);
