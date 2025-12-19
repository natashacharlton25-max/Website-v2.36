// Navigation items now imported from centralized site configuration
// This ensures consistency across the entire site
import { siteConfig } from '../../../site.config';

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export const links: NavLink[] = siteConfig.content.navigation.items;