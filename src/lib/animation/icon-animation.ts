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

type DrawVariant = 'draw' | 'drawcenter' | 'pulse';
type DrawMode = 'once' | 'static' | 'yoyo' | 'reverse-yoyo' | 'reveal';

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
  const drawWormSize = parseFloat(el.dataset.iconDrawWormSize || '') || 10;
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
  const startDrawn = isBorderMode || mode === 'reveal' ? false : (mode === 'reverse-yoyo' || mode === 'static' || mode === 'yoyo');
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
  staggerFrom: 'start' | 'center' | 'end' | 'edges' | 'random' = 'start',
  _wormSize = 10
) {
  const pathStagger = overlays.length > 1 ? staggerTime : 0;

  if (laser) {
    // Laser: worm travels, trail draws behind — wormPct controls segment size
    overlays.forEach((path, idx) => {
      const offset = idx * pathStagger;

      // Trail: full line draws behind worm at lower opacity
      gsap.set(path, { strokeWidth: sw, opacity: 0 });
      tl.set(path, { opacity: 0.3 }, offset);
      tl.fromTo(path, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: d, ease: 'power2.inOut'
      }, offset);
      // Fade trail to full opacity after worm passes
      tl.to(path, { opacity: 1, duration: d * 0.4, ease: 'power2.out' }, offset + d * 0.6);

      // Worm: bright segment travels ahead — scales with path length
      const worm = path.cloneNode(true) as SVGPathElement;
      worm.classList.add('icon-draw-worm');
      gsap.set(worm, { fill: 'none', strokeWidth: sw, drawSVG: '0% 0%', opacity: 0 });
      path.parentNode!.appendChild(worm);

      const wormPct = _wormSize;
      const tailPct = 100 - wormPct;

      tl.set(worm, { opacity: 1 }, offset);
      tl.fromTo(worm, { drawSVG: '0% 0%' }, { drawSVG: `0% ${wormPct}%`, duration: d * 0.08, ease: 'power2.out' }, offset);
      tl.fromTo(worm, { drawSVG: `0% ${wormPct}%` }, { drawSVG: `${tailPct}% 100%`, duration: d * 0.84, ease: 'power2.inOut' }, offset + d * 0.08);
      tl.fromTo(worm, { drawSVG: `${tailPct}% 100%` }, { drawSVG: '100% 100%', duration: d * 0.08, ease: 'power2.in' }, offset + d * 0.92);
      tl.set(worm, { opacity: 0 }, offset + d);
    });
    return;
  }

  switch (variant) {
    case 'draw':
      gsap.set(overlays, { strokeWidth: sw });
      tl.fromTo(overlays, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: d, ease: 'power2.inOut',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      break;
    case 'drawcenter':
      gsap.set(overlays, { strokeWidth: sw });
      tl.fromTo(overlays, { drawSVG: '50% 50%' }, {
        drawSVG: '0% 100%', duration: d, ease: 'power2.inOut',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      break;
    case 'pulse':
      gsap.set(overlays, { strokeWidth: sw * 1.5, opacity: 0.8 });
      tl.fromTo(overlays, { drawSVG: '0%' }, {
        drawSVG: '100%', duration: d * 0.5, ease: 'power2.out',
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, 0);
      tl.to(overlays, { strokeWidth: sw, opacity: 1, duration: d * 0.5,
        stagger: { each: pathStagger, from: staggerFrom, ease: 'slow(0.7, 0.7, false)' }
      }, d * 0.5);
      break;
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

/* ================================================================
   DRAW MORPH — shell that sequences two standard draw animations.
   Phase 1: Erase icon A (reverse of addVariant)
   Phase 2: Swap overlays to icon B at the zero point
   Phase 3: Draw icon B (forward addVariant)
   All animation logic lives in addVariant — this just orchestrates.
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
  _mode: DrawMode = 'static',
  laser: boolean = false,
  swOverride: number = 0
): gsap.core.Timeline {
  const motion = getMotionMode();
  if (motion === 'none') return gsap.timeline();
  const d = motion === 'gentle' ? 4 : 2;
  const sw = swOverride || 10;

  // Re-read color fresh (theme may have changed since init)
  if (!color.startsWith('url(')) {
    const fresh = getComputedStyle(el).getPropertyValue('--_color').trim() || getComputedStyle(el).color;
    if (fresh) color = fresh;
  }

  const master = gsap.timeline();

  const svg = overlays[0]?.closest('svg');
  if (!svg) return master;

  // Clean up old temp clones
  svg.querySelectorAll('.icon-draw-chase, .icon-draw-worm, .icon-draw-trail, .icon-draw-static, .icon-draw-morph-b').forEach(n => n.remove());
  overlays.forEach(o => gsap.killTweensOf(o));

  // Parse morph target SVG
  const morphHTML = el.dataset.iconMorphTarget || '';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = morphHTML;
  // Convert non-path elements in target
  const targetSvg = tempDiv.querySelector('svg');
  if (targetSvg) {
    targetSvg.querySelectorAll('circle, polygon, polyline, ellipse, line').forEach(e => {
      MorphSVGPlugin.convertToPath(e as any);
    });
    targetSvg.querySelectorAll('rect').forEach(e => {
      const w = e.getAttribute('width');
      const fill = e.getAttribute('fill');
      if (fill === 'none' && (w === '256' || w === '100%')) return;
      MorphSVGPlugin.convertToPath(e as any);
    });
  }
  const targetPathEls = Array.from(tempDiv.querySelectorAll('path')) as SVGPathElement[];

  // Store originals for toggle-back
  if (!(el as any)._morphOrigData) {
    (el as any)._morphOrigData = overlays.map(o => o.getAttribute('d'));
  }
  const isAtTarget = (el as any)._morphAtTarget === true;

  // Which paths to draw next
  const nextPaths = isAtTarget
    ? (el as any)._morphOrigData as string[]
    : targetPathEls.map(p => p.getAttribute('d') || '');

  // ── Phase 1: Erase icon A — reverse of addVariant ──
  // Set overlays to fully drawn state, then build a forward draw tl and play it reversed
  overlays.forEach(o => {
    gsap.set(o, { opacity: 1, stroke: color, strokeWidth: sw, drawSVG: '100%' });
  });
  const eraseTl = gsap.timeline({ paused: true });
  addVariant(eraseTl, overlays, variant, color, color, d, sw, laser, 0, 'start');
  // Reverse: plays the draw animation backwards (100% → 0%) — accelerates into disappearance
  master.add(eraseTl.tweenFromTo(eraseTl.duration(), 0, { duration: d * 0.5, ease: 'power3.in' }), 0);
  // Fade out at end of erase
  master.to(overlays, { opacity: 0, duration: 0.1, ease: 'power2.in' }, d * 0.5 - 0.1);

  // ── Phase 2: At zero point — create icon B overlays and draw them ──
  master.call(() => {
    // Hide icon A overlays
    overlays.forEach(o => gsap.set(o, { opacity: 0 }));

    // Create fresh overlays from icon B paths
    const parent = svg.querySelector('g') || svg;
    const newOverlays: SVGPathElement[] = [];
    nextPaths.forEach(pathD => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', pathD);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'currentColor');
      p.setAttribute('stroke-width', String(sw));
      p.setAttribute('stroke-linejoin', 'round');
      p.setAttribute('stroke-linecap', 'round');
      p.classList.add('icon-draw-overlay', 'icon-draw-morph-b');
      parent.appendChild(p);
      gsap.set(p, { stroke: color, strokeWidth: sw, drawSVG: '0%', opacity: 1 });
      newOverlays.push(p);
    });

    // ── Phase 3: Draw icon B — standard forward addVariant with smooth ease ──
    const drawTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    addVariant(drawTl, newOverlays, variant, color, color, d * 0.6, sw, laser, 0, 'start');
    drawTl.timeScale(0.8);
    drawTl.play();

    // After draw completes: swap references so overlays array points to B
    drawTl.call(() => {
      // Remove old A overlays from DOM
      overlays.forEach(o => o.remove());
      overlays.length = 0;
      newOverlays.forEach(o => {
        o.classList.remove('icon-draw-morph-b');
        overlays.push(o);
      });
      (el as any)._morphAtTarget = !isAtTarget;
    });
  }, [], d * 0.5 + 0.05);

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

  // Parse target SVG — convert non-path elements to paths for MorphSVGPlugin
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = morphTargetHTML;
  // Must append to DOM for convertToPath to work
  tempDiv.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  document.body.appendChild(tempDiv);
  tempDiv.querySelectorAll('circle, rect, polygon, polyline, ellipse, line').forEach(e => {
    MorphSVGPlugin.convertToPath(e as any);
  });
  const targetPaths = Array.from(tempDiv.querySelectorAll('path')) as SVGPathElement[];
  document.body.removeChild(tempDiv);
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
        const targetShape = !morphed ? target : (path as any)._originalD;
        // Shape → circle → target shape (no fill animation — CSS handles color)
        tl!.to(path, {
          morphSVG: { shape: circlePath, type: 'rotational' },
          duration: halfDur,
          ease: 'power2.in',
        }, 0);
        tl!.to(path, {
          morphSVG: { shape: targetShape, type: 'rotational' },
          duration: halfDur,
          ease: 'power2.out',
        }, halfDur);
      } else {
        const targetShape = !morphed ? target : (path as any)._originalD;
        tl!.to(path, {
          morphSVG: { shape: targetShape, type: 'rotational' },
          duration: morphDur,
          ease: 'power2.inOut',
        }, 0);
      }
    });

    morphed = !morphed;
  };

  // Detect scroll container
  const osViewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]') || undefined;
  const morphTrigger = el.dataset.iconMorphTrigger || 'hover';

  switch (morphTrigger) {
    case 'viewport': {
      ScrollTrigger.create({
        trigger: el,
        scroller: osViewport || undefined,
        start: 'top 60%',
        onEnter: () => { if (!morphed) morph(); },
        onLeaveBack: () => { if (morphed) morph(); },
      });
      break;
    }
    case 'scroll': {
      ScrollTrigger.create({
        trigger: el,
        scroller: osViewport || undefined,
        start: 'top 60%',
        onEnter: () => { if (!morphed) morph(); },
        onLeaveBack: () => { if (morphed) morph(); },
      });
      break;
    }
    case 'hover':
    default: {
      const morphTarget = el.closest('button, a') || el;
      const hover = getHoverMode();
      if (hover !== 'none') {
        morphTarget.addEventListener('mouseenter', () => { if (!morphed) morph(); });
        morphTarget.addEventListener('mouseleave', () => { if (morphed) morph(); });
      }
      morphTarget.addEventListener('focusin', () => { if (!morphed) morph(); });
      morphTarget.addEventListener('focusout', () => { if (morphed) morph(); });
      morphTarget.addEventListener('click', () => { morph(); });
      break;
    }
  }
}

/* ================================================================
   FILL ANIMATION — morph fill
   Clones shape path, starts as tiny dot at center, morphs into
   the full shape. Fill "blooms" outward organically.
   Can morph color too.
   ================================================================ */

// Registry for elements that need re-init on theme change
const rainbowScrollElements: { el: HTMLElement, tl: gsap.core.Timeline, rebuild: () => void }[] = [];

function initFillIcon(el: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;
  // Allow overshoot from bounce/back easing
  svg.setAttribute('overflow', 'visible');
  svg.style.overflow = 'visible';

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
  const easeType = el.dataset.iconFillEase || (hasDraw ? 'expoScale(0.5,7,power3.out)' : 'back.out(1.7)');
  const combinedDuration = hasDraw ? fillDuration * 1.5 : fillDuration;
  // Stagger: total time divided by path count
  const staggerTotalMap: Record<string, number> = { none: 0, tight: 0.5, normal: 1, loose: 2 };
  const staggerTotal = staggerTotalMap[el.dataset.iconFillStagger || 'normal'] ?? 1;
  const staggerFrom = (el.dataset.iconFillStaggerFrom || 'start') as 'start' | 'center' | 'end' | 'edges' | 'random';

  const osViewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]') || undefined;
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

  // Split compound paths (single <path> with multiple M commands) into individual paths
  g.querySelectorAll('path:not(.icon-fill-morph)').forEach(p => {
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

  // oklch → hex
  const toHex = (cssColor: string): string => {
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.fillStyle = cssColor;
    return ctx.fillStyle;
  };
  const getColor = () => {
    const cs = getComputedStyle(el);
    return toHex(cs.getPropertyValue('--_color').trim() || cs.color || '#c4907c');
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

  // Original paths: hide fill, optionally keep stroke outline
  origPaths.forEach(p => {
    (p as HTMLElement).style.fill = 'none';
    if (showOutline) {
      const sw = g.getAttribute('stroke-width') || '2';
      (p as HTMLElement).style.stroke = 'currentColor';
      (p as HTMLElement).style.strokeWidth = sw;
    }
  });

  // Start filled if static mode
  if (mode === 'static') {
    fillClones.forEach(clone => {
      gsap.set(clone, { scale: 1, opacity: 1 });
    });
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

    fillClones.forEach((clone, i) => {
      const offset = rank[i] * perPathStagger;

      const hasColorMorph = targetColor !== getColor();

      if (!reverse) {
        // Set fresh color before animating
        clone.setAttribute('fill', targetColor);

        if (isFade) {
          // Fade only — just opacity, no scale
          tl.fromTo(clone,
            { opacity: 0 },
            { opacity: 1, duration: d, ease: 'power2.out' },
            offset);
        } else {
          // Scale bloom + fade — opacity leads, scale follows with bounce
          tl.fromTo(clone,
            { opacity: 0 },
            { opacity: 1, duration: d * 0.3, ease: 'power2.out' },
            offset);
          tl.fromTo(clone,
            { scale: 0.01 },
            { scale: 1, duration: d, ease: easeType },
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
      const hoverTarget = el.closest('button, a') || el;
      let activeTl: gsap.core.Timeline | null = null;

      // Helper: fade clones out smoothly, then run callback
      const fadeOutThenPlay = (cb: () => void) => {
        if (activeTl) activeTl.kill();
        const fadeOut = gsap.timeline();
        fillClones.forEach(c => {
          if (isFade) {
            fadeOut.to(c, { opacity: 0, duration: 0.5, ease: 'power3.in' }, 0);
          } else {
            fadeOut.to(c, { opacity: 0, scale: 0.3, duration: 0.5, ease: 'power3.in' }, 0);
          }
        });
        fadeOut.call(() => {
          fillClones.forEach(c => gsap.set(c, isFade ? { opacity: 0 } : { scale: 0.01, opacity: 0 }));
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
          hoverTarget.addEventListener('mouseenter', enter);
          hoverTarget.addEventListener('mouseleave', () => { if (activeTl) activeTl.kill(); activeTl = playFill(true); isFilled = false; });
          hoverTarget.addEventListener('focusin', enter);
          hoverTarget.addEventListener('focusout', () => { if (activeTl) activeTl.kill(); activeTl = playFill(true); isFilled = false; });
          break;
        }
        case 'static': {
          hoverTarget.addEventListener('mouseenter', () => {
            fadeOutThenPlay(() => { activeTl = playFill(false); });
          });
          break;
        }
        case 'twinkle': {
          // Starts filled. Each hover: pieces randomly dim to ~10% then pop back to full
          fillClones.forEach(c => gsap.set(c, { scale: 1, opacity: 1 }));
          isFilled = true;

          hoverTarget.addEventListener('mouseenter', () => {
            if (activeTl) activeTl.kill();
            const tl = gsap.timeline();
            const pathCount = fillClones.length;
            const spread = pathCount > 1 ? 1.2 / (pathCount - 1) : 0;
            // Random order each time
            const order = Array.from({ length: pathCount }, (_, i) => i).sort(() => Math.random() - 0.5);

            fillClones.forEach((clone, i) => {
              const delay = order.indexOf(i) * spread;
              // Gentle dim
              tl.to(clone, { opacity: 0.1, duration: 0.4, ease: 'power3.in' }, delay);
              // Soft pop back
              tl.to(clone, { opacity: 1, duration: 0.6, ease: 'back.out(1.4)' }, delay + 0.4);
            });

            activeTl = tl;
          });
          break;
        }
        case 'ghost': {
          // Start at ghost color, animate to full on hover, return to ghost on leave
          const getGhostColor = () => toHex(
            getComputedStyle(el).getPropertyValue('--svg-ghost-color').trim()
            || getComputedStyle(document.documentElement).getPropertyValue('--neutral-tint').trim()
            || '#ccc'
          );
          fillClones.forEach(c => gsap.set(c, { opacity: 1, scale: 1, fill: getGhostColor() }));
          if (showOutline) {
            origPaths.forEach(p => { (p as HTMLElement).style.stroke = getGhostColor(); });
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
            const ghost = getGhostColor();
            fillClones.forEach(c => {
              activeTl!.to(c, { fill: ghost, duration: combinedDuration * 0.6, ease: 'power2.in' }, 0);
            });
            if (showOutline) {
              origPaths.forEach(p => {
                activeTl!.to(p, { stroke: ghost, duration: combinedDuration * 0.6, ease: 'power2.in' }, 0);
              });
            }
          };
          hoverTarget.addEventListener('mouseenter', ghostEnter);
          hoverTarget.addEventListener('mouseleave', ghostLeave);
          hoverTarget.addEventListener('focusin', ghostEnter);
          hoverTarget.addEventListener('focusout', ghostLeave);
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
          hoverTarget.addEventListener('mouseenter', doFill);
          hoverTarget.addEventListener('focusin', doFill);
          break;
        }
      }
      break;
    }
  }
}

/* ================================================================
   ANIMATED GRADIENT — GSAP-driven SVG gradient animation
   Injects a local linearGradient, animates rotation + optional
   rainbow color cycling through stops.
   ================================================================ */

function initAnimatedGradient(el: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;
  if (getMotionMode() === 'none') return;

  const dur = parseFloat(el.dataset.iconGradDur || '') || 8;
  const ease = el.dataset.iconGradEase || 'none';
  const direction = el.dataset.iconGradDir || 'cw'; // cw | ccw | sway
  const doScale = el.dataset.iconGradScale === 'true';
  const gentle = getMotionMode() === 'gentle';
  const d = gentle ? dur * 2 : dur;

  const ns = 'http://www.w3.org/2000/svg';

  // Find gradient reference — check style attribute (raw HTML) and computed style
  let sharedGradId = '';
  const gradTargets: Element[] = [];
  const allEls = svg.querySelectorAll('g, path, circle, rect, polygon, polyline, ellipse');
  allEls.forEach(child => {
    // Check raw style attribute (Astro sets inline style)
    const rawStyle = child.getAttribute('style') || '';
    const fillAttr = child.getAttribute('fill') || '';
    const combined = rawStyle + ' ' + fillAttr;
    const match = combined.match(/url\(\s*#(grad-[^)"\s]+)\s*\)/);
    if (match) {
      sharedGradId = match[1];
      gradTargets.push(child);
    }
  });
  if (!sharedGradId || !gradTargets.length) return;

  // Create local gradient with GSAP control
  const localId = `anim-grad-${Math.random().toString(36).substring(2, 9)}`;
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS(ns, 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }

  // Remove any existing animateTransform (we're replacing with GSAP)
  svg.querySelectorAll('animateTransform').forEach(at => at.remove());

  const grad = document.createElementNS(ns, 'linearGradient');
  grad.id = localId;
  grad.setAttribute('data-shared-grad', sharedGradId);
  grad.setAttribute('gradientUnits', 'objectBoundingBox');
  grad.setAttribute('x1', '0');
  grad.setAttribute('y1', '0');
  grad.setAttribute('x2', '1');
  grad.setAttribute('y2', '1');
  grad.setAttribute('gradientTransform', 'rotate(0, 0.5, 0.5)');
  // Copy stops from shared gradient
  const sharedGrad = document.getElementById(sharedGradId);
  if (sharedGrad) {
    sharedGrad.querySelectorAll('stop').forEach(s => {
      grad.appendChild(s.cloneNode(true));
    });
  }
  defs.appendChild(grad);

  // Point all gradient targets + their children at the local gradient
  const gradUrl = `url(#${localId})`;
  gradTargets.forEach(p => {
    const htmlEl = p as HTMLElement;
    if (htmlEl.style?.fill) {
      htmlEl.style.fill = gradUrl;
      if (htmlEl.style.stroke && htmlEl.style.stroke.includes('url(#grad-')) {
        htmlEl.style.stroke = gradUrl;
      }
    } else {
      p.setAttribute('fill', gradUrl);
    }
    // Also apply to children — respect outline variant (stroke only, no fill)
    const isOutline = el.classList.contains('shape--outline');
    p.querySelectorAll('path, circle, rect, polygon, polyline, ellipse').forEach(child => {
      if (isOutline) {
        (child as HTMLElement).style.fill = 'none';
        (child as HTMLElement).style.stroke = gradUrl;
      } else {
        (child as HTMLElement).style.fill = gradUrl;
      }
    });
  });

  animateGradTransform(grad, d, direction, ease, doScale);
}

function animateGradTransform(
  grad: SVGLinearGradientElement,
  d: number,
  direction: string,
  ease: string,
  doScale: boolean
) {
  const state = { angle: 0, scale: 1 };

  const update = () => {
    let t = `rotate(${state.angle}, 0.5, 0.5)`;
    if (doScale) {
      t += ` translate(0.5, 0.5) scale(${state.scale}) translate(-0.5, -0.5)`;
    }
    grad.setAttribute('gradientTransform', t);
  };

  if (direction === 'sway') {
    gsap.fromTo(state,
      { angle: -60 },
      { angle: 60, duration: d / 2, ease: ease === 'none' ? 'sine.inOut' : ease,
        yoyo: true, repeat: -1, onUpdate: update });
  } else {
    const target = direction === 'ccw' ? -360 : 360;
    gsap.to(state, {
      angle: `+=${target}`,
      duration: d,
      ease: ease === 'none' ? 'none' : ease,
      repeat: -1,
      onUpdate: update,
    });
  }

  if (doScale) {
    gsap.fromTo(state,
      { scale: 0.8 },
      { scale: 1.5, duration: d * 0.75, ease: 'sine.inOut',
        yoyo: true, repeat: -1, onUpdate: update });
  }
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
  document.querySelectorAll<HTMLElement>('[data-icon-fill]').forEach(initFillIcon);
  document.querySelectorAll<HTMLElement>('[data-icon-grad-anim]').forEach(initAnimatedGradient);
}

// Clear inline colours on theme change so CSS tokens take over
function onThemeChange() {
  // Draw overlays: clear inline stroke
  document.querySelectorAll('.icon-draw-overlay, .icon-draw-worm, .icon-draw-trail, .icon-draw-chase').forEach(el => {
    (el as HTMLElement).style.removeProperty('stroke');
  });

  // Fill clones: re-read color from parent's CSS token
  document.querySelectorAll('.icon-fill-morph').forEach(clone => {
    const parent = (clone as HTMLElement).closest('.shape, .icon') as HTMLElement;
    if (!parent) return;
    const ctx = document.createElement('canvas').getContext('2d')!;
    const raw = getComputedStyle(parent).getPropertyValue('--_color').trim() || getComputedStyle(parent).color;
    ctx.fillStyle = raw;
    (clone as HTMLElement).style.fill = ctx.fillStyle;
  });

  // Draw overlays on shapes: clear inline fill too
  document.querySelectorAll('.shape--draw svg path:not(.icon-draw-overlay)').forEach(el => {
    (el as HTMLElement).style.removeProperty('fill');
  });

  // Rainbow scroll: rebuild timelines with fresh colors
  rainbowScrollElements.forEach(r => r.rebuild());

  // Animated gradients: re-copy stops from shared defs
  document.querySelectorAll('linearGradient[data-shared-grad]').forEach(localGrad => {
    const sharedId = localGrad.getAttribute('data-shared-grad');
    if (!sharedId) return;
    const sharedGrad = document.getElementById(sharedId);
    if (!sharedGrad) return;
    localGrad.querySelectorAll('stop').forEach(s => s.remove());
    sharedGrad.querySelectorAll('stop').forEach(s => {
      localGrad.appendChild(s.cloneNode(true));
    });
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', initIconAnimations);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIconAnimations);
  } else {
    initIconAnimations();
  }

  // Listen for ThemeSwitcher's custom event — single source of truth for theme changes
  window.addEventListener('themeChanged', onThemeChange);
  // Fallback: MutationObserver for any direct attribute changes
  const observer = new MutationObserver(onThemeChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode', 'data-theme-chroma', 'class'] });
}
