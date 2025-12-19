import type { Product, PDFDownloadProduct } from '../types/product';

// Free Download Products - add when downloadable files are ready
export const freeDownloadProducts: PDFDownloadProduct[] = [];

// All products are now free downloads
export const allProducts: Product[] = [...freeDownloadProducts];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return allProducts.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find(p => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return allProducts.map(p => p.slug);
}

export function getProductsByType(type: 'service' | 'pdf_download'): Product[] {
  return allProducts.filter(p => p.type === type);
}

export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return allProducts.filter(p => p.featured === true);
}

export function getProductsByTag(tag: string): Product[] {
  return allProducts.filter(p => p.tags?.includes(tag));
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return allProducts.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
