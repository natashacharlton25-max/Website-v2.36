/**
 * Scroll Color Background - GSAP ScrollTrigger color transitions
 *
 * Creates smooth background color transitions based on scroll position.
 * Detects sections with data-scroll-bg attributes and animates between colors.
 *
 * Features:
 * - Resolves CSS variables and OKLCH colors to RGB for GSAP
 * - Respects a11y settings (disables when active)
 * - Smooth bidirectional scrolling
 * - Kills previous tweens to prevent conflicts
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// A11y classes that should disable scroll color changes
const a11yClasses = [
  'a11y-reduce-motion', 'a11y-text-only', 'a11y-theme-dark', 'a11y-theme-cream',
  'a11y-theme-high-contrast', 'a11y-theme-protanopia', 'a11y-theme-deuteranopia',
  'a11y-theme-tritanopia', 'a11y-theme-monochrome'
];

/**
 * Convert any color (including OKLCH) to RGB
 */
function toRGB(color: string): string {
  const temp = document.createElement('div');
  temp.style.backgroundColor = color;
  temp.style.display = 'none';
  document.body.appendChild(temp);
  const computed = getComputedStyle(temp).backgroundColor;
  document.body.removeChild(temp);
  return computed;
}

/**
 * Resolve CSS variable to RGB color
 */
function resolveColor(cssVar: string, fallback: string): string {
  if (!cssVar) return fallback;
  let rawColor = cssVar;
  if (cssVar.startsWith('var(')) {
    const varName = cssVar.match(/var\((.*?)\)/)?.[1];
    if (varName) {
      rawColor = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      if (!rawColor) return fallback;
    }
  }
  return toRGB(rawColor);
}

/**
 * Initialize scroll-triggered background color changes
 */
function initScrollColors(): void {
  // Skip if a11y settings active
  if (a11yClasses.some(cls => document.body.classList.contains(cls))) return;

  const bgLayer = document.getElementById('scroll-bg-layer');
  if (!bgLayer) return;

  const sections = document.querySelectorAll('[data-scroll-bg]');
  if (sections.length === 0) return;

  const fallbackColor = 'rgb(248, 245, 242)';
  const initialColor = resolveColor('var(--color-Background-100)', fallbackColor);

  // Set initial background
  bgLayer.style.backgroundColor = initialColor;

  // Build RGB color array
  const sectionColors = Array.from(sections).map(section => ({
    section,
    color: resolveColor(section.getAttribute('data-scroll-bg') || '', initialColor)
  }));

  let currentColor = initialColor;

  // Create ScrollTriggers for each section
  sectionColors.forEach(({ section, color }, index) => {
    const prevColor = index > 0 ? sectionColors[index - 1].color : initialColor;
    const nextColor = index < sectionColors.length - 1 ? sectionColors[index + 1].color : initialColor;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        gsap.killTweensOf(bgLayer);
        gsap.fromTo(bgLayer, { backgroundColor: currentColor }, { backgroundColor: color, duration: 0.5, ease: 'power2.out' });
        currentColor = color;
      },
      onEnterBack: () => {
        gsap.killTweensOf(bgLayer);
        gsap.fromTo(bgLayer, { backgroundColor: currentColor }, { backgroundColor: color, duration: 0.5, ease: 'power2.out' });
        currentColor = color;
      },
      onLeave: () => {
        gsap.killTweensOf(bgLayer);
        gsap.fromTo(bgLayer, { backgroundColor: currentColor }, { backgroundColor: nextColor, duration: 0.5, ease: 'power2.out' });
        currentColor = nextColor;
      },
      onLeaveBack: () => {
        gsap.killTweensOf(bgLayer);
        gsap.fromTo(bgLayer, { backgroundColor: currentColor }, { backgroundColor: prevColor, duration: 0.5, ease: 'power2.out' });
        currentColor = prevColor;
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollColors);
} else {
  initScrollColors();
}
