export type Locale = 'zh-CN' | 'en-US';
export type ProductDomain = 'consumer' | 'industrial';

export interface TierRule {
  minQty: number;
  discountRate: number; // e.g., 0.88 means 12% off
  label: string;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  editionName: string;
  priceDelta: number;
  stock: number;
}

export interface ProductEntity {
  id: string;
  sku: string;
  slug: string;
  domain: ProductDomain;
  name: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  badge: Record<Locale, string>;
  category: string;
  retailPrice: number;
  unitCostEstimate: number;
  rating: number;
  reviewCount: number;
  highlights: Record<Locale, string[]>;
  specs: Record<string, string>;
  variants: ProductVariant[];
  tierPricing: TierRule[];
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  variantLabel: string;
  engravingText?: string;
  warrantyExtended: boolean;
  unitPrice: number;
  quantity: number;
}
