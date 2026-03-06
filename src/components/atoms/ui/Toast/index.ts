import './Toast.css';
import './Toast.responsive.css';

export { default as Toast } from './Toast.astro';
export { default as schema } from './Toast.schema.json';

// showToast is a client-side runtime function — import directly from 'src/lib/ui/toast'
// in <script> blocks, not through this barrel (SSR would fail on document/window refs).
export type { ToastOptions, ToastPresetIcon } from '../../../lib/ui/toast';
