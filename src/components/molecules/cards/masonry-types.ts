/**
 * Masonry Card Types
 * Shared interfaces for all masonry card components
 */

export interface BaseCardProps {
  bgColor?: string;
  textColor?: string;
  size?: 'small' | 'medium' | 'large' | 'wide';
  class?: string;
}

export interface BreadcrumbCardProps extends BaseCardProps {
  content: string;
}

export interface IconCardProps extends BaseCardProps {
  title: string;
}

export interface TitleCardProps extends BaseCardProps {
  title: string;
}

export interface SummaryCardProps extends BaseCardProps {
  content: string;
  label?: string;
}

export interface TagCardProps extends BaseCardProps {
  title?: string;
  icon?: string;
}

export interface StatCardProps extends BaseCardProps {
  value: string;
  label?: string;
}

export interface HighlightCardProps extends BaseCardProps {
  content: string;
  icon?: string;
}

export interface QuoteCardProps extends BaseCardProps {
  content: string;
  author?: string;
}

export interface SpecCardProps extends BaseCardProps {
  value: string;
  label?: string;
  icon?: string;
}

export interface TextCardProps extends BaseCardProps {
  title?: string;
  content?: string;
  icon?: string;
  badge?: string;
  link?: string;
  button?: { text: string; link: string };
}

export interface ImageCardProps extends BaseCardProps {
  image: string;
  alt?: string;
  title?: string;
  link?: string;
}

export interface MixedCardProps extends BaseCardProps {
  image?: string;
  alt?: string;
  title?: string;
  content?: string;
  badge?: string;
  link: string;
}

/**
 * Calculate contrasting border color based on background
 * Returns a brand-aware border color for hover states
 */
export function getHoverBorderColor(bgColor?: string): string {
  if (!bgColor) return 'var(--brand-c-text-dark)';

  // Dark backgrounds get a lighter border, light backgrounds get a darker border
  if (bgColor.includes('dark') || bgColor.includes('neutral-dark')) {
    return 'var(--brand-c-primary-light)';
  }
  return 'var(--brand-c-text-dark)';
}
