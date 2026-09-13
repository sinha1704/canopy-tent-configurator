import { create } from 'zustand';
import type { PricingBreakdown } from '../types/pricing';
import { pricingService } from '../services/pricingService';
import { useConfiguratorStore } from './useConfiguratorStore';

interface PricingState {
  pricing: PricingBreakdown;
  isLoading: boolean;
  error: string | null;
  lastCalculatedAt: number;
  refreshPricing: () => Promise<void>;
}

const DEFAULT_PRICING: PricingBreakdown = {
  basePrice: 779,
  frameSurcharge: 145,
  accessoriesCost: 55,
  printLocationsCount: 2,
  customPrintFee: 0,
  freePrintsAllowed: 2,
  perExtraPrintPrice: 35,
  subtotal: 979,
  estimatedTax: 80.77,
  total: 1059.77,
  currency: 'USD',
  estimatedLeadDays: 3
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let activeAbortController: AbortController | null = null;

export const usePricingStore = create<PricingState>((set) => ({
  pricing: DEFAULT_PRICING,
  isLoading: false,
  error: null,
  lastCalculatedAt: Date.now(),

  refreshPricing: async () => {
    // Debounce pricing calls to avoid hammering during rapid slider/color dragging
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    if (activeAbortController) {
      activeAbortController.abort();
    }

    set({ isLoading: true, error: null });

    return new Promise((resolve) => {
      debounceTimer = setTimeout(async () => {
        activeAbortController = new AbortController();
        try {
          const cfg = useConfiguratorStore.getState();
          const customizedLocationsCount = cfg.getCustomizedSurfacesCount();

          const result = await pricingService.calculatePricing(
            {
              size: cfg.tentSize,
              frameType: cfg.frameType,
              hasBackWall: cfg.accessories.hasBackWall,
              hasSideWalls: cfg.accessories.hasSideWalls,
              hasHalfWalls: cfg.accessories.hasHalfWalls,
              hasRollerBag: cfg.accessories.hasRollerBag,
              hasSandBags: cfg.accessories.hasSandBags,
              customizedLocationsCount,
            },
            activeAbortController.signal
          );

          set({
            pricing: result,
            isLoading: false,
            lastCalculatedAt: Date.now(),
            error: null
          });
          resolve();
        } catch (err: unknown) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            // Silently handled by newer calculation
            return;
          }
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Pricing calculation failed'
          });
          resolve();
        }
      }, 150);
    });
  }
}));

// Automatically subscribe to configurator store changes to recalculate pricing
useConfiguratorStore.subscribe((state, prevState) => {
  if (
    state.tentSize !== prevState.tentSize ||
    state.frameType !== prevState.frameType ||
    state.accessories !== prevState.accessories ||
    state.surfaces !== prevState.surfaces
  ) {
    usePricingStore.getState().refreshPricing();
  }
});
