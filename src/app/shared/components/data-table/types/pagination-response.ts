export type RecordType = string | number | Date | undefined

export interface PaginationResponse<T extends Record<string, RecordType>> {
  data: T[];
  page: number;
  size: number;
  total: number;
}