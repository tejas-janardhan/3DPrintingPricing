export type FilamentType = "pla" | "petg";

export type AppData = {
  settings: Settings;
  quotations: Quotation[];
  printerCost: PrinterCostInputs;
};

export type Customer = {
  name: string;
  phone: string;
  /** Optional. */
  address: string;
};

export type Quotation = {
  id: string;
  customer: Customer;
  /** Snapshot of settings at creation; the quote is always priced against this. */
  settings: Settings;
  plates: PlateInputs[];
  processing: ProcessingInputs;
  pricing: PricingInputs;
  /** Final price (inc. shipping) snapshot, refreshed on each edit. */
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type PrinterCostInputs = {
  printerCost: string;
  additionalCost: string;
  hoursPerMonth: string;
  years: string;
  months: string;
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
