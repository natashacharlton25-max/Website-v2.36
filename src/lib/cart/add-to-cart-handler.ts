/**
 * Add to Cart Button Handler
 *
 * Handles add-to-cart button clicks and integrates with global MiniCart system
 * Used on product/asset cards across the site
 */

export function initAddToCartHandlers() {
  // Add to cart button handlers - use global cart system from MiniCart
  document.querySelectorAll('.js-add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const btn = e.currentTarget as HTMLElement;
      const productData = {
        id: btn.dataset.productId,
        name: btn.dataset.productName,
        price: parseFloat(btn.dataset.productPrice || '0'),
        image: btn.dataset.productImage
      };

      // Use the global addToCart function from MiniCart
      if ((window as any).addToCart) {
        (window as any).addToCart(productData);
      } else {
        console.warn('Cart system not initialized');
      }
    });
  });
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAddToCartHandlers);
} else {
  initAddToCartHandlers();
}
