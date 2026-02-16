/**
 * Grid Layout Utilities
 * Server-side grid positioning calculations
 * Outputs classes/styles compatible with Grid.astro component
 */

/**
 * Properties added by calculateGridLayout
 */
export interface GridLayoutProperties {
  estimatedWidth: number;
  estimatedHeight: number;
  /** CSS class: 'grid-span-2', 'grid-span-3', etc. Empty string for span 1 */
  spanClass: string;
  /** CSS class: 'grid-row-span-2', 'grid-row-span-3', etc. Empty string for span 1 */
  rowSpanClass: string;
  /** Inline style string for dynamic span values (fallback) */
  spanStyle: string;
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
  // Uppercase label (text-xs, semibold, letter-spacing 0.05em): ~8px per char
  const labelWidth = label.length * 8;

  // Value text (text-sm, medium): ~7px per char
  const valueWidth = value.length * 7;

  // Card width = icon + gap + max(label, value) + padding
  const textWidth = Math.max(labelWidth, valueWidth);
  const estimatedWidth = iconSize + gap + textWidth + padding;

  // Multi-line values add height (~30 chars per line for text-sm)
  const lines = Math.ceil(value.length / 30);
  const textHeight = 20 + (lines * 20);
  const estimatedHeight = Math.max(iconSize, textHeight) + padding;

  return { width: estimatedWidth, height: estimatedHeight };
}

/**
 * Calculate grid positioning for items
 * Returns items with Grid.astro-compatible span classes
 *
 * Usage with Grid component:
 *   <Grid columns={5} flow="dense">
 *     {items.map(item => (
 *       <Card class={item.spanClass} />
 *     ))}
 *   </Grid>
 */
export function calculateGridLayout<T>(
  items: T[],
  getDimensions: (item: T) => { width: number; height: number },
  gridColumns: number = 5,
  minCardWidth: number = 200
): (T & GridLayoutProperties)[] {
  return items.map((item) => {
    const { width, height } = getDimensions(item);

    // Column span based on estimated width
    let colSpan = 1;
    if (width > minCardWidth * 1.6) colSpan = 2;
    if (width > minCardWidth * 2.6) colSpan = 3;
    colSpan = Math.min(colSpan, gridColumns);

    // Row span based on estimated height
    let rowSpan = 1;
    if (height > 90) rowSpan = 2;
    if (height > 140) rowSpan = 3;

    // Map to Grid.astro utility classes
    const spanClass = colSpan > 1 ? `grid-span-${colSpan}` : '';
    const rowSpanClass = rowSpan > 1 ? `grid-row-span-${rowSpan}` : '';

    // Inline style fallback for values > 6 (beyond utility classes)
    const spanStyle = (colSpan > 6 || rowSpan > 3)
      ? `--span: ${colSpan}; --row-span: ${rowSpan};`
      : '';

    return {
      ...item,
      estimatedWidth: width,
      estimatedHeight: height,
      spanClass,
      rowSpanClass,
      spanStyle
    };
  });
}
