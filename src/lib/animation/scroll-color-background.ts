/**
 * Scroll Color Background - IntersectionObserver-powered color transitions
 *
 * Creates smooth background color transitions as sections enter the viewport.
 * Uses IntersectionObserver instead of GSAP ScrollTrigger — works natively
 * with any scroll container including OverlayScrollbars.
 *
 * Features:
 * - Resolves CSS variables and OKLCH colors to RGB for GSAP
 * - Respects a11y settings (disables when active)
 * - Smooth bidirectional scrolling (tracks most-visible section)
 * - Kills previous tweens to prevent conflicts
 * - Supports Astro View Transitions (astro:page-load)
 */

import { gsap } from 'gsap';

// A11y classes that should disable scroll color changes
const a11yClasses = [
  'a11y-reduce-motion', 'a11y-text-only', 'a11y-theme-dark', 'a11y-theme-cream',
  'a11y-theme-high-contrast', 'a11y-theme-protanopia', 'a11y-theme-deuteranopia',
  'a11y-theme-tritanopia', 'a11y-theme-monochrome'
];

/**
 * Convert any color (including OKLCH) to RGB
 */
function toRGB(color: string): string {
  const temp = document.createElement('div');
  temp.style.backgroundColor = color;
  temp.style.display = 'none';
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).backgroundColor;
  document.body.removeChild(temp);
  return computed;
}

/**
 * Resolve CSS variable to RGB color
 */
function resolveColor(cssVar: string, fallback: string): string {
  if (!cssVar) return fallback;
  let rawColor = cssVar;
  if (cssVar.startsWith('var(')) {
    const varName = cssVar.match(/var\((.*?)\)/)?.[1];
    if (varName) {
      rawColor = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (!rawColor) return fallback;
    }
  }
  return toRGB(rawColor);
}

/** Track active observer so we can clean up on re-init */
let activeObserver: IntersectionObserver | null = null;

/**
 * Initialize scroll-triggered background color changes
 */
function initScrollColors(): void {
  // Check #a11y-content-wrapper, not document.body
  const wrapper = document.getElementById('a11y-content-wrapper');
  if (wrapper && a11yClasses.some(cls => wrapper.classList.contains(cls))) return;

  // Also check system preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Target the visible container — #a11y-content-wrapper sits on top of body
  // and is the OverlayScrollbars host, so it's the actual visible background.
  const target = document.getElementById('a11y-content-wrapper') || document.body;

  const sections = document.querySelectorAll<HTMLElement>('[data-scroll-bg]');
  if (sections.length === 0) return;

  // Kill previous observer if re-initialising (View Transitions)
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  const fallbackColor = 'rgb(248, 245, 242)';
  const initialColor = resolveColor('var(--brand-c-bg)', fallbackColor);

  // Build ordered section → colour map (bg + pattern can differ)
  const sectionData = Array.from(sections).map((section, index) => ({
    section,
    color: resolveColor(section.getAttribute('data-scroll-bg') || '', initialColor),
    patternColor: resolveColor(
      section.getAttribute('data-scroll-pattern') || section.getAttribute('data-scroll-bg') || '',
      initialColor,
    ),
    index,
  }));

  // Detect OverlayScrollbars viewport — the actual scroll container
  const osViewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]');

  let currentColor = initialColor;

  // Set initial pattern colour so PatternOverlays have a value on load
  target.style.setProperty('--scroll-pattern-color', initialColor);

  // Track which section is currently "active" (most visible)
  const visibilityMap = new Map<HTMLElement, number>();

  let currentPatternColor = initialColor;

  /**
   * Animate both background colour and pattern colour.
   * Each can be a different value per section.
   */
  function animateTo(bgColor: string, patternColor: string): void {
    if (bgColor === currentColor && patternColor === currentPatternColor) return;
    gsap.killTweensOf(target);
    gsap.to(target, {
      backgroundColor: bgColor,
      '--scroll-pattern-color': patternColor,
      duration: 0.8,
      ease: 'power2.inOut',
    });
    currentColor = bgColor;
    currentPatternColor = patternColor;
  }

  /**
   * Find the section with the highest visibility and animate to its colour.
   * On ties, prefer the one further down the page (natural scroll direction).
   */
  function updateActiveSection(): void {
    let bestRatio = 0;
    let bestData = sectionData[0];

    sectionData.forEach((data) => {
      const ratio = visibilityMap.get(data.section) || 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestData = data;
      } else if (ratio === bestRatio && ratio > 0) {
        // Tie-break: prefer lower section (further down page)
        if (data.index > bestData.index) {
          bestData = data;
        }
      }
    });

    if (bestRatio > 0) {
      animateTo(bestData.color, bestData.patternColor);
    } else {
      // No section visible — revert to initial
      animateTo(initialColor, initialColor);
    }
  }

  /**
   * IntersectionObserver with multiple thresholds for smooth tracking.
   * Granular ratios let us pick the "most visible" section at any scroll point.
   * Uses OverlayScrollbars viewport as root when available.
   */
  activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibilityMap.set(entry.target as HTMLElement, entry.intersectionRatio);
      });
      updateActiveSection();
    },
    {
      root: osViewport || null,
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    }
  );

  // Observe all sections
  sectionData.forEach(({ section }) => {
    activeObserver!.observe(section);
  });
}

/**
 * Setup with timing buffer — waits for page to settle
 */
function setup(): void {
  setTimeout(() => {
    initScrollColors();
  }, 300);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}

// Support Astro View Transitions
document.addEventListener('astro:page-load', setup);
