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
  className?: string;
  showError?: boolean;
  /** Optional element rendered inline next to the label (e.g. a dismiss button). */
  labelAction?: React.ReactNode;
}) {
  const {
    name,
    label,
    description,
    placeholder,
    value,
    onChange,
    disabled,
    validate,
    className,
    showError,
    labelAction,
  } = props;
  const [internal, setInternal] = useState("");
  const [touched, setTouched] = useState(false);
  const current = value ?? internal;
  const error =
    (touched || showError) && validate ? validate(current) : undefined;

  const handleChange = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <Field className={className} data-invalid={error ? "true" : undefined}>
      {labelAction ? (
        <div className="flex w-fit items-center gap-1">
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {labelAction}
        </div>
      ) : (
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
      )}
      <div className="flex flex-col gap-1">
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
}
