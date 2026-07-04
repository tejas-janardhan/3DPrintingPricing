import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
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
  showError?: boolean;
  disabled?: boolean;
}) => {
  const {
    name,
    options,
    label,
    description,
    placeholder,
    value,
    onValueChange,
    validate,
    showError,
    disabled,
  } = params;
  const [selected, setSelected] = useState<string>();
  const [touched, setTouched] = useState(false);
  const current = value ?? selected;
  const error =
    (touched || showError) && validate ? validate(current ?? "") : undefined;

  const handleChange = (next: string) => {
    setSelected(next);
    setTouched(true);
    onValueChange?.(next);
  };

  return (
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-col gap-1">
        <Select
          name={name}
          value={value}
          onValueChange={handleChange}
          disabled={disabled}
        >
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
          <FieldError className="text-xs">{error}</FieldError>
        ) : (
          description && (
            <FieldDescription className="text-xs">
              {description}
            </FieldDescription>
          )
        )}
      </div>
    </Field>
  );
};

export default FieldSelect;
