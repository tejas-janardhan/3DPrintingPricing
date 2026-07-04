import { Info } from "lucide-react";
import { FieldInput } from "./fieldInput";
import { Card } from "./card";
import { Form } from "./form";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { requiredNumber } from "@/lib/validators";
import {
  computeFinalPricing,
  formatRs,
  type PlateInputs,
  type PricingInputs,
  type ProcessingInputs,
  type Settings,
} from "@/lib/pricing";

export function PricingCard({
  settings,
  plate,
  processing,
  pricing,
  onChange,
}: {
  settings: Settings;
  plate: PlateInputs;
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
  } = computeFinalPricing({ settings, processing, plate, pricing });

  const lines = [
    { label: "Wage Cost", value: wageCost },
    { label: "Total Print Cost", value: printCost },
    { label: "Last Price", value: lastPrice },
    { label: "Final Price", value: finalCost },
    { label: "Tax", value: tax },
  ];

  return (
    <Card title="Pricing">
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2 text-sm text-gray-300">
          {lines.map((line) => (
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
        <Separator className="bg-white" />
        <div className="flex items-center justify-between gap-8 text-base font-semibold text-gray-50">
          <span className="flex items-center gap-1.5">
            Final Price Inc Shipping
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Final price info"
                  className="text-gray-50"
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
    </Card>
  );
}
