import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function FieldInput(props: {
  name: string;
  label: string;
  description?: string;
  placeholder: string;
}) {
  const { name, label, description, placeholder } = props;
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input name={name} type="text" placeholder={placeholder} />
      <FieldDescription>
        Choose a unique username for your account.
      </FieldDescription>
    </Field>
  );
}
