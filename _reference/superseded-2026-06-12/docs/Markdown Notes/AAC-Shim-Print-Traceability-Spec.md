# Technical Specification: AAC Form Inputs, Shim Implementation & Print Traceability System

**Accessible Content Engine — Multi-Brand Therapeutic Content Platform**
Version 1.0 | March 2026 | Internal Architecture Document

---

## 1. AAC Form Inputs & Library System

### 1.1 Overview

The form atom is a container that accepts any child atoms as selectable inputs. The same form container renders differently based on user settings, cognitive level, and input mode. No new components are required. The JSON generated at build time contains both standard and AAC input variants. Switching between them is a render change controlled by CSS and user preference flags.

### 1.2 Input Mode Variants

Every form question supports multiple input modes. The appropriate mode is determined by the user's cognitive level setting and AAC preferences. All variants are generated at build time and stored in the same JSON.

| Input Mode | Component | Use Case | Cognitive Level |
|---|---|---|---|
| Text input | Standard textarea | Open-ended responses | Level 3–4 |
| Radio buttons | Form atom with radio | Simple selections | Level 2–4 |
| Button select | Large button atoms | AAC-friendly tap targets | Level 1–3 |
| Card select | Card atoms with icon + word | Visual AAC selection | Level 1–2 |
| Slider | Range input | Intensity/frequency scales | Level 2–4 |
| Symbol grid | Grid of icon atoms | Emotion/word selection | Level 1 |

### 1.3 JSON Schema: Dual Input Structure

Both standard and AAC input variants exist in a single JSON object. The build-time JS script generates AAC simple words and fetches icon URLs. No runtime API calls are required.

```json
{
  "question": "How did you feel this week?",
  "question_aac": "How did you feel?",
  "input": {
    "type": "textarea",
    "placeholder": "Describe your feelings..."
  },
  "input_aac": [
    {
      "label": "Happy",
      "label_aac": "Happy",
      "icon_url": "/icons/happy.svg"
    },
    {
      "label": "Sad",
      "label_aac": "Sad",
      "icon_url": "/icons/sad.svg"
    }
  ]
}
```

Key principle: The JSON always contains everything. Both versions are present at all times. The user's preference flag determines which variant renders. Switching is instant because no new data is fetched.

### 1.4 Card Select Input: Form Atom with Child Atoms

The form atom is a container. Cards, buttons, and icons can act as selectable inputs inside it. The click handler is identical regardless of input mode — the form captures which option was selected.

```json
{
  "render": "form",
  "input_mode": "card-select",
  "options": [
    {
      "render": "card",
      "blocks": [
        { "render": "icon", "props": { "name": "happy", "size": "large" } },
        { "render": "text", "props": { "text": "Happy" } }
      ]
    },
    {
      "render": "card",
      "blocks": [
        { "render": "icon", "props": { "name": "sad", "size": "large" } },
        { "render": "text", "props": { "text": "Sad" } }
      ]
    }
  ]
}
```

The existing ten atoms are not extended. Cards, buttons, and icons already exist. They are simply used as selectable children inside the form container. No new components are required.

### 1.5 AAC Response Libraries

Reusable JSON library files provide response options across all content. Each library is tagged by cognitive level. One setting shapes the entire experience across every workbook.

| Library | Cognitive Level 1 | Cognitive Level 3–4 |
|---|---|---|
| emotions-basic | Happy, Sad, Angry, Calm | 4–6 core emotions |
| emotions-detailed | 8–10 options with icons | Nuanced emotion words |
| emotions-nuanced | N/A (too complex) | 12–15+ with descriptions |
| frequency | Never / Sometimes / Always | Never / Rarely / Sometimes / Often / Always |
| agreement | Yes / No / Maybe | Strongly disagree to Strongly agree |
| intensity | A little / A lot | 1–10 scale with labels |
| coping-strategies | Icon cards with simple words | Detailed strategy descriptions |

Libraries are domain-neutral. The emotion library built for therapy works in any domain — education, wellbeing, gardening, driving theory. The same libraries are reused across all brands and all content types.

### 1.6 CSS Variables for Input Sizing

Input sizing adjusts by cognitive level through CSS variables. No component changes are required.

```css
.cognitive-1 .radio-option { min-height: 4rem; font-size: 1.5rem; }
.cognitive-1 .card-select  { min-height: 6rem; gap: 1rem; }
.cognitive-2 .radio-option { min-height: 3rem; font-size: 1.25rem; }
.cognitive-3 .radio-option { min-height: 2.5rem; }
```

Lower cognitive levels get larger targets, more spacing, bigger tap areas. The form atom itself does not change. CSS handles the presentation.

### 1.7 Build Process

A JavaScript build step at content generation time handles all AAC variant creation:

- Takes content JSON with standard form questions
- Runs questions through Workers AI to generate simple word variants
- Fetches icon URLs from the symbol library for each option
- Maps question types to appropriate response libraries by cognitive level
- Stores both standard and AAC variants in the same JSON
- Caches all assets as static files on CDN
- Zero runtime API calls for any input variant

---

## 2. AAC Shim Implementation

### 2.1 Overview

The AAC Shim is a single JavaScript file included in the Astro layout that translates alternative input methods into standard browser events. It enables eye gaze tracking, switch scanning, head mouse, and other assistive input methods to interact with the platform without any component modifications.

### 2.2 Architectural Principle

The shim maps assistive input to standard events. Components never know how they were activated. A button clicked by a mouse, tapped by a finger, selected by eye gaze, or reached by switch scanning all receive the same click event.

| Input Method | Shim Translation | Browser Event Fired |
|---|---|---|
| Eye gaze lands on element | Dwell time threshold met | hover / focus / click |
| Switch press | Scan position mapped | focus / click |
| Head tracker movement | Position mapped to cursor | mouseover / hover / click |
| Single button press | Cycle through targets | focus / click on confirmation |

### 2.3 Shim Compatibility with Alt Text Display Modes

The shim is fully compatible with all five alt text display modes. It does not know which mode is active. It sends events; CSS determines what is visible.

| Alt Text Mode | Shim Behaviour | User Experience |
|---|---|---|
| Hover | Eye gaze fires hover event | AAC description appears on gaze |
| Overlay | Shim navigates between targets | AAC text already visible on top |
| Underneath | Shim reads elements in sequence | Visual above, AAC text below |
| Replace | Shim navigates AAC content directly | Pure AAC, visuals hidden |
| Off | Shim navigates visual elements | Standard navigation, no AAC text |

### 2.4 Shim and Render Modes

The shim works across all three render modes. AAC users are not forced into text-only mode. They can choose full animation with shim navigation.

- **Full animation mode:** GSAP animations play, shim navigates between elements, alt text read by device as animations display
- **Reduced animation mode:** Icons, images, structure visible, shim navigates cleanly without motion distractions
- **Text-only mode:** Pure content and buttons, fastest shim navigation, optimal for switch scanning

The user chooses their render mode independently of their input method. All 24 accessibility settings remain independent and combinable.

### 2.5 Integration with Form Inputs

The shim enables AAC users to complete form inputs using their assistive device. Card select inputs become scan targets. Each card is a focusable, clickable element that the shim can reach through any input method.

- Switch scanner cycles through card options, user presses switch to select
- Eye gaze user looks at emotion card, dwell time triggers selection
- Head tracker user moves cursor to card, activation gesture selects
- All input methods capture the same selection data as a standard click

### 2.6 Implementation Requirements

- Single JS file included in Astro layout head
- No modifications to any existing atom components
- Configuration via user preference settings (input method, dwell time, scan speed)
- Settings saved to seat/account, persist across sessions via Google Drive
- Shim detects available input hardware automatically where possible
- Graceful fallback to standard input if shim fails to initialise

---

## 3. Print Traceability System

### 3.1 Overview

Every piece of content carries a unique identifier from generation through to print. This system protects third-party AAC symbol licences, enables content audit trails, supports safeguarding recall, and prevents unauthorised commercial redistribution.

### 3.2 Licence Protection Requirement

The platform uses licensed AAC symbols from third-party providers. These licences have strict terms regarding redistribution. Unauthorised commercial sale of printed content containing these symbols could result in licence revocation, which would remove AAC support for all platform users across all brands. The traceability system is therefore a safeguarding requirement, not merely a commercial protection.

### 3.3 Free vs Subscriber Content Boundary

The licence protection boundary aligns with the subscription tier.

| Aspect | Free Tier | Subscriber Tier |
|---|---|---|
| Content type | Basic text workbooks | Full AAC with licensed symbols |
| Print output | Clean text PDF | Full accessibility settings applied |
| Licensed content | None | AAC symbols, icon libraries |
| Print tracking | Not required | Full audit trail |
| Redistribution risk | No licence implications | Licence revocation risk |
| Sharing permitted | Yes — unrestricted | Personal/practitioner use only |

### 3.4 Unique Content Identifier

Every piece of content generated by the pipeline carries a unique ID. This ID is embedded across all output formats at generation time.

#### 3.4.1 ID Composition

```
content_id: "MTB-WB-2026-0342-v2.1-seat0847-20260301T0914"
```

- Brand prefix (MTB = Mind the Box)
- Content type (WB = Workbook)
- Year of generation
- Sequential content number
- Library version used
- Seat that accessed/printed (where applicable)
- Timestamp of generation or print event

#### 3.4.2 Embedded Locations

| Format | Embedding Method | Visibility |
|---|---|---|
| PDF | Metadata fields (author, creator, custom) | Hidden — requires metadata reader |
| PDF visual | Near-white micro text on white background | Invisible to eye, visible on inspection |
| Images | EXIF data in every generated image | Hidden — requires EXIF reader |
| HTML | Meta tags in page source | Hidden — visible in source code |
| JSON | Field in content schema | System-level — not rendered to user |
| Print footer | Small text in page footer | Visible — "For personal use only" + ref |

### 3.5 Print Event Telemetry

The system logs print events as part of standard usage telemetry. No content or personal data is captured — only the event metadata.

#### 3.5.1 Data Captured at Print

- Seat ID that initiated print
- Content ID printed
- Timestamp of print event
- Format: AAC version or standard version
- Accessibility settings active at time of print
- Cognitive level applied
- Browser print or server-rendered PDF

#### 3.5.2 Anomaly Detection

Automated monitoring identifies unusual print patterns that may indicate commercial redistribution:

- Excessive prints of same content from same seat (threshold: configurable, e.g. >10 in 24hrs)
- Bulk printing across multiple content items in rapid succession
- AAC content printing flagged as higher sensitivity due to licensed symbols
- Alerts generated for review — not automatic action

### 3.6 Provenance Trace

The content ID enables full provenance tracing from any output back to its origin:

```
Content ID → Generation timestamp
           → Prompt hash used
           → Library versions active
           → Safeguarding checks performed
           → Values alignment score
           → Brand and content type
           → Licence holder / seat that printed
           → Settings applied at print time
```

This trace supports multiple functions:

- **Licence compliance:** Demonstrate to symbol licensors that distribution is controlled and auditable
- **Safeguarding recall:** If content is flagged, identify every seat that accessed or printed it
- **Complaint investigation:** Trace flagged content back to exact library version and generation parameters
- **Breach enforcement:** If content appears on resale platforms, metadata identifies the source seat

### 3.7 Terms of Use: Print Licence

Printed subscriber content carries a visible footer:

```
"For personal or practitioner use only.
 Contains licensed AAC symbols. Redistribution prohibited.
 Ref: [content_id]"
```

Licence terms explicitly state:

- Printed content is for personal use by the seat holder or their practitioner
- Commercial redistribution is prohibited
- Prohibition exists because content contains third-party licensed AAC symbols
- Unauthorised redistribution risks licence revocation affecting all platform AAC users
- Explanation provided in accessible language: "If you sell this, non-verbal children lose their symbols"

### 3.8 Breach Response Process

If content is found on an unauthorised resale platform:

1. Acquire sample of redistributed content
2. Extract metadata and unique content ID
3. Check invisible watermark if metadata has been stripped
4. Trace content ID to specific licence holder and seat
5. Contact licence holder with evidence and request removal
6. If unresolved, revoke seat access
7. Proactively notify symbol licensor demonstrating enforcement action
8. Log incident in audit system for pattern detection

---

## 4. System Integration

### 4.1 How the Three Systems Connect

The AAC form inputs, shim implementation, and print traceability are not separate features. They are layers of the same architecture that reinforce each other.

- AAC libraries provide the content for form inputs at each cognitive level
- The shim enables AAC users to navigate and select those inputs with assistive devices
- The form captures the same selection data regardless of input method
- The print system ensures any printed output of AAC content is traceable and licence-compliant
- All three layers are controlled by user settings stored on the seat
- All three layers are independent — any combination of settings is valid

### 4.2 No New Components Required

The entire specification described in this document uses existing atoms and infrastructure:

- **Form atom** — already supports multiple input types
- **Card atom** — already renders icon + text combinations
- **Button atom** — already functions as a tap/click target
- **Icon atom** — already renders SVG symbols
- **Text atom** — already handles simple word variants

What is needed:

- JSON library files for AAC response options — content, not code
- CSS variables for cognitive level sizing — styling, not components
- Build-time JS to generate AAC variants and fetch icon URLs — one script
- Shim JS file for assistive input translation — one script
- Metadata embedding in PDF generation — configuration, not new code
- Print event logging — extension of existing telemetry

### 4.3 Cost Impact

Additional infrastructure cost for all three systems: **zero**. All processing occurs at build time or uses existing Cloudflare Workers free tier. No new services, no new databases, no new APIs. The AAC libraries are JSON files stored in R2. The shim is a static JS file served from CDN. The metadata embedding is part of the existing PDF generation step. Total additional monthly cost: **£0.00**.

---

*This document is versioned and auditable as part of the platform's architecture documentation.*
