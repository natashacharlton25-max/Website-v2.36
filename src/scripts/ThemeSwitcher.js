import { setPreviewTokens } from './ThemePreviewTokens.js';

/**
 * ThemeSwitcher - Dynamic CSS File Theme Switching
 * Uses Link Tag Swapping for optimal performance and reliability
 */
export class ThemeSwitcher {
  constructor() {
    this.themes = {
      // Brand theme (default)
      'default': '/src/styles/themes/brand/BrandDefault.css',
      // Accessibility themes
      'a11y-dark': '/src/styles/themes/a11y/a11y-dark.css',
      'a11y-high-contrast': '/src/styles/themes/a11y/a11y-high-contrast.css',
      'a11y-cream': '/src/styles/themes/a11y/a11y-cream.css',
      'a11y-monochrome': '/src/styles/themes/a11y/a11y-monochrome.css',
      'a11y-protanopia': '/src/styles/themes/a11y/a11y-protanopia.css',
      'a11y-deuteranopia': '/src/styles/themes/a11y/a11y-deuteranopia.css',
      'a11y-tritanopia': '/src/styles/themes/a11y/a11y-tritanopia.css',
    };

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

    // Set preview tokens for accessibility panel theme cards
    setPreviewTokens();

    // Create accessibility announcer
    this.createAnnouncer();

    // Load saved theme or default
    // Migrate old theme names to new ones
    const themeNameMigration = {
      'walking-with-a-smile': 'default'
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
    document.body.classList.add('theme-switching');

    return new Promise((resolve, reject) => {
      // Set up load handler before changing href
      const onLoad = () => {
        this.themeLink.removeEventListener('load', onLoad);
        this.themeLink.removeEventListener('error', onError);

        // Save preference
        localStorage.setItem('color-theme', themeName);

        // Remove loading state
        document.body.classList.remove('theme-switching');

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
        document.body.classList.remove('theme-switching');
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

    // Update body class for a11y.css component-specific styles
    // Remove all a11y-theme-* classes first
    document.body.classList.forEach(cls => {
      if (cls.startsWith('a11y-theme-')) {
        document.body.classList.remove(cls);
      }
    });
    // Add new theme class (convert 'a11y-dark' to 'a11y-theme-dark')
    if (themeName !== 'default') {
      const bodyClass = themeName.replace('a11y-', 'a11y-theme-');
      document.body.classList.add(bodyClass);
    }

    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }

    // Set theme color from CSS token (reads --page-bg or --color-Primary-500)
    // Small delay to let CSS load first
    setTimeout(() => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      // Try --page-bg first, fallback to --color-Primary-500
      let themeColor = computedStyle.getPropertyValue('--page-bg').trim() ||
                       computedStyle.getPropertyValue('--color-Primary-500').trim() ||
                       '#8FA68A';
      metaThemeColor.content = themeColor;
    }, 50);
  }

  announceThemeChange(themeName) {
    const announcer = document.getElementById('theme-announcer');
    if (announcer) {
      const friendlyNames = {
        'default': 'Default Theme',
        'a11y-dark': 'Dark Mode',
        'a11y-high-contrast': 'High Contrast',
        'a11y-cream': 'Cream',
        'a11y-monochrome': 'Monochrome',
        'a11y-protanopia': 'Protanopia (Red-blind)',
        'a11y-deuteranopia': 'Deuteranopia (Green-blind)',
        'a11y-tritanopia': 'Tritanopia (Blue-blind)'
      };

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
    const themeNames = Object.keys(this.themes);
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