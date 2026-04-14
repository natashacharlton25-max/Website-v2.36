/**
 * a11y-modal.ts — Test controls modal (every page via BaseLayout)
 *
 * Plain toggle buttons for themes, settings, alt text, display modes,
 * cognitive levels, content AAC.
 */

import {
  type A11ySettings,
  defaultSettings,
  getSettings,
  saveSettings,
  applySettings,
  initKeyboardDetection
} from './a11y-panel';

function setActive(btn: HTMLElement, active: boolean): void {
  btn.style.background = active ? '#4f4' : '#222';
  btn.style.color = active ? '#000' : '#eee';
  btn.style.borderColor = active ? '#4f4' : '#999';
}

function initModal(): void {
  const panel = document.getElementById('a11y-panel');
  if (!panel) return;

  const trigger = document.querySelector('.a11y-panel-trigger');
  const backdrop = document.querySelector('.a11y-panel__backdrop');
  const closeBtn = panel.querySelector('.a11y-panel__close');

  if (!backdrop) return;

  let settings = getSettings();
  applySettings(settings);

  // ── Sync button states ──

  function syncUI(): void {
    // Theme buttons
    panel!.querySelectorAll<HTMLElement>('[data-test-theme]').forEach(b => {
      setActive(b, b.dataset.testTheme === settings.theme);
    });

    // Toggle buttons
    panel!.querySelectorAll<HTMLElement>('[data-test-toggle]').forEach(b => {
      const key = b.dataset.testToggle!;
      const active = key === 'xlText'
        ? settings.fontSize >= 150
        : (settings as any)[key] === true;
      setActive(b, active);
    });

    // Animation explainer — how to show
    panel!.querySelectorAll<HTMLElement>('[data-test-animexplainer]').forEach(b => {
      setActive(b, b.dataset.testAnimexplainer === settings.animExplainer);
    });

    // Animation explainer — what to show
    panel!.querySelectorAll<HTMLElement>('[data-test-animseq]').forEach(b => {
      setActive(b, b.dataset.testAnimseq === settings.animSeqMode);
    });

    // Alt text mode buttons (what to show)
    panel!.querySelectorAll<HTMLElement>('[data-test-alt]').forEach(b => {
      setActive(b, b.dataset.testAlt === settings.altTextMode);
    });

    // Alt display mode buttons (how to show)
    panel!.querySelectorAll<HTMLElement>('[data-test-display]').forEach(b => {
      setActive(b, b.dataset.testDisplay === settings.altDisplayMode);
    });

    // Cognitive level buttons
    panel!.querySelectorAll<HTMLElement>('[data-test-cognitive]').forEach(b => {
      setActive(b, b.dataset.testCognitive === settings.cognitiveLevel);
    });

    // Hover mode buttons
    panel!.querySelectorAll<HTMLElement>('[data-test-hover]').forEach(b => {
      setActive(b, b.dataset.testHover === settings.hoverMode);
    });

    // Motion mode buttons
    panel!.querySelectorAll<HTMLElement>('[data-test-motion]').forEach(b => {
      setActive(b, b.dataset.testMotion === settings.motionMode);
    });

    // Symbol set buttons
    panel!.querySelectorAll<HTMLElement>('[data-test-symbolset]').forEach(b => {
      setActive(b, b.dataset.testSymbolset === settings.symbolSet);
    });

    // AAC filter buttons
    panel!.querySelectorAll<HTMLElement>('[data-test-aacfilter]').forEach(b => {
      setActive(b, b.dataset.testAacfilter === settings.aacFilter);
    });
  }

  // ── Open / Close ──

  function openPanel(): void {
    if (!panel) return;
    panel.classList.add('is-open');
    backdrop!.classList.add('is-visible');
    trigger?.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
    backdrop!.removeAttribute('hidden');

    settings = getSettings();
    syncUI();

    const firstBtn = panel.querySelector('button:not(.a11y-panel__close)') as HTMLElement;
    firstBtn?.focus();
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

  // ── Theme buttons ──

  panel.querySelectorAll<HTMLElement>('[data-test-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.theme = btn.dataset.testTheme!;
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Toggle buttons ──

  panel.querySelectorAll<HTMLElement>('[data-test-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.testToggle!;
      if (key === 'xlText') {
        settings.fontSize = settings.fontSize >= 150 ? 100 : 150;
      } else {
        (settings as any)[key] = !(settings as any)[key];
      }
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Alt text mode buttons (what to show) ──

  panel.querySelectorAll<HTMLElement>('[data-test-alt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.testAlt as A11ySettings['altTextMode'];
      settings.altTextMode = mode;
      // Auto-set display to subtitle if turning on, hidden if turning off
      if (mode === 'none') {
        settings.altDisplayMode = 'hidden';
      } else if (settings.altDisplayMode === 'hidden') {
        settings.altDisplayMode = 'subtitle';
      }
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Alt display mode buttons (how to show) ──

  panel.querySelectorAll<HTMLElement>('[data-test-display]').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.altDisplayMode = btn.dataset.testDisplay as A11ySettings['altDisplayMode'];
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Cognitive level buttons ──

  panel.querySelectorAll<HTMLElement>('[data-test-cognitive]').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.cognitiveLevel = btn.dataset.testCognitive as A11ySettings['cognitiveLevel'];
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Hover mode buttons ──

  panel.querySelectorAll<HTMLElement>('[data-test-hover]').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.hoverMode = btn.dataset.testHover as A11ySettings['hoverMode'];
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Motion mode buttons ──

  panel.querySelectorAll<HTMLElement>('[data-test-motion]').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.motionMode = btn.dataset.testMotion as A11ySettings['motionMode'];
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Symbol set buttons ──

  panel.querySelectorAll<HTMLElement>('[data-test-symbolset]').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.symbolSet = btn.dataset.testSymbolset as A11ySettings['symbolSet'];
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── AAC filter buttons ──

  panel.querySelectorAll<HTMLElement>('[data-test-aacfilter]').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.aacFilter = btn.dataset.testAacfilter as A11ySettings['aacFilter'];
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Animation explainer — how to show ──

  panel.querySelectorAll<HTMLElement>('[data-test-animexplainer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const newMode = btn.dataset.testAnimexplainer as A11ySettings['animExplainer'];
      const oldMode = settings.animExplainer;
      settings.animExplainer = newMode;
      saveSettings(settings);
      // Inline mode mutates DOM (moves explainers, hides icons).
      // Switching to/from inline requires reload to restore DOM.
      if (oldMode === 'inline' || newMode === 'inline') {
        location.reload();
        return;
      }
      applySettings(settings);
      syncUI();
    });
  });

  // ── Animation explainer — what to show ──

  panel.querySelectorAll<HTMLElement>('[data-test-animseq]').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.animSeqMode = btn.dataset.testAnimseq as A11ySettings['animSeqMode'];
      saveSettings(settings);
      applySettings(settings);
      syncUI();
    });
  });

  // ── Reset ──

  const resetBtn = document.getElementById('a11y-reset');
  resetBtn?.addEventListener('click', () => {
    settings = { ...defaultSettings };
    saveSettings(settings);
    applySettings(settings);
    syncUI();
  });

  // Initial sync
  syncUI();
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
