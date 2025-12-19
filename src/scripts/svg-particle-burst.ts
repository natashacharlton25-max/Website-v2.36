/**
 * Particle Burst Effect
 * Creates a burst of particles from button center using Web Animations API
 * Supports multiple particle types: circle, square, emoji, shadow, line, star, heart
 */

export type ParticleType = 'circle' | 'square' | 'emoji' | 'shadow' | 'line' | 'star' | 'heart' | 'mixed';

export interface ParticleBurstOptions {
  colors?: string[];
  particleCount?: number;
  spread?: number;
  sizeRange?: { min: number; max: number };
  duration?: { min: number; max: number };
  type?: ParticleType;
  emojis?: string[];
}

// Get CSS token values from computed styles
function getCSSTokenColors(): string[] {
  if (typeof window === 'undefined') return [];

  const root = document.documentElement;
  const styles = getComputedStyle(root);

  return [
    styles.getPropertyValue('--confetti-pink').trim() || '#FF99C8',
    styles.getPropertyValue('--confetti-purple').trim() || '#AE88BF',
    styles.getPropertyValue('--confetti-teal').trim() || '#80E1CC',
    styles.getPropertyValue('--confetti-blue').trim() || '#8AA5E5',
    styles.getPropertyValue('--confetti-gold').trim() || '#e9bc88',
    styles.getPropertyValue('--confetti-green').trim() || '#978692',
  ];
}

const DEFAULT_OPTIONS: Required<ParticleBurstOptions> = {
  colors: [], // Will be populated from CSS tokens
  particleCount: 60,
  spread: 150,
  sizeRange: { min: 4, max: 40 },
  duration: { min: 1500, max: 3000 },
  type: 'circle',
  emojis: ['❤', '🧡', '💛', '💚', '💙', '💜', '🤎', '✨', '⭐'],
};

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
    opts.colors = getCSSTokenColors();
  } else {
    opts.colors = options.colors;
  }

  if (options.emojis) opts.emojis = options.emojis;

  // Get button center position
  const btnRect = element.getBoundingClientRect();
  const xCenter = (btnRect.left + btnRect.right) / 2;
  const yCenter = (btnRect.top + btnRect.bottom) / 2;

  // Adjust particle count for certain types
  let count = opts.particleCount;
  if (opts.type === 'shadow' || opts.type === 'line') {
    count = Math.max(count, 60);
  }

  // Create particles
  for (let i = 0; i < count; i++) {
    createParticle(xCenter, yCenter, opts);
  }
}

function createParticle(x: number, y: number, opts: Required<ParticleBurstOptions>): void {
  const particle = document.createElement('particle');
  document.body.appendChild(particle);

  // Random size
  let width = Math.floor(Math.random() * (opts.sizeRange.max - opts.sizeRange.min) + opts.sizeRange.min);
  let height = width;

  // Random color from palette
  const color = opts.colors[Math.floor(Math.random() * opts.colors.length)];

  // Determine particle type (random if mixed)
  let type = opts.type;
  if (type === 'mixed') {
    const types: ParticleType[] = ['circle', 'square', 'emoji', 'star', 'heart'];
    type = types[Math.floor(Math.random() * types.length)];
  }

  // Base styles - z-index 9990, buttons should be z-index 9999
  particle.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    z-index: 9990;
  `;

  // Apply type-specific styles
  switch (type) {
    case 'circle':
      particle.style.background = color;
      particle.style.borderRadius = '50%';
      break;

    case 'square':
      particle.style.background = color;
      particle.style.border = '2px solid white';
      particle.style.borderRadius = '4px';
      break;

    case 'emoji':
      particle.innerHTML = opts.emojis[Math.floor(Math.random() * opts.emojis.length)];
      particle.style.fontSize = `${Math.random() * 24 + 12}px`;
      particle.style.lineHeight = '1';
      width = height = 0; // Let content size it
      break;

    case 'shadow':
      particle.style.boxShadow = `0 0 ${Math.floor(Math.random() * 10 + 10)}px ${color}`;
      particle.style.background = color;
      particle.style.borderRadius = '50%';
      width = height = Math.random() * 8 + 4;
      break;

    case 'line':
      particle.style.background = color;
      height = 2;
      width = Math.random() * 20 + 10;
      break;

    case 'star':
      particle.style.background = color;
      particle.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      break;

    case 'heart':
      particle.innerHTML = '❤';
      particle.style.fontSize = `${Math.random() * 20 + 14}px`;
      particle.style.color = color;
      particle.style.lineHeight = '1';
      width = height = 0;
      break;
  }

  if (width > 0) {
    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;
  }

  // Calculate destination (spread in all directions from center)
  const destinationX = x + (Math.random() - 0.5) * 2 * opts.spread;
  const destinationY = y + (Math.random() - 0.5) * 2 * opts.spread;

  // Animation duration (use options)
  const duration = Math.random() * (opts.duration.max - opts.duration.min) + opts.duration.min;

  // Animate using Web Animations API
  const animation = particle.animate(
    [
      {
        // Start at button center
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        opacity: 1,
      },
      {
        // End at random destination
        transform: `translate(${destinationX}px, ${destinationY}px)`,
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
 * Initialize particle burst on all elements with data-particle-burst attribute
 */
export function initParticleBursts(): void {
  if (typeof window === 'undefined') return;

  document.querySelectorAll('[data-particle-burst]').forEach((element) => {
    if (element.hasAttribute('data-particle-burst-initialized')) return;
    element.setAttribute('data-particle-burst-initialized', 'true');

    const htmlElement = element as HTMLElement;

    // Parse options from data attributes
    const options: ParticleBurstOptions = {};

    const colorsAttr = element.getAttribute('data-particle-colors');
    if (colorsAttr) {
      options.colors = colorsAttr.split(',').map(c => c.trim());
    }

    const countAttr = element.getAttribute('data-particle-count');
    if (countAttr) {
      options.particleCount = parseInt(countAttr);
    }

    const spreadAttr = element.getAttribute('data-particle-spread');
    if (spreadAttr) {
      options.spread = parseInt(spreadAttr);
    }

    const typeAttr = element.getAttribute('data-particle-type') as ParticleType;
    if (typeAttr) {
      options.type = typeAttr;
    }

    const emojisAttr = element.getAttribute('data-particle-emojis');
    if (emojisAttr) {
      options.emojis = emojisAttr.split(',').map(e => e.trim());
    }

    // Clear existing particles on mousedown
    htmlElement.addEventListener('mousedown', () => {
      const particles = document.querySelectorAll('particle');
      particles.forEach(p => p.remove());
    });

    // Create burst on click
    htmlElement.addEventListener('click', (e: MouseEvent) => {
      createParticleBurst(htmlElement, options);

      // If it's a link, delay navigation for particles to show
      if (element.tagName === 'A' && (element as HTMLAnchorElement).href) {
        e.preventDefault();
        const href = (element as HTMLAnchorElement).href;
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      }
    });
  });
}

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleBursts);
  } else {
    initParticleBursts();
  }

  // Expose to window for manual usage
  (window as any).particleBurst = {
    init: initParticleBursts,
    create: createParticleBurst,
  };
}
