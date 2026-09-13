import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Palette, Check, ChevronDown, ChevronUp, Droplets, X } from 'lucide-react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { BRAND_COLOR_PALETTES } from '../../constants/configurator';
import { toast } from 'react-toastify';

export function Quick3DColorBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [colorTarget, setColorTarget] = useState<'canopy' | 'walls' | 'frame'>('canopy');
  const [popupMaxHeight, setPopupMaxHeight] = useState<number>(280);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeSurfaceId = useConfiguratorStore((state) => state.activeSurfaceId);
  const baseCanopyColor = useConfiguratorStore((state) => state.baseCanopyColor);
  const wallColor = useConfiguratorStore((state) => state.wallColor);
  const frameColor = useConfiguratorStore((state) => state.frameColor);
  const setAllSurfacesColor = useConfiguratorStore((state) => state.setAllSurfacesColor);
  const setWallColor = useConfiguratorStore((state) => state.setWallColor);
  const setFrameColor = useConfiguratorStore((state) => state.setFrameColor);
  const applyCanopyTheme = useConfiguratorStore((state) => state.applyCanopyTheme);
  const accessories = useConfiguratorStore((state) => state.accessories);
  const setAccessory = useConfiguratorStore((state) => state.setAccessory);
  const activeSurface = useConfiguratorStore((state) => state.surfaces[activeSurfaceId]);

  const currentColor =
    colorTarget === 'canopy'
      ? (activeSurface?.backgroundColor || baseCanopyColor)
      : colorTarget === 'walls'
      ? wallColor
      : frameColor;

  // ── Click-outside to close ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // ── Compute max popup height precisely from button + section position ────
  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const computeHeight = () => {
      const btn = buttonRef.current;
      if (!btn) return;

      // Find the 3D section — walk up from the button to a `section` element
      let section: HTMLElement | null = btn.parentElement;
      while (section && section.tagName.toLowerCase() !== 'section') {
        section = section.parentElement;
      }

      const btnRect = btn.getBoundingClientRect();

      // Use the actual section's bottom boundary if found, otherwise fall back
      const sectionBottom = section
        ? section.getBoundingClientRect().bottom
        : window.innerHeight * 0.45 + 48; // header (~48px) + 45vh

      // Available space = section bottom - button bottom - 12px safety margin
      const available = sectionBottom - btnRect.bottom - 12;
      setPopupMaxHeight(Math.max(available, 140));
    };

    computeHeight();
    window.addEventListener('resize', computeHeight);
    return () => window.removeEventListener('resize', computeHeight);
  }, [isOpen]);

  const handleSelectColor = (hex: string, name: string) => {
    if (colorTarget === 'frame') {
      setFrameColor(hex);
      toast.success(`Leg sticks & frame color updated to ${name}!`, { autoClose: 1800 });
    } else if (colorTarget === 'walls') {
      setWallColor(hex);
      if (!accessories.hasBackWall && !accessories.hasSideWalls) {
        setAccessory('hasBackWall', true);
      }
      toast.success(`Wall fabric color updated to ${name}!`, { autoClose: 1800 });
    } else {
      setAllSurfacesColor(hex);
      toast.success(`Canopy 3D color updated to ${name}!`, { autoClose: 1800 });
    }
  };

  const handleCustomColor = (hex: string) => {
    if (colorTarget === 'frame') {
      setFrameColor(hex);
    } else if (colorTarget === 'walls') {
      setWallColor(hex);
      if (!accessories.hasBackWall && !accessories.hasSideWalls) {
        setAccessory('hasBackWall', true);
      }
    } else {
      setAllSurfacesColor(hex);
    }
  };

  const canopyThemes = [
    { name: 'Pure White', peak: '#FFFFFF', valance: '#FFFFFF', preview: ['#FFFFFF', '#FFFFFF'] },
    { name: 'Pitch Black', peak: '#111317', valance: '#111317', preview: ['#111317', '#111317'] },
    { name: 'Navy Commercial', peak: '#0B2545', valance: '#FFFFFF', preview: ['#0B2545', '#FFFFFF'] },
    { name: 'Royal Crimson', peak: '#B91C1C', valance: '#111317', preview: ['#B91C1C', '#111317'] },
    { name: 'Forest Green', peak: '#14532D', valance: '#FFFFFF', preview: ['#14532D', '#FFFFFF'] },
    { name: 'Solar Amber', peak: '#D97706', valance: '#111317', preview: ['#D97706', '#111317'] },
  ];

  const targetLabel =
    colorTarget === 'canopy' ? 'Canopy Fabric' : colorTarget === 'walls' ? 'Wall Fabric' : 'Leg Sticks';

  return (
    <div
      ref={containerRef}
      className="absolute top-13 sm:top-14 left-2.5 z-20 pointer-events-auto w-[min(calc(100vw-20px),340px)] sm:w-auto sm:max-w-sm"
    >
      {/* ── Toggle Button ──────────────────────────────────────────────────── */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#111827]/95 hover:bg-white dark:hover:bg-[#111827] backdrop-blur-md border border-slate-200/80 dark:border-slate-700 shadow-sm text-xs font-semibold text-slate-800 dark:text-slate-100 transition-all hover:border-blue-300 dark:hover:border-blue-700 active:scale-95 cursor-pointer"
      >
        <div
          className="w-4 h-4 rounded-full border-2 border-white dark:border-slate-600 shadow-sm shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
          style={{ backgroundColor: currentColor }}
        />
        <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
        <span>Fabric Color</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        )}
      </button>

      {/* ── Color Studio Panel ─────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="mt-2 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 text-xs flex flex-col overflow-hidden"
          style={{ maxHeight: popupMaxHeight }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-3 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-slate-900 dark:text-white">3D Color Studio</span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                — {targetLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {currentColor}
              </span>
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                title="Close color studio"
                className="w-5 h-5 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="overflow-y-auto overscroll-contain flex-1 px-3 py-2.5 space-y-3">
            {/* Target Selector */}
            <div className="grid grid-cols-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 p-0.5 text-[11px] font-semibold">
              {(['canopy', 'walls', 'frame'] as const).map((target) => {
                const labels = { canopy: 'Canopy', walls: 'Walls', frame: '4 Leg Sticks' };
                const activeColors = {
                  canopy: 'text-blue-600 dark:text-blue-400',
                  walls: 'text-purple-600 dark:text-purple-400',
                  frame: 'text-emerald-600 dark:text-emerald-400',
                };
                return (
                  <button
                    key={target}
                    onClick={() => setColorTarget(target)}
                    className={`py-1 px-1 rounded-md transition-all cursor-pointer text-center truncate ${
                      colorTarget === target
                        ? `bg-white dark:bg-[#151c2c] shadow-2xs ${activeColors[target]}`
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {labels[target]}
                  </button>
                );
              })}
            </div>

            {/* Color Swatches */}
            <div>
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Select color:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {BRAND_COLOR_PALETTES.map((color) => {
                  const isSelected = currentColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.hex}
                      onClick={() => handleSelectColor(color.hex, color.name)}
                      title={`${color.name} (${color.hex})`}
                      className={`w-7 h-7 rounded-lg border transition-all relative flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-blue-600 scale-110 border-white shadow-md'
                          : 'border-slate-300 dark:border-slate-600 hover:scale-105 hover:border-slate-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 drop-shadow-md ${
                            color.isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}

                {/* Custom Color Picker */}
                <label
                  className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer transition-colors shadow-2xs"
                  title="Choose custom HEX color for 3D model"
                >
                  <Droplets className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Custom</span>
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleCustomColor(e.target.value)}
                    className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                </label>
              </div>
            </div>

            {/* Dual-Tone Event Themes */}
            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Dual-Tone Event Themes:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {canopyThemes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => {
                      applyCanopyTheme(theme.peak, theme.valance);
                      toast.success(`Applied ${theme.name} theme to 3D model!`, { autoClose: 1800 });
                    }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left cursor-pointer"
                  >
                    <div className="flex -space-x-1 shrink-0">
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs"
                        style={{ backgroundColor: theme.preview[0] }}
                      />
                      <span
                        className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs"
                        style={{ backgroundColor: theme.preview[1] }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Apply to All Button */}
            <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Coloring mode:</span>
              <button
                onClick={() =>
                  handleSelectColor(
                    currentColor,
                    colorTarget === 'walls' ? 'All Walls' : 'All Panels'
                  )
                }
                className={`px-2 py-1 text-[10px] font-bold text-white rounded-lg transition-all cursor-pointer ${
                  colorTarget === 'walls'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : colorTarget === 'frame'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {colorTarget === 'walls'
                  ? 'Apply to All Walls'
                  : colorTarget === 'frame'
                  ? 'Apply to 4 Sticks'
                  : 'Apply to All 8 Panels'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
