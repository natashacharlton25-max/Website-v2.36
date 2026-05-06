const fs = require('fs');
const path = require('path');

/**
 * ATOM VALIDATOR — checks every atom against canonical-atom-pattern.md
 *
 * RULE LEGEND:
 *   CSS rules (scanned in component .css files)
 *     1   Nested var() fallback — var(--x, var(--y))
 *     2   Hardcoded px >= 10 (not border-width, not 9999)
 *     3   Hardcoded hex colour (not in mask/gradient context)
 *     4   Hardcoded rgb/rgba/hsl (not in color-mix)
 *     5   Hardcoded opacity (not 0, not 1, not var())
 *     6   Hardcoded duration (not 0s, not inside var())
 *     7   Hardcoded easing (not in @keyframes, not var())
 *    11   [data-render="assistive"] in component CSS (→ assistive-gate.css)
 *    12   Zone/gate rules in component CSS (dark, HC, textonly, reduced, highlight-links)
 *    16   @layer wrapper in component CSS
 *    17   !important in component CSS
 *    18   @media (prefers-reduced-motion) in component CSS
 *    19   .a11y-* class selector in component CSS
 *    20   #a11y-content-wrapper reference
 *    21   transition: rule in component CSS (→ transitions.css) [WARN]
 *    22   :focus-visible rule in component CSS (→ focus-gate.css) [MOVE]
 *    29   :hover in component CSS (→ hover-gate.css) [WARN]
 *         hover has 4 modes: full, soft, instant, none (none = click replaces hover)
 *    31   @keyframes in component CSS (→ micro-animations.css for global gating) [WARN]
 *    32   animation: shorthand without var() tokens [FAIL]
 *         all animation must use --duration-* / --ease-* tokens so one gate file
 *         can kill all motion by zeroing the tokens
 *
 *   Astro rules (scanned in component .astro files)
 *     8   Inline style= (with per-atom exceptions)
 *     9   CSS computation maps / Record<> (with exceptions)
 *    10   Rest spread [key: string]
 *    23   :global() selector in .astro
 *    24   Scoped <style> block in .astro (should be external CSS)
 *
 *   Schema rules (scanned in .schema.json)
 *    13   "type": "token" or "cssProperty" field
 *    14   "assistive" render pointing to .astro file
 *    25   Missing required prop groups (content, visual, animation, colour)
 *    26   Non-empty colour group (colour is a visual enum, group must be {})
 *    27   Default value looks like a token name (e.g. "neutral-400")
 *    28   Unexpected render keys (must be full/reduced/textonly only)
 *    30   Schema color enum must be canonical 11 values
 *         (default [--color-Text], primary, secondary, neutral, + 7 rainbow)
 *    33   Animation prop in wrong schema group — anything that moves belongs
 *         in animation{}, not content{} or visual{}, so pipeline can strip it
 *    34   Animation library import without render gate in component script
 *         (must check getMotion() / data-render BEFORE importing gsap/lottie/matter)
 *    35   String prop in visual/animation group without enum
 *         content group strings are exempt (text, slugs, URLs are freeform)
 *    36   class/style prop in schema — Astro composition only, not JSON content
 *    37   Hardcoded enum union in .astro — should import from shared-enums.ts
 *         Checks for inline 'spin' | 'bounce' etc. patterns that match shared enums
 *    38   gradientType/gradientFocus in atom schema — radial only for large elements
 *    39   slots/class/style in schema — Renderer handles slots, class/style are Astro-only
 *    40   Per-atom colour classes in CSS — should use global .color--{name} mixin
 *    41   Zone/mode overrides in global/*.css — should be in zones/*.css
 *         (Card, Section). Atoms use linear direction + spread only.
 *    42   Atom CSS @import in global.css when the atom's barrel (index.ts)
 *         already imports the same file. Astro emits the rules twice into
 *         the bundle, which can cause duplicate-rule + cascade-order bugs.
 *
 *   Coverage rules
 *    15   Colour enum count in CSS (10 classes expected: primary..pink)
 */

const atomsDir = path.join(__dirname, '..', 'src', 'components', 'atoms');
const atoms = fs.readdirSync(atomsDir).filter(d =>
  fs.statSync(path.join(atomsDir, d)).isDirectory()
);

// Per-atom exceptions for transition rules (documented in canonical)
const transitionExceptions = {
  Button: true,   // 22 variant-specific hover suppressions
  Link: true,     // focus-active strip effects
  FormField: true  // sibling focus pattern
};

// Per-atom exceptions for :hover rules (documented in canonical)
// These atoms have variant-specific hover behaviour that stays in component CSS
const hoverExceptions = {
  Button: true,   // 22 variant-specific hover suppressions
  Link: true,     // focus-active strip effects on hover
  Icon: true      // hover-triggered animation (spin/pulse/bounce)
};

// Per-atom exceptions for focus-visible rules
const focusExceptions = {
  FormField: true,  // sibling focus selectors
  Link: true        // focus-active rules
};

const summary = [];
console.log('=== ATOM VALIDATOR ===\n');

// Rule 42: detect atom CSS @import-ed in global.css when the atom's
// barrel (index.ts) already imports the same file. Reports once per
// duplicate, before the per-atom loop runs.
const globalCssPath = path.join(__dirname, '..', 'src', 'styles', 'global.css');
if (fs.existsSync(globalCssPath)) {
  const globalCss = fs.readFileSync(globalCssPath, 'utf8');
  const atomImportRe = /@import\s+['"][^'"]*\/components\/atoms\/([^/'"]+)\/([^'"]+\.css)['"]/g;
  let match;
  const dupes = [];
  while ((match = atomImportRe.exec(globalCss)) !== null) {
    const [, atomName, cssFile] = match;
    const barrelPath = path.join(atomsDir, atomName, 'index.ts');
    if (!fs.existsSync(barrelPath)) continue;
    const barrel = fs.readFileSync(barrelPath, 'utf8');
    if (barrel.includes(`./${cssFile}`)) {
      dupes.push({ atom: atomName, file: cssFile });
    }
  }
  if (dupes.length > 0) {
    console.log('global.css ❌ ' + dupes.length + ' duplicate atom CSS import(s)');
    for (const d of dupes) {
      console.log('  FAIL  Rule 42  global.css  ' + d.atom + '/' + d.file + ' — already imported by ' + d.atom + '/index.ts');
    }
    console.log('');
  }
}


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

      // Rule 16: @layer in component CSS
      if (/@layer\s/.test(line)) {
        issues.push({ rule: 16, ln, file, msg: `@layer wrapper` });
      }

      // Rule 17: !important in component CSS
      if (/!important/.test(line)) {
        issues.push({ rule: 17, ln, file, msg: `!important: ${t.substring(0, 60)}` });
      }

      // Rule 18: @media (prefers-reduced-motion) in component CSS
      if (/prefers-reduced-motion/.test(line)) {
        issues.push({ rule: 18, ln, file, msg: 'prefers-reduced-motion (pipeline handles this)' });
      }

      // Rule 19: .a11y-* class selector in component CSS
      if (/\.a11y-/.test(line)) {
        issues.push({ rule: 19, ln, file, msg: `a11y class selector: ${t.substring(0, 60)}` });
      }

      // Rule 20: #a11y-content-wrapper in component CSS
      if (/#a11y-content-wrapper/.test(line)) {
        issues.push({ rule: 20, ln, file, msg: '#a11y-content-wrapper reference' });
      }

      // Rule 21: transition: in component CSS (→ transitions.css) — WARN with exceptions
      if (!transitionExceptions[atom] && /\btransition\s*:/.test(line) && !/var\(/.test(line)) {
        issues.push({ type: 'WARN', rule: 21, ln, file, msg: `transition rule (→ transitions.css?): ${t.substring(0, 60)}` });
      }

      // Rule 22: :focus-visible in component CSS (→ focus-gate.css) — MOVE with exceptions
      if (!focusExceptions[atom] && /:focus-visible/.test(line)) {
        issues.push({ type: 'MOVE', rule: 22, ln, file, msg: `focus-visible rule (→ focus-gate.css): ${t.substring(0, 60)}` });
      }

      // Rule 29: :hover in component CSS (→ hover-gate.css) — WARN with exceptions
      // Hover has 4 modes: full, soft, instant, none (none = click replaces hover)
      // Component CSS should not contain bare :hover — gate via [data-hover] in hover-gate.css
      if (!hoverExceptions[atom] && /:hover/.test(line) && !/data-hover/.test(line)) {
        issues.push({ type: 'WARN', rule: 29, ln, file, msg: `hover rule (→ hover-gate.css?): ${t.substring(0, 60)}` });
      }

      // Rule 31: @keyframes in component CSS (→ micro-animations.css)
      // Keyframes should be global so one gate file can disable all motion
      if (/@keyframes\s/.test(line)) {
        issues.push({ type: 'WARN', rule: 31, ln, file, msg: `@keyframes in component (→ micro-animations.css?): ${t.substring(0, 50)}` });
      }

      // Rule 32: animation: shorthand without var() tokens
      // All animation MUST use --duration-* / --ease-* tokens for global gating
      // Setting tokens to 0s/none kills all motion in one place
      // "animation: none" is exempt — it IS the gating (explicitly disabling motion)
      if (/\banimation\s*:/.test(line) && !/var\(/.test(line) && !isKeyframe && !/animation\s*:\s*none/.test(line)) {
        issues.push({ rule: 32, ln, file, msg: `animation without tokens (use var(--duration-*) / var(--ease-*)): ${t.substring(0, 60)}` });
      }
    });

    // Rule 40: Per-atom colour classes — should use global .color--{name}
    const atomLower = atom.toLowerCase();
    const perAtomColorRe = new RegExp(`\\.${atomLower}--(?:primary|secondary|neutral|red|orange|yellow|teal|blue|purple|pink)\\b`);
    for (const f of cssFiles) {
      const cssContent = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
      cssContent.forEach((line, i) => {
        if (perAtomColorRe.test(line) && !/color--/.test(line)) {
          issues.push({ rule: 40, ln: i + 1, file: f, msg: `per-atom colour class — use global .color--{name} mixin` });
        }
      });
    }
  }

  // ─── ASTRO RULES (8, 9, 10, 23, 24) ───
  const astroFiles = fs.readdirSync(dir).filter(f => f.endsWith('.astro'));
  const styleExceptions = { Text: /inlineStyle|--text-clamp/, Icon: /size/, LottieIcon: /size/, Image: /maskIconStyle/, Heading: /mergedStyle|tagInlineStyle/, Badge: /badgeAnimStyle/ };
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

      // Rule 9: CSS computation maps (exclude API headers and data attributes).
      // reverseDir is enum→enum (gradient direction flip), not enum→CSS, so allowed.
      if (/const\s+\w*(Map|map)\b/.test(line) || /const\s+\w*:\s*Record</.test(line)) {
        if (!/headers|dataAttrs|data-|iconSizeMap|mediaSizeMap|reverseDir/.test(line)) {
          issues.push({ rule: 9, ln, file, msg: `CSS computation: ${line.trim().substring(0, 60)}` });
        }
      }

      // Rule 10: Rest spread
      if (/\[key:\s*string\]/.test(line)) {
        issues.push({ rule: 10, ln, file, msg: 'rest spread: [key: string]' });
      }

      // Rule 23: :global() selector in .astro
      if (/:global\(/.test(line)) {
        issues.push({ rule: 23, ln, file, msg: `:global() selector: ${line.trim().substring(0, 60)}` });
      }

      // Rule 24: Scoped <style> block in .astro (should use external CSS)
      if (/^\s*<style[\s>]/.test(line) && !/is:global/.test(line)) {
        issues.push({ rule: 24, ln, file, msg: 'scoped <style> block (use external .css file)' });
      }
    });

    // Rule 34: Animation library import without render gate
    // Must check getMotion() / data-render BEFORE importing gsap/lottie/matter
    // Pattern: ungated static import of animation library at top of <script>
    const fullContent = lines.join('\n');
    const animLibPattern = /import\s.*['"](?:gsap|lottie-web|matter-js|@lottiefiles)/;
    const hasAnimImport = lines.findIndex(l => animLibPattern.test(l));
    if (hasAnimImport !== -1) {
      // Check if file has a render gate BEFORE the animation code runs
      const hasGate = /getMotion|data[\.\[]render|data-render|prefersReducedMotion/.test(fullContent);
      if (!hasGate) {
        issues.push({ rule: 34, ln: hasAnimImport + 1, file, msg: `ungated animation import (check getMotion() before importing): ${lines[hasAnimImport].trim().substring(0, 60)}` });
      }
    }

    // Also flag the old gate pattern — should use getMotion() from gate.ts
    lines.forEach((line, i) => {
      if (/prefersReducedMotion/.test(line)) {
        issues.push({ type: 'WARN', rule: 34, ln: i + 1, file, msg: 'legacy gate: prefersReducedMotion() → use getMotion() from gate.ts' });
      }
    });

    // Rule 37: Hardcoded enum unions — should import from shared-enums.ts
    const hasSharedImport = /from\s+['"].*shared-enums/.test(fullContent);
    if (!hasSharedImport) {
      // Check for known enum patterns that indicate hardcoded values
      const enumPatterns = [
        { pattern: /'spin'\s*\|\s*'bounce'/, name: 'Animation' },
        { pattern: /'fill'\s*\|\s*'outline'\s*\|\s*'glass'/, name: 'Variant' },
        { pattern: /'sharp'\s*\|\s*'subtle'\s*\|\s*'soft'/, name: 'Shape' },
        { pattern: /'tint'\s*\|\s*'mid'\s*\|\s*'base'\s*\|\s*'emphasis'/, name: 'ColourTier' },
        { pattern: /'heading'\s*\|\s*'body'\s*\|\s*'body-alt'/, name: 'FontFamily' },
        { pattern: /'normal'\s*\|\s*'medium'\s*\|\s*'semibold'/, name: 'FontWeight' },
        { pattern: /'brand'\s*\|\s*'fill'\s*\|\s*'duotone'/, name: 'IconWeight' },
        { pattern: /'viewport'\s*\|\s*'autoplay'\s*\|\s*'loop'/, name: 'AnimationTrigger' },
      ];
      for (const { pattern, name } of enumPatterns) {
        if (pattern.test(fullContent)) {
          issues.push({ rule: 37, ln: '--', file, msg: `hardcoded ${name} enum — import from shared-enums.ts` });
        }
      }
    }
  }

  // ─── SCHEMA RULES (13, 14, 25, 26, 27, 28) ───
  const schemaFile = `${atom}.schema.json`;
  const schemaPath = path.join(dir, schemaFile);
  if (fs.existsSync(schemaPath)) {
    const raw = fs.readFileSync(schemaPath, 'utf8');
    const lines = raw.split('\n');

    // Line-by-line checks (rules 13, 14)
    lines.forEach((line, i) => {
      const ln = i + 1;
      if (/"type":\s*"token"/.test(line))
        issues.push({ rule: 13, ln, file: schemaFile, msg: `schema token type: ${line.trim().substring(0, 60)}` });
      if (/"cssProperty"/.test(line))
        issues.push({ rule: 13, ln, file: schemaFile, msg: 'cssProperty in schema' });
      if (/"assistive"/.test(line) && /\.astro/.test(line))
        issues.push({ rule: 14, ln, file: schemaFile, msg: `assistive render: ${line.trim().substring(0, 50)}` });
    });

    // Structural checks (rules 25, 26, 27, 28)
    try {
      const schema = JSON.parse(raw);
      const props = schema.props || {};
      const renders = schema.renders || {};

      // Rule 25: Missing required prop groups
      const requiredGroups = ['content', 'visual', 'animation', 'colour'];
      const missing = requiredGroups.filter(g => !(g in props));
      if (missing.length > 0) {
        issues.push({ rule: 25, ln: '--', file: schemaFile, msg: `missing prop groups: ${missing.join(', ')}` });
      }

      // Rule 26: Colour group should only contain brandColor, rainbowColor, colorTier
      const COLOUR_GROUP_ALLOWED = ['brandColor', 'rainbowColor', 'colorTier', '_description'];
      if (props.colour) {
        for (const key of Object.keys(props.colour)) {
          if (!COLOUR_GROUP_ALLOWED.includes(key)) {
            issues.push({ rule: 26, ln: '--', file: schemaFile, msg: `colour group has unexpected prop "${key}" — allowed: ${COLOUR_GROUP_ALLOWED.join(', ')}` });
          }
        }
      }

      // Rule 27: Defaults that look like token names (e.g. "neutral-400", "primary-200")
      for (const [, groupProps] of Object.entries(props)) {
        if (typeof groupProps !== 'object' || groupProps === null) continue;
        for (const [prop, def] of Object.entries(groupProps)) {
          if (prop.startsWith('_')) continue;
          if (typeof def !== 'object' || def === null) continue;
          if (def.default && typeof def.default === 'string' && /^[a-z]+-\d{2,3}$/.test(def.default)) {
            issues.push({ rule: 27, ln: '--', file: schemaFile, msg: `token-name default: ${prop} = "${def.default}" (use enum value)` });
          }
        }
      }

      // Rule 28: Unexpected render keys
      const allowedRenders = ['full', 'reduced', 'textonly'];
      const unexpected = Object.keys(renders).filter(k => !allowedRenders.includes(k));
      if (unexpected.length > 0) {
        issues.push({ rule: 28, ln: '--', file: schemaFile, msg: `unexpected render keys: ${unexpected.join(', ')} (allowed: full, reduced, textonly)` });
      }

      // Rule 30: Schema color enum must be canonical values from shared-enums.json
      const sharedEnums = require(path.join(__dirname, '..', 'src', 'lib', 'shared-enums.json'));
      const canonicalColorEnum = sharedEnums.colour.all;
      const colorProp = (props.visual && props.visual.color) || null;
      if (colorProp && colorProp.enum) {
        const missingColors = canonicalColorEnum.filter(c => !colorProp.enum.includes(c));
        const extraColors = colorProp.enum.filter(c => !canonicalColorEnum.includes(c));
        if (missingColors.length > 0) {
          issues.push({ rule: 30, ln: '--', file: schemaFile, msg: `schema color enum missing: ${missingColors.join(', ')}` });
        }
        if (extraColors.length > 0) {
          issues.push({ type: 'WARN', rule: 30, ln: '--', file: schemaFile, msg: `schema color enum extra: ${extraColors.join(', ')}` });
        }
      }

      // Rule 33: Animation props must be in the animation{} group
      // If it moves, it belongs in animation — pipeline strips animation group
      // for reduced/textonly renders. Props in content/visual survive all renders.
      const animKeywords = /^(anim|lottie|motion|autoplay|loop|playOn|spin|pulse|bounce|shake|float|drift|parallax|scroll.*reveal|typewriter|entrance|exit)/i;
      for (const group of ['content', 'visual']) {
        if (!props[group] || typeof props[group] !== 'object') continue;
        for (const prop of Object.keys(props[group])) {
          if (prop.startsWith('_')) continue;
          if (animKeywords.test(prop)) {
            issues.push({ rule: 33, ln: '--', file: schemaFile, msg: `"${prop}" in ${group}{} — moves, so belongs in animation{}` });
          }
        }
      }

      // Rule 35: String props in visual/animation MUST have enum
      // Content group is exempt — text, slugs, URLs are genuinely freeform
      // JSON sends enums. No freeform strings in visual/animation.
      // Exempt: slug-type props (asset references like lottieIcon, maskShape)
      const slugProps = /^(class|style|lottieIcon|icon|image|maskIcon|maskShape|morphTo|iconMorphTo)$/;
      for (const group of ['visual', 'animation']) {
        if (!props[group] || typeof props[group] !== 'object') continue;
        for (const [prop, def] of Object.entries(props[group])) {
          if (prop.startsWith('_')) continue;
          if (typeof def !== 'object' || def === null) continue;
          if (def.type === 'string' && !def.enum && !slugProps.test(prop)) {
            issues.push({ rule: 35, ln: '--', file: schemaFile, msg: `"${prop}" in ${group}{} is string without enum — add enum or change type` });
          }
        }
      }

      // Rule 36: class/style props in schema — Astro composition only, not JSON content
      // JSON authors use enums. class/style are developer escape hatches.
      const astroOnlyProps = ['class', 'style'];
      for (const [group, groupProps] of Object.entries(props)) {
        if (typeof groupProps !== 'object' || groupProps === null) continue;
        for (const prop of Object.keys(groupProps)) {
          if (astroOnlyProps.includes(prop)) {
            issues.push({ rule: 36, ln: '--', file: schemaFile, msg: `"${prop}" in ${group}{} — Astro composition prop, remove from schema` });
          }
        }
      }

      // Rule 38: gradientType/gradientFocus only for large elements (Card, Section)
      // Atoms use linear direction + spread only — radial needs surface area.
      const largeComponents = ['Card', 'Section', 'Page', 'Image'];
      if (!largeComponents.includes(atom) && props.gradient) {
        for (const prop of ['gradientType', 'gradientFocus']) {
          if (props.gradient[prop]) {
            issues.push({ rule: 38, ln: '--', file: schemaFile, msg: `"${prop}" in gradient{} — radial only for large elements (Card, Section), not atoms` });
          }
        }
      }

      // Rule 39: slots/class/style at schema root — these don't belong in schemas
      const bannedRootKeys = ['slots', 'class', 'style'];
      for (const key of bannedRootKeys) {
        if (schema[key]) {
          issues.push({ rule: 39, ln: '--', file: schemaFile, msg: `"${key}" in schema root — Renderer handles slots, class/style are Astro-only` });
        }
      }

    } catch (e) {
      issues.push({ rule: 25, ln: '--', file: schemaFile, msg: `JSON parse error: ${e.message}` });
    }
  } else if (atom !== 'FigCaption') {
    issues.push({ rule: 13, ln: '--', file: '--', msg: 'missing schema.json' });
  }

  // ─── RULE 15: Colour enum count ───
  const colourEnums = ['primary', 'secondary', 'neutral', 'red', 'orange', 'yellow', 'teal', 'blue', 'purple', 'pink'];
  const allCss = cssFiles.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  const found = colourEnums.filter(c => new RegExp(`\\.\\w[\\w-]*--${c}\\b`).test(allCss));
  if (found.length > 0 && found.length < 10) {
    const missingColours = colourEnums.filter(c => !found.includes(c));
    issues.push({ type: 'WARN', rule: 15, ln: '--', file: cssFiles[0], msg: `${found.length}/10 colour enums (missing: ${missingColours.join(', ')})` });
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
