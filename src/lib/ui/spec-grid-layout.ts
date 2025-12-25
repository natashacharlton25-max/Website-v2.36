/**
 * Dynamic Spec Grid Layout
 * Automatically calculates optimal grid positions for spec cards based on content
 */

interface CardDimensions {
  element: HTMLElement;
  width: number;
  height: number;
}

interface GridPosition {
  columnStart: number;
  columnSpan: number;
  rowStart: number;
  rowSpan: number;
}

function initSpecGridLayout() {
  const grids = document.querySelectorAll('.spec-masonry');
  
  grids.forEach((gridElement) => {
    const grid = gridElement as HTMLElement;
    const cards = Array.from(grid.children) as HTMLElement[];
    
    if (cards.length === 0) return;
    
    // Calculate grid columns based on viewport
    const gridWidth = grid.clientWidth;
    const minCardWidth = 200;
    const gap = 16; // var(--space-md)
    const columns = Math.max(1, Math.floor((gridWidth + gap) / (minCardWidth + gap)));
    
    // Set grid columns
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    // Reset any previous positioning
    cards.forEach(card => {
      card.style.gridColumnStart = '';
      card.style.gridColumnEnd = '';
      card.style.gridRowStart = '';
      card.style.gridRowEnd = '';
    });
    
    // Wait for layout to settle, then measure
    requestAnimationFrame(() => {
      // Measure all cards
      const cardDimensions: CardDimensions[] = cards.map(card => {
        const rect = card.getBoundingClientRect();
        return {
          element: card,
          width: rect.width,
          height: rect.height
        };
      });
      
      // Calculate spans for each card
      const positions = calculateGridPositions(cardDimensions, columns);
      
      // Apply positions
      cards.forEach((card, index) => {
        const pos = positions[index];
        card.style.gridColumnStart = pos.columnStart.toString();
        card.style.gridColumnEnd = `span ${pos.columnSpan}`;
        card.style.gridRowStart = pos.rowStart.toString();
        card.style.gridRowEnd = `span ${pos.rowSpan}`;
      });
    });
  });
}

function calculateGridPositions(cards: CardDimensions[], columns: number): GridPosition[] {
  const positions: GridPosition[] = [];
  const grid: number[][] = []; // Track occupied cells
  
  cards.forEach((card) => {
    // Determine column span based on content width
    // Cards are already sized, so we base span on actual width
    let columnSpan = 1;
    if (card.width > 280) columnSpan = 2;
    if (card.width > 420) columnSpan = 3;
    columnSpan = Math.min(columnSpan, columns);
    
    // Determine row span based on content height
    let rowSpan = 1;
    if (card.height > 90) rowSpan = 2;
    if (card.height > 140) rowSpan = 3;
    
    // Find best position
    const position = findBestPosition(grid, columns, columnSpan, rowSpan);
    
    // Mark cells as occupied
    markOccupied(grid, position, columnSpan, rowSpan);
    
    positions.push({
      columnStart: position.column,
      columnSpan,
      rowStart: position.row,
      rowSpan
    });
  });
  
  return positions;
}

function findBestPosition(
  grid: number[][], 
  columns: number, 
  columnSpan: number, 
  rowSpan: number
): { row: number; column: number } {
  let row = 1;
  let column = 1;
  
  // Try to find the first available spot
  let maxIterations = 1000; // Safety limit
  while (maxIterations > 0) {
    if (canFit(grid, row, column, columnSpan, rowSpan, columns)) {
      return { row, column };
    }
    
    column++;
    if (column + columnSpan - 1 > columns) {
      column = 1;
      row++;
    }
    maxIterations--;
  }
  
  // Fallback
  return { row: 1, column: 1 };
}

function canFit(
  grid: number[][], 
  row: number, 
  column: number, 
  columnSpan: number, 
  rowSpan: number,
  columns: number
): boolean {
  // Check if it fits within grid bounds
  if (column + columnSpan - 1 > columns) return false;
  
  // Check if all cells are unoccupied
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = column; c < column + columnSpan; c++) {
      if (grid[r - 1]?.[c - 1]) return false;
    }
  }
  
  return true;
}

function markOccupied(
  grid: number[][], 
  position: { row: number; column: number }, 
  columnSpan: number, 
  rowSpan: number
): void {
  for (let r = position.row; r < position.row + rowSpan; r++) {
    if (!grid[r - 1]) grid[r - 1] = [];
    for (let c = position.column; c < position.column + columnSpan; c++) {
      grid[r - 1][c - 1] = 1;
    }
  }
}

// Initialize on load
function init() {
  // Wait for fonts and images to load
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      setTimeout(initSpecGridLayout, 100);
    });
  } else {
    setTimeout(initSpecGridLayout, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Also run on window load as a backup
window.addEventListener('load', () => {
  setTimeout(initSpecGridLayout, 100);
});

// Reinitialize on resize (debounced)
let resizeTimeout: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initSpecGridLayout, 250);
});
