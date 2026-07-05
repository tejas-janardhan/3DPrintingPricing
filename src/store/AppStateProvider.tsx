import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadAppData, saveAppData } from "./appData";
import { AppStateContext, type QuotationPatch } from "./appStateContext";
import type { AppData, PrinterCostInputs, Quotation, Settings } from "@/types";
import { EMPTY_APP_DATA } from "@/config/constants";
import { computeFinalPricing } from "@/lib/pricing";
import { duplicateQuotation, makeQuotation } from "@/lib/quotations";

/** finalPrice snapshot from a quotation's own settings. */
function pricedQuotation(quotation: Quotation): Quotation {
  const { finalPriceIncShipping } = computeFinalPricing({
    settings: quotation.settings,
    processing: quotation.processing,
    plates: quotation.plates,
    pricing: quotation.pricing,
  });
  return { ...quotation, finalPrice: finalPriceIncShipping };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadAppData());

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  // Latest data for callbacks that need current settings without re-subscribing.
  const dataRef = useRef(data);
  dataRef.current = data;

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
    const quotation = makeQuotation(dataRef.current.settings);
    setData((prev) => ({
      ...prev,
      quotations: [quotation, ...prev.quotations],
    }));
    return quotation.id;
  }, []);

  const duplicate = useCallback((id: string) => {
    const source = dataRef.current.quotations.find((q) => q.id === id);
    if (!source) return null;
    const copy = pricedQuotation(
      duplicateQuotation(source, dataRef.current.settings),
    );
    setData((prev) => ({
      ...prev,
      quotations: [copy, ...prev.quotations],
    }));
    return copy.id;
  }, []);

  const updateQuotation = useCallback((id: string, patch: QuotationPatch) => {
    setData((prev) => ({
      ...prev,
      quotations: prev.quotations.map((quotation) =>
        quotation.id === id
          ? pricedQuotation({
              ...quotation,
              ...patch,
              updatedAt: new Date().toISOString(),
            })
          : quotation,
      ),
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
      duplicateQuotation: duplicate,
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
      duplicate,
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
