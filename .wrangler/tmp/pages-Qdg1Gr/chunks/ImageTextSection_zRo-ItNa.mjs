globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, f as renderSlot, r as renderComponent, b as renderTemplate, u as unescapeHTML } from './astro/server_DSZs3x4S.mjs';
import { $ as $$Image } from './_astro_assets_KOHtTGSL.mjs';
import { e as $$Button } from './BaseLayout_RnOOHI6G.mjs';
import { $ as $$SectionTitle } from './SectionTitle_BlcI-eK5.mjs';

const $$Astro = createAstro("https://yourdomain.com");
const $$ImageTextSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ImageTextSection;
  const {
    title,
    content = [],
    image,
    imageAlt,
    imagePosition = "left",
    ctaText,
    ctaHref,
    sectionId,
    useSectionTitle = false,
    sectionTitleVariant = "default"
  } = Astro2.props;
  const isImageMetadata = typeof image !== "string";
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(sectionId, "id")} class="image-text-section section"> <div class="container"> <div${addAttribute(`image-text-section__layout ${imagePosition === "right" ? "image-text-section__layout--reverse" : ""}`, "class")}> <!-- Image --> <div class="img-default image-text-section__image"> ${isImageMetadata ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": image, "alt": imageAlt, "class": "img-default img-responsive" })}` : renderTemplate`<img${addAttribute(image, "src")}${addAttribute(imageAlt, "alt")} class="img-default img-responsive">`} </div> <!-- Text Content --> <div class="image-text-section__content"> ${useSectionTitle ? renderTemplate`${renderComponent($$result, "SectionTitle", $$SectionTitle, { "title": title, "size": "lg", "variant": sectionTitleVariant, "dividerColor": "primary" })}` : renderTemplate`<h2 class="image-text-section__title">${title}</h2>`} ${content.length > 0 && renderTemplate`<div class="image-text-section__body"> ${content.map((paragraph) => renderTemplate`<p>${unescapeHTML(paragraph)}</p>`)} </div>`} ${renderSlot($$result, $$slots["default"])} ${ctaText && ctaHref && renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": ctaHref, "variant": "primary" }, { "default": ($$result2) => renderTemplate`${ctaText}` })}`} </div> </div> </div> </section> <!-- Styles in: src/styles/components/image-text-section.css -->`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/ImageTextSection.astro", void 0);

export { $$ImageTextSection as $ };
