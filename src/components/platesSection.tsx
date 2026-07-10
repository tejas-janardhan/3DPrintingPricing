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
    <div className="flex flex-col gap-4">
      {plates.map((plate) => (
        <PlateCard
          key={plate.id}
          settings={settings}
          plate={plate}
          onChange={updatePlate}
          onRemove={plates.length > 1 ? () => removePlate(plate.id) : undefined}
        />
      ))}
      <div className="flex min-h-16 w-full flex-row items-center justify-center gap-2 rounded-lg border border-dashed text-sm font-medium text-muted-foreground">
        <button
          type="button"
          disabled={!canAddPlate}
          onClick={addPlate}
          className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <Plus className="size-4" />
        </button>
        {atPlateLimit ? `Max ${MAX_PLATES} plates` : "Add Plate"}
      </div>
    </div>
  );
}
