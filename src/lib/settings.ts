import { DEFAULT_PRINTER_TYPE } from "@/config/constants";
import { requiredNumber } from "@/lib/validators";
import type { FilamentType, Settings } from "@/types";

/** A deep copy of a settings object, safe to store on a quotation. */
export function cloneSettings(settings: Settings): Settings {
  return {
    ...settings,
    byFilament: {
      pla: { ...settings.byFilament.pla },
      petg: { ...settings.byFilament.petg },
    },
    byPrinter: {
      bambuLabA1: { ...settings.byPrinter.bambuLabA1 },
    },
  };
}

/** Value-equality of two settings snapshots (every field compared). */
export function areSettingsEqual(a: Settings, b: Settings): boolean {
  return (
    a.labourRate === b.labourRate &&
    a.electricityCost === b.electricityCost &&
    a.multiplier === b.multiplier &&
    a.taxPercent === b.taxPercent &&
    a.byFilament.pla.costPerHour === b.byFilament.pla.costPerHour &&
    a.byFilament.pla.powerConsumption === b.byFilament.pla.powerConsumption &&
    a.byFilament.petg.costPerHour === b.byFilament.petg.costPerHour &&
    a.byFilament.petg.powerConsumption === b.byFilament.petg.powerConsumption &&
    a.byPrinter.bambuLabA1.setupTimeMinutes ===
      b.byPrinter.bambuLabA1.setupTimeMinutes
  );
}

const isFilled = (value: string) => requiredNumber("value")(value) === undefined;

/**
 * The global operating/pricing settings are configured once a valid,
 * non-negative number has been entered for every shared field. Gates the
 * calculator page.
 */
export function isGlobalSettingsComplete(settings: Settings): boolean {
  return (
    isFilled(settings.labourRate) &&
    isFilled(settings.electricityCost) &&
    isFilled(settings.multiplier) &&
    isFilled(settings.taxPercent) &&
    isFilled(settings.byPrinter[DEFAULT_PRINTER_TYPE].setupTimeMinutes)
  );
}

/**
 * A filament type's per-filament settings are configured once its cost-per-hour
 * and power consumption are valid numbers. Gates the plate that uses that type.
 */
export function isFilamentSettingsComplete(
  settings: Settings,
  filamentType: FilamentType,
): boolean {
  const filament = settings.byFilament[filamentType];
  return isFilled(filament.costPerHour) && isFilled(filament.powerConsumption);
}
