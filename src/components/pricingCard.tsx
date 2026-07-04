import { useState } from "react";
import { FieldInput } from "./fieldInput";
import { Card } from "./card";
import { Form } from "./form";
import { Separator } from "./ui/separator";
import { requiredNumber } from "@/lib/validators";
import {
  computePlateCost,
  formatRs,
  num,
  type PlateInputs,
  type ProcessingInputs,
  type Settings,
} from "@/lib/pricing";

export function PricingCard({
  settings,
  plate,
  processing,
}: {
  settings: Settings;
  plate: PlateInputs;
  processing: ProcessingInputs;
}) {
  const [shipping, setShipping] = useState("");

  const { plateCost } = computePlateCost(settings, plate);

  const processingHours =
    num(processing.processingMinutes) / 60 +
    num(processing.postProcessingHours) +
    num(processing.postProcessingMinutes) / 60;

  const wageCost = Math.ceil(processingHours * num(settings.labourRate));
  const printCost = plateCost;
  const lastPrice = wageCost + printCost;
  const finalCost = Math.ceil((lastPrice * num(settings.markup)) / 100);
  const tax = Math.ceil((finalCost * num(settings.taxPercent)) / 100);
  const finalPriceIncShipping = Math.ceil(finalCost + tax + num(shipping));

  const lines = [
    { label: "Wage Cost", value: wageCost },
    { label: "Total Print Cost", value: printCost },
    { label: "Last Price", value: lastPrice },
    { label: "Final Cost", value: finalCost },
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
            value={shipping}
            onChange={setShipping}
            validate={requiredNumber("Shipping and handling cost")}
          />
        </Form>

        <Separator className="bg-white" />

        <div className="flex items-center justify-between gap-8 text-base font-semibold text-gray-50">
          <span>Final Price Inc Shipping</span>
          <span className="tabular-nums">
            {formatRs(finalPriceIncShipping)}
          </span>
        </div>
      </div>
    </Card>
  );
}
