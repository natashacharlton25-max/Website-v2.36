# Font-Size Inheritance Audit

## Summary

| Action | Count | Meaning |
|--------|------:|--------|
| ✅ REDUNDANT | 173 | Delete font-size — element inherits from global.css |
| ⚠️ MISMATCH | 181 | Element and token disagree — check which is right |
| 🔄 CHANGE HTML | 68 | Change div/span to h1-h6/p, then delete font-size |
| ✔️ KEEP | 405 | Non-heading content, font-size stays |
| 🔍 REVIEW | 0 | Ambiguous — manual decision needed |
| **Total** | **827** | |

---

## ✅ REDUNDANT — Delete font-size (element inherits)

These use a semantic HTML element that already gets the right size from global.css.
**Action:** Remove the `font-size` line from CSS.

| File | Line | Selector | Token | Element |
|------|------|----------|-------|---------|
| components/A11y Panel/NavigationSection.astro | L53 | `.a11y-section__title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/A11y Panel/TypographyAdjustmentsSection.astro | L73 | `.a11y-section__title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/A11y Panel/TypographySection.astro | L50 | `.a11y-section__title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/A11y Panel/VisualSection.astro | L69 | `.a11y-section__title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Cards/CompactToolCard.astro | L84 | `.compact-title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Cards/InsightCard.astro | L139 | `.insight-card__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Cards/InsightCard.astro | L148 | `.insight-card__excerpt` | `--text-body` | Already <p>, inherits from global.css |
| components/Cards/InsightCard.astro | L215 | `.insight-card__title` | `--text-h5` | Already <h2>, inherits from global.css |
| components/Cards/OfferingCard.astro | L125 | `.offering-card__title` | `--text-h4` | Already <h3>, inherits from global.css |
| components/Cards/OfferingCard.astro | L133 | `.offering-card__description` | `--text-body` | Already <p>, inherits from global.css |
| components/Cards/ProductCard.astro | L188 | `.product-card__name` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Cards/ProjectCard.astro | L251 | `.project-card__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Cards/StepCard.astro | L64 | `.step-card__title` | `--text-h4` | Already <h3>, inherits from global.css |
| components/Cards/StepCard.astro | L73 | `.step-card__text` | `--text-body` | Already <p>, inherits from global.css |
| components/Cards/WhyCard.astro | L80 | `.why-card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Cards/WhyCard.astro | L89 | `.why-card__text` | `--text-body` | Already <p>, inherits from global.css |
| components/Footer/Footer.astro | L176 | `.footer__brand-name` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Footer/Footer.astro | L243 | `.footer__brand-name` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Footer/Footer.astro | L288 | `.footer__brand-name` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Footer/Footer.astro | L309 | `.footer__brand-name` | `--text-h5` | Already <h2>, inherits from global.css |
| components/Grids/RelatedGrid.astro | L501 | `.related-card--featured .related-card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Grids/RelatedGrid.astro | L571 | `.related-card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Grids/RelatedGrid.astro | L691 | `.related-grid__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Grids/RelatedGrid.astro | L720 | `.related-grid__title` | `--text-h5` | Already <h2>, inherits from global.css |
| components/Insights/InsightHeader.astro | L120 | `.insight-header__title` | `--text-h3` | Already <h1>, inherits from global.css |
| components/Presentation/AuthorCard.astro | L98 | `.author-card__name` | `--text-h4` | Already <h3>, inherits from global.css |
| components/Presentation/AuthorCard.astro | L140 | `.author-card--compact .author-card__name` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Presentation/AuthorCard.astro | L165 | `.author-card--featured .author-card__name` | `--text-h4` | Already <h3>, inherits from global.css |
| components/Presentation/AuthorCard.astro | L169 | `.author-card--featured .author-card__bio` | `--text-body` | Already <p>, inherits from global.css |
| components/Presentation/AuthorCard.astro | L205 | `.author-card--featured .author-card__name` | `--text-h4` | Already <h3>, inherits from global.css |
| components/Presentation/AuthorCard.astro | L232 | `.author-card__name` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Presentation/AuthorCard.astro | L253 | `.author-card--featured .author-card__name` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Presentation/Sections/CalloutSection.astro | L88 | `.callout__title` | `--text-h5` | Already <h3>, inherits from global.css |
| components/Presentation/Sections/CompareSection.astro | L86 | `.compare__title` | `--text-h4` | Already <h3>, inherits from global.css |
| components/Presentation/Sections/EndSection.astro | L214 | `.resource-card__title` | `--text-h5` | Already <h4>, inherits from global.css |
| components/Presentation/Sections/EndSection.astro | L336 | `.recommended-card__title` | `--text-h5` | Already <h4>, inherits from global.css |
| components/Presentation/Sections/FullWidthSection.astro | L83 | `.fullwidth__title` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/FullWidthSection.astro | L114 | `.fullwidth__title` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/FullWidthSection.astro | L132 | `.fullwidth__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/FullWidthSection.astro | L151 | `.fullwidth__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/HeroSection.astro | L109 | `.hero__title` | `--text-h2` | Already <h1>, inherits from global.css |
| components/Presentation/Sections/HeroSection.astro | L132 | `.hero__title` | `--text-h3` | Already <h1>, inherits from global.css |
| components/Presentation/Sections/HeroSection.astro | L146 | `.hero__title` | `--text-h4` | Already <h1>, inherits from global.css |
| components/Presentation/Sections/HeroSection.astro | L150 | `.hero__description` | `--text-body` | Already <p>, inherits from global.css |
| components/Presentation/Sections/HeroSection.astro | L156 | `.hero__title` | `--text-h4` | Already <h1>, inherits from global.css |
| components/Presentation/Sections/ImageTextSection.astro | L82 | `.image-text__title` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/ImageTextSection.astro | L118 | `.image-text__title` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/ImageTextSection.astro | L132 | `.image-text__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/ImageTextSection.astro | L143 | `.image-text__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/TextSection.astro | L58 | `.text-section__title` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/TextSection.astro | L83 | `.text-section__title` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/TextSection.astro | L93 | `.text-section__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/TextSection.astro | L104 | `.text-section__title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Presentation/Sections/TitleSection.astro | L211 | `.title-section__title` | `--text-h1` | Already <h1>, inherits from global.css |
| components/Presentation/Sections/TitleSection.astro | L319 | `.title-section__title` | `--text-h2` | Already <h1>, inherits from global.css |
| components/Presentation/Sections/TitleSection.astro | L347 | `.title-section__title` | `--text-h3` | Already <h1>, inherits from global.css |
| components/Presentation/Sections/TitleSection.astro | L352 | `.title-section__description` | `--text-body` | Already <p>, inherits from global.css |
| components/Presentation/Sections/TitleSection.astro | L369 | `.title-section__title` | `--text-h3` | Already <h1>, inherits from global.css |
| components/Product/ProductInfo.astro | L165 | `.product-title` | `--text-h3` | Already <h1>, inherits from global.css |
| components/Product/ProductInfo.astro | L178 | `.product-description` | `--text-body` | Already <p>, inherits from global.css |
| components/Product/ProductInfo.astro | L214 | `.product-title` | `--text-h3` | Already <h1>, inherits from global.css |
| components/Search/SearchOverlay.astro | L167 | `.search-title` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Search/SearchOverlay.astro | L175 | `.search-subtitle` | `--text-body` | Already <p>, inherits from global.css |
| components/Search/SearchOverlay.astro | L420 | `.search-title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Search/SearchOverlay.astro | L444 | `.search-title` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Sections/IntroTextSection.astro | L64 | `.intro-text__subtitle` | `--text-body` | Already <p>, inherits from global.css |
| components/Typography/SectionTitle.astro | L189 | `.section-title__subtitle` | `--text-body` | Already <p>, inherits from global.css |
| components/Typography/SectionTitle.astro | L291 | `.section-title--sm .section-title__text` | `--text-h5` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L294 | `.section-title--md .section-title__text` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L296 | `.section-title--lg .section-title__text` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L298 | `.section-title--xl .section-title__text` | `--text-h2` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L440 | `.section-title--lg .section-title__text` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L441 | `.section-title--xl .section-title__text` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L445 | `.section-title--lg .section-title__text` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L446 | `.section-title--xl .section-title__text` | `--text-h3` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L474 | `.section-title--xl .section-title__text` | `--text-h4` | Already <h2>, inherits from global.css |
| components/Typography/SectionTitle.astro | L478 | `.section-title--md .section-title__text` | `--text-h5` | Already <h2>, inherits from global.css |
| pages/search.astro | L220 | `.search-hero__title` | `--text-h2` | Already <h1>, inherits from global.css |
| pages/search.astro | L358 | `.quick-link-card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| pages/search.astro | L398 | `.search-results__title` | `--text-h3` | Already <h2>, inherits from global.css |
| pages/search.astro | L463 | `.no-results__title` | `--text-h4` | Already <h3>, inherits from global.css |
| pages/search.astro | L471 | `.no-results__text` | `--text-body` | Already <p>, inherits from global.css |
| pages/search.astro | L491 | `.search-hero__title` | `--text-h3` | Already <h1>, inherits from global.css |
| pages/search.astro | L580 | `.search-hero__title` | `--text-h3` | Already <h1>, inherits from global.css |
| pages/search.astro | L584 | `.search-hero__subtitle` | `--text-body` | Already <p>, inherits from global.css |
| pages/search.astro | L626 | `.search-hero__title` | `--text-h4` | Already <h1>, inherits from global.css |
| pages/search.astro | L661 | `.search-results__title` | `--text-h4` | Already <h2>, inherits from global.css |
| pages/search.astro | L705 | `.search-hero__title` | `--text-h4` | Already <h1>, inherits from global.css |
| pages/search.astro | L759 | `.search-results__title` | `--text-h5` | Already <h2>, inherits from global.css |
| pages/search.astro | L805 | `.no-results__title` | `--text-h5` | Already <h3>, inherits from global.css |
| pages/search.astro | L821 | `.search-hero__title` | `--text-h5` | Already <h1>, inherits from global.css |
| pages/services/[slug].astro | L235 | `.service-section__title` | `--text-h3` | Already <h2>, inherits from global.css |
| pages/services/[slug].astro | L266 | `.details-card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| pages/services/[slug].astro | L362 | `.process-step__title` | `--text-h4` | Already <h3>, inherits from global.css |
| pages/services/[slug].astro | L370 | `.process-step__text` | `--text-body` | Already <p>, inherits from global.css |
| pages/services/[slug].astro | L401 | `.service-section__title` | `--text-h4` | Already <h2>, inherits from global.css |
| pages/services/[slug].astro | L443 | `.service-section__title` | `--text-h4` | Already <h2>, inherits from global.css |
| pages/services/[slug].astro | L514 | `.service-section__title` | `--text-h5` | Already <h2>, inherits from global.css |
| pages/verify.astro | L216 | `.verify-title` | `--text-h4` | Already <h1>, inherits from global.css |
| pages/verify.astro | L229 | `.verify-message` | `--text-body` | Already <p>, inherits from global.css |
| styles/a11y/visual/text-only.css | L638 | `#a11y-content-wrapper.a11y-text-only .footer__brand-name` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/a11y/visual/text-only.css | L887 | `#a11y-content-wrapper.a11y-text-only section:not(.hero-morph) h2:not(.footer__brand-name):not(.search-results__title)` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/a11y/visual/text-only.css | L1366 | `#a11y-content-wrapper.a11y-text-only section:not(.hero-morph) h2:not(.footer__brand-name):not(.search-results__title)` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/a11y/visual/text-only.css | L1373 | `#a11y-content-wrapper.a11y-text-only .hero-section__title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/a11y/visual/text-only.css | L1390 | `#a11y-content-wrapper.a11y-text-only section:not(.hero-morph) h2:not(.footer__brand-name):not(.search-results__title)` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/a11y/visual/text-only.css | L1398 | `#a11y-content-wrapper.a11y-text-only .hero-section__title` | `--text-h4` | Already <h1>, inherits from global.css |
| styles/a11y/visual/text-only.css | L1975 | `#a11y-content-wrapper.a11y-text-only .search-hero__title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/a11y/visual/text-only.css | L2092 | `#a11y-content-wrapper.a11y-text-only .search-results__title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/components/cta-section.css | L92 | `.cta-section__title` | `--text-h2` | Already <h2>, inherits from global.css |
| styles/components/cta-section.css | L112 | `.cta-section__title` | `--text-h5` | Already <h2>, inherits from global.css |
| styles/components/hero-morph.css | L96 | `.hero-morph__title` | `--text-h2` | Already <h1>, inherits from global.css |
| styles/components/hero-morph.css | L162 | `.hero-morph__title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/components/hero-morph.css | L208 | `.hero-morph__title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/components/hero-morph.css | L223 | `.hero-morph__subtitle` | `--text-body` | Already <p>, inherits from global.css |
| styles/components/hero-morph.css | L241 | `.hero-morph__title` | `--text-h4` | Already <h1>, inherits from global.css |
| styles/components/hero-morph.css | L267 | `.hero-morph__title` | `--text-h4` | Already <h1>, inherits from global.css |
| styles/components/hero-section.css | L38 | `.hero-section__extra` | `--text-body` | Already <p>, inherits from global.css |
| styles/components/hero-section.css | L242 | `.hero-section__title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/components/hero-section.css | L280 | `.hero-section__title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/components/hero-section.css | L286 | `.hero-section__description` | `--text-body` | Already <p>, inherits from global.css |
| styles/components/hero-section.css | L318 | `.hero-section__title` | `--text-h4` | Already <h1>, inherits from global.css |
| styles/components/hero-section.css | L345 | `.hero-section__title` | `--text-h4` | Already <h1>, inherits from global.css |
| styles/components/hero-section.css | L385 | `.hero-section__title` | `--text-h5` | Already <h1>, inherits from global.css |
| styles/components/image-text-section.css | L56 | `.image-text-section__title` | `--text-h2` | Already <h2>, inherits from global.css |
| styles/components/image-text-section.css | L93 | `.image-text-section__title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/components/image-text-section.css | L106 | `.image-text-section__title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/components/image-text-section.css | L132 | `.image-text-section__title` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/components/image-text-section.css | L153 | `.image-text-section__title` | `--text-h5` | Already <h2>, inherits from global.css |
| styles/components/masonry-card.css | L30 | `.card__heading` | `--text-h5` | Already <h1>, inherits from global.css |
| styles/components/masonry-card.css | L41 | `.card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| styles/components/masonry-card.css | L74 | `.card__text` | `--text-body` | Already <p>, inherits from global.css |
| styles/components/philosophy-flip-cards.css | L218 | `.philosophy-flip__title` | `--text-h2` | Already <h2>, inherits from global.css |
| styles/components/philosophy-flip-cards.css | L225 | `.philosophy-flip__title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/components/philosophy-flip-cards.css | L237 | `.philosophy-flip__title` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/components/philosophy-flip-cards.css | L279 | `.philosophy-flip__title` | `--text-h5` | Already <h2>, inherits from global.css |
| styles/components/search-results.css | L45 | `.result-card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| styles/components/values-section.css | L69 | `.values-section__item-title` | `--text-h4` | Already <h3>, inherits from global.css |
| styles/pages/about.css | L9 | `.image-text-section__title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/pages/asset-detail.css | L181 | `.product-title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/pages/asset-detail.css | L580 | `.content-section__body` | `--text-body` | Already <p>, inherits from global.css |
| styles/pages/asset-detail.css | L870 | `.section-title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/pages/asset-detail.css | L931 | `.compact-title` | `--text-h5` | Already <h3>, inherits from global.css |
| styles/pages/asset-detail.css | L965 | `.product-title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/pages/asset-detail.css | L987 | `.product-title` | `--text-h4` | Already <h1>, inherits from global.css |
| styles/pages/cart.css | L43 | `.empty-state h2` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/pages/cart.css | L51 | `.empty-state p` | `--text-body` | Already <p>, inherits from global.css |
| styles/pages/cart.css | L365 | `.empty-state h2` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/pages/cart.css | L454 | `.empty-state h2` | `--text-h5` | Already <h2>, inherits from global.css |
| styles/pages/checkout.css | L29 | `.checkout-title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/pages/checkout.css | L559 | `.checkout-title` | `--text-h3` | Already <h1>, inherits from global.css |
| styles/pages/checkout.css | L579 | `.checkout-title` | `--text-h4` | Already <h1>, inherits from global.css |
| styles/pages/checkout.css | L784 | `.checkout-title` | `--text-h5` | Already <h1>, inherits from global.css |
| styles/pages/legal.css | L17 | `.legal-title` | `--text-h2` | Already <h1>, inherits from global.css |
| styles/pages/legal.css | L24 | `.legal-meta` | `--text-body` | Already <p>, inherits from global.css |
| styles/pages/legal.css | L135 | `.legal-title` | `--text-h1` | Already <h1>, inherits from global.css |
| styles/pages/service-detail.css | L73 | `.service-section__title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/pages/service-detail.css | L140 | `.details-card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| styles/pages/service-detail.css | L236 | `.process-step__title` | `--text-h4` | Already <h3>, inherits from global.css |
| styles/pages/service-detail.css | L244 | `.process-step__text` | `--text-body` | Already <p>, inherits from global.css |
| styles/pages/service-detail.css | L393 | `.service-section__title` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/pages/service-detail.css | L464 | `.service-section__title` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/pages/service-detail.css | L577 | `.service-section__title` | `--text-h5` | Already <h2>, inherits from global.css |
| styles/pages/services.css | L16 | `.section-title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/pages/services.css | L69 | `.services-offerings .related-card--horizontal .related-card__title` | `--text-h3` | Already <h3>, inherits from global.css |
| styles/pages/services.css | L80 | `.services-offerings .related-card--horizontal .related-card__description` | `--text-body` | Already <p>, inherits from global.css |
| styles/pages/services.css | L242 | `.timeline-step__title` | `--text-h5` | Already <h3>, inherits from global.css |
| styles/pages/services.css | L301 | `.cta-section .cta-footer` | `--text-body` | Already <p>, inherits from global.css |
| styles/pages/services.css | L318 | `.section-title` | `--text-h3` | Already <h2>, inherits from global.css |
| styles/pages/services.css | L364 | `.services-offerings .related-card--horizontal .related-card__title` | `--text-h4` | Already <h3>, inherits from global.css |
| styles/pages/services.css | L381 | `.section-title` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/pages/services.css | L403 | `.services-offerings .related-card--horizontal .related-card__title` | `--text-h5` | Already <h3>, inherits from global.css |
| styles/pages/services.css | L453 | `.section-title` | `--text-h4` | Already <h2>, inherits from global.css |
| styles/pages/services.css | L555 | `.section-title` | `--text-h5` | Already <h2>, inherits from global.css |

---

## ⚠️ MISMATCH — Element vs token disagree

The HTML uses a heading element but the token doesn't match it.
**Action:** Decide if the element or the token is wrong, fix one, delete font-size.

| File | Line | Selector | Token | Issue |
|------|------|----------|-------|-------|
| components/A11y Panel/NavigationSection.astro | L71 | `.a11y-section__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/A11y Panel/TypographyAdjustmentsSection.astro | L91 | `.a11y-section__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/A11y Panel/TypographySection.astro | L61 | `.a11y-section__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/A11y Panel/VisualSection.astro | L87 | `.a11y-section__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Cards/CompactToolCard.astro | L92 | `.compact-description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Cards/InsightCard.astro | L219 | `.insight-card__excerpt` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Cards/InsightCard.astro | L245 | `.insight-card__title` | `--text-body` | Element is <h2> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Cards/InsightCard.astro | L249 | `.insight-card__excerpt` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Cards/InsightCard.astro | L276 | `.insight-card__title` | `--text-small` | Element is <h2> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Cards/InsightCard.astro | L306 | `.insight-card__title` | `--text-fine` | Element is <h2> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Cards/ProductCard.astro | L195 | `.product-card__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Cards/ProductCard.astro | L394 | `.product-card__name` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Cards/ProductCard.astro | L398 | `.product-card__description` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Cards/ProductCard.astro | L425 | `.product-card__name` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Cards/ProductCard.astro | L461 | `.product-card__name` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Cards/ProjectCard.astro | L227 | `.project-card__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Cards/ProjectCard.astro | L255 | `.project-card__description` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Cards/WhyCard.astro | L98 | `.why-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Cards/WhyCard.astro | L103 | `.why-card__text` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Cards/WhyCard.astro | L124 | `.why-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Cards/WhyCard.astro | L128 | `.why-card__text` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Cards/WhyCard.astro | L164 | `.why-card__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/ContactForm/Contact-Popup.astro | L429 | `.contact-popup__subtitle` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/ContactForm/Contact-Popup.astro | L460 | `.contact-popup__subtitle` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/ContactForm/Contact-Popup.astro | L539 | `.contact-popup__subtitle` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Footer/Footer.astro | L224 | `.footer__copyright` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Footer/Footer.astro | L320 | `.footer__copyright` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Grids/ForYouGrid.astro | L168 | `.for-you-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Grids/RelatedGrid.astro | L387 | `.related-card--horizontal .related-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Grids/RelatedGrid.astro | L509 | `.related-card--featured .related-card__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Grids/RelatedGrid.astro | L705 | `.related-card--horizontal .related-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Grids/RelatedGrid.astro | L744 | `.related-card--horizontal .related-card__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L116 | `.author-card__bio` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L144 | `.author-card--compact .author-card__bio` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L209 | `.author-card--featured .author-card__bio` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L242 | `.author-card__bio` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L257 | `.author-card--featured .author-card__bio` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L279 | `.author-card__name` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L298 | `.author-card--featured .author-card__name` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L325 | `.author-card__name` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L344 | `.author-card--featured .author-card__name` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L370 | `.author-card__name` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/AuthorCard.astro | L389 | `.author-card--featured .author-card__name` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/Sections/EndSection.astro | L222 | `.resource-card__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Presentation/Sections/EndSection.astro | L453 | `.resource-card__title` | `--text-body` | Element is <h4> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Presentation/Sections/EndSection.astro | L457 | `.resource-card__description` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/Sections/EndSection.astro | L470 | `.recommended-card__title` | `--text-body` | Element is <h4> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Presentation/Sections/EndSection.astro | L501 | `.resource-card__title` | `--text-small` | Element is <h4> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Presentation/Sections/EndSection.astro | L537 | `.recommended-card__title` | `--text-small` | Element is <h4> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Presentation/Sections/EndSection.astro | L577 | `.resource-card__title` | `--text-fine` | Element is <h4> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/Sections/EndSection.astro | L620 | `.recommended-card__title` | `--text-fine` | Element is <h4> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Presentation/Sections/HeroSection.astro | L118 | `.hero__description` | `--text-h4` | Element is <p> but token is --text-h4 (→ h4). Check if element or token is wrong. |
| components/Presentation/Sections/HeroSection.astro | L136 | `.hero__description` | `--text-h5` | Element is <p> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| components/Presentation/Sections/QuoteSection.astro | L39 | `.quote__text` | `--text-h3` | Element is <blockquote> but token is --text-h3 (→ h3). Check if element or token is wrong. |
| components/Presentation/Sections/QuoteSection.astro | L53 | `.quote__text::before` | `--text-h1` | Element is <blockquote> but token is --text-h1 (→ h1). Check if element or token is wrong. |
| components/Presentation/Sections/QuoteSection.astro | L91 | `.quote--minimal .quote__text` | `--text-h4` | Element is <blockquote> but token is --text-h4 (→ h4). Check if element or token is wrong. |
| components/Presentation/Sections/QuoteSection.astro | L101 | `.quote__text` | `--text-h4` | Element is <blockquote> but token is --text-h4 (→ h4). Check if element or token is wrong. |
| components/Presentation/Sections/QuoteSection.astro | L111 | `.quote__text` | `--text-h4` | Element is <blockquote> but token is --text-h4 (→ h4). Check if element or token is wrong. |
| components/Presentation/Sections/QuoteSection.astro | L115 | `.quote__text::before` | `--text-h3` | Element is <blockquote> but token is --text-h3 (→ h3). Check if element or token is wrong. |
| components/Presentation/Sections/TitleSection.astro | L222 | `.title-section__description` | `--text-h4` | Element is <p> but token is --text-h4 (→ h4). Check if element or token is wrong. |
| components/Presentation/Sections/TitleSection.astro | L323 | `.title-section__description` | `--text-h5` | Element is <p> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| components/Presentation/Sections/TitleSection.astro | L373 | `.title-section__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Product/ProductInfo.astro | L185 | `.cart-note-inline` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Search/SearchOverlay.astro | L249 | `.results-title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Search/SearchOverlay.astro | L340 | `.result-title` | `--text-body` | Element is <h4> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Search/SearchOverlay.astro | L348 | `.result-description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Sections/IntroTextSection.astro | L32 | `.intro-text__lead` | `--text-h4` | Element is <p> but token is --text-h4 (→ h4). Check if element or token is wrong. |
| components/Sections/IntroTextSection.astro | L40 | `.intro-text__subtitle` | `--text-h4` | Element is <p> but token is --text-h4 (→ h4). Check if element or token is wrong. |
| components/Sections/IntroTextSection.astro | L71 | `.intro-text__subtitle` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Sections/ShareSection.astro | L251 | `.share-section__content .body-subtext` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| components/Sections/ShareSection.astro | L277 | `.share-section__content .body-subtext` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| components/Typography/SectionTitle.astro | L288 | `.section-title--xs .section-title__text` | `--text-body` | Element is <h2> but token is --text-body (→ p). Check if element or token is wrong. |
| components/Typography/SectionTitle.astro | L360 | `.section-title--variant-badge .section-title__text` | `--text-fine` | Element is <h2> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L233 | `.search-hero__subtitle` | `--text-h4` | Element is <p> but token is --text-h4 (→ h4). Check if element or token is wrong. |
| pages/search.astro | L366 | `.quick-link-card__desc` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/search.astro | L410 | `.search-results__query` | `--text-h3` | Element is <p> but token is --text-h3 (→ h3). Check if element or token is wrong. |
| pages/search.astro | L495 | `.search-hero__subtitle` | `--text-h5` | Element is <p> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| pages/search.astro | L609 | `.quick-link-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| pages/search.astro | L613 | `.quick-link-card__desc` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L630 | `.search-hero__subtitle` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/search.astro | L709 | `.search-hero__subtitle` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L746 | `.quick-link-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/search.astro | L809 | `.no-results__text` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/search.astro | L825 | `.search-hero__subtitle` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L863 | `.quick-link-card__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L872 | `.search-results__title` | `--text-body` | Element is <h2> but token is --text-body (→ p). Check if element or token is wrong. |
| pages/search.astro | L915 | `.search-hero__title` | `--text-body` | Element is <h1> but token is --text-body (→ p). Check if element or token is wrong. |
| pages/search.astro | L955 | `.quick-link-card__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L964 | `.search-results__title` | `--text-small` | Element is <h2> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/search.astro | L998 | `.search-hero__title` | `--text-small` | Element is <h1> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/search.astro | L1035 | `.quick-link-card__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1048 | `.search-results__title` | `--text-fine` | Element is <h2> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1052 | `.search-results__query` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1083 | `.no-results__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/search.astro | L1087 | `.no-results__text` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1099 | `.search-hero__title` | `--text-fine` | Element is <h1> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1136 | `.quick-link-card__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1145 | `.search-results__title` | `--text-fine` | Element is <h2> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1149 | `.search-results__query` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1186 | `.no-results__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/search.astro | L1190 | `.no-results__text` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/services/[slug].astro | L457 | `.details-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| pages/services/[slug].astro | L480 | `.process-step__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| pages/services/[slug].astro | L484 | `.process-step__text` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/services/[slug].astro | L533 | `.details-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/services/[slug].astro | L567 | `.process-step__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/services/[slug].astro | L571 | `.process-step__text` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/services/[slug].astro | L598 | `.service-section__title` | `--text-body` | Element is <h2> but token is --text-body (→ p). Check if element or token is wrong. |
| pages/services/[slug].astro | L616 | `.details-card__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/services/[slug].astro | L640 | `.process-step__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| pages/showcase/section-titles.astro | L403 | `.showcase__label` | `--text-small` | Element is <h2> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| pages/verify.astro | L223 | `.verify-greeting` | `--text-h5` | Element is <p> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| styles/a11y/visual/text-only.css | L1494 | `#a11y-content-wrapper.a11y-text-only h3.for-you-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/a11y/visual/text-only.css | L1908 | `#a11y-content-wrapper.a11y-text-only .process-step__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/a11y/visual/text-only.css | L2064 | `#a11y-content-wrapper.a11y-text-only .quick-link-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/a11y/visual/text-only.css | L2073 | `#a11y-content-wrapper.a11y-text-only .quick-link-card__desc` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/a11y/visual/text-only.css | L2101 | `#a11y-content-wrapper.a11y-text-only .search-results__query` | `--text-h3` | Element is <p> but token is --text-h3 (→ h3). Check if element or token is wrong. |
| styles/a11y/visual/text-only.css | L2162 | `#a11y-content-wrapper.a11y-text-only .result-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/components/cta-section.css | L172 | `.cta-section__title` | `--text-body` | Element is <h2> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/components/hero-morph.css | L53 | `.hero-morph__subtitle` | `--text-h5` | Element is <p> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| styles/components/hero-morph.css | L256 | `.hero-morph__subtitle` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/hero-morph.css | L280 | `.hero-morph__subtitle` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/components/hero-section.css | L30 | `.hero-section__description` | `--text-h5` | Element is <p> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| styles/components/hero-section.css | L290 | `.hero-section__extra` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/hero-section.css | L349 | `.hero-section__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/hero-section.css | L353 | `.hero-section__extra` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/components/hero-section.css | L421 | `.hero-section__title` | `--text-body` | Element is <h1> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/components/hero-section.css | L427 | `.hero-section__description` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/components/image-text-section.css | L174 | `.image-text-section__title` | `--text-small` | Element is <h2> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/masonry-card.css | L65 | `.card__label--small` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/masonry-card.css | L82 | `.card__text--emphasis` | `--text-h5` | Element is <p> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| styles/components/masonry-card.css | L105 | `.card__quote` | `--text-h5` | Element is <blockquote> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| styles/components/nav/GlassNav-expandable.css | L82 | `.expandable-item h3` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/nav/GlassNav-expandable.css | L101 | `.expandable-item p` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/nav/GlassNav-expandable.css | L133 | `.expandable-item--icon h3` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/components/pillars-section.css | L110 | `.pillars-section__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/pillars-section.css | L127 | `.pillars-section__card-title` | `--text-body` | Element is <h6> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/components/pillars-section.css | L133 | `.pillars-section__card-description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/pillars-section.css | L158 | `.pillars-section__description` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/components/pillars-section.css | L193 | `.pillars-section__card-title` | `--text-fine` | Element is <h6> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/components/pillars-section.css | L200 | `.pillars-section__card-description` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/components/search-results.css | L53 | `.result-card__desc` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/search-results.css | L84 | `.result-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/components/search-results.css | L104 | `.result-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/search-results.css | L108 | `.result-card__desc` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/components/values-section.css | L90 | `.values-section__item-title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/components/values-section.css | L95 | `.values-section__item-text` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/values-section.css | L106 | `.values-section__item-title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/components/values-section.css | L110 | `.values-section__item-text` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/asset-detail.css | L252 | `.product-description` | `--text-h5` | Element is <p> but token is --text-h5 (→ h5). Check if element or token is wrong. |
| styles/pages/asset-detail.css | L367 | `.cart-note-inline` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/asset-detail.css | L940 | `.compact-description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/cart.css | L369 | `.empty-state p` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/cart.css | L458 | `.empty-state p` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/cart.css | L534 | `.empty-state h2` | `--text-body` | Element is <h2> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/pages/checkout.css | L207 | `.form-hint` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/checkout.css | L332 | `.checkout-terms` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/checkout.css | L612 | `.form-hint` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/checkout.css | L642 | `.checkout-terms` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/checkout.css | L853 | `.checkout-title` | `--text-body` | Element is <h1> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/pages/service-detail.css | L484 | `.details-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/pages/service-detail.css | L507 | `.process-step__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/pages/service-detail.css | L511 | `.process-step__text` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/service-detail.css | L605 | `.details-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/service-detail.css | L639 | `.process-step__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/service-detail.css | L643 | `.process-step__text` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/service-detail.css | L698 | `.service-section__title` | `--text-body` | Element is <h2> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/pages/service-detail.css | L723 | `.details-card__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/service-detail.css | L747 | `.process-step__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/services.css | L250 | `.timeline-step__text` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/services.css | L368 | `.services-offerings .related-card--horizontal .related-card__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/services.css | L407 | `.services-offerings .related-card--horizontal .related-card__description` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/services.css | L433 | `.timeline-step__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/pages/services.css | L437 | `.timeline-step__text` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/services.css | L480 | `.services-offerings .related-card--horizontal .related-card__title` | `--text-body` | Element is <h3> but token is --text-body (→ p). Check if element or token is wrong. |
| styles/pages/services.css | L484 | `.services-offerings .related-card--horizontal .related-card__description` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/services.css | L529 | `.timeline-step__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/services.css | L543 | `.cta-section .cta-footer` | `--text-small` | Element is <p> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/services.css | L577 | `.services-offerings .related-card--horizontal .related-card__title` | `--text-small` | Element is <h3> but token is --text-small (→ h6/small). Check if element or token is wrong. |
| styles/pages/services.css | L615 | `.timeline-step__title` | `--text-fine` | Element is <h3> but token is --text-fine (→ small). Check if element or token is wrong. |
| styles/pages/services.css | L625 | `.cta-section .cta-footer` | `--text-fine` | Element is <p> but token is --text-fine (→ small). Check if element or token is wrong. |

---

## 🔄 CHANGE HTML — Swap element to heading, then delete font-size

These use a non-semantic element (div/span) with a heading-scale size.
**Action:** Change the HTML element to the right heading, then remove font-size from CSS.

| File | Line | Selector | Token | Recommendation |
|------|------|----------|-------|----------------|
| components/A11y Panel/PresetButton.astro | L87 | `.a11y-preset-btn__title` | `--text-h5` | Currently <span>, should be <h5> |
| components/A11y Panel/PresetButton.astro | L117 | `.a11y-preset-btn__title` | `--text-small` | Currently <span>, should be <h6/small> |
| components/A11y Panel/PresetButton.astro | L144 | `.a11y-preset-btn__title` | `--text-fine` | Currently <span>, should be <small> |
| components/A11y Panel/PresetsSidebar.astro | L62 | `.a11y-sidebar__title` | `--text-h5` | Unknown element, should be <h5> |
| components/A11y Panel/ThemeSidebar.astro | L26 | `.a11y-sidebar__title` | `--text-h5` | Unknown element, should be <h5> |
| components/Shop/MiniCart.astro | L66 | `.mini-cart__title` | `--text-small` | Currently <span>, should be <h6/small> |
| pages/search.astro | L560 | `.search-results__grid .result-item__title` | `--text-h4` | Unknown element, should be <h4> |
| pages/search.astro | L684 | `.search-results__grid .result-item__title` | `--text-h5` | Unknown element, should be <h5> |
| pages/search.astro | L781 | `.search-results__grid .result-item__title` | `--text-body` | Unknown element, should be <p> |
| pages/search.astro | L893 | `.search-results__grid .result-item__title` | `--text-fine` | Unknown element, should be <small> |
| pages/search.astro | L982 | `.search-results__grid .result-item__title` | `--text-fine` | Unknown element, should be <small> |
| pages/search.astro | L1070 | `.search-results__grid .result-item__title` | `--text-fine` | Unknown element, should be <small> |
| pages/search.astro | L1172 | `.search-results__grid .result-item__title` | `--text-fine` | Unknown element, should be <small> |
| pages/showcase/section-titles.astro | L386 | `.showcase__header h1` | `--text-h3` | Currently <header> at --text-h3 scale, should be <h3> |
| styles/a11y/visual/text-only.css | L501 | `#a11y-content-wrapper.a11y-text-only .hero-morph__title.hero-morph__brand` | `--text-h2` | Unknown element, should be <h2> |
| styles/a11y/visual/text-only.css | L1439 | `#a11y-content-wrapper.a11y-text-only .for-you-grid::before` | `--text-h3` | Currently <div> at --text-h3 scale, should be <h3> |
| styles/components/editorial-layout.css | L88 | `.editorial__section-title` | `--text-h4` | Unknown element, should be <h4> |
| styles/components/hero-morph.css | L108 | `.hero-morph__title.hero-morph__brand` | `--text-h1` | Unknown element, should be <h1> |
| styles/components/hero-morph.css | L135 | `.hero-morph__title.hero-morph__brand` | `--text-h1` | Unknown element, should be <h1> |
| styles/components/hero-morph.css | L168 | `.hero-morph__title.hero-morph__brand` | `--text-h3` | Unknown element, should be <h3> |
| styles/components/hero-morph.css | L213 | `.hero-morph__title.hero-morph__brand` | `--text-h3` | Unknown element, should be <h3> |
| styles/components/hero-morph.css | L245 | `.hero-morph__title.hero-morph__brand` | `--text-h4` | Unknown element, should be <h4> |
| styles/components/hero-morph.css | L272 | `.hero-morph__title.hero-morph__brand` | `--text-h4` | Unknown element, should be <h4> |
| styles/components/masonry-card.css | L354 | `.card-offset__title` | `--text-h5` | Unknown element, should be <h5> |
| styles/components/philosophy-flip-cards.css | L94 | `.philosophy-flip__card-title-overlay h3` | `--text-h4` | Currently <div>, should be <h4> |
| styles/components/pillars-section.css | L90 | `.pillars-section__title` | `--text-h2` | Unknown element, should be <h2> |
| styles/components/pillars-section.css | L105 | `.pillars-section__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/components/pillars-section.css | L152 | `.pillars-section__title` | `--text-body` | Unknown element, should be <p> |
| styles/components/presentation/ReaderNav.css | L325 | `.current-section-title` | `--text-small` | Currently <span>, should be <h6/small> |
| styles/components/presentation/ReaderNav.css | L1106 | `.current-section-title` | `--text-fine` | Currently <span>, should be <small> |
| styles/components/presentation/sections.css | L231 | `.pres-callout__title` | `--text-h5` | Unknown element, should be <h5> |
| styles/components/presentation/sections.css | L301 | `.pres-compare__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/assets.css | L109 | `.cta-title` | `--text-h3` | Unknown element, should be <h3> |
| styles/pages/assets.css | L150 | `.page-title` | `--text-h1` | Unknown element, should be <h1> |
| styles/pages/assets.css | L162 | `.cta-title` | `--text-h3` | Unknown element, should be <h3> |
| styles/pages/cart.css | L15 | `.cart-page__title` | `--text-h3` | Unknown element, should be <h3> |
| styles/pages/cart.css | L235 | `.cart-page__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/cart.css | L275 | `.cart-page__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/cart.css | L385 | `.cart-page__title` | `--text-h5` | Unknown element, should be <h5> |
| styles/pages/cart.css | L474 | `.cart-page__title` | `--text-body` | Unknown element, should be <p> |
| styles/pages/checkout.css | L123 | `.checkout-card__title` | `--text-h5` | Unknown element, should be <h5> |
| styles/pages/checkout.css | L141 | `.form-section-title` | `--text-h5` | Unknown element, should be <h5> |
| styles/pages/checkout.css | L259 | `.placeholder-title` | `--text-h5` | Unknown element, should be <h5> |
| styles/pages/checkout.css | L360 | `.order-summary-title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/checkout.css | L599 | `.checkout-card__title` | `--text-body` | Unknown element, should be <p> |
| styles/pages/checkout.css | L647 | `.order-summary-title` | `--text-h5` | Unknown element, should be <h5> |
| styles/pages/checkout.css | L689 | `.free-notice-title` | `--text-small` | Unknown element, should be <h6/small> |
| styles/pages/checkout.css | L755 | `.placeholder-title` | `--text-body` | Unknown element, should be <p> |
| styles/pages/checkout.css | L882 | `.checkout-card__title` | `--text-small` | Unknown element, should be <h6/small> |
| styles/pages/checkout.css | L938 | `.order-summary-title` | `--text-small` | Unknown element, should be <h6/small> |
| styles/pages/checkout.css | L969 | `.free-notice-title` | `--text-fine` | Unknown element, should be <small> |
| styles/pages/checkout.css | L1002 | `.placeholder-title` | `--text-small` | Unknown element, should be <h6/small> |
| styles/pages/legal.css | L35 | `.legal-prose h2` | `--text-h3` | Currently <div> at --text-h3 scale, should be <h3> |
| styles/pages/service-detail.css | L21 | `.service-hero__title` | `--text-h2` | Unknown element, should be <h2> |
| styles/pages/service-detail.css | L264 | `.service-cta__title` | `--text-h3` | Unknown element, should be <h3> |
| styles/pages/service-detail.css | L324 | `.related-service-card__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/service-detail.css | L362 | `.service-hero__title` | `--text-h3` | Unknown element, should be <h3> |
| styles/pages/service-detail.css | L381 | `.service-hero__title` | `--text-h3` | Unknown element, should be <h3> |
| styles/pages/service-detail.css | L432 | `.service-cta__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/service-detail.css | L448 | `.service-hero__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/service-detail.css | L527 | `.service-cta__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/service-detail.css | L539 | `.related-service-card__title` | `--text-h5` | Unknown element, should be <h5> |
| styles/pages/service-detail.css | L554 | `.service-hero__title` | `--text-h4` | Unknown element, should be <h4> |
| styles/pages/service-detail.css | L651 | `.service-cta__title` | `--text-h5` | Unknown element, should be <h5> |
| styles/pages/service-detail.css | L663 | `.related-service-card__title` | `--text-body` | Unknown element, should be <p> |
| styles/pages/service-detail.css | L682 | `.service-hero__title` | `--text-h5` | Unknown element, should be <h5> |
| styles/pages/service-detail.css | L763 | `.service-cta__title` | `--text-body` | Unknown element, should be <p> |
| styles/pages/service-detail.css | L780 | `.related-service-card__title` | `--text-small` | Unknown element, should be <h6/small> |

---

## ✔️ KEEP — Non-heading content (font-size stays)

These are badges, prices, labels, meta text etc. They need explicit sizes.

| File | Line | Selector | Token |
|------|------|----------|-------|
| components/A11y Panel/FontCard.astro | L71 | `.a11y-font-card__label` | `--text-h5` |
| components/A11y Panel/FontCard.astro | L90 | `.a11y-font-card__label` | `--text-body` |
| components/A11y Panel/PresetButton.astro | L93 | `.a11y-preset-btn__subtitle` | `--text-body` |
| components/A11y Panel/PresetButton.astro | L121 | `.a11y-preset-btn__subtitle` | `--text-fine` |
| components/A11y Panel/Slider.astro | L93 | `.a11y-setting__value` | `--text-small` |
| components/A11y Panel/Slider.astro | L149 | `.a11y-slider__labels` | `--text-small` |
| components/A11y Panel/Stepper.astro | L100 | `.a11y-stepper__label` | `--text-h5` |
| components/A11y Panel/Stepper.astro | L108 | `.a11y-stepper__value` | `--text-h4` |
| components/A11y Panel/Stepper.astro | L173 | `.a11y-stepper__label` | `--text-body` |
| components/A11y Panel/Stepper.astro | L177 | `.a11y-stepper__value` | `--text-h4` |
| components/A11y Panel/Stepper.astro | L194 | `.a11y-stepper__label` | `--text-small` |
| components/A11y Panel/Stepper.astro | L198 | `.a11y-stepper__value` | `--text-h5` |
| components/A11y Panel/Toggle.astro | L65 | `.a11y-setting__desc` | `--text-small` |
| components/A11y Panel/ToggleCard.astro | L116 | `.a11y-toggle-card__label` | `--text-h5` |
| components/A11y Panel/ToggleCard.astro | L122 | `.a11y-toggle-card__desc` | `--text-small` |
| components/A11y Panel/ToggleCard.astro | L159 | `.a11y-toggle-card__label` | `--text-small` |
| components/A11y Panel/ToggleCard.astro | L163 | `.a11y-toggle-card__desc` | `--text-fine` |
| components/A11y Panel/ToggleCard.astro | L180 | `.a11y-toggle-card__label` | `--text-small` |
| components/A11y Panel/ToggleCard.astro | L206 | `.a11y-toggle-card__label` | `--text-fine` |
| components/Badge/Badge.astro | L157 | `.badge__label` | `--text-small` |
| components/Badge/Badge.astro | L343 | `.badge__label` | `--text-fine` |
| components/Button/ButtonDropdown.astro | L128 | `.dropdown-item` | `--text-small` |
| components/Cards/CompactToolCard.astro | L76 | `.compact-category` | `--text-fine` |
| components/Cards/CompactToolCard.astro | L106 | `.compact-arrow` | `--text-h4` |
| components/Cards/InsightCard.astro | L134 | `.insight-card__read-time` | `--text-small` |
| components/Cards/InsightCard.astro | L253 | `.insight-card__read-time` | `--text-fine` |
| components/Cards/OfferingCard.astro | L148 | `.offering-card__detail h4` | `--text-small` |
| components/Cards/OfferingCard.astro | L164 | `.offering-card__detail ul li` | `--text-small` |
| components/Cards/ProductCard.astro | L180 | `.product-card__category` | `--text-fine` |
| components/Cards/ProductCard.astro | L216 | `.price-current` | `--text-body` |
| components/Cards/ProductCard.astro | L230 | `.add-to-cart-icon` | `--text-h4` |
| components/Cards/ProductCard.astro | L283 | `.price-current` | `--text-h4` |
| components/Cards/ProductCard.astro | L297 | `.price-current` | `--text-h5` |
| components/Cards/ProductCard.astro | L327 | `.price-current` | `--text-body` |
| components/Cards/ProjectCard.astro | L136 | `.project-card__category` | `--text-body` |
| components/Cards/ProjectCard.astro | L223 | `.project-card__category` | `--text-small` |
| components/Cards/ProjectCard.astro | L247 | `.project-card__category` | `--text-fine` |
| components/Cards/ProjectSpecCard.astro | L58 | `.project-spec-card__label` | `--text-small` |
| components/Cards/ProjectSpecCard.astro | L66 | `.project-spec-card__value` | `--text-small` |
| components/Cards/ProjectSpecCard.astro | L85 | `.project-spec-card__label` | `--text-fine` |
| components/Cards/ProjectSpecCard.astro | L89 | `.project-spec-card__value` | `--text-fine` |
| components/Cards/SpecCard.astro | L62 | `.spec-card__label` | `--text-body` |
| components/Cards/SpecCard.astro | L70 | `.spec-card__value` | `--text-small` |
| components/Cards/SpecCard.astro | L85 | `.spec-card__label` | `--text-small` |
| components/Cards/SpecCard.astro | L89 | `.spec-card__value` | `--text-fine` |
| components/Cards/SpecCard.astro | L106 | `.spec-card__value` | `--text-fine` |
| components/Cards/SpecCard.astro | L144 | `.spec-card__label` | `--text-fine` |
| components/Cards/StepCard.astro | L53 | `.step-card__number` | `--text-h4` |
| components/Cards/WhyCard.astro | L70 | `.why-card__badge-text` | `--text-fine` |
| components/Checkout/DownloadSummary.astro | L120 | `.download-summary__empty p` | `--text-fine` |
| components/Checkout/DownloadSummary.astro | L171 | `.download-summary__item-name` | `--text-small` |
| components/Checkout/DownloadSummary.astro | L186 | `.download-summary__badge` | `--text-fine` |
| components/Checkout/DownloadSummary.astro | L227 | `.download-summary__item-name` | `--text-fine` |
| components/ContactForm/Contact-Popup.astro | L243 | `.contact-popup__info-item` | `--text-small` |
| components/ContactForm/Contact-Popup.astro | L301 | `.form__label` | `--text-small` |
| components/ContactForm/Contact-Popup.astro | L310 | `.form__input` | `--text-body` |
| components/ContactForm/Contact-Popup.astro | L425 | `.contact-popup__header h2` | `--text-h4` |
| components/ContactForm/Contact-Popup.astro | L456 | `.contact-popup__header h2` | `--text-h4` |
| components/ContactForm/Contact-Popup.astro | L499 | `.contact-popup__header h2` | `--text-h5` |
| components/ContactForm/Contact-Popup.astro | L535 | `.contact-popup__header h2` | `--text-body` |
| components/ContactForm/Contact-Popup.astro | L593 | `.contact-popup__header h2` | `--text-small` |
| components/ContactForm/Contact-Popup.astro | L615 | `.contact-popup__topics h3` | `--text-small` |
| components/ContactForm/Contact-Popup.astro | L649 | `.contact-popup__header h2` | `--text-fine` |
| components/ContactForm/Contact-Popup.astro | L666 | `.form__input` | `--text-fine` |
| components/ContactForm/Contact-Popup.astro | L670 | `.form__label` | `--text-fine` |
| components/ContactForm/Contact-Popup.astro | L682 | `.contact-popup__topics h3` | `--text-fine` |
| components/ContactForm/Contact-Popup.astro | L709 | `.contact-popup__header h2` | `--text-fine` |
| components/ContactForm/Contact-Popup.astro | L723 | `.form__input` | `--text-fine` |
| components/ContactForm/Contact-Popup.astro | L739 | `.contact-popup__topics h3` | `--text-fine` |
| components/Footer/Footer.astro | L194 | `.footer__link` | `--text-small` |
| components/Footer/Footer.astro | L251 | `.footer__link` | `--text-fine` |
| components/Footer/Footer.astro | L315 | `.footer__link` | `--text-fine` |
| components/Grids/RelatedGrid.astro | L583 | `.related-card__date` | `--text-small` |
| components/Grids/RelatedGrid.astro | L592 | `.related-card__button` | `--text-small` |
| components/Grids/RelatedGrid.astro | L748 | `.related-card--horizontal :global(.btn)` | `--text-fine` |
| components/Insights/InsightContent.astro | L49 | `.insight-content :global(h2)` | `--text-h4` |
| components/Insights/InsightContent.astro | L55 | `.insight-content :global(h3)` | `--text-h4` |
| components/Insights/InsightContent.astro | L61 | `.insight-content :global(h4)` | `--text-h5` |
| components/Insights/InsightHeader.astro | L140 | `.insight-header__readtime` | `--text-small` |
| components/Navigation/Breadcrumbs.astro | L37 | `.breadcrumbs` | `--text-small` |
| components/Navigation/Breadcrumbs.astro | L65 | `.breadcrumbs` | `--text-fine` |
| components/Presentation/AuthorCard.astro | L88 | `.author-card__label` | `--text-fine` |
| components/Presentation/AuthorCard.astro | L108 | `.author-card__role` | `--text-small` |
| components/Presentation/AuthorCard.astro | L237 | `.author-card__role` | `--text-fine` |
| components/Presentation/Sections/CalloutSection.astro | L96 | `.callout__content` | `--text-body` |
| components/Presentation/Sections/CompareSection.astro | L68 | `.compare__label` | `--text-fine` |
| components/Presentation/Sections/CompareSection.astro | L94 | `.compare__content` | `--text-body` |
| components/Presentation/Sections/EndSection.astro | L205 | `.resource-card__type` | `--text-fine` |
| components/Presentation/Sections/EndSection.astro | L233 | `.resource-card__link` | `--text-small` |
| components/Presentation/Sections/EndSection.astro | L327 | `.recommended-card__category` | `--text-fine` |
| components/Presentation/Sections/EndSection.astro | L348 | `.recommended-card__link` | `--text-small` |
| components/Presentation/Sections/EndSection.astro | L509 | `.resource-card__link` | `--text-fine` |
| components/Presentation/Sections/EndSection.astro | L541 | `.recommended-card__link` | `--text-fine` |
| components/Presentation/Sections/FullWidthSection.astro | L92 | `.fullwidth__body` | `--text-h5` |
| components/Presentation/Sections/FullWidthSection.astro | L118 | `.fullwidth__body` | `--text-body` |
| components/Presentation/Sections/FullWidthSection.astro | L137 | `.fullwidth__body` | `--text-small` |
| components/Presentation/Sections/FullWidthSection.astro | L155 | `.fullwidth__body` | `--text-fine` |
| components/Presentation/Sections/GallerySection.astro | L84 | `.gallery__caption` | `--text-small` |
| components/Presentation/Sections/HeroSection.astro | L96 | `.hero__category` | `--text-fine` |
| components/Presentation/Sections/HeroSection.astro | L104 | `.hero__date` | `--text-small` |
| components/Presentation/Sections/ImageTextSection.astro | L91 | `.image-text__body` | `--text-h5` |
| components/Presentation/Sections/ImageTextSection.astro | L122 | `.image-text__body` | `--text-body` |
| components/Presentation/Sections/ImageTextSection.astro | L137 | `.image-text__body` | `--text-small` |
| components/Presentation/Sections/ImageTextSection.astro | L147 | `.image-text__body` | `--text-fine` |
| components/Presentation/Sections/QuoteSection.astro | L69 | `.quote__author` | `--text-h5` |
| components/Presentation/Sections/QuoteSection.astro | L76 | `.quote__role` | `--text-small` |
| components/Presentation/Sections/StatsSection.astro | L72 | `.stats__value` | `--text-h2` |
| components/Presentation/Sections/StatsSection.astro | L81 | `.stats__suffix` | `--text-h3` |
| components/Presentation/Sections/StatsSection.astro | L87 | `.stats__label` | `--text-body` |
| components/Presentation/Sections/StatsSection.astro | L99 | `.stats__value` | `--text-h3` |
| components/Presentation/Sections/StatsSection.astro | L110 | `.stats__value` | `--text-h3` |
| components/Presentation/Sections/TextSection.astro | L67 | `.text-section__body` | `--text-h5` |
| components/Presentation/Sections/TextSection.astro | L87 | `.text-section__body` | `--text-body` |
| components/Presentation/Sections/TextSection.astro | L98 | `.text-section__body` | `--text-small` |
| components/Presentation/Sections/TextSection.astro | L108 | `.text-section__body` | `--text-fine` |
| components/Presentation/Sections/TitleSection.astro | L179 | `.title-section__category` | `--text-fine` |
| components/Presentation/Sections/TitleSection.astro | L188 | `.title-section__date` | `--text-small` |
| components/Presentation/Sections/TitleSection.astro | L197 | `.title-section__reading-time` | `--text-small` |
| components/Presentation/Sections/TitleSection.astro | L243 | `.title-section__btn` | `--text-body` |
| components/Presentation/Sections/TitleSection.astro | L378 | `.title-section__btn` | `--text-small` |
| components/Product/ProductInfo.astro | L133 | `.info-badge` | `--text-fine` |
| components/Product/ProductInfo.astro | L173 | `.product-sku` | `--text-small` |
| components/Search/SearchOverlay.astro | L200 | `.search-input` | `--text-h5` |
| components/Search/SearchOverlay.astro | L273 | `.quick-link` | `--text-small` |
| components/Search/SearchOverlay.astro | L358 | `.result-category` | `--text-fine` |
| components/Search/SearchOverlay.astro | L378 | `.no-results p` | `--text-h5` |
| components/Search/SearchOverlay.astro | L384 | `.no-results span` | `--text-small` |
| components/Search/SearchOverlay.astro | L391 | `.keyboard-hint` | `--text-small` |
| components/Search/SearchOverlay.astro | L399 | `.keyboard-hint kbd` | `--text-fine` |
| components/Search/SearchOverlay.astro | L428 | `.search-input` | `--text-body` |
| components/Sections/ShareSection.astro | L164 | `.share-btn::after` | `--text-fine` |
| components/Sections/ShareSection.astro | L246 | `.share-section__content h2` | `--text-h4` |
| components/Sections/ShareSection.astro | L273 | `.share-section__content h2` | `--text-h4` |
| components/Sections/StorySection.astro | L51 | `.story__text p` | `--text-h4` |
| components/Sections/StorySection.astro | L65 | `.story__text p` | `--text-h5` |
| components/Sections/StorySection.astro | L71 | `.story__text p` | `--text-body` |
| components/Sections/StorySection.astro | L81 | `.story__text p` | `--text-small` |
| components/Shop/MiniCart.astro | L74 | `.mini-cart__edit` | `--text-fine` |
| components/Shop/MiniCart.astro | L139 | `.mini-cart__item-name` | `--text-small` |
| components/Shop/MiniCart.astro | L150 | `.mini-cart__item-meta` | `--text-fine` |
| components/Shop/MiniCart.astro | L188 | `.mini-cart__row` | `--text-small` |
| components/Shop/MiniCart.astro | L197 | `.mini-cart__row--total` | `--text-body` |
| components/Shop/MiniCart.astro | L213 | `.mini-cart__checkout` | `--text-small` |
| components/Shop/MiniCart.astro | L241 | `.mini-cart__empty p` | `--text-small` |
| components/Switcher/BaseSwitcher.astro | L139 | `.switcher-nav` | `--text-small` |
| components/Switcher/BaseSwitcher.astro | L175 | `.switcher-btn` | `--text-small` |
| components/Switcher/BaseSwitcher.astro | L302 | `.switcher-btn` | `--text-fine` |
| components/Switcher/BaseSwitcher.astro | L332 | `.switcher-btn` | `--text-fine` |
| components/Switcher/BaseSwitcher.astro | L337 | `.switcher-btn__label` | `--text-fine` |
| pages/checkout.astro | L135 | `.checkout-info` | `--text-small` |
| pages/checkout.astro | L154 | `.checkout-info` | `--text-fine` |
| pages/search.astro | L263 | `.search-input` | `--text-h5` |
| pages/search.astro | L499 | `.search-input` | `--text-body` |
| pages/search.astro | L564 | `.search-results__grid .result-item__desc` | `--text-small` |
| pages/search.astro | L634 | `.search-input` | `--text-small` |
| pages/search.astro | L688 | `.search-results__grid .result-item__desc` | `--text-small` |
| pages/search.astro | L692 | `.search-results__grid .result-item__category` | `--text-fine` |
| pages/search.astro | L786 | `.search-results__grid .result-item__desc` | `--text-fine` |
| pages/search.astro | L791 | `.search-results__grid .result-item__breadcrumb` | `--text-fine` |
| pages/search.astro | L796 | `.search-results__grid .result-item__category` | `--text-fine` |
| pages/search.astro | L830 | `.search-input` | `--text-fine` |
| pages/search.astro | L978 | `.search-results__grid .result-item__breadcrumb` | `--text-fine` |
| pages/search.astro | L1004 | `.search-input` | `--text-fine` |
| pages/search.astro | L1065 | `.search-results__grid .result-item__breadcrumb` | `--text-fine` |
| pages/search.astro | L1105 | `.search-input` | `--text-fine` |
| pages/search.astro | L1167 | `.search-results__grid .result-item__breadcrumb` | `--text-fine` |
| pages/services/[slug].astro | L335 | `.process-step__number` | `--text-h4` |
| pages/services/[slug].astro | L426 | `.process-step__number` | `--text-h5` |
| pages/services/[slug].astro | L464 | `.details-card__list li` | `--text-small` |
| pages/services/[slug].astro | L476 | `.process-step__number` | `--text-body` |
| pages/services/[slug].astro | L497 | `#service-image-section .image-text-section__body p` | `--text-small` |
| pages/services/[slug].astro | L538 | `.details-card__list li` | `--text-fine` |
| pages/services/[slug].astro | L563 | `.process-step__number` | `--text-small` |
| pages/services/[slug].astro | L576 | `#service-image-section .image-text-section__body p` | `--text-fine` |
| pages/services/[slug].astro | L636 | `.process-step__number` | `--text-fine` |
| pages/showcase/section-titles.astro | L392 | `.showcase__header p` | `--text-h5` |
| pages/showcase/section-titles.astro | L449 | `.showcase__item code` | `--text-fine` |
| pages/verify.astro | L244 | `.verify-note p` | `--text-small` |
| styles/a11y/base/screen-reader.css | L37 | `#a11y-content-wrapper.a11y-screen-reader-mode::after` | `--text-fine` |
| styles/a11y/motion/reduced-motion.css | L773 | `#a11y-content-wrapper.a11y-reduce-motion .philosophy-flip__card-back-content h3` | `--text-h4` |
| styles/a11y/motion/reduced-motion.css | L778 | `#a11y-content-wrapper.a11y-reduce-motion .philosophy-flip__card-back-content p` | `--text-h5` |
| styles/a11y/motion/reduced-motion.css | L835 | `.philosophy-flip__card-back-content h3` | `--text-h4` |
| styles/a11y/motion/reduced-motion.css | L840 | `.philosophy-flip__card-back-content p` | `--text-h5` |
| styles/a11y/visual/highlight-links.css | L672 | `#a11y-content-wrapper.a11y-highlight-links .philosophy-flip__card-back-content h3` | `--text-h4` |
| styles/a11y/visual/highlight-links.css | L677 | `#a11y-content-wrapper.a11y-highlight-links .philosophy-flip__card-back-content p` | `--text-h5` |
| styles/a11y/visual/text-only.css | L933 | `#a11y-content-wrapper.a11y-text-only .project-spec-card__label` | `--text-small` |
| styles/a11y/visual/text-only.css | L943 | `#a11y-content-wrapper.a11y-text-only .project-spec-card__value` | `--text-body` |
| styles/a11y/visual/text-only.css | L1002 | `#a11y-content-wrapper.a11y-text-only .share-btn` | `--text-small` |
| styles/a11y/visual/text-only.css | L1074 | `#a11y-content-wrapper.a11y-text-only .tab-panel[data-panel]::before` | `--text-h3` |
| styles/a11y/visual/text-only.css | L1275 | `#a11y-content-wrapper.a11y-text-only .spec-card__label` | `--text-small` |
| styles/a11y/visual/text-only.css | L1290 | `#a11y-content-wrapper.a11y-text-only .spec-card__value` | `--text-body` |
| styles/a11y/visual/text-only.css | L1750 | `#a11y-content-wrapper.a11y-text-only .end-section__resources::before` | `--text-h4` |
| styles/a11y/visual/text-only.css | L1772 | `#a11y-content-wrapper.a11y-text-only .end-section__recommended::before` | `--text-h4` |
| styles/a11y/visual/text-only.css | L2048 | `#a11y-content-wrapper.a11y-text-only .quick-link-card::before` | `--text-h5` |
| styles/a11y/visual/text-only.css | L2153 | `#a11y-content-wrapper.a11y-text-only .result-card__badge-wrap .badge` | `--text-fine` |
| styles/buttons/basic-button.css | L16 | `.btn` | `--text-body` |
| styles/buttons/basic-button.css | L117 | `.btn-sm` | `--text-small` |
| styles/buttons/basic-button.css | L123 | `.btn-lg` | `--text-h5` |
| styles/components/announcement-ticker.css | L80 | `.announcement-ticker__item` | `--text-small` |
| styles/components/cart-icon.css | L116 | `.cart-icon__count` | `--text-fine` |
| styles/components/cart-icon.css | L159 | `.cart-icon__count` | `--text-fine` |
| styles/components/cart-icon.css | L202 | `#a11y-content-wrapper[class*="a11y-"] .cart-icon__count` | `--text-small` |
| styles/components/cookie-banner.css | L117 | `.cookie-required` | `--text-fine` |
| styles/components/cta-section.css | L58 | `.cta-section__trust-text strong` | `--text-h4` |
| styles/components/cta-section.css | L64 | `.cta-section__trust-text span` | `--text-small` |
| styles/components/cta-section.css | L123 | `.cta-section__body p` | `--text-small` |
| styles/components/cta-section.css | L154 | `.cta-section__trust-text strong` | `--text-small` |
| styles/components/cta-section.css | L158 | `.cta-section__trust-text span` | `--text-fine` |
| styles/components/cta-section.css | L176 | `.cta-section__body p` | `--text-fine` |
| styles/components/cta-section.css | L180 | `.cta-section__trust-text strong` | `--text-fine` |
| styles/components/cta-section.css | L184 | `.cta-section__trust-text span` | `--text-fine` |
| styles/components/editorial-layout.css | L60 | `.benefits-list__items li` | `--text-body` |
| styles/components/editorial-layout.css | L113 | `.editorial-highlight` | `--text-body` |
| styles/components/editorial-layout.css | L139 | `.editorial-skill` | `--text-small` |
| styles/components/editorial-layout.css | L237 | `.editorial-about__audience strong` | `--text-small` |
| styles/components/editorial-layout.css | L245 | `.editorial-about__audience p` | `--text-body` |
| styles/components/masonry-card.css | L56 | `.card__label` | `--text-h5` |
| styles/components/masonry-card.css | L89 | `.card__value` | `--text-h4` |
| styles/components/masonry-card.css | L98 | `.card__value--large` | `--text-h3` |
| styles/components/masonry-card.css | L115 | `.card__author` | `--text-small` |
| styles/components/masonry-card.css | L158 | `.card__badge` | `--text-small` |
| styles/components/masonry-card.css | L174 | `.card__button` | `--text-body` |
| styles/components/masonry-card.css | L362 | `.card-offset__description` | `--text-small` |
| styles/components/masonry-card.css | L375 | `.card-offset__button` | `--text-small` |
| styles/components/nav/GlassNav-base.css | L73 | `.nav-links a` | `--text-fine` |
| styles/components/nav/GlassNav-base.css | L98 | `.nav-item-expandable` | `--text-fine` |
| styles/components/nav/GlassNav-mobile.css | L244 | `.submenu-toggle` | `--text-h4` |
| styles/components/nav/GlassNav-responsive.css | L39 | `.nav-item-expandable` | `--text-fine` |
| styles/components/philosophy-flip-cards.css | L21 | `.philosophy-flip__intro-line` | `--text-h4` |
| styles/components/philosophy-flip-cards.css | L119 | `.philosophy-flip__card-back-content h3` | `--text-h4` |
| styles/components/philosophy-flip-cards.css | L128 | `.philosophy-flip__card-back-content p` | `--text-h4` |
| styles/components/philosophy-flip-cards.css | L201 | `.philosophy-flip__card-back-content h3` | `--text-h4` |
| styles/components/philosophy-flip-cards.css | L206 | `.philosophy-flip__card-back-content p` | `--text-h4` |
| styles/components/philosophy-flip-cards.css | L230 | `.philosophy-flip__intro-line` | `--text-h5` |
| styles/components/philosophy-flip-cards.css | L246 | `.philosophy-flip__intro-line` | `--text-body` |
| styles/components/philosophy-flip-cards.css | L263 | `.philosophy-flip__card-back-content h3` | `--text-body` |
| styles/components/philosophy-flip-cards.css | L268 | `.philosophy-flip__card-back-content p` | `--text-small` |
| styles/components/philosophy-flip-cards.css | L283 | `.philosophy-flip__intro-line` | `--text-small` |
| styles/components/philosophy-flip-cards.css | L291 | `.philosophy-flip__card-back-content h3` | `--text-small` |
| styles/components/philosophy-flip-cards.css | L295 | `.philosophy-flip__card-back-content p` | `--text-fine` |
| styles/components/presentation/ReaderNav.css | L396 | `.speed-label` | `--text-fine` |
| styles/components/presentation/ReaderNav.css | L525 | `.section-number` | `--text-fine` |
| styles/components/presentation/ReaderNav.css | L552 | `.section-name` | `--text-fine` |
| styles/components/presentation/ReaderNav.css | L1399 | `.reader-resume-toast__text` | `--text-small` |
| styles/components/presentation/ReaderNav.css | L1404 | `.reader-resume-toast__section` | `--text-body` |
| styles/components/presentation/ReaderNav.css | L1418 | `.reader-resume-toast__btn` | `--text-small` |
| styles/components/presentation/sections.css | L17 | `.pres-quote__text` | `--text-h3` |
| styles/components/presentation/sections.css | L31 | `.pres-quote__text::before` | `--text-h1` |
| styles/components/presentation/sections.css | L47 | `.pres-quote__author` | `--text-h5` |
| styles/components/presentation/sections.css | L54 | `.pres-quote__role` | `--text-small` |
| styles/components/presentation/sections.css | L68 | `.pres-quote--minimal .pres-quote__text` | `--text-h4` |
| styles/components/presentation/sections.css | L110 | `.pres-stats__value` | `--text-h2` |
| styles/components/presentation/sections.css | L119 | `.pres-stats__suffix` | `--text-h3` |
| styles/components/presentation/sections.css | L125 | `.pres-stats__label` | `--text-body` |
| styles/components/presentation/sections.css | L175 | `.pres-gallery__caption` | `--text-small` |
| styles/components/presentation/sections.css | L239 | `.pres-callout__content` | `--text-body` |
| styles/components/presentation/sections.css | L283 | `.pres-compare__label` | `--text-fine` |
| styles/components/presentation/sections.css | L309 | `.pres-compare__content` | `--text-body` |
| styles/components/presentation/sections.css | L325 | `.pres-quote__text` | `--text-h4` |
| styles/components/presentation/sections.css | L334 | `.pres-stats__value` | `--text-h3` |
| styles/components/presentation/sections.css | L366 | `.pres-quote__text` | `--text-h4` |
| styles/components/presentation/sections.css | L370 | `.pres-quote__text::before` | `--text-h3` |
| styles/components/presentation/sections.css | L379 | `.pres-stats__value` | `--text-h3` |
| styles/components/product-gallery.css | L65 | `.product-badge` | `--text-fine` |
| styles/components/toast.css | L32 | `.toast` | `--text-body` |
| styles/components/toast.css | L103 | `.toast-arcade` | `--text-small` |
| styles/components/toast.css | L283 | `.toast` | `--text-small` |
| styles/components/values-section.css | L31 | `.values-section__number` | `--text-h1` |
| styles/components/values-section.css | L65 | `.values-section__number` | `--text-h3` |
| styles/components/values-section.css | L86 | `.values-section__number` | `--text-h4` |
| styles/components/values-section.css | L102 | `.values-section__number` | `--text-h4` |
| styles/pages/asset-detail.css | L172 | `.product-category` | `--text-small` |
| styles/pages/asset-detail.css | L194 | `.product-info-row` | `--text-small` |
| styles/pages/asset-detail.css | L231 | `.product-sku` | `--text-fine` |
| styles/pages/asset-detail.css | L246 | `.price-current` | `--text-h4` |
| styles/pages/asset-detail.css | L278 | `.info-item` | `--text-small` |
| styles/pages/asset-detail.css | L296 | `.download-note` | `--text-small` |
| styles/pages/asset-detail.css | L343 | `.cart-btn-wrapper :global(.unified-btn button)` | `--text-small` |
| styles/pages/asset-detail.css | L355 | `.cart-btn-wrapper :global(.unified-btn button)` | `--text-fine` |
| styles/pages/asset-detail.css | L439 | `.tab-panel h2` | `--text-h4` |
| styles/pages/asset-detail.css | L448 | `.tab-panel h3` | `--text-h4` |
| styles/pages/asset-detail.css | L465 | `.tab-panel div` | `--text-body` |
| styles/pages/asset-detail.css | L523 | `.spec-label` | `--text-small` |
| styles/pages/asset-detail.css | L529 | `.spec-value` | `--text-body` |
| styles/pages/asset-detail.css | L618 | `.content-section__item` | `--text-small` |
| styles/pages/asset-detail.css | L724 | `.spec-card__label` | `--text-fine` |
| styles/pages/asset-detail.css | L732 | `.spec-card__value` | `--text-small` |
| styles/pages/asset-detail.css | L740 | `.spec-card__text` | `--text-fine` |
| styles/pages/asset-detail.css | L865 | `.features-list span` | `--text-body` |
| styles/pages/asset-detail.css | L910 | `.compact-category` | `--text-fine` |
| styles/pages/asset-detail.css | L919 | `.compact-arrow` | `--text-h4` |
| styles/pages/asset-detail.css | L969 | `.price-current` | `--text-h4` |
| styles/pages/asset-detail.css | L991 | `.price-current` | `--text-h5` |
| styles/pages/asset-detail.css | L1018 | `.spec-card__value` | `--text-fine` |
| styles/pages/assets.css | L15 | `.page-description` | `--text-body` |
| styles/pages/assets.css | L59 | `.products-count` | `--text-small` |
| styles/pages/assets.css | L116 | `.cta-description` | `--text-h5` |
| styles/pages/assets.css | L133 | `.newsletter-input` | `--text-body` |
| styles/pages/cart.css | L94 | `.cart-item-name` | `--text-h5` |
| styles/pages/cart.css | L105 | `.cart-item-price` | `--text-body` |
| styles/pages/cart.css | L196 | `.summary-row` | `--text-body` |
| styles/pages/cart.css | L204 | `.summary-row.total` | `--text-h4` |
| styles/pages/cart.css | L219 | `.btn-block` | `--text-body` |
| styles/pages/cart.css | L250 | `.cart-item-name` | `--text-body` |
| styles/pages/cart.css | L292 | `.cart-item-name` | `--text-small` |
| styles/pages/cart.css | L297 | `.cart-item-price` | `--text-small` |
| styles/pages/cart.css | L315 | `.qty-value` | `--text-fine` |
| styles/pages/cart.css | L319 | `.cart-item-total` | `--text-small` |
| styles/pages/cart.css | L348 | `.summary-row` | `--text-small` |
| styles/pages/cart.css | L352 | `.summary-row.total` | `--text-h5` |
| styles/pages/cart.css | L374 | `.btn-block` | `--text-small` |
| styles/pages/cart.css | L405 | `.cart-item-name` | `--text-fine` |
| styles/pages/cart.css | L409 | `.cart-item-price` | `--text-fine` |
| styles/pages/cart.css | L427 | `.cart-item-total` | `--text-fine` |
| styles/pages/cart.css | L437 | `.summary-row` | `--text-fine` |
| styles/pages/cart.css | L441 | `.summary-row.total` | `--text-body` |
| styles/pages/cart.css | L463 | `.btn-block` | `--text-fine` |
| styles/pages/cart.css | L525 | `.summary-row.total` | `--text-small` |
| styles/pages/checkout.css | L38 | `.checkout-subtitle` | `--text-body` |
| styles/pages/checkout.css | L80 | `.step-label` | `--text-small` |
| styles/pages/checkout.css | L116 | `.checkout-card__step` | `--text-small` |
| styles/pages/checkout.css | L157 | `.checkout-form .form-input` | `--text-small` |
| styles/pages/checkout.css | L172 | `.checkout-form .form-label` | `--text-small` |
| styles/pages/checkout.css | L184 | `.checkbox-label` | `--text-small` |
| styles/pages/checkout.css | L221 | `.info-notice` | `--text-small` |
| styles/pages/checkout.css | L242 | `.payment-info-notice` | `--text-small` |
| styles/pages/checkout.css | L281 | `.card-option` | `--text-small` |
| styles/pages/checkout.css | L286 | `.placeholder-note` | `--text-small` |
| styles/pages/checkout.css | L293 | `.payment-errors` | `--text-small` |
| styles/pages/checkout.css | L304 | `.payment-methods` | `--text-small` |
| styles/pages/checkout.css | L315 | `.payment-icon` | `--text-fine` |
| styles/pages/checkout.css | L412 | `.order-item-name` | `--text-body` |
| styles/pages/checkout.css | L419 | `.order-item-type` | `--text-small` |
| styles/pages/checkout.css | L434 | `.free-badge` | `--text-fine` |
| styles/pages/checkout.css | L461 | `.free-notice-text` | `--text-small` |
| styles/pages/checkout.css | L487 | `.promo-code-input` | `--text-small` |
| styles/pages/checkout.css | L500 | `.order-total-row` | `--text-body` |
| styles/pages/checkout.css | L513 | `.total-row` | `--text-h4` |
| styles/pages/checkout.css | L532 | `.trust-badge` | `--text-small` |
| styles/pages/checkout.css | L595 | `.checkout-card__step` | `--text-fine` |
| styles/pages/checkout.css | L603 | `.checkout-form .form-label` | `--text-fine` |
| styles/pages/checkout.css | L608 | `.checkout-form .form-input` | `--text-small` |
| styles/pages/checkout.css | L617 | `.checkbox-label` | `--text-fine` |
| styles/pages/checkout.css | L638 | `.checkout-info` | `--text-fine` |
| styles/pages/checkout.css | L667 | `.order-item-name` | `--text-small` |
| styles/pages/checkout.css | L671 | `.order-item-type` | `--text-fine` |
| styles/pages/checkout.css | L693 | `.free-notice-text` | `--text-fine` |
| styles/pages/checkout.css | L701 | `.order-total-row` | `--text-small` |
| styles/pages/checkout.css | L705 | `.total-row` | `--text-h5` |
| styles/pages/checkout.css | L716 | `.trust-badge` | `--text-fine` |
| styles/pages/checkout.css | L727 | `.step-number` | `--text-small` |
| styles/pages/checkout.css | L731 | `.step-label` | `--text-fine` |
| styles/pages/checkout.css | L740 | `.promo-code-input` | `--text-small` |
| styles/pages/checkout.css | L746 | `.info-notice` | `--text-fine` |
| styles/pages/checkout.css | L759 | `.placeholder-description` | `--text-small` |
| styles/pages/checkout.css | L767 | `.card-option` | `--text-fine` |
| styles/pages/checkout.css | L858 | `.checkout-subtitle` | `--text-fine` |
| styles/pages/checkout.css | L888 | `.checkout-form .form-input` | `--text-fine` |
| styles/pages/checkout.css | L915 | `.checkout-actions .btn` | `--text-fine` |
| styles/pages/checkout.css | L948 | `.order-item-name` | `--text-fine` |
| styles/pages/checkout.css | L978 | `.order-total-row` | `--text-fine` |
| styles/pages/checkout.css | L983 | `.total-row` | `--text-body` |
| styles/pages/checkout.css | L1007 | `.placeholder-description` | `--text-fine` |
| styles/pages/legal.css | L43 | `.legal-prose h3` | `--text-h4` |
| styles/pages/legal.css | L52 | `.legal-prose p` | `--text-body` |
| styles/pages/service-detail.css | L30 | `.service-hero__tagline` | `--text-h4` |
| styles/pages/service-detail.css | L38 | `.service-hero__description` | `--text-h5` |
| styles/pages/service-detail.css | L54 | `.service-hero__pricing` | `--text-body` |
| styles/pages/service-detail.css | L114 | `.benefit-item__text` | `--text-h5` |
| styles/pages/service-detail.css | L209 | `.process-step__number` | `--text-h4` |
| styles/pages/service-detail.css | L272 | `.service-cta__text` | `--text-h5` |
| styles/pages/service-detail.css | L332 | `.related-service-card__tagline` | `--text-small` |
| styles/pages/service-detail.css | L339 | `.related-service-card__link` | `--text-small` |
| styles/pages/service-detail.css | L385 | `.service-hero__tagline` | `--text-h5` |
| styles/pages/service-detail.css | L389 | `.service-hero__description` | `--text-body` |
| styles/pages/service-detail.css | L418 | `.process-step__number` | `--text-h5` |
| styles/pages/service-detail.css | L452 | `.service-hero__tagline` | `--text-body` |
| styles/pages/service-detail.css | L456 | `.service-hero__description` | `--text-small` |
| styles/pages/service-detail.css | L476 | `.benefit-item__text` | `--text-body` |
| styles/pages/service-detail.css | L491 | `.details-card__list li` | `--text-small` |
| styles/pages/service-detail.css | L503 | `.process-step__number` | `--text-body` |
| styles/pages/service-detail.css | L531 | `.service-cta__text` | `--text-body` |
| styles/pages/service-detail.css | L543 | `.related-service-card__tagline` | `--text-fine` |
| styles/pages/service-detail.css | L559 | `.service-hero__tagline` | `--text-small` |
| styles/pages/service-detail.css | L564 | `.service-hero__description` | `--text-fine` |
| styles/pages/service-detail.css | L597 | `.benefit-item__text` | `--text-small` |
| styles/pages/service-detail.css | L610 | `.details-card__list li` | `--text-fine` |
| styles/pages/service-detail.css | L635 | `.process-step__number` | `--text-small` |
| styles/pages/service-detail.css | L655 | `.service-cta__text` | `--text-small` |
| styles/pages/service-detail.css | L671 | `.related-service-card__link` | `--text-fine` |
| styles/pages/service-detail.css | L686 | `.service-hero__tagline` | `--text-fine` |
| styles/pages/service-detail.css | L715 | `.benefit-item__text` | `--text-fine` |
| styles/pages/service-detail.css | L743 | `.process-step__number` | `--text-fine` |
| styles/pages/service-detail.css | L767 | `.service-cta__text` | `--text-fine` |
| styles/pages/service-detail.css | L771 | `.service-cta__buttons .btn` | `--text-fine` |
| styles/pages/services.css | L59 | `.services-offerings .related-card--horizontal .related-card__badge` | `--text-fine` |
| styles/pages/services.css | L215 | `.timeline-step__number` | `--text-h5` |
| styles/pages/services.css | L429 | `.timeline-step__number` | `--text-body` |
| styles/pages/services.css | L521 | `.timeline-step__number` | `--text-small` |
| styles/pages/services.css | L590 | `.services-offerings .related-card--horizontal .btn` | `--text-fine` |
| styles/pages/services.css | L611 | `.timeline-step__number` | `--text-fine` |
| styles/responsive/xs.css | L21 | `.btn` | `--text-small` |
| styles/responsive/xs.css | L27 | `.btn-lg` | `--text-body` |
| styles/responsive/xs.css | L36 | `.btn` | `--text-fine` |
| styles/responsive/xs.css | L43 | `.btn-lg` | `--text-small` |

---

## Files Overview

| File | Redundant | Mismatch | Change HTML | Keep | Review |
|------|-----------|----------|-------------|------|--------|
| components/A11y Panel/FontCard.astro | 0 | 0 | 0 | 2 | 0 |
| components/A11y Panel/NavigationSection.astro | 1 | 1 | 0 | 0 | 0 |
| components/A11y Panel/PresetButton.astro | 0 | 0 | 3 | 2 | 0 |
| components/A11y Panel/PresetsSidebar.astro | 0 | 0 | 1 | 0 | 0 |
| components/A11y Panel/Slider.astro | 0 | 0 | 0 | 2 | 0 |
| components/A11y Panel/Stepper.astro | 0 | 0 | 0 | 6 | 0 |
| components/A11y Panel/ThemeSidebar.astro | 0 | 0 | 1 | 0 | 0 |
| components/A11y Panel/Toggle.astro | 0 | 0 | 0 | 1 | 0 |
| components/A11y Panel/ToggleCard.astro | 0 | 0 | 0 | 6 | 0 |
| components/A11y Panel/TypographyAdjustmentsSection.astro | 1 | 1 | 0 | 0 | 0 |
| components/A11y Panel/TypographySection.astro | 1 | 1 | 0 | 0 | 0 |
| components/A11y Panel/VisualSection.astro | 1 | 1 | 0 | 0 | 0 |
| components/Badge/Badge.astro | 0 | 0 | 0 | 2 | 0 |
| components/Button/ButtonDropdown.astro | 0 | 0 | 0 | 1 | 0 |
| components/Cards/CompactToolCard.astro | 1 | 1 | 0 | 2 | 0 |
| components/Cards/InsightCard.astro | 3 | 5 | 0 | 2 | 0 |
| components/Cards/OfferingCard.astro | 2 | 0 | 0 | 2 | 0 |
| components/Cards/ProductCard.astro | 1 | 5 | 0 | 6 | 0 |
| components/Cards/ProjectCard.astro | 1 | 2 | 0 | 3 | 0 |
| components/Cards/ProjectSpecCard.astro | 0 | 0 | 0 | 4 | 0 |
| components/Cards/SpecCard.astro | 0 | 0 | 0 | 6 | 0 |
| components/Cards/StepCard.astro | 2 | 0 | 0 | 1 | 0 |
| components/Cards/WhyCard.astro | 2 | 5 | 0 | 1 | 0 |
| components/Checkout/DownloadSummary.astro | 0 | 0 | 0 | 4 | 0 |
| components/ContactForm/Contact-Popup.astro | 0 | 3 | 0 | 16 | 0 |
| components/Footer/Footer.astro | 4 | 2 | 0 | 3 | 0 |
| components/Grids/ForYouGrid.astro | 0 | 1 | 0 | 0 | 0 |
| components/Grids/RelatedGrid.astro | 4 | 4 | 0 | 3 | 0 |
| components/Insights/InsightContent.astro | 0 | 0 | 0 | 3 | 0 |
| components/Insights/InsightHeader.astro | 1 | 0 | 0 | 1 | 0 |
| components/Navigation/Breadcrumbs.astro | 0 | 0 | 0 | 2 | 0 |
| components/Presentation/AuthorCard.astro | 7 | 11 | 0 | 3 | 0 |
| components/Presentation/Sections/CalloutSection.astro | 1 | 0 | 0 | 1 | 0 |
| components/Presentation/Sections/CompareSection.astro | 1 | 0 | 0 | 2 | 0 |
| components/Presentation/Sections/EndSection.astro | 2 | 8 | 0 | 6 | 0 |
| components/Presentation/Sections/FullWidthSection.astro | 4 | 0 | 0 | 4 | 0 |
| components/Presentation/Sections/GallerySection.astro | 0 | 0 | 0 | 1 | 0 |
| components/Presentation/Sections/HeroSection.astro | 5 | 2 | 0 | 2 | 0 |
| components/Presentation/Sections/ImageTextSection.astro | 4 | 0 | 0 | 4 | 0 |
| components/Presentation/Sections/QuoteSection.astro | 0 | 6 | 0 | 2 | 0 |
| components/Presentation/Sections/StatsSection.astro | 0 | 0 | 0 | 5 | 0 |
| components/Presentation/Sections/TextSection.astro | 4 | 0 | 0 | 4 | 0 |
| components/Presentation/Sections/TitleSection.astro | 5 | 3 | 0 | 5 | 0 |
| components/Product/ProductInfo.astro | 3 | 1 | 0 | 2 | 0 |
| components/Search/SearchOverlay.astro | 4 | 3 | 0 | 8 | 0 |
| components/Sections/IntroTextSection.astro | 1 | 3 | 0 | 0 | 0 |
| components/Sections/ShareSection.astro | 0 | 2 | 0 | 3 | 0 |
| components/Sections/StorySection.astro | 0 | 0 | 0 | 4 | 0 |
| components/Shop/MiniCart.astro | 0 | 0 | 1 | 7 | 0 |
| components/Switcher/BaseSwitcher.astro | 0 | 0 | 0 | 5 | 0 |
| components/Typography/SectionTitle.astro | 11 | 2 | 0 | 0 | 0 |
| pages/checkout.astro | 0 | 0 | 0 | 2 | 0 |
| pages/search.astro | 14 | 28 | 7 | 15 | 0 |
| pages/services/[slug].astro | 7 | 9 | 0 | 9 | 0 |
| pages/showcase/section-titles.astro | 0 | 1 | 1 | 2 | 0 |
| pages/verify.astro | 2 | 1 | 0 | 1 | 0 |
| styles/a11y/base/screen-reader.css | 0 | 0 | 0 | 1 | 0 |
| styles/a11y/motion/reduced-motion.css | 0 | 0 | 0 | 4 | 0 |
| styles/a11y/visual/highlight-links.css | 0 | 0 | 0 | 2 | 0 |
| styles/a11y/visual/text-only.css | 8 | 6 | 2 | 10 | 0 |
| styles/buttons/basic-button.css | 0 | 0 | 0 | 3 | 0 |
| styles/components/announcement-ticker.css | 0 | 0 | 0 | 1 | 0 |
| styles/components/cart-icon.css | 0 | 0 | 0 | 3 | 0 |
| styles/components/cookie-banner.css | 0 | 0 | 0 | 1 | 0 |
| styles/components/cta-section.css | 2 | 1 | 0 | 8 | 0 |
| styles/components/editorial-layout.css | 0 | 0 | 1 | 5 | 0 |
| styles/components/hero-morph.css | 6 | 3 | 6 | 0 | 0 |
| styles/components/hero-section.css | 7 | 6 | 0 | 0 | 0 |
| styles/components/image-text-section.css | 5 | 1 | 0 | 0 | 0 |
| styles/components/masonry-card.css | 3 | 3 | 1 | 8 | 0 |
| styles/components/nav/GlassNav-base.css | 0 | 0 | 0 | 2 | 0 |
| styles/components/nav/GlassNav-expandable.css | 0 | 3 | 0 | 0 | 0 |
| styles/components/nav/GlassNav-mobile.css | 0 | 0 | 0 | 1 | 0 |
| styles/components/nav/GlassNav-responsive.css | 0 | 0 | 0 | 1 | 0 |
| styles/components/philosophy-flip-cards.css | 4 | 0 | 1 | 12 | 0 |
| styles/components/pillars-section.css | 0 | 6 | 3 | 0 | 0 |
| styles/components/presentation/ReaderNav.css | 0 | 0 | 2 | 6 | 0 |
| styles/components/presentation/sections.css | 0 | 0 | 2 | 17 | 0 |
| styles/components/product-gallery.css | 0 | 0 | 0 | 1 | 0 |
| styles/components/search-results.css | 1 | 4 | 0 | 0 | 0 |
| styles/components/toast.css | 0 | 0 | 0 | 3 | 0 |
| styles/components/values-section.css | 1 | 4 | 0 | 4 | 0 |
| styles/pages/about.css | 1 | 0 | 0 | 0 | 0 |
| styles/pages/asset-detail.css | 6 | 3 | 0 | 23 | 0 |
| styles/pages/assets.css | 0 | 0 | 3 | 4 | 0 |
| styles/pages/cart.css | 4 | 3 | 5 | 20 | 0 |
| styles/pages/checkout.css | 4 | 5 | 12 | 45 | 0 |
| styles/pages/legal.css | 3 | 0 | 1 | 2 | 0 |
| styles/pages/service-detail.css | 7 | 9 | 15 | 30 | 0 |
| styles/pages/services.css | 11 | 12 | 0 | 6 | 0 |
| styles/responsive/xs.css | 0 | 0 | 0 | 4 | 0 |
