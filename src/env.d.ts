/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/cloudflare" />

import type { D1Database } from './lib/db';

interface ImportMetaEnv {
  readonly EMAILIT_API_KEY: string;
  readonly EMAILIT_API_URL: string;
  readonly RECIPIENT_EMAIL: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
  readonly STREAMLINE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend Astro's Locals with Cloudflare runtime
declare global {
  namespace App {
    interface Locals {
      runtime: {
        env: {
          DB: D1Database;
        };
      };
    }
  }
}

export {};
