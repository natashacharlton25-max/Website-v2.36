/**
 * Lottie Icon Seed Script
 *
 * Imports animated Lottie JSON files from public/Icons/Animated Icons/
 * into the Asset Library D1 database, and creates lottie_mappings entries
 * linking each animation to its static Phosphor SVG fallback.
 *
 * Usage:
 *   npx tsx scripts/seed-lottie.ts
 *
 * Environment:
 *   ASSET_API_URL  — e.g. https://asset-library.natashacharlton25.workers.dev
 *   API_TOKEN      — your bearer token
 *   ICONS_ROOT     — path to public/Icons/ (default: ../public/Icons)
 */

import fs from 'node:fs';
import path from 'node:path';

const API_URL = process.env.ASSET_API_URL || 'http://localhost:8787';
const TOKEN = process.env.API_TOKEN || '';
const ICONS_ROOT = process.env.ICONS_ROOT || path.join(process.cwd(), '..', 'public', 'Icons');
const ANIMATED_DIR = path.join(ICONS_ROOT, 'Animated Icons');

// ─── Lottie file → slug + static fallback mapping ──────
// slug: what we store it as in D1
// file: relative path from Animated Icons/
// staticFallback: slug of the Phosphor SVG in D1 (fill weight)

interface LottieDef {
  slug: string;
  file: string;
  staticFallback: string;
  tags: string[];
}

const LOTTIE_DEFS: LottieDef[] = [
  // ── Nav icons ─────────────────────────────────────────
  { slug: 'lottie-menu',           file: 'Menu V2/menuV2.json',                     staticFallback: 'list-fill',              tags: ['lottie', 'nav'] },
  { slug: 'lottie-search',         file: 'Search/Lottie-search.json',               staticFallback: 'magnifying-glass-fill',  tags: ['lottie', 'nav'] },
  { slug: 'lottie-visibility',     file: 'Visibility V3/visibility-V3.json',         staticFallback: 'eye-fill',              tags: ['lottie', 'nav', 'a11y'] },
  { slug: 'lottie-mail',           file: 'Mail/mail.json',                          staticFallback: 'envelope-simple-fill',   tags: ['lottie', 'nav', 'contact'] },
  { slug: 'lottie-share',          file: 'Share/share.json',                        staticFallback: 'share-network-fill',     tags: ['lottie', 'nav'] },
  { slug: 'lottie-plus-to-x',     file: 'Plus to X/plusToX.json',                   staticFallback: 'plus-fill',             tags: ['lottie', 'nav'] },
  { slug: 'lottie-maximize',       file: 'Maximize-minimize V2/maximizeMinimizeV2.json', staticFallback: 'arrows-out-fill',  tags: ['lottie', 'nav'] },

  // ── Basket / cart icons ───────────────────────────────
  { slug: 'lottie-basket-hover',   file: 'Basket Icons/lottie-basket-hover-pinch.json',  staticFallback: 'shopping-cart-fill', tags: ['lottie', 'shop'] },
  { slug: 'lottie-basket-reveal',  file: 'Basket Icons/lottie-basket-in-reveal.json',    staticFallback: 'shopping-cart-fill', tags: ['lottie', 'shop'] },
  { slug: 'lottie-basket-loop',    file: 'Basket Icons/lottie-basket-loop-cycle.json',   staticFallback: 'shopping-cart-fill', tags: ['lottie', 'shop'] },
  { slug: 'lottie-basket-morph',   file: 'Basket Icons/lottie-basket-morph-fill.json',   staticFallback: 'shopping-cart-fill', tags: ['lottie', 'shop'] },

  // ── Toast icons ───────────────────────────────────────
  { slug: 'lottie-toast-activity',       file: 'Toast Icons/Activity/Lottie-toast-activity.json',                staticFallback: 'lightning-fill',          tags: ['lottie', 'toast'] },
  { slug: 'lottie-toast-alert',          file: 'Toast Icons/Alert triangle/Lottie-toast-alert-triangle.json',    staticFallback: 'warning-fill',            tags: ['lottie', 'toast'] },
  { slug: 'lottie-toast-info',           file: 'Toast Icons/Info/Lottie-toast-info.json',                        staticFallback: 'info-fill',               tags: ['lottie', 'toast'] },
  { slug: 'lottie-toast-notification',   file: 'Toast Icons/NotificationV3/Lottie-toast-notification-v3.json',   staticFallback: 'bell-fill',               tags: ['lottie', 'toast'] },
  { slug: 'lottie-toast-thumbup',        file: 'Toast Icons/Thumb up/Lottie-toast-thumb-up.json',                staticFallback: 'thumbs-up-fill',          tags: ['lottie', 'toast'] },

  // ── Unused / archived (import with deprecated tag) ────
  { slug: 'lottie-arrow-left',           file: '_unused Icons/Arrow-left-circle/arrowLeftCircle.json',   staticFallback: 'arrow-circle-left-fill',  tags: ['lottie', 'deprecated'] },
  { slug: 'lottie-arrow-right',          file: '_unused Icons/Arrow-right-circle/arrowRightCircle.json', staticFallback: 'arrow-circle-right-fill', tags: ['lottie', 'deprecated'] },
  { slug: 'lottie-menu-burger',          file: '_unused Icons/Burger menu/menu.json',                    staticFallback: 'list-fill',               tags: ['lottie', 'deprecated'] },
  { slug: 'lottie-download',             file: '_unused Icons/Download/download.json',                   staticFallback: 'download-simple-fill',    tags: ['lottie', 'deprecated'] },
  { slug: 'lottie-toast-help',           file: '_unused Icons/Help/Lottie-toast-help.json',              staticFallback: 'question-fill',           tags: ['lottie', 'deprecated', 'toast'] },
  { slug: 'lottie-toast-notification-v4',file: '_unused Icons/NotificationV4/Lottie-toast-notification-v4.json', staticFallback: 'bell-fill',       tags: ['lottie', 'deprecated', 'toast'] },
  { slug: 'lottie-toast-star',           file: '_unused Icons/Star/lottie-toast-star.json',              staticFallback: 'star-fill',               tags: ['lottie', 'deprecated', 'toast'] },
  { slug: 'lottie-minikart-cross-hover1',file: '_unused Icons/Mini Kart Icons/lottie-minikart-cross-hover-cross-1.json', staticFallback: 'x-fill', tags: ['lottie', 'deprecated', 'shop'] },
  { slug: 'lottie-minikart-cross-hover3',file: '_unused Icons/Mini Kart Icons/lottie-minikart-cross-hover-cross-3.json', staticFallback: 'x-fill', tags: ['lottie', 'deprecated', 'shop'] },
  { slug: 'lottie-minikart-cross-in',    file: '_unused Icons/Mini Kart Icons/lottie-minikart-cross-in-cross.json',      staticFallback: 'x-fill', tags: ['lottie', 'deprecated', 'shop'] },
  { slug: 'lottie-minikart-morph-in',    file: '_unused Icons/Mini Kart Icons/lottie-minikart-cross-morph-cross-in.json', staticFallback: 'x-fill', tags: ['lottie', 'deprecated', 'shop'] },
  { slug: 'lottie-minikart-morph',       file: '_unused Icons/Mini Kart Icons/lottie-minikart-cross-morph-cross.json',    staticFallback: 'x-fill', tags: ['lottie', 'deprecated', 'shop'] },
  { slug: 'lottie-social-facebook',      file: '_unused Icons/Social Media Logos/Facebook/lottie-social-facebook.json',   staticFallback: 'facebook-logo-fill',  tags: ['lottie', 'deprecated', 'social'] },
  { slug: 'lottie-social-instagram',     file: '_unused Icons/Social Media Logos/Instagram/lottie-social-instagram.json', staticFallback: 'instagram-logo-fill', tags: ['lottie', 'deprecated', 'social'] },
  { slug: 'lottie-social-linkedin',      file: '_unused Icons/Social Media Logos/Linkedin/lottie-social-linkedin.json',   staticFallback: 'linkedin-logo-fill',  tags: ['lottie', 'deprecated', 'social'] },
  { slug: 'lottie-social-twitter',       file: '_unused Icons/Social Media Logos/Twitter/lottie-social-twitter.json',     staticFallback: 'twitter-logo-fill',   tags: ['lottie', 'deprecated', 'social'] },
  { slug: 'lottie-social-youtube',       file: '_unused Icons/Social Media Logos/YouTube/lottie-social-youtube.json',     staticFallback: 'youtube-logo-fill',   tags: ['lottie', 'deprecated', 'social'] },
];

// ─── Helpers ───────────────────────────────────────────

function titleCase(slug: string): string {
  return slug
    .replace(/^lottie-/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

// ─── Main ──────────────────────────────────────────────

async function main() {
  if (!TOKEN) {
    console.error('API_TOKEN is required.');
    process.exit(1);
  }

  const health = await fetch(`${API_URL}/v1/health`).catch(() => null);
  if (!health?.ok) {
    console.error(`Cannot reach API at ${API_URL}`);
    process.exit(1);
  }

  // Ensure tags exist
  const tagNames = [...new Set(LOTTIE_DEFS.flatMap(d => d.tags))];
  console.log(`Creating ${tagNames.length} tags...`);
  for (const name of tagNames) {
    await apiFetch('/v1/tags', {
      method: 'POST',
      body: JSON.stringify({ name, type: name === 'lottie' ? 'style' : 'category' }),
    });
  }

  // Import each Lottie file
  let imported = 0, skipped = 0, failed = 0, mappings = 0;

  console.log(`\nImporting ${LOTTIE_DEFS.length} Lottie animations...\n`);

  for (const def of LOTTIE_DEFS) {
    const filePath = path.join(ANIMATED_DIR, def.file);

    if (!fs.existsSync(filePath)) {
      console.warn(`  SKIP ${def.slug}: file not found — ${def.file}`);
      skipped++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Create asset via bulk endpoint (handles dedup)
    const res = await apiFetch('/v1/assets/bulk', {
      method: 'POST',
      body: JSON.stringify({
        assets: [{
          name: titleCase(def.slug),
          slug: def.slug,
          type: 'lottie',
          source: 'custom',
          license: 'proprietary',
          tags: def.tags,
          content,
          created_by: 'seed-lottie',
        }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`  FAIL ${def.slug}: ${res.status} ${text.slice(0, 100)}`);
      failed++;
      continue;
    }

    const result = await res.json() as { created: number; skipped: number };
    if (result.created > 0) {
      console.log(`  + ${def.slug}`);
      imported++;
    } else {
      console.log(`  = ${def.slug} (already exists)`);
      skipped++;
    }

    // Look up static fallback asset ID
    const fallbackRes = await apiFetch(`/v1/assets/${def.staticFallback}/meta`);
    if (!fallbackRes.ok) {
      console.warn(`    No fallback found: ${def.staticFallback}`);
      continue;
    }
    const fallbackMeta = await fallbackRes.json() as { id: string };

    // Look up lottie asset ID
    const lottieRes = await apiFetch(`/v1/assets/${def.slug}/meta`);
    if (!lottieRes.ok) {
      console.warn(`    Cannot read lottie meta: ${def.slug}`);
      continue;
    }
    const lottieMeta = await lottieRes.json() as { id: string };

    // Insert mapping via direct D1 (we'll use a simple POST endpoint...
    // but the API doesn't have a lottie_mappings route yet.
    // Store mapping data for SQL insertion below.
    console.log(`    → mapped to ${def.staticFallback} (${fallbackMeta.id})`);
    mappings++;
  }

  console.log(`\nSummary:`);
  console.log(`  Imported: ${imported}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Failed:   ${failed}`);
  console.log(`  Mappings: ${mappings} (will be inserted via D1 SQL)`);

  // Generate SQL for lottie_mappings
  console.log(`\nGenerating lottie_mappings SQL...\n`);

  const sqlLines: string[] = [];

  for (const def of LOTTIE_DEFS) {
    const lottieRes = await apiFetch(`/v1/assets/${def.slug}/meta`);
    if (!lottieRes.ok) continue;
    const lottieMeta = await lottieRes.json() as { id: string };

    const fallbackRes = await apiFetch(`/v1/assets/${def.staticFallback}/meta`);
    if (!fallbackRes.ok) continue;
    const fallbackMeta = await fallbackRes.json() as { id: string };

    sqlLines.push(`INSERT OR IGNORE INTO lottie_mappings (lottie_asset_id, static_asset_id) VALUES ('${lottieMeta.id}', '${fallbackMeta.id}');`);
  }

  if (sqlLines.length > 0) {
    const sqlFile = path.join(process.cwd(), 'src', 'schema', 'migrations', '003_lottie_mappings_data.sql');
    const sqlContent = `-- 003: Lottie → static fallback mappings\n-- Auto-generated by seed-lottie.ts\n\n${sqlLines.join('\n')}\n`;
    fs.writeFileSync(sqlFile, sqlContent);
    console.log(`Wrote ${sqlLines.length} mappings to ${sqlFile}`);
    console.log(`Run: npx wrangler d1 execute asset-library --remote --file=${sqlFile}`);
  }

  console.log('\nLottie seed complete.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
