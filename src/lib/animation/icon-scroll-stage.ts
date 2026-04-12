/**
 * Icon Scroll Stage — scroll-driven DrawSVG + MorphSVG on a pinned icon
 * src/lib/animation/icon-scroll-stage.ts
 *
 * Two-column layout: text scrolls, icon is CSS-sticky.
 * As user scrolls through text sections the icon draws, morphs, and shifts colour.
 *
 * Stage actions:
 *   draw  — stroke appears (0% → 100%). If data-stage-morph is set,
 *           morphs to the new shape first (instant, invisible) then draws on.
 *   flow  — trailing edge catches up (stroke disappears forward, same direction).
 *   color — CSS color shift (stroke inherits via currentColor).
 *
 * Pattern:  draw → flow → draw(+morph) → flow → draw(+morph) → …
 *
 * HTML contract:
 *
 *   <div data-icon-scroll-stage>
 *     <div class="stage-text">
 *       <section data-stage="draw">…</section>
 *       <section data-stage="flow">…</section>
 *       <section data-stage="draw" data-stage-morph="creative/star-fill">…</section>
 *       <section data-stage="flow">…</section>
 *     </div>
 *     <div class="stage-icon">
 *       <Icon name="wellness/heart-fill" stroke size={200} />
 *     </div>
 *   </div>
 *
 * Requires: GSAP, DrawSVGPlugin, MorphSVGPlugin, ScrollTrigger
 */

import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationConfig, getScrollContainer, onThemeChange } from './animation-config';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, ScrollTrigger);

/* ================================================================
   HELPERS
   ================================================================ */

const pathCache = new Map<string, string>();

async function fetchIconPath(iconName: string): Promise<string | null> {
  if (pathCache.has(iconName)) return pathCache.get(iconName)!;
  try {
    const resp = await fetch(`/Icons/phosphor/${iconName}.svg`);
    if (!resp.ok) return null;
    const text = await resp.text();
    const match = text.match(/<path\s+d="([^"]+)"/);
    if (!match) return null;
    const cw = normalisePath(match[1]);
    pathCache.set(iconName, cw);
    return cw;
  } catch {
    return null;
  }
}

function resolveColor(val: string): string {
  if (!val?.startsWith('var(')) return val;
  const name = val.match(/var\((--[^,)]+)/)?.[1];
  if (!name) return val;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || val;
}

/* ================================================================
   PATH NORMALISATION — CW winding + aligned start point
   ================================================================ */

function reverseSubpath(sp: number[]): number[] {
  const n = (sp.length - 2) / 6;
  const rev: number[] = [sp[sp.length - 2], sp[sp.length - 1]];
  for (let s = n - 1; s >= 0; s--) {
    const b = 2 + s * 6;
    const sx = s === 0 ? sp[0] : sp[6 * s];
    const sy = s === 0 ? sp[1] : sp[6 * s + 1];
    rev.push(sp[b + 2], sp[b + 3], sp[b], sp[b + 1], sx, sy);
  }
  return rev;
}

function rotateSubpath(sp: number[], r: number): number[] {
  const n = (sp.length - 2) / 6;
  if (r <= 0 || r >= n) return sp;
  const out: number[] = [sp[6 * r], sp[6 * r + 1]];
  for (let i = 0; i < n; i++) {
    const s = (r + i) % n;
    const b = 2 + 6 * s;
    out.push(sp[b], sp[b + 1], sp[b + 2], sp[b + 3], sp[b + 4], sp[b + 5]);
  }
  return out;
}

function normalisePath(d: string): string {
  const toRaw = (MorphSVGPlugin as any).stringToRawPath as
    ((s: string) => number[][]) | undefined;
  const toStr = (MorphSVGPlugin as any).rawPathToString as
    ((r: number[][]) => string) | undefined;
  if (!toRaw || !toStr) return d;

  const ns = 'http://www.w3.org/2000/svg';
  const tmpSvg = document.createElementNS(ns, 'svg');
  tmpSvg.setAttribute('viewBox', '0 0 256 256');
  tmpSvg.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;opacity:0';
  const tmpPath = document.createElementNS(ns, 'path');
  tmpPath.setAttribute('d', d);
  tmpSvg.appendChild(tmpPath);
  document.body.appendChild(tmpSvg);

  const len = tmpPath.getTotalLength();
  const S = 200;
  let area = 0;
  for (let k = 0; k < S; k++) {
    const p1 = tmpPath.getPointAtLength((k / S) * len);
    const p2 = tmpPath.getPointAtLength(((k + 1) % S / S) * len);
    area += p1.x * p2.y - p2.x * p1.y;
  }
  document.body.removeChild(tmpSvg);

  const raw = toRaw(d);
  const sp = raw[0];
  const n = (sp.length - 2) / 6;
  if (n < 2) return d;

  if (area < 0) raw[0] = reverseSubpath(sp);

  const CX = 128, CY = 128;
  const TARGET = -Math.PI / 2;
  const cur = raw[0];
  let best = 0;
  let bestDiff = Infinity;
  for (let k = 0; k < n; k++) {
    const a = Math.atan2(cur[6 * k + 1] - CY, cur[6 * k] - CX);
    let diff = Math.abs(a - TARGET);
    if (diff > Math.PI) diff = 2 * Math.PI - diff;
    if (diff < bestDiff) { bestDiff = diff; best = k; }
  }
  if (best > 0) raw[0] = rotateSubpath(cur, best);

  return toStr(raw);
}

/* ================================================================
   INIT CONTAINER
   ================================================================ */

async function initStage(container: HTMLElement): Promise<void> {
  const iconCol = container.querySelector<HTMLElement>('.stage-icon');
  const textCol = container.querySelector<HTMLElement>('.stage-text');
  if (!iconCol || !textCol) return;

  const iconSpan = iconCol.querySelector<HTMLElement>('.icon');
  const svg = iconCol.querySelector<SVGSVGElement>('svg');
  const path = svg?.querySelector<SVGPathElement>('path[stroke]') ||
               svg?.querySelector<SVGPathElement>('path:not([fill="none"]):not([stroke="none"])') ||
               svg?.querySelector<SVGPathElement>('path');
  if (!path || !iconSpan) return;

  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  // Normalise: clockwise winding + start at 12-o'clock
  const rawD = path.getAttribute('d') || '';
  const originalD = normalisePath(rawD);
  if (originalD !== rawD) path.setAttribute('d', originalD);

  // Initial state: stroke hidden
  gsap.set(path, { drawSVG: '0%' });

  const sections = Array.from(textCol.querySelectorAll<HTMLElement>('[data-stage]'));
  if (!sections.length) return;

  // Pre-fetch all morph targets
  const morphTargets = new Map<string, string>();
  for (const sec of sections) {
    const morphName = sec.dataset.stageMorph;
    if (morphName) {
      const d = await fetchIconPath(morphName);
      if (d) morphTargets.set(morphName, d);
    }
  }

  // OverlayScrollbars viewport
  const osViewport = getScrollContainer();

  // Build timeline — each section gets 1 unit of duration
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: textCol,
      scroller: osViewport,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    },
  });

  sections.forEach((sec, i) => {
    const action = sec.dataset.stage as string;

    // Parallel colour shift on any section
    const colorVal = sec.dataset.stageColor;
    if (colorVal) {
      tl.to(iconSpan, {
        color: resolveColor(colorVal),
        duration: 1,
        ease: 'power2.inOut',
      }, i);
    }

    switch (action) {
      case 'draw': {
        // Instant morph while invisible (stroke is at 0% or flowed off)
        const morphName = sec.dataset.stageMorph;
        const morphD = morphName ? morphTargets.get(morphName) : null;
        if (morphD) {
          tl.to(path, {
            morphSVG: { shape: morphD, type: 'rotational' },
            duration: 0.01,
          }, i);
        }

        // Stroke appears: leading edge sweeps 0→100%
        tl.fromTo(path,
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 1, ease: 'power2.inOut' },
          i,
        );
        break;
      }

      case 'flow':
        // Trailing edge catches up: stroke disappears forward
        tl.fromTo(path,
          { drawSVG: '0% 100%' },
          { drawSVG: '100% 100%', duration: 1, ease: 'power2.inOut' },
          i,
        );
        break;
    }
  });

  /* ---- A11y: reduce-motion → show icon fully drawn, no animation ---- */
  onThemeChange(() => {
    if (!getAnimationConfig().canAnimate) {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(path, { drawSVG: '100%' });
    }
  });
}

/* ================================================================
   INIT
   ================================================================ */

function init(): void {
  const config = getAnimationConfig();
  if (!config.canAnimate) {
    document.querySelectorAll<HTMLElement>('[data-icon-scroll-stage]').forEach((c) => {
      const p = c.querySelector<SVGPathElement>('.stage-icon svg path');
      if (p) gsap.set(p, { drawSVG: '100%' });
    });
    return;
  }
  document.querySelectorAll<HTMLElement>('[data-icon-scroll-stage]').forEach(initStage);
}

function setup(): void {
  setTimeout(init, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
document.addEventListener('astro:page-load', setup);
