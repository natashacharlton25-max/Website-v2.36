/**
 * Product Gallery - GSAP Flip Animation
 * Targets <Grid gallery="product"> via [data-gallery="product"]
 *
 * Click thumbnail to expand, others collapse.
 */

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const ACTIVE = 'is-active';
const INACTIVE = 'is-inactive';

function initProductGallery(): void {
  const galleries = document.querySelectorAll<HTMLElement>('[data-gallery="product"]');

  galleries.forEach((gallery) => {
    // Respect reduced motion
    const animate = getComputedStyle(gallery).getPropertyValue('--gallery-animate')?.trim();
    const shouldAnimate = animate !== '0';

    const cards = gallery.querySelectorAll<HTMLElement>('.thumbnail');

    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        const state = shouldAnimate ? Flip.getState(cards) : null;
        const isActive = card.classList.contains(ACTIVE);

        // Reset all
        cards.forEach((other, otherIdx) => {
          other.classList.remove(ACTIVE, INACTIVE);
          if (!isActive && idx !== otherIdx) {
            other.classList.add(INACTIVE);
          }
        });

        // Toggle clicked
        if (!isActive) {
          card.classList.add(ACTIVE);
        }

        // Animate if allowed
        if (shouldAnimate && state) {
          Flip.from(state, {
            duration: 1,
            ease: 'expo.out',
            absolute: true
          });
        }
      });
    });
  });
}

// Lifecycle
function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductGallery);
  } else {
    initProductGallery();
  }
}

init();
document.addEventListener('astro:page-load', initProductGallery);
