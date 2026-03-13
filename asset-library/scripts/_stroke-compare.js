const { BlissSVGBuilder } = require('bliss-svg-builder');
const { writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');

const dir = resolve(__dirname, '../../_bliss-svg-test/stroke-compare');
mkdirSync(dir, { recursive: true });

const map = require('./blissary-bci-map.json');
const bciToCode = new Map();
for (const e of map) { if (e.bciAvId != null) bciToCode.set(e.bciAvId, e.blissSvgBuilderCode); }

const weights = [0.5, 0.75, 1.0, 1.5];
const bcis = [12383, 14905, 17462, 16161, 14676];

for (const bci of bcis) {
  const code = bciToCode.get(bci);
  if (!code) { console.log('No code for', bci); continue; }
  for (const w of weights) {
    const b = new BlissSVGBuilder('[stroke-width=' + w + ']||' + code);
    writeFileSync(resolve(dir, bci + '_sw' + w + '.svg'), b.svgCode, 'utf-8');
  }
  console.log('BCI ' + bci + ' (' + code + ') — 4 weights written');
}

// HTML comparison page
let html = '<!DOCTYPE html><html><head><style>body{font-family:sans-serif;background:#fff} .row{display:flex;gap:24px;align-items:center;margin:16px 0;padding:12px;border-bottom:1px solid #eee} .row img{height:80px;width:auto} .label{min-width:120px;font-weight:bold} .weight{font-size:12px;color:#666;text-align:center}</style></head><body><h1>Bliss SVG Stroke Width Comparison</h1>';

for (const bci of bcis) {
  const code = bciToCode.get(bci);
  if (!code) continue;
  html += '<div class="row"><span class="label">' + bci + ' (' + code + ')</span>';
  for (const w of weights) {
    html += '<div><div class="weight">stroke=' + w + '</div><img src="' + bci + '_sw' + w + '.svg"></div>';
  }
  html += '</div>';
}

html += '</body></html>';
writeFileSync(resolve(dir, 'compare.html'), html, 'utf-8');
console.log('\nOpen: ' + resolve(dir, 'compare.html'));
