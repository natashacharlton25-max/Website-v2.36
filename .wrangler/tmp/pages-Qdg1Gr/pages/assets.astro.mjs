globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as createComponent, r as renderComponent, e as renderScript, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DSZs3x4S.mjs';
import { a as $$BaseLayout } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { $ as $$IsotopeFilterSwitcher } from '../chunks/IsotopeFilterSwitcher_DfW3DplV.mjs';
import { $ as $$HeroSection } from '../chunks/HeroSection_Du39SrCP.mjs';
import { $ as $$ProductCard } from '../chunks/ProductCard_DzgFce3x.mjs';
import { g as getCollection } from '../chunks/_astro_content_D40xraF-.mjs';
export { renderers } from '../renderers.mjs';

const title = "Tools you can use.";
const subtitle = "We've gathered practical resources to support your clarity, boundaries, and self-direction. These aren't about fixing you. They're about giving you something useful when you need it. Take what resonates. Leave what doesn't. Come back when you're ready.";
const variant = "simple";
const heroDataRaw = {
  title,
  subtitle,
  variant,
};

const filterCategoriesBase = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "worksheet",
		label: "Worksheet"
	},
	{
		id: "workbook",
		label: "Workbook"
	},
	{
		id: "guide",
		label: "Guide"
	},
	{
		id: "toolkit",
		label: "Toolkit"
	},
	{
		id: "cards",
		label: "Cards"
	},
	{
		id: "activity",
		label: "Activity"
	}
];

const $$Assets = createComponent(async ($$result, $$props, $$slots) => {
  const heroData = heroDataRaw;
  const getSlug = (id) => {
    const normalized = id.replace(/[\\/]index\.md$/, "");
    return normalized.split(/[\\/]/).pop() || id;
  };
  const assetsEntries = await getCollection("assets");
  const assets = assetsEntries.map((entry) => ({
    ...entry.data,
    slug: getSlug(entry.id)
  }));
  const types = [...new Set(assets.map((a) => a.type))];
  const dynamicFilters = types.map((type) => ({
    id: type.toLowerCase().replace(/\s+/g, "-"),
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }));
  const existingIds = new Set(filterCategoriesBase.map((f) => f.id));
  const uniqueDynamicFilters = dynamicFilters.filter((f) => !existingIds.has(f.id));
  const filterCategories = [...filterCategoriesBase, ...uniqueDynamicFilters];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Digital Assets | Your Brand Name", "description": "Browse our collection of premium digital products designed to help you succeed" }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": heroData.title, "subtitle": heroData.subtitle, "extraText": heroData.extraText, "variant": heroData.variant })}  ${maybeRenderHead()}<section class="assets-content section"> <div class="container"> <div class="products-section"> <!-- Filter --> <div class="filter-section-assets"> ${renderComponent($$result2, "IsotopeFilterSwitcher", $$IsotopeFilterSwitcher, { "tabs": filterCategories, "defaultActive": "all", "gridSelector": "#products-grid", "itemSelector": ".product-card" })} </div> <!-- Products Grid - Dynamic from assets data --> <div class="products-grid" id="products-grid"> <!-- Grid sizer for Isotope column width calculation --> <div class="grid__sizer"></div> ${assets.map((asset) => renderTemplate`${renderComponent($$result2, "ProductCard", $$ProductCard, { "slug": asset.slug, "name": asset.name, "category": asset.category, "description": asset.description, "cardImage": asset.cardImage, "type": asset.type })}`)} </div> </div> </div> </section> ` })} ${renderScript($$result, "C:/Users/Business/Website v2.36/src/pages/assets.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/pages/assets.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/assets.astro";
const $$url = "/assets";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Assets,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
