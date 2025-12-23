/**
 * Contact Popup JavaScript
 * Handles contact form modal functionality
 */

class ContactPopup {
  constructor() {
    this.popup = document.getElementById('contactPopup');
    this.form = document.getElementById('contactForm');
    this.submitBtn = document.getElementById('submitContact');
    this.topicBtns = document.querySelectorAll('.contact-popup__topic-btn');
    this.formInputs = {
      name: document.getElementById('contactName'),
      email: document.getElementById('contactEmail'),
      message: document.getElementById('contactMessage')
    };
    this.selectedTopic = '';
    this.init();
  }

  init() {
    // Close button events
    document.getElementById('closePopup')?.addEventListener('click', () => this.closePopup());
    document.getElementById('closePopupDesktop')?.addEventListener('click', () => this.closePopup());

    // Success close button
    document.querySelector('.contact-popup__success-btn')?.addEventListener('click', () => this.closePopup());

    // Backdrop click to close
    this.popup?.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.closePopup();
      }
    });

    // Topic button events
    this.topicBtns.forEach((btn) => {
      btn.addEventListener('click', () => this.selectTopic(btn));
    });

    // Form input events for validation
    Object.values(this.formInputs).forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.updateSubmitButton());
      }
    });

    // Form submit event
    this.form?.addEventListener('submit', (e) => this.handleSubmit(e));

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.closePopup();
      }
    });

    // Expose global functions
    window.openContactPopup = () => this.openPopup();
    window.closeContactPopup = () => this.closePopup();
  }

  openPopup() {
    this.popup?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closePopup() {
    this.popup?.classList.remove('show');
    document.body.style.overflow = '';

    // Reset to form view after animation
    setTimeout(() => {
      this.resetToFormView();
    }, 300);
  }

  resetToFormView() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm && successMessage) {
      contactForm.style.display = 'flex';
      successMessage.style.display = 'none';
    }

    this.resetForm();
  }

  isOpen() {
    return this.popup?.classList.contains('show') ?? false;
  }

  selectTopic(btn) {
    this.topicBtns.forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    this.selectedTopic = btn.getAttribute('data-topic') || '';

    // If "This page" is selected, pre-fill or append page info to message
    const includePage = btn.getAttribute('data-include-page') === 'true';
    if (includePage && this.formInputs.message) {
      const currentUrl = window.location.href;
      const pageInfo = `\n\n---\nPage: ${currentUrl}`;

      // Only add if not already present
      if (!this.formInputs.message.value.includes(pageInfo)) {
        this.formInputs.message.value = (this.formInputs.message.value.trim() + pageInfo).trim();
      }
    }

    this.updateSubmitButton();
  }

  updateSubmitButton() {
    const name = this.formInputs.name?.value.trim() || '';
    const email = this.formInputs.email?.value.trim() || '';
    const message = this.formInputs.message?.value.trim() || '';

    const isValid = this.selectedTopic && name && email && message;

    if (this.submitBtn) {
      this.submitBtn.disabled = !isValid;
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const name = this.formInputs.name?.value.trim() || '';
    const email = this.formInputs.email?.value.trim() || '';
    const message = this.formInputs.message?.value.trim() || '';

    if (!this.selectedTopic || !name || !email || !message) {
      return;
    }

    // Disable submit and show loading
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = 'Sending...';
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject: this.selectedTopic,
          message,
          page: window.location.pathname
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        this.showSuccessMessage();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);

      const contactEmail = this.popup?.getAttribute('data-contact-email') || '';

      if (window.showToast) {
        window.showToast('Failed to send message. Please try again or email us directly.', 'error');
      } else {
        alert(`Failed to send message. Please try again or email us directly at ${contactEmail}`);
      }

      // Re-enable submit
      if (this.submitBtn) {
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = 'Send Message';
      }
    }
  }

  showSuccessMessage() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm && successMessage) {
      contactForm.style.display = 'none';
      successMessage.style.display = 'flex';
    }

    // Reset submit button
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = 'Send Message';
    }
  }

  resetForm() {
    this.selectedTopic = '';

    // Clear inputs
    Object.values(this.formInputs).forEach(input => {
      if (input) input.value = '';
    });

    // Clear topic selection
    this.topicBtns.forEach((btn) => btn.classList.remove('selected'));

    // Disable submit
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = 'Send Message';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ContactPopup());
} else {
  new ContactPopup();
}

// Support Astro page transitions
document.addEventListener('astro:page-load', () => new ContactPopup());

// Export for module systems
export default ContactPopup;
