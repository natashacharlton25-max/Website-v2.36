/**
 * Animated gradient for Icon and Shape atoms
 *
 * Reads `data-icon-grad-anim` + related data attributes and replaces a
 * shared SVG gradient reference with a local clone whose gradientTransform
 * is animated by GSAP. Allows continuous rotation (cw/ccw), sway, and
 * optional scale pulsing — all driven through SVG attribute updates.
 *
 * Also exports `gateAnimatedGradients` which strips/slows static
 * `<animateTransform>` elements based on motion mode (used by index.ts at
 * init time so legacy declarative animations respect calm mode).
 */

import { gsap } from 'gsap';
import { getMotionMode, registerTrigger, GRADIENT_ANIMATION_SPEED } from '../animation-config';

export function initAnimatedGradient(el: HTMLElement) {
  const svg = el.querySelector('svg');
  if (!svg) return;
  if (getMotionMode() === 'none') return;

  // Default duration matches the schema's gradientAnimateSpeed='default' tier.
  // Atom only emits data-icon-grad-dur when speed is non-default, so the fallback
  // must agree with the schema or schema/runtime will drift.
  const dur = parseFloat(el.dataset.iconGradDur || '') || GRADIENT_ANIMATION_SPEED.default;
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

  // Route through registerTrigger — in reduced mode this queues for viewport stagger
  registerTrigger({
    el,
    animationTrigger: 'autoplay',
    onEnter: () => {
      animateGradTransform(grad, d, direction, ease, doScale);
      return null; // gradient loops don't return a timeline
    },
    onStatic: () => {}, // gradient at rest is already visible
  });
}

function animateGradTransform(
  grad: SVGLinearGradientElement | SVGRadialGradientElement,
  d: number,
  direction: string,
  ease: string,
  doScale: boolean
) {
  const isRadial = grad.tagName === 'radialGradient';
  const state = { angle: 0, offset: 0, scale: 1 };
  // Random phase offset so multiple animated gradients don't sync-lock.
  const phase = Math.random();

  const update = () => {
    let t = '';
    if (isRadial) {
      // Radial: rotate around centre
      t = `rotate(${state.angle}, 0.5, 0.5)`;
    } else {
      // Linear: translate side-to-side (matches CSS background-position flow)
      t = `translate(${state.offset}, 0)`;
    }
    if (doScale) {
      t += ` translate(0.5, 0.5) scale(${state.scale}) translate(-0.5, -0.5)`;
    }
    grad.setAttribute('gradientTransform', t);
  };

  let mainTween: gsap.core.Tween;
  if (direction === 'sway') {
    if (isRadial) {
      mainTween = gsap.fromTo(state,
        { angle: -60 },
        { angle: 60, duration: d / 2, ease: ease === 'none' ? 'sine.inOut' : ease,
          yoyo: true, repeat: -1, onUpdate: update });
    } else {
      mainTween = gsap.fromTo(state,
        { offset: -0.3 },
        { offset: 0.3, duration: d / 2, ease: ease === 'none' ? 'sine.inOut' : ease,
          yoyo: true, repeat: -1, onUpdate: update });
    }
  } else {
    if (isRadial) {
      const target = direction === 'ccw' ? -360 : 360;
      mainTween = gsap.to(state, {
        angle: `+=${target}`,
        duration: d,
        ease: ease === 'none' ? 'none' : ease,
        repeat: -1,
        onUpdate: update,
      });
    } else {
      // Linear flow: side-to-side yoyo (matches CSS background-position 0% → 100% → 0%)
      const target = direction === 'ccw' ? -0.5 : 0.5;
      mainTween = gsap.fromTo(state,
        { offset: -target },
        { offset: target, duration: d / 2, ease: ease === 'none' ? 'sine.inOut' : ease,
          yoyo: true, repeat: -1, onUpdate: update });
    }
  }
  // Jump to a random phase so multiple gradients on the page don't animate in lockstep
  mainTween.progress(phase);

  if (doScale) {
    const scaleTween = gsap.fromTo(state,
      { scale: 0.8 },
      { scale: 1.5, duration: d * 0.75, ease: 'sine.inOut',
        yoyo: true, repeat: -1, onUpdate: update });
    scaleTween.progress(Math.random());
  }
}

/**
 * Strip / slow down static <animateTransform> elements on icons based on
 * motion mode. Called once at init from index.ts before any GSAP gradient
 * animation runs.
 */
export function gateAnimatedGradients() {
  const motion = getMotionMode();
  // Both Icon and Shape can ship declarative <animateTransform> elements
  // (legacy SVGs from the asset pipeline). Match both so motion gating is
  // consistent with the rest of svg-animation/.
  document.querySelectorAll<SVGAnimateTransformElement>('.icon svg animateTransform, .shape svg animateTransform').forEach(el => {
    if (motion === 'none') {
      el.remove();
    } else if (motion === 'gentle') {
      el.setAttribute('dur', '16s');
    }
  });
}
