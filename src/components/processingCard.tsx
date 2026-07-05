import { FieldInput } from "./fieldInput";
import { Form } from "./form";
import { optionalNumber, requiredNumber } from "@/lib/validators";
import type { ProcessingInputs } from "@/types";

export function ProcessingFields({
  processing,
  onChange,
}: {
  processing: ProcessingInputs;
  onChange: (processing: ProcessingInputs) => void;
}) {
  const updateWork = <K extends keyof ProcessingInputs>(
    field: K,
    value: ProcessingInputs[K],
  ) => onChange({ ...processing, [field]: value });

  return (
    <Form orientation="vertical" className="max-w-md">
        <FieldInput
          label={"3D Processing"}
          placeholder={"Enter Minutes"}
          description="Time in minutes"
          name={"processingMinutes"}
          value={processing.processingMinutes}
          onChange={(value) => updateWork("processingMinutes", value)}
          validate={requiredNumber("3D processing time")}
        />
        <div className="flex gap-4">
          <FieldInput
            label={"Post Processing (Hours)"}
            placeholder={"Enter Hours"}
            name={"postProcessingHours"}
            value={processing.postProcessingHours}
            onChange={(value) => updateWork("postProcessingHours", value)}
            validate={optionalNumber("Hours")}
          />
          <FieldInput
            label={"Post Processing (Minutes)"}
            placeholder={"Enter Minutes"}
            name={"postProcessingMinutes"}
            value={processing.postProcessingMinutes}
            onChange={(value) => updateWork("postProcessingMinutes", value)}
            validate={optionalNumber("Minutes")}
          />
        </div>
        <FieldInput
          label={"Parts Cost"}
          placeholder={"Enter Parts Cost"}
          description="Cost in rupees"
          name={"partsCost"}
          value={processing.partsCost}
          onChange={(value) => updateWork("partsCost", value)}
          validate={optionalNumber("Parts cost")}
        />
    </Form>
  );
}
