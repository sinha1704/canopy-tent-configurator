import { create } from 'zustand';
import type { ShopifyCartPayload, ShopifyLineItemInput } from '../types/shopify';
import { useConfiguratorStore } from './useConfiguratorStore';
import { usePricingStore } from './usePricingStore';
import { TENT_SIZES_CONFIG } from '../constants/configurator';

interface CartState {
  isDrawerOpen: boolean;
  isPayloadInspectorOpen: boolean;
  cartItems: ShopifyCartPayload[];
  activePayload: ShopifyCartPayload | null;

  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  openPayloadInspector: () => void;
  closePayloadInspector: () => void;
  addToCart: (thumbnailSnapshotBase64?: string) => ShopifyCartPayload;
  removeCartItem: (refId: string) => void;
  clearCart: () => void;
  buildShopifyGraphQLMutation: (item: ShopifyCartPayload) => string;
}

export const useCartStore = create<CartState>((set) => ({
  isDrawerOpen: false,
  isPayloadInspectorOpen: false,
  cartItems: [],
  activePayload: null,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  openPayloadInspector: () => set({ isPayloadInspectorOpen: true }),
  closePayloadInspector: () => set({ isPayloadInspectorOpen: false }),

  addToCart: (thumbnailSnapshotBase64 = '') => {
    const cfg = useConfiguratorStore.getState();
    const pricing = usePricingStore.getState().pricing;

    const sizeConfig = TENT_SIZES_CONFIG[cfg.tentSize];
    const customizedCount = cfg.getCustomizedSurfacesCount();

    const refId = `SSS-CANOPY-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const accessorySummary = [
      cfg.accessories.hasBackWall ? 'Back Wall' : null,
      cfg.accessories.hasSideWalls ? 'Side Walls' : null,
      cfg.accessories.hasHalfWalls ? 'Half Walls' : null,
      cfg.accessories.hasRollerBag ? 'Heavy Duty Roller Bag' : null,
      cfg.accessories.hasSandBags ? 'Weight Sandbags (4-pk)' : null,
    ].filter(Boolean).join(', ') || 'None';

    const customizedLocationsList = Object.entries(cfg.surfaces)
      .filter(([, s]) => s.textLayers.length > 0 || s.logoLayers.length > 0)
      .map(([id, s]) => `${id} (${s.textLayers.length} text, ${s.logoLayers.length} logos)`)
      .join(' | ') || 'Blank / Stock Canopy';

    // Simulated Shopify Storefront GraphQL Variant GID
    const variantId = `gid://shopify/ProductVariant/749201849102${cfg.tentSize === '8x8' ? '88' : cfg.tentSize === '6.5x6.5' ? '65' : '55'}`;

    const newPayload: ShopifyCartPayload = {
      variantId,
      sku: `SSS-TENT-${cfg.tentSize.replace('.', '')}-${cfg.frameType === 'hex_aluminum_pro' ? 'HEX' : 'STL'}`,
      title: `${sizeConfig.label} Custom Printed Canopy Tent`,
      unitPrice: pricing.total,
      quantity: 1,
      properties: {
        _tent_size: cfg.tentSize,
        _frame_type: cfg.frameType,
        _accessories: accessorySummary,
        _customized_surfaces_count: customizedCount,
        _customized_summary: customizedLocationsList,
        _preview_thumbnail_base64: thumbnailSnapshotBase64.substring(0, 120) + '...[truncated for header]',
        _manufacturing_ref_id: refId,
        _print_fee: `$${pricing.customPrintFee.toFixed(2)} (${pricing.printLocationsCount} printed surfaces)`,
        _pdf_spec_url: `https://orders.sssstudio.com/specs/${refId}.pdf`
      },
      pricingSnapshot: { ...pricing },
      surfacesSnapshot: JSON.parse(JSON.stringify(cfg.surfaces)),
      createdAt: new Date().toISOString()
    };

    set((state) => ({
      cartItems: [newPayload, ...state.cartItems],
      activePayload: newPayload,
      isDrawerOpen: true
    }));

    return newPayload;
  },

  removeCartItem: (refId) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => item.properties._manufacturing_ref_id !== refId
      )
    }));
  },

  clearCart: () => set({ cartItems: [], activePayload: null }),

  buildShopifyGraphQLMutation: (item: ShopifyCartPayload): string => {
    const input: ShopifyLineItemInput = {
      merchandiseId: item.variantId,
      quantity: item.quantity,
      attributes: Object.entries(item.properties).map(([key, value]) => ({
        key,
        value: String(value)
      }))
    };

    return `mutation AddCustomCanopyToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: [
    {
      merchandiseId: "${input.merchandiseId}",
      quantity: ${input.quantity},
      attributes: [
${input.attributes.map((a) => `        { key: "${a.key}", value: ${JSON.stringify(a.value)} }`).join(',\n')}
      ]
    }
  ]) {
    cart {
      id
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
    userErrors {
      code
      field
      message
    }
  }
}`;
  }
}));
