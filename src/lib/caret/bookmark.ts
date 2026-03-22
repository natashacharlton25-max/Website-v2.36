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
  // Immediate fallback: save scroll position
  const viewport = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
  const scrollPos = viewport ? viewport.scrollTop : (window.scrollY || document.documentElement.scrollTop);
  const active = document.activeElement as HTMLElement | null;
  const fieldId = active?.id || active?.closest('[id]')?.id || null;

  const bookmark: Bookmark = {
    url: window.location.pathname,
    fieldId,
    scrollY: scrollPos,
    timestamp: Date.now(),
  };

  // Enter click-to-place mode — user can click anywhere to pin the bookmark
  enterClickToPlace(bookmark);

  return bookmark;
}

function enterClickToPlace(bookmark: Bookmark): void {
  // Show cursor change on body
  document.body.style.cursor = 'crosshair';

  // Visual hint
  const hint = document.createElement('div');
  hint.className = 'bookmark-hint';
  hint.textContent = 'Click anywhere to place your marker — or wait to save scroll position';
  hint.style.cssText = 'position:fixed;top:var(--space-xl,2rem);left:50%;transform:translateX(-50%);z-index:99999;padding:var(--space-sm,0.5rem) var(--space-lg,1.5rem);background:var(--focus-color,teal);color:var(--color-White,#fff);border-radius:var(--radius-lg,12px);font-family:var(--font-body);font-size:var(--text-small,0.875rem);pointer-events:none;opacity:0.95;';
  document.body.appendChild(hint);

  let placed = false;

  const handleClick = (e: MouseEvent) => {
    // Don't capture clicks on nav/panel
    if ((e.target as HTMLElement).closest('nav, .a11y-panel, #a11y-page')) return;

    placed = true;
    cleanup();

    // Get click position relative to document
    const viewport = document.querySelector('[data-overlayscrollbars-viewport]') as HTMLElement;
    const scrollY = viewport ? viewport.scrollTop : (window.scrollY || document.documentElement.scrollTop);

    bookmark.scrollY = scrollY + e.clientY;
    bookmark.fieldId = (e.target as HTMLElement).closest('[id]')?.id || null;

    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));

    // Show arrow at placed position
    showBookmarkArrow(bookmark.scrollY);
  };

  const cleanup = () => {
    document.body.style.cursor = '';
    hint.remove();
    document.removeEventListener('click', handleClick, true);
  };

  // Listen for click (capture phase so it fires first)
  document.addEventListener('click', handleClick, true);

  // Timeout fallback — save scroll position if no click after 5 seconds
  setTimeout(() => {
    if (!placed) {
      cleanup();
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmark));
    }
  }, 5000);
}

function showBookmarkArrow(posY: number): void {
  // Remove any existing arrow
  document.querySelector('.bookmark-arrow')?.remove();

  const arrow = document.createElement('div');
  arrow.className = 'form-field__arrow-tab form-field__arrow-tab--visible bookmark-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.innerHTML = '<span class="form-field__arrow-tab-arrow">&#9654;</span>';
  arrow.style.top = `${posY}px`;
  arrow.style.left = '0';
  document.body.appendChild(arrow);

  // Auto-remove after 10 seconds
  setTimeout(() => arrow.remove(), 10000);
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
  // Show arrow at saved position
  showBookmarkArrow(scrollY);

  // If we have a field ID, focus it
  if (fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      setTimeout(() => field.focus(), 50);
    }
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
