// Navigation state and animation logic - FIXED VERSION
interface NavState {
  isLocked: boolean;
  isAnimating: boolean;
  hoverTimeout: ReturnType<typeof setTimeout> | null;
  maxWidth: number;
}

let navState: NavState = {
  isLocked: false,
  isAnimating: false,
  hoverTimeout: null,
  maxWidth: 0
};

// Initialize navigation sizing and timing
export function initializeNavigation() {
  const navExpanded = document.getElementById('navExpanded');
  const navItems = navExpanded?.querySelectorAll('.nav-item') || [];
  const navLinks = navExpanded?.querySelectorAll('.nav-link') || [];
  
  // Calculate maximum width needed for any nav link
  let calculatedMaxWidth = 120; // minimum width
  
  navLinks.forEach((link) => {
    const htmlLink = link as HTMLElement;
    // Create a temporary element to measure text width
    const tempEl = document.createElement('span');
    tempEl.style.visibility = 'hidden';
    tempEl.style.position = 'absolute';
    tempEl.style.whiteSpace = 'nowrap';
    
    // Responsive font sizing
    const isMobile = window.innerWidth <= 768;
    tempEl.style.fontSize = isMobile ? '12px' : '14px';
    tempEl.style.fontWeight = '600';
    tempEl.style.fontFamily = 'var(--font-nav, Poppins)';
    tempEl.style.textTransform = 'uppercase';
    tempEl.style.letterSpacing = '0.5px';
    tempEl.textContent = htmlLink.textContent || '';
    
    document.body.appendChild(tempEl);
    // Responsive padding - mobile uses 16px + 24px = 40px, desktop uses 32px + 20px = 52px
    const padding = isMobile ? 40 : 52;
    const textWidth = tempEl.offsetWidth + padding;
    document.body.removeChild(tempEl);
    
    calculatedMaxWidth = Math.max(calculatedMaxWidth, textWidth);
  });
  
  // Calculate safe maximum width (page text boundary + margin)
  const pageContent = document.querySelector('main') || document.body;
  const pageLeft = pageContent.getBoundingClientRect().left;
  const safeMaxWidth = Math.min(calculatedMaxWidth + 20, pageLeft - 40); // 40px safety margin
  
  navState.maxWidth = Math.max(safeMaxWidth, 120); // Never go below 120px
  
  // Apply dynamic widths to hamburger and nav links (pre-sized to match)
  const style = document.createElement('style');
  style.textContent = `
    .nav-toggle {
      width: ${navState.maxWidth}px !important;
    }
    .nav-link {
      width: ${navState.maxWidth}px !important;
    }
  `;
  document.head.appendChild(style);

  // Set up staggered timing (no longer needed as hamburger is pre-sized)
  setupStaggeredAnimations(navItems.length);
}

function setupStaggeredAnimations(itemCount: number) {
  if (itemCount === 0) return;
  
  const baseDelay = 120; // 120ms base for smoother, more visible sequencing
  const navExpanded = document.getElementById('navExpanded');
  const navItems = navExpanded?.querySelectorAll('.nav-item') || [];
  
  navItems.forEach((item, index) => {
    const htmlItem = item as HTMLElement;
    
    // Entrance timing (top to bottom) - hamburger shows first (0ms), then items
    const entranceDelay = (index + 1) * baseDelay;
    
    // Exit timing (bottom to top) - items disappear first, hamburger transforms last
    const exitDelay = (itemCount - index) * baseDelay;
    
    // Set CSS custom properties for dynamic timing
    htmlItem.style.setProperty('--entrance-delay', `${entranceDelay}ms`);
    htmlItem.style.setProperty('--exit-delay', `${exitDelay}ms`);
  });
  
  // Add dynamic timing styles for nav items only
  const timingStyle = document.createElement('style');
  timingStyle.textContent = `
    .nav-expanded.show .nav-item {
      transition-delay: var(--entrance-delay) !important;
    }
    .nav-expanded.exiting .nav-item {
      transition-delay: var(--exit-delay) !important;
    }
  `;
  document.head.appendChild(timingStyle);
}

export function showNavMenu() {
  if (navState.isAnimating) return;
  
  navState.isAnimating = true;
  
  if (navState.hoverTimeout) {
    clearTimeout(navState.hoverTimeout);
    navState.hoverTimeout = null;
  }
  
  const navExpanded = document.getElementById('navExpanded');
  const navToggle = document.getElementById('navToggle');
  
  navExpanded?.classList.remove('exiting');
  navExpanded?.classList.add('show');
  
  // Update ARIA attributes
  navToggle?.setAttribute('aria-expanded', 'true');
  navExpanded?.setAttribute('aria-hidden', 'false');
  
  
  // Calculate total animation time based on number of items
  const navItems = navExpanded?.querySelectorAll('.nav-item') || [];
  const totalTime = navItems.length * 120 + 200; // Base time for nav items
  
  setTimeout(() => {
    navState.isAnimating = false;
    
    // Start 3-second auto-hide timer if not locked
    if (!navState.isLocked) {
      navState.hoverTimeout = setTimeout(() => {
        hideNavMenu();
      }, 3000);
    }
  }, totalTime);
}

export function hideNavMenu() {
  if (navState.isAnimating || navState.isLocked) return;
  
  navState.isAnimating = true;
  
  if (navState.hoverTimeout) {
    clearTimeout(navState.hoverTimeout);
    navState.hoverTimeout = null;
  }
  
  const navExpanded = document.getElementById('navExpanded');
  const navToggle = document.getElementById('navToggle');
  
  navExpanded?.classList.add('exiting');
  
  // Update ARIA attributes
  navToggle?.setAttribute('aria-expanded', 'false');
  navExpanded?.setAttribute('aria-hidden', 'true');
  
  // Calculate total exit animation time  
  const navItems = navExpanded?.querySelectorAll('.nav-item') || [];
  const totalTime = navItems.length * 120 + 200; // Time for all items to disappear
  
  setTimeout(() => {
    navExpanded?.classList.remove('show', 'exiting');
    
    
    navState.isAnimating = false;
  }, totalTime);
}

export function setupEventListeners() {
  const navToggle = document.getElementById('navToggle');
  const navTab = document.getElementById('navTab'); // CRITICAL: Get the nav container
  const navExpanded = document.getElementById('navExpanded');

  // Hover to show menu
  navToggle?.addEventListener('mouseenter', () => {
    if (navState.hoverTimeout) {
      clearTimeout(navState.hoverTimeout);
      navState.hoverTimeout = null;
    }
    showNavMenu();
  });

  // Cancel any collapse timer when entering nav area
  navTab?.addEventListener('mouseenter', () => {
    if (!navState.isLocked && navState.hoverTimeout) {
      clearTimeout(navState.hoverTimeout);
      navState.hoverTimeout = null;
    }
  });

  // Keep menu open while hovering over any nav links
  navExpanded?.addEventListener('mouseenter', () => {
    if (!navState.isLocked && navState.hoverTimeout) {
      clearTimeout(navState.hoverTimeout);
      navState.hoverTimeout = null;
    }
  });

  // Start hide timer when leaving nav area
  navTab?.addEventListener('mouseleave', () => {
    if (!navState.isLocked) {
      if (navState.hoverTimeout) {
        clearTimeout(navState.hoverTimeout);
      }
      navState.hoverTimeout = setTimeout(() => {
        hideNavMenu();
      }, 300);
    }
  });

  // FIXED: Click to lock/unlock - now properly manages container active class
  navToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (navState.isLocked) {
      // UNLOCKING: Remove locked state and container active class
      console.log('🔓 Top nav UNLOCKING');
      navState.isLocked = false;
      navToggle.classList.remove('active');
      navTab?.classList.remove('active'); // CRITICAL: Remove active from container
      hideNavMenu();
      
    } else {
      // LOCKING: Set locked state and container active class
      console.log('🔒 Top nav LOCKING');
      navState.isLocked = true;
      navToggle.classList.add('active');
      navTab?.classList.add('active'); // CRITICAL: Add active to container
      showNavMenu();
    }
  });

  // Close when clicking outside (only if locked)
  document.addEventListener('click', (e) => {
    if (navState.isLocked && !navTab?.contains(e.target as Node)) {
      console.log('👆 Clicked outside - unlocking top nav');
      navState.isLocked = false;
      navToggle?.classList.remove('active');
      navTab?.classList.remove('active'); // CRITICAL: Remove active from container
      hideNavMenu();
    }
  });

}

// Initialize when DOM is ready
export function initNav() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeNavigation();
      setupEventListeners();
    });
  } else {
    initializeNavigation();
    setupEventListeners();
  }
}