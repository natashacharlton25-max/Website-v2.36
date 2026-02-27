import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Site configuration
  site: 'https://yourdomain.com',

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
    icon()
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
