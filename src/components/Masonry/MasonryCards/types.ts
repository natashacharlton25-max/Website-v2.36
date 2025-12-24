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
 * Cards with dark backgrounds (700-800) use 500 token
 * Others use darkest shade (800) from same color family
 */
export function getHoverBorderColor(bgColor?: string): string {
  if (!bgColor) return 'var(--color-Text-950)';

  const match = bgColor.match(/var\(--color-(\w+)-(\d+)\)/);
  if (!match) return 'var(--color-Text-950)';

  const [, colorName, shadeStr] = match;
  const shade = parseInt(shadeStr, 10);

  if (shade >= 700) {
    return `var(--color-${colorName}-500)`;
  }
  return `var(--color-${colorName}-800)`;
}
