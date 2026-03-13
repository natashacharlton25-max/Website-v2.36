/**
 * bliss-upload-r2.js — Upload Bliss SVGs to R2 bucket
 *
 * Reads all SVGs from _bliss-svg/ and uploads to R2 via wrangler.
 * Path pattern: symbols/bliss/{bci_index}.svg
 *
 * Resumable — skips files already uploaded (tracked via a local manifest).
 *
 * Usage: node asset-library/scripts/bliss-upload-r2.js
 *
 * No AI tokens.
 */

const { execSync } = require('node:child_process');
const { readFileSync, writeFileSync, readdirSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

const WORKER_DIR = resolve(__dirname, '..');
const SVG_DIR = resolve(__dirname, '../../_bliss-svg');
const MANIFEST = resolve(__dirname, '_bliss-upload-manifest.json');
const R2_BUCKET = 'asset-library-r2';

// ── Load/save manifest for resume ──

function loadManifest() {
  if (existsSync(MANIFEST)) {
    return new Set(JSON.parse(readFileSync(MANIFEST, 'utf-8')));
  }
  return new Set();
}

function saveManifest(uploaded) {
  writeFileSync(MANIFEST, JSON.stringify([...uploaded]), 'utf-8');
}

// ── Main ──

function main() {
  const files = readdirSync(SVG_DIR).filter((f) => f.endsWith('.svg'));
  console.log(`SVGs in ${SVG_DIR}: ${files.length}`);

  const uploaded = loadManifest();
  console.log(`Already uploaded: ${uploaded.size}`);

  const remaining = files.filter((f) => !uploaded.has(f));
  console.log(`Remaining: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('All done!');
    return;
  }

  let success = 0;
  let failed = 0;

  for (const file of remaining) {
    const bci = file.replace('.svg', '');
    const localPath = resolve(SVG_DIR, file);
    const r2Key = `symbols/bliss/${bci}.svg`;

    try {
      execSync(
        `npx wrangler r2 object put "${R2_BUCKET}/${r2Key}" --file="${localPath}" --content-type="image/svg+xml"`,
        { encoding: 'utf-8', cwd: WORKER_DIR, stdio: 'pipe' }
      );

      uploaded.add(file);
      success++;

      if (success % 100 === 0 || success === 1) {
        process.stdout.write(
          `  ${success + uploaded.size - success}/${files.length} uploaded (${failed} failed)...\r`
        );
        // Save manifest periodically for resume
        saveManifest(uploaded);
      }
    } catch (err) {
      failed++;
      if (failed <= 5) {
        console.warn(`  Failed ${file}: ${err.message.slice(0, 100)}`);
      }
    }
  }

  // Final manifest save
  saveManifest(uploaded);

  console.log(`\n\nUpload complete:`);
  console.log(`  ${success} newly uploaded`);
  console.log(`  ${failed} failed`);
  console.log(`  ${uploaded.size} total in R2`);
  console.log(`\nR2 path pattern: symbols/bliss/{bci_index}.svg`);
}

main();
