export type FilamentType = "pla" | "petg";

export type PrinterType = "bambuLabA1";

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
  /** Optional user-given name for the quote; falls back to the customer name. */
  name: string;
  customer: Customer;
  /** Snapshot of settings at creation; the quote is always priced against this. */
  settings: Settings;
  plates: PlateInputs[];
  processing: ProcessingInputs;
  pricing: PricingInputs;
  /** Frozen per-plate cost breakdown, parallel to `plates`, snapshotted on each edit. */
  plateCosts: PlateCosts[];
  /** Frozen pricing breakdown, recomputed and snapshotted on each edit. */
  finalPricing: FinalPricing;
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
  /** Copies of this plate; multiplies the plate cost in the final print cost. Defaults to "1". */
  quantity: string;
};

export type FilamentSettings = {
  costPerHour: string;
  powerConsumption: string;
};

export type PrinterSettings = {
  /** Fixed labour minutes per plate to set up a print. */
  setupTimeMinutes: string;
};

/** Business details shown on the quotation document. */
export type BusinessSettings = {
  name: string;
  address: string;
  contactName: string;
  contactNumber: string;
};

/** Shared hourly/utility costs. */
export type OperatingSettings = {
  labourRate: string;
  electricityCost: string;
};

/** Markup and tax applied to every quote. */
export type PricingSettings = {
  multiplier: string;
  taxPercent: string;
  /** Order value above which an advance is charged; empty/0 means always. */
  advanceThreshold: string;
  /** Percentage of the order value taken as advance when over the threshold. */
  advancePercent: string;
};

/** Seeded into a new quotation's pricing/processing on creation. */
export type DefaultSettings = {
  markup: string;
  shipping: string;
  processingMinutes: string;
};

export type Settings = {
  business: BusinessSettings;
  operating: OperatingSettings;
  pricing: PricingSettings;
  defaults: DefaultSettings;
  byFilament: Record<FilamentType, FilamentSettings>;
  byPrinter: Record<PrinterType, PrinterSettings>;
};

export type FinalPricing = {
  wageCost: number;
  printCost: number;
  lastPrice: number;
  finalCost: number;
  tax: number;
  finalPriceIncShipping: number;
  /** Advance due upfront; 0 when the order value is at/below the threshold. */
  advance: number;
  rsPerGram: number;
};
