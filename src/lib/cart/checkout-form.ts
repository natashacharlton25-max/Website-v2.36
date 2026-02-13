/**
 * Checkout Form Handler
 * Submits form data to API, handles verification flow
 */

import { showToast } from '../ui/toast';

// Form elements
const newsletterForm = document.getElementById('newsletter-form');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const buttonSpinner = document.getElementById('button-spinner');

function resetButton() {
  if (submitButton && buttonText && buttonSpinner) {
    submitButton.removeAttribute('disabled');
    buttonText.style.display = 'inline';
    buttonSpinner.style.display = 'none';
  }
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!submitButton || !buttonText || !buttonSpinner) return;

    // Get form data
    const formData = new FormData(newsletterForm as HTMLFormElement);
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');

    // Validate cart has items
    if (!cartItems.length) {
      showToast({ message: 'Your cart is empty. Please add some items before checking out.', theme: 'professional' });
      return;
    }

    // Prepare request data
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      newsletter: formData.get('newsletter') === 'on',
      downloads: cartItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug
      }))
    };

    // Validate required fields
    if (!data.firstName || !data.email) {
      showToast({ message: 'Please fill in all required fields.', theme: 'professional' });
      return;
    }

    // Disable button and show loading state
    submitButton.setAttribute('disabled', 'true');
    buttonText.style.display = 'none';
    buttonSpinner.style.display = 'inline';

    try {
      // Submit to checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (result.error === 'download_limit_reached') {
          showToast({ message: result.message, theme: 'professional' });
          resetButton();
          return;
        }

        if (result.error === 'too_many_downloads') {
          showToast({ message: result.message, theme: 'professional' });
          resetButton();
          return;
        }

        throw new Error(result.error || 'An error occurred');
      }

      // Success - clear cart
      localStorage.removeItem('cartItems');

      // Notify other components that cart was cleared
      document.dispatchEvent(new CustomEvent('cart:updated', {
        detail: { count: 0 }
      }));

      // Show success message based on whether verified or not
      if (result.verified) {
        // Already verified user - downloads sent directly
        showToast({ message: result.message, theme: 'professional' });

        // Redirect to home after delay
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        // New user - needs to verify email
        showToast({ message: result.message, theme: 'professional' });

        // Update form to show "check email" state
        if (newsletterForm) {
          newsletterForm.innerHTML = `
            <div class="checkout-verify-prompt">
              <div class="checkout-verify-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"></path>
                </svg>
              </div>
              <h3 class="checkout-verify-title">Check Your Email</h3>
              <p class="checkout-verify-text">
                We've sent a verification link to <strong>${data.email}</strong>
              </p>
              <p class="checkout-verify-note">
                Click the link in the email to verify your address and receive your download links.
                Don't forget to check your spam folder!
              </p>
            </div>
          `;
        }
      }

    } catch (error) {
      console.error('Checkout error:', error);
      showToast({ message: error instanceof Error ? error.message : 'An error occurred. Please try again.', theme: 'professional' });
      resetButton();
    }
  });
}

// Add styles for verify prompt
const style = document.createElement('style');
style.textContent = `
  .checkout-verify-prompt {
    text-align: center;
    padding: 0;
  }

  .checkout-verify-icon {
    display: flex;
    justify-content: center;
    color: var(--brand-c-primary);
    margin-bottom: var(--space-lg);
  }

  .checkout-verify-title {
    font-family: var(--font-heading);
    font-size: var(--text-h4);
    font-weight: var(--font-bold);
    color: var(--brand-c-text);
    margin-bottom: var(--space-md);
  }

  .checkout-verify-text {
    font-size: var(--text-body);
    color: var(--brand-c-text);
    margin-bottom: var(--space-md);
  }

  .checkout-verify-note {
    font-size: var(--text-small);
    color: var(--brand-c-text-light);
    background: var(--brand-c-neutral-light);
    padding: var(--space-md);
    border-radius: var(--border-radius-md);
  }
`;
document.head.appendChild(style);
