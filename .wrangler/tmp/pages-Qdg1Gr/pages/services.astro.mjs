globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, u as unescapeHTML, b as renderTemplate, r as renderComponent } from '../chunks/astro/server_DSZs3x4S.mjs';
import { a as $$BaseLayout, b as $$Footer } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { $ as $$HeroSection } from '../chunks/HeroSection_Du39SrCP.mjs';
import { $ as $$CTASection } from '../chunks/CTASection_cLWB3XuA.mjs';
import { $ as $$RelatedGrid } from '../chunks/RelatedGrid_CUMXF2Ni.mjs';
/* empty css                                    */
import { a as offeringsDataRaw, o as offering4, $ as $$TimelineStepper } from '../chunks/offerings_CM_tOMFH.mjs';
import { b as offering1, a as offering2, o as offering3 } from '../chunks/offering-3-custom_BySgarBZ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://yourdomain.com");
const $$WhyCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$WhyCard;
  const { title, text, badge, icon, variant } = Astro2.props;
  const icons = {
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    handshake: '<path d="M11 17a1 1 0 0 1-.447-.105L7 15.118l-3.553 1.777a1 1 0 0 1-1.447-.894V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1z"/><path d="M21 17a1 1 0 0 1-.447-.105L17 15.118l-3.553 1.777A1 1 0 0 1 12 16V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11a1 1 0 0 1-1 1z"/>'
  };
  const cardClass = variant ? `why-card why-card--${variant}` : "why-card";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(cardClass, "class")} data-astro-cid-ew3vu335> ${badge && renderTemplate`<div class="why-card__badge" data-astro-cid-ew3vu335> ${icon && icons[icon] && renderTemplate`<svg class="why-card__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-ew3vu335>${unescapeHTML(icons[icon])}</svg>`} <span class="why-card__badge-text" data-astro-cid-ew3vu335>${badge}</span> </div>`} <h3 class="why-card__title" data-astro-cid-ew3vu335>${title}</h3> <p class="why-card__text" data-astro-cid-ew3vu335>${text}</p> </div> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/cards/WhyCard.astro", void 0);

const title$1 = "Services for you";
const subtitle = "Walking with a Smile offers practical, trauma-informed resources designed for professionals who share our values: empowerment over dependency, choice over prescription, and tools that work in real life.";
const description$1 = "Whether you're looking for ready-made resources, something tailored to your practice, or materials you can offer under your own brand, we can help.";
const variant = "simple";
const heroDataRaw = {
  title: title$1,
  subtitle,
  description: description$1,
  variant,
};

const reasons = [{"title":"We understand the work you do.","text":"Our resources are built from lived experience and grounded in what actually helps. We know that the people you support benefit from tools that respect their autonomy, meet them where they are, and work in the context of real, complicated lives.","badge":"Lived Experience","icon":"heart"},{"title":"We keep it practical.","text":"Accessible language and real-world application. Everything we create is designed to be used, to feel approachable, and to support genuine progress.","badge":"Real World","icon":"tool"},{"title":"We respect your expertise.","text":"You know your clients. We provide materials that support your work and complement your judgement. Our role is to save you time and offer quality resources, while you remain the expert in the room.","badge":"Your Lead","icon":"star"},{"title":"We share your values.","text":"Empowerment. Choice. Agency. Dignity. If these matter to you, we're aligned.","badge":"Aligned Values","icon":"handshake"}];
const whyDataRaw = {
  reasons,
};

const steps = [{"number":"1","title":"Get in Touch","text":"Tell us what you're looking for. Whether it's a specific resource type, a theme, or a broader need, we'd love to hear about your work and the people you support."},{"number":"2","title":"Explore Options","text":"We'll share what's available and discuss what might work best for your practice. If custom development makes sense, we'll scope it out together."},{"number":"3","title":"Receive and Use","text":"You receive professionally designed, ready-to-use materials. Use them directly, adapt them for your context, or integrate them into your existing programmes."},{"number":"4","title":"Ongoing Support","text":"We're here if you need additional resources, want to expand a collection, or have feedback on how things are working. This is a relationship, and we value the professionals who choose to work with us."}];
const howItWorksDataRaw = {
  steps,
};

const title = "Let's Talk";
const description = "Whether you have a clear idea of what you need or just want to explore the possibilities, we'd love to hear from you.";
const footer = "Walking with a Smile works with individuals, businesses and professionals across the UK and beyond. All resources are designed to support those who have experienced trauma in moving from survival to self-directed, valued lives.";
const buttons = [{"text":"Contact Us","href":"/contact","variant":"primary"},{"text":"Browse Resources","href":"/assets","variant":"secondary"}];
const ctaDataRaw = {
  title,
  description,
  footer,
  buttons,
};

const $$Services = createComponent(($$result, $$props, $$slots) => {
  const heroData = heroDataRaw;
  const offeringsData = offeringsDataRaw;
  const whyData = whyDataRaw;
  const howItWorksData = howItWorksDataRaw;
  const ctaData = ctaDataRaw;
  const offeringImages = [offering1, offering2, offering3, offering4];
  const offeringsForGrid = offeringsData.map((offering, index) => ({
    slug: offering.slug,
    title: offering.title,
    description: offering.description,
    cardImage: offeringImages[index]
  }));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Services for Professionals | Walking With A Smile", "description": "Quality resources to support the people you work with. Practical, trauma-informed tools for professionals who share our values.", "hideFooter": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": heroData.title, "subtitle": heroData.subtitle, "description": heroData.description, "variant": heroData.variant })}  ${maybeRenderHead()}<section class="why-section section"> <div class="container"> <div class="why-grid"> ${whyData.reasons.map((reason) => renderTemplate`${renderComponent($$result2, "WhyCard", $$WhyCard, { "title": reason.title, "text": reason.text, "badge": reason.badge, "icon": reason.icon, "variant": "flat" })}`)} </div> </div> </section>  ${renderComponent($$result2, "RelatedGrid", $$RelatedGrid, { "items": offeringsForGrid, "contentType": "products", "title": "Our Services", "basePath": "/services", "cardStyle": "horizontal", "columns": "1", "background": "light", "containerSize": "6xl", "class": "services-offerings", "useSectionTitle": true, "sectionTitleVariant": "default", "sectionTitleIcon": "hand-heart-fill", "sectionTitleDividerColor": "primary", "sectionTitleIconColor": "primary", "sectionTitleIconStyle": "bare" })}  ${renderComponent($$result2, "CTASection", $$CTASection, { "title": ctaData.title, "description": ctaData.description, "buttons": ctaData.buttons, "alignment": "center" }, { "default": ($$result3) => renderTemplate` <p class="cta-footer">${ctaData.footer}</p> ` })}  <section class="how-section section"> <div class="container"> ${renderComponent($$result2, "TimelineStepper", $$TimelineStepper, { "steps": howItWorksData.steps })} </div> </section>  ${renderComponent($$result2, "Footer", $$Footer, { "animated": true })} ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/services.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/services.astro";
const $$url = "/services";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Services,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
