import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadAppData, saveAppData } from "./appData";
import { AppStateContext, type QuotationPatch } from "./appStateContext";
import type { AppData, PrinterCostInputs, Quotation, Settings } from "@/types";
import { EMPTY_APP_DATA } from "@/config/constants";
import { computeFinalPricing } from "@/lib/pricing";
import { makeQuotation } from "@/lib/quotations";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData());

  // Autosave to localStorage whenever the data changes.
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const setSettings = useCallback(
    (settings: Settings) => setData((prev) => ({ ...prev, settings })),
    [],
  );
  const setPrinterCost = useCallback(
    (printerCost: PrinterCostInputs) =>
      setData((prev) => ({ ...prev, printerCost })),
    [],
  );

  const addQuotation = useCallback(() => {
    const quotation = makeQuotation();
    setData((prev) => ({
      ...prev,
      quotations: [quotation, ...prev.quotations],
    }));
    return quotation.id;
  }, []);

  const updateQuotation = useCallback((id: string, patch: QuotationPatch) => {
    setData((prev) => ({
      ...prev,
      quotations: prev.quotations.map((quotation) => {
        if (quotation.id !== id) return quotation;
        const next: Quotation = { ...quotation, ...patch };
        // Snapshot the price against the settings in effect at edit time.
        const { finalPriceIncShipping } = computeFinalPricing({
          settings: prev.settings,
          processing: next.processing,
          plates: next.plates,
          pricing: next.pricing,
        });
        next.finalPrice = finalPriceIncShipping;
        next.updatedAt = new Date().toISOString();
        return next;
      }),
    }));
  }, []);

  const deleteQuotation = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      quotations: prev.quotations.filter((quotation) => quotation.id !== id),
    }));
  }, []);

  const importData = useCallback((next: AppData) => setData(next), []);
  const resetData = useCallback(() => setData(EMPTY_APP_DATA), []);

  const value = useMemo(
    () => ({
      data,
      setSettings,
      setPrinterCost,
      addQuotation,
      updateQuotation,
      deleteQuotation,
      importData,
      resetData,
    }),
    [
      data,
      setSettings,
      setPrinterCost,
      addQuotation,
      updateQuotation,
      deleteQuotation,
      importData,
      resetData,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}
