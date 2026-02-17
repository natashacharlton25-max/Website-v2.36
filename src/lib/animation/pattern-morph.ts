/**
 * Pattern Morph — Scroll-driven SVG icon morphing for PatternOverlay grids
 *
 * Morphs grid icons between Phosphor shapes as sections scroll into view.
 * Uses IntersectionObserver (same pattern as scroll-color-background.ts)
 * for OverlayScrollbars compatibility.
 *
 * Features:
 * - Radial stagger ripple from grid center
 * - Path caching (each icon fetched once)
 * - A11y: skips if reduce-motion or text-only
 * - Astro View Transitions support
 *
 * Markup:
 *   <div data-scroll-morph>
 *     <PatternOverlay icons={['wellness/heart-fill']} ... />
 *     <section data-scroll-icon="creative/star-fill">...</section>
 *   </div>
 *
 * Colour is handled separately by scroll-color-background.ts.
 */

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

/* ---- A11y ---- */
const a11yDisabled = ['a11y-reduce-motion', 'a11y-text-only'];

function prefersReducedMotion(): boolean {
  const wrapper = document.getElementById('a11y-content-wrapper');
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !!wrapper?.classList.contains('a11y-reduce-motion') ||
    !!wrapper?.classList.contains('a11y-text-only')
  );
}

/* ---- Path cache ---- */
const pathCache = new Map<string, string>();

async function fetchIconPath(iconName: string): Promise<string | null> {
  if (pathCache.has(iconName)) return pathCache.get(iconName)!;
  try {
    const resp = await fetch(`/Icons/phosphor/${iconName}.svg`);
    if (!resp.ok) return null;
    const text = await resp.text();
    const match = text.match(/<path\s+d="([^"]+)"/);
    if (!match) return null;
    pathCache.set(iconName, match[1]);
    return match[1];
  } catch {
    return null;
  }
}

/* ---- Radial sort ---- */
function sortPathsByDistance(
  overlay: HTMLElement,
): SVGPathElement[] {
  const rect = overlay.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  const items = Array.from(
    overlay.querySelectorAll<SVGPathElement>(
      '.pattern-overlay__cell svg path:not([fill="none"])',
    ),
  ).map((path) => {
    const cell = path.closest('.pattern-overlay__cell');
    if (!cell) return { path, dist: 0 };
    const cr = cell.getBoundingClientRect();
    const dx = cr.left + cr.width / 2 - rect.left - cx;
    const dy = cr.top + cr.height / 2 - rect.top - cy;
    return { path, dist: Math.sqrt(dx * dx + dy * dy) };
  });

  items.sort((a, b) => a.dist - b.dist);
  return items.map((i) => i.path);
}

/* ---- Observer state ---- */
let activeObserver: IntersectionObserver | null = null;

/* ---- Init ---- */
function initPatternMorph(): void {
  if (prefersReducedMotion()) return;

  const containers = document.querySelectorAll<HTMLElement>('[data-scroll-morph]');
  if (containers.length === 0) return;

  // Clean up previous observer (View Transitions)
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  // OverlayScrollbars viewport as observer root
  const osViewport = document.querySelector<HTMLElement>(
    '[data-overlayscrollbars-viewport]',
  );

  containers.forEach((container) => {
    const overlay = container.querySelector<HTMLElement>('.pattern-overlay--grid');
    if (!overlay) return;

    const sections = container.querySelectorAll<HTMLElement>('[data-scroll-icon]');
    if (sections.length === 0) return;

    const sectionData = Array.from(sections).map((section, index) => ({
      section,
      icon: section.getAttribute('data-scroll-icon') || '',
      index,
    }));

    // Pre-fetch all icon paths
    sectionData.forEach((d) => {
      if (d.icon) fetchIconPath(d.icon);
    });

    // Initial icon matches the grid's rendered icon — skip the no-op first morph
    let currentIcon = sectionData[0]?.icon || '';
    const visibilityMap = new Map<HTMLElement, number>();

    async function morphTo(iconName: string): Promise<void> {
      if (iconName === currentIcon) return;
      const targetD = await fetchIconPath(iconName);
      if (!targetD) return;

      const sorted = sortPathsByDistance(overlay!);

      // Kill any in-progress morph and start the new one immediately
      gsap.killTweensOf(sorted);
      gsap.to(sorted, {
        morphSVG: { shape: targetD, type: 'rotational' },
        duration: 0.8,
        stagger: 0.008,
        ease: 'power2.inOut',
        overwrite: true,
      });

      currentIcon = iconName;
    }

    function updateActive(): void {
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

      if (bestRatio > 0 && bestData.icon) {
        morphTo(bestData.icon);
      }
    }

    // Observe sections for morph triggers
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target as HTMLElement, entry.intersectionRatio);
        });
        updateActive();
      },
      {
        root: osViewport || null,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    );

    sectionData.forEach(({ section }) => sectionObserver.observe(section));

    // Observe the zone container — fade overlay in/out at boundaries
    const zoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(overlay!, { opacity: 1, duration: 0.4, ease: 'power2.out' });
          } else {
            gsap.to(overlay!, { opacity: 0, duration: 0.3, ease: 'power2.in' });
          }
        });
      },
      {
        root: osViewport || null,
        threshold: 0,
      },
    );
    zoneObserver.observe(container);

    // Store for cleanup
    if (!activeObserver) activeObserver = sectionObserver;
  });
}

/* ---- Setup ---- */
function setup(): void {
  setTimeout(initPatternMorph, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}

document.addEventListener('astro:page-load', setup);
