globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, b as renderTemplate, r as renderComponent } from './astro/server_DSZs3x4S.mjs';
import { $ as $$Icon } from './BaseLayout_RnOOHI6G.mjs';
/* empty css                          */

const $$Astro = createAstro("https://yourdomain.com");
const $$SectionTitle = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SectionTitle;
  const {
    title,
    subtitle,
    size = "lg",
    dividerColor = "primary",
    dividerPosition = "left",
    dividerStyle = "solid",
    dividerEnds = "rounded",
    dividerLength = "auto",
    textColor,
    uppercase = false,
    fontWeight = "bold",
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
    align = "left",
    spacing = "normal",
    class: className = ""
  } = Astro2.props;
  const iconSizeMap = { sm: 32, lg: 44 };
  const mediaSizeMap = { sm: "md", lg: "lg" };
  const computedMediaSize = mediaSize === "auto" ? mediaSizeMap[size] : mediaSize;
  const computedIconSize = mediaSize === "auto" ? iconSizeMap[size] : mediaSize === "sm" ? 24 : mediaSize === "md" ? 32 : 56;
  const classes = [
    "section-title",
    `section-title--${size}`,
    `section-title--align-${align}`,
    `section-title--spacing-${spacing}`,
    `section-title--weight-${fontWeight}`,
    `section-title--variant-${variant}`,
    variant === "default" ? `section-title--divider-${dividerPosition}` : "",
    variant === "default" ? `section-title--divider-${dividerColor}` : "",
    variant === "default" ? `section-title--divider-ends-${dividerEnds}` : "",
    variant === "default" ? `section-title--divider-length-${dividerLength}` : "",
    variant === "default" && dividerStyle !== "solid" ? `section-title--divider-style-${dividerStyle}` : "",
    variant === "underline" ? `section-title--underline-${underlineStyle}` : "",
    variant === "badge" ? `section-title--badge-${badgeColor}` : "",
    variant === "highlight" ? `section-title--highlight-${highlightColor}` : "",
    uppercase ? "section-title--uppercase" : "",
    image || icon ? `section-title--has-media` : "",
    image || icon ? `section-title--media-${mediaPosition}` : "",
    image || icon ? `section-title--media-size-${computedMediaSize}` : "",
    icon ? `section-title--icon-${iconColor}` : "",
    icon ? `section-title--icon-${iconStyle}` : "",
    className
  ].filter(Boolean).join(" ");
  const customStyle = textColor ? `--section-title-color: ${textColor};` : "";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(classes, "class")}${addAttribute(customStyle, "style")} data-astro-cid-zai74lhg>  ${(image || icon) && mediaPosition === "left" && renderTemplate`<div class="section-title__media" data-astro-cid-zai74lhg> ${image ? renderTemplate`<img${addAttribute(image, "src")} alt="" class="section-title__img" data-astro-cid-zai74lhg>` : icon ? renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "size": computedIconSize, "class": "section-title__icon", "data-astro-cid-zai74lhg": true })}` : null} </div>`}  ${variant === "default" && (dividerPosition === "left" || dividerPosition === "both") && renderTemplate`<div class="section-title__divider" data-astro-cid-zai74lhg></div>`}  <div class="section-title__content" data-astro-cid-zai74lhg> <h2 class="section-title__text" data-astro-cid-zai74lhg> ${variant === "highlight" && renderTemplate`<span class="section-title__highlight" data-astro-cid-zai74lhg></span>`} <span class="section-title__text-inner" data-astro-cid-zai74lhg>${title}</span> </h2> ${subtitle && renderTemplate`<p class="section-title__subtitle" data-astro-cid-zai74lhg>${subtitle}</p>`} ${variant === "underline" && renderTemplate`<div class="section-title__underline" data-astro-cid-zai74lhg></div>`} </div>  ${variant === "default" && (dividerPosition === "right" || dividerPosition === "both") && renderTemplate`<div class="section-title__divider" data-astro-cid-zai74lhg></div>`}  ${(image || icon) && mediaPosition === "right" && renderTemplate`<div class="section-title__media" data-astro-cid-zai74lhg> ${image ? renderTemplate`<img${addAttribute(image, "src")} alt="" class="section-title__img" data-astro-cid-zai74lhg>` : icon ? renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "size": computedIconSize, "class": "section-title__icon", "data-astro-cid-zai74lhg": true })}` : null} </div>`} </div> `;
}, "C:/Users/Business/Website v2.36/src/components/Typography/SectionTitle.astro", void 0);

export { $$SectionTitle as $ };
