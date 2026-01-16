// TypeScript interfaces for Reader component system

// Stats item for stats layout
export interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

// Gallery image for gallery layout
export interface GalleryImageItem {
  src: string;
  alt: string;
  caption?: string;
}

// Compare side for compare layout
export interface CompareSideItem {
  label?: string;
  title: string;
  content: string;
}

export interface ReaderSection {
  id: string; // Unique identifier for URL hash anchors and navigation
  title: string; // Section title
  body?: string; // HTML string content (required for text-only, image-text, full-width-image)
  textAlign?: 'left' | 'right' | 'center'; // Text alignment within content block (default: 'center')
  position?: 'left' | 'right' | 'center'; // Content block position: center (default), left/right (soft offset)
  alignment?: 'left' | 'right' | 'center'; // DEPRECATED: Use textAlign instead. Kept for backwards compatibility.
  layout?: 'text-only' | 'image-text' | 'full-width-image' | 'quote' | 'stats' | 'gallery' | 'callout' | 'compare'; // Layout type (default: 'text-only')
  image?: string; // Image path (required for image-text and full-width-image layouts)
  imagePosition?: 'left' | 'right'; // Image position for image-text layout (default: 'right')

  // Quote layout props
  quote?: string; // Quote text (required for quote layout)
  author?: string; // Quote attribution author
  role?: string; // Quote attribution role
  variant?: 'default' | 'accent' | 'minimal'; // Quote visual variant

  // Stats layout props
  stats?: StatItem[]; // Array of stats (required for stats layout)
  statsLayout?: 'row' | '2' | '3' | '4'; // Stats grid layout

  // Gallery layout props
  images?: GalleryImageItem[]; // Array of images (required for gallery layout)
  columns?: 2 | 3 | 4; // Gallery columns

  // Callout layout props
  calloutType?: 'info' | 'tip' | 'warning'; // Callout type
  content?: string; // Callout content (required for callout layout)

  // Compare layout props
  left?: CompareSideItem; // Left side content (required for compare layout)
  right?: CompareSideItem; // Right side content (required for compare layout)
  divider?: boolean; // Show divider between sides
}

export interface ReaderHeroAction {
  label: string;
  href: string;
}

export interface ReaderHeroSection {
  title: string; // Hero title
  description?: string; // Hero description/subtitle
  category?: string; // Category badge
  date?: string; // Publish date
  readingTime?: number; // Estimated reading time in minutes
  image?: string; // Optional background image URL
  overlayOpacity?: number; // Overlay opacity (0-1, default: 0.6)
  primaryAction?: ReaderHeroAction; // Primary CTA button
  secondaryAction?: ReaderHeroAction; // Secondary CTA button
}

// Author data for end section
export interface ReaderAuthor {
  name: string;
  photo: any; // ImageMetadata from Astro
  role?: string;
  bio: string;
}

// Linked asset for end section
export interface ReaderLinkedAsset {
  title: string;
  description?: string;
  url: string;
  type?: string;
}

// Recommended item for end section
export interface ReaderRecommendedItem {
  slug: string;
  title: string;
  category: string;
  image: any; // ImageMetadata from Astro
}

export interface ReaderEndSection {
  author?: ReaderAuthor;
  linkedAssets?: ReaderLinkedAsset[];
  recommendedItems?: ReaderRecommendedItem[];
  recommendedBasePath?: string;
  customHtml?: string;
}

export interface ReaderProps {
  sections: ReaderSection[];
  heroSection?: ReaderHeroSection; // Optional hero section before Reader sections
  endSection?: ReaderEndSection; // Optional end section after Reader sections
}

export interface ReaderNavSection {
  id: string;
  title: string;
}

export interface ReaderNavProps {
  sections: ReaderNavSection[];
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'middle-left'
    | 'middle-center'
    | 'middle-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  variant?: 'minimal' | 'detailed'; // minimal: circle only, detailed: circle + dropdown
  background?: 'dark' | 'light' | 'glass'; // Background style: dark solid, light solid, or glassmorphic
  foreground?: 'light' | 'dark'; // Text and visual colors: light (for dark backgrounds), dark (for light backgrounds)
}

export interface ReaderProgressEvent {
  index: number; // Current section index
  id: string; // Current section ID
  progress: number; // Scroll progress (0-1)
  totalProgress: number; // Scroll progress as percentage (0-100)
}
