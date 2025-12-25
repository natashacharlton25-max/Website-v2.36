/**
 * Smooth Scroll Utilities using GSAP
 *
 * Features:
 * - Smooth scroll to elements
 * - Native CSS smooth scrolling
 * - GSAP-powered scroll animations
 *
 * Usage:
 * import { scrollTo } from '../lib/ui/smooth-scroll';
 * scrollTo('#section', { duration: 1.2 });
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/**
 * Smooth scroll to an element or position
 */
export function scrollTo(
  target: string | HTMLElement | number,
  options?: {
    offset?: number;
    duration?: number;
    ease?: string;
  }
): void {
  const duration = options?.duration ?? 1;
  const ease = options?.ease ?? 'power2.inOut';
  const offset = options?.offset ?? 0;

  if (typeof target === 'number') {
    gsap.to(window, {
      duration,
      scrollTo: { y: target, autoKill: true },
      ease,
    });
  } else {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element instanceof HTMLElement) {
      gsap.to(window, {
        duration,
        scrollTo: { y: element, offsetY: offset, autoKill: true },
        ease,
      });
    }
  }
}

/**
 * Get current scroll progress (0-1)
 */
export function getScrollProgress(): number {
  return window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
}

/**
 * Refresh ScrollTrigger (call after DOM changes)
 */
export function refreshScrollTrigger(): void {
  ScrollTrigger.refresh();
}

// Handle anchor links for smooth scrolling
function initAnchorLinks(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          scrollTo(target as HTMLElement, { duration: 1 });
        }
      }
    });
  });
}

// Auto-initialize
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnchorLinks);
  } else {
    initAnchorLinks();
  }

  // Expose utilities to window
  (window as any).smoothScroll = {
    scrollTo,
    getProgress: getScrollProgress,
    refresh: refreshScrollTrigger,
  };
}
