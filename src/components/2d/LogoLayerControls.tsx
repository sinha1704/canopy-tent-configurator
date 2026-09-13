import { useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { CanopyCanvasRenderer } from '../../utils/canvasRenderer';
import type { SurfaceId } from '../../types/configurator';

interface LogoLayerControlsProps {
  surfaceId: SurfaceId;
}

export function LogoLayerControls({ surfaceId }: LogoLayerControlsProps) {
  const surface = useConfiguratorStore((state) => state.surfaces[surfaceId]);
  const addLogoLayer = useConfiguratorStore((state) => state.addLogoLayer);
  const updateLogoLayer = useConfiguratorStore((state) => state.updateLogoLayer);
  const removeLogoLayer = useConfiguratorStore((state) => state.removeLogoLayer);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = await CanopyCanvasRenderer.preloadImage(dataUrl);
      const aspectRatio = (img.naturalWidth || 1) / (img.naturalHeight || 1);

      addLogoLayer(surfaceId, {
        imageUrl: dataUrl,
        originalFileName: file.name,
        width: 0.45,
        aspectRatio,
        x: 0.5,
        y: 0.5,
        rotation: 0,
        opacity: 1.0
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Logo & Graphics ({surface.logoLayers.length})
          </span>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png, image/jpeg, image/svg+xml, image/webp"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Artwork</span>
          </button>
        </div>
      </div>

      {/* Layer List */}
      {surface.logoLayers.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-3 sm:p-3.5 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/70 dark:bg-slate-900/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/30 cursor-pointer transition-colors"
        >
          <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500 mx-auto mb-1" />
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Click to upload brand logo or vector artwork</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">High-res PNG, SVG, JPG, or WEBP supported</p>
        </div>
      ) : (
        <div className="space-y-2">
          {surface.logoLayers.map((logo) => (
            <div
              key={logo.id}
              className="p-2.5 sm:p-3 bg-slate-50 dark:bg-[#151c2c] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={logo.imageUrl}
                    alt={logo.originalFileName}
                    className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 object-contain bg-white dark:bg-[#111827] p-0.5 shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[160px]">
                      {logo.originalFileName}
                    </span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Vector / Print Ready</span>
                  </div>
                </div>
                <button
                  onClick={() => removeLogoLayer(surfaceId, logo.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Remove logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sliders: Scale, Pos X, Pos Y */}
              <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">
                    <span>SIZE</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{Math.round(logo.width * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.15"
                    max="0.85"
                    step="0.02"
                    value={logo.width}
                    onChange={(e) =>
                      updateLogoLayer(surfaceId, logo.id, { width: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">
                    <span>POS X</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{Math.round(logo.x * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.02"
                    value={logo.x}
                    onChange={(e) =>
                      updateLogoLayer(surfaceId, logo.id, { x: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">
                    <span>POS Y</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{Math.round(logo.y * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.02"
                    value={logo.y}
                    onChange={(e) =>
                      updateLogoLayer(surfaceId, logo.id, { y: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
