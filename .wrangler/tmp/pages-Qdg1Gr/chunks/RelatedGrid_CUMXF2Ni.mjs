globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, b as renderTemplate } from './astro/server_DSZs3x4S.mjs';
import { $ as $$Image } from './_astro_assets_KOHtTGSL.mjs';
import { e as $$Button } from './BaseLayout_RnOOHI6G.mjs';
import { $ as $$SectionTitle } from './SectionTitle_BlcI-eK5.mjs';
/* empty css                          */

const $$Astro = createAstro("https://yourdomain.com");
const $$RelatedGrid = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$RelatedGrid;
  const {
    items,
    contentType = "posts",
    title,
    basePath = "",
    columns = "auto",
    cardStyle = "vertical",
    background = "default",
    containerSize = "6xl",
    class: className,
    useSectionTitle = false,
    sectionTitleIcon,
    sectionTitleVariant = "underline",
    sectionTitleDividerColor = "primary",
    sectionTitleIconColor = "primary",
    sectionTitleIconStyle = "bare"
  } = Astro2.props;
  if (!items || items.length === 0) return null;
  const getItemUrl = (item) => {
    if (item.url) return item.url;
    if (item.slug && basePath) return `${basePath}/${item.slug}`;
    return "#";
  };
  const getItemTitle = (item) => {
    return item.name || item.title;
  };
  const getButtonText = (item) => {
    if (item.type) return "View Resource";
    return "Read more";
  };
  const sectionClasses = [
    "related-grid-section",
    `related-grid-section--bg-${background}`,
    className
  ].filter(Boolean);
  const gridClasses = [
    "related-grid",
    `related-grid--cols-${columns}`,
    `related-grid--${cardStyle}`
  ];
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(sectionClasses, "class:list")} data-astro-cid-g5zyw5vc> <div${addAttribute(`container container-${containerSize}`, "class")} data-astro-cid-g5zyw5vc> ${title && (useSectionTitle ? renderTemplate`<div class="related-grid__title-wrapper" data-astro-cid-g5zyw5vc> ${renderComponent($$result, "SectionTitle", $$SectionTitle, { "title": title, "size": "lg", "align": "center", "variant": sectionTitleVariant, "dividerColor": sectionTitleDividerColor, "icon": sectionTitleIcon, "iconColor": sectionTitleIconColor, "iconStyle": sectionTitleIconStyle, "underlineStyle": "gradient", "data-astro-cid-g5zyw5vc": true })} </div>` : renderTemplate`<h2 class="related-grid__title" data-astro-cid-g5zyw5vc>${title}</h2>`)} <div${addAttribute(gridClasses, "class:list")} data-astro-cid-g5zyw5vc> ${items.map((item) => renderTemplate`<a${addAttribute(getItemUrl(item), "href")}${addAttribute(`card related-card related-card--${cardStyle}`, "class")} data-astro-cid-g5zyw5vc>  ${item.cardImage && cardStyle !== "minimal" && renderTemplate`<div class="related-card__image" data-astro-cid-g5zyw5vc> ${renderComponent($$result, "Image", $$Image, { "src": item.cardImage, "alt": getItemTitle(item), "width": cardStyle === "featured" ? 600 : cardStyle === "horizontal" ? 440 : 400, "height": cardStyle === "featured" ? 450 : cardStyle === "horizontal" ? 480 : 225, "data-astro-cid-g5zyw5vc": true })} </div>`}  ${!item.cardImage && (cardStyle === "horizontal" || cardStyle === "featured") && renderTemplate`<div class="related-card__icon-placeholder" data-astro-cid-g5zyw5vc> <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" data-astro-cid-g5zyw5vc> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-g5zyw5vc></path> <polyline points="14 2 14 8 20 8" data-astro-cid-g5zyw5vc></polyline> <line x1="16" y1="13" x2="8" y2="13" data-astro-cid-g5zyw5vc></line> <line x1="16" y1="17" x2="8" y2="17" data-astro-cid-g5zyw5vc></line> <polyline points="10 9 9 9 8 9" data-astro-cid-g5zyw5vc></polyline> </svg> </div>`} <div class="related-card__content" data-astro-cid-g5zyw5vc>  ${cardStyle === "horizontal" && renderTemplate`<small class="related-card__badge" data-astro-cid-g5zyw5vc>FOR YOU</small>`}  <h3 class="related-card__title" data-astro-cid-g5zyw5vc>${getItemTitle(item)}</h3>  ${item.description && renderTemplate`<p class="related-card__description" data-astro-cid-g5zyw5vc>${item.description}</p>`}  ${cardStyle === "horizontal" && renderTemplate`${renderComponent($$result, "Button", $$Button, { "variant": "neutral", "size": "sm", "data-astro-cid-g5zyw5vc": true }, { "default": ($$result2) => renderTemplate`Explore` })}`} ${cardStyle === "featured" && renderTemplate`${renderComponent($$result, "Button", $$Button, { "variant": "secondary", "size": "md", "class": "featured-btn", "data-astro-cid-g5zyw5vc": true }, { "default": ($$result2) => renderTemplate`Learn More` })}`} ${cardStyle !== "horizontal" && cardStyle !== "featured" && renderTemplate`<span class="related-card__button" data-astro-cid-g5zyw5vc>${getButtonText(item)}</span>`} </div> </a>`)} </div> </div> </section> `;
}, "C:/Users/Business/Website v2.36/src/components/organisms/grids/RelatedGrid.astro", void 0);

export { $$RelatedGrid as $ };
