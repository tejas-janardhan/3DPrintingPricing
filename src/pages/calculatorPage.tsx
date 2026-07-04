import { Link } from "react-router-dom";
import { Settings2 } from "lucide-react";
import { PlatesSection } from "@/components/platesSection";
import { ProcessingFields } from "@/components/processingCard";
import { PricingFields } from "@/components/pricingCard";
import { CardSection } from "@/components/section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { computeFinalPricing, formatRs } from "@/lib/pricing";
import { isGlobalSettingsComplete } from "@/lib/settings";
import { useAppState } from "@/store/appStateContext";

export function CalculatorPage() {
  const { data, setPlates, setProcessing, setPricing } = useAppState();

  const settingsReady = isGlobalSettingsComplete(data.settings);

  const { finalPriceIncShipping } = computeFinalPricing({
    settings: data.settings,
    processing: data.processing,
    plates: data.plates,
    pricing: data.pricing,
  });

  return (
    <Card>
      <CardHeader className="border-b pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Calculator
        </CardTitle>
        <CardDescription>
          Build a quote from your plates, processing, and pricing.
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-0.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Final Price
          </span>
          <span className="text-2xl font-semibold tabular-nums text-primary">
            {formatRs(settingsReady ? finalPriceIncShipping : 0)}
          </span>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {!settingsReady && (
          <Alert>
            <Settings2 />
            <AlertTitle>Finish setting up before you calculate</AlertTitle>
            <AlertDescription>
              <p>
                Your global operating and pricing settings aren't configured
                yet. Add them to start building quotes.
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
              ? "flex flex-col gap-6"
              : "pointer-events-none flex select-none flex-col gap-6 opacity-50"
          }
          aria-disabled={!settingsReady}
        >
          <CardSection
            title="Plates"
            description="Add a plate for each print in the job."
          >
            <PlatesSection
              settings={data.settings}
              plates={data.plates}
              onChange={setPlates}
            />
          </CardSection>

          <Separator />

          <CardSection
            title="Pre & Post Processing"
            description="Labour and parts added on top of printing."
          >
            <ProcessingFields
              processing={data.processing}
              onChange={setProcessing}
            />
          </CardSection>

          <Separator />

          <CardSection
            title="Pricing"
            description="Markup, shipping, and your final quote."
          >
            <PricingFields
              settings={data.settings}
              plates={data.plates}
              processing={data.processing}
              pricing={data.pricing}
              onChange={setPricing}
            />
          </CardSection>
        </div>
      </CardContent>
    </Card>
  );
}
