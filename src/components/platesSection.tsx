import { Plus } from "lucide-react";
import { PlateCard } from "./plateCard";
import { Button } from "./ui/button";
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

  const addPlate = () => onChange([...plates, makePlate(plates.length)]);

  const lastPlate = plates[plates.length - 1];
  const canAddPlate = lastPlate ? isPlateComplete(lastPlate) : true;

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
      <Button
        variant="outline"
        disabled={!canAddPlate}
        onClick={addPlate}
        className="h-auto self-start text-gray-50"
      >
        <Plus className="size-4" />
        Add Plate
      </Button>
    </div>
  );
}
