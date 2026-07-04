import { Link } from "react-router-dom";
import { Settings2 } from "lucide-react";
import { PlatesSection } from "@/components/platesSection";
import { ProcessingCard } from "@/components/processingCard";
import { PricingCard } from "@/components/pricingCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { isGlobalSettingsComplete } from "@/lib/settings";
import { useAppState } from "@/store/appStateContext";

export function CalculatorPage() {
  const { data, setPlates, setProcessing, setPricing } = useAppState();

  const settingsReady = isGlobalSettingsComplete(data.settings);

  return (
    <div className="flex flex-col gap-4">
      {!settingsReady && (
        <Alert>
          <Settings2 />
          <AlertTitle>Finish setting up before you calculate</AlertTitle>
          <AlertDescription>
            <p>
              Your global operating and pricing settings aren't configured yet.
              Add them to start building quotes.
            </p>
            <Button asChild size="sm" className="mt-1">
              <Link to="/settings">Add settings</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div
        className={
          settingsReady
            ? "flex flex-col gap-4"
            : "pointer-events-none flex select-none flex-col gap-4 opacity-50"
        }
        aria-disabled={!settingsReady}
      >
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
    </div>
  );
}
