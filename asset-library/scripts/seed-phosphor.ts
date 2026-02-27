/**
 * Phosphor Icon Seed Script — Two-phase import
 *
 * Phase 1: Bulk import from SVGs Flat/ (fill, duotone, regular) → ~4,536 assets
 * Phase 2: Enrich from phosphor/ curated folder → add component/category tags
 *
 * Usage:
 *   npx tsx scripts/seed-phosphor.ts
 *
 * Environment:
 *   ASSET_API_URL  — e.g. http://localhost:8787 (dev) or https://assets.yourdomain.com
 *   API_TOKEN      — your bearer token
 *   ICONS_ROOT     — path to public/Icons/ (default: ../public/Icons)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const API_URL = process.env.ASSET_API_URL || 'http://localhost:8787';
const TOKEN = process.env.API_TOKEN || '';
const ICONS_ROOT = process.env.ICONS_ROOT || path.join(process.cwd(), '..', 'public', 'Icons');

const FLAT_DIR = path.join(ICONS_ROOT, 'SVGs Flat');
const CURATED_DIR = path.join(ICONS_ROOT, 'phosphor');

const WEIGHTS = ['fill', 'duotone', 'regular'] as const;
type Weight = typeof WEIGHTS[number];

// ─── Curated folder → tag mapping ──────────────────────

interface TagDef { name: string; type: string }

const FOLDER_TO_TAGS: Record<string, TagDef[]> = {
  // Content categories
  nature:                [{ name: 'nature',              type: 'category' }],
  wellness:              [{ name: 'wellness',            type: 'category' }],
  objects:               [{ name: 'objects',             type: 'category' }],
  interface:             [{ name: 'interface',           type: 'category' }],
  communication:         [{ name: 'communication',       type: 'category' }],
  people:                [{ name: 'people',              type: 'category' }],
  creative:              [{ name: 'creative',            type: 'category' }],
  shapes:                [{ name: 'shapes',              type: 'category' }],

  // Component-bound icons
  'a11y':                [{ name: 'a11y',               type: 'component' }],
  'a11y-panel':          [{ name: 'a11y-panel',         type: 'component' }],
  'contact-popup':       [{ name: 'contact-popup',      type: 'component' }],
  'announcement-ticker': [{ name: 'announcement-ticker',type: 'component' }],
  'toast':               [{ name: 'toast',              type: 'component' }],
  'spec-cards':          [{ name: 'spec-cards',         type: 'component' }],
  'badges':              [{ name: 'badges',             type: 'component' }],
  'trust':               [{ name: 'trust',              type: 'component' }],

  // Deprecated / unused
  '_unused/actions':     [{ name: 'actions',            type: 'category' },  { name: 'deprecated', type: 'general' }],
  '_unused/arrows':      [{ name: 'arrows',             type: 'category' },  { name: 'deprecated', type: 'general' }],
  '_unused/navigation':  [{ name: 'navigation',         type: 'category' },  { name: 'deprecated', type: 'general' }],
  '_unused/social':      [{ name: 'social',             type: 'category' },  { name: 'deprecated', type: 'general' }],
  '_unused/toast':       [{ name: 'toast-legacy',       type: 'component' }, { name: 'deprecated', type: 'general' }],
};

// ─── Helpers ───────────────────────────────────────────

function titleCase(slug: string): string {
  return slug
    .replace(/-fill$|-duotone$|-regular$/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function slugFromFile(filename: string, weight: Weight): string {
  const base = filename.replace(/\.svg$/, '').toLowerCase();
  // Regular weight files have no suffix — append -regular for consistent slugs
  if (weight === 'regular' && !base.endsWith('-regular')) {
    return `${base}-regular`;
  }
  return base;
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

// ─── Phase 1: Scan SVGs Flat ──────────────────────────

interface FlatEntry {
  name: string;
  slug: string;
  weight: Weight;
  content: string;
  tags: string[];
}

function scanFlat(): FlatEntry[] {
  const entries: FlatEntry[] = [];

  for (const weight of WEIGHTS) {
    const dir = path.join(FLAT_DIR, weight);
    if (!fs.existsSync(dir)) {
      console.error(`  Missing weight directory: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
    console.log(`   ${weight}: ${files.length} SVGs`);

    for (const file of files) {
      const slug = slugFromFile(file, weight);
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');

      entries.push({
        name: titleCase(slug),
        slug,
        weight,
        content,
        tags: ['icon', 'svg', weight],
      });
    }
  }

  return entries;
}

// ─── Phase 2: Scan curated phosphor/ ───────────────────

interface CuratedEntry {
  slug: string;
  folder: string;
  tags: string[];
  content: string;
}

function scanCurated(): CuratedEntry[] {
  const entries: CuratedEntry[] = [];

  if (!fs.existsSync(CURATED_DIR)) {
    console.warn(`  Curated directory not found: ${CURATED_DIR}`);
    return entries;
  }

  function walkDir(dir: string, relativePath: string) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      const relPath = relativePath ? `${relativePath}/${item.name}` : item.name;

      if (item.isDirectory()) {
        walkDir(fullPath, relPath);
      } else if (item.name.endsWith('.svg')) {
        const slug = item.name.replace(/\.svg$/, '').toLowerCase();
        const folder = relativePath || 'uncategorised';

        // Get folder-specific tags
        const folderTags = FOLDER_TO_TAGS[folder];
        const tags: string[] = [];
        if (folderTags) {
          for (const t of folderTags) tags.push(t.name);
        }

        if (tags.length > 0) {
          entries.push({
            slug,
            folder,
            tags,
            content: fs.readFileSync(fullPath, 'utf-8'),
          });
        }
      }
    }
  }

  walkDir(CURATED_DIR, '');
  return entries;
}

// ─── Tag creation ──────────────────────────────────────

async function ensureAllTags(): Promise<void> {
  const tagDefs = new Map<string, string>();

  // Base style tags
  tagDefs.set('icon', 'category');
  tagDefs.set('svg', 'style');
  tagDefs.set('fill', 'style');
  tagDefs.set('duotone', 'style');
  tagDefs.set('regular', 'style');

  // Folder-derived tags
  for (const defs of Object.values(FOLDER_TO_TAGS)) {
    for (const d of defs) tagDefs.set(d.name, d.type);
  }

  console.log(`\n  Creating ${tagDefs.size} tags...`);

  for (const [name, type] of tagDefs) {
    const res = await apiFetch('/v1/tags', {
      method: 'POST',
      body: JSON.stringify({ name, type }),
    });
    if (!res.ok && res.status !== 200) {
      console.warn(`    Tag "${name}": ${res.status}`);
    }
  }
}

// ─── Bulk import (phase 1) ─────────────────────────────

async function importBatch(batch: FlatEntry[]): Promise<{ created: number; skipped: number; errors: number }> {
  const res = await apiFetch('/v1/assets/bulk', {
    method: 'POST',
    body: JSON.stringify({
      assets: batch.map(e => ({
        name: e.name,
        slug: e.slug,
        type: 'svg',
        source: 'phosphor',
        license: 'mit',
        tags: e.tags,
        content: e.content,
        created_by: 'seed-phosphor',
      })),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`    Bulk failed: ${res.status} ${text.slice(0, 200)}`);
    return { created: 0, skipped: 0, errors: batch.length };
  }

  return await res.json() as { created: number; skipped: number; errors: number };
}

// ─── Tag enrichment (phase 2) ──────────────────────────

async function enrichTags(entries: CuratedEntry[]): Promise<{ enriched: number; created: number; failed: number }> {
  let enriched = 0, created = 0, failed = 0;

  for (const entry of entries) {
    // Check if asset exists
    const metaRes = await apiFetch(`/v1/assets/${entry.slug}/meta`);

    if (metaRes.ok) {
      // Asset exists — PATCH to add tags
      const meta = await metaRes.json() as { tags: string[] };
      const existingTags = new Set(meta.tags || []);
      const newTags = entry.tags.filter(t => !existingTags.has(t));

      if (newTags.length === 0) continue; // Already has all tags

      const merged = [...existingTags, ...newTags];
      const patchRes = await apiFetch(`/v1/assets/${entry.slug}`, {
        method: 'PATCH',
        body: JSON.stringify({ tags: merged }),
      });

      if (patchRes.ok) {
        enriched++;
      } else {
        console.warn(`    PATCH ${entry.slug}: ${patchRes.status}`);
        failed++;
      }
    } else if (metaRes.status === 404) {
      // Asset doesn't exist in flat set — create it (curated-only icon)
      const allTags = ['icon', 'svg', 'fill', ...entry.tags];
      const createRes = await apiFetch('/v1/assets/bulk', {
        method: 'POST',
        body: JSON.stringify({
          assets: [{
            name: titleCase(entry.slug),
            slug: entry.slug,
            type: 'svg',
            source: 'phosphor',
            license: 'mit',
            tags: allTags,
            content: entry.content,
            created_by: 'seed-curated',
          }],
        }),
      });

      if (createRes.ok) {
        created++;
      } else {
        console.warn(`    CREATE ${entry.slug}: ${createRes.status}`);
        failed++;
      }
    } else {
      failed++;
    }
  }

  return { enriched, created, failed };
}

// ─── Verify ────────────────────────────────────────────

async function verifySample(entries: FlatEntry[], sampleSize = 50): Promise<void> {
  // Random sample for verification (full set would be 4500+ API calls)
  const sample = entries
    .sort(() => Math.random() - 0.5)
    .slice(0, sampleSize);

  let ok = 0, mismatch = 0, missing = 0;

  for (const entry of sample) {
    const localHash = 'sha256:' + crypto.createHash('sha256').update(entry.content, 'utf-8').digest('hex');

    const res = await apiFetch('/v1/assets/verify', {
      method: 'POST',
      body: JSON.stringify({ slug: entry.slug, hash: localHash }),
    });

    if (res.status === 404) { missing++; continue; }

    const data = await res.json() as { valid: boolean };
    if (data.valid) ok++;
    else { mismatch++; console.warn(`    Hash mismatch: ${entry.slug}`); }
  }

  console.log(`   Sample ${sampleSize}: OK=${ok} Mismatch=${mismatch} Missing=${missing}`);

  if (mismatch > 0) {
    console.error('\n  Verification issues — check output above');
    process.exit(1);
  }
}

// ─── Main ──────────────────────────────────────────────

async function main() {
  if (!TOKEN) {
    console.error('API_TOKEN is required. Set it via environment variable.');
    process.exit(1);
  }

  // Health check
  const health = await fetch(`${API_URL}/v1/health`).catch(() => null);
  if (!health?.ok) {
    console.error(`Cannot reach API at ${API_URL} — is the worker running?`);
    process.exit(1);
  }

  // ── Phase 1: Scan flat icons ──────────────────────────
  console.log('Phase 1: Scanning SVGs Flat/...');
  console.log(`   Source: ${FLAT_DIR}\n`);

  const flatEntries = scanFlat();
  console.log(`\n   Total: ${flatEntries.length} SVGs across ${WEIGHTS.length} weights\n`);

  if (flatEntries.length === 0) {
    console.error('No SVGs found in SVGs Flat/. Check ICONS_ROOT path.');
    process.exit(1);
  }

  // ── Create all tags ────────────────────────────────────
  await ensureAllTags();

  // ── Bulk import ────────────────────────────────────────
  const BATCH_SIZE = 50;
  let totalCreated = 0, totalSkipped = 0, totalErrors = 0;

  console.log(`\n  Importing ${flatEntries.length} assets in batches of ${BATCH_SIZE}...\n`);

  for (let i = 0; i < flatEntries.length; i += BATCH_SIZE) {
    const batch = flatEntries.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(flatEntries.length / BATCH_SIZE);

    process.stdout.write(`   ${batchNum}/${totalBatches} (${batch.length})... `);

    const { created, skipped, errors } = await importBatch(batch);
    totalCreated += created;
    totalSkipped += skipped;
    totalErrors += errors;

    console.log(`${created} created, ${skipped} skipped, ${errors} errors`);
  }

  console.log(`\n  Phase 1 summary:`);
  console.log(`   Created: ${totalCreated}`);
  console.log(`   Skipped: ${totalSkipped}`);
  console.log(`   Errors:  ${totalErrors}`);

  // ── Phase 2: Enrich from curated folder ────────────────
  console.log(`\nPhase 2: Enriching from curated phosphor/...`);
  console.log(`   Source: ${CURATED_DIR}\n`);

  const curatedEntries = scanCurated();
  console.log(`   Found: ${curatedEntries.length} curated icons to enrich\n`);

  if (curatedEntries.length > 0) {
    // Summary by folder
    const byFolder = new Map<string, number>();
    for (const e of curatedEntries) {
      byFolder.set(e.folder, (byFolder.get(e.folder) || 0) + 1);
    }
    for (const [folder, count] of [...byFolder.entries()].sort()) {
      console.log(`   ${folder}: ${count} icons`);
    }

    console.log('');
    const { enriched, created, failed } = await enrichTags(curatedEntries);
    console.log(`\n  Phase 2 summary:`);
    console.log(`   Enriched: ${enriched} (tags added to existing assets)`);
    console.log(`   Created:  ${created} (curated-only, not in flat set)`);
    console.log(`   Failed:   ${failed}`);
  }

  // ── Verify sample ──────────────────────────────────────
  console.log(`\n  Verifying integrity (random sample)...`);
  await verifySample(flatEntries, 50);

  console.log('\nSeed complete.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
