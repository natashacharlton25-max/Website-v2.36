/**
 * Stellar Parallax
 * src/lib/animation/stellar-parallax.ts
 *
 * Adds Z-depth scroll parallax to any element via data-depth attribute.
 * Works alongside Matter.js (PhysicsOverlay handles X/Y, this handles Z).
 *
 * Depth values:
 *   0.2  — Background layer, moves slowly (feels far away)
 *   0.5  — Mid-ground, subtle movement
 *   1.0  — Scroll speed (no parallax, default page behaviour)
 *   1.5  — Foreground, moves faster than scroll (feels close)
 *   2.0  — Extreme foreground, dramatic movement
 *
 * Intensity is controlled via CSS custom property --parallax-intensity (0–2).
 * Default: 1. Set to 0 to flatten everything. Controllable from a11y panel.
 *
 * Usage:
 *
 * <!-- Background pattern — moves slowly -->
 * <div data-depth="0.2">...</div>
 *
 * <!-- Card at scroll speed (no parallax) -->
 * <div data-depth="1.0">...</div>
 *
 * <!-- Foreground element — moves faster -->
 * <div data-depth="1.5">...</div>
 *
 * <!-- Intensity via CSS variable (a11y slider) -->
 * <style> :root { --parallax-intensity: 1; } </style>
 *
 * <!-- Or per-element intensity override -->
 * <div data-depth="1.5" data-depth-intensity="0.5">...</div>
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, getScrollContainer, onThemeChange } from './animation-config';

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   CONFIG
   ================================================================ */

interface ParallaxLayer {
  element: HTMLElement;
  depth: number;
  trigger: ScrollTrigger;
  originalTransition: string;
}

let layers: ParallaxLayer[] = [];
let intensityProp = '--parallax-intensity';

/* ================================================================
   HELPERS
   ================================================================ */

function getIntensity(): number {
  const cssVal = getComputedStyle(document.documentElement)
    .getPropertyValue(intensityProp).trim();
  return cssVal ? Number(cssVal) : 1;
}

/* ================================================================
   INIT
   ================================================================ */

function createParallax(el: HTMLElement, scroller?: HTMLElement): ParallaxLayer | null {
  const depth = Number(el.dataset.depth);
  if (isNaN(depth) || depth === 1.0) return null; // depth 1.0 = no parallax

  // Per-element intensity override
  const localIntensity = el.dataset.depthIntensity
    ? Number(el.dataset.depthIntensity)
    : null;

  // Calculate movement: depth < 1 moves less (background), > 1 moves more (foreground)
  // The offset is relative to normal scroll, so depth 0.5 lags behind, 1.5 leads ahead
  const baseMovement = -(depth - 1.0) * 900; // px offset at full scroll

  // Strip CSS transition on transform — prevents fighting GSAP's instant scrub
  // (keeps other transitions like box-shadow, border-color intact for hover)
  const originalTransition = getComputedStyle(el).transitionProperty;
  if (originalTransition && originalTransition !== 'none') {
    const filtered = originalTransition.split(',')
      .map(p => p.trim())
      .filter(p => p !== 'transform' && p !== 'all');
    el.style.transitionProperty = filtered.length > 0 ? filtered.join(', ') : 'none';
  }

  // Subtle scale drift: ±5% based on depth for subconscious depth realism
  const scaleTarget = 1 + (depth - 1.0) * 0.05;

  const tween = gsap.to(el, {
    y: () => {
      const intensity = localIntensity ?? getIntensity();
      return baseMovement * intensity;
    },
    scale: scaleTarget,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      scroller: scroller || undefined,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  return {
    element: el,
    depth,
    trigger: tween.scrollTrigger!,
    originalTransition,
  };
}

export function initStellarParallax() {
  // Clean up previous instances (View Transitions / SPA nav)
  destroyStellarParallax();

  if (prefersReducedMotion()) return;

  // Detect OverlayScrollbars viewport — the actual scroll container
  const osViewport = getScrollContainer();

  const elements = document.querySelectorAll<HTMLElement>('[data-depth]');
  elements.forEach(el => {
    // Skip elements inside warp zones — warp-parallax.ts owns those
    if (el.closest('[data-pattern-mode]')) return;

    const layer = createParallax(el, osViewport);
    if (layer) layers.push(layer);
  });
}

export function destroyStellarParallax() {
  layers.forEach(layer => {
    layer.trigger.kill();
    gsap.set(layer.element, { y: 0, scale: 1 }); // Reset position + scale
    layer.element.style.transitionProperty = '';
  });
  layers = [];
}

/**
 * Update intensity live (called from a11y slider).
 * Sets the CSS custom property and refreshes all triggers.
 */
export function setParallaxIntensity(value: number) {
  document.documentElement.style.setProperty(intensityProp, String(value));
  ScrollTrigger.refresh(); // Recalculates all y values via invalidateOnRefresh
}

/* ================================================================
   A11Y WATCHER — uses centralised onThemeChange from animation-config
   ================================================================ */

let a11yWatcherRegistered = false;

function watchA11y() {
  if (a11yWatcherRegistered) return;
  a11yWatcherRegistered = true;

  // Kill parallax if reduced motion is toggled on mid-session
  onThemeChange(() => {
    if (prefersReducedMotion()) {
      destroyStellarParallax();
    } else if (layers.length === 0) {
      initStellarParallax();
    }
  });

  // System preference change
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) destroyStellarParallax();
    else initStellarParallax();
  });
}

/* ================================================================
   PRINT SUPPORT — flatten all layers
   ================================================================ */

if (typeof window !== 'undefined') {
  window.addEventListener('beforeprint', () => {
    layers.forEach(layer => gsap.set(layer.element, { y: 0 }));
  });

  window.addEventListener('afterprint', () => {
    ScrollTrigger.refresh();
  });
}

/* ================================================================
   AUTO-INIT
   Delay 400ms — OverlayScrollbars must create
   [data-overlayscrollbars-viewport] before ScrollTrigger can use
   it as scroller. Matches pattern-morph.ts timing.
   ================================================================ */

function setup(): void {
  setTimeout(() => {
    initStellarParallax();
    watchA11y();
    // Fade in containers (start at CSS opacity:0 to hide pre-init jump)
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
