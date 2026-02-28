globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, b as renderTemplate } from './astro/server_DSZs3x4S.mjs';
/* empty css                            */
import { $ as $$Icon } from './BaseLayout_RnOOHI6G.mjs';

const $$Astro = createAstro("https://yourdomain.com");
const $$Badge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Badge;
  const {
    label,
    color = "primary",
    variant = "fill",
    shape = "rounded",
    icon,
    uppercase = true,
    class: className
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span${addAttribute([
    "text",
    /* base typography from Text atom — sets font, color, line-height */
    "badge",
    `badge--${variant}`,
    `badge--${shape}`,
    color !== "primary" && `badge--c-${color}`,
    icon && "badge--has-icon",
    !uppercase && "badge--lowercase",
    className
  ], "class:list")}> ${icon && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "class": "badge__icon", "aria-hidden": "true" })}`} <span class="badge__label">${label}</span> </span>`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Badge/Badge.astro", void 0);

export { $$Badge as $ };
