import { FieldInput } from "./fieldInput";
import { Form } from "./form";
import { required } from "@/lib/validators";
import type { Customer } from "@/types";

export function CustomerFields({
  customer,
  onChange,
}: {
  customer: Customer;
  onChange: (customer: Customer) => void;
}) {
  const update = <K extends keyof Customer>(field: K, value: Customer[K]) =>
    onChange({ ...customer, [field]: value });

  return (
    <Form orientation="vertical" className="max-w-md">
      <FieldInput
        label={"Name"}
        placeholder={"Enter customer name"}
        name={"customerName"}
        value={customer.name}
        onChange={(value) => update("name", value)}
        validate={required("Name")}
      />
      <FieldInput
        label={"Phone"}
        placeholder={"Enter phone number"}
        name={"customerPhone"}
        value={customer.phone}
        onChange={(value) => update("phone", value)}
        validate={required("Phone")}
      />
      <FieldInput
        label={"Address"}
        placeholder={"Enter address"}
        description="Optional"
        name={"customerAddress"}
        value={customer.address}
        onChange={(value) => update("address", value)}
      />
    </Form>
  );
}
