import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Validator } from "@/lib/validators";

type Option = {
  value: string | number;
  label: string;
};

const FieldSelect = (params: {
  options: Option[];
  label: string;
  placeholder: string;
  description?: string;
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  validate?: Validator;
}) => {
  const { name, options, label, description, placeholder, value, onValueChange, validate } =
    params;
  const [selected, setSelected] = useState<string>();
  const [touched, setTouched] = useState(false);
  const current = value ?? selected;
  const error = touched && validate ? validate(current ?? "") : undefined;

  const handleChange = (next: string) => {
    setSelected(next);
    setTouched(true);
    onValueChange?.(next);
  };

  return (
    <Field className="text-gray-50" data-invalid={error ? "true" : undefined}>
      <FieldLabel>{label}</FieldLabel>
      <Select name={name} value={value} onValueChange={handleChange}>
        <SelectTrigger aria-invalid={error ? true : undefined}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <FieldError>{error}</FieldError>
      ) : (
        description && (
          <FieldDescription className="text-gray-50">
            {description}
          </FieldDescription>
        )
      )}
    </Field>
  );
};

export default FieldSelect;
