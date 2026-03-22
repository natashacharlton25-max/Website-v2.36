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
  focusDim: boolean;
  focusScroll: boolean;
  focusPulse: boolean;
  focusLabel: boolean;
  focusRainbow: boolean;
  focusColorJourney: boolean;
  rainbowHighlight: boolean;
  customCaret: boolean;
  rainbowScroll: boolean;
  focusColourCycle: boolean;
  arrowTab: boolean;
  screenReaderMode: boolean;
  scrollbarEnhanced: boolean;
  altTextMode: 'none' | 'word' | 'descriptive' | 'aac';
  altDisplayMode: 'hidden' | 'overlay' | 'tooltip' | 'enlarge' | 'replace';
  cognitiveLevel: 'green' | 'yellow' | 'orange' | 'full';
  /** Which symbol pictures to show — OpenAAC is the bundled default */
  symbolSet: 'openaac' | 'widgit' | 'pcs' | 'bliss' | 'makaton' | 'custom';
  /** URL to a user-provided custom symbol mapping JSON file */
  customSymbolsUrl: string;
  /** Hover feedback mode — controls decorative hover effects */
  hoverMode: 'none' | 'instant' | 'gentle' | 'full';
  /** Content AAC — show pictogram cards for text/heading content */
  contentAac: boolean;
  /** AAC pictogram filter — grayscale or sepia for colour-blind users */
  aacFilter: 'none' | 'grayscale' | 'sepia';
  /** Image enlarge — click to open modal with enlarged image + alt text subtitle */
  imageEnlarge: boolean;
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
  focusDim: false,
  focusScroll: false,
  focusPulse: false,
  focusLabel: false,
  focusRainbow: false,
  focusColorJourney: false,
  rainbowHighlight: false,
  customCaret: false,
  rainbowScroll: false,
  focusColourCycle: false,
  arrowTab: false,
  screenReaderMode: false,
  scrollbarEnhanced: false,
  altTextMode: 'none',
  altDisplayMode: 'hidden',
  cognitiveLevel: 'full',
  symbolSet: 'openaac',
  customSymbolsUrl: '',
  hoverMode: 'full',
  contentAac: false,
  aacFilter: 'none',
  imageEnlarge: false
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

  // Set data-render attribute (new system) alongside legacy classes
  // Priority: textonly > reduced > assistive > full
  if (settings.textOnly) {
    document.body.dataset.render = 'textonly';
  } else if (settings.reduceMotion) {
    document.body.dataset.render = 'reduced';
  } else {
    document.body.removeAttribute('data-render');
  }

  target.classList.toggle('a11y-highlight-links', settings.highlightLinks);
  // New data attribute for highlight-links gate (works alongside legacy class)
  if (settings.highlightLinks) {
    document.documentElement.setAttribute('data-highlight-links', '');
    document.documentElement.setAttribute('data-highlight', 'static');
  } else {
    document.documentElement.removeAttribute('data-highlight-links');
    document.documentElement.removeAttribute('data-highlight');
  }
  target.classList.toggle('a11y-dyslexia-font', settings.dyslexiaFont);
  target.classList.toggle('a11y-reduce-motion', settings.reduceMotion);
  target.classList.toggle('a11y-enhanced-focus', settings.enhancedFocus);
  // Enhanced focus — double ring + thicker
  if (settings.enhancedFocus) {
    document.documentElement.setAttribute('data-enhanced-focus', '');
    document.documentElement.style.setProperty('--focus-thickness', '0.3rem');
  } else {
    document.documentElement.removeAttribute('data-enhanced-focus');
    document.documentElement.style.removeProperty('--focus-thickness');
  }

  // Individual focus features
  document.documentElement.toggleAttribute('data-focus-dim', settings.focusDim);
  document.documentElement.toggleAttribute('data-focus-scroll', settings.focusScroll);
  document.documentElement.toggleAttribute('data-focus-pulse', settings.focusPulse);
  document.documentElement.toggleAttribute('data-focus-label', settings.focusLabel);
  document.documentElement.toggleAttribute('data-focus-rainbow', settings.focusRainbow);
  document.documentElement.toggleAttribute('data-focus-color-journey', settings.focusColorJourney);
  document.documentElement.toggleAttribute('data-rainbow-highlight', settings.rainbowHighlight);
  document.documentElement.toggleAttribute('data-custom-caret', settings.customCaret);
  document.documentElement.toggleAttribute('data-rainbow-scroll', settings.rainbowScroll);
  document.documentElement.toggleAttribute('data-focus-colour-cycle', settings.focusColourCycle);
  document.documentElement.toggleAttribute('data-arrow-tab', settings.arrowTab);
  target.classList.toggle('a11y-screen-reader-mode', settings.screenReaderMode);
  target.classList.toggle('a11y-scrollbar-enhanced', settings.scrollbarEnhanced);

  // Alt Text Mode - apply as data attribute
  const altMode = settings.altTextMode || 'none';
  (target as HTMLElement).dataset.altTextMode = altMode;
  document.documentElement.dataset.altTextMode = altMode;

  // Alt Display Mode - how alt text is shown (caption, overlay, etc.)
  const displayMode = settings.altDisplayMode || 'hidden';
  (target as HTMLElement).dataset.altDisplayMode = displayMode;
  document.documentElement.dataset.altDisplayMode = displayMode;

  // Cognitive Level - AAC vocabulary depth (green/yellow/orange/full)
  const cogLevel = settings.cognitiveLevel || 'full';
  (target as HTMLElement).dataset.cognitiveLevel = cogLevel;
  document.documentElement.dataset.cognitiveLevel = cogLevel;

  // Content AAC — pictogram cards for text/heading content
  if (settings.contentAac) {
    document.documentElement.setAttribute('data-content-aac', '');
  } else {
    document.documentElement.removeAttribute('data-content-aac');
  }

  // AAC Pictogram Filter — grayscale/sepia for colour-blind users
  const aacFilter = settings.aacFilter || 'none';
  if (aacFilter === 'none') {
    document.documentElement.removeAttribute('data-aac-filter');
  } else {
    document.documentElement.dataset.aacFilter = aacFilter;
  }

  // Image Enlarge — auto-enabled when display mode is 'enlarge'
  if (displayMode === 'enlarge') {
    document.documentElement.setAttribute('data-image-enlarge', '');
  } else {
    document.documentElement.removeAttribute('data-image-enlarge');
  }

  // Hover Mode — decorative hover feedback
  const hoverMode = settings.hoverMode || 'full';
  if (hoverMode === 'full') {
    document.body.removeAttribute('data-hover');
  } else {
    document.body.dataset.hover = hoverMode;
  }

  // Symbol Set — which AAC pictures to display
  const symbolSet = settings.symbolSet || 'openaac';
  (target as HTMLElement).dataset.symbolSet = symbolSet;
  document.documentElement.dataset.symbolSet = symbolSet;

  // Symbol set switching — swap pictogram sources by BCI index
  // Local path for dev (/symbols/bliss/ from public/), R2 for production
  if (symbolSet === 'bliss') {
    const blissBase = location.hostname === 'localhost'
      ? '/symbols/bliss/'
      : 'https://asset-library.natashacharlton25.workers.dev/r2/symbols/bliss/';
    swapSymbolSet(blissBase, '.svg');
  } else if (symbolSet === 'openaac') {
    restoreOriginalSymbols();
  } else if (symbolSet === 'custom' && settings.customSymbolsUrl) {
    loadCustomSymbols(settings.customSymbolsUrl);
  }

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

  // Font Size - set user text multiplier as CSS custom property.
  // html font-size = base-font-pct × text-multiplier × layout-multiplier
  // All three multiply. Nothing overrides.
  if (settings.fontSize !== 100) {
    document.documentElement.style.setProperty('--text-multiplier', `${settings.fontSize / 100}`);
  } else {
    document.documentElement.style.removeProperty('--text-multiplier');
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
  // Legacy migration: old stored names → new names (for users with old localStorage)
  const legacyThemeMap: Record<string, string> = {
    'dark': 'default-dark',
    'protanopia': 'default-protan',
    'deuteranopia': 'default-protan',
    'tritanopia': 'default-tritan',
    'monochrome': 'monochrome-warm'
  };

  const switcherTheme = legacyThemeMap[settings.theme] || settings.theme;
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
  // Remove any existing a11y-theme-* class (covers all 112 themes)
  const removeThemeClasses = (el: Element) => {
    const toRemove = [...el.classList].filter(c => c.startsWith('a11y-theme-'));
    toRemove.forEach(c => el.classList.remove(c));
  };

  removeThemeClasses(target);
  if (switcherTheme !== 'default') {
    target.classList.add(`a11y-theme-${switcherTheme}`);
  }

  // Mirror a11y classes to <html> so OverlayScrollbars CSS selectors
  // (e.g. .a11y-theme-dark .os-scrollbar) can match. The .os-scrollbar
  // elements are direct children of <body>, outside #a11y-content-wrapper,
  // so they need an ancestor above <body> to carry the class.
  const root = document.documentElement;
  removeThemeClasses(root);
  root.classList.remove('a11y-text-only', 'a11y-reduce-motion');
  if (switcherTheme !== 'default') {
    root.classList.add(`a11y-theme-${switcherTheme}`);
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
    altTextMode: 'word',
    cognitiveLevel: 'green'
  },
  clear: { ...defaultSettings }
};

// ===================================
// UPDATE UI — sync all controls to match settings
// ===================================
export function updateUI(container: HTMLElement, s: A11ySettings): void {
  // Toggle cards
  const toggleCardSettings = ['textOnly', 'highlightLinks', 'reduceMotion', 'enhancedFocus', 'focusDim', 'focusScroll', 'focusPulse', 'focusLabel', 'focusRainbow', 'focusColorJourney', 'rainbowHighlight', 'customCaret', 'rainbowScroll', 'focusColourCycle', 'arrowTab', 'screenReaderMode', 'scrollbarEnhanced'];
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

  // Alt text mode cards (what to show)
  const altTextGrid = container.querySelector('[data-setting="altTextMode"]');
  altTextGrid?.querySelectorAll('.a11y-alttext-card').forEach(card => {
    const val = (card as HTMLButtonElement).dataset.alttext;
    card.setAttribute('aria-pressed', val === s.altTextMode ? 'true' : 'false');
  });

  // Alt display mode cards (how to show)
  const altDisplayGrid = container.querySelector('[data-setting="altDisplayMode"]');
  altDisplayGrid?.querySelectorAll('.a11y-alttext-card').forEach(card => {
    const val = (card as HTMLButtonElement).dataset.alttext;
    card.setAttribute('aria-pressed', val === s.altDisplayMode ? 'true' : 'false');
  });

  // Cognitive level cards (vocabulary depth)
  const cogLevelGrid = container.querySelector('[data-setting="cognitiveLevel"]');
  cogLevelGrid?.querySelectorAll('.a11y-alttext-card').forEach(card => {
    const val = (card as HTMLButtonElement).dataset.alttext;
    card.setAttribute('aria-pressed', val === s.cognitiveLevel ? 'true' : 'false');
  });

  // Theme cards
  container.querySelectorAll('.a11y-theme-card').forEach(btn => {
    const theme = (btn as HTMLButtonElement).dataset.theme;
    btn.setAttribute('aria-pressed', theme === s.theme ? 'true' : 'false');
  });

  // Symbol set cards (which pictures do you use?)
  const symbolSetGrid = container.querySelector('[data-setting="symbolSet"]');
  symbolSetGrid?.querySelectorAll('.a11y-alttext-card').forEach(card => {
    const val = (card as HTMLButtonElement).dataset.alttext;
    card.setAttribute('aria-pressed', val === s.symbolSet ? 'true' : 'false');
  });

  // Custom symbols URL input
  const customUrlInput = container.querySelector<HTMLInputElement>('[data-setting="customSymbolsUrl"]');
  if (customUrlInput) {
    customUrlInput.value = s.customSymbolsUrl || '';
    // Show/hide the custom URL input based on whether 'custom' is selected
    const customUrlRow = customUrlInput.closest('.a11y-custom-symbols-row') as HTMLElement;
    if (customUrlRow) {
      customUrlRow.style.display = s.symbolSet === 'custom' ? '' : 'none';
    }
  }
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
      settings.theme = 'calm';
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
// CUSTOM SYMBOL SET LOADER
// ===================================

/**
 * Cache for loaded custom symbol mappings.
 * Key: URL, Value: mapping of BCI index → image URL.
 */
let customSymbolCache: { url: string; map: Record<string, string> } | null = null;

/**
 * Load a user-provided custom symbol JSON file and swap AacCard pictograms.
 *
 * The JSON format is: { "12321": "https://example.com/my-symbol.png", ... }
 * Keys are BCI reference numbers (as strings), values are image URLs.
 * The file can be hosted anywhere — the browser fetches it client-side.
 * Images are loaded directly by the browser from the URLs in the file,
 * so the user just points to wherever their symbol images live.
 *
 * Matching: finds all .aac-card[data-bci] elements on the page,
 * swaps the .aac-card__pictogram src if a match exists in the mapping.
 */
async function loadCustomSymbols(url: string): Promise<void> {
  // Use cache if same URL already loaded
  if (customSymbolCache && customSymbolCache.url === url) {
    applyCustomSymbolMap(customSymbolCache.map);
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Custom symbols: failed to fetch ${url} (${response.status})`);
      return;
    }

    const map = await response.json() as Record<string, string>;

    // Validate: must be a plain object with string values
    if (typeof map !== 'object' || Array.isArray(map)) {
      console.warn('Custom symbols: JSON must be an object { "bci_index": "image_url", ... }');
      return;
    }

    customSymbolCache = { url, map };
    applyCustomSymbolMap(map);
    announce('Custom symbol pictures loaded');
  } catch (err) {
    console.warn('Custom symbols: failed to load', err);
  }
}

/**
 * Apply a custom symbol mapping to all AacCard elements on the page.
 * Finds cards by data-bci attribute, swaps pictogram src.
 */
function applyCustomSymbolMap(map: Record<string, string>): void {
  document.querySelectorAll<HTMLElement>('.aac-card[data-bci]').forEach((card) => {
    const bci = card.dataset.bci;
    if (!bci || !map[bci]) return;

    const img = card.querySelector<HTMLImageElement>('.aac-card__pictogram');
    if (img) {
      img.src = map[bci];
    }
  });
}

// ===================================
// SYMBOL SET SWITCHING
// ===================================

/**
 * Swap all AAC card pictograms to a different symbol set.
 * Uses data-bci attribute to build URL: baseUrl + bciIndex + extension.
 * Saves original src in data-original-src for restore.
 */
function swapSymbolSet(baseUrl: string, extension: string): void {
  document.querySelectorAll<HTMLElement>('.aac-card[data-bci]').forEach((card) => {
    const bci = card.dataset.bci;
    if (!bci) return;

    const img = card.querySelector<HTMLImageElement>('.aac-card__pictogram');
    if (img) {
      if (!img.dataset.originalSrc) {
        img.dataset.originalSrc = img.src;
      }
      img.src = `${baseUrl}${bci}${extension}`;
    }
  });
}

/**
 * Restore all AAC card pictograms to their original (build-time) sources.
 */
function restoreOriginalSymbols(): void {
  document.querySelectorAll<HTMLElement>('.aac-card[data-bci]').forEach((card) => {
    const img = card.querySelector<HTMLImageElement>('.aac-card__pictogram');
    if (img?.dataset.originalSrc) {
      img.src = img.dataset.originalSrc;
    }
  });
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
    applySettings,
    loadCustomSymbols
  };
}
