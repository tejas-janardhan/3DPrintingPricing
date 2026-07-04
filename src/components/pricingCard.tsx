import { Info } from "lucide-react";
import { FieldInput } from "./fieldInput";
import { Form } from "./form";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { requiredNumber } from "@/lib/validators";
import { computeFinalPricing, formatRs } from "@/lib/pricing";
import type {
  PlateInputs,
  PricingInputs,
  ProcessingInputs,
  Settings,
} from "@/types";

export function PricingFields({
  settings,
  plates,
  processing,
  pricing,
  onChange,
}: {
  settings: Settings;
  plates: PlateInputs[];
  processing: ProcessingInputs;
  pricing: PricingInputs;
  onChange: (pricing: PricingInputs) => void;
}) {
  const {
    wageCost,
    printCost,
    lastPrice,
    finalCost,
    tax,
    finalPriceIncShipping,
  } = computeFinalPricing({ settings, processing, plates, pricing });

  const linesBeforeMarkup = [
    { label: "Wage Cost", value: wageCost },
    { label: "Total Print Cost", value: printCost },
    { label: "Last Price", value: lastPrice },
  ];

  const linesAfterMarkup = [
    { label: "Final Price", value: finalCost },
    { label: "Tax", value: tax },
  ];

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {linesBeforeMarkup.map((line) => (
            <div
              key={line.label}
              className="flex items-center justify-between gap-8"
            >
              <span>{line.label}</span>
              <span className="tabular-nums">{formatRs(line.value)}</span>
            </div>
          ))}
        </div>
        <Form orientation="vertical">
          <FieldInput
            label={"Markup"}
            placeholder={"Enter Markup"}
            description="Markup percentage"
            name={"markup"}
            value={pricing.markup}
            onChange={(value) => onChange({ ...pricing, markup: value })}
            validate={requiredNumber("Markup")}
          />
        </Form>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {linesAfterMarkup.map((line) => (
            <div
              key={line.label}
              className="flex items-center justify-between gap-8"
            >
              <span>{line.label}</span>
              <span className="tabular-nums">{formatRs(line.value)}</span>
            </div>
          ))}
        </div>
        <Form orientation="vertical">
          <FieldInput
            label={"Shipping And Handling Cost"}
            placeholder={"Enter Shipping And Handling Cost"}
            description="Cost in rupees"
            name={"shipping"}
            value={pricing.shipping}
            onChange={(value) => onChange({ ...pricing, shipping: value })}
            validate={requiredNumber("Shipping and handling cost")}
          />
        </Form>
        <Separator />
        <div className="flex items-center justify-between gap-8 text-base font-semibold">
          <span className="flex items-center gap-1.5">
            Final Price Inc Shipping
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Final price info"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Info className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Price is rounded up to the nearest 10.
              </TooltipContent>
            </Tooltip>
          </span>
          <span className="tabular-nums">
            {formatRs(finalPriceIncShipping)}
          </span>
        </div>
    </div>
  );
}
