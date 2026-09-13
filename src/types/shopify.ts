import type { PricingBreakdown } from './pricing';
import type { TentSize, FrameType, SurfaceCustomization } from './configurator';

/**
 * Production Shopify Storefront API Cart Line Item payload standards
 * Matches: /cart/add.js & Storefront GraphQL cartCreate / cartLinesAdd mutations
 */
export interface ShopifyCartPropertyItem {
  key: string;
  value: string;
}

export interface ShopifyLineItemInput {
  merchandiseId: string; // e.g. "gid://shopify/ProductVariant/4491028491823"
  quantity: number;
  attributes: Array<{
    key: string;
    value: string;
  }>;
}

export interface ShopifyCartPayload {
  variantId: string;
  sku: string;
  title: string;
  unitPrice: number;
  quantity: number;
  properties: {
    _tent_size: TentSize;
    _frame_type: FrameType;
    _accessories: string;
    _customized_surfaces_count: number;
    _customized_summary: string;
    _preview_thumbnail_base64: string;
    _manufacturing_ref_id: string;
    _print_fee: string;
    _pdf_spec_url?: string;
  };
  pricingSnapshot: PricingBreakdown;
  surfacesSnapshot: Record<string, SurfaceCustomization>;
  createdAt: string;
}
