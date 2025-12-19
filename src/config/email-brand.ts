/**
 * Email Brand Configuration
 *
 * Customize these tokens for each client's branding.
 * Used across all email templates (booking confirmation, reminders, etc.)
 */

export interface EmailBrandConfig {
  // Business Info
  businessName: string;
  logoUrl?: string;
  website?: string;
  phone?: string;
  address?: string;

  // Colors (hex values)
  primaryColor: string;
  primaryColorDark: string;
  primaryColorLight: string;
  textColor: string;
  textColorLight: string;
  backgroundColor: string;
  cardBackground: string;

  // Social Links (optional)
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };

  // Footer
  footerText?: string;
  unsubscribeUrl?: string;
}

// Default brand config - override per client
export const emailBrand: EmailBrandConfig = {
  // Business Info - customize these
  businessName: import.meta.env.EMAIL_FROM_NAME || 'Your Business',
  logoUrl: import.meta.env.EMAIL_LOGO_URL || undefined,
  website: import.meta.env.PUBLIC_SITE_URL || undefined,
  phone: import.meta.env.BUSINESS_PHONE || undefined,
  address: import.meta.env.BUSINESS_ADDRESS || undefined,

  // Colors - match your brand
  primaryColor: '#2dd4bf',      // Teal - main accent
  primaryColorDark: '#14b8a6',  // Darker teal for gradients
  primaryColorLight: '#f0fdfa', // Light teal for backgrounds
  textColor: '#333333',         // Main text
  textColorLight: '#666666',    // Secondary text
  backgroundColor: '#f5f5f5',   // Page background
  cardBackground: '#ffffff',    // Card/container background

  // Social Links
  socialLinks: {
    // facebook: 'https://facebook.com/yourbusiness',
    // instagram: 'https://instagram.com/yourbusiness',
  },

  // Footer
  footerText: 'Questions? Reply to this email or contact us.',
};

/**
 * Generate inline styles for email elements
 */
export const emailStyles = {
  // Container
  body: `margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${emailBrand.backgroundColor};`,

  // Header
  header: `background: linear-gradient(135deg, ${emailBrand.primaryColor} 0%, ${emailBrand.primaryColorDark} 100%); padding: 40px; text-align: center;`,
  headerTitle: `margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;`,
  headerSubtitle: `margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;`,

  // Content
  content: `padding: 40px;`,
  greeting: `margin: 0 0 20px; font-size: 16px; color: ${emailBrand.textColor};`,
  paragraph: `margin: 0 0 30px; font-size: 16px; color: ${emailBrand.textColorLight}; line-height: 1.6;`,

  // Details Card
  detailsCard: `background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px;`,
  detailLabel: `padding: 8px 0; color: ${emailBrand.textColorLight};`,
  detailValue: `padding: 8px 0; font-weight: 600; color: ${emailBrand.textColor};`,

  // Buttons
  primaryButton: `display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, ${emailBrand.primaryColor} 0%, ${emailBrand.primaryColorDark} 100%); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;`,
  secondaryButton: `display: inline-block; padding: 12px 24px; background: transparent; border: 2px solid ${emailBrand.primaryColor}; color: ${emailBrand.primaryColor}; text-decoration: none; font-weight: 600; font-size: 14px; border-radius: 8px;`,

  // Links
  link: `color: ${emailBrand.primaryColor}; text-decoration: none; font-weight: 600;`,

  // Footer
  footer: `background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #eee;`,
  footerText: `margin: 0; font-size: 14px; color: #999;`,
  footerLink: `color: #999; text-decoration: underline;`,

  // Social Icons
  socialIcon: `display: inline-block; margin: 0 8px; width: 32px; height: 32px;`,
};

/**
 * Generate logo HTML if configured
 */
export function getLogoHTML(): string {
  if (!emailBrand.logoUrl) return '';

  return `
    <img
      src="${emailBrand.logoUrl}"
      alt="${emailBrand.businessName}"
      style="max-width: 150px; height: auto; margin-bottom: 20px;"
    />
  `;
}

/**
 * Generate social links HTML
 */
export function getSocialLinksHTML(): string {
  const { socialLinks } = emailBrand;
  if (!socialLinks) return '';

  const links: string[] = [];

  if (socialLinks.facebook) {
    links.push(`<a href="${socialLinks.facebook}" style="${emailStyles.socialIcon}">FB</a>`);
  }
  if (socialLinks.instagram) {
    links.push(`<a href="${socialLinks.instagram}" style="${emailStyles.socialIcon}">IG</a>`);
  }
  if (socialLinks.twitter) {
    links.push(`<a href="${socialLinks.twitter}" style="${emailStyles.socialIcon}">X</a>`);
  }
  if (socialLinks.linkedin) {
    links.push(`<a href="${socialLinks.linkedin}" style="${emailStyles.socialIcon}">LI</a>`);
  }

  if (links.length === 0) return '';

  return `<div style="margin-bottom: 15px;">${links.join('')}</div>`;
}

/**
 * Generate footer HTML with business info
 */
export function getFooterHTML(): string {
  const parts: string[] = [];

  // Social links
  const socialHTML = getSocialLinksHTML();
  if (socialHTML) parts.push(socialHTML);

  // Main footer text
  parts.push(`<p style="${emailStyles.footerText}">${emailBrand.footerText}</p>`);

  // Business info
  const businessInfo: string[] = [];
  if (emailBrand.website) {
    businessInfo.push(`<a href="${emailBrand.website}" style="${emailStyles.footerLink}">${emailBrand.website.replace('https://', '')}</a>`);
  }
  if (emailBrand.phone) {
    businessInfo.push(emailBrand.phone);
  }
  if (emailBrand.address) {
    businessInfo.push(emailBrand.address);
  }

  if (businessInfo.length > 0) {
    parts.push(`<p style="${emailStyles.footerText}; margin-top: 10px;">${businessInfo.join(' | ')}</p>`);
  }

  return parts.join('');
}
