import { DEFAULT_PRINTER_TYPE, MONITORING_RATE } from "@/config/constants";
import { isPlateComplete } from "@/lib/plates";
import type {
  FinalPricing,
  PlateCosts,
  PlateInputs,
  PricingInputs,
  ProcessingInputs,
  Quotation,
  Settings,
} from "@/types";

export const num = (value: string) => Number(value) || 0;

/** A plate's copy count; defaults to 1 when unset or invalid. */
export const plateQuantity = (plate: PlateInputs) => num(plate.quantity) || 1;

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
  const setupTimeMinutes = num(
    settings.byPrinter[DEFAULT_PRINTER_TYPE].setupTimeMinutes,
  );
  const monitoringCost = Math.ceil(
    num(settings.operating.labourRate) *
      (MONITORING_RATE * totalPrintHours + setupTimeMinutes / 60),
  );
  const printUsageCost = Math.ceil(totalPrintHours * plateCostPerHour);
  const electricityCost = Math.ceil(
    (totalPrintHours *
      num(settings.byFilament[plate.filamentType].powerConsumption) *
      num(settings.operating.electricityCost)) /
      1000,
  );
  // Only a fully-filled plate has a real cost. Incomplete plates still expose
  // their intermediary costs for the breakdown, but their plate cost is zero so
  // half-entered plates don't inflate the final quote.
  const plateCost = isPlateComplete(plate)
    ? Math.ceil(
        (materialCost + monitoringCost + printUsageCost + electricityCost) *
          num(settings.pricing.multiplier),
      )
    : 0;

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
  plates,
  pricing,
}: {
  settings: Settings;
  processing: ProcessingInputs;
  plates: PlateInputs[];
  pricing: PricingInputs;
}): FinalPricing {
  const printCost = plates.reduce(
    (total, plate) =>
      total +
      computePlateCost(settings, plate).plateCost * plateQuantity(plate),
    0,
  );

  const processingHours =
    num(processing.processingMinutes) / 60 +
    num(processing.postProcessingHours) +
    num(processing.postProcessingMinutes) / 60;

  const wageCost = Math.ceil(processingHours * num(settings.operating.labourRate));
  const lastPrice = wageCost + printCost + num(processing.partsCost);
  const finalCost = Math.ceil(lastPrice * (1 + num(pricing.markup) / 100));
  const tax = Math.ceil((finalCost * num(settings.pricing.taxPercent)) / 100);
  // No print cost means no real quote yet — keep the final price at zero.
  const finalPriceIncShipping =
    printCost > 0
      ? Math.ceil((finalCost + tax + num(pricing.shipping)) / 10) * 10
      : 0;

  // Advance charged upfront when the order value exceeds the threshold.
  const advance =
    finalPriceIncShipping >= num(settings.pricing.advanceThreshold)
      ? Math.round(
          (finalPriceIncShipping * num(settings.pricing.advancePercent)) / 100 / 10,
        ) * 10
      : 0;

  const totalWeight = plates.reduce(
    (total, plate) => total + num(plate.printWeight) * plateQuantity(plate),
    0,
  );
  const rsPerGram = totalWeight > 0 ? finalPriceIncShipping / totalWeight : 0;

  return {
    wageCost,
    printCost,
    lastPrice,
    finalCost,
    tax,
    finalPriceIncShipping,
    advance,
    rsPerGram,
  };
}

/** Frozen plateCosts + finalPricing snapshot from a quotation's own settings. */
export function pricedQuotation(quotation: Quotation): Quotation {
  const plateCosts = quotation.plates.map((plate) =>
    computePlateCost(quotation.settings, plate),
  );
  const finalPricing = computeFinalPricing({
    settings: quotation.settings,
    processing: quotation.processing,
    plates: quotation.plates,
    pricing: quotation.pricing,
  });
  return { ...quotation, plateCosts, finalPricing };
}
