import type { SurfaceId, SurfaceMeta, FrameOption, TentSize } from '../types/configurator';

export const SURFACES_REGISTRY: Record<SurfaceId, SurfaceMeta> = {
  front_peak: {
    id: 'front_peak',
    label: 'Front Peak (Valance Peak)',
    shortLabel: 'Front Peak',
    type: 'peak',
    group: 'front',
    aspectRatio: 1.5,
    dimensionsFeet: '48" x 32" Triangle',
    resolution: { width: 1024, height: 768 }
  },
  back_peak: {
    id: 'back_peak',
    label: 'Back Peak',
    shortLabel: 'Back Peak',
    type: 'peak',
    group: 'back',
    aspectRatio: 1.5,
    dimensionsFeet: '48" x 32" Triangle',
    resolution: { width: 1024, height: 768 }
  },
  left_peak: {
    id: 'left_peak',
    label: 'Left Peak',
    shortLabel: 'Left Peak',
    type: 'peak',
    group: 'left',
    aspectRatio: 1.5,
    dimensionsFeet: '48" x 32" Triangle',
    resolution: { width: 1024, height: 768 }
  },
  right_peak: {
    id: 'right_peak',
    label: 'Right Peak',
    shortLabel: 'Right Peak',
    type: 'peak',
    group: 'right',
    aspectRatio: 1.5,
    dimensionsFeet: '48" x 32" Triangle',
    resolution: { width: 1024, height: 768 }
  },
  front_valance: {
    id: 'front_valance',
    label: 'Front Valance (Perimeter)',
    shortLabel: 'Front Valance',
    type: 'valance',
    group: 'front',
    aspectRatio: 5.0,
    dimensionsFeet: '120" x 14" Banner',
    resolution: { width: 1500, height: 300 }
  },
  back_valance: {
    id: 'back_valance',
    label: 'Back Valance',
    shortLabel: 'Back Valance',
    type: 'valance',
    group: 'back',
    aspectRatio: 5.0,
    dimensionsFeet: '120" x 14" Banner',
    resolution: { width: 1500, height: 300 }
  },
  left_valance: {
    id: 'left_valance',
    label: 'Left Valance',
    shortLabel: 'Left Valance',
    type: 'valance',
    group: 'left',
    aspectRatio: 5.0,
    dimensionsFeet: '120" x 14" Banner',
    resolution: { width: 1500, height: 300 }
  },
  right_valance: {
    id: 'right_valance',
    label: 'Right Valance',
    shortLabel: 'Right Valance',
    type: 'valance',
    group: 'right',
    aspectRatio: 5.0,
    dimensionsFeet: '120" x 14" Banner',
    resolution: { width: 1500, height: 300 }
  },
  back_wall: {
    id: 'back_wall',
    label: 'Full Back Wall (Accessory)',
    shortLabel: 'Back Wall',
    type: 'wall',
    group: 'accessories',
    aspectRatio: 1.4,
    dimensionsFeet: '120" x 84" Backdrop',
    resolution: { width: 1200, height: 857 }
  }
};

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: 'commercial_steel',
    name: 'Commercial White Steel Frame',
    material: 'Powder-Coated High Tensile Steel',
    legProfile: '32mm Square Leg',
    weightLbs: 52,
    windRatingMph: 28,
    surcharge: 0,
    features: [
      'Rust-resistant hammer tone white finish',
      'Smooth push-button toggle height adjusters',
      'Recommended for light-medium fair & market use'
    ]
  },
  {
    id: 'hex_aluminum_pro',
    name: 'Heavy Duty 50mm Hex Aluminum Pro',
    material: 'Anodized 6061-T6 Aircraft Grade Aluminum',
    legProfile: '50mm Hexagonal Leg (2.0mm wall thickness)',
    weightLbs: 68,
    windRatingMph: 45,
    surcharge: 145,
    badge: 'COMMERCIAL GRADE #1 CHOICE',
    features: [
      '50mm industrial hex profile - ultimate torsional rigidity',
      'Reinforced cast aluminum cross-scissor connectors',
      'Certified wind rating up to 45 mph with ballast weights',
      'Lifetime joint warranty'
    ]
  }
];

export const TENT_SIZES_CONFIG: Record<TentSize, {
  label: string;
  nominalDimensions: string;
  basePrice: number;
  modelFile: string;
  scaleFactor: number;
  cameraDistance: number;
  description: string;
}> = {
  '5x5': {
    label: '5ft x 5ft (Compact)',
    nominalDimensions: '5ft x 5ft (1.5m x 1.5m)',
    basePrice: 489,
    modelFile: '/models/Tent_5_5.glb',
    scaleFactor: 1.0,
    cameraDistance: 4.8,
    description: 'Ideal for registration booths, ticket sales, and tight market stall allocations.'
  },
  '6.5x6.5': {
    label: '6.5ft x 6.5ft (Standard)',
    nominalDimensions: '6.5ft x 6.5ft (2.0m x 2.0m)',
    basePrice: 629,
    modelFile: '/models/Tent_6.5_6.5.glb',
    scaleFactor: 1.0,
    cameraDistance: 5.6,
    description: 'The sweet spot between mobility and display coverage for outdoor promotional tours.'
  },
  '8x8': {
    label: '8ft x 8ft (Flagship Promo)',
    nominalDimensions: '8ft x 8ft (2.4m x 2.4m)',
    basePrice: 779,
    modelFile: '/models/Tent_8_8.glb',
    scaleFactor: 1.0,
    cameraDistance: 6.4,
    description: 'High visibility footprint for brand experiential activations and festival presence.'
  }
};

export const BRAND_COLOR_PALETTES = [
  { name: 'Pure White', hex: '#FFFFFF', isDark: false },
  { name: 'Onyx Black', hex: '#181A20', isDark: true },
  { name: 'Navy Commercial', hex: '#0F2744', isDark: true },
  { name: 'Pacific Blue', hex: '#1E6091', isDark: true },
  { name: 'Crimson Red', hex: '#B91C1C', isDark: true },
  { name: 'Forest Green', hex: '#14532D', isDark: true },
  { name: 'Warm Sand', hex: '#E2DDD5', isDark: false },
  { name: 'Slate Charcoal', hex: '#334155', isDark: true },
  { name: 'Solar Amber', hex: '#D97706', isDark: false },
  { name: 'Burnt Sienna', hex: '#C2410C', isDark: true },
];

export const ACCESSORY_PRICING = {
  backWall: 95,
  sideWalls: 140, // Pair
  halfWalls: 65,  // Pair with rail bars
  rollerBag: 55,
  sandBags: 35    // Set of 4 heavy duty weights
};
