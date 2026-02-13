# Phase 6b: Extract services/[slug].astro (~453 lines inline CSS → 0)

## Overview
The [slug].astro page has ~453 lines of `<style is:global>` containing details section, process section, CTA wrapper overrides, image section overrides, and vertical card overrides + responsive.

Most of these should already be partially handled by components from Phase 3 (TimelineStepper, CTASection alignment, RelatedGrid). Check for overlaps before creating new components.

---

## Step 1: Audit what's in the style block

Run:
```bash
grep -n "/\*.*=\|^\." src/pages/services/[slug].astro | head -30
```

Also check which classes the HTML actually uses:
```bash
grep -o 'class="[^"]*"' src/pages/services/[slug].astro | sort -u
```

Cross-reference — some CSS rules may be dead code (like checkout was 85% dead).

---

## Step 2: Check what's already in components

### 2a. Process section → TimelineStepper
TimelineStepper was created in Phase 3. Check if [slug].astro uses it:
```bash
grep -n "TimelineStepper\|process-timeline\|process-step" src/pages/services/[slug].astro | head -10
```

If the page still has inline process HTML instead of `<TimelineStepper>`, replace it with the component and delete the process CSS. If it already uses TimelineStepper, the process CSS is duplicate — delete it.

### 2b. CTA wrapper → CTASection alignment
CTASection got `alignment="left"` in Phase 3. Check if the wrapper overrides are still needed:
```bash
grep -n "service-cta-wrapper\|CTASection" src/pages/services/[slug].astro | head -5
```

If CTASection handles the left-alignment, the wrapper CSS is dead — delete it.

### 2c. Vertical card overrides → RelatedGrid
RelatedGrid got variant support in Phase 3. Check:
```bash
grep -n "related-grid--vertical\|related-card--vertical" src/pages/services/[slug].astro | head -5
```

If RelatedGrid handles vertical variant, these overrides are duplicate — delete.

### 2d. Image section overrides
The `#service-image-section` checkmark list styling. Check if ImageTextSection has a variant for this:
```bash
grep -n "variant\|checklist\|service-image" src/components/Sections/ImageTextSection.astro | head -10
```

---

## Step 3: Create ServiceDetails component (if needed)

The details section (`.service-details`, `.details-grid`, `.details-card`, `.details-card__list`) is the one block that has no existing component.

### 3a. Create `src/components/Sections/ServiceDetails.astro`

**Props:**
```typescript
interface Props {
  title?: string;
  cards: Array<{
    title: string;
    items: string[];
  }>;
}
```

**HTML:** Extract the details section from [slug].astro — the grid of cards with bullet-point lists.

**CSS:** Move all `.service-details`, `.details-grid`, `.details-card`, `.details-card__*` rules into scoped `<style>`, including responsive from all breakpoints (968px, 768px, 400px, 300px, 200px).

### 3b. Update [slug].astro
Replace inline details HTML with:
```astro
<ServiceDetails title="What's Included" cards={service.details} />
```

---

## Step 4: Handle image section overrides

The `#service-image-section` styles add checkmark icons before paragraphs in ImageTextSection. Options:

**Option A (preferred):** Add `variant="checklist"` to ImageTextSection
- Move the `::before` checkmark styling into ImageTextSection.astro
- The checkmark SVG, padding-left, and margin-bottom on paragraphs
- Update [slug].astro: `<ImageTextSection variant="checklist" ... />`

**Option B:** If ImageTextSection is too complex already, keep as a simple scoped override in ServiceDetails or a shared service-page utility.

---

## Step 5: Handle `.service-section__title`

Check if this is still used or if SectionTitle component handles it:
```bash
grep -n "service-section__title" src/pages/services/[slug].astro | head -5
```

If used, it should be replaced with `<SectionTitle>` component. Delete the CSS.

---

## Step 6: Move reduced-motion rules

If there are any `#a11y-content-wrapper.a11y-reduce-motion` rules in the style block, move them to `src/styles/a11y/motion/reduced-motion.css`.

---

## Step 7: Rebuild services/[slug].astro

Target structure:
```astro
---
import BaseLayout from '../../Layouts/BaseLayout.astro';
import HeroSection from '../../components/Sections/HeroSection.astro';
import ImageTextSection from '../../components/Sections/ImageTextSection.astro';
import ServiceDetails from '../../components/Sections/ServiceDetails.astro';
import TimelineStepper from '../../components/Timeline/TimelineStepper.astro';
import CTASection from '../../components/Sections/CTASection.astro';
import RelatedGrid from '../../components/Grids/RelatedGrid.astro';
import Breadcrumbs from '../../components/Breadcrumbs.astro';

const { service } = /* data fetching */;
---

<BaseLayout title={service.title}>
  <Breadcrumbs ... />
  <HeroSection title={service.title} variant="simple" />
  <ImageTextSection variant="checklist" ... />
  <ServiceDetails title="What's Included" cards={service.details} />
  <TimelineStepper steps={service.steps} />
  <CTASection title="Get Started" alignment="left" ... />
  <RelatedGrid variant="vertical" ... />
</BaseLayout>
```

Zero `<style>`. Pure assembly.

---

## Step 8: Verify

```bash
grep -n "<style" src/pages/services/[slug].astro   # Zero results
```

Visual check: load any /services/[slug] page and verify all sections render correctly, responsive works, a11y modes work.
