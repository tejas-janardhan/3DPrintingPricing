import { useState } from "react";
import FieldSelect from "./components/fieldSelect";
import { FieldInput } from "./components/fieldInput";
import { Card } from "./components/card";
import { Form } from "./components/form";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Layout } from "./layout";
import {
  FILAMENT_PRICE_OPTIONS,
  FILAMENT_TYPE_OPTIONS,
  type FilamentType,
} from "./config/constants";
import { required, requiredNumber } from "./lib/validators";

type FilamentSettings = {
  costPerHour: string;
  powerConsumption: string;
};

type Settings = {
  labourRate: string;
  electricityCost: string;
  multiplier: string;
  byFilament: Record<FilamentType, FilamentSettings>;
};

type PlateInputs = {
  filamentType: FilamentType;
  filamentPrice: string;
  printTimeHours: string;
  printTimeMinutes: string;
  printWeight: string;
};

const EMPTY_PLATE: PlateInputs = {
  filamentType: "pla",
  filamentPrice: "",
  printTimeHours: "",
  printTimeMinutes: "",
  printWeight: "",
};

const EMPTY_SETTINGS: Settings = {
  labourRate: "",
  electricityCost: "",
  multiplier: "",
  byFilament: {
    pla: { costPerHour: "", powerConsumption: "" },
    petg: { costPerHour: "", powerConsumption: "" },
  },
};

const SETUP_TIME_MINUTES = 5;

const num = (value: string) => Number(value) || 0;

function App() {
  // Plate
  const [plate, setPlate] = useState<PlateInputs>(EMPTY_PLATE);
  const [showBreakdown, setShowBreakdown] = useState(false);
  // Settings (autosaved to local state, per filament type)
  const [settingsType, setSettingsType] = useState<FilamentType>("pla");
  const [isEditing, setIsEditing] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [settings, setSettings] = useState<Settings>(EMPTY_SETTINGS);

  const currentSettings = settings.byFilament[settingsType];
  const updateSetting = (field: keyof FilamentSettings, value: string) =>
    setSettings((prev) => ({
      ...prev,
      byFilament: {
        ...prev.byFilament,
        [settingsType]: { ...prev.byFilament[settingsType], [field]: value },
      },
    }));

  const updateGlobalSetting = (
    field: "labourRate" | "electricityCost" | "multiplier",
    value: string,
  ) => setSettings((prev) => ({ ...prev, [field]: value }));

  const updatePlate = <K extends keyof PlateInputs>(
    field: K,
    value: PlateInputs[K],
  ) => setPlate((prev) => ({ ...prev, [field]: value }));

  // Plate cost breakdown
  const totalPrintHours =
    num(plate.printTimeHours) + num(plate.printTimeMinutes) / 60;
  const plateCostPerHour = num(
    settings.byFilament[plate.filamentType].costPerHour,
  );

  const materialCost =
    (num(plate.printWeight) * num(plate.filamentPrice)) / 1000;
  const monitoringCost =
    num(settings.labourRate) *
    (0.05 * totalPrintHours + SETUP_TIME_MINUTES / 60);
  const printUsageCost = totalPrintHours * plateCostPerHour;
  const plateElectricityCost = totalPrintHours * num(settings.electricityCost);
  const plateCost =
    materialCost + monitoringCost + printUsageCost + plateElectricityCost;

  const costBreakdown = [
    { label: "Material Cost", value: materialCost },
    { label: "Print Monitoring/Setup & Hazard Cost", value: monitoringCost },
    { label: "Print Usage Cost", value: printUsageCost },
    { label: "Electricity Cost", value: plateElectricityCost },
  ];

  const formatRs = (value: number) => `Rs ${value.toFixed(2)}`;

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <Card
          title="Settings"
          action={
            <Button
              variant="outline"
              size="sm"
              className="text-gray-50"
              onClick={() => {
                setShowErrors(isEditing);
                setIsEditing((editing) => !editing);
              }}
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
          }
        >
          <Form orientation="horizontal">
            <FieldSelect
              options={FILAMENT_TYPE_OPTIONS}
              label={"Filament Type"}
              placeholder={"Select Filament Type"}
              description="Settings apply to this type"
              name={"settingsFilamentType"}
              value={settingsType}
              onValueChange={(value) => {
                setShowErrors(false);
                setSettingsType(value as FilamentType);
              }}
            />
            <FieldInput
              label={"Cost per hour"}
              placeholder={"Enter Cost per hour"}
              description="Cost per hour"
              name={"costPerHour"}
              value={currentSettings.costPerHour}
              onChange={(value) => updateSetting("costPerHour", value)}
              disabled={!isEditing}
              validate={requiredNumber("Cost per hour")}
              showError={showErrors}
              className="basis-[140%]"
            />
            <FieldInput
              label={"Power Consumption"}
              placeholder={"Enter Power Consumption"}
              description="Power consumption in watts"
              name={"powerConsumption"}
              value={currentSettings.powerConsumption}
              onChange={(value) => updateSetting("powerConsumption", value)}
              disabled={!isEditing}
              validate={requiredNumber("Power consumption")}
              className="basis-[150%]"
              showError={showErrors}
            />
            <Separator
              orientation="vertical"
              className="self-stretch bg-white data-[orientation=vertical]:h-auto"
            />
            <FieldInput
              label={"Labour Rate"}
              placeholder={"Enter Labour Rate"}
              description="Labour cost per hour"
              name={"labourRate"}
              value={settings.labourRate}
              onChange={(value) => updateGlobalSetting("labourRate", value)}
              disabled={!isEditing}
              validate={requiredNumber("Labour rate")}
              className="basis-[110%]"
              showError={showErrors}
            />
            <FieldInput
              label={"Electricity Cost"}
              placeholder={"Enter cost"}
              description="Cost per KWHr"
              name={"electricityCost"}
              value={settings.electricityCost}
              onChange={(value) => updateGlobalSetting("electricityCost", value)}
              disabled={!isEditing}
              validate={requiredNumber("Electricity cost")}
              showError={showErrors}
              className="basis-[90%]"
            />
            <FieldInput
              label={"Multiplier"}
              placeholder={"Enter Multiplier"}
              description="Pricing multiplier"
              name={"multiplier"}
              value={settings.multiplier}
              onChange={(value) => updateGlobalSetting("multiplier", value)}
              disabled={!isEditing}
              validate={requiredNumber("Multiplier")}
              showError={showErrors}
            />
          </Form>
        </Card>
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
                  setPlate((prev) => ({
                    ...prev,
                    filamentType: value as FilamentType,
                    filamentPrice: "",
                  }))
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
                      <span className="tabular-nums">
                        {formatRs(item.value)}
                      </span>
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
                <span className="tabular-nums">{formatRs(plateCost)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default App;
