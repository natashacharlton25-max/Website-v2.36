/**
 * Brand Configuration
 * Central config for brand assets, SEO, and component defaults.
 */

import type { ReloadOverlayConfig } from '../reload-overlay/reload-overlay';

export interface SharePlatform {
  name: string;
  /** URL template — {url} and {title} will be replaced */
  shareUrl: string;
  /** Lottie animation slug (Asset Library API — plays on hover) */
  lottieSlug?: string;
  /** Phosphor icon name — static fallback for reduced/assistive/textonly */
  staticIcon?: string;
  /** Custom SVG markup (for icons not in the API, e.g. WhatsApp) */
  svg?: string;
  /** CSS colour token for the icon background circle */
  color?: string;
}

export const BRAND_CONFIG = {
  name: 'Walking with a Smile',
  description: 'Supporting trauma recovery and healing. Resources to help you move from survival to living, at your own pace.',

  contact: {
    email: 'hello@walkingwithasmile.com',
    responseTime: 'We aim to respond within 2 working days'
  },

  urls: {
    domain: 'walkingwithasmile.com'
  },

  seo: {
    defaultTitle: 'Walking with a Smile | Your Tagline',
    defaultDescription: 'Supporting trauma recovery and healing.',
    defaultImage: '/Logo/SEO Image.png',
  },

  social: {
    ogType: 'website',
    twitterCard: 'summary_large_image',
  },

  footer: {
    defaultImage: '/Footer/Footer-Reveal.png',
  },

  /**
   * Brand logo paths. Resolved via the `particleSvg: "logo:primary"` shorthand
   * in the Burst atom (and any other component that wants the brand logo).
   * Keys are enum'd — only these slot names exist; add to the schema if you
   * need new ones rather than allowing arbitrary strings.
   */
  logo: {
    /** Main brand logo — full colour, fallback for everything */
    primary:    '/Animations/Hero Morph/1.svg',
    /** Monochrome variant — single-colour silhouette for inverse contexts */
    monochrome: '/Animations/Hero Morph/1.svg',
    /** Favicon-scale glyph — simplified for tiny sizes */
    favicon:    '/favicon.svg',
    /** Wordmark — text-based logotype, for headers and footers */
    wordmark:   '/Logo/SEO Image.png',
  } as const,

  /**
   * Reload Overlay — configures the fullscreen overlay shown during
   * page reloads triggered by view setting changes (motion/hover/render/mode).
   *
   * `loader` — which visual to show:
   *   - 'goo-spiral'   (default) — Uiverse gooey gradient spinner
   *   - 'message-only' — text caption only, no spinner
   *   - <object>       — provide your own ReloadLoader implementation
   *                     (great for brand logo animations, mascots, adverts)
   *
   * `loaderText` — message strategy:
   *   - false       — no caption text at all (loader visual only)
   *   - 'default'   — use the lib's built-in friendly message pools
   *   - 'custom'    — use this brand's own message pools (set `messages` below)
   *
   * `messages` — per-reason message pools (only used when loaderText: 'custom').
   * Missing reasons fall back to the 'default' key, then to the lib defaults.
   */
  reloadOverlay: {
    loader: 'goo-spiral',
    loaderText: 'default',
    // Example custom messages — uncomment + set loaderText: 'custom' to use:
    // messages: {
    //   default: [
    //     'A small pause for you',
    //     'Just a moment as we get ready',
    //   ],
    //   motion: [
    //     'Slowing things down — take a breath',
    //   ],
    //   mode: [
    //     'Adjusting the lighting',
    //   ],
    // },
  } satisfies ReloadOverlayConfig,

  sharing: {
    platforms: [
      {
        name: 'Facebook',
        shareUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
        lottieSlug: 'lottie-social-facebook',
        staticIcon: 'facebook-logo-fill',
        color: 'var(--share-facebook)'
      },
      {
        name: 'Twitter',
        shareUrl: 'https://twitter.com/intent/tweet?url={url}&text={title}',
        lottieSlug: 'lottie-social-twitter',
        staticIcon: 'twitter-logo-fill',
        color: 'var(--share-twitter)'
      },
      {
        name: 'LinkedIn',
        shareUrl: 'https://www.linkedin.com/shareArticle?mini=true&url={url}',
        lottieSlug: 'lottie-social-linkedin',
        staticIcon: 'linkedin-logo-fill',
        color: 'var(--share-linkedin)'
      },
      {
        name: 'WhatsApp',
        shareUrl: 'https://api.whatsapp.com/send?text={url}',
        staticIcon: 'whatsapp-logo-fill',
        svg: '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
        color: 'var(--share-whatsapp)'
      }
    ] as SharePlatform[]
  }
};
