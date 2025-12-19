import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  // Site configuration
  site: 'https://yourdomain.com',

  // Output configuration
  output: 'static',

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
    }
  }
});
