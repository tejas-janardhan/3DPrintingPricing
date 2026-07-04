import { FieldInput } from "./fieldInput";
import { Card } from "./card";
import { Form } from "./form";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Cost of Printer per Hour Estimate
        </h1>
        <p className="text-sm text-muted-foreground">
          Estimate the hourly cost of your printer to recoup its costs.
        </p>
      </div>

      <Card title="Costs">
        <Form orientation="horizontal">
          <FieldInput
            label={"Cost of Printer"}
            placeholder={"Enter cost of printer"}
            description="Purchase cost in rupees"
            name={"printerCost"}
            value={inputs.printerCost}
            onChange={(value) => update("printerCost", value)}
            validate={requiredNumber("Cost of printer")}
            className="basis-[120%]"
          />
          <FieldInput
            label={"Additional Cost"}
            placeholder={"Enter additional cost"}
            description="Setup, accessories, etc."
            name={"additionalCost"}
            value={inputs.additionalCost}
            onChange={(value) => update("additionalCost", value)}
            validate={requiredNumber("Additional cost")}
            className="basis-[120%]"
          />
        </Form>
      </Card>

      <Card title="Usage">
        <Form orientation="horizontal">
          <FieldInput
            label={"Hourly Usage per Month"}
            placeholder={"Enter hours per month"}
            description="Estimated hours used each month"
            name={"hoursPerMonth"}
            value={inputs.hoursPerMonth}
            onChange={(value) => update("hoursPerMonth", value)}
            validate={requiredNumber("Hourly usage per month")}
            className="basis-[160%]"
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
            />
            <span className="pt-6 text-sm text-muted-foreground">and</span>
            <FieldInput
              label={"Months"}
              placeholder={"Months"}
              description="Recoup period"
              name={"months"}
              value={inputs.months}
              onChange={(value) => update("months", value)}
              validate={requiredNumber("Months")}
            />
          </div>
        </Form>
      </Card>

      <Card title="Estimate">
        <div className="flex w-full flex-col gap-6">
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
      </Card>
    </div>
  );
}
