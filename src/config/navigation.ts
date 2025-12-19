/**
 * Navigation Configuration
 * Centralized navigation structure used across navbar, mobile menu, and menu page
 */

export interface NavLink {
  text: string;
  href: string;
  color?: string;
}

export interface MenuSection {
  label: string;
  links: NavLink[];
}

/**
 * Main navigation links (shown in navbar and mobile menu)
 */
export const MAIN_NAV_LINKS: NavLink[] = [
  { text: 'Home', href: '/', color: '#ff428b' },
  { text: 'About', href: '/about', color: '#23a5c2' },
  { text: 'Projects', href: '/projects', color: '#84dcc6' },
  { text: 'Assets', href: '/assets', color: '#ff428b' },
  { text: 'Insights', href: '/insights', color: '#23a5c2' },
  { text: 'Services', href: '/services', color: '#84dcc6' },
  { text: 'Contact', href: '/contact', color: '#ff428b' },
];

/**
 * Menu page sections (for tiny screens and full menu page)
 * Includes main nav links plus additional organized sections
 */
export const MENU_SECTIONS: MenuSection[] = [
  {
    label: 'Main',
    links: MAIN_NAV_LINKS,
  },
  {
    label: 'Legal',
    links: [
      { text: 'Privacy Policy', href: '/legal/privacy' },
      { text: 'Terms of Service', href: '/legal/terms' },
      { text: 'Cookie Policy', href: '/legal/cookies' },
    ],
  },
];

/**
 * Quick action buttons (shown at bottom of menu page)
 */
export const MENU_ACTIONS: NavLink[] = [
  { text: 'Get In Touch', href: '/contact' },
  { text: 'Browse Products', href: '/assets' },
];
