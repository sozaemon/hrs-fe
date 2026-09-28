

export type FieldType = "text" | "email" | "password" | "number" |
  "select" | "checkbox" | "radio" | "date" | "file";

export type FormSize = "small" | "large" | "default";

export interface FieldOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  email?: boolean;
  custom?: (_: any) => string | null;
}

export interface FormField {
  key: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  value?: any;
  options?: FieldOption[];
  validation?: FieldValidation;
  disabled?: boolean;
  className?: string;
  order?: number;
}

export interface FormConfig {
  fields: FormField[];
  columns?: number;
  formSize?: FormSize;
}