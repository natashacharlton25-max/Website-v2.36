globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, b as renderTemplate, e as renderScript, u as unescapeHTML } from '../chunks/astro/server_DSZs3x4S.mjs';
import { $ as $$Icon, a as $$BaseLayout, c as $$PresetButton, d as $$ThemeSidebar } from '../chunks/BaseLayout_RnOOHI6G.mjs';
/* empty css                                         */
import { a as aacInline } from '../chunks/aac-inline_3G69y7AJ.mjs';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

const $$Astro$3 = createAstro("https://yourdomain.com");
const $$ToggleCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ToggleCard;
  const { id, setting, icon, label, description, checked = false, iconSize = 28 } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button type="button" class="a11y-toggle-card"${addAttribute(id, "id")}${addAttribute(setting, "data-setting")}${addAttribute(checked ? "true" : "false", "aria-pressed")}${addAttribute(`${label}${description ? ` - ${description}` : ""}`, "aria-label")} data-astro-cid-j3gbxtye> ${renderComponent($$result, "Icon", $$Icon, { "name": icon, "size": iconSize, "color": "var(--brand-c-primary)", "class": "a11y-toggle-card__icon", "data-astro-cid-j3gbxtye": true })} <div class="a11y-toggle-card__text" data-astro-cid-j3gbxtye> <small class="a11y-toggle-card__label" data-astro-cid-j3gbxtye>${label}</small> ${description && renderTemplate`<span class="a11y-toggle-card__desc" data-astro-cid-j3gbxtye>${description}</span>`} </div> <span class="a11y-toggle-card__indicator" aria-hidden="true" data-astro-cid-j3gbxtye> <svg class="a11y-toggle-card__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-j3gbxtye> <polyline points="20 6 9 17 4 12" data-astro-cid-j3gbxtye></polyline> </svg> </span> </button> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/a11y/ToggleCard.astro", void 0);

const $$VisualSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="a11y-section a11y-section--visual" data-astro-cid-jpqhpjxo> <h3 class="a11y-section__title" data-astro-cid-jpqhpjxo>Access</h3> <div class="a11y-toggle-grid" data-astro-cid-jpqhpjxo> ${renderComponent($$result, "ToggleCard", $$ToggleCard, { "id": "a11y-text-only", "setting": "textOnly", "icon": "a11y/eye-slash-fill", "label": "Text Only", "data-astro-cid-jpqhpjxo": true })} ${renderComponent($$result, "ToggleCard", $$ToggleCard, { "id": "a11y-highlight-links", "setting": "highlightLinks", "icon": "a11y/link-fill", "label": "Highlight Links", "data-astro-cid-jpqhpjxo": true })} ${renderComponent($$result, "ToggleCard", $$ToggleCard, { "id": "a11y-reduce-motion", "setting": "reduceMotion", "icon": "a11y/lightning-fill", "label": "Reduce Motion", "data-astro-cid-jpqhpjxo": true })} ${renderComponent($$result, "ToggleCard", $$ToggleCard, { "id": "a11y-enhanced-focus", "setting": "enhancedFocus", "icon": "a11y/gear-fill", "label": "Enhanced Focus", "data-astro-cid-jpqhpjxo": true })} ${renderComponent($$result, "ToggleCard", $$ToggleCard, { "id": "a11y-screen-reader", "setting": "screenReaderMode", "icon": "a11y/bell-fill", "label": "Screen Reader", "data-astro-cid-jpqhpjxo": true })} ${renderComponent($$result, "ToggleCard", $$ToggleCard, { "id": "a11y-scrollbar-enhanced", "setting": "scrollbarEnhanced", "icon": "a11y/plus-fill", "label": "Big Scrollbar", "data-astro-cid-jpqhpjxo": true })} </div> </div> `;
}, "C:/Users/Business/Website v2.36/src/components/organisms/a11y/VisualSection.astro", void 0);

const $$Astro$2 = createAstro("https://yourdomain.com");
const $$FontCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$FontCard;
  const { value, label, fontFamily } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button class="a11y-font-card"${addAttribute(value, "data-font")}${addAttribute(fontFamily, "data-font-family")}${addAttribute(`${label} font`, "aria-label")} aria-pressed="false" data-astro-cid-z6lobmim> <small class="a11y-font-card__label"${addAttribute(fontFamily ? `font-family: ${fontFamily}` : "", "style")} data-astro-cid-z6lobmim> ${label} </small> </button> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/a11y/FontCard.astro", void 0);

const $$TypographySection = createComponent(($$result, $$props, $$slots) => {
  const fontOptions = [
    { label: "Default", value: "default" },
    { label: "OpenDyslexic", value: "opendyslexic", fontFamily: "'OpenDyslexic', sans-serif" },
    { label: "Atkinson", value: "atkinson", fontFamily: "'Atkinson Hyperlegible', sans-serif" },
    { label: "Comic Sans", value: "comic-sans", fontFamily: "'Comic Sans MS', cursive" },
    { label: "Verdana", value: "verdana", fontFamily: "Verdana, Geneva, sans-serif" },
    { label: "Arial", value: "arial", fontFamily: "Arial, Helvetica, sans-serif" },
    { label: "Tahoma", value: "tahoma", fontFamily: "Tahoma, Geneva, sans-serif" }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="a11y-section a11y-section--typography" data-astro-cid-evkuars6> <h3 class="a11y-section__title" data-astro-cid-evkuars6>Font</h3> <!-- Font Cards --> <div class="a11y-font-grid" data-setting="fontFamily" data-astro-cid-evkuars6> ${fontOptions.map((font) => renderTemplate`${renderComponent($$result, "FontCard", $$FontCard, { "value": font.value, "label": font.label, "fontFamily": font.fontFamily, "data-astro-cid-evkuars6": true })}`)} </div> </div> `;
}, "C:/Users/Business/Website v2.36/src/components/organisms/a11y/TypographySection.astro", void 0);

const $$Astro$1 = createAstro("https://yourdomain.com");
const $$Stepper = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Stepper;
  const {
    id,
    setting,
    label,
    min,
    max,
    step = 1,
    value = min,
    valueId,
    unit = ""
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="a11y-stepper"${addAttribute(setting, "data-setting")}${addAttribute(min, "data-min")}${addAttribute(max, "data-max")}${addAttribute(step, "data-step")}> <button type="button" class="a11y-stepper__btn a11y-stepper__btn--plus"${addAttribute(`Increase ${label}`, "aria-label")} data-action="increment"> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"> <line x1="12" y1="5" x2="12" y2="19"></line> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> </button> <div class="a11y-stepper__center"> <label${addAttribute(id, "for")} class="a11y-stepper__label">${label}</label> <span class="a11y-stepper__value"${addAttribute(valueId || `${id}-value`, "id")}${addAttribute(unit, "data-unit")} aria-live="polite" aria-atomic="true"> ${value}${unit} </span> <input type="hidden"${addAttribute(id, "id")}${addAttribute(value, "value")}${addAttribute(setting, "data-setting")}> </div> <button type="button" class="a11y-stepper__btn a11y-stepper__btn--minus"${addAttribute(`Decrease ${label}`, "aria-label")} data-action="decrement"> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"> <line x1="5" y1="12" x2="19" y2="12"></line> </svg> </button> </div>`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/a11y/Stepper/Stepper.astro", void 0);

const $$TypographyAdjustmentsSection = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="a11y-section--typography-adjustments" data-astro-cid-ustb37na> <h3 class="a11y-section__title" data-astro-cid-ustb37na>Type</h3> <div class="a11y-stepper-grid" data-astro-cid-ustb37na> ${renderComponent($$result, "Stepper", $$Stepper, { "id": "a11y-font-size", "setting": "fontSize", "label": "Font Size", "min": 50, "max": 200, "step": 10, "value": 100, "valueId": "font-size-value", "unit": "%", "data-astro-cid-ustb37na": true })} ${renderComponent($$result, "Stepper", $$Stepper, { "id": "a11y-letter-spacing", "setting": "letterSpacing", "label": "Letter Spacing", "min": 0, "max": 10, "step": 1, "value": 0, "valueId": "letter-spacing-value", "unit": "px", "data-astro-cid-ustb37na": true })} ${renderComponent($$result, "Stepper", $$Stepper, { "id": "a11y-word-spacing", "setting": "wordSpacing", "label": "Word Spacing", "min": 0, "max": 20, "step": 2, "value": 0, "valueId": "word-spacing-value", "unit": "px", "data-astro-cid-ustb37na": true })} ${renderComponent($$result, "Stepper", $$Stepper, { "id": "a11y-line-height", "setting": "lineHeight", "label": "Line Height", "min": 100, "max": 200, "step": 10, "value": 100, "valueId": "line-height-value", "unit": "%", "data-astro-cid-ustb37na": true })} </div> </div> `;
}, "C:/Users/Business/Website v2.36/src/components/organisms/a11y/TypographyAdjustmentsSection.astro", void 0);

const $$Astro = createAstro("https://yourdomain.com");
const $$AltTextCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AltTextCard;
  const { value, label, description, icon, pressed = false, iconSize = 24 } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button type="button" class="a11y-alttext-card"${addAttribute(value, "data-alttext")}${addAttribute(pressed ? "true" : "false", "aria-pressed")}${addAttribute(`${label}${description ? ` - ${description}` : ""}`, "aria-label")} data-astro-cid-b7vuokap> ${renderComponent($$result, "Icon", $$Icon, { "name": icon, "size": iconSize, "color": "var(--brand-c-primary)", "class": "a11y-alttext-card__icon", "data-astro-cid-b7vuokap": true })} <div class="a11y-alttext-card__text" data-astro-cid-b7vuokap> <small class="a11y-alttext-card__label" data-astro-cid-b7vuokap>${label}</small> ${description && renderTemplate`<span class="a11y-alttext-card__desc" data-astro-cid-b7vuokap>${description}</span>`} </div> </button> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/a11y/AltTextCard.astro", void 0);

const $$Accessibility = createComponent(async ($$result, $$props, $$slots) => {
  const headingAac = await aacInline("Accessibility Settings");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Accessibility Settings", "description": "Customise how this site looks and feels. Adjust fonts, colours, motion, and more." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div id="a11y-page" class="a11y-page" aria-label="Accessibility settings"> <!-- Page Header --> <header class="a11y-page__header"> <h1 class="a11y-page__title">Accessibility Settings</h1> <div class="a11y-page__title-aac" aria-hidden="true">${unescapeHTML(headingAac)}</div> <p class="a11y-page__intro">
Customise how this site looks and feels. Every setting saves automatically and persists across pages.
</p> <div class="a11y-page__header-actions"> <button class="btn btn--sm btn--ghost" id="a11y-reset" aria-label="Reset all settings"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "a11y-panel/arrow-counter-clockwise-fill", "size": 18 })} <span>Reset All</span> </button> </div> </header> <!-- Presets --> <section class="a11y-page__section"> <h2 class="a11y-page__section-title">Quick Presets</h2> <p class="a11y-page__section-desc">
One-click profiles that adjust multiple settings at once. Choose a preset, then fine-tune individual settings below.
</p> <div class="a11y-page__presets-row"> ${renderComponent($$result2, "PresetButton", $$PresetButton, { "preset": "dyslexia", "icon": "text-aa-fill", "title": "Dyslexia" })} ${renderComponent($$result2, "PresetButton", $$PresetButton, { "preset": "low-vision", "icon": "eye-fill", "title": "Low Vision" })} ${renderComponent($$result2, "PresetButton", $$PresetButton, { "preset": "color-blind", "icon": "palette-fill", "title": "Color Blind" })} ${renderComponent($$result2, "PresetButton", $$PresetButton, { "preset": "motor", "icon": "hand-palm-fill", "title": "Motor" })} ${renderComponent($$result2, "PresetButton", $$PresetButton, { "preset": "cognitive", "icon": "brain-fill", "title": "Cognitive" })} ${renderComponent($$result2, "PresetButton", $$PresetButton, { "preset": "easyread", "icon": "book-open-fill", "title": "Easy Read" })} </div> </section> <!-- Colour Themes --> <section class="a11y-page__section"> <h2 class="a11y-page__section-title">Colour Theme</h2> <p class="a11y-page__section-desc">
Switch the entire site colour palette. Includes dark mode, high contrast, colour-blind-friendly themes, and a cream reading theme.
</p> ${renderComponent($$result2, "ThemeSidebar", $$ThemeSidebar, {})} </section> <!-- Access Toggles --> <section class="a11y-page__section"> <h2 class="a11y-page__section-title">Access Controls</h2> <p class="a11y-page__section-desc">
Toggle individual features on or off. Text Only strips images and decoration for a clean reading view.
        Reduce Motion stops all animation. Screen Reader enables all companion settings automatically.
</p> ${renderComponent($$result2, "VisualSection", $$VisualSection, {})} </section> <!-- Font Selection --> <section class="a11y-page__section"> <h2 class="a11y-page__section-title">Font</h2> <p class="a11y-page__section-desc">
Choose a typeface that works for you. OpenDyslexic and Atkinson Hyperlegible are designed for readability;
        the others are familiar system fonts.
</p> ${renderComponent($$result2, "TypographySection", $$TypographySection, {})} </section> <!-- Typography Adjustments --> <section class="a11y-page__section"> <h2 class="a11y-page__section-title">Typography</h2> <p class="a11y-page__section-desc">
Fine-tune text size, letter spacing, word spacing, and line height.
        These controls affect all page content without changing the accessibility panel itself.
</p> ${renderComponent($$result2, "TypographyAdjustmentsSection", $$TypographyAdjustmentsSection, {})} </section> <!-- Alt Text Mode --> <section class="a11y-page__section"> <h2 class="a11y-page__section-title">Image Descriptions</h2> <p class="a11y-page__section-desc">
Control how images are described. Off hides alt text. Simple shows short labels.
        Full shows detailed descriptions. AAC shows pictogram symbols alongside words for augmented communication.
</p> <div class="a11y-alttext-grid" data-setting="altTextMode"> ${renderComponent($$result2, "AltTextCard", $$AltTextCard, { "value": "none", "label": "Off", "description": "Hidden", "icon": "a11y/eye-slash-fill", "pressed": true })} ${renderComponent($$result2, "AltTextCard", $$AltTextCard, { "value": "word", "label": "Simple", "description": "Short labels", "icon": "a11y/text-aa-fill" })} ${renderComponent($$result2, "AltTextCard", $$AltTextCard, { "value": "descriptive", "label": "Full", "description": "Descriptions", "icon": "a11y/article-fill" })} ${renderComponent($$result2, "AltTextCard", $$AltTextCard, { "value": "aac", "label": "AAC", "description": "Pictograms", "icon": "a11y/chat-text-fill" })} </div> </section> </div> ` })} ${renderScript($$result, "C:/Users/Business/Website v2.36/src/pages/accessibility.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/pages/accessibility.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/accessibility.astro";
const $$url = "/accessibility";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Accessibility,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
