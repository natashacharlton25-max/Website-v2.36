#!/usr/bin/env node

/**
 * Component Architecture Audit Script
 * 
 * Scans the entire component codebase and produces a factual inventory report.
 * No interpretation, no fixes — just facts.
 * 
 * Usage: node audit-inventory.mjs /path/to/src/components > audit-report.md
 * 
 * Also scans:
 *   - /path/to/src/styles (for global CSS, zone definitions)
 *   - Sibling recovered a11y files if present
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, extname, basename } from 'path';

// ─── CONFIG ───────────────────────────────────────────────

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
  'a11y.reduce-motion',
  'a11y.text-only',
  'a11y.high-contrast',
  'a11y.highlight-links',
  'a11y.focus',
  'a11y.themes',
  'a11y',
  'components',
];

const JS_ANIMATION_LIBS = [
  'gsap', 'matter', 'lottie', 'particle-burst', 'scroll-reveal',
  'lib/animation/', 'animation/',
];

const JS_ANIMATION_EVENTS = [
  'mouseenter', 'mousemove', 'mouseleave', 'scroll',
];

const JS_ANIMATION_DATA_ATTRS = [
  'data-particle-burst', 'data-scroll-bg', 'data-pattern-magnetic',
  'data-scroll-reveal', 'data-animate', 'data-confetti',
  'data-mag-bound', 'data-spot-bound', 'data-lottie-icon',
  'data-btn-lottie-bound', 'data-confetti-bound',
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
  } catch (e) {
    // skip unreadable dirs
  }
  return results;
}

async function readSafe(path) {
  try {
    return await readFile(path, 'utf-8');
  } catch {
    return null;
  }
}

function countPattern(content, pattern) {
  const regex = typeof pattern === 'string' ? new RegExp(escapeRegex(pattern), 'gi') : pattern;
  return (content.match(regex) || []).length;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

function scanFileStructure(files, componentDir) {
  const rel = f => relative(componentDir, f);
  return {
    hasAstro: files.some(f => f.endsWith('.astro')),
    hasCss: files.some(f => f.endsWith('.css') && !f.includes('.a11y.') && !f.includes('.responsive.') && !f.includes('_a11y.') && !f.includes('_responsive.')),
    hasResponsiveCss: files.some(f => f.includes('.responsive.css') || f.includes('_responsive.css')),
    hasA11yCss: files.some(f => f.includes('.a11y.css') || f.includes('_a11y.css')),
    hasSchema: files.some(f => f.endsWith('.schema.json') || f.endsWith('_schema.json')),
    hasIndex: files.some(f => basename(f) === 'index.ts' || basename(f) === 'index.js'),
    files: files.map(rel),
  };
}

function scanScopedStyles(astroContent) {
  const hasStyleTag = /<style[\s>]/i.test(astroContent);
  const hasScopedCss = hasStyleTag && !/<style\s+is:global/i.test(astroContent);
  return { hasStyleTag, hasScopedCss };
}

function scanCssMotion(cssContent) {
  // Only check base selectors (not behind modifier classes like .btn--hover-lift)
  const lines = cssContent.split('\n');
  const ambientTransitions = [];
  const ambientAnimations = [];
  const ambientTransforms = [];

  let inBaseSelector = false;
  let currentSelector = '';
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track selector
    if (braceDepth === 1 && trimmed && !trimmed.startsWith('/*') && !trimmed.startsWith('*') && !trimmed.startsWith('}')) {
      if (trimmed.includes('{')) {
        currentSelector = trimmed.split('{')[0].trim();
        // Base selector = no -- modifier in the class
        inBaseSelector = !currentSelector.includes('--');
      }
    }

    // Track braces
    braceDepth += (line.match(/{/g) || []).length;
    braceDepth -= (line.match(/}/g) || []).length;

    if (inBaseSelector) {
      if (/^\s*transition\s*:/i.test(line)) {
        ambientTransitions.push({ line: i + 1, selector: currentSelector, text: trimmed });
      }
      if (/^\s*animation\s*:/i.test(line) || /^\s*animation-name\s*:/i.test(line)) {
        ambientAnimations.push({ line: i + 1, selector: currentSelector, text: trimmed });
      }
      // transform in :hover or :active on base selector
      if (/^\s*transform\s*:/i.test(line) && /:(hover|active)/i.test(currentSelector)) {
        ambientTransforms.push({ line: i + 1, selector: currentSelector, text: trimmed });
      }
    }
  }

  return { ambientTransitions, ambientAnimations, ambientTransforms };
}

function scanA11yPatterns(content, filename) {
  return {
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
  };
}

function scanAstroWrappers(astroContent) {
  return {
    jsWrapperRefs: countPattern(astroContent, '#a11y-content-wrapper'),
    globalSelectors: countPattern(astroContent, ':global('),
    classListContains: findLines(astroContent, /classList\.contains\(['"]a11y-/),
    documentQuerySelector: findLines(astroContent, /document\.querySelector.*a11y/i),
  };
}

function scanAtomImports(astroContent, filename) {
  const imports = {};
  for (const atom of KNOWN_ATOMS) {
    const regex = new RegExp(`import\\s+${atom}\\s+from`, 'i');
    if (regex.test(astroContent)) {
      imports[atom] = true;
    }
  }
  return imports;
}

function scanMissingAtoms(astroContent, filename) {
  const bn = basename(filename);
  const missing = [];
  for (const pattern of RAW_HTML_PATTERNS) {
    if (pattern.exclude.includes(bn)) continue;
    // Only check the template section (after the --- frontmatter close)
    const parts = astroContent.split('---');
    const template = parts.length >= 3 ? parts.slice(2).join('---') : astroContent;
    const count = countPattern(template, pattern.tag);
    if (count > 0) {
      missing.push({ tag: pattern.tag, shouldBe: pattern.shouldBe, count });
    }
  }
  return missing;
}

function scanJsAnimation(astroContent) {
  const scriptMatch = astroContent.match(/<script[\s\S]*?<\/script>/gi) || [];
  const hasScript = scriptMatch.length > 0;
  const scriptContent = scriptMatch.join('\n');

  const libImports = JS_ANIMATION_LIBS.filter(lib => scriptContent.toLowerCase().includes(lib));
  const eventListeners = JS_ANIMATION_EVENTS.filter(evt => scriptContent.includes(evt));
  const dataAttrs = JS_ANIMATION_DATA_ATTRS.filter(attr => astroContent.includes(attr));

  return {
    hasScript,
    scriptCount: scriptMatch.length,
    libImports,
    eventListeners,
    dataAttrs,
  };
}

function scanPropPassthrough(astroContent, atomImports) {
  // Look for animation-related props being passed to child atoms
  const passthroughs = [];
  const animProps = [
    'morphTo', 'morphColor', 'draw', 'drawColor',
    'lottieIcon', 'lottieLoop', 'loop',
    'confetti', 'magnetic', 'spotlight',
    'effect', 'speed', 'hover',
  ];

  for (const prop of animProps) {
    // Check for prop being passed in template: prop={value} or prop="value"
    const regex = new RegExp(`\\b${prop}\\s*[={]`, 'g');
    const parts = astroContent.split('---');
    const template = parts.length >= 3 ? parts.slice(2).join('---') : '';
    if (regex.test(template)) {
      passthroughs.push(prop);
    }
  }

  return passthroughs;
}

function scanZoneDefinitions(cssContent) {
  return {
    themeLuminanceSet: findLines(cssContent, '--theme-luminance'),
    themeLuminanceRead: findLines(cssContent, /var\(--theme-luminance/),
    zoneMixHueSet: findLines(cssContent, '--zone-mix-hue'),
    zoneMixHueRead: findLines(cssContent, /var\(--zone-mix-hue/),
    zoneCustomProps: findLines(cssContent, /--zone-/),
    themeCustomProps: findLines(cssContent, /--theme-/),
  };
}

function scanSchemaStructure(schemaContent) {
  try {
    const schema = JSON.parse(schemaContent);
    return {
      hasRenders: !!schema.renders,
      rendersKeys: schema.renders ? Object.keys(schema.renders) : [],
      hasContentGroup: !!schema.content,
      hasVisualGroup: !!schema.visual,
      hasAnimationGroup: !!schema.animation,
      hasFlatProps: !!schema.props,
      propCount: schema.props ? Object.keys(schema.props).length : 0,
      category: schema.category || 'unknown',
    };
  } catch {
    return { parseError: true };
  }
}

function scanIndexImports(indexContent) {
  return {
    importsA11yCss: /a11y\.css/.test(indexContent),
    importsCss: /\.css/.test(indexContent) && !/a11y\.css/.test(indexContent),
    importsResponsiveCss: /responsive\.css/.test(indexContent),
    exportsSchema: /schema/.test(indexContent),
  };
}

// ─── COMPONENT DIRECTORY SCANNER ──────────────────────────

async function auditComponent(dirPath) {
  const allFiles = await walk(dirPath);
  const dirName = basename(dirPath);

  const report = {
    name: dirName,
    path: dirPath,
  };

  // 1. File structure
  report.structure = scanFileStructure(allFiles, dirPath);

  // 2. Astro file analysis
  const astroFiles = allFiles.filter(f => f.endsWith('.astro'));
  report.astro = [];
  for (const f of astroFiles) {
    const content = await readSafe(f);
    if (!content) continue;
    const entry = {
      file: basename(f),
      scopedStyles: scanScopedStyles(content),
      wrappers: scanAstroWrappers(content),
      atomImports: scanAtomImports(content, f),
      missingAtoms: scanMissingAtoms(content, f),
      jsAnimation: scanJsAnimation(content),
      propPassthrough: scanPropPassthrough(content, scanAtomImports(content, f)),
    };
    report.astro.push(entry);
  }

  // 3. CSS file analysis
  const cssFiles = allFiles.filter(f => f.endsWith('.css'));
  report.css = [];
  for (const f of cssFiles) {
    const content = await readSafe(f);
    if (!content) continue;
    const entry = {
      file: basename(f),
      isA11y: basename(f).includes('a11y'),
      isResponsive: basename(f).includes('responsive'),
      a11yPatterns: scanA11yPatterns(content, f),
      motion: scanCssMotion(content),
      zones: scanZoneDefinitions(content),
      lineCount: content.split('\n').length,
    };
    report.css.push(entry);
  }

  // 4. Schema analysis
  const schemaFiles = allFiles.filter(f => f.endsWith('.json') && (f.includes('schema') || f.includes('Schema')));
  report.schemas = [];
  for (const f of schemaFiles) {
    const content = await readSafe(f);
    if (!content) continue;
    report.schemas.push({
      file: basename(f),
      ...scanSchemaStructure(content),
    });
  }

  // 5. Index analysis
  const indexFiles = allFiles.filter(f => basename(f) === 'index.ts' || basename(f) === 'index.js');
  report.index = [];
  for (const f of indexFiles) {
    const content = await readSafe(f);
    if (!content) continue;
    report.index.push({
      file: basename(f),
      ...scanIndexImports(content),
    });
  }

  return report;
}

// ─── GLOBAL STYLES SCANNER ───────────────────────────────

async function auditGlobalStyles(stylesDir) {
  const allFiles = await walk(stylesDir);
  const cssFiles = allFiles.filter(f => f.endsWith('.css'));

  const report = { files: [] };
  for (const f of cssFiles) {
    const content = await readSafe(f);
    if (!content) continue;
    report.files.push({
      file: relative(stylesDir, f),
      a11yPatterns: scanA11yPatterns(content, f),
      zones: scanZoneDefinitions(content),
      lineCount: content.split('\n').length,
    });
  }
  return report;
}

// ─── REPORT GENERATOR ────────────────────────────────────

function generateReport(components, globalStyles) {
  const lines = [];
  const ln = (text = '') => lines.push(text);

  ln('# Component Architecture Audit Report');
  ln();
  ln(`Generated: ${new Date().toISOString()}`);
  ln(`Components scanned: ${components.length}`);
  ln();

  // ── SUMMARY ──
  ln('## Summary');
  ln();

  const withA11yCss = components.filter(c => c.structure.hasA11yCss);
  const withScopedStyles = components.filter(c => c.astro.some(a => a.scopedStyles.hasScopedCss));
  const withWrapperRefs = components.filter(c =>
    c.css.some(css => css.a11yPatterns.wrapperRefs > 0) ||
    c.astro.some(a => a.wrappers.jsWrapperRefs > 0)
  );
  const withImportant = components.filter(c => c.css.some(css => css.a11yPatterns.importantCount > 0));
  const withAmbientTransitions = components.filter(c => c.css.some(css => css.motion.ambientTransitions.length > 0));
  const withSchema = components.filter(c => c.structure.hasSchema);
  const withFlatProps = components.filter(c => c.schemas.some(s => s.hasFlatProps));
  const withSplitSchema = components.filter(c => c.schemas.some(s => s.hasContentGroup));
  const withJsAnimation = components.filter(c => c.astro.some(a => a.jsAnimation.hasScript));
  const withMissingAtoms = components.filter(c => c.astro.some(a => a.missingAtoms.length > 0));
  const noIndex = components.filter(c => !c.structure.hasIndex);
  const noSchema = components.filter(c => !c.structure.hasSchema);
  const noCss = components.filter(c => !c.structure.hasCss);
  const noResponsive = components.filter(c => !c.structure.hasResponsiveCss);

  ln(`| Metric | Count |`);
  ln(`|---|---|`);
  ln(`| Total components | ${components.length} |`);
  ln(`| Have a11y.css file | ${withA11yCss.length} |`);
  ln(`| Have scoped styles in .astro | ${withScopedStyles.length} |`);
  ln(`| Have #a11y-content-wrapper refs | ${withWrapperRefs.length} |`);
  ln(`| Have !important declarations | ${withImportant.length} |`);
  ln(`| Have ambient transitions in base CSS | ${withAmbientTransitions.length} |`);
  ln(`| Have schema.json | ${withSchema.length} |`);
  ln(`| Schema has flat props (needs splitting) | ${withFlatProps.length} |`);
  ln(`| Schema has content/visual/animation split | ${withSplitSchema.length} |`);
  ln(`| Have JS animation (script tags) | ${withJsAnimation.length} |`);
  ln(`| Use raw HTML instead of atoms | ${withMissingAtoms.length} |`);
  ln(`| Missing index.ts | ${noIndex.length} |`);
  ln(`| Missing schema.json | ${noSchema.length} |`);
  ln(`| Missing separated CSS | ${noCss.length} |`);
  ln(`| Missing responsive CSS | ${noResponsive.length} |`);
  ln();

  // ── LAYER USAGE ──
  ln('## @layer Usage Across All Files');
  ln();
  const layerMap = {};
  for (const c of components) {
    for (const css of c.css) {
      for (const layer of css.a11yPatterns.layers) {
        if (!layerMap[layer]) layerMap[layer] = [];
        layerMap[layer].push(`${c.name}/${css.file}`);
      }
    }
  }
  ln('| Layer | Files |');
  ln('|---|---|');
  for (const [layer, files] of Object.entries(layerMap)) {
    ln(`| \`@layer ${layer}\` | ${files.length}: ${files.join(', ')} |`);
  }
  ln();

  // ── DEAD CODE HOTSPOTS ──
  ln('## Dead Code Hotspots');
  ln();
  ln('| Component | Wrapper Refs | !important | Dead Layers |');
  ln('|---|---|---|---|');
  for (const c of withWrapperRefs.concat(withImportant).filter((v, i, a) => a.indexOf(v) === i)) {
    const wrapperTotal = c.css.reduce((sum, css) => sum + css.a11yPatterns.wrapperRefs, 0)
      + c.astro.reduce((sum, a) => sum + a.wrappers.jsWrapperRefs, 0);
    const importantTotal = c.css.reduce((sum, css) => sum + css.a11yPatterns.importantCount, 0);
    const layers = [...new Set(c.css.flatMap(css => css.a11yPatterns.layers))];
    if (wrapperTotal > 0 || importantTotal > 0) {
      ln(`| ${c.name} | ${wrapperTotal} | ${importantTotal} | ${layers.join(', ')} |`);
    }
  }
  ln();

  // ── AMBIENT MOTION ──
  ln('## Ambient Motion in Base CSS (Phase 6 Targets)');
  ln();
  for (const c of withAmbientTransitions) {
    for (const css of c.css) {
      if (css.motion.ambientTransitions.length > 0 || css.motion.ambientAnimations.length > 0 || css.motion.ambientTransforms.length > 0) {
        ln(`### ${c.name}/${css.file}`);
        ln();
        for (const t of css.motion.ambientTransitions) {
          ln(`- Line ${t.line}: \`${t.selector}\` → \`${t.text}\``);
        }
        for (const t of css.motion.ambientAnimations) {
          ln(`- Line ${t.line}: \`${t.selector}\` → \`${t.text}\``);
        }
        for (const t of css.motion.ambientTransforms) {
          ln(`- Line ${t.line}: \`${t.selector}\` → \`${t.text}\``);
        }
        ln();
      }
    }
  }

  // ── COMPONENT DEPENDENCY TREE ──
  ln('## Component Dependency Tree (Atom Imports)');
  ln();
  ln('| Component | Imports Atoms | Missing Atoms (raw HTML) |');
  ln('|---|---|---|');
  for (const c of components) {
    for (const a of c.astro) {
      const imports = Object.keys(a.atomImports).join(', ') || 'none';
      const missing = a.missingAtoms.map(m => `${m.tag.trim()} → ${m.shouldBe} (×${m.count})`).join(', ') || 'clean';
      ln(`| ${c.name}/${a.file} | ${imports} | ${missing} |`);
    }
  }
  ln();

  // ── JS ANIMATION MAP ──
  ln('## JS Animation Map');
  ln();
  ln('| Component | Scripts | Lib Imports | Events | Data Attrs | Passthroughs |');
  ln('|---|---|---|---|---|---|');
  for (const c of components) {
    for (const a of c.astro) {
      if (a.jsAnimation.hasScript || a.jsAnimation.dataAttrs.length > 0 || a.propPassthrough.length > 0) {
        ln(`| ${c.name}/${a.file} | ${a.jsAnimation.scriptCount} | ${a.jsAnimation.libImports.join(', ') || '-'} | ${a.jsAnimation.eventListeners.join(', ') || '-'} | ${a.jsAnimation.dataAttrs.join(', ') || '-'} | ${a.propPassthrough.join(', ') || '-'} |`);
      }
    }
  }
  ln();

  // ── SCHEMA STATUS ──
  ln('## Schema Status');
  ln();
  ln('| Component | Has Schema | Flat Props | Content/Visual/Animation Split | Prop Count | Category |');
  ln('|---|---|---|---|---|---|');
  for (const c of components) {
    if (c.schemas.length > 0) {
      for (const s of c.schemas) {
        ln(`| ${c.name} | yes | ${s.hasFlatProps ? 'YES (needs split)' : 'no'} | ${s.hasContentGroup ? 'YES' : 'no'} | ${s.propCount || '-'} | ${s.category} |`);
      }
    } else {
      ln(`| ${c.name} | NO | - | - | - | - |`);
    }
  }
  ln();

  // ── ZONE DEFINITIONS ──
  ln('## Zone Token Definitions');
  ln();
  let hasZoneData = false;
  for (const c of components) {
    for (const css of c.css) {
      const z = css.zones;
      const hasAny = z.themeLuminanceSet.length + z.themeLuminanceRead.length + z.zoneMixHueSet.length + z.zoneCustomProps.length + z.themeCustomProps.length;
      if (hasAny > 0) {
        hasZoneData = true;
        ln(`### ${c.name}/${css.file}`);
        if (z.themeLuminanceSet.length) ln(`- Sets --theme-luminance: ${z.themeLuminanceSet.map(l => `line ${l.line}`).join(', ')}`);
        if (z.themeLuminanceRead.length) ln(`- Reads --theme-luminance: ${z.themeLuminanceRead.map(l => `line ${l.line}`).join(', ')}`);
        if (z.zoneMixHueSet.length) ln(`- Sets --zone-mix-hue: ${z.zoneMixHueSet.map(l => `line ${l.line}`).join(', ')}`);
        if (z.zoneCustomProps.length) ln(`- Zone custom props: ${z.zoneCustomProps.length} refs`);
        if (z.themeCustomProps.length) ln(`- Theme custom props: ${z.themeCustomProps.length} refs`);
        ln();
      }
    }
  }
  if (!hasZoneData) {
    ln('No zone token definitions found in component CSS files.');
    ln();
  }

  // ── GLOBAL STYLES ──
  if (globalStyles) {
    ln('## Global Styles');
    ln();
    for (const f of globalStyles.files) {
      const z = f.zones;
      const a = f.a11yPatterns;
      const hasAny = a.wrapperRefs + a.importantCount + z.themeLuminanceSet.length + z.themeLuminanceRead.length;
      if (hasAny > 0) {
        ln(`### ${f.file} (${f.lineCount} lines)`);
        if (a.wrapperRefs) ln(`- #a11y-content-wrapper refs: ${a.wrapperRefs}`);
        if (a.importantCount) ln(`- !important: ${a.importantCount}`);
        if (a.layers.length) ln(`- Layers: ${a.layers.join(', ')}`);
        if (z.themeLuminanceSet.length) ln(`- Sets --theme-luminance: ${z.themeLuminanceSet.length} places`);
        if (z.themeLuminanceRead.length) ln(`- Reads --theme-luminance: ${z.themeLuminanceRead.length} places`);
        ln();
      }
    }
  }

  // ── SCOPED STYLES (NOT SEPARATED) ──
  ln('## Components With Scoped Styles (Need Atomic Audit)');
  ln();
  for (const c of withScopedStyles) {
    const astroWithScoped = c.astro.filter(a => a.scopedStyles.hasScopedCss);
    ln(`- ${c.name}: ${astroWithScoped.map(a => a.file).join(', ')}`);
  }
  ln();

  // ── PER-COMPONENT DETAIL ──
  ln('## Per-Component Detail');
  ln();
  for (const c of components) {
    ln(`### ${c.name}`);
    ln();
    ln(`Files: ${c.structure.files.join(', ')}`);
    ln();

    // File structure flags
    const flags = [];
    if (!c.structure.hasCss) flags.push('MISSING: separated CSS');
    if (!c.structure.hasResponsiveCss) flags.push('MISSING: responsive CSS');
    if (!c.structure.hasSchema) flags.push('MISSING: schema');
    if (!c.structure.hasIndex) flags.push('MISSING: index.ts');
    if (c.structure.hasA11yCss) flags.push('HAS: a11y.css (needs processing)');
    if (c.astro.some(a => a.scopedStyles.hasScopedCss)) flags.push('HAS: scoped styles in .astro (needs separating)');
    if (c.schemas.some(s => s.hasFlatProps)) flags.push('SCHEMA: flat props (needs content/visual/animation split)');
    if (c.astro.some(a => a.missingAtoms.length > 0)) flags.push('ATOMS: uses raw HTML instead of atoms');
    if (c.css.some(css => css.motion.ambientTransitions.length > 0)) flags.push('MOTION: ambient transitions in base CSS');
    if (c.astro.some(a => a.jsAnimation.hasScript)) flags.push('JS: has script animation');
    if (c.css.some(css => css.a11yPatterns.wrapperRefs > 0)) flags.push('DEAD: #a11y-content-wrapper in CSS');
    if (c.astro.some(a => a.wrappers.jsWrapperRefs > 0)) flags.push('DEAD: #a11y-content-wrapper in JS');

    if (flags.length > 0) {
      for (const f of flags) ln(`- ${f}`);
    } else {
      ln('- Clean');
    }
    ln();
  }

  return lines.join('\n');
}

// ─── MAIN ─────────────────────────────────────────────────

async function main() {
  const componentsDir = process.argv[2];
  if (!componentsDir) {
    console.error('Usage: node audit-inventory.mjs /path/to/src/components [/path/to/src/styles]');
    process.exit(1);
  }

  const stylesDir = process.argv[3] || null;

  // Find all component directories (directories containing .astro files)
  const allFiles = await walk(componentsDir);
  const astroDirs = new Set();
  for (const f of allFiles) {
    if (f.endsWith('.astro')) {
      astroDirs.add(join(f, '..'));
    }
  }

  // Also include directories with .css + .schema.json but no .astro
  for (const f of allFiles) {
    if (f.endsWith('.schema.json')) {
      astroDirs.add(join(f, '..'));
    }
  }

  console.error(`Found ${astroDirs.size} component directories`);

  const components = [];
  for (const dir of [...astroDirs].sort()) {
    const dirFiles = allFiles.filter(f => f.startsWith(dir + '/') || f.startsWith(dir + '\\'));
    // Only include files directly in this directory (not subdirs)
    const directFiles = dirFiles.filter(f => {
      const rel = relative(dir, f);
      return !rel.includes('/') && !rel.includes('\\');
    });
    if (directFiles.length > 0) {
      components.push(await auditComponent(dir));
    }
  }

  let globalStyles = null;
  if (stylesDir) {
    globalStyles = await auditGlobalStyles(stylesDir);
  }

  const report = generateReport(components, globalStyles);
  console.log(report);
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
