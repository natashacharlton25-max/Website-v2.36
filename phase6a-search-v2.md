# Phase 6a: Extract search.astro (simplified)

## Overview
Reuse HeroSection + create one SearchResults component. Delete SearchOverlay (old, unused).

---

## Step 1: Delete SearchOverlay component

Find and delete:
```bash
find src/components -name "*SearchOverlay*" -o -name "*search-overlay*"
```

Also remove its a11y styles:
```bash
rm src/styles/a11y/components/search-overlay.css
```
Remove the `@import './search-overlay.css'` from `src/styles/a11y/components/index.css`.

Check nothing else imports it:
```bash
grep -rn "SearchOverlay\|search-overlay\|openSearchOverlay" src/ --include="*.astro" --include="*.ts" --include="*.css" | grep -v "node_modules"
```
Remove any trigger buttons or keyboard shortcuts that reference it (likely in GlassNav or BaseLayout).

---

## Step 2: Create `src/components/Search/SearchResults.astro`

This is the one real component. It owns everything below the hero: quick links, results grid, no-results state, badge templates, and the client-side search script.

### Props
```typescript
interface Props {
  searchableContent: Array<{
    title: string;
    description: string;
    url: string;
    category: string;
    type?: string;
    image?: string | null;
  }>;
  quickLinks?: Array<{
    href: string;
    icon: string;
    title: string;
    description: string;
  }>;
  badgeCategories?: string[];
}
```

### HTML to extract from search.astro
- Quick links section (lines 113-146) — the 4 category cards
- Badge templates (lines 148-155) — pre-rendered for client-side use
- Search results section (lines 157-180) — header, grid, no-results

### Script to extract
- The entire `<script define:vars>` block (line 1192+)
- The `define:vars` data comes from the component's props
- Keep the `topicHue` function — either inline it in the component frontmatter or import from `src/lib/utils.ts`

### CSS to extract
Move ALL styles from search.astro's `<style is:global>` block EXCEPT the search hero/input styles (those go here too since the input lives in HeroSection's slot):

**Search input styles (for the slot content):**
- `.search-input-wrapper`
- `.search-input`, `.search-input:focus`, `.search-input::placeholder`
- `.search-input__icon`
- `.search-input__clear`

**Quick links:**
- `.quick-links`, `.quick-links__container`
- `.quick-links__grid`
- `.quick-link-card`, `.quick-link-card__icon`, `.quick-link-card__title`, `.quick-link-card__desc`

**Results:**
- `.search-results`, `.search-results__container`
- `.search-results__header`, `.search-results__title`, `.search-results__query`
- `.search-results__grid`
- `.result-card`, `.result-card__*` (all result card sub-elements)

**No results:**
- `.no-results`, `.no-results__icon`, `.no-results__title`, `.no-results__text`

**All responsive breakpoints** for the above classes.

**Reduced motion** — move to `src/styles/a11y/motion/reduced-motion.css`:
- Any `#a11y-content-wrapper.a11y-reduce-motion` rules for search components
- Strip `:global()` wrappers if present

Use `<style is:global>` on the component since:
- Result cards are JS-generated (not Astro-rendered)
- Search input lives in HeroSection's slot (outside this component's scope)

---

## Step 3: Rebuild search.astro

```astro
---
import BaseLayout from '../Layouts/BaseLayout.astro';
import HeroSection from '../components/Sections/HeroSection.astro';
import Icon from '../components/Icons/Icon.astro';
import SearchResults from '../components/Search/SearchResults.astro';
import { getCollection } from 'astro:content';

// Data fetching (keep existing frontmatter logic)
const allInsights = await getCollection('insights');
const allAssets = await getCollection('assets');
const allProjects = await getCollection('projects');
const allPresentations = await getCollection('presentations');

// Build searchable content array (keep existing logic)
const searchableContent = [ /* ... existing array building ... */ ];

const quickLinks = [
  { href: '/assets', icon: 'package-fill', title: 'Tools & Resources', description: 'Practical resources for your journey' },
  { href: '/insights', icon: 'book-open-fill', title: 'Insights & Articles', description: 'Thoughtful perspectives and guides' },
  { href: '/services', icon: 'users-fill', title: 'For Professionals', description: 'Resources for therapists and coaches' },
  { href: '/projects', icon: 'stack-fill', title: 'Projects', description: 'Our ongoing and completed work' },
];

const pageTitle = 'Search | Walking With A Smile';
const pageDescription = 'Search our resources, insights, and tools';
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <HeroSection
    variant="gradient"
    gradient="primary"
    alignment="center"
    title='Find what you&apos;re <span class="search-hero__highlight">looking for</span>'
    subtitle="Search our resources, insights, and tools"
  >
    <div class="search-input-wrapper">
      <span class="search-input__icon">
        <Icon name="magnifying-glass-fill" size={28} />
      </span>
      <input
        type="text"
        id="searchInput"
        class="search-input"
        placeholder="Type to search..."
        autocomplete="off"
        autofocus
      />
      <button id="clearSearch" class="search-input__clear" aria-label="Clear search">
        <Icon name="x-circle-fill" size={20} />
      </button>
    </div>
  </HeroSection>

  <SearchResults
    searchableContent={searchableContent}
    quickLinks={quickLinks}
  />
</BaseLayout>
```

Zero `<style>`. Zero `<script>`. Pure assembly.

**Note on the title HTML:** If HeroSection doesn't support HTML in the title prop (for the `<span>` highlight), either:
- Use a `titleSlot` or named slot for the title
- Or add the highlight span styling to HeroSection as a generic `.hero__highlight` class

---

## Step 4: Verify

```bash
grep -n "<style" src/pages/search.astro         # Zero results
grep -n "<script" src/pages/search.astro        # Zero results
grep -rn "SearchOverlay" src/                    # Zero results
grep -rn "search-overlay" src/styles/            # Zero results
```

Visual check:
- Load /search — hero with search input renders
- Type a query — results appear
- Clear search — quick links show
- Check responsive
- Check reduced motion
- Check Cmd+K no longer opens overlay (or repurpose to navigate to /search)
