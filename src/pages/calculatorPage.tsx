import { SettingsCard } from "@/components/settingsCard";
import { PlatesSection } from "@/components/platesSection";
import { ProcessingCard } from "@/components/processingCard";
import { PricingCard } from "@/components/pricingCard";
import { useAppState } from "@/store/appStateContext";

export function CalculatorPage() {
  const { data, setSettings, setPlates, setProcessing, setPricing } =
    useAppState();

  return (
    <div className="flex flex-col gap-4">
      <SettingsCard settings={data.settings} onChange={setSettings} />
      <PlatesSection
        settings={data.settings}
        plates={data.plates}
        onChange={setPlates}
      />
      <ProcessingCard processing={data.processing} onChange={setProcessing} />
      <PricingCard
        settings={data.settings}
        plates={data.plates}
        processing={data.processing}
        pricing={data.pricing}
        onChange={setPricing}
      />
    </div>
  );
}
