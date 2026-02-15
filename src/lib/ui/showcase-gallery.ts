/**
 * Isotope Image Gallery
 * Targets <Grid gallery="showcase"> via [data-gallery="showcase"]
 *
 * Grid-based product gallery with GSAP Flip animations.
 * Features circular carousel rotation when clicking thumbnails.
 */

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
// @ts-ignore - imagesloaded has no types
import imagesLoaded from 'imagesloaded';

gsap.registerPlugin(Flip);

function initIsotopeGallery(): void {
  const galleries = document.querySelectorAll<HTMLElement>('[data-gallery="showcase"]');

  galleries.forEach((gallery) => {
    // Respect reduced motion
    const animate = getComputedStyle(gallery).getPropertyValue('--gallery-animate')?.trim();
    const shouldAnimate = animate !== '0';

    gallery.classList.add('grid--loading');

    // @ts-ignore
    imagesLoaded(gallery, () => {
      gallery.classList.remove('grid--loading');
    });

    gallery.addEventListener('click', (e) => {
      const clickedItem = (e.target as HTMLElement).closest('.gallery-item');
      if (!clickedItem) return;
      if (clickedItem.classList.contains('is-expanded')) return;

      const items = gallery.querySelectorAll('.gallery-item');
      const itemsArray = Array.from(items);
      const clickedIndex = itemsArray.indexOf(clickedItem);
      if (clickedIndex === -1) return;

      // Capture state before changes
      const state = shouldAnimate ? Flip.getState(items) : null;

      // Circular carousel rotation
      const newOrder = new Array(itemsArray.length);

      if (clickedIndex === 1) {
        newOrder[0] = itemsArray[1];
        newOrder[1] = itemsArray[2];
        newOrder[2] = itemsArray[3];
        newOrder[3] = itemsArray[0];
      } else if (clickedIndex === 2) {
        newOrder[0] = itemsArray[2];
        newOrder[1] = itemsArray[3];
        newOrder[2] = itemsArray[0];
        newOrder[3] = itemsArray[1];
      } else if (clickedIndex === 3) {
        newOrder[0] = itemsArray[3];
        newOrder[1] = itemsArray[0];
        newOrder[2] = itemsArray[1];
        newOrder[3] = itemsArray[2];
      } else {
        return;
      }

      // Rebuild DOM in new order
      gallery.innerHTML = '';
      newOrder.forEach(el => gallery.appendChild(el));

      // Update expanded state
      const updatedItems = gallery.querySelectorAll('.gallery-item');
      updatedItems.forEach((item, idx) => {
        item.classList.toggle('is-expanded', idx === 0);
        const badge = item.querySelector('.gallery-badge') as HTMLElement;
        if (badge) badge.style.display = idx === 0 ? 'block' : 'none';
      });

      // Animate if allowed
      if (shouldAnimate && state) {
        Flip.from(state, {
          duration: 0.6,
          ease: 'power2.inOut',
          absolute: true,
          scale: true,
          simple: true
        });
      }
    });
  });
}

// Lifecycle
function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIsotopeGallery);
  } else {
    initIsotopeGallery();
  }
}

init();
window.addEventListener('load', () => setTimeout(initIsotopeGallery, 100));
document.addEventListener('astro:page-load', initIsotopeGallery);
