/**
 * Cursor Draw Reveal — proximity-triggered DrawSVG + MorphSVG on icon grids
 * src/lib/animation/cursor-draw-reveal.ts
 */

import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);

type Mode = 'reveal' | 'draw' | 'morph' | 'mix';

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
    pathCache.set(iconName, match[1]);
    return match[1];
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

function prefersReducedMotion(): boolean {
  const w = document.getElementById('a11y-content-wrapper');
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !!w?.classList.contains('a11y-reduce-motion') ||
    !!w?.classList.contains('a11y-text-only')
  );
}

/* ================================================================
   CELL STATE
   ================================================================ */

interface CellState {
  cell: HTMLElement;
  path: SVGPathElement;
  originalD: string;
  cx: number;
  cy: number;
  active: boolean;
}

/* ================================================================
   STROKE CONVERSION
   ================================================================ */

/** Convert a grid cell's fill-mode icon to stroke mode for DrawSVG */
function toStroke(cell: HTMLElement, sw: number, initialStroke: string): SVGPathElement | null {
  const iconSpan = cell.querySelector<HTMLElement>('.icon');
  const svg = cell.querySelector('svg');
  if (!svg) return null;

  // Add stroke class so Icon.astro CSS doesn't force fill: currentColor
  if (iconSpan) iconSpan.classList.add('icon--stroke');

  // Kill fill on every element inside the SVG — inline style beats all CSS
  svg.style.setProperty('fill', 'none', 'important');
  svg.querySelectorAll('*').forEach((el) => {
    (el as HTMLElement).style.setProperty('fill', 'none', 'important');
  });

  // Find the main shape path
  const path = svg.querySelector<SVGPathElement>('path:not([fill="none"])') ||
               svg.querySelector<SVGPathElement>('path');
  if (!path) return null;

  // Set stroke via inline style — beats any CSS
  path.style.setProperty('stroke', initialStroke);
  path.style.setProperty('stroke-width', String(sw));
  path.style.setProperty('stroke-linecap', 'round');
  path.style.setProperty('stroke-linejoin', 'round');
  // CSS transition for colour — GSAP handles drawSVG/morph only
  path.style.setProperty('transition', 'stroke 0.4s ease');

  return path;
}

/* ================================================================
   CONTAINER INIT
   ================================================================ */

async function initContainer(container: HTMLElement): Promise<void> {
  const overlay = container.querySelector<HTMLElement>('.pattern-overlay--grid');
  if (!overlay) return;

  // Parse config from data attributes
  const mode = (container.dataset.drawMode as Mode) || 'draw';
  const proximity = Number(container.dataset.drawProximity) || 180;
  const morphTarget = container.dataset.morphTarget || '';
  const sw = Number(container.dataset.drawStrokeWidth) || 16;

  // Resolve colours — hardcoded debug fallbacks ensure GSAP gets valid hex
  let accentColor = resolveColor(container.dataset.drawColor || 'var(--brand-c-primary)');
  let bgColor = resolveColor(container.dataset.drawBgColor || 'var(--brand-c-bg)');
  if (!accentColor || accentColor.startsWith('var(')) accentColor = '#e85d04';
  if (!bgColor || bgColor.startsWith('var(')) bgColor = '#faf6f1';

  console.log(`[cursor-draw] mode=${mode} accent=${accentColor} bg=${bgColor}`);

  // Pre-fetch morph target path
  let morphD: string | null = null;
  if ((mode === 'morph' || mode === 'mix') && morphTarget) {
    morphD = await fetchIconPath(morphTarget);
  }

  // Determine initial stroke colour
  const initialStroke = (mode === 'draw') ? accentColor : bgColor;

  // Build cell states
  const cells = Array.from(overlay.querySelectorAll<HTMLElement>('.pattern-overlay__cell'));
  const states: CellState[] = [];

  for (const cell of cells) {
    const path = toStroke(cell, sw, initialStroke);
    if (!path) continue;

    const originalD = path.getAttribute('d') || '';

    // Set initial drawSVG state
    if (mode === 'draw' || mode === 'mix') {
      gsap.set(path, { drawSVG: '0%' });
    } else {
      gsap.set(path, { drawSVG: '100%' });
    }

    states.push({ cell, path, originalD, cx: 0, cy: 0, active: false });
  }

  console.log(`[cursor-draw] ${states.length} cells initialised`);
  if (!states.length) return;

  // Calculate cell centres relative to container
  function updateCentres(): void {
    const cr = container.getBoundingClientRect();
    for (const s of states) {
      const r = s.cell.getBoundingClientRect();
      s.cx = r.left + r.width / 2 - cr.left;
      s.cy = r.top + r.height / 2 - cr.top;
    }
  }
  updateCentres();
  new ResizeObserver(updateCentres).observe(container);

  /* ---- Activate / deactivate ---- */

  function activate(s: CellState, strength: number): void {
    if (s.active) return;
    s.active = true;

    // Closer cells animate faster
    const dur = 0.3 + (1 - strength) * 0.4;

    // Colour shift — direct inline style
    if (mode === 'reveal' || mode === 'morph' || mode === 'mix') {
      console.log('[cursor-draw] ACTIVATE stroke →', accentColor);
      s.path.style.setProperty('stroke', accentColor, 'important');
    }

    if (mode === 'draw' || mode === 'mix') {
      gsap.to(s.path, {
        drawSVG: '100%',
        duration: dur,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    }

    if ((mode === 'morph' || mode === 'mix') && morphD) {
      gsap.to(s.path, {
        morphSVG: { shape: morphD, type: 'rotational' },
        duration: dur * 1.2,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  }

  function deactivate(s: CellState): void {
    if (!s.active) return;
    s.active = false;

    const dur = 0.6;

    if (mode === 'reveal' || mode === 'morph' || mode === 'mix') {
      s.path.style.stroke = bgColor;
    }

    if (mode === 'draw' || mode === 'mix') {
      gsap.to(s.path, {
        drawSVG: '0%',
        duration: dur,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    }

    if ((mode === 'morph' || mode === 'mix') && morphD) {
      gsap.to(s.path, {
        morphSVG: { shape: s.originalD, type: 'rotational' },
        duration: dur,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    }
  }

  /* ---- Proximity detection ---- */

  let rafId = 0;

  function handleMove(mx: number, my: number): void {
    for (const s of states) {
      const dx = s.cx - mx;
      const dy = s.cy - my;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < proximity) {
        activate(s, 1 - dist / proximity);
      } else {
        deactivate(s);
      }
    }
  }

  container.addEventListener('mousemove', (e: MouseEvent) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const r = container.getBoundingClientRect();
      handleMove(e.clientX - r.left, e.clientY - r.top);
    });
  });

  container.addEventListener('touchmove', (e: TouchEvent) => {
    if (!e.touches.length) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const r = container.getBoundingClientRect();
      handleMove(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    });
  }, { passive: true });

  container.addEventListener('mouseleave', () => {
    cancelAnimationFrame(rafId);
    for (const s of states) deactivate(s);
  });

  /* ---- A11y watcher — reset on reduce-motion toggle ---- */
  const wrapper = document.getElementById('a11y-content-wrapper');
  if (wrapper) {
    new MutationObserver(() => {
      if (prefersReducedMotion()) {
        for (const s of states) {
          gsap.killTweensOf(s.path);
          s.active = false;
          gsap.set(s.path, { drawSVG: '100%' });
          s.path.style.stroke = accentColor;
        }
      }
    }).observe(wrapper, { attributes: true, attributeFilter: ['class'] });
  }
}

/* ================================================================
   INIT
   ================================================================ */

function init(): void {
  if (prefersReducedMotion()) return;
  document.querySelectorAll<HTMLElement>('[data-cursor-draw]').forEach(initContainer);
}

// 300ms delay for OverlayScrollbars + DOM readiness
function setup(): void {
  setTimeout(init, 300);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup);
} else {
  setup();
}
document.addEventListener('astro:page-load', setup);
