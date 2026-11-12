import { ProductEntity, Locale } from '@/types/product';

/**
 * 生成符合 Google / 百度富媒体搜索卡片规范的 Schema.org Product JSON-LD
 */
export function generateProductJsonLd(product: ProductEntity, locale: Locale = 'zh-CN') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name[locale],
    description: product.subtitle[locale],
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'AURA Flagship'
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: locale === 'zh-CN' ? 'CNY' : 'USD',
      lowPrice: Math.round(product.retailPrice * 0.78),
      highPrice: product.retailPrice,
      offerCount: product.variants.length,
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  };
}
