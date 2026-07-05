import { createContext, useContext } from "react";
import type {
  AppData,
  PrinterCostInputs,
  Quotation,
  Settings,
} from "@/types";

/** Fields of a quotation the user can edit; id/timestamps/finalPrice are managed. */
export type QuotationPatch = Partial<
  Pick<Quotation, "customer" | "plates" | "processing" | "pricing">
>;

export type AppStateContextValue = {
  data: AppData;
  setSettings: (settings: Settings) => void;
  setPrinterCost: (printerCost: PrinterCostInputs) => void;
  /** Creates a new empty quotation (snapshotting current settings); returns its id. */
  addQuotation: () => string;
  /** Copies a quotation under current settings; returns the new id (or null if not found). */
  duplicateQuotation: (id: string) => string | null;
  /** Merges a patch into a quotation and refreshes its finalPrice snapshot. */
  updateQuotation: (id: string, patch: QuotationPatch) => void;
  deleteQuotation: (id: string) => void;
  /** Replace all data, e.g. after importing a backup. */
  importData: (data: AppData) => void;
  /** Clear everything back to empty defaults. */
  resetData: () => void;
};

export const AppStateContext = createContext<AppStateContextValue | null>(null);

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return ctx;
}
