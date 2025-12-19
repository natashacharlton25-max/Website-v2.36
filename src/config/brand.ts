/**
 * Brand Configuration
 *
 * Central place to manage all brand-specific information.
 * Update these values to customize the template for your brand.
 */

export const BRAND_CONFIG = {
  // Brand Identity
  name: 'Walking with a Smile',
  tagline: 'Your Tagline Here',
  description: 'Supporting trauma recovery and healing. Resources to help you move from survival to living, at your own pace.',

  // Contact Information
  contact: {
    email: 'hello@walkingwithasmile.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Your Street',
      city: 'Your City',
      state: 'Your State',
      zip: '12345',
      country: 'Your Country'
    }
  },

  // Legal Contact
  legal: {
    email: 'legal@walkingwithasmile.com',
    privacy_email: 'privacy@walkingwithasmile.com',
    support_email: 'support@walkingwithasmile.com'
  },

  // Website URLs
  urls: {
    site: 'https://walkingwithasmile.com',
    domain: 'walkingwithasmile.com'
  },

  // Social Media Links
  social: {
    twitter: 'https://twitter.com/walkingwithasmile',
    facebook: 'https://facebook.com/walkingwithasmile',
    instagram: 'https://instagram.com/walkingwithasmile',
    linkedin: 'https://linkedin.com/company/walkingwithasmile',
    github: 'https://github.com/walkingwithasmile',
    youtube: 'https://youtube.com/@walkingwithasmile'
  },

  // Business Information
  business: {
    founded: '2024',
    registrationNumber: 'YOUR-REG-NUMBER',
    vatNumber: 'YOUR-VAT-NUMBER',
    jurisdiction: 'Your Jurisdiction'
  },

  // SEO Defaults
  seo: {
    defaultTitle: 'Walking with a Smile | Your Tagline',
    titleTemplate: '%s | Walking with a Smile',
    defaultDescription: 'Your SEO description here',
    defaultImage: '/og-image.jpg',
    twitter: '@walkingwithasmile'
  },

  // Features
  features: {
    ecommerce: false, // Disabled - using free downloads instead
    blog: true,
    newsletter: true,
    cookieConsent: true,
    freeDownloads: true // New feature for free downloads
  },

  // Integration Keys (Add your actual keys in .env file)
  // These are just identifiers, actual keys should be in environment variables
  integrations: {
    googleAnalytics: 'GA_MEASUREMENT_ID',
    emaillitApiKey: 'EMAILLIT_API_KEY' // Using Emaillit for newsletter
  }
};

// Helper function to get full address string
export function getFullAddress(): string {
  const { street, city, state, zip, country } = BRAND_CONFIG.contact.address;
  return `${street}, ${city}, ${state} ${zip}, ${country}`;
}

// Helper function to format phone for display
export function getFormattedPhone(): string {
  return BRAND_CONFIG.contact.phone;
}

// Helper function to get contact email
export function getContactEmail(): string {
  return BRAND_CONFIG.contact.email;
}
