/**
 * Warp Parallax — "flying through the stars" effect
 * src/lib/animation/warp-parallax.ts
 *
 * Instead of uniform Y parallax, elements radiate OUTWARD from
 * viewport center as the user scrolls. Combined with scale increase,
 * it creates the sensation of travelling into the scene.
 *
 * Each element's drift direction is determined by its position
 * relative to the zone center — top-left icons drift top-left,
 * bottom-right icons drift bottom-right. Depth amplifies the effect.
 *
 * Motion modes (set via data-motion on section or zone):
 *
 *   "warp"      — radial spread from center + scale up (hyperspace)
 *   "drift"     — gentle lateral float, alternating L/R by depth
 *   "converge"  — reverse warp: icons pull INWARD (dramatic entrance)
 *   "scatter"   — random vector per icon (chaotic energy)
 *
 * Works WITH stellar-parallax.ts — that handles base Y offset,
 * this adds the radial X/Y spread on top via a separate tween.
 *
 * Usage:
 *   <section data-pattern-mode="warp">
 *     <div class="parallax-decor" data-depth="0.3" data-warp-x="0.2" data-warp-y="-0.4">
 *       <Icon name="star" />
 *     </div>
 *   </section>
 *
 * Or auto-calculated from position (no data-warp-* needed):
 *   <section data-pattern-mode="warp">
 *     <div class="parallax-decor" data-depth="0.6">
 *       <Icon name="brand/logo" />
 *     </div>
 *   </section>
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   TYPES
   ================================================================ */

interface WarpLayer {
  element: HTMLElement;
  trigger: ScrollTrigger;
  depth: number;
  vectorX: number;    // normalised direction (-1 to 1)
  vectorY: number;
}

type MotionMode = 'warp' | 'drift' | 'converge' | 'scatter';

let warpLayers: WarpLayer[] = [];

/* ================================================================
   HELPERS
   ================================================================ */

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('a11y-reduce-motion');
}

function getIntensity(): number {
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue('--parallax-intensity').trim();
  return val ? Number(val) : 1;
}

/**
 * Calculate normalised direction vector from element center
 * to zone/viewport center. Returns values from -1 to 1.
 */
function calcVector(el: HTMLElement, zone: HTMLElement): { x: number; y: number } {
  const elRect = el.getBoundingClientRect();
  const zoneRect = zone.getBoundingClientRect();

  // Element center relative to zone
  const elCenterX = (elRect.left + elRect.width / 2) - zoneRect.left;
  const elCenterY = (elRect.top + elRect.height / 2) - zoneRect.top;

  // Zone center
  const zoneCenterX = zoneRect.width / 2;
  const zoneCenterY = zoneRect.height / 2;

  // Direction: element → away from center (normalised -1 to 1)
  const dx = (elCenterX - zoneCenterX) / zoneCenterX;
  const dy = (elCenterY - zoneCenterY) / zoneCenterY;

  return { x: dx, y: dy };
}

/**
 * Generate a seeded pseudo-random for scatter mode.
 * Uses element position as seed for consistency across refreshes.
 */
function seededRandom(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  const seed = (rect.left * 7 + rect.top * 13) % 1000;
  const angle = (seed / 1000) * Math.PI * 2;
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

/* ================================================================
   MOTION PROFILES
   ================================================================ */

/**
 * Each mode returns { x, y, scale, rotation } multipliers.
 * These get multiplied by depth and intensity at scrub time.
 */
function getMotionProfile(
  mode: MotionMode,
  el: HTMLElement,
  zone: HTMLElement,
  depth: number
) {
  const v = calcVector(el, zone);

  // How much depth amplifies movement (far = slow, near = fast)
  // depth 0.2 = background, barely moves
  // depth 1.5 = foreground, dramatic spread
  const depthMultiplier = depth < 1
    ? depth * 0.6           // background: subtle
    : 1 + (depth - 1) * 2; // foreground: amplified

  switch (mode) {
    case 'warp':
      // Radial spread outward + scale up (hyperspace jump)
      return {
        x: v.x * 300 * depthMultiplier,       // px spread from center
        y: v.y * 200 * depthMultiplier,
        scale: 1 + (0.4 * depthMultiplier),    // grow as "approaching"
        rotation: v.x * 8 * depthMultiplier,   // slight rotation adds realism
        opacity: null as number | null,
      };

    case 'converge':
      // Reverse warp — pull inward (dramatic section entrance)
      return {
        x: -v.x * 250 * depthMultiplier,
        y: -v.y * 180 * depthMultiplier,
        scale: 1 - (0.3 * Math.min(depthMultiplier, 1)), // shrink as "receding"
        rotation: -v.x * 5 * depthMultiplier,
        opacity: null as number | null,
      };

    case 'drift':
      // Gentle lateral float — alternating L/R based on depth
      // Background drifts left, foreground drifts right
      const direction = depth < 1 ? -1 : 1;
      return {
        x: direction * 150 * depthMultiplier,
        y: 0,
        scale: 1,
        rotation: direction * 3,
        opacity: null as number | null,
      };

    case 'scatter':
      // Random vector per element — chaotic energy burst
      const sv = seededRandom(el);
      return {
        x: sv.x * 350 * depthMultiplier,
        y: sv.y * 350 * depthMultiplier,
        scale: 1 + (0.2 * depthMultiplier),
        rotation: sv.x * 15,
        opacity: depth < 0.5 ? 0 : null,  // far items fade out
      };
  }
}

/* ================================================================
   INIT
   ================================================================ */

function createWarpLayer(
  el: HTMLElement,
  zone: HTMLElement,
  mode: MotionMode,
  scroller?: HTMLElement
): WarpLayer | null {
  const depth = Number(el.dataset.depth);
  if (isNaN(depth)) return null;

  // Manual vector override (optional)
  const manualX = el.dataset.warpX ? Number(el.dataset.warpX) : null;
  const manualY = el.dataset.warpY ? Number(el.dataset.warpY) : null;

  const profile = getMotionProfile(mode, el, zone, depth);

  // Override with manual vectors if provided
  if (manualX !== null) profile.x = manualX * 300;
  if (manualY !== null) profile.y = manualY * 200;

  const tween = gsap.fromTo(el,
    {
      x: 0,
      scale: 1,
      rotation: 0,
    },
    {
      x: () => profile.x * getIntensity(),
      y: () => profile.y * getIntensity(),
      scale: profile.scale,
      rotation: profile.rotation,
      opacity: profile.opacity ?? undefined,
      ease: 'none',
      scrollTrigger: {
        trigger: zone,          // the whole zone drives the animation
        scroller: scroller || undefined,
        start: 'top bottom',    // begin when zone enters viewport
        end: 'bottom top',      // end when zone leaves
        scrub: true,            // instant — stops when scroll stops
        invalidateOnRefresh: true,
      },
    }
  );

  const v = manualX !== null ? { x: manualX, y: manualY ?? 0 } : calcVector(el, zone);

  return {
    element: el,
    trigger: tween.scrollTrigger!,
    depth,
    vectorX: v.x,
    vectorY: v.y,
  };
}

/* ================================================================
   PUBLIC API
   ================================================================ */

/**
 * Assign [data-depth] elements to zones by Y-position overlap.
 * Used when icons live in a sibling container (e.g. single ParallaxDecor
 * spanning multiple sections) so they aren't DOM children of each zone.
 */
function assignByPosition(
  zones: HTMLElement[],
  elements: HTMLElement[]
): Map<HTMLElement, HTMLElement[]> {
  const assignments = new Map<HTMLElement, HTMLElement[]>();
  zones.forEach(z => assignments.set(z, []));

  // Sort zones top-to-bottom for predictable assignment
  const sorted = [...zones].sort((a, b) =>
    a.getBoundingClientRect().top - b.getBoundingClientRect().top
  );

  for (const el of elements) {
    const elRect = el.getBoundingClientRect();
    const elCenterY = elRect.top + elRect.height / 2;

    // Find which zone this element's center falls within
    for (const z of sorted) {
      const zRect = z.getBoundingClientRect();
      if (elCenterY >= zRect.top && elCenterY <= zRect.bottom) {
        assignments.get(z)!.push(el);
        break;
      }
    }
  }

  return assignments;
}

export function initWarpParallax(
  zone?: HTMLElement,
  mode?: MotionMode
): void {
  destroyWarpParallax();

  if (prefersReducedMotion()) return;

  // Find zone(s)
  const zones = zone
    ? [zone]
    : Array.from(document.querySelectorAll<HTMLElement>('[data-pattern-mode]'));

  const osViewport = document.querySelector<HTMLElement>(
    '[data-overlayscrollbars-viewport]'
  ) || undefined;

  // Track which elements have already been assigned (avoid double-tweening)
  const assigned = new Set<HTMLElement>();

  for (const z of zones) {
    const zoneMode = (mode || z.dataset.patternMode || 'warp') as MotionMode;
    const domChildren = z.querySelectorAll<HTMLElement>('[data-depth]');

    if (domChildren.length > 0) {
      // Standard path: icons are DOM children of the zone
      domChildren.forEach(el => {
        if (assigned.has(el)) return;
        assigned.add(el);
        const layer = createWarpLayer(el, z, zoneMode, osViewport);
        if (layer) warpLayers.push(layer);
      });
    }
  }

  // Position-based fallback: if there are [data-depth] elements NOT yet assigned,
  // assign them to zones by Y-position overlap (single ParallaxDecor spanning sections)
  const allDepth = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'));
  const unassigned = allDepth.filter(el => !assigned.has(el));

  if (unassigned.length > 0 && zones.length > 0) {
    const posMap = assignByPosition(zones, unassigned);

    for (const [z, elements] of posMap) {
      const zoneMode = (mode || z.dataset.patternMode || 'warp') as MotionMode;
      elements.forEach(el => {
        assigned.add(el);
        const layer = createWarpLayer(el, z, zoneMode, osViewport);
        if (layer) warpLayers.push(layer);
      });
    }
  }
}

export function destroyWarpParallax(): void {
  warpLayers.forEach(layer => {
    layer.trigger.kill();
    gsap.set(layer.element, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
  });
  warpLayers = [];
}

/**
 * Switch mode on the fly (e.g. from a11y panel or section transition).
 * Kills existing tweens and re-inits with new mode.
 */
export function setWarpMode(zone: HTMLElement, mode: MotionMode): void {
  // Kill layers belonging to this zone
  warpLayers = warpLayers.filter(layer => {
    if (zone.contains(layer.element)) {
      layer.trigger.kill();
      gsap.set(layer.element, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 });
      return false;
    }
    return true;
  });

  // Re-init with new mode
  const osViewport = document.querySelector<HTMLElement>(
    '[data-overlayscrollbars-viewport]'
  ) || undefined;

  zone.querySelectorAll<HTMLElement>('[data-depth]').forEach(el => {
    const layer = createWarpLayer(el, zone, mode, osViewport);
    if (layer) warpLayers.push(layer);
  });
}

/* ================================================================
   AUTO-INIT
   Delay 400ms for OverlayScrollbars viewport creation.
   Only inits zones that have data-pattern-mode set.
   ================================================================ */

function setup(): void {
  setTimeout(() => {
    initWarpParallax();
    // Fade in decor containers (start at CSS opacity:0 to hide pre-init jump)
    document.querySelectorAll<HTMLElement>('.parallax-decor').forEach(el => {
      gsap.to(el, { opacity: 1, duration: 0.6, ease: 'power2.out' });
    });
  }, 400);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
  document.addEventListener('astro:page-load', setup);
}
