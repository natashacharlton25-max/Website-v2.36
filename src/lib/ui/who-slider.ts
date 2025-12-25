// Who Slider Functionality
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.js-who-slider') as HTMLElement;
  const slides = document.querySelectorAll('.who-slider__slide');
  const prevBtns = document.querySelectorAll('.js-who-prev') as NodeListOf<HTMLButtonElement>;
  const nextBtns = document.querySelectorAll('.js-who-next') as NodeListOf<HTMLButtonElement>;
  const dots = document.querySelectorAll('.js-who-dot') as NodeListOf<HTMLButtonElement>;

  if (!slider || slides.length === 0) return;

  let currentSlide = 0;
  const totalSlides = slides.length;

  // Check if slider should be enabled (only above 600px)
  function isSliderEnabled(): boolean {
    return window.innerWidth > 600;
  }

  function updateSlider(): void {
    // Only apply slider transform if above 600px
    if (!isSliderEnabled()) {
      slider.style.transform = 'none';
      return;
    }

    // Move slider
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Update dots
    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });
  }

  function goToSlide(index: number): void {
    currentSlide = index;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    updateSlider();
  }

  function nextSlide(): void {
    goToSlide(currentSlide + 1);
  }

  function prevSlide(): void {
    goToSlide(currentSlide - 1);
  }

  // Event listeners for all prev buttons
  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
    });
  });

  // Event listeners for all next buttons
  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
    });
  });

  // Dot indicators
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide') || '0');
      goToSlide(slideIndex);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe(): void {
    const swipeThreshold = 50;
    if (!isSliderEnabled()) return; // Don't handle swipes on mobile stacked view

    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }

  // Handle window resize
  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateSlider();
    }, 250);
  });

  // Initialize
  updateSlider();
});
