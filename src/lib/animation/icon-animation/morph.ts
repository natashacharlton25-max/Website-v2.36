/**
 * Goo morph for Icon and Shape atoms — two-blob approach
 *
 * Reads `data-icon-morph` + `data-icon-morph-target` (and related morphStagger
 * attributes) and animates a structurally-matched two-blob morph:
 *
 *   Shape A (with holes)
 *     → shrink cutouts to center
 *   Shape A (solid)
 *     → morph to Blob A (matched point count, angle, winding)
 *   Blob A
 *     → morph to Blob B (two amorphous shapes, no structure to flip)
 *   Blob B
 *     → morph to Shape B (solid) (matched point count, angle, winding)
 *   Shape B (solid)
 *     → grow cutouts from center
 *   Shape B (with holes)
 *
 * Each blob is generated to match its source shape's point count, start angle,
 * and winding direction. Because the blobs are structurally matched, every morph
 * step uses `type: 'linear'` — no rotational correction needed. The goo blur
 * filter masks any mid-tween artifacts during the blob-to-blob transition.
 *
 * Cutout handling: before the blob phase, cutout segments (holes inside the
 * outer path) are identified via ray-casting containment test, then collapsed
 * to their center points. After the blob phase, cutouts expand from zero on
 * the target shape.
 *
 * Goo filter is a single shared <filter id="shape-goo"> injected once into
 * the document body. Its stdDeviation is animated per-morph via GSAP AttrPlugin.
 */

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionMode, getHoverMode, getScrollContainer, registerTrigger } from '../animation-config';

gsap.registerPlugin(MorphSVGPlugin, MotionPathPlugin, ScrollTrigger);

// Goo filter strength — animated by morph timelines via AttrPlugin
const GOO_BLUR_FULL = 5;
let gooeyFilterInjected = false;
let gooBlurEl: Element | null = null;

/**
 * Inject the gooey filter once into the document — referenced by all
 * shape morphs via filter: url(#shape-goo). The filter blurs then thresholds
 * alpha, making overlapping shapes merge like raindrops.
 *
 * gooBlurEl is the captured feGaussianBlur element. GSAP's AttrPlugin animates
 * its stdDeviation attribute during the morph so the gooey silhouette
 * tightens smoothly into the sharp target instead of snapping when the filter
 * is removed.
 */
function ensureGooeyFilter() {
  if (gooeyFilterInjected || typeof document === 'undefined') return;
  const existing = document.getElementById('shape-goo');
  if (existing) {
    gooeyFilterInjected = true;
    gooBlurEl = existing.querySelector('feGaussianBlur');
    return;
  }
  gooeyFilterInjected = true;
  const ns = 'http://www.w3.org/2000/svg';
  const host = document.createElementNS(ns, 'svg');
  host.setAttribute('aria-hidden', 'true');
  host.setAttribute('width', '0');
  host.setAttribute('height', '0');
  host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const defs = document.createElementNS(ns, 'defs');
  const filter = document.createElementNS(ns, 'filter');
  filter.setAttribute('id', 'shape-goo');
  filter.setAttribute('x', '-50%');
  filter.setAttribute('y', '-50%');
  filter.setAttribute('width', '200%');
  filter.setAttribute('height', '200%');
  const blur = document.createElementNS(ns, 'feGaussianBlur');
  blur.setAttribute('in', 'SourceGraphic');
  blur.setAttribute('stdDeviation', String(GOO_BLUR_FULL));
  blur.setAttribute('result', 'blur');
  const matrix = document.createElementNS(ns, 'feColorMatrix');
  matrix.setAttribute('in', 'blur');
  matrix.setAttribute('mode', 'matrix');
  matrix.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -5');
  matrix.setAttribute('result', 'goo');
  const composite = document.createElementNS(ns, 'feComposite');
  composite.setAttribute('in', 'SourceGraphic');
  composite.setAttribute('in2', 'goo');
  composite.setAttribute('operator', 'atop');
  filter.appendChild(blur);
  filter.appendChild(matrix);
  filter.appendChild(composite);
  defs.appendChild(filter);
  host.appendChild(defs);
  document.body.appendChild(host);
  gooBlurEl = blur;
}

// ================================================================
// BLOB GENERATION UTILITIES
// ================================================================

/** A GSAP raw path segment: flat array [x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1, ...] */
type RawSegment = number[] & { closed?: boolean };
type RawPath = RawSegment[];

/**
 * Compute the centroid of a raw path segment by averaging all on-curve points.
 * On-curve points are at indices 0,1 then every 6 after (i.e. the endpoint of
 * each cubic curve).
 */
function segmentCenter(seg: RawSegment): { x: number; y: number } {
  let sx = 0, sy = 0, count = 0;
  // First point
  sx += seg[0]; sy += seg[1]; count++;
  // Each curve endpoint: indices 6,7  12,13  18,19 ...
  for (let i = 6; i < seg.length; i += 6) {
    sx += seg[i]; sy += seg[i + 1]; count++;
  }
  return { x: sx / count, y: sy / count };
}

/**
 * Count the number of cubic bezier curves in a segment.
 * Segment layout: [x0, y0, cp1x, cp1y, cp2x, cp2y, x1, y1, ...]
 * So numCurves = (length - 2) / 6
 */
function segmentPointCount(seg: RawSegment): number {
  return (seg.length - 2) / 6;
}

/**
 * Compute the signed area of a segment to determine winding direction.
 * Uses the shoelace formula on the on-curve points.
 * Positive = counter-clockwise, Negative = clockwise (in SVG coords where Y increases downward).
 */
function segmentSignedArea(seg: RawSegment): number {
  const pts: { x: number; y: number }[] = [];
  pts.push({ x: seg[0], y: seg[1] });
  for (let i = 6; i < seg.length; i += 6) {
    pts.push({ x: seg[i], y: seg[i + 1] });
  }
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i].x * pts[j].y;
    area -= pts[j].x * pts[i].y;
  }
  return area / 2;
}

/**
 * Generate a blob path string that structurally matches the given raw path segment.
 *
 * The blob has the exact same number of cubic bezier curves as the source,
 * starts at the same angle from center, winds in the same direction, and has
 * randomised radius per point (±20% variation) to look organic.
 *
 * Uses Catmull-Rom → cubic bezier conversion to produce smooth curves through
 * the generated points.
 *
 * @param seg - The source raw path segment to match
 * @param cx - Center X of the blob
 * @param cy - Center Y of the blob
 * @param radius - Base radius of the blob
 * @returns SVG path `d` string
 */
function generateMatchedBlob(
  seg: RawSegment,
  cx: number,
  cy: number,
  radius: number,
  seedOffset = 0,
  overrideAngle?: number,
  overrideWinding?: number
): string {
  const numCurves = segmentPointCount(seg);
  if (numCurves < 1) return `M${cx},${cy}Z`;

  // Start angle: use override (for blob→blob matching) or inherit from shape
  const startAngle = overrideAngle ?? Math.atan2(seg[1] - cy, seg[0] - cx);

  // Winding direction: use override or inherit from shape
  const signedArea = segmentSignedArea(seg);
  const windingDir = overrideWinding ?? (signedArea >= 0 ? 1 : -1);

  // Generate points around the circle. For a closed path with N curves,
  // there are N distinct on-curve points (the last connects back to the first).
  const angleStep = (2 * Math.PI * windingDir) / numCurves;

  // Seeded random — seedOffset ensures Blob A and Blob B are visually distinct
  let seed = Math.abs(seg[0] * 7 + seg[1] * 13 + numCurves * 31 + seedOffset * 997) % 1000;
  const pseudoRandom = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return (seed / 2147483648);
  };

  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numCurves; i++) {
    const angle = startAngle + i * angleStep;
    // ±20% radius variation
    const r = radius * (0.8 + 0.4 * pseudoRandom());
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }

  // Convert points to cubic bezier path using Catmull-Rom to cubic conversion.
  // For a closed curve through N points, each segment i→i+1 uses points
  // [i-1, i, i+1, i+2] (wrapping around) to compute control points.
  //
  // Catmull-Rom → Cubic Bezier:
  //   Given points P0, P1, P2, P3 (P1→P2 is the segment):
  //   CP1 = P1 + (P2 - P0) / 6
  //   CP2 = P2 - (P3 - P1) / 6
  const n = points.length;
  if (n < 2) {
    // Degenerate: single point — make a tiny circle
    const px = points[0].x, py = points[0].y;
    const tiny = radius * 0.01;
    return `M${px - tiny},${py}A${tiny},${tiny},0,1,1,${px + tiny},${py}A${tiny},${tiny},0,1,1,${px - tiny},${py}Z`;
  }

  let d = `M${points[0].x},${points[0].y}`;

  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    // Control point 1: P1 + (P2 - P0) / 6
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    // Control point 2: P2 - (P3 - P1) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += `C${cp1x},${cp1y},${cp2x},${cp2y},${p2.x},${p2.y}`;
  }

  d += 'Z';
  return d;
}

// ================================================================
// CUTOUT (HOLE) DETECTION AND HANDLING
// ================================================================

/**
 * Ray-casting point-in-polygon test. Tests whether a point (px, py)
 * is inside the polygon defined by the on-curve points of a segment.
 */
function pointInSegment(px: number, py: number, seg: RawSegment): boolean {
  // Extract on-curve points
  const pts: { x: number; y: number }[] = [];
  pts.push({ x: seg[0], y: seg[1] });
  for (let i = 6; i < seg.length; i += 6) {
    pts.push({ x: seg[i], y: seg[i + 1] });
  }

  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    const intersect = ((yi > py) !== (yj > py)) &&
      (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Determine whether innerSeg is a cutout (hole) contained within outerSeg.
 * Tests the centroid of innerSeg against the polygon of outerSeg.
 */
function isContainedIn(innerSeg: RawSegment, outerSeg: RawSegment): boolean {
  const center = segmentCenter(innerSeg);
  return pointInSegment(center.x, center.y, outerSeg);
}

/**
 * Given a raw path, return the indices of segments that are cutouts
 * (contained within segment 0, the outer boundary).
 */
function findCutoutIndices(rawPath: RawPath): number[] {
  if (rawPath.length <= 1) return [];
  const outer = rawPath[0];
  const cutouts: number[] = [];
  for (let i = 1; i < rawPath.length; i++) {
    if (isContainedIn(rawPath[i], outer)) {
      cutouts.push(i);
    }
  }
  return cutouts;
}

/**
 * Build a path string where cutout segments have all their points collapsed
 * to the segment's own centroid. The outer segment (and any non-cutout segments)
 * are left unchanged.
 *
 * @param rawPath - The original raw path
 * @param cutoutIndices - Indices of segments to collapse
 * @returns SVG path `d` string with cutouts collapsed
 */
function collapseCutouts(rawPath: RawPath, cutoutIndices: number[]): string {
  const cutoutSet = new Set(cutoutIndices);
  const modifiedSegments: string[] = [];

  for (let si = 0; si < rawPath.length; si++) {
    const seg = rawPath[si];
    if (cutoutSet.has(si)) {
      // Collapse all points to this segment's center
      const center = segmentCenter(seg);
      const numCurves = segmentPointCount(seg);
      // Build a degenerate path where every point is the center
      let segD = `M${center.x},${center.y}`;
      for (let c = 0; c < numCurves; c++) {
        segD += `C${center.x},${center.y},${center.x},${center.y},${center.x},${center.y}`;
      }
      if (seg.closed) segD += 'Z';
      modifiedSegments.push(segD);
    } else {
      // Keep original segment — reconstruct its path string
      modifiedSegments.push(segmentToString(seg));
    }
  }

  return modifiedSegments.join('');
}

/**
 * Build a path string where cutout segments are collapsed to zero (their centers)
 * while non-cutout segments use the target shape's data. This is the starting
 * point for the "expand cutouts" animation on the target shape.
 *
 * @param targetRawPath - The target shape's raw path
 * @param cutoutIndices - Indices of segments that are cutouts in the target
 * @returns SVG path `d` string with target's cutouts at zero
 */
function expandCutoutsBase(targetRawPath: RawPath, cutoutIndices: number[]): string {
  const cutoutSet = new Set(cutoutIndices);
  const modifiedSegments: string[] = [];

  for (let si = 0; si < targetRawPath.length; si++) {
    const seg = targetRawPath[si];
    if (cutoutSet.has(si)) {
      // Cutout starts collapsed at its center
      const center = segmentCenter(seg);
      const numCurves = segmentPointCount(seg);
      let segD = `M${center.x},${center.y}`;
      for (let c = 0; c < numCurves; c++) {
        segD += `C${center.x},${center.y},${center.x},${center.y},${center.x},${center.y}`;
      }
      if (seg.closed) segD += 'Z';
      modifiedSegments.push(segD);
    } else {
      modifiedSegments.push(segmentToString(seg));
    }
  }

  return modifiedSegments.join('');
}

/**
 * Convert a raw path segment back to an SVG path `d` string fragment.
 */
function segmentToString(seg: RawSegment): string {
  if (seg.length < 2) return '';
  let d = `M${seg[0]},${seg[1]}`;
  for (let i = 2; i < seg.length; i += 6) {
    d += `C${seg[i]},${seg[i + 1]},${seg[i + 2]},${seg[i + 3]},${seg[i + 4]},${seg[i + 5]}`;
  }
  if (seg.closed) d += 'Z';
  return d;
}

/**
 * Convert an entire raw path (array of segments) to an SVG `d` string.
 */
function rawPathToD(rawPath: RawPath): string {
  return rawPath.map(segmentToString).join('');
}

/**
 * Generate the full blob path string for an entire raw path (multiple segments).
 * The outer segment gets a blob. Cutout segments get collapsed to their centers.
 *
 * @param rawPath - Source raw path
 * @param cx - Center X
 * @param cy - Center Y
 * @param radius - Base radius for the blob
 * @param cutoutIndices - Which segments are cutouts
 * @returns SVG path `d` string
 */
function generateFullBlob(
  rawPath: RawPath,
  cx: number,
  cy: number,
  radius: number,
  cutoutIndices: number[],
  seedOffset = 0,
  overrideAngle?: number,
  overrideWinding?: number
): string {
  const cutoutSet = new Set(cutoutIndices);
  const parts: string[] = [];

  for (let si = 0; si < rawPath.length; si++) {
    const seg = rawPath[si];
    if (cutoutSet.has(si)) {
      // Cutout: collapse to center (degenerate path with correct point count)
      const center = segmentCenter(seg);
      const numCurves = segmentPointCount(seg);
      let segD = `M${center.x},${center.y}`;
      for (let c = 0; c < numCurves; c++) {
        segD += `C${center.x},${center.y},${center.x},${center.y},${center.x},${center.y}`;
      }
      if (seg.closed) segD += 'Z';
      parts.push(segD);
    } else {
      // Non-cutout: generate a blob matched to this segment's structure
      parts.push(generateMatchedBlob(seg, cx, cy, radius, seedOffset, overrideAngle, overrideWinding));
    }
  }

  return parts.join('');
}

// ================================================================
// MAIN INIT
// ================================================================

export function initMorphIcon(el: HTMLElement) {
  if (getMotionMode() === 'none') return;
  // Draw-morph handles this icon instead
  if (el.dataset.iconDraw) return;

  const svg = el.querySelector('svg');
  if (!svg) return;

  const ns = 'http://www.w3.org/2000/svg';

  // Convert non-path elements to <path> for smoother morphing
  svg.querySelectorAll('circle, rect, polygon, polyline, ellipse, line').forEach(e => {
    MorphSVGPlugin.convertToPath(e as any);
  });

  // Goo filter setup — applies to ALL morphs (icons + shapes)
  ensureGooeyFilter();
  svg.setAttribute('overflow', 'visible');
  svg.style.overflow = 'visible';

  // Split compound paths for staggered morph (shapes only — icons keep
  // compound paths for cutouts)
  const isShape = el.classList.contains('shape');
  if (isShape) {
    svg.querySelectorAll('path').forEach(p => {
      const rawPath = MotionPathPlugin.getRawPath(p as any);
      if (rawPath.length <= 1) return;
      const parent = p.parentNode;
      if (!parent) return;
      const attributes = Array.from(p.attributes);
      rawPath.forEach((segment: any) => {
        const newPath = document.createElementNS(ns, 'path');
        attributes.forEach(attr => {
          if (attr.nodeName !== 'd') newPath.setAttributeNS(null, attr.nodeName, attr.nodeValue || '');
        });
        newPath.setAttributeNS(null, 'd',
          'M' + segment[0] + ',' + segment[1] + 'C' + segment.slice(2).join(',') + (segment.closed ? 'z' : ''));
        parent.insertBefore(newPath, p);
      });
      parent.removeChild(p);
    });
  }

  const paths = Array.from(svg.querySelectorAll('path')) as SVGPathElement[];
  if (!paths.length) return;

  const morphTargetHTML = el.dataset.iconMorphTarget;
  if (!morphTargetHTML) return;

  const morphColor = el.dataset.iconMorphColor;

  // Stagger props
  const staggerTotalMap: Record<string, number> = { none: 0, tight: 0.3, normal: 0.6, loose: 1.2 };
  const morphStagger = staggerTotalMap[el.dataset.iconMorphStagger || 'none'] ?? 0;
  const morphStaggerFrom = (el.dataset.iconMorphStaggerFrom || 'start') as 'start' | 'center' | 'end' | 'edges' | 'random';

  // Parse target SVG — convert + split compound paths
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = morphTargetHTML;
  tempDiv.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  document.body.appendChild(tempDiv);
  tempDiv.querySelectorAll('circle, rect, polygon, polyline, ellipse, line').forEach(e => {
    MorphSVGPlugin.convertToPath(e as any);
  });
  // Split target compound paths (shapes only)
  if (isShape) {
    tempDiv.querySelectorAll('path').forEach(p => {
      const rawPath = MotionPathPlugin.getRawPath(p as any);
      if (rawPath.length <= 1) return;
      const parent = p.parentNode;
      if (!parent) return;
      const attributes = Array.from(p.attributes);
      rawPath.forEach((segment: any) => {
        const newPath = document.createElementNS(ns, 'path');
        attributes.forEach(attr => {
          if (attr.nodeName !== 'd') newPath.setAttributeNS(null, attr.nodeName, attr.nodeValue || '');
        });
        newPath.setAttributeNS(null, 'd',
          'M' + segment[0] + ',' + segment[1] + 'C' + segment.slice(2).join(',') + (segment.closed ? 'z' : ''));
        parent.insertBefore(newPath, p);
      });
      parent.removeChild(p);
    });
  }
  const targetPaths = Array.from(tempDiv.querySelectorAll('path')) as SVGPathElement[];

  // Pre-compute raw paths for targets while still in DOM (getRawPath may
  // need computed geometry on some GSAP builds)
  const targetRawPaths: RawPath[] = targetPaths.map(tp =>
    MorphSVGPlugin.getRawPath(tp) as RawPath
  );

  document.body.removeChild(tempDiv);
  if (!targetPaths.length) return;

  // Get colours
  const computedStyle = getComputedStyle(el);
  const originalFill = computedStyle.color || '#fff';
  const targetFill = morphColor || originalFill;

  // ViewBox measurements for blob generation
  const vb = svg.viewBox.baseVal;
  const vbW = vb.width || 256;
  const vbH = vb.height || 256;
  const cx = (vb.x || 0) + vbW / 2;
  const cy = (vb.y || 0) + vbH / 2;
  const blobRadius = Math.min(vbW, vbH) * 0.25;

  // Store original path data
  paths.forEach(p => {
    (p as any)._originalD = p.getAttribute('d');
  });

  // ================================================================
  // KEEPER / EXTRAS MAPPING
  // ================================================================
  // Every source path is assigned to a target via floor(i * N / M).
  // The FIRST source per target group is the "keeper", the rest are "extras"
  // that fade out. When M === N, every path is a keeper.
  const M = paths.length;
  const N = targetPaths.length;
  const keepers: SVGPathElement[] = [];
  const keeperTargetIdx: number[] = [];
  const extras: SVGPathElement[] = [];

  const seenTarget = new Set<number>();
  paths.forEach((path, i) => {
    const targetIdx = Math.floor((i * N) / M);
    if (!seenTarget.has(targetIdx)) {
      seenTarget.add(targetIdx);
      keepers.push(path);
      keeperTargetIdx.push(targetIdx);
    } else {
      extras.push(path);
    }
  });
  // Safety: if some target indices were skipped, pull from extras to fill them
  while (keepers.length < N && extras.length > 0) {
    keepers.push(extras.shift()!);
    keeperTargetIdx.push(keeperTargetIdx.length);
  }

  // ================================================================
  // PRE-COMPUTE RAW PATHS, CUTOUTS, AND BLOB PATHS
  // ================================================================
  // For each keeper path, we pre-compute:
  //   - Source raw path + cutout indices + blob A path
  //   - Target raw path + cutout indices + blob B path
  //   - Collapsed/expanded path strings for cutout animation

  interface KeeperData {
    srcRawPath: RawPath;
    srcCutouts: number[];
    tgtRawPath: RawPath;
    tgtCutouts: number[];
    /** Source shape with cutouts collapsed (solid) */
    srcSolid: string;
    /** Blob matched to source structure */
    blobA: string;
    /** Blob matched to target structure */
    blobB: string;
    /** Target shape with cutouts collapsed (solid) */
    tgtSolid: string;
    /** Target shape with cutouts fully open (final state) */
    tgtFull: string;
    /** Source has cutouts that need animating */
    srcHasCutouts: boolean;
    /** Target has cutouts that need animating */
    tgtHasCutouts: boolean;
  }

  const keeperData: KeeperData[] = keepers.map((path, i) => {
    const targetIdx = keeperTargetIdx[i];

    // Get raw paths — source from live DOM, target from pre-computed cache
    const srcRawPath = MorphSVGPlugin.getRawPath(path) as RawPath;
    const tgtRawPath = targetRawPaths[targetIdx];

    // Identify cutouts
    const srcCutouts = findCutoutIndices(srcRawPath);
    const tgtCutouts = findCutoutIndices(tgtRawPath);

    // Source solid: cutouts collapsed to their centers
    const srcSolid = srcCutouts.length > 0
      ? collapseCutouts(srcRawPath, srcCutouts)
      : rawPathToD(srcRawPath);

    // Target solid: cutouts collapsed to their centers
    const tgtSolid = tgtCutouts.length > 0
      ? expandCutoutsBase(tgtRawPath, tgtCutouts)
      : rawPathToD(tgtRawPath);

    // Target full: all segments at their real positions
    const tgtFull = rawPathToD(tgtRawPath);

    // Both blobs share the SAME start angle (0°) and winding (CW=-1) so
    // BlobA→BlobB is a gentle shape shift, not a rotation/flip.
    // Only the seed differs → different wobble pattern.
    const blobAngle = 0;
    const blobWinding = -1; // CW

    // Generate blob A matched to source's point count (seed 0)
    const blobA = generateFullBlob(srcRawPath, cx, cy, blobRadius, srcCutouts, 0, blobAngle, blobWinding);

    // Generate blob B matched to target's point count (seed 1 — different wobble)
    const blobB = generateFullBlob(tgtRawPath, cx, cy, blobRadius, tgtCutouts, 1, blobAngle, blobWinding);

    return {
      srcRawPath,
      srcCutouts,
      tgtRawPath,
      tgtCutouts,
      srcSolid,
      blobA,
      blobB,
      tgtSolid,
      tgtFull,
      srcHasCutouts: srcCutouts.length > 0,
      tgtHasCutouts: tgtCutouts.length > 0,
    };
  });

  let morphed = false;
  let isAnimating = false;
  let tl: gsap.core.Timeline | null = null;

  const morph = () => {
    if (tl) tl.kill();
    isAnimating = true;
    const morphDur = getMotionMode() === 'gentle' ? 0.8 : 0.4;
    tl = gsap.timeline({
      onComplete: () => { isAnimating = false; },
      onInterrupt: () => { isAnimating = false; },
    });

    // Calculate stagger offsets (based on full paths array — extras stagger too)
    const pathCount = paths.length;
    const perPathStagger = pathCount > 1 && morphStagger ? morphStagger / (pathCount - 1) : 0;
    const indices = Array.from({ length: pathCount }, (_, i) => i);
    let ordered: number[];
    switch (morphStaggerFrom) {
      case 'center': { const mid = (pathCount - 1) / 2; ordered = [...indices].sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid)); break; }
      case 'end': ordered = [...indices].reverse(); break;
      case 'edges': { const mid = (pathCount - 1) / 2; ordered = [...indices].sort((a, b) => Math.abs(b - mid) - Math.abs(a - mid)); break; }
      case 'random': ordered = [...indices].sort(() => Math.random() - 0.5); break;
      default: ordered = indices;
    }
    const rank = new Array(pathCount);
    ordered.forEach((origIdx, staggerIdx) => { rank[origIdx] = staggerIdx; });

    // Timeline phases:
    //   BLUR IN → [cutout collapse] → morph to Blob A → morph Blob A→B → morph to target → [cutout expand] → BLUR OUT
    const BLUR_IN_DUR = 0.5;
    const BLUR_OUT_DUR = 0.5;
    const cutoutDur = morphDur * 0.6;
    const fadeDur = morphDur * 0.4;

    // ── Pre-filter: collapse cutouts via opacity fade before goo starts ──
    let preFilterDur = 0;
    const anySrcCutouts = keeperData.some(kd => kd.srcHasCutouts);
    if (!morphed && anySrcCutouts) {
      keepers.forEach((path, i) => {
        const kd = keeperData[i];
        if (kd.srcHasCutouts) {
          // Morph cutouts closed while still sharp (no filter)
          tl.to(path, {
            morphSVG: { shape: kd.srcSolid, type: 'linear' },
            duration: cutoutDur,
            ease: 'power1.inOut',
          }, 0);
        }
      });
      preFilterDur = cutoutDur;
    }

    // Apply filter AFTER cutouts are collapsed
    tl.set(svg, { filter: 'url(#shape-goo)' }, preFilterDur);
    if (gooBlurEl) tl.set(gooBlurEl, { attr: { stdDeviation: 0 } }, preFilterDur);

    // STAGE 1: blur eases 0 → full
    if (gooBlurEl) {
      tl.to(gooBlurEl, {
        attr: { stdDeviation: GOO_BLUR_FULL },
        duration: BLUR_IN_DUR,
        ease: 'sine.inOut',
      }, preFilterDur);
    }

    const morphStart = preFilterDur + BLUR_IN_DUR;

    if (!morphed) {
      // ═══════════════════════════════════════════════════════
      // FORWARD: Shape A → Blob A → Blob B → Shape B
      // ═══════════════════════════════════════════════════════

      let cursor = morphStart;
      // Cutouts already collapsed in pre-filter phase

      // ── Phase 1: Shape A → Blob A (rotational — handles concavities) ──
      keepers.forEach((path, i) => {
        const kd = keeperData[i];
        const keeperIdx = paths.indexOf(path);
        const offset = keeperIdx >= 0 ? rank[keeperIdx] * perPathStagger : 0;
        tl!.to(path, {
          morphSVG: { shape: kd.blobA, type: 'rotational', curveMode: true, smooth: 'auto' },
          duration: morphDur,
          ease: 'power2.in',
        }, cursor + offset);
      });

      // Extras also morph to a simple blob at center
      const simpleBlob = generateMatchedBlob(
        (keeperData[0]?.srcRawPath[0] || [cx, cy]) as RawSegment,
        cx, cy, blobRadius
      );
      extras.forEach((path) => {
        const pathIdx = paths.indexOf(path);
        const offset = pathIdx >= 0 ? rank[pathIdx] * perPathStagger : 0;
        tl!.to(path, {
          morphSVG: { shape: simpleBlob, type: 'rotational', curveMode: true, smooth: 'auto' },
          duration: morphDur,
          ease: 'power2.in',
        }, cursor + offset);
      });

      const phase1End = cursor + morphStagger + morphDur;

      // ── Phase 2: Fade out extras (stacked as blobs at center) ──
      extras.forEach(path => {
        tl!.to(path, {
          opacity: 0,
          duration: fadeDur,
          ease: 'power1.in',
        }, phase1End);
      });

      // ── Scale pulse: subtle inflate at blob phase masks transition points ──
      const pulseStart = phase1End;
      tl!.to(svg, { scale: 1.05, duration: morphDur * 0.4, ease: 'power2.out' }, pulseStart);
      tl!.to(svg, { scale: 1, duration: morphDur * 0.4, ease: 'power2.in' }, pulseStart + morphDur * 0.8);

      // ── Phase 3: Blob A → Blob B (keepers only) ──
      // Both blobs are amorphous — no structure to flip
      const blobMorphStart = phase1End + fadeDur;
      keepers.forEach((path, i) => {
        const kd = keeperData[i];
        tl!.to(path, {
          morphSVG: { shape: kd.blobB, type: 'linear' },
          duration: morphDur * 1.2,
          ease: 'power1.inOut',
        }, blobMorphStart);
      });

      const blobMorphEnd = blobMorphStart + morphDur * 1.2;

      // ── Phase 4: Blob B → Target solid (rotational — safe entry) ──
      keepers.forEach((path, i) => {
        const kd = keeperData[i];
        tl!.to(path, {
          morphSVG: { shape: kd.tgtSolid, type: 'rotational', curveMode: true, smooth: 'auto' },
          duration: morphDur,
          ease: 'power2.out',
        }, blobMorphEnd);
      });

      let phase4End = blobMorphEnd + morphDur;

      // STAGE 3: blur eases full → 0 (before cutout expand)
      if (gooBlurEl) {
        tl!.to(gooBlurEl, {
          attr: { stdDeviation: 0 },
          duration: BLUR_OUT_DUR,
          ease: 'sine.inOut',
        }, phase4End);
      }

      const fwdPostFilter = phase4End + BLUR_OUT_DUR;

      // ── Phase 5: Expand target cutouts AFTER filter removed ──
      const anyTgtCutouts = keeperData.some(kd => kd.tgtHasCutouts);
      if (anyTgtCutouts) {
        tl!.set(svg, { filter: '' }, fwdPostFilter);
        keepers.forEach((path, i) => {
          const kd = keeperData[i];
          if (kd.tgtHasCutouts) {
            tl!.to(path, {
              morphSVG: { shape: kd.tgtFull, type: 'linear' },
              duration: cutoutDur,
              ease: 'power1.inOut',
            }, fwdPostFilter);
          }
        });
      } else {
        // No cutouts — just clear filter
        tl!.set(svg, { filter: '' }, fwdPostFilter + 0.05);
      }

    } else {
      // ═══════════════════════════════════════════════════════
      // REVERSE: Shape B → Blob B → Blob A → Shape A
      // ═══════════════════════════════════════════════════════

      let cursor = morphStart;

      // ── Phase 0: Collapse target cutouts ──
      const anyTgtCutouts = keeperData.some(kd => kd.tgtHasCutouts);
      if (anyTgtCutouts) {
        keepers.forEach((path, i) => {
          const kd = keeperData[i];
          if (kd.tgtHasCutouts) {
            tl!.to(path, {
              morphSVG: { shape: kd.tgtSolid, type: 'linear' },
              duration: cutoutDur,
              ease: 'power2.in',
            }, cursor);
          }
        });
        cursor += cutoutDur;
      }

      // ── Phase 1: Target solid → Blob B (rotational — handles concavities) ──
      keepers.forEach((path, i) => {
        const kd = keeperData[i];
        tl!.to(path, {
          morphSVG: { shape: kd.blobB, type: 'rotational', curveMode: true, smooth: 'auto' },
          duration: morphDur,
          ease: 'power2.in',
        }, cursor);
      });

      const phase1End = cursor + morphDur;

      // ── Scale pulse (reverse) ──
      tl!.to(svg, { scale: 1.05, duration: morphDur * 0.4, ease: 'power2.out' }, phase1End);
      tl!.to(svg, { scale: 1, duration: morphDur * 0.4, ease: 'power2.in' }, phase1End + morphDur * 0.8);

      // ── Phase 2: Blob B → Blob A ──
      keepers.forEach((path, i) => {
        const kd = keeperData[i];
        tl!.to(path, {
          morphSVG: { shape: kd.blobA, type: 'linear' },
          duration: morphDur * 0.6,
          ease: 'sine.inOut',
        }, phase1End);
      });

      const blobMorphEnd = phase1End + morphDur * 0.6;

      // ── Phase 3: Fade extras back in (still as blobs at center) ──
      extras.forEach(path => {
        tl!.to(path, {
          opacity: 1,
          duration: fadeDur,
          ease: 'power1.out',
        }, blobMorphEnd);
      });

      // ── Phase 4: All paths morph from blob → source shapes (with stagger) ──
      const phase4Start = blobMorphEnd + fadeDur;

      // Keepers morph from Blob A → source solid (rotational — safe entry)
      keepers.forEach((path, i) => {
        const kd = keeperData[i];
        const keeperIdx = paths.indexOf(path);
        const offset = keeperIdx >= 0 ? rank[keeperIdx] * perPathStagger : 0;
        tl!.to(path, {
          morphSVG: { shape: kd.srcSolid, type: 'rotational', curveMode: true, smooth: 'auto' },
          duration: morphDur,
          ease: 'power2.out',
        }, phase4Start + offset);
      });

      // Extras morph back to their original path data (rotational)
      extras.forEach((path) => {
        const pathIdx = paths.indexOf(path);
        const offset = pathIdx >= 0 ? rank[pathIdx] * perPathStagger : 0;
        tl!.to(path, {
          morphSVG: { shape: (path as any)._originalD, type: 'rotational', curveMode: true, smooth: 'auto' },
          duration: morphDur,
          ease: 'power2.out',
        }, phase4Start + offset);
      });

      let phase4End = phase4Start + morphStagger + morphDur;

      // STAGE 3: blur eases full → 0 (before cutout expand)
      if (gooBlurEl) {
        tl!.to(gooBlurEl, {
          attr: { stdDeviation: 0 },
          duration: BLUR_OUT_DUR,
          ease: 'sine.inOut',
        }, phase4End);
      }

      const postFilterStart = phase4End + BLUR_OUT_DUR;

      // ── Phase 5: Expand source cutouts AFTER filter removed ──
      if (anySrcCutouts) {
        // Clear filter first so cutout expand is sharp
        tl!.set(svg, { filter: '' }, postFilterStart);
        keepers.forEach((path, i) => {
          const kd = keeperData[i];
          if (kd.srcHasCutouts) {
            tl!.to(path, {
              morphSVG: { shape: (path as any)._originalD, type: 'linear' },
              duration: cutoutDur,
              ease: 'power1.inOut',
            }, postFilterStart);
          }
        });
        phase4End = postFilterStart + cutoutDur;
      }

      // Clear filter at the end
      tl!.set(svg, { filter: '' }, '+=0.05');
    }

    morphed = !morphed;
  };

  // Detect scroll container
  const osViewport = getScrollContainer();
  const morphTrigger = el.dataset.iconMorphTrigger || 'hover';

  // Trigger guards: ignore re-triggers while a morph is in flight, and only
  // ──────────────────────────────────────────────────────
  // Trigger truth table (per-event, at TRIGGER time):
  //
  //                       mouseenter  focus    click   Enter/Space*
  //   hover="full"        fire        fire     fire    fire
  //   hover="gentle"      fire        fire     fire    fire
  //   hover="instant"     jump-end    jump-end fire    fire
  //   hover="none"        BLOCK       BLOCK    fire    fire
  //   motion="none"       BLOCK       BLOCK    BLOCK   BLOCK
  //
  //   * Enter/Space is delivered as a click event by focus-system.ts's
  //     role="button" keyboard activator, so it's covered by the click row.
  //
  // Focus is treated as "keyboard hover" — when the user has disabled
  // hover-triggered motion, focus alone shouldn't auto-fire the animation
  // either. They must click or press Enter/Space for an explicit intent.
  // ──────────────────────────────────────────────────────
  const canPlay = () => getMotionMode() !== 'none';
  const hoverAllowed = () => {
    const h = getHoverMode();
    return h !== 'none';
  };
  const isInstant = () => getHoverMode() === 'instant';

  // Raw actions — build the timeline or toggle direction, no gating
  const doForward = () => { if (!isAnimating && !morphed) morph(); };
  const doReverse = () => { if (!isAnimating && morphed) morph(); };
  const doToggle  = () => { if (!isAnimating) morph(); };

  // Gated: for hover/focus events (blocked when hover=none, jumps when instant)
  const gatedForward = () => {
    if (!canPlay() || !hoverAllowed()) return;
    if (isInstant()) { if (!morphed) { morph(); if (tl) tl.progress(1); } return; }
    doForward();
  };
  const gatedReverse = () => {
    if (!canPlay() || !hoverAllowed()) return;
    if (isInstant()) { if (morphed) { morph(); if (tl) tl.progress(1); } return; }
    doReverse();
  };

  // Click: always fires (unless motion=none) — this is explicit user intent
  const clickToggle = () => {
    if (!canPlay()) return;
    doToggle();
  };

  registerTrigger({
    el,
    trigger: morphTrigger,
    onEnter: () => { doForward(); return tl; },
    onLeave: () => { doReverse(); return tl; },
    onInstant: () => { if (!morphed) { morph(); if (tl) tl.progress(1); } },
    onStatic: () => {}, // morph at rest is already visible
  });
}
