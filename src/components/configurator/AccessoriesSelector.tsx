import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { ACCESSORY_PRICING } from '../../constants/configurator';
import { PackagePlus, Check } from 'lucide-react';

export function AccessoriesSelector() {
  const accessories = useConfiguratorStore((state) => state.accessories);
  const setAccessory = useConfiguratorStore((state) => state.setAccessory);
  const wallColor = useConfiguratorStore((state) => state.wallColor);

  const accessoryList = [
    {
      key: 'hasBackWall' as const,
      name: 'Full Back Wall',
      shortDesc: 'Branded backdrop',
      price: ACCESSORY_PRICING.backWall,
      description: 'Dye-sublimated backdrop for booth separation and branding.',
    },
    {
      key: 'hasSideWalls' as const,
      name: 'Side Walls (Pair)',
      shortDesc: 'Left + right enclosure',
      price: ACCESSORY_PRICING.sideWalls,
      description: 'Left & right enclosure with heavy-duty Velcro straps.',
    },
    {
      key: 'hasRollerBag' as const,
      name: 'Roller Bag',
      shortDesc: 'All-terrain wheels',
      price: ACCESSORY_PRICING.rollerBag,
      description: 'Reinforced travel bag with all-terrain rubber wheels.',
    },
    {
      key: 'hasSandBags' as const,
      name: 'Sandbags (4-Pack)',
      shortDesc: 'Outdoor ballast',
      price: ACCESSORY_PRICING.sandBags,
      description: 'Outdoor ballast weight bags for wind security.',
    },
  ];

  const wallColorPresets = [
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Onyx Black', hex: '#181A20' },
    { name: 'Navy', hex: '#0F2744' },
    { name: 'Pacific Blue', hex: '#1E6091' },
    { name: 'Crimson Red', hex: '#B91C1C' },
    { name: 'Forest Green', hex: '#14532D' },
    { name: 'Warm Sand', hex: '#E2DDD5' },
    { name: 'Slate', hex: '#334155' },
  ];

  return (
    <div className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
          <PackagePlus className="w-3 h-3 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Accessories & Upgrades
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Tap to add to your order</p>
        </div>
      </div>

      {/* 2-column grid — always */}
      <div className="grid grid-cols-2 gap-2">
        {accessoryList.map((item) => {
          const isChecked = accessories[item.key];

          return (
            <div
              key={item.key}
              onClick={() => setAccessory(item.key, !isChecked)}
              className={`relative p-3 rounded-xl border cursor-pointer transition-all select-none min-h-[72px] active:scale-[0.97] ${
                isChecked
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-500 ring-1 ring-purple-400/30 shadow-sm'
                  : 'bg-white dark:bg-[#151c2c] border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50/20'
              }`}
            >
              {/* Checkbox top-right */}
              <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                isChecked
                  ? 'border-purple-600 bg-purple-600 dark:bg-purple-500 text-white'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
              }`}>
                {isChecked && <Check className="w-2.5 h-2.5" />}
              </div>

              <span className={`block text-xs font-bold pr-6 leading-tight mb-0.5 ${
                isChecked ? 'text-purple-900 dark:text-purple-200' : 'text-slate-900 dark:text-white'
              }`}>
                {item.name}
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1.5">
                {item.shortDesc}
              </span>
              <span className={`block text-xs font-bold font-mono ${
                isChecked ? 'text-purple-700 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'
              }`}>
                +${item.price}
              </span>
            </div>
          );
        })}
      </div>

      {/* Wall Color — only when a wall accessory is active */}
      {(accessories.hasBackWall || accessories.hasSideWalls) && (
        <div className="p-3 sm:p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-600 shadow-sm shrink-0 ring-1 ring-purple-300 dark:ring-purple-800"
                style={{ backgroundColor: wallColor }}
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                Wall Fabric Color
              </span>
            </div>
            <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold shrink-0">Live 3D</span>
          </div>

          {/* Swatches */}
          <div className="flex flex-wrap items-center gap-1.5">
            {wallColorPresets.map((color) => {
              const isSelected = wallColor.toUpperCase() === color.hex.toUpperCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  title={color.name}
                  onClick={() => useConfiguratorStore.getState().setWallColor(color.hex)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'border-purple-600 scale-110 shadow-sm ring-2 ring-purple-400/60'
                      : 'border-slate-300 dark:border-slate-600 hover:scale-105 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        color.hex === '#FFFFFF' || color.hex === '#E2DDD5' ? 'text-slate-900' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}

            {/* Custom Picker */}
            <label
              title="Custom Hex Color"
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-purple-400 cursor-pointer"
            >
              <span>Custom</span>
              <input
                type="color"
                value={wallColor}
                onChange={(e) => useConfiguratorStore.getState().setWallColor(e.target.value)}
                className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
