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
  const wrapper = document.querySelector('#a11y-content-wrapper');
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    wrapper?.classList.contains('a11y-reduce-motion') === true ||
    wrapper?.classList.contains('a11y-text-only') === true;
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
  /** Base duration multiplier: 1 for full, 2 for gentle */
  durationScale: number;
  /** Computed duration: baseDuration * durationScale */
  duration: (baseDuration?: number) => number;
}

/**
 * Get current animation config — call at animation trigger time (not init)
 * so it picks up theme/mode changes.
 */
export function getAnimationConfig(): AnimationConfig {
  const motion = getMotionMode();
  const hover = getHoverMode();
  const render = getRenderMode();
  const gentle = motion === 'gentle' || hover === 'gentle';
  const durationScale = gentle ? 2 : 1;

  return {
    motion,
    hover,
    render,
    canAnimate: motion !== 'none' && render !== 'textonly',
    canHover: hover !== 'none',
    durationScale,
    duration: (base = 2) => base * durationScale,
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
  /** What fires it: hover, click, focus, viewport, viewport-loop, scrub, autoplay */
  trigger?: string;
  /** Called to play the animation forward */
  onEnter: () => void;
  /** Called to play the animation in reverse (optional — for yoyo/hover-leave) */
  onLeave?: () => void;
  /** ScrollTrigger start position (default 'top 60%') */
  scrollStart?: string;
  /** ScrollTrigger end position (default 'top 20%') */
  scrollEnd?: string;
  /** Fire only once on viewport enter */
  once?: boolean;
}

/**
 * Register animation triggers — centralises hover/focus/click/viewport logic.
 * Respects motion and hover modes automatically.
 */
export function registerTrigger(opts: TriggerOptions): void {
  const { el, trigger = 'hover', onEnter, onLeave, scrollStart = 'top 60%', scrollEnd = 'top 20%', once = false } = opts;

  // Lazy import ScrollTrigger to avoid circular deps
  const gsapModule = (window as any).gsap;
  const ScrollTrigger = gsapModule?.plugins?.scrollTrigger || (window as any).ScrollTrigger;

  switch (trigger) {
    case 'viewport': {
      const config = getAnimationConfig();
      if (!config.canAnimate) return;
      const scroller = getScrollContainer();

      // Dynamic import not needed — ScrollTrigger already registered by icon-animation
      import('gsap/ScrollTrigger').then(({ ScrollTrigger: ST }) => {
        ST.create({
          trigger: el,
          scroller: scroller || undefined,
          start: scrollStart,
          once,
          onEnter: () => { if (getAnimationConfig().canAnimate) onEnter(); },
          onLeaveBack: onLeave ? () => { if (getAnimationConfig().canAnimate) onLeave(); } : undefined,
        });
      });
      break;
    }
    case 'scrub': {
      // Scrub is handled by the caller — they build their own ScrollTrigger timeline
      // This case is a no-op placeholder
      break;
    }
    case 'autoplay': {
      if (getAnimationConfig().canAnimate) onEnter();
      break;
    }
    case 'click': {
      const clickTarget = el.closest('button, a') || el;
      clickTarget.addEventListener('click', () => {
        if (getAnimationConfig().canAnimate) onEnter();
      });
      break;
    }
    case 'focus': {
      el.addEventListener('focusin', () => {
        if (getAnimationConfig().canAnimate) onEnter();
      });
      if (onLeave) {
        el.addEventListener('focusout', () => onLeave());
      }
      break;
    }
    case 'hover':
    default: {
      const hoverTarget = el.closest('button, a') || el;

      // Hover
      hoverTarget.addEventListener('mouseenter', (e: Event) => {
        const config = getAnimationConfig();
        if (!config.canAnimate) return;
        if (!config.canHover && e.type === 'mouseenter') return;
        if (config.hover === 'instant') {
          // Jump to end state
          onEnter();
          return;
        }
        onEnter();
      });

      if (onLeave) {
        hoverTarget.addEventListener('mouseleave', () => {
          const config = getAnimationConfig();
          if (!config.canAnimate) return;
          onLeave();
        });
      }

      // Focus (always works, even when hover is off — a11y)
      hoverTarget.addEventListener('focusin', () => {
        if (getAnimationConfig().canAnimate) onEnter();
      });
      if (onLeave) {
        hoverTarget.addEventListener('focusout', () => onLeave());
      }

      // Click (always works)
      hoverTarget.addEventListener('click', () => {
        if (getAnimationConfig().canAnimate) onEnter();
      });
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
