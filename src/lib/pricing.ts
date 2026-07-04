import { SETUP_TIME_MINUTES } from "@/config/constants";
import type { FinalPricing, PlateCosts, PlateInputs, PricingInputs, ProcessingInputs, Settings } from "@/types";

export const num = (value: string) => Number(value) || 0;

export const formatRs = (value: number) => `Rs ${value.toFixed(2)}`;

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
