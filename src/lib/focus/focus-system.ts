/**
 * Focus System — keyboard focus detection, visual effects, rainbow cycling
 *
 * Features (each independently toggleable via data attributes on <html>):
 *   data-focus-dim       — dim non-focused siblings
 *   data-focus-scroll    — smooth scroll focused element to centre
 *   data-focus-pulse     — brief scale animation on focus
 *   data-focus-label     — shows element type tooltip near focus ring
 *   data-focus-rainbow   — rainbow colour cycling on each tab
 *   data-focus-color-journey — GSAP colour morphing tied to scroll sections
 *   data-enhanced-focus  — double ring + thicker
 *
 * JS sets data-focus-active on the focused element (keyboard only).
 * CSS in focus-gate.css handles all visual effects.
 */

let _rainbowIndex = 0;

function initFocusSystem() {
  let lastKeyTime = 0;

  document.addEventListener('keydown', () => {
    lastKeyTime = Date.now();
  });

  // Focus label element (created once, reused)
  let focusLabel: HTMLElement | null = null;

  function getFocusLabel(): HTMLElement {
    if (!focusLabel) {
      focusLabel = document.createElement('div');
      focusLabel.className = 'focus-label';
      focusLabel.setAttribute('aria-hidden', 'true');
      document.body.appendChild(focusLabel);
    }
    return focusLabel;
  }

  function getElementLabel(el: Element): string {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role') || '';
    const label = el.getAttribute('aria-label') || '';
    const text = (el.textContent || '').trim().slice(0, 30);

    if (label) return label;
    if (tag === 'a') return text || 'Link';
    if (tag === 'button' || role === 'button') return text || 'Button';
    if (tag === 'input') return (el as HTMLInputElement).type || 'Input';
    if (tag === 'figure') return 'Image';
    return text || tag;
  }

  function showFocusLabel(el: Element) {
    const label = getFocusLabel();
    label.textContent = getElementLabel(el);
    label.style.display = 'block';

    const rect = el.getBoundingClientRect();
    label.style.top = `${rect.top + window.scrollY - 28}px`;
    label.style.left = `${rect.left + window.scrollX}px`;
  }

  function hideFocusLabel() {
    if (focusLabel) focusLabel.style.display = 'none';
  }

  document.addEventListener('focusin', (e) => {
    // Only activate if focus came from keyboard (within 100ms of a keypress)
    if (Date.now() - lastKeyTime > 100) return;
    const el = (e.target as HTMLElement).closest('[tabindex], button, a, [role="button"]');
    // Don't activate focus system on a11y panel/page controls
    if (el && !el.closest('#a11y-page, #a11y-panel, .a11y-panel')) {
      el.setAttribute('data-focus-active', '');
      (el as HTMLElement).style.zIndex = '99999';
      (el as HTMLElement).style.position = 'relative';
      el.classList.add('focus-entering');

      // Rainbow: cycle through colours on each tab
      if (document.documentElement.hasAttribute('data-focus-rainbow')) {
        _rainbowIndex = (_rainbowIndex + 1) % 7;
        const angle = _rainbowIndex * (360 / 7);
        (el as HTMLElement).style.setProperty('--focus-angle', `${angle}deg`);

        const rainbowBase = ['--rainbow-1', '--rainbow-2', '--rainbow-3', '--rainbow-4', '--rainbow-5', '--rainbow-6', '--rainbow-7'];
        const rainbowWash = ['--rainbow-1-wash', '--rainbow-2-wash', '--rainbow-3-wash', '--rainbow-4-wash', '--rainbow-5-wash', '--rainbow-6-wash', '--rainbow-7-wash'];
        const rainbowLight = ['--rainbow-1-light', '--rainbow-2-light', '--rainbow-3-light', '--rainbow-4-light', '--rainbow-5-light', '--rainbow-6-light', '--rainbow-7-light'];
        const rainbowDark = ['--rainbow-1-dark', '--rainbow-2-dark', '--rainbow-3-dark', '--rainbow-4-dark', '--rainbow-5-dark', '--rainbow-6-dark', '--rainbow-7-dark'];
        const idx = _rainbowIndex;
        const complementIdx = (idx + 3) % 7;

        // Mode-aware token selection
        const isDark = document.body.dataset.mode === 'dark';
        const isHC = document.documentElement.hasAttribute('data-high-contrast');
        const styles = getComputedStyle(document.body);

        // Ring: HC uses light (bright on dark bg), dark uses dark, light uses base
        const ringTokens = isHC ? rainbowLight : (isDark ? rainbowDark : rainbowBase);
        // Bg: always wash (flips automatically in dark mode CSS)
        const bgTokens = rainbowWash;

        const ringColor = styles.getPropertyValue(ringTokens[idx]).trim();
        const bgColor = styles.getPropertyValue(bgTokens[idx]).trim();
        const complementColor = styles.getPropertyValue(ringTokens[complementIdx]).trim();

        if (ringColor) {
          document.documentElement.style.setProperty('--focus-color', ringColor);
        }
        if (complementColor && document.documentElement.hasAttribute('data-rainbow-highlight')) {
          document.documentElement.style.setProperty('--highlight-link-color', complementColor);
        }

        // Tint page bg + overlay with rainbow
        if (document.documentElement.hasAttribute('data-focus-dim')) {
          if (bgColor) {
            document.documentElement.style.setProperty('--page-bg', bgColor);
            const overlay = document.querySelector('.focus-dim-overlay') as HTMLElement;
            if (overlay) {
              const baseColor = styles.getPropertyValue(rainbowBase[idx]).trim();
              overlay.style.transition = 'background-color 0.3s ease-out';
              overlay.style.backgroundColor = baseColor;
              overlay.style.opacity = '0.25';
            }
          }
        }
      }

      el.addEventListener('animationend', () => {
        el.classList.remove('focus-entering');
      }, { once: true });

      // Scroll to centre
      if (document.documentElement.hasAttribute('data-focus-scroll')) {
        const osViewport = document.querySelector('[data-overlayscrollbars-viewport]');
        const scroller = osViewport || document.documentElement;
        const rect = el.getBoundingClientRect();
        const scrollerRect = scroller.getBoundingClientRect();
        const targetY = scroller.scrollTop + rect.top - scrollerRect.top - (scrollerRect.height / 2) + (rect.height / 2);

        const gsap = (window as any).gsap;
        if (gsap) {
          gsap.to(scroller, {
            scrollTop: targetY,
            duration: 0.35,
            ease: 'power3.out',
          });
        } else {
          scroller.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }

      // Focus label
      if (document.documentElement.hasAttribute('data-focus-label')) {
        showFocusLabel(el);
      }

      // Colour journey: three synchronised tweens
      if (document.documentElement.hasAttribute('data-focus-color-journey')) {
        const section = el.closest('[data-scroll-bg]');
        if (section) {
          const rawBg = (section as HTMLElement).dataset.scrollBg || '';
          const probe = document.createElement('div');
          probe.style.color = rawBg;
          document.body.appendChild(probe);
          const resolved = getComputedStyle(probe).color;
          probe.remove();

          const gsap = (window as any).gsap;
          if (gsap && resolved) {
            const wrapper = document.getElementById('a11y-content-wrapper');
            if (wrapper) {
              gsap.to(wrapper, { backgroundColor: resolved, duration: 0.6, ease: 'power2.out' });
            }
            gsap.to(document.documentElement, { '--focus-color': resolved, duration: 0.4, ease: 'power2.out' });
            gsap.to(document.documentElement, { '--glow-spread': `0 0 30px ${resolved}, 0 0 60px ${resolved}`, duration: 0.5, ease: 'power2.out' });
          }
        }
      }
    }
  });

  document.addEventListener('focusout', (e) => {
    const el = (e.target as HTMLElement).closest('[data-focus-active]') as HTMLElement | null;
    if (el) {
      el.style.transition = 'none';
      el.style.zIndex = '';
      el.style.position = '';
      el.classList.remove('focus-entering');
      el.removeAttribute('data-focus-active');
      requestAnimationFrame(() => { el.style.transition = ''; });
    }
    // Reset page bg + overlay
    if (document.documentElement.hasAttribute('data-focus-dim')) {
      document.documentElement.style.removeProperty('--page-bg');
      const overlay = document.querySelector('.focus-dim-overlay') as HTMLElement;
      if (overlay) {
        overlay.style.transition = 'background-color 0.2s ease-out, opacity 0.2s ease-out';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        overlay.style.opacity = '0';
      }
    }
    hideFocusLabel();
  });
}

// Init
initFocusSystem();
document.addEventListener('astro:page-load', initFocusSystem);
