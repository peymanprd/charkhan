import "./styles/charkhan.css";
import type { SliderState, SliderOptions } from "./types";

/**
 * Creates a fully customizable and responsive slider.
 * @param selector - The CSS selector for the slider container.
 * @param options - Configuration options for the slider.
 * @returns An object with methods to control the slider.
 */
export const createCharkhan = (
  selector: string,
  options: SliderOptions = {}
) => {
  const slider = document.querySelector(selector) as HTMLElement;
  const wrapper = slider.querySelector(".charkhan-wrapper") as HTMLElement;
  const slides = Array.from(
    wrapper.querySelectorAll(".charkhan-slide")
  ) as HTMLElement[];
  const state: SliderState = {
    currentIndex: 0,
    slideWidth: slides[0].clientWidth,
    totalSlides: slides.length,
    autoplayInterval: null,
  };

  // Destructure options with default values
  const {
    loop = false,
    navigation = false,
    pagination = false,
    touch = false,
    autoplay = false,
    autoplayDelay = 3000,
    effect = "slide",
    lazyLoading = false,
  } = options;

  /**
   * Navigates to a specific slide.
   * @param index - The index of the slide to navigate to.
   */
  const goToSlide = (index: number) => {
    state.currentIndex = index;
    updateSlider();
  };

  /**
   * Navigates to the previous slide.
   */
  const prevSlide = () => {
    if (state.currentIndex > 0) state.currentIndex--;
    else if (loop) state.currentIndex = state.totalSlides - 1;
    updateSlider();
  };

  /**
   * Navigates to the next slide.
   */
  const nextSlide = () => {
    if (state.currentIndex < state.totalSlides - 1) state.currentIndex++;
    else if (loop) state.currentIndex = 0;
    updateSlider();
  };

  /**
   * Updates the slider's position and applies the transition effect.
   */
  const updateSlider = () => {
    const offset = -state.currentIndex * state.slideWidth;
    if (effect === "fade") {
      slides.forEach((slide, index) => {
        slide.style.opacity = index === state.currentIndex ? "1" : "0";
      });
    } else {
      wrapper.style.transform = `translateX(${offset}px)`;
    }
    updatePagination();
  };

  /**
   * Updates the pagination dots to reflect the current slide.
   */
  const updatePagination = () => {
    const dots = slider.querySelectorAll(".charkhan-pagination span");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === state.currentIndex);
    });
  };

  /**
   * Starts the autoplay feature.
   */
  const startAutoplay = () => {
    state.autoplayInterval = setInterval(() => {
      nextSlide();
    }, autoplayDelay);
  };

  /**
   * Stops the autoplay feature.
   */
  const stopAutoplay = () => {
    if (state.autoplayInterval) {
      clearInterval(state.autoplayInterval);
      state.autoplayInterval = null;
    }
  };

  /**
   * Enables lazy loading for images within the slider.
   */
  const setupLazyLoading = () => {
    const lazyImages = wrapper.querySelectorAll<HTMLImageElement>(".lazy");
    lazyImages.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add("loaded");
      }
    });
  };

  /**
   * Sets up the navigation buttons (prev/next).
   */
  const setupNavigation = () => {
    const prevButton = slider.querySelector(
      ".charkhan-button-prev"
    ) as HTMLElement;
    const nextButton = slider.querySelector(
      ".charkhan-button-next"
    ) as HTMLElement;

    prevButton.addEventListener("click", prevSlide);
    nextButton.addEventListener("click", nextSlide);
  };

  /**
   * Sets up the pagination dots.
   */
  const setupPagination = () => {
    const pagination = slider.querySelector(
      ".charkhan-pagination"
    ) as HTMLElement;
    for (let i = 0; i < state.totalSlides; i++) {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => goToSlide(i));
      pagination.appendChild(dot);
    }
    updatePagination();
  };

  /**
   * Enables touch support for the slider.
   */
  const setupTouch = () => {
    let startX: number;
    let isDragging = false;

    wrapper.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    wrapper.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        isDragging = false;
      }
    });
  };

  // Initialize the slider based on the provided options
  if (navigation) setupNavigation();
  if (pagination) setupPagination();
  if (touch) setupTouch();
  if (autoplay) startAutoplay();
  if (lazyLoading) setupLazyLoading();
  updateSlider();

  // Handle window resize to recalculate slide width
  window.addEventListener("resize", () => {
    state.slideWidth = slides[0].clientWidth;
    updateSlider();
  });

  // Return public methods to control the slider
  return {
    goToSlide,
    prevSlide,
    nextSlide,
    updateSlider,
  };
};
