/**
 * ScrollColorDriver
 * src/lib/animation/scroll-color-driver.ts
 *
 * Reusable utility: drives GSAP backgroundColor transitions on a target
 * element based on [data-zone-bg] trigger sections.
 *
 * resolveColor() handles var(--token) → computed value at call time,
 * so a11y theme toggles mid-scroll are picked up automatically.
 *
 * Usage:
 *
 *   // Drive body background from all [data-zone-bg] on the page
 *   import { initScrollColorDriver } from './scroll-color-driver';
 *   initScrollColorDriver(document.body);
 *
 *   // Drive a specific zone element from its child sections
 *   initScrollColorDriver(zoneEl, zoneEl.querySelectorAll('[data-zone-bg]'));
 *
 *   // Just resolve a colour token
 *   import { resolveColor } from './scroll-color-driver';
 *   const hex = resolveColor('var(--zone-bg-primary-deep)', element);
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, getScrollContainer } from './animation-config';
gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   resolveColor — handles hex passthrough AND var(--token) resolution
   ================================================================ */

/**
 * Resolve a colour value at call time.
 *
 * - Hex/rgb strings pass through unchanged.
 * - var(--token) strings are resolved via getComputedStyle.
 * - Reads from `el` so palette custom properties cascade correctly.
 * - Called inside callbacks (not setup) so a11y theme toggles work.
 *
 * @param value - 'var(--zone-bg-primary-deep)' or '#1a0a2e' or 'rgb(...)'
 * @param el    - Element to compute styles from. Use the element where
 *                ZonePalette.css tokens are defined (zone, layer, etc).
 *                Falls back to documentElement.
 */
// Reusable temp element for resolving color-mix() → rgb()
let _probe: HTMLElement | null = null;
function getProbe(): HTMLElement {
  if (!_probe) {
    _probe = document.createElement('div');
    _probe.style.display = 'none';
    document.body.appendChild(_probe);
  }
  return _probe;
}

export function resolveColor(value: string, el?: Element): string {
  if (!value) return value;
  if (!value.startsWith('var(')) return value;

  // "var(--zone-bg-primary-deep)" → "--zone-bg-primary-deep"
  // "var(--zone-bg-1, #1a0a2e)"   → "--zone-bg-1"
  const match = value.match(/var\(\s*(--[^,)]+)/);
  if (!match) return value;

  const target = el || document.documentElement;
  const raw = getComputedStyle(target).getPropertyValue(match[1]).trim();
  if (!raw) return value;

  // If it's already a simple hex/rgb, pass through
  if (raw.startsWith('#') || raw.startsWith('rgb')) return raw;

  // color-mix() or other CSS functions — resolve to rgb via temp element
  const probe = getProbe();
  probe.style.backgroundColor = raw;
  const rgb = getComputedStyle(probe).backgroundColor;
  probe.style.backgroundColor = '';
  return rgb || raw;
}


/* ================================================================
   initScrollColorDriver — attach GSAP ScrollTriggers
   ================================================================ */

interface DriverOptions {
  /** ScrollTrigger start position. Default: 'top 60%' */
  start?: string;
  /** ScrollTrigger end position. Default: 'bottom 40%' */
  end?: string;
  /** GSAP tween duration in seconds. Default: 0.8 */
  duration?: number;
  /** GSAP ease. Default: 'power2.inOut' */
  ease?: string;
  /** Element to resolve palette vars from. Defaults to target. */
  paletteEl?: Element;
}

/**
 * Drive GSAP backgroundColor on `target` based on [data-zone-bg] sections.
 *
 * @param target   - Element whose backgroundColor gets animated (body, zone div, etc.)
 * @param sections - NodeList of trigger sections. Defaults to all [data-zone-bg] on page.
 * @param options  - ScrollTrigger + tween config.
 * @returns Array of ScrollTrigger instances (for cleanup).
 */
export function initScrollColorDriver(
  target: HTMLElement,
  sections?: NodeListOf<HTMLElement> | HTMLElement[],
  options: DriverOptions = {},
): ScrollTrigger[] {
  const {
    start = 'top 60%',
    end = 'bottom 40%',
    duration = 0.8,
    ease = 'power2.inOut',
    paletteEl,
  } = options;

  // Default: find all [data-zone-bg] on the page
  const triggerSections = sections
    ? Array.from(sections)
    : Array.from(document.querySelectorAll<HTMLElement>('[data-zone-bg]'));

  if (!triggerSections.length) return [];

  // Resolve element for palette var lookup
  const resolveEl = paletteEl || target;

  // Set initial bg from first section
  const firstBg = resolveColor(triggerSections[0].dataset.zoneBg || '', resolveEl);
  if (firstBg) target.style.backgroundColor = firstBg;

  // If reduce motion, stop here — static bg, no scroll transitions
  if (prefersReducedMotion()) return [];

  // OverlayScrollbars viewport — ScrollTrigger must use this as scroller
  const osViewport = getScrollContainer();

  const triggers: ScrollTrigger[] = [];

  triggerSections.forEach(section => {
    const rawBg = section.dataset.zoneBg;
    if (!rawBg) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      scroller: osViewport || undefined,
      start,
      end,
      onEnter: () => {
        const bg = resolveColor(rawBg, resolveEl);
        gsap.to(target, { backgroundColor: bg, duration, ease, overwrite: true });
      },
      onEnterBack: () => {
        const bg = resolveColor(rawBg, resolveEl);
        gsap.to(target, { backgroundColor: bg, duration, ease, overwrite: true });
      },
    });

    triggers.push(trigger);
  });

  return triggers;
}


/* ================================================================
   initScrollPatternColor — animate pattern overlay colour
   ================================================================ */

/**
 * Drive pattern overlay icon colour from [data-scroll-pattern] sections.
 * Animates the `color` and `--scroll-pattern-color` CSS property on the
 * overlay element.
 *
 * @param overlay  - The .pattern-overlay element
 * @param sections - Trigger sections with data-scroll-pattern
 * @param options  - Same as DriverOptions
 */
export function initScrollPatternColor(
  overlay: HTMLElement,
  sections?: NodeListOf<HTMLElement> | HTMLElement[],
  options: DriverOptions = {},
): ScrollTrigger[] {
  const {
    start = 'top 60%',
    end = 'bottom 40%',
    duration = 0.8,
    ease = 'power2.inOut',
    paletteEl,
  } = options;

  const triggerSections = sections
    ? Array.from(sections)
    : Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-pattern]'));

  if (!triggerSections.length || prefersReducedMotion()) return [];

  const osViewport = getScrollContainer();
  const resolveEl = paletteEl || overlay;
  const triggers: ScrollTrigger[] = [];

  triggerSections.forEach(section => {
    const rawColor = section.dataset.scrollPattern;
    if (!rawColor) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      scroller: osViewport || undefined,
      start,
      end,
      onEnter: () => {
        const color = resolveColor(rawColor, resolveEl);
        gsap.to(overlay, { color, '--scroll-pattern-color': color, duration, ease, overwrite: true });
      },
      onEnterBack: () => {
        const color = resolveColor(rawColor, resolveEl);
        gsap.to(overlay, { color, '--scroll-pattern-color': color, duration, ease, overwrite: true });
      },
    });

    triggers.push(trigger);
  });

  return triggers;
}
