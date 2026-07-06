import type { AppData, Customer, FilamentType, FinalPricing, PlateInputs, PricingInputs, PrinterCostInputs, PrinterType, ProcessingInputs, Settings } from "@/types";

export type { FilamentType } from "@/types";

export const FILAMENT_TYPE_OPTIONS: { label: string; value: FilamentType }[] = [
  { label: "PLA", value: "pla" },
  { label: "PETG", value: "petg" },
];

export const PRINTER_TYPE_OPTIONS: { label: string; value: PrinterType }[] = [
  { label: "Bambu Lab A1", value: "bambuLabA1" },
];

// Only one printer for now; pricing uses this printer's setup time.
export const DEFAULT_PRINTER_TYPE: PrinterType = "bambuLabA1";

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
  business: { name: "", address: "", contactName: "", contactNumber: "" },
  operating: { labourRate: "", electricityCost: "" },
  pricing: {
    multiplier: "",
    taxPercent: "",
    advanceThreshold: "",
    advancePercent: "",
  },
  defaults: { markup: "", shipping: "", processingMinutes: "" },
  byFilament: {
    pla: { costPerHour: "", powerConsumption: "" },
    petg: { costPerHour: "", powerConsumption: "" },
  },
  byPrinter: {
    bambuLabA1: { setupTimeMinutes: "" },
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
  quantity: "1",
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
  advance: 0,
  rsPerGram: 0,
};

export const EMPTY_APP_DATA: AppData = {
  settings: EMPTY_SETTINGS,
  quotations: [],
  printerCost: EMPTY_PRINTER_COST,
};


export const MONITORING_RATE = 0.05; // percent of the print time spent monitoring.

// Maximum number of plates a user can add.
export const MAX_PLATES = 10;

// How often to remind the user to back up when there are unsaved changes.
export const BACKUP_REMINDER_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes