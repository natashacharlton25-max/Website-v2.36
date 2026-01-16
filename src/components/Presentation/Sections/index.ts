// Barrel export for presentation section components

// Required sections (always included)
export { default as TitleSection } from './TitleSection.astro';
export { default as EndSection } from './EndSection.astro';

// Core layout components
export { default as TextSection } from './TextSection.astro';
export { default as HeroSection } from './HeroSection.astro';
export { default as ImageTextSection } from './ImageTextSection.astro';
export { default as FullWidthSection } from './FullWidthSection.astro';

// Specialized content components
export { default as QuoteSection } from './QuoteSection.astro';
export { default as StatsSection } from './StatsSection.astro';
export { default as GallerySection } from './GallerySection.astro';
export { default as CalloutSection } from './CalloutSection.astro';
export { default as CompareSection } from './CompareSection.astro';

// Re-export types
export type { Props as TitleProps } from './TitleSection.astro';
export type { Props as EndProps } from './EndSection.astro';
export type { Props as TextProps } from './TextSection.astro';
export type { Props as HeroProps } from './HeroSection.astro';
export type { Props as ImageTextProps } from './ImageTextSection.astro';
export type { Props as FullWidthProps } from './FullWidthSection.astro';
export type { Props as QuoteProps } from './QuoteSection.astro';
export type { Props as StatsProps, Stat } from './StatsSection.astro';
export type { Props as GalleryProps, GalleryImage } from './GallerySection.astro';
export type { Props as CalloutProps } from './CalloutSection.astro';
export type { Props as CompareProps, CompareSide } from './CompareSection.astro';
