import { useCartStore } from '../../store/useCartStore';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ShoppingBag, ShieldCheck, Sun, Moon } from 'lucide-react';

export function Header() {
  const cartItems = useCartStore((state) => state.cartItems);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const tentSize = useConfiguratorStore((state) => state.tentSize);
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="h-12 sm:h-14 md:h-16 px-3 sm:px-5 lg:px-8 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-30 shrink-0 select-none shadow-xs transition-colors duration-200">
      {/* Brand Identity */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 dark:from-blue-600 dark:to-indigo-400 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0 border border-white/20">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 9l2 12h16l2-12L12 2z" />
              <path d="M12 2v19" />
              <path d="M7 10l5 2 5-2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Apex Pro Canopy
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="hidden sm:inline text-xs font-medium text-slate-600 dark:text-slate-300">
                Custom Canopy Tent ({tentSize})
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px h-4 bg-slate-200 dark:bg-slate-800" />

        {/* Commercial Quality Badge — desktop only */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Commercial Dye-Sublimation Print • Proof Included</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Dark / Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle dark/light theme"
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="hidden md:inline text-[11px]">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span className="hidden md:inline text-[11px]">Dark</span>
            </>
          )}
        </button>

        {/* Cart Button */}
        <button
          onClick={openDrawer}
          className="relative flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline sm:hidden">Cart</span>
          <span className="hidden sm:inline">Review Order</span>
          {cartItems.length > 0 && (
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs flex items-center justify-center font-bold shadow-xs">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

