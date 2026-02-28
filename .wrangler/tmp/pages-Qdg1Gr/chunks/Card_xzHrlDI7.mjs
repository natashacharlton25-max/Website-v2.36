globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, f as renderSlot } from './astro/server_DSZs3x4S.mjs';

const $$Astro = createAstro("https://yourdomain.com");
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const {
    as = "div",
    variant = "default",
    hover,
    shadow,
    dropShadow,
    radius,
    padding,
    border,
    layout,
    flush,
    href,
    separator,
    class: className,
    ...rest
  } = Astro2.props;
  const Tag = href ? "a" : as;
  const classes = [
    "card",
    `card--${variant}`,
    hover === true && "card--hover-lift",
    hover === "border" && "card--hover-border",
    hover === "glow" && "card--hover-glow",
    shadow && shadow !== "none" && `card--shadow-${shadow}`,
    dropShadow && dropShadow !== "none" && `card--drop-${dropShadow}`,
    radius && `card--radius-${radius}`,
    padding && `card--pad-${padding}`,
    border && border !== "none" && `card--border-${border}`,
    layout === "masonry" && "card--masonry",
    flush && "card--flush",
    href && "card--link",
    separator && "card--separator",
    className
  ].filter(Boolean);
  const linkAttrs = href ? {
    href,
    ...href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}
  } : {};
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class:list": classes, "data-card": true, ...linkAttrs, ...rest }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/ui/Card/Card.astro", void 0);

export { $$Card as $ };
