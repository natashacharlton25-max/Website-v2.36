globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, e as renderScript, b as renderTemplate, s as spreadAttributes, u as unescapeHTML, r as renderComponent, f as renderSlot, F as Fragment, q as renderHead } from './astro/server_DSZs3x4S.mjs';
/* empty css                          */
/* empty css                            */
/* empty css                            */

const $$Astro$a = createAstro("https://yourdomain.com");
const $$CartIcon = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$CartIcon;
  const { size = 32, showOnReveal = false } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="cart-icon" id="cart-icon"${addAttribute(size, "data-size")}${addAttribute(showOnReveal, "data-reveal")}> <div class="cart-icon__lottie" id="lottie-basket"></div> <img src="/Icons/phosphor/a11y/basket-fill.svg" alt="" class="cart-icon__static" width="32" height="32" aria-hidden="true"> <span class="cart-icon__count">0</span> </div> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/molecules/shop/CartIcon.astro?astro&type=script&index=0&lang.ts")} <!-- CSS extracted to: src/styles/components/cart-icon.css -->`;
}, "C:/Users/Business/Website v2.36/src/components/molecules/shop/CartIcon.astro", void 0);

const $$Astro$9 = createAstro("https://yourdomain.com");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Icon;
  const ASSET_API_URL = process.env.ASSET_API_URL || "http://localhost:8787";
  const ASSET_API_TOKEN = "5VHJeXzqBorLO3NcRHRqLxU8y9gzOvjSsWE6IarufLQ";
  const DEFAULT_WEIGHT = "fill";
  const {
    name,
    weight,
    size = 24,
    class: className = "",
    color,
    shadow,
    glow,
    gradient,
    spin,
    pulse,
    bounce,
    stroke,
    draw,
    drawOnScroll,
    drawScrub,
    drawColor,
    morphTo,
    morphColor
  } = Astro2.props;
  const WEIGHTS = ["fill", "duotone", "regular", "bold", "thin", "light"];
  function hasWeightSuffix(slug2) {
    return WEIGHTS.some((w) => slug2.endsWith(`-${w}`));
  }
  function resolveSlug(iconName, weightOverride) {
    let resolved = iconName.startsWith("ph:") ? iconName.slice(3) : iconName;
    if (resolved.includes("/")) {
      resolved = resolved.split("/").pop();
    }
    if (hasWeightSuffix(resolved)) return resolved;
    const w = weightOverride || DEFAULT_WEIGHT;
    return `${resolved}-${w}`;
  }
  async function fetchIcon(slug2) {
    try {
      const headers = {};
      if (ASSET_API_TOKEN) {
        headers["Authorization"] = `Bearer ${ASSET_API_TOKEN}`;
      }
      const res = await fetch(`${ASSET_API_URL}/v1/assets/${slug2}`, { headers });
      if (!res.ok) return null;
      return await res.text();
    } catch {
      return null;
    }
  }
  const slug = resolveSlug(name, weight);
  let iconContent = await fetchIcon(slug);
  if (!iconContent && !name.endsWith("-fill") && weight !== "fill") {
    const fillSlug = resolveSlug(name, "fill");
    iconContent = await fetchIcon(fillSlug);
  }
  let morphTargetContent = null;
  if (morphTo && !draw) {
    const morphSlug = resolveSlug(morphTo, weight);
    morphTargetContent = await fetchIcon(morphSlug);
    if (!morphTargetContent && weight !== "fill") {
      const morphFillSlug = resolveSlug(morphTo, "fill");
      morphTargetContent = await fetchIcon(morphFillSlug);
    }
  }
  const needsStrokeConversion = !!draw && !stroke;
  if (needsStrokeConversion && iconContent) {
    iconContent = iconContent.replace(/<svg([^>]*)>/, (_match, attrs) => {
      const cleaned = attrs.replace(/\s*fill="[^"]*"/g, "");
      return `<svg${cleaned} fill="none">`;
    });
    iconContent = iconContent.replace(/<rect([^/]*)\/>/g, '<rect$1 fill="none" stroke="none"/>');
    const drawStrokeWidth = 10;
    const shapeRe = /<(path|circle|polygon|polyline)([^/]*)\/>/g;
    iconContent = iconContent.replace(shapeRe, (_match, tag, attrs) => {
      const cleaned = attrs.replace(/\s*fill="[^"]*"/g, "");
      return `<${tag}${cleaned} fill="none" stroke="currentColor" stroke-width="${drawStrokeWidth}"/>`;
    });
  }
  if (gradient && iconContent && !draw) {
    const gradientId = `icon-grad-${Math.random().toString(36).slice(2, 8)}`;
    const gradientStops = {
      primary: `<stop offset="0%" stop-color="var(--brand-c-primary)"/><stop offset="100%" stop-color="var(--brand-c-primary-dark)"/>`,
      secondary: `<stop offset="0%" stop-color="var(--brand-c-secondary)"/><stop offset="100%" stop-color="var(--brand-c-secondary-dark)"/>`,
      warm: `<stop offset="0%" stop-color="var(--brand-c-primary)"/><stop offset="100%" stop-color="var(--brand-c-secondary)"/>`,
      cool: `<stop offset="0%" stop-color="var(--brand-c-primary-light)"/><stop offset="100%" stop-color="var(--brand-c-primary-dark)"/>`
    };
    const gradientDef = `<defs><linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">${gradientStops[gradient]}</linearGradient></defs>`;
    iconContent = iconContent.replace(/<svg([^>]*)>/, `<svg$1>${gradientDef}`);
    iconContent = iconContent.replace(/fill="currentColor"/g, `fill="url(#${gradientId})"`).replace(/fill="CurrentColor"/g, `fill="url(#${gradientId})"`);
    iconContent = iconContent.replace(/<path(?![^>]*fill=)/g, `<path fill="url(#${gradientId})"`);
  }
  if (stroke && !draw && iconContent) {
    iconContent = iconContent.replace(/<svg([^>]*)>/, (_match, attrs) => {
      const cleaned = attrs.replace(/\s*fill="[^"]*"/g, "");
      return `<svg${cleaned} fill="none">`;
    });
    iconContent = iconContent.replace(/<rect([^/]*)\/>/g, '<rect$1 fill="none" stroke="none"/>');
    const strokeWidth = 16;
    const shapeRe = /<(path|circle|polygon|polyline)([^/]*)\/>/g;
    iconContent = iconContent.replace(shapeRe, (_match, tag, attrs) => {
      const cleaned = attrs.replace(/\s*fill="[^"]*"/g, "");
      return `<${tag}${cleaned} fill="none" stroke="currentColor" stroke-width="${strokeWidth}"/>`;
    });
  }
  const fallbackIcon = `<svg viewBox="0 0 256 256" width="${size}" height="${size}" fill="currentColor"><circle cx="128" cy="128" r="96" opacity="0.2"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-width="16"/></svg>`;
  const drawVariant = typeof draw === "string" ? draw : "draw";
  const effectClasses = [
    shadow ? `icon--shadow-${shadow}` : "",
    glow ? `icon--glow-${glow}` : "",
    gradient ? "icon--has-gradient" : "",
    spin ? "icon--spin" : "",
    pulse ? "icon--pulse" : "",
    bounce ? "icon--bounce" : "",
    stroke || draw ? "icon--stroke" : "",
    draw ? "icon--draw" : "",
    morphTo ? "icon--morph" : ""
  ].filter(Boolean).join(" ");
  const dataAttrs = {};
  if (draw) {
    dataAttrs["data-icon-draw"] = drawVariant;
    if (drawOnScroll) dataAttrs["data-icon-draw-scroll"] = "true";
    if (drawScrub) dataAttrs["data-icon-draw-scrub"] = "true";
    if (drawColor) dataAttrs["data-icon-draw-color"] = drawColor;
  }
  if (morphTo && morphTargetContent) {
    dataAttrs["data-icon-morph"] = "true";
    dataAttrs["data-icon-morph-target"] = morphTargetContent;
    if (morphColor) dataAttrs["data-icon-morph-color"] = morphColor;
  }
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(`icon ${effectClasses} ${className}`, "class")}${addAttribute(`width: ${size}px; height: ${size}px;${color && !gradient ? ` color: ${color};` : ""}`, "style")}${spreadAttributes(dataAttrs)}>${unescapeHTML(iconContent || fallbackIcon)}</span>`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/icons/Icon/Icon.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$8 = createAstro("https://yourdomain.com");
const $$LottieIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$LottieIcon;
  const ASSET_API_URL = process.env.ASSET_API_URL || "http://localhost:8787";
  const ASSET_API_TOKEN = "5VHJeXzqBorLO3NcRHRqLxU8y9gzOvjSsWE6IarufLQ";
  const {
    slug,
    src,
    size = 24,
    loop = false,
    autoplay = false,
    class: className = "",
    id
  } = Astro2.props;
  let animationData = null;
  if (slug) {
    try {
      const headers = {};
      if (ASSET_API_TOKEN) {
        headers["Authorization"] = `Bearer ${ASSET_API_TOKEN}`;
      }
      const res = await fetch(`${ASSET_API_URL}/v1/assets/${slug}`, { headers });
      if (res.ok) {
        animationData = await res.text();
      }
    } catch {
    }
  }
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`lottie-icon ${className}`, "class")} data-lottie-icon${addAttribute(loop, "data-lottie-loop")}${addAttribute(autoplay, "data-lottie-autoplay")}${addAttribute(`width: ${size}px; height: ${size}px;`, "style")}${addAttribute(id, "id")}${spreadAttributes(src && !animationData ? { "data-lottie-src": src } : {})}> <div class="lottie-icon__container" data-lottie-container></div> ${animationData && renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="application/json" data-lottie-data>', "</script>"])), unescapeHTML(animationData))} </div> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/atoms/icons/LottieIcon/LottieIcon.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/icons/LottieIcon/LottieIcon.astro", void 0);

const MAIN_NAV_LINKS = [
  { text: "Home", href: "/" },
  { text: "About", href: "/about" },
  { text: "Projects", href: "/projects" },
  { text: "Assets", href: "/assets" },
  { text: "Insights", href: "/insights" },
  { text: "Services", href: "/services" }
];
const NAV_ITEMS_WITH_MENUS = ["Assets", "Insights", "Services"];
const MEGA_MENUS = {
  assets: [
    { title: "All Assets", description: "Browse our complete collection of resources", href: "/assets", image: "/_Unused Images/Asset-Main-1.png" },
    { title: "Worksheets", description: "Interactive worksheets for personal growth", href: "/assets?filter=worksheet", image: "/_Unused Images/Asset-Main-2.png" },
    { title: "Workbooks", description: "Comprehensive workbooks for deeper learning", href: "/assets?filter=workbook", image: "/_Unused Images/Asset-Main-3.png" },
    { title: "Guides", description: "Step-by-step guides for your journey", href: "/assets?filter=guide", image: "/_Unused Images/Asset-Main-4.png" },
    { title: "Toolkits", description: "Complete toolkits with multiple resources", href: "/assets?filter=toolkit", image: "/_Unused Images/Asset-Main-1 (2).png" }
  ],
  insights: [
    { title: "All Insights", description: "Browse all articles and blog posts", href: "/insights", image: "/_Unused Images/Articles hero Image.png" },
    { title: "Latest Articles", description: "Read our most recent publications", href: "/insights", image: "/_Unused Images/Article Hero Card.png" },
    { title: "Featured Stories", description: "Inspiring stories from our community", href: "/insights", image: "/_Unused Images/3.jpg" }
  ],
  services: [
    { title: "All Services", description: "Explore our full range of services", href: "/services", image: "/_Unused Images/1.png" },
    { title: "Workshops", description: "Join our interactive group sessions", href: "/services#workshops", image: "/_Unused Images/6.png" },
    { title: "Consultations", description: "One-on-one personalized support", href: "/services#consultations", image: "/_Unused Images/contact us 1.jpg" }
  ],
  settings: [
    { title: "Contact", description: "", href: "/contact", icon: "mail" },
    { title: "Share", description: "", href: "#share", icon: "share" },
    { title: "Search", description: "", href: "#search", icon: "search" },
    { title: "Accessibility", description: "", href: "#accessibility", icon: "eye" }
  ]
};

const $$GlassNav = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<nav class="nav-container" id="main-nav"> <div class="nav-content"> <!-- Mobile Hamburger Menu --> <button class="hamburger-menu mobile-only" id="hamburger-btn" aria-label="Toggle menu"> <svg viewBox="0 0 64 48"> <path d="M19,15 L45,15 C70,15 58,-2 49.0177126,7 L19,37"></path> <path d="M19,24 L45,24 C61.2371586,24 57,49 41,33 L32,24"></path> <path d="M45,33 L19,33 C-8,33 6,-2 22,14 L45,37"></path> </svg> </button> <!-- Logo --> <a href="/" class="nav-logo"> <img src="/Logo/BrandLogoFooter.png" alt="Walking With A Smile" class="logo-image"> </a> <!-- Mobile Cart Icon --> <div class="mobile-nav-icons mobile-only"> <a href="/checkout" class="mobile-icon-btn mobile-cart-btn" aria-label="Cart"> <img src="/Icons/phosphor/a11y/basket-fill.svg" alt="" class="mobile-basket-icon" aria-hidden="true"> </a> </div> <!-- Desktop Navigation Links --> <div class="nav-links desktop-only"> ${MAIN_NAV_LINKS.map((link) => NAV_ITEMS_WITH_MENUS.includes(link.text) ? renderTemplate`<a${addAttribute(link.href, "href")} class="nav-item-expandable"${addAttribute(link.text.toLowerCase(), "data-expand")}> ${link.text} </a>` : renderTemplate`<a${addAttribute(link.href, "href")}>${link.text}</a>`)} <!-- Nav Icon Buttons --> <div class="nav-icon-group"> <!-- Search Icon --> <button class="nav-icon-btn nav-icon-btn--lottie" data-action="open-search" aria-label="Search"> ${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": "/Icons/Animated Icons/Search/Lottie-search.json", "size": 24, "class": "nav-lottie-icon" })} ${renderComponent($$result, "Icon", $$Icon, { "name": "magnifying-glass-fill", "size": 24, "class": "nav-static-icon" })} </button> <!-- Accessibility Icon --> <button class="nav-icon-btn nav-icon-btn--lottie" data-action="open-a11y-panel" aria-label="Accessibility"> ${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": "/Icons/Animated Icons/Visibility V3/visibility-V3.json", "size": 24, "class": "nav-lottie-icon" })} ${renderComponent($$result, "Icon", $$Icon, { "name": "eye-fill", "size": 24, "class": "nav-static-icon" })} </button> <!-- Contact Page Link --> <a href="/contact" class="nav-icon-btn nav-icon-btn--lottie" aria-label="Contact Us"> ${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": "/Icons/Animated Icons/Mail/mail.json", "size": 24, "class": "nav-lottie-icon" })} ${renderComponent($$result, "Icon", $$Icon, { "name": "envelope-fill", "size": 24, "class": "nav-static-icon" })} </a> </div> ${renderComponent($$result, "CartIcon", $$CartIcon, {})} </div> </div> <!-- Expandable Mega Menus --> ${Object.entries(MEGA_MENUS).map(([key, items]) => renderTemplate`<div${addAttribute(`expandable-menu expandable-menu-${key}`, "class")}> <div class="expandable-menu-wrapper"> ${items.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`expandable-item ${item.icon ? "expandable-item--icon" : ""} ${item.image ? "expandable-item--has-media" : ""}`, "class")}${addAttribute(
    item.href === "#share" ? "copy-link" : item.href === "#search" ? "open-search" : item.href === "#accessibility" ? "open-a11y-panel" : null,
    "data-action"
  )}> ${item.image && renderTemplate`<div class="expandable-media"> <img${addAttribute(item.image, "src")} alt="" class="expandable-media__img"> </div>`} ${item.icon === "mail" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "envelope-fill", "size": 20, "class": "expandable-icon" })}`} ${item.icon === "share" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "share-network-fill", "size": 20, "class": "expandable-icon" })}`} ${item.icon === "search" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "magnifying-glass-fill", "size": 20, "class": "expandable-icon" })}`} ${item.icon === "eye" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "eye-fill", "size": 20, "class": "expandable-icon" })}`} <div class="expandable-item__content"> <h3>${item.title}</h3> ${item.description && renderTemplate`<p>${item.description}</p>`} </div> </a>`)} </div> </div>`)} <!-- Mobile Menu Items --> <div class="mobile-menu-icons mobile-only"> <button class="mobile-menu-icon-btn" data-action="open-search" aria-label="Search"> ${renderComponent($$result, "Icon", $$Icon, { "name": "magnifying-glass-fill", "size": 24 })} </button> <a href="/contact" class="mobile-menu-icon-btn" aria-label="Contact Us"> ${renderComponent($$result, "Icon", $$Icon, { "name": "envelope-fill", "size": 24 })} </a> <button class="mobile-menu-icon-btn" data-action="open-a11y-panel" aria-label="Accessibility"> ${renderComponent($$result, "Icon", $$Icon, { "name": "eye-fill", "size": 24 })} </button> <a href="/checkout" class="mobile-menu-icon-btn mobile-menu-cart" aria-label="Cart"> ${renderComponent($$result, "Icon", $$Icon, { "name": "basket-fill", "size": 24 })} </a> </div> <ul class="mobile-menu-list mobile-only"> ${MAIN_NAV_LINKS.map((link) => renderTemplate`<li><a${addAttribute(link.href, "href")}>${link.text}</a></li>`)} </ul> </nav> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/organisms/nav/GlassNav.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/nav/GlassNav.astro", void 0);

const BRAND_CONFIG = {
  name: "Walking with a Smile",
  contact: {
    email: "hello@walkingwithasmile.com",
    responseTime: "We aim to respond within 2 working days"
  },
  seo: {
    defaultTitle: "Walking with a Smile | Your Tagline",
    defaultDescription: "Supporting trauma recovery and healing.",
    defaultImage: "/Logo/SEO Image.png"
  },
  footer: {
    defaultImage: "/Footer/Footer-Reveal.png"
  }
};

const $$Astro$7 = createAstro("https://yourdomain.com");
const $$RevealCanvas = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$RevealCanvas;
  const {
    backgroundImage = BRAND_CONFIG.footer.defaultImage,
    canvasId = "reveal-canvas",
    shape = "circle",
    icon = "heart",
    iconWeight = "regular",
    cellSize = 30,
    proximity = 125,
    growth = 60,
    ease = 0.075,
    class: className = ""
  } = Astro2.props;
  const iconSrc = shape === "icon" ? `/Icons/phosphor/${icon}${iconWeight !== "regular" ? `-${iconWeight}` : ""}.svg` : "";
  return renderTemplate`${maybeRenderHead()}<canvas${addAttribute(canvasId, "id")}${addAttribute(["reveal-canvas", className], "class:list")} aria-hidden="true"${addAttribute(backgroundImage, "data-bg-image")}${addAttribute(shape, "data-shape")}${addAttribute(iconSrc || void 0, "data-icon-src")}${addAttribute(cellSize, "data-cell-size")}${addAttribute(proximity, "data-proximity")}${addAttribute(growth, "data-growth")}${addAttribute(ease, "data-ease")}></canvas> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/atoms/canvas/RevealCanvas/RevealCanvas.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/canvas/RevealCanvas/RevealCanvas.astro", void 0);

const $$Astro$6 = createAstro("https://yourdomain.com");
const $$Heading = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Heading;
  const {
    level,
    size,
    weight,
    color,
    family,
    align,
    uppercase = false,
    tracking,
    flush = false,
    subtitle,
    divider,
    dividerColor = "primary",
    dividerStyle = "solid",
    dividerEnds = "rounded",
    dividerLength = "auto",
    variant = "default",
    underlineStyle = "solid",
    badgeColor = "primary",
    highlightColor = "primary",
    image,
    icon,
    mediaPosition = "left",
    mediaSize = "auto",
    iconColor = "text",
    iconStyle = "contained",
    spacing = "normal",
    class: className,
    ...rest
  } = Astro2.props;
  const Tag = `h${level}`;
  const visualSize = size ?? `h${level}`;
  const isDecorated = !!(divider || image || icon || subtitle || variant !== "default");
  const sizeKey = visualSize.replace("h", "");
  const iconSizeMap = { "1": 56, "2": 44, "3": 32, "4": 28, "5": 24, "6": 20 };
  const mediaSizeMapAuto = { "1": "lg", "2": "lg", "3": "md", "4": "md", "5": "sm", "6": "sm" };
  const computedMediaSize = mediaSize === "auto" ? mediaSizeMapAuto[sizeKey] ?? "md" : mediaSize;
  const computedIconSize = mediaSize === "auto" ? iconSizeMap[sizeKey] ?? 32 : mediaSize === "sm" ? 24 : mediaSize === "md" ? 32 : 56;
  const headingClasses = [
    "heading",
    `heading--${visualSize}`,
    weight ? `heading--weight-${weight}` : "",
    color ? `heading--color-${color}` : "",
    family ? `heading--family-${family}` : "",
    align ? `heading--align-${align}` : "",
    tracking ? `heading--tracking-${tracking}` : "",
    uppercase ? "heading--uppercase" : "",
    flush ? "heading--flush" : ""
  ].filter(Boolean).join(" ");
  const wrapperClasses = isDecorated ? [
    "heading-wrap",
    `heading-wrap--align-${align ?? "left"}`,
    `heading-wrap--spacing-${spacing}`,
    `heading-wrap--variant-${variant}`,
    divider ? `heading-wrap--divider-${divider}` : "",
    divider ? `heading-wrap--divider-color-${dividerColor}` : "",
    divider ? `heading-wrap--divider-ends-${dividerEnds}` : "",
    divider ? `heading-wrap--divider-length-${dividerLength}` : "",
    divider && dividerStyle !== "solid" ? `heading-wrap--divider-style-${dividerStyle}` : "",
    variant === "underline" ? `heading-wrap--underline-${underlineStyle}` : "",
    variant === "badge" ? `heading-wrap--badge-${badgeColor}` : "",
    variant === "highlight" ? `heading-wrap--highlight-${highlightColor}` : "",
    image || icon ? "heading-wrap--has-media" : "",
    image || icon ? `heading-wrap--media-${mediaPosition}` : "",
    image || icon ? `heading-wrap--media-size-${computedMediaSize}` : "",
    icon ? `heading-wrap--icon-${iconColor}` : "",
    icon ? `heading-wrap--icon-${iconStyle}` : "",
    className
  ].filter(Boolean).join(" ") : "";
  return renderTemplate`${isDecorated ? renderTemplate`${maybeRenderHead()}<div${addAttribute(wrapperClasses, "class")}>${(image || icon) && mediaPosition === "left" && renderTemplate`<div class="heading-wrap__media">${image ? renderTemplate`<img${addAttribute(image, "src")} alt="" class="heading-wrap__img">` : icon ? renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "size": computedIconSize, "class": "heading-wrap__icon" })}` : null}</div>`}${divider && (divider === "left" || divider === "both") && renderTemplate`<div class="heading-wrap__divider" aria-hidden="true"></div>`}<div class="heading-wrap__content">${renderComponent($$result, "Tag", Tag, { "class": headingClasses, ...rest }, { "default": ($$result2) => renderTemplate`${variant === "highlight" && renderTemplate`<span class="heading-wrap__highlight" aria-hidden="true"></span>`}<span class="heading-wrap__text-inner">${renderSlot($$result2, $$slots["default"])}</span>` })}${subtitle && renderTemplate`<p class="heading-wrap__subtitle">${subtitle}</p>`}${variant === "underline" && renderTemplate`<div class="heading-wrap__underline" aria-hidden="true"></div>`}</div>${divider && (divider === "right" || divider === "both") && renderTemplate`<div class="heading-wrap__divider" aria-hidden="true"></div>`}${(image || icon) && mediaPosition === "right" && renderTemplate`<div class="heading-wrap__media">${image ? renderTemplate`<img${addAttribute(image, "src")} alt="" class="heading-wrap__img">` : icon ? renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "size": computedIconSize, "class": "heading-wrap__icon" })}` : null}</div>`}</div>` : renderTemplate`${renderComponent($$result, "Tag", Tag, { "class:list": [headingClasses, className], ...rest }, { "default": ($$result2) => renderTemplate`${renderSlot($$result2, $$slots["default"])}` })}`}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Heading/Heading.astro", void 0);

const $$Astro$5 = createAstro("https://yourdomain.com");
const $$Link = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Link;
  const {
    href,
    variant = "default",
    color,
    weight,
    uppercase = false,
    flush = false,
    external = false,
    target: targetProp,
    download,
    rel: relProp,
    id,
    role,
    ariaLabel,
    class: className,
    ...rest
  } = Astro2.props;
  const target = external ? "_blank" : targetProp;
  const rel = external ? relProp ?? "noopener noreferrer" : relProp;
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-"))
  );
  const classes = [
    "text",
    "link",
    `link--${variant}`,
    color ? `link--color-${color}` : "",
    weight ? `link--weight-${weight}` : "",
    uppercase ? "link--uppercase" : "",
    flush ? "text--flush" : "",
    className
  ].filter(Boolean);
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")}${addAttribute(classes, "class:list")}${addAttribute(target, "target")}${addAttribute(download, "download")}${addAttribute(rel, "rel")}${addAttribute(id, "id")}${addAttribute(role, "role")}${addAttribute(ariaLabel, "aria-label")}${spreadAttributes(dataAttrs)}> ${renderSlot($$result, $$slots["default"])} </a>`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Link/Link.astro", void 0);

const $$Astro$4 = createAstro("https://yourdomain.com");
const $$Text = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Text;
  const {
    as: Tag = "p",
    size,
    weight,
    leading,
    color,
    family,
    align,
    uppercase = false,
    clamp,
    flush = false,
    class: className,
    ...rest
  } = Astro2.props;
  const classes = [
    "text",
    size ? `text--${size}` : "",
    weight ? `text--weight-${weight}` : "",
    leading ? `text--leading-${leading}` : "",
    color ? `text--color-${color}` : "",
    family ? `text--family-${family}` : "",
    align ? `text--align-${align}` : "",
    uppercase ? "text--uppercase" : "",
    clamp ? "text--clamp" : "",
    flush ? "text--flush" : "",
    className
  ].filter(Boolean).join(" ");
  const inlineStyle = clamp ? `--text-clamp: ${clamp}` : void 0;
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class": classes, "style": inlineStyle, ...rest }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Text/Text.astro", void 0);

const $$Astro$3 = createAstro("https://yourdomain.com");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Footer;
  const {
    animated = false,
    backgroundImage = BRAND_CONFIG.footer.defaultImage
  } = Astro2.props;
  const variant = animated ? "light" : "dark";
  const footerLinks = [
    { label: "Legal", href: "/legal/terms" },
    { label: "Contact Us", href: "#", id: "contactUsBtn", isAction: true },
    { label: "Cookie Settings", href: "#", id: "cookieSettings", isAction: true }
  ];
  return renderTemplate`${animated ? renderTemplate`${maybeRenderHead()}<div class="footer-mask">${renderComponent($$result, "RevealCanvas", $$RevealCanvas, { "backgroundImage": backgroundImage, "canvasId": "footer-canvas" })}<div class="footer-mask__content"><footer${addAttribute(`footer footer--${variant}`, "class")}><div class="footer__container container container-7xl"><div class="footer__brand-section"><img src="/Logo/BrandLogoFooter.png"${addAttribute(`${BRAND_CONFIG.name} logo`, "alt")} class="footer__logo" width="120" height="120">${renderComponent($$result, "Heading", $$Heading, { "level": 2, "flush": true, "weight": "bold", "color": "text", "class": "footer__brand-name" }, { "default": ($$result2) => renderTemplate`${BRAND_CONFIG.name}` })}</div><nav class="footer__nav" aria-label="Footer navigation">${footerLinks.map((link, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Link", $$Link, { "href": link.href, "variant": "glass", "uppercase": true, "weight": "extrabold", "class": "footer__link", "id": link.id, "role": link.isAction ? "button" : void 0 }, { "default": ($$result3) => renderTemplate`${link.label}` })}${index < footerLinks.length - 1 && renderTemplate`<span class="footer__nav-dot" aria-hidden="true"></span>`}` })}`)}</nav>${renderComponent($$result, "Text", $$Text, { "flush": true, "align": "center", "color": "text-light", "class": "footer__copyright" }, { "default": ($$result2) => renderTemplate`<span class="footer__copyright-date">© ${(/* @__PURE__ */ new Date()).getFullYear()}</span>${" "}<span class="footer__copyright-name"><strong>${BRAND_CONFIG.name}</strong>.</span>${" "}<span class="footer__copyright-rights">All rights reserved.</span>` })}</div></footer></div></div>` : renderTemplate`<footer${addAttribute(`footer footer--${variant}`, "class")}><div class="footer__container container container-7xl"><div class="footer__brand-section"><img src="/Logo/BrandLogoFooter.png"${addAttribute(`${BRAND_CONFIG.name} logo`, "alt")} class="footer__logo" width="120" height="120">${renderComponent($$result, "Heading", $$Heading, { "level": 2, "flush": true, "weight": "bold", "color": "text", "class": "footer__brand-name" }, { "default": ($$result2) => renderTemplate`${BRAND_CONFIG.name}` })}</div><nav class="footer__nav" aria-label="Footer navigation">${footerLinks.map((link, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "Link", $$Link, { "href": link.href, "variant": "glass", "uppercase": true, "weight": "extrabold", "class": "footer__link", "id": link.id, "role": link.isAction ? "button" : void 0 }, { "default": ($$result3) => renderTemplate`${link.label}` })}${index < footerLinks.length - 1 && renderTemplate`<span class="footer__nav-dot" aria-hidden="true"></span>`}` })}`)}</nav>${renderComponent($$result, "Text", $$Text, { "flush": true, "align": "center", "color": "text-light", "class": "footer__copyright" }, { "default": ($$result2) => renderTemplate`<span class="footer__copyright-date">© ${(/* @__PURE__ */ new Date()).getFullYear()}</span>${" "}<span class="footer__copyright-name"><strong>${BRAND_CONFIG.name}</strong>.</span>${" "}<span class="footer__copyright-rights">All rights reserved.</span>` })}</div></footer>`}${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/organisms/Footer/Footer.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/Footer/Footer.astro", void 0);

const $$Astro$2 = createAstro("https://yourdomain.com");
const $$Button = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant = "primary",
    shape = "rounded",
    size = "md",
    effect,
    speed,
    alignment,
    type = "button",
    disabled = false,
    id,
    href,
    target,
    download,
    icon,
    iconPosition = "left",
    iconCollection,
    iconMorphTo,
    iconMorphColor,
    iconDraw,
    iconDrawColor,
    lottieIcon,
    lottieLoop = false,
    ariaLabel,
    confetti,
    confettiTrigger = "click",
    confettiCount = 30,
    confettiSpread = 150,
    dropdownItems = [],
    class: className = "",
    ...rest
  } = Astro2.props;
  const dataAttrs = Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-"))
  );
  const isLink = !!href;
  const isDropdown = shape === "dropdown";
  const hasIcon = !!icon || !!lottieIcon;
  const isIconOnly = hasIcon && (shape === "circle" || shape === "square");
  const iconSizes = { sm: 18, md: 22, lg: 26 };
  const iconSize = iconSizes[size] || 18;
  const iconName = icon ? iconCollection ? `${iconCollection}/${icon}` : icon : "";
  const iconAnimProps = {
    ...iconMorphTo ? { morphTo: iconMorphTo } : {},
    ...iconMorphColor ? { morphColor: iconMorphColor } : {},
    ...iconDraw ? { draw: iconDraw } : {},
    ...iconDrawColor ? { drawColor: iconDrawColor } : {}
  };
  const classes = [
    "text",
    "btn",
    `btn--${variant}`,
    `btn--${shape}`,
    size !== "md" && `btn--${size}`,
    effect && `btn--${effect}`,
    speed && `btn--speed-${speed}`,
    hasIcon && `btn--icon-${iconPosition}`,
    isIconOnly && "btn--icon-only",
    confetti && "btn--confetti",
    confetti === "hearts" && "btn--confetti-hearts",
    confetti === "celebration" && "btn--confetti-celebration",
    alignment && `btn-align--${alignment}`,
    className
  ].filter(Boolean);
  const confettiAttrs = confetti ? {
    "data-particle-burst": "",
    "data-particle-type": confetti === "celebration" ? "mixed" : confetti,
    "data-particle-trigger": confettiTrigger,
    "data-particle-count": String(confettiCount),
    "data-particle-spread": String(confettiSpread)
  } : {};
  const useLottie = !!lottieIcon;
  const iconLeft = iconPosition === "left" && hasIcon;
  const iconRight = iconPosition === "right" && hasIcon;
  return renderTemplate`${isDropdown ? renderTemplate`${maybeRenderHead()}<div class="dropdown-wrapper"><button${addAttribute([...classes, "btn--dropdown", "dropdown-btn"], "class:list")}${addAttribute(type, "type")}${addAttribute(disabled, "disabled")}${addAttribute(id, "id")}${addAttribute(ariaLabel, "aria-label")} aria-expanded="false" aria-haspopup="true"${spreadAttributes(dataAttrs)}${spreadAttributes(confettiAttrs)}>${iconLeft && (useLottie ? renderTemplate`${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": lottieIcon, "size": iconSize, "class": "btn__icon", "loop": lottieLoop })}` : renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "size": iconSize, "class": "btn__icon", ...iconAnimProps })}`)}<span class="btn__label">${renderSlot($$result, $$slots["default"])}</span>${iconRight && (useLottie ? renderTemplate`${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": lottieIcon, "size": iconSize, "class": "btn__icon", "loop": lottieLoop })}` : renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "size": iconSize, "class": "btn__icon", ...iconAnimProps })}`)}${renderComponent($$result, "Icon", $$Icon, { "name": "caret-down-fill", "size": 14, "class": "btn__chevron" })}</button><div${addAttribute(`dropdown-menu dropdown-theme--${variant}`, "class")} role="menu">${dropdownItems.map((item) => item.href ? renderTemplate`<a${addAttribute(item.href, "href")} class="dropdown-item" role="menuitem">${item.label}</a>` : renderTemplate`<button type="button" class="dropdown-item"${addAttribute(item.value, "data-value")} role="menuitem"${addAttribute(item.fontFamily ? `font-family: ${item.fontFamily};` : void 0, "style")}>${item.label}</button>`)}</div></div>` : isLink ? renderTemplate`<a${addAttribute(href, "href")}${addAttribute(target, "target")}${addAttribute(download, "download")}${addAttribute(classes, "class:list")}${addAttribute(id, "id")}${addAttribute(disabled, "aria-disabled")}${addAttribute(ariaLabel, "aria-label")}${spreadAttributes(dataAttrs)}${spreadAttributes(confettiAttrs)}>${iconLeft && (useLottie ? renderTemplate`${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": lottieIcon, "size": iconSize, "class": "btn__icon", "loop": lottieLoop })}` : renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "size": iconSize, "class": "btn__icon", ...iconAnimProps })}`)}<span class="btn__label">${renderSlot($$result, $$slots["default"])}</span>${iconRight && (useLottie ? renderTemplate`${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": lottieIcon, "size": iconSize, "class": "btn__icon", "loop": lottieLoop })}` : renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "size": iconSize, "class": "btn__icon", ...iconAnimProps })}`)}</a>` : renderTemplate`<button${addAttribute(classes, "class:list")}${addAttribute(type, "type")}${addAttribute(disabled, "disabled")}${addAttribute(id, "id")}${addAttribute(ariaLabel, "aria-label")}${spreadAttributes(dataAttrs)}${spreadAttributes(confettiAttrs)}>${iconLeft && (useLottie ? renderTemplate`${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": lottieIcon, "size": iconSize, "class": "btn__icon", "loop": lottieLoop })}` : renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "size": iconSize, "class": "btn__icon", ...iconAnimProps })}`)}<span class="btn__label">${renderSlot($$result, $$slots["default"])}</span>${iconRight && (useLottie ? renderTemplate`${renderComponent($$result, "LottieIcon", $$LottieIcon, { "src": lottieIcon, "size": iconSize, "class": "btn__icon", "loop": lottieLoop })}` : renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "size": iconSize, "class": "btn__icon", ...iconAnimProps })}`)}</button>`}${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Button/Button.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Button/Button.astro?astro&type=script&index=1&lang.ts")}${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Button/Button.astro?astro&type=script&index=2&lang.ts")}${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Button/Button.astro?astro&type=script&index=3&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Button/Button.astro", void 0);

const $$CookieBanner = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="cookie-banner" id="cookieBanner"> <div class="cookie-banner-content"> <div class="cookie-banner-text"> <h3 class="cookie-banner-title">🍪 We use cookies</h3> <p class="cookie-banner-description">
We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
        By clicking "Accept All", you consent to our use of cookies.
<a href="/cookie-policy" class="cookie-link">Learn more</a> </p> </div> <div class="cookie-banner-actions"> ${renderComponent($$result, "Button", $$Button, { "variant": "ghost", "size": "sm", "class": "cookie-btn", "id": "cookieReject" }, { "default": ($$result2) => renderTemplate`Reject All` })} ${renderComponent($$result, "Button", $$Button, { "variant": "secondary", "size": "sm", "class": "cookie-btn", "id": "cookieCustomize" }, { "default": ($$result2) => renderTemplate`Customize` })} ${renderComponent($$result, "Button", $$Button, { "variant": "primary", "size": "sm", "class": "cookie-btn", "id": "cookieAccept" }, { "default": ($$result2) => renderTemplate`Accept All` })} </div> </div> <!-- Cookie Customization Panel --> <div class="cookie-customize-panel" id="cookieCustomizePanel" style="display: none;"> <h3 class="cookie-panel-title">Cookie Preferences</h3> <div class="cookie-options"> <!-- Essential Cookies --> <div class="cookie-option"> <div class="cookie-option-header"> <label class="cookie-option-label"> <input type="checkbox" checked disabled class="cookie-checkbox"> <h4 class="cookie-option-title">Essential Cookies</h4> </label> <span class="cookie-required">Required</span> </div> <p class="cookie-option-description">
These cookies are necessary for the website to function and cannot be switched off.
</p> </div> <!-- Analytics Cookies --> <div class="cookie-option"> <div class="cookie-option-header"> <label class="cookie-option-label"> <input type="checkbox" id="analyticsConsent" class="cookie-checkbox"> <h4 class="cookie-option-title">Analytics Cookies</h4> </label> </div> <p class="cookie-option-description">
Help us understand how visitors interact with our website by collecting and reporting information anonymously.
</p> </div> <!-- Marketing Cookies --> <div class="cookie-option"> <div class="cookie-option-header"> <label class="cookie-option-label"> <input type="checkbox" id="marketingConsent" class="cookie-checkbox"> <h4 class="cookie-option-title">Marketing Cookies</h4> </label> </div> <p class="cookie-option-description">
Used to track visitors across websites to display relevant advertisements.
</p> </div> </div> <div class="cookie-panel-actions"> ${renderComponent($$result, "Button", $$Button, { "variant": "ghost", "size": "sm", "id": "cookiePanelCancel" }, { "default": ($$result2) => renderTemplate`Cancel` })} ${renderComponent($$result, "Button", $$Button, { "variant": "primary", "size": "sm", "id": "cookiePanelSave" }, { "default": ($$result2) => renderTemplate`Save Preferences` })} </div> </div> </div> <!-- CSS extracted to: src/styles/components/cookie-banner.css --> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/molecules/global/CookieBanner.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/molecules/global/CookieBanner.astro", void 0);

const $$MiniCart = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="mini-cart" id="mini-cart"> <div class="mini-cart__header"> <h4 class="mini-cart__title">ORDER</h4> <a href="/checkout" class="mini-cart__edit">EDIT CART</a> </div> <div class="mini-cart__items" id="mini-cart-items"> <!-- Items rendered by JS --> </div> <div class="mini-cart__summary" id="mini-cart-summary"> <div class="mini-cart__row"> <span>Subtotal</span> <span id="mini-cart-subtotal">Free</span> </div> <div class="mini-cart__row"> <span>Shipping</span> <span id="mini-cart-shipping">Instant</span> </div> <div class="mini-cart__row mini-cart__row--total"> <span>Total</span> <span id="mini-cart-total">Free</span> </div> </div> <a href="/checkout" class="mini-cart__checkout">PROCEED TO CHECKOUT</a> </div>  ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/organisms/shop/MiniCart.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/shop/MiniCart.astro", void 0);

const $$Announcer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Live Region for Announcements (polite) -->${maybeRenderHead()}<div id="a11y-announcer" class="sr-only" aria-live="polite" aria-atomic="true"></div> <!-- Alert Region for Urgent Announcements (assertive) --> <div id="a11y-alert" class="sr-only" role="alert" aria-live="assertive" aria-atomic="true"></div>`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/a11y/Announcer/Announcer.astro", void 0);

const $$ThemeSidebar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<aside class="a11y-panel__sidebar" data-astro-cid-5pd63kbt> <!-- Theme cards are dynamically generated by ThemePreviewTokens.js --> <div class="a11y-theme-list" data-astro-cid-5pd63kbt></div> </aside> `;
}, "C:/Users/Business/Website v2.36/src/components/organisms/a11y/ThemeSidebar.astro", void 0);

const $$Astro$1 = createAstro("https://yourdomain.com");
const $$PresetButton = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PresetButton;
  const { preset, icon, title, iconSize = 40 } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button class="a11y-preset-btn"${addAttribute(preset, "data-preset")}${addAttribute(`${title} optimized settings`, "aria-label")}> ${renderComponent($$result, "Icon", $$Icon, { "name": `a11y-panel/${icon}`, "size": iconSize, "color": "var(--brand-c-primary)", "class": "a11y-preset-btn__icon" })} <h4 class="a11y-preset-btn__title">${title}</h4> </button>`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/a11y/PresetButton/PresetButton.astro", void 0);

const $$AccessibilityPanel = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Screen Reader Announcer -->${renderComponent($$result, "Announcer", $$Announcer, {})} <!-- Accessibility Panel (modal) --> ${maybeRenderHead()}<div class="a11y-panel" id="a11y-panel" role="dialog" aria-label="Accessibility settings" aria-modal="true" hidden> <div class="a11y-panel__header"> <h2 class="a11y-panel__title">
Accessibility Panel
</h2> <div class="a11y-panel__header-actions"> <button class="btn btn--sm btn--primary" id="a11y-download-pdf" aria-label="Download page as PDF"> ${renderComponent($$result, "Icon", $$Icon, { "name": "a11y-panel/download-fill", "size": 18 })} <span>Download Page as PDF</span> </button> <button class="btn btn--sm btn--ghost" id="a11y-reset" aria-label="Reset all settings"> ${renderComponent($$result, "Icon", $$Icon, { "name": "a11y-panel/arrow-counter-clockwise-fill", "size": 18 })} <span>Reset All</span> </button> <button class="a11y-panel__close" type="button" aria-label="Close accessibility panel"> ${renderComponent($$result, "Icon", $$Icon, { "name": "x-circle-fill", "size": 40 })} </button> </div> </div> <div class="a11y-panel__body"> <!-- Quick Presets --> <div class="a11y-panel__section"> <h3 class="a11y-panel__section-title">Presets</h3> <div class="a11y-panel__presets-grid"> ${renderComponent($$result, "PresetButton", $$PresetButton, { "preset": "dyslexia", "icon": "text-aa-fill", "title": "Dyslexia" })} ${renderComponent($$result, "PresetButton", $$PresetButton, { "preset": "low-vision", "icon": "eye-fill", "title": "Low Vision" })} ${renderComponent($$result, "PresetButton", $$PresetButton, { "preset": "color-blind", "icon": "palette-fill", "title": "Color Blind" })} ${renderComponent($$result, "PresetButton", $$PresetButton, { "preset": "motor", "icon": "hand-palm-fill", "title": "Motor" })} ${renderComponent($$result, "PresetButton", $$PresetButton, { "preset": "cognitive", "icon": "brain-fill", "title": "Cognitive" })} ${renderComponent($$result, "PresetButton", $$PresetButton, { "preset": "easyread", "icon": "book-open-fill", "title": "Easy Read" })} </div> </div> <!-- Theme Cards --> <div class="a11y-panel__section"> <h3 class="a11y-panel__section-title">Theme</h3> ${renderComponent($$result, "ThemeSidebar", $$ThemeSidebar, {})} </div> </div> <!-- Link to full settings page --> <div class="a11y-panel__footer"> <a href="/accessibility" class="a11y-panel__all-settings-link">
All accessibility settings
${renderComponent($$result, "Icon", $$Icon, { "name": "arrow-right-fill", "size": 18 })} </a> </div> </div> <!-- Backdrop --> <div class="a11y-panel__backdrop" hidden></div> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/organisms/a11y/AccessibilityPanel.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/a11y/AccessibilityPanel.astro", void 0);

const $$ContactPopup = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Popup Overlay (hidden by default) -->${maybeRenderHead()}<div id="contactPopup" class="contact-popup"${addAttribute(BRAND_CONFIG.contact.email, "data-contact-email")} data-astro-cid-64dlb42v> <div class="contact-popup__container" data-astro-cid-64dlb42v> <!-- Header --> <div class="contact-popup__header" data-astro-cid-64dlb42v> <button id="closePopup" class="contact-popup__close contact-popup__close--mobile" aria-label="Close" data-astro-cid-64dlb42v> ${renderComponent($$result, "Icon", $$Icon, { "name": "contact-popup/x-fill", "size": 32, "class": "contact-popup__icon", "data-astro-cid-64dlb42v": true })} </button> <div class="contact-popup__header-content" data-astro-cid-64dlb42v> <h2 data-astro-cid-64dlb42v>Let's have a <span class="contact-popup__highlight" data-astro-cid-64dlb42v>conversation</span></h2> <p class="contact-popup__subtitle" data-astro-cid-64dlb42v>Reach out when you're ready. No pressure.</p> </div> <div class="contact-popup__info" data-astro-cid-64dlb42v> <div class="contact-popup__info-item" data-astro-cid-64dlb42v> ${renderComponent($$result, "Icon", $$Icon, { "name": "contact-popup/envelope-fill", "size": 18, "class": "contact-popup__icon", "data-astro-cid-64dlb42v": true })} <span data-astro-cid-64dlb42v>${BRAND_CONFIG.contact.email}</span> </div> <div class="contact-popup__info-item" data-astro-cid-64dlb42v> ${renderComponent($$result, "Icon", $$Icon, { "name": "contact-popup/timer-fill", "size": 18, "class": "contact-popup__icon", "data-astro-cid-64dlb42v": true })} <span data-astro-cid-64dlb42v>${BRAND_CONFIG.contact.responseTime}</span> </div> </div> </div> <!-- Form Section --> <div class="contact-popup__form-wrapper" data-astro-cid-64dlb42v> <button id="closePopupDesktop" class="contact-popup__close contact-popup__close--desktop" aria-label="Close" data-astro-cid-64dlb42v> ${renderComponent($$result, "Icon", $$Icon, { "name": "contact-popup/x-fill", "size": 32, "class": "contact-popup__icon", "data-astro-cid-64dlb42v": true })} </button> <!-- Form --> <form class="form" id="contactForm" data-astro-cid-64dlb42v> <div class="contact-popup__topics" data-astro-cid-64dlb42v> <h3 data-astro-cid-64dlb42v>I'd like to chat about...</h3> <div class="contact-popup__topic-list" data-astro-cid-64dlb42v> <button type="button" class="btn btn--outline btn--pill btn--sm contact-popup__topic-btn" data-topic="General enquiry" data-astro-cid-64dlb42v>
General enquiry
</button> <button type="button" class="btn btn--outline btn--pill btn--sm contact-popup__topic-btn" data-topic="Service enquiry" data-astro-cid-64dlb42v>
Service enquiry
</button> <button type="button" class="btn btn--outline btn--pill btn--sm contact-popup__topic-btn" data-topic="Resources" data-astro-cid-64dlb42v>
Resources
</button> <button type="button" class="btn btn--outline btn--pill btn--sm contact-popup__topic-btn" data-topic="This page" data-include-page="true" data-astro-cid-64dlb42v>
This page
</button> <button type="button" class="btn btn--outline btn--pill btn--sm contact-popup__topic-btn" data-topic="Feedback" data-astro-cid-64dlb42v>
Feedback
</button> <button type="button" class="btn btn--outline btn--pill btn--sm contact-popup__topic-btn" data-topic="Other" data-astro-cid-64dlb42v>
Other
</button> </div> </div> <div class="form__fields" data-astro-cid-64dlb42v> <div class="form__group" data-astro-cid-64dlb42v> <label for="contactName" class="form__label" data-astro-cid-64dlb42v>Your name</label> <input type="text" id="contactName" name="name" class="form__input" required data-astro-cid-64dlb42v> </div> <div class="form__group" data-astro-cid-64dlb42v> <label for="contactEmail" class="form__label" data-astro-cid-64dlb42v>Your email</label> <input type="email" id="contactEmail" name="email" class="form__input" required data-astro-cid-64dlb42v> </div> <div class="form__group" data-astro-cid-64dlb42v> <label for="contactMessage" class="form__label" data-astro-cid-64dlb42v>Your message</label> <textarea id="contactMessage" name="message" rows="3" class="form__input form__input--textarea" required data-astro-cid-64dlb42v></textarea> </div> <button type="submit" id="submitContact" class="btn btn--primary" disabled data-astro-cid-64dlb42v>
Send Message
</button> </div> </form> <!-- Success Message Section (hidden by default) --> <div class="contact-popup__success" id="successMessage" style="display: none;" data-astro-cid-64dlb42v> <div class="contact-popup__success-content" data-astro-cid-64dlb42v> <div class="contact-popup__success-icon" data-astro-cid-64dlb42v> ${renderComponent($$result, "Icon", $$Icon, { "name": "contact-popup/check-circle-fill", "size": 32, "data-astro-cid-64dlb42v": true })} </div> <h3 data-astro-cid-64dlb42v>Message Sent!</h3> <p data-astro-cid-64dlb42v>Thanks for reaching out. We'll get back to you soon.</p> <button type="button" class="btn btn--primary contact-popup__success-btn" data-astro-cid-64dlb42v>Close</button> </div> </div> </div> </div> </div>  ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/molecules/contact/ContactPopup.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/molecules/contact/ContactPopup.astro", void 0);

const $$CustomScrollbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/molecules/global/CustomScrollbar/CustomScrollbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/molecules/global/CustomScrollbar/CustomScrollbar.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://yourdomain.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = BRAND_CONFIG.seo.defaultTitle,
    description = BRAND_CONFIG.seo.defaultDescription,
    image = BRAND_CONFIG.seo.defaultImage,
    hideFooter = false
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"', '><!-- Open Graph / Social Media --><meta property="og:type" content="website"><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><!-- Twitter/X sharing --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', "><title>", '</title><!-- Favicon --><link rel="icon" type="image/png" href="/Logo/Favicon.png"><!-- Font imports are now handled in src/Styles/fonts.css --><!-- Font Awesome (for icons) --><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><!-- Lottie Player for animated icons -->', "<!-- Local fonts loaded via global.css @import --><!-- Early accessibility state restoration (prevents flash) --><script>\n    // Restore text-only mode immediately before body renders\n    try {\n      const settings = JSON.parse(localStorage.getItem('a11y-settings') || '{}');\n      if (settings.textOnly) {\n        document.documentElement.classList.add('a11y-text-only-pending');\n      }\n    } catch (e) {}\n  <\/script>", `</head> <body data-btn-theme="flat"> <!-- Early a11y state restoration - adds classes to wrapper when it exists --> <script>
    // Wait for wrapper to exist, then apply saved a11y classes
    const observer = new MutationObserver((mutations, obs) => {
      const wrapper = document.getElementById('a11y-content-wrapper');
      if (wrapper) {
        obs.disconnect();
        try {
          const settings = JSON.parse(localStorage.getItem('a11y-settings') || '{}');
          if (settings.textOnly) wrapper.classList.add('a11y-text-only');
          if (settings.highlightLinks) wrapper.classList.add('a11y-highlight-links');
          if (settings.reduceMotion) wrapper.classList.add('a11y-reduce-motion');
          if (settings.fontFamily && settings.fontFamily !== 'default') {
            wrapper.classList.add('a11y-font-' + settings.fontFamily);
          }
          if (settings.fontSize && settings.fontSize !== 100) {
            wrapper.style.fontSize = settings.fontSize + '%';
          }
        } catch (e) {}
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  <\/script> <!-- A11Y CONTENT WRAPPER - All a11y settings apply to this wrapper, NOT body --> <!-- This keeps the AccessibilityPanel immune from its own settings --> <div id="a11y-content-wrapper"> <!-- Navigation --> `, ' <!-- Main Content --> <main id="main-content"> ', " </main> <!-- Footer --> ", " <!-- Cookie Consent Banner --> ", ' <!-- Toast Notifications Container (toasts are shown dynamically via JavaScript) --> <div id="toast-container"></div> <!-- Mini Cart Dropdown --> ', " <!-- Contact Popup --> ", " </div> <!-- Accessibility Panel - OUTSIDE the content wrapper so it's immune to settings --> ", " <!-- Custom Scrollbar - brand styled native scrollbar --> ", " <!-- Global Scripts --> ", " <!-- Analytics Placeholder --> ", " </body> </html>"])), addAttribute(description, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), title, renderScript($$result, "C:/Users/Business/Website v2.36/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts"), renderHead(), renderComponent($$result, "GlassNav", $$GlassNav, {}), renderSlot($$result, $$slots["default"]), !hideFooter && renderTemplate`${renderComponent($$result, "Footer", $$Footer, { "animated": true })}`, renderComponent($$result, "CookieBanner", $$CookieBanner, {}), renderComponent($$result, "MiniCart", $$MiniCart, {}), renderComponent($$result, "ContactPopup", $$ContactPopup, {}), renderComponent($$result, "AccessibilityPanel", $$AccessibilityPanel, {}), renderComponent($$result, "CustomScrollbar", $$CustomScrollbar, {}), renderScript($$result, "C:/Users/Business/Website v2.36/src/layouts/BaseLayout.astro?astro&type=script&index=1&lang.ts"), renderScript($$result, "C:/Users/Business/Website v2.36/src/layouts/BaseLayout.astro?astro&type=script&index=2&lang.ts"));
}, "C:/Users/Business/Website v2.36/src/layouts/BaseLayout.astro", void 0);

export { $$Icon as $, BRAND_CONFIG as B, $$BaseLayout as a, $$Footer as b, $$PresetButton as c, $$ThemeSidebar as d, $$Button as e, $$Heading as f, $$Text as g, $$Link as h, $$LottieIcon as i };
