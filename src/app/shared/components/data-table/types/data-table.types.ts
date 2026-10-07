import { NzTableFilterValue } from "ng-zorro-antd/table";
import { FilterOption, FilterRequest } from "./filter-request.types";

export interface ColumnDefinition<T> {
  field: keyof T & string;
  header: string;
  allowSort?: boolean;
  allowFilter?: boolean;
  // filterMultiple?: boolean;
  columnFn?: (_: T) => string;
  filterOptions?: FilterOption;
}

export interface ColumnAction {
  name: string;
  icon?: string;
  label?: string;
  class?: string;
}

export interface RowAction<T> extends ColumnAction {
  row: T;
}

export type ColumnDefinitions<T> = ColumnDefinition<T>[];

export interface DataTableSort<T> {
  field: keyof T & string;
  order: "ASC" | "DESC"
}

export interface DataTableFilter {
  field: string;
  values: NzTableFilterValue;
}

export interface DataTableQuery<T> {
  pageIndex: number;
  pageSize: number;
  sort?: DataTableSort<T>;
  filters?: FilterRequest[];
}