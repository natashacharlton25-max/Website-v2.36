/**
 * bliss-generate-svgs.js — Generate Bliss SVGs using bliss-svg-builder
 *
 * Uses the BCI→B-code mapping from bliss-blissary-bci-id-map to generate
 * proper vector SVGs for every Bliss symbol via bliss-svg-builder.
 *
 * Each SVG carries metadata attributes:
 *   data-bci      — BCI reference number
 *   data-english  — English glosses (comma-separated)
 *   data-pos      — Part of speech (YELLOW=noun, RED=verb, GREEN=adj, etc.)
 *   data-licence  — CC BY-SA 4.0 BCI / MPL-2.0 bliss-svg-builder
 *
 * Output: _bliss-svg/{bci_index}.svg
 *
 * Usage: node asset-library/scripts/bliss-generate-svgs.js
 *
 * No network requests — pure local generation.
 * No AI tokens.
 */

const { execSync } = require('node:child_process');
const { writeFileSync, mkdirSync, readdirSync } = require('node:fs');
const { resolve } = require('node:path');
const { BlissSVGBuilder } = require('bliss-svg-builder');

const WORKER_DIR = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(__dirname, '../../_bliss-svg');
const MAP_FILE = resolve(__dirname, 'blissary-bci-map.json');
const LICENCE = 'CC BY-SA 3.0 BCI / MPL-2.0 bliss-svg-builder';

// ── D1 helper ──

function d1Query(sql) {
  const flat = sql.replace(/\s+/g, ' ').trim();
  const escaped = flat.replace(/"/g, '\\"');
  const cmd = `npx wrangler d1 execute asset-library --remote --command="${escaped}" --json`;
  const raw = execSync(cmd, { encoding: 'utf-8', cwd: WORKER_DIR, maxBuffer: 50 * 1024 * 1024 });
  const parsed = JSON.parse(raw);
  if (!parsed[0] || !parsed[0].success) {
    throw new Error(`D1 query failed: ${flat}`);
  }
  return parsed[0].results;
}

// Paginated query for large tables
function d1QueryPaginated(sql, pageSize = 2000) {
  const allResults = [];
  let offset = 0;
  while (true) {
    const pageSql = `${sql} LIMIT ${pageSize} OFFSET ${offset}`;
    const rows = d1Query(pageSql);
    allResults.push(...rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return allResults;
}

// ── XML attribute escaping ──

function escAttr(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ── Inject metadata into SVG ──

function injectMetadata(svg, bciIndex, english, pos) {
  const attrs = [
    `data-bci="${bciIndex}"`,
    `data-english="${escAttr(english)}"`,
    `data-pos="${escAttr(pos || '')}"`,
    `data-licence="${escAttr(LICENCE)}"`,
  ].join(' ');
  return svg.replace(/<svg/, `<svg ${attrs}`);
}

// ── Main ──

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Check what's already done (for resume)
  const done = new Set(
    readdirSync(OUTPUT_DIR)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => parseInt(f.replace('.svg', ''), 10))
      .filter((n) => !isNaN(n))
  );
  console.log(`Output dir: ${OUTPUT_DIR}`);
  console.log(`Already generated: ${done.size} SVGs`);

  // Load BCI→B-code mapping
  const mapping = require(MAP_FILE);
  const bciToCode = new Map();
  for (const entry of mapping) {
    if (entry.bciAvId != null) {
      bciToCode.set(entry.bciAvId, entry.blissSvgBuilderCode);
    }
  }
  console.log(`BCI→B-code mapping: ${bciToCode.size} entries`);

  // Fetch BCI concepts from D1 for English glosses + POS
  console.log('Fetching BCI concepts from D1...');
  const concepts = d1QueryPaginated(
    'SELECT bci_index, english, pos FROM bci_concepts ORDER BY bci_index'
  );
  console.log(`BCI concepts: ${concepts.length}`);

  // Filter to concepts that have a B-code and aren't already done
  const remaining = concepts.filter(
    (c) => bciToCode.has(c.bci_index) && !done.has(c.bci_index)
  );
  console.log(`Remaining to generate: ${remaining.length}`);

  if (remaining.length === 0) {
    console.log('All done!');
    return;
  }

  let generated = 0;
  let failed = 0;

  for (const concept of remaining) {
    const { bci_index, english, pos } = concept;
    const bCode = bciToCode.get(bci_index);

    try {
      const builder = new BlissSVGBuilder('[stroke-width=1]||' + bCode);
      let svg = builder.svgCode;

      if (!svg || svg.length < 10) {
        failed++;
        if (failed <= 5) {
          console.warn(`  Empty SVG for BCI ${bci_index} (${bCode})`);
        }
        continue;
      }

      // Inject metadata attributes
      svg = injectMetadata(svg, bci_index, english, pos);

      // Write to output dir
      writeFileSync(resolve(OUTPUT_DIR, `${bci_index}.svg`), svg, 'utf-8');
      generated++;

      if (generated % 200 === 0 || generated === 1) {
        process.stdout.write(
          `  ${generated + done.size} generated (${failed} failed)...\r`
        );
      }
    } catch (err) {
      failed++;
      if (failed <= 10) {
        console.warn(`  Failed BCI ${bci_index} (${bCode}): ${err.message}`);
      }
    }
  }

  console.log(`\n\nGeneration complete:`);
  console.log(`  ${generated} newly generated`);
  console.log(`  ${done.size} previously done`);
  console.log(`  ${failed} failed`);
  console.log(`  ${generated + done.size} total SVGs in ${OUTPUT_DIR}`);
  console.log(`\nNext step: upload to R2 with bliss-upload-r2.js`);
}

main();
