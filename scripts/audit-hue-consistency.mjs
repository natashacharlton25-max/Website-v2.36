import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chroma = require('chroma-js');

const dir = 'src/styles/themes/a11y/cloudcalm';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.css'));

function getToken(css, name) {
  const m = css.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]+)'));
  return m ? m[1] : null;
}
function hue(hex) {
  const h = chroma(hex).get('oklch.h');
  return Number.isFinite(h) ? h.toFixed(0) : '-';
}

for (const f of files) {
  const css = fs.readFileSync(path.join(dir, f), 'utf8');
  const name = f.replace('.css', '');
  console.log('\n=== ' + name + ' ===');
  for (const family of ['primary', 'secondary', 'neutral', 'text']) {
    const hexes = ['tint', 'mid', 'base', 'emphasis'].map(p => {
      const h = getToken(css, `${family}-${p}`);
      return h ? `${h}(h${hue(h)})` : '-';
    });
    // Flag hue inconsistency within family — if max-min hue distance > 30°, family is broken
    const hues = hexes.map(h => h === '-' ? null : parseFloat(h.match(/h([\d.-]+)/)[1])).filter(Number.isFinite);
    let maxDist = 0;
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        const d = Math.abs(hues[i] - hues[j]);
        const dist = Math.min(d, 360 - d);
        if (dist > maxDist) maxDist = dist;
      }
    }
    const flag = maxDist > 30 ? ' ⚠️ SPLIT ' + maxDist.toFixed(0) + '°' : '';
    console.log(`  ${family.padEnd(10)}: ${hexes.join('  ')}${flag}`);
  }
}
