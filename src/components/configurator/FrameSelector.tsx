import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { FRAME_OPTIONS } from '../../constants/configurator';
import type { FrameType } from '../../types/configurator';
import { Shield, Check, Wind, Weight } from 'lucide-react';

export function FrameSelector() {
  const frameType = useConfiguratorStore((state) => state.frameType);
  const setFrameType = useConfiguratorStore((state) => state.setFrameType);
  const frameColor = useConfiguratorStore((state) => state.frameColor);
  const setFrameColor = useConfiguratorStore.getState().setFrameColor;

  const frameColorPresets = [
    { name: 'Industrial White', hex: '#FFFFFF' },
    { name: 'Matte Black', hex: '#1C1917' },
    { name: 'Silver Chrome', hex: '#D1D5DB' },
    { name: 'Gunmetal', hex: '#4B5563' },
    { name: 'Navy', hex: '#0F2744' },
    { name: 'Signal Red', hex: '#B91C1C' },
    { name: 'Safety Yellow', hex: '#EAB308' },
  ];

  return (
    <div className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
          <Shield className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Frame Construction
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Select frame grade & finish</p>
        </div>
      </div>

      <div className="space-y-2">
        {FRAME_OPTIONS.map((frame) => {
          const isSelected = frameType === frame.id;

          return (
            <div
              key={frame.id}
              onClick={() => setFrameType(frame.id as FrameType)}
              className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-500 ring-1 ring-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 dark:bg-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{frame.name}</span>
                      {frame.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                          {frame.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">{frame.material}</p>
                  </div>
                </div>

                <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-400 shrink-0">
                  {frame.surcharge === 0 ? 'Included' : `+$${frame.surcharge}`}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                  {frame.windRatingMph} mph
                </span>
                <span className="flex items-center gap-1">
                  <Weight className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
                  {frame.weightLbs} lbs
                </span>
                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{frame.legProfile}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151c2c] space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-600 shadow-sm shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
              style={{ backgroundColor: frameColor }}
            />
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
              Leg & Frame Finish
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 hidden sm:inline">
              {frameColorPresets.find(p => p.hex.toUpperCase() === frameColor.toUpperCase())?.name || frameColor}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live 3D
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {frameColorPresets.map((color) => {
            const isSelected = frameColor.toUpperCase() === color.hex.toUpperCase();
            return (
              <button
                key={color.hex}
                type="button"
                title={color.name}
                onClick={() => useConfiguratorStore.getState().setFrameColor(color.hex)}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'border-blue-600 scale-110 shadow-sm ring-2 ring-blue-400/60'
                    : 'border-slate-300 dark:border-slate-600 hover:scale-105 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      color.hex === '#FFFFFF' || color.hex === '#D1D5DB' || color.hex === '#EAB308'
                        ? 'text-slate-900'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}

          {/* Custom Color Picker */}
          <label
            title="Custom Hardware Finish Color"
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-blue-400 cursor-pointer"
          >
            <span>Custom</span>
            <input
              type="color"
              value={frameColor}
              onChange={(e) => useConfiguratorStore.getState().setFrameColor(e.target.value)}
              className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
