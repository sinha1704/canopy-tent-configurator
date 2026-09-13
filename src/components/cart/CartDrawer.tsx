import { useCartStore } from '../../store/useCartStore';
import { ShopifyPayloadInspector } from './ShopifyPayloadInspector';
import {
  X,
  ShoppingBag,
  Trash2,
  Code,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { toast } from 'react-toastify';

export function CartDrawer() {
  const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const cartItems = useCartStore((state) => state.cartItems);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const openPayloadInspector = useCartStore((state) => state.openPayloadInspector);

  if (!isDrawerOpen) return null;

  const totalCartAmount = cartItems.reduce((acc, item) => acc + item.unitPrice, 0);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity" onClick={closeDrawer} />

      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-fade-in transition-colors duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c101d]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-wide uppercase">
              Custom Order Review ({cartItems.length})
            </h2>
          </div>

          <button
            onClick={closeDrawer}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-12">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your configuration is empty</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
                Customize your canopy tent surfaces and click "Add to Cart" to stage items.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.properties._manufacturing_ref_id}
                className="p-4 bg-slate-50 dark:bg-[#151c2c] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                      REF: {item.properties._manufacturing_ref_id}
                    </span>
                  </div>

                  <span className="text-sm font-mono font-bold text-blue-700 dark:text-blue-400">
                    ${item.unitPrice.toFixed(2)}
                  </span>
                </div>

                {/* Customized Specs Summary */}
                <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 bg-white dark:bg-[#111827] p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span>Frame Specification:</span>
                    <span className="text-slate-900 dark:text-white font-medium capitalize">{item.properties._frame_type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Printed Panels:</span>
                    <span className="text-slate-900 dark:text-white font-medium">{item.properties._customized_surfaces_count} surfaces</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Included Hardware:</span>
                    <span className="text-slate-900 dark:text-white font-medium truncate max-w-[170px]">{item.properties._accessories}</span>
                  </div>
                </div>

                {/* Actions: Remove & Inspect Shopify Payload */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={openPayloadInspector}
                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>View Line Item Details</span>
                  </button>

                  <button
                    onClick={() => removeCartItem(item.properties._manufacturing_ref_id)}
                    className="flex items-center gap-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-slate-50 dark:bg-[#0c101d] border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Subtotal:</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                ${totalCartAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Full commercial warranty • Free digital proofing</span>
            </div>

            <button
              onClick={() => {
                toast.success('Proceeding to checkout...');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <ShopifyPayloadInspector />
    </>
  );
}
