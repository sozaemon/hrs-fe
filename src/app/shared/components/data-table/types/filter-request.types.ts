export type LogicalOperator = "EQ" | "LIKE" | "LT" | "GT" | "NOT" | "NOTIN"
  | "IN" | "NOTNULL" | "NEQ" | "BETWEEN";

export type JoinOperator = "AND" | "OR";

export type ValidValue = string | number;
export type ValidValues = ValidValue[];

// for input time will be formatted to time strings 
export interface FilterRequest {
  label: string;
  fieldName: string;
  value?: ValidValue;
  timeValue?: string
  values?: ValidValues;
  timeValues?: string[];
  operator: LogicalOperator;
  joinOperator: JoinOperator;
}

export interface FilterOption {
  fieldType: "string" | "date" | "number";
  filterValueOptions?: string[];
}