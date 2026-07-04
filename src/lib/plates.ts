import { EMPTY_PLATE } from "@/config/constants";
import type { PlateInputs } from "@/types";

/** Default plate name for a given position: Plate, Plate (1), Plate (2), ... */
export function defaultPlateName(index: number): string {
  return index === 0 ? "Plate" : `Plate (${index})`;
}

let plateSeq = 0;

/** Creates a fresh, empty plate with a unique id and a default sequential name. */
export function makePlate(index: number): PlateInputs {
  plateSeq += 1;
  return {
    ...EMPTY_PLATE,
    id: `plate-${Date.now()}-${plateSeq}`,
    name: defaultPlateName(index),
  };
}

/**
 * A plate counts as complete once it has a filament price, a print weight, and
 * some print time. Used to gate the "add plate" button.
 */
export function isPlateComplete(plate: PlateInputs): boolean {
  const hasTime =
    plate.printTimeHours.trim() !== "" || plate.printTimeMinutes.trim() !== "";
  return (
    plate.filamentPrice.trim() !== "" &&
    plate.printWeight.trim() !== "" &&
    hasTime
  );
}
