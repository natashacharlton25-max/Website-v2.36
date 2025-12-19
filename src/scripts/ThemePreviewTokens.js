/**
 * ThemePreviewTokens - Dynamically extracts theme colors from CSS files
 *
 * Fetches each theme CSS file and extracts the core color tokens
 * (--a11y-*-bg, --a11y-*-accent, --a11y-*-text) to create preview tokens
 * for the accessibility panel theme cards.
 *
 * No hardcoded colors - all values come from the theme CSS files.
 */

// Theme files to parse
const themeFiles = {
  // Brand theme (default)
  default: '/src/styles/themes/brand/BrandDefault.css',
  // Accessibility themes
  dark: '/src/styles/themes/a11y/a11y-dark.css',
  cream: '/src/styles/themes/a11y/a11y-cream.css',
  hc: '/src/styles/themes/a11y/a11y-high-contrast.css',
  protanopia: '/src/styles/themes/a11y/a11y-protanopia.css',
  deuteranopia: '/src/styles/themes/a11y/a11y-deuteranopia.css',
  tritanopia: '/src/styles/themes/a11y/a11y-tritanopia.css',
  mono: '/src/styles/themes/a11y/a11y-monochrome.css',
};

// Token patterns to extract from each theme
// Maps theme name to the CSS variable names to extract [bg, primary, text, accent]
const tokenPatterns = {
  // Brand theme uses standard color tokens
  default: ['--color-Background-50', '--color-Primary-500', '--color-Text-800', '--color-Secondary-500'],
  // A11y themes use their specific tokens (each has unique namespace)
  dark: ['--a11y-dark-bg', '--a11y-dark-primary', '--a11y-dark-text', '--a11y-dark-accent'],
  cream: ['--a11y-cream-bg', '--a11y-cream-primary', '--a11y-cream-text', '--a11y-cream-accent'],
  hc: ['--a11y-hc-bg', '--a11y-hc-primary', '--a11y-hc-text', '--a11y-hc-accent'],
  protanopia: ['--a11y-proto-bg', '--a11y-proto-primary', '--a11y-proto-text', '--a11y-proto-accent'],
  deuteranopia: ['--a11y-deuter-bg', '--a11y-deuter-primary', '--a11y-deuter-text', '--a11y-deuter-accent'],
  tritanopia: ['--a11y-trit-bg', '--a11y-trit-primary', '--a11y-trit-text', '--a11y-trit-accent'],
  mono: ['--a11y-mono-bg', '--a11y-mono-primary', '--a11y-mono-text', '--a11y-mono-accent'],
};

/**
 * Parse CSS text to extract custom property values
 * @param {string} cssText - Raw CSS text
 * @param {string[]} properties - Array of CSS custom property names to extract
 * @returns {object} Map of property name to value
 */
function extractTokens(cssText, properties) {
  const tokens = {};

  properties.forEach(prop => {
    // Match pattern: --prop-name: value; (handles multiline and various formats)
    const regex = new RegExp(`${prop.replace(/[-]/g, '\\-')}\\s*:\\s*([^;]+);`, 'i');
    const match = cssText.match(regex);

    if (match) {
      tokens[prop] = match[1].trim();
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
 * This extracts actual values from the CSS files - no hardcoding needed
 */
export async function setPreviewTokens() {
  const root = document.documentElement;

  // Fetch all theme files in parallel
  const results = await Promise.all(
    Object.entries(themeFiles).map(async ([theme, url]) => {
      const patterns = tokenPatterns[theme];
      const tokens = await fetchAndExtract(url, patterns);
      return { theme, tokens };
    })
  );

  // Set preview tokens on :root
  results.forEach(({ theme, tokens }) => {
    const patterns = tokenPatterns[theme];
    // Map by array position: [0]=bg, [1]=primary, [2]=text, [3]=accent
    const tokenTypes = ['bg', 'primary', 'text', 'accent'];

    patterns.forEach((prop, index) => {
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
