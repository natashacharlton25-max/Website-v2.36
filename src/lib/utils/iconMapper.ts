/**
 * Icon Mapper Utilities
 *
 * Reusable functions for mapping content to appropriate Phosphor icons.
 * Icons are organized by category in /public/Icons/phosphor/[category]/
 *
 * Categories: nature, wellness, objects, interface, communication, people, creative, shapes, a11y, a11y-panel
 */

/**
 * Maps tag names to appropriate icons based on keywords
 */
export const getIconForTag = (tag: string): string => {
  const tagLower = tag.toLowerCase();

  // Mindfulness & Meditation
  if (tagLower.includes('mindful')) return 'wellness/peace-fill';
  if (tagLower.includes('meditation')) return 'nature/flower-lotus-fill';
  if (tagLower.includes('breathing')) return 'nature/wind-fill';

  // Wellbeing & Health
  if (tagLower.includes('wellbeing') || tagLower.includes('well-being')) return 'wellness/heart-fill';
  if (tagLower.includes('health')) return 'wellness/heartbeat-fill';
  if (tagLower.includes('wellness')) return 'creative/sparkle-fill';

  // Self-Care & Care
  if (tagLower.includes('self-care') || tagLower.includes('selfcare')) return 'wellness/hand-heart-fill';
  if (tagLower.includes('care')) return 'wellness/hands-praying-fill';

  // Emotions
  if (tagLower.includes('emotion')) return 'wellness/smiley-fill';
  if (tagLower.includes('feeling')) return 'wellness/heart-straight-fill';
  if (tagLower.includes('calm')) return 'nature/moon-stars-fill';
  if (tagLower.includes('stress')) return 'wellness/brain-fill';
  if (tagLower.includes('anxiety')) return 'nature/butterfly-fill';

  // Activities
  if (tagLower.includes('sensory')) return 'people/hand-palm-fill';
  if (tagLower.includes('creative')) return 'creative/palette-fill';
  if (tagLower.includes('movement')) return 'wellness/person-simple-walk-fill';
  if (tagLower.includes('nature')) return 'nature/leaf-fill';
  if (tagLower.includes('music')) return 'creative/music-notes-fill';

  // Default - use a variety of generic icons based on the tag name
  const genericIcons = [
    'creative/sparkle-fill',
    'creative/star-fill',
    'shapes/circles-three-fill',
    'shapes/squares-four-fill',
    'nature/flower-fill',
    'nature/sun-fill',
    'interface/placeholder-fill',
    'communication/chats-circle-fill',
    'creative/compass-fill',
    'creative/lightbulb-fill'
  ];

  // Use a simple hash to consistently select the same icon for the same tag
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    hash = hash & hash;
  }

  return genericIcons[Math.abs(hash) % genericIcons.length];
};

/**
 * Maps benefit text to appropriate icons
 */
export const getIconForBenefit = (benefit: string): string => {
  const lower = benefit.toLowerCase();
  if (lower.includes('emotion')) return 'wellness/heart-fill';
  if (lower.includes('confidence') || lower.includes('agency')) return 'creative/star-fill';
  if (lower.includes('motor') || lower.includes('coordination')) return 'people/hand-fill';
  if (lower.includes('language') || lower.includes('narrative')) return 'communication/chat-circle-text-fill';
  if (lower.includes('stress') || lower.includes('mood')) return 'nature/sun-fill';
  if (lower.includes('creative') || lower.includes('expression')) return 'creative/palette-fill';
  if (lower.includes('problem') || lower.includes('solving')) return 'creative/lightbulb-fill';
  if (lower.includes('regulation')) return 'objects/scales-fill';
  return 'interface/check-circle-fill';
};

/**
 * Maps skill names to appropriate icons
 */
export const getIconForSkill = (skill: string): string => {
  const lower = skill.toLowerCase();
  if (lower.includes('language')) return 'communication/chat-circle-text-fill';
  if (lower.includes('motor')) return 'people/hand-fill';
  if (lower.includes('emotion') || lower.includes('regulation')) return 'wellness/heart-fill';
  if (lower.includes('problem') || lower.includes('solving')) return 'creative/lightbulb-fill';
  if (lower.includes('social')) return 'people/users-fill';
  if (lower.includes('cognitive') || lower.includes('thinking')) return 'wellness/brain-fill';
  if (lower.includes('sensory')) return 'people/hand-palm-fill';
  if (lower.includes('communication')) return 'communication/chats-fill';
  return 'shapes/puzzle-piece-fill';
};

/**
 * Maps asset/resource types to icons
 */
export const getIconForAssetType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'worksheet': 'objects/note-pencil-fill',
    'workbook': 'objects/book-fill',
    'guide': 'objects/book-open-fill',
    'toolkit': 'objects/toolbox-fill',
    'cards': 'objects/cards-fill',
    'poster': 'objects/image-fill',
    'activity': 'objects/game-controller-fill',
    'article': 'objects/article-fill',
    'presentation': 'objects/presentation-chart-fill',
    'file': 'objects/file-fill',
    'pdf': 'objects/file-pdf-fill',
  };
  return typeMap[type.toLowerCase()] || 'objects/file-fill';
};

/**
 * Common UI icons for quick access
 */
export const uiIcons = {
  // Navigation
  back: 'a11y-panel/arrow-left-fill',
  download: 'a11y-panel/download-fill',
  reset: 'a11y-panel/arrow-counter-clockwise-fill',

  // Actions
  plus: 'interface/plus-circle-fill',
  check: 'interface/check-circle-fill',
  close: 'a11y/x-fill',

  // Status
  info: 'a11y/info-fill',
  warning: 'a11y/warning-fill',

  // A11y
  accessibility: 'a11y-panel/wheelchair-fill',
  eye: 'a11y/eye-fill',
  eyeOff: 'a11y/eye-slash-fill',

  // Communication
  email: 'a11y/envelope-fill',
  share: 'a11y/share-fill',
  link: 'a11y/link-fill',

  // Shopping
  basket: 'a11y/basket-fill',

  // Search
  search: 'a11y/magnifying-glass-fill',
} as const;
