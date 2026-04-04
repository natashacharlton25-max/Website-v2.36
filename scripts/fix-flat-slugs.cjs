/**
 * Fix flat SVG slugs — re-upload with -flat suffix
 * Also replace light/bold standard slugs with multi-path SVGs
 *
 * Usage: node scripts/fix-flat-slugs.cjs
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

const FLAT_BASE = path.join('C:', 'Users', 'natas', 'Downloads', 'phosphor-icons (1)', 'SVGs Flat');
const STANDARD_LIGHT = path.join('C:', 'Users', 'natas', 'Downloads', 'phosphor-icons (1)', 'SVGs', 'light');
const STANDARD_BOLD = path.join(__dirname, '..', 'bold');

const WEIGHTS = ['light', 'regular', 'bold', 'fill', 'duotone'];

function titleCase(slug) {
  return slug.replace(/-fill$|-duotone$|-regular$|-bold$|-light$|-flat$/, '')
    .split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

function baseName(slug) {
  const weights = ['fill', 'duotone', 'regular', 'bold', 'light'];
  let name = slug.replace('-flat', '');
  for (const w of weights) {
    if (name.endsWith(`-${w}`)) return name.slice(0, -(w.length + 1));
  }
  return name;
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

async function main() {
  console.log('=== Phase 1: Upload flat SVGs with -flat suffix ===\n');

  let created = 0, skipped = 0, failed = 0;

  for (const weight of WEIGHTS) {
    const dir = path.join(FLAT_BASE, weight);
    if (!fs.existsSync(dir)) { console.log(`  SKIP ${weight}: dir not found`); continue; }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
    console.log(`  ${weight}: ${files.length} flat SVGs`);

    // Batch in groups of 50
    for (let i = 0; i < files.length; i += 50) {
      const batch = files.slice(i, i + 50);
      const assets = batch.map(file => {
        const baseSlug = file.replace('.svg', '').toLowerCase();
        // Regular weight files have no suffix
        const slug = (weight === 'regular' && !baseSlug.endsWith('-regular'))
          ? `${baseSlug}-regular-flat`
          : `${baseSlug}-flat`;

        return {
          name: titleCase(baseSlug),
          slug,
          baseName: baseName(baseSlug),
          type: 'svg',
          source: 'phosphor',
          license: 'mit',
          tags: ['icon', 'svg', weight, 'flat'],
          content: fs.readFileSync(path.join(dir, file), 'utf8'),
          created_by: 'fix-flat-slugs',
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
        if (failed <= 3) console.log(`    FAIL: ${res.status} ${await res.text()}`);
      }

      if ((i + 50) % 500 === 0) process.stdout.write(`    ${weight}: ${i + 50}/${files.length}\r`);
    }
  }

  console.log(`\n  Flat: ${created} created, ${skipped} skipped, ${failed} failed\n`);

  // === Phase 2: Replace light/bold with standard multi-path SVGs ===
  console.log('=== Phase 2: Replace light/bold with standard multi-path SVGs ===\n');

  const replaceDirs = { light: STANDARD_LIGHT, bold: STANDARD_BOLD };
  let replaced = 0, replaceFailed = 0;

  for (const [weight, dir] of Object.entries(replaceDirs)) {
    if (!fs.existsSync(dir)) { console.log(`  SKIP ${weight}: ${dir} not found`); continue; }

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
    console.log(`  ${weight}: ${files.length} standard SVGs to replace`);

    for (const file of files) {
      const slug = file.replace('.svg', '').toLowerCase();
      const content = fs.readFileSync(path.join(dir, file), 'utf8');

      const res = await apiFetch(`/v1/assets/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({ content, created_by: 'fix-flat-slugs' }),
      });

      if (res.ok) {
        replaced++;
      } else {
        replaceFailed++;
        if (replaceFailed <= 3) console.log(`    FAIL ${slug}: ${res.status}`);
      }

      if ((replaced + replaceFailed) % 100 === 0) {
        process.stdout.write(`    ${weight}: ${replaced} replaced, ${replaceFailed} failed\r`);
      }
    }
  }

  console.log(`\n  Replaced: ${replaced}, Failed: ${replaceFailed}`);
  console.log('\nDone!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
