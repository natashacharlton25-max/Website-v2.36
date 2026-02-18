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
 *     <PatternOverlay icons={['wellness/heart-fill']} ... interactive />
 *     <section data-scroll-icon="creative/star-fill"
 *              data-scroll-pattern="var(--zone-pattern-primary)">...</section>
 *   </div>
 *
 * Icon shape morphing + icon colour shift handled here.
 * Zone background colour handled by ScrollMorphZone's own <script>
 * (reads data-zone-bg, NOT data-scroll-bg).
 */

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { resolveColor } from './scroll-color-driver';

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

/* ---- Sort helpers ---- */

/** For PatternOverlay grids: radial stagger from center */
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

/**
 * For ParallaxDecor: group paths by depth layer.
 * Returns depth bands sorted far→near, each containing its paths.
 * Far icons morph first, near icons morph last — wave through Z-depth.
 */
interface DepthBand {
  depth: number;
  paths: SVGPathElement[];
}

function groupPathsByDepth(overlay: HTMLElement): DepthBand[] {
  const map = new Map<number, SVGPathElement[]>();

  overlay.querySelectorAll<SVGPathElement>(
    '.parallax-decor__icon svg path:not([fill="none"])',
  ).forEach((path) => {
    const icon = path.closest('.parallax-decor__icon') as HTMLElement | null;
    if (!icon) return;
    const depth = parseFloat(icon.dataset.depth || '1');
    if (!map.has(depth)) map.set(depth, []);
    map.get(depth)!.push(path);
  });

  // Sort bands far→near (low depth first)
  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([depth, paths]) => ({ depth, paths }));
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
    const overlay = container.querySelector<HTMLElement>('.pattern-overlay--grid')
      || container.querySelector<HTMLElement>('.parallax-decor');
    if (!overlay) return;

    const sections = container.querySelectorAll<HTMLElement>('[data-scroll-icon]');
    if (sections.length === 0) return;

    const sectionData = Array.from(sections).map((section, index) => ({
      section,
      icon: section.getAttribute('data-scroll-icon') || '',
      color: section.getAttribute('data-scroll-pattern') || '',
      index,
    }));

    // Pre-fetch all icon paths
    sectionData.forEach((d) => {
      if (d.icon) fetchIconPath(d.icon);
    });

    // Initial icon matches the grid's rendered icon — skip the no-op first morph
    let currentIcon = sectionData[0]?.icon || '';
    // Resolved colour cache — prevents re-animating to same colour during scroll.
    // Cleared on theme change to force re-resolve against new palette.
    let currentColorResolved = '';
    let morphGeneration = 0;  // guards async morphTo against stale fetches
    const visibilityMap = new Map<HTMLElement, number>();

    const isParallaxDecor = overlay!.classList.contains('parallax-decor');

    async function morphTo(iconName: string): Promise<void> {
      if (iconName === currentIcon) return;

      // Bump generation — any in-flight fetch with an older gen is stale
      const gen = ++morphGeneration;
      const targetD = await fetchIconPath(iconName);
      if (!targetD || gen !== morphGeneration) return;  // stale — newer morph requested

      if (isParallaxDecor) {
        // Depth-layered morph: far icons first, near icons last
        const bands = groupPathsByDepth(overlay!);
        let bandDelay = 0;

        for (const band of bands) {
          gsap.killTweensOf(band.paths);
          gsap.to(band.paths, {
            morphSVG: { shape: targetD, type: 'rotational' },
            duration: 0.3,
            stagger: 0.003,
            delay: bandDelay,
            ease: 'power2.out',
            overwrite: true,
          });
          bandDelay += 0.08; // 80ms between each depth layer
        }
      } else {
        // PatternOverlay grid: radial stagger from center
        const sorted = sortPathsByDistance(overlay!);
        gsap.killTweensOf(sorted);
        gsap.to(sorted, {
          morphSVG: { shape: targetD, type: 'rotational' },
          duration: 0.25,
          stagger: 0.002,
          ease: 'power2.out',
          overwrite: true,
        });
      }

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

        // Shift pattern icon colour to match active section
        if (bestData.color) {
          let color = resolveColor(bestData.color, overlay!);
          // Fallback: if resolveColor returned garbage (empty, raw var(), 'undefined'),
          // use a safe brand token instead of letting GSAP interpret it as a colour
          if (!color || color.startsWith('var(') || color === 'undefined') {
            color = resolveColor('var(--brand-c-primary-light)', overlay!);
          }
          if (color !== currentColorResolved) {
            gsap.to(overlay!, {
              color,
              '--scroll-pattern-color': color,
              duration: 0.8,
              ease: 'power2.inOut',
              overwrite: true,
            });
            currentColorResolved = color;
          }
        }
      }
    }

    // Debounce: batch rapid observer entries into one rAF update
    let rafPending = false;
    function scheduleUpdate(): void {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        updateActive();
      });
    }

    // Observe sections for morph triggers
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target as HTMLElement, entry.intersectionRatio);
        });
        scheduleUpdate();
      },
      {
        root: osViewport || null,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      },
    );

    sectionData.forEach(({ section }) => sectionObserver.observe(section));

    // Observe the zone container — fade overlay in/out at boundaries.
    // Read --po-opacity so we fade to the authored opacity, not hard 1.
    const poOpacity = parseFloat(
      getComputedStyle(overlay!).getPropertyValue('--po-opacity'),
    ) || 0.25;

    const zoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(overlay!, { opacity: poOpacity, duration: 0.4, ease: 'power2.out' });
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

    // Theme switch: re-resolve icon colour with new palette, instant snap
    window.addEventListener('themeChanged', () => {
      if (prefersReducedMotion()) return;
      currentColorResolved = '';  // force re-resolve

      // Find which section is currently in view
      let bestRatio = 0;
      let bestData = sectionData[0];
      sectionData.forEach((data) => {
        const ratio = visibilityMap.get(data.section) || 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestData = data;
        }
      });

      if (bestData?.color) {
        let color = resolveColor(bestData.color, overlay!);
        if (!color || color.startsWith('var(') || color === 'undefined') {
          color = resolveColor('var(--brand-c-primary-light)', overlay!);
        }
        gsap.set(overlay!, { color, '--scroll-pattern-color': color });
        currentColorResolved = color;
      }
    });

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
