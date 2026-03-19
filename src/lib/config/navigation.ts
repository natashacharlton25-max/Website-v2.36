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
  image?: string;
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
  { text: 'Atom Tests', href: '/test/heading-test' },
];

/**
 * Which nav items have expandable mega menus
 */
export const NAV_ITEMS_WITH_MENUS = ['Assets', 'Insights', 'Services', 'Atom Tests'];

/**
 * Mega menu content for expandable nav items
 */
export const MEGA_MENUS: Record<string, MegaMenuItem[]> = {
  assets: [
    { title: 'All Assets', description: 'Browse our complete collection of resources', href: '/assets', image: '/_Unused Images/Asset-Main-1.png' },
    { title: 'Worksheets', description: 'Interactive worksheets for personal growth', href: '/assets?filter=worksheet', image: '/_Unused Images/Asset-Main-2.png' },
    { title: 'Workbooks', description: 'Comprehensive workbooks for deeper learning', href: '/assets?filter=workbook', image: '/_Unused Images/Asset-Main-3.png' },
    { title: 'Guides', description: 'Step-by-step guides for your journey', href: '/assets?filter=guide', image: '/_Unused Images/Asset-Main-4.png' },
    { title: 'Toolkits', description: 'Complete toolkits with multiple resources', href: '/assets?filter=toolkit', image: '/_Unused Images/Asset-Main-1 (2).png' },
  ],
  insights: [
    { title: 'All Insights', description: 'Browse all articles and blog posts', href: '/insights', image: '/_Unused Images/Articles hero Image.png' },
    { title: 'Latest Articles', description: 'Read our most recent publications', href: '/insights', image: '/_Unused Images/Article Hero Card.png' },
    { title: 'Featured Stories', description: 'Inspiring stories from our community', href: '/insights', image: '/_Unused Images/3.jpg' },
  ],
  services: [
    { title: 'All Services', description: 'Explore our full range of services', href: '/services', image: '/_Unused Images/1.png' },
    { title: 'Workshops', description: 'Join our interactive group sessions', href: '/services#workshops', image: '/_Unused Images/6.png' },
    { title: 'Consultations', description: 'One-on-one personalized support', href: '/services#consultations', image: '/_Unused Images/contact us 1.jpg' },
  ],
  'atom tests': [
    { title: 'Heading', description: 'Levels, sizes, weights, colours, variants, media, AAC', href: '/test/heading-test' },
    { title: 'Badge', description: 'Variants, sizes, shapes, icons, colours, semantic roles', href: '/test/badge-test' },
    { title: 'Button', description: 'Variants, shapes, effects, confetti, dropdowns', href: '/test/button-test' },
    { title: 'Image', description: 'Alt text, AAC, enlarge modal, visual treatments, semantic roles', href: '/test/image-test' },
    { title: 'Tooltip', description: 'Positions, themes, sizes, animations, purpose modes, rich content', href: '/test/tooltip-test' },
    { title: 'TextEffect', description: 'Image fill, gradient animation, shadows, strokes, inner shadow', href: '/test/text-effect-test' },
  ],
  settings: [
    { title: 'Contact', description: '', href: '/contact', icon: 'mail' },
    { title: 'Share', description: '', href: '#share', icon: 'share' },
    { title: 'Search', description: '', href: '#search', icon: 'search' },
    { title: 'Accessibility', description: '', href: '#accessibility', icon: 'eye' },
  ],
};
