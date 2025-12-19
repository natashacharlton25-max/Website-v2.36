// Blog/Article Data
// Example data for BlogCard components

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  author: string;
  authorImage?: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  slug: string;
  featured?: boolean;
}

// Empty for now - add blog posts when content is ready
export const blogPosts: BlogPost[] = [];

// Helper functions
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.featured === true);
}

export function getRecentPosts(limit: number = 3): BlogPost[] {
  return blogPosts.slice(0, limit);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}
