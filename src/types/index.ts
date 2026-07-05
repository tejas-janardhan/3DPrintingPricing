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
  plates: PlateInputs[];
  processing: ProcessingInputs;
  pricing: PricingInputs;
  /**
   * Final price (inc. shipping) as computed the last time this quotation was
   * edited — a snapshot, so later changes to global settings don't retroactively
   * move a quoted price. Refreshed on every edit of the quotation itself.
   */
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
