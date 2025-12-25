/**
 * Product detail page - Add to cart functionality
 * Handles adding products to the cart from product detail pages
 */

// Product detail page - Add to cart functionality
const addToCartWrappers = document.querySelectorAll('.add-to-cart-btn-product');

addToCartWrappers.forEach(wrapper => {
  if (wrapper) {
    wrapper.addEventListener('click', (e) => {
      const wrapperEl = e.currentTarget as HTMLElement;
      const productData = {
        id: wrapperEl.dataset.productId,
        name: wrapperEl.dataset.productName,
        price: parseFloat(wrapperEl.dataset.productPrice || '0'),
        image: wrapperEl.dataset.productImage
      };

      if ((window as any).addToCart) {
        (window as any).addToCart(productData);
      } else {
        console.warn('Cart system not initialized');
      }
    });
  }
});
