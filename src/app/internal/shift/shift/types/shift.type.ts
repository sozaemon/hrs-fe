import { HttpResponseBody } from "@app/core/http/client";
import { PaginationResponse, RecordType } from "@app/shared/components/data-table/types/pagination-response";

export interface Shift extends Record<string, RecordType> {
  id: number;
  code: string;
  shiftName: string;
  shiftTypeId: number;
  shiftTypeName: string;
  inTime?: Date,
  outTime?: Date,
  inToleranceId?: number;
  inToleranceName?: string;
  outToleranceId?: number;
  outToleranceName?: string;
}

export type PaginationShift = PaginationResponse<Shift>;
export type ShiftPaginationResponse = HttpResponseBody<PaginationShift>;
export type ShiftResponse = HttpResponseBody<Shift>;