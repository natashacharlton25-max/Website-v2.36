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

export type PhysicsMode = 'fall' | 'explode' | 'float' | 'orbit' | 'shake';

interface PhysicsOptions {
  mode: PhysicsMode;
  count: number;
  spread: number;
  gravity: number;
  lifespan: number;
  magnet: boolean;
  collide: boolean;
  /** 0–1 probability a falling particle sticks on a given rect contact.
   *  0.5 (default): half pass through to the next surface below, half
   *  stick — gives distribution across multiple text rows instead of all
   *  clumping on the nearest one. 1 = original "stick on first contact". */
  stickiness: number;
  templates: HTMLTemplateElement[];
  trigger: 'click' | 'hover';
}

const DEFAULTS: PhysicsOptions = {
  mode: 'fall',
  count: 30,
  spread: 150,
  gravity: 0.4,
  lifespan: 2500,
  magnet: false,
  collide: true,
  // 0.9 default = particles mostly stick on first contact (the original
  // "lands on text" behaviour). Lower values produce the beautiful
  // cascade-to-floor effect — see Starfall preset (~0.35) where particles
  // pass through most rects and pool spectacularly on the viewport floor.
  stickiness: 0.9,
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
  scale: number;
  alive: boolean;
  born: number;
  /** Drift seed — float mode uses this for per-particle horizontal sway */
  driftSeed: number;
  /** Bounce count — shake mode settles after 2 bounces */
  bounces: number;
  /** Per-particle collide flag — mirrors Strand pattern. Scroll handler
   *  flips this off so settled-on-text particles can fall without immediately
   *  re-sticking. */
  collide: boolean;
  /** True when the particle has settled on a text/control rect (not the
   *  floor). Scroll handler unsticks these by resetting vy + collide=false. */
  stuckOnText: boolean;
}

// Global registry of all live particles across all bursts. Lets the scroll
// handler iterate every active particle to unstick those settled on text.
const allParticles: Particle[] = [];

// Hard cap on concurrent particles. Each particle's tick is cheap (no
// O(n²)) but DOM count adds up — 50 click-spammed bursts of 80 each =
// 4000 DOM nodes. Cap at 400; evict oldest when a burst would exceed it.
const MAX_ACTIVE_PARTICLES = 400;
function evictOldestParticles(toMake: number) {
  while (allParticles.length + toMake > MAX_ACTIVE_PARTICLES) {
    const oldest = allParticles[0];
    if (!oldest) break;
    oldest.el.remove();
    oldest.alive = false;
    allParticles.splice(0, 1);
  }
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
    .filter(r => r.width > 0 && r.height > 0)
    // Top-to-bottom order so pass-through advances correctly: when a
    // particle is rolled to skip rect A, the next iteration checks rect B
    // which is below A, not arbitrary DOM order.
    .sort((a, b) => a.top - b.top);
  rectsCachedAt = now;
  return collisionRects;
}
window.addEventListener('resize', () => { rectsCachedAt = 0; });

// Scroll unstick — particles stuck on text/buttons stay pinned to fixed
// viewport coordinates as the page scrolls past, which looks broken. Flip
// their collide flag off and give a small downward kick so gravity carries
// them to the floor. Floor-settled particles (vy=0 at vh-4) stay put —
// they read correctly as "resting on screen bottom".
//
// Site uses OverlayScrollbars: the scroll element is
// [data-overlayscrollbars-viewport], NOT window. Bind both.
function onPhysicsScroll() {
  if (!allParticles.some(p => p.alive && p.stuckOnText)) return;
  for (const p of allParticles) {
    if (!p.alive || !p.stuckOnText) continue;
    p.stuckOnText = false;
    p.collide = false;
    p.vy = 1; // small downward kick so gravity takes over instantly
  }
}
window.addEventListener('scroll', onPhysicsScroll, { passive: true });
function attachOsScrollPhysics() {
  const os = document.querySelector('[data-overlayscrollbars-viewport]');
  if (os) os.addEventListener('scroll', onPhysicsScroll, { passive: true });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(attachOsScrollPhysics, 300));
} else {
  setTimeout(attachOsScrollPhysics, 300);
}
document.addEventListener('astro:page-load', () => setTimeout(attachOsScrollPhysics, 300));

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
  // Cap concurrent particles before adding more — keeps DOM cost bounded
  // under click-spam.
  evictOldestParticles(opts.count);
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

    // Initial velocity — branched per mode. Each preset is just a
    // different angle/speed combo; the tick loop owns the rest.
    let angle: number, speed: number;
    switch (opts.mode) {
      case 'explode':
        // Full radial — no upward bias. Bigger speed for splash.
        angle = Math.random() * Math.PI * 2;
        speed = 6 + Math.random() * (opts.spread / 20);
        break;
      case 'float':
        // Gentle upward drift — narrow cone, low speed.
        angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        speed = 1 + Math.random() * 1.5;
        break;
      case 'orbit':
        // Tiny radial nudge so they spread before tangential force kicks in.
        angle = Math.random() * Math.PI * 2;
        speed = 0.5 + Math.random() * 1.5;
        break;
      case 'fall':
      case 'shake':
      default:
        // Upward cone, scaled by spread.
        angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
        speed = 4 + Math.random() * (opts.spread / 30);
        break;
    }

    // Stagger emit ~10ms per particle so the burst doesn't look like
    // they all came out at once. born+i*delay → tick skips them until ready.
    const emitDelay = i * 10;
    const particle: Particle = {
      el,
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (opts.mode === 'fall' || opts.mode === 'shake' ? 4 : 0),
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 14,
      scale: 0.6 + Math.random() * 0.7,
      alive: true,
      born: startTime + emitDelay,
      driftSeed: Math.random() * Math.PI * 2,
      bounces: 0,
      collide: opts.collide,
      stuckOnText: false,
    };
    particles.push(particle);
    allParticles.push(particle);
    el.style.opacity = '0';
  }

  function tick(now: number) {
    const rects = opts.collide ? getCollisionRects() : [];
    let anyAlive = false;

    for (const p of particles) {
      if (!p.alive) continue;
      anyAlive = true;
      const age = now - p.born;
      // Pre-emit phase — particle staggered after burst start, hold invisible at origin
      if (age < 0) continue;
      if (age > opts.lifespan) {
        p.el.remove();
        p.alive = false;
        const gIdx = allParticles.indexOf(p);
        if (gIdx > -1) allParticles.splice(gIdx, 1);
        continue;
      }

      // Gravity branched by mode
      if (opts.mode === 'float') {
        // Negative gravity (rise) + sinusoidal horizontal drift seeded
        // per-particle so they don't sway in unison.
        p.vy -= opts.gravity * 0.4;
        p.vx += Math.sin(now / 600 + p.driftSeed) * 0.06;
      } else if (opts.mode === 'orbit' || opts.mode === 'explode') {
        // Reduced gravity so motion stays clean
        p.vy += opts.gravity * 0.2;
      } else {
        p.vy += opts.gravity;
      }

      // Air drag — keeps motion from running away
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Force per mode
      if (opts.mode === 'orbit') {
        // Tangential force around cursor + small inward pull so they
        // stay roughly co-orbital. Perpendicular vector to (dx,dy) is
        // (-dy, dx) — that's the clockwise tangent.
        const dx = cursorX - p.x;
        const dy = cursorY - p.y;
        const d = Math.sqrt(dx * dx + dy * dy + 50);
        p.vx += (-dy / d) * 0.6;
        p.vy += (dx / d) * 0.6;
        // Mild inward pull
        p.vx += (dx / d) * 0.15;
        p.vy += (dy / d) * 0.15;
      } else if (opts.magnet) {
        // Cursor magnet (radial pull) — used by fall/explode/float when opted in
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

      // AABB collision — only when falling (vy > 0). Particles flying up
      // pass cleanly through any text on the way out. On a top-edge contact,
      // roll Math.random() < stickiness: stick if true, else pass through to
      // r.bottom + 1 and continue checking lower rects (so different particles
      // settle on different rows instead of all clumping on the highest one).
      if (p.collide && p.vy > 0) {
        const prevY = p.y - p.vy;
        for (const r of rects) {
          if (p.x < r.left || p.x > r.right || p.y < r.top || p.y > r.bottom) continue;
          if (prevY <= r.top) {
            // Falling onto top edge
            if (Math.random() < opts.stickiness) {
              p.y = r.top - 1;
              if (opts.mode === 'shake' && p.bounces < 2) {
                p.bounces++;
                p.vy = -2 - Math.random() * 2;
                p.vx = (Math.random() - 0.5) * 4;
              } else {
                p.vx = 0; p.vy = 0;
                p.stuckOnText = true;
              }
              break;
            } else {
              // Pass through — push past this rect, continue checking next
              p.y = r.bottom + 1;
              continue;
            }
          }
          // Side/below approaches while still falling are unusual for
          // physics confetti; ignore them here (string engine handles its
          // own wrap-around case).
          break;
        }
      }

      // Fade in last 400ms of life
      const fadeStart = opts.lifespan - 400;
      const opacity = age < fadeStart ? 1 : Math.max(0, 1 - (age - fadeStart) / 400);
      p.el.style.opacity = String(opacity);
      p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.scale})`;
    }

    if (anyAlive) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function readOptions(el: Element): PhysicsOptions {
  const opts: PhysicsOptions = { ...DEFAULTS };
  const get = (k: string) => el.getAttribute(`data-particle-${k}`);
  const validModes: PhysicsMode[] = ['fall', 'explode', 'float', 'orbit', 'shake'];
  const modeAttr = get('mode');
  if (modeAttr && validModes.includes(modeAttr as PhysicsMode)) {
    opts.mode = modeAttr as PhysicsMode;
  }
  if (get('count')) opts.count = parseInt(get('count')!);
  if (get('spread')) opts.spread = parseInt(get('spread')!);
  if (get('gravity')) opts.gravity = parseFloat(get('gravity')!);
  if (get('lifespan')) opts.lifespan = parseInt(get('lifespan')!);
  if (get('stickiness')) opts.stickiness = parseFloat(get('stickiness')!);
  if (el.hasAttribute('data-particle-magnet')) opts.magnet = true;
  const c = get('collide');
  if (c === 'on') opts.collide = true;
  else if (c === 'off') opts.collide = false;
  if (get('trigger') === 'hover') opts.trigger = 'hover';

  // Mode-specific defaults — explode/float/orbit ignore collision entirely
  // (the motion shape doesn't want particles snagging on text). For "land
  // somewhere" use fall or shake.
  if (opts.mode === 'explode' || opts.mode === 'float' || opts.mode === 'orbit') {
    opts.collide = false;
  }

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
      // Per-element click cooldown — 120ms = max ~8 fires/sec per button.
      // Combined with the active-particle cap, this keeps DOM cost bounded
      // under click-spam without feeling sluggish to a normal user.
      let lastClick = 0;
      htmlEl.addEventListener('click', (e) => {
        const now = performance.now();
        if (now - lastClick < 120) return;
        lastClick = now;
        fire(e);
      });
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
