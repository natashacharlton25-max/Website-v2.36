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
import { computeTraceFrame, samplePath } from './trace-path';

export type PhysicsMode = 'fall' | 'explode' | 'float' | 'orbit' | 'shake';
export type SpawnFrom = 'origin' | 'top' | 'bottom' | 'left' | 'right' | 'edges' | 'viewport';
export type SpawnTo = 'away' | 'origin' | 'cursor' | 'target';

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
  trigger: 'click' | 'hover' | 'hover-hold' | 'viewport' | 'pin';
  from: SpawnFrom;
  to: SpawnTo;
  /** Element matched by `target` selector (resolved at spawn time). When
   *  `to === 'target'`, particles aim at this element's centre. */
  targetEl: Element | null;
  /** Trace path data — one or more SVG path strings. When set, each
   *  particle's destination is a sampled point along these paths
   *  (cyclically distributed across N paths × count particles).
   *  Particles converge to form letter outlines instead of clumping
   *  at a single destination. Mirrors the string engine's tracePath. */
  tracePaths: string[];
  traceSize: number;
  traceOffsetX: number;
  traceOffsetY: number;
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
  from: 'origin',
  to: 'away',
  targetEl: null,
  tracePaths: [],
  traceSize: 240,
  traceOffsetX: 0,
  traceOffsetY: 0,
};

// Pick a per-particle spawn position based on the `from` enum. Edge values
// sample randomly along that viewport edge. 'edges' picks one of the four
// at random per particle. 'viewport' picks anywhere.
function pickSpawnPos(from: SpawnFrom, originX: number, originY: number): { x: number; y: number } {
  const vw = window.innerWidth, vh = window.innerHeight;
  switch (from) {
    case 'top':      return { x: Math.random() * vw, y: 0 };
    case 'bottom':   return { x: Math.random() * vw, y: vh };
    case 'left':     return { x: 0, y: Math.random() * vh };
    case 'right':    return { x: vw, y: Math.random() * vh };
    case 'edges': {
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) return { x: Math.random() * vw, y: 0 };
      if (edge === 1) return { x: Math.random() * vw, y: vh };
      if (edge === 2) return { x: 0, y: Math.random() * vh };
      return { x: vw, y: Math.random() * vh };
    }
    case 'viewport': return { x: Math.random() * vw, y: Math.random() * vh };
    default:         return { x: originX, y: originY };
  }
}

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
  /** Convergence mode: origin/target. When set, the tick loop ignores
   *  vx/vy/gravity/floor and lerps from spawn to dest with ease-out so
   *  the particle actually arrives and settles instead of flying past. */
  converge: boolean;
  spawnX: number;
  spawnY: number;
  destX: number;
  destY: number;
  /** True if the particle should NOT auto-remove via its age check.
   *  Set by the scroll-release handler on tracePath physics bursts so
   *  the swarm persists between sections of the scrollytelling loop. */
  persistent: boolean;
  /** performance.now() when this particle was re-snatched. Scroll
   *  handler skips release for 3s after re-snatch so the same scroll
   *  that triggered the viewport doesn't immediately re-release them. */
  relaunchedAt: number;
  /** True when this particle is a tracePath particle (forms letters).
   *  Tracked separately from converge because converge gets cleared
   *  on scroll-release for swarm mode but we still need to know
   *  this particle belongs to a trace burst (so re-snatch can find it). */
  isTracing: boolean;
  /** Dest stored as OFFSET from the burst origin centre. Each tick
   *  recomputes the live destX/destY from the origin's CURRENT rect
   *  so letters track the section as it scrolls. Needed for card-and-
   *  letters layouts where the section moves through viewport during
   *  the animation. */
  destOffsetX: number;
  destOffsetY: number;
}

// Global registry of all live particles across all bursts. Lets the scroll
// handler iterate every active particle to unstick those settled on text.
const allParticles: Particle[] = [];

// Hard cap on concurrent particles. Each particle's tick is cheap (no
// O(n²)) but DOM count adds up — 50 click-spammed bursts of 80 each =
// 4000 DOM nodes. Cap at 1200 to support dense dot-typography bursts
// (scrollytelling form-letters-from-dots needs ~700+ for legibility).
const MAX_ACTIVE_PARTICLES = 1200;
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
  if (!allParticles.some(p => p.alive && (p.stuckOnText || p.isTracing))) return;
  const now = performance.now();

  // Compute the centroid of release-eligible trace particles so the
  // fly-out radiates from the WORD's centre (not screen centre).
  // Screen-centre version biased everything upward when the word sat
  // above viewport mid (traceOffsetY: -150 etc.), so dots clustered
  // on the top edge instead of distributing radially in all directions.
  let cx = 0, cy = 0, cnt = 0;
  for (const p of allParticles) {
    if (p.alive && p.isTracing && !p.persistent && p.relaunchedAt < now - 3000) {
      cx += p.x; cy += p.y; cnt++;
    }
  }
  if (cnt > 0) { cx /= cnt; cy /= cnt; }

  for (const p of allParticles) {
    if (!p.alive) continue;
    // Stuck-on-text release (original behaviour) — drop onto floor
    if (p.stuckOnText) {
      p.stuckOnText = false;
      p.collide = false;
      p.vy = 1;
    }
    // Trace-particle release → fly out from word centre to viewport
    // edges, then drift. Each particle gets a strong velocity pointing
    // AWAY from the word centroid at release, so they scatter radially
    // in all directions (not biased to one edge by the word's vertical
    // offset on screen).
    //
    // Only the FIRST scroll event applies the kick — !p.persistent
    // means "not yet released". Subsequent scroll events skip the
    // already-released particle, so the fly-out animation runs at
    // its own pace from the initial kick rather than being re-driven
    // by every scroll wheel tick.
    // Skip particles within 3s of a re-snatch (the same scroll that
    // triggered the viewport entry shouldn't immediately re-release).
    if (p.isTracing && !p.persistent && p.relaunchedAt < now - 3000) {
      p.converge = false;
      p.persistent = true;
      p.collide = false;
      // Position-based direction (from word centroid) BLENDED with a
      // wide random jitter (±90° = π/2). Position alone clusters all
      // dots on the left/right because the formed word is ~5x wider
      // than it is tall — outward-from-centroid vectors strongly favour
      // the horizontal axis. Adding random spread disperses them
      // evenly across all four edges while keeping a soft bias toward
      // "outward from where you are now".
      const dx = p.x - cx;
      const dy = p.y - cy;
      const positionAngle = Math.atan2(dy, dx);
      const jitter = (Math.random() - 0.5) * Math.PI;
      const angle = positionAngle + jitter;
      // 14–20 px/frame outward — strong enough that air drag (0.99/f)
      // still gets particles across the viewport before they decay
      // into the drift phase. The sin/cos drift in the tick loop then
      // keeps them alive at the edges.
      const flySpeed = 14 + Math.random() * 6;
      p.vx = Math.cos(angle) * flySpeed;
      p.vy = Math.sin(angle) * flySpeed;
    }
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
  // Speedgate: scale lifespan once at spawn so every downstream age
  // comparison, fade window, and convergence frac uses the same value.
  // opts is a fresh object per call (readOptions returns {...DEFAULTS}),
  // so mutation is burst-local and safe.
  const speedScale = getAnimationConfig().durationScale;
  if (opts.lifespan > 0) opts.lifespan *= speedScale;
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
  // Eviction deferred — for tracePath bursts we want to REUSE existing
  // isTracing particles via the re-snatch path below. Evicting first
  // would remove the very particles we want to reuse (count + existing
  // ~= 2x cap forces ~half of existing isTracing to be evicted before
  // re-snatch can see them). Defer to the spawn-new fallback below.
  const particles: Particle[] = [];
  const startTime = performance.now();

  // Resolve target centre once (used by `to: 'target'`). Falls back to
  // origin if selector doesn't match.
  let targetX = cx, targetY = cy;
  if (opts.to === 'target' && opts.targetEl) {
    const tr = opts.targetEl.getBoundingClientRect();
    targetX = tr.left + tr.width / 2;
    targetY = tr.top + tr.height / 2;
  }

  // tracePath sampling — each particle gets a sampled outline point as
  // its destination, so the swarm forms letters/logos instead of
  // clumping at one point.
  //
  // Order matters: traceDests is INTERLEAVED across paths so that
  // particles[0..numPaths-1] hit one point in each letter, then
  // particles[numPaths..2*numPaths-1] hit the next point per letter,
  // etc. This way a partial slice of particles (e.g., 200 out of 1000)
  // still covers every letter — without interleaving, the first 200
  // would all clump on the first letter.
  let traceDests: { x: number; y: number }[] = [];
  if (opts.tracePaths.length > 0) {
    const traceFrame = computeTraceFrame(opts.tracePaths, opts.traceSize);
    const offsetX = (opts.to === 'target' ? targetX : cx) + opts.traceOffsetX;
    const offsetY = (opts.to === 'target' ? targetY : cy) + opts.traceOffsetY;
    const samplesPerPath = Math.ceil(opts.count / opts.tracePaths.length);
    const perPath: { x: number; y: number }[][] = [];
    for (const pathData of opts.tracePaths) {
      const sampled = samplePath(pathData, samplesPerPath, offsetX, offsetY, traceFrame);
      perPath.push(sampled.points);
    }
    // Interleave: round-robin across letters
    for (let i = 0; i < samplesPerPath; i++) {
      for (let path = 0; path < perPath.length; path++) {
        const pt = perPath[path][i];
        if (pt) traceDests.push(pt);
      }
    }
  }

  // Scrollytelling re-snatch: if there are existing trace particles
  // from a previous burst, repurpose them instead of spawning new.
  // Same physical dots travel through the narrative — form word 1,
  // swarm, form word 2, swarm, form word 3...
  //
  // Filter by isTracing alone (not also p.persistent) — ScrollTrigger
  // can race with the scroll release handler. If the viewport trigger
  // fires before scroll has marked particles persistent, we'd miss
  // them and spawn a fresh batch on top. Catching any alive isTracing
  // particle handles both ordering cases.
  const persistentParticles = traceDests.length > 0
    ? allParticles.filter(p => p.alive && p.isTracing)
    : [];
  if (persistentParticles.length > 0) {
    const now = performance.now();
    for (let i = 0; i < persistentParticles.length; i++) {
      const p = persistentParticles[i];
      const dest = traceDests[i % traceDests.length];
      p.destX = dest.x;
      p.destY = dest.y;
      // Store offset for live-origin tracking — letters follow section
      // as user keeps scrolling past the viewport trigger point.
      p.destOffsetX = dest.x - cx;
      p.destOffsetY = dest.y - cy;
      p.spawnX = p.x; // re-spawn from current swarm position
      p.spawnY = p.y;
      p.born = now;   // reset age so convergence lerp restarts
      p.converge = true;
      p.persistent = false;
      p.relaunchedAt = now;
      // Re-aim velocity at the new dest. The convergence branch lerps
      // from spawn to dest regardless of vx/vy, so this is mostly for
      // any non-converge frames during the transition.
      const travelFrames = Math.max(20, (opts.lifespan / 1000) * 60 * 0.7);
      p.vx = (dest.x - p.x) / travelFrames;
      p.vy = (dest.y - p.y) / travelFrames;
    }
    // Re-snatch is a full replacement — return early so the normal
    // particle creation loop doesn't double-spawn fresh dots on top.
    return;
  }

  // No isTracing particles to reuse — fresh spawn. Cap concurrent
  // particles before adding more (kept DOM cost bounded under click-
  // spam from the original code path).
  evictOldestParticles(opts.count);

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

    // Per-particle spawn position from the `from` enum
    const { x: spawnX, y: spawnY } = pickSpawnPos(opts.from, cx, cy);

    // Per-particle destination — tracePath overrides shared dest with
    // its own sampled outline point so particles form letters.
    const isTracing = traceDests.length > 0;
    const traceDest = isTracing ? traceDests[i % traceDests.length] : null;

    // Initial velocity. When `to !== 'away'`, particles AIM at a destination
    // (origin / cursor / target element) — convergence pattern. Otherwise
    // the existing per-mode angle/speed logic gives radial-outward motion.
    let vx0: number, vy0: number;
    if (isTracing) {
      // Trace mode: aim at this particle's specific letter-outline point.
      const travelFrames = Math.max(20, (opts.lifespan / 1000) * 60 * 0.7);
      vx0 = (traceDest!.x - spawnX) / travelFrames;
      vy0 = (traceDest!.y - spawnY) / travelFrames;
      const jitter = 0.6;
      vx0 += (Math.random() - 0.5) * jitter;
      vy0 += (Math.random() - 0.5) * jitter;
    } else if (opts.to !== 'away') {
      const destX = opts.to === 'cursor' ? cursorX
                  : opts.to === 'target' ? targetX
                  : cx; // 'origin'
      const destY = opts.to === 'cursor' ? cursorY
                  : opts.to === 'target' ? targetY
                  : cy;
      // Travel time scaled by lifespan so particles arrive before fade-out.
      // 60fps × 0.7 of lifespan in seconds = frames available.
      const travelFrames = Math.max(20, (opts.lifespan / 1000) * 60 * 0.7);
      vx0 = (destX - spawnX) / travelFrames;
      vy0 = (destY - spawnY) / travelFrames;
      // Add a small per-particle jitter so the swarm doesn't fly as one solid block
      const jitter = 0.6;
      vx0 += (Math.random() - 0.5) * jitter;
      vy0 += (Math.random() - 0.5) * jitter;
    } else {
      // Original radial outward logic — branched per mode.
      let angle: number, speed: number;
      switch (opts.mode) {
        case 'explode':
          angle = Math.random() * Math.PI * 2;
          speed = 6 + Math.random() * (opts.spread / 20);
          break;
        case 'float':
          angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.6;
          speed = 1 + Math.random() * 1.5;
          break;
        case 'orbit':
          angle = Math.random() * Math.PI * 2;
          speed = 0.5 + Math.random() * 1.5;
          break;
        case 'fall':
        case 'shake':
        default:
          angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
          speed = 4 + Math.random() * (opts.spread / 30);
          break;
      }
      vx0 = Math.cos(angle) * speed;
      vy0 = Math.sin(angle) * speed - (opts.mode === 'fall' || opts.mode === 'shake' ? 4 : 0);
    }

    // Stagger emit ~10ms per particle so the burst doesn't look like
    // they all came out at once. born+i*delay → tick skips them until ready.
    const emitDelay = i * 10;
    // Convergence destination — trace mode uses per-particle sampled
    // point so the swarm forms a letter outline. origin/target use a
    // shared point. Cursor stays in vx/vy mode.
    const converge = isTracing || opts.to === 'origin' || opts.to === 'target';
    const dX = isTracing ? traceDest!.x : (opts.to === 'target' ? targetX : cx);
    const dY = isTracing ? traceDest!.y : (opts.to === 'target' ? targetY : cy);

    const particle: Particle = {
      el,
      x: spawnX,
      y: spawnY,
      vx: vx0,
      vy: vy0,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 14,
      scale: 0.6 + Math.random() * 0.7,
      alive: true,
      born: startTime + emitDelay,
      driftSeed: Math.random() * Math.PI * 2,
      bounces: 0,
      collide: opts.collide,
      stuckOnText: false,
      converge,
      spawnX,
      spawnY,
      destX: dX,
      destY: dY,
      persistent: false,
      relaunchedAt: 0,
      isTracing,
      destOffsetX: dX - cx,
      destOffsetY: dY - cy,
    };
    particles.push(particle);
    allParticles.push(particle);
    el.style.opacity = '0';
  }

  function tick(now: number) {
    const rects = opts.collide ? getCollisionRects() : [];
    let anyAlive = false;

    // Read live origin centre ONCE per tick so tracePath particles can
    // re-aim destination at the section's CURRENT viewport position.
    // For card-and-letters layouts the section scrolls through viewport
    // during the animation — letters need to track it so they stay
    // next to the card.
    let liveOriginCx = cx;
    let liveOriginCy = cy;
    if (opts.tracePaths.length > 0) {
      const r = originEl.getBoundingClientRect();
      liveOriginCx = r.left + r.width / 2;
      liveOriginCy = r.top + r.height / 2;
    }

    for (const p of particles) {
      if (!p.alive) continue;
      anyAlive = true;
      const age = now - p.born;
      // Pre-emit phase — particle staggered after burst start, hold invisible at origin
      if (age < 0) continue;
      // lifespan === 0 means persistent — particle never auto-removes
      // (still subject to active-particle cap eviction).
      // Also skip removal for:
      //   - scroll-release-persistent particles (scrollytelling swarm)
      //   - tracePath particles (they stay at their letter outline
      //     until the user scrolls and releases them — without this,
      //     the lifespan timer fires before the user has had time to
      //     read the formed word and scroll)
      if (opts.lifespan > 0 && age > opts.lifespan && !p.persistent && !p.isTracing) {
        p.el.remove();
        p.alive = false;
        const gIdx = allParticles.indexOf(p);
        if (gIdx > -1) allParticles.splice(gIdx, 1);
        continue;
      }

      // Convergence particles use ease-out lerp from spawn to dest.
      // Stellar-parallax depth: scale varies in [0.6, 1.3], and we use that
      // to randomise arrival speed + opacity per particle. Bigger = closer
      // to camera = faster arrival + more opaque. Smaller = distant =
      // slower arrival + faded. Gives the swarm visual depth instead of
      // marching as one synchronised wave. Fade starts at arrival (not at
      // lifespan-400) so particles dissolve into the target rather than
      // sitting visibly at the destination.
      if (p.converge) {
        const scaleNorm = Math.min(Math.max((p.scale - 0.6) / 0.7, 0), 1); // 0..1
        let arrivalAge: number;
        let baseOpacity: number;
        let fadeAfterArrival: boolean;
        if (p.isTracing) {
          // Tracing dots (scrollytelling): fast random arrival, no
          // post-arrival fade — they stay until scroll-release. Each
          // particle gets a random arrivalAge in 400–1600ms so the
          // swarm reads as chaotic (not a synchronised marching wave).
          // driftSeed (already per-particle random) is reused as the
          // jitter source.
          const jitter = (Math.sin(p.driftSeed * 13.37) + 1) * 0.5; // 0..1
          arrivalAge = 400 + jitter * 1200;
          baseOpacity = 1;
          fadeAfterArrival = false;
        } else {
          // Non-trace converge (original stellar-parallax behaviour):
          // big particles arrive fast + opaque, small ones slow + faded.
          // Fade kicks in at arrival → particles dissolve into the target.
          const arrivalFrac = 0.85 - 0.45 * scaleNorm; // big=0.40 (fast), small=0.85 (slow)
          baseOpacity = 0.55 + 0.45 * scaleNorm; // big=1.0, small=0.55
          arrivalAge = opts.lifespan * arrivalFrac;
          fadeAfterArrival = true;
        }
        const t = Math.min(age / arrivalAge, 1);
        const ease = 1 - (1 - t) * (1 - t); // ease-out quad
        // Re-aim dest at live origin centre + stored offset so letters
        // track the section while it scrolls. Non-trace converge bursts
        // stay anchored to spawn-time dest (origin is static, e.g.
        // button click).
        if (p.isTracing) {
          p.destX = liveOriginCx + p.destOffsetX;
          p.destY = liveOriginCy + p.destOffsetY;
        }
        p.x = p.spawnX + (p.destX - p.spawnX) * ease;
        p.y = p.spawnY + (p.destY - p.spawnY) * ease;
        p.rotation += p.spin * (1 - t * 0.7); // spin slows as particle arrives
        let opacity = baseOpacity;
        if (fadeAfterArrival) {
          const fadeWindow = Math.min(opts.lifespan - arrivalAge, 600);
          const fadeProgress = age < arrivalAge ? 0 : Math.min((age - arrivalAge) / fadeWindow, 1);
          opacity = baseOpacity * (1 - fadeProgress);
        }
        p.el.style.opacity = String(opacity);
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.scale})`;
        continue;
      }

      // Gravity branched by mode. Persistent trace-released particles
      // (scrollytelling swarm) get sinusoidal drift like float mode so
      // they wander in space between sections instead of falling.
      if (p.persistent) {
        p.vx += Math.sin(now / 700 + p.driftSeed) * 0.05;
        p.vy += Math.cos(now / 900 + p.driftSeed * 1.3) * 0.05;
      } else if (opts.mode === 'float') {
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
      const vw = window.innerWidth;
      // Persistent particles (scrollytelling swarm) get all four walls
      // — they fly out from letter positions toward edges, then drift
      // ALONG the edges instead of escaping off-screen. Soft clamp:
      // dampen velocity in the axis that hit, leave the perpendicular
      // axis so they slide along the edge while sinusoidal drift keeps
      // them alive. Margin keeps them visible (not clipped).
      if (p.persistent) {
        const margin = 8;
        if (p.x < margin) { p.x = margin; p.vx = Math.abs(p.vx) * 0.3; }
        else if (p.x > vw - margin) { p.x = vw - margin; p.vx = -Math.abs(p.vx) * 0.3; }
        if (p.y < margin) { p.y = margin; p.vy = Math.abs(p.vy) * 0.3; }
        else if (p.y > vh - margin) { p.y = vh - margin; p.vy = -Math.abs(p.vy) * 0.3; }
      } else if (p.y > vh - 4) {
        // Non-persistent: original floor-settle behaviour
        p.y = vh - 4; p.vx = 0; p.vy = 0;
      }

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

      // Fade in last 400ms of life. lifespan=0 (persistent) → no fade.
      // Scrollytelling persistent + isTracing particles ALSO skip fade
      // — they stay visible while swarming between sections and wait
      // for re-snatch. Without this skip, the original 8s lifespan
      // would trigger opacity = 0 and the dots would just vanish
      // when the user scrolls.
      const fadeStart = opts.lifespan - 400;
      const opacity = (opts.lifespan === 0 || p.persistent || p.isTracing) ? 1
                    : age < fadeStart ? 1
                    : Math.max(0, 1 - (age - fadeStart) / 400);
      p.el.style.opacity = String(opacity);
      p.el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.scale})`;
    }

    if (anyAlive) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Target reveal flag — fire once at the convergence-arrival point
  // (~70% of lifespan, matching the travelFrames calculation above).
  // CSS can hook [data-string-landed] for reveal effects on the targeted
  // element. Decoupled from collision so the target doesn't need to be in
  // COLLIDE_SELECTOR.
  if (opts.to === 'target' && opts.targetEl) {
    const tEl = opts.targetEl;
    setTimeout(() => {
      if (!tEl.hasAttribute('data-string-landed')) {
        tEl.setAttribute('data-string-landed', 'true');
      }
    }, opts.lifespan * 0.6);
  }
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

  const validFrom: SpawnFrom[] = ['origin', 'top', 'bottom', 'left', 'right', 'edges', 'viewport'];
  const fromAttr = get('from');
  if (fromAttr && validFrom.includes(fromAttr as SpawnFrom)) opts.from = fromAttr as SpawnFrom;

  const validTo: SpawnTo[] = ['away', 'origin', 'cursor', 'target'];
  const toAttr = get('to');
  if (toAttr && validTo.includes(toAttr as SpawnTo)) opts.to = toAttr as SpawnTo;

  const targetSelector = get('target');
  if (opts.to === 'target' && targetSelector) {
    opts.targetEl = document.querySelector(targetSelector);
  }
  const c = get('collide');
  if (c === 'on') opts.collide = true;
  else if (c === 'off') opts.collide = false;
  const triggerAttr = get('trigger');
  if (triggerAttr === 'hover') opts.trigger = 'hover';
  else if (triggerAttr === 'hover-hold') opts.trigger = 'hover-hold';
  else if (triggerAttr === 'viewport') opts.trigger = 'viewport';
  else if (triggerAttr === 'pin') opts.trigger = 'pin';

  // tracePath sampling — same data-attribute shape as the string engine
  // (pipe-joined SVG paths via data-particle-trace, scale via -size,
  // offset via -offset-x/y).
  const tracePath = get('trace');
  if (tracePath) opts.tracePaths = tracePath.split('|');
  if (get('trace-size')) opts.traceSize = parseFloat(get('trace-size')!);
  if (get('trace-offset-x')) opts.traceOffsetX = parseFloat(get('trace-offset-x')!);
  if (get('trace-offset-y')) opts.traceOffsetY = parseFloat(get('trace-offset-y')!);

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

    if (opts.trigger === 'pin') {
      // Scrollytelling pin: the burst wrapper sticks at top of viewport
      // for a scroll range, the burst fires AFTER a dwell period (so
      // fast-scrolling past doesn't trigger the animation), and the
      // dots release on leave (user scrolls past the pin range).
      //
      // This is the canonical scrollytelling pattern — letters always
      // form at the SAME pinned viewport position, no chasing moving
      // sections, no per-Burst layout choreography.
      (async () => {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        gsap.registerPlugin(ScrollTrigger);
        const osScroller = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]');
        const dwellMs = 1000;
        let dwellTimer: ReturnType<typeof setTimeout> | null = null;
        let inPin = false;
        const startDwell = () => {
          inPin = true;
          if (dwellTimer) clearTimeout(dwellTimer);
          dwellTimer = setTimeout(() => {
            if (inPin) fire(new Event('pin'));
          }, dwellMs);
        };
        const cancelDwell = () => {
          inPin = false;
          if (dwellTimer) { clearTimeout(dwellTimer); dwellTimer = null; }
        };
        ScrollTrigger.create({
          trigger: htmlEl,
          scroller: osScroller || undefined,
          start: 'top top',
          end: '+=800',
          pin: true,
          pinSpacing: true,
          onEnter: startDwell,
          onEnterBack: startDwell,
          onLeave: () => {
            cancelDwell();
            // Fire a synthetic scroll to release dots into swarm — the
            // scroll handler picks up isTracing particles and applies
            // the outward kick.
            onPhysicsScroll();
          },
          onLeaveBack: () => {
            cancelDwell();
            onPhysicsScroll();
          },
        });
      })();
    } else if (opts.trigger === 'viewport') {
      // Fire on viewport entry via GSAP ScrollTrigger. Same pattern as
      // the string engine's viewport trigger — onEnter + onEnterBack
      // both call fire() so the scrollytelling loop works in either
      // scroll direction.
      (async () => {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        gsap.registerPlugin(ScrollTrigger);
        const osScroller = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]');
        ScrollTrigger.create({
          trigger: htmlEl,
          scroller: osScroller || undefined,
          // Fire EARLY — when the section is just entering viewport
          // from below. Gives the fly-in / re-snatch flight time to
          // complete before the user has fully scrolled into the
          // section. Previously 'top 80%' fired after the section was
          // already 20% in view, so the dots were still mid-air when
          // the user expected to see the formed word.
          start: 'top bottom',
          onEnter: () => fire(new Event('viewport')),
          onEnterBack: () => fire(new Event('viewport')),
        });
      })();
    } else if (opts.trigger === 'hover') {
      let cooldown = false;
      htmlEl.addEventListener('mouseenter', (e) => {
        if (cooldown) return;
        cooldown = true;
        fire(e);
        setTimeout(() => { cooldown = false; }, 2000 * getAnimationConfig().durationScale);
      });
    } else if (opts.trigger === 'hover-hold') {
      // Continuous re-fire while hovered. Same pattern as string engine.
      // Speedgate-scaled so gentle/slow modes hold the re-fire rate.
      let intervalId: ReturnType<typeof setInterval> | null = null;
      htmlEl.addEventListener('mouseenter', (e) => {
        fire(e);
        if (intervalId !== null) return;
        intervalId = setInterval(() => fire(new MouseEvent('hover')), 1500 * getAnimationConfig().durationScale);
      });
      htmlEl.addEventListener('mouseleave', () => {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
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
