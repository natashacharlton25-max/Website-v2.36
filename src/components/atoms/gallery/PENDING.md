# GalleryItem — Pending

Orphaned CSS with no `.astro` component. Three detailed CSS files exist:

- `GalleryItem.style.css` — showcase gallery items, product thumbnails, badges, expand/collapse
- `GalleryItem.a11y.css` — a11y overrides
- `GalleryItem.responsive.css` — breakpoints

## Before audit

1. Build `GalleryItem.astro` with props matching the CSS class API
2. Then apply standard audit:
   - Rename `.style.css` → `.css`
   - Strip brand token fallbacks
   - Remove `@media prefers-reduced-motion` / `:global()` if present
   - Rewrite a11y.css to `@layer a11y.*` pattern
   - Create `index.ts`, `GalleryItem.schema.json`
   - Update `global.css` import path
