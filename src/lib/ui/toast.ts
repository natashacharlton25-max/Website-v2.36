/**
 * Toast Notification Utility
 *
 * Clones a pre-rendered <template id="toast-tpl"> built by the layout
 * at build time. Theme, animation, and LottieIcon are baked in from
 * site config — toast.ts only sets the message and manages lifecycle.
 *
 * Usage:
 *   import { showToast } from '../lib/ui/toast';
 *   showToast({ message: 'Saved!' });
 *   showToast({ message: 'Done!', duration: 3000 });
 */

export type ToastPresetIcon = 'activity' | 'notification' | 'alert' | 'info' | 'thumbup';

export interface ToastOptions {
  message: string;
  icon?: ToastPresetIcon | string;
  duration?: number;
}

export function showToast(options: ToastOptions): void {
  const {
    message,
    duration = 5000,
  } = options;

  // Single template — site icon chosen at build time
  const template = document.getElementById('toast-tpl') as HTMLTemplateElement | null;
  if (!template) return;

  // Get or create container
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Clone template content
  const clone = template.content.cloneNode(true) as DocumentFragment;
  const toast = clone.firstElementChild as HTMLElement;
  if (!toast) return;

  // Set message text
  const messageEl = toast.querySelector('.toast__message');
  if (messageEl) messageEl.textContent = message;

  // Set icon from API if slug provided — replaces Lottie icon with static Phosphor
  if (options.icon) {
    const lottieSlot = toast.querySelector('.toast__lottie') as HTMLElement;
    fetch(`https://asset-library.natashacharlton25.workers.dev/v1/assets/${options.icon}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.currentVersion?.content) {
          const iconEl = document.createElement('span');
          iconEl.className = 'toast__icon';
          iconEl.setAttribute('aria-hidden', 'true');
          iconEl.innerHTML = data.currentVersion.content;
          const svg = iconEl.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', '24');
            svg.setAttribute('height', '24');
            svg.style.fill = 'currentColor';
          }
          if (lottieSlot) {
            lottieSlot.replaceWith(iconEl);
          } else {
            toast.prepend(iconEl);
          }
        }
      })
      .catch(() => { /* keep existing template icon */ });
  }

  // Set duration attribute
  if (duration) {
    toast.setAttribute('data-duration', String(duration));
  }

  // Add to container
  container.appendChild(toast);

  // Focus toast for keyboard users
  toast.focus();

  // Initialise LottieIcon on the cloned element
  // LottieIcon's script listens for astro:page-load and scans [data-lottie-icon]
  const lottieEl = toast.querySelector('[data-lottie-icon]') as HTMLElement | null;
  if (lottieEl) {
    document.dispatchEvent(new Event('astro:page-load'));
  }

  // Dismiss handler
  const dismissToast = () => {
    clearTimeout(autoRemoveTimeout);
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    setTimeout(() => {
      toast.remove();
      if (container && container.children.length === 0) {
        container.remove();
      }
    }, 300);
  };

  // Click to dismiss
  toast.addEventListener('click', dismissToast);

  // Keyboard dismiss — Escape or Enter
  toast.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.preventDefault();
      dismissToast();
    }
  });

  // Auto-dismiss (0 = manual only)
  const autoRemoveTimeout = duration > 0
    ? setTimeout(dismissToast, duration)
    : 0 as unknown as ReturnType<typeof setTimeout>;
}

/* ==========================================================
   GLOBAL ACCESS — for non-module consumers
   ========================================================== */

if (typeof window !== 'undefined') {
  (window as any).showToast = showToast;
}
