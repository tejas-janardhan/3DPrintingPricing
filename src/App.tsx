import { useState } from "react";
import FieldSelect from "./components/fieldSelect";
import { FieldInput } from "./components/fieldInput";
import { Card } from "./components/card";
import { Form } from "./components/form";
import { Button } from "./components/ui/button";
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

const EMPTY_SETTINGS: Record<FilamentType, FilamentSettings> = {
  pla: { costPerHour: "", powerConsumption: "" },
  petg: { costPerHour: "", powerConsumption: "" },
};

function App() {
  // Plate
  const [filamentType, setFilamentType] = useState<FilamentType>("pla");

  // Settings (autosaved to local state, per filament type)
  const [settingsType, setSettingsType] = useState<FilamentType>("pla");
  const [isEditing, setIsEditing] = useState(false);
  const [multiplier, setMultiplier] = useState("");
  const [settings, setSettings] = useState(EMPTY_SETTINGS);

  const currentSettings = settings[settingsType];
  const updateSetting = (field: keyof FilamentSettings, value: string) =>
    setSettings((prev) => ({
      ...prev,
      [settingsType]: { ...prev[settingsType], [field]: value },
    }));

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <Card
          title="Settings"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing((editing) => !editing)}
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
              onValueChange={(value) => setSettingsType(value as FilamentType)}
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
            />
            <FieldInput
              label={"Multiplier"}
              placeholder={"Enter Multiplier"}
              description="Pricing multiplier"
              name={"multiplier"}
              value={multiplier}
              onChange={setMultiplier}
              disabled={!isEditing}
              validate={requiredNumber("Multiplier")}
            />
          </Form>
        </Card>
        <Card title="Plate">
          <Form orientation="vertical">
            <FieldSelect
              options={FILAMENT_TYPE_OPTIONS}
              label={"Filament Type"}
              placeholder={"Select Filament Type"}
              description="Type of filament"
              name={"filamentType"}
              value={filamentType}
              onValueChange={(value) => setFilamentType(value as FilamentType)}
              validate={required("Filament type")}
            />
            <FieldSelect
              key={filamentType}
              options={FILAMENT_PRICE_OPTIONS[filamentType]}
              label={"Filament Pricing per kg"}
              placeholder={"Select Filament Pricing"}
              description="Cost per kg of filament"
              name={"filamentPrice"}
              validate={required("Filament pricing")}
            />
            <div className="flex gap-4">
              <FieldInput
                label={"Print Time (Hours)"}
                placeholder={"Enter Hours"}
                name={"printTimeHours"}
                validate={requiredNumber("Hours")}
              />
              <FieldInput
                label={"Print Time (Minutes)"}
                placeholder={"Enter Minutes"}
                name={"printTimeMinutes"}
                validate={requiredNumber("Minutes")}
              />
            </div>
            <FieldInput
              label={"Print Weight"}
              placeholder={"Enter Print Weight"}
              description="Weight in grams"
              name={"printWeight"}
              validate={requiredNumber("Print weight")}
            />
          </Form>
        </Card>
      </div>
    </Layout>
  );
}

export default App;
