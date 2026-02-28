globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, s as spreadAttributes, e as renderScript, u as unescapeHTML, b as renderTemplate } from './astro/server_DSZs3x4S.mjs';
/* empty css                          */

const $$Astro = createAstro("https://yourdomain.com");
const $$BaseSwitcher = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseSwitcher;
  const { tabs, defaultActive, id, dataAttributes = {} } = Astro2.props;
  const activeTab = defaultActive || tabs[0]?.id;
  const switcherId = id || `switcher-${Math.random().toString(36).slice(2, 9)}`;
  return renderTemplate`${maybeRenderHead()}<div class="switcher-container"${addAttribute(switcherId, "data-switcher-id")}> <div class="switcher-nav"${addAttribute(switcherId, "data-switcher-nav")}${spreadAttributes(dataAttributes)}> ${tabs.map((tab) => renderTemplate`<button${addAttribute(`switcher-btn ${tab.id === activeTab ? "active" : ""}`, "class")}${addAttribute(tab.id, "data-tab")}${addAttribute(switcherId, "data-switcher")}> ${tab.icon && renderTemplate`<span class="switcher-btn__icon">${unescapeHTML(tab.icon)}</span>`} <small class="switcher-btn__label">${tab.label}</small> </button>`)} </div> </div> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/molecules/switcher/BaseSwitcher.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/switcher/BaseSwitcher.astro", void 0);

export { $$BaseSwitcher as $ };
