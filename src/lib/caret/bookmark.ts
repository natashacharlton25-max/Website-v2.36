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
  clickX: number;
  clickY: number;
  timestamp: number;
}

export function saveBookmark(): void {
  const viewport = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
  const scrollY = viewport ? viewport.scrollTop : window.scrollY;

  const bookmark: Bookmark = {
    url: window.location.pathname,
    scrollY,
    clickX: 0,
    clickY: 0,
    timestamp: Date.now(),
  };

  // Enter click-to-place mode
  document.body.style.cursor = 'crosshair';

  const hint = document.createElement('div');
  hint.id = 'bookmark-hint';
  hint.textContent = 'Click anywhere to place your marker';
  hint.style.cssText = 'position:fixed;top:1rem;left:50%;transform:translateX(-50%);z-index:999999;padding:0.5rem 1.5rem;background:var(--focus-color,teal);color:#fff;border-radius:12px;font-family:var(--font-body);font-size:0.875rem;pointer-events:none;';
  document.documentElement.appendChild(hint);

  let placed = false;

  const onClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('nav, .a11y-panel, .nav-container')) return;

    placed = true;
    cleanup();

    // Get scroll from OverlayScrollbars viewport
    const vpEl = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
    const scroll = vpEl ? vpEl.scrollTop : window.scrollY;
    const absY = scroll + e.clientY;

    // Scroll target: position content so the click point lands at the same clientY
    bookmark.scrollY = scroll;  // Just save current scroll — restore puts it back exactly
    bookmark.clickX = e.clientX;
    bookmark.clickY = e.clientY;

    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));

    // Show arrow right where they clicked — fixed position, exact spot
    showArrowFixed(e.clientX, e.clientY);
  };

  const cleanup = () => {
    document.body.style.cursor = '';
    hint.remove();
    document.removeEventListener('click', onClick, true);
  };

  document.addEventListener('click', onClick, true);

  // Fallback: save scroll position after 5s if no click
  setTimeout(() => {
    if (!placed) {
      cleanup();
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
    }
  }, 5000);
}

function showArrowFixed(x: number, clientY: number): void {
  document.getElementById('bookmark-arrow')?.remove();

  // Get current scroll to calculate absolute Y
  const vpEl = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
  const scroll = vpEl ? vpEl.scrollTop : window.scrollY;
  const absY = scroll + clientY;

  const arrow = document.createElement('div');
  arrow.id = 'bookmark-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.style.cssText = `position:absolute;top:${absY}px;left:${x}px;transform:translate(-50%,-50%);z-index:999999;font-size:3rem;color:var(--focus-color,teal);pointer-events:none;filter:drop-shadow(2px 2px 4px rgba(0,0,0,0.4));`;
  arrow.textContent = '\u25B6';

  // Append to the scroll container so it scrolls with content
  const container = vpEl || document.getElementById('a11y-content-wrapper') || document.body;
  container.appendChild(arrow);

  arrow.animate([
    { transform: 'translateY(-50%) scale(1)', opacity: 1 },
    { transform: 'translateY(-50%) scale(1.3)', opacity: 0.7 },
    { transform: 'translateY(-50%) scale(1)', opacity: 1 },
  ], { duration: 800, iterations: 3 });

  // Remove after 30 seconds or on click
  const removeArrow = () => arrow.remove();
  setTimeout(removeArrow, 30000);
  arrow.style.pointerEvents = 'auto';
  arrow.style.cursor = 'pointer';
  arrow.addEventListener('click', removeArrow);
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
  const raw = localStorage.getItem(BOOKMARK_KEY);
  if (!raw) return;
  try {
    const bookmark: Bookmark = JSON.parse(raw);
    // After scroll restore, the saved clientY is where it should appear on screen
    showArrowFixed(bookmark.clickX || 40, bookmark.clickY || (window.innerHeight / 2));
  } catch { /* ignore */ }
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
