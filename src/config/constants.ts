export type FilamentType = "pla" | "petg";

export const FILAMENT_TYPE_OPTIONS: { label: string; value: FilamentType }[] = [
  { label: "PLA", value: "pla" },
  { label: "PETG", value: "petg" },
];

export const FILAMENT_PRICE_OPTIONS: Record<
  FilamentType,
  { label: string; value: number }[]
> = {
  pla: [
    { label: "Rs 950 (JAMG HE)", value: 950 },
    { label: "Rs 800 (Numakers)", value: 800 },
  ],
  petg: [{ label: "Rs 1050 (JAMG HE)", value: 1050 }],
};
