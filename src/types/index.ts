export type FilamentType = "pla" | "petg";

export type AppData = {
  settings: Settings;
  plates: PlateInputs[];
  processing: ProcessingInputs;
  pricing: PricingInputs;
};

export type PlateCosts = {
  materialCost: number;
  monitoringCost: number;
  printUsageCost: number;
  electricityCost: number;
  plateCost: number;
};

export type PricingInputs = {
  markup: string;
  shipping: string;
};

export type ProcessingInputs = {
  processingMinutes: string;
  postProcessingHours: string;
  postProcessingMinutes: string;
  partsCost: string;
};

export type PlateInputs = {
  id: string;
  name: string;
  filamentType: FilamentType;
  filamentPrice: string;
  printTimeHours: string;
  printTimeMinutes: string;
  printWeight: string;
};

export type FilamentSettings = {
  costPerHour: string;
  powerConsumption: string;
};

export type Settings = {
  labourRate: string;
  electricityCost: string;
  multiplier: string;
  taxPercent: string;
  byFilament: Record<FilamentType, FilamentSettings>;
};

export type FinalPricing = {
  wageCost: number;
  printCost: number;
  lastPrice: number;
  finalCost: number;
  tax: number;
  finalPriceIncShipping: number;
};
