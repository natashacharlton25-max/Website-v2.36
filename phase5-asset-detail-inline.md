# Phase 5: Extract asset-detail.css (page CSS) + Remaining Inline Styles

## Part A: asset-detail.css (page CSS)

This is the last file in `src/styles/pages/`. First check what's in it:
```bash
grep -n "/\*.*=" src/styles/pages/asset-detail.css | head -20
wc -l src/styles/pages/asset-detail.css
```

The page uses these imported components: ContentSwitcher, Breadcrumbs, IsotopeImageGallery, ProductInfo, SpecGrid, RelatedGrid, ShareSection, Icon, Badge.

### Strategy
Since the page already has many components, the remaining CSS is likely layout glue between them plus overrides. For each block:

1. **If it styles an imported component** → move into that component as a variant or scoped style
2. **If it's layout glue** → move into a ProductDetailLayout component or keep as minimal scoped styles
3. **If it's dead code** → delete

### Steps
1. Grep for all BEM root blocks: `grep "^\." src/styles/pages/asset-detail.css | sed 's/__.*//;s/--.*//;s/ .*//' | sort -u`
2. Cross-reference each against the component files to see what's already handled
3. Move remaining rules into the components they style
4. Delete `src/styles/pages/asset-detail.css` and remove import from global.css
5. Delete the `src/styles/pages/` folder entirely

### Verify
```bash
ls src/styles/pages/ 2>/dev/null  # Should not exist
grep -rn "styles/pages" src/ --include="*.css" --include="*.astro"  # Should return zero
```

---

## Part B: Remaining Inline Styles

### B1: services/[slug].astro (453 lines inline)

After Phase 3 moved services.css into components, [slug].astro still has 453 lines of inline `<style is:global>`. These contain:
- Image section overrides (#service-image-section) 
- Details section (.service-details, .details-grid, .details-card, .details-card__list)
- Process section (.service-process, .process-timeline, .process-step, etc.)
- CTA wrapper overrides (.service-cta-wrapper)
- Vertical card overrides (already partly in RelatedGrid)
- Responsive: 968px, 768px, 400px, 300px, 200px

#### Strategy
These are component-level styles masquerading as page styles:

1. **Details section** → Create `src/components/Sections/ServiceDetails.astro` with the card grid + bullet lists. Move `.service-details`, `.details-grid`, `.details-card`, `.details-card__list` + responsive into scoped `<style>`.

2. **Process section** → The TimelineStepper created in Phase 3 should handle this. Check if these styles duplicate or extend it. If they extend it, merge into TimelineStepper as a variant. If they duplicate, delete.

3. **Image section overrides** → Move into ImageTextSection as a variant (e.g. `variant="checklist"`) for the check-mark list styling.

4. **CTA wrapper overrides** → Move into CTASection (may already be handled by alignment="left" from Phase 3).

5. **Vertical card overrides** → Check RelatedGrid — these may already be there from earlier work.

6. Remove `<style is:global>` block entirely from [slug].astro.

#### Verify
```bash
grep -n "<style" src/pages/services/[slug].astro  # Should return nothing
```

---

### B2: search.astro (~1177 lines inline)

This is the largest inline style block. It's essentially a complete search page with no component extraction.

```bash
grep -n "/\*.*=" src/pages/search.astro | head -15
```

#### Strategy
The search page needs 2-3 components:

1. **SearchHero** → The search input hero section with background gradient
2. **SearchResults** → Results list with cards, loading states, no-results
3. **QuickLinks** → The quick link pills/buttons section

Create these components in `src/components/Search/` with all styles scoped. Rebuild search.astro to import them.

This is a large task. If it can't be done in one session, at minimum:
- Move the `<style is:global>` to a scoped `<style>` (remove is:global) and verify nothing breaks
- If things break, identify which styles leak to other pages and only those need component extraction

---

### B3: verify.astro (73 lines inline)

This is already scoped (`<style>` not `<style is:global>`). It's a small self-contained page. 

#### Strategy
This is acceptable as-is — it's scoped, short, and verify is a one-off page that Python won't be generating. Leave it unless you want absolute purity.

If you do want to extract it:
- Create `src/components/Verify/VerifyCard.astro` with the card + icon + message + actions
- Move all `.verify-*` styles into scoped `<style>` on that component

---

### B4: checkout.astro (93 lines inline)

This should be handled by Phase 4 — the inline styles move into the Checkout components. After Phase 4, checkout.astro should have zero `<style>` block.

---

## Final Verification

After all phases:
```bash
# No page CSS folder
ls src/styles/pages/ 2>/dev/null

# No a11y page folder  
ls src/styles/a11y/pages/ 2>/dev/null

# No inline styles on pages (except verify.astro if kept)
grep -rl "<style" src/pages/ --include="*.astro"

# No page CSS imports
grep -rn "styles/pages" src/ --include="*.css" --include="*.astro"
```

All should return zero (or only verify.astro for the inline styles check).
