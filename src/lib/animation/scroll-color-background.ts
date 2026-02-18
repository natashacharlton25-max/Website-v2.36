/**
 * Scroll Color Background - IntersectionObserver-powered color transitions
 *
 * Creates smooth background color transitions as sections enter the viewport.
 * Uses IntersectionObserver instead of GSAP ScrollTrigger — works natively
 * with any scroll container including OverlayScrollbars.
 *
 * CRITICAL ARCHITECTURE:
 * - ScrollMorphZone has its own background-color (var(--zone-bg)). We MUST
 *   animate the zone element directly — not body — otherwise the zone's
 *   opaque bg covers whatever we animate underneath.
 * - For non-zone pages (plain sections with data-scroll-bg on body), we
 *   animate #a11y-content-wrapper or body as before.
 *
 * THEME AWARENESS:
 * - Section data-scroll-bg stores RAW CSS variable strings like
 *   "var(--zone-bg-primary-deep)". Resolved to RGB only at animation time.
 * - On theme switch: NO teardown. Observer keeps running. We clear the
 *   resolved-colour cache and instantly snap to the current section's
 *   new palette colour. No flash, no jump.
 * - Does NOT bail on theme class changes — only on reduce-motion / text-only.
 *
 * Features:
 * - Lazy color resolution (at animation time, not init)
 * - Smooth bidirectional scrolling (tracks most-visible section)
 * - Kills previous tweens to prevent conflicts
 * - Instant re-resolve on theme change (no flash)
 * - Supports Astro View Transitions (astro:page-load)
 */

import { gsap } from 'gsap';

/* ── A11y: only disable for motion/text modes, NOT theme switches ── */

const DISABLE_CLASSES = ['a11y-reduce-motion', 'a11y-text-only'];

function isDisabled(): boolean {
  const wrapper = document.getElementById('a11y-content-wrapper');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (wrapper && DISABLE_CLASSES.some(cls => wrapper.classList.contains(cls))) return true;
  return false;
}


/* ── Color resolution — lazy, at animation time ── */

let _probe: HTMLElement | null = null;
function getProbe(): HTMLElement {
  if (!_probe) {
    _probe = document.createElement('div');
    _probe.style.display = 'none';
    document.body.appendChild(_probe);
  }
  return _probe;
}

/**
 * Resolve a colour value RIGHT NOW from live computed styles.
 * Handles: hex, rgb, var(--token), color-mix(), oklch(), etc.
 *
 * MUST be called at animation time (inside observer callback),
 * never cached at init — this is what makes theme switches work.
 */
function resolveColor(value: string, el?: Element): string {
  if (!value) return '';
  if (!value.startsWith('var(')) return toRGB(value);

  const match = value.match(/var\(\s*(--[^,)]+)/);
  if (!match) return value;

  const target = el || document.documentElement;
  const raw = getComputedStyle(target).getPropertyValue(match[1]).trim();
  if (!raw) return value;

  if (raw.startsWith('#') || raw.startsWith('rgb')) return raw;
  return toRGB(raw);
}

function toRGB(color: string): string {
  const probe = getProbe();
  probe.style.backgroundColor = color;
  const computed = getComputedStyle(probe).backgroundColor;
  probe.style.backgroundColor = '';
  return computed || color;
}


/* ── Module state ── */

let activeObserver: IntersectionObserver | null = null;
let currentTarget: HTMLElement | null = null;

/** Exposed so theme change handler can force re-resolve without teardown */
let _refreshColors: (() => void) | null = null;


/**
 * Determine the correct animation target:
 * - Inside .scroll-morph-zone → animate the zone (it has its own bg)
 * - Otherwise → #a11y-content-wrapper or body
 */
function findTarget(sections: NodeListOf<HTMLElement>): HTMLElement {
  const zone = sections[0]?.closest<HTMLElement>('.scroll-morph-zone');
  if (zone) return zone;
  return document.getElementById('a11y-content-wrapper') || document.body;
}


/**
 * Full teardown — only for page navigation / View Transitions.
 * NOT used for theme changes (that would cause flash).
 */
function cleanup(): void {
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }
  if (currentTarget) {
    gsap.killTweensOf(currentTarget);
    currentTarget.style.removeProperty('background-color');
    currentTarget = null;
  }
  _refreshColors = null;
}


/**
 * Initialize scroll-triggered background color changes.
 */
function initScrollColors(): void {
  if (isDisabled()) return;

  const sections = document.querySelectorAll<HTMLElement>('[data-scroll-bg]');
  if (sections.length === 0) return;

  // Full cleanup for fresh init (page load / View Transitions)
  cleanup();

  const target = findTarget(sections);
  currentTarget = target;

  // Build section data with RAW attribute values (not pre-resolved!)
  const sectionData = Array.from(sections).map((section, index) => ({
    section,
    rawBg: section.getAttribute('data-scroll-bg') || '',
    index,
  }));

  const osViewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]');

  // Resolve palette vars from the zone element (where ZonePalette.css tokens cascade)
  const paletteEl = sections[0]?.closest('.scroll-morph-zone') || target;

  // Comparison cache — stores RESOLVED rgb value.
  // Prevents animating to the same colour repeatedly during scroll.
  // Cleared on theme change to force re-resolve against new palette.
  let currentBgResolved = '';

  const visibilityMap = new Map<HTMLElement, number>();

  /**
   * Animate background to new colour.
   * Icon colour is owned by pattern-morph.ts — not driven here.
   * @param instant - true = snap immediately (theme change), false = smooth scroll
   */
  function animateTo(rawBg: string, instant = false): void {
    const bgColor = resolveColor(rawBg, paletteEl);

    if (bgColor === currentBgResolved) return;

    gsap.killTweensOf(target);

    if (instant) {
      gsap.set(target, { backgroundColor: bgColor });
    } else {
      gsap.to(target, { backgroundColor: bgColor, duration: 0.8, ease: 'power2.inOut' });
    }

    currentBgResolved = bgColor;
  }

  /**
   * Find most-visible section and animate to its colour.
   */
  function updateActiveSection(instant = false): void {
    let bestRatio = 0;
    let bestData = sectionData[0];

    sectionData.forEach((data) => {
      const ratio = visibilityMap.get(data.section) || 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestData = data;
      } else if (ratio === bestRatio && ratio > 0 && data.index > bestData.index) {
        bestData = data;
      }
    });

    if (bestRatio > 0) {
      animateTo(bestData.rawBg, instant);
    } else {
      animateTo('var(--brand-c-bg)', instant);
    }
  }

  /**
   * Theme change refresh — NO teardown.
   * Clear resolved cache so the same raw var re-resolves to new theme values.
   * Instantly snap to current section's new colour — no flash.
   */
  function refreshForTheme(): void {
    currentBgResolved = '';
    updateActiveSection(true);  // instant snap
  }

  // Expose for theme change handler
  _refreshColors = refreshForTheme;

  // Set initial state from first section
  const initialBg = resolveColor(sectionData[0]?.rawBg || 'var(--brand-c-bg)', paletteEl);
  target.style.backgroundColor = initialBg;
  currentBgResolved = initialBg;

  // Create observer
  activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibilityMap.set(entry.target as HTMLElement, entry.intersectionRatio);
      });
      updateActiveSection(false);  // smooth scroll transition
    },
    {
      root: osViewport || null,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    },
  );

  sectionData.forEach(({ section }) => {
    activeObserver!.observe(section);
  });
}


/* ── Theme change listener ── */

/**
 * On theme switch: keep observer running, just re-resolve colours.
 * The 150ms delay lets the new theme CSS fully compute.
 * refreshForTheme() clears the cache and snaps instantly — no flash.
 */
function onThemeChanged(): void {
  setTimeout(() => {
    if (_refreshColors) {
      // Observer still running — just re-resolve current section
      _refreshColors();
    } else {
      // No active instance (e.g. was disabled) — try full init
      initScrollColors();
    }
  }, 150);
}


/* ── Setup ── */

function setup(): void {
  setTimeout(initScrollColors, 300);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}

// Re-resolve on theme change — NO teardown, instant snap
window.addEventListener('themeChanged', onThemeChanged);

// Full re-init on page navigation (Astro View Transitions)
document.addEventListener('astro:page-load', () => {
  cleanup();
  setup();
});
