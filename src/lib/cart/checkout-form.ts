/**
 * Checkout Form Handler
 * Submits form data to API, handles verification flow
 */

// Form elements
const newsletterForm = document.getElementById('newsletter-form');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const buttonSpinner = document.getElementById('button-spinner');

// Response message container (will be created if not exists)
let messageContainer: HTMLElement | null = null;

function showMessage(type: 'success' | 'error' | 'info', message: string) {
  // Remove existing message
  if (messageContainer) {
    messageContainer.remove();
  }

  // Create message container
  messageContainer = document.createElement('div');
  messageContainer.className = `checkout-message checkout-message--${type}`;
  messageContainer.innerHTML = `
    <div class="checkout-message__content">
      <span class="checkout-message__icon">
        ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
      </span>
      <span class="checkout-message__text">${message}</span>
    </div>
  `;

  // Insert after form
  newsletterForm?.parentNode?.insertBefore(messageContainer, newsletterForm.nextSibling);

  // Auto-remove success/info messages after 10 seconds
  if (type !== 'error') {
    setTimeout(() => {
      messageContainer?.remove();
    }, 10000);
  }
}

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
      showMessage('error', 'Your cart is empty. Please add some items before checking out.');
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
      showMessage('error', 'Please fill in all required fields.');
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
          showMessage('error', result.message);
          resetButton();
          return;
        }

        if (result.error === 'too_many_downloads') {
          showMessage('error', result.message);
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
        showMessage('success', result.message);

        // Redirect to home after delay
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        // New user - needs to verify email
        showMessage('info', result.message);

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
      showMessage('error', error instanceof Error ? error.message : 'An error occurred. Please try again.');
      resetButton();
    }
  });
}

// Add styles for messages
const style = document.createElement('style');
style.textContent = `
  .checkout-message {
    margin-top: var(--space-md);
    padding: var(--space-md);
    border-radius: var(--border-radius-md);
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .checkout-message--success {
    background: color-mix(in oklch, var(--color-Success) 10%, transparent);
    border: 1px solid color-mix(in oklch, var(--color-Success) 30%, transparent);
    color: var(--brand-c-text-dark);
  }

  .checkout-message--error {
    background: color-mix(in oklch, var(--color-Error) 10%, transparent);
    border: 1px solid color-mix(in oklch, var(--color-Error) 30%, transparent);
    color: var(--brand-c-text-dark);
  }

  .checkout-message--info {
    background: var(--brand-c-primary-light);
    border: 1px solid var(--brand-c-primary-light);
    color: var(--brand-c-primary-dark);
  }

  .checkout-message__content {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .checkout-message__icon {
    font-size: var(--text-h5);
    font-weight: bold;
  }

  .checkout-message__text {
    font-size: var(--text-small);
    line-height: 1.5;
  }

  .checkout-verify-prompt {
    text-align: center;
    padding: var(--space-2xl) var(--space-lg);
  }

  .checkout-verify-icon {
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
