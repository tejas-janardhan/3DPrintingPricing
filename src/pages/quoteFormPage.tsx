import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Check, ChevronsDownUp, Settings2 } from "lucide-react";
import { CustomerFields } from "@/components/customerFields";
import { PlatesSection } from "@/components/platesSection";
import { ProcessingFields } from "@/components/processingCard";
import { PricingFields } from "@/components/pricingCard";
import { CardSection } from "@/components/section";
import { QuoteNotFound } from "@/components/quoteNotFound";
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
import { areSettingsEqual, isGlobalSettingsComplete } from "@/lib/settings";
import { useAppState } from "@/store/appStateContext";

export function QuoteFormPage() {
  const { id } = useParams<{ id: string }>();
  const { data, updateQuotation } = useAppState();
  const [openSections, setOpenSections] = useState({
    customer: true,
    plates: true,
    processing: true,
    pricing: true,
  });

  const anyOpen = Object.values(openSections).some(Boolean);
  const toggleAll = () => {
    const next = !anyOpen;
    setOpenSections({
      customer: next,
      plates: next,
      processing: next,
      pricing: next,
    });
  };
  const setSection = (key: keyof typeof openSections) => (open: boolean) =>
    setOpenSections((sections) => ({ ...sections, [key]: open }));

  const quotation = data.quotations.find((q) => q.id === id);
  if (!quotation) return <QuoteNotFound />;

  // A locked (outdated) quote can only be viewed/duplicated — send edits to detail.
  if (!areSettingsEqual(quotation.settings, data.settings)) {
    return <Navigate to={`/quote/${quotation.id}`} replace />;
  }

  const settingsReady = isGlobalSettingsComplete(data.settings);
  const { finalPriceIncShipping, rsPerGram } = computeFinalPricing({
    settings: quotation.settings,
    processing: quotation.processing,
    plates: quotation.plates,
    pricing: quotation.pricing,
  });

  return (
    <Card>
      <CardHeader className="border-b pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight w-1/2">
          <input
            type="text"
            aria-label="Quote name"
            value={quotation.name}
            onChange={(event) =>
              updateQuotation(quotation.id, { name: event.target.value })
            }
            placeholder={quotation.customer.name.trim() || "New quotation"}
            className="w-full min-w-0 border-b border-transparent bg-transparent outline-none transition-colors placeholder:text-muted-foreground hover:border-border focus:border-ring"
          />
        </CardTitle>
        <CardDescription>
          Name this quote, then fill in the details for the job.
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-0.5">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Final Price
          </span>
          <span className="text-2xl font-semibold tabular-nums text-primary">
            {formatRs(settingsReady ? finalPriceIncShipping : 0)}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {formatRs(settingsReady ? rsPerGram : 0)} /g
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/quote/${quotation.id}`}>
              <Check />
              Done
            </Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={toggleAll}>
            <ChevronsDownUp />
            {anyOpen ? "Collapse all" : "Expand all"}
          </Button>
        </div>
        <CardSection
          title="Customer"
          description="Who this quotation is for."
          collapsible
          padded
          open={openSections.customer}
          onOpenChange={setSection("customer")}
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
            collapsible
            open={openSections.plates}
            onOpenChange={setSection("plates")}
          >
            <PlatesSection
              settings={quotation.settings}
              plates={quotation.plates}
              onChange={(plates) => updateQuotation(quotation.id, { plates })}
            />
          </CardSection>

          <Separator />

          <CardSection
            title="Pre & Post Processing"
            description="Labour and parts added on top of printing."
            collapsible
            padded
            open={openSections.processing}
            onOpenChange={setSection("processing")}
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
            collapsible
            padded
            open={openSections.pricing}
            onOpenChange={setSection("pricing")}
          >
            <PricingFields
              settings={quotation.settings}
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
