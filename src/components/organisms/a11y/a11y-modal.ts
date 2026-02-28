/**
 * a11y-modal.ts — Modal panel script (every page via BaseLayout)
 *
 * Quick-access controls: presets, themes, reset, open/close.
 * Full settings live on /accessibility (a11y-page.ts).
 */

import {
  type A11ySettings,
  defaultSettings,
  getSettings,
  saveSettings,
  announce,
  applySettings,
  updateUI,
  handlePresetClick,
  initKeyboardDetection
} from './a11y-panel';

function initModal(): void {
  const panel = document.getElementById('a11y-panel');
  if (!panel) return;

  const trigger = document.querySelector('.a11y-panel-trigger');
  const backdrop = document.querySelector('.a11y-panel__backdrop');
  const closeBtn = panel.querySelector('.a11y-panel__close');
  const themeList = panel.querySelector('.a11y-theme-list');

  if (!backdrop) return;

  let settings = getSettings();
  applySettings(settings);
  updateUI(panel, settings);

  // ── Open / Close ──

  function openPanel(): void {
    if (!panel) return;
    panel.classList.add('is-open');
    backdrop!.classList.add('is-visible');
    trigger?.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
    backdrop!.removeAttribute('hidden');

    // Re-sync UI in case settings changed on /accessibility page
    settings = getSettings();
    updateUI(panel, settings);

    const firstInput = panel.querySelector('input, button:not(.a11y-panel__close)') as HTMLElement;
    firstInput?.focus();

    if (settings.screenReaderMode) {
      announce('Accessibility panel opened');
    }
  }

  function closePanel(): void {
    if (!panel) return;
    panel.classList.remove('is-open');
    backdrop!.classList.remove('is-visible');
    trigger?.setAttribute('aria-expanded', 'false');

    setTimeout(() => {
      panel.setAttribute('hidden', '');
      backdrop!.setAttribute('hidden', '');
    }, 300);

    if (trigger) {
      (trigger as HTMLElement).focus();
    } else {
      const externalTrigger = document.querySelector('[data-action="accessibility"]') as HTMLElement;
      externalTrigger?.focus();
    }

    if (settings.screenReaderMode) {
      announce('Accessibility panel closed');
    }
  }

  if (trigger) {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closePanel(); else openPanel();
    });
  }

  closeBtn?.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel();
    }
  });

  // ── Theme cards ──

  themeList?.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.a11y-theme-card') as HTMLButtonElement;
    if (!btn) return;

    const theme = btn.dataset.theme || 'default';
    settings.theme = theme;
    saveSettings(settings);
    applySettings(settings);

    themeList.querySelectorAll('.a11y-theme-card').forEach(b => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');

    if (settings.screenReaderMode) {
      announce(`Color theme changed to ${theme}`);
    }
  });

  // ── Reset button ──

  const resetBtn = document.getElementById('a11y-reset');
  resetBtn?.addEventListener('click', () => {
    settings = { ...defaultSettings };
    saveSettings(settings);
    applySettings(settings);
    updateUI(panel, settings);

    document.querySelectorAll('.a11y-preset-btn').forEach(btn => btn.classList.remove('active'));

    if (settings.screenReaderMode) {
      announce('All accessibility settings reset to defaults');
    }
  });

  // ── Preset buttons ──

  const presetButtons = panel.querySelectorAll('.a11y-preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset') as string;
      settings = handlePresetClick(panel, settings, preset, btn);
    });
  });

  // Restore easyread active state
  if (settings.textOnly) {
    const easyReadBtn = panel.querySelector('.a11y-preset-btn[data-preset="easyread"]');
    easyReadBtn?.classList.add('active');
  }

  // ── PDF Download ──

  const downloadBtn = document.getElementById('a11y-download-pdf');
  downloadBtn?.addEventListener('click', () => {
    const wrapper = document.getElementById('a11y-content-wrapper');
    const savedClasses = wrapper?.className || '';
    const savedTheme = (window as any).themeSwitcher?.currentTheme || null;

    wrapper?.classList.add('a11y-text-only', 'a11y-theme-monochrome');
    (window as any).themeSwitcher?.switchTheme('a11y-monochrome');

    const doPrint = (): void => {
      window.print();
      if (wrapper) wrapper.className = savedClasses;
      if (savedTheme) {
        (window as any).themeSwitcher?.switchTheme(savedTheme);
      } else {
        (window as any).themeSwitcher?.switchTheme('default');
      }
    };

    closePanel();
    setTimeout(doPrint, 350);
  });
}

// ── Init ──

function init(): void {
  initModal();
  initKeyboardDetection();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

document.addEventListener('astro:page-load', init);
