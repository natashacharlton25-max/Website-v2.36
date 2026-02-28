globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, f as renderSlot, b as renderTemplate, r as renderComponent, u as unescapeHTML } from './astro/server_DSZs3x4S.mjs';
import { $ as $$Image } from './_astro_assets_KOHtTGSL.mjs';
import { e as $$Button } from './BaseLayout_RnOOHI6G.mjs';

const $$Astro = createAstro("https://yourdomain.com");
const $$HeroSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HeroSection;
  const {
    title,
    subtitle,
    description,
    extraText,
    lead,
    subtitles = [],
    category,
    date,
    readingTime,
    image,
    imageAlt = "",
    imagePosition = "full",
    overlayOpacity = 0.6,
    variant = "simple",
    gradient = "hero",
    alignment = "left",
    containerSize = "6xl",
    pattern = false,
    buttons = []
  } = Astro2.props;
  const alignmentClass = alignment === "center" ? "hero-section--centered" : "";
  const patternClass = pattern ? "hero-section--pattern" : "";
  const hasImage = !!image;
  const isAstroImage = hasImage && typeof image !== "string";
  const hasActions = buttons.length > 0;
  const hasMeta = !!(category || date || readingTime);
  return renderTemplate`${variant === "intro" ? renderTemplate`${maybeRenderHead()}<section${addAttribute(`hero-section hero-section--intro ${alignmentClass}`, "class")}><div class="container"><div class="hero-section__intro-content">${lead && renderTemplate`<p class="hero-section__lead">${lead}</p>`}${subtitles.map((sub) => renderTemplate`<p class="hero-section__intro-subtitle">${sub}</p>`)}${renderSlot($$result, $$slots["default"])}</div></div></section>` : variant === "presentation" ? (
    /* ============================================================
       PRESENTATION VARIANT — full viewport title slide
       ============================================================ */
    renderTemplate`<section${addAttribute(`hero-section hero-section--presentation ${hasImage ? "hero-section--has-image" : ""} ${alignmentClass}`, "class")}>${hasImage && renderTemplate`<div class="hero-section__pres-image-wrapper">${isAstroImage ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": image, "alt": imageAlt, "class": "hero-section__pres-image" })}` : renderTemplate`<img${addAttribute(image, "src")}${addAttribute(imageAlt, "alt")} class="hero-section__pres-image">`}<div class="hero-section__pres-overlay"${addAttribute(`--overlay-opacity: ${overlayOpacity}`, "style")}></div></div>`}<div class="hero-section__pres-content">${hasMeta && renderTemplate`<div class="hero-section__meta">${category && renderTemplate`<span class="hero-section__category">${category}</span>`}${date && renderTemplate`<span class="hero-section__date">${date}</span>`}${readingTime && renderTemplate`<span class="hero-section__reading-time"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>${readingTime} min read
</span>`}</div>`}${title && renderTemplate`<h1 class="hero-section__pres-title">${unescapeHTML(title)}</h1>`}${description && renderTemplate`<p class="hero-section__pres-description">${description}</p>`}${hasActions && renderTemplate`<div class="hero-section__buttons">${buttons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": button.href, "variant": button.variant || "primary" }, { "default": ($$result2) => renderTemplate`${button.text}` })}`)}</div>`}${renderSlot($$result, $$slots["default"])}</div>${!hasImage && renderTemplate`<div class="hero-section__decor" aria-hidden="true"><div class="hero-section__circle hero-section__circle--1"></div><div class="hero-section__circle hero-section__circle--2"></div></div>`}</section>`
  ) : variant === "image" && hasImage && imagePosition === "full" ? (
    /* ============================================================
       IMAGE VARIANT — full-width background image with overlay
       ============================================================ */
    renderTemplate`<section${addAttribute(`hero-section hero-section--image ${alignmentClass} ${patternClass}`, "class")}><div class="hero-section__image-wrapper">${isAstroImage ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": image, "alt": imageAlt, "class": "hero-section__image" })}` : renderTemplate`<img${addAttribute(image, "src")}${addAttribute(imageAlt, "alt")} class="hero-section__image">`}<div class="hero-section__overlay"${addAttribute(`--overlay-opacity: ${overlayOpacity}`, "style")}></div><div class="hero-section__fade"></div><div class="container"><div class="hero-section__content"><h1 class="hero-section__title">${unescapeHTML(title)}</h1>${subtitle && renderTemplate`<p class="hero-section__subtitle">${subtitle}</p>`}${description && renderTemplate`<p class="hero-section__description">${description}</p>`}${extraText && renderTemplate`<p class="hero-section__extra">${extraText}</p>`}${hasActions && renderTemplate`<div class="hero-section__buttons">${buttons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": button.href, "variant": button.variant || "primary" }, { "default": ($$result2) => renderTemplate`${button.text}` })}`)}</div>`}${renderSlot($$result, $$slots["default"])}</div></div></div></section>`
  ) : variant === "image" && hasImage && (imagePosition === "left" || imagePosition === "right") ? (
    /* ============================================================
       IMAGE VARIANT — split layout with image left or right
       ============================================================ */
    renderTemplate`<section${addAttribute(`hero-section hero-section--image-split hero-section--image-${imagePosition} ${patternClass}`, "class")}><div class="container"><div class="hero-section__split-wrapper"><div class="hero-section__split-image">${isAstroImage ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": image, "alt": imageAlt, "class": "hero-section__image" })}` : renderTemplate`<img${addAttribute(image, "src")}${addAttribute(imageAlt, "alt")} class="hero-section__image">`}</div><div class="hero-section__split-content"><h1 class="hero-section__title">${unescapeHTML(title)}</h1>${subtitle && renderTemplate`<p class="hero-section__subtitle">${subtitle}</p>`}${description && renderTemplate`<p class="hero-section__description">${description}</p>`}${extraText && renderTemplate`<p class="hero-section__extra">${extraText}</p>`}${hasActions && renderTemplate`<div class="hero-section__buttons">${buttons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": button.href, "variant": button.variant || "primary" }, { "default": ($$result2) => renderTemplate`${button.text}` })}`)}</div>`}${renderSlot($$result, $$slots["default"])}</div></div></div></section>`
  ) : variant === "gradient" ? (
    /* ============================================================
       GRADIENT VARIANT — gradient background
       ============================================================ */
    renderTemplate`<section${addAttribute(`hero-section hero-section--gradient hero-section--gradient-${gradient} ${alignmentClass} ${patternClass}`, "class")}><div class="container"><div class="hero-section__content"><h1 class="hero-section__title">${unescapeHTML(title)}</h1>${subtitle && renderTemplate`<p class="hero-section__subtitle">${subtitle}</p>`}${description && renderTemplate`<p class="hero-section__description">${description}</p>`}${extraText && renderTemplate`<p class="hero-section__extra">${extraText}</p>`}${hasActions && renderTemplate`<div class="hero-section__buttons">${buttons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": button.href, "variant": button.variant || "primary" }, { "default": ($$result2) => renderTemplate`${button.text}` })}`)}</div>`}${renderSlot($$result, $$slots["default"])}</div></div></section>`
  ) : (
    /* ============================================================
       SIMPLE VARIANT — plain background (default)
       ============================================================ */
    renderTemplate`<section${addAttribute(`hero-section hero-section--simple ${alignmentClass} ${patternClass}`, "class")}><div class="container"><div class="hero-section__content"><h1 class="hero-section__title">${unescapeHTML(title)}</h1>${subtitle && renderTemplate`<p class="hero-section__subtitle">${subtitle}</p>`}${description && renderTemplate`<p class="hero-section__description">${description}</p>`}${extraText && renderTemplate`<p class="hero-section__extra">${extraText}</p>`}${hasActions && renderTemplate`<div class="hero-section__buttons">${buttons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": button.href, "variant": button.variant || "primary" }, { "default": ($$result2) => renderTemplate`${button.text}` })}`)}</div>`}${renderSlot($$result, $$slots["default"])}</div></div></section>`
  )}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/HeroSection/HeroSection.astro", void 0);

export { $$HeroSection as $ };
