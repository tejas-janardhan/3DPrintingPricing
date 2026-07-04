import { useState } from "react";
import FieldSelect from "./fieldSelect";
import { FieldInput } from "./fieldInput";
import { Card } from "./card";
import { Form } from "./form";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { FILAMENT_TYPE_OPTIONS, type FilamentType } from "@/config/constants";
import { requiredNumber } from "@/lib/validators";
import type { FilamentSettings, Settings } from "@/lib/pricing";

type GlobalSettingField =
  | "labourRate"
  | "electricityCost"
  | "multiplier"
  | "markup"
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
      <div className="flex flex-col gap-6">
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
        </Form>

        <Separator className="bg-white" />

        <Form orientation="horizontal">
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
          <FieldInput
            label={"Markup"}
            placeholder={"Enter Markup"}
            description="Markup percentage"
            name={"markup"}
            value={settings.markup}
            onChange={(value) => updateGlobalSetting("markup", value)}
            disabled={!isEditing}
            validate={requiredNumber("Markup")}
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
      </div>
    </Card>
  );
}
