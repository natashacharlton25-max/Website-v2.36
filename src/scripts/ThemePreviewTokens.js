/**
 * ThemePreviewTokens - Extracts theme colors from CSS files
 *
 * Each theme file defines the same tokens with different hex values.
 * This script fetches each CSS file and extracts the actual color values
 * for the accessibility panel theme preview cards.
 */

// Theme CSS files - paths relative to site root
const themeFiles = {
  default: '/styles/themes/brand/BrandDefault.css',
  dark: '/styles/themes/a11y/a11y-dark.css',
  cream: '/styles/themes/a11y/a11y-cream.css',
  'high-contrast': '/styles/themes/a11y/a11y-high-contrast.css',
  protanopia: '/styles/themes/a11y/a11y-protanopia.css',
  deuteranopia: '/styles/themes/a11y/a11y-deuteranopia.css',
  tritanopia: '/styles/themes/a11y/a11y-tritanopia.css',
  monochrome: '/styles/themes/a11y/a11y-monochrome.css',
};

// Tokens to extract - same for all themes
// These are the standard token names that every theme defines
const PREVIEW_TOKENS = [
  '--color-Background-50',
  '--color-Primary-500',
  '--color-Text-800',
  '--color-Secondary-500'
];

// Each theme has 4 core tokens with hex values
// Order: [bg, primary, text, accent]
const themeBaseTokens = {
  default: ['--brand-bg', '--brand-primary', '--brand-text', '--brand-accent'],
  dark: ['--a11y-dark-bg', '--a11y-dark-primary', '--a11y-dark-text', '--a11y-dark-accent'],
  cream: ['--a11y-cream-bg', '--a11y-cream-primary', '--a11y-cream-text', '--a11y-cream-accent'],
  'high-contrast': ['--a11y-hc-bg', '--a11y-hc-primary', '--a11y-hc-text', '--a11y-hc-accent'],
  protanopia: ['--a11y-proto-bg', '--a11y-proto-primary', '--a11y-proto-text', '--a11y-proto-accent'],
  deuteranopia: ['--a11y-deuter-bg', '--a11y-deuter-primary', '--a11y-deuter-text', '--a11y-deuter-accent'],
  tritanopia: ['--a11y-trit-bg', '--a11y-trit-primary', '--a11y-trit-text', '--a11y-trit-accent'],
  monochrome: ['--a11y-mono-bg', '--a11y-mono-primary', '--a11y-mono-text', '--a11y-mono-accent'],
};

/**
 * Parse CSS text to extract custom property values (hex colors only)
 * @param {string} cssText - Raw CSS text
 * @param {string[]} properties - Array of CSS custom property names to extract
 * @returns {object} Map of property name to hex value
 */
function extractTokens(cssText, properties) {
  const tokens = {};

  properties.forEach(prop => {
    // Match pattern: --prop-name: #hexvalue or rgb() etc
    const escapedProp = prop.replace(/[-]/g, '\\-');
    const regex = new RegExp(`${escapedProp}\\s*:\\s*([^;]+);`, 'i');
    const match = cssText.match(regex);

    if (match) {
      const value = match[1].trim();
      // Only keep actual color values, not var() references
      if (!value.startsWith('var(')) {
        tokens[prop] = value;
      }
    }
  });

  return tokens;
}

/**
 * Fetch a CSS file and extract tokens
 * @param {string} url - URL to the CSS file
 * @param {string[]} properties - Properties to extract
 * @returns {Promise<object>} Extracted tokens
 */
async function fetchAndExtract(url, properties) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      return {};
    }
    const cssText = await response.text();
    return extractTokens(cssText, properties);
  } catch (error) {
    console.warn(`Error fetching ${url}:`, error);
    return {};
  }
}

/**
 * Set preview tokens on :root by fetching and parsing all theme CSS files
 */
export async function setPreviewTokens() {
  const root = document.documentElement;

  // Fetch all theme files in parallel
  const results = await Promise.all(
    Object.entries(themeFiles).map(async ([theme, url]) => {
      const tokensToExtract = themeBaseTokens[theme] || PREVIEW_TOKENS;
      const tokens = await fetchAndExtract(url, tokensToExtract);
      return { theme, tokens };
    })
  );

  // Set preview tokens on :root
  // Map by position: [0]=bg, [1]=primary, [2]=text, [3]=accent
  const tokenTypes = ['bg', 'primary', 'text', 'accent'];

  results.forEach(({ theme, tokens }) => {
    const tokensToExtract = themeBaseTokens[theme] || PREVIEW_TOKENS;

    tokensToExtract.forEach((prop, index) => {
      const value = tokens[prop];
      if (value) {
        const previewName = `--theme-preview-${theme}-${tokenTypes[index]}`;
        root.style.setProperty(previewName, value);
      }
    });
  });

  console.log('Theme preview tokens loaded from CSS files');
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
    document.addEventListener('DOMContentLoaded', setPreviewTokens);
  } else {
    setPreviewTokens();
  }
}

export default { setPreviewTokens, getThemeFileUrl, getThemeNames };
