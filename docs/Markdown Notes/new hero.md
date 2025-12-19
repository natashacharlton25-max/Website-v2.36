# GSAP MorphSVG Hero Animation - Implementation Brief

## Overview

Create an infinite looping SVG morph animation using GSAP MorphSVG plugin. The animation tells a continuous story where each cycle represents growth through healing, with the logo serving as both ending and beginning of each spiral.

## SVG Assets (in order)

1. Logo (embrace/connection icon)
2. Cloud
3. Star
4. Heart
5. House
6. Arrow (upward)
7. Headphones
8. Smile

## Text Sequence

| Step | Shape | Text |
|------|-------|------|
| 1 | Logo | "What if healing looked different?" |
| 2 | Cloud | "What if the hurt began to lift..." |
| 3 | Star | "...and you saw how bright you already are?" |
| 4 | Heart | "What if you chose yourself?" |
| 5 | House | "Gave yourself room to just be?" |
| 6 | Arrow | "Allowed yourself one small step forward?" |
| 7 | Headphones | "Listened to your own voice?" |
| 8 | Smile | "And found yourself walking with a smile, understanding that..." |
| Loop → 1 | Logo | "...healing looks different." then transitions to "What if healing looked different?" |

## Animation Behaviour

- Shape morphs from one SVG to the next
- Text fades in as each shape completes its morph
- Text holds for reading time before next morph begins
- After step 8 (Smile), morph back to Logo (step 1)
- On loop return, Logo text first shows "...healing looks different." (completing the previous sentence), then transitions to "What if healing looked different?" (beginning the new cycle)
- Animation runs infinitely, creating a spiral of growth

## Timing Suggestions

- Morph duration: 0.8-1 second
- Text fade in: 0.3 seconds
- Text hold: 2-3 seconds (adjust for readability)
- Pause between cycles: optional slight pause at logo transition

## Brand Colours

- SVG fill: Sage green (#8B9D83)
- Text: Consider terracotta (#C17C5A) or dark text on cream background (#EEEBE2)
- Typography: Cormorant Garamond for the text

## Technical Notes

- All SVGs should be optimised and have matching viewBox dimensions for smooth morphing
- SVGs need to be converted from PNG references to actual SVG format
- Ensure SVG paths have similar point counts where possible for smoother morphs
- Text animation should be separate from SVG morph, synchronised via GSAP timeline

## Loop Logic

The logo appears only once in the array but serves dual purpose at the loop point. The text handling at position 1 needs conditional logic:

- **First play:** Show "What if healing looked different?" immediately
- **Returning from position 8:** Show "...healing looks different." first, pause, then transition to "What if healing looked different?"

## File References

The SVG shapes correspond to these uploaded references:

- 1.png = Logo (embrace/connection)
- 2.png = Smile face
- 3.png = Star
- 4.png = Heart
- 5.png = Headphones
- 6.png = Flower (not used in final sequence)
- 7.png = Arrow
- 8.png = Cloud
- 9.png = House (light version)
- 10.png = House (darker version)

## Narrative Intent

This animation represents healing as a spiral rather than a linear journey. Each loop through the sequence symbolises another layer of growth. The viewer moves from questioning ("What if...") through transformation, arriving at understanding ("...healing looks different"), which then opens into fresh curiosity for the next cycle. Joy is both the destination and the gateway to continued growth.