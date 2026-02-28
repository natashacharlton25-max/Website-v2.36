globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, b as renderTemplate } from '../chunks/astro/server_DSZs3x4S.mjs';
import { e as $$Button, a as $$BaseLayout, b as $$Footer } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { $ as $$IsotopeFilterSwitcher } from '../chunks/IsotopeFilterSwitcher_DfW3DplV.mjs';
import { $ as $$HeroSection } from '../chunks/HeroSection_Du39SrCP.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_KOHtTGSL.mjs';
import { $ as $$Badge } from '../chunks/Badge_DvOoDIg_.mjs';
/* empty css                                    */
import { g as getCollection } from '../chunks/_astro_content_D40xraF-.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://yourdomain.com");
const $$InsightCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$InsightCard;
  const {
    slug,
    title,
    excerpt,
    cardImage,
    category,
    readTime,
    type
  } = Astro2.props;
  const href = type === "presentation" ? `/presentations/${slug}` : `/insights/${slug}`;
  const categoryId = category.toLowerCase().replace(/\s+/g, "-");
  const ctaText = type === "presentation" ? "View Presentation" : "Read Article";
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(`card insight-card ${categoryId}`, "class")}${addAttribute(categoryId, "data-category")} data-astro-cid-xkwi2rr4> <div class="insight-card__image" data-astro-cid-xkwi2rr4> ${renderComponent($$result, "Image", $$Image, { "src": cardImage, "alt": title, "width": 800, "height": 500, "loading": "lazy", "data-astro-cid-xkwi2rr4": true })} </div> <div class="insight-card__content" data-astro-cid-xkwi2rr4> <small class="insight-card__badge" data-astro-cid-xkwi2rr4> ${renderComponent($$result, "Badge", $$Badge, { "label": category, "shape": "rounded", "variant": "fill", "data-astro-cid-xkwi2rr4": true })} </small> <small class="insight-card__meta" data-astro-cid-xkwi2rr4> <span class="insight-card__read-time" data-astro-cid-xkwi2rr4>${readTime}</span> </small> <h2 class="insight-card__title" data-astro-cid-xkwi2rr4>${title}</h2> <p class="insight-card__excerpt" data-astro-cid-xkwi2rr4>${excerpt}</p> <div class="insight-card__cta" data-astro-cid-xkwi2rr4> ${renderComponent($$result, "Button", $$Button, { "variant": "outline", "size": "sm", "data-astro-cid-xkwi2rr4": true }, { "default": ($$result2) => renderTemplate`${ctaText}` })} </div> </div> </a> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/cards/InsightCard.astro", void 0);

const title = "Insights";
const subtitle = "Honest perspectives on building a life that feels like yours.";
const description = "No fluff. No empty positivity. Just practical insights and honest perspectives on building a life that actually feels like yours. These articles explore boundaries, self-direction, emotional wellbeing, and what it really takes to show up for yourself. Take what resonates. Leave what doesn't.";
const variant = "simple";
const heroDataRaw = {
  title,
  subtitle,
  description,
  variant,
};

const filterCategoriesBase = [
	{
		id: "all",
		label: "All"
	}
];

const $$Insights = createComponent(async ($$result, $$props, $$slots) => {
  const heroData = heroDataRaw;
  const getSlug = (id) => {
    const normalized = id.replace(/[\\/]index\.md$/, "");
    return normalized.split(/[\\/]/).pop() || id;
  };
  const allInsights = await getCollection("insights");
  const allPresentations = await getCollection("presentations");
  const insightPresentations = allPresentations.filter(
    (entry) => entry.data.showIn?.includes("insights")
  );
  const insightArticles = allInsights.map((entry) => {
    const wordsPerMinute = 200;
    const wordCount = entry.body.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return {
      slug: getSlug(entry.id),
      title: entry.data.title,
      excerpt: entry.data.description,
      cardImage: entry.data.cardImage,
      category: entry.data.category,
      readTime: `${readTime} min read`,
      publishDate: entry.data.publishDate,
      type: "insight"
    };
  });
  const presentationArticles = insightPresentations.map((entry) => {
    const sectionCount = entry.data.sections?.length || 0;
    return {
      slug: getSlug(entry.id),
      title: entry.data.title,
      excerpt: entry.data.description,
      cardImage: entry.data.cardImage,
      category: entry.data.category,
      readTime: `${sectionCount} sections`,
      publishDate: entry.data.publishDate || "",
      type: "presentation"
    };
  });
  const articles = [...insightArticles, ...presentationArticles].sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  const categories = [...new Set(articles.map((a) => a.category))];
  const dynamicFilters = categories.map((cat) => ({
    id: cat.toLowerCase().replace(/\s+/g, "-"),
    label: cat
  }));
  const existingIds = new Set(filterCategoriesBase.map((f) => f.id));
  const uniqueDynamicFilters = dynamicFilters.filter((f) => !existingIds.has(f.id));
  const filterCategories = [...filterCategoriesBase, ...uniqueDynamicFilters];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Insights | Walking With A Smile", "description": "Honest perspectives on self-direction, boundaries, and wellbeing. Practical insights for building a life that feels like yours.", "hideFooter": true }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": heroData.title, "subtitle": heroData.subtitle, "description": heroData.description, "extraText": heroData.extraText, "variant": heroData.variant })}  ${maybeRenderHead()}<section class="insights-content section"> <div class="container"> <div class="insights-section"> <!-- Filter --> <div class="filter-section-insights"> ${renderComponent($$result2, "IsotopeFilterSwitcher", $$IsotopeFilterSwitcher, { "tabs": filterCategories, "defaultActive": "all", "gridSelector": "#insights-grid", "itemSelector": ".insight-card" })} </div> <!-- Insights Grid --> <div class="insights-grid" id="insights-grid"> <!-- Grid sizer for Isotope column width calculation --> <div class="grid__sizer"></div> ${articles.map((article) => renderTemplate`${renderComponent($$result2, "InsightCard", $$InsightCard, { "slug": article.slug, "title": article.title, "excerpt": article.excerpt, "cardImage": article.cardImage, "category": article.category, "readTime": article.readTime, "type": article.type })}`)} </div> </div> </div> </section>  ${renderComponent($$result2, "Footer", $$Footer, { "animated": true })} ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/insights.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/insights.astro";
const $$url = "/insights";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Insights,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
