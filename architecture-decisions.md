# Architecture Decisions — Mind the Box Platform

**What this document is:** A record of every major design decision for the website architecture, written in plain language. If you paste this into a new conversation with Claude (app or Code), it should understand the full architecture without further explanation.

**Last updated:** 6 March 2026

---

## 1. The Building Blocks (Atoms)

### Decision: Ten building blocks, used everywhere

The entire site — across all three brands (Mind the Box, Be You Love Wins, Frequency) — is built from just ten small reusable pieces called atoms:

**Fixed atoms** (their internal structure is set, you just toggle parts on or off):
- **Text** — paragraphs, descriptions, any body text
- **Heading** — titles at any level
- **Button** — always contains an icon slot and a text slot, either can be hidden
- **Badge** — small labels like "6 sections" or "New"
- **Link** — clickable text that goes somewhere
- **Icon** — SVG symbols fetched from the asset library API
- **Image** — photos, illustrations, logos, decorative graphics

**Container atoms** (their contents are defined entirely by the JSON data):
- **Card** — a wrapper that can contain any combination of other atoms
- **List** — an ordered or unordered arrangement of items
- **FormField** — the universal input (text boxes, radio buttons, checkboxes, sliders, card-select grids)

### Why: 
Instead of building dozens of specialised components (a blog card, a testimonial card, a pricing card), we have one Card atom that gets filled with different atoms depending on what the JSON says. This means every visual variation on the site resolves to the same ten pieces. Fix an accessibility issue on the Image atom and it's fixed everywhere images appear — in cards, in heroes, in galleries, in blog posts, everywhere.

### The key distinction:
A Button always equals icon + text. You can hide either part, but you can't put an image inside a button. Its structure is fixed.

A Card equals whatever you put in it. The same Card atom renders a blog preview, a team member profile, a product listing, and an AAC pictogram selector — because the JSON defines different child atoms for each use. The Card itself is just a container with styling props (shadow, padding, radius, variant).

---

## 2. Responsive Layout Lives on Containers — Atoms Own Their Own Visual Scaling

### Decision: Layout responsiveness lives on containers. Atoms own their own visual scaling.

Containers (Card, Grid, List) control column counts, stacking, and spatial layout via media queries. Atoms have `Component.responsive.css` for scaling their own visual properties — heading font sizes step down at tablet/mobile, text gets word-break rules on small screens, image decorative properties shrink. But atoms never change layout — they never switch from row to column, never control grid columns. They scale themselves; containers position them.

### Why:
A heading doesn't know what column it's in. It doesn't need to. It just says "I am a heading, this size, this colour." The Card or Grid it sits inside decides whether to show two columns or one column based on screen width.

The atom's responsive file handles things like: h1 drops from 48px to 36px on mobile, word-break kicks in on small screens, decorative border-radius flattens on tiny viewports. These are the atom's own visual properties scaling — not layout decisions.

### The key distinction:
- **Container responsive CSS** = column counts, flex direction, grid templates, stacking order
- **Atom responsive CSS** = font size scaling, word-break rules, decorative property adjustments

---

## 3. Four Ways to View the Site (Render Modes)

### Decision: The platform has four render modes, controlled by the user from the "Your View" panel.

| Mode | User-facing name | What it does |
|------|-----------------|--------------|
| Full | Default | Everything — animations, hover effects, parallax, glass, all CSS |
| Reduced | Calm Mode | Same layout, but no movement. Animation props are stripped so animation classes are never emitted — rules never match. |
| Assistive | Easy Click | Large touch targets (64×64px), single-column layout, no hover-only interactions, thick focus outlines. For people using switches, eye trackers, head pointers, or anyone with motor difficulties. |
| Text-only | Reading Mode | Just headings and text. No images, no cards, no decorative elements. Clean single-column reading. |

### Why four, not three:
Originally there were three (full, reduced, text-only). Easy Click was added because reduced motion and physical accessibility are different needs. Someone might want full visual design but need larger targets. Someone might want calm mode but still need images. Easy Click is specifically about how you physically interact with the site, separate from how it looks.

### How it works — the critical principle:
The atoms don't know which render mode is active. They are "pure" — they receive props from JSON and output HTML. The render pipeline above them controls which CSS files load and which props get passed through. In Calm Mode, animation props are simply never sent to the component, so animation classes never appear in the HTML, so animation CSS never matches anything. Nothing to undo, nothing to override.

This was a breakthrough moment. The old approach tried to load everything and then use CSS to hide/disable parts — fighting specificity, missing things, breaking things. The new approach loads only what's needed. Text-only mode doesn't load Card CSS and then hide it — it simply never renders the Card component. Nothing to strip because it was never there.

---

## 4. Animation: JSON Prop → Class → CSS (Nothing Else)

### Decision: Animation is entirely controlled by whether a JSON prop exists.

The chain is:
1. JSON has an animation prop (e.g. `"hover": true`) → 
2. The Astro component adds a class (e.g. `class="image--animate"`) → 
3. CSS rules gated behind that class fire (e.g. `.image--animate .image__img { transition: ... }`)

If the JSON doesn't include the animation prop, the class never appears, and the CSS rule never matches. Zero motion. No `!important` overrides, no "undo" rules, no specificity battles.

### Why:
In reduced render, the pipeline simply doesn't pass animation props. The component never knows it was supposed to animate. This is much cleaner than loading animations and then trying to suppress them with `prefers-reduced-motion` media queries or `.a11y-reduce-motion` override classes.

---

## 5. Alt Text: Three Layers, Resolved Before the Component Sees Them

### Decision: Every content image carries three layers of description, but the Image atom only receives the finished result — never raw database fields.

**The three layers:**
- **Word** — a single short word describing the concept (e.g. "Wardrobe")
- **Descriptive** — a full sentence for screen readers (e.g. "A winding path through an autumn forest")
- **AAC HTML** — pre-built pictogram cards showing the concept as simple picture-symbols

**What lives in the database (the data layer):**
- `alt_aac_phrase` — curated simple words like "clothes choose safe" that the resolver uses to find matching pictograms
- `alt_symbol_id` — a reference number pointing to the pictogram library (1,798 symbols)
- `alt_descriptive` — the full description sentence

**What the Image component actually receives (resolved props):**
- `altWord` — the short word
- `altDescriptive` — the full sentence
- `altAacHtml` — finished HTML for the pictogram cards, already built by the resolver at build time

### Why the separation matters:
The Image atom is pure. It doesn't query databases, it doesn't run resolvers, it doesn't know about foreign keys. At build time, a resolver reads the database, looks up the matching pictograms, assembles the HTML cards, and passes the finished result to the component. The component just renders what it's given.

This means the Image atom works the same whether the data came from a database, a JSON file, a CMS, or was hardcoded for testing. It doesn't care about the source.

### Alt text display — two independent axes:
The user controls both from the Your View panel:

**What to show** (which layer of description):
- None (screen reader only, no visual text)
- Word (short label)
- Descriptive (full sentence)
- AAC (pictogram cards)

**How to show it** (visual presentation):
- Hidden (default — nothing visible)
- Caption (block of text below the image)
- Overlay (text floating over the bottom of the image)
- Tooltip (appears on hover or keyboard focus)
- Subtitle (image shrinks to make room, text below)
- Replace (image visually hidden, text takes its place)

That's 4 × 6 = 24 combinations. All handled by CSS using two data attributes on the page root. The Image atom doesn't know which combination is active — the CSS just matches the right selectors.

### Why the checklist was wrong about this:
The original audit checklist expected `altAacPhrase` and `altSymbolId` as Image component props. That's wrong — those are database fields consumed by the resolver at build time. The Image atom never sees them. The checklist has been corrected.

The checklist also listed five display modes with old names. The actual CSS has six modes with different names. The CSS is the source of truth. The checklist has been corrected.

---

## 6. AAC Pictogram Cards: Same Atoms, Different JSON

### Decision: AAC pictogram cards are not a separate component. They're the same Card atom containing an Image atom (the pictogram) and a Text atom (the word), assembled by the build pipeline.

In standard mode, a content card might contain: Image + Heading + Text + Badge.
In AAC mode, the same card slot contains: Image (pictogram) + Text (simple word).

The Card atom doesn't know it's showing AAC content. It just renders whatever child atoms the JSON defines. The JSON carries both variants — `blocks` for standard view and `blocks_aac` for AAC view. The render mode determines which array the card reads.

### Current state:
Right now, `aac-cards.ts` outputs raw HTML strings that get injected into JSON at build time and rendered via `set:html` in the Image component. The HTML templates need updating to match the markup patterns that the Card, Image, and Text atoms produce — same class names, same attributes, same structure. This is deferred to the final atom render pass (after all atoms are individually audited).

### Cognitive level filtering:
AAC pictogram cards are tagged with a vocabulary tier:
- **Green** — 60 survival words (yes, no, help, want, stop, more...)
- **Yellow** — 148 words including basic combiners
- **Orange** — 251 words including more complex vocabulary
- **Full** — everything including specialist domain words

The user's cognitive level setting (on the Your View panel) controls which cards are visible. At Green level, only the 60 most essential words show. CSS hides the rest using `data-core-tier` attributes on each card. No JavaScript needed — pure CSS filtering.

---

## 7. Semantic Roles: What Happens to Icons and Images in AAC Mode

### Decision: Every icon and image has a semantic role that controls what AAC mode does to it.

Three roles:
- **Decorative** — hidden completely in AAC mode (e.g. background flourishes, divider icons)
- **UI control** — the icon is hidden but its text label stays (e.g. a menu hamburger icon — the word "Menu" replaces it)
- **Content symbol** — the icon/image is hidden and AAC pictogram cards replace it (e.g. an image representing "The Wardrobe Framework" gets replaced by pictogram cards for wardrobe + choices)

### Why:
Not all images are equal. A decorative border pattern shouldn't clutter an AAC user's view. A navigation icon needs to become a readable word. A content image needs to become pictogram symbols. The semantic role tells the system which treatment to apply.

---

## 8. FormField: One Atom for Every Kind of Input

### Decision: FormField is the only atom allowed to create interactive input elements (text boxes, radio buttons, checkboxes, sliders, dropdowns). Everything else that accepts user input uses FormField.

### Cognitive level changes what renders:
The same FormField atom renders differently based on the user's cognitive level:

| Standard type | Green level | Yellow level | Orange level | Full level |
|--------------|-------------|--------------|--------------|------------|
| Text area | Symbol grid or card-select | Large button choices | Radio buttons | Text area |
| Radio buttons | Card-select with icons | Large button choices | Radio buttons | Radio buttons |
| Dropdown | Card-select with icons | Large button choices | Dropdown | Dropdown |
| Checkbox | Large toggle card | Large toggle | Checkbox | Checkbox |
| Slider | 3-option cards (low/med/high) | 5-step large buttons | Slider | Slider |

The JSON carries both the standard input configuration and the AAC variant options. The atom checks the cognitive level attribute on the page and renders the appropriate version.

### Why one atom, not many:
A quiz is just a page that renders multiple FormFields from JSON. A long-answer workbook page is just one FormField. Multiple choice is FormFields configured as card-select. The JSON schema determines what the page looks like. The atom is always the same atom. No QuizInput component, no WorkbookAnswer component, no MultipleChoice component — just FormField with different props.

---

## 9. Data Storage: Zero Personal Data on Our Servers

### Decision: User answers (workbook responses, quiz results, reflections) never touch our servers. Two storage paths, user chooses:

**Local:** Saved to the user's own browser storage (IndexedDB). They can export it as a JSON file. They can clear it. We never see it.

**Google Drive:** User signs in with Google. Their answers save to a hidden folder in their own Google Drive that only our app can read. We store their Google ID for licensing only — we never store, access, or process their answers. They can revoke access anytime.

### Why:
Mind the Box provides therapeutic resources. Workbook answers could contain deeply personal mental health content. Under GDPR, holding that data would make us a data processor with significant compliance obligations. By ensuring the data never reaches our servers, we avoid that entirely. The user is both the data controller and data subject for their own content. Google is the processor if they choose Drive storage, and that's between the user and Google.

The "seat" concept is minimal — it's either anonymous (local storage, no identity at all) or a Google ID (for licensing and print traceability only). It's never a row in our database containing personal data.

---

## 10. Assistive Technology: The Operating System Does the Hard Work

### Decision: We do NOT build custom JavaScript for switch scanning, eye tracking input translation, or screen reader integration. The operating system handles all of that.

iOS Switch Control, Windows Eye Control, Android Switch Access, Tobii eye trackers, head trackers — they all translate their input into standard focus, click, and keyboard events at the OS level before the browser ever sees them. Any properly focusable, keyboard-operable element works automatically with all of these.

### Our job is simpler:
- Every interactive element must be focusable (correct `tabindex`, semantic HTML)
- Every interactive element must respond to keyboard (Enter/Space to activate)
- Every hover interaction must also work on focus (`:focus-within` alongside `:hover`)
- Decorative elements must be marked `aria-hidden="true"` so assistive tech skips them
- Touch targets must be large enough (44×44px default, 64×64px in Easy Click mode)
- Focus indicators must be visible (2px outline default, 3px in Easy Click mode)

### One exception — future webcam eye tracking:
A future spec exists for WebGazer.js integration (webcam-based gaze tracking that runs in the browser). This would be for users who don't have a dedicated eye tracker device. It needs calibration, has ~100px accuracy (which is why 64×64px targets are mandatory in Easy Click), and would feed gaze coordinates into the existing dwell-to-click pipeline. This is specced but not built yet.

---

## 11. Two Types of CSS File Per Component

### Decision: Each component has up to two CSS files:

- **Component.css** — all styles including animation, loads in ALL render modes
- **Component.responsive.css** — screen size adjustments (if needed)

Animation rules live in the base CSS file, gated behind classes that only appear when JSON passes animation props. No prop = no class in HTML = animation rule never matches = zero motion. The gating is structural (class presence), not file-based (file loading). There is no separate `Component.animation.css` file.

### What we stopped doing:
Previously, each component had an `a11y.css` file that contained overrides for accessibility modes — dark theme rules, highlight-links rules, reduced motion rules, text-only hiding. These files are now legacy. Their contents have been extracted to global files:

- Dark theme rules → `src/styles/zones/theme-luminance-dark.css`
- Highlight links rules → `src/styles/global/highlight-links.css`
- Reduced motion → handled by the render pipeline (animation props stripped, so animation classes never emitted)
- Text-only → handled by the render pipeline (component simply doesn't render)

The old `a11y.css` files are moved to `_reference/` during refactoring — never deleted, because they contain real design decisions that inform the extraction.

### No hardcoded values in component CSS:
Every colour, spacing, radius, shadow, font size, transition, and breakpoint must use a design token (`var(--token-name)`). If a token doesn't exist for the value needed, flag it — don't invent a magic number. The only exceptions are `0`, `none`, `100%`, `auto`, `1px` for borders, and unitless values like `flex: 1`. No `var(--token, #hex)` fallbacks either — if the token is missing, you want it to break visibly so the token gets fixed.

### Banned patterns in new CSS:
- No `@layer` wrappers
- No `!important` declarations
- No `@media (prefers-reduced-motion)` in component CSS
- No `.a11y-*` class selectors
- No `#a11y-content-wrapper` references
- No scoped `<style>` blocks in `.astro` files
- No `:global()` selectors
- No `var(--token, hardcoded-fallback)` — no fallback values on design tokens

---

## 12. Schema Structure: Content, Visual, Animation

### Decision: Every component schema splits its props into three groups:

- **Content** — what the component says (text, src, alt, options)
- **Visual** — how it looks (size, colour, radius, shadow, variant)
- **Animation** — how it moves (hover, tilt, parallax type)

Plus a **renders** block listing which `.astro` file to use in each render mode:
```
renders: { full, reduced, assistive, textonly }
```

Most components use the same `.astro` file for all four modes — the render pipeline filters the props, not the template. `textonly: null` means the component is purely decorative and gets skipped entirely in Reading Mode.

### Pipeline routing — schemas that declare props for OTHER atoms:
Some components declare props that they never use themselves. The schema describes the full content model, and the pipeline routes different props to different atoms per render mode.

Example — LottieIcon schema:
```
renders: { full: "LottieIcon.astro", reduced: "Icon", assistive: "Icon", textonly: "Text" }
props.content: { slug, src, fallbackIcon, label }
```

- In **full** render: pipeline passes slug/src/label to `LottieIcon.astro` (label becomes aria-label)
- In **reduced/assistive** render: pipeline passes `fallbackIcon` to the `Icon` atom (a completely different component)
- In **textonly** render: pipeline passes `label` to the `Text` atom

`fallbackIcon` never reaches `LottieIcon.astro` — it's a pipeline-only prop. The schema is the single source of truth for everything the content author needs to provide. The pipeline reads the render mode and routes the right props to the right atom.

This pattern applies when a component has fundamentally different representations across render modes — not just filtered props, but entirely different atoms. The key principle: the JSON author declares all dimensions of what the content IS. The pipeline decides how to render it.

Props can be optional — decorative instances may only have the animation (no fallbackIcon, no label). The component adapts: label present = `role="img"` + `aria-label`, label absent = `aria-hidden="true"`.

### Why the three-group split:
It maps cleanly to the render pipeline. Full render passes all three groups. Reduced render passes content + visual but not animation. Text-only passes content only. The pipeline can filter at the group level without knowing what's inside each group.

---

## 13. Print: A Global Layer, Not Per-Component

### Decision: Print styling is NOT done per component. It's a thin global CSS layer that sits on top of the Reduced or Text-only render mode.

### Why:
A printed page doesn't need its own version of every component. It needs one of the existing simplified renders (reduced or text-only) with a few adjustments: hide navigation, hide the accessibility panel, ensure black text on white background, handle page breaks. That's a single global stylesheet, not 30 component-specific print files.

This is built after all component audits are complete and the render pipeline is fully working.

---

## 14. Audit Workflow: Atoms First, Then Connect

### Decision: The component audit follows a strict three-phase order:

**Phase 1 — Individual atom audits:**
Each of the ten atoms is audited alone against the v2 checklist. Fix what's wrong with that atom only. If a fix requires changing another atom (e.g. Image needs to use Text atom for alt text spans), log it as deferred. Don't touch other atoms.

**Phase 2 — Final atom render pass:**
After all ten atoms pass individually, go back and resolve all the cross-atom dependencies from the deferred logs. This is where Image gets its Text atom alt text spans, AAC cards get their Card + Image + Text atom markup, Button's icon passthrough gets verified, etc.

**Phase 3 — Molecules and organisms:**
Work up through larger components. Each one gets checked for: does it use atoms instead of raw HTML? Does it pass through the right props (especially alt text)? Does it have rules for each render mode? The molecules inherit atom-level accessibility for free — they only need to handle their own container concerns (layout, overflow clipping, spacing).

### Why this order:
If you fix a molecule before the atoms inside it are clean, you're building on an unreliable foundation. If you wire up cross-atom dependencies before each atom is individually solid, one atom's changes can break another's assumptions. Atoms first, connections second, compositions third.

---

## 15. Brand System: Same Atoms, Different Tokens

### Decision: All three brands (Mind the Box, Be You Love Wins, Frequency) use exactly the same atoms. Brand differences come entirely from design tokens — colours, fonts, spacing values, border radius.

A Button atom on Mind the Box and a Button atom on Frequency are the same component. They look different because the CSS custom properties (`--brand-c-primary`, `--img-radius`, etc.) resolve to different values based on which theme CSS file is loaded.

### Theme loading:
The theme is a single CSS file that sets all the token values. Pick a theme, that file loads, colours and typography work across all renders automatically. The theme system is completely separate from the render mode system and the accessibility settings. They layer independently.

---

## 16. Workbook + Scrollytelling: Two Compositions, Same Content

### Decision: Learning content can be viewed as either a workbook (linear, fill-in-the-answers) or a scrollytelling presentation (animated, scroll-triggered) — from the same JSON data.

The JSON holds all the content: headings, body text, images, questions. Two composition templates read that JSON differently:

- **Workbook composition** — renders everything in a single column: heading, text, image, question, repeat. Uses reduced render CSS. No animation. FormField atoms handle the answers with local or Drive persistence.
- **Scrollytelling composition** — pins sections to the viewport, text slides in as you scroll, images transition. Uses full render CSS with GSAP ScrollTrigger.

The scrollytelling composition already exists and works. The workbook composition needs building — it's one layout wrapper and one spacing CSS file. Both use the same atoms, so all accessibility settings carry through to both views automatically.

The user could switch between them: learn via scrollytelling, then switch to workbook to do the exercises.

---

## 17. Content Pipeline: JSON Describes, System Renders

### Decision: Content is stored as JSON with section arrays. Each section says what type of content it contains and which atoms to use. The system does all the rendering.

**Templated content** (like blog posts) has a fixed section structure. The JSON only carries content — the template owns the layout, composition, design, and animation.

**Dynamic content** (like generated workbooks) has a flexible section structure defined in the JSON: page name, section types, section order, which atoms each section uses.

Either way, the atoms are the same. The JSON never contains HTML (except for the pre-rendered `altAacHtml` from the resolver). It contains content and configuration. The Astro build step reads the JSON and renders the appropriate atoms with the appropriate props.

---

## 18. The "Your View" Panel: User Preferences, Not Disability Accommodations

### Decision: The accessibility settings panel is called "Your View" and framed as personal preferences, not disability categories.

It offers 24 combinable settings including:
- Render mode (Default / Calm Mode / Easy Click / Reading Mode)
- Alt text display (what to show + how to show it)
- Cognitive level
- Theme / dark mode
- Highlight links
- Text size
- Colour vision filters
- High contrast

### Why the framing matters:
Someone choosing Calm Mode might have anxiety, might have a migraine, might simply prefer less visual noise, or might be showing the site to a client in a quiet setting. Labelling it "Reduced Motion for Vestibular Disorders" medicalises a preference and discourages use by people who'd benefit from it but don't identify with the clinical label. "Calm Mode" is just a nicer way to browse. Anyone might want it.

This philosophy runs through everything: addition not subtraction. The site doesn't take things away from people with disabilities — it gives everyone options to customise how they experience the content.

---

## Decision Log — Corrections and Clarifications

These are specific decisions made during audits that clarify or correct earlier assumptions:

| Date | Decision | Context |
|------|----------|---------|
| 4 Mar 2026 | `altAacPhrase` and `altSymbolId` are NOT Image component props | They're database fields consumed by the resolver at build time. Image receives `altAacHtml` (pre-rendered). Checklist sections 9.2 and 9.3 corrected. |
| 4 Mar 2026 | Display modes are 6, not 5 | Actual CSS: hidden, caption, overlay, tooltip, subtitle, replace. Old checklist said: hover, overlay, underneath, replace, off. CSS is source of truth. Checklist section 9.4 corrected. |
| 4 Mar 2026 | `--font-size-sm` is not a global token | Only exists inside `a11y-panel.css` (14px, scoped). Global equivalent is `--text-small: 0.875rem` in `src/styles/tokens/typography.css`. Any component using `--font-size-sm` outside the panel has a broken reference. |
| 4 Mar 2026 | `[data-render="assistive"]` CSS doesn't exist yet for any component | Image atom is the first to get it, establishing the pattern. Every interactive atom will need equivalent rules. |
| 4 Mar 2026 | `[data-text-xl]` threshold system doesn't exist yet | XL text reflow rules added as placeholder with TODO. Needs a system to set this attribute when root font size exceeds a threshold. |
| 4 Mar 2026 | Print is a global layer, not per-component | Uses reduced/textonly render as base + thin print CSS on top. Not part of individual component audits. Built after render pipeline is complete. |
| 4 Mar 2026 | Cross-atom fixes deferred to final render pass | Image alt text spans need Text atom. AAC cards in aac-cards.ts need Card + Image + Text atom markup. These wait until all atoms are individually audited. |
| 4 Mar 2026 | No separate `Component.animation.css` file | Animation rules live in base `Component.css`, gated by prop-driven classes. The old pattern (separate animation file loaded only in full render) was wrong — gating is structural (class presence), not file-based (file loading). `Icon.animation.css` deleted and merged into `Icon.css` as first correction. |
| 4 Mar 2026 | No hardcoded values in component CSS | Every value must use a design token. No `var(--token, #hex)` fallbacks — if the token is missing, it should break visibly. Exceptions: `0`, `none`, `100%`, `auto`, `1px` borders, unitless values, and `em`-based relative values that intentionally scale with parent font size. Two fallbacks stripped from Image.css (`--color-surface-inverse, #000` and `--radius-md, 8px`). |
| 4 Mar 2026 | Pipeline routing: schemas can declare props for OTHER atoms | A schema's `renders` block can point to other atom names (not just `.astro` files). The pipeline routes the right props to the right atom per render mode. LottieIcon is the first example: `reduced/assistive → "Icon"` (routes `fallbackIcon`), `textonly → "Text"` (routes `label`). `fallbackIcon` never reaches `LottieIcon.astro`. Props can be optional — decorative instances pass neither `fallbackIcon` nor `label`. |
| 4 Mar 2026 | LottieIcon is not always decorative | LottieIcon carries an optional `label` prop. Present = `role="img"` + `aria-label` (meaningful). Absent = `aria-hidden="true"` (decorative). Same pattern as `<img alt="...">` vs `<img alt="">`. The JSON author decides per instance. `LottieIcon.reduced.astro` deleted — no separate template files needed. |
| 4 Mar 2026 | Relative sizing for decorative line elements | Dividers, underlines, decorative borders use `em` for thickness/rhythm (scales with parent font size), percentage for width (90% = shorter than text, 100% = match text), `align-self: stretch` for height. No hardcoded pixel size scales. Heading divider + underline are the reference implementation. |
| 4 Mar 2026 | Context overrides don't belong on atoms | Atoms should not adjust themselves based on parent context (e.g. `.card .text { font-size: ... }`). Consumers pass the correct props via JSON instead. Context override rules deleted from Text.css and flagged for deletion from Heading.css during consumer audits. |
| 4 Mar 2026 | Atoms can compose other atoms | Heading imports Icon, LottieIcon, and Text. This is correct atom-to-atom composition. Text sub-elements inside atoms render through the Text atom, not raw HTML (e.g. Heading subtitle uses `<Text as="p">` not `<p>`). |
| 4 Mar 2026 | SectionTitle.astro deprecated — use Heading | SectionTitle duplicates Heading's decorated mode (same divider, variant, media slot systems). SectionTitle has banned patterns (scoped `<style>`, `!important`, `var(--token, fallback)`, hardcoded `letter-spacing`). Consumers migrate to `<Heading>` with decoration props, then SectionTitle is deleted. |
| 4 Mar 2026 | Heading media slot priority: image → lottieIcon → icon | Media slot renders first match in priority order. `lottieIcon` is in the animation group — stripped in reduced/assistive/textonly. Static `icon` in content group auto-becomes the fallback. No separate fallbackIcon prop needed on Heading. |
| 4 Mar 2026 | Post-audit token coverage grep required | After all atom audits complete, grep every `var(--token-name)` in component CSS and verify each resolves to a definition in `src/styles/`. Automate as build-time check. First cases caught: `--font-body-alt` and `--font-handwriting` missing (now fixed), `--color-surface-inverse` and `--radius-md` had hex fallbacks masking whether tokens exist (fallbacks stripped). |
| 5 Mar 2026 | Base button hover is colour-only — no transform on base | `transition: all` replaced with explicit `background-color, color, border-color`. All `translateY(-1px)` removed from base `.btn:hover`/`:active`. Transform and box-shadow transitions only exist on effect classes (jump, comic, tech, etc.) which are gated by the effect prop. |
| 5 Mar 2026 | Runtime a11y checks (`isA11yActive()`) are redundant | Scripts that query `#a11y-content-wrapper` for `.a11y-reduce-motion` / `.a11y-text-only` classes bypass the render pipeline. The pipeline strips animation props → no animation classes emitted → scripts find nothing to bind to. Three duplicate functions deleted from Button.astro. Pattern: if a script only binds to prop-gated classes, no runtime check is needed. |
| 5 Mar 2026 | Global token files for confetti, high-contrast, highlight-links | `confetti.css` relocated from Button/ to `src/styles/tokens/` — confetti colour tokens are global, not component-scoped. `src/styles/zones/high-contrast.css` created — atoms add `[data-high-contrast]` rules during their audits. `src/styles/global/highlight-links.css` created — atoms add `[data-highlight-links]` rules during their audits. |
| 5 Mar 2026 | Button label renders through Text atom | `<span class="btn__label"><slot /></span>` replaced with `<Text as="span" class="btn__label" flush><slot /></Text>`. Button's `'text'` CSS class removed — Text atom handles typography. `.btn__label` retains layout-only rules (position, z-index, colour transitions). |
| 5 Mar 2026 | a11y.css extraction pattern established | Extraction targets for component a11y.css rules: reduce-motion → render pipeline handles (no CSS needed), text-only → `[data-render="textonly"]` rules in component CSS, high-contrast → `src/styles/zones/high-contrast.css`, highlight-links → `src/styles/global/highlight-links.css`. Original a11y.css files moved to `_reference/ComponentName/`. Button is the first full extraction. |
| 5 Mar 2026 | `data-semantic-role="status"` for Badge | Badges communicate meaningful status/category information ("New", "Beta", "6 sections") — not decorative. `data-semantic-role="status"` chosen over `"decorative"`. |
| 5 Mar 2026 | Glass token variants: light and dark | Base `--glass-bg`/`--glass-border` tokens (10%/20% white) too subtle for all use cases. New tokens added to shadows.css: `--glass-bg-light`/`--glass-border-light` (50% white, for dark-text-on-light-glass) and `--glass-bg-dark`/`--glass-border-dark` (30%/20% black, for light-text-on-dark-glass). Components should use tokens, not inline `color-mix()`. |
| 5 Mar 2026 | Badge label renders through Text atom | Same pattern as Button: `<span class="badge__label">` → `<Text as="span" class="badge__label" flush>`. Raw `text` CSS class removed from Badge class list. `.badge__label { font: inherit; color: inherit; }` rule deleted — Text atom handles typography. |
| 5 Mar 2026 | Link = inline text, Button = visual element | Glass variant removed from Link. Link is purely inline text that navigates. Anything needing visual weight (padding, background, border-radius, pill shape) uses `<Button variant="glass" shape="pill" href="...">`. Clean separation: Link = text, Button = visual. Consumers of `<Link variant="glass">` migrate to Button. |
| 5 Mar 2026 | Link underline: static variant + animated prop | Static `text-decoration: underline` on `.link--underline` (visual variant, always visible). Growing `scaleX(0)→scaleX(1)` animation on `.link--animate-underline-grow` (gated by `underlineGrow` animation prop). In reduced render, animation prop stripped → static underline stays. Clean fallback. |
| 5 Mar 2026 | Link animation library: 4 CSS-only effects | `underlineGrow` (scale underline from left), `highlightGrow` (background bar grows to full), `shadowFill` (box-shadow inset from left), `textSlide` (background-clip colour sweep + underline). All CSS-only, no JS. All gated by animation props — pipeline strips in reduced/assistive/textonly. |
| 5 Mar 2026 | Colour-only transitions accepted on base interactive elements | `.link { transition: color 0.35s ease }` and `.btn { transition: background-color, color, border-color }` are colour-only state feedback, not motion. Checklist Section 4.6: "Colour/state hover changes in base are OK." These stay on base selectors. |
| 5 Mar 2026 | List dot sizes em-based | Dots are decorative markers that sit next to text — if text scales, dots should scale. sm: `0.375em`, md: `0.5em`, lg: `0.75em`. Same relative sizing pattern as Heading dividers (0.15em thickness). Responsive breakpoints scale down proportionally. |
| 5 Mar 2026 | List a11y-dot deleted (dead code) | `.list__a11y-dot` element was hidden by default, meant to show in text-only mode. But text-only rules revert to native `list-style-type: disc` instead — the a11y-dot was never displayed. Deleted from Astro template and CSS. Native disc bullets in textonly is simpler and consistent. |
| 5 Mar 2026 | List assistive render: CSS `::before` dots | Assistive render replaces all list marker variants (icons, custom dots, native bullets) with uniform CSS `::before` circle dots at `0.75em`. Gives consistent visual structure at large scale. Icons and variant dots hidden. Inline variant collapses to vertical. |
| 5 Mar 2026 | Badge text on images → include in alt text | When Badge overlays an Image in Card, the badge text ("Featured", "New", etc.) must be included in the Image alt text. Badge is visually overlaid — screen readers need the badge info in the alt text. Card audit will enforce. |
| 6 Mar 2026 | Card is a dumb container — doesn't control child visibility | Card never hides or shows child atoms. In textonly, Card strips its own chrome (transparent bordered box) but does NOT `display: none` on `.card__image`. Each child atom handles its own textonly rendering based on its own props. Image atom uses `semanticRole`: decorative → hidden, meaningful → alt text via replace mode. Card doesn't need to know. |
| 6 Mar 2026 | Textonly cards keep thin border for structure | In textonly render, Card becomes `background: transparent; border: 1px solid var(--brand-c-neutral-light)`. Link cards get `border-color: var(--brand-c-primary)` for click indication. The border provides visual structure in an otherwise flat text layout. No `!important` needed — pipeline strips variant classes so there's nothing to override. |
| 6 Mar 2026 | Image visibility in textonly is semantic, not container-driven | Whether an image shows in textonly depends on `semanticRole` on the Image atom, not on which container it sits in. A decorative background image in a BlogCard → hidden. A therapeutic illustration in the same BlogCard → becomes alt text via replace mode. Same Card container, different Image behaviour based on semantic role. The old a11y.css was wrong: `.card__image { display: none !important }` killed ALL images regardless. Fixed: Card textonly CSS has no `.card__image` hide rule. |
| 6 Mar 2026 | Card hover prop is animation, not visual | `hover` moved from visual to animation group in schema. Pipeline strips animation props in reduced/assistive/textonly → no `.card--hover-lift`/`--hover-border`/`--hover-glow` classes emitted → hover CSS rules never match. Base `.card` transition is border-color only. Transform + box-shadow transitions live on individual hover effect classes. Same pattern as Button effects. |
| 6 Mar 2026 | Badge + Image in textonly needs no special wiring | Both atoms render in their own textonly modes independently. Badge becomes solid label (`position: static` in textonly CSS). Image becomes alt text (replace mode for meaningful images). DOM order ensures they read sequentially. No per-molecule badge-to-alt-text concatenation needed — the information is preserved by normal document flow. |
| 6 Mar 2026 | Glass + glow tokens: luminance-aware system | `shadows.css` now defines a complete glass token set: 7 backgrounds (`--glass-bg`, `-light`, `-dark`, `-frosted`, `-brand`, `-brand-tint`, `-primary`), 7 borders (`--glass-border`, `-light`, `-dark`, `-frosted`, `-brand`, `-subtle`, `-mid`), 3 blur tiers (`--glass-blur`, `-heavy`, `-frosted`), and `--glass-shadow-inset`. Plus 7 glow tokens (`--glow-ambient`, `-ambient-secondary`, `-neon`, `-neon-hover`, `-spread`, `-spread-secondary`, `-text`). Dark themes auto-swap glass tints via overrides in `theme-luminance-dark.css` — bg tokens flip from White-tinted to Black-tinted, borders get fainter, inset highlights switch to subtle White. Components use the same token names regardless of luminance. Inline `color-mix()` for glass/glow effects should use these tokens instead. |
| 6 Mar 2026 | Glass token tiers by use case | `--glass-bg` (White 10%) = subtle neutral, `--glass-bg-light` (White 45%) = heavy white, `--glass-bg-dark` (Black 40%) = dark panel, `--glass-bg-frosted` (White 18%) = heavy blur frosted, `--glass-bg-brand` (brand-c-bg 60%) = brand-tinted panel (Card), `--glass-bg-brand-tint` (brand-c-bg 15%) = brand-tinted subtle (Toast), `--glass-bg-primary` (primary-dark 50%) = primary-coloured glass. Each has a matching border token at appropriate opacity. |
| 6 Mar 2026 | Glow tokens fill the empty shadows.css section | `--glow-ambient` (40px soft halo), `--glow-neon` / `--glow-neon-hover` (multi-layer neon with inset), `--glow-spread` / `--glow-spread-secondary` (large radius 30px+60px coloured light), `--glow-text` (text-shadow for neon themes). All use `--brand-c-primary` / `--brand-c-secondary` so they adapt per brand. ReaderNav glow shadows, Toast neon theme, and future neon/cyber component variants should all use these tokens. |
| 6 Mar 2026 | Text `textTone` prop for glass contrast | Glass surfaces can't guarantee text contrast because they're transparent — what's behind them determines readability. Rather than glass containers reaching into child Text to set colour, the JSON content author declares `textTone: "light" | "dark"` on the Text atom instance. `text--tone-light` → `var(--glass-text-on-dark)` (light text on dark glass), `text--tone-dark` → `var(--glass-text-on-light)` (dark text on light glass). No prop = default `var(--brand-c-text)`. Covers every glass context (Toast, Card, Button, future consumers) because they all compose through Text. Paired with `--glass-bg-brand-tint` at 75% opacity + `--glass-blur-heavy` at 20px for a contrast floor. |
| 6 Mar 2026 | Glass brand-tint opacity bump 15%→75% | `--glass-bg-brand-tint` increased from 15% to 75% (both light and dark overrides). Combined with `--glass-blur-heavy` bump from 14px to 20px. Higher opacity gives a contrast floor; heavier blur diffuses whatever bleeds through the remaining 25% transparency. Keeps glass feel without competing edges under text. |
