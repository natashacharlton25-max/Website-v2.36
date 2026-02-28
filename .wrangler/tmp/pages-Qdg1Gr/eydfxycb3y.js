// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_astro/*",
    "/Franz Kline.pdf",
    "/Assets/Assets title Alt.png",
    "/Assets/Assets title.png",
    "/Footer/Footer-Reveal.png",
    "/Logo/BrandLogoFooter.png",
    "/Logo/Favicon.png",
    "/Logo/Nav-Logo.png",
    "/Logo/SEO Image.png",
    "/MiniKart/MiniKart-Fallback-1.png",
    "/MiniKart/MiniKart-Fallback-10.png",
    "/MiniKart/MiniKart-Fallback-2.png",
    "/MiniKart/MiniKart-Fallback-3.png",
    "/MiniKart/MiniKart-Fallback-4.png",
    "/MiniKart/MiniKart-Fallback-5.png",
    "/MiniKart/MiniKart-Fallback-6.png",
    "/MiniKart/MiniKart-Fallback-7.png",
    "/MiniKart/MiniKart-Fallback-8.png",
    "/MiniKart/MiniKart-Fallback-9.png",
    "/Animations/Hero Morph/1.svg",
    "/Animations/Hero Morph/10.svg",
    "/Animations/Hero Morph/1a.svg",
    "/Animations/Hero Morph/1a0.svg",
    "/Animations/Hero Morph/2.svg",
    "/Animations/Hero Morph/3.svg",
    "/Animations/Hero Morph/4.svg",
    "/Animations/Hero Morph/5.svg",
    "/Animations/Hero Morph/6.svg",
    "/Animations/Hero Morph/7.svg",
    "/Animations/Hero Morph/8.svg",
    "/Animations/Hero Morph/9.svg",
    "/Animations/Hero Morph/blob.svg",
    "/Animations/Hero Morph/filled-logo.svg",
    "/_Unused Images/1.png",
    "/_Unused Images/3.jpg",
    "/_Unused Images/6.png",
    "/_Unused Images/7.jpg",
    "/_Unused Images/9.jpg",
    "/_Unused Images/About us WWAS Footer.png",
    "/_Unused Images/Article Hero Card.png",
    "/_Unused Images/Articles hero Image.png",
    "/_Unused Images/Asset-Card (10).png",
    "/_Unused Images/Asset-Card (11).png",
    "/_Unused Images/Asset-Card (12).png",
    "/_Unused Images/Asset-Card (13).png",
    "/_Unused Images/Asset-Card (14).png",
    "/_Unused Images/Asset-Card (15).png",
    "/_Unused Images/Asset-Card (16).png",
    "/_Unused Images/Asset-Card (17).png",
    "/_Unused Images/Asset-Card (18).png",
    "/_Unused Images/Asset-Card (19).png",
    "/_Unused Images/Asset-Card (2).png",
    "/_Unused Images/Asset-Card (20).png",
    "/_Unused Images/Asset-Card (21).png",
    "/_Unused Images/Asset-Card (3).png",
    "/_Unused Images/Asset-Card (4).png",
    "/_Unused Images/Asset-Card (5).png",
    "/_Unused Images/Asset-Card (6).png",
    "/_Unused Images/Asset-Card (7).png",
    "/_Unused Images/Asset-Card (8).png",
    "/_Unused Images/Asset-Card (9).png",
    "/_Unused Images/Asset-Card.png",
    "/_Unused Images/Asset-Main-1 (10).png",
    "/_Unused Images/Asset-Main-1 (11).png",
    "/_Unused Images/Asset-Main-1 (12).png",
    "/_Unused Images/Asset-Main-1 (13).png",
    "/_Unused Images/Asset-Main-1 (14).png",
    "/_Unused Images/Asset-Main-1 (15).png",
    "/_Unused Images/Asset-Main-1 (16).png",
    "/_Unused Images/Asset-Main-1 (17).png",
    "/_Unused Images/Asset-Main-1 (18).png",
    "/_Unused Images/Asset-Main-1 (19).png",
    "/_Unused Images/Asset-Main-1 (2).png",
    "/_Unused Images/Asset-Main-1 (20).png",
    "/_Unused Images/Asset-Main-1 (21).png",
    "/_Unused Images/Asset-Main-1 (3).png",
    "/_Unused Images/Asset-Main-1 (4).png",
    "/_Unused Images/Asset-Main-1 (5).png",
    "/_Unused Images/Asset-Main-1 (6).png",
    "/_Unused Images/Asset-Main-1 (7).png",
    "/_Unused Images/Asset-Main-1 (8).png",
    "/_Unused Images/Asset-Main-1 (9).png",
    "/_Unused Images/Asset-Main-1.png",
    "/_Unused Images/Asset-Main-2 (10).png",
    "/_Unused Images/Asset-Main-2 (11).png",
    "/_Unused Images/Asset-Main-2 (12).png",
    "/_Unused Images/Asset-Main-2 (13).png",
    "/_Unused Images/Asset-Main-2 (14).png",
    "/_Unused Images/Asset-Main-2 (15).png",
    "/_Unused Images/Asset-Main-2 (16).png",
    "/_Unused Images/Asset-Main-2 (17).png",
    "/_Unused Images/Asset-Main-2 (18).png",
    "/_Unused Images/Asset-Main-2 (19).png",
    "/_Unused Images/Asset-Main-2 (2).png",
    "/_Unused Images/Asset-Main-2 (20).png",
    "/_Unused Images/Asset-Main-2 (21).png",
    "/_Unused Images/Asset-Main-2 (3).png",
    "/_Unused Images/Asset-Main-2 (4).png",
    "/_Unused Images/Asset-Main-2 (5).png"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "C:\\Users\\Business\\Website v2.36\\.wrangler\\tmp\\pages-Qdg1Gr\\bundledWorker-0.009583031299333689.mjs";
import { isRoutingRuleMatch } from "C:\\Users\\Business\\Website v2.36\\node_modules\\wrangler\\templates\\pages-dev-util.ts";
export * from "C:\\Users\\Business\\Website v2.36\\.wrangler\\tmp\\pages-Qdg1Gr\\bundledWorker-0.009583031299333689.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=eydfxycb3y.js.map
