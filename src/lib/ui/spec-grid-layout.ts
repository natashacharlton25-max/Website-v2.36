/**
 * Dynamic Grid Layout (Client-side)
 * Measures actual DOM elements and applies Grid.astro-compatible span classes
 * Use on grids with <Grid flow="dense"> where server-side estimation isn't enough
 */

interface CardMeasurement {
  element: HTMLElement;
  width: number;
  height: number;
}

function initDenseGridLayout() {
  const grids = document.querySelectorAll<HTMLElement>('.base-grid--dense');

  grids.forEach((grid) => {
    const cards = Array.from(grid.children) as HTMLElement[];
    if (cards.length === 0) return;

    // Read column count from custom property
    const gridStyles = getComputedStyle(grid);
    const columns = gridStyles.getPropertyValue('--grid-cols')?.trim();
    const colCount = columns ? parseInt(columns, 10) : 3;

    // Reset previous span classes
    cards.forEach((card) => {
      card.classList.remove(
        'grid-span-2', 'grid-span-3', 'grid-span-4', 'grid-span-5', 'grid-span-6',
        'grid-row-span-2', 'grid-row-span-3'
      );
      card.style.removeProperty('--span');
      card.style.removeProperty('--row-span');
    });

    // Measure after reset
    requestAnimationFrame(() => {
      const measurements: CardMeasurement[] = cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { element: card, width: rect.width, height: rect.height };
      });

      // Apply span classes based on measurements
      measurements.forEach(({ element, width, height }) => {
        // Column span
        let colSpan = 1;
        if (width > 280) colSpan = 2;
        if (width > 420) colSpan = 3;
        colSpan = Math.min(colSpan, colCount);

        if (colSpan > 1) {
          element.classList.add(`grid-span-${colSpan}`);
        }

        // Row span
        let rowSpan = 1;
        if (height > 90) rowSpan = 2;
        if (height > 140) rowSpan = 3;

        if (rowSpan > 1) {
          element.classList.add(`grid-row-span-${rowSpan}`);
        }
      });
    });
  });
}

// ---- Lifecycle ----

function init() {
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => setTimeout(initDenseGridLayout, 100));
  } else {
    setTimeout(initDenseGridLayout, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Backup on full load
window.addEventListener('load', () => setTimeout(initDenseGridLayout, 100));

// Debounced resize
let resizeTimeout: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(initDenseGridLayout, 250);
});

// Astro page transitions
document.addEventListener('astro:page-load', init);
