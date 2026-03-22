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
  const activeField = document.querySelector('[data-focus-active]') as HTMLElement | null;
  const fieldId = activeField?.closest('.form-field')?.querySelector('input, textarea, select')?.id
    || activeField?.id
    || null;

  const bookmark: Bookmark = {
    url: window.location.pathname,
    fieldId,
    scrollY: window.scrollY || document.documentElement.scrollTop,
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
      onComplete: () => focusBookmarkedField(bookmark.fieldId),
    });
  } else {
    if (scroller === window) {
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    } else {
      scroller.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }
    setTimeout(() => focusBookmarkedField(bookmark.fieldId), 500);
  }
}

function focusBookmarkedField(fieldId: string | null): void {
  if (!fieldId) return;

  const field = document.getElementById(fieldId);
  if (field) {
    field.focus();
    // Arrow tab will appear automatically via custom-caret system
  }
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
