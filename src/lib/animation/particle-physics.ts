/**
 * Particle Physics — DOM particles with gravity + AABB collision + cursor magnet.
 *
 * Sibling to particle-burst.ts. Used by the Burst atom when engine='physics'.
 * Each particle is a <div> (or cloned <template> content) with frame-by-frame
 * x/y/vx/vy integration. On every tick:
 *   - apply gravity to vy
 *   - apply optional magnet force toward cursor
 *   - move particle
 *   - check AABB collision against cached text/control rects on the page
 *   - if hit: stop (vx=vy=0), settle on top of the rect
 *   - kill particle after lifespan ms (fade-out via Web Animations)
 *
 * No canvas, no Matter.js. Lives ~2s per particle so effects-manager FPS
 * throttling is unnecessary (that throttler is for forever-loops).
 *
 * Wires into Burst atom via:
 *   data-particle-burst, data-particle-engine="physics"
 *   data-particle-templates="tplId-1,tplId-2,..."  (optional: clone templates)
 *   data-particle-trigger="click|hover"
 *   data-particle-count, data-particle-spread, data-particle-lifespan
 *   data-particle-gravity, data-particle-magnet, data-particle-collide="off"
 */

import { getAnimationConfig } from './animation-config';

interface PhysicsOptions {
  count: number;
  spread: number;
  gravity: number;
  lifespan: number;
  magnet: boolean;
  collide: boolean;
  templates: HTMLTemplateElement[];
  trigger: 'click' | 'hover';
}

const DEFAULTS: PhysicsOptions = {
  count: 30,
  spread: 150,
  gravity: 0.4,
  lifespan: 2500,
  magnet: false,
  collide: true,
  templates: [],
  trigger: 'click',
};

// Selector for elements that "catch" particles. Tuned for the typical
// content surface — text and interactive controls.
const COLLIDE_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, button, a, li';

interface Particle {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  alive: boolean;
  born: number;
}

// Shared cursor position — mousemove updates this for any active magnet
// burst. One listener instead of one-per-burst.
let cursorX = 0;
let cursorY = 0;
let cursorBound = false;
function bindCursor() {
  if (cursorBound) return;
  cursorBound = true;
  window.addEventListener('mousemove', (e) => { cursorX = e.clientX; cursorY = e.clientY; });
}

// Cached collision rects, refreshed on resize/scroll. Recomputing every
// frame would be wasteful — most pages don't reflow during a 2s burst.
let collisionRects: DOMRect[] = [];
let rectsCachedAt = 0;
const RECT_CACHE_MS = 500;
function getCollisionRects(): DOMRect[] {
  const now = performance.now();
  if (now - rectsCachedAt < RECT_CACHE_MS) return collisionRects;
  collisionRects = Array.from(document.querySelectorAll(COLLIDE_SELECTOR))
    .map(el => el.getBoundingClientRect())
    .filter(r => r.width > 0 && r.height > 0);
  rectsCachedAt = now;
  return collisionRects;
}
window.addEventListener('resize', () => { rectsCachedAt = 0; });

function spawnBurst(origin: HTMLElement, opts: PhysicsOptions): void {
  // Burst wrapper holds <template>s before the slotted child. Walk to the
  // first non-template child for the real visual rect (a Grid parent can
  // stretch the wrapper, which would push origin past the button edge).
  let originEl: Element = origin;
  for (const child of Array.from(origin.children)) {
    if (child.tagName !== 'TEMPLATE') { originEl = child; break; }
  }
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const particles: Particle[] = [];
  const startTime = performance.now();

  for (let i = 0; i < opts.count; i++) {
    const el = document.createElement('div');
    el.className = 'particle-physics';
    el.style.cssText = `
      position: fixed;
      left: 0; top: 0;
      pointer-events: none;
      z-index: 9999;
      will-change: transform;
    `;

    // Clone a Shape template if Burst supplied any
    if (opts.templates.length) {
      const tpl = opts.templates[Math.floor(Math.random() * opts.templates.length)];
      el.appendChild(tpl.content.cloneNode(true));
    } else {
      // Fallback: a small confetti rect so misconfig still shows something
      el.style.width = '10px';
      el.style.height = '10px';
      el.style.background = 'currentColor';
    }
    document.body.appendChild(el);

    // Initial velocity — upward cone, scaled by spread
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
    const speed = 4 + Math.random() * (opts.spread / 30);
    particles.push({
      el,
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      rotation: 0,
      spin: (Math.random() - 0.5) * 8,
      alive: true,
      born: startTime,
    });
  }

  function tick(now: number) {
    const rects = opts.collide ? getCollisionRects() : [];
    let anyAlive = false;

    for (const p of particles) {
      if (!p.alive) continue;
      anyAlive = true;
      const age = now - p.born;
      if (age > opts.lifespan) { p.el.remove(); p.alive = false; continue; }

      // Gravity
      p.vy += opts.gravity;
      // Air drag — keeps motion from running away
      p.vx *= 0.99;
      p.vy *= 0.99;
      // Cursor magnet
      if (opts.magnet) {
        const dx = cursorX - p.x;
        const dy = cursorY - p.y;
        const d2 = dx * dx + dy * dy + 100; // softening
        const f = 200 / d2;
        p.vx += dx * f;
        p.vy += dy * f;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;

      // Floor: viewport bottom — settle (don't bounce off-screen)
      const vh = window.innerHeight;
      if (p.y > vh - 4) { p.y = vh - 4; p.vx = 0; p.vy = 0; }

      // AABB collision against cached element rects — particles "land on" text
      if (opts.collide && p.vy > 0) {
        for (const r of rects) {
          if (p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.top + 6) {
            p.y = r.top - 1;
            p.vx = 0;
            p.vy = 0;
            break;
          }
        }
      }

      // Fade in last 400ms of life
      const fadeStart = opts.lifespan - 400;
      const opacity = age < fadeStart ? 1 : Math.max(0, 1 - (age - fadeStart) / 400);
      p.el.style.opacity = String(opacity);
      p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.rotation}deg)`;
    }

    if (anyAlive) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function readOptions(el: Element): PhysicsOptions {
  const opts: PhysicsOptions = { ...DEFAULTS };
  const get = (k: string) => el.getAttribute(`data-particle-${k}`);
  if (get('count')) opts.count = parseInt(get('count')!);
  if (get('spread')) opts.spread = parseInt(get('spread')!);
  if (get('gravity')) opts.gravity = parseFloat(get('gravity')!);
  if (get('lifespan')) opts.lifespan = parseInt(get('lifespan')!);
  if (el.hasAttribute('data-particle-magnet')) opts.magnet = true;
  if (get('collide') === 'off') opts.collide = false;
  if (get('trigger') === 'hover') opts.trigger = 'hover';

  const tplAttr = get('templates');
  if (tplAttr) {
    opts.templates = tplAttr
      .split(',')
      .map(id => document.getElementById(id.trim()))
      .filter((t): t is HTMLTemplateElement => t instanceof HTMLTemplateElement);
  }
  return opts;
}

export function initParticlePhysics(): void {
  if (typeof window === 'undefined') return;
  bindCursor();

  document.querySelectorAll('[data-particle-burst][data-particle-engine="physics"]').forEach((element) => {
    if (element.hasAttribute('data-particle-physics-bound')) return;
    element.setAttribute('data-particle-physics-bound', 'true');

    const htmlEl = element as HTMLElement;
    const opts = readOptions(element);

    const fire = (e: Event) => {
      if (!getAnimationConfig().canAnimate) return;
      spawnBurst(htmlEl, opts);
      // Link delay-nav so the burst is visible before navigation
      if (element.tagName === 'A' && (element as HTMLAnchorElement).href) {
        e.preventDefault();
        const href = (element as HTMLAnchorElement).href;
        setTimeout(() => { window.location.href = href; }, 400);
      }
    };

    if (opts.trigger === 'hover') {
      let cooldown = false;
      htmlEl.addEventListener('mouseenter', (e) => {
        if (cooldown) return;
        cooldown = true;
        fire(e);
        setTimeout(() => { cooldown = false; }, 2000);
      });
    } else {
      htmlEl.addEventListener('click', fire);
    }
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticlePhysics);
  } else {
    initParticlePhysics();
  }
  document.addEventListener('astro:page-load', initParticlePhysics);
}
