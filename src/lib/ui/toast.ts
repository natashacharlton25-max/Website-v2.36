/**
 * Toast Notification Utility
 *
 * Single `icon` prop auto-detects media type:
 *   - Preset name ('alert', 'info', etc) → Lottie + paired Phosphor fallback
 *   - Path ending .json → custom Lottie, generic Phosphor fallback
 *   - Path ending .webp/.png/.jpg/.svg → <img>, generic Phosphor fallback
 *   - A11y modes always swap to Phosphor static icon
 *
 * Design themes (arcade, professional, brutalist, glass, neon)
 * control shape/shadow/blur. Colours from --brand-c-* tokens.
 *
 * Usage:
 *   import { showToast } from '../lib/ui/toast';
 *   showToast({ message: 'Saved!', theme: 'glass', icon: 'thumbup' });
 *   showToast({ message: 'Alert!', theme: 'brutalist', icon: 'alert', animation: 'bounce' });
 *   showToast({ message: 'Custom', icon: '/images/thumb.webp' });
 *   showToast({ message: 'Lottie', icon: '/path/to/custom.json' });
 */

import lottie from 'lottie-web';

export type ToastTheme = 'arcade' | 'professional' | 'brutalist' | 'glass' | 'neon';
export type ToastAnimation = 'slide' | 'bounce' | 'fade' | 'flip' | 'zoom';
export type ToastPresetIcon = 'activity' | 'notification' | 'alert' | 'info' | 'thumbup';

export interface ToastOptions {
  message: string;
  theme?: ToastTheme;
  animation?: ToastAnimation;
  duration?: number;
  icon?: ToastPresetIcon | string;
}

/* ==========================================================
   ICON PRESETS
   ========================================================== */

const lottiePresets: Record<ToastPresetIcon, string> = {
  activity: '/Icons/Animated Icons/Toast Icons/Activity/Lottie-toast-activity.json',
  notification: '/Icons/Animated Icons/Toast Icons/NotificationV3/Lottie-toast-notification-v3.json',
  alert: '/Icons/Animated Icons/Toast Icons/Alert triangle/Lottie-toast-alert-triangle.json',
  info: '/Icons/Animated Icons/Toast Icons/Info/Lottie-toast-info.json',
  thumbup: '/Icons/Animated Icons/Toast Icons/Thumb up/Lottie-toast-thumb-up.json',
};

const phosphorPresets: Record<ToastPresetIcon, string> = {
  activity: '/Icons/phosphor/toast/circle-notch-fill.svg',
  notification: '/Icons/phosphor/toast/bell-ringing-fill.svg',
  alert: '/Icons/phosphor/toast/warning-fill.svg',
  info: '/Icons/phosphor/toast/info-fill.svg',
  thumbup: '/Icons/phosphor/toast/thumbs-up-fill.svg',
};

const defaultPhosphor = phosphorPresets.info;

/* ==========================================================
   ICON TYPE DETECTION
   ========================================================== */

type IconType = 'lottie' | 'image' | 'preset';

function detectIconType(icon: string): IconType {
  if (icon in lottiePresets) return 'preset';
  if (icon.endsWith('.json')) return 'lottie';
  if (/\.(webp|png|jpe?g|svg|gif|avif)$/i.test(icon)) return 'image';
  return 'preset'; // fallback to preset lookup
}

function getLottiePath(icon: string): string {
  if (icon in lottiePresets) return lottiePresets[icon as ToastPresetIcon];
  if (icon.endsWith('.json')) return icon;
  return lottiePresets.notification; // safe fallback
}

function getPhosphorPath(icon: string): string {
  if (icon in phosphorPresets) return phosphorPresets[icon as ToastPresetIcon];
  return defaultPhosphor;
}

/* ==========================================================
   A11Y DETECTION
   ========================================================== */

function isA11yMode(): boolean {
  const wrapper = document.querySelector('#a11y-content-wrapper');

  // Reduced motion (OS or panel)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  if (wrapper?.classList.contains('a11y-reduce-motion')) return true;

  // Text only
  if (wrapper?.classList.contains('a11y-text-only')) return true;

  // Enhanced focus
  if (wrapper?.classList.contains('a11y-enhanced-focus')) return true;

  return false;
}

function isReducedMotion(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const wrapper = document.querySelector('#a11y-content-wrapper');
  return wrapper?.classList.contains('a11y-reduce-motion') ?? false;
}

/* ==========================================================
   SHOW TOAST
   ========================================================== */

export function showToast(options: ToastOptions): void {
  const {
    message,
    theme = 'professional',
    animation = 'slide',
    duration = 30000,
    icon = 'notification',
  } = options;

  // Get or create container (CSS handles positioning via #toast-container)
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Detect a11y mode or small screen (≤500px: no icons, professional, fade)
  const a11y = isA11yMode();
  const compact = window.innerWidth <= 500;
  const stripped = a11y || compact;

  // Create toast element — force professional in a11y / compact mode
  const effectiveTheme = stripped ? 'professional' : theme;
  const toast = document.createElement('div');
  toast.className = `toast toast-${effectiveTheme}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  // Add animation class (a11y: CSS handles slow fade override)
  if (!isReducedMotion()) {
    toast.classList.add(`toast-${animation}-animation`);
  }

  const iconType = detectIconType(icon);

  // --- Icons: skip ALL in a11y / compact mode (text-only toast) ---
  let lottieContainer: HTMLDivElement | null = null;
  let lottieAnimation: any = null;

  if (!stripped) {
    // Lottie icon
    if (iconType === 'preset' || iconType === 'lottie') {
      lottieContainer = document.createElement('div');
      lottieContainer.className = 'toast-lottie-icon';
      toast.appendChild(lottieContainer);
    }

    // Image icon
    if (iconType === 'image') {
      const img = document.createElement('img');
      img.className = 'toast-img-icon';
      img.src = encodeURI(icon);
      img.alt = '';
      img.loading = 'eager';
      toast.appendChild(img);
    }

    // Static Phosphor fallback (hidden by default, CSS swaps in a11y)
    const staticIcon = document.createElement('div');
    staticIcon.className = 'toast-static-icon';
    const phosphorSrc = getPhosphorPath(icon);
    staticIcon.innerHTML = `<img src="${phosphorSrc}" alt="" width="32" height="32" style="width:100%;height:100%;" />`;
    toast.appendChild(staticIcon);
  }

  // --- Message ---
  const text = document.createElement('span');
  text.className = 'toast-message';
  text.textContent = message;
  toast.appendChild(text);

  // --- Glow (skip in a11y / compact) ---
  if (!stripped) {
    const glow = document.createElement('div');
    glow.className = 'toast-glow';
    toast.appendChild(glow);
  }

  // Add to container
  container.appendChild(toast);

  // Load Lottie
  if (lottieContainer && !stripped) {
    lottieAnimation = lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: getLottiePath(icon),
    });

    // Override Lottie SVG fills with theme icon color (CSS can't beat lottie-web inline styles)
    lottieAnimation.addEventListener('DOMLoaded', () => {
      const color = getComputedStyle(toast).getPropertyValue('--toast-icon-color').trim();
      if (color && lottieContainer) {
        lottieContainer.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, g').forEach(el => {
          (el as SVGElement).setAttribute('fill', color);
          (el as SVGElement).setAttribute('stroke', color);
        });
      }
    });
  }

  // Lottie loop control: 3 plays or max 10 seconds
  let loopCount = 0;
  const maxLoops = 3;
  const maxLottieDuration = 10000;
  let lottieTimeout: ReturnType<typeof setTimeout>;

  if (lottieAnimation) {
    lottieAnimation.addEventListener('complete', () => {
      loopCount++;
      if (loopCount < maxLoops) {
        lottieAnimation.goToAndPlay(0);
      }
    });

    lottieTimeout = setTimeout(() => {
      lottieAnimation.stop();
    }, maxLottieDuration);
  }

  // Dismiss handler — a11y: slow fade, compact: medium fade, normal: slide-right
  const dismissToast = () => {
    clearTimeout(autoRemoveTimeout);
    if (lottieTimeout) clearTimeout(lottieTimeout);

    if (a11y) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 1.2s ease';
    } else if (compact) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 1.2s ease';
    } else {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }

    const delay = stripped ? 1200 : 300;
    setTimeout(() => {
      if (lottieAnimation) lottieAnimation.destroy();
      toast.remove();

      // Clean up empty container
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, delay);
  };

  // Click to dismiss
  toast.addEventListener('click', dismissToast);

  // Auto-dismiss
  const autoRemoveTimeout = setTimeout(dismissToast, duration);
}

/* ==========================================================
   GLOBAL ACCESS
   ========================================================== */

if (typeof window !== 'undefined') {
  (window as any).showToast = showToast;
}