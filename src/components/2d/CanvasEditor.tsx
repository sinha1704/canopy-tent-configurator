import { useEffect, useRef } from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { TextLayerControls } from './TextLayerControls';
import { LogoLayerControls } from './LogoLayerControls';
import { CanopyCanvasRenderer } from '../../utils/canvasRenderer';
import { SURFACES_REGISTRY, BRAND_COLOR_PALETTES } from '../../constants/configurator';
import { Palette, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';

export function CanvasEditor() {
  const activeSurfaceId = useConfiguratorStore((state) => state.activeSurfaceId);
  const surface = useConfiguratorStore((state) => state.surfaces[activeSurfaceId]);
  const setSurfaceBackgroundColor = useConfiguratorStore(
    (state) => state.setSurfaceBackgroundColor
  );
  const setAllSurfacesColor = useConfiguratorStore((state) => state.setAllSurfacesColor);
  const applyCanopyTheme = useConfiguratorStore((state) => state.applyCanopyTheme);
  const clearSurface = useConfiguratorStore((state) => state.clearSurface);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const meta = SURFACES_REGISTRY[activeSurfaceId];

  // Render 2D WYSIWYG preview of currently active surface
  useEffect(() => {
    if (!previewCanvasRef.current || !surface) return;
    const canvas = previewCanvasRef.current;
    const width = meta.type === 'valance' ? 750 : 600;
    const height = meta.type === 'valance' ? 150 : 400;

    CanopyCanvasRenderer.renderSurfaceToCanvas(canvas, surface, width, height);
  }, [surface, meta]);

  if (!surface) return null;

  return (
    <div className="space-y-3 bg-white dark:bg-[#111827] p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Surface Header & Action Bar */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 capitalize shrink-0">
              {meta.group}
            </span>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate">{meta.label}</h2>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            <strong className="text-slate-700 dark:text-slate-300">{meta.dimensionsFeet}</strong>
            <span className="hidden sm:inline"> • 600D polyester</span>
          </p>
        </div>

        {/* Action buttons — icon-only on mobile, with label on sm+ */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              clearSurface(activeSurfaceId);
              toast.info(`Cleared all artwork on ${meta.shortLabel}.`);
            }}
            className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Clear this panel"
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline font-medium">Clear</span>
          </button>

          <button
            onClick={() => {
              useConfiguratorStore.getState().resetAllSurfaces();
              toast.success('Reset to factory defaults!');
            }}
            className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
            title="Reset all panels"
          >
            <RotateCcw className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="hidden sm:inline font-medium">Reset All</span>
          </button>
        </div>
      </div>

      <div className="relative p-2 sm:p-2.5 bg-slate-900 dark:bg-[#070a13] rounded-xl border border-slate-800 shadow-inner overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-0.5">
          <span className="flex items-center gap-1.5 font-semibold text-slate-200 text-[10px] sm:text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            2D Surface Proof
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{meta.dimensionsFeet}</span>
        </div>

        <div className="w-full flex items-center justify-center py-1">
          <canvas
            ref={previewCanvasRef}
            className="max-w-full max-h-[80px] sm:max-h-[110px] object-contain rounded-md shadow-md border border-slate-700/60 bg-white"
          />
        </div>
      </div>

      <div className="space-y-2.5 p-3 sm:p-3.5 bg-slate-50 dark:bg-[#151c2c] rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Panel Color</span>
          </div>
          <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-[#111827] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {BRAND_COLOR_PALETTES.find(c => c.hex.toLowerCase() === surface.backgroundColor.toLowerCase())?.name || surface.backgroundColor}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {BRAND_COLOR_PALETTES.map((color) => (
            <button
              key={color.hex}
              onClick={() => setSurfaceBackgroundColor(activeSurfaceId, color.hex)}
              title={color.name}
              className={`w-7 h-7 rounded-lg border transition-all cursor-pointer ${
                surface.backgroundColor.toLowerCase() === color.hex.toLowerCase()
                  ? 'ring-2 ring-blue-600 scale-110 border-white shadow-md'
                  : 'border-slate-300 dark:border-slate-600 hover:scale-105 hover:border-slate-400'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}

          <div className="flex items-center gap-1.5 ml-auto bg-white dark:bg-[#111827] px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
            <input
              type="color"
              value={surface.backgroundColor}
              onChange={(e) => setSurfaceBackgroundColor(activeSurfaceId, e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              title="Custom Hex Color"
            />
            <span className="text-[10px] font-mono text-slate-700 dark:text-slate-300 font-bold">CUSTOM</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Quick Canopy Color Themes (1-Click)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { name: 'Pure White', peak: '#FFFFFF', valance: '#FFFFFF', preview: ['#FFFFFF', '#FFFFFF'] },
              { name: 'Onyx Black', peak: '#181A20', valance: '#181A20', preview: ['#181A20', '#181A20'] },
              { name: 'Navy Commercial', peak: '#0F2744', valance: '#FFFFFF', preview: ['#0F2744', '#FFFFFF'] },
              { name: 'Royal Crimson', peak: '#B91C1C', valance: '#181A20', preview: ['#B91C1C', '#181A20'] },
            ].map((theme) => (
              <button
                key={theme.name}
                onClick={() => applyCanopyTheme(theme.peak, theme.valance)}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all text-left shadow-2xs cursor-pointer"
              >
                <div className="flex -space-x-1 shrink-0">
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs" style={{ backgroundColor: theme.preview[0] }} />
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs" style={{ backgroundColor: theme.preview[1] }} />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 truncate">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-1">
        <TextLayerControls surfaceId={activeSurfaceId} />
      </div>

      <div className="pt-1">
        <LogoLayerControls surfaceId={activeSurfaceId} />
      </div>
    </div>
  );
}
