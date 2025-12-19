# Reader Component System Guide

A scroll-driven storytelling component system for Astro blog posts with GSAP animations and progress tracking.

---

## Overview

The Reader component system transforms traditional blog posts into immersive, scroll-driven narratives with:

- **Pinned sections** that fade in/out as you scroll
- **Three layout types**: text-only, image-text, full-width-image
- **Circular progress indicator** with section navigation
- **Smooth animations** powered by GSAP ScrollTrigger
- **Flexible theming** with separated background/foreground styles

---

## Quick Start

### 1. Enable Reader Mode in Your Content

Add to your frontmatter in `src/content/insights/your-post.md`:

```yaml
---
title: "Your Post Title"
description: "Your description"
publishDate: "2025-01-15"
author: "Your Name"
category: "Category"
image: "/path/to/image.jpg"
enableReader: true
readerSections:
  - id: "welcome"
    title: "Welcome"
    body: "<p>Your first section content here.</p>"
    layout: "text-only"
    alignment: "center"

  - id: "next-section"
    title: "Next Section"
    body: "<p>More content here.</p>"
    layout: "image-text"
    image: "/path/to/image.jpg"
    imagePosition: "right"
---
```

### 2. Add Components to Your Page Template

In `src/pages/insights/[slug].astro`:

```astro
---
import Reader from '../../components/reader/Reader.astro';
import ReaderNav from '../../components/reader/ReaderNav.astro';

const { entry } = Astro.props;
const { enableReader, readerSections } = entry.data;
---

{enableReader && readerSections ? (
  <>
    <Reader sections={readerSections} />
    <ReaderNav
      sections={readerSections.map(s => ({ id: s.id, title: s.title }))}
      position="top-left"
      variant="detailed"
      background="glass"
      foreground="light"
    />
  </>
) : (
  <article>{/* Traditional blog layout */}</article>
)}
```

---

## Reader Component

### Props

```typescript
interface ReaderProps {
  sections: ReaderSection[];        // Required: Array of content sections
  heroSection?: ReaderHeroSection;  // Optional: Hero section (tracked)
  endSection?: ReaderEndSection;    // Optional: End section (tracked)
}
```

### Section Configuration

#### ReaderSection Interface

```typescript
interface ReaderSection {
  id: string;                                    // Unique ID (required)
  title: string;                                 // Section title (required)
  body: string;                                  // HTML content (required)
  alignment?: 'left' | 'right' | 'center';       // Text alignment (default: 'center')
  layout?: 'text-only' | 'image-text' | 'full-width-image';  // Layout type
  image?: string;                                // Image path (for image layouts)
  imagePosition?: 'left' | 'right';              // Image position (default: 'right')
}
```

### Layout Types

#### 1. Text-Only
Simple text content with configurable alignment.

```yaml
- id: "introduction"
  title: "Introduction"
  body: "<p>Your content here.</p>"
  layout: "text-only"
  alignment: "center"  # left, right, or center
```

#### 2. Image-Text
Split layout with image on left or right.

```yaml
- id: "with-image"
  title: "With Image"
  body: "<p>Your content here.</p>"
  layout: "image-text"
  image: "/images/photo.jpg"
  imagePosition: "right"  # left or right
```

#### 3. Full-Width Image
Full-screen background image with text overlay.

```yaml
- id: "hero-moment"
  title: "Hero Moment"
  body: "<p>Your content here.</p>"
  layout: "full-width-image"
  image: "/images/background.jpg"
```

### Best Practices

**Content Length:**
- Keep body text to 2-3 sentences (50-100 words max)
- Content must fit within viewport - no scrollbars
- Split longer content into multiple sections

**Images:**
- Use high-quality images (1920x1080 or larger)
- Optimize for web (compress before uploading)
- Ensure good contrast for text overlays

---

## ReaderNav Component

### Props

```typescript
interface ReaderNavProps {
  sections: ReaderNavSection[];  // Array of { id, title }
  position?: string;             // Position on screen
  variant?: string;              // Display variant
  background?: string;           // Background style
  foreground?: string;           // Text/visual colors
}
```

### Position Options (9 combinations)

```
top-left       top-center       top-right
middle-left    middle-center    middle-right
bottom-left    bottom-center    bottom-right
```

**Default:** `top-left` at 25vh from top

### Variant Options

- **`minimal`** - Circle only, no section title or dropdown
- **`detailed`** - Circle + current section + dropdown menu (default)

### Theme Options

#### Background Styles

- **`dark`** - Solid dark background (85% opacity)
- **`light`** - Solid light background (95% opacity)
- **`glass`** - Glassmorphic blur effect (default)

#### Foreground Colors

- **`light`** - Light text/indicators (for dark backgrounds)
- **`dark`** - Dark text/indicators (for light backgrounds)

### Theme Combinations

```astro
<!-- Glass with light text (default) -->
<ReaderNav background="glass" foreground="light" />

<!-- Glass with dark text -->
<ReaderNav background="glass" foreground="dark" />

<!-- Dark solid with light text -->
<ReaderNav background="dark" foreground="light" />

<!-- Light solid with dark text -->
<ReaderNav background="light" foreground="dark" />
```

---

## Examples

### Minimal Navigation (Circle Only)

```astro
<ReaderNav
  sections={sections}
  variant="minimal"
  position="bottom-right"
  background="dark"
  foreground="light"
/>
```

### Detailed Navigation (Top Center)

```astro
<ReaderNav
  sections={sections}
  variant="detailed"
  position="top-center"
  background="glass"
  foreground="dark"
/>
```

### Mixed Layout Example

```yaml
readerSections:
  - id: "intro"
    title: "Introduction"
    body: "<p>Welcome to this story.</p>"
    layout: "text-only"
    alignment: "center"

  - id: "context"
    title: "Context"
    body: "<p>Here's some context with an image.</p>"
    layout: "image-text"
    image: "/images/context.jpg"
    imagePosition: "right"

  - id: "climax"
    title: "The Moment"
    body: "<p>Everything changed here.</p>"
    layout: "full-width-image"
    image: "/images/dramatic.jpg"

  - id: "reflection"
    title: "Reflection"
    body: "<p>Looking back on it all.</p>"
    layout: "text-only"
    alignment: "left"
```

---

## Features

### Animation Behavior

- **Pin on scroll** - Each section pins in place as you scroll
- **Staggered fades** - Previous section fades out (0.3s) before next fades in (0.5s)
- **Smooth scrubbing** - Animations tied to scroll position (scrub: 1.5)
- **No overlap** - Clean transitions between sections

### Progress Tracking

- **Circular indicator** - Shows 0-100% completion
- **Current section display** - Shows active section title
- **Dropdown menu** - Click to navigate to any section
- **7% early activation** - Section becomes active slightly before it fully appears

### Navigation Features

- **Click to navigate** - Click any section in dropdown to scroll to it
- **Smooth scrolling** - Animated scroll to target section
- **No URL hash changes** - Doesn't modify browser URL
- **Glide animation** - Nav glides in horizontally when Reader sections appear

---

## Technical Details

### GSAP Animation

Uses GSAP ScrollTrigger with:
- Timeline-based sequencing
- Pin with anticipation
- Scrub factor of 1.5
- Viewport-based scroll distances

### Events

Reader dispatches custom `reader:progress` events:

```typescript
window.addEventListener('reader:progress', (e) => {
  const { index, id, progress, totalProgress } = e.detail;
  // index: current section index (0-based)
  // id: current section ID
  // progress: 0-1 decimal
  // totalProgress: 0-100 percentage
});
```

### Responsive Design

- **Desktop** - Full layout with all features
- **Tablet (768px)** - Adjusted spacing and sizing
- **Mobile (640px)** - Stacked image-text layouts, smaller nav
- **Small mobile (480px)** - Reduced text sizes

---

## Troubleshooting

### Content Not Fitting in Viewport

**Problem:** Scrollbars appear within sections
**Solution:** Reduce body text to 50-100 words max, or split into multiple sections

### Navigation Not Appearing

**Problem:** Nav doesn't show up
**Solution:** Ensure `readerSections` array is populated and Reader component renders before ReaderNav

### Sections Not Aligning

**Problem:** Click navigation scrolls to wrong position
**Solution:** This is auto-calculated based on section count - ensure all sections have unique IDs

### Animations Choppy

**Problem:** Scroll animations stutter
**Solution:** Reduce image sizes, ensure GSAP is loaded before initialization

### Glide Animation Not Working

**Problem:** Nav doesn't glide in
**Solution:** Ensure Reader wrapper exists in DOM, check that position prop is set correctly

---

## Browser Support

- **Chrome/Edge** - Full support
- **Firefox** - Full support
- **Safari** - Full support
- **Mobile browsers** - Full support with responsive layouts

---

## Performance Tips

1. **Optimize images** - Compress and use appropriate sizes
2. **Limit sections** - 8-12 sections optimal for performance
3. **Preload hero images** - Add `loading="eager"` to first section image
4. **Use design tokens** - Ensures consistent theming and smaller CSS

---

## Advanced Usage

### With Optional Hero/End Sections

```astro
<Reader
  sections={readerSections}
  heroSection={{
    title: "Your Title",
    description: "Subtitle",
    image: "/hero.jpg",
    category: "Category",
    date: "2025-01-15"
  }}
  endSection={{
    html: "<div>Your end content HTML</div>"
  }}
/>
```

**Note:** Hero and end sections are tracked as part of progress (section 0 and last section)

### Multiple Instances

You can have multiple Reader components on the same page, each with their own ReaderNav:

```astro
<Reader sections={sections1} />
<ReaderNav sections={sections1} position="top-left" />

<Reader sections={sections2} />
<ReaderNav sections={sections2} position="top-right" />
```

---

## File Locations

- **Components:** `src/components/reader/Reader.astro`, `src/components/reader/ReaderNav.astro`
- **Types:** `src/types/reader.ts`
- **Schema:** `src/content/config.ts` (insights collection)
- **Example:** `src/content/insights/finding-your-way-back.md`
- **Page Template:** `src/pages/insights/[slug].astro`

---

## Support

For issues or questions:
1. Check this guide first
2. Review example content in `src/content/insights/finding-your-way-back.md`
3. Inspect browser console for GSAP errors
4. Ensure all required props are provided

---

**Last Updated:** 2025-01-15
**Version:** 1.0.0
