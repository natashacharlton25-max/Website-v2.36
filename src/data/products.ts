// Stub products data for template pages
// Replace with actual data source in production

export interface Product {
  slug: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  type: 'service' | 'pdf_download' | 'physical';
  features?: string[];
}

export const allProducts: Product[] = [];

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find(p => p.slug === slug);
}
