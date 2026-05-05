// Import all theme CSS files dynamically via Vite glob.
// One-level glob — every CSS file directly in themes/ is a theme.
// The Preview/ subfolder isn't matched by `*.css` so it's auto-excluded.
const themeModules = import.meta.glob('../styles/themes/*.css', {
  query: '?url',
  import: 'default',
  eager: true
});

// Build themes map from glob results
function buildThemeMap(modules) {
  const themes = {};
  for (const [path, url] of Object.entries(modules)) {
    // Theme name = filename without extension. e.g.
    //   '../styles/themes/vivid-dark.css'   -> 'vivid-dark'
    //   '../styles/themes/mono-pure.css'    -> 'mono-pure'
    //   '../styles/themes/BrandDefault.css' -> 'default' (special case)
    const match = path.match(/\/([^/]+)\.css$/);
    if (match) {
      let name = match[1];
      if (name === 'BrandDefault') name = 'default';
      themes[name] = url;
    }
  }
  return themes;
}

/**
 * ThemeSwitcher - Dynamic CSS File Theme Switching
 * Uses Link Tag Swapping for optimal performance and reliability
 *
 * Theme resolution: base theme + luminance + CVD mode
 * e.g. 'forest' + 'dark' + 'protan' -> 'forest-dark-protan'
 */
export class ThemeSwitcher {
  constructor() {
    this.themes = buildThemeMap(themeModules);

    this.currentTheme = null;  // Start as null so first switchTheme always loads CSS
    this.themeLink = null;
    this.isLoading = false;

    this.init();
  }

  init() {
    // Create theme link element
    this.themeLink = document.getElementById('dynamic-theme-css');

    if (!this.themeLink) {
      this.themeLink = document.createElement('link');
      this.themeLink.id = 'dynamic-theme-css';
      this.themeLink.rel = 'stylesheet';
      this.themeLink.type = 'text/css';

      // Append to END of head for highest cascade priority
      // Theme CSS must override BrandDefault.css and all component styles
      document.head.appendChild(this.themeLink);
    }

    // Create accessibility announcer
    this.createAnnouncer();

    // Load saved theme or default
    // Migrate old theme names to new ones
    const themeNameMigration = {
      'walking-with-a-smile': 'default',
      'a11y-dark': 'default-dark',
      'a11y-high-contrast': 'high-contrast',
      'a11y-calm': 'calm',
      'a11y-monochrome': 'monochrome-warm',
      'a11y-protanopia': 'default-protan',
      'a11y-deuteranopia': 'default-protan',
      'a11y-tritanopia': 'default-tritan',
    };
    let savedTheme = localStorage.getItem('color-theme');
    if (savedTheme && themeNameMigration[savedTheme]) {
      savedTheme = themeNameMigration[savedTheme];
      localStorage.setItem('color-theme', savedTheme);
    }
    // Validate theme exists, fallback to default
    if (savedTheme && !this.themes[savedTheme]) {
      savedTheme = 'default';
      localStorage.setItem('color-theme', savedTheme);
    }
    this.switchTheme(savedTheme || 'default');

    // Set up keyboard shortcuts
    this.setupKeyboardShortcuts();
  }


  createAnnouncer() {
    if (!document.getElementById('theme-announcer')) {
      const announcer = document.createElement('div');
      announcer.id = 'theme-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announcer);
    }
  }

  switchTheme(themeName) {
    if (!this.themes[themeName]) {
      console.error(`Theme "${themeName}" not found`);
      return Promise.reject(new Error(`Theme "${themeName}" not found`));
    }

    if (this.currentTheme === themeName) {
      return Promise.resolve();
    }

    // Store previous theme for event
    const previousTheme = this.currentTheme;

    // Update current theme immediately to prevent race conditions
    this.currentTheme = themeName;

    // Show loading state
    document.documentElement.classList.add('theme-switching');

    return new Promise((resolve, reject) => {
      // Set up load handler before changing href
      const onLoad = () => {
        this.themeLink.removeEventListener('load', onLoad);
        this.themeLink.removeEventListener('error', onError);

        // Save preference
        localStorage.setItem('color-theme', themeName);

        // Remove loading state + reveal page
        document.documentElement.classList.remove('theme-switching');
        document.documentElement.style.opacity = '';
        document.documentElement.style.transition = '';

        // Update UI indicators
        this.updateThemeIndicators(themeName);

        // Announce to screen readers
        this.announceThemeChange(themeName);

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', {
          detail: {
            theme: themeName,
            previousTheme: previousTheme
          }
        }));

        console.log(`Theme switched to: ${themeName}`);
        resolve(themeName);
      };

      const onError = () => {
        this.themeLink.removeEventListener('load', onLoad);
        this.themeLink.removeEventListener('error', onError);

        console.error(`Failed to load theme: ${themeName}`);
        document.documentElement.classList.remove('theme-switching');
        document.documentElement.style.opacity = '';
        document.documentElement.style.transition = '';
        // Revert to previous theme on error
        this.currentTheme = previousTheme;
        reject(new Error(`Failed to load theme: ${themeName}`));
      };

      this.themeLink.addEventListener('load', onLoad);
      this.themeLink.addEventListener('error', onError);

      // Simply change the href - no new elements, no removals
      this.themeLink.href = this.themes[themeName];
    });
  }

  updateThemeIndicators(themeName) {
    // Update theme selector buttons
    document.querySelectorAll('[data-theme]').forEach(button => {
      const isActive = button.dataset.theme === themeName;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive.toString());
    });

    // Set data-mode, data-theme, and data-cvd on <html>
    // Theme files output --theme-luminance: light|dark — read after CSS loads
    document.documentElement.setAttribute('data-theme', themeName);

    // Extract CVD mode from theme name (e.g. 'forest-dark-protan' → 'protan')
    const cvdMatch = themeName.match(/-(protan|deutan|tritan)$/);
    if (cvdMatch) {
      document.documentElement.setAttribute('data-cvd', cvdMatch[1]);
    } else {
      document.documentElement.removeAttribute('data-cvd');
    }

    // High contrast detection
    if (themeName.includes('high-contrast')) {
      document.documentElement.setAttribute('data-high-contrast', '');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }

    setTimeout(() => {
      const computed = getComputedStyle(document.documentElement);

      const luminance = computed.getPropertyValue('--theme-luminance').trim();
      if (luminance) {
        document.documentElement.setAttribute('data-mode', luminance);
      } else {
        document.documentElement.removeAttribute('data-mode');
      }

      // Read chroma from CSS and set data attribute (mono rainbow override)
      const chroma = computed.getPropertyValue('--theme-chroma').trim();
      if (chroma) {
        document.documentElement.setAttribute('data-theme-chroma', chroma);
      } else {
        document.documentElement.removeAttribute('data-theme-chroma');
      }

      // Theme-level no-chroma trigger — when the theme is mono (chroma=grey),
      // auto-activate the no-chroma gate so images, focus, links etc. all
      // get the no-hue treatment without the user needing to toggle it
      // separately.
      // Uses a SEPARATE attribute (data-theme-no-chroma) so it doesn't
      // clash with the user's own panel toggle (data-no-chroma). The CSS
      // gate in no-chroma.css matches either attribute.
      if (chroma === 'grey') {
        document.documentElement.setAttribute('data-theme-no-chroma', '');
      } else {
        document.documentElement.removeAttribute('data-theme-no-chroma');
      }
    }, 0);

    // Legacy: body classes for components still using .a11y-theme-* selectors
    // TODO: Remove once all selectors migrated to [data-mode] etc.
    document.documentElement.classList.forEach(cls => {
      if (cls.startsWith('a11y-theme-')) {
        document.documentElement.classList.remove(cls);
      }
    });
    if (themeName !== 'default') {
      const bodyClass = themeName.replace('a11y-', 'a11y-theme-');
      document.documentElement.classList.add(bodyClass);
    }

    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    // Set theme color from CSS token (reads --page-bg or --brand-c-primary)
    // Small delay to let CSS load first
    setTimeout(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      // Try --page-bg first, fallback to --brand-c-primary
      let themeColor = computedStyle.getPropertyValue('--page-bg').trim() ||
                       computedStyle.getPropertyValue('--brand-c-primary').trim() ||
                       '#8FA68A';
      metaThemeColor.content = themeColor;
    }, 50);
  }

  announceThemeChange(themeName) {
    const announcer = document.getElementById('theme-announcer');
    if (announcer) {
      // Import theme-names.json for friendly names (generated at build time)
      // Fall back to theme key if not found
      const friendlyNames = {};

      announcer.textContent = `Color theme changed to ${friendlyNames[themeName] || themeName}`;

      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + T to cycle through themes
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        this.cycleTheme();
      }
    });
  }

  cycleTheme() {
    const themeNames = Object.keys(this.themes).sort();
    const currentIndex = themeNames.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    const nextTheme = themeNames[nextIndex];

    this.switchTheme(nextTheme);
  }

  // Public API methods
  getCurrentTheme() {
    return this.currentTheme;
  }

  getAvailableThemes() {
    return Object.keys(this.themes);
  }

  addTheme(name, cssPath) {
    this.themes[name] = cssPath;
  }

  removeTheme(name) {
    if (this.themes[name]) {
      delete this.themes[name];
    }
  }

  preloadThemes() {
    // Preload all theme CSS files for faster switching
    Object.values(this.themes).forEach(cssPath => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = cssPath;
      document.head.appendChild(link);
    });
  }
}

// Auto-initialize when DOM is ready
let themeSwitcher;

function initThemeSwitcher() {
  if (!themeSwitcher) {
    themeSwitcher = new ThemeSwitcher();
    window.themeSwitcher = themeSwitcher; // Global access
  }
  return themeSwitcher;
}

// Initialize based on document state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSwitcher);
} else {
  initThemeSwitcher();
}

export default ThemeSwitcher;