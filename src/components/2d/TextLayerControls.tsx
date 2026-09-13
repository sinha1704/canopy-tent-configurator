import { Plus, Trash2, Type } from 'lucide-react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import type { SurfaceId, TextLayer } from '../../types/configurator';

interface TextLayerControlsProps {
  surfaceId: SurfaceId;
}

export function TextLayerControls({ surfaceId }: TextLayerControlsProps) {
  const surface = useConfiguratorStore((state) => state.surfaces[surfaceId]);
  const addTextLayer = useConfiguratorStore((state) => state.addTextLayer);
  const updateTextLayer = useConfiguratorStore((state) => state.updateTextLayer);
  const removeTextLayer = useConfiguratorStore((state) => state.removeTextLayer);

  const fontOptions: TextLayer['fontFamily'][] = [
    'Montserrat',
    'Inter',
    'Oswald',
    'Playfair Display',
    'Bebas Neue',
    'Impact'
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
            Text & Typography ({surface.textLayers.length})
          </span>
        </div>
        <button
          onClick={() => addTextLayer(surfaceId, { text: 'YOUR BRAND NAME' })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Text</span>
        </button>
      </div>

      {surface.textLayers.length === 0 ? (
        <div className="p-3 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/30">
          No text on this panel. Click "+ Add Text" to add brand names, titles, or slogans.
        </div>
      ) : (
        <div className="space-y-2.5">
          {surface.textLayers.map((tl) => (
            <div
              key={tl.id}
              className="p-2.5 sm:p-3 bg-slate-50 dark:bg-[#151c2c] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs"
            >
              {/* Top Row: Content & Remove */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={tl.text}
                  onChange={(e) => updateTextLayer(surfaceId, tl.id, { text: e.target.value })}
                  placeholder="Enter brand / panel text..."
                  className="flex-1 px-2.5 py-1 bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeTextLayer(surfaceId, tl.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Delete layer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Second Row: Font & Color */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-0.5 font-bold uppercase tracking-wider">
                    Font Family
                  </label>
                  <select
                    value={tl.fontFamily}
                    onChange={(e) =>
                      updateTextLayer(surfaceId, tl.id, {
                        fontFamily: e.target.value as TextLayer['fontFamily']
                      })
                    }
                    className="w-full px-2 py-1 bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-[11px] text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {fontOptions.map((f) => (
                      <option key={f} value={f} className="dark:bg-[#111827]">
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-0.5 font-bold uppercase tracking-wider">
                    Font Color
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={tl.fillColor}
                      onChange={(e) => updateTextLayer(surfaceId, tl.id, { fillColor: e.target.value })}
                      className="w-6 h-6 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={tl.fillColor}
                      onChange={(e) => updateTextLayer(surfaceId, tl.id, { fillColor: e.target.value })}
                      className="w-full px-2 py-1 bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded-lg text-[11px] font-mono text-slate-800 dark:text-slate-200 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Sliders: Size, Position Y, Rotation */}
              <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">
                    <span>SIZE</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{tl.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="100"
                    value={tl.fontSize}
                    onChange={(e) =>
                      updateTextLayer(surfaceId, tl.id, { fontSize: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">
                    <span>POS Y</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{Math.round(tl.y * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.02"
                    value={tl.y}
                    onChange={(e) =>
                      updateTextLayer(surfaceId, tl.id, { y: Number(e.target.value) })
                    }
                    className="w-full accent-blue-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold mb-0.5">
                    <span>ROT</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">{tl.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    step="1"
                    value={tl.rotation}
                    onChange={(e) =>
                      updateTextLayer(surfaceId, tl.id, { rotation: Number(e.target.value) })
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
