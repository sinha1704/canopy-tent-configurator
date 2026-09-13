import type { PricingRequestParams, PricingBreakdown } from '../types/pricing';
import { TENT_SIZES_CONFIG, FRAME_OPTIONS, ACCESSORY_PRICING } from '../constants/configurator';

/**
 * Enterprise Mock Pricing Service
 * Simulates an asynchronous ERP / Shopify Headless GraphQL Pricing Mutation:
 * - Calculates custom location fees (First 2 printed locations included free, each additional location $35)
 * - Computes dynamic frame surcharges and accessory bundle pricing
 * - Features deliberate network debounce / promise resolution to emulate real-world ecommerce infrastructure
 */
export class PricingService {
  private static instance: PricingService;

  public static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  /**
   * Asynchronously calculates itemized pricing breakdown with simulated latency
   */
  public async calculatePricing(
    params: PricingRequestParams,
    signal?: AbortSignal
  ): Promise<PricingBreakdown> {
    // Simulate enterprise GraphQL ERP roundtrip (180ms - 320ms)
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, 220);
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Pricing calculation aborted', 'AbortError'));
        });
      }
    });

    const sizeConfig = TENT_SIZES_CONFIG[params.size];
    const basePrice = sizeConfig ? sizeConfig.basePrice : 489;

    const frame = FRAME_OPTIONS.find((f) => f.id === params.frameType);
    const frameSurcharge = frame ? frame.surcharge : 0;

    let accessoriesCost = 0;
    if (params.hasBackWall) accessoriesCost += ACCESSORY_PRICING.backWall;
    if (params.hasSideWalls) accessoriesCost += ACCESSORY_PRICING.sideWalls;
    if (params.hasHalfWalls) accessoriesCost += ACCESSORY_PRICING.halfWalls;
    if (params.hasRollerBag) accessoriesCost += ACCESSORY_PRICING.rollerBag;
    if (params.hasSandBags) accessoriesCost += ACCESSORY_PRICING.sandBags;

    // MVP Visuals Custom Printing Rule:
    // First 2 locations customized are included in base tent pricing.
    // Each additional peak or valance location incurs standard $35 print setup & sublimated ink fee.
    const freePrintsAllowed = 2;
    const perExtraPrintPrice = 35;
    const printLocationsCount = params.customizedLocationsCount;
    const billablePrints = Math.max(0, printLocationsCount - freePrintsAllowed);
    const customPrintFee = billablePrints * perExtraPrintPrice;

    const subtotal = basePrice + frameSurcharge + accessoriesCost + customPrintFee;
    const estimatedTax = Math.round(subtotal * 0.0825 * 100) / 100; // 8.25% standard commercial sales tax
    const total = subtotal + estimatedTax;

    // Production lead time: 3 business days for custom dye-sublimation print
    const estimatedLeadDays = printLocationsCount > 0 ? 3 : 1;

    return {
      basePrice,
      frameSurcharge,
      accessoriesCost,
      printLocationsCount,
      customPrintFee,
      freePrintsAllowed,
      perExtraPrintPrice,
      subtotal,
      estimatedTax,
      total,
      currency: 'USD',
      estimatedLeadDays,
    };
  }
}

export const pricingService = PricingService.getInstance();
