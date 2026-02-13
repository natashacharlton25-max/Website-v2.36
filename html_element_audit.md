# HTML Element Swap Audit

## Summary

| Category | Count | Change to |
|----------|------:|----------|
| Headings | 8 | `<h2>`, `<h3>`, or `<h4>` |
| Body text | 26 | `<p>` |
| Meta/labels | 39 | `<small>` |
| **Total** | **73** | |

---

## Headings (8)

Change `<div>` or `<span>` to `<h2>`, `<h3>`, or `<h4>` based on context

| File | Line | Current | Class | Suggested |
|------|------|---------|-------|-----------|
| components/A11y Panel/PresetButton.astro | L35 | `<span>` | `a11y-preset-btn__title` | `<h2/h3/h4>` |
| components/Global/CookieBanner.astro | L32 | `<span>` | `cookie-option-title` | `<h2/h3/h4>` |
| components/Global/CookieBanner.astro | L46 | `<span>` | `cookie-option-title` | `<h2/h3/h4>` |
| components/Global/CookieBanner.astro | L59 | `<span>` | `cookie-option-title` | `<h2/h3/h4>` |
| components/Presentation/ReaderNav.astro | L103 | `<div>` | `info-tooltip__title` | `<h2/h3/h4>` |
| components/Presentation/ReaderNav.astro | L178 | `<span>` | `current-section-title` | `<h2/h3/h4>` |
| components/Presentation/ReaderNav.astro | L267 | `<span>` | `section-name` | `<h2/h3/h4>` |
| components/Shop/MiniCart.astro | L9 | `<span>` | `mini-cart__title` | `<h2/h3/h4>` |

---

## Body Text (26)

Change `<div>` or `<span>` to `<p>`

| File | Line | Current | Class | Suggested |
|------|------|---------|-------|-----------|
| components/A11y Panel/PresetButton.astro | L34 | `<div>` | `a11y-preset-btn__text` | `<p>` |
| components/A11y Panel/PresetButton.astro | L36 | `<span>` | `a11y-preset-btn__subtitle` | `<p>` |
| components/A11y Panel/ToggleCard.astro | L41 | `<div>` | `a11y-toggle-card__text` | `<p>` |
| components/A11y/AccessibilityPanel.astro | L73 | `<div>` | `a11y-panel__body` | `<p>` |
| components/Cards/ProductCard.astro | L83 | `<span>` | `add-to-cart-text` | `<p>` |
| components/Cards/WhyCard.astro | L38 | `<span>` | `why-card__badge-text` | `<p>` |
| components/Global/AnnouncementTicker.astro | L70 | `<span>` | `announcement-ticker__text` | `<p>` |
| components/Global/AnnouncementTicker.astro | L77 | `<span>` | `announcement-ticker__text` | `<p>` |
| components/Global/CookieBanner.astro | L8 | `<div>` | `cookie-banner-text` | `<p>` |
| components/Presentation/Sections/FullWidthSection.astro | L23 | `<div>` | `fullwidth__body` | `<p>` |
| components/Presentation/Sections/ImageTextSection.astro | L27 | `<div>` | `image-text__body` | `<p>` |
| components/Presentation/Sections/TextSection.astro | L19 | `<div>` | `text-section__body` | `<p>` |
| components/Sections/CTASection.astro | L48 | `<div>` | `cta-section__body` | `<p>` |
| components/Sections/CTASection.astro | L73 | `<div>` | `cta-section__trust-text` | `<p>` |
| components/Sections/ImageTextSection.astro | L78 | `<div>` | `image-text-section__body` | `<p>` |
| components/Sections/StorySection.astro | L31 | `<div>` | `story__text` | `<p>` |
| pages/assets/[slug].astro | L218 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L225 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L234 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L245 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L263 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L270 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L277 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L286 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L297 | `<div>` | `content-section__body` | `<p>` |
| pages/assets/[slug].astro | L306 | `<div>` | `content-section__body` | `<p>` |

---

## Meta / Labels (39)

Change `<div>` or `<span>` to `<small>`

| File | Line | Current | Class | Suggested |
|------|------|---------|-------|-----------|
| components/A11y Panel/FontCard.astro | L32 | `<span>` | `a11y-font-card__label` | `<small>` |
| components/A11y Panel/ToggleCard.astro | L42 | `<span>` | `a11y-toggle-card__label` | `<small>` |
| components/Badge/Badge.astro | L119 | `<span>` | `badge__label` | `<small>` |
| components/Cards/InsightCard.astro | L53 | `<div>` | `insight-card__badge` | `<small>` |
| components/Cards/InsightCard.astro | L56 | `<div>` | `insight-card__meta` | `<small>` |
| components/Cards/ProductCard.astro | L61 | `<div>` | `product-card__badge` | `<small>` |
| components/Cards/ProductCard.astro | L64 | `<div>` | `product-card__category` | `<small>` |
| components/Cards/ProjectCard.astro | L54 | `<span>` | `project-card__category` | `<small>` |
| components/Cards/ProjectSpecCard.astro | L22 | `<span>` | `project-spec-card__label` | `<small>` |
| components/Cards/SpecCard.astro | L19 | `<span>` | `spec-card__label` | `<small>` |
| components/Cards/WhyCard.astro | L34 | `<div>` | `why-card__badge` | `<small>` |
| components/Grids/RelatedGrid.astro | L179 | `<span>` | `related-card__badge` | `<small>` |
| components/Insights/InsightHeader.astro | L73 | `<div>` | `insight-header__meta` | `<small>` |
| components/Insights/InsightHeader.astro | L74 | `<span>` | `insight-header__date` | `<small>` |
| components/Masonry/MasonryCards/MasonryCard.astro | L184 | `<span>` | `card__label` | `<small>` |
| components/Masonry/MasonryCards/MasonryCard.astro | L196 | `<span>` | `card__badge` | `<small>` |
| components/Masonry/MasonryCards/MasonryCard.astro | L224 | `<span>` | `card__badge` | `<small>` |
| components/Presentation/AuthorCard.astro | L36 | `<span>` | `author-card__label` | `<small>` |
| components/Presentation/AuthorCard.astro | L38 | `<span>` | `author-card__role` | `<small>` |
| components/Presentation/ReaderNav.astro | L205 | `<span>` | `autoplay-label` | `<small>` |
| components/Presentation/ReaderNav.astro | L226 | `<span>` | `speed-label` | `<small>` |
| components/Presentation/Sections/CompareSection.astro | L25 | `<div>` | `compare__label` | `<small>` |
| components/Presentation/Sections/CompareSection.astro | L30 | `<div>` | `compare__label` | `<small>` |
| components/Presentation/Sections/EndSection.astro | L78 | `<span>` | `resource-card__type` | `<small>` |
| components/Presentation/Sections/EndSection.astro | L101 | `<span>` | `recommended-card__badge` | `<small>` |
| components/Presentation/Sections/EndSection.astro | L104 | `<span>` | `recommended-card__category` | `<small>` |
| components/Presentation/Sections/GallerySection.astro | L32 | `<div>` | `gallery__caption` | `<small>` |
| components/Presentation/Sections/HeroSection.astro | L27 | `<div>` | `hero__meta` | `<small>` |
| components/Presentation/Sections/HeroSection.astro | L28 | `<span>` | `hero__category` | `<small>` |
| components/Presentation/Sections/HeroSection.astro | L29 | `<span>` | `hero__date` | `<small>` |
| components/Presentation/Sections/QuoteSection.astro | L24 | `<span>` | `quote__role` | `<small>` |
| components/Presentation/Sections/StatsSection.astro | L32 | `<div>` | `stats__label` | `<small>` |
| components/Presentation/Sections/TitleSection.astro | L36 | `<div>` | `title-section__meta` | `<small>` |
| components/Presentation/Sections/TitleSection.astro | L37 | `<span>` | `title-section__category` | `<small>` |
| components/Presentation/Sections/TitleSection.astro | L38 | `<span>` | `title-section__date` | `<small>` |
| components/Product/IsotopeImageGallery.astro | L30 | `<div>` | `gallery-badge` | `<small>` |
| components/Product/ProductInfo.astro | L38 | `<span>` | `info-badge` | `<small>` |
| components/Switcher/BaseSwitcher.astro | L52 | `<span>` | `switcher-btn__label` | `<small>` |
| pages/projects/[slug].astro | L262 | `<div>` | `editorial-hero__meta` | `<small>` |

