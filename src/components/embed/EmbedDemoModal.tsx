import { useState, useEffect } from 'react';
import { ExternalLink, X, ShoppingCart } from 'lucide-react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useCartStore } from '../../store/useCartStore';

export function EmbedDemoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const tentSize = useConfiguratorStore((state) => state.tentSize);
  const frameType = useConfiguratorStore((state) => state.frameType);
  const cartItems = useCartStore((state) => state.cartItems);

  // Check URL param or hash for #embed-demo or ?embed=true
  useEffect(() => {
    if (window.location.hash === '#embed-demo' || window.location.search.includes('embed=true')) {
      setIsOpen(true);
    }
  }, []);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const simulateSetSize = (size: '5x5' | '6.5x6.5' | '8x8') => {
    window.postMessage({ type: 'SET_TENT_SIZE', size }, '*');
    addLog(`Sent postMessage: SET_TENT_SIZE -> ${size}`);
  };

  const simulateSetFrame = (frame: 'commercial_steel' | 'hex_aluminum_pro') => {
    window.postMessage({ type: 'SET_FRAME_TYPE', frameType: frame }, '*');
    addLog(`Sent postMessage: SET_FRAME_TYPE -> ${frame}`);
  };

  const simulateTriggerCart = () => {
    window.postMessage({ type: 'TRIGGER_CART_ADD' }, '*');
    addLog('Sent postMessage: TRIGGER_CART_ADD');
  };

  return (
    <>
      {/* Interactive Embed Simulation Modal (Triggered via #embed-demo) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-slate-200 text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0a0d16]">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white tracking-tight">
                  Shopify Host Window / Iframe Simulator
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Simulates parent host page (e.g. Shopify Liquid Theme or Headless React Storefront) communicating with the Configurator via 2-way <code className="text-blue-300 font-mono">window.postMessage</code> protocol.
              </p>

              {/* Simulation Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-[11px] block uppercase tracking-wider text-slate-400">
                    Host &rarr; Configurator Actions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => simulateSetSize('5x5')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-white rounded text-[11px] font-mono transition-colors"
                    >
                      Set 5x5
                    </button>
                    <button
                      onClick={() => simulateSetSize('6.5x6.5')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-white rounded text-[11px] font-mono transition-colors"
                    >
                      Set 6.5x6.5
                    </button>
                    <button
                      onClick={() => simulateSetSize('8x8')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-white rounded text-[11px] font-mono transition-colors"
                    >
                      Set 8x8
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      onClick={() => simulateSetFrame('commercial_steel')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-white rounded text-[11px] font-mono transition-colors"
                    >
                      Steel Frame
                    </button>
                    <button
                      onClick={() => simulateSetFrame('hex_aluminum_pro')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-white rounded text-[11px] font-mono transition-colors"
                    >
                      Hex Aluminum
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-[11px] block uppercase tracking-wider text-slate-400">
                    Checkout Trigger
                  </span>
                  <button
                    onClick={simulateTriggerCart}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Trigger Remote Add To Cart</span>
                  </button>
                  <div className="text-[10px] text-slate-400 pt-1">
                    Current Size: <strong className="text-white font-mono">{tentSize}</strong> | Frame: <strong className="text-white font-mono">{frameType}</strong>
                  </div>
                </div>
              </div>

              {/* Event Log Console */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>postMessage Event Log:</span>
                  <button
                    onClick={() => setLogs([])}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Clear log
                  </button>
                </div>
                <div className="h-28 bg-[#090d16] rounded-xl border border-slate-800 p-2.5 overflow-y-auto font-mono text-[10px] space-y-1 text-slate-300">
                  {logs.length === 0 ? (
                    <span className="text-slate-500 italic">No events recorded yet. Click actions above to dispatch messages.</span>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="text-emerald-400">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-2.5 bg-[#0a0d16] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                2-Way Bridge Ready
              </span>
              <span>Cart Count: {cartItems.length}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
