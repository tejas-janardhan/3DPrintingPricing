import { strFromU8, unzipSync } from "fflate";

/** Print time + filament weight pulled from a sliced .3mf / .gcode.3mf. */
export type SlicedInfo = {
  /** Total print time in seconds, summed across all plates in the file. */
  printTimeSeconds: number;
  /** Total filament weight in grams, summed across all plates. */
  weightGrams: number;
  /** Number of plates found in the file. */
  plateCount: number;
};

/** Time split into whole hours + minutes, ready for the plate form fields. */
export function splitPrintTime(seconds: number): {
  hours: string;
  minutes: string;
} {
  const totalMinutes = Math.round(seconds / 60);
  return {
    hours: String(Math.floor(totalMinutes / 60)),
    minutes: String(totalMinutes % 60),
  };
}

/** Grams rounded to at most 1 decimal, as a form-friendly string. */
export function formatGrams(grams: number): string {
  return String(Math.round(grams * 10) / 10);
}

const num = (value: string | null | undefined) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Parses a sliced Bambu Studio / OrcaSlicer .3mf (or .gcode.3mf) and returns
 * the slicer's own print-time and weight predictions. The file is a ZIP whose
 * `Metadata/slice_info.config` holds one `<plate>` per plate, each carrying
 * `prediction` (seconds) and `weight` (grams) metadata.
 */
export async function parseSlicedFile(file: File): Promise<SlicedInfo> {
  const buffer = new Uint8Array(await file.arrayBuffer());

  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(buffer, {
      filter: (f) => /slice_info\.config$/i.test(f.name),
    });
  } catch {
    throw new Error("Not a valid .3mf file (couldn't read the archive).");
  }

  const configEntry = Object.values(entries)[0];
  if (!configEntry) {
    throw new Error(
      "No slicing info found. Export a sliced .3mf from Bambu Studio or OrcaSlicer.",
    );
  }

  const doc = new DOMParser().parseFromString(
    strFromU8(configEntry),
    "application/xml",
  );
  if (doc.querySelector("parsererror")) {
    throw new Error("Couldn't read the slicing info in this file.");
  }

  const plates = Array.from(doc.querySelectorAll("plate"));
  if (plates.length === 0) {
    throw new Error(
      "This .3mf hasn't been sliced yet — slice it first, then export.",
    );
  }

  let printTimeSeconds = 0;
  let weightGrams = 0;
  for (const plate of plates) {
    const meta = (key: string) =>
      plate
        .querySelector(`metadata[key="${key}"]`)
        ?.getAttribute("value");
    printTimeSeconds += num(meta("prediction"));
    // Prefer the plate's `weight`; fall back to summing per-filament `used_g`.
    const plateWeight = num(meta("weight"));
    weightGrams +=
      plateWeight ||
      Array.from(plate.querySelectorAll("filament")).reduce(
        (total, f) => total + num(f.getAttribute("used_g")),
        0,
      );
  }

  if (printTimeSeconds === 0 && weightGrams === 0) {
    throw new Error(
      "This .3mf hasn't been sliced yet — slice it first, then export.",
    );
  }

  return { printTimeSeconds, weightGrams, plateCount: plates.length };
}
