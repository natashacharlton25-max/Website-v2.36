/**
 * Isotope Image Gallery
 *
 * Grid-based product gallery with GSAP Flip animations.
 * Features circular carousel rotation when clicking thumbnails.
 */

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
// @ts-ignore - imagesloaded has no types
import imagesLoaded from 'imagesloaded';

gsap.registerPlugin(Flip);

/**
 * Initialize isotope gallery functionality
 */
function initIsotopeGallery(): void {
  const galleries = document.querySelectorAll('.isotope-gallery');

  galleries.forEach(galleryElement => {
    const gallery = galleryElement as HTMLElement;
    gallery.classList.add('grid--loading');

    // Wait for images to load
    // @ts-ignore
    imagesLoaded(gallery, () => {
      gallery.classList.remove('grid--loading');
    });

    // Handle item clicks using event delegation (survives DOM manipulation)
    gallery.addEventListener('click', (e) => {
      const clickedItem = (e.target as HTMLElement).closest('.gallery-item');
      if (!clickedItem) return;

      const wasExpanded = clickedItem.classList.contains('is-expanded');

      // Don't do anything if clicking already expanded item
      if (wasExpanded) return;

      // Get current items and find clicked index
      const items = gallery.querySelectorAll('.gallery-item');
      const itemsArray = Array.from(items);
      const clickedIndex = itemsArray.indexOf(clickedItem);

      if (clickedIndex === -1) return;

      // Capture state before any changes
      const state = Flip.getState(items);

      // Circular carousel rotation pattern:
      // When clicking position 2: 2→1, 1→2, 2→3 shifts down, 3→4 shifts down
      // When clicking position 3: 3→1, 1→2, 2→3, 3→4 shifts down
      // When clicking position 4: 4→1, 1→2, 2→3, 3→4 (full rotation)

      const newOrder = new Array(itemsArray.length);

      if (clickedIndex === 1) {
        // Click position 2 (top right thumbnail)
        // Pattern: 2→1, 3→2, 4→3, 1→4
        newOrder[0] = itemsArray[1]; // pos 2 → pos 1 (main)
        newOrder[1] = itemsArray[2]; // pos 3 → pos 2 (top right)
        newOrder[2] = itemsArray[3]; // pos 4 → pos 3 (middle right)
        newOrder[3] = itemsArray[0]; // pos 1 → pos 4 (bottom right)
      } else if (clickedIndex === 2) {
        // Click position 3 (middle right thumbnail)
        // Pattern: 3→1, 4→2, 1→3, 2→4
        newOrder[0] = itemsArray[2]; // pos 3 → pos 1 (main)
        newOrder[1] = itemsArray[3]; // pos 4 → pos 2 (top right)
        newOrder[2] = itemsArray[0]; // pos 1 → pos 3 (middle right)
        newOrder[3] = itemsArray[1]; // pos 2 → pos 4 (bottom right)
      } else if (clickedIndex === 3) {
        // Click position 4 (bottom right thumbnail)
        // Pattern: 4→1, 1→2, 2→3, 3→4 (full rotation)
        newOrder[0] = itemsArray[3]; // pos 4 → pos 1 (main)
        newOrder[1] = itemsArray[0]; // pos 1 → pos 2 (top right)
        newOrder[2] = itemsArray[1]; // pos 2 → pos 3 (middle right)
        newOrder[3] = itemsArray[2]; // pos 3 → pos 4 (bottom right)
      } else {
        // Clicking position 1 (already expanded) - do nothing
        return;
      }

      // Clear and rebuild DOM in new order
      gallery.innerHTML = '';
      newOrder.forEach(el => gallery.appendChild(el));

      // Re-query items after DOM manipulation
      const updatedItems = gallery.querySelectorAll('.gallery-item');

      // Set first item as expanded
      updatedItems.forEach((i, idx) => {
        i.classList.remove('is-expanded');
        if (idx === 0) {
          i.classList.add('is-expanded');
        }
      });

      // Handle badge visibility
      updatedItems.forEach((i) => {
        const badge = i.querySelector('.product-badge') as HTMLElement;
        if (badge) {
          badge.style.display = i.classList.contains('is-expanded') ? 'block' : 'none';
        }
      });

      // Animate all items smoothly between their old and new positions
      Flip.from(state, {
        duration: 0.6,
        ease: 'power2.inOut',
        absolute: true,
        scale: true,
        simple: true
      });
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIsotopeGallery);
} else {
  initIsotopeGallery();
}
