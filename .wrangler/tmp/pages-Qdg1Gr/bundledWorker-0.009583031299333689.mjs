var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _worker.js/index.js
import { renderers } from "./renderers.mjs";
import { c as createExports, s as serverEntrypointModule } from "./chunks/_@astrojs-ssr-adapter_DH7o8LcN.mjs";
import { manifest } from "./manifest_CscNkW0V.mjs";
globalThis.process ??= {};
globalThis.process.env ??= {};
var serverIslandMap = /* @__PURE__ */ new Map();
var _page0 = /* @__PURE__ */ __name(() => import("./pages/_image.astro.mjs"), "_page0");
var _page1 = /* @__PURE__ */ __name(() => import("./pages/about.astro.mjs"), "_page1");
var _page2 = /* @__PURE__ */ __name(() => import("./pages/accessibility.astro.mjs"), "_page2");
var _page3 = /* @__PURE__ */ __name(() => import("./pages/api/checkout.astro.mjs"), "_page3");
var _page4 = /* @__PURE__ */ __name(() => import("./pages/api/contact.astro.mjs"), "_page4");
var _page5 = /* @__PURE__ */ __name(() => import("./pages/api/download.astro.mjs"), "_page5");
var _page6 = /* @__PURE__ */ __name(() => import("./pages/assets/_slug_.astro.mjs"), "_page6");
var _page7 = /* @__PURE__ */ __name(() => import("./pages/assets.astro.mjs"), "_page7");
var _page8 = /* @__PURE__ */ __name(() => import("./pages/checkout.astro.mjs"), "_page8");
var _page9 = /* @__PURE__ */ __name(() => import("./pages/contact.astro.mjs"), "_page9");
var _page10 = /* @__PURE__ */ __name(() => import("./pages/insights/_slug_.astro.mjs"), "_page10");
var _page11 = /* @__PURE__ */ __name(() => import("./pages/insights.astro.mjs"), "_page11");
var _page12 = /* @__PURE__ */ __name(() => import("./pages/legal/attributions.astro.mjs"), "_page12");
var _page13 = /* @__PURE__ */ __name(() => import("./pages/legal/_slug_.astro.mjs"), "_page13");
var _page14 = /* @__PURE__ */ __name(() => import("./pages/presentations/_slug_.astro.mjs"), "_page14");
var _page15 = /* @__PURE__ */ __name(() => import("./pages/projects/_slug_.astro.mjs"), "_page15");
var _page16 = /* @__PURE__ */ __name(() => import("./pages/projects.astro.mjs"), "_page16");
var _page17 = /* @__PURE__ */ __name(() => import("./pages/search.astro.mjs"), "_page17");
var _page18 = /* @__PURE__ */ __name(() => import("./pages/services/_slug_.astro.mjs"), "_page18");
var _page19 = /* @__PURE__ */ __name(() => import("./pages/services.astro.mjs"), "_page19");
var _page20 = /* @__PURE__ */ __name(() => import("./pages/test-image-alt.astro.mjs"), "_page20");
var _page21 = /* @__PURE__ */ __name(() => import("./pages/verify.astro.mjs"), "_page21");
var _page22 = /* @__PURE__ */ __name(() => import("./pages/visualtest.astro.mjs"), "_page22");
var _page23 = /* @__PURE__ */ __name(() => import("./pages/index.astro.mjs"), "_page23");
var pageMap = /* @__PURE__ */ new Map([
  ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
  ["src/pages/about.astro", _page1],
  ["src/pages/accessibility.astro", _page2],
  ["src/pages/api/checkout.ts", _page3],
  ["src/pages/api/contact.ts", _page4],
  ["src/pages/api/download.ts", _page5],
  ["src/pages/assets/[slug].astro", _page6],
  ["src/pages/assets.astro", _page7],
  ["src/pages/checkout.astro", _page8],
  ["src/pages/contact.astro", _page9],
  ["src/pages/insights/[slug].astro", _page10],
  ["src/pages/insights.astro", _page11],
  ["src/pages/legal/attributions.astro", _page12],
  ["src/pages/legal/[slug].astro", _page13],
  ["src/pages/presentations/[slug].astro", _page14],
  ["src/pages/projects/[slug].astro", _page15],
  ["src/pages/projects.astro", _page16],
  ["src/pages/search.astro", _page17],
  ["src/pages/services/[slug].astro", _page18],
  ["src/pages/services.astro", _page19],
  ["src/pages/test-image-alt.astro", _page20],
  ["src/pages/verify.astro", _page21],
  ["src/pages/visualtest.astro", _page22],
  ["src/pages/index.astro", _page23]
]);
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: /* @__PURE__ */ __name(() => import("./noop-entrypoint.mjs"), "actions"),
  middleware: /* @__PURE__ */ __name(() => import("./_astro-internal_middleware.mjs"), "middleware")
});
var _args = void 0;
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
  serverEntrypointModule[_start](_manifest, _args);
}
export {
  __astrojsSsrVirtualEntry as default,
  pageMap
};
//# sourceMappingURL=bundledWorker-0.009583031299333689.mjs.map
