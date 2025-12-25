// TypeScript interfaces for Reader component system

export interface ReaderSection {
  id: string; // Unique identifier for URL hash anchors and navigation
  title: string; // Section title
  body: string; // HTML string content (2-3 sentences, 50-100 words max)
  alignment?: 'left' | 'right' | 'center'; // Text alignment (default: 'center')
  layout?: 'text-only' | 'image-text' | 'full-width-image'; // Layout type (default: 'text-only')
  image?: string; // Image path (required for image-text and full-width-image layouts)
  imagePosition?: 'left' | 'right'; // Image position for image-text layout (default: 'right')
}

export interface ReaderHeroSection {
  title: string; // Hero title
  description?: string; // Hero description/subtitle
  image?: string; // Hero background image
  category?: string; // Category badge
  date?: string; // Publish date
}

export interface ReaderEndSection {
  html: string; // Raw HTML content for end section (author bio, footer, etc.)
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
