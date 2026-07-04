import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Validator } from "@/lib/validators";

export function FieldInput(props: {
  name: string;
  label: string;
  description?: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  validate?: Validator;
}) {
  const { name, label, description, placeholder, value, onChange, disabled, validate } =
    props;
  const [internal, setInternal] = useState("");
  const [touched, setTouched] = useState(false);
  const current = value ?? internal;
  const error = touched && validate ? validate(current) : undefined;

  const handleChange = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        value={current}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {error ? (
        <FieldError>{error}</FieldError>
      ) : (
        description && <FieldDescription>{description}</FieldDescription>
      )}
    </Field>
  );
}
