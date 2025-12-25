// Form submission - Newsletter signup
const newsletterForm = document.getElementById('newsletter-form');
const submitButton = document.getElementById('submit-button');
const buttonText = document.getElementById('button-text');
const buttonSpinner = document.getElementById('button-spinner');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!submitButton || !buttonText || !buttonSpinner) return;

    // Get form data
    const formData = new FormData(newsletterForm as HTMLFormElement);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      newsletter: formData.get('newsletter') === 'on',
      downloads: JSON.parse(localStorage.getItem('shopping_cart') || '{"items":[]}').items
    };

    // Disable button and show loading state
    submitButton.setAttribute('disabled', 'true');
    buttonText.style.display = 'none';
    buttonSpinner.style.display = 'inline';

    try {
      // TODO: Send to your newsletter/email service (Emaillit)
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success - clear cart and show success message
      localStorage.removeItem('shopping_cart');

      // Redirect to a thank you page or show success message
      alert('Success! Check your email for download links.');
      window.location.href = '/';

    } catch (error) {
      console.error('Newsletter signup error:', error);
      alert('An error occurred. Please try again.');

      // Reset button
      submitButton.removeAttribute('disabled');
      buttonText.style.display = 'inline';
      buttonSpinner.style.display = 'none';
    }
  });
}
