import { TierRule } from '@/types/product';

export interface PricingQuoteInput {
  baseRetailPrice: number;
  unitCost: number;
  quantity: number;
  tierRules: TierRule[];
  couponCode?: string;
  includeExtendedWarranty?: boolean;
  expectedResalePrice?: number;
}

export interface PricingQuoteResult {
  unitFinalPrice: number;
  appliedDiscountRate: number;
  subtotal: number;
  warrantyTotal: number;
  couponDiscount: number;
  grandTotal: number;
  estimatedChannelProfit: number;
  estimatedRoiPercent: number;
}

const COUPON_MAP: Record<string, number> = {
  AURA2026: 0.95,
  VIP88: 0.88,
  ENTERPRISE90: 0.90
};

/**
 * 企业级多级阶梯定价与分销渠道利润/ROI测算引擎
 */
export function calculateEnterpriseQuote(input: PricingQuoteInput): PricingQuoteResult {
  const {
    baseRetailPrice,
    unitCost,
    quantity,
    tierRules,
    couponCode,
    includeExtendedWarranty = false,
    expectedResalePrice
  } = input;

  const safeQty = Math.max(1, Math.floor(quantity));

  // 匹配最高阶梯折扣
  let appliedDiscountRate = 1.0;
  const sortedTiers = [...tierRules].sort((a, b) => b.minQty - a.minQty);
  for (const tier of sortedTiers) {
    if (safeQty >= tier.minQty) {
      appliedDiscountRate = tier.discountRate;
      break;
    }
  }

  const unitFinalPrice = Number((baseRetailPrice * appliedDiscountRate).toFixed(2));
  const subtotal = Number((unitFinalPrice * safeQty).toFixed(2));
  const warrantyTotal = includeExtendedWarranty ? Number((baseRetailPrice * 0.08 * safeQty).toFixed(2)) : 0;

  const couponMultiplier = couponCode && COUPON_MAP[couponCode.toUpperCase()] ? COUPON_MAP[couponCode.toUpperCase()] : 1.0;
  const couponDiscount = Number(((subtotal + warrantyTotal) * (1 - couponMultiplier)).toFixed(2));
  const grandTotal = Number((subtotal + warrantyTotal - couponDiscount).toFixed(2));

  // 渠道商/团购方转售毛利与 ROI 计算
  const resaleUnit = expectedResalePrice || baseRetailPrice;
  const totalRevenue = resaleUnit * safeQty;
  const estimatedChannelProfit = Number((totalRevenue - grandTotal).toFixed(2));
  const estimatedRoiPercent = grandTotal > 0 ? Number(((estimatedChannelProfit / grandTotal) * 100).toFixed(1)) : 0;

  return {
    unitFinalPrice,
    appliedDiscountRate,
    subtotal,
    warrantyTotal,
    couponDiscount,
    grandTotal,
    estimatedChannelProfit,
    estimatedRoiPercent
  };
}
