globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, e as renderScript, b as renderTemplate, r as renderComponent } from '../chunks/astro/server_DSZs3x4S.mjs';
import { e as $$Button, a as $$BaseLayout, b as $$Footer } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { g as getCollection } from '../chunks/_astro_content_D40xraF-.mjs';
import { $ as $$HeroSection } from '../chunks/HeroSection_Du39SrCP.mjs';
/* empty css                                    */
import { $ as $$Image } from '../chunks/_astro_assets_KOHtTGSL.mjs';
import { $ as $$CTASection } from '../chunks/CTASection_cLWB3XuA.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://yourdomain.com");
const $$ScrollColorBackground = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ScrollColorBackground;
  const { initialColor = "var(--brand-c-bg)" } = Astro2.props;
  return renderTemplate`<!-- Fixed background layer for scroll-triggered color changes -->${maybeRenderHead()}<div class="scroll-bg-layer" id="scroll-bg-layer"${addAttribute(initialColor, "data-initial-color")}></div> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/atoms/effects/ScrollColorBackground/ScrollColorBackground.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/effects/ScrollColorBackground/ScrollColorBackground.astro", void 0);

const $$Astro = createAstro("https://yourdomain.com");
const $$ProjectCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProjectCard;
  const {
    slug,
    title,
    description,
    category,
    cardImage,
    scrollBg,
    imagePosition = "left"
  } = Astro2.props;
  const layoutClass = imagePosition === "left" ? "image-left" : "image-right";
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(`card project-card ${layoutClass}`, "class")}${addAttribute(scrollBg, "data-scroll-bg")} data-astro-cid-zuht3fqs> <div class="container" data-astro-cid-zuht3fqs> <div class="project-card__wrapper" data-astro-cid-zuht3fqs> <div class="img-defaut project-card__image" data-astro-cid-zuht3fqs> ${renderComponent($$result, "Image", $$Image, { "src": cardImage, "alt": title, "loading": "lazy", "data-astro-cid-zuht3fqs": true })} </div> <div class="card-transparent project-card__content" data-astro-cid-zuht3fqs> <small class="project-card__category" data-astro-cid-zuht3fqs>${category}</small> <h2 class="project-card__title" data-astro-cid-zuht3fqs>${title}</h2> <p class="project-card__description" data-astro-cid-zuht3fqs>${description}</p> <div class="project-card__cta" data-astro-cid-zuht3fqs> ${renderComponent($$result, "Button", $$Button, { "href": `/projects/${slug}`, "variant": "primary", "data-astro-cid-zuht3fqs": true }, { "default": ($$result2) => renderTemplate`
View Project
` })} </div> </div> </div> </div> </section> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/cards/ProjectCard.astro", void 0);

const title$1 = "Projects";
const subtitle = "Sometimes what you need isn't just one resource. It's a collection that works together. Each project here is a carefully curated set of tools for a specific purpose: wellbeing, sensory needs, creative expression. Everything here is free. Take what helps. Leave the rest.";
const variant = "simple";
const heroDataRaw = {
  title: title$1,
  subtitle,
  variant,
};

const title = "A note about these projects";
const description = ["Each project is a curated collection: resources that work together for a specific purpose. We've put them together to save you time and energy. You can download individual resources from each project, or add them all to your basket at once. Use what fits. Skip what doesn't.","If you're a professional (educator, therapist, practitioner), each project includes a separate section with guidance notes, implementation strategies, and evidence-based information."];
const buttons = [{"text":"Browse Individual Resources","href":"/assets","variant":"secondary"}];
const infoDataRaw = {
  title,
  description,
  buttons,
};

const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const heroData = heroDataRaw;
  const infoData = infoDataRaw;
  const ctaData = {
    title: infoData.title,
    description: infoData.description,
    buttons: infoData.buttons
  };
  const getSlug = (id) => {
    const normalized = id.replace(/[\\/]index\.md$/, "");
    return normalized.split(/[\\/]/).pop() || id;
  };
  const projectEntries = await getCollection("projects");
  const projects = projectEntries.map((entry) => ({
    slug: getSlug(entry.id),
    ...entry.data
  }));
  const scrollColors = [
    "var(--brand-c-neutral-light)",
    "var(--brand-c-neutral)",
    "var(--brand-c-neutral-light)"
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Projects | Walking With A Smile", "description": "Free curated resource collections. Each project brings together carefully selected resources for a specific purpose, available to everyone.", "hideFooter": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "ScrollColorBackground", $$ScrollColorBackground, {})}  ${maybeRenderHead()}<div data-scroll-bg="var(--brand-c-bg)"> ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": heroData.title, "subtitle": heroData.subtitle, "extraText": heroData.extraText, "variant": heroData.variant })} </div>  ${projects.map((project, index) => {
    const scrollBg = scrollColors[index % scrollColors.length];
    const imagePosition = index % 2 === 0 ? "left" : "right";
    return renderTemplate`${renderComponent($$result2, "ProjectCard", $$ProjectCard, { "slug": project.slug, "title": project.title, "description": project.description, "category": project.category, "cardImage": project.cardImage, "scrollBg": scrollBg, "imagePosition": imagePosition })}`;
  })} ${renderComponent($$result2, "CTASection", $$CTASection, { "title": ctaData.title, "description": ctaData.description, "buttons": ctaData.buttons })}  ${renderComponent($$result2, "Footer", $$Footer, { "animated": true })} ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/projects.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/projects.astro";
const $$url = "/projects";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Projects,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
