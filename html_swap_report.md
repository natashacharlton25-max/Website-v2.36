# HTML Element Swap Report

**Mode:** Applied
**Swaps:** 58 (small: 39, p: 19)
**Skipped:** 4

## Swaps

### components/A11y Panel/FontCard.astro

- L32: `<span>` -> `<small>` (.a11y-font-card__label)

### components/A11y Panel/PresetButton.astro

- L36: `<span>` -> `<p>` (.a11y-preset-btn__subtitle)

### components/A11y Panel/ToggleCard.astro

- L42: `<span>` -> `<small>` (.a11y-toggle-card__label)

### components/Badge/Badge.astro

- L119: `<span>` -> `<small>` (.badge__label)

### components/Cards/InsightCard.astro

- L53: `<div>` -> `<small>` (.insight-card__badge)
- L56: `<div>` -> `<small>` (.insight-card__meta)

### components/Cards/ProductCard.astro

- L61: `<div>` -> `<small>` (.product-card__badge)
- L64: `<div>` -> `<small>` (.product-card__category)
- L83: `<span>` -> `<p>` (.add-to-cart-text)

### components/Cards/ProjectCard.astro

- L54: `<span>` -> `<small>` (.project-card__category)

### components/Cards/ProjectSpecCard.astro

- L22: `<span>` -> `<small>` (.project-spec-card__label)

### components/Cards/SpecCard.astro

- L19: `<span>` -> `<small>` (.spec-card__label)

### components/Cards/WhyCard.astro

- L34: `<div>` -> `<small>` (.why-card__badge)
- L38: `<span>` -> `<p>` (.why-card__badge-text)

### components/Global/AnnouncementTicker.astro

- L70: `<span>` -> `<p>` (.announcement-ticker__text)
- L77: `<span>` -> `<p>` (.announcement-ticker__text)

### components/Grids/RelatedGrid.astro

- L179: `<span>` -> `<small>` (.related-card__badge)

### components/Insights/InsightHeader.astro

- L73: `<div>` -> `<small>` (.insight-header__meta)
- L74: `<span>` -> `<small>` (.insight-header__date)

### components/Masonry/MasonryCards/MasonryCard.astro

- L184: `<span>` -> `<small>` (.card__label)
- L196: `<span>` -> `<small>` (.card__badge)
- L224: `<span>` -> `<small>` (.card__badge)

### components/Presentation/AuthorCard.astro

- L36: `<span>` -> `<small>` (.author-card__label)
- L38: `<span>` -> `<small>` (.author-card__role)

### components/Presentation/ReaderNav.astro

- L205: `<span>` -> `<small>` (.autoplay-label)
- L226: `<span>` -> `<small>` (.speed-label)

### components/Presentation/Sections/CompareSection.astro

- L25: `<div>` -> `<small>` (.compare__label)
- L30: `<div>` -> `<small>` (.compare__label)

### components/Presentation/Sections/EndSection.astro

- L78: `<span>` -> `<small>` (.resource-card__type)
- L101: `<span>` -> `<small>` (.recommended-card__badge)
- L104: `<span>` -> `<small>` (.recommended-card__category)

### components/Presentation/Sections/FullWidthSection.astro

- L23: `<div>` -> `<p>` (.fullwidth__body)

### components/Presentation/Sections/GallerySection.astro

- L32: `<div>` -> `<small>` (.gallery__caption)

### components/Presentation/Sections/HeroSection.astro

- L27: `<div>` -> `<small>` (.hero__meta)
- L28: `<span>` -> `<small>` (.hero__category)
- L29: `<span>` -> `<small>` (.hero__date)

### components/Presentation/Sections/ImageTextSection.astro

- L27: `<div>` -> `<p>` (.image-text__body)

### components/Presentation/Sections/QuoteSection.astro

- L24: `<span>` -> `<small>` (.quote__role)

### components/Presentation/Sections/StatsSection.astro

- L32: `<div>` -> `<small>` (.stats__label)

### components/Presentation/Sections/TextSection.astro

- L19: `<div>` -> `<p>` (.text-section__body)

### components/Presentation/Sections/TitleSection.astro

- L36: `<div>` -> `<small>` (.title-section__meta)
- L37: `<span>` -> `<small>` (.title-section__category)
- L38: `<span>` -> `<small>` (.title-section__date)

### components/Product/IsotopeImageGallery.astro

- L30: `<div>` -> `<small>` (.gallery-badge)

### components/Product/ProductInfo.astro

- L38: `<span>` -> `<small>` (.info-badge)

### components/Sections/CTASection.astro

- L73: `<div>` -> `<p>` (.cta-section__trust-text)

### components/Switcher/BaseSwitcher.astro

- L52: `<span>` -> `<small>` (.switcher-btn__label)

### pages/assets/[slug].astro

- L218: `<div>` -> `<p>` (.content-section__body)
- L225: `<div>` -> `<p>` (.content-section__body)
- L234: `<div>` -> `<p>` (.content-section__body)
- L245: `<div>` -> `<p>` (.content-section__body)
- L263: `<div>` -> `<p>` (.content-section__body)
- L270: `<div>` -> `<p>` (.content-section__body)
- L277: `<div>` -> `<p>` (.content-section__body)
- L286: `<div>` -> `<p>` (.content-section__body)
- L297: `<div>` -> `<p>` (.content-section__body)
- L306: `<div>` -> `<p>` (.content-section__body)

### pages/projects/[slug].astro

- L262: `<div>` -> `<small>` (.editorial-hero__meta)

## Skipped (Manual Review)

- components/Global/CookieBanner.astro L8: .cookie-banner-text - Has block children, can't use <p>
- components/Sections/CTASection.astro L48: .cta-section__body - Has block children, can't use <p>
- components/Sections/ImageTextSection.astro L78: .image-text-section__body - Has block children, can't use <p>
- components/Sections/StorySection.astro L31: .story__text - Has block children, can't use <p>

## Still Manual: Heading Swaps

These need a decision about which heading level:

| File | Class | Suggested |
|------|-------|-----------|
| PresetButton.astro | .a11y-preset-btn__title | `<h4>` (small UI title) |
| CookieBanner.astro (x3) | .cookie-option-title | `<h4>` (option label) |
| ReaderNav.astro | .info-tooltip__title | `<h5>` (tooltip) |
| ReaderNav.astro | .current-section-title | `<h5>` (nav indicator) |
| ReaderNav.astro | .section-name | `<h5>` (nav label) |
| MiniCart.astro | .mini-cart__title | `<h4>` (panel title) |
