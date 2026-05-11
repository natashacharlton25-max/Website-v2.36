/**
 * Particle String — Verlet rope physics for the silly-string effect.
 *
 * Click/hover on a Burst with engine='string' sprays a connected strand of
 * points that bunches up under gravity and collides with page text. Adapted
 * from the CodePen "Silly String" — Verlet integration with link constraints.
 *
 * Per strand (~60 connected points by default):
 *   1. Verlet integrate each point (gravity + 0.97 air-damping)
 *   2. Solve link constraints (2 iterations, target dist 2.5px, snap > 25px)
 *   3. AABB collision against page text rects (same set as particle-physics)
 *   4. Render strand as an SVG <path> with quadratic smoothing through points
 *
 * Multiple strands coexist; one SVG overlay holds them all. After ~8s a
 * strand fades out and removes itself.
 */

import { getAnimationConfig } from './animation-config';

export type SpawnFrom = 'origin' | 'top' | 'bottom' | 'left' | 'right' | 'edges' | 'viewport';
export type SpawnTo = 'away' | 'origin' | 'cursor' | 'target';
export type MagnetMode = 'off' | 'attract' | 'repel';

interface StringOptions {
  strands: number;
  length: number;
  pressure: number;
  spread: number;
  emitDuration: number;
  gravity: number;
  collide: boolean;
  from: SpawnFrom;
  to: SpawnTo;
  targetEl: Element | null;
  /** SVG path data, one entry per path. When multiple, each strand traces
   *  paths[s % paths.length] — multi-path logos render as N separate
   *  strand-shapes (one strand per path) instead of one tangled
   *  concatenated mess with subpath jumps. */
  tracePaths: string[];
  /** Target width in px for the traced shape (path is auto-centred and
   *  scaled to fit). 0 = no scaling, use the path's natural size. */
  traceSize: number;
  /** Pixel offset from the burst origin (or target rect's centre when
   *  to=target). Useful when the source button would obscure the trace —
   *  set negative Y to render the shape above the button. */
  traceOffsetX: number;
  traceOffsetY: number;
  /** Cursor magnet mode applied each frame after the emit phase
   *  completes. 'attract' pulls points toward the cursor (swarm cloud
   *  follows). 'repel' pushes them away (cursor parts the rope as you
   *  wade through). 'off' = no cursor force. Mutually exclusive with
   *  tracePaths (can't both trace a fixed shape AND follow the cursor);
   *  if both set, magnet wins. */
  magnetCursor: MagnetMode;
  /** 0–1 probability a falling strand point sticks on a top-edge contact.
   *  Default 0.9 — strands mostly stick on first contact (predictable
   *  drape-over-text). Lower values cascade past upper rects and settle
   *  on lower rows; the Starfall preset uses 0.35. */
  stickiness: number;
  thick: number;
  /** Total ms before strand fades out (fade itself takes 1s). */
  lifespan: number;
  trigger: 'click' | 'hover' | 'hover-hold';
  /** Resolved hex/rgb colours. Runtime cycles per strand. */
  colors: string[];
  /** When true (and the strand is anchored — magnetCursor='attract' +
   *  collide=true), each strand's colour is read from its anchor
   *  element's computed text colour instead of the palette. Tendrils
   *  blend into the page they're hanging from. */
  inheritAnchorColour: boolean;
}

const DEFAULTS: StringOptions = {
  strands: 1,
  length: 100,
  pressure: 14,
  // Cone width in DEGREES — 120 = wide forward cone, 360 = full circle.
  spread: 120,
  emitDuration: 500,
  gravity: 0.4,
  // Default off: silly-string flies across surfaces and pools on the floor.
  // Opt in via collide:true when you want sticky-on-text.
  collide: false,
  // 0.9 default = strands mostly stick on first contact when collide is on
  // (predictable "drape over text" behaviour). Lower values make strands
  // cascade past upper text and settle on lower rows.
  stickiness: 0.9,
  thick: 4,
  lifespan: 12000,
  trigger: 'click',
  colors: [],
  from: 'origin',
  to: 'away',
  targetEl: null,
  tracePaths: [],
  traceSize: 240,
  traceOffsetX: 0,
  traceOffsetY: 0,
  magnetCursor: 'off',
  inheritAnchorColour: false,
};

// A trace frame describes the shared coordinate transform applied to one
// or more SVG paths so they render at a consistent size + position. Used
// by multi-path logos: the four logo paths share a single bbox / scale,
// preserving their relative positions in the original SVG. Without this,
// each path would auto-centre on the burst origin and they'd all stack.
interface TraceFrame {
  /** Shared bbox centre (in path coordinate space). */
  cx: number;
  cy: number;
  /** Uniform scale factor (targetSize / naturalSize). */
  scale: number;
}

// Compute one TraceFrame across N path strings. All paths get appended
// to one hidden SVG so getBBox returns the union bbox — the same frame
// is then used to sample each path, so multi-path logos keep their
// original layout instead of having every path auto-centre on origin.
function computeTraceFrame(pathDatas: string[], targetSize: number): TraceFrame {
  const tmpSvg = document.createElementNS(SVG_NS, 'svg');
  tmpSvg.setAttribute('width', '0');
  tmpSvg.setAttribute('height', '0');
  tmpSvg.style.position = 'absolute';
  tmpSvg.style.left = '-9999px';
  for (const d of pathDatas) {
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', d);
    tmpSvg.appendChild(p);
  }
  document.body.appendChild(tmpSvg);
  const bbox = (tmpSvg as unknown as SVGGraphicsElement).getBBox();
  document.body.removeChild(tmpSvg);
  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y + bbox.height / 2;
  const naturalSize = Math.max(bbox.width, bbox.height) || 1;
  const scale = targetSize > 0 ? targetSize / naturalSize : 1;
  return { cx, cy, scale };
}

// Sample N positions along an SVG path using a shared TraceFrame.
//
// Multi-subpath aware: stencil fonts (and any path with multiple M
// commands) have several closed contours per glyph. getTotalLength on
// such paths often excludes the Z (close) edges, so naive uniform
// sampling misses every subpath's closing segment — visually ~20% of
// each letter's perimeter is dropped.
//
// Fix: split the path data on M boundaries, sample each subpath
// proportionally to its own length, and append the start point as a
// final sample for any Z-terminated subpath. The variable point count
// is fine for path-snap (strand uses the first N entries).
function samplePath(
  pathData: string,
  n: number,
  offsetX: number,
  offsetY: number,
  frame: TraceFrame,
): { points: { x: number; y: number }[]; breaks: number[] } {
  const tmpSvg = document.createElementNS(SVG_NS, 'svg');
  tmpSvg.setAttribute('width', '0');
  tmpSvg.setAttribute('height', '0');
  tmpSvg.style.position = 'absolute';
  tmpSvg.style.left = '-9999px';
  document.body.appendChild(tmpSvg);

  const xform = (px: number, py: number) => ({
    x: (px - frame.cx) * frame.scale + offsetX,
    y: (py - frame.cy) * frame.scale + offsetY,
  });

  // Split on M / m (start of new subpath). Filter empty strings from
  // leading whitespace. Each subpath is a self-contained "M ... [Z]".
  const subpaths = pathData.split(/(?=[Mm])/).filter(s => s.trim().length > 0);

  // Build path elements for each subpath up front so we can measure all
  // lengths before allocating per-subpath sample budgets.
  const pathEls: SVGPathElement[] = [];
  for (const sub of subpaths) {
    const pe = document.createElementNS(SVG_NS, 'path');
    pe.setAttribute('d', sub);
    tmpSvg.appendChild(pe);
    pathEls.push(pe);
  }
  const lengths = pathEls.map(pe => pe.getTotalLength());
  const totalLen = lengths.reduce((a, b) => a + b, 0) || 1;

  // Budget for closures upfront — every subpath gets one closure sample,
  // so reserve numSubpaths from the n total. Without this, closure points
  // land at indices >= n and get cut by the strand iter loop, defeating
  // the closure logic entirely (which was the actual bug).
  const closureCount = subpaths.length;
  const interiorBudget = Math.max(n - closureCount, subpaths.length * 3);

  const points: { x: number; y: number }[] = [];
  // Indices in `points` where a new subpath begins (i.e. first point of
  // subpath 2, 3, ...). Used by the caller to mark the inter-subpath
  // strand link as broken so the renderer inserts an SVG M (moveTo)
  // instead of an L — otherwise multi-contour glyphs (a, e, g, o, etc.)
  // get a stray line drawn from the outer contour's closing point
  // straight to the inner counter's first point, slicing the letter.
  const breaks: number[] = [];
  for (let i = 0; i < subpaths.length; i++) {
    const len = lengths[i];
    if (len < 0.5) continue;                   // skip degenerate subpaths
    if (points.length > 0) breaks.push(points.length);
    // Distribute interiorBudget proportionally across subpaths by length,
    // min 3 per subpath so even tiny features get a triangle of points.
    const subN = Math.max(3, Math.round(interiorBudget * len / totalLen));
    const pe = pathEls[i];
    for (let j = 0; j < subN; j++) {
      const t = subN === 1 ? 0 : j / (subN - 1);
      const p = pe.getPointAtLength(t * len);
      points.push(xform(p.x, p.y));
    }
    // Force closure on every subpath. opentype.js (and most font-to-path
    // tools) emit paths WITHOUT Z markers — TrueType contours are
    // inherently closed but the closure isn't always written. Always
    // appending the start position as a closing sample handles both:
    // explicit-Z paths (the closure is redundant, harmless) and
    // implicit-closed glyphs (the closure was missing, now drawn).
    const p0 = pe.getPointAtLength(0);
    points.push(xform(p0.x, p0.y));
  }

  document.body.removeChild(tmpSvg);
  return { points, breaks };
}

// Per-strand spawn position from `from` enum. Edges sample randomly along
// that viewport edge; `edges` picks one of four; `viewport` is anywhere.
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

// Shared cursor — needed when `to: 'cursor'` for strings. One listener.
let stringCursorX = 0, stringCursorY = 0, stringCursorBound = false;
function bindStringCursor() {
  if (stringCursorBound || typeof window === 'undefined') return;
  stringCursorBound = true;
  window.addEventListener('mousemove', (e) => {
    stringCursorX = e.clientX; stringCursorY = e.clientY;
  });
}

// Text-only — strings fly past buttons/links by design; they snag on prose.
const COLLIDE_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li';
const SVG_NS = 'http://www.w3.org/2000/svg';

// Verlet rope tuning — these three are coupled, don't tune one in isolation.
//   LK_REST     = link target distance (chain neighbour pairwise pull)
//   LK_BREAK    = link snap distance (above this, the link breaks)
//   REPEL_DIST  = pairwise repulsion radius. MUST be < LK_REST so chain
//                 neighbours at slack distance don't trigger repulsion
//                 against the link constraint. Typical: REPEL ≈ 0.6 × REST.
const LK_REST = 10;
const LK_BREAK = 80;
const REPEL_DIST = LK_REST * 0.6;
const REPEL_DIST_SQ = REPEL_DIST * REPEL_DIST;

// Verlet point — position + previous position. Velocity is implicit (x - ox).
class Pt {
  x: number; y: number; ox: number; oy: number;
  done = false;
  st = 0; // stickiness — accumulates on collisions, > 14 = settled
  constructor(x: number, y: number, vx = 0, vy = 0) {
    this.x = x; this.y = y;
    this.ox = x - vx; this.oy = y - vy;
  }
}

// Link between two consecutive points — keeps them at target distance.
// rest=LK_REST so a static-spawn click produces a strand that spans
// ~length × rest px instead of compressing into a clump (was 2.5 in
// CodePen, but that assumes cursor movement during emit). LK_BREAK lets
// strands stretch dramatically before snapping.
class Lk {
  rest = LK_REST;
  broken = false;
  constructor(public a: Pt, public b: Pt) {}
  solve() {
    if (this.broken) return;
    const dx = this.b.x - this.a.x;
    const dy = this.b.y - this.a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 0.001;
    if (d > LK_BREAK) { this.broken = true; return; }
    const f = (this.rest - d) / d * 0.25;
    if (!this.a.done) { this.a.x -= dx * f; this.a.y -= dy * f; }
    if (!this.b.done) { this.b.x += dx * f; this.b.y += dy * f; }
  }
}

class Strand {
  pts: Pt[] = [];
  lks: Lk[] = [];
  alive = true;
  pathEl: SVGPathElement;
  // Per-strand collide flag — read at spawn from the burst's opts so the
  // tick loop can skip the rect-check entirely when collision is disabled.
  // Default-false for string engine: silly-string flies past UI by design.
  collide: boolean = false;
  // Per-strand gravity so author overrides via data-particle-gravity reach
  // the integrator (was reading DEFAULTS.gravity directly — bug).
  gravity: number = DEFAULTS.gravity;
  // Per-strand stickiness — probability of sticking on a top-edge contact.
  stickiness: number = DEFAULTS.stickiness;
  // Snap-to-path: target positions sampled from the burst's tracePath.
  // Each strand point i lerps toward targetPositions[i] once arrivedAt
  // has elapsed. null = no path tracing (regular Verlet behaviour).
  targetPositions: { x: number; y: number }[] | null = null;
  /** Indices in targetPositions where a new subpath begins. Applied to
   *  lks once the strand has been fully populated — marks the inter-
   *  contour link as broken so the renderer inserts an M (moveTo)
   *  instead of an L there. Without this, multi-contour glyphs (a, e,
   *  g, o, S, etc.) get a stray line bisecting them. */
  targetBreaks: number[] = [];
  /** ms (relative to performance.now) after which path-snap lerping starts. */
  arrivedAt: number = 0;
  /** Cursor-magnet mode — 'attract' pulls toward cursor (swarm follows),
   *  'repel' pushes away (cursor parts the rope), 'off' = no cursor force.
   *  Active each frame after magnetActiveAt has elapsed. */
  magnetCursor: MagnetMode = 'off';
  magnetActiveAt: number = 0;
  /** True when pts[0] is pinned to a page-element rect (tethered tendril
   *  pattern: magnetCursor='attract' + collide=true). Anchor pin sets
   *  pts[0].done = true outside of the collision system, so the scroll
   *  handler — which unsticks done points based on collide — has to also
   *  unpin anchor[0] explicitly when the page scrolls. */
  anchored: boolean = false;
  constructor(public color: string, public thick: number, svg: SVGSVGElement) {
    this.pathEl = document.createElementNS(SVG_NS, 'path');
    this.pathEl.setAttribute('fill', 'none');
    this.pathEl.setAttribute('stroke', color);
    this.pathEl.setAttribute('stroke-width', String(thick));
    this.pathEl.setAttribute('stroke-linecap', 'round');
    this.pathEl.setAttribute('stroke-linejoin', 'round');
    this.pathEl.style.transition = 'opacity 1s';
    svg.appendChild(this.pathEl);
  }
  add(x: number, y: number, vx: number, vy: number) {
    const p = new Pt(x, y, vx, vy);
    if (this.pts.length) this.lks.push(new Lk(this.pts[this.pts.length - 1], p));
    this.pts.push(p);
  }
}

// Single SVG overlay for all strings. High z-index so strings render in
// front of all page content. Strings are decorative — pointer-events:none
// so they never block clicks.
let overlay: SVGSVGElement | null = null;
let defs: SVGDefsElement | null = null;
function getOverlay(): SVGSVGElement {
  if (overlay) return overlay;
  overlay = document.createElementNS(SVG_NS, 'svg');
  overlay.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
  overlay.setAttribute('aria-hidden', 'true');
  defs = document.createElementNS(SVG_NS, 'defs');
  overlay.appendChild(defs);
  document.body.appendChild(overlay);
  return overlay;
}

// Build a mask that hides strands while they're still inside the source
// element's rect. White everywhere = visible; black rect over the source
// = hidden. Strings emerge from behind the button rather than piling on
// top of its centre at spawn time.
let maskSeq = 0;
function buildSourceMask(svg: SVGSVGElement, rect: DOMRect): string {
  if (!defs) {
    defs = document.createElementNS(SVG_NS, 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }
  const id = `burst-mask-${++maskSeq}`;
  const mask = document.createElementNS(SVG_NS, 'mask');
  mask.id = id;
  // White full-screen rect = visible base
  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.setAttribute('x', '0'); bg.setAttribute('y', '0');
  bg.setAttribute('width', '100%'); bg.setAttribute('height', '100%');
  bg.setAttribute('fill', 'white');
  mask.appendChild(bg);
  // Black rect over the button rect = hole (strands invisible here)
  const hole = document.createElementNS(SVG_NS, 'rect');
  hole.setAttribute('x', String(rect.left));
  hole.setAttribute('y', String(rect.top));
  hole.setAttribute('width', String(rect.width));
  hole.setAttribute('height', String(rect.height));
  hole.setAttribute('rx', '12');
  hole.setAttribute('fill', 'black');
  mask.appendChild(hole);
  defs.appendChild(mask);
  return id;
}
function removeMask(id: string) {
  const m = document.getElementById(id);
  if (m && m.parentNode) m.parentNode.removeChild(m);
}

// Cached element rects for collision. 500ms TTL + invalidate on resize.
let collisionRects: DOMRect[] = [];
let rectsCachedAt = 0;
function getCollisionRects() {
  const now = performance.now();
  if (now - rectsCachedAt < 500) return collisionRects;
  collisionRects = Array.from(document.querySelectorAll(COLLIDE_SELECTOR))
    .map(el => el.getBoundingClientRect())
    .filter(r => r.width > 0 && r.height > 0)
    // Top-to-bottom so pass-through advances correctly through stacked rects
    .sort((a, b) => a.top - b.top);
  rectsCachedAt = now;
  return collisionRects;
}
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => { rectsCachedAt = 0; });

  // Scroll handler — only collide-true strands need correction. Strands
  // stuck on text/buttons stay pinned to fixed viewport coords as the
  // page scrolls past, so they look broken; we unstick them (flip collide
  // off + reactivate text-settled points) and physics finishes them.
  // Floor piles (collide=false) deliberately stay — they read correctly
  // as "string resting on the screen bottom".
  //
  // This site uses OverlayScrollbars: the actual scroll element is
  // [data-overlayscrollbars-viewport], NOT window. Listen on both —
  // window covers the case where the project ever drops OS, and the OS
  // viewport (when found, after DOM ready) covers the live setup.
  const onScroll = () => {
    if (!allStrands.some(s => s.alive && (s.collide || s.anchored))) return;
    for (const s of allStrands) {
      if (!s.alive) continue;
      // Anchored tendrils pin pts[0] outside the collision system — the
      // anchor point sits at fixed viewport coords and stays pinned even
      // after scroll, so the tendril looks broken. Unpin pts[0] so
      // physics finishes the strand naturally; clear the anchored flag
      // so we don't re-trigger.
      if (s.anchored && s.pts[0]?.done) {
        s.pts[0].done = false;
        s.anchored = false;
      }
      if (!s.collide) continue;
      s.collide = false;
      for (const p of s.pts) {
        if (p.done && p.y < window.innerHeight - 2) {
          p.done = false;
          p.st = 0;
        }
      }
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // OS viewport is created after DOM ready — defer attach so we find it.
  const attachOsScroll = () => {
    const os = document.querySelector('[data-overlayscrollbars-viewport]');
    if (os) os.addEventListener('scroll', onScroll, { passive: true });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(attachOsScroll, 300));
  } else {
    setTimeout(attachOsScroll, 300);
  }
  document.addEventListener('astro:page-load', () => setTimeout(attachOsScroll, 300));
}

const allStrands: Strand[] = [];
let tickRunning = false;

// Hard cap on concurrent live strands. Cross-strand repulsion is O(n²) so
// 50 click-spammed bursts of 7 strands each (350 total) would melt the
// CPU. Cap at 30 — evict oldest when a new burst would exceed it. Keeps
// the worst case bounded regardless of click frequency.
// Bumped from 30 to accommodate tracePath retriggers — old strands
// linger on the floor for ~2.4s while the new burst (up to 17 strands
// for "Walking with a Smile") writes over the top. Worst case = 17 old
// falling + 17 new = 34 active. 40 leaves a small headroom buffer.
const MAX_ACTIVE_STRANDS = 40;
function evictOldestStrands(toMake: number) {
  while (allStrands.length + toMake > MAX_ACTIVE_STRANDS) {
    const oldest = allStrands[0];
    if (!oldest) break;
    oldest.pathEl.remove();
    oldest.alive = false;
    allStrands.splice(0, 1);
  }
}

function tick() {
  // Only fetch rects if at least one live strand wants collision
  const anyCollide = allStrands.some(s => s.alive && s.collide);
  const rects = anyCollide ? getCollisionRects() : [];

  for (const s of allStrands) {
    if (!s.alive) continue;

    // Cursor-magnet swarm — soft pull toward live cursor on every frame
    // after the emit phase completes. Runs BEFORE the Verlet integration
    // step on purpose: the pull modifies p.x/p.y, then the integrator
    // reads vx = (p.x - p.ox) * 0.97 and the modification becomes
    // velocity that decays via air-damping. Net result: organic momentum,
    // not teleportation. Points stay not-done so links + repulsion still
    // fire — the cloud disperses around cursor naturally rather than
    // collapsing onto it. Pull is capped at 0.6 px/frame so close points
    // don't oscillate and far points don't snap; 0.008 multiplier is the
    // tunable "lazy ↔ whippy" knob.
    if (s.magnetCursor !== 'off' && performance.now() >= s.magnetActiveAt) {
      // attract: positive pull toward cursor. repel: negative pull, points
      // pushed away. Repel uses an inverse-distance falloff so close points
      // get pushed harder than far ones (cursor parts the rope on contact
      // instead of broadcasting a uniform push across the whole viewport).
      const sign = s.magnetCursor === 'repel' ? -1 : 1;
      const REPEL_FALLOFF_R = 220; // pixels — repel only effective within this radius
      for (const p of s.pts) {
        if (p.done) continue;
        const dx = stringCursorX - p.x;
        const dy = stringCursorY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Cursor sitting on top of a point — direction is undefined and
        // dx/dist would amplify floating-point noise into a teleport.
        // Skip force this frame; next frame the point or cursor will
        // have moved by Verlet/mouse and dist will be > 0.
        if (dist < 1) continue;
        let pull;
        if (sign > 0) {
          pull = Math.min(dist * 0.008, 0.6);
        } else {
          // Repel: stronger at close range, fades to zero past R
          pull = Math.max(0, (REPEL_FALLOFF_R - dist) / REPEL_FALLOFF_R) * 1.4;
        }
        p.x += (dx / dist) * pull * sign;
        p.y += (dy / dist) * pull * sign;
      }
    }

    // Path snap-to (must run BEFORE the Verlet integration loop). Marks
    // each point done first, then lerps. Putting it after integration
    // would let one frame of gravity nudge the points before lock — fine
    // for converge mode (gravity=0) but visible if a tracePath is ever
    // used with `to: away` + non-zero gravity. Locking before integration
    // guarantees no Verlet motion on the arrival frame.
    //
    // Mark each point as done — disables Verlet integration AND link-
    // constraint force on it (Lk.solve skips done points). Without this
    // lock, link constraints (rest=10) fight the lerp whenever sampled
    // positions are closer than 10px apart (typical on a small traced
    // shape with many samples). Lks aren't broken so the rendered path
    // stays continuous (the path builder uses the broken flag, not done).
    if (s.targetPositions && performance.now() >= s.arrivedAt) {
      // Apply subpath-boundary breaks once, on first snap frame. lks is
      // fully populated by now (arrivedAt = emitDuration + 200ms). Mark
      // the link spanning each subpath gap as broken so the render pass
      // emits an SVG M (moveTo) there — kills the stray line that would
      // otherwise bisect multi-contour glyphs. Clear the array so we
      // don't re-mark every frame.
      // Apply breaks lazily. When many strands spawn at once the timer
      // queue saturates and a strand's setTimeout-driven add() loop may
      // be only partway through populating pts by the time arrivedAt
      // fires — so a break index like 154 can sit outside an lks of
      // length 99. Defer those; retry next tick as pts grows toward
      // opts.length. Drop indices only once they've landed in range.
      if (s.targetBreaks.length) {
        const remaining: number[] = [];
        for (const idx of s.targetBreaks) {
          if (idx > 0 && idx - 1 < s.lks.length) {
            s.lks[idx - 1].broken = true;
          } else {
            remaining.push(idx);
          }
        }
        s.targetBreaks = remaining;
      }
      for (let i = 0; i < s.pts.length && i < s.targetPositions.length; i++) {
        const p = s.pts[i];
        const target = s.targetPositions[i];
        p.done = true;
        p.x += (target.x - p.x) * 0.12;
        p.y += (target.y - p.y) * 0.12;
        p.ox = p.x;
        p.oy = p.y;
      }
    }

    // Verlet update — integrate each point
    for (const p of s.pts) {
      if (p.done) continue;
      const vx = (p.x - p.ox) * 0.97;
      const vy = (p.y - p.oy) * 0.97;
      p.ox = p.x; p.oy = p.y;
      const newX = p.x + vx;
      const newY = p.y + vy + s.gravity;

      // AABB collision — only when point is falling (vy > 0). Points still
      // rising from the burst pass through any text on their way out. On a
      // top-edge contact, roll Math.random() < stickiness: stick if true,
      // else push past r.bottom + 1 and continue checking lower rects so
      // different points settle on different rows. Side/bottom approaches
      // still always stick (those are strand-wrap-around cases — link
      // constraints pulling tail points sideways into a rect).
      //
      // Pass-through advances workingNewY to r.bottom + 1, which can teleport
      // the point a full rect height in one frame. Acceptable trade-off at
      // typical text rect heights (~20-30px); would need line-segment
      // intersection if we ever extend to large/dense collision targets.
      // Iteration relies on rects being sorted top-to-bottom (see
      // getCollisionRects) so the next loop iteration is genuinely "below".
      let blocked = false;
      let workingNewY = newY;
      if (s.collide && (newY - p.oy) > 0) {
        for (const r of rects) {
          if (newX < r.left || newX > r.right || workingNewY < r.top || workingNewY > r.bottom) continue;
          if (p.y <= r.top) {
            // Falling onto top edge — roll for stick vs pass-through
            if (Math.random() < s.stickiness) {
              p.x = newX; p.y = r.top - 1;
              p.oy = p.y;
              // Damp horizontal velocity so points settle on the rect
              // rather than sliding off the end (mirrors floor friction).
              p.ox = p.x + (p.x - p.ox) * 0.6;
              p.st += 4;
              blocked = true;
              break;
            } else {
              // Pass through, continue to next (lower) rect
              workingNewY = r.bottom + 1;
              continue;
            }
          } else if (p.y >= r.bottom) {
            p.x = newX; p.y = r.bottom + 1;
            p.oy = p.y;
            p.st += 4;
            blocked = true;
            break;
          } else if (p.x <= r.left) {
            p.x = r.left - 1; p.y = workingNewY;
            p.ox = p.x;
            p.st += 4;
            blocked = true;
            break;
          } else if (p.x >= r.right) {
            p.x = r.right + 1; p.y = workingNewY;
            p.ox = p.x;
            p.st += 4;
            blocked = true;
            break;
          }
        }
      }
      if (!blocked) { p.x = newX; p.y = workingNewY; }

      // Viewport floor + walls. Floor: clamp y, add a tiny upward rebound
      // (prevents the dead-flat-line stacking) and damp horizontal velocity
      // so points stop sliding sideways and let later points pile on top.
      const vh = window.innerHeight, vw = window.innerWidth;
      if (p.y > vh - 1) {
        p.y = vh - 1;
        p.oy = p.y + 0.3;                          // tiny upward bounce
        p.ox = p.x + (p.x - p.ox) * 0.6;           // 40% horizontal friction
        p.st += 4;
      }
      if (p.y < 0) { p.y = 0; p.oy = 0; }
      if (p.x < 0) p.x = 0;
      if (p.x > vw) p.x = vw;
      // Stickiness threshold = 20 (was 14): points get ~5 contact frames
      // before locking, so they have time to be displaced up the pile by
      // later arrivals rather than locking on first contact.
      if (p.st > 20) p.done = true;
    }

    // Solve link constraints — 2 passes for stability
    for (let i = 0; i < 2; i++) {
      for (const lk of s.lks) lk.solve();
    }

    // Intra-strand repulsion. j starts at i+2 so the immediate chain
    // neighbour (already governed by Lk) doesn't fight repulsion.
    // REPEL_DIST = LK_REST × 0.6 so slack chain neighbours don't trigger
    // it — relationship is module-level so tuning one moves the other.
    for (let i = 0; i < s.pts.length; i++) {
      const a = s.pts[i];
      for (let j = i + 2; j < s.pts.length; j++) {
        const b = s.pts[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dsq = dx * dx + dy * dy;
        if (dsq > REPEL_DIST_SQ || dsq < 0.01) continue;
        const d = Math.sqrt(dsq);
        const overlap = (REPEL_DIST - d) / d * 0.5;
        const px = dx * overlap, py = dy * overlap;
        if (!a.done) { a.x -= px; a.y -= py; }
        if (!b.done) { b.x += px; b.y += py; }
      }
    }
  }

  // Cross-strand repulsion. Strands don't share link constraints with each
  // other — two strands landing in the same spot would happily overlap
  // unless we check across them. Same REPEL_DIST as intra-strand.
  // Skipped entirely when fewer than 2 live strands (single-strand bursts
  // pay zero cost). At 7 strands × 100 pts = ~245k pairs/frame — borderline
  // but tractable. Spatial hashing is the upgrade path if it ever bites.
  const liveStrands: Strand[] = [];
  for (const s of allStrands) if (s.alive) liveStrands.push(s);
  if (liveStrands.length >= 2) {
    for (let si = 0; si < liveStrands.length; si++) {
      const sa = liveStrands[si];
      for (let sj = si + 1; sj < liveStrands.length; sj++) {
        const sb = liveStrands[sj];
        for (const a of sa.pts) {
          for (const b of sb.pts) {
            const dx = b.x - a.x, dy = b.y - a.y;
            const dsq = dx * dx + dy * dy;
            if (dsq > REPEL_DIST_SQ || dsq < 0.01) continue;
            const d = Math.sqrt(dsq);
            const overlap = (REPEL_DIST - d) / d * 0.5;
            const px = dx * overlap, py = dy * overlap;
            if (!a.done) { a.x -= px; a.y -= py; }
            if (!b.done) { b.x += px; b.y += py; }
          }
        }
      }
    }
  }

  // Path building — separate pass so all repulsion (intra + cross) finishes
  // before we render. Otherwise paths drawn early in the loop would show
  // pre-repulsion positions for one frame.
  for (const s of allStrands) {
    if (!s.alive) continue;
    if (s.pts.length >= 2) {
      // When snapped to a tracePath, render with L (line) segments —
      // they pass through the actual sample points, preserving sharp
      // letter corners. Q (quadratic) smoothing is for free Verlet ropes
      // where the curvy aesthetic helps; on letter shapes it cuts corners
      // and creates visible gaps.
      const snapped = s.targetPositions !== null && performance.now() >= s.arrivedAt;
      let d = `M${s.pts[0].x.toFixed(1)} ${s.pts[0].y.toFixed(1)}`;
      for (let i = 1; i < s.pts.length; i++) {
        if (i - 1 < s.lks.length && s.lks[i - 1].broken) {
          d += ` M${s.pts[i].x.toFixed(1)} ${s.pts[i].y.toFixed(1)}`;
          continue;
        }
        if (snapped) {
          d += ` L${s.pts[i].x.toFixed(1)} ${s.pts[i].y.toFixed(1)}`;
        } else {
          const px = s.pts[i - 1].x, py = s.pts[i - 1].y;
          const cx = (px + s.pts[i].x) / 2, cy = (py + s.pts[i].y) / 2;
          d += ` Q${px.toFixed(1)} ${py.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)}`;
        }
      }
      // Closure handling moved to samplePath (per-subpath closure samples
      // appended after each Z-terminated subpath). This avoids the
      // multi-subpath case where appending L back to pts[0] would draw
      // an unwanted line across the whole glyph from the last subpath's
      // tail to the first subpath's start.
      s.pathEl.setAttribute('d', d);
    }
  }

  if (allStrands.some(s => s.alive)) {
    requestAnimationFrame(tick);
  } else {
    tickRunning = false;
  }
}

function spawnString(origin: HTMLElement, opts: StringOptions) {
  bindStringCursor();
  // Speedgate: read once per spawn so every derived timing in this
  // burst respects the same scale. durationScale combines render mode
  // (full=1, reduced=2) with user-pref speed (fast=0.75, normal=1,
  // gentle=1.5, slow=2). Particle pressure/velocity stays at author
  // values — the strand still covers the same distance, it just
  // emits slower and lives longer.
  const speedScale = getAnimationConfig().durationScale;
  // Walk past hidden <template> siblings to the real interactive child
  let originEl: Element = origin;
  for (const child of Array.from(origin.children)) {
    if (child.tagName !== 'TEMPLATE') { originEl = child; break; }
  }
  const oRect = originEl.getBoundingClientRect();
  const cx = oRect.left + oRect.width / 2;
  const cy = oRect.top + oRect.height / 2;

  // Resolve target centre once — `to: 'target'` aims strands at this point.
  let targetX = cx, targetY = cy;
  if (opts.to === 'target' && opts.targetEl) {
    const tr = opts.targetEl.getBoundingClientRect();
    targetX = tr.left + tr.width / 2;
    targetY = tr.top + tr.height / 2;
  }

  // For tracePath retriggers: instant-clear existing strands so the new
  // burst is a clean rewrite. Fading stale strand pathEls in DOM piled
  // up under rapid clicks (each click stranded its predecessor's
  // mid-flight rendering for ~800ms while a new burst spawned over the
  // top). The strand cap also chops a partial slice out of the old
  // phrase mid-flight if we let it run, so we override that here.
  if (opts.tracePaths.length > 0 && allStrands.length > 0) {
    for (const old of allStrands) {
      old.pathEl.remove();
      old.alive = false;
    }
    allStrands.length = 0;
  } else {
    evictOldestStrands(opts.strands);
  }

  const svg = getOverlay();
  const palette = opts.colors.length
    ? opts.colors
    : ['#ff1493', '#00d9a0', '#ffc400', '#00b8ff', '#ff5533', '#b84dff'];

  // One mask per spawn-event hides any strand point that's still inside
  // the source button rect. Strings emerge from behind the button rather
  // than visibly piling on top of its centre at the moment of spawn.
  // Only meaningful when strands actually spawn at the source rect — for
  // edges/viewport spawns they start outside it, so the mask is dead work.
  const needsMask = opts.from === 'origin';
  const maskId = needsMask ? buildSourceMask(svg, oRect) : '';

  // Convert spread from degrees → radians once
  const spreadRad = opts.spread * Math.PI / 180;
  const fullCircle = spreadRad >= Math.PI * 1.9;

  // Shared trace frame — one bbox/scale across all paths so multi-path
  // logos preserve their relative layout (each strand uses the SAME
  // centre + scale, so paths don't all stack on origin).
  const traceFrame = opts.tracePaths.length
    ? computeTraceFrame(opts.tracePaths, opts.traceSize)
    : null;

  for (let s = 0; s < opts.strands; s++) {
    // Deterministic palette cycle so all colours appear at least once
    // when strands count >= palette length.
    const colour = palette[s % palette.length];
    const strand = new Strand(colour, opts.thick, svg);
    strand.collide = opts.collide;
    // Convergence + magnet strands ignore gravity. Convergence: gravity
    // sagging an aimed strand reads as flaccid. Magnet: gravity drags
    // strands to the floor where they lock done (st > 20) and stop
    // responding to the cursor pull. Both want clean magnet/aim motion
    // as the only force. Authors who want gravity-arc convergence can
    // fork later.
    strand.gravity = (
      opts.to === 'origin' ||
      opts.to === 'target' ||
      opts.magnetCursor !== 'off'
    ) ? 0 : opts.gravity;
    strand.stickiness = opts.stickiness;
    if (opts.magnetCursor !== 'off') {
      strand.magnetCursor = opts.magnetCursor;
      strand.magnetActiveAt = performance.now() + opts.emitDuration * speedScale;
    }

    // Path-trace setup — sample N points along the SVG path, position them
    // relative to the burst origin (or target rect's centre when
    // `to: target`). Strand starts arrival lerp at emitDuration + 200ms,
    // by which time the head should be near the destination.
    if (opts.tracePaths.length && traceFrame) {
      // One strand per path when multi-path; cycle if strands > paths.
      // All strands sample with the SHARED frame so multi-path logos
      // preserve relative layout instead of stacking on origin.
      // traceOffsetX/Y shift the whole traced shape away from the burst
      // origin — useful when the source button would otherwise obscure
      // the trace (e.g. negative Y to put a phrase above the button).
      const pathData = opts.tracePaths[s % opts.tracePaths.length];
      const offsetX = (opts.to === 'target' ? targetX : cx) + opts.traceOffsetX;
      const offsetY = (opts.to === 'target' ? targetY : cy) + opts.traceOffsetY;
      const sampled = samplePath(pathData, opts.length, offsetX, offsetY, traceFrame);
      strand.targetPositions = sampled.points;
      // Mark the strand link that crosses each subpath boundary as
      // broken — render loop already checks `lks[i-1].broken` and emits
      // an SVG M instead of L there, so multi-contour glyphs draw as
      // separate strokes (no stray line bisecting 'a', 'e', 'g', etc.).
      // Run after first emission tick has populated lks; queue via
      // microtask so spawn loop can finish adding all points first.
      strand.targetBreaks = sampled.breaks;
      strand.arrivedAt = performance.now() + (opts.emitDuration + 200) * speedScale;
    }
    if (needsMask) strand.pathEl.setAttribute('mask', `url(#${maskId})`);

    // Per-strand spawn position from `from`. Each strand can spawn at a
    // different edge point (so an `edges` burst of 7 strands fans across
    // the whole viewport perimeter rather than from one origin).
    const spawn = pickSpawnPos(opts.from, cx, cy);

    // Initial emit angle — branches by `to`. 'away' uses the existing
    // even-distribution cone (radial outward). Convergence modes aim
    // each strand at a destination.
    let angleBase: number;
    if (opts.to !== 'away') {
      const destX = opts.to === 'cursor' ? stringCursorX
                  : opts.to === 'target' ? targetX
                  : cx;
      const destY = opts.to === 'cursor' ? stringCursorY
                  : opts.to === 'target' ? targetY
                  : cy;
      angleBase = Math.atan2(destY - spawn.y, destX - spawn.x);
      // Mild jitter so multiple strands aiming at the same target spread
      // out instead of overlapping along the same vector.
      angleBase += (Math.random() - 0.5) * 0.3;
    } else if (opts.strands === 1) {
      angleBase = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
    } else if (fullCircle) {
      angleBase = -Math.PI / 2 + s * (2 * Math.PI / opts.strands);
    } else {
      const span = spreadRad / Math.max(opts.strands - 1, 1);
      angleBase = -Math.PI / 2 + (s - (opts.strands - 1) / 2) * span;
    }
    // Tiny jitter so deterministic distribution still feels organic
    angleBase += (Math.random() - 0.5) * 0.08;

    // Tethered magnet: when magnetCursor + collide are both true, pin
    // strand point 0 to a random text/heading rect. Other points emit
    // toward cursor and get magnet-pulled — link constraints distribute
    // them along the rope between anchor and cursor. Result: rainbow
    // tendrils reaching from random page elements toward your cursor.
    //
    // Note: tracePath is already excluded by the magnetCursor mutex above
    // (line ~770), so anchored tendrils are pure magnet behaviour — no
    // path sampling competes with the anchor.
    //
    // Anchor placement is constrained to avoid landing in whitespace:
    //   - Skip rects taller than 80px (likely multi-line paragraphs with
    //     line gaps where an anchor would look like it's grabbing nothing)
    //   - Y is the rect's vertical centre (where text actually sits)
    //   - X has 15% margin on each side (avoid corners)
    // Tethered tendrils only apply to attract magnet — repel + anchored
    // would be incoherent (point pinned at one end while being pushed
    // away from cursor at the other).
    const isAnchored = opts.magnetCursor === 'attract' && opts.collide;
    if (isAnchored) strand.anchored = true;
    let anchorX = spawn.x, anchorY = spawn.y;
    if (isAnchored) {
      // Re-query elements (not just rects) so we can read computed colour
      // when inheritAnchorColour is on. Same filter logic as before:
      // skip tall multi-line paragraphs, prefer the smaller-rect set.
      const els = Array.from(document.querySelectorAll(COLLIDE_SELECTOR));
      const tagged = els
        .map(el => ({ el, rect: el.getBoundingClientRect() }))
        .filter(t => t.rect.width > 0 && t.rect.height > 0);
      const shortPool = tagged.filter(t => t.rect.height < 80);
      const pool = shortPool.length > 0 ? shortPool : tagged;
      if (pool.length > 0) {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        const r = pick.rect;
        anchorX = r.left + r.width * (0.15 + Math.random() * 0.7);
        anchorY = r.top + r.height * 0.5;
        // Inherit anchor element's text colour. getComputedStyle returns
        // an rgb()/rgba() string — usable directly as SVG stroke value.
        // We mutate strand.pathEl.stroke; the strand was already created
        // with the palette colour, this overrides it.
        if (opts.inheritAnchorColour) {
          const anchorColour = getComputedStyle(pick.el).color;
          if (anchorColour && anchorColour !== 'rgba(0, 0, 0, 0)') {
            strand.pathEl.setAttribute('stroke', anchorColour);
          }
        }
      }
    }

    // Push to active list now that all stroke/anchor setup is final —
    // tick() never sees the strand with stale palette colour before the
    // anchor inheritance kicks in (race-free even though pts.length === 0
    // means the renderer would skip it anyway).
    allStrands.push(strand);

    const interval = (opts.emitDuration * speedScale) / opts.length;

    for (let i = 0; i < opts.length; i++) {
      setTimeout(() => {
        if (!strand.alive) return;
        if (i === 0 && isAnchored) {
          // Pin first point to the chosen anchor element. done = true
          // means Verlet integration skips it, link constraints don't
          // push it (Lk.solve has !a.done guard), and the magnet block
          // skips it (also has !p.done guard). Anchor stays put while
          // the rest of the rope flies toward the cursor.
          strand.add(anchorX, anchorY, 0, 0);
          strand.pts[0].done = true;
        } else {
          // Curl + jitter: sin wave for coiling, random for chaos. Trace
          // bursts double the curl coefficients so strands take visibly
          // curvy flight paths to their letter destinations instead of
          // arrowing straight in. For free silly-string the lower values
          // keep the rope from flailing too wildly.
          const isTracing = opts.tracePaths.length > 0;
          const sinAmp = isTracing ? 0.9 : 0.4;
          const randAmp = isTracing ? 0.8 : 0.4;
          const a = angleBase + Math.sin(i * 0.3) * sinAmp + (Math.random() - 0.5) * randAmp;
          const speed = opts.pressure + Math.random() * 2;
          strand.add(spawn.x, spawn.y, Math.cos(a) * speed, Math.sin(a) * speed);
        }
      }, i * interval);
    }

    // Lifespan: fade in last 1s of life, then remove. Floor at 1000ms
    // so a tiny lifespan still gets a visible fade. Speedgate-scaled so
    // gentle/slow modes proportionally extend on-screen time.
    const lifespan = Math.max(opts.lifespan, 1000) * speedScale;
    const fadeStart = Math.max(lifespan - 1000 * speedScale, 1000 * speedScale);
    setTimeout(() => { strand.pathEl.style.opacity = '0'; }, fadeStart);
    setTimeout(() => {
      strand.pathEl.remove();
      strand.alive = false;
      const idx = allStrands.indexOf(strand);
      if (idx > -1) allStrands.splice(idx, 1);
    }, lifespan);
  }

  // Mask is only useful during the spawn-emit window — after that, all
  // points have flown out of the source rect and the mask just clips any
  // later motion that drifts back across the button (looks broken).
  // Strip the mask attribute from each strand the moment emit finishes,
  // then remove the mask def itself shortly after.
  const emitWindow = (opts.emitDuration + 80) * speedScale;
  const burstStrands: Strand[] = allStrands.slice(allStrands.length - opts.strands);
  if (needsMask) {
    setTimeout(() => {
      for (const st of burstStrands) {
        st.pathEl.removeAttribute('mask');
      }
      removeMask(maskId);
    }, emitWindow);
  }

  // Target reveal flag — fire when the swarm has visibly arrived. Strings
  // emit across emitDuration ms; head reaches the target first. Decoupled
  // from collision so the target doesn't need to be in COLLIDE_SELECTOR.
  if (opts.to === 'target' && opts.targetEl) {
    const tEl = opts.targetEl;
    setTimeout(() => {
      if (!tEl.hasAttribute('data-string-landed')) {
        tEl.setAttribute('data-string-landed', 'true');
      }
    }, (opts.emitDuration + 200) * speedScale);
  }

  if (!tickRunning) {
    tickRunning = true;
    requestAnimationFrame(tick);
  }
}

// Resolve palette/colour from existing Burst data attrs. Burst already
// emits per-palette templates — for string mode we don't clone them, but
// we can probe each template's first child for its computed stroke colour.
function extractColoursFromTemplates(el: Element): string[] {
  const tplAttr = el.getAttribute('data-particle-templates');
  if (!tplAttr) return [];
  const colours: string[] = [];
  for (const id of tplAttr.split(',').map(s => s.trim())) {
    const tpl = document.getElementById(id) as HTMLTemplateElement | null;
    if (!tpl) continue;
    const first = tpl.content.firstElementChild as HTMLElement | null;
    if (!first) continue;
    // Probe the first child's computed colour. The template's content
    // includes Shape/Icon/wrapper with .color--{name} class set.
    const probe = first.cloneNode(true) as HTMLElement;
    probe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(probe);
    const c = getComputedStyle(probe).color;
    document.body.removeChild(probe);
    if (c && c !== 'rgba(0, 0, 0, 0)') colours.push(c);
  }
  return colours;
}

function readOptions(el: Element): StringOptions {
  const opts: StringOptions = { ...DEFAULTS };
  const get = (k: string) => el.getAttribute(`data-particle-${k}`);

  if (get('strands')) opts.strands = parseInt(get('strands')!);
  if (get('length')) opts.length = parseInt(get('length')!);
  if (get('pressure')) opts.pressure = parseFloat(get('pressure')!);
  if (get('emit-duration')) opts.emitDuration = parseInt(get('emit-duration')!);
  if (get('gravity')) opts.gravity = parseFloat(get('gravity')!);
  if (get('thick')) opts.thick = parseFloat(get('thick')!);
  if (get('lifespan')) opts.lifespan = parseInt(get('lifespan')!);
  if (get('stickiness')) opts.stickiness = parseFloat(get('stickiness')!);
  // For string engine, spread is interpreted as cone-width DEGREES
  // (120 = wide cone, 360 = full circle). Burst.astro defaults spread
  // to 150 (px-style) for fly/physics; string mode reinterprets.
  if (get('spread')) opts.spread = parseFloat(get('spread')!);
  const c = get('collide');
  if (c === 'on') opts.collide = true;
  else if (c === 'off') opts.collide = false;
  const triggerAttr = get('trigger');
  if (triggerAttr === 'hover') opts.trigger = 'hover';
  else if (triggerAttr === 'hover-hold') opts.trigger = 'hover-hold';

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

  const tracePath = get('trace');
  if (tracePath) opts.tracePaths = tracePath.split('|');
  if (get('trace-size')) opts.traceSize = parseFloat(get('trace-size')!);
  if (get('trace-offset-x')) opts.traceOffsetX = parseFloat(get('trace-offset-x')!);
  if (get('trace-offset-y')) opts.traceOffsetY = parseFloat(get('trace-offset-y')!);

  if (el.hasAttribute('data-particle-inherit-anchor-colour')) opts.inheritAnchorColour = true;

  // magnetCursor is now an enum: 'off' | 'attract' | 'repel'. Backwards
  // compat: presence of data-particle-magnet-cursor without value (or
  // value 'true' / '') means attract (the original behaviour).
  const magnetAttr = get('magnet-cursor');
  if (magnetAttr === 'repel') opts.magnetCursor = 'repel';
  else if (magnetAttr === 'attract' || magnetAttr === '' || magnetAttr === 'true') opts.magnetCursor = 'attract';
  else if (el.hasAttribute('data-particle-magnet-cursor')) opts.magnetCursor = 'attract';

  // Mutual exclusion — strand can't both trace a fixed shape AND follow
  // the cursor. Magnet wins (more dynamic effect; if author wants the
  // shape they can just leave magnetCursor off).
  if (opts.magnetCursor !== 'off' && opts.tracePaths.length) {
    console.warn('[particle-string] magnetCursor and tracePath are mutually exclusive — magnetCursor wins');
    opts.tracePaths = [];
  }

  // Colours: prefer palette templates if present, otherwise fall back to
  // the literal colour-class attr on the wrapper itself.
  const fromTemplates = extractColoursFromTemplates(el);
  if (fromTemplates.length) {
    opts.colors = fromTemplates;
  } else {
    // Single colour from the wrapper's color class (rare — palette mode
    // is the common path for string-engine bursts)
    const wrapperColor = getComputedStyle(el).color;
    if (wrapperColor && wrapperColor !== 'rgba(0, 0, 0, 0)') {
      opts.colors = [wrapperColor];
    }
  }
  return opts;
}

// Tracks live hover-hold intervals so they can be cleared if the
// host element is detached during an Astro view transition. Without
// this, the interval keeps firing forever — its closure references
// the now-orphaned element and the original mouseleave listener that
// would have cleared it is gone with the element.
const hoverHoldIntervals = new Map<Element, ReturnType<typeof setInterval>>();

export function initParticleString(): void {
  if (typeof window === 'undefined') return;

  // GC orphaned hover-hold intervals from prior page navigations.
  // Persistent elements (still in DOM) keep their existing interval —
  // they're skipped by the data-particle-string-bound check below
  // and continue running uninterrupted.
  for (const [el, id] of hoverHoldIntervals) {
    if (!el.isConnected) {
      clearInterval(id);
      hoverHoldIntervals.delete(el);
    }
  }

  document.querySelectorAll('[data-particle-burst][data-particle-engine="string"]').forEach((element) => {
    if (element.hasAttribute('data-particle-string-bound')) return;
    element.setAttribute('data-particle-string-bound', 'true');

    const htmlEl = element as HTMLElement;
    // Defer reading options until first fire so palette templates are
    // already in the DOM and CSS variables are computed.
    let opts: StringOptions | null = null;

    const fire = (e: Event) => {
      if (!getAnimationConfig().canAnimate) return;
      if (!opts) opts = readOptions(element);
      spawnString(htmlEl, opts);
      if (element.tagName === 'A' && (element as HTMLAnchorElement).href) {
        e.preventDefault();
        const href = (element as HTMLAnchorElement).href;
        setTimeout(() => { window.location.href = href; }, 400);
      }
    };

    const triggerVal = element.getAttribute('data-particle-trigger');
    const trigger = triggerVal === 'hover' ? 'hover'
                  : triggerVal === 'hover-hold' ? 'hover-hold'
                  : 'click';
    if (trigger === 'hover') {
      // Single fire on mouseenter, 2s cooldown before next fire (scaled
      // by the speedgate so gentle/slow modes hold the cooldown longer).
      let cooldown = false;
      htmlEl.addEventListener('mouseenter', (e) => {
        if (cooldown) return;
        cooldown = true;
        fire(e);
        setTimeout(() => { cooldown = false; }, 2000 * getAnimationConfig().durationScale);
      });
    } else if (trigger === 'hover-hold') {
      // Continuous re-fire while hovered. Interval is 1500ms baseline —
      // enough time for a previous burst to fade out before the next
      // fires (otherwise the strand cap kicks in and bursts get evicted).
      // Speedgate-scaled so gentle/slow modes also slow the re-fire rate.
      // Stops emitting on mouseleave; resumes on next mouseenter.
      // Interval ID is also tracked in hoverHoldIntervals so that across
      // Astro view transitions, intervals attached to elements that have
      // been removed from the DOM get garbage-collected on next init.
      let intervalId: ReturnType<typeof setInterval> | null = null;
      htmlEl.addEventListener('mouseenter', (e) => {
        fire(e);
        if (intervalId !== null) return;
        intervalId = setInterval(() => fire(new MouseEvent('hover')), 1500 * getAnimationConfig().durationScale);
        hoverHoldIntervals.set(htmlEl, intervalId);
      });
      htmlEl.addEventListener('mouseleave', () => {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
          hoverHoldIntervals.delete(htmlEl);
        }
      });
    } else {
      // Per-element click cooldown — prevents 50-click-spam from melting
      // the cross-strand repulsion. 250ms = max ~4 fires/sec per button,
      // which is faster than humans naturally click and slow enough that
      // the active-strand cap keeps up.
      let lastClick = 0;
      htmlEl.addEventListener('click', (e) => {
        const now = performance.now();
        if (now - lastClick < 250) return;
        lastClick = now;
        fire(e);
      });
    }
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleString);
  } else {
    initParticleString();
  }
  document.addEventListener('astro:page-load', initParticleString);
}
