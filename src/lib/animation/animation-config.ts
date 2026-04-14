/**
 * Animation Config — single source of truth for all animation settings.
 *
 * Every animation (GSAP, CSS, scroll) reads from here instead of
 * doing its own data-attribute checks. Centralises:
 * - Motion mode (full / gentle / none)
 * - Hover mode (full / gentle / instant / none)
 * - Render mode (full / reduced / assistive / textonly)
 * - Duration scaling
 * - Reduced motion detection
 * - Trigger registration (hover/focus/click/viewport/scroll)
 */

// ================================================================
// MODE READERS
// ================================================================

export type MotionMode = 'full' | 'gentle' | 'none';
export type HoverMode = 'full' | 'gentle' | 'instant' | 'none';
export type RenderMode = 'full' | 'reduced' | 'assistive' | 'textonly';

export function getMotionMode(): MotionMode {
  const val = document.documentElement.getAttribute('data-motion') || '';
  if (val === 'none') return 'none';
  if (val === 'gentle') return 'gentle';
  return 'full';
}

export function getHoverMode(): HoverMode {
  const val = document.documentElement.getAttribute('data-hover') || '';
  if (val === 'none') return 'none';
  if (val === 'instant') return 'instant';
  if (val === 'gentle') return 'gentle';
  return 'full';
}

export function getRenderMode(): RenderMode {
  const val = document.documentElement.getAttribute('data-render') || '';
  if (val === 'reduced' || val === 'calm') return 'reduced';
  if (val === 'assistive' || val === 'easy-click') return 'assistive';
  if (val === 'textonly' || val === 'reading') return 'textonly';
  return 'full';
}

export function prefersReducedMotion(): boolean {
  // Only check OS-level preference — app's reduced mode is handled
  // by isReduced in getAnimationConfig() (viewport stagger queue)
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ================================================================
// ANIMATION CONFIG
// ================================================================

export interface AnimationConfig {
  motion: MotionMode;
  hover: HoverMode;
  render: RenderMode;
  /** Whether any animation should play */
  canAnimate: boolean;
  /** Whether hover animations should fire on mouseenter */
  canHover: boolean;
  /** Whether hover should be instant (jump to end state) */
  isInstant: boolean;
  /** Whether animation/hover should be slowed down */
  isGentle: boolean;
  /** Reduced mode — viewport stagger queue, gentle speed, no hover triggers */
  isReduced: boolean;
  /** Base duration multiplier: 1 for full, 2 for gentle */
  durationScale: number;
  /** Hover duration multiplier: 0 for instant, 1 for full, 2 for gentle */
  hoverDurationScale: number;
  /** Computed duration: baseDuration * durationScale */
  duration: (baseDuration?: number) => number;
  /** Computed hover duration: baseDuration * hoverDurationScale */
  hoverDuration: (baseDuration?: number) => number;
}

/**
 * Get current animation config — call at animation trigger time (not init)
 * so it picks up theme/mode changes.
 *
 * Hover modes:
 *   full    — normal speed hover transitions
 *   gentle  — 2x slower hover transitions
 *   instant — jump to end state, no transition
 *   none    — no hover response (focus/click still work)
 *
 * Motion modes:
 *   full    — normal speed animations
 *   gentle  — 2x slower animations
 *   none    — no animations at all
 */
export function getAnimationConfig(): AnimationConfig {
  const motion = getMotionMode();
  const hover = getHoverMode();
  const render = getRenderMode();
  const isReduced = render === 'reduced';
  // Reduced mode forces gentle speed
  const isGentle = isReduced || motion === 'gentle' || hover === 'gentle';
  const durationScale = isReduced ? 2 : motion === 'gentle' ? 2 : 1;
  const hoverDurationScale = hover === 'instant' ? 0 : (isReduced || hover === 'gentle') ? 2 : 1;

  return {
    motion,
    hover,
    render,
    canAnimate: motion !== 'none' && render !== 'textonly',
    canHover: hover !== 'none' && !isReduced,
    isInstant: hover === 'instant',
    isGentle,
    isReduced,
    durationScale,
    hoverDurationScale,
    duration: (base = 2) => base * durationScale,
    hoverDuration: (base = 0.3) => base * hoverDurationScale,
  };
}

// ================================================================
// COLOR HELPERS
// ================================================================

/** Convert any CSS color (oklch, lab, etc.) to hex for SVG compatibility */
export function toHex(cssColor: string): string {
  const ctx = document.createElement('canvas').getContext('2d')!;
  ctx.fillStyle = cssColor;
  return ctx.fillStyle;
}

/** Read the current --_color from an element, converted to hex */
export function getElementColor(el: HTMLElement): string {
  const cs = getComputedStyle(el);
  const raw = cs.getPropertyValue('--_color').trim() || cs.color || '#c4907c';
  return toHex(raw);
}

/** Read the ghost color token */
export function getGhostColor(el?: HTMLElement): string {
  const target = el || document.documentElement;
  return toHex(
    getComputedStyle(target).getPropertyValue('--svg-ghost-color').trim()
    || getComputedStyle(document.documentElement).getPropertyValue('--neutral-tint').trim()
    || '#ccc'
  );
}

// ================================================================
// STATIC FALLBACK RULES (when motion is none)
// ================================================================

/**
 * When motion is 'none', animations don't play. Elements need to show
 * their resting/end state immediately. These rules define what that looks like.
 */
export interface StaticFallback {
  /** Show element at full opacity */
  visible: () => void;
  /** Show stroked outline at 100% */
  stroked: (el: SVGElement) => void;
  /** Show filled shape at full opacity */
  filled: (el: SVGElement) => void;
}

export function applyStaticFallback(el: HTMLElement, type: 'draw' | 'fill' | 'morph' | 'gradient'): void {
  const svg = el.querySelector('svg');
  if (!svg) return;

  switch (type) {
    case 'draw': {
      // Show overlays at full draw, full opacity
      svg.querySelectorAll('.icon-draw-overlay').forEach(o => {
        const s = (o as HTMLElement).style;
        s.opacity = '1';
        // drawSVG can't be set via style — GSAP handles it
      });
      break;
    }
    case 'fill': {
      // Show fill clones at full scale + opacity
      svg.querySelectorAll('.icon-fill-morph').forEach(c => {
        const s = (c as HTMLElement).style;
        s.opacity = '1';
        s.transform = 'scale(1)';
      });
      break;
    }
    case 'morph': {
      // Show original shape (no morph needed)
      break;
    }
    case 'gradient': {
      // Show static gradient (no animation)
      break;
    }
  }
}

// ================================================================
// EXPLAINER GATE
// ================================================================

/**
 * Check if the animation explainer is in "inline" mode (replaces animation).
 * In inline mode, animated non-UI elements show static explainer cards instead.
 * Other modes (subtitle/overlay/tooltip) keep the animation playing.
 */
export function isExplainerInline(): boolean {
  return document.documentElement.dataset.animExplainer === 'inline';
}

/**
 * Check if a specific element should skip animation because the explainer
 * replaces it. True when: inline mode is on AND the element is non-UI
 * (has an adjacent .anim-explainer sibling).
 */
export function isExplainerGated(el: HTMLElement): boolean {
  if (!isExplainerInline()) return false;
  return !!el.nextElementSibling?.classList.contains('anim-explainer');
}

/**
 * When explainer is tooltip/overlay, hover triggers should be remapped
 * to click so hover is free for showing explainer cards.
 * Returns 'click' if remapping needed, null otherwise.
 */
export function getExplainerTriggerRemap(): 'click' | null {
  const mode = document.documentElement.dataset.animExplainer;
  if (mode === 'tooltip' || mode === 'subtitle') return 'click';
  // Enlarge: hover plays animation normally, click opens modal (handled by anim-explainer.ts)
  return null;
}

// ================================================================
// SCROLL CONTAINER
// ================================================================

/** Get the OverlayScrollbars viewport if present */
export function getScrollContainer(): HTMLElement | undefined {
  return document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]') || undefined;
}

// ================================================================
// TRIGGER HELPER
// ================================================================

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
  // Explainer mode: ALL triggers remap to click when explainer
  // tooltip/overlay/subtitle is active on this element.
  // Hover → shows explainer (figcaption). Click → plays animation.
  // hover:none → click once = explainer, click again = animation.
  // ────────────────────────────────────────────────────────────
  const explainerRemap = getExplainerTriggerRemap();
  if (explainerRemap && el.hasAttribute('data-has-explainer')) {
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

// ================================================================
// THEME CHANGE LISTENER
// ================================================================

type ThemeChangeCallback = () => void;
const themeChangeCallbacks: ThemeChangeCallback[] = [];

/** Register a callback to run on theme change */
export function onThemeChange(cb: ThemeChangeCallback): void {
  themeChangeCallbacks.push(cb);
}

/** Fire all theme change callbacks */
function fireThemeChange(): void {
  themeChangeCallbacks.forEach(cb => cb());
}

// Listen for ThemeSwitcher event + debounced MutationObserver fallback
if (typeof document !== 'undefined') {
  window.addEventListener('themeChanged', fireThemeChange);
  // MutationObserver: debounce to avoid premature firing during page load
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const debouncedFire = () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fireThemeChange, 100);
  };
  const observer = new MutationObserver(debouncedFire);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-mode', 'data-theme-chroma', 'data-motion', 'data-hover', 'data-render']
  });
}
