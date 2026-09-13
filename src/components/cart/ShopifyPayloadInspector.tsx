import { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { X, Copy, Check, ShoppingBag, ShieldCheck } from 'lucide-react';

export function ShopifyPayloadInspector() {
  const isPayloadInspectorOpen = useCartStore((state) => state.isPayloadInspectorOpen);
  const closePayloadInspector = useCartStore((state) => state.closePayloadInspector);
  const activePayload = useCartStore((state) => state.activePayload);
  const buildShopifyGraphQLMutation = useCartStore((state) => state.buildShopifyGraphQLMutation);

  const [activeTab, setActiveTab] = useState<'structured' | 'cart_js' | 'storefront_graphql'>('structured');
  const [copied, setCopied] = useState(false);

  if (!isPayloadInspectorOpen || !activePayload) return null;

  // Clean real line item data for Shopify theme / Storefront GraphQL
  const cartJsPayload = {
    id: activePayload.variantId,
    quantity: activePayload.quantity,
    properties: activePayload.properties
  };

  const graphQLPayload = buildShopifyGraphQLMutation(activePayload);

  const rawCodeString =
    activeTab === 'storefront_graphql'
      ? graphQLPayload
      : JSON.stringify(cartJsPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCodeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={closePayloadInspector}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0c101d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  Shopify Cart Integration Spec
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Ready for Checkout
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Exact line item attributes generated for your Storefront Cart API
              </p>
            </div>
          </div>

          <button
            onClick={closePayloadInspector}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-100/60 dark:bg-[#0f1422] border-b border-slate-200 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-1.5 p-0.5 bg-slate-200/70 dark:bg-slate-800/70 rounded-lg">
            <button
              onClick={() => setActiveTab('structured')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'structured'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Summary View
            </button>
            <button
              onClick={() => setActiveTab('cart_js')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'cart_js'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              /cart/add.js (JSON)
            </button>
            <button
              onClick={() => setActiveTab('storefront_graphql')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'storefront_graphql'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              GraphQL Mutation
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer active:scale-95 ml-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Payload</span>
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-[#0a0d16]">
          {activeTab === 'structured' ? (
            /* Human-Designed Structured Spec Table */
            <div className="space-y-4">
              {/* Product Overview Card */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#151c2c] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Product Variant
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {activePayload.title}
                  </h4>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    SKU: {activePayload.sku}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Unit Total</span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    ${activePayload.unitPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Line Item Properties Grid */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151c2c] overflow-hidden shadow-xs">
                <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Shopify Line Item Properties (Custom Attributes)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {Object.keys(activePayload.properties).length} fields
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {Object.entries(activePayload.properties).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-1 sm:gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-medium shrink-0">
                        {key}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium text-right break-all">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Code View (Theme-matched, cleanly formatted) */
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070a12] p-4 font-mono text-xs overflow-x-auto shadow-inner">
              <pre className="text-slate-800 dark:text-blue-200 leading-relaxed whitespace-pre-wrap selection:bg-blue-600 selection:text-white">
                {rawCodeString}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white dark:bg-[#0c101d] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Storefront API 2024-01 Compatible</span>
          </div>
          <button
            onClick={closePayloadInspector}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
