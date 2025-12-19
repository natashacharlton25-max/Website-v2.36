/**
 * Navigation Configuration
 * Centralized navigation structure for navbar, mobile menu, and mega menus
 */

export interface NavLink {
  text: string;
  href: string;
}

export interface MegaMenuItem {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

/**
 * Main navigation links (shown in navbar and mobile menu)
 */
export const MAIN_NAV_LINKS: NavLink[] = [
  { text: 'Home', href: '/' },
  { text: 'About', href: '/about' },
  { text: 'Projects', href: '/projects' },
  { text: 'Assets', href: '/assets' },
  { text: 'Insights', href: '/insights' },
  { text: 'Services', href: '/services' },
  { text: 'Contact', href: '/contact' },
];

/**
 * Which nav items have expandable mega menus
 */
export const NAV_ITEMS_WITH_MENUS = ['Assets', 'Insights', 'Services'];

/**
 * Mega menu content for expandable nav items
 */
export const MEGA_MENUS: Record<string, MegaMenuItem[]> = {
  assets: [
    { title: 'All Assets', description: 'Browse our complete collection of resources', href: '/assets' },
    { title: 'Worksheets', description: 'Interactive worksheets for personal growth', href: '/assets?filter=worksheet' },
    { title: 'Workbooks', description: 'Comprehensive workbooks for deeper learning', href: '/assets?filter=workbook' },
    { title: 'Guides', description: 'Step-by-step guides for your journey', href: '/assets?filter=guide' },
    { title: 'Toolkits', description: 'Complete toolkits with multiple resources', href: '/assets?filter=toolkit' },
  ],
  insights: [
    { title: 'All Insights', description: 'Browse all articles and blog posts', href: '/insights' },
    { title: 'Latest Articles', description: 'Read our most recent publications', href: '/insights' },
    { title: 'Featured Stories', description: 'Inspiring stories from our community', href: '/insights' },
  ],
  services: [
    { title: 'All Services', description: 'Explore our full range of services', href: '/services' },
    { title: 'Workshops', description: 'Join our interactive group sessions', href: '/services#workshops' },
    { title: 'Consultations', description: 'One-on-one personalized support', href: '/services#consultations' },
  ],
  settings: [
    { title: 'Contact', description: '', href: '/contact', icon: 'mail' },
    { title: 'Share', description: '', href: '#share', icon: 'share' },
    { title: 'Search', description: '', href: '#search', icon: 'search' },
    { title: 'Accessibility', description: '', href: '#accessibility', icon: 'eye' },
  ],
};
