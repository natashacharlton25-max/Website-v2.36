/**
 * Cookie Banner - GDPR Consent Logic
 *
 * Handles cookie consent preferences with options for:
 * - Essential cookies (required)
 * - Analytics cookies (optional)
 * - Marketing cookies (optional)
 */

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const COOKIE_CONSENT_KEY = 'cookieConsent';

/**
 * Save cookie consent preferences to localStorage
 */
function setCookieConsent(preferences: CookiePreferences): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
}

/**
 * Get cookie consent preferences from localStorage
 */
function getCookieConsent(): CookiePreferences | null {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent ? JSON.parse(consent) : null;
}

/**
 * Hide the cookie banner
 */
function hideCookieBanner(): void {
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.classList.add('hidden');
  }
}

/**
 * Show the customization panel
 */
function showCustomizePanel(): void {
  const panel = document.getElementById('cookieCustomizePanel');
  if (panel) {
    panel.style.display = 'block';
  }
}

/**
 * Hide the customization panel
 */
function hideCustomizePanel(): void {
  const panel = document.getElementById('cookieCustomizePanel');
  if (panel) {
    panel.style.display = 'none';
  }
}

/**
 * Show toast notification if available
 */
function showToastNotification(message: string): void {
  (window as any).showToast?.({
    message,
    type: 'success'
  });
}

/**
 * Initialize cookie banner event listeners
 */
function initCookieBanner(): void {
  // Accept All Cookies
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    const preferences: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    setCookieConsent(preferences);
    hideCookieBanner();
    showToastNotification('Cookie preferences saved');
  });

  // Reject All Cookies
  document.getElementById('cookieReject')?.addEventListener('click', () => {
    const preferences: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    setCookieConsent(preferences);
    hideCookieBanner();
    showToastNotification('Cookie preferences saved');
  });

  // Show Customize Panel
  document.getElementById('cookieCustomize')?.addEventListener('click', () => {
    showCustomizePanel();
  });

  // Cancel Customization
  document.getElementById('cookiePanelCancel')?.addEventListener('click', () => {
    hideCustomizePanel();
  });

  // Save Custom Preferences
  document.getElementById('cookiePanelSave')?.addEventListener('click', () => {
    const analytics = (document.getElementById('analyticsConsent') as HTMLInputElement)?.checked || false;
    const marketing = (document.getElementById('marketingConsent') as HTMLInputElement)?.checked || false;

    const preferences: CookiePreferences = {
      essential: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString()
    };

    setCookieConsent(preferences);
    hideCustomizePanel();
    hideCookieBanner();
    showToastNotification('Cookie preferences saved');
  });

  // Check if user has already given consent and hide banner if so
  const existingConsent = getCookieConsent();
  if (existingConsent) {
    hideCookieBanner();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initCookieBanner);

// Export function to get consent status (available globally)
(window as any).getCookieConsent = getCookieConsent;
