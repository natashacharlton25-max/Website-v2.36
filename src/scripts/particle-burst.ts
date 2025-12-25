/**
 * Unified Particle Burst System
 * Creates burst effects from element center using Web Animations API
 *
 * Consolidates svg-particle-burst.ts and particle-effects.ts
 *
 * Usage:
 *   - Add data-particle-burst to any element
 *   - Configure via data attributes:
 *     data-particle-type="hearts|confetti|circle|star|mixed" (default: confetti)
 *     data-particle-trigger="click|hover" (default: click)
 *     data-particle-count="30" (default: 30)
 *     data-particle-spread="150" (default: 150)
 *     data-particle-emojis="❤,💛,💚" (comma-separated)
 *
 * Or import and call directly:
 *   import { createParticleBurst, fireConfetti, fireHearts } from './particle-burst';
 *   fireConfetti(element);
 */

export type ParticleType = 'confetti' | 'hearts' | 'circle' | 'square' | 'star' | 'mixed' | 'emoji';

export interface ParticleBurstOptions {
  type?: ParticleType;
  colors?: string[];
  particleCount?: number;
  spread?: number;
  sizeRange?: { min: number; max: number };
  duration?: { min: number; max: number };
  emojis?: string[];
  trigger?: 'click' | 'hover';
}

// Get CSS token values from computed styles
function getCSSColors(): string[] {
  if (typeof window === 'undefined') return [];

  const root = document.documentElement;
  const styles = getComputedStyle(root);

  // Try confetti-specific tokens first, then particle tokens, then fallbacks
  return [
    styles.getPropertyValue('--confetti-pink').trim() ||
    styles.getPropertyValue('--particle-confetti-1').trim() || '#FF99C8',
    styles.getPropertyValue('--confetti-purple').trim() ||
    styles.getPropertyValue('--particle-confetti-2').trim() || '#AE88BF',
    styles.getPropertyValue('--confetti-teal').trim() ||
    styles.getPropertyValue('--particle-confetti-3').trim() || '#80E1CC',
    styles.getPropertyValue('--confetti-blue').trim() ||
    styles.getPropertyValue('--particle-confetti-4').trim() || '#8AA5E5',
    styles.getPropertyValue('--confetti-gold').trim() ||
    styles.getPropertyValue('--particle-confetti-5').trim() || '#e9bc88',
    styles.getPropertyValue('--confetti-green').trim() ||
    styles.getPropertyValue('--particle-confetti-6').trim() || '#978692',
  ].filter(c => c); // Remove empty strings
}

const DEFAULT_OPTIONS: Required<ParticleBurstOptions> = {
  type: 'confetti',
  colors: [], // Will be populated from CSS tokens
  particleCount: 30,
  spread: 150,
  sizeRange: { min: 6, max: 30 },
  duration: { min: 1500, max: 2500 },
  emojis: ['❤', '🧡', '💛', '💚', '💙', '💜', '🤎'],
  trigger: 'click',
};

/**
 * Create a single particle and animate it
 */
function createParticle(x: number, y: number, opts: Required<ParticleBurstOptions>): void {
  const particle = document.createElement('div');
  particle.className = 'particle-burst';
  document.body.appendChild(particle);

  // Random size
  let width = Math.floor(Math.random() * (opts.sizeRange.max - opts.sizeRange.min) + opts.sizeRange.min);
  let height = width;

  // Random color from palette
  const color = opts.colors[Math.floor(Math.random() * opts.colors.length)];

  // Determine particle type (random if mixed)
  let type = opts.type;
  if (type === 'mixed') {
    const types: ParticleType[] = ['confetti', 'hearts', 'circle', 'star'];
    type = types[Math.floor(Math.random() * types.length)];
  }

  // Base styles
  particle.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    pointer-events: none;
    opacity: 0;
    z-index: 9999;
    user-select: none;
  `;

  // Apply type-specific styles
  switch (type) {
    case 'confetti':
      particle.style.background = color;
      particle.style.border = '1px solid rgba(255, 255, 255, 0.5)';
      particle.style.borderRadius = '2px';
      break;

    case 'circle':
      particle.style.background = color;
      particle.style.borderRadius = '50%';
      break;

    case 'square':
      particle.style.background = color;
      particle.style.border = '2px solid white';
      particle.style.borderRadius = '4px';
      break;

    case 'hearts':
    case 'emoji':
      particle.innerHTML = opts.emojis[Math.floor(Math.random() * opts.emojis.length)];
      particle.style.fontSize = `${Math.random() * 20 + 12}px`;
      particle.style.lineHeight = '1';
      width = height = 0; // Let content size it
      break;

    case 'star':
      particle.style.background = color;
      particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      break;
  }

  if (width > 0) {
    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;
  }

  // Calculate destination (spread in all directions from center)
  const destinationX = x + (Math.random() - 0.5) * 2 * opts.spread;
  const destinationY = y + (Math.random() - 0.5) * 2 * opts.spread;
  const rotation = Math.random() * 520;

  // Animation duration
  const duration = Math.random() * (opts.duration.max - opts.duration.min) + opts.duration.min;

  // Animate using Web Animations API
  const animation = particle.animate(
    [
      {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
        opacity: 1,
      },
      {
        transform: `translate(-50%, -50%) translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`,
        opacity: 0,
      },
    ],
    {
      duration: duration,
      easing: 'cubic-bezier(0, .9, .57, 1)',
      delay: Math.random() * 200,
    }
  );

  // Remove particle when animation finishes
  animation.onfinish = () => {
    particle.remove();
  };
}

/**
 * Create a particle burst effect from an element's center
 */
export function createParticleBurst(
  element: HTMLElement,
  options: ParticleBurstOptions = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Use CSS tokens if colors not provided
  if (!options.colors || options.colors.length === 0) {
    opts.colors = getCSSColors();
  }

  // Fallback colors if CSS tokens not found
  if (opts.colors.length === 0) {
    opts.colors = ['#FF99C8', '#AE88BF', '#80E1CC', '#8AA5E5', '#e9bc88'];
  }

  if (options.emojis) opts.emojis = options.emojis;

  // Get element center position
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  // Create particles
  for (let i = 0; i < opts.particleCount; i++) {
    createParticle(x, y, opts);
  }
}

/**
 * Convenience: Fire confetti from element
 */
export function fireConfetti(element: HTMLElement, count = 30): void {
  createParticleBurst(element, { type: 'confetti', particleCount: count });
}

/**
 * Convenience: Fire hearts from element
 */
export function fireHearts(element: HTMLElement, count = 30): void {
  createParticleBurst(element, { type: 'hearts', particleCount: count });
}

/**
 * Convenience: Fire both confetti and hearts
 */
export function fireBoth(element: HTMLElement): void {
  fireHearts(element);
  setTimeout(() => fireConfetti(element), 100);
}

/**
 * Initialize particle burst on all elements with data-particle-burst attribute
 */
export function initParticleBurst(): void {
  if (typeof window === 'undefined') return;

  document.querySelectorAll('[data-particle-burst]').forEach((element) => {
    if (element.hasAttribute('data-particle-initialized')) return;
    element.setAttribute('data-particle-initialized', 'true');

    const htmlElement = element as HTMLElement;

    // Parse options from data attributes
    const options: ParticleBurstOptions = {};

    const typeAttr = element.getAttribute('data-particle-type') as ParticleType;
    if (typeAttr) options.type = typeAttr;

    const triggerAttr = element.getAttribute('data-particle-trigger') as 'click' | 'hover';
    if (triggerAttr) options.trigger = triggerAttr;

    const colorsAttr = element.getAttribute('data-particle-colors');
    if (colorsAttr) options.colors = colorsAttr.split(',').map(c => c.trim());

    const countAttr = element.getAttribute('data-particle-count');
    if (countAttr) options.particleCount = parseInt(countAttr);

    const spreadAttr = element.getAttribute('data-particle-spread');
    if (spreadAttr) options.spread = parseInt(spreadAttr);

    const emojisAttr = element.getAttribute('data-particle-emojis');
    if (emojisAttr) options.emojis = emojisAttr.split(',').map(e => e.trim());

    const trigger = options.trigger || 'click';

    if (trigger === 'hover') {
      let hasTriggered = false;
      htmlElement.addEventListener('mouseenter', () => {
        if (!hasTriggered) {
          createParticleBurst(htmlElement, options);
          hasTriggered = true;
          setTimeout(() => { hasTriggered = false; }, 2000);
        }
      });
    } else {
      htmlElement.addEventListener('click', (e: MouseEvent) => {
        createParticleBurst(htmlElement, options);

        // If it's a link, delay navigation for particles to show
        if (element.tagName === 'A' && (element as HTMLAnchorElement).href) {
          e.preventDefault();
          const href = (element as HTMLAnchorElement).href;
          setTimeout(() => {
            window.location.href = href;
          }, 400);
        }
      });
    }
  });
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleBurst);
  } else {
    initParticleBurst();
  }

  // Support Astro page transitions
  document.addEventListener('astro:page-load', initParticleBurst);

  // Expose to window for manual usage
  (window as any).particleBurst = {
    init: initParticleBurst,
    create: createParticleBurst,
    confetti: fireConfetti,
    hearts: fireHearts,
    both: fireBoth,
  };
}
