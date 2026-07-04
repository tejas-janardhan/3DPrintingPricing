import type { FilamentType } from "@/config/constants";

export type FilamentSettings = {
  costPerHour: string;
  powerConsumption: string;
};

export type Settings = {
  labourRate: string;
  electricityCost: string;
  multiplier: string;
  markup: string;
  taxPercent: string;
  byFilament: Record<FilamentType, FilamentSettings>;
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

export type PlateInputs = {
  filamentType: FilamentType;
  filamentPrice: string;
  printTimeHours: string;
  printTimeMinutes: string;
  printWeight: string;
};

export const EMPTY_PLATE: PlateInputs = {
  filamentType: "pla",
  filamentPrice: "",
  printTimeHours: "",
  printTimeMinutes: "",
  printWeight: "",
};

export type ProcessingInputs = {
  processingMinutes: string;
  postProcessingHours: string;
  postProcessingMinutes: string;
  partsCost: string;
};

export const EMPTY_PROCESSING: ProcessingInputs = {
  processingMinutes: "",
  postProcessingHours: "",
  postProcessingMinutes: "",
  partsCost: "",
};

export type PricingInputs = {
  shipping: string;
};

export const EMPTY_PRICING: PricingInputs = {
  shipping: "",
};

export const SETUP_TIME_MINUTES = 5;

export const num = (value: string) => Number(value) || 0;

export const formatRs = (value: number) => `Rs ${value.toFixed(2)}`;

export type PlateCosts = {
  materialCost: number;
  monitoringCost: number;
  printUsageCost: number;
  electricityCost: number;
  plateCost: number;
};

export function computePlateCost(
  settings: Settings,
  plate: PlateInputs,
): PlateCosts {
  const totalPrintHours =
    num(plate.printTimeHours) + num(plate.printTimeMinutes) / 60;
  const plateCostPerHour = num(
    settings.byFilament[plate.filamentType].costPerHour,
  );

  const materialCost = Math.ceil(
    (num(plate.printWeight) * num(plate.filamentPrice)) / 1000,
  );
  const monitoringCost = Math.ceil(
    num(settings.labourRate) *
      (0.05 * totalPrintHours + SETUP_TIME_MINUTES / 60),
  );
  const printUsageCost = Math.ceil(totalPrintHours * plateCostPerHour);
  const electricityCost = Math.ceil(
    (totalPrintHours *
      num(settings.byFilament[plate.filamentType].powerConsumption) *
      num(settings.electricityCost)) /
      1000,
  );
  const plateCost = Math.ceil(
    (materialCost + monitoringCost + printUsageCost + electricityCost) *
      num(settings.multiplier),
  );

  return {
    materialCost,
    monitoringCost,
    printUsageCost,
    electricityCost,
    plateCost,
  };
}

export type FinalPricing = {
  wageCost: number;
  printCost: number;
  lastPrice: number;
  finalCost: number;
  tax: number;
  finalPriceIncShipping: number;
};

export function computeFinalPricing({
  settings,
  processing,
  plate,
  pricing,
}: {
  settings: Settings;
  processing: ProcessingInputs;
  plate: PlateInputs;
  pricing: PricingInputs;
}): FinalPricing {
  console.log({ pricing });

  const { plateCost } = computePlateCost(settings, plate);

  const processingHours =
    num(processing.processingMinutes) / 60 +
    num(processing.postProcessingHours) +
    num(processing.postProcessingMinutes) / 60;

  const wageCost = Math.ceil(processingHours * num(settings.labourRate));
  const printCost = plateCost;
  const lastPrice = wageCost + printCost + num(processing.partsCost);
  const finalCost = Math.ceil(lastPrice * (1 + num(settings.markup) / 100));
  const tax = Math.ceil((finalCost * num(settings.taxPercent)) / 100);
  const finalPriceIncShipping =
    Math.ceil((finalCost + tax + num(pricing.shipping)) / 10) * 10;

  return {
    wageCost,
    printCost,
    lastPrice,
    finalCost,
    tax,
    finalPriceIncShipping,
  };
}
