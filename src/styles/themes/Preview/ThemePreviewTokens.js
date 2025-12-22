/**
 * ThemePreviewTokens - Dynamically renders theme cards
 *
 * Theme preview tokens are loaded from coretokens.css (generated at build time)
 * This script only handles rendering the theme cards in the accessibility panel
 */

// Automatically import all theme CSS files using Vite glob (exclude Preview folder)
const themeModules = import.meta.glob('../**/*.css', {
  query: '?url',
  import: 'default',
  eager: true
});

// Filter out Preview folder files
const filteredModules = {};
Object.entries(themeModules).forEach(([path, url]) => {
  if (!path.includes('/Preview/')) {
    filteredModules[path] = url;
  }
});

// Theme metadata - display names and descriptions
const themeMetadata = {
  'default': { title: 'Default', sample: 'Natural sage' },
  'dark': { title: 'Dark', sample: 'Low strain' },
  'cream': { title: 'Cream', sample: 'Warm paper' },
  'high-contrast': { title: 'High Contrast', sample: 'Max visibility' },
  'protanopia': { title: 'Protanopia', sample: 'Red-blind' },
  'deuteranopia': { title: 'Deuteranopia', sample: 'Green-blind' },
  'tritanopia': { title: 'Tritanopia', sample: 'Blue-blind' },
  'monochrome': { title: 'Monochrome', sample: 'Grayscale' }
};

// Logo SVG used for all theme cards
// no-theme-filter class prevents monochrome theme from grayscaling the logos
const logoSVG = `<svg class="a11y-theme-card__logo no-theme-filter" viewBox="0 0 1000 1000" aria-hidden="true">
  <path d="M114.012,713.998c-1.282,-1.391 -117.683,-107.316 -78.796,-284.574c29.523,-134.574 140.185,-193.116 158.378,-202.741c90.952,-48.115 132.086,22.901 136.941,51.81c11.971,71.281 -51.096,94.916 -57.776,98.494c-88.085,47.18 -82.736,139.435 -64.936,176.373c45.082,93.55 102.859,55.416 122.344,133.219c15.823,63.18 -61.964,178.454 -216.155,27.418Z"/>
  <path d="M882.999,283.008c156.409,160.243 99.458,416.37 -99.454,500.596c-69.267,29.33 -143.913,-46.99 -105.689,-118.908c25.763,-48.472 75.674,-31.952 113.312,-108.367c9.288,-18.857 23.146,-77.902 -7.131,-125.521c-45.722,-71.911 -96.174,-49.114 -113.699,-113.259c-10.31,-37.738 12.744,-74.738 18.551,-79.628c26.174,-22.038 76.259,-64.877 194.11,45.086Z"/>
  <path d="M573.006,594.994c2.127,2.191 54.757,45.811 33.008,115.355c-37.02,118.374 -213.692,100.863 -216.833,-33.839c-1.864,-79.948 100.309,-150.276 183.825,-81.516Z"/>
  <path d="M423.98,403.01c-7.288,-7.725 -28.469,-27.504 -33.995,-66.576c-14.673,-103.746 114.299,-167.449 187.261,-94.663c96.508,96.276 -30.121,258.014 -153.266,161.238Z"/>
</svg>`;

// Build themeFiles object from filtered glob results
const themeFiles = {};
Object.entries(filteredModules).forEach(([path, url]) => {
  // Extract theme name from path
  // Examples: '../a11y/a11y-dark.css' -> 'dark'
  //          '../brand/BrandDefault.css' -> 'default'
  const match = path.match(/(?:a11y|brand)\/(.+)\.css$/);
  if (match) {
    let themeName = match[1];
    // Special handling for BrandDefault -> 'default'
    if (themeName === 'BrandDefault') {
      themeName = 'default';
    }
    // Remove 'a11y-' prefix from a11y themes
    themeName = themeName.replace(/^a11y-/, '');
    themeFiles[themeName] = url;
  }
});

/**
 * Create a theme card button element
 * @param {string} theme - Theme identifier
 * @param {boolean} isActive - Whether this theme is currently active
 * @returns {HTMLElement} Theme card button element
 */
function createThemeCard(theme, isActive = false) {
  const metadata = themeMetadata[theme] || { title: theme, sample: 'Custom theme' };

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
 * Render theme cards into the theme list container
 */
export function renderThemeCards() {
  const container = document.querySelector('.a11y-theme-list');
  if (!container) {
    console.warn('Theme list container not found');
    return;
  }

  // Get current active theme from body class
  const currentTheme = document.body.className.match(/a11y-theme-(\w+)/)?.[1] || 'default';

  // Clear existing cards
  container.innerHTML = '';

  // Generate cards for all discovered themes
  Object.keys(themeFiles).forEach(theme => {
    const card = createThemeCard(theme, theme === currentTheme);
    container.appendChild(card);
  });

  console.log(`✅ Rendered ${Object.keys(themeFiles).length} theme cards`);
}

/**
 * Get the URL for a theme file
 * @param {string} themeName - Theme identifier
 * @returns {string|null} URL to the theme CSS file
 */
export function getThemeFileUrl(themeName) {
  return themeFiles[themeName] || null;
}

/**
 * Get all available theme names
 * @returns {string[]} Array of theme names
 */
export function getThemeNames() {
  return Object.keys(themeFiles);
}

// Auto-initialize when imported
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderThemeCards);
  } else {
    renderThemeCards();
  }
}

export default { renderThemeCards, getThemeFileUrl, getThemeNames };
