/**
 * Related Content Utility
 *
 * Finds related content items based on tag similarity, category matching, or both
 * Used by RelatedGrid component for automatic related content suggestions
 */

interface ContentItem {
  id: string;
  slug?: string;
  data: {
    title?: string;
    name?: string;
    description?: string;
    category?: string;
    tags?: string[];
    publishDate?: string;
    cardImage?: unknown;
    [key: string]: unknown;
  };
}

interface ScoredItem<T> {
  item: T;
  score: number;
}

/**
 * Calculate similarity score between two items based on tags
 * @param tags1 - Tags from first item
 * @param tags2 - Tags from second item
 * @returns Score from 0-1 representing tag overlap
 */
export function calculateTagSimilarity(tags1: string[] = [], tags2: string[] = []): number {
  if (tags1.length === 0 || tags2.length === 0) return 0;

  const set1 = new Set(tags1.map(t => t.toLowerCase()));
  const set2 = new Set(tags2.map(t => t.toLowerCase()));

  let matches = 0;
  set1.forEach(tag => {
    if (set2.has(tag)) matches++;
  });

  // Jaccard similarity: intersection / union
  const union = new Set([...set1, ...set2]);
  return matches / union.size;
}

/**
 * Find related content items by tag similarity and/or category
 *
 * @param currentItem - The current item to find related content for
 * @param allItems - All available items to search through
 * @param options - Configuration options
 * @returns Array of related items sorted by relevance
 */
export function findRelatedContent<T extends ContentItem>(
  currentItem: T,
  allItems: T[],
  options: {
    maxItems?: number;
    minTagScore?: number;
    matchCategory?: boolean;
    categoryWeight?: number;
    tagWeight?: number;
    getSlug?: (item: T) => string;
  } = {}
): T[] {
  const {
    maxItems = 3,
    minTagScore = 0.1,
    matchCategory = true,
    categoryWeight = 0.3,
    tagWeight = 0.7,
    getSlug = (item) => item.slug || item.id
  } = options;

  const currentSlug = getSlug(currentItem);
  const currentTags = currentItem.data.tags || [];
  const currentCategory = currentItem.data.category;

  // Score each item
  const scored: ScoredItem<T>[] = allItems
    .filter(item => getSlug(item) !== currentSlug) // Exclude current
    .map(item => {
      let score = 0;

      // Tag similarity score
      const tagScore = calculateTagSimilarity(currentTags, item.data.tags || []);
      score += tagScore * tagWeight;

      // Category match bonus
      if (matchCategory && currentCategory && item.data.category === currentCategory) {
        score += categoryWeight;
      }

      return { item, score };
    })
    .filter(({ score }) => score >= minTagScore || (matchCategory && score > 0));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return top items
  return scored.slice(0, maxItems).map(({ item }) => item);
}

/**
 * Get slug from entry ID (handles folder-based content)
 */
export function getSlugFromId(id: string): string {
  const normalized = id.replace(/[\\/]index\.md$/, '');
  return normalized.split(/[\\/]/).pop() || id;
}

/**
 * Format content items for RelatedGrid component
 */
export function formatForRelatedGrid<T extends ContentItem>(
  items: T[],
  getSlug: (item: T) => string = getSlugFromId as (item: T) => string
): Array<{
  slug: string;
  title: string;
  description: string;
  category: string;
  publishDate?: string;
  cardImage?: unknown;
}> {
  return items.map(item => ({
    slug: getSlug(item),
    title: item.data.title || item.data.name || '',
    description: item.data.description || '',
    category: item.data.category || '',
    publishDate: item.data.publishDate,
    cardImage: item.data.cardImage
  }));
}

/**
 * Get latest content items by publish date
 *
 * @param items - All available items
 * @param options - Configuration options
 * @returns Array of latest items sorted by date (newest first)
 */
export function getLatestContent<T extends ContentItem>(
  items: T[],
  options: {
    maxItems?: number;
    excludeSlug?: string;
    getSlug?: (item: T) => string;
    getDate?: (item: T) => string | Date | undefined;
  } = {}
): T[] {
  const {
    maxItems = 3,
    excludeSlug,
    getSlug = (item) => item.slug || item.id,
    getDate = (item) => item.data.publishDate
  } = options;

  return items
    .filter(item => !excludeSlug || getSlug(item) !== excludeSlug)
    .filter(item => getDate(item)) // Only items with dates
    .sort((a, b) => {
      const dateA = new Date(getDate(a) || 0);
      const dateB = new Date(getDate(b) || 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, maxItems);
}

/**
 * Get popular content items
 *
 * For now, uses a combination of:
 * - Featured flag (if exists)
 * - Tag count (more tags = broader appeal)
 * - Category diversity (to show variety)
 *
 * In future, could integrate with analytics data
 *
 * @param items - All available items
 * @param options - Configuration options
 * @returns Array of "popular" items
 */
export function getPopularContent<T extends ContentItem>(
  items: T[],
  options: {
    maxItems?: number;
    excludeSlug?: string;
    getSlug?: (item: T) => string;
  } = {}
): T[] {
  const {
    maxItems = 3,
    excludeSlug,
    getSlug = (item) => item.slug || item.id
  } = options;

  interface ScoredPopular {
    item: T;
    score: number;
  }

  const scored: ScoredPopular[] = items
    .filter(item => !excludeSlug || getSlug(item) !== excludeSlug)
    .map(item => {
      let score = 0;

      // Featured items get a boost
      if ((item.data as Record<string, unknown>).featured) {
        score += 10;
      }

      // Items with more tags (broader topics) get slight boost
      const tagCount = item.data.tags?.length || 0;
      score += Math.min(tagCount * 0.5, 3); // Cap at 3 points

      // Add some randomization for variety (seeded by title for consistency)
      const titleHash = (item.data.title || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      score += (titleHash % 100) / 100; // 0-1 point

      return { item, score };
    });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxItems).map(({ item }) => item);
}

/**
 * Smart content suggestion - tries multiple strategies
 *
 * Priority:
 * 1. Tag-similar content (if tags exist)
 * 2. Same category content
 * 3. Latest content (fallback)
 *
 * @param currentItem - The current item
 * @param allItems - All available items
 * @param options - Configuration options
 * @returns Array of suggested items
 */
export function getSuggestedContent<T extends ContentItem>(
  currentItem: T,
  allItems: T[],
  options: {
    maxItems?: number;
    getSlug?: (item: T) => string;
  } = {}
): T[] {
  const {
    maxItems = 3,
    getSlug = (item) => item.slug || item.id
  } = options;

  const currentSlug = getSlug(currentItem);
  const currentTags = currentItem.data.tags || [];

  // Strategy 1: Find by tag similarity if tags exist
  if (currentTags.length > 0) {
    const related = findRelatedContent(currentItem, allItems, {
      maxItems,
      matchCategory: true,
      getSlug
    });

    if (related.length >= maxItems) {
      return related;
    }
  }

  // Strategy 2: Same category
  const sameCategory = allItems.filter(
    item => getSlug(item) !== currentSlug &&
            item.data.category === currentItem.data.category
  );

  if (sameCategory.length >= maxItems) {
    return sameCategory.slice(0, maxItems);
  }

  // Strategy 3: Latest as fallback
  return getLatestContent(allItems, {
    maxItems,
    excludeSlug: currentSlug,
    getSlug
  });
}
