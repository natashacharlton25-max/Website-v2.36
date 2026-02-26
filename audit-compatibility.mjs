#!/usr/bin/env node

/**
 * Component Compatibility Audit
 * 
 * Checks new or incoming components against the render architecture
 * engineering contract. Run this before merging anything into the system.
 * 
 * Usage: node audit-compatibility.mjs /path/to/component-dir
 *        node audit-compatibility.mjs /path/to/repo/with/many/components
 * 
 * Outputs a pass/fail report per component, per rule.
 * Exit code 0 = all pass, 1 = failures found.
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, basename, extname } from 'path';

// ─── RULES ────────────────────────────────────────────────
// Each rule has:
//   id:       short identifier
//   name:     human description
//   severity: FAIL (blocks merge) or WARN (needs review)
//   check:    function(componentData) => { pass, details }

const RULES = [

  // ── FILE STRUCTURE ──

  {
    id: 'separated-css',
    name: 'CSS is in its own file, not scoped inside .astro',
    severity: 'FAIL',
    check: (c) => {
      const hasScopedStyles = c.astroFiles.some(a => a.hasScopedStyles);
      const hasSeparateCss = c.cssFiles.length > 0;
      if (hasScopedStyles && !hasSeparateCss) {
        return { pass: false, details: 'CSS is scoped inside .astro — needs separating into Component.css' };
      }
      if (hasScopedStyles && hasSeparateCss) {
        return { pass: false, details: 'Has both scoped styles in .astro AND separate CSS — scoped styles need removing' };
      }
      if (!hasSeparateCss) {
        return { pass: false, details: 'No CSS file found — component needs Component.css' };
      }
      return { pass: true };
    },
  },

  {
    id: 'has-schema',
    name: 'Schema file exists',
    severity: 'FAIL',
    check: (c) => {
      if (c.schemaFiles.length === 0) {
        return { pass: false, details: 'No .schema.json found — component needs a schema' };
      }
      return { pass: true };
    },
  },

  {
    id: 'has-index',
    name: 'Index file exists for exports',
    severity: 'WARN',
    check: (c) => {
      if (!c.hasIndex) {
        return { pass: false, details: 'No index.ts — component should export via index' };
      }
      return { pass: true };
    },
  },

  // ── SCHEMA STRUCTURE ──

  {
    id: 'schema-split',
    name: 'Schema has content/visual/animation groups (not flat props)',
    severity: 'FAIL',
    check: (c) => {
      for (const s of c.schemas) {
        if (s.parseError) {
          return { pass: false, details: 'Schema JSON parse error' };
        }
        if (s.hasFlatProps && !s.hasContentGroup) {
          return { pass: false, details: 'Schema has flat props — needs splitting into content/visual/animation groups' };
        }
        if (!s.hasContentGroup) {
          return { pass: false, details: 'Schema missing content group' };
        }
      }
      if (c.schemas.length === 0) return { pass: true, details: 'No schema to check (covered by has-schema rule)' };
      return { pass: true };
    },
  },

  {
    id: 'schema-renders',
    name: 'Schema declares renders field (full/reduced/textonly)',
    severity: 'FAIL',
    check: (c) => {
      for (const s of c.schemas) {
        if (s.parseError) continue;
        if (!s.hasRenders) {
          return { pass: false, details: 'Schema missing renders field — must declare full/reduced/textonly behaviour' };
        }
        const keys = s.rendersKeys;
        if (!keys.includes('full')) return { pass: false, details: 'Schema renders missing "full"' };
        if (!keys.includes('reduced')) return { pass: false, details: 'Schema renders missing "reduced"' };
        if (!keys.includes('textonly')) return { pass: false, details: 'Schema renders missing "textonly"' };
      }
      return { pass: true };
    },
  },

  // ── NO AMBIENT MOTION ──

  {
    id: 'no-ambient-transitions',
    name: 'No transition in base CSS selectors (only behind modifier classes)',
    severity: 'FAIL',
    check: (c) => {
      const violations = [];
      for (const css of c.cssAnalysis) {
        for (const t of css.ambientTransitions) {
          violations.push(`${css.file} line ${t.line}: ${t.selector} → ${t.text}`);
        }
      }
      if (violations.length > 0) {
        return { pass: false, details: `Ambient transitions found:\n    ${violations.join('\n    ')}` };
      }
      return { pass: true };
    },
  },

  {
    id: 'no-ambient-animations',
    name: 'No animation/animation-name in base CSS selectors',
    severity: 'FAIL',
    check: (c) => {
      const violations = [];
      for (const css of c.cssAnalysis) {
        for (const t of css.ambientAnimations) {
          violations.push(`${css.file} line ${t.line}: ${t.selector} → ${t.text}`);
        }
      }
      if (violations.length > 0) {
        return { pass: false, details: `Ambient animations found:\n    ${violations.join('\n    ')}` };
      }
      return { pass: true };
    },
  },

  // ── NO DEAD PATTERNS ──

  {
    id: 'no-wrapper-refs',
    name: 'No #a11y-content-wrapper references',
    severity: 'FAIL',
    check: (c) => {
      const cssRefs = c.cssAnalysis.reduce((sum, css) => sum + css.wrapperRefs, 0);
      const astroRefs = c.astroFiles.reduce((sum, a) => sum + a.jsWrapperRefs, 0);
      const total = cssRefs + astroRefs;
      if (total > 0) {
        return { pass: false, details: `${total} references to #a11y-content-wrapper (CSS: ${cssRefs}, JS: ${astroRefs}) — dead pattern, remove` };
      }
      return { pass: true };
    },
  },

  {
    id: 'no-important',
    name: 'No !important declarations',
    severity: 'FAIL',
    check: (c) => {
      const total = c.cssAnalysis.reduce((sum, css) => sum + css.importantCount, 0);
      if (total > 0) {
        return { pass: false, details: `${total} !important declarations found — remove all` };
      }
      return { pass: true };
    },
  },

  {
    id: 'no-layers',
    name: 'No @layer declarations',
    severity: 'FAIL',
    check: (c) => {
      const layers = [];
      for (const css of c.cssAnalysis) {
        layers.push(...css.layers);
      }
      if (layers.length > 0) {
        return { pass: false, details: `@layer declarations found: ${[...new Set(layers)].join(', ')} — remove` };
      }
      return { pass: true };
    },
  },

  {
    id: 'no-a11y-class-selectors',
    name: 'No .a11y-* class selectors in CSS',
    severity: 'FAIL',
    check: (c) => {
      const found = [];
      for (const css of c.cssAnalysis) {
        if (css.reduceMotionClass > 0) found.push('.a11y-reduce-motion');
        if (css.textOnlyClass > 0) found.push('.a11y-text-only');
        if (css.highlightLinksClass > 0) found.push('.a11y-highlight-links');
        if (css.highContrastClass > 0) found.push('.a11y-high-contrast');
        if (css.themeClasses > 0) found.push('.a11y-theme-*');
        if (css.cvdClasses > 0) found.push('.a11y-cvd-*');
        if (css.plainClass > 0) found.push('.plain');
      }
      if (found.length > 0) {
        return { pass: false, details: `Dead class selectors found: ${[...new Set(found)].join(', ')}` };
      }
      return { pass: true };
    },
  },

  {
    id: 'no-a11y-css-file',
    name: 'No separate a11y.css file (dead pattern)',
    severity: 'FAIL',
    check: (c) => {
      const a11yFiles = c.allFiles.filter(f =>
        (f.includes('a11y.css') || f.includes('_a11y.css')) &&
        !f.includes('.recovery.css')
      );
      if (a11yFiles.length > 0) {
        return { pass: false, details: `a11y CSS files found: ${a11yFiles.join(', ')} — dead pattern, extract needed rules to global CSS or component CSS then move to _reference/` };
      }
      return { pass: true };
    },
  },

  // ── COMPONENT PURITY ──

  {
    id: 'no-render-mode-detection',
    name: 'Component does not detect render mode (pure component)',
    severity: 'FAIL',
    check: (c) => {
      const violations = [];
      for (const a of c.astroFiles) {
        if (a.classListContains.length > 0) {
          violations.push(`${a.file}: classList.contains('a11y-...') — component should not know render mode`);
        }
        if (a.dataRenderCheck) {
          violations.push(`${a.file}: checks data-render attribute — component should not know render mode`);
        }
      }
      if (violations.length > 0) {
        return { pass: false, details: violations.join('\n    ') };
      }
      return { pass: true };
    },
  },

  {
    id: 'no-json-import',
    name: 'Component does not import its own JSON data',
    severity: 'FAIL',
    check: (c) => {
      for (const a of c.astroFiles) {
        if (a.importsJson) {
          return { pass: false, details: `${a.file} imports JSON directly — component should receive all data via props` };
        }
      }
      return { pass: true };
    },
  },

  // ── ATOM USAGE ──

  {
    id: 'uses-atoms',
    name: 'Uses atom components instead of raw HTML for text/links/buttons',
    severity: 'WARN',
    check: (c) => {
      const missing = [];
      for (const a of c.astroFiles) {
        for (const m of a.missingAtoms) {
          missing.push(`${a.file}: ${m.tag.trim()} → should use ${m.shouldBe} (×${m.count})`);
        }
      }
      if (missing.length > 0) {
        return { pass: false, details: `Raw HTML used instead of atoms:\n    ${missing.join('\n    ')}` };
      }
      return { pass: true };
    },
  },

  // ── TOKENS ──

  {
    id: 'no-hardcoded-colours',
    name: 'No hardcoded colour values (uses tokens)',
    severity: 'WARN',
    check: (c) => {
      const violations = [];
      for (const css of c.cssAnalysis) {
        for (const v of css.hardcodedColours) {
          violations.push(`${css.file} line ${v.line}: ${v.text}`);
        }
      }
      if (violations.length > 0) {
        return { pass: false, details: `Hardcoded colours found (should use var(--token)):\n    ${violations.slice(0, 10).join('\n    ')}${violations.length > 10 ? `\n    ...and ${violations.length - 10} more` : ''}` };
      }
      return { pass: true };
    },
  },

  // ── JS ANIMATION BINDING ──

  {
    id: 'js-binds-to-data-attrs',
    name: 'JS animation binds to data attributes (not unconditionally)',
    severity: 'WARN',
    check: (c) => {
      for (const a of c.astroFiles) {
        if (a.hasScript && a.dataAttrs.length === 0 && a.animationEventListeners.length > 0) {
          return { pass: false, details: `${a.file}: has event listeners for animation but no data-attribute binding — JS may fire unconditionally` };
        }
      }
      return { pass: true };
    },
  },

  // ── INDEX HYGIENE ──

  {
    id: 'index-no-a11y-import',
    name: 'Index does not import a11y.css',
    severity: 'FAIL',
    check: (c) => {
      if (c.indexImportsA11y) {
        return { pass: false, details: 'index.ts imports a11y.css — dead pattern, remove' };
      }
      return { pass: true };
    },
  },

  // ── MODIFIER CLASS CONVENTION ──

  {
    id: 'modifier-convention',
    name: 'Modifier classes use -- convention',
    severity: 'WARN',
    check: (c) => {
      const suspicious = [];
      for (const css of c.cssAnalysis) {
        for (const s of css.nonStandardModifiers) {
          suspicious.push(`${css.file} line ${s.line}: ${s.selector} — has transition/animation but doesn't use -- naming`);
        }
      }
      if (suspicious.length > 0) {
        return { pass: false, details: `Possible non-standard modifier classes with motion:\n    ${suspicious.join('\n    ')}` };
      }
      return { pass: true };
    },
  },

  // ── FILE HYGIENE ──

  {
    id: 'no-recovery-files',
    name: 'No recovery CSS files in component folder (should be in _reference/)',
    severity: 'WARN',
    check: (c) => {
      const recoveryFiles = c.allFiles.filter(f => f.includes('.recovery.css'));
      if (recoveryFiles.length > 0) {
        return { pass: false, details: `Recovery files found: ${recoveryFiles.join(', ')} — extract needed rules then move to _reference/` };
      }
      return { pass: true };
    },
  },

  {
    id: 'has-responsive-css',
    name: 'Component has responsive CSS file',
    severity: 'WARN',
    check: (c) => {
      const hasResponsive = c.allFiles.some(f => f.includes('responsive'));
      if (!hasResponsive) {
        return { pass: false, details: 'No responsive CSS file — create ComponentName.responsive.css (can be empty placeholder)' };
      }
      return { pass: true };
    },
  },

  // ── NO DEAD CSS PATTERNS ──

  {
    id: 'no-prefers-reduced-motion',
    name: 'No @media (prefers-reduced-motion) — motion handled by render mode',
    severity: 'FAIL',
    check: (c) => {
      const violations = [];
      for (const css of c.cssAnalysis) {
        for (const v of css.prefersReducedMotion) {
          violations.push(`${css.file} line ${v.line}: ${v.text}`);
        }
      }
      if (violations.length > 0) {
        return { pass: false, details: `@media (prefers-reduced-motion) found — dead pattern, motion is controlled by render mode stripping animation props:\n    ${violations.join('\n    ')}` };
      }
      return { pass: true };
    },
  },

  {
    id: 'no-global-selectors',
    name: 'No :global() selectors in .astro (CSS should be separated)',
    severity: 'FAIL',
    check: (c) => {
      const violations = [];
      for (const a of c.astroFiles) {
        if (a.globalSelectorCount > 0) {
          violations.push(`${a.file}: ${a.globalSelectorCount} :global() selectors — CSS should be in separate file, not scoped`);
        }
      }
      if (violations.length > 0) {
        return { pass: false, details: violations.join('\n    ') };
      }
      return { pass: true };
    },
  },

  {
    id: 'no-brand-detection',
    name: 'Component does not detect or read brand tokens in JS',
    severity: 'FAIL',
    check: (c) => {
      for (const a of c.astroFiles) {
        if (a.readsBrandInJs) {
          return { pass: false, details: `${a.file}: reads brand tokens in JS — component should receive brand via CSS custom properties, not JS detection` };
        }
      }
      return { pass: true };
    },
  },

  {
    id: 'animation-classes-conditional',
    name: 'Animation classes added conditionally based on props',
    severity: 'WARN',
    check: (c) => {
      for (const a of c.astroFiles) {
        if (a.hasHardcodedAnimationClass) {
          return { pass: false, details: `${a.file}: animation modifier class appears hardcoded — should be conditional on animation prop presence` };
        }
      }
      return { pass: true };
    },
  },
];

// ─── HELPERS ──────────────────────────────────────────────

async function walk(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        results.push(...await walk(fullPath));
      } else {
        results.push(fullPath);
      }
    }
  } catch (e) { /* skip */ }
  return results;
}

async function readSafe(path) {
  try { return await readFile(path, 'utf-8'); }
  catch { return null; }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countPattern(content, pattern) {
  const regex = typeof pattern === 'string' ? new RegExp(escapeRegex(pattern), 'gi') : pattern;
  return (content.match(regex) || []).length;
}

function findLines(content, pattern) {
  const lines = content.split('\n');
  const results = [];
  const regex = typeof pattern === 'string' ? new RegExp(escapeRegex(pattern), 'i') : pattern;
  lines.forEach((line, i) => {
    if (regex.test(line)) results.push({ line: i + 1, text: line.trim() });
  });
  return results;
}

// ─── SCANNERS ─────────────────────────────────────────────

function scanCssMotion(cssContent) {
  const lines = cssContent.split('\n');
  const ambientTransitions = [];
  const ambientAnimations = [];
  const nonStandardModifiers = [];

  let currentSelector = '';
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.includes('{') && braceDepth <= 1) {
      currentSelector = trimmed.split('{')[0].trim();
    }

    braceDepth += (line.match(/{/g) || []).length;
    braceDepth -= (line.match(/}/g) || []).length;

    const isBase = !currentSelector.includes('--');
    const hasMotion = /^\s*(transition|animation|animation-name)\s*:/i.test(line);

    if (hasMotion && isBase) {
      ambientTransitions.push({ line: i + 1, selector: currentSelector, text: trimmed });
    }

    // Check for non-standard modifiers: has motion but class name doesn't use --
    if (hasMotion && !isBase) {
      // This is fine, it's behind a modifier. But check the convention.
    }

    // Detect classes with motion that look like modifiers but don't use --
    // e.g. .card-hover vs .card--hover
    if (hasMotion && currentSelector.includes('.') && !currentSelector.includes('--') &&
        (currentSelector.includes('-hover') || currentSelector.includes('-active') ||
         currentSelector.includes('-animate') || currentSelector.includes('-motion') ||
         currentSelector.includes('-effect'))) {
      nonStandardModifiers.push({ line: i + 1, selector: currentSelector, text: trimmed });
    }
  }

  return { ambientTransitions, ambientAnimations: ambientTransitions.filter(t => /animation/i.test(t.text)), nonStandardModifiers };
}

function scanHardcodedColours(cssContent) {
  const lines = cssContent.split('\n');
  const hardcoded = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments, custom property definitions, and var() references
    if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('//')) continue;
    if (trimmed.startsWith('--')) continue; // custom property definition is fine

    // Check for hex colours, rgb/rgba, hsl/hsla that aren't inside var()
    const hasHex = /#[0-9a-fA-F]{3,8}\b/.test(trimmed);
    const hasRgb = /\brgba?\s*\(/.test(trimmed) && !/var\(/.test(trimmed);
    const hasHsl = /\bhsla?\s*\(/.test(trimmed) && !/var\(/.test(trimmed);

    // Exclude common exceptions: transparent, currentColor, inherit
    if (hasHex || hasRgb || hasHsl) {
      // Check it's a property value, not a selector or comment
      if (trimmed.includes(':') && !trimmed.startsWith('.') && !trimmed.startsWith('#') && !trimmed.startsWith('[')) {
        hardcoded.push({ line: i + 1, text: trimmed });
      }
    }
  }

  return hardcoded;
}

const KNOWN_ATOMS = ['Button', 'Link', 'Text', 'Heading', 'Icon', 'LottieIcon', 'Badge', 'FormField'];

const RAW_HTML_PATTERNS = [
  { tag: '<a ', shouldBe: 'Link', exclude: ['Link.astro'] },
  { tag: '<a>', shouldBe: 'Link', exclude: ['Link.astro'] },
  { tag: '<button', shouldBe: 'Button', exclude: ['Button.astro', 'FormField.astro'] },
  { tag: '<small', shouldBe: 'Text', exclude: ['Text.astro'] },
  { tag: '<span', shouldBe: 'Text', exclude: ['Text.astro', 'Icon.astro', 'LottieIcon.astro', 'FormField.astro'] },
  { tag: '<p>', shouldBe: 'Text', exclude: ['Text.astro'] },
  { tag: '<p ', shouldBe: 'Text', exclude: ['Text.astro'] },
  { tag: '<h1', shouldBe: 'Heading', exclude: ['Heading.astro'] },
  { tag: '<h2', shouldBe: 'Heading', exclude: ['Heading.astro'] },
  { tag: '<h3', shouldBe: 'Heading', exclude: ['Heading.astro'] },
  { tag: '<h4', shouldBe: 'Heading', exclude: ['Heading.astro'] },
  { tag: '<h5', shouldBe: 'Heading', exclude: ['Heading.astro'] },
  { tag: '<h6', shouldBe: 'Heading', exclude: ['Heading.astro'] },
];

const LAYER_NAMES = [
  'a11y.reduce-motion', 'a11y.text-only', 'a11y.high-contrast',
  'a11y.highlight-links', 'a11y.focus', 'a11y.themes', 'a11y', 'components',
];

// ─── COMPONENT ANALYSER ──────────────────────────────────

async function analyseComponent(dirPath) {
  const allFiles = await walk(dirPath);
  const dirName = basename(dirPath);
  const relFiles = allFiles.map(f => relative(dirPath, f));

  const data = {
    name: dirName,
    path: dirPath,
    allFiles: relFiles,
    astroFiles: [],
    cssFiles: [],
    cssAnalysis: [],
    schemaFiles: [],
    schemas: [],
    hasIndex: false,
    indexImportsA11y: false,
  };

  // Astro files
  for (const f of allFiles.filter(f => f.endsWith('.astro'))) {
    const content = await readSafe(f);
    if (!content) continue;

    const bn = basename(f);
    const parts = content.split('---');
    const template = parts.length >= 3 ? parts.slice(2).join('---') : content;
    const frontmatter = parts.length >= 3 ? parts[1] : '';

    const missingAtoms = [];
    for (const p of RAW_HTML_PATTERNS) {
      if (p.exclude.includes(bn)) continue;
      const count = countPattern(template, p.tag);
      if (count > 0) missingAtoms.push({ tag: p.tag, shouldBe: p.shouldBe, count });
    }

    const scriptMatch = content.match(/<script[\s\S]*?<\/script>/gi) || [];
    const scriptContent = scriptMatch.join('\n');

    data.astroFiles.push({
      file: bn,
      hasScopedStyles: /<style[\s>]/i.test(content) && !/<style\s+is:global/i.test(content),
      jsWrapperRefs: countPattern(content, '#a11y-content-wrapper'),
      classListContains: findLines(content, /classList\.contains\(['"]a11y-/),
      dataRenderCheck: /data-render/.test(scriptContent) || /dataset\.render/.test(scriptContent),
      importsJson: /import\s+.*from\s+['"].*\.json['"]/.test(frontmatter),
      missingAtoms,
      hasScript: scriptMatch.length > 0,
      dataAttrs: ['data-particle-burst', 'data-scroll-bg', 'data-pattern-magnetic',
        'data-scroll-reveal', 'data-animate', 'data-confetti',
        'data-mag-bound', 'data-spot-bound', 'data-lottie-icon',
        'data-btn-lottie-bound', 'data-confetti-bound',
      ].filter(attr => content.includes(attr)),
      animationEventListeners: ['mouseenter', 'mousemove', 'mouseleave', 'scroll']
        .filter(evt => scriptContent.includes(evt)),
      globalSelectorCount: countPattern(content, ':global('),
      readsBrandInJs: /getComputedStyle|--brand-|dataset\.brand|brand\./.test(scriptContent),
      hasHardcodedAnimationClass: (() => {
        // Check if animation modifier classes (--hover-, --animate-, --effect-) are hardcoded
        // rather than conditional on props
        const animClassPattern = /class.*--(?:hover|animate|effect|motion)-/;
        const conditionalPattern = /\?\s*['"`].*--(?:hover|animate|effect|motion)-|animation\s*[\?\.]/;
        const hasAnimClass = animClassPattern.test(template);
        const isConditional = conditionalPattern.test(template) || conditionalPattern.test(frontmatter);
        return hasAnimClass && !isConditional;
      })(),
    });
  }

  // CSS files
  for (const f of allFiles.filter(f => f.endsWith('.css'))) {
    const content = await readSafe(f);
    if (!content) continue;
    const bn = basename(f);

    if (!bn.includes('a11y') && !bn.includes('responsive')) {
      data.cssFiles.push(bn);
    }

    const motion = scanCssMotion(content);
    data.cssAnalysis.push({
      file: bn,
      ...motion,
      wrapperRefs: countPattern(content, '#a11y-content-wrapper'),
      importantCount: countPattern(content, '!important'),
      layers: LAYER_NAMES.filter(name => content.includes(`@layer ${name}`)),
      reduceMotionClass: countPattern(content, '.a11y-reduce-motion'),
      textOnlyClass: countPattern(content, '.a11y-text-only'),
      highlightLinksClass: countPattern(content, '.a11y-highlight-links'),
      highContrastClass: countPattern(content, '.a11y-high-contrast'),
      themeClasses: countPattern(content, /\.a11y-theme-[\w-]+/g),
      cvdClasses: countPattern(content, /\.a11y-cvd-[\w-]+/g),
      plainClass: countPattern(content, '.plain'),
      hardcodedColours: scanHardcodedColours(content),
      prefersReducedMotion: findLines(content, /prefers-reduced-motion/),
    });
  }

  // Schema files
  for (const f of allFiles.filter(f => f.endsWith('.json') && f.includes('schema'))) {
    const content = await readSafe(f);
    if (!content) continue;
    data.schemaFiles.push(basename(f));
    try {
      const schema = JSON.parse(content);
      data.schemas.push({
        file: basename(f),
        hasRenders: !!schema.renders,
        rendersKeys: schema.renders ? Object.keys(schema.renders) : [],
        hasContentGroup: !!schema.content,
        hasVisualGroup: !!schema.visual,
        hasAnimationGroup: !!schema.animation,
        hasFlatProps: !!schema.props,
        parseError: false,
      });
    } catch {
      data.schemas.push({ file: basename(f), parseError: true });
    }
  }

  // Index file
  for (const f of allFiles.filter(f => basename(f) === 'index.ts' || basename(f) === 'index.js')) {
    const content = await readSafe(f);
    if (!content) continue;
    data.hasIndex = true;
    data.indexImportsA11y = /a11y\.css/.test(content);
  }

  return data;
}

// ─── REPORT ──────────────────────────────────────────────

function runRules(componentData) {
  const results = [];
  for (const rule of RULES) {
    const result = rule.check(componentData);
    results.push({
      id: rule.id,
      name: rule.name,
      severity: rule.severity,
      pass: result.pass,
      details: result.details || null,
    });
  }
  return results;
}

function generateReport(components) {
  const lines = [];
  const ln = (text = '') => lines.push(text);

  ln('# Component Compatibility Audit');
  ln();
  ln(`Generated: ${new Date().toISOString()}`);
  ln(`Components checked: ${components.length}`);
  ln(`Rules applied: ${RULES.length}`);
  ln();

  // Summary
  let totalFails = 0;
  let totalWarns = 0;
  let totalPass = 0;

  const componentResults = components.map(c => {
    const results = runRules(c);
    const fails = results.filter(r => !r.pass && r.severity === 'FAIL');
    const warns = results.filter(r => !r.pass && r.severity === 'WARN');
    const passes = results.filter(r => r.pass);
    totalFails += fails.length;
    totalWarns += warns.length;
    totalPass += passes.length;
    return { component: c, results, fails, warns, passes };
  });

  ln('## Summary');
  ln();
  ln(`| Component | FAIL | WARN | PASS | Status |`);
  ln(`|---|---|---|---|---|`);
  for (const cr of componentResults) {
    const status = cr.fails.length > 0 ? '❌ NOT READY' : cr.warns.length > 0 ? '⚠️ REVIEW' : '✅ COMPATIBLE';
    ln(`| ${cr.component.name} | ${cr.fails.length} | ${cr.warns.length} | ${cr.passes.length} | ${status} |`);
  }
  ln();
  ln(`**Totals:** ${totalFails} failures, ${totalWarns} warnings, ${totalPass} passes`);
  ln();

  // Detail per component
  ln('## Detail');
  ln();
  for (const cr of componentResults) {
    ln(`### ${cr.component.name}`);
    ln();

    if (cr.fails.length === 0 && cr.warns.length === 0) {
      ln('All rules pass. Component is compatible with the render architecture.');
      ln();
      continue;
    }

    // Failures first
    for (const r of cr.fails) {
      ln(`❌ **FAIL: ${r.name}**`);
      if (r.details) ln(`  ${r.details}`);
      ln();
    }

    // Warnings
    for (const r of cr.warns) {
      ln(`⚠️ **WARN: ${r.name}**`);
      if (r.details) ln(`  ${r.details}`);
      ln();
    }

    // Passes (collapsed)
    if (cr.passes.length > 0) {
      ln(`✅ Passing: ${cr.passes.map(r => r.id).join(', ')}`);
      ln();
    }
  }

  // Rules reference
  ln('## Rules Reference');
  ln();
  ln('| ID | Severity | Rule |');
  ln('|---|---|---|');
  for (const r of RULES) {
    ln(`| ${r.id} | ${r.severity} | ${r.name} |`);
  }
  ln();

  return { report: lines.join('\n'), hasFailures: totalFails > 0 };
}

// ─── MAIN ─────────────────────────────────────────────────

async function main() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error('Usage: node audit-compatibility.mjs /path/to/component-or-repo');
    process.exit(1);
  }

  // Determine if target is a single component dir or a repo with many
  const allFiles = await walk(targetDir);
  const astroDirs = new Set();
  for (const f of allFiles) {
    if (f.endsWith('.astro')) {
      astroDirs.add(join(f, '..'));
    }
  }
  // Also catch dirs with schema but no astro
  for (const f of allFiles) {
    if (f.endsWith('.schema.json')) {
      astroDirs.add(join(f, '..'));
    }
  }

  if (astroDirs.size === 0) {
    // Maybe the target dir itself is a component
    const dirFiles = allFiles.filter(f => {
      const rel = relative(targetDir, f);
      return !rel.includes('/') && !rel.includes('\\');
    });
    if (dirFiles.some(f => f.endsWith('.astro') || f.endsWith('.schema.json'))) {
      astroDirs.add(targetDir);
    }
  }

  if (astroDirs.size === 0) {
    console.error('No component directories found (looking for .astro or .schema.json files)');
    process.exit(1);
  }

  console.error(`Found ${astroDirs.size} component(s) to audit`);

  const components = [];
  for (const dir of [...astroDirs].sort()) {
    components.push(await analyseComponent(dir));
  }

  const { report, hasFailures } = generateReport(components);
  console.log(report);

  process.exit(hasFailures ? 1 : 0);
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
