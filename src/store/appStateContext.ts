import { createContext, useContext } from "react";
import type {
  AppData,
  PlateInputs,
  PricingInputs,
  ProcessingInputs,
  Settings,
} from "@/types";

export type AppStateContextValue = {
  data: AppData;
  setSettings: (settings: Settings) => void;
  setPlates: (plates: PlateInputs[]) => void;
  setProcessing: (processing: ProcessingInputs) => void;
  setPricing: (pricing: PricingInputs) => void;
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
