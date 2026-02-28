globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderComponent, b as renderTemplate, d as addAttribute, s as spreadAttributes, F as Fragment, e as renderScript, u as unescapeHTML, f as renderSlot } from '../chunks/astro/server_DSZs3x4S.mjs';
import { $ as $$Icon, a as $$BaseLayout, b as $$Footer } from '../chunks/BaseLayout_RnOOHI6G.mjs';
import { $ as $$HeroSection } from '../chunks/HeroSection_Du39SrCP.mjs';
import { $ as $$SectionTitle } from '../chunks/SectionTitle_BlcI-eK5.mjs';
/* empty css                                 */
import { $ as $$ImageTextSection } from '../chunks/ImageTextSection_zRo-ItNa.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_KOHtTGSL.mjs';
import { $ as $$CTASection } from '../chunks/CTASection_cLWB3XuA.mjs';
import { $ as $$Card } from '../chunks/Card_xzHrlDI7.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$6 = createAstro("https://yourdomain.com");
const $$StorySection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$StorySection;
  const { title, content, image, icon } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="story section" data-astro-cid-7j6j2r3k> <div class="container" data-astro-cid-7j6j2r3k> <div class="story__content" data-astro-cid-7j6j2r3k> <!-- Section Title with Divider --> ${renderComponent($$result, "SectionTitle", $$SectionTitle, { "title": title, "size": "lg", "dividerColor": "primary", "image": image, "icon": icon, "iconColor": "primary", "iconStyle": "bare", "data-astro-cid-7j6j2r3k": true })} <!-- Story Text --> <div class="story__text" data-astro-cid-7j6j2r3k> ${content.map((paragraph) => renderTemplate`<p data-astro-cid-7j6j2r3k>${paragraph}</p>`)} </div> </div> </div> </section> `;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/StorySection.astro", void 0);

const $$Astro$5 = createAstro("https://yourdomain.com");
const $$PhilosophyFlipCardsSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$PhilosophyFlipCardsSection;
  const { title, intro, pillars, pillarImages } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="philosophy-flip section"> <div class="container"> <div class="philosophy-flip__content"> <h2 class="philosophy-flip__title">${title}</h2> <div class="philosophy-flip__intro"> ${intro.map((line, index) => renderTemplate`<p${addAttribute(`philosophy-flip__intro-line ${index === intro.length - 1 ? "philosophy-flip__intro-line--last" : ""}`, "class")}> ${line} </p>`)} </div> <!-- Pillar Cards with Hover Flip --> <div class="philosophy-flip__cards"> ${pillars.map((pillar, index) => renderTemplate`<div class="philosophy-flip__card"> <div class="philosophy-flip__card-inner"> <!-- Front --> <div class="philosophy-flip__card-front"> ${renderComponent($$result, "Image", $$Image, { "src": pillarImages[index], "alt": pillar.imageAlt, "loading": "lazy" })} <div class="philosophy-flip__card-title-overlay"> <h3>${pillar.title}</h3> </div> </div> <!-- Back --> <div class="philosophy-flip__card-back"> <div class="philosophy-flip__card-back-content"> <h3>${pillar.title}</h3> <p>${pillar.description}</p> </div> </div> </div> </div>`)} </div> </div> </div> </section>`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/PhilosophyFlipCardsSection.astro", void 0);

const $$Astro$4 = createAstro("https://yourdomain.com");
const $$ValuesSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$ValuesSection;
  const { title, values, icon } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="values-section section"> <div class="container"> <div class="values-section__header"> ${renderComponent($$result, "SectionTitle", $$SectionTitle, { "title": title, "size": "lg", "dividerColor": "primary", "icon": icon, "iconColor": "primary", "iconStyle": "bare" })} </div> <div class="values-section__list"> ${values.map((value) => renderTemplate`<div class="values-section__item"> <div class="values-section__number">${value.number}</div> <div class="values-section__content"> <h3 class="values-section__item-title">${value.title}</h3> <p class="values-section__item-text">${value.description}</p> </div> </div>`)} </div> </div> </section>`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/ValuesSection.astro", void 0);

const $$Astro$3 = createAstro("https://yourdomain.com");
const $$PatternOverlay = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$PatternOverlay;
  const {
    preset,
    icon,
    iconWeight = "thin",
    icons,
    smil,
    image,
    opacity,
    angle = 0,
    scale = 60,
    color = "var(--scroll-pattern-color, currentColor)",
    blend = "normal",
    spacing = 0,
    interactive = false,
    magnetic = false,
    scrollColor,
    scrollReveal,
    fallback = "none",
    class: className = ""
  } = Astro2.props;
  let mode = "preset";
  if (icons && icons.length > 0) mode = "grid";
  else if (smil && smil.length > 0) mode = "smil-grid";
  else if (icon) mode = "icon-mask";
  else if (image) mode = "image";
  const iconMaskUrl = icon ? `/Icons/phosphor/${icon}${iconWeight !== "regular" ? `-${iconWeight}` : ""}.svg` : "";
  const GRID_POOL_SIZE = 150;
  const tilePool = [];
  if (mode === "grid" && icons) {
    for (let i = 0; i < GRID_POOL_SIZE; i++) {
      tilePool.push(icons[i % icons.length]);
    }
  }
  const cssVars = [
    opacity !== void 0 ? `--po-opacity: ${opacity}` : "",
    `--po-angle: ${angle}deg`,
    `--po-scale: ${scale}px`,
    `--po-color: ${color}`,
    `--po-blend: ${blend}`,
    spacing > 0 ? `--po-spacing: ${spacing}px` : ""
  ].filter(Boolean).join("; ");
  const dataAttrs = {};
  if (scrollColor) dataAttrs["data-scroll-bg"] = scrollColor;
  if (scrollReveal) dataAttrs["data-scroll-reveal"] = scrollReveal;
  if (magnetic) dataAttrs["data-pattern-magnetic"] = "true";
  if (preset) dataAttrs["data-pattern-preset"] = preset;
  return renderTemplate`${(mode === "preset" || mode === "image" || mode === "icon-mask") && renderTemplate`${maybeRenderHead()}<div${addAttribute([
    "pattern-overlay",
    mode === "preset" && `pattern-overlay--preset-${preset}`,
    mode === "icon-mask" && "pattern-overlay--icon-mask",
    mode === "image" && "pattern-overlay--image",
    className
  ], "class:list")}${addAttribute([
    cssVars,
    mode === "icon-mask" ? `--po-mask-url: url('${iconMaskUrl}')` : "",
    mode === "image" ? `--po-image-url: url('${image}')` : ""
  ].filter(Boolean).join("; "), "style")} aria-hidden="true"${spreadAttributes(dataAttrs)}></div>`}${mode === "grid" && renderTemplate`<div${addAttribute([
    "pattern-overlay",
    "pattern-overlay--grid",
    interactive && "pattern-overlay--interactive",
    className
  ], "class:list")}${addAttribute(cssVars, "style")} aria-hidden="true"${spreadAttributes(dataAttrs)}>${tilePool.map((iconName) => renderTemplate`<div class="pattern-overlay__cell">${renderComponent($$result, "Icon", $$Icon, { "name": iconName, "size": scale * 0.6 })}</div>`)}</div>`}${mode === "smil-grid" && smil && renderTemplate`<div${addAttribute([
    "pattern-overlay",
    "pattern-overlay--grid",
    "pattern-overlay--smil",
    interactive && "pattern-overlay--interactive",
    className
  ], "class:list")}${addAttribute(cssVars, "style")} aria-hidden="true"${spreadAttributes(dataAttrs)}>${Array.from({ length: GRID_POOL_SIZE }).map((_, i) => renderTemplate`<div class="pattern-overlay__cell">${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(smil[i % smil.length])}` })}</div>`)}</div>`}${magnetic && renderTemplate`${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/atoms/effects/PatternOverlay/PatternOverlay.astro?astro&type=script&index=0&lang.ts")}`}`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/effects/PatternOverlay/PatternOverlay.astro", void 0);

const $$Astro$2 = createAstro("https://yourdomain.com");
const $$ParallaxDecor = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ParallaxDecor;
  const {
    scatter,
    starfield,
    icons = [],
    rings = [],
    dots = [],
    color,
    class: className = ""
  } = Astro2.props;
  const DEPTH_MIN = 0.2;
  const DEPTH_MAX = 2;
  const DEPTH_RANGE = DEPTH_MAX - DEPTH_MIN;
  function mulberry32(seed) {
    return () => {
      seed |= 0;
      seed = seed + 1831565813 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function generateScatter(config) {
    const {
      names,
      count = 25,
      depthRange = [0.2, 2],
      seed = 42
    } = config;
    const rand = mulberry32(seed);
    const [minD, maxD] = depthRange;
    const result = [];
    for (let i = 0; i < count; i++) {
      const depth = minD + rand() * (maxD - minD);
      const name = names[i % names.length];
      let x = rand() * 90 + 5;
      let y = rand() * 85 + 5;
      const t = (depth - minD) / (maxD - minD);
      const size = t < 0.35 ? "sm" : t < 0.7 ? "md" : "lg";
      const depthMix2 = Math.round(t * 100);
      const motionMode = config.motion === "depth" || !config.motion ? t < 0.35 ? "twinkle" : t < 0.7 ? "float" : "breathe" : config.motion;
      const stagger = rand() * 6;
      const speed = 8 - t * 6;
      result.push({ name, depth: Math.round(depth * 100) / 100, x, y, size, opacity: 1, depthMix: depthMix2, motion: motionMode, stagger, speed });
    }
    return result;
  }
  const scattered = scatter ? generateScatter(scatter).sort((a, b) => a.depth - b.depth) : [];
  function generateStarfield(config) {
    const {
      count = 80,
      depthRange = [0.05, 0.45],
      seed = 7
    } = config;
    const rand = mulberry32(seed);
    const [minD, maxD] = depthRange;
    const result = [];
    for (let i = 0; i < count; i++) {
      const depth = minD + rand() * (maxD - minD);
      const x = rand() * 96 + 2;
      const y = rand() * 94 + 3;
      const t = (depth - minD) / (maxD - minD);
      const size = 2 + t * 3;
      const opacity = 0.06 + t * 0.18;
      const twinkleDuration = 2.5 + rand() * 3;
      const twinkleDelay = rand() * 6;
      result.push({
        depth: Math.round(depth * 100) / 100,
        x,
        y,
        size,
        opacity,
        twinkleDuration,
        twinkleDelay
      });
    }
    return result;
  }
  const stars = starfield ? generateStarfield(starfield) : [];
  function posStyle(item) {
    const parts = [];
    if (item.top) parts.push(`top:${item.top}`);
    if (item.left) parts.push(`left:${item.left}`);
    if (item.right) parts.push(`right:${item.right}`);
    if (item.bottom) parts.push(`bottom:${item.bottom}`);
    return parts.join(";");
  }
  function depthMix(depth) {
    const t = Math.max(0, Math.min(1, (depth - DEPTH_MIN) / DEPTH_RANGE));
    return Math.round(t * 100);
  }
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`parallax-decor ${className}`, "class")} aria-hidden="true">  ${stars.map((star) => renderTemplate`<div class="parallax-decor__star"${addAttribute(star.depth, "data-depth")}${addAttribute(`top:${star.y}%;left:${star.x}%;width:${star.size.toFixed(1)}px;height:${star.size.toFixed(1)}px;--star-base:${star.opacity.toFixed(3)};--star-peak:${Math.min(star.opacity * 2.5, 0.6).toFixed(3)};--twinkle-dur:${star.twinkleDuration.toFixed(1)}s;--twinkle-delay:${star.twinkleDelay.toFixed(1)}s`, "style")}></div>`)}  ${scattered.map((s) => renderTemplate`<div${addAttribute(`parallax-decor__icon parallax-decor__icon--${s.size}`, "class")}${addAttribute(s.depth, "data-depth")}${addAttribute(`top:${s.y}%;left:${s.x}%;--depth-mix:${s.depthMix}`, "style")}> <div${addAttribute(s.motion, "data-motion")}${addAttribute(`--pm-drift-speed:${s.speed.toFixed(1)}s;--pm-stagger:${s.stagger.toFixed(1)}s`, "style")}> ${renderComponent($$result, "Icon", $$Icon, { "name": s.name })} </div> </div>`)}  ${icons.map((icon) => renderTemplate`<div${addAttribute(`parallax-decor__icon parallax-decor__icon--${icon.size || "md"}`, "class")}${addAttribute(icon.depth, "data-depth")}${addAttribute(posStyle(icon) + `;--depth-mix:${depthMix(icon.depth)}` + (color ? `;color:${color}` : ""), "style")}> <div${addAttribute(icon.motion || "breathe", "data-motion")}> ${renderComponent($$result, "Icon", $$Icon, { "name": icon.name })} </div> </div>`)} ${rings.map((ring) => renderTemplate`<div${addAttribute(`parallax-decor__ring parallax-decor__ring--${ring.size}`, "class")}${addAttribute(ring.depth, "data-depth")}${addAttribute(posStyle(ring) + (color ? `;border-color:${color}` : ""), "style")}></div>`)} ${dots.map((dot) => renderTemplate`<div${addAttribute(`parallax-decor__dot ${dot.size === "sm" ? "parallax-decor__dot--sm" : ""}`, "class")}${addAttribute(dot.depth, "data-depth")}${addAttribute(posStyle(dot) + (color ? `;background:${color}` : ""), "style")}></div>`)} </div>`;
}, "C:/Users/Business/Website v2.36/src/components/atoms/effects/ParallaxDecor/ParallaxDecor.astro", void 0);

const $$Astro$1 = createAstro("https://yourdomain.com");
const $$ScrollMorphZone = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ScrollMorphZone;
  const {
    sections = [],
    patternIcon = "wellness/heart-fill",
    patternScale = 120,
    patternOpacity = 0.3,
    cardDepth = 1.3,
    dark = true,
    scope = "section",
    class: className = ""
  } = Astro2.props;
  const hasSlot = Astro2.slots.has("default");
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`scroll-morph-zone ${className}`, "class")} data-scroll-morph${addAttribute(scope, "data-scope")}${addAttribute(`--zone-pattern-url: url('/Icons/phosphor/${patternIcon}.svg')`, "style")}> <!--
    interactive: renders individual DOM <svg><path> icons.
    MorphSVG needs real <path> elements — without interactive,
    PatternOverlay renders CSS mask-image which cannot be morphed.
  --> ${renderComponent($$result, "PatternOverlay", $$PatternOverlay, { "icons": [patternIcon], "opacity": patternOpacity, "scale": patternScale, "interactive": true })} ${hasSlot ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : sections.map((section) => renderTemplate`<section${addAttribute(`scroll-morph-zone__section ${dark ? "scroll-morph-zone__section--dark" : ""}`, "class")}${addAttribute(section.bg, "data-zone-bg")}${addAttribute(section.pattern, "data-scroll-pattern")}${addAttribute(section.icon, "data-scroll-icon")}${addAttribute(section.drawEffect || void 0, "data-scroll-effect")}> ${section.decor && renderTemplate`${renderComponent($$result, "ParallaxDecor", $$ParallaxDecor, { "icons": section.decor.icons, "rings": section.decor.rings, "dots": section.decor.dots })}`} ${(section.title || section.body) && renderTemplate`${renderComponent($$result, "Card", $$Card, { "variant": section.cardVariant || "liquid-glass", "radius": "xl", "padding": "xl", "data-depth": cardDepth }, { "default": ($$result2) => renderTemplate`${section.title && renderTemplate`<h3 class="card__title" style="text-transform:none; letter-spacing:normal;">${section.title}</h3>`}${section.body && renderTemplate`<p class="card__text">${section.body}</p>`}` })}`} </section>`)} </div> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/organisms/ScrollMorph/ScrollMorphZone.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/ScrollMorph/ScrollMorphZone.astro", void 0);

const heroImage = new Proxy({"src":"/_astro/Hero.DtaJDpHN.png","width":3392,"height":1692,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/About/Hero/Hero.png";
							}
							
							return target[name];
						}
					});

const purposeImage = new Proxy({"src":"/_astro/What-We-Do.CVBCa89d.png","width":1200,"height":1200,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/About/Purpose/What-We-Do.png";
							}
							
							return target[name];
						}
					});

const youFirstImage = new Proxy({"src":"/_astro/You-First.Cz4ohPX3.png","width":1200,"height":1200,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/About/Philosophy/You-First.png";
							}
							
							return target[name];
						}
					});

const yourChoicesImage = new Proxy({"src":"/_astro/Your-Choices.BmXAROK1.png","width":1200,"height":1200,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/About/Philosophy/Your-Choices.png";
							}
							
							return target[name];
						}
					});

const actuallyWorksImage = new Proxy({"src":"/_astro/Actually-Works.Bcy2LQoQ.png","width":1200,"height":1200,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/About/Philosophy/Actually-Works.png";
							}
							
							return target[name];
						}
					});

const title$5 = "About Us";
const subtitle = "We've walked parts of this journey too. Walking with a Smile wasn't built from a textbook. It came from real life, from knowing what it's like when your past takes up more room than your present, and from figuring out that it doesn't have to stay that way. We're not here to tell you what healing should look like. We've learned the hard way that everyone's path is different.";
const imageAlt$1 = "About Walking With A Smile";
const imagePosition$1 = "full";
const heroDataRaw = {
  title: title$5,
  subtitle,
  imageAlt: imageAlt$1,
  imagePosition: imagePosition$1,
};

const title$4 = "Our Story";
const content$2 = ["I spent most of my life thinking that constant stress, fear, and anxiety were just part of who I was. Like some people are tall, some people are funny, and I was just... anxious. Heavy. Always waiting for the next bad thing.","The weight of trauma felt like something I'd carry forever. I wasn't living, really. I was surviving. Keeping my head above water and calling it a life.","Then one day, I got tired of it. Not in a dramatic, lightning-bolt kind of way. Just quietly fed up. I thought: what if I stopped letting this thing run the show? What have I actually got to lose?","So I started pushing back. Slowly. Messily. Not perfectly. And something shifted.","When I finally stopped letting trauma be the first thing I introduced about myself, the whole world got bigger. I found out I actually liked who I was underneath all that weight. I could breathe. I could be curious about life instead of just bracing for it.","I didn't need to be \"the person who went through that thing\" anymore. I was just... me. And that was enough.","That's when I knew I wanted to create something for other people who might be ready for the same shift. Not a programme that tells you what to do. Not advice from someone who thinks they've got it all figured out. Just a space with useful stuff in it, for people to take what helps and leave the rest.","Because everyone deserves to feel lighter. Everyone deserves to walk with a smile."];
const storyDataRaw = {
  title: title$4,
  content: content$2,
};

const title$3 = "What We're Here To Do";
const content$1 = ["Walking with a Smile is about helping trauma survivors move from a life centred on pain to one centred on themselves.","That sounds big. But really, it's practical. It's resources you can actually use. A community that gets it. And a general philosophy of: you're in charge here, we're just offering tools.","We're not here to rescue anyone. We're not here to tell you how your healing should go. We're just here to open a few doors and let you decide which ones to walk through."];
const imageAlt = "What we do";
const imagePosition = "left";
const purposeDataRaw = {
  title: title$3,
  content: content$1,
  imageAlt,
  imagePosition,
};

const title$2 = "How We See Things";
const intro = ["We start with who you are, not what happened to you.","Trauma might have shaped parts of your story, but it's not the whole book.","Our approach comes down to three things:"];
const pillars = [{"id":"you-first","title":"You first","image":"You-First.png","imageAlt":"You first","description":"You're more than your worst experiences. Way more. We're here to help you reconnect with that, with the person underneath all the weight."},{"id":"your-choices","title":"Your choices","image":"Your-Choices.png","imageAlt":"Your choices","description":"Everything here is optional. We offer things that might help. You decide what actually does. No prescriptions, no \"you should really try this.\" Just options."},{"id":"aligned-to-you","title":"Aligned to you","image":"Actually-Works.png","imageAlt":"Aligned to you","description":"Real tools for real life. Not abstract concepts or things that only make sense in a therapy room. Small, doable things you can try today."}];
const philosophyDataRaw = {
  title: title$2,
  intro,
  pillars,
};

const title$1 = "What Matters To Us";
const values = [{"number":"01","title":"Empowerment","description":"You have more power than you probably think. We're here to remind you of that, not to swoop in and take over."},{"number":"02","title":"Being real","description":"No performing. No pretending you're further along than you are. You can show up here exactly as you are, messy bits and all."},{"number":"03","title":"Resilience","description":"Healing isn't a straight line. Some days are harder than others. We're not just here for the breakthroughs. We're here for the whole thing."},{"number":"04","title":"Hope","description":"Not toxic positivity. Not pretending everything's fine. Just a genuine belief that things can be different, and that you're capable of getting there."},{"number":"05","title":"Kindness","description":"We meet you where you are. No judgement, no timelines, no \"you should be over this by now.\" Everyone's path looks different. That's fine."}];
const valuesDataRaw = {
  title: title$1,
  values,
};

const title = "What This Means For You";
const content = ["When you use our resources or hang out in our community, you're still the one driving. We're not going to chase you up, guilt you into doing more, or make you feel like you're falling behind.","Take what's useful. Leave what isn't. Come back when you want to.","No pressure. No performance. Just support that respects you're a whole person who knows what they need.","We'll support you without trying to own your journey. We'll respect your pace, your choices, and your right to decide what progress means for you.","Your life. Your terms. We're just glad to be part of the journey for a bit."];
const buttons = [{"text":"Explore Resources","href":"/assets","variant":"primary"},{"text":"Discover Pathways","href":"/for-you","variant":"secondary"}];
const finalCTADataRaw = {
  title,
  content,
  buttons,
};

const $$Astro = createAstro("https://yourdomain.com");
const $$About = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$About;
  const heroData = heroDataRaw;
  const storyData = storyDataRaw;
  const purposeData = purposeDataRaw;
  const philosophyData = philosophyDataRaw;
  const valuesData = valuesDataRaw;
  const finalCTAData = finalCTADataRaw;
  const philosophyImages = [youFirstImage, yourChoicesImage, actuallyWorksImage];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "About | Walking With A Smile", "description": "We've walked parts of this journey too. Learn about our story and why we created Walking with a Smile.", "hideFooter": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "HeroSection", $$HeroSection, { "title": heroData.title, "subtitle": heroData.subtitle, "variant": "image", "image": heroImage, "imageAlt": heroData.imageAlt, "imagePosition": heroData.imagePosition })}  ${renderComponent($$result2, "CTASection", $$CTASection, { "title": finalCTAData.title, "description": finalCTAData.content, "buttons": finalCTAData.buttons })}  ${renderComponent($$result2, "StorySection", $$StorySection, { "title": storyData.title, "content": storyData.content, "icon": "heart-fill" })}  ${renderComponent($$result2, "ImageTextSection", $$ImageTextSection, { "title": purposeData.title, "content": purposeData.content, "image": purposeImage, "imageAlt": purposeData.imageAlt, "imagePosition": purposeData.imagePosition })}  ${renderComponent($$result2, "PhilosophyFlipCardsSection", $$PhilosophyFlipCardsSection, { "title": philosophyData.title, "intro": philosophyData.intro, "pillars": philosophyData.pillars, "pillarImages": philosophyImages })}  ${renderComponent($$result2, "ValuesSection", $$ValuesSection, { "title": valuesData.title, "values": valuesData.values, "icon": "star-fill" })}  ${renderComponent($$result2, "ScrollMorphZone", $$ScrollMorphZone, { "patternIcon": "wellness/heart-fill", "patternScale": 120, "patternOpacity": 0.25, "sections": [
    {
      bg: "var(--zone-bg-primary-deep)",
      pattern: "var(--zone-pattern-secondary)",
      icon: "wellness/heart-fill",
      title: "Awareness",
      body: "Recognise your patterns with compassion.",
      decor: {
        rings: [{ size: "lg", depth: 0.3 }, { size: "sm", depth: 0.8, top: "20%", right: "10%" }],
        dots: [{ depth: 2, bottom: "25%", right: "15%" }]
      }
    },
    {
      bg: "var(--zone-bg-earth)",
      pattern: "var(--zone-pattern-primary-vivid)",
      icon: "creative/star-fill",
      title: "Understanding",
      body: "Connect the dots between past and present."
    },
    {
      bg: "var(--zone-bg-forest)",
      pattern: "var(--zone-pattern-earth)",
      icon: "nature/flower-lotus-fill",
      title: "Integration",
      body: "Weave new patterns into your daily life."
    }
  ] })}  ${renderComponent($$result2, "Footer", $$Footer, { "animated": true })} ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/about.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
