/**
 * Cart Icon - Lottie Animation Controller
 *
 * Handles animated shopping cart icon with different states:
 * - Idle: static (no animation)
 * - Hover: hover-pinch animation
 * - Add to cart: morph-fill animation
 * - Initial load: in-reveal animation (optional)
 */

import lottie from 'lottie-web';
import type { AnimationItem } from 'lottie-web';

// Animation paths
const animations = {
  reveal: '/Icons/Animated%20Icons/Basket%20Icons/lottie-basket-in-reveal.json',
  loop: '/Icons/Animated%20Icons/Basket%20Icons/lottie-basket-loop-cycle.json',
  hover: '/Icons/Animated%20Icons/Basket%20Icons/lottie-basket-hover-pinch.json',
  addToCart: '/Icons/Animated%20Icons/Basket%20Icons/lottie-basket-morph-fill.json',
};

let currentAnimation: AnimationItem | null = null;
let currentState: 'idle' | 'hover' | 'adding' = 'idle';
let cartCount = 0;
let isInitialized = false;

/**
 * Load and play animation
 */
function loadAnimation(
  lottieContainer: HTMLElement,
  cartIconWrapper: HTMLElement,
  type: keyof typeof animations,
  loop: boolean = false,
  autoplay: boolean = true,
  onComplete?: () => void
): AnimationItem | null {
  // Destroy previous animation
  if (currentAnimation) {
    currentAnimation.destroy();
    currentAnimation = null;
  }

  try {
    const anim = lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop,
      autoplay,
      path: animations[type],
    });

    anim.addEventListener('DOMLoaded', () => {
      console.log(`Animation ${type} loaded`);
      // Mark as loaded to hide static fallback
      cartIconWrapper?.classList.add('lottie-loaded');
    });

    anim.addEventListener('error', (e) => {
      console.error(`Animation ${type} error:`, e);
    });

    if (onComplete) {
      anim.addEventListener('complete', onComplete);
    }

    currentAnimation = anim;
    return anim;
  } catch (e) {
    console.error('Failed to load animation:', e);
    return null;
  }
}

/**
 * Show static frame - use hover animation at last frame for neutral position
 */
function showStatic(lottieContainer: HTMLElement, cartIconWrapper: HTMLElement) {
  const anim = loadAnimation(lottieContainer, cartIconWrapper, 'hover', false, false);
  if (anim) {
    // Wait for animation to load, then go to last frame (neutral basket position)
    anim.addEventListener('DOMLoaded', () => {
      const totalFrames = anim.totalFrames;
      anim.goToAndStop(totalFrames - 1, true);
    });
  }
}

/**
 * Initialize cart icon animations
 */
function initCartIcon() {
  const cartIconWrapper = document.getElementById('cart-icon');
  const lottieContainer = document.getElementById('lottie-basket');
  const cartNumber = cartIconWrapper?.querySelector('.cart-icon__count') as HTMLElement;

  if (!lottieContainer || !cartIconWrapper) {
    console.log('Cart icon elements not found');
    return;
  }

  const showOnReveal = cartIconWrapper.dataset.reveal === 'true';

  // Initial state
  if (showOnReveal) {
    loadAnimation(lottieContainer, cartIconWrapper, 'reveal', false, true, () => {
      showStatic(lottieContainer, cartIconWrapper);
      isInitialized = true;
    });
  } else {
    showStatic(lottieContainer, cartIconWrapper);
    isInitialized = true;
  }

  // Hover handlers
  cartIconWrapper.addEventListener('mouseenter', () => {
    if (currentState === 'adding' || !isInitialized) return;
    currentState = 'hover';

    // Load hover animation and play from start
    const anim = loadAnimation(lottieContainer, cartIconWrapper, 'hover', false, true);
    if (anim) {
      anim.addEventListener('complete', () => {
        // After hover animation completes, stay at last frame (neutral)
        if (currentState === 'hover') {
          currentState = 'idle';
          // Don't reload - just stay at last frame which is neutral position
        }
      });
    }
  });

  cartIconWrapper.addEventListener('mouseleave', () => {
    if (currentState === 'adding') return;
    // On mouse leave, go back to static (last frame of hover = neutral)
    currentState = 'idle';
    showStatic(lottieContainer, cartIconWrapper);
  });

  // Listen for cart updates
  const handleCartUpdate = (e: Event) => {
    const customEvent = e as CustomEvent;
    const newCount = customEvent.detail?.count || 0;

    console.log('Cart updated:', newCount, 'previous:', cartCount);

    // Only play add animation if count increased
    if (newCount > cartCount) {
      console.log('Playing add-to-cart animation');
      currentState = 'adding';
      loadAnimation(lottieContainer, cartIconWrapper, 'addToCart', false, true, () => {
        console.log('Add animation complete');
        currentState = 'idle';
        showStatic(lottieContainer, cartIconWrapper);
      });
    }

    cartCount = newCount;

    if (cartNumber) {
      cartNumber.textContent = cartCount.toString();

      if (cartCount > 0) {
        cartNumber.classList.add('cart-icon__count--visible');
      } else {
        cartNumber.classList.remove('cart-icon__count--visible');
      }

      // Pulse animation on number
      cartNumber.classList.remove('cart-icon__count--pulse');
      requestAnimationFrame(() => {
        cartNumber.classList.add('cart-icon__count--pulse');
      });
    }
  };

  document.addEventListener('cart:updated', handleCartUpdate);

  console.log('Cart icon initialized');
}

/**
 * Toggle mini cart on click - separate from Lottie init to always work
 */
function setupCartToggle() {
  const cartIconWrapper = document.getElementById('cart-icon');
  if (!cartIconWrapper) return;

  cartIconWrapper.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent outside-click handler from immediately closing
    const miniCart = document.getElementById('mini-cart');
    if (miniCart) {
      miniCart.classList.toggle('visible');
      console.log('Mini cart toggled:', miniCart.classList.contains('visible'));
    } else {
      console.error('Mini cart element not found');
    }
  });
}

/**
 * Sync cart count from localStorage (handles race condition with MiniCart)
 */
function syncCartCountFromStorage() {
  const cartNumber = document.querySelector('.cart-icon__count') as HTMLElement;
  if (!cartNumber) return;

  try {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      const items = JSON.parse(saved);
      const count = Array.isArray(items) ? items.length : 0;
      if (count > 0) {
        cartNumber.textContent = count.toString();
        cartNumber.classList.add('cart-icon__count--visible');
      }
    }
  } catch (e) {
    console.error('Error syncing cart count:', e);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCartIcon();
    setupCartToggle();
  });
} else {
  initCartIcon();
  setupCartToggle();
}

// Run sync after a short delay to ensure DOM is ready
setTimeout(syncCartCountFromStorage, 100);
