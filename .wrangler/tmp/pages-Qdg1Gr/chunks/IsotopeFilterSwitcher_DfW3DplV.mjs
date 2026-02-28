globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, r as renderComponent, e as renderScript, b as renderTemplate } from './astro/server_DSZs3x4S.mjs';
import { $ as $$BaseSwitcher } from './BaseSwitcher_sXp8Jg5O.mjs';
/* empty css                          */

const $$Astro = createAstro("https://yourdomain.com");
const $$IsotopeFilterSwitcher = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$IsotopeFilterSwitcher;
  const { tabs, defaultActive, gridSelector, itemSelector } = Astro2.props;
  const switcherId = `isotope-filter-${Math.random().toString(36).slice(2, 9)}`;
  return renderTemplate`${renderComponent($$result, "BaseSwitcher", $$BaseSwitcher, { "tabs": tabs, "defaultActive": defaultActive, "id": switcherId, "dataAttributes": {
    "data-grid-selector": gridSelector,
    "data-item-selector": itemSelector
  } })} ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/molecules/switcher/IsotopeFilterSwitcher.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/switcher/IsotopeFilterSwitcher.astro", void 0);

export { $$IsotopeFilterSwitcher as $ };
