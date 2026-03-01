# Accessible PDF Generation with AAC — Spec

Reference doc for building the PDF generation pipeline. Covers tagged PDF structure, AAC pictogram embedding, cognitive level variants, and integration with the existing resolver.

## Core principle

Every PDF the site generates is a communication tool for vulnerable users. It must be readable by screen readers, navigable with assistive tech, and meaningful at every cognitive level — including users who rely on pictograms instead of text.

PDFs are static snapshots of the web experience. The same content, resolver, and cognitive level system that drives the site produces the PDF. One source of truth, multiple output formats.

## Architecture

```
Content JSON (workbook questions, narratives, legal text)
    ↓
AAC resolver (same resolveAACPhrase from aacResolver.ts)
    ↓
PDF builder (layout engine)
    ↓
Three cognitive level variants:
    ├── Green PDF  (survival vocabulary, large targets, simple layout)
    ├── Yellow PDF (expanded vocabulary, medium layout)
    └── Orange/Full PDF (complete content, standard layout)
```

The resolver runs at build time — same as the web pipeline. No runtime resolution inside the PDF.

## Tagged PDF (PDF/UA compliance)

Every generated PDF must be a tagged PDF conforming to PDF/UA (ISO 14289-1). This is non-negotiable for screen reader access.

### Required structure tags

| Tag | Usage | Notes |
|-----|-------|-------|
| `<Document>` | Root | Language attribute set (`lang="en-GB"`) |
| `<H1>` – `<H6>` | Headings | Proper nesting, no skipped levels |
| `<P>` | Body text | Every paragraph tagged |
| `<L>`, `<LI>` | Lists | Ordered and unordered |
| `<Table>`, `<TR>`, `<TH>`, `<TD>` | Tables | Header cells marked with `<TH>` |
| `<Figure>` | Images/pictograms | Must have `/Alt` text |
| `<Link>` | Hyperlinks | URI and display text |
| `<Span>` | Inline elements | Language changes, emphasis |
| `<Art>` | Decorative images | Marked as artifact, ignored by AT |

### Reading order

Tag order in the PDF structure tree defines reading order — not visual position on the page. For layouts with pictograms beside text, the structure must read logically:

```
<P>
  "How do you feel right now?"
</P>
<Figure Alt="feel">
  [ARASAAC pictogram: feel]
</Figure>
<Figure Alt="happy">
  [ARASAAC pictogram: happy]
</Figure>
```

Screen reader reads: "How do you feel right now?" then "feel" then "happy". The pictograms are supplementary, not replacement.

### Metadata

Every PDF must include:
- `/Title` — document title (not filename)
- `/Lang` — document language (`en-GB`)
- `/Creator` — "Mind the Box CIC"
- `/Subject` — brief description
- `/Keywords` — includes "AAC", "accessible", cognitive level
- `/DisplayDocTitle` — true (show title in reader title bar, not filename)

## AAC pictogram embedding

### Image format

ARASAAC pictograms are PNG files from the Open Symbols API. Embed as:
- Format: PNG (no JPEG — pictograms need sharp edges)
- Resolution: 96 DPI minimum, 150 DPI for print
- Size: consistent per cognitive level (see sizing below)
- Colour space: sRGB

### Embedding pattern

Each pictogram is a `<Figure>` with:
- `/Alt` text = the word (e.g. "feel", "happy", "stop")
- `/BBox` = bounding box for the image
- Label text below the image (same as web AAC cards)

```
┌──────────────┐
│  [pictogram] │   ← Figure tag, Alt="feel"
│    feel       │   ← Span tag, text label
└──────────────┘
```

This mirrors the web AAC card structure:
```html
<span class="aac-card" data-core-tier="green">
  <img src="feel.png" alt="feel" />
  <span>feel</span>
</span>
```

### Inline vs block pictograms

**Block pictograms** (default): Cards displayed in a row below or beside the text they describe. Used for workbook questions, section headings, key concepts.

```
How do you feel right now?

[feel]  [happy]  [sad]  [afraid]
```

**Inline pictograms** (optional): Small pictograms embedded within text flow. Used for vocabulary definitions and learning content where the pictogram illustrates a specific word in context.

```
Sometimes we feel [😊 happy] and sometimes we feel [😢 sad].
```

Inline pictograms should be sized to match the text line height. Block pictograms follow the cognitive level sizing table.

### Text-only cards in PDF

Words without pictograms (abstract function words, pronouns, conjunctions) render as text-only cards — a bordered box with the word, no image. Same behaviour as web.

```
┌──────┐  ┌──────────────┐  ┌──────┐
│ [🖼] │  │     and      │  │ [🖼] │
│ feel │  │              │  │ help │
└──────┘  └──────────────┘  └──────┘
```

## Cognitive level variants

One content source, three PDF outputs. The cognitive level controls everything — vocabulary depth, layout density, font size, pictogram size, and content complexity.

### Green PDF (survival communication)

| Aspect | Value |
|--------|-------|
| Vocabulary | ~60 Green-tier words only |
| Pictogram size | 80×80px (large targets) |
| Font size | 18pt body, 28pt headings |
| Line spacing | 1.8 |
| Cards per row | 2-3 maximum |
| Layout | Single column, generous whitespace |
| Content | Simplified — one idea per page section |
| Workbook inputs | Large checkbox/circle areas, 2-3 options maximum |
| Page margins | 25mm (wider for easier handling) |

### Yellow PDF (expanding communication)

| Aspect | Value |
|--------|-------|
| Vocabulary | ~148 words (Green + Yellow tier) |
| Pictogram size | 60×60px (medium) |
| Font size | 14pt body, 22pt headings |
| Line spacing | 1.5 |
| Cards per row | 4-6 |
| Layout | Single column with occasional two-column for cards |
| Content | Standard — short paragraphs, clear language |
| Workbook inputs | Medium areas, 4-6 options |
| Page margins | 20mm |

### Orange/Full PDF (complete content)

| Aspect | Value |
|--------|-------|
| Vocabulary | All tiers including fringe domain nouns |
| Pictogram size | 40×40px (compact) |
| Font size | 11pt body, 18pt headings |
| Line spacing | 1.4 |
| Cards per row | 6-8 |
| Layout | Two-column where appropriate |
| Content | Full detail — nuanced language, longer paragraphs |
| Workbook inputs | Standard form fields, open text areas |
| Page margins | 15mm |

### Content reduction (not just visual scaling)

Green PDFs don't just show the same content with bigger text. The content itself is simplified:

| Full content | Green content |
|-------------|---------------|
| "When someone crosses your boundary, it's okay to say no. Boundaries help us feel safe and respected in our relationships." | "You can say no. No is safe." |
| "Think about a time when you felt a strong emotion. What was happening? Where were you? Who was there?" | "How did you feel?" |
| "Rate your current emotional state on a scale of 1-10, considering both physical sensations and mental wellbeing." | [happy face] [neutral face] [sad face] — tap one |

This means the content JSON needs three variants per text block:

```json
{
  "question": {
    "full": "Think about a time when you felt a strong emotion. What was happening?",
    "yellow": "Think about a strong feeling. What happened?",
    "green": "How did you feel?",
    "aac_hint": {
      "full": "think feel strong emotion happen",
      "yellow": "think feel happen",
      "green": "feel"
    }
  }
}
```

## Workbook-specific features

### Response areas

Workbook PDFs need fillable response areas. These must be tagged as form fields for assistive tech:

| Cognitive level | Response type | PDF implementation |
|----------------|--------------|-------------------|
| Green | Tap/circle a pictogram | Large clickable areas with radio button form fields |
| Green | Draw/colour | Empty bordered box (non-interactive in PDF, used when printed) |
| Yellow | Select from options | Checkbox form fields with pictogram + text labels |
| Yellow | Short answer | Text input field, 1-2 lines |
| Orange/Full | Free text | Multi-line text area form field |
| Orange/Full | Scale/slider | Row of radio buttons labelled 1-10 |

### Page structure for workbooks

Every workbook page follows this pattern:

```
┌─────────────────────────────────┐
│ Section heading                  │  ← H2 tag
│ [pictogram] [pictogram]         │  ← AAC cards for heading
├─────────────────────────────────┤
│ Instruction/narrative text       │  ← P tag
│ [pictogram row for key words]    │  ← Figure tags
├─────────────────────────────────┤
│ Question                         │  ← P tag, bold
│ [pictogram row for question]     │  ← Figure tags
├─────────────────────────────────┤
│ Response area                    │  ← Form field
│ (options / text input / drawing) │
└─────────────────────────────────┘
```

### Print considerations

Workbooks are often printed. The PDF must work both on screen and on paper:
- No colour-dependent meaning (don't rely on green=good, red=bad)
- Pictograms must be clear in greyscale (ARASAAC colours are designed for this)
- Response areas must have clear borders for pen/pencil
- Page breaks at logical content boundaries (never split a question from its response area)
- Header/footer with page numbers and workbook title

## Font selection

| Use | Font | Fallback | Why |
|-----|------|----------|-----|
| Body text | OpenDyslexic or Lexie Readable | Arial, sans-serif | Dyslexia-friendly, open source |
| Headings | Same as body | Same | Consistency matters more than style |
| AAC card labels | Same as body, bold | Same | Must match the web experience |
| Legal/small print | Same as body, smaller | Same | One font family throughout |

Embed the font in the PDF — don't rely on system fonts. PDF viewers on tablets/phones may not have the expected fonts installed.

## Integration with existing pipeline

### Resolver usage

```typescript
import { resolveAACPhrase } from '../lib/aac/aacResolver';
import { loadAllAltText } from '../data/load-alt-text';

// Same resolver, same symbols, same overrides
const symbols = loadSymbols();
const overrides = loadOverrides();

// For a workbook question at Green level:
const cards = resolveAACPhrase('feel happy sad', symbols, overrides, 'green');
// Returns: [{ type: 'aac', word: 'feel', ... }, { type: 'aac', word: 'happy', ... }, ...]

// For the same question at Full level:
const cardsAll = resolveAACPhrase('think feel strong emotion happen', symbols, overrides);
// Returns all words resolved, including fringe vocabulary
```

### Image URLs for pictograms

The resolver returns `aac_url` for each resolved word — the ARASAAC image URL. The PDF builder fetches these images and embeds them.

```typescript
for (const card of cards) {
  if (card.type === 'aac' && card.aacUrl) {
    const imgBuffer = await fetch(card.aacUrl).then(r => r.arrayBuffer());
    pdfPage.drawImage(imgBuffer, { x, y, width: cardSize, height: cardSize });
    pdfPage.drawText(card.word, { x: labelX, y: labelY, size: labelFontSize });
  } else {
    // Text-only card — bordered box with word
    pdfPage.drawRect({ x, y, width: cardSize, height: cardSize, borderColor: grey });
    pdfPage.drawText(card.word, { x: textX, y: textY, size: labelFontSize });
  }
}
```

### Filename convention

```
{brand}_{type}_{slug}_{cognitive-level}_{date}.pdf

Examples:
mtb_workbook_feelings-explorer_green_2026-03-01.pdf
mtb_workbook_feelings-explorer_yellow_2026-03-01.pdf
mtb_workbook_feelings-explorer_full_2026-03-01.pdf
bylw_resource_boundary-basics_green_2026-03-01.pdf
```

## Safeguarding

### Content traceability

Every PDF generation logs to `alt_text_log` (same safeguarding table):
- Which content was used
- Which cognitive level
- Which pictograms were embedded
- Who triggered the generation (user ID or 'system')
- Timestamp

### Review workflow

AI-generated content that appears in PDFs must pass through the same validation as web content:
- [ ] Every `aac_hint` resolves to zero unresolved words
- [ ] Every `aac_hint` contains at least one Green-tier word
- [ ] No clinical vocabulary where a feelings word exists
- [ ] Content reduction for Green/Yellow reviewed by a human (AI can draft, human approves)
- [ ] Pictogram selections reviewed for cultural appropriateness
- [ ] Printed output checked — all pictograms legible in greyscale

### Version control

Generated PDFs are immutable — once published, they don't change. If content is updated, a new version is generated with a new date in the filename. Old versions are retained (safeguarding requirement — you may need to prove what a user was given).

## Technical implementation notes

### PDF library

Recommended: `pdf-lib` (JavaScript, works in Node and browser, MIT license). It supports:
- Tagged PDF structure
- Form fields
- Image embedding (PNG, JPEG)
- Font embedding
- Custom metadata

Alternative: `@react-pdf/renderer` if you want React-like component syntax for layout. Heavier dependency but more ergonomic for complex layouts.

Do NOT use: `puppeteer` / headless Chrome for PDF generation. It produces untagged PDFs that are inaccessible to screen readers. The HTML-to-PDF approach loses the structure tree.

### Build vs runtime

PDFs should be generated at **build time** for published workbooks and resources (same as the web content pipeline — snapshot from D1, resolve, render). 

For user-specific PDFs (completed workbook with their answers), generate at **runtime** on the Cloudflare Worker. The resolver and symbols are already available in the Worker environment.

### File storage

Generated PDFs go to R2 alongside images. Same CDN pipeline, same immutable caching:

```
R2 bucket:
  pdfs/
    mtb_workbook_feelings-explorer_green_2026-03-01.pdf
    mtb_workbook_feelings-explorer_yellow_2026-03-01.pdf
```

Served via the same Worker route pattern as images, with appropriate Content-Type and Content-Disposition headers.

## Validation checklist

Before publishing any generated PDF:

- [ ] Opens in Adobe Acrobat accessibility checker with zero errors
- [ ] Structure tree is complete (all content tagged, reading order correct)
- [ ] All images have `/Alt` text
- [ ] All form fields have labels
- [ ] Document has `/Title`, `/Lang`, `/DisplayDocTitle`
- [ ] Correct cognitive level variant (pictogram count, font size, content complexity match)
- [ ] Pictograms are legible at intended print size
- [ ] Greyscale print test passes (no colour-dependent meaning)
- [ ] Page breaks don't split questions from response areas
- [ ] Font is embedded (not system-dependent)
- [ ] File size reasonable (target: under 5MB per workbook)
