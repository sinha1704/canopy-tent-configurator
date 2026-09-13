/**
 * Core Configurator Data Models & Contracts
 * High-performance, strictly typed architecture for Canopy Tent 3D/2D synchronization.
 */

export type TentSize = '5x5' | '6.5x6.5' | '8x8';

export type FrameType = 'commercial_steel' | 'hex_aluminum_pro';

export interface FrameOption {
  id: FrameType;
  name: string;
  material: string;
  legProfile: string;
  weightLbs: number;
  windRatingMph: number;
  surcharge: number;
  badge?: string;
  features: string[];
}

export type WallOptionId = 'back_wall' | 'side_walls' | 'half_walls' | 'none';

export interface AccessorySelection {
  hasBackWall: boolean;
  hasSideWalls: boolean;
  hasHalfWalls: boolean;
  hasRollerBag: boolean;
  hasSandBags: boolean;
}

/**
 * 8 Defined Printable Canopy Surfaces matching UV Atlas mapping:
 * - 4 Peak Triangles (front, back, left, right)
 * - 4 Perimeter Valance Rectangles (front, back, left, right)
 * - Optional Accessory Walls (back_wall, left_wall, right_wall)
 */
export type SurfaceId =
  | 'front_peak'
  | 'back_peak'
  | 'left_peak'
  | 'right_peak'
  | 'front_valance'
  | 'back_valance'
  | 'left_valance'
  | 'right_valance'
  | 'back_wall';

export type SurfaceType = 'peak' | 'valance' | 'wall';

export interface SurfaceMeta {
  id: SurfaceId;
  label: string;
  shortLabel: string;
  type: SurfaceType;
  group: 'front' | 'back' | 'left' | 'right' | 'accessories';
  aspectRatio: number; // width / height for 2D editor canvas
  dimensionsFeet: string;
  resolution: { width: number; height: number };
}

export interface TextLayer {
  id: string;
  text: string;
  fontFamily: 'Inter' | 'Montserrat' | 'Oswald' | 'Playfair Display' | 'Bebas Neue' | 'Impact';
  fontSize: number; // 12 - 120
  fillColor: string; // hex
  fontWeight: 'normal' | 'bold' | '900';
  fontStyle: 'normal' | 'italic';
  letterSpacing: number; // px
  x: number; // normalized coordinate 0.0 - 1.0 (center)
  y: number; // normalized coordinate 0.0 - 1.0 (center)
  rotation: number; // degrees -180 to 180
  opacity: number; // 0.0 to 1.0
  strokeColor?: string;
  strokeWidth?: number;
}

export interface LogoLayer {
  id: string;
  imageUrl: string;
  originalFileName: string;
  width: number; // normalized relative to canvas width (0.1 - 1.0)
  aspectRatio: number; // width / height
  x: number; // normalized 0.0 - 1.0
  y: number; // normalized 0.0 - 1.0
  rotation: number; // degrees
  opacity: number;
}

export interface SurfaceCustomization {
  surfaceId: SurfaceId;
  backgroundColor: string;
  textLayers: TextLayer[];
  logoLayers: LogoLayer[];
  updatedAt: number;
}

export type CameraPreset = 'perspective' | 'front' | 'left' | 'right' | 'back' | 'top';

export interface ViewportSettings {
  cameraPreset: CameraPreset;
  showGrid: boolean;
  showDimensions: boolean;
  autoRotate: boolean;
  environmentIntensity: number;
  wireframe: boolean;
}
