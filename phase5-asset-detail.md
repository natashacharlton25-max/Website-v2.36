# Phase 5: Eliminate asset-detail.css (1058 lines → 0)

## Step 1: Delete dead code (~550 lines)
Delete all rules for classes not used in any current HTML:
- `product-gallery`, `main-image`, `thumbnail`, `thumbnail-gallery`
- `product-header`, `product-category`
- `product-pricing`, `price-current`
- `product-info-row`, `info-item-inline`
- `download-section`, `download-info`, `download-note`, `btn-block`
- `spec-grid`, `spec-item`, `spec-label`, `spec-value`
- `features-list`, `simple-list`, `note`, `conclusion-text`, `professional-download`
- `section-title`, `related-grid`, `product-card`

Also delete all empty `{ }` rule blocks.

## Step 2: Delete duplicate code (~250 lines)
Delete all rules that duplicate scoped styles already in components:
- `compact-tool-card`, `compact-*` → CompactToolCard.astro
- `spec-masonry`, `spec-wrapper` → SpecGrid.astro
- `spec-card`, `spec-card__*` → SpecCard.astro
- `product-title`, `product-sku`, `product-description` → ProductInfo.astro

## Step 3: Move ~30 lines into components

**Breadcrumbs padding:**
`.breadcrumbs-section { padding }` → Move into `src/components/Breadcrumbs.astro` scoped `<style>`. Check it doesn't already have section padding.

**Action button responsive:**
`.action-buttons` + `.cart-btn-wrapper` responsive at 768px/480px → Move into `src/components/ProductInfo.astro` scoped `<style>`. These are responsive tweaks for the add-to-cart button layout.

## Step 4: Move ~230 lines of page layout into a component

These are NOT page styles — they're layout for the product detail view. Create a layout component:

### Create `src/components/Layouts/ProductDetailLayout.astro`

This component provides the grid structure for the product detail page:
- 2-column layout (image gallery + product info)
- Content tabs section below
- Content sections with highlight variants
- All responsive breakpoints

Props:
```typescript
interface Props {
  class?: string;
}
```

Uses slots for the content areas:
```astro
<section class="product-detail-section section">
  <div class="container container-6xl">
    <slot name="breadcrumbs" />
    <div class="product-layout">
      <slot name="gallery" />
      <slot name="info" />
    </div>
  </div>
</section>

<section class="product-content-section section">
  <div class="container container-6xl">
    <slot name="content" />
  </div>
</section>
```

Move ALL these classes into scoped `<style>`:
- `.product-detail-section` (padding, z-index)
- `.product-content-section` (padding)
- `.product-layout` (grid + responsive)
- `.content-wrapper` switcher overrides
- `.tabs-content`, `.tab-panel`
- `.content-sections`, `.content-section`, `.content-section-grid`
- `.content-section--highlight`, `.content-section .badge`, `.content-section__body`
- All responsive rules for the above

### Update `src/pages/assets/[slug].astro`
Replace the inline HTML structure with:
```astro
<ProductDetailLayout>
  <Breadcrumbs slot="breadcrumbs" ... />
  <IsotopeImageGallery slot="gallery" ... />
  <ProductInfo slot="info" ... />
  <ContentSwitcher slot="content" ... />
</ProductDetailLayout>
```

Remove any remaining `<style>` block from the page.

## Step 5: Delete asset-detail.css + pages folder

- Delete `src/styles/pages/asset-detail.css`
- Remove its `@import` from `src/styles/global.css`
- Delete the `src/styles/pages/` folder entirely (should now be empty)

## Step 6: Verify

```bash
ls src/styles/pages/ 2>/dev/null          # Should not exist
grep -rn "styles/pages" src/ --include="*.css"  # Zero results
grep -rn "asset-detail\.css" src/          # Zero results
grep -n "<style" src/pages/assets/[slug].astro  # Zero results (ideally)
```

The `src/styles/pages/` folder is now completely gone.
