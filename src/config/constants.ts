import type { AppData, FilamentType, PlateInputs, PricingInputs, ProcessingInputs, Settings } from "@/types";

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
  markup: "",
  taxPercent: "",
  byFilament: {
    pla: { costPerHour: "", powerConsumption: "" },
    petg: { costPerHour: "", powerConsumption: "" },
  },
};

export const EMPTY_PLATE: PlateInputs = {
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
  shipping: "",
};

export const EMPTY_APP_DATA: AppData = {
  settings: EMPTY_SETTINGS,
  plate: EMPTY_PLATE,
  processing: EMPTY_PROCESSING,
  pricing: EMPTY_PRICING,
};


export const SETUP_TIME_MINUTES = 5;