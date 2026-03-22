/**
 * Bookmark — Save My Place / Find My Place
 *
 * Saves page URL + scroll position to localStorage.
 * On restore, navigates to page and scrolls to saved position.
 * Focus system handles the visual highlighting.
 */

const BOOKMARK_KEY = 'page-bookmark';

interface Bookmark {
  url: string;
  scrollY: number;
  timestamp: number;
}

export function saveBookmark(): void {
  const viewport = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
  const scrollY = viewport ? viewport.scrollTop : window.scrollY;

  const bookmark: Bookmark = {
    url: window.location.pathname,
    scrollY,
    timestamp: Date.now(),
  };

  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
  console.log('Bookmark saved:', bookmark);
}

export function hasBookmark(): boolean {
  return !!localStorage.getItem(BOOKMARK_KEY);
}

export function clearBookmark(): void {
  localStorage.removeItem(BOOKMARK_KEY);
}

export function restoreBookmark(): void {
  const raw = localStorage.getItem(BOOKMARK_KEY);
  if (!raw) return;

  let bookmark: Bookmark;
  try { bookmark = JSON.parse(raw); } catch { return; }

  console.log('Restoring bookmark:', bookmark);

  // Different page — navigate there with hash
  if (bookmark.url !== window.location.pathname) {
    window.location.href = bookmark.url + '#bookmark-restore';
    return;
  }

  // Same page — scroll to position
  scrollToBookmark(bookmark.scrollY);
}

function scrollToBookmark(scrollY: number): void {
  const viewport = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
  const gsap = (window as any).gsap;

  const onComplete = () => showBookmarkArrow();

  if (gsap && viewport) {
    gsap.to(viewport, { scrollTop: scrollY, duration: 0.8, ease: 'power3.out', onComplete });
  } else if (viewport) {
    viewport.scrollTo({ top: scrollY, behavior: 'smooth' });
    setTimeout(onComplete, 800);
  } else if (gsap) {
    gsap.to(window, { scrollTo: scrollY, duration: 0.8, ease: 'power3.out', onComplete });
  } else {
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
    setTimeout(onComplete, 800);
  }
}

function showBookmarkArrow(): void {
  // Remove any existing
  document.getElementById('bookmark-arrow')?.remove();

  // Fixed position arrow at left edge, vertically centred
  const arrow = document.createElement('div');
  arrow.id = 'bookmark-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.style.cssText = [
    'position:fixed',
    'top:50%',
    'left:12px',
    'transform:translateY(-50%)',
    'z-index:999999',
    'font-size:3rem',
    'color:var(--focus-color, teal)',
    'pointer-events:none',
    'filter:drop-shadow(2px 2px 4px rgba(0,0,0,0.4))',
  ].join(';');
  arrow.textContent = '\u25B6'; // Right-pointing triangle

  document.documentElement.appendChild(arrow);

  // Pulse 3 times
  arrow.animate([
    { transform: 'translateY(-50%) scale(1)', opacity: 1 },
    { transform: 'translateY(-50%) scale(1.3)', opacity: 0.7 },
    { transform: 'translateY(-50%) scale(1)', opacity: 1 },
  ], { duration: 800, iterations: 3 });

  // Remove after 8 seconds
  setTimeout(() => arrow.remove(), 8000);
}

// Auto-restore on page load if URL has #bookmark-restore
export function initBookmarkRestore(): void {
  if (window.location.hash === '#bookmark-restore') {
    history.replaceState(null, '', window.location.pathname);
    // Wait for page + OverlayScrollbars to render
    setTimeout(() => {
      const raw = localStorage.getItem(BOOKMARK_KEY);
      if (!raw) return;
      try {
        const bookmark: Bookmark = JSON.parse(raw);
        scrollToBookmark(bookmark.scrollY);
      } catch { /* ignore */ }
    }, 800);
  }
}
