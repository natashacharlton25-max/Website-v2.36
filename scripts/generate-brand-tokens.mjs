import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const brandsDir = path.join(rootDir, 'src', 'brands');

if (!fs.existsSync(brandsDir)) {
  console.log('[Token Gen] No brands directory found.');
  process.exit(0);
}

const brandFolders = fs.readdirSync(brandsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const brandName of brandFolders) {
  const brandPath = path.join(brandsDir, brandName);
  const configPath = path.join(brandPath, 'brandconfig.json');

  if (!fs.existsSync(configPath)) continue;

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log(`[Token Gen] Processing brand: ${config.brand || brandName}`);

  const shapeToRadius = {
    round: 'var(--radius-full)',
    soft: 'var(--radius-md)',
    sharp: 'var(--radius-none, 0px)'
  };

  const textOnlyBtnRadius = shapeToRadius[config.textOnlyButton?.shape] || 'var(--radius-md)';
  const highlightBtnRadius = shapeToRadius[config.highlightLinksButton?.shape] || 'var(--radius-md)';

  const textOnlyHeadingColor = config.textOnlyHeading?.color === 'primary' ? 'var(--primary-600, var(--primary-base))' : 'var(--neutral-900)';
  const textOnlyHeadingSize = `var(--text-${config.textOnlyHeading?.size || 'h3'})`;
  const textOnlyHeadingFont = config.textOnlyHeading?.font === 'heading' ? 'var(--font-heading)' : 'var(--font-body)';

  const btnTextOnlyBg = config.textOnlyButton?.color === 'secondary' ? 'var(--secondary-600, var(--secondary-base))' : 'var(--primary-600, var(--primary-base))';
  const btnTextOnlyHoverBg = config.textOnlyButton?.color === 'secondary' ? 'var(--secondary-800, var(--secondary-emphasis))' : 'var(--primary-800, var(--primary-emphasis))';

  const btnHighlightBg = config.highlightLinksButton?.color === 'secondary' ? 'var(--secondary-600, var(--secondary-base))' : 'var(--primary-600, var(--primary-base))';
  const btnHighlightHoverBg = config.highlightLinksButton?.color === 'secondary' ? 'var(--secondary-800, var(--secondary-emphasis))' : 'var(--primary-800, var(--primary-emphasis))';

  const outlineColor = config.highlightLinksButton?.outlineColor === 'secondary' ? 'var(--secondary-600, var(--secondary-base))' : 'var(--primary-600, var(--primary-base))';
  const outlineWidth = config.highlightLinksButton?.outlineWidth || '3px';
  const outlineOffset = config.highlightLinksButton?.outlineOffset || '3px';

  const overridesCss = `/**
 * Brand Overrides ÔÇö ${config.brand || brandName}
 * Generated from brandconfig.json. Loads after any theme.
 * Identity tokens that persist across theme switches.
 */

:root {
  --heading-textonly-color: ${textOnlyHeadingColor};
  --heading-textonly-size: ${textOnlyHeadingSize};
  --heading-textonly-font: ${textOnlyHeadingFont};
  --heading-textonly-weight: var(--font-bold);
  --btn-textonly-radius: ${textOnlyBtnRadius};
  --btn-textonly-style: ${config.textOnlyButton?.style || 'fill'};
  --btn-textonly-bg: ${btnTextOnlyBg};
  --btn-textonly-text: oklch(from ${btnTextOnlyBg} round(1.21 - l) 0 0);
  --btn-textonly-border: none;
  --btn-textonly-hover-bg: ${btnTextOnlyHoverBg};
  --btn-textonly-hover-text: oklch(from ${btnTextOnlyHoverBg} round(1.21 - l) 0 0);
  --btn-highlight-radius: ${highlightBtnRadius};
  --btn-highlight-style: ${config.highlightLinksButton?.style || 'fill'};
  --btn-highlight-bg: ${btnHighlightBg};
  --btn-highlight-text: oklch(from ${btnHighlightBg} round(1.21 - l) 0 0);
  --btn-highlight-border: none;
  --btn-highlight-hover-bg: ${btnHighlightHoverBg};
  --btn-highlight-hover-text: oklch(from ${btnHighlightHoverBg} round(1.21 - l) 0 0);
  --btn-highlight-outline: ${outlineWidth} solid ${outlineColor};
  --btn-highlight-outline-offset: ${outlineOffset};
}
`;

  const overridesFilePath = path.join(brandPath, 'brand-overrides.css');
  fs.writeFileSync(overridesFilePath, overridesCss, 'utf8');
  console.log(`[Token Gen] Wrote ${overridesFilePath}`);
}

console.log('[Token Gen] Brand tokens generation complete.');
