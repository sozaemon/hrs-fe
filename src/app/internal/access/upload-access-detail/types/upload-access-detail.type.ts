import { HttpResponseBody } from "@app/core/http/client";
import { PaginationResponse, RecordType } from "@app/shared/components/data-table/types/pagination-response";

export type UploadStatus = "UPLOADED" | "REVALIDATE" | "VALID" | "NOTVALID" | "COMPLETED";

export interface UploadAccessDetail extends Record<string, RecordType> {
  id: number;
  name: string;
  path: string;
  method: string;
  description?: string;
  roles: string;
  uploadStatus: UploadStatus;
  errorMessage?: string;
  uploadHeaderId?: number;
}


export interface UpdateUploadAccessDetailRequest {
  id: number;
  name: string;
  path: string;
  method: string;
  description?: string;
  roles: string;
}

export type PaginationUploadAccessDetail = PaginationResponse<UploadAccessDetail>;
export type UploadAccessDetailPaginationResponse = HttpResponseBody<PaginationUploadAccessDetail>;
