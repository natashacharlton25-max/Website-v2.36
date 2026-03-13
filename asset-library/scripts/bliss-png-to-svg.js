/**
 * bliss-png-to-svg.js — Fetch Bliss PNGs, trace to SVG, upload to R2
 *
 * For every bci_index in bci_concepts:
 *   1. Fetch PNG from https://www.blissymbolics.net/refnumber/{bci_index}
 *   2. Convert to SVG via potrace (black line art → vector paths)
 *   3. Inject metadata attributes into SVG root element
 *   4. Upload to R2 bucket as bliss/{bci_index}.svg
 *
 * Each SVG carries self-documenting metadata:
 *   data-bci      — BCI reference number
 *   data-english  — English glosses (comma-separated)
 *   data-pos      — Part of speech (YELLOW=noun, RED=verb, GREEN=adj, etc.)
 *   data-licence  — CC BY-SA 3.0 Blissymbolics Communication International
 *
 * Rate-limited to 100ms between fetches (polite to blissymbolics.net).
 * Resumes from where it left off — skips BCI indices already in output dir.
 *
 * Usage: node asset-library/scripts/bliss-png-to-svg.js
 *
 * Prerequisites: npm install potrace sharp
 * No AI tokens — pure fetch + image processing.
 */

const { execSync } = require('node:child_process');
const { writeFileSync, readFileSync, mkdirSync, existsSync, readdirSync } = require('node:fs');
const { resolve } = require('node:path');
const https = require('node:https');
const http = require('node:http');
const sharp = require('sharp');
const potrace = require('potrace');

const WORKER_DIR = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(__dirname, '../../_bliss-svg');
const LICENCE = 'CC BY-SA 3.0 Blissymbolics Communication International';

// ── D1 helper ──

function d1Query(sql) {
  const flat = sql.replace(/\s+/g, ' ').trim();
  const escaped = flat.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR });
  const parsed = JSON.parse(raw);
  if (!parsed[0] || !parsed[0].success) {
    throw new Error(`D1 query failed: ${flat}`);
  }
  return parsed[0].results;
}

// ── HTTP fetch (follows redirects, returns Buffer) ──

function fetchBuffer(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return fetchBuffer(res.headers.location, maxRedirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return resolve(null);
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ── Rate limiter ──

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Potrace wrapper ──

function traceToSvg(pngBuffer) {
  return new Promise((resolve, reject) => {
    potrace.trace(pngBuffer, {
      threshold: 128,
      turdSize: 2,
      optTolerance: 0.2,
    }, (err, svg) => {
      if (err) return reject(err);
      resolve(svg);
    });
  });
}

// ── Inject metadata into SVG ──

function injectMetadata(svg, bciIndex, english, pos) {
  // Replace opening <svg tag with one that includes metadata attributes
  const attrs = [
    `data-bci="${bciIndex}"`,
    `data-english="${escAttr(english)}"`,
    `data-pos="${escAttr(pos || '')}"`,
    `data-licence="${escAttr(LICENCE)}"`,
  ].join(' ');

  // Insert attributes into the <svg> tag
  return svg.replace(/<svg/, `<svg ${attrs}`);
}

function escAttr(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Main ──

async function main() {
  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Check what's already done (for resume)
  const done = new Set(
    readdirSync(OUTPUT_DIR)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => parseInt(f.replace('.svg', ''), 10))
      .filter((n) => !isNaN(n))
  );
  console.log(`Output dir: ${OUTPUT_DIR}`);
  console.log(`Already converted: ${done.size} SVGs`);

  // Fetch all BCI concepts
  console.log('Fetching BCI concepts from D1...');
  const concepts = d1Query(
    'SELECT bci_index, english, pos FROM bci_concepts ORDER BY bci_index'
  );
  console.log(`Total concepts: ${concepts.length}`);

  const remaining = concepts.filter((c) => !done.has(c.bci_index));
  console.log(`Remaining to convert: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('All done! Run the R2 upload step next.');
    return;
  }

  let converted = 0;
  let failed = 0;

  for (const concept of remaining) {
    const { bci_index, english, pos } = concept;
    const url = `https://www.blissymbolics.net/refnumber/${bci_index}`;

    try {
      // 1. Fetch PNG
      const pngBuf = await fetchBuffer(url);
      if (!pngBuf || pngBuf.length < 100) {
        failed++;
        continue;
      }

      // 2. Preprocess with sharp — ensure single channel, high contrast
      const processed = await sharp(pngBuf)
        .greyscale()
        .threshold(128)
        .png()
        .toBuffer();

      // 3. Trace to SVG
      let svg = await traceToSvg(processed);

      // 4. Inject metadata
      svg = injectMetadata(svg, bci_index, english, pos);

      // 5. Write to output dir
      writeFileSync(resolve(OUTPUT_DIR, `${bci_index}.svg`), svg, 'utf-8');
      converted++;

      if (converted % 50 === 0 || converted === 1) {
        process.stdout.write(
          `  ${converted + done.size}/${concepts.length} converted (${failed} failed)...\r`
        );
      }
    } catch (err) {
      failed++;
      if (failed <= 5) {
        console.warn(`  Failed BCI ${bci_index}: ${err.message}`);
      }
    }

    // Rate limit
    await sleep(100);
  }

  console.log(`\n\nConversion complete:`);
  console.log(`  ${converted} newly converted`);
  console.log(`  ${done.size} previously done`);
  console.log(`  ${failed} failed`);
  console.log(`  ${converted + done.size} total SVGs in ${OUTPUT_DIR}`);
  console.log(`\nNext step: upload to R2 with bliss-upload-r2.js`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
