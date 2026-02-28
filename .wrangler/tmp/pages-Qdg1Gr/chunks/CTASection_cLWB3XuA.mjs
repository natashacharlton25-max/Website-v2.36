globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, f as renderSlot, b as renderTemplate, r as renderComponent, u as unescapeHTML } from './astro/server_DSZs3x4S.mjs';
import { e as $$Button } from './BaseLayout_RnOOHI6G.mjs';

const $$Astro = createAstro("https://yourdomain.com");
const $$CTASection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CTASection;
  const {
    title,
    description,
    buttons,
    trustSignals = [],
    alignment
  } = Astro2.props;
  const sectionClass = alignment ? `cta-section cta-section--${alignment} section` : "cta-section section";
  const descriptionArray = Array.isArray(description) ? description : description ? [description] : [];
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(sectionClass, "class")}> <div class="container"> <h2 class="cta-section__title">${title}</h2> ${descriptionArray.length > 0 && renderTemplate`<div class="cta-section__body"> ${descriptionArray.map((text) => renderTemplate`<p>${text}</p>`)} </div>`} ${renderSlot($$result, $$slots["default"])} <div class="cta-section__buttons"> ${buttons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": button.href, "variant": button.variant || "primary" }, { "default": ($$result2) => renderTemplate`${button.text}` })}`)} </div> ${trustSignals.length > 0 && renderTemplate`<div class="cta-section__trust-signals"> ${trustSignals.map((signal) => renderTemplate`<div class="cta-section__trust-signal"> <div class="cta-section__trust-icon">${unescapeHTML(signal.icon)}</div> <p class="cta-section__trust-text"> <strong>${signal.value}</strong> <span>${signal.label}</span> </p> </div>`)} </div>`} </div> </section> <!-- Styles in: src/styles/components/cta-section.css -->`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/CTASection.astro", void 0);

export { $$CTASection as $ };
