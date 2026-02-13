# Phase 6c: Final 3 Pages — assets/[slug], checkout, verify

## 1. assets/[slug].astro (~230 lines inline CSS)

These styles were moved here from asset-detail.css in Phase 5. They're layout/structure for the product detail page.

### Step 1a: Audit what's live
```bash
grep -o 'class="[^"]*"' src/pages/assets/[slug].astro | sort -u
```
Cross-reference against the `<style>` block — check for dead code like we found in checkout (85%) and services.

### Step 1b: Create ProductDetailLayout.astro

Create `src/components/Layouts/ProductDetailLayout.astro`

This is a layout component providing structure for the product detail page. It uses slots for each content area.

**Props:**
```typescript
interface Props {
  class?: string;
}
```

**Template:**
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

**CSS:** Move ALL layout styles into scoped `<style>`:
- `.product-detail-section` (padding, z-index)
- `.product-content-section` (padding)
- `.product-layout` (grid: gallery + info columns, responsive)
- `.content-wrapper` switcher/neumorphic overrides
- `.tabs-content`, `.tab-panel` (tab display, animation)
- `.content-sections`, `.content-section`, `.content-section-grid`
- `.content-section--highlight`, `.content-section .badge`, `.content-section__body`
- All responsive for the above

Since child components need styling (ContentSwitcher internals, tab panels), use `:global()` where needed within the scoped `<style>`.

### Step 1c: Rebuild assets/[slug].astro

```astro
---
import BaseLayout from '../../Layouts/BaseLayout.astro';
import ProductDetailLayout from '../../components/Layouts/ProductDetailLayout.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';
import IsotopeImageGallery from '../../components/Masonry/IsotopeImageGallery.astro';
import ProductInfo from '../../components/ProductInfo.astro';
import ContentSwitcher from '../../components/ContentSwitcher.astro';
// ... other imports + data fetching
---

<BaseLayout title={product.name}>
  <ProductDetailLayout>
    <Breadcrumbs slot="breadcrumbs" ... />
    <IsotopeImageGallery slot="gallery" ... />
    <ProductInfo slot="info" ... />
    <ContentSwitcher slot="content" ... />
  </ProductDetailLayout>
</BaseLayout>
```

Zero `<style>`.

### Step 1d: Verify
```bash
grep -n "<style" src/pages/assets/[slug].astro   # Zero results
```

---

## 2. checkout.astro (~93 lines inline CSS)

Currently has scoped `<style>` with layout, card, form, footer, trust header styles.

### Step 2a: Audit what's live
```bash
grep -o 'class="[^"]*"' src/pages/checkout.astro | sort -u
```

### Step 2b: Create CheckoutLayout.astro

Create `src/components/Checkout/CheckoutLayout.astro`

Checkout is a unique flow but Python still needs to swap text/props per brand. The layout component owns the page structure.

**Props:**
```typescript
interface Props {
  title?: string;
  subtitle?: string;
}
```

**Template:** Extract the checkout section wrapper, header, content grid, footer from checkout.astro. Use a default `<slot />` for the main content.

**CSS:** Move ALL checkout styles into scoped `<style>`:
- `.checkout-section` (padding, background, min-height)
- `.checkout-header`, `.checkout-title`, `.checkout-subtitle`
- `.checkout-content` (grid layout)
- `.card.checkout-card`, `.checkout-card__header`, `__step`, `__title`
- `.checkout-forms`, `.form-section-title`, `.form-row`
- `.checkout-form .form-input/label` overrides
- `.checkbox-label` + checkbox input
- `.form-hint`, `.info-notice`
- `.checkout-actions`, `.btn-block`, `.checkout-terms`
- `.checkout-footer`, `.checkout-info`
- `.checkout-trust-header` + trust badge overrides
- All responsive breakpoints

Use `:global()` where needed for child components (Button, TrustBadges, form utilities).

### Step 2c: Rebuild checkout.astro

```astro
---
import BaseLayout from '../Layouts/BaseLayout.astro';
import CheckoutLayout from '../components/Checkout/CheckoutLayout.astro';
import Button from '../components/Button/Button.astro';
import DownloadSummary from '../components/DownloadSummary.astro';
import TrustBadges from '../components/TrustBadges.astro';
// ... data fetching
---

<BaseLayout title="Checkout">
  <CheckoutLayout title="Almost there!" subtitle="...">
    <!-- form content + DownloadSummary -->
  </CheckoutLayout>
</BaseLayout>
```

Zero `<style>`.

### Step 2d: Verify
```bash
grep -n "<style" src/pages/checkout.astro   # Zero results
```

---

## 3. verify.astro (~73 lines inline CSS)

Small, already scoped. One-off page Python won't generate.

### Step 3a: Create VerifyCard.astro

Create `src/components/Verify/VerifyCard.astro`

**Props:**
```typescript
interface Props {
  status: 'success' | 'expired' | 'invalid' | 'error';
  message: string;
  userName?: string;
}
```

**HTML:** Extract the verify card markup (section + card + icon + title + message + note + actions).

**CSS:** Move ALL `.verify-*` styles into scoped `<style>`:
- `.verify-section` (min-height, flex centering, gradient background)
- `.verify-card` (card with shadow, max-width, padding)
- `.verify-icon`, `.verify-title`, `.verify-greeting`, `.verify-message`
- `.verify-note` (info box with primary-light background)
- `.verify-actions` (button layout + responsive at 480px)

### Step 3b: Rebuild verify.astro

```astro
---
import BaseLayout from '../Layouts/BaseLayout.astro';
import VerifyCard from '../components/Verify/VerifyCard.astro';
// ... token verification logic
---

<BaseLayout title="Email Verification">
  <VerifyCard status={status} message={message} userName={userName} />
</BaseLayout>
```

Zero `<style>`.

### Step 3c: Verify
```bash
grep -n "<style" src/pages/verify.astro   # Zero results
```

---

## 4. Check for any other pages with styles

```bash
grep -rl "<style" src/pages/ --include="*.astro" | sort
```

Also check assets.astro (the listing page — Phase 2 moved some Isotope styles there):
```bash
grep -n "<style" src/pages/assets.astro
```

If any remain, move to the appropriate component.

---

## 5. Final Sweep

```bash
# Zero style blocks on any page
grep -rl "<style" src/pages/ --include="*.astro"

# Zero page CSS folder
ls src/styles/pages/ 2>/dev/null

# Zero a11y page folder
ls src/styles/a11y/pages/ 2>/dev/null

# Zero page CSS imports
grep -rn "styles/pages" src/ --include="*.css" --include="*.astro"
```

ALL should return nothing. Every page is pure imports + data + component tags. Ready for Python page generation.
