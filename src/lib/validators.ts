export type Validator = (value: string) => string | undefined;

export const required =
  (label: string): Validator =>
  (value) =>
    value.trim() === "" ? `${label} is required` : undefined;

export const requiredNumber =
  (label: string): Validator =>
  (value) => {
    if (value.trim() === "") return `${label} is required`;
    const n = Number(value);
    if (Number.isNaN(n)) return `${label} must be a number`;
    if (n < 0) return `${label} cannot be negative`;
    return undefined;
  };
