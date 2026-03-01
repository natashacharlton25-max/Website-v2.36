/**
 * AAC Input Shim — Switch scanning + dwell-to-click
 *
 * Translates alternative input methods into standard DOM events.
 * Components never know how they were activated — a button clicked
 * by mouse, tapped by finger, selected by eye gaze, or reached by
 * switch scanning all receive the same click event.
 *
 * No component modifications needed. Reads focusable targets from
 * the DOM. Reads labels from aria-label, textContent, alt.
 *
 * Modes:
 *   'off'    — disabled (default)
 *   'switch' — auto-scan through targets, press key to select
 *   'dwell'  — hover/gaze on element for X ms to select
 *
 * Settings stored in localStorage under 'a11y-settings' alongside
 * existing accessibility preferences.
 *
 * Usage:
 *   import { initInputShim } from '../lib/aac/input-shim';
 *   initInputShim();
 */

// ── Types ──

export interface ShimSettings {
  inputMethod: 'off' | 'switch' | 'dwell';
  scanSpeed: number;    // ms between scan advances (default 1500)
  dwellTime: number;    // ms to dwell before click (default 800)
  scanKey: string;      // key to advance/select (default 'Space')
}

const DEFAULTS: ShimSettings = {
  inputMethod: 'off',
  scanSpeed: 1500,
  dwellTime: 800,
  scanKey: 'Space',
};

// ── Focusable target discovery ──

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[role="menuitem"]',
].join(', ');

function getTargets(): HTMLElement[] {
  const els = document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  // Filter to visible, non-zero-size elements
  return Array.from(els).filter((el) => {
    if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
    if (el.getAttribute('aria-hidden') === 'true' && !el.hasAttribute('tabindex')) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

// ── Get label for an element (for future audio/TTS) ──

export function getLabel(el: HTMLElement): string {
  return (
    el.getAttribute('aria-label') ||
    el.getAttribute('alt') ||
    el.getAttribute('title') ||
    el.textContent?.trim().slice(0, 80) ||
    el.tagName.toLowerCase()
  );
}

// ── On-screen keyboard trigger ──
// When the shim is active and a text input is focused,
// inject a keyboard button so the user can open the OS keyboard.

const INPUT_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea';
const KB_BTN_CLASS = 'aac-keyboard-trigger';

function injectKeyboardButtons() {
  // Only inject when shim is active
  document.querySelectorAll<HTMLElement>(INPUT_SELECTOR).forEach((input) => {
    if (input.nextElementSibling?.classList.contains(KB_BTN_CLASS)) return;

    const btn = document.createElement('button');
    btn.className = KB_BTN_CLASS;
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open on-screen keyboard');
    btn.innerHTML = '⌨';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      input.focus();
      // VirtualKeyboard API (Chrome/Edge/Android)
      if ('virtualKeyboard' in navigator) {
        (navigator as any).virtualKeyboard.show();
      }
    });

    input.insertAdjacentElement('afterend', btn);
  });
}

function removeKeyboardButtons() {
  document.querySelectorAll(`.${KB_BTN_CLASS}`).forEach((btn) => btn.remove());
}

// ── Scan highlight ring ──

const HIGHLIGHT_CLASS = 'aac-scan-highlight';

function highlightElement(el: HTMLElement | null) {
  // Remove previous highlight
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach((prev) => {
    prev.classList.remove(HIGHLIGHT_CLASS);
  });
  if (el) {
    el.classList.add(HIGHLIGHT_CLASS);
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

// ── Switch Scanner ──

let scanTimer: ReturnType<typeof setInterval> | null = null;
let scanIndex = -1;
let scanTargets: HTMLElement[] = [];
let scanActive = false;

function startScan(speed: number) {
  stopScan();
  scanTargets = getTargets();
  if (scanTargets.length === 0) return;

  scanIndex = -1;
  scanActive = true;
  document.documentElement.setAttribute('data-aac-input', 'switch');

  scanTimer = setInterval(() => {
    scanIndex = (scanIndex + 1) % scanTargets.length;
    const target = scanTargets[scanIndex];
    highlightElement(target);
    target.focus({ preventScroll: true });
  }, speed);
}

function stopScan() {
  if (scanTimer) {
    clearInterval(scanTimer);
    scanTimer = null;
  }
  scanActive = false;
  scanIndex = -1;
  highlightElement(null);
  document.documentElement.removeAttribute('data-aac-input');
}

function selectCurrent() {
  if (!scanActive || scanIndex < 0) return;
  const target = scanTargets[scanIndex];
  if (!target) return;

  // Pause scanning briefly for feedback
  if (scanTimer) clearInterval(scanTimer);

  target.click();

  // Flash the highlight for feedback
  target.classList.add('aac-scan-selected');
  setTimeout(() => {
    target.classList.remove('aac-scan-selected');
    // Refresh targets (page may have changed) and resume
    scanTargets = getTargets();
    if (scanTargets.length > 0) {
      scanIndex = Math.min(scanIndex, scanTargets.length - 1);
      const settings = loadSettings();
      scanTimer = setInterval(() => {
        scanIndex = (scanIndex + 1) % scanTargets.length;
        const next = scanTargets[scanIndex];
        highlightElement(next);
        next.focus({ preventScroll: true });
      }, settings.scanSpeed);
    }
  }, 300);
}

// ── Dwell-to-Click ──

let dwellTimer: ReturnType<typeof setTimeout> | null = null;
let dwellTarget: HTMLElement | null = null;
let dwellActive = false;

function startDwell(dwellTime: number) {
  stopDwell();
  dwellActive = true;
  document.documentElement.setAttribute('data-aac-input', 'dwell');

  document.addEventListener('mouseover', handleDwellOver);
  document.addEventListener('mouseout', handleDwellOut);
}

function stopDwell() {
  dwellActive = false;
  if (dwellTimer) {
    clearTimeout(dwellTimer);
    dwellTimer = null;
  }
  dwellTarget = null;
  highlightElement(null);
  document.removeEventListener('mouseover', handleDwellOver);
  document.removeEventListener('mouseout', handleDwellOut);
  document.documentElement.removeAttribute('data-aac-input');
}

function handleDwellOver(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest?.<HTMLElement>(FOCUSABLE_SELECTOR);
  if (!el || el === dwellTarget) return;

  // Clear previous dwell
  if (dwellTimer) clearTimeout(dwellTimer);
  highlightElement(null);

  dwellTarget = el;
  highlightElement(el);
  el.focus({ preventScroll: true });

  const settings = loadSettings();
  dwellTimer = setTimeout(() => {
    if (dwellTarget === el) {
      el.classList.add('aac-scan-selected');
      el.click();
      setTimeout(() => el.classList.remove('aac-scan-selected'), 300);
    }
  }, settings.dwellTime);
}

function handleDwellOut(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest?.<HTMLElement>(FOCUSABLE_SELECTOR);
  if (el === dwellTarget) {
    if (dwellTimer) clearTimeout(dwellTimer);
    dwellTimer = null;
    dwellTarget = null;
    highlightElement(null);
  }
}

// ── Settings ──

function loadSettings(): ShimSettings {
  try {
    const stored = JSON.parse(localStorage.getItem('a11y-settings') || '{}');
    return {
      inputMethod: stored.inputMethod || DEFAULTS.inputMethod,
      scanSpeed: stored.scanSpeed || DEFAULTS.scanSpeed,
      dwellTime: stored.dwellTime || DEFAULTS.dwellTime,
      scanKey: stored.scanKey || DEFAULTS.scanKey,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

// ── Key handler for switch mode ──

let keyHandler: ((e: KeyboardEvent) => void) | null = null;

function bindSwitchKey(scanKey: string) {
  unbindSwitchKey();
  keyHandler = (e: KeyboardEvent) => {
    if (e.code === scanKey || e.key === ' ' && scanKey === 'Space') {
      e.preventDefault();
      e.stopPropagation();
      selectCurrent();
    }
  };
  document.addEventListener('keydown', keyHandler, { capture: true });
}

function unbindSwitchKey() {
  if (keyHandler) {
    document.removeEventListener('keydown', keyHandler, { capture: true });
    keyHandler = null;
  }
}

// ── Public API ──

let initialized = false;

export function initInputShim() {
  if (initialized) return;
  initialized = true;

  const settings = loadSettings();
  applyMode(settings);

  // Listen for settings changes from the a11y panel
  window.addEventListener('a11y-settings-changed', () => {
    const updated = loadSettings();
    applyMode(updated);
  });
}

function applyMode(settings: ShimSettings) {
  // Tear down any active mode
  stopScan();
  stopDwell();
  unbindSwitchKey();
  removeKeyboardButtons();

  switch (settings.inputMethod) {
    case 'switch':
      bindSwitchKey(settings.scanKey);
      startScan(settings.scanSpeed);
      injectKeyboardButtons();
      break;
    case 'dwell':
      startDwell(settings.dwellTime);
      injectKeyboardButtons();
      break;
    case 'off':
    default:
      break;
  }
}

/** Tear down everything — for cleanup or mode switch */
export function destroyInputShim() {
  stopScan();
  stopDwell();
  unbindSwitchKey();
  initialized = false;
}

/** Programmatic mode switch (for a11y panel integration) */
export function setInputMode(mode: 'off' | 'switch' | 'dwell') {
  try {
    const stored = JSON.parse(localStorage.getItem('a11y-settings') || '{}');
    stored.inputMethod = mode;
    localStorage.setItem('a11y-settings', JSON.stringify(stored));
  } catch {}
  applyMode(loadSettings());
}
