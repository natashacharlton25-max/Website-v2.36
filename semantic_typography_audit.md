# Semantic Typography Audit

**Project:** `src`


## Executive Summary

| Metric | Count |
|--------|-------|
| Total font-size: var(--text-*) in components | 791 |
| ↳ Could use semantic element (h1-h6, p) instead | 439 |
| ↳ Uses sizes not mapped to headings (fine) | 352 |
| font-family set explicitly in components | 180 |
| font-weight set explicitly in components | 232 |
| Components with raw size tokens | 78 |
| Base/system definitions (expected) | 64 |

## Heading → Token Reference (from global.css)

| Element | font-size | font-weight | line-height |
|---------|-----------|-------------|-------------|
| h1 | `--text-7xl` | `--font-extrabold` | `--leading-tight` |
| h2 | `--text-5xl` | `--font-semibold` | `--leading-tight` |
| h3 | `--text-4xl` | `--font-semibold` | `--leading-snug` |
| h4 | `--text-lg` | `--font-medium` | `--leading-snug` |
| h5 | `--text-base` | `--font-medium` | `--leading-snug` |
| h6 | `--text-sm` | `--font-bold` | `--leading-snug` |
| p | `--text-lg` | (inherited) | `--leading-relaxed` |
| blockquote | `--text-7xl` | `--font-semibold` | `--leading-relaxed` |

---

## 1. Should Use Semantic Elements (439 usages)

These set font-size to a token that matches a heading/body level.

**Instead of** `font-size: var(--text-5xl)` → **use** `<h2>` and inherit.


### `--text-7xl` → should be `<h1>` (2 usages)

| File | Line | Selector |
|------|------|----------|
| styles/components/hero-morph.css | L108 | `.hero-morph__title.hero-morph__brand` |
| styles/components/values-section.css | L31 | `.values-section__number` |

### `--text-5xl` → should be `<h2>` (14 usages)

| File | Line | Selector |
|------|------|----------|
| components/Presentation/Sections/HeroSection.astro | L109 | `.hero__title` |
| components/Presentation/Sections/StatsSection.astro | L72 | `.stats__value` |
| components/Presentation/Sections/TitleSection.astro | L319 | `.title-section__title` |
| components/Typography/SectionTitle.astro | L298 | `.section-title--xl .section-title__text` |
| pages/search.astro | L220 | `.search-hero__title` |
| styles/a11y/visual/text-only.css | L501 | `#a11y-content-wrapper.a11y-text-only .hero-morph__title.hero-morph__brand` |
| styles/components/cta-section.css | L92 | `.cta-section__title` |
| styles/components/hero-morph.css | L96 | `.hero-morph__title` |
| styles/components/image-text-section.css | L56 | `.image-text-section__title` |
| styles/components/philosophy-flip-cards.css | L218 | `.philosophy-flip__title` |
| styles/components/pillars-section.css | L90 | `.pillars-section__title` |
| styles/components/presentation/sections.css | L110 | `.pres-stats__value` |
| styles/pages/legal.css | L17 | `.legal-title` |
| styles/pages/service-detail.css | L21 | `.service-hero__title` |

### `--text-4xl` → should be `<h3>` (28 usages)

| File | Line | Selector |
|------|------|----------|
| components/Insights/InsightHeader.astro | L120 | `.insight-header__title` |
| components/Presentation/Sections/FullWidthSection.astro | L83 | `.fullwidth__title` |
| components/Presentation/Sections/ImageTextSection.astro | L82 | `.image-text__title` |
| components/Presentation/Sections/QuoteSection.astro | L115 | `.quote__text::before` |
| components/Presentation/Sections/StatsSection.astro | L99 | `.stats__value` |
| components/Presentation/Sections/TextSection.astro | L58 | `.text-section__title` |
| components/Presentation/Sections/TitleSection.astro | L347 | `.title-section__title` |
| components/Product/ProductInfo.astro | L165 | `.product-title` |
| components/Typography/SectionTitle.astro | L296 | `.section-title--lg .section-title__text` |
| components/Typography/SectionTitle.astro | L441 | `.section-title--xl .section-title__text` |
| pages/search.astro | L491 | `.search-hero__title` |
| pages/showcase/section-titles.astro | L386 | `.showcase__header h1` |
| styles/a11y/visual/text-only.css | L887 | `#a11y-content-wrapper.a11y-text-only section:not(.hero-morph) h2:not(.footer__br` |
| styles/components/hero-morph.css | L162 | `.hero-morph__title` |
| styles/components/hero-morph.css | L168 | `.hero-morph__title.hero-morph__brand` |
| styles/components/hero-section.css | L242 | `.hero-section__title` |
| styles/components/image-text-section.css | L93 | `.image-text-section__title` |
| styles/components/presentation/sections.css | L334 | `.pres-stats__value` |
| styles/components/presentation/sections.css | L370 | `.pres-quote__text::before` |
| styles/components/values-section.css | L65 | `.values-section__number` |
| styles/pages/about.css | L9 | `.image-text-section__title` |
| styles/pages/asset-detail.css | L181 | `.product-title` |
| styles/pages/assets.css | L162 | `.cta-title` |
| styles/pages/cart.css | L15 | `.cart-page__title` |
| styles/pages/checkout.css | L559 | `.checkout-title` |
| styles/pages/service-detail.css | L264 | `.service-cta__title` |
| styles/pages/service-detail.css | L362 | `.service-hero__title` |
| styles/pages/services.css | L16 | `.section-title` |

### `--text-lg` → should be `<h4 / p>` (89 usages)

| File | Line | Selector |
|------|------|----------|
| components/Cards/CompactToolCard.astro | L84 | `.compact-title` |
| components/Cards/InsightCard.astro | L215 | `.insight-card__title` |
| components/Cards/ProductCard.astro | L188 | `.product-card__name` |
| components/Cards/ProductCard.astro | L297 | `.price-current` |
| components/Cards/WhyCard.astro | L80 | `.why-card__title` |
| components/ContactForm/Contact-Popup.astro | L499 | `.contact-popup__header h2` |
| components/Footer/Footer.astro | L309 | `.footer__brand-name` |
| components/Grids/RelatedGrid.astro | L501 | `.related-card--featured .related-card__title` |
| components/Grids/RelatedGrid.astro | L571 | `.related-card__title` |
| components/Grids/RelatedGrid.astro | L720 | `.related-grid__title` |
| components/Insights/InsightContent.astro | L61 | `.insight-content :global(h4)` |
| components/Presentation/AuthorCard.astro | L140 | `.author-card--compact .author-card__name` |
| components/Presentation/AuthorCard.astro | L232 | `.author-card__name` |
| components/Presentation/AuthorCard.astro | L253 | `.author-card--featured .author-card__name` |
| components/Presentation/Sections/CalloutSection.astro | L88 | `.callout__title` |
| components/Presentation/Sections/EndSection.astro | L214 | `.resource-card__title` |
| components/Presentation/Sections/EndSection.astro | L336 | `.recommended-card__title` |
| components/Presentation/Sections/FullWidthSection.astro | L92 | `.fullwidth__body` |
| components/Presentation/Sections/HeroSection.astro | L136 | `.hero__description` |
| components/Presentation/Sections/ImageTextSection.astro | L91 | `.image-text__body` |
| components/Presentation/Sections/QuoteSection.astro | L69 | `.quote__author` |
| components/Presentation/Sections/TextSection.astro | L67 | `.text-section__body` |
| components/Presentation/Sections/TitleSection.astro | L323 | `.title-section__description` |
| components/Search/SearchOverlay.astro | L200 | `.search-input` |
| components/Search/SearchOverlay.astro | L378 | `.no-results p` |
| components/Sections/StorySection.astro | L65 | `.story__text p` |
| components/Typography/SectionTitle.astro | L291 | `.section-title--sm .section-title__text` |
| components/Typography/SectionTitle.astro | L478 | `.section-title--md .section-title__text` |
| pages/search.astro | L263 | `.search-input` |
| pages/search.astro | L358 | `.quick-link-card__title` |
| pages/search.astro | L495 | `.search-hero__subtitle` |
| pages/search.astro | L684 | `.search-results__grid .result-item__title` |
| pages/search.astro | L759 | `.search-results__title` |
| pages/search.astro | L805 | `.no-results__title` |
| pages/search.astro | L821 | `.search-hero__title` |
| pages/services/[slug].astro | L266 | `.details-card__title` |
| pages/services/[slug].astro | L426 | `.process-step__number` |
| pages/services/[slug].astro | L514 | `.service-section__title` |
| pages/showcase/section-titles.astro | L392 | `.showcase__header p` |
| pages/verify.astro | L223 | `.verify-greeting` |
| styles/a11y/motion/reduced-motion.css | L778 | `#a11y-content-wrapper.a11y-reduce-motion .philosophy-flip__card-back-content p` |
| styles/a11y/motion/reduced-motion.css | L840 | `.philosophy-flip__card-back-content p` |
| styles/a11y/visual/highlight-links.css | L677 | `#a11y-content-wrapper.a11y-highlight-links .philosophy-flip__card-back-content p` |
| styles/a11y/visual/text-only.css | L2048 | `#a11y-content-wrapper.a11y-text-only .quick-link-card::before` |
| styles/buttons/basic-button.css | L123 | `.btn-lg` |
| styles/components/cta-section.css | L112 | `.cta-section__title` |
| styles/components/hero-morph.css | L53 | `.hero-morph__subtitle` |
| styles/components/hero-section.css | L30 | `.hero-section__description` |
| styles/components/hero-section.css | L385 | `.hero-section__title` |
| styles/components/image-text-section.css | L153 | `.image-text-section__title` |
| styles/components/masonry-card.css | L30 | `.card__heading` |
| styles/components/masonry-card.css | L41 | `.card__title` |
| styles/components/masonry-card.css | L56 | `.card__label` |
| styles/components/masonry-card.css | L82 | `.card__text--emphasis` |
| styles/components/masonry-card.css | L105 | `.card__quote` |
| styles/components/masonry-card.css | L354 | `.card-offset__title` |
| styles/components/philosophy-flip-cards.css | L230 | `.philosophy-flip__intro-line` |
| styles/components/philosophy-flip-cards.css | L279 | `.philosophy-flip__title` |
| styles/components/presentation/sections.css | L47 | `.pres-quote__author` |
| styles/components/presentation/sections.css | L231 | `.pres-callout__title` |
| styles/components/search-results.css | L45 | `.result-card__title` |
| styles/pages/asset-detail.css | L252 | `.product-description` |
| styles/pages/asset-detail.css | L931 | `.compact-title` |
| styles/pages/asset-detail.css | L991 | `.price-current` |
| styles/pages/assets.css | L116 | `.cta-description` |
| styles/pages/cart.css | L94 | `.cart-item-name` |
| styles/pages/cart.css | L352 | `.summary-row.total` |
| styles/pages/cart.css | L385 | `.cart-page__title` |
| styles/pages/cart.css | L454 | `.empty-state h2` |
| styles/pages/checkout.css | L123 | `.checkout-card__title` |
| styles/pages/checkout.css | L141 | `.form-section-title` |
| styles/pages/checkout.css | L259 | `.placeholder-title` |
| styles/pages/checkout.css | L647 | `.order-summary-title` |
| styles/pages/checkout.css | L705 | `.total-row` |
| styles/pages/checkout.css | L784 | `.checkout-title` |
| styles/pages/service-detail.css | L38 | `.service-hero__description` |
| styles/pages/service-detail.css | L114 | `.benefit-item__text` |
| styles/pages/service-detail.css | L140 | `.details-card__title` |
| styles/pages/service-detail.css | L272 | `.service-cta__text` |
| styles/pages/service-detail.css | L385 | `.service-hero__tagline` |
| styles/pages/service-detail.css | L418 | `.process-step__number` |
| styles/pages/service-detail.css | L539 | `.related-service-card__title` |
| styles/pages/service-detail.css | L577 | `.service-section__title` |
| styles/pages/service-detail.css | L651 | `.service-cta__title` |
| styles/pages/service-detail.css | L682 | `.service-hero__title` |
| styles/pages/services.css | L215 | `.timeline-step__number` |
| styles/pages/services.css | L242 | `.timeline-step__title` |
| styles/pages/services.css | L403 | `.services-offerings .related-card--horizontal .related-card__title` |
| styles/pages/services.css | L555 | `.section-title` |

### `--text-base` → should be `<h5>` (114 usages)

| File | Line | Selector |
|------|------|----------|
| components/Cards/InsightCard.astro | L148 | `.insight-card__excerpt` |
| components/Cards/InsightCard.astro | L245 | `.insight-card__title` |
| components/Cards/OfferingCard.astro | L133 | `.offering-card__description` |
| components/Cards/ProductCard.astro | L327 | `.price-current` |
| components/Cards/ProductCard.astro | L394 | `.product-card__name` |
| components/Cards/StepCard.astro | L73 | `.step-card__text` |
| components/Cards/WhyCard.astro | L89 | `.why-card__text` |
| components/Cards/WhyCard.astro | L98 | `.why-card__title` |
| components/ContactForm/Contact-Popup.astro | L310 | `.form__input` |
| components/ContactForm/Contact-Popup.astro | L535 | `.contact-popup__header h2` |
| components/Grids/RelatedGrid.astro | L387 | `.related-card--horizontal .related-card__title` |
| components/Presentation/AuthorCard.astro | L169 | `.author-card--featured .author-card__bio` |
| components/Presentation/AuthorCard.astro | L279 | `.author-card__name` |
| components/Presentation/AuthorCard.astro | L298 | `.author-card--featured .author-card__name` |
| components/Presentation/Sections/CalloutSection.astro | L96 | `.callout__content` |
| components/Presentation/Sections/CompareSection.astro | L94 | `.compare__content` |
| components/Presentation/Sections/EndSection.astro | L453 | `.resource-card__title` |
| components/Presentation/Sections/EndSection.astro | L470 | `.recommended-card__title` |
| components/Presentation/Sections/FullWidthSection.astro | L118 | `.fullwidth__body` |
| components/Presentation/Sections/HeroSection.astro | L150 | `.hero__description` |
| components/Presentation/Sections/ImageTextSection.astro | L122 | `.image-text__body` |
| components/Presentation/Sections/StatsSection.astro | L87 | `.stats__label` |
| components/Presentation/Sections/TextSection.astro | L87 | `.text-section__body` |
| components/Presentation/Sections/TitleSection.astro | L243 | `.title-section__btn` |
| components/Presentation/Sections/TitleSection.astro | L352 | `.title-section__description` |
| components/Product/ProductInfo.astro | L178 | `.product-description` |
| components/Search/SearchOverlay.astro | L175 | `.search-subtitle` |
| components/Search/SearchOverlay.astro | L340 | `.result-title` |
| components/Search/SearchOverlay.astro | L428 | `.search-input` |
| components/Sections/IntroTextSection.astro | L64 | `.intro-text__subtitle` |
| components/Sections/StorySection.astro | L71 | `.story__text p` |
| components/Shop/MiniCart.astro | L197 | `.mini-cart__row--total` |
| components/Typography/SectionTitle.astro | L189 | `.section-title__subtitle` |
| components/Typography/SectionTitle.astro | L288 | `.section-title--xs .section-title__text` |
| pages/search.astro | L471 | `.no-results__text` |
| pages/search.astro | L499 | `.search-input` |
| pages/search.astro | L584 | `.search-hero__subtitle` |
| pages/search.astro | L609 | `.quick-link-card__title` |
| pages/search.astro | L781 | `.search-results__grid .result-item__title` |
| pages/search.astro | L872 | `.search-results__title` |
| pages/search.astro | L915 | `.search-hero__title` |
| pages/services/[slug].astro | L370 | `.process-step__text` |
| pages/services/[slug].astro | L457 | `.details-card__title` |
| pages/services/[slug].astro | L476 | `.process-step__number` |
| pages/services/[slug].astro | L480 | `.process-step__title` |
| pages/services/[slug].astro | L598 | `.service-section__title` |
| pages/verify.astro | L229 | `.verify-message` |
| styles/a11y/visual/text-only.css | L943 | `#a11y-content-wrapper.a11y-text-only .project-spec-card__value` |
| styles/a11y/visual/text-only.css | L1290 | `#a11y-content-wrapper.a11y-text-only .spec-card__value` |
| styles/a11y/visual/text-only.css | L1908 | `#a11y-content-wrapper.a11y-text-only .process-step__title` |
| styles/a11y/visual/text-only.css | L2064 | `#a11y-content-wrapper.a11y-text-only .quick-link-card__title` |
| styles/a11y/visual/text-only.css | L2162 | `#a11y-content-wrapper.a11y-text-only .result-card__title` |
| styles/buttons/basic-button.css | L16 | `.btn` |
| styles/components/cta-section.css | L172 | `.cta-section__title` |
| styles/components/editorial-layout.css | L60 | `.benefits-list__items li` |
| styles/components/editorial-layout.css | L113 | `.editorial-highlight` |
| styles/components/editorial-layout.css | L245 | `.editorial-about__audience p` |
| styles/components/hero-morph.css | L223 | `.hero-morph__subtitle` |
| styles/components/hero-section.css | L38 | `.hero-section__extra` |
| styles/components/hero-section.css | L286 | `.hero-section__description` |
| styles/components/hero-section.css | L421 | `.hero-section__title` |
| styles/components/masonry-card.css | L74 | `.card__text` |
| styles/components/masonry-card.css | L174 | `.card__button` |
| styles/components/philosophy-flip-cards.css | L246 | `.philosophy-flip__intro-line` |
| styles/components/philosophy-flip-cards.css | L263 | `.philosophy-flip__card-back-content h3` |
| styles/components/pillars-section.css | L127 | `.pillars-section__card-title` |
| styles/components/pillars-section.css | L152 | `.pillars-section__title` |
| styles/components/presentation/ReaderNav.css | L1404 | `.reader-resume-toast__section` |
| styles/components/presentation/sections.css | L125 | `.pres-stats__label` |
| styles/components/presentation/sections.css | L239 | `.pres-callout__content` |
| styles/components/presentation/sections.css | L309 | `.pres-compare__content` |
| styles/components/search-results.css | L84 | `.result-card__title` |
| styles/components/toast.css | L32 | `.toast` |
| styles/components/values-section.css | L90 | `.values-section__item-title` |
| styles/pages/asset-detail.css | L465 | `.tab-panel div` |
| styles/pages/asset-detail.css | L529 | `.spec-value` |
| styles/pages/asset-detail.css | L580 | `.content-section__body` |
| styles/pages/asset-detail.css | L865 | `.features-list span` |
| styles/pages/assets.css | L15 | `.page-description` |
| styles/pages/assets.css | L133 | `.newsletter-input` |
| styles/pages/cart.css | L51 | `.empty-state p` |
| styles/pages/cart.css | L105 | `.cart-item-price` |
| styles/pages/cart.css | L196 | `.summary-row` |
| styles/pages/cart.css | L219 | `.btn-block` |
| styles/pages/cart.css | L250 | `.cart-item-name` |
| styles/pages/cart.css | L441 | `.summary-row.total` |
| styles/pages/cart.css | L474 | `.cart-page__title` |
| styles/pages/cart.css | L534 | `.empty-state h2` |
| styles/pages/checkout.css | L38 | `.checkout-subtitle` |
| styles/pages/checkout.css | L412 | `.order-item-name` |
| styles/pages/checkout.css | L500 | `.order-total-row` |
| styles/pages/checkout.css | L599 | `.checkout-card__title` |
| styles/pages/checkout.css | L755 | `.placeholder-title` |
| styles/pages/checkout.css | L853 | `.checkout-title` |
| styles/pages/checkout.css | L983 | `.total-row` |
| styles/pages/legal.css | L24 | `.legal-meta` |
| styles/pages/legal.css | L52 | `.legal-prose p` |
| styles/pages/service-detail.css | L54 | `.service-hero__pricing` |
| styles/pages/service-detail.css | L244 | `.process-step__text` |
| styles/pages/service-detail.css | L389 | `.service-hero__description` |
| styles/pages/service-detail.css | L452 | `.service-hero__tagline` |
| styles/pages/service-detail.css | L476 | `.benefit-item__text` |
| styles/pages/service-detail.css | L484 | `.details-card__title` |
| styles/pages/service-detail.css | L503 | `.process-step__number` |
| styles/pages/service-detail.css | L507 | `.process-step__title` |
| styles/pages/service-detail.css | L531 | `.service-cta__text` |
| styles/pages/service-detail.css | L663 | `.related-service-card__title` |
| styles/pages/service-detail.css | L698 | `.service-section__title` |
| styles/pages/service-detail.css | L763 | `.service-cta__title` |
| styles/pages/services.css | L80 | `.services-offerings .related-card--horizontal .related-card__description` |
| styles/pages/services.css | L301 | `.cta-section .cta-footer` |
| styles/pages/services.css | L429 | `.timeline-step__number` |
| styles/pages/services.css | L433 | `.timeline-step__title` |
| styles/pages/services.css | L480 | `.services-offerings .related-card--horizontal .related-card__title` |

### `--text-sm` → should be `<h6 / small>` (192 usages)

| File | Line | Selector |
|------|------|----------|
| components/Badge/Badge.astro | L157 | `.badge__label` |
| components/Button/ButtonDropdown.astro | L128 | `.dropdown-item` |
| components/Cards/CompactToolCard.astro | L92 | `.compact-description` |
| components/Cards/InsightCard.astro | L134 | `.insight-card__read-time` |
| components/Cards/InsightCard.astro | L219 | `.insight-card__excerpt` |
| components/Cards/InsightCard.astro | L276 | `.insight-card__title` |
| components/Cards/OfferingCard.astro | L148 | `.offering-card__detail h4` |
| components/Cards/OfferingCard.astro | L164 | `.offering-card__detail ul li` |
| components/Cards/ProductCard.astro | L195 | `.product-card__description` |
| components/Cards/ProductCard.astro | L425 | `.product-card__name` |
| components/Cards/ProjectCard.astro | L223 | `.project-card__category` |
| components/Cards/ProjectCard.astro | L227 | `.project-card__description` |
| components/Cards/ProjectSpecCard.astro | L58 | `.project-spec-card__label` |
| components/Cards/ProjectSpecCard.astro | L66 | `.project-spec-card__value` |
| components/Cards/SpecCard.astro | L70 | `.spec-card__value` |
| components/Cards/SpecCard.astro | L85 | `.spec-card__label` |
| components/Cards/WhyCard.astro | L103 | `.why-card__text` |
| components/Cards/WhyCard.astro | L124 | `.why-card__title` |
| components/Checkout/DownloadSummary.astro | L171 | `.download-summary__item-name` |
| components/ContactForm/Contact-Popup.astro | L243 | `.contact-popup__info-item` |
| components/ContactForm/Contact-Popup.astro | L301 | `.form__label` |
| components/ContactForm/Contact-Popup.astro | L429 | `.contact-popup__subtitle` |
| components/ContactForm/Contact-Popup.astro | L593 | `.contact-popup__header h2` |
| components/ContactForm/Contact-Popup.astro | L615 | `.contact-popup__topics h3` |
| components/Footer/Footer.astro | L194 | `.footer__link` |
| components/Footer/Footer.astro | L224 | `.footer__copyright` |
| components/Grids/ForYouGrid.astro | L168 | `.for-you-card__title` |
| components/Grids/RelatedGrid.astro | L509 | `.related-card--featured .related-card__description` |
| components/Grids/RelatedGrid.astro | L583 | `.related-card__date` |
| components/Grids/RelatedGrid.astro | L592 | `.related-card__button` |
| components/Grids/RelatedGrid.astro | L705 | `.related-card--horizontal .related-card__title` |
| components/Insights/InsightHeader.astro | L140 | `.insight-header__readtime` |
| components/Navigation/Breadcrumbs.astro | L37 | `.breadcrumbs` |
| components/Presentation/AuthorCard.astro | L108 | `.author-card__role` |
| components/Presentation/AuthorCard.astro | L116 | `.author-card__bio` |
| components/Presentation/AuthorCard.astro | L209 | `.author-card--featured .author-card__bio` |
| components/Presentation/AuthorCard.astro | L325 | `.author-card__name` |
| components/Presentation/AuthorCard.astro | L344 | `.author-card--featured .author-card__name` |
| components/Presentation/Sections/EndSection.astro | L222 | `.resource-card__description` |
| components/Presentation/Sections/EndSection.astro | L233 | `.resource-card__link` |
| components/Presentation/Sections/EndSection.astro | L348 | `.recommended-card__link` |
| components/Presentation/Sections/EndSection.astro | L501 | `.resource-card__title` |
| components/Presentation/Sections/EndSection.astro | L537 | `.recommended-card__title` |
| components/Presentation/Sections/FullWidthSection.astro | L137 | `.fullwidth__body` |
| components/Presentation/Sections/GallerySection.astro | L84 | `.gallery__caption` |
| components/Presentation/Sections/HeroSection.astro | L104 | `.hero__date` |
| components/Presentation/Sections/ImageTextSection.astro | L137 | `.image-text__body` |
| components/Presentation/Sections/QuoteSection.astro | L76 | `.quote__role` |
| components/Presentation/Sections/TextSection.astro | L98 | `.text-section__body` |
| components/Presentation/Sections/TitleSection.astro | L188 | `.title-section__date` |
| components/Presentation/Sections/TitleSection.astro | L197 | `.title-section__reading-time` |
| components/Presentation/Sections/TitleSection.astro | L373 | `.title-section__description` |
| components/Presentation/Sections/TitleSection.astro | L378 | `.title-section__btn` |
| components/Product/ProductInfo.astro | L173 | `.product-sku` |
| components/Product/ProductInfo.astro | L185 | `.cart-note-inline` |
| components/Search/SearchOverlay.astro | L249 | `.results-title` |
| components/Search/SearchOverlay.astro | L273 | `.quick-link` |
| components/Search/SearchOverlay.astro | L348 | `.result-description` |
| components/Search/SearchOverlay.astro | L384 | `.no-results span` |
| components/Search/SearchOverlay.astro | L391 | `.keyboard-hint` |
| components/Sections/IntroTextSection.astro | L71 | `.intro-text__subtitle` |
| components/Sections/ShareSection.astro | L251 | `.share-section__content .body-subtext` |
| components/Sections/StorySection.astro | L81 | `.story__text p` |
| components/Shop/MiniCart.astro | L66 | `.mini-cart__title` |
| components/Shop/MiniCart.astro | L139 | `.mini-cart__item-name` |
| components/Shop/MiniCart.astro | L188 | `.mini-cart__row` |
| components/Shop/MiniCart.astro | L213 | `.mini-cart__checkout` |
| components/Shop/MiniCart.astro | L241 | `.mini-cart__empty p` |
| components/Switcher/BaseSwitcher.astro | L139 | `.switcher-nav` |
| components/Switcher/BaseSwitcher.astro | L175 | `.switcher-btn` |
| pages/checkout.astro | L135 | `.checkout-info` |
| pages/search.astro | L366 | `.quick-link-card__desc` |
| pages/search.astro | L564 | `.search-results__grid .result-item__desc` |
| pages/search.astro | L630 | `.search-hero__subtitle` |
| pages/search.astro | L634 | `.search-input` |
| pages/search.astro | L688 | `.search-results__grid .result-item__desc` |
| pages/search.astro | L746 | `.quick-link-card__title` |
| pages/search.astro | L809 | `.no-results__text` |
| pages/search.astro | L964 | `.search-results__title` |
| pages/search.astro | L998 | `.search-hero__title` |
| pages/search.astro | L1083 | `.no-results__title` |
| pages/services/[slug].astro | L464 | `.details-card__list li` |
| pages/services/[slug].astro | L484 | `.process-step__text` |
| pages/services/[slug].astro | L497 | `#service-image-section .image-text-section__body p` |
| pages/services/[slug].astro | L533 | `.details-card__title` |
| pages/services/[slug].astro | L563 | `.process-step__number` |
| pages/services/[slug].astro | L567 | `.process-step__title` |
| pages/showcase/section-titles.astro | L403 | `.showcase__label` |
| pages/verify.astro | L244 | `.verify-note p` |
| styles/a11y/visual/text-only.css | L933 | `#a11y-content-wrapper.a11y-text-only .project-spec-card__label` |
| styles/a11y/visual/text-only.css | L1002 | `#a11y-content-wrapper.a11y-text-only .share-btn` |
| styles/a11y/visual/text-only.css | L1275 | `#a11y-content-wrapper.a11y-text-only .spec-card__label` |
| styles/a11y/visual/text-only.css | L1494 | `#a11y-content-wrapper.a11y-text-only h3.for-you-card__title` |
| styles/a11y/visual/text-only.css | L2073 | `#a11y-content-wrapper.a11y-text-only .quick-link-card__desc` |
| styles/buttons/basic-button.css | L117 | `.btn-sm` |
| styles/components/announcement-ticker.css | L80 | `.announcement-ticker__item` |
| styles/components/cart-icon.css | L202 | `#a11y-content-wrapper[class*="a11y-"] .cart-icon__count` |
| styles/components/cta-section.css | L64 | `.cta-section__trust-text span` |
| styles/components/cta-section.css | L123 | `.cta-section__body p` |
| styles/components/cta-section.css | L154 | `.cta-section__trust-text strong` |
| styles/components/editorial-layout.css | L139 | `.editorial-skill` |
| styles/components/editorial-layout.css | L237 | `.editorial-about__audience strong` |
| styles/components/hero-morph.css | L256 | `.hero-morph__subtitle` |
| styles/components/hero-section.css | L290 | `.hero-section__extra` |
| styles/components/hero-section.css | L349 | `.hero-section__description` |
| styles/components/image-text-section.css | L174 | `.image-text-section__title` |
| styles/components/masonry-card.css | L65 | `.card__label--small` |
| styles/components/masonry-card.css | L115 | `.card__author` |
| styles/components/masonry-card.css | L158 | `.card__badge` |
| styles/components/masonry-card.css | L362 | `.card-offset__description` |
| styles/components/masonry-card.css | L375 | `.card-offset__button` |
| styles/components/nav/GlassNav-expandable.css | L82 | `.expandable-item h3` |
| styles/components/nav/GlassNav-expandable.css | L101 | `.expandable-item p` |
| styles/components/philosophy-flip-cards.css | L268 | `.philosophy-flip__card-back-content p` |
| styles/components/philosophy-flip-cards.css | L283 | `.philosophy-flip__intro-line` |
| styles/components/philosophy-flip-cards.css | L291 | `.philosophy-flip__card-back-content h3` |
| styles/components/pillars-section.css | L110 | `.pillars-section__description` |
| styles/components/pillars-section.css | L133 | `.pillars-section__card-description` |
| styles/components/presentation/ReaderNav.css | L325 | `.current-section-title` |
| styles/components/presentation/ReaderNav.css | L1399 | `.reader-resume-toast__text` |
| styles/components/presentation/ReaderNav.css | L1418 | `.reader-resume-toast__btn` |
| styles/components/presentation/sections.css | L54 | `.pres-quote__role` |
| styles/components/presentation/sections.css | L175 | `.pres-gallery__caption` |
| styles/components/search-results.css | L53 | `.result-card__desc` |
| styles/components/search-results.css | L104 | `.result-card__title` |
| styles/components/toast.css | L103 | `.toast-arcade` |
| styles/components/toast.css | L283 | `.toast` |
| styles/components/values-section.css | L95 | `.values-section__item-text` |
| styles/components/values-section.css | L106 | `.values-section__item-title` |
| styles/pages/asset-detail.css | L172 | `.product-category` |
| styles/pages/asset-detail.css | L194 | `.product-info-row` |
| styles/pages/asset-detail.css | L278 | `.info-item` |
| styles/pages/asset-detail.css | L296 | `.download-note` |
| styles/pages/asset-detail.css | L343 | `.cart-btn-wrapper :global(.unified-btn button)` |
| styles/pages/asset-detail.css | L523 | `.spec-label` |
| styles/pages/asset-detail.css | L618 | `.content-section__item` |
| styles/pages/asset-detail.css | L732 | `.spec-card__value` |
| styles/pages/asset-detail.css | L940 | `.compact-description` |
| styles/pages/assets.css | L59 | `.products-count` |
| styles/pages/cart.css | L292 | `.cart-item-name` |
| styles/pages/cart.css | L297 | `.cart-item-price` |
| styles/pages/cart.css | L319 | `.cart-item-total` |
| styles/pages/cart.css | L348 | `.summary-row` |
| styles/pages/cart.css | L369 | `.empty-state p` |
| styles/pages/cart.css | L374 | `.btn-block` |
| styles/pages/cart.css | L525 | `.summary-row.total` |
| styles/pages/checkout.css | L80 | `.step-label` |
| styles/pages/checkout.css | L116 | `.checkout-card__step` |
| styles/pages/checkout.css | L157 | `.checkout-form .form-input` |
| styles/pages/checkout.css | L172 | `.checkout-form .form-label` |
| styles/pages/checkout.css | L184 | `.checkbox-label` |
| styles/pages/checkout.css | L207 | `.form-hint` |
| styles/pages/checkout.css | L221 | `.info-notice` |
| styles/pages/checkout.css | L242 | `.payment-info-notice` |
| styles/pages/checkout.css | L281 | `.card-option` |
| styles/pages/checkout.css | L286 | `.placeholder-note` |
| styles/pages/checkout.css | L293 | `.payment-errors` |
| styles/pages/checkout.css | L304 | `.payment-methods` |
| styles/pages/checkout.css | L332 | `.checkout-terms` |
| styles/pages/checkout.css | L419 | `.order-item-type` |
| styles/pages/checkout.css | L461 | `.free-notice-text` |
| styles/pages/checkout.css | L487 | `.promo-code-input` |
| styles/pages/checkout.css | L532 | `.trust-badge` |
| styles/pages/checkout.css | L608 | `.checkout-form .form-input` |
| styles/pages/checkout.css | L667 | `.order-item-name` |
| styles/pages/checkout.css | L689 | `.free-notice-title` |
| styles/pages/checkout.css | L701 | `.order-total-row` |
| styles/pages/checkout.css | L727 | `.step-number` |
| styles/pages/checkout.css | L740 | `.promo-code-input` |
| styles/pages/checkout.css | L759 | `.placeholder-description` |
| styles/pages/checkout.css | L882 | `.checkout-card__title` |
| styles/pages/checkout.css | L938 | `.order-summary-title` |
| styles/pages/checkout.css | L1002 | `.placeholder-title` |
| styles/pages/service-detail.css | L332 | `.related-service-card__tagline` |
| styles/pages/service-detail.css | L339 | `.related-service-card__link` |
| styles/pages/service-detail.css | L456 | `.service-hero__description` |
| styles/pages/service-detail.css | L491 | `.details-card__list li` |
| styles/pages/service-detail.css | L511 | `.process-step__text` |
| styles/pages/service-detail.css | L559 | `.service-hero__tagline` |
| styles/pages/service-detail.css | L597 | `.benefit-item__text` |
| styles/pages/service-detail.css | L605 | `.details-card__title` |
| styles/pages/service-detail.css | L635 | `.process-step__number` |
| styles/pages/service-detail.css | L639 | `.process-step__title` |
| styles/pages/service-detail.css | L655 | `.service-cta__text` |
| styles/pages/service-detail.css | L780 | `.related-service-card__title` |
| styles/pages/services.css | L250 | `.timeline-step__text` |
| styles/pages/services.css | L368 | `.services-offerings .related-card--horizontal .related-card__description` |
| styles/pages/services.css | L407 | `.services-offerings .related-card--horizontal .related-card__description` |
| styles/pages/services.css | L521 | `.timeline-step__number` |
| styles/pages/services.css | L529 | `.timeline-step__title` |
| styles/pages/services.css | L543 | `.cta-section .cta-footer` |
| styles/pages/services.css | L577 | `.services-offerings .related-card--horizontal .related-card__title` |

---

## 2. Non-Heading Sizes (352 usages) — Likely Fine

These use sizes that don't map 1:1 to heading levels (--text-xs, --text-xl, --text-2xl, --text-3xl, --text-6xl).

Some may still be candidates for utility classes.


### `--text-2xl` (48 usages)

| File | Line | Selector |
|------|------|----------|
| components/Cards/OfferingCard.astro | L125 | `.offering-card__title` |
| components/Cards/StepCard.astro | L53 | `.step-card__number` |
| components/ContactForm/Contact-Popup.astro | L425 | `.contact-popup__header h2` |
| components/Footer/Footer.astro | L243 | `.footer__brand-name` |
| components/Insights/InsightContent.astro | L49 | `.insight-content :global(h2)` |
| components/Presentation/AuthorCard.astro | L165 | `.author-card--featured .author-card__name` |
| components/Presentation/Sections/CompareSection.astro | L86 | `.compare__title` |
| components/Presentation/Sections/FullWidthSection.astro | L132 | `.fullwidth__title` |
| components/Presentation/Sections/HeroSection.astro | L146 | `.hero__title` |
| components/Presentation/Sections/ImageTextSection.astro | L132 | `.image-text__title` |
| components/Presentation/Sections/QuoteSection.astro | L91 | `.quote--minimal .quote__text` |
| components/Presentation/Sections/QuoteSection.astro | L101 | `.quote__text` |
| components/Presentation/Sections/TextSection.astro | L93 | `.text-section__title` |
| components/Search/SearchOverlay.astro | L420 | `.search-title` |
| components/Sections/ShareSection.astro | L246 | `.share-section__content h2` |
| components/Typography/SectionTitle.astro | L294 | `.section-title--md .section-title__text` |
| components/Typography/SectionTitle.astro | L445 | `.section-title--lg .section-title__text` |
| pages/search.astro | L463 | `.no-results__title` |
| pages/search.astro | L626 | `.search-hero__title` |
| pages/services/[slug].astro | L401 | `.service-section__title` |
| pages/verify.astro | L216 | `.verify-title` |
| styles/a11y/visual/text-only.css | L1366 | `#a11y-content-wrapper.a11y-text-only section:not(.hero-morph) h2:not(.footer__br` |
| styles/a11y/visual/text-only.css | L1398 | `#a11y-content-wrapper.a11y-text-only .hero-section__title` |
| styles/a11y/visual/text-only.css | L1750 | `#a11y-content-wrapper.a11y-text-only .end-section__resources::before` |
| styles/a11y/visual/text-only.css | L1772 | `#a11y-content-wrapper.a11y-text-only .end-section__recommended::before` |
| styles/components/editorial-layout.css | L88 | `.editorial__section-title` |
| styles/components/hero-morph.css | L241 | `.hero-morph__title` |
| styles/components/hero-morph.css | L245 | `.hero-morph__title.hero-morph__brand` |
| styles/components/hero-section.css | L318 | `.hero-section__title` |
| styles/components/image-text-section.css | L132 | `.image-text-section__title` |
| styles/components/masonry-card.css | L89 | `.card__value` |
| styles/components/nav/GlassNav-mobile.css | L244 | `.submenu-toggle` |
| styles/components/philosophy-flip-cards.css | L94 | `.philosophy-flip__card-title-overlay h3` |
| styles/components/philosophy-flip-cards.css | L119 | `.philosophy-flip__card-back-content h3` |
| styles/components/presentation/sections.css | L68 | `.pres-quote--minimal .pres-quote__text` |
| styles/components/presentation/sections.css | L301 | `.pres-compare__title` |
| styles/components/presentation/sections.css | L325 | `.pres-quote__text` |
| styles/components/values-section.css | L86 | `.values-section__number` |
| styles/pages/asset-detail.css | L246 | `.price-current` |
| styles/pages/asset-detail.css | L439 | `.tab-panel h2` |
| styles/pages/asset-detail.css | L919 | `.compact-arrow` |
| styles/pages/asset-detail.css | L987 | `.product-title` |
| styles/pages/cart.css | L43 | `.empty-state h2` |
| styles/pages/cart.css | L235 | `.cart-page__title` |
| styles/pages/service-detail.css | L393 | `.service-section__title` |
| styles/pages/service-detail.css | L432 | `.service-cta__title` |
| styles/pages/service-detail.css | L448 | `.service-hero__title` |
| styles/pages/services.css | L381 | `.section-title` |

### `--text-2xs` (5 usages)

| File | Line | Selector |
|------|------|----------|
| components/ContactForm/Contact-Popup.astro | L539 | `.contact-popup__subtitle` |
| components/ContactForm/Contact-Popup.astro | L670 | `.form__label` |
| components/ContactForm/Contact-Popup.astro | L709 | `.contact-popup__header h2` |
| components/ContactForm/Contact-Popup.astro | L723 | `.form__input` |
| components/ContactForm/Contact-Popup.astro | L739 | `.contact-popup__topics h3` |

### `--text-3xl` (42 usages)

| File | Line | Selector |
|------|------|----------|
| components/Footer/Footer.astro | L176 | `.footer__brand-name` |
| components/Presentation/Sections/FullWidthSection.astro | L114 | `.fullwidth__title` |
| components/Presentation/Sections/HeroSection.astro | L132 | `.hero__title` |
| components/Presentation/Sections/ImageTextSection.astro | L118 | `.image-text__title` |
| components/Presentation/Sections/QuoteSection.astro | L39 | `.quote__text` |
| components/Presentation/Sections/StatsSection.astro | L81 | `.stats__suffix` |
| components/Presentation/Sections/StatsSection.astro | L110 | `.stats__value` |
| components/Presentation/Sections/TextSection.astro | L83 | `.text-section__title` |
| components/Presentation/Sections/TitleSection.astro | L369 | `.title-section__title` |
| components/Product/ProductInfo.astro | L214 | `.product-title` |
| components/Search/SearchOverlay.astro | L167 | `.search-title` |
| components/Typography/SectionTitle.astro | L440 | `.section-title--lg .section-title__text` |
| components/Typography/SectionTitle.astro | L446 | `.section-title--xl .section-title__text` |
| pages/search.astro | L398 | `.search-results__title` |
| pages/search.astro | L410 | `.search-results__query` |
| pages/search.astro | L580 | `.search-hero__title` |
| pages/services/[slug].astro | L235 | `.service-section__title` |
| styles/a11y/visual/text-only.css | L638 | `#a11y-content-wrapper.a11y-text-only .footer__brand-name` |
| styles/a11y/visual/text-only.css | L1074 | `#a11y-content-wrapper.a11y-text-only .tab-panel[data-panel]::before` |
| styles/a11y/visual/text-only.css | L1373 | `#a11y-content-wrapper.a11y-text-only .hero-section__title` |
| styles/a11y/visual/text-only.css | L1439 | `#a11y-content-wrapper.a11y-text-only .for-you-grid::before` |
| styles/a11y/visual/text-only.css | L1975 | `#a11y-content-wrapper.a11y-text-only .search-hero__title` |
| styles/a11y/visual/text-only.css | L2092 | `#a11y-content-wrapper.a11y-text-only .search-results__title` |
| styles/a11y/visual/text-only.css | L2101 | `#a11y-content-wrapper.a11y-text-only .search-results__query` |
| styles/components/hero-morph.css | L208 | `.hero-morph__title` |
| styles/components/hero-morph.css | L213 | `.hero-morph__title.hero-morph__brand` |
| styles/components/hero-section.css | L280 | `.hero-section__title` |
| styles/components/image-text-section.css | L106 | `.image-text-section__title` |
| styles/components/masonry-card.css | L98 | `.card__value--large` |
| styles/components/philosophy-flip-cards.css | L225 | `.philosophy-flip__title` |
| styles/components/presentation/sections.css | L17 | `.pres-quote__text` |
| styles/components/presentation/sections.css | L119 | `.pres-stats__suffix` |
| styles/components/presentation/sections.css | L379 | `.pres-stats__value` |
| styles/pages/asset-detail.css | L870 | `.section-title` |
| styles/pages/asset-detail.css | L965 | `.product-title` |
| styles/pages/assets.css | L109 | `.cta-title` |
| styles/pages/checkout.css | L29 | `.checkout-title` |
| styles/pages/legal.css | L35 | `.legal-prose h2` |
| styles/pages/service-detail.css | L73 | `.service-section__title` |
| styles/pages/service-detail.css | L381 | `.service-hero__title` |
| styles/pages/services.css | L69 | `.services-offerings .related-card--horizontal .related-card__title` |
| styles/pages/services.css | L318 | `.section-title` |

### `--text-6xl` (6 usages)

| File | Line | Selector |
|------|------|----------|
| components/Presentation/Sections/QuoteSection.astro | L53 | `.quote__text::before` |
| components/Presentation/Sections/TitleSection.astro | L211 | `.title-section__title` |
| styles/components/hero-morph.css | L135 | `.hero-morph__title.hero-morph__brand` |
| styles/components/presentation/sections.css | L31 | `.pres-quote__text::before` |
| styles/pages/assets.css | L150 | `.page-title` |
| styles/pages/legal.css | L135 | `.legal-title` |

### `--text-md` (3 usages)

| File | Line | Selector |
|------|------|----------|
| components/Cards/ProductCard.astro | L216 | `.price-current` |
| components/Cards/ProjectCard.astro | L136 | `.project-card__category` |
| components/Cards/SpecCard.astro | L62 | `.spec-card__label` |

### `--text-xl` (67 usages)

| File | Line | Selector |
|------|------|----------|
| components/Cards/CompactToolCard.astro | L106 | `.compact-arrow` |
| components/Cards/InsightCard.astro | L139 | `.insight-card__title` |
| components/Cards/ProductCard.astro | L230 | `.add-to-cart-icon` |
| components/Cards/ProductCard.astro | L283 | `.price-current` |
| components/Cards/ProjectCard.astro | L251 | `.project-card__title` |
| components/Cards/StepCard.astro | L64 | `.step-card__title` |
| components/ContactForm/Contact-Popup.astro | L456 | `.contact-popup__header h2` |
| components/Footer/Footer.astro | L288 | `.footer__brand-name` |
| components/Grids/RelatedGrid.astro | L691 | `.related-grid__title` |
| components/Insights/InsightContent.astro | L55 | `.insight-content :global(h3)` |
| components/Presentation/AuthorCard.astro | L98 | `.author-card__name` |
| components/Presentation/AuthorCard.astro | L205 | `.author-card--featured .author-card__name` |
| components/Presentation/Sections/FullWidthSection.astro | L151 | `.fullwidth__title` |
| components/Presentation/Sections/HeroSection.astro | L118 | `.hero__description` |
| components/Presentation/Sections/HeroSection.astro | L156 | `.hero__title` |
| components/Presentation/Sections/ImageTextSection.astro | L143 | `.image-text__title` |
| components/Presentation/Sections/QuoteSection.astro | L111 | `.quote__text` |
| components/Presentation/Sections/TextSection.astro | L104 | `.text-section__title` |
| components/Presentation/Sections/TitleSection.astro | L222 | `.title-section__description` |
| components/Search/SearchOverlay.astro | L444 | `.search-title` |
| components/Sections/IntroTextSection.astro | L32 | `.intro-text__lead` |
| components/Sections/IntroTextSection.astro | L40 | `.intro-text__subtitle` |
| components/Sections/ShareSection.astro | L273 | `.share-section__content h2` |
| components/Sections/StorySection.astro | L51 | `.story__text p` |
| components/Typography/SectionTitle.astro | L474 | `.section-title--xl .section-title__text` |
| pages/search.astro | L233 | `.search-hero__subtitle` |
| pages/search.astro | L560 | `.search-results__grid .result-item__title` |
| pages/search.astro | L661 | `.search-results__title` |
| pages/search.astro | L705 | `.search-hero__title` |
| pages/services/[slug].astro | L335 | `.process-step__number` |
| pages/services/[slug].astro | L362 | `.process-step__title` |
| pages/services/[slug].astro | L443 | `.service-section__title` |
| styles/a11y/motion/reduced-motion.css | L773 | `#a11y-content-wrapper.a11y-reduce-motion .philosophy-flip__card-back-content h3` |
| styles/a11y/motion/reduced-motion.css | L835 | `.philosophy-flip__card-back-content h3` |
| styles/a11y/visual/highlight-links.css | L672 | `#a11y-content-wrapper.a11y-highlight-links .philosophy-flip__card-back-content h` |
| styles/a11y/visual/text-only.css | L1390 | `#a11y-content-wrapper.a11y-text-only section:not(.hero-morph) h2:not(.footer__br` |
| styles/components/cta-section.css | L58 | `.cta-section__trust-text strong` |
| styles/components/hero-morph.css | L267 | `.hero-morph__title` |
| styles/components/hero-morph.css | L272 | `.hero-morph__title.hero-morph__brand` |
| styles/components/hero-section.css | L345 | `.hero-section__title` |
| styles/components/philosophy-flip-cards.css | L21 | `.philosophy-flip__intro-line` |
| styles/components/philosophy-flip-cards.css | L128 | `.philosophy-flip__card-back-content p` |
| styles/components/philosophy-flip-cards.css | L201 | `.philosophy-flip__card-back-content h3` |
| styles/components/philosophy-flip-cards.css | L206 | `.philosophy-flip__card-back-content p` |
| styles/components/philosophy-flip-cards.css | L237 | `.philosophy-flip__title` |
| styles/components/pillars-section.css | L105 | `.pillars-section__title` |
| styles/components/presentation/sections.css | L366 | `.pres-quote__text` |
| styles/components/values-section.css | L69 | `.values-section__item-title` |
| styles/components/values-section.css | L102 | `.values-section__number` |
| styles/pages/asset-detail.css | L448 | `.tab-panel h3` |
| styles/pages/asset-detail.css | L969 | `.price-current` |
| styles/pages/cart.css | L204 | `.summary-row.total` |
| styles/pages/cart.css | L275 | `.cart-page__title` |
| styles/pages/cart.css | L365 | `.empty-state h2` |
| styles/pages/checkout.css | L360 | `.order-summary-title` |
| styles/pages/checkout.css | L513 | `.total-row` |
| styles/pages/checkout.css | L579 | `.checkout-title` |
| styles/pages/legal.css | L43 | `.legal-prose h3` |
| styles/pages/service-detail.css | L30 | `.service-hero__tagline` |
| styles/pages/service-detail.css | L209 | `.process-step__number` |
| styles/pages/service-detail.css | L236 | `.process-step__title` |
| styles/pages/service-detail.css | L324 | `.related-service-card__title` |
| styles/pages/service-detail.css | L464 | `.service-section__title` |
| styles/pages/service-detail.css | L527 | `.service-cta__title` |
| styles/pages/service-detail.css | L554 | `.service-hero__title` |
| styles/pages/services.css | L364 | `.services-offerings .related-card--horizontal .related-card__title` |
| styles/pages/services.css | L453 | `.section-title` |

### `--text-xs` (181 usages)

| File | Line | Selector |
|------|------|----------|
| components/Badge/Badge.astro | L343 | `.badge__label` |
| components/Cards/CompactToolCard.astro | L76 | `.compact-category` |
| components/Cards/InsightCard.astro | L249 | `.insight-card__excerpt` |
| components/Cards/InsightCard.astro | L253 | `.insight-card__read-time` |
| components/Cards/InsightCard.astro | L306 | `.insight-card__title` |
| components/Cards/ProductCard.astro | L180 | `.product-card__category` |
| components/Cards/ProductCard.astro | L398 | `.product-card__description` |
| components/Cards/ProductCard.astro | L461 | `.product-card__name` |
| components/Cards/ProjectCard.astro | L247 | `.project-card__category` |
| components/Cards/ProjectCard.astro | L255 | `.project-card__description` |
| components/Cards/ProjectSpecCard.astro | L85 | `.project-spec-card__label` |
| components/Cards/ProjectSpecCard.astro | L89 | `.project-spec-card__value` |
| components/Cards/SpecCard.astro | L89 | `.spec-card__value` |
| components/Cards/SpecCard.astro | L106 | `.spec-card__value` |
| components/Cards/SpecCard.astro | L144 | `.spec-card__label` |
| components/Cards/WhyCard.astro | L70 | `.why-card__badge-text` |
| components/Cards/WhyCard.astro | L128 | `.why-card__text` |
| components/Cards/WhyCard.astro | L164 | `.why-card__title` |
| components/Checkout/DownloadSummary.astro | L120 | `.download-summary__empty p` |
| components/Checkout/DownloadSummary.astro | L186 | `.download-summary__badge` |
| components/Checkout/DownloadSummary.astro | L227 | `.download-summary__item-name` |
| components/ContactForm/Contact-Popup.astro | L460 | `.contact-popup__subtitle` |
| components/ContactForm/Contact-Popup.astro | L649 | `.contact-popup__header h2` |
| components/ContactForm/Contact-Popup.astro | L666 | `.form__input` |
| components/ContactForm/Contact-Popup.astro | L682 | `.contact-popup__topics h3` |
| components/Footer/Footer.astro | L251 | `.footer__link` |
| components/Footer/Footer.astro | L315 | `.footer__link` |
| components/Footer/Footer.astro | L320 | `.footer__copyright` |
| components/Grids/RelatedGrid.astro | L744 | `.related-card--horizontal .related-card__title` |
| components/Grids/RelatedGrid.astro | L748 | `.related-card--horizontal :global(.btn)` |
| components/Navigation/Breadcrumbs.astro | L65 | `.breadcrumbs` |
| components/Presentation/AuthorCard.astro | L88 | `.author-card__label` |
| components/Presentation/AuthorCard.astro | L144 | `.author-card--compact .author-card__bio` |
| components/Presentation/AuthorCard.astro | L237 | `.author-card__role` |
| components/Presentation/AuthorCard.astro | L242 | `.author-card__bio` |
| components/Presentation/AuthorCard.astro | L257 | `.author-card--featured .author-card__bio` |
| components/Presentation/AuthorCard.astro | L370 | `.author-card__name` |
| components/Presentation/AuthorCard.astro | L389 | `.author-card--featured .author-card__name` |
| components/Presentation/Sections/CompareSection.astro | L68 | `.compare__label` |
| components/Presentation/Sections/EndSection.astro | L205 | `.resource-card__type` |
| components/Presentation/Sections/EndSection.astro | L327 | `.recommended-card__category` |
| components/Presentation/Sections/EndSection.astro | L457 | `.resource-card__description` |
| components/Presentation/Sections/EndSection.astro | L509 | `.resource-card__link` |
| components/Presentation/Sections/EndSection.astro | L541 | `.recommended-card__link` |
| components/Presentation/Sections/EndSection.astro | L577 | `.resource-card__title` |
| components/Presentation/Sections/EndSection.astro | L620 | `.recommended-card__title` |
| components/Presentation/Sections/FullWidthSection.astro | L155 | `.fullwidth__body` |
| components/Presentation/Sections/HeroSection.astro | L96 | `.hero__category` |
| components/Presentation/Sections/ImageTextSection.astro | L147 | `.image-text__body` |
| components/Presentation/Sections/TextSection.astro | L108 | `.text-section__body` |
| components/Presentation/Sections/TitleSection.astro | L179 | `.title-section__category` |
| components/Product/ProductInfo.astro | L133 | `.info-badge` |
| components/Search/SearchOverlay.astro | L358 | `.result-category` |
| components/Search/SearchOverlay.astro | L399 | `.keyboard-hint kbd` |
| components/Sections/ShareSection.astro | L164 | `.share-btn::after` |
| components/Sections/ShareSection.astro | L277 | `.share-section__content .body-subtext` |
| components/Shop/MiniCart.astro | L74 | `.mini-cart__edit` |
| components/Shop/MiniCart.astro | L150 | `.mini-cart__item-meta` |
| components/Switcher/BaseSwitcher.astro | L302 | `.switcher-btn` |
| components/Switcher/BaseSwitcher.astro | L332 | `.switcher-btn` |
| components/Switcher/BaseSwitcher.astro | L337 | `.switcher-btn__label` |
| components/Typography/SectionTitle.astro | L360 | `.section-title--variant-badge .section-title__text` |
| pages/checkout.astro | L154 | `.checkout-info` |
| pages/search.astro | L613 | `.quick-link-card__desc` |
| pages/search.astro | L692 | `.search-results__grid .result-item__category` |
| pages/search.astro | L709 | `.search-hero__subtitle` |
| pages/search.astro | L786 | `.search-results__grid .result-item__desc` |
| pages/search.astro | L791 | `.search-results__grid .result-item__breadcrumb` |
| pages/search.astro | L796 | `.search-results__grid .result-item__category` |
| pages/search.astro | L825 | `.search-hero__subtitle` |
| pages/search.astro | L830 | `.search-input` |
| pages/search.astro | L863 | `.quick-link-card__title` |
| pages/search.astro | L893 | `.search-results__grid .result-item__title` |
| pages/search.astro | L955 | `.quick-link-card__title` |
| pages/search.astro | L978 | `.search-results__grid .result-item__breadcrumb` |
| pages/search.astro | L982 | `.search-results__grid .result-item__title` |
| pages/search.astro | L1004 | `.search-input` |
| pages/search.astro | L1035 | `.quick-link-card__title` |
| pages/search.astro | L1048 | `.search-results__title` |
| pages/search.astro | L1052 | `.search-results__query` |
| pages/search.astro | L1065 | `.search-results__grid .result-item__breadcrumb` |
| pages/search.astro | L1070 | `.search-results__grid .result-item__title` |
| pages/search.astro | L1087 | `.no-results__text` |
| pages/search.astro | L1099 | `.search-hero__title` |
| pages/search.astro | L1105 | `.search-input` |
| pages/search.astro | L1136 | `.quick-link-card__title` |
| pages/search.astro | L1145 | `.search-results__title` |
| pages/search.astro | L1149 | `.search-results__query` |
| pages/search.astro | L1167 | `.search-results__grid .result-item__breadcrumb` |
| pages/search.astro | L1172 | `.search-results__grid .result-item__title` |
| pages/search.astro | L1186 | `.no-results__title` |
| pages/search.astro | L1190 | `.no-results__text` |
| pages/services/[slug].astro | L538 | `.details-card__list li` |
| pages/services/[slug].astro | L571 | `.process-step__text` |
| pages/services/[slug].astro | L576 | `#service-image-section .image-text-section__body p` |
| pages/services/[slug].astro | L616 | `.details-card__title` |
| pages/services/[slug].astro | L636 | `.process-step__number` |
| pages/services/[slug].astro | L640 | `.process-step__title` |
| pages/showcase/section-titles.astro | L449 | `.showcase__item code` |
| styles/a11y/base/screen-reader.css | L37 | `#a11y-content-wrapper.a11y-screen-reader-mode::after` |
| styles/a11y/visual/text-only.css | L2153 | `#a11y-content-wrapper.a11y-text-only .result-card__badge-wrap .badge` |
| styles/components/cart-icon.css | L116 | `.cart-icon__count` |
| styles/components/cart-icon.css | L159 | `.cart-icon__count` |
| styles/components/cookie-banner.css | L117 | `.cookie-required` |
| styles/components/cta-section.css | L158 | `.cta-section__trust-text span` |
| styles/components/cta-section.css | L176 | `.cta-section__body p` |
| styles/components/cta-section.css | L180 | `.cta-section__trust-text strong` |
| styles/components/cta-section.css | L184 | `.cta-section__trust-text span` |
| styles/components/hero-morph.css | L280 | `.hero-morph__subtitle` |
| styles/components/hero-section.css | L353 | `.hero-section__extra` |
| styles/components/hero-section.css | L427 | `.hero-section__description` |
| styles/components/nav/GlassNav-base.css | L73 | `.nav-links a` |
| styles/components/nav/GlassNav-base.css | L98 | `.nav-item-expandable` |
| styles/components/nav/GlassNav-expandable.css | L133 | `.expandable-item--icon h3` |
| styles/components/nav/GlassNav-responsive.css | L39 | `.nav-item-expandable` |
| styles/components/philosophy-flip-cards.css | L295 | `.philosophy-flip__card-back-content p` |
| styles/components/pillars-section.css | L158 | `.pillars-section__description` |
| styles/components/pillars-section.css | L193 | `.pillars-section__card-title` |
| styles/components/pillars-section.css | L200 | `.pillars-section__card-description` |
| styles/components/presentation/ReaderNav.css | L396 | `.speed-label` |
| styles/components/presentation/ReaderNav.css | L525 | `.section-number` |
| styles/components/presentation/ReaderNav.css | L552 | `.section-name` |
| styles/components/presentation/ReaderNav.css | L1106 | `.current-section-title` |
| styles/components/presentation/sections.css | L283 | `.pres-compare__label` |
| styles/components/product-gallery.css | L65 | `.product-badge` |
| styles/components/search-results.css | L108 | `.result-card__desc` |
| styles/components/values-section.css | L110 | `.values-section__item-text` |
| styles/pages/asset-detail.css | L231 | `.product-sku` |
| styles/pages/asset-detail.css | L355 | `.cart-btn-wrapper :global(.unified-btn button)` |
| styles/pages/asset-detail.css | L367 | `.cart-note-inline` |
| styles/pages/asset-detail.css | L724 | `.spec-card__label` |
| styles/pages/asset-detail.css | L740 | `.spec-card__text` |
| styles/pages/asset-detail.css | L910 | `.compact-category` |
| styles/pages/asset-detail.css | L1018 | `.spec-card__value` |
| styles/pages/cart.css | L315 | `.qty-value` |
| styles/pages/cart.css | L405 | `.cart-item-name` |
| styles/pages/cart.css | L409 | `.cart-item-price` |
| styles/pages/cart.css | L427 | `.cart-item-total` |
| styles/pages/cart.css | L437 | `.summary-row` |
| styles/pages/cart.css | L458 | `.empty-state p` |
| styles/pages/cart.css | L463 | `.btn-block` |
| styles/pages/checkout.css | L315 | `.payment-icon` |
| styles/pages/checkout.css | L434 | `.free-badge` |
| styles/pages/checkout.css | L595 | `.checkout-card__step` |
| styles/pages/checkout.css | L603 | `.checkout-form .form-label` |
| styles/pages/checkout.css | L612 | `.form-hint` |
| styles/pages/checkout.css | L617 | `.checkbox-label` |
| styles/pages/checkout.css | L638 | `.checkout-info` |
| styles/pages/checkout.css | L642 | `.checkout-terms` |
| styles/pages/checkout.css | L671 | `.order-item-type` |
| styles/pages/checkout.css | L693 | `.free-notice-text` |
| styles/pages/checkout.css | L716 | `.trust-badge` |
| styles/pages/checkout.css | L731 | `.step-label` |
| styles/pages/checkout.css | L746 | `.info-notice` |
| styles/pages/checkout.css | L767 | `.card-option` |
| styles/pages/checkout.css | L858 | `.checkout-subtitle` |
| styles/pages/checkout.css | L888 | `.checkout-form .form-input` |
| styles/pages/checkout.css | L915 | `.checkout-actions .btn` |
| styles/pages/checkout.css | L948 | `.order-item-name` |
| styles/pages/checkout.css | L969 | `.free-notice-title` |
| styles/pages/checkout.css | L978 | `.order-total-row` |
| styles/pages/checkout.css | L1007 | `.placeholder-description` |
| styles/pages/service-detail.css | L543 | `.related-service-card__tagline` |
| styles/pages/service-detail.css | L564 | `.service-hero__description` |
| styles/pages/service-detail.css | L610 | `.details-card__list li` |
| styles/pages/service-detail.css | L643 | `.process-step__text` |
| styles/pages/service-detail.css | L671 | `.related-service-card__link` |
| styles/pages/service-detail.css | L686 | `.service-hero__tagline` |
| styles/pages/service-detail.css | L715 | `.benefit-item__text` |
| styles/pages/service-detail.css | L723 | `.details-card__title` |
| styles/pages/service-detail.css | L743 | `.process-step__number` |
| styles/pages/service-detail.css | L747 | `.process-step__title` |
| styles/pages/service-detail.css | L767 | `.service-cta__text` |
| styles/pages/service-detail.css | L771 | `.service-cta__buttons .btn` |
| styles/pages/services.css | L59 | `.services-offerings .related-card--horizontal .related-card__badge` |
| styles/pages/services.css | L437 | `.timeline-step__text` |
| styles/pages/services.css | L484 | `.services-offerings .related-card--horizontal .related-card__description` |
| styles/pages/services.css | L590 | `.services-offerings .related-card--horizontal .btn` |
| styles/pages/services.css | L611 | `.timeline-step__number` |
| styles/pages/services.css | L615 | `.timeline-step__title` |
| styles/pages/services.css | L625 | `.cta-section .cta-footer` |

---

## 3. Explicit font-family in Components (180)

These set font-family explicitly. If using semantic elements, this inherits from global.css.

`font-family: var(--font-heading)` is only needed if the element isn't h1-h6.


| File | Line | Selector | Token |
|------|------|----------|-------|
| components/Button/ButtonDropdown.astro | L127 | `.dropdown-item` | `--font-body` |
| components/Cards/InsightCard.astro | L143 | `.insight-card__title` | `--font-heading` |
| components/Cards/OfferingCard.astro | L124 | `.offering-card__title` | `--font-heading` |
| components/Cards/OfferingCard.astro | L132 | `.offering-card__description` | `--font-body` |
| components/Cards/OfferingCard.astro | L147 | `.offering-card__detail h4` | `--font-heading` |
| components/Cards/OfferingCard.astro | L163 | `.offering-card__detail ul li` | `--font-body` |
| components/Cards/StepCard.astro | L52 | `.step-card__number` | `--font-heading` |
| components/Cards/StepCard.astro | L63 | `.step-card__title` | `--font-heading` |
| components/Cards/StepCard.astro | L72 | `.step-card__text` | `--font-body` |
| components/Cards/WhyCard.astro | L69 | `.why-card__badge-text` | `--font-body` |
| components/Cards/WhyCard.astro | L79 | `.why-card__title` | `--font-heading` |
| components/Cards/WhyCard.astro | L88 | `.why-card__text` | `--font-body` |
| components/Checkout/DownloadSummary.astro | L170 | `.download-summary__item-name` | `--font-body` |
| components/ContactForm/Contact-Popup.astro | L311 | `.form__input` | `--font-body` |
| components/Footer/Footer.astro | L175 | `.footer__brand-name` | `--font-heading` |
| components/Footer/Footer.astro | L193 | `.footer__link` | `--font-body` |
| components/Presentation/AuthorCard.astro | L87 | `.author-card__label` | `--font-body` |
| components/Presentation/AuthorCard.astro | L97 | `.author-card__name` | `--font-heading` |
| components/Presentation/AuthorCard.astro | L107 | `.author-card__role` | `--font-body` |
| components/Presentation/AuthorCard.astro | L115 | `.author-card__bio` | `--font-body` |
| components/Presentation/Sections/CalloutSection.astro | L87 | `.callout__title` | `--font-heading` |
| components/Presentation/Sections/CalloutSection.astro | L95 | `.callout__content` | `--font-body` |
| components/Presentation/Sections/CompareSection.astro | L67 | `.compare__label` | `--font-body` |
| components/Presentation/Sections/CompareSection.astro | L85 | `.compare__title` | `--font-heading` |
| components/Presentation/Sections/CompareSection.astro | L93 | `.compare__content` | `--font-body` |
| components/Presentation/Sections/EndSection.astro | L204 | `.resource-card__type` | `--font-body` |
| components/Presentation/Sections/EndSection.astro | L213 | `.resource-card__title` | `--font-heading` |
| components/Presentation/Sections/EndSection.astro | L221 | `.resource-card__description` | `--font-body` |
| components/Presentation/Sections/EndSection.astro | L232 | `.resource-card__link` | `--font-body` |
| components/Presentation/Sections/EndSection.astro | L302 | `.recommended-card__badge` | `--font-body` |
| components/Presentation/Sections/EndSection.astro | L326 | `.recommended-card__category` | `--font-body` |
| components/Presentation/Sections/EndSection.astro | L335 | `.recommended-card__title` | `--font-heading` |
| components/Presentation/Sections/EndSection.astro | L347 | `.recommended-card__link` | `--font-body` |
| components/Presentation/Sections/FullWidthSection.astro | L82 | `.fullwidth__title` | `--font-heading` |
| components/Presentation/Sections/FullWidthSection.astro | L91 | `.fullwidth__body` | `--font-body` |
| components/Presentation/Sections/HeroSection.astro | L108 | `.hero__title` | `--font-heading` |
| components/Presentation/Sections/ImageTextSection.astro | L81 | `.image-text__title` | `--font-heading` |
| components/Presentation/Sections/ImageTextSection.astro | L90 | `.image-text__body` | `--font-body` |
| components/Presentation/Sections/QuoteSection.astro | L38 | `.quote__text` | `--font-heading` |
| components/Presentation/Sections/QuoteSection.astro | L55 | `.quote__text::before` | `--font-heading` |
| components/Presentation/Sections/QuoteSection.astro | L68 | `.quote__author` | `--font-body` |
| components/Presentation/Sections/QuoteSection.astro | L75 | `.quote__role` | `--font-body` |
| components/Presentation/Sections/StatsSection.astro | L71 | `.stats__value` | `--font-heading` |
| components/Presentation/Sections/StatsSection.astro | L86 | `.stats__label` | `--font-body` |
| components/Presentation/Sections/TextSection.astro | L57 | `.text-section__title` | `--font-heading` |
| components/Presentation/Sections/TextSection.astro | L66 | `.text-section__body` | `--font-body` |
| components/Presentation/Sections/TitleSection.astro | L178 | `.title-section__category` | `--font-body` |
| components/Presentation/Sections/TitleSection.astro | L187 | `.title-section__date` | `--font-body` |
| components/Presentation/Sections/TitleSection.astro | L196 | `.title-section__reading-time` | `--font-body` |
| components/Presentation/Sections/TitleSection.astro | L210 | `.title-section__title` | `--font-heading` |
| components/Presentation/Sections/TitleSection.astro | L221 | `.title-section__description` | `--font-body` |
| components/Presentation/Sections/TitleSection.astro | L242 | `.title-section__btn` | `--font-body` |
| components/Search/SearchOverlay.astro | L166 | `.search-title` | `--font-heading` |
| components/Search/SearchOverlay.astro | L174 | `.search-subtitle` | `--font-body` |
| components/Search/SearchOverlay.astro | L199 | `.search-input` | `--font-body` |
| components/Search/SearchOverlay.astro | L248 | `.results-title` | `--font-heading` |
| components/Search/SearchOverlay.astro | L272 | `.quick-link` | `--font-body` |
| components/Search/SearchOverlay.astro | L339 | `.result-title` | `--font-heading` |
| components/Search/SearchOverlay.astro | L347 | `.result-description` | `--font-body` |
| components/Search/SearchOverlay.astro | L357 | `.result-category` | `--font-body` |
| components/Search/SearchOverlay.astro | L377 | `.no-results p` | `--font-heading` |
| components/Search/SearchOverlay.astro | L390 | `.keyboard-hint` | `--font-body` |
| components/Search/SearchOverlay.astro | L398 | `.keyboard-hint kbd` | `--font-body` |
| components/Sections/ShareSection.astro | L163 | `.share-btn::after` | `--font-heading` |
| components/Shop/MiniCart.astro | L68 | `.mini-cart__title` | `--font-heading` |
| components/Shop/MiniCart.astro | L141 | `.mini-cart__item-name` | `--font-body` |
| components/Shop/MiniCart.astro | L189 | `.mini-cart__row` | `--font-body` |
| components/Shop/MiniCart.astro | L215 | `.mini-cart__checkout` | `--font-body` |
| components/Shop/MiniCart.astro | L242 | `.mini-cart__empty p` | `--font-body` |
| components/Switcher/BaseSwitcher.astro | L176 | `.switcher-btn` | `--font-body` |
| components/Typography/SectionTitle.astro | L175 | `.section-title__text` | `--font-heading` |
| components/Typography/SectionTitle.astro | L188 | `.section-title__subtitle` | `--font-body` |
| pages/search.astro | L219 | `.search-hero__title` | `--font-heading` |
| pages/search.astro | L232 | `.search-hero__subtitle` | `--font-body` |
| pages/search.astro | L262 | `.search-input` | `--font-body` |
| pages/search.astro | L357 | `.quick-link-card__title` | `--font-heading` |
| pages/search.astro | L365 | `.quick-link-card__desc` | `--font-body` |
| pages/search.astro | L397 | `.search-results__title` | `--font-heading` |
| pages/search.astro | L409 | `.search-results__query` | `--font-heading` |
| pages/search.astro | L462 | `.no-results__title` | `--font-heading` |
| pages/search.astro | L470 | `.no-results__text` | `--font-body` |
| pages/services/[slug].astro | L234 | `.service-section__title` | `--font-heading` |
| pages/services/[slug].astro | L265 | `.details-card__title` | `--font-heading` |
| pages/services/[slug].astro | L361 | `.process-step__title` | `--font-heading` |
| pages/services/[slug].astro | L369 | `.process-step__text` | `--font-body` |
| pages/verify.astro | L215 | `.verify-title` | `--font-heading` |
| styles/a11y/visual/text-only.css | L1076 | `#a11y-content-wrapper.a11y-text-only .tab-panel[data-panel]:` | `--font-heading` |
| styles/a11y/visual/text-only.css | L1441 | `#a11y-content-wrapper.a11y-text-only .for-you-grid::before` | `--font-heading` |
| styles/a11y/visual/text-only.css | L1496 | `#a11y-content-wrapper.a11y-text-only h3.for-you-card__title` | `--font-body` |
| styles/a11y/visual/text-only.css | L1752 | `#a11y-content-wrapper.a11y-text-only .end-section__resources` | `--font-heading` |
| styles/a11y/visual/text-only.css | L1774 | `#a11y-content-wrapper.a11y-text-only .end-section__recommend` | `--font-heading` |
| styles/buttons/basic-button.css | L15 | `.btn` | `--font-body` |
| styles/components/a11y-panel.css | L48 | `.a11y-panel` | `--font-body` |
| styles/components/a11y-panel.css | L113 | `.a11y-panel *:not(.a11y-font-card__label)` | `--font-body` |
| styles/components/cart-icon.css | L118 | `.cart-icon__count` | `--font-body` |
| styles/components/cta-section.css | L66 | `.cta-section__trust-text span` | `--font-body` |
| styles/components/editorial-layout.css | L87 | `.editorial__section-title` | `--font-heading` |
| styles/components/hero-morph.css | L52 | `.hero-morph__subtitle` | `--font-body` |
| styles/components/masonry-card.css | L29 | `.card__heading` | `--font-heading` |
| styles/components/masonry-card.css | L40 | `.card__title` | `--font-heading` |
| styles/components/masonry-card.css | L55 | `.card__label` | `--font-heading` |
| styles/components/masonry-card.css | L73 | `.card__text` | `--font-heading` |
| styles/components/masonry-card.css | L88 | `.card__value` | `--font-heading` |
| styles/components/masonry-card.css | L104 | `.card__quote` | `--font-heading` |
| styles/components/masonry-card.css | L114 | `.card__author` | `--font-heading` |
| styles/components/masonry-card.css | L157 | `.card__badge` | `--font-heading` |
| styles/components/masonry-card.css | L173 | `.card__button` | `--font-heading` |
| styles/components/nav/GlassNav-base.css | L72 | `.nav-links a` | `--font-heading` |
| styles/components/nav/GlassNav-base.css | L97 | `.nav-item-expandable` | `--font-heading` |
| styles/components/nav/GlassNav-expandable.css | L81 | `.expandable-item h3` | `--font-heading` |
| styles/components/nav/GlassNav-expandable.css | L100 | `.expandable-item p` | `--font-body` |
| styles/components/nav/GlassNav-mobile.css | L193 | `.mobile-menu-list > li > a` | `--font-heading` |
| styles/components/nav/GlassNav-mobile.css | L206 | `.mobile-menu-list a` | `--font-heading` |
| styles/components/philosophy-flip-cards.css | L97 | `.philosophy-flip__card-title-overlay h3` | `--font-heading` |
| styles/components/philosophy-flip-cards.css | L122 | `.philosophy-flip__card-back-content h3` | `--font-heading` |
| styles/components/presentation/ReaderNav.css | L143 | `.info-tooltip` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L193 | `.info-tooltip kbd` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L246 | `.progress-section-number` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L270 | `.autoplay-btn` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L324 | `.current-section-title` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L365 | `.nav-arrow` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L395 | `.speed-label` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L524 | `.section-number` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L551 | `.section-name` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L1381 | `.reader-resume-toast` | `--font-body` |
| styles/components/presentation/ReaderNav.css | L1417 | `.reader-resume-toast__btn` | `--font-body` |
| styles/components/presentation/sections.css | L16 | `.pres-quote__text` | `--font-heading` |
| styles/components/presentation/sections.css | L33 | `.pres-quote__text::before` | `--font-heading` |
| styles/components/presentation/sections.css | L46 | `.pres-quote__author` | `--font-body` |
| styles/components/presentation/sections.css | L53 | `.pres-quote__role` | `--font-body` |
| styles/components/presentation/sections.css | L109 | `.pres-stats__value` | `--font-heading` |
| styles/components/presentation/sections.css | L124 | `.pres-stats__label` | `--font-body` |
| styles/components/presentation/sections.css | L230 | `.pres-callout__title` | `--font-heading` |
| styles/components/presentation/sections.css | L238 | `.pres-callout__content` | `--font-body` |
| styles/components/presentation/sections.css | L282 | `.pres-compare__label` | `--font-body` |
| styles/components/presentation/sections.css | L300 | `.pres-compare__title` | `--font-heading` |
| styles/components/presentation/sections.css | L308 | `.pres-compare__content` | `--font-body` |
| styles/components/search-results.css | L44 | `.result-card__title` | `--font-heading` |
| styles/components/search-results.css | L52 | `.result-card__desc` | `--font-body` |
| styles/components/toast.css | L40 | `.toast` | `--font-body` |
| styles/components/values-section.css | L36 | `.values-section__number` | `--font-heading` |
| styles/pages/asset-detail.css | L173 | `.product-category` | `--font-body` |
| styles/pages/asset-detail.css | L182 | `.product-title` | `--font-heading` |
| styles/pages/asset-detail.css | L253 | `.product-description` | `--font-body` |
| styles/pages/asset-detail.css | L440 | `.tab-panel h2` | `--font-heading` |
| styles/pages/asset-detail.css | L449 | `.tab-panel h3` | `--font-heading` |
| styles/pages/asset-detail.css | L466 | `.tab-panel div` | `--font-body` |
| styles/pages/asset-detail.css | L871 | `.section-title` | `--font-heading` |
| styles/pages/asset-detail.css | L911 | `.compact-category` | `--font-body` |
| styles/pages/asset-detail.css | L932 | `.compact-title` | `--font-heading` |
| styles/pages/asset-detail.css | L941 | `.compact-description` | `--font-body` |
| styles/pages/cart.css | L14 | `.cart-page__title` | `--font-heading` |
| styles/pages/cart.css | L42 | `.empty-state h2` | `--font-heading` |
| styles/pages/cart.css | L50 | `.empty-state p` | `--font-body` |
| styles/pages/cart.css | L93 | `.cart-item-name` | `--font-body` |
| styles/pages/cart.css | L104 | `.cart-item-price` | `--font-body` |
| styles/pages/cart.css | L195 | `.summary-row` | `--font-body` |
| styles/pages/checkout.css | L28 | `.checkout-title` | `--font-heading` |
| styles/pages/checkout.css | L37 | `.checkout-subtitle` | `--font-body` |
| styles/pages/checkout.css | L122 | `.checkout-card__title` | `--font-heading` |
| styles/pages/checkout.css | L183 | `.checkbox-label` | `--font-body` |
| styles/pages/checkout.css | L359 | `.order-summary-title` | `--font-heading` |
| styles/pages/service-detail.css | L20 | `.service-hero__title` | `--font-heading` |
| styles/pages/service-detail.css | L29 | `.service-hero__tagline` | `--font-body` |
| styles/pages/service-detail.css | L37 | `.service-hero__description` | `--font-body` |
| styles/pages/service-detail.css | L53 | `.service-hero__pricing` | `--font-body` |
| styles/pages/service-detail.css | L72 | `.service-section__title` | `--font-heading` |
| styles/pages/service-detail.css | L113 | `.benefit-item__text` | `--font-body` |
| styles/pages/service-detail.css | L139 | `.details-card__title` | `--font-heading` |
| styles/pages/service-detail.css | L235 | `.process-step__title` | `--font-heading` |
| styles/pages/service-detail.css | L243 | `.process-step__text` | `--font-body` |
| styles/pages/service-detail.css | L263 | `.service-cta__title` | `--font-heading` |
| styles/pages/service-detail.css | L271 | `.service-cta__text` | `--font-body` |
| styles/pages/service-detail.css | L323 | `.related-service-card__title` | `--font-heading` |
| styles/pages/service-detail.css | L331 | `.related-service-card__tagline` | `--font-body` |
| styles/pages/service-detail.css | L338 | `.related-service-card__link` | `--font-body` |
| styles/pages/services.css | L15 | `.section-title` | `--font-heading` |
| styles/pages/services.css | L241 | `.timeline-step__title` | `--font-heading` |
| styles/pages/services.css | L249 | `.timeline-step__text` | `--font-body` |
| styles/pages/services.css | L300 | `.cta-section .cta-footer` | `--font-body` |

---

## 4. Explicit font-weight in Components (232)

Components setting font-weight. If using semantic headings, only needed for overrides.


### `--font-bold` (92 usages)

| File | Line | Selector |
|------|------|----------|
| components/Button/ButtonDropdown.astro | L189 | `.dropdown-item.is-selected::before` |
| components/Cards/CompactToolCard.astro | L85 | `.compact-title` |
| components/Cards/InsightCard.astro | L140 | `.insight-card__title` |
| components/Cards/OfferingCard.astro | L126 | `.offering-card__title` |
| components/Cards/OfferingCard.astro | L149 | `.offering-card__detail h4` |
| components/Cards/ProductCard.astro | L189 | `.product-card__name` |
| components/Cards/ProductCard.astro | L231 | `.add-to-cart-icon` |
| components/Cards/StepCard.astro | L54 | `.step-card__number` |
| components/Cards/StepCard.astro | L65 | `.step-card__title` |
| components/Cards/WhyCard.astro | L81 | `.why-card__title` |
| components/Checkout/DownloadSummary.astro | L187 | `.download-summary__badge` |
| components/Footer/Footer.astro | L177 | `.footer__brand-name` |
| components/Grids/RelatedGrid.astro | L502 | `.related-card--featured .related-card__title` |
| components/Presentation/AuthorCard.astro | L99 | `.author-card__name` |
| components/Presentation/Sections/CompareSection.astro | L87 | `.compare__title` |
| components/Presentation/Sections/EndSection.astro | L304 | `.recommended-card__badge` |
| components/Presentation/Sections/FullWidthSection.astro | L84 | `.fullwidth__title` |
| components/Presentation/Sections/ImageTextSection.astro | L83 | `.image-text__title` |
| components/Presentation/Sections/StatsSection.astro | L73 | `.stats__value` |
| components/Presentation/Sections/TextSection.astro | L59 | `.text-section__title` |
| components/Product/ProductInfo.astro | L166 | `.product-title` |
| components/Search/SearchOverlay.astro | L168 | `.search-title` |
| components/Search/SearchOverlay.astro | L250 | `.results-title` |
| components/Shop/MiniCart.astro | L67 | `.mini-cart__title` |
| components/Shop/MiniCart.astro | L195 | `.mini-cart__row--total` |
| components/Shop/MiniCart.astro | L214 | `.mini-cart__checkout` |
| components/Typography/SectionTitle.astro | L198 | `.section-title--weight-bold .section-title__text` |
| pages/search.astro | L221 | `.search-hero__title` |
| pages/search.astro | L399 | `.search-results__title` |
| pages/search.astro | L411 | `.search-results__query` |
| pages/search.astro | L464 | `.no-results__title` |
| pages/services/[slug].astro | L236 | `.service-section__title` |
| pages/services/[slug].astro | L267 | `.details-card__title` |
| pages/services/[slug].astro | L336 | `.process-step__number` |
| pages/verify.astro | L217 | `.verify-title` |
| styles/a11y/base/screen-reader.css | L38 | `#a11y-content-wrapper.a11y-screen-reader-mode::after` |
| styles/a11y/visual/text-only.css | L1075 | `#a11y-content-wrapper.a11y-text-only .tab-panel[data-panel]::before` |
| styles/a11y/visual/text-only.css | L1440 | `#a11y-content-wrapper.a11y-text-only .for-you-grid::before` |
| styles/a11y/visual/text-only.css | L1751 | `#a11y-content-wrapper.a11y-text-only .end-section__resources::before` |
| styles/a11y/visual/text-only.css | L1773 | `#a11y-content-wrapper.a11y-text-only .end-section__recommended::before` |
| styles/a11y/visual/text-only.css | L2102 | `#a11y-content-wrapper.a11y-text-only .search-results__query` |
| styles/a11y/visual/text-only.css | L2111 | `#a11y-content-wrapper.a11y-text-only .search-results__header .search-results__qu` |
| styles/components/cart-icon.css | L117 | `.cart-icon__count` |
| styles/components/cart-icon.css | L203 | `#a11y-content-wrapper[class*="a11y-"] .cart-icon__count` |
| styles/components/cta-section.css | L59 | `.cta-section__trust-text strong` |
| styles/components/masonry-card.css | L31 | `.card__heading` |
| styles/components/masonry-card.css | L42 | `.card__title` |
| styles/components/masonry-card.css | L57 | `.card__label` |
| styles/components/masonry-card.css | L90 | `.card__value` |
| styles/components/masonry-card.css | L159 | `.card__badge` |
| styles/components/masonry-card.css | L175 | `.card__button` |
| styles/components/nav/GlassNav-base.css | L85 | `.nav-links a:hover` |
| styles/components/nav/GlassNav-base.css | L114 | `.nav-item-expandable:hover` |
| styles/components/nav/GlassNav-expandable.css | L83 | `.expandable-item h3` |
| styles/components/nav/GlassNav-mobile.css | L219 | `.mobile-menu-list a:hover` |
| styles/components/philosophy-flip-cards.css | L95 | `.philosophy-flip__card-title-overlay h3` |
| styles/components/philosophy-flip-cards.css | L120 | `.philosophy-flip__card-back-content h3` |
| styles/components/presentation/ReaderNav.css | L248 | `.progress-section-number` |
| styles/components/presentation/ReaderNav.css | L526 | `.section-number` |
| styles/components/presentation/sections.css | L111 | `.pres-stats__value` |
| styles/components/presentation/sections.css | L302 | `.pres-compare__title` |
| styles/components/product-gallery.css | L66 | `.product-badge` |
| styles/pages/asset-detail.css | L183 | `.product-title` |
| styles/pages/asset-detail.css | L247 | `.price-current` |
| styles/pages/asset-detail.css | L441 | `.tab-panel h2` |
| styles/pages/asset-detail.css | L450 | `.tab-panel h3` |
| styles/pages/asset-detail.css | L872 | `.section-title` |
| styles/pages/asset-detail.css | L920 | `.compact-arrow` |
| styles/pages/asset-detail.css | L933 | `.compact-title` |
| styles/pages/assets.css | L64 | `.products-count #product-count` |
| styles/pages/assets.css | L110 | `.cta-title` |
| styles/pages/cart.css | L16 | `.cart-page__title` |
| styles/pages/cart.css | L205 | `.summary-row.total` |
| styles/pages/checkout.css | L30 | `.checkout-title` |
| styles/pages/checkout.css | L70 | `.step-number` |
| styles/pages/checkout.css | L117 | `.checkout-card__step` |
| styles/pages/checkout.css | L260 | `.placeholder-title` |
| styles/pages/checkout.css | L361 | `.order-summary-title` |
| styles/pages/checkout.css | L435 | `.free-badge` |
| styles/pages/checkout.css | L455 | `.free-notice-title` |
| styles/pages/checkout.css | L514 | `.total-row` |
| styles/pages/legal.css | L18 | `.legal-title` |
| styles/pages/legal.css | L36 | `.legal-prose h2` |
| styles/pages/legal.css | L44 | `.legal-prose h3` |
| styles/pages/service-detail.css | L22 | `.service-hero__title` |
| styles/pages/service-detail.css | L74 | `.service-section__title` |
| styles/pages/service-detail.css | L141 | `.details-card__title` |
| styles/pages/service-detail.css | L210 | `.process-step__number` |
| styles/pages/service-detail.css | L265 | `.service-cta__title` |
| styles/pages/services.css | L17 | `.section-title` |
| styles/pages/services.css | L70 | `.services-offerings .related-card--horizontal .related-card__title` |
| styles/pages/services.css | L216 | `.timeline-step__number` |

### `--font-semibold` (88 usages)

| File | Line | Selector |
|------|------|----------|
| components/Badge/Badge.astro | L158 | `.badge__label` |
| components/Button/ButtonDropdown.astro | L184 | `.dropdown-item.is-selected` |
| components/Cards/CompactToolCard.astro | L77 | `.compact-category` |
| components/Cards/ProductCard.astro | L182 | `.product-card__category` |
| components/Cards/ProjectCard.astro | L137 | `.project-card__category` |
| components/Cards/ProjectSpecCard.astro | L59 | `.project-spec-card__label` |
| components/Cards/SpecCard.astro | L63 | `.spec-card__label` |
| components/Cards/WhyCard.astro | L71 | `.why-card__badge-text` |
| components/ContactForm/Contact-Popup.astro | L302 | `.form__label` |
| components/Grids/ForYouGrid.astro | L158 | `.for-you-card__badge` |
| components/Grids/ForYouGrid.astro | L169 | `.for-you-card__title` |
| components/Grids/RelatedGrid.astro | L375 | `.related-card--horizontal .related-card__badge` |
| components/Grids/RelatedGrid.astro | L388 | `.related-card--horizontal .related-card__title` |
| components/Presentation/AuthorCard.astro | L89 | `.author-card__label` |
| components/Presentation/AuthorCard.astro | L109 | `.author-card__role` |
| components/Presentation/Sections/CalloutSection.astro | L89 | `.callout__title` |
| components/Presentation/Sections/CompareSection.astro | L69 | `.compare__label` |
| components/Presentation/Sections/EndSection.astro | L206 | `.resource-card__type` |
| components/Presentation/Sections/EndSection.astro | L215 | `.resource-card__title` |
| components/Presentation/Sections/EndSection.astro | L234 | `.resource-card__link` |
| components/Presentation/Sections/EndSection.astro | L328 | `.recommended-card__category` |
| components/Presentation/Sections/EndSection.astro | L337 | `.recommended-card__title` |
| components/Presentation/Sections/EndSection.astro | L349 | `.recommended-card__link` |
| components/Presentation/Sections/HeroSection.astro | L97 | `.hero__category` |
| components/Presentation/Sections/QuoteSection.astro | L70 | `.quote__author` |
| components/Presentation/Sections/TitleSection.astro | L180 | `.title-section__category` |
| components/Presentation/Sections/TitleSection.astro | L244 | `.title-section__btn` |
| components/Product/ProductInfo.astro | L134 | `.info-badge` |
| components/Search/SearchOverlay.astro | L341 | `.result-title` |
| components/Search/SearchOverlay.astro | L379 | `.no-results p` |
| components/Shop/MiniCart.astro | L140 | `.mini-cart__item-name` |
| components/Switcher/BaseSwitcher.astro | L174 | `.switcher-btn` |
| components/Typography/SectionTitle.astro | L197 | `.section-title--weight-semibold .section-title__text` |
| components/Typography/SectionTitle.astro | L361 | `.section-title--variant-badge .section-title__text` |
| pages/search.astro | L359 | `.quick-link-card__title` |
| pages/services/[slug].astro | L363 | `.process-step__title` |
| pages/services/[slug].astro | L747 | `#a11y-content-wrapper.a11y-text-only .related-card--vertical .related-card__butt` |
| pages/showcase/section-titles.astro | L404 | `.showcase__label` |
| styles/a11y/motion/reduced-motion.css | L37 | `#a11y-content-wrapper.a11y-reduce-motion .nav-item-expandable:hover` |
| styles/a11y/motion/reduced-motion.css | L160 | `.nav-item-expandable:hover` |
| styles/a11y/visual/text-only.css | L935 | `#a11y-content-wrapper.a11y-text-only .project-spec-card__label` |
| styles/a11y/visual/text-only.css | L1003 | `#a11y-content-wrapper.a11y-text-only .share-btn` |
| styles/a11y/visual/text-only.css | L1277 | `#a11y-content-wrapper.a11y-text-only .spec-card__label` |
| styles/a11y/visual/text-only.css | L1495 | `#a11y-content-wrapper.a11y-text-only h3.for-you-card__title` |
| styles/buttons/basic-button.css | L17 | `.btn` |
| styles/components/cookie-banner.css | L112 | `.cookie-option-title` |
| styles/components/editorial-layout.css | L89 | `.editorial__section-title` |
| styles/components/editorial-layout.css | L238 | `.editorial-about__audience strong` |
| styles/components/masonry-card.css | L66 | `.card__label--small` |
| styles/components/masonry-card.css | L83 | `.card__text--emphasis` |
| styles/components/masonry-card.css | L116 | `.card__author` |
| styles/components/masonry-card.css | L355 | `.card-offset__title` |
| styles/components/nav/GlassNav-base.css | L74 | `.nav-links a` |
| styles/components/nav/GlassNav-base.css | L99 | `.nav-item-expandable` |
| styles/components/nav/GlassNav-mobile.css | L195 | `.mobile-menu-list > li > a` |
| styles/components/nav/GlassNav-mobile.css | L208 | `.mobile-menu-list a` |
| styles/components/presentation/ReaderNav.css | L163 | `.info-tooltip__title` |
| styles/components/presentation/ReaderNav.css | L182 | `.info-tooltip__item strong` |
| styles/components/presentation/ReaderNav.css | L195 | `.info-tooltip kbd` |
| styles/components/presentation/ReaderNav.css | L272 | `.autoplay-btn` |
| styles/components/presentation/ReaderNav.css | L326 | `.current-section-title` |
| styles/components/presentation/ReaderNav.css | L367 | `.nav-arrow` |
| styles/components/presentation/ReaderNav.css | L397 | `.speed-label` |
| styles/components/presentation/ReaderNav.css | L1405 | `.reader-resume-toast__section` |
| styles/components/presentation/ReaderNav.css | L1419 | `.reader-resume-toast__btn` |
| styles/components/presentation/sections.css | L48 | `.pres-quote__author` |
| styles/components/presentation/sections.css | L232 | `.pres-callout__title` |
| styles/components/presentation/sections.css | L284 | `.pres-compare__label` |
| styles/components/search-results.css | L46 | `.result-card__title` |
| styles/pages/asset-detail.css | L175 | `.product-category` |
| styles/pages/asset-detail.css | L226 | `.info-item-inline span` |
| styles/pages/asset-detail.css | L501 | `.tab-panel b` |
| styles/pages/asset-detail.css | L531 | `.spec-value` |
| styles/pages/asset-detail.css | L725 | `.spec-card__label` |
| styles/pages/asset-detail.css | L912 | `.compact-category` |
| styles/pages/cart.css | L44 | `.empty-state h2` |
| styles/pages/cart.css | L95 | `.cart-item-name` |
| styles/pages/cart.css | L107 | `.cart-item-price` |
| styles/pages/cart.css | L220 | `.btn-block` |
| styles/pages/checkout.css | L124 | `.checkout-card__title` |
| styles/pages/checkout.css | L142 | `.form-section-title` |
| styles/pages/checkout.css | L413 | `.order-item-name` |
| styles/pages/checkout.css | L509 | `.discount-amount` |
| styles/pages/legal.css | L103 | `.cookie-table th` |
| styles/pages/service-detail.css | L237 | `.process-step__title` |
| styles/pages/service-detail.css | L325 | `.related-service-card__title` |
| styles/pages/services.css | L60 | `.services-offerings .related-card--horizontal .related-card__badge` |
| styles/pages/services.css | L243 | `.timeline-step__title` |

### `--font-medium` (28 usages)

| File | Line | Selector |
|------|------|----------|
| components/Button/ButtonDropdown.astro | L129 | `.dropdown-item` |
| components/Cards/ProjectSpecCard.astro | L67 | `.project-spec-card__value` |
| components/Cards/SpecCard.astro | L71 | `.spec-card__value` |
| components/Checkout/DownloadSummary.astro | L172 | `.download-summary__item-name` |
| components/Navigation/Breadcrumbs.astro | L59 | `.breadcrumbs .current` |
| components/Presentation/Sections/QuoteSection.astro | L40 | `.quote__text` |
| components/Presentation/Sections/StatsSection.astro | L82 | `.stats__suffix` |
| components/Search/SearchOverlay.astro | L274 | `.quick-link` |
| components/Sections/IntroTextSection.astro | L33 | `.intro-text__lead` |
| components/Sections/IntroTextSection.astro | L41 | `.intro-text__subtitle` |
| components/Sections/ShareSection.astro | L165 | `.share-btn::after` |
| components/Sections/StorySection.astro | L52 | `.story__text p` |
| components/Typography/SectionTitle.astro | L196 | `.section-title--weight-medium .section-title__text` |
| components/Typography/SectionTitle.astro | L390 | `.section-title--variant-minimal .section-title__text` |
| styles/components/announcement-ticker.css | L81 | `.announcement-ticker__item` |
| styles/components/cookie-banner.css | L119 | `.cookie-required` |
| styles/components/editorial-layout.css | L140 | `.editorial-skill` |
| styles/components/philosophy-flip-cards.css | L22 | `.philosophy-flip__intro-line` |
| styles/components/philosophy-flip-cards.css | L129 | `.philosophy-flip__card-back-content p` |
| styles/components/presentation/ReaderNav.css | L553 | `.section-name` |
| styles/components/presentation/sections.css | L18 | `.pres-quote__text` |
| styles/components/presentation/sections.css | L120 | `.pres-stats__suffix` |
| styles/pages/asset-detail.css | L525 | `.spec-label` |
| styles/pages/asset-detail.css | L733 | `.spec-card__value` |
| styles/pages/asset-detail.css | L741 | `.spec-card__text` |
| styles/pages/checkout.css | L173 | `.checkout-form .form-label` |
| styles/pages/service-detail.css | L31 | `.service-hero__tagline` |
| styles/pages/service-detail.css | L340 | `.related-service-card__link` |

### `--font-weight-bold` (9 usages)

| File | Line | Selector |
|------|------|----------|
| components/A11y Panel/FontCard.astro | L72 | `.a11y-font-card__label` |
| components/A11y Panel/NavigationSection.astro | L54 | `.a11y-section__title` |
| components/A11y Panel/PresetButton.astro | L85 | `.a11y-preset-btn__title` |
| components/A11y Panel/PresetsSidebar.astro | L63 | `.a11y-sidebar__title` |
| components/A11y Panel/ThemeSidebar.astro | L27 | `.a11y-sidebar__title` |
| components/A11y Panel/ToggleCard.astro | L114 | `.a11y-toggle-card__label` |
| components/A11y Panel/TypographyAdjustmentsSection.astro | L74 | `.a11y-section__title` |
| components/A11y Panel/TypographySection.astro | L51 | `.a11y-section__title` |
| components/A11y Panel/VisualSection.astro | L70 | `.a11y-section__title` |

### `--font-extrabold` (5 usages)

| File | Line | Selector |
|------|------|----------|
| components/Footer/Footer.astro | L195 | `.footer__link` |
| components/Presentation/Sections/HeroSection.astro | L110 | `.hero__title` |
| components/Presentation/Sections/TitleSection.astro | L212 | `.title-section__title` |
| styles/components/a11y-panel.css | L313 | `.a11y-panel__title` |
| styles/components/values-section.css | L32 | `.values-section__number` |

### `--font-normal` (4 usages)

| File | Line | Selector |
|------|------|----------|
| components/Presentation/Sections/FullWidthSection.astro | L93 | `.fullwidth__body` |
| components/Presentation/Sections/ImageTextSection.astro | L92 | `.image-text__body` |
| components/Presentation/Sections/TextSection.astro | L68 | `.text-section__body` |
| components/Typography/SectionTitle.astro | L195 | `.section-title--weight-normal .section-title__text` |

### `--font-weight-medium` (3 usages)

| File | Line | Selector |
|------|------|----------|
| components/A11y Panel/Slider.astro | L88 | `.a11y-setting__label` |
| components/A11y Panel/Slider.astro | L95 | `.a11y-setting__value` |
| components/A11y Panel/Toggle.astro | L59 | `.a11y-setting__label` |

### `--font-weight-semibold` (1 usages)

| File | Line | Selector |
|------|------|----------|
| components/A11y Panel/Stepper.astro | L109 | `.a11y-stepper__value` |

### `--font-light` (1 usages)

| File | Line | Selector |
|------|------|----------|
| styles/components/nav/GlassNav-mobile.css | L245 | `.submenu-toggle` |

### `--font-regular` (1 usages)

| File | Line | Selector |
|------|------|----------|
| styles/components/nav/GlassNav-mobile.css | L291 | `.submenu li a` |

---

## 5. Files with Most Raw Size Tokens (Top 30)

| File | Raw font-size calls | Tokens used |
|------|--------------------:|-------------|
| styles/pages/checkout.css | 66 | `--text-3xl`, `--text-4xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| pages/search.astro | 64 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/pages/service-detail.css | 61 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/pages/asset-detail.css | 32 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/pages/cart.css | 32 | `--text-2xl`, `--text-4xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/pages/services.css | 29 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/a11y/visual/text-only.css | 26 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| pages/services/[slug].astro | 25 | `--text-2xl`, `--text-3xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Presentation/AuthorCard.astro | 21 | `--text-2xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/ContactForm/Contact-Popup.astro | 19 | `--text-2xl`, `--text-2xs`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/components/presentation/sections.css | 19 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-6xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/components/philosophy-flip-cards.css | 17 | `--text-2xl`, `--text-3xl`, `--text-5xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Presentation/Sections/EndSection.astro | 16 | `--text-base`, `--text-lg`, `--text-sm`, `--text-xs` |
| components/Search/SearchOverlay.astro | 15 | `--text-2xl`, `--text-3xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/components/hero-morph.css | 15 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-6xl`, `--text-7xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/components/masonry-card.css | 15 | `--text-2xl`, `--text-3xl`, `--text-base`, `--text-lg`, `--text-sm` |
| components/Presentation/Sections/TitleSection.astro | 13 | `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-6xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Typography/SectionTitle.astro | 13 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-5xl`, `--text-base`, `--text-lg`, `--text-xl`, `--text-xs` |
| styles/components/hero-section.css | 13 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Cards/ProductCard.astro | 12 | `--text-base`, `--text-lg`, `--text-md`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Grids/RelatedGrid.astro | 11 | `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/components/cta-section.css | 11 | `--text-5xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Cards/InsightCard.astro | 10 | `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Footer/Footer.astro | 9 | `--text-2xl`, `--text-3xl`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Presentation/Sections/HeroSection.astro | 9 | `--text-2xl`, `--text-3xl`, `--text-5xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/components/pillars-section.css | 9 | `--text-5xl`, `--text-base`, `--text-sm`, `--text-xl`, `--text-xs` |
| styles/components/values-section.css | 9 | `--text-2xl`, `--text-4xl`, `--text-7xl`, `--text-base`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Cards/WhyCard.astro | 8 | `--text-base`, `--text-lg`, `--text-sm`, `--text-xs` |
| components/Presentation/Sections/FullWidthSection.astro | 8 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |
| components/Presentation/Sections/ImageTextSection.astro | 8 | `--text-2xl`, `--text-3xl`, `--text-4xl`, `--text-base`, `--text-lg`, `--text-sm`, `--text-xl`, `--text-xs` |

---

## 6. Token Usage Frequency (in components)

| Token | Component uses | Maps to | Action |
|-------|---------------:|---------|--------|
| `--text-2xs` | 5 | — | Keep / utility class |
| `--text-xs` | 181 | — | Keep / utility class |
| `--text-sm` | 192 | `<h6 / small>` | Use semantic element |
| `--text-base` | 114 | `<h5>` | Use semantic element |
| `--text-md` | 3 | — | Keep / utility class |
| `--text-lg` | 89 | `<h4 / p>` | Use semantic element |
| `--text-xl` | 67 | — | Keep / utility class |
| `--text-2xl` | 48 | — | Keep / utility class |
| `--text-3xl` | 42 | — | Keep / utility class |
| `--text-4xl` | 28 | `<h3>` | Use semantic element |
| `--text-5xl` | 14 | `<h2>` | Use semantic element |
| `--text-6xl` | 6 | — | Keep / utility class |
| `--text-7xl` | 2 | `<h1>` | Use semantic element |