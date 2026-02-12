# Base Class Audit

## Summary

| Category | Need base class | Already have it |
|----------|----------------:|----------------:|
| `.card` — Cards — compact headings, body text, pad | 9 | 1 |
| `.form` — Forms — input groups, labels, validation | 1 | 0 |
| `.grid` — Grids — layout containers for cards | 8 | 0 |
| `.modal` — Modals/popups — overlay containers | 2 | 0 |
| `.section` — Sections — page-level containers with ve | 7 | 7 |
| **Total** | **27** | **8** |

## Global CSS Overrides This Enables

Once base classes are added, add these to global.css:

```css
/* Cards — compact typography */
.card h2, .card h3, .card h4 { font-size: 1.125rem; line-height: 1.375; }
.card h5, .card h6 { font-size: 0.875rem; }
.card p { font-size: 0.875rem; line-height: 1.5; }
.card small { font-size: 0.75rem; }

/* Sections — vertical rhythm */
.section { padding: var(--space-section) 0; }

/* Grids — layout */
.grid { display: grid; gap: var(--space-lg); }

/* Modals — overlay sizing */
.modal h2, .modal h3 { font-size: 1.25rem; }
.modal p { font-size: 1rem; }
```

---

## `.card` — Cards — compact headings, body text, padding, radius, shadow

### Need base class added (9)

| File | Line | Tag | Current class | Change to |
|------|------|-----|---------------|----------|
| components/Cards/OfferingCard.astro | L48 | `<div>` | `offering-card` | `card offering-card` |
| components/Cards/StepCard.astro | L22 | `<div>` | `step-card` | `card step-card` |
| components/Presentation/AuthorCard.astro | L31 | `<div>` | `author-card` | `card author-card` |
| components/Presentation/Sections/EndSection.astro | L77 | `<a>` | `resource-card` | `card resource-card` |
| components/Presentation/Sections/EndSection.astro | L98 | `<a>` | `recommended-card` | `card recommended-card` |
| pages/checkout.astro | L25 | `<div>` | `checkout-card` | `card checkout-card` |
| pages/search.astro | L1321 | `<a>` | `result-card` | `card result-card` |
| pages/services/[slug].astro | L119 | `<div>` | `details-card` | `card details-card` |
| pages/verify.astro | L133 | `<div>` | `verify-card` | `card verify-card` |

### Already have base class (1)

- components/Cards/WhyCard.astro L32: `why-card` ✅

---

## `.form` — Forms — input groups, labels, validation

### Need base class added (1)

| File | Line | Tag | Current class | Change to |
|------|------|-----|---------------|----------|
| pages/checkout.astro | L26 | `<form>` | `checkout-form` | `form checkout-form` |

---

## `.grid` — Grids — layout containers for cards

### Need base class added (8)

| File | Line | Tag | Current class | Change to |
|------|------|-----|---------------|----------|
| components/Masonry/MasonryGrid.astro | L45 | `<div>` | `masonry-grid` | `grid masonry-grid` |
| components/Presentation/Sections/EndSection.astro | L75 | `<div>` | `resources-grid` | `grid resources-grid` |
| components/Presentation/Sections/EndSection.astro | L96 | `<div>` | `recommended-grid` | `grid recommended-grid` |
| pages/assets.astro | L73 | `<div>` | `products-grid` | `grid products-grid` |
| pages/insights.astro | L119 | `<div>` | `insights-grid` | `grid insights-grid` |
| pages/projects/[slug].astro | L325 | `<div>` | `products-grid` | `grid products-grid` |
| pages/services.astro | L99 | `<div>` | `why-grid` | `grid why-grid` |
| pages/services/[slug].astro | L117 | `<div>` | `details-grid` | `grid details-grid` |

---

## `.modal` — Modals/popups — overlay containers

### Need base class added (2)

| File | Line | Tag | Current class | Change to |
|------|------|-----|---------------|----------|
| components/ContactForm/Contact-Popup.astro | L19 | `<div>` | `contact-popup` | `modal contact-popup` |
| components/Search/SearchOverlay.astro | L12 | `<div>` | `search-overlay` | `modal search-overlay` |

---

## `.section` — Sections — page-level containers with vertical spacing

### Need base class added (7)

| File | Line | Tag | Current class | Change to |
|------|------|-----|---------------|----------|
| components/Navigation/Breadcrumbs.astro | L14 | `<section>` | `breadcrumbs-section` | `section breadcrumbs-section` |
| components/Presentation/Sections/EndSection.astro | L49 | `<div>` | `end-section` | `section end-section` |
| components/Sections/HeroMorphAnimation.astro | L34 | `<section>` | `hero-morph` | `section hero-morph` |
| pages/assets.astro | L60 | `<div>` | `products-section` | `section products-section` |
| pages/assets/[slug].astro | L216 | `<div>` | `content-section` | `section content-section` |
| pages/insights.astro | L106 | `<div>` | `insights-section` | `section insights-section` |
| pages/projects/[slug].astro | L244 | `<section>` | `hero-section` | `section hero-section` |

### Already have base class (7)

- components/Sections/CTASection.astro L43: `cta-section` ✅
- components/Sections/PillarsSection.astro L35: `pillars-section` ✅
- components/Sections/ValuesSection.astro L19: `values-section` ✅
- pages/checkout.astro L12: `checkout-section` ✅
- pages/services.astro L97: `why-section` ✅
- pages/services.astro L113: `how-section` ✅
- pages/verify.astro L131: `verify-section` ✅

---

## All Component Classes Found

Unique BEM block-level classes that matched a category:

- `offering-card` (OfferingCard.astro) → add `.card`
- `step-card` (StepCard.astro) → add `.card`
- `why-card` (WhyCard.astro) ✅
- `author-card` (AuthorCard.astro) → add `.card`
- `resource-card` (EndSection.astro) → add `.card`
- `recommended-card` (EndSection.astro) → add `.card`
- `checkout-card` (checkout.astro) → add `.card`
- `result-card` (search.astro) → add `.card`
- `verify-card` (verify.astro) → add `.card`
- `details-card` ([slug].astro) → add `.card`
- `checkout-form` (checkout.astro) → add `.form`
- `masonry-grid` (MasonryGrid.astro) → add `.grid`
- `resources-grid` (EndSection.astro) → add `.grid`
- `recommended-grid` (EndSection.astro) → add `.grid`
- `products-grid` (assets.astro) → add `.grid`
- `insights-grid` (insights.astro) → add `.grid`
- `why-grid` (services.astro) → add `.grid`
- `details-grid` ([slug].astro) → add `.grid`
- `contact-popup` (Contact-Popup.astro) → add `.modal`
- `search-overlay` (SearchOverlay.astro) → add `.modal`
- `breadcrumbs-section` (Breadcrumbs.astro) → add `.section`
- `end-section` (EndSection.astro) → add `.section`
- `cta-section` (CTASection.astro) ✅
- `hero-morph` (HeroMorphAnimation.astro) → add `.section`
- `pillars-section` (PillarsSection.astro) ✅
- `values-section` (ValuesSection.astro) ✅
- `products-section` (assets.astro) → add `.section`
- `checkout-section` (checkout.astro) ✅
- `insights-section` (insights.astro) → add `.section`
- `why-section` (services.astro) ✅
- `how-section` (services.astro) ✅
- `verify-section` (verify.astro) ✅
- `content-section` ([slug].astro) → add `.section`
- `hero-section` ([slug].astro) → add `.section`
