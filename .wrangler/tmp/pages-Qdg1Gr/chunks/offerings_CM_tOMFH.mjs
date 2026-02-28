globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createAstro, a as createComponent, m as maybeRenderHead, b as renderTemplate } from './astro/server_DSZs3x4S.mjs';
/* empty css                            */

const $$Astro = createAstro("https://yourdomain.com");
const $$TimelineStepper = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$TimelineStepper;
  const { steps } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="timeline-stepper" data-astro-cid-wc6526kg> ${steps.map((step) => renderTemplate`<div class="timeline-step" data-astro-cid-wc6526kg> <div class="timeline-step__marker" data-astro-cid-wc6526kg> <span class="timeline-step__number" data-astro-cid-wc6526kg>${step.number}</span> </div> <div class="timeline-step__content" data-astro-cid-wc6526kg> <h3 class="timeline-step__title" data-astro-cid-wc6526kg>${step.title}</h3> <p class="timeline-step__text" data-astro-cid-wc6526kg>${step.text}</p> </div> </div>`)} </div> `;
}, "C:/Users/Business/Website v2.36/src/components/molecules/timeline/TimelineStepper.astro", void 0);

const offering4 = new Proxy({"src":"/_astro/offering-4-training.Cz7VLxF5.png","width":800,"height":600,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/Business/Website v2.36/src/PageImages/Services/offering-4-training.png";
							}
							
							return target[name];
						}
					});

const offeringsDataRaw = [
	{
		slug: "ready-to-use-resources",
		title: "Ready-to-Use Resources",
		tagline: "Professional tools you can use straight away",
		description: "Practical tools, worksheets, and frameworks you can use directly with clients or service users. Everything is designed to be accessible, warm in tone, and focused on building agency and self-direction.",
		image: "offering-1-resources.png",
		benefits: [
			"Save hours of development time",
			"Professionally designed and tested materials",
			"Trauma-informed and client-centred approach",
			"Immediate download and use"
		],
		suitable: [
			"Therapists and counsellors",
			"Coaches working with trauma-affected clients",
			"Support workers and case managers",
			"Community organisations and charities"
		],
		areas: [
			"Identity and values exploration",
			"Boundary setting and communication",
			"Daily grounding and stability practices",
			"Goal-setting and future planning",
			"Self-directed decision-making"
		],
		process: [
			{
				step: "1",
				title: "Browse",
				text: "Explore our resource library and find what fits your needs"
			},
			{
				step: "2",
				title: "Purchase",
				text: "Secure checkout with instant digital delivery"
			},
			{
				step: "3",
				title: "Use",
				text: "Download, print or share digitally with your clients"
			}
		],
		cta: {
			text: "Browse Resources",
			href: "/assets"
		}
	},
	{
		slug: "white-label-packages",
		title: "White-Label Packages",
		tagline: "Our content, your brand",
		description: "Use our materials under your own brand. We provide the content; you provide the identity. All materials are professionally designed, easy to customise, and built on trauma-informed principles. You receive full usage rights for your practice or organisation.",
		image: "offering-2-whitelabel.png",
		benefits: [
			"Full branding rights included",
			"Professionally designed templates",
			"Easy to customise with your colours and logo",
			"Unlimited use within your organisation"
		],
		suitable: [
			"Private practices wanting branded materials",
			"Organisations with established visual identity",
			"Services delivering group programmes",
			"Training providers"
		],
		includes: [
			"Worksheet collections on specific themes",
			"Programme materials for group work",
			"Client handouts and take-home tools",
			"Digital downloads ready for your platform"
		],
		includesTitle: "White-label packages include",
		process: [
			{
				step: "1",
				title: "Enquire",
				text: "Tell us about your organisation and what you need"
			},
			{
				step: "2",
				title: "Customise",
				text: "We adapt the materials to match your brand"
			},
			{
				step: "3",
				title: "Deliver",
				text: "Receive your branded package ready to use"
			}
		],
		cta: {
			text: "Enquire About White-Label",
			href: "/contact"
		}
	},
	{
		slug: "custom-resource-development",
		title: "Custom Resource Development",
		tagline: "Bespoke resources built for your needs",
		description: "Looking for something specific? We create bespoke resources tailored to your client group, service model, or organisational approach. We work collaboratively, ensuring the final product reflects your expertise and serves your clients well.",
		image: "offering-3-custom.png",
		benefits: [
			"Tailored exactly to your methodology",
			"Collaborative development process",
			"Reflects your expertise and voice",
			"Exclusive use for your organisation"
		],
		suitable: [
			"Services with unique client populations",
			"Organisations with specific methodologies",
			"Teams wanting proprietary tools",
			"Research projects requiring specific measures"
		],
		includes: [
			"Worksheets and workbooks designed around your methodology",
			"Programme materials for specific interventions or pathways",
			"Client-facing content that matches your tone and values",
			"Visual resources, planners, and tracking tools"
		],
		includesTitle: "Custom work can include",
		process: [
			{
				step: "1",
				title: "Consultation",
				text: "We discuss your needs, audience, and goals"
			},
			{
				step: "2",
				title: "Development",
				text: "We create drafts and refine based on your feedback"
			},
			{
				step: "3",
				title: "Delivery",
				text: "Final resources delivered in your preferred formats"
			}
		],
		cta: {
			text: "Request a Quote",
			href: "/contact"
		}
	},
	{
		slug: "training-and-licensing",
		title: "Training and Licensing",
		tagline: "Embed our approach in your organisation",
		description: "Want to embed our approach more deeply into your practice? We offer training sessions and licensing arrangements for organisations who want to use our frameworks consistently across their teams.",
		image: "offering-4-training.png",
		benefits: [
			"Consistent approach across your team",
			"Ongoing support and updates",
			"Train-the-trainer options available",
			"Flexible licensing arrangements"
		],
		suitable: [
			"Organisations with multiple practitioners",
			"Services wanting consistent methodology",
			"Training providers",
			"Larger charities and NHS services"
		],
		includes: [
			"Staff training on using our methods effectively",
			"Trainer consultation sessions for larger organisations",
			"Licensing agreements for ongoing use of materials",
			"Consultation on adapting resources for specific populations"
		],
		includesTitle: "This can include",
		process: [
			{
				step: "1",
				title: "Discussion",
				text: "We understand your organisation and training needs"
			},
			{
				step: "2",
				title: "Proposal",
				text: "We create a tailored training and licensing plan"
			},
			{
				step: "3",
				title: "Implementation",
				text: "Training delivery and ongoing support"
			}
		],
		cta: {
			text: "Discuss Training Options",
			href: "/contact"
		}
	}
];

const offerings = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: offeringsDataRaw
}, Symbol.toStringTag, { value: 'Module' }));

export { $$TimelineStepper as $, offeringsDataRaw as a, offerings as b, offering4 as o };
