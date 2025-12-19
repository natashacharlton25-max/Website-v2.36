/**
 * Scroll Animations using GSAP ScrollTrigger
 * Inspired by Locomotive Scroll
 *
 * Features:
 * - Background/text color transitions (synchronized)
 * - Speed/parallax effects
 * - Text animations (split, typewriter, etc.)
 * - Reveal animations
 * - In-view class toggling
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin
gsap.registerPlugin(ScrollTrigger);

const config = {
  defaultDuration: 0.8,
  defaultEase: 'power2.out',
  inViewClass: 'is-inview',
  stagger: 0.1,
};

let initialBgColor = '';
let initialTextColor = '';

/**
 * Initialize all scroll animations
 */
export function initScrollAnimations(): void {
  if (typeof window === 'undefined') return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
}

function setup(): void {
  // Wait for page to fully settle before starting animations
  // This prevents jerky animations on page load/refresh
  setTimeout(() => {
    const bodyStyles = getComputedStyle(document.body);
    initialBgColor = bodyStyles.backgroundColor;
    initialTextColor = bodyStyles.color;

    initColorTransitions();
    initSpeedEffects();
    initRevealAnimations();
    initTextAnimations();
    initScrollProgress();
    initInViewToggle();

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();
  }, 300); // 300ms delay for page to settle
}

/**
 * Background & Text Color Transitions (synchronized)
 */
function initColorTransitions(): void {
  const sections = document.querySelectorAll('[data-scroll-bg]');
  if (sections.length === 0) return;

  sections.forEach((section, index) => {
    const bgColor = section.getAttribute('data-scroll-bg') || initialBgColor;
    const textColor = section.getAttribute('data-scroll-text') || initialTextColor;
    const prevSection = sections[index - 1];
    const prevBg = prevSection?.getAttribute('data-scroll-bg') || initialBgColor;
    const prevText = prevSection?.getAttribute('data-scroll-text') || initialTextColor;

    // Single timeline for both bg and text (synchronized)
    gsap.fromTo(
      document.body,
      { backgroundColor: prevBg, color: prevText },
      {
        backgroundColor: bgColor,
        color: textColor,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 30%',
          scrub: true, // true = instant sync with scroll
        },
      }
    );
  });
}

/**
 * Speed/Parallax Effects
 * Supports both data-scroll-speed and data-scroll-parallax
 */
function initSpeedEffects(): void {
  const elements = document.querySelectorAll('[data-scroll-speed], [data-scroll-parallax]');

  elements.forEach((element) => {
    const speed = parseFloat(
      element.getAttribute('data-scroll-speed') ||
      element.getAttribute('data-scroll-parallax') ||
      '1'
    );
    const direction = element.getAttribute('data-scroll-direction') || 'vertical';
    const delay = parseFloat(element.getAttribute('data-scroll-delay') || '0');
    const targetSelector = element.getAttribute('data-scroll-target');
    const trigger = targetSelector ? document.querySelector(targetSelector) : element;

    const movement = speed * 100;
    const scrubValue = delay > 0 ? delay * 10 : true;

    if (direction === 'horizontal') {
      gsap.to(element, {
        x: -movement,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger || element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: scrubValue,
        },
      });
    } else {
      gsap.to(element, {
        y: -movement,
        ease: 'none',
        scrollTrigger: {
          trigger: trigger || element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: scrubValue,
        },
      });
    }
  });
}

/**
 * Reveal Animations
 */
function initRevealAnimations(): void {
  const revealTypes: Record<string, gsap.TweenVars> = {
    'fade': { opacity: 0 },
    'slide-up': { opacity: 0, y: 60 },
    'slide-down': { opacity: 0, y: -60 },
    'slide-left': { opacity: 0, x: 60 },
    'slide-right': { opacity: 0, x: -60 },
    'scale': { opacity: 0, scale: 0.8 },
    'scale-up': { opacity: 0, scale: 0.5, y: 40 },
    'rotate': { opacity: 0, rotation: 10, y: 40 },
    'blur': { opacity: 0, filter: 'blur(10px)' },
    'flip': { opacity: 0, rotationX: 90 },
    'zoom': { opacity: 0, scale: 0 },
  };

  document.querySelectorAll('[data-scroll-reveal]').forEach((element) => {
    const revealType = element.getAttribute('data-scroll-reveal') || 'fade';
    const delay = parseFloat(element.getAttribute('data-scroll-delay') || '0');
    const duration = parseFloat(element.getAttribute('data-scroll-duration') || String(config.defaultDuration));
    const fromProps = revealTypes[revealType] || revealTypes['fade'];

    // Set initial state - use RAF to prevent flash of content
    requestAnimationFrame(() => {
      gsap.set(element, fromProps);
    });

    const animateIn = () => {
      gsap.to(element, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotationX: 0,
        filter: 'blur(0px)',
        duration,
        delay,
        ease: config.defaultEase,
      });
      element.classList.add(config.inViewClass);
    };

    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      onEnter: animateIn,
      onRefresh: (self) => {
        // If element is already past the start point on load/refresh, animate it
        if (self.progress > 0) animateIn();
      },
      once: true,
    });
  });

  // Staggered groups
  document.querySelectorAll('[data-scroll-reveal-group]').forEach((group) => {
    const children = group.querySelectorAll('[data-scroll-reveal-item]');
    const stagger = parseFloat(group.getAttribute('data-scroll-stagger') || String(config.stagger));

    requestAnimationFrame(() => {
      gsap.set(children, { opacity: 0, y: 40 });
    });

    ScrollTrigger.create({
      trigger: group,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: config.defaultDuration,
          stagger,
          ease: config.defaultEase,
          onComplete: () => children.forEach((c) => c.classList.add(config.inViewClass)),
        });
      },
      once: true,
    });
  });
}

/**
 * Text Animations
 * Usage:
 * - data-text-animate="chars" - Animate each character
 * - data-text-animate="words" - Animate each word
 * - data-text-animate="lines" - Animate each line
 * - data-text-animate="typewriter" - Typewriter effect
 * - data-text-animate="wave" - Wave effect
 */
function initTextAnimations(): void {
  // Split text into chars
  document.querySelectorAll('[data-text-animate="chars"]').forEach((element) => {
    const text = element.textContent || '';
    const delay = parseFloat(element.getAttribute('data-text-delay') || '0');
    const stagger = parseFloat(element.getAttribute('data-text-stagger') || '0.03');

    element.innerHTML = text.split('').map((char) =>
      `<span class="char" style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    const chars = element.querySelectorAll('.char');
    requestAnimationFrame(() => {
      gsap.set(chars, { opacity: 0, y: 20 });
    });

    const animateChars = () => {
      gsap.to(chars, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger,
        delay,
        ease: 'power2.out',
      });
      element.classList.add(config.inViewClass);
    };

    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      onEnter: animateChars,
      onRefresh: (self) => {
        if (self.progress > 0) animateChars();
      },
      once: true,
    });
  });

  // Split text into words
  document.querySelectorAll('[data-text-animate="words"]').forEach((element) => {
    const text = element.textContent || '';
    const delay = parseFloat(element.getAttribute('data-text-delay') || '0');
    const stagger = parseFloat(element.getAttribute('data-text-stagger') || '0.08');

    element.innerHTML = text.split(' ').map((word) =>
      `<span class="word" style="display:inline-block;margin-right:0.25em">${word}</span>`
    ).join('');

    const words = element.querySelectorAll('.word');
    requestAnimationFrame(() => {
      gsap.set(words, { opacity: 0, y: 30, rotationX: 45 });
    });

    const animateWords = () => {
      gsap.to(words, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.6,
        stagger,
        delay,
        ease: 'power3.out',
      });
      element.classList.add(config.inViewClass);
    };

    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      onEnter: animateWords,
      onRefresh: (self) => {
        if (self.progress > 0) animateWords();
      },
      once: true,
    });
  });

  // Typewriter effect
  document.querySelectorAll('[data-text-animate="typewriter"]').forEach((el) => {
    const element = el as HTMLElement;
    const text = element.textContent || '';
    const speed = parseFloat(element.getAttribute('data-text-speed') || '0.05');

    element.textContent = '';
    element.style.borderRight = '2px solid currentColor';

    let hasStarted = false;
    const startTypewriter = () => {
      if (hasStarted) return;
      hasStarted = true;
      let i = 0;
      const interval = setInterval(() => {
        element.textContent = text.substring(0, i + 1);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(() => {
            element.style.borderRight = 'none';
          }, 1000);
        }
      }, speed * 1000);
      element.classList.add(config.inViewClass);
    };

    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      onEnter: startTypewriter,
      onRefresh: (self) => {
        if (self.progress > 0) startTypewriter();
      },
      once: true,
    });
  });

  // Wave effect (chars move up and down)
  document.querySelectorAll('[data-text-animate="wave"]').forEach((element) => {
    const text = element.textContent || '';
    const delay = parseFloat(element.getAttribute('data-text-delay') || '0');

    element.innerHTML = text.split('').map((char) =>
      `<span class="char" style="display:inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    const chars = element.querySelectorAll('.char');

    const startWave = () => {
      gsap.fromTo(chars,
        { y: 0 },
        {
          y: -10,
          duration: 0.3,
          stagger: {
            each: 0.05,
            repeat: -1,
            yoyo: true,
          },
          delay,
          ease: 'sine.inOut',
        }
      );
      element.classList.add(config.inViewClass);
    };

    ScrollTrigger.create({
      trigger: element,
      start: 'top 90%',
      onEnter: startWave,
      onRefresh: (self) => {
        if (self.progress > 0) startWave();
      },
      once: true,
    });
  });

  // Lines animation (for paragraphs)
  document.querySelectorAll('[data-text-animate="lines"]').forEach((element) => {
    const html = element.innerHTML;
    const delay = parseFloat(element.getAttribute('data-text-delay') || '0');
    const stagger = parseFloat(element.getAttribute('data-text-stagger') || '0.15');

    // Wrap each line (assumes br tags or block elements separate lines)
    const lines = html.split(/<br\s*\/?>/gi);
    element.innerHTML = lines.map((line) =>
      `<span class="line" style="display:block;overflow:hidden"><span class="line-inner" style="display:block">${line}</span></span>`
    ).join('');

    const lineInners = element.querySelectorAll('.line-inner');
    requestAnimationFrame(() => {
      gsap.set(lineInners, { y: '100%' });
    });

    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(lineInners, {
          y: '0%',
          duration: 0.8,
          stagger,
          delay,
          ease: 'power3.out',
        });
        element.classList.add(config.inViewClass);
      },
      once: true,
    });
  });

  // Gradient text reveal
  document.querySelectorAll('[data-text-animate="gradient"]').forEach((element) => {
    const delay = parseFloat(element.getAttribute('data-text-delay') || '0');

    requestAnimationFrame(() => {
      gsap.set(element, {
        backgroundSize: '200% 100%',
        backgroundPosition: '100% 0',
      });
    });

    ScrollTrigger.create({
      trigger: element,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(element, {
          backgroundPosition: '0% 0',
          duration: 1.2,
          delay,
          ease: 'power2.out',
        });
        element.classList.add(config.inViewClass);
      },
      once: true,
    });
  });
}

/**
 * In-View Class Toggle
 */
function initInViewToggle(): void {
  document.querySelectorAll('[data-scroll]:not([data-scroll-speed]):not([data-scroll-reveal])').forEach((element) => {
    const offset = parseInt(element.getAttribute('data-scroll-offset') || '0');
    const repeat = element.hasAttribute('data-scroll-repeat');

    ScrollTrigger.create({
      trigger: element,
      start: `top ${100 - offset}%`,
      end: 'bottom top',
      onEnter: () => element.classList.add(config.inViewClass),
      onLeave: () => repeat && element.classList.remove(config.inViewClass),
      onEnterBack: () => repeat && element.classList.add(config.inViewClass),
      onLeaveBack: () => repeat && element.classList.remove(config.inViewClass),
    });
  });
}

/**
 * Scroll Progress
 */
function initScrollProgress(): void {
  document.querySelectorAll('[data-scroll-progress]').forEach((bar) => {
    requestAnimationFrame(() => {
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
    });
    gsap.to(bar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  });
}

// Utilities
export function createColorJourney(colors: { bg: string; text?: string }[]): void {
  document.querySelectorAll('section, [data-section]').forEach((section, index) => {
    if (colors[index]) {
      section.setAttribute('data-scroll-bg', colors[index].bg);
      if (colors[index].text) section.setAttribute('data-scroll-text', colors[index].text);
    }
  });
  initColorTransitions();
}

export function refreshScrollTrigger(): void {
  ScrollTrigger.refresh();
}

export function destroyScrollAnimations(): void {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

export function scrollTo(target: string | Element, offset = 0): void {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  gsap.to(window, { duration: 1, scrollTo: { y, autoKill: true }, ease: 'power2.inOut' });
}

// Auto-init
initScrollAnimations();

if (typeof window !== 'undefined') {
  (window as any).scrollAnimations = {
    init: initScrollAnimations,
    refresh: refreshScrollTrigger,
    destroy: destroyScrollAnimations,
    scrollTo,
    createColorJourney,
  };
}
