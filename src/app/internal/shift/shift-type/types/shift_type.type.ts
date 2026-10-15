
import { HttpResponseBody } from "@app/core/http/client";
import { PaginationResponse, RecordType } from "@app/shared/components/data-table/types/pagination-response";

export interface ShiftType extends Record<string, RecordType> {
  id?: number;
  code: string;
  name: string;
}

export type PaginationShiftType = PaginationResponse<ShiftType>;
export type ShiftTypePaginationResponse = HttpResponseBody<PaginationShiftType>;
export type ShiftTypeResponse = HttpResponseBody<ShiftType>;