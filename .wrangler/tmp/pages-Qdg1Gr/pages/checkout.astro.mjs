globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, f as renderSlot, b as renderTemplate, r as renderComponent, e as renderScript, F as Fragment } from '../chunks/astro/server_DSZs3x4S.mjs';
import { e as $$Button, a as $$BaseLayout } from '../chunks/BaseLayout_RnOOHI6G.mjs';
/* empty css                                    */
import { $ as $$Badge } from '../chunks/Badge_DvOoDIg_.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://yourdomain.com");
const $$CheckoutLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$CheckoutLayout;
  const { title = "Checkout Your Items" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="checkout-section section" data-astro-cid-pd3fick7> <div class="container container-7xl" data-astro-cid-pd3fick7> <div class="checkout-trust-header" data-astro-cid-pd3fick7> ${renderSlot($$result, $$slots["trust"])} </div> <div class="checkout-header" data-astro-cid-pd3fick7> <h1 class="checkout-title" data-astro-cid-pd3fick7>${title}</h1> </div> <div class="checkout-content" data-astro-cid-pd3fick7> <div class="checkout-forms" data-astro-cid-pd3fick7> <div class="card checkout-card" data-astro-cid-pd3fick7> ${renderSlot($$result, $$slots["form"])} </div> </div> <div class="order-summary-container" data-astro-cid-pd3fick7> <div class="card checkout-card checkout-card--summary" data-astro-cid-pd3fick7> ${renderSlot($$result, $$slots["summary"])} </div> </div> </div> </div> </section> `;
}, "C:/Users/Business/Website v2.36/src/layouts/CheckoutLayout.astro", void 0);

const $$Astro = createAstro("https://yourdomain.com");
const $$DownloadSummary = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DownloadSummary;
  const {
    emptyMessage = "No downloads selected",
    browseHref = "/assets",
    browseText = "Browse Resources"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="download-summary"> <div id="order-items" class="download-summary__items"> <!-- Items will be populated from cart --> <div class="download-summary__empty"> <p>${emptyMessage}</p> ${renderComponent($$result, "Button", $$Button, { "href": browseHref, "variant": "outline", "size": "sm" }, { "default": ($$result2) => renderTemplate`${browseText}` })} </div> </div> </div> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/molecules/checkout/DownloadSummary.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/checkout/DownloadSummary.astro", void 0);

const $$Checkout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Checkout | Walking with a Smile", "description": "Sign up to get your free downloads" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CheckoutLayout", $$CheckoutLayout, {}, { "form": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "form" }, { "default": ($$result4) => renderTemplate` ${maybeRenderHead()}<form id="newsletter-form" class="checkout-form"> <div class="form-row"> <div class="form-group"> <label for="firstName" class="form-label">First Name *</label> <input type="text" id="firstName" name="firstName" class="form-input" placeholder="Your first name" required> </div> <div class="form-group"> <label for="lastName" class="form-label">Last Name *</label> <input type="text" id="lastName" name="lastName" class="form-input" placeholder="Your last name" required> </div> </div> <div class="form-group"> <label for="email" class="form-label">Email Address *</label> <input type="email" id="email" name="email" class="form-input" placeholder="you@example.com" required> <p class="form-hint">We'll send your download links to this email</p> </div> <div class="form-group"> <label class="checkbox-label"> <input type="checkbox" id="newsletter" name="newsletter" checked> <span>Yes, I'd like to receive updates and resources from Walking with a Smile</span> </label> </div> <!-- Submit Button --> <div class="checkout-actions"> ${renderComponent($$result4, "Button", $$Button, { "type": "submit", "variant": "primary", "size": "lg", "class": "btn-block", "id": "submit-button" }, { "default": ($$result5) => renderTemplate` <span id="button-text">Get My Downloads</span> <span id="button-spinner" style="display: none;">Processing...</span> ` })} </div> </form> <div class="checkout-footer"> <div class="checkout-info"> <span>All resources are free. No credit card required.</span> </div> <p class="checkout-terms">
By submitting, you agree to our
<a href="/legal/terms">Terms of Service</a> and
<a href="/legal/privacy">Privacy Policy</a> </p> </div> ` })}`, "summary": ($$result3) => renderTemplate`${renderComponent($$result3, "DownloadSummary", $$DownloadSummary, { "slot": "summary" })}`, "trust": ($$result3) => renderTemplate`<div style="display: flex; gap: var(--space-sm); justify-content: center; flex-wrap: wrap;"> ${renderComponent($$result3, "Badge", $$Badge, { "label": "Secure & Private", "icon": "shield-check-fill", "iconCollection": "trust", "uppercase": false })} ${renderComponent($$result3, "Badge", $$Badge, { "label": "Instant Delivery", "icon": "envelope-fill", "iconCollection": "trust", "uppercase": false })} ${renderComponent($$result3, "Badge", $$Badge, { "label": "No Spam Promise", "icon": "seal-check-fill", "iconCollection": "trust", "uppercase": false })} </div>` })} ` })} ${renderScript($$result, "C:/Users/Business/Website v2.36/src/pages/checkout.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/pages/checkout.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/checkout.astro";
const $$url = "/checkout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Checkout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
