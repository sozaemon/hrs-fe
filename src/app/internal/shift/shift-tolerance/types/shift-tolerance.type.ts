import { HttpResponseBody } from "@app/core/http/client";
import { PaginationResponse, RecordType } from "@app/shared/components/data-table/types/pagination-response";

export interface ShiftTolerance extends Record<string, RecordType> {
  id?: number;
  code: string;
  toleranceName: string;
  toleranceBeforeUnit: "HOUR" | "MINUTE",
  toleranceAfterUnit: "HOUR" | "MINUTE",
  toleranceBefore: number;
  toleranceAfter: number;
}

export type PaginationShiftTolerance = PaginationResponse<ShiftTolerance>;
export type ShiftTolerancePaginationResponse = HttpResponseBody<PaginationShiftTolerance>
export type ShiftToleranceResponse = HttpResponseBody<ShiftTolerance>;