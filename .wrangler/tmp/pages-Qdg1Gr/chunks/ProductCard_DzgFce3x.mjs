globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, e as renderScript, b as renderTemplate } from './astro/server_DSZs3x4S.mjs';
import { $ as $$Image } from './_astro_assets_KOHtTGSL.mjs';
import { $ as $$Badge } from './Badge_DvOoDIg_.mjs';
import { e as $$Button } from './BaseLayout_RnOOHI6G.mjs';
/* empty css                          */

const $$Astro = createAstro("https://yourdomain.com");
const $$ProductCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProductCard;
  const {
    slug,
    name,
    category,
    description,
    cardImage,
    type,
    price = "Free"
  } = Astro2.props;
  const hasImage = cardImage !== void 0;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/assets/${slug}`, "href")}${addAttribute(`product-card card ${type}`, "class")}${addAttribute(type, "data-type")} data-astro-cid-nrlc6q2k> <div class="img-default product-card__image" data-astro-cid-nrlc6q2k> ${hasImage ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": cardImage, "alt": name, "width": 800, "height": 500, "data-astro-cid-nrlc6q2k": true })}` : renderTemplate`<div class="product-card__placeholder" data-astro-cid-nrlc6q2k> <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" data-astro-cid-nrlc6q2k> <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-nrlc6q2k></path> <polyline points="14 2 14 8 20 8" data-astro-cid-nrlc6q2k></polyline> <line x1="16" y1="13" x2="8" y2="13" data-astro-cid-nrlc6q2k></line> <line x1="16" y1="17" x2="8" y2="17" data-astro-cid-nrlc6q2k></line> <polyline points="10 9 9 9 8 9" data-astro-cid-nrlc6q2k></polyline> </svg> </div>`} </div> <div class="product-card__info" data-astro-cid-nrlc6q2k> <small class="product-card__badge" data-astro-cid-nrlc6q2k> ${renderComponent($$result, "Badge", $$Badge, { "label": type, "shape": "rounded", "variant": "fill", "data-astro-cid-nrlc6q2k": true })} </small> <small class="product-card__category" data-astro-cid-nrlc6q2k>${category}</small> <h3 class="product-card__name" data-astro-cid-nrlc6q2k>${name}</h3> <p class="product-card__description" data-astro-cid-nrlc6q2k>${description}</p> <div class="product-card__footer" data-astro-cid-nrlc6q2k> <div class="product-card__price" data-astro-cid-nrlc6q2k> <span class="price-current" data-astro-cid-nrlc6q2k>${price}</span> </div> <div class="product-card__cta" data-astro-cid-nrlc6q2k> ${renderComponent($$result, "Button", $$Button, { "variant": "primary", "size": "sm", "className": "js-add-to-cart", "data-product-id": slug, "data-product-name": name, "data-product-price": "0", "data-product-image": hasImage ? cardImage.src : "", "aria-label": "Add to cart", "data-astro-cid-nrlc6q2k": true }, { "default": ($$result2) => renderTemplate` <p class="add-to-cart-text" data-astro-cid-nrlc6q2k>Add to Cart</p> <span class="add-to-cart-icon" data-astro-cid-nrlc6q2k>+</span> ` })} </div> </div> </div> </a> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/molecules/cards/ProductCard.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/cards/ProductCard.astro", void 0);

export { $$ProductCard as $ };
