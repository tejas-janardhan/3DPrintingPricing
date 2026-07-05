import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Settings2 } from "lucide-react";
import { CustomerFields } from "@/components/customerFields";
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

export function QuoteFormPage() {
  const { id } = useParams<{ id: string }>();
  const { data, updateQuotation } = useAppState();

  const quotation = data.quotations.find((q) => q.id === id);

  if (!quotation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Quotation not found
          </CardTitle>
          <CardDescription>
            This quotation doesn't exist or has been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft />
              Back to quotations
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const settingsReady = isGlobalSettingsComplete(data.settings);

  const { finalPriceIncShipping } = computeFinalPricing({
    settings: data.settings,
    processing: quotation.processing,
    plates: quotation.plates,
    pricing: quotation.pricing,
  });

  return (
    <Card>
      <CardHeader className="border-b pb-6">
        <div className="mb-1">
          <Button asChild variant="ghost" size="sm" className="-ml-2 h-8 px-2">
            <Link to="/">
              <ArrowLeft />
              Quotations
            </Link>
          </Button>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          {quotation.customer.name.trim() || "New quotation"}
        </CardTitle>
        <CardDescription>
          Customer details and the quote for this job.
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
        <CardSection
          title="Customer"
          description="Who this quotation is for."
        >
          <CustomerFields
            customer={quotation.customer}
            onChange={(customer) => updateQuotation(quotation.id, { customer })}
          />
        </CardSection>

        <Separator />

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
              plates={quotation.plates}
              onChange={(plates) => updateQuotation(quotation.id, { plates })}
            />
          </CardSection>

          <Separator />

          <CardSection
            title="Pre & Post Processing"
            description="Labour and parts added on top of printing."
          >
            <ProcessingFields
              processing={quotation.processing}
              onChange={(processing) =>
                updateQuotation(quotation.id, { processing })
              }
            />
          </CardSection>

          <Separator />

          <CardSection
            title="Pricing"
            description="Markup, shipping, and your final quote."
          >
            <PricingFields
              settings={data.settings}
              plates={quotation.plates}
              processing={quotation.processing}
              pricing={quotation.pricing}
              onChange={(pricing) => updateQuotation(quotation.id, { pricing })}
            />
          </CardSection>
        </div>
      </CardContent>
    </Card>
  );
}
