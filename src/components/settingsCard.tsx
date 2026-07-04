import { useState } from "react";
import FieldSelect from "./fieldSelect";
import { FieldInput } from "./fieldInput";
import { Card } from "./card";
import { Form } from "./form";
import { Button } from "./ui/button";
import { FILAMENT_TYPE_OPTIONS } from "@/config/constants";
import { requiredNumber } from "@/lib/validators";
import type { FilamentSettings, FilamentType, Settings } from "@/types";

type GlobalSettingField =
  | "labourRate"
  | "electricityCost"
  | "multiplier"
  | "taxPercent";

export function SettingsCard({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (settings: Settings) => void;
}) {
  // Which filament type the per-filament fields apply to
  const [settingsType, setSettingsType] = useState<FilamentType>("pla");
  const [isEditing, setIsEditing] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const currentSettings = settings.byFilament[settingsType];

  const updateSetting = (field: keyof FilamentSettings, value: string) =>
    onChange({
      ...settings,
      byFilament: {
        ...settings.byFilament,
        [settingsType]: {
          ...settings.byFilament[settingsType],
          [field]: value,
        },
      },
    });

  const updateGlobalSetting = (field: GlobalSettingField, value: string) =>
    onChange({ ...settings, [field]: value });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure the costs and pricing used across your quotes.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowErrors(isEditing);
            setIsEditing((editing) => !editing);
          }}
        >
          {isEditing ? "Done" : "Edit"}
        </Button>
      </div>

      <Card title="Filament Settings">
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
            description="Cost of printing per hour"
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
        </Form>
      </Card>

      <Card title="Operating Costs">
        <Form orientation="horizontal">
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
        </Form>
      </Card>

      <Card title="Pricing">
        <Form orientation="horizontal">
          <FieldInput
            label={"Multiplier"}
            placeholder={"Enter Multiplier"}
            description="Pricing multiplier (account for errors)"
            name={"multiplier"}
            value={settings.multiplier}
            onChange={(value) => updateGlobalSetting("multiplier", value)}
            disabled={!isEditing}
            validate={requiredNumber("Multiplier")}
            showError={showErrors}
          />
          <FieldInput
            label={"Tax Percent"}
            placeholder={"Enter Tax Percent"}
            description="Tax percentage"
            name={"taxPercent"}
            value={settings.taxPercent}
            onChange={(value) => updateGlobalSetting("taxPercent", value)}
            disabled={!isEditing}
            validate={requiredNumber("Tax percent")}
            showError={showErrors}
          />
        </Form>
      </Card>
    </div>
  );
}
