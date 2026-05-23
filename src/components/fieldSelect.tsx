import { Field, FieldDescription, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
}) => {
  const { name, options, label, description, placeholder } = params;
  return (
    <Field className="text-gray-50">
      <FieldLabel>{label}</FieldLabel>
      <Select name={name}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && (
        <FieldDescription className="text-gray-50">
          {description}
        </FieldDescription>
      )}
    </Field>
  );
};

export default FieldSelect;
