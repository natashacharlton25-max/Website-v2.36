// Contact Popup JavaScript

class ContactPopup {
  constructor() {
    console.log('ContactPopup initializing...');
    this.popup = document.getElementById('contactPopup');
    this.closeBtn = document.getElementById('closePopup');
    this.submitBtn = document.getElementById('submitContact');
    this.topicBtns = document.querySelectorAll('.topic-btn');
    this.formInputs = {
      name: document.getElementById('contactName'),
      email: document.getElementById('contactEmail'),
      message: document.getElementById('contactMessage')
    };
    
    console.log('ContactPopup elements:', { popup: this.popup, closeBtn: this.closeBtn, topicBtns: this.topicBtns.length });
    
    this.selectedTopic = '';
    this.formData = {
      name: '',
      email: '',
      message: ''
    };
    
    this.init();
  }

  init() {
    // Close button event
    this.closeBtn?.addEventListener('click', () => this.closePopup());
    
    // Backdrop click to close
    this.popup?.addEventListener('click', (e) => {
      if (e.target === this.popup) {
        this.closePopup();
      }
    });
    
    // Topic button events
    this.topicBtns.forEach(btn => {
      btn.addEventListener('click', () => this.selectTopic(btn));
    });
    
    // Form input events
    Object.entries(this.formInputs).forEach(([key, input]) => {
      if (input) {
        input.addEventListener('input', (e) => this.handleInputChange(key, e.target.value));
      }
    });
    
    // Submit button event
    this.submitBtn?.addEventListener('click', () => this.handleSubmit());
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.closePopup();
      }
    });
    
    // Expose global function to open popup
    window.openContactPopup = () => this.openPopup();
  }

  openPopup() {
    console.log('Opening contact popup...', this.popup);
    this.popup?.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    // Auto-select "This page" topic and set current page
    const thisPageBtn = document.querySelector('[data-topic="This page"]');
    if (thisPageBtn) {
      this.selectTopic(thisPageBtn);
    }
  }

  closePopup() {
    this.popup?.classList.remove('show');
    document.body.style.overflow = ''; // Restore scroll
  }

  isOpen() {
    return this.popup?.classList.contains('show');
  }

  selectTopic(btn) {
    // Remove selected from all buttons
    this.topicBtns.forEach(b => b.classList.remove('selected'));
    
    // Add selected to clicked button
    btn.classList.add('selected');
    
    // Store selected topic
    this.selectedTopic = btn.getAttribute('data-topic');
    
    // Update submit button state
    this.updateSubmitButton();
  }

  handleInputChange(field, value) {
    this.formData[field] = value;
    this.updateSubmitButton();
  }

  updateSubmitButton() {
    const isValid = this.selectedTopic && 
                   this.formData.name.trim() && 
                   this.formData.email.trim() && 
                   this.formData.message.trim();
    
    if (this.submitBtn) {
      this.submitBtn.disabled = !isValid;
    }
  }

  handleSubmit() {
    // Validate form
    if (!this.selectedTopic || !this.formData.name.trim() || 
        !this.formData.email.trim() || !this.formData.message.trim()) {
      alert('Please fill in all fields and select a topic.');
      return;
    }

    // Prepare submission data
    const submissionData = {
      topic: this.selectedTopic,
      name: this.formData.name.trim(),
      email: this.formData.email.trim(),
      message: this.formData.message.trim(),
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    };

    // Log the data (replace with actual submission logic)
    console.log('Contact form submitted:', submissionData);

    // Here you would typically send the data to your backend
    // Example:
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submissionData)
    // });

    // Show success message
    alert('Message sent! We\'ll get back to you soon.');

    // Reset form and close
    this.resetForm();
    this.closePopup();
  }

  resetForm() {
    // Clear form data
    this.formData = { name: '', email: '', message: '' };
    this.selectedTopic = '';

    // Clear form inputs
    Object.values(this.formInputs).forEach(input => {
      if (input) input.value = '';
    });

    // Clear topic selection
    this.topicBtns.forEach(btn => btn.classList.remove('selected'));

    // Disable submit button
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ContactPopup();
});

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContactPopup;
}