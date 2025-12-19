// Testimonials Data
// Example data for TestimonialCard components

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  authorTitle?: string;
  authorCompany?: string;
  authorImage?: string;
  rating?: number;
  featured?: boolean;
}

// Empty for now - add testimonials when images are available
export const testimonials: Testimonial[] = [];

// Helper functions
export function getFeaturedTestimonials(): Testimonial[] {
  return testimonials.filter(t => t.featured === true);
}

export function getRandomTestimonials(count: number = 3): Testimonial[] {
  const shuffled = [...testimonials].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getTestimonialsWithRating(rating: number): Testimonial[] {
  return testimonials.filter(t => t.rating === rating);
}
