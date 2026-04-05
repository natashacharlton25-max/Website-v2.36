/**
 * Icon Animation Initialiser
 * src/lib/animation/icon-animation.ts
 *
 * Picks up data-icon-draw and data-icon-morph attributes from Icon.astro
 * and wires up DrawSVG / MorphSVG animations.
 *
 * Icon.astro outputs data attributes at build time but includes no script —
 * this keeps it lightweight (not every page needs GSAP). Import this module
 * on pages that use draw/morph icons.
 *
 * A11y: skips init if reduce-motion is active.
 */

import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, ScrollTrigger);

type DrawVariant = 'draw' | 'drawcenter' | 'chachaslide' | 'pulse';
type DrawMode = 'once' | 'static' | 'yoyo' | 'reverse-yoyo';

function prefersReducedMotion(): boolean {
  const wrapper = document.querySelector('#a11y-content-wrapper');
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    wrapper?.classList.contains('a11y-reduce-motion') === true ||
    wrapper?.classList.contains('a11y-text-only') === true;
}

/* ================================================================
   DRAW ICONS
   Original filled icon stays visible at all times.
   Stroke overlay clones loop 3x on hover then stay visible.
   Re-hover replays the animation.
   ================================================================ */

function getMotionMode(): 'full' | 'gentle' | 'none' {
  const val = document.documentElement.getAttribute('data-motion') || '';
  if (val === 'none') return 'none';
  if (val === 'gentle') return 'gentle';
  return 'full';
}

function getHoverMode(): 'full' | 'gentle' | 'instant' | 'none' {
  const val = document.documentElement.getAttribute('data-hover') || '';
  if (val === 'none') return 'none';
  if (val === 'instant') return 'instant';
  if (val === 'gentle') return 'gentle';
  return 'full';
}

function initDrawIcon(el: HTMLElement) {
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
  // Overlay color: drawColor can be a CSS colour OR a gradient name (e.g. "hero", "rainbow", "red")
  const cs = getComputedStyle(document.documentElement);
  const rawColor = el.dataset.iconDrawColor || '';
  const GRADIENT_NAMES = ['primary','secondary','neutral','hero','sunset','brand-emerge','brand-fade','emerge','fade',
    'red','orange','yellow','teal','blue','purple','pink',
    'red-tint','orange-tint','yellow-tint','teal-tint','blue-tint','purple-tint','pink-tint',
    'red-mid','orange-mid','yellow-mid','teal-mid','blue-mid','purple-mid','pink-mid',
    'red-emphasis','orange-emphasis','yellow-emphasis','teal-emphasis','blue-emphasis','purple-emphasis','pink-emphasis',
    'rainbow'];
  const isGradient = GRADIENT_NAMES.includes(rawColor);
  const elStyle = getComputedStyle(el);
  const iconColor = elStyle.getPropertyValue('--_color').trim()
    || elStyle.color
    || cs.getPropertyValue('--primary-base').trim()
    || '#c4907c';
  const color = isGradient
    ? `url(#grad-${rawColor})`
    : rawColor || iconColor;
  // Stroke width: read from data attribute (Shape sets it), fallback 10 for icons (256-unit viewBox)
  const sw = el.dataset.iconDrawSw ? parseFloat(el.dataset.iconDrawSw) : 10;

  // Detect scroll container — OverlayScrollbars viewport
  const osViewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]') || undefined;

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
  const startDrawn = isBorderMode ? false : (mode === 'reverse-yoyo' || mode === 'static' || mode === 'yoyo');
  const ghostOpacity = ghost ? 1 : 0.2;
  // Compute init opacity to match what playDraw creates visually
  let initOpacity = 0;
  if (isBorderMode) initOpacity = 0;
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
    if (ghost) {
      // Ghost: no inline stroke/fill — CSS var(--neutral-tint) handles resting color
      gsap.set(clone, {
        fill: 'none',
        strokeWidth: overlayStrokeWidth,
        drawSVG: startDrawn ? '100%' : '0%',
        opacity: initOpacity,
      });
    } else {
      gsap.set(clone, {
        fill: 'none',
        stroke: color,
        strokeWidth: overlayStrokeWidth,
        drawSVG: startDrawn ? '100%' : '0%',
        opacity: initOpacity,
      });
    }
    p.parentNode!.appendChild(clone);
    overlays.push(clone);
  });

  const drawTrigger = el.dataset.iconDrawTrigger || (onScroll ? (scrub ? 'scrub' : 'viewport') : 'hover');
  const hasMorphTarget = !!el.dataset.iconMorphTarget;
  const play = hasMorphTarget
    ? () => playDrawMorph(el, overlays, origPaths, color, ghostOpacity, ghost, ghostColor, variant, mode, laser, sw)
    : () => playDraw(overlays, variant, color, iconColor, mode, laser, ghostOpacity, ghost, ghostColor, isBorderMode, sw, drawStagger, drawStaggerFrom);

  switch (drawTrigger) {
    case 'scrub': {
      if (getMotionMode() === 'none') {
        overlays.forEach(o => gsap.set(o, { opacity: 1, drawSVG: '100%' }));
        break;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller: osViewport || undefined,
          start: 'top 80%',
          end: 'top 30%',
          scrub: true,
        },
      });
      overlays.forEach((o, i) => {
        const from = variant === 'drawcenter' ? '50% 50%' : '0%';
        const to = variant === 'drawcenter' ? '0% 100%' : '100%';
        tl.set(o, { opacity: 1 }, 0);
        tl.fromTo(o, { drawSVG: from }, { drawSVG: to, duration: 1, ease: 'none' }, i * 0.1);
      });
      break;
    }
    case 'viewport': {
      if (getMotionMode() === 'none') {
        overlays.forEach(o => gsap.set(o, { opacity: 1, drawSVG: '100%' }));
        break;
      }
      ScrollTrigger.create({
        trigger: el,
        scroller: osViewport || undefined,
        start: 'top 80%',
        once: true,
        onEnter: play,
      });
      break;
    }
    case 'viewport-loop': {
      if (getMotionMode() === 'none') break;
      ScrollTrigger.create({
        trigger: el,
        scroller: osViewport || undefined,
        start: 'top 80%',
        onEnter: () => {
          const loopPlay = () => {
            const tl = play();
            tl.eventCallback('onComplete', () => {
              gsap.delayedCall(3, loopPlay);
            });
          };
          loopPlay();
        },
        onLeave: () => gsap.killTweensOf(overlays),
        onEnterBack: () => {
          const loopPlay = () => {
            const tl = play();
            tl.eventCallback('onComplete', () => {
              gsap.delayedCall(3, loopPlay);
            });
          };
          loopPlay();
        },
        onLeaveBack: () => gsap.killTweensOf(overlays),
      });
      break;
    }
    case 'autoplay': {
      if (getMotionMode() === 'none') break;
      play();
      break;
    }
    case 'loop': {
      const loopPlay = () => {
        if (getMotionMode() === 'none') return;
        const tl = play();
        tl.eventCallback('onComplete', () => {
          gsap.delayedCall(3, loopPlay);
        });
      };
      loopPlay();
      break;
    }
    case 'interval': {
      play();
      setInterval(play, 8000);
      break;
    }
    case 'click': {
      const clickTarget = el.closest('button, a') || el;
      clickTarget.addEventListener('click', play);
      break;
    }
    case 'focus': {
      el.addEventListener('focus', play);
      break;
    }
    case 'hover':
    default: {
      const hoverTarget = el.closest('button, a') || el;
      let activeTl: gsap.core.Timeline | null = null;
      const triggerDraw = (e: Event) => {
        const motion = getMotionMode();
        const hover = getHoverMode();
        // Motion none: no animation at all
        if (motion === 'none') return;
        // Hover none: only focus/click, not mouseenter
        if (hover === 'none' && e.type === 'mouseenter') return;
        // Instant: jump to end state
        if (hover === 'instant') {
          if (activeTl) activeTl.kill();
          activeTl = play();
          activeTl.progress(1);
          return;
        }
        if (activeTl) activeTl.kill();
        activeTl = play();
      };
      if (getMotionMode() === 'none') {
        // Static fallback: show resting state (ghost color for ghost, draw color for full)
        overlays.forEach(o => {
          gsap.set(o, { drawSVG: '100%', opacity: 1 });
          if (!ghost && !o.style.stroke) o.style.stroke = color;
        });
      }
      hoverTarget.addEventListener('mouseenter', triggerDraw);
      hoverTarget.addEventListener('focusin', triggerDraw);
      hoverTarget.addEventListener('click', triggerDraw);
      break;
    }
  }
}

/* Builds a single forward-pass of the draw variant into the given timeline */
function addVariant(
  tl: gsap.core.Timeline,
  overlays: SVGPathElement[],
  variant: DrawVariant,
  color: string,
  _iconColor: string,
  d: number,
  sw: number,
  laser: boolean,
  staggerTime = 0.3,
  staggerFrom: 'start' | 'center' | 'end' | 'edges' | 'random' = 'start'
) {
  const pathStagger = overlays.length > 1 ? staggerTime : 0;

  if (laser) {
    // Laser: each worm starts hidden, appears only when its animation begins
    gsap.set(overlays, { stroke: color, strokeWidth: sw * 1.3, opacity: 0 });
    // Stagger opacity on — each worm appears at its own start time
    overlays.forEach((path, idx) => {
      const offset = idx * pathStagger;
      tl.set(path, { opacity: 1 }, offset);
    });
    tl.fromTo(overlays, { drawSVG: '0%' }, {
      drawSVG: '100%', duration: d, ease: 'power2.inOut',
      stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
    }, 0);
    // Thin out as draw completes
    tl.to(overlays, {
      strokeWidth: sw, duration: d * 0.6, ease: 'power2.in',
      stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
    }, d * 0.4);
    return;
  }

  switch (variant) {
    case 'draw':
      gsap.set(overlays, { stroke: color, strokeWidth: sw });
      tl.fromTo(overlays, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: d, ease: 'power2.inOut',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      break;
    case 'drawcenter':
      gsap.set(overlays, { stroke: color, strokeWidth: sw });
      tl.fromTo(overlays, { drawSVG: '50% 50%' }, {
        drawSVG: '0% 100%', duration: d, ease: 'power2.inOut',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      break;
    case 'pulse':
      gsap.set(overlays, { stroke: color, strokeWidth: sw * 1.5, opacity: 0.8 });
      tl.fromTo(overlays, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: d * 0.5, ease: 'power2.out',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      tl.to(overlays, { strokeWidth: sw, opacity: 1, duration: d * 0.5,
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, d * 0.5);
      break;
    case 'chachaslide': {
      const rootCs = getComputedStyle(document.documentElement);
      const secondColor = rootCs.getPropertyValue('--color-Black').trim() || '#000';
      const drawD = d * 0.35;
      const holdD = d * 0.1;
      const eraseD = d * 0.45;
      const chase2Start = drawD + holdD + eraseD * 0.75;
      const chase2D = d * 0.35;

      overlays.forEach((path, idx) => {
        const offset = idx * pathStagger;
        tl.fromTo(path,
          { drawSVG: '0%', stroke: color, strokeWidth: sw },
          { drawSVG: '100%', duration: drawD, ease: 'power2.inOut' }, offset);
        tl.fromTo(path,
          { drawSVG: '0% 100%' },
          { drawSVG: '100% 100%', duration: eraseD, ease: 'power1.in' },
          offset + drawD + holdD);

        const chase = path.cloneNode(true) as SVGPathElement;
        chase.classList.add('icon-draw-chase');
        gsap.set(chase, { fill: 'none', stroke: secondColor, strokeWidth: sw, drawSVG: '0%', opacity: 1 });
        path.parentNode!.appendChild(chase);
        tl.fromTo(chase,
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: chase2D, ease: 'power2.inOut' },
          offset + chase2Start);
      });
      break;
    }
  }
}

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
  staggerFrom: 'start' | 'center' | 'end' | 'edges' | 'random' = 'start'
): gsap.core.Timeline {
  const motion = getMotionMode();
  const hover = getHoverMode();
  if (motion === 'none') return gsap.timeline();
  const gentle = motion === 'gentle' || hover === 'gentle';
  const d = gentle ? 4 : 2;
  const sw = swOverride || 10;
  // Re-read ghost color fresh (theme may have changed since init)
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
        worms.forEach(w => master.set(w, { opacity: 1 }, t));
        const onceTl = gsap.timeline();
        addVariant(onceTl, worms, variant, color, iconColor, d, sw, laser, staggerTime, staggerFrom);
        master.add(onceTl, t);
        const onceTotalD = d + staggerTime * Math.max(0, worms.length - 1);
        master.to(overlays, { opacity: 0, duration: 0.5 }, t + onceTotalD);
        master.to(worms, { opacity: 0, duration: 0.5 }, t + onceTotalD);
      } else {
        overlays.forEach(o => master.set(o, { opacity: 1 }, t));
        const onceTl = gsap.timeline();
        addVariant(onceTl, overlays, variant, color, iconColor, d, sw, false, staggerTime, staggerFrom);
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
          worms.forEach(w => gsap.set(w, { opacity: 1 }));
          addVariant(master, worms, variant, color, iconColor, d, sw, laser, staggerTime, staggerFrom);
          master.to(overlays, { opacity: restOpacity, duration: 1, ease: 'power2.out' }, d);
        } else {
          // Ghost: stays at ghost, worm passes over
          overlays.forEach(o => gsap.set(o, { drawSVG: '100%', opacity: ghostOpacity }));
          worms.forEach(w => gsap.set(w, { opacity: 1 }));
          addVariant(master, worms, variant, color, iconColor, d, sw, laser, staggerTime, staggerFrom);
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
        addVariant(drawTl, brightClones, variant, color, iconColor, d, sw, false, staggerTime, staggerFrom);
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
            gsap.set(o, { drawSVG: '0%', opacity: ghostOpacity });
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

            // Ghost layer: draws alongside worm
            master.set(layer, { opacity: layerOpacities[i] }, offset);
            master.fromTo(layer,
              { drawSVG: '0%' },
              { drawSVG: '10%', duration: growD, ease: 'power2.out' }, offset);
            master.fromTo(layer,
              { drawSVG: '10%' },
              { drawSVG: '100%', duration: travelD, ease: 'power2.inOut' }, offset + growD);

            // Worm: full grow → travel → shrink
            master.set(worm, { opacity: op }, offset);
            master.fromTo(worm,
              { drawSVG: '0% 0%' },
              { drawSVG: '0% 10%', duration: growD, ease: 'power2.out' }, offset);
            master.fromTo(worm,
              { drawSVG: '0% 10%' },
              { drawSVG: '90% 100%', duration: travelD, ease: 'power2.inOut' }, offset + growD);
            master.fromTo(worm,
              { drawSVG: '90% 100%' },
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
            gsap.set(clone, { fill: 'none', drawSVG: '0%', opacity: 0 });
            o.parentNode!.appendChild(clone);
            trails[i].push(clone);
          }
        });

        const tl1 = gsap.timeline();
        tl1.set(trails[0], { opacity: opacities[0] }, 0);
        addVariant(tl1, trails[0], variant, color, iconColor, d, sw, false, staggerTime, staggerFrom);

        const tl2 = gsap.timeline();
        tl2.set(trails[1], { opacity: opacities[1] }, 0);
        addVariant(tl2, trails[1], variant, color, iconColor, d, sw, false, staggerTime, staggerFrom);

        const tl3 = gsap.timeline();
        tl3.set(trails[2], { opacity: opacities[2] }, 0);
        addVariant(tl3, trails[2], variant, color, iconColor, d, sw, false, staggerTime, staggerFrom);

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
            master.set(worm, { opacity: op }, offset);
            master.fromTo(worm,
              { drawSVG: '100% 100%' },
              { drawSVG: '90% 100%', duration: growD, ease: 'power2.out' }, offset);
            master.fromTo(worm,
              { drawSVG: '90% 100%' },
              { drawSVG: '0% 10%', duration: travelD, ease: 'power2.inOut' }, offset + growD);
            master.fromTo(worm,
              { drawSVG: '0% 10%' },
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
        overlays.forEach(o => gsap.set(o, { drawSVG: '100%', opacity: 1, stroke: overlayColor, strokeWidth: sw }));

        // 3 stacked erase clones
        const fadeIn = isGhostMode ? 0.3 : 0;
        const eraseClones: SVGPathElement[][] = [[], [], []];
        overlays.forEach(o => {
          for (let i = 0; i < 3; i++) {
            const clone = o.cloneNode(true) as SVGPathElement;
            clone.classList.add('icon-draw-trail');
            gsap.set(clone, { fill: 'none', stroke: color, strokeWidth: sw, drawSVG: '100%', opacity: isGhostMode ? 0 : eraseOpacities[i] });
            o.parentNode!.appendChild(clone);
            eraseClones[i].push(clone);
          }
        });

        // Ghost: fade clones in gently before erase
        if (isGhostMode) {
          eraseClones.forEach((layer, li) => {
            layer.forEach(clone => {
              master.to(clone, { opacity: eraseOpacities[li], duration: fadeIn, ease: 'power2.out' }, 0);
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

/* ================================================================
   DRAW MORPH — erase → intermediary worm → draw new shape
   Uses DrawSVG path swaps, no MorphSVG needed.
   ================================================================ */

function playDrawMorph(
  el: HTMLElement,
  overlays: SVGPathElement[],
  _origPaths: SVGPathElement[],
  color: string,
  _ghostOpacity: number,
  _isGhostMode: boolean,
  _ghostColor: string,
  variant: DrawVariant = 'draw',
  mode: DrawMode = 'static',
  laser: boolean = false,
  swOverride: number = 0
): gsap.core.Timeline {
  const motion = getMotionMode();
  if (motion === 'none') return gsap.timeline();
  const d = motion === 'gentle' ? 4 : 2;
  const sw = swOverride || 10;
  const master = gsap.timeline();

  // Clean up old temp clones
  const svg = overlays[0]?.closest('svg');
  if (svg) {
    svg.querySelectorAll('.icon-draw-chase, .icon-draw-worm, .icon-draw-trail, .icon-draw-static').forEach(el => el.remove());
  }
  overlays.forEach(o => gsap.killTweensOf(o));

  // Parse morph target SVG — extract path d attributes
  const morphHTML = el.dataset.iconMorphTarget || '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = morphHTML;
  const targetPaths = Array.from(tempDiv.querySelectorAll('path')) as SVGPathElement[];

  // Store original path data if not already
  overlays.forEach(o => {
    if (!(o as any)._originalD) (o as any)._originalD = o.getAttribute('d');
  });



  // Helper: find percentage along path closest to a point
  function findClosestPct(path: SVGPathElement, targetX: number, targetY: number): number {
    const total = path.getTotalLength();
    let best = 0;
    let bestDist = Infinity;
    for (let s = 0; s <= 200; s++) {
      const pt = path.getPointAtLength((s / 200) * total);
      const dist = Math.hypot(pt.x - targetX, pt.y - targetY);
      if (dist < bestDist) { bestDist = dist; best = (s / 200) * 100; }
    }
    return best;
  }

  // Track state — alternates between original and target
  const isAtTarget = (overlays[0] as any)._atTarget === true;

  // Reference point: top-center of 256x256 viewBox
  const refX = 128, refY = 24;

  // Find erase-to point on current shape
  overlays.forEach(o => {
    gsap.set(o, { opacity: 1, drawSVG: '100%', stroke: color, strokeWidth: sw });
    (o as any)._eraseEnd = findClosestPct(o, refX, refY);
  });

  // ── Phase 1: Erase current shape — shrinks to the reference point ──
  overlays.forEach(o => {
    const ep = (o as any)._eraseEnd;
    master.fromTo(o,
      { drawSVG: `${ep}% ${ep + 100}%` },
      { drawSVG: `${ep}% ${ep}%`, duration: d * 0.4, ease: 'power2.in' }, 0);
  });

  // ── Phase 2: Worm bridges from erase end to draw start ──
  const eraseEnd = d * 0.4;
  const newD = isAtTarget
    ? overlays.map(o => (o as any)._originalD)
    : targetPaths.map(p => p.getAttribute('d'));

  // Swap path data and find draw-from point
  master.call(() => {
    overlays.forEach((o, i) => {
      const pathD = newD[i] || newD[0];
      if (pathD) o.setAttribute('d', pathD);
      (o as any)._drawStart = findClosestPct(o, refX, refY);
      gsap.set(o, { drawSVG: `${(o as any)._drawStart}% ${(o as any)._drawStart}%`, opacity: 1 });
    });
  }, [], eraseEnd);

  // Worm: small segment appears at ref point, then shape draws out from it
  const wormStart = eraseEnd + 0.05;
  const growD = d * 0.1;

  // ── Phase 3: Draw new shape from reference point ──
  const drawStart = wormStart + growD;
  overlays.forEach(o => {
    const ds = (o as any)._drawStart || 0;
    // Grow worm from point
    master.fromTo(o,
      { drawSVG: `${ds}% ${ds}%` },
      { drawSVG: `${ds}% ${ds + 5}%`, duration: growD, ease: 'power2.out' }, wormStart);
    // Draw full shape
    master.fromTo(o,
      { drawSVG: `${ds}% ${ds + 5}%` },
      { drawSVG: `${ds}% ${ds + 100}%`, duration: d * 0.5, ease: 'power2.out' }, drawStart);
  });

  // Update state
  master.call(() => {
    (overlays[0] as any)._atTarget = !isAtTarget;
  });

  return master;
}

/* ================================================================
   MORPH ICONS
   ================================================================ */

function initMorphIcon(el: HTMLElement) {
  if (getMotionMode() === 'none') return;
  // Draw-morph handles this icon instead
  if (el.dataset.iconDraw) return;

  const svg = el.querySelector('svg');
  if (!svg) return;

  // Convert non-path elements to <path> for smoother morphing
  svg.querySelectorAll('circle, rect, polygon, polyline, ellipse, line').forEach(e => {
    MorphSVGPlugin.convertToPath(e as any);
  });

  const paths = Array.from(svg.querySelectorAll('path')) as SVGPathElement[];
  if (!paths.length) return;

  const morphTargetHTML = el.dataset.iconMorphTarget;
  if (!morphTargetHTML) return;

  const morphColor = el.dataset.iconMorphColor;
  const viaCircle = el.dataset.iconMorphCircle === 'true';

  // Parse target SVG
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = morphTargetHTML;
  const targetPaths = Array.from(tempDiv.querySelectorAll('path')) as SVGPathElement[];
  if (!targetPaths.length) return;

  // Get colours
  const computedStyle = getComputedStyle(el);
  const originalFill = computedStyle.color || '#fff';
  const targetFill = morphColor || originalFill;

  // Circle path for intermediate morph (centered in 256x256 viewBox)
  const circlePath = 'M128,24A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Z';

  // Store original path data
  paths.forEach(p => {
    (p as any)._originalD = p.getAttribute('d');
  });

  let morphed = false;
  let tl: gsap.core.Timeline | null = null;

  const morph = () => {
    if (tl) tl.kill();
    const morphDur = getMotionMode() === 'gentle' ? 0.8 : 0.4;
    tl = gsap.timeline();

    paths.forEach((path, i) => {
      const target = targetPaths[i];
      if (!target) return;

      if (viaCircle) {
        const halfDur = morphDur * 0.6;
        if (!morphed) {
          // Shape A → circle → Shape B
          tl!.to(path, {
            morphSVG: { shape: circlePath, type: 'rotational' },
            duration: halfDur,
            ease: 'power2.in',
          }, 0);
          tl!.to(path, {
            morphSVG: { shape: target, type: 'rotational' },
            fill: targetFill,
            duration: halfDur,
            ease: 'power2.out',
          }, halfDur);
        } else {
          // Shape B → circle → Shape A
          tl!.to(path, {
            morphSVG: { shape: circlePath, type: 'rotational' },
            duration: halfDur,
            ease: 'power2.in',
          }, 0);
          tl!.to(path, {
            morphSVG: { shape: (path as any)._originalD, type: 'rotational' },
            fill: originalFill,
            duration: halfDur,
            ease: 'power2.out',
          }, halfDur);
        }
      } else {
        if (!morphed) {
          tl!.to(path, {
            morphSVG: { shape: target, type: 'rotational' },
            fill: targetFill,
            duration: morphDur,
            ease: 'power2.inOut',
          }, 0);
        } else {
          tl!.to(path, {
            morphSVG: { shape: (path as any)._originalD, type: 'rotational' },
            fill: originalFill,
            duration: morphDur,
            ease: 'power2.inOut',
          }, 0);
        }
      }
    });

    morphed = !morphed;
  };

  const morphTarget = el.closest('button, a') || el;
  const hover = getHoverMode();
  if (hover !== 'none') {
    morphTarget.addEventListener('mouseenter', () => { if (!morphed) morph(); });
    morphTarget.addEventListener('mouseleave', () => { if (morphed) morph(); });
  }
  morphTarget.addEventListener('focusin', () => { if (!morphed) morph(); });
  morphTarget.addEventListener('focusout', () => { if (morphed) morph(); });
  morphTarget.addEventListener('click', () => { morph(); });
}

/* ================================================================
   INIT
   ================================================================ */

function gateAnimatedGradients() {
  const motion = getMotionMode();
  document.querySelectorAll<SVGAnimateTransformElement>('.icon svg animateTransform').forEach(el => {
    if (motion === 'none') {
      el.remove();
    } else if (motion === 'gentle') {
      el.setAttribute('dur', '16s');
    }
  });
}

export function initIconAnimations() {
  if (prefersReducedMotion()) return;

  gateAnimatedGradients();
  document.querySelectorAll<HTMLElement>('[data-icon-draw]').forEach(initDrawIcon);
  document.querySelectorAll<HTMLElement>('[data-icon-morph]').forEach(initMorphIcon);
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', initIconAnimations);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIconAnimations);
  } else {
    initIconAnimations();
  }
}
