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
  scrollbarEnhanced: boolean;
  altTextMode: 'none' | 'word' | 'descriptive' | 'aac';
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
  screenReaderMode: false,
  scrollbarEnhanced: false,
  altTextMode: 'none'
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
  // Get the content wrapper - all a11y settings apply HERE, not to body
  // This keeps the AccessibilityPanel immune from its own settings
  const wrapper = document.getElementById('a11y-content-wrapper');
  const body = document.body;

  // If wrapper doesn't exist yet, fall back to body (for early loading)
  const target = wrapper || body;

  // Toggle classes on the wrapper (NOT body)
  target.classList.toggle('a11y-text-only', settings.textOnly);
  target.classList.toggle('a11y-highlight-links', settings.highlightLinks);
  target.classList.toggle('a11y-dyslexia-font', settings.dyslexiaFont);
  target.classList.toggle('a11y-reduce-motion', settings.reduceMotion);
  target.classList.toggle('a11y-enhanced-focus', settings.enhancedFocus);
  target.classList.toggle('a11y-screen-reader-mode', settings.screenReaderMode);
  target.classList.toggle('a11y-scrollbar-enhanced', settings.scrollbarEnhanced);

  // Alt Text Mode - apply as data attribute
  const altMode = settings.altTextMode || 'none';
  (target as HTMLElement).dataset.altTextMode = altMode;
  document.documentElement.dataset.altTextMode = altMode;

  // Font Family - apply to wrapper
  target.classList.remove(
    'a11y-font-opendyslexic',
    'a11y-font-atkinson',
    'a11y-font-comic-sans',
    'a11y-font-verdana',
    'a11y-font-arial',
    'a11y-font-tahoma'
  );
  if (settings.fontFamily && settings.fontFamily !== 'default') {
    target.classList.add(`a11y-font-${settings.fontFamily}`);
  }

  // Font Size - apply zoom to wrapper so all content scales visually
  // (zoom affects rem-resolved text without changing html root or the panel)
  if (wrapper) {
    wrapper.style.zoom = settings.fontSize !== 100 ? `${settings.fontSize / 100}` : '';
  }
  document.documentElement.style.setProperty('--a11y-font-scale', `${settings.fontSize}`);

  // Letter Spacing - apply to wrapper
  (target as HTMLElement).style.letterSpacing = settings.letterSpacing > 0 ? `${settings.letterSpacing * 0.05}em` : '';

  // Word Spacing - apply to wrapper
  (target as HTMLElement).style.wordSpacing = settings.wordSpacing > 0 ? `${settings.wordSpacing * 0.05}em` : '';

  // Line Height - toggle class + CSS custom property so !important rules can override children
  if (settings.lineHeight > 100) {
    document.documentElement.style.setProperty('--a11y-line-height', `${settings.lineHeight / 100}`);
    target.classList.add('a11y-line-height-active');
  } else {
    document.documentElement.style.removeProperty('--a11y-line-height');
    target.classList.remove('a11y-line-height-active');
  }

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

  // Theme class - apply to wrapper
  const themeClasses = [
    'a11y-theme-dark',
    'a11y-theme-cream',
    'a11y-theme-high-contrast',
    'a11y-theme-protanopia',
    'a11y-theme-deuteranopia',
    'a11y-theme-tritanopia',
    'a11y-theme-monochrome'
  ];
  target.classList.remove(...themeClasses);
  if (settings.theme !== 'default') {
    target.classList.add(`a11y-theme-${settings.theme}`);
  }

  // Mirror a11y classes to <html> so OverlayScrollbars CSS selectors
  // (e.g. .a11y-theme-dark .os-scrollbar) can match. The .os-scrollbar
  // elements are direct children of <body>, outside #a11y-content-wrapper,
  // so they need an ancestor above <body> to carry the class.
  const root = document.documentElement;
  root.classList.remove(...themeClasses, 'a11y-text-only', 'a11y-reduce-motion');
  if (settings.theme !== 'default') {
    root.classList.add(`a11y-theme-${settings.theme}`);
  }
  if (settings.textOnly) root.classList.add('a11y-text-only');
  if (settings.reduceMotion) root.classList.add('a11y-reduce-motion');

  // Announce changes if screen reader mode is on
  if (settings.screenReaderMode) {
    announce('Accessibility settings updated');
  }

  // Trigger re-layout so JS-positioned components (GSAP, masonry, sliders)
  // recalculate after CSS class changes
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event('resize'));
    if ((window as any).ScrollTrigger) {
      (window as any).ScrollTrigger.refresh();
    }
  });
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
    lineHeight: 160,
    altTextMode: 'word'
  },
  clear: { ...defaultSettings }
};

// ===================================
// UPDATE UI — sync all controls to match settings
// ===================================
export function updateUI(container: HTMLElement, s: A11ySettings): void {
  // Toggle cards
  const toggleCardSettings = ['textOnly', 'highlightLinks', 'reduceMotion', 'enhancedFocus', 'screenReaderMode', 'scrollbarEnhanced'];
  toggleCardSettings.forEach(key => {
    const card = container.querySelector(`.a11y-toggle-card[data-setting="${key}"]`);
    if (card) {
      card.setAttribute('aria-pressed', (s as any)[key] ? 'true' : 'false');
    }
  });

  // Font cards
  container.querySelectorAll('.a11y-font-card').forEach(card => {
    const font = (card as HTMLButtonElement).dataset.font;
    card.setAttribute('aria-pressed', font === s.fontFamily ? 'true' : 'false');
  });

  // Stepper values
  const stepperSettings = ['fontSize', 'letterSpacing', 'wordSpacing', 'lineHeight'];
  stepperSettings.forEach(key => {
    const stepper = container.querySelector(`.a11y-stepper[data-setting="${key}"]`);
    if (!stepper) return;

    const value = (s as any)[key];
    const min = parseInt(stepper.getAttribute('data-min') || '0', 10);
    const max = parseInt(stepper.getAttribute('data-max') || '100', 10);
    const hiddenInput = stepper.querySelector('input[type="hidden"]') as HTMLInputElement;
    const valueEl = stepper.querySelector('.a11y-stepper__value') as HTMLElement;
    const unit = valueEl?.getAttribute('data-unit') || '';
    const minusBtn = stepper.querySelector('[data-action="decrement"]') as HTMLButtonElement;
    const plusBtn = stepper.querySelector('[data-action="increment"]') as HTMLButtonElement;

    if (hiddenInput) hiddenInput.value = value.toString();
    if (valueEl) valueEl.textContent = `${value}${unit}`;
    if (minusBtn) minusBtn.disabled = value <= min;
    if (plusBtn) plusBtn.disabled = value >= max;
  });

  // Alt text cards
  container.querySelectorAll('.a11y-alttext-card').forEach(card => {
    const val = (card as HTMLButtonElement).dataset.alttext;
    card.setAttribute('aria-pressed', val === s.altTextMode ? 'true' : 'false');
  });

  // Theme cards
  container.querySelectorAll('.a11y-theme-card').forEach(btn => {
    const theme = (btn as HTMLButtonElement).dataset.theme;
    btn.setAttribute('aria-pressed', theme === s.theme ? 'true' : 'false');
  });
}

// ===================================
// HANDLE PRESET CLICK — shared preset logic
// ===================================
export function handlePresetClick(
  container: HTMLElement,
  settings: A11ySettings,
  preset: string,
  btn: Element,
): A11ySettings {
  if (preset === 'clear') {
    settings = { ...defaultSettings };
  } else if (preset === 'easyread') {
    const enabling = !settings.textOnly;
    if (enabling) {
      settings.textOnly = true;
      settings.fontSize = 120;
      settings.letterSpacing = 2;
      settings.wordSpacing = 3;
      settings.lineHeight = 160;
      settings.theme = 'cream';
      settings.altTextMode = 'descriptive';
    } else {
      settings.textOnly = false;
      settings.fontSize = defaultSettings.fontSize;
      settings.letterSpacing = defaultSettings.letterSpacing;
      settings.wordSpacing = defaultSettings.wordSpacing;
      settings.lineHeight = defaultSettings.lineHeight;
      settings.theme = defaultSettings.theme;
      settings.altTextMode = defaultSettings.altTextMode;
    }

    saveSettings(settings);
    applySettings(settings);

    // Sync toggle card + stepper UI (null-safe if absent)
    const textOnlyCard = container.querySelector('.a11y-toggle-card[data-setting="textOnly"]');
    if (textOnlyCard) {
      textOnlyCard.setAttribute('aria-pressed', settings.textOnly ? 'true' : 'false');
    }
    container.querySelectorAll('.a11y-stepper').forEach(stepper => {
      const stepSetting = stepper.getAttribute('data-setting') as string;
      const val = (settings as any)[stepSetting];
      if (val !== undefined) {
        const valueEl = stepper.querySelector('.a11y-stepper__value') as HTMLElement;
        const hiddenInput = stepper.querySelector('input[type="hidden"]') as HTMLInputElement;
        if (valueEl) valueEl.textContent = String(val) + (valueEl.getAttribute('data-unit') || '');
        if (hiddenInput) hiddenInput.value = String(val);
      }
    });

    if (enabling) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    if (settings.screenReaderMode) {
      announce(enabling ? 'Easy read mode enabled' : 'Easy read mode disabled');
    }
    return settings;
  } else if (presets[preset]) {
    settings = { ...settings, ...presets[preset] };
  }

  container.querySelectorAll('.a11y-preset-btn').forEach(b => b.classList.remove('active'));
  if (preset !== 'clear') {
    btn.classList.add('active');
  }

  saveSettings(settings);
  applySettings(settings);
  updateUI(container, settings);

  if (settings.screenReaderMode) {
    announce(`${btn.querySelector('.a11y-preset-btn__title')?.textContent} preset applied`);
  }
  return settings;
}

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
