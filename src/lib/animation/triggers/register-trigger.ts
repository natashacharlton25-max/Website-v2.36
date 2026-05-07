/**
 * Trigger Helper — central registration for hover/focus/click/viewport/
 * scrub/loop/interval/autoplay animations. Every animation entry point
 * goes through this so motion+hover+render gates apply uniformly.
 *
 * Reduced mode override: all triggers funnel into a viewport stagger
 * queue per section — animations play one at a time at gentle speed,
 * 3s after the section enters the viewport.
 *
 * Re-trigger guard: if a caller returns its timeline from onEnter,
 * subsequent triggers while the timeline is active are ignored — every
 * animation plays through to completion before the next can fire.
 */
import { getAnimationConfig } from '../gates/animation-config';
import { getExplainerTriggerRemap } from '../gates/explainer';
import { getScrollContainer } from '../helpers/scroll';

export interface TriggerOptions {
  /** The element that triggers the animation */
  el: HTMLElement;
  /** What fires it: hover, click, focus, viewport, viewport-loop, loop, interval, scrub, autoplay */
  trigger?: string;
  /** Called to play the animation forward — return timeline so the trigger can guard against re-trigger while it's still active */
  onEnter: () => any;
  /** Called to play the animation in reverse (optional — for yoyo/hover-leave). Return a timeline for re-trigger protection */
  onLeave?: () => any;
  /** Called for instant mode — jump to end state (optional, defaults to onEnter) */
  onInstant?: () => void;
  /** Called when motion is 'none' — set static fallback state */
  onStatic?: () => void;
  /** ScrollTrigger start position (default 'top 60%') */
  scrollStart?: string;
  /** ScrollTrigger end position (default 'top 20%') */
  scrollEnd?: string;
  /** Fire only once on viewport enter */
  once?: boolean;
  /** Loop delay in seconds (default 3) */
  loopDelay?: number;
  /** Interval in ms (default 8000) */
  intervalMs?: number;
}

// ================================================================
// REDUCED MODE — viewport stagger queue
// ================================================================

/**
 * Per-section animation queue for reduced mode.
 * All animations in a section play one at a time, sequentially,
 * with a 3s initial delay when the section enters the viewport.
 */
const sectionQueues = new Map<Element, { entries: Array<() => any>; started: boolean }>();

function getSection(el: HTMLElement): Element | null {
  return el.closest('.section-atom, section, [class*="section"]');
}

function queueReducedAnimation(el: HTMLElement, onEnter: () => any) {
  const section = getSection(el) || document.body;
  if (!sectionQueues.has(section)) {
    sectionQueues.set(section, { entries: [], started: false });
  }
  const queue = sectionQueues.get(section)!;
  queue.entries.push(onEnter);

  // Set up viewport trigger for the section (once)
  if (!queue.started) {
    queue.started = true;
    const scroller = getScrollContainer();
    import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
      ST.create({
        trigger: section as HTMLElement,
        scroller: scroller || undefined,
        start: 'top 60%',
        once: true,
        onEnter: () => {
          // 3s initial delay, then play queue sequentially
          import('gsap').then(({ gsap }) => {
            gsap.delayedCall(3, () => playQueue(queue.entries));
          });
        },
      });
    });
  }
}

function playQueue(entries: Array<() => any>, index = 0) {
  if (index >= entries.length) return;
  const tl = entries[index]();
  if (tl?.eventCallback) {
    tl.eventCallback('onComplete', () => {
      import('gsap').then(({ gsap }) => {
        gsap.delayedCall(0.5, () => playQueue(entries, index + 1));
      });
    });
  } else {
    // No timeline returned, move to next after a brief pause
    import('gsap').then(({ gsap }) => {
      gsap.delayedCall(1.5, () => playQueue(entries, index + 1));
    });
  }
}

// ================================================================

/**
 * Register animation triggers — centralises hover/focus/click/viewport logic.
 * Respects motion and hover modes automatically.
 *
 * Reduced mode: all triggers override to viewport stagger queue —
 * animations play one at a time per section at gentle speed.
 */
export function registerTrigger(opts: TriggerOptions): void {
  const {
    el, trigger = 'hover', onEnter, onLeave, onInstant, onStatic,
    scrollStart = 'top 60%', scrollEnd = 'top 20%',
    once = false, loopDelay = 3, intervalMs = 8000,
  } = opts;

  const scroller = getScrollContainer();
  const config = getAnimationConfig();

  // Static fallback when motion is none
  if (!config.canAnimate && onStatic) {
    onStatic();
  }

  // Reduced mode: queue all animations for viewport stagger
  if (config.isReduced) {
    queueReducedAnimation(el, onEnter);
    return;
  }

  // ────────────────────────────────────────────────────────────
  // Re-trigger guard: every animation registered through this helper
  // tracks its currently-active timeline. Any new trigger attempt while
  // that timeline is still running is IGNORED — animations always play
  // through to completion before the next one can fire.
  //
  // For this to work, callers should return their timeline from onEnter
  // (and onLeave). Calls that don't return a timeline aren't guarded
  // (the helper has no way to know when they're done).
  // ────────────────────────────────────────────────────────────
  let activeTl: any = null;
  const isActive = () => activeTl?.isActive?.() === true;

  const guardedEnter = (): any => {
    if (isActive()) return null;
    const result = onEnter();
    if (result?.isActive) activeTl = result;
    return result;
  };
  const guardedLeave = onLeave ? (): any => {
    if (isActive()) return null;
    const result = onLeave();
    if (result?.isActive) activeTl = result;
    return result;
  } : undefined;

  // ────────────────────────────────────────────────────────────
  // Explainer mode: only HOVER triggers remap to click when an explainer
  // tooltip/overlay/subtitle is active on this element.
  // Hover → shows explainer (figcaption). Click → plays animation.
  // hover:none → click once = explainer, click again = animation.
  // Non-hover triggers (viewport / autoplay / loop / interval) fall
  // through to the switch below and run as normal — they don't conflict
  // with the explainer being on hover.
  // ────────────────────────────────────────────────────────────
  const explainerRemap = getExplainerTriggerRemap();
  if (explainerRemap && trigger === 'hover' && el.hasAttribute('data-has-explainer')) {
    if (!config.canAnimate && onStatic) onStatic();

    const hoverTarget = el.closest('button, a') || el;
    let explainerShown = false;

    hoverTarget.addEventListener('click', () => {
      const cfg = getAnimationConfig();
      if (!cfg.canAnimate) return;

      if (cfg.canHover) {
        // Hover available: click always plays animation
        guardedEnter();
      } else {
        // Hover:none — click once = explainer, click again = animation
        if (!explainerShown) {
          explainerShown = true;
        } else {
          guardedEnter();
          explainerShown = false;
        }
      }
    });

    hoverTarget.addEventListener('keydown', (e: Event) => {
      const key = (e as KeyboardEvent).key;
      const cfg = getAnimationConfig();
      if (!cfg.canAnimate) return;

      if (key === 'Escape') {
        explainerShown = false;
      } else if (key === 'Enter') {
        if (!explainerShown) {
          explainerShown = true;
        } else {
          guardedEnter();
          explainerShown = false;
        }
      }
    });

    if (guardedLeave) {
      hoverTarget.addEventListener('mouseleave', () => {
        if (!getAnimationConfig().canAnimate) return;
        guardedLeave();
      });
      hoverTarget.addEventListener('focusout', () => {
        guardedLeave();
        explainerShown = false;
      });
    }
    return; // Don't fall through to normal trigger registration
  }

  switch (trigger) {
    case 'viewport': {
      if (!getAnimationConfig().canAnimate) { onStatic?.(); return; }
      import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
        ST.create({
          trigger: el,
          scroller: scroller || undefined,
          start: scrollStart,
          once,
          onEnter: () => { if (getAnimationConfig().canAnimate) guardedEnter(); },
          onLeaveBack: guardedLeave ? () => { if (getAnimationConfig().canAnimate) guardedLeave(); } : undefined,
        });
      });
      break;
    }
    case 'viewport-loop': {
      if (!getAnimationConfig().canAnimate) return;
      import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
        ST.create({
          trigger: el,
          scroller: scroller || undefined,
          start: scrollStart,
          onEnter: () => {
            // Loop play uses onEnter directly (not guarded) — looping needs
            // the next iteration to run after the previous completes, and
            // the onComplete callback handles its own scheduling.
            const loopPlay = () => {
              const tl = onEnter();
              activeTl = tl;
              if (tl?.eventCallback) tl.eventCallback('onComplete', () => {
                import('gsap').then(({ gsap }) => gsap.delayedCall(loopDelay, loopPlay));
              });
            };
            loopPlay();
          },
          onLeave: guardedLeave,
          onEnterBack: () => {
            const loopPlay = () => {
              const tl = onEnter();
              activeTl = tl;
              if (tl?.eventCallback) tl.eventCallback('onComplete', () => {
                import('gsap').then(({ gsap }) => gsap.delayedCall(loopDelay, loopPlay));
              });
            };
            loopPlay();
          },
          onLeaveBack: guardedLeave,
        });
      });
      break;
    }
    case 'scrub': {
      // Scrub: caller builds their own ScrollTrigger timeline
      break;
    }
    case 'autoplay': {
      if (getAnimationConfig().canAnimate) guardedEnter();
      break;
    }
    case 'loop': {
      // Loop runs the user's onEnter directly (not guarded) — onComplete
      // schedules the next iteration after the previous one finishes, so
      // there's no overlap to guard against.
      const loopPlay = () => {
        if (!getAnimationConfig().canAnimate) return;
        const tl = onEnter();
        activeTl = tl;
        if (tl?.eventCallback) tl.eventCallback('onComplete', () => {
          import('gsap').then(({ gsap }) => gsap.delayedCall(loopDelay, loopPlay));
        });
      };
      loopPlay();
      break;
    }
    case 'interval': {
      guardedEnter();
      setInterval(() => { if (getAnimationConfig().canAnimate) guardedEnter(); }, intervalMs);
      break;
    }
    case 'click': {
      const clickTarget = el.closest('button, a') || el;
      clickTarget.addEventListener('click', () => {
        if (getAnimationConfig().canAnimate) guardedEnter();
      });
      break;
    }
    case 'focus': {
      el.addEventListener('focusin', () => {
        if (getAnimationConfig().canAnimate) guardedEnter();
      });
      if (guardedLeave) el.addEventListener('focusout', () => guardedLeave());
      break;
    }
    case 'hover':
    default: {
      // Normal hover (explainer remap handled above for all triggers)
      const hoverTarget = el.closest('button, a') || el;
      const triggerEnter = (e: Event) => {
        const config = getAnimationConfig();
        if (!config.canAnimate) return;
        if (!config.canHover && e.type === 'mouseenter') return;
        if (config.hover === 'instant') {
          if (onInstant) { onInstant(); return; }
          const tl = onEnter();
          if (tl?.progress) tl.progress(1);
          activeTl = tl;
          return;
        }
        guardedEnter();
      };

      // Static fallback
      if (!getAnimationConfig().canAnimate && onStatic) onStatic();

      hoverTarget.addEventListener('mouseenter', triggerEnter);
      hoverTarget.addEventListener('focusin', triggerEnter);
      hoverTarget.addEventListener('click', triggerEnter);

      if (guardedLeave) {
        hoverTarget.addEventListener('mouseleave', () => {
          if (!getAnimationConfig().canAnimate) return;
          guardedLeave();
        });
        hoverTarget.addEventListener('focusout', () => guardedLeave());
      }
      break;
    }
  }
}
