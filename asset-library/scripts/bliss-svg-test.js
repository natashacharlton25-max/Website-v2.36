/**
 * bliss-svg-test.js — Test potrace quality on 20 Bliss symbols
 *
 * Picks 20 BCI indices spanning simple → complex symbols:
 *   - Basic shapes (circle, square, line)
 *   - Common words (cat, dog, house, person)
 *   - Grammar indicators (plural, past action)
 *   - Complex composed symbols (hospital, telephone)
 *
 * Outputs to _bliss-svg-test/ for visual inspection.
 *
 * Usage: node asset-library/scripts/bliss-svg-test.js
 */

const { mkdirSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');
const https = require('node:https');
const http = require('node:http');
const sharp = require('sharp');
const potrace = require('potrace');

const OUTPUT_DIR = resolve(__dirname, '../../_bliss-svg-test');
const LICENCE = 'CC BY-SA 3.0 Blissymbolics Communication International';

// 20 test symbols — mix of simple, complex, and grammar indicators
const TEST_SYMBOLS = [
  { bci: 12383, english: 'cat,feline_(animal),felid', pos: 'YELLOW' },
  { bci: 12380, english: 'dog,canine_(animal),canid', pos: 'YELLOW' },
  { bci: 13382, english: 'house,dwelling', pos: 'YELLOW' },
  { bci: 14916, english: 'person,human_being,individual', pos: 'YELLOW' },
  { bci: 14676, english: 'happy,glad,merry,cheerful', pos: 'GREEN' },
  { bci: 14855, english: 'water', pos: 'YELLOW' },
  { bci: 13317, english: 'food,nourishment', pos: 'YELLOW' },
  { bci: 14528, english: 'go,to_go,move', pos: 'RED' },
  { bci: 12357, english: 'aeroplane,airplane', pos: 'YELLOW' },
  { bci: 13377, english: 'hospital', pos: 'YELLOW' },
  { bci: 14939, english: 'sun', pos: 'YELLOW' },
  { bci: 15054, english: 'tree', pos: 'YELLOW' },
  { bci: 14948, english: 'telephone,phone', pos: 'YELLOW' },
  { bci: 12549, english: 'book', pos: 'YELLOW' },
  { bci: 14676, english: 'heart,love', pos: 'YELLOW' },
  // Grammar indicators (simple geometric marks)
  { bci: 9011, english: 'plural_(indicator)', pos: 'GREY' },
  { bci: 9004, english: 'past_action_(indicator)', pos: 'GREY' },
  { bci: 8998, english: 'description_(indicator)', pos: 'GREY' },
  { bci: 8999, english: 'future_action_(indicator)', pos: 'GREY' },
  { bci: 12663, english: 'possessive_(indicator)', pos: 'GREY' },
];

// ── HTTP fetch ──

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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Potrace ──

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

function escAttr(val) {
  return String(val || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectMetadata(svg, bci, english, pos) {
  const attrs = [
    `data-bci="${bci}"`,
    `data-english="${escAttr(english)}"`,
    `data-pos="${escAttr(pos)}"`,
    `data-licence="${escAttr(LICENCE)}"`,
  ].join(' ');
  return svg.replace(/<svg/, `<svg ${attrs}`);
}

// ── Main ──

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Testing potrace on ${TEST_SYMBOLS.length} Bliss symbols...`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  let ok = 0;
  let fail = 0;

  for (const sym of TEST_SYMBOLS) {
    const url = `https://www.blissymbolics.net/refnumber/${sym.bci}`;
    const word = sym.english.split(',')[0].replace(/\s*\([^)]*\)/, '').trim();

    process.stdout.write(`  BCI ${sym.bci} (${word})... `);

    try {
      const pngBuf = await fetchBuffer(url);
      if (!pngBuf || pngBuf.length < 100) {
        console.log('SKIP (no PNG)');
        fail++;
        continue;
      }

      // Save original PNG for comparison
      writeFileSync(resolve(OUTPUT_DIR, `${sym.bci}_original.png`), pngBuf);

      // Preprocess
      const processed = await sharp(pngBuf)
        .greyscale()
        .threshold(128)
        .png()
        .toBuffer();

      // Trace
      let svg = await traceToSvg(processed);
      svg = injectMetadata(svg, sym.bci, sym.english, sym.pos);

      // Save SVG
      const svgPath = resolve(OUTPUT_DIR, `${sym.bci}.svg`);
      writeFileSync(svgPath, svg, 'utf-8');

      const pngKb = (pngBuf.length / 1024).toFixed(1);
      const svgKb = (Buffer.byteLength(svg) / 1024).toFixed(1);
      console.log(`OK (PNG ${pngKb}KB -> SVG ${svgKb}KB)`);
      ok++;
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
      fail++;
    }

    await sleep(200);
  }

  console.log(`\n${ok} converted, ${fail} failed`);
  console.log(`\nOpen ${OUTPUT_DIR} in your file explorer to compare:`);
  console.log(`  - *_original.png = source from blissymbolics.net`);
  console.log(`  - *.svg = potrace output with metadata`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
