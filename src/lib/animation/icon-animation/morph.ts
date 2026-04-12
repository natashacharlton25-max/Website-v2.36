/**
 * Goo morph for Icon and Shape atoms
 *
 * Reads `data-icon-morph` + `data-icon-morph-target` (and related morphStagger
 * attributes) and animates a "convergence morph": every source path morphs to
 * a centred blob, extras fade out, keepers fan out to their target paths. The
 * whole thing runs through an SVG gooey filter (blur + threshold matrix) so
 * the merge looks like raindrops joining and separating.
 *
 * Three-stage timeline (each direction):
 *   Stage 1: blur eases 0 → 8     (solid shapes → blob)
 *   Stage 2: convergence morph    (paths converge, extras fade, keepers fan out)
 *   Stage 3: blur eases 8 → 0     (blob shapes → solid targets)
 *
 * Goo filter is a single shared <filter id="shape-goo"> injected once into
 * the document body. Its stdDeviation is animated per-morph via GSAP AttrPlugin.
 *
 * Compound path splitting is gated to shapes only — icons keep their compound
 * paths so cutouts (donut hole, gear centre, gift bow loops) are preserved.
 * The goo filter softens cutout edges through the blob phase, so even icons
 * with complex hole topology morph cleanly.
 *
 * The legacy iconMorphCircle (`viaCircle`) prop is still supported for
 * equal-path-count edge cases but rarely needed — convergence handles
 * everything by default.
 */

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionMode, getHoverMode, getScrollContainer, registerTrigger } from '../animation-config';

gsap.registerPlugin(MorphSVGPlugin, MotionPathPlugin, ScrollTrigger);

// Goo filter strength — animated by morph timelines via AttrPlugin
const GOO_BLUR_FULL = 8;
let gooeyFilterInjected = false;
let gooBlurEl: Element | null = null;

/**
 * Inject the gooey filter once into the document — referenced by all
 * shape morphs via filter: url(#shape-goo). The filter blurs then thresholds
 * alpha, making overlapping shapes merge like raindrops.
 *
 * gooBlurEl is the captured feGaussianBlur element. GSAP's AttrPlugin animates
 * its stdDeviation attribute during phase 3 of the morph so the gooey silhouette
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
  matrix.setAttribute('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7');
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

  // Goo filter setup — applies to ALL morphs (icons + shapes) now
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
  const viaCircle = el.dataset.iconMorphCircle === 'true';

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
  document.body.removeChild(tempDiv);
  if (!targetPaths.length) return;

  // Get colours
  const computedStyle = getComputedStyle(el);
  const originalFill = computedStyle.color || '#fff';
  const targetFill = morphColor || originalFill;

  // Intermediate "blob" path used as the convergence target — hand-crafted
  // cubic bezier blob with asymmetric control points. Defined in normalized
  // coords (-1 to 1) then scaled to fit any shape's viewBox.
  const vb = svg.viewBox.baseVal;
  const vbW = vb.width || 256;
  const vbH = vb.height || 256;
  const cx = (vb.x || 0) + vbW / 2;
  const cy = (vb.y || 0) + vbH / 2;
  const cr = Math.min(vbW, vbH) * 0.25;
  // Helper: convert normalized (-1..1) blob coord to absolute viewBox coord
  const p = (x: number, y: number) => `${cx + x * cr},${cy + y * cr}`;
  // 4-segment cubic blob — top-right bulge, bottom drop, slight left indent
  const circlePath =
    `M${p(0, -1.05)}` +
    ` C${p(0.75, -1.25)} ${p(1.30, -0.55)} ${p(1.10, 0.10)}` +
    ` C${p(1.25, 0.80)} ${p(0.50, 1.30)} ${p(-0.10, 1.10)}` +
    ` C${p(-0.80, 1.25)} ${p(-1.25, 0.45)} ${p(-1.00, -0.20)}` +
    ` C${p(-1.15, -0.75)} ${p(-0.45, -1.15)} ${p(0, -1.05)}` +
    ' Z';

  // Store original path data
  paths.forEach(p => {
    (p as any)._originalD = p.getAttribute('d');
  });

  // Compute keeper/extra mapping — every morph (shapes AND icons) uses the
  // goo convergence technique. Each source path is assigned to a target via
  // floor(i * N / M); the FIRST source per target group is the "keeper", the
  // rest are "extras" that fade out. When M === N, every path is a keeper and
  // extras is empty (clean 1:1 via-blob morph).
  // The legacy iconMorphCircle prop is now redundant — goo morph is default.
  const M = paths.length;
  const N = targetPaths.length;
  const useConvergence = true;
  const keepers: SVGPathElement[] = [];
  const keeperTargetIdx: number[] = [];
  const extras: SVGPathElement[] = [];
  if (useConvergence) {
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
  }

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

    // ============================================================
    // SHAPES — convergence technique (from hero-morph)
    // Forward: all source segments morph to circles at centre →
    //          extras fade out → keepers fan out to targets
    // Reverse: keepers morph back to centre circle → extras fade
    //          back in → all morph back to original positions
    // When M === N: extras is empty, runs as a clean via-circle morph
    // ============================================================
    if (useConvergence) {
      // Three-stage timeline:
      //   1. Solid → blob: blur eases 0 → full over BLUR_IN_DUR (shapes still
      //      at original positions, just gradually goo-ing up)
      //   2. Morph: convergence runs with FULL blur the entire time
      //   3. Blob → solid: blur eases full → 0 over BLUR_OUT_DUR (shapes at
      //      target positions, gradually de-goo-ing back to sharp)
      const BLUR_IN_DUR = 0.5;
      const BLUR_OUT_DUR = 0.5;

      const fadeDur = morphDur * 0.4;
      // Morph phases all start AFTER the blur-in window
      const morphStart = BLUR_IN_DUR;
      const phase1End = morphStart + morphStagger + morphDur;

      // Apply filter at offset 0 and immediately set blur to 0 (start solid)
      tl.set(svg, { filter: 'url(#shape-goo)' }, 0);
      if (gooBlurEl) tl.set(gooBlurEl, { attr: { stdDeviation: 0 } }, 0);

      // STAGE 1: blur eases 0 → full while shapes are still solid at original
      if (gooBlurEl) {
        tl.to(gooBlurEl, {
          attr: { stdDeviation: GOO_BLUR_FULL },
          duration: BLUR_IN_DUR,
          ease: 'sine.inOut',
        }, 0);
      }

      if (!morphed) {
        // FORWARD ─────────────────────────────────────────────
        // Phase 1: every source path morphs to the centre circle (with stagger)
        // Using type: 'linear' (not rotational) — linear interpolation can't
        // produce flips for asymmetric shapes (tree, house). The mid-tween
        // kinks linear is prone to are fully masked by the goo blur.
        paths.forEach((path, i) => {
          const offset = rank[i] * perPathStagger;
          tl!.to(path, {
            morphSVG: { shape: circlePath, type: 'linear', smooth: 'auto' },
            duration: morphDur,
            ease: 'power2.in',
          }, morphStart + offset);
        });

        // Phase 2: fade out extras (now stacked at centre as circles)
        extras.forEach(path => {
          tl!.to(path, {
            opacity: 0,
            duration: fadeDur,
            ease: 'power1.in',
          }, phase1End);
        });

        // Phase 3: keepers morph from circle to their assigned target paths
        keepers.forEach((path, i) => {
          const target = targetPaths[keeperTargetIdx[i]];
          if (!target) return;
          tl!.to(path, {
            morphSVG: { shape: target, type: 'linear', smooth: 'auto' },
            duration: morphDur,
            ease: 'power2.out',
          }, phase1End + fadeDur);
        });

        // STAGE 3: blur eases full → 0 starting AFTER phase 3 ends
        const phase3End = phase1End + fadeDur + morphDur;
        if (gooBlurEl) {
          tl!.to(gooBlurEl, {
            attr: { stdDeviation: 0 },
            duration: BLUR_OUT_DUR,
            ease: 'sine.inOut',
          }, phase3End);
        }

        // Clear filter at the end of the timeline (blur is already 0, invisible)
        tl!.set(svg, { filter: '' }, '+=0.05');
      } else {
        // REVERSE ─────────────────────────────────────────────
        // Phase 1: keepers morph back from target → centre circle
        const phase1RevDur = morphDur * 0.8;
        keepers.forEach(path => {
          tl!.to(path, {
            morphSVG: { shape: circlePath, type: 'rotational', smooth: 'auto' },
            duration: phase1RevDur,
            ease: 'power2.in',
          }, morphStart);
        });

        // Phase 2: fade extras back in (still positioned as circles at centre)
        extras.forEach(path => {
          tl!.to(path, {
            opacity: 1,
            duration: fadeDur,
            ease: 'power1.out',
          }, morphStart + phase1RevDur);
        });

        // Phase 3: all M paths morph from circle back to their original shapes (with stagger)
        const phase3Start = morphStart + phase1RevDur + fadeDur;
        paths.forEach((path, i) => {
          const offset = rank[i] * perPathStagger;
          tl!.to(path, {
            morphSVG: { shape: (path as any)._originalD, type: 'linear', smooth: 'auto' },
            duration: morphDur,
            ease: 'power2.out',
          }, phase3Start + offset);
        });

        // STAGE 3: blur eases full → 0 starting AFTER the last staggered path
        // in phase 3 finishes (covers the full stagger tail)
        const phase3End = phase3Start + morphStagger + morphDur;
        if (gooBlurEl) {
          tl!.to(gooBlurEl, {
            attr: { stdDeviation: 0 },
            duration: BLUR_OUT_DUR,
            ease: 'sine.inOut',
          }, phase3End);
        }

        // Clear filter at the end of the timeline (blur is already 0, invisible)
        tl!.set(svg, { filter: '' }, '+=0.05');
      }

      morphed = !morphed;
      return;
    }

    // ============================================================
    // EQUAL PATH COUNTS — direct 1:1 morph (existing behaviour)
    // ============================================================
    paths.forEach((path, i) => {
      const target = targetPaths[i];
      if (!target) return;
      const offset = rank[i] * perPathStagger;

      if (viaCircle) {
        const halfDur = morphDur * 0.6;
        const targetShape = !morphed ? target : (path as any)._originalD;
        tl!.to(path, {
          morphSVG: { shape: circlePath, type: 'rotational', smooth: 'auto' },
          duration: halfDur,
          ease: 'power2.in',
        }, offset);
        tl!.to(path, {
          morphSVG: { shape: targetShape, type: 'rotational', smooth: 'auto' },
          duration: halfDur,
          ease: 'power2.out',
        }, offset + halfDur);
      } else {
        const targetShape = !morphed ? target : (path as any)._originalD;
        tl!.to(path, {
          morphSVG: { shape: targetShape, type: 'rotational', smooth: 'auto' },
          duration: morphDur,
          ease: 'power2.inOut',
        }, offset);
      }
    });

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
