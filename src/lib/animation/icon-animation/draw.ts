/**
 * Draw animation for Icon and Shape atoms
 *
 * Reads `data-icon-draw` + related data attributes and wires up GSAP
 * DrawSVG animations. Supports 3 variants (draw, drawcenter, pulse) × 5
 * modes (once, static, yoyo, reverse-yoyo, reveal), plus laser, ghost,
 * fill, gradient colour and stroke-width control.
 *
 * The actual stroke-drawing primitives live in draw-shared.ts as `addVariant`.
 * This file is the orchestrator: parses data-attrs, builds overlay clones,
 * routes through the right trigger, and composes the final timeline.
 *
 * If the element ALSO has `data-icon-morph-target`, the play function is
 * swapped for `playDrawMorph` (erase A → swap → draw B).
 */

import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getMotionMode, getHoverMode, getScrollContainer, registerTrigger } from '../animation-config';
import { addVariant, type DrawVariant, type DrawMode } from './draw-shared';
import { playDrawMorph } from './draw-morph';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, ScrollTrigger);

export function initDrawIcon(el: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;

  // Convert non-path elements to <path> — skip background rects (fill="none" full-size rects)
  svg.querySelectorAll('circle, polygon, polyline, ellipse, line').forEach(e => {
    MorphSVGPlugin.convertToPath(e as any);
  });
  // Only convert rects that aren't the Phosphor background rect
  svg.querySelectorAll('rect').forEach(e => {
    const w = e.getAttribute('width');
    const h = e.getAttribute('height');
    const fill = e.getAttribute('fill');
    if (fill === 'none' && (w === '256' || w === '100%')) return; // skip background rect
    MorphSVGPlugin.convertToPath(e as any);
  });

  // Split compound paths using MotionPathPlugin.getRawPath (handles curves properly)
  svg.querySelectorAll('path:not(.icon-draw-overlay)').forEach(p => {
    const rawPath = MotionPathPlugin.getRawPath(p as any);
    if (rawPath.length <= 1) return;
    const parent = p.parentNode;
    if (!parent) return;
    const attributes = Array.from(p.attributes);
    rawPath.forEach((segment: any) => {
      const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      attributes.forEach(attr => {
        if (attr.nodeName !== 'd') newPath.setAttributeNS(null, attr.nodeName, attr.nodeValue || '');
      });
      newPath.setAttributeNS(null, 'd',
        'M' + segment[0] + ',' + segment[1] + 'C' + segment.slice(2).join(',') + (segment.closed ? 'z' : ''));
      parent.insertBefore(newPath, p);
    });
    parent.removeChild(p);
  });

  // Base paths — now split and converted
  const origPaths = Array.from(
    svg.querySelectorAll('path:not(.icon-draw-overlay)')
  ).filter(p => p.tagName.toLowerCase() !== 'rect') as SVGPathElement[];
  if (!origPaths.length) return;

  const variant = (el.dataset.iconDraw as DrawVariant) || 'draw';
  const mode = (el.dataset.iconDrawMode as DrawMode) || 'static';
  const laser = el.dataset.iconDrawLaser === 'true';
  const onScroll = el.dataset.iconDrawScroll === 'true';
  const scrub = el.dataset.iconDrawScrub === 'true';
  // Stagger: none=0, tight=0.1, normal=0.3, loose=0.6
  // Stagger scales with path count — total stagger time is fixed, per-path = total / count
  const staggerTotalMap: Record<string, number> = { none: 0, tight: 0.5, normal: 1, loose: 2 };
  const staggerTotal = staggerTotalMap[el.dataset.iconDrawStagger || 'normal'] ?? 1;
  const pathCount = origPaths.length;
  const drawStagger = pathCount > 1 ? staggerTotal / (pathCount - 1) : 0;
  const drawStaggerFrom = (el.dataset.iconDrawStaggerFrom || 'start') as 'start' | 'center' | 'end' | 'edges' | 'random';
  const drawWormSize = parseFloat(el.dataset.iconDrawWormSize || '') || 10;
  // Overlay color: drawColor can be:
  //   - A rainbow position (rainbow-1..7) → resolves to var(--rainbow-N) token
  //   - A gradient name (hero, sunset, red, etc.) → resolves to url(#grad-NAME)
  //   - A raw CSS colour value (#hex, rgb, etc.) → used directly
  // Gradient names still use the legacy red/orange/... vocabulary because they
  // refer to gradient definitions in SvgGradientDefs.astro, not rainbow tokens.
  // The gradient catalogue refactor will revisit those names.
  const cs = getComputedStyle(document.documentElement);
  const rawColor = el.dataset.iconDrawColor || '';
  const GRADIENT_NAMES = ['primary','secondary','neutral','hero','sunset','brand-emerge','brand-fade','emerge','fade',
    'red','orange','yellow','teal','blue','purple','pink',
    'red-tint','orange-tint','yellow-tint','teal-tint','blue-tint','purple-tint','pink-tint',
    'red-mid','orange-mid','yellow-mid','teal-mid','blue-mid','purple-mid','pink-mid',
    'red-emphasis','orange-emphasis','yellow-emphasis','teal-emphasis','blue-emphasis','purple-emphasis','pink-emphasis',
    'rainbow'];
  const isGradient = GRADIENT_NAMES.includes(rawColor);
  const isRainbowToken = /^rainbow-[1-7]$/.test(rawColor);
  const elStyle = getComputedStyle(el);
  const iconColor = elStyle.getPropertyValue('--_color').trim()
    || elStyle.color
    || cs.getPropertyValue('--primary-base').trim()
    || '#c4907c';
  const color = isGradient
    ? `url(#grad-${rawColor})`
    : isRainbowToken
    ? cs.getPropertyValue(`--${rawColor}`).trim() || iconColor
    : rawColor || iconColor;
  // Stroke width: read from data attribute (Shape sets it), fallback 10 for icons (256-unit viewBox)
  const sw = el.dataset.iconDrawSw ? parseFloat(el.dataset.iconDrawSw) : 10;

  // Detect scroll container — OverlayScrollbars viewport
  const osViewport = getScrollContainer();

  // Fill modes
  const showFill = el.dataset.iconDrawFill === 'true';
  const ghost = el.dataset.iconDrawGhost === 'true';
  const ghostColor = el.dataset.iconDrawGhostColor || getComputedStyle(el).getPropertyValue('--svg-ghost-color').trim() || getComputedStyle(el).getPropertyValue('--neutral-tint').trim() || iconColor;

  if (showFill) {
    // Fill variant: origPaths keep their fill — static icon always visible underneath
    // Overlay draws border on top. Nothing to do here.
  } else if (ghost) {
    // Ghost: CSS handles ghost color via .icon--draw[data-icon-draw-ghost] rules
  } else {
    // Stroke-only: hide origPaths, overlay handles everything
    origPaths.forEach(p => {
      gsap.set(p, { fill: 'none', stroke: 'none' });
    });
  }

  // Overlay stroke width: slightly thicker for border effect on filled/ghost icons
  const overlayStrokeWidth = (showFill || ghost) ? sw * 1.2 : sw;

  // Clone each path as a stroke overlay
  const overlays: SVGPathElement[] = [];
  // Ghost+fill: border starts hidden (draws on hover). All others: start drawn if static/yoyo/reverse-yoyo
  const isBorderMode = ghost && showFill;
  const startDrawn = isBorderMode || mode === 'reveal' ? false : (mode === 'reverse-yoyo' || mode === 'static' || mode === 'yoyo');
  const ghostOpacity = ghost ? 1 : 0.2;
  // Compute init opacity to match what playDraw creates visually
  let initOpacity = 0;
  if (isBorderMode) initOpacity = 0;
  else if (mode === 'once' && ghost) initOpacity = ghostOpacity;
  else if (mode === 'static' || mode === 'yoyo') initOpacity = ghost ? ghostOpacity : 1;
  else if (mode === 'reverse-yoyo') {
    if (ghost) {
      initOpacity = ghostOpacity;
    } else {
      // Must match ghost + 3 stacked erase clones composite
      const eraseOps = [0.5, 0.3, 0.15];
      let transparent = 1 - ghostOpacity;
      eraseOps.forEach(op => { transparent *= (1 - op); });
      initOpacity = 1 - transparent;
    }
  }

  origPaths.forEach(p => {
    const clone = p.cloneNode(true) as SVGPathElement;
    clone.classList.add('icon-draw-overlay');
    // Set SVG attributes directly for reliable initial state
    clone.setAttribute('fill', 'none');
    clone.setAttribute('stroke-width', String(overlayStrokeWidth));
    clone.setAttribute('stroke-linejoin', 'round');
    clone.setAttribute('stroke-linecap', 'round');
    if (!ghost) clone.setAttribute('stroke', 'currentColor');
    if (initOpacity < 1) clone.style.opacity = String(initOpacity);
    // Append first so getTotalLength works for drawSVG
    p.parentNode!.appendChild(clone);
    if (!startDrawn) {
      gsap.set(clone, { drawSVG: '0%' });
    }
    overlays.push(clone);
  });

  const drawTrigger = el.dataset.iconDrawTrigger || (onScroll ? (scrub ? 'scrub' : 'viewport') : 'hover');
  const hasMorphTarget = !!el.dataset.iconMorphTarget;
  const play = hasMorphTarget
    ? () => playDrawMorph(el, overlays, origPaths, color, ghostOpacity, ghost, ghostColor, variant, mode, laser, sw)
    : () => playDraw(overlays, variant, color, iconColor, mode, laser, ghostOpacity, ghost, ghostColor, isBorderMode, sw, drawStagger, drawStaggerFrom, drawWormSize);

  // Scrub is a special case — needs its own ScrollTrigger timeline
  if (drawTrigger === 'scrub') {
    if (getMotionMode() === 'none') {
      overlays.forEach(o => gsap.set(o, { opacity: 1, drawSVG: '100%' }));
    } else {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller: osViewport || undefined,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      });
      overlays.forEach((o, i) => {
        const from = variant === 'drawcenter' ? '50% 50%' : '0%';
        const to = variant === 'drawcenter' ? '0% 100%' : '100%';
        tl.set(o, { opacity: 1 }, 0);
        tl.fromTo(o, { drawSVG: from }, { drawSVG: to, duration: 1, ease: 'none' }, i * 0.1);
      });
    }
  } else {
    // All other triggers go through registerTrigger
    registerTrigger({
      el,
      trigger: drawTrigger,
      onEnter: play,
      onStatic: () => {
        overlays.forEach(o => {
          gsap.set(o, { drawSVG: '100%', opacity: 1 });
          if (!ghost && !o.style.stroke) o.style.stroke = color;
        });
      },
      scrollStart: 'top 80%',
    });
  }
}

/**
 * playDraw — builds and returns the master timeline for one draw cycle.
 *
 * Handles every combination of variant × mode × laser × ghost. The actual
 * stroke-drawing primitives live in addVariant (draw-shared.ts) — this
 * function is the per-mode orchestrator that composes them with the right
 * fade-ins, fade-outs, ghost layers, worm clones and bright trail clones.
 */
function playDraw(
  overlays: SVGPathElement[],
  variant: DrawVariant,
  color: string,
  iconColor: string,
  mode: DrawMode,
  laser: boolean,
  ghostOpacity = 0.15,
  isGhostMode = false,
  ghostColor = '',
  isBorderMode = false,
  swOverride = 0,
  staggerTime = 0.3,
  staggerFrom: 'start' | 'center' | 'end' | 'edges' | 'random' = 'start',
  wormSize = 10
): gsap.core.Timeline {
  const motion = getMotionMode();
  const hover = getHoverMode();
  if (motion === 'none') return gsap.timeline();
  const gentle = motion === 'gentle' || hover === 'gentle';
  const d = gentle ? 4 : 2;
  const sw = swOverride || 10;
  // Re-read colors fresh (theme may have changed since init)
  if (!color.startsWith('url(')) {
    // Solid color: re-read from CSS so theme changes are picked up
    const el = overlays[0]?.closest('.shape, .icon') as HTMLElement;
    if (el) {
      const fresh = getComputedStyle(el).getPropertyValue('--_color').trim() || getComputedStyle(el).color;
      if (fresh) { color = fresh; iconColor = fresh; }
    }
  }
  if (isGhostMode) {
    const freshGhost = getComputedStyle(overlays[0] || document.documentElement).getPropertyValue('--svg-ghost-color').trim()
      || getComputedStyle(overlays[0] || document.documentElement).getPropertyValue('--neutral-tint').trim();
    if (freshGhost) ghostColor = freshGhost;
  }
  const master = gsap.timeline();

  // Clean up previous temp clones
  const svg = overlays[0]?.closest('svg');
  if (svg) {
    svg.querySelectorAll('.icon-draw-chase, .icon-draw-worm, .icon-draw-trail, .icon-draw-static').forEach(el => el.remove());
  }
  // Kill any competing tweens on overlays
  overlays.forEach(o => {
    gsap.killTweensOf(o);
    if (isGhostMode) {
      o.style.removeProperty('stroke');
      o.style.removeProperty('fill');
    }
  });

  // Dim full fill during animation (ghost fill already dim, doesn't need this)
  const fillPaths = svg ? Array.from(
    svg.querySelectorAll('path:not(.icon-draw-overlay):not(.icon-draw-trail):not(.icon-draw-worm):not(.icon-draw-chase), circle:not(.icon-draw-overlay), polygon:not(.icon-draw-overlay)')
  ).filter(p => {
    const s = getComputedStyle(p);
    return s.fill && s.fill !== 'none' && Number(s.opacity) > 0.5;
  }) as SVGPathElement[] : [];
  const dimFill = fillPaths.length > 0 && !isGhostMode;
  if (dimFill) fillPaths.forEach(p => gsap.killTweensOf(p));

  // Create worm clones for laser modes
  let animTargets = overlays;
  const worms: SVGPathElement[] = [];
  if (laser) {
    overlays.forEach(o => {
      if (!isGhostMode) gsap.set(o, { stroke: color, strokeWidth: sw });
      const worm = o.cloneNode(true) as SVGPathElement;
      worm.classList.add('icon-draw-worm');
      gsap.set(worm, { fill: 'none', stroke: color, strokeWidth: sw, drawSVG: '0% 0%', opacity: 0 });
      o.parentNode!.appendChild(worm);
      worms.push(worm);
    });
    animTargets = worms;
  }

  // Animation starts immediately (fades run in parallel via gsap.to)
  const t = 0;

  switch (mode) {
    case 'once': {
      if (laser) {
        // Worm draws ghost line alongside, then both fade out
        const growD = d * 0.2;
        const shrinkD = d * 0.2;
        const travelD = d - growD - shrinkD;
        overlays.forEach(o => {
          master.set(o, { drawSVG: '0%', opacity: ghostOpacity }, t);
          master.fromTo(o, { drawSVG: '0%' }, { drawSVG: '10%', duration: growD, ease: 'power2.out' }, t);
          master.fromTo(o, { drawSVG: '10%' }, { drawSVG: '100%', duration: travelD, ease: 'power2.inOut' }, t + growD);
        });
        const onceTl = gsap.timeline();
        addVariant(onceTl, worms, variant, color, iconColor, d, sw, laser, staggerTime, staggerFrom, wormSize);
        master.add(onceTl, t);
        const onceTotalD = d + staggerTime * Math.max(0, worms.length - 1);
        master.to(overlays, { opacity: 0, duration: 0.5 }, t + onceTotalD);
        master.to(worms, { opacity: 0, duration: 0.5 }, t + onceTotalD);
      } else {
        overlays.forEach(o => master.set(o, { opacity: 1 }, t));
        const onceTl = gsap.timeline();
        addVariant(onceTl, overlays, variant, color, iconColor, d, sw, false, staggerTime, staggerFrom, wormSize);
        master.add(onceTl, t);
        const onceTotalD = d + staggerTime * Math.max(0, overlays.length - 1);
        master.to(overlays, { opacity: 0, duration: 0.5 }, t + onceTotalD);
      }
      break;
    }
    case 'static': {
      const restOpacity = isGhostMode ? ghostOpacity : 1;

      if (laser) {
        if (!isGhostMode) {
          // Full: dim overlay to ghost, worm plays, fade back to full
          overlays.forEach(o => {
            gsap.set(o, { drawSVG: '100%' });
            master.to(o, { opacity: ghostOpacity, duration: 1, ease: 'power2.out' }, 0);
          });
          addVariant(master, worms, variant, color, iconColor, d, sw, laser, staggerTime, staggerFrom, wormSize);
          master.to(overlays, { opacity: restOpacity, duration: 1, ease: 'power2.out' }, d);
        } else {
          // Ghost: stays at ghost, worm passes over
          overlays.forEach(o => gsap.set(o, { drawSVG: '100%', opacity: ghostOpacity }));
          addVariant(master, worms, variant, color, iconColor, d, sw, laser, staggerTime, staggerFrom, wormSize);
        }
      } else {
        // Full variant: dim to ghost → draw → brighten back
        // Ghost variant: stay at ghost → draw → stay at ghost
        if (!isGhostMode) {
          // Dim from full to ghost before animation
          overlays.forEach(o => {
            master.to(o, { opacity: ghostOpacity, duration: 0.4, ease: 'power2.out' }, 0);
          });
        }

        // Bright clone draws on top
        const brightClones: SVGPathElement[] = [];
        overlays.forEach(o => {
          const clone = o.cloneNode(true) as SVGPathElement;
          clone.classList.add('icon-draw-trail');
          gsap.set(clone, { fill: 'none', stroke: color, strokeWidth: sw, drawSVG: '0%', opacity: 1 });
          o.parentNode!.appendChild(clone);
          brightClones.push(clone);
        });
        const drawStart = isGhostMode ? 0 : 0.4;
        const drawTl = gsap.timeline();
        addVariant(drawTl, brightClones, variant, color, iconColor, d, sw, false, staggerTime, staggerFrom, wormSize);
        master.add(drawTl, drawStart);

        // After draw: fade bright clone out, restore overlay to rest opacity
        // Total duration includes stagger: d + stagger * (pathCount - 1)
        const totalDrawD = d + staggerTime * Math.max(0, brightClones.length - 1);
        master.to(brightClones, { opacity: 0, duration: 0.8, ease: 'power2.out' }, drawStart + totalDrawD);
        if (!isGhostMode) {
          master.to(overlays, { opacity: restOpacity, duration: 0.8, ease: 'power2.out' }, drawStart + totalDrawD);
        }

      }
      break;
    }
    case 'reveal': {
      // Starts invisible, draws in, stays visible
      if (laser) {
        overlays.forEach(o => gsap.set(o, { drawSVG: '0%', opacity: 0 }));
        // Trail draws behind worm
        overlays.forEach(o => {
          master.set(o, { opacity: 0.3 }, 0);
          master.fromTo(o, { drawSVG: '0%' }, { drawSVG: '100%', duration: d, ease: 'power2.inOut' }, 0);
          master.to(o, { opacity: 1, duration: d * 0.4, ease: 'power2.out' }, d * 0.6);
        });
        addVariant(master, worms, variant, color, iconColor, d, sw, laser, staggerTime, staggerFrom, wormSize);
      } else {
        // Simple: overlays draw from 0% to 100%, fade to full opacity
        overlays.forEach(o => {
          gsap.set(o, { stroke: color, strokeWidth: sw, drawSVG: '0%', opacity: 1 });
        });
        const drawTl = gsap.timeline();
        addVariant(drawTl, overlays, variant, color, iconColor, d, sw, false, staggerTime, staggerFrom, wormSize);
        master.add(drawTl, 0);
      }
      break;
    }
    case 'yoyo': {
      const opacities = [0.2, 0.5, 1];

      if (laser) {
        const restOpacity = isGhostMode ? ghostOpacity : 1;
        const growD = d * 0.2;
        const shrinkD = d * 0.2;
        const layerOpacities = [0.1, 0.15, 0.25];
        const stagger = d * 0.2;
        const travelD = d - growD - shrinkD;

        // Both variants: overlay at ghost level, worms play on top
        // Full just adds fade bookends (full→ghost before, ghost→full after)
        const fadeBookend = isGhostMode ? 0 : 1;
        let animStart = fadeBookend;

        overlays.forEach(o => {
          if (!isGhostMode) gsap.set(o, { stroke: color, strokeWidth: sw });
          if (isGhostMode) {
            gsap.set(o, { drawSVG: '100%', opacity: ghostOpacity });
          } else {
            // Full: dim to ghost, overlay stays as static ghost background
            gsap.set(o, { drawSVG: '100%' });
            master.to(o, { opacity: ghostOpacity, duration: fadeBookend, ease: 'power2.out' }, 0);
          }
        });

        animTargets.forEach((baseWorm, wi) => {
          const baseLayer = overlays[wi];
          gsap.set(baseWorm, { opacity: 0 });

          // All 3 ghost layers are clones (overlay stays as background)
          const layers: SVGPathElement[] = [];
          const lapWorms: SVGPathElement[] = [baseWorm];
          for (let g = 0; g < 3; g++) {
            const layerClone = baseLayer.cloneNode(true) as SVGPathElement;
            layerClone.classList.add('icon-draw-trail');
            gsap.set(layerClone, { fill: 'none', stroke: color, strokeWidth: sw, drawSVG: '0%', opacity: 0 });
            baseLayer.parentNode!.appendChild(layerClone);
            layers.push(layerClone);

            if (g > 0) {
              const wormClone = baseWorm.cloneNode(true) as SVGPathElement;
              wormClone.classList.add('icon-draw-trail');
              gsap.set(wormClone, { fill: 'none', stroke: color, strokeWidth: sw, drawSVG: '0% 0%', opacity: 0 });
              baseWorm.parentNode!.appendChild(wormClone);
              lapWorms.push(wormClone);
            }
          }

          opacities.forEach((op, i) => {
            const offset = animStart + i * stagger;
            const layer = layers[i];
            const worm = lapWorms[i];

            const wp = wormSize;
            const tp = 100 - wp;

            // Ghost layer: draws alongside worm
            master.set(layer, { opacity: layerOpacities[i] }, offset);
            master.fromTo(layer,
              { drawSVG: '0%' },
              { drawSVG: `${wp}%`, duration: growD, ease: 'power2.out' }, offset);
            master.fromTo(layer,
              { drawSVG: `${wp}%` },
              { drawSVG: '100%', duration: travelD, ease: 'power2.inOut' }, offset + growD);

            // Worm: full grow → travel → shrink
            master.set(worm, { opacity: op }, offset);
            master.fromTo(worm,
              { drawSVG: '0% 0%' },
              { drawSVG: `0% ${wp}%`, duration: growD, ease: 'power2.out' }, offset);
            master.fromTo(worm,
              { drawSVG: `0% ${wp}%` },
              { drawSVG: `${tp}% 100%`, duration: travelD, ease: 'power2.inOut' }, offset + growD);
            master.fromTo(worm,
              { drawSVG: `${tp}% 100%` },
              { drawSVG: '100% 100%', duration: shrinkD, ease: 'power2.in' }, offset + growD + travelD);
          });
        });

        // After worms finish: fade back to rest state
        const wormEnd = animStart + d + stagger * 2;
        if (!isGhostMode) {
          master.to(overlays, { opacity: restOpacity, duration: 1, ease: 'power2.out' }, wormEnd);
        } else {
          // Ghost: fade trails + worms out, overlay stays at ghost
          master.call(() => {
            if (svg) {
              svg.querySelectorAll('.icon-draw-trail, .icon-draw-worm').forEach(el => {
                gsap.to(el, { opacity: 0, duration: 0.5, ease: 'power2.out' });
              });
            }
            overlays.forEach(o => o.style.removeProperty('stroke'));
          }, [], wormEnd);
        }
      } else {
        const restOpacity = isGhostMode ? ghostOpacity : 1;
        const stagger = d * 0.35;

        // Border mode: overlay is the border — starts hidden, draws on hover
        if (isBorderMode) {
          overlays.forEach(o => gsap.set(o, { drawSVG: '0%', opacity: 1 }));
        } else if (isGhostMode) {
          overlays.forEach(o => gsap.set(o, { drawSVG: '100%', opacity: ghostOpacity }));
        } else {
          // Full variant: dim from current opacity to ghost
          overlays.forEach(o => {
            gsap.set(o, { drawSVG: '100%' });
            master.to(o, { opacity: ghostOpacity, duration: 1, ease: 'power2.out' }, 0);
          });
        }

        const drawStart = isGhostMode ? 0 : 1;

        // 3 staggered bright clones draw on top of ghost
        const trails: SVGPathElement[][] = [[], [], []];
        overlays.forEach(o => {
          for (let i = 0; i < 3; i++) {
            const clone = o.cloneNode(true) as SVGPathElement;
            clone.classList.add('icon-draw-trail');
            gsap.set(clone, { fill: 'none', stroke: 'currentColor', drawSVG: '0%', opacity: 0 });
            o.parentNode!.appendChild(clone);
            trails[i].push(clone);
          }
        });

        const tl1 = gsap.timeline();
        tl1.set(trails[0], { opacity: opacities[0] }, 0);
        addVariant(tl1, trails[0], variant, color, iconColor, d, sw, false, staggerTime, staggerFrom, wormSize);

        const tl2 = gsap.timeline();
        tl2.set(trails[1], { opacity: opacities[1] }, 0);
        addVariant(tl2, trails[1], variant, color, iconColor, d, sw, false, staggerTime, staggerFrom, wormSize);

        const tl3 = gsap.timeline();
        tl3.set(trails[2], { opacity: opacities[2] }, 0);
        addVariant(tl3, trails[2], variant, color, iconColor, d, sw, false, staggerTime, staggerFrom, wormSize);

        master.add(tl1, drawStart);
        master.add(tl2, drawStart + stagger);
        master.add(tl3, drawStart + stagger * 2);

        // After all waves: fade clones out, restore overlay to rest opacity
        const cleanup = drawStart + d + stagger * 2;
        trails.forEach(layer => {
          master.to(layer, { opacity: 0, duration: 0.5 }, cleanup);
        });
        if (!isGhostMode) {
          master.to(overlays, { opacity: restOpacity, duration: 0.8, ease: 'power2.out' }, cleanup);
        }
        master.call(() => {
          trails.forEach(layer => layer.forEach(el => el.remove()));
        }, [], cleanup + 0.8);
      }

      break;
    }
    case 'reverse-yoyo': {
      if (laser) {
        const restOpacity = isGhostMode ? ghostOpacity : 1;
        const growD = d * 0.2;
        const shrinkD = d * 0.2;
        const travelD = d - growD - shrinkD;
        const stagger = d * 0.2;
        const wormOpacities = [1, 0.5, 0.2];
        const layerOpacities = [0.75, 0.5, 0.25];

        // No pre-fade for full — starts at full brightness, worms erase it
        const animStart = 0;

        overlays.forEach(o => {
          if (!isGhostMode) gsap.set(o, { stroke: color, strokeWidth: sw });
          if (isGhostMode) {
            gsap.set(o, { drawSVG: '100%', opacity: ghostOpacity });
          } else {
            gsap.set(o, { drawSVG: '100%', opacity: 1 });
          }
        });

        // Build 3 visible layers + 3 reverse worms per overlay
        animTargets.forEach((baseWorm, wi) => {
          const baseLayer = overlays[wi];
          gsap.set(baseWorm, { opacity: 0 });

          // 3 static layers — ghost starts hidden and fades in, full starts visible
          const layers: SVGPathElement[] = [];
          const eWorms: SVGPathElement[] = [baseWorm];
          const fadeIn = isGhostMode ? d * 0.5 : 0;
          for (let g = 0; g < 3; g++) {
            const layerClone = baseLayer.cloneNode(true) as SVGPathElement;
            layerClone.classList.add('icon-draw-trail');
            if (isGhostMode) {
              gsap.set(layerClone, { fill: 'none', stroke: ghostColor, strokeWidth: sw, drawSVG: '100%', opacity: 0 });
            } else {
              gsap.set(layerClone, { fill: 'none', stroke: color, strokeWidth: sw, drawSVG: '100%', opacity: layerOpacities[g] });
            }
            baseLayer.parentNode!.appendChild(layerClone);
            layers.push(layerClone);

            if (g > 0) {
              const wormClone = baseWorm.cloneNode(true) as SVGPathElement;
              wormClone.classList.add('icon-draw-trail');
              gsap.set(wormClone, { fill: 'none', stroke: color, strokeWidth: sw, drawSVG: '100% 100%', opacity: 0 });
              baseWorm.parentNode!.appendChild(wormClone);
              eWorms.push(wormClone);
            }
          }

          // Full: overlay erases alongside first worm
          if (!isGhostMode) {
            master.to(baseLayer, { drawSVG: '0%', duration: d, ease: 'power2.inOut' }, animStart);
          }

          // Ghost: fade layers in gradually from ghost colour to draw colour
          if (isGhostMode) {
            layers.forEach((layer, li) => {
              master.to(layer, { stroke: color, opacity: layerOpacities[li], duration: fadeIn, ease: 'power2.out' }, 0);
            });
          }

          // Each worm eats its layer — staggered reverse travel
          const eraseStart = isGhostMode ? fadeIn : animStart;
          wormOpacities.forEach((op, i) => {
            const offset = eraseStart + i * stagger;
            const layer = layers[i];
            const worm = eWorms[i];

            // Worm travels reverse: end → start, eating the layer behind it
            const rwp = wormSize;
            const rtp = 100 - rwp;
            master.set(worm, { opacity: op }, offset);
            master.fromTo(worm,
              { drawSVG: '100% 100%' },
              { drawSVG: `${rtp}% 100%`, duration: growD, ease: 'power2.out' }, offset);
            master.fromTo(worm,
              { drawSVG: `${rtp}% 100%` },
              { drawSVG: `0% ${rwp}%`, duration: travelD, ease: 'power2.inOut' }, offset + growD);
            master.fromTo(worm,
              { drawSVG: `0% ${rwp}%` },
              { drawSVG: '0% 0%', duration: shrinkD, ease: 'power2.in' }, offset + growD + travelD);

            // Layer erases alongside its worm
            master.fromTo(layer,
              { drawSVG: '100%' },
              { drawSVG: '0%', duration: d, ease: 'power2.inOut' }, offset);
          });

          // After all eaten: fade overlay back to rest
          const eraseEnd = eraseStart + d + stagger * 2;
          if (!isGhostMode) {
            master.fromTo(baseLayer, { drawSVG: '0%', opacity: 0 }, { drawSVG: '100%', opacity: restOpacity, duration: 0.9, ease: 'power2.out' }, eraseEnd);
          } else {
            // Ghost: clean up trails, overlay stays at ghost
            master.call(() => {
              if (svg) {
                svg.querySelectorAll('.icon-draw-trail, .icon-draw-worm').forEach(el => {
                  gsap.to(el, { opacity: 0, duration: 0.5, ease: 'power2.out' });
                });
              }
              overlays.forEach(o => o.style.removeProperty('stroke'));
            }, [], eraseEnd);
          }
        });
      } else {
        const stagger = isGhostMode ? d * 0.35 : d * 0.2;
        const eraseOpacities = isGhostMode ? [0.7, 0.45, 0.25] : [0.75, 0.5, 0.25];

        // Ghost overlay underneath — always visible (ghost uses neutral-mid, full uses draw color)
        const overlayColor = isGhostMode ? ghostColor : color;
        const startOpacity = isGhostMode ? ghostOpacity : 1;
        overlays.forEach(o => gsap.set(o, { drawSVG: '100%', opacity: startOpacity, stroke: overlayColor, strokeWidth: sw }));

        // 3 stacked erase clones
        const fadeIn = isGhostMode ? 1.2 : 0;
        const eraseClones: SVGPathElement[][] = [[], [], []];
        overlays.forEach(o => {
          for (let i = 0; i < 3; i++) {
            const clone = o.cloneNode(true) as SVGPathElement;
            clone.classList.add('icon-draw-trail');
            gsap.set(clone, { fill: 'none', stroke: 'currentColor', strokeWidth: sw, drawSVG: '100%', opacity: isGhostMode ? 0 : eraseOpacities[i] });
            o.parentNode!.appendChild(clone);
            eraseClones[i].push(clone);
          }
        });

        // Ghost: fade clones in gently — start ghost colour, transition to vibrant
        if (isGhostMode) {
          eraseClones.forEach((layer, li) => {
            layer.forEach(clone => {
              gsap.set(clone, { stroke: ghostColor });
              master.to(clone, { stroke: 'currentColor', opacity: eraseOpacities[li], duration: fadeIn, ease: 'power2.out' }, 0);
            });
          });
        }

        // For full: erase overlay alongside first clone layer
        if (!isGhostMode) {
          overlays.forEach(o => {
            master.to(o, { drawSVG: '0%', duration: d * 0.6, ease: 'power2.inOut' }, fadeIn);
          });
        }

        // Staggered erase — each layer erases, icon gets dimmer
        eraseClones.forEach((layer, i) => {
          const offset = fadeIn + i * stagger;
          const eraseTl = gsap.timeline();
          layer.forEach(path => {
            eraseTl.fromTo(path,
              { drawSVG: '100%' },
              { drawSVG: '0%', duration: d, ease: 'power2.inOut' }, 0);
          });
          master.add(eraseTl, offset);
        });

        // After all erased: redraw overlay back to full — reversed direction + stagger
        const totalEraseD = d + staggerTime * Math.max(0, overlays.length - 1);
        const eraseEnd = fadeIn + totalEraseD + stagger * 2;
        const reverseFrom = staggerFrom === 'start' ? 'end' : staggerFrom === 'end' ? 'start' : staggerFrom;
        if (!isGhostMode) {
          const redrawStart = eraseEnd * 0.6;
          const redrawStagger = staggerTime > 0 ? staggerTime / Math.max(1, overlays.length - 1) : 0;
          const drawOpacities = [0.25, 0.5, 0.75];

          master.call(() => {
            // Redraw: per-path stagger, reversed direction — mirrors the erase
            overlays.forEach(o => gsap.set(o, { drawSVG: '100% 100%', opacity: 1 }));

            gsap.fromTo(overlays, { drawSVG: '100% 100%' }, {
              drawSVG: '0% 100%', duration: d, ease: 'power2.out',
              stagger: { each: redrawStagger, from: reverseFrom, ease: 'slow(0.7, 0.7, false)' }
            });

            // After all paths finish: clean up trails, ensure overlay at full
            const totalRedrawD = d + staggerTime;
            gsap.delayedCall(totalRedrawD, () => {
              overlays.forEach(o => gsap.set(o, { drawSVG: '100%', opacity: 1 }));
              if (svg) svg.querySelectorAll('.icon-draw-trail').forEach(el => {
                gsap.to(el, { opacity: 0, duration: 0.3, onComplete: () => el.remove() });
              });
            });
          }, [], redrawStart);
        }
      }
      break;
    }
  }

  // Dim full fill during animation, brighten after
  if (dimFill) {
    // Dim fill AFTER all animation tweens are already added
    const animEnd = master.duration();
    // Insert dim at start and fade-back at animation end
    master.to(fillPaths, { opacity: 0.3, duration: 1, ease: 'power2.out' }, 0);
    master.to(fillPaths, { opacity: 1, duration: 1, ease: 'power2.inOut' }, animEnd - 0.5);
  }

  // Cleanup worm clones after animation
  if (laser && worms.length) {
    master.call(() => worms.forEach(el => el.remove()));
  }

  return master;
}
