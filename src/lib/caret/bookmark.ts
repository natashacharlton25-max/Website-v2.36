/**
 * Form Bookmark — "Where was I?"
 *
 * Saves the user's current position (page, scroll, active field)
 * to localStorage. On return, "Find my place" restores the exact
 * position with GSAP smooth scroll and arrow tab pointing to the field.
 *
 * Activated via nav mega menu button or keyboard shortcut.
 */

const BOOKMARK_KEY = 'form-bookmark';

interface Bookmark {
  url: string;
  fieldId: string | null;
  scrollY: number;
  timestamp: number;
}

export function saveBookmark(): Bookmark | null {
  // Save whatever element has focus, or just scroll position
  const active = document.activeElement as HTMLElement | null;
  const fieldId = active?.id || active?.closest('[id]')?.id || null;

  // Use OverlayScrollbars viewport scroll if available
  const viewport = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
  const scrollPos = viewport ? viewport.scrollTop : (window.scrollY || document.documentElement.scrollTop);

  const bookmark: Bookmark = {
    url: window.location.pathname,
    fieldId,
    scrollY: scrollPos,
    timestamp: Date.now(),
  };

  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
  return bookmark;
}

export function getBookmark(): Bookmark | null {
  const raw = localStorage.getItem(BOOKMARK_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearBookmark(): void {
  localStorage.removeItem(BOOKMARK_KEY);
}

export function hasBookmark(): boolean {
  return !!localStorage.getItem(BOOKMARK_KEY);
}

export function restoreBookmark(): void {
  const bookmark = getBookmark();
  if (!bookmark) return;

  // If different page, navigate there
  if (bookmark.url !== window.location.pathname) {
    window.location.href = bookmark.url + '#bookmark-restore';
    return;
  }

  // Same page — scroll to position and focus field
  const gsap = (window as any).gsap;
  const scroller = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement
    || window;

  const scrollTarget = bookmark.scrollY;

  if (gsap) {
    gsap.to(scroller === window ? document.documentElement : scroller, {
      scrollTop: scrollTarget,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => focusBookmarkedField(bookmark.fieldId, bookmark.scrollY),
    });
  } else {
    if (scroller === window) {
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    } else {
      scroller.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
    setTimeout(() => focusBookmarkedField(bookmark.fieldId, bookmark.scrollY), 500);
  }
}

function focusBookmarkedField(fieldId: string | null, scrollY: number): void {
  // Show arrow tab at the saved scroll position
  const arrow = document.createElement('div');
  arrow.className = 'form-field__arrow-tab form-field__arrow-tab--visible';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.innerHTML = '<span class="form-field__arrow-tab-arrow">&#9654;</span>';
  arrow.style.top = `${scrollY}px`;
  arrow.style.left = '0';
  document.body.appendChild(arrow);

  // If we have a field ID, focus it
  if (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      // Simulate keyboard so focus-system activates
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      setTimeout(() => field.focus(), 50);
    }
  }

  // Remove arrow after 10 seconds
  setTimeout(() => arrow.remove(), 10000);
}

// Auto-restore if URL has #bookmark-restore hash
export function initBookmarkRestore(): void {
  if (window.location.hash === '#bookmark-restore') {
    // Remove hash without triggering navigation
    history.replaceState(null, '', window.location.pathname);
    // Delay to let page render
    setTimeout(restoreBookmark, 600);
  }
}
