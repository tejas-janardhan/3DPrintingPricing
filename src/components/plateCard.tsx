import { useState } from "react";
import FieldSelect from "./fieldSelect";
import { FieldInput } from "./fieldInput";
import { Card } from "./card";
import { Form } from "./form";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  FILAMENT_PRICE_OPTIONS,
  FILAMENT_TYPE_OPTIONS,
  type FilamentType,
} from "@/config/constants";
import { required, requiredNumber } from "@/lib/validators";
import {
  computePlateCost,
  formatRs,
  type PlateInputs,
  type Settings,
} from "@/lib/pricing";

export function PlateCard({
  settings,
  plate,
  onChange,
}: {
  settings: Settings;
  plate: PlateInputs;
  onChange: (plate: PlateInputs) => void;
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);

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
    <Card title="Plate">
      <div className="flex w-full flex-col gap-6">
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
          />
          <div className="flex gap-4">
            <FieldInput
              label={"Print Time (Hours)"}
              placeholder={"Enter Hours"}
              name={"printTimeHours"}
              value={plate.printTimeHours}
              onChange={(value) => updatePlate("printTimeHours", value)}
              validate={requiredNumber("Hours")}
            />
            <FieldInput
              label={"Print Time (Minutes)"}
              placeholder={"Enter Minutes"}
              name={"printTimeMinutes"}
              value={plate.printTimeMinutes}
              onChange={(value) => updatePlate("printTimeMinutes", value)}
              validate={requiredNumber("Minutes")}
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
          />
        </Form>

        <Separator className="bg-white" />

        <div className="flex flex-col gap-3 text-gray-50">
          {showBreakdown && (
            <div className="flex flex-col gap-2 text-sm text-gray-400">
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
          )}
          <Button
            variant="ghost"
            size="sm"
            className="self-start text-xs px-0 text-gray-300 hover:bg-transparent hover:text-gray-50"
            onClick={() => setShowBreakdown((shown) => !shown)}
          >
            {showBreakdown ? "Hide breakdown" : "See breakdown"}
          </Button>
          <div className="flex items-center justify-between gap-8 text-base font-semibold">
            <span>Plate Cost</span>
            <span className="tabular-nums">{formatRs(costs.plateCost)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
