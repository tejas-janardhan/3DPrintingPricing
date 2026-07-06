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
import { optionalNumber, requiredNumber } from "@/lib/validators";
import type {
  BusinessSettings,
  DefaultSettings,
  FilamentSettings,
  FilamentType,
  OperatingSettings,
  PricingSettings,
  PrinterSettings,
  PrinterType,
  Settings,
} from "@/types";

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

  const updateBusiness = (field: keyof BusinessSettings, value: string) =>
    onChange({ ...settings, business: { ...settings.business, [field]: value } });

  const updateOperating = (field: keyof OperatingSettings, value: string) =>
    onChange({
      ...settings,
      operating: { ...settings.operating, [field]: value },
    });

  const updatePricing = (field: keyof PricingSettings, value: string) =>
    onChange({ ...settings, pricing: { ...settings.pricing, [field]: value } });

  const updateDefault = (field: keyof DefaultSettings, value: string) =>
    onChange({ ...settings, defaults: { ...settings.defaults, [field]: value } });

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
          title="Business Details"
          description="Shown on the quotation document sent to customers."
        >
          <Form orientation="horizontal" className="flex-wrap">
            <FieldInput
              label={"Business Name"}
              placeholder={"Enter Business Name"}
              description="Your business or brand name"
              name={"businessName"}
              value={settings.business.name}
              onChange={(value) => updateBusiness("name", value)}
              disabled={!isEditing}
              className="w-64"
            />
            <FieldInput
              label={"Business Address"}
              placeholder={"Enter Business Address"}
              description="Address shown on quotes"
              name={"businessAddress"}
              value={settings.business.address}
              onChange={(value) => updateBusiness("address", value)}
              disabled={!isEditing}
              className="w-72"
            />
            <FieldInput
              label={"Contact Name"}
              placeholder={"Enter Contact Name"}
              description="Person customers reach out to"
              name={"businessContactName"}
              value={settings.business.contactName}
              onChange={(value) => updateBusiness("contactName", value)}
              disabled={!isEditing}
              className="w-64"
            />
            <FieldInput
              label={"Contact Number"}
              placeholder={"Enter Contact Number"}
              description="Phone number shown on quotes"
              name={"businessContactNumber"}
              value={settings.business.contactNumber}
              onChange={(value) => updateBusiness("contactNumber", value)}
              disabled={!isEditing}
              className="w-56"
            />
          </Form>
        </CardSection>

        <Separator />

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
              value={settings.operating.labourRate}
              onChange={(value) => updateOperating("labourRate", value)}
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
              value={settings.operating.electricityCost}
              onChange={(value) => updateOperating("electricityCost", value)}
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
              value={settings.pricing.multiplier}
              onChange={(value) => updatePricing("multiplier", value)}
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
              value={settings.pricing.taxPercent}
              onChange={(value) => updatePricing("taxPercent", value)}
              disabled={!isEditing}
              validate={requiredNumber("Tax percent")}
              showError={showErrors}
              className="w-48"
            />
            <FieldInput
              label={"Advance Threshold"}
              placeholder={"Enter Advance Threshold"}
              description="Order value above which an advance applies"
              name={"advanceThreshold"}
              value={settings.pricing.advanceThreshold}
              onChange={(value) => updatePricing("advanceThreshold", value)}
              disabled={!isEditing}
              validate={optionalNumber("Advance threshold")}
              showError={showErrors}
              className="w-48"
            />
            <FieldInput
              label={"Advance Percent"}
              placeholder={"Enter Advance Percent"}
              description="% of order value taken as advance"
              name={"advancePercent"}
              value={settings.pricing.advancePercent}
              onChange={(value) => updatePricing("advancePercent", value)}
              disabled={!isEditing}
              validate={optionalNumber("Advance percent")}
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
              value={settings.defaults.markup}
              onChange={(value) => updateDefault("markup", value)}
              disabled={!isEditing}
              className="w-48"
            />
            <FieldInput
              label={"Default Shipping"}
              placeholder={"Enter Default Shipping"}
              description="Shipping cost seeded on new quotes"
              name={"defaultShipping"}
              value={settings.defaults.shipping}
              onChange={(value) => updateDefault("shipping", value)}
              disabled={!isEditing}
              className="w-48"
            />
            <FieldInput
              label={"Default 3D Processing"}
              placeholder={"Enter Minutes"}
              description="Processing minutes seeded on new quotes"
              name={"defaultProcessingMinutes"}
              value={settings.defaults.processingMinutes}
              onChange={(value) => updateDefault("processingMinutes", value)}
              disabled={!isEditing}
              className="w-48"
            />
          </Form>
        </CardSection>
      </CardContent>
    </Card>
  );
}
