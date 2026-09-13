import type { TentSize, FrameType } from './configurator';

export interface PricingBreakdown {
  basePrice: number;
  frameSurcharge: number;
  accessoriesCost: number;
  printLocationsCount: number;
  customPrintFee: number;
  freePrintsAllowed: number;
  perExtraPrintPrice: number;
  subtotal: number;
  estimatedTax: number;
  total: number;
  currency: 'USD';
  estimatedLeadDays: number;
}

export interface PricingRequestParams {
  size: TentSize;
  frameType: FrameType;
  hasBackWall: boolean;
  hasSideWalls: boolean;
  hasHalfWalls: boolean;
  hasRollerBag: boolean;
  hasSandBags: boolean;
  customizedLocationsCount: number;
}
