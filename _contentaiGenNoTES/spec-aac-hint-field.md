# aac_hint — Field Spec for AI Content Generation

Reference doc for building the content generation pipeline. Upload to content gen system when ready.

## What is aac_hint?

A short phrase (2-5 words) that tells the AAC resolver which pictograms to show for a piece of content. It's the bridge between AI-generated content and the AAC pictogram pipeline.

The resolver's input is always a text string. For images, that string is `alt_aac_phrase` (curated manually). For AI-generated content (workbook questions, scrollytelling steps, section narratives), the AI provides `aac_hint` alongside the content it generates.

## Where it appears

Every content schema that generates text visible to users should include an `aac_hint` field:

```json
{
  "workbook_question": {
    "text": "How did that make you feel?",
    "aac_hint": "feel emotions"
  },
  "scrollytelling_step": {
    "narrative": "Sometimes we carry feelings from childhood that still affect us today.",
    "aac_hint": "feel child remember today"
  },
  "section_heading": {
    "text": "Understanding Your Boundaries",
    "aac_hint": "know stop safe"
  }
}
```

## Rules for AI-generated aac_hint

### Word selection
- Use words that exist in `alt_symbols` (1,799 entries — 251 core + 1,548 fringe)
- Prefer Green-tier words (~60 survival vocab) when the concept allows it
- Use the base (uninflected) form: "feel" not "feeling", "go" not "going"
- The OpenAAC lemma map handles inflections, but base forms give cleaner results

### Length
- 2-5 words maximum
- The resolver processes each word independently — fewer words = fewer cards = cleaner AAC output
- Every word becomes a pictogram card (or text-only card if no symbol exists)

### What to include
- The emotional/conceptual core of the content, not a summary
- Action verbs from the content: feel, help, want, stop, go, know
- Key nouns: child, family, home, body, heart
- Feelings vocabulary: happy, sad, angry, afraid, tired, lonely

### What to exclude
- Stop words (a, an, the, was, were) — resolver strips these anyway
- Abstract connector words unless they're Green-tier: "however", "furthermore"
- Proper nouns — no pictograms exist for names
- Numbers — write "many" or "few" instead of "3" or "100"

### Examples

| Content | Good aac_hint | Bad aac_hint |
|---------|--------------|-------------|
| "When someone crosses your boundary, it's okay to say no." | "stop no safe" | "boundary crossing permission" |
| "Think about a time you felt really happy." | "think feel happy" | "reflect upon moment happiness" |
| "Your body tells you when something isn't right." | "body feel not good" | "somatic awareness indicators" |
| "It takes courage to ask for help." | "brave help want" | "courage seeking assistance" |
| "Sometimes we need to rest before we can move forward." | "tired stop go" | "rest recuperation progress" |

### Therapeutic content bias

This is a mental health learning site. The aac_hint should always lean towards:
- Feelings vocabulary (largest pictogram coverage at Green tier — all 15 with ARASAAC symbols)
- Empowerment verbs: want, help, go, stop, know, can, try
- Safety vocabulary: safe, stop, no, help, want
- Body awareness: body, feel, hurt, tired, hungry

Avoid clinical/diagnostic language in hints — "anxiety" resolves to text-only. "afraid" resolves to a pictogram.

## Validation

The content generation pipeline should validate aac_hint at generation time:

```javascript
import { resolveAACPhrase } from '../lib/aac/aacResolver';

const result = resolveAACPhrase(hint, symbols, overrides);
const unresolved = result.filter(r => r.type === 'text' && !STOP_WORDS.has(r.word));

if (unresolved.length > 0) {
  console.warn(`aac_hint "${hint}" has unresolved words: ${unresolved.map(r => r.word).join(', ')}`);
  // AI should regenerate with different words, or flag for human review
}
```

Zero unresolved words is the target. The existing `check-unresolved-words.ts` script can be extended to validate aac_hints from content JSON.

## Cognitive level interaction

At Green level, only ~60 words show pictograms. An aac_hint like "remember decide between" uses all Orange-tier words — a Green-level user sees no pictograms at all for that content.

**Rule:** Every aac_hint should contain at least one Green-tier word. This ensures even the most basic cognitive level sees something meaningful.

```
Good: "feel happy help"     → Green user sees: [feel] [happy] [help] — all three
Bad:  "remember decide"     → Green user sees: nothing (both Orange)
Fix:  "think want help"     → Green user sees: [think]? [want] [help] — at least two
```

The content generation prompt should enforce this: "Include at least one word from the Green core vocabulary list in every aac_hint."
