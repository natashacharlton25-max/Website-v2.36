/**
 * Site Configuration for Component Library Integration
 *
 * This configuration bridges the astro-component-library with your existing
 * brand theme and provides centralized content management.
 */

export interface SiteConfig {
  // Brand Identity
  brand: {
    name: string;
    tagline: string;
    logo: {
      path: string;
      alt: string;
      fallback: string;
    };
    favicon: string;
  };

  // Contact Information
  contact: {
    email: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };

  // Design System - Maps to your existing OKLCH theme
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      textPrimary: string;
      textLight: string;
      white: string;
      black: string;
      // Color variations
      primaryLight: string;
      primaryDark: string;
      secondaryLight: string;
      secondaryDark: string;
      // Extended palette
      accent1: string;
      accent2: string;
      neutralDark: string;
      neutralMid: string;
      neutralLight: string;
    };
    fonts: {
      body: string;
      heading: string;
      nav: string;
    };
    navigation: {
      height: string;
      mobileHeight: string;
      borderRadius: string;
      mobileBorderRadius: string;
    };
  };

  // Content
  content: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    accessibility: {
      title: string;
      description: string;
    };
    navigation: {
      items: Array<{
        label: string;
        href: string;
        external?: boolean;
      }>;
    };
  };

  // SEO & Meta
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    twitterHandle?: string;
  };
}

// Site configuration - integrated with your existing brand
export const siteConfig: SiteConfig = {
  brand: {
    name: "Your Brand Name",
    tagline: "Your Brand Tagline",
    logo: {
      path: "/images/LogoPlaceholder.png",
      alt: "Brand Logo",
      fallback: "YB"
    },
    favicon: "/Favicon/favicon.ico"
  },

  contact: {
    email: "hello@yourbrand.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Business Street",
      city: "Your City",
      state: "Your State",
      zip: "12345",
      country: "Your Country"
    }
  },

  theme: {
    colors: {
      // These map to your OKLCH colors via component-library-bridge.css
      primary: "#e63961",       // Maps to --color-Primary-500
      secondary: "#184e77",     // Maps to --color-Secondary-500
      background: "#fffaf6",    // Maps to --color-Background-50
      textPrimary: "#5c5b5b",   // Maps to --color-Text-700
      textLight: "#ebdddd",     // Maps to --color-Text-200
      white: "#ffffff",         // Maps to --color-Background-50
      black: "#837474",         // Maps to --color-BackgroundDark-950
      // Color variations
      primaryLight: "#f06b8a",  // Maps to --color-Primary-400
      primaryDark: "#d63456",   // Maps to --color-Primary-600
      secondaryLight: "#2d6b9a",// Maps to --color-Secondary-400
      secondaryDark: "#0f3a5c", // Maps to --color-Secondary-700
      // Extended palette
      accent1: "#ffb703",       // Maps to --color-AccentOne-500
      accent2: "#fb8500",       // Maps to --color-AccentTwo-500
      neutralDark: "#111319",   // Maps to --color-Neutral-900
      neutralMid: "#727586",    // Maps to --color-Neutral-500
      neutralLight: "#e7e8eb"   // Maps to --color-Neutral-100
    },
    fonts: {
      body: "'Poppins', system-ui, -apple-system, sans-serif",
      heading: "'Poppins', system-ui, -apple-system, sans-serif",
      nav: "var(--font-body)"
    },
    navigation: {
      height: "45px",
      mobileHeight: "60px",
      borderRadius: "35px",
      mobileBorderRadius: "30px"
    }
  },

  content: {
    hero: {
      title: "Your Brand Name",
      subtitle: "Your Brand Tagline",
      description: "Creating amazing digital experiences with accessibility at the forefront."
    },
    accessibility: {
      title: "Accessibility Features",
      description: "Customize your experience with our accessible site tools."
    },
    navigation: {
      items: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "For You", href: "/for-you" },
        { label: "Assets", href: "/assets" },
        { label: "Insights", href: "/insights" },
        { label: "Services", href: "/services" },
        { label: "Demos", href: "/Demo/masonry-gallery" },
        { label: "Contact", href: "/contact" }
      ]
    },
  },

  seo: {
    title: "Your Brand Name - Accessible Digital Experiences",
    description: "Creating inclusive digital experiences with modern web technologies.",
    keywords: ["accessibility", "web design", "digital experiences", "inclusive design", "astro"],
    ogImage: "/og-image.jpg"
  }
};

// Helper function to get theme CSS custom properties
// These are used by the component library components
export function getThemeCSSProperties(config: SiteConfig): Record<string, string> {
  return {
    '--brand-name': `"${config.brand.name}"`,
    '--brand-tagline': `"${config.brand.tagline}"`,
    '--brand-description': `"${config.content.hero.description}"`,
    '--brand-logo-path': `"${config.brand.logo.path}"`,
    '--brand-logo-fallback': `"${config.brand.logo.fallback}"`,
    '--contact-email': `"${config.contact.email}"`,

    // Colors - these reference your OKLCH theme via bridge CSS
    '--color-primary': config.theme.colors.primary,
    '--color-secondary': config.theme.colors.secondary,
    '--color-background': config.theme.colors.background,
    '--color-text-primary': config.theme.colors.textPrimary,
    '--color-text-light': config.theme.colors.textLight,
    '--color-white': config.theme.colors.white,
    '--color-black': config.theme.colors.black,
    '--color-primary-light': config.theme.colors.primaryLight,
    '--color-primary-dark': config.theme.colors.primaryDark,
    '--color-secondary-light': config.theme.colors.secondaryLight,
    '--color-secondary-dark': config.theme.colors.secondaryDark,
    '--brand-accent-1': config.theme.colors.accent1,
    '--brand-accent-2': config.theme.colors.accent2,
    '--brand-neutral-dark': config.theme.colors.neutralDark,
    '--brand-neutral-mid': config.theme.colors.neutralMid,
    '--brand-neutral-light': config.theme.colors.neutralLight,

    // Typography
    '--font-body': config.theme.fonts.body,
    '--font-heading': config.theme.fonts.heading,
    '--font-nav': config.theme.fonts.nav,

    // Navigation
    '--nav-height': config.theme.navigation.height,
    '--nav-mobile-height': config.theme.navigation.mobileHeight,
    '--nav-border-radius': config.theme.navigation.borderRadius,
    '--nav-mobile-border-radius': config.theme.navigation.mobileBorderRadius,
  };
}

export default siteConfig;
