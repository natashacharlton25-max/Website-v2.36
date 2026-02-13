# Phase 3: Extract services.css (598 lines) into Components

## Overview
services.css contains styling for 5 areas. Each belongs to an existing component or needs a new one. All responsive rules move with their block.

---

## Step 1: Delete dead code

Delete all empty rule blocks `{ }` throughout the file (many from typography purge).

Delete `.section-title` and `.section-title--center` — duplicates SectionTitle component.

---

## Step 2: Move `.timeline-stepper` → new component

`.timeline-stepper`, `.timeline-step`, `.timeline-step__marker`, `.timeline-step__number`, `.timeline-step__line`, `.timeline-step__content`, `.timeline-step__title`, `.timeline-step__text` — this is a full BEM component.

### 2a. Find the HTML in services.astro
```bash
grep -n "timeline" src/pages/services.astro | head -10
```

### 2b. Create `src/components/Timeline/TimelineStepper.astro`
Extract the HTML block from services.astro into a new component. Props:
```typescript
interface Props {
  steps: Array<{ number: number; title: string; text: string; }>;
}
```

Move ALL `.timeline-*` CSS (base + responsive from 768px, 400px, 300px, 200px) into a scoped `<style>` block in this component.

### 2c. Update services.astro
Replace inline HTML with `<TimelineStepper steps={...} />`

---

## Step 3: Move `.services-offerings` overrides → RelatedGrid variant

The `.services-offerings .related-card--horizontal` block heavily overrides RelatedGrid for the services page context.

### 3a. Check RelatedGrid variant support
```bash
grep -n "variant\|class.*related-grid" src/components/Grids/RelatedGrid.astro | head -10
```

### 3b. Add variant="services" to RelatedGrid
Move ALL `.services-offerings .related-card--horizontal` rules into RelatedGrid.astro's `<style>` block, scoped under a variant class like `.related-grid--services`. Include responsive from 650px, 400px, 300px, 200px.

### 3c. Update services.astro
```astro
<RelatedGrid variant="services" ... />
```

---

## Step 4: Move `.why-section .why-card` overrides → WhyCard variant

The why-section overrides WhyCard to be flat with gradient badges.

### 4a. Check WhyCard
```bash
grep -n "variant\|flat" src/components/Cards/WhyCard.astro | head -10
```

### 4b. Add variant="flat" to WhyCard
Move these rules into WhyCard.astro's `<style>` block under `.why-card--flat`:
- Flat background (gradient, no shadow, no hover)
- Gradient badge colours
- nth-child badge variants
- Responsive from 400px, 300px, 200px

### 4c. Move `.why-grid` layout
The `.why-grid` 2-column grid is layout, not component styling. Either:
- Keep as a utility class in utilities.css
- Or move into a WhyGrid wrapper component if one exists

Check: `grep -rn "why-grid" src/components/ --include="*.astro" | head -5`

### 4d. Update services.astro
```astro
<WhyCard variant="flat" ... />
```

---

## Step 5: Move `.cta-section` overrides → CTASection variant

The CTA overrides set left-alignment, max-width 800px, and flex-start buttons.

### 5a. Check CTASection alignment support
```bash
grep -n "align\|variant\|left" src/components/Sections/CTASection.astro | head -10
```

### 5b. Add alignment="left" to CTASection
Move these rules into CTASection.astro under a variant:
- `text-align: left` on content
- `max-width: 800px` on content
- `justify-content: flex-start` on buttons
- Responsive: buttons center on mobile (768px)
- Responsive: text center on very small (300px)

### 5c. Update services.astro
```astro
<CTASection alignment="left" ... />
```

---

## Step 6: Move section padding

`.offerings-section`, `.why-section`, `.how-section` all set `padding: var(--space-4xl) 0`. 

These sections should use the `.section` base class from global.css which already provides this padding with responsive scaling. Check if services.astro already applies `.section` to these:

```bash
grep -n "class.*section" src/pages/services.astro | head -10
```

If they already have `.section`, these padding rules are duplicates — delete them.
If not, add `class="section"` to each `<section>` element in services.astro and delete the padding rules.

The `.offering-divider` is a simple `<hr>` style — check if it's used, and if so add it as a utility or keep it inline on the element.

---

## Step 7: Delete services.css

After all rules are moved:
- Delete `src/styles/pages/services.css`
- Remove its `@import` from `src/styles/global.css`

## Step 8: Verify

```bash
grep -rn "services\.css" src/styles/ --include="*.css"
ls src/styles/pages/
```

services.css should be gone. Only `asset-detail.css` and `checkout.css` should remain in pages/.

Visual check: load /services page and verify all sections look correct.
