import { requiredNumber } from "@/lib/validators";
import type { FilamentType, Settings } from "@/types";

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
    isFilled(settings.taxPercent)
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
