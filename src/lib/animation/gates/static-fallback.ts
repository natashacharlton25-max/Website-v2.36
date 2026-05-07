/**
 * Static Fallback — when motion is none, animations don't play.
 * Elements need to show their resting/end state immediately.
 * These rules define what that looks like per animation type.
 */

export interface StaticFallback {
  /** Show element at full opacity */
  visible: () => void;
  /** Show stroked outline at 100% */
  stroked: (el: SVGElement) => void;
  /** Show filled shape at full opacity */
  filled: (el: SVGElement) => void;
}

export function applyStaticFallback(el: HTMLElement, type: 'draw' | 'fill' | 'morph' | 'gradient'): void {
  const svg = el.querySelector('svg');
  if (!svg) return;

  switch (type) {
    case 'draw': {
      // Show overlays at full draw, full opacity
      svg.querySelectorAll('.icon-draw-overlay').forEach(o => {
        const s = (o as HTMLElement).style;
        s.opacity = '1';
        // drawSVG can't be set via style — GSAP handles it
      });
      break;
    }
    case 'fill': {
      // Show fill clones at full scale + opacity
      svg.querySelectorAll('.icon-fill-morph').forEach(c => {
        const s = (c as HTMLElement).style;
        s.opacity = '1';
        s.transform = 'scale(1)';
      });
      break;
    }
    case 'morph': {
      // Show original shape (no morph needed)
      break;
    }
    case 'gradient': {
      // Show static gradient (no animation)
      break;
    }
  }
}
