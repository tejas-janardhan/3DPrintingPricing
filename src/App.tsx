import { useState } from "react";
import { SettingsCard } from "./components/settingsCard";
import { PlateCard } from "./components/plateCard";
import { ProcessingCard } from "./components/processingCard";
import { PricingCard } from "./components/pricingCard";
import { Layout } from "./layout";
import {
  EMPTY_PLATE,
  EMPTY_PROCESSING,
  EMPTY_SETTINGS,
  type PlateInputs,
  type ProcessingInputs,
  type Settings,
} from "./lib/pricing";

function App() {
  // Shared state: the pricing card combines all of these
  const [settings, setSettings] = useState<Settings>(EMPTY_SETTINGS);
  const [plate, setPlate] = useState<PlateInputs>(EMPTY_PLATE);
  const [processing, setProcessing] =
    useState<ProcessingInputs>(EMPTY_PROCESSING);

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <SettingsCard settings={settings} onChange={setSettings} />
        <PlateCard settings={settings} plate={plate} onChange={setPlate} />
        <ProcessingCard processing={processing} onChange={setProcessing} />
        <PricingCard
          settings={settings}
          plate={plate}
          processing={processing}
        />
      </div>
    </Layout>
  );
}

export default App;
