# Phase 4: Extract checkout.css (955 lines) + Inline Styles

## Overview
checkout.css is one large page file styling the entire checkout flow. The page (checkout.astro) has 93 lines of inline `<style is:global>` on top of this. Everything needs to move into components.

Unlike services.css, checkout has very few existing components — just Button, DownloadSummary, and TrustBadges. The entire checkout flow is built inline in the page.

## Strategy
Rather than creating 10+ tiny components, group into 3 logical components that match the visual layout:

1. **CheckoutForm** — the left column (steps, form fields, payment, actions)
2. **OrderSummary** — the right column (items, promo, totals, trust badges)
3. **CheckoutLayout** — the overall page grid + header

---

## Step 1: Purge empty rule blocks

Delete all empty `{ }` blocks from checkout.css first. There are many from the typography purge. This will significantly reduce line count.

Also delete the stale comment on the last line referencing `a11y/pages/checkout.css` (that folder no longer exists).

---

## Step 2: Create CheckoutLayout component

### 2a. Create `src/components/Checkout/CheckoutLayout.astro`
Extract from checkout.astro:
- The checkout section wrapper
- The header (title, subtitle, steps indicator)
- The content grid (2-column layout)
- Slots for form and summary columns

Move these CSS blocks into scoped `<style>`:
- `.checkout-section` (lines 7-16)
- `.checkout-header` (line 18-21)
- `.checkout-title` (lines 23-28)
- `.checkout-subtitle` (lines 30-34)
- `.checkout-steps`, `.step`, `.step-number`, `.step-label` (lines 36-75)
- `.checkout-content` (lines 77-82)
- `.checkout-actions` (lines 307-314)
- `.checkout-terms` (lines 316-330)
- Responsive for all the above from each breakpoint (768px, 1024px, 400px, 300px, 200px)

### 2b. Also move from checkout.astro inline styles:
- `.checkout-footer` (lines 123-128)
- `.checkout-info` (lines 130-137)
- `.checkout-trust-header` (lines 111-119)
- Responsive for above from 400px, 300px, 200px

---

## Step 3: Create CheckoutForm component

### 3a. Create `src/components/Checkout/CheckoutForm.astro`
Extract the form column HTML from checkout.astro. This component handles:
- Checkout card container
- Form sections (personal info, payment)
- Form fields, labels, hints
- Checkbox consent
- Info/payment notices
- Payment placeholder

Move these CSS blocks into scoped `<style>`:
- `.card.checkout-card`, `.checkout-card--summary` (lines 85-129)
- `.checkout-card__header`, `__step`, `__title` (lines 98-125)
- `.checkout-forms`, `.form-section-title`, `.form-row` (lines 131-148)
- `.checkout-form .form-input/label` (lines 150-170)
- `.checkbox-label` + checkbox input (lines 172-198)
- `.form-hint` (lines 200-203)
- `.info-notice` (lines 205-221)
- `.payment-info-notice` (lines 224-239)
- `.payment-placeholder`, `.placeholder-*` (lines 242-277)
- `.payment-errors`, `.payment-methods`, `.payment-icons`, `.payment-icon` (lines 279-304)
- `.btn-block` (lines 312-314)
- Responsive for all the above

---

## Step 4: Create OrderSummary component

### 4a. Create `src/components/Checkout/OrderSummary.astro`
Extract the order summary column HTML from checkout.astro.

Move these CSS blocks into scoped `<style>`:
- `.order-summary-container` (lines 333-340)
- `.order-summary-title` (lines 342-347)
- `.order-items` (lines 349-354)
- `.empty-cart-message` (lines 356-360)
- `.order-item`, `.order-item-*` (lines 362-418)
- `.free-badge`, `.free-notice`, `.free-notice-*` (lines 410-443)
- `.order-divider` (lines 445-449)
- `.promo-code-*` (lines 452-466)
- `.order-totals`, `.order-total-row`, `.discount-*`, `.total-row` (lines 468-492)
- `.trust-badges`, `.trust-badge` (lines 494-514 — check if TrustBadges.astro component already has these)
- Responsive for all the above

### 4b. Check TrustBadges component for duplicates
```bash
grep -n "trust-badge" src/components/TrustBadges.astro | head -10
```
If TrustBadges already styles itself, the trust-badge rules in checkout.css are overrides — move them as context-scoped rules in OrderSummary.

---

## Step 5: Rebuild checkout.astro

After extracting, checkout.astro becomes:
```astro
---
import BaseLayout from '../Layouts/BaseLayout.astro';
import CheckoutLayout from '../components/Checkout/CheckoutLayout.astro';
import CheckoutForm from '../components/Checkout/CheckoutForm.astro';
import OrderSummary from '../components/Checkout/OrderSummary.astro';
// ... data fetching
---

<BaseLayout>
  <CheckoutLayout title="Checkout" subtitle="..." steps={steps}>
    <CheckoutForm slot="form" ... />
    <OrderSummary slot="summary" items={items} />
  </CheckoutLayout>
</BaseLayout>
```

No `<style>` block on the page. No page CSS file.

---

## Step 6: Delete checkout.css

- Delete `src/styles/pages/checkout.css`
- Remove its `@import` from `src/styles/global.css`
- Ensure checkout.astro has zero `<style>` block

---

## Step 7: Verify

```bash
grep -rn "checkout\.css" src/styles/ --include="*.css"
grep -n "<style" src/pages/checkout.astro
ls src/styles/pages/
```

checkout.css should be gone. Only `asset-detail.css` should remain in pages/.

Visual check: load /checkout and verify layout, forms, order summary, trust badges, responsive behaviour.
