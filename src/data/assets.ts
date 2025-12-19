// Asset data - single source of truth for all assets
// Used by: assets.astro, assets/[slug].astro, projects/[slug].astro

export interface Asset {
  slug: string;
  name: string;
  description: string;
  type: 'worksheet' | 'workbook' | 'guide' | 'toolkit' | 'cards' | 'poster' | 'activity';
  category: string;
  image: string; // Path relative to src/images/Assets/
  tags: string[];
  // Professional information
  professional?: {
    intention?: string;
    guidanceNotes?: string;
    evidenceBasedBenefits?: string[];
  };
}

// All assets - add new assets here
export const assets: Asset[] = [
  {
    slug: 'clarity-worksheet',
    name: 'Clarity Worksheet',
    description: 'A practical guide to help you identify what matters most to you',
    type: 'worksheet',
    category: 'PDF Download',
    image: 'clarity-worksheet.png',
    tags: ['clarity', 'self-reflection', 'values'],
  },
  {
    slug: 'boundaries-guide',
    name: 'Boundaries Guide',
    description: 'Simple strategies for setting and maintaining healthy boundaries',
    type: 'guide',
    category: 'PDF Download',
    image: 'boundaries-guide.png',
    tags: ['boundaries', 'relationships', 'self-care'],
  },
  {
    slug: 'self-direction-toolkit',
    name: 'Self-Direction Toolkit',
    description: 'Resources to help you make decisions that align with who you are',
    type: 'toolkit',
    category: 'PDF Download',
    image: 'self-direction-toolkit.png',
    tags: ['decisions', 'autonomy', 'direction'],
  },
  {
    slug: '7-day-starter-kit',
    name: '7-Day Self-Directed Living Starter Kit',
    description: 'A practical, beautifully structured 7-day guide designed to help you regain clarity, strengthen emotional awareness, and make small, powerful shifts in how you live each day.',
    type: 'toolkit',
    category: 'PDF Download',
    image: '7-day-starter-kit.png',
    tags: ['starter', 'daily', 'clarity', 'emotions'],
  },
  {
    slug: 'values-workbook',
    name: 'Values Discovery Workbook',
    description: 'Comprehensive exercises to help you identify and align with your core values',
    type: 'workbook',
    category: 'PDF Download',
    image: 'values-workbook.png',
    tags: ['values', 'discovery', 'exercises'],
  },
  {
    slug: 'daily-reflection-worksheet',
    name: 'Daily Reflection Worksheet',
    description: 'A simple daily practice to stay connected with yourself',
    type: 'worksheet',
    category: 'PDF Download',
    image: 'daily-reflection-worksheet.png',
    tags: ['daily', 'reflection', 'practice'],
  },
  {
    slug: 'communication-guide',
    name: 'Authentic Communication Guide',
    description: 'Learn to express yourself clearly and listen with presence',
    type: 'guide',
    category: 'PDF Download',
    image: 'communication-guide.png',
    tags: ['communication', 'expression', 'listening'],
  },
  {
    slug: 'goal-setting-workbook',
    name: 'Intentional Goal Setting Workbook',
    description: 'Set goals that actually align with who you want to be',
    type: 'workbook',
    category: 'PDF Download',
    image: 'goal-setting-workbook.png',
    tags: ['goals', 'intention', 'planning'],
  },
  {
    slug: 'energy-audit-worksheet',
    name: 'Energy Audit Worksheet',
    description: 'Identify what drains and what fuels your energy',
    type: 'worksheet',
    category: 'PDF Download',
    image: 'energy-audit-worksheet.png',
    tags: ['energy', 'awareness', 'balance'],
  },
  // Project-specific assets (referenced by projects.ts resourceSlugs)
  {
    slug: 'breathing-cards',
    name: 'Breathing Cards',
    description: 'Visual cards with breathing exercises for calm and focus',
    type: 'cards',
    category: 'Printable Cards',
    image: 'breathing-cards.png',
    tags: ['breathing', 'calm', 'mindfulness'],
  },
  {
    slug: 'emotion-wheel',
    name: 'Emotion Wheel',
    description: 'A visual tool to help identify and name emotions',
    type: 'poster',
    category: 'Printable Poster',
    image: 'emotion-wheel.png',
    tags: ['emotions', 'awareness', 'vocabulary'],
  },
  {
    slug: 'meditation-guide',
    name: 'Meditation Guide',
    description: 'Simple guided meditations for beginners and beyond',
    type: 'guide',
    category: 'PDF Download',
    image: 'meditation-guide.png',
    tags: ['meditation', 'mindfulness', 'calm'],
  },
  {
    slug: 'reflection-journal',
    name: 'Reflection Journal',
    description: 'Prompts and pages for daily reflection practice',
    type: 'workbook',
    category: 'PDF Download',
    image: 'reflection-journal.png',
    tags: ['reflection', 'journaling', 'awareness'],
  },
  {
    slug: 'sensory-cards',
    name: 'Sensory Cards',
    description: 'Activity cards for sensory exploration and regulation',
    type: 'cards',
    category: 'Printable Cards',
    image: 'sensory-cards.png',
    tags: ['sensory', 'regulation', 'activities'],
  },
  {
    slug: 'movement-breaks',
    name: 'Movement Breaks',
    description: 'Quick movement activities for energy and focus',
    type: 'activity',
    category: 'Activity Guide',
    image: 'movement-breaks.png',
    tags: ['movement', 'energy', 'breaks'],
  },
  {
    slug: 'texture-guide',
    name: 'Texture Guide',
    description: 'Visual guide to different textures for sensory exploration',
    type: 'guide',
    category: 'PDF Download',
    image: 'texture-guide.png',
    tags: ['texture', 'sensory', 'exploration'],
  },
  {
    slug: 'calm-corner-setup',
    name: 'Calm Corner Setup',
    description: 'Guide to creating a calm space for regulation',
    type: 'guide',
    category: 'PDF Download',
    image: 'calm-corner-setup.png',
    tags: ['calm', 'space', 'regulation'],
  },
  {
    slug: 'art-prompts',
    name: 'Art Prompts',
    description: 'Creative prompts to inspire artistic expression',
    type: 'cards',
    category: 'Printable Cards',
    image: 'art-prompts.png',
    tags: ['art', 'creativity', 'expression'],
  },
  {
    slug: 'story-starters',
    name: 'Story Starters',
    description: 'Imaginative prompts to spark storytelling',
    type: 'cards',
    category: 'Printable Cards',
    image: 'story-starters.png',
    tags: ['stories', 'imagination', 'creativity'],
  },
  {
    slug: 'music-exploration',
    name: 'Music Exploration',
    description: 'Activities for exploring music and sound',
    type: 'activity',
    category: 'Activity Guide',
    image: 'music-exploration.png',
    tags: ['music', 'sound', 'exploration'],
  },
  {
    slug: 'expressive-movement',
    name: 'Expressive Movement',
    description: 'Movement activities for creative expression',
    type: 'activity',
    category: 'Activity Guide',
    image: 'expressive-movement.png',
    tags: ['movement', 'expression', 'creativity'],
  },
];

// Helper functions
export function getAssetBySlug(slug: string): Asset | undefined {
  return assets.find(a => a.slug === slug);
}

export function getAssetsBySlug(slugs: string[]): Asset[] {
  return slugs.map(slug => getAssetBySlug(slug)).filter((a): a is Asset => a !== undefined);
}

export function getAllAssetSlugs(): string[] {
  return assets.map(a => a.slug);
}

export function getAssetsByType(type: Asset['type']): Asset[] {
  return assets.filter(a => a.type === type);
}

// Get image path for an asset (for use in templates)
export function getAssetImagePath(asset: Asset): string {
  return `/images/Assets/${asset.image}`;
}
