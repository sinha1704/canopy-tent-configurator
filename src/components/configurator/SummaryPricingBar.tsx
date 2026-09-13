import { usePricingStore } from '../../store/usePricingStore';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useCartStore } from '../../store/useCartStore';
import {
  Loader2,
  ShoppingBag,
  FileText,
  CheckCircle2,
  ArrowRight,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { exportManufacturingSpecSheetPDF } from '../pdf/SpecSheetGenerator';
import confetti from 'canvas-confetti';

import { getThreeCanvasSnapshot } from '../../utils/snapshotHelper';
import { useState } from 'react';
import { toast } from 'react-toastify';

export function SummaryPricingBar() {
  const { pricing, isLoading } = usePricingStore();
  const configurator = useConfiguratorStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleAddToCart = () => {
    confetti({
      particleCount: 70,
      spread: 55,
      origin: { y: 0.85 }
    });

    const snapshotUrl = getThreeCanvasSnapshot('image/jpeg', 0.8) || '';
    addToCart(snapshotUrl);
    toast.success('Custom tent configuration added to cart!');
  };

  const handleExportPDF = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      await exportManufacturingSpecSheetPDF({
        configurator,
        pricing
      });
      toast.success('Manufacturing Spec Sheet downloaded successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Could not generate PDF cut-sheet. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="transition-colors duration-200">

      {showBreakdown && (
        <div className="px-3 pt-2.5 pb-2 space-y-1 text-[11px] border-b border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Tent & Frame ({configurator.tentSize})</span>
            <span className="font-semibold text-slate-900 dark:text-white">${pricing.basePrice.toFixed(2)}</span>
          </div>
          {pricing.frameSurcharge > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Hex Aluminum Pro</span>
              <span className="font-semibold text-slate-900 dark:text-white">+${pricing.frameSurcharge.toFixed(2)}</span>
            </div>
          )}
          {pricing.accessoriesCost > 0 && (
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Accessories</span>
              <span className="font-semibold text-slate-900 dark:text-white">+${pricing.accessoriesCost.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>
              Custom Printing
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium">
                {pricing.printLocationsCount <= 2 ? '2 incl.' : `${pricing.printLocationsCount} panels`}
              </span>
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {pricing.customPrintFee === 0 ? 'Free' : `+$${pricing.customPrintFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Est. Tax (8.25%)</span>
            <span className="font-medium">${pricing.estimatedTax.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex flex-col justify-center min-w-0 cursor-pointer group flex-shrink-0"
          title={showBreakdown ? 'Hide breakdown' : 'View price breakdown'}
        >
          <div className="flex items-center gap-0.5 text-[10px] text-slate-500 dark:text-slate-400 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <span>Est. Total</span>
            {showBreakdown
              ? <ChevronDown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              : <ChevronUp className="w-3 h-3 text-blue-500 dark:text-blue-400" />}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              ${pricing.total.toFixed(2)}
            </span>
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />}
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
            <CheckCircle2 className="w-2.5 h-2.5" />
            {pricing.estimatedLeadDays}-Day Lead
          </span>
        </button>

        <div className="flex gap-1.5 flex-1 justify-end">
          <button
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            title="Export Manufacturing Spec Sheet PDF"
            className="flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2 sm:py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition-all active:scale-[0.97] disabled:opacity-60 cursor-pointer whitespace-nowrap"
          >
            {isExportingPdf
              ? <Loader2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
              : <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
            <span className="hidden xs:inline sm:inline">PDF</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-all shadow-sm active:scale-[0.97] cursor-pointer whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>Add to Cart</span>
            <ArrowRight className="w-3 h-3 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
