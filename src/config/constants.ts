import type { AppData, Customer, FilamentType, FinalPricing, PlateInputs, PricingInputs, PrinterCostInputs, ProcessingInputs, Settings } from "@/types";

export type { FilamentType } from "@/types";

export const FILAMENT_TYPE_OPTIONS: { label: string; value: FilamentType }[] = [
  { label: "PLA", value: "pla" },
  { label: "PETG", value: "petg" },
];

export const FILAMENT_PRICE_OPTIONS: Record<
  FilamentType,
  { label: string; value: number }[]
> = {
  pla: [
    { label: "Rs 950 (JAMG HE)", value: 950 },
    { label: "Rs 800 (Numakers)", value: 800 },
  ],
  petg: [{ label: "Rs 1050 (JAMG HE)", value: 1050 }],
};

export const EMPTY_SETTINGS: Settings = {
  labourRate: "",
  electricityCost: "",
  multiplier: "",
  taxPercent: "",
  byFilament: {
    pla: { costPerHour: "", powerConsumption: "" },
    petg: { costPerHour: "", powerConsumption: "" },
  },
};

export const EMPTY_PLATE: PlateInputs = {
  id: "plate-1",
  name: "Plate",
  filamentType: "pla",
  filamentPrice: "",
  printTimeHours: "",
  printTimeMinutes: "",
  printWeight: "",
};

export const EMPTY_PROCESSING: ProcessingInputs = {
  processingMinutes: "",
  postProcessingHours: "",
  postProcessingMinutes: "",
  partsCost: "",
};

export const EMPTY_PRICING: PricingInputs = {
  markup: "",
  shipping: "",
};

export const EMPTY_PRINTER_COST: PrinterCostInputs = {
  printerCost: "",
  additionalCost: "",
  hoursPerMonth: "",
  years: "",
  months: "",
};

export const EMPTY_CUSTOMER: Customer = {
  name: "",
  phone: "",
  address: "",
};

export const EMPTY_FINAL_PRICING: FinalPricing = {
  wageCost: 0,
  printCost: 0,
  lastPrice: 0,
  finalCost: 0,
  tax: 0,
  finalPriceIncShipping: 0,
  rsPerGram: 0,
};

export const EMPTY_APP_DATA: AppData = {
  settings: EMPTY_SETTINGS,
  quotations: [],
  printerCost: EMPTY_PRINTER_COST,
};


export const SETUP_TIME_MINUTES = 5;
export const MONITORING_RATE = 0.05; // percent of the print time spent monitoring.

// Maximum number of plates a user can add.
export const MAX_PLATES = 10;

// How often to remind the user to back up when there are unsaved changes.
export const BACKUP_REMINDER_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes