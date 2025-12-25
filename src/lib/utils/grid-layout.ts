/**
 * Grid Layout Utilities
 * Server-side grid positioning calculations for masonry-style layouts
 */

/**
 * Properties added by calculateGridLayout
 */
export interface GridLayoutProperties {
  estimatedWidth: number;
  estimatedHeight: number;
  gridColumn: string;
  gridRow?: string;
}

/**
 * Calculate estimated dimensions for a card-style grid item
 * Based on icon size, text content, padding, and typography
 */
export function estimateCardDimensions(
  label: string,
  value: string,
  iconSize: number = 24,
  gap: number = 16,
  padding: number = 32
): { width: number; height: number } {
  // Estimate text width based on character count and font properties
  // Uppercase label (text-xs, semibold, letter-spacing 0.05em): ~8px per char
  const labelWidth = label.length * 8;
  
  // Value text (text-sm, medium): ~7px per char
  const valueWidth = value.length * 7;
  
  // Card width = icon + gap + max(label, value) + padding
  const textWidth = Math.max(labelWidth, valueWidth);
  const estimatedWidth = iconSize + gap + textWidth + padding;
  
  // Estimate height
  // Multi-line values add height (~30 chars per line for text-sm)
  const lines = Math.ceil(value.length / 30);
  const textHeight = 20 + (lines * 20); // Base + additional lines
  const estimatedHeight = Math.max(iconSize, textHeight) + padding;
  
  return {
    width: estimatedWidth,
    height: estimatedHeight
  };
}

/**
 * Calculate grid positioning for items
 * Only sets column spans - lets CSS Grid's auto-flow dense handle row placement
 * Returns the original items with added grid layout properties
 */
export function calculateGridLayout<T>(
  items: T[],
  getDimensions: (item: T) => { width: number; height: number },
  gridColumns: number = 5,
  minCardWidth: number = 200
): (T & GridLayoutProperties)[] {
  const positionedItems: (T & GridLayoutProperties)[] = [];

  items.forEach((item) => {
    const { width, height } = getDimensions(item);

    // Determine column span based on estimated width - use threshold approach
    let columnSpan = 1;
    if (width > minCardWidth * 1.6) columnSpan = 2; // Need to be 60% wider
    if (width > minCardWidth * 2.6) columnSpan = 3; // Need to be 160% wider
    columnSpan = Math.min(columnSpan, gridColumns);

    // Add grid positioning to item - only set column span, let grid-auto-flow: dense handle rows
    positionedItems.push({
      ...item,
      estimatedWidth: width,
      estimatedHeight: height,
      gridColumn: `span ${columnSpan}`
    });
  });

  return positionedItems;
}
