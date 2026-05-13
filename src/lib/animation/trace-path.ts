/**
 * Shared trace-path sampling — letter-outline sampling used by the
 * string engine and the physics engine for "particles form text"
 * patterns. Extracted from particle-string.ts so both engines can
 * call the same code and behaviour stays consistent.
 *
 * Two operations:
 *   computeTraceFrame(paths, targetSize) → shared bbox/scale across
 *     multiple paths so multi-path logos preserve layout (each path
 *     sampled against the SAME frame, doesn't auto-centre on origin).
 *   samplePath(pathData, n, offsetX, offsetY, frame) → N points
 *     evenly distributed along the path, with multi-subpath awareness
 *     (counter shapes of a/e/g/o sampled separately, with break
 *     indices for the consumer to render as pen-lifts).
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Shared coordinate transform applied to a path so it renders at a
 *  consistent size + position. Used by multi-path logos: the N paths
 *  share a single bbox/scale, preserving their relative positions in
 *  the original SVG. Without this, each path would auto-centre on the
 *  burst origin and they'd all stack. */
export interface TraceFrame {
  cx: number;
  cy: number;
  scale: number;
}

/** Compute one TraceFrame across N path strings. All paths get appended
 *  to one hidden SVG so getBBox returns the union bbox — the same frame
 *  is then used to sample each path, so multi-path logos keep their
 *  original layout instead of having every path auto-centre on origin. */
export function computeTraceFrame(pathDatas: string[], targetSize: number): TraceFrame {
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

/** Sample N positions along an SVG path using a shared TraceFrame.
 *
 *  Multi-subpath aware: stencil fonts (and any path with multiple M
 *  commands) have several closed contours per glyph. getTotalLength on
 *  such paths often excludes the Z (close) edges, so naive uniform
 *  sampling misses every subpath's closing segment — visually ~20% of
 *  each letter's perimeter is dropped.
 *
 *  Fix: split the path data on M boundaries, sample each subpath
 *  proportionally to its own length, and append the start point as a
 *  final sample for any Z-terminated subpath. The variable point count
 *  is fine for path-snap (strand uses the first N entries).
 *
 *  Returns:
 *    points — N×{x,y} positions in screen-space (post-transform).
 *    breaks — indices in `points` where a new subpath begins (i.e.
 *             first point of subpath 2, 3, ...). The consumer marks
 *             the strand link spanning each boundary as broken so the
 *             renderer inserts an SVG M (moveTo) instead of an L —
 *             without this, multi-contour glyphs (a, e, g, o) get a
 *             stray line drawn from the outer contour's closing point
 *             straight to the inner counter's first point. */
export function samplePath(
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
