/**
 * ThemePreviewTokens - Dynamically renders theme cards
 *
 * All 112 theme variants, grouped by category (accessibility / fun).
 * Utility functions for decomposing variant names (base + luminance + CVD)
 * are exported for use by the future theme picker redesign.
 */

// Automatically import all theme CSS files using Vite glob (exclude Preview folder)
const themeModules = import.meta.glob('../**/*.css', {
  query: '?url',
  import: 'default',
  eager: true
});

// Build allThemeFiles from glob results (all 112 variants, for URL lookup)
const allThemeFiles = {};
Object.entries(themeModules).forEach(([path, url]) => {
  if (path.includes('/Preview/')) return;
  // Match: a11y/calm/calm.css, fun/ocean/ocean.css, brand/mind-the-box/BrandDefault.css
  const match = path.match(/(?:a11y|fun|brand)\/.+\/([^/]+)\.css$/);
  if (match) {
    let themeName = match[1];
    if (themeName === 'BrandDefault') themeName = 'default';
    allThemeFiles[themeName] = url;
  }
});

// Theme metadata — loaded from generated theme-names.json
import themeNames from '../../tokens/theme-names.json';

/**
 * Compose a full theme variant name from base + luminance + CVD
 * @param {string} base - Base theme name (e.g. 'forest', 'midnight')
 * @param {string|null} luminance - 'dark', 'light', or null (use theme default)
 * @param {string|null} cvd - 'protan', 'tritan', or null (no CVD)
 * @returns {string} Full variant name (e.g. 'forest-dark-protan')
 */
export function composeThemeName(base, luminance = null, cvd = null) {
  let name = base;
  if (luminance) name += `-${luminance}`;
  if (cvd) name += `-${cvd}`;
  // Verify the composed name exists, fall back to base
  if (!allThemeFiles[name]) {
    console.warn(`Theme variant "${name}" not found, falling back to "${base}"`);
    return allThemeFiles[base] ? base : 'default';
  }
  return name;
}

/**
 * Get the base theme name from a full variant name
 * @param {string} fullName - e.g. 'forest-dark-protan'
 * @returns {string} Base name, e.g. 'forest'
 */
export function getBaseFromVariant(fullName) {
  return fullName.replace(/-(dark|light)(-(protan|tritan))?$/, '').replace(/-(protan|tritan)$/, '');
}

/**
 * Get the luminance suffix from a full variant name
 * @param {string} fullName - e.g. 'forest-dark-protan'
 * @returns {string|null} 'dark', 'light', or null
 */
export function getLuminanceFromVariant(fullName) {
  const match = fullName.match(/-(dark|light)(-(protan|tritan))?$/);
  return match ? match[1] : null;
}

/**
 * Get the CVD mode from a full variant name
 * @param {string} fullName - e.g. 'forest-dark-protan'
 * @returns {string|null} 'protan', 'tritan', or null
 */
export function getCVDFromVariant(fullName) {
  const match = fullName.match(/-(protan|tritan)$/);
  return match ? match[1] : null;
}

// Name style: 'fun' (playful) or 'pro' (professional) — read from body data attribute
function getNameStyle() {
  return document.body?.dataset?.nameStyle || 'fun';
}

function resolveTitle(entry) {
  if (!entry?.title) return entry?.name || 'Theme';
  if (typeof entry.title === 'string') return entry.title;
  return entry.title[getNameStyle()] || entry.title.pro || entry.name;
}

function resolveSample(entry) {
  if (!entry?.sample) return '';
  if (typeof entry.sample === 'string') return entry.sample;
  return entry.sample[getNameStyle()] || entry.sample.pro || '';
}

// Logo SVG used for all theme cards
// no-theme-filter class prevents monochrome theme from grayscaling the logos
const logoSVG = `<svg class="a11y-theme-card__logo no-theme-filter" viewBox="0 0 1000 1000" aria-hidden="true">
  <path d="M114.012,713.998c-1.282,-1.391 -117.683,-107.316 -78.796,-284.574c29.523,-134.574 140.185,-193.116 158.378,-202.741c90.952,-48.115 132.086,22.901 136.941,51.81c11.971,71.281 -51.096,94.916 -57.776,98.494c-88.085,47.18 -82.736,139.435 -64.936,176.373c45.082,93.55 102.859,55.416 122.344,133.219c15.823,63.18 -61.964,178.454 -216.155,27.418Z"/>
  <path d="M882.999,283.008c156.409,160.243 99.458,416.37 -99.454,500.596c-69.267,29.33 -143.913,-46.99 -105.689,-118.908c25.763,-48.472 75.674,-31.952 113.312,-108.367c9.288,-18.857 23.146,-77.902 -7.131,-125.521c-45.722,-71.911 -96.174,-49.114 -113.699,-113.259c-10.31,-37.738 12.744,-74.738 18.551,-79.628c26.174,-22.038 76.259,-64.877 194.11,45.086Z"/>
  <path d="M573.006,594.994c2.127,2.191 54.757,45.811 33.008,115.355c-37.02,118.374 -213.692,100.863 -216.833,-33.839c-1.864,-79.948 100.309,-150.276 183.825,-81.516Z"/>
  <path d="M423.98,403.01c-7.288,-7.725 -28.469,-27.504 -33.995,-66.576c-14.673,-103.746 114.299,-167.449 187.261,-94.663c96.508,96.276 -30.121,258.014 -153.266,161.238Z"/>
</svg>`;

// All themes for card rendering
const allThemeNames = Object.keys(allThemeFiles);

// Group by category from theme-names.json
const themesByCategory = { accessibility: [], fun: [] };
allThemeNames.forEach(name => {
  const entry = themeNames[name];
  const category = entry?.category || 'fun';
  if (themesByCategory[category]) {
    themesByCategory[category].push(name);
  }
});

/**
 * Create a theme card button element
 */
function createThemeCard(theme, isActive = false) {
  const entry = themeNames[theme];
  const metadata = {
    title: entry ? resolveTitle(entry) : theme,
    sample: entry ? resolveSample(entry) : 'Custom theme',
  };

  const button = document.createElement('button');
  button.className = `a11y-theme-card a11y-theme-card--${theme}`;
  button.setAttribute('data-theme', theme);
  button.setAttribute('aria-pressed', isActive ? 'true' : 'false');

  button.innerHTML = `
    ${logoSVG}
    <div class="a11y-theme-card__text">
      <span class="a11y-theme-card__title">${metadata.title}</span>
      <span class="a11y-theme-card__sample">${metadata.sample}</span>
    </div>
    <div class="a11y-theme-card__swatches" aria-hidden="true">
      <span class="a11y-swatch a11y-swatch--primary"></span>
      <span class="a11y-swatch a11y-swatch--secondary"></span>
    </div>
  `;

  return button;
}

/**
 * Create a category heading element
 */
function createCategoryHeading(category) {
  const heading = document.createElement('h3');
  heading.className = 'a11y-theme-list__heading';
  heading.textContent = category === 'accessibility' ? 'Accessibility' : 'Fun Themes';
  return heading;
}

/**
 * Render theme cards into the theme list container
 * All 112 variants, grouped by category (accessibility first, then fun)
 */
export function renderThemeCards() {
  const containers = document.querySelectorAll('.a11y-theme-list');
  if (containers.length === 0) {
    console.warn('Theme list container not found');
    return;
  }

  // Get current active theme — resolve to base for card matching
  const currentFullTheme = localStorage.getItem('color-theme') || 'default';
  const currentBase = getBaseFromVariant(currentFullTheme);

  // Populate every .a11y-theme-list on the page (modal + /accessibility page)
  containers.forEach(container => {
    container.innerHTML = '';

    // Render accessibility themes first, then fun
    for (const category of ['accessibility', 'fun']) {
      const themes = themesByCategory[category];
      if (themes.length === 0) continue;

      container.appendChild(createCategoryHeading(category));

      const grid = document.createElement('div');
      grid.className = `a11y-theme-list__grid a11y-theme-list__grid--${category}`;

      themes.forEach(theme => {
        const card = createThemeCard(theme, theme === currentBase);
        grid.appendChild(card);
      });

      container.appendChild(grid);
    }
  });

  console.log(`Rendered ${allThemeNames.length} theme cards in ${containers.length} container(s)`);
}

/**
 * Get the URL for a theme file (accepts full variant names)
 * @param {string} themeName - Full theme identifier (e.g. 'forest-dark-protan')
 * @returns {string|null} URL to the theme CSS file
 */
export function getThemeFileUrl(themeName) {
  return allThemeFiles[themeName] || null;
}

/**
 * Get all available theme names (all 112 variants)
 * @returns {string[]}
 */
export function getThemeNames() {
  return Object.keys(allThemeFiles);
}

/**
 * Get base theme names only (no variant suffixes)
 * @returns {string[]}
 */
export function getBaseThemeNames() {
  return allThemeNames.filter(name =>
    !name.match(/-(dark|light|protan|tritan)(-(protan|tritan))?$/)
  );
}

/**
 * Get available variants for a base theme
 * @param {string} base - Base theme name
 * @returns {string[]} All variant names including the base itself
 */
export function getVariantsForTheme(base) {
  return Object.keys(allThemeFiles).filter(name =>
    name === base || getBaseFromVariant(name) === base
  );
}

// Auto-initialize when imported
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderThemeCards);
  } else {
    renderThemeCards();
  }
}

export default {
  renderThemeCards,
  getThemeFileUrl,
  getThemeNames,
  getBaseThemeNames,
  getVariantsForTheme,
  composeThemeName,
  getBaseFromVariant,
  getLuminanceFromVariant,
  getCVDFromVariant,
};
