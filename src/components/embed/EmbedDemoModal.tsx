import { useState } from 'react';
import { ExternalLink, X, ShoppingCart } from 'lucide-react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useCartStore } from '../../store/useCartStore';

export function EmbedDemoModal() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#embed-demo' || window.location.search.includes('embed=true');
    }
    return false;
  });
  const [logs, setLogs] = useState<string[]>([]);
  const tentSize = useConfiguratorStore((state) => state.tentSize);
  const frameType = useConfiguratorStore((state) => state.frameType);
  const cartItems = useCartStore((state) => state.cartItems);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const simulateSetSize = (size: '5x5' | '6.5x6.5' | '8x8') => {
    window.postMessage({ type: 'SET_TENT_SIZE', size }, '*');
    addLog(`dispatch: SET_TENT_SIZE -> ${size}`);
  };

  const simulateSetFrame = (frame: 'commercial_steel' | 'hex_aluminum_pro') => {
    window.postMessage({ type: 'SET_FRAME_TYPE', frameType: frame }, '*');
    addLog(`dispatch: SET_FRAME_TYPE -> ${frame}`);
  };

  const simulateTriggerCart = () => {
    window.postMessage({ type: 'TRIGGER_CART_ADD' }, '*');
    addLog('dispatch: TRIGGER_CART_ADD');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-200 text-xs transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c101d]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
              <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Shopify Host Window / Iframe Simulator
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                2-way window.postMessage parent event bridge
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-[#151c2c] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] block uppercase tracking-wider">
                Remote Configurator Controls
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['5x5', '6.5x6.5', '8x8'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => simulateSetSize(s)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                      tentSize === s
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    Set {s}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => simulateSetFrame('commercial_steel')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    frameType === 'commercial_steel'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Steel Frame
                </button>
                <button
                  onClick={() => simulateSetFrame('hex_aluminum_pro')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    frameType === 'hex_aluminum_pro'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Hex Aluminum
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#151c2c] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] block uppercase tracking-wider mb-1">
                  Host Checkout Trigger
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Simulates Shopify Liquid parent page triggering checkout.
                </p>
              </div>
              <button
                onClick={simulateTriggerCart}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-all shadow-xs cursor-pointer active:scale-[0.98]"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Trigger Cart Add Event</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold">postMessage Event Dispatch Log:</span>
              <button
                onClick={() => setLogs([])}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Clear log
              </button>
            </div>
            <div className="h-28 bg-white dark:bg-[#070a12] rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 overflow-y-auto font-mono text-[10px] space-y-1 text-slate-700 dark:text-slate-300">
              {logs.length === 0 ? (
                <span className="text-slate-400 italic">No events recorded. Click controls above to test 2-way postMessage communication.</span>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-2.5 bg-slate-50 dark:bg-[#0c101d] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            2-Way Bridge Active
          </span>
          <span className="font-medium">Staged Cart Items: {cartItems.length}</span>
        </div>
      </div>
    </div>
  );
}
