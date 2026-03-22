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

  console.log('Scrolling to:', scrollY, 'viewport:', viewport ? 'OS' : 'window');

  if (gsap && viewport) {
    gsap.to(viewport, { scrollTop: scrollY, duration: 0.8, ease: 'power3.out' });
  } else if (viewport) {
    viewport.scrollTo({ top: scrollY, behavior: 'smooth' });
  } else if (gsap) {
    gsap.to(window, { scrollTo: scrollY, duration: 0.8, ease: 'power3.out' });
  } else {
    window.scrollTo({ top: scrollY, behavior: 'smooth' });
  }
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
