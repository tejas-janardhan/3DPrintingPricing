import { Plus } from "lucide-react";
import { PlateCard } from "./plateCard";
import { Button } from "./ui/button";
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
    <div className="flex flex-wrap items-stretch gap-4">
      {plates.map((plate) => (
        <PlateCard
          key={plate.id}
          settings={settings}
          plate={plate}
          onChange={updatePlate}
          onRemove={plates.length > 1 ? () => removePlate(plate.id) : undefined}
        />
      ))}
      <div className="flex flex-col items-start gap-1 self-start">
        <Button
          variant="outline"
          disabled={!canAddPlate}
          onClick={addPlate}
          className="h-auto"
        >
          <Plus className="size-4" />
          Add Plate
        </Button>
        {atPlateLimit && (
          <span className="text-xs text-muted-foreground">
            Maximum of {MAX_PLATES} plates reached.
          </span>
        )}
      </div>
    </div>
  );
}
