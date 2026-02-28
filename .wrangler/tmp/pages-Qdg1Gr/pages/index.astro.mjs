globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, e as renderScript, r as renderComponent, b as renderTemplate, d as addAttribute, f as renderSlot, u as unescapeHTML } from '../chunks/astro/server_DSZs3x4S.mjs';
import { e as $$Button, a as $$BaseLayout, b as $$Footer } from '../chunks/BaseLayout_RnOOHI6G.mjs';
/* empty css                                 */
import { $ as $$ImageTextSection } from '../chunks/ImageTextSection_zRo-ItNa.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_KOHtTGSL.mjs';
import { $ as $$SectionTitle } from '../chunks/SectionTitle_BlcI-eK5.mjs';
import { $ as $$CTASection } from '../chunks/CTASection_cLWB3XuA.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$3 = createAstro("https://yourdomain.com");
const $$HeroMorphAnimation = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$HeroMorphAnimation;
  const { ctaButtons = [] } = Astro2.props;
  const shapeSequence = [
    { file: "1.svg", text: "Walking With A Smile", holdTime: 2 },
    { file: "circle1.svg", text: "What if healing looked different?", holdTime: 0.05 },
    { file: "circles3.svg", text: "What if healing looked different?", holdTime: 2 },
    { file: "8.svg", text: "What if the hurt began to lift...", holdTime: 2 },
    { file: "3.svg", text: "and you saw your glow?", holdTime: 2 },
    { file: "4.svg", text: "What if you chose yourself?", holdTime: 2 },
    { file: "9.svg", text: "Gave yourself room to just be?", holdTime: 2 },
    { file: "7.svg", text: "and valued your worth?", holdTime: 2 },
    { file: "6.svg", text: "Listened to your own voice,", holdTime: 2 },
    { file: "2.svg", text: "and found a new path,", holdTime: 2 }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="hero-morph"> <div class="hero-morph__container"> <!-- Animated Title (spans full width above everything) --> <div class="hero-morph__title-stage"> <h1 class="hero-morph__title" data-morph-text></h1> </div> <!-- Left Side: Text --> <div class="hero-morph__content"> <!-- Static Subtitle --> <p class="hero-morph__subtitle">
Your past shaped you. It does not have to define you.<br>
You have survived more than most people will ever fully understand. 
        And now you might be wondering if life can feel different. <br>
Lighter, more yours.<br><br> <strong>YOU CAN CHOOSE.</strong><br><br>
Not because you forget what happened, or pretend it did not matter, but because you get to choose what happens next. You get to decide what healing looks like for you. At your pace. In your way.
</p> <!-- CTA Buttons --> ${ctaButtons.length > 0 && renderTemplate`<div class="hero-morph__cta"> ${ctaButtons.map((button) => renderTemplate`${renderComponent($$result, "Button", $$Button, { "href": button.href, "variant": button.variant }, { "default": ($$result2) => renderTemplate`${button.text}` })}`)} </div>`} </div> <!-- Right Side: SVG Morph Animation --> <div class="hero-morph__stage"> <div class="hero-morph__svg-container" data-morph-container> <!-- SVG will be injected here by JS --> </div> </div> </div> <!-- Hidden SVG storage for morph targets --> <div style="display: none;" data-svg-storage> ${shapeSequence.map((shape, index) => renderTemplate`<div${addAttribute(index, "data-svg-index")}${addAttribute(shape.file, "data-svg-file")}${addAttribute(shape.text, "data-text")}${addAttribute(shape.holdTime, "data-hold-time")}></div>`)} </div> </section> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/organisms/sections/HeroMorphAnimation.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/HeroMorphAnimation.astro", void 0);

const $$Astro$2 = createAstro("https://yourdomain.com");
const $$PillarsSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$PillarsSection;
  const {
    title,
    description,
    pillars
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="pillars-section section"> <div class="container"> <div class="pillars-section__header text-center"> ${renderComponent($$result, "SectionTitle", $$SectionTitle, { "title": title, "size": "lg", "align": "center", "dividerColor": "primary", "dividerPosition": "both" })} ${description && renderTemplate`<p class="pillars-section__description">${description}</p>`} </div> <div class="pillars-section__grid"> ${pillars.map((pillar) => renderTemplate`<div class="card pillars-section__card"> ${pillar.image ? renderTemplate`<div class="image-default pillars-section__image-container"> ${typeof pillar.image !== "string" ? renderTemplate`${renderComponent($$result, "Image", $$Image, { "src": pillar.image, "alt": pillar.title, "class": "pillars-section__image" })}` : renderTemplate`<img${addAttribute(pillar.image, "src")}${addAttribute(pillar.title, "alt")} class="img-wide-md pillars-section__image">`} </div>` : pillar.icon ? renderTemplate`<div class="pillars-section__icon">${unescapeHTML(pillar.icon)}</div>` : null} <h6 class="pillars-section__card-title">${pillar.title}</h6> <p class="pillars-section__card-description">${pillar.description}</p> </div>`)} </div> ${renderSlot($$result, $$slots["default"])} </div> </section> <!-- Styles in: src/styles/components/pillars-section.css -->`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/PillarsSection.astro", void 0);

const $$Astro$1 = createAstro("https://yourdomain.com");
const $$WhoSliderSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$WhoSliderSection;
  const { title, subtitle, titleImage, slides, slideImages } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="who-slider section"> <div class="who-slider__wrapper"> <div class="who-slider__track js-who-slider"> <!-- Slide 1: Title Card --> <div class="who-slider__slide"> <div class="card who-slider__title-card"> <div class="who-slider__title-image"> ${renderComponent($$result, "Image", $$Image, { "src": titleImage, "alt": "Contemplative figure looking toward hope", "loading": "lazy" })} </div> <div class="who-slider__title-content"> <h2 class="who-slider__title">${title}</h2> <p class="who-slider__subtitle">${unescapeHTML(subtitle)}</p> <div class="who-slider__card-nav"> ${renderComponent($$result, "Button", $$Button, { "href": "#", "variant": "primary", "class": "js-who-next" }, { "default": ($$result2) => renderTemplate`Explore Further` })} </div> </div> </div> </div> <!-- Content Slides --> ${slides.map((slide, index) => renderTemplate`<div class="who-slider__slide"> <div class="card who-slider__card"> <div class="who-slider__card-image"> ${renderComponent($$result, "Image", $$Image, { "src": slideImages[index], "alt": slide.imageAlt, "loading": "lazy" })} </div> <div class="who-slider__card-content"> <h3 class="who-slider__card-title">${slide.title}</h3> <p class="who-slider__card-text">${slide.content}</p> <div class="who-slider__card-nav"> ${renderComponent($$result, "Button", $$Button, { "variant": "primary", "shape": "square", "size": "sm", "icon": "caret-left-fill", "iconCollection": "interface", "ariaLabel": "Previous slide", "class": "who-slider__nav-btn js-who-prev" })} ${renderComponent($$result, "Button", $$Button, { "variant": "primary", "shape": "square", "size": "sm", "icon": "caret-right-fill", "iconCollection": "interface", "ariaLabel": "Next slide", "class": "who-slider__nav-btn js-who-next" })} </div> </div> </div> </div>`)} </div> <!-- Slider Navigation --> ${renderComponent($$result, "Button", $$Button, { "variant": "primary", "shape": "square", "size": "sm", "icon": "caret-left-fill", "iconCollection": "interface", "ariaLabel": "Previous slide", "class": "who-slider__controls who-slider__controls--prev js-who-prev" })} ${renderComponent($$result, "Button", $$Button, { "variant": "primary", "shape": "square", "size": "sm", "icon": "caret-right-fill", "iconCollection": "interface", "ariaLabel": "Next slide", "class": "who-slider__controls who-slider__controls--next js-who-next" })} <!-- Slider Indicators --> <div class="who-slider__indicators"> <button class="who-slider__dot is-active js-who-dot" data-slide="0" aria-label="Go to slide 1"></button> ${slides.map((_, index) => renderTemplate`<button class="who-slider__dot js-who-dot"${addAttribute(index + 1, "data-slide")}${addAttribute(`Go to slide ${index + 2}`, "aria-label")}></button>`)} </div> </div> </section> ${renderScript($$result, "C:/Users/Business/Website v2.36/src/components/organisms/sections/WhoSliderSection.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Business/Website v2.36/src/components/organisms/sections/WhoSliderSection.astro", void 0);

const bridgeImage = new Proxy({"src":"/_astro/Bridge.Df8z9ZOI.png","width":1000,"height":1000,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Bridge/Bridge.png";
							}
							
							return target[name];
						}
					});

const approachImage = new Proxy({"src":"/_astro/Our Approach.C8UTlz6z.png","width":1000,"height":1000,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Approach/Our Approach.png";
							}
							
							return target[name];
						}
					});

const pillar1Image = new Proxy({"src":"/_astro/Pillar-1.CyL_Wpva.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Pillars/Pillar-1.png";
							}
							
							return target[name];
						}
					});

const pillar2Image = new Proxy({"src":"/_astro/Pillar-2.B5K7s8qC.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Pillars/Pillar-2.png";
							}
							
							return target[name];
						}
					});

const pillar3Image = new Proxy({"src":"/_astro/Pillar-3.BY1HVB2P.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Pillars/Pillar-3.png";
							}
							
							return target[name];
						}
					});

const sliderTitleImage = new Proxy({"src":"/_astro/Slider-Title.Cy69JrpE.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Who/Slider-Title.png";
							}
							
							return target[name];
						}
					});

const slider1Image = new Proxy({"src":"/_astro/Slider-1.BFM9MICJ.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Who/Slider-1.png";
							}
							
							return target[name];
						}
					});

const slider2Image = new Proxy({"src":"/_astro/Slider-2.DKH7qpax.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Who/Slider-2.png";
							}
							
							return target[name];
						}
					});

const slider3Image = new Proxy({"src":"/_astro/Slider-3.ZAzyyCNg.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Who/Slider-3.png";
							}
							
							return target[name];
						}
					});

const slider4Image = new Proxy({"src":"/_astro/Slider-4.CvZ2Au_O.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Who/Slider-4.png";
							}
							
							return target[name];
						}
					});

const slider5Image = new Proxy({"src":"/_astro/Slider-5.4xZUWopJ.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Who/Slider-5.png";
							}
							
							return target[name];
						}
					});

const slider6Image = new Proxy({"src":"/_astro/Slider-6.DQBKllMZ.png","width":600,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Home/Who/Slider-6.png";
							}
							
							return target[name];
						}
					});

const buttons$1 = [{"text":"Explore Resources","href":"/assets","variant":"primary"},{"text":"Start Here","href":"/about","variant":"outline"}];
const heroDataRaw = {
  buttons: buttons$1,
};

const title$4 = "This isn't about 'fixing' you.";
const content$1 = ["You're not broken. You never were.","What happened to you left marks: on how you see yourself, how you move through the world, how you protect your heart. That's not weakness. That's survival.","But survival mode wasn't meant to be permanent. And somewhere in you, there's a knowing that there's more available. More ease. More joy. More you.","Walking with a Smile exists to help you find your way there, at your pace, on your terms."];
const imageAlt$1 = "A path forward";
const imagePosition$1 = "left";
const ctaText$1 = "";
const ctaHref$1 = "";
const bridgeDataRaw = {
  title: title$4,
  content: content$1,
  imageAlt: imageAlt$1,
  imagePosition: imagePosition$1,
  ctaText: ctaText$1,
  ctaHref: ctaHref$1,
};

const title$3 = "What We Offer";
const description$1 = "Practical support for real life. We're not here to tell you who to be or how to heal. We're here to walk alongside you with resources that actually help:";
const pillars = [{"image":"pillar-1.png","title":"Clear, honest information","description":"Understand what you're experiencing without the jargon or overwhelm"},{"image":"pillar-2.png","title":"Practical tools","description":"Small, doable steps you can take today, not someday"},{"image":"pillar-3.png","title":"A space that respects your pace","description":"No pressure, no performance, no \"shoulds\""}];
const pillarsDataRaw = {
  title: title$3,
  description: description$1,
  pillars,
};

const title$2 = "Who This Is For";
const subtitle = "Healing from trauma isn't linear.<br />See if you recognise yourself here.";
const slides = [{"id":"survivor","title":"The Survivor","image":"slider-1.png","imageAlt":"Soft morning light through a window","content":"If this sounds familiar... You've done the hard work of surviving. Maybe you've had therapy, read the books, tried the things. But something still feels stuck. You know the language of healing, but the felt sense of it remains just out of reach. Your body still holds what your mind has processed. If you're ready to shift from getting through life to living it, you belong here."},{"id":"beginner","title":"The Beginner","image":"slider-2.png","imageAlt":"A quiet journal and cup of tea, suggesting the beginning of something","content":"Or maybe... You're just starting to connect the dots. Something in your past is affecting your present, but you're not quite sure what or how. The pieces are beginning to surface, and you need somewhere gentle to begin. A place that meets you exactly where you are, without needing you to have it all figured out first. You don't need a perfect trauma narrative to deserve support."},{"id":"cycle-breaker","title":"The Cycle-Breaker","image":"slider-3.png","imageAlt":"A path through trees, clearly walked but not overgrown","content":"Perhaps you've noticed... The same patterns keep showing up. You react in ways that don't match the situation. Your nervous system fires alarms when you're actually safe. You're working to break cycles, whether from your family, your past, or patterns you developed just to survive. You need tools that go deeper than 'think positive' and 'let it go.' You're ready to rewire, not just cope."},{"id":"invisible-wound","title":"The Invisible Wound","image":"slider-4.png","imageAlt":"Water surface with light filtering through","content":"Maybe your story is... There are no visible scars. Nothing 'bad enough' to count, or so you've been told. But you lived through something that left marks on your nervous system, your self-trust, your sense of safety in the world. What happened to you was real, even if others couldn't see it. You don't need to justify your pain to deserve healing."},{"id":"rebuilder","title":"The Rebuilder","image":"slider-5.png","imageAlt":"Hands gently holding seeds or small plant","content":"You might be... Finally stable but not quite *you* yet. The crisis has passed but you're left wondering who you are underneath all the survival strategies. You're safe now, but your body doesn't quite believe it. You want to trust yourself again, to feel at home in your own life. You're ready to move from 'not broken' to actually whole."},{"id":"uncertain","title":"The Uncertain","image":"slider-6.png","imageAlt":"Space for uncertainty and questions","content":"Perhaps the truth is... You're not sure where you fit. And here's the thing: knowing yourself isn't about finding the right box to climb into. Sometimes the most powerful knowing comes from recognising what you're not. What doesn't fit. What never did. You don't have to be everything, but you can be anything you want to be. You're welcome here without needing the perfect words or the right story. Questions, uncertainty, and all the space in between. Sometimes healing starts with 'I don't know who I am yet, but I'm learning what I'm not,' and that's exactly enough."}];
const whoSliderDataRaw = {
  title: title$2,
  subtitle,
  slides,
};

const title$1 = "Our Approach";
const content = ["We believe you already have what you need.","Our role isn't to rescue or direct. It's to offer tools, information, and encouragement while you lead the way.","Because healing isn't about becoming someone new. It's about coming home to who you've always been: underneath the protection, behind the walls, beyond the wound.","You are whole. You are capable. And you are the expert on your own life.","We hope to remind you, that you are still you."];
const imageAlt = "Your journey";
const imagePosition = "right";
const ctaText = "";
const ctaHref = "";
const approachDataRaw = {
  title: title$1,
  content,
  imageAlt,
  imagePosition,
  ctaText,
  ctaHref,
};

const title = "A Note Before You Begin";
const description = ["This isn't therapy. It's not a replacement for professional support when you need it. Think of it more like a companion resource, something to reach for when you're ready to explore what's possible.","Start wherever feels right. Browse our resources, take what resonates, leave what doesn't. There's no correct order, no steps you have to complete, no one checking up on whether you've done the homework.","There's no right way to do this. Only your way."];
const buttons = [{"text":"Explore Resources","href":"/assets","variant":"primary"},{"text":"Read More","href":"/insights","variant":"outline"}];
const ctaDataRaw = {
  title,
  description,
  buttons,
};

const $$Astro = createAstro("https://yourdomain.com");
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const heroData = heroDataRaw;
  const bridgeData = bridgeDataRaw;
  const pillarsData = pillarsDataRaw;
  const whoSliderData = whoSliderDataRaw;
  const approachData = approachDataRaw;
  const ctaData = ctaDataRaw;
  const pillarImages = [pillar1Image, pillar2Image, pillar3Image];
  const pillarsWithImages = pillarsData.pillars.map((pillar, index) => ({
    ...pillar,
    image: pillarImages[index]
  }));
  const whoSliderImages = [slider1Image, slider2Image, slider3Image, slider4Image, slider5Image, slider6Image];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Walking With A Smile | Your past shaped you. It doesn't have to define you.", "description": "Support for trauma recovery and healing. Practical resources to help you move from survival to living, at your own pace.", "hideFooter": true }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "HeroMorphAnimation", $$HeroMorphAnimation, { "ctaButtons": heroData.buttons })}  ${renderComponent($$result2, "ImageTextSection", $$ImageTextSection, { "sectionId": "bridge-section", "title": bridgeData.title, "content": bridgeData.content, "image": bridgeImage, "imageAlt": bridgeData.imageAlt, "imagePosition": bridgeData.imagePosition, "ctaText": bridgeData.ctaText, "ctaHref": bridgeData.ctaHref })}  ${renderComponent($$result2, "PillarsSection", $$PillarsSection, { "title": pillarsData.title, "description": pillarsData.description, "pillars": pillarsWithImages })}  ${renderComponent($$result2, "WhoSliderSection", $$WhoSliderSection, { "title": whoSliderData.title, "subtitle": whoSliderData.subtitle, "titleImage": sliderTitleImage, "slides": whoSliderData.slides, "slideImages": whoSliderImages })}  ${renderComponent($$result2, "ImageTextSection", $$ImageTextSection, { "sectionId": "approach-section", "title": approachData.title, "content": approachData.content, "image": approachImage, "imageAlt": approachData.imageAlt, "imagePosition": approachData.imagePosition, "ctaText": approachData.ctaText, "ctaHref": approachData.ctaHref })}  ${renderComponent($$result2, "CTASection", $$CTASection, { "title": ctaData.title, "description": ctaData.description, "buttons": ctaData.buttons })}  ${renderComponent($$result2, "Footer", $$Footer, { "animated": true })} ` })}`;
}, "C:/Users/Business/Website v2.36/src/pages/index.astro", void 0);

const $$file = "C:/Users/Business/Website v2.36/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
