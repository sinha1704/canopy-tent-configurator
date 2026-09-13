import { useState, useEffect } from 'react';
import { Header } from './components/ui/Header';
import { Scene } from './components/3d/Scene';
import { ViewportControls } from './components/3d/ViewportControls';
import { SurfaceSelector } from './components/2d/SurfaceSelector';
import { CanvasEditor } from './components/2d/CanvasEditor';
import { SizeSelector } from './components/configurator/SizeSelector';
import { FrameSelector } from './components/configurator/FrameSelector';
import { AccessoriesSelector } from './components/configurator/AccessoriesSelector';
import { SummaryPricingBar } from './components/configurator/SummaryPricingBar';
import { CartDrawer } from './components/cart/CartDrawer';
import { IframeBridgeModal } from './components/embed/IframeBridge';
import { EmbedDemoModal } from './components/embed/EmbedDemoModal';
import { Quick3DColorBar } from './components/3d/Quick3DColorBar';
import { useThemeStore } from './store/useThemeStore';
import { Layers, Settings2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'surfaces' | 'hardware'>('surfaces');
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
      <Header />

      {/* Main Workspace: stacked on mobile, side-by-side on desktop */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative min-h-0">
        {/* 3D WebGL Viewport — taller on mobile for better preview */}
        <section className={`relative w-full md:w-1/2 lg:w-7/12 h-[45vh] sm:h-[48vh] md:h-full flex flex-col overflow-hidden ${theme === 'dark' ? 'studio-canvas-dark' : 'studio-canvas-light'} md:border-r border-b md:border-b-0 border-slate-200 dark:border-slate-800 shrink-0`}>
          <ViewportControls />
          <Quick3DColorBar />

          {/* Interactive Three.js R3F Canvas */}
          <div className="w-full h-full relative">
            <Scene />

            {/* Bottom 3D Helper Tip — hidden on smallest screens to save space */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 dark:bg-black/80 backdrop-blur-md text-white text-[11px] font-medium shadow-md border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Drag to rotate 360° • Scroll to zoom • Click panel to customize</span>
            </div>

            {/* Mobile touch hint — only on xs screens */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex sm:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/75 dark:bg-black/75 backdrop-blur-md text-white text-[10px] font-medium border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Drag to rotate • Pinch to zoom</span>
            </div>
          </div>
        </section>

        {/* Configurator Dock — takes remaining height on mobile */}
        <section className="w-full md:w-1/2 lg:w-5/12 flex-1 md:h-full flex flex-col bg-white dark:bg-[#111827] z-10 shadow-sm overflow-hidden border-l border-slate-200 dark:border-slate-800 transition-colors duration-200 min-h-0">
          {/* Navigation Tabs */}
          <div className="flex items-stretch border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-2 sm:px-5 pt-1.5 sm:pt-3 gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('surfaces')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-2 pb-3 sm:pb-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'surfaces'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 rounded-t-xl'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-xl'
              }`}
            >
              <div className={`w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                activeTab === 'surfaces' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                1
              </div>
              <Layers className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Design & Print</span>
            </button>

            <button
              onClick={() => setActiveTab('hardware')}
              className={`flex-1 flex items-center justify-center gap-2 sm:gap-2 pb-3 sm:pb-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'hardware'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 rounded-t-xl'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-t-xl'
              }`}
            >
              <div className={`w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                activeTab === 'hardware' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                2
              </div>
              <Settings2 className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Size & Hardware</span>
            </button>
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-5 space-y-3.5 sm:space-y-6 bg-slate-50/70 dark:bg-[#0c101d] min-h-0">
            {activeTab === 'surfaces' ? (
              <>
                <SurfaceSelector />
                <CanvasEditor />
              </>
            ) : (
              <>
                <SizeSelector />
                <FrameSelector />
                <AccessoriesSelector />
              </>
            )}
            {/* Bottom breathing room for pricing bar on mobile */}
            <div className="h-1 md:hidden" />
          </div>

          {/* Sticky Pricing & Cart Action Bar */}
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shrink-0 safe-area-inset-bottom">
            <SummaryPricingBar />
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Iframe / Embed Bridge */}
      <IframeBridgeModal />

      {/* Embed Demo Modal */}
      <EmbedDemoModal />
    </div>
  );
}


export default App;
