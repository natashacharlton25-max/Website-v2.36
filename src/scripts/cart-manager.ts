/**
 * Cart Manager - Shopping cart functionality
 * Handles cart rendering, item management, and localStorage persistence
 */

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

let items: CartItem[] = [];

function load() {
  const saved = localStorage.getItem('cartItems');
  if (saved) {
    items = JSON.parse(saved);
  }
  render();
}

function save() {
  localStorage.setItem('cartItems', JSON.stringify(items));
  document.dispatchEvent(new CustomEvent('cart:updated', {
    detail: { count: items.length }
  }));
}

function render() {
  const container = document.getElementById('cart-content');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
        </svg>
        <h2>Your cart is empty</h2>
        <p>Add some items to get started</p>
        <a href="/assets" class="btn btn-primary btn-md">Browse Products</a>
      </div>
    `;
    return;
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  container.innerHTML = `
    <div class="cart-items">
      ${items.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image || ''}" alt="${item.name}" onerror="if(!this.dataset.fallback){this.dataset.fallback='1';this.src='/MiniKart/MiniKart-Fallback-'+Math.ceil(Math.random()*10)+'.png';}">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}</div>
          </div>
          <button class="cart-item-remove" data-idx="${idx}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      `).join('')}
    </div>

    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${total === 0 ? 'Free' : `$${total.toFixed(2)}`}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>Instant</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>${total === 0 ? 'Free' : `$${total.toFixed(2)}`}</span>
      </div>
      <a href="/checkout" class="btn btn-primary btn-lg btn-block">
        Proceed to Checkout
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
        </svg>
      </a>
    </div>
  `;

  // Events
  container.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget as HTMLElement;
      const idx = parseInt(el.dataset.idx || '0');
      items.splice(idx, 1);
      save();
      render();
    });
  });
}

// Initialize on page load
load();
