import { useRef, useState } from "react";
import { ChevronDown, Copy, FileUp, Loader2, Settings2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import FieldSelect from "./fieldSelect";
import { FieldInput } from "./fieldInput";
import { Form } from "./form";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  FILAMENT_PRICE_OPTIONS,
  FILAMENT_TYPE_OPTIONS,
} from "@/config/constants";
import { cn } from "@/lib/utils";
import { required, requiredNumber } from "@/lib/validators";
import { computePlateCost, formatRs, plateQuantity } from "@/lib/pricing";
import {
  formatGrams,
  parseSlicedFile,
  splitPrintTime,
} from "@/lib/sliceImport";
import { isFilamentSettingsComplete } from "@/lib/settings";
import type { FilamentType, PlateInputs, Settings } from "@/types";

export function PlateCard({
  settings,
  plate,
  onChange,
  onRemove,
}: {
  settings: Settings;
  plate: PlateInputs;
  onChange: (plate: PlateInputs) => void;
  onRemove?: () => void;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showQuantity, setShowQuantity] = useState(plateQuantity(plate) > 1);
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filamentReady = isFilamentSettingsComplete(settings, plate.filamentType);

  const handleSlicedFile = async (file: File) => {
    setImporting(true);
    try {
      const info = await parseSlicedFile(file);
      const { hours, minutes } = splitPrintTime(info.printTimeSeconds);
      onChange({
        ...plate,
        printTimeHours: hours,
        printTimeMinutes: minutes,
        printWeight: formatGrams(info.weightGrams),
      });
      toast.success(
        info.plateCount > 1
          ? `Filled print time & weight from ${info.plateCount} plates.`
          : "Filled print time & weight from sliced file.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't read that file.",
      );
    } finally {
      setImporting(false);
    }
  };

  const updatePlate = <K extends keyof PlateInputs>(
    field: K,
    value: PlateInputs[K],
  ) => onChange({ ...plate, [field]: value });

  const costs = computePlateCost(settings, plate);

  const costBreakdown = [
    { label: "Material Cost", value: costs.materialCost },
    { label: "Print Monitoring/Setup & Hazard Cost", value: costs.monitoringCost },
    { label: "Print Usage Cost", value: costs.printUsageCost },
    { label: "Electricity Cost", value: costs.electricityCost },
  ];

  return (
    <div className="flex w-94 shrink-0 flex-col gap-6 rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          aria-label="Plate name"
          value={plate.name}
          onChange={(event) => updatePlate("name", event.target.value)}
          className="w-full min-w-0 border-b border-transparent bg-transparent font-semibold outline-none transition-colors hover:border-border focus:border-ring"
        />
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            aria-label="Remove plate"
            className="size-8 shrink-0 px-0 text-muted-foreground hover:bg-transparent hover:text-destructive"
            onClick={onRemove}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex w-full flex-col gap-6">
        {!filamentReady && (
          <div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Settings2 className="size-3.5" />
              Configure settings for this filament type to enable this plate.
            </span>
            <Button asChild variant="outline" size="sm" className="h-7">
              <Link to="/settings">Configure settings</Link>
            </Button>
          </div>
        )}
        <Form orientation="vertical">
          <FieldSelect
            options={FILAMENT_TYPE_OPTIONS}
            label={"Filament Type"}
            placeholder={"Select Filament Type"}
            description="Type of filament"
            name={"filamentType"}
            value={plate.filamentType}
            onValueChange={(value) =>
              onChange({
                ...plate,
                filamentType: value as FilamentType,
                filamentPrice: "",
              })
            }
            validate={required("Filament type")}
          />
          <FieldSelect
            key={plate.filamentType}
            options={FILAMENT_PRICE_OPTIONS[plate.filamentType]}
            label={"Filament Pricing per kg"}
            placeholder={"Select Filament Pricing"}
            description="Cost per kg of filament"
            name={"filamentPrice"}
            value={plate.filamentPrice}
            onValueChange={(value) => updatePlate("filamentPrice", value)}
            validate={required("Filament pricing")}
            disabled={!filamentReady}
          />
          <div className="flex gap-4">
            <FieldInput
              label={"Print Time (Hours)"}
              placeholder={"Enter Hours"}
              name={"printTimeHours"}
              value={plate.printTimeHours}
              onChange={(value) => updatePlate("printTimeHours", value)}
              validate={requiredNumber("Hours")}
              disabled={!filamentReady}
            />
            <FieldInput
              label={"Print Time (Minutes)"}
              placeholder={"Enter Minutes"}
              name={"printTimeMinutes"}
              value={plate.printTimeMinutes}
              onChange={(value) => updatePlate("printTimeMinutes", value)}
              validate={requiredNumber("Minutes")}
              disabled={!filamentReady}
            />
          </div>
          <FieldInput
            label={"Print Weight"}
            placeholder={"Enter Print Weight"}
            description="Weight in grams"
            name={"printWeight"}
            value={plate.printWeight}
            onChange={(value) => updatePlate("printWeight", value)}
            validate={requiredNumber("Print weight")}
            disabled={!filamentReady}
          />
          {showImport && (
            <div className="flex flex-col gap-1.5 rounded-md border border-dashed border-border p-3 duration-300 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Auto-fill from sliced .3mf</span>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Dismiss sliced-file import"
                  className="size-7 shrink-0 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() => setShowImport(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".3mf"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleSlicedFile(file);
                  event.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!filamentReady || importing}
                onClick={() => fileInputRef.current?.click()}
              >
                {importing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <FileUp className="size-3.5" />
                )}
                Choose sliced file
              </Button>
              <p className="text-xs text-muted-foreground">
                Import print time & weight from a Bambu Studio / OrcaSlicer file.
              </p>
            </div>
          )}
          {showQuantity && (
            <FieldInput
              className="duration-300 animate-in fade-in slide-in-from-top-2"
              label={"Quantity"}
              placeholder={"Enter Quantity"}
              description="Copies of this plate — multiplies its cost"
              name={"quantity"}
              value={plate.quantity}
              onChange={(value) => updatePlate("quantity", value)}
              validate={requiredNumber("Quantity")}
              disabled={!filamentReady}
              labelAction={
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Dismiss quantity"
                  className="size-5 shrink-0 px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() => {
                    setShowQuantity(false);
                    updatePlate("quantity", "1");
                  }}
                >
                  <X className="size-3.5" />
                </Button>
              }
            />
          )}
          {(!showImport || !showQuantity) && (
            <div className="flex flex-wrap gap-4">
              {!showImport && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
                  disabled={!filamentReady}
                  onClick={() => setShowImport(true)}
                >
                  <FileUp className="size-3.5" />
                  Auto-fill from sliced .3mf
                </Button>
              )}
              {!showQuantity && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 text-xs text-muted-foreground hover:bg-transparent hover:text-foreground"
                  disabled={!filamentReady}
                  onClick={() => setShowQuantity(true)}
                >
                  <Copy className="size-3.5" />
                  Add quantity
                </Button>
              )}
            </div>
          )}
        </Form>

        <Separator />

        <div className="flex flex-col">
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              showBreakdown
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-2 pb-3 text-sm text-muted-foreground">
                {costBreakdown.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-8"
                  >
                    <span>{item.label}</span>
                    <span className="tabular-nums">{formatRs(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="self-start text-xs px-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            onClick={() => setShowBreakdown((shown) => !shown)}
          >
            {showBreakdown ? "Hide breakdown" : "See breakdown"}
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-300",
                showBreakdown && "rotate-180",
              )}
            />
          </Button>
          <div className="mt-3 flex items-center justify-between gap-8 text-base font-semibold">
            <span>Plate Cost</span>
            <span className="tabular-nums">{formatRs(costs.plateCost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
