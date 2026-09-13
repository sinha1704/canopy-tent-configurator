import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { TENT_SIZES_CONFIG } from '../../constants/configurator';
import type { TentSize } from '../../types/configurator';
import { Maximize, Check } from 'lucide-react';

export function SizeSelector() {
  const tentSize = useConfiguratorStore((state) => state.tentSize);
  const setTentSize = useConfiguratorStore((state) => state.setTentSize);

  const sizes: TentSize[] = ['5x5', '6.5x6.5', '8x8'];

  return (
    <div className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
          <Maximize className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Canopy Footprint Size
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose your tent footprint</p>
        </div>
      </div>

      {/* Always 3-column — compact cards that fit on any screen */}
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((sizeKey) => {
          const item = TENT_SIZES_CONFIG[sizeKey];
          const isSelected = tentSize === sizeKey;

          return (
            <button
              key={sizeKey}
              onClick={() => setTentSize(sizeKey)}
              className={`relative flex flex-col items-center text-center p-2.5 rounded-xl border transition-all cursor-pointer active:scale-[0.97] ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 ring-1 ring-blue-500/30 shadow-sm'
                  : 'bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30'
              }`}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 p-0.5 bg-blue-600 rounded-full text-white">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}

              <span className={`text-sm font-bold font-mono leading-none mb-1 ${
                isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'
              }`}>
                {sizeKey}
              </span>

              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                ${item.basePrice}
              </span>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2 hidden sm:block">
                {item.description}
              </p>

              <p className="text-[10px] text-slate-500 dark:text-slate-400 sm:hidden font-medium">
                {sizeKey === '5x5' ? 'Personal' : sizeKey === '6.5x6.5' ? 'Medium' : 'Full Size'}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
