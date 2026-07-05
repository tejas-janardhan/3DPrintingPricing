import { FILAMENT_TYPE_OPTIONS } from "@/config/constants";
import { formatRs, plateQuantity } from "@/lib/pricing";
import type { PlateInputs } from "@/types";
import { DetailRow } from "./detailRow";
import { PriceRow } from "./priceRow";
import { SeeMore } from "./seeMore";

const filamentLabel = (value: string) =>
  FILAMENT_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? "—";

/** One plate: cost row plus a "See more" with its print inputs. */
export function PlateRow({
  plate,
  plateCost,
}: {
  plate: PlateInputs;
  plateCost: number;
}) {
  const hours = plate.printTimeHours.trim() || "0";
  const minutes = plate.printTimeMinutes.trim() || "0";
  const weight = plate.printWeight.trim() || "0";
  const price = plate.filamentPrice.trim();
  const qty = plateQuantity(plate);
  return (
    <div className="flex flex-col gap-1">
      <SeeMore>
        <DetailRow label="Filament Type" value={filamentLabel(plate.filamentType)} />
        <DetailRow
          label="Filament Pricing"
          value={price ? `${formatRs(Number(price))} /kg` : "—"}
        />
        <DetailRow label="Print Time" value={`${hours}h ${minutes}m`} />
        <DetailRow label="Print Weight" value={`${weight} g`} />
        {qty > 1 && (
          <DetailRow label="Unit Cost" value={`${formatRs(plateCost)} × ${qty}`} />
        )}
      </SeeMore>
      <PriceRow
        label={qty > 1 ? `${plate.name} × ${qty}` : plate.name}
        value={plateCost * qty}
      />
    </div>
  );
}
