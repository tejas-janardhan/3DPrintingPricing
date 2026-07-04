import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadAppData, saveAppData } from "./appData";
import { AppStateContext } from "./appStateContext";
import type { AppData, PlateInputs, PricingInputs, ProcessingInputs, Settings } from "@/types";
import { EMPTY_APP_DATA } from "@/config/constants";

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
  const setPlate = useCallback(
    (plate: PlateInputs) => setData((prev) => ({ ...prev, plate })),
    [],
  );
  const setProcessing = useCallback(
    (processing: ProcessingInputs) =>
      setData((prev) => ({ ...prev, processing })),
    [],
  );
  const setPricing = useCallback(
    (pricing: PricingInputs) => setData((prev) => ({ ...prev, pricing })),
    [],
  );
  const importData = useCallback((next: AppData) => setData(next), []);
  const resetData = useCallback(() => setData(EMPTY_APP_DATA), []);

  const value = useMemo(
    () => ({
      data,
      setSettings,
      setPlate,
      setProcessing,
      setPricing,
      importData,
      resetData,
    }),
    [
      data,
      setSettings,
      setPlate,
      setProcessing,
      setPricing,
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
