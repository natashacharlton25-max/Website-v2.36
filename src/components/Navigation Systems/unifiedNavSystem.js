/**
 * Unified Navigation System
 * Handles both top and bottom navigation with proper state management
 * Save as: src/components/utils/unifiedNavSystem.js
 */

class UnifiedNavigationSystem {
  constructor() {
    this.topNav = {
      element: null,
      toggle: null,
      expanded: null,
      state: 'collapsed', // 'collapsed', 'expanded', 'pinned'
      hoverTimer: null,
      autoHideTimer: null
    };
    
    this.bottomNav = {
      element: null,
      toggle: null,
      expanded: null,
      state: 'collapsed', // 'collapsed', 'expanded', 'pinned'
      hoverTimer: null,
      autoHideTimer: null
    };
    
    this.scrollState = {
      lastScrollY: window.scrollY,
      isScrollingDown: false,
      scrollThreshold: 20, // Lower threshold for better responsiveness
      hideTimeout: null
    };
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready before initializing
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeSystem());
    } else {
      this.initializeSystem();
    }
  }

  initializeSystem(retryCount = 0) {
    this.findElements();

    // Only proceed if we found at least one navigation element
    if (!this.topNav.element && !this.bottomNav.element) {
      if (retryCount < 5) {
        console.warn(`⚠️ No navigation elements found, retrying (${retryCount + 1}/5)...`);
        setTimeout(() => this.initializeSystem(retryCount + 1), 200);
        return;
      } else {
        console.error('❌ Failed to find navigation elements after 5 retries');
        return;
      }
    }

    this.setupScrollListener();
    this.setupTopNavHandlers();
    this.setupBottomNavHandlers();
    this.setupGlobalHandlers();
    this.setupStaggeredAnimations();

    // Initial state - both navs should be visible but collapsed
    this.showNav('top');
    this.showNav('bottom');

    console.log('🚀 Unified Navigation System initialized successfully');
    console.log(`📍 Found elements: top=${!!this.topNav.element}, bottom=${!!this.bottomNav.element}`);
  }

  findElements() {
    // Top navigation
    this.topNav.element = document.querySelector('#navTab') || document.querySelector('.nav-tab');
    this.topNav.toggle = document.querySelector('#navToggle') || this.topNav.element?.querySelector('.nav-toggle');
    this.topNav.expanded = document.querySelector('#navExpanded') || this.topNav.element?.querySelector('.nav-expanded');
    
    // Bottom navigation
    this.bottomNav.element = document.querySelector('.settings-tab') || document.querySelector('[data-settings-tab]');
    this.bottomNav.toggle = this.bottomNav.element?.querySelector('[data-settings-toggle]') || this.bottomNav.element?.querySelector('.settings-toggle');
    this.bottomNav.expanded = this.bottomNav.element?.querySelector('[data-settings-expanded]') || this.bottomNav.element?.querySelector('.settings-expanded');
    
    console.log('📍 Elements found:', {
      topNav: !!this.topNav.element,
      bottomNav: !!this.bottomNav.element
    });
  }

  setupScrollListener() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - this.scrollState.lastScrollY);

    // Lower threshold for better sensitivity to slow scrolling
    if (scrollDelta < 3) return;

    const wasScrollingDown = this.scrollState.isScrollingDown;
    this.scrollState.isScrollingDown = currentScrollY > this.scrollState.lastScrollY;

    // Act on direction changes OR significant scroll distance
    const directionChanged = wasScrollingDown !== this.scrollState.isScrollingDown;
    const significantScroll = scrollDelta > 20; // For continuous scrolling

    if (directionChanged || significantScroll) {
      console.log(`📜 Scroll: ${this.scrollState.isScrollingDown ? 'DOWN ⬇️' : 'UP ⬆️'} (delta: ${scrollDelta}px)`);

      if (this.scrollState.isScrollingDown && currentScrollY > this.scrollState.scrollThreshold) {
        // Scrolling down - hide all navs
        this.hideOnScrollDown();
      } else if (!this.scrollState.isScrollingDown) {
        // Scrolling up - show all navs
        this.showOnScrollUp();
      }
    }

    this.scrollState.lastScrollY = currentScrollY;
  }

  hideOnScrollDown() {
    // Hide navs on scroll down, but respect pinned state
    if (this.topNav.state !== 'pinned') {
      console.log('📜⬇️ Hiding top nav on scroll down');
      this.hideNav('top');
      this.collapseNav('top');
    } else {
      console.log('📌 Top nav is pinned - staying visible');
    }

    if (this.bottomNav.state !== 'pinned') {
      console.log('📜⬇️ Hiding bottom nav on scroll down');
      this.hideNav('bottom');
      this.collapseNav('bottom');
    } else {
      console.log('📌 Bottom nav is pinned - staying visible');
    }
  }

  showOnScrollUp() {
    // Show all navs when scrolling up
    console.log('📜⬆️ Showing navs on scroll up');
    this.showNav('top');
    this.showNav('bottom');
  }

  setupTopNavHandlers() {
    if (!this.topNav.element || !this.topNav.toggle) return;
    
    // Click handler - toggle between collapsed/expanded/pinned
    this.topNav.toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleTopNavClick();
    });
    
    // Hover handlers
    this.topNav.element.addEventListener('mouseenter', () => {
      this.handleTopNavHoverEnter();
    });
    
    this.topNav.element.addEventListener('mouseleave', () => {
      this.handleTopNavHoverLeave();
    });
  }

  setupBottomNavHandlers() {
    if (!this.bottomNav.element || !this.bottomNav.toggle) return;
    
    // Click handler - toggle between collapsed/expanded/pinned
    this.bottomNav.toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleBottomNavClick();
    });
    
    // Hover handlers
    this.bottomNav.element.addEventListener('mouseenter', () => {
      this.handleBottomNavHoverEnter();
    });
    
    this.bottomNav.element.addEventListener('mouseleave', () => {
      this.handleBottomNavHoverLeave();
    });
  }

  setupGlobalHandlers() {
    // Click outside to unpin
    document.addEventListener('click', (e) => {
      if (this.topNav.state === 'pinned' && !this.topNav.element?.contains(e.target)) {
        console.log('👆 Clicked outside - unpinning top nav');
        this.unpinNav('top');
      }

      if (this.bottomNav.state === 'pinned' && !this.bottomNav.element?.contains(e.target)) {
        console.log('👆 Clicked outside - unpinning bottom nav');
        this.unpinNav('bottom');
      }
    });
  }

  setupStaggeredAnimations() {
    // Setup staggered animations for top nav
    if (this.topNav.expanded) {
      const topNavItems = this.topNav.expanded.querySelectorAll('.nav-item') || [];
      this.setupStaggeredTimings(topNavItems, 'top');
    }

    // Setup staggered animations for bottom nav (if needed)
    if (this.bottomNav.expanded) {
      const bottomNavItems = this.bottomNav.expanded.querySelectorAll('.settings-item') || [];
      this.setupStaggeredTimings(bottomNavItems, 'bottom');
    }

    // Add CSS for staggered animations
    this.injectStaggeredStyles();
  }

  setupStaggeredTimings(items, navType) {
    if (items.length === 0) return;

    const baseDelay = 120; // 120ms base for smoother sequencing

    items.forEach((item, index) => {
      const htmlItem = item;

      // Entrance timing (top to bottom) - items appear in sequence
      const entranceDelay = (index + 1) * baseDelay;

      // Exit timing (bottom to top) - items disappear in reverse
      const exitDelay = (items.length - index) * baseDelay;

      // Set CSS custom properties for dynamic timing
      htmlItem.style.setProperty('--entrance-delay', `${entranceDelay}ms`);
      htmlItem.style.setProperty('--exit-delay', `${exitDelay}ms`);
    });

    console.log(`🎭 Setup staggered animations for ${navType} nav: ${items.length} items`);
  }

  injectStaggeredStyles() {
    if (document.getElementById('staggered-nav-styles')) return;

    const staggeredStyle = document.createElement('style');
    staggeredStyle.id = 'staggered-nav-styles';
    staggeredStyle.textContent = `
      .nav-expanded.show .nav-item,
      .settings-expanded.show .settings-item {
        transition-delay: var(--entrance-delay) !important;
      }
      .nav-expanded.exiting .nav-item,
      .settings-expanded.exiting .settings-item {
        transition-delay: var(--exit-delay) !important;
      }
    `;
    document.head.appendChild(staggeredStyle);
    console.log('🎭 Injected staggered animation styles');
  }

  // TOP NAV HANDLERS
  handleTopNavClick() {
    console.log(`🔄 Top nav click - current state: ${this.topNav.state}`);
    
    switch (this.topNav.state) {
      case 'collapsed':
        // First click: expand and show menu
        this.expandNav('top');
        break;
        
      case 'expanded':
        // Second click: pin the nav (X icon)
        this.pinNav('top');
        break;
        
      case 'pinned':
        // Third click: unpin and collapse
        this.unpinNav('top');
        break;
    }
  }

  handleTopNavHoverEnter() {
    if (this.topNav.state === 'collapsed') {
      console.log('🖱️ Top nav hover - expanding');
      this.clearTimer(this.topNav, 'hoverTimer');
      this.expandNav('top');
    }
  }

  handleTopNavHoverLeave() {
    if (this.topNav.state === 'expanded') {
      console.log('🖱️ Top nav hover leave - starting auto-collapse timer');
      this.startAutoCollapseTimer('top');
    }
  }

  // BOTTOM NAV HANDLERS
  handleBottomNavClick() {
    console.log(`🔄 Bottom nav click - current state: ${this.bottomNav.state}`);
    
    switch (this.bottomNav.state) {
      case 'collapsed':
        // First click: expand and show menu
        this.expandNav('bottom');
        break;
        
      case 'expanded':
        // Second click: pin the nav (X icon)
        this.pinNav('bottom');
        break;
        
      case 'pinned':
        // Third click: unpin and collapse
        this.unpinNav('bottom');
        break;
    }
  }

  handleBottomNavHoverEnter() {
    if (this.bottomNav.state === 'collapsed') {
      console.log('🖱️ Bottom nav hover - expanding');
      this.clearTimer(this.bottomNav, 'hoverTimer');
      this.expandNav('bottom');
    }
  }

  handleBottomNavHoverLeave() {
    if (this.bottomNav.state === 'expanded') {
      console.log('🖱️ Bottom nav hover leave - starting auto-collapse timer');
      this.startAutoCollapseTimer('bottom');
    }
  }

  // STATE MANAGEMENT METHODS
  expandNav(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    console.log(`📤 Expanding ${type} nav`);
    
    nav.state = 'expanded';
    this.showNav(type);
    this.showExpandedMenu(type);
    this.updateToggleIcon(type, 'expanded');
    
    // Clear any existing timers
    this.clearTimer(nav, 'autoHideTimer');
    this.clearTimer(nav, 'hoverTimer');
  }

  pinNav(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    console.log(`📌 Pinning ${type} nav`);
    
    nav.state = 'pinned';
    this.showNav(type);
    this.showExpandedMenu(type);
    this.updateToggleIcon(type, 'pinned');
    
    // Clear all timers - pinned navs don't auto-hide
    this.clearTimer(nav, 'autoHideTimer');
    this.clearTimer(nav, 'hoverTimer');
  }

  unpinNav(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    console.log(`📌❌ Unpinning ${type} nav`);
    
    nav.state = 'collapsed';
    this.collapseNav(type);
    this.updateToggleIcon(type, 'collapsed');
    
    // Return to normal scroll behavior
    if (this.scrollState.isScrollingDown && window.scrollY > this.scrollState.scrollThreshold) {
      console.log('📜 Currently scrolling down - hiding nav immediately');
      setTimeout(() => this.hideNav(type), 100);
    }
  }

  collapseNav(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    console.log(`📥 Collapsing ${type} nav`);
    
    nav.state = 'collapsed';
    this.hideExpandedMenu(type);
    this.updateToggleIcon(type, 'collapsed');
    
    // Clear timers
    this.clearTimer(nav, 'autoHideTimer');
    this.clearTimer(nav, 'hoverTimer');
  }

  // VISUAL METHODS
  showNav(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    if (!nav.element) return;
    
    console.log(`👁️ Showing ${type} nav`);
    nav.element.classList.remove('nav-hidden-top', 'nav-hidden-bottom');
    nav.element.classList.add('nav-visible');
    nav.element.style.opacity = '1';
    nav.element.style.visibility = 'visible';
    nav.element.style.pointerEvents = 'auto';
    
    if (type === 'top') {
      nav.element.style.transform = 'translateX(0)';
    } else {
      nav.element.style.transform = 'translateX(0)';
    }
  }

  hideNav(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    if (!nav.element) return;
    
    console.log(`🫥 Hiding ${type} nav`);
    nav.element.classList.remove('nav-visible');
    nav.element.classList.add(type === 'top' ? 'nav-hidden-top' : 'nav-hidden-bottom');
    nav.element.style.opacity = '0';
    nav.element.style.visibility = 'hidden';
    nav.element.style.pointerEvents = 'none';
    
    if (type === 'top') {
      nav.element.style.transform = 'translateX(-200px)';
    } else {
      nav.element.style.transform = 'translateX(200px)';
    }
  }

  showExpandedMenu(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    if (!nav.expanded) return;
    
    console.log(`📤 Showing ${type} expanded menu`);
    nav.expanded.classList.add('show');
    nav.expanded.classList.remove('exiting');
  }

  hideExpandedMenu(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    if (!nav.expanded) return;
    
    console.log(`📥 Hiding ${type} expanded menu`);
    nav.expanded.classList.add('exiting');
    
    setTimeout(() => {
      nav.expanded?.classList.remove('show', 'exiting');
    }, 600);
  }

  updateToggleIcon(type, state) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    if (!nav.toggle) return;
    
    console.log(`🔄 Updating ${type} toggle icon to ${state}`);
    
    switch (state) {
      case 'collapsed':
        nav.toggle.classList.remove('active');
        break;
      case 'expanded':
        // Don't add active yet - just expanded
        break;
      case 'pinned':
        nav.toggle.classList.add('active');
        break;
    }
  }

  // TIMER METHODS
  startAutoCollapseTimer(type) {
    const nav = type === 'top' ? this.topNav : this.bottomNav;
    
    this.clearTimer(nav, 'hoverTimer');
    nav.hoverTimer = setTimeout(() => {
      if (nav.state === 'expanded') {
        console.log(`⏱️ Auto-collapsing ${type} nav after hover timeout`);
        this.collapseNav(type);
      }
    }, 3000); // 3 second timeout
  }

  clearTimer(nav, timerType) {
    if (nav[timerType]) {
      clearTimeout(nav[timerType]);
      nav[timerType] = null;
    }
  }

  // DEBUG METHOD
  debugState() {
    console.log('🔍 Nav States:', {
      top: this.topNav.state,
      bottom: this.bottomNav.state,
      scrollingDown: this.scrollState.isScrollingDown,
      scrollY: window.scrollY
    });
  }
}

// Create global instance
const unifiedNavSystem = new UnifiedNavigationSystem();

// Expose debug method
window.debugNavSystem = () => unifiedNavSystem.debugState();

export { unifiedNavSystem };