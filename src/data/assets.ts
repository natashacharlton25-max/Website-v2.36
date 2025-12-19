// Asset data - single source of truth for all assets
// Used by: assets.astro, assets/[slug].astro, projects/[slug].astro

export interface Asset {
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  type: 'worksheet' | 'workbook' | 'guide' | 'toolkit' | 'cards' | 'poster' | 'activity';
  category: string;
  tags: string[];
  features?: string[];
  fileSize?: string;
  pageCount?: number;
  downloadPath?: string;
  professionalGuidePath?: string;
  // Professional information
  professional?: {
    intention?: string;
    guidanceNotes?: string;
    evidenceBasedBenefits?: string[];
  };
}

// Image path helpers - images live in src/images/Assets/{slug}/
// Each asset folder has: 1.png, 2.png, 3.png, 4.png

// All assets - add new assets here
// Images are in src/images/Assets/{slug}/ with 1.png, 2.png, 3.png, 4.png
export const assets: Asset[] = [
  {
    slug: '7-day-starter-kit',
    name: '7-Day Self-Directed Living Starter Kit',
    description: 'A practical, beautifully structured 7-day guide designed to help you regain clarity, strengthen emotional awareness, and make small, powerful shifts in how you live each day.',
    longDescription: `<p>Walking With A Smile's 7-Day Self-Directed Living Starter Kit is a gentle and practical way for people to move away from automatic patterns and towards more intentional choices in everyday life.</p>
<p>The kit breaks change into small, realistic steps that focus on awareness, intention, boundaries, connection, movement, gratitude and reflection. Each element supports stability, clarity and a stronger sense of direction without creating overwhelm.</p>`,
    type: 'toolkit',
    category: '7-Day Kit',
    tags: ['starter', 'daily', 'clarity', 'emotions'],
    features: [
      '7 daily themes: awareness, intention, boundaries, connection, movement, gratitude, reflection',
      'Simple daily actions and reflective prompts',
      'Grounding exercises for emotional steadiness',
      'Takes just a few minutes each day',
    ],
    fileSize: '36 MB',
    pageCount: 28,
    downloadPath: '/7Day/The 7-Day Self-Directed Living Starter Kit .pdf',
    professionalGuidePath: '/7Day/The 7-Day Self-Directed Living Starter Kit  Professional Guide.pdf',
  },
  {
    slug: 'clarity-worksheet',
    name: 'Clarity Worksheet',
    description: 'A practical guide to help you identify what matters most to you',
    type: 'worksheet',
    category: 'PDF Download',
    tags: ['clarity', 'self-reflection', 'values'],
  },
  {
    slug: 'boundaries-guide',
    name: 'Boundaries Guide',
    description: 'Simple strategies for setting and maintaining healthy boundaries',
    type: 'guide',
    category: 'PDF Download',
    tags: ['boundaries', 'relationships', 'self-care'],
  },
  {
    slug: 'self-direction-toolkit',
    name: 'Self-Direction Toolkit',
    description: 'Resources to help you make decisions that align with who you are',
    type: 'toolkit',
    category: 'PDF Download',
    tags: ['decisions', 'autonomy', 'direction'],
  },
  {
    slug: 'values-workbook',
    name: 'Values Discovery Workbook',
    description: 'Comprehensive exercises to help you identify and align with your core values',
    type: 'workbook',
    category: 'PDF Download',
    tags: ['values', 'discovery', 'exercises'],
  },
  {
    slug: 'daily-reflection-worksheet',
    name: 'Daily Reflection Worksheet',
    description: 'A simple daily practice to stay connected with yourself',
    type: 'worksheet',
    category: 'PDF Download',
    tags: ['daily', 'reflection', 'practice'],
  },
  {
    slug: 'communication-guide',
    name: 'Authentic Communication Guide',
    description: 'Learn to express yourself clearly and listen with presence',
    type: 'guide',
    category: 'PDF Download',
    tags: ['communication', 'expression', 'listening'],
  },
  {
    slug: 'goal-setting-workbook',
    name: 'Intentional Goal Setting Workbook',
    description: 'Set goals that actually align with who you want to be',
    type: 'workbook',
    category: 'PDF Download',
    tags: ['goals', 'intention', 'planning'],
  },
  {
    slug: 'energy-audit-worksheet',
    name: 'Energy Audit Worksheet',
    description: 'Identify what drains and what fuels your energy',
    type: 'worksheet',
    category: 'PDF Download',
    tags: ['energy', 'awareness', 'balance'],
  },
  // Project-specific assets (referenced by projects.ts resourceSlugs)
  {
    slug: 'breathing-cards',
    name: 'Breathing Cards',
    description: 'Visual cards with breathing exercises for calm and focus',
    type: 'cards',
    category: 'Printable Cards',
    tags: ['breathing', 'calm', 'mindfulness'],
  },
  {
    slug: 'emotion-wheel',
    name: 'Emotion Wheel',
    description: 'A visual tool to help identify and name emotions',
    type: 'poster',
    category: 'Printable Poster',
    tags: ['emotions', 'awareness', 'vocabulary'],
  },
  {
    slug: 'meditation-guide',
    name: 'Meditation Guide',
    description: 'Simple guided meditations for beginners and beyond',
    type: 'guide',
    category: 'PDF Download',
    tags: ['meditation', 'mindfulness', 'calm'],
  },
  {
    slug: 'reflection-journal',
    name: 'Reflection Journal',
    description: 'Prompts and pages for daily reflection practice',
    type: 'workbook',
    category: 'PDF Download',
    tags: ['reflection', 'journaling', 'awareness'],
  },
  {
    slug: 'sensory-cards',
    name: 'Sensory Cards',
    description: 'Activity cards for sensory exploration and regulation',
    type: 'cards',
    category: 'Printable Cards',
    tags: ['sensory', 'regulation', 'activities'],
  },
  {
    slug: 'movement-breaks',
    name: 'Movement Breaks',
    description: 'Quick movement activities for energy and focus',
    type: 'activity',
    category: 'Activity Guide',
    tags: ['movement', 'energy', 'breaks'],
  },
  {
    slug: 'texture-guide',
    name: 'Texture Guide',
    description: 'Visual guide to different textures for sensory exploration',
    type: 'guide',
    category: 'PDF Download',
    tags: ['texture', 'sensory', 'exploration'],
  },
  {
    slug: 'calm-corner-setup',
    name: 'Calm Corner Setup',
    description: 'Guide to creating a calm space for regulation',
    type: 'guide',
    category: 'PDF Download',
    tags: ['calm', 'space', 'regulation'],
  },
  {
    slug: 'art-prompts',
    name: 'Art Prompts',
    description: 'Creative prompts to inspire artistic expression',
    type: 'cards',
    category: 'Printable Cards',
    tags: ['art', 'creativity', 'expression'],
  },
  {
    slug: 'story-starters',
    name: 'Story Starters',
    description: 'Imaginative prompts to spark storytelling',
    type: 'cards',
    category: 'Printable Cards',
    tags: ['stories', 'imagination', 'creativity'],
  },
  {
    slug: 'music-exploration',
    name: 'Music Exploration',
    description: 'Activities for exploring music and sound',
    type: 'activity',
    category: 'Activity Guide',
    tags: ['music', 'sound', 'exploration'],
  },
  {
    slug: 'expressive-movement',
    name: 'Expressive Movement',
    description: 'Movement activities for creative expression',
    type: 'activity',
    category: 'Activity Guide',
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

// Image path helpers - all images in src/images/Assets/{slug}/
// card.png = 16:10 landscape for cards
// 1-4.png = portrait for gallery

// Returns path for card image (card.png - 16:10 landscape)
export function getAssetCardImage(asset: Asset): string {
  return `/images/Assets/${asset.slug}/card.png`;
}

// Alias for backward compatibility
export function getAssetImagePath(asset: Asset): string {
  return getAssetCardImage(asset);
}

// Returns array of all 4 gallery image paths (portrait)
export function getAssetGalleryImages(asset: Asset): string[] {
  return [
    `/images/Assets/${asset.slug}/1.png`,
    `/images/Assets/${asset.slug}/2.png`,
    `/images/Assets/${asset.slug}/3.png`,
    `/images/Assets/${asset.slug}/4.png`,
  ];
}

// Alias for backward compatibility
export function getAssetImages(asset: Asset): string[] {
  return getAssetGalleryImages(asset);
}

// For convenience - get paths by slug directly
export function getAssetCardImageBySlug(slug: string): string {
  return `/images/Assets/${slug}/card.png`;
}

export function getAssetGalleryImagesBySlug(slug: string): string[] {
  return [
    `/images/Assets/${slug}/1.png`,
    `/images/Assets/${slug}/2.png`,
    `/images/Assets/${slug}/3.png`,
    `/images/Assets/${slug}/4.png`,
  ];
}
