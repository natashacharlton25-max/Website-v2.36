/**
 * Toast Notification Utility
 * Enhanced with Lottie animations
 *
 * Features:
 * - Lottie animation plays 3 times or max 10 seconds
 * - Toast displays for 30 seconds
 * - Click to dismiss instantly
 * - Uses CSS token system
 *
 * Usage:
 * import { showToast } from './scripts/toast';
 * showToast({ message: 'Hello!', theme: 'professional', animation: 'slide' });
 */

import lottie from 'lottie-web';

export interface ToastOptions {
  message: string;
  theme?: 'arcade' | 'professional' | 'brutalist' | 'glass' | 'neon';
  animation?: 'slide' | 'bounce' | 'fade' | 'flip' | 'zoom';
  duration?: number;
  lottieUrl?: string;
}

const themeLottieUrls: Record<string, string> = {
  arcade: '/Icons/Animated Icons/Toast Icons/Activity/Lottie-toast-activity.json',
  professional: '/Icons/Animated Icons/Toast Icons/NotificationV3/Lottie-toast-notification-v3.json',
  brutalist: '/Icons/Animated Icons/Toast Icons/Alert triangle/Lottie-toast-alert-triangle.json',
  glass: '/Icons/Animated Icons/Toast Icons/Info/Lottie-toast-info.json',
  neon: '/Icons/Animated Icons/Toast Icons/Thumb up/Lottie-toast-thumb-up.json'
};

export function showToast(options: ToastOptions): void {
  const {
    message,
    theme = 'professional',
    animation = 'slide',
    duration = 30000, // 30 seconds
    lottieUrl
  } = options;

  // Get or create toast container
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    const width = window.innerWidth;
    const isCentered = width <= 600;
    const isVerySmall = width <= 250;
    container.style.cssText = `
      position: fixed;
      top: ${isVerySmall ? '80px' : '100px'};
      ${isCentered ? 'left: 50%; right: auto; transform: translateX(-50%);' : 'right: var(--space-xl, 1.5rem);'}
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: var(--space-md, 1rem);
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${theme} toast-${animation}-animation`;
  toast.style.pointerEvents = 'auto';
  toast.style.cursor = 'pointer';

  // Create Lottie icon container
  const iconElement = document.createElement('div');
  iconElement.className = 'toast-lottie-icon';
  iconElement.style.cssText = 'width: 32px; height: 32px; flex-shrink: 0;';

  // Create text
  const text = document.createElement('span');
  text.textContent = message;

  // Create glow effect
  const glow = document.createElement('div');
  glow.className = 'toast-glow';

  // Assemble toast
  toast.appendChild(iconElement);
  toast.appendChild(text);
  toast.appendChild(glow);
  container.appendChild(toast);

  // Load Lottie animation with 3 loops or 10 second max
  const lottieAnimation = lottie.loadAnimation({
    container: iconElement,
    renderer: 'svg',
    loop: false, // We'll handle looping manually
    autoplay: true,
    path: lottieUrl || themeLottieUrls[theme] || themeLottieUrls['professional']
  });

  // Track loop count and max duration
  let loopCount = 0;
  const maxLoops = 3;
  const maxLottieDuration = 10000; // 10 seconds
  let lottieTimeout: NodeJS.Timeout;

  lottieAnimation.addEventListener('complete', () => {
    loopCount++;
    if (loopCount < maxLoops) {
      lottieAnimation.goToAndPlay(0);
    }
  });

  // Stop lottie after 10 seconds regardless of loops
  lottieTimeout = setTimeout(() => {
    lottieAnimation.stop();
  }, maxLottieDuration);

  // Click to dismiss instantly
  const dismissToast = () => {
    clearTimeout(autoRemoveTimeout);
    clearTimeout(lottieTimeout);
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    toast.style.transition = 'all var(--transition-base, 0.3s ease)';
    setTimeout(() => {
      lottieAnimation.destroy();
      toast.remove();
    }, 300);
  };

  toast.addEventListener('click', dismissToast);

  // Auto-remove after duration
  const autoRemoveTimeout = setTimeout(() => {
    dismissToast();
  }, duration);
}

// Make it globally available
if (typeof window !== 'undefined') {
  (window as any).showToast = showToast;
}
