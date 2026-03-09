# Elastic UI Framework — Accessibility Guidelines

**Source:** https://eui.elastic.co/docs/getting-started/accessibility/
**Type:** Component library accessibility standards (React-based, WCAG 2.1)

---

## Key Guidelines

### Headings and Landmarks

- One `<h1>` per page only
- Sequential heading order, no skipping levels (h1 > h2 > h3, never h1 > h3)
- No duplicate content across headings
- Semantic HTML5 landmarks: `<main>`, `<aside>`, `<article>`
- Named landmarks use `aria-label` or `aria-labelledby`
- Prefer headings inside landmarks referenced by `aria-labelledby` over standalone `aria-label`

### Page Titles

Format: `{Unique page title} - {Site title}`

Good: "Discover - Kibana", "Rollup Jobs - Management - Kibana"
Bad: Generic titles, unnecessary descriptive padding

Unique content first in the title string.

### Focus Management

- All interactive elements need visible focus indicators
- Focus order must follow page flow intuitively
- When a focused element disappears (e.g. modal closes), return focus to the trigger element
- `tabIndex="0"` for interactive non-standard elements
- `tabIndex="-1"` for programmatically-focusable elements only
- Never use `tabIndex` values greater than zero

### Disabled Elements

- Disabled elements are removed from tab order
- When disabling controls, provide clear instructions for error correction
- Remove tooltips and focus interactions from disabled elements

### Naming

- Accessible names from: element text content, `alt` attributes, or ARIA (`aria-label`, `aria-labelledby`)
- For repeated CTAs (e.g. multiple "Edit" buttons), use `aria-label` with descriptive context
- Screen-reader-only text for supplementary context (EUI uses `<EuiScreenReaderOnly>`)

### Low Vision

- Support 200% browser zoom (WCAG 1.4.4 Level AA)
- Keep related information visually proximate — don't separate labels from their controls

### Screen Reader Testing Matrix

| Screen Reader | Browser | Platform |
|---|---|---|
| JAWS | Chrome | Windows (desktop) |
| NVDA | Firefox | Windows (desktop) |
| VoiceOver | Safari | macOS (desktop) |
| VoiceOver | Safari | iOS (mobile) |
| TalkBack | Chrome | Android (mobile) |

---

## External Resource Links (Curated)

### Standards and Specifications
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) — full specification
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref) — filterable checklist
- [WAI-ARIA 1.1](https://www.w3.org/TR/wai-aria-1.1/) — ARIA roles, states, properties
- [Using ARIA](https://www.w3.org/TR/using-aria) — practical guidance on when/how to use ARIA

### Page Structure
- [W3C: ARIA Landmarks](https://www.w3.org/TR/wai-aria-practices/examples/landmarks/HTML5.html)
- [W3C: Page Structure Concepts Tutorial](https://www.w3.org/WAI/tutorials/page-structure/)
- [MDN: Good Semantics](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML#Good_semantics)
- [Up Your A11y: Accessible Page Layouts](https://www.upyoura11y.com/page-layout/)
- [Up Your A11y: Heading Levels in Reusable Components](https://www.upyoura11y.com/reusable-components-with-headers/)

### Keyboard and Focus
- [W3C: Keyboard Compatibility](https://www.w3.org/WAI/perspective-videos/keyboard)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard)
- [MDN: Keyboard-navigable JavaScript Widgets](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)
- [Up Your A11y: Keyboard Navigation and Screen Readers](https://www.upyoura11y.com/screen-reader-keyboard-navigation)
- [Tink: Keyboard vs. Screen Reader Navigation](https://tink.uk/the-difference-between-keyboard-and-screen-reader-navigation/)
- [MDN: Tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
- [W3C: Disabled Elements](https://www.w3.org/TR/2014/REC-html5-20141028/disabled-elements.html#disabled-elements)

### Naming and Forms
- [Paciello Group: What is an Accessible Name](https://developer.paciellogroup.com/blog/2017/04/what-is-an-accessible-name)
- [WebAIM: Creating Accessible Forms](https://webaim.org/techniques/forms/controls)
- [Mozilla: How Accessibility Trees Inform Assistive Tech](https://hacks.mozilla.org/2019/06/how-accessibility-trees-inform-assistive-tech)
- [A List Apart: Semantics to Screen Readers](https://alistapart.com/article/semantics-to-screen-readers)

### Screen Reader Testing
- [WebAIM: JAWS Evaluation](https://webaim.org/articles/jaws)
- [WebAIM: NVDA Evaluation](https://webaim.org/articles/nvda)
- [WebAIM: VoiceOver Evaluation](https://webaim.org/articles/voiceover)
- [Apple: VoiceOver Basics](https://www.apple.com/voiceover/info/guide/_1124.html)
- [Screen Reader Testing Guide (Crash Course)](http://uncaughtreferenceerror.com/a-crash-course-to-screenreaders-for-sighted-developers)

### Low Vision
- [WCAG 1.4.4: Text Resize](https://www.w3.org/WAI/WCAG21/quickref/#resize-text)
- [ZoomText Demo Video](https://www.youtube.com/watch?v=QjKG4Tx9ER8&t=473s)

### Learning and Patterns
- [MDN: Accessibility Guide](https://developer.mozilla.org/en-US/docs/Learn/Accessibility)
- [Google: Web Accessibility Fundamentals](https://developers.google.com/web/fundamentals/accessibility)
- [A11ycasts Video Series](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g)
- [Inclusive Components](https://inclusive-components.design)
- [Accessible Components (Scott O'Hara)](https://github.com/scottaohara/accessible_components)
- [Accessibility Support (ARIA attributes)](https://a11ysupport.io)

### Tools
- [Axe DevTools — Chrome](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd)
- [Axe DevTools — Firefox](https://addons.mozilla.org/en-US/firefox/addon/axe-devtools)

---

## Relevance to This Project

| EUI guideline | Our implementation |
|---|---|
| One h1 per page, sequential levels | Heading atom enforces semantic level via prop |
| Focus restoration on element removal | Modal/panel focus trap + return (Section 14.7) |
| tabIndex="0" on interactive non-standard elements | Image figure, Tooltip trigger |
| Never tabIndex > 0 | Section 6.8 of v2 audit checklist |
| 200% zoom support | Section 8c XL text threshold |
| Screen reader testing matrix | Reference for future QA — JAWS/Chrome, NVDA/Firefox, VoiceOver/Safari |
| Disabled elements out of tab order | FormField handles this |
| aria-label on repeated CTAs | Button atom + Card link patterns |
| Keep related info proximate | Pat Reynolds' feedback aligns — don't spread content with excessive whitespace |
