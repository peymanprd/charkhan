// Define the structure of the slider's internal state
export interface SliderState {
  currentIndex: number; // Current active slide index
  slideWidth: number; // Width of each slide
  totalSlides: number; // Total number of slides
  autoplayInterval: number | null; // Autoplay interval ID
}

// Define the configuration options for the slider
export interface SliderOptions {
  loop?: boolean; // Enable infinite looping
  slidesPerView?: number; // Number of slides visible at once
  spaceBetween?: number; // Space between slides
  navigation?: boolean; // Show next/prev buttons
  pagination?: boolean; // Show pagination dots
  touch?: boolean; // Enable touch support
  autoplay?: boolean; // Enable autoplay
  autoplayDelay?: number; // Delay between slides in autoplay
  effect?: "slide" | "fade"; // Transition effect
  lazyLoading?: boolean; // Enable lazy loading for images
}
