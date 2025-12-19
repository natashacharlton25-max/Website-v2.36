/**
 * Placeholder Images Constants
 *
 * Central reference for all placeholder images and logos
 * Makes it easy to use consistent placeholder content across the template
 */

// Base path for placeholder images
const BASE_PATH = '/Item Images/Placeholder images/';
const LOGO_PATH = '/Logo/';

// All available placeholder images
export const PLACEHOLDER_IMAGES = {
  // Unsplash images - general purpose
  tech1: `${BASE_PATH}corinne-kutz-GhjMusguIeM-unsplash.jpg`,
  workspace1: `${BASE_PATH}dane-deaner-kQ0cZomxmoI-unsplash.jpg`,
  workspace2: `${BASE_PATH}daniel-j-schwarz-oUoRl1xBRaM-unsplash.jpg`,
  food1: `${BASE_PATH}daria-pimkina-tYaccl19A3Q-unsplash.jpg`,
  tech2: `${BASE_PATH}domenico-loia-hGV2TfOh0ns-unsplash.jpg`,
  nature1: `${BASE_PATH}everett-mcintire-iHB__mWmETA-unsplash.jpg`,
  product1: `${BASE_PATH}gladys-arivia-qJs4Gp2RRAI-unsplash.jpg`,
  product2: `${BASE_PATH}katya-azimova-QY1BWDcd4xY-unsplash.jpg`,
  team1: `${BASE_PATH}krakenimages-376KN_ISplE-unsplash.jpg`,
  lifestyle1: `${BASE_PATH}lauren-mancke-aOC7TSLb1o8-unsplash.jpg`,
  tech3: `${BASE_PATH}praveen-gupta-2d_YFYrmhXU-unsplash.jpg`,
  workspace3: `${BASE_PATH}radek-grzybowski-eBRTYyjwpRY-unsplash.jpg`,
  fashion1: `${BASE_PATH}roya-ann-miller-TmB3wiXntxs-unsplash.jpg`,
  business1: `${BASE_PATH}scott-graham-5fNmWej4tAA-unsplash.jpg`,
  tech4: `${BASE_PATH}thisisengineering-TXxiFuQLBKQ-unsplash.jpg`,
  workspace4: `${BASE_PATH}zach-wolf-bH04XQexl4I-unsplash.jpg`,
} as const;

// Logos
export const LOGOS = {
  logo1: `${LOGO_PATH}Walking With A Smile - Circle Colour Logo.png`,
  logo2: `${LOGO_PATH}Walking With A Smile - Circle Colour Logo.png`,
  main: `${LOGO_PATH}Walking With A Smile - Circle Colour Logo.png`,
} as const;

// Helper arrays for random selection or iteration
export const ALL_IMAGES = Object.values(PLACEHOLDER_IMAGES);
export const ALL_LOGOS = Object.values(LOGOS);

// Categorized images for specific use cases
export const IMAGES_BY_CATEGORY = {
  tech: [
    PLACEHOLDER_IMAGES.tech1,
    PLACEHOLDER_IMAGES.tech2,
    PLACEHOLDER_IMAGES.tech3,
    PLACEHOLDER_IMAGES.tech4,
  ],
  workspace: [
    PLACEHOLDER_IMAGES.workspace1,
    PLACEHOLDER_IMAGES.workspace2,
    PLACEHOLDER_IMAGES.workspace3,
    PLACEHOLDER_IMAGES.workspace4,
  ],
  products: [
    PLACEHOLDER_IMAGES.product1,
    PLACEHOLDER_IMAGES.product2,
  ],
  lifestyle: [
    PLACEHOLDER_IMAGES.lifestyle1,
    PLACEHOLDER_IMAGES.fashion1,
    PLACEHOLDER_IMAGES.food1,
  ],
  team: [
    PLACEHOLDER_IMAGES.team1,
  ],
  business: [
    PLACEHOLDER_IMAGES.business1,
  ],
  nature: [
    PLACEHOLDER_IMAGES.nature1,
  ],
} as const;

// Helper function to get a random image
export function getRandomImage(): string {
  return ALL_IMAGES[Math.floor(Math.random() * ALL_IMAGES.length)];
}

// Helper function to get a random image from a category
export function getRandomImageFromCategory(category: keyof typeof IMAGES_BY_CATEGORY): string {
  const categoryImages = IMAGES_BY_CATEGORY[category];
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
}

// Helper function to get N random images
export function getRandomImages(count: number): string[] {
  const shuffled = [...ALL_IMAGES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
