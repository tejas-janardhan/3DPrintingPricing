import { FieldInput } from "./fieldInput";
import { Form } from "./form";
import { CardSection } from "./section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { requiredNumber } from "@/lib/validators";
import { formatRs } from "@/lib/pricing";
import type { PrinterCostInputs } from "@/types";

const toNumber = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export function PrinterCostCard({
  inputs,
  onChange,
}: {
  inputs: PrinterCostInputs;
  onChange: (inputs: PrinterCostInputs) => void;
}) {
  const update = (field: keyof PrinterCostInputs, value: string) =>
    onChange({ ...inputs, [field]: value });

  const totalCost = toNumber(inputs.printerCost) + toNumber(inputs.additionalCost);
  const totalMonths = toNumber(inputs.years) * 12 + toNumber(inputs.months);
  const totalHours = totalMonths * toNumber(inputs.hoursPerMonth);
  const costPerHour = totalHours > 0 ? totalCost / totalHours : 0;

  const summary = [
    { label: "Total Cost", value: formatRs(totalCost) },
    { label: "Total Months", value: totalMonths },
    { label: "Total Hours", value: totalHours },
  ];

  return (
    <Card>
      <CardHeader className="border-b pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Cost of Printer per Hour Estimate
        </CardTitle>
        <CardDescription>
          Estimate the hourly cost of your printer to recoup its costs.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <CardSection
          title="Costs"
          description="What the printer and setup cost you."
        >
          <Form orientation="horizontal" className="flex-wrap">
            <FieldInput
              label={"Cost of Printer"}
              placeholder={"Enter cost of printer"}
              description="Purchase cost in rupees"
              name={"printerCost"}
              value={inputs.printerCost}
              onChange={(value) => update("printerCost", value)}
              validate={requiredNumber("Cost of printer")}
              className="w-48"
            />
            <FieldInput
              label={"Additional Cost"}
              placeholder={"Enter additional cost"}
              description="Setup, accessories, etc."
              name={"additionalCost"}
              value={inputs.additionalCost}
              onChange={(value) => update("additionalCost", value)}
              validate={requiredNumber("Additional cost")}
              className="w-48"
            />
          </Form>
        </CardSection>

        <Separator />

        <CardSection
          title="Usage"
          description="How much you'll run it over the recoup period."
        >
          <Form orientation="horizontal" className="flex-wrap items-end">
            <FieldInput
              label={"Hourly Usage per Month"}
              placeholder={"Enter hours per month"}
              description="Estimated hours used each month"
              name={"hoursPerMonth"}
              value={inputs.hoursPerMonth}
              onChange={(value) => update("hoursPerMonth", value)}
              validate={requiredNumber("Hourly usage per month")}
              className="w-56"
            />
            <div className="flex items-center gap-4">
              <FieldInput
                label={"Years"}
                placeholder={"Years"}
                description="Recoup period"
                name={"years"}
                value={inputs.years}
                onChange={(value) => update("years", value)}
                validate={requiredNumber("Years")}
                className="w-28"
              />
              <div className="text-sm pt-2 self-stretch flex items-center text-muted-foreground">and</div>
              <FieldInput
                label={"Months"}
                placeholder={"Months"}
                description="Recoup period"
                name={"months"}
                value={inputs.months}
                onChange={(value) => update("months", value)}
                validate={requiredNumber("Months")}
                className="w-28"
              />
            </div>
          </Form>
        </CardSection>
        <Separator />
        <CardSection title="Estimate" description="Your resulting hourly cost.">
          <div className="flex w-full max-w-md flex-col gap-6">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              {summary.map((line) => (
                <div
                  key={line.label}
                  className="flex items-center justify-between gap-8"
                >
                  <span>{line.label}</span>
                  <span className="tabular-nums">{line.value}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-8 text-base font-semibold">
              <span>Cost per Hour</span>
              <span className="tabular-nums">{formatRs(costPerHour)}</span>
            </div>
          </div>
        </CardSection>
      </CardContent>
    </Card>
  );
}
