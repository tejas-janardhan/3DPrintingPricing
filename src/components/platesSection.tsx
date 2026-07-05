import { Plus } from "lucide-react";
import { PlateCard } from "./plateCard";
import { MAX_PLATES } from "@/config/constants";
import { isPlateComplete, makePlate } from "@/lib/plates";
import type { PlateInputs, Settings } from "@/types";

export function PlatesSection({
  settings,
  plates,
  onChange,
}: {
  settings: Settings;
  plates: PlateInputs[];
  onChange: (plates: PlateInputs[]) => void;
}) {
  const updatePlate = (next: PlateInputs) =>
    onChange(plates.map((plate) => (plate.id === next.id ? next : plate)));

  const removePlate = (id: string) =>
    onChange(plates.filter((plate) => plate.id !== id));

  const atPlateLimit = plates.length >= MAX_PLATES;

  const addPlate = () => {
    if (atPlateLimit) return;
    onChange([...plates, makePlate(plates.length)]);
  };

  const lastPlate = plates[plates.length - 1];
  const canAddPlate = !atPlateLimit && (lastPlate ? isPlateComplete(lastPlate) : true);

  return (
    <div className="flex flex-wrap gap-4">
      {plates.map((plate) => (
        <PlateCard
          key={plate.id}
          settings={settings}
          plate={plate}
          onChange={updatePlate}
          onRemove={plates.length > 1 ? () => removePlate(plate.id) : undefined}
        />
      ))}
      <button
        type="button"
        disabled={!canAddPlate}
        onClick={addPlate}
        className="flex w-72 min-h-40 flex-col items-center justify-center gap-2 rounded-lg bg-transparent text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <span className="flex size-9 items-center justify-center rounded-full border border-dashed border-current">
          <Plus className="size-4" />
        </span>
        {atPlateLimit ? `Max ${MAX_PLATES} plates` : "Add Plate"}
      </button>
    </div>
  );
}
