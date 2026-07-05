import { useState } from "react";
import FieldSelect from "./fieldSelect";
import { FieldInput } from "./fieldInput";
import { Form } from "./form";
import { CardSection } from "./section";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { FILAMENT_TYPE_OPTIONS, PRINTER_TYPE_OPTIONS } from "@/config/constants";
import { requiredNumber } from "@/lib/validators";
import type {
  FilamentSettings,
  FilamentType,
  PrinterSettings,
  PrinterType,
  Settings,
} from "@/types";

type GlobalSettingField =
  | "labourRate"
  | "electricityCost"
  | "multiplier"
  | "taxPercent"
  | "defaultMarkup"
  | "defaultShipping"
  | "defaultProcessingMinutes";

export function SettingsCard({
  settings,
  onChange,
}: {
  settings: Settings;
  onChange: (settings: Settings) => void;
}) {
  // Which filament type the per-filament fields apply to
  const [settingsType, setSettingsType] = useState<FilamentType>("pla");
  // Which printer type the per-printer fields apply to
  const [printerType, setPrinterType] = useState<PrinterType>("bambuLabA1");
  const [isEditing, setIsEditing] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const currentSettings = settings.byFilament[settingsType];
  const currentPrinter = settings.byPrinter[printerType];

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

  const updatePrinterSetting = (field: keyof PrinterSettings, value: string) =>
    onChange({
      ...settings,
      byPrinter: {
        ...settings.byPrinter,
        [printerType]: {
          ...settings.byPrinter[printerType],
          [field]: value,
        },
      },
    });

  const updateGlobalSetting = (field: GlobalSettingField, value: string) =>
    onChange({ ...settings, [field]: value });

  return (
    <Card>
      <CardHeader className="border-b pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Settings
        </CardTitle>
        <CardDescription>
          Configure the costs and pricing used across your quotes.
        </CardDescription>
        <CardAction>
          <Button
            variant="outline"
            onClick={() => {
              setShowErrors(isEditing);
              setIsEditing((editing) => !editing);
            }}
          >
            {isEditing ? "Done" : "Edit"}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <CardSection
          title="Filament Settings"
          description="Printing costs specific to each filament type."
        >
          <Form orientation="horizontal" className="flex-wrap">
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
              className="w-52"
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
              className="w-48"
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
              className="w-50"
              showError={showErrors}
            />
          </Form>
        </CardSection>

        <Separator />

        <CardSection
          title="Operating Costs"
          description="Shared hourly and utility costs."
        >
          <Form orientation="horizontal" className="flex-wrap">
            <FieldInput
              label={"Labour Rate"}
              placeholder={"Enter Labour Rate"}
              description="Labour cost per hour"
              name={"labourRate"}
              value={settings.labourRate}
              onChange={(value) => updateGlobalSetting("labourRate", value)}
              disabled={!isEditing}
              validate={requiredNumber("Labour rate")}
              className="w-48"
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
              className="w-48"
            />
          </Form>
        </CardSection>

        <Separator />

        <CardSection
          title="Printer Config"
          description="Setup effort specific to each printer."
        >
          <Form orientation="horizontal" className="flex-wrap">
            <FieldSelect
              options={PRINTER_TYPE_OPTIONS}
              label={"Printer Type"}
              placeholder={"Select Printer Type"}
              description="Settings apply to this printer"
              name={"settingsPrinterType"}
              value={printerType}
              onValueChange={(value) => {
                setShowErrors(false);
                setPrinterType(value as PrinterType);
              }}
              className="w-52"
            />
            <FieldInput
              label={"Setup Time"}
              placeholder={"Enter Setup Time"}
              description="Setup minutes per plate"
              name={"setupTimeMinutes"}
              value={currentPrinter.setupTimeMinutes}
              onChange={(value) => updatePrinterSetting("setupTimeMinutes", value)}
              disabled={!isEditing}
              validate={requiredNumber("Setup time")}
              showError={showErrors}
              className="w-48"
            />
          </Form>
        </CardSection>

        <Separator />

        <CardSection
          title="Pricing"
          description="Markup and tax applied to every quote."
        >
          <Form orientation="horizontal" className="flex-wrap">
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
              className="w-48"
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
              className="w-48"
            />
          </Form>
        </CardSection>

        <Separator />

        <CardSection
          title="Defaults"
          description="Pre-filled into each new quote."
        >
          <Form orientation="horizontal" className="flex-wrap">
            <FieldInput
              label={"Default Markup"}
              placeholder={"Enter Default Markup"}
              description="Markup % seeded on new quotes"
              name={"defaultMarkup"}
              value={settings.defaultMarkup}
              onChange={(value) => updateGlobalSetting("defaultMarkup", value)}
              disabled={!isEditing}
              className="w-48"
            />
            <FieldInput
              label={"Default Shipping"}
              placeholder={"Enter Default Shipping"}
              description="Shipping cost seeded on new quotes"
              name={"defaultShipping"}
              value={settings.defaultShipping}
              onChange={(value) => updateGlobalSetting("defaultShipping", value)}
              disabled={!isEditing}
              className="w-48"
            />
            <FieldInput
              label={"Default 3D Processing"}
              placeholder={"Enter Minutes"}
              description="Processing minutes seeded on new quotes"
              name={"defaultProcessingMinutes"}
              value={settings.defaultProcessingMinutes}
              onChange={(value) =>
                updateGlobalSetting("defaultProcessingMinutes", value)
              }
              disabled={!isEditing}
              className="w-48"
            />
          </Form>
        </CardSection>
      </CardContent>
    </Card>
  );
}
