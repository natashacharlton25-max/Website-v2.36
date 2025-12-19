/**
 * Particle Effects for Donate Buttons
 * DOM-based particle burst effects
 *
 * Usage:
 * Add data attributes to any element:
 *   data-particle="hearts" - Heart emoji burst
 *   data-particle="confetti" - Colorful square confetti
 *   data-particle="both" - Both effects
 *   data-particle-trigger="click" | "hover" (default: click)
 *   data-particle-disabled - Add to disable effects
 *
 * Example:
 *   <button data-particle="hearts">Donate</button>
 *   <a href="/donate" data-particle="confetti" data-particle-trigger="hover">Give Now</a>
 */

/**
 * Get CSS variable value from root
 */
function getCSSVariable(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Create a single particle element and animate it
 */
function createParticle(x: number, y: number, type: 'hearts' | 'confetti'): void {
  const particle = document.createElement('div');
  particle.className = 'particle-effect';
  document.body.appendChild(particle);

  let width = Math.floor(Math.random() * 30 + 8);
  let height = width;
  const destinationX = (Math.random() - 0.5) * 300;
  const destinationY = (Math.random() - 0.5) * 300;
  const rotation = Math.random() * 520;
  const delay = Math.random() * 200;

  // Style based on type
  if (type === 'hearts') {
    const hearts = ['❤', '🧡', '💛', '💚', '💙', '💜', '🤎'];
    particle.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    particle.style.fontSize = `${Math.random() * 24 + 10}px`;
    width = height = 0; // auto size for emoji
  } else if (type === 'confetti') {
    // Use CSS custom properties for confetti colors
    const confettiColors = [
      getCSSVariable('--particle-confetti-1'),
      getCSSVariable('--particle-confetti-2'),
      getCSSVariable('--particle-confetti-3'),
      getCSSVariable('--particle-confetti-4'),
      getCSSVariable('--particle-confetti-5'),
      getCSSVariable('--particle-confetti-6'),
    ];
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    particle.style.background = color;
    particle.style.border = '1px solid rgba(255, 255, 255, 0.5)';
    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;
  }

  // Base styles
  particle.style.position = 'fixed';
  particle.style.top = '0';
  particle.style.left = '0';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '9999';
  particle.style.userSelect = 'none';

  // Animate the particle
  const animation = particle.animate(
    [
      {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
        opacity: 1,
      },
      {
        transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${y + destinationY}px) rotate(${rotation}deg)`,
        opacity: 0,
      },
    ],
    {
      duration: Math.random() * 1000 + 2000,
      easing: 'cubic-bezier(0, .9, .57, 1)',
      delay: delay,
    }
  );

  // Remove particle when animation completes
  animation.onfinish = () => {
    particle.remove();
  };
}

/**
 * Fire hearts from element
 */
export function fireHearts(element: HTMLElement): void {
  const bbox = element.getBoundingClientRect();
  const x = bbox.left + bbox.width / 2;
  const y = bbox.top + bbox.height / 2;

  for (let i = 0; i < 30; i++) {
    createParticle(x, y, 'hearts');
  }
}

/**
 * Fire confetti burst from element
 */
export function fireConfetti(element: HTMLElement): void {
  const bbox = element.getBoundingClientRect();
  const x = bbox.left + bbox.width / 2;
  const y = bbox.top + bbox.height / 2;

  for (let i = 0; i < 30; i++) {
    createParticle(x, y, 'confetti');
  }
}

/**
 * Fire both confetti and hearts
 */
export function fireBoth(element: HTMLElement): void {
  fireHearts(element);
  setTimeout(() => fireConfetti(element), 100);
}

/**
 * Initialize particle effects on elements with data-particle attribute
 */
export function initParticleEffects(): void {
  if (typeof window === 'undefined') return;

  document.querySelectorAll('[data-particle]').forEach((element) => {
    // Skip if disabled
    if (element.hasAttribute('data-particle-disabled')) return;

    const effectType = element.getAttribute('data-particle') || 'confetti';
    const trigger = element.getAttribute('data-particle-trigger') || 'click';

    const fireEffect = () => {
      switch (effectType) {
        case 'hearts':
          fireHearts(element as HTMLElement);
          break;
        case 'both':
          fireBoth(element as HTMLElement);
          break;
        case 'confetti':
        default:
          fireConfetti(element as HTMLElement);
          break;
      }
    };

    if (trigger === 'hover') {
      let hasTriggered = false;
      element.addEventListener('mouseenter', () => {
        if (!hasTriggered) {
          fireEffect();
          hasTriggered = true;
          // Reset after a delay to allow re-trigger
          setTimeout(() => { hasTriggered = false; }, 2000);
        }
      });
    } else {
      element.addEventListener('click', (e) => {
        // Fire effect immediately
        fireEffect();

        // If it's a link, prevent default, wait for animation, then navigate
        if (element.tagName === 'A' && (element as HTMLAnchorElement).href) {
          e.preventDefault();
          const href = (element as HTMLAnchorElement).href;
          // Wait briefly for particles to start, then navigate
          setTimeout(() => {
            window.location.href = href;
          }, 300);
        }
      });
    }
  });
}

// Auto-initialize
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticleEffects);
  } else {
    initParticleEffects();
  }

  // Expose to window for manual triggering
  (window as any).particleEffects = {
    init: initParticleEffects,
    confetti: fireConfetti,
    hearts: fireHearts,
    both: fireBoth,
  };
}
