# Dos and Don'ts on Designing for Accessibility

**Source:** UK Home Office Digital — Accessibility in Government Blog
**URL:** https://accessibility.blog.gov.uk/2016/09/02/dos-and-donts-on-designing-for-accessibility/
**Author:** Karwai Pun (Interaction Designer, Home Office Digital)
**Date:** 2 September 2016
**License:** Creative Commons (non-commercial, with attribution)
**GitHub:** https://github.com/UKHomeOffice/posters/tree/master/accessibility

---

## Context

The Home Office Digital accessibility team (led by Emily Ball and James Buller) created six poster sets covering design practices for specific user groups. The team comprises twelve specialists across: blind/visual impairment, dyslexia, autism/ADHD, D/deaf and hard of hearing, mental health, and motor disabilities.

Key insight from the team: these are general good design practices that benefit everyone, but they highlight how certain approaches particularly support users with specific access needs. Testing with actual users helps balance sometimes-contradictory recommendations across groups.

---

## The Six Poster Sets

### 1. Designing for Users on the Autistic Spectrum

| Do | Don't |
|---|---|
| Use simple colours | Use bright contrasting colours |
| Write in plain English | Use figures of speech and idioms |
| Use simple sentences and bullets | Create a wall of text |
| Make buttons descriptive (e.g. "Attach files") | Make buttons vague and unpredictable (e.g. "Click here") |
| Build simple and consistent layouts | Build complex and cluttered layouts |

### 2. Designing for Users of Screen Readers

| Do | Don't |
|---|---|
| Describe images and provide transcripts for video | Only show information in an image or video |
| Follow a linear, logical layout | Spread content all over a page |
| Structure content using HTML5 | Rely on text size and placement for structure |
| Build for keyboard use only | Force mouse or screen use |
| Write descriptive links and headings (e.g. "Contact us") | Write uninformative links and headings (e.g. "Click here") |

### 3. Designing for Users with Low Vision

| Do | Don't |
|---|---|
| Use good contrasts and a readable font size | Use low colour contrasts and small font size |
| Publish all information on web pages (HTML) | Bury information in downloads |
| Use a combination of colour, shapes and text | Only use colour to convey meaning |
| Follow a linear, logical layout; ensure text flows and remains visible when magnified to 200% | Spread content all over a page; force horizontal scrolling when text is magnified to 200% |
| Put buttons and notifications in context | Separate actions from their context |

### 4. Designing for Users with Physical or Motor Disabilities

| Do | Don't |
|---|---|
| Make large clickable actions | Demand precision |
| Give form fields space | Bunch interactions together |
| Design for keyboard or speech only use | Make dynamic content requiring lots of mouse movement |
| Design with mobile and touch screen in mind | Have short time out windows |
| Provide shortcuts | Tire users with lots of typing and scrolling |

### 5. Designing for Users who are D/deaf or Hard of Hearing

| Do | Don't |
|---|---|
| Write in plain English | Use complicated words or figures of speech |
| Use subtitles or provide transcripts for video | Put content in audio or video only |
| Use a linear, logical layout | Make complex layouts and menus |
| Break up content with sub-headings, images and videos | Make users read long blocks of content |
| Let users request their preferred communication support when booking appointments | Make telephone the only means of contact |

### 6. Designing for Users with Dyslexia

| Do | Don't |
|---|---|
| Use images and diagrams to support text | Use large blocks of heavy text |
| Align text to the left and keep a consistent layout | Underline words, use italics or write capitals |
| Consider producing materials in other formats (audio and video) | Force users to remember things from previous pages — give reminders and prompts |
| Keep content short, clear and simple | Rely on accurate spelling — use autocorrect or provide suggestions |
| Let users change the contrast between background and text | Put too much information in one place |

---

## User Comments — Raw Feedback

These comments are from real users, designers, and accessibility professionals. They contain first-hand experience reports, corrections, and design insights that go beyond the posters themselves.

### Autism Spectrum — User Corrections

**Jules** (04 October 2016) — has mild Asperger's, parent of autistic child, school governor:

> i) 'Simple colours'. This may SEEM to chime with 'write in plain English' — but it doesn't actually help. Autistic spectrum people tend to take things literally. Euphemisms (or over-simplified icons) can be not understood. So things need to be familiar — not in code (hence plain English) — but this also means that realism (or skeumorphism) is better than unrealistic 'flat' — so shading and depth are preferable to bright 'Fisher Price' colours.
>
> ii) 'Don't ....' use flat monotone icons — absolutely, so why are there so many around?
>
> iii) Use bullets not text blocks. Absolutely — so why so few lists of Contents? These help provide context and info in a quick to read, user-friendly fashion.
>
> iv) Buttons SHOULD be descriptive — so what is wrong with 'click here'. It tells the User exactly what to do. Doubt arises if the text alongside is unclear — or the 'button' doesn't look like a 'button' but a plain slab with plain text instead — like 'Attach files'.
>
> v) 'Yes' to simple layouts rather than the jumble shown to the right — but distinct panels and columns for Contents, themes or functions all in one view are preferable to a single column that has to be scrolled. Why? Because context is best assimilated all together rather than relying on memory as content/navigation scrolls out of view.

**Response from Nathan McIntosh** (06 November 2016) — on why "Click here" fails for screen readers:

> When screen readers are used some users navigate quickly using only the links on the page as navigation 'waypoints' to jump to the section they want. If there are 5 'Click here's on the page (and typically no alt text) it can be hard to know which one is the right 'Click here'. Then you expect the user to listen to a full url to figure out what the destination of that link will be. We found this out by seeing exactly how some blind users navigate pages using a screen reader.

### Dyslexia — User Correction

**Michael** (06 September 2016) — dyslexic user:

> Left justified for dyslexics is a myth. I'm dyslexic and text needs to be justified or I'm lost at the end of every line. It's specific learning difficulties, far better to make it appealing and something I want to read.
>
> Don't make long scrolling pages — they are really difficult to understand.

**Key takeaway:** Dyslexia is not monolithic. Left-align is standard advice but doesn't work for all dyslexic users. This supports the "personalise" approach over one-size-fits-all.

### Screen Reader — User Advice

**Brian Donahower, MSEd.** (06 September 2016):

> There is a difference between meeting regulatory accessibility guidelines (US: Section 508 refresh & WCAG 2.0) and meeting the needs of disabled adult learners. Simple example pointed out to me by a screen reader user... at the end of a text-only accessible document (typically HTML5), add an H2 Header that indicates End of Document. His best advice though: Download a trial version of JAWS, arrow through the content page by page, and listen to your content before you publish.

**David Boden** (12 September 2016) — blind user:

> As a blind person, I am really pleased that all this is being publicised. However, it should have been proofread and typos removed before making it public.

**Lloyd** (10 November 2016):

> Would love to have seen 'don't upload images of text' for the screen readers poster. It's something I come across at work a lot, and it's a big no-no for users with disabilities.

### Low Vision — User Feedback

**Pat Reynolds** (13 December 2017) — vision loss, uses 110% zoom on large display:

> 'Don't spread content all over a page and force user to scroll horizontally when text is magnified to 200%' — it doesn't really cover modern websites, which are often responsive (so horizontal scrolling isn't a thing even if zoomed to 500%). Far more important is 'Don't spread content apart down a page with blocks of space — forcing a user to scroll vertically when text is magnified at 110%'. I dread the HMRC website being brought into gov.uk standards, for example, as you put too much space between questions and navigation, forcing me to scroll down to 'next' or 'back'.

**Key takeaway:** Excessive vertical whitespace is a real barrier for magnified views. Responsive design has largely solved horizontal scroll, but vertical bloat is the modern problem.

### Animation and Motion — Cross-Disability

**Inca** (22 September 2016):

> I'd like to add a do/don't to many, concerning animation, sliders and moving text: provide a way to pause them and navigate them manually. This is important to limit distractions, and to accommodate those who cannot take in the information of the animation/slider/moving text at the pace it dictates. This may be true for low vision users, users on the autistic spectrum, users with dyslexia and users with motor disabilities, and also users with cognitive impairments.

### Motor Disabilities — Feedback

**Gerard** (18 January 2018) — on the "provide shortcuts" example:

> The example for providing shortcuts seems like a poor one. In cities with tall apartment developments the number of addresses in a postcode can be so long as to make ONLY asking for a postcode significantly more tiresome in terms of 'typing and scrolling' (emphasis on the latter), than asking for number AND postcode.

### Colour Blindness — Gap Identified

**Jed Exodus** (05 May 2018):

> Some guidance on considerations for colour-blind users would be good. 1 in 10 men are colour blind.

*Note: The team stopped creating new posters but provided templates for community contributions.*

### Dyslexia Icon — Representation Issue

**Ann** (21 June 2018):

> I find the upper right icon for Dyslexia offensive. I don't see blurry or out of focus letters. I tend to see them flipped and have to pause and think — like b and p or d and q. There are probably others who have different challenges.

### CAPTCHAs — Cross-Disability Barrier

**Jake** (08 October 2016):

> Inaccessible CAPTCHAs are a big 'no-no' in my books. I am not a fan of audio CAPTCHAs either because people who are deaf/hard-of-hearing cannot use them. I personally have gotten some of the audio ones to work, but if at all possible they should be avoided.

### Personalisation — Design Philosophy

**Cheryl Joyce** (10 February 2017) — mother of autistic child, policy professional:

> These needs are wide ranging and sometimes contradictory across the different types of users. How can a designer meet all these needs for one website? Is there a way to design all the elements for each of the different users and then put them on some sort of overlay? And when say, an autistic person uses the site, they can turn on the design that's meant for them, or a person who is blind can turn on the design suited for them etc..? Or should a designer include as many elements as possible to suit as many different users as possible, and then allow ways for the user to personalise the site to their needs?

**Karwai Pun's response:**

> The baseline would be to design in such a way that you're incorporating as many of the best design practices as possible so that anyone regardless of ability or condition can use your site; from there, you can further personalise the site according to specific needs like customising personal settings or downloading plug-ins and certain software tools which can help.

### Accessibility is for Everyone

**Sascha Leib** (21 June 2017):

> This looks a bit like the same set of best practices that should be followed — not for people with specific needs but for all users — has been inflated to cover 6 different 'specific needs' groups. This makes it look again as if accessibility is something we do for handicapped people. It isn't. It's something we do for everybody. True, some people profit more from these best practices (like, deaf people from an audio transcript) — but is it hard to understand that I, as a non-deaf person, also prefer to read a transcript to listening to the audio file (not to mention that I can use search on it). And the same is true for almost all aspects of accessibility.

**Karwai Pun's response:**

> I appreciate and fully agree with your comment that accessibility is for everybody. The posters are indeed good design principles for everyone and are not exclusively for the user groups in the posters. The reason behind creating the posters is to raise the profile of different users in our community and increase awareness of different conditions that people have. We do so by highlighting what good (and bad) design looks like, especially focusing on ones which affect some more than others.

---

## Relevance to This Project

This data directly informs our four-render architecture:

| Poster category | Our render/feature |
|---|---|
| Screen readers | Semantic HTML, aria attributes, heading hierarchy (Section 14 of audit) |
| Low vision | Text scaling to 200%, `rem` units, reflow (Section 8c) |
| Motor disabilities | Easy Click render — 64px targets, keyboard-only, no hover-only (Section 10) |
| Autism spectrum | Calm Mode — no animation, consistent layouts, plain language |
| Dyslexia | Your View panel — contrast control, text size slider, layout personalisation |
| D/deaf | Subtitles, transcripts, no audio-only content |
| Colour blindness | CVD theme tokens (protanopia, deuteranopia, tritanopia) |
| Animation/motion | Reduced render strips animation props; Calm Mode |
| Personalisation | Your View panel — the exact overlay approach Cheryl Joyce described |

Key user corrections to incorporate:
- **Vertical whitespace** matters more than horizontal scroll at magnification (Pat Reynolds)
- **Left-align is not universal** for dyslexia — personalisation > prescription (Michael)
- **Skeumorphism > flat** for autism spectrum — familiar visual metaphors aid comprehension (Jules)
- **Context visibility** — avoid single-column scroll that hides navigation context (Jules)
- **Images of text** are a major screen reader barrier — ensure all text is real DOM text (Lloyd)
- **End-of-document markers** help screen reader navigation (Brian Donahower)
- **Pause controls** for all animation, not just motion preference (Inca)
