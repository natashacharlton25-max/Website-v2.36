// Barrel export for presentation section components
// Updated paths after atomic design restructure

// Molecule sections (simple content blocks)
export { default as TextSection } from '../../molecules/sections/TextSection.astro';
export { default as QuoteSection } from '../../molecules/sections/QuoteSection.astro';
export { default as CalloutSection } from '../../molecules/sections/CalloutSection.astro';

// Organism sections (complex composed sections)
export { default as EndSection } from '../../organisms/sections/EndSection.astro';
export { default as HeroSection } from '../../organisms/sections/HeroSection/HeroSection.astro';
export { default as ImageTextSection } from '../../organisms/sections/PresentationImageTextSection.astro';
export { default as FullWidthSection } from '../../organisms/sections/FullWidthSection.astro';
export { default as StatsSection } from '../../organisms/sections/StatsSection.astro';
export { default as GallerySection } from '../../organisms/sections/GallerySection.astro';
export { default as CompareSection } from '../../organisms/sections/CompareSection.astro';

// Re-export types
export type { Props as TextProps } from '../../molecules/sections/TextSection.astro';
export type { Props as QuoteProps } from '../../molecules/sections/QuoteSection.astro';
export type { Props as CalloutProps } from '../../molecules/sections/CalloutSection.astro';
export type { Props as EndProps } from '../../organisms/sections/EndSection.astro';
export type { Props as HeroProps } from '../../organisms/sections/HeroSection/HeroSection.astro';
export type { Props as ImageTextProps } from '../../organisms/sections/PresentationImageTextSection.astro';
export type { Props as FullWidthProps } from '../../organisms/sections/FullWidthSection.astro';
export type { Props as StatsProps, Stat } from '../../organisms/sections/StatsSection.astro';
export type { Props as GalleryProps, GalleryImage } from '../../organisms/sections/GallerySection.astro';
export type { Props as CompareProps, CompareSide } from '../../organisms/sections/CompareSection.astro';
