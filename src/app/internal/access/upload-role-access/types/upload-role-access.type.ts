import { HttpResponseBody } from "@app/core/http/client";
import { PaginationResponse, RecordType } from "@app/shared/components/data-table/types/pagination-response";

export interface UploadedRoleAccess extends Record<string, RecordType> {
  id: number;
  moduleName: string;
  status: string;
  description?: string;
}


export type PaginationUploadedRoleAccess = PaginationResponse<UploadedRoleAccess>;
export type UploadedRoleAccessPaginationResponse = HttpResponseBody<PaginationUploadedRoleAccess>;