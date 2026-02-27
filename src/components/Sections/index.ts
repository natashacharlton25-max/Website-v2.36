// Unified barrel export for ALL site sections
// Combines molecule-level sections and organism-level sections

// ===== MOLECULE SECTIONS (simple content blocks) =====
export { default as TextSection } from '../molecules/sections/TextSection.astro';
export { default as QuoteSection } from '../molecules/sections/QuoteSection.astro';
export { default as CalloutSection } from '../molecules/sections/CalloutSection.astro';

// ===== ORGANISM SECTIONS (complex composed sections) =====
// Site-wide sections
export { default as CTASection } from '../organisms/sections/CTASection.astro';
export { default as HeroMorphAnimation } from '../organisms/sections/HeroMorphAnimation.astro';
export { default as HeroSection } from '../organisms/sections/HeroSection/HeroSection.astro';
export { default as ImageTextSection } from '../organisms/sections/ImageTextSection.astro';

export { default as PhilosophyFlipCardsSection } from '../organisms/sections/PhilosophyFlipCardsSection.astro';
export { default as PillarsSection } from '../organisms/sections/PillarsSection.astro';
export { default as ServiceDetails } from '../organisms/sections/ServiceDetails.astro';
export { default as ShareSection } from '../organisms/sections/ShareSection.astro';
export { default as StorySection } from '../organisms/sections/StorySection.astro';
export { default as ValuesSection } from '../organisms/sections/ValuesSection.astro';
export { default as WhoSliderSection } from '../organisms/sections/WhoSliderSection.astro';

// Presentation sections (also site-wide reusable)
export { default as FullWidthSection } from '../organisms/sections/FullWidthSection.astro';
export { default as StatsSection } from '../organisms/sections/StatsSection.astro';
export { default as GallerySection } from '../organisms/sections/GallerySection.astro';
export { default as CompareSection } from '../organisms/sections/CompareSection.astro';
export { default as EndSection } from '../organisms/sections/EndSection.astro';

export { default as PresentationImageTextSection } from '../organisms/sections/PresentationImageTextSection.astro';

// ===== TYPE EXPORTS =====
// Molecule section types

export type { Props as TextProps } from '../molecules/sections/TextSection.astro';
export type { Props as QuoteProps } from '../molecules/sections/QuoteSection.astro';
export type { Props as CalloutProps } from '../molecules/sections/CalloutSection.astro';

// Organism section types
export type { Props as CTAProps } from '../organisms/sections/CTASection.astro';
export type { Props as HeroMorphProps } from '../organisms/sections/HeroMorphAnimation.astro';
export type { Props as HeroProps } from '../organisms/sections/HeroSection/HeroSection.astro';
export type { Props as ImageTextProps } from '../organisms/sections/ImageTextSection.astro';

export type { Props as PhilosophyFlipCardsProps } from '../organisms/sections/PhilosophyFlipCardsSection.astro';
export type { Props as PillarsProps } from '../organisms/sections/PillarsSection.astro';
export type { Props as ServiceDetailsProps } from '../organisms/sections/ServiceDetails.astro';
export type { Props as ShareProps } from '../organisms/sections/ShareSection.astro';
export type { Props as StoryProps } from '../organisms/sections/StorySection.astro';
export type { Props as ValuesProps } from '../organisms/sections/ValuesSection.astro';
export type { Props as WhoSliderProps } from '../organisms/sections/WhoSliderSection.astro';
export type { Props as FullWidthProps } from '../organisms/sections/FullWidthSection.astro';
export type { Props as StatsProps } from '../organisms/sections/StatsSection.astro';
export type { Props as GalleryProps } from '../organisms/sections/GallerySection.astro';
export type { Props as CompareProps } from '../organisms/sections/CompareSection.astro';
export type { Props as EndProps } from '../organisms/sections/EndSection.astro';

export type { Props as PresentationImageTextProps } from '../organisms/sections/PresentationImageTextSection.astro';
