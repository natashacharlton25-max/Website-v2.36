const fs = require('fs');
const path = require('path');

const atomsDir = path.join(__dirname, '..', 'src', 'components', 'atoms');
const atoms = fs.readdirSync(atomsDir).filter(d =>
  fs.statSync(path.join(atomsDir, d)).isDirectory()
);

const summary = [];
console.log('=== ATOM VALIDATOR ===\n');

for (const atom of atoms) {
  const dir = path.join(atomsDir, atom);
  const cssFiles = fs.readdirSync(dir).filter(f => f.endsWith('.css'));
  const issues = [];

  for (const file of cssFiles) {
    const lines = fs.readFileSync(path.join(dir, file), 'utf8').split('\n');

    let isKeyframe = false;
    lines.forEach((line, i) => {
      const ln = i + 1;
      const t = line.trim();
      if (t.startsWith('/*') || t.startsWith('*') || t.startsWith('//')) return;
      if (/@keyframes/.test(line)) isKeyframe = true;
      if (isKeyframe && /^\s*\}\s*$/.test(line)) { isKeyframe = false; return; }

      // Rule 1: Nested var() fallback — var(--x, var(--y))
      if (/var\(--[^,)]*,.*var\(--/.test(line)) {
        const m = line.match(/var\(--[^,)]*,\s*var\(--[^)]*\)/);
        issues.push({ rule: 1, ln, file, msg: `fallback: ${m ? m[0] : 'nested var()'}` });
      }

      // Rule 2: Hardcoded px >= 10 (not border-width, not 9999, not in comment)
      const codeOnly = line.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, '');
      for (const m of codeOnly.matchAll(/(\d+)px/g)) {
        const v = parseInt(m[1]);
        if (v < 10 || v === 9999) continue;
        if (/border-width|border:\s/.test(codeOnly)) continue;
        issues.push({ rule: 2, ln, file, msg: `hardcoded px: ${m[0]}` });
      }

      // Rule 3: Hardcoded hex (not in mask/gradient technical context)
      if (/#[0-9a-fA-F]{3,8}\b/.test(line)) {
        if (!/mask|gradient/.test(line)) {
          const m = line.match(/#[0-9a-fA-F]{3,8}/);
          issues.push({ rule: 3, ln, file, msg: `hardcoded hex: ${m[0]}` });
        }
      }

      // Rule 4: Hardcoded rgb/rgba/hsl (not inside color-mix)
      if (/\b(rgba?|hsla?)\(/.test(line) && !/color-mix/.test(line)) {
        const m = line.match(/(rgba?|hsla?)\([^)]*\)/);
        if (m) issues.push({ rule: 4, ln, file, msg: `hardcoded colour: ${m[0].substring(0, 50)}` });
      }

      // Rule 5: Hardcoded opacity (not 0, not 1, not var())
      const opMatch = line.match(/opacity:\s*([^;]+)/);
      if (opMatch) {
        const v = opMatch[1].trim();
        if (!/var\(/.test(v) && v !== '0' && v !== '1') {
          issues.push({ rule: 5, ln, file, msg: `hardcoded opacity: ${v}` });
        }
      }

      // Rule 6: Hardcoded duration (number+s/ms, not 0s, not inside var())
      for (const m of line.matchAll(/(?<!\w)(\d+\.?\d*)(ms|s)\b/g)) {
        if (parseFloat(m[1]) === 0) continue;
        if (/var\(/.test(line)) continue;
        issues.push({ rule: 6, ln, file, msg: `hardcoded duration: ${m[0]}` });
      }

      // Rule 7: Hardcoded easing (not inside var(), not linear-gradient, not @keyframes)
      if (!isKeyframe && !/var\(/.test(line)) {
        if (/cubic-bezier\(/.test(line)) {
          const m = line.match(/cubic-bezier\([^)]+\)/);
          if (m) issues.push({ rule: 7, ln, file, msg: `hardcoded easing: ${m[0]}` });
        } else if (/\b(ease-in-out|ease-in|ease-out|ease)\b/.test(line)) {
          const m = line.match(/\b(ease-in-out|ease-in|ease-out|ease)\b/);
          issues.push({ rule: 7, ln, file, msg: `hardcoded easing: ${m[0]}` });
        } else if (/\blinear\b/.test(line) && !/linear-gradient/.test(line)) {
          issues.push({ rule: 7, ln, file, msg: 'hardcoded easing: linear' });
        }
      }
      // Rule 11: Assistive render in component CSS
      if (/data-render=["']assistive["']/.test(line)) {
        issues.push({ type: 'MOVE', rule: 11, ln, file, msg: 'assistive rule (→ assistive-gate.css)' });
      }

      // Rule 12: Zone/gate rules in component CSS
      if (/data-mode=/.test(line))
        issues.push({ type: 'MOVE', rule: 12, ln, file, msg: 'dark mode rule (→ theme-luminance-dark.css)' });
      if (/data-high-contrast/.test(line))
        issues.push({ type: 'MOVE', rule: 12, ln, file, msg: 'high-contrast rule (→ high-contrast.css)' });
      if (/data-render=["']textonly["']/.test(line))
        issues.push({ type: 'MOVE', rule: 12, ln, file, msg: 'textonly rule (→ textonly-gate.css)' });
      if (/data-render=["']reduced["']/.test(line))
        issues.push({ type: 'MOVE', rule: 12, ln, file, msg: 'reduced rule (→ reduced-gate.css)' });
      if (/data-highlight-links/.test(line))
        issues.push({ type: 'MOVE', rule: 12, ln, file, msg: 'highlight-links rule (→ highlight-links.css)' });
    });
  }

  // ─── ASTRO RULES (8, 9, 10) ───
  const astroFiles = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));
  const styleExceptions = { Text: /inlineStyle|--text-clamp/, Icon: /size/, LottieIcon: /size/, Image: /maskIconStyle/, Heading: /mergedStyle/ };
  for (const file of astroFiles) {
    const lines = fs.readFileSync(path.join(dir, file), 'utf8').split('\n');
    lines.forEach((line, i) => {
      const ln = i + 1;

      // Rule 8: Inline styles in Astro
      if (/style=/.test(line)) {
        const ex = styleExceptions[atom];
        if (!(ex && ex.test(line))) {
          issues.push({ rule: 8, ln, file, msg: `inline style: ${line.trim().substring(0, 60)}` });
        }
      }

      // Rule 9: CSS computation maps (exclude API headers and data attributes)
      if (/const\s+\w*(Map|map)\b/.test(line) || /const\s+\w*:\s*Record</.test(line)) {
        if (!/headers|dataAttrs|data-|iconSizeMap|mediaSizeMap/.test(line)) {
          issues.push({ rule: 9, ln, file, msg: `CSS computation: ${line.trim().substring(0, 60)}` });
        }
      }

      // Rule 10: Rest spread
      if (/\[key:\s*string\]/.test(line)) {
        issues.push({ rule: 10, ln, file, msg: 'rest spread: [key: string]' });
      }
    });
  }

  // ─── SCHEMA RULES (13, 14) ───
  const schemaFile = `${atom}.schema.json`;
  const schemaPath = path.join(dir, schemaFile);
  if (fs.existsSync(schemaPath)) {
    const lines = fs.readFileSync(schemaPath, 'utf8').split('\n');
    lines.forEach((line, i) => {
      const ln = i + 1;
      if (/"type":\s*"token"/.test(line))
        issues.push({ rule: 13, ln, file: schemaFile, msg: `schema token type: ${line.trim().substring(0, 60)}` });
      if (/"cssProperty"/.test(line))
        issues.push({ rule: 13, ln, file: schemaFile, msg: `cssProperty in schema` });
      if (/"assistive"/.test(line) && /\.astro/.test(line))
        issues.push({ rule: 14, ln, file: schemaFile, msg: `assistive render: ${line.trim().substring(0, 50)}` });
    });
  } else if (atom !== 'FigCaption') {
    issues.push({ rule: 13, ln: '--', file: '--', msg: 'missing schema.json' });
  }

  // ─── RULE 15: Colour enum count ───
  const colourEnums = ['primary', 'secondary', 'neutral', 'red', 'orange', 'yellow', 'teal', 'blue', 'purple', 'pink'];
  const allCss = cssFiles.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  const found = colourEnums.filter(c => new RegExp(`\\.\\w[\\w-]*--${c}\\b`).test(allCss));
  if (found.length > 0 && found.length < 10) {
    const missing = colourEnums.filter(c => !found.includes(c));
    issues.push({ type: 'WARN', rule: 15, ln: '--', file: cssFiles[0], msg: `${found.length}/10 colour enums (missing: ${missing.join(', ')})` });
  }

  if (issues.length === 0) {
    console.log(`${atom} ✅ CLEAN`);
  } else {
    console.log(`${atom} ${issues.length > 20 ? '❌' : '⚠️'} ${issues.length} issues`);
    for (const i of issues) {
      const tag = i.type || 'FAIL';
      console.log(`  ${tag.padEnd(4)}  Rule ${String(i.rule).padEnd(2)}  ${i.file}:${i.ln}  ${i.msg}`);
    }
  }
  console.log('');
  summary.push({ atom, count: issues.length });
}

console.log('─────────────────────');
console.log('SUMMARY');
summary.sort((a, b) => a.count - b.count);
for (const s of summary) {
  const icon = s.count === 0 ? '✅' : s.count > 20 ? '❌' : '⚠️';
  console.log(`  ${s.atom.padEnd(14)} ${icon} ${s.count} issues`);
}
