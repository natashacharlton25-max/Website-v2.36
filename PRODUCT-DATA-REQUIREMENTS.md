# Product Data Requirements

This document outlines the data structure and image requirements for product pages and product cards in the Walking With A Smile website.

---

## Product Page Data Structure

Each product in the `productData` object requires the following fields:

### Required Fields

```typescript
{
  id: string                    // Unique identifier (e.g., '1', '2', '3')
  name: string                  // Product name (e.g., '7-Day Self-Directed Living Starter Kit')
  slug: string                  // URL slug (e.g., 'product-1', '7-day-kit')
  category: string              // Product category (e.g., '7-Day Kit', 'Guide', 'Toolkit')
  type: string                  // Product type for badge styling (e.g., 'kit', 'guide', 'toolkit')
  sku: string                   // Stock keeping unit (e.g., '7DAY-001', 'BOUND-001')
  description: string           // Short description shown above "Add to Cart" button (1-2 sentences)
  longDescription: string       // Full HTML description for Description tab (multiple paragraphs)
  features: string[]            // Array of feature strings (not currently displayed, optional)
  fileSize: string              // File size display (e.g., '36 MB', '12 MB')
  pageCount: number             // Number of pages (e.g., 28, 15, 22)
  downloadPath: string          // Path to main PDF file
  professionalGuidePath: string | undefined  // Path to professional guide PDF (use undefined if not available)
  image: string                 // Main product image path
  images: string[]              // Array of gallery image paths (thumbnails)
}
```

### Field Usage

- **id**: Used for cart functionality and unique identification
- **name**: Displayed as page title (H1) and in breadcrumbs
- **slug**: Used in URL structure (`/assets/[slug]`)
- **category**: Displayed as badge on image and in product header
- **type**: Used for CSS class styling (badge-kit, badge-guide, badge-toolkit)
- **sku**: Displayed below product title
- **description**: Shows in the product details area above the "Add to Cart" button
- **longDescription**: Main content in the Description tab (supports HTML with `<p>` tags)
- **features**: Legacy field, no longer displayed in current template
- **fileSize**: Displayed in product info row with database icon
- **pageCount**: Displayed in product info row with pages icon
- **downloadPath**: Used for main product download link
- **professionalGuidePath**: If defined, shows "Add Notes" button for professional guide
- **image**: Main product image shown in gallery
- **images**: Thumbnail gallery images (first image is active by default)

---

## Product Card Data Structure

Product cards (used in related products, asset listings, etc.) use a subset of the full product data:

### Required Fields for Cards

```typescript
{
  slug: string          // For linking to product page
  name: string          // Product title
  category: string      // Product category badge
  type: string          // For badge styling
  description: string   // Short description text
  image: string         // Card thumbnail image
}
```

### Card Display

- Cards show: image, category badge, name, description, and "Free" price
- Clicking card navigates to `/assets/[slug]`
- "View Details →" link appears on hover

---

## Image Size Requirements

### Product Page Images

#### Main Product Image (`image`)
- **Recommended size**: 800px × 1000px
- **Aspect ratio**: 4:5 (portrait)
- **Format**: PNG or JPG
- **Usage**: Main product gallery image, cart preview
- **Notes**: Should show product clearly with good contrast

#### Gallery Thumbnails (`images` array)
- **Recommended size**: 800px × 1000px (same as main)
- **Aspect ratio**: 4:5 (portrait)
- **Format**: PNG or JPG
- **Usage**: Thumbnail gallery below main image
- **Notes**:
  - First image in array is shown by default
  - All images should maintain consistent dimensions
  - Thumbnails are automatically scaled down in UI
  - Recommended 3-5 images per product

### Product Card Images

#### Card Thumbnail (`image`)
- **Recommended size**: 600px × 750px (minimum)
- **Aspect ratio**: 4:5 (portrait)
- **Format**: PNG or JPG
- **Usage**: Card grid listings, related products
- **Notes**:
  - Should be clear and recognizable at smaller sizes
  - Can be same image as main product image
  - Will be displayed at responsive sizes

---

## Example Product Data

### Complete Example (Product with Professional Guide)

```typescript
'7-day-kit': {
  id: '1',
  name: '7-Day Self-Directed Living Starter Kit',
  slug: '7-day-kit',
  category: '7-Day Kit',
  type: 'kit',
  sku: '7DAY-001',
  description: 'A clear and structured seven-day guide designed to help you regain steadiness, rebuild awareness and make small but meaningful shifts in how you move through your day.',
  longDescription: `
    <p>Walking With A Smile's 7-Day Self-Directed Living Starter Kit is a gentle and practical way for people to move away from automatic patterns and towards more intentional choices in everyday life.</p>
    <p>It is built around short, meaningful actions that fit easily into a busy routine. Each day introduces a simple theme, clear guidance and a grounding moment.</p>
  `,
  features: [],
  fileSize: '36 MB',
  pageCount: 28,
  downloadPath: '/7Day/The 7-Day Self-Directed Living Starter Kit.pdf',
  professionalGuidePath: '/7Day/The 7-Day Self-Directed Living Starter Kit Professional Guide.pdf',
  image: '/7Day/7Day Product Images/1.png',
  images: [
    '/7Day/7Day Product Images/1.png',
    '/7Day/7Day Product Images/2.png',
    '/7Day/7Day Product Images/5.png',
    '/7Day/7Day Product Images/8.png',
  ]
}
```

### Simple Example (Product without Professional Guide)

```typescript
'boundaries-guide': {
  id: '2',
  name: 'Boundaries Guide',
  slug: 'boundaries-guide',
  category: 'Guide',
  type: 'guide',
  sku: 'BOUND-001',
  description: 'Simple strategies for setting and maintaining healthy boundaries',
  longDescription: `
    <p>Setting boundaries doesn't mean being harsh or distant. This guide helps you understand where your limits are and how to communicate them authentically.</p>
  `,
  features: [],
  fileSize: '12 MB',
  pageCount: 15,
  downloadPath: '/guides/boundaries-guide.pdf',
  professionalGuidePath: undefined,
  image: '/images/boundaries-guide.jpg',
  images: [
    '/images/boundaries-guide.jpg',
    '/images/boundaries-guide-2.jpg',
    '/images/boundaries-guide-3.jpg',
  ]
}
```

---

## Image Preparation Checklist

### Before Adding Product Images

- [ ] Images are 800px × 1000px (4:5 ratio) for product pages
- [ ] Images are PNG or JPG format
- [ ] Images are optimized for web (compressed but good quality)
- [ ] All gallery images have consistent dimensions
- [ ] Images are stored in appropriate `/public` subdirectory
- [ ] Image paths in product data are relative to `/public` (e.g., `/7Day/image.png`)
- [ ] Main image clearly shows the product/document cover
- [ ] Gallery images show different pages or aspects of the product

### Recommended Image Content

1. **Image 1 (Main)**: Product cover or title page
2. **Image 2**: Inside page showing layout/design
3. **Image 3**: Sample page with content
4. **Image 4**: Another distinctive page or feature
5. **Image 5** (optional): Back cover or summary page

---

## Where to Add Product Data

Product data is defined in: `src/pages/assets/[slug].astro`

Location in file: Lines 19-114 (approximately)

```typescript
const productData = {
  'product-1': { /* product data */ },
  'product-2': { /* product data */ },
  'product-3': { /* product data */ },
  // Add new products here
};
```

## Notes

- All products show as "Free" with email required for download
- Professional guide button only appears if `professionalGuidePath` is defined
- The template handles all styling, tabs, and layouts automatically
- Custom content for "For Individuals" tab is part of the template, not product data
- Specifications masonry grid is part of the template, not product data
