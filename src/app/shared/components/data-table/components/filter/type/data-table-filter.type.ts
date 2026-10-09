import { FilterOption } from "../../../types/filter-request.types";

export interface FilterDefinition {
  field: string;
  header: string;
  allowFilter: boolean;
  filterOptions?: FilterOption;
}


//export type FilterDefinitions = FilterDefinition[];