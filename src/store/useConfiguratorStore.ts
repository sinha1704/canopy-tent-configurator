import { create } from 'zustand';
import type {
  TentSize,
  FrameType,
  SurfaceId,
  SurfaceCustomization,
  TextLayer,
  LogoLayer,
  AccessorySelection,
  ViewportSettings,
  CameraPreset
} from '../types/configurator';

interface ConfiguratorState {
  // Model & Structure
  tentSize: TentSize;
  frameType: FrameType;
  accessories: AccessorySelection;
  baseCanopyColor: string;
  wallColor: string;
  frameColor: string;

  // Active Editing Surface
  activeSurfaceId: SurfaceId;
  surfaces: Record<SurfaceId, SurfaceCustomization>;

  // 3D Viewport Controls
  viewport: ViewportSettings;
  is3DLoading: boolean;

  // Actions
  setTentSize: (size: TentSize) => void;
  setFrameType: (frame: FrameType) => void;
  setBaseCanopyColor: (color: string) => void;
  setWallColor: (color: string) => void;
  setFrameColor: (color: string) => void;
  setAccessory: (key: keyof AccessorySelection, value: boolean) => void;
  setActiveSurfaceId: (id: SurfaceId) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleGrid: () => void;
  toggleWireframe: () => void;
  toggleDimensions: () => void;
  toggleAutoRotate: () => void;
  set3DLoading: (loading: boolean) => void;

  // Surface Customizer Actions
  setSurfaceBackgroundColor: (surfaceId: SurfaceId, color: string) => void;
  setAllSurfacesColor: (color: string) => void;
  applyCanopyTheme: (peakColor: string, valanceColor: string) => void;
  addTextLayer: (surfaceId: SurfaceId, layer: Partial<TextLayer>) => void;
  updateTextLayer: (surfaceId: SurfaceId, layerId: string, updates: Partial<TextLayer>) => void;
  removeTextLayer: (surfaceId: SurfaceId, layerId: string) => void;
  addLogoLayer: (surfaceId: SurfaceId, layer: Omit<LogoLayer, 'id'>) => void;
  updateLogoLayer: (surfaceId: SurfaceId, layerId: string, updates: Partial<LogoLayer>) => void;
  removeLogoLayer: (surfaceId: SurfaceId, layerId: string) => void;
  clearSurface: (surfaceId: SurfaceId) => void;
  resetAllSurfaces: () => void;

  // Helper count of printed surfaces
  getCustomizedSurfacesCount: () => number;
}

const createInitialSurfaces = (defaultColor = '#FFFFFF'): Record<SurfaceId, SurfaceCustomization> => {
  const ids: SurfaceId[] = [
    'front_peak',
    'back_peak',
    'left_peak',
    'right_peak',
    'front_valance',
    'back_valance',
    'left_valance',
    'right_valance',
    'back_wall'
  ];

  const record = {} as Record<SurfaceId, SurfaceCustomization>;
  ids.forEach((id) => {
    record[id] = {
      surfaceId: id,
      backgroundColor: defaultColor,
      textLayers: [],
      logoLayers: [],
      updatedAt: Date.now()
    };
  });

  // Pre-seed Front Peak with clean initial brand demo so the user is immediately impressed
  record.front_peak = {
    surfaceId: 'front_peak',
    backgroundColor: '#FFFFFF',
    textLayers: [
      {
        id: 'init-text-1',
        text: 'YOUR BRAND',
        fontFamily: 'Montserrat',
        fontSize: 50,
        fillColor: '#0B2545',
        fontWeight: '900',
        fontStyle: 'normal',
        letterSpacing: 2,
        x: 0.5,
        y: 0.55,
        rotation: 0,
        opacity: 1.0,
      }
    ],
    logoLayers: [],
    updatedAt: Date.now()
  };

  record.front_valance = {
    surfaceId: 'front_valance',
    backgroundColor: '#0B2545',
    textLayers: [
      {
        id: 'init-valance-text',
        text: 'CUSTOM EVENT BRANDING • EXHIBIT & EXPO',
        fontFamily: 'Oswald',
        fontSize: 46,
        fillColor: '#FFFFFF',
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: 2.5,
        x: 0.5,
        y: 0.5,
        rotation: 0,
        opacity: 1.0,
      }
    ],
    logoLayers: [],
    updatedAt: Date.now()
  };

  return record;
};

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  tentSize: '8x8',
  frameType: 'hex_aluminum_pro',
  baseCanopyColor: '#FFFFFF',
  wallColor: '#FFFFFF',
  frameColor: '#D1D5DB', // Default sleek anodized commercial aluminum
  accessories: {
    hasBackWall: false,
    hasSideWalls: false,
    hasHalfWalls: false,
    hasRollerBag: true,
    hasSandBags: false
  },

  activeSurfaceId: 'front_peak',
  surfaces: createInitialSurfaces('#FFFFFF'),

  viewport: {
    cameraPreset: 'perspective',
    showGrid: true,
    showDimensions: false,
    autoRotate: false,
    environmentIntensity: 1.0,
    wireframe: false
  },
  is3DLoading: false,

  setTentSize: (tentSize) => set({ tentSize }),
  setFrameType: (frameType) => {
    // Also intelligently update default frameColor if user switches between steel and hex aluminum
    const defaultCol = frameType === 'hex_aluminum_pro' ? '#D1D5DB' : '#F3F4F6';
    set({ frameType, frameColor: defaultCol });
  },
  setFrameColor: (frameColor) => set({ frameColor }),
  setWallColor: (wallColor) => {
    set((state) => {
      // Also update back_wall surface background color if present in surfaces
      const updatedSurfaces = { ...state.surfaces };
      if (updatedSurfaces.back_wall) {
        updatedSurfaces.back_wall = {
          ...updatedSurfaces.back_wall,
          backgroundColor: wallColor,
          updatedAt: Date.now()
        };
      }
      return { wallColor, surfaces: updatedSurfaces };
    });
  },
  setBaseCanopyColor: (color) => {
    set((state) => {
      const updatedSurfaces = { ...state.surfaces };
      // Update background of untouched surfaces
      (Object.keys(updatedSurfaces) as SurfaceId[]).forEach((sId) => {
        if (
          updatedSurfaces[sId].textLayers.length === 0 &&
          updatedSurfaces[sId].logoLayers.length === 0
        ) {
          updatedSurfaces[sId] = {
            ...updatedSurfaces[sId],
            backgroundColor: color,
            updatedAt: Date.now()
          };
        }
      });
      return { baseCanopyColor: color, surfaces: updatedSurfaces };
    });
  },

  setAccessory: (key, value) => {
    set((state) => ({
      accessories: { ...state.accessories, [key]: value }
    }));
  },

  setActiveSurfaceId: (activeSurfaceId) => set({ activeSurfaceId }),

  setCameraPreset: (cameraPreset) => {
    set((state) => ({
      viewport: { ...state.viewport, cameraPreset }
    }));
  },

  toggleGrid: () => {
    set((state) => ({
      viewport: { ...state.viewport, showGrid: !state.viewport.showGrid }
    }));
  },

  toggleWireframe: () => {
    set((state) => ({
      viewport: { ...state.viewport, wireframe: !state.viewport.wireframe }
    }));
  },

  toggleDimensions: () => {
    set((state) => ({
      viewport: { ...state.viewport, showDimensions: !state.viewport.showDimensions }
    }));
  },

  toggleAutoRotate: () => {
    set((state) => ({
      viewport: { ...state.viewport, autoRotate: !state.viewport.autoRotate }
    }));
  },

  set3DLoading: (is3DLoading) => set({ is3DLoading }),

  setSurfaceBackgroundColor: (surfaceId, color) => {
    set((state) => {
      const current = state.surfaces[surfaceId];
      if (!current) return state;
      return {
        surfaces: {
          ...state.surfaces,
          [surfaceId]: {
            ...current,
            backgroundColor: color,
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  setAllSurfacesColor: (color: string) => {
    set((state) => {
      const updatedSurfaces = { ...state.surfaces };
      const now = Date.now();
      for (const id of Object.keys(updatedSurfaces) as SurfaceId[]) {
        updatedSurfaces[id] = {
          ...updatedSurfaces[id],
          backgroundColor: color,
          updatedAt: now
        };
      }
      return {
        surfaces: updatedSurfaces,
        baseCanopyColor: color
      };
    });
  },

  applyCanopyTheme: (peakColor: string, valanceColor: string) => {
    set((state) => {
      const updatedSurfaces = { ...state.surfaces };
      const now = Date.now();
      for (const id of Object.keys(updatedSurfaces) as SurfaceId[]) {
        const isValance = id.includes('valance');
        updatedSurfaces[id] = {
          ...updatedSurfaces[id],
          backgroundColor: isValance ? valanceColor : peakColor,
          updatedAt: now
        };
      }
      return {
        surfaces: updatedSurfaces,
        baseCanopyColor: peakColor
      };
    });
  },

  addTextLayer: (surfaceId, layer) => {
    set((state) => {
      const current = state.surfaces[surfaceId];
      if (!current) return state;

      // Smart contrast: if background is dark, default text to crisp white #FFFFFF
      const bg = (current.backgroundColor || '#FFFFFF').replace('#', '');
      const r = parseInt(bg.substring(0, 2) || 'ff', 16);
      const g = parseInt(bg.substring(2, 4) || 'ff', 16);
      const b = parseInt(bg.substring(4, 6) || 'ff', 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const autoTextColor = luminance > 0.5 ? '#111827' : '#FFFFFF';

      const newLayer: TextLayer = {
        id: `text-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        text: layer.text || 'YOUR BRAND HERE',
        fontFamily: layer.fontFamily || 'Montserrat',
        fontSize: layer.fontSize || 48,
        fillColor: layer.fillColor || autoTextColor,
        fontWeight: layer.fontWeight || 'bold',
        fontStyle: layer.fontStyle || 'normal',
        letterSpacing: layer.letterSpacing || 0,
        x: layer.x ?? 0.5,
        y: layer.y ?? 0.5,
        rotation: layer.rotation ?? 0,
        opacity: layer.opacity ?? 1.0,
      };
      return {
        surfaces: {
          ...state.surfaces,
          [surfaceId]: {
            ...current,
            textLayers: [...current.textLayers, newLayer],
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  updateTextLayer: (surfaceId, layerId, updates) => {
    set((state) => {
      const current = state.surfaces[surfaceId];
      if (!current) return state;
      return {
        surfaces: {
          ...state.surfaces,
          [surfaceId]: {
            ...current,
            textLayers: current.textLayers.map((tl) =>
              tl.id === layerId ? { ...tl, ...updates } : tl
            ),
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  removeTextLayer: (surfaceId, layerId) => {
    set((state) => {
      const current = state.surfaces[surfaceId];
      if (!current) return state;
      return {
        surfaces: {
          ...state.surfaces,
          [surfaceId]: {
            ...current,
            textLayers: current.textLayers.filter((tl) => tl.id !== layerId),
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  addLogoLayer: (surfaceId, layer) => {
    set((state) => {
      const current = state.surfaces[surfaceId];
      if (!current) return state;
      const newLogo: LogoLayer = {
        ...layer,
        id: `logo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      };
      return {
        surfaces: {
          ...state.surfaces,
          [surfaceId]: {
            ...current,
            logoLayers: [...current.logoLayers, newLogo],
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  updateLogoLayer: (surfaceId, layerId, updates) => {
    set((state) => {
      const current = state.surfaces[surfaceId];
      if (!current) return state;
      return {
        surfaces: {
          ...state.surfaces,
          [surfaceId]: {
            ...current,
            logoLayers: current.logoLayers.map((ll) =>
              ll.id === layerId ? { ...ll, ...updates } : ll
            ),
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  removeLogoLayer: (surfaceId, layerId) => {
    set((state) => {
      const current = state.surfaces[surfaceId];
      if (!current) return state;
      return {
        surfaces: {
          ...state.surfaces,
          [surfaceId]: {
            ...current,
            logoLayers: current.logoLayers.filter((ll) => ll.id !== layerId),
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  clearSurface: (surfaceId) => {
    set((state) => {
      const current = state.surfaces[surfaceId];
      if (!current) return state;
      return {
        surfaces: {
          ...state.surfaces,
          [surfaceId]: {
            ...current,
            textLayers: [],
            logoLayers: [],
            backgroundColor: state.baseCanopyColor,
            updatedAt: Date.now()
          }
        }
      };
    });
  },

  resetAllSurfaces: () => {
    set((state) => ({
      surfaces: createInitialSurfaces(state.baseCanopyColor)
    }));
  },

  getCustomizedSurfacesCount: () => {
    const { surfaces } = get();
    return Object.values(surfaces).filter(
      (s) => s.textLayers.length > 0 || s.logoLayers.length > 0
    ).length;
  }
}));
