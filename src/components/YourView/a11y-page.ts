/**
 * a11y-page.ts — Full settings page script (/accessibility)
 *
 * All controls: toggles, steppers, fonts, alt text, themes, presets, reset.
 * Quick-access modal lives in a11y-modal.ts.
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

function initPage(): void {
  const page = document.getElementById('a11y-page');
  if (!page) return;

  let settings = getSettings();
  applySettings(settings);
  updateUI(page, settings);

  // ── Toggle cards ──

  const toggleCards = page.querySelectorAll('.a11y-toggle-card');
  toggleCards.forEach(card => {
    const setting = card.getAttribute('data-setting') as keyof A11ySettings;
    if (!setting) return;

    card.addEventListener('click', () => {
      const isPressed = card.getAttribute('aria-pressed') === 'true';
      const newValue = !isPressed;

      card.setAttribute('aria-pressed', newValue ? 'true' : 'false');
      (settings as any)[setting] = newValue;

      // Screen reader mode auto-enables companion settings
      if (setting === 'screenReaderMode' && newValue) {
        const companions = ['reduceMotion', 'highlightLinks', 'enhancedFocus'] as const;
        companions.forEach(comp => {
          (settings as any)[comp] = true;
          const companionCard = page.querySelector(`.a11y-toggle-card[data-setting="${comp}"]`);
          if (companionCard) companionCard.setAttribute('aria-pressed', 'true');
        });
      }

      saveSettings(settings);
      applySettings(settings);

      if (settings.screenReaderMode) {
        const label = card.querySelector('.a11y-toggle-card__label')?.textContent;
        announce(`${label} ${newValue ? 'enabled' : 'disabled'}`);
      }
    });
  });

  // ── Steppers ──

  const steppers = page.querySelectorAll('.a11y-stepper');
  steppers.forEach(stepper => {
    const setting = stepper.getAttribute('data-setting') as keyof A11ySettings;
    const min = parseInt(stepper.getAttribute('data-min') || '0', 10);
    const max = parseInt(stepper.getAttribute('data-max') || '100', 10);
    const step = parseInt(stepper.getAttribute('data-step') || '1', 10);
    const hiddenInput = stepper.querySelector('input[type="hidden"]') as HTMLInputElement;
    const valueEl = stepper.querySelector('.a11y-stepper__value') as HTMLElement;
    const unit = valueEl?.getAttribute('data-unit') || '';
    const minusBtn = stepper.querySelector('[data-action="decrement"]') as HTMLButtonElement;
    const plusBtn = stepper.querySelector('[data-action="increment"]') as HTMLButtonElement;

    function updateStepperUI(value: number): void {
      if (hiddenInput) hiddenInput.value = value.toString();
      if (valueEl) valueEl.textContent = `${value}${unit}`;
      if (minusBtn) minusBtn.disabled = value <= min;
      if (plusBtn) plusBtn.disabled = value >= max;
    }

    // Initialize button states
    updateStepperUI((settings as any)[setting] || min);

    minusBtn?.addEventListener('click', () => {
      const currentValue = (settings as any)[setting] || min;
      const newValue = Math.max(min, currentValue - step);
      (settings as any)[setting] = newValue;
      saveSettings(settings);
      applySettings(settings);
      updateStepperUI(newValue);

      if (settings.screenReaderMode) {
        const label = stepper.querySelector('.a11y-stepper__label')?.textContent;
        announce(`${label} decreased to ${newValue}${unit}`);
      }
    });

    plusBtn?.addEventListener('click', () => {
      const currentValue = (settings as any)[setting] || min;
      const newValue = Math.min(max, currentValue + step);
      (settings as any)[setting] = newValue;
      saveSettings(settings);
      applySettings(settings);
      updateStepperUI(newValue);

      if (settings.screenReaderMode) {
        const label = stepper.querySelector('.a11y-stepper__label')?.textContent;
        announce(`${label} increased to ${newValue}${unit}`);
      }
    });
  });

  // ── Font cards ──

  const fontGrid = page.querySelector('.a11y-font-grid');
  fontGrid?.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.a11y-font-card') as HTMLButtonElement;
    if (!card) return;

    const value = card.dataset.font || 'default';
    const label = card.querySelector('.a11y-font-card__label')?.textContent || 'Default';

    fontGrid.querySelectorAll('.a11y-font-card').forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
    });
    card.setAttribute('aria-pressed', 'true');

    settings.fontFamily = value;
    saveSettings(settings);
    applySettings(settings);

    if (settings.screenReaderMode) {
      announce(`Font changed to ${label}`);
    }
  });

  // ── Alt text cards (what to show) ──

  const altTextGrid = page.querySelector('[data-setting="altTextMode"]');
  altTextGrid?.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.a11y-alttext-card') as HTMLButtonElement;
    if (!card) return;

    const value = card.dataset.alttext || 'none';
    const label = card.querySelector('.a11y-alttext-card__label')?.textContent || 'Off';

    altTextGrid.querySelectorAll('.a11y-alttext-card').forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
    });
    card.setAttribute('aria-pressed', 'true');

    settings.altTextMode = value as A11ySettings['altTextMode'];
    saveSettings(settings);
    applySettings(settings);

    if (settings.screenReaderMode) {
      announce(`Image text mode changed to ${label}`);
    }
  });

  // ── Alt display mode cards (how to show) ──

  const altDisplayGrid = page.querySelector('[data-setting="altDisplayMode"]');
  altDisplayGrid?.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.a11y-alttext-card') as HTMLButtonElement;
    if (!card) return;

    const value = card.dataset.alttext || 'hidden';
    const label = card.querySelector('.a11y-alttext-card__label')?.textContent || 'Hidden';

    altDisplayGrid.querySelectorAll('.a11y-alttext-card').forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
    });
    card.setAttribute('aria-pressed', 'true');

    settings.altDisplayMode = value as A11ySettings['altDisplayMode'];
    saveSettings(settings);
    applySettings(settings);

    if (settings.screenReaderMode) {
      announce(`Image display mode changed to ${label}`);
    }
  });

  // ── Cognitive level cards (vocabulary depth) ──

  const cogLevelGrid = page.querySelector('[data-setting="cognitiveLevel"]');
  cogLevelGrid?.addEventListener('click', (e) => {
    const card = (e.target as HTMLElement).closest('.a11y-alttext-card') as HTMLButtonElement;
    if (!card) return;

    const value = card.dataset.alttext || 'full';
    const label = card.querySelector('.a11y-alttext-card__label')?.textContent || 'Full';

    cogLevelGrid.querySelectorAll('.a11y-alttext-card').forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
    });
    card.setAttribute('aria-pressed', 'true');

    settings.cognitiveLevel = value as A11ySettings['cognitiveLevel'];
    saveSettings(settings);
    applySettings(settings);

    if (settings.screenReaderMode) {
      announce(`Vocabulary level changed to ${label}`);
    }
  });

  // ── Theme cards ──

  const themeList = page.querySelector('.a11y-theme-list');
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

  const resetBtn = page.querySelector('#a11y-reset');
  resetBtn?.addEventListener('click', () => {
    settings = { ...defaultSettings };
    saveSettings(settings);
    applySettings(settings);
    updateUI(page, settings);

    page.querySelectorAll('.a11y-preset-btn').forEach(btn => btn.classList.remove('active'));

    if (settings.screenReaderMode) {
      announce('All accessibility settings reset to defaults');
    }
  });

  // ── Preset buttons ──

  const presetButtons = page.querySelectorAll('.a11y-preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset') as string;
      settings = handlePresetClick(page, settings, preset, btn);
    });
  });

  // Restore easyread active state
  if (settings.textOnly) {
    const easyReadBtn = page.querySelector('.a11y-preset-btn[data-preset="easyread"]');
    easyReadBtn?.classList.add('active');
  }
}

// ── Init ──

function initHoverGateButtons(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-set-hover]');
  if (!buttons.length) return;

  // Set initial active state from saved settings
  const currentMode = getSettings().hoverMode || 'full';
  buttons.forEach((b) => {
    b.classList.toggle('btn--primary', b.dataset.setHover === currentMode);
    b.classList.toggle('btn--outline', b.dataset.setHover !== currentMode);
  });

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.setHover! as 'none' | 'instant' | 'gentle' | 'full';
      // Save to settings — persists across pages
      const settings = getSettings();
      settings.hoverMode = mode;
      saveSettings(settings);
      applySettings(settings);

      buttons.forEach((b) => {
        b.classList.toggle('btn--primary', b.dataset.setHover === mode);
        b.classList.toggle('btn--outline', b.dataset.setHover !== mode);
      });
    });
  });
}

// ── My Presets — save/load/clear slots ──

function initPresetSlots(): void {
  const slots = document.querySelectorAll<HTMLElement>('[data-save-slot]');

  slots.forEach(slot => {
    const slotNum = slot.dataset.saveSlot;
    if (!slotNum) return;

    const key = `a11y-preset-${slotNum}`;
    const nameInput = slot.querySelector<HTMLInputElement>('.a11y-save-slot__name');
    const saveBtn = slot.querySelector<HTMLButtonElement>('.a11y-save-slot__save');
    const clearBtn = slot.querySelector<HTMLButtonElement>('.a11y-save-slot__clear');
    const statusEl = slot.querySelector<HTMLElement>('.a11y-save-slot__status');

    // Load existing preset
    function loadSlotUI() {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const preset = JSON.parse(saved);
          if (nameInput) nameInput.value = preset.name || `Preset ${slotNum}`;
          if (statusEl) statusEl.textContent = 'Saved';
          if (clearBtn) clearBtn.style.display = '';
          slot.classList.add('a11y-save-slot--saved');
          slot.classList.remove('a11y-save-slot--empty');
        } catch { /* ignore */ }
      } else {
        if (nameInput) nameInput.value = '';
        if (statusEl) statusEl.textContent = 'Empty';
        if (clearBtn) clearBtn.style.display = 'none';
        slot.classList.remove('a11y-save-slot--saved');
        slot.classList.add('a11y-save-slot--empty');
      }
    }

    loadSlotUI();

    // Save current settings
    saveBtn?.addEventListener('click', () => {
      const settings = getSettings();
      const name = nameInput?.value.trim() || `Preset ${slotNum}`;
      const preset = { name, settings };
      localStorage.setItem(key, JSON.stringify(preset));
      if (nameInput && !nameInput.value.trim()) nameInput.value = name;
      loadSlotUI();
      announce(`Saved as ${name}`);
    });

    // Clear slot
    clearBtn?.addEventListener('click', () => {
      localStorage.removeItem(key);
      loadSlotUI();
      announce(`Preset ${slotNum} cleared`);
    });
  });

  // Expose for nav preset slots
  (window as any).__a11yPanel = { applySettings, saveSettings };
}

function init(): void {
  initPage();
  initKeyboardDetection();
  initHoverGateButtons();
  initPresetSlots();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

document.addEventListener('astro:page-load', init);
