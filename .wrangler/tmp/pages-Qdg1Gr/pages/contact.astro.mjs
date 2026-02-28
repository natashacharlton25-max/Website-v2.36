globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, b as renderTemplate, r as renderComponent, F as Fragment, e as renderScript } from '../chunks/astro/server_DSZs3x4S.mjs';
import { e as $$Button, $ as $$Icon, f as $$Heading, g as $$Text, B as BRAND_CONFIG, h as $$Link, a as $$BaseLayout } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { $ as $$HeroSection } from '../chunks/HeroSection_Du39SrCP.mjs';
/* empty css                                   */
import { $ as $$Card } from '../chunks/Card_xzHrlDI7.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://yourdomain.com");
const $$FormField = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$FormField;
  const {
    id,
    name,
    label,
    type = "text",
    variant = "primary",
    contrast = "normal",
    fieldStyle = "outlined",
    placeholder,
    required = false,
    disabled = false,
    error,
    description,
    value,
    checked = false,
    rows = 3,
    min,
    max,
    step,
    options = [],
    hideLabel = false,
    radioValue,
    class: className
  } = Astro2.props;
  const isCheckbox = type === "checkbox";
  const isRadio = type === "radio";
  const isToggle = type === "toggle";
  const isTextarea = type === "textarea";
  const isSelect = type === "select";
  const fieldName = name || id;
  const describedBy = [
    error && `${id}-error`,
    description && `${id}-desc`
  ].filter(Boolean).join(" ") || void 0;
  const groupClasses = [
    "text",
    /* base typography from Text atom — sets font, color, line-height */
    "form-field",
    isCheckbox && "form-field--checkbox",
    isRadio && "form-field--radio",
    isToggle && "form-field--toggle",
    error && "form-field--error",
    disabled && "form-field--disabled",
    variant !== "primary" && `form-field--${variant}`,
    contrast === "high" && "form-field--high-contrast",
    fieldStyle !== "outlined" && `form-field--${fieldStyle}`,
    className
  ].filter(Boolean).join(" ");
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(groupClasses, "class")}> ${isCheckbox ? renderTemplate`<!-- Checkbox: input + label inline -->
    <label class="form-field__checkbox-wrap"${addAttribute(id, "for")}> <input type="checkbox"${addAttribute(id, "id")}${addAttribute(fieldName, "name")}${addAttribute(checked, "checked")}${addAttribute(required, "required")}${addAttribute(disabled, "disabled")} class="form-field__checkbox"${addAttribute(describedBy, "aria-describedby")}${addAttribute(error ? "true" : void 0, "aria-invalid")}> <span class="form-field__checkmark" aria-hidden="true"></span> <span class="form-field__label-text">${label}</span> </label>` : isRadio ? renderTemplate`<!-- Radio: input + label inline -->
    <label class="form-field__radio-wrap"${addAttribute(id, "for")}> <input type="radio"${addAttribute(id, "id")}${addAttribute(fieldName, "name")}${addAttribute(radioValue || value, "value")}${addAttribute(checked, "checked")}${addAttribute(required, "required")}${addAttribute(disabled, "disabled")} class="form-field__radio"${addAttribute(describedBy, "aria-describedby")}${addAttribute(error ? "true" : void 0, "aria-invalid")}> <span class="form-field__radio-indicator" aria-hidden="true"></span> <span class="form-field__label-text">${label}</span> </label>` : isToggle ? renderTemplate`<!-- Toggle: checkbox-backed switch -->
    <label class="form-field__toggle-wrap"${addAttribute(id, "for")}> <input type="checkbox"${addAttribute(id, "id")}${addAttribute(fieldName, "name")}${addAttribute(checked, "checked")}${addAttribute(required, "required")}${addAttribute(disabled, "disabled")} class="form-field__toggle" role="switch"${addAttribute(checked ? "true" : "false", "aria-checked")}${addAttribute(describedBy, "aria-describedby")}${addAttribute(error ? "true" : void 0, "aria-invalid")}> <span class="form-field__toggle-track" aria-hidden="true"> <span class="form-field__toggle-thumb"></span> </span> <span class="form-field__label-text">${label}</span> </label>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`  <label${addAttribute(id, "for")}${addAttribute(["form-field__label", hideLabel && "sr-only"], "class:list")}> ${label} ${required && renderTemplate`<span class="form-field__required" aria-hidden="true">*</span>`} </label>  ${description && renderTemplate`<span class="form-field__desc"${addAttribute(`${id}-desc`, "id")}>${description}</span>`} ${isTextarea && renderTemplate`<textarea${addAttribute(id, "id")}${addAttribute(fieldName, "name")}${addAttribute(placeholder, "placeholder")}${addAttribute(required, "required")}${addAttribute(disabled, "disabled")}${addAttribute(rows, "rows")} class="form-field__input form-field__input--textarea"${addAttribute(describedBy, "aria-describedby")}${addAttribute(error ? "true" : void 0, "aria-invalid")}>${value}</textarea>`} ${isSelect && renderTemplate`<select${addAttribute(id, "id")}${addAttribute(fieldName, "name")}${addAttribute(required, "required")}${addAttribute(disabled, "disabled")} class="form-field__input form-field__input--select"${addAttribute(describedBy, "aria-describedby")}${addAttribute(error ? "true" : void 0, "aria-invalid")}> ${placeholder && renderTemplate`<option value="" disabled selected>${placeholder}</option>`} ${options.map((opt) => renderTemplate`<option${addAttribute(opt.value, "value")}${addAttribute(value === opt.value, "selected")}>${opt.label}</option>`)} </select>`} ${!isTextarea && !isSelect && renderTemplate`<input${addAttribute(type, "type")}${addAttribute(id, "id")}${addAttribute(fieldName, "name")}${addAttribute(value, "value")}${addAttribute(placeholder, "placeholder")}${addAttribute(required, "required")}${addAttribute(disabled, "disabled")}${addAttribute(min, "min")}${addAttribute(max, "max")}${addAttribute(step, "step")} class="form-field__input"${addAttribute(describedBy, "aria-describedby")}${addAttribute(error ? "true" : void 0, "aria-invalid")}>`}` })}`} <!-- Error message --> ${error && renderTemplate`<span class="form-field__error"${addAttribute(`${id}-error`, "id")} role="alert">${error}</span>`} </div> <!-- Styles: FormField.css | FormField.responsive.css | FormField.a11y.css -->`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/form/FormField.astro", void 0);

const $$Astro = createAstro("https://yourdomain.com");
const $$ContactForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ContactForm;
  const topics = [
    "General enquiry",
    "Service enquiry",
    "Resources",
    "Feedback",
    "Other"
  ];
  return renderTemplate`${maybeRenderHead()}<div class="contact-form-wrap"> <!-- Topic selection --> <fieldset class="contact-form__topics" id="contactTopics"> <legend class="contact-form__legend">I'd like to chat about...</legend> <div class="contact-form__topic-list"> ${topics.map((topic) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "variant": "outline", "shape": "pill", "size": "sm", "className": "contact-form__topic-btn", "data-topic": topic }, { "default": async ($$result2) => renderTemplate`${topic}` })}`)} </div> </fieldset> <!-- Form --> <form class="contact-form" id="contactForm" novalidate> <input type="hidden" name="topic" id="contactTopic" value=""> <input type="hidden" name="page" value="/contact"> ${renderComponent($$result, "FormField", $$FormField, { "id": "contactName", "label": "Your name", "type": "text", "required": true, "placeholder": "First name or however you'd like to be addressed" })} ${renderComponent($$result, "FormField", $$FormField, { "id": "contactEmail", "label": "Your email", "type": "email", "required": true, "placeholder": "you@example.com" })} ${renderComponent($$result, "FormField", $$FormField, { "id": "contactMessage", "label": "Your message", "type": "textarea", "required": true, "rows": 5, "placeholder": "Take your time \u2014 there's no wrong thing to say here" })} <div class="contact-form__actions"> ${renderComponent($$result, "Button", $$Button, { "type": "submit", "variant": "primary", "id": "submitContact", "disabled": true }, { "default": async ($$result2) => renderTemplate`
Send Message
` })} </div> </form> <!-- Success (hidden by default) --> <div class="contact-form__success" id="contactSuccess" hidden> <div class="contact-form__success-icon"> ${renderComponent($$result, "Icon", $$Icon, { "name": "contact-popup/check-circle-fill", "size": 48 })} </div> ${renderComponent($$result, "Heading", $$Heading, { "level": 2 }, { "default": async ($$result2) => renderTemplate`Message sent` })} ${renderComponent($$result, "Text", $$Text, { "as": "p", "color": "text-light" }, { "default": async ($$result2) => renderTemplate`
Thanks for reaching out. We'll get back to you within ${BRAND_CONFIG.contact.responseTime}.
` })} ${renderComponent($$result, "Button", $$Button, { "variant": "outline", "id": "contactReset" }, { "default": async ($$result2) => renderTemplate`
Send another message
` })} </div> </div> <!-- Styles: ContactForm.style.css | ContactForm.responsive.css | ContactForm.a11y.css --> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/organisms/contact/ContactForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/contact/ContactForm.astro", void 0);

const $$ContactInfo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<aside class="contact-info"> ${renderComponent($$result, "Card", $$Card, { "variant": "outline", "padding": "xl", "radius": "lg", "shadow": "sm", "class": "contact-info__card" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Heading", $$Heading, { "level": 3, "flush": true }, { "default": ($$result3) => renderTemplate`Other ways to reach us` })} <div class="contact-info__item"> <div class="contact-info__icon-wrap"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "contact-popup/envelope-fill", "size": 20 })} </div> <div class="contact-info__detail"> ${renderComponent($$result2, "Text", $$Text, { "as": "span", "size": "xs", "uppercase": true, "flush": true }, { "default": ($$result3) => renderTemplate`Email` })} ${renderComponent($$result2, "Link", $$Link, { "href": `mailto:${BRAND_CONFIG.contact.email}`, "variant": "underline", "color": "primary", "weight": "bold" }, { "default": ($$result3) => renderTemplate`${BRAND_CONFIG.contact.email}` })} </div> </div> <div class="contact-info__item"> <div class="contact-info__icon-wrap"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "contact-popup/timer-fill", "size": 20 })} </div> <div class="contact-info__detail"> ${renderComponent($$result2, "Text", $$Text, { "as": "span", "size": "xs", "uppercase": true, "flush": true }, { "default": ($$result3) => renderTemplate`Response time` })} ${renderComponent($$result2, "Text", $$Text, { "as": "span", "weight": "bold", "flush": true }, { "default": ($$result3) => renderTemplate`${BRAND_CONFIG.contact.responseTime}` })} </div> </div> ` })} ${renderComponent($$result, "Card", $$Card, { "variant": "outline", "padding": "xl", "radius": "lg", "class": "contact-info__card contact-info__card--safety" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Heading", $$Heading, { "level": 3, "flush": true }, { "default": ($$result3) => renderTemplate`A note on safety` })} ${renderComponent($$result2, "Text", $$Text, { "as": "p", "color": "text-light", "flush": true }, { "default": ($$result3) => renderTemplate`
If you or someone you know is in immediate danger, please contact
      emergency services (999) or the
${renderComponent($$result3, "Link", $$Link, { "href": "https://www.samaritans.org", "external": true, "variant": "underline", "color": "primary" }, { "default": ($$result4) => renderTemplate`Samaritans` })} (116 123).
` })} ${renderComponent($$result2, "Text", $$Text, { "as": "p", "color": "text-light", "flush": true }, { "default": ($$result3) => renderTemplate`
This form is not monitored 24/7 and is not a crisis service.
` })} ` })} </aside> <!-- Styles: ContactInfo.style.css | ContactInfo.responsive.css | ContactInfo.a11y.css -->`;
}, "C:/Users/Business/Website v2.36/src/components/molecules/contact/ContactInfo.astro", void 0);

const $$Contact = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$BaseLayout, { "title": `Contact \u2014 ${BRAND_CONFIG.name}`, "description": "Get in touch. We're here when you're ready \u2014 no pressure." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": "Let's have a <span>conversation</span>", "subtitle": "Reach out when you're ready. No pressure, no expectations.", "variant": "gradient", "gradient": "primary", "alignment": "left" })} ${maybeRenderHead()}<div class="contact-body"> ${renderComponent($$result2, "ContactForm", $$ContactForm, {})} ${renderComponent($$result2, "ContactInfo", $$ContactInfo, {})} </div> ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/contact.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/contact.astro";
const $$url = "/contact";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contact,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
