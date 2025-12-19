// Product Type Definitions for Services and PDF Downloads

export type ProductType = 'service' | 'pdf_download';

export type ServiceType = 'one-time' | 'subscription' | 'consultation';

export interface BaseProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // 0 for free downloads
  currency?: string;
  image?: string;
  thumbnail?: string;
  featured?: boolean;
  category?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isFree?: boolean; // True for free downloads
}

export interface ServiceProduct extends BaseProduct {
  type: 'service';
  service: true;
  serviceType: ServiceType;
  duration?: string;
  deliveryTime?: string;
  includes?: string[];
  requirements?: string[];
  bookingUrl?: string;
}

export interface PDFDownloadProduct extends BaseProduct {
  type: 'pdf_download';
  downloadable: true;
  pdfPath: string; // Path in Supabase storage (e.g., 'products/templates/template-1.pdf')
  fileSize?: string;
  pageCount?: number;
  format?: string; // e.g., 'PDF', 'DOCX', 'ZIP'
  previewUrl?: string;
  downloadLimit?: number; // Max number of downloads per purchase
}

export type Product = ServiceProduct | PDFDownloadProduct;

// Type guards
export function isServiceProduct(product: Product): product is ServiceProduct {
  return product.type === 'service';
}

export function isPDFDownloadProduct(product: Product): product is PDFDownloadProduct {
  return product.type === 'pdf_download';
}

// Purchase tracking
export interface Purchase {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  purchaseDate: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  amount: number;
  currency: string;
}

// Download tracking (for PDF products)
export interface Download {
  id: string;
  userId: string;
  productId: string;
  purchaseId: string;
  downloadDate: Date;
  ipAddress?: string;
  userAgent?: string;
  downloadCount?: number; // Track how many times user has downloaded
}

// Cart item
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: Date;
}

// Product filters
export interface ProductFilters {
  type?: ProductType;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  featured?: boolean;
}
