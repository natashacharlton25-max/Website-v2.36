# AAC-Friendly Writing Rules for AI Content Generation

Reference doc for building the content generation pipeline. These rules go into the system prompt for any AI that generates user-facing content on the site.

## Core principle

Every sentence on this site may be read through AAC pictograms. Write so the resolver can turn your words into meaningful pictures.

This doesn't mean dumbing down. It means choosing words that have visual representations when a simpler synonym exists, and structuring sentences so the key meaning survives when reduced to 3-5 pictogram cards.

## Verb bias

### Prefer verbs with ARASAAC pictograms

The resolver maps words to ARASAAC pictograms via the `alt_symbols` table. Abstract verbs often resolve to text-only (no picture). Concrete verbs almost always have pictograms.

| Instead of | Use | Why |
|-----------|-----|-----|
| experience | feel | Green-tier, has pictogram |
| utilise | use | Green-tier, has pictogram |
| demonstrate | show | Green-tier, has pictogram |
| communicate | talk / tell | Green-tier, has pictogram |
| comprehend | know / understand | Green/Yellow-tier |
| facilitate | help | Green-tier, has pictogram |
| terminate | stop / end | Green-tier, has pictogram |
| commence | start / go | Green-tier, has pictogram |
| acquire | get | Green-tier, has pictogram |
| indicate | show / tell | Green-tier, has pictogram |
| consider | think | Green-tier, has pictogram |
| require | need / want | Green-tier, has pictogram |
| attempt | try | Yellow-tier, has pictogram |
| recognise | know / see | Green-tier, has pictogram |
| establish | make / build | Green/Yellow-tier |
| navigate | go / find | Green-tier, has pictogram |
| process | think / work | Green/Yellow-tier |

### The Green-tier verb list (prioritise these)

These ~20 verbs cover most therapeutic content. All have ARASAAC pictograms:

**Doing:** go, stop, help, want, get, make, do, put, turn, look, come, give, take, open  
**Feeling:** feel, like, love  
**Thinking:** know, think, tell  
**Being:** eat, drink, play, work, sit, stand, walk, run

### Verb forms

Write in base form where natural. The OpenAAC lemma map handles inflections ("walking" → "walk"), but base forms give cleaner resolver output and are closer to how AAC users construct sentences.

Not a hard rule — "She was walking home" is fine. But "Walk home" is better for AAC clarity when writing instructions or questions.

## Noun bias

### Prefer concrete over abstract

| Instead of | Use | Why |
|-----------|-----|-----|
| wellbeing | feeling good / happy | "wellbeing" = text-only, "happy" = pictogram |
| resilience | strong / brave | "resilience" = text-only, "strong" = pictogram |
| boundaries | stop / safe / no | "boundaries" = text-only, core safety words = pictograms |
| mindfulness | think / feel / body | "mindfulness" = text-only, components = pictograms |
| self-regulation | feel / stop / calm | "self-regulation" = text-only |
| attachment | love / close / safe | "attachment" = text-only |
| coping mechanism | help / way / do | "coping mechanism" = text-only |
| intervention | help | One word, pictogram |

### The wardrobe framework vocabulary

The site's therapeutic approach is "addition not subtraction" — expanding choices. Content should use this language:

- "add" not "replace"
- "choose" not "must"
- "try" not "should"
- "another way" not "the right way"
- "what works for you" not "best practice"

All of these use Green/Yellow-tier words with pictograms.

## Sentence structure

### AAC-parseable sentences

The resolver processes `aac_hint` separately from the full sentence. But the full sentence itself appears in descriptive alt text and is read by screen readers. Structure it so key meaning lands early.

**Good (key words up front):**
- "Feel your body. What does it tell you?"
- "Stop and think before you choose."
- "Help is always okay to ask for."

**Weak (key meaning buried):**
- "In the context of your broader emotional experience, consider what sensations arise."
- "Before proceeding to the next stage, it may be beneficial to pause."
- "Seeking assistance is something that should never be stigmatised."

### One idea per sentence for workbook content

Workbook questions and scrollytelling steps are directly resolved through AAC. Keep one concept per unit:

**Good:**
```json
{
  "text": "How do you feel right now?",
  "aac_hint": "feel now"
}
```

**Weak:**
```json
{
  "text": "Thinking about the exercise we just completed, how do you feel about your progress and what might you want to change going forward?",
  "aac_hint": "think feel want change"
}
```

The weak example has 4 concepts crammed in — the AAC cards show `[think] [feel] [want] [change]` which is a lot for a Green-level user to parse.

## Feelings vocabulary — always use these words

All 15 Green-tier feelings have ARASAAC pictograms (including synonym lookups). These are the highest-priority words on the site:

**Direct match:** happy, hungry, hurt, mad, sorry, tired, bored, sick, thirsty, sad  
**Synonym lookup:** afraid (→ "to scare"), silly (→ "it's funny!"), lonely (→ "alone"), frustrated (→ "annoying"), excited (→ Mulberry "excited man")

Never substitute these with clinical terms:
| Don't write | Write |
|------------|-------|
| anxious | afraid / worried |
| depressed | sad |
| fatigued | tired |
| irritable | mad / frustrated |
| isolated | lonely |
| nauseous | sick |
| dehydrated | thirsty |
| famished | hungry |
| elated | happy / excited |

## Content generation prompt snippet

Add this to the system prompt for any AI generating user-facing content:

```
You are writing for a therapeutic learning site used by people with varying communication needs, including AAC (Augmentative and Alternative Communication) users.

Writing rules:
1. Prefer concrete verbs over abstract ones: "feel" not "experience", "help" not "facilitate", "stop" not "terminate"
2. Prefer concrete nouns over abstract ones: "happy" not "wellbeing", "stop" not "boundary"
3. Use these feeling words exactly: happy, sad, mad, afraid, tired, hungry, hurt, sick, bored, lonely, frustrated, excited, sorry, silly, thirsty
4. Never substitute clinical terms for everyday words
5. Keep one idea per sentence in workbook content
6. Every aac_hint must contain at least one Green-tier core word (want, go, stop, help, feel, happy, sad, etc.)
7. Use base verb forms where natural: "feel" not "feeling", "go" not "going"
8. Write in the wardrobe framework voice: "add" not "replace", "choose" not "must", "try" not "should"
```

## Validation checklist

Before publishing AI-generated content, check:

- [ ] Every `aac_hint` resolves to zero unresolved words (run `check-unresolved-words.ts`)
- [ ] Every `aac_hint` contains at least one Green-tier word
- [ ] No clinical vocabulary in user-facing text where a feelings word exists
- [ ] Workbook questions are one idea per sentence
- [ ] Scrollytelling steps have `aac_hint` populated
- [ ] Section headings that appear visually have `aac_hint` populated
