/**
 * Accessibility Panel Logic
 *
 * Handles all accessibility settings, storage, and UI interactions.
 * Used by AccessibilityPanel.astro component.
 */

// ===================================
// SETTINGS INTERFACE
// ===================================
export interface A11ySettings {
  textOnly: boolean;
  highlightLinks: boolean;
  dyslexiaFont: boolean;
  fontFamily?: string;
  fontSize: number;
  letterSpacing: number;
  wordSpacing: number;
  lineHeight: number;
  theme: string;
  reduceMotion: boolean;
  enhancedFocus: boolean;
  screenReaderMode: boolean;
}

const STORAGE_KEY = 'a11y-settings';

export const defaultSettings: A11ySettings = {
  textOnly: false,
  highlightLinks: false,
  dyslexiaFont: false,
  fontFamily: 'default',
  fontSize: 100,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 100,
  theme: 'default',
  reduceMotion: false,
  enhancedFocus: false,
  screenReaderMode: false
};

// ===================================
// STORAGE FUNCTIONS
// ===================================
export function getSettings(): A11ySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: A11ySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // localStorage not available
  }
}

// ===================================
// SCREEN READER ANNOUNCER
// ===================================
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcer = priority === 'assertive'
    ? document.getElementById('a11y-alert')
    : document.getElementById('a11y-announcer');

  if (announcer) {
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }
}

// ===================================
// FOCUS TRAP CLASS
// ===================================
export class FocusTrap {
  private container: HTMLElement;
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;
  private previouslyFocused: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.updateFocusableElements();
  }

  private updateFocusableElements(): void {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const focusables = this.container.querySelectorAll<HTMLElement>(focusableSelectors);
    this.firstFocusable = focusables[0] || null;
    this.lastFocusable = focusables[focusables.length - 1] || null;
  }

  activate(): void {
    this.previouslyFocused = document.activeElement as HTMLElement;
    document.body.classList.add('focus-trap-active');
    this.container.setAttribute('data-focus-trap', 'active');

    if (this.firstFocusable) {
      this.firstFocusable.focus();
    }

    this.container.addEventListener('keydown', this.handleKeydown);
  }

  deactivate(): void {
    document.body.classList.remove('focus-trap-active');
    this.container.removeAttribute('data-focus-trap');
    this.container.removeEventListener('keydown', this.handleKeydown);

    if (this.previouslyFocused) {
      this.previouslyFocused.focus();
    }
  }

  private handleKeydown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    this.updateFocusableElements();

    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable?.focus();
      }
    }
  };
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

// ===================================
// APPLY SETTINGS
// ===================================
export function applySettings(settings: A11ySettings): void {
  const body = document.body;

  // Toggle classes
  body.classList.toggle('a11y-text-only', settings.textOnly);
  body.classList.toggle('a11y-highlight-links', settings.highlightLinks);
  body.classList.toggle('a11y-dyslexia-font', settings.dyslexiaFont);
  body.classList.toggle('a11y-reduce-motion', settings.reduceMotion);
  body.classList.toggle('a11y-enhanced-focus', settings.enhancedFocus);
  body.classList.toggle('a11y-screen-reader-mode', settings.screenReaderMode);

  // Font Family
  body.classList.remove(
    'a11y-font-opendyslexic',
    'a11y-font-atkinson',
    'a11y-font-comic-sans',
    'a11y-font-verdana',
    'a11y-font-arial',
    'a11y-font-tahoma'
  );
  if (settings.fontFamily && settings.fontFamily !== 'default') {
    body.classList.add(`a11y-font-${settings.fontFamily}`);
  }

  // Font Size
  document.documentElement.style.fontSize = `${settings.fontSize}%`;

  // Letter Spacing
  body.style.letterSpacing = settings.letterSpacing > 0 ? `${settings.letterSpacing * 0.05}em` : '';

  // Word Spacing
  body.style.wordSpacing = settings.wordSpacing > 0 ? `${settings.wordSpacing * 0.05}em` : '';

  // Line Height
  body.style.lineHeight = settings.lineHeight > 100 ? `${settings.lineHeight}%` : '';

  // Theme - Use ThemeSwitcher for dynamic CSS loading
  const themeMap: Record<string, string> = {
    'default': 'default',
    'dark': 'a11y-dark',
    'cream': 'a11y-cream',
    'high-contrast': 'a11y-high-contrast',
    'protanopia': 'a11y-protanopia',
    'deuteranopia': 'a11y-deuteranopia',
    'tritanopia': 'a11y-tritanopia',
    'monochrome': 'a11y-monochrome'
  };

  const switcherTheme = themeMap[settings.theme] || 'default';
  if ((window as any).themeSwitcher) {
    (window as any).themeSwitcher.switchTheme(switcherTheme);
  } else {
    setTimeout(() => {
      if ((window as any).themeSwitcher) {
        (window as any).themeSwitcher.switchTheme(switcherTheme);
      }
    }, 100);
  }

  // Also keep body class for a11y.css component-specific styles
  body.classList.remove(
    'a11y-theme-dark',
    'a11y-theme-cream',
    'a11y-theme-high-contrast',
    'a11y-theme-protanopia',
    'a11y-theme-deuteranopia',
    'a11y-theme-tritanopia',
    'a11y-theme-monochrome'
  );
  if (settings.theme !== 'default') {
    body.classList.add(`a11y-theme-${settings.theme}`);
  }

  // Announce changes if screen reader mode is on
  if (settings.screenReaderMode) {
    announce('Accessibility settings updated');
  }
}

// ===================================
// PRESETS
// ===================================
export const presets: Record<string, Partial<A11ySettings>> = {
  dyslexia: {
    fontFamily: 'opendyslexic',
    fontSize: 110,
    letterSpacing: 3,
    wordSpacing: 4,
    lineHeight: 150
  },
  'low-vision': {
    fontSize: 150,
    theme: 'high-contrast',
    enhancedFocus: true
  },
  'color-blind': {
    theme: 'deuteranopia'
  },
  motor: {
    enhancedFocus: true,
    fontSize: 120,
    reduceMotion: true
  },
  cognitive: {
    reduceMotion: true,
    fontSize: 110,
    lineHeight: 160
  },
  clear: { ...defaultSettings }
};

// ===================================
// SLIDER VALUE FORMATTER
// ===================================
export function formatSliderValue(setting: string, value: number): string {
  switch (setting) {
    case 'fontSize':
      return `${value}%`;
    case 'letterSpacing':
    case 'wordSpacing':
      return value === 0 ? 'Normal' : `+${value}`;
    case 'lineHeight':
      return value === 100 ? 'Normal' : `${value}%`;
    default:
      return String(value);
  }
}

// ===================================
// KEYBOARD DETECTION
// ===================================
export function initKeyboardDetection(): void {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
  });
}

// ===================================
// EXPOSE GLOBAL API
// ===================================
if (typeof window !== 'undefined') {
  (window as any).a11y = {
    announce,
    FocusTrap,
    prefersReducedMotion,
    prefersHighContrast,
    getSettings,
    applySettings
  };
}
