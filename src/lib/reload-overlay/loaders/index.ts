/**
 * Built-in loaders + the type contract
 *
 * Add a new loader here:
 *   1. Create a new file in this folder (e.g. heart-pulse.ts)
 *   2. Export an object that satisfies ReloadLoader { render(msg) }
 *   3. Add it to BUILTIN_LOADERS below so brands can pick it by name
 *   4. Optionally add CSS in reload-overlay.css under a `--{name}` block
 *
 * Brands can either:
 *   - Pick a built-in: BRAND_CONFIG.reloadOverlay.loader = 'goo-spiral'
 *   - Provide their own: BRAND_CONFIG.reloadOverlay.loader = customLoader
 *
 * The mechanism in reload-overlay.ts doesn't care which — it just calls
 * loader.render(message) and lets the loader paint whatever it wants.
 */

export type { ReloadLoader } from './types';
export { gooSpiralLoader } from './goo-spiral';
export { messageOnlyLoader } from './message-only';

import type { ReloadLoader } from './types';
import { gooSpiralLoader } from './goo-spiral';
import { messageOnlyLoader } from './message-only';

export const BUILTIN_LOADERS: Record<string, ReloadLoader> = {
  'goo-spiral': gooSpiralLoader,
  'message-only': messageOnlyLoader,
};

/** The default if a brand doesn't specify a loader */
export const DEFAULT_LOADER = gooSpiralLoader;
