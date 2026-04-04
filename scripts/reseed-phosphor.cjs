/**
 * Reseed Phosphor icons — clean slate
 *
 * 1. Delete all existing Phosphor icons
 * 2. Upload standard multi-path SVGs (all 5 weights)
 * 3. Upload flat SVGs with -flat suffix (all 5 weights)
 * 4. Apply Phosphor metadata tags + categories
 *
 * Usage: node scripts/reseed-phosphor.cjs
 */

const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const env = Object.fromEntries(
  envFile.split('\n').filter(l => l.includes('=')).map(l => {
    const [k, ...v] = l.split('=');
    return [k.trim(), v.join('=').trim()];
  })
);

const API_URL = env.ASSET_API_URL;
const API_TOKEN = env.ASSET_API_TOKEN;

// ─── Paths ──────────────────────────────────────────────

const DL = path.join('C:', 'Users', 'natas', 'Downloads', 'phosphor-icons (1)');
const ROOT = path.join(__dirname, '..');

const STANDARD_DIRS = {
  light:   path.join(DL, 'SVGs', 'light'),
  regular: path.join(DL, 'SVGs', 'regular'),
  bold:    path.join(DL, 'SVGs', 'bold'),
  fill:    path.join(DL, 'SVGs', 'fill'),
  duotone: path.join(DL, 'SVGs', 'duotone'),
};

// Check if standard regular/fill/duotone dirs exist — they might be in a different location
// The original seed used SVGs Flat for fill/duotone/regular, so standard versions might be elsewhere
const STANDARD_FALLBACKS = {
  regular: path.join(DL, 'SVGs', 'regular'),
  fill:    path.join(DL, 'SVGs', 'fill'),
  duotone: path.join(DL, 'SVGs', 'duotone'),
};

const FLAT_BASE = path.join(DL, 'SVGs Flat');
const WEIGHTS = ['light', 'regular', 'bold', 'fill', 'duotone'];

// Phosphor metadata
const metaPath = path.join(ROOT, 'phosphor-meta.json');
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
const metaByName = new Map(meta.map(m => [m.name, m]));

// ─── Helpers ────────────────────────────────────────────

function titleCase(slug) {
  return slug.replace(/-fill$|-duotone$|-regular$|-bold$|-light$|-flat$/, '')
    .split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function computeBaseName(slug) {
  const suffixes = ['-fill-flat', '-duotone-flat', '-regular-flat', '-bold-flat', '-light-flat',
                    '-fill', '-duotone', '-regular', '-bold', '-light'];
  for (const s of suffixes) {
    if (slug.endsWith(s)) return slug.slice(0, -s.length);
  }
  return slug;
}

function slugFromFile(filename, weight, flat = false) {
  let slug = filename.replace('.svg', '').toLowerCase();
  // Regular weight files often have no suffix in the filename
  if (weight === 'regular' && !slug.endsWith('-regular')) {
    slug = `${slug}-regular`;
  }
  if (flat) slug += '-flat';
  return slug;
}

async function apiFetch(endpoint, options = {}) {
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

// ─── Phase 1: Delete all Phosphor icons ─────────────────

async function deleteAll() {
  console.log('Phase 1: Deleting all existing Phosphor icons...\n');

  let deleted = 0, offset = 0;

  while (true) {
    const res = await apiFetch(`/v1/assets?source=phosphor&limit=200&offset=0`);
    if (!res.ok) { console.log('  Failed to list:', res.status); break; }

    const data = await res.json();
    if (!data.assets || data.assets.length === 0) break;

    for (const asset of data.assets) {
      const delRes = await apiFetch(`/v1/assets/${asset.slug}`, { method: 'DELETE' });
      if (delRes.ok) {
        deleted++;
      } else {
        console.log(`  Failed to delete ${asset.slug}: ${delRes.status}`);
      }
    }

    process.stdout.write(`  Deleted ${deleted}...\r`);

    // Safety valve
    if (deleted > 20000) { console.log('  Safety limit hit'); break; }
  }

  console.log(`  Deleted ${deleted} Phosphor icons\n`);
}

// ─── Phase 2: Upload standard SVGs ──────────────────────

async function uploadStandard() {
  console.log('Phase 2: Uploading standard multi-path SVGs...\n');

  let created = 0, skipped = 0, failed = 0;

  for (const weight of WEIGHTS) {
    const dir = STANDARD_DIRS[weight];
    if (!dir || !fs.existsSync(dir)) {
      console.log(`  SKIP standard ${weight}: ${dir || 'no path'}`);
      continue;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
    console.log(`  ${weight}: ${files.length} standard SVGs`);

    for (let i = 0; i < files.length; i += 50) {
      const batch = files.slice(i, i + 50);
      const assets = batch.map(file => {
        const slug = slugFromFile(file, weight, false);
        const bn = computeBaseName(slug);
        const iconMeta = metaByName.get(bn);
        const tags = ['icon', 'svg', weight, 'phosphor'];
        if (iconMeta) {
          tags.push(...iconMeta.tags.filter(t => t !== '*new*'));
          tags.push(...iconMeta.categories);
        }

        return {
          name: titleCase(slug),
          slug,
          type: 'svg',
          source: 'phosphor',
          license: 'mit',
          tags,
          content: fs.readFileSync(path.join(dir, file), 'utf8'),
          created_by: 'reseed-phosphor',
        };
      });

      const res = await apiFetch('/v1/assets/bulk', {
        method: 'POST',
        body: JSON.stringify({ assets }),
      });

      if (res.ok) {
        const data = await res.json();
        created += data.created;
        skipped += data.skipped;
      } else {
        failed += batch.length;
      }

      if ((i + 50) % 500 === 0) process.stdout.write(`    ${weight}: ${i + 50}/${files.length}\r`);
    }
    console.log(`    ${weight}: done`);
  }

  console.log(`\n  Standard: ${created} created, ${skipped} skipped, ${failed} failed\n`);
}

// ─── Phase 3: Upload flat SVGs with -flat suffix ────────

async function uploadFlat() {
  console.log('Phase 3: Uploading flat SVGs with -flat suffix...\n');

  let created = 0, skipped = 0, failed = 0;

  for (const weight of WEIGHTS) {
    const dir = path.join(FLAT_BASE, weight);
    if (!fs.existsSync(dir)) {
      console.log(`  SKIP flat ${weight}: ${dir}`);
      continue;
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
    console.log(`  ${weight}-flat: ${files.length} flat SVGs`);

    for (let i = 0; i < files.length; i += 50) {
      const batch = files.slice(i, i + 50);
      const assets = batch.map(file => {
        const slug = slugFromFile(file, weight, true);
        const bn = computeBaseName(slug);
        const iconMeta = metaByName.get(bn);
        const tags = ['icon', 'svg', weight, 'flat', 'phosphor'];
        if (iconMeta) {
          tags.push(...iconMeta.tags.filter(t => t !== '*new*'));
          tags.push(...iconMeta.categories);
        }

        return {
          name: titleCase(slug),
          slug,
          type: 'svg',
          source: 'phosphor',
          license: 'mit',
          tags,
          content: fs.readFileSync(path.join(dir, file), 'utf8'),
          created_by: 'reseed-phosphor',
        };
      });

      const res = await apiFetch('/v1/assets/bulk', {
        method: 'POST',
        body: JSON.stringify({ assets }),
      });

      if (res.ok) {
        const data = await res.json();
        created += data.created;
        skipped += data.skipped;
      } else {
        failed += batch.length;
      }

      if ((i + 50) % 500 === 0) process.stdout.write(`    ${weight}-flat: ${i + 50}/${files.length}\r`);
    }
    console.log(`    ${weight}-flat: done`);
  }

  console.log(`\n  Flat: ${created} created, ${skipped} skipped, ${failed} failed\n`);
}

// ─── Main ───────────────────────────────────────────────

async function main() {
  console.log('Phosphor Reseed — Clean Slate');
  console.log(`API: ${API_URL}`);
  console.log(`Metadata: ${meta.length} icons\n`);

  await deleteAll();
  await uploadStandard();
  await uploadFlat();

  // Verify
  const res = await apiFetch('/v1/assets?source=phosphor&limit=1');
  const data = await res.json();
  console.log(`\nVerify: ${data.count} total Phosphor assets in D1`);
  console.log('Expected: ~15,120 (1,512 × 5 weights × 2 variants)');
  console.log('\nDone!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
