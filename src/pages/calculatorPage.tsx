import { SettingsCard } from "@/components/settingsCard";
import { PlateCard } from "@/components/plateCard";
import { ProcessingCard } from "@/components/processingCard";
import { PricingCard } from "@/components/pricingCard";
import { useAppState } from "@/store/appStateContext";

export function CalculatorPage() {
  const { data, setSettings, setPlate, setProcessing, setPricing } =
    useAppState();

  return (
    <div className="flex flex-col gap-4">
      <SettingsCard settings={data.settings} onChange={setSettings} />
      <PlateCard
        settings={data.settings}
        plate={data.plate}
        onChange={setPlate}
      />
      <ProcessingCard processing={data.processing} onChange={setProcessing} />
      <PricingCard
        settings={data.settings}
        plate={data.plate}
        processing={data.processing}
        pricing={data.pricing}
        onChange={setPricing}
      />
    </div>
  );
}
