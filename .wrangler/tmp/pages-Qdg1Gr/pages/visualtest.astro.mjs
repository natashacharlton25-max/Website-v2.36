globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, b as renderTemplate, d as addAttribute, r as renderComponent, e as renderScript } from '../chunks/astro/server_DSZs3x4S.mjs';
import { a as $$BaseLayout, b as $$Footer } from '../chunks/BaseLayout_RnOOHI6G.mjs';
/* empty css                                      */
import { $ as $$Image } from '../chunks/_astro_assets_KOHtTGSL.mjs';
import { b as offering1, a as offering2, o as offering3 } from '../chunks/offering-3-custom_BySgarBZ.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://yourdomain.com");
const $$StepCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$StepCard;
  const { number, title, text } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="card step-card" data-astro-cid-gluowe6n> <div class="step-card__number" data-astro-cid-gluowe6n>${number}</div> <h3 class="step-card__title" data-astro-cid-gluowe6n>${title}</h3> <p class="step-card__text" data-astro-cid-gluowe6n>${text}</p> </div> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/cards/StepCard.astro", void 0);

const $$Astro = createAstro("https://yourdomain.com");
const $$CompactToolCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CompactToolCard;
  const { href, name, category, description, image } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="card compact-tool-card" data-astro-cid-gn2nma6w> <div class="compact-image" data-astro-cid-gn2nma6w> ${renderComponent($$result, "Image", $$Image, { "src": image, "alt": name, "data-astro-cid-gn2nma6w": true })} </div> <div class="compact-content" data-astro-cid-gn2nma6w> <div class="compact-category" data-astro-cid-gn2nma6w>${category}</div> <h3 class="compact-title" data-astro-cid-gn2nma6w>${name}</h3> <p class="compact-description" data-astro-cid-gn2nma6w>${description}</p> <span class="compact-arrow" aria-hidden="true" data-astro-cid-gn2nma6w>→</span> </div> </a> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/cards/CompactToolCard.astro", void 0);

const $$Visualtest = createComponent(($$result, $$props, $$slots) => {
  const stepCardData = [
    {
      number: "1",
      title: "Initial Consultation",
      text: "We start by understanding your needs, goals, and the people you work with."
    },
    {
      number: "2",
      title: "Resource Selection",
      text: "Together we identify the most suitable resources and materials for your context."
    },
    {
      number: "3",
      title: "Implementation Support",
      text: "We provide guidance and training to help you integrate the resources effectively."
    }
  ];
  const compactToolData = [
    {
      href: "#",
      name: "Mindfulness Guide",
      category: "Wellbeing",
      description: "A comprehensive guide to mindfulness practices for daily life and emotional regulation.",
      image: offering1
    },
    {
      href: "#",
      name: "Communication Toolkit",
      category: "Skills",
      description: "Practical tools and techniques for effective communication in professional settings.",
      image: offering2
    },
    {
      href: "#",
      name: "Trauma-Informed Practice",
      category: "Training",
      description: "Essential frameworks and approaches for working with trauma-informed principles.",
      image: offering3
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Visual Test Page | Component Library", "description": "Visual testing page for unused and experimental components", "hideFooter": true, "data-astro-cid-omkgublt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="visualtest-page" data-astro-cid-omkgublt> <div class="container container-6xl" data-astro-cid-omkgublt> <header class="visualtest-header" data-astro-cid-omkgublt> <h1 data-astro-cid-omkgublt>Visual Component Library</h1> <p class="visualtest-subtitle" data-astro-cid-omkgublt>Testing page for unused and experimental components</p> </header> <!-- StepCard Section --> <section class="visualtest-section" data-astro-cid-omkgublt> <div class="section-header" data-astro-cid-omkgublt> <h2 data-astro-cid-omkgublt>StepCard Component</h2> <p class="section-description" data-astro-cid-omkgublt>
Numbered step cards with circular badges. Originally designed for services page,
            currently replaced by TimelineStepper component.
</p> <p class="component-location" data-astro-cid-omkgublt> <code data-astro-cid-omkgublt>src/components/Cards/StepCard.astro</code> </p> </div> <div class="step-card-grid" data-astro-cid-omkgublt> ${stepCardData.map((step) => renderTemplate`${renderComponent($$result2, "StepCard", $$StepCard, { "number": step.number, "title": step.title, "text": step.text, "data-astro-cid-omkgublt": true })}`)} </div> </section> <!-- CompactToolCard Section --> <section class="visualtest-section" data-astro-cid-omkgublt> <div class="section-header" data-astro-cid-omkgublt> <h2 data-astro-cid-omkgublt>CompactToolCard Component</h2> <p class="section-description" data-astro-cid-omkgublt>
Horizontal cards with small image thumbnails, category labels, and arrow indicators.
            Designed for compact tool/resource listings.
</p> <p class="component-location" data-astro-cid-omkgublt> <code data-astro-cid-omkgublt>src/components/Cards/CompactToolCard.astro</code> </p> </div> <div class="compact-tool-grid" data-astro-cid-omkgublt> ${compactToolData.map((tool) => renderTemplate`${renderComponent($$result2, "CompactToolCard", $$CompactToolCard, { "href": tool.href, "name": tool.name, "category": tool.category, "description": tool.description, "image": tool.image, "data-astro-cid-omkgublt": true })}`)} </div> </section> <!-- Toast Section --> <section class="visualtest-section" data-astro-cid-omkgublt> <div class="section-header" data-astro-cid-omkgublt> <h2 data-astro-cid-omkgublt>Toast Component</h2> <p class="section-description" data-astro-cid-omkgublt>
Toast notifications via <code data-astro-cid-omkgublt>showToast()</code> from <code data-astro-cid-omkgublt>src/lib/ui/toast.ts</code>.
            Lottie animations, 5 themes, 5 animation styles. Click toast to dismiss.
</p> <p class="component-location" data-astro-cid-omkgublt> <code data-astro-cid-omkgublt>src/lib/ui/toast.ts</code> + <code data-astro-cid-omkgublt>src/styles/components/toast.css</code> </p> </div> <h3 class="toast-group-title" data-astro-cid-omkgublt>Themes</h3> <div class="toast-btn-grid" data-astro-cid-omkgublt> <button class="toast-trigger" data-theme="arcade" data-animation="slide" data-message="Arcade theme — game on!" data-astro-cid-omkgublt>Arcade</button> <button class="toast-trigger" data-theme="professional" data-animation="slide" data-message="Professional theme — clean and polished" data-astro-cid-omkgublt>Professional</button> <button class="toast-trigger" data-theme="brutalist" data-animation="slide" data-message="Brutalist theme — raw and bold" data-astro-cid-omkgublt>Brutalist</button> <button class="toast-trigger" data-theme="glass" data-animation="slide" data-message="Glass theme — frosted elegance" data-astro-cid-omkgublt>Glass</button> <button class="toast-trigger" data-theme="neon" data-animation="slide" data-message="Neon theme — electric vibes" data-astro-cid-omkgublt>Neon</button> </div> <h3 class="toast-group-title" data-astro-cid-omkgublt>Animations</h3> <div class="toast-btn-grid" data-astro-cid-omkgublt> <button class="toast-trigger" data-theme="neon" data-animation="slide" data-message="Slide animation" data-astro-cid-omkgublt>Slide</button> <button class="toast-trigger" data-theme="neon" data-animation="bounce" data-message="Bounce animation" data-astro-cid-omkgublt>Bounce</button> <button class="toast-trigger" data-theme="neon" data-animation="fade" data-message="Fade animation" data-astro-cid-omkgublt>Fade</button> <button class="toast-trigger" data-theme="neon" data-animation="flip" data-message="Flip animation" data-astro-cid-omkgublt>Flip</button> <button class="toast-trigger" data-theme="neon" data-animation="zoom" data-message="Zoom animation" data-astro-cid-omkgublt>Zoom</button> </div> <h3 class="toast-group-title" data-astro-cid-omkgublt>Icon Types</h3> <div class="toast-btn-grid" data-astro-cid-omkgublt> <button class="toast-trigger" data-theme="professional" data-animation="slide" data-icon="alert" data-message="Preset: alert" data-astro-cid-omkgublt>Preset (alert)</button> <button class="toast-trigger" data-theme="professional" data-animation="slide" data-icon="thumbup" data-message="Preset: thumbup" data-astro-cid-omkgublt>Preset (thumbup)</button> <button class="toast-trigger" data-theme="professional" data-animation="slide" data-icon="/_Unused Images/9.jpg" data-message="Image icon from public" data-astro-cid-omkgublt>Image (JPG)</button> </div> </section> <footer class="visualtest-footer" data-astro-cid-omkgublt> <p data-astro-cid-omkgublt>
This page is for development and testing purposes only.
<br data-astro-cid-omkgublt>
Components shown here are functional but not currently used in production.
</p> </footer> </div> </div> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-omkgublt": true })} ` })}  ${renderScript($$result, "C:/Users/Business/Website v2.36/src/pages/visualtest.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/pages/visualtest.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/visualtest.astro";
const $$url = "/visualtest";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Visualtest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
