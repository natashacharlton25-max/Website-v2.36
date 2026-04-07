/**
 * Fill animation for Icon and Shape atoms
 *
 * Reads `data-icon-fill` + related data attributes and wires up a "bloom"
 * fill effect — clones each path, starts as a tiny dot at its centre, and
 * morphs/scales out into the full shape.
 *
 * Modes:
 *   once    — bloom and stay
 *   yoyo    — bloom on hover, shrink on leave
 *   static  — starts filled, re-blooms on hover
 *   fade    — opacity only, no scale
 *   ghost   — starts at --svg-ghost-color, fills to vibrant on hover
 *   twinkle — starts filled, each hover randomly dims/pops each piece
 *
 * Triggers: hover (default), viewport, scrub, rainbow (rainbow scrub).
 *
 * Outline option (showOutline): also draws stroke around each path using
 * the addVariant helper from draw-shared.
 *
 * Rainbow trigger registers the element in `rainbowScrollElements` so the
 * onThemeChange handler in index.ts can rebuild colours when themes flip.
 */

import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionMode, getHoverMode, getElementColor, getGhostColor, toHex, getScrollContainer } from '../animation-config';
import { addVariant, type DrawVariant } from './draw-shared';

gsap.registerPlugin(MorphSVGPlugin, MotionPathPlugin, ScrollTrigger);

// Registry for elements that need re-init on theme change
// Exported so index.ts onThemeChange can rebuild rainbow timelines after a theme flip
export const rainbowScrollElements: { el: HTMLElement, tl: gsap.core.Timeline, rebuild: () => void }[] = [];

export function initFillIcon(el: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;
  // Allow overshoot from bounce/back easing
  svg.setAttribute('overflow', 'visible');
  svg.style.overflow = 'visible';
  // Remove root fill so origPaths can be hidden (API SVGs have fill="currentColor" on <svg>)
  if (el.classList.contains('icon')) {
    svg.removeAttribute('fill');
    svg.style.fill = 'none';
  }

  const trigger = el.dataset.iconFillTrigger || 'hover';
  const hasDraw = !!el.dataset.iconDraw;
  const mode = el.dataset.iconFillMode || (hasDraw ? 'fade' : 'once');
  const fillDuration = parseFloat(el.dataset.iconFillDuration || '') || 1;
  const fillColor = el.dataset.iconFillColor || '';
  const showOutline = el.dataset.iconFillOutline === 'true';
  // Fill timing relative to draw: 'after' waits for draw to finish, 'overlap' starts at ~50%
  const fillTiming = el.dataset.iconFillTiming || (hasDraw ? 'overlap' : '');
  const drawDuration = getMotionMode() === 'gentle' ? 4 : 2;
  const fillDelay = fillTiming === 'after' ? drawDuration + 0.3
    : hasDraw ? drawDuration * 0.5
    : 0;
  // Named fill eases
  const FILL_EASES: Record<string, string> = {
    jelly: 'back.out(2.5)',
    wobble: 'elastic.out(1, 0.3)',
    bounce: 'bounce.out',
    snap: 'back.out(4)',
  };
  const rawEase = el.dataset.iconFillEase || (hasDraw ? 'expoScale(0.5,7,power3.out)' : 'back.out(1.7)');
  const easeType = FILL_EASES[rawEase] || rawEase;
  const combinedDuration = hasDraw ? fillDuration * 1.5 : fillDuration;
  // Stagger: total time divided by path count — icons always bloom as one (no stagger)
  const isIcon = el.classList.contains('icon');
  const staggerTotalMap: Record<string, number> = { none: 0, tight: 0.5, normal: 1, loose: 2 };
  const staggerTotal = isIcon ? 0 : (staggerTotalMap[el.dataset.iconFillStagger || 'normal'] ?? 1);
  const staggerFrom = (el.dataset.iconFillStaggerFrom || 'start') as 'start' | 'center' | 'end' | 'edges' | 'random';

  const osViewport = getScrollContainer();
  const ns = 'http://www.w3.org/2000/svg';

  // Get viewBox center for the starting dot
  const vb = svg.viewBox.baseVal;
  const cx = (vb.x || 0) + (vb.width || 100) / 2;
  const cy = (vb.y || 0) + (vb.height || 100) / 2;

  // Find or create <g>
  let g = svg.querySelector('g');
  if (!g) {
    g = document.createElementNS(ns, 'g');
    const children = Array.from(svg.childNodes);
    children.forEach(child => {
      if ((child as Element).tagName !== 'defs') g!.appendChild(child);
    });
    svg.appendChild(g);
  }

  // Convert non-path elements to path — skip Phosphor background rects
  g.querySelectorAll('circle, polygon, polyline, ellipse, line').forEach(e => {
    MorphSVGPlugin.convertToPath(e as any);
  });
  g.querySelectorAll('rect').forEach(e => {
    const w = e.getAttribute('width');
    const fill = e.getAttribute('fill');
    if (fill === 'none' && (w === '256' || w === '100%')) {
      e.remove(); // remove background rect entirely
      return;
    }
    MorphSVGPlugin.convertToPath(e as any);
  });

  // Split compound paths for shapes (each piece animates independently)
  // Skip for icons — compound paths define cutouts/holes that must stay together
  if (el.classList.contains('shape')) g.querySelectorAll('path:not(.icon-fill-morph)').forEach(p => {
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

  // Use imported toHex + getElementColor from animation-config
  const getColor = () => {
    return getElementColor(el);
  };
  const getTargetColor = () => {
    if (!fillColor) return getColor();
    // fillColor can be a CSS variable name or a color value
    if (fillColor.startsWith('--')) {
      return toHex(getComputedStyle(document.documentElement).getPropertyValue(fillColor).trim());
    }
    return toHex(fillColor);
  };

  // Get original shape paths
  const origPaths = Array.from(g.querySelectorAll('path:not(.icon-fill-morph):not(.icon-draw-overlay)')) as SVGPathElement[];
  if (!origPaths.length) return;

  // Clone each path — same shape, scales from center
  const fillClones: SVGPathElement[] = [];
  origPaths.forEach(p => {
    // Find this path's center via bounding box
    const bbox = p.getBBox();
    const pcx = bbox.x + bbox.width / 2;
    const pcy = bbox.y + bbox.height / 2;

    const clone = p.cloneNode(true) as SVGPathElement;
    clone.classList.add('icon-fill-morph');
    clone.removeAttribute('style');
    clone.setAttribute('fill', getColor());
    clone.setAttribute('stroke', 'none');
    // Preserve fill-rule for cutouts (cog center, shield tick, etc.)
    if (!clone.getAttribute('fill-rule')) {
      clone.setAttribute('fill-rule', 'evenodd');
    }
    // Set transform origin to this path's center + start hidden
    if (mode === 'fade') {
      gsap.set(clone, { opacity: 0, svgOrigin: `${pcx} ${pcy}` });
    } else {
      gsap.set(clone, { scale: 0.01, opacity: 0, svgOrigin: `${pcx} ${pcy}` });
    }
    // Insert behind original path so fill renders under stroke
    p.parentNode!.insertBefore(clone, p);
    fillClones.push(clone);
  });

  // Original paths: hide fill, optionally animate stroke outline
  const isIconEl = el.classList.contains('icon');
  const outlineSw = isIconEl ? '10' : (g.getAttribute('stroke-width') || '2');
  origPaths.forEach(p => {
    p.removeAttribute('fill');
    (p as HTMLElement).style.fill = 'none';
    if (showOutline) {
      (p as HTMLElement).style.stroke = 'currentColor';
      (p as HTMLElement).style.strokeWidth = outlineSw;
      (p as HTMLElement).style.strokeLinejoin = 'round';
      (p as HTMLElement).style.strokeLinecap = 'round';
      // Start with stroke hidden — will draw in on trigger
      gsap.set(p, { drawSVG: '0%' });
    }
  });

  // Start filled: static mode, or icons (should be visible on load, retrigger on hover)
  if (mode === 'static' || isIconEl) {
    fillClones.forEach(clone => {
      gsap.set(clone, { scale: 1, opacity: 1 });
    });
    if (showOutline) {
      origPaths.forEach(p => gsap.set(p, { drawSVG: '100%' }));
    }
  }

  const isFade = mode === 'fade' || (hasDraw && !el.dataset.iconFillMode);

  let isFilled = mode === 'static';

  const playFill = (reverse = false) => {
    const motion = getMotionMode();
    if (motion === 'none') return gsap.timeline();
    const d = motion === 'gentle' ? combinedDuration * 2 : combinedDuration;
    const tl = gsap.timeline({ delay: reverse ? 0 : fillDelay });

    // Fresh color for theme responsiveness
    const targetColor = reverse ? getColor() : getTargetColor();

    // Animate outline draw-in using addVariant (supports all draw variants + laser)
    // Scale duration by element size
    const outlineElSize = Math.max(el.offsetWidth, el.offsetHeight) || 64;
    const outlineScale = outlineElSize < 50 ? 2.5 : outlineElSize < 100 ? 2 : outlineElSize < 200 ? 1.5 : 1;
    const outlineDur = d * outlineScale;
    if (showOutline && !reverse) {
      const outlineColor = getColor();
      origPaths.forEach(p => gsap.set(p, { stroke: outlineColor, strokeWidth: outlineSw }));
      const drawVariant = (el.dataset.iconFillDrawVariant || 'draw') as DrawVariant;
      const drawLaser = el.dataset.iconFillDrawLaser === 'true';
      addVariant(tl, origPaths as SVGPathElement[], drawVariant, outlineColor, outlineColor, outlineDur, parseFloat(outlineSw), drawLaser, 0, 'start');
    } else if (showOutline && reverse) {
      const eraseTl = gsap.timeline({ paused: true });
      addVariant(eraseTl, origPaths as SVGPathElement[], 'draw', getColor(), getColor(), d * 0.5, parseFloat(outlineSw), false, 0, 'start');
      tl.add(eraseTl.tweenFromTo(eraseTl.duration(), 0, { duration: d * 0.5, ease: 'power2.in' }), 0);
    }

    const pathCount = fillClones.length;
    const perPathStagger = pathCount > 1 ? staggerTotal / (pathCount - 1) : 0;

    // Calculate stagger order indices based on direction
    const indices = Array.from({ length: pathCount }, (_, i) => i);
    let ordered: number[];
    switch (staggerFrom) {
      case 'center': {
        const mid = (pathCount - 1) / 2;
        ordered = indices.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));
        break;
      }
      case 'end':
        ordered = indices.reverse();
        break;
      case 'edges': {
        const mid = (pathCount - 1) / 2;
        ordered = indices.sort((a, b) => Math.abs(b - mid) - Math.abs(a - mid));
        break;
      }
      case 'random':
        ordered = indices.sort(() => Math.random() - 0.5);
        break;
      default:
        ordered = indices;
    }
    // Map: original index → stagger rank
    const rank = new Array(pathCount);
    ordered.forEach((origIdx, staggerIdx) => { rank[origIdx] = staggerIdx; });

    // Offset fill bloom after outline draw starts
    // Small elements: fill starts AFTER outline finishes. Large: overlap at 50%
    const fillOffset = showOutline
      ? (outlineElSize < 300 ? outlineDur + 0.3 : outlineDur * 0.5)
      : 0;
    // Scale bloom duration by element size — smaller = slower for better visibility
    const elSize = Math.max(el.offsetWidth, el.offsetHeight) || 64;
    const sizeScale = elSize < 50 ? 3 : elSize < 100 ? 2.5 : elSize < 200 ? 1.8 : elSize < 400 ? 1.2 : 1;
    const bloomDur = d * sizeScale;

    fillClones.forEach((clone, i) => {
      const offset = fillOffset + rank[i] * perPathStagger;

      const hasColorMorph = targetColor !== getColor();

      if (!reverse) {
        // Set fresh color before animating
        clone.setAttribute('fill', targetColor);

        if (isFade) {
          // Fade only — just opacity, no scale
          tl.fromTo(clone,
            { opacity: 0 },
            { opacity: 1, duration: bloomDur, ease: 'power2.out' },
            offset);
        } else {
          // Scale bloom + fade — opacity leads, scale follows with bounce
          tl.fromTo(clone,
            { opacity: 0 },
            { opacity: 1, duration: bloomDur * 0.4, ease: 'power2.out' },
            offset);
          tl.fromTo(clone,
            { scale: 0.01 },
            { scale: 1, duration: bloomDur, ease: easeType },
            offset);
        }
        // Color morph: separate slower tween so it doesn't rush
        if (hasColorMorph) {
          tl.to(clone, { fill: targetColor, duration: d * 1.5, ease: 'power2.inOut' }, offset);
        }
      } else {
        if (isFade) {
          tl.to(clone, { opacity: 0, duration: d * 0.6, ease: 'power2.in' }, offset);
        } else {
          // Scale shrinks, opacity fades out at the end
          tl.to(clone, { scale: 0.01, duration: d * 0.6, ease: 'power2.in' }, offset);
          tl.to(clone, { opacity: 0, duration: d * 0.2, ease: 'power2.in' }, offset + d * 0.4);
        }
      }
    });

    return tl;
  };

  switch (trigger) {
    case 'viewport': {
      ScrollTrigger.create({
        trigger: el,
        scroller: osViewport || undefined,
        start: 'top 60%',
        once: mode === 'once',
        onEnter: () => { if (!isFilled) { playFill(false); isFilled = true; } },
        onLeaveBack: mode !== 'once' ? () => { playFill(true); isFilled = false; } : undefined,
      });
      break;
    }
    case 'rainbow': {
      // Rainbow scrub: cycles fill through all 7 rainbow tokens on scroll
      // Remove clones (not needed)
      fillClones.forEach(c => c.remove());
      fillClones.length = 0;

      let rainbowTl: gsap.core.Timeline | null = null;

      const buildRainbow = () => {
        if (rainbowTl) { rainbowTl.scrollTrigger?.kill(); rainbowTl.kill(); }

        const cs = getComputedStyle(document.documentElement);
        const colors = [1, 2, 3, 4, 5, 6, 7].map(n =>
          toHex(cs.getPropertyValue(`--rainbow-${n}`).trim() || '#888')
        );

        origPaths.forEach(p => {
          (p as HTMLElement).style.fill = colors[0];
          if (showOutline) {
            const sw = g!.getAttribute('stroke-width') || '2';
            (p as HTMLElement).style.stroke = 'currentColor';
            (p as HTMLElement).style.strokeWidth = sw;
          }
        });

        rainbowTl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            scroller: osViewport || undefined,
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: true,
          },
        });

        const segDur = 1 / (colors.length - 1);
        origPaths.forEach(path => {
          colors.forEach((color, ci) => {
            if (ci === 0) return;
            const props: Record<string, any> = { fill: color, duration: segDur, ease: 'none' };
            if (showOutline) props.stroke = color;
            rainbowTl!.to(path, props, segDur * (ci - 1));
          });
        });
      };

      buildRainbow();
      rainbowScrollElements.push({ el, tl: rainbowTl!, rebuild: buildRainbow });
      break;
    }
    case 'scrub': {
      // Scrub: fill progress tied to scroll
      fillClones.forEach(c => { c.setAttribute('fill', getColor()); });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller: osViewport || undefined,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      });
      const scrubPerPath = fillClones.length > 1 ? staggerTotal / (fillClones.length - 1) : 0;
      const scrubFade = mode === 'fade';
      fillClones.forEach((clone, i) => {
        tl.fromTo(clone,
          scrubFade ? { opacity: 0 } : { scale: 0.01, opacity: 0 },
          scrubFade ? { opacity: 1, duration: 1, ease: 'none' } : { scale: 1, opacity: 1, duration: 1, ease: 'none' },
          i * scrubPerPath);
      });
      break;
    }
    case 'hover':
    default: {
      // Icons with draw: initDrawIcon owns hover — skip fill hover handlers
      if (el.classList.contains('icon') && hasDraw) break;

      const hoverTarget = el.closest('button, a') || el;
      let activeTl: gsap.core.Timeline | null = null;

      // Trigger-time gating helper — wraps a handler so it runs only when
      // motion is on AND hover is allowed. Focus is treated as "keyboard
      // hover" — blocked by hover=none, same as mouse hover.
      //
      // Read at event time (not init time) so Your View Panel changes
      // apply live without page reload.
      //
      // Click events bypass this gate entirely (explicit user intent,
      // only blocked by motion=none).
      const gate = (handler: (e: Event) => void) => (e: Event) => {
        if (getMotionMode() === 'none') return;
        const isHoverLikeEvent = e.type === 'mouseenter' || e.type === 'mouseleave'
          || e.type === 'focusin' || e.type === 'focusout';
        if (isHoverLikeEvent && getHoverMode() === 'none') return;
        handler(e);
      };

      // Helper: fade clones out smoothly, then run callback
      const fadeOutThenPlay = (cb: () => void) => {
        if (activeTl) activeTl.kill();
        const fadeOut = gsap.timeline();
        // Border disappears instantly
        if (showOutline) {
          origPaths.forEach(p => gsap.set(p, { drawSVG: '0%' }));
        }
        // Then fill fades + shrinks out
        fillClones.forEach(c => {
          if (isFade) {
            fadeOut.to(c, { opacity: 0, duration: 0.5, ease: 'power3.in' }, 0);
          } else {
            fadeOut.to(c, { opacity: 0, scale: 0.3, duration: 0.5, ease: 'power3.in' }, 0);
          }
        });
        fadeOut.call(() => {
          fillClones.forEach(c => gsap.set(c, isFade ? { opacity: 0 } : { scale: 0.01, opacity: 0 }));
          if (showOutline) origPaths.forEach(p => gsap.set(p, { drawSVG: '0%', opacity: 1 }));
          cb();
        });
        activeTl = fadeOut;
      };

      // Instant reset (for first trigger or when not visible)
      const resetClones = () => {
        if (activeTl) { activeTl.kill(); activeTl = null; }
        fillClones.forEach(c => gsap.set(c, isFade ? { opacity: 0 } : { scale: 0.01, opacity: 0 }));
      };

      switch (mode) {
        case 'yoyo': {
          const enter = () => {
            if (isFilled) { fadeOutThenPlay(() => { activeTl = playFill(false); }); }
            else { resetClones(); activeTl = playFill(false); }
            isFilled = true;
          };
          const leave = () => { if (activeTl) activeTl.kill(); activeTl = playFill(true); isFilled = false; };
          hoverTarget.addEventListener('mouseenter', gate(enter));
          hoverTarget.addEventListener('mouseleave', gate(leave));
          hoverTarget.addEventListener('focusin', gate(enter));
          hoverTarget.addEventListener('focusout', gate(leave));
          break;
        }
        case 'static': {
          hoverTarget.addEventListener('mouseenter', gate(() => {
            fadeOutThenPlay(() => { activeTl = playFill(false); });
          }));
          break;
        }
        case 'twinkle': {
          // Starts filled. Each hover: pieces randomly dim to ~10% then pop back to full
          fillClones.forEach(c => gsap.set(c, { scale: 1, opacity: 1 }));
          isFilled = true;

          hoverTarget.addEventListener('mouseenter', gate(() => {
            if (activeTl) activeTl.kill();
            const tl = gsap.timeline();
            const pathCount = fillClones.length;
            const spread = pathCount > 1 ? 1.2 / (pathCount - 1) : 0;
            // Random order each time
            const order = Array.from({ length: pathCount }, (_, i) => i).sort(() => Math.random() - 0.5);

            fillClones.forEach((clone, i) => {
              const delay = order.indexOf(i) * spread;
              // Dim + slight shrink
              tl.to(clone, { opacity: 0.1, scale: 0.85, duration: 0.4, ease: 'power3.in' }, delay);
              // Pop back with chosen ease
              tl.to(clone, { opacity: 1, scale: 1, duration: 0.6, ease: easeType }, delay + 0.4);
            });

            activeTl = tl;
          }));
          break;
        }
        case 'ghost': {
          // Start at ghost color, animate to full on hover, return to ghost on leave
          const getGhostFill = () => getGhostColor(el);
          fillClones.forEach(c => gsap.set(c, { opacity: 1, scale: 1, fill: getGhostFill() }));
          if (showOutline) {
            origPaths.forEach(p => { (p as HTMLElement).style.stroke = getGhostFill(); });
          }
          const ghostEnter = () => {
            if (activeTl) activeTl.kill();
            activeTl = gsap.timeline();
            const target = getTargetColor();
            fillClones.forEach(c => {
              gsap.set(c, { scale: 1, opacity: 1 });
              activeTl!.to(c, { fill: target, duration: combinedDuration, ease: easeType }, 0);
            });
            if (showOutline) {
              origPaths.forEach(p => {
                activeTl!.to(p, { stroke: target, duration: combinedDuration, ease: easeType }, 0);
              });
            }
          };
          const ghostLeave = () => {
            if (activeTl) activeTl.kill();
            activeTl = gsap.timeline();
            const ghostC = getGhostFill();
            fillClones.forEach(c => {
              activeTl!.to(c, { fill: ghostC, duration: combinedDuration * 0.6, ease: 'power2.in' }, 0);
            });
            if (showOutline) {
              origPaths.forEach(p => {
                activeTl!.to(p, { stroke: ghostC, duration: combinedDuration * 0.6, ease: 'power2.in' }, 0);
              });
            }
          };
          hoverTarget.addEventListener('mouseenter', gate(ghostEnter));
          hoverTarget.addEventListener('mouseleave', gate(ghostLeave));
          hoverTarget.addEventListener('focusin', gate(ghostEnter));
          hoverTarget.addEventListener('focusout', gate(ghostLeave));
          break;
        }
        case 'fade':
        default: {
          // once/fade — fill on hover. Smooth fade out before replay on retrigger.
          const doFill = () => {
            if (isFilled) {
              fadeOutThenPlay(() => { activeTl = playFill(false); });
            } else {
              resetClones();
              activeTl = playFill(false);
            }
            isFilled = true;
          };
          hoverTarget.addEventListener('mouseenter', gate(doFill));
          hoverTarget.addEventListener('focusin', gate(doFill));
          break;
        }
      }
      break;
    }
  }
}
