import { defineConfig, fontProviders } from 'astro/config';
import icon from 'astro-icon';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Site configuration
  site: 'https://stelladore.uk',

  // Output configuration - server mode for API routes
  output: 'server',

  // Cloudflare adapter for deployment
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  }),

  // Integrations
  integrations: [
    icon(),
  ],

  // Build configuration
  build: {
    assets: '_astro'
  },

  // Server configuration
  server: {
    port: 4321,
    host: true
  },

  // Experimental features
  experimental: {
    // Fonts — all downloaded at build time, no CDN calls from visitors
    fonts: [
      // === Remote fonts (via Fontsource) ===
      {
        provider: fontProviders.fontsource(),
        name: 'Quicksand',
        cssVariable: '--font-quicksand',
        weights: [300, 400, 500, 600, 700],
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Caveat',
        cssVariable: '--font-caveat',
        weights: [400, 500, 600, 700],
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Lora',
        cssVariable: '--font-lora',
        weights: [400, 500, 600, 700],
        styles: ['normal', 'italic'],
      },
      {
        provider: fontProviders.fontsource(),
        name: 'Atkinson Hyperlegible Next',
        cssVariable: '--font-atkinson',
        weights: [400, 700],
      },

      // === Adobe Fonts (requires CC subscription) ===
      // Browse & add fonts from: https://fonts.adobe.com
      // 1. Add font to your web project on fonts.adobe.com first
      // 2. Then uncomment and set the name:
      // { provider: fontProviders.adobe({ id: import.meta.env.ADOBE_FONTS_ID }), name: 'Font Name', cssVariable: '--font-whatever' },

      // === Fontshare (free, curated display fonts) ===
      // Browse & add fonts from: https://www.fontshare.com
      // Add new entries like:
      // { provider: fontProviders.fontshare(), name: 'Satoshi', cssVariable: '--font-satoshi' },

      // === Local fonts (custom / downloaded from 1001, Font Squirrel, etc.) ===
      {
        provider: fontProviders.local(),
        name: 'Sukar',
        cssVariable: '--font-sukar',
        options: {
          variants: [
            { weight: 400, style: 'normal', src: ['./public/Fonts/sukar-webfont/SukarRegular.woff'] },
            { weight: 700, style: 'normal', src: ['./public/Fonts/sukar-webfont/SukarBold.woff'] },
            { weight: 900, style: 'normal', src: ['./public/Fonts/sukar-webfont/SukarBlack.woff'] },
          ],
        },
      },
      {
        provider: fontProviders.local(),
        name: 'Crumbo',
        cssVariable: '--font-crumbo',
        options: {
          variants: [
            { weight: 400, style: 'normal', src: ['./public/Fonts/crumbo-demo.regular.ttf'] },
          ],
        },
      },
      {
        provider: fontProviders.local(),
        name: 'OpenDyslexic',
        cssVariable: '--font-opendyslexic',
        options: {
          variants: [
            { weight: 400, style: 'normal', src: ['./public/Fonts/A11y Fonts/opendyslexic/OpenDyslexic-Regular.woff2'] },
            { weight: 400, style: 'italic', src: ['./public/Fonts/A11y Fonts/opendyslexic/OpenDyslexic-Italic.woff2'] },
            { weight: 700, style: 'normal', src: ['./public/Fonts/A11y Fonts/opendyslexic/OpenDyslexic-Bold.woff2'] },
            { weight: 700, style: 'italic', src: ['./public/Fonts/A11y Fonts/opendyslexic/OpenDyslexic-Bold-Italic.woff2'] },
          ],
        },
      },
    ],
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['isotope-layout', 'imagesloaded']
    },
    server: {
      watch: {
        ignored: ['**/public/Icons/SVGs Flat/**', '**/public/Icons/SVGs/**', '**/public/Icons/PNGs/**']
      }
    }
  }
});
