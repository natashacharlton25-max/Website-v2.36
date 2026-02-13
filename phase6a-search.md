# Phase 6a: Extract search.astro (1362 lines → pure assembly)

## Overview
search.astro is a monolithic file with ~180 lines of frontmatter/HTML and ~1177 lines of `<style is:global>`. Everything needs to move into 3 components.

## Important
- The page has a `<script>` block at line 1192 with `define:vars` that passes search data to client-side JS
- The script populates the search results grid and handles input events
- The script must move with the SearchResults component

---

## Step 1: Create `src/components/Search/SearchHero.astro`

Extract the hero section (lines 83-110) into a component.

**HTML to extract:**
```html
<section class="search-hero">
  <div class="search-hero__content container">
    <h1>...</h1>
    <p>...</p>
    <div class="search-input-wrapper">...</div>
  </div>
</section>
```

**Props:**
```typescript
interface Props {
  title?: string;
  subtitle?: string;
  placeholder?: string;
}
```

**CSS to move:** All `.search-hero`, `.search-hero__*`, `.search-input-wrapper`, `.search-input`, `.search-input__icon`, `.search-input__clear` rules from the `<style>` block, including ALL responsive breakpoints for these classes.

Move into scoped `<style>` on the component. Since child components (Icon) need styling, use `:global()` only where necessary.

---

## Step 2: Create `src/components/Search/QuickLinks.astro`

Extract the quick links section (lines 113-146) into a component.

**HTML to extract:**
```html
<section class="quick-links" id="quickLinks">
  <div class="quick-links__container container">
    <div class="quick-links__grid">
      <!-- 4 quick link cards -->
    </div>
  </div>
</section>
```

**Props:**
```typescript
interface Props {
  links: Array<{
    href: string;
    icon: string;
    iconSize?: number;
    title: string;
    description: string;
  }>;
}
```

The 4 hardcoded cards become data-driven via props. The page passes the array.

**CSS to move:** All `.quick-links`, `.quick-links__*`, `.quick-link-card`, `.quick-link-card__*` rules including responsive.

Move into scoped `<style>`.

---

## Step 3: Create `src/components/Search/SearchResults.astro`

Extract the results section (lines 148-181) AND the script block (line 1192+) into a component.

**HTML to extract:**
```html
<!-- Badge templates -->
<div id="badge-templates" hidden>...</div>

<!-- Search Results Section -->
<section class="search-results" id="searchResults">
  <div class="search-results__container container">
    <div class="search-results__header">...</div>
    <div class="search-results__grid" id="resultsList"></div>
    <div class="no-results" id="noResults">...</div>
  </div>
</section>
```

**Props:**
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
  badgeCategories?: string[];
}
```

**Script:** Move the entire `<script define:vars>` block into this component. The `define:vars` data (searchable content array) comes from props.

**CSS to move:** All `.search-results`, `.search-results__*`, `.result-card`, `.result-card__*`, `.no-results`, `.no-results__*` rules including responsive AND the reduced-motion section.

Move into scoped `<style>`. Since the result cards are JS-generated (not Astro components), the styles need `is:global` or `:global()` for the dynamically created elements.

---

## Step 4: Move data logic

The frontmatter (lines 1-78) has collection fetching and data building. This stays in search.astro — it's page-level data fetching that gets passed as props.

The `topicHue` function is used by both the badge templates and possibly SearchResults. Either:
- Export it from a shared utility (`src/lib/utils.ts`)
- Or keep it in the page frontmatter and pass computed values as props

---

## Step 5: Rebuild search.astro

```astro
---
import BaseLayout from '../Layouts/BaseLayout.astro';
import SearchHero from '../components/Search/SearchHero.astro';
import QuickLinks from '../components/Search/QuickLinks.astro';
import SearchResults from '../components/Search/SearchResults.astro';
import { getCollection } from 'astro:content';

// Data fetching (keep existing logic)
const allInsights = await getCollection('insights');
const allAssets = await getCollection('assets');
// ... rest of data building ...

const quickLinks = [
  { href: '/assets', icon: 'package-fill', title: 'Tools & Resources', description: 'Practical resources for your journey' },
  { href: '/insights', icon: 'book-open-fill', title: 'Insights & Articles', description: 'Thoughtful perspectives and guides' },
  { href: '/services', icon: 'users-fill', title: 'For Professionals', description: 'Resources for therapists and coaches' },
  { href: '/projects', icon: 'stack-fill', title: 'Projects', description: 'Our ongoing and completed work' },
];
---

<BaseLayout title={pageTitle} description={pageDescription}>
  <main class="search-page">
    <SearchHero
      title="Find what you're looking for"
      subtitle="Search our resources, insights, and tools"
      placeholder="Type to search..."
    />
    <QuickLinks links={quickLinks} />
    <SearchResults searchableContent={searchableContent} />
  </main>
</BaseLayout>
```

Zero `<style>`. Zero `<script>`. Pure assembly.

---

## Step 6: Verify

```bash
grep -n "<style" src/pages/search.astro    # Should return nothing
grep -n "<script" src/pages/search.astro   # Should return nothing
```

Visual check: load /search, type a query, verify results appear, quick links work, responsive looks correct.
