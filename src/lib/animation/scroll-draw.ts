/**
 * Scroll Draw Utility
 * src/lib/animation/scroll-draw.ts
 *
 * Three modes:
 *
 * 1. ELEMENT DRAW — SVG icons/illustrations draw themselves on scroll
 *    Add `data-scroll-draw` to any element containing an <svg>
 *
 * 2. CONNECTOR LINE — A single SVG path connects elements as you scroll
 *    Add `data-scroll-connector` to a container, child elements get
 *    `data-connector-node` and the line draws between them
 *
 * 3. PATTERN DRAW — Triggers DrawSVG variants on PatternOverlay grid cells
 *    Called programmatically from pattern-morph.ts
 *
 * Requires: GSAP, DrawSVGPlugin, ScrollTrigger
 *
 * Usage:
 *
 * <!-- Element draw on scroll -->
 * <div data-scroll-draw data-draw-variant="draw" data-draw-start="top 80%">
 *   <svg viewBox="0 0 256 256"><path d="..." /></svg>
 * </div>
 *
 * <!-- Draw from center -->
 * <div data-scroll-draw data-draw-variant="drawcenter">
 *   <svg>...</svg>
 * </div>
 *
 * <!-- Rainbow chase on scroll -->
 * <div data-scroll-draw data-draw-variant="rainbowchase" data-draw-scrub="true">
 *   <svg>...</svg>
 * </div>
 *
 * <!-- Scrubbed draw — follows scroll position exactly -->
 * <div data-scroll-draw data-draw-scrub="true">
 *   <svg>...</svg>
 * </div>
 *
 * <!-- Connector line between elements -->
 * <div data-scroll-connector data-connector-color="var(--brand-c-primary)">
 *   <section data-connector-node>First section</section>
 *   <section data-connector-node>Second section</section>
 *   <section data-connector-node>Third section</section>
 * </div>
 */

import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationConfig, getScrollContainer } from './animation-config';

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

/* ================================================================
   TYPES
   ================================================================ */

type DrawVariant = 'draw' | 'drawcenter' | 'chachaslide' | 'pulse';

interface ScrollDrawConfig {
  variant: DrawVariant;
  scrub: boolean;
  start: string;
  end: string;
  color: string;
  strokeWidth: number;
  once: boolean;
}

/* ================================================================
   HELPERS
   ================================================================ */

function resolveColor(cssVar: string): string {
  if (!cssVar?.startsWith('var(')) return cssVar;
  const varName = cssVar.match(/var\((.*?)\)/)?.[1];
  if (!varName) return cssVar;
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || cssVar;
}

function getAccentColors(): string[] {
  const cs = getComputedStyle(document.documentElement);
  return [
    cs.getPropertyValue('--rainbow-1').trim(),
    cs.getPropertyValue('--rainbow-2').trim(),
    cs.getPropertyValue('--rainbow-3').trim(),
    cs.getPropertyValue('--rainbow-4').trim(),
    cs.getPropertyValue('--rainbow-5').trim(),
  ].filter(Boolean);
}

function getRainbowColors(): string[] {
  const cs = getComputedStyle(document.documentElement);
  return [
    cs.getPropertyValue('--rainbow-1').trim(),
    cs.getPropertyValue('--rainbow-2').trim(),
    cs.getPropertyValue('--rainbow-3').trim(),
    cs.getPropertyValue('--rainbow-4').trim(),
    cs.getPropertyValue('--rainbow-5').trim(),
    cs.getPropertyValue('--rainbow-6').trim(),
  ].filter(Boolean);
}

/* ================================================================
   1. ELEMENT DRAW — SVGs that draw on scroll
   ================================================================ */

function initElementDraw(el: HTMLElement, scroller?: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;

  const paths = Array.from(svg.querySelectorAll('path, line, polyline, polygon, circle, ellipse, rect'));
  if (!paths.length) return;

  // Convert non-path elements to paths for DrawSVG
  const svgPaths: SVGPathElement[] = [];
  for (const shape of paths) {
    if (shape.tagName === 'path') {
      svgPaths.push(shape as SVGPathElement);
    } else {
      // DrawSVGPlugin.convertToPath handles this
      try {
        const converted = DrawSVGPlugin.getLength(shape as SVGGeometryElement);
        if (converted > 0) svgPaths.push(shape as unknown as SVGPathElement);
      } catch {
        // Skip unconvertible elements
      }
    }
  }

  const config: ScrollDrawConfig = {
    variant: (el.dataset.drawVariant as DrawVariant) || 'draw',
    scrub: el.dataset.drawScrub === 'true',
    start: el.dataset.drawStart || 'top 80%',
    end: el.dataset.drawEnd || 'top 30%',
    color: el.dataset.drawColor || 'var(--brand-c-primary)',
    strokeWidth: Number(el.dataset.drawStrokeWidth) || 2,
    once: el.dataset.drawOnce !== 'false',
  };

  const resolvedColor = resolveColor(config.color);

  // Set initial state — stroked, not filled, hidden
  svgPaths.forEach(path => {
    gsap.set(path, {
      drawSVG: '0%',
      stroke: resolvedColor,
      strokeWidth: config.strokeWidth,
      fill: 'none',
    });
  });

  if (config.scrub) {
    // Scrubbed — draw follows scroll position
    buildScrubDraw(svgPaths, config, el, resolvedColor, scroller);
  } else {
    // Triggered — plays once when element enters viewport
    buildTriggeredDraw(svgPaths, config, el, resolvedColor, scroller);
  }
}

function buildScrubDraw(paths: SVGPathElement[], config: ScrollDrawConfig, trigger: HTMLElement, color: string, scroller?: HTMLElement) {
  // Build the variant timeline, then attach a scrub ScrollTrigger to it
  const variantTl = playDrawVariant(paths, config.variant, color, 1, 0.1);

  // Wrap in a parent timeline with scrub ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      scroller: scroller || undefined,
      start: config.start,
      end: config.end,
      scrub: 1,
      once: config.once,
    },
  });

  tl.add(variantTl, 0);
}

function buildTriggeredDraw(paths: SVGPathElement[], config: ScrollDrawConfig, trigger: HTMLElement, color: string, scroller?: HTMLElement) {
  ScrollTrigger.create({
    trigger,
    scroller: scroller || undefined,
    start: config.start,
    once: config.once,
    onEnter: () => playDrawVariant(paths, config.variant, color),
  });
}

/**
 * Play a DrawSVG variant on a set of paths.
 * Exported so pattern-morph.ts can call it directly on grid cells.
 */
export function playDrawVariant(
  paths: SVGPathElement[],
  variant: DrawVariant,
  color: string,
  duration: number = 0.8,
  stagger: number = 0
): gsap.core.Timeline {
  const tl = gsap.timeline();
  const accentColors = getAccentColors();
  const rainbowColors = getRainbowColors();

  paths.forEach((path, index) => {
    const offset = index * stagger;

    switch (variant) {
      case 'draw':
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: 2 },
          { drawSVG: '100%', duration, ease: 'power2.inOut' },
          offset
        );
        break;

      case 'drawcenter':
        tl.fromTo(path,
          { drawSVG: '50% 50%', stroke: color, strokeWidth: 2 },
          { drawSVG: '0% 100%', duration, ease: 'power2.inOut' },
          offset
        );
        break;

      case 'pulse':
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: 3, opacity: 0.8 },
          { drawSVG: '100%', duration: duration * 0.5, ease: 'power2.out' },
          offset
        )
        .to(path,
          { strokeWidth: 1.5, opacity: 1, duration: duration * 0.5, ease: 'power2.in' },
          offset + duration * 0.5
        );
        break;

      case 'chachaslide': {
        const half = duration * 0.5;
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: 2 },
          { drawSVG: '100%', duration: half, ease: 'power1.in' },
          offset
        )
        .set(path, { stroke: accentColors[1] || color }, offset + half)
        .fromTo(path,
          { drawSVG: '100% 100%' },
          { drawSVG: '0% 100%', duration: half, ease: 'power1.in' },
          offset + half
        );
        break;
      }

    }
  });

  return tl;
}


/* ================================================================
   2. CONNECTOR LINE — SVG path that threads between elements
   ================================================================ */

function initConnectorLine(container: HTMLElement, scroller?: HTMLElement) {
  const nodes = Array.from(container.querySelectorAll<HTMLElement>('[data-connector-node]'));
  if (nodes.length < 2) return;

  const color = resolveColor(container.dataset.connectorColor || 'var(--brand-c-primary)');
  const strokeWidth = Number(container.dataset.connectorStroke) || 2;
  const variant = (container.dataset.connectorVariant as DrawVariant) || 'draw';
  const curve = container.dataset.connectorCurve !== 'false'; // Default: smooth curves

  // Create SVG overlay
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'scroll-connector-svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: visible;
  `;

  // Build path through node centers
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', String(strokeWidth));
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(path);

  // Optional dot markers at each node
  const dots: SVGCircleElement[] = [];
  if (container.dataset.connectorDots !== 'false') {
    nodes.forEach(() => {
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', String(strokeWidth * 2.5));
      dot.setAttribute('fill', color);
      dot.setAttribute('opacity', '0');
      svg.appendChild(dot);
      dots.push(dot);
    });
  }

  // Insert SVG — container must be position: relative
  container.style.position = container.style.position || 'relative';
  container.insertBefore(svg, container.firstChild);

  function updatePath() {
    const containerRect = container.getBoundingClientRect();
    const scrollY = container.scrollTop || 0;

    // Get node positions relative to container
    const points = nodes.map(node => {
      const rect = node.getBoundingClientRect();
      return {
        x: (rect.left - containerRect.left) + rect.width / 2,
        y: (rect.top - containerRect.top) + scrollY + rect.height / 2,
      };
    });

    // Update SVG viewBox
    svg.setAttribute('viewBox', `0 0 ${containerRect.width} ${container.scrollHeight || containerRect.height}`);

    // Build path data
    let d: string;
    if (curve && points.length > 2) {
      // Smooth cubic bezier through points
      d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midY = (prev.y + curr.y) / 2;
        d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
      }
    } else {
      // Straight lines
      d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    }

    path.setAttribute('d', d);

    // Position dots
    dots.forEach((dot, i) => {
      dot.setAttribute('cx', String(points[i].x));
      dot.setAttribute('cy', String(points[i].y));
    });
  }

  // Initial layout
  updatePath();

  // Recalculate on resize
  const ro = new ResizeObserver(updatePath);
  ro.observe(container);

  // Set initial state
  gsap.set(path, { drawSVG: '0%' });
  dots.forEach(dot => gsap.set(dot, { opacity: 0, scale: 0 }));

  // Animate the line drawing on scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      scroller: scroller || undefined,
      start: container.dataset.connectorStart || 'top 70%',
      end: container.dataset.connectorEnd || 'bottom 30%',
      scrub: 1,
    },
  });

  // Draw the line
  tl.fromTo(path,
    { drawSVG: '0%', stroke: color, strokeWidth },
    { drawSVG: '100%', duration: 1, ease: 'none' },
    0
  );

  // Pop dots in at evenly spaced intervals
  dots.forEach((dot, i) => {
    const progress = i / (dots.length - 1);
    tl.to(dot,
      { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(2)' },
      progress
    );
  });
}


/* ================================================================
   3. PATTERN DRAW — For pattern-morph.ts integration
   ================================================================ */

/**
 * Trigger a DrawSVG variant across a grid of SVG paths with radial stagger.
 * Called from pattern-morph.ts when a section defines data-scroll-effect.
 *
 * @param paths      - Array of SVGPathElement from pattern grid cells
 * @param variant    - DrawSVG variant name
 * @param color      - Brand colour to draw with
 * @param centerX    - Center X for radial stagger calc
 * @param centerY    - Center Y for radial stagger calc
 * @param getCellRect - Function to get bounding rect for each path's parent cell
 */
export function drawPatternGrid(
  paths: SVGPathElement[],
  variant: DrawVariant,
  color: string,
  centerX: number,
  centerY: number,
  getCellRect: (path: SVGPathElement) => DOMRect | null
): gsap.core.Timeline {
  // Sort by distance from center for radial wave
  const sorted = [...paths]
    .map(path => {
      const rect = getCellRect(path);
      if (!rect) return { path, dist: 0 };
      const dx = (rect.left + rect.width / 2) - centerX;
      const dy = (rect.top + rect.height / 2) - centerY;
      return { path, dist: Math.sqrt(dx * dx + dy * dy) };
    })
    .sort((a, b) => a.dist - b.dist)
    .map(p => p.path);

  return playDrawVariant(sorted, variant, color, 0.6, 0.006);
}


/* ================================================================
   INIT
   ================================================================ */

export function initScrollDraw() {
  const config = getAnimationConfig();
  if (!config.canAnimate) return;

  // Detect OverlayScrollbars viewport — the actual scroll container
  const osViewport = getScrollContainer();

  // Element draws
  document.querySelectorAll<HTMLElement>('[data-scroll-draw]').forEach(el => initElementDraw(el, osViewport));

  // Connector lines
  document.querySelectorAll<HTMLElement>('[data-scroll-connector]').forEach(el => initConnectorLine(el, osViewport));
}

// Auto-init
if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', initScrollDraw);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollDraw);
  } else {
    initScrollDraw();
  }
}
