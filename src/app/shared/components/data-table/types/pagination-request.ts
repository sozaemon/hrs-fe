import { FilterRequest } from "./filter-request.types";

export type SortDirection = "ASC" | "DESC";

export interface PaginationRequest {
  page: number;
  pageSize: number;
  filter: FilterRequest[];
  sortBy?: string;
  sortDirection?: SortDirection;
}
