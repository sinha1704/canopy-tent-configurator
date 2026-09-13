import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { SURFACES_REGISTRY } from '../../constants/configurator';
import type { SurfaceId } from '../../types/configurator';
import { Layers, Triangle, RectangleHorizontal, Check } from 'lucide-react';

export function SurfaceSelector() {
  const activeSurfaceId = useConfiguratorStore((state) => state.activeSurfaceId);
  const setActiveSurfaceId = useConfiguratorStore((state) => state.setActiveSurfaceId);
  const surfaces = useConfiguratorStore((state) => state.surfaces);

  const peaks: SurfaceId[] = ['front_peak', 'right_peak', 'back_peak', 'left_peak'];
  const valances: SurfaceId[] = ['front_valance', 'right_valance', 'back_valance', 'left_valance'];

  const renderSurfaceCard = (id: SurfaceId) => {
    const meta = SURFACES_REGISTRY[id];
    const surfaceData = surfaces[id];
    const hasCustomization = surfaceData.textLayers.length > 0 || surfaceData.logoLayers.length > 0;
    const isActive = activeSurfaceId === id;

    return (
      <button
        key={id}
        onClick={() => setActiveSurfaceId(id)}
        className={`group relative flex flex-col p-2.5 sm:p-3 rounded-xl text-left border transition-all duration-150 cursor-pointer min-h-[56px] sm:min-h-0 active:scale-[0.97] ${
          isActive
            ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/30 shadow-sm'
            : 'bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-slate-800/60'
        }`}
      >
        {/* Top row */}
        <div className="flex items-center justify-between w-full mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 shrink-0 shadow-xs"
              style={{ backgroundColor: surfaceData.backgroundColor }}
            />
            <span className={`text-xs font-bold ${isActive ? 'text-blue-900 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
              {meta.shortLabel}
            </span>
          </div>
          {hasCustomization ? (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
              <Check className="w-2.5 h-2.5" />
              Art
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
              Blank
            </span>
          )}
        </div>

        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
          {hasCustomization
            ? `${surfaceData.textLayers.length}T • ${surfaceData.logoLayers.length}L`
            : <span className="text-slate-400 dark:text-slate-500">Tap to edit</span>}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Printable Surface Locations
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Select any section or click directly on the 3D model</p>
          </div>
        </div>
      </div>

      {/* Canopy Peak Faces */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Triangle className="w-3 h-3 text-amber-500 fill-amber-500/20" />
          <span>Canopy Peaks</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {peaks.map(renderSurfaceCard)}
        </div>
      </div>

      {/* Perimeter Valance Faces */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <RectangleHorizontal className="w-3.5 h-3 text-blue-500 dark:text-blue-400" />
          <span>Valance Banners</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {valances.map(renderSurfaceCard)}
        </div>
      </div>

      {/* Optional Wall Surfaces (Equipped in Hardware & Accessories) */}
      {(useConfiguratorStore.getState().accessories.hasBackWall || useConfiguratorStore.getState().accessories.hasSideWalls) && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
            <Layers className="w-3 h-3" />
            <span>Wall Enclosures</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {useConfiguratorStore.getState().accessories.hasBackWall && renderSurfaceCard('back_wall')}
          </div>
        </div>
      )}
    </div>
  );
}

