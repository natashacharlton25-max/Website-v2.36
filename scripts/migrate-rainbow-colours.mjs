#!/usr/bin/env node
/**
 * One-shot migration: rename atom-level colour values from
 * "red"/"orange"/"yellow"/"teal"/"blue"/"purple"/"pink"
 * to positional names "rainbow-1" through "rainbow-7" in test JSON files.
 *
 * Only touches specific props (rainbowColor, drawColor, highlightColor,
 * underlineColor, dividerColor) — does NOT touch gradientBlend (gradient
 * names use the legacy red/orange vocabulary until the gradient catalogue
 * refactor) and does NOT touch other strings that happen to be "red".
 *
 * Run from project root: node scripts/migrate-rainbow-colours.mjs
 */

import fs from 'node:fs';

const COLOUR_MAP = {
  red: 'rainbow-1',
  orange: 'rainbow-2',
  yellow: 'rainbow-3',
  teal: 'rainbow-4',
  blue: 'rainbow-5',
  purple: 'rainbow-6',
  pink: 'rainbow-7',
};

const PROPS = [
  'rainbowColor',
  'highlightColor',
  'underlineColor',
  'dividerColor',
  'drawColor',
];

const FILES = [
  'src/data/test/badge.json',
  'src/data/test/heading.json',
  'src/data/test/icon.json',
  'src/data/test/shape.json',
  'src/data/test/rainbow-gradients.json',
];

let totalReplacements = 0;
const report = [];

for (const file of FILES) {
  if (!fs.existsSync(file)) {
    console.log(`SKIP (not found): ${file}`);
    continue;
  }
  let content = fs.readFileSync(file, 'utf8');
  let fileReplacements = 0;
  const replacementsByProp = {};

  for (const prop of PROPS) {
    for (const [oldVal, newVal] of Object.entries(COLOUR_MAP)) {
      const regex = new RegExp(`("${prop}"\\s*:\\s*)"${oldVal}"`, 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, `$1"${newVal}"`);
        fileReplacements += matches.length;
        replacementsByProp[prop] = (replacementsByProp[prop] || 0) + matches.length;
      }
    }
  }

  if (fileReplacements > 0) {
    fs.writeFileSync(file, content, 'utf8');
  }
  report.push({ file, count: fileReplacements, props: replacementsByProp });
  totalReplacements += fileReplacements;
}

console.log('\n=== Migration report ===');
for (const r of report) {
  console.log(`${r.file}: ${r.count} replacements`);
  for (const [prop, count] of Object.entries(r.props)) {
    console.log(`   ${prop}: ${count}`);
  }
}
console.log(`\nTotal: ${totalReplacements} replacements across ${report.filter(r => r.count > 0).length} files`);
