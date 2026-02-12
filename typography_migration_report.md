# Typography Migration Report

**Mode:** Applied
**Total replacements:** 913
**Files affected:** 95

## Replacement Summary

| Old token | New token | Count |
|-----------|-----------|-------|
| `--text-sm` | `--text-small` | 204 |
| `--text-xs` | `--text-fine` | 202 |
| `--text-base` | `--text-body` | 120 |
| `--text-lg` | `--text-h5` | 95 |
| `--text-xl` | `--text-h4` | 71 |
| `--text-2xl` | `--text-h4` | 53 |
| `--text-3xl` | `--text-h3` | 46 |
| `--text-4xl` | `--text-h3` | 31 |
| `--text-5xl` | `--text-h2` | 16 |
| `--font-size-lg` | `--text-h5` | 11 |
| `--font-weight-bold` | `--font-bold` | 9 |
| `--font-size-sm` | `--text-small` | 8 |
| `--font-size-base` | `--text-body` | 7 |
| `--text-6xl` | `--text-h1` | 7 |
| `--text-2xs` | `--text-fine` | 5 |
| `--font-size-xs` | `--text-fine` | 4 |
| `--text-7xl` | `--text-h1` | 4 |
| `--tracking-wide` | `--letter-spacing-wide` | 4 |
| `--font-weight-medium` | `--font-medium` | 3 |
| `--text-md` | `--text-body` | 3 |
| `--tracking-normal` | `--letter-spacing-normal` | 2 |
| `--font-size-2xl` | `--text-h4` | 1 |
| `--font-weight-semibold` | `--font-semibold` | 1 |
| `--font-size-xl` | `--text-h4` | 1 |
| `--color-secondary-500` | `--brand-c-secondary` | 1 |
| `--font-extra-bold` | `--font-extrabold` | 1 |
| `--color-Danger` | `--color-Error` | 1 |
| `--tracking-wider` | `--letter-spacing-wider` | 1 |
| `--font-regular` | `--font-normal` | 1 |

## Files Changed

| File | Changes |
|------|---------|
| styles/pages/checkout.css | 66 |
| pages/search.astro | 64 |
| styles/pages/service-detail.css | 61 |
| styles/pages/asset-detail.css | 32 |
| styles/pages/cart.css | 32 |
| styles/pages/services.css | 29 |
| styles/a11y/visual/text-only.css | 26 |
| pages/services/[slug].astro | 25 |
| styles/components/masonry-card.css | 24 |
| components/Presentation/AuthorCard.astro | 21 |
| components/ContactForm/Contact-Popup.astro | 19 |
| styles/components/presentation/sections.css | 19 |
| styles/components/philosophy-flip-cards.css | 17 |
| components/Presentation/Sections/EndSection.astro | 16 |
| components/Cards/ProductCard.astro | 15 |
| components/Search/SearchOverlay.astro | 15 |
| styles/global.css | 15 |
| styles/components/hero-morph.css | 15 |
| components/Presentation/Sections/TitleSection.astro | 13 |
| components/Typography/SectionTitle.astro | 13 |
| styles/components/hero-section.css | 13 |
| components/Grids/RelatedGrid.astro | 12 |
| styles/responsive/micro.css | 12 |
| components/Cards/InsightCard.astro | 11 |
| styles/base/utilities.css | 11 |
| styles/components/cta-section.css | 11 |
| components/Cards/SpecCard.astro | 10 |
| components/Footer/Footer.astro | 9 |
| components/Presentation/Sections/HeroSection.astro | 9 |
| styles/components/pillars-section.css | 9 |
| styles/components/values-section.css | 9 |
| components/Cards/ProjectSpecCard.astro | 8 |
| components/Cards/WhyCard.astro | 8 |
| components/Presentation/Sections/FullWidthSection.astro | 8 |
| components/Presentation/Sections/ImageTextSection.astro | 8 |
| components/Presentation/Sections/QuoteSection.astro | 8 |
| components/Presentation/Sections/TextSection.astro | 8 |
| components/Shop/MiniCart.astro | 8 |
| styles/components/presentation/ReaderNav.css | 8 |
| components/A11y Panel/Stepper.astro | 7 |
| components/A11y Panel/ToggleCard.astro | 7 |
| styles/pages/assets.css | 7 |
| components/A11y Panel/PresetButton.astro | 6 |
| components/Badge/Badge.astro | 6 |
| components/Cards/ProjectCard.astro | 6 |
| components/Product/ProductInfo.astro | 6 |
| styles/components/editorial-layout.css | 6 |
| styles/components/image-text-section.css | 6 |
| styles/pages/legal.css | 6 |
| components/Navigation/Breadcrumbs.astro | 5 |
| components/Presentation/Sections/StatsSection.astro | 5 |
| components/Sections/ShareSection.astro | 5 |
| components/Switcher/BaseSwitcher.astro | 5 |
| lib/cart/checkout-form.ts | 5 |
| styles/components/search-results.css | 5 |
| components/A11y Panel/Slider.astro | 4 |
| components/Cards/CompactToolCard.astro | 4 |
| components/Cards/OfferingCard.astro | 4 |
| components/Checkout/DownloadSummary.astro | 4 |
| components/Sections/IntroTextSection.astro | 4 |
| components/Sections/StorySection.astro | 4 |
| pages/verify.astro | 4 |
| pages/showcase/section-titles.astro | 4 |
| styles/a11y/motion/reduced-motion.css | 4 |
| styles/responsive/xs.css | 4 |
| components/A11y Panel/FontCard.astro | 3 |
| components/A11y Panel/NavigationSection.astro | 3 |
| components/A11y Panel/TypographyAdjustmentsSection.astro | 3 |
| components/A11y Panel/TypographySection.astro | 3 |
| components/A11y Panel/VisualSection.astro | 3 |
| components/Cards/StepCard.astro | 3 |
| components/Insights/InsightContent.astro | 3 |
| components/Presentation/Sections/CompareSection.astro | 3 |
| styles/buttons/basic-button.css | 3 |
| styles/components/cart-icon.css | 3 |
| styles/components/toast.css | 3 |
| styles/components/nav/GlassNav-expandable.css | 3 |
| components/A11y Panel/PresetsSidebar.astro | 2 |
| components/A11y Panel/ThemeSidebar.astro | 2 |
| components/A11y Panel/Toggle.astro | 2 |
| components/Insights/InsightHeader.astro | 2 |
| components/Presentation/Sections/CalloutSection.astro | 2 |
| pages/checkout.astro | 2 |
| styles/a11y/visual/highlight-links.css | 2 |
| styles/components/nav/GlassNav-base.css | 2 |
| styles/components/nav/GlassNav-mobile.css | 2 |
| components/Button/ButtonDropdown.astro | 1 |
| components/Grids/ForYouGrid.astro | 1 |
| components/Presentation/Sections/GallerySection.astro | 1 |
| styles/a11y/base/screen-reader.css | 1 |
| styles/components/announcement-ticker.css | 1 |
| styles/components/cookie-banner.css | 1 |
| styles/components/product-gallery.css | 1 |
| styles/components/nav/GlassNav-responsive.css | 1 |
| styles/pages/about.css | 1 |
