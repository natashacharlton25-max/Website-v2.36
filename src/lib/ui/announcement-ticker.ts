/**
 * Announcement Ticker
 *
 * GSAP-powered scrolling animation for announcement ticker.
 * Supports pause on hover and configurable speed.
 */

import { gsap } from 'gsap';

/**
 * Initialize announcement ticker animations
 */
function initAnnouncementTicker(): void {
  const tickers = document.querySelectorAll('.announcement-ticker');

  tickers.forEach((ticker) => {
    const track = ticker.querySelector('.announcement-ticker__track') as HTMLElement;
    const segment = ticker.querySelector('.announcement-ticker__segment') as HTMLElement;

    if (!track || !segment) return;

    const speed = parseFloat(ticker.getAttribute('data-speed') || '25');
    const segmentWidth = segment.offsetWidth;

    // Animate the track
    const animation = gsap.to(track, {
      x: -segmentWidth,
      duration: speed,
      ease: 'none',
      repeat: -1,
    });

    // Pause on hover if enabled
    if (ticker.classList.contains('announcement-ticker--pause-hover')) {
      ticker.addEventListener('mouseenter', () => animation.pause());
      ticker.addEventListener('mouseleave', () => animation.resume());
    }
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAnnouncementTicker);
